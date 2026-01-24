# Tasks 38-44: Signals, Department Head, and Validation

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 02 - Department & Designations  
> **Group:** C - Department-Employee Links  
> **Document:** 02 of 02  
> **Tasks Covered:** 38, 39, 40, 41, 42, 43, 44

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-31-37_Employee-FK-Membership.md](01_Tasks-31-37_Employee-FK-Membership.md)

---

## Document Overview

This document covers the advanced features of employee-department integration: department transfer and designation change signals for automatic tracking, the DepartmentHead model for managing department leadership with history, and validation logic to prevent circular manager references and ensure department consistency. These elements complete the employee-department relationship system with automation and data integrity.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 38 | Create Department Transfer Signal | High | 30 min |
| 39 | Create Designation Change Signal | High | 30 min |
| 40 | Create DepartmentHead Model | Medium | 25 min |
| 41 | Add Head Tenure Fields | Medium | 20 min |
| 42 | Run DepartmentHead Migrations | Low | 15 min |
| 43 | Validate Circular Manager | High | 30 min |
| 44 | Validate Department Consistency | Medium | 25 min |

---

## Task 38: Create Department Transfer Signal

### Overview
Create a Django signal that automatically tracks department transfers when an employee's department assignment changes. This signal closes the current DepartmentMember record (if exists), creates a new DepartmentMember record for the new department, optionally creates an employment history record, and invalidates relevant caches.

### Dependencies
- Task 37: Run DepartmentMember Migrations
- Employee model with department FK exists
- DepartmentMember model exists
- Django signals framework

### Instructions

1. **Create signals.py file**
   - Create file at `apps/organization/signals.py`
   - Import necessary Django signal components
   - Import models (Employee, Department, DepartmentMember)

2. **Import required modules**
   - Import post_save signal
   - Import receiver decorator
   - Import timezone utilities
   - Import Q objects for complex queries

3. **Define track_department_transfer function**
   - Use @receiver decorator for Employee post_save
   - Function signature: (sender, instance, created, **kwargs)
   - Only process if not created (updates only)

4. **Check if department changed**
   - Get previous department value from database
   - Compare with instance.department
   - Exit early if no change

5. **Handle previous department membership**
   - Query active DepartmentMember for old department
   - Set left_date to today
   - Save the record
   - Mark as no longer primary

6. **Create new department membership**
   - If new department is not None
   - Create DepartmentMember record
   - Set joined_date to today
   - Set is_primary=True
   - Set role='MEMBER' (default)

7. **Create employment history record**
   - Optional: If EmploymentHistory model exists
   - Record the department change
   - Include from_department and to_department
   - Add change reason

8. **Invalidate caches**
   - Clear department roster cache
   - Clear org chart cache
   - Clear employee count cache
   - Use cache key patterns

9. **Add signal connection**
   - Connect signal in apps.py ready() method
   - Or use receiver decorator (auto-connects)

10. **Add logging**
    - Log department transfers
    - Include employee name, old dept, new dept
    - Use Python logging module

### Signal Flow Diagram

```
Department Transfer Signal Flow
═══════════════════════════════════════

Employee.department updated
         │
         ▼
   post_save signal triggered
         │
         ▼
   Check if department changed
         │
         ├─ No → Exit (no action)
         │
         └─ Yes → Continue
                  │
                  ▼
            Get old department
                  │
                  ▼
      Close old DepartmentMember
      (set left_date = today)
                  │
                  ▼
      Create new DepartmentMember
      (joined_date = today, is_primary=True)
                  │
                  ▼
      Create EmploymentHistory record
                  │
                  ▼
         Invalidate caches
                  │
                  ▼
            Log transfer
```

### Signal Handler Structure

```python
# Pseudo-code structure

from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils import timezone
from datetime import date

@receiver(post_save, sender=Employee)
def track_department_transfer(sender, instance, created, **kwargs):
    """
    Track employee department transfers
    
    Triggered when Employee.department changes
    - Closes old DepartmentMember record
    - Creates new DepartmentMember record
    - Logs change in employment history
    """
    
    # Skip for new employees
    if created:
        return
    
    # Get previous department from database
    old_employee = Employee.objects.get(pk=instance.pk)
    old_department = old_employee.department
    new_department = instance.department
    
    # Exit if no change
    if old_department == new_department:
        return
    
    # Close old membership
    if old_department:
        close_department_membership(instance, old_department)
    
    # Create new membership
    if new_department:
        create_department_membership(instance, new_department)
    
    # Log history
    log_department_transfer(instance, old_department, new_department)
    
    # Clear caches
    invalidate_department_caches(old_department, new_department)
```

### Helper Functions

#### Close Department Membership
```
Purpose: End active membership in old department

Steps:
1. Query: Get active DepartmentMember for employee & old department
   Filter: employee=instance, department=old_dept, left_date__isnull=True
2. If found:
   a. Set left_date = date.today()
   b. If is_primary=True, set to False
   c. Save record
3. Handle multiple active memberships (data integrity issue)
```

#### Create Department Membership
```
Purpose: Start membership in new department

Steps:
1. Create DepartmentMember instance:
   - employee = instance
   - department = new_department
   - joined_date = date.today()
   - is_primary = True
   - role = 'MEMBER' (default)
2. Save record
3. Unset other primary memberships (business rule)
```

#### Log Transfer History
```
Purpose: Record transfer in employment history

Steps:
1. Check if EmploymentHistory model exists
2. Create record:
   - employee = instance
   - change_type = 'DEPARTMENT_TRANSFER'
   - from_department = old_department
   - to_department = new_department
   - change_date = date.today()
   - notes = Auto-generated description
3. Save history record
```

### Transfer Scenarios

#### Scenario 1: Regular Transfer
```
Initial State:
Employee: John Doe
├── department: IT
└── DepartmentMember: IT (active, primary)

Action: Set employee.department = Sales

Signal Processing:
1. Detect change: IT → Sales
2. Close IT membership (set left_date)
3. Create Sales membership (set joined_date, primary)
4. Log transfer

Final State:
Employee: John Doe
├── department: Sales
├── DepartmentMember: IT (ended, left_date set)
└── DepartmentMember: Sales (active, primary)
```

#### Scenario 2: Assignment from NULL
```
Initial State:
Employee: Jane Smith (new hire)
├── department: NULL
└── No DepartmentMember records

Action: Set employee.department = HR

Signal Processing:
1. Detect change: NULL → HR
2. No old membership to close (skip)
3. Create HR membership (primary)
4. Log assignment

Final State:
Employee: Jane Smith
├── department: HR
└── DepartmentMember: HR (active, primary)
```

#### Scenario 3: Unassignment
```
Initial State:
Employee: Bob Wilson
├── department: Marketing
└── DepartmentMember: Marketing (active, primary)

Action: Set employee.department = NULL

Signal Processing:
1. Detect change: Marketing → NULL
2. Close Marketing membership
3. No new membership to create
4. Log unassignment

Final State:
Employee: Bob Wilson
├── department: NULL
└── DepartmentMember: Marketing (ended)
```

#### Scenario 4: Secondary Department (Manual)
```
Note: Signal only handles Employee.department (primary)
For secondary departments:

Manual Process:
1. Create DepartmentMember directly
2. Set is_primary=False
3. Set appropriate role
4. Employee.department unchanged (still points to primary)

Example:
Employee: Alice Johnson
├── department: IT (primary, via FK)
├── DepartmentMember: IT (primary, MEMBER)
└── DepartmentMember: Project Team (secondary, LEAD)
   Created manually, signal not triggered
```

### Cache Invalidation

```
Cache Keys to Invalidate
════════════════════════

Department Roster:
├── Key: "dept_roster_{department_id}"
├── Contains: List of active employees
└── Clear for both old and new departments

Org Chart:
├── Key: "org_chart_{tenant_id}"
├── Contains: Full organization hierarchy
└── Clear tenant-wide cache

Employee Count:
├── Key: "dept_employee_count_{department_id}"
├── Contains: Count of active employees
└── Clear for both departments

Department Stats:
├── Key: "dept_stats_{department_id}"
├── Contains: Various department metrics
└── Clear for both departments
```

### Transaction Safety

```
Signal Execution Context
════════════════════════

Consideration: Signals run in same database transaction
Risk: If signal fails, entire save() fails
Solution: Wrap signal logic in try-except

Pattern:
try:
    # Signal processing
    close_old_membership()
    create_new_membership()
    log_history()
except Exception as e:
    # Log error but don't prevent save
    logger.error(f"Transfer signal error: {e}")
    # Decide: Re-raise or swallow?
    # Re-raise: Transaction rolls back, save fails
    # Swallow: Save succeeds, signal effects skipped
```

### Testing Considerations

```
Test Cases
══════════

1. Test transfer between departments
   - Assert old membership closed
   - Assert new membership created
   - Verify dates correct

2. Test assignment from NULL
   - Assert no error on NULL old department
   - Assert new membership created

3. Test unassignment to NULL
   - Assert old membership closed
   - Assert no error on NULL new department

4. Test no-change update
   - Assert signal exits early
   - Assert no database changes

5. Test new employee creation
   - Assert signal doesn't fire (created=True)
   - No membership auto-created

6. Test cache invalidation
   - Mock cache backend
   - Assert appropriate keys cleared
```

### Expected Outcome
- Department transfers automatically tracked
- DepartmentMember records managed automatically
- Employment history recorded
- Caches invalidated appropriately
- Reliable transfer tracking

