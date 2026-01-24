# Tasks 13-18: DOB, Gender, Marital Status, ID Generator, Indexes, and Migrations

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 01 - Employee Management  
> **Group:** A - Employee Model & Core Fields  
> **Document:** 03 of 03  
> **Tasks Covered:** 13, 14, 15, 16, 17, 18

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [02_Tasks-07-12_Model-Core-Name-User-NIC.md](02_Tasks-07-12_Model-Core-Name-User-NIC.md)
- **→ Next Group:** [../Group-B_Personal-Contact-Details/](../Group-B_Personal-Contact-Details/)

---

## Document Overview

This document completes the Employee model foundation by adding demographic fields (date of birth, gender, marital status), implementing an automatic employee ID generator, creating database indexes for query optimization, and generating initial migrations to create the database schema.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 13 | Add Employee DOB Field | Medium | 20 min |
| 14 | Add Employee Gender Field | Low | 15 min |
| 15 | Add Employee Marital Status | Low | 15 min |
| 16 | Create Employee ID Generator | Medium | 25 min |
| 17 | Create Employee Model Indexes | Medium | 20 min |
| 18 | Run Initial Employee Migrations | Low | 15 min |

---

## Task 13: Add Employee DOB Field

### Overview
Add the date_of_birth field to the Employee model to store the employee's date of birth. This field is essential for age verification, retirement calculation, leave eligibility, and compliance with labor laws. The field includes computed properties for age calculation and validation.

### Dependencies
- Task 07: Create Employee Model Core
- Task 11: Add Employee NIC Field (for NIC-DOB validation)

### Instructions

1. **Open employee.py model file**
   - Navigate to `apps/employees/models/employee.py`
   - Locate Employee model class

2. **Add date_of_birth field**
   - DateField
   - Required field (blank=False, null=False)
   - help_text explaining purpose
   - Will be validated against NIC

3. **Add age property**
   - @property decorator
   - Calculate current age from date_of_birth
   - Return integer (years)
   - Handle edge cases (birthday not yet occurred this year)

4. **Add is_minor property**
   - @property decorator
   - Return True if age < 18
   - Return False otherwise
   - Used for compliance checks

5. **Add retirement_date property**
   - @property decorator
   - Calculate retirement date (age 60 in Sri Lanka)
   - Return datetime.date object
   - Consider future retirement age changes

6. **Add years_until_retirement property**
   - @property decorator
   - Calculate years remaining until retirement
   - Return integer or 0 if already retired
   - Useful for succession planning

7. **Add clean method override**
   - Validate DOB not in future
   - Validate DOB matches NIC (if NIC provided)
   - Validate minimum age (e.g., 16 years)
   - Raise ValidationError if invalid

### Date of Birth Field Structure

```
┌──────────────────────────────────────────────────────┐
│         Employee Date of Birth                       │
├──────────────────────────────────────────────────────┤
│ Storage Field:                                       │
│  • date_of_birth (DateField, required)               │
│                                                      │
│ Computed Properties:                                 │
│  • age (property) - Current age in years             │
│  • is_minor (property) - Under 18 years              │
│  • retirement_date (property) - Date of retirement   │
│  • years_until_retirement (property)                 │
│                                                      │
│ Validation:                                          │
│  • Not in future                                     │
│  • Matches NIC-derived DOB                           │
│  • Minimum age requirement                           │
└──────────────────────────────────────────────────────┘
```

### Age Calculation Logic

```
Age Calculation Method
═════════════════════

Today: 2026-01-24
DOB: 1990-05-15

Calculation:
1. Years difference: 2026 - 1990 = 36
2. Check if birthday occurred this year:
   - Today's month/day: 01-24
   - Birth month/day: 05-15
   - Birthday NOT yet occurred this year
3. Adjust: 36 - 1 = 35

Current Age: 35 years

Example Code Logic:
today = date.today()
age = today.year - dob.year
if (today.month, today.day) < (dob.month, dob.day):
    age -= 1
```

### Age-Based Scenarios

#### Minimum Age Validation
```
Sri Lanka Labor Law Requirements
═══════════════════════════════

Minimum working age: 14 years (with restrictions)
Regular employment: 16 years minimum
Hazardous work: 18 years minimum

Validation:
DOB: 2012-03-15
Age (as of 2026-01-24): 13 years
Result: ✗ Too young for employment
```

#### Minor Employee Handling
```
Restrictions for Minors (Under 18)
════════════════════════════════

✗ Cannot work night shifts
✗ Cannot work in hazardous conditions
✗ Limited working hours
✗ Requires guardian consent
✓ Can work in safe environments
✓ Limited to certain industries

System checks:
if employee.is_minor:
    # Apply minor restrictions
    restrict_night_shift()
    require_guardian_consent()
    limit_working_hours()
```

#### Retirement Planning
```
Retirement Age in Sri Lanka
═══════════════════════════

Standard retirement: 60 years
Extended (some sectors): 65 years

Example:
DOB: 1970-08-20
Retirement Date: 2030-08-20 (age 60)
Years until retirement (2026): 4 years

Succession Planning:
• 5 years before: Identify successor
• 3 years before: Training program
• 1 year before: Handover process
• Retirement date: Gratuity settlement
```

### DOB and NIC Validation

```
Cross-Field Validation
═════════════════════

NIC: 912345678V
Extracted DOB: 1991-08-22

Entered DOB: 1991-08-22
Result: ✓ Match

Entered DOB: 1991-08-23
Result: ✗ Mismatch - DOB must match NIC

Validation ensures:
• Correct NIC entry
• Correct DOB entry
• Data consistency
```

### Use Cases by Age

