# Tasks 31-37: Employee Foreign Keys and Department Membership

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 02 - Department & Designations  
> **Group:** C - Department-Employee Links  
> **Document:** 01 of 02  
> **Tasks Covered:** 31, 32, 33, 34, 35, 36, 37

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-38-44_Signals-Head-Validation.md](02_Tasks-38-44_Signals-Head-Validation.md)

---

## Document Overview

This document covers the integration of employees with the organization structure by adding foreign key relationships to departments and designations, and creating the DepartmentMember model to track employee membership in departments with roles and date tracking. These elements establish the foundation for employee-department relationships and membership history.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 31 | Update Employee Department FK | Medium | 20 min |
| 32 | Update Employee Designation FK | Medium | 20 min |
| 33 | Run Employee FK Update Migrations | Low | 15 min |
| 34 | Create DepartmentMember Model | Medium | 25 min |
| 35 | Add Membership Date Fields | Medium | 20 min |
| 36 | Add Membership Role Field | Low | 15 min |
| 37 | Run DepartmentMember Migrations | Low | 15 min |

---

## Task 31: Update Employee Department FK

### Overview
Add a foreign key relationship from the Employee model to the Department model. This creates a direct link between employees and their primary department, allowing for easy department-based queries and reporting.

### Dependencies
- Department model exists (`apps/organization/models/department.py`)
- Employee model exists (`apps/employees/models/employee.py`)
- Django ORM configured

### Instructions

1. **Open employee.py model file**
   - Navigate to `apps/employees/models/employee.py`
   - Locate the Employee model class

2. **Import Department model**
   - Add import statement for Department
   - Import from `apps.organization.models`

3. **Add department field**
   - ForeignKey to Department model
   - Use `on_delete=models.SET_NULL`
   - Make nullable (null=True, blank=True)
   - Add related_name='employees'

4. **Add help_text**
   - Describe field purpose
   - Note: "Primary department assignment"
   - Explain nullable for unassigned employees

5. **Add field documentation**
   - Update model docstring
   - Document department field purpose
   - Note relationship behavior

6. **Consider ordering implications**
   - Review if ordering should include department
   - Consider adding department to list display
   - Update manager methods if needed

### Employee-Department Relationship

```
┌──────────────────┐        N:1         ┌─────────────────┐
│     Employee     │────────────────────►│   Department    │
├──────────────────┤                     ├─────────────────┤
│ • id             │                     │ • id            │
│ • first_name     │                     │ • name          │
│ • last_name      │                     │ • code          │
│ • department ────┼──► ForeignKey       │ • parent        │
│ • designation    │                     │                 │
│ • manager        │                     │                 │
└──────────────────┘                     └─────────────────┘
```

### Field Specifications

| Attribute | Value | Reasoning |
|-----------|-------|-----------|
| Field Type | ForeignKey | Many employees to one department |
| on_delete | SET_NULL | Preserve employee if department deleted |
| null | True | Employees can be unassigned |
| blank | True | Optional in forms |
| related_name | 'employees' | Access via department.employees.all() |

### Department Assignment Scenarios

| Scenario | department Value | Status |
|----------|-----------------|--------|
| New hire (unassigned) | NULL | Pending assignment |
| Active employee | Department ID | Normal state |
| Transferred employee | New Department ID | Updated after transfer |
| Department disbanded | NULL | Reset after department deletion |
| Contractor/Temp | NULL or specific dept | Varies by policy |

### Usage Examples

#### Querying Employees by Department
```
Purpose: Get all employees in IT department
Approach:
1. Get IT department: it_dept = Department.objects.get(code='IT')
2. Query employees: employees = it_dept.employees.all()
3. Filter active: active_employees = it_dept.employees.filter(is_active=True)
```

#### Reverse Query Example
```
Purpose: Get employee's department name
Approach:
1. Get employee: employee = Employee.objects.get(id=1)
2. Access department: dept_name = employee.department.name if employee.department else 'Unassigned'
3. Handle null case gracefully
```

#### Department Statistics
```
Purpose: Count employees per department
Approach:
1. Annotate count: Department.objects.annotate(emp_count=Count('employees'))
2. Filter non-empty: Department.objects.filter(employees__isnull=False).distinct()
3. Get top departments: departments.order_by('-emp_count')
```

### Data Migration Considerations

#### Existing Employees
- All existing employees will have department=NULL initially
- Bulk assignment may be needed
- Consider department assignment workflow
- Plan data import if migrating from legacy system

#### Default Department Handling
- Option 1: Leave NULL until manual assignment
- Option 2: Create "Unassigned" department
- Option 3: Auto-assign based on business rules
- Recommended: Option 1 for clarity

### Expected Outcome
- Employee model has department foreign key
- Nullable relationship established
- Reverse relation accessible from Department
- Foundation for department-based operations

### Verification Checklist
- [ ] Department model imported
- [ ] department ForeignKey field added
- [ ] on_delete=SET_NULL configured
- [ ] null=True and blank=True set
- [ ] related_name='employees' specified
- [ ] help_text added
- [ ] Model docstring updated
- [ ] Field appears in model definition

---

## Task 32: Update Employee Designation FK

### Overview
Add a foreign key relationship from the Employee model to the Designation model. This links employees to their job designation (role/position), enabling designation-based queries, role hierarchy tracking, and career progression analysis.

### Dependencies
- Task 31: Update Employee Department FK
- Designation model exists (`apps/organization/models/designation.py`)
- Employee model exists

### Instructions

1. **Open employee.py model file**
   - Continue in `apps/employees/models/employee.py`
   - Locate Employee model class

2. **Import Designation model**
   - Add import statement for Designation
   - Import from `apps.organization.models`

3. **Add designation field**
   - ForeignKey to Designation model
   - Use `on_delete=models.SET_NULL`
   - Make nullable (null=True, blank=True)
   - Add related_name='employees'

4. **Add help_text**
   - Describe field purpose
   - Note: "Employee's job designation/position"
   - Explain nullable for unassigned roles

5. **Position field placement**
   - Place designation field after department field
   - Maintain logical field ordering
   - Keep related organization fields together

