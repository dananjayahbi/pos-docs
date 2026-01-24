# Tasks 46-52: LeaveRequest Service and Workflow

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 04 - Leave Management  
> **Group:** C - LeaveRequest Workflow  
> **Document:** 02 of 02  
> **Tasks Covered:** 46, 47, 48, 49, 50, 51, 52

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-35-45_Request-Model.md](01_Tasks-35-45_Request-Model.md)

---

## Document Overview

This document covers the implementation of the LeaveRequestService, which provides business logic for leave request operations including submission, balance validation, overlap detection, approval workflow, rejection handling, and recall functionality. The service layer enforces business rules and manages the leave request lifecycle.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 46 | Create LeaveRequestService | High | 35 min |
| 47 | Implement Submit Request | High | 30 min |
| 48 | Implement Balance Validation | Medium | 25 min |
| 49 | Implement Overlap Detection | Medium | 25 min |
| 50 | Implement Approval Workflow | High | 35 min |
| 51 | Implement Rejection Workflow | Medium | 20 min |
| 52 | Implement Cancel/Recall | High | 30 min |

---

## Task 46: Create LeaveRequestService

### Overview
Create the LeaveRequestService class that serves as the central business logic layer for leave request operations. This service provides methods for creating, submitting, approving, rejecting, cancelling, and recalling leave requests, while enforcing business rules and maintaining data integrity.

### Dependencies
- LeaveRequest model exists (Tasks 35-45)
- LeaveBalance model exists (from Group B)
- Employee model exists
- LeaveType model exists

### Instructions

1. **Create services directory structure**
   - Navigate to `apps/leave/` directory
   - Create `services/` subdirectory if it doesn't exist
   - Create `__init__.py` in services directory

2. **Create request_service.py file**
   - Create file at `apps/leave/services/request_service.py`
   - Import necessary modules

3. **Import required components**
   - Import Django transaction utilities
   - Import Django timezone utilities
   - Import ValidationError from django.core.exceptions
   - Import LeaveRequest, LeaveBalance, Employee, LeaveType models
   - Import leave request status constants
   - Import notification utilities (if available)

4. **Define LeaveRequestService class**
   - Create class LeaveRequestService
   - Add comprehensive docstring explaining service purpose
   - Document all methods and their parameters

5. **Add create_draft method**
   - Method signature: `create_draft(tenant, employee_id, leave_type_id, data)`
   - Create new leave request in DRAFT status
   - Validate employee and leave type exist
   - Set initial field values from data dict
   - Return created LeaveRequest instance

6. **Add get_request method**
   - Method signature: `get_request(request_id, tenant=None)`
   - Retrieve leave request by ID
   - Optionally filter by tenant for security
   - Raise exception if not found
   - Return LeaveRequest instance

7. **Add get_employee_requests method**
   - Method signature: `get_employee_requests(employee_id, status=None, year=None)`
   - Retrieve employee's leave requests
   - Optional status filter
   - Optional year filter
   - Order by created_at descending
   - Return QuerySet

8. **Add get_pending_for_manager method**
   - Method signature: `get_pending_for_manager(manager_id)`
   - Retrieve pending requests for manager's team
   - Filter by employee's reporting_manager
   - Filter by status PENDING
   - Order by submitted_at ascending (oldest first)
   - Return QuerySet

9. **Update services/__init__.py**
   - Import LeaveRequestService
   - Add to __all__ list for package exports

### LeaveRequestService Structure

```python
# Service class structure (conceptual)

from django.db import transaction
from django.utils import timezone
from django.core.exceptions import ValidationError
from apps.leave.models import LeaveRequest, LeaveBalance
from apps.employee.models import Employee
from apps.leave.models import LeaveType
from apps.leave.constants import (
    LEAVE_REQUEST_STATUS_DRAFT,
    LEAVE_REQUEST_STATUS_PENDING,
    LEAVE_REQUEST_STATUS_APPROVED,
    LEAVE_REQUEST_STATUS_REJECTED,
    LEAVE_REQUEST_STATUS_CANCELLED,
    LEAVE_REQUEST_STATUS_RECALLED,
)

class LeaveRequestService:
    """
    Service for managing leave request operations.
    
    Provides methods for:
    - Creating draft requests
    - Submitting requests for approval
    - Validating leave balance
    - Detecting overlapping requests
    - Approving requests
    - Rejecting requests
    - Cancelling requests
    - Recalling approved requests
    
    All methods enforce business rules and maintain data integrity.
    """
    
    @staticmethod
    def create_draft(tenant, employee_id, leave_type_id, data):
        """Create a new draft leave request"""
        pass  # Implementation in this task
    
    @staticmethod
    def get_request(request_id, tenant=None):
        """Retrieve leave request by ID"""
        pass  # Implementation in this task
    
    @staticmethod
    def get_employee_requests(employee_id, status=None, year=None):
        """Get employee's leave requests with optional filters"""
        pass  # Implementation in this task
    
    @staticmethod
    def get_pending_for_manager(manager_id):
        """Get pending requests for manager's approval"""
        pass  # Implementation in this task
    
    # Methods for subsequent tasks
    @staticmethod
    def submit(request_id, user):
        """Submit request for approval"""
        pass  # Task 47
    
    @staticmethod
    def validate_balance(request):
        """Validate leave balance availability"""
        pass  # Task 48
    
    @staticmethod
    def check_overlap(request):
        """Check for overlapping leave requests"""
        pass  # Task 49
    
    @staticmethod
    @transaction.atomic
    def approve(request_id, approved_by, notes=None):
        """Approve leave request"""
        pass  # Task 50
    
    @staticmethod
    @transaction.atomic
    def reject(request_id, rejected_by, reason):
        """Reject leave request"""
        pass  # Task 51
    
    @staticmethod
    @transaction.atomic
    def cancel(request_id, user):
        """Cancel leave request"""
        pass  # Task 52
    
    @staticmethod
    @transaction.atomic
    def recall(request_id, user, reason):
        """Recall approved leave request"""
        pass  # Task 52
```

### create_draft Method Implementation

```python
# Conceptual implementation
@staticmethod
def create_draft(tenant, employee_id, leave_type_id, data):
    """
    Create a new draft leave request.
    
    Args:
        tenant: Tenant instance
        employee_id: Employee ID
        leave_type_id: LeaveType ID
        data: Dict with request details (start_date, end_date, reason, etc.)
    
    Returns:
        LeaveRequest instance
    
    Raises:
        ValidationError: If employee or leave type not found
    """
    # Validate employee exists
    try:
        employee = Employee.objects.get(id=employee_id, tenant=tenant)
    except Employee.DoesNotExist:
        raise ValidationError(f"Employee with ID {employee_id} not found")
    
    # Validate leave type exists
    try:
        leave_type = LeaveType.objects.get(id=leave_type_id, tenant=tenant)
    except LeaveType.DoesNotExist:
        raise ValidationError(f"Leave type with ID {leave_type_id} not found")
    
    # Create draft request
    request = LeaveRequest(
        tenant=tenant,
        employee=employee,
        leave_type=leave_type,
        start_date=data.get('start_date'),
        end_date=data.get('end_date'),
        is_half_day=data.get('is_half_day', False),
        half_day_type=data.get('half_day_type'),
        reason=data.get('reason', ''),
        contact_during_leave=data.get('contact_during_leave'),
        status=LEAVE_REQUEST_STATUS_DRAFT,
    )
    
    # Model's clean() will calculate total_days
    request.full_clean()
    request.save()
    
    return request
```

### get_request Method Implementation

```python
# Conceptual implementation
@staticmethod
def get_request(request_id, tenant=None):
    """
    Retrieve leave request by ID.
    
    Args:
        request_id: LeaveRequest ID
        tenant: Optional tenant for security filtering
    
    Returns:
        LeaveRequest instance
    
    Raises:
        ValidationError: If request not found
    """
    filters = {'id': request_id}
    if tenant:
        filters['tenant'] = tenant
    
    try:
        return LeaveRequest.objects.select_related(
            'employee',
            'leave_type',
            'approved_by'
        ).get(**filters)
    except LeaveRequest.DoesNotExist:
        raise ValidationError(f"Leave request with ID {request_id} not found")
```

### get_employee_requests Method Implementation

```python
# Conceptual implementation
@staticmethod
def get_employee_requests(employee_id, status=None, year=None):
    """
    Get employee's leave requests with optional filters.
    
    Args:
        employee_id: Employee ID
        status: Optional status filter
        year: Optional year filter
    
    Returns:
        QuerySet of LeaveRequest instances
    """
    filters = {'employee_id': employee_id}
    
    if status:
        filters['status'] = status
    
    if year:
        filters['start_date__year'] = year
    
    return LeaveRequest.objects.filter(
        **filters
    ).select_related(
        'leave_type',
        'approved_by'
    ).order_by('-created_at')
```

### get_pending_for_manager Method Implementation

```python
# Conceptual implementation
@staticmethod
def get_pending_for_manager(manager_id):
    """
    Get pending leave requests for manager's approval.
    
    Args:
        manager_id: User ID of the manager
    
    Returns:
        QuerySet of pending LeaveRequest instances
    """
    return LeaveRequest.objects.filter(
        status=LEAVE_REQUEST_STATUS_PENDING,
        employee__reporting_manager_id=manager_id
    ).select_related(
        'employee',
        'leave_type'
    ).order_by('submitted_at')  # Oldest first
```

### Service Method Categories

| Category | Methods | Purpose |
|----------|---------|---------|
| Creation | create_draft | Create new requests |
| Retrieval | get_request, get_employee_requests, get_pending_for_manager | Query requests |
| Submission | submit (Task 47) | Submit for approval |
| Validation | validate_balance, check_overlap (Tasks 48-49) | Business rule checks |
| Approval | approve, reject (Tasks 50-51) | Manager actions |
| Cancellation | cancel, recall (Task 52) | Employee actions |