| Age Range | Employment Type | Considerations |
|-----------|----------------|----------------|
| 14-15 | Limited (with restrictions) | Guardian consent required |
| 16-17 | Regular (daytime only) | Minor protections apply |
| 18-24 | Full employment | Entry level, training |
| 25-40 | Full employment | Career development |
| 41-55 | Full employment | Mid-career, senior roles |
| 56-59 | Full employment | Pre-retirement planning |
| 60+ | Extended (if applicable) | Retirement processing |

### Leave Entitlement Based on Age

```
Age-Related Leave Policies
══════════════════════════

Service Years (Age-related):
• Entry level (18-25): 14 days annual leave
• Mid-career (26-40): 18 days annual leave
• Senior (41-55): 21 days annual leave
• Pre-retirement (56-59): 24 days annual leave

Medical Leave:
• All ages: 7 days per year with certificate
• Chronic conditions: Extended based on age/condition

Maternity Leave:
• Female employees (childbearing age): 84 days
```

### Expected Outcome
- DOB field for age tracking
- Automatic age calculation
- Minor status identification
- Retirement date computation
- DOB-NIC validation

### Verification Checklist
- [ ] date_of_birth field added
- [ ] Field is required
- [ ] age property implemented
- [ ] is_minor property implemented
- [ ] retirement_date property implemented
- [ ] years_until_retirement property implemented
- [ ] clean method with validation
- [ ] DOB-NIC validation logic
- [ ] Future date validation
- [ ] Minimum age validation

---

## Task 14: Add Employee Gender Field

### Overview
Add the gender field to the Employee model to store employee's gender identification. This field uses the gender choices defined earlier and can be automatically populated from NIC data, though it allows for self-identification and updates.

### Dependencies
- Task 05: Define Gender Choices
- Task 07: Create Employee Model Core
- Task 11: Add Employee NIC Field (for gender extraction)

### Instructions

1. **Open employee.py model file**
   - Continue in `apps/employees/models/employee.py`
   - Locate Employee model class

2. **Add gender field**
   - CharField with choices=GENDERS
   - max_length=20
   - Optional (blank=True, null=True)
   - Default=None (allows employee to choose not to disclose)

3. **Add auto-populate logic in clean method**
   - If gender not provided and NIC exists
   - Extract gender from NIC
   - Set gender field automatically
   - Allow manual override

4. **Add get_gender_display_icon method**
   - Return appropriate icon/symbol for gender
   - Male: "♂" or icon
   - Female: "♀" or icon
   - Other/Prefer not to say: Neutral icon
   - Used in UI display

5. **Update model docstring**
   - Document gender field purpose
   - Note privacy sensitivity
   - Explain auto-population from NIC

### Gender Field Structure

```
┌──────────────────────────────────────────────────────┐
│              Employee Gender                         │
├──────────────────────────────────────────────────────┤
│ Storage Field:                                       │
│  • gender (CharField with choices, optional)         │
│                                                      │
│ Choices:                                             │
│  • MALE ('male')                                     │
│  • FEMALE ('female')                                 │
│  • OTHER ('other')                                   │
│  • PREFER_NOT_TO_SAY ('prefer_not_to_say')           │
│                                                      │
│ Methods:                                             │
│  • get_gender_display_icon() - UI icon               │
│                                                      │
│ Auto-Population:                                     │
│  • Extracted from NIC if not provided                │
│  • Can be manually overridden                        │
└──────────────────────────────────────────────────────┘
```

### Gender Auto-Population Flow

```
Gender Population Process
════════════════════════

1. Employee Record Created
   ├─ NIC: 912345678V
   └─ Gender: Not provided
         │
         ▼
2. Clean Method Called
   └─ Check if gender empty
         │
         ▼
3. Extract Gender from NIC
   ├─ NIC day: 234 (< 500)
   └─ Gender: MALE
         │
         ▼
4. Populate Gender Field
   └─ gender = MALE

5. Save Employee
   └─ Gender stored: MALE
```

### Gender and Leave Entitlements

```
Gender-Specific Leave Types
══════════════════════════

Maternity Leave (84 days):
• Eligibility: Female employees
• Timing: Before/after childbirth
• Pay: Full salary
• Status: ON_LEAVE

Paternity Leave (3-7 days):
• Eligibility: Male employees
• Timing: Around childbirth
• Pay: Full salary
• Status: ACTIVE (short duration)

Parental Leave:
• Eligibility: All genders
• Purpose: Adoption, childcare
• Duration: Varies by policy
```

### Privacy and Data Handling

```
Gender Data Privacy Rules
════════════════════════

Access Control:
✓ HR personnel: Full access
✓ Managers: View only (if needed)
✓ Employee self: Full access to own record
✓ Payroll: Access for leave calculations
✗ Public: No access
✗ Other employees: No access

Usage Restrictions:
✓ Leave entitlement calculations
✓ Diversity reporting (aggregated)
✓ Compliance reporting
✗ Hiring decisions
✗ Promotion decisions
✗ Salary decisions
```

### Gender Field Use Cases

| Use Case | Access Required | Purpose |
|----------|----------------|---------|
| Leave application | System automatic | Determine leave type eligibility |
| Diversity report | HR (aggregated) | Gender distribution statistics |
| Uniform ordering | HR/Admin | Appropriate uniform sizes |
| Restroom facilities | Facilities | Adequate facility planning |
| Health programs | HR/Medical | Gender-specific health initiatives |

### Self-Identification vs NIC

```
Gender Identity Handling
═══════════════════════

Scenario 1: NIC Matches Identity
NIC Gender: Male (day 234)
Self-Identified: Male
System: MALE
Action: No conflict

Scenario 2: NIC Different from Identity
NIC Gender: Female (day 534)
Self-Identified: Other
System: OTHER (respects self-identification)
Action: Allow override, note discrepancy

Scenario 3: Prefer Not to Say
NIC Gender: Male (day 234)
Self-Identified: Prefer not to say
System: PREFER_NOT_TO_SAY
Action: Respect privacy choice
```

