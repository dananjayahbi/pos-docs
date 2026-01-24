# Tasks 35-45: LeaveRequest Model and Migrations

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 04 - Leave Management  
> **Group:** C - LeaveRequest Workflow  
> **Document:** 01 of 02  
> **Tasks Covered:** 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-46-52_Request-Service-Workflow.md](02_Tasks-46-52_Request-Service-Workflow.md)

---

## Document Overview

This document covers the creation of the LeaveRequest model, which is the core entity for managing employee leave requests in the system. It includes request status choices, the main model structure with all necessary fields for tracking leave applications, approvals, and workflow state, plus database migrations.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 35 | Define LeaveRequestStatus Choices | Low | 15 min |
| 36 | Create LeaveRequest Model | Medium | 25 min |
| 37 | Add Request Employee FK | Low | 15 min |
| 38 | Add Request Leave Type FK | Low | 15 min |
| 39 | Add Request Date Fields | Medium | 20 min |
| 40 | Add Half Day Support | Medium | 20 min |
| 41 | Add Request Reason Field | Low | 15 min |
| 42 | Add Request Status Field | Low | 15 min |
| 43 | Add Approval Fields | Medium | 20 min |
| 44 | Add Document Attachment | Medium | 20 min |
| 45 | Run LeaveRequest Migrations | Low | 15 min |

---

## Task 35: Define LeaveRequestStatus Choices

### Overview
Define the LeaveRequestStatus choices that represent the various states a leave request can be in throughout its lifecycle. These status constants ensure consistent state management and enable proper workflow transitions from draft creation through approval, rejection, cancellation, or recall.

### Dependencies
- Leave application (`apps/leave/`) must exist
- Constants module (`apps/leave/constants.py`) must exist

### Instructions

1. **Open constants.py file**
   - Navigate to `apps/leave/constants.py`
   - Prepare to add leave request status constants

2. **Add section documentation**
   - Add clear comment header for leave request status section
   - Explain the purpose of each status
   - Document valid status transitions

3. **Define LEAVE_REQUEST_STATUS_DRAFT constant**
   - Value: 'draft'
   - Display: 'Draft'
   - Purpose: Request created but not yet submitted
   - Allows employee to save and edit before submitting

4. **Define LEAVE_REQUEST_STATUS_PENDING constant**
   - Value: 'pending'
   - Display: 'Pending Approval'
   - Purpose: Request submitted and awaiting manager review
   - Triggers notification to approving manager

5. **Define LEAVE_REQUEST_STATUS_APPROVED constant**
   - Value: 'approved'
   - Display: 'Approved'
   - Purpose: Request approved by manager
   - Leave days deducted from balance

6. **Define LEAVE_REQUEST_STATUS_REJECTED constant**
   - Value: 'rejected'
   - Display: 'Rejected'
   - Purpose: Request denied by manager
   - Includes rejection reason
   - Balance restored if previously pending

7. **Define LEAVE_REQUEST_STATUS_CANCELLED constant**
   - Value: 'cancelled'
   - Display: 'Cancelled'
   - Purpose: Request cancelled by employee before approval
   - Balance restored if previously pending

8. **Define LEAVE_REQUEST_STATUS_RECALLED constant**
   - Value: 'recalled'
   - Display: 'Recalled'
   - Purpose: Approved request recalled by employee before start date
   - Balance restored
   - Requires manager notification

9. **Create LEAVE_REQUEST_STATUS_CHOICES tuple**
   - Compile all status constants into Django choices tuple
   - Follow Django's pattern: (value, display_name)
   - Maintain logical ordering

### LeaveRequestStatus Details

| Constant | Value | Display Name | Description |
|----------|-------|--------------|-------------|
| LEAVE_REQUEST_STATUS_DRAFT | 'draft' | Draft | Request saved but not submitted |
| LEAVE_REQUEST_STATUS_PENDING | 'pending' | Pending Approval | Awaiting manager decision |
| LEAVE_REQUEST_STATUS_APPROVED | 'approved' | Approved | Manager approved the request |
| LEAVE_REQUEST_STATUS_REJECTED | 'rejected' | Rejected | Manager rejected with reason |
| LEAVE_REQUEST_STATUS_CANCELLED | 'cancelled' | Cancelled | Employee cancelled before approval |
| LEAVE_REQUEST_STATUS_RECALLED | 'recalled' | Recalled | Employee recalled after approval |

### Status Lifecycle and Transitions

```
┌─────────────────────────────────────────────────────────────┐
│                  Leave Request Status Flow                   │
└─────────────────────────────────────────────────────────────┘

         ┌───────────┐
         │   DRAFT   │ ◄─── Employee creates request
         └─────┬─────┘
               │ submit()
               ▼
         ┌───────────┐
         │  PENDING  │ ◄─── Request submitted to manager
         └─────┬─────┘
               │
      ┌────────┼────────┐
      │        │        │
   approve() reject() cancel()
      │        │        │
      ▼        ▼        ▼
┌──────────┐ ┌──────────┐ ┌───────────┐
│ APPROVED │ │ REJECTED │ │ CANCELLED │
└────┬─────┘ └──────────┘ └───────────┘
     │
  recall()
  (before start)
     │
     ▼
┌───────────┐
│  RECALLED │
└───────────┘
```

### Valid Status Transitions

| From Status | To Status | Action | Condition |
|-------------|-----------|--------|-----------|
| DRAFT | PENDING | submit() | Employee submits request |
| DRAFT | CANCELLED | cancel() | Employee deletes draft |
| PENDING | APPROVED | approve() | Manager approves |
| PENDING | REJECTED | reject() | Manager rejects with reason |
| PENDING | CANCELLED | cancel() | Employee cancels before decision |
| APPROVED | RECALLED | recall() | Employee recalls before start_date |

### Status Use Cases

#### DRAFT Status
- **When:** Employee starts creating a leave request
- **Use Case:** Save partial information, return later to complete
- **Balance Impact:** None (no balance reservation)
- **Notifications:** None
- **Example:** Employee fills dates but wants to check with family before submitting

#### PENDING Status
- **When:** Employee clicks "Submit" button
- **Use Case:** Request awaits manager review
- **Balance Impact:** Reserve balance (pending_days incremented)
- **Notifications:** Email/notification to reporting manager
- **Example:** Request submitted Friday evening, manager reviews Monday

#### APPROVED Status
- **When:** Manager clicks "Approve" button
- **Use Case:** Leave granted, employee can take time off
- **Balance Impact:** Move from pending_days to used_days
- **Notifications:** Email/notification to employee
- **Example:** Manager approves annual leave for next month

#### REJECTED Status
- **When:** Manager clicks "Reject" with reason
- **Use Case:** Leave denied, balance restored
- **Balance Impact:** Restore pending_days to available_days
- **Notifications:** Email to employee with rejection reason
- **Example:** Manager rejects due to insufficient staffing

#### CANCELLED Status
- **When:** Employee cancels before manager decision
- **Use Case:** Change of plans before approval
- **Balance Impact:** Restore pending_days if was PENDING
- **Notifications:** Email to manager (cancellation notice)
- **Example:** Employee's travel plans changed, no longer needs leave

#### RECALLED Status
- **When:** Employee recalls approved leave before start date
- **Use Case:** Emergency recall after approval
- **Balance Impact:** Restore used_days to available_days
- **Notifications:** Email to manager (recall notice)
- **Example:** Family emergency cancelled, employee available to work

### Invalid Transition Prevention

```python
# Example validation logic (conceptual)

Invalid Transitions:
- APPROVED → PENDING ❌ Cannot "un-approve"
- REJECTED → APPROVED ❌ Must create new request
- CANCELLED → PENDING ❌ Must create new request
- DRAFT → APPROVED ❌ Must go through PENDING
- APPROVED → RECALLED (after start_date) ❌ Leave already started

Valid Business Rules:
- Only DRAFT can transition to PENDING
- Only PENDING can transition to APPROVED or REJECTED
- Only APPROVED can transition to RECALLED (with date check)
- CANCELLED and REJECTED are terminal states
```

### Sri Lankan Context Considerations

#### Public Holiday Adjustments
```
Scenario: Request spans Vesak Full Moon Poya Day

Original Request:
- Start: May 22, 2026 (Friday)
- End: May 25, 2026 (Monday)
- Total: 4 days

Adjustment:
- May 23, 2026 is Vesak Poya (Public Holiday)
- Actual leave days: 3 working days
- System should exclude public holidays from total_days
```

#### Weekend Handling
```
Sri Lankan Work Week:
- Monday to Friday (5 days)
- Saturday and Sunday (weekends)

Request Calculation:
- Start: Jan 23, 2026 (Friday)
- End: Jan 26, 2026 (Monday)
- Calendar days: 4
- Working days: 2 (Friday and Monday)
- Weekends excluded: Jan 24-25
```

### Expected Outcome
- Six clearly defined leave request statuses
- Proper Django choices tuple for model field
- Clear status transition rules
- Foundation for workflow implementation
- Support for various leave scenarios

### Verification Checklist
- [ ] LEAVE_REQUEST_STATUS_DRAFT defined
- [ ] LEAVE_REQUEST_STATUS_PENDING defined
- [ ] LEAVE_REQUEST_STATUS_APPROVED defined
- [ ] LEAVE_REQUEST_STATUS_REJECTED defined
- [ ] LEAVE_REQUEST_STATUS_CANCELLED defined
- [ ] LEAVE_REQUEST_STATUS_RECALLED defined
- [ ] LEAVE_REQUEST_STATUS_CHOICES tuple created
- [ ] Constants follow naming convention
- [ ] Display names are user-friendly
- [ ] Status transition logic documented

---

## Task 36: Create LeaveRequest Model

### Overview
Create the core LeaveRequest model that serves as the central entity for managing employee leave applications. This model will store all information about a leave request including dates, status, employee details, and workflow metadata. It integrates with Employee, LeaveType, and User models to provide comprehensive leave tracking.

### Dependencies
- Task 35: Define LeaveRequestStatus Choices
- Employee model exists
- LeaveType model exists
- User model exists
- TenantAwareMixin available
- TimestampMixin available

### Instructions

1. **Create leave_request.py model file**
   - Navigate to `apps/leave/models/` directory
   - Create new file `leave_request.py`
   - Import necessary Django and project components

2. **Import required modules**
   - Import Django model fields
   - Import Django validators
   - Import base model mixins (TenantAwareMixin, TimestampMixin)
   - Import leave request status constants
   - Import related models (Employee, LeaveType, User)

3. **Define LeaveRequest model class**
   - Inherit from TenantAwareMixin and TimestampMixin
   - Add comprehensive model docstring
   - Explain model purpose and relationships

4. **Add model documentation in docstring**
   - Describe the leave request workflow
   - List all fields and their purposes
   - Document relationships with other models
   - Include usage examples

