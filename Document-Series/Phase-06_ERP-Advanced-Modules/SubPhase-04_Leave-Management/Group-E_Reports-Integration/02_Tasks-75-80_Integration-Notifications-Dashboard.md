# Tasks 75-80: Integration, Notifications, and Dashboard

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 04 - Leave Management  
> **Group:** E - Reports & Integration  
> **Document:** 02 of 02  
> **Tasks Covered:** 75, 76, 77, 78, 79, 80

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-67-74_Reports-Export.md](01_Tasks-67-74_Reports-Export.md)

---

## Document Overview

This document covers the integration of the Leave Management module with other ERP modules (Attendance and Payroll), implementation of a comprehensive notification system, and creation of dashboard data services. These integrations ensure seamless data flow across modules and provide users with timely notifications and actionable dashboard insights.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 75 | Integrate with Attendance | High | 30 min |
| 76 | Integrate with Payroll | High | 30 min |
| 77 | Create Leave Notification Service | High | 30 min |
| 78 | Implement Request Submitted Notification | Medium | 20 min |
| 79 | Implement Approval Notification | Medium | 20 min |
| 80 | Create Leave Dashboard Data | Medium | 25 min |

---

## Task 75: Integrate with Attendance

### Overview
Integrate the Leave Management module with the Attendance module to automatically mark employees as "ON_LEAVE" in attendance records when their leave requests are approved. This integration ensures attendance tracking accurately reflects leave status and eliminates manual attendance marking for approved leaves.

### Dependencies
- LeaveRequest model exists
- Attendance module exists
- AttendanceRecord model available
- Employee model exists
- Leave approval workflow implemented

### Instructions

1. **Create integrations directory structure**
   - Navigate to `apps/leave/` directory
   - Create `integrations/` subdirectory
   - Create `__init__.py` in integrations directory

2. **Create attendance_integration.py file**
   - Create file at `apps/leave/integrations/attendance_integration.py`
   - Add module docstring explaining integration purpose
   - Import necessary modules

3. **Import required modules**
   - Import LeaveRequest model
   - Import AttendanceRecord model (from attendance app)
   - Import Employee model
   - Import date utilities
   - Import Django transaction utilities
   - Import logger

4. **Define AttendanceIntegration class**
   - Create service class with descriptive docstring
   - Add tenant-aware approach
   - Include error handling

5. **Add initialization method**
   - Accept optional tenant parameter
   - Store tenant for queries
   - Initialize logger for debugging

6. **Create mark_leave_in_attendance() method**
   - Accept leave_request parameter
   - Validate leave request is approved
   - Get date range from leave request
   - Iterate through each day in range
   - Check if working day (skip weekends/holidays)
   - Create or update AttendanceRecord
   - Set status to ON_LEAVE
   - Set leave_request foreign key reference

7. **Create clear_leave_from_attendance() method**
   - Accept leave_request parameter
   - Get date range from leave request
   - Find all related attendance records
   - Clear ON_LEAVE status
   - Clear leave_request foreign key
   - Reset to pending/unmarked status

8. **Add is_working_day() helper method**
   - Accept date parameter
   - Check if weekend (Saturday/Sunday for most Sri Lankan companies)
   - Check if public holiday (Poya days, festivals)
   - Check if company holiday
   - Return boolean

9. **Add get_working_days_in_range() helper method**
   - Accept start_date and end_date
   - Generate list of dates in range
   - Filter out non-working days
   - Return list of working dates

10. **Implement handle_leave_approval() method**
    - Triggered when leave is approved
    - Mark attendance for all working days
    - Use database transaction for atomicity
    - Log success/failure
    - Raise exception on error

11. **Implement handle_leave_rejection() method**
    - Triggered when leave is rejected
    - No attendance marking needed
    - Log for audit trail

12. **Implement handle_leave_cancellation() method**
    - Triggered when approved leave is cancelled
    - Clear attendance records
    - Use database transaction
    - Log changes

13. **Add sync_attendance_for_leave() method**
    - Manual sync method for corrections
    - Re-mark attendance for given leave request
    - Handle edge cases (partial overlaps)
    - Return sync report

14. **Update integrations __init__.py**
    - Import AttendanceIntegration
    - Add to __all__ list

### AttendanceIntegration Structure

```
┌──────────────────────────────────────────────────────┐
│          AttendanceIntegration Class                 │
├──────────────────────────────────────────────────────┤
│ Core Methods:                                        │
│  • mark_leave_in_attendance()                        │
│  • clear_leave_from_attendance()                     │
│  • handle_leave_approval()                           │
│  • handle_leave_rejection()                          │
│  • handle_leave_cancellation()                       │
│  • sync_attendance_for_leave()                       │
│                                                      │
│ Helper Methods:                                      │
│  • is_working_day()                                  │
│  • get_working_days_in_range()                       │
│  • _create_attendance_record()                       │
│  • _update_attendance_record()                       │
└──────────────────────────────────────────────────────┘
```

### Integration Architecture

```
┌─────────────────────────────────────────────────┐
│          Leave Request Workflow                 │
└─────────────────────────────────────────────────┘
                      │
                      │ Status Change
                      ▼
┌─────────────────────────────────────────────────┐
│      AttendanceIntegration Service              │
└─────────────────────────────────────────────────┘
                      │
         ┌────────────┼────────────┐
         ▼            ▼            ▼
    [APPROVED]   [REJECTED]   [CANCELLED]
         │            │            │
         ▼            ▼            ▼
    Mark ON_LEAVE   No Action   Clear Records
         │
         ▼
┌─────────────────────────────────────────────────┐
│         AttendanceRecord Model                  │
│  • date                                         │
│  • employee                                     │
│  • status = ON_LEAVE                            │
│  • leave_request (FK)                           │
└─────────────────────────────────────────────────┘
```

### Leave Approval to Attendance Flow

```
Leave Request Approved
        │
        ▼
Get Leave Date Range
        │
        ├─> start_date: 2026-01-27
        └─> end_date: 2026-01-29
        │
        ▼
Generate Working Days List
        │
        ├─> 2026-01-27 (Monday) ✓
        ├─> 2026-01-28 (Tuesday) ✓
        └─> 2026-01-29 (Wednesday) ✓
        │
        ▼
For Each Working Day:
        │
        ├─> Check if AttendanceRecord exists
        │   │
        │   ├─> If exists:
        │   │   └─> Update status = ON_LEAVE
        │   │       Update leave_request FK
        │   │
        │   └─> If not exists:
        │       └─> Create new AttendanceRecord
        │           Set status = ON_LEAVE
        │           Set leave_request FK
        │
        ▼
Log Success
```

### Attendance Status Values

```
AttendanceRecord.status choices:
│
├─> PRESENT - Employee marked present
├─> ABSENT - Employee absent (unauthorized)
├─> ON_LEAVE - Employee on approved leave ← Set by integration
├─> HALF_DAY - Half day attendance
├─> LATE - Late arrival
├─> EARLY_OUT - Early departure
└─> PENDING - Not yet marked
```

### Sample Integration Usage

```python
# In LeaveRequest model save method or signal
from apps.leave.integrations import AttendanceIntegration

def approve_leave_request(leave_request):
    # Update leave request status
    leave_request.status = 'APPROVED'
    leave_request.approved_by = current_user
    leave_request.approved_at = timezone.now()
    leave_request.save()
    
    # Mark attendance automatically
    integration = AttendanceIntegration(tenant=leave_request.tenant)
    try:
        integration.handle_leave_approval(leave_request)
        logger.info(f"Attendance marked for leave {leave_request.id}")
    except Exception as e:
        logger.error(f"Failed to mark attendance: {e}")
        # Decide: rollback leave approval or continue?
        # raise Exception("Attendance marking failed")
```

### Working Day Detection

```python
def is_working_day(self, date, employee):
    """
    Determine if date is a working day
    
    Checks (in order):
    1. Day of week (skip Saturday/Sunday for 5-day week)
    2. Public holidays (Poya days, national holidays)
    3. Company holidays
    4. Department-specific non-working days
    
    Returns:
        bool: True if working day, False otherwise
    """
    # Check day of week
    if date.weekday() in [5, 6]:  # Saturday, Sunday
        return False
    
    # Check public holidays
    if PublicHoliday.objects.filter(
        tenant=self.tenant,
        date=date
    ).exists():
        return False
    
    # Check Poya days
    if is_poya_day(date):
        return False
    
    # Check company holidays
    if CompanyHoliday.objects.filter(
        tenant=self.tenant,
        date=date
    ).exists():
        return False
    
    return True
```

### Database Transaction Example