### Expected Outcome
- Gender field with inclusive choices
- Auto-population from NIC
- Manual override capability
- Privacy-respecting implementation
- Leave eligibility support

### Verification Checklist
- [ ] gender field added with choices
- [ ] Field is optional
- [ ] Auto-population logic in clean method
- [ ] Manual override allowed
- [ ] get_gender_display_icon method
- [ ] Privacy considerations documented
- [ ] Leave integration noted

---

## Task 15: Add Employee Marital Status

### Overview
Add the marital_status field to the Employee model to store employee's marital status. This field is used for benefits administration, emergency contact validation, insurance coverage, and leave entitlements. The field respects employee privacy while providing necessary data for HR operations.

### Dependencies
- Task 06: Define MaritalStatus Choices
- Task 07: Create Employee Model Core

### Instructions

1. **Open employee.py model file**
   - Continue in `apps/employees/models/employee.py`
   - Locate Employee model class

2. **Add marital_status field**
   - CharField with choices=MARITAL_STATUSES
   - max_length=20
   - Optional (blank=True, null=True)
   - Default=None (not mandatory to disclose)

3. **Add spouse_name field**
   - CharField with max_length=200
   - Optional (blank=True, null=True)
   - Only applicable if married
   - Used for benefits and emergency contact

4. **Add marriage_date field**
   - DateField
   - Optional (blank=True, null=True)
   - Only applicable if married
   - Used for benefits start date

5. **Add has_spouse property**
   - @property decorator
   - Return True if marital_status is MARRIED
   - Return False otherwise
   - Quick check for spouse-related operations

6. **Add is_eligible_for_marriage_leave method**
   - Check if status changing from SINGLE to MARRIED
   - Return True if eligible
   - Return False otherwise
   - Used for leave applications

7. **Update clean method**
   - Validate spouse_name required if MARRIED
   - Validate marriage_date not in future
   - Validate marriage_date not before DOB

### Marital Status Field Structure

```
┌──────────────────────────────────────────────────────┐
│           Employee Marital Status                    │
├──────────────────────────────────────────────────────┤
│ Storage Fields:                                      │
│  • marital_status (CharField with choices, optional) │
│  • spouse_name (CharField, optional)                 │
│  • marriage_date (DateField, optional)               │
│                                                      │
│ Choices:                                             │
│  • SINGLE ('single')                                 │
│  • MARRIED ('married')                               │
│  • DIVORCED ('divorced')                             │
│  • WIDOWED ('widowed')                               │
│                                                      │
│ Computed Properties:                                 │
│  • has_spouse (property)                             │
│                                                      │
│ Methods:                                             │
│  • is_eligible_for_marriage_leave()                  │
└──────────────────────────────────────────────────────┘
```

### Marital Status Benefits Impact

```
Benefits by Marital Status
═════════════════════════

MARRIED:
• Health insurance: Family coverage
  └─ Spouse + children covered
• Life insurance beneficiary: Spouse (primary)
• EPF nomination: Spouse
• Emergency contact: Spouse (primary)
• Family allowance: Eligible
• Dependent benefits: Applicable

SINGLE:
• Health insurance: Individual coverage
• Life insurance beneficiary: Parent/sibling
• EPF nomination: Parent
• Emergency contact: Parent/sibling
• Family allowance: Not applicable
• Dependent benefits: Not applicable

DIVORCED/WIDOWED:
• Health insurance: Individual + dependents*
• Life insurance beneficiary: Children/parent
• EPF nomination: Children/parent
• Emergency contact: Relative/children
• Family allowance: Case by case*
• Dependent benefits: If supporting dependents*

*Based on custody/dependent status
```

### Marriage Leave Eligibility

```
Marriage Leave Process
═════════════════════

Eligibility Check:
1. Current status: SINGLE
2. Change to: MARRIED
3. Marriage leave: ELIGIBLE

Leave Details:
• Duration: 2-3 days (company policy)
• Documentation: Marriage certificate required
• Timing: Within 30 days of marriage
• Pay: Full salary
• Status during leave: ON_LEAVE (short)

Process:
1. Employee applies for marriage leave
2. System checks: is_eligible_for_marriage_leave()
3. If eligible: Approve (pending documentation)
4. Employee submits marriage certificate
5. Update marital_status: SINGLE → MARRIED
6. Update spouse_name and marriage_date
7. Trigger benefits update
```

### Spouse Information Usage

```
Spouse Name Applications
════════════════════════

1. Emergency Contact:
   • Listed as primary contact
   • Contact in case of accident/emergency
   • Phone number linked to employee

2. Health Insurance:
   • Add spouse to policy
   • Coverage effective from marriage_date
   • Requires marriage certificate

3. Life Insurance:
   • Nominate as beneficiary
   • Update beneficiary when status changes
   • 100% or split with children

4. EPF/ETF Nomination:
   • Spouse as nominee
   • Receives EPF on employee's death
   • Legal requirement for nomination

5. Company Events:
   • Spouse invited to functions
   • Family day events
   • Annual dinner/celebrations
```

### Status Change Scenarios

