# Tasks 67-75: Employee Service & Search Functionality

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 01 - Employee Management  
> **Group:** E - Employee Services & History  
> **Document:** 01 of 02  
> **Tasks Covered:** 67, 68, 69, 70, 71, 72, 73, 74, 75

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-76-80_Import-Export-Reporting.md](02_Tasks-76-80_Import-Export-Reporting.md)

---

## Document Overview

This document covers the implementation of the employee service layer and search functionality. These services provide business logic for employee operations including creation, updates, status changes, user account management, and comprehensive search capabilities with filtering.

### Tasks in This Document
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

---

## Task 67: Create EmployeeService Class

### Overview
Create the main service class for employee operations. This service encapsulates all business logic related to employee management, providing a clean interface for creating, updating, and managing employees across the application.

### Dependencies
- Employee model exists (from previous groups)
- EmploymentStatus model exists
- PersonalDetails, ContactDetails models exist
- EmployeeHistory model exists
- Django transaction support configured

### Instructions

1. **Create services directory**
   - Navigate to `apps/employees/` directory
   - Create new directory named `services`
   - This will house all employee service classes

2. **Create services package initialization**
   - Create `__init__.py` in `services/` directory
   - Import and export service classes for easy access

3. **Create employee_service.py file**
   - Create file at `apps/employees/services/employee_service.py`
   - This will contain the main EmployeeService class

4. **Import required modules**
   - Import Django transaction support
   - Import Django database models and Q objects
   - Import Employee and related models
   - Import EmployeeHistory model
   - Import logging module
   - Import timezone utilities

5. **Define EmployeeService class**
   - Create class with comprehensive docstring
   - Document service purpose and usage
   - List all available methods

6. **Add class initialization**
   - Accept optional logger parameter
   - Initialize instance variables
   - Set up default configurations

7. **Add private helper method _create_history_entry**
   - Purpose: Create history records for changes
   - Parameters: employee, action, user, old_data, new_data, notes
   - Returns: EmployeeHistory instance
   - Documents all employee changes

8. **Add private helper method _validate_employee_data**
   - Purpose: Validate employee data before operations
   - Parameters: data dictionary
   - Raises: ValidationError if invalid
   - Checks required fields and formats

9. **Add private helper method _validate_nic**
   - Purpose: Validate Sri Lankan NIC number format
   - Parameters: nic_number string
   - Returns: Boolean
   - Supports both old (9 digits + V/X) and new (12 digits) formats

10. **Add private helper method _validate_phone**
    - Purpose: Validate Sri Lankan phone number format
    - Parameters: phone_number string
    - Returns: Boolean
    - Supports mobile (+94 7X) and landline (+94 XX) formats

11. **Add private helper method _send_notification**
    - Purpose: Send notifications for employee events
    - Parameters: employee, event_type, data
    - Triggers email/SMS notifications as configured

12. **Update services/__init__.py**
    - Import EmployeeService
    - Add to __all__ list

### EmployeeService Class Structure

```
┌─────────────────────────────────────────────────┐
│           EmployeeService Class                 │
├─────────────────────────────────────────────────┤
│ Public Methods:                                 │
│  • create_employee(data, user)                  │
│  • update_employee(employee_id, data, user)     │
│  • activate(employee_id, user)                  │
│  • deactivate(employee_id, reason, user)        │
│  • terminate(employee_id, date, reason, user)   │
│  • resign(employee_id, date, reason, user)      │
│  • link_user_account(employee_id, data, user)   │
│  • unlink_user_account(employee_id, user)       │
│                                                 │
│ Private Helper Methods:                         │
│  • _create_history_entry(...)                   │
│  • _validate_employee_data(data)                │
│  • _validate_nic(nic_number)                    │
│  • _validate_phone(phone_number)                │
│  • _send_notification(employee, event, data)    │
└─────────────────────────────────────────────────┘
```

### Service Layer Architecture

```
┌──────────────────────┐
│   API/View Layer     │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│  EmployeeService     │  ← This task
│  (Business Logic)    │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│   Model Layer        │
│  (Data Access)       │
└──────────────────────┘
```

### NIC Validation Rules

#### Old Format (Before 2016)
```
Format: 9 digits + V or X
Examples:
  912345678V  ✓ Valid (born in 1991, day 234)
  852341234X  ✓ Valid (born in 1985, day 234)
  991234567V  ✓ Valid (born in 1999, day 123)
  
Invalid:
  91234567V   ✗ Only 8 digits
  9123456789  ✗ No V/X suffix
  A12345678V  ✗ Contains letter
```

#### New Format (2016 onwards)
```
Format: 12 digits
Examples:
  199123456789  ✓ Valid (born 1991, day 234)
  200045678901  ✓ Valid (born 2000, day 45)
  
Invalid:
  19912345678   ✗ Only 11 digits
  1991234567890 ✗ 13 digits
```

### Phone Number Validation Rules

#### Mobile Numbers
```
Format: +94 followed by 9 digits starting with 7
Examples:
  +94712345678   ✓ Valid (Dialog)
  +94771234567   ✓ Valid (Mobitel)
  +94761234567   ✓ Valid (Etisalat)
  +94781234567   ✓ Valid (Hutch)
  
Also accept:
  0712345678     ✓ Local format
  94712345678    ✓ Without + prefix
```

#### Landline Numbers
```
Format: +94 followed by area code and number
Examples:
  +94112345678   ✓ Valid (Colombo)
  +94812345678   ✓ Valid (Kandy)
  +94912345678   ✓ Valid (Galle)
  
Also accept:
  0112345678     ✓ Local format
```

### History Entry Structure

```
Every operation creates a history record:

┌─────────────────────────────────────────┐
│        EmployeeHistory Record           │
├─────────────────────────────────────────┤
│ employee: FK to Employee                │
│ action: "created", "updated", etc.      │
│ performed_by: FK to User                │
│ old_data: JSON (before state)           │
│ new_data: JSON (after state)            │
│ notes: Text description                 │
│ timestamp: DateTime                     │
└─────────────────────────────────────────┘
```

### Data Validation Matrix

| Field | Validation | Error Message |
|-------|------------|---------------|
| first_name | Required, max 100 chars | "First name is required" |
| last_name | Required, max 100 chars | "Last name is required" |
| nic_number | Required, valid format, unique | "Invalid NIC format" |
| email | Required, valid format, unique | "Invalid email address" |
| phone | Required, valid format | "Invalid phone number" |
| hire_date | Required, valid date | "Invalid hire date" |
| department | Required, must exist | "Department not found" |
| designation | Required, must exist | "Designation not found" |

### Expected Outcome
- Functional EmployeeService class
- Private helper methods for validation
- History tracking foundation
- Notification support structure
- Clean service interface

### Verification Checklist
- [ ] services/ directory created
- [ ] services/__init__.py created
- [ ] employee_service.py file created
- [ ] EmployeeService class defined
- [ ] _create_history_entry method added
- [ ] _validate_employee_data method added
- [ ] _validate_nic method added
- [ ] _validate_phone method added
- [ ] _send_notification method added
- [ ] Class docstring complete
- [ ] EmployeeService imported in __init__.py

---

## Task 68: Implement Create Employee

### Overview
Implement the create_employee method in EmployeeService. This method handles the creation of new employee records with all related data, validation, transaction management, and history tracking.

### Dependencies
- Task 67: Create EmployeeService class
- Employee model with all relationships
- PersonalDetails, ContactDetails models
- Department, Designation models exist

### Instructions

1. **Open employee_service.py file**
   - Navigate to `apps/employees/services/employee_service.py`
   - Locate EmployeeService class

2. **Define create_employee method**
   - Method signature: `create_employee(self, data: dict, user: User) -> Employee`
   - Add comprehensive docstring
   - Document parameters, return value, and exceptions

3. **Add data validation**
   - Call _validate_employee_data(data)
   - Raise ValidationError if invalid
   - Log validation errors

4. **Extract required fields**
   - Extract employee basic fields (first_name, last_name, etc.)
   - Extract personal details fields
   - Extract contact details fields
   - Extract job-related fields

5. **Validate unique constraints**
   - Check if NIC number already exists
   - Check if email already exists
   - Raise ValidationError with specific message
   - Consider tenant isolation

6. **Validate foreign key relationships**
   - Verify department exists
   - Verify designation exists
   - Verify manager exists (if provided)
   - Verify shift exists (if provided)

7. **Generate employee_id**
   - Create unique employee identifier
   - Format: EMP-{year}-{sequence}
   - Example: EMP-2026-0001
   - Ensure uniqueness within tenant

8. **Create employee with transaction**
   - Use @transaction.atomic decorator
   - Create Employee instance
   - Create PersonalDetails instance
   - Create ContactDetails instance
   - Link all relationships

9. **Set initial employment status**
   - Default to ACTIVE if hire_date is today or past
   - Set to PENDING if hire_date is future
   - Create initial EmploymentStatus record

10. **Create history entry**
    - Call _create_history_entry
    - Action: "created"
    - Include all created data
    - Log created by user

11. **Send notifications**
    - Call _send_notification
    - Notify HR department
    - Notify department manager
    - Send welcome email to employee

12. **Log successful creation**
    - Log employee creation
    - Include employee_id
    - Include created by user

13. **Return created employee**
    - Return Employee instance
    - Include all related data
    - Ready for immediate use

### Create Employee Flow

```
┌────────────────────────────────────────────────┐
│         Create Employee Process                │
└────────────────────────────────────────────────┘
                    │
                    ▼
        ┌───────────────────────┐
        │  Validate Input Data  │
        └───────────┬───────────┘
                    │
                    ▼
        ┌───────────────────────┐
        │  Check Unique Fields  │
        │  (NIC, Email)         │
        └───────────┬───────────┘
                    │
                    ▼
        ┌───────────────────────┐
        │  Validate FK          │
        │  (Dept, Designation)  │
        └───────────┬───────────┘
                    │
                    ▼
        ┌───────────────────────┐
        │  Generate Employee ID │
        └───────────┬───────────┘
                    │
                    ▼
        ┌───────────────────────┐
        │  BEGIN TRANSACTION    │
        └───────────┬───────────┘
                    │
                    ▼
        ┌───────────────────────┐
        │  Create Employee      │
        └───────────┬───────────┘
                    │
                    ▼
        ┌───────────────────────┐
        │  Create PersonalDetails│
        └───────────┬───────────┘
                    │
                    ▼
        ┌───────────────────────┐
        │  Create ContactDetails│
        └───────────┬───────────┘
                    │
                    ▼
        ┌───────────────────────┐
        │  Set Employment Status│
        └───────────┬───────────┘
                    │
                    ▼
        ┌───────────────────────┐
        │  Create History Entry │
        └───────────┬───────────┘
                    │
                    ▼
        ┌───────────────────────┐
        │  COMMIT TRANSACTION   │
        └───────────┬───────────┘
                    │
                    ▼
        ┌───────────────────────┐
        │  Send Notifications   │
        └───────────┬───────────┘
                    │
                    ▼
        ┌───────────────────────┐
        │  Return Employee      │
        └───────────────────────┘
```