```python
from django.db import transaction

@transaction.atomic
def handle_leave_approval(self, leave_request):
    """
    Handle leave approval with transaction
    
    If any attendance record fails, all rollback
    """
    if leave_request.status != 'APPROVED':
        raise ValueError("Leave request must be approved")
    
    working_days = self.get_working_days_in_range(
        leave_request.start_date,
        leave_request.end_date
    )
    
    for date in working_days:
        # Create or update attendance record
        attendance, created = AttendanceRecord.objects.update_or_create(
            tenant=self.tenant,
            employee=leave_request.employee,
            date=date,
            defaults={
                'status': 'ON_LEAVE',
                'leave_request': leave_request,
                'updated_by': leave_request.approved_by
            }
        )
        
        action = "Created" if created else "Updated"
        logger.info(f"{action} attendance for {date}")
    
    return {
        'success': True,
        'days_marked': len(working_days),
        'dates': [str(d) for d in working_days]
    }
```

### Sri Lanka Context

#### Public Holiday Integration
```
Sri Lankan Public Holidays:
│
├─> Poya Days (Full Moon)
│   • Every month (13 per year)
│   • Religious observance day
│   • Public holiday
│   • Exclude from leave deduction
│
├─> National Holidays
│   • Independence Day (Feb 4)
│   • Sinhala & Tamil New Year (Apr 13-14)
│   • May Day (May 1)
│   • Vesak (May - Poya day)
│   • Christmas (Dec 25)
│
└─> Regional Holidays
    • Depends on location
    • Hindu/Muslim festivals
```

#### Working Week Variations
```
Common Working Schedules in Sri Lanka:
│
├─> 5-Day Week (Monday-Friday)
│   • Most private companies
│   • Weekends: Saturday, Sunday
│
├─> 5.5-Day Week (Monday-Saturday half)
│   • Some retail/manufacturing
│   • Saturday morning only
│
└─> 6-Day Week (Monday-Saturday)
    • Some industries
    • Sunday only off
```

#### Attendance Marking Example
```
Leave Request: LR-2026-0145
Employee: Nimal Perera
Leave Type: Annual Leave
Dates: January 27-31, 2026 (5 calendar days)

Working Days Analysis:
  • Jan 27 (Monday) - Working day ✓
  • Jan 28 (Tuesday) - Working day ✓
  • Jan 29 (Wednesday) - Working day ✓
  • Jan 30 (Thursday) - Working day ✓
  • Jan 31 (Friday) - Working day ✓

Attendance Records Created:
  ✓ Jan 27: Status = ON_LEAVE, Leave = LR-2026-0145
  ✓ Jan 28: Status = ON_LEAVE, Leave = LR-2026-0145
  ✓ Jan 29: Status = ON_LEAVE, Leave = LR-2026-0145
  ✓ Jan 30: Status = ON_LEAVE, Leave = LR-2026-0145
  ✓ Jan 31: Status = ON_LEAVE, Leave = LR-2026-0145

Total Working Days Marked: 5
```

#### Poya Day Handling
```
Leave Request: January 15-17, 2026
  • Jan 15 (Wednesday) - Full Moon Poya Day 🌕
  • Jan 16 (Thursday) - Working day
  • Jan 17 (Friday) - Working day

Working Days to Mark:
  • Jan 15 - SKIP (Public holiday)
  • Jan 16 - Mark ON_LEAVE ✓
  • Jan 17 - Mark ON_LEAVE ✓

Leave Balance Deduction:
  • Total calendar days: 3
  • Poya days: 1 (not deducted)
  • Leave days deducted: 2
```

### Edge Cases to Handle

| Scenario | Handling |
|----------|----------|
| Leave spans weekend | Skip weekend days, mark only working days |
| Leave includes Poya day | Skip Poya day, mark other days |
| Attendance already marked | Update existing record, preserve notes |
| Leave cancelled mid-period | Clear future dates only, preserve past |
| Half-day leave | Set status to HALF_DAY_LEAVE instead |
| Overlapping leave requests | Prevent at application, validate in integration |

### Expected Outcome
- Automated attendance marking
- Accurate ON_LEAVE tracking
- Working day filtering
- Transaction safety
- Public holiday handling

### Verification Checklist
- [ ] integrations/ directory created
- [ ] attendance_integration.py file created
- [ ] AttendanceIntegration class defined
- [ ] mark_leave_in_attendance() implemented
- [ ] clear_leave_from_attendance() implemented
- [ ] handle_leave_approval() implemented
- [ ] handle_leave_cancellation() implemented
- [ ] is_working_day() helper implemented
- [ ] get_working_days_in_range() implemented
- [ ] Database transactions used
- [ ] Public holiday checking works
- [ ] Poya day handling implemented
- [ ] Integration imported in __init__.py

---

## Task 76: Integrate with Payroll

### Overview
Integrate the Leave Management module with the Payroll module to provide accurate leave information for salary calculations. This integration exports leave data including paid/unpaid leave days, leave types, and deductions, ensuring payroll processing reflects actual leave taken.

### Dependencies
- LeaveRequest model exists
- LeaveBalance model exists
- LeaveType model exists
- Payroll module exists
- PayrollPeriod model available
- Employee model exists

### Instructions

1. **Create payroll_integration.py file**
   - Create file at `apps/leave/integrations/payroll_integration.py`
   - Add module docstring explaining integration purpose
   - Import necessary modules

2. **Import required modules**
   - Import LeaveRequest model
   - Import LeaveBalance model
   - Import LeaveType model
   - Import Employee model
   - Import date utilities
   - Import Decimal for calculations
   - Import logger

3. **Define PayrollIntegration class**
   - Create service class with descriptive docstring
   - Add tenant-aware approach
   - Include type hints

4. **Add initialization method**
   - Accept optional tenant parameter
   - Store tenant for queries
   - Initialize logger

5. **Create get_leave_data_for_payroll() method**
   - Accept employee_id parameter
   - Accept payroll_period (start_date, end_date)
   - Retrieve all leave requests in period
   - Filter approved requests only
   - Calculate paid vs unpaid days
   - Return structured leave data

6. **Create calculate_paid_leave_days() method**
   - Accept leave requests queryset
   - Iterate through requests
   - Check if leave type is paid
   - Sum paid leave days
   - Handle half-day leaves
   - Return total paid days

7. **Create calculate_unpaid_leave_days() method**
   - Accept leave requests queryset
   - Iterate through requests
   - Check if leave type is unpaid
   - Sum unpaid leave days
   - Return total unpaid days

8. **Create get_leave_summary_by_type() method**
   - Accept employee_id and period
   - Group leave requests by leave type
   - Calculate days per type
   - Distinguish paid/unpaid per type
   - Return dictionary breakdown

9. **Create calculate_leave_deductions() method**
   - Accept employee_id and period
   - Get unpaid leave days
   - Calculate salary deduction amount
   - Get employee daily rate
   - Calculate: unpaid_days × daily_rate
   - Return deduction amount

10. **Create get_leave_balance_snapshot() method**
    - Accept employee_id and date
    - Get leave balances at specific date
    - Calculate available days
    - Return balance snapshot

11. **Add export_monthly_leave_data() method**
    - Accept month and year
    - Accept optional employee_id
    - Get all employees (or single employee)
    - For each employee:
      - Get leave data for month
      - Calculate totals
      - Format for payroll system
    - Return list of employee leave data

12. **Add get_leave_impact_on_salary() method**
    - Accept employee_id and period
    - Calculate total impact:
      - Unpaid leave deductions
      - No-pay leave deductions
      - Leave without pay
    - Return impact details

13. **Create sync_leave_to_payroll() method**
    - Manual trigger for payroll sync
    - Accept payroll period ID
    - Get all approved leaves in period
    - Generate leave summary for each employee
    - Export to payroll system format
    - Return sync report

14. **Update integrations __init__.py**
    - Import PayrollIntegration
    - Add to __all__ list

### PayrollIntegration Structure

```
┌──────────────────────────────────────────────────────┐
│          PayrollIntegration Class                    │
├──────────────────────────────────────────────────────┤
│ Core Methods:                                        │
│  • get_leave_data_for_payroll()                      │
│  • calculate_paid_leave_days()                       │
│  • calculate_unpaid_leave_days()                     │
│  • get_leave_summary_by_type()                       │
│  • calculate_leave_deductions()                      │
│  • get_leave_balance_snapshot()                      │
│  • export_monthly_leave_data()                       │
│  • get_leave_impact_on_salary()                      │
│  • sync_leave_to_payroll()                           │
│                                                      │
│ Helper Methods:                                      │
│  • _get_employee_daily_rate()                        │
│  • _calculate_working_days()                         │
│  • _is_paid_leave_type()                             │
└──────────────────────────────────────────────────────┘
```

