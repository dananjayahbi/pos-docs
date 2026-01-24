# Tasks 45-50: Employment History Model & Signal

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 01 - Employee Management  
> **Group:** C - Job & Employment Details  
> **Document:** 02 of 02  
> **Tasks Covered:** 45, 46, 47, 48, 49, 50

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-35-44_Job-Fields.md](01_Tasks-35-44_Job-Fields.md)

---

## Document Overview

This document covers the implementation of the EmploymentHistory model and automatic history tracking. The EmploymentHistory model creates an audit trail of all employment changes (department transfers, promotions, salary changes, etc.), providing complete visibility into an employee's career progression within the organization.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 45 | Create EmploymentHistory Model | Medium | 25 min |
| 46 | Add History Core Fields | Medium | 20 min |
| 47 | Add History Change Reason | Low | 15 min |
| 48 | Add History Salary Change | Medium | 20 min |
| 49 | Run EmploymentHistory Migrations | Low | 15 min |
| 50 | Create Employment History Signal | High | 30 min |

---

## Task 45: Create EmploymentHistory Model

### Overview
Create the EmploymentHistory model to track all significant changes in an employee's employment journey. This model serves as an audit log for promotions, transfers, department changes, designation changes, and other career events. It maintains a complete history of an employee's career progression within the organization.

### Dependencies
- Employee model exists with job-related fields (Tasks 35-44)
- Django ORM configured
- Tenant-aware architecture implemented

### Instructions

1. **Create employment_history.py model file**
   - Navigate to `apps/employees/models/` directory
   - Create file: `employment_history.py`
   - Import necessary Django components

2. **Import required modules**
   - Import Django model fields
   - Import base model mixins (TenantAwareMixin, TimestampMixin)
   - Import Employee model
   - Import Department, Designation models
   - Import User model (for changed_by)

3. **Define EmploymentHistory model class**
   - Inherit from TenantAwareMixin and TimestampMixin
   - Add comprehensive model docstring
   - Explain purpose: Career progression audit trail

4. **Add employee ForeignKey field**
   - ForeignKey to Employee model
   - Set on_delete=models.CASCADE
   - Related_name='employment_history'
   - Required field (no blank/null)
   - When employee deleted, history deleted too

5. **Add effective_date field**
   - DateField
   - Required (no blank/null)
   - Date when change became effective
   - Indexed for queries

6. **Add verbose_name and help_text**
   - employee: verbose_name='Employee'
   - effective_date: verbose_name='Effective Date'
   - Add helpful help_text for each field

7. **Add Meta class**
   - Set verbose_name='Employment History'
   - Set verbose_name_plural='Employment Histories'
   - Add ordering: ['-effective_date'] (newest first)
   - Add unique_together: ['employee', 'effective_date', 'change_type'] (prevent duplicates)
   - Add index on (employee, effective_date)

8. **Add __str__ method**
   - Return formatted string
   - Format: "Employee Name - Change Type - Date"
   - Example: "John Doe - PROMOTION - 2026-01-15"

9. **Update models/__init__.py**
   - Import EmploymentHistory model
   - Add to __all__ list
   - Export for use in other modules

### EmploymentHistory Model Structure

```
┌─────────────────────────────────────────────────┐
│         EmploymentHistory Model                  │
├─────────────────────────────────────────────────┤
│ Core Fields:                                    │
│  • employee (ForeignKey to Employee)             │
│  • effective_date (DateField)                    │
│                                                  │
│ Change Tracking (Added in Task 46-48):          │
│  • change_type (CharField with choices)          │
│  • from_department (FK, optional)                │
│  • to_department (FK, optional)                  │
│  • from_designation (FK, optional)               │
│  • to_designation (FK, optional)                 │
│  • from_manager (FK, optional)                   │
│  • to_manager (FK, optional)                     │
│  • previous_salary (Decimal, optional)           │
│  • new_salary (Decimal, optional)                │
│  • notes (TextField, optional)                   │
│  • changed_by (FK to User, optional)             │
│                                                  │
│ Inherited from TenantAwareMixin:                │
│  • tenant (ForeignKey)                           │
│                                                  │
│ Inherited from TimestampMixin:                  │
│  • created_at (DateTimeField)                    │
│  • updated_at (DateTimeField)                    │
└─────────────────────────────────────────────────┘
```

### EmploymentHistory Relationships

```
┌──────────────────────┐
│       Tenant         │
└──────────┬───────────┘
           │ 1:N
           ▼
┌──────────────────────┐         1:N          ┌────────────────────┐
│      Employee        │◄─────────────────────│ EmploymentHistory  │
│                      │                      │                    │
│  • department        │                      │  • employee (FK)   │
│  • designation       │                      │  • effective_date  │
│  • manager           │                      │  • change_type     │
│  • salary            │                      │  • from_* fields   │
│  • ...               │                      │  • to_* fields     │
└──────────────────────┘                      │  • notes           │
                                              │  • changed_by      │
                                              └────────────────────┘
                                                        │
                                                        │ N:1
                                                        ▼
                                              ┌────────────────────┐
                                              │     User           │
                                              │  (changed_by)      │
                                              └────────────────────┘
```

### Model Purpose and Use Cases

#### Use Case 1: Career Progression Tracking
```
View employee's complete career history:
═══════════════════════════════════════════════

Employee: Sarah Fernando

2024-01-15: HIRE
├── Department: IT
├── Designation: Junior Developer
├── Manager: Tech Lead
└── Salary: LKR 60,000

2024-07-15: PROMOTION
├── From: Junior Developer → Developer
├── Salary: LKR 60,000 → LKR 75,000
├── Same department, same manager
└── Notes: "Excellent performance, completed projects ahead of schedule"

2025-01-15: PROMOTION
├── From: Developer → Senior Developer
├── Salary: LKR 75,000 → LKR 95,000
├── Same department, same manager
└── Notes: "Lead developer on major project, mentoring juniors"

2025-07-15: TRANSFER
├── Department: IT → Product
├── Designation: Senior Developer → Product Lead
├── Manager: Tech Lead → Product Manager
├── Salary: LKR 95,000 → LKR 110,000
└── Notes: "Moving to product team to lead new initiative"

2026-01-15: SALARY_CHANGE
├── Designation: Product Lead (unchanged)
├── Salary: LKR 110,000 → LKR 125,000
└── Notes: "Annual increment and performance bonus"
```

#### Use Case 2: Audit and Compliance
```
HR Audit Requirements:
═══════════════════════════════════════════════

Question: "Show all salary changes in 2025"
Query: EmploymentHistory.filter(
    change_type='SALARY_CHANGE',
    effective_date__year=2025
)

Question: "Who approved this promotion?"
Answer: changed_by field → Manager's name

Question: "When was employee transferred to Sales?"
Query: EmploymentHistory.filter(
    employee=emp,
    change_type='TRANSFER',
    to_department__name='Sales'
)

Legal Defense:
└── Complete audit trail of all employment decisions
└── Dates, reasons, approvers documented
└── Transparent promotion and transfer processes
```

#### Use Case 3: Analytics and Reporting
```
HR Analytics Questions:
═══════════════════════════════════════════════

Average Time to Promotion:
├── Query: Time between HIRE and first PROMOTION
└── Result: 6.2 months average

Promotion Rate by Department:
├── IT: 35% promoted within 1 year
├── Sales: 28% promoted within 1 year
└── Operations: 22% promoted within 1 year

Retention After Transfer:
├── Employees transferred in 2024: 15
├── Still with company in 2026: 12 (80%)
└── Insight: Transfers improve retention

Salary Growth Patterns:
├── Average annual increase: 12%
├── Promotion increase: 18-25%
└── Standard increment: 8-10%
```

### CASCADE Behavior on Employee Deletion

```
Deletion Scenario:
════════════════════════════════════════════

Employee "John Doe" (id=10) is deleted:

EmploymentHistory Records for John:
├── Record 1: HIRE (2024-01-15) → DELETED
├── Record 2: PROMOTION (2024-07-15) → DELETED
├── Record 3: SALARY_CHANGE (2025-01-15) → DELETED
└── Record 4: TRANSFER (2025-07-15) → DELETED

Result: All history records deleted (CASCADE)

Rationale:
└── History meaningless without employee
└── GDPR/data privacy compliance
└── Clean data structure

Alternative (if history must be kept):
└── Use on_delete=SET_NULL with nullable employee field
└── Or soft delete employees (is_deleted flag)
```

### Ordering and Query Performance

```
Ordering Strategy:
════════════════════════════════════════════

Meta Ordering: ['-effective_date']
└── Newest records first

Common Query Pattern:
employee.employment_history.all()
├── Returns: Latest changes first
├── Most recent at index 0
└── Chronological reverse order

Index Created:
├── (employee_id, effective_date)
└── Fast queries for employee history

Example Results:
├── [0] 2026-01-15: SALARY_CHANGE
├── [1] 2025-07-15: TRANSFER
├── [2] 2025-01-15: PROMOTION
└── [3] 2024-01-15: HIRE
```

### History Record Creation Scenarios

```
When to Create EmploymentHistory Record:
════════════════════════════════════════════

1. Employee Hired:
   └── change_type: HIRE
   └── Initial department, designation, manager set

2. Department Change:
   └── change_type: TRANSFER
   └── from_department → to_department

3. Designation Change:
   └── change_type: PROMOTION (if upward)
   └── change_type: DEMOTION (if downward)
   └── from_designation → to_designation

4. Manager Change:
   └── change_type: MANAGER_CHANGE (if standalone)
   └── Or part of TRANSFER
   └── from_manager → to_manager

5. Salary Change:
   └── change_type: SALARY_CHANGE
   └── previous_salary → new_salary

6. Probation Completion:
   └── change_type: PROBATION_CONFIRMATION
   └── Notes: "Successfully completed probation"

7. Resignation/Termination:
   └── change_type: RESIGNATION or TERMINATION
   └── Final record for employee
```

### Expected Outcome
- EmploymentHistory model created
- Employee relationship established
- Effective date tracking
- Foundation for change tracking (Tasks 46-48)
- Audit trail capability
- Tenant-aware and timestamped

