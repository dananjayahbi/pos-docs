# Tasks 57-62: Department Service - CRUD and Tree Operations

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 02 - Department & Designations  
> **Group:** E - Services & Business Logic  
> **Document:** 01 of 02  
> **Tasks Covered:** 57, 58, 59, 60, 61, 62

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-63-68_Designation-Service-Search.md](02_Tasks-63-68_Designation-Service-Search.md)

---

## Document Overview

This document covers the implementation of the DepartmentService class, which provides the business logic layer for department operations. This service handles department creation, updates, archival, movement within the organizational tree, and merging of departments with complete validation and transaction management.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 57 | Create DepartmentService Class | High | 30 min |
| 58 | Implement Create Department | Medium | 25 min |
| 59 | Implement Update Department | Medium | 25 min |
| 60 | Implement Archive Department | High | 30 min |
| 61 | Implement Move Department | High | 30 min |
| 62 | Implement Merge Departments | High | 35 min |

---

## Task 57: Create DepartmentService Class

### Overview
Create the DepartmentService class that serves as the centralized business logic layer for all department operations. This service encapsulates complex operations, ensures data integrity through transactions, and provides a clean interface for department management.

### Dependencies
- Department model exists (Group B)
- DepartmentHead model exists (Group C)
- DepartmentMember model exists (Group C)
- Django transaction support configured
- Cache framework configured

### Instructions

1. **Create service module file**
   - Create file at `apps/organization/services/department_service.py`
   - Import necessary Django and model components

2. **Import required modules**
   - Import Django transaction module
   - Import Django cache framework
   - Import Department, DepartmentHead, DepartmentMember models
   - Import Employee model
   - Import Django exceptions (ValidationError, ObjectDoesNotExist)
   - Import timezone utilities
   - Import Q objects for complex queries

3. **Define DepartmentService class**
   - Create class-based service (can be instantiated or use class methods)
   - Add comprehensive class docstring
   - Explain service purpose and responsibilities

4. **Add initialization method**
   - Accept optional tenant parameter
   - Store tenant reference for multi-tenant operations
   - Allow tenant-scoped operations

5. **Define core method signatures**
   - create(data, user) - Create new department
   - update(department_id, data, user) - Update existing department
   - archive(department_id, reassign_to, user) - Archive department
   - activate(department_id, user) - Reactivate archived department
   - move(department_id, new_parent_id, user) - Move in tree
   - merge(source_id, target_id, user) - Merge departments
   - search(query, filters) - Search departments
   - get_children(department_id) - Get child departments
   - get_employees(department_id) - Get department employees

6. **Add private helper methods**
   - _validate_department_data(data) - Validate department input
   - _generate_department_code(name) - Generate unique code
   - _invalidate_cache() - Clear org chart cache
   - _check_circular_reference(dept_id, parent_id) - Prevent loops
   - _can_archive(department) - Check archive eligibility

7. **Add cache key constants**
   - Define cache key patterns for org chart
   - Set cache timeout constants
   - Document cache invalidation strategy

8. **Update services/__init__.py**
   - Import DepartmentService
   - Add to __all__ list for easy importing

### DepartmentService Architecture

```
┌─────────────────────────────────────────────────────────┐
│              DepartmentService Class                    │
├─────────────────────────────────────────────────────────┤
│ Public Methods:                                         │
│  • create(data, user)                                   │
│  • update(department_id, data, user)                    │
│  • archive(department_id, reassign_to, user)            │
│  • activate(department_id, user)                        │
│  • move(department_id, new_parent_id, user)             │
│  • merge(source_id, target_id, user)                    │
│  • search(query, filters)                               │
│  • get_children(department_id)                          │
│  • get_employees(department_id)                         │
│                                                         │
│ Private Methods:                                        │
│  • _validate_department_data(data)                      │
│  • _generate_department_code(name)                      │
│  • _invalidate_cache()                                  │
│  • _check_circular_reference(dept_id, parent_id)        │
│  • _can_archive(department)                             │
└─────────────────────────────────────────────────────────┘
```

### Service Layer Benefits

| Benefit | Description |
|---------|-------------|
| Encapsulation | Business logic separated from views/serializers |
| Reusability | Same logic used by API, admin, and background tasks |
| Transaction Safety | Atomic operations with automatic rollback |
| Cache Management | Centralized cache invalidation |
| Validation | Consistent validation across all entry points |
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
│ DepartmentService    │
│                      │
│ • Validates input    │
│ • Begins transaction │
│ • Performs operation │
│ • Updates related    │
│ • Invalidates cache  │
│ • Commits            │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│   Database           │
│ • Department         │
│ • DepartmentHead     │
│ • DepartmentMember   │
└──────────────────────┘
```

### Transaction Management Strategy

```
Transaction Boundaries
══════════════════════

Each service method wraps operations in transaction:

@transaction.atomic
def create(data, user):
    # All operations succeed or all rollback
    department = Department.objects.create(...)
    if manager:
        DepartmentHead.objects.create(...)
    cache.delete(...)
    return department

