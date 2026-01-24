# Tasks 49-55: EPF and ETF Settings Configuration

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 05 - Salary Structure  
> **Group:** D - Statutory Components (EPF/ETF/PAYE)  
> **Document:** 01 of 02  
> **Tasks Covered:** 49, 50, 51, 52, 53, 54, 55

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-56-64_PAYE-TaxSlab-Exemption.md](02_Tasks-56-64_PAYE-TaxSlab-Exemption.md)

---

## Document Overview

This document covers the implementation of EPF (Employees' Provident Fund) and ETF (Employees' Trust Fund) settings models for Sri Lanka statutory compliance. These models store the mandatory contribution rates and configurations required for accurate payroll processing according to Sri Lankan labor laws.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 49 | Create EPFSettings Model | Medium | 25 min |
| 50 | Add EPF Rate Fields | Low | 15 min |
| 51 | Add EPF Ceiling Field | Low | 15 min |
| 52 | Run EPFSettings Migrations | Low | 15 min |
| 53 | Create ETFSettings Model | Medium | 20 min |
| 54 | Add ETF Rate Field | Low | 15 min |
| 55 | Run ETFSettings Migrations | Low | 15 min |

---

## Task 49: Create EPFSettings Model

### Overview
Create the EPFSettings model to store Employees' Provident Fund configuration for each tenant. EPF is a mandatory retirement savings scheme in Sri Lanka where both employee and employer contribute to the fund. This model maintains the contribution rates and effective dates for accurate payroll processing.

### Dependencies
- Payroll application (`apps/payroll/`) must exist
- Tenant/Client model exists
- Base model mixins available (TenantAwareMixin, TimestampMixin)
- Django ORM configured

### Instructions

1. **Create epf_settings.py model file**
   - Navigate to `apps/payroll/models/` directory
   - Create new file named `epf_settings.py`
   - This will contain the EPFSettings model

2. **Import required modules**
   - Import Django model fields (CharField, DecimalField, DateField, BooleanField)
   - Import Django models base class
   - Import base model mixins (TenantAwareMixin, TimestampMixin)
   - Import tenant/client model
   - Import Decimal for default values

3. **Define EPFSettings model class**
   - Create class named EPFSettings
   - Inherit from Django Model
   - Add comprehensive model docstring explaining EPF purpose

4. **Add tenant relationship field**
   - OneToOneField to Client/Tenant model
   - Sets on_delete=CASCADE (if tenant deleted, settings deleted)
   - Related_name='epf_settings'
   - Ensures one EPF settings record per tenant

5. **Add effective_from field**
   - DateField to track when these rates become effective
   - Required field (no blank/null)
   - Important for rate change tracking
   - Allows historical rate queries

6. **Add is_active field**
   - BooleanField with default=True
   - Controls whether these settings are currently in use
   - Allows disabling without deletion
   - Only one active settings per tenant typically

7. **Add Meta class**
   - Set verbose_name to "EPF Settings"
   - Set verbose_name_plural to "EPF Settings"
   - Add ordering by ['-effective_from'] (newest first)
   - Add unique_together constraint on (tenant, effective_from)

8. **Add __str__ method**
   - Return string format: "EPF Settings for {tenant_name}"
   - Include effective_from date
   - Format: "EPF Settings for Tenant A (Effective: 2024-01-01)"

9. **Add model docstring**
   - Explain EPF mandatory contribution scheme
   - Note employee and employer contribution rates
   - Document typical Sri Lankan EPF rates (8% employee, 12% employer)

10. **Update models/__init__.py**
    - Import EPFSettings from epf_settings
    - Add EPFSettings to __all__ list

### EPF Settings Model Structure

```
┌─────────────────────────────────────────────────┐
│            EPFSettings Model                    │
├─────────────────────────────────────────────────┤
│ Core Fields:                                    │
│  • tenant (OneToOneField)                       │
│  • effective_from (DateField)                   │
│  • is_active (BooleanField)                     │
│                                                 │
│ Rate Fields (Task 50):                          │
│  • employee_rate (DecimalField)                 │
│  • employer_rate (DecimalField)                 │
│                                                 │
│ Ceiling Fields (Task 51):                       │
│  • max_contribution_ceiling (DecimalField)      │
│                                                 │
│ Inherited from TimestampMixin:                  │
│  • created_at (DateTimeField)                   │
│  • updated_at (DateTimeField)                   │
└─────────────────────────────────────────────────┘
```

### Model Relationships

```
┌──────────────┐         1:1          ┌────────────────────┐
│    Tenant    │◄─────────────────────│   EPFSettings      │
│   (Client)   │                      │                    │
└──────────────┘                      └────────────────────┘
                                               │
                                               │ Used by
                                               ▼
                                      ┌────────────────────┐
                                      │  Payroll Process   │
                                      │   (Future Phase)   │
                                      └────────────────────┘
```

### EPF System Overview

