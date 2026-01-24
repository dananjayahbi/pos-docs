# Tasks 01-09: Django App, Choices, and Component Core

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 05 - Salary Structure  
> **Group:** A - Salary Component Models  
> **Document:** 01 of 02  
> **Tasks Covered:** 01, 02, 03, 04, 05, 06, 07, 08, 09

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-10-18_Flags-Index-Seed.md](02_Tasks-10-18_Flags-Index-Seed.md)

---

## Document Overview

This document covers the foundation of the payroll salary component system, including the Django app creation, choice field constants for component types and categories, and the core SalaryComponent model with its essential fields. These elements establish the base infrastructure for flexible salary structure management.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 01 | Create payroll Django App | Low | 15 min |
| 02 | Register payroll App | Low | 10 min |
| 03 | Define ComponentType Choices | Low | 10 min |
| 04 | Define CalculationType Choices | Low | 15 min |
| 05 | Define ComponentCategory Choices | Low | 15 min |
| 06 | Create SalaryComponent Model Core | Medium | 25 min |
| 07 | Add Component Category Field | Low | 15 min |
| 08 | Add Calculation Fields | Medium | 25 min |
| 09 | Add Taxable Flag | Low | 10 min |

---

## Task 01: Create Payroll Django App

### Overview
Create the `payroll` Django application to manage all salary and payroll functionality. This app will contain salary components, salary templates, employee salary assignments, payslip generation, and statutory compliance features for Sri Lankan payroll requirements.

### Dependencies
- Django project structure is established
- Multi-tenant architecture configured
- Core backend infrastructure exists

### Instructions

1. **Navigate to apps directory**
   - Open terminal in project root
   - Change to `apps/` directory
   - Ensure virtual environment is activated

2. **Create payroll application**
   - Use Django's startapp command
   - Create app named `payroll`
   - Generates standard Django app structure

3. **Verify app structure**
   - Confirm `apps/payroll/` directory exists
   - Check default files: __init__.py, apps.py, models.py, views.py, admin.py, tests.py
   - Verify migrations directory created

4. **Customize apps.py configuration**
   - Open `apps/payroll/apps.py`
   - Set proper app name: 'apps.payroll'
   - Add verbose_name: 'Payroll Management'
   - Add descriptive docstring

5. **Create models package structure**
   - Create `models/` directory inside `payroll/`
   - Move default models.py content to models/__init__.py if needed
   - Prepare for multiple model files

6. **Create constants module**
   - Create `constants.py` file in `payroll/` directory
   - Will contain choice field constants
   - Import Django TextChoices for type-safe choices

7. **Create management commands directory**
   - Create `management/` directory
   - Create `management/commands/` subdirectory
   - Add __init__.py files in both directories
   - Prepare for seed data commands

### Payroll App Structure

```
apps/payroll/
├── __init__.py                      # Package initialization
├── apps.py                          # App configuration (Task 01)
├── constants.py                     # Choice constants (Tasks 03-05)
├── models/
│   ├── __init__.py                 # Model imports
│   ├── salary_component.py         # SalaryComponent model (Tasks 06-15)
│   ├── salary_template.py          # (Future: Group B)
│   └── salary_grade.py             # (Future: Group B)
├── management/
│   ├── __init__.py
│   └── commands/
│       ├── __init__.py
│       └── seed_components.py      # Seed data (Tasks 17-18)
├── admin.py                        # Django admin
├── views.py                        # API views (Future)
├── serializers.py                  # DRF serializers (Future)
├── urls.py                         # URL patterns (Future)
├── tests.py                        # Unit tests (Future)
└── migrations/
    └── __init__.py
```

### Payroll App Purpose

The payroll application handles:

| Feature Category | Functionality |
|-----------------|---------------|
| **Salary Components** | Earnings, deductions, employer contributions |
| **Salary Structure** | Templates, grades, employee assignments |
| **Calculation Engine** | Fixed, percentage, formula-based calculations |
| **Statutory Compliance** | EPF, ETF, PAYE tax calculations |
| **Payslip Generation** | Monthly payslip creation and distribution |
| **Reports & Analytics** | Payroll summaries, statutory reports |

### Expected Outcome
- Functional payroll Django application
- Proper app configuration in apps.py
- Organized directory structure for models and commands
- Foundation for payroll management system

### Verification Checklist
- [ ] `apps/payroll/` directory exists
- [ ] `apps.py` configured with correct app name
- [ ] `constants.py` file created
- [ ] `models/` directory structure created
- [ ] `management/commands/` directories created
- [ ] All __init__.py files present
- [ ] App follows Django best practices

---

## Task 02: Register Payroll App

### Overview
Register the payroll application in Django settings as a tenant-specific app. This ensures the payroll models and functionality are available within each tenant's schema in the multi-tenant architecture.

### Dependencies
- Task 01: Create payroll Django App
- Django settings configured with TENANT_APPS
- Multi-tenancy setup completed

### Instructions

1. **Open Django settings file**
   - Navigate to project settings directory
   - Open the appropriate settings file (settings.py or settings/base.py)
   - Locate TENANT_APPS configuration

2. **Add payroll to TENANT_APPS**
   - Find TENANT_APPS list/tuple
   - Add 'apps.payroll' to the list
   - Place after core apps but before optional apps
   - Maintain alphabetical or logical ordering

3. **Verify app registration order**
   - Ensure 'apps.payroll' appears after required dependencies
   - Common order: authentication → core → HR → payroll
   - Check that tenant-shared apps are separate from TENANT_APPS

4. **Add app to INSTALLED_APPS (if needed)**
   - Some setups require dual registration
   - Check if INSTALLED_APPS needs update
   - Follow project's multi-tenant pattern

5. **Verify app is tenant-aware**
   - Confirm payroll is in TENANT_APPS, not SHARED_APPS
   - Payroll data must be isolated per tenant
   - Each tenant has independent salary structures

### TENANT_APPS Configuration Example

```python
# In settings.py or settings/base.py

TENANT_APPS = [
    # Django core apps (tenant-specific)
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    
    # Third-party apps (tenant-specific)
    'rest_framework',
    'django_filters',
    
    # Project apps (tenant-specific)
    'apps.authentication',
    'apps.core',
    'apps.hr',
    'apps.payroll',              # ← Add here (Task 02)
    'apps.pos',
    'apps.inventory',
    'apps.sales',
    'apps.accounting',
]

SHARED_APPS = [
    # These remain in public schema
    'django_tenants',
    'apps.tenants',
    # ...
]
```

### Multi-Tenant Payroll Architecture

```
┌─────────────────────────────────────────────────┐
│          Public Schema (SHARED_APPS)            │
│                                                 │
│  • Tenant Management                            │
│  • Domain Configuration                         │
│  • System Settings                              │
└─────────────────────────────────────────────────┘
                     │
         ┌───────────┴───────────┐
         ▼                       ▼
┌──────────────────┐    ┌──────────────────┐
│  Tenant A Schema │    │  Tenant B Schema │
│                  │    │                  │
│  Payroll App:    │    │  Payroll App:    │
│  • Components    │    │  • Components    │
│  • Templates     │    │  • Templates     │
│  • Payslips      │    │  • Payslips      │
└──────────────────┘    └──────────────────┘

Each tenant has isolated payroll data
```

### Why Payroll is Tenant-Specific

| Reason | Explanation |
|--------|-------------|
| **Data Isolation** | Each company has unique salary structures |
| **Compliance** | Different tax rules, EPF/ETF rates per company |
| **Security** | Salary data must not be shared across tenants |
| **Customization** | Each tenant configures own components |
| **Scalability** | Independent data growth per tenant |

### Expected Outcome
- Payroll app registered in TENANT_APPS
- App available in all tenant schemas
- Proper multi-tenant isolation
- Foundation for tenant-specific payroll data

### Verification Checklist
- [ ] TENANT_APPS updated with 'apps.payroll'
- [ ] App order is correct
- [ ] Settings file saved
- [ ] No syntax errors in settings
- [ ] App is NOT in SHARED_APPS
- [ ] Multi-tenant configuration preserved

---

## Task 03: Define ComponentType Choices

### Overview
Define ComponentType choice constants that categorize salary components into three main types: earnings that increase gross salary, deductions that reduce net salary, and employer contributions that represent company costs. These types are fundamental to payroll calculations and reporting.