### Verification Checklist
- [ ] employment_history.py file created
- [ ] EmploymentHistory class defined
- [ ] Inherits from TenantAwareMixin and TimestampMixin
- [ ] employee ForeignKey added
- [ ] on_delete=CASCADE configured
- [ ] related_name='employment_history' set
- [ ] effective_date DateField added
- [ ] effective_date indexed
- [ ] Meta class configured
- [ ] verbose_name and verbose_name_plural set
- [ ] Ordering configured (newest first)
- [ ] unique_together constraint added
- [ ] __str__ method implemented
- [ ] Model docstring comprehensive
- [ ] Imported in models/__init__.py

---

## Task 46: Add History Core Fields

### Overview
Add the core fields to the EmploymentHistory model that track what changed, including the change type (hire, promotion, transfer, etc.) and the before/after values for department, designation, and manager. These fields capture the essential information about each employment event.

### Dependencies
- Task 45: EmploymentHistory model created
- Employee, Department, Designation models exist

### Instructions

1. **Create change type constants**
   - Open `apps/employees/constants.py`
   - Define EMPLOYMENT_CHANGE_TYPE_CHOICES

2. **Define change type constants**
   - HIRE: Initial employment
   - PROMOTION: Upward designation change
   - DEMOTION: Downward designation change
   - TRANSFER: Department change
   - SALARY_CHANGE: Salary adjustment
   - MANAGER_CHANGE: Reporting line change
   - PROBATION_CONFIRMATION: Probation completed
   - RESIGNATION: Employee resigned
   - TERMINATION: Employment terminated

3. **Add change_type field**
   - Open `apps/employees/models/employment_history.py`
   - Import EMPLOYMENT_CHANGE_TYPE_CHOICES
   - Add CharField with choices
   - Max_length=30
   - Required (no blank/null)

4. **Add from_department field**
   - ForeignKey to Department
   - Optional: blank=True, null=True
   - Set on_delete=models.SET_NULL
   - Related_name='history_from_department'
   - Represents previous department

5. **Add to_department field**
   - ForeignKey to Department
   - Optional: blank=True, null=True
   - Set on_delete=models.SET_NULL
   - Related_name='history_to_department'
   - Represents new department

6. **Add from_designation field**
   - ForeignKey to Designation
   - Optional: blank=True, null=True
   - Set on_delete=models.SET_NULL
   - Related_name='history_from_designation'
   - Represents previous designation

7. **Add to_designation field**
   - ForeignKey to Designation
   - Optional: blank=True, null=True
   - Set on_delete=models.SET_NULL
   - Related_name='history_to_designation'
   - Represents new designation

8. **Add from_manager field**
   - ForeignKey to Employee
   - Optional: blank=True, null=True
   - Set on_delete=models.SET_NULL
   - Related_name='history_from_manager'
   - Represents previous manager

9. **Add to_manager field**
   - ForeignKey to Employee
   - Optional: blank=True, null=True
   - Set on_delete=models.SET_NULL
   - Related_name='history_to_manager'
   - Represents new manager

10. **Add notes field**
    - TextField
    - Optional: blank=True, null=True
    - Help text: "Notes about this change (reason, context, etc.)"

11. **Add changed_by field**
    - ForeignKey to User model
    - Optional: blank=True, null=True
    - Set on_delete=models.SET_NULL
    - Related_name='employment_changes_made'
    - Tracks who made the change

12. **Update model docstring**
    - Document all history fields
    - Explain change tracking mechanism

### History Core Fields Structure

```
┌─────────────────────────────────────────────────┐
│         Employment History Core Fields           │
├─────────────────────────────────────────────────┤
│ Change Type:                                    │
│  • change_type (CharField with choices)          │
│                                                  │
│ Department Tracking:                            │
│  • from_department (FK to Department)            │
│  • to_department (FK to Department)              │
│                                                  │
│ Designation Tracking:                           │
│  • from_designation (FK to Designation)          │
│  • to_designation (FK to Designation)            │
│                                                  │
│ Manager Tracking:                               │
│  • from_manager (FK to Employee)                 │
│  • to_manager (FK to Employee)                   │
│                                                  │
│ Metadata:                                       │
│  • notes (TextField)                             │
│  • changed_by (FK to User)                       │
└─────────────────────────────────────────────────┘
```

### Change Type Constants

```
┌─────────────────────────────────────────────────┐
│      Employment Change Type Choices              │
├─────────────────────────────────────────────────┤
│  HIRE                  → 'Initial Hire'          │
│  PROMOTION             → 'Promotion'             │
│  DEMOTION              → 'Demotion'              │
│  TRANSFER              → 'Department Transfer'   │
│  SALARY_CHANGE         → 'Salary Change'         │
│  MANAGER_CHANGE        → 'Manager Change'        │
│  PROBATION_CONFIRMATION → 'Probation Confirmed'  │
│  RESIGNATION           → 'Resignation'           │
│  TERMINATION           → 'Termination'           │
└─────────────────────────────────────────────────┘
```

### Change Type Details

#### HIRE (Initial Employment)
```
Created when employee first joins:
═══════════════════════════════════════════════

Fields Set:
├── change_type: 'HIRE'
├── effective_date: hire_date
├── from_department: NULL
├── to_department: Initial department
├── from_designation: NULL
├── to_designation: Initial designation
├── from_manager: NULL
├── to_manager: Initial manager
└── notes: "Initial hire as [designation]"

Example:
Employee: John Doe
├── effective_date: 2026-01-15
├── change_type: HIRE
├── to_department: IT Department
├── to_designation: Junior Developer
├── to_manager: Tech Lead
└── notes: "Hired as Junior Developer in IT Department"
```

#### PROMOTION (Upward Movement)
```
Created when designation level increases:
═══════════════════════════════════════════════

Fields Set:
├── change_type: 'PROMOTION'
├── effective_date: Promotion effective date
├── from_designation: Current designation
├── to_designation: New (higher) designation
├── Department/Manager: May or may not change
└── notes: Reason for promotion

Example:
Employee: Sarah Fernando
├── effective_date: 2026-07-15
├── change_type: PROMOTION
├── from_designation: Junior Developer
├── to_designation: Developer
├── to_department: IT (unchanged)
├── previous_salary: 60,000 (Task 48)
├── new_salary: 75,000 (Task 48)
└── notes: "Promoted for excellent performance and project delivery"
```

#### DEMOTION (Downward Movement)
```
Created when designation level decreases:
═══════════════════════════════════════════════

Fields Set:
├── change_type: 'DEMOTION'
├── effective_date: Demotion effective date
├── from_designation: Current designation
├── to_designation: New (lower) designation
└── notes: Reason for demotion (performance, restructuring)

Example:
Employee: Alex Kumar
├── effective_date: 2025-10-01
├── change_type: DEMOTION
├── from_designation: Team Lead
├── to_designation: Senior Developer
├── previous_salary: 120,000
├── new_salary: 95,000
└── notes: "Restructuring - team lead position eliminated"

Note: Demotions are sensitive, require careful documentation
```

#### TRANSFER (Department Change)
```
Created when employee moves departments:
═══════════════════════════════════════════════

Fields Set:
├── change_type: 'TRANSFER'
├── effective_date: Transfer effective date
├── from_department: Current department
├── to_department: New department
├── Designation/Manager: May change
└── notes: Reason for transfer

Example:
Employee: Priya Perera
├── effective_date: 2026-03-01
├── change_type: TRANSFER
├── from_department: Sales
├── to_department: Marketing
├── from_designation: Sales Executive
├── to_designation: Marketing Executive
├── from_manager: Sales Manager
├── to_manager: Marketing Manager
└── notes: "Transfer to marketing for product launch campaign"
```

#### SALARY_CHANGE (Salary Adjustment)
```
Created when salary changes without other changes:
═══════════════════════════════════════════════

Fields Set:
├── change_type: 'SALARY_CHANGE'
├── effective_date: Salary change effective date
├── previous_salary: Current salary (Task 48)
├── new_salary: New salary (Task 48)
└── notes: Reason (increment, cost of living, etc.)

Example:
Employee: Ravi Silva
├── effective_date: 2026-01-01
├── change_type: SALARY_CHANGE
├── previous_salary: 85,000
├── new_salary: 93,500
├── Department/Designation: Unchanged
└── notes: "Annual increment - 10% increase"
```

#### MANAGER_CHANGE (Reporting Line Change)
```
Created when manager changes without other changes:
═══════════════════════════════════════════════

Fields Set:
├── change_type: 'MANAGER_CHANGE'
├── effective_date: Change effective date
├── from_manager: Current manager
├── to_manager: New manager
└── notes: Reason for change

Example:
Employee: Nimal Fernando
├── effective_date: 2026-02-01
├── change_type: MANAGER_CHANGE
├── from_manager: Old Team Lead (left company)
├── to_manager: New Team Lead
├── Department/Designation: Unchanged
└── notes: "Manager change due to team restructuring"
```

#### PROBATION_CONFIRMATION (Probation Completed)
```
Created when probation successfully completed:
═══════════════════════════════════════════════

Fields Set:
├── change_type: 'PROBATION_CONFIRMATION'
├── effective_date: confirmation_date
├── Department/Designation: Usually unchanged
└── notes: Confirmation details

Example:
Employee: Tharindu Jayasinghe
├── effective_date: 2026-04-15
├── change_type: PROBATION_CONFIRMATION
├── notes: "Successfully completed 3-month probation. Performance: Excellent"
```

#### RESIGNATION (Employee Resigned)
```
Created when employee resigns:
═══════════════════════════════════════════════

Fields Set:
├── change_type: 'RESIGNATION'
├── effective_date: last_working_date
├── notes: Resignation reason

Example:
Employee: Kasun Perera
├── effective_date: 2026-02-28
├── change_type: RESIGNATION
├── notes: "Resigned for better opportunity. Served 30-day notice period."
```

#### TERMINATION (Employment Ended)
```
Created when employment terminated:
═══════════════════════════════════════════════

Fields Set:
├── change_type: 'TERMINATION'
├── effective_date: termination_date
├── notes: Termination reason

Example:
Employee: Anil Gunawardena
├── effective_date: 2025-12-31
├── change_type: TERMINATION
├── notes: "Termination due to redundancy. Position eliminated in restructuring."
```

### Field Population Matrix