6. **Update model docstring**
   - Document designation field
   - Note relationship with Department
   - Explain designation vs department difference

### Employee-Designation Relationship

```
┌──────────────────┐        N:1         ┌─────────────────┐
│     Employee     │────────────────────►│  Designation    │
├──────────────────┤                     ├─────────────────┤
│ • id             │                     │ • id            │
│ • first_name     │                     │ • name          │
│ • last_name      │                     │ • level         │
│ • department     │                     │ • category      │
│ • designation ───┼──► ForeignKey       │ • is_manager    │
│ • manager        │                     │                 │
└──────────────────┘                     └─────────────────┘
```

### Complete Organization Structure Links

```
Employee Model Organization Fields
═══════════════════════════════════════

┌─────────────────────────────────────┐
│          Employee                   │
├─────────────────────────────────────┤
│ department  ──► Department          │  Where they work
│ designation ──► Designation         │  What their role is
│ manager     ──► Employee (self FK)  │  Who they report to
└─────────────────────────────────────┘

Example:
John Doe
├── Department: IT
├── Designation: Senior Developer
└── Manager: Jane Smith (IT Manager)
```

### Field Specifications

| Attribute | Value | Reasoning |
|-----------|-------|-----------|
| Field Type | ForeignKey | Many employees to one designation |
| on_delete | SET_NULL | Preserve employee if designation removed |
| null | True | Employees can be undesignated |
| blank | True | Optional in forms |
| related_name | 'employees' | Access via designation.employees.all() |

### Designation Assignment Scenarios

| Scenario | designation Value | department Value | Notes |
|----------|------------------|------------------|-------|
| New hire | NULL | NULL | Pending both |
| Intern | Intern designation | Training dept | Entry level |
| Regular employee | Specific designation | Assigned dept | Normal state |
| Promoted | New designation | Same/new dept | Career progression |
| Designation retired | NULL | Dept preserved | Until reassignment |

### Department vs Designation

| Aspect | Department | Designation |
|--------|------------|-------------|
| Definition | Organizational unit | Job role/position |
| Example | "IT", "HR", "Sales" | "Developer", "Manager", "Analyst" |
| Hierarchy | Tree structure | Level-based |
| Changeability | Transfers/reorganization | Promotions/role changes |
| Relationship | Where you work | What you do |

### Usage Examples

#### Query by Designation
```
Purpose: Get all employees with "Senior Developer" designation
Approach:
1. Get designation: sr_dev = Designation.objects.get(name='Senior Developer')
2. Query employees: employees = sr_dev.employees.all()
3. Filter by department: it_senior_devs = sr_dev.employees.filter(department__code='IT')
```

#### Cross-Department Role Analysis
```
Purpose: Find all managers across departments
Approach:
1. Get manager designations: manager_desigs = Designation.objects.filter(is_manager=True)
2. Get all managers: managers = Employee.objects.filter(designation__in=manager_desigs)
3. Group by department: managers.values('department__name').annotate(count=Count('id'))
```

#### Career Progression Tracking
```
Purpose: Track employee designation changes
Approach:
1. Use designation change signal (Task 39)
2. Log previous and new designation
3. Analyze progression patterns
4. Identify promotion paths
```

### Combined Department-Designation Queries

#### Organizational Matrix
```
Purpose: View employees by department and designation
Approach:
1. Query with both: Employee.objects.filter(department=dept, designation=desig)
2. Create matrix view: departments vs designations
3. Show count in each cell
4. Identify gaps or overallocation
```

#### Validation Rules
```
Rule 1: Designation-Department Compatibility
- Some designations may be department-specific
- Example: "Sales Representative" only in Sales dept
- Validation in forms/APIs

Rule 2: Level Consistency
- Manager designation should align with reports
- Designation level >= subordinates' levels
- Enforced via validators (Task 44)
```

### Expected Outcome
- Employee model has designation foreign key
- Nullable relationship established
- Reverse relation accessible from Designation
- Foundation for role-based operations
- Combined department-designation tracking

### Verification Checklist
- [ ] Designation model imported
- [ ] designation ForeignKey field added
- [ ] on_delete=SET_NULL configured
- [ ] null=True and blank=True set
- [ ] related_name='employees' specified
- [ ] help_text added
- [ ] Field placed after department field
- [ ] Model docstring updated

---

## Task 33: Run Employee FK Update Migrations

### Overview
Generate and apply Django migrations for the Employee model changes. This creates the database schema changes for the department and designation foreign key fields added in Tasks 31 and 32.

### Dependencies
- Task 31: Update Employee Department FK
- Task 32: Update Employee Designation FK
- Django migrations configured

### Instructions

1. **Review model changes**
   - Open `apps/employees/models/employee.py`
   - Verify department field is correctly defined
   - Verify designation field is correctly defined
   - Check all field attributes

2. **Generate migration file**
   - Open terminal in project root
   - Activate virtual environment
   - Run makemigrations command for employees app
   - Command: `python manage.py makemigrations employees`

3. **Review generated migration**
   - Navigate to `apps/employees/migrations/`
   - Locate newest migration file (e.g., `0009_fk_updates.py`)
   - Review migration operations
   - Verify AddField operations for both fields

4. **Check migration dependencies**
   - Ensure migration depends on organization app migrations
   - Department and Designation models must exist first
   - Add dependency if not auto-detected

5. **Apply migration**
   - Run migrate command
   - Command: `python manage.py migrate employees`
   - Monitor for errors
   - Verify successful completion

6. **Verify database changes**
   - Connect to database
   - Check employees table structure
   - Verify department_id column exists
   - Verify designation_id column exists
   - Check foreign key constraints

7. **Test migration reversibility**
   - Document rollback procedure
   - Test rollback in development
   - Command: `python manage.py migrate employees <previous_migration>`
   - Verify data preservation

### Migration File Structure