5. **Prepare for field additions**
   - Structure model to accommodate multiple field categories:
     - Employee and leave type relationships
     - Date and duration fields
     - Request details and reason
     - Status and workflow fields
     - Approval metadata
     - Attachment support
   - Fields will be added in subsequent tasks

6. **Add Meta class**
   - Set verbose_name to "Leave Request"
   - Set verbose_name_plural to "Leave Requests"
   - Add ordering by ['-created_at'] (newest first)
   - Add indexes for performance:
     - Index on (tenant, employee, status)
     - Index on (tenant, status, start_date)
     - Index on (tenant, approved_by)

7. **Add placeholder __str__ method**
   - Will return meaningful string representation
   - Will be completed after adding employee and date fields
   - Format: "Employee Name - Leave Type (Start Date to End Date)"

8. **Update models/__init__.py**
   - Import LeaveRequest model
   - Add to __all__ list for package exports

### LeaveRequest Model Structure

```
┌─────────────────────────────────────────────────────────────┐
│                    LeaveRequest Model                        │
├─────────────────────────────────────────────────────────────┤
│ Relationship Fields: (Tasks 37-38)                          │
│  • employee → Employee                                       │
│  • leave_type → LeaveType                                    │
│                                                              │
│ Date & Duration Fields: (Tasks 39-40)                       │
│  • start_date                                                │
│  • end_date                                                  │
│  • total_days                                                │
│  • is_half_day                                               │
│  • half_day_type                                             │
│                                                              │
│ Request Details: (Task 41)                                  │
│  • reason                                                    │
│  • contact_during_leave                                      │
│                                                              │
│ Status & Workflow: (Task 42)                                │
│  • status                                                    │
│  • submitted_at                                              │
│                                                              │
│ Approval Metadata: (Task 43)                                │
│  • approved_by → User                                        │
│  • approved_at                                               │
│  • rejection_reason                                          │
│  • recalled_at                                               │
│  • recalled_reason                                           │
│                                                              │
│ Attachment: (Task 44)                                       │
│  • attachment                                                │
│                                                              │
│ Inherited from TenantAwareMixin:                            │
│  • tenant                                                    │
│                                                              │
│ Inherited from TimestampMixin:                              │
│  • created_at                                                │
│  • updated_at                                                │
└─────────────────────────────────────────────────────────────┘
```

### Model Relationships Diagram

```
┌──────────────┐        1:N         ┌──────────────────┐
│    Tenant    │◄────────────────────│  LeaveRequest    │
└──────────────┘                     └────────┬─────────┘
                                              │
                 ┌────────────────────────────┼────────────────┐
                 │                            │                │
                 │ N:1                        │ N:1            │ N:1
                 ▼                            ▼                ▼
         ┌──────────────┐           ┌──────────────┐  ┌──────────────┐
         │   Employee   │           │  LeaveType   │  │     User     │
         │              │           │              │  │  (approved_by)│
         └──────────────┘           └──────────────┘  └──────────────┘
```

### Field Categories Overview

| Category | Purpose | Tasks |
|----------|---------|-------|
| Relationships | Link to Employee, LeaveType, User | 37-38 |
| Dates & Duration | Start, end, total days, half-day | 39-40 |
| Request Details | Reason, contact information | 41 |
| Status & Workflow | Current state, submission date | 42 |
| Approval Metadata | Approver, timestamps, reasons | 43 |
| Attachments | Supporting documents | 44 |

### LeaveRequest Lifecycle Example

```
Employee: Kasun Perera
Leave Type: Annual Leave
Period: Feb 14-18, 2026

┌─────────────────────────────────────────────────┐
│ Step 1: Draft Creation                          │
├─────────────────────────────────────────────────┤
│ Status: DRAFT                                   │
│ Employee: Kasun Perera                          │
│ Leave Type: Annual Leave                        │
│ Start Date: Feb 14, 2026                        │
│ End Date: Feb 18, 2026                          │
│ Total Days: 5                                   │
│ Reason: "Family vacation"                       │
│ Created At: Feb 1, 2026 10:30 AM                │
└─────────────────────────────────────────────────┘
                    │
                    │ submit()
                    ▼
┌─────────────────────────────────────────────────┐
│ Step 2: Submission                              │
├─────────────────────────────────────────────────┤
│ Status: PENDING                                 │
│ Submitted At: Feb 1, 2026 10:35 AM              │
│ → Notification sent to manager                  │
│ → Balance reserved (pending_days += 5)          │
└─────────────────────────────────────────────────┘
                    │
                    │ approve()
                    ▼
┌─────────────────────────────────────────────────┐
│ Step 3: Approval                                │
├─────────────────────────────────────────────────┤
│ Status: APPROVED                                │
│ Approved By: Nimal Silva (Manager)              │
│ Approved At: Feb 2, 2026 9:15 AM                │
│ → Balance updated (used_days += 5)              │
│ → Notification sent to employee                 │
└─────────────────────────────────────────────────┘
```

### Database Performance Considerations

#### Index Strategy
```sql
-- Index 1: Primary lookup by tenant, employee, and status
CREATE INDEX idx_leave_request_tenant_emp_status 
ON leave_request (tenant_id, employee_id, status);

-- Index 2: Date-based queries for calendar views
CREATE INDEX idx_leave_request_tenant_status_date 
ON leave_request (tenant_id, status, start_date);

-- Index 3: Manager dashboard queries
CREATE INDEX idx_leave_request_tenant_approver 
ON leave_request (tenant_id, approved_by_id);
```

#### Query Performance Use Cases

| Query Type | Index Used | Purpose |
|------------|------------|---------|
| Employee leave history | tenant + employee + status | Show employee's past/current leaves |
| Manager pending approvals | tenant + status + start_date | Dashboard of requests to review |
| Team calendar view | tenant + status + date range | Display team's approved leaves |
| Approval audit trail | tenant + approver | Track manager approval history |

### Expected Outcome
- LeaveRequest model class defined with proper structure
- Model inherits tenant awareness and timestamps
- Proper Meta configuration for performance
- Foundation ready for field additions
- Clear documentation of model purpose

### Verification Checklist
- [ ] leave_request.py file created
- [ ] LeaveRequest class defined
- [ ] TenantAwareMixin inherited
- [ ] TimestampMixin inherited
- [ ] Comprehensive docstring added
- [ ] Meta class configured
- [ ] verbose_name set correctly
- [ ] Ordering by created_at descending
- [ ] Database indexes defined
- [ ] Placeholder __str__ method added
- [ ] Model imported in __init__.py
- [ ] Model added to __all__ list

---

## Task 37: Add Request Employee FK

### Overview
Add the employee foreign key relationship to the LeaveRequest model. This field links each leave request to the employee who is requesting the leave, establishing the primary relationship for leave tracking and management.

### Dependencies
- Task 36: Create LeaveRequest model
- Employee model exists with proper relationships

### Instructions

1. **Open leave_request.py file**
   - Navigate to `apps/leave/models/leave_request.py`
   - Locate LeaveRequest model class

2. **Import Employee model**
   - Add import statement for Employee model
   - Verify Employee model is available

3. **Add employee field**
   - Add ForeignKey to Employee model
   - Set on_delete=models.PROTECT (prevent deletion of employee with leave requests)
   - Set related_name='leave_requests' for reverse relationship
   - Make field required (no null, no blank)

4. **Add field documentation**
   - Add help_text explaining the field purpose
   - Note: "Employee requesting the leave"

5. **Update __str__ method**
   - Modify to include employee name
   - Format: "Employee.full_name - ..." (partial, will complete later)

### Employee Foreign Key Details

```python
# Field structure (conceptual)
employee = models.ForeignKey(
    Employee,
    on_delete=models.PROTECT,
    related_name='leave_requests',
    help_text="Employee requesting the leave"
)
```

### Relationship Characteristics

| Property | Value | Reason |
|----------|-------|--------|
| ForeignKey Type | Employee | Links to Employee model |
| on_delete | PROTECT | Prevent employee deletion with active requests |
| required | Yes | Every request must have an employee |
| related_name | 'leave_requests' | Access employee's requests via employee.leave_requests.all() |

### on_delete=PROTECT Justification

```
Scenario: Attempt to delete employee with leave requests

Employee: Kasun Perera (ID: 123)
Leave Requests: 15 historical requests

❌ Delete Attempt:
   - System prevents deletion
   - Raises ProtectedError
   - Message: "Cannot delete Employee because LeaveRequest exists"

✅ Correct Approach:
   - Deactivate employee instead of deleting
   - Historical leave requests preserved
   - Audit trail maintained
```

### Reverse Relationship Usage

#### Accessing Employee's Leave Requests
```python
# Get all leave requests for an employee
employee = Employee.objects.get(id=123)
all_requests = employee.leave_requests.all()

# Get pending requests only
pending_requests = employee.leave_requests.filter(
    status=LEAVE_REQUEST_STATUS_PENDING
)

# Get approved leaves for current year
current_year = timezone.now().year
approved_leaves = employee.leave_requests.filter(
    status=LEAVE_REQUEST_STATUS_APPROVED,
    start_date__year=current_year
)

# Count total leave days used
from django.db.models import Sum
total_days = employee.leave_requests.filter(
    status=LEAVE_REQUEST_STATUS_APPROVED,
    start_date__year=current_year
).aggregate(Sum('total_days'))['total_days__sum']
```

### Query Patterns

| Query Purpose | Code Pattern |
|---------------|--------------|
| Employee's all requests | `employee.leave_requests.all()` |
| Employee's pending requests | `employee.leave_requests.filter(status='pending')` |
| Employee's requests in date range | `employee.leave_requests.filter(start_date__range=[start, end])` |
| Count employee's requests | `employee.leave_requests.count()` |

### Data Integrity Considerations

#### Orphan Prevention
```
✅ Protected Deletion:
- Cannot delete employee with leave requests
- Ensures data integrity
- Maintains historical records

✅ Employee Deactivation:
- Mark employee.is_active = False
- Preserve leave history
- Prevent new leave requests
```

#### Multi-Tenant Isolation
```python
# Automatic tenant filtering via TenantAwareMixin
current_tenant = get_current_tenant()

# This query automatically filters by tenant
employee_requests = LeaveRequest.objects.filter(
    employee_id=123
)
# Result: Only requests for employee 123 in current tenant
```

### Expected Outcome
- employee field added to LeaveRequest model
- Foreign key relationship established with Employee
- PROTECT constraint prevents accidental employee deletion
- Reverse relationship enables easy request lookup
- Foundation for leave request filtering by employee

### Verification Checklist
- [ ] Employee model imported
- [ ] employee field added as ForeignKey
- [ ] on_delete=models.PROTECT set
- [ ] related_name='leave_requests' configured
- [ ] Field is required (no null/blank)
- [ ] help_text added for documentation
- [ ] __str__ method updated to include employee

---

## Task 38: Add Request Leave Type FK