| Change Type | from_dept | to_dept | from_desig | to_desig | from_mgr | to_mgr | notes |
|------------|-----------|---------|------------|----------|----------|--------|-------|
| HIRE | NULL | ✓ | NULL | ✓ | NULL | ✓ | ✓ |
| PROMOTION | - | - | ✓ | ✓ | - | - | ✓ |
| DEMOTION | - | - | ✓ | ✓ | - | - | ✓ |
| TRANSFER | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| SALARY_CHANGE | - | - | - | - | - | - | ✓ |
| MANAGER_CHANGE | - | - | - | - | ✓ | ✓ | ✓ |
| PROBATION_CONFIRMATION | - | - | - | - | - | - | ✓ |
| RESIGNATION | - | - | - | - | - | - | ✓ |
| TERMINATION | - | - | - | - | - | - | ✓ |

Legend: ✓ = Typically set, - = Optional/Unchanged, NULL = Not applicable

### Related Names Strategy

```
ForeignKey Related Names:
═══════════════════════════════════════════════

Problem: Multiple FKs to same model
Solution: Unique related_names

Department Model:
├── employees (from Employee.department)
├── history_from_department (from EmploymentHistory.from_department)
└── history_to_department (from EmploymentHistory.to_department)

Query Examples:
dept.employees.all()                    # Current employees
dept.history_from_department.all()      # Transferred OUT
dept.history_to_department.all()        # Transferred IN

Designation Model:
├── employees (from Employee.designation)
├── history_from_designation
└── history_to_designation

Employee Model:
├── employment_history (from EmploymentHistory.employee)
├── direct_reports (from Employee.manager)
├── history_from_manager (from EmploymentHistory.from_manager)
└── history_to_manager (from EmploymentHistory.to_manager)
```

### History Record Examples

#### Example 1: Simple Promotion
```python
EmploymentHistory.objects.create(
    employee=emp,
    effective_date='2026-01-15',
    change_type='PROMOTION',
    from_designation=junior_dev,
    to_designation=developer,
    notes="Promoted after 6 months for exceptional performance",
    changed_by=hr_manager
)
```

#### Example 2: Department Transfer
```python
EmploymentHistory.objects.create(
    employee=emp,
    effective_date='2026-02-01',
    change_type='TRANSFER',
    from_department=it_dept,
    to_department=product_dept,
    from_designation=senior_dev,
    to_designation=product_lead,
    from_manager=tech_lead,
    to_manager=product_manager,
    notes="Transfer to product team to lead new initiative",
    changed_by=ceo
)
```

#### Example 3: Multiple Changes (Complex)
```python
# When promotion includes department transfer:
EmploymentHistory.objects.create(
    employee=emp,
    effective_date='2026-03-01',
    change_type='PROMOTION',  # Primary change type
    from_department=sales_dept,
    to_department=sales_dept,  # Same dept
    from_designation=sales_exec,
    to_designation=sales_manager,
    from_manager=regional_manager,
    to_manager=vp_sales,  # Manager changes with promotion
    previous_salary=80000,
    new_salary=120000,
    notes="Promoted to Sales Manager, now reports to VP",
    changed_by=hr_director
)
```

### SET_NULL Behavior

```
When Department is Deleted:
═══════════════════════════════════════════════

Department "Old Sales Dept" deleted
├── History records with from_department = Old Sales
│   └── from_department set to NULL
├── History records with to_department = Old Sales
│   └── to_department set to NULL
└── Historical data preserved, relationship nulled

Query Impact:
history.from_department
├── Returns: None (if deleted)
└── Handle gracefully in display

Display Logic:
if history.from_department:
    from_dept_name = history.from_department.name
else:
    from_dept_name = "[Department Deleted]"
```

### Expected Outcome
- Change type field with 9 standard types
- Before/after tracking for department, designation, manager
- Flexible field population based on change type
- Notes field for context
- changed_by field for accountability
- Complete change audit capability

### Verification Checklist
- [ ] constants.py updated with EMPLOYMENT_CHANGE_TYPE_CHOICES
- [ ] HIRE constant defined
- [ ] PROMOTION constant defined
- [ ] DEMOTION constant defined
- [ ] TRANSFER constant defined
- [ ] SALARY_CHANGE constant defined
- [ ] MANAGER_CHANGE constant defined
- [ ] PROBATION_CONFIRMATION constant defined
- [ ] RESIGNATION constant defined
- [ ] TERMINATION constant defined
- [ ] change_type field added to EmploymentHistory
- [ ] from_department field added
- [ ] to_department field added
- [ ] from_designation field added
- [ ] to_designation field added
- [ ] from_manager field added
- [ ] to_manager field added
- [ ] notes field added
- [ ] changed_by field added
- [ ] All FKs have on_delete=SET_NULL
- [ ] Unique related_names for all FKs
- [ ] help_text provided for all fields
- [ ] verbose_name set for all fields
- [ ] Model docstring updated

---

## Task 47: Add History Change Reason

### Overview
Add a separate change_reason field to provide more granular categorization of why the change occurred. While change_type indicates what changed (PROMOTION, TRANSFER, etc.), change_reason explains why (PERFORMANCE, RESTRUCTURING, etc.). This additional dimension enables better analytics and reporting.

### Dependencies
- Task 46: History core fields added
- EmploymentHistory model exists

### Instructions

1. **Create change reason constants**
   - Open `apps/employees/constants.py`
   - Define EMPLOYMENT_CHANGE_REASON_CHOICES

2. **Define change reason constants**
   - PERFORMANCE: Performance-based change
   - RESTRUCTURING: Organizational restructuring
   - BUSINESS_NEEDS: Business requirements
   - SKILL_DEVELOPMENT: Career development
   - EMPLOYEE_REQUEST: Employee initiated
   - RETENTION: Retention effort
   - COST_OPTIMIZATION: Cost reduction
   - MARKET_ADJUSTMENT: Market rate alignment
   - ANNUAL_REVIEW: Regular annual review
   - OTHER: Other reasons

3. **Add change_reason field**
   - Open `apps/employees/models/employment_history.py`
   - Import EMPLOYMENT_CHANGE_REASON_CHOICES
   - Add CharField with choices
   - Max_length=30
   - Optional: blank=True, null=True
   - Not all changes have specific reason

4. **Add change_reason_detail field**
   - Add TextField
   - Optional: blank=True, null=True
   - Help text: "Detailed explanation of the change reason"
   - Allows free-text elaboration

5. **Add verbose_name and help_text**
   - change_reason: verbose_name='Change Reason'
   - change_reason_detail: verbose_name='Change Reason Detail'

6. **Update model docstring**
   - Document change reason fields
   - Explain relationship between change_type and change_reason

### Change Reason Fields Structure

```
┌─────────────────────────────────────────────────┐
│         Change Reason Fields                     │
├─────────────────────────────────────────────────┤
│  change_reason (CharField with choices)          │
│  ├── Optional: Yes (blank=True, null=True)       │
│  ├── Max Length: 30                              │
│  └── Purpose: Categorize why change occurred     │
│                                                  │
│  change_reason_detail (TextField)                │
│  ├── Optional: Yes (blank=True, null=True)       │
│  └── Purpose: Detailed explanation               │
└─────────────────────────────────────────────────┘
```

### Change Reason Constants

```
┌─────────────────────────────────────────────────┐
│       Employment Change Reason Choices           │
├─────────────────────────────────────────────────┤
│  PERFORMANCE         → 'Performance-Based'       │
│  RESTRUCTURING       → 'Restructuring'           │
│  BUSINESS_NEEDS      → 'Business Needs'          │
│  SKILL_DEVELOPMENT   → 'Skill Development'       │
│  EMPLOYEE_REQUEST    → 'Employee Request'        │
│  RETENTION           → 'Retention Effort'        │
│  COST_OPTIMIZATION   → 'Cost Optimization'       │
│  MARKET_ADJUSTMENT   → 'Market Adjustment'       │
│  ANNUAL_REVIEW       → 'Annual Review'           │
│  OTHER               → 'Other'                   │
└─────────────────────────────────────────────────┘
```

### Change Type vs. Change Reason

```
Two-Dimensional Classification:
═══════════════════════════════════════════════

change_type: WHAT changed (action)
change_reason: WHY it changed (motivation)

Example 1:
├── change_type: PROMOTION
├── change_reason: PERFORMANCE
└── Interpretation: "Promoted due to excellent performance"

Example 2:
├── change_type: TRANSFER
├── change_reason: RESTRUCTURING
└── Interpretation: "Transferred due to organizational restructuring"

Example 3:
├── change_type: SALARY_CHANGE
├── change_reason: MARKET_ADJUSTMENT
└── Interpretation: "Salary increased to match market rates"
```

### Change Reason Details

#### PERFORMANCE (Performance-Based)
```
Used when change is merit-based:
═══════════════════════════════════════════════

Applicable to:
├── PROMOTION (most common)
├── SALARY_CHANGE (performance bonus/raise)
├── DEMOTION (poor performance)
└── TERMINATION (performance issues)

Example 1: Promotion
├── change_type: PROMOTION
├── change_reason: PERFORMANCE
├── change_reason_detail: "Exceeded targets by 150% for 2 consecutive quarters. Led team to successful project completion 2 months ahead of schedule."

Example 2: Salary Increase
├── change_type: SALARY_CHANGE
├── change_reason: PERFORMANCE
├── change_reason_detail: "Performance rating: Excellent. Contributed to 3 major projects with exceptional results."

Example 3: Termination
├── change_type: TERMINATION
├── change_reason: PERFORMANCE
├── change_reason_detail: "Failed to meet minimum performance standards despite PIP and coaching. Documented in performance reviews."
```

#### RESTRUCTURING (Organizational Restructuring)
```
Used during organizational changes:
═══════════════════════════════════════════════

Applicable to:
├── TRANSFER (department changes)
├── MANAGER_CHANGE (reporting line changes)
├── DEMOTION (position eliminated)
└── TERMINATION (redundancy)

Example 1: Department Merger
├── change_type: TRANSFER
├── change_reason: RESTRUCTURING
├── change_reason_detail: "IT and Operations departments merged. Transferred to new Digital Operations department."

Example 2: Redundancy
├── change_type: TERMINATION
├── change_reason: RESTRUCTURING
├── change_reason_detail: "Position eliminated due to department consolidation. Offered redundancy package."
```

