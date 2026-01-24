# Tasks 01-09: Django App, LeaveType Model & Core Fields

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 04 - Leave Management  
> **Group:** A - Leave Type & Policy Models  
> **Document:** 01 of 02  
> **Tasks Covered:** 01, 02, 03, 04, 05, 06, 07, 08, 09

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-10-18_Restrictions-Policy-Seed.md](02_Tasks-10-18_Restrictions-Policy-Seed.md)

---

## Document Overview

This document covers the foundation of the leave management system, including the creation of the leave Django app, leave type category constants, and the core LeaveType model with essential fields. These elements establish the base infrastructure for comprehensive leave management in compliance with Sri Lankan labor laws.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 01 | Create leave Django App | Low | 15 min |
| 02 | Register leave App | Low | 10 min |
| 03 | Define LeaveTypeCategory Choices | Low | 15 min |
| 04 | Create LeaveType Model Core | Medium | 25 min |
| 05 | Add Leave Type Description | Low | 15 min |
| 06 | Add Days Per Year Field | Low | 15 min |
| 07 | Add Max Days Field | Low | 15 min |
| 08 | Add Paid Leave Flag | Low | 10 min |
| 09 | Add Document Required Flag | Low | 10 min |

---

## Task 01: Create Leave Django App

### Overview
Create the `leave` Django app to manage all leave-related functionality within the ERP system. This app will handle leave types, leave policies, leave applications, balance tracking, accrual calculations, and approvals, supporting Sri Lankan labor law requirements including EPF/ETF compliance.

### Dependencies
- Django project structure established
- Backend infrastructure configured
- Core apps exist

### Instructions

1. **Navigate to apps directory**
   - Change to `backend/apps/` directory
   - This is where all Django apps reside

2. **Create leave app using Django management command**
   - Use `python manage.py startapp leave` command
   - This creates the basic Django app structure

3. **Move app to apps directory**
   - Ensure the leave app is in `backend/apps/leave/`
   - Verify proper directory structure

4. **Review generated app structure**
   - Verify `__init__.py` file exists
   - Check `apps.py` configuration file
   - Confirm `models.py` exists
   - Verify `admin.py` exists
   - Check `views.py` file
   - Verify `tests.py` file
   - Confirm `migrations/` directory exists

5. **Configure apps.py**
   - Open `apps.py` file
   - Update `name` to 'apps.leave'
   - Set `verbose_name` to 'Leave Management'
   - Add comprehensive docstring

6. **Create models package structure**
   - Create `models/` directory inside leave app
   - Move `models.py` content to `models/__init__.py`
   - This allows organizing multiple model files

7. **Create constants.py file**
   - Create `constants.py` in leave app root
   - Will contain leave type categories and other constants

8. **Create management commands directory**
   - Create `management/` directory
   - Create `management/commands/` subdirectory
   - Create `__init__.py` in both directories
   - Will contain seed data commands

9. **Add app docstring**
   - Open `__init__.py` in leave app root
   - Add comprehensive module docstring
   - Document app purpose and scope

### Leave App Directory Structure
```
backend/apps/leave/
├── __init__.py                     # Package initialization with docstring
├── apps.py                         # App configuration (Task 01, 02)
├── constants.py                    # Leave category constants (Task 03)
├── models/
│   ├── __init__.py                # Models package initialization
│   ├── leave_type.py              # LeaveType model (Tasks 04-12)
│   └── leave_policy.py            # LeavePolicy model (Tasks 14-16)
├── admin.py                       # Django admin registration
├── views.py                       # API views (future groups)
├── serializers.py                 # DRF serializers (future groups)
├── permissions.py                 # Permission classes (future groups)
├── management/
│   ├── __init__.py
│   └── commands/
│       ├── __init__.py
│       └── seed_leave_types.py    # Seed default leave types (Task 18)
├── migrations/
│   └── __init__.py
└── tests/
    ├── __init__.py
    ├── test_models.py             # Model tests
    └── test_policies.py           # Policy tests
```

### App Purpose and Scope

| Component | Scope |
|-----------|-------|
| **Leave Types** | Define categories: Annual, Casual, Sick, Maternity, Paternity, No-Pay |
| **Leave Policies** | Configure leave entitlements per department/designation |
| **Leave Balance** | Track available, used, and remaining leave days |
| **Leave Accrual** | Calculate leave accrual based on service period |
| **Leave Applications** | Submit, approve, reject leave requests |
| **Leave Calendar** | Visual calendar showing team leave schedules |
| **Reports** | Leave utilization, balance reports, audit trails |
| **Compliance** | Sri Lankan labor law compliance, EPF/ETF integration |

### Sri Lankan Labor Law Context

```
╔═══════════════════════════════════════════════════════════════╗
║         Sri Lankan Leave Entitlements (Typical)               ║
╠═══════════════════════════════════════════════════════════════╣
║                                                               ║
║  Annual Leave:                                                ║
║    • 14 days per year (after 12 months service)               ║
║    • Can carry forward unused days                            ║
║    • Can encash on resignation                                ║
║                                                               ║
║  Casual Leave:                                                ║
║    • 7 days per year                                          ║
║    • Cannot carry forward                                     ║
║    • Short-term absences                                      ║
║                                                               ║
║  Sick Leave:                                                  ║
║    • 7-14 days per year                                       ║
║    • Medical certificate required for >2 days                 ║
║    • Full pay if justified                                    ║
║                                                               ║
║  Maternity Leave:                                             ║
║    • 84 days (12 weeks) paid leave                            ║
║    • Female employees only                                    ║
║    • Cannot be denied                                         ║
║                                                               ║
║  Paternity Leave:                                             ║
║    • 3 days paid leave                                        ║
║    • Male employees only                                      ║
║    • Within 4 weeks of birth                                  ║
║                                                               ║
║  No-Pay Leave:                                                ║
║    • Unpaid leave by mutual agreement                         ║
║    • Does not affect EPF/ETF (if short duration)              ║
║    • Requires management approval                             ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
```

### Expected Outcome
- Functional leave Django app
- Proper directory structure
- Ready for model creation
- Foundation for leave management

### Verification Checklist
- [ ] `backend/apps/leave/` directory exists
- [ ] `apps.py` configured with correct name and verbose_name
- [ ] `models/` package directory created
- [ ] `constants.py` file exists
- [ ] `management/commands/` directory structure created
- [ ] All `__init__.py` files present
- [ ] App docstring added
- [ ] Migrations directory exists

---

## Task 02: Register Leave App

### Overview
Register the leave app in Django settings as a tenant-specific app. This ensures that leave data is properly isolated per tenant in the multi-tenant architecture, with each tenant having their own leave types, policies, and leave records.

### Dependencies
- Task 01: Create leave Django App
- Django settings configured with TENANT_APPS list
- Multi-tenancy infrastructure established

### Instructions

1. **Locate Django settings file**
   - Navigate to `backend/config/settings/` directory
   - Open `base.py` or main settings file

2. **Find TENANT_APPS configuration**
   - Locate TENANT_APPS list
   - This contains all tenant-specific applications
   - Leave data must be isolated per tenant

3. **Add leave app to TENANT_APPS**
   - Add 'apps.leave' to TENANT_APPS list
   - Place in logical order (after HR, before payroll)
   - Maintain consistent formatting

4. **Verify app path**
   - Ensure path is 'apps.leave' (not just 'leave')
   - Matches app configuration in apps.py

5. **Check for conflicts**
   - Ensure leave app not in SHARED_APPS
   - Verify no duplicate entries
   - Confirm proper multi-tenant configuration

6. **Add configuration comment**
   - Add inline comment explaining leave app purpose
   - Note tenant-specific nature

### TENANT_APPS Configuration

```
Example Settings Structure
════════════════════════════════════════════════════════

TENANT_APPS = [
    # Core tenant apps
    'apps.tenants',
    
    # Authentication and users
    'apps.users',
    'apps.roles',
    
    # Human Resources
    'apps.hr.employees',
    'apps.hr.departments',
    'apps.hr.designations',
    'apps.leave',              # ← Leave Management System
    
    # Payroll (uses leave data)
    'apps.payroll',
    
    # Other ERP modules
    'apps.inventory',
    'apps.sales',
    'apps.pos',
    # ...
]
```

### Multi-Tenancy Considerations

```
┌─────────────────────────────────────────────────────────────┐
│                    Multi-Tenant Architecture                 │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Tenant A (Company A)              Tenant B (Company B)     │
│  ═══════════════════               ═══════════════════      │
│                                                             │
│  Leave Types:                      Leave Types:             │
│   • Annual Leave (21 days)          • Annual Leave (14 days)│
│   • Sick Leave (14 days)            • Sick Leave (7 days)   │
│   • Custom: Hajj Leave              • Custom: Study Leave   │
│                                                             │
│  Leave Policies:                   Leave Policies:          │
│   • Sales: 21 annual days           • All: 14 annual days   │
│   • Others: 14 annual days          • No variations         │
│                                                             │
│  Leave Applications:               Leave Applications:      │
│   • Employee A1 requests            • Employee B1 requests  │
│   • Manager A2 approves             • Manager B2 approves   │
│                                                             │
└─────────────────────────────────────────────────────────────┘

Each tenant has completely isolated leave data
```

### Tenant-Specific Data Isolation

| Data Type | Isolation Level | Reason |
|-----------|----------------|--------|
| Leave Types | Per Tenant | Different companies, different policies |
| Leave Policies | Per Tenant | Department-specific entitlements vary |
| Leave Applications | Per Tenant | Employee leave requests are confidential |
| Leave Balances | Per Tenant | Accrual rules differ by company |
| Leave Calendar | Per Tenant | Team scheduling is company-specific |

### App Registration Order Importance

```
Registration Order Matters
══════════════════════════════════════════════════════

Correct Order:
1. apps.hr.employees        ← Employees must exist first
2. apps.hr.departments      ← Departments define structure
3. apps.hr.designations     ← Designations/positions
4. apps.leave               ← Leave references above models
5. apps.payroll             ← Payroll calculates leave deductions

Why?
• Leave models reference Employee, Department, Designation
• Leave applications have ForeignKey to Employee
• Leave policies link to Department/Designation
• Payroll processes leave deductions based on leave taken
```