### Verification Checklist
- [ ] signals.py file created
- [ ] track_department_transfer function defined
- [ ] @receiver decorator applied
- [ ] Department change detection logic
- [ ] Old membership closure logic
- [ ] New membership creation logic
- [ ] Employment history logging
- [ ] Cache invalidation logic
- [ ] Error handling implemented
- [ ] Logging added
- [ ] Signal connected (apps.py or decorator)
- [ ] Unit tests written

---

## Task 39: Create Designation Change Signal

### Overview
Create a Django signal that automatically tracks designation changes when an employee's designation assignment changes. This signal logs designation changes in employment history, triggers notifications if needed, updates employee records, and invalidates relevant caches.

### Dependencies
- Task 38: Create Department Transfer Signal
- Employee model with designation FK exists
- Designation model exists
- signals.py file exists

### Instructions

1. **Open signals.py file**
   - Continue in `apps/organization/signals.py`
   - Prepare to add designation change handler

2. **Define track_designation_change function**
   - Use @receiver decorator for Employee post_save
   - Function signature: (sender, instance, created, **kwargs)
   - Only process if not created

3. **Check if designation changed**
   - Get previous designation from database
   - Compare with instance.designation
   - Exit early if no change

4. **Create employment history record**
   - Log the designation change
   - Include from_designation and to_designation
   - Record change_type as 'DESIGNATION_CHANGE'
   - Add change_date

5. **Determine change type**
   - Promotion: New designation level > old level
   - Demotion: New designation level < old level
   - Lateral: Same level, different designation
   - Assignment: From NULL to designation
   - Unassignment: From designation to NULL

6. **Update related records**
   - Update manager relationships if designation affects hierarchy
   - Update permissions if role changed
   - Update access levels based on new designation

7. **Send notifications**
   - Optional: Notify employee of designation change
   - Notify HR department
   - Notify manager
   - Use notification system if available

8. **Invalidate caches**
   - Clear employee detail cache
   - Clear designation roster cache
   - Clear role-based permission cache

9. **Add logging**
   - Log designation changes
   - Include change type (promotion/demotion/lateral)
   - Log employee name, old/new designation

### Signal Flow Diagram

```
Designation Change Signal Flow
═══════════════════════════════════

Employee.designation updated
         │
         ▼
   post_save signal triggered
         │
         ▼
   Check if designation changed
         │
         ├─ No → Exit
         │
         └─ Yes → Continue
                  │
                  ▼
      Get old designation
                  │
                  ▼
      Determine change type
      (Promotion/Demotion/Lateral)
                  │
                  ▼
      Create EmploymentHistory record
                  │
                  ▼
      Update related records
      (permissions, access levels)
                  │
                  ▼
      Send notifications
      (employee, HR, manager)
                  │
                  ▼
         Invalidate caches
                  │
                  ▼
          Log change
```

### Signal Handler Structure

```python
# Pseudo-code structure

@receiver(post_save, sender=Employee)
def track_designation_change(sender, instance, created, **kwargs):
    """
    Track employee designation changes
    
    Triggered when Employee.designation changes
    - Logs change in employment history
    - Determines change type (promotion/demotion)
    - Sends notifications
    - Updates permissions/access
    """
    
    # Skip for new employees
    if created:
        return
    
    # Get previous designation
    old_employee = Employee.objects.get(pk=instance.pk)
    old_designation = old_employee.designation
    new_designation = instance.designation
    
    # Exit if no change
    if old_designation == new_designation:
        return
    
    # Determine change type
    change_type = determine_designation_change_type(
        old_designation, 
        new_designation
    )
    
    # Log history
    log_designation_change(
        instance, 
        old_designation, 
        new_designation, 
        change_type
    )
    
    # Update permissions
    update_employee_permissions(instance, new_designation)
    
    # Send notifications
    send_designation_change_notifications(
        instance, 
        old_designation, 
        new_designation, 
        change_type
    )
    
    # Clear caches
    invalidate_designation_caches(instance, old_designation, new_designation)
```

### Change Type Determination

```
Designation Change Type Logic
══════════════════════════════

Compare designation levels to determine type

PROMOTION:
├── old_designation.level < new_designation.level
├── Example: Junior Dev (L2) → Senior Dev (L4)
└── Positive career movement

DEMOTION:
├── old_designation.level > new_designation.level
├── Example: Manager (L6) → Team Lead (L5)
└── Downward movement (rare)

LATERAL:
├── old_designation.level == new_designation.level
├── Example: Frontend Dev (L3) → Backend Dev (L3)
└── Role change at same level

ASSIGNMENT:
├── old_designation is NULL
├── new_designation is set
└── Initial designation assignment

UNASSIGNMENT:
├── old_designation is set
├── new_designation is NULL
└── Designation removal (rare)
```

### Change Type Examples

#### Promotion Example
```
Initial State:
Employee: Sarah Chen
├── designation: Software Developer (Level 3)
└── department: IT

Action: Set designation = Senior Software Developer (Level 4)

Signal Processing:
1. Detect change: Developer (L3) → Senior Developer (L4)
2. Determine type: PROMOTION (4 > 3)
3. Log history with PROMOTION flag
4. Send congratulations notification
5. Update permissions (may grant new access)

Final State:
Employee: Sarah Chen
├── designation: Senior Software Developer (Level 4)
├── EmploymentHistory: PROMOTION record
└── Notifications sent
```

#### Lateral Move Example
```
Initial State:
Employee: Mike Williams
├── designation: Frontend Developer (Level 3)
└── department: IT

Action: Set designation = Backend Developer (Level 3)

Signal Processing:
1. Detect change: Frontend Dev (L3) → Backend Dev (L3)
2. Determine type: LATERAL (3 == 3)
3. Log history with LATERAL flag
4. Send role change notification
5. Update skill-based permissions

Final State:
Employee: Mike Williams
├── designation: Backend Developer (Level 3)
├── EmploymentHistory: LATERAL record
└── Updated permissions
```

#### Initial Assignment Example
```
Initial State:
Employee: Jessica Brown (new hire, pending)
├── designation: NULL
└── department: Sales

Action: Set designation = Sales Representative (Level 2)

Signal Processing:
1. Detect change: NULL → Sales Rep (L2)
2. Determine type: ASSIGNMENT
3. Log history with ASSIGNMENT flag
4. Send welcome notification
5. Grant role-based permissions

Final State:
Employee: Jessica Brown
├── designation: Sales Representative (Level 2)
├── EmploymentHistory: ASSIGNMENT record
└── Permissions activated
```

### Employment History Record Structure

```
EmploymentHistory Record for Designation Change
═══════════════════════════════════════════════

Fields:
├── employee (FK to Employee)
├── change_type (Choice: DESIGNATION_CHANGE)
├── change_subtype (Choice: PROMOTION/DEMOTION/LATERAL)
├── from_designation (FK to Designation, nullable)
├── to_designation (FK to Designation, nullable)
├── change_date (DateField)
├── effective_date (DateField, optional)
├── reason (TextField, optional)
├── changed_by (FK to User, optional)
└── notes (TextField, optional)

Example Record:
├── employee: Sarah Chen
├── change_type: DESIGNATION_CHANGE
├── change_subtype: PROMOTION
├── from_designation: Software Developer (L3)
├── to_designation: Senior Software Developer (L4)
├── change_date: 2026-01-24
├── reason: "Annual performance review - exceeds expectations"
└── changed_by: HR Manager
```

### Permission Update Logic

```
Permission Update Based on Designation
══════════════════════════════════════

Approach 1: Level-Based Permissions
├── Each level has associated permissions
├── Example: L4+ can approve expenses up to $5000
├── Update: Grant/revoke based on new level

Approach 2: Designation-Specific Permissions
├── Each designation has specific permissions
├── Example: "Manager" can approve leave requests
├── Update: Replace old designation perms with new

Approach 3: Hybrid
├── Combine level and designation permissions
├── Base permissions from level
├── Additional permissions from designation
└── Update: Recalculate full permission set

Implementation:
1. Get old designation permissions
2. Get new designation permissions
3. Revoke old unique permissions
4. Grant new unique permissions
5. Keep common permissions unchanged
```

### Notification System Integration

```
Designation Change Notifications
═════════════════════════════════

Notification Recipients:
├── Employee (subject)
├── Direct manager
├── HR department
├── Payroll (if salary change)
└── Department head (for promotions)

Notification Content by Type:

PROMOTION:
├── Subject: "Congratulations on Your Promotion!"
├── Body: Details of new designation, level, date
├── Action: Review new responsibilities
└── Tone: Congratulatory

LATERAL:
├── Subject: "Role Change Notification"
├── Body: New designation details
├── Action: Review new responsibilities
└── Tone: Informative

DEMOTION:
├── Subject: "Position Change Notification"
├── Body: New designation (tactful)
├── Action: Meeting with manager
└── Tone: Professional, supportive

Delivery Methods:
├── In-app notification
├── Email notification
├── SMS (for important changes)
└── Dashboard alert
```

### Cache Invalidation