```
Migration: 0009_fk_updates.py
═════════════════════════════════════

from django.db import migrations, models
import django.db.models.deletion

class Migration(migrations.Migration):
    
    dependencies = [
        ('employees', '0008_previous_migration'),
        ('organization', '0002_designation_levels'),  # Required!
    ]
    
    operations = [
        migrations.AddField(
            model_name='employee',
            name='department',
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name='employees',
                to='organization.department',
            ),
        ),
        migrations.AddField(
            model_name='employee',
            name='designation',
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name='employees',
                to='organization.designation',
            ),
        ),
    ]
```

### Migration Dependencies

```
Dependency Chain
════════════════

Organization App:
├── 0001_initial.py (Department model)
├── 0002_designation_levels.py (Designation model)
└── Must exist before ↓

Employees App:
├── 0008_previous_migration.py
└── 0009_fk_updates.py ← New migration
    ├── Depends on: employees.0008
    └── Depends on: organization.0002
```

### Database Schema Changes

```
employees_employee Table (Before)
─────────────────────────────────────
id               | INTEGER PRIMARY KEY
first_name       | VARCHAR(100)
last_name        | VARCHAR(100)
email            | VARCHAR(254)
...

employees_employee Table (After)
─────────────────────────────────────
id               | INTEGER PRIMARY KEY
first_name       | VARCHAR(100)
last_name        | VARCHAR(100)
email            | VARCHAR(254)
department_id    | INTEGER NULL        ← NEW
designation_id   | INTEGER NULL        ← NEW
...

Foreign Keys Added:
├── fk_employee_department
│   ├── employees_employee.department_id
│   └── → organization_department.id
└── fk_employee_designation
    ├── employees_employee.designation_id
    └── → organization_designation.id
```

### Migration Commands

```bash
# Step 1: Generate migration
python manage.py makemigrations employees

# Expected output:
# Migrations for 'employees':
#   apps/employees/migrations/0009_fk_updates.py
#     - Add field department to employee
#     - Add field designation to employee

# Step 2: Check migration plan
python manage.py showmigrations employees

# Step 3: Apply migration
python manage.py migrate employees

# Expected output:
# Running migrations:
#   Applying employees.0009_fk_updates... OK

# Step 4: Verify (optional)
python manage.py sqlmigrate employees 0009
```

### Testing Migration

#### Pre-Migration Checks
- [ ] All existing employee records backed up
- [ ] Department and Designation models exist
- [ ] No pending migrations in organization app
- [ ] Development environment tested first

#### Post-Migration Verification
- [ ] Migration applied successfully
- [ ] Both new columns exist in database
- [ ] Foreign key constraints created
- [ ] Existing employee records preserved
- [ ] NULL values in new columns (expected)
- [ ] No data loss occurred

### Rollback Procedure

```bash
# If issues occur, rollback to previous migration
python manage.py migrate employees 0008_previous_migration

# This will:
# 1. Remove department_id column
# 2. Remove designation_id column
# 3. Drop foreign key constraints
# 4. Restore previous schema

# Fix issues, then re-apply:
python manage.py migrate employees 0009_fk_updates
```

### Common Issues and Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| Missing dependency | organization migrations not run | Run `migrate organization` first |
| Foreign key error | Referenced table doesn't exist | Check Department/Designation tables exist |
| Migration conflict | Multiple migration files | Use `--merge` flag or resolve manually |
| Constraint violation | Invalid data in table | Clean data before migration |

### Expected Outcome
- Migration file generated successfully
- Database schema updated
- Foreign key relationships established
- Existing data preserved
- No constraint violations
- System ready for employee-department assignments

### Verification Checklist
- [ ] Migration file generated
- [ ] Migration file reviewed
- [ ] Dependencies correct
- [ ] Migration applied successfully
- [ ] Database columns created
- [ ] Foreign keys established
- [ ] No errors in migration output
- [ ] Rollback tested (development)
- [ ] Migration documented

---

## Task 34: Create DepartmentMember Model

### Overview
Create the DepartmentMember model to track employee membership in departments. This model enables tracking multiple department affiliations, membership history, and roles within departments. It supports scenarios where employees belong to multiple departments (primary and secondary) and maintains a complete history of department assignments.

### Dependencies
- Task 33: Run Employee FK Update Migrations
- Department model exists
- Employee model with department FK exists
- Django ORM configured

### Instructions

1. **Create department_member.py model file**
   - Create file at `apps/organization/models/department_member.py`
   - Import necessary Django components

2. **Import required modules**
   - Import Django model fields
   - Import base model mixins (TenantAwareMixin, TimestampMixin)
   - Import Department and Employee models
   - Import timezone utilities

3. **Define DepartmentMember model class**
   - Inherit from TenantAwareMixin and TimestampMixin
   - Add comprehensive model docstring
   - Explain multi-department membership capability

4. **Add employee field**
   - ForeignKey to Employee model
   - Use `on_delete=models.CASCADE`
   - Add related_name='department_memberships'
   - Required field (no null/blank)

5. **Add department field**
   - ForeignKey to Department model
   - Use `on_delete=models.CASCADE`
   - Add related_name='members'
   - Required field

6. **Add is_primary field**
   - BooleanField, default=False
   - Indicates primary department assignment
   - Only one primary per employee (validated)

7. **Add notes field**
   - TextField, optional (blank=True, null=True)
   - Stores additional membership information
   - Reason for assignment, special conditions, etc.

8. **Add Meta class**
   - Set verbose_name and verbose_name_plural
   - Add ordering by employee name, joined_date
   - Add unique_together constraint (tenant, employee, department)
   - Add indexes for performance

9. **Add __str__ method**
   - Return meaningful string representation
   - Format: "Employee Name - Department Name (Role)"
   - Include membership status

10. **Add clean method**
    - Validate single primary department per employee
    - Check date consistency (covered in Task 35)
    - Raise ValidationError for violations

11. **Update organization models __init__.py**
    - Import DepartmentMember model
    - Add to __all__ list

### DepartmentMember Model Structure

