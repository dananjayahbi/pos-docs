# Tasks 01-06: Django App Setup and Choice Enumerations

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 01 - Employee Management  
> **Group:** A - Employee Model & Core Fields  
> **Document:** 01 of 03  
> **Tasks Covered:** 01, 02, 03, 04, 05, 06

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-07-12_Model-Core-Name-User-NIC.md](02_Tasks-07-12_Model-Core-Name-User-NIC.md)

---

## Document Overview

This document covers the foundational setup for the employee management system, including creating the Django app structure, registering the app in the project, and defining all choice enumerations (EmploymentType, EmployeeStatus, Gender, and MaritalStatus) that will be used throughout the employee module.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 01 | Create employees Django App | Low | 15 min |
| 02 | Register employees App | Low | 10 min |
| 03 | Define EmploymentType Choices | Low | 15 min |
| 04 | Define EmployeeStatus Choices | Low | 15 min |
| 05 | Define Gender Choices | Low | 10 min |
| 06 | Define MaritalStatus Choices | Low | 10 min |

---

## Task 01: Create Employees Django App

### Overview
Create a new Django application named `employees` to manage all employee-related functionality. This app will contain models, services, validators, and administrative interfaces for employee records, including personal details, employment information, documents, and history tracking.

### Dependencies
- Django project structure is established
- Multi-tenancy infrastructure is configured
- Core utilities and base models are available

### Instructions

1. **Navigate to apps directory**
   - Open terminal
   - Navigate to project root's `apps/` directory
   - Ensure you're in the correct location

2. **Create Django app**
   - Run Django's startapp command
   - App name: `employees`
   - Verify app creation successful

3. **Create subdirectory structure**
   - Create `models/` subdirectory for model organization
   - Create `validators/` subdirectory for custom validators
   - Create `services/` subdirectory for business logic
   - Create `admin/` subdirectory for Django admin configurations

4. **Create package initialization files**
   - Add `__init__.py` to `models/` directory
   - Add `__init__.py` to `validators/` directory
   - Add `__init__.py` to `services/` directory
   - Add `__init__.py` to `admin/` directory

5. **Create constants module**
   - Create `constants.py` in app root
   - Will contain employment types, statuses, and other constants

6. **Update app configuration**
   - Open `apps.py`
   - Set appropriate app name and configuration
   - Add verbose_name for admin display

### Directory Structure
```
apps/employees/
├── __init__.py                    # Package initialization
├── apps.py                        # App configuration
├── constants.py                   # Choice constants
├── models/
│   └── __init__.py               # Models package init
├── validators/
│   └── __init__.py               # Validators package init
├── services/
│   └── __init__.py               # Services package init
├── admin/
│   └── __init__.py               # Admin package init
├── views.py                      # API views
├── serializers.py                # DRF serializers
└── migrations/
    └── __init__.py               # Migrations directory
```

### App Configuration Details

The employees app will serve as the central hub for all employee-related functionality including:

| Component | Purpose |
|-----------|---------|
| Models | Employee data structure and relationships |
| Validators | NIC validation, field constraints |
| Services | Business logic for employee operations |
| Admin | Django admin interface customization |
| Serializers | API data transformation |
| Views | REST API endpoints |

### Expected Outcome
- Functional Django app structure
- Organized subdirectories for components
- Foundation for employee management
- Ready for model and service implementation

### Verification Checklist
- [ ] `apps/employees/` directory exists
- [ ] `apps.py` configured correctly
- [ ] `constants.py` file created
- [ ] `models/` subdirectory with `__init__.py`
- [ ] `validators/` subdirectory with `__init__.py`
- [ ] `services/` subdirectory with `__init__.py`
- [ ] `admin/` subdirectory with `__init__.py`
- [ ] `migrations/` directory exists

---

## Task 02: Register Employees App

### Overview
Register the employees app in Django's TENANT_APPS configuration to enable it for all tenants. This ensures that employee-related tables are created in each tenant's schema and that the app is available for all tenant operations.

### Dependencies
- Task 01: Create employees Django App
- Django settings configured with tenant support
- TENANT_APPS configuration exists

### Instructions