### Employee ID Generation Logic

```
Format: EMP-{YYYY}-{NNNN}

Examples:
  EMP-2026-0001  (First employee of 2026)
  EMP-2026-0234  (234th employee of 2026)
  EMP-2027-0001  (First employee of 2027)

Generation Steps:
1. Get current year
2. Query max sequence for this year and tenant
3. Increment sequence
4. Format with leading zeros (4 digits)
5. Combine: EMP-{year}-{sequence}
```

### Transaction Management

```python
# Pseudocode structure

@transaction.atomic
def create_employee(self, data, user):
    # All operations within transaction
    
    try:
        # Create employee
        employee = Employee.objects.create(...)
        
        # Create related records
        personal = PersonalDetails.objects.create(...)
        contact = ContactDetails.objects.create(...)
        
        # Create history
        history = EmployeeHistory.objects.create(...)
        
        # If any operation fails, all roll back
        return employee
        
    except Exception as e:
        # Transaction automatically rolls back
        # Log error and re-raise
        logger.error(f"Failed to create employee: {e}")
        raise
```

### Required Data Structure

```python
{
    # Basic Information
    "first_name": "Kasun",
    "last_name": "Perera",
    "nic_number": "912345678V",
    "email": "kasun.perera@example.lk",
    "phone": "+94712345678",
    
    # Job Information
    "department_id": 5,
    "designation_id": 12,
    "hire_date": "2026-02-01",
    "employment_type": "FULL_TIME",
    "work_location": "Colombo Office",
    "manager_id": 3,  # Optional
    "shift_id": 1,    # Optional
    
    # Personal Details
    "date_of_birth": "1991-08-15",
    "gender": "M",
    "nationality": "Sri Lankan",
    "marital_status": "MARRIED",
    "religion": "Buddhist",
    
    # Contact Details
    "address_line_1": "123 Galle Road",
    "address_line_2": "Bambalapitiya",
    "city": "Colombo",
    "province": "Western",
    "postal_code": "00400",
    "emergency_contact_name": "Nimal Perera",
    "emergency_contact_phone": "+94771234567",
    "emergency_contact_relationship": "Spouse",
    
    # Optional Fields
    "probation_end_date": "2026-08-01",
    "notes": "Transferred from Kandy branch"
}
```

### Validation Scenarios

| Scenario | Check | Error Message |
|----------|-------|---------------|
| Duplicate NIC | NIC exists in tenant | "Employee with this NIC already exists" |
| Duplicate Email | Email exists in system | "Email address already in use" |
| Invalid Department | Department not found | "Selected department does not exist" |
| Invalid Designation | Designation not found | "Selected designation does not exist" |
| Invalid Manager | Manager not in department | "Manager must be in same department" |
| Future Hire Date | hire_date > today + 6 months | "Hire date too far in future" |
| Past Hire Date | hire_date < today - 1 year | "Cannot create employee with old hire date" |

### Notification Recipients

```
On Employee Creation:
├── HR Department
│   ├── Email: "New employee created"
│   └── Details: Full employee information
│
├── Department Manager
│   ├── Email: "New team member"
│   └── Details: Employee name, designation, start date
│
├── Employee (if email provided)
│   ├── Email: "Welcome to the company"
│   └── Details: Login credentials, onboarding info
│
└── System Administrator (optional)
    └── Notification: New employee in system
```

### Expected Outcome
- Functional create_employee method
- Complete data validation
- Transaction safety
- History tracking
- Notification support
- Unique employee_id generation

### Verification Checklist
- [ ] create_employee method implemented
- [ ] Data validation added
- [ ] Unique constraint checks
- [ ] FK relationship validation
- [ ] Employee ID generation logic
- [ ] Transaction decorator applied
- [ ] Employee record creation
- [ ] PersonalDetails creation
- [ ] ContactDetails creation
- [ ] EmploymentStatus initialization
- [ ] History entry creation
- [ ] Notification sending
- [ ] Method docstring complete
- [ ] Error handling implemented
- [ ] Logging added

---

## Task 69: Implement Update Employee

### Overview
Implement the update_employee method in EmployeeService. This method handles updating existing employee records with change tracking, validation, and history logging. It supports partial updates and maintains data integrity.

### Dependencies
- Task 68: Implement create employee
- EmployeeHistory model exists
- All employee related models exist

### Instructions

1. **Open employee_service.py file**
   - Continue in `apps/employees/services/employee_service.py`
   - Locate EmployeeService class

2. **Define update_employee method**
   - Method signature: `update_employee(self, employee_id: int, data: dict, user: User) -> Employee`
   - Add comprehensive docstring
   - Support partial updates

3. **Fetch existing employee**
   - Query Employee by ID
   - Include tenant filtering
   - Raise ObjectDoesNotExist if not found
   - Use select_related for efficiency

4. **Store old data for history**
   - Serialize current employee state
   - Include all related data
   - Store in dictionary format
   - Will be used in history entry

5. **Validate update data**
   - Validate only provided fields
   - Skip validation for missing fields
   - Check unique constraints if changing NIC/email
   - Validate FK relationships if changing

6. **Check unique constraints**
   - If updating NIC, check uniqueness
   - If updating email, check uniqueness
   - Exclude current employee from check
   - Consider tenant isolation

7. **Extract field categories**
   - Separate employee fields
   - Separate personal detail fields
   - Separate contact detail fields
   - Separate job-related fields

8. **Update with transaction**
   - Use @transaction.atomic decorator
   - Update Employee fields
   - Update PersonalDetails if provided
   - Update ContactDetails if provided
   - Update EmploymentStatus if job changes

9. **Handle manager change**
   - If manager_id changes, validate new manager
   - Ensure manager is in same department
   - Update reporting relationship
   - Notify old and new managers

10. **Handle department change**
    - If department changes, clear manager
    - Update work location if needed
    - Create transfer history entry
    - Notify both departments

11. **Create history entry**
    - Call _create_history_entry
    - Action: "updated"
    - Include old_data and new_data
    - Log specific fields changed

12. **Send notifications**
    - Notify employee of changes
    - Notify HR if significant change
    - Notify manager if reporting changes
    - Log notification status

13. **Return updated employee**
    - Refresh employee from database
    - Include all related data
    - Return updated instance

### Update Employee Flow

```
┌────────────────────────────────────────────────┐
│         Update Employee Process                │
└────────────────────────────────────────────────┘
                    │
                    ▼
        ┌───────────────────────┐
        │  Fetch Employee       │
        └───────────┬───────────┘
                    │
                    ▼
        ┌───────────────────────┐
        │  Store Old Data       │
        └───────────┬───────────┘
                    │
                    ▼
        ┌───────────────────────┐
        │  Validate Update Data │
        └───────────┬───────────┘
                    │
                    ▼
        ┌───────────────────────┐
        │  Check Unique Fields  │
        │  (if changed)         │
        └───────────┬───────────┘
                    │
                    ▼
        ┌───────────────────────┐
        │  BEGIN TRANSACTION    │
        └───────────┬───────────┘
                    │
                    ▼
        ┌───────────────────────┐
        │  Update Employee      │
        └───────────┬───────────┘
                    │
                    ▼
        ┌───────────────────────┐
        │  Update PersonalDetails│
        │  (if provided)        │
        └───────────┬───────────┘
                    │
                    ▼
        ┌───────────────────────┐
        │  Update ContactDetails│
        │  (if provided)        │
        └───────────┬───────────┘
                    │
                    ▼
        ┌───────────────────────┐
        │  Handle Special Cases │
        │  (dept, manager)      │
        └───────────┬───────────┘
                    │
                    ▼
        ┌───────────────────────┐
        │  Create History Entry │
        └───────────┬───────────┘
                    │
                    ▼
        ┌───────────────────────┐
        │  COMMIT TRANSACTION   │
        └───────────┬───────────┘
                    │
                    ▼
        ┌───────────────────────┐
        │  Send Notifications   │
        └───────────┬───────────┘
                    │
                    ▼
        ┌───────────────────────┐
        │  Return Employee      │
        └───────────────────────┘
```

### Partial Update Support

```python
# Only update provided fields

Example 1: Update phone only
{
    "phone": "+94771234567"
}
Result: Only phone is updated

Example 2: Update department and manager
{
    "department_id": 8,
    "manager_id": 15
}
Result: Department and manager updated

Example 3: Update personal details
{
    "marital_status": "MARRIED",
    "address_line_1": "New Address"
}
Result: Marital status and address updated
```

### Change Detection

```
Track what changed for history:

Before:
{
    "first_name": "Kasun",
    "phone": "+94712345678",
    "department_id": 5
}

After:
{
    "first_name": "Kasun",
    "phone": "+94771234567",  ← Changed
    "department_id": 8         ← Changed
}

History Entry:
{
    "action": "updated",
    "changes": {
        "phone": {
            "old": "+94712345678",
            "new": "+94771234567"
        },
        "department": {
            "old": "IT Department",
            "new": "HR Department"
        }
    }
}
```

### Special Update Scenarios

#### Department Change
```
When department changes:
1. Validate new department exists
2. Clear current manager (different dept)
3. Update work_location if needed
4. Create "department_transfer" history
5. Notify old department manager
6. Notify new department manager
7. Notify HR department
```

#### Manager Change
```
When manager changes:
1. Validate new manager exists
2. Ensure manager in same department
3. Check for circular reporting (A→B→A)
4. Update reporting_manager field
5. Create "manager_change" history
6. Notify old manager
7. Notify new manager
8. Notify employee
```

#### Contact Information Change
```
When email/phone changes:
1. Validate new email/phone format
2. Check uniqueness for email
3. Update ContactDetails record
4. Create "contact_updated" history
5. Send verification to new email
6. Notify employee of change
```

#### Probation Completion
```
When probation_end_date is updated to past:
1. Check if date is in past
2. Update employment_status if needed
3. Create "probation_completed" history
4. Notify HR department
5. Notify employee
6. Trigger performance review process
```