### Integration Architecture

```
┌─────────────────────────────────────────────────┐
│          Leave Management Module                │
│  • LeaveRequest (approved)                      │
│  • LeaveBalance                                 │
│  • LeaveType (paid/unpaid flag)                 │
└─────────────────────────────────────────────────┘
                      │
                      │ Data Export
                      ▼
┌─────────────────────────────────────────────────┐
│      PayrollIntegration Service                 │
│  • Calculate paid/unpaid days                   │
│  • Calculate deductions                         │
│  • Format for payroll                           │
└─────────────────────────────────────────────────┘
                      │
                      │ Leave Data
                      ▼
┌─────────────────────────────────────────────────┐
│          Payroll Processing Module              │
│  • Monthly salary calculation                   │
│  • Deduction application                        │
│  • Pay slip generation                          │
└─────────────────────────────────────────────────┘
```

### Leave Data Export Structure

```json
{
  "employee_id": "EMP-0001",
  "employee_code": "E001",
  "name": "Nimal Perera",
  "department": "IT",
  "period": {
    "month": 1,
    "year": 2026,
    "start_date": "2026-01-01",
    "end_date": "2026-01-31",
    "working_days": 22
  },
  "leave_summary": {
    "total_leave_days": 5,
    "paid_leave_days": 5,
    "unpaid_leave_days": 0,
    "no_pay_days": 0,
    "by_type": {
      "Annual Leave": {
        "days": 3,
        "is_paid": true,
        "requests": 1
      },
      "Casual Leave": {
        "days": 2,
        "is_paid": true,
        "requests": 1
      }
    }
  },
  "deductions": {
    "leave_deduction": 0.00,
    "no_pay_deduction": 0.00,
    "total_deduction": 0.00,
    "currency": "LKR"
  },
  "actual_working_days": 17,
  "attendance_percentage": 77.27
}
```

### Payroll Calculation Example

```
Employee: Nimal Perera
Monthly Salary: LKR 100,000
Working Days in January 2026: 22 days
Daily Rate: LKR 100,000 ÷ 22 = LKR 4,545.45

Leave Taken in January:
  • Annual Leave (Paid): 3 days
  • Casual Leave (Paid): 2 days
  • Total: 5 days

Salary Calculation:
  • Base Salary: LKR 100,000
  • Paid Leave Days: 5 (no deduction)
  • Unpaid Leave Days: 0
  • Deduction: LKR 0
  • Net Salary: LKR 100,000

Actual Working Days:
  • Total Working Days: 22
  • Paid Leave: 5
  • Actual Work: 17
  • Attendance: 17/22 = 77.27%
```

### Unpaid Leave Deduction Example

```
Employee: Kumari Silva
Monthly Salary: LKR 80,000
Working Days in January 2026: 22 days
Daily Rate: LKR 80,000 ÷ 22 = LKR 3,636.36

Leave Taken in January:
  • Annual Leave (Paid): 2 days
  • No Pay Leave (Unpaid): 3 days
  • Total: 5 days

Salary Calculation:
  • Base Salary: LKR 80,000
  • Paid Leave Days: 2 (no deduction)
  • Unpaid Leave Days: 3
  • Deduction: 3 × LKR 3,636.36 = LKR 10,909.08
  • Net Salary: LKR 80,000 - LKR 10,909.08 = LKR 69,090.92

Actual Working Days:
  • Total Working Days: 22
  • Paid Leave: 2
  • Unpaid Leave: 3
  • Actual Work: 17
  • Pay Days: 19 (work + paid leave)
```

### Leave Type Classification

```
Leave Types for Payroll:
│
├─> Paid Leave (No deduction)
│   • Annual Leave
│   • Casual Leave
│   • Sick Leave (with certificate)
│   • Medical Leave
│   • Maternity Leave (paid portion)
│
├─> Unpaid Leave (Deduct from salary)
│   • No Pay Leave
│   • Leave Without Pay
│   • Sick Leave (without certificate, exceeded)
│   • Maternity Leave (unpaid portion)
│
└─> Special Cases
    • Half-pay leave (50% deduction)
    • Advance leave (deduct if not accrued)
```

### Sample Integration Usage

```python
from apps.leave.integrations import PayrollIntegration

# In payroll processing service
def process_monthly_payroll(month, year):
    integration = PayrollIntegration(tenant=current_tenant)
    
    # Export all employees' leave data
    leave_data = integration.export_monthly_leave_data(
        month=month,
        year=year
    )
    
    for employee_leave in leave_data:
        employee_id = employee_leave['employee_id']
        
        # Calculate salary
        base_salary = get_employee_salary(employee_id)
        
        # Apply leave deductions
        deductions = employee_leave['deductions']['total_deduction']
        
        # Generate payslip
        net_salary = base_salary - deductions
        
        create_payslip(
            employee_id=employee_id,
            base_salary=base_salary,
            leave_deductions=deductions,
            net_salary=net_salary,
            leave_days=employee_leave['leave_summary']['total_leave_days']
        )
```

### Daily Rate Calculation Methods

```
Method 1: Fixed Days Method
  Daily Rate = Monthly Salary ÷ Fixed Days (e.g., 26)
  
  Example:
    Salary: LKR 100,000
    Fixed Days: 26
    Daily Rate: LKR 100,000 ÷ 26 = LKR 3,846.15

Method 2: Actual Working Days Method
  Daily Rate = Monthly Salary ÷ Actual Working Days
  
  Example (January 2026):
    Salary: LKR 100,000
    Working Days: 22
    Daily Rate: LKR 100,000 ÷ 22 = LKR 4,545.45

Method 3: Calendar Days Method (Rare)
  Daily Rate = Monthly Salary ÷ Calendar Days
  
  Example:
    Salary: LKR 100,000
    Calendar Days: 31
    Daily Rate: LKR 100,000 ÷ 31 = LKR 3,225.81

Most Common in Sri Lanka: Method 2 (Actual Working Days)
```

### Sri Lanka Context

#### Statutory Leave Provisions
```
Sri Lankan Employment Law:
│
├─> Annual Leave
│   • Minimum 14 working days per year
│   • Paid leave
│   • Cannot be forfeited
│
├─> Casual Leave
│   • 7 days per year (typical)
│   • Paid leave
│   • Not carry-forward
│
├─> Sick Leave
│   • 7 days per year (typical)
│   • Paid with medical certificate
│   • Unpaid without certificate
│
└─> Maternity Leave
    • 84 days (12 weeks)
    • Paid for first 14 days by employer
    • Remaining from social security
```

#### Payroll Integration Example
```
Monthly Payroll Report - January 2026
Department: IT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Employee: Nimal Perera (E001)
  Base Salary: LKR 100,000
  Working Days: 22
  Leave Days: 5 (Annual: 3, Casual: 2)
  Leave Type: Paid
  Deduction: LKR 0
  Net Impact: LKR 100,000 (No change)
  
Employee: Kumari Silva (E002)
  Base Salary: LKR 80,000
  Working Days: 22
  Leave Days: 5 (Annual: 2, No-Pay: 3)
  Leave Type: Mixed
  Deduction: LKR 10,909.08 (3 days unpaid)
  Net Impact: LKR 69,090.92
  
Department Total:
  Total Employees: 20
  Total Leave Days: 95
  Paid Leave Days: 80
  Unpaid Leave Days: 15
  Total Deductions: LKR 54,545.40
```

#### EPF/ETF Considerations
```
Sri Lankan Provident Funds:
│
├─> EPF (Employees' Provident Fund)
│   • Employee: 8% of basic salary
│   • Employer: 12% of basic salary
│   • Calculate on full salary or adjusted?
│   • Usually on full salary for paid leave
│
└─> ETF (Employees' Trust Fund)
    • Employer: 3% of basic salary
    • Calculate on full salary or adjusted?
    
Note: For unpaid leave, calculate EPF/ETF on 
      reduced salary (after leave deductions)
```

### Half-Day Leave Handling

```
Half-Day Leave Calculation:
│
├─> Half-Day Leave Taken: 1 half-day
│   • Count as: 0.5 days
│   • If paid type: No deduction
│   • If unpaid type: Deduct 0.5 × daily rate
│
└─> Example:
    Employee daily rate: LKR 4,545.45
    Half-day unpaid leave: LKR 2,272.73
```

### Expected Outcome
- Accurate leave data export
- Paid/unpaid leave classification
- Salary deduction calculation
- Monthly payroll integration
- EPF/ETF compliance

