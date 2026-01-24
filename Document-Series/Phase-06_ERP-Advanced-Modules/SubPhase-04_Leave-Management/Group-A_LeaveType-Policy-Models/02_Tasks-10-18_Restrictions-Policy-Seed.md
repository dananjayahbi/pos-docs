# Tasks 10-18: Restrictions, LeavePolicy Model & Seed Data

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 04 - Leave Management  
> **Group:** A - Leave Type & Policy Models  
> **Document:** 02 of 02  
> **Tasks Covered:** 10, 11, 12, 13, 14, 15, 16, 17, 18

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-01-09_App-LeaveType-Core.md](01_Tasks-01-09_App-LeaveType-Core.md)

---

## Document Overview

This document covers additional LeaveType model restrictions, the LeavePolicy model for policy-based entitlement management, database migrations, and seeding default Sri Lankan leave types. These elements complete the foundational leave management infrastructure.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 10 | Add Gender Restriction | Medium | 20 min |
| 11 | Add Min Service Requirement | Low | 15 min |
| 12 | Add Advance Notice Days | Low | 15 min |
| 13 | Run LeaveType Migrations | Low | 15 min |
| 14 | Create LeavePolicy Model | Medium | 25 min |
| 15 | Add Policy Scope Fields | Medium | 20 min |
| 16 | Add Policy Date Range | Low | 15 min |
| 17 | Run LeavePolicy Migrations | Low | 15 min |
| 18 | Create Default Leave Types Seed | Medium | 25 min |

---

## Task 10: Add Gender Restriction

### Overview
Add gender restriction functionality to the LeaveType model to enforce leave types that are gender-specific, such as maternity leave (female only) and paternity leave (male only). This ensures compliance with Sri Lankan labor laws and prevents inappropriate leave applications.

### Dependencies
- Task 09: Add Document Required Flag
- Employee model has gender field

### Instructions

1. **Define gender choices constant**
   - Open `constants.py` file
   - Create GenderRestriction TextChoices class
   - Define ALL, MALE, FEMALE options

2. **Open leave_type.py model file**
   - Navigate to `backend/apps/leave/models/leave_type.py`
   - Import GenderRestriction from constants

3. **Add applicable_gender field**
   - CharField with GenderRestriction choices
   - Default to GenderRestriction.ALL
   - Required field (no null)
   - Determines which gender can apply

4. **Add field validation**
   - Update clean method
   - Validate gender consistency with category
   - MATERNITY must be FEMALE only
   - PATERNITY must be MALE only
   - Raise ValidationError if inconsistent

5. **Add help text**
   - Explain gender restriction purpose
   - Note legal compliance requirements
   - Provide category examples

6. **Update model docstring**
   - Document applicable_gender field
   - Explain gender-specific leave types
   - Note application filtering logic

### GenderRestriction Choices Structure

```python
class GenderRestriction(models.TextChoices):
    """
    Gender restrictions for leave types
    """
    ALL = 'ALL', 'All Genders'
    MALE = 'MALE', 'Male Only'
    FEMALE = 'FEMALE', 'Female Only'
```

### Gender Restriction by Category

| Category | applicable_gender | Legal Basis | Enforcement |
|----------|------------------|-------------|-------------|
| ANNUAL | ALL | Applies to all | No restriction |
| CASUAL | ALL | Applies to all | No restriction |
| SICK | ALL | Applies to all | No restriction |
| MATERNITY | FEMALE | Maternity Benefits Ordinance | Strict - Female only |
| PATERNITY | MALE | Paternity Leave Act | Strict - Male only |
| NO_PAY | ALL | Applies to all | No restriction |
| OTHER | Varies | Company policy | Configurable |

### Validation Rules

```
Gender Validation Logic
════════════════════════════════════════════════════════

Rule 1: Maternity Leave Validation
if category == LeaveTypeCategory.MATERNITY:
    if applicable_gender != GenderRestriction.FEMALE:
        raise ValidationError(
            "Maternity leave must be restricted to Female only "
            "(legal requirement)"
        )

Rule 2: Paternity Leave Validation
if category == LeaveTypeCategory.PATERNITY:
    if applicable_gender != GenderRestriction.MALE:
        raise ValidationError(
            "Paternity leave must be restricted to Male only "
            "(legal requirement)"
        )

Rule 3: Other Categories
if category in [ANNUAL, CASUAL, SICK, NO_PAY]:
    # Typically ALL, but company can restrict if needed
    # No validation error, just recommendation
    pass
```

### Application Filtering Logic

```
┌──────────────────────────────────────────────────────────────┐
│         Leave Application Form Filtering by Gender           │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  Employee: Priya (Female)                                    │
│  ────────────────────────────────────────────────────────   │
│  Available Leave Types:                                      │
│  ✅ Annual Leave (ALL)                                       │
│  ✅ Casual Leave (ALL)                                       │
│  ✅ Sick Leave (ALL)                                         │
│  ✅ Maternity Leave (FEMALE) ← Shown for female             │
│  ❌ Paternity Leave (MALE) ← Hidden from female              │
│  ✅ No-Pay Leave (ALL)                                       │
│                                                              │
│  Employee: Rohan (Male)                                      │
│  ────────────────────────────────────────────────────────   │
│  Available Leave Types:                                      │
│  ✅ Annual Leave (ALL)                                       │
│  ✅ Casual Leave (ALL)                                       │
│  ✅ Sick Leave (ALL)                                         │
│  ❌ Maternity Leave (FEMALE) ← Hidden from male              │
│  ✅ Paternity Leave (MALE) ← Shown for male                 │
│  ✅ No-Pay Leave (ALL)                                       │
│                                                              │
└──────────────────────────────────────────────────────────────┘

Filtering Query Example:
available_leave_types = LeaveType.objects.filter(
    tenant=current_tenant,
    is_active=True
).filter(
    Q(applicable_gender=GenderRestriction.ALL) |
    Q(applicable_gender=employee.gender)
)
```

### Maternity Leave - Female Only

```
Maternity Leave Legal Requirements (Sri Lanka)
════════════════════════════════════════════════════════

Eligibility:
• All female employees
• Regardless of marital status
• Regardless of contract type (permanent/contract)
• No minimum service requirement

Entitlement:
• 84 days (12 weeks) paid leave
• Cannot be denied
• Cannot be reduced
• Cannot be conditional

Timing:
• Can commence before delivery
• Minimum post-delivery rest period
• Medical advice determines timing

Protection:
• Job security guaranteed
• Cannot be terminated during leave
• Cannot be penalized for taking leave
• Must return to same/equivalent position

Employer Obligations:
• Pay full salary during leave
• Continue EPF/ETF contributions
• Maintain all employment benefits
• Provide nursing breaks after return

Gender Restriction Enforcement:
• System must prevent male employees from applying
• UI should hide maternity leave option for males
• API should reject applications from males
• Database constraint via applicable_gender field
```

### Paternity Leave - Male Only

```
Paternity Leave Legal Requirements (Sri Lanka)
════════════════════════════════════════════════════════

Eligibility:
• All male employees
• Biological or adoptive father
• Regardless of contract type

Entitlement:
• 3 working days paid leave
• Cannot be denied
• Must be taken within 4 weeks of birth

Timing:
• Can be taken consecutively or separately
• Within 4 weeks of child's birth
• Flexible scheduling with employer approval

Documentation:
• Birth certificate required
• Must show employee as father
• Hospital documentation acceptable initially

Protection:
• Cannot be denied by employer
• Cannot affect employment status
• Full pay during leave period

Gender Restriction Enforcement:
• System must prevent female employees from applying
• UI should hide paternity leave option for females
• API should reject applications from females
• Database constraint via applicable_gender field
```

### Custom Gender-Restricted Leave Types

```
Company-Specific Gender-Restricted Leave Examples
════════════════════════════════════════════════════════

1. Nursing Breaks (Female)
────────────────────────────────────────────────────────
Purpose: Breastfeeding breaks for working mothers
Restriction: Female only
Duration: 30 minutes twice per day (up to 6 months)
Legal Basis: Sri Lankan labor law
Configuration:
• applicable_gender: FEMALE
• category: OTHER

2. Menstrual Leave (Female)
────────────────────────────────────────────────────────
Purpose: Monthly menstrual discomfort
Restriction: Female only
Duration: 1-2 days per month
Trend: Some progressive companies offer
Configuration:
• applicable_gender: FEMALE
• category: OTHER

Note: While not legally mandated in Sri Lanka, some
companies offer this as employee benefit.

3. Military Leave (Historically Male)
────────────────────────────────────────────────────────
Purpose: Compulsory military service
Restriction: Varies by country (if applicable)
Not common in Sri Lanka
Configuration:
• applicable_gender: Based on military service laws
• category: OTHER
```

### Gender Field in Employee Model

```
Employee Model Gender Field (Reference)
════════════════════════════════════════════════════════

class Employee(models.Model):
    """
    Employee model should include gender field
    """
    gender = models.CharField(
        max_length=10,
        choices=[
            ('MALE', 'Male'),
            ('FEMALE', 'Female'),
            ('OTHER', 'Other'),
            ('PREFER_NOT_TO_SAY', 'Prefer not to say')
        ]
    )
    
Note: Leave system primarily uses MALE/FEMALE for
legal leave types. OTHER and PREFER_NOT_TO_SAY should
have access to ALL gender leave types only.

Gender Mapping for Leave:
• Employee.gender = 'MALE' → Can apply MALE or ALL leaves
• Employee.gender = 'FEMALE' → Can apply FEMALE or ALL leaves
• Employee.gender = 'OTHER' → Can apply ALL leaves only
• Employee.gender = 'PREFER_NOT_TO_SAY' → Can apply ALL leaves only
```

### Error Messages and User Feedback

```
User-Friendly Error Messages
════════════════════════════════════════════════════════

Scenario 1: Male attempting Maternity Leave
────────────────────────────────────────────────────────
Error Message:
"Maternity Leave is available for female employees only.
If you need leave for childbirth support, please apply
for Paternity Leave (3 days)."

Scenario 2: Female attempting Paternity Leave
────────────────────────────────────────────────────────
Error Message:
"Paternity Leave is available for male employees only.
If you are expecting a child, please apply for
Maternity Leave (84 days)."

Scenario 3: Non-binary attempting gender-specific leave
────────────────────────────────────────────────────────
Error Message:
"This leave type has gender restrictions. Please contact
HR to discuss alternative leave options that suit your
circumstances."

Best Practice:
• Prevent application attempt via UI (hide option)
• Show helpful guidance if attempted via API
• Direct to appropriate alternative
• Maintain respect and privacy
```

### Expected Outcome
- Gender restriction enforcement
- Legal compliance for maternity/paternity
- Appropriate leave type filtering
- User-friendly application flow

### Verification Checklist
- [ ] GenderRestriction choices defined in constants.py
- [ ] applicable_gender field added to LeaveType
- [ ] Default set to GenderRestriction.ALL
- [ ] Validation: MATERNITY must be FEMALE
- [ ] Validation: PATERNITY must be MALE
- [ ] Help text explains restrictions
- [ ] Model docstring updated
- [ ] Application filtering logic documented

---

## Task 11: Add Min Service Requirement

### Overview
Add minimum service requirement field to the LeaveType model. This field specifies the minimum months of service an employee must complete before becoming eligible for the leave type, supporting probation periods and service-based entitlements common in Sri Lankan employment practices.

### Dependencies
- Task 10: Add Gender Restriction

### Instructions

1. **Open leave_type.py model file**
   - Continue in `backend/apps/leave/models/leave_type.py`
   - Locate LeaveType model class

2. **Add min_service_months field**
   - PositiveIntegerField type
   - Default to 0 (immediate eligibility)
   - Optional but recommended for annual leave
   - Represents months of continuous service required

3. **Add field validation**
   - Update clean method
   - Validate reasonable range (0-24 months typical)
   - Check category-specific requirements
   - Annual leave: Often 12 months in Sri Lanka
   - Maternity: No service requirement (legal)

4. **Add help text**
   - Explain service requirement purpose
   - Note Sri Lankan legal minimums
   - Provide category examples
   - Explain probation period context

5. **Update model docstring**
   - Document min_service_months field
   - Explain eligibility calculation
   - Note legal compliance requirements

### min_service_months Field Structure