### Overview
Add the leave_type foreign key relationship to the LeaveRequest model. This field links each leave request to a specific leave type (e.g., Annual Leave, Sick Leave, Casual Leave), enabling proper leave categorization, balance tracking, and policy enforcement.

### Dependencies
- Task 37: Add Request Employee FK
- LeaveType model exists

### Instructions

1. **Open leave_request.py file**
   - Continue in `apps/leave/models/leave_request.py`
   - Locate LeaveRequest model class

2. **Import LeaveType model**
   - Add import statement for LeaveType model
   - Verify LeaveType model is available

3. **Add leave_type field**
   - Add ForeignKey to LeaveType model
   - Set on_delete=models.PROTECT (prevent deletion of leave type with requests)
   - Set related_name='leave_requests' for reverse relationship
   - Make field required (no null, no blank)

4. **Add field documentation**
   - Add help_text explaining the field purpose
   - Note: "Type of leave being requested (Annual, Sick, etc.)"

5. **Update __str__ method**
   - Modify to include leave type name
   - Format: "Employee.full_name - LeaveType.name ..." (partial, will complete with dates)

### LeaveType Foreign Key Details

```python
# Field structure (conceptual)
leave_type = models.ForeignKey(
    LeaveType,
    on_delete=models.PROTECT,
    related_name='leave_requests',
    help_text="Type of leave being requested (Annual, Sick, etc.)"
)
```

### Relationship Characteristics

| Property | Value | Reason |
|----------|-------|--------|
| ForeignKey Type | LeaveType | Links to LeaveType model |
| on_delete | PROTECT | Prevent leave type deletion with active requests |
| required | Yes | Every request must have a leave type |
| related_name | 'leave_requests' | Access type's requests via leave_type.leave_requests.all() |

### on_delete=PROTECT Justification

```
Scenario: Attempt to delete leave type with historical requests

Leave Type: "Annual Leave" (ID: 5)
Historical Requests: 250+ requests across all employees

❌ Delete Attempt:
   - System prevents deletion
   - Raises ProtectedError
   - Message: "Cannot delete LeaveType because LeaveRequest exists"

✅ Correct Approach:
   - Deactivate leave type (is_active=False)
   - Historical requests preserved
   - Reports and analytics remain accurate
```

### Leave Type Integration Examples

#### Annual Leave Request
```
Employee: Kasun Perera
Leave Type: Annual Leave (15 days/year)
Request: Feb 14-18, 2026 (5 days)

Validation Checks:
✓ Annual Leave balance available?
✓ Request within policy limits?
✓ Notice period satisfied?
✓ No overlapping requests?
```

#### Sick Leave Request
```
Employee: Nimal Silva
Leave Type: Sick Leave (10 days/year)
Request: Feb 10, 2026 (1 day)

Special Rules:
✓ May allow retroactive requests
✓ May require medical certificate (if policy says so)
✓ Different approval workflow (auto-approve short sick leave?)
```

#### Casual Leave Request
```
Employee: Saman Fernando
Leave Type: Casual Leave (7 days/year)
Request: Feb 20, 2026 (1 day)

Policy Enforcement:
✓ Minimum notice: 1 day advance
✓ Cannot be combined with other leave
✓ Maximum consecutive days: 3
```

### Reverse Relationship Usage

#### Accessing Leave Type's Requests
```python
# Get all requests for a specific leave type
leave_type = LeaveType.objects.get(name="Annual Leave")
all_requests = leave_type.leave_requests.all()

# Get approved requests for this leave type in current year
current_year = timezone.now().year
approved_annual_leaves = leave_type.leave_requests.filter(
    status=LEAVE_REQUEST_STATUS_APPROVED,
    start_date__year=current_year
)

# Count pending requests by leave type
pending_count = leave_type.leave_requests.filter(
    status=LEAVE_REQUEST_STATUS_PENDING
).count()

# Calculate total days requested for this leave type
from django.db.models import Sum
total_days = leave_type.leave_requests.filter(
    status=LEAVE_REQUEST_STATUS_APPROVED,
    start_date__year=current_year
).aggregate(Sum('total_days'))['total_days__sum']
```

### Query Patterns

| Query Purpose | Code Pattern |
|---------------|--------------|
| All requests for leave type | `leave_type.leave_requests.all()` |
| Pending requests by type | `leave_type.leave_requests.filter(status='pending')` |
| Approved requests this year | `leave_type.leave_requests.filter(status='approved', start_date__year=2026)` |
| Most requested leave type | `LeaveType.objects.annotate(count=Count('leave_requests')).order_by('-count')` |

### Combined Employee and Leave Type Filtering

```python
# Get employee's annual leave requests
employee = Employee.objects.get(id=123)
annual_leave_type = LeaveType.objects.get(name="Annual Leave")

annual_leaves = LeaveRequest.objects.filter(
    employee=employee,
    leave_type=annual_leave_type,
    status=LEAVE_REQUEST_STATUS_APPROVED
)

# Get all sick leave requests across company (for reporting)
sick_leave_type = LeaveType.objects.get(name="Sick Leave")
all_sick_leaves = LeaveRequest.objects.filter(
    leave_type=sick_leave_type,
    start_date__year=2026
)
```

### Sri Lankan Leave Type Context

| Leave Type | Common Name | Typical Allocation |
|------------|-------------|-------------------|
| Annual Leave | සාමාන්‍ය නිවාඩු | 14-21 days/year |
| Sick Leave | රෝගී නිවාඩු | 7-14 days/year |
| Casual Leave | අනියම් නිවාඩු | 7 days/year |
| Maternity Leave | මාතෘ නිවාඩු | 84 days (12 weeks) |
| Paternity Leave | පිතෘ නිවාඩු | 3 days |
| No-Pay Leave | වැටුප් රහිත නිවාඩු | Unlimited (subject to approval) |

### Expected Outcome
- leave_type field added to LeaveRequest model
- Foreign key relationship established with LeaveType
- PROTECT constraint prevents accidental leave type deletion
- Reverse relationship enables leave type-based reporting
- Support for various leave type policies

### Verification Checklist
- [ ] LeaveType model imported
- [ ] leave_type field added as ForeignKey
- [ ] on_delete=models.PROTECT set
- [ ] related_name='leave_requests' configured
- [ ] Field is required (no null/blank)
- [ ] help_text added for documentation
- [ ] __str__ method updated to include leave type

---

## Task 39: Add Request Date Fields

### Overview
Add date-related fields to the LeaveRequest model for tracking the start date, end date, and calculated total duration of the leave request. These fields are essential for leave scheduling, overlap detection, balance calculation, and calendar display.

### Dependencies
- Task 38: Add Request Leave Type FK
- Django date utilities available

### Instructions

1. **Open leave_request.py file**
   - Continue in `apps/leave/models/leave_request.py`
   - Locate LeaveRequest model class

2. **Import necessary utilities**
   - Import timezone utilities if needed
   - Import DecimalField validator (MinValueValidator)

3. **Add start_date field**
   - DateField, required (no blank, no null)
   - Represents the first day of leave
   - Include help_text: "First day of leave (inclusive)"

4. **Add end_date field**
   - DateField, required (no blank, no null)
   - Represents the last day of leave
   - Include help_text: "Last day of leave (inclusive)"
   - Add validation: end_date >= start_date

5. **Add total_days field**
   - DecimalField with max_digits=5, decimal_places=2
   - Stores calculated working days (handles half days)
   - Default=0
   - Validates: total_days > 0
   - Include help_text: "Total working days (excludes weekends/holidays)"

6. **Add clean method for date validation**
   - Override model's clean() method
   - Validate: end_date >= start_date
   - Raise ValidationError if dates are invalid
   - Calculate total_days considering weekends and holidays

7. **Create calculate_working_days helper method**
   - Calculate working days between start_date and end_date
   - Exclude weekends (Saturday, Sunday)
   - Exclude public holidays (integrate with Holiday model when available)
   - Return decimal value (supports half days)

8. **Update __str__ method**
   - Complete the string representation
   - Format: "Kasun Perera - Annual Leave (Feb 14, 2026 to Feb 18, 2026)"
   - Include date range for clarity

### Date Fields Structure

```python
# Field structure (conceptual)
start_date = models.DateField(
    help_text="First day of leave (inclusive)"
)

end_date = models.DateField(
    help_text="Last day of leave (inclusive)"
)

total_days = models.DecimalField(
    max_digits=5,
    decimal_places=2,
    default=0,
    validators=[MinValueValidator(0.5)],
    help_text="Total working days (excludes weekends/holidays)"
)
```

### Date Validation Rules

| Rule | Description | Example |
|------|-------------|---------|
| end_date >= start_date | End must be same or after start | ✓ Feb 14 to Feb 18 |
| Both dates required | Cannot be null | ✗ Missing end_date |
| total_days > 0 | Must request at least 0.5 days | ✓ Half day = 0.5 |
| Future dates preferred | Generally can't request past leave | Policy dependent |

### Working Days Calculation

#### Simple Case: Continuous Weekdays
```
Request: Feb 14-18, 2026
- Feb 14 (Monday): Working day ✓
- Feb 15 (Tuesday): Working day ✓
- Feb 16 (Wednesday): Working day ✓
- Feb 17 (Thursday): Working day ✓
- Feb 18 (Friday): Working day ✓

Total Days: 5.0
```

#### With Weekend: Skip Saturday and Sunday
```
Request: Feb 14-17, 2026
- Feb 14 (Saturday): Weekend ✗
- Feb 15 (Sunday): Weekend ✗
- Feb 16 (Monday): Working day ✓
- Feb 17 (Tuesday): Working day ✓

Total Days: 2.0
```

#### With Public Holiday
```
Request: May 22-25, 2026
- May 22 (Friday): Working day ✓
- May 23 (Saturday): Weekend ✗
- May 24 (Sunday): Vesak Poya (Public Holiday) ✗
- May 25 (Monday): Working day ✓

Total Days: 2.0
```

#### Single Day Request
```
Request: Feb 16, 2026 (single day)
- start_date = Feb 16
- end_date = Feb 16
- total_days = 1.0
```

### Working Days Calculation Algorithm

```
Function: calculate_working_days(start_date, end_date, is_half_day=False)

Step 1: Initialize
- working_days = 0
- current_date = start_date

Step 2: Iterate through date range
- While current_date <= end_date:
    - If current_date is NOT weekend (Sat/Sun):
        - If current_date is NOT public holiday:
            - working_days += 1
    - current_date += 1 day

Step 3: Handle half day
- If is_half_day and working_days >= 1:
    - working_days = 0.5

Step 4: Return
- Return working_days as Decimal
```

### Weekend Detection Logic

```python
# Conceptual weekend check
def is_weekend(date):
    """
    Check if date is Saturday (5) or Sunday (6)
    """
    weekday = date.weekday()
    return weekday in [5, 6]  # 5=Saturday, 6=Sunday

Examples:
- Feb 14, 2026 (Saturday) → True
- Feb 15, 2026 (Sunday) → True
- Feb 16, 2026 (Monday) → False
```