### Dependencies
- Task 01: Create payroll Django App
- Task 02: Register payroll App

### Instructions

1. **Open constants.py file**
   - Navigate to `apps/payroll/constants.py`
   - Add module docstring explaining purpose

2. **Import Django TextChoices**
   - Import TextChoices from django.db.models
   - Provides type-safe, enumerated choices
   - Better than string tuples

3. **Create ComponentType class**
   - Define class inheriting from TextChoices
   - Add class docstring explaining component types
   - Include examples for each type

4. **Define EARNING choice**
   - Value: 'EARNING'
   - Label: 'Earning'
   - Represents income components added to gross salary
   - Examples: Basic salary, allowances, overtime, bonuses

5. **Define DEDUCTION choice**
   - Value: 'DEDUCTION'
   - Label: 'Deduction'
   - Represents amounts deducted from gross salary
   - Examples: EPF employee contribution, PAYE tax, loans

6. **Define EMPLOYER_CONTRIBUTION choice**
   - Value: 'EMPLOYER_CONTRIBUTION'
   - Label: 'Employer Contribution'
   - Represents employer costs not affecting employee net pay
   - Examples: EPF employer share, ETF, gratuity provisions

7. **Add usage documentation**
   - Comment explaining how each type affects calculations
   - Note which types appear on payslips
   - Clarify which types affect net vs. cost

### ComponentType Choice Structure

```python
class ComponentType(models.TextChoices):
    """
    Salary component type classification
    """
    EARNING = 'EARNING', 'Earning'
    DEDUCTION = 'DEDUCTION', 'Deduction'
    EMPLOYER_CONTRIBUTION = 'EMPLOYER_CONTRIBUTION', 'Employer Contribution'
```

### ComponentType Details

| Type | Value | Purpose | Affects | Payslip Visibility |
|------|-------|---------|---------|-------------------|
| EARNING | 'EARNING' | Income components | Gross ↑, Net ↑ | Employee visible |
| DEDUCTION | 'DEDUCTION' | Salary deductions | Net ↓ | Employee visible |
| EMPLOYER_CONTRIBUTION | 'EMPLOYER_CONTRIBUTION' | Company costs | Cost ↑ (not net) | Optional visibility |

### ComponentType in Payroll Calculations

```
Gross Salary Calculation:
════════════════════════
  Basic Salary (EARNING)           50,000.00
+ Transport Allowance (EARNING)     5,000.00
+ Overtime (EARNING)                3,000.00
+ Housing Allowance (EARNING)       8,000.00
─────────────────────────────────────────────
= Gross Salary                     66,000.00

Net Salary Calculation:
═══════════════════════
  Gross Salary                     66,000.00
- EPF Employee 8% (DEDUCTION)      -5,280.00
- PAYE Tax (DEDUCTION)             -8,500.00
- Loan Repayment (DEDUCTION)       -2,000.00
─────────────────────────────────────────────
= Net Salary                       50,220.00

Employer Cost Calculation:
══════════════════════════
  Gross Salary                     66,000.00
+ EPF Employer 12% (CONTRIB)       +7,920.00
+ ETF 3% (CONTRIB)                 +1,980.00
─────────────────────────────────────────────
= Total Employer Cost              75,900.00
```

### ComponentType Examples by Category

#### EARNING Examples
- **Basic Salary** - Core monthly salary
- **Transport Allowance** - Travel reimbursement
- **Medical Allowance** - Healthcare allowance
- **Housing Allowance** - Accommodation support
- **Meal Allowance** - Food allowance
- **Overtime Pay** - Additional hours compensation
- **Commission** - Sales commission
- **Performance Bonus** - Merit-based bonus
- **Annual Bonus** - 13th month salary

#### DEDUCTION Examples
- **EPF Employee 8%** - Employee Provident Fund contribution
- **PAYE Tax** - Pay As You Earn income tax
- **Loan Repayment** - Employee loan deduction
- **Advance Recovery** - Salary advance recovery
- **No-Pay Deduction** - Unpaid leave deduction
- **Welfare Fund** - Company welfare contribution
- **Union Dues** - Trade union fees

#### EMPLOYER_CONTRIBUTION Examples
- **EPF Employer 12%** - Employer Provident Fund share
- **ETF 3%** - Employees' Trust Fund contribution
- **Gratuity Provision** - Statutory gratuity accrual
- **Life Insurance Premium** - Employee life insurance
- **Medical Insurance** - Health insurance premium

### Sri Lankan Statutory Requirements

| Component | Type | Rate | Legal Basis |
|-----------|------|------|-------------|
| EPF Employee | DEDUCTION | 8% of basic | EPF Act |
| EPF Employer | EMPLOYER_CONTRIBUTION | 12% of basic | EPF Act |
| ETF | EMPLOYER_CONTRIBUTION | 3% of basic | ETF Act |
| PAYE Tax | DEDUCTION | Progressive rates | Inland Revenue Act |

### Payslip Display by Type

```
╔════════════════════════════════════════════════╗
║              EARNINGS (Type=EARNING)           ║
╠════════════════════════════════════════════════╣
║  Basic Salary                      50,000.00   ║
║  Transport Allowance                5,000.00   ║
║  Overtime                           3,000.00   ║
║  ────────────────────────────────────────────  ║
║  GROSS SALARY                      58,000.00   ║
╠════════════════════════════════════════════════╣
║            DEDUCTIONS (Type=DEDUCTION)         ║
╠════════════════════════════════════════════════╣
║  EPF Employee 8%                   -4,000.00   ║
║  PAYE Tax                          -6,500.00   ║
║  Loan Repayment                    -2,000.00   ║
║  ────────────────────────────────────────────  ║
║  TOTAL DEDUCTIONS                 -12,500.00   ║
╠════════════════════════════════════════════════╣
║  NET SALARY                        45,500.00   ║
╠════════════════════════════════════════════════╣
║  Employer Contributions (Type=CONTRIB)         ║
║  EPF Employer 12%                   6,000.00   ║
║  ETF 3%                             1,500.00   ║
╚════════════════════════════════════════════════╝
```

### Expected Outcome
- Type-safe ComponentType choices
- Clear categorization of salary components
- Foundation for payroll calculations
- Support for earnings, deductions, and contributions

### Verification Checklist
- [ ] ComponentType class created
- [ ] Inherits from TextChoices
- [ ] EARNING choice defined
- [ ] DEDUCTION choice defined
- [ ] EMPLOYER_CONTRIBUTION choice defined
- [ ] All choices have value and label
- [ ] Class docstring added
- [ ] Usage examples documented

---

## Task 04: Define CalculationType Choices

### Overview
Define CalculationType choice constants that specify how salary component amounts are calculated. Supports fixed amounts, percentage of basic salary, percentage of gross salary, and custom formula-based calculations for maximum flexibility.

### Dependencies
- Task 03: Define ComponentType Choices

### Instructions

1. **Open constants.py file**
   - Continue in `apps/payroll/constants.py`
   - Add CalculationType class below ComponentType

2. **Create CalculationType class**
   - Define class inheriting from TextChoices
   - Add class docstring explaining calculation methods
   - Include calculation examples

3. **Define FIXED choice**
   - Value: 'FIXED'
   - Label: 'Fixed Amount'
   - Represents constant amount per month
   - Example: Basic Salary = 50,000.00 (always)

4. **Define PERCENTAGE_OF_BASIC choice**
   - Value: 'PERCENTAGE_OF_BASIC'
   - Label: 'Percentage of Basic Salary'
   - Calculates as percentage of basic salary component
   - Example: EPF 8% of basic

5. **Define PERCENTAGE_OF_GROSS choice**
   - Value: 'PERCENTAGE_OF_GROSS'
   - Label: 'Percentage of Gross Salary'
   - Calculates as percentage of total gross salary
   - Example: Performance bonus 10% of gross

6. **Define FORMULA choice**
   - Value: 'FORMULA'
   - Label: 'Formula-based'
   - Uses custom formula expression for complex calculations
   - Example: Overtime = (basic/30/8) * hours * multiplier

7. **Add field mapping documentation**
   - Comment which model fields apply to each type
   - FIXED uses default_value field
   - Percentage types use percentage field
   - FORMULA uses formula field

### CalculationType Choice Structure