```
┌─────────────────────────────────────────────────┐
│         DepartmentMember Model                  │
├─────────────────────────────────────────────────┤
│ Core Fields:                                    │
│  • employee (FK to Employee)                    │
│  • department (FK to Department)                │
│  • is_primary (Boolean)                         │
│  • notes (TextField, optional)                  │
│                                                 │
│ Date Fields (Task 35):                          │
│  • joined_date (DateField)                      │
│  • left_date (DateField, optional)              │
│                                                 │
│ Role Field (Task 36):                           │
│  • role (CharField with choices)                │
│                                                 │
│ Inherited from TenantAwareMixin:                │
│  • tenant (ForeignKey)                          │
│                                                 │
│ Inherited from TimestampMixin:                  │
│  • created_at (DateTimeField)                   │
│  • updated_at (DateTimeField)                   │
└─────────────────────────────────────────────────┘
```

### Model Relationships

```
┌──────────────┐         1:N          ┌────────────────────┐
│   Employee   │◄─────────────────────│ DepartmentMember   │
└──────────────┘                      └────────────────────┘
                                               │
                                               │ N:1
                                               ▼
                                      ┌────────────────────┐
                                      │    Department      │
                                      └────────────────────┘
```

### Three-Way Relationship

```
Employee ←→ DepartmentMember ←→ Department

This junction table enables:
├── Many-to-Many relationship (Employee ↔ Department)
├── Additional membership attributes (role, dates, notes)
├── Historical tracking (left_date)
└── Primary department designation
```

### Primary Department Logic

```
Primary Department Rule
═══════════════════════

Each employee has exactly ONE primary department

Employee: John Doe
├── IT Department (is_primary=True)   ← Primary
├── Project Alpha (is_primary=False)  ← Secondary
└── Training Team (is_primary=False)  ← Secondary

Validation:
- When setting is_primary=True on new membership
- Check no other primary exists for same employee
- Unset other primaries if needed (via signal)
```

### Multi-Department Membership Examples

#### Example 1: Cross-Functional Role
```
Employee: Alice Johnson
Position: DevOps Engineer

Department Memberships:
├── IT Development (Primary)
│   ├── Role: MEMBER
│   ├── joined_date: 2024-01-15
│   └── left_date: NULL (active)
│
├── IT Operations (Secondary)
│   ├── Role: LEAD
│   ├── joined_date: 2024-06-01
│   └── left_date: NULL (active)
│
└── Security Team (Secondary)
    ├── Role: MEMBER
    ├── joined_date: 2025-01-01
    └── left_date: NULL (active)
```

#### Example 2: Project Assignment
```
Employee: Bob Smith
Position: Senior Developer

Department Memberships:
├── IT Department (Primary)
│   ├── Role: MEMBER
│   ├── joined_date: 2023-03-01
│   └── left_date: NULL
│
└── Project Phoenix (Secondary)
    ├── Role: LEAD
    ├── joined_date: 2025-01-10
    ├── left_date: 2025-06-30 (project ended)
    └── notes: "Technical lead for Phoenix project"
```

#### Example 3: Department Transfer History
```
Employee: Carol Davis
Position: HR Manager

Department Memberships (Historical):
├── HR Department (Primary, Current)
│   ├── Role: DEPUTY_MANAGER
│   ├── joined_date: 2024-07-01
│   └── left_date: NULL
│
└── Recruitment Team (Primary, Previous)
    ├── Role: LEAD
    ├── joined_date: 2023-01-15
    ├── left_date: 2024-06-30
    └── notes: "Promoted to HR Manager"
```

### Unique Constraint Logic

```
unique_together = ('tenant', 'employee', 'department')

Prevents:
- Duplicate active memberships
- Same employee in same department twice

Allows:
- Multiple departments per employee ✓
- Historical records (different dates) ✓
- Cross-tenant duplicates (different tenants) ✓

Note: Historical records are distinguished by left_date
```

### Field Specifications

| Field | Type | Required | Purpose |
|-------|------|----------|---------|
| employee | ForeignKey | Yes | Employee being assigned |
| department | ForeignKey | Yes | Department assigned to |
| is_primary | Boolean | Yes (default False) | Primary department flag |
| notes | TextField | No | Additional information |
| tenant | ForeignKey | Yes (inherited) | Multi-tenancy support |

### Use Cases

| Use Case | Configuration | Example |
|----------|--------------|---------|
| Single Department | 1 membership, is_primary=True | Regular employee |
| Cross-Functional | Multiple memberships, 1 primary | DevOps engineer |
| Project Assignment | Primary + project depts | Temp project work |
| Department Transfer | Close old, create new | Promotion/reorganization |
| Historical Tracking | Memberships with left_date | Career history |

### Expected Outcome
- DepartmentMember model created
- Employee-Department many-to-many relationship
- Primary department designation
- Foundation for membership tracking
- Multi-department support

### Verification Checklist
- [ ] department_member.py file created
- [ ] DepartmentMember class defined
- [ ] employee ForeignKey added
- [ ] department ForeignKey added
- [ ] is_primary field added
- [ ] notes field added
- [ ] Meta class configured
- [ ] unique_together constraint set
- [ ] __str__ method implemented
- [ ] clean method for validation
- [ ] Model imported in __init__.py

---

## Task 35: Add Membership Date Fields

### Overview
Add date tracking fields to the DepartmentMember model to record when an employee joined and left a department. These fields enable temporal tracking of department memberships, support historical reporting, and facilitate accurate membership period calculations.

### Dependencies
- Task 34: Create DepartmentMember Model

### Instructions

1. **Open department_member.py model file**
   - Navigate to `apps/organization/models/department_member.py`
   - Locate DepartmentMember model class

2. **Add joined_date field**
   - DateField type
   - Required field (no null/blank)
   - Represents start of membership
   - Default to current date

3. **Add left_date field**
   - DateField type
   - Optional (null=True, blank=True)
   - Represents end of membership
   - NULL means currently active

4. **Add help_text to both fields**
   - joined_date: "Date when employee joined this department"
   - left_date: "Date when employee left this department (NULL if still active)"

5. **Add computed property is_active**
   - Property decorator
   - Returns True if left_date is None
   - Returns False if left_date is set