```
Cache Keys to Invalidate
════════════════════════

Employee Detail:
├── Key: "employee_detail_{employee_id}"
├── Contains: Full employee information
└── Clear: Always

Designation Roster:
├── Key: "designation_roster_{designation_id}"
├── Contains: All employees with designation
└── Clear: For both old and new designations

Permission Cache:
├── Key: "user_permissions_{user_id}"
├── Contains: Cached permission set
└── Clear: If designation affects permissions

Role-Based Lists:
├── Key: "employees_by_role_{role}"
├── Contains: Filtered employee lists
└── Clear: If designation has role implications

Org Chart:
├── Key: "org_chart_{tenant_id}"
├── Contains: Organizational hierarchy
└── Clear: If is_manager flag changed
```

### Multiple Signal Handlers

```
Signal Coordination
═══════════════════

Two signals on same model (Employee):
├── track_department_transfer (Task 38)
└── track_designation_change (Task 39)

Both listen to: post_save(Employee)

Execution:
├── Both fire on every Employee save
├── Each checks for its specific change
├── Independent execution (no dependency)
└── Order not guaranteed (but doesn't matter)

Example (both change):
Employee: John Doe
├── Update: department=Sales, designation=Manager
├── Signal 1: Detects dept change → processes transfer
└── Signal 2: Detects desig change → processes change
    Both execute, independent of each other
```

### Testing Considerations

```
Test Cases
══════════

1. Test promotion (level increase)
   - Assert history records change type
   - Verify notification sent
   - Check permissions updated

2. Test lateral move (same level)
   - Assert LATERAL type recorded
   - Verify appropriate notifications

3. Test initial assignment (from NULL)
   - Assert ASSIGNMENT type
   - Check permission grant

4. Test demotion (level decrease)
   - Assert DEMOTION type
   - Verify sensitive handling

5. Test unassignment (to NULL)
   - Assert UNASSIGNMENT type
   - Check permission revocation

6. Test no-change update
   - Assert signal exits early
   - No unnecessary processing

7. Test combined department & designation change
   - Both signals fire
   - Both process independently
   - Verify both history records

8. Test cache invalidation
   - Mock cache
   - Assert appropriate keys cleared

9. Test notification delivery
   - Mock notification system
   - Assert correct recipients
   - Verify content based on type
```

### Expected Outcome
- Designation changes automatically tracked
- Change type intelligently determined
- Employment history recorded
- Appropriate notifications sent
- Permissions updated
- Caches invalidated

### Verification Checklist
- [ ] track_designation_change function defined
- [ ] @receiver decorator applied
- [ ] Designation change detection logic
- [ ] Change type determination logic
- [ ] Employment history logging
- [ ] Permission update logic
- [ ] Notification sending logic
- [ ] Cache invalidation logic
- [ ] Error handling implemented
- [ ] Logging added
- [ ] Handles NULL cases
- [ ] Coordinates with transfer signal
- [ ] Unit tests written

---

## Task 40: Create DepartmentHead Model

### Overview
Create the DepartmentHead model to track department heads (managers) with complete historical records. This model maintains a history of who managed each department, supports acting/interim heads, and enables management transition tracking. It's separate from DepartmentMember to distinguish leadership roles from regular membership.

### Dependencies
- Task 37: Run DepartmentMember Migrations
- Department model exists
- Employee model exists
- User model exists

### Instructions

1. **Create department_head.py model file**
   - Create file at `apps/organization/models/department_head.py`
   - Import necessary Django components

2. **Import required modules**
   - Import Django model fields
   - Import base model mixins (TenantAwareMixin, TimestampMixin)
   - Import Department, Employee, User models
   - Import timezone utilities

3. **Define DepartmentHead model class**
   - Inherit from TenantAwareMixin and TimestampMixin
   - Add comprehensive model docstring
   - Explain department head history tracking

4. **Add department field**
   - ForeignKey to Department model
   - Use `on_delete=models.CASCADE`
   - Add related_name='heads'
   - Required field

5. **Add employee field**
   - ForeignKey to Employee model
   - Use `on_delete=models.CASCADE`
   - Add related_name='head_positions'
   - Required field
   - The employee serving as department head

6. **Add is_acting field**
   - BooleanField, default=False
   - Indicates if this is an acting/interim head
   - Used for temporary leadership

7. **Add appointed_by field**
   - ForeignKey to User model
   - Use `on_delete=models.SET_NULL`
   - Optional (null=True, blank=True)
   - Records who made the appointment

8. **Add notes field**
   - TextField, optional (blank=True, null=True)
   - Additional information about appointment
   - Reasons, special conditions, etc.

9. **Add Meta class**
   - Set verbose_name and verbose_name_plural
   - Add ordering by department name, start_date
   - Add indexes for performance
   - Add index on (department, end_date) for current head

10. **Add __str__ method**
    - Return meaningful string representation
    - Format: "Employee Name - Department Name (start_date to end_date)"
    - Include "Acting" if is_acting=True

11. **Add clean method**
    - Validate no overlapping tenures for same department
    - Validate employee is member of department
    - Raise ValidationError for violations

12. **Add computed property is_current**
    - Property decorator
    - Returns True if end_date is None
    - Indicates currently serving head

13. **Update organization models __init__.py**
    - Import DepartmentHead model
    - Add to __all__ list

### DepartmentHead Model Structure

```
┌─────────────────────────────────────────────────┐
│          DepartmentHead Model                   │
├─────────────────────────────────────────────────┤
│ Core Fields:                                    │
│  • department (FK to Department)                │
│  • employee (FK to Employee)                    │
│  • is_acting (Boolean)                          │
│  • appointed_by (FK to User, optional)          │
│  • notes (TextField, optional)                  │
│                                                 │
│ Date Fields (Task 41):                          │
│  • start_date (DateField)                       │
│  • end_date (DateField, optional)               │
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
│  Department  │◄─────────────────────│  DepartmentHead    │
└──────────────┘                      └────────────────────┘
                                               │
                                               │ N:1
                                               ▼
                                      ┌────────────────────┐
                                      │    Employee        │
                                      └────────────────────┘
                                               │
                                               │ N:1
                                               ▼
                                      ┌────────────────────┐
                                      │    User (appt by)  │
                                      └────────────────────┘
```

### DepartmentHead vs DepartmentMember

```
Distinction Between Models
══════════════════════════

DepartmentHead:
├── Tracks department leadership
├── Historical record of department heads
├── One current head per department (typically)
├── Separate from regular membership
├── Has appointment information
└── Example: IT Department Head (2020-present)

DepartmentMember (with DEPUTY_MANAGER role):
├── Tracks membership in department
├── Can have role = DEPUTY_MANAGER
├── Multiple deputy managers possible
├── Part of general membership
├── No appointment tracking
└── Example: Deputy IT Manager (member with role)

Relationship:
Department Head IS ALSO a DepartmentMember
├── John is DepartmentHead (IT Dept, 2024-present)
└── John has DepartmentMember (IT Dept, MEMBER role)
    Separate records, different purposes
```

### Department Head Scenarios

#### Scenario 1: Permanent Department Head
```
IT Department Head History

Current Head:
├── employee: Sarah Johnson
├── start_date: 2024-07-01
├── end_date: NULL (currently serving)
├── is_acting: False (permanent)
├── appointed_by: CEO
└── notes: "Promoted from Senior Manager position"

Previous Head:
├── employee: Robert Smith
├── start_date: 2020-01-15
├── end_date: 2024-06-30 (retired)
├── is_acting: False
├── appointed_by: CEO
└── notes: "Retired after 20 years of service"
```

#### Scenario 2: Acting Department Head
```
Sales Department - Interim Leadership

Acting Head (Temporary):
├── employee: Jennifer Williams
├── start_date: 2026-01-01
├── end_date: 2026-02-28 (planned end)
├── is_acting: True (interim)
├── appointed_by: VP Sales
└── notes: "Acting head while Tom Anderson on medical leave"

Regular Head (On Leave):
├── employee: Tom Anderson
├── start_date: 2023-03-01
├── end_date: NULL (will resume)
├── is_acting: False
└── notes: "On temporary medical leave Jan-Feb 2026"

Note: Can have overlapping records if one is acting
```

#### Scenario 3: Management Transition
```
HR Department - Leadership Change

Incoming Head:
├── employee: Carol Davis
├── start_date: 2026-02-01 (future date)
├── end_date: NULL
├── is_acting: False
├── appointed_by: COO
└── notes: "Promoted from HR Deputy Manager"

Outgoing Head:
├── employee: Michael Brown
├── start_date: 2022-05-15
├── end_date: 2026-01-31 (transition date)
├── is_acting: False
├── appointed_by: COO
└── notes: "Transferred to Regional Director position"

Transition Period: Jan 1-31, 2026 (handover)
```

### Historical Tracking

```
Department Head Timeline
════════════════════════

Finance Department Heads (2015-2026)

2015-2018: Alice Cooper
├── Appointed: 2015-01-01
├── Ended: 2018-12-31
├── Tenure: 4 years
└── Reason: Promoted to CFO

2019-2023: Bob Wilson
├── Appointed: 2019-01-01
├── Ended: 2023-06-30
├── Tenure: 4.5 years
└── Reason: Retired

2023 (Jul-Aug): Carol Evans (Acting)
├── Appointed: 2023-07-01
├── Ended: 2023-08-31
├── Tenure: 2 months
├── Acting: Yes
└── Reason: Interim during recruitment

2023-Present: David Miller
├── Appointed: 2023-09-01
├── Ended: NULL (current)
├── Tenure: 2.4 years (ongoing)
└── Current head

Total Heads: 4 (3 permanent, 1 acting)
Average Tenure: 3.6 years (excluding acting)
```