### Unique Constraint Validation

| Field | Check Logic | Error Handling |
|-------|-------------|----------------|
| NIC | If changed, check unique excluding self | "NIC already in use by another employee" |
| Email | If changed, check unique in system | "Email already registered" |
| Employee ID | Never allow change | Raise error if attempted |

### History Entry Examples

#### Phone Update
```python
{
    "employee_id": "EMP-2026-0001",
    "action": "updated",
    "performed_by": "hr.admin@example.lk",
    "timestamp": "2026-01-24T10:30:00Z",
    "changes": {
        "phone": {
            "from": "+94712345678",
            "to": "+94771234567"
        }
    },
    "notes": "Updated at employee request"
}
```

#### Department Transfer
```python
{
    "employee_id": "EMP-2026-0001",
    "action": "department_transfer",
    "performed_by": "hr.manager@example.lk",
    "timestamp": "2026-01-24T14:00:00Z",
    "changes": {
        "department": {
            "from": "IT Department",
            "to": "HR Department"
        },
        "manager": {
            "from": "Sunil Silva",
            "to": null
        }
    },
    "notes": "Internal transfer effective 2026-02-01"
}
```

### Notification Matrix

| Change Type | Employee | Manager | Old Manager | HR | Department |
|-------------|----------|---------|-------------|-----|------------|
| Phone/Email | ✓ | - | - | - | - |
| Address | ✓ | - | - | ✓ | - |
| Department | ✓ | ✓ | ✓ | ✓ | ✓ |
| Manager | ✓ | ✓ | ✓ | - | - |
| Designation | ✓ | ✓ | - | ✓ | - |
| Salary | ✓ | - | - | ✓ | - |

### Expected Outcome
- Functional update_employee method
- Partial update support
- Change tracking
- History logging
- Special case handling
- Notification support

### Verification Checklist
- [ ] update_employee method implemented
- [ ] Employee fetch logic
- [ ] Old data storage
- [ ] Partial update support
- [ ] Unique constraint checks
- [ ] Transaction decorator
- [ ] Employee field updates
- [ ] PersonalDetails updates
- [ ] ContactDetails updates
- [ ] Department change handling
- [ ] Manager change handling
- [ ] History entry creation
- [ ] Notification sending
- [ ] Method docstring complete
- [ ] Error handling

---

## Task 70: Implement Employee Status Change

### Overview
Implement methods for changing employee status including activation, deactivation, termination, and resignation. These methods handle employment status transitions with proper validation, history tracking, and workflow management.

### Dependencies
- Task 69: Implement update employee
- EmploymentStatus model exists
- Status transition rules defined

### Instructions

1. **Open employee_service.py file**
   - Continue in `apps/employees/services/employee_service.py`
   - Locate EmployeeService class

2. **Define activate method**
   - Method signature: `activate(self, employee_id: int, user: User) -> Employee`
   - Activates inactive employee
   - Sets status to ACTIVE
   - Updates effective_date to today

3. **Implement activate logic**
   - Fetch employee
   - Validate current status allows activation
   - Update status to ACTIVE
   - Create history entry
   - Send activation notification
   - Return updated employee

4. **Define deactivate method**
   - Method signature: `deactivate(self, employee_id: int, reason: str, user: User) -> Employee`
   - Temporarily deactivates employee
   - Sets status to INACTIVE
   - Requires deactivation reason

5. **Implement deactivate logic**
   - Fetch employee
   - Validate current status is ACTIVE or ON_LEAVE
   - Validate reason is provided
   - Update status to INACTIVE
   - Store deactivation reason
   - Create history entry
   - Send deactivation notification

6. **Define terminate method**
   - Method signature: `terminate(self, employee_id: int, termination_date: date, reason: str, user: User) -> Employee`
   - Permanently terminates employment
   - Sets status to TERMINATED
   - Records termination details

7. **Implement terminate logic**
   - Fetch employee
   - Validate termination date (not future)
   - Validate reason is provided
   - Update status to TERMINATED
   - Set termination_date
   - Store termination_reason
   - Calculate final settlement
   - Deactivate user account
   - Create history entry
   - Send termination notification

8. **Define resign method**
   - Method signature: `resign(self, employee_id: int, resignation_date: date, reason: str, notice_days: int, user: User) -> Employee`
   - Processes employee resignation
   - Sets status to RESIGNED
   - Records resignation details

9. **Implement resign logic**
   - Fetch employee
   - Validate resignation_date (can be future)
   - Calculate last_working_day (resignation_date + notice_days)
   - Validate notice period meets minimum
   - Update status to RESIGNED
   - Set resignation_date and last_working_day
   - Store resignation_reason
   - Create exit interview task
   - Create history entry
   - Send resignation acknowledgment

10. **Add status transition validation**
    - Create _validate_status_transition method
    - Check if transition is allowed
    - Refer to status transition matrix
    - Raise ValidationError if invalid

11. **Add notice period validation**
    - Create _validate_notice_period method
    - Check minimum notice period by designation
    - Allow override with approval
    - Document policy exceptions

### Status Transition Rules

```
┌─────────────────────────────────────────────────┐
│       Employment Status Transitions             │
└─────────────────────────────────────────────────┘

ACTIVE → ON_LEAVE      (Apply for leave)
ACTIVE → INACTIVE      (Temporary suspension)
ACTIVE → TERMINATED    (Company termination)
ACTIVE → RESIGNED      (Employee resignation)

ON_LEAVE → ACTIVE      (Return from leave)
ON_LEAVE → RESIGNED    (Resign during leave)
ON_LEAVE → TERMINATED  (Terminate during leave)

INACTIVE → ACTIVE      (Reactivation)
INACTIVE → TERMINATED  (Terminate while inactive)

TERMINATED → (none)    (Final status)
RESIGNED → (none)      (Final status)
```

### Status Transition Matrix

| From | To | Allowed | Notes |
|------|-----|---------|-------|
| ACTIVE | ON_LEAVE | ✓ | Through leave application |
| ACTIVE | INACTIVE | ✓ | Requires reason |
| ACTIVE | TERMINATED | ✓ | Requires approval |
| ACTIVE | RESIGNED | ✓ | Employee initiated |
| ON_LEAVE | ACTIVE | ✓ | Return from leave |
| ON_LEAVE | RESIGNED | ✓ | During leave period |
| ON_LEAVE | TERMINATED | ✓ | Requires approval |
| INACTIVE | ACTIVE | ✓ | Reactivation |
| INACTIVE | TERMINATED | ✓ | Final termination |
| TERMINATED | * | ✗ | No transitions allowed |
| RESIGNED | * | ✗ | No transitions allowed |

### Activate Method Flow

```
┌────────────────────────────────────────┐
│         Activate Employee              │
└────────────────────────────────────────┘
                │
                ▼
    ┌───────────────────────┐
    │  Fetch Employee       │
    └───────────┬───────────┘
                │
                ▼
    ┌───────────────────────┐
    │  Validate Status      │
    │  (INACTIVE only)      │
    └───────────┬───────────┘
                │
                ▼
    ┌───────────────────────┐
    │  Update Status        │
    │  status = ACTIVE      │
    └───────────┬───────────┘
                │
                ▼
    ┌───────────────────────┐
    │  Set effective_date   │
    │  = today              │
    └───────────┬───────────┘
                │
                ▼
    ┌───────────────────────┐
    │  Create History       │
    │  "activated"          │
    └───────────┬───────────┘
                │
                ▼
    ┌───────────────────────┐
    │  Notify Employee      │
    │  & Manager            │
    └───────────┬───────────┘
                │
                ▼
    ┌───────────────────────┐
    │  Return Employee      │
    └───────────────────────┘
```

### Deactivate Method Flow

```
┌────────────────────────────────────────┐
│         Deactivate Employee            │
└────────────────────────────────────────┘
                │
                ▼
    ┌───────────────────────┐
    │  Fetch Employee       │
    └───────────┬───────────┘
                │
                ▼
    ┌───────────────────────┐
    │  Validate Status      │
    │  (ACTIVE/ON_LEAVE)    │
    └───────────┬───────────┘
                │
                ▼
    ┌───────────────────────┐
    │  Validate Reason      │
    │  (required)           │
    └───────────┬───────────┘
                │
                ▼
    ┌───────────────────────┐
    │  Update Status        │
    │  status = INACTIVE    │
    └───────────┬───────────┘
                │
                ▼
    ┌───────────────────────┐
    │  Store Reason         │
    └───────────┬───────────┘
                │
                ▼
    ┌───────────────────────┐
    │  Suspend Access       │
    │  (disable user)       │
    └───────────┬───────────┘
                │
                ▼
    ┌───────────────────────┐
    │  Create History       │
    │  "deactivated"        │
    └───────────┬───────────┘
                │
                ▼
    ┌───────────────────────┐
    │  Notify Employee      │
    │  & HR                 │
    └───────────────────────┘
```

### Terminate Method Flow

```
┌────────────────────────────────────────┐
│         Terminate Employee             │
└────────────────────────────────────────┘
                │
                ▼
    ┌───────────────────────┐
    │  Fetch Employee       │
    └───────────┬───────────┘
                │
                ▼
    ┌───────────────────────┐
    │  Validate Date        │
    │  (not future)         │
    └───────────┬───────────┘
                │
                ▼
    ┌───────────────────────┐
    │  Validate Reason      │
    │  (required)           │
    └───────────┬───────────┘
                │
                ▼
    ┌───────────────────────┐
    │  Update Status        │
    │  status = TERMINATED  │
    └───────────┬───────────┘
                │
                ▼
    ┌───────────────────────┐
    │  Set termination_date │
    └───────────┬───────────┘
                │
                ▼
    ┌───────────────────────┐
    │  Store Reason         │
    └───────────┬───────────┘
                │
                ▼
    ┌───────────────────────┐
    │  Calculate Settlement │
    └───────────┬───────────┘
                │
                ▼
    ┌───────────────────────┐
    │  Deactivate User      │
    │  Account              │
    └───────────┬───────────┘
                │
                ▼
    ┌───────────────────────┐
    │  Create History       │
    │  "terminated"         │
    └───────────┬───────────┘
                │
                ▼
    ┌───────────────────────┐
    │  Generate Documents   │
    │  (termination letter) │
    └───────────┬───────────┘
                │
                ▼
    ┌───────────────────────┐
    │  Notify Employee      │
    │  & HR                 │
    └───────────────────────┘
```

### Resign Method Flow