Benefits:
✓ Data consistency
✓ Automatic rollback on error
✓ Clean error handling
```

### Cache Key Structure

| Cache Key Pattern | Purpose | Example |
|------------------|---------|---------|
| `org_chart_{tenant_id}` | Full org chart | `org_chart_123` |
| `dept_children_{dept_id}` | Department children | `dept_children_456` |
| `dept_employees_{dept_id}` | Department employees | `dept_employees_456` |
| `dept_hierarchy_{dept_id}` | Department path | `dept_hierarchy_456` |

### Expected Outcome
- Centralized DepartmentService class
- Clean service interface
- Transaction-wrapped operations
- Cache management infrastructure
- Foundation for all department operations

### Verification Checklist
- [ ] department_service.py file created
- [ ] DepartmentService class defined
- [ ] All public method signatures created
- [ ] Private helper methods defined
- [ ] Cache key constants defined
- [ ] Class docstring comprehensive
- [ ] Service imported in __init__.py

---

## Task 58: Implement Create Department

### Overview
Implement the create method in DepartmentService that handles new department creation with complete validation, code generation, manager assignment, and cache invalidation.

### Dependencies
- Task 57: Create DepartmentService class
- Department model with MPPT support
- Employee model exists
- Code generation utility available

### Instructions

1. **Define create method signature**
   - Accept data dictionary with department fields
   - Accept user parameter for audit trail
   - Return created Department instance

2. **Implement input validation**
   - Validate required fields (name)
   - Validate parent department exists (if provided)
   - Validate manager is active employee (if provided)
   - Validate name length and format
   - Check for duplicate names in same parent

3. **Implement code generation**
   - Check if code provided in data
   - If not, generate from name (e.g., "Sales" → "DEPT-SALES")
   - Ensure code is unique within tenant
   - Handle code collisions with numeric suffix

4. **Wrap in transaction**
   - Use @transaction.atomic decorator
   - Ensure all operations are atomic
   - Automatic rollback on any error

5. **Create department record**
   - Extract validated data
   - Set tenant from user context
   - Set created_by to user
   - Set initial status to ACTIVE
   - Use Department.objects.create()

6. **Handle parent department**
   - If parent_id provided, validate it exists
   - Set parent relationship
   - MPTT automatically handles tree structure

7. **Create department head record**
   - If manager provided in data
   - Create DepartmentHead instance
   - Link to department and employee
   - Set start_date to current date
   - Set is_current to True

8. **Invalidate caches**
   - Call _invalidate_cache() helper
   - Clear org chart cache for tenant
   - Clear parent department's children cache

9. **Return created department**
   - Return fully created Department instance
   - Include all related data loaded

### Create Department Flow

```
┌────────────────────────────────────────────────────┐
│          Create Department Process                 │
└────────────────────────────────────────────────────┘

1. Validate Input
   ├─ Name required?
   ├─ Parent exists?
   ├─ Manager is active?
   └─ No duplicate name?

2. Generate Code
   ├─ Code provided?
   ├─ If not: "Sales" → "DEPT-SALES"
   └─ Ensure uniqueness

3. Begin Transaction
   │
   ├─ Create Department
   │  ├─ Set name
   │  ├─ Set code
   │  ├─ Set parent
   │  ├─ Set tenant
   │  └─ Set status = ACTIVE
   │
   ├─ Create DepartmentHead (if manager)
   │  ├─ Link to department
   │  ├─ Link to employee
   │  ├─ Set start_date = today
   │  └─ Set is_current = True
   │
   └─ Invalidate Cache
      ├─ Clear org chart
      └─ Clear parent children

4. Return Department
```

### Validation Rules

| Rule | Check | Error Message |
|------|-------|---------------|
| Name Required | name in data and name.strip() | "Department name is required" |
| Name Length | 3 <= len(name) <= 100 | "Name must be 3-100 characters" |
| Parent Exists | Department.objects.filter(id=parent_id).exists() | "Parent department not found" |
| Manager Active | Employee.objects.filter(id=manager_id, status='ACTIVE').exists() | "Manager must be active employee" |
| Unique Code | Not exists for tenant | "Department code already exists" |
| Duplicate Name | Not exists for same parent | "Department name already exists in parent" |

### Code Generation Algorithm

```
Input: "Sales Department"
Steps:
1. Extract keywords: "Sales"
2. Convert to uppercase: "SALES"
3. Add prefix: "DEPT-SALES"
4. Check uniqueness
   - If exists: "DEPT-SALES-2"
   - If exists: "DEPT-SALES-3"
   - Continue until unique
Output: "DEPT-SALES" or "DEPT-SALES-2"
```

### Example Data Structures

#### Input Data
```python
data = {
    'name': 'Sales Department',
    'code': None,  # Will be generated
    'parent_id': 123,  # ID of Operations dept
    'manager_id': 456,  # Employee ID
    'description': 'Handles all sales operations',
    'location': 'Colombo 03',
    'cost_center': 'CC-SALES',
}
```

#### Created Department
```python
department = {
    'id': 789,
    'name': 'Sales Department',
    'code': 'DEPT-SALES',
    'parent_id': 123,
    'status': 'ACTIVE',
    'tenant_id': 100,
    'created_by_id': user.id,
    'created_at': '2026-01-24T10:30:00Z',
}
```

#### Created DepartmentHead
```python
dept_head = {
    'id': 111,
    'department_id': 789,
    'employee_id': 456,
    'start_date': '2026-01-24',
    'is_current': True,
}
```

### Error Handling

| Error Type | Cause | Response |
|------------|-------|----------|
| ValidationError | Invalid input data | Return validation messages |
| ObjectDoesNotExist | Parent/Manager not found | Clear error message |
| IntegrityError | Duplicate code/constraint | User-friendly message |
| Exception | Unexpected error | Rollback transaction, log error |

### Transaction Rollback Scenarios

```
Scenario 1: Manager Not Found
├─ Department created ✓
├─ Manager lookup fails ✗
└─ Rollback: Department deleted

Scenario 2: Duplicate Code
├─ Code generation ✓
├─ Department.create() fails (unique constraint) ✗
└─ Rollback: Nothing persisted