### Acting Head Use Cases

```
Acting/Interim Head Scenarios
══════════════════════════════

Use Case 1: Temporary Leave
├── Regular head on sick leave
├── Acting head appointed during absence
├── Both records exist (overlapping dates)
└── Regular head resumes after return

Use Case 2: Transition Period
├── Old head leaving
├── New head not yet appointed
├── Acting head bridges gap
└── Acting end_date = New head start_date

Use Case 3: Trial Period
├── Candidate being evaluated
├── Appointed as acting first
├── May become permanent
└── Update is_acting=False if confirmed

Use Case 4: Emergency Succession
├── Unexpected departure
├── Quick acting appointment
├── Permanent replacement search ongoing
└── Acting serves until replacement found
```

### Validation Rules

```
DepartmentHead Validation Rules
════════════════════════════════

Rule 1: No Overlapping Permanent Heads
✗ Two permanent heads for same dept with overlapping dates
✓ Sequential permanent heads (end_date → start_date)
✓ Overlapping if one is acting (temporary)

Rule 2: Employee Must Be Department Member
✗ Head not a member of the department
✓ Head has active or past DepartmentMember record
Note: Can enforce or allow (policy decision)

Rule 3: End Date After Start Date
✗ end_date < start_date
✓ end_date > start_date
✓ end_date = NULL (ongoing)

Rule 4: Future Start Date Allowed
✓ start_date in future (planned appointment)
Note: Useful for announced transitions
```

### Query Patterns

```python
# Pseudo-code for common queries

# Get current department head
current_head = DepartmentHead.objects.filter(
    department=dept,
    end_date__isnull=True,
    is_acting=False
).first()

# Get all heads for department (history)
head_history = DepartmentHead.objects.filter(
    department=dept
).order_by('start_date')

# Get departments headed by employee
departments_headed = DepartmentHead.objects.filter(
    employee=emp,
    end_date__isnull=True
)

# Get acting heads (current)
acting_heads = DepartmentHead.objects.filter(
    is_acting=True,
    end_date__isnull=True
)

# Get head on specific date
head_on_date = DepartmentHead.objects.filter(
    department=dept,
    start_date__lte=date,
    Q(end_date__gte=date) | Q(end_date__isnull=True)
).first()
```

### Field Specifications

| Field | Type | Required | Purpose |
|-------|------|----------|---------|
| department | ForeignKey | Yes | Department being led |
| employee | ForeignKey | Yes | Employee serving as head |
| is_acting | Boolean | Yes (default False) | Acting/interim flag |
| appointed_by | ForeignKey(User) | No | Who made appointment |
| notes | TextField | No | Additional information |
| tenant | ForeignKey | Yes (inherited) | Multi-tenancy support |

### Expected Outcome
- DepartmentHead model created
- Department leadership tracking
- Historical head records
- Acting head support
- Appointment tracking
- Foundation for tenure fields (Task 41)

### Verification Checklist
- [ ] department_head.py file created
- [ ] DepartmentHead class defined
- [ ] department ForeignKey added
- [ ] employee ForeignKey added
- [ ] is_acting field added
- [ ] appointed_by field added
- [ ] notes field added
- [ ] Meta class configured
- [ ] __str__ method implemented
- [ ] clean method for validation
- [ ] is_current property defined
- [ ] Model imported in __init__.py

---

## Task 41: Add Head Tenure Fields

### Overview
Add date tracking fields to the DepartmentHead model to record when a department head started and ended their tenure. These fields enable precise tracking of leadership periods, support historical analysis, and facilitate succession planning.

### Dependencies
- Task 40: Create DepartmentHead Model

### Instructions

1. **Open department_head.py model file**
   - Navigate to `apps/organization/models/department_head.py`
   - Locate DepartmentHead model class

2. **Add start_date field**
   - DateField type
   - Required field (no null/blank)
   - Represents beginning of tenure
   - Can be future date (announced appointments)

3. **Add end_date field**
   - DateField type
   - Optional (null=True, blank=True)
   - Represents end of tenure
   - NULL means currently serving

4. **Add help_text to both fields**
   - start_date: "Date when head began managing this department"
   - end_date: "Date when head stopped managing (NULL if currently serving)"

5. **Update is_current property**
   - Modify to check end_date is None
   - Returns True if currently serving
   - Returns False if tenure ended

6. **Add computed property tenure_duration**
   - Property decorator
   - Calculate tenure length
   - Use end_date or current date as end point
   - Return timedelta object

7. **Add tenure-related properties**
   - tenure_days: Duration in days
   - tenure_months: Approximate months
   - tenure_years: Approximate years
   - is_future: Check if start_date is in future

8. **Update clean method**
   - Validate end_date >= start_date
   - Check for overlapping non-acting heads
   - Validate start_date not too far in future
   - Raise ValidationError for violations

9. **Add date-based manager method**
   - Create custom manager
   - Add `current()` method for active heads
   - Add `ended()` method for past heads
   - Add `as_of(date)` method for point-in-time queries
   - Add `overlapping(start, end)` method

10. **Update __str__ method**
    - Include tenure dates
    - Format: "Employee - Department (start to end)"
    - Show "present" if end_date is None
    - Include "Acting" prefix if applicable

11. **Update Meta class**
    - Add index on start_date
    - Add index on end_date
    - Add index on (department, end_date) for current head queries

### Tenure Date Field Structure

```
DepartmentHead Tenure Fields
═══════════════════════════════

start_date (DateField, Required)
├── Marks beginning of head tenure
├── Can be in future (announced appointment)
├── Must be <= end_date if set
└── Determines tenure start point

end_date (DateField, Optional)
├── Marks end of head tenure
├── NULL = currently serving
├── Set when head steps down
└── Must be >= start_date

Computed Properties:
├── is_current → end_date is None
├── tenure_duration → (end_date or today) - start_date
├── tenure_days → duration.days
├── tenure_months → days // 30
├── tenure_years → days // 365
└── is_future → start_date > today
```

### Tenure Status States

```
┌─────────────────────────────────────────────────┐
│  Department Head Tenure State Machine           │
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌──────────────┐                               │
│  │   FUTURE     │  start_date arrives           │
│  │ (start_date  │─────────────►┌─────────────┐ │
│  │  > today)    │               │   CURRENT   │ │
│  └──────────────┘               │ (end = NULL)│ │
│                                 └─────────────┘ │
│                                       │         │
│                                       │ Set end_date
│                                       ▼         │
│                                 ┌─────────────┐ │
│                                 │   ENDED     │ │
│                                 │ (end is set)│ │
│                                 └─────────────┘ │
└─────────────────────────────────────────────────┘
```

### Current vs Ended vs Future

| Field | Current Head | Ended Head | Future Head |
|-------|-------------|-----------|-------------|
| start_date | 2024-01-15 | 2020-06-01 | 2026-03-01 |
| end_date | NULL | 2024-01-14 | NULL |
| is_current | True | False | False |
| is_future | False | False | True |
| tenure_duration | Today - start | end - start | Not applicable |
| Status | Active | Historical | Announced |

### Tenure Validation Rules

```
Validation Rules
════════════════

Rule 1: End Date After Start Date
✗ start_date = 2024-01-01, end_date = 2023-12-31
✓ start_date = 2024-01-01, end_date = 2024-12-31
✓ start_date = 2024-01-01, end_date = NULL

Rule 2: No Overlapping Permanent Heads
✗ Two permanent heads with overlapping date ranges
✓ Sequential permanent heads (no overlap)
✓ Acting head can overlap with permanent head

Rule 3: Future Start Date Limit
✓ start_date within 1 year in future
✗ start_date more than 1 year in future
Note: Reasonable planning horizon

Rule 4: End Date Not in Far Future
✗ end_date more than today (for ended tenures)
✓ end_date <= today (past or present)
✓ end_date in near future (notice period)
```

### Tenure Duration Calculation

```python
# Pseudo-code for tenure calculations

@property
def tenure_duration(self):
    """Calculate tenure duration"""
    if self.end_date:
        return self.end_date - self.start_date
    else:
        return date.today() - self.start_date

@property
def tenure_days(self):
    """Tenure in days"""
    return self.tenure_duration.days

@property
def tenure_months(self):
    """Approximate tenure in months"""
    return self.tenure_days // 30

@property
def tenure_years(self):
    """Approximate tenure in years"""
    return self.tenure_days // 365

@property
def tenure_display(self):
    """Human-readable tenure"""
    years = self.tenure_years
    months = (self.tenure_days % 365) // 30
    
    if years > 0:
        return f"{years} year(s), {months} month(s)"
    elif months > 0:
        return f"{months} month(s)"
    else:
        return f"{self.tenure_days} day(s)"
```

### Custom Manager Methods

```python
# Pseudo-code for manager methods

class DepartmentHeadManager(models.Manager):
    
    def current(self):
        """Get current department heads"""
        return self.filter(end_date__isnull=True, start_date__lte=date.today())
    
    def ended(self):
        """Get past department heads"""
        return self.filter(end_date__isnull=False)
    
    def future(self):
        """Get announced future appointments"""
        return self.filter(start_date__gt=date.today())
    
    def as_of(self, date):
        """Get heads serving on specific date"""
        return self.filter(
            start_date__lte=date,
            Q(end_date__gte=date) | Q(end_date__isnull=True)
        )
    
    def overlapping(self, start_date, end_date=None):
        """Check for overlapping tenures"""
        if end_date is None:
            end_date = date.today()
        
        return self.filter(
            start_date__lte=end_date,
            Q(end_date__gte=start_date) | Q(end_date__isnull=True)
        )
    
    def acting_current(self):
        """Get current acting heads"""
        return self.filter(
            is_acting=True,
            end_date__isnull=True,
            start_date__lte=date.today()
        )
```