### Verification Checklist
- [ ] payroll_integration.py file created
- [ ] PayrollIntegration class defined
- [ ] get_leave_data_for_payroll() implemented
- [ ] calculate_paid_leave_days() implemented
- [ ] calculate_unpaid_leave_days() implemented
- [ ] get_leave_summary_by_type() implemented
- [ ] calculate_leave_deductions() implemented
- [ ] export_monthly_leave_data() implemented
- [ ] Daily rate calculation method chosen
- [ ] Half-day leave handling implemented
- [ ] Sri Lankan statutory compliance considered
- [ ] Integration imported in __init__.py

---

## Task 77: Create Leave Notification Service

### Overview
Create a comprehensive notification service for the Leave Management module that handles all leave-related notifications. This service sends email and push notifications to employees and managers for various leave events such as request submissions, approvals, rejections, cancellations, balance expiry warnings, and upcoming leave reminders.

### Dependencies
- LeaveRequest model exists
- Employee model with email fields
- Django email backend configured
- Celery task queue configured
- Notification templates created

### Instructions

1. **Create services/notification_service.py file**
   - Create file at `apps/leave/services/notification_service.py`
   - Add module docstring explaining notification service
   - Import necessary modules

2. **Import required modules**
   - Import Django email utilities
   - Import template rendering utilities
   - Import LeaveRequest model
   - Import Employee model
   - Import LeaveBalance model
   - Import timezone utilities
   - Import logger

3. **Define LeaveNotificationService class**
   - Create service class with descriptive docstring
   - Add tenant-aware approach
   - Include retry logic for failed sends

4. **Add initialization method**
   - Accept optional tenant parameter
   - Store tenant for queries
   - Initialize email backend
   - Initialize logger

5. **Create send_email() helper method**
   - Accept recipient email
   - Accept subject
   - Accept html_content
   - Accept plain_text_content (fallback)
   - Use Django's send_mail or EmailMultiAlternatives
   - Handle send failures gracefully
   - Log all email sends

6. **Create render_email_template() helper method**
   - Accept template_name
   - Accept context dictionary
   - Render HTML email template
   - Render plain text version
   - Return both versions

7. **Create get_recipient_emails() helper method**
   - Accept employee or user object
   - Get primary email
   - Get alternative emails (if configured)
   - Validate email addresses
   - Return list of valid emails

8. **Create notify_request_submitted() method**
   - Accept leave_request parameter
   - Get manager/approver email
   - Prepare notification context
   - Render submission notification template
   - Send email to manager
   - Log notification

9. **Create notify_approval() method**
   - Accept leave_request parameter
   - Get employee email
   - Prepare approval context
   - Render approval notification template
   - Send email to employee
   - Log notification

10. **Create notify_rejection() method**
    - Accept leave_request parameter
    - Get employee email
    - Prepare rejection context (include reason)
    - Render rejection notification template
    - Send email to employee
    - Log notification

11. **Create notify_cancellation() method**
    - Accept leave_request parameter
    - Get manager and employee emails
    - Prepare cancellation context
    - Render cancellation template
    - Send to both parties
    - Log notification

12. **Create notify_upcoming_leave() method**
    - Accept leave_request parameter
    - Accept days_before parameter (default 3)
    - Check if leave starts within days_before
    - Send reminder to employee
    - Optionally notify manager
    - Log notification

13. **Create notify_expiring_balance() method**
    - Accept leave_balance parameter
    - Accept days_until_expiry parameter
    - Prepare expiry warning context
    - Include balance details
    - Send warning to employee
    - Copy manager (optional)
    - Log notification

14. **Create notify_balance_allocated() method**
    - Accept employee and year parameters
    - Notify employee of new allocations
    - Include balance breakdown
    - Send welcome/allocation email
    - Log notification

15. **Add batch notification methods**
    - Method: send_bulk_expiry_notifications()
    - Method: send_bulk_upcoming_reminders()
    - Accept list of targets
    - Send in batches to avoid spam filters
    - Include delay between sends
    - Return success/failure counts

16. **Create tasks/notification_tasks.py file**
    - Create Celery tasks for async sending
    - Task: send_leave_notification_async()
    - Task: send_expiry_reminders_batch()
    - Use retry decorator for failures

17. **Update services __init__.py**
    - Import LeaveNotificationService
    - Add to __all__ list

### LeaveNotificationService Structure

```
┌──────────────────────────────────────────────────────┐
│      LeaveNotificationService Class                  │
├──────────────────────────────────────────────────────┤
│ Core Notification Methods:                           │
│  • notify_request_submitted()                        │
│  • notify_approval()                                 │
│  • notify_rejection()                                │
│  • notify_cancellation()                             │
│  • notify_upcoming_leave()                           │
│  • notify_expiring_balance()                         │
│  • notify_balance_allocated()                        │
│                                                      │
│ Batch Methods:                                       │
│  • send_bulk_expiry_notifications()                  │
│  • send_bulk_upcoming_reminders()                    │
│                                                      │
│ Helper Methods:                                      │
│  • send_email()                                      │
│  • render_email_template()                           │
│  • get_recipient_emails()                            │
│  • _validate_email()                                 │
└──────────────────────────────────────────────────────┘
```

### Notification Flow Architecture

```
┌─────────────────────────────────────────────────┐
│          Leave Event Occurs                     │
│  (Request, Approval, Rejection, etc.)           │
└─────────────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────┐
│    LeaveNotificationService.notify_xxx()        │
│  • Prepare notification context                 │
│  • Determine recipients                         │
│  • Render email template                        │
└─────────────────────────────────────────────────┘
                      │
         ┌────────────┼────────────┐
         ▼            ▼            ▼
    [Sync Send]  [Async Send]  [Scheduled]
         │            │            │
         ▼            ▼            ▼
┌──────────────┐ ┌──────────┐ ┌──────────┐
│ Django Email │ │  Celery  │ │  Cron    │
│   Backend    │ │   Task   │ │  Job     │
└──────────────┘ └──────────┘ └──────────┘
         │            │            │
         └────────────┼────────────┘
                      ▼
┌─────────────────────────────────────────────────┐
│          Recipient Email Inbox                  │
└─────────────────────────────────────────────────┘
```

### Notification Types and Triggers

```
Leave Request Notifications:
│
├─> Request Submitted
│   • Trigger: Employee submits request
│   • Recipient: Manager/Approver
│   • Content: Request details, approve/reject links
│
├─> Request Approved
│   • Trigger: Manager approves
│   • Recipient: Employee
│   • Content: Approval confirmation, leave dates
│
├─> Request Rejected
│   • Trigger: Manager rejects
│   • Recipient: Employee
│   • Content: Rejection reason, re-apply guidance
│
├─> Request Cancelled
│   • Trigger: Employee/Manager cancels
│   • Recipient: Both parties
│   • Content: Cancellation details
│
├─> Upcoming Leave Reminder
│   • Trigger: 3 days before leave starts
│   • Recipient: Employee, Manager
│   • Content: Leave reminder, preparation notes
│
├─> Balance Expiring Warning
│   • Trigger: 30 days before expiry
│   • Recipient: Employee
│   • Content: Days expiring, usage suggestions
│
└─> Balance Allocated
    • Trigger: New year allocation
    • Recipient: Employee
    • Content: New balance details
```

### Email Template Example

#### Request Submitted Notification (to Manager)
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>New Leave Request - {{ employee.name }}</title>
</head>
<body>
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #366092;">New Leave Request</h2>
        
        <p>Dear {{ manager.name }},</p>
        
        <p>{{ employee.name }} ({{ employee.employee_code }}) has submitted a leave request for your approval.</p>
        
        <div style="background: #f5f5f5; padding: 15px; margin: 20px 0; border-left: 4px solid #366092;">
            <strong>Leave Details:</strong><br>
            <strong>Employee:</strong> {{ employee.name }}<br>
            <strong>Department:</strong> {{ employee.department }}<br>
            <strong>Leave Type:</strong> {{ leave_request.leave_type.name }}<br>
            <strong>Dates:</strong> {{ leave_request.start_date|date:"d M Y" }} to {{ leave_request.end_date|date:"d M Y" }}<br>
            <strong>Total Days:</strong> {{ leave_request.total_days }} day(s)<br>
            <strong>Reason:</strong> {{ leave_request.reason }}
        </div>
        
        <div style="margin: 30px 0;">
            <a href="{{ approval_link }}" style="background: #4CAF50; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin-right: 10px;">Approve</a>
            <a href="{{ rejection_link }}" style="background: #f44336; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Reject</a>
        </div>
        
        <p>You can also view this request in the <a href="{{ dashboard_link }}">Leave Management System</a>.</p>
        
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
        
        <p style="color: #888; font-size: 12px;">
            This is an automated notification from LankaCommerce Leave Management System.<br>
            Please do not reply to this email.
        </p>
    </div>