Scenario 3: Cache Invalidation Error
├─ Department created ✓
├─ DepartmentHead created ✓
├─ Cache clear fails ✗
└─ Continue: Cache will expire naturally
```

### Expected Outcome
- Functional create method
- Complete validation
- Automatic code generation
- Manager assignment
- Cache invalidation
- Transaction safety

### Verification Checklist
- [ ] create method implemented
- [ ] Input validation complete
- [ ] Code generation logic implemented
- [ ] Transaction decorator applied
- [ ] Department creation works
- [ ] DepartmentHead creation conditional
- [ ] Cache invalidation implemented
- [ ] Error handling comprehensive

---

## Task 59: Implement Update Department

### Overview
Implement the update method in DepartmentService that handles department modifications including name changes, parent changes (with tree restructuring), manager changes, and other field updates.

### Dependencies
- Task 58: Implement Create Department
- Department model with MPTT
- DepartmentHead history tracking

### Instructions

1. **Define update method signature**
   - Accept department_id parameter
   - Accept data dictionary with fields to update
   - Accept user parameter for audit trail
   - Return updated Department instance

2. **Fetch department to update**
   - Query Department by ID and tenant
   - Raise ObjectDoesNotExist if not found
   - Select related parent and manager for efficiency

3. **Implement validation**
   - Validate new parent exists (if changing)
   - Prevent circular reference (dept becoming its own descendant)
   - Validate new manager is active employee (if changing)
   - Check new name uniqueness in parent (if changing)
   - Validate status transition if changing status

4. **Handle parent change**
   - Detect if parent_id is changing
   - If changing, validate new parent
   - Check for circular reference using _check_circular_reference()
   - MPTT will handle tree restructuring automatically

5. **Handle manager change**
   - Detect if manager_id is changing
   - If changing manager:
     - Close current DepartmentHead record (set end_date, is_current=False)
     - Create new DepartmentHead record (set start_date=today, is_current=True)
   - Maintain complete manager history

6. **Wrap in transaction**
   - Use @transaction.atomic decorator
   - Ensure all updates are atomic
   - Rollback on any validation failure

7. **Update department fields**
   - Update name if provided
   - Update code if provided
   - Update description if provided
   - Update location if provided
   - Update cost_center if provided
   - Update parent if provided
   - Set updated_by to user
   - Call department.save()

8. **Invalidate caches**
   - Clear org chart cache
   - Clear old parent's children cache (if parent changed)
   - Clear new parent's children cache (if parent changed)
   - Clear department's own cache

9. **Return updated department**
   - Refresh from database to get latest state
   - Return updated Department instance

### Update Department Flow

```
┌────────────────────────────────────────────────────┐
│          Update Department Process                 │
└────────────────────────────────────────────────────┘

1. Fetch Department
   ├─ Query by ID + tenant
   ├─ Not found? Raise error
   └─ Select related data

2. Validate Changes
   ├─ Parent changing?
   │  ├─ New parent exists?
   │  └─ No circular reference?
   ├─ Manager changing?
   │  └─ New manager active?
   └─ Name changing?
      └─ No duplicate in parent?

3. Begin Transaction
   │
   ├─ Handle Parent Change
   │  ├─ Update parent FK
   │  └─ MPTT rebuilds tree
   │
   ├─ Handle Manager Change
   │  ├─ Close current DepartmentHead
   │  │  ├─ end_date = yesterday
   │  │  └─ is_current = False
   │  └─ Create new DepartmentHead
   │     ├─ start_date = today
   │     └─ is_current = True
   │
   ├─ Update Other Fields
   │  ├─ name
   │  ├─ description
   │  ├─ location
   │  └─ cost_center
   │
   └─ Invalidate Cache
      ├─ Org chart
      ├─ Old parent children
      └─ New parent children

4. Return Updated Department
```

### Circular Reference Prevention

```
Scenario: Move "IT" department under "IT-Support"

Current Structure:
IT (dept_id=100)
└── IT-Support (dept_id=200)
    └── Helpdesk (dept_id=300)

Attempted: parent of IT = IT-Support (200)

Result:
IT (100)
└── IT-Support (200)
    └── IT (100)  ← CIRCULAR!

Prevention:
_check_circular_reference(100, 200)
→ Check if 200 is descendant of 100
→ IT-Support is child of IT
→ Raise ValidationError("Cannot move department to its own descendant")
```

### Manager Change History

```
Timeline: Sales Department Manager Changes

Jan 1-15, 2026: John Doe
DepartmentHead {
  employee: John Doe
  start_date: 2026-01-01
  end_date: 2026-01-15
  is_current: False
}

Jan 16, 2026 - Present: Jane Smith
DepartmentHead {
  employee: Jane Smith
  start_date: 2026-01-16
  end_date: null
  is_current: True
}

Queries:
- Who is current manager? → Jane Smith (is_current=True)
- Who managed in January? → John (1-15), Jane (16-31)
- Manager history? → [John, Jane] ordered by start_date
```

### Parent Change Impact

```
Before: Sales under Operations
Operations (DEPT-OPS)
├── Sales (DEPT-SALES)
│   ├── North (DEPT-SALES-NORTH)
│   └── South (DEPT-SALES-SOUTH)
└── Logistics (DEPT-LOG)

After: Sales under Marketing
Marketing (DEPT-MKT)
├── Sales (DEPT-SALES)
│   ├── North (DEPT-SALES-NORTH)  ← Moves with parent
│   └── South (DEPT-SALES-SOUTH)  ← Moves with parent
└── Digital (DEPT-DIGITAL)