```
┌─────────────────────────────────────────────────────────────┐
│            min_service_months Field Details                  │
├─────────────────────────────────────────────────────────────┤
│ Field Properties:                                            │
│  • Type: PositiveIntegerField                                │
│  • Default: 0 (immediate eligibility)                        │
│  • Range: 0-24 months (typical)                              │
│  • Purpose: Service-based eligibility                        │
│                                                              │
│ Usage:                                                       │
│  • Calculate employee eligibility                            │
│  • Filter available leave types                              │
│  • Enforce probation restrictions                            │
│  • Comply with legal requirements                            │
│                                                              │
│ Calculation:                                                 │
│  months_of_service = (current_date - join_date) / 30.44      │
│  eligible = months_of_service >= min_service_months          │
└─────────────────────────────────────────────────────────────┘
```

### Service Requirements by Category

| Category | min_service_months | Legal Requirement | Typical Practice |
|----------|-------------------|------------------|------------------|
| ANNUAL | 12 | Yes (Shop & Office Act) | 12 months |
| CASUAL | 0 | No | Immediate or 3 months |
| SICK | 0 | No | Immediate |
| MATERNITY | 0 | No (Cannot restrict) | Immediate |
| PATERNITY | 0 | No (Cannot restrict) | Immediate |
| NO_PAY | 6 | No | 6 months (probation complete) |
| OTHER | Varies | Company policy | Varies |

### Sri Lankan Legal Requirements

```
Annual Leave Service Requirement (Legal)
════════════════════════════════════════════════════════

Shop & Office Employees Act No. 15 of 1954:
────────────────────────────────────────────────────────
Section: Annual Leave Entitlement

Requirement:
"Every employee shall be entitled to annual leave with
pay after completing 12 months of continuous service."

Key Points:
• 12 months continuous service required
• Service must be uninterrupted
• Pro-rata calculation in first year
• Entitlement starts after 12 months

Example:
Join Date: January 1, 2026
Eligible From: January 1, 2027 (after 12 months)
First Year: No annual leave entitlement
Second Year Onwards: 14 days per year

Exception:
• Some companies grant pro-rated annual leave before 12 months
• Company policy can be more generous
• Cannot be less than legal minimum
```

### Eligibility Calculation

```
Service Month Calculation Examples
════════════════════════════════════════════════════════

Employee: Priya
Join Date: March 15, 2026
Current Date: December 10, 2026

Months Calculation:
Days of Service: Dec 10 - Mar 15 = 270 days
Months of Service: 270 / 30.44 = 8.87 months

Leave Type: Annual Leave (min_service_months = 12)
Eligible: No (8.87 < 12)
Message: "Eligible from March 15, 2027"

Leave Type: Casual Leave (min_service_months = 0)
Eligible: Yes (8.87 >= 0)

Leave Type: Sick Leave (min_service_months = 0)
Eligible: Yes (8.87 >= 0)

────────────────────────────────────────────────────────

Employee: Rohan
Join Date: January 1, 2025
Current Date: December 10, 2026

Months Calculation:
Days of Service: 709 days
Months of Service: 709 / 30.44 = 23.29 months

Leave Type: Annual Leave (min_service_months = 12)
Eligible: Yes (23.29 >= 12) ✅

All Leave Types: Eligible ✅
```

### Probation Period Considerations

```
Typical Probation Period: 3-6 months
════════════════════════════════════════════════════════

Leave Eligibility During Probation:
────────────────────────────────────────────────────────

Month 0-3 (Probation):
• Sick Leave: ✅ Available (immediate)
• Casual Leave: ❌ Not available (min 3 months)
• Annual Leave: ❌ Not available (min 12 months)
• Maternity: ✅ Available (legal right)
• Paternity: ✅ Available (legal right)
• No-Pay Leave: ❌ Not available (min 6 months)

Month 3-6 (Probation completing):
• Sick Leave: ✅ Available
• Casual Leave: ✅ Available (after 3 months)
• Annual Leave: ❌ Not available (min 12 months)
• Maternity: ✅ Available
• Paternity: ✅ Available
• No-Pay Leave: ❌ Not available (min 6 months)

Month 6-12 (Confirmed):
• Sick Leave: ✅ Available
• Casual Leave: ✅ Available
• Annual Leave: ❌ Not available (min 12 months)
• Maternity: ✅ Available
• Paternity: ✅ Available
• No-Pay Leave: ✅ Available (after 6 months)

Month 12+ (Full entitlement):
• All Leave Types: ✅ Available

Configuration:
LeaveType(name="Casual Leave", min_service_months=3)
LeaveType(name="Annual Leave", min_service_months=12)
LeaveType(name="No-Pay Leave", min_service_months=6)
```

### Application Filtering by Service

```
┌──────────────────────────────────────────────────────────────┐
│      Leave Type Availability Based on Service Period         │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  Employee: Kamal (Joined: June 1, 2026)                     │
│  Current Date: September 15, 2026                            │
│  Service: 3.5 months                                         │
│                                                              │
│  Available Leave Types:                                      │
│  ────────────────────────────────────────────────────────   │
│  ✅ Sick Leave                                               │
│     min_service_months: 0                                    │
│     Status: Eligible immediately                             │
│                                                              │
│  ✅ Casual Leave                                             │
│     min_service_months: 3                                    │
│     Status: Eligible (3.5 >= 3)                              │
│                                                              │
│  ❌ Annual Leave                                             │
│     min_service_months: 12                                   │
│     Status: Not eligible                                     │
│     Eligible from: June 1, 2027                              │
│     Remaining: 8.5 months                                    │
│                                                              │
│  ❌ No-Pay Leave                                             │
│     min_service_months: 6                                    │
│     Status: Not eligible                                     │
│     Eligible from: December 1, 2026                          │
│     Remaining: 2.5 months                                    │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### Validation Rules

```
min_service_months Validation Logic
════════════════════════════════════════════════════════

1. Range Validation:
   • Must be >= 0
   • Must be <= 24 (beyond 24 months is unusual)
   • Warn if > 12 and category is ANNUAL

2. Category-Specific Validation:
   
   ANNUAL:
   • Minimum should be 12 (legal requirement)
   • Warn if < 12 (below legal minimum)
   • Can be exactly 12 or higher
   
   MATERNITY/PATERNITY:
   • Must be 0 (legal requirement)
   • Error if > 0 (violates labor law)
   
   CASUAL:
   • Typically 0-3 months
   • Often tied to probation period
   
   SICK:
   • Typically 0 (immediate access)
   • Medical needs cannot wait
   
   NO_PAY:
   • Often 3-6 months
   • After probation completion

3. Business Logic:
   • If min_service_months > 0, document rationale
   • Ensure alignment with employment contract
   • Check consistency with probation period
```

### Error Messages for Ineligible Applications

```
User-Friendly Eligibility Messages
════════════════════════════════════════════════════════

Scenario 1: Annual Leave before 12 months
────────────────────────────────────────────────────────
Message:
"You are not yet eligible for Annual Leave.

Your service period: 8 months
Required service: 12 months
Eligible from: March 15, 2027 (in 4 months)

Note: Annual leave entitlement requires completing
12 months of continuous service as per Sri Lankan
labor law.

Alternative: You can use Casual Leave or Sick Leave
for immediate leave needs."

Scenario 2: No-Pay Leave during probation
────────────────────────────────────────────────────────
Message:
"You are not yet eligible for No-Pay Leave.

Your service period: 2 months
Required service: 6 months
Eligible from: July 1, 2026 (in 4 months)

Note: No-Pay Leave is available after completing
probation period (6 months).

Alternative: For urgent leave needs, please discuss
with your supervisor or HR."

Scenario 3: Past eligibility date
────────────────────────────────────────────────────────
Message:
"Congratulations! You are now eligible for Annual Leave.

Your service period: 13 months
Required service: 12 months
Eligible since: January 1, 2027

Your current balance: 14 days
You can now apply for annual leave."
```

### Pro-Rata Entitlement Calculation

```
Pro-Rata Annual Leave (First Year)
════════════════════════════════════════════════════════

Standard Entitlement: 14 days per year
Minimum Service: 12 months

Option 1: No Leave Until 12 Months (Strict Legal)
────────────────────────────────────────────────────────
Join Date: March 15, 2026
Eligible From: March 15, 2027
First 12 Months: 0 days
After 12 Months: 14 days for next year

Option 2: Pro-Rata After 12 Months (Common Practice)
────────────────────────────────────────────────────────
Join Date: March 15, 2026
Eligible From: March 15, 2027
Pro-Rata Calculation:
• Service period: Mar 15, 2026 - Dec 31, 2026 = 9.5 months
• Pro-rata days: (14 / 12) × 9.5 = 11.08 ≈ 11 days
• Available: 11 days for remainder of 2027

Option 3: Generous Immediate Pro-Rata (Company Policy)
────────────────────────────────────────────────────────
Join Date: March 15, 2026
Eligible From: Immediate (company policy)
Pro-Rata Calculation:
• Remaining 2026: (14 / 12) × 9.5 = 11 days
• Used immediately despite min_service_months

Note: min_service_months controls eligibility date,
but pro-rata can still apply after eligibility.
```

### Expected Outcome
- Service-based eligibility enforcement
- Legal compliance for annual leave
- Probation period support
- Clear eligibility messaging

### Verification Checklist
- [ ] min_service_months field added
- [ ] Field type is PositiveIntegerField
- [ ] Default set to 0 (immediate)
- [ ] Range validation (0-24 months)
- [ ] ANNUAL leave minimum 12 months recommended
- [ ] MATERNITY/PATERNITY must be 0 (validation)
- [ ] Help text explains service requirement
- [ ] Eligibility calculation documented
- [ ] Model docstring updated

---

## Task 12: Add Advance Notice Days

### Overview
Add minimum advance notice requirement field to the LeaveType model. This field specifies the minimum number of days notice required before the leave start date, enabling proper planning and approval workflows while balancing employee needs with business continuity.

### Dependencies
- Task 11: Add Min Service Requirement

### Instructions

1. **Open leave_type.py model file**
   - Continue in `backend/apps/leave/models/leave_type.py`
   - Locate LeaveType model class

2. **Add min_notice_days field**
   - PositiveIntegerField type
   - Default to 0 (no advance notice)
   - Optional, varies by leave type
   - Represents minimum days before leave start

3. **Add field validation**
   - Update clean method
   - Validate reasonable range (0-90 days typical)
   - Check category-specific requirements
   - Annual leave: Often 14 days notice
   - Sick leave: 0 days (emergency)

4. **Add help text**
   - Explain notice requirement purpose
   - Note approval workflow impact
   - Provide category examples
   - Explain emergency exceptions

5. **Update model docstring**
   - Document min_notice_days field
   - Explain notice calculation
   - Note business continuity purpose

### min_notice_days Field Structure

```
┌─────────────────────────────────────────────────────────────┐
│              min_notice_days Field Details                   │
├─────────────────────────────────────────────────────────────┤
│ Field Properties:                                            │
│  • Type: PositiveIntegerField                                │
│  • Default: 0 (no advance notice)                            │
│  • Range: 0-90 days (typical)                                │
│  • Purpose: Advance planning requirement                     │
│                                                              │
│ Usage:                                                       │
│  • Validate application timing                               │
│  • Enforce planning discipline                               │
│  • Support approval workflow                                 │
│  • Balance employee needs with business continuity           │
│                                                              │
│ Calculation:                                                 │
│  notice_days = leave_start_date - application_date           │
│  valid = notice_days >= min_notice_days                      │
│                                                              │
│ Emergency Override:                                          │
│  • Manager can approve with less notice                      │
│  • System logs exception                                     │
│  • Requires justification                                    │
└─────────────────────────────────────────────────────────────┘
```

### Notice Requirements by Category

| Category | min_notice_days | Rationale | Emergency Override |
|----------|----------------|-----------|-------------------|
| ANNUAL | 14 | Planning coverage, project continuity | Rarely allowed |
| CASUAL | 1-2 | Short notice for personal matters | Often allowed |
| SICK | 0 | Medical emergency, cannot predict | Always allowed |
| MATERNITY | 14-30 | Planning replacement, work handover | Rarely needed |
| PATERNITY | 7 | Birth timing can vary | Often allowed |
| NO_PAY | 30 | Extended absence requires planning | Depends on duration |
| OTHER | Varies | Depends on leave type purpose | Varies |

### Notice Calculation Examples

```
Application Date vs Leave Start Date
════════════════════════════════════════════════════════

Example 1: Annual Leave - Valid Notice
────────────────────────────────────────────────────────
Application Date: December 1, 2026
Leave Start Date: December 20, 2026
Notice Days: 20 - 1 = 19 days
min_notice_days: 14
Status: Valid ✅ (19 >= 14)

Example 2: Annual Leave - Insufficient Notice
────────────────────────────────────────────────────────
Application Date: December 12, 2026
Leave Start Date: December 20, 2026
Notice Days: 20 - 12 = 8 days
min_notice_days: 14
Status: Invalid ❌ (8 < 14)
Message: "Annual Leave requires 14 days advance notice.
Please apply at least 6 more days in advance, or 
request manager override for urgent leave."