```
Marital Status Transitions
══════════════════════════

Scenario 1: Getting Married
Before:
  marital_status: SINGLE
  spouse_name: None
  marriage_date: None

After:
  marital_status: MARRIED
  spouse_name: "Nimalee Silva"
  marriage_date: 2026-02-14

Actions:
• Apply marriage leave
• Update benefits to family coverage
• Add spouse to emergency contacts
• Update EPF nomination

Scenario 2: Divorce
Before:
  marital_status: MARRIED
  spouse_name: "Nimalee Silva"

After:
  marital_status: DIVORCED
  spouse_name: (retain for records)
  
Actions:
• Update benefits to individual
• Update emergency contact
• Update EPF nomination
• Adjust dependent benefits (if applicable)

Scenario 3: Spouse Deceased
Before:
  marital_status: MARRIED
  spouse_name: "Nimalee Silva"

After:
  marital_status: WIDOWED
  spouse_name: (retain for records)

Actions:
• Update benefits
• Offer bereavement leave
• Update emergency contacts
• Update EPF nomination
• Offer counseling support
```

### Privacy Considerations

```
Marital Status Data Handling
═══════════════════════════

Sensitive Information:
✓ Marital status is personal data
✓ Spouse information is private
✓ Marriage date is sensitive

Access Control:
• HR: Full access (benefits administration)
• Employee: Own record only
• Manager: Limited (if needed for benefits)
• Payroll: Read for allowances
• Others: No access

Voluntary Disclosure:
• Employee can choose not to disclose
• Not mandatory for employment
• Can update at any time
• Privacy respected
```

### Expected Outcome
- Marital status tracking
- Spouse information storage
- Benefits administration support
- Leave eligibility determination
- Privacy-respecting implementation

### Verification Checklist
- [ ] marital_status field added with choices
- [ ] spouse_name field added (optional)
- [ ] marriage_date field added (optional)
- [ ] has_spouse property implemented
- [ ] is_eligible_for_marriage_leave method
- [ ] Validation in clean method
- [ ] Privacy considerations noted
- [ ] Benefits integration documented

---

## Task 16: Create Employee ID Generator

### Overview
Create an automated employee ID generator service that assigns unique employee IDs in the format EMP-{SEQUENCE}. The generator ensures uniqueness within tenant scope, supports configurable prefixes, handles concurrent requests safely, and provides options for manual ID assignment.

### Dependencies
- Task 07: Create Employee Model Core
- Database transactions support

### Instructions

1. **Create id_generator.py service file**
   - Create at `apps/employees/services/id_generator.py`
   - Import necessary Django components
   - Import transaction support

2. **Define generate_employee_id function**
   - Main function to generate employee ID
   - Accept tenant parameter
   - Accept optional prefix parameter (default: 'EMP')
   - Return formatted employee ID string

3. **Implement sequence logic**
   - Query for last employee ID within tenant
   - Extract sequence number
   - Increment by 1
   - Handle first employee (sequence starts at 1)

4. **Format employee ID**
   - Combine prefix and sequence
   - Zero-pad sequence to 4 digits minimum
   - Format: {PREFIX}-{SEQUENCE:04d}
   - Example: EMP-0001, EMP-0150

5. **Add collision handling**
   - Use database transaction
   - Check for duplicate before save
   - Retry with next sequence if collision
   - Maximum retry attempts

6. **Add custom prefix support**
   - Allow tenant-specific prefixes
   - Store prefix in tenant settings
   - Fall back to default 'EMP' if not configured

7. **Add manual ID validation**
   - Function to validate manually entered IDs
   - Check format correctness
   - Check uniqueness within tenant
   - Return validation result

8. **Add get_next_sequence function**
   - Helper function to get next sequence number
   - Query database for max sequence
   - Return next available sequence

9. **Update Employee model**
   - Override save method
   - Auto-generate employee_id if not provided
   - Call generate_employee_id function
   - Save with generated ID

10. **Update services/__init__.py**
    - Import generate_employee_id
    - Add to __all__ list

### Employee ID Structure

```
┌──────────────────────────────────────────────────────┐
│           Employee ID Format                         │
├──────────────────────────────────────────────────────┤
│ Standard Format:                                     │
│  PREFIX-SEQUENCE                                     │
│                                                      │
│ Components:                                          │
│  • Prefix: 3-4 character identifier (e.g., EMP)      │
│  • Separator: Hyphen (-)                             │
│  • Sequence: Zero-padded number (e.g., 0001)         │
│                                                      │
│ Examples:                                            │
│  • EMP-0001 (First employee)                         │
│  • EMP-0150 (150th employee)                         │
│  • EMP-9999 (9999th employee)                        │
│  • STAF-0001 (Custom prefix)                         │
└──────────────────────────────────────────────────────┘
```

### ID Generation Algorithm

```
Employee ID Generation Flow
══════════════════════════

1. Start Transaction
         │
         ▼
2. Get Tenant Context
   └─ Current tenant identified
         │
         ▼
3. Query Last Employee ID
   └─ SELECT MAX(employee_id) WHERE tenant=current
         │
         ▼
4. Extract Sequence Number
   ├─ If no employees: sequence = 0
   ├─ Else: parse sequence from last ID
   └─ Example: "EMP-0150" → 150
         │
         ▼
5. Increment Sequence
   └─ new_sequence = last_sequence + 1
         │
         ▼
6. Format New ID
   └─ f"{prefix}-{sequence:04d}"
   └─ Example: "EMP-0151"
         │
         ▼
7. Check Uniqueness
   ├─ Query if ID exists
   ├─ If exists: Retry with next sequence
   └─ If unique: Continue
         │
         ▼
8. Assign to Employee
   └─ employee.employee_id = new_id
         │
         ▼
9. Commit Transaction
         │
         ▼
10. Return Employee ID
```

### Sequence Extraction Logic