1. **Locate Django settings**
   - Navigate to project settings file
   - Find TENANT_APPS configuration section
   - Identify where tenant-specific apps are registered

2. **Add employees app**
   - Add 'apps.employees' to TENANT_APPS list
   - Place appropriately in the list (after core apps)
   - Maintain alphabetical or logical ordering

3. **Verify app configuration**
   - Check app name matches directory structure
   - Ensure correct import path
   - Confirm no typos in app name

4. **Update documentation**
   - Document app purpose in settings comments
   - Note dependencies if any
   - Add any configuration requirements

### TENANT_APPS Configuration

The employees app should be registered in TENANT_APPS because:

| Reason | Explanation |
|--------|-------------|
| Multi-tenant data | Employee records are tenant-specific |
| Schema separation | Each tenant has own employee tables |
| Data isolation | Tenant A cannot access Tenant B's employees |
| Scalability | Independent employee data per tenant |

### App Registration Location

```
TENANT_APPS Configuration Structure
═══════════════════════════════════

TENANT_APPS = [
    # Django core apps
    'django.contrib.contenttypes',
    'django.contrib.auth',
    
    # Custom tenant apps
    'apps.inventory',        # Inventory management
    'apps.pos',             # Point of Sale
    'apps.employees',       # ← Add here
    'apps.payroll',         # (Future: Payroll management)
]
```

### Registration Impact

When registered in TENANT_APPS, the system will:

```
Tenant Schema Creation Flow
═══════════════════════════

1. New Tenant Created
         │
         ▼
2. Tenant Schema Generated
         │
         ▼
3. Employee Tables Created in Schema
         │
         ├── employees_employee
         ├── employees_employeedocument
         ├── employees_employeehistory
         └── (other employee tables)
         │
         ▼
4. Tenant Ready with Employee Management
```

### Expected Outcome
- Employees app available to all tenants
- Employee tables created in tenant schemas
- App accessible in Django admin per tenant
- Ready for model migrations

### Verification Checklist
- [ ] 'apps.employees' added to TENANT_APPS
- [ ] App name spelled correctly
- [ ] No import errors when loading settings
- [ ] Settings file syntax valid
- [ ] Documentation comments added

---

## Task 03: Define EmploymentType Choices

### Overview
Define the EmploymentType choice enumeration that categorizes employees by their employment arrangement. These types determine contractual relationship, benefits eligibility, and employment terms across the organization.

### Dependencies
- Task 01: Create employees Django App
- Constants module exists

### Instructions

1. **Open constants.py file**
   - Navigate to `apps/employees/constants.py`
   - Add module docstring explaining purpose

2. **Add employment type documentation**
   - Document each employment type
   - Explain typical use cases
   - Note legal/contractual implications

3. **Define EMPLOYMENT_TYPES constant**
   - Create tuple of employment type choices
   - Follow Django's choices pattern (value, display_name)
   - Include all standard employment types

4. **Define FULL_TIME constant**
   - Value: 'full_time'
   - Display: 'Full Time'
   - Purpose: Permanent full-time employees

5. **Define PART_TIME constant**
   - Value: 'part_time'
   - Display: 'Part Time'
   - Purpose: Regular part-time employees

6. **Define CONTRACT constant**
   - Value: 'contract'
   - Display: 'Contract'
   - Purpose: Fixed-term contract employees

7. **Define INTERN constant**
   - Value: 'intern'
   - Display: 'Intern'
   - Purpose: Internship or training positions

8. **Define PROBATION constant**
   - Value: 'probation'
   - Display: 'Probation'
   - Purpose: Probationary period employees

### Employment Type Details

| Constant | Value | Display Name | Typical Characteristics |
|----------|-------|--------------|------------------------|
| FULL_TIME | 'full_time' | Full Time | Permanent, 40+ hrs/week, full benefits |
| PART_TIME | 'part_time' | Part Time | Ongoing, <40 hrs/week, partial benefits |
| CONTRACT | 'contract' | Contract | Fixed term, specific project, limited benefits |
| INTERN | 'intern' | Intern | Training, temporary, stipend/minimal pay |
| PROBATION | 'probation' | Probation | Trial period, 3-6 months, potential permanent |