</body>
</html>
```

#### Approval Notification (to Employee)
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Leave Request Approved</title>
</head>
<body>
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4CAF50;">✓ Leave Request Approved</h2>
        
        <p>Dear {{ employee.name }},</p>
        
        <p>Good news! Your leave request has been <strong>approved</strong> by {{ approver.name }}.</p>
        
        <div style="background: #e8f5e9; padding: 15px; margin: 20px 0; border-left: 4px solid #4CAF50;">
            <strong>Leave Details:</strong><br>
            <strong>Leave Type:</strong> {{ leave_request.leave_type.name }}<br>
            <strong>Dates:</strong> {{ leave_request.start_date|date:"d M Y" }} to {{ leave_request.end_date|date:"d M Y" }}<br>
            <strong>Total Days:</strong> {{ leave_request.total_days }} day(s)<br>
            <strong>Approved By:</strong> {{ approver.name }}<br>
            <strong>Approved On:</strong> {{ leave_request.approved_at|date:"d M Y, h:i A" }}
        </div>
        
        {% if approver.comments %}
        <div style="background: #f5f5f5; padding: 15px; margin: 20px 0;">
            <strong>Approver Comments:</strong><br>
            {{ approver.comments }}
        </div>
        {% endif %}
        
        <p><strong>What's Next?</strong></p>
        <ul>
            <li>Your leave has been marked in the attendance system</li>
            <li>Your team has been notified of your absence</li>
            <li>Enjoy your time off!</li>
        </ul>
        
        <p>View your leave details in the <a href="{{ dashboard_link }}">Leave Dashboard</a>.</p>
        
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
        
        <p style="color: #888; font-size: 12px;">
            This is an automated notification from LankaCommerce Leave Management System.
        </p>
    </div>
</body>
</html>
```

#### Expiring Balance Warning
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Leave Balance Expiring Soon</title>
</head>
<body>
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #ff9800;">⚠️ Leave Balance Expiring Soon</h2>
        
        <p>Dear {{ employee.name }},</p>
        
        <p>This is a friendly reminder that some of your leave balance is expiring soon.</p>
        
        <div style="background: #fff3cd; padding: 15px; margin: 20px 0; border-left: 4px solid #ff9800;">
            <strong>Expiring Leave:</strong><br>
            <strong>Leave Type:</strong> {{ leave_balance.leave_type.name }}<br>
            <strong>Days Expiring:</strong> {{ leave_balance.available_days }} day(s)<br>
            <strong>Expiry Date:</strong> {{ leave_balance.expiry_date|date:"d M Y" }}<br>
            <strong>Days Until Expiry:</strong> {{ days_until_expiry }} day(s)
        </div>
        
        <p><strong>Action Required:</strong></p>
        <p>Please submit a leave request to use these days before they expire. Once expired, these days cannot be recovered.</p>
        
        <div style="margin: 30px 0;">
            <a href="{{ apply_leave_link }}" style="background: #366092; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Apply for Leave</a>
        </div>
        
        <p>View your complete leave balance in the <a href="{{ dashboard_link }}">Leave Dashboard</a>.</p>
        
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
        
        <p style="color: #888; font-size: 12px;">
            This is an automated notification from LankaCommerce Leave Management System.
        </p>
    </div>
</body>
</html>
```

### Celery Task Example

```python
# apps/leave/tasks/notification_tasks.py

from celery import shared_task
from apps.leave.services.notification_service import LeaveNotificationService
import logging

logger = logging.getLogger(__name__)

@shared_task(bind=True, max_retries=3, default_retry_delay=300)
def send_leave_notification_async(self, notification_type, leave_request_id, tenant_id):
    """
    Send leave notification asynchronously
    
    Args:
        notification_type: Type of notification (approval, rejection, etc.)
        leave_request_id: ID of leave request
        tenant_id: Tenant ID
    """
    try:
        from apps.leave.models import LeaveRequest
        from apps.core.models import Tenant
        
        tenant = Tenant.objects.get(id=tenant_id)
        leave_request = LeaveRequest.objects.get(id=leave_request_id, tenant=tenant)
        
        service = LeaveNotificationService(tenant=tenant)
        
        if notification_type == 'approval':
            service.notify_approval(leave_request)
        elif notification_type == 'rejection':
            service.notify_rejection(leave_request)
        elif notification_type == 'submission':
            service.notify_request_submitted(leave_request)
        elif notification_type == 'cancellation':
            service.notify_cancellation(leave_request)
        
        logger.info(f"Notification sent: {notification_type} for LR-{leave_request_id}")
        
    except Exception as exc:
        logger.error(f"Failed to send notification: {exc}")
        raise self.retry(exc=exc)


@shared_task
def send_expiry_reminders_batch():
    """
    Send batch expiry reminders (run daily via cron)
    """
    from apps.leave.services.report_service import LeaveReportService
    from apps.core.models import Tenant
    
    for tenant in Tenant.objects.filter(is_active=True):
        try:
            report_service = LeaveReportService(tenant=tenant)
            notification_service = LeaveNotificationService(tenant=tenant)
            
            # Get expiring leaves (30 days threshold)
            expiring_report = report_service.expiring_leaves(days_until_expiry=30)
            
            for balance_data in expiring_report['expiring_balances']:
                # Send notification
                notification_service.notify_expiring_balance(
                    employee_id=balance_data['employee']['employee_id'],
                    leave_balance_id=balance_data['balance_id'],
                    days_until_expiry=balance_data['expiry']['days_until_expiry']
                )
            
            logger.info(f"Expiry reminders sent for tenant {tenant.id}")
            
        except Exception as e:
            logger.error(f"Failed expiry reminders for tenant {tenant.id}: {e}")


@shared_task
def send_upcoming_leave_reminders():
    """
    Send upcoming leave reminders (run daily via cron)
    """
    from apps.leave.models import LeaveRequest
    from apps.core.models import Tenant
    from datetime import date, timedelta
    
    # Get leaves starting in 3 days
    target_date = date.today() + timedelta(days=3)
    
    for tenant in Tenant.objects.filter(is_active=True):
        try:
            notification_service = LeaveNotificationService(tenant=tenant)
            
            upcoming_leaves = LeaveRequest.objects.filter(
                tenant=tenant,
                status='APPROVED',
                start_date=target_date
            )
            
            for leave_request in upcoming_leaves:
                notification_service.notify_upcoming_leave(leave_request)
            
            logger.info(f"Upcoming reminders sent for tenant {tenant.id}: {upcoming_leaves.count()}")
            
        except Exception as e:
            logger.error(f"Failed upcoming reminders for tenant {tenant.id}: {e}")
```

### Sri Lanka Context

#### Email Language Support
```
Multi-language Email Templates:
│
├─> English (Default)
│   • Primary business language
│   • All official communications
│
├─> Sinhala (Optional)
│   • Subject line translation
│   • Key details in Sinhala
│   • Cultural greetings
│
└─> Tamil (Optional)
    • Subject line translation
    • Key details in Tamil
    • Cultural greetings

Example Subject Lines:
  EN: "Leave Request Approved"
  SI: "නිවාඩු ඉල්ලීම අනුමත කර ඇත"
  TA: "விடுப்பு கோரிக்கை அங்கீகரிக்கப்பட்டது"
```

#### Festival Season Notifications
```
Special Notification: New Year Season

Dear {{ employee.name }},

The Sinhala & Tamil New Year season is approaching 
(April 13-14, 2026). 

We notice you have {{ available_days }} Annual Leave 
days available. This is a popular time for leave 
requests, so we encourage you to apply early to 
secure your preferred dates.

Important Notes:
  • April 13-14 are public holidays
  • High leave demand expected
  • Early applications prioritized
  • Team coverage required