MPTT Updates:
- Recalculates lft, rght, tree_id for Sales and descendants
- Updates level for Sales and descendants
- Maintains tree integrity
```

### Validation Matrix

| Field Change | Validation Required | Check Description |
|-------------|--------------------|--------------------|
| name | Uniqueness | No duplicate in same parent |
| code | Uniqueness | No duplicate in tenant |
| parent_id | Existence + Circular | Parent exists, no circular ref |
| manager_id | Active Employee | Employee exists and active |
| status | Transition Rules | Valid status transition |
| description | None | Any text allowed |
| location | None | Any text allowed |

### Cache Invalidation Strategy

| Cache Key | Invalidate When | Reason |
|-----------|----------------|--------|
| `org_chart_{tenant}` | Always | Structure may have changed |
| `dept_children_{old_parent}` | Parent changed | Children list changed |
| `dept_children_{new_parent}` | Parent changed | Children list changed |
| `dept_employees_{dept_id}` | Manager changed | Manager is employee |
| `dept_hierarchy_{dept_id}` | Parent changed | Path to root changed |

### Expected Outcome
- Functional update method
- Complete validation
- Parent change handling
- Manager history tracking
- Tree structure integrity
- Cache invalidation

### Verification Checklist
- [ ] update method implemented
- [ ] Department fetch with error handling
- [ ] Validation for all changes
- [ ] Circular reference check implemented
- [ ] Parent change handling works
- [ ] Manager change history tracked
- [ ] Transaction decorator applied
- [ ] Cache invalidation comprehensive

---

## Task 60: Implement Archive Department

### Overview
Implement the archive method in DepartmentService that safely archives departments with employee reassignment, child department validation, and complete audit trail. Archival is a soft delete that preserves history while removing from active operations.

### Dependencies
- Task 59: Implement Update Department
- DepartmentMember model for employee tracking
- Transfer/history tracking mechanism

### Instructions

1. **Define archive method signature**
   - Accept department_id parameter
   - Accept reassign_to parameter (target department ID for employees)
   - Accept user parameter for audit trail
   - Return archived Department instance

2. **Fetch department to archive**
   - Query Department by ID and tenant
   - Raise ObjectDoesNotExist if not found
   - Prefetch related employees and children

3. **Implement archive validation**
   - Check department has no active child departments
   - If has active children, raise ValidationError
   - Check department has employees
   - If has employees, ensure reassign_to is provided
   - Validate reassign_to department exists and is active

4. **Validate reassignment target**
   - If reassign_to provided, fetch target department
   - Ensure target is not the same as source
   - Ensure target is ACTIVE status
   - Ensure target is not descendant of source

5. **Wrap in transaction**
   - Use @transaction.atomic decorator
   - Ensure all operations are atomic
   - Rollback if any step fails

6. **Reassign employees**
   - If department has employees and reassign_to provided:
     - Query all DepartmentMember records for department
     - For each employee:
       - Close current membership (set end_date, is_current=False)
       - Create new membership in target department
       - Create transfer history record
     - Update employee's primary_department if needed

7. **Close department head record**
   - Query current DepartmentHead (is_current=True)
   - Set end_date to current date
   - Set is_current to False
   - Save record

8. **Archive the department**
   - Set department status to ARCHIVED
   - Set archived_at timestamp
   - Set archived_by to user
   - Add archive reason to notes/history
   - Call department.save()

9. **Invalidate caches**
   - Clear org chart cache
   - Clear parent's children cache
   - Clear department's employee cache
   - Clear target department's employee cache (if reassigning)

10. **Return archived department**
    - Refresh from database
    - Return Department instance with updated status

### Archive Department Flow

```
┌────────────────────────────────────────────────────┐
│          Archive Department Process                │
└────────────────────────────────────────────────────┘

1. Validation Phase
   ├─ Department exists?
   ├─ Has active children?
   │  └─ YES → Error: "Archive children first"
   ├─ Has employees?
   │  ├─ YES → reassign_to required?
   │  └─ NO → Proceed
   └─ Target dept valid?

2. Begin Transaction
   │
   ├─ Reassign Employees (if applicable)
   │  ├─ For each employee:
   │  │  ├─ Close current membership
   │  │  │  ├─ end_date = today
   │  │  │  └─ is_current = False
   │  │  ├─ Create new membership
   │  │  │  ├─ department = target
   │  │  │  ├─ start_date = today
   │  │  │  └─ is_current = True
   │  │  └─ Create transfer record
   │  │     ├─ from_dept = source
   │  │     ├─ to_dept = target
   │  │     ├─ reason = "Department archived"
   │  │     └─ date = today
   │  └─ Update primary_department
   │
   ├─ Close Department Head
   │  ├─ end_date = today
   │  └─ is_current = False
   │
   ├─ Archive Department
   │  ├─ status = ARCHIVED
   │  ├─ archived_at = now
   │  └─ archived_by = user
   │
   └─ Invalidate Cache
      ├─ Org chart
      ├─ Parent children
      └─ Employee lists

3. Return Archived Department
```

### Archive Validation Rules

| Validation | Rule | Error Message |
|-----------|------|---------------|
| Active Children | Must have no active children | "Cannot archive department with active child departments" |
| Employee Reassignment | If has employees, reassign_to required | "Must provide target department to reassign employees" |
| Target Exists | reassign_to department exists | "Target department not found" |
| Target Active | Target status is ACTIVE | "Target department must be active" |
| Not Self | Target is not source | "Cannot reassign to same department" |
| Not Descendant | Target is not child/grandchild | "Cannot reassign to child department" |

### Employee Reassignment Process

```
Source Department: DEPT-SALES (archiving)
Target Department: DEPT-MARKETING