Example 3: Casual Leave - Same Day Application
────────────────────────────────────────────────────────
Application Date: December 10, 2026
Leave Start Date: December 11, 2026
Notice Days: 11 - 10 = 1 day
min_notice_days: 1
Status: Valid ✅ (1 >= 1)

Example 4: Sick Leave - Emergency
────────────────────────────────────────────────────────
Application Date: December 10, 2026
Leave Start Date: December 10, 2026 (same day)
Notice Days: 0 days
min_notice_days: 0
Status: Valid ✅ (emergency medical leave)

Example 5: No-Pay Leave - Extended Planning
────────────────────────────────────────────────────────
Application Date: December 1, 2026
Leave Start Date: January 15, 2027
Notice Days: 45 days
min_notice_days: 30
Status: Valid ✅ (45 >= 30)
```

### Business Continuity Rationale

```
Why Advance Notice Requirements Matter
════════════════════════════════════════════════════════

Annual Leave (14 days notice):
────────────────────────────────────────────────────────
Business Needs:
• Arrange coverage for employee's duties
• Reassign critical tasks
• Brief colleagues on ongoing projects
• Plan department workload
• Adjust schedules and shifts

Example:
Employee: Priya (Sales Manager)
Leave: December 20-31 (12 days)
Notice: December 1 (19 days advance)

Actions Taken:
• Brief Assistant Manager on pending deals
• Delegate client meetings
• Complete critical reports before leave
• Set up auto-responders
• Arrange emergency contact protocol

Result: Smooth transition, minimal disruption

────────────────────────────────────────────────────────

Maternity Leave (30 days notice):
────────────────────────────────────────────────────────
Business Needs:
• Hire or assign temporary replacement
• Complete knowledge transfer
• Document processes and procedures
• Train replacement employee
• Plan for 84-day absence

Example:
Employee: Nisha (Accountant)
Expected Delivery: January 15, 2027
Leave Start: January 1, 2027
Notice: December 1, 2026 (30 days)

Actions Taken:
• Post temporary position
• Interview and select replacement
• 2-week knowledge transfer period
• Document all accounting procedures
• Introduce replacement to team and vendors

Result: Minimal disruption to accounting operations

────────────────────────────────────────────────────────

No-Pay Leave (30 days notice):
────────────────────────────────────────────────────────
Business Needs:
• Assess impact on operations
• Decide whether to approve
• Plan for extended absence
• Consider temporary hiring
• Adjust project timelines

Example:
Employee: Rohan (IT Support)
Leave: February 1 - March 31, 2027 (2 months)
Purpose: Further education overseas
Notice: January 1, 2027 (30 days)

Actions Taken:
• Evaluate IT support coverage
• Consider hiring temporary IT support
• Redistribute urgent tasks
• Set up remote support protocol
• Negotiate return-to-work conditions

Result: Informed decision, proper planning
```

### Validation Logic

```
min_notice_days Validation Rules
════════════════════════════════════════════════════════

1. Range Validation:
   • Must be >= 0
   • Must be <= 90 (beyond 90 days is excessive)
   • Warn if > 30 and category != NO_PAY

2. Category-Specific Recommendations:
   
   ANNUAL:
   • Recommended: 14 days
   • Typical range: 7-30 days
   • Sri Lankan practice: 14 days common
   
   CASUAL:
   • Recommended: 1-2 days
   • Allows short-notice personal matters
   • Same-day usually not allowed
   
   SICK:
   • Must be 0
   • Medical emergencies cannot wait
   • After-the-fact application allowed
   
   MATERNITY:
   • Recommended: 14-30 days
   • Allows proper planning
   • Expected delivery date known in advance
   
   PATERNITY:
   • Recommended: 0-7 days
   • Birth timing unpredictable
   • Flexible for emergency
   
   NO_PAY:
   • Recommended: 30 days
   • Extended absence requires planning
   • Can be higher (45-60 days)

3. Business Logic:
   • Emergency override should be possible
   • Manager discretion for exceptional cases
   • System logs all notice exceptions
```

### Emergency Override Mechanism

```
Manager Override for Insufficient Notice
════════════════════════════════════════════════════════

Scenario: Employee needs urgent annual leave
────────────────────────────────────────────────────────
Regular Requirement: 14 days notice
Employee Applied: 3 days notice (family emergency)

System Validation:
❌ Notice period insufficient (3 < 14)

Options:
1. Reject Application
   └─→ Employee cannot take leave
   
2. Request Manager Override
   ├─→ Employee provides justification
   ├─→ Manager reviews emergency nature
   ├─→ Manager approves with override
   └─→ System records override reason

Override Form:
┌───────────────────────────────────────────────────┐
│ Manager Override Request                          │
├───────────────────────────────────────────────────┤
│                                                   │
│ Leave Type: Annual Leave                          │
│ Required Notice: 14 days                          │
│ Actual Notice: 3 days                             │
│ Shortfall: 11 days                                │
│                                                   │
│ Employee Justification:                           │
│ "Father hospitalized unexpectedly. Need to        │
│  travel to Kandy immediately for family support." │
│                                                   │
│ Manager Decision:                                 │
│ ○ Approve with override                           │
│   └─ Reason: Family emergency, justified          │
│ ○ Reject                                          │
│   └─ Reason: _____________________________        │
│                                                   │
│ [ Approve Override ]  [ Reject Application ]      │
│                                                   │
└───────────────────────────────────────────────────┘

Approval Result:
✅ Leave approved (with override)
📋 Audit log: "Manager override approved - family emergency"
```

### Notice Period Enforcement Flow

```
┌──────────────────────────────────────────────────────────────┐
│         Leave Application Notice Period Validation            │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  Employee Submits Application                                │
│  └─→ Select Leave Type: Annual Leave                         │
│      Select Dates: Dec 20-31, 2026                           │
│      Application Date: Dec 1, 2026                           │
│                                                              │
│  System Calculates Notice Period                             │
│  └─→ leave_start_date - application_date                     │
│      Dec 20 - Dec 1 = 19 days                                │
│                                                              │
│  System Checks min_notice_days                               │
│  └─→ LeaveType.min_notice_days = 14 days                     │
│                                                              │
│  System Validates                                            │
│  ├─→ IF notice_days >= min_notice_days:                      │
│  │   └─→ Proceed to next validation ✅                       │
│  │                                                           │
│  └─→ ELSE:                                                   │
│      ├─→ Show validation error ❌                            │
│      ├─→ Calculate shortfall                                 │
│      └─→ Offer manager override option                       │
│                                                              │
│  If Valid:                                                   │
│  └─→ Submit to approval workflow                             │
│      └─→ Manager reviews and approves                        │
│                                                              │
│  If Invalid:                                                 │
│  └─→ Options:                                                │
│      ├─→ Change dates (apply later)                          │
│      ├─→ Request manager override                            │
│      └─→ Cancel application                                  │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### Error Messages

```
User-Friendly Notice Requirement Messages
════════════════════════════════════════════════════════

Scenario 1: Insufficient Notice - Automatic Suggestion
────────────────────────────────────────────────────────
Message:
"⚠️ Advance Notice Required

Your selected leave dates (Dec 20-31) require 14 days
advance notice, but you have only provided 8 days notice.

Options:
1. Apply for leave starting from Dec 26 onwards
   (This will meet the 14-day notice requirement)

2. Request manager override for emergency leave
   (Requires justification)

3. Use Casual Leave instead
   (Requires only 1 day notice)

Would you like to:
[ Adjust Dates ] [ Request Override ] [ Change Leave Type ]"

Scenario 2: Same-Day Application for Non-Emergency Leave
────────────────────────────────────────────────────────
Message:
"❌ Same-Day Leave Not Allowed

Annual Leave requires at least 14 days advance notice.
You cannot apply for leave starting today.

Earliest available start date: December 25, 2026

Alternative for immediate leave:
• Sick Leave (if medical emergency)
• Casual Leave (if urgent personal matter)

Please adjust your application or contact HR for
exceptional circumstances."

Scenario 3: Emergency Leave - Success Message
────────────────────────────────────────────────────────
Message:
"✅ Emergency Leave Request Submitted

Your Sick Leave application has been submitted for
immediate processing.

Leave Details:
• Type: Sick Leave
• Dates: Dec 10-12, 2026
• Days: 3 days
• Notice: 0 days (emergency medical leave)

Note: Please submit medical certificate within 3 days
of return to work.

Your application is now pending supervisor approval."
```

### Expected Outcome
- Advance notice enforcement
- Planning and coverage support
- Emergency override capability
- Clear validation messaging

### Verification Checklist
- [ ] min_notice_days field added
- [ ] Field type is PositiveIntegerField
- [ ] Default set to 0 (no notice required)
- [ ] Range validation (0-90 days)
- [ ] Category-specific recommendations documented
- [ ] SICK leave should be 0 (emergency)
- [ ] ANNUAL leave typically 14 days
- [ ] Emergency override mechanism documented
- [ ] Help text explains notice requirement
- [ ] Model docstring updated

---

## Task 13: Run LeaveType Migrations

### Overview
Generate and apply Django migrations for the LeaveType model. This creates the database schema that stores all leave type configurations, ensuring proper structure, constraints, and indexes for optimal performance in the multi-tenant environment.

### Dependencies
- Tasks 04-12: All LeaveType model fields added
- Django migrations framework configured
- Database connection established

### Instructions

1. **Verify model completeness**
   - Open `leave_type.py` model file
   - Review all fields added in previous tasks
   - Check Meta class configuration
   - Verify model imports in `__init__.py`

2. **Generate migration file**
   - Open terminal in backend directory
   - Run: `python manage.py makemigrations leave`
   - System generates migration file
   - Review generated migration file

3. **Review migration file**
   - Open generated migration in `leave/migrations/`
   - Verify all fields present
   - Check constraints (unique_together)
   - Verify indexes created
   - Check default values

4. **Apply migration to database**
   - Run: `python manage.py migrate leave`
   - System creates database tables
   - Verify migration successful

5. **Verify database schema**
   - Connect to database
   - Check table created: `leave_leavetype`
   - Verify columns match model fields
   - Check indexes and constraints

6. **Test model in Django shell**
   - Run: `python manage.py shell`
   - Import LeaveType model
   - Create test instance
   - Verify field validation works

### Migration File Structure

```
leave/migrations/0001_initial.py
════════════════════════════════════════════════════════

Generated Migration File Structure:
────────────────────────────────────────────────────────
from django.db import migrations, models
import django.db.models.deletion

class Migration(migrations.Migration):
    
    initial = True
    
    dependencies = [
        ('tenants', '0001_initial'),  # Tenant model dependency
    ]
    
    operations = [
        migrations.CreateModel(
            name='LeaveType',
            fields=[
                ('id', models.BigAutoField(...)),
                
                # Core fields
                ('name', models.CharField(max_length=100)),
                ('code', models.CharField(max_length=10)),
                ('category', models.CharField(...)),
                
                # Description and UI
                ('description', models.TextField(...)),
                ('color', models.CharField(...)),
                
                # Entitlement configuration
                ('default_days_per_year', models.PositiveIntegerField(...)),
                
                # Restrictions
                ('max_consecutive_days', models.PositiveIntegerField(...)),
                ('max_days_per_request', models.PositiveIntegerField(...)),
                
                # Flags
                ('is_paid', models.BooleanField(...)),
                ('requires_document', models.BooleanField(...)),
                ('is_active', models.BooleanField(...)),
                ('allow_half_day', models.BooleanField(...)),
                
                # Eligibility
                ('applicable_gender', models.CharField(...)),
                ('min_service_months', models.PositiveIntegerField(...)),
                ('min_notice_days', models.PositiveIntegerField(...)),
                
                # Relationships
                ('tenant', models.ForeignKey(...)),
                
                # Timestamps (from mixin)
                ('created_at', models.DateTimeField(...)),
                ('updated_at', models.DateTimeField(...)),
            ],
            options={
                'verbose_name': 'Leave Type',
                'verbose_name_plural': 'Leave Types',
                'ordering': ['category', 'name'],
                'unique_together': [('tenant', 'code')],
                'indexes': [
                    models.Index(fields=['tenant', 'category']),
                    models.Index(fields=['tenant', 'is_active']),
                ],
            },
        ),
    ]
```

### Database Table Structure