### Public Holiday Integration

```python
# Conceptual holiday check
def is_public_holiday(date, tenant):
    """
    Check if date is a public holiday for the tenant
    """
    return Holiday.objects.filter(
        tenant=tenant,
        date=date,
        is_active=True
    ).exists()

Sri Lankan Public Holidays Example:
- Jan 15, 2026: Tamil Thai Pongal Day
- Feb 4, 2026: Independence Day
- Mar 7, 2026: Maha Shivaratri Day
- Apr 14-15, 2026: Sinhala & Tamil New Year
- May 24, 2026: Vesak Full Moon Poya Day
- May 25, 2026: Day following Vesak
```

### Edge Cases and Handling

| Edge Case | Handling |
|-----------|----------|
| Single day on weekend | total_days = 0 (validation error) |
| All days are holidays | total_days = 0 (validation error) |
| Start date > end date | ValidationError in clean() |
| Past dates | Allow (for sick leave retroactive requests) |
| Very long request | Allow but may require special approval |

### Date Range Display Formats

```python
# For user display
"Feb 14, 2026 to Feb 18, 2026"  # Full range
"Feb 16, 2026"                   # Single day
"Feb 14 - 18, 2026"              # Compact same month
"Dec 30, 2025 - Jan 3, 2026"    # Cross-month
```

### Validation Error Messages

```python
# Example validation messages
"End date must be on or after start date"
"Leave request must span at least 0.5 working days"
"The selected date range contains no working days"
"Start date cannot be in the past (except for sick leave)"
```

### Expected Outcome
- start_date field added for leave start
- end_date field added for leave end
- total_days field stores calculated working days
- Date validation prevents invalid ranges
- Working days calculation excludes weekends and holidays
- Complete __str__ method with date range

### Verification Checklist
- [ ] start_date field added as DateField
- [ ] end_date field added as DateField
- [ ] total_days field added as DecimalField
- [ ] Both date fields are required
- [ ] total_days has MinValueValidator
- [ ] clean() method added for date validation
- [ ] calculate_working_days() method implemented
- [ ] Weekend detection logic included
- [ ] Public holiday consideration (placeholder)
- [ ] __str__ method completed with dates
- [ ] help_text added for all date fields

---

## Task 40: Add Half Day Support

### Overview
Add half-day leave support to the LeaveRequest model. This feature allows employees to request leave for half of a working day (e.g., morning or afternoon off), providing flexibility for short absences like medical appointments or personal errands.

### Dependencies
- Task 39: Add Request Date Fields

### Instructions

1. **Open leave_request.py file**
   - Continue in `apps/leave/models/leave_request.py`
   - Locate LeaveRequest model class

2. **Define half_day_type choices**
   - Create HALF_DAY_TYPE_FIRST_HALF constant ('first_half', 'First Half (Morning)')
   - Create HALF_DAY_TYPE_SECOND_HALF constant ('second_half', 'Second Half (Afternoon)')
   - Create HALF_DAY_TYPE_CHOICES tuple

3. **Add is_half_day field**
   - BooleanField, default=False
   - Indicates if this is a half-day leave request
   - Include help_text: "Is this a half-day leave?"

4. **Add half_day_type field**
   - CharField with choices from HALF_DAY_TYPE_CHOICES
   - Optional (blank=True, null=True)
   - Only required when is_half_day=True
   - Include help_text: "Which half of the day (only if half-day leave)"

5. **Update clean method**
   - Add half-day validation logic
   - If is_half_day=True:
     - Require half_day_type to be set
     - Require start_date == end_date (single day only)
     - Set total_days = 0.5
   - If is_half_day=False:
     - Clear half_day_type (set to null)

6. **Update calculate_working_days method**
   - Accept is_half_day parameter
   - If is_half_day=True, return Decimal('0.5')
   - Otherwise, calculate normally

### Half Day Configuration

```python
# Constants (conceptual)
HALF_DAY_TYPE_FIRST_HALF = 'first_half'
HALF_DAY_TYPE_SECOND_HALF = 'second_half'

HALF_DAY_TYPE_CHOICES = [
    (HALF_DAY_TYPE_FIRST_HALF, 'First Half (Morning)'),
    (HALF_DAY_TYPE_SECOND_HALF, 'Second Half (Afternoon)'),
]

# Fields (conceptual)
is_half_day = models.BooleanField(
    default=False,
    help_text="Is this a half-day leave?"
)

half_day_type = models.CharField(
    max_length=20,
    choices=HALF_DAY_TYPE_CHOICES,
    blank=True,
    null=True,
    help_text="Which half of the day (only if half-day leave)"
)
```

### Half Day Types

| Type | Value | Display Name | Working Hours | Use Cases |
|------|-------|--------------|---------------|-----------|
| First Half | 'first_half' | First Half (Morning) | 8:00 AM - 12:00 PM | Medical appointment, personal errands |
| Second Half | 'second_half' | Second Half (Afternoon) | 1:00 PM - 5:00 PM | School events, early departure |

### Half Day Validation Rules

| Rule | Description | Example |
|------|-------------|---------|
| Single day only | Half-day must be for one day | ✓ Feb 16 to Feb 16 |
| requires half_day_type | Must specify first or second half | ✓ First Half selected |
| Total days = 0.5 | Always 0.5 days for half-day | ✓ total_days = 0.5 |
| Cannot span multiple days | Start and end must be same | ✗ Feb 16 to Feb 17 |

### Half Day Request Examples

#### Example 1: Morning Medical Appointment
```
Employee: Kasun Perera
Leave Type: Casual Leave
Date: Feb 16, 2026
is_half_day: True
half_day_type: FIRST_HALF (Morning)
total_days: 0.5

Reason: "Medical checkup appointment"

Schedule:
- 8:00 AM - 12:00 PM: On leave
- 1:00 PM - 5:00 PM: Working
```

#### Example 2: Afternoon School Event
```
Employee: Nimal Silva
Leave Type: Casual Leave
Date: Feb 20, 2026
is_half_day: True
half_day_type: SECOND_HALF (Afternoon)
total_days: 0.5

Reason: "Daughter's school annual concert"

Schedule:
- 8:00 AM - 12:00 PM: Working
- 1:00 PM - 5:00 PM: On leave
```

#### Example 3: Full Day Leave (Not Half Day)
```
Employee: Saman Fernando
Leave Type: Annual Leave
Date: Feb 18, 2026
is_half_day: False
half_day_type: None
total_days: 1.0

Schedule:
- Full day off
```

### Half Day Balance Impact

```
Initial Balance:
- Annual Leave: 15.0 days

Request 1: Half day on Feb 10
- Deduction: 0.5 days
- Remaining: 14.5 days

Request 2: Full day on Feb 15
- Deduction: 1.0 days
- Remaining: 13.5 days

Request 3: Half day on Feb 20
- Deduction: 0.5 days
- Remaining: 13.0 days

Total Used: 2.0 days (from 3 requests)
```

### Half Day Validation Logic

```python
# Conceptual validation in clean() method
def clean(self):
    super().clean()
    
    if self.is_half_day:
        # Validate half_day_type is provided
        if not self.half_day_type:
            raise ValidationError({
                'half_day_type': 'Half day type must be specified for half-day leave'
            })
        
        # Validate single day only
        if self.start_date != self.end_date:
            raise ValidationError({
                'is_half_day': 'Half-day leave can only be for a single day'
            })
        
        # Set total_days to 0.5
        self.total_days = Decimal('0.5')
    
    else:
        # Clear half_day_type if not a half day
        self.half_day_type = None
        
        # Calculate full working days
        if self.start_date and self.end_date:
            self.total_days = self.calculate_working_days(
                self.start_date,
                self.end_date,
                is_half_day=False
            )
```

### Display in UI

#### Leave Request Form
```
┌─────────────────────────────────────────────────┐
│ Leave Request Form                              │
├─────────────────────────────────────────────────┤
│ Leave Type: [Casual Leave    ▼]                │
│                                                 │
│ Start Date: [Feb 16, 2026]                      │
│ End Date:   [Feb 16, 2026]                      │
│                                                 │
│ [✓] Half Day Leave                              │
│                                                 │
│ Half Day Type:                                  │
│ ( ) First Half (Morning - 8 AM to 12 PM)       │
│ (•) Second Half (Afternoon - 1 PM to 5 PM)     │
│                                                 │
│ Total Days: 0.5                                 │
│                                                 │
│ Reason:                                         │
│ [Doctor appointment                         ]   │
│                                                 │
│ [ Submit Request ]                              │
└─────────────────────────────────────────────────┘
```

#### Leave Calendar Display
```
February 2026

Mon    Tue    Wed    Thu    Fri    Sat    Sun
                            13     14     15
16     17     18     19     20     21     22
[H]                        [H]

Legend:
[F] = Full day leave
[H] = Half day leave (hover for details)
```

### Sri Lankan Context

#### Working Hours Standards
```
Standard Office Hours:
- Morning: 8:30 AM - 12:30 PM (4 hours)
- Lunch: 12:30 PM - 1:00 PM (30 min)
- Afternoon: 1:00 PM - 5:00 PM (4 hours)

Total: 8 hours working day
Half Day: 4 hours (0.5 days)
```

#### Common Half Day Use Cases in Sri Lanka
- Medical appointments (දිනපතා වෛද්‍ය හමුවීම්)
- Bank visits during banking hours
- Government office visits (e.g., passport, licenses)
- School functions and parent-teacher meetings
- Religious observances (half day for temple visits)

### Expected Outcome
- is_half_day boolean field for half-day flag
- half_day_type choice field for morning/afternoon selection
- Validation ensures single-day constraint for half-day
- total_days automatically set to 0.5 for half-day leaves
- Support for flexible leave management

### Verification Checklist
- [ ] HALF_DAY_TYPE_FIRST_HALF constant defined
- [ ] HALF_DAY_TYPE_SECOND_HALF constant defined
- [ ] HALF_DAY_TYPE_CHOICES tuple created
- [ ] is_half_day field added as BooleanField
- [ ] half_day_type field added with choices
- [ ] clean() method validates half-day constraints
- [ ] half_day_type required when is_half_day=True
- [ ] Single day validation for half-day
- [ ] total_days set to 0.5 for half-day
- [ ] calculate_working_days() handles half-day parameter

---

## Task 41: Add Request Reason Field

### Overview
Add fields to capture the reason for the leave request and contact information for the employee during their leave. These fields provide context for the request, assist managers in decision-making, and ensure the employee can be reached in case of emergencies.

### Dependencies
- Task 40: Add Half Day Support

### Instructions

1. **Open leave_request.py file**
   - Continue in `apps/leave/models/leave_request.py`
   - Locate LeaveRequest model class