```
┌────────────────────────────────────────┐
│         Process Resignation            │
└────────────────────────────────────────┘
                │
                ▼
    ┌───────────────────────┐
    │  Fetch Employee       │
    └───────────┬───────────┘
                │
                ▼
    ┌───────────────────────┐
    │  Validate Notice      │
    │  Period               │
    └───────────┬───────────┘
                │
                ▼
    ┌───────────────────────┐
    │  Calculate Last       │
    │  Working Day          │
    └───────────┬───────────┘
                │
                ▼
    ┌───────────────────────┐
    │  Update Status        │
    │  status = RESIGNED    │
    └───────────┬───────────┘
                │
                ▼
    ┌───────────────────────┐
    │  Set resignation_date │
    │  & last_working_day   │
    └───────────┬───────────┘
                │
                ▼
    ┌───────────────────────┐
    │  Store Reason         │
    └───────────┬───────────┘
                │
                ▼
    ┌───────────────────────┐
    │  Create Exit Interview│
    │  Task                 │
    └───────────┬───────────┘
                │
                ▼
    ┌───────────────────────┐
    │  Create History       │
    │  "resigned"           │
    └───────────┬───────────┘
                │
                ▼
    ┌───────────────────────┐
    │  Initiate Handover    │
    │  Process              │
    └───────────┬───────────┘
                │
                ▼
    ┌───────────────────────┐
    │  Send Acknowledgment  │
    └───────────────────────┘
```

### Notice Period Rules (Sri Lanka Context)

| Position Level | Minimum Notice | Common Practice |
|----------------|----------------|-----------------|
| Executive/Manager | 3 months | 90 days |
| Senior Staff | 1 month | 30 days |
| Staff | 2 weeks | 14 days |
| Probation | 1 week | 7 days |
| Contract | Per agreement | Varies |

### Termination Reasons (Examples)

- Performance issues
- Misconduct
- Attendance problems
- Policy violation
- Redundancy
- End of contract
- Failed probation
- Mutual agreement

### Resignation Reasons (Examples)

- Better opportunity
- Personal reasons
- Career change
- Further education
- Health reasons
- Relocation
- Family commitments
- Retirement

### Final Settlement Calculation

```
For Termination:
├── Salary up to termination date
├── Unused annual leave payment
├── Gratuity (if eligible)
├── EPF/ETF contributions
└── Notice period payment (if applicable)

For Resignation:
├── Salary up to last working day
├── Unused annual leave payment
├── Gratuity (if eligible)
├── EPF/ETF contributions
└── Less: Notice period buyout (if applicable)
```

### Expected Outcome
- Functional status change methods
- Status transition validation
- History tracking for all changes
- Notice period validation
- Settlement calculation support
- Notification system

### Verification Checklist
- [ ] activate method implemented
- [ ] deactivate method implemented
- [ ] terminate method implemented
- [ ] resign method implemented
- [ ] _validate_status_transition method
- [ ] _validate_notice_period method
- [ ] Status validation logic
- [ ] Date validation logic
- [ ] Reason validation
- [ ] History entry creation
- [ ] User account handling
- [ ] Settlement calculation
- [ ] Notification sending
- [ ] Method docstrings complete

---

## Task 71: Implement Link User Account

### Overview
Implement functionality to link and unlink user accounts to employee records. This allows employees to access the system with login credentials and enables self-service features. The service handles user creation, account linking, role assignment, and credential management.

### Dependencies
- Task 70: Implement status changes
- User model exists (from auth system)
- Role and Permission models exist
- Email service configured

### Instructions

1. **Open employee_service.py file**
   - Continue in `apps/employees/services/employee_service.py`
   - Locate EmployeeService class

2. **Define link_user_account method**
   - Method signature: `link_user_account(self, employee_id: int, user_data: dict, user: User) -> tuple[Employee, User, str]`
   - Returns: (employee, user, temporary_password)
   - Creates or links user account to employee

3. **Implement fetch employee logic**
   - Query employee by ID
   - Ensure employee doesn't have linked user
   - Validate employee status is ACTIVE
   - Raise error if already linked

4. **Check if user exists**
   - Check if user with employee's email exists
   - If exists, verify not linked to another employee
   - If new, prepare to create user

5. **Generate username**
   - Create username from employee email
   - Format: lowercase email prefix
   - Example: kasun.perera@example.lk → kasun.perera
   - Ensure uniqueness by adding number if needed

6. **Generate temporary password**
   - Create secure random password
   - Minimum 12 characters
   - Include uppercase, lowercase, numbers, symbols
   - Store for sending to employee

7. **Create or update user**
   - If new user, create User instance
   - Set username, email, password
   - Set is_active = True
   - If existing, verify and link

8. **Link employee to user**
   - Set employee.user = user
   - Set user.employee_id = employee.id
   - Save both records with transaction

9. **Assign default role**
   - Assign EMPLOYEE role by default
   - Additional roles from user_data if provided
   - Consider department-specific roles
   - Set role permissions

10. **Create user profile**
    - Create UserProfile if not exists
    - Link to employee record
    - Set profile preferences
    - Set notification preferences

11. **Send welcome email**
    - Email employee with credentials
    - Include username and temporary password
    - Include password reset link
    - Include system access instructions

12. **Create history entry**
    - Action: "user_account_linked"
    - Include username created
    - Log who performed the action

13. **Define unlink_user_account method**
    - Method signature: `unlink_user_account(self, employee_id: int, user: User) -> Employee`
    - Removes user account link
    - Deactivates user account