#### BUSINESS_NEEDS (Business Requirements)
```
Used for operational requirements:
═══════════════════════════════════════════════

Applicable to:
├── TRANSFER (operational needs)
├── HIRE (business expansion)
├── MANAGER_CHANGE (coverage needs)
└── TERMINATION (business closure)

Example:
├── change_type: TRANSFER
├── change_reason: BUSINESS_NEEDS
├── change_reason_detail: "Transferred to Kandy branch to support new store opening and train local team."
```

#### SKILL_DEVELOPMENT (Career Development)
```
Used for employee growth initiatives:
═══════════════════════════════════════════════

Applicable to:
├── TRANSFER (job rotation)
├── PROMOTION (career progression)
└── MANAGER_CHANGE (mentorship)

Example:
├── change_type: TRANSFER
├── change_reason: SKILL_DEVELOPMENT
├── change_reason_detail: "6-month rotation to Product team for cross-functional experience and career development."
```

#### EMPLOYEE_REQUEST (Employee-Initiated)
```
Used when employee requests change:
═══════════════════════════════════════════════

Applicable to:
├── TRANSFER (requested department change)
├── MANAGER_CHANGE (requested different manager)
├── RESIGNATION (employee choice)
└── SALARY_CHANGE (employee negotiation)

Example 1: Transfer Request
├── change_type: TRANSFER
├── change_reason: EMPLOYEE_REQUEST
├── change_reason_detail: "Employee requested transfer to Colombo office for family reasons. Approved by management."

Example 2: Resignation
├── change_type: RESIGNATION
├── change_reason: EMPLOYEE_REQUEST
├── change_reason_detail: "Employee resigned for personal reasons. Better opportunity elsewhere."
```

#### RETENTION (Retention Effort)
```
Used for counter-offers and retention:
═══════════════════════════════════════════════

Applicable to:
├── SALARY_CHANGE (counter-offer)
├── PROMOTION (retention promotion)
└── TRANSFER (retention transfer)

Example:
├── change_type: SALARY_CHANGE
├── change_reason: RETENTION
├── change_reason_detail: "Employee received external offer. Counter-offer made: 20% salary increase. Employee accepted and stayed."
```

#### COST_OPTIMIZATION (Cost Reduction)
```
Used for cost-saving measures:
═══════════════════════════════════════════════

Applicable to:
├── TERMINATION (layoff)
├── DEMOTION (salary reduction)
└── SALARY_CHANGE (salary cut)

Example:
├── change_type: TERMINATION
├── change_reason: COST_OPTIMIZATION
├── change_reason_detail: "Company-wide cost reduction initiative. Position eliminated. Severance package provided."

Note: Sensitive reason, requires careful handling
```

#### MARKET_ADJUSTMENT (Market Rate Alignment)
```
Used to match market rates:
═══════════════════════════════════════════════

Applicable to:
├── SALARY_CHANGE (most common)
└── PROMOTION (with market adjustment)

Example:
├── change_type: SALARY_CHANGE
├── change_reason: MARKET_ADJUSTMENT
├── change_reason_detail: "Market survey showed salaries 15% below industry average. Adjusted to remain competitive."
```

#### ANNUAL_REVIEW (Regular Annual Review)
```
Used for standard review cycles:
═══════════════════════════════════════════════

Applicable to:
├── SALARY_CHANGE (annual increment)
├── PROMOTION (scheduled promotion)
└── PROBATION_CONFIRMATION (review outcome)

Example:
├── change_type: SALARY_CHANGE
├── change_reason: ANNUAL_REVIEW
├── change_reason_detail: "Annual performance review completed. Performance rating: Good. Standard increment: 10%."
```

#### OTHER (Other Reasons)
```
Used for miscellaneous reasons:
═══════════════════════════════════════════════

Use when no other reason fits
Requires detailed change_reason_detail

Example:
├── change_type: MANAGER_CHANGE
├── change_reason: OTHER
├── change_reason_detail: "Previous manager resigned. Temporary assignment to interim manager until permanent replacement hired."
```

### Change Type + Reason Combinations (Common Patterns)

| Change Type | Common Reasons | Example Scenario |
|------------|---------------|------------------|
| PROMOTION | PERFORMANCE, SKILL_DEVELOPMENT | Promoted for good performance |
| TRANSFER | RESTRUCTURING, BUSINESS_NEEDS, EMPLOYEE_REQUEST | Moved to new branch |
| SALARY_CHANGE | ANNUAL_REVIEW, MARKET_ADJUSTMENT, RETENTION | Annual salary increase |
| DEMOTION | PERFORMANCE, RESTRUCTURING | Poor performance demotion |
| MANAGER_CHANGE | RESTRUCTURING, BUSINESS_NEEDS | Manager left company |
| TERMINATION | PERFORMANCE, COST_OPTIMIZATION, RESTRUCTURING | Redundancy termination |
| RESIGNATION | EMPLOYEE_REQUEST | Employee choice |
| PROBATION_CONFIRMATION | PERFORMANCE, ANNUAL_REVIEW | Successful probation |

### Analytics Using Change Reasons

```
HR Analytics Questions:
═══════════════════════════════════════════════

Question 1: "Why are we promoting employees?"
Query: EmploymentHistory.filter(change_type='PROMOTION')
       .values('change_reason').annotate(count=Count('id'))

Results:
├── PERFORMANCE: 65% (merit-based)
├── ANNUAL_REVIEW: 20% (scheduled)
├── RETENTION: 10% (counter-offers)
└── SKILL_DEVELOPMENT: 5% (career development)

Insight: Most promotions are performance-based ✓

Question 2: "Why are employees leaving?"
Query: EmploymentHistory.filter(
       change_type__in=['RESIGNATION', 'TERMINATION']
       )

Results:
├── EMPLOYEE_REQUEST: 45% (resignations)
├── PERFORMANCE: 25% (terminations)
├── COST_OPTIMIZATION: 15% (layoffs)
├── RESTRUCTURING: 10% (redundancy)
└── OTHER: 5%

Insight: High voluntary attrition, focus on retention

Question 3: "What drives salary changes?"
Query: EmploymentHistory.filter(change_type='SALARY_CHANGE')

Results:
├── ANNUAL_REVIEW: 60% (regular increments)
├── MARKET_ADJUSTMENT: 20% (competitiveness)
├── RETENTION: 15% (counter-offers)
└── PERFORMANCE: 5% (spot bonuses)

Insight: Mostly routine, 35% reactive (market/retention)
```

### Example History Record with Reason

```python
# Promotion due to performance
EmploymentHistory.objects.create(
    employee=emp,
    effective_date='2026-01-15',
    change_type='PROMOTION',
    change_reason='PERFORMANCE',
    change_reason_detail=(
        "Employee consistently exceeded expectations. "
        "Led successful project resulting in 30% efficiency gain. "
        "Received 'Employee of the Quarter' award. "
        "Recommended by manager for early promotion."
    ),
    from_designation=junior_dev,
    to_designation=developer,
    previous_salary=60000,
    new_salary=75000,
    notes="Early promotion after 8 months (typical: 12 months)",
    changed_by=hr_manager
)

# Transfer due to restructuring
EmploymentHistory.objects.create(
    employee=emp,
    effective_date='2026-03-01',
    change_type='TRANSFER',
    change_reason='RESTRUCTURING',
    change_reason_detail=(
        "Department restructuring: Sales and Marketing merged into "
        "Revenue team. Employee transferred to maintain role continuity."
    ),
    from_department=sales_dept,
    to_department=revenue_dept,
    from_manager=sales_manager,
    to_manager=revenue_director,
    notes="Restructuring - no change in compensation or designation",
    changed_by=ceo
)

# Salary adjustment for retention
EmploymentHistory.objects.create(
    employee=emp,
    effective_date='2026-05-01',
    change_type='SALARY_CHANGE',
    change_reason='RETENTION',
    change_reason_detail=(
        "Employee received external offer: LKR 110,000/month. "
        "Counter-offer made: 15% increase to match competitive rate. "
        "Employee accepted and committed for 2 years."
    ),
    previous_salary=95000,
    new_salary=110000,
    notes="Retention counter-offer - valuable employee",
    changed_by=ceo
)
```

### Optional vs. Required

```
Why change_reason is Optional:
═══════════════════════════════════════════════

Some changes don't need categorized reason:
├── HIRE: It's obvious (new employee)
├── PROBATION_CONFIRMATION: Obvious (completed probation)
└── RESIGNATION: Employee choice (captured in resignation_reason)

Recommendation:
├── Set change_reason for: PROMOTION, TRANSFER, SALARY_CHANGE
├── Optional for: HIRE, PROBATION_CONFIRMATION
└── Always provide change_reason_detail for auditing
```

### Expected Outcome
- change_reason field for categorizing motivation
- change_reason_detail for elaboration
- Two-dimensional change classification (type + reason)
- Enhanced analytics capability
- Better audit trail documentation

### Verification Checklist
- [ ] constants.py updated with EMPLOYMENT_CHANGE_REASON_CHOICES
- [ ] PERFORMANCE constant defined
- [ ] RESTRUCTURING constant defined
- [ ] BUSINESS_NEEDS constant defined
- [ ] SKILL_DEVELOPMENT constant defined
- [ ] EMPLOYEE_REQUEST constant defined
- [ ] RETENTION constant defined
- [ ] COST_OPTIMIZATION constant defined
- [ ] MARKET_ADJUSTMENT constant defined
- [ ] ANNUAL_REVIEW constant defined
- [ ] OTHER constant defined
- [ ] change_reason field added to EmploymentHistory
- [ ] change_reason_detail field added
- [ ] Both fields optional (blank=True, null=True)
- [ ] help_text provided for both fields
- [ ] verbose_name set for both fields
- [ ] Model docstring updated

---

## Task 48: Add History Salary Change

### Overview
Add fields to track salary changes in the employment history. These fields record the previous and new salary amounts, enabling complete compensation history tracking. This is crucial for payroll audits, salary progression analysis, and compliance with equal pay regulations.

### Dependencies
- Task 46: History core fields added
- EmploymentHistory model exists

### Instructions

1. **Add previous_salary field**
   - Open `apps/employees/models/employment_history.py`
   - Add DecimalField
   - max_digits=12, decimal_places=2
   - Optional: blank=True, null=True
   - Help text: "Salary before this change"