### Employment Type Usage Scenarios

#### Full Time Employment
- **Standard hours:** 40-48 hours per week
- **Benefits:** Full medical, EPF, ETF, paid leave
- **Job security:** Permanent until resignation/termination
- **Salary:** Monthly fixed salary
- **Typical roles:** Core staff positions
- **Sri Lanka context:** Standard employment under Shop & Office Act

#### Part Time Employment
- **Standard hours:** 20-30 hours per week
- **Benefits:** Proportional to hours worked
- **Job security:** Ongoing but flexible
- **Salary:** Hourly or pro-rated monthly
- **Typical roles:** Support staff, specialized consultants
- **Sri Lanka context:** Common in retail, hospitality

#### Contract Employment
- **Duration:** Fixed term (6 months, 1 year, project-based)
- **Benefits:** As per contract terms
- **Job security:** Until contract end
- **Salary:** Monthly or milestone-based
- **Typical roles:** Project staff, seasonal workers
- **Sri Lanka context:** Common in IT, construction, events

#### Internship
- **Duration:** 3-12 months training period
- **Benefits:** Usually minimal or none
- **Job security:** Temporary, training-focused
- **Salary:** Stipend or allowance
- **Typical roles:** University students, fresh graduates
- **Sri Lanka context:** Common in corporate, IT, professional firms

#### Probation
- **Duration:** 3-6 months trial period
- **Benefits:** Often full or nearly full
- **Job security:** Conditional on performance
- **Salary:** Sometimes reduced during probation
- **Typical roles:** New hires in permanent positions
- **Sri Lanka context:** Standard practice before confirmation

### Sri Lanka Labor Law Context

```
Employment Type Compliance Matrix
═════════════════════════════════

Type          | EPF/ETF | Gratuity | Leave | Notice Period |
─────────────────────────────────────────────────────────────
Full Time     |   Yes   |   Yes    |  Yes  |   1 month     |
Part Time     | Pro-rata|   Yes*   |  Yes* |   2 weeks     |
Contract      |  As per |   No**   |  As   |   Per         |
              | contract|          | per   |  contract     |
Intern        |   No    |   No     |  No   |   None/1 week |
Probation     |   Yes   |   No***  |  Yes  |   1-2 weeks   |

* Pro-rated based on hours
** Not eligible if contract < 1 year
*** Eligible after confirmation
```

### Expected Outcome
- Clear employment type categorization
- Consistent type values across system
- Foundation for employment contracts
- Support for various hiring scenarios

### Verification Checklist
- [ ] EMPLOYMENT_TYPES tuple defined
- [ ] FULL_TIME constant created
- [ ] PART_TIME constant created
- [ ] CONTRACT constant created
- [ ] INTERN constant created
- [ ] PROBATION constant created
- [ ] All constants follow naming convention
- [ ] Display names are user-friendly
- [ ] Documentation comments added

---

## Task 04: Define EmployeeStatus Choices

### Overview
Define the EmployeeStatus choice enumeration that tracks the current employment status of each employee. These statuses control system access, payroll processing, and reporting, ensuring accurate employee lifecycle management.

### Dependencies
- Task 01: Create employees Django App
- Constants module exists

### Instructions

1. **Open constants.py file**
   - Continue in `apps/employees/constants.py`
   - Add employee status section

2. **Add status documentation**
   - Document each status type
   - Explain status transitions
   - Note system impacts

3. **Define EMPLOYEE_STATUSES constant**
   - Create tuple of employee status choices
   - Follow Django's choices pattern
   - Include all lifecycle statuses

4. **Define ACTIVE constant**
   - Value: 'active'
   - Display: 'Active'
   - Purpose: Currently employed and working

5. **Define INACTIVE constant**
   - Value: 'inactive'
   - Display: 'Inactive'
   - Purpose: Temporarily not working

6. **Define ON_LEAVE constant**
   - Value: 'on_leave'
   - Display: 'On Leave'
   - Purpose: Extended leave (maternity, medical, etc.)

7. **Define TERMINATED constant**
   - Value: 'terminated'
   - Display: 'Terminated'
   - Purpose: Employment terminated by employer