### Query Examples

#### Get Current Department Head
```
Purpose: Find who currently heads a department
Query: DepartmentHead.objects.current().filter(department=dept, is_acting=False).first()
Result: Current non-acting head (if exists)
```

#### Get Department Head on Specific Date
```
Purpose: Who was heading IT on 2025-06-01?
Query: DepartmentHead.objects.as_of('2025-06-01').filter(department__code='IT').first()
Result: Head serving on that date
```

#### Calculate Average Tenure
```
Purpose: Average tenure length for department heads
Query: Get all ended tenures, calculate durations, average
Result: Mean tenure in days/months/years
```

#### Find Long-Serving Heads
```
Purpose: Heads serving > 5 years
Query: Filter current heads where tenure_years >= 5
Result: Long-tenured department heads
```

### Overlapping Tenure Detection

```
Overlapping Tenure Logic
════════════════════════

Scenario: Checking if new head overlaps existing

Existing Head:
├── start_date: 2024-01-01
└── end_date: NULL (current)

New Head:
├── start_date: 2026-01-24
└── end_date: NULL

Overlap Check:
new.start_date <= existing.end_date (or NULL)
AND
new.end_date (or NULL) >= existing.start_date

Result: Overlaps? Yes (both have NULL end_date)

Action:
IF existing.is_acting == False AND new.is_acting == False:
    ✗ CONFLICT - Cannot have two permanent heads
ELSE:
    ✓ ALLOWED - One is acting/interim
```

### Succession Planning Use Cases

#### Planned Transition
```
Scenario: Announced leadership change

Current Head:
├── Employee: John Smith
├── start_date: 2020-01-01
├── end_date: 2026-03-31 (announced retirement)
├── Tenure: 6+ years
└── Status: Current (until March 31)

Incoming Head:
├── Employee: Jane Doe
├── start_date: 2026-04-01 (future)
├── end_date: NULL
├── Tenure: Not started
└── Status: Future (announced)

Transition Plan:
├── Overlap: None (sequential dates)
├── Handover period: March 2026
└── Clean succession
```

#### Acting Head During Search
```
Scenario: Interim leadership during recruitment

Previous Head:
├── Employee: Bob Wilson (left suddenly)
├── start_date: 2023-01-01
├── end_date: 2026-01-10 (resignation)
└── Tenure: 3 years

Acting Head:
├── Employee: Carol Evans
├── start_date: 2026-01-11
├── end_date: 2026-03-31 (expected)
├── is_acting: True
└── Tenure: 2.5 months (interim)

New Head:
├── Employee: David Miller (hired)
├── start_date: 2026-04-01
├── end_date: NULL
└── Status: Incoming (post-recruitment)
```

### Tenure-Based Reporting

#### Department Head Stability Report
```
Report: Leadership stability analysis
Data: All departments with current heads
Metrics:
├── Average tenure length
├── Turnover rate (heads per year)
├── Acting head frequency
├── Long-serving heads (5+ years)
└── Recent appointments (<1 year)

Example Output:
IT Department:
├── Current Head: Sarah Johnson (2.5 years)
├── Previous Heads: 3 (since 2015)
├── Average Tenure: 4.2 years
├── Turnover Rate: Low
└── Stability: High
```

#### Succession Planning Dashboard
```
Report: Upcoming leadership changes
Data: Future appointments and ending tenures
Display:
├── Heads ending tenure (next 6 months)
├── Announced appointments
├── Departments without head
├── Acting heads (temporary)
└── Long-tenured heads (succession risk)

Example:
Upcoming Changes (Next 6 Months):
├── Finance: John retiring Mar 31
│   └── Replacement: Jane appointed Apr 1
├── Sales: Acting head since Jan
│   └── Search ongoing
└── HR: Carol (8 years) - succession plan needed
```

### Integration with DepartmentMember

```
Synchronization: Head ↔ Member
═══════════════════════════════

When DepartmentHead created:
1. Ensure employee has DepartmentMember record
2. If not, create with:
   - joined_date = start_date
   - role = MEMBER (or DEPUTY_MANAGER)
   - is_primary = True (likely)

When DepartmentHead ends:
1. Update DepartmentMember if needed
2. Don't automatically close membership
3. Head can remain as member

Relationship:
Department Head ⊂ Department Member
(Head is always a member, but member isn't always head)
```

### Expected Outcome
- Tenure date fields added
- Current/ended/future head tracking
- Tenure duration calculations
- Historical tenure analysis
- Succession planning support

### Verification Checklist
- [ ] start_date field added
- [ ] end_date field added
- [ ] help_text added to both fields
- [ ] is_current property updated
- [ ] tenure_duration property implemented
- [ ] tenure_days property implemented
- [ ] tenure_months property implemented
- [ ] tenure_years property implemented
- [ ] is_future property implemented
- [ ] clean method updated for date validation
- [ ] Custom manager created with current/ended/as_of methods
- [ ] overlapping method implemented
- [ ] Meta indexes added for date fields
- [ ] __str__ method updated with dates

---

## Task 42: Run DepartmentHead Migrations

### Overview
Generate and apply Django migrations for the DepartmentHead model. This creates the database table for department head tracking with all fields, constraints, and indexes.

### Dependencies
- Task 40: Create DepartmentHead Model
- Task 41: Add Head Tenure Fields

### Instructions

1. **Review model completeness**
   - Open `apps/organization/models/department_head.py`
   - Verify all fields defined:
     - department (FK)
     - employee (FK)
     - start_date
     - end_date
     - is_acting
     - appointed_by (FK)
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
   - Locate new migration (e.g., `0004_head.py`)
   - Review CreateModel operation
   - Verify all fields present
   - Check constraints and indexes

4. **Verify migration dependencies**
   - Ensure depends on 0003_member migration
   - Verify Employee model dependency
   - Check User model dependency

5. **Apply migration**
   - Run migrate command
   - Command: `python manage.py migrate organization`
   - Monitor for errors
   - Verify successful completion

6. **Verify database changes**
   - Connect to database
   - Check organization_departmenthead table exists
   - Verify columns created
   - Check foreign key constraints
   - Verify indexes created

7. **Test model functionality**
   - Open Django shell
   - Create DepartmentHead instance
   - Test relationships
   - Verify manager methods work

### Migration File Structure

```
Migration: 0004_head.py
═════════════════════════════════════

from django.db import migrations, models
import django.db.models.deletion
from django.conf import settings

class Migration(migrations.Migration):
    
    dependencies = [
        ('organization', '0003_member'),
        ('employees', '0009_fk_updates'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]
    
    operations = [
        migrations.CreateModel(
            name='DepartmentHead',
            fields=[
                ('id', models.BigAutoField(...)),
                ('created_at', models.DateTimeField(...)),
                ('updated_at', models.DateTimeField(...)),
                ('start_date', models.DateField()),
                ('end_date', models.DateField(blank=True, null=True)),
                ('is_acting', models.BooleanField(default=False)),
                ('notes', models.TextField(blank=True, null=True)),
                ('appointed_by', models.ForeignKey(
                    blank=True,
                    null=True,
                    on_delete=django.db.models.deletion.SET_NULL,
                    to=settings.AUTH_USER_MODEL,
                )),
                ('department', models.ForeignKey(
                    on_delete=django.db.models.deletion.CASCADE,
                    related_name='heads',
                    to='organization.department',
                )),
                ('employee', models.ForeignKey(
                    on_delete=django.db.models.deletion.CASCADE,
                    related_name='head_positions',
                    to='employees.employee',
                )),
                ('tenant', models.ForeignKey(...)),
            ],
            options={
                'verbose_name': 'Department Head',
                'verbose_name_plural': 'Department Heads',
                'ordering': ['department__name', 'start_date'],
            },
        ),
        migrations.AddIndex(
            model_name='departmenthead',
            index=models.Index(fields=['department', 'end_date']),
        ),
        migrations.AddIndex(
            model_name='departmenthead',
            index=models.Index(fields=['start_date']),
        ),
        migrations.AddIndex(
            model_name='departmenthead',
            index=models.Index(fields=['end_date']),
        ),
    ]
```

### Database Schema

```
Table: organization_departmenthead
═══════════════════════════════════════════════

Column Name          Type              Constraints
─────────────────────────────────────────────────
id                   BIGINT            PRIMARY KEY
tenant_id            BIGINT            NOT NULL, FK→tenants
department_id        BIGINT            NOT NULL, FK→organization_department
employee_id          BIGINT            NOT NULL, FK→employees
start_date           DATE              NOT NULL
end_date             DATE              NULL
is_acting            BOOLEAN           NOT NULL, DEFAULT FALSE
appointed_by_id      BIGINT            NULL, FK→auth_user
notes                TEXT              NULL
created_at           TIMESTAMP         NOT NULL
updated_at           TIMESTAMP         NOT NULL

Indexes:
├── PRIMARY KEY (id)
├── INDEX (tenant_id)
├── INDEX (department_id, end_date)  -- Current head queries
├── INDEX (employee_id)
├── INDEX (start_date)
└── INDEX (end_date)

Foreign Keys:
├── FK: department_id → organization_department.id (CASCADE)
├── FK: employee_id → employees_employee.id (CASCADE)
├── FK: appointed_by_id → auth_user.id (SET_NULL)
└── FK: tenant_id → tenants_tenant.id (CASCADE)
```