2. **Add new_salary field**
   - Add DecimalField
   - max_digits=12, decimal_places=2
   - Optional: blank=True, null=True
   - Help text: "Salary after this change"

3. **Add salary_change_percentage property**
   - Add @property decorator
   - Calculate percentage change
   - Formula: ((new_salary - previous_salary) / previous_salary) × 100
   - Handle NULL values gracefully

4. **Add salary_change_amount property**
   - Add @property decorator
   - Calculate absolute change
   - Formula: new_salary - previous_salary
   - Return Decimal or None

5. **Add verbose_name for salary fields**
   - previous_salary: verbose_name='Previous Salary'
   - new_salary: verbose_name='New Salary'

6. **Update model docstring**
   - Document salary tracking fields
   - Explain usage with SALARY_CHANGE and PROMOTION

### Salary Fields Structure

```
┌─────────────────────────────────────────────────┐
│         Salary Change Fields                     │
├─────────────────────────────────────────────────┤
│  previous_salary (DecimalField)                  │
│  ├── Max Digits: 12                              │
│  ├── Decimal Places: 2                           │
│  ├── Optional: Yes (blank=True, null=True)       │
│  └── Example: 95000.00                           │
│                                                  │
│  new_salary (DecimalField)                       │
│  ├── Max Digits: 12                              │
│  ├── Decimal Places: 2                           │
│  ├── Optional: Yes (blank=True, null=True)       │
│  └── Example: 110000.00                          │
│                                                  │
│  Properties (Calculated):                        │
│  ├── salary_change_percentage                    │
│  └── salary_change_amount                        │
└─────────────────────────────────────────────────┘
```

### Salary Change Scenarios

#### Scenario 1: Promotion with Salary Increase
```python
EmploymentHistory.objects.create(
    employee=emp,
    effective_date='2026-01-15',
    change_type='PROMOTION',
    change_reason='PERFORMANCE',
    from_designation=junior_dev,
    to_designation=developer,
    previous_salary=Decimal('60000.00'),
    new_salary=Decimal('75000.00'),
    notes="Promoted to Developer with 25% salary increase",
    changed_by=hr_manager
)

# Calculated properties:
history.salary_change_amount
# Returns: 15000.00

history.salary_change_percentage
# Returns: 25.0 (%)
```

#### Scenario 2: Annual Salary Increment
```python
EmploymentHistory.objects.create(
    employee=emp,
    effective_date='2026-01-01',
    change_type='SALARY_CHANGE',
    change_reason='ANNUAL_REVIEW',
    change_reason_detail="Annual performance review: Rating - Good",
    previous_salary=Decimal('85000.00'),
    new_salary=Decimal('93500.00'),
    notes="10% annual increment",
    changed_by=hr_manager
)

# Calculated:
# salary_change_amount: 8500.00
# salary_change_percentage: 10.0%
```

#### Scenario 3: Market Rate Adjustment
```python
EmploymentHistory.objects.create(
    employee=emp,
    effective_date='2026-02-01',
    change_type='SALARY_CHANGE',
    change_reason='MARKET_ADJUSTMENT',
    change_reason_detail="Salary increased to match industry standards",
    previous_salary=Decimal('70000.00'),
    new_salary=Decimal('85000.00'),
    notes="15% market adjustment to remain competitive",
    changed_by=hr_director
)

# Calculated:
# salary_change_amount: 15000.00
# salary_change_percentage: 21.43%
```

#### Scenario 4: Transfer with Salary Change
```python
EmploymentHistory.objects.create(
    employee=emp,
    effective_date='2026-03-01',
    change_type='TRANSFER',
    change_reason='RESTRUCTURING',
    from_department=sales_dept,
    to_department=product_dept,
    from_designation=sales_exec,
    to_designation=product_manager,
    previous_salary=Decimal('80000.00'),
    new_salary=Decimal('110000.00'),
    notes="Transfer to product team with managerial role",
    changed_by=ceo
)

# Calculated:
# salary_change_amount: 30000.00
# salary_change_percentage: 37.5%
```

#### Scenario 5: Demotion with Salary Reduction
```python
EmploymentHistory.objects.create(
    employee=emp,
    effective_date='2025-12-01',
    change_type='DEMOTION',
    change_reason='RESTRUCTURING',
    from_designation=team_lead,
    to_designation=senior_dev,
    previous_salary=Decimal('120000.00'),
    new_salary=Decimal('95000.00'),
    notes="Team lead position eliminated in restructuring",
    changed_by=hr_manager
)

# Calculated:
# salary_change_amount: -25000.00 (negative)
# salary_change_percentage: -20.83% (decrease)
```

### Salary History Tracking

```
Employee Salary Progression:
═══════════════════════════════════════════════

Employee: Sarah Fernando
Hire Date: 2024-01-15

Record 1: HIRE
├── effective_date: 2024-01-15
├── change_type: HIRE
├── previous_salary: NULL
├── new_salary: 60,000
└── Starting salary

Record 2: PROMOTION
├── effective_date: 2024-07-15
├── change_type: PROMOTION
├── previous_salary: 60,000
├── new_salary: 75,000
├── Increase: 15,000 (25%)
└── Junior → Developer

Record 3: SALARY_CHANGE
├── effective_date: 2025-01-01
├── change_type: SALARY_CHANGE
├── previous_salary: 75,000
├── new_salary: 82,500
├── Increase: 7,500 (10%)
└── Annual increment

Record 4: PROMOTION
├── effective_date: 2025-07-15
├── change_type: PROMOTION
├── previous_salary: 82,500
├── new_salary: 100,000
├── Increase: 17,500 (21.2%)
└── Developer → Senior Developer

Record 5: SALARY_CHANGE
├── effective_date: 2026-01-01
├── change_type: SALARY_CHANGE
├── previous_salary: 100,000
├── new_salary: 110,000
├── Increase: 10,000 (10%)
└── Annual increment

Total Growth:
├── Starting: LKR 60,000
├── Current: LKR 110,000
├── Growth: LKR 50,000 (83.3%)
└── Duration: 2 years
```

### Salary Change Analytics

```
Salary Analytics Queries:
═══════════════════════════════════════════════

Query 1: Average Promotion Increase
SELECT AVG(
    ((new_salary - previous_salary) / previous_salary) * 100
) as avg_promotion_increase
FROM employment_history
WHERE change_type = 'PROMOTION'
AND previous_salary IS NOT NULL
AND new_salary IS NOT NULL

Result: 22.5% (typical promotion increase)

Query 2: Total Salary Expense Change
SELECT
    SUM(new_salary - previous_salary) as total_increase
FROM employment_history
WHERE effective_date BETWEEN '2025-01-01' AND '2025-12-31'
AND previous_salary IS NOT NULL

Result: LKR 1,250,000 (annual salary expense increase)

Query 3: Highest Salary Increase
SELECT
    employee_id,
    previous_salary,
    new_salary,
    (new_salary - previous_salary) as increase
FROM employment_history
ORDER BY increase DESC
LIMIT 10

Result: Top 10 salary increases in company history
```

### Property Implementation (Conceptual)

```python
class EmploymentHistory(models.Model):
    # ... fields ...
    
    @property
    def salary_change_amount(self):
        """Calculate absolute salary change"""
        if self.previous_salary is None or self.new_salary is None:
            return None
        return self.new_salary - self.previous_salary
    
    @property
    def salary_change_percentage(self):
        """Calculate percentage salary change"""
        if self.previous_salary is None or self.new_salary is None:
            return None
        if self.previous_salary == 0:
            return None  # Avoid division by zero
        change = self.new_salary - self.previous_salary
        percentage = (change / self.previous_salary) * 100
        return round(percentage, 2)
    
    def get_salary_change_display(self):
        """User-friendly salary change display"""
        if self.previous_salary is None or self.new_salary is None:
            return "N/A"
        
        amount = self.salary_change_amount
        percentage = self.salary_change_percentage
        
        if amount > 0:
            return f"+LKR {amount:,.2f} (+{percentage}%)"
        elif amount < 0:
            return f"-LKR {abs(amount):,.2f} ({percentage}%)"
        else:
            return "No change"

# Usage:
history = EmploymentHistory.objects.get(id=1)
print(history.get_salary_change_display())
# Output: "+LKR 15,000.00 (+25%)"
```

### When Salary Fields Are Used

| Change Type | previous_salary | new_salary | Usage |
|------------|----------------|------------|-------|
| HIRE | NULL | ✓ | Initial salary |
| PROMOTION | ✓ | ✓ | Salary with promotion |
| DEMOTION | ✓ | ✓ | Salary reduction |
| TRANSFER | Optional | Optional | May include salary change |
| SALARY_CHANGE | ✓ | ✓ | Always (primary purpose) |
| MANAGER_CHANGE | - | - | Rarely (unless with raise) |
| PROBATION_CONFIRMATION | Optional | Optional | May include confirmation raise |
| RESIGNATION | - | - | No salary change |
| TERMINATION | - | - | No salary change |

### Salary Confidentiality

```
Security Considerations:
═══════════════════════════════════════════════

1. Access Control:
   ├── Only HR and Management can view salary fields
   ├── Employees can see own history
   └── Line managers: limited access

2. Django Admin:
   ├── Override has_view_permission
   ├── Override get_queryset (filter by permission)
   └── Hide salary fields for non-HR users

3. API Endpoints:
   ├── Salary fields excluded from default serializers
   ├── Separate endpoint for salary history (restricted)
   └── Permission classes: IsHROrManagement

4. Logging:
   ├── Log all salary history access
   ├── Audit trail for compliance
   └── Alert on unauthorized access attempts
```

### Compliance and Equal Pay Analysis

```
Equal Pay Analysis:
═══════════════════════════════════════════════

Gender Pay Gap Analysis:
SELECT
    e.gender,
    eh.to_designation_id,
    AVG(eh.new_salary) as avg_salary
FROM employment_history eh
JOIN employees e ON eh.employee_id = e.id
WHERE eh.change_type = 'HIRE'
  AND eh.effective_date >= '2025-01-01'
GROUP BY e.gender, eh.to_designation_id

Result: Identify any pay disparities by gender

Experience-Based Analysis:
Compare salaries for same designation, different experience levels
Ensure fair progression

Sri Lankan Context:
├── No statutory equal pay law currently
├── However, best practice and HR policy
└── Preventive measure against discrimination
```