Apply for Leave: [Link]
```

### Expected Outcome
- Automated email notifications
- Timely leave alerts
- Manager approval notifications
- Employee status updates
- Proactive balance warnings

### Verification Checklist
- [ ] notification_service.py file created
- [ ] LeaveNotificationService class defined
- [ ] send_email() helper implemented
- [ ] render_email_template() implemented
- [ ] notify_request_submitted() implemented
- [ ] notify_approval() implemented
- [ ] notify_rejection() implemented
- [ ] notify_cancellation() implemented
- [ ] notify_upcoming_leave() implemented
- [ ] notify_expiring_balance() implemented
- [ ] Celery tasks created
- [ ] Email templates created
- [ ] Service imported in __init__.py

---

## Task 78: Implement Request Submitted Notification

### Overview
Implement the specific notification logic for leave request submission. When an employee submits a leave request, this notification alerts the approver/manager with all relevant details and provides quick action links for approval or rejection.

### Dependencies
- Task 77: Create Leave Notification Service
- Email templates configured
- LeaveRequest model with approver field

### Instructions

1. **Open notification_service.py file**
   - Navigate to `apps/leave/services/notification_service.py`
   - Locate LeaveNotificationService class

2. **Enhance notify_request_submitted() method**
   - Accept leave_request parameter
   - Validate leave request exists and is pending
   - Get approver/manager details

3. **Determine approver**
   - Get leave_request.approver (if set)
   - Fallback to employee's manager
   - Fallback to department head
   - Handle case when no approver assigned

4. **Prepare notification context**
   - Employee information (name, code, department)
   - Leave type details
   - Date range and total days
   - Half-day information (if applicable)
   - Request reason
   - Current leave balance
   - Submission timestamp

5. **Generate action links**
   - Create approval URL with token
   - Create rejection URL with token
   - Create view details URL
   - Ensure links are secure and expire

6. **Add urgency indicator**
   - Check start date proximity
   - Mark as urgent if starts within 3 days
   - Add urgency flag to context

7. **Render email template**
   - Use 'leave/emails/request_submitted.html'
   - Pass complete context
   - Generate plain text version

8. **Send email to approver**
   - Use send_email() helper
   - Subject: "New Leave Request from {employee.name}"
   - Handle send failures gracefully

9. **Log notification**
   - Record notification sent
   - Log recipient and timestamp
   - Log any errors

10. **Create notification record (optional)**
    - Store in Notification model (if exists)
    - Mark as unread
    - Enable in-app notification

### Notification Context Structure

```python
context = {
    'employee': {
        'id': leave_request.employee.id,
        'code': leave_request.employee.employee_code,
        'name': leave_request.employee.get_full_name(),
        'department': leave_request.employee.department.name,
        'position': leave_request.employee.position,
        'email': leave_request.employee.email,
    },
    'manager': {
        'name': approver.get_full_name(),
        'position': approver.position,
    },
    'leave_request': {
        'id': leave_request.id,
        'number': leave_request.request_number,
        'leave_type': leave_request.leave_type.name,
        'start_date': leave_request.start_date,
        'end_date': leave_request.end_date,
        'total_days': leave_request.total_days,
        'half_day_start': leave_request.half_day_start,
        'half_day_end': leave_request.half_day_end,
        'reason': leave_request.reason,
        'submitted_at': leave_request.created_at,
    },
    'balance': {
        'available_days': leave_request.balance.available_days,
        'will_have_after': leave_request.balance.available_days - leave_request.total_days,
    },
    'urgency': {
        'is_urgent': is_urgent,
        'days_until_start': days_until_start,
        'message': urgency_message,
    },
    'actions': {
        'approve_link': approve_url,
        'reject_link': reject_url,
        'view_link': view_url,
    },
    'company': {
        'name': tenant.name,
        'logo_url': tenant.logo_url,
    },
}
```

### Urgency Determination Logic

```python
def _determine_urgency(leave_request):
    """
    Determine if leave request is urgent
    
    Urgent if:
    - Starts within 3 days
    - OR marked as emergency leave type
    - OR retroactive request (start date in past)
    """
    today = date.today()
    days_until_start = (leave_request.start_date - today).days
    
    is_urgent = False
    urgency_message = ""
    
    if leave_request.start_date < today:
        is_urgent = True
        urgency_message = "⚠️ RETROACTIVE: Leave starts in the past"
    elif days_until_start <= 0:
        is_urgent = True
        urgency_message = "⚠️ URGENT: Leave starts today"
    elif days_until_start <= 3:
        is_urgent = True
        urgency_message = f"⏰ URGENT: Leave starts in {days_until_start} day(s)"
    elif leave_request.leave_type.is_emergency:
        is_urgent = True
        urgency_message = "⚠️ EMERGENCY LEAVE REQUEST"
    
    return {
        'is_urgent': is_urgent,
        'days_until_start': days_until_start,
        'message': urgency_message
    }
```

### Secure Action Link Generation

```python
from django.core.signing import TimestampSigner
from django.urls import reverse

def _generate_action_links(leave_request):
    """
    Generate secure action links with tokens
    
    Tokens expire in 7 days
    """
    signer = TimestampSigner()
    token = signer.sign(f"LR-{leave_request.id}")
    
    base_url = get_site_url()
    
    approve_url = base_url + reverse('leave:approve', kwargs={
        'request_id': leave_request.id,
        'token': token
    })
    
    reject_url = base_url + reverse('leave:reject', kwargs={
        'request_id': leave_request.id,
        'token': token
    })
    
    view_url = base_url + reverse('leave:detail', kwargs={
        'request_id': leave_request.id
    })
    
    return {
        'approve_link': approve_url,
        'reject_link': reject_url,
        'view_link': view_url,
    }
```

### Email Subject Line Variations

```python
def _generate_subject_line(leave_request, urgency_info):
    """
    Generate appropriate subject line
    """
    employee_name = leave_request.employee.get_full_name()
    
    if urgency_info['is_urgent']:
        return f"🔔 URGENT: New Leave Request from {employee_name}"
    else:
        return f"New Leave Request from {employee_name}"
```

### Sample Implementation

```python
def notify_request_submitted(self, leave_request):
    """
    Notify approver of new leave request
    """
    try:
        # Validate
        if leave_request.status != 'PENDING':
            logger.warning(f"Cannot notify - request not pending: {leave_request.id}")
            return False
        
        # Get approver
        approver = self._get_approver(leave_request)
        if not approver:
            logger.error(f"No approver found for request: {leave_request.id}")
            return False
        
        # Determine urgency
        urgency_info = self._determine_urgency(leave_request)
        
        # Generate action links
        action_links = self._generate_action_links(leave_request)
        
        # Prepare context
        context = {
            'employee': self._format_employee_data(leave_request.employee),
            'manager': self._format_employee_data(approver),
            'leave_request': self._format_leave_request_data(leave_request),
            'balance': self._get_balance_info(leave_request),
            'urgency': urgency_info,
            'actions': action_links,
            'company': self._get_company_info(),
        }
        
        # Render email
        html_content = self.render_email_template(
            'leave/emails/request_submitted.html',
            context
        )
        
        # Generate subject
        subject = self._generate_subject_line(leave_request, urgency_info)
        
        # Send email
        success = self.send_email(
            recipient_email=approver.email,
            subject=subject,
            html_content=html_content
        )
        
        if success:
            logger.info(f"Submission notification sent for LR-{leave_request.id}")
            self._create_notification_record(leave_request, approver, 'submission')
        else:
            logger.error(f"Failed to send submission notification for LR-{leave_request.id}")
        
        return success
        
    except Exception as e:
        logger.error(f"Error in notify_request_submitted: {e}")
        return False
```

### Sri Lanka Context

#### Manager Notification Example
```
Subject: New Leave Request from Nimal Perera

Dear Saman Fernando,

Nimal Perera (E001) from IT Department has submitted 
a leave request for your approval.

Leave Details:
  Employee: Nimal Perera (E001)
  Department: IT
  Position: Senior Developer
  
  Leave Type: Annual Leave
  Dates: January 27 - 29, 2026
  Total Days: 3 working days
  Reason: Personal travel to Kandy
  
  Current Balance: 14 days
  After This Leave: 11 days

⏰ URGENT: Leave starts in 3 days

Please review and respond promptly:
  [Approve] [Reject] [View Details]

Note: Quick approval helps employee plan better.

Best regards,
LankaCommerce Leave Management System
```

#### Poya Day Note in Notification
```
Leave Details:
  Dates: January 14 - 17, 2026
  Calendar Days: 4 days
  Working Days: 3 days
  
  Note: January 15 (Wednesday) is a Full Moon 
        Poya Day (public holiday) and will not 
        be deducted from leave balance.
  
  Leave Days Deducted: 3 days