2. **Add reason field**
   - TextField for detailed reason
   - Required (no blank, no null)
   - Minimum length recommended: 10 characters (optional validation)
   - Include help_text: "Reason for leave request"

3. **Add contact_during_leave field**
   - CharField with max_length=200
   - Optional (blank=True, null=True)
   - Store phone number, alternate contact, or note
   - Include help_text: "Phone number or contact details during leave"

4. **Update clean method**
   - Add optional reason length validation
   - Ensure reason has meaningful content (not just whitespace)
   - Trim whitespace from reason and contact fields

### Reason and Contact Fields Structure

```python
# Field structure (conceptual)
reason = models.TextField(
    help_text="Reason for leave request"
)

contact_during_leave = models.CharField(
    max_length=200,
    blank=True,
    null=True,
    help_text="Phone number or contact details during leave"
)
```

### Field Specifications

| Field | Type | Required | Max Length | Purpose |
|-------|------|----------|------------|---------|
| reason | TextField | Yes | Unlimited | Justification for leave |
| contact_during_leave | CharField | No | 200 chars | Emergency contact info |

### Reason Field Guidelines

#### Good Reason Examples
```
✓ "Family vacation to Galle for 5 days"
✓ "Medical procedure scheduled, doctor's note attached"
✓ "Attending cousin's wedding in Kandy"
✓ "Personal matters requiring immediate attention"
✓ "Moving to new residence, need time for relocation"
```

#### Poor Reason Examples (Should Be Improved)
```
✗ "Need leave" → Too vague
✗ "Personal" → Not descriptive enough
✗ "..." → No actual reason provided
✗ "aaa" → Nonsensical
```

### Reason Validation

```python
# Conceptual validation in clean() method
def clean(self):
    super().clean()
    
    # Trim whitespace
    if self.reason:
        self.reason = self.reason.strip()
    
    # Check for meaningful content
    if not self.reason or len(self.reason) < 5:
        raise ValidationError({
            'reason': 'Please provide a meaningful reason (at least 5 characters)'
        })
    
    # Trim contact info
    if self.contact_during_leave:
        self.contact_during_leave = self.contact_during_leave.strip()
```

### Contact During Leave Use Cases

#### With Contact Information
```
Employee: Kasun Perera
Leave: Feb 14-18, 2026 (Annual Leave)
Reason: "Family vacation to Nuwara Eliya"
Contact: "+94 77 123 4567 (mobile), available after 6 PM"

Use Case: Manager can reach employee for urgent project question
```

#### Without Contact Information (Flexible)
```
Employee: Nimal Silva
Leave: Feb 20, 2026 (Casual Leave - Half Day)
Reason: "Medical checkup appointment"
Contact: (empty)

Use Case: Short leave, no need for contact details
```

#### Emergency Contact
```
Employee: Saman Fernando
Leave: Mar 1-10, 2026 (Annual Leave)
Reason: "Traveling overseas to India"
Contact: "WhatsApp: +94 77 987 6543, Email: saman@email.com"

Use Case: International travel, need reliable contact method
```

### Leave Request Reason Categories

| Category | Example Reasons | Typical Leave Type |
|----------|-----------------|-------------------|
| Vacation | "Beach holiday in Bentota", "Visiting family in Jaffna" | Annual Leave |
| Medical | "Surgery scheduled", "Medical treatment", "Doctor appointment" | Sick Leave |
| Family | "Sister's wedding", "Son's school event", "Family emergency" | Casual/Annual |
| Religious | "Temple festival", "Pilgrimage to Kataragama" | Casual Leave |
| Personal | "House moving", "Vehicle registration", "Bank matters" | Casual Leave |
| Emergency | "Family illness", "Unexpected personal matter" | Emergency Leave |

### Display in Leave Request Form

```
┌─────────────────────────────────────────────────┐
│ Leave Request Details                           │
├─────────────────────────────────────────────────┤
│ Reason for Leave: *                             │
│ ┌─────────────────────────────────────────────┐ │
│ │ Family vacation to Nuwara Eliya for my      │ │
│ │ daughter's school trip. Will be staying at  │ │
│ │ Hilltop Hotel, Nuwara Eliya.                │ │
│ │                                              │ │
│ └─────────────────────────────────────────────┘ │
│ 185 characters (min 5 required)                 │
│                                                 │
│ Contact During Leave: (Optional)                │
│ ┌─────────────────────────────────────────────┐ │
│ │ +94 77 123 4567 (mobile, available anytime)│ │
│ └─────────────────────────────────────────────┘ │
│                                                 │
│ [ Submit Request ]                              │
└─────────────────────────────────────────────────┘
```

### Manager Approval View

```
┌─────────────────────────────────────────────────┐
│ Leave Request - Pending Approval                │
├─────────────────────────────────────────────────┤
│ Employee: Kasun Perera                          │
│ Leave Type: Annual Leave                        │
│ Dates: Feb 14-18, 2026 (5 days)                 │
│ Status: PENDING                                 │
│                                                 │
│ Reason:                                         │
│ ┌─────────────────────────────────────────────┐ │
│ │ Family vacation to Nuwara Eliya for my      │ │
│ │ daughter's school trip. Will be staying at  │ │
│ │ Hilltop Hotel, Nuwara Eliya.                │ │
│ └─────────────────────────────────────────────┘ │
│                                                 │
│ Contact During Leave:                           │
│ +94 77 123 4567 (mobile, available anytime)     │
│                                                 │
│ [ Approve ] [ Reject ]                          │
└─────────────────────────────────────────────────┘
```

### Sri Lankan Communication Preferences

#### Mobile Contact Formats
```
Standard Format: +94 77 123 4567
Alternative: 077 123 4567
WhatsApp: +94 77 123 4567 (WhatsApp preferred)
Viber: +94 77 123 4567 (Viber)
```

#### Multi-Language Reason Support
```
Sinhala Example:
"මගේ දියණියගේ පාසල් සංචාරය සඳහා නුවර එලියට පවුලේ නිවාඩුවක්"

Tamil Example:
"என் மகளின் பள்ளி பயணத்திற்கு நுவரெலியா குடும்ப விடுமுறை"

English Example:
"Family vacation to Nuwara Eliya for daughter's school trip"
```

### Privacy and Data Protection

```
Reason Field Considerations:
✓ Do store: General reason, purpose, location
✗ Do not require: Medical diagnosis details, private family matters
✓ Acceptable: "Medical treatment"
✗ Too detailed: "Treatment for [specific condition]"

Contact Field Considerations:
✓ Do store: Phone, email, alternate contact
✗ Do not share: Contact info shared only with manager and HR
✓ Acceptable: "Mobile available after 6 PM"
```

### Expected Outcome
- reason field captures leave justification
- contact_during_leave field stores optional contact info
- Validation ensures meaningful reason provided
- Support for multi-language reason text
- Foundation for manager decision-making

### Verification Checklist
- [ ] reason field added as TextField
- [ ] reason field is required
- [ ] contact_during_leave field added as CharField
- [ ] contact_during_leave is optional
- [ ] Max length 200 for contact field
- [ ] help_text added for both fields
- [ ] clean() method validates reason length
- [ ] Whitespace trimming implemented
- [ ] Fields support Unicode (Sinhala, Tamil)

---

## Task 42: Add Request Status Field

### Overview
Add the status field to track the current state of the leave request through its lifecycle, along with a submitted_at timestamp to record when the request was officially submitted for approval. The status field drives the workflow and determines available actions.

### Dependencies
- Task 35: Define LeaveRequestStatus Choices
- Task 41: Add Request Reason Field

### Instructions

1. **Open leave_request.py file**
   - Continue in `apps/leave/models/leave_request.py`
   - Locate LeaveRequest model class

2. **Import status constants**
   - Ensure LEAVE_REQUEST_STATUS_CHOICES is imported
   - Verify LEAVE_REQUEST_STATUS_DRAFT constant available

3. **Add status field**
   - CharField with choices from LEAVE_REQUEST_STATUS_CHOICES
   - Max length: 20 characters
   - Default: LEAVE_REQUEST_STATUS_DRAFT
   - Required (no blank, no null)
   - Add db_index=True for query performance
   - Include help_text: "Current status of leave request"

4. **Add submitted_at field**
   - DateTimeField, optional (blank=True, null=True)
   - Records timestamp when status changed to PENDING
   - Include help_text: "Date and time when request was submitted"

5. **Update Meta class**
   - Add index on (tenant, status, submitted_at) for dashboard queries
   - Ensure ordering includes status for consistency

### Status Field Structure

```python
# Field structure (conceptual)
status = models.CharField(
    max_length=20,
    choices=LEAVE_REQUEST_STATUS_CHOICES,
    default=LEAVE_REQUEST_STATUS_DRAFT,
    db_index=True,
    help_text="Current status of leave request"
)

submitted_at = models.DateTimeField(
    blank=True,
    null=True,
    help_text="Date and time when request was submitted"
)
```

### Status Field Characteristics

| Property | Value | Reason |
|----------|-------|--------|
| Type | CharField | Status stored as string for readability |
| Max Length | 20 characters | Sufficient for status values |
| Choices | LEAVE_REQUEST_STATUS_CHOICES | Restricts to valid statuses |
| Default | DRAFT | New requests start as drafts |
| Indexed | Yes | Optimizes status-based queries |

### Status Workflow Timeline

```
┌─────────────────────────────────────────────────────────────┐
│                  Status Timeline Example                     │
└─────────────────────────────────────────────────────────────┘

Feb 1, 10:30 AM - created_at
├─ Status: DRAFT
├─ submitted_at: null
└─ Employee creates request, saves as draft

Feb 1, 11:45 AM - updated_at  
├─ Status: PENDING
├─ submitted_at: Feb 1, 11:45 AM ← Set when submitted
└─ Employee submits request for approval

Feb 2, 9:15 AM - updated_at
├─ Status: APPROVED
├─ approved_at: Feb 2, 9:15 AM
├─ approved_by: Manager (User ID: 45)
└─ Manager reviews and approves

[Leave period: Feb 14-18, 2026]
```

### Status-Based Query Patterns

#### Manager Dashboard: Pending Requests
```python
# Get all pending requests for manager to review
from django.utils import timezone

pending_requests = LeaveRequest.objects.filter(
    status=LEAVE_REQUEST_STATUS_PENDING,
    employee__reporting_manager=manager_user
).order_by('submitted_at')  # Oldest first
```

#### Employee View: My Requests
```python
# Get employee's own requests, all statuses
my_requests = LeaveRequest.objects.filter(
    employee=employee,
    tenant=current_tenant
).order_by('-submitted_at')  # Newest first
```

#### HR Reports: Approved Leaves This Month
```python
# Get all approved leaves for current month
from datetime import date

current_month_start = date.today().replace(day=1)
approved_leaves = LeaveRequest.objects.filter(
    status=LEAVE_REQUEST_STATUS_APPROVED,
    start_date__gte=current_month_start,
    start_date__month=date.today().month
)
```