6. **Add computed property duration**
   - Property decorator
   - Calculate membership duration
   - Use left_date or current date as end
   - Return timedelta object

7. **Update clean method**
   - Validate left_date >= joined_date
   - Prevent future joined_date
   - Raise ValidationError for invalid dates

8. **Add date-based manager method**
   - Create custom manager
   - Add `active()` method for current memberships
   - Add `ended()` method for past memberships
   - Add `as_of(date)` method for point-in-time queries

9. **Update __str__ method**
   - Include membership status (Active/Ended)
   - Show date range
   - Format: "Employee - Department (joined_date to left_date)"

10. **Update Meta class**
    - Add index on joined_date
    - Add index on left_date
    - Add index on (employee, left_date) for active queries

### Date Field Structure

```
DepartmentMember Date Fields
═══════════════════════════════

joined_date (DateField, Required)
├── Marks start of membership
├── Cannot be in future
├── Must be <= left_date if set
└── Default: date.today()

left_date (DateField, Optional)
├── Marks end of membership
├── NULL = currently active
├── Set on department transfer
└── Must be >= joined_date

Computed Properties:
├── is_active → left_date is None
├── duration → (left_date or today) - joined_date
└── days_active → duration.days
```

### Membership Status States

```
┌─────────────────────────────────────────────────┐
│  Membership Status State Machine                │
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌─────────────┐     Set left_date             │
│  │   ACTIVE    │─────────────────►┌──────────┐ │
│  │ (left=NULL) │                  │  ENDED   │ │
│  └─────────────┘                  │(left set)│ │
│        │                          └──────────┘ │
│        │                                ▲      │
│        │ Create new membership          │      │
│        └────────────────────────────────┘      │
│          (Transfer to another dept)            │
└─────────────────────────────────────────────────┘
```

### Active vs Ended Memberships

| Field | Active Membership | Ended Membership |
|-------|------------------|------------------|
| joined_date | 2024-01-15 | 2023-06-01 |
| left_date | NULL | 2024-12-31 |
| is_active | True | False |
| duration | Today - joined_date | left_date - joined_date |
| Meaning | Currently in department | No longer in department |

### Date Validation Rules

```
Validation Rules
════════════════

Rule 1: Joined Date Not in Future
✗ joined_date = 2027-01-01 (if today is 2026-01-24)
✓ joined_date = 2026-01-20
✓ joined_date = 2025-12-01

Rule 2: Left Date After Joined Date
✗ joined_date = 2025-06-01, left_date = 2025-05-15
✓ joined_date = 2025-06-01, left_date = 2025-12-31
✓ joined_date = 2025-06-01, left_date = 2025-06-01 (same day OK)

Rule 3: Left Date Can Be Future (Notice Period)
✓ joined_date = 2024-01-01, left_date = 2026-02-28
  (Employee given notice, leaving in future)
```

### Membership Duration Calculation

```python
# Pseudo-code for duration calculation

@property
def duration(self):
    """Calculate membership duration"""
    end_date = self.left_date or date.today()
    return end_date - self.joined_date

@property
def duration_days(self):
    """Duration in days"""
    return self.duration.days

@property
def duration_months(self):
    """Approximate duration in months"""
    return self.duration_days // 30

@property  
def duration_years(self):
    """Approximate duration in years"""
    return self.duration_days // 365
```

### Custom Manager Methods

```python
# Pseudo-code for manager methods

class DepartmentMemberManager(models.Manager):
    
    def active(self):
        """Get active memberships (left_date is NULL)"""
        return self.filter(left_date__isnull=True)
    
    def ended(self):
        """Get ended memberships"""
        return self.filter(left_date__isnull=False)
    
    def as_of(self, date):
        """Get memberships active on specific date"""
        return self.filter(
            joined_date__lte=date,
            Q(left_date__gte=date) | Q(left_date__isnull=True)
        )
    
    def between(self, start_date, end_date):
        """Get memberships active between dates"""
        return self.filter(
            joined_date__lte=end_date,
            Q(left_date__gte=start_date) | Q(left_date__isnull=True)
        )
```

### Query Examples

#### Get Active Memberships
```
Purpose: Find all current department memberships
Query: DepartmentMember.objects.active()
Result: All records where left_date is NULL
```

#### Get Employee's Department History
```
Purpose: Show all departments employee has been in
Query: employee.department_memberships.all().order_by('joined_date')
Result: Chronological list of all memberships
```

#### Department Membership on Specific Date
```
Purpose: Who was in IT department on 2025-01-01?
Query: DepartmentMember.objects.as_of('2025-01-01').filter(department__code='IT')
Result: All memberships active on that date
```

#### Calculate Average Tenure
```
Purpose: Average membership duration in department
Query: Calculate duration for all ended memberships
Aggregate: Average of duration_days
Result: Mean tenure in days
```

### Date-Based Reporting Examples

#### Current Department Roster
```
Report: All active employees in department
Data: DepartmentMember.objects.active().filter(department=dept)
Columns: Employee Name, Designation, Joined Date, Duration
```

#### Department Transfer Report
```
Report: Employees who changed departments in 2025
Data: Memberships with left_date in 2025
Columns: Employee, From Department, To Department, Transfer Date
```

#### Tenure Analysis
```
Report: Employee tenure distribution
Data: All active memberships
Grouping: 0-1 year, 1-3 years, 3-5 years, 5+ years
Chart: Bar chart of tenure ranges
```

### Integration with Employee.department FK

```
Relationship Between Fields
═══════════════════════════

Employee.department (FK)
├── Denormalized field for quick access
├── Points to primary department
└── Updated by signals (Task 38)

DepartmentMember (is_primary=True)
├── Normalized membership record
├── Full history and details
└── Source of truth

Synchronization:
When DepartmentMember changes:
1. If is_primary=True
2. Update Employee.department
3. Via post_save signal (Task 38)
```

### Expected Outcome
- Date fields added to DepartmentMember
- Active/ended membership tracking
- Duration calculation capability
- Historical membership queries
- Foundation for transfer tracking