14. **Implement unlink logic**
    - Fetch employee
    - Verify user is linked
    - Deactivate user account (don't delete)
    - Remove employee.user link
    - Remove user.employee_id
    - Create history entry
    - Notify employee

### User Account Linking Flow

```
┌────────────────────────────────────────┐
│       Link User Account Process        │
└────────────────────────────────────────┘
                │
                ▼
    ┌───────────────────────┐
    │  Fetch Employee       │
    └───────────┬───────────┘
                │
                ▼
    ┌───────────────────────┐
    │  Validate Eligible    │
    │  (ACTIVE, no user)    │
    └───────────┬───────────┘
                │
                ▼
    ┌───────────────────────┐
    │  Check if User Exists │
    │  (by email)           │
    └───────────┬───────────┘
                │
                ▼
    ┌───────────────────────┐
    │  Generate Username    │
    └───────────┬───────────┘
                │
                ▼
    ┌───────────────────────┐
    │  Generate Temp        │
    │  Password             │
    └───────────┬───────────┘
                │
                ▼
    ┌───────────────────────┐
    │  BEGIN TRANSACTION    │
    └───────────┬───────────┘
                │
                ▼
    ┌───────────────────────┐
    │  Create/Update User   │
    └───────────┬───────────┘
                │
                ▼
    ┌───────────────────────┐
    │  Link Employee ↔ User │
    └───────────┬───────────┘
                │
                ▼
    ┌───────────────────────┐
    │  Assign Role          │
    │  (EMPLOYEE)           │
    └───────────┬───────────┘
                │
                ▼
    ┌───────────────────────┐
    │  Create UserProfile   │
    └───────────┬───────────┘
                │
                ▼
    ┌───────────────────────┐
    │  Create History       │
    └───────────┬───────────┘
                │
                ▼
    ┌───────────────────────┐
    │  COMMIT TRANSACTION   │
    └───────────┬───────────┘
                │
                ▼
    ┌───────────────────────┐
    │  Send Welcome Email   │
    │  (with credentials)   │
    └───────────┬───────────┘
                │
                ▼
    ┌───────────────────────┐
    │  Return Employee,     │
    │  User, Password       │
    └───────────────────────┘
```

### Username Generation Logic

```python
# Pseudocode

def generate_username(email):
    # Extract prefix from email
    prefix = email.split('@')[0]
    
    # Clean and lowercase
    username = prefix.lower().replace(' ', '.')
    
    # Check if exists
    if User.objects.filter(username=username).exists():
        # Add number suffix
        counter = 1
        while User.objects.filter(
            username=f"{username}{counter}"
        ).exists():
            counter += 1
        username = f"{username}{counter}"
    
    return username

# Examples:
kasun.perera@example.lk → kasun.perera
john.doe@example.lk → john.doe
john.doe@example.lk (2nd) → john.doe1
```

### Password Generation

```python
# Pseudocode

def generate_temp_password():
    # Use Django's make_random_password
    # Or custom implementation
    
    import secrets
    import string
    
    # Character sets
    uppercase = string.ascii_uppercase
    lowercase = string.ascii_lowercase
    digits = string.digits
    symbols = '!@#$%^&*'
    
    # Ensure at least one of each
    password = [
        secrets.choice(uppercase),
        secrets.choice(lowercase),
        secrets.choice(digits),
        secrets.choice(symbols),
    ]
    
    # Fill remaining with random
    all_chars = uppercase + lowercase + digits + symbols
    password += [
        secrets.choice(all_chars) 
        for _ in range(8)
    ]
    
    # Shuffle
    secrets.SystemRandom().shuffle(password)
    
    return ''.join(password)

# Example output: K3$mP9qR@xY2
```

### Role Assignment Logic

```
Default Role: EMPLOYEE
├── Can view own profile
├── Can update own contact info
├── Can apply for leave
├── Can view pay slips
└── Can update preferences

Additional Roles (if provided):
├── MANAGER (if employee is manager)
│   ├── Can view team members
│   ├── Can approve leave requests
│   └── Can view team reports
│
├── HR_STAFF (if in HR department)
│   ├── Can view all employees
│   ├── Can create employees
│   └── Can generate reports
│
└── DEPARTMENT_HEAD
    ├── Can manage department
    ├── Can approve budgets
    └── Can view department analytics
```

### Welcome Email Template

```
Subject: Welcome to [Company Name] - Your System Access

Dear Kasun Perera,

Welcome to [Company Name]! Your employee account has been created.

Your Login Details:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Username: kasun.perera
Temporary Password: K3$mP9qR@xY2
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

System URL: https://erp.example.lk

Important:
• You must change your password on first login
• Your temporary password will expire in 24 hours
• Contact IT support if you face any issues

To get started:
1. Visit the system URL above
2. Log in with your credentials
3. Change your password
4. Complete your profile

Need help? Contact: support@example.lk

Best regards,
HR Department
[Company Name]
```

### User Account Data Structure

```python
{
    "username": "kasun.perera",
    "email": "kasun.perera@example.lk",
    "password": "K3$mP9qR@xY2",  # Temporary
    "first_name": "Kasun",
    "last_name": "Perera",
    "is_active": True,
    "is_staff": False,  # Unless HR/Admin
    "employee_id": 123,
    "roles": ["EMPLOYEE"],
    "profile": {
        "phone": "+94712345678",
        "avatar": None,
        "language": "en",
        "timezone": "Asia/Colombo",
        "notifications": {
            "email": True,
            "sms": False,
            "push": True
        }
    }
}
```

### Unlink User Account Flow

```
┌────────────────────────────────────────┐
│      Unlink User Account Process       │
└────────────────────────────────────────┘
                │
                ▼
    ┌───────────────────────┐
    │  Fetch Employee       │
    └───────────┬───────────┘
                │
                ▼
    ┌───────────────────────┐
    │  Verify User Linked   │
    └───────────┬───────────┘
                │
                ▼
    ┌───────────────────────┐
    │  BEGIN TRANSACTION    │
    └───────────┬───────────┘
                │
                ▼
    ┌───────────────────────┐
    │  Deactivate User      │
    │  is_active = False    │
    └───────────┬───────────┘
                │
                ▼
    ┌───────────────────────┐
    │  Remove Links         │
    │  employee.user = None │
    │  user.employee_id=None│
    └───────────┬───────────┘
                │
                ▼
    ┌───────────────────────┐
    │  Revoke Sessions      │
    └───────────┬───────────┘
                │
                ▼
    ┌───────────────────────┐
    │  Create History       │
    │  "user_unlinked"      │
    └───────────┬───────────┘
                │
                ▼
    ┌───────────────────────┐
    │  COMMIT TRANSACTION   │
    └───────────┬───────────┘
                │
                ▼
    ┌───────────────────────┐
    │  Notify Employee      │
    │  (account disabled)   │
    └───────────┬───────────┘
                │
                ▼
    ┌───────────────────────┐
    │  Return Employee      │
    └───────────────────────┘
```

### Security Considerations

| Aspect | Implementation |
|--------|----------------|
| Password Strength | Min 12 chars, mixed case, numbers, symbols |
| Password Expiry | Temporary password expires in 24 hours |
| First Login | Force password change on first login |
| Account Lockout | Lock after 5 failed attempts |
| Session Management | Single active session per user |
| Two-Factor Auth | Optional for sensitive roles |

### Expected Outcome
- Functional user account linking
- Secure user creation
- Role assignment
- Welcome email with credentials
- Account unlinking support
- History tracking

### Verification Checklist
- [ ] link_user_account method implemented
- [ ] Employee fetch and validation
- [ ] User existence check
- [ ] Username generation logic
- [ ] Password generation logic
- [ ] User creation/update
- [ ] Employee-User linking
- [ ] Role assignment
- [ ] UserProfile creation
- [ ] Welcome email sending
- [ ] History entry creation
- [ ] unlink_user_account method
- [ ] User deactivation logic
- [ ] Session revocation
- [ ] Method docstrings complete

---

## Task 72: Create EmployeeSearchService

### Overview
Create the EmployeeSearchService class for comprehensive employee search functionality. This service provides efficient search and filtering capabilities using full-text search, department filtering, status filtering, and advanced query building.

### Dependencies
- EmployeeService class exists
- PostgreSQL full-text search configured
- Employee and related models exist

### Instructions

1. **Create search_service.py file**
   - Create file at `apps/employees/services/search_service.py`
   - This will contain the EmployeeSearchService class

2. **Import required modules**
   - Import Django Q objects and query functions
   - Import PostgreSQL search vectors
   - Import Employee and related models
   - Import typing modules for type hints
   - Import logging

3. **Define EmployeeSearchService class**
   - Create class with comprehensive docstring
   - Document search capabilities
   - List all search methods

4. **Add class initialization**
   - Accept optional tenant parameter
   - Initialize search configuration
   - Set up field weights for ranking

5. **Define search method (main)**
   - Method signature: `search(self, query: str = None, filters: dict = None, limit: int = 50, offset: int = 0) -> dict`
   - Combines full-text search with filters
   - Returns paginated results with metadata

6. **Implement base queryset building**
   - Start with Employee.objects.all()
   - Apply tenant filtering
   - Use select_related for efficiency
   - Include related data (department, designation, etc.)

7. **Add query parameter handling**
   - If query provided, apply full-text search
   - If no query, return all (with filters)
   - Support empty query for filter-only searches

8. **Add filter application logic**
   - Apply department filter if provided
   - Apply status filter if provided
   - Apply manager filter if provided
   - Apply employment_type filter if provided
   - Support multiple filters simultaneously

9. **Add ordering logic**
   - Default order by relevance (if search query)
   - Fallback order by last_name, first_name
   - Support custom ordering from filters

10. **Add pagination logic**
    - Apply limit and offset
    - Calculate total count before pagination
    - Return page metadata

11. **Add result formatting**
    - Serialize employee data
    - Include relevance scores
    - Include related data
    - Return consistent structure

12. **Define _build_search_vector method**
    - Create PostgreSQL search vector
    - Include searchable fields with weights
    - Configure language (English)
    - Return SearchVector

13. **Define _calculate_relevance method**
    - Calculate search result relevance
    - Apply field weights
    - Return ranking value

14. **Update services/__init__.py**
    - Import EmployeeSearchService
    - Add to __all__ list

### EmployeeSearchService Class Structure

```
┌─────────────────────────────────────────────────┐
│       EmployeeSearchService Class               │
├─────────────────────────────────────────────────┤
│ Public Methods:                                 │
│  • search(query, filters, limit, offset)        │
│  • search_by_name(name)                         │
│  • search_by_email(email)                       │
│  • search_by_employee_id(employee_id)           │
│  • filter_by_department(department_id)          │
│  • filter_by_status(status)                     │
│  • filter_by_manager(manager_id)                │
│  • advanced_search(criteria)                    │
│                                                 │
│ Private Helper Methods:                         │
│  • _build_search_vector()                       │
│  • _calculate_relevance(query)                  │
│  • _apply_filters(queryset, filters)            │
│  • _serialize_results(employees)                │
└─────────────────────────────────────────────────┘
```

### Search Service Architecture

```
┌──────────────────────────────────────────┐
│        Search Request                    │
└──────────────┬───────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────┐
│    EmployeeSearchService                 │
│                                          │
│  ┌────────────────────────────────────┐ │
│  │  Parse Query & Filters             │ │
│  └────────────┬───────────────────────┘ │
│               │                          │
│               ▼                          │
│  ┌────────────────────────────────────┐ │
│  │  Build Base Queryset               │ │
│  └────────────┬───────────────────────┘ │
│               │                          │
│               ▼                          │
│  ┌────────────────────────────────────┐ │
│  │  Apply Full-Text Search            │ │
│  │  (PostgreSQL SearchVector)         │ │
│  └────────────┬───────────────────────┘ │
│               │                          │
│               ▼                          │
│  ┌────────────────────────────────────┐ │
│  │  Apply Filters                     │ │
│  │  (dept, status, etc.)              │ │
│  └────────────┬───────────────────────┘ │
│               │                          │
│               ▼                          │
│  ┌────────────────────────────────────┐ │
│  │  Apply Ordering & Pagination       │ │
│  └────────────┬───────────────────────┘ │
│               │                          │
│               ▼                          │
│  ┌────────────────────────────────────┐ │
│  │  Serialize Results                 │ │
│  └────────────┬───────────────────────┘ │
└───────────────┼──────────────────────────┘
                │
                ▼
┌──────────────────────────────────────────┐
│        Search Response                   │
│  {                                       │
│    "results": [...],                     │
│    "total": 47,                          │
│    "page": 1,                            │
│    "pages": 2                            │
│  }                                       │
└──────────────────────────────────────────┘
```

### PostgreSQL Full-Text Search Configuration

```python
# Pseudocode

from django.contrib.postgres.search import (
    SearchVector, SearchQuery, SearchRank
)

def _build_search_vector():
    # Create search vector with field weights
    return (
        SearchVector('first_name', weight='A') +
        SearchVector('last_name', weight='A') +
        SearchVector('email', weight='B') +
        SearchVector('employee_id', weight='B') +
        SearchVector('designation__name', weight='C') +
        SearchVector('department__name', weight='C') +
        SearchVector('phone', weight='D')
    )

# Weight values:
# A = 1.0 (highest priority - names)
# B = 0.8 (high priority - identifiers)
# C = 0.5 (medium priority - job info)
# D = 0.3 (low priority - contact)
```

### Search Method Implementation

```python
# Pseudocode

def search(self, query=None, filters=None, limit=50, offset=0):
    # Start with base queryset
    qs = Employee.objects.select_related(
        'department', 'designation', 'manager'
    )
    
    # Apply tenant filter
    if self.tenant:
        qs = qs.filter(tenant=self.tenant)
    
    # Apply full-text search
    if query:
        search_vector = self._build_search_vector()
        search_query = SearchQuery(query, config='english')
        
        qs = qs.annotate(
            search=search_vector,
            rank=SearchRank(search_vector, search_query)
        ).filter(
            search=search_query
        ).order_by('-rank')
    
    # Apply filters
    if filters:
        qs = self._apply_filters(qs, filters)
    
    # Get total count
    total = qs.count()
    
    # Apply pagination
    qs = qs[offset:offset + limit]
    
    # Serialize results
    results = self._serialize_results(qs)
    
    # Return with metadata
    return {
        'results': results,
        'total': total,
        'limit': limit,
        'offset': offset,
        'pages': (total + limit - 1) // limit
    }
```

### Search Query Examples

#### Simple Name Search
```python
service = EmployeeSearchService()
results = service.search(query="kasun")

# Searches in:
# - first_name: "Kasun"
# - last_name: "Kasun"
# - email: "kasun@..."
```

#### Search with Department Filter
```python
results = service.search(
    query="developer",
    filters={
        'department_id': 5,
        'status': 'ACTIVE'
    }
)

# Returns: Active developers in department 5
```

#### Filter-Only Search (No Query)
```python
results = service.search(
    filters={
        'department_id': 5,
        'employment_type': 'FULL_TIME'
    }
)

# Returns: All full-time employees in department 5
```

### Search Response Format

```python
{
    "results": [
        {
            "id": 123,
            "employee_id": "EMP-2026-0001",
            "first_name": "Kasun",
            "last_name": "Perera",
            "email": "kasun.perera@example.lk",
            "phone": "+94712345678",
            "designation": {
                "id": 12,
                "name": "Senior Developer"
            },
            "department": {
                "id": 5,
                "name": "IT Department"
            },
            "status": "ACTIVE",
            "hire_date": "2024-01-15",
            "relevance": 0.87  # Only if search query provided
        },
        # ... more results
    ],
    "total": 47,
    "limit": 50,
    "offset": 0,
    "pages": 1
}
```

### Filter Support Matrix

| Filter | Type | Example | Description |
|--------|------|---------|-------------|
| department_id | Integer | 5 | Filter by department |
| designation_id | Integer | 12 | Filter by designation |
| status | String | "ACTIVE" | Filter by employment status |
| employment_type | String | "FULL_TIME" | Filter by employment type |
| manager_id | Integer | 8 | Filter by reporting manager |
| hire_date_from | Date | "2024-01-01" | Hired on or after |
| hire_date_to | Date | "2024-12-31" | Hired on or before |
| has_user_account | Boolean | true | Has linked user account |

### Searchable Fields with Weights

```
Weight A (1.0) - Primary Identity:
├── first_name
└── last_name

Weight B (0.8) - Identifiers:
├── email
└── employee_id

Weight C (0.5) - Job Information:
├── designation__name
└── department__name

Weight D (0.3) - Additional:
└── phone
```

### Expected Outcome
- Functional EmployeeSearchService class
- Full-text search support
- Filter application logic
- Pagination support
- Relevance ranking
- Efficient query building

### Verification Checklist
- [ ] search_service.py file created
- [ ] EmployeeSearchService class defined
- [ ] search method implemented
- [ ] _build_search_vector method
- [ ] _calculate_relevance method
- [ ] _apply_filters method
- [ ] _serialize_results method
- [ ] Pagination logic
- [ ] Select_related optimization
- [ ] Tenant filtering
- [ ] Response formatting
- [ ] Class docstring complete
- [ ] EmployeeSearchService imported in __init__.py

---

## Task 73: Implement Full-Text Search

### Overview
Implement dedicated full-text search methods in EmployeeSearchService. These methods provide specialized search functionality for different search scenarios including name search, email lookup, and employee ID search with proper ranking and relevance scoring.

### Dependencies
- Task 72: Create EmployeeSearchService class
- PostgreSQL full-text search extensions enabled
- Search vector configuration complete

### Instructions

1. **Open search_service.py file**
   - Navigate to `apps/employees/services/search_service.py`
   - Locate EmployeeSearchService class

2. **Define search_by_name method**
   - Method signature: `search_by_name(self, name: str, limit: int = 20) -> list`
   - Searches specifically in first_name and last_name
   - Higher weight on exact matches
   - Returns ranked results

3. **Implement search_by_name logic**
   - Build search vector for name fields only
   - Create search query from name parameter
   - Apply higher weight to first_name
   - Annotate with rank
   - Order by rank descending
   - Apply limit
   - Return serialized results

4. **Handle partial name matching**
   - Support first name only: "Kasun"
   - Support last name only: "Perera"
   - Support full name: "Kasun Perera"
   - Support reverse order: "Perera Kasun"

5. **Define search_by_email method**
   - Method signature: `search_by_email(self, email: str, exact: bool = False) -> list`
   - Searches in email field
   - Supports exact and partial matching
   - Case-insensitive

6. **Implement search_by_email logic**
   - If exact=True, use __iexact lookup
   - If exact=False, use __icontains or search vector
   - Support partial email: "kasun@"
   - Support domain search: "@example.lk"
   - Return matching employees

7. **Define search_by_employee_id method**
   - Method signature: `search_by_employee_id(self, employee_id: str, exact: bool = True) -> list`
   - Searches by employee ID
   - Supports exact and partial matching

8. **Implement search_by_employee_id logic**
   - If exact=True, use exact match
   - If exact=False, use __icontains
   - Support year search: "2026"
   - Support sequence: "0001"
   - Return matching employees

9. **Define advanced_search method**
   - Method signature: `advanced_search(self, criteria: dict) -> list`
   - Supports complex search criteria
   - Combines multiple search fields
   - Uses AND/OR logic as specified

10. **Implement advanced_search logic**
    - Build Q objects from criteria
    - Support multiple name fields
    - Support date range searches
    - Support numeric range searches (e.g., salary)
    - Combine with AND or OR as specified
    - Apply ranking to results

11. **Add search suggestion method**
    - Method signature: `suggest(self, partial: str, limit: int = 5) -> list`
    - Provides search suggestions as user types
    - Quick autocomplete support
    - Returns simple list of suggestions

12. **Implement suggestion logic**
    - Search across key fields
    - Return only name and employee_id
    - Optimize for speed
    - Limit results for quick response

### Search by Name Flow

```
┌────────────────────────────────────────┐
│       Search by Name Process           │
└────────────────────────────────────────┘
                │
                ▼
    ┌───────────────────────┐
    │  Parse Name Input     │
    │  "Kasun Perera"       │
    └───────────┬───────────┘
                │
                ▼
    ┌───────────────────────┐
    │  Build Search Vector  │
    │  (first + last name)  │
    └───────────┬───────────┘
                │
                ▼
    ┌───────────────────────┐
    │  Create Search Query  │
    └───────────┬───────────┘
                │
                ▼
    ┌───────────────────────┐
    │  Apply Search         │
    └───────────┬───────────┘
                │
                ▼
    ┌───────────────────────┐
    │  Calculate Rank       │
    └───────────┬───────────┘
                │
                ▼
    ┌───────────────────────┐
    │  Order by Rank        │
    └───────────┬───────────┘
                │
                ▼
    ┌───────────────────────┐
    │  Return Top Results   │
    └───────────────────────┘
```

### Name Search Examples

```python
# Single name search
service.search_by_name("Kasun")
# Matches:
# - Kasun Perera (first_name match)
# - Nimal Kasun (last_name match)
# - Kasun Rajapakse (first_name match)

# Full name search
service.search_by_name("Kasun Perera")
# Matches:
# - Kasun Perera (exact match - highest rank)
# - Kasun Fernando (partial match)
# - Nimal Perera (partial match)

# Partial name
service.search_by_name("Kas")
# Matches:
# - Kasun Perera
# - Kasuni Silva
# - Kasunika De Silva
```

### Email Search Scenarios

```python
# Exact email search
service.search_by_email("kasun.perera@example.lk", exact=True)
# Returns: Exactly kasun.perera@example.lk

# Partial email search
service.search_by_email("kasun", exact=False)
# Returns:
# - kasun.perera@example.lk
# - kasuni.silva@example.lk
# - nimal.kasun@example.lk

# Domain search
service.search_by_email("@example.lk", exact=False)
# Returns: All employees with @example.lk email

# Prefix search
service.search_by_email("kasun@", exact=False)
# Returns:
# - kasun.perera@example.lk
# - kasun.fernando@example.lk
```

### Employee ID Search Scenarios

```python
# Exact ID search
service.search_by_employee_id("EMP-2026-0001", exact=True)
# Returns: Exactly EMP-2026-0001

# Year search
service.search_by_employee_id("2026", exact=False)
# Returns: All employees from 2026
# - EMP-2026-0001
# - EMP-2026-0002
# - ... all 2026 employees

# Sequence search
service.search_by_employee_id("0001", exact=False)
# Returns: All employees with sequence 0001
# - EMP-2024-0001
# - EMP-2025-0001
# - EMP-2026-0001
```

### Advanced Search Examples

```python
# Search by name AND department
service.advanced_search({
    'name': 'Kasun',
    'department_id': 5,
    'logic': 'AND'
})
# Returns: Employees named Kasun in department 5

# Search by hire date range
service.advanced_search({
    'hire_date_from': '2024-01-01',
    'hire_date_to': '2024-12-31',
    'status': 'ACTIVE',
    'logic': 'AND'
})
# Returns: Active employees hired in 2024

# Complex OR search
service.advanced_search({
    'department_id': [5, 8, 12],  # IT, HR, Finance
    'designation_id': [20],        # Manager
    'logic': 'OR'
})
# Returns: Managers OR employees in IT/HR/Finance
```

### Advanced Search Criteria Structure

```python
{
    # Text search fields
    "name": "Kasun",              # Searches first + last name
    "email": "kasun@",            # Email search
    "employee_id": "2026",        # ID search
    
    # Exact match fields
    "department_id": 5,           # Single value
    "department_id": [5, 8, 12],  # Multiple values (OR)
    "designation_id": 20,
    "status": "ACTIVE",
    "employment_type": "FULL_TIME",
    "manager_id": 8,
    
    # Date range fields
    "hire_date_from": "2024-01-01",
    "hire_date_to": "2024-12-31",
    "birth_date_from": "1990-01-01",
    "birth_date_to": "2000-12-31",
    
    # Boolean fields
    "has_user_account": True,
    "on_probation": False,
    
    # Numeric range
    "age_min": 25,
    "age_max": 40,
    
    # Logic operator
    "logic": "AND"  # or "OR"
}
```

### Search Suggestion Implementation

```python
# Pseudocode

def suggest(self, partial: str, limit: int = 5):
    if len(partial) < 2:
        return []  # Minimum 2 characters
    
    # Quick search in key fields
    suggestions = Employee.objects.filter(
        Q(first_name__istartswith=partial) |
        Q(last_name__istartswith=partial) |
        Q(employee_id__icontains=partial)
    ).values(
        'id',
        'first_name',
        'last_name',
        'employee_id'
    )[:limit]
    
    # Format for display
    return [
        {
            'id': s['id'],
            'label': f"{s['first_name']} {s['last_name']}",
            'employee_id': s['employee_id']
        }
        for s in suggestions
    ]

# Example output:
[
    {'id': 123, 'label': 'Kasun Perera', 'employee_id': 'EMP-2026-0001'},
    {'id': 124, 'label': 'Kasuni Silva', 'employee_id': 'EMP-2026-0012'},
    {'id': 189, 'label': 'Kasunika De Silva', 'employee_id': 'EMP-2025-0089'}
]
```

### Ranking and Relevance

```
Ranking Formula:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Rank = (field_match_weight × field_score)

Field Weights:
- Exact match: 1.0
- Prefix match: 0.8
- Contains match: 0.6
- Suffix match: 0.4

Field Scores:
- first_name: 1.0
- last_name: 1.0
- email: 0.8
- employee_id: 0.7
- designation: 0.5
- department: 0.5

Example:
Query: "Kasun"
- first_name = "Kasun" → exact match → 1.0 × 1.0 = 1.0
- first_name = "Kasuni" → prefix match → 0.8 × 1.0 = 0.8
- last_name = "Nimal Kasun" → contains → 0.6 × 1.0 = 0.6
```

### Performance Optimization

```
Optimization Strategies:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Index Creation:
   - GIN index on search vector
   - B-tree index on employee_id
   - B-tree index on email
   - Composite index on (tenant, status)

2. Query Optimization:
   - Use select_related for joins
   - Limit number of results
   - Cache frequent searches
   - Use explain analyze for slow queries

3. Search Vector:
   - Pre-compute search vector (optional)
   - Update on employee changes
   - Store in database field

4. Pagination:
   - Always apply limit
   - Use cursor pagination for large results
```

### Expected Outcome
- Functional name search
- Email search with exact/partial modes
- Employee ID search
- Advanced search with complex criteria
- Search suggestions
- Proper ranking and relevance

### Verification Checklist
- [ ] search_by_name method implemented
- [ ] Partial name matching support
- [ ] Full name support
- [ ] search_by_email method implemented
- [ ] Exact and partial email search
- [ ] search_by_employee_id method
- [ ] advanced_search method
- [ ] Q object building for complex queries
- [ ] suggest method implemented
- [ ] Autocomplete support
- [ ] Ranking logic
- [ ] Performance optimization
- [ ] Method docstrings complete

---

## Task 74: Implement Filter by Department

### Overview
Implement department-based filtering in EmployeeSearchService. This includes filtering employees by single department, multiple departments, department hierarchy, and department-based statistics.

### Dependencies
- Task 73: Implement full-text search
- Department model with hierarchy support
- Department relationships configured

### Instructions

1. **Open search_service.py file**
   - Continue in `apps/employees/services/search_service.py`
   - Locate EmployeeSearchService class

2. **Define filter_by_department method**
   - Method signature: `filter_by_department(self, department_id: int, include_subdepartments: bool = False, filters: dict = None) -> dict`
   - Returns employees in specified department
   - Optionally includes subdepartments
   - Supports additional filters

3. **Implement basic department filter**
   - Query employees by department_id
   - Apply tenant filtering
   - Use select_related for efficiency
   - Include department data in response

4. **Add subdepartment support**
   - If include_subdepartments=True, fetch all child departments
   - Build department hierarchy
   - Include employees from all subdepartments
   - Maintain department reference in results

5. **Add department statistics**
   - Count total employees in department
   - Count by employment status
   - Count by employment type
   - Calculate average tenure
   - Include in response metadata

6. **Define filter_by_multiple_departments method**
   - Method signature: `filter_by_multiple_departments(self, department_ids: list, filters: dict = None) -> dict`
   - Returns employees from multiple departments
   - Useful for cross-department reports

7. **Implement multiple department logic**
   - Use __in lookup for department_ids
   - Group results by department
   - Calculate statistics per department
   - Return aggregated results

8. **Define get_department_headcount method**
   - Method signature: `get_department_headcount(self, department_id: int = None) -> dict`
   - Returns employee count by department
   - If department_id provided, for that department only
   - If None, for all departments

9. **Implement headcount calculation**
   - Count active employees
   - Group by department
   - Include department name
   - Sort by count descending

10. **Add department hierarchy navigation**
    - Create _get_child_departments method
    - Recursively find all subdepartments
    - Return flat list of department IDs
    - Cache for performance

11. **Add manager filter within department**
    - Support filtering by reporting manager
    - Within specific department
    - Show manager's team in department

### Department Filter Flow

```
┌────────────────────────────────────────┐
│    Filter by Department Process        │
└────────────────────────────────────────┘
                │
                ▼
    ┌───────────────────────┐
    │  Validate Department  │
    │  ID                   │
    └───────────┬───────────┘
                │
                ▼
    ┌───────────────────────┐
    │  Check if Include     │
    │  Subdepartments       │
    └───────────┬───────────┘
                │
                ├─── Yes ──► ┌─────────────────────┐
                │            │  Get Subdepartments │
                │            │  (recursive)        │
                │            └──────────┬──────────┘
                │                       │
                ▼                       ▼
    ┌──────────────────────────────────────┐
    │  Build Department List               │
    │  [dept_id] or [dept_id + children]   │
    └───────────┬──────────────────────────┘
                │
                ▼
    ┌───────────────────────┐
    │  Query Employees      │
    │  department_id__in    │
    └───────────┬───────────┘
                │
                ▼
    ┌───────────────────────┐
    │  Apply Additional     │
    │  Filters              │
    └───────────┬───────────┘
                │
                ▼
    ┌───────────────────────┐
    │  Calculate Statistics │
    └───────────┬───────────┘
                │
                ▼
    ┌───────────────────────┐
    │  Return Results       │
    │  + Metadata           │
    └───────────────────────┘
```

### Department Hierarchy Example

```
Organization Structure:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Technology Department (ID: 5)
├── Software Development (ID: 51)
│   ├── Frontend Team (ID: 511)
│   ├── Backend Team (ID: 512)
│   └── Mobile Team (ID: 513)
├── QA & Testing (ID: 52)
└── DevOps (ID: 53)

Filter by Department 5 (include_subdepartments=False):
→ Only direct members of Technology Dept

Filter by Department 5 (include_subdepartments=True):
→ All employees in IDs: 5, 51, 511, 512, 513, 52, 53
```

### Filter by Department Examples

```python
# Basic department filter
service.filter_by_department(department_id=5)
# Returns: Employees directly in department 5

# With subdepartments
service.filter_by_department(
    department_id=5,
    include_subdepartments=True
)
# Returns: Employees in dept 5 and all subdepartments

# With additional filters
service.filter_by_department(
    department_id=5,
    filters={
        'status': 'ACTIVE',
        'employment_type': 'FULL_TIME'
    }
)
# Returns: Active full-time employees in department 5
```

### Department Statistics Response

```python
{
    "department": {
        "id": 5,
        "name": "Technology Department",
        "manager": "Sunil Silva"
    },
    "employees": [
        {
            "id": 123,
            "employee_id": "EMP-2026-0001",
            "first_name": "Kasun",
            "last_name": "Perera",
            "designation": "Senior Developer",
            "status": "ACTIVE"
        },
        # ... more employees
    ],
    "statistics": {
        "total_count": 47,
        "by_status": {
            "ACTIVE": 42,
            "ON_LEAVE": 3,
            "INACTIVE": 2
        },
        "by_employment_type": {
            "FULL_TIME": 40,
            "PART_TIME": 5,
            "CONTRACT": 2
        },
        "average_tenure_days": 782,
        "subdepartments_included": True,
        "subdepartment_count": 5
    },
    "total": 47,
    "limit": 50,
    "offset": 0
}
```

### Multiple Departments Filter

```python
# Filter by multiple departments
service.filter_by_multiple_departments(
    department_ids=[5, 8, 12]  # IT, HR, Finance
)

# Response grouped by department
{
    "results": {
        "5": {
            "department": "Technology Department",
            "count": 47,
            "employees": [...]
        },
        "8": {
            "department": "Human Resources",
            "count": 15,
            "employees": [...]
        },
        "12": {
            "department": "Finance",
            "count": 22,
            "employees": [...]
        }
    },
    "total_count": 84,
    "department_count": 3
}
```

### Department Headcount Report

```python
service.get_department_headcount()

# Response:
{
    "headcount": [
        {
            "department_id": 5,
            "department_name": "Technology",
            "total": 47,
            "active": 42,
            "on_leave": 3,
            "inactive": 2
        },
        {
            "department_id": 8,
            "department_name": "Human Resources",
            "total": 15,
            "active": 14,
            "on_leave": 1,
            "inactive": 0
        },
        # ... more departments
    ],
    "grand_total": 284,
    "active_total": 267
}
```

### Subdepartment Resolution

```python
# Pseudocode

def _get_child_departments(self, department_id: int) -> list:
    """Recursively get all child departments."""
    
    # Check cache first
    cache_key = f"dept_children_{department_id}"
    cached = cache.get(cache_key)
    if cached:
        return cached
    
    # Initialize with parent
    all_departments = [department_id]
    
    # Get immediate children
    children = Department.objects.filter(
        parent_id=department_id
    ).values_list('id', flat=True)
    
    # Recursively get children of children
    for child_id in children:
        all_departments.extend(
            self._get_child_departments(child_id)
        )
    
    # Cache result
    cache.set(cache_key, all_departments, timeout=3600)
    
    return all_departments
```

### Manager Filter within Department

```python
# Get team members under specific manager in department
service.filter_by_department(
    department_id=5,
    filters={
        'manager_id': 123
    }
)

# Returns: Employees reporting to manager 123 in dept 5
```

### Department-Based Queries

| Query | Method | Parameters |
|-------|--------|------------|
| Single department | `filter_by_department` | `department_id` |
| Dept + subdepts | `filter_by_department` | `department_id, include_subdepartments=True` |
| Multiple depts | `filter_by_multiple_departments` | `department_ids` |
| Headcount | `get_department_headcount` | `department_id` (optional) |
| Manager's team | `filter_by_department` | `department_id, filters={'manager_id': X}` |

### Expected Outcome
- Department filtering functionality
- Subdepartment support
- Department statistics
- Multiple department filtering
- Headcount reporting
- Manager-based filtering

### Verification Checklist
- [ ] filter_by_department method implemented
- [ ] Subdepartment inclusion logic
- [ ] Department statistics calculation
- [ ] filter_by_multiple_departments method
- [ ] Grouped results by department
- [ ] get_department_headcount method
- [ ] Headcount calculation
- [ ] _get_child_departments helper
- [ ] Recursive department resolution
- [ ] Department hierarchy caching
- [ ] Manager filter support
- [ ] Method docstrings complete

---

## Task 75: Implement Filter by Status

### Overview
Implement employment status-based filtering in EmployeeSearchService. This includes filtering by single or multiple statuses, status transition tracking, and status-based analytics for workforce management.

### Dependencies
- Task 74: Implement filter by department
- EmploymentStatus model exists
- Status constants defined

### Instructions

1. **Open search_service.py file**
   - Continue in `apps/employees/services/search_service.py`
   - Locate EmployeeSearchService class

2. **Define filter_by_status method**
   - Method signature: `filter_by_status(self, status: str, filters: dict = None) -> dict`
   - Returns employees with specified status
   - Supports additional filters
   - Includes status-specific metadata

3. **Implement status filter logic**
   - Query employees by current status
   - Apply tenant filtering
   - Use select_related for efficiency
   - Include status change history count

4. **Add status validation**
   - Validate status is valid choice
   - Raise error for invalid status
   - Support both constant and display name

5. **Define filter_by_multiple_statuses method**
   - Method signature: `filter_by_multiple_statuses(self, statuses: list, filters: dict = None) -> dict`
   - Returns employees matching any of the statuses
   - Group results by status

6. **Implement multiple status logic**
   - Use __in lookup for statuses
   - Count employees per status
   - Include status distribution
   - Return grouped results

7. **Define get_status_distribution method**
   - Method signature: `get_status_distribution(self, department_id: int = None) -> dict`
   - Returns count of employees by status
   - Optionally filter by department
   - Include percentages

8. **Implement distribution calculation**
   - Count employees per status
   - Calculate percentages
   - Sort by count
   - Include visual indicators

9. **Define get_status_changes method**
   - Method signature: `get_status_changes(self, days: int = 30) -> dict`
   - Returns recent status changes
   - Shows transitions (e.g., ACTIVE → RESIGNED)
   - Useful for trend analysis

10. **Implement status change tracking**
    - Query EmployeeHistory for status changes
    - Filter by date range
    - Group by transition type
    - Count transitions

11. **Add probation filter**
    - Define get_probation_employees method
    - Returns employees currently on probation
    - Shows probation end date approaching
    - Alerts for probation completion

12. **Define get_inactive_employees method**
    - Returns employees with status INACTIVE
    - Shows inactive duration
    - Includes deactivation reason
    - Useful for reactivation review

### Status Filter Flow

```
┌────────────────────────────────────────┐
│      Filter by Status Process          │
└────────────────────────────────────────┘
                │
                ▼
    ┌───────────────────────┐
    │  Validate Status      │
    └───────────┬───────────┘
                │
                ▼
    ┌───────────────────────┐
    │  Query Employees      │
    │  status = X           │
    └───────────┬───────────┘
                │
                ▼
    ┌───────────────────────┐
    │  Apply Additional     │
    │  Filters              │
    └───────────┬───────────┘
                │
                ▼
    ┌───────────────────────┐
    │  Include Status       │
    │  History Count        │
    └───────────┬───────────┘
                │
                ▼
    ┌───────────────────────┐
    │  Calculate Metadata   │
    └───────────┬───────────┘
                │
                ▼
    ┌───────────────────────┐
    │  Return Results       │
    └───────────────────────┘
```

### Filter by Status Examples

```python
# Active employees only
service.filter_by_status(status='ACTIVE')

# On leave employees
service.filter_by_status(status='ON_LEAVE')

# Inactive with reason
service.filter_by_status(
    status='INACTIVE',
    filters={'include_reason': True}
)

# Terminated in last 6 months
service.filter_by_status(
    status='TERMINATED',
    filters={
        'termination_date_from': '2025-07-01'
    }
)
```

### Status Filter Response

```python
{
    "status": "ACTIVE",
    "employees": [
        {
            "id": 123,
            "employee_id": "EMP-2026-0001",
            "first_name": "Kasun",
            "last_name": "Perera",
            "department": "Technology",
            "designation": "Senior Developer",
            "status_since": "2024-01-15",
            "status_changes_count": 2  # Number of status changes
        },
        # ... more employees
    ],
    "statistics": {
        "total_count": 267,
        "average_tenure_days": 845,
        "status_since_avg_days": 456
    },
    "total": 267
}
```

### Multiple Status Filter

```python
# Filter by multiple statuses
service.filter_by_multiple_statuses(
    statuses=['ACTIVE', 'ON_LEAVE']
)

# Response:
{
    "results": {
        "ACTIVE": {
            "count": 267,
            "employees": [...]
        },
        "ON_LEAVE": {
            "count": 18,
            "employees": [...]
        }
    },
    "total_count": 285,
    "status_count": 2
}
```

### Status Distribution Report

```python
service.get_status_distribution()

# Response:
{
    "distribution": [
        {
            "status": "ACTIVE",
            "count": 267,
            "percentage": 89.0,
            "visual": "█████████"
        },
        {
            "status": "ON_LEAVE",
            "count": 18,
            "percentage": 6.0,
            "visual": "█"
        },
        {
            "status": "INACTIVE",
            "count": 8,
            "percentage": 2.7,
            "visual": ""
        },
        {
            "status": "RESIGNED",
            "count": 5,
            "percentage": 1.7,
            "visual": ""
        },
        {
            "status": "TERMINATED",
            "count": 2,
            "percentage": 0.6,
            "visual": ""
        }
    ],
    "total": 300
}

# With department filter
service.get_status_distribution(department_id=5)
# Returns: Distribution for department 5 only
```

### Status Change Tracking

```python
# Get status changes in last 30 days
service.get_status_changes(days=30)

# Response:
{
    "period": {
        "from": "2025-12-25",
        "to": "2026-01-24",
        "days": 30
    },
    "changes": [
        {
            "transition": "ACTIVE → ON_LEAVE",
            "count": 12,
            "employees": [
                {"id": 45, "name": "Nimal Silva", "date": "2026-01-15"},
                {"id": 67, "name": "Kumari Perera", "date": "2026-01-18"},
                # ...
            ]
        },
        {
            "transition": "ON_LEAVE → ACTIVE",
            "count": 10,
            "employees": [...]
        },
        {
            "transition": "ACTIVE → RESIGNED",
            "count": 3,
            "employees": [...]
        },
        {
            "transition": "ACTIVE → TERMINATED",
            "count": 1,
            "employees": [...]
        }
    ],
    "total_changes": 26
}
```

### Probation Employees Report

```python
service.get_probation_employees()

# Response:
{
    "on_probation": [
        {
            "id": 234,
            "employee_id": "EMP-2026-0045",
            "name": "Saman Kumara",
            "hire_date": "2025-08-01",
            "probation_end_date": "2026-02-01",
            "days_remaining": 8,
            "alert_level": "warning"  # < 15 days
        },
        {
            "id": 245,
            "employee_id": "EMP-2026-0056",
            "name": "Dilini Fernando",
            "hire_date": "2025-09-15",
            "probation_end_date": "2026-03-15",
            "days_remaining": 50,
            "alert_level": "info"
        }
    ],
    "completing_soon": [
        # Probation ending in next 15 days
    ],
    "total_on_probation": 12
}
```

### Inactive Employees Report

```python
service.get_inactive_employees()

# Response:
{
    "inactive": [
        {
            "id": 178,
            "employee_id": "EMP-2025-0089",
            "name": "Rohan Jayasinghe",
            "department": "Sales",
            "inactive_since": "2025-11-01",
            "inactive_days": 84,
            "reason": "Disciplinary suspension",
            "alert_level": "warning"  # > 60 days
        },
        {
            "id": 192,
            "employee_id": "EMP-2025-0103",
            "name": "Sanduni Perera",
            "department": "Customer Service",
            "inactive_since": "2026-01-10",
            "inactive_days": 14,
            "reason": "Medical leave expired",
            "alert_level": "info"
        }
    ],
    "long_term_inactive": [
        # Inactive > 90 days
    ],
    "total_inactive": 8
}
```

### Status-Based Analytics

| Metric | Description | Method |
|--------|-------------|--------|
| Active Count | Total active employees | `filter_by_status('ACTIVE')` |
| Turnover Rate | Resignations + Terminations | `get_status_changes()` |
| Leave Rate | % on leave | `get_status_distribution()` |
| Probation Completion | Upcoming probation ends | `get_probation_employees()` |
| Reactivation Candidates | Long-term inactive | `get_inactive_employees()` |

### Status Transition Matrix

```
Valid Transitions:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ACTIVE:
  ├─→ ON_LEAVE (approved leave)
  ├─→ INACTIVE (suspension)
  ├─→ TERMINATED (company action)
  └─→ RESIGNED (employee action)

ON_LEAVE:
  ├─→ ACTIVE (return from leave)
  ├─→ RESIGNED (resign during leave)
  └─→ TERMINATED (terminate during leave)

INACTIVE:
  ├─→ ACTIVE (reactivation)
  └─→ TERMINATED (final action)

TERMINATED:
  └─→ (No transitions - final)

RESIGNED:
  └─→ (No transitions - final)
```

### Alert Levels

| Alert Level | Criteria | Action |
|-------------|----------|--------|
| critical | Probation ending < 7 days | Immediate review required |
| warning | Probation ending < 15 days | Schedule review |
| warning | Inactive > 60 days | Review reactivation |
| critical | Inactive > 90 days | Decide on termination |
| info | On leave > 30 days | Check leave balance |

### Expected Outcome
- Status filtering functionality
- Multiple status support
- Status distribution analytics
- Status change tracking
- Probation monitoring
- Inactive employee reporting

### Verification Checklist
- [ ] filter_by_status method implemented
- [ ] Status validation
- [ ] filter_by_multiple_statuses method
- [ ] Status grouping logic
- [ ] get_status_distribution method
- [ ] Distribution calculation
- [ ] Percentage calculation
- [ ] get_status_changes method
- [ ] Transition tracking
- [ ] get_probation_employees method
- [ ] Probation alerts
- [ ] get_inactive_employees method
- [ ] Inactive duration tracking
- [ ] Alert level calculation
- [ ] Method docstrings complete

---

## Summary

This document established the employee service layer and comprehensive search functionality:

### Completed Infrastructure
- ✅ EmployeeService class with core operations
- ✅ Create employee with validation
- ✅ Update employee with history tracking
- ✅ Status change methods (activate, deactivate, terminate, resign)
- ✅ User account linking and unlinking
- ✅ EmployeeSearchService class
- ✅ Full-text search implementation
- ✅ Department-based filtering
- ✅ Status-based filtering

### Key Achievements
1. **Service Layer** - Clean business logic separation
2. **Employee Operations** - CRUD with validation and history
3. **Status Management** - Complete status workflow
4. **User Integration** - Seamless account linking
5. **Search Functionality** - PostgreSQL full-text search
6. **Advanced Filtering** - Department and status filters
7. **Analytics** - Distribution and trend reports

### Sri Lankan Context Features
- NIC validation (old and new formats)
- Phone number validation (Sri Lankan formats)
- Notice period rules per designation level
- Gratuity and EPF/ETF considerations
- Multi-language support (Sinhala, Tamil, English)

### Next Steps
Proceed to [02_Tasks-76-80_Import-Export-Reporting.md](02_Tasks-76-80_Import-Export-Reporting.md) to implement employee import, export, and reporting functionality.

---

**Document Status:** ✅ Complete  
**Total Tasks:** 9  
**Total Lines:** ~1350