### Expected Outcome
- Leave app registered in TENANT_APPS
- Proper multi-tenant isolation
- Leave data separated per tenant
- Foundation for tenant-specific leave management

### Verification Checklist
- [ ] TENANT_APPS list located in settings
- [ ] 'apps.leave' added to TENANT_APPS
- [ ] App not present in SHARED_APPS
- [ ] No duplicate entries
- [ ] Inline comment added
- [ ] App order logical (after HR, before payroll)
- [ ] Settings file syntax valid

---

## Task 03: Define LeaveTypeCategory Choices

### Overview
Define the LeaveTypeCategory choices that categorize different types of leave in the system. These categories align with Sri Lankan labor law requirements and provide a standardized classification for leave types.

### Dependencies
- Task 01: Create leave Django App
- Constants.py file exists

### Instructions

1. **Open constants.py file**
   - Navigate to `backend/apps/leave/constants.py`
   - Prepare to define leave category constants

2. **Add module docstring**
   - Add comprehensive module documentation
   - Explain the purpose of constants
   - Note Sri Lankan labor law context
   - Document usage in models

3. **Import Django components**
   - Import `models.TextChoices` from Django
   - This provides type-safe choice definitions

4. **Define LeaveTypeCategory class**
   - Create class inheriting from `models.TextChoices`
   - Add class docstring explaining categories

5. **Define ANNUAL category**
   - Value: 'ANNUAL'
   - Label: 'Annual Leave'
   - Purpose: Vacation/annual leave entitlement
   - Standard Sri Lankan entitlement: 14-21 days

6. **Define CASUAL category**
   - Value: 'CASUAL'
   - Label: 'Casual Leave'
   - Purpose: Short-term personal leave
   - Standard entitlement: 7 days

7. **Define SICK category**
   - Value: 'SICK'
   - Label: 'Sick Leave'
   - Purpose: Medical leave with certificate
   - Standard entitlement: 7-14 days

8. **Define MATERNITY category**
   - Value: 'MATERNITY'
   - Label: 'Maternity Leave'
   - Purpose: Female employees, childbirth
   - Legal requirement: 84 days (12 weeks)
   - Gender restriction: Female only

9. **Define PATERNITY category**
   - Value: 'PATERNITY'
   - Label: 'Paternity Leave'
   - Purpose: Male employees, childbirth support
   - Legal requirement: 3 days
   - Gender restriction: Male only

10. **Define NO_PAY category**
    - Value: 'NO_PAY'
    - Label: 'No-Pay Leave'
    - Purpose: Unpaid leave by agreement
    - Variable duration, no standard entitlement

11. **Define OTHER category**
    - Value: 'OTHER'
    - Label: 'Other'
    - Purpose: Custom leave types
    - Examples: Study leave, Hajj leave, Bereavement

12. **Add usage documentation**
    - Document each category's typical use cases
    - Note Sri Lankan labor law compliance
    - Provide examples

### LeaveTypeCategory Structure

```python
class LeaveTypeCategory(models.TextChoices):
    """
    Categories for leave types aligned with Sri Lankan labor law
    """
    ANNUAL = 'ANNUAL', 'Annual Leave'
    CASUAL = 'CASUAL', 'Casual Leave'
    SICK = 'SICK', 'Sick Leave'
    MATERNITY = 'MATERNITY', 'Maternity Leave'
    PATERNITY = 'PATERNITY', 'Paternity Leave'
    NO_PAY = 'NO_PAY', 'No-Pay Leave'
    OTHER = 'OTHER', 'Other'
```

### Category Details and Sri Lankan Context

| Category | Legal Basis | Typical Days | Paid | Certificate Required | Gender |
|----------|-------------|--------------|------|---------------------|--------|
| ANNUAL | Shop & Office Act | 14-21 days/year | Yes | No | All |
| CASUAL | Employment practices | 7 days/year | Yes | No | All |
| SICK | Employment practices | 7-14 days/year | Yes | Yes (>2 days) | All |
| MATERNITY | Maternity Benefits Ordinance | 84 days | Yes | Yes (medical) | Female |
| PATERNITY | Recent legislation | 3 days | Yes | Yes (birth cert) | Male |
| NO_PAY | By mutual agreement | Variable | No | Depends | All |
| OTHER | Company policy | Variable | Varies | Depends | All |

### Category Usage Scenarios

#### ANNUAL Leave
```
Purpose: Rest and recreation
Typical Rules:
• Accrues over 12 months of service
• Can carry forward to next year
• Can encash on resignation
• Requires advance notice (usually 14 days)
• Manager approval required

Examples:
• Employee takes 2 weeks vacation
• Family travel during holidays
• Personal time off
```

#### CASUAL Leave
```
Purpose: Short-term personal matters
Typical Rules:
• Does not carry forward
• Short notice acceptable
• Cannot encash
• Used for immediate needs
• Simple approval process

Examples:
• Attend family function
• Personal appointments
• Home emergencies
• Short errands
```

#### SICK Leave
```
Purpose: Medical treatment and recovery
Typical Rules:
• Medical certificate required (>2 days)
• Cannot be denied if justified
• May require hospital documentation
• Accrues throughout employment
• Full pay if medically justified

Examples:
• Illness requiring rest
• Medical procedures
• Recovery from surgery
• Contagious diseases
```

#### MATERNITY Leave
```
Purpose: Childbirth and newborn care
Legal Requirements:
• 84 days (12 weeks) paid leave
• Cannot be denied or reduced
• EPF/ETF contributions continue
• Job protection guaranteed
• Multiple deliveries covered

Timeline:
• Can start before delivery
• Minimum rest period mandated
• Doctor certification required
• Employer cannot terminate during leave
```

#### PATERNITY Leave
```
Purpose: Support spouse and newborn
Legal Requirements:
• 3 working days paid leave
• Within 4 weeks of birth
• Birth certificate as proof
• Cannot be denied

Usage:
• Support during delivery
• Initial newborn care
• Hospital accompaniment
• Household arrangements
```

#### NO_PAY Leave
```
Purpose: Extended absence without pay
Typical Rules:
• Requires management approval
• No salary during leave
• EPF/ETF may not contribute
• Job protection varies
• Maximum duration defined in policy

Examples:
• Extended personal travel
• Family care responsibilities
• Further education
• Religious pilgrimage
• Personal projects
```

#### OTHER Leave
```
Purpose: Special circumstances
Custom Types Examples:
• Study Leave (exams, courses)
• Hajj/Pilgrimage Leave (religious)
• Bereavement Leave (family death)
• Jury Duty Leave
• Emergency Leave
• Sabbatical Leave

Company-Specific:
• Each company defines rules
• May be paid or unpaid
• Duration varies
• Approval requirements vary
```

### Category Selection Guidelines

| Scenario | Recommended Category | Rationale |
|----------|---------------------|-----------|
| Planned vacation | ANNUAL | Standard vacation entitlement |
| Doctor appointment | CASUAL | Short duration, personal matter |
| Hospitalization | SICK | Medical certificate available |
| Having a baby (female) | MATERNITY | Legal requirement |
| Baby born (male) | PATERNITY | Legal requirement |
| Extended unpaid absence | NO_PAY | No salary impact |
| University exam | OTHER | Custom study leave type |
| Religious pilgrimage | OTHER | Custom religious leave |
| Family funeral | OTHER | Custom bereavement leave |

### Multi-Language Labels (Future Enhancement)

```
Category Labels in Sinhala:
• ANNUAL: වාර්ෂික නිවාඩු
• CASUAL: අනියම් නිවාඩු
• SICK: රෝග නිවාඩු
• MATERNITY: මාතෘ නිවාඩු
• PATERNITY: පීතෘ නිවාඩු
• NO_PAY: වැටුප් රහිත නිවාඩු
• OTHER: වෙනත්

Category Labels in Tamil:
• ANNUAL: வருடாந்த விடுப்பு
• CASUAL: சாதாரண விடுப்பு
• SICK: நோய் விடுப்பு
• MATERNITY: மகப்பேறு விடுப்பு
• PATERNITY: தந்தை விடுப்பு
• NO_PAY: ஊதியமற்ற விடுப்பு
• OTHER: மற்றவை
```

### Expected Outcome
- Comprehensive leave category definitions
- Sri Lankan labor law alignment
- Type-safe choice implementation
- Foundation for LeaveType model

### Verification Checklist
- [ ] constants.py file opened
- [ ] Module docstring added
- [ ] `models.TextChoices` imported
- [ ] LeaveTypeCategory class defined
- [ ] ANNUAL category defined
- [ ] CASUAL category defined
- [ ] SICK category defined
- [ ] MATERNITY category defined
- [ ] PATERNITY category defined
- [ ] NO_PAY category defined
- [ ] OTHER category defined
- [ ] All labels are user-friendly
- [ ] Class docstring explains purpose

---

## Task 04: Create LeaveType Model Core

### Overview
Create the core LeaveType model that defines different types of leave available in the system. This model serves as the foundation for leave management, storing leave type configurations that comply with Sri Lankan labor laws and support company-specific policies.

### Dependencies
- Task 01: Create leave Django App
- Task 03: Define LeaveTypeCategory Choices
- TenantAwareMixin available
- TimestampMixin available
- Django ORM configured

### Instructions

1. **Create leave_type.py model file**
   - Create file at `backend/apps/leave/models/leave_type.py`
   - Import necessary Django components

2. **Import required modules**
   - Import Django model and field classes
   - Import TenantAwareMixin from core.models
   - Import TimestampMixin from core.models
   - Import LeaveTypeCategory from constants

3. **Define LeaveType model class**
   - Inherit from TenantAwareMixin and TimestampMixin
   - Add comprehensive model docstring
   - Explain purpose and Sri Lankan context

4. **Add name field**
   - CharField with max_length=100
   - Required field (no blank/null)
   - Human-readable leave type name
   - Example: "Annual Leave", "Sick Leave", "Maternity Leave"