#### Audit: Recently Submitted Requests
```python
# Get requests submitted in last 7 days
from datetime import timedelta

seven_days_ago = timezone.now() - timedelta(days=7)
recent_submissions = LeaveRequest.objects.filter(
    submitted_at__gte=seven_days_ago
).order_by('-submitted_at')
```

### Status Transition Rules

```
Valid Transitions (enforced in service layer):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

DRAFT → PENDING
  └─ Action: submit()
  └─ Set submitted_at = now()
  └─ Notify manager

PENDING → APPROVED
  └─ Action: approve()
  └─ Set approved_at = now()
  └─ Set approved_by = manager
  └─ Update balance

PENDING → REJECTED
  └─ Action: reject()
  └─ Set rejection_reason
  └─ Restore balance
  └─ Notify employee

PENDING → CANCELLED
  └─ Action: cancel()
  └─ Restore balance
  └─ Notify manager

APPROVED → RECALLED
  └─ Action: recall()
  └─ Condition: before start_date
  └─ Set recalled_at = now()
  └─ Restore balance

Invalid Transitions:
❌ APPROVED → PENDING
❌ REJECTED → APPROVED
❌ CANCELLED → PENDING
❌ Any status → DRAFT
```

### Status Display in UI

#### Employee Request List
```
┌──────────────────────────────────────────────────────────────┐
│ My Leave Requests                                            │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│ [🟢 APPROVED] Annual Leave - Feb 14-18, 2026 (5 days)       │
│ Submitted: Feb 1, 2026 | Approved: Feb 2, 2026              │
│                                                              │
│ [🟡 PENDING] Sick Leave - Mar 10, 2026 (1 day)              │
│ Submitted: Mar 8, 2026 | Awaiting approval                  │
│                                                              │
│ [⚪ DRAFT] Casual Leave - Apr 5, 2026 (1 day)               │
│ Created: Apr 1, 2026 | Not yet submitted                    │
│                                                              │
│ [🔴 REJECTED] Annual Leave - Jan 20-25, 2026                │
│ Reason: Insufficient staffing during peak period            │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

#### Manager Approval Dashboard
```
┌──────────────────────────────────────────────────────────────┐
│ Pending Leave Approvals (3)                                  │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│ Kasun Perera - Annual Leave                                 │
│ Feb 14-18, 2026 (5 days)                                     │
│ Submitted: Feb 1, 11:45 AM (2 hours ago)                    │
│ [ View ] [ Approve ] [ Reject ]                              │
│                                                              │
│ Nimal Silva - Sick Leave                                    │
│ Feb 10, 2026 (1 day)                                         │
│ Submitted: Feb 9, 4:30 PM (1 day ago)                       │
│ [ View ] [ Approve ] [ Reject ]                              │
│                                                              │
│ Saman Fernando - Casual Leave                               │
│ Feb 12, 2026 (Half day - Afternoon)                         │
│ Submitted: Feb 10, 9:00 AM (2 days ago)                     │
│ [ View ] [ Approve ] [ Reject ]                              │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### Status-Based Dashboard Widgets

```
┌────────────────────┐  ┌────────────────────┐  ┌────────────────────┐
│ Pending Approvals  │  │ Approved (This Mo) │  │ Draft Requests     │
│                    │  │                    │  │                    │
│       12           │  │       45           │  │        3           │
│                    │  │                    │  │                    │
│ [View All]         │  │ [View All]         │  │ [View All]         │
└────────────────────┘  └────────────────────┘  └────────────────────┘
```

### submitted_at Usage

| Query Type | Purpose | Example |
|------------|---------|---------|
| Submission timeline | Track when requests submitted | Order by submitted_at |
| SLA monitoring | Check approval turnaround time | approved_at - submitted_at |
| Audit trail | Compliance reporting | List all submissions in period |
| Manager workload | Requests pending > 24 hours | submitted_at < now() - 24h |

### Expected Outcome
- status field tracks request lifecycle state
- submitted_at timestamp records submission time
- Indexed status field optimizes queries
- Foundation for workflow implementation
- Support for status-based filtering and reporting

### Verification Checklist
- [ ] status field added as CharField
- [ ] Status choices from constants imported
- [ ] Default status is DRAFT
- [ ] status field is indexed (db_index=True)
- [ ] submitted_at field added as DateTimeField
- [ ] submitted_at is optional (null=True, blank=True)
- [ ] help_text added for both fields
- [ ] Meta class includes status in indexes
- [ ] Status enables workflow transitions

---

## Task 43: Add Approval Fields

### Overview
Add fields to track the approval workflow metadata, including who approved or rejected the request, when the decision was made, reasons for rejection, and recall information. These fields provide a complete audit trail of the leave request lifecycle.

### Dependencies
- Task 42: Add Request Status Field
- User model exists (for approved_by relationship)

### Instructions

1. **Open leave_request.py file**
   - Continue in `apps/leave/models/leave_request.py`
   - Locate LeaveRequest model class

2. **Import User model**
   - Import Django's User model or custom user model
   - Typically from django.contrib.auth import get_user_model

3. **Add approved_by field**
   - ForeignKey to User model
   - Optional (blank=True, null=True)
   - Set on_delete=models.SET_NULL (preserve record if user deleted)
   - Set related_name='approved_leave_requests'
   - Include help_text: "Manager who approved this request"

4. **Add approved_at field**
   - DateTimeField, optional (blank=True, null=True)
   - Records timestamp of approval decision
   - Include help_text: "Date and time when request was approved"

5. **Add rejection_reason field**
   - TextField, optional (blank=True, null=True)
   - Stores manager's reason for rejection
   - Include help_text: "Reason for rejection (if rejected)"

6. **Add recalled_at field**
   - DateTimeField, optional (blank=True, null=True)
   - Records timestamp when employee recalled approved leave
   - Include help_text: "Date and time when request was recalled"

7. **Add recalled_reason field**
   - TextField, optional (blank=True, null=True)
   - Stores employee's reason for recalling leave
   - Include help_text: "Reason for recalling approved leave"

8. **Update Meta indexes**
   - Add index on (tenant, approved_by) for manager reports
   - Supports queries like "all leaves approved by manager X"

### Approval Fields Structure

```python
# Import User model
User = get_user_model()

# Approval fields (conceptual)
approved_by = models.ForeignKey(
    User,
    on_delete=models.SET_NULL,
    null=True,
    blank=True,
    related_name='approved_leave_requests',
    help_text="Manager who approved this request"
)

approved_at = models.DateTimeField(
    blank=True,
    null=True,
    help_text="Date and time when request was approved"
)

rejection_reason = models.TextField(
    blank=True,
    null=True,
    help_text="Reason for rejection (if rejected)"
)

recalled_at = models.DateTimeField(
    blank=True,
    null=True,
    help_text="Date and time when request was recalled"
)

recalled_reason = models.TextField(
    blank=True,
    null=True,
    help_text="Reason for recalling approved leave"
)
```

### Approval Field Usage by Status

| Status | approved_by | approved_at | rejection_reason | recalled_at | recalled_reason |
|--------|-------------|-------------|------------------|-------------|-----------------|
| DRAFT | null | null | null | null | null |
| PENDING | null | null | null | null | null |
| APPROVED | User | DateTime | null | null | null |
| REJECTED | User (rejecter) | null | Text | null | null |
| CANCELLED | null | null | null | null | null |
| RECALLED | User (original approver) | DateTime | null | DateTime | Text |

### Approval Workflow Example

```
┌─────────────────────────────────────────────────────────────┐
│                    Approval Workflow                         │
└─────────────────────────────────────────────────────────────┘

Request: Kasun Perera - Annual Leave (Feb 14-18, 2026)

Step 1: Draft Creation (Feb 1, 10:30 AM)
├─ status: DRAFT
├─ approved_by: null
├─ approved_at: null
├─ rejection_reason: null
└─ All approval fields empty

Step 2: Submission (Feb 1, 11:45 AM)
├─ status: PENDING
├─ submitted_at: Feb 1, 11:45 AM
└─ Still no approval data

Step 3: Manager Approval (Feb 2, 9:15 AM)
├─ status: APPROVED
├─ approved_by: User(id=45, name="Nimal Silva")
├─ approved_at: Feb 2, 9:15 AM
└─ Leave granted, balance deducted

Step 4: Employee Recall (Feb 8, 2:30 PM)
├─ status: RECALLED
├─ recalled_at: Feb 8, 2:30 PM
├─ recalled_reason: "Family plans changed, no longer need leave"
└─ Balance restored, manager notified
```

### Rejection Workflow Example

```
Request: Saman Fernando - Annual Leave (Jan 20-25, 2026)

Step 1-2: Draft and Submission (Jan 10)
├─ Status progresses to PENDING
└─ Awaiting manager review

Step 3: Manager Rejection (Jan 12, 3:45 PM)
├─ status: REJECTED
├─ approved_by: null (not used for rejection)
├─ rejection_reason: "Insufficient staffing during peak sales period. 
│   Please request alternative dates after January 25."
└─ Employee notified with reason
```

### Approval Audit Trail

```
┌──────────────────────────────────────────────────────────────┐
│ Leave Request Audit Trail                                    │
├──────────────────────────────────────────────────────────────┤
│ Request ID: LR-2026-001234                                   │
│ Employee: Kasun Perera                                       │
│ Leave Type: Annual Leave                                     │
│ Period: Feb 14-18, 2026 (5 days)                             │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│ ⏱ Created                                                    │
│   Feb 1, 2026 10:30 AM                                       │
│   Status: DRAFT                                              │
│                                                              │
│ ⏱ Submitted                                                  │
│   Feb 1, 2026 11:45 AM                                       │
│   Status: PENDING → Awaiting approval                        │
│   Notified: Nimal Silva (Manager)                           │
│                                                              │
│ ⏱ Approved                                                   │
│   Feb 2, 2026 9:15 AM                                        │
│   Status: APPROVED                                           │
│   Approved By: Nimal Silva                                   │
│   Balance: 15.0 days → 10.0 days remaining                   │
│                                                              │
│ ⏱ Recalled                                                   │
│   Feb 8, 2026 2:30 PM                                        │
│   Status: RECALLED                                           │
│   Recalled Reason: "Family plans changed, no longer need    │
│                     leave"                                   │
│   Balance: 10.0 days → 15.0 days restored                    │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### Manager Dashboard Approval View

```
┌──────────────────────────────────────────────────────────────┐
│ Leave Request - Review                                       │
├──────────────────────────────────────────────────────────────┤
│ Employee: Kasun Perera                                       │
│ Department: Sales                                            │
│ Leave Type: Annual Leave                                     │
│ Dates: Feb 14-18, 2026 (5 working days)                      │
│ Submitted: Feb 1, 2026 11:45 AM                              │
│                                                              │
│ Reason:                                                      │
│ Family vacation to Nuwara Eliya. Will be staying at         │
│ Hilltop Hotel. Contact: +94 77 123 4567                     │
│                                                              │
│ Balance Check:                                               │
│ ✓ Available: 15.0 days                                       │
│ ✓ Requested: 5.0 days                                        │
│ ✓ Remaining after approval: 10.0 days                        │
│                                                              │
│ Overlap Check:                                               │
│ ⚠ Team members also on leave:                                │
│   • Nimal Silva: Feb 17-18 (2 days overlap)                 │
│                                                              │
│ ┌────────────────────────────────────────────────────────┐  │
│ │ [✓ Approve]                                            │  │
│ │                                                        │  │
│ │ [✗ Reject]                                             │  │
│ │ Rejection Reason:                                      │  │
│ │ ┌────────────────────────────────────────────────────┐│  │
│ │ │                                                    ││  │
│ │ └────────────────────────────────────────────────────┘│  │
│ └────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
```

### Rejection Reason Guidelines

#### Good Rejection Reasons
```
✓ "Insufficient staffing during peak sales period. Please request 
   alternative dates after January 25."