```
Table: leave_leavetype
════════════════════════════════════════════════════════

Column Name              Type              Constraints
────────────────────────────────────────────────────────
id                      BIGINT            PRIMARY KEY, AUTO_INCREMENT
tenant_id               BIGINT            FOREIGN KEY (tenants.id), NOT NULL
name                    VARCHAR(100)      NOT NULL
code                    VARCHAR(10)       NOT NULL
category                VARCHAR(20)       NOT NULL
description             TEXT              NULL
color                   VARCHAR(7)        DEFAULT '#2196F3'
default_days_per_year   INTEGER           NULL, CHECK (>= 0)
max_consecutive_days    INTEGER           NULL, CHECK (>= 0)
max_days_per_request    INTEGER           NULL, CHECK (>= 0)
is_paid                 BOOLEAN           NOT NULL, DEFAULT TRUE
requires_document       BOOLEAN           NOT NULL, DEFAULT FALSE
is_active               BOOLEAN           NOT NULL, DEFAULT TRUE
allow_half_day          BOOLEAN           NOT NULL, DEFAULT TRUE
applicable_gender       VARCHAR(10)       NOT NULL, DEFAULT 'ALL'
min_service_months      INTEGER           NOT NULL, DEFAULT 0
min_notice_days         INTEGER           NOT NULL, DEFAULT 0
created_at              TIMESTAMP         NOT NULL, DEFAULT CURRENT_TIMESTAMP
updated_at              TIMESTAMP         NOT NULL, AUTO_UPDATE

Indexes:
────────────────────────────────────────────────────────
PRIMARY KEY (id)
UNIQUE (tenant_id, code)
INDEX (tenant_id, category)
INDEX (tenant_id, is_active)
FOREIGN KEY (tenant_id) REFERENCES tenants(id)

Estimated Size: ~500 bytes per row
Expected Rows: 5-15 per tenant (typical)
```

### Verification Queries

```sql
-- Check table exists
SHOW TABLES LIKE 'leave_leavetype';

-- Check table structure
DESCRIBE leave_leavetype;

-- Check indexes
SHOW INDEXES FROM leave_leavetype;

-- Check constraints
SELECT CONSTRAINT_NAME, CONSTRAINT_TYPE
FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS
WHERE TABLE_NAME = 'leave_leavetype';

-- Verify foreign key
SELECT 
    CONSTRAINT_NAME,
    COLUMN_NAME,
    REFERENCED_TABLE_NAME,
    REFERENCED_COLUMN_NAME
FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
WHERE TABLE_NAME = 'leave_leavetype'
AND REFERENCED_TABLE_NAME IS NOT NULL;
```

### Django Shell Testing

```python
# Run: python manage.py shell

from apps.leave.models import LeaveType
from apps.leave.constants import LeaveTypeCategory, GenderRestriction
from apps.tenants.models import Tenant

# Get or create test tenant
tenant = Tenant.objects.first()

# Test 1: Create valid leave type
annual_leave = LeaveType.objects.create(
    tenant=tenant,
    name="Annual Leave",
    code="AL",
    category=LeaveTypeCategory.ANNUAL,
    description="Annual leave for rest and recreation",
    color="#4CAF50",
    default_days_per_year=14,
    max_consecutive_days=14,
    max_days_per_request=None,
    is_paid=True,
    requires_document=False,
    is_active=True,
    allow_half_day=True,
    applicable_gender=GenderRestriction.ALL,
    min_service_months=12,
    min_notice_days=14
)

print(f"Created: {annual_leave}")
# Output: Created: Annual Leave (AL)

# Test 2: Verify unique constraint (tenant, code)
try:
    duplicate = LeaveType.objects.create(
        tenant=tenant,
        name="Another Annual",
        code="AL",  # Duplicate code
        category=LeaveTypeCategory.ANNUAL
    )
except Exception as e:
    print(f"Expected error: {e}")
    # Should raise IntegrityError: duplicate key

# Test 3: Test filtering
active_leaves = LeaveType.objects.filter(
    tenant=tenant,
    is_active=True
)
print(f"Active leave types: {active_leaves.count()}")

# Test 4: Test gender filtering
female_leaves = LeaveType.objects.filter(
    tenant=tenant,
    applicable_gender__in=[
        GenderRestriction.ALL,
        GenderRestriction.FEMALE
    ]
)
print(f"Leaves for female employees: {female_leaves.count()}")

# Test 5: Clean method validation
maternity = LeaveType(
    tenant=tenant,
    name="Maternity Leave",
    code="ML",
    category=LeaveTypeCategory.MATERNITY,
    applicable_gender=GenderRestriction.MALE  # Invalid!
)

try:
    maternity.clean()
except ValidationError as e:
    print(f"Validation error: {e}")
    # Should raise error: Maternity must be female only
```

### Common Migration Issues and Solutions

```
Issue 1: Migration conflicts
════════════════════════════════════════════════════════
Error: "Conflicting migrations detected"

Solution:
1. Check for multiple migration files with same number
2. Delete conflicting migrations (if not applied)
3. Run: python manage.py makemigrations --merge
4. Resolve conflicts manually
5. Apply merged migration

────────────────────────────────────────────────────────

Issue 2: Missing dependencies
════════════════════════════════════════════════════════
Error: "Migration depends on undefined migration"

Solution:
1. Ensure tenant app migrations exist
2. Run tenant migrations first:
   python manage.py migrate tenants
3. Run leave migrations:
   python manage.py migrate leave

────────────────────────────────────────────────────────

Issue 3: Database connection error
════════════════════════════════════════════════════════
Error: "Could not connect to database"

Solution:
1. Check database configuration in settings
2. Verify database service is running
3. Check credentials and permissions
4. Test connection manually
5. Retry migration

────────────────────────────────────────────────────────

Issue 4: Field constraint violation
════════════════════════════════════════════════════════
Error: "Column cannot be null" (if data exists)

Solution:
1. If adding NOT NULL field to existing table:
2. Either provide default value
3. Or make field nullable initially
4. Create data migration to populate values
5. Add NOT NULL constraint in second migration
```

### Post-Migration Checklist

```
Database Verification Steps
════════════════════════════════════════════════════════

✅ Migration file generated without errors
✅ Migration applied successfully to database
✅ Table `leave_leavetype` exists
✅ All 18+ columns present and correct types
✅ Primary key (id) created
✅ Foreign key (tenant_id) created and valid
✅ Unique constraint (tenant_id, code) active
✅ Index on (tenant_id, category) created
✅ Index on (tenant_id, is_active) created
✅ Default values set correctly
✅ Check constraints on positive integers
✅ Timestamp fields with auto behaviors
✅ Django shell test successful
✅ Can create, read, update, delete records
✅ Validation methods working
✅ String representation (__str__) correct
```

### Expected Outcome
- Database table created successfully
- All fields and constraints in place
- Indexes created for performance
- Model ready for use in application

### Verification Checklist
- [ ] Migration file generated (`0001_initial.py`)
- [ ] All model fields present in migration
- [ ] Constraints defined (unique_together)
- [ ] Indexes defined and created
- [ ] Migration applied without errors
- [ ] Database table exists
- [ ] Can create LeaveType instances
- [ ] Validation works correctly
- [ ] Foreign key to tenant valid
- [ ] Model imported in `__init__.py`

---

## Task 14: Create LeavePolicy Model

### Overview
Create the LeavePolicy model that links leave types to specific departments, designations, or all employees, enabling flexible policy-based leave entitlement management. This model allows companies to offer different leave entitlements based on employee groups while maintaining centralized leave type definitions.

### Dependencies
- Task 13: Run LeaveType Migrations
- LeaveType model complete
- Department model exists (HR module)
- Designation model exists (HR module)

### Instructions

1. **Create leave_policy.py model file**
   - Create file at `backend/apps/leave/models/leave_policy.py`
   - Import necessary Django components

2. **Import required modules**
   - Import Django model and field classes
   - Import TenantAwareMixin, TimestampMixin
   - Import LeaveType model
   - Import Department, Designation models

3. **Define LeavePolicy model class**
   - Inherit from TenantAwareMixin and TimestampMixin
   - Add comprehensive model docstring

4. **Add name field**
   - CharField with max_length=200
   - Required field
   - Human-readable policy name
   - Example: "Sales Department Annual Leave Policy"

5. **Add leave_type field**
   - ForeignKey to LeaveType
   - CASCADE on delete
   - Required field
   - Links policy to specific leave type

6. **Add days_per_year field**
   - PositiveIntegerField
   - Optional (null=True, blank=True)
   - Overrides LeaveType default_days_per_year
   - If null, uses LeaveType default

7. **Add is_active field**
   - BooleanField, default=True
   - Controls policy availability
   - Inactive policies don't apply

8. **Add Meta class**
   - Set verbose_name and verbose_name_plural
   - Add ordering by name
   - Add index on (tenant, leave_type)
   - Add index on (tenant, is_active)

9. **Add __str__ method**
   - Return policy name
   - Include leave type in representation

10. **Add get_applicable_days method**
    - Returns days_per_year if set
    - Otherwise returns leave_type.default_days_per_year
    - Handles null cases gracefully

11. **Update models/__init__.py**
    - Import LeavePolicy model
    - Add to __all__ list

### LeavePolicy Model Structure

```
┌──────────────────────────────────────────────────────────────┐
│                   LeavePolicy Model                          │
├──────────────────────────────────────────────────────────────┤
│ Core Fields:                                                 │
│  • name (CharField, 200)                                     │
│  • leave_type (ForeignKey to LeaveType)                      │
│  • days_per_year (PositiveIntegerField, nullable)            │
│  • is_active (BooleanField)                                  │
│                                                              │
│ Scope Fields (Task 15):                                      │
│  • applies_to (Choice: ALL, DEPARTMENT, DESIGNATION)         │
│  • department (ForeignKey, nullable)                         │
│  • designation (ForeignKey, nullable)                        │
│                                                              │
│ Date Range Fields (Task 16):                                 │
│  • effective_from (DateField)                                │
│  • effective_to (DateField, nullable)                        │
│                                                              │
│ Inherited from TenantAwareMixin:                             │
│  • tenant (ForeignKey)                                       │
│                                                              │
│ Inherited from TimestampMixin:                               │
│  • created_at, updated_at                                    │
└──────────────────────────────────────────────────────────────┘
```

### Model Relationships

```
┌──────────────┐         1:N          ┌────────────────────┐
│  LeaveType   │◄─────────────────────│   LeavePolicy      │
└──────────────┘                      └────────────────────┘
                                               │
                                               │ N:1 (optional)
                                               ▼
                                      ┌────────────────────┐
                                      │    Department      │
                                      └────────────────────┘
                                               │
                                               │ N:1 (optional)
                                               ▼
                                      ┌────────────────────┐
                                      │   Designation      │
                                      └────────────────────┘

One LeaveType → Many Policies
Example: Annual Leave type can have:
• Default policy (all employees): 14 days
• Sales department policy: 18 days
• Senior management policy: 21 days
```

### Policy Purpose and Use Cases

```
Why LeavePolicy is Needed
════════════════════════════════════════════════════════

Scenario 1: Department-Based Entitlement
────────────────────────────────────────────────────────
Company: LankaCommerce Pvt Ltd
LeaveType: Annual Leave (default 14 days)

Policies:
┌──────────────────────────────────────────────────────┐
│ Default Policy                                       │
│ • Applies to: All employees                          │
│ • Days per year: 14 days                             │
│ • Scope: Company-wide                                │
└──────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────┐
│ Sales Department Policy                              │
│ • Applies to: Sales department only                  │
│ • Days per year: 18 days (override)                  │
│ • Reason: Travel-intensive role, higher entitlement  │
└──────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────┐
│ Field Staff Policy                                   │
│ • Applies to: Designation = Field Officer            │
│ • Days per year: 16 days (override)                  │
│ • Reason: Outdoor work, additional rest needed       │
└──────────────────────────────────────────────────────┘

Resolution:
Employee: Priya (Sales Department)
→ Matches Sales Department Policy
→ Entitlement: 18 days (not default 14)

Employee: Rohan (IT Department)
→ No specific policy
→ Entitlement: 14 days (default policy)

────────────────────────────────────────────────────────

Scenario 2: Designation-Based Entitlement
────────────────────────────────────────────────────────
Company: TechSoft Solutions
LeaveType: Annual Leave (default 14 days)

Policies by Designation:
┌──────────────────────────────────────────────────────┐
│ Junior Staff (0-2 years)                             │
│ • Designation: Junior Developer, Assistant           │
│ • Days per year: 14 days                             │
└──────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────┐
│ Mid-Level Staff (2-5 years)                          │
│ • Designation: Senior Developer, Executive           │
│ • Days per year: 18 days                             │
└──────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────┐
│ Senior Management (5+ years)                         │
│ • Designation: Manager, Director                     │
│ • Days per year: 21 days                             │
└──────────────────────────────────────────────────────┘

────────────────────────────────────────────────────────

Scenario 3: Time-Limited Policy
────────────────────────────────────────────────────────
Company: Retail Chain
LeaveType: Annual Leave

Pandemic Policy (2026-2027):
┌──────────────────────────────────────────────────────┐
│ COVID-19 Enhanced Leave Policy                       │
│ • Applies to: All employees                          │
│ • Days per year: 18 days (increased from 14)         │
│ • Effective from: 2026-01-01                         │
│ • Effective to: 2027-12-31                           │
│ • Reason: Support employee wellbeing during pandemic │
└──────────────────────────────────────────────────────┘

After 2027-12-31:
→ Policy expires
→ Reverts to standard 14 days
→ Or activate new policy
```