```python
class CalculationType(models.TextChoices):
    """
    Salary component calculation method
    """
    FIXED = 'FIXED', 'Fixed Amount'
    PERCENTAGE_OF_BASIC = 'PERCENTAGE_OF_BASIC', 'Percentage of Basic Salary'
    PERCENTAGE_OF_GROSS = 'PERCENTAGE_OF_GROSS', 'Percentage of Gross Salary'
    FORMULA = 'FORMULA', 'Formula-based'
```

### CalculationType Details

| Type | Value | Calculation Method | Uses Field | Example |
|------|-------|-------------------|------------|---------|
| FIXED | 'FIXED' | Constant amount | default_value | 50,000.00 |
| PERCENTAGE_OF_BASIC | 'PERCENTAGE_OF_BASIC' | % of basic salary | percentage | 8.00% → 4,000.00 |
| PERCENTAGE_OF_GROSS | 'PERCENTAGE_OF_GROSS' | % of gross salary | percentage | 10.00% → 6,000.00 |
| FORMULA | 'FORMULA' | Custom expression | formula | (basic/30/8)*hrs*1.5 |

### Calculation Examples

#### FIXED - Basic Salary
```python
Component: Basic Salary
Calculation Type: FIXED
Default Value: 50,000.00

Result: 50,000.00 (same every month)
```

#### PERCENTAGE_OF_BASIC - EPF Employee
```python
Component: EPF Employee Contribution
Calculation Type: PERCENTAGE_OF_BASIC
Percentage: 8.00

Basic Salary: 50,000.00
Calculation: 50,000.00 × 8% = 4,000.00
Result: 4,000.00
```

#### PERCENTAGE_OF_BASIC - EPF Employer
```python
Component: EPF Employer Contribution
Calculation Type: PERCENTAGE_OF_BASIC
Percentage: 12.00

Basic Salary: 50,000.00
Calculation: 50,000.00 × 12% = 6,000.00
Result: 6,000.00
```

#### PERCENTAGE_OF_BASIC - ETF
```python
Component: ETF Contribution
Calculation Type: PERCENTAGE_OF_BASIC
Percentage: 3.00

Basic Salary: 50,000.00
Calculation: 50,000.00 × 3% = 1,500.00
Result: 1,500.00
```

#### PERCENTAGE_OF_GROSS - Performance Bonus
```python
Component: Performance Bonus
Calculation Type: PERCENTAGE_OF_GROSS
Percentage: 10.00

Basic Salary: 50,000.00
Allowances: 13,000.00
Gross Salary: 63,000.00
Calculation: 63,000.00 × 10% = 6,300.00
Result: 6,300.00
```

#### FORMULA - Overtime Pay
```python
Component: Overtime Pay
Calculation Type: FORMULA
Formula: (basic / 30 / 8) * overtime_hours * 1.5

Basic Salary: 50,000.00
Overtime Hours: 10
Hourly Rate: 50,000 / 30 / 8 = 208.33
OT Rate: 208.33 × 1.5 = 312.50
Calculation: 312.50 × 10 hours = 3,125.00
Result: 3,125.00
```

#### FORMULA - PAYE Tax (Progressive)
```python
Component: PAYE Tax
Calculation Type: FORMULA
Formula: complex_tax_calculation(taxable_income)

Taxable Income: 55,000.00
Tax Slabs:
  0 - 100,000: Tax-free (monthly: 8,333)
  Remaining: Various rates
Result: 8,500.00 (calculated via formula)
```

### Field Usage by Calculation Type

```
┌─────────────────────────────────────────────────┐
│           CalculationType → Field Mapping       │
├─────────────────────────────────────────────────┤
│ FIXED:                                          │
│  ✓ default_value (required)                     │
│  ✗ percentage (ignored)                         │
│  ✗ formula (ignored)                            │
│                                                 │
│ PERCENTAGE_OF_BASIC:                            │
│  ✗ default_value (ignored)                      │
│  ✓ percentage (required)                        │
│  ✗ formula (ignored)                            │
│                                                 │
│ PERCENTAGE_OF_GROSS:                            │
│  ✗ default_value (ignored)                      │
│  ✓ percentage (required)                        │
│  ✗ formula (ignored)                            │
│                                                 │
│ FORMULA:                                        │
│  ✗ default_value (ignored)                      │
│  ✗ percentage (ignored)                         │
│  ✓ formula (required)                           │
└─────────────────────────────────────────────────┘
```

### Sri Lankan Payroll Calculation Patterns

| Component | Calculation Type | Rate/Amount | Calculation Base |
|-----------|-----------------|-------------|------------------|
| Basic Salary | FIXED | 50,000.00 | N/A |
| Transport Allowance | FIXED | 5,000.00 | N/A |
| EPF Employee 8% | PERCENTAGE_OF_BASIC | 8.00% | Basic |
| EPF Employer 12% | PERCENTAGE_OF_BASIC | 12.00% | Basic |
| ETF 3% | PERCENTAGE_OF_BASIC | 3.00% | Basic |
| Overtime | FORMULA | Custom | Basic + Hours |
| PAYE Tax | FORMULA | Progressive | Taxable Income |
| No-Pay Deduction | FORMULA | Proportional | Basic + Days absent |

### Formula Expression Examples

#### Overtime Calculation
```
Standard Time Rate:
(basic_salary / 30 / 8) = hourly_rate

Overtime Rate (1.5x):
hourly_rate * 1.5 * overtime_hours

Double Time Rate (2x):
hourly_rate * 2 * doubletime_hours
```

#### No-Pay Deduction
```
Daily Rate:
(basic_salary + fixed_allowances) / 30

No-Pay Amount:
daily_rate * no_pay_days
```

#### Attendance Bonus
```
Full Month Bonus:
attendance_days >= 26 ? 2000 : 0
```

### Expected Outcome
- Type-safe CalculationType choices
- Support for multiple calculation methods
- Flexible formula-based calculations
- Foundation for complex payroll logic

### Verification Checklist
- [ ] CalculationType class created
- [ ] Inherits from TextChoices
- [ ] FIXED choice defined
- [ ] PERCENTAGE_OF_BASIC choice defined
- [ ] PERCENTAGE_OF_GROSS choice defined
- [ ] FORMULA choice defined
- [ ] All choices have value and label
- [ ] Field mapping documented
- [ ] Calculation examples provided

---

## Task 05: Define ComponentCategory Choices

### Overview
Define ComponentCategory choice constants that provide fine-grained categorization of salary components within their types. Categories help organize components logically on payslips, enable filtering, and support reporting requirements.

### Dependencies
- Task 03: Define ComponentType Choices
- Task 04: Define CalculationType Choices

### Instructions

1. **Open constants.py file**
   - Continue in `apps/payroll/constants.py`
   - Add ComponentCategory class below CalculationType

2. **Create ComponentCategory class**
   - Define class inheriting from TextChoices
   - Add class docstring explaining component categories
   - Include examples for each category

3. **Define BASIC choice**
   - Value: 'BASIC'
   - Label: 'Basic Salary'
   - Core monthly salary component
   - Typically one component per employee

4. **Define ALLOWANCE choice**
   - Value: 'ALLOWANCE'
   - Label: 'Allowance'
   - Regular monthly allowances
   - Examples: Transport, medical, housing

5. **Define BONUS choice**
   - Value: 'BONUS'
   - Label: 'Bonus'
   - One-time or periodic bonuses
   - Examples: Performance bonus, annual bonus

6. **Define STATUTORY choice**
   - Value: 'STATUTORY'
   - Label: 'Statutory'
   - Government-mandated components
   - Examples: EPF, ETF, PAYE

7. **Define LOAN choice**
   - Value: 'LOAN'
   - Label: 'Loan'
   - Loan repayment deductions
   - Examples: Company loans, advance recoveries

8. **Define TAX choice**
   - Value: 'TAX'
   - Label: 'Tax'
   - Tax-related deductions
   - Examples: PAYE income tax

9. **Define OTHER choice**
   - Value: 'OTHER'
   - Label: 'Other'
   - Miscellaneous components
   - Catch-all for unusual items

10. **Add category-type mapping documentation**
    - Comment typical ComponentType for each category
    - Note display order conventions
    - Clarify reporting groupings

### ComponentCategory Choice Structure