8. **Define RESIGNED constant**
   - Value: 'resigned'
   - Display: 'Resigned'
   - Purpose: Voluntarily left employment

### Employee Status Details

| Constant | Value | Display Name | System Access | Payroll | Reporting |
|----------|-------|--------------|---------------|---------|-----------|
| ACTIVE | 'active' | Active | Yes | Yes | Active employees |
| INACTIVE | 'inactive' | Inactive | No | No* | Inactive employees |
| ON_LEAVE | 'on_leave' | On Leave | Limited | Yes** | Leave employees |
| TERMINATED | 'terminated' | Terminated | No | No | Terminated records |
| RESIGNED | 'resigned' | Resigned | No | No | Resigned records |

*May receive settlement payments  
**May receive leave pay, depending on leave type

### Employee Status Lifecycle

```
Employee Status State Machine
═════════════════════════════

        ┌─────────────┐
        │   ACTIVE    │◄──────────────┐
        └─────┬───────┘               │
              │                       │
    ┌─────────┼─────────┬─────────────┤
    │         │         │             │
    ▼         ▼         ▼             │
┌──────┐  ┌──────┐  ┌──────────┐     │
│LEAVE │  │INACT │  │TERMINATED│     │
└──┬───┘  └──────┘  └──────────┘     │
   │                                  │
   └──────────────────────────────────┘

RESIGNED (Terminal state - no return)
```

### Status Usage Scenarios

#### Active Status
- **Description:** Employee is currently working
- **System access:** Full access to assigned modules
- **Payroll:** Regular salary processing
- **Attendance:** Must clock in/out daily
- **Leave:** Can apply for leave
- **Typical duration:** Ongoing until status change
- **Transitions to:** INACTIVE, ON_LEAVE, TERMINATED, RESIGNED

#### Inactive Status
- **Description:** Temporarily not working
- **System access:** Access suspended
- **Payroll:** Not included in regular payroll
- **Attendance:** Not tracked
- **Leave:** Cannot apply for leave
- **Common reasons:** Unpaid leave, suspension, temporary layoff
- **Transitions to:** ACTIVE, TERMINATED, RESIGNED

#### On Leave Status
- **Description:** Extended leave period
- **System access:** Limited or no access
- **Payroll:** Depends on leave type (paid/unpaid)
- **Attendance:** Leave marked automatically
- **Leave balance:** May be depleted
- **Common types:** Maternity (84 days), Medical, Study
- **Transitions to:** ACTIVE, RESIGNED, TERMINATED

#### Terminated Status
- **Description:** Employment ended by employer
- **System access:** Access revoked immediately
- **Payroll:** Final settlement processed
- **Attendance:** No longer tracked
- **Leave:** Not applicable
- **Common reasons:** Poor performance, misconduct, redundancy
- **Final state:** Record retained for historical purposes

#### Resigned Status
- **Description:** Employee voluntarily left
- **System access:** Access revoked after notice period
- **Payroll:** Paid through last working day
- **Attendance:** Tracked during notice period
- **Leave:** Final settlement of leave balance
- **Notice period:** As per contract (usually 1 month)
- **Final state:** Record retained for historical purposes

### Status Transition Rules

```
Valid Status Transitions
════════════════════════

FROM          → TO                  Condition
────────────────────────────────────────────────
ACTIVE        → ON_LEAVE           Leave approved
ACTIVE        → INACTIVE           Temporary suspension
ACTIVE        → TERMINATED         Termination processed
ACTIVE        → RESIGNED           Resignation accepted

ON_LEAVE      → ACTIVE             Leave ended, returned to work
ON_LEAVE      → RESIGNED           Resigned while on leave
ON_LEAVE      → TERMINATED         Terminated while on leave

INACTIVE      → ACTIVE             Reactivated
INACTIVE      → TERMINATED         Termination finalized
INACTIVE      → RESIGNED           Resignation during suspension

TERMINATED    → (None)             Terminal state
RESIGNED      → (None)             Terminal state
```

### Sri Lanka Employment Context

#### Maternity Leave
- **Duration:** 84 working days (up to 2 children)
- **Status:** ON_LEAVE
- **Pay:** Full pay for first 84 days
- **EPF/ETF:** Continues during leave