```
Parse Employee ID Components
═══════════════════════════

Input: "EMP-0150"

Steps:
1. Split by separator: ["EMP", "0150"]
2. Extract prefix: "EMP"
3. Extract sequence: "0150"
4. Convert to integer: 150

Input: "STAFF-1234"

Steps:
1. Split by separator: ["STAFF", "1234"]
2. Extract prefix: "STAFF"
3. Extract sequence: "1234"
4. Convert to integer: 1234

Edge Cases:
• Empty string: Return None
• No separator: Return None
• Non-numeric sequence: Return None
• Invalid format: Return None
```

### Concurrent Request Handling

```
Race Condition Prevention
════════════════════════

Scenario: Two employees created simultaneously

Request A                    Request B
    │                           │
    ├─ Start transaction        ├─ Start transaction
    │                           │
    ├─ Get last ID: EMP-0099    ├─ Get last ID: EMP-0099
    │                           │
    ├─ Calculate: EMP-0100      ├─ Calculate: EMP-0100
    │                           │
    ├─ Check uniqueness         │
    │  └─ Unique ✓              │
    │                           ├─ Check uniqueness
    ├─ Save EMP-0100            │  └─ Unique ✓
    │  └─ SUCCESS               │
    ├─ Commit                   ├─ Save EMP-0100
    │                           │  └─ COLLISION! ✗
                                │
                                ├─ Retry: EMP-0101
                                │  └─ Unique ✓
                                │
                                ├─ Save EMP-0101
                                │  └─ SUCCESS
                                │
                                └─ Commit

Solution:
• Use database transactions
• Lock records during generation
• Retry on collision
• Maximum retry attempts: 5
```

### Custom Prefix Configuration

```
Tenant-Specific Prefixes
═══════════════════════

Tenant 1: "LCC-Foods"
  Prefix: "LCCF"
  IDs: LCCF-0001, LCCF-0002, ...

Tenant 2: "TechCorp"
  Prefix: "TECH"
  IDs: TECH-0001, TECH-0002, ...

Tenant 3: No custom prefix
  Prefix: "EMP" (default)
  IDs: EMP-0001, EMP-0002, ...

Configuration:
• Stored in tenant settings
• Configurable via admin interface
• Falls back to default 'EMP'
• Maximum prefix length: 6 characters
```

### Manual ID Assignment

```
Manual vs Automatic IDs
═══════════════════════

Automatic (Default):
• System generates: EMP-0001, EMP-0002, ...
• Sequential numbering
• No gaps in sequence
• Recommended for most cases

Manual:
• Admin/HR enters custom ID
• Format must match: PREFIX-NUMBER
• Must be unique within tenant
• Use cases:
  └─ Migrating from legacy system
  └─ Maintaining existing numbering
  └─ Special employee categories

Validation:
if manual_id_provided:
    validate_format(manual_id)
    check_uniqueness(manual_id, tenant)
    if valid:
        use manual_id
    else:
        raise ValidationError
else:
    auto_generate_id()
```

### ID Format Validation

```
Employee ID Format Rules
═══════════════════════

Valid Formats:
✓ EMP-0001       (Standard)
✓ EMP-9999       (4 digits)
✓ EMP-00001      (5 digits)
✓ STAFF-0001     (Custom prefix)
✓ LC-0001        (Short prefix)

Invalid Formats:
✗ EMP0001        (Missing separator)
✗ EMP-001        (Too few digits)
✗ EMP-ABC        (Non-numeric sequence)
✗ EMP-           (Missing sequence)
✗ -0001          (Missing prefix)
✗ EMP--0001      (Double separator)

Validation Rules:
• Prefix: 2-6 alphabetic characters
• Separator: Single hyphen (-)
• Sequence: Minimum 4 digits
• No spaces allowed
• Case insensitive (stored uppercase)
```

### Expected Outcome
- Automatic employee ID generation
- Sequential numbering per tenant
- Collision-safe implementation
- Custom prefix support
- Manual ID validation

### Verification Checklist
- [ ] id_generator.py service created
- [ ] generate_employee_id function implemented
- [ ] Sequence logic working
- [ ] ID formatting correct
- [ ] Collision handling implemented
- [ ] Custom prefix support added
- [ ] Manual ID validation function
- [ ] get_next_sequence helper function
- [ ] Employee model save method updated
- [ ] Service imported in __init__.py
- [ ] Concurrent request testing

---

## Task 17: Create Employee Model Indexes

### Overview
Add database indexes to the Employee model to optimize query performance. Indexes are critical for fast lookups, filtering, and sorting operations on frequently queried fields such as employee_id, nic_number, status, and name fields.

### Dependencies
- Task 07: Create Employee Model Core
- All employee fields added (Tasks 08-15)

### Instructions

1. **Open employee.py model file**
   - Navigate to `apps/employees/models/employee.py`
   - Locate Employee model Meta class

2. **Add indexes to Meta class**
   - Create indexes list
   - Add indexes for frequently queried fields

3. **Add employee_id index**
   - models.Index(fields=['employee_id'])
   - Name: 'employee_id_idx'
   - Purpose: Fast employee ID lookup

4. **Add nic_number index**
   - models.Index(fields=['nic_number'])
   - Name: 'nic_number_idx'
   - Purpose: Fast NIC lookup

5. **Add status index**
   - models.Index(fields=['status'])
   - Name: 'status_idx'
   - Purpose: Filter active/inactive employees

6. **Add name indexes**
   - models.Index(fields=['last_name', 'first_name'])
   - Name: 'name_idx'
   - Purpose: Sort and search by name

7. **Add composite indexes**
   - models.Index(fields=['tenant', 'status'])
   - models.Index(fields=['tenant', 'is_active'])
   - Purpose: Fast tenant-specific queries

8. **Add date_of_birth index**
   - models.Index(fields=['date_of_birth'])
   - Name: 'dob_idx'
   - Purpose: Age-based queries