### Migration Commands

```bash
# Step 1: Generate migration
python manage.py makemigrations organization

# Expected output:
# Migrations for 'organization':
#   apps/organization/migrations/0004_head.py
#     - Create model DepartmentHead

# Step 2: Review SQL (optional)
python manage.py sqlmigrate organization 0004

# Step 3: Check migration status
python manage.py showmigrations organization

# Step 4: Apply migration
python manage.py migrate organization

# Expected output:
# Running migrations:
#   Applying organization.0004_head... OK
```

### Post-Migration Testing

```python
# Django shell testing
python manage.py shell

# Test 1: Create department head
from apps.employees.models import Employee
from apps.organization.models import Department, DepartmentHead
from datetime import date

dept = Department.objects.first()
emp = Employee.objects.first()

head = DepartmentHead.objects.create(
    department=dept,
    employee=emp,
    start_date=date(2024, 1, 1),
    is_acting=False
)

print(f"Created: {head}")
print(f"Is current: {head.is_current}")
print(f"Tenure: {head.tenure_days} days")

# Test 2: Query current heads
current_heads = DepartmentHead.objects.filter(end_date__isnull=True)
print(f"Current heads: {current_heads.count()}")

# Test 3: Test relationships
print(f"Department: {head.department.name}")
print(f"Employee: {head.employee.full_name}")

# Test 4: Test manager methods (if implemented)
from datetime import date
heads_on_date = DepartmentHead.objects.as_of(date(2025, 1, 1))
print(f"Heads on 2025-01-01: {heads_on_date.count()}")
```

### Verification Queries

```sql
-- Verify table creation
SELECT table_name 
FROM information_schema.tables 
WHERE table_name = 'organization_departmenthead';

-- Check columns
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'organization_departmenthead'
ORDER BY ordinal_position;

-- Verify indexes
SELECT indexname, indexdef
FROM pg_indexes
WHERE tablename = 'organization_departmenthead';

-- Check foreign keys
SELECT conname, contype, confrelid::regclass AS referenced_table
FROM pg_constraint
WHERE conrelid = 'organization_departmenthead'::regclass;
```

### Common Issues and Solutions

| Issue | Symptom | Solution |
|-------|---------|----------|
| Missing DepartmentMember | Depends on 0003 not run | Run migrate for 0003 first |
| User model not found | appointed_by FK error | Check AUTH_USER_MODEL setting |
| Duplicate migration | Multiple 0004 files | Delete duplicate, regenerate |
| Index creation fails | Index exists | Drop old index manually |

### Rollback Procedure

```bash
# If issues occur, rollback
python manage.py migrate organization 0003_member

# This will:
# 1. Drop organization_departmenthead table
# 2. Remove all indexes
# 3. Remove foreign key constraints
# 4. Restore to previous state

# Fix issues, then re-apply
python manage.py migrate organization 0004_head
```

### Expected Outcome
- Migration file generated
- Database table created
- All fields and constraints in place
- Indexes created for performance
- Model fully functional
- Ready for department head tracking

### Verification Checklist
- [ ] Migration file generated
- [ ] Migration reviewed
- [ ] Dependencies correct
- [ ] Migration applied successfully
- [ ] Table created in database
- [ ] All columns exist
- [ ] Foreign keys established
- [ ] Indexes created
- [ ] Model import works
- [ ] Can create instances
- [ ] Relationships work
- [ ] Manager methods functional

---

## Task 43: Validate Circular Manager

### Overview
Create a validator function to prevent circular manager references in the employee reporting structure. This ensures that an employee cannot directly or indirectly report to themselves, which would create an infinite loop in the organizational hierarchy and break reporting chain queries.

### Dependencies
- Employee model with manager FK exists (self-referential)
- Django validators framework

### Instructions

1. **Create validators.py file**
   - Create file at `apps/organization/validators.py`
   - Import necessary Django components
   - Import Employee model

2. **Define validate_circular_manager function**
   - Function signature: (employee_instance)
   - Purpose: Check if employee appears in own manager chain
   - Raise ValidationError if circular reference found

3. **Implement manager chain traversal**
   - Start with employee's manager
   - Follow manager.manager recursively
   - Track visited employees to detect cycles
   - Stop at top of hierarchy (manager=None)

4. **Define maximum depth check**
   - Set reasonable max depth (e.g., 10 levels)
   - Prevent infinite loop in corrupted data
   - Raise ValidationError if exceeded

5. **Collect manager chain**
   - Build list of all managers in chain
   - Check if employee ID appears in list
   - Detect indirect circular references

6. **Handle edge cases**
   - Employee with no manager (valid)
   - Employee is own manager (invalid)
   - Database integrity issues

7. **Create descriptive error messages**
   - List the circular path
   - Show employee names in cycle
   - Provide actionable information

8. **Add to Employee model clean method**
   - Import validator in employee.py
   - Call validate_circular_manager in clean()
   - Validation runs before save

9. **Add admin integration**
   - Validator runs in admin forms
   - Displays user-friendly error
   - Prevents invalid data entry

### Circular Reference Scenarios

```
Circular Manager References
════════════════════════════

Scenario 1: Direct Self-Reference
✗ INVALID
Employee A
└── manager: A (self)

Detection: Immediate (employee == manager)

Scenario 2: Two-Level Cycle
✗ INVALID
Employee A
└── manager: B
    └── manager: A (cycle!)

Detection: A appears in own chain (B → A)

Scenario 3: Multi-Level Cycle
✗ INVALID
Employee A
└── manager: B
    └── manager: C
        └── manager: D
            └── manager: A (cycle!)

Detection: A appears in chain (B → C → D → A)

Scenario 4: Valid Hierarchy
✓ VALID
Employee A
└── manager: B
    └── manager: C
        └── manager: D (CEO)
            └── manager: None

Detection: No cycles, terminates at top
```

### Validator Implementation

```python
# Pseudo-code structure

from django.core.exceptions import ValidationError

def validate_circular_manager(employee):
    """
    Validate no circular manager references
    
    Args:
        employee: Employee instance to validate
        
    Raises:
        ValidationError: If circular reference detected
    """
    
    # Edge case: No manager assigned
    if not employee.manager:
        return  # Valid
    
    # Edge case: Self-reference
    if employee.manager == employee:
        raise ValidationError(
            f"{employee.full_name} cannot be their own manager."
        )
    
    # Traverse manager chain
    visited = set()
    current = employee.manager
    max_depth = 10
    depth = 0
    
    while current is not None:
        # Check for cycle
        if current.id == employee.id:
            raise ValidationError(
                f"Circular manager reference detected: "
                f"{employee.full_name} appears in their own reporting chain."
            )
        
        # Check for repeated manager (data corruption)
        if current.id in visited:
            raise ValidationError(
                f"Data integrity error: Duplicate manager in chain."
            )
        
        visited.add(current.id)
        
        # Depth check (prevent infinite loop)
        depth += 1
        if depth > max_depth:
            raise ValidationError(
                f"Manager chain exceeds maximum depth of {max_depth}. "
                f"Possible circular reference or data corruption."
            )
        
        # Move up the chain
        current = current.manager
    
    # No cycle detected
    return


def get_manager_chain(employee):
    """
    Helper: Get full manager chain for employee
    
    Returns: List of employee IDs in chain (bottom to top)
    """
    chain = []
    current = employee.manager
    max_depth = 10
    
    while current is not None and len(chain) < max_depth:
        chain.append(current.id)
        current = current.manager
    
    return chain
```

### Validation Examples

#### Example 1: Detecting Two-Level Cycle
```
Setup:
├── Employee A (id=1, manager=2)
├── Employee B (id=2, manager=3)
└── Employee C (id=3, manager=None)

Valid hierarchy

Action: Set Employee C's manager = Employee A
Result:
├── Employee A → Employee B → Employee C → Employee A
└── Cycle detected!

Validation:
1. Start at A, follow to B
2. B's manager is C
3. C's manager is A (trying to set)
4. A (id=1) appears in chain
5. ✗ ValidationError raised

Error Message:
"Circular manager reference detected: Alice Johnson appears in 
their own reporting chain (Alice → Bob → Carol → Alice)"
```

#### Example 2: Valid Promotion
```
Setup:
├── Employee A (id=1, manager=2)
├── Employee B (id=2, manager=3)
└── Employee C (id=3, manager=None, CEO)

Action: Promote A to B's position
Steps:
1. Set B's manager = A
2. Validate: A's chain is [2, 3] (B → C)
3. Setting B's manager to A doesn't create cycle
4. Result: A → C, B → A → C
5. ✓ Valid

New hierarchy:
├── Employee B → Employee A → Employee C
└── No cycles
```

#### Example 3: Deep Hierarchy Check
```
Setup: 10-level hierarchy (max depth)
├── L1 → L2 → L3 → L4 → L5 → L6 → L7 → L8 → L9 → L10 (CEO)

Action: Add L11, set L10's manager = L11
Result:
├── Depth would be 11 (exceeds max)
└── ✗ ValidationError raised

Error Message:
"Manager chain exceeds maximum depth of 10. Consider flattening 
organizational structure."
```