#### Medical Leave
- **Short term:** ACTIVE status (few days)
- **Long term:** ON_LEAVE status (weeks/months)
- **Pay:** As per company policy or medical certificate

#### Termination Process
- **Notice:** As per contract or labor law
- **Settlement:** Gratuity (if applicable), leave encashment
- **Status change:** ACTIVE → TERMINATED
- **Access:** Revoked immediately

#### Resignation Process
- **Notice period:** Usually 1 month
- **Status during notice:** ACTIVE
- **Status after last day:** RESIGNED
- **Settlement:** Leave balance, gratuity (if applicable)

### Expected Outcome
- Clear employee status tracking
- Controlled status transitions
- System access management
- Accurate payroll processing

### Verification Checklist
- [ ] EMPLOYEE_STATUSES tuple defined
- [ ] ACTIVE constant created
- [ ] INACTIVE constant created
- [ ] ON_LEAVE constant created
- [ ] TERMINATED constant created
- [ ] RESIGNED constant created
- [ ] All constants follow naming convention
- [ ] Display names are user-friendly
- [ ] Status transition logic documented

---

## Task 05: Define Gender Choices

### Overview
Define the Gender choice enumeration for employee demographic information. This field supports diversity and inclusion while maintaining privacy options, and is used for reporting and compliance purposes.

### Dependencies
- Task 01: Create employees Django App
- Constants module exists

### Instructions

1. **Open constants.py file**
   - Continue in `apps/employees/constants.py`
   - Add gender choices section

2. **Add gender field documentation**
   - Document purpose and usage
   - Note privacy and sensitivity
   - Explain compliance requirements

3. **Define GENDERS constant**
   - Create tuple of gender choices
   - Follow Django's choices pattern
   - Include inclusive options

4. **Define MALE constant**
   - Value: 'male'
   - Display: 'Male'
   - Standard gender option

5. **Define FEMALE constant**
   - Value: 'female'
   - Display: 'Female'
   - Standard gender option

6. **Define OTHER constant**
   - Value: 'other'
   - Display: 'Other'
   - Inclusive option for non-binary identities

7. **Define PREFER_NOT_TO_SAY constant**
   - Value: 'prefer_not_to_say'
   - Display: 'Prefer Not to Say'
   - Privacy option

### Gender Choice Details

| Constant | Value | Display Name | Purpose |
|----------|-------|--------------|---------|
| MALE | 'male' | Male | Male gender identification |
| FEMALE | 'female' | Female | Female gender identification |
| OTHER | 'other' | Other | Non-binary or other gender identities |
| PREFER_NOT_TO_SAY | 'prefer_not_to_say' | Prefer Not to Say | Privacy protection option |

### Gender Field Usage

#### Personal Information
- **Purpose:** Demographic record keeping
- **Privacy:** Sensitive personal information
- **Usage:** Internal HR records only
- **Display:** Limited to authorized personnel

#### Reporting and Analytics
- **Diversity reports:** Gender distribution statistics
- **Compliance:** Equal opportunity reporting
- **Anonymization:** Aggregated data only
- **Privacy:** Individual identity protected

#### Leave Entitlements
- **Maternity leave:** Applicable to female employees
- **Paternity leave:** Applicable to male employees
- **Parental leave:** Gender-neutral leave options

### Gender Field Best Practices

```
Gender Field Handling Guidelines
═══════════════════════════════

✓ DO:
  - Treat as sensitive personal data
  - Allow employee to self-identify
  - Respect privacy preferences
  - Use for legitimate business purposes only
  - Maintain confidentiality

✗ DON'T:
  - Display publicly
  - Use for discriminatory purposes
  - Force selection if not required
  - Share without authorization
  - Make assumptions based on appearance
```

### Sri Lanka Cultural Context

#### Gender Recognition
- **Legal recognition:** Male and Female primarily
- **Social context:** Traditional gender binary predominant
- **Workplace:** Equal opportunity employer principles
- **Sensitivity:** Respect for all gender identities