```python
class ComponentCategory(models.TextChoices):
    """
    Salary component category classification
    """
    BASIC = 'BASIC', 'Basic Salary'
    ALLOWANCE = 'ALLOWANCE', 'Allowance'
    BONUS = 'BONUS', 'Bonus'
    STATUTORY = 'STATUTORY', 'Statutory'
    LOAN = 'LOAN', 'Loan'
    TAX = 'TAX', 'Tax'
    OTHER = 'OTHER', 'Other'
```

### ComponentCategory Details

| Category | Value | Typical Type | Examples | Frequency |
|----------|-------|-------------|----------|-----------|
| BASIC | 'BASIC' | EARNING | Basic Salary | Monthly |
| ALLOWANCE | 'ALLOWANCE' | EARNING | Transport, Medical, Housing | Monthly |
| BONUS | 'BONUS' | EARNING | Performance, Annual | Variable |
| STATUTORY | 'STATUTORY' | DEDUCTION / CONTRIB | EPF, ETF | Monthly |
| LOAN | 'LOAN' | DEDUCTION | Loan Repayment | Until paid |
| TAX | 'TAX' | DEDUCTION | PAYE Tax | Monthly |
| OTHER | 'OTHER' | Any | Miscellaneous | Variable |

### Category-Type Relationship Matrix

```
┌────────────┬──────────┬────────────┬──────────────────────┐
│  Category  │   Type   │ Common Use │      Examples        │
├────────────┼──────────┼────────────┼──────────────────────┤
│  BASIC     │ EARNING  │ Core pay   │ Basic Salary         │
├────────────┼──────────┼────────────┼──────────────────────┤
│ ALLOWANCE  │ EARNING  │ Benefits   │ Transport, Medical   │
├────────────┼──────────┼────────────┼──────────────────────┤
│  BONUS     │ EARNING  │ Incentives │ Performance Bonus    │
├────────────┼──────────┼────────────┼──────────────────────┤
│ STATUTORY  │ DEDUCTION│ EPF Emp    │ EPF Employee 8%      │
│            │ CONTRIB  │ EPF Emp    │ EPF Employer 12%     │
│            │ CONTRIB  │ ETF        │ ETF 3%               │
├────────────┼──────────┼────────────┼──────────────────────┤
│   LOAN     │ DEDUCTION│ Recoveries │ Loan Repayment       │
├────────────┼──────────┼────────────┼──────────────────────┤
│   TAX      │ DEDUCTION│ Income Tax │ PAYE Tax             │
├────────────┼──────────┼────────────┼──────────────────────┤
│  OTHER     │ Any      │ Special    │ Uniform Deduction    │
└────────────┴──────────┴────────────┴──────────────────────┘
```

### Payslip Organization by Category

```
╔════════════════════════════════════════════════╗
║                   EARNINGS                     ║
╠════════════════════════════════════════════════╣
║  BASIC (Category)                              ║
║  Basic Salary                      50,000.00   ║
║                                                ║
║  ALLOWANCE (Category)                          ║
║  Transport Allowance                5,000.00   ║
║  Medical Allowance                  3,000.00   ║
║  Housing Allowance                  8,000.00   ║
║                                                ║
║  BONUS (Category)                              ║
║  Performance Bonus                  5,000.00   ║
║  ────────────────────────────────────────────  ║
║  GROSS SALARY                      71,000.00   ║
╠════════════════════════════════════════════════╣
║                  DEDUCTIONS                    ║
╠════════════════════════════════════════════════╣
║  STATUTORY (Category)                          ║
║  EPF Employee 8%                   -4,000.00   ║
║                                                ║
║  TAX (Category)                                ║
║  PAYE Tax                          -9,000.00   ║
║                                                ║
║  LOAN (Category)                               ║
║  Loan Repayment                    -2,000.00   ║
║  ────────────────────────────────────────────  ║
║  TOTAL DEDUCTIONS                 -15,000.00   ║
╠════════════════════════════════════════════════╣
║  NET SALARY                        56,000.00   ║
╚════════════════════════════════════════════════╝
```

### Component Examples by Category

#### BASIC Category
- Basic Salary (primary income)

#### ALLOWANCE Category
- Transport Allowance
- Medical Allowance
- Housing Allowance
- Meal Allowance
- Telephone Allowance
- Shift Allowance
- Duty Allowance

#### BONUS Category
- Performance Bonus
- Annual Bonus (13th month)
- Festival Bonus (Vesak, Christmas, etc.)
- Attendance Bonus
- Production Incentive
- Sales Commission

#### STATUTORY Category (Deductions)
- EPF Employee Contribution 8%

#### STATUTORY Category (Employer Contributions)
- EPF Employer Contribution 12%
- ETF Contribution 3%

#### LOAN Category
- Company Loan Repayment
- Salary Advance Recovery
- Festival Advance Recovery
- Emergency Loan Repayment

#### TAX Category
- PAYE Income Tax

#### OTHER Category
- Uniform Deduction
- Canteen Charges
- Welfare Fund Contribution
- Professional Membership Fees
- Insurance Premium
- Damages Recovery
- No-Pay Deduction

### Display Order Convention by Category

| Category | Typical Display Order Range | Position |
|----------|---------------------------|----------|
| BASIC | 10-19 | First (highest priority) |
| ALLOWANCE | 20-39 | After basic |
| BONUS | 40-59 | After allowances |
| STATUTORY (earnings side) | N/A | N/A |
| STATUTORY (deduction side) | 100-119 | First deductions |
| TAX | 120-129 | After statutory |
| LOAN | 130-149 | After tax |
| OTHER | 150+ | Last |

### Sri Lankan Statutory Categories

```
Statutory Components (STATUTORY Category):
══════════════════════════════════════════

Employee Side (DEDUCTION):
• EPF Employee 8%
  - Mandatory for all employees
  - 8% of basic salary
  - Deducted monthly

Employer Side (EMPLOYER_CONTRIBUTION):
• EPF Employer 12%
  - Mandatory employer contribution
  - 12% of basic salary
  - Not deducted from employee

• ETF 3%
  - Employees' Trust Fund
  - 3% of basic salary
  - Employer cost only
```

### Reporting by Category

| Report Type | Categories Used | Purpose |
|------------|----------------|---------|
| Earnings Report | BASIC, ALLOWANCE, BONUS | Income analysis |
| Deductions Summary | STATUTORY, TAX, LOAN, OTHER | Deduction tracking |
| Statutory Compliance | STATUTORY | EPF/ETF reporting |
| Tax Report | TAX | PAYE filing |
| Loan Schedule | LOAN | Loan monitoring |

### Expected Outcome
- Type-safe ComponentCategory choices
- Logical grouping of components
- Support for organized payslip display
- Foundation for category-based reporting

### Verification Checklist
- [ ] ComponentCategory class created
- [ ] Inherits from TextChoices
- [ ] BASIC choice defined
- [ ] ALLOWANCE choice defined
- [ ] BONUS choice defined
- [ ] STATUTORY choice defined
- [ ] LOAN choice defined
- [ ] TAX choice defined
- [ ] OTHER choice defined
- [ ] All choices have value and label
- [ ] Category-type relationships documented
- [ ] Display order conventions noted

---

## Task 06: Create SalaryComponent Model Core

### Overview
Create the core SalaryComponent model with essential identification fields. This model serves as the foundation for all salary components used in the payroll system, including earnings, deductions, and employer contributions. The model is tenant-aware and includes auditing capabilities.

### Dependencies
- Task 01: Create payroll Django App
- Task 02: Register payroll App
- Task 03: Define ComponentType Choices
- Base model mixins (TenantAwareMixin, TimestampMixin) exist
- Django ORM configured

### Instructions

1. **Create salary_component.py model file**
   - Create file at `apps/payroll/models/salary_component.py`
   - Add comprehensive module docstring

2. **Import required modules**
   - Import Django model and field classes
   - Import Decimal class for financial precision
   - Import base model mixins (TenantAwareMixin, TimestampMixin)
   - Import constants from payroll.constants
   - Import User model for relationships

3. **Define SalaryComponent model class**
   - Inherit from TenantAwareMixin and TimestampMixin
   - Add model docstring explaining purpose and usage
   - List key fields and relationships

4. **Add name field**
   - CharField with max_length=200
   - Required field (no blank/null)
   - Human-readable component name
   - Examples: "Basic Salary", "Transport Allowance", "EPF Employee 8%"