### Verification Checklist
- [ ] joined_date field added
- [ ] left_date field added
- [ ] help_text added to both fields
- [ ] is_active property implemented
- [ ] duration property implemented
- [ ] clean method updated for date validation
- [ ] Custom manager created with active/ended methods
- [ ] as_of method implemented
- [ ] Meta indexes added for date fields
- [ ] __str__ method updated

---

## Task 36: Add Membership Role Field

### Overview
Add a role field to the DepartmentMember model to specify the employee's role within the department. This field distinguishes between regular members, team leads, and deputy managers, enabling role-based permissions, organizational hierarchy representation, and accurate team structure reporting.

### Dependencies
- Task 35: Add Membership Date Fields

### Instructions

1. **Open department_member.py model file**
   - Continue in `apps/organization/models/department_member.py`
   - Locate DepartmentMember model class

2. **Define ROLE_CHOICES constant**
   - Create tuple before model class
   - Define three role options
   - Follow Django choices pattern

3. **Define ROLE_MEMBER constant**
   - Value: 'MEMBER'
   - Display: 'Member'
   - Default role for regular members

4. **Define ROLE_LEAD constant**
   - Value: 'LEAD'
   - Display: 'Lead'
   - Team or project lead within department

5. **Define ROLE_DEPUTY_MANAGER constant**
   - Value: 'DEPUTY_MANAGER'
   - Display: 'Deputy Manager'
   - Second-in-command role

6. **Add role field**
   - CharField with choices from ROLE_CHOICES
   - Max length 20
   - Default to ROLE_MEMBER
   - Required field (no null/blank)

7. **Add help_text**
   - Describe role purpose
   - Note: "Employee's role within the department"
   - Explain role hierarchy

8. **Add role-based properties**
   - is_lead property: Returns True if role is LEAD
   - is_deputy_manager property: Returns True if role is DEPUTY_MANAGER
   - is_member property: Returns True if role is MEMBER

9. **Add role-based manager methods**
   - leads() method: Filter members with LEAD role
   - deputy_managers() method: Filter deputy managers
   - regular_members() method: Filter MEMBER role

10. **Update __str__ method**
    - Include role in string representation
    - Format: "Employee - Department (Role)"

### Role Field Structure

```
DepartmentMember Role Field
═══════════════════════════

role (CharField, Choices)
├── MEMBER (default)
│   ├── Regular team member
│   ├── No special privileges
│   └── Most common role
│
├── LEAD
│   ├── Team/project lead
│   ├── Coordinates team activities
│   └── May have approval rights
│
└── DEPUTY_MANAGER
    ├── Second-in-command
    ├── Acts for department head
    └── Higher authority level
```

### Role Hierarchy

```
Department Role Hierarchy
═════════════════════════

Level 3: Department Head (DepartmentHead model, Task 40)
           │
           ├─────────────┐
           │             │
Level 2: DEPUTY_MANAGER  LEAD (multiple possible)
           │             │
           │             ├── Team/Project Leads
           │             └── Subject Matter Experts
           │
Level 1: MEMBER (regular employees)
```

### Role Definitions and Responsibilities

| Role | Level | Typical Count | Responsibilities | Permissions |
|------|-------|---------------|------------------|-------------|
| MEMBER | 1 | Many | Regular work, follow processes | Standard access |
| LEAD | 2 | Few | Team coordination, mentoring | Team-level approvals |
| DEPUTY_MANAGER | 2 | 1-2 | Dept management support, acting head | Department-level approvals |

### Role Assignment Examples

#### Example 1: IT Department
```
IT Department (20 employees)
├── Department Head: Sarah Johnson (DepartmentHead model)
├── Deputy Manager: Mike Brown (DepartmentMember, DEPUTY_MANAGER)
├── Leads:
│   ├── DevOps Lead: Alice Cooper (LEAD)
│   ├── Frontend Lead: Bob Wilson (LEAD)
│   └── Backend Lead: Carol Davis (LEAD)
└── Members: 15 developers (MEMBER)
```

#### Example 2: Sales Department
```
Sales Department (30 employees)
├── Department Head: Tom Anderson
├── Deputy Managers:
│   ├── Regional Deputy: Jane Smith (DEPUTY_MANAGER)
│   └── Operations Deputy: John Doe (DEPUTY_MANAGER)
├── Team Leads:
│   ├── Enterprise Sales Lead: Emily Brown (LEAD)
│   ├── SMB Sales Lead: Chris Lee (LEAD)
│   └── Inside Sales Lead: Pat Taylor (LEAD)
└── Sales Representatives: 24 reps (MEMBER)
```

#### Example 3: Cross-Functional Assignment
```
Employee: David Miller (Senior Developer)

Primary Department: IT Development
├── Role: MEMBER
└── Joined: 2024-01-15

Secondary: Project Phoenix
├── Role: LEAD (project technical lead)
├── Joined: 2025-01-10
└── Notes: "Technical lead for Phoenix initiative"

Secondary: Security Review Team
├── Role: MEMBER
├── Joined: 2025-01-20
└── Notes: "Security code review participation"
```

### Role-Based Queries

```python
# Pseudo-code for role-based queries

# Get all team leads in IT department
it_leads = DepartmentMember.objects.filter(
    department__code='IT',
    role='LEAD',
    left_date__isnull=True
)

# Get deputy managers across all departments
deputy_managers = DepartmentMember.objects.filter(
    role='DEPUTY_MANAGER',
    left_date__isnull=True
)

# Count members by role in department
role_distribution = dept.members.active().values('role').annotate(
    count=Count('id')
)
```

### Role vs Department Head

```
Distinction: Role vs Head
═════════════════════════

DepartmentMember.role = DEPUTY_MANAGER
├── Member of the department
├── Has elevated role
├── Can act for head
└── One of many members

DepartmentHead (Task 40)
├── Separate model
├── Department manager/head
├── Highest authority
├── Tracked separately with tenure
└── One active head per department

Example:
IT Department:
├── DepartmentHead: Sarah (overall manager)
├── DepartmentMember: Mike (DEPUTY_MANAGER, can act for Sarah)
└── DepartmentMember: Others (LEAD or MEMBER)
```