5. **Add code field**
   - CharField with max_length=10
   - Required field (no blank/null)
   - Unique per tenant
   - Short code for leave type
   - Example: "AL" (Annual), "SL" (Sick), "ML" (Maternity)
   - Uppercase recommended

6. **Add category field**
   - CharField with choices from LeaveTypeCategory
   - Required field (no blank/null)
   - Categorizes the leave type
   - Used for filtering and reporting

7. **Add is_active field**
   - BooleanField, default=True
   - Controls leave type availability
   - Inactive types cannot be used for new applications
   - Existing applications remain valid

8. **Add allow_half_day field**
   - BooleanField, default=True
   - Controls whether half-day leave allowed
   - Common for casual and sick leave
   - May be disabled for maternity leave

9. **Add Meta class**
   - Set verbose_name to 'Leave Type'
   - Set verbose_name_plural to 'Leave Types'
   - Add ordering by category, then name
   - Add unique_together constraint (tenant, code)
   - Add index on (tenant, category)
   - Add index on (tenant, is_active)

10. **Add __str__ method**
    - Return leave type name
    - Include code in parentheses
    - Format: "Annual Leave (AL)"

11. **Add clean method**
    - Validate code is uppercase
    - Check category-specific validations
    - Call parent clean method

12. **Update models/__init__.py**
    - Import LeaveType model
    - Add to __all__ list

### LeaveType Model Structure

```
┌──────────────────────────────────────────────────────────────┐
│                    LeaveType Model                           │
├──────────────────────────────────────────────────────────────┤
│ Core Identification Fields:                                  │
│  • name (CharField, 100) - "Annual Leave"                    │
│  • code (CharField, 10) - "AL" (unique per tenant)           │
│  • category (CharField) - LeaveTypeCategory choice           │
│                                                              │
│ Basic Configuration:                                         │
│  • is_active (BooleanField) - Availability                   │
│  • allow_half_day (BooleanField) - Half-day option           │
│                                                              │
│ Inherited from TenantAwareMixin:                             │
│  • tenant (ForeignKey) - Tenant isolation                    │
│                                                              │
│ Inherited from TimestampMixin:                               │
│  • created_at (DateTimeField) - Creation timestamp           │
│  • updated_at (DateTimeField) - Last update timestamp        │
│                                                              │
│ Future Fields (Tasks 05-12):                                 │
│  • description, color                                        │
│  • default_days_per_year                                     │
│  • max_consecutive_days, max_days_per_request                │
│  • is_paid, requires_document                                │
│  • applicable_gender, min_service_months, min_notice_days    │
│  • allow_encashment, carry_forward_allowed, etc.             │
└──────────────────────────────────────────────────────────────┘
```

### Model Relationships

```
┌──────────────┐         1:N          ┌────────────────────┐
│    Tenant    │◄─────────────────────│    LeaveType       │
└──────────────┘                      └────────────────────┘
                                               │
                                               │ 1:N
                                               ▼
                                      ┌────────────────────┐
                                      │   LeavePolicy      │
                                      │   (Task 14)        │
                                      └────────────────────┘
                                               │
                                               │ 1:N
                                               ▼
                                      ┌────────────────────┐
                                      │  LeaveApplication  │
                                      │  (Future Group)    │
                                      └────────────────────┘
```

### Field Details and Validation Rules

| Field | Type | Max Length | Required | Unique | Default | Validation |
|-------|------|------------|----------|--------|---------|------------|
| name | CharField | 100 | Yes | No | - | Non-empty |
| code | CharField | 10 | Yes | Per tenant | - | Uppercase, alphanumeric |
| category | CharField | - | Yes | No | - | Valid category choice |
| is_active | BooleanField | - | Yes | No | True | Boolean |
| allow_half_day | BooleanField | - | Yes | No | True | Boolean |

### Leave Type Code Conventions

| Leave Type | Standard Code | Alternative Codes |
|------------|--------------|-------------------|
| Annual Leave | AL | ANN, ANNUAL |
| Casual Leave | CL | CAS, CASUAL |
| Sick Leave | SL | SICK, MEDICAL |
| Maternity Leave | ML | MAT, MATERNITY |
| Paternity Leave | PL | PAT, PATERNITY |
| No-Pay Leave | NPL | NP, NOPAY |
| Study Leave | STL | STUDY |
| Hajj Leave | HAJJ | PILGRIMAGE |
| Bereavement Leave | BL | BEREAVEMENT |

### Category Assignment Examples

```
Leave Type Name          → Code   → Category
═══════════════════════════════════════════════
"Annual Leave"           → "AL"   → ANNUAL
"Casual Leave"           → "CL"   → CASUAL
"Medical Leave"          → "SL"   → SICK
"Maternity Leave"        → "ML"   → MATERNITY
"Paternity Leave"        → "PL"   → PATERNITY
"Unpaid Leave"           → "NPL"  → NO_PAY
"Study Leave"            → "STL"  → OTHER
"Hajj Pilgrimage Leave"  → "HAJJ" → OTHER
"Bereavement Leave"      → "BL"   → OTHER
```

### Half-Day Leave Configuration

| Leave Type | Allow Half-Day | Rationale |
|------------|----------------|-----------|
| Annual Leave | ✅ Yes | Flexibility for appointments |
| Casual Leave | ✅ Yes | Common use case |
| Sick Leave | ✅ Yes | Partial day recovery |
| Maternity Leave | ❌ No | Full day requirement |
| Paternity Leave | ❌ No | Short duration anyway |
| No-Pay Leave | ✅ Yes | Flexible arrangement |
| Study Leave | ⚠️ Varies | Depends on policy |

### Half-Day Leave Calculation Examples

```
Half-Day Scenarios
══════════════════════════════════════════════════

Scenario 1: Morning Half-Day
• Employee works: 1:00 PM - 5:00 PM
• Leave deduction: 0.5 days
• Remaining balance: 14.5 → 14.0 days

Scenario 2: Afternoon Half-Day  
• Employee works: 8:00 AM - 12:00 PM
• Leave deduction: 0.5 days
• Remaining balance: 7.0 → 6.5 days

Scenario 3: Multiple Half-Days
• Monday AM: 0.5 days
• Wednesday PM: 0.5 days
• Friday AM: 0.5 days
• Total deduction: 1.5 days
```

### Active/Inactive State Management

```
Leave Type Lifecycle
════════════════════════════════════════════════

Active (is_active=True):
✅ Visible in leave application form
✅ Available for new applications
✅ Appears in reports and analytics
✅ Balance tracking active

Inactive (is_active=False):
❌ Hidden from leave application form
❌ Cannot create new applications
✅ Historical applications remain valid
✅ Historical data preserved
✅ Can be reactivated if needed

Use Case for Inactivation:
• Policy change eliminates leave type
• Company discontinues specific leave
• Temporary suspension of leave type
• Migration to new leave structure
```

### Expected Outcome
- Functional LeaveType model
- Tenant-specific leave types
- Category-based classification
- Code-based identification
- Active/inactive control

### Verification Checklist
- [ ] leave_type.py file created
- [ ] Required modules imported
- [ ] LeaveType class defined
- [ ] name field added
- [ ] code field added with uppercase constraint
- [ ] category field with choices added
- [ ] is_active field added
- [ ] allow_half_day field added
- [ ] Meta class configured
- [ ] __str__ method implemented
- [ ] clean method for validation added
- [ ] Model imported in models/__init__.py

---

## Task 05: Add Leave Type Description

### Overview
Add description and color fields to the LeaveType model. The description provides detailed information about the leave type, its rules, and usage guidelines. The color field enables visual distinction in calendars and UI components, improving user experience.

### Dependencies
- Task 04: Create LeaveType Model Core

### Instructions

1. **Open leave_type.py model file**
   - Navigate to `backend/apps/leave/models/leave_type.py`
   - Locate LeaveType model class

2. **Add description field**
   - TextField with blank=True, null=True
   - Optional detailed description
   - Markdown formatting supported
   - Usage guidelines and rules
   - Example: "Annual leave for rest and recreation. Requires 14 days advance notice. Can carry forward up to 7 days."

3. **Add color field**
   - CharField with max_length=7
   - Stores hex color code (e.g., "#4CAF50")
   - Default to "#2196F3" (blue)
   - Used in calendar views
   - Used in dashboards and charts

4. **Add color validation**
   - Update clean method
   - Validate hex color format
   - Ensure starts with #
   - Check length is 7 characters
   - Validate hex characters (0-9, A-F)

5. **Add help text**
   - Add help_text to description field
   - Add help_text to color field
   - Explain format and usage

6. **Update model docstring**
   - Document description field purpose
   - Document color field usage
   - Provide examples

### Description Field Structure

```
┌─────────────────────────────────────────────────────────────┐
│                Leave Type Description Field                  │
├─────────────────────────────────────────────────────────────┤
│ Field Properties:                                            │
│  • Type: TextField                                           │
│  • Optional: blank=True, null=True                           │
│  • Format: Plain text or Markdown                            │
│  • Use: Detailed rules and guidelines                        │
│                                                              │
│ Content Guidelines:                                          │
│  • Entitlement details                                       │
│  • Eligibility criteria                                      │
│  • Approval process                                          │
│  • Documentation requirements                                │
│  • Advance notice requirements                               │
│  • Carry forward rules                                       │
│  • Encashment policy                                         │
│  • Sri Lankan legal references                               │
└─────────────────────────────────────────────────────────────┘
```

### Description Content Examples

#### Annual Leave Description
```
Annual Leave - Full Description Example
═══════════════════════════════════════════════════════

Annual leave for rest, recreation, and personal time.

Entitlement:
• 14 days per year after completing 12 months of service
• Pro-rated for first year of employment
• Additional 1 day per year of service (up to 21 days maximum)

Eligibility:
• All permanent employees
• Contract employees as per agreement
• Probationary employees after confirmation

Application Process:
• Submit application at least 14 days in advance
• Requires immediate supervisor approval
• Department head approval for leave >7 consecutive days
• HR approval for leave >14 consecutive days

Carry Forward:
• Up to 7 unused days can carry forward to next year
• Carried forward days expire after 12 months
• Total balance cannot exceed 28 days

Encashment:
• Unused leave can be encashed on resignation
• Calculated at basic salary rate
• Maximum 21 days encashable per year

Legal Reference:
• Shop & Office Employees Act No. 15 of 1954
• Employees eligible after 12 months continuous service
```