### Service Usage Examples

#### Creating a Draft Request
```python
from apps.leave.services import LeaveRequestService
from apps.core.models import Tenant
from datetime import date

tenant = Tenant.objects.get(id=1)
employee_id = 123
leave_type_id = 5  # Annual Leave

data = {
    'start_date': date(2026, 2, 14),
    'end_date': date(2026, 2, 18),
    'is_half_day': False,
    'reason': 'Family vacation',
    'contact_during_leave': '+94 77 123 4567'
}

# Create draft
request = LeaveRequestService.create_draft(
    tenant=tenant,
    employee_id=employee_id,
    leave_type_id=leave_type_id,
    data=data
)

print(f"Draft request created: {request.id}")
print(f"Status: {request.status}")  # DRAFT
print(f"Total days: {request.total_days}")  # 5.0
```

#### Retrieving Employee's Requests
```python
# Get all requests for employee
all_requests = LeaveRequestService.get_employee_requests(employee_id=123)

# Get pending requests only
pending_requests = LeaveRequestService.get_employee_requests(
    employee_id=123,
    status=LEAVE_REQUEST_STATUS_PENDING
)

# Get requests for current year
from datetime import date
current_year = date.today().year
year_requests = LeaveRequestService.get_employee_requests(
    employee_id=123,
    year=current_year
)
```

#### Manager Dashboard
```python
# Get pending approvals for manager
manager_user_id = 45
pending_approvals = LeaveRequestService.get_pending_for_manager(manager_user_id)

print(f"Pending approvals: {pending_approvals.count()}")
for request in pending_approvals:
    print(f"- {request.employee.full_name}: {request.leave_type.name}")
    print(f"  Dates: {request.start_date} to {request.end_date}")
    print(f"  Submitted: {request.submitted_at}")
```

### Error Handling

```python
# Example error handling
from django.core.exceptions import ValidationError

try:
    request = LeaveRequestService.create_draft(
        tenant=tenant,
        employee_id=999,  # Non-existent
        leave_type_id=5,
        data=data
    )
except ValidationError as e:
    print(f"Error: {e}")
    # Output: "Employee with ID 999 not found"

try:
    request = LeaveRequestService.get_request(request_id=12345, tenant=tenant)
except ValidationError as e:
    print(f"Error: {e}")
    # Output: "Leave request with ID 12345 not found"
```

### Transaction Management

```python
# Service methods use @transaction.atomic where needed

@staticmethod
@transaction.atomic
def approve(request_id, approved_by, notes=None):
    """
    Approve leave request.
    
    All database operations wrapped in transaction:
    - Update request status
    - Update leave balance
    - Create notification
    
    If any operation fails, all changes rolled back.
    """
    pass  # Implementation in Task 50
```

### Expected Outcome
- LeaveRequestService class created with structure
- Methods for creating and retrieving requests
- Foundation for workflow operations
- Error handling for missing data
- Support for tenant-based filtering

### Verification Checklist
- [ ] services/ directory created
- [ ] request_service.py file created
- [ ] LeaveRequestService class defined
- [ ] Comprehensive class docstring added
- [ ] create_draft method implemented
- [ ] get_request method implemented
- [ ] get_employee_requests method implemented
- [ ] get_pending_for_manager method implemented
- [ ] All necessary imports included
- [ ] Service imported in services/__init__.py
- [ ] Error handling implemented
- [ ] Methods return correct types

---

## Task 47: Implement Submit Request

### Overview
Implement the submit method in LeaveRequestService that transitions a draft leave request to pending status, performs all necessary validations, reserves leave balance, and triggers notifications to the approving manager. This is the critical transition from draft to active approval workflow.

### Dependencies
- Task 46: Create LeaveRequestService
- Task 48: Implement Balance Validation (will be called)
- Task 49: Implement Overlap Detection (will be called)

### Instructions

1. **Open request_service.py file**
   - Navigate to `apps/leave/services/request_service.py`
   - Locate LeaveRequestService class

2. **Implement submit method**
   - Method signature: `submit(request_id, user)`
   - Wrap in @transaction.atomic decorator
   - Retrieve request and validate it's in DRAFT status
   - Call validate_balance to check available leave days
   - Call check_overlap to ensure no conflicts
   - Update status to PENDING
   - Set submitted_at timestamp
   - Reserve balance (increment pending_days)
   - Save request
   - Trigger notification to manager
   - Return updated request

3. **Add status validation**
   - Check request.status == DRAFT
   - Raise ValidationError if not in DRAFT status
   - Error message: "Only draft requests can be submitted"

4. **Implement balance reservation**
   - Get or create LeaveBalance for employee, leave_type, and year
   - Check available_days >= total_days
   - Increment pending_days by request.total_days
   - Decrement available_days by request.total_days
   - Save balance

5. **Add manager notification**
   - Identify employee's reporting manager
   - Create notification record
   - Send email notification (if configured)
   - Include request details and approval link

6. **Add error handling**
   - Catch and re-raise ValidationError from validations
   - Ensure transaction rolls back on failure
   - Provide clear error messages

### submit Method Implementation

```python
# Conceptual implementation
@staticmethod
@transaction.atomic
def submit(request_id, user):
    """
    Submit leave request for approval.
    
    Validates balance, checks overlaps, reserves balance, and notifies manager.
    
    Args:
        request_id: LeaveRequest ID
        user: User submitting the request (for audit)
    
    Returns:
        Updated LeaveRequest instance
    
    Raises:
        ValidationError: If validation fails or insufficient balance
    """
    # Get request
    request = LeaveRequestService.get_request(request_id)
    
    # Validate request is in DRAFT status
    if request.status != LEAVE_REQUEST_STATUS_DRAFT:
        raise ValidationError(
            "Only draft requests can be submitted. "
            f"Current status: {request.get_status_display()}"
        )
    
    # Validate employee can submit (not already on leave, etc.)
    LeaveRequestService._validate_submission_eligibility(request)
    
    # Validate leave balance
    LeaveRequestService.validate_balance(request)
    
    # Check for overlapping requests
    LeaveRequestService.check_overlap(request)
    
    # Reserve balance
    LeaveRequestService._reserve_balance(request)
    
    # Update request status
    request.status = LEAVE_REQUEST_STATUS_PENDING
    request.submitted_at = timezone.now()
    request.save()
    
    # Notify manager
    LeaveRequestService._notify_manager(request)
    
    return request
```

### Balance Reservation Logic

```python
# Conceptual helper method
@staticmethod
def _reserve_balance(request):
    """
    Reserve leave balance for pending request.
    
    Moves days from available to pending.
    """
    # Get current year balance
    balance, created = LeaveBalance.objects.get_or_create(
        tenant=request.tenant,
        employee=request.employee,
        leave_type=request.leave_type,
        year=request.start_date.year,
        defaults={
            'total_days': request.leave_type.default_days_per_year,
            'available_days': request.leave_type.default_days_per_year,
            'used_days': 0,
            'pending_days': 0,
        }
    )
    
    # Reserve days
    balance.available_days -= request.total_days
    balance.pending_days += request.total_days
    balance.save()
```

### Manager Notification

```python
# Conceptual helper method
@staticmethod
def _notify_manager(request):
    """
    Notify manager about pending leave request.
    
    Creates notification record and sends email.
    """
    # Get reporting manager
    manager = request.employee.reporting_manager
    if not manager:
        # No manager assigned, skip notification
        return
    
    # Create notification (if notification system exists)
    # from apps.notifications.models import Notification
    # Notification.objects.create(
    #     recipient=manager,
    #     notification_type='leave_request_pending',
    #     title=f'Leave Request from {request.employee.full_name}',
    #     message=f'{request.employee.full_name} has requested {request.leave_type.name} '
    #             f'from {request.start_date} to {request.end_date}',
    #     related_object=request,
    # )
    
    # Send email (if email system configured)
    # send_email(
    #     to=manager.email,
    #     subject=f'Leave Request - {request.employee.full_name}',
    #     template='leave_request_pending',
    #     context={'request': request}
    # )
    
    pass  # Placeholder for notification implementation
```

### Submission Eligibility Validation

```python
# Conceptual helper method
@staticmethod
def _validate_submission_eligibility(request):
    """
    Validate employee is eligible to submit leave request.
    
    Checks:
    - Employee is active
    - Employee is not already on approved leave during this period
    - Request dates are in the future (with exceptions for sick leave)
    """
    # Check employee is active
    if not request.employee.is_active:
        raise ValidationError("Inactive employees cannot submit leave requests")
    
    # Check dates not in past (exception for sick leave)
    today = timezone.now().date()
    if request.start_date < today:
        # Allow retroactive sick leave (up to 3 days back)
        if request.leave_type.code == 'SICK':
            max_retroactive_days = 3
            days_past = (today - request.start_date).days
            if days_past > max_retroactive_days:
                raise ValidationError(
                    f"Sick leave can only be requested up to "
                    f"{max_retroactive_days} days in the past"
                )
        else:
            raise ValidationError(
                "Leave requests must be for future dates (except sick leave)"
            )
```

### Submit Workflow Diagram

```
┌──────────────────────────────────────────────────────────────┐
│                    Submit Workflow                            │
└──────────────────────────────────────────────────────────────┘

1. Get Request
   ├─ Retrieve LeaveRequest by ID
   └─ Ensure request exists

2. Validate Status
   ├─ Check status == DRAFT
   └─ Reject if already submitted/approved

3. Validate Eligibility
   ├─ Employee is active
   ├─ Dates are valid
   └─ No conflicts with existing approved leaves

4. Validate Balance
   ├─ Get LeaveBalance for year
   ├─ Check: available_days >= total_days
   └─ Raise error if insufficient

5. Check Overlap
   ├─ Query existing requests
   ├─ Detect date range conflicts
   └─ Raise error if overlap found

6. Reserve Balance (Transaction)
   ├─ available_days -= total_days
   ├─ pending_days += total_days
   └─ Save balance

7. Update Request (Transaction)
   ├─ status = PENDING
   ├─ submitted_at = now()
   └─ Save request

8. Notify Manager
   ├─ Create notification
   ├─ Send email
   └─ Return updated request

✅ Request now PENDING approval
```