5. **Add code field**
   - CharField with max_length=50
   - Required field
   - Unique code per tenant (unique_together constraint)
   - Uppercase, no spaces
   - Used in formulas and references
   - Examples: "BASIC", "TRANSPORT", "EPF_EMP"

6. **Add component_type field**
   - CharField with choices from ComponentType
   - Required field
   - Values: EARNING, DEDUCTION, EMPLOYER_CONTRIBUTION
   - Determines how component affects calculations

7. **Add Meta class**
   - Set verbose_name: "Salary Component"
   - Set verbose_name_plural: "Salary Components"
   - Add ordering: ['name']
   - Add unique_together: [['tenant', 'code']]
   - Add db_table: 'payroll_salary_components'

8. **Add __str__ method**
   - Return component name
   - Include code in parentheses
   - Format: "Basic Salary (BASIC)"

9. **Update models/__init__.py**
   - Import SalaryComponent
   - Add to __all__ list for easy imports

### SalaryComponent Model Core Structure

```
┌─────────────────────────────────────────────────┐
│        SalaryComponent Model (Core)             │
├─────────────────────────────────────────────────┤
│ Core Identification Fields:                    │
│  • name (CharField, 200)                        │
│  • code (CharField, 50, unique per tenant)      │
│  • component_type (Choice: ComponentType)       │
│                                                 │
│ Inherited from TenantAwareMixin:                │
│  • tenant (ForeignKey to Tenant)                │
│                                                 │
│ Inherited from TimestampMixin:                  │
│  • created_at (DateTimeField, auto_now_add)     │
│  • updated_at (DateTimeField, auto_now)         │
│  • created_by (ForeignKey to User, nullable)    │
│  • updated_by (ForeignKey to User, nullable)    │
└─────────────────────────────────────────────────┘
```

### Model Relationships

```
┌──────────────┐         1:N          ┌────────────────────┐
│    Tenant    │◄─────────────────────│ SalaryComponent    │
└──────────────┘                      └────────────────────┘
                                               │
                                               │ N:1
                                               ▼
                                      ┌────────────────────┐
                                      │  ComponentType     │
                                      │  (Choice Field)    │
                                      └────────────────────┘
```

### Core Field Details

| Field | Type | Required | Unique | Max Length | Purpose |
|-------|------|----------|--------|-----------|---------|
| name | CharField | Yes | No | 200 | Display name |
| code | CharField | Yes | Per tenant | 50 | Unique identifier |
| component_type | CharField | Yes | No | - | Type classification |
| tenant | ForeignKey | Yes | - | - | Multi-tenancy |

### Component Code Naming Convention

```
Code Format Guidelines:
═══════════════════════
• Uppercase only: BASIC, not Basic or basic
• No spaces: TRANSPORT, not TRANSPORT ALLOWANCE
• Use underscores: EPF_EMP, not EPF-EMP or EPFEMP
• Descriptive: HOUSING not H or HSG
• Consistent: EPF_EMP, EPF_EMP_CONTRIB (same prefix)

Good Examples:
• BASIC
• TRANSPORT
• MEDICAL
• HOUSING
• EPF_EMP
• EPF_EMP_CONTRIB
• ETF
• PAYE
• LOAN_REPAY
• OVERTIME
• BONUS_ANNUAL

Bad Examples:
• Basic (not uppercase)
• Transport Allowance (has space)
• EPF-EMP (uses hyphen)
• T (too short, unclear)
• EmployeeProvidentFund (too long)
```

### Component Name Examples by Type

#### EARNING Components
| Name | Code | Description |
|------|------|-------------|
| Basic Salary | BASIC | Core monthly salary |
| Transport Allowance | TRANSPORT | Travel reimbursement |
| Medical Allowance | MEDICAL | Healthcare allowance |
| Housing Allowance | HOUSING | Accommodation support |
| Meal Allowance | MEAL | Food allowance |
| Overtime Pay | OVERTIME | Extra hours compensation |
| Performance Bonus | BONUS_PERF | Merit-based bonus |
| Annual Bonus | BONUS_ANNUAL | 13th month salary |

#### DEDUCTION Components
| Name | Code | Description |
|------|------|-------------|
| EPF Employee 8% | EPF_EMP | Employee provident fund |
| PAYE Tax | PAYE | Income tax |
| Loan Repayment | LOAN_REPAY | Company loan deduction |
| Advance Recovery | ADVANCE_REC | Salary advance recovery |
| No-Pay Deduction | NO_PAY | Unpaid leave deduction |
| Welfare Fund | WELFARE | Welfare contribution |

#### EMPLOYER_CONTRIBUTION Components
| Name | Code | Description |
|------|------|-------------|
| EPF Employer 12% | EPF_EMP_CONTRIB | Employer EPF share |
| ETF 3% | ETF | Employees' Trust Fund |
| Gratuity Provision | GRATUITY | Statutory gratuity |
| Life Insurance | INSURANCE_LIFE | Employee life insurance |

### Component Uniqueness

```
Per-Tenant Uniqueness:
══════════════════════

Tenant A:
  ├── BASIC (Basic Salary)
  ├── TRANSPORT (Transport Allowance)
  └── EPF_EMP (EPF Employee 8%)

Tenant B:
  ├── BASIC (Basic Salary)          ← Same code, different tenant (OK)
  ├── TRANSPORT (Transport Allowance)
  └── EPF_EMP (EPF Employee 8%)

Tenant A cannot have:
  ├── BASIC (Basic Salary)
  └── BASIC (Base Pay)              ← Duplicate code (ERROR)
```

### Component Type Distribution Example

```
Typical Component Set:
══════════════════════

EARNING (8 components):
  • Basic Salary
  • Transport Allowance
  • Medical Allowance
  • Housing Allowance
  • Meal Allowance
  • Overtime Pay
  • Performance Bonus
  • Annual Bonus

DEDUCTION (5 components):
  • EPF Employee 8%
  • PAYE Tax
  • Loan Repayment
  • Advance Recovery
  • No-Pay Deduction

EMPLOYER_CONTRIBUTION (3 components):
  • EPF Employer 12%
  • ETF 3%
  • Gratuity Provision

Total: 16 components
```

### Database Schema

```sql
CREATE TABLE payroll_salary_components (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL REFERENCES tenants_tenant(id),
    name VARCHAR(200) NOT NULL,
    code VARCHAR(50) NOT NULL,
    component_type VARCHAR(30) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_by_id BIGINT REFERENCES auth_user(id),
    updated_by_id BIGINT REFERENCES auth_user(id),
    UNIQUE (tenant_id, code)
);

CREATE INDEX idx_component_tenant_type 
ON payroll_salary_components(tenant_id, component_type);
```

### Expected Outcome
- Functional SalaryComponent model core
- Tenant-aware component storage
- Unique component codes per tenant
- Foundation for payroll calculations

### Verification Checklist
- [ ] salary_component.py file created
- [ ] SalaryComponent class defined
- [ ] Inherits from TenantAwareMixin and TimestampMixin
- [ ] name field added (CharField, 200)
- [ ] code field added (CharField, 50)
- [ ] component_type field added (Choice)
- [ ] Meta class configured properly
- [ ] unique_together constraint added
- [ ] __str__ method implemented
- [ ] Model imported in __init__.py

---

## Task 07: Add Component Category Field

### Overview
Add the category field to the SalaryComponent model to enable fine-grained categorization of components. This field allows components to be grouped logically (e.g., BASIC, ALLOWANCE, STATUTORY) for display, filtering, and reporting purposes.

### Dependencies
- Task 05: Define ComponentCategory Choices
- Task 06: Create SalaryComponent Model Core

### Instructions

1. **Open salary_component.py model file**
   - Navigate to `apps/payroll/models/salary_component.py`
   - Locate SalaryComponent model class

2. **Add category field**
   - CharField with max_length=20
   - Choices from ComponentCategory
   - Required field (no blank/null)
   - Default to ComponentCategory.OTHER
   - Place after component_type field

3. **Import ComponentCategory**
   - Verify ComponentCategory is imported from constants
   - Ensure import statement is present

4. **Update model docstring**
   - Add category to field list
   - Explain category purpose
   - Provide examples of category usage

5. **Update Meta indexes**
   - Add index on (tenant, category) for filtering
   - Improves query performance for category-based reports