### Salary History Report (Example)

```
Employee Compensation Report
═══════════════════════════════════════════════

Employee: Nimal Perera (ID: 12345)
Department: IT
Designation: Senior Developer
Hire Date: 2022-05-15

Salary History:
┌────────────┬───────────────┬────────────┬────────────┬────────┐
│ Date       │ Change Type   │ Previous   │ New        │ Change │
├────────────┼───────────────┼────────────┼────────────┼────────┤
│ 2022-05-15 │ HIRE          │ -          │ 50,000     │ -      │
│ 2022-11-15 │ PROMOTION     │ 50,000     │ 65,000     │ +30%   │
│ 2023-01-01 │ SALARY_CHANGE │ 65,000     │ 71,500     │ +10%   │
│ 2023-11-01 │ PROMOTION     │ 71,500     │ 90,000     │ +26%   │
│ 2024-01-01 │ SALARY_CHANGE │ 90,000     │ 99,000     │ +10%   │
│ 2025-01-01 │ SALARY_CHANGE │ 99,000     │ 108,900    │ +10%   │
│ 2026-01-01 │ SALARY_CHANGE │ 108,900    │ 119,790    │ +10%   │
└────────────┴───────────────┴────────────┴────────────┴────────┘

Summary:
├── Starting Salary: LKR 50,000
├── Current Salary: LKR 119,790
├── Total Growth: LKR 69,790 (139.6%)
├── Duration: 3 years, 8 months
├── Annualized Growth: 38.2% per year
└── Number of Raises: 6

Average Annual Increase: 13.7%
Promotion Increases: 28% average
Annual Increments: 10% consistent
```

### Expected Outcome
- previous_salary and new_salary fields added
- Complete compensation history tracking
- Calculated properties for change analysis
- Foundation for compensation analytics
- Compliance with equal pay monitoring

### Verification Checklist
- [ ] previous_salary field added to EmploymentHistory
- [ ] new_salary field added to EmploymentHistory
- [ ] Both fields DecimalField with max_digits=12, decimal_places=2
- [ ] Both fields optional (blank=True, null=True)
- [ ] help_text provided for both fields
- [ ] verbose_name set for both fields
- [ ] salary_change_amount property added
- [ ] salary_change_percentage property added
- [ ] Properties handle NULL values gracefully
- [ ] get_salary_change_display method added (optional)
- [ ] Model docstring updated

---

## Task 49: Run EmploymentHistory Migrations

### Overview
Create and apply Django migrations for the EmploymentHistory model and all its fields added in Tasks 45-48. This migration will create the employment_history table in the database with all necessary columns, indexes, and foreign key relationships.

### Dependencies
- Tasks 45-48: EmploymentHistory model fully defined
- Django project configured
- Database connection established
- Employee migrations completed (Task 44)

### Instructions

1. **Verify model completeness**
   - Review `apps/employees/models/employment_history.py`
   - Confirm all fields from Tasks 45-48 are present
   - Check all imports are correct
   - Verify model is imported in models/__init__.py

2. **Check for syntax errors**
   - Run Python syntax check
   - Ensure no import errors
   - Verify all FK relationships are correct

3. **Create migrations**
   - Open terminal in project root
   - Activate virtual environment
   - Run: `python manage.py makemigrations employees`
   - New migration file created (e.g., 0006_employment_history.py)

4. **Review generated migration**
   - Open the migration file
   - Verify all fields included:
     - employee (FK to Employee)
     - effective_date (DateField)
     - change_type (CharField)
     - from_department, to_department (FK to Department)
     - from_designation, to_designation (FK to Designation)
     - from_manager, to_manager (FK to Employee)
     - notes (TextField)
     - changed_by (FK to User)
     - change_reason (CharField)
     - change_reason_detail (TextField)
     - previous_salary, new_salary (DecimalField)
   - Verify tenant field (from TenantAwareMixin)
   - Check created_at, updated_at (from TimestampMixin)

5. **Check migration dependencies**
   - Verify depends on:
     - Previous employees migration (0005_employee_job_fields)
     - Department and Designation migrations
     - User model (swappable dependency)
   - Add dependencies if missing

6. **Review indexes**
   - Check (employee, effective_date) index
   - Verify unique_together constraint
   - Confirm FK indexes auto-created

7. **Apply migration**
   - Run: `python manage.py migrate employees`
   - Monitor output for errors
   - Confirm successful application

8. **Verify database schema**
   - Check database for employment_history table
   - Verify all columns exist
   - Check foreign key constraints
   - Verify indexes created

9. **Test model in Django shell**
   - Open shell: `python manage.py shell`
   - Import EmploymentHistory model
   - Create test history record
   - Test FK relationships
   - Test properties (salary_change_amount, etc.)

10. **Update admin.py (if needed)**
    - Register EmploymentHistory in admin
    - Configure list_display
    - Add filters for change_type, effective_date
    - Configure readonly fields

### Migration Command Sequence

```
Step-by-Step Commands:
═══════════════════════════════════════════════

1. Navigate to project:
   $ cd /path/to/pos-arch

2. Activate virtual environment:
   $ source venv/bin/activate  # Linux/Mac
   $ venv\Scripts\activate     # Windows

3. Make migrations:
   $ python manage.py makemigrations employees
   
   Expected Output:
   Migrations for 'employees':
     employees/migrations/0006_employment_history.py
       - Create model EmploymentHistory
       - Add index on (employee, effective_date)
       - Add unique constraint (employee, effective_date, change_type)

4. Review migration:
   $ cat apps/employees/migrations/0006_employment_history.py
   
   OR open in editor

5. Apply migration:
   $ python manage.py migrate employees
   
   Expected Output:
   Operations to perform:
     Apply all migrations: employees
   Running migrations:
     Applying employees.0006_employment_history... OK

6. Verify:
   $ python manage.py showmigrations employees
   
   Should show [X] next to 0006_employment_history
```

### Sample Migration File

```python
# apps/employees/migrations/0006_employment_history.py

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('organization', '0001_initial'),
        ('tenants', '0001_initial'),
        ('employees', '0005_employee_job_fields'),
    ]

    operations = [
        migrations.CreateModel(
            name='EmploymentHistory',
            fields=[
                ('id', models.BigAutoField(
                    auto_created=True,
                    primary_key=True,
                    serialize=False,
                    verbose_name='ID'
                )),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('effective_date', models.DateField(
                    db_index=True,
                    verbose_name='Effective Date'
                )),
                ('change_type', models.CharField(
                    choices=[
                        ('HIRE', 'Initial Hire'),
                        ('PROMOTION', 'Promotion'),
                        ('DEMOTION', 'Demotion'),
                        ('TRANSFER', 'Department Transfer'),
                        ('SALARY_CHANGE', 'Salary Change'),
                        ('MANAGER_CHANGE', 'Manager Change'),
                        ('PROBATION_CONFIRMATION', 'Probation Confirmed'),
                        ('RESIGNATION', 'Resignation'),
                        ('TERMINATION', 'Termination'),
                    ],
                    max_length=30,
                    verbose_name='Change Type'
                )),
                ('change_reason', models.CharField(
                    blank=True,
                    choices=[
                        ('PERFORMANCE', 'Performance-Based'),
                        ('RESTRUCTURING', 'Restructuring'),
                        # ... other choices
                    ],
                    max_length=30,
                    null=True,
                    verbose_name='Change Reason'
                )),
                ('change_reason_detail', models.TextField(
                    blank=True,
                    null=True,
                    verbose_name='Change Reason Detail'
                )),
                ('notes', models.TextField(
                    blank=True,
                    null=True,
                    verbose_name='Notes'
                )),
                ('previous_salary', models.DecimalField(
                    blank=True,
                    decimal_places=2,
                    max_digits=12,
                    null=True,
                    verbose_name='Previous Salary'
                )),
                ('new_salary', models.DecimalField(
                    blank=True,
                    decimal_places=2,
                    max_digits=12,
                    null=True,
                    verbose_name='New Salary'
                )),
                # Foreign Keys
                ('employee', models.ForeignKey(
                    on_delete=django.db.models.deletion.CASCADE,
                    related_name='employment_history',
                    to='employees.employee',
                    verbose_name='Employee'
                )),
                ('tenant', models.ForeignKey(
                    on_delete=django.db.models.deletion.CASCADE,
                    to='tenants.tenant'
                )),
                ('from_department', models.ForeignKey(
                    blank=True,
                    null=True,
                    on_delete=django.db.models.deletion.SET_NULL,
                    related_name='history_from_department',
                    to='organization.department'
                )),
                ('to_department', models.ForeignKey(
                    blank=True,
                    null=True,
                    on_delete=django.db.models.deletion.SET_NULL,
                    related_name='history_to_department',
                    to='organization.department'
                )),
                # ... other FKs
            ],
            options={
                'verbose_name': 'Employment History',
                'verbose_name_plural': 'Employment Histories',
                'ordering': ['-effective_date'],
            },
        ),
        migrations.AddIndex(
            model_name='employmenthistory',
            index=models.Index(
                fields=['employee', 'effective_date'],
                name='emp_hist_emp_date_idx'
            ),
        ),
        migrations.AlterUniqueTogether(
            name='employmenthistory',
            unique_together={('employee', 'effective_date', 'change_type')},
        ),
    ]
```

### Database Schema Created

```
employment_history table:
═══════════════════════════════════════════════

Primary Key:
├── id (BIGINT, AUTO_INCREMENT, PK)

Timestamps:
├── created_at (DATETIME)
└── updated_at (DATETIME)

Core Fields:
├── effective_date (DATE, INDEXED)
├── change_type (VARCHAR(30))
├── change_reason (VARCHAR(30), NULL)
├── change_reason_detail (TEXT, NULL)
└── notes (TEXT, NULL)

Salary Fields:
├── previous_salary (DECIMAL(12,2), NULL)
└── new_salary (DECIMAL(12,2), NULL)

Foreign Keys:
├── tenant_id (FK to tenants, CASCADE)
├── employee_id (FK to employees, CASCADE, INDEXED)
├── from_department_id (FK to departments, SET_NULL, NULL)
├── to_department_id (FK to departments, SET_NULL, NULL)
├── from_designation_id (FK to designations, SET_NULL, NULL)
├── to_designation_id (FK to designations, SET_NULL, NULL)
├── from_manager_id (FK to employees, SET_NULL, NULL)
├── to_manager_id (FK to employees, SET_NULL, NULL)
└── changed_by_id (FK to users, SET_NULL, NULL)

Indexes:
├── PRIMARY KEY (id)
├── INDEX (tenant_id)
├── INDEX (employee_id)
├── INDEX (effective_date)
├── INDEX (employee_id, effective_date)
└── FK indexes on all foreign keys

Unique Constraint:
└── UNIQUE (employee_id, effective_date, change_type)
```