```

### Expected Outcome
- Timely manager notifications
- Complete request details
- Quick action links
- Urgency indicators
- Balance information

### Verification Checklist
- [ ] notify_request_submitted() enhanced
- [ ] Approver determination implemented
- [ ] Notification context complete
- [ ] Action links generated
- [ ] Urgency detection works
- [ ] Email sent successfully
- [ ] Logging implemented
- [ ] Error handling added

---

## Task 79: Implement Approval Notification

### Overview
Implement the specific notification logic for leave request approval. When a manager approves a leave request, this notification informs the employee of the approval with confirmation details and next steps.

### Dependencies
- Task 77: Create Leave Notification Service
- Task 78: Request submitted notification
- Email templates configured

### Instructions

1. **Open notification_service.py file**
   - Continue in `apps/leave/services/notification_service.py`
   - Locate LeaveNotificationService class

2. **Enhance notify_approval() method**
   - Accept leave_request parameter
   - Validate leave request is approved
   - Get employee details

3. **Prepare approval context**
   - Employee information
   - Leave request details
   - Approver information
   - Approval timestamp
   - Approval comments (if any)
   - Updated balance information

4. **Add next steps information**
   - Attendance marked automatically
   - Team notification status
   - Calendar event created (if applicable)
   - Preparation reminders

5. **Include calendar attachment**
   - Generate ICS calendar file
   - Include leave dates
   - Add to email as attachment
   - Allow employee to add to calendar

6. **Render email template**
   - Use 'leave/emails/approval.html'
   - Pass complete context
   - Generate plain text version

7. **Send email to employee**
   - Use send_email() helper
   - Subject: "Leave Request Approved - {dates}"
   - Include calendar attachment

8. **Send copy to manager (optional)**
   - Confirmation email to manager
   - Summary of approval
   - Team coverage status

9. **Log notification**
   - Record notification sent
   - Log recipient and timestamp

10. **Create notification record**
    - Store in Notification model
    - Mark as unread
    - Enable in-app notification

### Approval Notification Context

```python
context = {
    'employee': {
        'name': leave_request.employee.get_full_name(),
        'code': leave_request.employee.employee_code,
        'department': leave_request.employee.department.name,
        'email': leave_request.employee.email,
    },
    'leave_request': {
        'number': leave_request.request_number,
        'leave_type': leave_request.leave_type.name,
        'start_date': leave_request.start_date,
        'end_date': leave_request.end_date,
        'total_days': leave_request.total_days,
        'reason': leave_request.reason,
    },
    'approval': {
        'approver_name': leave_request.approved_by.get_full_name(),
        'approver_position': leave_request.approved_by.position,
        'approved_at': leave_request.approved_at,
        'comments': leave_request.approval_comments,
    },
    'balance': {
        'previous_balance': previous_balance,
        'days_used': leave_request.total_days,
        'remaining_balance': remaining_balance,
    },
    'next_steps': [
        'Your leave has been marked in the attendance system',
        'Your team has been notified of your absence',
        'A calendar event has been created',
        'Prepare handover documents if needed',
    ],
    'actions': {
        'view_link': view_url,
        'calendar_link': add_to_calendar_url,
        'dashboard_link': dashboard_url,
    },
}
```

### Calendar Attachment Generation

```python
from icalendar import Calendar, Event as CalEvent
from datetime import datetime

def _generate_calendar_attachment(leave_request):
    """
    Generate ICS calendar file for leave
    """
    cal = Calendar()
    cal.add('prodid', '-//LankaCommerce Leave Management//EN')
    cal.add('version', '2.0')
    
    event = CalEvent()
    event.add('summary', f'{leave_request.leave_type.name} - {leave_request.employee.get_full_name()}')
    event.add('dtstart', leave_request.start_date)
    event.add('dtend', leave_request.end_date + timedelta(days=1))  # End is exclusive
    event.add('description', f'Reason: {leave_request.reason}')
    event.add('location', 'On Leave')
    event.add('status', 'CONFIRMED')
    
    cal.add_component(event)
    
    return cal.to_ical()
```

### Sample Approval Email

```
Subject: ✓ Leave Request Approved - Jan 27-29, 2026

Dear Nimal Perera,

Good news! Your leave request has been approved.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
APPROVED LEAVE DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Leave Type: Annual Leave
Dates: January 27 - 29, 2026 (3 days)
Reason: Personal travel to Kandy

Approved By: Saman Fernando (IT Manager)
Approved On: January 24, 2026, 2:30 PM

Approver Comments:
"Approved. Have a safe trip!"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
LEAVE BALANCE UPDATE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Previous Balance: 14 days
Days Used: 3 days
Remaining Balance: 11 days

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
WHAT'S NEXT?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✓ Your leave has been marked in the attendance system
✓ Your team has been notified of your absence
✓ A calendar event has been attached to this email
✓ Prepare any necessary handover documents

[View Leave Details] [Add to Calendar] [Dashboard]

Enjoy your time off!

Best regards,
LankaCommerce Leave Management System

📎 Attachment: leave_event.ics (Add to your calendar)
```

### Sri Lanka Context Example

```
Subject: නිවාඩු ඉල්ලීම අනුමත කර ඇත / Leave Request Approved

Dear Nimal Perera,

සුභ පැතුම්! ඔබගේ නිවාඩු ඉල්ලීම අනුමත කර ඇත.
Good news! Your leave request has been approved.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
අනුමත නිවාඩු විස්තර / APPROVED LEAVE DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

නිවාඩු වර්ගය / Leave Type: වාර්ෂික නිවාඩු / Annual Leave
දින / Dates: ජනවාරි 27 - 29, 2026 (දින 3)
හේතුව / Reason: කඩුගන්නවා බලා යාම / Personal travel to Kandy

අනුමත කළේ / Approved By: සමන් ප ර්නාන්දු / Saman Fernando
අනුමත කළ දිනය / Approved On: ජනවාරි 24, 2026

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Have a safe and enjoyable trip to Kandy!
සුරක්ෂිත ගමනක් වේවා!