#### Sick Leave Description
```
Sick Leave - Full Description Example
═══════════════════════════════════════════════════════

Sick leave for illness, injury, or medical treatment.

Entitlement:
• 14 days per year with medical certificate
• Full pay if medically justified
• Accrues throughout employment

Documentation:
• Medical certificate required for >2 consecutive days
• Hospital admission documents for hospitalization
• Specialist reports for ongoing treatment
• Prescriptions and test results as supporting evidence

Application Process:
• Inform supervisor immediately (phone/SMS/email)
• Submit medical certificate within 3 days of return
• HR reviews and approves based on certificate
• Extended sick leave requires additional documentation

Half-Day Sick Leave:
• Allowed with medical certificate
• Common for medical appointments
• Deducts 0.5 days from balance

Restrictions:
• Cannot be carried forward
• Cannot be encashed
• Requires genuine medical justification
• Abuse may result in disciplinary action

Note:
• Serious illness may qualify for extended medical leave
• Long-term illness may transition to no-pay leave
• Company may request independent medical evaluation
```

#### Maternity Leave Description
```
Maternity Leave - Full Description Example
═══════════════════════════════════════════════════════

Maternity leave for childbirth and newborn care (female employees).

Legal Entitlement:
• 84 days (12 weeks) paid maternity leave
• Cannot be denied or reduced
• Protected by law
• Job security guaranteed

Eligibility:
• All female employees
• No minimum service requirement
• Applies to all pregnancies
• Multiple children covered separately

Application Process:
• Notify HR at least 2 weeks before intended start date
• Submit doctor's certificate confirming pregnancy
• Confirm expected delivery date
• Specify leave start date preference

Leave Period:
• Can start before delivery (typically 2 weeks before)
• Minimum post-delivery rest period required
• Flexible start date based on medical advice
• Extension possible with medical justification

Benefits During Leave:
• Full salary maintained
• EPF and ETF contributions continue
• All employment benefits preserved
• Annual leave continues to accrue

Documentation:
• Pregnancy confirmation certificate
• Expected delivery date certificate
• Birth certificate (after delivery)
• Medical reports if complications arise

Return to Work:
• Guaranteed same position or equivalent
• Cannot be terminated during leave
• Cannot be penalized for taking leave
• Flexible return arrangements if needed

Legal Reference:
• Maternity Benefits Ordinance (Chapter 128)
• Covers all employees regardless of contract type
• Employer cannot deny or reduce entitlement
```

#### No-Pay Leave Description
```
No-Pay Leave - Full Description Example
═══════════════════════════════════════════════════════

Unpaid leave by mutual agreement for extended absences.

Purpose:
• Personal circumstances requiring extended absence
• When other leave types exhausted
• By mutual agreement between employee and employer

Eligibility:
• All employees may request
• Subject to business requirements
• Management discretion applies

Application Process:
• Submit written request with justification
• At least 30 days advance notice
• Department head approval required
• HR and senior management approval needed
• Duration must be specified

Duration:
• Typically 1-3 months
• Maximum 6 months per year
• Can be extended with approval
• Job security not guaranteed beyond 3 months

Impact on Benefits:
• No salary during leave period
• EPF/ETF contributions pause
• Annual leave accrual pauses
• Medical benefits may pause (check policy)
• Service continuity may be affected

Documentation:
• Written request with reason
• Supporting documents if applicable
• Signed approval from all required parties
• HR acknowledgment

Conditions:
• Cannot use during probation period
• Cannot use during critical business periods
• Must have good performance record
• All pending leave should be cleared first
```

### Color Field for Calendar Visualization

```
┌─────────────────────────────────────────────────────────────┐
│              Leave Type Color Coding System                  │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Annual Leave (Green):      #4CAF50  █████                   │
│  Casual Leave (Blue):       #2196F3  █████                   │
│  Sick Leave (Orange):       #FF9800  █████                   │
│  Maternity (Pink):          #E91E63  █████                   │
│  Paternity (Purple):        #9C27B0  █████                   │
│  No-Pay (Grey):             #9E9E9E  █████                   │
│  Study Leave (Teal):        #009688  █████                   │
│  Hajj Leave (Deep Purple):  #673AB7  █████                   │
│  Bereavement (Brown):       #795548  █████                   │
│  Other (Amber):             #FFC107  █████                   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Calendar View with Colors

```
╔════════════════════════════════════════════════════════════╗
║                  December 2026 Leave Calendar               ║
╠════════════════════════════════════════════════════════════╣
║  Mon    Tue    Wed    Thu    Fri    Sat    Sun             ║
║  ────────────────────────────────────────────────────────  ║
║   1      2      3      4      5      6      7              ║
║         █AL    █AL    █AL    █AL                           ║
║   Priya taking Annual Leave (Green)                        ║
║                                                            ║
║   8      9     10     11     12     13     14              ║
║         █SL    █SL                                         ║
║   Kamal on Sick Leave (Orange)                             ║
║                                                            ║
║  15     16     17     18     19     20     21              ║
║         █CL           █CL                                  ║
║   Nisha taking Casual Leave (Blue)                         ║
║                                                            ║
║  22     23     24     25     26     27     28              ║
║         █ML    █ML    █ML    █ML    █ML    █ML            ║
║   Anusha on Maternity Leave (Pink)                         ║
╚════════════════════════════════════════════════════════════╝