✓ "Annual leave balance insufficient (requested 7 days, available 
   5 days). Please adjust request or apply for no-pay leave."

✓ "Overlaps with critical project deadline (Feb 15). Can you 
   reschedule to week after?"

✓ "Department meeting scheduled Feb 14-15, your presence required. 
   Can you take leave Feb 17-21 instead?"
```

#### Poor Rejection Reasons
```
✗ "No" → Not helpful
✗ "Rejected" → No explanation
✗ "Cannot approve" → Doesn't explain why
```

### Recall Reason Examples

```
Employee-initiated Recalls:

✓ "Family emergency resolved, no longer need leave"
✓ "Travel plans cancelled due to weather conditions"
✓ "Personal situation changed, prefer to reschedule"
✓ "Realized conflict with important work deadline"
```

### Manager Approval Analytics

```python
# Most approving manager
top_approver = User.objects.annotate(
    approval_count=Count('approved_leave_requests')
).order_by('-approval_count').first()

# Average approval turnaround time
from django.db.models import Avg, F

avg_turnaround = LeaveRequest.objects.filter(
    status=LEAVE_REQUEST_STATUS_APPROVED
).annotate(
    turnaround=F('approved_at') - F('submitted_at')
).aggregate(
    avg_turnaround=Avg('turnaround')
)

# Rejection rate by manager
rejection_rate = LeaveRequest.objects.filter(
    approved_by=manager,
    status=LEAVE_REQUEST_STATUS_REJECTED
).count() / LeaveRequest.objects.filter(
    approved_by=manager,
    status__in=['approved', 'rejected']
).count()
```

### Expected Outcome
- approved_by field links to approving manager
- approved_at timestamp records approval time
- rejection_reason captures manager's explanation
- recalled_at and recalled_reason track recalls
- Complete audit trail for leave requests
- Support for approval analytics

### Verification Checklist
- [ ] User model imported
- [ ] approved_by field added as ForeignKey to User
- [ ] on_delete=SET_NULL configured
- [ ] related_name='approved_leave_requests' set
- [ ] approved_at field added as DateTimeField
- [ ] rejection_reason field added as TextField
- [ ] recalled_at field added as DateTimeField
- [ ] recalled_reason field added as TextField
- [ ] All approval fields are optional
- [ ] help_text added for all fields
- [ ] Meta index includes approved_by

---

## Task 44: Add Document Attachment

### Overview
Add file attachment support to the LeaveRequest model, allowing employees to upload supporting documents such as medical certificates, invitation letters, or other evidence to justify their leave request. This is particularly important for sick leave and other leave types that may require documentation.

### Dependencies
- Task 43: Add Approval Fields

### Instructions

1. **Open leave_request.py file**
   - Continue in `apps/leave/models/leave_request.py`
   - Locate LeaveRequest model class

2. **Import file utilities**
   - Import necessary file validation utilities
   - Import file extension validators from Django

3. **Define upload path function**
   - Create function `leave_request_attachment_path(instance, filename)`
   - Generate tenant-specific upload path
   - Format: `tenants/{tenant_id}/leave_docs/{year}/{request_id}/{filename}`
   - Organize by year for easier management

4. **Add attachment field**
   - FileField with upload_to=leave_request_attachment_path
   - Optional (blank=True, null=True)
   - Add max_length=500 for file path
   - Include help_text: "Supporting document (PDF, JPG, PNG, max 5MB)"

5. **Add file validation**
   - Validate file extensions: .pdf, .jpg, .jpeg, .png
   - Validate file size: maximum 5MB
   - Add validators list to field

6. **Create file validator functions**
   - Create `validate_file_size(file)` function
   - Create `validate_file_extension(file)` function
   - Raise ValidationError for invalid files

7. **Add attachment information methods**
   - Add property `has_attachment` (returns True if attachment exists)
   - Add method `get_attachment_filename()` (returns friendly filename)

### Attachment Field Structure

```python
# Upload path function (conceptual)
def leave_request_attachment_path(instance, filename):
    """
    Generate upload path for leave request attachments.
    Path: tenants/{tenant_id}/leave_docs/{year}/{request_id}/{filename}
    """
    year = instance.start_date.year if instance.start_date else timezone.now().year
    tenant_id = instance.tenant.id
    return f'tenants/{tenant_id}/leave_docs/{year}/{instance.id}/{filename}'

# File validators (conceptual)
def validate_file_size(file):
    """Validate file size is under 5MB"""
    max_size_mb = 5
    if file.size > max_size_mb * 1024 * 1024:
        raise ValidationError(f'File size must be under {max_size_mb}MB')

def validate_file_extension(file):
    """Validate file has allowed extension"""
    allowed_extensions = ['.pdf', '.jpg', '.jpeg', '.png']
    ext = os.path.splitext(file.name)[1].lower()
    if ext not in allowed_extensions:
        raise ValidationError(
            f'File type not allowed. Allowed: {", ".join(allowed_extensions)}'
        )

# Field (conceptual)
attachment = models.FileField(
    upload_to=leave_request_attachment_path,
    blank=True,
    null=True,
    max_length=500,
    validators=[validate_file_size, validate_file_extension],
    help_text="Supporting document (PDF, JPG, PNG, max 5MB)"
)
```

### File Upload Specifications

| Property | Value | Reason |
|----------|-------|--------|
| Allowed formats | PDF, JPG, JPEG, PNG | Common document and image types |
| Max file size | 5 MB | Balance between quality and storage |
| Upload path | Tenant-specific | Multi-tenant data isolation |
| Organization | By year and request ID | Easy file management |
| Required | No | Not all leaves need documentation |

### Upload Path Structure

```
media/
└── tenants/
    └── {tenant_id}/
        └── leave_docs/
            └── {year}/
                └── {request_id}/
                    ├── medical_certificate.pdf
                    ├── invitation_letter.jpg
                    └── proof_document.png

Example:
media/tenants/123/leave_docs/2026/45678/medical_certificate.pdf
      ─────┬──── ────┬──── ─────────┬───── ──┬── ───────────┬─────────
      Tenant  Leave     Year     Request    Filename
              docs                  ID
```

### File Type Use Cases

| File Type | Use Case | Example |
|-----------|----------|---------|
| PDF | Medical certificates, official letters | doctor_note.pdf |
| JPG/JPEG | Photos of documents, invitations | wedding_invitation.jpg |
| PNG | Screenshots, digital documents | hospital_appointment.png |

### Attachment Requirements by Leave Type

#### Sick Leave (Medical Certificate Required)
```
Leave Type: Sick Leave
Days: 3+ consecutive days
Attachment: Required (medical certificate)

Example Upload:
- File: medical_certificate.pdf
- Size: 1.2 MB
- Content: Doctor's certificate stating illness and rest period
- Uploaded: At time of submission or within 24 hours
```

#### Annual Leave (Usually No Attachment)
```
Leave Type: Annual Leave
Days: 5 days
Attachment: Optional

Example: No attachment typically needed for annual leave
```

#### Maternity Leave (Medical Certificate Required)
```
Leave Type: Maternity Leave
Days: 84 days (12 weeks)
Attachment: Required (medical certificate confirming pregnancy)

Example Upload:
- File: maternity_certificate.pdf
- Size: 850 KB
- Content: Doctor's certificate with expected delivery date
- Uploaded: With initial request
```

#### Emergency Leave (Supporting Evidence)
```
Leave Type: Emergency Leave
Days: 2 days
Attachment: Optional but recommended

Example Upload:
- File: hospital_admission_notice.jpg
- Size: 2.3 MB
- Content: Family member's hospital admission notice
- Uploaded: After emergency resolved
```

### File Upload UI

```
┌──────────────────────────────────────────────────────────────┐
│ Leave Request Form                                           │
├──────────────────────────────────────────────────────────────┤
│ ... (other fields) ...                                       │
│                                                              │
│ Supporting Document: (Optional)                              │
│ ┌────────────────────────────────────────────────────────┐  │
│ │ [ Choose File ] No file chosen                         │  │
│ └────────────────────────────────────────────────────────┘  │
│ Allowed: PDF, JPG, PNG | Max size: 5MB                      │
│                                                              │
│ 💡 Tip: Medical certificate required for sick leave >3 days │
│                                                              │
│ [ Submit Request ]                                           │
└──────────────────────────────────────────────────────────────┘

After Upload:
┌──────────────────────────────────────────────────────────────┐
│ Supporting Document:                                         │
│ ┌────────────────────────────────────────────────────────┐  │
│ │ ✓ medical_certificate.pdf (1.2 MB)                     │  │
│ │ [ View ] [ Remove ] [ Replace ]                        │  │
│ └────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
```

### Manager Review with Attachment

```
┌──────────────────────────────────────────────────────────────┐
│ Leave Request - Pending Approval                             │
├──────────────────────────────────────────────────────────────┤
│ Employee: Kasun Perera                                       │
│ Leave Type: Sick Leave                                       │
│ Dates: Feb 10-12, 2026 (3 days)                              │
│ Status: PENDING                                              │
│                                                              │
│ Reason:                                                      │
│ Fever and flu symptoms. Doctor advised 3 days rest.         │
│                                                              │
│ Supporting Document:                                         │
│ 📄 medical_certificate.pdf (1.2 MB)                          │
│ [ 👁 View Document ] [ ⬇ Download ]                          │
│                                                              │
│ [ Approve ] [ Reject ]                                       │
└──────────────────────────────────────────────────────────────┘
```

### File Validation Examples

#### Valid Files
```
✓ medical_cert.pdf (1.2 MB)
  └─ PDF format, under 5MB

✓ invitation.jpg (800 KB)
  └─ JPEG format, reasonable size

✓ appointment_slip.png (450 KB)
  └─ PNG format, small size

✓ doctor_note_scan.jpeg (3.1 MB)
  └─ JPEG format, within limit