### Submission Example

```python
# Employee submits draft request
from apps.leave.services import LeaveRequestService

# Draft request ID: 12345
request_id = 12345
current_user = request.user  # From Django request context

try:
    # Submit request
    submitted_request = LeaveRequestService.submit(
        request_id=request_id,
        user=current_user
    )
    
    print(f"Request submitted successfully")
    print(f"Status: {submitted_request.status}")  # PENDING
    print(f"Submitted at: {submitted_request.submitted_at}")
    print(f"Awaiting approval from: {submitted_request.employee.reporting_manager.full_name}")
    
except ValidationError as e:
    print(f"Submission failed: {e}")
    # Handle error - show to user
```

### Submission Error Scenarios

```python
# Scenario 1: Already submitted
try:
    LeaveRequestService.submit(request_id=12345, user=user)
except ValidationError as e:
    # Error: "Only draft requests can be submitted. Current status: Pending Approval"
    pass

# Scenario 2: Insufficient balance
try:
    LeaveRequestService.submit(request_id=12346, user=user)
except ValidationError as e:
    # Error: "Insufficient leave balance. Available: 3.0 days, Requested: 5.0 days"
    pass

# Scenario 3: Overlapping request
try:
    LeaveRequestService.submit(request_id=12347, user=user)
except ValidationError as e:
    # Error: "Overlapping leave request found from Feb 14 to Feb 18"
    pass

# Scenario 4: Inactive employee
try:
    LeaveRequestService.submit(request_id=12348, user=user)
except ValidationError as e:
    # Error: "Inactive employees cannot submit leave requests"
    pass
```

### Transaction Rollback Example

```
Submit Request (Transaction):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Step 1: Reserve Balance
  ├─ available_days: 15.0 → 10.0 ✓
  └─ pending_days: 0 → 5.0 ✓

Step 2: Update Request
  ├─ status: DRAFT → PENDING ✓
  └─ submitted_at: (set) ✓

Step 3: Notify Manager
  └─ ❌ Email send fails (network error)

Result: Transaction ROLLBACK
  ├─ Balance changes reverted
  ├─ Request status reverted to DRAFT
  └─ Error raised to caller
```

### Expected Outcome
- submit method transitions draft to pending
- Balance validation prevents insufficient balance
- Overlap detection prevents conflicts
- Balance reserved atomically
- Manager notified of pending request
- Transaction ensures data consistency

### Verification Checklist
- [ ] submit method implemented
- [ ] @transaction.atomic decorator applied
- [ ] Status validation (DRAFT only)
- [ ] validate_balance called (will implement in Task 48)
- [ ] check_overlap called (will implement in Task 49)
- [ ] Balance reservation logic implemented
- [ ] submitted_at timestamp set
- [ ] Status changed to PENDING
- [ ] Manager notification implemented
- [ ] Error handling for validations
- [ ] Transaction rollback on failure
- [ ] Clear error messages

---

## Task 48: Implement Balance Validation

### Overview
Implement the validate_balance method in LeaveRequestService that checks whether an employee has sufficient leave balance available for their request. This validation prevents requests that would exceed the employee's allocated or remaining leave days.

### Dependencies
- Task 46: Create LeaveRequestService
- LeaveBalance model exists (from Group B)

### Instructions

1. **Open request_service.py file**
   - Continue in `apps/leave/services/request_service.py`
   - Locate LeaveRequestService class

2. **Implement validate_balance method**
   - Method signature: `validate_balance(request)`
   - Retrieve LeaveBalance for employee, leave_type, and year
   - Check if balance exists (employee may not have allocation)
   - Validate available_days >= request.total_days
   - Raise ValidationError if insufficient balance
   - Return True if validation passes

3. **Handle missing balance**
   - If no LeaveBalance record exists:
     - Check if leave type has auto-allocation
     - Create balance if appropriate
     - Otherwise, raise ValidationError

4. **Add detailed error messages**
   - Include available days in error message
   - Include requested days in error message
   - Provide user-friendly guidance
   - Example: "Insufficient Annual Leave balance. Available: 3.0 days, Requested: 5.0 days"