### Policy Override Logic

```
Entitlement Calculation Logic
════════════════════════════════════════════════════════

Function: get_applicable_days()
────────────────────────────────────────────────────────

def get_applicable_days(self):
    """
    Returns applicable days per year for this policy.
    If policy specifies days_per_year, use that.
    Otherwise, use leave_type default.
    """
    if self.days_per_year is not None:
        return self.days_per_year
    return self.leave_type.default_days_per_year

Examples:
────────────────────────────────────────────────────────

Policy 1:
LeaveType: Annual Leave (default_days_per_year = 14)
Policy days_per_year: 18
Result: get_applicable_days() = 18 (override)

Policy 2:
LeaveType: Annual Leave (default_days_per_year = 14)
Policy days_per_year: None
Result: get_applicable_days() = 14 (use default)

Policy 3:
LeaveType: Casual Leave (default_days_per_year = 7)
Policy days_per_year: 10
Result: get_applicable_days() = 10 (override)
```

### Multiple Policies Resolution

```
Policy Priority Resolution (Task 15 will implement)
════════════════════════════════════════════════════════

When multiple policies match an employee:

Priority Order:
1. Employee-specific policy (if exists)
2. Designation-specific policy
3. Department-specific policy
4. All-employees policy (default)
5. LeaveType default (if no policy)

Example:
────────────────────────────────────────────────────────
Employee: Nisha
• Department: Sales
• Designation: Senior Manager

Available Policies for Annual Leave:
1. All Employees Policy: 14 days
2. Sales Department Policy: 18 days
3. Senior Manager Policy: 21 days

Resolution:
→ Check designation policy (highest priority): Found! 21 days
→ Result: Nisha gets 21 days

Employee: Kamal
• Department: Sales
• Designation: Sales Executive

Available Policies for Annual Leave:
1. All Employees Policy: 14 days
2. Sales Department Policy: 18 days
3. No designation-specific policy

Resolution:
→ Check designation policy: None
→ Check department policy: Found! 18 days
→ Result: Kamal gets 18 days

Employee: Rohan
• Department: IT
• Designation: Developer

Available Policies for Annual Leave:
1. All Employees Policy: 14 days
2. No department-specific policy
3. No designation-specific policy

Resolution:
→ Check designation policy: None
→ Check department policy: None
→ Use all-employees policy: 14 days
→ Result: Rohan gets 14 days
```

### Validation and Business Rules

```
LeavePolicy Validation Rules
════════════════════════════════════════════════════════

1. days_per_year Validation:
   • If set, must be > 0
   • If set, should be reasonable (<= 365)
   • Should not conflict with legal minimums

2. Relationship Validation:
   • leave_type must exist
   • leave_type must be active (warning if not)

3. Tenant Consistency:
   • Policy tenant must match leave_type tenant
   • Department/designation must belong to same tenant

4. Override Validation:
   • If days_per_year set, should differ from default
   • Warning if days_per_year < legal minimum
   • Example: Annual leave policy with 10 days (< 14 legal min)
```

### Expected Outcome
- LeavePolicy model created
- Leave type linkage established
- Days override capability
- Foundation for policy-based management

### Verification Checklist
- [ ] leave_policy.py file created
- [ ] Required modules imported
- [ ] LeavePolicy class defined
- [ ] name field added
- [ ] leave_type ForeignKey added
- [ ] days_per_year field added (nullable)
- [ ] is_active field added
- [ ] Meta class configured
- [ ] __str__ method implemented
- [ ] get_applicable_days method added
- [ ] Model imported in models/__init__.py

---

## Task 15: Add Policy Scope Fields

### Overview
Add scope definition fields to the LeavePolicy model, enabling policies to target specific employee groups (all employees, specific department, or specific designation). This creates a flexible policy hierarchy that supports varied entitlement structures across the organization.

### Dependencies
- Task 14: Create LeavePolicy Model
- Department model exists with tenant relationship
- Designation model exists with tenant relationship

### Instructions

1. **Define policy scope choices**
   - Open `constants.py` file
   - Create PolicyScope TextChoices class
   - Define ALL, DEPARTMENT, DESIGNATION options

2. **Open leave_policy.py model file**
   - Import PolicyScope from constants
   - Import Department and Designation models

3. **Add applies_to field**
   - CharField with PolicyScope choices
   - Default to PolicyScope.ALL
   - Required field
   - Determines policy target group

4. **Add department field**
   - ForeignKey to Department
   - NULL=True, blank=True (optional)
   - CASCADE on delete
   - Required only when applies_to=DEPARTMENT

5. **Add designation field**
   - ForeignKey to Designation
   - NULL=True, blank=True (optional)
   - CASCADE on delete
   - Required only when applies_to=DESIGNATION

6. **Add field validation**
   - Update clean method
   - If applies_to=DEPARTMENT, department required
   - If applies_to=DESIGNATION, designation required
   - If applies_to=ALL, department and designation must be null
   - Validate tenant consistency

7. **Add help text**
   - Explain policy scope options
   - Provide examples for each scope
   - Note priority resolution

8. **Update model docstring**
   - Document policy scope fields
   - Explain resolution priority
   - Provide usage examples

### PolicyScope Choices Structure

```python
class PolicyScope(models.TextChoices):
    """
    Scope options for leave policies
    """
    ALL = 'ALL', 'All Employees'
    DEPARTMENT = 'DEPARTMENT', 'Specific Department'
    DESIGNATION = 'DESIGNATION', 'Specific Designation'
```

### Policy Scope Fields Structure

```
┌─────────────────────────────────────────────────────────────┐
│               Policy Scope Fields Details                    │
├─────────────────────────────────────────────────────────────┤
│ Field: applies_to                                            │
│  • Type: CharField with PolicyScope choices                  │
│  • Default: PolicyScope.ALL                                  │
│  • Purpose: Define policy target group                       │
│                                                              │
│ Field: department                                            │
│  • Type: ForeignKey to Department                            │
│  • Optional: null=True, blank=True                           │
│  • Required when: applies_to = DEPARTMENT                    │
│  • Purpose: Target specific department                       │
│                                                              │
│ Field: designation                                           │
│  • Type: ForeignKey to Designation                           │
│  • Optional: null=True, blank=True                           │
│  • Required when: applies_to = DESIGNATION                   │
│  • Purpose: Target specific designation/position             │
└─────────────────────────────────────────────────────────────┘
```

### Scope Configuration Examples

```
Policy Scope Configurations
════════════════════════════════════════════════════════

1. All Employees Policy (Default)
────────────────────────────────────────────────────────
Policy:
• name: "Standard Annual Leave"
• leave_type: Annual Leave
• applies_to: ALL
• department: NULL
• designation: NULL
• days_per_year: 14

Applies To: All employees in the tenant
Priority: Lowest (fallback)

────────────────────────────────────────────────────────

2. Department-Specific Policy
────────────────────────────────────────────────────────
Policy:
• name: "Sales Department Annual Leave"
• leave_type: Annual Leave
• applies_to: DEPARTMENT
• department: Sales
• designation: NULL
• days_per_year: 18

Applies To: All employees in Sales department
Priority: Medium (overrides ALL policy)

────────────────────────────────────────────────────────

3. Designation-Specific Policy
────────────────────────────────────────────────────────
Policy:
• name: "Senior Management Annual Leave"
• leave_type: Annual Leave
• applies_to: DESIGNATION
• department: NULL
• designation: Senior Manager
• days_per_year: 21

Applies To: All employees with designation "Senior Manager"
Priority: High (overrides DEPARTMENT and ALL policies)

────────────────────────────────────────────────────────

4. Invalid Configuration Example
────────────────────────────────────────────────────────
Policy:
• applies_to: DEPARTMENT
• department: NULL  ❌ Invalid! Department required
• designation: NULL

Validation Error:
"When applies_to is DEPARTMENT, department field is required."
```

### Policy Resolution Priority

```
Policy Matching and Priority Resolution
════════════════════════════════════════════════════════

Employee Profile:
────────────────────────────────────────────────────────
Name: Priya Fernando
Department: Sales
Designation: Senior Manager

Available Policies for Annual Leave:
────────────────────────────────────────────────────────
Policy A: All Employees → 14 days (Priority 3)
Policy B: Sales Department → 18 days (Priority 2)
Policy C: Senior Manager → 21 days (Priority 1)

Resolution Process:
────────────────────────────────────────────────────────
Step 1: Filter active policies for Annual Leave
       → Found 3 policies

Step 2: Filter policies applicable to employee
       ├─ Policy A (ALL): ✅ Matches (all employees)
       ├─ Policy B (DEPARTMENT=Sales): ✅ Matches
       └─ Policy C (DESIGNATION=Senior Manager): ✅ Matches

Step 3: Apply priority order (highest first)
       1. DESIGNATION policy: Senior Manager → 21 days ✅
       (Stop here, found highest priority match)

Result: Priya gets 21 days

────────────────────────────────────────────────────────

Employee Profile:
────────────────────────────────────────────────────────
Name: Kamal Silva
Department: Sales
Designation: Sales Executive

Available Policies:
────────────────────────────────────────────────────────
Policy A: All Employees → 14 days (Priority 3)
Policy B: Sales Department → 18 days (Priority 2)
(No Sales Executive designation policy)

Resolution Process:
────────────────────────────────────────────────────────
Step 1-2: Filter applicable policies
       ├─ Policy A (ALL): ✅ Matches
       └─ Policy B (DEPARTMENT=Sales): ✅ Matches

Step 3: Apply priority order
       1. DESIGNATION policy: None
       2. DEPARTMENT policy: Sales → 18 days ✅

Result: Kamal gets 18 days

────────────────────────────────────────────────────────

Employee Profile:
────────────────────────────────────────────────────────
Name: Rohan Perera
Department: IT
Designation: Developer

Available Policies:
────────────────────────────────────────────────────────
Policy A: All Employees → 14 days (Priority 3)
(No IT department policy)
(No Developer designation policy)

Resolution Process:
────────────────────────────────────────────────────────
Step 1-2: Filter applicable policies
       └─ Policy A (ALL): ✅ Matches

Step 3: Apply priority order
       1. DESIGNATION policy: None
       2. DEPARTMENT policy: None
       3. ALL policy: All Employees → 14 days ✅

Result: Rohan gets 14 days
```

### Validation Logic

```
Policy Scope Validation Rules
════════════════════════════════════════════════════════

def clean(self):
    """Validate policy scope configuration"""
    
    # Rule 1: If applies_to is DEPARTMENT
    if self.applies_to == PolicyScope.DEPARTMENT:
        if not self.department:
            raise ValidationError({
                'department': 'Department is required when '
                             'policy applies to a specific department.'
            })
        if self.designation:
            raise ValidationError({
                'designation': 'Designation should be null when '
                              'policy applies to department.'
            })
    
    # Rule 2: If applies_to is DESIGNATION
    elif self.applies_to == PolicyScope.DESIGNATION:
        if not self.designation:
            raise ValidationError({
                'designation': 'Designation is required when '
                              'policy applies to a specific designation.'
            })
        if self.department:
            raise ValidationError({
                'department': 'Department should be null when '
                             'policy applies to designation.'
            })
    
    # Rule 3: If applies_to is ALL
    elif self.applies_to == PolicyScope.ALL:
        if self.department or self.designation:
            raise ValidationError(
                'Department and designation should be null when '
                'policy applies to all employees.'
            )
    
    # Rule 4: Tenant consistency
    if self.department and self.department.tenant != self.tenant:
        raise ValidationError(
            'Department must belong to the same tenant as policy.'
        )
    
    if self.designation and self.designation.tenant != self.tenant:
        raise ValidationError(
            'Designation must belong to the same tenant as policy.'
        )
```

### Complex Organizational Scenarios