```

#### Invalid Files
```
✗ document.doc (1.5 MB)
  └─ Error: "File type not allowed. Allowed: .pdf, .jpg, .jpeg, .png"

✗ large_scan.pdf (8.2 MB)
  └─ Error: "File size must be under 5MB"

✗ certificate.docx (500 KB)
  └─ Error: "File type not allowed"

✗ image.bmp (2.1 MB)
  └─ Error: "File type not allowed"
```

### Security Considerations

```
File Security Measures:
✓ Tenant isolation - Files stored in tenant-specific folders
✓ Extension validation - Only allowed file types accepted
✓ Size validation - Prevent large file uploads (DoS protection)
✓ Filename sanitization - Remove special characters
✓ Access control - Only employee, manager, HR can view
✗ No executable files - .exe, .sh, .bat not allowed
```

### Helper Methods

```python
# Conceptual helper methods

@property
def has_attachment(self):
    """Check if request has an attachment"""
    return bool(self.attachment)

def get_attachment_filename(self):
    """Get friendly filename for display"""
    if self.has_attachment:
        return os.path.basename(self.attachment.name)
    return None

def get_attachment_size_display(self):
    """Get human-readable file size"""
    if self.has_attachment:
        size_bytes = self.attachment.size
        if size_bytes < 1024:
            return f"{size_bytes} bytes"
        elif size_bytes < 1024 * 1024:
            return f"{size_bytes / 1024:.1f} KB"
        else:
            return f"{size_bytes / (1024 * 1024):.1f} MB"
    return None
```

### Expected Outcome
- attachment field supports document uploads
- File validation ensures appropriate file types and sizes
- Tenant-specific upload paths maintain data isolation
- Supporting documents aid manager decision-making
- Compliance support for leave policies requiring documentation

### Verification Checklist
- [ ] leave_request_attachment_path function created
- [ ] Function generates tenant-specific path
- [ ] Path organizes by year and request ID
- [ ] validate_file_size function implemented
- [ ] validate_file_extension function implemented
- [ ] attachment field added as FileField
- [ ] Field includes validators list
- [ ] Field is optional (blank=True, null=True)
- [ ] Max file size is 5MB
- [ ] Allowed extensions: PDF, JPG, JPEG, PNG
- [ ] has_attachment property added
- [ ] get_attachment_filename method added
- [ ] help_text includes file requirements

---

## Task 45: Run LeaveRequest Migrations

### Overview
Generate and apply Django database migrations for the LeaveRequest model. This task creates the database table with all fields defined in previous tasks, establishes foreign key relationships, and creates indexes for optimal query performance.

### Dependencies
- Tasks 36-44: All LeaveRequest model fields defined
- Database connection configured
- Django project properly set up

### Instructions

1. **Verify model completeness**
   - Review leave_request.py file
   - Ensure all fields from Tasks 36-44 are present
   - Check imports are correct
   - Verify Meta class configuration

2. **Generate migration file**
   - Open terminal in project root
   - Run command: `python manage.py makemigrations leave`
   - Review generated migration file
   - Verify migration includes all fields

3. **Review migration file**
   - Open generated migration file in `apps/leave/migrations/`
   - Expected filename: `0004_leave_request.py` (or next sequential number)
   - Check all fields are included
   - Verify indexes and constraints

4. **Apply migration**
   - Run command: `python manage.py migrate leave`
   - Confirm migration applies successfully
   - Check for any errors or warnings

5. **Verify database table**
   - Inspect database schema
   - Confirm `leave_leaverequest` table exists
   - Verify all columns created
   - Check foreign key constraints
   - Verify indexes exist

6. **Test model functionality**
   - Open Django shell: `python manage.py shell`
   - Import LeaveRequest model
   - Test basic queries
   - Create test instance (in development only)
   - Verify tenant filtering works

### Migration Generation Command

```bash
# Generate migration
python manage.py makemigrations leave

Expected Output:
Migrations for 'leave':
  apps/leave/migrations/0004_leave_request.py
    - Create model LeaveRequest
```

### Migration File Structure

```python
# Expected migration file structure (conceptual)
# apps/leave/migrations/0004_leave_request.py

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import apps.leave.models.leave_request

class Migration(migrations.Migration):

    dependencies = [
        ('leave', '0003_leave_balance'),  # Previous migration
        ('employee', '0001_initial'),     # Employee model dependency
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='LeaveRequest',
            fields=[
                ('id', models.BigAutoField(...)),
                # ... all fields ...
                ('employee', models.ForeignKey(...)),
                ('leave_type', models.ForeignKey(...)),
                ('approved_by', models.ForeignKey(...)),
            ],
            options={
                'verbose_name': 'Leave Request',
                'verbose_name_plural': 'Leave Requests',
                'ordering': ['-created_at'],
                'indexes': [
                    # Index definitions
                ],
            },
        ),
    ]
```

### Apply Migration Command

```bash
# Apply migration
python manage.py migrate leave

Expected Output:
Operations to perform:
  Apply all migrations: leave
Running migrations:
  Applying leave.0004_leave_request... OK
```

### Database Table Schema

```sql
-- Conceptual table structure
CREATE TABLE leave_leaverequest (
    -- Primary Key
    id BIGSERIAL PRIMARY KEY,
    
    -- Foreign Keys
    tenant_id BIGINT NOT NULL REFERENCES core_tenant(id),
    employee_id BIGINT NOT NULL REFERENCES employee_employee(id),
    leave_type_id BIGINT NOT NULL REFERENCES leave_leavetype(id),
    approved_by_id BIGINT REFERENCES auth_user(id) ON DELETE SET NULL,
    
    -- Date Fields
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_days NUMERIC(5,2) NOT NULL DEFAULT 0,
    
    -- Half Day Fields
    is_half_day BOOLEAN NOT NULL DEFAULT FALSE,
    half_day_type VARCHAR(20),
    
    -- Request Details
    reason TEXT NOT NULL,
    contact_during_leave VARCHAR(200),
    
    -- Status and Workflow
    status VARCHAR(20) NOT NULL DEFAULT 'draft',
    submitted_at TIMESTAMP WITH TIME ZONE,
    
    -- Approval Metadata
    approved_at TIMESTAMP WITH TIME ZONE,
    rejection_reason TEXT,
    recalled_at TIMESTAMP WITH TIME ZONE,
    recalled_reason TEXT,
    
    -- Attachment
    attachment VARCHAR(500),
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL,
    
    -- Indexes
    CONSTRAINT leave_leaverequest_tenant_fk FOREIGN KEY (tenant_id),
    CONSTRAINT leave_leaverequest_employee_fk FOREIGN KEY (employee_id),
    CONSTRAINT leave_leaverequest_leave_type_fk FOREIGN KEY (leave_type_id),
    CONSTRAINT leave_leaverequest_approved_by_fk FOREIGN KEY (approved_by_id)
);

-- Index creation
CREATE INDEX idx_leave_request_tenant_emp_status 
    ON leave_leaverequest (tenant_id, employee_id, status);

CREATE INDEX idx_leave_request_tenant_status_date 
    ON leave_leaverequest (tenant_id, status, start_date);

CREATE INDEX idx_leave_request_tenant_approver 
    ON leave_leaverequest (tenant_id, approved_by_id);

CREATE INDEX idx_leave_request_status 
    ON leave_leaverequest (status);
```

### Verification Queries

```bash
# Open Django shell
python manage.py shell

# Test queries
>>> from apps.leave.models import LeaveRequest
>>> from apps.employee.models import Employee
>>> from apps.leave.models import LeaveType

# Check model loaded
>>> LeaveRequest
<class 'apps.leave.models.leave_request.LeaveRequest'>

# Check fields
>>> LeaveRequest._meta.get_fields()
# Should list all fields

# Test query (should return empty queryset initially)
>>> LeaveRequest.objects.all()
<QuerySet []>

# Count (should be 0 initially)
>>> LeaveRequest.objects.count()
0
```

### Database Inspection Commands

```bash
# PostgreSQL - List table columns
\d+ leave_leaverequest

# PostgreSQL - List indexes
\di leave_*

# PostgreSQL - Check foreign keys
SELECT conname, conrelid::regclass, confrelid::regclass
FROM pg_constraint
WHERE conrelid = 'leave_leaverequest'::regclass;
```

### Common Migration Issues and Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| Migration fails: Employee not found | Employee model migration not run | Run employee app migrations first |
| Migration fails: LeaveType not found | LeaveType model not migrated | Check Group B migrations applied |
| Circular dependency | Models reference each other | Review migration dependencies |
| Index creation fails | Index name too long | Shorten index name in Meta class |

### Migration Rollback (If Needed)

```bash
# Rollback to previous migration
python manage.py migrate leave 0003

# Re-run latest migration
python manage.py migrate leave
```

### Expected Outcome
- Migration file generated successfully
- Database table `leave_leaverequest` created
- All fields present with correct types
- Foreign key relationships established
- Indexes created for performance
- Model ready for use in application

### Verification Checklist
- [ ] Migration file generated with makemigrations
- [ ] Migration file reviewed and correct
- [ ] Migration applied with migrate command
- [ ] No migration errors or warnings
- [ ] Database table exists
- [ ] All columns present in database
- [ ] Foreign key constraints created
- [ ] Indexes created successfully
- [ ] Model imports in Django shell
- [ ] Basic queries work
- [ ] Tenant filtering functions correctly

---

## Summary

This document established the LeaveRequest model infrastructure:

### Completed Components
- ✅ LeaveRequestStatus choices (DRAFT, PENDING, APPROVED, REJECTED, CANCELLED, RECALLED)
- ✅ Core LeaveRequest model with tenant awareness
- ✅ Employee foreign key relationship
- ✅ LeaveType foreign key relationship
- ✅ Date fields (start_date, end_date, total_days)
- ✅ Half-day support (is_half_day, half_day_type)
- ✅ Request details (reason, contact_during_leave)
- ✅ Status tracking (status, submitted_at)
- ✅ Approval metadata (approved_by, approved_at, rejection_reason, recall fields)
- ✅ Document attachment support
- ✅ Database migrations applied

### Key Achievements
1. **Comprehensive Status Management** - Six-state workflow covering all leave scenarios
2. **Flexible Date Handling** - Full-day and half-day support with working day calculations
3. **Complete Audit Trail** - Tracks who, when, and why for all workflow transitions
4. **Document Support** - File uploads for medical certificates and supporting evidence
5. **Performance Optimized** - Strategic indexes for common query patterns
6. **Sri Lankan Context** - Weekend and public holiday awareness, Unicode support

### Next Steps
Proceed to [02_Tasks-46-52_Request-Service-Workflow.md](02_Tasks-46-52_Request-Service-Workflow.md) to implement the LeaveRequestService with submission, validation, approval, rejection, and recall workflows.

---

**Document Status:** ✅ Complete  
**Total Tasks:** 11  
**Total Lines:** ~1380