### Category Field Specification

```python
category = models.CharField(
    max_length=20,
    choices=ComponentCategory.choices,
    default=ComponentCategory.OTHER,
    help_text="Component category for grouping and display"
)
```

### Field Details

| Property | Value | Purpose |
|----------|-------|---------|
| Type | CharField | Text field with choices |
| Max Length | 20 | Sufficient for category values |
| Choices | ComponentCategory.choices | Type-safe enumeration |
| Default | ComponentCategory.OTHER | Fallback category |
| Required | Yes | No null/blank allowed |
| Indexed | Yes | Query optimization |

### Category Usage Examples

#### BASIC Category
```python
SalaryComponent:
  name = "Basic Salary"
  code = "BASIC"
  component_type = ComponentType.EARNING
  category = ComponentCategory.BASIC  # ← Identifies as basic salary
```

#### ALLOWANCE Category
```python
SalaryComponent:
  name = "Transport Allowance"
  code = "TRANSPORT"
  component_type = ComponentType.EARNING
  category = ComponentCategory.ALLOWANCE  # ← Grouped with allowances
```

#### STATUTORY Category
```python
SalaryComponent:
  name = "EPF Employee 8%"
  code = "EPF_EMP"
  component_type = ComponentType.DEDUCTION
  category = ComponentCategory.STATUTORY  # ← Statutory deduction

SalaryComponent:
  name = "EPF Employer 12%"
  code = "EPF_EMP_CONTRIB"
  component_type = ComponentType.EMPLOYER_CONTRIBUTION
  category = ComponentCategory.STATUTORY  # ← Statutory contribution
```

### Category-Type Relationships

```
Typical Pairings:
═════════════════

ComponentType.EARNING + Categories:
  ✓ BASIC
  ✓ ALLOWANCE
  ✓ BONUS
  ✓ OTHER

ComponentType.DEDUCTION + Categories:
  ✓ STATUTORY (EPF employee)
  ✓ TAX (PAYE)
  ✓ LOAN (loan repayments)
  ✓ OTHER

ComponentType.EMPLOYER_CONTRIBUTION + Categories:
  ✓ STATUTORY (EPF employer, ETF)
  ✓ OTHER
```

### Complete Component Examples

```python
# Example 1: Basic Salary
{
    'name': 'Basic Salary',
    'code': 'BASIC',
    'component_type': 'EARNING',
    'category': 'BASIC'
}

# Example 2: Transport Allowance
{
    'name': 'Transport Allowance',
    'code': 'TRANSPORT',
    'component_type': 'EARNING',
    'category': 'ALLOWANCE'
}

# Example 3: EPF Employee
{
    'name': 'EPF Employee 8%',
    'code': 'EPF_EMP',
    'component_type': 'DEDUCTION',
    'category': 'STATUTORY'
}

# Example 4: Performance Bonus
{
    'name': 'Performance Bonus',
    'code': 'BONUS_PERF',
    'component_type': 'EARNING',
    'category': 'BONUS'
}
```

### Filtering by Category

```python
# Get all allowances
allowances = SalaryComponent.objects.filter(
    tenant=tenant,
    category=ComponentCategory.ALLOWANCE
)

# Get all statutory components
statutory = SalaryComponent.objects.filter(
    tenant=tenant,
    category=ComponentCategory.STATUTORY
)

# Get earnings by category
basic = SalaryComponent.objects.filter(
    tenant=tenant,
    component_type=ComponentType.EARNING,
    category=ComponentCategory.BASIC
)
```

### Payslip Grouping by Category

```
Earnings Section:
═════════════════
  [BASIC Category]
    Basic Salary                    50,000.00
  
  [ALLOWANCE Category]
    Transport Allowance              5,000.00
    Medical Allowance                3,000.00
    Housing Allowance                8,000.00
  
  [BONUS Category]
    Performance Bonus                5,000.00

Deductions Section:
═══════════════════
  [STATUTORY Category]
    EPF Employee 8%                 -4,000.00
  
  [TAX Category]
    PAYE Tax                        -8,500.00
  
  [LOAN Category]
    Loan Repayment                  -2,000.00
```

### Reporting by Category

```python
# Earnings breakdown by category
earnings_report = SalaryComponent.objects.filter(
    tenant=tenant,
    component_type=ComponentType.EARNING
).values('category').annotate(
    count=Count('id')
)

Result:
[
    {'category': 'BASIC', 'count': 1},
    {'category': 'ALLOWANCE', 'count': 4},
    {'category': 'BONUS', 'count': 2},
]
```

### Database Index Benefits

```sql
-- Index on (tenant_id, category) enables fast queries:

-- Get all allowances for a tenant (uses index)
SELECT * FROM payroll_salary_components
WHERE tenant_id = 1 AND category = 'ALLOWANCE';

-- Count components by category (uses index)
SELECT category, COUNT(*) 
FROM payroll_salary_components
WHERE tenant_id = 1
GROUP BY category;
```

### Expected Outcome
- Category field added to SalaryComponent model
- Components can be grouped logically
- Improved filtering and reporting capabilities
- Optimized queries with category index

### Verification Checklist
- [ ] category field added to model
- [ ] Field uses ComponentCategory choices
- [ ] Default value set to OTHER
- [ ] Help text provided
- [ ] ComponentCategory imported
- [ ] Index on (tenant, category) added to Meta
- [ ] Model docstring updated
- [ ] Field is required (no blank/null)

---

## Task 08: Add Calculation Fields

### Overview
Add calculation-related fields to the SalaryComponent model to support multiple calculation methods. These fields enable fixed amounts, percentage-based calculations, and custom formulas, providing maximum flexibility for diverse payroll scenarios.

### Dependencies
- Task 04: Define CalculationType Choices
- Task 06: Create SalaryComponent Model Core
- Task 07: Add Component Category Field

### Instructions

1. **Open salary_component.py model file**
   - Continue in `apps/payroll/models/salary_component.py`
   - Locate SalaryComponent model class

2. **Add calculation_type field**
   - CharField with max_length=30
   - Choices from CalculationType
   - Default to CalculationType.FIXED
   - Required field
   - Determines which calculation method to use

3. **Add default_value field**
   - DecimalField with max_digits=15, decimal_places=2
   - Optional (blank=True, null=True)
   - Default to Decimal('0.00')
   - Used when calculation_type is FIXED
   - Stores fixed monetary amounts

4. **Add percentage field**
   - DecimalField with max_digits=5, decimal_places=2
   - Optional (blank=True, null=True)
   - Default to Decimal('0.00')
   - Used for percentage-based calculations
   - Range: 0.00 to 100.00
   - Example: 8.00 for 8%

5. **Add formula field**
   - TextField
   - Optional (blank=True, null=True)
   - Stores custom calculation formula
   - Used when calculation_type is FORMULA
   - Supports variables and expressions

6. **Import Decimal class**
   - Add: from decimal import Decimal
   - Required for default_value and percentage defaults

7. **Update model docstring**
   - Document calculation fields
   - Explain field usage per calculation type
   - Provide formula examples

8. **Add validation notes**
   - Comment on field usage rules
   - Note which fields are required for each calculation type
   - Document formula syntax (for future validation)

### Calculation Fields Structure

```
┌─────────────────────────────────────────────────┐
│         Calculation Fields                      │
├─────────────────────────────────────────────────┤
│ calculation_type (CharField, choices)           │
│  → Determines calculation method                │
│                                                 │
│ default_value (DecimalField, 15,2)              │
│  → Used for: FIXED                              │
│  → Example: 50000.00                            │
│                                                 │
│ percentage (DecimalField, 5,2)                  │
│  → Used for: PERCENTAGE_OF_BASIC                │
│  →           PERCENTAGE_OF_GROSS                │
│  → Example: 8.00 (means 8%)                     │
│                                                 │
│ formula (TextField)                             │
│  → Used for: FORMULA                            │
│  → Example: (basic/30/8)*hours*1.5              │
└─────────────────────────────────────────────────┘
```

### Field Specifications

| Field | Type | Max Digits | Decimal Places | Nullable | Default | Purpose |
|-------|------|-----------|---------------|----------|---------|---------|
| calculation_type | CharField(30) | - | - | No | FIXED | Method selector |
| default_value | DecimalField | 15 | 2 | Yes | 0.00 | Fixed amounts |
| percentage | DecimalField | 5 | 2 | Yes | 0.00 | Percentage values |
| formula | TextField | - | - | Yes | null | Custom formulas |