9. **Add user index**
   - models.Index(fields=['user'])
   - Name: 'user_idx'
   - Purpose: Fast user-employee lookup

10. **Update unique_together constraints**
    - Add (tenant, employee_id)
    - Add (tenant, nic_number)
    - Ensure uniqueness within tenant scope

### Database Index Structure

```
┌──────────────────────────────────────────────────────┐
│           Employee Model Indexes                     │
├──────────────────────────────────────────────────────┤
│ Single-Column Indexes:                               │
│  • employee_id_idx → employee_id                     │
│  • nic_number_idx → nic_number                       │
│  • status_idx → status                               │
│  • dob_idx → date_of_birth                           │
│  • user_idx → user                                   │
│                                                      │
│ Composite Indexes:                                   │
│  • name_idx → (last_name, first_name)                │
│  • tenant_status_idx → (tenant, status)              │
│  • tenant_active_idx → (tenant, is_active)           │
│                                                      │
│ Unique Constraints:                                  │
│  • unique_together: (tenant, employee_id)            │
│  • unique_together: (tenant, nic_number)             │
└──────────────────────────────────────────────────────┘
```

### Index Performance Impact

```
Query Performance Comparison
═══════════════════════════

Without Index:
Query: Find employee by employee_id
Execution: Full table scan
Time: O(n) - Linear time
Example: 10,000 records → 10,000 comparisons

With Index:
Query: Find employee by employee_id
Execution: Index lookup (B-tree)
Time: O(log n) - Logarithmic time
Example: 10,000 records → ~14 comparisons

Performance Improvement:
• 100 records: ~7x faster
• 1,000 records: ~100x faster
• 10,000 records: ~700x faster
• 100,000 records: ~5,800x faster
```

### Common Query Patterns

```
Optimized Query Patterns
═══════════════════════

Query 1: Get employee by ID
SELECT * FROM employee WHERE employee_id = 'EMP-0001'
Index used: employee_id_idx
Speed: Fast (index lookup)

Query 2: Get active employees
SELECT * FROM employee WHERE status = 'active'
Index used: status_idx
Speed: Fast (indexed filter)

Query 3: Search by name
SELECT * FROM employee 
WHERE last_name LIKE 'Perera%' 
ORDER BY last_name, first_name
Index used: name_idx
Speed: Fast (indexed search and sort)

Query 4: Tenant-specific active employees
SELECT * FROM employee 
WHERE tenant_id = 1 AND is_active = true
Index used: tenant_active_idx
Speed: Fast (composite index)

Query 5: Employee by NIC
SELECT * FROM employee WHERE nic_number = '912345678V'
Index used: nic_number_idx
Speed: Fast (unique index lookup)
```

### Composite Index Benefits

```
Composite Index: (tenant, status)
══════════════════════════════

Benefits:
1. Tenant-specific status queries
   Query: Get all active employees for tenant
   WHERE tenant_id = 1 AND status = 'active'

2. Index covers both columns
   • No need for separate lookups
   • Single index scan
   • Faster than two separate indexes

3. Tenant isolation
   • Multi-tenant query optimization
   • Each tenant's data quickly accessible

Example Performance:
Single tenant with 1,000 employees:
  Without index: Scan 1,000 records
  With index: Scan ~200 records (20% active)
  Speed-up: 5x faster

Multi-tenant with 10,000 total employees:
  Without index: Scan all 10,000
  With composite index: Scan ~200 for tenant
  Speed-up: 50x faster
```

### Index vs Full Table Scan

```
When Indexes Are Used
════════════════════

✓ Index Used:
  • WHERE employee_id = 'EMP-0001'
  • WHERE status = 'active'
  • WHERE last_name = 'Perera'
  • WHERE tenant_id = 1 AND status = 'active'
  • ORDER BY last_name, first_name

✗ Index NOT Used (Full Scan):
  • WHERE full_name LIKE '%Perera%' (mid-pattern)
  • WHERE YEAR(date_of_birth) = 1990 (function)
  • WHERE employee_id IS NULL
  • SELECT * (all records, no filter)
  • WHERE status != 'active' (inequality)
```

### Index Size Considerations

```
Index Storage Impact
═══════════════════

Assumptions:
• 10,000 employees per tenant
• 5 tenants = 50,000 total employees

Table Size:
• Each row: ~500 bytes (approximate)
• Total table: 50,000 × 500 = 25 MB

Index Sizes:
• employee_id_idx: ~2 MB
• nic_number_idx: ~2 MB
• status_idx: ~1 MB
• name_idx: ~3 MB
• Composite indexes: ~4 MB
• Total indexes: ~12 MB

Total Database Size:
• Table: 25 MB
• Indexes: 12 MB
• Total: 37 MB

Trade-off:
• Storage cost: +48% (indexes)
• Query speed: +500-1000% (significant improvement)
• Conclusion: Worth the storage cost
```

### Index Maintenance

```
Index Lifecycle
══════════════

Creation (Migration):
• Indexes created during migration
• Initial build time: 1-5 seconds per index
• Background process for large tables

Automatic Updates:
• Indexes updated on INSERT
• Indexes updated on UPDATE (if indexed field changes)
• Indexes updated on DELETE
• Minimal performance impact

Periodic Maintenance:
• Database auto-vacuum: Weekly
• Index statistics update: Daily
• Reindex if corruption: Rare
• Monitor index usage: Monthly
```

### Expected Outcome
- Optimized database queries
- Fast employee lookups
- Efficient filtering and sorting
- Tenant-specific query optimization
- Proper unique constraints