### Integration with Employee Model

```python
# In apps/employees/models/employee.py

from apps.organization.validators import validate_circular_manager

class Employee(TenantAwareMixin, TimestampMixin, models.Model):
    # ... fields ...
    
    manager = models.ForeignKey(
        'self',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='subordinates'
    )
    
    def clean(self):
        """Validate model before save"""
        super().clean()
        
        # Validate no circular manager reference
        validate_circular_manager(self)
        
        # Other validations...
    
    def save(self, *args, **kwargs):
        """Save with validation"""
        self.full_clean()  # Runs clean() including validation
        super().save(*args, **kwargs)
```

### Admin Form Integration

```python
# In apps/organization/admin.py

from django.contrib import admin
from django.core.exceptions import ValidationError
from apps.employees.models import Employee

@admin.register(Employee)
class EmployeeAdmin(admin.ModelAdmin):
    # ... admin config ...
    
    def save_model(self, request, obj, form, change):
        """Save with validation"""
        try:
            obj.full_clean()  # Validates including circular check
            super().save_model(request, obj, form, change)
        except ValidationError as e:
            # Show error in admin interface
            self.message_user(
                request,
                f"Validation Error: {e.message}",
                level=messages.ERROR
            )
            # Prevent save
            return
```

### Performance Considerations

```
Performance Optimization
════════════════════════

Issue: Manager chain traversal on every save
Impact: O(n) where n = hierarchy depth

Optimization Strategies:

1. Cache manager chains
   ├── Store in employee model
   ├── Invalidate on manager change
   └── Reduces repeated traversals

2. Database constraint (alternative)
   ├── Use recursive CTE in PostgreSQL
   ├── Check constraint on table
   └── Enforced at DB level

3. Lazy validation
   ├── Only validate if manager changed
   ├── Check in save: if manager != old_manager
   └── Skip validation if unchanged

4. Background validation
   ├── Allow save, validate async
   ├── Flag issues for review
   └── Trade-off: Consistency vs performance
```

### Testing Strategy

```
Test Cases
══════════

1. Test direct self-reference
   - Set employee.manager = employee
   - Assert ValidationError raised

2. Test two-level cycle
   - A → B, B → A
   - Assert cycle detected

3. Test multi-level cycle
   - A → B → C → D → A
   - Assert cycle detected

4. Test valid hierarchy
   - A → B → C → None
   - Assert no error

5. Test no manager
   - employee.manager = None
   - Assert valid (CEO case)

6. Test max depth exceeded
   - Create 11-level chain
   - Assert depth error

7. Test valid reassignment
   - Change manager validly
   - Assert no error

8. Test data corruption scenario
   - Manager chain has duplicate
   - Assert integrity error
```

### Expected Outcome
- Circular manager references prevented
- Validation on save and in admin
- Clear error messages
- Maintains hierarchy integrity
- Prevents infinite loops in reporting queries

### Verification Checklist
- [ ] validators.py file created
- [ ] validate_circular_manager function defined
- [ ] Manager chain traversal logic implemented
- [ ] Cycle detection logic working
- [ ] Max depth check implemented
- [ ] Edge cases handled (None, self)
- [ ] Descriptive error messages
- [ ] Integrated with Employee.clean()
- [ ] Admin form validation working
- [ ] Unit tests written
- [ ] Performance optimizations considered

---

## Task 44: Validate Department Consistency

### Overview
Create a validator function to ensure department consistency in the reporting structure. This optional but recommended validation checks that an employee's manager belongs to the same department, a parent department, or an ancestor department in the hierarchy. This maintains logical organizational structure and prevents reporting to unrelated departments.

### Dependencies
- Task 43: Validate Circular Manager
- Department model with parent FK (tree structure)
- Employee model with department and manager FKs

### Instructions

1. **Open validators.py file**
   - Continue in `apps/organization/validators.py`
   - Prepare to add department consistency validator

2. **Define validate_department_consistency function**
   - Function signature: (employee_instance, strict=False)
   - Purpose: Validate manager's department relationship
   - Optional validation (can be toggled)

3. **Check if validation applies**
   - Skip if employee has no manager
   - Skip if employee has no department
   - Skip if manager has no department
   - All must be assigned for validation

4. **Get department ancestry**
   - Create helper to get department ancestors
   - Traverse parent hierarchy
   - Build list of ancestor departments

5. **Define valid manager departments**
   - Same department (peers report to manager)
   - Parent department (common pattern)
   - Ancestor department (higher in hierarchy)
   - Optional: Allow any if strict=False

6. **Perform validation check**
   - Check if manager.department in valid set
   - Raise ValidationError if not
   - Include departments in error message

7. **Add strict mode option**
   - strict=True: Enforce validation
   - strict=False: Warning only (log)
   - Configurable per tenant/globally

8. **Create helper: get_department_ancestors**
   - Function to traverse department tree
   - Return list of ancestor department IDs
   - Include self and all parents up to root

9. **Add to Employee model clean method**
   - Import validator
   - Call validate_department_consistency
   - Make optional based on settings

10. **Add configuration setting**
    - Add to tenant settings or global config
    - ENFORCE_DEPARTMENT_CONSISTENCY = False
    - Allow per-tenant override

### Department Consistency Scenarios

```
Department Consistency Validation
══════════════════════════════════

Valid Scenario 1: Same Department
Employee: John (IT Department)
Manager: Sarah (IT Department)
✓ Valid: Both in same department

Valid Scenario 2: Parent Department
Employee: John (IT - Development)
Manager: Sarah (IT - Parent)
✓ Valid: Manager in parent department

Valid Scenario 3: Ancestor Department
Employee: John (IT → Development → Backend)
Manager: Sarah (IT - Top ancestor)
✓ Valid: Manager in ancestor department

Valid Scenario 4: No Restrictions (strict=False)
Employee: John (IT)
Manager: Sarah (HR)
✓ Allowed: Validation disabled or relaxed

Invalid Scenario 1: Unrelated Department
Employee: John (IT)
Manager: Bob (Sales)
✗ Invalid: Departments not related

Invalid Scenario 2: Sibling Department
Employee: John (IT - Development)
Manager: Carol (IT - Operations)
✗ Invalid: Sibling departments (unless allowed)
```

### Validator Implementation

```python
# Pseudo-code structure

def validate_department_consistency(employee, strict=False):
    """
    Validate manager's department is consistent with employee's
    
    Args:
        employee: Employee instance to validate
        strict: If True, enforce strictly; if False, log warning only
        
    Raises:
        ValidationError: If validation fails and strict=True
    """
    
    # Skip if incomplete data
    if not employee.manager:
        return  # No manager, validation N/A
    
    if not employee.department:
        return  # Employee not assigned department
    
    if not employee.manager.department:
        return  # Manager not assigned department
    
    # Get valid manager departments
    valid_departments = get_valid_manager_departments(employee.department)
    
    # Check if manager's department is valid
    if employee.manager.department.id not in valid_departments:
        message = (
            f"Department consistency issue: {employee.full_name} "
            f"(Department: {employee.department.name}) reports to "
            f"{employee.manager.full_name} (Department: {employee.manager.department.name}). "
            f"Manager should be in same, parent, or ancestor department."
        )
        
        if strict:
            raise ValidationError(message)
        else:
            # Log warning but don't prevent
            logger.warning(message)
    
    return


def get_valid_manager_departments(department):
    """
    Get set of valid department IDs for employee's manager
    
    Valid departments:
    - Same department
    - Parent department
    - All ancestor departments
    
    Returns: Set of department IDs
    """
    valid = {department.id}  # Same department
    
    # Add all ancestors
    current = department.parent
    while current is not None:
        valid.add(current.id)
        current = current.parent
    
    return valid


def get_department_ancestors(department):
    """
    Get list of all ancestor departments (bottom to top)
    
    Args:
        department: Starting department
        
    Returns: List of Department instances
    """
    ancestors = []
    current = department.parent
    max_depth = 10
    
    while current is not None and len(ancestors) < max_depth:
        ancestors.append(current)
        current = current.parent
    
    return ancestors
```

### Validation Examples

#### Example 1: Valid - Same Department
```
Department Structure:
IT Department
├── Sarah (Manager)
└── John (Developer)

Setup:
├── John: department=IT, manager=Sarah
└── Sarah: department=IT

Validation:
1. Get valid departments for John: [IT]
2. Sarah's department: IT
3. IT in [IT]? Yes
4. ✓ Valid

Result: No error
```

#### Example 2: Valid - Parent Department
```
Department Structure:
IT Department (Parent)
├── Sarah (IT Manager)
└── Development (Child)
    └── John (Developer)

Setup:
├── John: department=IT-Development, manager=Sarah
└── Sarah: department=IT

Validation:
1. Get valid departments for John: [IT-Development, IT]
2. Sarah's department: IT
3. IT in [IT-Development, IT]? Yes
4. ✓ Valid

Result: No error
```

#### Example 3: Valid - Ancestor Department
```
Department Structure:
IT Department (Grandparent)
├── Sarah (CTO)
└── Development (Parent)
    └── Backend (Child)
        └── John (Developer)

Setup:
├── John: department=IT-Dev-Backend, manager=Sarah
└── Sarah: department=IT

Validation:
1. Get valid departments for John: [Backend, Development, IT]
2. Sarah's department: IT
3. IT in [Backend, Development, IT]? Yes
4. ✓ Valid

Result: No error
```