### Role Transition Scenarios

#### Promotion to Lead
```
Scenario: Regular member promoted to team lead
Action:
1. Update existing DepartmentMember record
2. Change role from MEMBER to LEAD
3. Log change in audit trail
4. No new membership record needed (same department)
```

#### Transfer with Role Change
```
Scenario: Lead transferred to new department as member
Action:
1. Close old membership (set left_date, role was LEAD)
2. Create new membership (new department, role MEMBER)
3. Update Employee.department FK
4. Triggered by transfer signal (Task 38)
```

#### Acting Deputy Manager
```
Scenario: Temporary deputy manager assignment
Option 1: Change role temporarily
├── Update role to DEPUTY_MANAGER
├── Add note: "Acting deputy, Jan-Mar 2026"
└── Change back to MEMBER when period ends

Option 2: Use DepartmentHead model with is_acting flag
├── Better for formal acting head appointments
└── Separate from regular membership role
```

### Role-Based Permissions (Future Integration)

```
Permission Framework Integration
════════════════════════════════

MEMBER role:
├── View department information
├── Submit requests/forms
└── Access shared resources

LEAD role:
├── All MEMBER permissions
├── Approve team member requests
├── Assign tasks within team
└── View team reports

DEPUTY_MANAGER role:
├── All LEAD permissions
├── Department-level approvals
├── Act for department head
├── Access sensitive dept data
└── Manage department settings
```

### Expected Outcome
- Role field added to DepartmentMember
- Three-tier role hierarchy established
- Role-based query methods
- Foundation for role-based permissions
- Clear organizational structure

### Verification Checklist
- [ ] ROLE_CHOICES tuple defined
- [ ] ROLE_MEMBER constant created
- [ ] ROLE_LEAD constant created
- [ ] ROLE_DEPUTY_MANAGER constant created
- [ ] role field added with choices
- [ ] Default set to ROLE_MEMBER
- [ ] help_text added
- [ ] is_lead property implemented
- [ ] is_deputy_manager property implemented
- [ ] is_member property implemented
- [ ] Manager methods for role filtering
- [ ] __str__ method updated with role

---

## Task 37: Run DepartmentMember Migrations

### Overview
Generate and apply Django migrations for the DepartmentMember model. This creates the database table and all associated fields, constraints, and indexes for department membership tracking.

### Dependencies
- Task 34: Create DepartmentMember Model
- Task 35: Add Membership Date Fields
- Task 36: Add Membership Role Field

### Instructions

1. **Review model completeness**
   - Open `apps/organization/models/department_member.py`
   - Verify all fields are defined:
     - employee (FK)
     - department (FK)
     - joined_date
     - left_date
     - role
     - is_primary
     - notes
   - Check Meta configuration
   - Verify model imports in __init__.py

2. **Generate migration file**
   - Open terminal in project root
   - Activate virtual environment
   - Run makemigrations for organization app
   - Command: `python manage.py makemigrations organization`

3. **Review generated migration**
   - Navigate to `apps/organization/migrations/`
   - Locate new migration file (e.g., `0003_member.py`)
   - Review CreateModel operation
   - Verify all fields present
   - Check constraints and indexes

4. **Check migration dependencies**
   - Ensure depends on previous organization migrations
   - Must depend on Employee model migration
   - Verify dependency chain

5. **Apply migration**
   - Run migrate command
   - Command: `python manage.py migrate organization`
   - Monitor output for errors
   - Verify successful completion

6. **Verify database changes**
   - Connect to database
   - Check organization_departmentmember table exists
   - Verify all columns created
   - Check foreign key constraints
   - Verify indexes created

7. **Test model functionality**
   - Open Django shell
   - Test creating DepartmentMember instance
   - Verify relationships work
   - Test manager methods

### Migration File Structure

```
Migration: 0003_member.py
═════════════════════════════════════

from django.db import migrations, models
import django.db.models.deletion

class Migration(migrations.Migration):
    
    dependencies = [
        ('organization', '0002_designation_levels'),
        ('employees', '0009_fk_updates'),
    ]
    
    operations = [
        migrations.CreateModel(
            name='DepartmentMember',
            fields=[
                ('id', models.BigAutoField(...)),
                ('created_at', models.DateTimeField(...)),
                ('updated_at', models.DateTimeField(...)),
                ('joined_date', models.DateField()),
                ('left_date', models.DateField(blank=True, null=True)),
                ('role', models.CharField(
                    choices=[...],
                    default='MEMBER',
                    max_length=20
                )),
                ('is_primary', models.BooleanField(default=False)),
                ('notes', models.TextField(blank=True, null=True)),
                ('department', models.ForeignKey(...)),
                ('employee', models.ForeignKey(...)),
                ('tenant', models.ForeignKey(...)),
            ],
            options={
                'verbose_name': 'Department Member',
                'verbose_name_plural': 'Department Members',
                'ordering': ['employee__last_name', 'joined_date'],
                'unique_together': {('tenant', 'employee', 'department')},
            },
        ),
        migrations.AddIndex(
            model_name='departmentmember',
            index=models.Index(fields=['tenant', 'employee']),
        ),
        migrations.AddIndex(
            model_name='departmentmember',
            index=models.Index(fields=['tenant', 'department']),
        ),
        migrations.AddIndex(
            model_name='departmentmember',
            index=models.Index(fields=['left_date']),
        ),
    ]
```

### Database Schema

```
Table: organization_departmentmember
═══════════════════════════════════════════════

Column Name          Type              Constraints
─────────────────────────────────────────────────
id                   BIGINT            PRIMARY KEY
tenant_id            BIGINT            NOT NULL, FK→tenants
employee_id          BIGINT            NOT NULL, FK→employees
department_id        BIGINT            NOT NULL, FK→organization_department
joined_date          DATE              NOT NULL
left_date            DATE              NULL
role                 VARCHAR(20)       NOT NULL, DEFAULT 'MEMBER'
is_primary           BOOLEAN           NOT NULL, DEFAULT FALSE
notes                TEXT              NULL
created_at           TIMESTAMP         NOT NULL
updated_at           TIMESTAMP         NOT NULL

Indexes:
├── PRIMARY KEY (id)
├── UNIQUE (tenant_id, employee_id, department_id)
├── INDEX (tenant_id, employee_id)
├── INDEX (tenant_id, department_id)
├── INDEX (left_date)
└── INDEX (role)

Foreign Keys:
├── FK: employee_id → employees_employee.id (CASCADE)
├── FK: department_id → organization_department.id (CASCADE)
└── FK: tenant_id → tenants_tenant.id (CASCADE)
```