Employees to Reassign:
1. John Doe (EMP-001)
2. Jane Smith (EMP-002)
3. Bob Johnson (EMP-003)

For Each Employee:

Step 1: Close Current Membership
DepartmentMember {
  department: DEPT-SALES
  employee: John Doe
  start_date: 2025-01-01
  end_date: 2026-01-24      ← Set to today
  is_current: False          ← Changed from True
}

Step 2: Create New Membership
DepartmentMember {
  department: DEPT-MARKETING
  employee: John Doe
  start_date: 2026-01-24     ← Today
  end_date: null
  is_current: True
}

Step 3: Transfer History
TransferHistory {
  employee: John Doe
  from_department: DEPT-SALES
  to_department: DEPT-MARKETING
  transfer_date: 2026-01-24
  reason: "Department archived: DEPT-SALES"
  initiated_by: Admin User
}

Result:
✓ Complete history preserved
✓ Employee continuity maintained
✓ Transfer audit trail created
```

### Archive Status Impact

```
Before Archive:
Department {
  name: "Sales Department"
  code: "DEPT-SALES"
  status: "ACTIVE"
  archived_at: null
  archived_by: null
  employees: [John, Jane, Bob]
  children: []
}

After Archive:
Department {
  name: "Sales Department"
  code: "DEPT-SALES"
  status: "ARCHIVED"             ← Changed
  archived_at: "2026-01-24T10:30:00Z"  ← Set
  archived_by: User(id=123)      ← Set
  employees: []                  ← Reassigned
  children: []                   ← Still none
}

Queries:
Department.objects.filter(status='ACTIVE')
  → Excludes DEPT-SALES

Department.objects.all()
  → Includes DEPT-SALES (soft delete)

Department.objects.with_archived()
  → Custom manager includes archived
```

### Archival Scenarios

| Scenario | Has Children | Has Employees | Action Required |
|----------|-------------|---------------|-----------------|
| Empty Leaf | No | No | Archive directly |
| Leaf with Employees | No | Yes | Provide reassign_to target |
| Parent with Active Children | Yes | Any | Error: Archive children first |
| Inactive Parent | Yes (inactive) | No | Archive directly |

### Error Handling

```
Error Scenario 1: Has Active Children
Request: Archive DEPT-OPS
Children: DEPT-SALES (ACTIVE), DEPT-LOG (ACTIVE)
Result: ValidationError
Message: "Cannot archive department with active child departments.
         Please archive or move these departments first:
         - DEPT-SALES (Sales Department)
         - DEPT-LOG (Logistics Department)"

Error Scenario 2: Missing Reassignment Target
Request: Archive DEPT-SALES (has 10 employees)
reassign_to: None
Result: ValidationError
Message: "Department has 10 active employees.
         Please provide a target department for reassignment."

Error Scenario 3: Invalid Target
Request: Archive DEPT-SALES, reassign to DEPT-SALES-NORTH
Relationship: DEPT-SALES-NORTH is child of DEPT-SALES
Result: ValidationError
Message: "Cannot reassign employees to a child department
         that will also be archived."
```

### Expected Outcome
- Functional archive method
- Complete validation
- Employee reassignment logic
- Transfer history creation
- Department head closure
- Cache invalidation
- Transaction safety

### Verification Checklist
- [ ] archive method implemented
- [ ] Archive validation complete
- [ ] Child department check implemented
- [ ] Employee reassignment logic works
- [ ] DepartmentMember records updated
- [ ] Transfer history created
- [ ] DepartmentHead closed
- [ ] Status set to ARCHIVED
- [ ] Cache invalidation implemented
- [ ] Transaction decorator applied

---

## Task 61: Implement Move Department

### Overview
Implement the move method in DepartmentService that safely moves a department and its entire subtree to a new parent location in the organizational hierarchy. This operation must preserve tree integrity and prevent circular references.

### Dependencies
- Task 60: Implement Archive Department
- MPTT tree structure operations
- Circular reference detection

### Instructions

1. **Define move method signature**
   - Accept department_id parameter (department to move)
   - Accept new_parent_id parameter (new parent, None for root)
   - Accept user parameter for audit trail
   - Return moved Department instance

2. **Fetch department to move**
   - Query Department by ID and tenant
   - Raise ObjectDoesNotExist if not found
   - Prefetch descendants for validation

3. **Fetch and validate new parent**
   - If new_parent_id is None, moving to root level
   - If new_parent_id provided:
     - Query new parent Department
     - Ensure new parent exists
     - Ensure new parent is ACTIVE
     - Ensure new parent is not the department itself

4. **Implement circular reference check**
   - Use _check_circular_reference(department_id, new_parent_id)
   - Prevent moving department under its own descendant
   - Check if new parent is in department's subtree
   - Raise ValidationError if circular reference detected

5. **Wrap in transaction**
   - Use @transaction.atomic decorator
   - Ensure tree integrity maintained
   - Rollback on any validation failure

6. **Update parent relationship**
   - Set department.parent = new_parent
   - If new_parent is None, department becomes root
   - Call department.save()
   - MPTT automatically rebuilds tree structure

7. **MPTT tree operations**
   - MPTT recalculates lft, rght values
   - MPPT recalculates tree_id if needed
   - MPTT recalculates level for department and descendants
   - All descendants move with the department

8. **Create move history record**
   - Create history entry with:
     - Department moved
     - Old parent
     - New parent
     - User who performed move
     - Timestamp
     - Reason/notes if provided

9. **Invalidate caches**
   - Clear org chart cache
   - Clear old parent's children cache
   - Clear new parent's children cache
   - Clear department's hierarchy cache

10. **Return moved department**
    - Refresh from database to get updated tree values
    - Return Department instance with new position

### Move Department Flow

```
┌────────────────────────────────────────────────────┐
│          Move Department Process                   │
└────────────────────────────────────────────────────┘