```
Scenario: Multi-Department, Multi-Designation Company
════════════════════════════════════════════════════════

Organization Structure:
────────────────────────────────────────────────────────
Departments:
• Sales (field-intensive)
• IT (technical)
• HR (administrative)
• Finance (compliance-heavy)

Designations:
• Junior (0-2 years)
• Senior (2-5 years)
• Manager (5+ years)
• Director (leadership)

Annual Leave Policy Matrix:
────────────────────────────────────────────────────────

Policy 1: All Employees
• applies_to: ALL
• days: 14 (legal minimum)

Policy 2: Sales Department
• applies_to: DEPARTMENT (Sales)
• days: 18 (travel-intensive role)

Policy 3: Manager Designation
• applies_to: DESIGNATION (Manager)
• days: 21 (senior leadership)

Policy 4: Director Designation
• applies_to: DESIGNATION (Director)
• days: 25 (executive level)

Employee Entitlements:
────────────────────────────────────────────────────────

1. Sales Junior: 18 days
   → Department policy applies (Sales)

2. Sales Manager: 21 days
   → Designation policy overrides department

3. IT Manager: 21 days
   → Designation policy applies

4. HR Junior: 14 days
   → All employees policy (no specific overrides)

5. Finance Director: 25 days
   → Designation policy (Director)

6. IT Junior: 14 days
   → All employees policy
```

### Query Helper Methods

```
Helper Methods for Policy Resolution
════════════════════════════════════════════════════════

@classmethod
def get_applicable_policy(cls, employee, leave_type):
    """
    Get the highest priority applicable policy for employee
    
    Args:
        employee: Employee instance
        leave_type: LeaveType instance
    
    Returns:
        LeavePolicy instance or None
    """
    tenant = employee.tenant
    
    # Priority 1: Designation-specific policy
    designation_policy = cls.objects.filter(
        tenant=tenant,
        leave_type=leave_type,
        applies_to=PolicyScope.DESIGNATION,
        designation=employee.designation,
        is_active=True
    ).first()
    if designation_policy:
        return designation_policy
    
    # Priority 2: Department-specific policy
    department_policy = cls.objects.filter(
        tenant=tenant,
        leave_type=leave_type,
        applies_to=PolicyScope.DEPARTMENT,
        department=employee.department,
        is_active=True
    ).first()
    if department_policy:
        return department_policy
    
    # Priority 3: All-employees policy
    all_policy = cls.objects.filter(
        tenant=tenant,
        leave_type=leave_type,
        applies_to=PolicyScope.ALL,
        is_active=True
    ).first()
    if all_policy:
        return all_policy
    
    # Fallback: No policy found
    return None

@classmethod
def get_entitlement_days(cls, employee, leave_type):
    """
    Get leave entitlement days for employee
    
    Returns int: Number of days entitled
    """
    policy = cls.get_applicable_policy(employee, leave_type)
    
    if policy:
        return policy.get_applicable_days()
    
    # No policy found, use leave type default
    return leave_type.default_days_per_year
```

### Expected Outcome
- Policy scope targeting
- Department/designation linkage
- Priority-based resolution
- Flexible entitlement structure

### Verification Checklist
- [ ] PolicyScope choices defined in constants.py
- [ ] applies_to field added with choices
- [ ] department ForeignKey added (nullable)
- [ ] designation ForeignKey added (nullable)
- [ ] Validation: DEPARTMENT requires department
- [ ] Validation: DESIGNATION requires designation
- [ ] Validation: ALL requires both null
- [ ] Tenant consistency validation added
- [ ] Help text explains scope options
- [ ] Model docstring updated

---

## Task 16: Add Policy Date Range

### Overview
Add effective date range fields to the LeavePolicy model, enabling time-bound policies that automatically activate and expire based on specified dates. This supports temporary policies, policy transitions, and phased policy rollouts.

### Dependencies
- Task 15: Add Policy Scope Fields

### Instructions

1. **Open leave_policy.py model file**
   - Continue in `backend/apps/leave/models/leave_policy.py`
   - Locate LeavePolicy model class

2. **Add effective_from field**
   - DateField type
   - Required field (no null/blank)
   - Default to current date or policy creation date
   - Specifies when policy becomes active

3. **Add effective_to field**
   - DateField type
   - Optional (null=True, blank=True)
   - Null means policy never expires
   - Specifies when policy ends

4. **Add field validation**
   - Update clean method
   - Validate effective_to > effective_from (if set)
   - Check for overlapping policies (same scope)
   - Warn if policy expires soon

5. **Add is_currently_effective property**
   - @property decorator
   - Returns True if current date within range
   - Checks effective_from <= today <= effective_to
   - Returns False if outside date range

6. **Add help text**
   - Explain date range purpose
   - Note overlap checking
   - Provide examples of time-bound policies

7. **Update model docstring**
   - Document date range fields
   - Explain policy lifecycle
   - Note automatic activation/expiration

### Date Range Fields Structure

```
┌─────────────────────────────────────────────────────────────┐
│              Policy Date Range Fields Details                │
├─────────────────────────────────────────────────────────────┤
│ Field: effective_from                                        │
│  • Type: DateField                                           │
│  • Required: Yes                                             │
│  • Purpose: Policy activation date                           │
│  • Example: 2026-01-01                                       │
│                                                              │
│ Field: effective_to                                          │
│  • Type: DateField                                           │
│  • Optional: null=True, blank=True                           │
│  • Purpose: Policy expiration date                           │
│  • Null means: Never expires                                 │
│  • Example: 2026-12-31 or NULL                               │
│                                                              │
│ Property: is_currently_effective                             │
│  • Returns: Boolean                                          │
│  • Logic: effective_from <= today <= effective_to            │
│  • Use: Filter active policies                               │
└─────────────────────────────────────────────────────────────┘
```

### Date Range Use Cases

```
Time-Bound Policy Scenarios
════════════════════════════════════════════════════════

Scenario 1: Permanent Policy (No End Date)
────────────────────────────────────────────────────────
Policy: Standard Annual Leave
• effective_from: 2026-01-01
• effective_to: NULL (no end date)
• Status: Active indefinitely

Timeline:
2026-01-01 ──────────────────────────────→ ∞
           └─ Policy Active

Use Case: Default company policy that continues until changed

────────────────────────────────────────────────────────

Scenario 2: Temporary Enhanced Policy
────────────────────────────────────────────────────────
Policy: COVID-19 Enhanced Leave
• effective_from: 2026-01-01
• effective_to: 2026-12-31
• days_per_year: 18 (increased from 14)
• Status: Active for 2026 only

Timeline:
2025-12-31   2026-01-01 ────────── 2026-12-31   2027-01-01
    │             └─ Policy Active ─┘              │
    │                                              │
Old Policy                                    Revert to
  (14 days)                                   Old Policy

Use Case: Pandemic response, temporary benefit increase

────────────────────────────────────────────────────────

Scenario 3: Policy Transition
────────────────────────────────────────────────────────
Old Policy: Sales Department Leave (14 days)
• effective_from: 2025-01-01
• effective_to: 2026-12-31
• Status: Will expire

New Policy: Sales Department Leave (18 days)
• effective_from: 2027-01-01
• effective_to: NULL
• Status: Will activate

Timeline:
2025     2026          2027            2028
  │       │              │               │
  └──Old Policy (14)──┐  └──New Policy (18)──→
                      └─ Transition

Use Case: Planned policy update, smooth transition

────────────────────────────────────────────────────────

Scenario 4: Seasonal/Project-Based Policy
────────────────────────────────────────────────────────
Policy: Year-End Retail Rush - Reduced Leave
• effective_from: 2026-11-01
• effective_to: 2027-01-15
• Status: Blackout period (restricted leave)

Timeline:
Oct     Nov     Dec     Jan      Feb
 │       │       │       │        │
 │       └───Blackout──┐│        │
 │                     ││        │
 └──Normal Operation──┘└─Normal─→

Use Case: Busy season restriction, automatic restoration
```

### Validation Logic

```
Date Range Validation Rules
════════════════════════════════════════════════════════

def clean(self):
    """Validate date range"""
    
    # Rule 1: effective_to must be after effective_from
    if self.effective_to:
        if self.effective_to <= self.effective_from:
            raise ValidationError({
                'effective_to': 
                'End date must be after start date.'
            })
    
    # Rule 2: Check for overlapping policies (same scope)
    overlapping = LeavePolicy.objects.filter(
        tenant=self.tenant,
        leave_type=self.leave_type,
        applies_to=self.applies_to,
        is_active=True
    )
    
    # Filter by scope specifics
    if self.applies_to == PolicyScope.DEPARTMENT:
        overlapping = overlapping.filter(
            department=self.department
        )
    elif self.applies_to == PolicyScope.DESIGNATION:
        overlapping = overlapping.filter(
            designation=self.designation
        )
    
    # Exclude self if updating
    if self.pk:
        overlapping = overlapping.exclude(pk=self.pk)
    
    # Check for date overlap
    for policy in overlapping:
        # Check if date ranges overlap
        if self._date_ranges_overlap(
            self.effective_from, self.effective_to,
            policy.effective_from, policy.effective_to
        ):
            raise ValidationError(
                f'Date range overlaps with existing policy: '
                f'{policy.name}'
            )
    
    # Rule 3: Warn if starts in past
    if self.effective_from < date.today():
        # Warning, not error (might be intentional)
        pass
    
    # Rule 4: Warn if expires soon
    if self.effective_to:
        days_until_expiry = (self.effective_to - date.today()).days
        if 0 < days_until_expiry < 30:
            # Warning: Policy expires in less than 30 days
            pass

def _date_ranges_overlap(self, start1, end1, start2, end2):
    """Check if two date ranges overlap"""
    # If either range has no end date, assume infinite
    if end1 is None:
        end1 = date(9999, 12, 31)
    if end2 is None:
        end2 = date(9999, 12, 31)
    
    # Check overlap
    return not (end1 < start2 or end2 < start1)
```

### is_currently_effective Property

```python
@property
def is_currently_effective(self):
    """
    Check if policy is currently effective based on dates
    
    Returns:
        bool: True if current date is within policy date range
    """
    today = date.today()
    
    # Check if started
    if today < self.effective_from:
        return False
    
    # Check if expired (if end date exists)
    if self.effective_to and today > self.effective_to:
        return False
    
    # Within range and active
    return self.is_active

# Usage Examples:
# ═══════════════════════════════════════════════════

# Policy 1: Future policy
policy1 = LeavePolicy(
    effective_from=date(2027, 1, 1),
    effective_to=None,
    is_active=True
)
policy1.is_currently_effective  # False (not started yet)

# Policy 2: Current policy
policy2 = LeavePolicy(
    effective_from=date(2026, 1, 1),
    effective_to=date(2026, 12, 31),
    is_active=True
)
# If today is 2026-06-15:
policy2.is_currently_effective  # True

# Policy 3: Expired policy
policy3 = LeavePolicy(
    effective_from=date(2025, 1, 1),
    effective_to=date(2025, 12, 31),
    is_active=True
)
policy3.is_currently_effective  # False (expired)

# Policy 4: Inactive policy
policy4 = LeavePolicy(
    effective_from=date(2026, 1, 1),
    effective_to=None,
    is_active=False
)
policy4.is_currently_effective  # False (not active)
```

### Query Filtering by Date

```python
# Get all currently effective policies
@classmethod
def get_current_policies(cls, tenant, leave_type=None):
    """
    Get all policies currently in effect
    
    Args:
        tenant: Tenant instance
        leave_type: Optional LeaveType to filter
    
    Returns:
        QuerySet of currently effective policies
    """
    today = date.today()
    
    queryset = cls.objects.filter(
        tenant=tenant,
        is_active=True,
        effective_from__lte=today
    ).filter(
        Q(effective_to__isnull=True) |  # No end date
        Q(effective_to__gte=today)       # Or not yet expired
    )
    
    if leave_type:
        queryset = queryset.filter(leave_type=leave_type)
    
    return queryset

# Usage:
current_policies = LeavePolicy.get_current_policies(
    tenant=my_tenant,
    leave_type=annual_leave_type
)

# Get policies expiring soon
@classmethod
def get_expiring_soon(cls, tenant, days=30):
    """Get policies expiring within specified days"""
    today = date.today()
    cutoff = today + timedelta(days=days)
    
    return cls.objects.filter(
        tenant=tenant,
        is_active=True,
        effective_to__isnull=False,
        effective_to__gte=today,
        effective_to__lte=cutoff
    )

# Usage:
expiring = LeavePolicy.get_expiring_soon(tenant=my_tenant)
for policy in expiring:
    days_left = (policy.effective_to - date.today()).days
    print(f"{policy.name} expires in {days_left} days")
```