📎 Calendar event attached / දින දර්ශන සිද්ධිය අමුණා ඇත
```

### Expected Outcome
- Timely employee notifications
- Approval confirmation
- Balance updates
- Calendar integration
- Next steps guidance

### Verification Checklist
- [ ] notify_approval() enhanced
- [ ] Approval context complete
- [ ] Calendar attachment generated
- [ ] Balance update included
- [ ] Next steps provided
- [ ] Email sent successfully
- [ ] Logging implemented

---

## Task 80: Create Leave Dashboard Data

### Overview
Create a service that provides structured data for leave management dashboards. This service aggregates leave information to power various dashboard widgets showing personal leave balance, pending requests, upcoming leaves, team availability, and approval queues.

### Dependencies
- LeaveRequest model exists
- LeaveBalance model exists
- LeaveReportService exists
- Employee model exists

### Instructions

1. **Create dashboard/dashboard_service.py file**
   - Create `dashboard/` directory in `apps/leave/`
   - Create `__init__.py` in dashboard directory
   - Create `dashboard_service.py` file
   - Add module docstring

2. **Import required modules**
   - Import all leave models
   - Import LeaveReportService
   - Import date utilities
   - Import aggregation functions
   - Import typing for type hints

3. **Define LeaveDashboardService class**
   - Create service class with descriptive docstring
   - Add tenant-aware approach
   - Include caching for performance

4. **Add initialization method**
   - Accept tenant parameter
   - Accept user parameter (for personalization)
   - Initialize logger

5. **Create get_my_leave_data() method**
   - Accept employee_id parameter
   - Get current leave balances
   - Get pending requests
   - Get upcoming approved leaves
   - Get recent leave history
   - Return structured dictionary

6. **Create get_my_balance_summary() method**
   - Accept employee_id
   - Get all leave type balances
   - Calculate total allocated, used, available
   - Calculate utilization percentage
   - Format for widget display

7. **Create get_pending_requests_summary() method**
   - Accept employee_id
   - Get count of pending requests
   - Get total days pending
   - Get oldest pending request
   - Return summary data

8. **Create get_upcoming_leaves() method**
   - Accept employee_id
   - Accept days_ahead parameter (default 30)
   - Get approved leaves starting within period
   - Sort by start date
   - Return list of upcoming leaves

9. **Create get_team_dashboard_data() method**
   - Accept manager_id or department_id
   - Get team members
   - Get team leave summary
   - Get team members on leave today
   - Get pending approvals for manager
   - Return team dashboard data

10. **Create get_team_on_leave_today() method**
    - Accept department_id or team_id
    - Get today's date
    - Find employees on approved leave today
    - Return list with employee details

11. **Create get_approval_queue() method**
    - Accept manager_id
    - Get all pending requests for manager
    - Sort by urgency (start date proximity)
    - Add urgency flags
    - Return approval queue

12. **Create get_dashboard_widgets() method**
    - Accept user/employee
    - Return all widget data in one call:
      - My balance summary
      - Pending requests count
      - Upcoming leaves (next 7 days)
      - Team on leave today (if manager)
      - Approval queue count (if manager)
      - Quick stats

13. **Add caching decorators**
    - Cache balance data (5 minutes)
    - Cache team data (15 minutes)
    - Clear cache on leave status changes

14. **Update dashboard __init__.py**
    - Import LeaveDashboardService
    - Add to __all__ list

### LeaveDashboardService Structure

```
┌──────────────────────────────────────────────────────┐
│      LeaveDashboardService Class                     │
├──────────────────────────────────────────────────────┤
│ Personal Dashboard Methods:                          │
│  • get_my_leave_data()                               │
│  • get_my_balance_summary()                          │
│  • get_pending_requests_summary()                    │
│  • get_upcoming_leaves()                             │
│                                                      │
│ Team/Manager Dashboard Methods:                      │
│  • get_team_dashboard_data()                         │
│  • get_team_on_leave_today()                         │
│  • get_approval_queue()                              │
│                                                      │
│ Unified Methods:                                     │
│  • get_dashboard_widgets()                           │
│  • get_quick_stats()                                 │
└──────────────────────────────────────────────────────┘
```

### Dashboard Data Structure

```json
{
  "personal_dashboard": {
    "my_balance": {
      "annual_leave": {
        "allocated": 14,
        "used": 5,
        "pending": 2,
        "available": 7,
        "utilization_percentage": 35.71
      },
      "casual_leave": {
        "allocated": 7,
        "used": 2,
        "pending": 0,
        "available": 5,
        "utilization_percentage": 28.57
      },
      "sick_leave": {
        "allocated": 7,
        "used": 1,
        "pending": 0,
        "available": 6,
        "utilization_percentage": 14.29
      }
    },
    "pending_requests": {
      "count": 1,
      "total_days": 3,
      "oldest_request": {
        "id": "LR-256",
        "submitted_days_ago": 2,
        "start_date": "2026-02-05"
      }
    },
    "upcoming_leaves": [
      {
        "id": "LR-145",
        "leave_type": "Annual Leave",
        "start_date": "2026-02-15",
        "end_date": "2026-02-17",
        "days": 3,
        "days_until_start": 22
      }
    ],
    "recent_history": [
      {
        "id": "LR-089",
        "leave_type": "Sick Leave",
        "dates": "Jan 10, 2026",
        "days": 1,
        "status": "Approved"
      }
    ]
  },
  "team_dashboard": {
    "team_on_leave_today": [
      {
        "employee_id": "EMP-0045",
        "name": "Ashan Kumar",
        "leave_type": "Annual Leave",
        "return_date": "2026-01-26"
      },
      {
        "employee_id": "EMP-0067",
        "name": "Kumari Silva",
        "leave_type": "Casual Leave",
        "return_date": "2026-01-24"
      }
    ],
    "pending_for_approval": {
      "count": 3,
      "urgent_count": 1,
      "total_days": 10
    },
    "team_summary": {
      "total_team_members": 20,
      "on_leave_today": 2,
      "availability_percentage": 90.0
    }
  },
  "quick_stats": {
    "total_balance": 18,
    "total_used_this_year": 8,
    "pending_requests": 1,
    "upcoming_leaves_count": 1,
    "team_on_leave": 2
  }
}
```

### Widget Display Examples

#### My Balance Widget
```
┌────────────────────────────────────────┐
│       MY LEAVE BALANCE 2026            │
├────────────────────────────────────────┤
│ Annual Leave         □□□□□□□■■■■■■■■  │
│ 7 of 14 days available         (50%)  │
│                                        │
│ Casual Leave         □□□□□■■          │
│ 5 of 7 days available          (71%)  │
│                                        │
│ Sick Leave           □□□□□□■          │
│ 6 of 7 days available          (86%)  │
└────────────────────────────────────────┘
```

#### Upcoming Leaves Widget
```
┌────────────────────────────────────────┐
│       UPCOMING LEAVES                  │
├────────────────────────────────────────┤
│ 📅 Feb 15-17, 2026 (3 days)           │
│    Annual Leave                        │
│    Starts in 22 days                   │
│                                        │
│ [View All] [Request New Leave]        │
└────────────────────────────────────────┘
```

#### Team on Leave Today Widget
```
┌────────────────────────────────────────┐
│    TEAM ON LEAVE TODAY (2)             │
├────────────────────────────────────────┤
│ Ashan Kumar                            │
│ Annual Leave | Returns: Jan 26        │
│                                        │
│ Kumari Silva                           │
│ Casual Leave | Returns: Today         │
│                                        │
│ Team Availability: 90% (18/20)        │
└────────────────────────────────────────┘
```

#### Approval Queue Widget (Manager)
```
┌────────────────────────────────────────┐
│    PENDING APPROVALS (3)               │
├────────────────────────────────────────┤
│ ⚠️ URGENT (1)                          │
│   Nimal Perera - Starts in 2 days     │
│                                        │
│ 📋 NORMAL (2)                          │
│   Chamara Peris - Starts in 10 days   │
│   Dilini Fernando - Starts in 15 days │
│                                        │
│ [Review All]                           │
└────────────────────────────────────────┘
```

### Sri Lanka Context Dashboard

```
┌─────────────────────────────────────────────────────┐
│         LANKACOMMERCE LEAVE DASHBOARD                │
├─────────────────────────────────────────────────────┤
│ Welcome, Nimal Perera (IT Department)               │
│ Today: January 24, 2026 (Friday)                    │
│ Next Poya Day: February 22, 2026 (28 days)          │
└─────────────────────────────────────────────────────┘

┌──────────────────────────┐  ┌──────────────────────┐
│   MY LEAVE BALANCE       │  │   UPCOMING LEAVES    │
│                          │  │                      │
│ Annual Leave: 7/14       │  │ Feb 15-17 (3 days)   │
│ Casual Leave: 5/7        │  │ Annual Leave         │
│ Sick Leave: 6/7          │  │ Starts in 22 days    │
│                          │  │                      │
│ Total Available: 18 days │  │ [Request New Leave]  │
└──────────────────────────┘  └──────────────────────┘

┌──────────────────────────┐  ┌──────────────────────┐
│   PENDING REQUESTS       │  │   TEAM ON LEAVE      │
│                          │  │                      │
│ 1 Request Pending        │  │ Ashan Kumar          │
│ 3 Days                   │  │ Kumari Silva         │
│ Submitted 2 days ago     │  │                      │
│                          │  │ Availability: 90%    │
│ [View Status]            │  │ (18 of 20 present)   │
└──────────────────────────┘  └──────────────────────┘

┌─────────────────────────────────────────────────────┐
│   QUICK ACTIONS                                      │
│   [Apply for Leave] [View History] [Check Balance]  │
└─────────────────────────────────────────────────────┘
```

### Expected Outcome
- Personalized dashboard data
- Real-time leave information
- Team visibility
- Manager approval queue
- Quick action access

### Verification Checklist
- [ ] dashboard/ directory created
- [ ] dashboard_service.py file created
- [ ] LeaveDashboardService class defined
- [ ] get_my_leave_data() implemented
- [ ] get_my_balance_summary() implemented
- [ ] get_upcoming_leaves() implemented
- [ ] get_team_dashboard_data() implemented
- [ ] get_team_on_leave_today() implemented
- [ ] get_approval_queue() implemented
- [ ] get_dashboard_widgets() implemented
- [ ] Caching implemented
- [ ] Service imported in __init__.py

---

## Summary

This document implemented integration, notification, and dashboard functionality:

### Completed Infrastructure
- ✅ Attendance Integration - Automatic ON_LEAVE marking
- ✅ Payroll Integration - Leave data export for salary calculations
- ✅ Notification Service - Comprehensive email notification system
- ✅ Request Submitted Notification - Manager alerts with action links
- ✅ Approval Notification - Employee confirmation with calendar attachment
- ✅ Dashboard Data Service - Widget data for personal and team dashboards

### Key Achievements
1. **Seamless Module Integration** - Attendance and Payroll data flow
2. **Automated Notifications** - Timely alerts for all leave events
3. **Action-Oriented Emails** - Quick approve/reject links for managers
4. **Calendar Integration** - ICS attachments for easy calendar addition
5. **Comprehensive Dashboards** - Personal, team, and manager views
6. **Sri Lankan Context** - Poya day handling, multi-language support, EPF/ETF considerations

### Integration Benefits
- Reduced manual data entry
- Improved accuracy in attendance tracking
- Accurate payroll processing
- Timely communication
- Enhanced user experience
- Better decision-making with dashboard insights

---

**Document Status:** ✅ Complete  
**Total Tasks:** 6  
**Total Lines:** ~1330