1. Validation Phase
   ├─ Department exists?
   ├─ New parent exists? (if not root)
   ├─ New parent is ACTIVE?
   ├─ Not moving to self?
   └─ No circular reference?
      └─ New parent not in department's subtree?

2. Circular Reference Check
   ├─ Get all descendants of department
   ├─ Check if new_parent_id in descendants
   └─ If YES → Error

3. Begin Transaction
   │
   ├─ Update Parent FK
   │  └─ department.parent = new_parent
   │
   ├─ MPTT Rebuilds Tree
   │  ├─ Recalculate lft, rght
   │  ├─ Recalculate tree_id (if needed)
   │  ├─ Recalculate level
   │  └─ Update all descendants
   │
   ├─ Create Move History
   │  ├─ old_parent
   │  ├─ new_parent
   │  ├─ moved_by
   │  └─ timestamp
   │
   └─ Invalidate Cache
      ├─ Org chart
      ├─ Old parent children
      └─ New parent children

4. Return Moved Department
```

### Circular Reference Detection

```
Current Structure:
Operations (id=100, level=0)
├── Sales (id=200, level=1)
│   ├── North (id=300, level=2)
│   └── South (id=400, level=2)
└── Marketing (id=500, level=1)

Invalid Move: Move Operations under Sales
Result: Operations would be child of Sales, but Sales is child of Operations

Detection Algorithm:
def _check_circular_reference(dept_id=100, new_parent_id=200):
    # Get all descendants of department
    descendants = Department.objects.filter(
        tree_id=dept.tree_id,
        lft__gt=dept.lft,
        rght__lt=dept.rght
    )
    descendant_ids = [d.id for d in descendants]
    
    # Check if new parent is in descendants
    if new_parent_id in descendant_ids:
        raise ValidationError(
            "Cannot move department under its own descendant"
        )

Check: Is Sales (200) descendant of Operations (100)?
Sales lft=5, rght=12, Operations lft=1, rght=20
5 > 1 and 12 < 20 → YES, Sales is descendant
Result: Circular reference detected → Error
```

### MPTT Tree Recalculation

```
Before Move:
Operations (lft=1, rght=10, level=0)
├── Sales (lft=2, rght=7, level=1)
│   ├── North (lft=3, rght=4, level=2)
│   └── South (lft=5, rght=6, level=2)
└── Logistics (lft=8, rght=9, level=1)

Marketing (lft=11, rght=12, level=0)

Operation: Move Sales from Operations to Marketing

After Move:
Operations (lft=1, rght=4, level=0)
└── Logistics (lft=2, rght=3, level=1)

Marketing (lft=5, rght=12, level=0)
└── Sales (lft=6, rght=11, level=1)      ← Moved here
    ├── North (lft=7, rght=8, level=2)   ← Moved with parent
    └── South (lft=9, rght=10, level=2)  ← Moved with parent

Changes:
✓ Sales parent changed: Operations → Marketing
✓ Sales level changed: 1 → 1 (same level, different branch)
✓ North and South moved automatically (subtree intact)
✓ All lft, rght values recalculated
✓ Tree integrity maintained
```

### Move Scenarios

| Scenario | From | To | Impact | Valid? |
|----------|------|-----|--------|--------|
| Move to root | Sales (under Ops) | Root | Sales becomes top-level | ✓ Yes |
| Move to sibling | Sales (under Ops) | Marketing (peer) | Sales changes parent | ✓ Yes |
| Move to child | Sales | North (child of Sales) | Circular reference | ✗ No |
| Move to grandchild | Ops | South (grandchild) | Circular reference | ✗ No |
| Move under same parent | Sales (under Ops) | Ops | No change | ✓ Yes (no-op) |

### Move History Tracking

```
MoveHistory Record:
{
  id: 1,
  department: Sales (200),
  old_parent: Operations (100),
  new_parent: Marketing (500),
  moved_by: Admin User (1),
  moved_at: "2026-01-24T10:30:00Z",
  reason: "Organizational restructuring",
  old_path: "Operations > Sales",
  new_path: "Marketing > Sales",
}

Query History:
# Where has Sales department been?
MoveHistory.objects.filter(department=sales).order_by('moved_at')

# What departments moved recently?
MoveHistory.objects.filter(
    moved_at__gte=date_30_days_ago
).order_by('-moved_at')
```

### Subtree Movement

```
All descendants move with the department:

Moving: Sales Department
Subtree:
  Sales
  ├── North
  │   └── North-Team1
  └── South
      └── South-Team1

Result: All 5 departments move together
- Sales → New parent
- North → Still under Sales
- North-Team1 → Still under North
- South → Still under Sales
- South-Team1 → Still under South