Legend:
█AL = Annual Leave (Green #4CAF50)
█CL = Casual Leave (Blue #2196F3)
█SL = Sick Leave (Orange #FF9800)
█ML = Maternity Leave (Pink #E91E63)
```

### Recommended Color Palette

| Category | Color Name | Hex Code | RGB | Rationale |
|----------|------------|----------|-----|-----------|
| Annual | Green | #4CAF50 | 76, 175, 80 | Positive, vacation |
| Casual | Blue | #2196F3 | 33, 150, 243 | Neutral, common |
| Sick | Orange | #FF9800 | 255, 152, 0 | Caution, attention |
| Maternity | Pink | #E91E63 | 233, 30, 99 | Feminine, nurturing |
| Paternity | Purple | #9C27B0 | 156, 39, 176 | Masculine, supportive |
| No-Pay | Grey | #9E9E9E | 158, 158, 158 | Neutral, inactive |
| Study | Teal | #009688 | 0, 150, 136 | Learning, growth |
| Religious | Deep Purple | #673AB7 | 103, 58, 183 | Spiritual |
| Bereavement | Brown | #795548 | 121, 85, 72 | Somber, respectful |

### Color Validation Logic

```
Hex Color Validation Rules
══════════════════════════════════════════════════

Valid Formats:
✅ #4CAF50 (6 digits, uppercase)
✅ #4caf50 (6 digits, lowercase)
✅ #fff (3 digits short form - expand to #ffffff)

Invalid Formats:
❌ 4CAF50 (missing #)
❌ #4CAF5 (only 5 digits)
❌ #GGGGGG (invalid hex characters)
❌ ##4CAF50 (double #)
❌ #4CAF50FF (8 digits with alpha)

Validation Logic:
1. Check starts with #
2. Check length (7 for #RRGGBB or 4 for #RGB)
3. Validate hex characters [0-9A-Fa-f]
4. Expand short form if needed (#abc → #aabbcc)
```

### Expected Outcome
- Detailed leave type descriptions
- Color coding for visual distinction
- Enhanced calendar views
- Better user understanding

### Verification Checklist
- [ ] description field added (TextField)
- [ ] description marked as optional
- [ ] color field added (CharField, max_length=7)
- [ ] Default color set to "#2196F3"
- [ ] Color validation in clean method
- [ ] Help text added to both fields
- [ ] Model docstring updated

---

## Task 06: Add Days Per Year Field

### Overview
Add the default_days_per_year field to the LeaveType model. This field defines the standard annual entitlement for the leave type, serving as the default value when creating leave policies. It aligns with Sri Lankan labor law minimums while allowing companies to offer more generous entitlements.

### Dependencies
- Task 05: Add Leave Type Description

### Instructions

1. **Open leave_type.py model file**
   - Continue in `backend/apps/leave/models/leave_type.py`
   - Locate LeaveType model class

2. **Add default_days_per_year field**
   - PositiveIntegerField type
   - Default to 0 (for leave types without fixed entitlement)
   - Optional but recommended for most leave types
   - Null=True, blank=True for flexibility

3. **Add field validation**
   - Update clean method
   - Validate reasonable day ranges (0-365)
   - Check category-specific minimums
   - Warn if below legal minimums for Sri Lanka

4. **Add help text**
   - Explain field purpose
   - Note Sri Lankan legal minimums
   - Indicate this is default (can be overridden in policies)

5. **Update model docstring**
   - Document default_days_per_year field
   - Explain relationship to LeavePolicy
   - Note legal compliance requirements

### default_days_per_year Field Structure

```
┌─────────────────────────────────────────────────────────────┐
│            default_days_per_year Field Details               │
├─────────────────────────────────────────────────────────────┤
│ Field Properties:                                            │
│  • Type: PositiveIntegerField                                │
│  • Default: 0                                                │
│  • Optional: null=True, blank=True                           │
│  • Range: 0-365 (validated)                                  │
│  • Purpose: Standard annual entitlement                      │
│                                                              │
│ Usage:                                                       │
│  • Default for LeavePolicy creation                          │
│  • Can be overridden per policy                              │
│  • Basis for accrual calculations                            │
│  • Reference for balance tracking                            │
└─────────────────────────────────────────────────────────────┘
```

### Sri Lankan Legal Minimums

| Leave Category | Legal Minimum | Typical Industry | Generous Companies | Notes |
|----------------|---------------|------------------|-------------------|-------|
| ANNUAL | 14 days | 14-18 days | 21-25 days | After 12 months service |
| CASUAL | No legal minimum | 7 days | 10-12 days | Industry practice |
| SICK | No fixed minimum | 7-14 days | 14-21 days | With medical certificate |
| MATERNITY | 84 days (12 weeks) | 84 days | 90-120 days | Cannot be less than 84 |
| PATERNITY | 3 days | 3 days | 5-7 days | Recent legislation |
| NO_PAY | N/A (by agreement) | N/A | N/A | Not a fixed entitlement |
| OTHER | Varies | Varies | Varies | Company-specific |

### Default Days Configuration by Category

```
Recommended default_days_per_year Values
════════════════════════════════════════════════════════

Category: ANNUAL
────────────────────────────────────────────────────────
Minimum Legal:    14 days
Standard:         14 days (meets legal requirement)
Competitive:      18 days (above minimum)
Generous:         21 days (senior staff, long service)
Maximum Typical:  25 days (executives, special cases)

Category: CASUAL
────────────────────────────────────────────────────────
No Legal Min:     N/A
Standard:         7 days (industry norm)
Generous:         10-12 days (above norm)

Category: SICK
────────────────────────────────────────────────────────
No Fixed Min:     N/A (based on medical cert)
Standard:         7 days (no cert), 14 days (with cert)
Generous:         21 days (includes hospitalization)

Category: MATERNITY
────────────────────────────────────────────────────────
Legal Minimum:    84 days (cannot be less)
Standard:         84 days (12 weeks)
Generous:         90-120 days (3-4 months)

Category: PATERNITY
────────────────────────────────────────────────────────
Legal Minimum:    3 days
Standard:         3 days
Generous:         5-7 days

Category: NO_PAY
────────────────────────────────────────────────────────
Default:          0 days (no fixed entitlement)
Note:             Duration negotiated case-by-case

Category: OTHER
────────────────────────────────────────────────────────
Varies:           Company policy specific
Examples:
• Study Leave:         5-10 days
• Hajj Leave:          30-40 days
• Bereavement:         3-5 days
```

### Service Period Impact on Entitlement

```
Annual Leave Progression Example
════════════════════════════════════════════════════════

Standard Policy:
Year 1:     14 days (pro-rated if joined mid-year)
Year 2:     14 days
Year 3:     15 days (+1 for 3 years service)
Year 4:     15 days
Year 5:     16 days (+1 for 5 years service)
Year 10:    18 days (+1 every 2-3 years)
Year 15:    20 days
Year 20:    21 days (maximum)

Generous Policy:
Year 1:     18 days
Year 2-5:   18 days
Year 5-10:  21 days
Year 10+:   25 days
```

### Pro-Rata Calculation for First Year

```
Pro-Rata Annual Leave Calculation
════════════════════════════════════════════════════════

Scenario: Employee joins mid-year
Default: 14 days per year
Formula: (days_per_year / 12) × months_remaining

Examples:

Join Date: January 1
Months Remaining: 12
Entitlement: 14 days (full year)

Join Date: April 1
Months Remaining: 9
Entitlement: (14 / 12) × 9 = 10.5 days

Join Date: July 1
Months Remaining: 6
Entitlement: (14 / 12) × 6 = 7 days

Join Date: October 1
Months Remaining: 3
Entitlement: (14 / 12) × 3 = 3.5 days

Note: Round to nearest 0.5 day for simplicity
```

### Zero Days Configuration

```
When to Use default_days_per_year = 0
════════════════════════════════════════════════════════

Use Cases:
1. No-Pay Leave
   • No fixed entitlement
   • Duration negotiated per request
   • default_days_per_year = 0

2. Emergency Leave
   • Granted on case-by-case basis
   • No standard allocation
   • default_days_per_year = 0

3. Special Circumstances Leave
   • Rare, non-recurring situations
   • Management discretion
   • default_days_per_year = 0

4. Variable Entitlement Leave
   • Depends on role, department, service
   • Set via LeavePolicy, not LeaveType
   • default_days_per_year = 0 (policy overrides)
```

### Relationship with LeavePolicy

```
┌──────────────────────────────────────────────────────────────┐
│        LeaveType vs LeavePolicy Entitlement Flow             │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  LeaveType                                                   │
│  ┌────────────────────────────────────┐                     │
│  │ name: "Annual Leave"               │                     │
│  │ default_days_per_year: 14          │ ← Default value     │
│  └────────────────────────────────────┘                     │
│                    │                                         │
│                    │ Can be overridden                       │
│                    ▼                                         │
│  LeavePolicy (All Employees)                                │
│  ┌────────────────────────────────────┐                     │
│  │ leave_type: Annual Leave           │                     │
│  │ days_per_year: 14                  │ ← Uses default      │
│  │ applies_to: ALL                    │                     │
│  └────────────────────────────────────┘                     │
│                                                              │
│  LeavePolicy (Sales Department)                             │
│  ┌────────────────────────────────────┐                     │
│  │ leave_type: Annual Leave           │                     │
│  │ days_per_year: 18                  │ ← Override!         │
│  │ applies_to: DEPARTMENT             │                     │
│  │ department: Sales                  │                     │
│  └────────────────────────────────────┘                     │
│                                                              │
│  LeavePolicy (Senior Managers)                              │
│  ┌────────────────────────────────────┐                     │
│  │ leave_type: Annual Leave           │                     │
│  │ days_per_year: 21                  │ ← Override!         │
│  │ applies_to: DESIGNATION            │                     │
│  │ designation: Senior Manager        │                     │
│  └────────────────────────────────────┘                     │
│                                                              │
└──────────────────────────────────────────────────────────────┘

Policy Resolution Order:
1. Employee-specific policy (if exists)
2. Designation policy
3. Department policy
4. All employees policy
5. LeaveType default (fallback)
```

### Validation Logic

```
default_days_per_year Validation Rules
════════════════════════════════════════════════════════

1. Range Validation:
   • Must be >= 0
   • Must be <= 365
   • Warn if > 100 (unusual)

2. Category-Specific Validation:
   
   ANNUAL:
   • Warn if < 14 (below Sri Lankan legal minimum)
   • Typical range: 14-25 days

   CASUAL:
   • Typical range: 0-12 days
   • No legal minimum

   SICK:
   • Typical range: 0-21 days
   • No fixed legal minimum

   MATERNITY:
   • Error if < 84 (below legal requirement)
   • Must be >= 84 days

   PATERNITY:
   • Warn if < 3 (below legal minimum)
   • Typical range: 3-7 days

   NO_PAY:
   • Should be 0 (no fixed entitlement)

   OTHER:
   • Any value acceptable
   • Validate based on specific type

3. Business Logic Validation:
   • If is_paid=True, should have days_per_year > 0
   • If is_paid=False and days_per_year=0, OK
```

### Expected Outcome
- Standard entitlement definition
- Legal compliance support
- Flexible policy override capability
- Foundation for accrual calculations

### Verification Checklist
- [ ] default_days_per_year field added
- [ ] Field type is PositiveIntegerField
- [ ] Default set to 0
- [ ] null=True, blank=True configured
- [ ] Range validation added (0-365)
- [ ] Category-specific validation implemented
- [ ] Help text added with legal minimums
- [ ] Model docstring updated

---

## Task 07: Add Max Days Field

### Overview
Add maximum day restriction fields to the LeaveType model. These fields control the maximum number of consecutive days and maximum days per request that can be taken for the leave type, providing essential constraints for leave scheduling and approval workflows.

### Dependencies
- Task 06: Add Days Per Year Field

### Instructions

1. **Open leave_type.py model file**
   - Continue in `backend/apps/leave/models/leave_type.py`
   - Locate LeaveType model class

2. **Add max_consecutive_days field**
   - PositiveIntegerField type
   - Optional (null=True, blank=True)
   - Default to None (no limit)
   - Controls maximum consecutive days allowed
   - Example: Annual leave max 14 consecutive days

3. **Add max_days_per_request field**
   - PositiveIntegerField type
   - Optional (null=True, blank=True)
   - Default to None (no limit)
   - Controls maximum days in single application
   - May be less than max_consecutive_days

4. **Add field validation**
   - Update clean method
   - Validate max_consecutive_days <= default_days_per_year
   - Validate max_days_per_request <= max_consecutive_days
   - Ensure logical consistency

5. **Add help text**
   - Explain consecutive vs per-request limits
   - Provide usage examples
   - Note impact on approval workflow

6. **Update model docstring**
   - Document max day restrictions
   - Explain business logic
   - Provide category-specific recommendations

### Maximum Days Fields Structure

```
┌─────────────────────────────────────────────────────────────┐
│              Maximum Days Restriction Fields                 │
├─────────────────────────────────────────────────────────────┤
│ Field: max_consecutive_days                                  │
│  • Type: PositiveIntegerField                                │
│  • Optional: null=True, blank=True                           │
│  • Default: None (unlimited)                                 │
│  • Purpose: Limit consecutive leave days                     │
│  • Example: Max 14 days in a row                             │
│                                                              │
│ Field: max_days_per_request                                  │
│  • Type: PositiveIntegerField                                │
│  • Optional: null=True, blank=True                           │
│  • Default: None (unlimited)                                 │
│  • Purpose: Limit days in single application                 │
│  • Example: Max 5 days per request                           │
│                                                              │
│ Relationship:                                                │
│  max_days_per_request <= max_consecutive_days                │
│  max_consecutive_days <= default_days_per_year               │
└─────────────────────────────────────────────────────────────┘
```

### Consecutive Days vs Per Request

```
Understanding the Difference
════════════════════════════════════════════════════════

max_consecutive_days:
• Maximum number of days in a row (including weekends)
• Prevents extended absence
• Ensures coverage and continuity
• Example: 14 consecutive days maximum

max_days_per_request:
• Maximum days in single application
• Can apply for multiple requests
• Encourages planning
• Example: 5 days per request

Scenario:
────────────────────────────────────────────────────────
max_consecutive_days: 14
max_days_per_request: 5

Valid: Apply for 5 days, come back, apply for another 5 days
Invalid: Apply for 10 days in one request (exceeds per-request limit)
Invalid: Take 20 consecutive days across multiple requests (exceeds consecutive limit)
```

### Configuration Examples by Category

| Leave Type | max_consecutive_days | max_days_per_request | Rationale |
|------------|---------------------|---------------------|-----------|
| Annual Leave | 14 | None | Allow long vacation but limit extended absence |
| Casual Leave | 3 | 2 | Short-term nature, prevent abuse |
| Sick Leave | 7 | None | Based on medical certificate, no per-request limit |
| Maternity Leave | None | None | Legal entitlement, cannot restrict |
| Paternity Leave | 3 | None | Short fixed duration |
| No-Pay Leave | 90 | 30 | Limit impact on operations |
| Study Leave | 10 | 5 | Balance work and study |

### Consecutive Days Scenarios

```
Annual Leave: max_consecutive_days = 14
════════════════════════════════════════════════════════

Scenario 1: Single Block (Valid)
┌──────────────────────────────────────────────┐
│ Mon-Fri  Mon-Fri  Mon-Thu  Weekend  Weekend  │
│   5 AL     5 AL     4 AL      -        -     │
│ └─────────────────────────┘                  │
│       14 consecutive days = Valid ✅          │
└──────────────────────────────────────────────┘

Scenario 2: Exceeds Limit (Invalid)
┌──────────────────────────────────────────────┐
│ Mon-Fri  Mon-Fri  Mon-Fri  Weekend  Weekend  │
│   5 AL     5 AL     5 AL      -        -     │
│ └─────────────────────────────────────┘      │
│       15 consecutive days = Invalid ❌        │
└──────────────────────────────────────────────┘

Scenario 3: Multiple Blocks with Break (Valid)
┌──────────────────────────────────────────────┐
│ Mon-Fri  Work Day  Mon-Fri  Weekend          │
│   5 AL      W        5 AL      -             │
│ └───────┘          └───────┘                 │
│  5 days    Break    5 days = Valid ✅         │
│  (Not consecutive due to work day break)     │
└──────────────────────────────────────────────┘
```

### Per-Request Limit Scenarios

```
Annual Leave: max_days_per_request = 5
════════════════════════════════════════════════════════

Scenario 1: Single Request (Valid)
Application #1: Request 5 days
└─→ Valid ✅ (within limit)

Scenario 2: Single Request Exceeds (Invalid)
Application #1: Request 10 days
└─→ Invalid ❌ (exceeds 5 days per request)

Scenario 3: Multiple Requests (Valid)
Application #1: Request 5 days (Nov 1-5)
Application #2: Request 5 days (Nov 8-12)
└─→ Both valid ✅ (each within 5 days limit)

Scenario 4: Multiple Requests but Consecutive Issue (Invalid)
Application #1: Request 5 days (Nov 1-5) ✅
Application #2: Request 5 days (Nov 6-10) ✅ (per request)
But total consecutive: 10 days including weekends
└─→ Must check max_consecutive_days
```

### Business Rules and Logic

```
Validation Logic Flow
════════════════════════════════════════════════════════

When Employee Applies for Leave:
1. Check max_days_per_request
   └─→ If application days > max_days_per_request: REJECT
   
2. Check max_consecutive_days
   └─→ Calculate: Requested days + Adjacent approved leave
   └─→ If total consecutive > max_consecutive_days: REJECT
   
3. Check available balance
   └─→ If days > remaining balance: REJECT
   
4. Check other restrictions
   └─→ Notice period, blackout dates, etc.

Example:
────────────────────────────────────────────────────────
Employee: Kamal
Leave Type: Annual Leave
Config:
• max_consecutive_days: 14
• max_days_per_request: 5

Current Request: 5 days (Dec 10-14)
Adjacent Leave: 8 days (Dec 3-10) already approved

Total Consecutive: 8 + 5 = 13 days
Status: Valid ✅ (13 <= 14)

If requested 6 days: Invalid ❌ (exceeds max_days_per_request)
If total was 15 days: Invalid ❌ (exceeds max_consecutive_days)
```

### Category-Specific Recommendations

#### Annual Leave
```
Recommended Configuration:
max_consecutive_days: 14
max_days_per_request: None (or 14)

Rationale:
• Allow meaningful vacations
• Prevent extended absence beyond 2 weeks
• Encourage return to work periodically
• Balance employee needs with business continuity
```

#### Casual Leave
```
Recommended Configuration:
max_consecutive_days: 3
max_days_per_request: 2

Rationale:
• Short-term nature of casual leave
• Prevent misuse as extended leave
• Encourage proper annual leave for longer breaks
• Easy to cover short absences
```

#### Sick Leave
```
Recommended Configuration:
max_consecutive_days: 7 (without certificate)
max_days_per_request: None

Rationale:
• Based on medical need, not arbitrary limit
• Certificate required for >2 days
• Extended illness transitions to medical leave
• No per-request limit (medical certificate validates)
```

#### Maternity/Paternity Leave
```
Recommended Configuration:
max_consecutive_days: None
max_days_per_request: None

Rationale:
• Legal entitlement, cannot restrict
• Fixed duration (84 days maternity, 3 days paternity)
• Must be taken consecutively
• No arbitrary limits allowed
```

### Weekend and Holiday Handling

```
Consecutive Days Calculation
════════════════════════════════════════════════════════

Q: Are weekends counted in consecutive days?
A: Yes, consecutive means calendar days including weekends.

Example:
Request: Friday + Monday (2 leave days)
Consecutive Days: Fri, Sat, Sun, Mon = 4 calendar days

But only 2 leave days deducted from balance.

───────────────────────────────────────────────────────

Q: Are public holidays counted?
A: Public holidays are not leave days, but they are part of consecutive period.

Example:
Request: Mon, Tue (2 leave days)
Wednesday: Public Holiday
Request: Thu, Fri (2 leave days)

Leave Days Used: 4
Consecutive Calendar Days: Mon-Fri = 5 days

───────────────────────────────────────────────────────

Important:
• max_consecutive_days refers to calendar days
• Leave balance deduction counts working days only
• System calculates both for validation
```

### Expected Outcome
- Maximum day restrictions defined
- Consecutive day limit control
- Per-request limit control
- Balanced flexibility and constraint

### Verification Checklist
- [ ] max_consecutive_days field added
- [ ] max_days_per_request field added
- [ ] Both fields PositiveIntegerField
- [ ] Both fields optional (null=True, blank=True)
- [ ] Validation: max_days_per_request <= max_consecutive_days
- [ ] Validation: max_consecutive_days <= default_days_per_year
- [ ] Help text added explaining both fields
- [ ] Model docstring updated

---

## Task 08: Add Paid Leave Flag

### Overview
Add the is_paid field to the LeaveType model. This boolean field indicates whether the leave type is paid or unpaid, affecting salary calculations, EPF/ETF contributions, and payroll processing in compliance with Sri Lankan labor regulations.

### Dependencies
- Task 07: Add Max Days Field

### Instructions

1. **Open leave_type.py model file**
   - Continue in `backend/apps/leave/models/leave_type.py`
   - Locate LeaveType model class

2. **Add is_paid field**
   - BooleanField type
   - Default to True
   - Required field (no null)
   - Indicates if leave is paid or unpaid

3. **Add field validation**
   - Update clean method
   - Validate is_paid consistency with category
   - Maternity and paternity must be paid (legal requirement)
   - No-pay leave must be unpaid

4. **Add help text**
   - Explain paid vs unpaid impact
   - Note payroll integration
   - Mention EPF/ETF considerations

5. **Update model docstring**
   - Document is_paid field
   - Explain Sri Lankan legal requirements
   - Note payroll implications

### is_paid Field Structure

```
┌─────────────────────────────────────────────────────────────┐
│                   is_paid Field Details                      │
├─────────────────────────────────────────────────────────────┤
│ Field Properties:                                            │
│  • Type: BooleanField                                        │
│  • Default: True                                             │
│  • Required: No null/blank                                   │
│  • Purpose: Determines salary payment during leave           │
│                                                              │
│ Impact on Systems:                                           │
│  • Payroll: Salary calculation                               │
│  • EPF/ETF: Contribution continuation                        │
│  • Reports: Leave cost analysis                              │
│  • Balance: Affects annual leave encashment                  │
│                                                              │
│ Legal Requirements (Sri Lanka):                              │
│  • Annual, Sick, Maternity, Paternity: Must be paid          │
│  • No-Pay Leave: Must be unpaid                              │
│  • Other: Company policy                                     │
└─────────────────────────────────────────────────────────────┘
```

### Paid vs Unpaid Leave Comparison

| Aspect | Paid Leave | Unpaid Leave |
|--------|------------|--------------|
| **Salary** | Full salary paid | No salary |
| **EPF Contribution** | Employee & Employer continue | May pause |
| **ETF Contribution** | Employer continues | May pause |
| **Annual Leave Accrual** | Continues | May pause |
| **Service Continuity** | Unaffected | May be affected |
| **Benefits** | All benefits continue | May be suspended |
| **Leave Balance** | Deducts from balance | N/A (by agreement) |
| **Legal Protection** | Protected | Less protection |

### Category-Specific Configuration

| Category | is_paid | Legal Requirement | Notes |
|----------|---------|------------------|-------|
| ANNUAL | ✅ True | Yes (Shop & Office Act) | Must be paid |
| CASUAL | ✅ True | Industry practice | Typically paid |
| SICK | ✅ True | Yes (with certificate) | Paid if medically justified |
| MATERNITY | ✅ True | Yes (Maternity Benefits Ordinance) | Cannot be unpaid |
| PATERNITY | ✅ True | Yes (recent legislation) | Cannot be unpaid |
| NO_PAY | ❌ False | By definition | Must be unpaid |
| OTHER | ⚠️ Varies | Company policy | Depends on type |

### Salary Calculation Impact

```
Monthly Salary Calculation with Leave
════════════════════════════════════════════════════════

Employee: Priya
Basic Salary: LKR 100,000/month
Working Days: 22 days in month

Scenario 1: Paid Leave (Annual Leave)
────────────────────────────────────────────────────────
Days Worked: 17 days
Paid Leave: 5 days (Annual Leave)
Total Paid Days: 17 + 5 = 22 days

Salary Calculation:
Base: LKR 100,000
Deduction: LKR 0 (paid leave)
Total Salary: LKR 100,000 ✅

Scenario 2: Unpaid Leave (No-Pay Leave)
────────────────────────────────────────────────────────
Days Worked: 17 days
Unpaid Leave: 5 days (No-Pay Leave)
Total Paid Days: 17 days only

Salary Calculation:
Base: LKR 100,000
Daily Rate: 100,000 / 22 = LKR 4,545.45
Deduction: 4,545.45 × 5 = LKR 22,727.25
Total Salary: LKR 77,272.75

Scenario 3: Mixed Leave
────────────────────────────────────────────────────────
Days Worked: 15 days
Paid Leave: 3 days (Annual Leave)
Unpaid Leave: 4 days (No-Pay Leave)
Total Paid Days: 15 + 3 = 18 days

Salary Calculation:
Base: LKR 100,000
Daily Rate: 100,000 / 22 = LKR 4,545.45
Deduction: 4,545.45 × 4 = LKR 18,181.80
Total Salary: LKR 81,818.20
```

### EPF and ETF Contribution Impact

```
EPF/ETF Contributions with Leave Types
════════════════════════════════════════════════════════

Sri Lankan EPF/ETF Rates:
• EPF Employee: 8% of basic salary
• EPF Employer: 12% of basic salary
• ETF Employer: 3% of basic salary

Scenario 1: Paid Leave
────────────────────────────────────────────────────────
Basic Salary: LKR 100,000
Leave: 5 days Annual Leave (paid)

Contribution Base: LKR 100,000 (full salary)
EPF Employee: 100,000 × 8% = LKR 8,000
EPF Employer: 100,000 × 12% = LKR 12,000
ETF Employer: 100,000 × 3% = LKR 3,000
Total: LKR 23,000 ✅

Contributions continue normally.

Scenario 2: Unpaid Leave (Short Duration <30 days)
────────────────────────────────────────────────────────
Basic Salary: LKR 100,000
Days Worked: 17 days
Unpaid Leave: 5 days
Actual Salary: LKR 77,272.75

Option A: Full Contribution Base
Contribution Base: LKR 100,000 (full salary)
EPF/ETF calculated on full salary
Company policy: Maintain full contributions

Option B: Reduced Contribution Base
Contribution Base: LKR 77,272.75 (actual salary)
EPF Employee: 77,272.75 × 8% = LKR 6,181.82
EPF Employer: 77,272.75 × 12% = LKR 9,272.73
ETF Employer: 77,272.75 × 3% = LKR 2,318.18
Total: LKR 17,772.73

Scenario 3: Unpaid Leave (Extended >30 days)
────────────────────────────────────────────────────────
No-Pay Leave: 45 days in a month

Contributions may be suspended entirely.
Employee's EPF account shows break in contributions.
May affect continuous service calculation.
```

### Sri Lankan Legal Requirements

```
Paid Leave Legal Framework
════════════════════════════════════════════════════════

Annual Leave (Shop & Office Employees Act No. 15 of 1954)
────────────────────────────────────────────────────────
Requirement:
• Minimum 14 days paid annual leave
• After 12 months continuous service
• Full wages during leave period
• Cannot be substituted with payment (except on termination)

Violation:
• Legal action possible
• Department of Labour complaint
• Penalties for employer

Maternity Benefits (Maternity Benefits Ordinance)
────────────────────────────────────────────────────────
Requirement:
• 84 days (12 weeks) fully paid maternity leave
• Cannot be denied
• Cannot be reduced
• Employer must pay full wages

Funding:
• First 42 days: Employer pays
• Remaining 42 days: EPF/Government may reimburse
  (subject to conditions)

Violation:
• Serious legal violation
• Labour tribunal action
• Mandatory compliance

Paternity Leave (Recent Legislation)
────────────────────────────────────────────────────────
Requirement:
• 3 working days paid leave
• Within 4 weeks of childbirth
• Cannot be denied

Violation:
• Labour complaint possible
• Employer may face penalties
```

### Payroll System Integration

```
┌──────────────────────────────────────────────────────────────┐
│         Leave Type → Payroll Integration Flow                │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  Leave Application Approved                                  │
│  └─→ Check: is_paid flag                                     │
│                                                              │
│  If is_paid = True:                                          │
│  ├─→ No salary deduction                                     │
│  ├─→ Count as worked days for payroll                        │
│  ├─→ Full EPF/ETF contributions                              │
│  ├─→ All benefits continue                                   │
│  └─→ Annual leave accrual continues                          │
│                                                              │
│  If is_paid = False:                                         │
│  ├─→ Calculate daily rate                                    │
│  ├─→ Deduct (daily_rate × leave_days)                        │
│  ├─→ Reduce EPF/ETF contribution base                        │
│  ├─→ May suspend benefits (policy dependent)                 │
│  └─→ May pause annual leave accrual                          │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### Leave Cost Analysis

```
Monthly Leave Cost Report Example
════════════════════════════════════════════════════════

Company: LankaCommerce Pvt Ltd
Month: December 2026

Leave Type Costs:
────────────────────────────────────────────────────────
Annual Leave (Paid):
• 15 employees took annual leave
• Total days: 75 days
• Average daily cost: LKR 5,000
• Total cost: LKR 375,000

Sick Leave (Paid):
• 8 employees took sick leave
• Total days: 22 days
• Average daily cost: LKR 4,800
• Total cost: LKR 105,600

Casual Leave (Paid):
• 20 employees took casual leave
• Total days: 35 days
• Average daily cost: LKR 4,500
• Total cost: LKR 157,500

No-Pay Leave (Unpaid):
• 3 employees took no-pay leave
• Total days: 12 days
• Salary savings: LKR 60,000
• Net cost: LKR 0 (saved)

────────────────────────────────────────────────────────
Total Paid Leave Cost: LKR 638,100
Unpaid Leave Savings: LKR 60,000
Net Leave Cost: LKR 578,100

Note: is_paid flag enables accurate cost tracking
```

### Validation Rules

```
is_paid Validation Logic
════════════════════════════════════════════════════════

1. Category-Specific Rules:
   
   If category = MATERNITY:
   └─→ is_paid must be True (legal requirement)
   
   If category = PATERNITY:
   └─→ is_paid must be True (legal requirement)
   
   If category = NO_PAY:
   └─→ is_paid must be False (by definition)
   
   If category = ANNUAL:
   └─→ is_paid must be True (Sri Lankan law)

2. Consistency Rules:
   
   If is_paid = False and default_days_per_year > 0:
   └─→ Warning: Unusual configuration
   
   If is_paid = True and category = NO_PAY:
   └─→ Error: Contradiction

3. Business Rules:
   
   If is_paid = True:
   └─→ Requires leave balance tracking
   └─→ Affects leave encashment eligibility
   
   If is_paid = False:
   └─→ No balance tracking needed
   └─→ Duration by agreement
```

### Expected Outcome
- Clear paid/unpaid designation
- Payroll integration support
- EPF/ETF compliance
- Legal requirement enforcement

### Verification Checklist
- [ ] is_paid field added
- [ ] Field type is BooleanField
- [ ] Default set to True
- [ ] No null/blank allowed
- [ ] Category-specific validation added
- [ ] Maternity/Paternity must be paid
- [ ] No-Pay must be unpaid
- [ ] Help text explains payroll impact
- [ ] Model docstring updated

---

## Task 09: Add Document Required Flag

### Overview
Add the requires_document field to the LeaveType model. This boolean field indicates whether supporting documentation (medical certificates, proof, etc.) is required when applying for this leave type, ensuring proper verification and compliance with company policies and legal requirements.

### Dependencies
- Task 08: Add Paid Leave Flag

### Instructions

1. **Open leave_type.py model file**
   - Continue in `backend/apps/leave/models/leave_type.py`
   - Locate LeaveType model class

2. **Add requires_document field**
   - BooleanField type
   - Default to False
   - Required field (no null)
   - Indicates if documentation required

3. **Add field validation**
   - Update clean method
   - Validate requires_document consistency with category
   - Sick leave typically requires document
   - Maternity always requires medical certificate

4. **Add help text**
   - Explain document requirement purpose
   - List typical document types
   - Note approval workflow impact

5. **Update model docstring**
   - Document requires_document field
   - Explain document types by category
   - Note verification process

### requires_document Field Structure

```
┌─────────────────────────────────────────────────────────────┐
│            requires_document Field Details                   │
├─────────────────────────────────────────────────────────────┤
│ Field Properties:                                            │
│  • Type: BooleanField                                        │
│  • Default: False                                            │
│  • Required: No null/blank                                   │
│  • Purpose: Mandate supporting documentation                 │
│                                                              │
│ Impact on Workflow:                                          │
│  • Application: Document upload required                     │
│  • Approval: Verifier checks documents                       │
│  • Validation: Cannot approve without documents              │
│  • Audit: Document retention for compliance                  │
│                                                              │
│ Document Types by Category:                                  │
│  • Sick: Medical certificate                                 │
│  • Maternity: Pregnancy/birth certificate                    │
│  • Paternity: Birth certificate                              │
│  • Study: Exam schedule, admission letter                    │
│  • Other: Varies by leave type                               │
└─────────────────────────────────────────────────────────────┘
```

### Document Requirements by Category

| Category | requires_document | Document Type | When Required | Legal Basis |
|----------|------------------|---------------|---------------|-------------|
| ANNUAL | ❌ False | None | N/A | Not required |
| CASUAL | ❌ False | None | N/A | Short duration |
| SICK | ✅ True | Medical Certificate | >2 consecutive days | Industry practice |
| MATERNITY | ✅ True | Medical Certificate, Birth Cert | Always | Legal requirement |
| PATERNITY | ✅ True | Birth Certificate | Always | Legal requirement |
| NO_PAY | ⚠️ Varies | Varies | Depends on reason | Company policy |
| OTHER | ⚠️ Varies | Type-specific | Varies | Company policy |

### Document Types and Examples

#### Medical Certificate (Sick Leave)
```
Required Information:
════════════════════════════════════════════════════════
• Patient name
• Diagnosis (general, not detailed)
• Date of examination
• Period of rest recommended
• Doctor's name, qualifications, registration
• Medical facility stamp/seal
• Doctor's signature
• Contact information

Example:
────────────────────────────────────────────────────────
             DR. NIMAL PERERA MBBS, MD
          Asiri Medical Center, Colombo 05
          SLMC Registration: 12345

MEDICAL CERTIFICATE

This is to certify that Mr./Ms. KAMAL SILVA was examined
by me on December 10, 2026.

Diagnosis: Acute Viral Fever

Recommended Rest: December 10-13, 2026 (3 days)

Doctor's Signature: [Signature]
Date: December 10, 2026
Contact: +94 11 234 5678
```

#### Maternity Certificate
```
Required Documents:
════════════════════════════════════════════════════════

1. Pregnancy Confirmation Certificate:
   • Issued by registered medical practitioner
   • Expected delivery date (EDD)
   • Current weeks of pregnancy
   • Medical advice on leave commencement

2. Birth Certificate (After Delivery):
   • Official birth certificate
   • Date of birth
   • Child's name
   • Parents' names

Example Pregnancy Certificate:
────────────────────────────────────────────────────────
          ASIRI HOSPITAL - MATERNITY UNIT
          
PREGNANCY CONFIRMATION CERTIFICATE

Patient: Ms. PRIYA FERNANDO
Date of Examination: November 15, 2026
Current Gestation: 32 weeks
Expected Delivery Date: January 15, 2027

Medical Advice: Patient is fit to work until December 31,
2026. Maternity leave recommended from January 1, 2027.

Obstetrician: Dr. Samanthi Silva
Signature: [Signature]
```

#### Paternity Certificate
```
Required Document:
════════════════════════════════════════════════════════

Birth Certificate:
• Official document from hospital or registrar
• Child's date of birth
• Father's name (employee)
• Mother's name
• Hospital stamp

Must be submitted:
• Within 4 weeks of birth
• Before taking paternity leave
• Copy acceptable, original for verification

Example:
────────────────────────────────────────────────────────
        GOVERNMENT OF SRI LANKA
           BIRTH CERTIFICATE
           
Child's Name: Baby Silva
Date of Birth: December 15, 2026
Place of Birth: Colombo General Hospital

Father: Mr. ROHAN SILVA (Employee)
Mother: Mrs. NADEESHA SILVA

Registration No: 2026/CGH/12345
Issued: December 16, 2026
```

#### Study Leave Documentation
```
Required Documents:
════════════════════════════════════════════════════════

1. Exam Schedule/Admission Letter:
   • Institution name
   • Course/program details
   • Exam dates or class schedule
   • Official letterhead

2. Proof of Enrollment:
   • Student ID card
   • Fee receipt
   • Enrollment confirmation

Example:
────────────────────────────────────────────────────────
        UNIVERSITY OF COLOMBO
        Faculty of Management & Finance

To Whom It May Concern,

This is to certify that Mr. ASHAN PERERA (Student ID:
2025/MF/123) is enrolled in the MBA program.

Final examinations are scheduled as follows:
• December 18, 2026: Strategic Management
• December 20, 2026: Financial Analysis
• December 22, 2026: Marketing Management

Study leave request for December 15-23, 2026 is
appropriate for exam preparation and attendance.

Registrar: [Signature]
Date: November 30, 2026
```

### Application Workflow Impact

```
┌──────────────────────────────────────────────────────────────┐
│       Leave Application Workflow with Document Requirement   │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  Employee Initiates Leave Application                        │
│  └─→ Select Leave Type                                       │
│      └─→ Check: requires_document                            │
│                                                              │
│  If requires_document = False (e.g., Annual Leave):          │
│  ├─→ Fill application form                                   │
│  ├─→ Submit for approval                                     │
│  └─→ No document upload needed                               │
│                                                              │
│  If requires_document = True (e.g., Sick Leave):             │
│  ├─→ Fill application form                                   │
│  ├─→ Upload supporting document (required)                   │
│  ├─→ Cannot submit without document                          │
│  └─→ Submit for approval with document                       │
│                                                              │
│  Approval Process:                                           │
│  ├─→ Manager/HR reviews application                          │
│  ├─→ If document required: Verify document authenticity      │
│  ├─→ Check document validity (dates, signatures)             │
│  └─→ Approve/Reject based on document                        │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### Document Validation Rules

```
Document Verification Checklist
════════════════════════════════════════════════════════

Medical Certificate (Sick Leave):
✅ Doctor's name and registration number
✅ Medical facility stamp/seal
✅ Date of examination within leave period
✅ Recommended rest period matches application
✅ Clear diagnosis (general)
✅ Doctor's signature present

Maternity Certificate:
✅ Registered medical practitioner
✅ Expected delivery date (EDD)
✅ Current gestation period
✅ Medical advice for leave start
✅ Birth certificate (after delivery)

Paternity Certificate:
✅ Official birth certificate
✅ Employee listed as father
✅ Date of birth within 4 weeks
✅ Hospital/registrar stamp
✅ Original or certified copy

Study Leave:
✅ Official institution letterhead
✅ Exam dates or class schedule
✅ Student enrollment proof
✅ Dates match leave application

General Validation:
✅ Document is legible
✅ Not expired or backdated
✅ Matches employee details
✅ Matches leave dates
✅ Contains all required information
```

### Configuration Recommendations

| Leave Type | requires_document | Reasoning |
|------------|------------------|-----------|
| Annual Leave | ❌ False | No justification needed, entitled |
| Casual Leave | ❌ False | Short-term, no proof required |
| Sick Leave (≤2 days) | ❌ False | Company policy, short duration |
| Sick Leave (>2 days) | ✅ True | Medical justification required |
| Maternity Leave | ✅ True | Legal requirement, medical proof |
| Paternity Leave | ✅ True | Birth certificate required |
| No-Pay Leave | ⚠️ Varies | Depends on reason |
| Study Leave | ✅ True | Exam schedule, enrollment proof |
| Hajj Leave | ✅ True | Travel documents, visa |
| Bereavement | ✅ True | Death certificate, obituary |

### Document Retention and Compliance

```
Document Management Requirements
════════════════════════════════════════════════════════

Storage:
• Digital copies stored securely
• Original documents returned after verification
• Encrypted database storage
• Access control (HR only)

Retention Period:
• Minimum 3 years (legal requirement)
• Recommended 7 years (audit purposes)
• Maternity/legal documents: 10 years

Privacy and Confidentiality:
• GDPR/data protection compliance
• Medical certificates: Highly confidential
• Access logs maintained
• Employee consent for storage

Audit Trail:
• Document upload timestamp
• Uploaded by (employee ID)
• Verified by (approver ID)
• Verification timestamp
• Document hash for integrity
```

### UI/UX Considerations

```
Application Form Behavior
════════════════════════════════════════════════════════

If requires_document = True:

┌───────────────────────────────────────────────────┐
│ Leave Application Form                            │
├───────────────────────────────────────────────────┤
│                                                   │
│ Leave Type: Sick Leave                            │
│ From Date: Dec 10, 2026                           │
│ To Date: Dec 13, 2026                             │
│ Days: 4 days                                      │
│                                                   │
│ ⚠️ Supporting Document Required                   │
│ ┌─────────────────────────────────────────────┐   │
│ │ [📎 Upload Medical Certificate]             │   │
│ │                                             │   │
│ │ Accepted formats: PDF, JPG, PNG             │   │
│ │ Maximum size: 5 MB                          │   │
│ │                                             │   │
│ │ [ Choose File... ]   No file chosen         │   │
│ └─────────────────────────────────────────────┘   │
│                                                   │
│ Reason: Viral fever, need rest                   │
│                                                   │
│ [ Submit ] ← Disabled until document uploaded    │
│                                                   │
└───────────────────────────────────────────────────┘

After Upload:
[ Submit ] ← Enabled, can submit application
```

### Expected Outcome
- Document requirement flag set
- Upload workflow enforced
- Document verification supported
- Compliance and audit trail

### Verification Checklist
- [ ] requires_document field added
- [ ] Field type is BooleanField
- [ ] Default set to False
- [ ] No null/blank allowed
- [ ] Category-specific recommendations noted
- [ ] Help text explains document types
- [ ] Model docstring updated
- [ ] Validation logic added

---

## Summary

This document established the foundation of the leave management system:

### Completed Infrastructure
- ✅ Leave Django app created and registered
- ✅ LeaveTypeCategory choices defined (ANNUAL, CASUAL, SICK, MATERNITY, PATERNITY, NO_PAY, OTHER)
- ✅ Core LeaveType model with tenant awareness
- ✅ Leave type identification (name, code, category)
- ✅ Description and color for UI/calendar
- ✅ Days per year entitlement configuration
- ✅ Maximum day restrictions (consecutive, per request)
- ✅ Paid/unpaid flag with payroll integration
- ✅ Document requirement flag with verification workflow

### Key Achievements
1. **Sri Lankan Compliance** - Leave categories aligned with local labor laws
2. **Flexible Configuration** - Default days with policy override capability
3. **Payroll Integration** - Paid/unpaid flag for salary calculations
4. **Document Verification** - Required document flag for approval workflow
5. **Multi-Tenant Support** - Complete tenant isolation with proper indexing

### Field Summary
| Field | Type | Purpose |
|-------|------|---------|
| name | CharField | Human-readable leave type name |
| code | CharField | Short identifier (unique per tenant) |
| category | CharField | LeaveTypeCategory choice |
| description | TextField | Detailed rules and guidelines |
| color | CharField | Hex color for calendar |
| default_days_per_year | Integer | Standard entitlement |
| max_consecutive_days | Integer | Consecutive day limit |
| max_days_per_request | Integer | Per-application limit |
| is_paid | Boolean | Paid vs unpaid leave |
| requires_document | Boolean | Document requirement flag |
| is_active | Boolean | Availability status |
| allow_half_day | Boolean | Half-day option |

### Next Steps
Proceed to [02_Tasks-10-18_Restrictions-Policy-Seed.md](02_Tasks-10-18_Restrictions-Policy-Seed.md) to implement gender restrictions, service requirements, LeavePolicy model, and seed default leave types.

---

**Document Status:** ✅ Complete  
**Total Tasks:** 9  
**Total Lines:** ~1398