#### Religious and Cultural Considerations
- **Diversity:** Multi-ethnic, multi-religious society
- **Privacy:** Personal information highly valued
- **Respect:** Cultural sensitivity in data collection
- **Equality:** Constitutional guarantee of equal rights

### Gender Data Usage Scenarios

| Scenario | Use Gender Field | Notes |
|----------|------------------|-------|
| Employee profile | Yes | Personal information section |
| Leave applications | Yes* | Determine leave type eligibility |
| Payroll processing | No | Gender not relevant for salary |
| Performance review | No | Merit-based evaluation only |
| Diversity reporting | Yes | Aggregated statistics only |
| System access | No | Role-based, not gender-based |

*Only for gender-specific leave types

### Privacy and Compliance

#### Data Protection
- **Storage:** Encrypted in database
- **Access control:** HR personnel only
- **Audit trail:** Track who accesses gender data
- **Retention:** As per labor law requirements

#### Equal Opportunity
- **Non-discrimination:** Gender not used for hiring decisions
- **Equal pay:** Same work, same pay regardless of gender
- **Career advancement:** Merit-based promotions
- **Workplace safety:** Ensure safe environment for all

### Expected Outcome
- Inclusive gender options
- Privacy-respecting choices
- Compliance with diversity standards
- Sensitive data handling

### Verification Checklist
- [ ] GENDERS tuple defined
- [ ] MALE constant created
- [ ] FEMALE constant created
- [ ] OTHER constant created
- [ ] PREFER_NOT_TO_SAY constant created
- [ ] All constants follow naming convention
- [ ] Display names are respectful and inclusive
- [ ] Privacy considerations documented

---

## Task 06: Define MaritalStatus Choices

### Overview
Define the MaritalStatus choice enumeration for employee personal information. This field is used for benefits administration, emergency contact validation, and statistical purposes while respecting employee privacy.

### Dependencies
- Task 01: Create employees Django App
- Constants module exists

### Instructions

1. **Open constants.py file**
   - Continue in `apps/employees/constants.py`
   - Add marital status section

2. **Add marital status documentation**
   - Document purpose and usage
   - Note privacy considerations
   - Explain benefits implications

3. **Define MARITAL_STATUSES constant**
   - Create tuple of marital status choices
   - Follow Django's choices pattern
   - Include all common statuses

4. **Define SINGLE constant**
   - Value: 'single'
   - Display: 'Single'
   - Unmarried status

5. **Define MARRIED constant**
   - Value: 'married'
   - Display: 'Married'
   - Legally married status

6. **Define DIVORCED constant**
   - Value: 'divorced'
   - Display: 'Divorced'
   - Previously married, divorced

7. **Define WIDOWED constant**
   - Value: 'widowed'
   - Display: 'Widowed'
   - Previously married, spouse deceased

### Marital Status Details

| Constant | Value | Display Name | Benefits Impact |
|----------|-------|--------------|-----------------|
| SINGLE | 'single' | Single | Individual benefits |
| MARRIED | 'married' | Married | Spouse/family benefits eligible |
| DIVORCED | 'divorced' | Divorced | Individual benefits, possible dependents |
| WIDOWED | 'widowed' | Widowed | Individual benefits, possible dependents |

### Marital Status Usage Scenarios

#### Benefits Administration
- **Health insurance:** Family coverage eligibility
- **Life insurance:** Beneficiary designation
- **Emergency contact:** Spouse as primary contact
- **Allowances:** Some companies provide marriage allowances

#### Tax and Payroll
- **Tax deductions:** May affect tax calculations
- **EPF nominations:** Spouse as nominee
- **Gratuity:** Beneficiary designation
- **Salary advances:** Family responsibility consideration

#### Leave Entitlements
- **Marriage leave:** Eligible when changing from single to married
- **Parental leave:** Available to married employees with children
- **Compassionate leave:** Spouse's family emergencies
- **Bereavement leave:** Spouse's death

### Marital Status in Sri Lanka Context

#### Cultural Aspects
- **Social significance:** Marital status culturally important
- **Family structure:** Strong family ties and extended families
- **Privacy:** Personal information but commonly shared
- **Legal recognition:** Registered marriages and traditional customs

#### Employee Benefits Context