Relationships preserved
Hierarchy intact
```

### Expected Outcome
- Functional move method
- Circular reference prevention
- Tree structure integrity
- Subtree movement
- Move history tracking
- Cache invalidation
- Transaction safety

### Verification Checklist
- [ ] move method implemented
- [ ] Department and parent fetch with validation
- [ ] Circular reference check implemented
- [ ] Parent relationship update works
- [ ] MPTT tree recalculation automatic
- [ ] Move history record created
- [ ] Cache invalidation implemented
- [ ] Transaction decorator applied
- [ ] Subtree moves with parent verified

---

## Task 62: Implement Merge Departments

### Overview
Implement the merge method in DepartmentService that combines two departments by moving all employees, child departments, and related data from a source department into a target department, then archiving the source. This is an advanced operation requiring careful coordination of multiple resources.

### Dependencies
- Task 61: Implement Move Department
- Task 60: Implement Archive Department
- Employee transfer mechanism
- Department member management

### Instructions

1. **Define merge method signature**
   - Accept source_id parameter (department to merge from)
   - Accept target_id parameter (department to merge into)
   - Accept user parameter for audit trail
   - Accept optional reason parameter for merge justification
   - Return target Department instance

2. **Fetch and validate departments**
   - Query both source and target departments
   - Ensure both exist and belong to same tenant
   - Ensure source and target are different departments
   - Ensure both are ACTIVE status
   - Prefetch employees and children for efficiency

3. **Implement merge validation**
   - Source and target must be different
   - Both must be ACTIVE
   - Source must not be ancestor of target (prevent tree issues)
   - Target must not be ancestor of source
   - Both must be in same tenant

4. **Wrap in transaction**
   - Use @transaction.atomic decorator
   - Ensure all operations are atomic
   - Complex operation with many steps
   - Rollback if any step fails

5. **Move all employees from source to target**
   - Query all active DepartmentMember records for source
   - For each employee:
     - Close membership in source department
     - Create new membership in target department
     - Create transfer history record
     - Update primary_department if source was primary

6. **Move all child departments to target**
   - Query all child departments of source
   - For each child:
     - Update parent to target
     - MPTT handles tree restructuring
     - Children of source become children of target

7. **Transfer department resources**
   - Move or merge department-specific resources:
     - Budget allocations
     - Cost center assignments
     - Department-specific permissions
     - Department documents/files
     - Any other department-owned resources

8. **Close source department head**
   - Query current DepartmentHead for source
   - Set end_date to current date
   - Set is_current to False
   - History preserved

9. **Archive source department**
   - Set source status to ARCHIVED
   - Set archived_at timestamp
   - Set archived_by to user
   - Add merge information to notes
   - Reference target department in archive reason

10. **Create merge history record**
    - Create comprehensive merge history:
      - Source and target departments
      - Number of employees transferred
      - Number of child departments moved
      - Merge reason
      - Performed by user
      - Timestamp

11. **Invalidate caches**
    - Clear org chart cache
    - Clear both departments' employee caches
    - Clear parent departments' children caches
    - Clear all related hierarchy caches

12. **Return target department**
    - Refresh target from database
    - Now contains all merged resources
    - Return updated Department instance

### Merge Departments Flow

```
┌────────────────────────────────────────────────────┐
│          Merge Departments Process                 │
└────────────────────────────────────────────────────┘

1. Validation Phase
   ├─ Both departments exist?
   ├─ Both are ACTIVE?
   ├─ Source ≠ Target?
   ├─ Same tenant?
   └─ No ancestor relationship?

2. Begin Transaction
   │
   ├─ Move Employees
   │  ├─ For each employee in source:
   │  │  ├─ Close source membership
   │  │  ├─ Create target membership
   │  │  └─ Create transfer record
   │  └─ Update primary_department
   │
   ├─ Move Child Departments
   │  ├─ For each child of source:
   │  │  ├─ Update parent to target
   │  │  └─ MPTT recalculates tree
   │  └─ Children now under target
   │
   ├─ Transfer Resources
   │  ├─ Budget allocations
   │  ├─ Cost centers
   │  ├─ Permissions
   │  └─ Documents
   │
   ├─ Close Source Dept Head
   │  ├─ end_date = today
   │  └─ is_current = False
   │
   ├─ Archive Source Dept
   │  ├─ status = ARCHIVED
   │  ├─ archived_at = now
   │  ├─ archived_by = user
   │  └─ reason = "Merged into {target}"
   │
   ├─ Create Merge History
   │  ├─ source, target
   │  ├─ employees_moved
   │  ├─ children_moved
   │  ├─ reason
   │  └─ timestamp
   │
   └─ Invalidate Cache
      ├─ Org chart
      ├─ Employee lists
      └─ Children lists

3. Return Target Department
```

### Merge Validation Matrix

| Validation | Rule | Error Message |
|-----------|------|---------------|
| Same Tenant | source.tenant == target.tenant | "Departments must be in same tenant" |
| Both Active | source.status == ACTIVE and target.status == ACTIVE | "Both departments must be active" |
| Different Depts | source.id != target.id | "Cannot merge department with itself" |
| Not Ancestor | target not in source.ancestors | "Cannot merge into ancestor department" |
| Not Descendant | source not in target.ancestors | "Cannot merge into descendant department" |

### Merge Example

```
Before Merge:
════════════════════════════════════════

DEPT-SALES-NORTH (Source)
├── Employees: [John, Jane, Bob]
├── Children: [DEPT-SALES-NORTH-TEAM1]
└── Budget: Rs. 1,000,000

DEPT-SALES-SOUTH (Target)
├── Employees: [Alice, Charlie]
├── Children: [DEPT-SALES-SOUTH-TEAM1]
└── Budget: Rs. 1,500,000

After Merge:
════════════════════════════════════════

DEPT-SALES-NORTH
├── Status: ARCHIVED
├── Archived Reason: "Merged into DEPT-SALES-SOUTH"
└── All resources moved