#### What is EPF?
EPF (Employees' Provident Fund) is a mandatory retirement savings scheme in Sri Lanka established under the Employees' Provident Fund Act No. 15 of 1958. It applies to most private sector employees and some public sector employees.

#### EPF Key Features
- **Mandatory Contribution:** Required for employees earning above threshold
- **Employee Contribution:** 8% of EPF-applicable earnings
- **Employer Contribution:** 12% of EPF-applicable earnings
- **Total EPF:** 20% of EPF-applicable earnings goes to employee's account
- **Tax Benefit:** Employee contribution is tax-deductible from taxable income
- **Withdrawal:** Typically at retirement, resignation, or specific circumstances

#### EPF-Applicable Earnings

```
✅ Included in EPF Base:
├── Basic Salary
├── Fixed Allowances (housing, transport, etc.)
├── Overtime Payments
└── Shift Allowances

❌ Excluded from EPF Base:
├── Performance Bonuses (usually)
├── Festival Bonuses
├── Reimbursements (travel, meals)
├── Gratuity
└── Commissions (in some cases)
```

#### EPF Calculation Example
```
Employee Details:
├── Basic Salary: 50,000 LKR
├── Fixed Allowances: 20,000 LKR
├── Overtime: 5,000 LKR
└── Bonus: 10,000 LKR (excluded)
─────────────────────────────
EPF Base: 75,000 LKR

Contributions:
├── Employee (8%): 6,000 LKR (deducted from salary)
├── Employer (12%): 9,000 LKR (company expense)
└── Total to EPF: 15,000 LKR
```

### Rate Change Scenarios

#### Historical Rate Tracking
```
Tenant EPF Settings History:
├── 2022-01-01: Employee 8%, Employer 12% (Standard)
├── 2023-06-01: Employee 8%, Employer 12% (No change)
└── 2024-01-01: Employee 8%, Employer 12% (Current)

When calculating payroll for any period:
→ Use settings with effective_from ≤ payroll_period_start
→ Most recent applicable settings
```

#### Multiple Settings Per Tenant
```
Scenario: Rates change mid-year

EPFSettings Records:
├── Record 1: effective_from=2024-01-01, is_active=False
│   └── Old rates used for Jan-June payrolls
└── Record 2: effective_from=2024-07-01, is_active=True
    └── New rates for July onwards

Query for Payroll (August 2024):
→ Filter: effective_from ≤ 2024-08-01
→ Order by: effective_from DESC
→ First result: Record 2 (July rates)
```

### Field Details

| Field | Type | Required | Default | Purpose |
|-------|------|----------|---------|---------|
| tenant | OneToOneField | Yes | - | Tenant association |
| effective_from | DateField | Yes | - | Rate effective date |
| is_active | BooleanField | Yes | True | Active status |

### Expected Outcome
- Functional EPFSettings model created
- One settings record per tenant
- Support for rate change tracking
- Foundation for EPF contribution calculations
- Historical rate queries possible

### Verification Checklist
- [ ] epf_settings.py file created
- [ ] EPFSettings class defined
- [ ] tenant field added (OneToOneField)
- [ ] effective_from field added
- [ ] is_active field added
- [ ] Meta class configured
- [ ] __str__ method implemented
- [ ] Model docstring comprehensive
- [ ] Model imported in __init__.py

---

## Task 50: Add EPF Rate Fields

### Overview
Add the employee and employer contribution rate fields to the EPFSettings model. These fields store the percentage rates that determine how much each party contributes to the EPF fund based on the employee's EPF-applicable earnings.

### Dependencies
- Task 49: Create EPFSettings Model

### Instructions

1. **Open epf_settings.py model file**
   - Navigate to `apps/payroll/models/epf_settings.py`
   - Locate EPFSettings model class

2. **Import Decimal if not already imported**
   - From decimal import Decimal
   - Used for setting default rate values

3. **Add employee_rate field**
   - DecimalField with max_digits=5, decimal_places=2
   - Default value: Decimal('8.00') (8%)
   - Required field (no blank/null)
   - Represents employee contribution percentage

4. **Add field help text for employee_rate**
   - Help text: "Employee EPF contribution rate as percentage (e.g., 8.00 for 8%)"
   - Guides users on expected format

5. **Add employer_rate field**
   - DecimalField with max_digits=5, decimal_places=2
   - Default value: Decimal('12.00') (12%)
   - Required field (no blank/null)
   - Represents employer contribution percentage

6. **Add field help text for employer_rate**
   - Help text: "Employer EPF contribution rate as percentage (e.g., 12.00 for 12%)"
   - Clarifies percentage format

7. **Add clean method validation**
   - Override clean() method
   - Validate that employee_rate >= 0 and <= 100
   - Validate that employer_rate >= 0 and <= 100
   - Raise ValidationError if rates are invalid

8. **Update model docstring**
   - Document the standard Sri Lankan EPF rates
   - Note: Employee 8%, Employer 12%
   - Mention that rates are configurable per tenant

### EPF Rate Field Structure

```
┌────────────────────────────────────────────────┐
│            EPF Rate Fields                     │
├────────────────────────────────────────────────┤
│ employee_rate                                  │
│  • Type: DecimalField(5, 2)                    │
│  • Default: 8.00                               │
│  • Range: 0.00 - 100.00                        │
│  • Purpose: Employee contribution %             │
│                                                │
│ employer_rate                                  │
│  • Type: DecimalField(5, 2)                    │
│  • Default: 12.00                              │
│  • Range: 0.00 - 100.00                        │
│  • Purpose: Employer contribution %             │
└────────────────────────────────────────────────┘
```

### Standard Sri Lankan EPF Rates

| Party | Rate | Legal Basis | Description |
|-------|------|-------------|-------------|
| Employee | 8% | EPF Act | Deducted from employee salary |
| Employer | 12% | EPF Act | Paid by employer (additional cost) |
| **Total** | **20%** | - | Goes to employee's EPF account |

### EPF Rate Calculation Flow

```
Employee Monthly Salary Breakdown:
┌─────────────────────────────────────────────┐
│ Basic Salary: 50,000 LKR                    │
│ Fixed Allowances: 20,000 LKR                │
│ Overtime: 5,000 LKR                         │
├─────────────────────────────────────────────┤
│ EPF Base: 75,000 LKR                        │
└─────────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────┐
│ Apply EPF Rates:                            │
│                                             │
│ Employee Contribution:                      │
│   75,000 × 8% = 6,000 LKR                   │
│   (Deducted from net salary)                │
│                                             │
│ Employer Contribution:                      │
│   75,000 × 12% = 9,000 LKR                  │
│   (Company expense)                         │
│                                             │
│ Total EPF: 15,000 LKR                       │
└─────────────────────────────────────────────┘
```

### Rate Configuration Examples

#### Standard Private Sector
```
EPFSettings:
  employee_rate: 8.00
  employer_rate: 12.00
  
Application: 99% of Sri Lankan private companies
```

#### Special Economic Zone (Hypothetical)
```
EPFSettings:
  employee_rate: 6.00
  employer_rate: 10.00
  
Application: Special rates in designated zones
Note: This is hypothetical - actual law applies standard rates
```

#### Voluntary Higher Contribution
```
EPFSettings:
  employee_rate: 10.00  ← Voluntary higher rate
  employer_rate: 12.00
  
Application: Employee opts for higher retirement savings
```

### Rate Field Precision

#### Why DecimalField(5, 2)?
```
Max Digits: 5
Decimal Places: 2

Range: 000.00 to 999.99
Practical: 0.00 to 100.00

Examples:
✅ 8.00 (Valid)
✅ 12.50 (Valid)
✅ 100.00 (Valid - maximum)
❌ 101.00 (Invalid - exceeds 100%)
❌ 8.123 (Invalid - too many decimals)
```

### Validation Rules

```
Rate Validation Logic:
├── employee_rate must be >= 0
├── employee_rate must be <= 100
├── employer_rate must be >= 0
├── employer_rate must be <= 100
└── Rates stored as percentages (not decimals)

Example Valid Rates:
✅ 8.00, 12.00 (Standard)
✅ 0.00, 0.00 (Zero contributions - special case)
✅ 10.00, 15.00 (Custom rates)

Example Invalid Rates:
❌ -1.00 (Negative not allowed)
❌ 150.00 (Exceeds 100%)
❌ 8.5678 (Too many decimal places)
```

### Impact on Payroll Calculations

```
Payroll Calculation Sequence:
1. Calculate EPF-applicable earnings
   └── Basic + Fixed Allowances + Overtime

2. Fetch EPFSettings for tenant
   └── Get employee_rate and employer_rate

3. Calculate employee contribution
   └── EPF_base × (employee_rate / 100)

4. Calculate employer contribution
   └── EPF_base × (employer_rate / 100)

5. Deduct employee contribution from net pay
   └── Net_salary = Gross_salary - Employee_EPF

6. Add employer contribution to payroll costs
   └── Total_cost = Gross_salary + Employer_EPF
```

### Expected Outcome
- Employee contribution rate field configured
- Employer contribution rate field configured
- Default Sri Lankan statutory rates (8%, 12%)
- Rate validation implemented
- Flexible rate configuration per tenant

### Verification Checklist
- [ ] employee_rate field added
- [ ] employer_rate field added
- [ ] Default values set (8.00, 12.00)
- [ ] DecimalField with correct precision
- [ ] Help text added for both fields
- [ ] clean() method with validation
- [ ] Model docstring updated
- [ ] ValidationError imports added

---

## Task 51: Add EPF Ceiling Field

### Overview
Add an optional contribution ceiling field to the EPFSettings model. Some organizations or jurisdictions may impose a maximum monthly earnings amount on which EPF contributions are calculated, capping the total contribution even if an employee earns above this threshold.

### Dependencies
- Task 50: Add EPF Rate Fields

### Instructions

1. **Open epf_settings.py model file**
   - Continue in `apps/payroll/models/epf_settings.py`
   - Locate EPFSettings model class

2. **Add max_contribution_ceiling field**
   - DecimalField with max_digits=12, decimal_places=2
   - Optional field (blank=True, null=True)
   - Represents maximum monthly earnings for EPF calculation
   - If null, no ceiling is applied

3. **Add field help text**
   - Help text: "Maximum monthly earnings amount for EPF calculation. Leave empty for no ceiling."
   - Clarifies optional nature

4. **Add field verbose name**
   - Verbose_name: "Maximum Contribution Ceiling"
   - User-friendly label

5. **Update clean method validation**
   - Extend existing clean() method
   - If max_contribution_ceiling is provided, validate > 0
   - Raise ValidationError if ceiling is negative or zero

6. **Add ceiling calculation helper method**
   - Create method: get_epf_applicable_amount(gross_amount)
   - If ceiling is set and gross_amount > ceiling, return ceiling
   - Otherwise, return gross_amount
   - This method will be used during payroll calculation

7. **Update model docstring**
   - Document the optional ceiling feature
   - Explain how ceiling affects contribution calculation
   - Note that Sri Lanka typically has no ceiling (null)

### EPF Ceiling Field Structure

```
┌────────────────────────────────────────────────┐
│         EPF Ceiling Configuration              │
├────────────────────────────────────────────────┤
│ max_contribution_ceiling                       │
│  • Type: DecimalField(12, 2)                   │
│  • Optional: Yes (nullable)                    │
│  • Default: null (no ceiling)                  │
│  • Purpose: Cap EPF contribution base          │
│                                                │
│ Helper Method:                                 │
│  • get_epf_applicable_amount(gross)            │
│    └── Returns: min(gross, ceiling or gross)   │
└────────────────────────────────────────────────┘
```

### Ceiling Concept Explanation

#### Without Ceiling (Standard Sri Lankan Practice)
```
Employee A: EPF Base = 75,000 LKR
  ├── Employee Contribution: 75,000 × 8% = 6,000 LKR
  └── Employer Contribution: 75,000 × 12% = 9,000 LKR

Employee B: EPF Base = 500,000 LKR
  ├── Employee Contribution: 500,000 × 8% = 40,000 LKR
  └── Employer Contribution: 500,000 × 12% = 60,000 LKR

No Limit: EPF calculated on full EPF-applicable earnings
```

#### With Ceiling (Hypothetical Scenario)
```
Ceiling Set: 200,000 LKR

Employee A: EPF Base = 75,000 LKR
  ├── Applicable Amount: 75,000 (below ceiling)
  ├── Employee Contribution: 75,000 × 8% = 6,000 LKR
  └── Employer Contribution: 75,000 × 12% = 9,000 LKR

Employee B: EPF Base = 500,000 LKR
  ├── Applicable Amount: 200,000 (capped at ceiling)
  ├── Employee Contribution: 200,000 × 8% = 16,000 LKR
  └── Employer Contribution: 200,000 × 12% = 24,000 LKR
                                      ↑
                          Limited by ceiling
```

### Ceiling Calculation Flow

```
EPF Calculation with Ceiling Logic:

┌─────────────────────────────────────────────┐
│ Input: Employee EPF-Applicable Earnings     │
└─────────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────┐
│ Check: Is ceiling configured?               │
└─────────────────────────────────────────────┘
         ├─ No  → Use full amount
         └─ Yes ↓
              ┌─────────────────────────────────────┐
              │ Is earnings > ceiling?              │
              └─────────────────────────────────────┘
                   ├─ No  → Use full amount
                   └─ Yes → Use ceiling amount
              ▼
┌─────────────────────────────────────────────┐
│ Calculate contributions on capped amount    │
└─────────────────────────────────────────────┘
```

### Use Cases for Ceiling

| Scenario | Ceiling Amount | Rationale |
|----------|----------------|-----------|
| No Ceiling (SL Standard) | null | Full EPF on all applicable earnings |
| High Earner Protection | 300,000 LKR | Cap contributions for executives |
| Budget Control | 250,000 LKR | Limit employer expense |
| Regulatory Compliance | Varies | If law imposes maximum |
| Trial Period | 100,000 LKR | Lower ceiling during probation |

### Ceiling Field Precision

#### Why DecimalField(12, 2)?
```
Max Digits: 12
Decimal Places: 2

Range: 000,000,000.00 to 999,999,999.99
Practical: Up to ~1 billion LKR monthly

Examples:
✅ 200,000.00 (200K ceiling)
✅ 500,000.00 (500K ceiling)
✅ 1,000,000.00 (1M ceiling)
❌ -100,000.00 (Negative invalid)
❌ 0.00 (Zero invalid)
```

### get_epf_applicable_amount() Method Logic

```
Method Signature:
def get_epf_applicable_amount(self, gross_amount):
    """
    Calculate EPF-applicable amount considering ceiling.
    
    Args:
        gross_amount (Decimal): Employee's gross EPF-applicable earnings
        
    Returns:
        Decimal: Amount to use for EPF calculation
    """

Logic:
1. If max_contribution_ceiling is None:
   └── Return gross_amount (no capping)

2. If gross_amount <= max_contribution_ceiling:
   └── Return gross_amount (below ceiling)

3. If gross_amount > max_contribution_ceiling:
   └── Return max_contribution_ceiling (capped)

Example Usage in Payroll:
epf_settings = tenant.epf_settings
applicable_amount = epf_settings.get_epf_applicable_amount(employee_epf_base)
employee_contribution = applicable_amount * (epf_settings.employee_rate / 100)
```

### Validation Rules

```
Ceiling Validation:
├── If provided, must be > 0
├── If provided, must be positive number
├── Can be null (no ceiling)
└── Typically in range 100,000 - 1,000,000 LKR

Valid Examples:
✅ null (No ceiling - standard)
✅ 200,000.00
✅ 500,000.00

Invalid Examples:
❌ 0.00 (Zero not allowed)
❌ -50,000.00 (Negative not allowed)
```

### Sri Lanka Context

```
Current Sri Lankan Practice:
├── No statutory ceiling on EPF contributions
├── EPF calculated on full EPF-applicable earnings
├── No maximum contribution limit
└── max_contribution_ceiling typically remains null

Special Cases:
├── Some private agreements may impose ceilings
├── Certain industries might have negotiated caps
└── Future legislation might introduce limits
```

### Expected Outcome
- Optional contribution ceiling configured
- Validation for positive ceiling values
- Helper method for ceiling application
- Support for both ceilinged and unlimited scenarios
- Sri Lankan standard (no ceiling) as default

### Verification Checklist
- [ ] max_contribution_ceiling field added
- [ ] Field is optional (blank=True, null=True)
- [ ] DecimalField with correct precision (12, 2)
- [ ] Help text added
- [ ] Verbose name set
- [ ] Validation in clean() method
- [ ] get_epf_applicable_amount() method created
- [ ] Method handles null ceiling
- [ ] Method applies ceiling when set
- [ ] Model docstring updated

---

## Task 52: Run EPFSettings Migrations

### Overview
Generate and apply Django migrations for the EPFSettings model. This task creates the database schema for storing EPF configuration data, making the model operational and ready to store tenant-specific EPF settings.

### Dependencies
- Task 49: Create EPFSettings Model
- Task 50: Add EPF Rate Fields
- Task 51: Add EPF Ceiling Field
- Database connection configured
- Django migrations system operational

### Instructions

1. **Verify model completeness**
   - Open `apps/payroll/models/epf_settings.py`
   - Ensure all fields from Tasks 49-51 are present
   - Verify imports are correct
   - Check that model is imported in `models/__init__.py`

2. **Check for syntax errors**
   - Run Django's check command
   - Execute: `python manage.py check payroll`
   - Resolve any errors before proceeding

3. **Generate migration file**
   - Execute: `python manage.py makemigrations payroll`
   - Django will detect the new EPFSettings model
   - Migration file created in `apps/payroll/migrations/`

4. **Review generated migration**
   - Open the new migration file (likely `0008_epf_settings.py`)
   - Verify all fields are included
   - Check field types and constraints
   - Ensure OneToOneField to tenant is correct

5. **Review migration dependencies**
   - Check dependencies list in migration file
   - Should depend on previous payroll migration
   - Should depend on tenant app if needed

6. **Apply migration to database**
   - Execute: `python manage.py migrate payroll`
   - Django creates epf_settings table
   - All constraints and indexes applied

7. **Verify migration success**
   - Check migration status: `python manage.py showmigrations payroll`
   - EPFSettings migration should be marked with [X]
   - No unapplied migrations should remain

8. **Verify database schema**
   - Connect to database
   - Verify table exists: `payroll_epfsettings`
   - Check all columns present
   - Verify constraints (OneToOne, defaults, etc.)

9. **Create initial EPF settings (optional)**
   - For existing tenants, may need to create default EPF settings
   - Can be done via Django admin, management command, or data migration
   - Use standard Sri Lankan rates (8%, 12%)

10. **Update documentation**
    - Note migration number in project documentation
    - Update database schema documentation
    - Record any special considerations

### Migration File Structure

```
apps/payroll/migrations/
├── __init__.py
├── 0001_initial.py
├── 0002_....py
├── ...
└── 0008_epf_settings.py          ← New EPF migration
```

### Expected Migration Content

```
Migration: 0008_epf_settings.py

Operations:
├── CreateModel: EPFSettings
│   ├── Fields:
│   │   ├── id (AutoField)
│   │   ├── tenant (OneToOneField → Client)
│   │   ├── employee_rate (DecimalField)
│   │   ├── employer_rate (DecimalField)
│   │   ├── max_contribution_ceiling (DecimalField, nullable)
│   │   ├── effective_from (DateField)
│   │   ├── is_active (BooleanField)
│   │   ├── created_at (DateTimeField)
│   │   └── updated_at (DateTimeField)
│   │
│   ├── Options:
│   │   ├── verbose_name: "EPF Settings"
│   │   ├── verbose_name_plural: "EPF Settings"
│   │   ├── ordering: ['-effective_from']
│   │   └── unique_together: [('tenant', 'effective_from')]
│   │
│   └── Indexes:
│       └── (tenant, is_active)
│
└── Dependencies:
    └── Previous payroll migration
```

### Database Table Schema

```
Table: payroll_epfsettings
┌─────────────────────────────────────────────────┐
│ Column                      │ Type             │
├─────────────────────────────┼──────────────────┤
│ id                          │ INTEGER PK       │
│ tenant_id                   │ INTEGER UNIQUE   │
│ employee_rate               │ DECIMAL(5,2)     │
│ employer_rate               │ DECIMAL(5,2)     │
│ max_contribution_ceiling    │ DECIMAL(12,2)    │
│ effective_from              │ DATE             │
│ is_active                   │ BOOLEAN          │
│ created_at                  │ TIMESTAMP        │
│ updated_at                  │ TIMESTAMP        │
└─────────────────────────────────────────────────┘

Constraints:
├── PRIMARY KEY (id)
├── UNIQUE (tenant_id)
├── FOREIGN KEY (tenant_id) REFERENCES tenants(id)
└── UNIQUE (tenant_id, effective_from)

Indexes:
├── idx_tenant_id (tenant_id)
└── idx_tenant_active (tenant_id, is_active)
```

### Pre-Migration Checklist

```
Before running migrations:
├── ✅ All model fields defined
├── ✅ Imports are correct
├── ✅ Model registered in __init__.py
├── ✅ No syntax errors (check command passes)
├── ✅ Database connection working
├── ✅ Backup database (if production)
└── ✅ Review migration file after generation
```

### Migration Commands

```bash
# Check for model issues
python manage.py check payroll

# Generate migration
python manage.py makemigrations payroll

# View migration SQL (optional - review)
python manage.py sqlmigrate payroll 0008

# Apply migration
python manage.py migrate payroll

# Verify migrations
python manage.py showmigrations payroll
```

### Post-Migration Verification

```
Verification Steps:
1. Check migration status
   └── python manage.py showmigrations payroll
   
2. Verify table exists
   └── Query database for payroll_epfsettings table
   
3. Test model in Django shell
   └── python manage.py shell
   └── from apps.payroll.models import EPFSettings
   └── EPFSettings.objects.count()  # Should be 0
   
4. Verify admin access (if admin configured)
   └── Navigate to Django admin
   └── Check EPFSettings is listed
   
5. Create test record
   └── Via admin or shell
   └── Verify all fields work
```

### Troubleshooting Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| Model not detected | Not imported in __init__ | Add import to models/__init__.py |
| Foreign key error | Tenant model not found | Check tenant app dependency |
| Migration conflict | Multiple migration heads | Merge migrations |
| Field error | Invalid field definition | Fix field parameters |
| Database error | DB connection issue | Check database settings |

### Expected Outcome
- EPFSettings migration generated
- Migration applied successfully
- Database table created
- All fields and constraints present
- Model ready for use in payroll calculations

### Verification Checklist
- [ ] Model passes check command
- [ ] Migration file generated
- [ ] Migration file reviewed
- [ ] Migration applied without errors
- [ ] Table exists in database
- [ ] All columns present
- [ ] Constraints applied correctly
- [ ] Model accessible in Django shell
- [ ] Admin interface works (if configured)
- [ ] Documentation updated

---

## Task 53: Create ETFSettings Model

### Overview
Create the ETFSettings model to store Employees' Trust Fund configuration for each tenant. ETF is a mandatory employee welfare scheme in Sri Lanka where the employer makes a 3% contribution (no employee contribution). This model maintains the ETF rate and effective dates for accurate payroll processing.

### Dependencies
- Payroll application exists
- Tenant/Client model exists
- Base model mixins available
- Django ORM configured
- Task 49-52 completed (EPFSettings as reference)

### Instructions

1. **Create etf_settings.py model file**
   - Navigate to `apps/payroll/models/` directory
   - Create new file named `etf_settings.py`
   - Will contain the ETFSettings model

2. **Import required modules**
   - Import Django model fields (CharField, DecimalField, DateField, BooleanField)
   - Import Django models base class
   - Import base model mixins (TenantAwareMixin, TimestampMixin)
   - Import tenant/client model
   - Import Decimal for default values

3. **Define ETFSettings model class**
   - Create class named ETFSettings
   - Inherit from Django Model
   - Add comprehensive model docstring explaining ETF purpose

4. **Add tenant relationship field**
   - OneToOneField to Client/Tenant model
   - Sets on_delete=CASCADE
   - Related_name='etf_settings'
   - One ETF settings record per tenant

5. **Add effective_from field**
   - DateField to track when this rate becomes effective
   - Required field (no blank/null)
   - Allows rate change tracking
   - Historical rate queries

6. **Add is_active field**
   - BooleanField with default=True
   - Controls whether settings are currently in use
   - Allows disabling without deletion

7. **Add Meta class**
   - Set verbose_name to "ETF Settings"
   - Set verbose_name_plural to "ETF Settings"
   - Add ordering by ['-effective_from']
   - Add unique_together on (tenant, effective_from)

8. **Add __str__ method**
   - Return format: "ETF Settings for {tenant_name}"
   - Include effective_from date
   - Format: "ETF Settings for Tenant A (Effective: 2024-01-01)"

9. **Add model docstring**
   - Explain ETF mandatory contribution scheme
   - Note that only employer contributes (3%)
   - No employee contribution for ETF
   - ETF applied on same base as EPF

10. **Update models/__init__.py**
    - Import ETFSettings from etf_settings
    - Add ETFSettings to __all__ list

### ETF Settings Model Structure

```
┌─────────────────────────────────────────────────┐
│            ETFSettings Model                    │
├─────────────────────────────────────────────────┤
│ Core Fields:                                    │
│  • tenant (OneToOneField)                       │
│  • effective_from (DateField)                   │
│  • is_active (BooleanField)                     │
│                                                 │
│ Rate Fields (Task 54):                          │
│  • employer_rate (DecimalField)                 │
│                                                 │
│ Inherited from TimestampMixin:                  │
│  • created_at (DateTimeField)                   │
│  • updated_at (DateTimeField)                   │
└─────────────────────────────────────────────────┘
```

### Model Relationships

```
┌──────────────┐         1:1          ┌────────────────────┐
│    Tenant    │◄─────────────────────│   ETFSettings      │
│   (Client)   │                      │                    │
└──────────────┘                      └────────────────────┘
       │                                       │
       │                                       │
       ├─────── EPFSettings                    │
       │                                       │
       └────── ETFSettings                     │
                                               │ Used by
                                               ▼
                                      ┌────────────────────┐
                                      │  Payroll Process   │
                                      │                    │
                                      └────────────────────┘
```

### ETF System Overview

#### What is ETF?
ETF (Employees' Trust Fund) is a mandatory employee welfare scheme in Sri Lanka established under the Employees' Trust Fund Act No. 46 of 1980. It provides benefits to employees upon retirement, death, or disability.

#### ETF Key Features
- **Mandatory Contribution:** Required for employees in establishments with 15+ employees
- **Employee Contribution:** None (0%)
- **Employer Contribution:** 3% of ETF-applicable earnings
- **Purpose:** Employee welfare fund for retirement or emergencies
- **Withdrawal:** At retirement, resignation (after 50 years age), or death
- **Tax Treatment:** Employer contribution is a business expense

#### ETF vs EPF Comparison

| Aspect | EPF | ETF |
|--------|-----|-----|
| Employee Contribution | 8% | 0% (None) |
| Employer Contribution | 12% | 3% |
| Total Contribution | 20% | 3% |
| Contribution Base | EPF-applicable earnings | Same as EPF |
| Benefit | Retirement savings | Welfare fund |
| Managed By | EPF Board | ETF Board |

#### ETF-Applicable Earnings

```
✅ Included in ETF Base (Same as EPF):
├── Basic Salary
├── Fixed Allowances
├── Overtime Payments
└── Shift Allowances

❌ Excluded from ETF Base:
├── Performance Bonuses (usually)
├── Festival Bonuses
├── Reimbursements
├── Gratuity
└── Commissions (in some cases)

Important: ETF base = EPF base
```

#### ETF Calculation Example
```
Employee Salary Breakdown:
├── Basic Salary: 50,000 LKR
├── Fixed Allowances: 20,000 LKR
├── Overtime: 5,000 LKR
└── Bonus: 10,000 LKR (excluded)
─────────────────────────────
ETF Base: 75,000 LKR (same as EPF base)

ETF Contribution:
├── Employee: 0 LKR (no contribution)
├── Employer: 75,000 × 3% = 2,250 LKR
└── Total ETF: 2,250 LKR
```

### Combined EPF/ETF Employer Cost

```
Example: Employee with 75,000 LKR EPF/ETF-applicable earnings

Employer Statutory Contributions:
├── EPF (12%): 75,000 × 12% = 9,000 LKR
├── ETF (3%):  75,000 × 3%  = 2,250 LKR
└──────────────────────────────────────
Total Employer Cost: 11,250 LKR (15% total)

Employer's total payroll cost:
├── Gross Salary: 75,000 LKR
├── EPF Contribution: 9,000 LKR
├── ETF Contribution: 2,250 LKR
└──────────────────────────────────────
Total Cost to Employer: 86,250 LKR
```

### Rate Change Scenarios

#### Historical Rate Tracking
```
Tenant ETF Settings History:
├── 2022-01-01: Employer 3% (Standard)
├── 2023-06-01: Employer 3% (No change)
└── 2024-01-01: Employer 3% (Current)

When calculating payroll:
→ Use settings with effective_from ≤ payroll_period_start
→ Most recent applicable settings
```

### Field Details

| Field | Type | Required | Default | Purpose |
|-------|------|----------|---------|---------|
| tenant | OneToOneField | Yes | - | Tenant association |
| effective_from | DateField | Yes | - | Rate effective date |
| is_active | BooleanField | Yes | True | Active status |

### ETF Legal Context

```
Legal Framework:
├── Act: Employees' Trust Fund Act No. 46 of 1980
├── Applicability: Private sector employees (15+ employee establishments)
├── Rate: 3% of qualifying earnings
└── Administrator: Employees' Trust Fund Board

Coverage:
✅ Private companies with 15+ employees
✅ Semi-government institutions
✅ Certain public corporations
❌ Government employees
❌ Establishments with < 15 employees (optional)
```

### ETF Benefits

```
Employee Benefits from ETF:
├── Retirement Benefit: Full amount + interest at 50 years
├── Partial Withdrawal: After 50 years (can continue working)
├── Death Benefit: Nominees receive full amount
├── Disability Benefit: Early withdrawal if disabled
└── Interest: Fund earns investment returns
```

### Expected Outcome
- Functional ETFSettings model created
- One settings record per tenant
- Support for rate change tracking
- Foundation for ETF contribution calculations
- Historical rate queries possible

### Verification Checklist
- [ ] etf_settings.py file created
- [ ] ETFSettings class defined
- [ ] tenant field added (OneToOneField)
- [ ] effective_from field added
- [ ] is_active field added
- [ ] Meta class configured
- [ ] __str__ method implemented
- [ ] Model docstring comprehensive
- [ ] ETF vs EPF differences documented
- [ ] Model imported in __init__.py

---

## Task 54: Add ETF Rate Field

### Overview
Add the employer contribution rate field to the ETFSettings model. This field stores the percentage rate (typically 3% in Sri Lanka) that the employer contributes to the ETF fund. Unlike EPF, ETF has no employee contribution, so only one rate field is needed.

### Dependencies
- Task 53: Create ETFSettings Model

### Instructions

1. **Open etf_settings.py model file**
   - Navigate to `apps/payroll/models/etf_settings.py`
   - Locate ETFSettings model class

2. **Import Decimal if not already imported**
   - From decimal import Decimal
   - Used for setting default rate value

3. **Add employer_rate field**
   - DecimalField with max_digits=5, decimal_places=2
   - Default value: Decimal('3.00') (3%)
   - Required field (no blank/null)
   - Represents employer contribution percentage

4. **Add field help text**
   - Help text: "Employer ETF contribution rate as percentage (e.g., 3.00 for 3%)"
   - Guides users on expected format

5. **Add field verbose name**
   - Verbose_name: "Employer Rate (%)"
   - User-friendly label for admin

6. **Add clean method validation**
   - Override clean() method
   - Validate that employer_rate >= 0 and <= 100
   - Typical range: 0-10% (3% is standard)
   - Raise ValidationError if rate is invalid

7. **Add calculation helper method**
   - Create method: calculate_employer_contribution(etf_base_amount)
   - Takes ETF-applicable earnings as parameter
   - Returns: etf_base_amount * (employer_rate / 100)
   - Used during payroll processing

8. **Update model docstring**
   - Document the standard Sri Lankan ETF rate (3%)
   - Note that employee does not contribute to ETF
   - Clarify employer contribution only

### ETF Rate Field Structure

```
┌────────────────────────────────────────────────┐
│            ETF Rate Field                      │
├────────────────────────────────────────────────┤
│ employer_rate                                  │
│  • Type: DecimalField(5, 2)                    │
│  • Default: 3.00                               │
│  • Range: 0.00 - 100.00                        │
│  • Purpose: Employer contribution %             │
│  • Employee Rate: N/A (no employee contribution)│
│                                                │
│ Helper Method:                                 │
│  • calculate_employer_contribution(base)       │
│    └── Returns: base × (rate / 100)            │
└────────────────────────────────────────────────┘
```

### Standard Sri Lankan ETF Rate

| Party | Rate | Legal Basis | Description |
|-------|------|-------------|-------------|
| Employer | 3% | ETF Act No. 46 of 1980 | Paid by employer |
| Employee | 0% | - | No employee contribution |
| **Total** | **3%** | - | Goes to employee's ETF account |

### ETF Rate Calculation Flow

```
Employee Monthly Salary Breakdown:
┌─────────────────────────────────────────────┐
│ Basic Salary: 50,000 LKR                    │
│ Fixed Allowances: 20,000 LKR                │
│ Overtime: 5,000 LKR                         │
├─────────────────────────────────────────────┤
│ ETF Base: 75,000 LKR                        │
└─────────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────┐
│ Apply ETF Rate:                             │
│                                             │
│ Employee Contribution: 0 LKR                │
│   (No employee contribution for ETF)        │
│                                             │
│ Employer Contribution:                      │
│   75,000 × 3% = 2,250 LKR                   │
│   (Company expense only)                    │
│                                             │
│ Total ETF: 2,250 LKR                        │
└─────────────────────────────────────────────┘
```

### Complete Statutory Contribution Example

```
Employee Details:
├── EPF/ETF Base: 75,000 LKR
└── Payroll Period: January 2024

Employee Deductions:
├── EPF (8%): 6,000 LKR
└── ETF: 0 LKR (no deduction)
─────────────────────────────
Total Employee Deduction: 6,000 LKR

Employer Costs:
├── EPF (12%): 9,000 LKR
└── ETF (3%): 2,250 LKR
─────────────────────────────
Total Employer Cost: 11,250 LKR (15% of base)

Net Salary Calculation:
Gross Salary: 75,000 LKR
- EPF Employee: 6,000 LKR
─────────────────────────────
Net Pay: 69,000 LKR

Total Employer Payroll Cost:
Gross Salary: 75,000 LKR
+ EPF Employer: 9,000 LKR
+ ETF Employer: 2,250 LKR
─────────────────────────────
Total Cost: 86,250 LKR
```

### Rate Configuration Examples

#### Standard Sri Lankan Rate (99% of cases)
```
ETFSettings:
  employer_rate: 3.00
  
Application: Statutory requirement for all covered employers
```

#### Zero Rate (Special Cases)
```
ETFSettings:
  employer_rate: 0.00
  
Application: 
- Establishments with < 15 employees (exempt)
- Special economic zones (if exempted)
- Temporary suspension (rare)
```

#### Voluntary Higher Rate (Very Rare)
```
ETFSettings:
  employer_rate: 5.00
  
Application: Employer voluntarily contributes more than statutory minimum
Note: Highly unusual in practice
```

### Rate Field Precision

#### Why DecimalField(5, 2)?
```
Max Digits: 5
Decimal Places: 2

Range: 000.00 to 999.99
Practical: 0.00 to 100.00

Examples:
✅ 3.00 (Valid - standard rate)
✅ 0.00 (Valid - exempt cases)
✅ 5.00 (Valid - voluntary higher)
❌ -1.00 (Invalid - negative)
❌ 150.00 (Invalid - exceeds 100%)
```

### Validation Rules

```
ETF Rate Validation Logic:
├── employer_rate must be >= 0
├── employer_rate must be <= 100
├── Typical range: 0-10%
├── Standard: 3.00%
└── Rate stored as percentage (not decimal)

Example Valid Rates:
✅ 3.00 (Standard)
✅ 0.00 (Exempt establishment)
✅ 5.00 (Voluntary higher)

Example Invalid Rates:
❌ -1.00 (Negative not allowed)
❌ 150.00 (Exceeds 100%)
❌ 3.456 (Too many decimal places)
```

### calculate_employer_contribution() Method

```
Method Signature:
def calculate_employer_contribution(self, etf_base_amount):
    """
    Calculate employer ETF contribution.
    
    Args:
        etf_base_amount (Decimal): Employee's ETF-applicable earnings
        
    Returns:
        Decimal: Employer contribution amount
    """
    return etf_base_amount * (self.employer_rate / Decimal('100'))

Example Usage:
etf_settings = tenant.etf_settings
contribution = etf_settings.calculate_employer_contribution(Decimal('75000'))
# Result: 2,250.00 (for 3% rate)
```

### Impact on Payroll Calculations

```
Payroll Calculation Sequence (ETF Component):
1. Calculate ETF-applicable earnings
   └── Use same base as EPF

2. Fetch ETFSettings for tenant
   └── Get employer_rate

3. Calculate employer contribution
   └── ETF_base × (employer_rate / 100)

4. Add to employer payroll costs
   └── Total_cost += Employer_ETF

5. No employee deduction for ETF
   └── Net_salary unchanged by ETF
```

### Payroll Journal Entries

```
Accounting Impact of ETF:

Journal Entry for 75,000 LKR ETF Base @ 3%:

Dr. Payroll Expense - ETF          2,250.00
    Cr. ETF Payable                        2,250.00

(To record employer ETF contribution)

When paid to ETF Board:
Dr. ETF Payable                    2,250.00
    Cr. Bank                                2,250.00
```

### Integration with EPF

```
Combined EPF/ETF Calculation:

┌─────────────────────────────────────────────┐
│ Step 1: Determine EPF/ETF-applicable base  │
│   → Basic + Fixed Allowances + Overtime     │
└─────────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────┐
│ Step 2: Calculate EPF (Employee)           │
│   → Base × EPF employee_rate (8%)          │
└─────────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────┐
│ Step 3: Calculate EPF (Employer)           │
│   → Base × EPF employer_rate (12%)         │
└─────────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────┐
│ Step 4: Calculate ETF (Employer)           │
│   → Base × ETF employer_rate (3%)          │
└─────────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────┐
│ Result: Complete statutory contributions   │
└─────────────────────────────────────────────┘
```

### Expected Outcome
- Employer ETF rate field configured
- Default 3% statutory rate
- Rate validation implemented
- Calculation helper method available
- No employee contribution field (not needed)

### Verification Checklist
- [ ] employer_rate field added
- [ ] Default value set to 3.00
- [ ] DecimalField with correct precision (5, 2)
- [ ] Help text added
- [ ] Verbose name set
- [ ] clean() method with validation
- [ ] calculate_employer_contribution() method created
- [ ] Method returns correct calculation
- [ ] Model docstring updated
- [ ] ETF vs EPF differences documented

---

## Task 55: Run ETFSettings Migrations

### Overview
Generate and apply Django migrations for the ETFSettings model. This task creates the database schema for storing ETF configuration data, making the model operational and ready to store tenant-specific ETF settings.

### Dependencies
- Task 53: Create ETFSettings Model
- Task 54: Add ETF Rate Field
- Database connection configured
- Django migrations system operational
- Previous migrations (including EPFSettings) applied

### Instructions

1. **Verify model completeness**
   - Open `apps/payroll/models/etf_settings.py`
   - Ensure all fields from Tasks 53-54 are present
   - Verify imports are correct
   - Check model is imported in `models/__init__.py`

2. **Check for syntax errors**
   - Run Django's check command
   - Execute: `python manage.py check payroll`
   - Resolve any errors before proceeding

3. **Generate migration file**
   - Execute: `python manage.py makemigrations payroll`
   - Django will detect the new ETFSettings model
   - Migration file created in `apps/payroll/migrations/`

4. **Review generated migration**
   - Open new migration file (likely `0009_etf_settings.py`)
   - Verify all fields included
   - Check field types and constraints
   - Ensure OneToOneField to tenant is correct

5. **Review migration dependencies**
   - Check dependencies list in migration file
   - Should depend on previous migration (0008_epf_settings)
   - Should depend on tenant app if needed

6. **Apply migration to database**
   - Execute: `python manage.py migrate payroll`
   - Django creates etf_settings table
   - All constraints and indexes applied

7. **Verify migration success**
   - Check migration status: `python manage.py showmigrations payroll`
   - ETFSettings migration should be marked with [X]
   - No unapplied migrations

8. **Verify database schema**
   - Connect to database
   - Verify table exists: `payroll_etfsettings`
   - Check all columns present
   - Verify constraints (OneToOne, defaults)

9. **Create initial ETF settings (optional)**
   - For existing tenants, create default ETF settings
   - Can use Django admin, management command, or data migration
   - Use standard Sri Lankan rate (3%)

10. **Update documentation**
    - Note migration number in documentation
    - Update database schema documentation
    - Record any special considerations

### Migration File Structure

```
apps/payroll/migrations/
├── __init__.py
├── 0001_initial.py
├── 0002_....py
├── ...
├── 0008_epf_settings.py          ← EPF migration
└── 0009_etf_settings.py          ← New ETF migration
```

### Expected Migration Content

```
Migration: 0009_etf_settings.py

Operations:
├── CreateModel: ETFSettings
│   ├── Fields:
│   │   ├── id (AutoField)
│   │   ├── tenant (OneToOneField → Client)
│   │   ├── employer_rate (DecimalField, default=3.00)
│   │   ├── effective_from (DateField)
│   │   ├── is_active (BooleanField, default=True)
│   │   ├── created_at (DateTimeField)
│   │   └── updated_at (DateTimeField)
│   │
│   ├── Options:
│   │   ├── verbose_name: "ETF Settings"
│   │   ├── verbose_name_plural: "ETF Settings"
│   │   ├── ordering: ['-effective_from']
│   │   └── unique_together: [('tenant', 'effective_from')]
│   │
│   └── Indexes:
│       └── (tenant, is_active)
│
└── Dependencies:
    ├── payroll.0008_epf_settings
    └── tenant app (if applicable)
```

### Database Table Schema

```
Table: payroll_etfsettings
┌─────────────────────────────────────────────────┐
│ Column                      │ Type             │
├─────────────────────────────┼──────────────────┤
│ id                          │ INTEGER PK       │
│ tenant_id                   │ INTEGER UNIQUE   │
│ employer_rate               │ DECIMAL(5,2)     │
│ effective_from              │ DATE             │
│ is_active                   │ BOOLEAN          │
│ created_at                  │ TIMESTAMP        │
│ updated_at                  │ TIMESTAMP        │
└─────────────────────────────────────────────────┘

Constraints:
├── PRIMARY KEY (id)
├── UNIQUE (tenant_id)
├── FOREIGN KEY (tenant_id) REFERENCES tenants(id)
└── UNIQUE (tenant_id, effective_from)

Indexes:
├── idx_tenant_id (tenant_id)
└── idx_tenant_active (tenant_id, is_active)

Defaults:
├── employer_rate: 3.00
└── is_active: TRUE
```

### Pre-Migration Checklist

```
Before running migrations:
├── ✅ All model fields defined
├── ✅ Imports are correct
├── ✅ Model registered in __init__.py
├── ✅ No syntax errors (check command passes)
├── ✅ Database connection working
├── ✅ Previous migrations applied (EPFSettings)
├── ✅ Backup database (if production)
└── ✅ Review migration file after generation
```

### Migration Commands

```bash
# Check for model issues
python manage.py check payroll

# Generate migration
python manage.py makemigrations payroll

# View migration SQL (optional)
python manage.py sqlmigrate payroll 0009

# Apply migration
python manage.py migrate payroll

# Verify migrations
python manage.py showmigrations payroll
```

### Post-Migration Verification

```
Verification Steps:
1. Check migration status
   └── python manage.py showmigrations payroll
   └── Should see [X] 0009_etf_settings
   
2. Verify table exists
   └── Query database for payroll_etfsettings table
   
3. Test model in Django shell
   └── python manage.py shell
   └── from apps.payroll.models import ETFSettings
   └── ETFSettings.objects.count()  # Should be 0
   
4. Verify admin access (if configured)
   └── Navigate to Django admin
   └── Check ETFSettings is listed
   
5. Create test record
   └── Via admin or shell
   └── Verify employer_rate defaults to 3.00
   └── Verify all fields work correctly
```

### EPF and ETF Together

```
After Both Migrations:

Database Tables:
├── payroll_epfsettings
│   ├── tenant (OneToOne)
│   ├── employee_rate (8%)
│   ├── employer_rate (12%)
│   ├── max_contribution_ceiling
│   └── effective_from
│
└── payroll_etfsettings
    ├── tenant (OneToOne)
    ├── employer_rate (3%)
    └── effective_from

Each tenant can have:
├── One EPFSettings record
└── One ETFSettings record
```

### Creating Initial Settings for Existing Tenants

```python
# Example data migration or management command

from apps.payroll.models import EPFSettings, ETFSettings
from apps.tenants.models import Client
from decimal import Decimal
from datetime import date

# For each existing tenant
for tenant in Client.objects.all():
    # Create EPF settings if not exists
    if not hasattr(tenant, 'epf_settings'):
        EPFSettings.objects.create(
            tenant=tenant,
            employee_rate=Decimal('8.00'),
            employer_rate=Decimal('12.00'),
            effective_from=date(2024, 1, 1),
            is_active=True
        )
    
    # Create ETF settings if not exists
    if not hasattr(tenant, 'etf_settings'):
        ETFSettings.objects.create(
            tenant=tenant,
            employer_rate=Decimal('3.00'),
            effective_from=date(2024, 1, 1),
            is_active=True
        )
```

### Troubleshooting Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| Model not detected | Not imported in __init__ | Add import to models/__init__.py |
| Foreign key error | Tenant model not found | Check tenant app dependency |
| Migration conflict | Multiple heads | Merge migrations |
| Default value error | Decimal import missing | Import Decimal in migration |
| Unique constraint | Duplicate records | Check for existing data |

### Expected Outcome
- ETFSettings migration generated
- Migration applied successfully
- Database table created
- All fields and constraints present
- Model ready for use in payroll
- Both EPF and ETF settings available per tenant

### Verification Checklist
- [ ] Model passes check command
- [ ] Migration file generated
- [ ] Migration file reviewed
- [ ] Migration applied without errors
- [ ] Table exists in database
- [ ] All columns present
- [ ] Constraints applied correctly
- [ ] Default values working (3.00 for employer_rate)
- [ ] Model accessible in Django shell
- [ ] Admin interface works (if configured)
- [ ] Can create settings for test tenant
- [ ] Documentation updated

---

## Summary

This document established EPF and ETF statutory settings for Sri Lankan payroll compliance:

### Completed Components

#### EPF (Employees' Provident Fund)
- ✅ EPFSettings model with tenant association
- ✅ Employee contribution rate field (default 8%)
- ✅ Employer contribution rate field (default 12%)
- ✅ Optional contribution ceiling field
- ✅ Effective date tracking
- ✅ Database migrations applied

#### ETF (Employees' Trust Fund)
- ✅ ETFSettings model with tenant association
- ✅ Employer contribution rate field (default 3%)
- ✅ No employee contribution (as per Sri Lankan law)
- ✅ Effective date tracking
- ✅ Database migrations applied

### Key Achievements

1. **Statutory Compliance** - Models align with Sri Lankan labor laws
2. **Flexible Configuration** - Per-tenant rate customization
3. **Rate Change Tracking** - Historical effective dates maintained
4. **Calculation Ready** - Helper methods for contribution calculation
5. **Database Ready** - Complete schema with constraints and indexes

### Statutory Contribution Summary

```
For 75,000 LKR EPF/ETF Base:

Employee Pays:
└── EPF: 6,000 LKR (8%)

Employer Pays:
├── EPF: 9,000 LKR (12%)
└── ETF: 2,250 LKR (3%)
─────────────────────────
Total Employer: 11,250 LKR (15%)
```

### Next Steps
Proceed to [02_Tasks-56-64_PAYE-TaxSlab-Exemption.md](02_Tasks-56-64_PAYE-TaxSlab-Exemption.md) to implement:
- PAYE tax slab model
- Tax exemption model
- Tax rate seeding
- Progressive tax calculation support

---

**Document Status:** ✅ Complete  
**Total Tasks:** 7 (Tasks 49-55)  
**Models Created:** EPFSettings, ETFSettings  
**Migrations:** 0008_epf_settings, 0009_etf_settings
