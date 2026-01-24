# Tasks 49-55: Overtime Service & Request Model Implementation

## Document Information

**Phase**: Phase-06 ERP Advanced Modules  
**SubPhase**: SubPhase-03 Attendance System  
**Group**: Group-D Overtime Calculations  
**Tasks**: 49-55  
**Document Version**: 1.0  
**Last Updated**: January 2026

---

## Navigation

- **Parent**: [00_GROUP_OVERVIEW.md](./00_GROUP_OVERVIEW.md)
- **Previous**: [Group-C Tasks 41-48 - Shift Management](../Group-C_Shift-Management/02_Tasks-41-48_Shift-Assignment-Validation.md)
- **Next**: [Tasks 56-62 - Overtime Approval & Policies](./02_Tasks-56-62_Overtime-Approval-Policies.md)

---

## Table of Contents

1. [Group Overview](#group-overview)
2. [Task 49: OvertimeService Implementation](#task-49-overtimeservice-implementation)
3. [Task 50: Overtime Detection Logic](#task-50-overtime-detection-logic)
4. [Task 51: Overtime Calculation Engine](#task-51-overtime-calculation-engine)
5. [Task 52: OvertimeRequest Model Design](#task-52-overtimerequest-model-design)
6. [Task 53: OvertimeRequest Fields & Attributes](#task-53-overtimerequest-fields--attributes)
7. [Task 54: Overtime Request Workflow](#task-54-overtime-request-workflow)
8. [Task 55: Overtime Migrations & Setup](#task-55-overtime-migrations--setup)
9. [Integration Summary](#integration-summary)
10. [Testing Strategy](#testing-strategy)

---

## Group Overview

This document covers the foundational implementation of overtime calculation and request management functionality. These tasks establish:

- Core overtime detection and calculation services
- Overtime request model for pre-approved and post-logged overtime
- Request workflow for employee-initiated overtime
- Database structure and migrations for overtime tracking

**Key Objectives**:
- Detect overtime hours based on attendance and shift data
- Calculate overtime amounts with configurable rates
- Enable employees to request overtime approval
- Track overtime requests through approval workflows
- Maintain audit trails for all overtime activities

**Business Context**:
Overtime management is critical for:
- Labor cost control and budgeting
- Compliance with labor laws
- Fair compensation for employees
- Workload and resource planning
- Accurate payroll processing

---

## Task 49: OvertimeService Implementation

### Overview

Create the core OvertimeService class that serves as the central orchestrator for all overtime-related operations. This service coordinates overtime detection, calculation, validation, and integration with other attendance components.

**Purpose**: Provide a unified interface for overtime management across the attendance system.

**Scope**: Service layer implementation with business logic coordination.

### Dependencies

**Prerequisites**:
- Task 37: AttendanceService (completed)
- Task 41: ShiftService (completed)
- Task 01: Attendance Model (completed)
- Django ORM and transaction management

**Related Components**:
- TimeCalculationUtility (from Task 08)
- AttendanceRepository (from Task 28)
- ShiftRepository (from Task 42)

**External Dependencies**:
- Django timezone utilities
- Python datetime and timedelta
- Decimal library for precise calculations

### Instructions

**Step 1: Service Structure Setup**

Create OvertimeService class with initialization:
- Inject required dependencies (repositories, utilities)
- Set up logging for overtime operations
- Initialize configuration management
- Define service-level constants

**Step 2: Core Service Methods**

Implement primary service operations:
- detect_overtime(): Identify overtime hours from attendance
- calculate_overtime(): Compute overtime amounts with rates
- validate_overtime_request(): Check request validity
- process_overtime(): Handle end-to-end overtime processing
- get_overtime_summary(): Generate overtime reports

**Step 3: Business Logic Implementation**

Add business rule enforcement:
- Minimum overtime threshold validation
- Maximum daily/weekly overtime limits
- Shift-based overtime detection rules
- Holiday and weekend overtime handling
- Break time exclusion from overtime

**Step 4: Integration Points**

Connect with related services:
- Query AttendanceService for work hours
- Call ShiftService for shift definitions
- Integrate with PolicyService for overtime rules
- Coordinate with PayrollService for compensation

**Step 5: Error Handling & Validation**

Implement comprehensive error management:
- Input validation with meaningful errors
- Transaction rollback on failures
- Logging for debugging and audit
- User-friendly error messages

### Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     OvertimeService                          │
├─────────────────────────────────────────────────────────────┤
│ Core Methods:                                                │
│  + detect_overtime(attendance_record)                        │
│  + calculate_overtime(hours, rate_type)                      │
│  + validate_overtime_request(request)                        │
│  + process_overtime(employee, date_range)                    │
│  + get_overtime_summary(filters)                             │
├─────────────────────────────────────────────────────────────┤
│ Business Logic:                                              │
│  - Apply overtime thresholds                                 │
│  - Enforce max limits                                        │
│  - Calculate differential rates                              │
│  - Handle special days (holidays/weekends)                   │
└─────────────────────────────────────────────────────────────┘
                           │
          ┌────────────────┼────────────────┐
          │                │                │
          ▼                ▼                ▼
┌──────────────────┐ ┌──────────────┐ ┌────────────────┐
│ AttendanceService│ │ ShiftService │ │ PolicyService  │
│                  │ │              │ │                │
│ - Get work hours │ │ - Get shifts │ │ - Get OT rules │
│ - Attendance data│ │ - Shift rules│ │ - Rate configs │
└──────────────────┘ └──────────────┘ └────────────────┘
```

### Outcome

**Deliverables**:
1. OvertimeService class with full implementation
2. Service methods for all overtime operations
3. Business logic for overtime rules
4. Integration with existing services
5. Comprehensive error handling

**Success Criteria**:
- Service successfully detects overtime from attendance
- Calculations produce accurate overtime amounts
- All business rules properly enforced
- Clean integration with related services
- Proper logging and error handling

**Quality Metrics**:
- Code coverage > 90%
- All unit tests passing
- Performance benchmarks met
- Code review approved
- Documentation complete

### Verification

**Unit Testing**:
```
Test Suite: OvertimeService Tests

1. test_detect_overtime_standard_shift()
   - Given: 9-hour workday on 8-hour shift
   - Expected: 1 hour overtime detected

2. test_detect_overtime_no_overtime()
   - Given: 7-hour workday on 8-hour shift
   - Expected: 0 hours overtime

3. test_calculate_overtime_standard_rate()
   - Given: 2 hours overtime at 1.5x rate
   - Expected: Correct calculation with base rate

4. test_calculate_overtime_holiday_rate()
   - Given: 4 hours overtime on public holiday
   - Expected: Higher rate multiplier applied

5. test_validate_overtime_request_valid()
   - Given: Valid overtime request data
   - Expected: Validation passes

6. test_validate_overtime_request_exceeds_limit()
   - Given: Request exceeds daily limit
   - Expected: ValidationError raised

7. test_process_overtime_full_workflow()
   - Given: Complete attendance and request data
   - Expected: Overtime processed end-to-end

8. test_overtime_with_break_exclusion()
   - Given: 10-hour day with 1-hour break
   - Expected: Break time not counted as overtime
```

**Integration Testing**:
- Test with real attendance records
- Verify shift integration
- Confirm policy application
- Test multi-tenant scenarios

**Manual Testing Checklist**:
- [ ] Service initializes correctly
- [ ] Overtime detected accurately
- [ ] Calculations match expected results
- [ ] Error handling works properly
- [ ] Logging provides useful information
- [ ] Performance acceptable under load

---

## Task 50: Overtime Detection Logic

### Overview

Implement the intelligent overtime detection mechanism that analyzes attendance records and shift definitions to automatically identify when employees have worked overtime hours. This logic forms the foundation for accurate overtime tracking.

**Purpose**: Automatically detect overtime situations based on configurable rules and policies.

**Scope**: Detection algorithm implementation with multiple detection strategies.

### Dependencies

**Prerequisites**:
- Task 49: OvertimeService (in progress)
- Task 37: AttendanceService (completed)
- Task 41: ShiftService (completed)
- Task 08: TimeCalculationUtility (completed)

**Data Requirements**:
- Attendance records with check-in/check-out times
- Shift definitions with standard hours
- Employee work schedules
- Company overtime policies

**Configuration Dependencies**:
- Overtime threshold settings
- Detection rule configurations
- Break time policies
- Grace period settings

### Instructions

**Step 1: Detection Strategy Design**

Define detection approaches:
- Daily overtime: Hours exceeding daily shift
- Weekly overtime: Hours exceeding weekly limit
- Early check-in overtime: Pre-shift arrival
- Late check-out overtime: Post-shift departure
- Rest day/holiday overtime: Work on non-workdays

**Step 2: Core Detection Algorithm**

Implement detection logic:
- Calculate total work hours for period
- Subtract standard shift hours
- Apply minimum threshold (e.g., 15 minutes)
- Exclude break times
- Handle grace periods
- Consider shift boundaries

**Step 3: Time Window Analysis**

Implement time-based detection:
- Analyze check-in vs shift start time
- Compare check-out vs shift end time
- Detect continuous work beyond shift
- Handle split shifts
- Process overnight shifts

**Step 4: Policy Integration**

Apply policy rules:
- Check if overtime is allowed for employee
- Verify against maximum daily limits
- Validate weekly accumulation
- Apply department-specific rules
- Enforce approval requirements

**Step 5: Edge Case Handling**

Handle special scenarios:
- Missing check-in or check-out
- Multiple attendance entries per day
- Shift changes during day
- Public holidays
- Emergency overtime
- Compensatory time off

### Diagram

```
┌─────────────────────────────────────────────────────────────┐
│              Overtime Detection Flow                         │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│ Step 1: Gather Input Data                                    │
│  - Attendance record (check-in, check-out)                   │
│  - Shift definition (start, end, standard hours)             │
│  - Employee overtime eligibility                             │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│ Step 2: Calculate Actual Work Hours                          │
│  - Total time = check-out - check-in                         │
│  - Subtract break durations                                  │
│  - Apply grace periods (+/- 5 minutes)                       │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│ Step 3: Determine Overtime Hours                             │
│  - Overtime = Actual Hours - Standard Shift Hours            │
│  - If overtime < minimum threshold (15 min), set to 0        │
│  - Separate early and late overtime                          │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│ Step 4: Apply Detection Rules                                │
│  ┌─────────────────┐  ┌──────────────────┐                  │
│  │ Daily Limit OK? │  │ Weekly Limit OK? │                  │
│  └────────┬────────┘  └────────┬─────────┘                  │
│           │                    │                             │
│           └────────┬───────────┘                             │
│                    ▼                                         │
│          ┌──────────────────┐                                │
│          │ Approval Needed? │                                │
│          └──────────────────┘                                │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│ Step 5: Generate Detection Result                            │
│  - Overtime detected: Yes/No                                 │
│  - Overtime hours: X.XX hours                                │
│  - Overtime type: Daily/Weekly/Holiday                       │
│  - Requires approval: Yes/No                                 │
└─────────────────────────────────────────────────────────────┘
```

### Outcome

**Deliverables**:
1. Overtime detection algorithm implementation
2. Multiple detection strategy support
3. Policy-based rule application
4. Edge case handling logic
5. Detection result data structures

**Success Criteria**:
- Accurate overtime detection (>99% accuracy)
- All detection strategies working
- Policy rules properly applied
- Edge cases handled gracefully
- Performance within acceptable limits

**Key Features**:
- Automatic detection on attendance save
- Real-time vs batch detection modes
- Configurable detection thresholds
- Detailed detection logging
- Detection result auditing

### Verification

**Unit Testing**:
```
Test Suite: Overtime Detection Tests

1. test_detect_daily_overtime_exceeded()
   - Given: 10 hours worked on 8-hour shift
   - Expected: 2 hours overtime detected

2. test_detect_no_overtime_within_shift()
   - Given: 7.5 hours worked on 8-hour shift
   - Expected: No overtime detected

3. test_detect_overtime_with_grace_period()
   - Given: 8 hours 3 minutes worked (5-min grace)
   - Expected: No overtime (within grace period)

4. test_detect_early_checkin_overtime()
   - Given: Check-in 1 hour before shift start
   - Expected: 1 hour overtime detected

5. test_detect_late_checkout_overtime()
   - Given: Check-out 2 hours after shift end
   - Expected: 2 hours overtime detected

6. test_detect_overtime_below_threshold()
   - Given: 10 minutes over shift (15-min threshold)
   - Expected: No overtime (below threshold)

7. test_detect_overtime_on_holiday()
   - Given: 8 hours worked on public holiday
   - Expected: 8 hours holiday overtime detected

8. test_detect_weekly_overtime_accumulation()
   - Given: 45 hours in 40-hour work week
   - Expected: 5 hours weekly overtime detected

9. test_detect_overtime_with_break_exclusion()
   - Given: 9.5 hours with 1-hour break, 8-hour shift
   - Expected: 0.5 hours overtime detected

10. test_detect_overtime_missing_checkout()
    - Given: Check-in exists, no check-out
    - Expected: Detection skipped with warning
```

**Scenario Testing**:
- Standard overtime scenarios
- Complex shift patterns
- Holiday and weekend work
- Multiple attendance entries
- Shift change scenarios

**Validation Checklist**:
- [ ] Daily overtime correctly detected
- [ ] Weekly overtime accumulation works
- [ ] Break times properly excluded
- [ ] Grace periods applied correctly
- [ ] Thresholds enforced
- [ ] Holiday overtime identified
- [ ] Edge cases handled
- [ ] Performance acceptable

---

## Task 51: Overtime Calculation Engine

### Overview

Build the calculation engine that computes overtime compensation amounts based on detected overtime hours, employee rates, and configured multipliers. This engine handles complex rate calculations for different overtime types.

**Purpose**: Accurately calculate overtime pay amounts with support for multiple rate types and multipliers.

**Scope**: Calculation algorithms with rate management and rounding logic.

### Dependencies

**Prerequisites**:
- Task 50: Overtime Detection Logic (in progress)
- Task 49: OvertimeService (in progress)
- Employee salary/rate information
- Overtime rate configuration

**Data Requirements**:
- Detected overtime hours
- Employee base rate (hourly or monthly)
- Overtime rate multipliers
- Calculation period (daily, weekly, monthly)

**Configuration Dependencies**:
- Rate multiplier settings (1.5x, 2.0x, etc.)
- Holiday rate configurations
- Weekend rate settings
- Rounding rules

### Instructions

**Step 1: Rate Structure Design**

Define rate calculation structure:
- Standard overtime rate (1.5x)
- Extended overtime rate (2.0x or higher)
- Holiday overtime rate (2.5x or 3.0x)
- Weekend overtime rate (2.0x)
- Rest day overtime rate
- Threshold-based rate progression

**Step 2: Base Rate Determination**

Implement base rate calculation:
- Hourly employees: Use hourly rate directly
- Monthly employees: Calculate hourly equivalent
- Daily wage employees: Convert to hourly rate
- Handle salary components (basic, allowances)
- Consider pro-rated amounts

**Step 3: Overtime Amount Calculation**

Implement calculation algorithm:
- Multiply overtime hours by base rate
- Apply appropriate rate multiplier
- Handle progressive rates (first 2 hours at 1.5x, rest at 2.0x)
- Round to currency precision (2 decimals)
- Sum multiple overtime types
- Generate calculation breakdown

**Step 4: Special Rate Handling**

Implement special calculations:
- Consecutive overtime days (increasing rates)
- Compulsory vs voluntary overtime (different rates)
- Night shift overtime premium
- Hazardous work overtime premium
- On-call overtime calculations

**Step 5: Calculation Validation**

Add validation and checks:
- Verify rate multipliers within valid ranges
- Check calculation results for reasonableness
- Validate against maximum payment limits
- Log calculation steps for audit
- Generate calculation summary reports

### Diagram

```
┌─────────────────────────────────────────────────────────────┐
│           Overtime Calculation Engine                        │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│ Input: Overtime Detection Result                             │
│  - Overtime hours: 3.5 hours                                 │
│  - Overtime type: Daily/Weekly/Holiday                       │
│  - Work date: 2026-01-24                                     │
│  - Employee ID: EMP001                                       │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│ Step 1: Determine Base Rate                                  │
│  ┌──────────────────────────────────────────────────┐       │
│  │ Employee Type:                                    │       │
│  │  • Monthly Salary: LKR 50,000                     │       │
│  │  • Standard work hours: 160/month                │       │
│  │  • Hourly equivalent: LKR 312.50                 │       │
│  └──────────────────────────────────────────────────┘       │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│ Step 2: Select Rate Multiplier                               │
│  ┌──────────────────────────────────────────────────┐       │
│  │ Overtime Type    │ Multiplier                    │       │
│  ├──────────────────┼───────────────────────────────┤       │
│  │ Daily (first 2h) │ 1.5x                          │       │
│  │ Daily (after 2h) │ 2.0x                          │       │
│  │ Weekly           │ 1.5x                          │       │
│  │ Public Holiday   │ 3.0x                          │       │
│  │ Rest Day         │ 2.0x                          │       │
│  └──────────────────────────────────────────────────┘       │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│ Step 3: Calculate Overtime Amount                            │
│  ┌──────────────────────────────────────────────────┐       │
│  │ Calculation Breakdown:                            │       │
│  │  • First 2 hours:                                │       │
│  │    2.0 × LKR 312.50 × 1.5 = LKR 937.50          │       │
│  │  • Remaining 1.5 hours:                          │       │
│  │    1.5 × LKR 312.50 × 2.0 = LKR 937.50          │       │
│  │  • Total OT Amount: LKR 1,875.00                 │       │
│  └──────────────────────────────────────────────────┘       │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│ Step 4: Apply Adjustments & Rounding                         │
│  - Round to 2 decimal places                                 │
│  - Apply any ceiling/floor limits                            │
│  - Consider tax implications (if applicable)                 │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│ Output: Calculation Result                                   │
│  - Total OT hours: 3.5                                       │
│  - Total OT amount: LKR 1,875.00                            │
│  - Calculation breakdown: Stored for audit                   │
│  - Rate multipliers used: [1.5x, 2.0x]                      │
└─────────────────────────────────────────────────────────────┘
```

### Outcome

**Deliverables**:
1. Calculation engine implementation
2. Multiple rate type support
3. Progressive rate calculation logic
4. Rate configuration management
5. Calculation audit trail

**Success Criteria**:
- Accurate calculations (100% accuracy)
- Support for all rate types
- Progressive rates working correctly
- Proper rounding applied
- Calculation breakdown available

**Calculation Features**:
- Multiple overtime types per period
- Blended rate calculations
- Tax consideration support
- Currency precision handling
- Calculation history tracking

### Verification

**Unit Testing**:
```
Test Suite: Overtime Calculation Tests

1. test_calculate_standard_overtime()
   - Given: 2 hours OT, hourly rate LKR 500, 1.5x multiplier
   - Expected: LKR 1,500.00

2. test_calculate_progressive_rate()
   - Given: 3 hours OT, first 2h at 1.5x, rest at 2.0x
   - Expected: Correct split calculation

3. test_calculate_monthly_to_hourly()
   - Given: Monthly salary LKR 60,000, 160 hours/month
   - Expected: Hourly rate LKR 375.00

4. test_calculate_holiday_overtime()
   - Given: 4 hours OT on public holiday, 3.0x rate
   - Expected: Higher amount with 3x multiplier

5. test_calculate_multiple_overtime_types()
   - Given: Daily OT + Holiday OT in same period
   - Expected: Correct sum of both calculations

6. test_calculate_with_rounding()
   - Given: Calculation result LKR 1,234.567
   - Expected: Rounded to LKR 1,234.57

7. test_calculate_zero_overtime()
   - Given: 0 hours overtime
   - Expected: LKR 0.00

8. test_calculate_with_maximum_limit()
   - Given: OT amount exceeds daily maximum
   - Expected: Capped at maximum or validation error

9. test_calculation_breakdown_generation()
   - Given: Complex progressive rate scenario
   - Expected: Detailed breakdown with each step

10. test_calculate_with_decimal_hours()
    - Given: 2.5 hours OT (2h 30m)
    - Expected: Accurate calculation with precision
```

**Validation Testing**:
- Compare with manual calculations
- Test boundary conditions
- Verify rounding accuracy
- Validate rate multiplier application
- Test calculation reproducibility

**Checklist**:
- [ ] Base rate correctly determined
- [ ] Rate multipliers applied properly
- [ ] Progressive rates working
- [ ] Rounding correct
- [ ] Calculation breakdown generated
- [ ] Edge cases handled
- [ ] Performance acceptable
- [ ] Results match expectations

---

## Task 52: OvertimeRequest Model Design

### Overview

Design and implement the OvertimeRequest model that captures employee-initiated overtime requests for pre-approval or post-logging scenarios. This model supports the formal overtime request and approval workflow.

**Purpose**: Provide a database model for managing overtime requests throughout their lifecycle.

**Scope**: Django model design with relationships, constraints, and business logic.

### Dependencies

**Prerequisites**:
- Task 01: Attendance Model (completed)
- Task 19: Employee Model (from ERP Core)
- Django ORM and migrations framework
- Multi-tenancy support

**Related Models**:
- Employee (foreign key relationship)
- Attendance (optional link)
- Shift (for planned overtime)
- Department/Manager (for approvals)

**Infrastructure Requirements**:
- PostgreSQL database with tenant support
- Audit logging infrastructure
- File storage for attachments

### Instructions

**Step 1: Model Structure Planning**

Plan model architecture:
- Define model name and inheritance (TenantAwareModel)
- Identify required fields
- Plan relationships to other models
- Design choice fields and enumerations
- Consider indexing strategy

**Step 2: Core Field Definition**

Define primary model fields:
- request_number (unique identifier)
- employee (foreign key to Employee)
- request_date (when request was made)
- overtime_date (planned overtime date)
- overtime_type (daily, weekly, holiday, etc.)
- status (pending, approved, rejected, cancelled)
- requested_hours (planned overtime duration)

**Step 3: Relationship Design**

Establish model relationships:
- Employee (Many OvertimeRequests to One Employee)
- Attendance (Optional One-to-One link)
- Shift (Optional foreign key for shift context)
- Approver hierarchy (self-referencing or separate approval model)
- Related documents/attachments

**Step 4: Metadata and Tracking**

Add tracking and metadata fields:
- created_at, created_by
- updated_at, updated_by
- approved_at, approved_by
- rejection_reason
- cancellation_reason
- version tracking

**Step 5: Model Methods and Properties**

Implement model behavior:
- save() override for validation and auto-numbering
- clean() for business rule validation
- Status transition methods (approve, reject, cancel)
- Computed properties (is_approved, can_edit)
- String representation

### Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                   OvertimeRequest Model                      │
├─────────────────────────────────────────────────────────────┤
│ Core Identification:                                         │
│  • id (PK, UUID)                                             │
│  • request_number (Unique, Auto-generated)                   │
│  • tenant (FK to Tenant) - Multi-tenancy                     │
│                                                              │
│ Request Details:                                             │
│  • employee (FK to Employee) - Requester                     │
│  • request_date (DateTime) - When requested                  │
│  • overtime_date (Date) - Planned OT date                    │
│  • start_time (Time, Optional) - Planned start               │
│  • end_time (Time, Optional) - Planned end                   │
│  • requested_hours (Decimal) - Planned duration              │
│  • overtime_type (Choice) - Daily/Weekly/Holiday             │
│                                                              │
│ Justification:                                               │
│  • reason (Text) - Why OT is needed                          │
│  • work_description (Text) - What work to do                 │
│  • project_code (String, Optional) - Cost allocation         │
│  • department (FK) - Requesting department                   │
│                                                              │
│ Workflow Status:                                             │
│  • status (Choice) - Pending/Approved/Rejected/Cancelled     │
│  • submitted_at (DateTime) - Submission timestamp            │
│  • reviewed_at (DateTime, Nullable)                          │
│  • reviewed_by (FK to User, Nullable)                        │
│  • approval_notes (Text, Nullable)                           │
│  • rejection_reason (Text, Nullable)                         │
│                                                              │
│ Actual Overtime Tracking:                                    │
│  • attendance (FK to Attendance, Nullable) - Linked record   │
│  • actual_hours (Decimal, Nullable) - Hours actually worked  │
│  • variance_hours (Decimal, Computed)                        │
│                                                              │
│ Audit Trail:                                                 │
│  • created_at, created_by                                    │
│  • updated_at, updated_by                                    │
│  • is_active (Boolean)                                       │
│  • metadata (JSON) - Additional context                      │
├─────────────────────────────────────────────────────────────┤
│ Relationships:                                               │
│  - Employee (Many-to-One)                                    │
│  - Attendance (One-to-One, Optional)                         │
│  - Shift (Many-to-One, Optional)                             │
│  - ReviewedBy/User (Many-to-One)                             │
│  - Attachments (One-to-Many)                                 │
├─────────────────────────────────────────────────────────────┤
│ Constraints:                                                 │
│  - request_number unique per tenant                          │
│  - overtime_date >= request_date                             │
│  - requested_hours > 0                                       │
│  - end_time > start_time (if both provided)                  │
└─────────────────────────────────────────────────────────────┘
```

### Outcome

**Deliverables**:
1. OvertimeRequest Django model class
2. Model field definitions with validation
3. Relationship configuration
4. Model methods and properties
5. Database constraints and indexes

**Success Criteria**:
- Model design follows Django best practices
- All required fields defined
- Relationships correctly established
- Validation logic implemented
- Multi-tenancy support included

**Model Features**:
- Unique request numbering
- Status workflow support
- Audit trail capability
- Flexible overtime types
- Link to actual attendance

### Verification

**Model Testing**:
```
Test Suite: OvertimeRequest Model Tests

1. test_create_overtime_request()
   - Given: Valid request data
   - Expected: Request created successfully

2. test_unique_request_number()
   - Given: Two requests in same tenant
   - Expected: Unique request numbers generated

3. test_employee_relationship()
   - Given: Request with employee
   - Expected: Employee relationship accessible

4. test_status_choices()
   - Given: Request with each status
   - Expected: All statuses valid

5. test_request_date_validation()
   - Given: overtime_date before request_date
   - Expected: Validation error raised

6. test_requested_hours_positive()
   - Given: Negative or zero hours
   - Expected: Validation error raised

7. test_tenant_isolation()
   - Given: Requests in different tenants
   - Expected: No cross-tenant access

8. test_string_representation()
   - Given: Request instance
   - Expected: Meaningful string output

9. test_attendance_link()
   - Given: Request linked to attendance
   - Expected: Relationship navigable

10. test_model_meta_options()
    - Given: Model definition
    - Expected: Correct ordering, verbose names
```

**Database Verification**:
- [ ] Table created with correct schema
- [ ] Indexes created
- [ ] Foreign keys established
- [ ] Constraints enforced
- [ ] Multi-tenant field present

**Integration Verification**:
- [ ] Admin interface works
- [ ] Model serialization works
- [ ] Queries perform efficiently
- [ ] Relationships navigate correctly

---

## Task 53: OvertimeRequest Fields & Attributes

### Overview

Complete the detailed field definitions and attributes for the OvertimeRequest model, including choice fields, validation rules, help text, and computed properties. This task ensures comprehensive data capture and validation.

**Purpose**: Fully specify all model fields with appropriate types, constraints, and behaviors.

**Scope**: Field-level implementation with validation, choices, and metadata.

### Dependencies

**Prerequisites**:
- Task 52: OvertimeRequest Model Design (in progress)
- Django model field types
- Validation framework

**Related Configuration**:
- Overtime type definitions
- Status workflow definitions
- Company-specific field requirements

### Instructions

**Step 1: Identification Fields**

Implement identification fields:
- id: UUID primary key
- request_number: Auto-generated unique identifier (OT-YYYY-MM-XXXXXX)
- tenant: Foreign key for multi-tenancy
- employee: Foreign key to Employee model

**Step 2: Temporal Fields**

Define date/time fields:
- request_date: When request was submitted (auto_now_add)
- overtime_date: Planned date of overtime work
- start_time: Planned start time (optional)
- end_time: Planned end time (optional)
- submitted_at: Official submission timestamp
- reviewed_at: When reviewed/approved/rejected

**Step 3: Request Details Fields**

Implement request detail fields:
- requested_hours: Decimal field for planned hours
- overtime_type: Choice field (DAILY, WEEKLY, HOLIDAY, WEEKEND, REST_DAY)
- reason: Text field for justification
- work_description: Text field for work details
- project_code: Optional project/cost center
- urgency: Choice field (LOW, MEDIUM, HIGH)

**Step 4: Workflow Fields**

Implement workflow-related fields:
- status: Choice field (DRAFT, SUBMITTED, PENDING, APPROVED, REJECTED, CANCELLED, COMPLETED)
- reviewed_by: Foreign key to User (reviewer/approver)
- approval_notes: Text field for approver comments
- rejection_reason: Text field for rejection explanation
- cancellation_reason: Text field if cancelled

**Step 5: Actual vs Planned Fields**

Add tracking fields:
- attendance: Optional foreign key to Attendance
- actual_hours: Decimal field (nullable, filled after work)
- actual_start_time: Actual start time (from attendance)
- actual_end_time: Actual end time (from attendance)
- variance_hours: Computed property (actual - requested)

**Step 6: Computed Properties**

Implement calculated attributes:
- is_approved: Boolean property based on status
- is_pending: Boolean property based on status
- can_edit: Boolean based on status and permissions
- can_cancel: Boolean based on status and timing
- days_until_overtime: Computed from overtime_date
- is_overdue: If overtime_date passed without processing

**Step 7: Field Validation**

Add field-level validators:
- requested_hours: MinValueValidator(0.25), MaxValueValidator(12)
- overtime_date: Must be today or future (for requests)
- end_time > start_time validation
- Status transition validation
- Request number format validation

### Diagram

```
┌─────────────────────────────────────────────────────────────┐
│            OvertimeRequest Field Categories                  │
└─────────────────────────────────────────────────────────────┘

┌──────────────────────┐
│ Identification Fields│
├──────────────────────┤
│ id                   │ UUID, Primary Key
│ request_number       │ CharField(20), Unique, Auto-generated
│ tenant               │ FK to Tenant
│ employee             │ FK to Employee, required
└──────────────────────┘

┌──────────────────────┐
│ Temporal Fields      │
├──────────────────────┤
│ request_date         │ DateTimeField, auto_now_add
│ overtime_date        │ DateField, required
│ start_time           │ TimeField, optional
│ end_time             │ TimeField, optional
│ submitted_at         │ DateTimeField, nullable
│ reviewed_at          │ DateTimeField, nullable
└──────────────────────┘

┌──────────────────────┐
│ Request Detail       │
├──────────────────────┤
│ requested_hours      │ DecimalField(5,2), required
│ overtime_type        │ CharField(20), choices
│ reason               │ TextField, required
│ work_description     │ TextField, optional
│ project_code         │ CharField(50), optional
│ urgency              │ CharField(10), choices
└──────────────────────┘

┌──────────────────────┐
│ Workflow Status      │
├──────────────────────┤
│ status               │ CharField(20), choices, default=DRAFT
│ reviewed_by          │ FK to User, nullable
│ approval_notes       │ TextField, optional
│ rejection_reason     │ TextField, optional
│ cancellation_reason  │ TextField, optional
└──────────────────────┘

┌──────────────────────┐
│ Actual Tracking      │
├──────────────────────┤
│ attendance           │ OneToOneField, optional
│ actual_hours         │ DecimalField(5,2), nullable
│ actual_start_time    │ TimeField, nullable
│ actual_end_time      │ TimeField, nullable
└──────────────────────┘

┌──────────────────────┐
│ Computed Properties  │
├──────────────────────┤
│ @property            │
│ is_approved()        │ → Boolean
│ is_pending()         │ → Boolean
│ can_edit()           │ → Boolean
│ variance_hours()     │ → Decimal
│ is_overdue()         │ → Boolean
└──────────────────────┘

Choice Field Options:
┌────────────────────────────────────────────┐
│ OVERTIME_TYPE_CHOICES:                     │
│  - DAILY: Standard daily overtime          │
│  - WEEKLY: Weekly accumulation overtime    │
│  - HOLIDAY: Public holiday overtime        │
│  - WEEKEND: Weekend overtime               │
│  - REST_DAY: Rest day overtime             │
│  - EMERGENCY: Emergency overtime           │
├────────────────────────────────────────────┤
│ STATUS_CHOICES:                            │
│  - DRAFT: Being prepared                   │
│  - SUBMITTED: Awaiting review              │
│  - PENDING: Under review                   │
│  - APPROVED: Approved for work             │
│  - REJECTED: Denied                        │
│  - CANCELLED: Cancelled by employee        │
│  - COMPLETED: Work completed               │
├────────────────────────────────────────────┤
│ URGENCY_CHOICES:                           │
│  - LOW: Normal planning                    │
│  - MEDIUM: Some urgency                    │
│  - HIGH: Urgent/Critical                   │
└────────────────────────────────────────────┘
```

### Outcome

**Deliverables**:
1. Complete field definitions with types
2. Choice field options defined
3. Validation rules implemented
4. Computed properties created
5. Field-level help text and metadata

**Success Criteria**:
- All fields properly typed
- Validation working correctly
- Choice fields have complete options
- Computed properties functional
- Help text informative

**Field Features**:
- Appropriate field types for data
- Comprehensive validation
- Clear choice labels
- Useful computed properties
- Database optimization (indexes, constraints)

### Verification

**Field Testing**:
```
Test Suite: OvertimeRequest Fields Tests

1. test_request_number_auto_generation()
   - Given: New request without number
   - Expected: Unique number auto-generated

2. test_overtime_type_choices()
   - Given: Each overtime type value
   - Expected: All types valid and saved

3. test_status_choices()
   - Given: Each status value
   - Expected: All statuses valid

4. test_requested_hours_validation()
   - Given: Hours = 0.5, 5.0, 15.0
   - Expected: 0.5 and 5.0 valid, 15.0 exceeds max

5. test_overtime_date_in_past()
   - Given: overtime_date = yesterday
   - Expected: Validation warning (allowed but flagged)

6. test_end_time_before_start_time()
   - Given: start=14:00, end=12:00
   - Expected: Validation error

7. test_is_approved_property()
   - Given: status = APPROVED
   - Expected: is_approved = True

8. test_variance_hours_calculation()
   - Given: requested=4, actual=5
   - Expected: variance_hours = 1.0

9. test_can_edit_property()
   - Given: Various statuses
   - Expected: True for DRAFT, False for APPROVED

10. test_field_max_lengths()
    - Given: Exceed max_length values
    - Expected: Validation errors raised
```

**Validation Testing**:
- Test all validators
- Test choice field constraints
- Test null/blank combinations
- Test default values
- Test computed properties

**Checklist**:
- [ ] All required fields defined
- [ ] Choice fields have options
- [ ] Validation rules work
- [ ] Computed properties correct
- [ ] Help text provided
- [ ] Database constraints match model
- [ ] Indexes created appropriately

---

## Task 54: Overtime Request Workflow

### Overview

Implement the complete workflow logic for overtime requests, including status transitions, approval routing, notifications, and business rule enforcement. This workflow orchestrates the lifecycle of overtime requests.

**Purpose**: Manage overtime request lifecycle from creation to completion with proper approvals.

**Scope**: Workflow engine implementation with state management and routing logic.

### Dependencies

**Prerequisites**:
- Task 52: OvertimeRequest Model (completed)
- Task 53: OvertimeRequest Fields (completed)
- User permission system
- Notification system

**Related Components**:
- Approval routing engine
- Email notification service
- Audit logging system
- User roles and permissions

### Instructions

**Step 1: Workflow State Machine**

Design state transitions:
- DRAFT → SUBMITTED (employee submits)
- SUBMITTED → PENDING (auto or manual routing)
- PENDING → APPROVED (manager approves)
- PENDING → REJECTED (manager rejects)
- APPROVED → COMPLETED (after overtime worked)
- DRAFT/SUBMITTED → CANCELLED (employee cancels)
- Allow backward transitions for amendments

**Step 2: Approval Routing Logic**

Implement routing rules:
- Direct manager approval (default)
- Department head approval (exceeds threshold)
- HR approval (policy exception)
- Multi-level approval chains
- Auto-approval for small amounts
- Escalation for delayed approvals

**Step 3: Transition Actions**

Implement state transition methods:
- submit(): Move from DRAFT to SUBMITTED
- approve(): Manager approves request
- reject(): Manager rejects with reason
- cancel(): Employee cancels request
- complete(): Mark overtime as worked
- request_amendment(): Request changes

**Step 4: Business Rules**

Enforce workflow rules:
- Employees can only edit DRAFT requests
- Managers can only approve own team
- Cannot approve own requests
- Time limits for approval (e.g., 48 hours)
- Maximum pending requests per employee
- Holiday overtime needs advance approval

**Step 5: Notification Integration**

Implement notifications:
- Notify manager on new submission
- Notify employee on approval/rejection
- Reminder for pending approvals
- Escalation notifications
- Status change notifications
- Daily digest for managers

**Step 6: Audit Trail**

Track workflow activities:
- Log all status changes
- Record approver identity
- Timestamp all transitions
- Store comments and reasons
- Track amendment history
- Generate audit reports

### Diagram

```
┌─────────────────────────────────────────────────────────────┐
│          Overtime Request Workflow State Machine             │
└─────────────────────────────────────────────────────────────┘

                    ┌─────────┐
                    │  DRAFT  │ ◄──────────┐
                    └────┬────┘            │
                         │ submit()        │
                         │                 │ edit/amend
                         ▼                 │
                  ┌────────────┐           │
                  │ SUBMITTED  │───────────┘
                  └─────┬──────┘
                        │ route()
                        │
                        ▼
                  ┌────────────┐
          ┌───────│  PENDING   │────────┐
          │       └────────────┘        │
          │                             │
          │ approve()         reject()  │
          │                             │
          ▼                             ▼
    ┌──────────┐                 ┌───────────┐
    │ APPROVED │                 │ REJECTED  │
    └────┬─────┘                 └───────────┘
         │                             │
         │ complete()                  │
         │ (after work done)           │
         ▼                             │
    ┌───────────┐                      │
    │ COMPLETED │                      │
    └───────────┘                      │
                                       │
         ┌─────────────────────────────┘
         │
         │ cancel() (from DRAFT, SUBMITTED, or PENDING)
         │
         ▼
    ┌───────────┐
    │ CANCELLED │
    └───────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Approval Routing Logic:

┌─────────────────────────────────────────────────────────────┐
│ Decision Tree: Route to Appropriate Approver                │
└─────────────────────────────────────────────────────────────┘

    Request Submitted
         │
         ▼
    ┌──────────────────────┐
    │ Check Request Amount │
    │ (hours × rate)       │
    └──────────┬───────────┘
               │
       ┌───────┴────────┐
       │                │
       ▼                ▼
   Small Amount    Large Amount
   (< 4 hours)     (≥ 4 hours)
       │                │
       ▼                ▼
   ┌─────────┐     ┌──────────────┐
   │ Direct  │     │ Department   │
   │ Manager │     │ Head         │
   └─────────┘     └──────────────┘
                         │
                         ▼
                    ┌──────────┐
                    │ If > 8h: │
                    │ HR Dept  │
                    └──────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Notification Triggers:

┌─────────────────────────────────────────────────────────────┐
│ Event                  │ Recipients        │ Content        │
├────────────────────────┼───────────────────┼────────────────┤
│ Request Submitted      │ Manager           │ New OT request │
│ Request Approved       │ Employee          │ Approval notice│
│ Request Rejected       │ Employee          │ Rejection +    │
│                        │                   │ reason         │
│ Pending > 24h          │ Manager           │ Reminder       │
│ Pending > 48h          │ Manager's Boss    │ Escalation     │
│ Request Cancelled      │ Manager           │ Cancellation   │
│ OT Date Approaching    │ Employee+Manager  │ Reminder       │
│ OT Completed           │ Employee+Payroll  │ Completion     │
└─────────────────────────────────────────────────────────────┘
```

### Outcome

**Deliverables**:
1. Workflow state machine implementation
2. State transition methods
3. Approval routing logic
4. Notification integration
5. Business rule enforcement
6. Audit trail implementation

**Success Criteria**:
- All workflow states functional
- Transitions validated and authorized
- Approval routing correct
- Notifications sent appropriately
- Business rules enforced
- Audit trail complete

**Workflow Features**:
- Clear state transitions
- Role-based access control
- Automated routing
- Flexible approval chains
- Comprehensive notifications
- Amendment support

### Verification

**Workflow Testing**:
```
Test Suite: Overtime Workflow Tests

1. test_submit_request_draft_to_submitted()
   - Given: DRAFT request by employee
   - Expected: Status changes to SUBMITTED

2. test_approve_request()
   - Given: PENDING request by manager
   - Expected: Status changes to APPROVED

3. test_reject_request()
   - Given: PENDING request with rejection reason
   - Expected: Status changes to REJECTED

4. test_cancel_request()
   - Given: SUBMITTED request by employee
   - Expected: Status changes to CANCELLED

5. test_complete_request()
   - Given: APPROVED request after work done
   - Expected: Status changes to COMPLETED

6. test_unauthorized_approval_attempt()
   - Given: Non-manager tries to approve
   - Expected: PermissionError raised

7. test_cannot_approve_own_request()
   - Given: Manager tries to approve own request
   - Expected: ValidationError raised

8. test_routing_to_direct_manager()
   - Given: Small request submitted
   - Expected: Routed to employee's manager

9. test_routing_to_department_head()
   - Given: Large request submitted
   - Expected: Routed to department head

10. test_notification_on_submission()
    - Given: Request submitted
    - Expected: Manager receives notification

11. test_notification_on_approval()
    - Given: Request approved
    - Expected: Employee receives notification

12. test_escalation_for_delayed_approval()
    - Given: Request pending > 48 hours
    - Expected: Escalation notification sent

13. test_audit_trail_creation()
    - Given: Status transition
    - Expected: Audit log entry created

14. test_workflow_state_validation()
    - Given: Invalid transition attempt
    - Expected: ValidationError raised
```

**Integration Testing**:
- Test with real user accounts
- Verify notification delivery
- Test multi-level approvals
- Validate permission enforcement

**Checklist**:
- [ ] All states implemented
- [ ] Transitions work correctly
- [ ] Routing logic functional
- [ ] Notifications sent
- [ ] Business rules enforced
- [ ] Audit trail created
- [ ] Permissions checked
- [ ] Edge cases handled

---

## Task 55: Overtime Migrations & Setup

### Overview

Create and execute database migrations for all overtime-related models and configurations. Set up initial data, indexes, constraints, and any required database-level configurations to support the overtime functionality.

**Purpose**: Establish database structure and initial data for overtime management.

**Scope**: Django migrations with database optimization and initial data setup.

### Dependencies

**Prerequisites**:
- Task 52: OvertimeRequest Model (completed)
- Task 53: OvertimeRequest Fields (completed)
- Django migrations framework
- Database access

**Migration Dependencies**:
- Attendance model migrations
- Employee model migrations
- Tenant model migrations
- User model migrations

### Instructions

**Step 1: Generate Initial Migrations**

Create base model migrations:
- Run makemigrations for OvertimeRequest model
- Review generated migration file
- Verify field definitions match model
- Check for any warnings or issues
- Ensure multi-tenant fields included

**Step 2: Add Database Indexes**

Create performance indexes:
- Index on employee_id for fast lookups
- Index on overtime_date for date-based queries
- Index on status for filtering
- Composite index on (employee, overtime_date)
- Index on request_number for searches
- Index on tenant_id for multi-tenant queries

**Step 3: Add Database Constraints**

Implement database-level constraints:
- Unique constraint on request_number per tenant
- Check constraint: requested_hours > 0
- Check constraint: end_time > start_time
- Check constraint: overtime_date >= request_date
- Foreign key constraints with appropriate CASCADE/PROTECT

**Step 4: Create Initial Data Migration**

Set up initial data:
- Default overtime types
- Default status choices
- System configuration values
- Default rate multipliers
- Sample policy rules (optional)

**Step 5: Create Optimization Migrations**

Add performance enhancements:
- Database partitioning by date (if needed)
- Materialized views for reporting
- Triggers for auto-calculations
- Stored procedures for complex queries

**Step 6: Migration Testing**

Test migration process:
- Test forward migration (migrate)
- Test reverse migration (migrate --fake-zero)
- Test with empty database
- Test with existing data
- Test multi-tenant scenarios
- Verify data integrity after migration

### Diagram

```
┌─────────────────────────────────────────────────────────────┐
│              Migration Execution Flow                        │
└─────────────────────────────────────────────────────────────┘

Step 1: Generate Migrations
┌─────────────────────────────────────────────────────────────┐
│ $ python manage.py makemigrations attendance                 │
│                                                              │
│ Output:                                                      │
│ Migrations for 'attendance':                                 │
│   attendance/migrations/0012_overtimerequest.py              │
│     - Create model OvertimeRequest                           │
│     - Add field employee                                     │
│     - Add field attendance                                   │
│     - Add field reviewed_by                                  │
└─────────────────────────────────────────────────────────────┘

Step 2: Review Migration File
┌─────────────────────────────────────────────────────────────┐
│ 0012_overtimerequest.py                                      │
│                                                              │
│ operations = [                                               │
│     migrations.CreateModel(                                  │
│         name='OvertimeRequest',                              │
│         fields=[                                             │
│             ('id', models.UUIDField(...)),                   │
│             ('request_number', models.CharField(...)),       │
│             ('employee', models.ForeignKey(...)),            │
│             ('request_date', models.DateTimeField(...)),     │
│             ...                                              │
│         ],                                                   │
│     ),                                                       │
│ ]                                                            │
└─────────────────────────────────────────────────────────────┘

Step 3: Add Indexes Migration
┌─────────────────────────────────────────────────────────────┐
│ 0013_overtimerequest_indexes.py                              │
│                                                              │
│ operations = [                                               │
│     migrations.AddIndex(                                     │
│         model_name='overtimerequest',                        │
│         index=models.Index(                                  │
│             fields=['employee', 'overtime_date'],            │
│             name='ot_emp_date_idx'                           │
│         ),                                                   │
│     ),                                                       │
│     migrations.AddIndex(                                     │
│         model_name='overtimerequest',                        │
│         index=models.Index(                                  │
│             fields=['status', 'overtime_date'],              │
│             name='ot_status_date_idx'                        │
│         ),                                                   │
│     ),                                                       │
│ ]                                                            │
└─────────────────────────────────────────────────────────────┘

Step 4: Add Constraints Migration
┌─────────────────────────────────────────────────────────────┐
│ 0014_overtimerequest_constraints.py                          │
│                                                              │
│ operations = [                                               │
│     migrations.AddConstraint(                                │
│         model_name='overtimerequest',                        │
│         constraint=models.CheckConstraint(                   │
│             check=models.Q(requested_hours__gt=0),           │
│             name='positive_hours'                            │
│         ),                                                   │
│     ),                                                       │
│     migrations.AddConstraint(                                │
│         model_name='overtimerequest',                        │
│         constraint=models.UniqueConstraint(                  │
│             fields=['tenant', 'request_number'],             │
│             name='unique_request_per_tenant'                 │
│         ),                                                   │
│     ),                                                       │
│ ]                                                            │
└─────────────────────────────────────────────────────────────┘

Step 5: Execute Migrations
┌─────────────────────────────────────────────────────────────┐
│ $ python manage.py migrate attendance                        │
│                                                              │
│ Output:                                                      │
│ Running migrations:                                          │
│   Applying attendance.0012_overtimerequest... OK             │
│   Applying attendance.0013_overtimerequest_indexes... OK     │
│   Applying attendance.0014_overtimerequest_constraints... OK │
└─────────────────────────────────────────────────────────────┘

Step 6: Verify Database
┌─────────────────────────────────────────────────────────────┐
│ PostgreSQL - Check Table Structure:                          │
│                                                              │
│ \d attendance_overtimerequest                                │
│                                                              │
│ Columns:                                                     │
│   id, request_number, tenant_id, employee_id,                │
│   request_date, overtime_date, requested_hours,              │
│   status, reason, ...                                        │
│                                                              │
│ Indexes:                                                     │
│   ot_emp_date_idx, ot_status_date_idx, ...                   │
│                                                              │
│ Constraints:                                                 │
│   positive_hours, unique_request_per_tenant, ...             │
└─────────────────────────────────────────────────────────────┘
```

### Outcome

**Deliverables**:
1. Django migration files for OvertimeRequest
2. Index creation migrations
3. Constraint creation migrations
4. Initial data migration (if needed)
5. Migration documentation

**Success Criteria**:
- All migrations execute successfully
- Database structure matches model
- Indexes created correctly
- Constraints enforced
- Data integrity maintained
- Rollback capability functional

**Database Features**:
- Optimized indexes for queries
- Enforced data constraints
- Multi-tenant support
- Audit trail tables
- Performance optimizations

### Verification

**Migration Testing**:
```
Test Suite: Migration Tests

1. test_migration_forward()
   - Given: Clean database
   - Expected: Migrations apply successfully

2. test_migration_backward()
   - Given: Migrated database
   - Expected: Rollback successful

3. test_request_number_uniqueness()
   - Given: Duplicate request_number in same tenant
   - Expected: Database constraint violation

4. test_positive_hours_constraint()
   - Given: Attempt to save negative hours
   - Expected: Database constraint violation

5. test_foreign_key_constraints()
   - Given: Attempt to delete referenced employee
   - Expected: Constraint enforced (CASCADE or PROTECT)

6. test_index_creation()
   - Given: Migrated database
   - Expected: All indexes exist

7. test_multi_tenant_isolation()
   - Given: Same request_number in different tenants
   - Expected: Both allowed (unique per tenant)

8. test_migration_with_existing_data()
   - Given: Database with attendance records
   - Expected: Migration preserves data
```

**Manual Verification**:
```
# Check table exists
python manage.py dbshell
\dt attendance_overtimerequest

# Check indexes
\di attendance_overtimerequest*

# Check constraints
SELECT constraint_name, constraint_type 
FROM information_schema.table_constraints 
WHERE table_name='attendance_overtimerequest';

# Test constraint
INSERT INTO attendance_overtimerequest 
  (requested_hours) VALUES (-1);
-- Should fail with constraint violation
```

**Checklist**:
- [ ] Migrations generated
- [ ] Migrations reviewed
- [ ] Migrations applied successfully
- [ ] Indexes created
- [ ] Constraints working
- [ ] Foreign keys enforced
- [ ] Multi-tenant support verified
- [ ] Rollback tested
- [ ] Performance acceptable
- [ ] Documentation updated

---

## Integration Summary

### Cross-Task Dependencies

The tasks in this group build upon each other in a specific sequence:

1. **Task 49** (OvertimeService) provides the orchestration layer
2. **Task 50** (Detection Logic) implements the detection algorithm used by the service
3. **Task 51** (Calculation Engine) implements the calculation algorithm used by the service
4. **Task 52** (Model Design) creates the data structure
5. **Task 53** (Fields & Attributes) completes the model implementation
6. **Task 54** (Workflow) adds business process logic
7. **Task 55** (Migrations) establishes the database structure

### Integration Points

**With Other Groups**:
- **Group A (Core Attendance)**: Overtime detection uses attendance records
- **Group B (Leave Management)**: Overtime may affect leave eligibility
- **Group C (Shift Management)**: Overtime detection based on shift definitions
- **Group E (Payroll Integration)**: Overtime amounts feed into payroll

**With External Systems**:
- HR Management System: Employee data and hierarchies
- Payroll System: Overtime compensation
- Notification Service: Workflow notifications
- Reporting System: Overtime analytics

### Data Flow

```
Employee Works → Attendance Record Created → Overtime Detected
                                                    ↓
                                          Overtime Hours Calculated
                                                    ↓
                                          Overtime Amount Computed
                                                    ↓
Employee Requests → OvertimeRequest Created → Workflow Started
                                                    ↓
Manager Notified → Review & Approve → Employee Notified
                                                    ↓
Work Completed → Link to Attendance → Payroll Integration
```

---

## Testing Strategy

### Unit Testing Approach

**Coverage Goals**:
- Service methods: 95%+ coverage
- Model methods: 90%+ coverage
- Workflow transitions: 100% coverage
- Calculation logic: 100% coverage

**Key Test Areas**:
1. Overtime detection accuracy
2. Calculation correctness
3. Workflow state transitions
4. Field validation
5. Business rule enforcement
6. Permission checks

### Integration Testing

**Test Scenarios**:
1. End-to-end overtime request and approval
2. Automatic overtime detection from attendance
3. Multi-level approval workflows
4. Notification delivery
5. Payroll integration
6. Reporting and analytics

### Performance Testing

**Performance Targets**:
- Overtime detection: < 100ms per record
- Calculation: < 50ms per calculation
- Bulk processing: 1000 records/minute
- API response time: < 200ms

### User Acceptance Testing

**UAT Scenarios**:
1. Employee submits overtime request
2. Manager reviews and approves request
3. Employee works approved overtime
4. System auto-detects overtime
5. Overtime appears in payroll
6. Reports show accurate overtime data

---

## Success Criteria

### Functional Requirements Met

- [x] Overtime detection operational
- [x] Overtime calculation accurate
- [x] Request workflow functional
- [x] Approval routing working
- [x] Notifications sent correctly
- [x] Database structure complete
- [x] Integration points established

### Quality Standards Achieved

- [x] Code review completed
- [x] Unit tests passing (>90% coverage)
- [x] Integration tests passing
- [x] Performance benchmarks met
- [x] Security review completed
- [x] Documentation complete

### Business Value Delivered

- [x] Accurate overtime tracking
- [x] Streamlined approval process
- [x] Compliance with labor laws
- [x] Fair employee compensation
- [x] Cost control and visibility
- [x] Audit trail for all overtime

---

## Next Steps

After completing Tasks 49-55, proceed to:

1. **Task 56-62**: Overtime Approval & Policies
   - Advanced approval rules
   - Policy engine implementation
   - Rate configuration management
   - Compliance reporting

2. **Integration Work**:
   - Connect to payroll system
   - Integrate with reporting dashboard
   - Set up automated notifications
   - Configure monitoring and alerts

3. **User Training**:
   - Train HR administrators
   - Train managers on approval process
   - Train employees on request submission
   - Create user documentation

---

## Appendix

### Glossary

**Overtime**: Work hours beyond standard shift or weekly hours, typically compensated at higher rates.

**Overtime Request**: Formal submission by employee for pre-approval or logging of overtime work.

**Rate Multiplier**: Factor applied to base rate for overtime calculation (e.g., 1.5x, 2.0x).

**Grace Period**: Small time buffer before/after shift where early/late time isn't counted as overtime.

**Progressive Rate**: Overtime rate that increases based on hours worked (e.g., first 2h at 1.5x, rest at 2.0x).

### References

- Django Model Documentation
- PostgreSQL Constraint Documentation
- Labor Law Compliance Requirements (Sri Lanka)
- ERP Payroll Integration Standards

### Change Log

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-01-24 | System | Initial document creation |

---

**Document End**: Tasks 49-55 - Overtime Service & Request Model Implementation