### Verification Checklist
- [ ] Meta class updated with indexes
- [ ] employee_id index added
- [ ] nic_number index added
- [ ] status index added
- [ ] name composite index added
- [ ] tenant-status composite index added
- [ ] tenant-active composite index added
- [ ] dob index added
- [ ] user index added
- [ ] unique_together constraints added
- [ ] Index names specified
- [ ] Performance tested

---

## Task 18: Run Initial Employee Migrations

### Overview
Generate and apply Django migrations to create the Employee model and all related database tables, indexes, and constraints in the database. This task finalizes the Employee model implementation by translating the model definition into actual database schema.

### Dependencies
- All previous tasks (01-17) completed
- PostgreSQL database configured
- Django migrations system working
- Multi-tenancy properly configured

### Instructions

1. **Verify model completeness**
   - Review Employee model
   - Ensure all fields defined
   - Verify all indexes specified
   - Check all constraints configured

2. **Generate migration file**
   - Run makemigrations command
   - Specify employees app
   - Review generated migration file
   - Verify operations correct

3. **Review migration operations**
   - Check CreateModel operation
   - Verify all fields included
   - Confirm indexes created
   - Validate constraints added

4. **Apply migration to public schema**
   - Run migrate command for public schema
   - Verify migration applied successfully
   - Check no errors occurred

5. **Apply migration to tenant schemas**
   - Migrate each tenant schema
   - Verify tables created in tenant schemas
   - Confirm indexes exist
   - Check constraints active

6. **Verify database schema**
   - Connect to database
   - Inspect employees_employee table
   - Verify column types correct
   - Confirm indexes created
   - Validate constraints enforced

7. **Test model operations**
   - Create test employee record
   - Save to database
   - Query employee
   - Update employee
   - Delete employee

8. **Document migration**
   - Note migration number
   - Document any issues
   - Record rollback procedure if needed

### Migration Generation Process

```
Django Migration Workflow
════════════════════════

1. Model Changes Detected
         │
         ▼
2. Run makemigrations
   $ python manage.py makemigrations employees
         │
         ▼
3. Migration File Generated
   File: 0001_initial.py
   Location: employees/migrations/
         │
         ▼
4. Review Migration
   └─ Check operations
   └─ Verify fields
   └─ Confirm indexes
         │
         ▼
5. Apply Migration
   $ python manage.py migrate employees
         │
         ▼
6. Database Schema Updated
   ├─ Tables created
   ├─ Indexes added
   └─ Constraints enforced
```

### Generated Migration Structure

```
Migration File: 0001_initial.py
══════════════════════════════

operations = [
    migrations.CreateModel(
        name='Employee',
        fields=[
            ('id', models.BigAutoField(primary_key=True)),
            ('employee_id', models.CharField(max_length=20, unique=True)),
            ('first_name', models.CharField(max_length=100)),
            ('last_name', models.CharField(max_length=100)),
            ('middle_name', models.CharField(max_length=100, null=True)),
            ('preferred_name', models.CharField(max_length=100, null=True)),
            ('nic_number', models.CharField(max_length=12)),
            ('date_of_birth', models.DateField()),
            ('gender', models.CharField(max_length=20, null=True)),
            ('marital_status', models.CharField(max_length=20, null=True)),
            ('spouse_name', models.CharField(max_length=200, null=True)),
            ('marriage_date', models.DateField(null=True)),
            ('profile_photo', models.ImageField(upload_to='...', null=True)),
            ('employment_type', models.CharField(max_length=20)),
            ('status', models.CharField(max_length=20)),
            ('is_active', models.BooleanField(default=True)),
            ('notes', models.TextField(null=True)),
            ('user', models.OneToOneField(to='auth.User', null=True)),
            ('tenant', models.ForeignKey(to='tenants.Tenant')),
            ('created_at', models.DateTimeField(auto_now_add=True)),
            ('updated_at', models.DateTimeField(auto_now=True)),
        ],
    ),
    migrations.AddIndex(
        model_name='employee',
        index=models.Index(fields=['employee_id'], name='employee_id_idx'),
    ),
    migrations.AddIndex(
        model_name='employee',
        index=models.Index(fields=['nic_number'], name='nic_number_idx'),
    ),
    # ... more indexes ...
    migrations.AlterUniqueTogether(
        name='employee',
        unique_together={('tenant', 'employee_id'), ('tenant', 'nic_number')},
    ),
]
```

### Database Schema Created

```
Table: employees_employee
════════════════════════

Columns:
┌─────────────────┬──────────────┬──────────┬─────────┐
│ Column Name     │ Type         │ Nullable │ Default │
├─────────────────┼──────────────┼──────────┼─────────┤
│ id              │ BIGSERIAL    │ NO       │ AUTO    │
│ employee_id     │ VARCHAR(20)  │ NO       │ -       │
│ first_name      │ VARCHAR(100) │ NO       │ -       │
│ last_name       │ VARCHAR(100) │ NO       │ -       │
│ middle_name     │ VARCHAR(100) │ YES      │ NULL    │
│ preferred_name  │ VARCHAR(100) │ YES      │ NULL    │
│ nic_number      │ VARCHAR(12)  │ NO       │ -       │
│ date_of_birth   │ DATE         │ NO       │ -       │
│ gender          │ VARCHAR(20)  │ YES      │ NULL    │
│ marital_status  │ VARCHAR(20)  │ YES      │ NULL    │
│ spouse_name     │ VARCHAR(200) │ YES      │ NULL    │
│ marriage_date   │ DATE         │ YES      │ NULL    │
│ profile_photo   │ VARCHAR(100) │ YES      │ NULL    │
│ employment_type │ VARCHAR(20)  │ NO       │ -       │
│ status          │ VARCHAR(20)  │ NO       │ 'active'│
│ is_active       │ BOOLEAN      │ NO       │ TRUE    │
│ notes           │ TEXT         │ YES      │ NULL    │
│ user_id         │ BIGINT       │ YES      │ NULL    │
│ tenant_id       │ BIGINT       │ NO       │ -       │
│ created_at      │ TIMESTAMP    │ NO       │ NOW()   │
│ updated_at      │ TIMESTAMP    │ NO       │ NOW()   │
└─────────────────┴──────────────┴──────────┴─────────┘

Indexes:
• PRIMARY KEY (id)
• UNIQUE (employee_id)
• employee_id_idx (employee_id)
• nic_number_idx (nic_number)
• status_idx (status)
• name_idx (last_name, first_name)
• tenant_status_idx (tenant_id, status)
• tenant_active_idx (tenant_id, is_active)
• dob_idx (date_of_birth)
• user_idx (user_id)

Constraints:
• UNIQUE (tenant_id, employee_id)
• UNIQUE (tenant_id, nic_number)
• FOREIGN KEY (tenant_id) REFERENCES tenants_tenant(id)
• FOREIGN KEY (user_id) REFERENCES auth_user(id)
```