### Field Usage by Calculation Type

```
┌──────────────────────────────────────────────────┐
│  CalculationType → Field Usage Matrix            │
├──────────────────────────────────────────────────┤
│                                                  │
│  FIXED:                                          │
│    ✓ default_value (REQUIRED)                    │
│    ✗ percentage (IGNORED)                        │
│    ✗ formula (IGNORED)                           │
│                                                  │
│  PERCENTAGE_OF_BASIC:                            │
│    ✗ default_value (IGNORED)                     │
│    ✓ percentage (REQUIRED)                       │
│    ✗ formula (IGNORED)                           │
│                                                  │
│  PERCENTAGE_OF_GROSS:                            │
│    ✗ default_value (IGNORED)                     │
│    ✓ percentage (REQUIRED)                       │
│    ✗ formula (IGNORED)                           │
│                                                  │
│  FORMULA:                                        │
│    ✗ default_value (IGNORED)                     │
│    ✗ percentage (IGNORED)                        │
│    ✓ formula (REQUIRED)                          │
│                                                  │
└──────────────────────────────────────────────────┘
```

### Complete Component Examples with Calculation Fields

#### Example 1: FIXED - Basic Salary
```python
{
    'name': 'Basic Salary',
    'code': 'BASIC',
    'component_type': 'EARNING',
    'category': 'BASIC',
    'calculation_type': 'FIXED',
    'default_value': Decimal('50000.00'),  # ← Uses this
    'percentage': None,                     # ← Ignored
    'formula': None                         # ← Ignored
}
```

#### Example 2: PERCENTAGE_OF_BASIC - EPF Employee
```python
{
    'name': 'EPF Employee 8%',
    'code': 'EPF_EMP',
    'component_type': 'DEDUCTION',
    'category': 'STATUTORY',
    'calculation_type': 'PERCENTAGE_OF_BASIC',
    'default_value': None,                  # ← Ignored
    'percentage': Decimal('8.00'),          # ← Uses this (8%)
    'formula': None                         # ← Ignored
}
```

#### Example 3: PERCENTAGE_OF_BASIC - EPF Employer
```python
{
    'name': 'EPF Employer 12%',
    'code': 'EPF_EMP_CONTRIB',
    'component_type': 'EMPLOYER_CONTRIBUTION',
    'category': 'STATUTORY',
    'calculation_type': 'PERCENTAGE_OF_BASIC',
    'default_value': None,
    'percentage': Decimal('12.00'),         # ← Uses this (12%)
    'formula': None
}
```

#### Example 4: PERCENTAGE_OF_GROSS - Performance Bonus
```python
{
    'name': 'Performance Bonus',
    'code': 'BONUS_PERF',
    'component_type': 'EARNING',
    'category': 'BONUS',
    'calculation_type': 'PERCENTAGE_OF_GROSS',
    'default_value': None,
    'percentage': Decimal('10.00'),         # ← Uses this (10% of gross)
    'formula': None
}
```

#### Example 5: FORMULA - Overtime Pay
```python
{
    'name': 'Overtime Pay',
    'code': 'OVERTIME',
    'component_type': 'EARNING',
    'category': 'OTHER',
    'calculation_type': 'FORMULA',
    'default_value': None,
    'percentage': None,
    'formula': '(basic / 30 / 8) * overtime_hours * 1.5'  # ← Uses this
}
```

### Calculation Examples

#### FIXED Calculation
```python
Component: Transport Allowance
calculation_type = FIXED
default_value = 5000.00

Result = 5000.00 (every month, no calculation)
```

#### PERCENTAGE_OF_BASIC Calculation
```python
Component: EPF Employee 8%
calculation_type = PERCENTAGE_OF_BASIC
percentage = 8.00

Given: basic_salary = 50000.00
Calculation: 50000.00 × (8.00 / 100) = 4000.00
Result = 4000.00
```

#### PERCENTAGE_OF_GROSS Calculation
```python
Component: Performance Bonus 10%
calculation_type = PERCENTAGE_OF_GROSS
percentage = 10.00

Given: gross_salary = 66000.00
Calculation: 66000.00 × (10.00 / 100) = 6600.00
Result = 6600.00
```

#### FORMULA Calculation
```python
Component: Overtime Pay
calculation_type = FORMULA
formula = '(basic / 30 / 8) * overtime_hours * 1.5'

Given: 
  basic = 50000.00
  overtime_hours = 10

Calculation:
  hourly_rate = 50000.00 / 30 / 8 = 208.33
  ot_rate = 208.33 × 1.5 = 312.50
  overtime_pay = 312.50 × 10 = 3125.00
Result = 3125.00
```

### Decimal Precision

```
default_value: DECIMAL(15,2)
═══════════════════════════
Max value: 9,999,999,999,999.99
Suitable for: Salaries up to 9.9 trillion
Example: 50000.00, 125000.50

percentage: DECIMAL(5,2)
════════════════════════
Max value: 999.99
Suitable for: 0.00% to 999.99%
Practical range: 0.00% to 100.00%
Example: 8.00 (8%), 12.50 (12.5%)
```

### Formula Syntax (Future Implementation)

```python
Supported Variables:
  • basic - Basic salary component value
  • gross - Gross salary total
  • hours - Attendance hours
  • days - Working days
  • overtime_hours - Overtime hours
  • [component_code] - Other component values

Supported Operators:
  • + - * / (arithmetic)
  • ( ) (grouping)
  • > < >= <= == (comparison, for conditional)

Example Formulas:
  • "(basic / 30 / 8) * overtime_hours * 1.5"
  • "gross * 0.10 if performance_rating > 4 else 0"
  • "(basic + TRANSPORT) / 30 * no_pay_days"
  • "basic * 0.083333"  (1/12 for annual bonus)
```

### Sri Lankan Statutory Rates

| Component | Calculation Type | Percentage | Legal Rate |
|-----------|-----------------|------------|------------|
| EPF Employee | PERCENTAGE_OF_BASIC | 8.00 | 8% minimum |
| EPF Employer | PERCENTAGE_OF_BASIC | 12.00 | 12% minimum |
| ETF | PERCENTAGE_OF_BASIC | 3.00 | 3% fixed |

### Expected Outcome
- Calculation fields added to SalaryComponent
- Support for fixed, percentage, and formula calculations
- Financial precision with Decimal fields
- Foundation for flexible payroll calculations

### Verification Checklist
- [ ] calculation_type field added
- [ ] CalculationType choices applied
- [ ] default_value field added (Decimal 15,2)
- [ ] percentage field added (Decimal 5,2)
- [ ] formula field added (TextField)
- [ ] Decimal class imported
- [ ] Defaults set appropriately
- [ ] All fields nullable as needed
- [ ] Model docstring updated
- [ ] Field usage documented in comments

---

## Task 09: Add Taxable Flag

### Overview
Add the is_taxable boolean field to the SalaryComponent model to indicate whether the component contributes to taxable income for PAYE (Pay As You Earn) tax calculations. This flag is essential for accurate income tax computation in Sri Lankan payroll.

### Dependencies
- Task 06: Create SalaryComponent Model Core
- Task 08: Add Calculation Fields

### Instructions

1. **Open salary_component.py model file**
   - Continue in `apps/payroll/models/salary_component.py`
   - Locate SalaryComponent model class

2. **Add is_taxable field**
   - BooleanField
   - Default to True
   - Required field (no null)
   - Place after calculation fields
   - Indicates if component is included in taxable income

3. **Add field help text**
   - Set help_text explaining usage
   - Example: "Include in taxable income for PAYE calculation"
   - Clarifies field purpose for users

4. **Update model docstring**
   - Add is_taxable to field list
   - Explain impact on tax calculations
   - Provide taxable vs. non-taxable examples

5. **Add usage comments**
   - Comment on typical taxable components
   - Comment on typical non-taxable components
   - Note Sri Lankan tax regulations

### is_taxable Field Specification

```python
is_taxable = models.BooleanField(
    default=True,
    help_text="Include in taxable income for PAYE calculation"
)
```

### Field Details

| Property | Value | Purpose |
|----------|-------|---------|
| Type | BooleanField | True/False flag |
| Default | True | Most components are taxable |
| Required | Yes | No null allowed |
| Help Text | Explanation of purpose | User guidance |