### Migration Commands

```bash
# Step 1: Generate migration
python manage.py makemigrations organization

# Expected output:
# Migrations for 'organization':
#   apps/organization/migrations/0003_member.py
#     - Create model DepartmentMember

# Step 2: Review SQL (optional)
python manage.py sqlmigrate organization 0003

# Step 3: Check migration plan
python manage.py showmigrations organization

# Step 4: Apply migration
python manage.py migrate organization

# Expected output:
# Running migrations:
#   Applying organization.0003_member... OK
```

### Post-Migration Testing

```python
# Django shell testing
python manage.py shell

# Test 1: Create membership
from apps.employees.models import Employee
from apps.organization.models import Department, DepartmentMember
from datetime import date

emp = Employee.objects.first()
dept = Department.objects.first()

membership = DepartmentMember.objects.create(
    employee=emp,
    department=dept,
    joined_date=date.today(),
    role='MEMBER',
    is_primary=True
)

# Test 2: Query active memberships
active = DepartmentMember.objects.filter(left_date__isnull=True)
print(f"Active memberships: {active.count()}")

# Test 3: Test relationships
print(f"Employee: {membership.employee.full_name}")
print(f"Department: {membership.department.name}")
print(f"Is Active: {membership.is_active}")

# Test 4: Test manager methods
leads = DepartmentMember.objects.filter(role='LEAD')
print(f"Team leads: {leads.count()}")
```

### Verification Queries

```sql
-- Verify table creation
SELECT table_name 
FROM information_schema.tables 
WHERE table_name = 'organization_departmentmember';

-- Check columns
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'organization_departmentmember'
ORDER BY ordinal_position;

-- Verify indexes
SELECT indexname, indexdef
FROM pg_indexes
WHERE tablename = 'organization_departmentmember';

-- Check foreign keys
SELECT conname, contype
FROM pg_constraint
WHERE conrelid = 'organization_departmentmember'::regclass;
```

### Common Issues and Solutions

| Issue | Symptom | Solution |
|-------|---------|----------|
| Missing Employee FK | Foreign key error | Run employees migration 0009 first |
| Duplicate migration | Multiple 0003 files | Delete duplicate, regenerate |
| Constraint violation | Unique constraint error | Check for duplicate data |
| Index creation fails | Index already exists | Drop old index, rerun migration |
| Import error | Cannot import DepartmentMember | Check __init__.py imports |

### Rollback Procedure

```bash
# If issues occur, rollback
python manage.py migrate organization 0002_designation_levels

# This will:
# 1. Drop organization_departmentmember table
# 2. Remove all indexes and constraints
# 3. Restore previous state

# Fix issues, then re-apply
python manage.py migrate organization 0003_member
```

### Data Population Considerations

#### Initial Data
- New table starts empty
- Existing Employee.department FK still valid
- Need to populate DepartmentMember from Employee data
- Consider data migration script

#### Data Migration Script (Optional)
```python
# Create DepartmentMember records from Employee.department

Purpose: Populate initial memberships from Employee.department FK

Steps:
1. Get all employees with department assigned
2. For each employee:
   a. Create DepartmentMember record
   b. Set department from Employee.department
   c. Set is_primary=True
   d. Set joined_date (use hire_date or estimate)
   e. Set role=MEMBER (default)
3. Handle employees without department (skip)
```

### Expected Outcome
- Migration file generated
- Database table created
- All fields and constraints in place
- Indexes created for performance
- Model fully functional
- Ready for membership tracking

### Verification Checklist
- [ ] Migration file generated
- [ ] Migration reviewed
- [ ] Dependencies correct
- [ ] Migration applied successfully
- [ ] Table created in database
- [ ] All columns exist
- [ ] Foreign keys established
- [ ] Indexes created
- [ ] Unique constraint working
- [ ] Model import works
- [ ] Can create instances
- [ ] Relationships functional
- [ ] Manager methods work

---

## Summary

This document established employee-department relationships and membership tracking:

### Completed Infrastructure
- ✅ Employee model updated with department FK
- ✅ Employee model updated with designation FK
- ✅ Employee FK migrations applied
- ✅ DepartmentMember model created
- ✅ Membership date tracking (joined_date, left_date)
- ✅ Membership role system (MEMBER, LEAD, DEPUTY_MANAGER)
- ✅ DepartmentMember migrations applied

### Key Achievements
1. **Employee Links** - Direct FK relationships to Department and Designation
2. **Multi-Department Support** - Employees can belong to multiple departments
3. **Primary Department** - Clear designation of primary affiliation
4. **Historical Tracking** - Date-based membership history
5. **Role Hierarchy** - Three-tier role system within departments
6. **Active/Ended Tracking** - Temporal membership status

### Data Model Summary

```
Employee Model:
├── department (FK) → Primary department
└── designation (FK) → Job role/position

DepartmentMember Model (Junction Table):
├── employee (FK) → Employee being assigned
├── department (FK) → Department assigned to
├── joined_date → Start of membership
├── left_date → End of membership (NULL if active)
├── role → MEMBER / LEAD / DEPUTY_MANAGER
├── is_primary → Primary department flag
└── notes → Additional information
```

### Next Steps
Proceed to [02_Tasks-38-44_Signals-Head-Validation.md](02_Tasks-38-44_Signals-Head-Validation.md) to implement department transfer signals, designation change signals, DepartmentHead model, and validation logic.

---

**Document Status:** ✅ Complete  
**Total Tasks:** 7  
**Estimated Time:** 130 minutes