#### Example 4: Invalid - Unrelated Department
```
Department Structure:
IT Department
└── John (Developer)

Sales Department
└── Bob (Sales Manager)

Setup:
├── John: department=IT, manager=Bob
└── Bob: department=Sales

Validation:
1. Get valid departments for John: [IT]
2. Bob's department: Sales
3. Sales in [IT]? No
4. ✗ Invalid

Result:
- If strict=True: ValidationError
- If strict=False: Warning logged, allowed
```

#### Example 5: Invalid - Sibling Department
```
Department Structure:
IT Department
├── Development
│   └── John (Developer)
└── Operations
    └── Carol (Ops Manager)

Setup:
├── John: department=IT-Development, manager=Carol
└── Carol: department=IT-Operations

Validation:
1. Get valid departments for John: [Development, IT]
2. Carol's department: Operations
3. Operations in [Development, IT]? No
4. ✗ Invalid (siblings not ancestors)

Result: ValidationError (if strict)
```

### Configuration Options

```python
# In settings.py or tenant config

ORGANIZATION_SETTINGS = {
    # Department consistency validation
    'ENFORCE_DEPARTMENT_CONSISTENCY': False,  # Global default
    'ALLOW_CROSS_DEPARTMENT_REPORTING': True,  # Inverse flag
    'LOG_CONSISTENCY_WARNINGS': True,  # Log even if not enforcing
}

# Per-tenant override
class TenantSettings(models.Model):
    tenant = models.OneToOneField(Tenant)
    enforce_dept_consistency = models.BooleanField(default=False)
```

### Integration with Employee Model

```python
# In apps/employees/models/employee.py

from apps.organization.validators import (
    validate_circular_manager,
    validate_department_consistency
)
from django.conf import settings

class Employee(TenantAwareMixin, TimestampMixin, models.Model):
    # ... fields ...
    
    def clean(self):
        """Validate model before save"""
        super().clean()
        
        # Always validate circular manager (critical)
        validate_circular_manager(self)
        
        # Optionally validate department consistency
        strict = getattr(
            settings, 
            'ENFORCE_DEPARTMENT_CONSISTENCY', 
            False
        )
        validate_department_consistency(self, strict=strict)
```

### Use Cases and Business Rules

```
Business Rules for Department Consistency
══════════════════════════════════════════

Rule 1: Hierarchical Reporting (Strict)
├── Enforce: Manager must be in ancestor department
├── Example: Developer reports to IT Manager
└── Use Case: Traditional hierarchical orgs

Rule 2: Flexible Reporting (Relaxed)
├── Allow: Cross-department reporting
├── Example: Project lead reports to Program Director
└── Use Case: Matrix organizations, cross-functional

Rule 3: Hybrid Approach
├── Enforce for primary manager
├── Allow for secondary/dotted-line managers
└── Use Case: Complex reporting structures

Rule 4: Department-Specific Rules
├── Some departments strict (e.g., Finance)
├── Others flexible (e.g., Project teams)
└── Use Case: Mixed organizational models
```

### Common Validation Scenarios

| Scenario | Employee Dept | Manager Dept | Valid? | Reason |
|----------|--------------|--------------|--------|--------|
| Direct | IT | IT | ✓ | Same department |
| Hierarchical | IT-Dev | IT | ✓ | Parent department |
| Multi-level | IT-Dev-Backend | IT | ✓ | Ancestor department |
| Cross-dept | IT | Sales | ✗ | Unrelated departments |
| Sibling | IT-Dev | IT-Ops | ✗ | Sibling, not ancestor |
| CEO/Top | IT | None | ✓ | Manager has no department |
| New hire | None | IT | ✓ | Employee not yet assigned |

### Exception Handling

```
Exceptions and Special Cases
════════════════════════════

Exception 1: C-Level Executives
├── CEO/CTO/CFO may manage across departments
├── Override: Check if manager has executive flag
└── Allow regardless of department

Exception 2: Matrix Organizations
├── Employees have multiple managers
├── Primary manager: Enforce consistency
└── Dotted-line managers: Relax rules

Exception 3: Project-Based Reporting
├── Temporary project assignments
├── Project managers may be any department
└── Use DepartmentMember (secondary) instead

Exception 4: Holding Company Structure
├── Multiple companies under holding
├── Cross-company reporting may be valid
└── Check tenant/company relationship
```

### Testing Strategy

```
Test Cases
══════════

1. Test same department (valid)
   - Employee and manager in IT
   - Assert no error

2. Test parent department (valid)
   - Employee in IT-Dev, manager in IT
   - Assert no error

3. Test ancestor department (valid)
   - Employee in IT-Dev-Backend, manager in IT
   - Assert no error

4. Test unrelated department (invalid)
   - Employee in IT, manager in Sales
   - Assert ValidationError (if strict)

5. Test sibling department (invalid)
   - Employee in IT-Dev, manager in IT-Ops
   - Assert ValidationError

6. Test no manager (valid)
   - Employee.manager = None
   - Assert no error (CEO case)

7. Test no employee department (valid)
   - Employee.department = None
   - Assert no error (skip validation)

8. Test no manager department (valid)
   - Manager.department = None
   - Assert no error (skip validation)

9. Test strict vs non-strict mode
   - Same invalid scenario
   - Assert error in strict, warning in non-strict

10. Test department tree traversal
    - Deep hierarchy (5+ levels)
    - Assert ancestors correctly identified
```

### Expected Outcome
- Department consistency validation available
- Configurable enforcement (strict/relaxed)
- Clear error messages
- Supports complex org structures
- Improves organizational data quality

### Verification Checklist
- [ ] validate_department_consistency function defined
- [ ] get_valid_manager_departments helper implemented
- [ ] get_department_ancestors helper implemented
- [ ] Strict mode parameter working
- [ ] Configuration setting added
- [ ] Integrated with Employee.clean()
- [ ] Handles all edge cases (None values)
- [ ] Ancestor traversal correct
- [ ] Error messages descriptive
- [ ] Logging for warnings
- [ ] Unit tests written
- [ ] Documentation updated

---

## Summary

This document completed the employee-department integration system with advanced features:

### Completed Infrastructure
- ✅ Department transfer signal (automatic tracking)
- ✅ Designation change signal (history and notifications)
- ✅ DepartmentHead model (leadership tracking)
- ✅ Head tenure fields (start_date, end_date)
- ✅ DepartmentHead migrations applied
- ✅ Circular manager validator (prevents infinite loops)
- ✅ Department consistency validator (optional hierarchy rules)

### Key Achievements
1. **Automated Tracking** - Signals handle department/designation changes
2. **Leadership History** - Complete record of department heads
3. **Acting Head Support** - Temporary/interim leadership tracking
4. **Data Integrity** - Validators prevent circular references
5. **Organizational Consistency** - Optional department hierarchy validation
6. **Audit Trail** - Employment history for all changes

### Validation Summary

```
Validation Framework
════════════════════

Circular Manager Validation (Required):
├── Prevents: Employee reporting to self (direct/indirect)
├── Method: Traverse manager chain, detect cycles
└── Impact: Critical for reporting structure integrity

Department Consistency Validation (Optional):
├── Enforces: Manager in same/parent/ancestor department
├── Method: Traverse department tree, check ancestry
└── Impact: Maintains logical organizational structure

Both validators:
├── Integrated with Employee.clean()
├── Run on save and in admin forms
├── Provide clear error messages
└── Support complex organizational structures
```

### Signal System Summary

```
Signal Architecture
═══════════════════

Department Transfer Signal:
├── Trigger: Employee.department changes
├── Actions:
│   ├── Close old DepartmentMember
│   ├── Create new DepartmentMember
│   ├── Log employment history
│   └── Invalidate caches
└── Purpose: Automatic membership tracking

Designation Change Signal:
├── Trigger: Employee.designation changes
├── Actions:
│   ├── Determine change type (promotion/lateral/etc)
│   ├── Log employment history
│   ├── Send notifications
│   ├── Update permissions
│   └── Invalidate caches
└── Purpose: Career progression tracking

Both signals:
├── Listen to post_save(Employee)
├── Execute independently
├── Include error handling
└── Support transaction safety
```

### Data Model Complete Structure

```
Complete Organization Model Structure
══════════════════════════════════════

Department Model:
├── Hierarchical tree (parent FK)
└── Related: DepartmentHead, DepartmentMember

Employee Model:
├── department (FK) → Primary department
├── designation (FK) → Job role
├── manager (FK) → Self-referential
├── Validated by circular manager check
└── Validated by department consistency (optional)

DepartmentMember Model:
├── Tracks employee-department relationship
├── Many-to-many with history
├── Fields: role, joined_date, left_date, is_primary
└── Managed by transfer signal

DepartmentHead Model:
├── Tracks department leadership
├── Historical records
├── Fields: start_date, end_date, is_acting
└── Separate from membership

Validators:
├── Circular manager (prevents cycles)
└── Department consistency (org structure)

Signals:
├── Department transfer (auto-tracking)
└── Designation change (auto-logging)
```

### Next Steps
Group C is complete. Proceed to:
- **Group D:** Org Chart & Visualization (if exists)
- Or continue with next phase/subphase as defined in project structure

---

**Document Status:** ✅ Complete  
**Total Tasks:** 7  
**Estimated Time:** 175 minutes