5. **Handle edge cases**
   - Zero balance available
   - Negative balance (shouldn't happen, but check)
   - Half-day requests (0.5 days)
   - Cross-year requests (validate for start_date year)

### validate_balance Method Implementation

```python
# Conceptual implementation
@staticmethod
def validate_balance(request):
    """
    Validate employee has sufficient leave balance.
    
    Args:
        request: LeaveRequest instance
    
    Returns:
        True if balance is sufficient
    
    Raises:
        ValidationError: If insufficient balance or no balance record
    """
    # Get balance for the year of start_date
    year = request.start_date.year
    
    try:
        balance = LeaveBalance.objects.get(
            tenant=request.tenant,
            employee=request.employee,
            leave_type=request.leave_type,
            year=year
        )
    except LeaveBalance.DoesNotExist:
        # No balance record - check if auto-allocation enabled
        if request.leave_type.auto_allocate:
            # Create balance with default allocation
            balance = LeaveBalance.objects.create(
                tenant=request.tenant,
                employee=request.employee,
                leave_type=request.leave_type,
                year=year,
                total_days=request.leave_type.default_days_per_year,
                available_days=request.leave_type.default_days_per_year,
                used_days=0,
                pending_days=0,
            )
        else:
            raise ValidationError(
                f"No {request.leave_type.name} balance found for {year}. "
                "Please contact HR to set up your leave allocation."
            )
    
    # Check available balance
    if balance.available_days < request.total_days:
        raise ValidationError(
            f"Insufficient {request.leave_type.name} balance. "
            f"Available: {balance.available_days} days, "
            f"Requested: {request.total_days} days. "
            f"Please adjust your request or contact HR."
        )
    
    # Check for negative balance (data integrity)
    if balance.available_days < 0:
        raise ValidationError(
            f"Invalid balance state detected. "
            "Please contact HR to resolve your leave balance."
        )
    
    return True
```

### Balance Validation Scenarios

#### Scenario 1: Sufficient Balance
```
Employee: Kasun Perera
Leave Type: Annual Leave
Year: 2026

Balance:
- Total: 15.0 days
- Used: 5.0 days
- Pending: 0.0 days
- Available: 10.0 days

Request: 5.0 days (Feb 14-18, 2026)

Validation:
✓ Available (10.0) >= Requested (5.0)
✓ PASS - Sufficient balance
```

#### Scenario 2: Insufficient Balance
```
Employee: Nimal Silva
Leave Type: Annual Leave
Year: 2026

Balance:
- Total: 15.0 days
- Used: 10.0 days
- Pending: 2.0 days
- Available: 3.0 days

Request: 5.0 days (Mar 10-14, 2026)

Validation:
✗ Available (3.0) < Requested (5.0)
✗ FAIL - Insufficient balance

Error: "Insufficient Annual Leave balance. Available: 3.0 days, 
        Requested: 5.0 days. Please adjust your request or contact HR."
```

#### Scenario 3: No Balance Record (Auto-Allocate Enabled)
```
Employee: Saman Fernando (New employee)
Leave Type: Annual Leave (auto_allocate=True)
Year: 2026

Balance: None (not yet created)

Request: 5.0 days

Validation:
1. No balance found
2. Leave type has auto_allocate=True
3. Create balance:
   - Total: 15.0 days (from leave type default)
   - Available: 15.0 days
   - Used: 0.0 days
   - Pending: 0.0 days
4. Check: Available (15.0) >= Requested (5.0)
✓ PASS - Balance created and sufficient
```

#### Scenario 4: No Balance Record (No Auto-Allocate)
```
Employee: Chaminda Perera
Leave Type: Special Leave (auto_allocate=False)
Year: 2026

Balance: None

Request: 2.0 days

Validation:
1. No balance found
2. Leave type has auto_allocate=False
3. Cannot create balance automatically
✗ FAIL - No balance record

Error: "No Special Leave balance found for 2026. 
        Please contact HR to set up your leave allocation."
```

#### Scenario 5: Half Day Request
```
Employee: Sunil Kumara
Leave Type: Casual Leave
Year: 2026

Balance:
- Total: 7.0 days
- Used: 6.0 days
- Pending: 0.0 days
- Available: 1.0 days

Request: 0.5 days (half day on Feb 10)

Validation:
✓ Available (1.0) >= Requested (0.5)
✓ PASS - Sufficient for half day
```

### Balance Calculation Example

```
┌──────────────────────────────────────────────────────────────┐
│              Leave Balance Calculation                       │
├──────────────────────────────────────────────────────────────┤
│ Employee: Kasun Perera                                       │
│ Leave Type: Annual Leave                                     │
│ Year: 2026                                                   │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│ Total Allocation:        15.0 days                           │
│                                                              │
│ Used (Approved):          5.0 days                           │
│  └─ Request #1: Jan 10-12 (3 days)                          │
│  └─ Request #2: Jan 25-26 (2 days)                          │
│                                                              │
│ Pending (Awaiting Approval): 2.0 days                        │
│  └─ Request #3: Mar 15-16 (2 days)                          │
│                                                              │
│ Available:                8.0 days                           │
│  (Calculation: 15.0 - 5.0 - 2.0 = 8.0)                      │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│ New Request Validation:                                      │
│  Request: Feb 14-18, 2026 (5.0 days)                        │
│  Check: Available (8.0) >= Requested (5.0)                   │
│  Result: ✓ PASS                                              │
└──────────────────────────────────────────────────────────────┘
```

### Balance Validation Error Messages

```python
# Error message templates (conceptual)

# Insufficient balance
error_msg = (
    f"Insufficient {leave_type_name} balance. "
    f"Available: {available_days} days, "
    f"Requested: {requested_days} days. "
    f"Please adjust your request or contact HR."
)

# No balance record
error_msg = (
    f"No {leave_type_name} balance found for {year}. "
    "Please contact HR to set up your leave allocation."
)

# Negative balance (data issue)
error_msg = (
    f"Invalid balance state detected. "
    "Please contact HR to resolve your leave balance."
)

# Zero balance
error_msg = (
    f"No {leave_type_name} days available for {year}. "
    f"You have used all {total_days} allocated days. "
    "Contact HR if you need additional leave."
)
```

### Integration with Submit Workflow

```python
# In submit method (from Task 47)
@staticmethod
@transaction.atomic
def submit(request_id, user):
    """Submit leave request for approval"""
    request = LeaveRequestService.get_request(request_id)
    
    # ... status validation ...
    
    # Validate balance
    try:
        LeaveRequestService.validate_balance(request)
    except ValidationError as e:
        # Balance validation failed
        # Transaction will rollback
        raise  # Re-raise to caller
    
    # ... continue with overlap check, balance reservation ...
```

### Expected Outcome
- validate_balance method checks available leave days
- Prevents requests exceeding available balance
- Creates balance for auto-allocate leave types
- Provides clear error messages with details
- Handles edge cases (half days, missing balance)

### Verification Checklist
- [ ] validate_balance method implemented
- [ ] Retrieves LeaveBalance for correct year
- [ ] Checks available_days >= total_days
- [ ] Handles missing balance record
- [ ] Auto-creates balance if appropriate
- [ ] Raises ValidationError for insufficient balance
- [ ] Error messages include available and requested days
- [ ] Handles half-day requests (0.5 days)
- [ ] Checks for negative balance
- [ ] Returns True on successful validation
- [ ] Integration with submit method tested

---

## Task 49: Implement Overlap Detection

### Overview
Implement the check_overlap method in LeaveRequestService that detects conflicting leave requests for the same employee. This validation prevents double-booking where an employee has multiple approved or pending leaves for overlapping dates.

### Dependencies
- Task 46: Create LeaveRequestService

### Instructions

1. **Open request_service.py file**
   - Continue in `apps/leave/services/request_service.py`
   - Locate LeaveRequestService class

2. **Implement check_overlap method**
   - Method signature: `check_overlap(request)`
   - Query existing requests for same employee
   - Filter by APPROVED and PENDING status
   - Exclude current request (if updating existing)
   - Check for date range overlaps
   - Raise ValidationError if overlap found
   - Return True if no overlaps

3. **Implement overlap detection logic**
   - Two date ranges overlap if:
     - (new_start <= existing_end) AND (new_end >= existing_start)
   - Use Q objects for complex query
   - Check both conditions

4. **Add detailed error messages**
   - Include conflicting request details
   - Show conflicting date range
   - Show conflicting leave type
   - Provide guidance for resolution

5. **Handle edge cases**
   - Same-day requests (start == end)
   - Half-day requests (check if on same day)
   - Multiple overlapping requests
   - Status filters (CANCELLED and REJECTED don't count)

### check_overlap Method Implementation

```python
# Conceptual implementation
from django.db.models import Q

@staticmethod
def check_overlap(request):
    """
    Check for overlapping leave requests.
    
    Detects conflicts with existing APPROVED or PENDING requests.
    
    Args:
        request: LeaveRequest instance to check
    
    Returns:
        True if no overlaps found
    
    Raises:
        ValidationError: If overlapping request found
    """
    # Query existing requests for same employee
    overlapping_requests = LeaveRequest.objects.filter(
        tenant=request.tenant,
        employee=request.employee,
        status__in=[LEAVE_REQUEST_STATUS_APPROVED, LEAVE_REQUEST_STATUS_PENDING]
    ).exclude(
        id=request.id  # Exclude current request if updating
    ).filter(
        # Overlap condition: (new_start <= existing_end) AND (new_end >= existing_start)
        Q(start_date__lte=request.end_date) & Q(end_date__gte=request.start_date)
    ).select_related('leave_type')
    
    if overlapping_requests.exists():
        # Get first overlapping request for error message
        overlap = overlapping_requests.first()
        
        # Format dates for display
        overlap_dates = f"{overlap.start_date} to {overlap.end_date}"
        if overlap.start_date == overlap.end_date:
            overlap_dates = str(overlap.start_date)
        
        # Detailed error message
        raise ValidationError(
            f"Overlapping leave request found. "
            f"You have existing {overlap.get_status_display()} {overlap.leave_type.name} "
            f"on {overlap_dates}. "
            f"Please cancel or adjust the conflicting request before submitting this one."
        )
    
    return True
```

### Overlap Detection Logic

#### Overlap Condition Explanation
```
Date Range Overlap Logic
════════════════════════

Two date ranges [A_start, A_end] and [B_start, B_end] overlap if:
  (A_start <= B_end) AND (A_end >= B_start)

Examples:

1. Complete Overlap
   Request A: |████████████|
   Request B:     |████|
   Overlaps: YES

2. Partial Overlap (Start)
   Request A:     |████████|
   Request B: |████████|
   Overlaps: YES

3. Partial Overlap (End)
   Request A: |████████|
   Request B:     |████████|
   Overlaps: YES

4. Adjacent (No Overlap)
   Request A: |████|
   Request B:       |████|
   Overlaps: NO (end of A is before start of B)

5. Completely Separate
   Request A: |████|
   Request B:            |████|
   Overlaps: NO
```

### Overlap Detection Scenarios

#### Scenario 1: Complete Overlap
```
Existing Request (APPROVED):
- Leave Type: Annual Leave
- Dates: Feb 10-14, 2026 (5 days)
- Status: APPROVED

New Request:
- Leave Type: Sick Leave
- Dates: Feb 11-13, 2026 (3 days)

Check:
├─ new_start (Feb 11) <= existing_end (Feb 14) ✓
└─ new_end (Feb 13) >= existing_start (Feb 10) ✓

Result: OVERLAP DETECTED ✗

Error: "Overlapping leave request found. You have existing Approved 
        Annual Leave on Feb 10 to Feb 14. Please cancel or adjust 
        the conflicting request before submitting this one."
```

#### Scenario 2: Partial Overlap (Start)
```
Existing Request (PENDING):
- Dates: Feb 17-21, 2026

New Request:
- Dates: Feb 14-18, 2026

Overlap Period: Feb 17-18 (2 days)

Check:
├─ new_start (Feb 14) <= existing_end (Feb 21) ✓
└─ new_end (Feb 18) >= existing_start (Feb 17) ✓

Result: OVERLAP DETECTED ✗
```

#### Scenario 3: Partial Overlap (End)
```
Existing Request (APPROVED):
- Dates: Feb 14-18, 2026

New Request:
- Dates: Feb 17-21, 2026

Overlap Period: Feb 17-18 (2 days)

Check:
├─ new_start (Feb 17) <= existing_end (Feb 18) ✓
└─ new_end (Feb 21) >= existing_start (Feb 14) ✓

Result: OVERLAP DETECTED ✗
```

#### Scenario 4: No Overlap (Adjacent)
```
Existing Request:
- Dates: Feb 10-14, 2026

New Request:
- Dates: Feb 15-18, 2026

Check:
├─ new_start (Feb 15) <= existing_end (Feb 14) ✗
└─ Not overlapping (adjacent dates are OK)

Result: NO OVERLAP ✓
```

#### Scenario 5: No Overlap (Separate)
```
Existing Request:
- Dates: Feb 10-14, 2026

New Request:
- Dates: Feb 20-24, 2026

Check:
├─ new_start (Feb 20) > existing_end (Feb 14) ✗
└─ Not overlapping (completely separate)

Result: NO OVERLAP ✓
```

#### Scenario 6: Same Day Request
```
Existing Request (Half Day - Morning):
- Date: Feb 16, 2026
- is_half_day: True
- half_day_type: FIRST_HALF

New Request (Half Day - Afternoon):
- Date: Feb 16, 2026
- is_half_day: True
- half_day_type: SECOND_HALF

Technical Check:
├─ Dates overlap: Feb 16 == Feb 16 ✓
└─ Basic overlap detected

Enhancement Needed:
- Check half_day_type values
- If different halves, could allow
- For simplicity: treat as overlap

Result: OVERLAP DETECTED ✗
(Conservative approach - simplifies logic)
```

### Status Filtering in Overlap Detection

```python
# Only check APPROVED and PENDING requests

status__in=[
    LEAVE_REQUEST_STATUS_APPROVED,  # Already approved leaves
    LEAVE_REQUEST_STATUS_PENDING,   # Awaiting approval
]

# Ignore these statuses (don't count as conflicts):
# - DRAFT: Not submitted yet, may be changed/deleted
# - REJECTED: Request denied, not taking leave
# - CANCELLED: Employee cancelled, not taking leave
# - RECALLED: Employee recalled, not taking leave anymore
```

### Overlap Detection Query

```python
# Detailed query breakdown
overlapping_requests = LeaveRequest.objects.filter(
    # Same tenant (multi-tenancy)
    tenant=request.tenant,
    
    # Same employee (one person can't be on two leaves simultaneously)
    employee=request.employee,
    
    # Only APPROVED and PENDING count as conflicts
    status__in=[
        LEAVE_REQUEST_STATUS_APPROVED,
        LEAVE_REQUEST_STATUS_PENDING
    ]
).exclude(
    # Exclude current request (important when updating existing request)
    id=request.id
).filter(
    # Overlap condition using Q objects
    Q(start_date__lte=request.end_date) &  # Existing starts on or before new ends
    Q(end_date__gte=request.start_date)    # Existing ends on or after new starts
).select_related('leave_type')  # Optimize query for error message
```

### Error Message Examples

```python
# Complete overlap
"Overlapping leave request found. You have existing Approved Annual Leave 
 on Feb 10 to Feb 14. Please cancel or adjust the conflicting request 
 before submitting this one."

# Single day overlap
"Overlapping leave request found. You have existing Pending Sick Leave 
 on Feb 16. Please cancel or adjust the conflicting request before 
 submitting this one."

# Multiple overlaps (report first one)
"Overlapping leave request found. You have existing Approved Annual Leave 
 on Feb 14 to Feb 18. Please cancel or adjust the conflicting request 
 before submitting this one."
```

### Integration with Submit Workflow

```python
# In submit method (from Task 47)
@staticmethod
@transaction.atomic
def submit(request_id, user):
    """Submit leave request for approval"""
    request = LeaveRequestService.get_request(request_id)
    
    # ... status validation ...
    
    # Validate balance
    LeaveRequestService.validate_balance(request)
    
    # Check for overlaps
    try:
        LeaveRequestService.check_overlap(request)
    except ValidationError as e:
        # Overlap detected
        # Transaction will rollback
        raise  # Re-raise to caller
    
    # ... continue with balance reservation ...
```

### Overlap Detection Diagram

```
┌──────────────────────────────────────────────────────────────┐
│               Overlap Detection Process                       │
└──────────────────────────────────────────────────────────────┘

New Request: Feb 14-18, 2026

Step 1: Query Existing Requests
└─ Employee: Kasun Perera
   Status: APPROVED or PENDING
   
   Existing Requests:
   ├─ Request #1: Jan 25-28 (APPROVED)
   ├─ Request #2: Feb 10-14 (APPROVED)
   └─ Request #3: Feb 17-21 (PENDING)

Step 2: Check Each for Overlap

Request #1: Jan 25-28
├─ new_start (Feb 14) <= existing_end (Jan 28)? NO ✓
└─ No overlap with Request #1

Request #2: Feb 10-14
├─ new_start (Feb 14) <= existing_end (Feb 14)? YES
├─ new_end (Feb 18) >= existing_start (Feb 10)? YES
└─ OVERLAP with Request #2! (Feb 14) ✗

Step 3: Report First Overlap
└─ Error: "Overlapping leave request found..."
   Stop checking, raise ValidationError
```

### Expected Outcome
- check_overlap method detects date conflicts
- Prevents double-booking of leave
- Considers APPROVED and PENDING requests only
- Provides clear error messages with conflict details
- Handles edge cases (same day, adjacent dates)

### Verification Checklist
- [ ] check_overlap method implemented
- [ ] Queries existing requests for employee
- [ ] Filters by APPROVED and PENDING status
- [ ] Excludes CANCELLED, REJECTED, RECALLED, DRAFT
- [ ] Implements correct overlap logic
- [ ] Uses Q objects for date range check
- [ ] Excludes current request (if updating)
- [ ] Raises ValidationError on overlap
- [ ] Error message includes conflict details
- [ ] Returns True if no overlaps
- [ ] Integration with submit method tested
- [ ] Handles same-day requests
- [ ] Handles adjacent requests (no false positives)

---

## Task 50: Implement Approval Workflow

### Overview
Implement the approve method in LeaveRequestService that allows managers to approve pending leave requests. This method transitions the request to approved status, moves balance from pending to used, records approval metadata, and notifies the employee.

### Dependencies
- Task 46: Create LeaveRequestService

### Instructions

1. **Open request_service.py file**
   - Continue in `apps/leave/services/request_service.py`
   - Locate LeaveRequestService class

2. **Implement approve method**
   - Method signature: `approve(request_id, approved_by, notes=None)`
   - Wrap in @transaction.atomic decorator
   - Retrieve request and validate it's PENDING
   - Update balance: move pending_days to used_days
   - Set status to APPROVED
   - Set approved_by user
   - Set approved_at timestamp
   - Save request
   - Notify employee
   - Return updated request

3. **Add status validation**
   - Check request.status == PENDING
   - Raise ValidationError if not PENDING
   - Error message: "Only pending requests can be approved"

4. **Implement balance update**
   - Get LeaveBalance for employee, leave_type, year
   - Decrement pending_days by total_days
   - Increment used_days by total_days
   - Save balance

5. **Add manager authorization check**
   - Verify approved_by is the employee's reporting manager
   - Or has appropriate permissions (HR role)
   - Raise ValidationError if unauthorized

6. **Add employee notification**
   - Create notification for employee
   - Send email notification
   - Include approval details and dates

### approve Method Implementation

```python
# Conceptual implementation
@staticmethod
@transaction.atomic
def approve(request_id, approved_by, notes=None):
    """
    Approve leave request.
    
    Updates balance, sets approval metadata, and notifies employee.
    
    Args:
        request_id: LeaveRequest ID
        approved_by: User approving the request (manager)
        notes: Optional approval notes
    
    Returns:
        Updated LeaveRequest instance
    
    Raises:
        ValidationError: If validation fails or unauthorized
    """
    # Get request
    request = LeaveRequestService.get_request(request_id)
    
    # Validate request is PENDING
    if request.status != LEAVE_REQUEST_STATUS_PENDING:
        raise ValidationError(
            "Only pending requests can be approved. "
            f"Current status: {request.get_status_display()}"
        )
    
    # Verify authorization
    LeaveRequestService._verify_manager_authorization(request, approved_by)
    
    # Update balance (move pending to used)
    LeaveRequestService._update_balance_on_approval(request)
    
    # Update request
    request.status = LEAVE_REQUEST_STATUS_APPROVED
    request.approved_by = approved_by
    request.approved_at = timezone.now()
    request.save()
    
    # Notify employee
    LeaveRequestService._notify_employee_approval(request, notes)
    
    return request
```

### Manager Authorization Check

```python
# Conceptual helper method
@staticmethod
def _verify_manager_authorization(request, approved_by):
    """
    Verify user is authorized to approve this request.
    
    Checks:
    - User is employee's reporting manager
    - OR user has HR role/permissions
    """
    employee = request.employee
    
    # Check if approver is reporting manager
    if employee.reporting_manager_id == approved_by.id:
        return True
    
    # Check if approver has HR permissions
    # (Assuming permission system exists)
    # if approved_by.has_perm('leave.approve_any_request'):
    #     return True
    
    # If neither, unauthorized
    raise ValidationError(
        f"You are not authorized to approve this leave request. "
        f"Only {employee.reporting_manager.full_name} or HR can approve."
    )
```

### Balance Update on Approval

```python
# Conceptual helper method
@staticmethod
def _update_balance_on_approval(request):
    """
    Update leave balance when request is approved.
    
    Moves days from pending to used.
    """
    # Get balance
    balance = LeaveBalance.objects.get(
        tenant=request.tenant,
        employee=request.employee,
        leave_type=request.leave_type,
        year=request.start_date.year
    )
    
    # Move pending to used
    balance.pending_days -= request.total_days
    balance.used_days += request.total_days
    
    # Sanity check
    if balance.pending_days < 0:
        raise ValidationError(
            "Balance calculation error: pending_days would be negative"
        )
    
    balance.save()
```

### Employee Notification on Approval

```python
# Conceptual helper method
@staticmethod
def _notify_employee_approval(request, notes=None):
    """
    Notify employee that request was approved.
    """
    employee = request.employee
    
    # Create notification
    # from apps.notifications.models import Notification
    # Notification.objects.create(
    #     recipient=employee.user,
    #     notification_type='leave_request_approved',
    #     title='Leave Request Approved',
    #     message=f'Your {request.leave_type.name} request for '
    #             f'{request.start_date} to {request.end_date} has been approved.',
    #     related_object=request,
    # )
    
    # Send email
    # send_email(
    #     to=employee.user.email,
    #     subject='Leave Request Approved',
    #     template='leave_request_approved',
    #     context={
    #         'request': request,
    #         'notes': notes,
    #     }
    # )
    
    pass  # Placeholder
```

### Approval Workflow Diagram

```
┌──────────────────────────────────────────────────────────────┐
│                  Approval Workflow                            │
└──────────────────────────────────────────────────────────────┘

Request ID: 12345
Employee: Kasun Perera
Leave Type: Annual Leave
Dates: Feb 14-18, 2026 (5 days)
Status: PENDING

Manager Action: Approve
Approved By: Nimal Silva (Manager)

Step 1: Verify Authorization
├─ Check: approved_by == employee.reporting_manager ✓
└─ Authorized

Step 2: Validate Status
├─ Check: status == PENDING ✓
└─ Valid for approval

Step 3: Update Balance (Transaction)
├─ Get LeaveBalance for 2026
├─ Before:
│  ├─ pending_days: 5.0
│  └─ used_days: 5.0
├─ After:
│  ├─ pending_days: 0.0 (5.0 - 5.0)
│  └─ used_days: 10.0 (5.0 + 5.0)
└─ Balance saved

Step 4: Update Request (Transaction)
├─ status: PENDING → APPROVED
├─ approved_by: Nimal Silva
├─ approved_at: Feb 2, 2026 9:15 AM
└─ Request saved

Step 5: Notify Employee
├─ Create notification
├─ Send email to Kasun Perera
└─ Subject: "Leave Request Approved"

✅ Request now APPROVED
```

### Approval Example Usage

```python
from apps.leave.services import LeaveRequestService

# Manager approves request
request_id = 12345
manager_user = User.objects.get(id=45)  # Manager
notes = "Approved. Have a good vacation!"

try:
    approved_request = LeaveRequestService.approve(
        request_id=request_id,
        approved_by=manager_user,
        notes=notes
    )
    
    print(f"Request approved successfully")
    print(f"Status: {approved_request.status}")  # APPROVED
    print(f"Approved by: {approved_request.approved_by.get_full_name()}")
    print(f"Approved at: {approved_request.approved_at}")
    
except ValidationError as e:
    print(f"Approval failed: {e}")
```

### Approval Error Scenarios

```python
# Scenario 1: Not pending
try:
    LeaveRequestService.approve(request_id=12345, approved_by=manager)
except ValidationError as e:
    # Error: "Only pending requests can be approved. Current status: Approved"
    pass

# Scenario 2: Unauthorized approver
try:
    wrong_manager = User.objects.get(id=99)
    LeaveRequestService.approve(request_id=12346, approved_by=wrong_manager)
except ValidationError as e:
    # Error: "You are not authorized to approve this leave request. 
    #         Only John Doe or HR can approve."
    pass

# Scenario 3: Balance calculation error
try:
    LeaveRequestService.approve(request_id=12347, approved_by=manager)
except ValidationError as e:
    # Error: "Balance calculation error: pending_days would be negative"
    pass
```

### Balance State Changes

```
Before Approval:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Employee: Kasun Perera
Leave Type: Annual Leave (2026)

Balance:
├─ total_days: 15.0
├─ available_days: 5.0
├─ pending_days: 5.0  ← Request in PENDING state
└─ used_days: 5.0

Calculation:
  total_days = available_days + pending_days + used_days
  15.0 = 5.0 + 5.0 + 5.0 ✓


After Approval:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Balance:
├─ total_days: 15.0 (unchanged)
├─ available_days: 5.0 (unchanged)
├─ pending_days: 0.0  ← Moved to used
└─ used_days: 10.0    ← Incremented

Calculation:
  total_days = available_days + pending_days + used_days
  15.0 = 5.0 + 0.0 + 10.0 ✓
```

### Transaction Rollback on Approval Failure

```
Approve Request (Transaction):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Step 1: Update Balance
  ├─ pending_days: 5.0 → 0.0 ✓
  └─ used_days: 5.0 → 10.0 ✓

Step 2: Update Request
  ├─ status: PENDING → APPROVED ✓
  └─ approved_at: (set) ✓

Step 3: Notify Employee
  └─ ❌ Notification system error

Result: Transaction ROLLBACK
  ├─ Balance changes reverted
  ├─ Request status reverted to PENDING
  └─ Error raised to caller
```

### Expected Outcome
- approve method transitions pending to approved
- Balance updated atomically (pending to used)
- Approval metadata recorded (who, when)
- Employee notified of approval
- Manager authorization verified
- Transaction ensures data consistency

### Verification Checklist
- [ ] approve method implemented
- [ ] @transaction.atomic decorator applied
- [ ] Status validation (PENDING only)
- [ ] Manager authorization check implemented
- [ ] Balance update logic implemented
- [ ] pending_days decremented correctly
- [ ] used_days incremented correctly
- [ ] approved_by field set
- [ ] approved_at timestamp set
- [ ] Status changed to APPROVED
- [ ] Employee notification implemented
- [ ] Error handling for unauthorized approval
- [ ] Transaction rollback on failure
- [ ] Returns updated LeaveRequest

---

## Task 51: Implement Rejection Workflow

### Overview
Implement the reject method in LeaveRequestService that allows managers to reject pending leave requests. This method transitions the request to rejected status, restores pending balance to available, records rejection reason, and notifies the employee with the reason.

### Dependencies
- Task 46: Create LeaveRequestService

### Instructions

1. **Open request_service.py file**
   - Continue in `apps/leave/services/request_service.py`
   - Locate LeaveRequestService class

2. **Implement reject method**
   - Method signature: `reject(request_id, rejected_by, reason)`
   - Wrap in @transaction.atomic decorator
   - Retrieve request and validate it's PENDING
   - Restore balance: move pending_days back to available_days
   - Set status to REJECTED
   - Set rejection_reason
   - Save request (note: approved_by not used for rejection)
   - Notify employee with reason
   - Return updated request

3. **Add status validation**
   - Check request.status == PENDING
   - Raise ValidationError if not PENDING
   - Error message: "Only pending requests can be rejected"

4. **Validate rejection reason**
   - Ensure reason is provided
   - Minimum length recommended: 10 characters
   - Clear, actionable guidance for employee

5. **Implement balance restoration**
   - Get LeaveBalance for employee, leave_type, year
   - Decrement pending_days by total_days
   - Increment available_days by total_days
   - Save balance

6. **Add employee notification**
   - Create notification for employee
   - Send email with rejection reason
   - Include guidance for next steps

### reject Method Implementation

```python
# Conceptual implementation
@staticmethod
@transaction.atomic
def reject(request_id, rejected_by, reason):
    """
    Reject leave request.
    
    Restores balance, records rejection reason, and notifies employee.
    
    Args:
        request_id: LeaveRequest ID
        rejected_by: User rejecting the request (manager)
        reason: Reason for rejection (required)
    
    Returns:
        Updated LeaveRequest instance
    
    Raises:
        ValidationError: If validation fails or unauthorized
    """
    # Get request
    request = LeaveRequestService.get_request(request_id)
    
    # Validate request is PENDING
    if request.status != LEAVE_REQUEST_STATUS_PENDING:
        raise ValidationError(
            "Only pending requests can be rejected. "
            f"Current status: {request.get_status_display()}"
        )
    
    # Validate rejection reason provided
    if not reason or len(reason.strip()) < 10:
        raise ValidationError(
            "Rejection reason is required and must be at least 10 characters. "
            "Please provide clear feedback for the employee."
        )
    
    # Verify authorization
    LeaveRequestService._verify_manager_authorization(request, rejected_by)
    
    # Restore balance
    LeaveRequestService._restore_balance_on_rejection(request)
    
    # Update request
    request.status = LEAVE_REQUEST_STATUS_REJECTED
    request.rejection_reason = reason.strip()
    request.save()
    
    # Notify employee
    LeaveRequestService._notify_employee_rejection(request)
    
    return request
```

### Balance Restoration on Rejection

```python
# Conceptual helper method
@staticmethod
def _restore_balance_on_rejection(request):
    """
    Restore leave balance when request is rejected.
    
    Moves days from pending back to available.
    """
    # Get balance
    balance = LeaveBalance.objects.get(
        tenant=request.tenant,
        employee=request.employee,
        leave_type=request.leave_type,
        year=request.start_date.year
    )
    
    # Restore balance
    balance.pending_days -= request.total_days
    balance.available_days += request.total_days
    
    # Sanity check
    if balance.pending_days < 0:
        raise ValidationError(
            "Balance calculation error: pending_days would be negative"
        )
    
    balance.save()
```

### Employee Notification on Rejection

```python
# Conceptual helper method
@staticmethod
def _notify_employee_rejection(request):
    """
    Notify employee that request was rejected.
    """
    employee = request.employee
    
    # Create notification
    # from apps.notifications.models import Notification
    # Notification.objects.create(
    #     recipient=employee.user,
    #     notification_type='leave_request_rejected',
    #     title='Leave Request Rejected',
    #     message=f'Your {request.leave_type.name} request for '
    #             f'{request.start_date} to {request.end_date} was rejected.',
    #     related_object=request,
    # )
    
    # Send email with rejection reason
    # send_email(
    #     to=employee.user.email,
    #     subject='Leave Request Rejected',
    #     template='leave_request_rejected',
    #     context={
    #         'request': request,
    #         'reason': request.rejection_reason,
    #         'manager': request.employee.reporting_manager,
    #     }
    # )
    
    pass  # Placeholder
```

### Rejection Workflow Diagram

```
┌──────────────────────────────────────────────────────────────┐
│                  Rejection Workflow                           │
└──────────────────────────────────────────────────────────────┘

Request ID: 12346
Employee: Kasun Perera
Leave Type: Annual Leave
Dates: Jan 20-25, 2026 (6 days)
Status: PENDING

Manager Action: Reject
Rejected By: Nimal Silva (Manager)
Reason: "Insufficient staffing during peak sales period. 
         Please request alternative dates after January 25."

Step 1: Verify Authorization
├─ Check: rejected_by == employee.reporting_manager ✓
└─ Authorized

Step 2: Validate Status
├─ Check: status == PENDING ✓
└─ Valid for rejection

Step 3: Validate Reason
├─ Check: reason length >= 10 characters ✓
└─ Reason adequate

Step 4: Restore Balance (Transaction)
├─ Get LeaveBalance for 2026
├─ Before:
│  ├─ available_days: 9.0
│  └─ pending_days: 6.0
├─ After:
│  ├─ available_days: 15.0 (9.0 + 6.0)
│  └─ pending_days: 0.0 (6.0 - 6.0)
└─ Balance saved

Step 5: Update Request (Transaction)
├─ status: PENDING → REJECTED
├─ rejection_reason: "Insufficient staffing..."
└─ Request saved

Step 6: Notify Employee
├─ Create notification
├─ Send email to Kasun Perera
├─ Include rejection reason
└─ Subject: "Leave Request Rejected"

✅ Request now REJECTED, balance restored
```

### Rejection Example Usage

```python
from apps.leave.services import LeaveRequestService

# Manager rejects request
request_id = 12346
manager_user = User.objects.get(id=45)
reason = (
    "Insufficient staffing during peak sales period. "
    "Please request alternative dates after January 25, "
    "or consider reducing the number of days."
)

try:
    rejected_request = LeaveRequestService.reject(
        request_id=request_id,
        rejected_by=manager_user,
        reason=reason
    )
    
    print(f"Request rejected successfully")
    print(f"Status: {rejected_request.status}")  # REJECTED
    print(f"Reason: {rejected_request.rejection_reason}")
    
except ValidationError as e:
    print(f"Rejection failed: {e}")
```

### Good vs. Poor Rejection Reasons

#### Good Rejection Reasons
```
✓ "Insufficient staffing during peak sales period. Please request 
   alternative dates after January 25."

✓ "Your annual leave balance is insufficient (requested 7 days, 
   available 5 days). Please adjust your request or apply for 
   no-pay leave for the additional days."

✓ "Critical project deadline on Feb 15 requires your presence. 
   Can you reschedule to the week of Feb 17-21?"

✓ "Department training scheduled for Jan 20-22. Your attendance 
   is mandatory. Please choose different dates."

✓ "Three team members already on leave during this period. 
   Please coordinate with team and select alternative dates."
```

#### Poor Rejection Reasons
```
✗ "No" → Not helpful, no explanation

✗ "Cannot approve" → Doesn't explain why

✗ "Denied" → No context for employee

✗ "Too many people" → Vague, not actionable

✗ "Try again" → No guidance on what to change
```

### Rejection Error Scenarios

```python
# Scenario 1: Not pending
try:
    LeaveRequestService.reject(
        request_id=12345,
        rejected_by=manager,
        reason="Already approved"
    )
except ValidationError as e:
    # Error: "Only pending requests can be rejected. Current status: Approved"
    pass

# Scenario 2: No reason provided
try:
    LeaveRequestService.reject(
        request_id=12346,
        rejected_by=manager,
        reason=""
    )
except ValidationError as e:
    # Error: "Rejection reason is required and must be at least 10 characters..."
    pass

# Scenario 3: Reason too short
try:
    LeaveRequestService.reject(
        request_id=12346,
        rejected_by=manager,
        reason="No"
    )
except ValidationError as e:
    # Error: "Rejection reason is required and must be at least 10 characters..."
    pass

# Scenario 4: Unauthorized rejecter
try:
    wrong_manager = User.objects.get(id=99)
    LeaveRequestService.reject(
        request_id=12346,
        rejected_by=wrong_manager,
        reason="Valid reason here"
    )
except ValidationError as e:
    # Error: "You are not authorized to approve this leave request..."
    pass
```

### Balance State Changes on Rejection

```
Before Rejection:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Employee: Kasun Perera
Leave Type: Annual Leave (2026)

Balance:
├─ total_days: 15.0
├─ available_days: 9.0
├─ pending_days: 6.0  ← Request in PENDING state
└─ used_days: 0.0

Calculation:
  total_days = available_days + pending_days + used_days
  15.0 = 9.0 + 6.0 + 0.0 ✓


After Rejection:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Balance:
├─ total_days: 15.0 (unchanged)
├─ available_days: 15.0  ← Restored
├─ pending_days: 0.0     ← Cleared
└─ used_days: 0.0 (unchanged)

Calculation:
  total_days = available_days + pending_days + used_days
  15.0 = 15.0 + 0.0 + 0.0 ✓
```

### Email Notification Template Example

```
Subject: Leave Request Rejected

Dear Kasun Perera,

Your leave request has been reviewed and unfortunately cannot be 
approved at this time.

Request Details:
- Leave Type: Annual Leave
- Dates: January 20-25, 2026 (6 days)
- Submitted: January 10, 2026

Rejection Reason:
"Insufficient staffing during peak sales period. Please request 
alternative dates after January 25."

Your leave balance has been restored. You can submit a new request 
with adjusted dates.

Current Balance:
- Annual Leave: 15.0 days available

If you have questions, please contact your manager Nimal Silva.

Best regards,
LankaERP Leave Management System
```

### Expected Outcome
- reject method transitions pending to rejected
- Balance restored atomically (pending to available)
- Rejection reason recorded
- Employee notified with clear reason
- Manager authorization verified
- Transaction ensures data consistency

### Verification Checklist
- [ ] reject method implemented
- [ ] @transaction.atomic decorator applied
- [ ] Status validation (PENDING only)
- [ ] Rejection reason validation (required, min length)
- [ ] Manager authorization check implemented
- [ ] Balance restoration logic implemented
- [ ] pending_days decremented correctly
- [ ] available_days incremented correctly
- [ ] rejection_reason field set
- [ ] Status changed to REJECTED
- [ ] Employee notification implemented
- [ ] Error handling for missing/short reason
- [ ] Transaction rollback on failure
- [ ] Returns updated LeaveRequest

---

## Task 52: Implement Cancel/Recall

### Overview
Implement the cancel and recall methods in LeaveRequestService. The cancel method allows employees to cancel pending requests before approval, while the recall method allows employees to recall approved requests before the leave start date. Both operations restore balance and notify the manager.

### Dependencies
- Task 46: Create LeaveRequestService

### Instructions

1. **Open request_service.py file**
   - Continue in `apps/leave/services/request_service.py`
   - Locate LeaveRequestService class

2. **Implement cancel method**
   - Method signature: `cancel(request_id, user)`
   - Wrap in @transaction.atomic decorator
   - Retrieve request and validate it's PENDING
   - Restore pending balance to available
   - Set status to CANCELLED
   - Save request
   - Notify manager of cancellation
   - Return updated request

3. **Implement recall method**
   - Method signature: `recall(request_id, user, reason)`
   - Wrap in @transaction.atomic decorator
   - Retrieve request and validate it's APPROVED
   - Validate current date is before start_date (can't recall after leave starts)
   - Restore used balance to available
   - Set status to RECALLED
   - Set recalled_at timestamp
   - Set recalled_reason
   - Save request
   - Notify manager of recall
   - Return updated request

4. **Add validation for cancel**
   - Check status == PENDING
   - Verify user is the employee (or has permission)

5. **Add validation for recall**
   - Check status == APPROVED
   - Verify current date < start_date
   - Verify user is the employee
   - Require recall reason

### cancel Method Implementation

```python
# Conceptual implementation
@staticmethod
@transaction.atomic
def cancel(request_id, user):
    """
    Cancel pending leave request.
    
    Employee cancels request before manager approval.
    Restores pending balance to available.
    
    Args:
        request_id: LeaveRequest ID
        user: User cancelling (employee)
    
    Returns:
        Updated LeaveRequest instance
    
    Raises:
        ValidationError: If validation fails
    """
    # Get request
    request = LeaveRequestService.get_request(request_id)
    
    # Validate request is PENDING
    if request.status != LEAVE_REQUEST_STATUS_PENDING:
        raise ValidationError(
            "Only pending requests can be cancelled. "
            f"Current status: {request.get_status_display()}"
        )
    
    # Verify user is the employee
    if request.employee.user_id != user.id:
        # Check if user has permission to cancel any request
        # if not user.has_perm('leave.cancel_any_request'):
        raise ValidationError(
            "You can only cancel your own leave requests"
        )
    
    # Restore balance
    LeaveRequestService._restore_balance_on_cancellation(request)
    
    # Update request
    request.status = LEAVE_REQUEST_STATUS_CANCELLED
    request.save()
    
    # Notify manager
    LeaveRequestService._notify_manager_cancellation(request)
    
    return request
```

### recall Method Implementation

```python
# Conceptual implementation
@staticmethod
@transaction.atomic
def recall(request_id, user, reason):
    """
    Recall approved leave request.
    
    Employee recalls approved leave before it starts.
    Restores used balance to available.
    
    Args:
        request_id: LeaveRequest ID
        user: User recalling (employee)
        reason: Reason for recall (required)
    
    Returns:
        Updated LeaveRequest instance
    
    Raises:
        ValidationError: If validation fails
    """
    # Get request
    request = LeaveRequestService.get_request(request_id)
    
    # Validate request is APPROVED
    if request.status != LEAVE_REQUEST_STATUS_APPROVED:
        raise ValidationError(
            "Only approved requests can be recalled. "
            f"Current status: {request.get_status_display()}"
        )
    
    # Verify user is the employee
    if request.employee.user_id != user.id:
        raise ValidationError(
            "You can only recall your own leave requests"
        )
    
    # Validate recall is before leave starts
    today = timezone.now().date()
    if today >= request.start_date:
        raise ValidationError(
            "Cannot recall leave that has already started. "
            f"Leave started on {request.start_date}"
        )
    
    # Validate recall reason
    if not reason or len(reason.strip()) < 10:
        raise ValidationError(
            "Recall reason is required and must be at least 10 characters"
        )
    
    # Restore balance
    LeaveRequestService._restore_balance_on_recall(request)
    
    # Update request
    request.status = LEAVE_REQUEST_STATUS_RECALLED
    request.recalled_at = timezone.now()
    request.recalled_reason = reason.strip()
    request.save()
    
    # Notify manager
    LeaveRequestService._notify_manager_recall(request)
    
    return request
```

### Balance Restoration on Cancellation

```python
# Conceptual helper method
@staticmethod
def _restore_balance_on_cancellation(request):
    """
    Restore balance when pending request is cancelled.
    
    Moves days from pending back to available.
    """
    balance = LeaveBalance.objects.get(
        tenant=request.tenant,
        employee=request.employee,
        leave_type=request.leave_type,
        year=request.start_date.year
    )
    
    # Restore balance
    balance.pending_days -= request.total_days
    balance.available_days += request.total_days
    balance.save()
```

### Balance Restoration on Recall

```python
# Conceptual helper method
@staticmethod
def _restore_balance_on_recall(request):
    """
    Restore balance when approved request is recalled.
    
    Moves days from used back to available.
    """
    balance = LeaveBalance.objects.get(
        tenant=request.tenant,
        employee=request.employee,
        leave_type=request.leave_type,
        year=request.start_date.year
    )
    
    # Restore balance
    balance.used_days -= request.total_days
    balance.available_days += request.total_days
    balance.save()
```

### Manager Notifications

```python
# Conceptual helper methods
@staticmethod
def _notify_manager_cancellation(request):
    """Notify manager that employee cancelled request"""
    # Send notification/email to manager
    pass

@staticmethod
def _notify_manager_recall(request):
    """Notify manager that employee recalled approved leave"""
    # Send notification/email to manager
    pass
```

### Cancel Workflow Diagram

```
┌──────────────────────────────────────────────────────────────┐
│               Cancel Workflow (PENDING)                       │
└──────────────────────────────────────────────────────────────┘

Request ID: 12347
Employee: Kasun Perera
Status: PENDING
Dates: Feb 14-18, 2026

Employee Action: Cancel

Step 1: Validate Status
├─ Check: status == PENDING ✓
└─ Valid for cancellation

Step 2: Verify User
├─ Check: user == employee.user ✓
└─ Authorized

Step 3: Restore Balance (Transaction)
├─ Before:
│  ├─ available_days: 10.0
│  └─ pending_days: 5.0
├─ After:
│  ├─ available_days: 15.0
│  └─ pending_days: 0.0
└─ Balance restored

Step 4: Update Request (Transaction)
├─ status: PENDING → CANCELLED
└─ Request saved

Step 5: Notify Manager
└─ "Kasun Perera cancelled leave request for Feb 14-18"

✅ Request now CANCELLED
```

### Recall Workflow Diagram

```
┌──────────────────────────────────────────────────────────────┐
│               Recall Workflow (APPROVED)                      │
└──────────────────────────────────────────────────────────────┘

Request ID: 12348
Employee: Kasun Perera
Status: APPROVED
Dates: Feb 14-18, 2026
Current Date: Feb 8, 2026

Employee Action: Recall
Reason: "Family plans changed, no longer need leave"

Step 1: Validate Status
├─ Check: status == APPROVED ✓
└─ Valid for recall

Step 2: Verify User
├─ Check: user == employee.user ✓
└─ Authorized

Step 3: Validate Date
├─ Check: current_date (Feb 8) < start_date (Feb 14) ✓
└─ Can recall (leave hasn't started)

Step 4: Validate Reason
├─ Check: reason length >= 10 ✓
└─ Reason provided

Step 5: Restore Balance (Transaction)
├─ Before:
│  ├─ available_days: 10.0
│  └─ used_days: 5.0
├─ After:
│  ├─ available_days: 15.0
│  └─ used_days: 0.0
└─ Balance restored

Step 6: Update Request (Transaction)
├─ status: APPROVED → RECALLED
├─ recalled_at: Feb 8, 2026 2:30 PM
├─ recalled_reason: "Family plans changed..."
└─ Request saved

Step 7: Notify Manager
└─ "Kasun Perera recalled approved leave (Feb 14-18)"
    Include reason

✅ Request now RECALLED
```

### Cancel Example Usage

```python
from apps.leave.services import LeaveRequestService

# Employee cancels pending request
request_id = 12347
employee_user = request.user

try:
    cancelled_request = LeaveRequestService.cancel(
        request_id=request_id,
        user=employee_user
    )
    
    print(f"Request cancelled successfully")
    print(f"Status: {cancelled_request.status}")  # CANCELLED
    
except ValidationError as e:
    print(f"Cancellation failed: {e}")
```

### Recall Example Usage

```python
# Employee recalls approved leave
request_id = 12348
employee_user = request.user
reason = "Family plans changed, no longer need leave"

try:
    recalled_request = LeaveRequestService.recall(
        request_id=request_id,
        user=employee_user,
        reason=reason
    )
    
    print(f"Request recalled successfully")
    print(f"Status: {recalled_request.status}")  # RECALLED
    print(f"Recalled at: {recalled_request.recalled_at}")
    print(f"Reason: {recalled_request.recalled_reason}")
    
except ValidationError as e:
    print(f"Recall failed: {e}")
```

### Error Scenarios

#### Cancel Errors
```python
# Scenario 1: Cannot cancel approved request
try:
    LeaveRequestService.cancel(request_id=12348, user=employee)
except ValidationError as e:
    # Error: "Only pending requests can be cancelled. Current status: Approved"
    pass

# Scenario 2: Unauthorized user
try:
    other_user = User.objects.get(id=99)
    LeaveRequestService.cancel(request_id=12347, user=other_user)
except ValidationError as e:
    # Error: "You can only cancel your own leave requests"
    pass
```

#### Recall Errors
```python
# Scenario 1: Cannot recall after leave started
try:
    # Today is Feb 15, leave started Feb 14
    LeaveRequestService.recall(
        request_id=12348,
        user=employee,
        reason="Changed plans"
    )
except ValidationError as e:
    # Error: "Cannot recall leave that has already started. 
    #         Leave started on Feb 14"
    pass

# Scenario 2: No recall reason
try:
    LeaveRequestService.recall(
        request_id=12348,
        user=employee,
        reason=""
    )
except ValidationError as e:
    # Error: "Recall reason is required and must be at least 10 characters"
    pass

# Scenario 3: Cannot recall pending request
try:
    LeaveRequestService.recall(
        request_id=12347,  # Status: PENDING
        user=employee,
        reason="Valid reason"
    )
except ValidationError as e:
    # Error: "Only approved requests can be recalled. Current status: Pending Approval"
    pass
```

### Balance State Changes

#### Cancel Balance Changes
```
Before Cancel (PENDING):
  available: 10.0, pending: 5.0, used: 0.0

After Cancel (CANCELLED):
  available: 15.0, pending: 0.0, used: 0.0
  
Change: pending → available
```

#### Recall Balance Changes
```
Before Recall (APPROVED):
  available: 10.0, pending: 0.0, used: 5.0

After Recall (RECALLED):
  available: 15.0, pending: 0.0, used: 0.0
  
Change: used → available
```

### Good Recall Reasons

```
✓ "Family emergency resolved earlier than expected, no longer 
   need time off"

✓ "Travel plans cancelled due to unexpected circumstances"

✓ "Realized conflict with important project deadline. Will 
   reschedule leave for later date"

✓ "Personal situation changed. Need to be available for work"

✓ "Prefer to use leave days later in the year. Will submit 
   new request"
```

### Expected Outcome
- cancel method allows employee to cancel pending requests
- recall method allows employee to recall approved requests before start date
- Balance restored correctly in both cases
- Appropriate validations enforce business rules
- Manager notified of cancellation/recall
- Transactions ensure data consistency

### Verification Checklist
- [ ] cancel method implemented
- [ ] @transaction.atomic on cancel
- [ ] Status validation (PENDING only) for cancel
- [ ] User authorization check for cancel
- [ ] Balance restoration on cancel
- [ ] Manager notification on cancel
- [ ] recall method implemented
- [ ] @transaction.atomic on recall
- [ ] Status validation (APPROVED only) for recall
- [ ] Date validation (before start_date) for recall
- [ ] Recall reason validation (required, min length)
- [ ] User authorization check for recall
- [ ] Balance restoration on recall
- [ ] recalled_at timestamp set
- [ ] recalled_reason field set
- [ ] Manager notification on recall
- [ ] Error handling for all validations
- [ ] Both methods return updated LeaveRequest

---

## Summary

This document established the LeaveRequest service layer with complete workflow operations:

### Completed Components
- ✅ LeaveRequestService class with core methods
- ✅ Draft creation and request retrieval
- ✅ Submit workflow with validations
- ✅ Balance validation (sufficient days check)
- ✅ Overlap detection (date conflict prevention)
- ✅ Approval workflow (pending to approved)
- ✅ Rejection workflow (pending to rejected with reason)
- ✅ Cancel workflow (employee cancels pending)
- ✅ Recall workflow (employee recalls approved)

### Key Achievements
1. **Transaction Safety** - All state-changing operations wrapped in atomic transactions
2. **Comprehensive Validation** - Balance, overlap, status, authorization checks
3. **Balance Management** - Proper movement between available, pending, and used days
4. **Audit Trail** - Tracks who approved/rejected/cancelled/recalled and when
5. **Notification Support** - Placeholder for manager and employee notifications
6. **Error Handling** - Clear, actionable error messages for all validation failures

### Service Method Summary

| Method | Purpose | Status Change | Balance Impact |
|--------|---------|---------------|----------------|
| create_draft | Create new request | → DRAFT | None |
| submit | Submit for approval | DRAFT → PENDING | available → pending |
| approve | Manager approves | PENDING → APPROVED | pending → used |
| reject | Manager rejects | PENDING → REJECTED | pending → available |
| cancel | Employee cancels | PENDING → CANCELLED | pending → available |
| recall | Employee recalls | APPROVED → RECALLED | used → available |

### Workflow Diagram Complete

```
                    ┌─────────┐
                    │  DRAFT  │
                    └────┬────┘
                         │ submit()
                         ▼
                    ┌─────────┐
                    │ PENDING │
                    └────┬────┘
                         │
        ┌────────────────┼────────────────┐
        │                │                │
    approve()        reject()         cancel()
        │                │                │
        ▼                ▼                ▼
   ┌─────────┐      ┌──────────┐   ┌───────────┐
   │APPROVED │      │ REJECTED │   │ CANCELLED │
   └────┬────┘      └──────────┘   └───────────┘
        │
    recall()
    (before start)
        │
        ▼
   ┌──────────┐
   │ RECALLED │
   └──────────┘
```

### Next Steps
This completes Group C: LeaveRequest Workflow. Proceed to:
- **Group D:** Holiday & Calendar Management
- **Group E:** Leave Reports & Analytics
- **Group F:** Leave Policies & Rules

---

**Document Status:** ✅ Complete  
**Total Tasks:** 7  
**Total Lines:** ~1385