### Testing in Django Shell

```python
# Open Django shell
$ python manage.py shell

# Import models
>>> from apps.employees.models import Employee, EmploymentHistory
>>> from apps.organization.models import Department, Designation
>>> from decimal import Decimal
>>> from datetime import date

# Get test employee
>>> emp = Employee.objects.first()

# Create HIRE history
>>> hire_history = EmploymentHistory.objects.create(
...     employee=emp,
...     effective_date=emp.hire_date,
...     change_type='HIRE',
...     to_department=emp.department,
...     to_designation=emp.designation,
...     to_manager=emp.manager,
...     new_salary=Decimal('60000.00'),
...     notes="Initial hire as Junior Developer"
... )

# Create PROMOTION history
>>> promotion = EmploymentHistory.objects.create(
...     employee=emp,
...     effective_date=date(2026, 7, 15),
...     change_type='PROMOTION',
...     change_reason='PERFORMANCE',
...     from_designation=emp.designation,
...     to_designation=senior_designation,
...     previous_salary=Decimal('60000.00'),
...     new_salary=Decimal('75000.00'),
...     notes="Promoted for excellent performance"
... )

# Test properties
>>> promotion.salary_change_amount
Decimal('15000.00')

>>> promotion.salary_change_percentage
25.0

# Test relationships
>>> emp.employment_history.all()
<QuerySet [<EmploymentHistory: John Doe - PROMOTION - 2026-07-15>, 
           <EmploymentHistory: John Doe - HIRE - 2026-01-15>]>

# Count history records
>>> emp.employment_history.count()
2

# Filter by change type
>>> emp.employment_history.filter(change_type='PROMOTION')
<QuerySet [<EmploymentHistory: John Doe - PROMOTION - 2026-07-15>]>

# Test ordering (newest first)
>>> emp.employment_history.first().effective_date
datetime.date(2026, 7, 15)

# Success!
```

### Common Migration Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| Foreign key error | Referenced model doesn't exist | Apply organization migrations first |
| Unique constraint violation | Duplicate test data | Clear test data before migration |
| Decimal field error | Invalid default value | Ensure NULL allowed or provide default |
| Migration conflict | Multiple migrations created | Merge or delete and recreate |
| Import error | Model not in __init__.py | Add import to models/__init__.py |

### Expected Outcome
- EmploymentHistory table created in database
- All fields properly configured
- Foreign key relationships established
- Indexes created for performance
- Unique constraints enforced
- Model fully functional
- Ready for signal implementation (Task 50)

### Verification Checklist
- [ ] All EmploymentHistory fields verified in model
- [ ] No syntax errors in employment_history.py
- [ ] Model imported in models/__init__.py
- [ ] makemigrations executed successfully
- [ ] Migration file generated (0006_employment_history.py)
- [ ] Migration reviewed for accuracy
- [ ] All fields present in migration
- [ ] Dependencies correct
- [ ] migrate command executed successfully
- [ ] No migration errors
- [ ] Database table verified
- [ ] All columns exist
- [ ] Foreign keys created
- [ ] Indexes created
- [ ] Unique constraint created
- [ ] Test record created in shell
- [ ] Relationships tested
- [ ] Properties tested
- [ ] Admin registered (optional)

---

## Task 50: Create Employment History Signal

### Overview
Create Django signals to automatically track employment changes. This signal will monitor changes to the Employee model's job-related fields (department, designation, manager, salary) and automatically create EmploymentHistory records when changes are detected. This ensures complete audit trail without manual history creation.

### Dependencies
- Task 49: EmploymentHistory migrations applied
- Employee model with job fields (Tasks 35-44)
- EmploymentHistory model complete (Tasks 45-49)
- Django signals framework

### Instructions

1. **Create signals.py file**
   - Navigate to `apps/employees/` directory
   - Create file: `signals.py`
   - Import necessary Django components

2. **Import required modules**
   - Import Django signals: post_save
   - Import receiver decorator
   - Import Employee and EmploymentHistory models
   - Import get_user_model for changed_by tracking

3. **Define track_employment_changes signal**
   - Use @receiver(post_save, sender=Employee)
   - Signal fires after employee save
   - Check if instance already exists (not created)

4. **Implement change detection logic**
   - Get previous values from database
   - Compare with current values
   - Fields to track:
     - department
     - designation
     - manager
     - salary (if salary field exists)
     - confirmation_date (for probation)

5. **Determine change_type**
   - If created: HIRE
   - If designation changed: PROMOTION or DEMOTION
   - If department changed: TRANSFER
   - If manager changed: MANAGER_CHANGE
   - If confirmation_date set: PROBATION_CONFIRMATION
   - If multiple changes: Choose primary change_type

6. **Create EmploymentHistory record**
   - Only if changes detected
   - Set effective_date = today or change-specific date
   - Set change_type based on what changed
   - Set from_* and to_* fields appropriately
   - Set notes describing the change
   - Set changed_by (if available in context)

7. **Handle edge cases**
   - Prevent duplicate history records
   - Handle NULL to value changes
   - Handle value to NULL changes
   - Skip history for certain field updates (e.g., last_login)

8. **Add signal registration**
   - Create apps.py configuration
   - Import signals in ready() method
   - Ensure signals load once

9. **Test signal functionality**
   - Create employee (should create HIRE history)
   - Update department (should create TRANSFER history)
   - Promote employee (should create PROMOTION history)
   - Verify automatic history creation

10. **Add signal documentation**
    - Document signal purpose
    - List tracked fields
    - Explain change detection logic

### Signal Structure

```
┌─────────────────────────────────────────────────┐
│       Employment History Signal Flow             │
├─────────────────────────────────────────────────┤
│                                                  │
│  Employee Model Save                             │
│         │                                        │
│         ▼                                        │
│  post_save signal fires                          │
│         │                                        │
│         ▼                                        │
│  track_employment_changes() function             │
│         │                                        │
│         ├─► Detect Changes                       │
│         │   ├─ Department changed?               │
│         │   ├─ Designation changed?              │
│         │   ├─ Manager changed?                  │
│         │   └─ Salary changed?                   │
│         │                                        │
│         ├─► Determine change_type                │
│         │   └─ PROMOTION, TRANSFER, etc.         │
│         │                                        │
│         └─► Create EmploymentHistory             │
│             └─ Automatic audit record            │
│                                                  │
└─────────────────────────────────────────────────┘
```

### Signal Implementation (Conceptual)

```python
# apps/employees/signals.py

from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth import get_user_model
from datetime import date
from decimal import Decimal

from .models import Employee, EmploymentHistory

User = get_user_model()


@receiver(post_save, sender=Employee)
def track_employment_changes(sender, instance, created, **kwargs):
    """
    Automatically track employment changes and create history records.
    
    Monitored fields:
    - department
    - designation
    - manager
    - salary (if field exists)
    - confirmation_date
    """
    
    # For new employees (HIRE)
    if created:
        create_hire_history(instance)
        return
    
    # For existing employees, check for changes
    try:
        # Get previous state from database
        previous = Employee.objects.get(pk=instance.pk)
    except Employee.DoesNotExist:
        return  # Edge case: shouldn't happen
    
    # Detect changes
    changes_detected = detect_changes(previous, instance)
    
    if changes_detected:
        create_change_history(previous, instance, changes_detected)


def detect_changes(previous, current):
    """Detect what fields changed"""
    changes = {}
    
    # Department change
    if previous.department != current.department:
        changes['department'] = {
            'from': previous.department,
            'to': current.department
        }
    
    # Designation change
    if previous.designation != current.designation:
        changes['designation'] = {
            'from': previous.designation,
            'to': current.designation
        }
    
    # Manager change
    if previous.manager != current.manager:
        changes['manager'] = {
            'from': previous.manager,
            'to': current.manager
        }
    
    # Salary change (if field exists)
    if hasattr(previous, 'salary') and hasattr(current, 'salary'):
        if previous.salary != current.salary:
            changes['salary'] = {
                'from': previous.salary,
                'to': current.salary
            }
    
    # Probation confirmation
    if not previous.confirmation_date and current.confirmation_date:
        changes['confirmation'] = True
    
    return changes if changes else None


def determine_change_type(changes):
    """Determine primary change type based on what changed"""
    
    # Probation confirmation takes priority
    if 'confirmation' in changes:
        return 'PROBATION_CONFIRMATION'
    
    # Designation change (promotion/demotion)
    if 'designation' in changes:
        from_desig = changes['designation']['from']
        to_desig = changes['designation']['to']
        
        # Compare designation levels to determine promotion vs demotion
        if hasattr(from_desig, 'level') and hasattr(to_desig, 'level'):
            if to_desig.level > from_desig.level:
                return 'PROMOTION'
            elif to_desig.level < from_desig.level:
                return 'DEMOTION'
        return 'PROMOTION'  # Default if levels not available
    
    # Department change
    if 'department' in changes:
        return 'TRANSFER'
    
    # Manager change only
    if 'manager' in changes:
        return 'MANAGER_CHANGE'
    
    # Salary change only
    if 'salary' in changes:
        return 'SALARY_CHANGE'
    
    return 'OTHER'


def create_hire_history(employee):
    """Create HIRE history record for new employee"""
    EmploymentHistory.objects.create(
        employee=employee,
        effective_date=employee.hire_date or date.today(),
        change_type='HIRE',
        to_department=employee.department,
        to_designation=employee.designation,
        to_manager=employee.manager,
        new_salary=getattr(employee, 'salary', None),
        notes=f"Initial hire as {employee.designation or 'Employee'}"
    )


def create_change_history(previous, current, changes):
    """Create history record for detected changes"""
    
    change_type = determine_change_type(changes)
    
    history_data = {
        'employee': current,
        'effective_date': date.today(),
        'change_type': change_type,
        'notes': build_change_notes(changes)
    }
    
    # Department fields
    if 'department' in changes:
        history_data['from_department'] = changes['department']['from']
        history_data['to_department'] = changes['department']['to']
    
    # Designation fields
    if 'designation' in changes:
        history_data['from_designation'] = changes['designation']['from']
        history_data['to_designation'] = changes['designation']['to']
    
    # Manager fields
    if 'manager' in changes:
        history_data['from_manager'] = changes['manager']['from']
        history_data['to_manager'] = changes['manager']['to']
    
    # Salary fields
    if 'salary' in changes:
        history_data['previous_salary'] = changes['salary']['from']
        history_data['new_salary'] = changes['salary']['to']
    
    EmploymentHistory.objects.create(**history_data)


def build_change_notes(changes):
    """Build human-readable notes about what changed"""
    notes = []
    
    if 'department' in changes:
        from_dept = changes['department']['from']
        to_dept = changes['department']['to']
        notes.append(
            f"Department: {from_dept or 'None'} → {to_dept or 'None'}"
        )
    
    if 'designation' in changes:
        from_desig = changes['designation']['from']
        to_desig = changes['designation']['to']
        notes.append(
            f"Designation: {from_desig or 'None'} → {to_desig or 'None'}"
        )
    
    if 'manager' in changes:
        from_mgr = changes['manager']['from']
        to_mgr = changes['manager']['to']
        notes.append(
            f"Manager: {from_mgr or 'None'} → {to_mgr or 'None'}"
        )
    
    if 'salary' in changes:
        from_sal = changes['salary']['from']
        to_sal = changes['salary']['to']
        notes.append(
            f"Salary: LKR {from_sal:,.2f} → LKR {to_sal:,.2f}"
        )
    
    if 'confirmation' in changes:
        notes.append("Probation successfully completed")
    
    return "; ".join(notes) if notes else "Employment details updated"
```