### Policy Lifecycle Management

```
Policy Lifecycle States
════════════════════════════════════════════════════════

State 1: Future (Not Yet Active)
────────────────────────────────────────────────────────
Condition: today < effective_from
Status: is_currently_effective = False
Action: Wait for activation date

State 2: Active (Currently Effective)
────────────────────────────────────────────────────────
Condition: effective_from <= today <= effective_to
Status: is_currently_effective = True
Action: Apply policy to employees

State 3: Expired (Past End Date)
────────────────────────────────────────────────────────
Condition: today > effective_to
Status: is_currently_effective = False
Action: No longer applies, keep for audit

State 4: Permanent (No End Date)
────────────────────────────────────────────────────────
Condition: effective_to = NULL
Status: is_currently_effective = True (if started)
Action: Continues indefinitely

State 5: Inactive (Manually Disabled)
────────────────────────────────────────────────────────
Condition: is_active = False
Status: is_currently_effective = False
Action: Disabled regardless of dates
```

### Admin Notifications

```
Policy Expiration Notifications
════════════════════════════════════════════════════════

Automated Notification System:

30 Days Before Expiry:
────────────────────────────────────────────────────────
Subject: Policy Expiring Soon - Action Required

"The following leave policy will expire in 30 days:

Policy: Sales Department Annual Leave
Expires: 2026-12-31
Affected Employees: 25 (Sales Department)

Action Required:
1. Review policy effectiveness
2. Decide: Extend, modify, or let expire
3. Create replacement policy if needed
4. Communicate changes to employees

[ Extend Policy ] [ Create New Policy ] [ Let Expire ]"

7 Days Before Expiry:
────────────────────────────────────────────────────────
Subject: URGENT - Policy Expires in 7 Days

"Final reminder: Policy expires soon!

Policy: Sales Department Annual Leave
Expires: 2026-12-31 (in 7 days)

If no action taken, policy will expire and employees
will revert to standard entitlement (14 days).

Take action immediately."

After Expiry:
────────────────────────────────────────────────────────
Subject: Policy Expired

"The following policy has expired:

Policy: Sales Department Annual Leave
Expired: 2026-12-31

Employees now using: Standard policy (14 days)

Policy archived for historical reference."
```

### Expected Outcome
- Time-bound policy support
- Automatic activation/expiration
- Policy lifecycle management
- Overlap prevention

### Verification Checklist
- [ ] effective_from field added (required)
- [ ] effective_to field added (nullable)
- [ ] Validation: effective_to > effective_from
- [ ] Overlap detection implemented
- [ ] is_currently_effective property added
- [ ] Date range query methods documented
- [ ] Help text explains date range purpose
- [ ] Model docstring updated

---

## Task 17: Run LeavePolicy Migrations

### Overview
Generate and apply Django migrations for the LeavePolicy model. This creates the database schema for storing leave policies, including relationships to leave types, departments, and designations, with proper constraints and indexes.

### Dependencies
- Task 16: Add Policy Date Range
- LeavePolicy model complete
- LeaveType migrations applied (Task 13)

### Instructions

1. **Verify model completeness**
   - Open `leave_policy.py` model file
   - Review all fields from Tasks 14-16
   - Check Meta class configuration
   - Verify imports in models/__init__.py

2. **Generate migration file**
   - Run: `python manage.py makemigrations leave`
   - System generates second migration file
   - Should be named `0002_leavepolicy.py`

3. **Review migration file**
   - Open generated migration
   - Verify all fields present
   - Check foreign key relationships
   - Verify indexes created

4. **Apply migration to database**
   - Run: `python manage.py migrate leave`
   - System creates policy table
   - Verify migration successful

5. **Verify database schema**
   - Check table created: `leave_leavepolicy`
   - Verify columns and relationships
   - Check indexes and constraints

6. **Test model in Django shell**
   - Create test policy instances
   - Verify relationships work
   - Test validation methods

### Expected Migration File

```python
# leave/migrations/0002_leavepolicy.py

from django.db import migrations, models
import django.db.models.deletion

class Migration(migrations.Migration):
    
    dependencies = [
        ('leave', '0001_initial'),  # LeaveType migration
        ('hr', '0001_initial'),      # Department/Designation
        ('tenants', '0001_initial'), # Tenant
    ]
    
    operations = [
        migrations.CreateModel(
            name='LeavePolicy',
            fields=[
                ('id', models.BigAutoField(...)),
                
                # Core fields
                ('name', models.CharField(max_length=200)),
                ('days_per_year', models.PositiveIntegerField(...)),
                ('is_active', models.BooleanField(default=True)),
                
                # Scope fields
                ('applies_to', models.CharField(...)),
                
                # Date range
                ('effective_from', models.DateField()),
                ('effective_to', models.DateField(...)),
                
                # Relationships
                ('tenant', models.ForeignKey(...)),
                ('leave_type', models.ForeignKey(...)),
                ('department', models.ForeignKey(...)),
                ('designation', models.ForeignKey(...)),
                
                # Timestamps
                ('created_at', models.DateTimeField(...)),
                ('updated_at', models.DateTimeField(...)),
            ],
            options={
                'verbose_name': 'Leave Policy',
                'verbose_name_plural': 'Leave Policies',
                'ordering': ['name'],
                'indexes': [
                    models.Index(fields=['tenant', 'leave_type']),
                    models.Index(fields=['tenant', 'is_active']),
                ],
            },
        ),
    ]
```

### Database Table Structure

```
Table: leave_leavepolicy
════════════════════════════════════════════════════════

Column Name            Type              Constraints
────────────────────────────────────────────────────────
id                    BIGINT            PRIMARY KEY, AUTO_INCREMENT
tenant_id             BIGINT            FOREIGN KEY, NOT NULL
leave_type_id         BIGINT            FOREIGN KEY, NOT NULL
name                  VARCHAR(200)      NOT NULL
days_per_year         INTEGER           NULL, CHECK (>= 0)
applies_to            VARCHAR(20)       NOT NULL, DEFAULT 'ALL'
department_id         BIGINT            FOREIGN KEY, NULL
designation_id        BIGINT            FOREIGN KEY, NULL
effective_from        DATE              NOT NULL
effective_to          DATE              NULL
is_active             BOOLEAN           NOT NULL, DEFAULT TRUE
created_at            TIMESTAMP         NOT NULL
updated_at            TIMESTAMP         NOT NULL

Indexes:
────────────────────────────────────────────────────────
PRIMARY KEY (id)
INDEX (tenant_id, leave_type_id)
INDEX (tenant_id, is_active)
INDEX (effective_from, effective_to)
FOREIGN KEY (tenant_id) → tenants(id)
FOREIGN KEY (leave_type_id) → leave_leavetype(id)
FOREIGN KEY (department_id) → hr_department(id)
FOREIGN KEY (designation_id) → hr_designation(id)

Estimated Size: ~600 bytes per row
Expected Rows: 10-50 per tenant
```

### Django Shell Testing

```python
# Run: python manage.py shell

from apps.leave.models import LeaveType, LeavePolicy
from apps.leave.constants import PolicyScope
from apps.tenants.models import Tenant
from apps.hr.models import Department
from datetime import date

# Get test tenant
tenant = Tenant.objects.first()

# Get leave type
annual_leave = LeaveType.objects.get(
    tenant=tenant,
    code="AL"
)

# Test 1: Create ALL employees policy
all_policy = LeavePolicy.objects.create(
    tenant=tenant,
    name="Standard Annual Leave Policy",
    leave_type=annual_leave,
    days_per_year=14,
    applies_to=PolicyScope.ALL,
    effective_from=date(2026, 1, 1),
    effective_to=None,  # Permanent
    is_active=True
)
print(f"Created: {all_policy}")

# Test 2: Create department-specific policy
sales_dept = Department.objects.get(tenant=tenant, name="Sales")
sales_policy = LeavePolicy.objects.create(
    tenant=tenant,
    name="Sales Department Enhanced Leave",
    leave_type=annual_leave,
    days_per_year=18,
    applies_to=PolicyScope.DEPARTMENT,
    department=sales_dept,
    effective_from=date(2026, 1, 1),
    is_active=True
)
print(f"Created: {sales_policy}")

# Test 3: Check effective status
print(f"All policy effective: {all_policy.is_currently_effective}")
print(f"Sales policy effective: {sales_policy.is_currently_effective}")

# Test 4: Get applicable days
print(f"All policy days: {all_policy.get_applicable_days()}")
print(f"Sales policy days: {sales_policy.get_applicable_days()}")

# Test 5: Query current policies
from datetime import date
current = LeavePolicy.get_current_policies(
    tenant=tenant,
    leave_type=annual_leave
)
print(f"Current policies: {current.count()}")

# Test 6: Validation test (should fail)
try:
    invalid = LeavePolicy(
        tenant=tenant,
        name="Invalid Policy",
        leave_type=annual_leave,
        applies_to=PolicyScope.DEPARTMENT,
        department=None,  # Invalid!
        effective_from=date(2026, 1, 1)
    )
    invalid.clean()
except ValidationError as e:
    print(f"Expected validation error: {e}")
```

### Verification Checklist
- [ ] Migration file generated (`0002_leavepolicy.py`)
- [ ] All fields present in migration
- [ ] Foreign keys to LeaveType, Department, Designation
- [ ] Indexes defined
- [ ] Migration applied successfully
- [ ] Table `leave_leavepolicy` exists
- [ ] Can create policy instances
- [ ] Relationships work correctly
- [ ] Validation methods function
- [ ] Query methods operational

---

## Task 18: Create Default Leave Types Seed

### Overview
Create a Django management command to seed default Sri Lankan leave types into the database. This provides a ready-to-use set of leave types compliant with Sri Lankan labor laws, reducing setup time and ensuring legal compliance for new tenants.

### Dependencies
- Task 13: Run LeaveType Migrations
- Task 17: Run LeavePolicy Migrations
- Django management commands configured

### Instructions

1. **Create management command file**
   - Create `seed_leave_types.py` in `leave/management/commands/`
   - Ensure `__init__.py` files exist in parent directories

2. **Import required modules**
   - Import Django Command base class
   - Import LeaveType model
   - Import constants (LeaveTypeCategory, GenderRestriction)
   - Import Tenant model

3. **Define Command class**
   - Inherit from BaseCommand
   - Add help text explaining command purpose

4. **Add command arguments**
   - --tenant argument: Specify tenant ID or code
   - --all-tenants flag: Seed for all tenants
   - --overwrite flag: Replace existing leave types

5. **Implement handle method**
   - Get tenant(s) based on arguments
   - Create Annual Leave type
   - Create Casual Leave type
   - Create Sick Leave type
   - Create Maternity Leave type
   - Create Paternity Leave type
   - Create No-Pay Leave type
   - Output success messages

6. **Add get_or_create logic**
   - Check if leave type already exists
   - Skip if exists (unless --overwrite)
   - Create if doesn't exist
   - Log actions taken

7. **Add validation**
   - Verify tenant exists
   - Handle errors gracefully
   - Provide clear error messages

8. **Test command execution**
   - Run: `python manage.py seed_leave_types --tenant=<id>`
   - Verify leave types created
   - Check field values correct

### Command File Structure