DEPT-SALES-SOUTH (Target)
├── Employees: [Alice, Charlie, John, Jane, Bob]  ← Added
├── Children: [
│     DEPT-SALES-SOUTH-TEAM1,
│     DEPT-SALES-NORTH-TEAM1  ← Moved from source
│   ]
└── Budget: Rs. 2,500,000  ← Combined

Result:
✓ 3 employees transferred
✓ 1 child department moved
✓ Budgets consolidated
✓ Source archived
✓ History preserved
```

### Employee Transfer Process

```
Source: DEPT-SALES-NORTH (10 employees)
Target: DEPT-SALES-SOUTH (5 employees)

For Each of 10 Employees:

Step 1: Close Source Membership
DepartmentMember {
  department: DEPT-SALES-NORTH
  employee: John Doe
  start_date: 2025-06-01
  end_date: 2026-01-24        ← Set today
  is_current: False            ← Changed
}

Step 2: Create Target Membership
DepartmentMember {
  department: DEPT-SALES-SOUTH
  employee: John Doe
  start_date: 2026-01-24       ← Today
  end_date: null
  is_current: True
}

Step 3: Transfer History
TransferHistory {
  employee: John Doe
  from_department: DEPT-SALES-NORTH
  to_department: DEPT-SALES-SOUTH
  transfer_date: 2026-01-24
  reason: "Department merge: NORTH merged into SOUTH"
  initiated_by: Admin User
}

After All Transfers:
DEPT-SALES-SOUTH has 15 employees (5 original + 10 transferred)
```

### Child Department Movement

```
Before:
Operations
├── DEPT-SALES-NORTH (source)
│   └── TEAM-NORTH-1
└── DEPT-SALES-SOUTH (target)
    └── TEAM-SOUTH-1

After Merge:
Operations
├── DEPT-SALES-NORTH (ARCHIVED)
└── DEPT-SALES-SOUTH (target)
    ├── TEAM-SOUTH-1
    └── TEAM-NORTH-1  ← Moved from source

Tree Updates:
- TEAM-NORTH-1 parent changed: NORTH → SOUTH
- MPTT recalculates lft, rght, level
- Tree integrity maintained
```

### Merge History Record

```
MergeHistory {
  id: 1,
  source_department: DEPT-SALES-NORTH,
  target_department: DEPT-SALES-SOUTH,
  employees_transferred: 10,
  child_departments_moved: 1,
  merge_reason: "Consolidating regional sales teams",
  merged_by: Admin User,
  merged_at: "2026-01-24T10:30:00Z",
  source_budget: 1000000.00,
  target_budget_before: 1500000.00,
  target_budget_after: 2500000.00,
  notes: "All North team resources consolidated into South team"
}

Query Merge History:
# Find all merges
MergeHistory.objects.all().order_by('-merged_at')

# Find merges involving a department
MergeHistory.objects.filter(
    Q(source_department=dept) | Q(target_department=dept)
)

# Find merges by user
MergeHistory.objects.filter(merged_by=user)
```

### Resource Transfer Checklist

| Resource Type | Transfer Action |
|--------------|----------------|
| Employees | Transfer membership + history |
| Child Departments | Update parent reference |
| Budget | Combine or transfer allocation |
| Cost Center | Merge or update mappings |
| Permissions | Copy to target, revoke from source |
| Documents | Move or copy to target folder |
| Equipment | Update department assignment |
| Goals/KPIs | Consolidate or archive |

### Merge Scenarios

| Scenario | Source | Target | Action | Valid? |
|----------|--------|--------|--------|--------|
| Peer departments | Sales-North | Sales-South | Merge | ✓ Yes |
| Parent to child | Sales | Sales-North | Error | ✗ No (ancestor) |
| Child to parent | Sales-North | Sales | Error | ✗ No (descendant) |
| Different branches | Sales-North | Marketing | Merge | ✓ Yes |
| Self merge | Sales-North | Sales-North | Error | ✗ No (same dept) |

### Expected Outcome
- Functional merge method
- Complete validation
- Employee transfer with history
- Child department movement
- Resource consolidation
- Source department archival
- Merge history tracking
- Cache invalidation
- Transaction safety

### Verification Checklist
- [ ] merge method implemented
- [ ] Both departments fetched and validated
- [ ] Merge validation complete
- [ ] Employee transfer logic works
- [ ] Child department movement implemented
- [ ] Resource transfer handled
- [ ] Source department head closed
- [ ] Source department archived
- [ ] Merge history record created
- [ ] Cache invalidation comprehensive
- [ ] Transaction decorator applied
- [ ] Complex operation tested

---

## Summary

This document established the DepartmentService business logic layer:

### Completed Infrastructure
- ✅ DepartmentService class with core architecture
- ✅ Create department with validation and code generation
- ✅ Update department with parent and manager changes
- ✅ Archive department with employee reassignment
- ✅ Move department within organizational tree
- ✅ Merge departments with resource consolidation

### Key Achievements
1. **Service Layer** - Centralized business logic for all department operations
2. **Transaction Safety** - All operations wrapped in atomic transactions
3. **Tree Integrity** - MPTT tree structure maintained through all operations
4. **Employee Management** - Complete employee transfer and reassignment logic
5. **History Tracking** - Full audit trail for all department changes
6. **Cache Management** - Consistent cache invalidation across operations

### Next Steps
Proceed to [02_Tasks-63-68_Designation-Service-Search.md](02_Tasks-63-68_Designation-Service-Search.md) to implement DesignationService, salary range validation, and search functionality.

---

**Document Status:** ✅ Complete  
**Total Tasks:** 6 (57-62)  
**Estimated Time:** 175 minutes
