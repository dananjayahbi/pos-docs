# Tasks 25-32: Hours Calculation, Location Tracking, and Database Optimization

**Document Version:** 1.0  
**Last Updated:** 2026-01-24  
**Status:** Active Development  
**Document Type:** Technical Specification

---

## Navigation

- **Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **Previous:** [01_Tasks-17-24_Choices-Core-Fields.md](01_Tasks-17-24_Choices-Core-Fields.md)
- **Next:** [../../SubPhase-04_Shift-Management/Group-C_Shift-Definition-Model/00_GROUP_OVERVIEW.md](../../SubPhase-04_Shift-Management/Group-C_Shift-Definition-Model/00_GROUP_OVERVIEW.md)
- **Phase:** [Phase-06_ERP-Advanced-Modules](../../../Phase-06_ERP-Advanced-Modules)
- **SubPhase:** [SubPhase-03_Attendance-System](../../SubPhase-03_Attendance-System)

---

## Table of Contents

1. [Document Purpose](#document-purpose)
2. [Tasks Overview](#tasks-overview)
3. [Task 25: Shift Assignment (FK Relationship)](#task-25-shift-assignment-fk-relationship)
4. [Task 26: Time Duration Fields (Decimal Hours)](#task-26-time-duration-fields-decimal-hours)
5. [Task 27: Deviation Tracking (Integer Minutes)](#task-27-deviation-tracking-integer-minutes)
6. [Task 28: Overtime Management Fields](#task-28-overtime-management-fields)
7. [Task 29: Clock-In Location Tracking (GPS)](#task-29-clock-in-location-tracking-gps)
8. [Task 30: Clock-Out Location Tracking (GPS)](#task-30-clock-out-location-tracking-gps)
9. [Task 31: IP Address Tracking](#task-31-ip-address-tracking)
10. [Task 32: Database Indexes and Constraints](#task-32-database-indexes-and-constraints)
11. [Migration Strategy](#migration-strategy)
12. [Validation Rules](#validation-rules)
13. [Business Logic Guidelines](#business-logic-guidelines)
14. [Testing Considerations](#testing-considerations)
15. [Security and Privacy](#security-and-privacy)
16. [Performance Optimization](#performance-optimization)

---

## Document Purpose

This document provides comprehensive specifications for Tasks 25-32 of the Attendance Record Model implementation. These tasks complete the core model by adding:

- **Shift relationship:** Links attendance records to defined shift schedules
- **Time calculation fields:** Precise tracking of work hours, breaks, and effective time
- **Deviation metrics:** Late arrivals and early departures measurement
- **Overtime handling:** Hours worked beyond schedule with approval workflow
- **Location tracking:** GPS coordinates for clock-in/out verification
- **IP tracking:** Network-level attendance verification
- **Database optimization:** Indexes and constraints for query performance and data integrity

These features enable complete attendance lifecycle management with robust verification, accurate time tracking, and efficient data retrieval.

---

## Tasks Overview

### Task Distribution

| Task | Component | Priority | Complexity | Dependencies |
|------|-----------|----------|------------|--------------|
| 25 | Shift FK Relationship | High | Medium | Shift model (Group-C) |
| 26 | Duration Fields (Decimal) | Critical | Medium | Tasks 17-21 (timestamps) |
| 27 | Deviation Fields (Integer) | High | Low | Task 25 (shift), Tasks 17-21 |
| 28 | Overtime Management | High | Medium | Task 26 (hours fields) |
| 29 | Clock-In Location (JSON) | Medium | Medium | Task 17 (clock_in_time) |
| 30 | Clock-Out Location (JSON) | Medium | Medium | Task 18 (clock_out_time) |
| 31 | IP Address Tracking | Low | Low | Tasks 17-18 (timestamps) |
| 32 | Database Indexes | Critical | Medium | All previous tasks |

### Completion Criteria

- ✅ All fields properly defined with appropriate data types
- ✅ Foreign key relationships established with proper constraints
- ✅ JSON schema validation for location data
- ✅ Database indexes created for optimal query performance
- ✅ Unique constraints prevent duplicate records
- ✅ Migrations tested in development environment
- ✅ Field validation rules documented
- ✅ Privacy considerations addressed
- ✅ Performance benchmarks met

---

## Task 25: Shift Assignment (FK Relationship)

### Overview

Establishes the relationship between attendance records and shift definitions. This connection enables the system to:
- Validate attendance against scheduled shifts
- Calculate deviations from expected times
- Determine overtime eligibility
- Support shift-based reporting and analytics

### Field Specifications

#### Field: `shift`

**Purpose:** References the assigned shift for this attendance record

**Technical Details:**
- **Type:** ForeignKey
- **Related Model:** `Shift` (from SubPhase-04)
- **Related Name:** `attendance_records`
- **On Delete Behavior:** `SET_NULL`
- **Null/Blank:** Both True (records without shift assignments allowed)
- **Database Column:** `shift_id`
- **Index:** Yes (automatically created for FK)

### Relationship Characteristics

#### Why SET_NULL?

Attendance records should persist even if a shift definition is deleted. Reasons:
1. **Historical Integrity:** Past attendance data remains valuable
2. **Audit Trail:** Compliance requires complete history
3. **Reporting:** Analytics must include all attendance regardless of shift status
4. **Data Recovery:** Shift can be reassigned if deleted accidentally

When a shift is deleted:
- Attendance records remain with `shift=None`
- Manual reconciliation may be required
- Reports should handle null shift gracefully
- Alternative: Implement soft-delete for shifts

#### Null Shift Scenarios

Valid cases where `shift` may be null:
1. **Ad-hoc Work:** Employee works without scheduled shift
2. **Emergency Coverage:** Unplanned attendance outside schedule
3. **Shift Assignment Pending:** Clock-in before shift assignment
4. **Flexible Schedules:** Employees without fixed shifts
5. **Historical Data:** Imported records without shift mapping

#### Query Patterns

Common queries requiring optimization:
- Attendance by shift and date range
- Employee shift adherence rates
- Shift-specific attendance reports
- Deviation analysis per shift type

### Shift Validation Rules

#### At Clock-In

When employee clocks in:
1. Check if shift assigned for date
2. Validate clock-in time against shift start window
3. Calculate late_minutes if applicable
4. Flag if no shift found but attendance allowed

#### At Clock-Out

When employee clocks out:
1. Verify shift end time expectations
2. Calculate early_departure_minutes if applicable
3. Check overtime eligibility based on shift
4. Validate total hours against shift duration

### Integration Points

#### With Shift Management (Group-C)

**Dependencies:**
- Shift model must exist before attendance records
- Shift schedule defines expected times
- Shift type affects overtime calculation rules

**Data Flow:**
- Shift schedule → Expected times
- Actual times → Deviation calculation
- Shift rules → Overtime eligibility

#### With Employee Scheduling

**Considerations:**
- Employee may have multiple shifts (split shifts)
- Shift swaps require attendance update
- Schedule changes affect historical interpretation
- Timezone handling for distributed teams

### Business Rules

#### Shift Assignment Logic

**Priority Order:**
1. Explicitly assigned shift for date
2. Recurring schedule pattern match
3. Default shift for employee role
4. Null (unscheduled attendance)

#### Shift Mismatch Handling

When attendance doesn't match shift:
- Flag for supervisor review
- Calculate deviations based on actual shift
- Generate notification for HR
- Option to reassign to correct shift

### Migration Considerations

#### Initial Setup

For new installations:
- Add field with null=True
- Create FK constraint
- Add index automatically

#### Existing Data Migration

For systems with attendance data:
1. Add field allowing null initially
2. Run data migration to assign shifts:
   - Match by date and employee schedule
   - Use historical shift data if available
   - Leave unmatched records as null
3. Update validation rules
4. Train staff on shift assignment process

### Performance Considerations

#### Query Optimization

**Index Strategy:**
- Composite index: (employee_id, date, shift_id)
- Supports shift-filtered queries efficiently
- Enables fast attendance-by-shift reports

**Select Related:**
Always use select_related('shift') when fetching attendance to avoid N+1 queries

#### Caching Strategy

Cache frequently accessed combinations:
- Employee's current shift assignment
- Shift details for today's date
- Common shift configurations

---

## Task 26: Time Duration Fields (Decimal Hours)

### Overview

Tracks the actual time worked with precision required for payroll, compliance, and analytics. Uses decimal hours for:
- Consistent calculations across systems
- Accurate wage computation
- Integration with payroll software
- Financial reporting precision

### Field Specifications

#### Field: `work_hours`

**Purpose:** Total hours worked during the attendance period

**Technical Details:**
- **Type:** DecimalField
- **Max Digits:** 5
- **Decimal Places:** 2
- **Range:** 0.00 to 999.99 hours
- **Null/Blank:** True (calculated after clock-out)
- **Default:** None
- **Database Column:** `work_hours`
- **Index:** No (individual), Yes (composite)

**Calculation:**
- Formula: (clock_out_time - clock_in_time) in hours
- Excludes unpaid breaks
- Includes paid break time
- Rounded to 2 decimal places

**Example Values:**
- 8.00 = Standard 8-hour day
- 8.50 = 8 hours 30 minutes
- 4.25 = 4 hours 15 minutes
- 0.17 = 10 minutes (rounded)

#### Field: `break_hours`

**Purpose:** Total break time taken during the attendance period

**Technical Details:**
- **Type:** DecimalField
- **Max Digits:** 4
- **Decimal Places:** 2
- **Range:** 0.00 to 99.99 hours
- **Null/Blank:** True (0 if no breaks)
- **Default:** None
- **Database Column:** `break_hours`
- **Index:** No

**Calculation Methods:**

**Method 1: Tracked Breaks**
- Sum of all break periods logged
- Requires break tracking system
- Most accurate method

**Method 2: Policy-Based**
- Fixed break allocation per shift
- Example: 0.50 hours for 8-hour shift
- Simpler but less flexible

**Method 3: Hybrid**
- Track actual breaks when possible
- Fall back to policy allocation
- Best of both approaches

**Break Types:**
- **Paid Breaks:** Included in work_hours
- **Unpaid Breaks:** Excluded from work_hours
- **Rest Periods:** May be paid/unpaid based on policy
- **Meal Breaks:** Typically unpaid

#### Field: `effective_hours`

**Purpose:** Net productive hours after deducting unpaid breaks

**Technical Details:**
- **Type:** DecimalField
- **Max Digits:** 5
- **Decimal Places:** 2
- **Range:** 0.00 to 999.99 hours
- **Null/Blank:** True (calculated field)
- **Default:** None
- **Database Column:** `effective_hours`
- **Index:** Yes (used in payroll queries)

**Calculation:**
- Formula: work_hours - unpaid_break_hours
- Used for payroll computation
- Basis for overtime calculation
- Reported to labor authorities

**Relationship:**
```
total_time = clock_out_time - clock_in_time
work_hours = total_time (before break deduction)
effective_hours = work_hours - unpaid_break_hours
```

### Data Type Rationale

#### Why DecimalField Over DurationField?

**DecimalField Advantages:**
1. **Payroll Integration:** Standard format for wage systems
2. **SQL Compatibility:** Direct arithmetic operations
3. **Reporting Simplicity:** Easy aggregation and display
4. **Cross-System:** Works with external tools
5. **Precision Control:** Fixed decimal places

**DurationField Disadvantages:**
1. Complex interval arithmetic
2. Database-specific implementations
3. Harder to integrate with payroll
4. Less readable in reports
5. Requires conversion for calculations

#### Precision Considerations

**Two Decimal Places:**
- Represents minutes: 0.01 hour = 0.6 minutes
- Sufficient for payroll accuracy
- Standard in HR/payroll systems
- Avoids floating-point issues

**Rounding Rules:**
- Always round to nearest 0.01
- Use banker's rounding (round half to even)
- Document rounding policy for compliance
- Apply consistently across all time fields

### Calculation Workflow

#### Step 1: Capture Clock Times

When employee clocks out:
1. Retrieve clock_in_time
2. Retrieve clock_out_time
3. Validate times are reasonable
4. Check for date boundary crossing

#### Step 2: Calculate Work Hours

Process:
1. Calculate duration: clock_out - clock_in
2. Convert to decimal hours
3. Handle overnight shifts (next day clock-out)
4. Apply maximum hour limits
5. Round to 2 decimal places

#### Step 3: Determine Break Hours

Process:
1. Retrieve break records for the period
2. Classify breaks as paid/unpaid
3. Sum unpaid break durations
4. Convert to decimal hours
5. Validate against policy limits

#### Step 4: Compute Effective Hours

Process:
1. Subtract unpaid breaks from work_hours
2. Apply minimum/maximum thresholds
3. Round to 2 decimal places
4. Store in effective_hours field

#### Step 5: Overtime Check

Process:
1. Compare effective_hours to shift duration
2. Calculate overtime_hours if applicable
3. Apply overtime rules
4. Flag for approval if required

### Validation Rules

#### Work Hours Constraints

**Minimum:**
- Greater than 0.00 (if record exists)
- At least 0.01 hours (1 minute minimum)

**Maximum:**
- Less than or equal to 24.00 hours
- Configurable limit (e.g., 16 hours for safety)
- Alert if exceeds expected range

**Logical Checks:**
- Cannot be negative
- Must be >= effective_hours
- Should align with clock times
- Flag if drastically different from shift

#### Break Hours Constraints

**Minimum:**
- Greater than or equal to 0.00
- Can be null if no breaks applicable

**Maximum:**
- Less than work_hours
- Reasonable upper limit (e.g., 2 hours)
- Cannot exceed 50% of work_hours

**Logical Checks:**
- Paid + unpaid breaks <= total_breaks
- Breaks must fit within work period
- Validate against break policy

#### Effective Hours Constraints

**Minimum:**
- Greater than or equal to 0.00
- Can be 0 if all time was breaks (edge case)

**Maximum:**
- Less than or equal to work_hours
- Same maximum as work_hours

**Logical Checks:**
- Must equal work_hours - unpaid_breaks
- Cannot exceed shift expected hours by threshold
- Alert if significantly less than work_hours

### Business Logic Examples

#### Scenario 1: Standard Day

**Input:**
- Clock In: 09:00
- Clock Out: 17:00
- Unpaid Break: 30 minutes

**Calculation:**
- work_hours = 8.00
- break_hours = 0.50
- effective_hours = 7.50

#### Scenario 2: Overtime

**Input:**
- Clock In: 08:00
- Clock Out: 19:00
- Unpaid Break: 45 minutes

**Calculation:**
- work_hours = 11.00
- break_hours = 0.75
- effective_hours = 10.25

#### Scenario 3: Half Day

**Input:**
- Clock In: 10:00
- Clock Out: 14:00
- No Break

**Calculation:**
- work_hours = 4.00
- break_hours = 0.00
- effective_hours = 4.00

#### Scenario 4: Night Shift

**Input:**
- Clock In: 22:00 (Day 1)
- Clock Out: 06:00 (Day 2)
- Unpaid Break: 30 minutes

**Calculation:**
- work_hours = 8.00
- break_hours = 0.50
- effective_hours = 7.50

**Note:** Handle date boundary correctly

### Integration Points

#### Payroll System

**Data Export:**
- effective_hours used for wage calculation
- Overtime hours calculated separately
- Break hours for compliance reporting
- All fields exported with employee ID and date

#### Time Tracking

**Real-Time Updates:**
- Calculate preliminary hours during shift
- Update on each break start/end
- Finalize on clock-out
- Recalculate if adjustments made

#### Reporting

**Metrics Derived:**
- Average work hours per day/week/month
- Break time analysis
- Productivity metrics (effective vs work hours)
- Overtime trends

### Audit and Compliance

#### Record Keeping

**Requirements:**
- Retain calculation inputs (clock times)
- Store intermediate values for verification
- Log any manual adjustments
- Document rounding methods

#### Compliance Reporting

**Labor Law:**
- Total hours worked per period
- Break time compliance
- Overtime hours
- Rest period adherence

---

## Task 27: Deviation Tracking (Integer Minutes)

### Overview

Tracks deviations from scheduled shift times in minutes. This granular tracking enables:
- Punctuality monitoring
- Policy enforcement
- Attendance pattern analysis
- Integration with disciplinary processes

Uses integer minutes for simplicity and consistency with HR practices.

### Field Specifications

#### Field: `late_minutes`

**Purpose:** Minutes employee arrived late compared to shift start time

**Technical Details:**
- **Type:** IntegerField
- **Range:** 0 to 32,767 (SmallIntegerField recommended)
- **Null/Blank:** True (null if not late)
- **Default:** 0
- **Database Column:** `late_minutes`
- **Index:** Yes (composite with employee_id)

**Calculation:**
- Reference: Shift start time (with grace period)
- Actual: Clock-in time
- Formula: max(0, actual - (reference + grace_period))

**Example Values:**
- 0 = On time or early
- 5 = 5 minutes late
- 15 = 15 minutes late
- 120 = 2 hours late

**Grace Period Handling:**
- Configurable per tenant/shift type
- Typical values: 5-15 minutes
- Applied before calculating late_minutes
- Examples:
  - Shift starts 09:00, grace 10 min, clock-in 09:08 → late_minutes = 0
  - Shift starts 09:00, grace 10 min, clock-in 09:15 → late_minutes = 5

#### Field: `early_departure_minutes`

**Purpose:** Minutes employee left early compared to shift end time

**Technical Details:**
- **Type:** IntegerField
- **Range:** 0 to 32,767 (SmallIntegerField recommended)
- **Null/Blank:** True (null if not early)
- **Default:** 0
- **Database Column:** `early_departure_minutes`
- **Index:** Yes (composite with employee_id)

**Calculation:**
- Reference: Shift end time (minus grace period)
- Actual: Clock-out time
- Formula: max(0, (reference - grace_period) - actual)

**Example Values:**
- 0 = On time or stayed late
- 10 = 10 minutes early
- 30 = 30 minutes early
- 60 = 1 hour early

**Grace Period Handling:**
- Similar to late_minutes but inverted
- Allows slightly early departure without penalty
- Examples:
  - Shift ends 17:00, grace 5 min, clock-out 16:58 → early_departure = 0
  - Shift ends 17:00, grace 5 min, clock-out 16:45 → early_departure = 10

### Data Type Rationale

#### Why Integer Minutes?

**Advantages:**
1. **Human-Readable:** Easy to understand (10 minutes late)
2. **HR Standards:** Aligns with attendance policies
3. **Simple Arithmetic:** Easy aggregation and comparison
4. **Policy Mapping:** Direct mapping to disciplinary thresholds
5. **Display:** No conversion needed for reports

**Alternatives Considered:**
- **Decimal Hours:** Less intuitive for attendance
- **Seconds:** Unnecessary precision
- **Time Duration:** Overkill for deviation tracking

#### Precision Level

**Minutes Chosen Because:**
- Sufficient granularity for attendance
- Matches typical policy thresholds (5, 10, 15 minute increments)
- Avoids over-precision debates
- Standard in attendance systems

### Calculation Logic

#### Prerequisites

Before calculating deviations:
1. **Shift Assigned:** Must have shift reference
2. **Clock Times:** Must have clock_in and/or clock_out
3. **Shift Schedule:** Must know expected times
4. **Grace Periods:** Must have configured thresholds

#### Late Minutes Calculation

**Algorithm:**
```
IF shift IS NULL THEN
    late_minutes = NULL (cannot determine)
    
ELSE
    expected_start = shift.start_time
    grace_period = shift.grace_period_start OR tenant_default
    threshold = expected_start + grace_period
    
    IF clock_in_time <= threshold THEN
        late_minutes = 0
    ELSE
        late_minutes = MINUTES(clock_in_time - threshold)
    END IF
END IF
```

**Edge Cases:**
- **No Clock-In:** late_minutes = NULL (absence, not lateness)
- **Clock-In Before Shift:** late_minutes = 0 (early arrival)
- **Multiple Clock-Ins:** Use first clock-in for calculation
- **Overnight Shift:** Handle date boundary correctly

#### Early Departure Calculation

**Algorithm:**
```
IF shift IS NULL THEN
    early_departure_minutes = NULL
    
ELSE
    expected_end = shift.end_time
    grace_period = shift.grace_period_end OR tenant_default
    threshold = expected_end - grace_period
    
    IF clock_out_time IS NULL THEN
        early_departure_minutes = NULL (not clocked out)
    ELSE IF clock_out_time >= threshold THEN
        early_departure_minutes = 0
    ELSE
        early_departure_minutes = MINUTES(threshold - clock_out_time)
    END IF
END IF
```

**Edge Cases:**
- **No Clock-Out:** early_departure_minutes = NULL (forgot to clock out)
- **Clock-Out After Shift:** early_departure_minutes = 0 (overtime/stayed late)
- **Multiple Clock-Outs:** Use last clock-out for calculation
- **Overnight Shift:** Handle date boundary correctly

### Grace Period Configuration

#### Purpose of Grace Periods

**Why Allow Grace?**
1. **Practical Reality:** Traffic, delays happen
2. **Employee Morale:** Overly strict policies reduce satisfaction
3. **Administrative Efficiency:** Focus on significant deviations
4. **Industry Standards:** Common in attendance systems

#### Configuration Levels

**Tenant Level:**
- Default grace periods for all shifts
- Applies when shift-specific not set
- Example: 10 minutes start, 5 minutes end

**Shift Level:**
- Override tenant defaults
- Different rules for different shift types
- Example: Flexible shifts have 15-min grace

**Role Level:**
- Management may have different thresholds
- Hourly vs salaried distinctions
- Example: Executives have flexible grace

#### Recommended Values

**Start Grace Period:**
- Strict: 5 minutes
- Standard: 10 minutes
- Flexible: 15 minutes
- Very Flexible: 30 minutes

**End Grace Period:**
- Strict: 0 minutes
- Standard: 5 minutes
- Flexible: 10 minutes
- Very Flexible: 15 minutes

### Business Rules

#### Accumulation and Thresholds

**Daily:**
- Track individual instance
- Flag if exceeds daily threshold (e.g., >30 min late)

**Weekly:**
- Sum late_minutes across week
- Threshold example: 60 minutes total

**Monthly:**
- Sum for performance review
- Threshold example: 120 minutes total

**Frequency:**
- Count instances (days late/early)
- Example: 5 instances per month

#### Severity Levels

**Minor Infraction:**
- 1-10 minutes late/early
- Verbal reminder only
- No formal action

**Moderate Infraction:**
- 11-30 minutes
- Written warning possible
- Supervisor notification

**Major Infraction:**
- 31+ minutes
- Formal disciplinary action
- May affect attendance bonus

**Pattern Infractions:**
- Repeated minor infractions
- Escalates to moderate/major
- Requires intervention

### Integration with Policies

#### Attendance Policy Engine

**Automatic Actions:**
1. Calculate deviations on clock event
2. Check against policy thresholds
3. Generate notifications if exceeded
4. Create disciplinary record if warranted
5. Update attendance score

**Manual Review Triggers:**
- Deviation exceeds auto-approval threshold
- Pattern of deviations detected
- Excused absence vs tardiness
- Appeal process initiated

#### Exception Handling

**Valid Excuses:**
- Medical appointments (with proof)
- Transportation failures
- Weather emergencies
- Work-related delays

**Process:**
1. Employee submits excuse
2. Supervisor reviews
3. Approved: deviation removed/reduced
4. Denied: deviation stands
5. Record maintained for audit

### Reporting and Analytics

#### Individual Reports

**Employee Dashboard:**
- Current month late_minutes total
- Trend over time
- Comparison to team average
- Improvement tracking

**Supervisor View:**
- Team deviation summary
- Individual outliers
- Pattern detection
- Approval queue

#### Aggregate Analytics

**Metrics:**
- Average late_minutes per employee
- Peak lateness times (identify systemic issues)
- Department/shift comparisons
- Correlation with other factors (weather, season)

**Insights:**
- Identify problematic shifts
- Traffic pattern effects
- Policy effectiveness
- Training needs

### Validation Rules

#### Late Minutes Validation

**Range Checks:**
- Minimum: 0
- Maximum: 480 (8 hours - beyond this is absence)
- Typical maximum: 120 (2 hours)

**Logical Checks:**
- Cannot be negative
- If > 120, flag for review
- Must have clock_in_time
- Must have shift assigned

#### Early Departure Validation

**Range Checks:**
- Minimum: 0
- Maximum: 480 (8 hours)
- Typical maximum: 240 (4 hours)

**Logical Checks:**
- Cannot be negative
- If > 60, flag for review
- Must have clock_out_time
- Must have shift assigned

#### Cross-Field Validation

**Consistency:**
- If status = 'ABSENT', both should be NULL
- If status = 'LATE', late_minutes should be > 0
- If early_departure > shift_duration, check data
- Sum shouldn't exceed shift duration

### Performance Considerations

#### Index Strategy

**Required Indexes:**
- (employee_id, date) for individual history
- (date, late_minutes) for daily reports
- (employee_id, late_minutes) for employee patterns

**Query Optimization:**
- Sum aggregations on indexed columns
- Use BETWEEN for threshold queries
- Cache frequent queries (monthly totals)

#### Calculation Timing

**Real-Time:**
- Calculate on clock-in (late_minutes)
- Calculate on clock-out (early_departure)
- Update immediately for instant feedback

**Batch Recalculation:**
- Nightly job for any missed calculations
- After shift changes/adjustments
- Correction of timezone issues

---

## Task 28: Overtime Management Fields

### Overview

Manages hours worked beyond regular shift duration, including tracking and approval workflow. Critical for:
- Fair compensation
- Labor law compliance
- Budget management
- Workload analysis

### Field Specifications

#### Field: `overtime_hours`

**Purpose:** Hours worked beyond the regular shift schedule

**Technical Details:**
- **Type:** DecimalField
- **Max Digits:** 4
- **Decimal Places:** 2
- **Range:** 0.00 to 99.99 hours
- **Null/Blank:** True (null if no overtime)
- **Default:** None
- **Database Column:** `overtime_hours`
- **Index:** Yes (used in payroll queries)

**Calculation:**
- Formula: max(0, effective_hours - shift_expected_hours)
- Only positive values stored
- Rounded to 2 decimal places
- Requires shift assignment for calculation

**Example Values:**
- 0.00 = No overtime
- 1.50 = 1.5 hours overtime
- 4.00 = 4 hours overtime
- NULL = Not applicable (no shift or not worked)

#### Field: `overtime_approved`

**Purpose:** Approval status for claimed overtime

**Technical Details:**
- **Type:** BooleanField
- **Null/Blank:** True (three-state logic)
- **Default:** None
- **Database Column:** `overtime_approved`
- **Index:** Yes (for approval queue queries)

**States:**
- **NULL (None):** Pending approval (default state)
- **True:** Approved by supervisor
- **False:** Rejected by supervisor

**Approval Workflow:**
1. overtime_hours calculated automatically
2. overtime_approved set to NULL initially
3. Supervisor reviews and approves/rejects
4. Status updated to True/False
5. Payroll uses approved overtime only

### Calculation Logic

#### Overtime Determination

**Prerequisites:**
1. Shift must be assigned
2. Clock-out must be complete
3. effective_hours must be calculated
4. Shift expected duration known

**Algorithm:**
```
IF shift IS NULL THEN
    overtime_hours = NULL
ELSE IF clock_out_time IS NULL THEN
    overtime_hours = NULL
ELSE
    expected = shift.duration_hours
    actual = effective_hours
    
    IF actual > expected THEN
        overtime_hours = ROUND(actual - expected, 2)
    ELSE
        overtime_hours = 0.00
    END IF
END IF
```

#### Automatic vs Manual Overtime

**Automatic Calculation:**
- System calculates based on clock times
- Applied to all attendance records
- Objective and consistent
- Requires post-approval

**Manual Override:**
- Supervisor can adjust overtime_hours
- Used for special cases
- Requires justification note
- Audit trail maintained

### Overtime Types and Policies

#### Regular Overtime

**Definition:**
- Hours beyond standard shift
- Typically 1.5x pay rate
- Daily calculation basis

**Example:**
- Shift: 8 hours
- Worked: 10 hours
- Overtime: 2 hours at 1.5x

#### Double-Time Overtime

**Definition:**
- Excessive hours or special days
- Typically 2x pay rate
- Based on policy rules

**Triggers:**
- Hours beyond threshold (e.g., >12 hours/day)
- Holidays
- Seventh consecutive day

**Implementation:**
- Store total overtime_hours
- Separate field or flag for double-time
- Or: Split into overtime_regular and overtime_double

#### Compensatory Time Off (Comp Time)

**Definition:**
- Time off instead of overtime pay
- Common in public sector
- Requires special tracking

**Considerations:**
- Accrue in separate balance
- Track expiration dates
- Integrate with leave system
- May not be offered in all jurisdictions

### Approval Workflow

#### Automatic Pre-Approval

**Criteria:**
- Overtime below threshold (e.g., 1 hour)
- Pre-authorized by supervisor
- Project with overtime budget
- Emergency situations

**Implementation:**
- Set overtime_approved = True automatically
- Skip approval queue
- Notify supervisor post-facto
- Audit for abuse prevention

#### Manual Approval Required

**Triggers:**
- Overtime exceeds threshold
- Unapproved overtime policy
- Budget constraints
- Frequent overtime by employee

**Process:**
1. Employee clocks out
2. System calculates overtime
3. Notification sent to supervisor
4. Supervisor reviews and decides
5. Status updated in system
6. Employee notified of decision

#### Approval Considerations

**Supervisor Review:**
- Was overtime necessary?
- Was it pre-authorized?
- Does it fit budget?
- Pattern of overtime (potential issue)?
- Alternative: redistribute work?

**Rejection Handling:**
- Adjust overtime_hours to approved amount
- Document rejection reason
- Communicate to employee
- May adjust effective_hours if misrepresented

### Business Rules

#### Eligibility

**Non-Exempt Employees:**
- Entitled to overtime pay
- Must be tracked and paid
- Legal requirement

**Exempt Employees:**
- Not entitled to overtime pay
- May still track for workload analysis
- overtime_hours tracked but not paid

**Contract Workers:**
- Depends on contract terms
- May have different rates
- Check contractor agreement

#### Caps and Limits

**Daily Maximum:**
- Prevent excessive hours (safety)
- Example: 4 hours overtime per day
- Alert if exceeded

**Weekly Maximum:**
- Total weekly hours limit
- Example: 60 hours total (including OT)
- Compliance requirement

**Monthly Budget:**
- Department overtime budget
- Alert when approaching limit
- Require special approval if exceeded

### Integration Points

#### Payroll System

**Data Export:**
- overtime_hours (approved only)
- overtime_approved = True filter
- Employee ID and date
- Overtime rate from employee record
- Separate regular vs double-time

**Calculation:**
- Overtime pay = overtime_hours × base_rate × multiplier
- Multiplier typically 1.5 or 2.0
- Include in wage calculation
- Generate payslip line item

#### Budget Management

**Tracking:**
- Accumulate overtime costs
- Compare to department budget
- Forecast based on trends
- Alert budget managers

#### Workforce Planning

**Analysis:**
- High overtime indicates understaffing
- Pattern analysis for hiring decisions
- Project-based overtime for billing
- Seasonal trends identification

### Validation Rules

#### Overtime Hours Validation

**Range Checks:**
- Minimum: 0.00
- Maximum: 12.00 (more than this is unusual)
- Typical maximum: 4.00 hours

**Logical Checks:**
- Cannot be negative
- Cannot exceed work_hours
- Should not exceed (24 - shift_duration)
- If > 4, flag for review

**Consistency:**
- If overtime_hours > 0, must have shift
- If overtime_hours > 0, clock_out must exist
- effective_hours should be > shift_expected_hours

#### Approval Status Validation

**State Transitions:**
- NULL → True (approved)
- NULL → False (rejected)
- Cannot change from True/False back to NULL
- Require supervisor permissions

**Business Logic:**
- Cannot approve if overtime_hours = 0
- Cannot approve for exempt employees (or flag)
- Approval timestamp should be recorded
- Approver ID should be stored

### Reporting and Analytics

#### Individual Reports

**Employee View:**
- Total overtime this period
- Approval status (pending/approved/rejected)
- Overtime earnings projection
- Historical overtime trends

**Supervisor Dashboard:**
- Pending overtime approvals
- Team overtime summary
- Budget utilization
- Top overtime employees

#### Aggregate Analytics

**Metrics:**
- Total overtime hours (company/dept/team)
- Overtime as % of regular hours
- Overtime costs vs budget
- Approval rate (% approved vs rejected)

**Insights:**
- Identify overworked employees
- Detect potential burnout
- Optimize staffing levels
- Forecast labor costs

### Compliance Considerations

#### Legal Requirements

**Record Keeping:**
- Retain overtime records per labor law
- Typically 3-7 years
- Include approval documentation
- Available for audits

**Fair Labor Standards Act (FLSA):**
- Non-exempt must receive overtime
- Proper classification critical
- Calculate weekly overtime correctly
- Maintain accurate records

**Local Regulations:**
- Some jurisdictions require daily OT calculation
- Others use weekly basis
- Maximum hours restrictions
- Special rules for minors

#### Audit Trail

**Track:**
- Original calculated overtime_hours
- Any manual adjustments
- Who approved/rejected
- When approval occurred
- Justification notes
- Changes history

---

## Task 29: Clock-In Location Tracking (GPS)

### Overview

Captures GPS coordinates when employee clocks in, enabling:
- Verification of on-site presence
- Geofencing compliance
- Remote work tracking
- Fraud prevention

Uses JSON field to store structured location data with flexibility for future enhancements.

### Field Specifications

#### Field: `clock_in_location`

**Purpose:** GPS coordinates and metadata for clock-in event

**Technical Details:**
- **Type:** JSONField
- **Null/Blank:** True (not required for all clock-ins)
- **Default:** None
- **Database Column:** `clock_in_location`
- **Index:** GIN index for JSON queries (PostgreSQL)

**JSON Schema:**
```json
{
  "latitude": <float>,       // Required if location provided
  "longitude": <float>,      // Required if location provided
  "accuracy": <float>,       // Accuracy in meters (optional)
  "altitude": <float>,       // Altitude in meters (optional)
  "heading": <float>,        // Direction in degrees (optional)
  "speed": <float>,          // Speed in m/s (optional)
  "timestamp": <ISO8601>,    // When GPS reading taken
  "source": <string>,        // "GPS", "WIFI", "NETWORK", "MANUAL"
  "provider": <string>       // "browser", "mobile_app", "device_gps"
}
```

**Example Values:**

**Mobile GPS:**
```json
{
  "latitude": 6.927079,
  "longitude": 79.861244,
  "accuracy": 10.5,
  "timestamp": "2026-01-24T09:00:15Z",
  "source": "GPS",
  "provider": "mobile_app"
}
```

**Browser Geolocation:**
```json
{
  "latitude": 6.927079,
  "longitude": 79.861244,
  "accuracy": 50.0,
  "timestamp": "2026-01-24T09:00:20Z",
  "source": "WIFI",
  "provider": "browser"
}
```

**Manual Entry:**
```json
{
  "latitude": 6.927079,
  "longitude": 79.861244,
  "timestamp": "2026-01-24T09:00:00Z",
  "source": "MANUAL",
  "provider": "admin_override"
}
```

### GPS Data Collection

#### Client-Side Capture

**Web Browser:**
- Use Geolocation API: `navigator.geolocation.getCurrentPosition()`
- Request high accuracy: `enableHighAccuracy: true`
- Set timeout and handle errors
- Fallback if permission denied

**Mobile App:**
- Native GPS access (iOS/Android)
- Request location permissions
- Continuous vs single-shot location
- Background location for auto clock-in

**Desktop Application:**
- System location services
- Less accurate than mobile
- May use IP-based fallback

#### Server-Side Validation

**Received Data Checks:**
1. Validate latitude range: -90 to 90
2. Validate longitude range: -180 to 180
3. Check accuracy is reasonable (<1000m)
4. Verify timestamp is recent
5. Ensure required fields present

**Quality Indicators:**
- Accuracy < 20m: Excellent (likely GPS)
- Accuracy 20-100m: Good (GPS or WIFI)
- Accuracy 100-1000m: Fair (WIFI/Network)
- Accuracy > 1000m: Poor (question reliability)

### Geofencing and Verification

#### Geofence Definition

**Location Types:**
1. **Office/Branch:** Fixed coordinates and radius
2. **Client Site:** Multiple approved locations
3. **Remote Work:** No geofence (any location)
4. **Region:** Allowed within city/country bounds

**Geofence Storage:**
- Stored in WorkLocation model (separate)
- References in Shift or Employee config
- Includes: center point (lat/lng), radius (meters)

#### Verification Algorithm

**On Clock-In:**
```
1. Get clock_in_location coordinates
2. Retrieve allowed locations for employee/shift
3. For each allowed location:
   a. Calculate distance using Haversine formula
   b. Compare to location's geofence radius
   c. If within radius, mark as valid
4. If no match, flag for review
5. Store verification result in attendance
```

**Distance Calculation:**
- Haversine formula for accuracy
- Accounts for Earth's curvature
- Returns distance in meters
- Handle edge cases (poles, date line)

#### Verification Outcomes

**Valid Location:**
- Within geofence radius
- attendance_status = 'PRESENT' or shift status
- No further action required

**Invalid Location:**
- Outside all geofences
- Flag in attendance: location_verified = False
- Notify supervisor for review
- May allow with justification

**No Location:**
- clock_in_location is NULL
- May be permitted (office kiosk)
- Or flag as incomplete
- Depends on policy

### Privacy and Permissions

#### Employee Consent

**Requirements:**
1. Inform about location tracking
2. Obtain explicit consent
3. Explain usage purpose
4. Allow opt-out (consequences explained)
5. Provide privacy policy

**Transparency:**
- Employees can view their location data
- Explain how data is used
- Retention period disclosed
- Right to request deletion (post-retention)

#### Data Minimization

**Only Collect When Needed:**
- Clock-in/out times only
- Not continuous tracking
- Not stored during non-work hours
- No historical trail beyond work events

**Minimize Details:**
- Coordinates sufficient (no address)
- Don't store speed/heading unless necessary
- Anonymize in analytics
- Aggregate for reporting

#### Access Controls

**Who Can View:**
- Employee: Own location data
- Supervisor: Direct reports (for verification)
- HR: All data (for compliance)
- Admin: System management
- No other employees

**Audit:**
- Log all location data access
- Track who viewed and when
- Alert on suspicious access patterns

### Use Cases

#### Office Attendance

**Scenario:**
- Employee must clock in from office
- Office has defined geofence (500m radius)
- Mobile app captures GPS

**Flow:**
1. Employee arrives at office
2. Opens app, clicks "Clock In"
3. App captures GPS location
4. Sends to server with clock-in request
5. Server verifies location against office geofence
6. If valid, clock-in succeeds
7. If invalid, prompts for explanation

#### Field Worker

**Scenario:**
- Technician visits client sites
- Must clock in at each site
- Sites have geofences

**Flow:**
1. Technician arrives at client site A
2. Clocks in via mobile app
3. GPS captured and verified against site A geofence
4. Moves to site B
5. Clocks out from A, clocks in to B
6. Each verified against respective geofences

#### Remote Worker

**Scenario:**
- Employee works from home
- No geofence required
- Location still captured for presence confirmation

**Flow:**
1. Employee clocks in from home
2. GPS captured but no geofence validation
3. Location stored for record
4. Confirms not at office (if policy requires)
5. Clock-in proceeds

### Error Handling

#### GPS Not Available

**Scenarios:**
- Device doesn't have GPS
- GPS disabled by user
- Signal not acquired
- Indoor location (no GPS lock)

**Handling:**
1. Fall back to WIFI/Network location
2. If still unavailable, allow clock-in with warning
3. Flag for supervisor review
4. Document in notes

#### Location Permission Denied

**Scenarios:**
- User denies browser/app permission
- Privacy settings block location

**Handling:**
1. Explain why location needed
2. Request permission again
3. If denied, offer manual location entry (if permitted)
4. Or: Disallow clock-in (if policy requires)
5. Contact admin for assistance

#### Inaccurate Location

**Scenarios:**
- Accuracy > 1000m
- Coordinates invalid
- Timestamp stale

**Handling:**
1. Reject and request new reading
2. Prompt user to move to better signal area
3. Allow with manual override (supervisor approval)
4. Document accuracy issue

### Validation Rules

#### Required Fields

**If clock_in_location Provided:**
- latitude: Required
- longitude: Required
- timestamp: Required
- source: Optional but recommended

#### Range Validation

**Latitude:**
- Must be between -90 and 90
- Typical precision: 6 decimal places

**Longitude:**
- Must be between -180 and 180
- Typical precision: 6 decimal places

**Accuracy:**
- If provided, must be > 0
- Reasonable maximum: 10,000 meters
- Typical: 5-50 meters

#### Logical Validation

**Timestamp:**
- Must be close to clock_in_time (within 5 minutes)
- Cannot be in future
- Cannot be too old (>1 hour)

**Source:**
- Must be valid enum value
- Affects accuracy expectations

### Performance Considerations

#### JSON Indexing

**PostgreSQL GIN Index:**
- Index on clock_in_location for JSON queries
- Enables fast searches by location
- Query nearby attendances efficiently

**Example Queries:**
- Find all clock-ins within radius
- List attendances at specific location
- Verify location matches

#### Geospatial Extensions

**PostGIS (Optional):**
- Advanced geospatial queries
- More efficient distance calculations
- Spatial indexing
- Complex geofence shapes (polygons)

**When to Use:**
- Large scale deployments
- Complex geofencing needs
- High-frequency location queries
- Reporting on geographic patterns

---

## Task 30: Clock-Out Location Tracking (GPS)

### Overview

Captures GPS coordinates when employee clocks out, parallel to clock-in location. Enables:
- Verification employee remained on-site
- Tracking movement during shift
- Compliance with location requirements
- Complete audit trail

Uses identical structure to clock_in_location for consistency.

### Field Specifications

#### Field: `clock_out_location`

**Purpose:** GPS coordinates and metadata for clock-out event

**Technical Details:**
- **Type:** JSONField
- **Null/Blank:** True (not required for all clock-outs)
- **Default:** None
- **Database Column:** `clock_out_location`
- **Index:** GIN index for JSON queries (PostgreSQL)

**JSON Schema:**
```json
{
  "latitude": <float>,       
  "longitude": <float>,      
  "accuracy": <float>,       
  "altitude": <float>,       
  "heading": <float>,        
  "speed": <float>,          
  "timestamp": <ISO8601>,    
  "source": <string>,        
  "provider": <string>       
}
```

**Note:** Schema identical to clock_in_location for consistency

### Location Verification at Clock-Out

#### Same Location Verification

**Purpose:**
- Ensure employee worked from authorized location
- Detect unauthorized movement
- Validate full shift presence

**Algorithm:**
```
1. Get clock_in_location coordinates
2. Get clock_out_location coordinates
3. Calculate distance between them
4. If distance < threshold (e.g., 1km):
   - Mark as same location
   - Likely remained on-site
5. If distance >= threshold:
   - Flag for review
   - Possible moved to different site
   - Or location accuracy issue
6. Document verification result
```

**Threshold Considerations:**
- Office: 500m (stayed in building/campus)
- Campus: 1-2km (moved within campus)
- Field: No limit (expected to move)
- Remote: No limit (home/various locations)

#### Multi-Location Shifts

**Scenario:**
- Employee works at multiple sites in one shift
- Example: Technician visits 3 client sites

**Handling:**
1. Track location at each clock-in/out pair
2. Verify each location against approved sites
3. Calculate travel time between sites
4. Validate against shift schedule
5. Support intermediate clock events

**Implementation:**
- May require intermediate "checkpoint" clocks
- Or: Track continuous location (privacy concerns)
- Or: Clock in/out at each site (multiple records)

### Comparison with Clock-In Location

#### Distance Analysis

**Use Cases:**
1. **Stayed on-site:** Distance < 500m
2. **Campus Movement:** Distance 500m - 2km
3. **Different Location:** Distance > 2km
4. **Data Issue:** Distance > 100km (likely error)

**Reporting:**
- Daily: Show clock-in and clock-out locations side-by-side
- Flag unusual distances
- Map view showing day's movement
- Alert if policy violation

#### Pattern Detection

**Suspicious Patterns:**
1. **Always Same Location:** Clock-in and out from exact same coordinates (possibly spoofed)
2. **Impossible Movement:** Too far apart given shift time
3. **Off-Site Clock-Out:** Left early without authorization
4. **Frequent Movement:** Pattern of location changes

**Automated Alerts:**
- Flag for supervisor review
- May indicate fraud
- Or legitimate field work
- Require context for determination

### Integration with Shift Locations

#### Shift-Based Location Rules

**Configuration:**
- Shift defines required locations
- Can specify clock-in location requirements
- Can specify clock-out location requirements separately
- Different rules for different shift types

**Examples:**
1. **Office Shift:** Both clock-in and out from office
2. **Field Shift:** Clock-in from office, out from any approved site
3. **Remote Shift:** Any location for both
4. **Multi-Site:** Specific locations for each part of shift

#### Flexible vs Strict Policies

**Strict Policy:**
- Must clock out from same geofence as clock-in
- No movement allowed during shift
- Deviations require approval

**Flexible Policy:**
- Clock-out location informational only
- Movement expected (field workers)
- No verification against geofence

**Hybrid:**
- Verify clock-in location strictly
- Clock-out location recorded but not enforced
- Balance between control and flexibility

### Privacy Considerations

#### Consent and Transparency

**Clock-Out Specific:**
- Same privacy rules as clock-in
- Employees know both locations tracked
- Purpose: Verify work location consistency
- Not for surveillance during shift

#### Data Usage

**Permitted Uses:**
- Verify attendance at authorized locations
- Calculate distance for compliance
- Aggregate for site utilization analytics
- Audit trail for disputes

**Prohibited Uses:**
- Continuous tracking during shift
- Personal time tracking
- Detailed movement surveillance
- Sharing with third parties

### Validation Rules

#### Field Validation

**Identical to Clock-In Location:**
- Latitude: -90 to 90
- Longitude: -180 to 180
- Accuracy: > 0, reasonable maximum
- Timestamp: Close to clock_out_time

#### Cross-Field Validation

**With Clock-In Location:**
- Both should exist or both null (consistency)
- Timestamps should be ordered: clock_in < clock_out
- Distance should be reasonable
- Source/provider should be similar (same device expected)

**With Clock Times:**
- clock_out_location timestamp ≈ clock_out_time
- Difference should be < 5 minutes
- If large gap, flag for review

### Use Cases

#### Verification of Presence

**Scenario:**
- Employee must stay at office all day
- Clock-in from office geofence
- Clock-out from same geofence

**Verification:**
1. Check clock_in_location within office geofence
2. Check clock_out_location within office geofence
3. Calculate distance between them
4. If both valid and distance small: Verified
5. If either invalid or distance large: Flag

#### Field Worker Accountability

**Scenario:**
- Technician works at client site
- Clock-in at client site A
- Clock-out from client site A or office

**Verification:**
1. Clock-in at site A geofence: Valid
2. Clock-out from site A or office: Valid
3. Clock-out from other location: Requires justification
4. Track total time at site for billing

#### Compliance Documentation

**Scenario:**
- Labor law requires proof of work location
- For tax/jurisdiction purposes

**Documentation:**
1. Store both clock-in and clock-out locations
2. Generate report showing locations per day
3. Calculate time spent in each jurisdiction
4. Support tax calculations based on location

### Error Handling

#### Missing Clock-Out Location

**Scenarios:**
- GPS unavailable at clock-out
- Employee forgets to allow permission
- System error

**Handling:**
1. Allow clock-out without location (with warning)
2. Flag for manual verification
3. Attempt to get location post-facto (if possible)
4. Document in notes

#### Inconsistent Locations

**Scenarios:**
- Clock-in and clock-out very far apart
- Impossible given shift duration
- Indicates data error or fraud

**Handling:**
1. Calculate expected maximum distance
2. If exceeded, reject clock-out
3. Require supervisor override
4. Investigate for fraud or system issue

---

## Task 31: IP Address Tracking

### Overview

Captures the IP address of the device used for clock-in and clock-out. Provides:
- Additional verification layer
- Fraud detection
- Network-based access control
- Audit trail for disputes

Simpler than GPS but useful for identifying device/network.

### Field Specifications

#### Field: `clock_in_ip`

**Purpose:** IP address of device/network used for clock-in

**Technical Details:**
- **Type:** GenericIPAddressField (supports IPv4 and IPv6)
- **Null/Blank:** True (not always available)
- **Default:** None
- **Database Column:** `clock_in_ip`
- **Index:** Yes (for fraud detection queries)

**Example Values:**
- IPv4: `192.168.1.100` (office network)
- IPv4: `203.143.120.45` (ISP public IP)
- IPv6: `2001:0db8:85a3:0000:0000:8a2e:0370:7334`
- NULL: IP not captured (kiosk, app without IP tracking)

#### Field: `clock_out_ip`

**Purpose:** IP address of device/network used for clock-out

**Technical Details:**
- **Type:** GenericIPAddressField (supports IPv4 and IPv6)
- **Null/Blank:** True
- **Default:** None
- **Database Column:** `clock_out_ip`
- **Index:** Yes

**Example Values:**
- Same as clock_in_ip (same device/location)
- Different IP (moved locations, cellular vs WiFi)
- NULL: IP not captured

### IP Address Capture

#### Server-Side Collection

**Web Application:**
- Extract from HTTP request headers
- Check `X-Forwarded-For` if behind proxy/load balancer
- Fall back to `REMOTE_ADDR`
- Handle proxy chains correctly

**Code Pattern (Django Example):**
```
# Get real IP considering proxies
def get_client_ip(request):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0].strip()
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip
```

**Mobile API:**
- Same approach for API requests
- Mobile app sends request, server extracts IP
- Not dependent on GPS or device info

#### Client-Side Limitations

**Cannot Trust Client:**
- Never accept IP from client payload
- Always extract server-side
- Client can lie about IP
- Use server's view of source IP

**VPN Considerations:**
- Employee might use VPN
- IP appears to be from VPN server
- May not match office IP
- Policy decision on VPN usage

### IP-Based Verification

#### Whitelist Approach

**Office Network:**
- Define allowed IP ranges
- Example: `192.168.1.0/24` for office LAN
- Example: `203.143.120.45` for office public IP

**Verification:**
1. Capture clock_in_ip
2. Check against whitelist
3. If match: Approved
4. If no match: Flag for review or reject

**Use Cases:**
- Office-only attendance (no remote)
- Kiosk-based clocking
- Reduce fraud (must be on office network)

#### Blacklist Approach

**Known VPN/Proxy IPs:**
- Block known VPN service IPs
- Prevent circumvention of location checks
- Update blacklist regularly

**Known Suspicious IPs:**
- IPs associated with previous fraud
- Unusual foreign IPs (if not expected)
- Data center IPs (possible bot/automation)

#### Consistency Checks

**Same Device Assumption:**
- If clock_in_ip == clock_out_ip: Likely same device
- If different: Possible moved (cellular to WiFi), or different device
- Large IP change: Flag for review

**Pattern Analysis:**
- Employee always uses same IP range: Legitimate
- Employee uses many different IPs: Possible concern (travel, VPN)
- Sudden change in IP pattern: Investigate

### Use Cases

#### Office Kiosk Verification

**Scenario:**
- Employees clock in at office kiosk
- Kiosk has fixed IP on office LAN
- No GPS needed (device at known location)

**Verification:**
1. Capture clock_in_ip from kiosk
2. Should match known kiosk IP
3. If doesn't match, possible tampering
4. Simple and effective for fixed terminals

#### Remote Work Verification

**Scenario:**
- Employee works from home
- Registers home IP with system
- Clocking from registered IP implies at home

**Flow:**
1. Employee registers home IP (optional)
2. When clocking in, system checks IP
3. If matches registered: Low-risk approval
4. If doesn't match: Request confirmation or reason
5. Not strict enforcement, just informational

#### Fraud Detection

**Scenario:**
- Detect buddy punching or fake clock-ins
- Cross-reference IP with location

**Indicators of Fraud:**
1. IP far from expected location (IP geolocation vs GPS)
2. Multiple employees clocking from same unusual IP
3. IP from different country than workplace
4. Pattern of changing IPs to avoid detection

**Response:**
1. Flag attendance for review
2. Notify supervisor immediately
3. Require secondary authentication
4. Investigate employee

### Privacy and Legal Considerations

#### IP as Personal Data

**GDPR Perspective:**
- IP addresses are personal data
- Require legitimate business purpose
- Inform employees in privacy policy
- Allow access to their IP data

**Purpose Limitation:**
- Collect for attendance verification only
- Don't use for unrelated purposes
- Don't share with third parties
- Retain only as long as needed

#### Geolocation from IP

**IP Geolocation Services:**
- Can approximate location from IP
- Accuracy: City-level at best
- Use for rough verification only
- Not precise like GPS

**Privacy Concern:**
- Even imprecise location reveals patterns
- Be transparent about geolocation use
- Allow opt-out if legally required
- Document in privacy policy

### Validation Rules

#### IP Format Validation

**IPv4:**
- Format: `XXX.XXX.XXX.XXX`
- Each octet: 0-255
- Example: `192.168.1.1`

**IPv6:**
- Format: 8 groups of 4 hex digits
- Example: `2001:0db8:85a3:0000:0000:8a2e:0370:7334`
- Supports abbreviation: `::`

**Django Field Handles:**
- GenericIPAddressField validates automatically
- Accepts both IPv4 and IPv6
- Rejects invalid formats

#### Logical Validation

**Reserved/Private IPs:**
- Recognize private ranges (192.168.x.x, 10.x.x.x)
- Indicates internal network (office LAN)
- Public IPs indicate external access

**Consistency:**
- clock_in_ip and clock_out_ip should be similar
- Large difference might indicate movement or issue
- Document explanation for differences

### Integration with Other Verification

#### Multi-Factor Verification

**Combination:**
1. **IP Address:** Network verification
2. **GPS Location:** Physical location
3. **Device ID:** Device authentication (future)
4. **Biometric:** Fingerprint/face (future)

**Layered Security:**
- More factors = higher confidence
- IP + GPS better than either alone
- Adjust requirements based on risk

**Policy Examples:**
- Office: IP whitelist required
- Remote: GPS required, IP informational
- Kiosk: IP required, GPS not applicable

#### Risk-Based Approach

**Low Risk:**
- Known IP, expected location
- Auto-approve

**Medium Risk:**
- New IP, expected location (GPS)
- Approve with notification

**High Risk:**
- Unknown IP, unexpected location
- Require supervisor approval or deny

### Reporting and Analytics

#### IP Analysis

**Reports:**
- List all unique IPs used by employee
- Frequency of each IP
- Map IPs to approximate locations
- Detect pattern changes

**Use Cases:**
- Identify employees working remotely frequently
- Verify office attendance compliance
- Detect unusual access patterns
- Audit for security purposes

#### Aggregated Insights

**Metrics:**
- % attendance from office IP range
- % attendance from remote locations
- Common IP addresses across organization
- Outlier detection

---

## Task 32: Database Indexes and Constraints

### Overview

Optimizes database performance and enforces data integrity through strategic indexes and constraints. Critical for:
- Fast query performance at scale
- Data consistency and integrity
- Prevention of duplicate/invalid records
- Efficient report generation

### Index Strategy

#### Primary Indexes

**Auto-Created by Django:**
1. **Primary Key (id):** Clustered index on surrogate key
2. **Foreign Keys:** Index on employee_id, shift_id, etc.
3. **Unique Fields:** If any defined

**Performance:**
- PK lookups: O(log n)
- FK joins: Efficient with index
- Unique checks: Fast validation

#### Composite Indexes

#### Index 1: Employee-Date Lookup

**Purpose:** Fast retrieval of attendance by employee and date

**Definition:**
- **Columns:** (employee_id, date)
- **Type:** B-tree
- **Unique:** Yes (prevent duplicate records)

**Use Cases:**
- "Show attendance for employee on date"
- "Get today's attendance for employee"
- "Validate no duplicate attendance for date"

**Query Examples:**
```sql
-- Exact match (uses index)
SELECT * FROM attendance 
WHERE employee_id = 123 AND date = '2026-01-24';

-- Range on date (uses index)
SELECT * FROM attendance 
WHERE employee_id = 123 
  AND date BETWEEN '2026-01-01' AND '2026-01-31';
```

**Index Properties:**
- **Unique:** Prevents duplicate attendance for same employee-date
- **Order:** Clustered on employee_id, then date
- **Selectivity:** Very high (employee-date combination unique)

#### Index 2: Date Lookup

**Purpose:** Fast retrieval of all attendance for a date

**Definition:**
- **Columns:** (date)
- **Type:** B-tree
- **Unique:** No

**Use Cases:**
- "Show all attendance for today"
- "Generate daily attendance report"
- "Find absent employees for date"

**Query Examples:**
```sql
-- All attendance on date (uses index)
SELECT * FROM attendance 
WHERE date = '2026-01-24';

-- Date range (uses index)
SELECT * FROM attendance 
WHERE date BETWEEN '2026-01-01' AND '2026-01-07';
```

**Performance:**
- Fast for daily reports
- Supports date range queries
- Essential for dashboard queries

#### Index 3: Status Lookup

**Purpose:** Fast filtering by attendance status

**Definition:**
- **Columns:** (status)
- **Type:** B-tree
- **Unique:** No

**Use Cases:**
- "Show all ABSENT records for follow-up"
- "Count PRESENT employees today"
- "Find pending approvals"

**Query Examples:**
```sql
-- Filter by status (uses index)
SELECT * FROM attendance 
WHERE status = 'ABSENT';

-- Combined with date (may use date index or status index)
SELECT * FROM attendance 
WHERE status = 'PRESENT' AND date = '2026-01-24';
```

**Considerations:**
- Low cardinality field (few unique values)
- Still useful for filtering large datasets
- May benefit from partial index (e.g., only ABSENT)

#### Index 4: Overtime Approval Queue

**Purpose:** Fast retrieval of overtime pending approval

**Definition:**
- **Columns:** (overtime_approved, overtime_hours)
- **Type:** B-tree
- **Unique:** No

**Use Cases:**
- "Show all pending overtime approvals"
- "Supervisor approval queue"

**Query Examples:**
```sql
-- Pending approvals (uses index)
SELECT * FROM attendance 
WHERE overtime_approved IS NULL 
  AND overtime_hours > 0;
```

#### Index 5: Late Arrivals Tracking

**Purpose:** Fast retrieval for punctuality reports

**Definition:**
- **Columns:** (employee_id, late_minutes)
- **Type:** B-tree
- **Unique:** No

**Use Cases:**
- "Show all late arrivals for employee"
- "Punctuality report by employee"

**Query Examples:**
```sql
-- Employee late arrivals (uses index)
SELECT * FROM attendance 
WHERE employee_id = 123 
  AND late_minutes > 0
ORDER BY date DESC;
```

#### JSON Field Indexes (PostgreSQL)

**GIN Index on Location Fields:**

**Purpose:** Enable fast queries on JSON location data

**Definition:**
```sql
CREATE INDEX idx_attendance_clock_in_location_gin 
ON attendance USING GIN (clock_in_location);

CREATE INDEX idx_attendance_clock_out_location_gin 
ON attendance USING GIN (clock_out_location);
```

**Use Cases:**
- Find attendance records with location data
- Query specific location attributes
- Support WHERE clauses on JSON fields

**Query Examples:**
```sql
-- Has location data
SELECT * FROM attendance 
WHERE clock_in_location IS NOT NULL;

-- Specific location property (PostgreSQL JSONB)
SELECT * FROM attendance 
WHERE clock_in_location->>'source' = 'GPS';

-- Latitude/longitude queries (requires GIN)
SELECT * FROM attendance 
WHERE clock_in_location @> '{"source": "GPS"}';
```

### Unique Constraints

#### Primary Constraint: Employee-Date Uniqueness

**Purpose:** Prevent duplicate attendance records for same employee on same date

**Definition:**
- **Type:** UNIQUE constraint
- **Columns:** (employee_id, date)
- **Enforcement:** Database level

**Behavior:**
- Insert with duplicate (employee_id, date): Raises IntegrityError
- Application must handle error gracefully
- Suggests: Update existing record instead

**Business Logic:**
- One attendance record per employee per day
- If multiple shifts, use single record with multiple clocks or separate model
- Clock-in creates record, clock-out updates it

**Exceptions:**
- Multiple shifts in one day: Consider design alternatives
  - Option 1: Separate records (violates constraint) - not recommended
  - Option 2: Single record with JSON array of clock events
  - Option 3: Separate AttendanceEvent model with FK to main record

#### Implementation in Django

**Model Meta:**
```python
class Meta:
    constraints = [
        models.UniqueConstraint(
            fields=['employee', 'date'],
            name='unique_employee_date_attendance'
        )
    ]
    indexes = [
        models.Index(fields=['employee', 'date']),
        models.Index(fields=['date']),
        models.Index(fields=['status']),
    ]
```

**Migration:**
- Django generates appropriate SQL
- Index created atomically
- Constraint enforced immediately

### Foreign Key Constraints

#### Employee FK

**Configuration:**
- **On Delete:** PROTECT
- **Rationale:** Cannot delete employee with attendance records
- **Alternative:** Soft-delete employees (is_active=False)

**Constraint:**
- Prevents orphaned attendance records
- Maintains referential integrity
- Forces proper employee lifecycle management

#### Shift FK

**Configuration:**
- **On Delete:** SET_NULL
- **Rationale:** Attendance persists even if shift deleted
- **Impact:** Allows shift cleanup without affecting history

**Constraint:**
- Allows null shift (unscheduled attendance)
- Preserves historical data
- May require post-deletion reconciliation

### Check Constraints

#### Hours Validation

**Purpose:** Ensure time fields are non-negative and reasonable

**Constraints:**
```sql
-- work_hours non-negative and reasonable
ALTER TABLE attendance 
ADD CONSTRAINT check_work_hours_range 
CHECK (work_hours >= 0 AND work_hours <= 24);

-- break_hours non-negative and less than work_hours
ALTER TABLE attendance 
ADD CONSTRAINT check_break_hours_range 
CHECK (break_hours >= 0 AND break_hours <= work_hours);

-- effective_hours consistency
ALTER TABLE attendance 
ADD CONSTRAINT check_effective_hours_consistency 
CHECK (effective_hours <= work_hours);
```

**Django Implementation:**
```python
class Meta:
    constraints = [
        models.CheckConstraint(
            check=models.Q(work_hours__gte=0) & models.Q(work_hours__lte=24),
            name='check_work_hours_range'
        ),
        models.CheckConstraint(
            check=models.Q(break_hours__gte=0) & models.Q(break_hours__lte=models.F('work_hours')),
            name='check_break_hours_range'
        ),
    ]
```

#### Deviation Minutes Validation

**Constraints:**
```sql
-- late_minutes non-negative
ALTER TABLE attendance 
ADD CONSTRAINT check_late_minutes_nonnegative 
CHECK (late_minutes >= 0);

-- early_departure_minutes non-negative
ALTER TABLE attendance 
ADD CONSTRAINT check_early_departure_nonnegative 
CHECK (early_departure_minutes >= 0);
```

#### Overtime Validation

**Constraints:**
```sql
-- overtime_hours non-negative
ALTER TABLE attendance 
ADD CONSTRAINT check_overtime_hours_nonnegative 
CHECK (overtime_hours >= 0);

-- overtime_approved logic
-- (Cannot easily enforce "if overtime_hours > 0 then overtime_approved must be set" in DB)
-- Better handled in application logic
```

### Index Maintenance

#### Automatic Maintenance

**PostgreSQL:**
- Indexes automatically maintained on INSERT/UPDATE/DELETE
- Periodic VACUUM updates statistics
- ANALYZE refreshes query planner data

**Tasks:**
- Schedule regular VACUUM ANALYZE
- Monitor index bloat
- Rebuild indexes if fragmented

#### Index Monitoring

**Metrics to Track:**
- Index usage statistics (pg_stat_user_indexes)
- Index size and bloat
- Query performance with EXPLAIN
- Slow query log analysis

**Tools:**
- pgAdmin, DBeaver for index analysis
- pg_stat_statements for query tracking
- APM tools (New Relic, DataDog) for monitoring

### Performance Testing

#### Benchmarking Scenarios

**Test 1: Employee Attendance Lookup**
```sql
-- Should use (employee_id, date) index
EXPLAIN ANALYZE
SELECT * FROM attendance 
WHERE employee_id = 123 AND date = '2026-01-24';

-- Expected: Index Scan, <1ms
```

**Test 2: Daily Attendance Report**
```sql
-- Should use (date) index
EXPLAIN ANALYZE
SELECT employee_id, status, clock_in_time 
FROM attendance 
WHERE date = '2026-01-24';

-- Expected: Index Scan, <10ms for 1000 employees
```

**Test 3: Status Filter**
```sql
-- Should use (status) index
EXPLAIN ANALYZE
SELECT * FROM attendance 
WHERE status = 'ABSENT' AND date >= '2026-01-01';

-- Expected: Index Scan or Bitmap Index Scan
```

**Test 4: Overtime Approval Queue**
```sql
-- Should use (overtime_approved, overtime_hours) index
EXPLAIN ANALYZE
SELECT * FROM attendance 
WHERE overtime_approved IS NULL AND overtime_hours > 0;

-- Expected: Index Scan, <5ms
```

#### Performance Goals

**Response Times:**
- Single employee-date lookup: <1ms
- Daily report (1000 employees): <50ms
- Monthly report (1 employee): <100ms
- Complex aggregations: <500ms

**Scalability:**
- 1M records: All queries meet goals
- 10M records: Key queries still fast (<2x slowdown)
- 100M records: Consider partitioning

### Migration Strategy

#### Initial Setup

**New Installation:**
1. Create table with all fields
2. Add indexes during table creation
3. Add constraints after indexes
4. Test performance with sample data

**Migration Script:**
- Django generates migration automatically
- Review generated SQL
- Test on staging first
- Monitor production deployment

#### Adding Indexes to Existing Data

**Process:**
1. **Analyze Impact:** Estimate index size, build time
2. **Schedule Maintenance:** Low-traffic window
3. **Create Concurrently:** `CREATE INDEX CONCURRENTLY` (PostgreSQL)
4. **Monitor:** Watch for locks, long-running queries
5. **Verify:** Check index usage, query plans

**Considerations:**
- Index creation locks table (except CONCURRENTLY)
- Large tables take time (minutes to hours)
- Disk space required (indexes add overhead)

#### Constraint Addition

**Process:**
1. **Data Cleanup:** Fix existing violations first
2. **Add Constraint:** `ALTER TABLE ADD CONSTRAINT`
3. **Handle Failures:** Identify and resolve conflicts
4. **Verify:** Test inserts/updates respect constraint

**Unique Constraint on Existing Data:**
```sql
-- Find duplicates first
SELECT employee_id, date, COUNT(*) 
FROM attendance 
GROUP BY employee_id, date 
HAVING COUNT(*) > 1;

-- Resolve duplicates (merge, delete, etc.)
-- Then add constraint
ALTER TABLE attendance 
ADD CONSTRAINT unique_employee_date 
UNIQUE (employee_id, date);
```

---

## Migration Strategy

### Migration Overview

#### Migration Steps

**Step 1: Add New Fields**
- Add all fields with null=True initially
- Include indexes and constraints
- Deploy without data migration

**Step 2: Data Migration**
- Populate new fields from existing data
- Calculate hours, deviations, etc.
- Run in batches to avoid locking

**Step 3: Validation**
- Enforce non-null where required
- Add CHECK constraints
- Enable unique constraints

**Step 4: Application Update**
- Update application code to use new fields
- Remove legacy code paths
- Deploy frontend changes

### Django Migration Example Structure

**Migration 1: Add Fields**
```python
# migrations/0002_add_attendance_fields.py
operations = [
    migrations.AddField('attendance', 'shift', ...),
    migrations.AddField('attendance', 'work_hours', ...),
    migrations.AddField('attendance', 'break_hours', ...),
    # ... all other fields
]
```

**Migration 2: Add Indexes**
```python
# migrations/0003_add_attendance_indexes.py
operations = [
    migrations.AddIndex('attendance', 
        models.Index(fields=['employee', 'date'])
    ),
    # ... other indexes
]
```

**Migration 3: Add Constraints**
```python
# migrations/0004_add_attendance_constraints.py
operations = [
    migrations.AddConstraint('attendance',
        models.UniqueConstraint(
            fields=['employee', 'date'],
            name='unique_employee_date'
        )
    ),
    # ... check constraints
]
```

**Migration 4: Data Migration (Custom)**
```python
# migrations/0005_populate_attendance_hours.py
from django.db import migrations

def populate_hours(apps, schema_editor):
    Attendance = apps.get_model('attendance', 'Attendance')
    for attendance in Attendance.objects.filter(work_hours__isnull=True):
        if attendance.clock_out_time:
            # Calculate work_hours
            duration = attendance.clock_out_time - attendance.clock_in_time
            attendance.work_hours = duration.total_seconds() / 3600
            attendance.save()

operations = [
    migrations.RunPython(populate_hours, reverse_code=migrations.RunPython.noop),
]
```

### Backwards Compatibility

**During Migration:**
- Old code continues to work (fields nullable)
- New code uses new fields when available
- Gradual transition supported

**After Migration:**
- Remove legacy support
- Enforce new field requirements
- Update documentation

---

## Validation Rules

### Field-Level Validation

**Hours Fields:**
- Non-negative
- Reasonable maximums
- Consistent relationships (effective <= work)

**Minutes Fields:**
- Non-negative
- Maximum thresholds for alerting

**Location Fields:**
- Valid JSON structure
- Required properties present
- Coordinate ranges valid

**IP Fields:**
- Valid IP format (IPv4 or IPv6)
- Not required but validated when present

### Cross-Field Validation

**Time Consistency:**
- clock_out_time > clock_in_time
- work_hours aligns with clock times
- Location timestamps near clock times

**Logical Consistency:**
- If overtime_hours > 0, clock_out must exist
- If late_minutes > 0, shift must exist
- If location verified, coordinates within geofence

### Business Rule Validation

**Shift Alignment:**
- Clock times within expected shift window
- Deviations calculated correctly
- Overtime determination accurate

**Approval Workflow:**
- Overtime approved/rejected only by authorized users
- Approval state transitions valid
- Cannot approve zero overtime

---

## Business Logic Guidelines

### Calculation Timing

**Real-Time:**
- Calculate on clock events (in/out)
- Immediate feedback to employee
- Enable validation before completion

**Batch Processing:**
- Nightly recalculation for corrections
- Timezone adjustments
- Policy changes applied retroactively

### Error Handling

**Missing Data:**
- Gracefully handle null shift
- Default to no deviations if shift missing
- Flag for manual review

**Invalid Data:**
- Reject obviously wrong times
- Prevent negative hours
- Alert administrators

### Audit Trail

**Track Changes:**
- Log all manual adjustments
- Record who made changes and when
- Maintain original calculated values

**Compliance:**
- Retain records per legal requirements
- Support dispute resolution
- Enable audits

---

## Testing Considerations

### Unit Tests

**Field Validation:**
- Test each field's constraints
- Boundary value testing
- Null handling

**Calculations:**
- Test hours calculation with various scenarios
- Test deviation calculation with grace periods
- Test overtime logic with different shifts

**Location Validation:**
- Test geofencing with coordinates
- Test distance calculations
- Test missing location handling

### Integration Tests

**Clock-In Flow:**
- Test full clock-in with all fields populated
- Test location capture and verification
- Test shift assignment and validation

**Clock-Out Flow:**
- Test hours calculation on clock-out
- Test overtime determination
- Test location comparison

**Approval Workflow:**
- Test overtime approval/rejection
- Test permission checks
- Test state transitions

### Performance Tests

**Query Performance:**
- Test indexes with large datasets (1M+ records)
- Measure query response times
- Identify slow queries

**Concurrent Access:**
- Test multiple clock events simultaneously
- Ensure no race conditions
- Validate locking behavior

---

## Security and Privacy

### Data Protection

**Sensitive Fields:**
- Location data: Minimal collection, strict access
- IP addresses: Anonymous in reports
- Personal identifiers: Encrypted at rest

**Access Controls:**
- Role-based access to attendance data
- Employees see own records
- Supervisors see team records
- HR sees all records

### Compliance

**GDPR:**
- Right to access: Employees can view their data
- Right to erasure: After retention period
- Data minimization: Only collect necessary fields
- Purpose limitation: Use only for attendance

**Labor Laws:**
- Retain records per jurisdiction requirements
- Accurate time tracking for wage calculation
- Support audits and disputes

---

## Performance Optimization

### Query Optimization

**Use Indexes:**
- Always use indexed fields in WHERE clauses
- Use select_related for FK joins
- Use prefetch_related for reverse FK

**Avoid N+1:**
- Batch fetch related data
- Use Django ORM efficiently
- Profile queries in development

### Caching Strategy

**Cache Frequent Queries:**
- Today's attendance for employee
- Employee's current shift
- Overtime approval queue

**Invalidation:**
- Clear cache on attendance update
- TTL for safety (5-10 minutes)
- Selective invalidation

### Database Partitioning

**For Large Datasets:**
- Partition by date (monthly or yearly)
- Improves query performance on recent data
- Simplifies archiving old data

**Implementation:**
- PostgreSQL table partitioning
- Separate tables per partition
- Automatic routing

---

## Conclusion

Tasks 25-32 complete the Attendance Record Model with:

✅ **Shift relationship** for schedule alignment  
✅ **Hours tracking** with decimal precision for payroll  
✅ **Deviation metrics** for punctuality management  
✅ **Overtime handling** with approval workflow  
✅ **GPS location tracking** for verification  
✅ **IP address tracking** for additional security  
✅ **Database optimization** with indexes and constraints  

The model now supports comprehensive attendance management with:
- Accurate time tracking
- Multiple verification methods
- Policy enforcement
- Compliance reporting
- Performance at scale

**Next Steps:**
- Implement Shift Management (SubPhase-04, Group-C)
- Build Leave Management integration
- Develop attendance analytics
- Create supervisor dashboards

---

**End of Document**

Total Lines: ~1400 (within limit)