```python
# leave/management/commands/seed_leave_types.py

from django.core.management.base import BaseCommand, CommandError
from django.db import transaction
from apps.leave.models import LeaveType
from apps.leave.constants import LeaveTypeCategory, GenderRestriction
from apps.tenants.models import Tenant

class Command(BaseCommand):
    help = 'Seeds default Sri Lankan leave types for tenant(s)'
    
    def add_arguments(self, parser):
        parser.add_argument(
            '--tenant',
            type=str,
            help='Tenant ID or code to seed leave types for'
        )
        parser.add_argument(
            '--all-tenants',
            action='store_true',
            help='Seed leave types for all tenants'
        )
        parser.add_argument(
            '--overwrite',
            action='store_true',
            help='Overwrite existing leave types'
        )
    
    def handle(self, *args, **options):
        # Get tenants to process
        tenants = self._get_tenants(options)
        
        if not tenants:
            raise CommandError('No tenants found')
        
        # Process each tenant
        for tenant in tenants:
            self.stdout.write(
                self.style.WARNING(
                    f'\nProcessing tenant: {tenant.name}'
                )
            )
            self._seed_leave_types(tenant, options['overwrite'])
        
        self.stdout.write(
            self.style.SUCCESS(
                f'\nSuccessfully seeded leave types for {len(tenants)} tenant(s)'
            )
        )
    
    def _get_tenants(self, options):
        """Get tenants based on options"""
        if options['all_tenants']:
            return Tenant.objects.all()
        elif options['tenant']:
            # Try by ID first, then by code
            try:
                return [Tenant.objects.get(id=options['tenant'])]
            except Tenant.DoesNotExist:
                try:
                    return [Tenant.objects.get(code=options['tenant'])]
                except Tenant.DoesNotExist:
                    raise CommandError(
                        f'Tenant not found: {options["tenant"]}'
                    )
        else:
            raise CommandError(
                'Specify --tenant=<id> or --all-tenants'
            )
    
    @transaction.atomic
    def _seed_leave_types(self, tenant, overwrite=False):
        """Seed default leave types for tenant"""
        
        leave_types_data = [
            {
                'name': 'Annual Leave',
                'code': 'AL',
                'category': LeaveTypeCategory.ANNUAL,
                'description': (
                    'Annual leave for rest and recreation. '
                    'Requires 14 days advance notice. '
                    'Can carry forward up to 7 days. '
                    'Encashable on resignation.'
                ),
                'color': '#4CAF50',
                'default_days_per_year': 14,
                'max_consecutive_days': 14,
                'max_days_per_request': None,
                'is_paid': True,
                'requires_document': False,
                'applicable_gender': GenderRestriction.ALL,
                'min_service_months': 12,
                'min_notice_days': 14,
                'allow_half_day': True,
            },
            {
                'name': 'Casual Leave',
                'code': 'CL',
                'category': LeaveTypeCategory.CASUAL,
                'description': (
                    'Casual leave for short-term personal matters. '
                    'Cannot carry forward to next year. '
                    'Simple approval process.'
                ),
                'color': '#2196F3',
                'default_days_per_year': 7,
                'max_consecutive_days': 3,
                'max_days_per_request': 2,
                'is_paid': True,
                'requires_document': False,
                'applicable_gender': GenderRestriction.ALL,
                'min_service_months': 0,
                'min_notice_days': 1,
                'allow_half_day': True,
            },
            {
                'name': 'Sick Leave',
                'code': 'SL',
                'category': LeaveTypeCategory.SICK,
                'description': (
                    'Sick leave for illness and medical treatment. '
                    'Medical certificate required for more than 2 consecutive days. '
                    'Full pay if medically justified.'
                ),
                'color': '#FF9800',
                'default_days_per_year': 14,
                'max_consecutive_days': 7,
                'max_days_per_request': None,
                'is_paid': True,
                'requires_document': True,
                'applicable_gender': GenderRestriction.ALL,
                'min_service_months': 0,
                'min_notice_days': 0,
                'allow_half_day': True,
            },
            {
                'name': 'Maternity Leave',
                'code': 'ML',
                'category': LeaveTypeCategory.MATERNITY,
                'description': (
                    'Maternity leave for childbirth and newborn care (female employees). '
                    '84 days (12 weeks) paid leave as per Maternity Benefits Ordinance. '
                    'Medical certificate required. Job security guaranteed.'
                ),
                'color': '#E91E63',
                'default_days_per_year': 84,
                'max_consecutive_days': None,
                'max_days_per_request': None,
                'is_paid': True,
                'requires_document': True,
                'applicable_gender': GenderRestriction.FEMALE,
                'min_service_months': 0,
                'min_notice_days': 14,
                'allow_half_day': False,
            },
            {
                'name': 'Paternity Leave',
                'code': 'PL',
                'category': LeaveTypeCategory.PATERNITY,
                'description': (
                    'Paternity leave for support during childbirth (male employees). '
                    '3 days paid leave within 4 weeks of birth. '
                    'Birth certificate required.'
                ),
                'color': '#9C27B0',
                'default_days_per_year': 3,
                'max_consecutive_days': 3,
                'max_days_per_request': None,
                'is_paid': True,
                'requires_document': True,
                'applicable_gender': GenderRestriction.MALE,
                'min_service_months': 0,
                'min_notice_days': 0,
                'allow_half_day': False,
            },
            {
                'name': 'No-Pay Leave',
                'code': 'NPL',
                'category': LeaveTypeCategory.NO_PAY,
                'description': (
                    'Unpaid leave by mutual agreement for extended absences. '
                    'Requires management approval. '
                    'Duration negotiated case-by-case.'
                ),
                'color': '#9E9E9E',
                'default_days_per_year': 0,
                'max_consecutive_days': 90,
                'max_days_per_request': 30,
                'is_paid': False,
                'requires_document': False,
                'applicable_gender': GenderRestriction.ALL,
                'min_service_months': 6,
                'min_notice_days': 30,
                'allow_half_day': True,
            },
        ]
        
        created_count = 0
        updated_count = 0
        skipped_count = 0
        
        for data in leave_types_data:
            code = data['code']
            
            # Check if exists
            try:
                leave_type = LeaveType.objects.get(
                    tenant=tenant,
                    code=code
                )
                
                if overwrite:
                    # Update existing
                    for key, value in data.items():
                        setattr(leave_type, key, value)
                    leave_type.save()
                    updated_count += 1
                    self.stdout.write(
                        self.style.WARNING(
                            f'  Updated: {leave_type.name} ({code})'
                        )
                    )
                else:
                    # Skip existing
                    skipped_count += 1
                    self.stdout.write(
                        f'  Skipped: {leave_type.name} ({code}) - already exists'
                    )
            
            except LeaveType.DoesNotExist:
                # Create new
                leave_type = LeaveType.objects.create(
                    tenant=tenant,
                    **data
                )
                created_count += 1
                self.stdout.write(
                    self.style.SUCCESS(
                        f'  Created: {leave_type.name} ({code})'
                    )
                )
        
        self.stdout.write(
            f'\n  Summary: {created_count} created, '
            f'{updated_count} updated, {skipped_count} skipped'
        )
```

### Default Leave Types Specification

```
Sri Lankan Standard Leave Types
════════════════════════════════════════════════════════

1. Annual Leave (AL)
────────────────────────────────────────────────────────
Category: ANNUAL
Days: 14 per year
Paid: Yes
Document: No
Gender: All
Min Service: 12 months
Notice: 14 days
Half-day: Yes
Max Consecutive: 14 days
Color: Green (#4CAF50)
Legal: Shop & Office Employees Act

2. Casual Leave (CL)
────────────────────────────────────────────────────────
Category: CASUAL
Days: 7 per year
Paid: Yes
Document: No
Gender: All
Min Service: None
Notice: 1 day
Half-day: Yes
Max Consecutive: 3 days
Max Per Request: 2 days
Color: Blue (#2196F3)
Legal: Industry practice

3. Sick Leave (SL)
────────────────────────────────────────────────────────
Category: SICK
Days: 14 per year
Paid: Yes
Document: Yes (>2 days)
Gender: All
Min Service: None
Notice: None (emergency)
Half-day: Yes
Max Consecutive: 7 days
Color: Orange (#FF9800)
Legal: Employment practices

4. Maternity Leave (ML)
────────────────────────────────────────────────────────
Category: MATERNITY
Days: 84 (12 weeks)
Paid: Yes
Document: Yes (medical cert)
Gender: Female only
Min Service: None
Notice: 14 days
Half-day: No
Color: Pink (#E91E63)
Legal: Maternity Benefits Ordinance

5. Paternity Leave (PL)
────────────────────────────────────────────────────────
Category: PATERNITY
Days: 3
Paid: Yes
Document: Yes (birth cert)
Gender: Male only
Min Service: None
Notice: None (flexible)
Half-day: No
Max Consecutive: 3 days
Color: Purple (#9C27B0)
Legal: Recent legislation

6. No-Pay Leave (NPL)
────────────────────────────────────────────────────────
Category: NO_PAY
Days: 0 (case-by-case)
Paid: No
Document: No
Gender: All
Min Service: 6 months
Notice: 30 days
Half-day: Yes
Max Consecutive: 90 days
Max Per Request: 30 days
Color: Grey (#9E9E9E)
Legal: By mutual agreement
```

### Command Usage Examples

```bash
# Seed for specific tenant by ID
python manage.py seed_leave_types --tenant=1

# Seed for specific tenant by code
python manage.py seed_leave_types --tenant=TENANT001

# Seed for all tenants
python manage.py seed_leave_types --all-tenants

# Overwrite existing leave types
python manage.py seed_leave_types --tenant=1 --overwrite

# Dry run with verbose output
python manage.py seed_leave_types --tenant=1 --verbosity=2
```

### Expected Output

```
Processing tenant: LankaCommerce Pvt Ltd

  Created: Annual Leave (AL)
  Created: Casual Leave (CL)
  Created: Sick Leave (SL)
  Created: Maternity Leave (ML)
  Created: Paternity Leave (PL)
  Created: No-Pay Leave (NPL)

  Summary: 6 created, 0 updated, 0 skipped

Successfully seeded leave types for 1 tenant(s)
```

### Post-Seed Verification

```python
# Verify in Django shell
from apps.leave.models import LeaveType
from apps.tenants.models import Tenant

tenant = Tenant.objects.first()
leave_types = LeaveType.objects.filter(tenant=tenant)

print(f"Total leave types: {leave_types.count()}")  # Should be 6

# Check each type
for lt in leave_types:
    print(f"\n{lt.name} ({lt.code})")
    print(f"  Category: {lt.get_category_display()}")
    print(f"  Days: {lt.default_days_per_year}")
    print(f"  Paid: {lt.is_paid}")
    print(f"  Gender: {lt.get_applicable_gender_display()}")
    print(f"  Min Service: {lt.min_service_months} months")
    print(f"  Notice: {lt.min_notice_days} days")
```

### Expected Outcome
- Management command created
- Default leave types seeded
- Sri Lankan compliance ensured
- Ready for immediate use

### Verification Checklist
- [ ] Command file created in correct location
- [ ] `__init__.py` files exist
- [ ] Command imports correct modules
- [ ] Help text explains command
- [ ] Arguments defined (tenant, all-tenants, overwrite)
- [ ] All 6 leave types included
- [ ] Field values match Sri Lankan standards
- [ ] Command executes successfully
- [ ] Leave types created in database
- [ ] Validation works correctly

---

## Summary

This document completed the leave management foundation:

### Completed Features
- ✅ Gender restrictions (MALE, FEMALE, ALL)
- ✅ Service requirements (min_service_months)
- ✅ Advance notice requirements (min_notice_days)
- ✅ LeaveType migrations applied
- ✅ LeavePolicy model with scope targeting
- ✅ Policy date ranges (effective_from, effective_to)
- ✅ LeavePolicy migrations applied
- ✅ Default Sri Lankan leave types seed command

### Key Achievements
1. **Gender Compliance** - Maternity (female), Paternity (male) enforcement
2. **Service-Based Eligibility** - Annual leave after 12 months
3. **Planning Support** - Advance notice requirements with override capability
4. **Flexible Policies** - Department/designation-specific entitlements
5. **Time-Bound Policies** - Temporary policies with automatic expiration
6. **Quick Setup** - Seed command for instant Sri Lankan compliance

### Complete LeaveType Model Fields
| Field | Type | Purpose |
|-------|------|---------|
| name | CharField | Human-readable name |
| code | CharField | Unique identifier |
| category | Choice | ANNUAL, CASUAL, SICK, etc. |
| description | TextField | Detailed rules |
| color | CharField | Calendar visualization |
| default_days_per_year | Integer | Standard entitlement |
| max_consecutive_days | Integer | Consecutive limit |
| max_days_per_request | Integer | Per-application limit |
| is_paid | Boolean | Paid/unpaid |
| requires_document | Boolean | Document requirement |
| applicable_gender | Choice | ALL, MALE, FEMALE |
| min_service_months | Integer | Service requirement |
| min_notice_days | Integer | Advance notice |
| is_active | Boolean | Availability |
| allow_half_day | Boolean | Half-day option |

### Complete LeavePolicy Model Fields
| Field | Type | Purpose |
|-------|------|---------|
| name | CharField | Policy name |
| leave_type | ForeignKey | Associated leave type |
| days_per_year | Integer | Override days |
| applies_to | Choice | ALL, DEPARTMENT, DESIGNATION |
| department | ForeignKey | Target department |
| designation | ForeignKey | Target designation |
| effective_from | DateField | Start date |
| effective_to | DateField | End date |
| is_active | Boolean | Active status |

### Next Steps
This completes Group-A. The system is now ready for:
- Group-B: Leave Balance & Accrual tracking
- Group-C: Leave Application workflow
- Group-D: Leave Approval process
- Group-E: Leave Calendar & Reporting
- Group-F: Leave Integration with Payroll

---

**Document Status:** ✅ Complete  
**Total Tasks:** 9  
**Total Lines:** ~1397