### Multi-Tenant Schema Creation

```
Tenant Schema Migration
══════════════════════

Public Schema:
• Migration tracking table updated
• Shared models migrated (if any)

Tenant Schema 1: "tenant_1"
├─ employees_employee table created
├─ All indexes created
└─ All constraints enforced

Tenant Schema 2: "tenant_2"
├─ employees_employee table created
├─ All indexes created
└─ All constraints enforced

Each tenant has isolated employee data:
┌──────────────┐   ┌──────────────┐
│  Tenant 1    │   │  Tenant 2    │
│  Schema      │   │  Schema      │
├──────────────┤   ├──────────────┤
│ employees_   │   │ employees_   │
│  employee    │   │  employee    │
│  (isolated)  │   │  (isolated)  │
└──────────────┘   └──────────────┘
```

### Migration Verification

```
Post-Migration Checks
════════════════════

✓ Table Existence:
  SELECT table_name 
  FROM information_schema.tables 
  WHERE table_name = 'employees_employee';
  Result: employees_employee exists

✓ Column Count:
  SELECT COUNT(*) 
  FROM information_schema.columns 
  WHERE table_name = 'employees_employee';
  Expected: 21 columns

✓ Indexes Exist:
  SELECT indexname 
  FROM pg_indexes 
  WHERE tablename = 'employees_employee';
  Expected: 10+ indexes

✓ Constraints Active:
  SELECT constraint_name 
  FROM information_schema.table_constraints 
  WHERE table_name = 'employees_employee';
  Expected: UNIQUE, FOREIGN KEY constraints

✓ Test Insert:
  INSERT INTO employees_employee (...)
  VALUES (...);
  Result: Success (ID auto-generated)

✓ Test Query:
  SELECT * FROM employees_employee LIMIT 1;
  Result: Success (structure correct)
```

### Rollback Procedure

```
Migration Rollback
════════════════

If migration fails or needs reversal:

1. Identify Migration:
   Migration: 0001_initial

2. Rollback Command:
   $ python manage.py migrate employees zero

3. Effects:
   ├─ employees_employee table dropped
   ├─ All indexes removed
   ├─ All constraints removed
   └─ Migration marked as unapplied

4. Fix Issues:
   └─ Correct model definition
   └─ Regenerate migration

5. Reapply:
   $ python manage.py migrate employees

Caution:
⚠️  Rollback deletes all employee data
⚠️  Use only in development
⚠️  Backup production data before rollback
```

### Expected Outcome
- Database schema created
- All tables exist
- Indexes functional
- Constraints enforced
- Multi-tenant isolation working
- Ready for employee data

### Verification Checklist
- [ ] Model completeness verified
- [ ] Migration file generated (0001_initial.py)
- [ ] Migration operations reviewed
- [ ] Migration applied to public schema
- [ ] Migration applied to tenant schemas
- [ ] Database schema verified
- [ ] Columns match model fields
- [ ] Indexes created correctly
- [ ] Constraints active
- [ ] Test employee created successfully
- [ ] Test query successful
- [ ] Migration documented

---

## Summary

This document completed the Employee model foundation with demographic fields, automation, and database setup:

### Completed Infrastructure
- ✅ Date of birth field with age calculation and retirement tracking
- ✅ Gender field with auto-population from NIC and privacy options
- ✅ Marital status field with spouse information and benefits integration
- ✅ Automatic employee ID generator with collision handling
- ✅ Database indexes for query optimization
- ✅ Initial migrations creating database schema

### Key Achievements
1. **Demographic Data** - DOB, gender, marital status for HR operations
2. **Computed Properties** - Age, retirement date, spouse status automatically calculated
3. **ID Automation** - Sequential employee IDs with custom prefix support
4. **Query Optimization** - Strategic indexes for fast lookups and filtering
5. **Database Schema** - Complete schema with constraints and isolation
6. **Multi-Tenant Ready** - Schema created in each tenant for data isolation

### Employee Model Complete
The Employee model now includes:
- Core identification (employee_id, NIC)
- Personal details (name, DOB, gender, marital status)
- System access (optional user link)
- Visual identity (profile photo)
- Employment details (type, status)
- Audit trail (timestamps)
- Database optimization (indexes)

### Next Steps
Proceed to **Group B: Personal & Contact Details** to add address fields, contact information, emergency contacts, and communication preferences to complete the employee's personal information profile.

---

**Document Status:** ✅ Complete  
**Total Tasks:** 6  
**Group A Total:** 18 tasks across 3 documents  
**Estimated Implementation Time:** 1 hour 50 minutes