```
Benefits Matrix by Marital Status
═════════════════════════════════

Benefit Type       | Single | Married | Divorced | Widowed |
────────────────────────────────────────────────────────────
Health Insurance   |  Self  | Family  |   Self*  |  Self*  |
Life Insurance     |  Yes   |   Yes   |   Yes    |   Yes   |
Beneficiary        | Parent | Spouse  |  Parent/ |  Child/ |
                   |        |         |   Child  | Parent  |
Marriage Leave     |  Yes** |   No    |   No     |   No    |
Family Allowance   |  No    |   Yes   |   No***  |   No*** |

*  May include dependent children
** When getting married
*** May include if supporting dependent children
```

#### Marriage Leave in Sri Lanka
- **Duration:** Typically 2-3 days
- **Eligibility:** First marriage or remarriage
- **Documentation:** Marriage certificate required
- **Status change:** SINGLE → MARRIED

#### Dependent Benefits
- **Married with children:** Full family benefits
- **Divorced with custody:** Child benefits continue
- **Widowed with dependents:** Dependent benefits continue
- **Single:** Individual benefits only

### Privacy and Sensitivity

#### Data Handling
- **Sensitive information:** Personal and private
- **Voluntary disclosure:** Employee can choose to provide
- **Update capability:** Allow status changes over time
- **Confidentiality:** Limited access to HR personnel

#### Status Changes
```
Common Marital Status Transitions
═════════════════════════════════

SINGLE     →  MARRIED     (Marriage)
MARRIED    →  DIVORCED    (Divorce)
MARRIED    →  WIDOWED     (Spouse deceased)
DIVORCED   →  MARRIED     (Remarriage)
WIDOWED    →  MARRIED     (Remarriage)
```

### Benefits Nomination Impact

| Status | Primary Beneficiary | Typical Life Insurance Nominee |
|--------|-------------------|-------------------------------|
| Single | Parent | Parents (divided equally) |
| Married | Spouse | Spouse (100%) or Spouse + Children |
| Divorced | Child/Parent | Children (if any) or Parents |
| Widowed | Child/Parent | Children (if any) or Parents |

### Expected Outcome
- Comprehensive marital status tracking
- Benefits administration support
- Privacy-respecting implementation
- Support for status changes

### Verification Checklist
- [ ] MARITAL_STATUSES tuple defined
- [ ] SINGLE constant created
- [ ] MARRIED constant created
- [ ] DIVORCED constant created
- [ ] WIDOWED constant created
- [ ] All constants follow naming convention
- [ ] Display names are clear and respectful
- [ ] Benefits implications documented
- [ ] Privacy considerations noted

---

## Summary

This document established the foundational infrastructure for employee management:

### Completed Infrastructure
- ✅ Employees Django app created and structured
- ✅ App registered in TENANT_APPS for multi-tenancy
- ✅ EmploymentType choices (FULL_TIME, PART_TIME, CONTRACT, INTERN, PROBATION)
- ✅ EmployeeStatus choices (ACTIVE, INACTIVE, ON_LEAVE, TERMINATED, RESIGNED)
- ✅ Gender choices (MALE, FEMALE, OTHER, PREFER_NOT_TO_SAY)
- ✅ MaritalStatus choices (SINGLE, MARRIED, DIVORCED, WIDOWED)

### Key Achievements
1. **Organized Structure** - Clean app architecture with dedicated subdirectories
2. **Multi-tenant Ready** - App registered for tenant-specific employee data
3. **Employment Types** - Comprehensive categorization of employment arrangements
4. **Status Lifecycle** - Complete employee status tracking from hire to termination
5. **Inclusive Options** - Gender and marital status choices respecting diversity and privacy
6. **Sri Lanka Context** - Choices aligned with local labor laws and cultural considerations

### Next Steps
Proceed to [02_Tasks-07-12_Model-Core-Name-User-NIC.md](02_Tasks-07-12_Model-Core-Name-User-NIC.md) to implement the core Employee model with name fields, user account linking, profile photo, and Sri Lankan NIC validation.

---

**Document Status:** ✅ Complete  
**Total Tasks:** 6  
**Estimated Implementation Time:** 1 hour 15 minutes