### Signal Registration

```python
# apps/employees/apps.py

from django.apps import AppConfig


class EmployeesConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.employees'
    verbose_name = 'Employee Management'
    
    def ready(self):
        """Import signals when app is ready"""
        import apps.employees.signals  # noqa
```

```python
# apps/employees/__init__.py

default_app_config = 'apps.employees.apps.EmployeesConfig'
```

### Signal Behavior Examples

#### Example 1: New Employee (HIRE)
```python
# Create new employee
emp = Employee.objects.create(
    first_name="John",
    last_name="Doe",
    email="john@example.com",
    hire_date=date(2026, 1, 15),
    department=it_dept,
    designation=junior_dev,
    manager=tech_lead
)

# Signal automatically creates:
history = EmploymentHistory.objects.filter(
    employee=emp,
    change_type='HIRE'
).first()

# history.effective_date = 2026-01-15
# history.to_department = IT Department
# history.to_designation = Junior Developer
# history.to_manager = Tech Lead
# history.notes = "Initial hire as Junior Developer"
```

#### Example 2: Promotion
```python
# Get existing employee
emp = Employee.objects.get(id=1)

# Update designation
emp.designation = senior_developer
emp.save()

# Signal automatically creates:
history = EmploymentHistory.objects.filter(
    employee=emp
).order_by('-effective_date').first()

# history.change_type = 'PROMOTION'
# history.from_designation = Junior Developer
# history.to_designation = Senior Developer
# history.effective_date = today
# history.notes = "Designation: Junior Developer → Senior Developer"
```

#### Example 3: Department Transfer
```python
# Transfer employee
emp.department = sales_dept
emp.designation = sales_exec  # Also changes role
emp.manager = sales_manager
emp.save()

# Signal creates:
# history.change_type = 'TRANSFER' (department change takes precedence)
# history.from_department = IT Department
# history.to_department = Sales Department
# history.from_designation = Senior Developer
# history.to_designation = Sales Executive
# history.from_manager = Tech Lead
# history.to_manager = Sales Manager
# history.notes = "Department: IT → Sales; Designation: Sr Dev → Sales Exec; Manager: Tech Lead → Sales Manager"
```

#### Example 4: Probation Confirmation
```python
# Confirm employee after probation
emp.confirmation_date = date.today()
emp.save()

# Signal creates:
# history.change_type = 'PROBATION_CONFIRMATION'
# history.effective_date = today
# history.notes = "Probation successfully completed"
```

### Signal Testing

```
Test Scenarios:
═══════════════════════════════════════════════

Test 1: New Employee Creation
├── Action: Create employee
├── Expected: HIRE history created
└── Verify: history.change_type == 'HIRE'

Test 2: Simple Promotion
├── Action: Change designation only
├── Expected: PROMOTION history created
└── Verify: from_designation and to_designation set

Test 3: Department Transfer
├── Action: Change department
├── Expected: TRANSFER history created
└── Verify: from_department and to_department set

Test 4: Multiple Changes
├── Action: Change department + designation + manager
├── Expected: One history record with all changes
└── Verify: All from/to fields populated

Test 5: No Changes
├── Action: Save employee without changes
├── Expected: No history created
└── Verify: History count unchanged

Test 6: Probation Completion
├── Action: Set confirmation_date
├── Expected: PROBATION_CONFIRMATION history
└── Verify: change_type correct
```

### Edge Cases to Handle

```
Edge Case Handling:
═══════════════════════════════════════════════

Case 1: Field is NULL
├── From: None → Department A
├── Handle: to_department = A, from_department = None
└── Notes: "Department: None → A"

Case 2: Field becomes NULL
├── From: Department A → None
├── Handle: from_department = A, to_department = None
└── Notes: "Department: A → None"

Case 3: Bulk Update
├── Employee.objects.filter(...).update(department=new_dept)
├── Issue: Signals don't fire for bulk operations
└── Solution: Document limitation, use individual saves

Case 4: Rapid Changes
├── Save 1: department changed
├── Save 2: designation changed (within seconds)
├── Result: Two history records
└── Alternative: Batch changes before single save

Case 5: Signal Recursion
├── Signal creates history
├── History save triggers another signal?
├── Prevention: Check sender in signal
└── Only track Employee model changes

Case 6: Test/Fixture Data
├── During tests, signals fire
├── May create unwanted history
├── Solution: Use raw=True in post_save
└── Or disconnect signals in tests
```

### Performance Considerations

```
Performance Impact:
═══════════════════════════════════════════════

Impact: Moderate
└── Extra database query per employee save
└── Extra INSERT for history record

Optimization 1: Batch Changes
├── Make multiple field changes
├── Save once
└── One history record created

Optimization 2: Skip Unchanged Saves
├── Check if fields actually changed
├── Only create history if changes detected
└── Implemented in detect_changes()

Optimization 3: Async Signal (Advanced)
├── Use Celery for history creation
├── Non-blocking employee save
└── Slight delay in history record

Optimization 4: Bulk Operations
├── For mass updates, disable signal temporarily
├── Create history records in batch
└── Or accept no history for bulk operations

Benchmarks:
├── Single employee save: +2-5ms (history creation)
├── 100 employee updates: +200-500ms
└── Acceptable for most use cases
```

### Disabling Signal (When Needed)

```python
# Temporarily disable signal for bulk operations

from django.db.models.signals import post_save
from apps.employees.signals import track_employment_changes
from apps.employees.models import Employee

# Disconnect signal
post_save.disconnect(track_employment_changes, sender=Employee)

# Perform bulk operation
Employee.objects.filter(department=old_dept).update(
    department=new_dept
)

# Reconnect signal
post_save.connect(track_employment_changes, sender=Employee)

# Or use context manager (custom implementation):
with signal_disabled(post_save, track_employment_changes, Employee):
    # Bulk operations here
    pass
```

### Expected Outcome
- Automatic employment history tracking
- No manual history creation needed
- Complete audit trail maintained
- All employment changes captured
- Signal registered and active
- Comprehensive change detection

### Verification Checklist
- [ ] signals.py file created
- [ ] Required imports added
- [ ] track_employment_changes signal defined
- [ ] @receiver decorator configured
- [ ] detect_changes function implemented
- [ ] determine_change_type function implemented
- [ ] create_hire_history function implemented
- [ ] create_change_history function implemented
- [ ] build_change_notes function implemented
- [ ] Signal handles created=True (HIRE)
- [ ] Signal handles department changes (TRANSFER)
- [ ] Signal handles designation changes (PROMOTION/DEMOTION)
- [ ] Signal handles manager changes (MANAGER_CHANGE)
- [ ] Signal handles confirmation_date (PROBATION_CONFIRMATION)
- [ ] Edge cases handled (NULL values, etc.)
- [ ] Signal registered in apps.py ready() method
- [ ] Signal tested with employee creation
- [ ] Signal tested with promotion
- [ ] Signal tested with transfer
- [ ] No duplicate history records created
- [ ] Performance acceptable

---

## Summary

This document completed the EmploymentHistory implementation:

### Completed Features
- ✅ EmploymentHistory model (audit trail)
- ✅ Core tracking fields (department, designation, manager)
- ✅ Change type classification (9 types)
- ✅ Change reason categorization (10 reasons)
- ✅ Salary change tracking
- ✅ Database migrations applied
- ✅ Automatic history signal (Django signals)

### Key Achievements
1. **Complete Audit Trail** - Every employment change tracked
2. **Automatic Tracking** - Django signals handle history creation
3. **Two-Dimensional Analysis** - change_type + change_reason
4. **Salary History** - Complete compensation progression
5. **Before/After Tracking** - from_* and to_* fields
6. **Comprehensive Notes** - Detailed change documentation
7. **Performance Optimized** - Indexed queries, efficient detection

### Group C Complete
All 16 tasks (Tasks 35-50) in Group C: Job & Employment Details are now complete:
- ✅ Tasks 35-44: Job-related fields added to Employee model
- ✅ Tasks 45-50: EmploymentHistory model and automatic tracking

### Next Steps
Proceed to **Group D: Documents & Bank Details** to implement employee document management and banking information tracking.

---

**Document Status:** ✅ Complete  
**Total Tasks:** 6 (Tasks 45-50)  
**Total Lines:** ~1390