### Taxable vs. Non-Taxable Components

```
Taxable Income (is_taxable=True):
══════════════════════════════════
✓ Basic Salary
✓ Transport Allowance
✓ Housing Allowance
✓ Overtime Pay
✓ Bonuses
✓ Commission
✓ Most allowances

Non-Taxable Income (is_taxable=False):
═══════════════════════════════════════
✓ Medical Allowance (up to exemption limit)
✓ Reimbursements (actual expenses)
✓ Employer EPF Contribution (not employee income)
✓ Employer ETF Contribution
✓ Gratuity (under certain conditions)
```

### Component Examples with Taxable Flag

#### Example 1: Basic Salary (Taxable)
```python
{
    'name': 'Basic Salary',
    'code': 'BASIC',
    'component_type': 'EARNING',
    'category': 'BASIC',
    'is_taxable': True  # ← Included in taxable income
}
```

#### Example 2: Transport Allowance (Taxable)
```python
{
    'name': 'Transport Allowance',
    'code': 'TRANSPORT',
    'component_type': 'EARNING',
    'category': 'ALLOWANCE',
    'is_taxable': True  # ← Taxable allowance
}
```

#### Example 3: Medical Allowance (Non-Taxable)
```python
{
    'name': 'Medical Allowance',
    'code': 'MEDICAL',
    'component_type': 'EARNING',
    'category': 'ALLOWANCE',
    'is_taxable': False  # ← Exempt up to limit
}
```

#### Example 4: EPF Employer Contribution (Non-Taxable)
```python
{
    'name': 'EPF Employer 12%',
    'code': 'EPF_EMP_CONTRIB',
    'component_type': 'EMPLOYER_CONTRIBUTION',
    'category': 'STATUTORY',
    'is_taxable': False  # ← Not employee income
}
```

### Taxable Income Calculation

```
Employee Monthly Salary Breakdown:
═══════════════════════════════════

EARNINGS:
  Basic Salary (taxable)           50,000.00  ✓
  Transport Allowance (taxable)     5,000.00  ✓
  Medical Allowance (non-taxable)   3,000.00  ✗
  Housing Allowance (taxable)       8,000.00  ✓
  Overtime (taxable)                3,000.00  ✓
  ─────────────────────────────────────────
  Gross Salary                     69,000.00

Taxable Income Calculation:
  Basic Salary                     50,000.00
+ Transport Allowance               5,000.00
+ Housing Allowance                 8,000.00
+ Overtime                          3,000.00
  ─────────────────────────────────────────
= Taxable Income                   66,000.00  ← Used for PAYE

PAYE Tax Calculation:
  Annual Taxable: 66,000 × 12 = 792,000.00
  Tax-free threshold: 1,200,000.00 (annual)
  Tax-free monthly: 100,000.00
  
  Since monthly taxable (66,000) < threshold (100,000):
  PAYE Tax = 0.00
```

### Sri Lankan PAYE Tax Exemptions

| Component Type | Taxable Status | Notes |
|---------------|---------------|-------|
| Basic Salary | Taxable | Always included |
| Transport Allowance | Taxable | Fully taxable |
| Housing Allowance | Taxable | Fully taxable |
| Medical Allowance | Exempt (conditions apply) | Up to exemption limit |
| Meal Allowance | Exempt (conditions apply) | Actual reimbursement |
| Overtime Pay | Taxable | Part of regular income |
| Bonuses | Taxable | Subject to PAYE |
| EPF Employee | Not applicable | Deduction, not income |
| EPF Employer | Exempt | Not employee income |
| ETF | Exempt | Not employee income |

### PAYE Tax Calculation Flow

```
┌─────────────────────────────────────────┐
│  1. Collect All EARNING Components     │
└───────────────┬─────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────┐
│  2. Filter by is_taxable=True          │
└───────────────┬─────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────┐
│  3. Sum Taxable Components             │
│     = Gross Taxable Income             │
└───────────────┬─────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────┐
│  4. Apply Tax-Free Threshold           │
│     (Currently 100,000/month)          │
└───────────────┬─────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────┐
│  5. Apply Progressive Tax Rates        │
│     to Taxable Amount                  │
└───────────────┬─────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────┐
│  6. Calculate Monthly PAYE Tax         │
└─────────────────────────────────────────┘
```

### Query Examples

```python
# Get all taxable components
taxable_components = SalaryComponent.objects.filter(
    tenant=tenant,
    component_type=ComponentType.EARNING,
    is_taxable=True
)

# Get non-taxable allowances
non_taxable_allowances = SalaryComponent.objects.filter(
    tenant=tenant,
    category=ComponentCategory.ALLOWANCE,
    is_taxable=False
)

# Calculate taxable income
taxable_earnings = employee_salary_components.filter(
    component__is_taxable=True,
    component__component_type=ComponentType.EARNING
).aggregate(
    total=Sum('amount')
)['total'] or Decimal('0.00')
```

### Payslip Display with Tax Indicators

```
╔════════════════════════════════════════════════╗
║                   EARNINGS                     ║
╠════════════════════════════════════════════════╣
║  Basic Salary (T)              50,000.00       ║  ← (T) = Taxable
║  Transport Allowance (T)        5,000.00       ║
║  Medical Allowance (NT)         3,000.00       ║  ← (NT) = Non-Taxable
║  Housing Allowance (T)          8,000.00       ║
║  ────────────────────────────────────────────  ║
║  Gross Salary                  66,000.00       ║
║  Taxable Income                63,000.00       ║  ← Excludes Medical
╠════════════════════════════════════════════════╣
║                  DEDUCTIONS                    ║
╠════════════════════════════════════════════════╣
║  PAYE Tax                      -8,500.00       ║  ← Based on taxable
║  EPF Employee 8%               -4,000.00       ║
║  ────────────────────────────────────────────  ║
║  Net Salary                    53,500.00       ║
╚════════════════════════════════════════════════╝
```

### Expected Outcome
- is_taxable field added to SalaryComponent
- Support for PAYE tax calculations
- Accurate taxable income computation
- Compliance with Sri Lankan tax regulations

### Verification Checklist
- [ ] is_taxable field added to model
- [ ] Field type is BooleanField
- [ ] Default value set to True
- [ ] Help text provided
- [ ] Field is required (no null)
- [ ] Model docstring updated
- [ ] Taxable/non-taxable examples documented
- [ ] Sri Lankan tax context noted

---

## Summary

This document established the foundation of the payroll salary component system:

### Completed Infrastructure
- ✅ Payroll Django application created and registered
- ✅ ComponentType choices (EARNING, DEDUCTION, EMPLOYER_CONTRIBUTION)
- ✅ CalculationType choices (FIXED, PERCENTAGE_OF_BASIC, PERCENTAGE_OF_GROSS, FORMULA)
- ✅ ComponentCategory choices (BASIC, ALLOWANCE, BONUS, STATUTORY, LOAN, TAX, OTHER)
- ✅ SalaryComponent model with core fields (name, code, component_type)
- ✅ Component category field for grouping
- ✅ Calculation fields (calculation_type, default_value, percentage, formula)
- ✅ Taxable flag for PAYE tax calculations

### Key Achievements
1. **Organized Structure** - Dedicated payroll app with proper organization
2. **Type Safety** - TextChoices for component types and categories
3. **Calculation Flexibility** - Support for fixed, percentage, and formula-based calculations
4. **Financial Precision** - Decimal fields for accurate monetary values
5. **Tax Compliance** - Taxable flag for PAYE calculations
6. **Multi-Tenant** - Tenant-aware component storage

### Database Structure Created
```
payroll_salary_components table:
  • Core: name, code, component_type, category
  • Calculation: calculation_type, default_value, percentage, formula
  • Flags: is_taxable
  • Audit: tenant, created_at, updated_at, created_by, updated_by
```

### Next Steps
Proceed to [02_Tasks-10-18_Flags-Index-Seed.md](02_Tasks-10-18_Flags-Index-Seed.md) to implement EPF applicability, fixed/variable flags, display ordering, indexes, migrations, and seed data for statutory components and common allowances.

---

**Document Status:** ✅ Complete  
**Total Tasks:** 9  
**Estimated Time:** 2 hours 20 minutes
