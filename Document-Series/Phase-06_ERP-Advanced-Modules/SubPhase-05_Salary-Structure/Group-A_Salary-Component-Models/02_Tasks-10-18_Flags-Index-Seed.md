# Tasks 10-18: Flags, Indexes, Migrations, and Seed Data

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 05 - Salary Structure  
> **Group:** A - Salary Component Models  
> **Document:** 02 of 02  
> **Tasks Covered:** 10, 11, 12, 13, 14, 15, 16, 17, 18

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-01-09_App-Component-Core.md](01_Tasks-01-09_App-Component-Core.md)

---

## Document Overview

This document covers the completion of the SalaryComponent model with additional flags, indexes, database migrations, and essential seed data. These elements enable EPF base calculation, attendance-based variability tracking, organized payslip display, and pre-populated statutory components for Sri Lankan payroll compliance.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 10 | Add EPF Applicable Flag | Low | 10 min |
| 11 | Add Fixed/Variable Flag | Low | 10 min |
| 12 | Add Active Flag | Low | 10 min |
| 13 | Add Display Order | Low | 10 min |
| 14 | Add Description Field | Low | 10 min |
| 15 | Create Component Indexes | Medium | 20 min |
| 16 | Run SalaryComponent Migrations | Low | 15 min |
| 17 | Create Statutory Components Seed | Medium | 25 min |
| 18 | Create Common Allowances Seed | Medium | 20 min |

---

## Task 10: Add EPF Applicable Flag

### Overview
Add the is_epf_applicable boolean field to indicate whether a component contributes to the EPF (Employees' Provident Fund) base calculation. EPF contributions in Sri Lanka are calculated on specific components, not the entire gross salary, making this flag essential for accurate statutory compliance.

### Dependencies
- Task 09: Add Taxable Flag
- Understanding of Sri Lankan EPF regulations

### Instructions

1. **Open salary_component.py model file**
   - Continue in `apps/payroll/models/salary_component.py`
   - Locate SalaryComponent model class

2. **Add is_epf_applicable field**
   - BooleanField
   - Default to False
   - Required field (no null)
   - Place after is_taxable field
   - Indicates inclusion in EPF base

3. **Add field help text**
   - Set help_text explaining EPF base
   - Example: "Include in EPF base calculation (8% employee + 12% employer)"
   - Clarifies field purpose

4. **Update model docstring**
   - Add is_epf_applicable to field list
   - Explain EPF base calculation
   - Provide EPF-applicable vs. non-applicable examples

5. **Add usage comments**
   - Comment on typical EPF-applicable components
   - Note Sri Lankan EPF Act requirements
   - Explain EPF vs. ETF base (both use same base)

### is_epf_applicable Field Specification

```python
is_epf_applicable = models.BooleanField(
    default=False,
    help_text="Include in EPF base calculation (8% employee + 12% employer)"
)
```

### Field Details

| Property | Value | Purpose |
|----------|-------|---------|
| Type | BooleanField | True/False flag |
| Default | False | Conservative default (opt-in) |
| Required | Yes | No null allowed |
| Help Text | EPF calculation explanation | User guidance |

### EPF-Applicable vs. Non-Applicable Components

```
EPF Base (is_epf_applicable=True):
═══════════════════════════════════
✓ Basic Salary (always included)
✓ Fixed Allowances (regular monthly)
✓ Overtime Pay (regular income)
✓ Commission (regular income)

NOT EPF Base (is_epf_applicable=False):
════════════════════════════════════════
✓ One-time Bonuses (annual, performance)
✓ Reimbursements (actual expenses)
✓ Medical Allowance (allowance, not salary)
✓ Arrears (back-dated payments)
✓ Gratuity (terminal benefit)
```

### Sri Lankan EPF Regulations

```
EPF Contribution Rates:
═══════════════════════
Employee Contribution: 8% of EPF base
Employer Contribution: 12% of EPF base
Total: 20% of EPF base

ETF Contribution:
═════════════════
Employer Contribution: 3% of EPF base
(Same base as EPF)

EPF Base Definition:
════════════════════
Per EPF Act and case law:
• Basic Salary (core monthly salary)
• Regular Fixed Allowances (transport, etc.)
• Overtime (regular additional work)
• Commission (regular earnings)

Excluded from EPF Base:
• Annual Bonuses
• Attendance Bonuses (irregular)
• Medical Reimbursements
• Meal Allowances (expense reimbursement)
• Festival Bonuses
• Gratuity
```

### Component Examples with EPF Flag

#### Example 1: Basic Salary (EPF Applicable)
```python
{
    'name': 'Basic Salary',
    'code': 'BASIC',
    'component_type': 'EARNING',
    'category': 'BASIC',
    'is_epf_applicable': True  # ← Core salary, always EPF base
}
```

#### Example 2: Transport Allowance (EPF Applicable)
```python
{
    'name': 'Transport Allowance',
    'code': 'TRANSPORT',
    'component_type': 'EARNING',
    'category': 'ALLOWANCE',
    'is_epf_applicable': True  # ← Regular fixed allowance, EPF base
}
```

#### Example 3: Medical Allowance (NOT EPF Applicable)
```python
{
    'name': 'Medical Allowance',
    'code': 'MEDICAL',
    'component_type': 'EARNING',
    'category': 'ALLOWANCE',
    'is_epf_applicable': False  # ← Expense reimbursement, not EPF base
}
```

#### Example 4: Performance Bonus (NOT EPF Applicable)
```python
{
    'name': 'Performance Bonus',
    'code': 'BONUS_PERF',
    'component_type': 'EARNING',
    'category': 'BONUS',
    'is_epf_applicable': False  # ← One-time payment, not EPF base
}
```

### EPF Base Calculation Example

```
Employee Monthly Salary Breakdown:
═══════════════════════════════════

EARNINGS (EPF Status):
  Basic Salary (EPF: Yes)          50,000.00  ✓
  Transport Allowance (EPF: Yes)    5,000.00  ✓
  Housing Allowance (EPF: Yes)      8,000.00  ✓
  Medical Allowance (EPF: No)       3,000.00  ✗
  Performance Bonus (EPF: No)       5,000.00  ✗
  Overtime Pay (EPF: Yes)           3,000.00  ✓
  ─────────────────────────────────────────
  Gross Salary                     74,000.00

EPF Base Calculation:
  Basic Salary                     50,000.00
+ Transport Allowance               5,000.00
+ Housing Allowance                 8,000.00
+ Overtime Pay                      3,000.00
  ─────────────────────────────────────────
= EPF Base                         66,000.00

EPF Contributions:
  Employee 8%:  66,000 × 8%  =  5,280.00 (deduction)
  Employer 12%: 66,000 × 12% =  7,920.00 (employer cost)
  
ETF Contribution:
  Employer 3%:  66,000 × 3%  =  1,980.00 (employer cost)

Total Employer Statutory Cost:
  EPF Employer:  7,920.00
  ETF:           1,980.00
  ───────────────────────
  Total:         9,900.00 (15% of EPF base)
```

### Comparison: EPF vs. Taxable

```
┌────────────────────────────────────────────────┐
│  Component Analysis: EPF vs. Taxable           │
├────────────────────────────────────────────────┤
│                                                │
│  Component          │ EPF Base │ Taxable      │
│  ──────────────────────────────────────────────│
│  Basic Salary       │   Yes    │   Yes        │
│  Transport Allow    │   Yes    │   Yes        │
│  Housing Allow      │   Yes    │   Yes        │
│  Medical Allow      │   No     │   No*        │
│  Performance Bonus  │   No     │   Yes        │
│  Overtime Pay       │   Yes    │   Yes        │
│  Annual Bonus       │   No     │   Yes        │
│  Reimbursements     │   No     │   No         │
│                                                │
│  * Medical may be tax-exempt up to limit       │
└────────────────────────────────────────────────┘

Note: EPF base is typically smaller than taxable income
```

### Query Examples

```python
# Get EPF-applicable components
epf_components = SalaryComponent.objects.filter(
    tenant=tenant,
    component_type=ComponentType.EARNING,
    is_epf_applicable=True
)

# Calculate EPF base for an employee
epf_base = employee_salary_components.filter(
    component__is_epf_applicable=True,
    component__component_type=ComponentType.EARNING
).aggregate(
    total=Sum('amount')
)['total'] or Decimal('0.00')

# Calculate EPF contributions
epf_employee = epf_base * Decimal('0.08')  # 8%
epf_employer = epf_base * Decimal('0.12')  # 12%
etf_employer = epf_base * Decimal('0.03')  # 3%
```

### EPF Base Decision Tree

```
Is component included in EPF base?
════════════════════════════════

Start: Is it an EARNING component?
   │
   ├─ No → EPF = False (deductions/contributions not in base)
   │
   └─ Yes → Is it Basic Salary?
       │
       ├─ Yes → EPF = True (always included)
       │
       └─ No → Is it a regular monthly payment?
           │
           ├─ Yes → Is it fixed or predictable?
           │   │
           │   ├─ Yes → EPF = True (e.g., transport allowance)
           │   │
           │   └─ No → EPF = False (e.g., variable commission)
           │
           └─ No → Is it a one-time payment?
               │
               └─ Yes → EPF = False (e.g., annual bonus)
```

### Payslip Display with EPF Indicators

```
╔════════════════════════════════════════════════╗
║                   EARNINGS                     ║
╠════════════════════════════════════════════════╣
║  Basic Salary (E)              50,000.00       ║  ← (E) = EPF Base
║  Transport Allowance (E)        5,000.00       ║
║  Housing Allowance (E)          8,000.00       ║
║  Medical Allowance              3,000.00       ║  ← Not EPF base
║  Performance Bonus              5,000.00       ║  ← Not EPF base
║  Overtime Pay (E)               3,000.00       ║
║  ────────────────────────────────────────────  ║
║  Gross Salary                  74,000.00       ║
║  EPF Base                      66,000.00       ║  ← Sum of (E) items
╠════════════════════════════════════════════════╣
║                  DEDUCTIONS                    ║
╠════════════════════════════════════════════════╣
║  EPF Employee 8%               -5,280.00       ║  ← 8% of EPF base
║  PAYE Tax                      -9,500.00       ║
║  ────────────────────────────────────────────  ║
║  Net Salary                    59,220.00       ║
╠════════════════════════════════════════════════╣
║  Employer Contributions:                       ║
║  EPF Employer 12%               7,920.00       ║  ← 12% of EPF base
║  ETF 3%                         1,980.00       ║  ← 3% of EPF base
╚════════════════════════════════════════════════╝
```

### Expected Outcome
- is_epf_applicable field added to SalaryComponent
- Support for EPF base calculation
- Accurate statutory contribution computation
- Compliance with Sri Lankan EPF regulations

### Verification Checklist
- [ ] is_epf_applicable field added to model
- [ ] Field type is BooleanField
- [ ] Default value set to False
- [ ] Help text provided
- [ ] Field is required (no null)
- [ ] Model docstring updated
- [ ] EPF-applicable examples documented
- [ ] Sri Lankan EPF regulations noted

---

## Task 11: Add Fixed/Variable Flag

### Overview
Add the is_fixed boolean field to distinguish between fixed components (same amount every month) and variable components (amount changes based on attendance, performance, hours worked, etc.). This distinction is crucial for payroll processing and no-pay calculations.

### Dependencies
- Task 10: Add EPF Applicable Flag

### Instructions

1. **Open salary_component.py model file**
   - Continue in `apps/payroll/models/salary_component.py`
   - Locate SalaryComponent model class

2. **Add is_fixed field**
   - BooleanField
   - Default to True
   - Required field (no null)
   - Place after is_epf_applicable field
   - Indicates if component has fixed monthly amount

3. **Add field help text**
   - Set help_text explaining fixed vs. variable
   - Example: "Fixed amount every month (True) or variable based on attendance/performance (False)"
   - Clarifies field purpose

4. **Update model docstring**
   - Add is_fixed to field list
   - Explain fixed vs. variable components
   - Provide examples of each type

5. **Add usage comments**
   - Comment on typical fixed components
   - Comment on typical variable components
   - Note impact on no-pay calculations

### is_fixed Field Specification

```python
is_fixed = models.BooleanField(
    default=True,
    help_text="Fixed amount every month (True) or variable based on attendance/performance (False)"
)
```

### Field Details

| Property | Value | Purpose |
|----------|-------|---------|
| Type | BooleanField | True/False flag |
| Default | True | Most components are fixed |
| Required | Yes | No null allowed |
| Help Text | Fixed/variable explanation | User guidance |

### Fixed vs. Variable Components

```
Fixed Components (is_fixed=True):
══════════════════════════════════
✓ Basic Salary (same every month)
✓ Transport Allowance (fixed amount)
✓ Housing Allowance (fixed amount)
✓ Medical Allowance (fixed amount)
✓ Telephone Allowance (fixed amount)

Characteristics:
• Same amount every pay period
• Not affected by attendance
• Pro-rated during no-pay situations
• Predictable for budgeting

Variable Components (is_fixed=False):
══════════════════════════════════════
✓ Overtime Pay (based on hours worked)
✓ Commission (based on sales)
✓ Production Incentive (based on output)
✓ No-Pay Deduction (based on absences)
✓ Attendance Bonus (based on attendance)

Characteristics:
• Amount varies each pay period
• Calculated based on performance/attendance
• Not pro-rated during no-pay
• Depends on actual data
```

### Component Examples with Fixed Flag

#### Example 1: Basic Salary (Fixed)
```python
{
    'name': 'Basic Salary',
    'code': 'BASIC',
    'component_type': 'EARNING',
    'category': 'BASIC',
    'calculation_type': 'FIXED',
    'default_value': Decimal('50000.00'),
    'is_fixed': True  # ← Same amount every month
}
```

#### Example 2: Transport Allowance (Fixed)
```python
{
    'name': 'Transport Allowance',
    'code': 'TRANSPORT',
    'component_type': 'EARNING',
    'category': 'ALLOWANCE',
    'calculation_type': 'FIXED',
    'default_value': Decimal('5000.00'),
    'is_fixed': True  # ← Fixed monthly allowance
}
```

#### Example 3: Overtime Pay (Variable)
```python
{
    'name': 'Overtime Pay',
    'code': 'OVERTIME',
    'component_type': 'EARNING',
    'category': 'OTHER',
    'calculation_type': 'FORMULA',
    'formula': '(basic / 30 / 8) * overtime_hours * 1.5',
    'is_fixed': False  # ← Varies based on hours worked
}
```

#### Example 4: Sales Commission (Variable)
```python
{
    'name': 'Sales Commission',
    'code': 'COMMISSION',
    'component_type': 'EARNING',
    'category': 'OTHER',
    'calculation_type': 'FORMULA',
    'formula': 'sales_amount * 0.05',
    'is_fixed': False  # ← Varies based on sales
}
```

#### Example 5: No-Pay Deduction (Variable)
```python
{
    'name': 'No-Pay Deduction',
    'code': 'NO_PAY',
    'component_type': 'DEDUCTION',
    'category': 'OTHER',
    'calculation_type': 'FORMULA',
    'formula': '(basic + fixed_allowances) / 30 * no_pay_days',
    'is_fixed': False  # ← Varies based on absences
}
```

### No-Pay Calculation Impact

```
Scenario: Employee has 2 no-pay days in a 30-day month
═══════════════════════════════════════════════════════

Regular Monthly Components:
  Basic Salary (fixed)             50,000.00
  Transport Allowance (fixed)       5,000.00
  Housing Allowance (fixed)         8,000.00
  Medical Allowance (fixed)         3,000.00
  Overtime Pay (variable)           3,000.00  ← Not affected by no-pay
  ───────────────────────────────────────────
  Total Before No-Pay              69,000.00

No-Pay Calculation (Fixed Components Only):
  Fixed Components Total:
    Basic Salary                   50,000.00
  + Transport Allowance             5,000.00
  + Housing Allowance               8,000.00
  + Medical Allowance               3,000.00
    ──────────────────────────────────────
    Total Fixed                    66,000.00

  Daily Rate: 66,000 / 30 = 2,200.00
  No-Pay Days: 2
  No-Pay Deduction: 2,200 × 2 = 4,400.00

Final Salary:
  Total Before No-Pay              69,000.00
  No-Pay Deduction                 -4,400.00
  ───────────────────────────────────────────
  Total After No-Pay               64,600.00

Note: Overtime (variable) remains at 3,000.00 because
      it's already calculated based on actual hours worked
```

### Fixed vs. Variable by Category

```
┌────────────────────────────────────────────────┐
│  Component Category → Fixed/Variable Pattern   │
├────────────────────────────────────────────────┤
│                                                │
│  BASIC Category:                               │
│    • Basic Salary → Fixed (always)             │
│                                                │
│  ALLOWANCE Category:                           │
│    • Transport → Fixed (typically)             │
│    • Medical → Fixed (typically)               │
│    • Housing → Fixed (typically)               │
│    • Shift Allowance → Variable (per shifts)   │
│                                                │
│  BONUS Category:                               │
│    • Annual Bonus → Variable (per criteria)    │
│    • Performance → Variable (per rating)       │
│    • Attendance → Variable (per attendance)    │
│                                                │
│  STATUTORY Category:                           │
│    • EPF Employee → Fixed (based on base)      │
│    • PAYE Tax → Fixed (based on income)        │
│                                                │
│  OTHER Category:                               │
│    • Overtime → Variable (per hours)           │
│    • Commission → Variable (per sales)         │
│    • No-Pay → Variable (per absences)          │
│                                                │
└────────────────────────────────────────────────┘
```

### Payroll Processing Logic

```python
def calculate_monthly_salary(employee, month, year):
    """
    Calculate monthly salary with no-pay handling
    """
    # Get fixed and variable components separately
    fixed_components = employee.salary_components.filter(
        component__is_fixed=True
    )
    
    variable_components = employee.salary_components.filter(
        component__is_fixed=False
    )
    
    # Calculate fixed components (subject to no-pay)
    fixed_total = sum(comp.calculate_amount() for comp in fixed_components)
    
    # Calculate no-pay deduction (affects fixed only)
    no_pay_days = get_no_pay_days(employee, month, year)
    if no_pay_days > 0:
        daily_rate = fixed_total / 30
        no_pay_deduction = daily_rate * no_pay_days
        fixed_total -= no_pay_deduction
    
    # Calculate variable components (not affected by no-pay)
    variable_total = sum(comp.calculate_amount() for comp in variable_components)
    
    # Total salary
    total_salary = fixed_total + variable_total
    
    return total_salary
```

### Attendance-Based Scenarios

#### Full Month Attendance
```
Fixed Components:              66,000.00
Variable Components (OT):       3,000.00
No-Pay Days: 0
No-Pay Deduction:                   0.00
───────────────────────────────────────
Total Salary:                  69,000.00
```

#### 2 Days No-Pay
```
Fixed Components:              66,000.00
Daily Rate:                     2,200.00
No-Pay Deduction (2 days):     -4,400.00
Adjusted Fixed:                61,600.00

Variable Components (OT):       3,000.00
───────────────────────────────────────
Total Salary:                  64,600.00
```

#### No Overtime (No Variable)
```
Fixed Components:              66,000.00
Variable Components:                0.00
No-Pay Days: 0
───────────────────────────────────────
Total Salary:                  66,000.00
```

### Query Examples

```python
# Get fixed components for no-pay calculation
fixed_components = SalaryComponent.objects.filter(
    tenant=tenant,
    is_fixed=True,
    component_type=ComponentType.EARNING
)

# Get variable components (not affected by no-pay)
variable_components = SalaryComponent.objects.filter(
    tenant=tenant,
    is_fixed=False
)

# Calculate fixed component total for employee
fixed_total = employee.salary_components.filter(
    component__is_fixed=True,
    component__component_type=ComponentType.EARNING
).aggregate(
    total=Sum('amount')
)['total'] or Decimal('0.00')
```

### Expected Outcome
- is_fixed field added to SalaryComponent
- Support for fixed vs. variable component distinction
- Accurate no-pay calculation
- Foundation for attendance-based payroll

### Verification Checklist
- [ ] is_fixed field added to model
- [ ] Field type is BooleanField
- [ ] Default value set to True
- [ ] Help text provided
- [ ] Field is required (no null)
- [ ] Model docstring updated
- [ ] Fixed/variable examples documented
- [ ] No-pay calculation impact explained

---

## Task 12: Add Active Flag

### Overview
Add the is_active boolean field to control the availability of salary components. Inactive components are retained for historical records but cannot be assigned to new employees or salary templates, supporting phased component retirement and audit trails.

### Dependencies
- Task 11: Add Fixed/Variable Flag

### Instructions

1. **Open salary_component.py model file**
   - Continue in `apps/payroll/models/salary_component.py`
   - Locate SalaryComponent model class

2. **Add is_active field**
   - BooleanField
   - Default to True
   - Required field (no null)
   - Place after is_fixed field
   - Controls component availability

3. **Add field help text**
   - Set help_text explaining active status
   - Example: "Active components can be assigned to employees; inactive are retained for history"
   - Clarifies field purpose

4. **Update model docstring**
   - Add is_active to field list
   - Explain active vs. inactive components
   - Note historical record preservation

5. **Add usage comments**
   - Comment on when to deactivate components
   - Note that existing assignments remain
   - Explain audit trail benefits

### is_active Field Specification

```python
is_active = models.BooleanField(
    default=True,
    help_text="Active components can be assigned to employees; inactive are retained for history"
)
```

### Field Details

| Property | Value | Purpose |
|----------|-------|---------|
| Type | BooleanField | True/False flag |
| Default | True | New components are active |
| Required | Yes | No null allowed |
| Help Text | Active/inactive explanation | User guidance |

### Active vs. Inactive Components

```
Active Components (is_active=True):
════════════════════════════════════
✓ Can be assigned to new employees
✓ Can be added to salary templates
✓ Appear in component selection lists
✓ Visible in active component reports
✓ Available for payroll processing

Inactive Components (is_active=False):
═══════════════════════════════════════
✓ Retained in database (not deleted)
✓ Existing assignments remain active
✓ Historical payslips show component
✓ Cannot be assigned to new employees
✓ Hidden from selection lists
✓ Visible in historical reports only
```

### Component Lifecycle

```
Component Lifecycle States:
═══════════════════════════

[Created] → is_active=True
    │
    │ ← Component in use
    │
    ▼
[In Use] → is_active=True
    │
    │ ← Component assignments exist
    │ ← Appears on payslips
    │
    ▼
[Deprecated] → is_active=False (deactivated)
    │
    │ ← New assignments blocked
    │ ← Existing assignments remain
    │ ← Historical records preserved
    │
    ▼
[Historical] → is_active=False
    │
    │ ← Last assignment removed
    │ ← Only in historical data
    │
    [Component Retained] → Never deleted for audit trail
```

### Deactivation Scenarios

#### Scenario 1: Policy Change
```
Old Component:
  Name: Mobile Phone Allowance
  Amount: 3,000.00
  is_active: False  ← Deactivated

New Component:
  Name: Communication Allowance
  Amount: 5,000.00
  is_active: True  ← Replaces old

Why: Company policy changed allowance structure
```

#### Scenario 2: Regulatory Change
```
Old Component:
  Name: EPF Employee 8%
  Percentage: 8.00
  is_active: False  ← Deactivated (if rate changes)

New Component:
  Name: EPF Employee 10%
  Percentage: 10.00
  is_active: True  ← New rate (hypothetical)

Why: Government changed EPF contribution rate
```

#### Scenario 3: Component Consolidation
```
Old Components:
  Transport Allowance (2,000)    is_active: False
  Fuel Allowance (1,500)         is_active: False
  Parking Allowance (500)        is_active: False

New Component:
  Travel Allowance (4,000)       is_active: True

Why: Simplified allowance structure
```

### Active Component Filtering

```python
# Get only active components for assignment
active_components = SalaryComponent.objects.filter(
    tenant=tenant,
    is_active=True
)

# Get all components (including inactive) for historical reports
all_components = SalaryComponent.objects.filter(
    tenant=tenant
)

# Get inactive components for audit
inactive_components = SalaryComponent.objects.filter(
    tenant=tenant,
    is_active=False
)
```

### UI Component Selection

```
Component Selection Dropdown:
═════════════════════════════

Active Components (Displayed):
  ▢ Basic Salary
  ▢ Transport Allowance
  ▢ Medical Allowance
  ▢ Housing Allowance
  ▢ Overtime Pay

Inactive Components (Hidden):
  [Not shown in dropdown]
  • Old Mobile Allowance (deactivated)
  • Old Fuel Allowance (deactivated)

Historical View (All Components):
  ▢ Basic Salary (Active)
  ▢ Transport Allowance (Active)
  ▢ Old Mobile Allowance (Inactive)
  ▢ Old Fuel Allowance (Inactive)
```

### Existing Assignment Behavior

```
Scenario: Component Deactivation with Existing Assignments
═══════════════════════════════════════════════════════════

Before Deactivation:
  Mobile Allowance (is_active=True)
    ├── Employee A: 3,000.00  ← Assigned
    ├── Employee B: 3,000.00  ← Assigned
    └── Employee C: 3,000.00  ← Assigned

After Deactivation:
  Mobile Allowance (is_active=False)
    ├── Employee A: 3,000.00  ← Still assigned, still paid
    ├── Employee B: 3,000.00  ← Still assigned, still paid
    └── Employee C: 3,000.00  ← Still assigned, still paid
  
  New Employees:
    ├── Employee D: Cannot assign (component inactive)
    ├── Employee E: Cannot assign (component inactive)

Key Points:
• Existing assignments remain active
• Employees continue receiving payment
• New assignments are blocked
• Component available in historical reports
```

### Payslip Display of Inactive Components

```
Current Month Payslip (Active Assignments):
╔════════════════════════════════════════════════╗
║  Basic Salary                  50,000.00       ║
║  Transport Allowance            5,000.00       ║
║  Mobile Allowance (Inactive)    3,000.00       ║  ← Still shows
║  Housing Allowance              8,000.00       ║
╚════════════════════════════════════════════════╝

Note: Inactive components appear on payslips if employee
      has an active assignment (assignment not removed)
```

### Component Reactivation

```python
# Reactivate a component if needed
component = SalaryComponent.objects.get(code='MOBILE', tenant=tenant)
component.is_active = True
component.save()

# Now available for new assignments again
```

### Audit Trail Benefits

```
Component History Report:
═════════════════════════

Transport Allowance (TRANSPORT)
├── Created: 2024-01-01
├── Status: Active
└── Assignments: 150 employees

Old Fuel Allowance (FUEL_OLD)
├── Created: 2022-01-01
├── Deactivated: 2024-06-01
├── Status: Inactive
├── Reason: Consolidated into Travel Allowance
├── Last Assignments: 85 employees
└── Historical Payslips: Available

Benefits:
✓ Complete component history
✓ Audit compliance
✓ Policy change tracking
✓ No data loss
✓ Historical payslip accuracy
```

### Best Practices

```
When to Deactivate:
═══════════════════
✓ Policy change requires new component
✓ Allowance structure consolidation
✓ Regulatory requirement changes
✓ Component no longer used

When NOT to Delete:
═══════════════════
✓ Historical payslips reference component
✓ Audit trail requirements
✓ Existing employee assignments
✓ Financial reporting needs

Always:
═══════
✓ Deactivate instead of delete
✓ Document deactivation reason
✓ Notify affected employees
✓ Create replacement component if needed
✓ Migrate assignments if required
```

### Expected Outcome
- is_active field added to SalaryComponent
- Support for component lifecycle management
- Historical record preservation
- Controlled component availability

### Verification Checklist
- [ ] is_active field added to model
- [ ] Field type is BooleanField
- [ ] Default value set to True
- [ ] Help text provided
- [ ] Field is required (no null)
- [ ] Model docstring updated
- [ ] Active/inactive behavior documented
- [ ] Audit trail benefits explained

---

## Task 13: Add Display Order

### Overview
Add the display_order integer field to control the sequence of salary components on payslips and reports. Proper ordering ensures professional, logical presentation with basic salary first, followed by allowances, bonuses, deductions, and employer contributions.

### Dependencies
- Task 12: Add Active Flag

### Instructions

1. **Open salary_component.py model file**
   - Continue in `apps/payroll/models/salary_component.py`
   - Locate SalaryComponent model class

2. **Add display_order field**
   - IntegerField
   - Default to 100
   - Required field (no null)
   - Place after is_active field
   - Controls display sequence

3. **Add field help text**
   - Set help_text explaining ordering
   - Example: "Display order on payslips (lower numbers appear first)"
   - Clarifies field purpose

4. **Update model Meta ordering**
   - Change from ['name'] to ['display_order', 'name']
   - Primary sort by display_order
   - Secondary sort by name (for same order values)

5. **Update model docstring**
   - Add display_order to field list
   - Explain ordering conventions
   - Provide typical order ranges

6. **Add ordering conventions comment**
   - Document standard order ranges
   - Note category-based ordering
   - Provide examples

### display_order Field Specification

```python
display_order = models.IntegerField(
    default=100,
    help_text="Display order on payslips (lower numbers appear first)"
)
```

### Field Details

| Property | Value | Purpose |
|----------|-------|---------|
| Type | IntegerField | Numeric ordering |
| Default | 100 | Middle range (room for before/after) |
| Required | Yes | No null allowed |
| Range | Typically 1-999 | Flexible ordering |
| Help Text | Ordering explanation | User guidance |

### Standard Display Order Ranges

```
Display Order Convention:
═════════════════════════

EARNINGS (ComponentType.EARNING):
  ┌────────────────────────────────────┐
  │ Order │ Category  │ Component      │
  ├────────────────────────────────────┤
  │ 10    │ BASIC     │ Basic Salary   │
  │ 20-29 │ ALLOWANCE │ Allowances     │
  │ 30-39 │ ALLOWANCE │ More Allowances│
  │ 40-49 │ OTHER     │ Overtime       │
  │ 50-59 │ BONUS     │ Bonuses        │
  └────────────────────────────────────┘

DEDUCTIONS (ComponentType.DEDUCTION):
  ┌────────────────────────────────────┐
  │ Order │ Category  │ Component      │
  ├────────────────────────────────────┤
  │ 100   │ STATUTORY │ EPF Employee   │
  │ 110   │ TAX       │ PAYE Tax       │
  │ 120   │ LOAN      │ Loan Repayment │
  │ 130   │ OTHER     │ Other Deduct   │
  └────────────────────────────────────┘

EMPLOYER CONTRIBUTIONS (ComponentType.EMPLOYER_CONTRIBUTION):
  ┌────────────────────────────────────┐
  │ Order │ Category  │ Component      │
  ├────────────────────────────────────┤
  │ 200   │ STATUTORY │ EPF Employer   │
  │ 210   │ STATUTORY │ ETF            │
  │ 220   │ OTHER     │ Gratuity       │
  └────────────────────────────────────┘
```

### Component Examples with Display Order

#### Example 1: Basic Salary (Order 10)
```python
{
    'name': 'Basic Salary',
    'code': 'BASIC',
    'component_type': 'EARNING',
    'category': 'BASIC',
    'display_order': 10  # ← First item on payslip
}
```

#### Example 2: Transport Allowance (Order 20)
```python
{
    'name': 'Transport Allowance',
    'code': 'TRANSPORT',
    'component_type': 'EARNING',
    'category': 'ALLOWANCE',
    'display_order': 20  # ← After basic salary
}
```

#### Example 3: Medical Allowance (Order 21)
```python
{
    'name': 'Medical Allowance',
    'code': 'MEDICAL',
    'component_type': 'EARNING',
    'category': 'ALLOWANCE',
    'display_order': 21  # ← After transport
}
```

#### Example 4: Overtime Pay (Order 40)
```python
{
    'name': 'Overtime Pay',
    'code': 'OVERTIME',
    'component_type': 'EARNING',
    'category': 'OTHER',
    'display_order': 40  # ← After allowances
}
```

#### Example 5: Performance Bonus (Order 50)
```python
{
    'name': 'Performance Bonus',
    'code': 'BONUS_PERF',
    'component_type': 'EARNING',
    'category': 'BONUS',
    'display_order': 50  # ← After overtime
}
```

### Payslip with Ordered Components

```
╔════════════════════════════════════════════════╗
║              PAYSLIP - JANUARY 2026            ║
╠════════════════════════════════════════════════╣
║                   EARNINGS                     ║
╠════════════════════════════════════════════════╣
║  [10] Basic Salary             50,000.00       ║  ← Order 10
║  [20] Transport Allowance       5,000.00       ║  ← Order 20
║  [21] Medical Allowance         3,000.00       ║  ← Order 21
║  [22] Housing Allowance         8,000.00       ║  ← Order 22
║  [40] Overtime Pay              3,000.00       ║  ← Order 40
║  [50] Performance Bonus         5,000.00       ║  ← Order 50
║  ────────────────────────────────────────────  ║
║  GROSS SALARY                  74,000.00       ║
╠════════════════════════════════════════════════╣
║                  DEDUCTIONS                    ║
╠════════════════════════════════════════════════╣
║  [100] EPF Employee 8%         -5,280.00       ║  ← Order 100
║  [110] PAYE Tax                -9,500.00       ║  ← Order 110
║  [120] Loan Repayment          -2,000.00       ║  ← Order 120
║  ────────────────────────────────────────────  ║
║  TOTAL DEDUCTIONS             -16,780.00       ║
╠════════════════════════════════════════════════╣
║  NET SALARY                    57,220.00       ║
╠════════════════════════════════════════════════╣
║           EMPLOYER CONTRIBUTIONS               ║
╠════════════════════════════════════════════════╣
║  [200] EPF Employer 12%         7,920.00       ║  ← Order 200
║  [210] ETF 3%                   1,980.00       ║  ← Order 210
╚════════════════════════════════════════════════╝

Note: Numbers in brackets are display_order values (not shown to employees)
```

### Ordering Query

```python
# Components automatically ordered by display_order, then name
components = SalaryComponent.objects.filter(
    tenant=tenant,
    is_active=True
)
# Due to Meta.ordering = ['display_order', 'name']

# Earnings in display order
earnings = SalaryComponent.objects.filter(
    tenant=tenant,
    component_type=ComponentType.EARNING,
    is_active=True
)
# Results: Basic (10), Transport (20), Medical (21), ...

# Deductions in display order
deductions = SalaryComponent.objects.filter(
    tenant=tenant,
    component_type=ComponentType.DEDUCTION,
    is_active=True
)
# Results: EPF (100), PAYE (110), Loan (120), ...
```

### Detailed Order Ranges by Category

```
BASIC Category (Order 10-19):
═════════════════════════════
10: Basic Salary
11-19: Reserved for future basic components

ALLOWANCE Category (Order 20-39):
══════════════════════════════════
20: Transport Allowance
21: Medical Allowance
22: Housing Allowance
23: Meal Allowance
24: Telephone Allowance
25: Shift Allowance
26-39: Other allowances

OVERTIME/OTHER Category (Order 40-49):
═══════════════════════════════════════
40: Overtime Pay
41: Night Shift Pay
42: Holiday Pay
43: Commission
44-49: Other variable earnings

BONUS Category (Order 50-59):
══════════════════════════════
50: Performance Bonus
51: Attendance Bonus
52: Production Incentive
53: Annual Bonus
54-59: Other bonuses

STATUTORY Deductions (Order 100-109):
══════════════════════════════════════
100: EPF Employee 8%
101-109: Other statutory deductions

TAX Category (Order 110-119):
══════════════════════════════
110: PAYE Tax
111-119: Other taxes

LOAN Category (Order 120-129):
═══════════════════════════════
120: Company Loan Repayment
121: Salary Advance Recovery
122: Festival Advance Recovery
123-129: Other loan deductions

OTHER Deductions (Order 130-149):
══════════════════════════════════
130: Welfare Fund
131: Union Dues
132: Canteen Charges
133: No-Pay Deduction
134-149: Other deductions

EMPLOYER CONTRIBUTIONS (Order 200-219):
════════════════════════════════════════
200: EPF Employer 12%
210: ETF 3%
220: Gratuity Provision
221-229: Other employer costs
```

### Benefits of Proper Ordering

```
Professional Presentation:
══════════════════════════
✓ Logical flow (earnings → deductions → net)
✓ Category grouping (all allowances together)
✓ Statutory items first (EPF before other deductions)
✓ Consistent across all payslips

User Experience:
════════════════
✓ Easy to read and understand
✓ Quick location of specific items
✓ Standard format reduces confusion
✓ Professional appearance

Processing Efficiency:
══════════════════════
✓ Consistent component iteration
✓ Predictable calculation order
✓ Simplified report generation
✓ Easier testing and validation
```

### Reordering Components

```python
# Batch update display order
components_to_update = [
    {'code': 'BASIC', 'order': 10},
    {'code': 'TRANSPORT', 'order': 20},
    {'code': 'MEDICAL', 'order': 21},
    {'code': 'HOUSING', 'order': 22},
]

for item in components_to_update:
    SalaryComponent.objects.filter(
        tenant=tenant,
        code=item['code']
    ).update(display_order=item['order'])
```

### Expected Outcome
- display_order field added to SalaryComponent
- Automatic ordering in queries
- Professional payslip presentation
- Flexible component sequencing

### Verification Checklist
- [ ] display_order field added to model
- [ ] Field type is IntegerField
- [ ] Default value set to 100
- [ ] Help text provided
- [ ] Field is required (no null)
- [ ] Meta.ordering updated to use display_order
- [ ] Model docstring updated
- [ ] Ordering conventions documented

---

## Task 14: Add Description Field

### Overview
Add the description text field for internal notes and documentation about each salary component. This field helps administrators understand component purpose, usage guidelines, calculation rules, and regulatory requirements without affecting payslip display or calculations.

### Dependencies
- Task 13: Add Display Order

### Instructions

1. **Open salary_component.py model file**
   - Continue in `apps/payroll/models/salary_component.py`
   - Locate SalaryComponent model class

2. **Add description field**
   - TextField
   - Optional (blank=True, null=True)
   - Place after display_order field
   - Internal documentation only

3. **Add field help text**
   - Set help_text explaining purpose
   - Example: "Internal notes about component purpose, calculation rules, and usage guidelines"
   - Clarifies field purpose

4. **Update model docstring**
   - Add description to field list
   - Explain usage for documentation
   - Note that it's not displayed to employees

### description Field Specification

```python
description = models.TextField(
    blank=True,
    null=True,
    help_text="Internal notes about component purpose, calculation rules, and usage guidelines"
)
```

### Field Details

| Property | Value | Purpose |
|----------|-------|---------|
| Type | TextField | Unlimited text |
| Required | No | Optional documentation |
| Nullable | Yes | Can be empty |
| Displayed | No | Internal use only |
| Help Text | Purpose explanation | User guidance |

### Description Field Use Cases

```
Documentation Purposes:
═══════════════════════
✓ Component purpose and rationale
✓ Calculation rules and formulas
✓ Regulatory requirements
✓ Policy references
✓ Usage guidelines
✓ Special conditions
✓ Historical context
✓ Related components
```

### Component Examples with Descriptions

#### Example 1: Basic Salary
```python
{
    'name': 'Basic Salary',
    'code': 'BASIC',
    'description': '''
Core monthly salary component. Used as the base for calculating
EPF (8% employee + 12% employer), ETF (3% employer), and overtime rates.
Must be defined for all employees. Forms EPF base along with eligible
fixed allowances. Reference: EPF Act No. 15 of 1958.
    '''
}
```

#### Example 2: EPF Employee 8%
```python
{
    'name': 'EPF Employee 8%',
    'code': 'EPF_EMP',
    'description': '''
Employee Provident Fund contribution (8% of EPF base salary).
Mandatory for all employees earning above EPF threshold.
Calculated as 8% of: Basic Salary + EPF-eligible allowances.
Deducted from employee gross salary.
Legal basis: EPF Act No. 15 of 1958, as amended.
EPF base excludes: bonuses, irregular payments, reimbursements.
    '''
}
```

#### Example 3: Medical Allowance
```python
{
    'name': 'Medical Allowance',
    'code': 'MEDICAL',
    'description': '''
Monthly medical allowance for healthcare expenses.
Tax Status: Exempt up to reasonable limits (verify current IRD guidelines).
EPF Status: Not included in EPF base (expense reimbursement).
Typically ranges from LKR 2,000 to 5,000 depending on position.
Policy: Flat monthly amount, no receipts required.
Not pro-rated for no-pay days.
    '''
}
```

#### Example 4: Overtime Pay
```python
{
    'name': 'Overtime Pay',
    'code': 'OVERTIME',
    'description': '''
Compensation for work beyond standard hours (8 hours/day, 45 hours/week).
Calculation: (Basic Salary / 30 / 8) × hours × multiplier
Multipliers:
  - Standard OT (Mon-Sat): 1.5x
  - Sunday/Public Holiday: 2.0x
  - Night shift (8 PM - 6 AM): Additional 0.5x
Overtime hours must be approved by supervisor.
Subject to PAYE tax and included in EPF base.
Reference: Shop and Office Employees Act.
    '''
}
```

#### Example 5: PAYE Tax
```python
{
    'name': 'PAYE Tax',
    'code': 'PAYE',
    'description': '''
Pay As You Earn income tax deduction.
Calculated on monthly taxable income using progressive rates.
Current annual tax-free threshold: LKR 1,200,000 (LKR 100,000/month).
Progressive rates apply to income above threshold.
Taxable income includes: Basic, most allowances, overtime, bonuses.
Excludes: Medical allowance (up to limit), reimbursements.
Tax calculation uses Inland Revenue Act No. 24 of 2017.
Monthly deduction reconciled annually via tax returns.
    '''
}
```

#### Example 6: Transport Allowance
```python
{
    'name': 'Transport Allowance',
    'code': 'TRANSPORT',
    'description': '''
Fixed monthly allowance for employee transportation costs.
Typically varies by position and location:
  - Entry level: LKR 3,000 - 5,000
  - Mid level: LKR 5,000 - 8,000
  - Senior level: LKR 8,000 - 15,000
Tax Status: Fully taxable as per current IRD guidelines.
EPF Status: Included in EPF base (fixed allowance).
Pro-rated during no-pay situations.
Policy: Flat amount regardless of actual transport costs.
    '''
}
```

### Description Content Guidelines

```
What to Include:
════════════════
✓ Component purpose
✓ Calculation method
✓ Legal/regulatory basis
✓ Tax implications
✓ EPF/ETF treatment
✓ Typical amounts or ranges
✓ Eligibility criteria
✓ Pro-ration rules
✓ Related components
✓ Policy references
✓ Special conditions
✓ Historical context

What to Avoid:
══════════════
✗ Employee personal data
✗ Sensitive financial details
✗ Outdated information
✗ Ambiguous instructions
✗ Informal language
✗ Unnecessary jargon
```

### Admin Interface Usage

```
Django Admin Component Form:
════════════════════════════

Component: EPF Employee 8%
─────────────────────────────

Name: EPF Employee 8%
Code: EPF_EMP
Type: DEDUCTION
Category: STATUTORY
Calculation Type: PERCENTAGE_OF_BASIC
Percentage: 8.00

Description:
┌──────────────────────────────────────┐
│ Employee Provident Fund contribution │
│ (8% of EPF base salary).             │
│                                      │
│ Mandatory for all employees.        │
│ Legal basis: EPF Act No. 15 of 1958.│
│                                      │
│ EPF base includes:                   │
│ • Basic Salary                       │
│ • Fixed Allowances (Transport, etc.) │
│                                      │
│ EPF base excludes:                   │
│ • Bonuses                            │
│ • Reimbursements                     │
└──────────────────────────────────────┘

Taxable: □ No
EPF Applicable: □ No (this IS the EPF deduction)
Fixed: ☑ Yes
Active: ☑ Yes
Display Order: 100

[Save] [Save and continue] [Save and add another]
```

### Documentation Templates

#### Template 1: Statutory Component
```
[Component Name] - [Statutory Basis]

Purpose: [Brief purpose statement]

Calculation:
- Method: [Calculation method]
- Base: [What it's calculated on]
- Rate: [Percentage or amount]

Legal Basis:
- Act/Regulation: [Legal reference]
- Effective Date: [When it applies]

Requirements:
- Mandatory for: [Who must have it]
- Exemptions: [Any exemptions]

Related Components:
- [List related components]
```

#### Template 2: Allowance Component
```
[Allowance Name]

Purpose: [What the allowance covers]

Typical Amounts:
- Entry Level: [Range]
- Mid Level: [Range]
- Senior Level: [Range]

Tax Treatment:
- Taxable: [Yes/No/Conditional]
- Conditions: [Any conditions]

EPF Treatment:
- EPF Base: [Yes/No]
- Reason: [Why included/excluded]

Policy Notes:
- [Relevant policy points]
- [Eligibility criteria]
- [Pro-ration rules]
```

### Expected Outcome
- description field added to SalaryComponent
- Support for internal documentation
- Better component understanding
- Knowledge preservation

### Verification Checklist
- [ ] description field added to model
- [ ] Field type is TextField
- [ ] Field is optional (blank=True, null=True)
- [ ] Help text provided
- [ ] Model docstring updated
- [ ] Usage examples documented
- [ ] Content guidelines provided

---

## Task 15: Create Component Indexes

### Overview
Add database indexes to the SalaryComponent model to optimize query performance. Indexes on frequently queried field combinations (code, category, component_type, is_active) significantly improve retrieval speed for component lookups, filtering, and reporting.

### Dependencies
- Task 14: Add Description Field
- All SalaryComponent fields completed

### Instructions

1. **Open salary_component.py model file**
   - Continue in `apps/payroll/models/salary_component.py`
   - Locate SalaryComponent Meta class

2. **Add indexes list to Meta**
   - Create indexes attribute in Meta class
   - Use models.Index for each index
   - Name indexes descriptively

3. **Add code lookup index**
   - Index on: ['tenant', 'code']
   - Purpose: Fast component lookup by code
   - Name: 'payroll_comp_tenant_code_idx'

4. **Add category filter index**
   - Index on: ['tenant', 'category']
   - Purpose: Filter components by category
   - Name: 'payroll_comp_tenant_cat_idx'

5. **Add type filter index**
   - Index on: ['tenant', 'component_type']
   - Purpose: Filter by EARNING/DEDUCTION/CONTRIBUTION
   - Name: 'payroll_comp_tenant_type_idx'

6. **Add active components index**
   - Index on: ['tenant', 'is_active', 'display_order']
   - Purpose: List active components in order
   - Name: 'payroll_comp_tenant_active_ord_idx'

7. **Add combined category-type index**
   - Index on: ['tenant', 'category', 'component_type', 'is_active']
   - Purpose: Complex filtering queries
   - Name: 'payroll_comp_tenant_cat_type_act_idx'

8. **Update model docstring**
   - Document index purposes
   - List indexed field combinations
   - Note performance benefits

### Index Specifications

```python
class Meta:
    verbose_name = "Salary Component"
    verbose_name_plural = "Salary Components"
    ordering = ['display_order', 'name']
    unique_together = [['tenant', 'code']]
    db_table = 'payroll_salary_components'
    
    indexes = [
        # Fast component lookup by code
        models.Index(
            fields=['tenant', 'code'],
            name='payroll_comp_tenant_code_idx'
        ),
        
        # Filter components by category
        models.Index(
            fields=['tenant', 'category'],
            name='payroll_comp_tenant_cat_idx'
        ),
        
        # Filter by component type
        models.Index(
            fields=['tenant', 'component_type'],
            name='payroll_comp_tenant_type_idx'
        ),
        
        # List active components in order
        models.Index(
            fields=['tenant', 'is_active', 'display_order'],
            name='payroll_comp_tenant_active_ord_idx'
        ),
        
        # Complex filtering (category + type + active)
        models.Index(
            fields=['tenant', 'category', 'component_type', 'is_active'],
            name='payroll_comp_tenant_cat_type_act_idx'
        ),
    ]
```

### Index Purpose and Benefits

```
┌─────────────────────────────────────────────────────────┐
│  Index Name                  │ Fields                   │
├─────────────────────────────────────────────────────────┤
│  payroll_comp_tenant_code    │ tenant, code             │
│  Purpose: Fast lookup by code                           │
│  Query: Get component "BASIC" for tenant                │
│  Speed: O(log n) vs O(n)                                │
├─────────────────────────────────────────────────────────┤
│  payroll_comp_tenant_cat     │ tenant, category         │
│  Purpose: Filter by category                            │
│  Query: Get all ALLOWANCE components                    │
│  Speed: Index scan vs full table scan                   │
├─────────────────────────────────────────────────────────┤
│  payroll_comp_tenant_type    │ tenant, component_type   │
│  Purpose: Filter by type                                │
│  Query: Get all EARNING components                      │
│  Speed: Index scan vs full table scan                   │
├─────────────────────────────────────────────────────────┤
│  payroll_comp_tenant_active  │ tenant, is_active,       │
│                              │ display_order            │
│  Purpose: List active ordered                           │
│  Query: Get active components for dropdown              │
│  Speed: Index-only scan (no table access)               │
├─────────────────────────────────────────────────────────┤
│  payroll_comp_tenant_cat_... │ tenant, category,        │
│                              │ component_type,is_active │
│  Purpose: Complex filtering                             │
│  Query: Get active EARNING ALLOWANCE components         │
│  Speed: Multi-column index efficiency                   │
└─────────────────────────────────────────────────────────┘
```

### Queries Optimized by Indexes

#### Query 1: Component Lookup by Code (Index 1)
```python
# Uses: payroll_comp_tenant_code_idx
component = SalaryComponent.objects.get(
    tenant=tenant,
    code='BASIC'
)

# Without index: Full table scan (slow)
# With index: Direct lookup (fast)
```

#### Query 2: Filter by Category (Index 2)
```python
# Uses: payroll_comp_tenant_cat_idx
allowances = SalaryComponent.objects.filter(
    tenant=tenant,
    category=ComponentCategory.ALLOWANCE
)

# Without index: Scan all rows (slow)
# With index: Index scan only matching rows (fast)
```

#### Query 3: Filter by Type (Index 3)
```python
# Uses: payroll_comp_tenant_type_idx
earnings = SalaryComponent.objects.filter(
    tenant=tenant,
    component_type=ComponentType.EARNING
)

# Without index: Full table scan
# With index: Index scan
```

#### Query 4: Active Components for Dropdown (Index 4)
```python
# Uses: payroll_comp_tenant_active_ord_idx
active_components = SalaryComponent.objects.filter(
    tenant=tenant,
    is_active=True
).order_by('display_order')

# Without index: Filter + sort (slow)
# With index: Pre-sorted in index (fast)
```

#### Query 5: Complex Filter (Index 5)
```python
# Uses: payroll_comp_tenant_cat_type_act_idx
active_earning_allowances = SalaryComponent.objects.filter(
    tenant=tenant,
    category=ComponentCategory.ALLOWANCE,
    component_type=ComponentType.EARNING,
    is_active=True
)

# Without index: Multiple filters, slow
# With index: Compound index, fast
```

### Index Performance Metrics

```
Example Dataset: 10,000 components across 100 tenants
                 (100 components per tenant)

Query: Get component by code
─────────────────────────────
Without Index: 10,000 row scans → ~100ms
With Index: Direct lookup → ~1ms
Speed Improvement: 100x faster

Query: Filter active earnings
─────────────────────────────
Without Index: Full scan + filter → ~80ms
With Index: Index scan → ~5ms
Speed Improvement: 16x faster

Query: Dropdown list (active, ordered)
───────────────────────────────────────
Without Index: Scan + filter + sort → ~120ms
With Index: Index-only scan → ~3ms
Speed Improvement: 40x faster
```

### Index Size and Maintenance

```
Index Storage Overhead:
═══════════════════════
Each index adds:
• Storage space: ~5-10% of table size per index
• Insert time: Slight increase (negligible)
• Update time: Slight increase (negligible)
• Query time: MAJOR decrease

For 100 components per tenant:
• Table size: ~50 KB
• Index total size: ~15 KB (all 5 indexes)
• Total overhead: 30% (worth it for performance)

Maintenance:
════════════
• PostgreSQL auto-maintains indexes
• No manual maintenance required
• Indexes rebuild on VACUUM (automatic)
```

### Multi-Tenant Index Optimization

```
Why tenant is first in all indexes:
════════════════════════════════════

Index: ['tenant', 'code']
✓ Tenant isolation enforced
✓ Fast per-tenant queries
✓ Index partitioning possible

Bad: ['code', 'tenant']
✗ Cross-tenant lookup (security risk)
✗ Slower tenant filtering
✗ Less efficient

Result: tenant-first ensures data isolation
        and optimal query performance
```

### Database Query Plan (PostgreSQL)

```sql
-- Query: Get component by code
SELECT * FROM payroll_salary_components
WHERE tenant_id = 1 AND code = 'BASIC';

-- WITHOUT INDEX:
Seq Scan on payroll_salary_components
  Filter: (tenant_id = 1 AND code = 'BASIC')
  Rows: 10000 → 1
  Time: 95ms

-- WITH INDEX (payroll_comp_tenant_code_idx):
Index Scan using payroll_comp_tenant_code_idx
  Index Cond: (tenant_id = 1 AND code = 'BASIC')
  Rows: 1
  Time: 0.8ms
```

### Expected Outcome
- Five strategic indexes created
- Significant query performance improvement
- Optimized component lookups and filtering
- Better user experience (fast dropdowns)

### Verification Checklist
- [ ] Meta.indexes list created
- [ ] Code lookup index added
- [ ] Category filter index added
- [ ] Type filter index added
- [ ] Active+order index added
- [ ] Combined category-type-active index added
- [ ] All indexes have descriptive names
- [ ] tenant field is first in all indexes
- [ ] Model docstring updated
- [ ] Index purposes documented

---

## Task 16: Run SalaryComponent Migrations

### Overview
Generate and apply Django database migrations for the SalaryComponent model. Migrations create the database table, fields, indexes, and constraints defined in the model, making the payroll component structure operational in the database.

### Dependencies
- Task 15: Create Component Indexes
- All SalaryComponent model fields and Meta options completed
- Django migrations framework configured
- Database connection established

### Instructions

1. **Open terminal in project root**
   - Ensure virtual environment is activated
   - Verify Django project is accessible
   - Check database configuration in settings

2. **Generate migrations for payroll app**
   - Run: `python manage.py makemigrations payroll`
   - Django creates migration file in `apps/payroll/migrations/`
   - Migration file named like: `0001_salary_component.py`
   - Review migration file for accuracy

3. **Verify migration file**
   - Open generated migration file
   - Check model name: SalaryComponent
   - Verify all fields present
   - Confirm indexes created
   - Check unique_together constraint
   - Review field types and options

4. **Apply migrations to database**
   - Run: `python manage.py migrate payroll`
   - Django creates `payroll_salary_components` table
   - All fields, indexes, constraints created
   - Migration recorded in django_migrations table

5. **Verify database table**
   - Connect to database
   - Check table exists: `payroll_salary_components`
   - Verify columns present
   - Check indexes created
   - Confirm constraints active

6. **Test model operations**
   - Open Django shell: `python manage.py shell_plus`
   - Import SalaryComponent
   - Test model creation (see verification section)
   - Verify save operations work

### Migration Commands

```bash
# Step 1: Generate migration file
python manage.py makemigrations payroll

# Expected output:
# Migrations for 'payroll':
#   apps/payroll/migrations/0001_salary_component.py
#     - Create model SalaryComponent

# Step 2: Show migration SQL (optional, for review)
python manage.py sqlmigrate payroll 0001

# Step 3: Apply migrations
python manage.py migrate payroll

# Expected output:
# Operations to perform:
#   Apply all migrations: payroll
# Running migrations:
#   Applying payroll.0001_salary_component... OK

# Step 4: Verify migrations applied
python manage.py showmigrations payroll

# Expected output:
# payroll
#  [X] 0001_salary_component
```

### Generated Migration File Structure

```python
# apps/payroll/migrations/0001_salary_component.py

from django.db import migrations, models
import django.db.models.deletion
from decimal import Decimal


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('tenants', '0001_initial'),  # Tenant model dependency
        ('auth', '0001_initial'),     # User model dependency
    ]

    operations = [
        migrations.CreateModel(
            name='SalaryComponent',
            fields=[
                ('id', models.BigAutoField(
                    auto_created=True,
                    primary_key=True,
                    serialize=False,
                    verbose_name='ID'
                )),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('name', models.CharField(max_length=200)),
                ('code', models.CharField(max_length=50)),
                ('component_type', models.CharField(
                    choices=[
                        ('EARNING', 'Earning'),
                        ('DEDUCTION', 'Deduction'),
                        ('EMPLOYER_CONTRIBUTION', 'Employer Contribution')
                    ],
                    max_length=30
                )),
                ('category', models.CharField(
                    choices=[
                        ('BASIC', 'Basic Salary'),
                        ('ALLOWANCE', 'Allowance'),
                        ('BONUS', 'Bonus'),
                        ('STATUTORY', 'Statutory'),
                        ('LOAN', 'Loan'),
                        ('TAX', 'Tax'),
                        ('OTHER', 'Other')
                    ],
                    default='OTHER',
                    max_length=20
                )),
                ('calculation_type', models.CharField(
                    choices=[
                        ('FIXED', 'Fixed Amount'),
                        ('PERCENTAGE_OF_BASIC', 'Percentage of Basic Salary'),
                        ('PERCENTAGE_OF_GROSS', 'Percentage of Gross Salary'),
                        ('FORMULA', 'Formula-based')
                    ],
                    default='FIXED',
                    max_length=30
                )),
                ('default_value', models.DecimalField(
                    blank=True,
                    decimal_places=2,
                    default=Decimal('0.00'),
                    max_digits=15,
                    null=True
                )),
                ('percentage', models.DecimalField(
                    blank=True,
                    decimal_places=2,
                    default=Decimal('0.00'),
                    max_digits=5,
                    null=True
                )),
                ('formula', models.TextField(blank=True, null=True)),
                ('is_taxable', models.BooleanField(default=True)),
                ('is_epf_applicable', models.BooleanField(default=False)),
                ('is_fixed', models.BooleanField(default=True)),
                ('is_active', models.BooleanField(default=True)),
                ('display_order', models.IntegerField(default=100)),
                ('description', models.TextField(blank=True, null=True)),
                ('tenant', models.ForeignKey(
                    on_delete=django.db.models.deletion.CASCADE,
                    to='tenants.tenant'
                )),
                ('created_by', models.ForeignKey(
                    blank=True,
                    null=True,
                    on_delete=django.db.models.deletion.SET_NULL,
                    related_name='%(class)s_created',
                    to='auth.user'
                )),
                ('updated_by', models.ForeignKey(
                    blank=True,
                    null=True,
                    on_delete=django.db.models.deletion.SET_NULL,
                    related_name='%(class)s_updated',
                    to='auth.user'
                )),
            ],
            options={
                'verbose_name': 'Salary Component',
                'verbose_name_plural': 'Salary Components',
                'db_table': 'payroll_salary_components',
                'ordering': ['display_order', 'name'],
                'unique_together': {('tenant', 'code')},
            },
        ),
        
        # Create indexes
        migrations.AddIndex(
            model_name='salarycomponent',
            index=models.Index(
                fields=['tenant', 'code'],
                name='payroll_comp_tenant_code_idx'
            ),
        ),
        migrations.AddIndex(
            model_name='salarycomponent',
            index=models.Index(
                fields=['tenant', 'category'],
                name='payroll_comp_tenant_cat_idx'
            ),
        ),
        migrations.AddIndex(
            model_name='salarycomponent',
            index=models.Index(
                fields=['tenant', 'component_type'],
                name='payroll_comp_tenant_type_idx'
            ),
        ),
        migrations.AddIndex(
            model_name='salarycomponent',
            index=models.Index(
                fields=['tenant', 'is_active', 'display_order'],
                name='payroll_comp_tenant_active_ord_idx'
            ),
        ),
        migrations.AddIndex(
            model_name='salarycomponent',
            index=models.Index(
                fields=['tenant', 'category', 'component_type', 'is_active'],
                name='payroll_comp_tenant_cat_type_act_idx'
            ),
        ),
    ]
```

### Database Table Structure (PostgreSQL)

```sql
-- Table: payroll_salary_components
CREATE TABLE payroll_salary_components (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL REFERENCES tenants_tenant(id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL,
    code VARCHAR(50) NOT NULL,
    component_type VARCHAR(30) NOT NULL,
    category VARCHAR(20) NOT NULL DEFAULT 'OTHER',
    calculation_type VARCHAR(30) NOT NULL DEFAULT 'FIXED',
    default_value NUMERIC(15,2),
    percentage NUMERIC(5,2),
    formula TEXT,
    is_taxable BOOLEAN NOT NULL DEFAULT TRUE,
    is_epf_applicable BOOLEAN NOT NULL DEFAULT FALSE,
    is_fixed BOOLEAN NOT NULL DEFAULT TRUE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    display_order INTEGER NOT NULL DEFAULT 100,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_by_id BIGINT REFERENCES auth_user(id) ON DELETE SET NULL,
    updated_by_id BIGINT REFERENCES auth_user(id) ON DELETE SET NULL,
    
    UNIQUE (tenant_id, code)
);

-- Indexes
CREATE INDEX payroll_comp_tenant_code_idx 
ON payroll_salary_components(tenant_id, code);

CREATE INDEX payroll_comp_tenant_cat_idx 
ON payroll_salary_components(tenant_id, category);

CREATE INDEX payroll_comp_tenant_type_idx 
ON payroll_salary_components(tenant_id, component_type);

CREATE INDEX payroll_comp_tenant_active_ord_idx 
ON payroll_salary_components(tenant_id, is_active, display_order);

CREATE INDEX payroll_comp_tenant_cat_type_act_idx 
ON payroll_salary_components(tenant_id, category, component_type, is_active);
```

### Verification Tests

```python
# Open Django shell
python manage.py shell_plus

# Test 1: Import model
from apps.payroll.models import SalaryComponent
from apps.payroll.constants import ComponentType, CalculationType, ComponentCategory
from apps.tenants.models import Tenant
from decimal import Decimal

# Test 2: Get a tenant (or create one)
tenant = Tenant.objects.first()

# Test 3: Create a basic salary component
basic = SalaryComponent.objects.create(
    tenant=tenant,
    name='Basic Salary',
    code='BASIC',
    component_type=ComponentType.EARNING,
    category=ComponentCategory.BASIC,
    calculation_type=CalculationType.FIXED,
    default_value=Decimal('50000.00'),
    is_taxable=True,
    is_epf_applicable=True,
    is_fixed=True,
    is_active=True,
    display_order=10,
    description='Core monthly salary component'
)

print(f"Created: {basic}")
# Output: Created: Basic Salary (BASIC)

# Test 4: Query by code (uses index)
component = SalaryComponent.objects.get(tenant=tenant, code='BASIC')
print(f"Found: {component.name}")
# Output: Found: Basic Salary

# Test 5: Filter by category (uses index)
allowances = SalaryComponent.objects.filter(
    tenant=tenant,
    category=ComponentCategory.ALLOWANCE
)
print(f"Allowances: {allowances.count()}")
# Output: Allowances: 0 (none created yet)

# Test 6: Test unique constraint
try:
    duplicate = SalaryComponent.objects.create(
        tenant=tenant,
        name='Duplicate Basic',
        code='BASIC',  # Same code
        component_type=ComponentType.EARNING
    )
except Exception as e:
    print(f"Unique constraint working: {type(e).__name__}")
# Output: Unique constraint working: IntegrityError

# Test 7: Verify timestamps
print(f"Created at: {basic.created_at}")
print(f"Updated at: {basic.updated_at}")
# Output: Created at: 2026-01-24 10:30:00+00:00
#         Updated at: 2026-01-24 10:30:00+00:00

# Test 8: Test ordering
basic.display_order = 10
basic.save()
# Should appear first in ordered queries

print("All tests passed!")
```

### Common Migration Issues

```
Issue 1: Migration file not generated
══════════════════════════════════════
Cause: Model not in migrations scope
Solution: Ensure app in INSTALLED_APPS or TENANT_APPS
Command: Check settings.py

Issue 2: Foreign key dependency errors
═══════════════════════════════════════
Cause: Referenced models not migrated
Solution: Migrate dependencies first
Command: python manage.py migrate tenants
         python manage.py migrate payroll

Issue 3: Unique constraint violation
═════════════════════════════════════
Cause: Existing data conflicts with unique_together
Solution: Clean conflicting data before migration
         Or modify migration to handle conflicts

Issue 4: Database connection error
═══════════════════════════════════
Cause: Database not accessible
Solution: Check DATABASE settings
         Verify database service running
         Test connection: python manage.py dbshell
```

### Expected Outcome
- Migration file generated successfully
- Database table created with all fields
- Indexes and constraints applied
- Model operations functional
- Ready for seed data (Tasks 17-18)

### Verification Checklist
- [ ] Migration file generated (0001_salary_component.py)
- [ ] Migration file reviewed and correct
- [ ] Migrations applied successfully
- [ ] Table exists in database
- [ ] All fields present in table
- [ ] Indexes created
- [ ] Unique constraint active
- [ ] Model CRUD operations tested
- [ ] No migration errors
- [ ] Ready for seed data

---

## Task 17: Create Statutory Components Seed

### Overview
Create a Django management command to seed statutory salary components required for Sri Lankan payroll compliance. This command pre-populates EPF (Employee Provident Fund) and ETF (Employees' Trust Fund) components with correct rates and configurations, ensuring immediate payroll system usability.

### Dependencies
- Task 16: Run SalaryComponent Migrations
- Understanding of Sri Lankan statutory requirements
- Django management commands framework

### Instructions

1. **Create management command file**
   - Create file at: `apps/payroll/management/commands/seed_components.py`
   - Import necessary modules

2. **Import required classes**
   - Import BaseCommand from django.core.management.base
   - Import SalaryComponent model
   - Import constants (ComponentType, CalculationType, ComponentCategory)
   - Import Tenant model
   - Import Decimal for percentages

3. **Define Command class**
   - Inherit from BaseCommand
   - Add help text explaining command purpose
   - Include Sri Lankan statutory context

4. **Add command arguments**
   - Optional --tenant argument (specific tenant)
   - If no tenant specified, seed for all tenants
   - Add --overwrite flag to replace existing

5. **Implement handle method**
   - Get tenant(s) to seed
   - For each tenant, create statutory components
   - Check if component exists (by code)
   - Create or update based on --overwrite flag
   - Print progress messages

6. **Define EPF Employee component**
   - Code: EPF_EMP
   - Name: EPF Employee 8%
   - Type: DEDUCTION
   - Category: STATUTORY
   - Calculation: PERCENTAGE_OF_BASIC
   - Percentage: 8.00%

7. **Define EPF Employer component**
   - Code: EPF_EMP_CONTRIB
   - Name: EPF Employer 12%
   - Type: EMPLOYER_CONTRIBUTION
   - Category: STATUTORY
   - Calculation: PERCENTAGE_OF_BASIC
   - Percentage: 12.00%

8. **Define ETF component**
   - Code: ETF
   - Name: ETF 3%
   - Type: EMPLOYER_CONTRIBUTION
   - Category: STATUTORY
   - Calculation: PERCENTAGE_OF_BASIC
   - Percentage: 3.00%

9. **Add component configurations**
   - Set is_taxable (False for deductions/contributions)
   - Set is_epf_applicable (False - these ARE the EPF components)
   - Set is_fixed (True)
   - Set is_active (True)
   - Set display_order (100, 200, 210)
   - Add descriptions with legal context

10. **Add success/error handling**
    - Try-except blocks for each component
    - Print success messages
    - Log errors with details
    - Return summary at end

### Management Command Structure

```python
# apps/payroll/management/commands/seed_components.py

from django.core.management.base import BaseCommand, CommandError
from django.db import transaction
from decimal import Decimal

from apps.payroll.models import SalaryComponent
from apps.payroll.constants import ComponentType, CalculationType, ComponentCategory
from apps.tenants.models import Tenant


class Command(BaseCommand):
    help = 'Seed statutory salary components (EPF, ETF) for Sri Lankan payroll compliance'

    def add_arguments(self, parser):
        parser.add_argument(
            '--tenant',
            type=int,
            help='Tenant ID to seed components for (if not specified, seeds for all tenants)'
        )
        parser.add_argument(
            '--overwrite',
            action='store_true',
            help='Overwrite existing components with same code'
        )

    def handle(self, *args, **options):
        tenant_id = options.get('tenant')
        overwrite = options.get('overwrite', False)

        # Get tenants to seed
        if tenant_id:
            try:
                tenants = [Tenant.objects.get(id=tenant_id)]
                self.stdout.write(f"Seeding for tenant ID {tenant_id}...")
            except Tenant.DoesNotExist:
                raise CommandError(f"Tenant with ID {tenant_id} does not exist")
        else:
            tenants = Tenant.objects.all()
            self.stdout.write(f"Seeding for all {tenants.count()} tenants...")

        # Component definitions
        statutory_components = [
            {
                'code': 'EPF_EMP',
                'name': 'EPF Employee 8%',
                'component_type': ComponentType.DEDUCTION,
                'category': ComponentCategory.STATUTORY,
                'calculation_type': CalculationType.PERCENTAGE_OF_BASIC,
                'percentage': Decimal('8.00'),
                'is_taxable': False,
                'is_epf_applicable': False,
                'is_fixed': True,
                'is_active': True,
                'display_order': 100,
                'description': '''Employee Provident Fund contribution (8% of EPF base salary).
Mandatory for all employees earning above EPF threshold.
Calculated as 8% of: Basic Salary + EPF-eligible allowances.
Deducted from employee gross salary.
Legal basis: EPF Act No. 15 of 1958, as amended.'''
            },
            {
                'code': 'EPF_EMP_CONTRIB',
                'name': 'EPF Employer 12%',
                'component_type': ComponentType.EMPLOYER_CONTRIBUTION,
                'category': ComponentCategory.STATUTORY,
                'calculation_type': CalculationType.PERCENTAGE_OF_BASIC,
                'percentage': Decimal('12.00'),
                'is_taxable': False,
                'is_epf_applicable': False,
                'is_fixed': True,
                'is_active': True,
                'display_order': 200,
                'description': '''Employer Provident Fund contribution (12% of EPF base salary).
Mandatory employer contribution for all eligible employees.
Calculated as 12% of: Basic Salary + EPF-eligible allowances.
Employer cost, not deducted from employee salary.
Legal basis: EPF Act No. 15 of 1958, as amended.'''
            },
            {
                'code': 'ETF',
                'name': 'ETF 3%',
                'component_type': ComponentType.EMPLOYER_CONTRIBUTION,
                'category': ComponentCategory.STATUTORY,
                'calculation_type': CalculationType.PERCENTAGE_OF_BASIC,
                'percentage': Decimal('3.00'),
                'is_taxable': False,
                'is_epf_applicable': False,
                'is_fixed': True,
                'is_active': True,
                'display_order': 210,
                'description': '''Employees' Trust Fund contribution (3% of EPF base salary).
Mandatory employer contribution for all eligible employees.
Calculated as 3% of same base as EPF (Basic + EPF-eligible allowances).
Employer cost, not deducted from employee salary.
Legal basis: ETF Act No. 46 of 1980, as amended.'''
            },
        ]

        # Seed components for each tenant
        total_created = 0
        total_updated = 0
        total_skipped = 0

        for tenant in tenants:
            self.stdout.write(f"\n  Tenant: {tenant.name}")
            
            for comp_data in statutory_components:
                code = comp_data['code']
                
                try:
                    with transaction.atomic():
                        # Check if component exists
                        existing = SalaryComponent.objects.filter(
                            tenant=tenant,
                            code=code
                        ).first()
                        
                        if existing:
                            if overwrite:
                                # Update existing component
                                for key, value in comp_data.items():
                                    setattr(existing, key, value)
                                existing.save()
                                self.stdout.write(
                                    self.style.SUCCESS(
                                        f"    ✓ Updated: {comp_data['name']} ({code})"
                                    )
                                )
                                total_updated += 1
                            else:
                                self.stdout.write(
                                    self.style.WARNING(
                                        f"    ⊘ Skipped (exists): {comp_data['name']} ({code})"
                                    )
                                )
                                total_skipped += 1
                        else:
                            # Create new component
                            SalaryComponent.objects.create(
                                tenant=tenant,
                                **comp_data
                            )
                            self.stdout.write(
                                self.style.SUCCESS(
                                    f"    ✓ Created: {comp_data['name']} ({code})"
                                )
                            )
                            total_created += 1
                            
                except Exception as e:
                    self.stdout.write(
                        self.style.ERROR(
                            f"    ✗ Error creating {code}: {str(e)}"
                        )
                    )

        # Summary
        self.stdout.write("\n" + "="*60)
        self.stdout.write(self.style.SUCCESS(f"Summary:"))
        self.stdout.write(f"  Created: {total_created}")
        self.stdout.write(f"  Updated: {total_updated}")
        self.stdout.write(f"  Skipped: {total_skipped}")
        self.stdout.write("="*60 + "\n")
```

### Statutory Component Details

```
┌────────────────────────────────────────────────────────────┐
│  Statutory Components for Sri Lanka                        │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  EPF Employee 8%:                                          │
│    Code: EPF_EMP                                           │
│    Type: DEDUCTION                                         │
│    Calculation: 8% of EPF base                             │
│    Deducted from: Employee salary                          │
│    Legal basis: EPF Act No. 15 of 1958                     │
│                                                            │
│  EPF Employer 12%:                                         │
│    Code: EPF_EMP_CONTRIB                                   │
│    Type: EMPLOYER_CONTRIBUTION                             │
│    Calculation: 12% of EPF base                            │
│    Paid by: Employer (not deducted)                        │
│    Legal basis: EPF Act No. 15 of 1958                     │
│                                                            │
│  ETF 3%:                                                   │
│    Code: ETF                                               │
│    Type: EMPLOYER_CONTRIBUTION                             │
│    Calculation: 3% of EPF base                             │
│    Paid by: Employer (not deducted)                        │
│    Legal basis: ETF Act No. 46 of 1980                     │
│                                                            │
│  Total statutory cost: 23% of EPF base                     │
│    (8% employee + 12% employer + 3% ETF)                   │
│    Employee receives: 100% + 8% into EPF account           │
│    Employer pays: 100% + 15% (EPF 12% + ETF 3%)            │
└────────────────────────────────────────────────────────────┘
```

### Running the Command

```bash
# Seed for all tenants
python manage.py seed_components

# Seed for specific tenant
python manage.py seed_components --tenant 1

# Overwrite existing components
python manage.py seed_components --overwrite

# Seed specific tenant with overwrite
python manage.py seed_components --tenant 1 --overwrite

# Get help
python manage.py seed_components --help
```

### Expected Output

```
Seeding for all 3 tenants...

  Tenant: LankaCommerce Pvt Ltd
    ✓ Created: EPF Employee 8% (EPF_EMP)
    ✓ Created: EPF Employer 12% (EPF_EMP_CONTRIB)
    ✓ Created: ETF 3% (ETF)

  Tenant: QuickMart Supermarket
    ✓ Created: EPF Employee 8% (EPF_EMP)
    ✓ Created: EPF Employer 12% (EPF_EMP_CONTRIB)
    ✓ Created: ETF 3% (ETF)

  Tenant: TechGadgets LK
    ✓ Created: EPF Employee 8% (EPF_EMP)
    ✓ Created: EPF Employer 12% (EPF_EMP_CONTRIB)
    ✓ Created: ETF 3% (ETF)

============================================================
Summary:
  Created: 9
  Updated: 0
  Skipped: 0
============================================================
```

### Expected Outcome
- Management command created successfully
- Statutory components seeded for all tenants
- EPF and ETF components available immediately
- Sri Lankan payroll compliance enabled

### Verification Checklist
- [ ] seed_components.py file created
- [ ] Command class defined
- [ ] Tenant argument implemented
- [ ] Overwrite flag implemented
- [ ] EPF Employee component defined
- [ ] EPF Employer component defined
- [ ] ETF component defined
- [ ] All component attributes correct
- [ ] Descriptions include legal basis
- [ ] Success/error handling implemented
- [ ] Command executes without errors
- [ ] Components visible in database

---

## Task 18: Create Common Allowances Seed

### Overview
Extend the seed_components management command to include common allowances used in Sri Lankan businesses. These pre-configured components (Transport, Medical, Housing, Meal allowances) provide starting templates that tenants can customize or use directly, accelerating payroll setup.

### Dependencies
- Task 17: Create Statutory Components Seed
- seed_components.py management command exists

### Instructions

1. **Open seed_components.py file**
   - Navigate to `apps/payroll/management/commands/seed_components.py`
   - Locate statutory_components list

2. **Add allowances section**
   - After statutory_components list
   - Create common_allowances list
   - Similar structure to statutory_components

3. **Define Transport Allowance**
   - Code: TRANSPORT
   - Name: Transport Allowance
   - Type: EARNING
   - Category: ALLOWANCE
   - Calculation: FIXED
   - Default Value: 5000.00 (example amount)
   - is_taxable: True
   - is_epf_applicable: True (fixed allowance)
   - display_order: 20

4. **Define Medical Allowance**
   - Code: MEDICAL
   - Name: Medical Allowance
   - Type: EARNING
   - Category: ALLOWANCE
   - Calculation: FIXED
   - Default Value: 3000.00
   - is_taxable: False (typically exempt)
   - is_epf_applicable: False (expense reimbursement)
   - display_order: 21

5. **Define Housing Allowance**
   - Code: HOUSING
   - Name: Housing Allowance
   - Type: EARNING
   - Category: ALLOWANCE
   - Calculation: FIXED
   - Default Value: 8000.00
   - is_taxable: True
   - is_epf_applicable: True
   - display_order: 22

6. **Define Meal Allowance**
   - Code: MEAL
   - Name: Meal Allowance
   - Type: EARNING
   - Category: ALLOWANCE
   - Calculation: FIXED
   - Default Value: 2000.00
   - is_taxable: False (typically exempt)
   - is_epf_applicable: False
   - display_order: 23

7. **Add command flag**
   - Add --allowances flag to command arguments
   - Default: False (only statutory by default)
   - When enabled, also seed common allowances

8. **Update handle method**
   - Check --allowances flag
   - If enabled, combine statutory + allowances
   - If not, only statutory components
   - Seed selected components

9. **Update descriptions**
   - Add detailed descriptions for each allowance
   - Include typical amounts and variations
   - Note tax and EPF treatment
   - Add customization guidance

10. **Update command help text**
    - Document --allowances flag
    - Explain default amounts are examples
    - Note customization recommendations

### Common Allowances Component Definitions

```python
# Add to seed_components.py after statutory_components

common_allowances = [
    {
        'code': 'TRANSPORT',
        'name': 'Transport Allowance',
        'component_type': ComponentType.EARNING,
        'category': ComponentCategory.ALLOWANCE,
        'calculation_type': CalculationType.FIXED,
        'default_value': Decimal('5000.00'),
        'is_taxable': True,
        'is_epf_applicable': True,
        'is_fixed': True,
        'is_active': True,
        'display_order': 20,
        'description': '''Fixed monthly allowance for employee transportation costs.
Typical amounts vary by position and location:
  - Entry level: LKR 3,000 - 5,000
  - Mid level: LKR 5,000 - 8,000
  - Senior level: LKR 8,000 - 15,000
Tax Status: Fully taxable as per current IRD guidelines.
EPF Status: Included in EPF base (fixed allowance).
Pro-rated during no-pay situations.
Adjust default_value to match your company policy.'''
    },
    {
        'code': 'MEDICAL',
        'name': 'Medical Allowance',
        'component_type': ComponentType.EARNING,
        'category': ComponentCategory.ALLOWANCE,
        'calculation_type': CalculationType.FIXED,
        'default_value': Decimal('3000.00'),
        'is_taxable': False,
        'is_epf_applicable': False,
        'is_fixed': True,
        'is_active': True,
        'display_order': 21,
        'description': '''Monthly medical allowance for healthcare expenses.
Typical amounts: LKR 2,000 - 5,000 depending on position.
Tax Status: Exempt up to reasonable limits (verify current IRD guidelines).
EPF Status: Not included in EPF base (expense reimbursement).
Policy: Flat monthly amount, no receipts required.
Not pro-rated for no-pay days (expense allowance).
Adjust default_value to match your company policy.'''
    },
    {
        'code': 'HOUSING',
        'name': 'Housing Allowance',
        'component_type': ComponentType.EARNING,
        'category': ComponentCategory.ALLOWANCE,
        'calculation_type': CalculationType.FIXED,
        'default_value': Decimal('8000.00'),
        'is_taxable': True,
        'is_epf_applicable': True,
        'is_fixed': True,
        'is_active': True,
        'display_order': 22,
        'description': '''Fixed monthly allowance for accommodation support.
Typical amounts vary significantly by location and position:
  - Entry level: LKR 5,000 - 10,000
  - Mid level: LKR 10,000 - 20,000
  - Senior level: LKR 20,000 - 50,000
Tax Status: Fully taxable.
EPF Status: Included in EPF base (fixed allowance).
Pro-rated during no-pay situations.
Adjust default_value to match your company policy and location.'''
    },
    {
        'code': 'MEAL',
        'name': 'Meal Allowance',
        'component_type': ComponentType.EARNING,
        'category': ComponentCategory.ALLOWANCE,
        'calculation_type': CalculationType.FIXED,
        'default_value': Decimal('2000.00'),
        'is_taxable': False,
        'is_epf_applicable': False,
        'is_fixed': True,
        'is_active': True,
        'display_order': 23,
        'description': '''Monthly meal allowance for food expenses.
Typical amounts: LKR 1,500 - 3,000 per month.
Tax Status: Exempt as actual reimbursement (verify current IRD guidelines).
EPF Status: Not included in EPF base (expense reimbursement).
Alternative: Some companies use per-day meal rates or provide canteen.
Adjust default_value to match your company policy.'''
    },
]
```

### Updated Command Arguments

```python
def add_arguments(self, parser):
    parser.add_argument(
        '--tenant',
        type=int,
        help='Tenant ID to seed components for (if not specified, seeds for all tenants)'
    )
    parser.add_argument(
        '--overwrite',
        action='store_true',
        help='Overwrite existing components with same code'
    )
    parser.add_argument(
        '--allowances',
        action='store_true',
        help='Also seed common allowances (Transport, Medical, Housing, Meal)'
    )
```

### Updated Handle Method

```python
def handle(self, *args, **options):
    tenant_id = options.get('tenant')
    overwrite = options.get('overwrite', False)
    include_allowances = options.get('allowances', False)

    # Get tenants to seed
    if tenant_id:
        try:
            tenants = [Tenant.objects.get(id=tenant_id)]
            self.stdout.write(f"Seeding for tenant ID {tenant_id}...")
        except Tenant.DoesNotExist:
            raise CommandError(f"Tenant with ID {tenant_id} does not exist")
    else:
        tenants = Tenant.objects.all()
        self.stdout.write(f"Seeding for all {tenants.count()} tenants...")

    # Select components to seed
    components_to_seed = statutory_components.copy()
    
    if include_allowances:
        components_to_seed.extend(common_allowances)
        self.stdout.write(self.style.SUCCESS("Including common allowances\n"))
    else:
        self.stdout.write("Seeding statutory components only (use --allowances to include allowances)\n")

    # ... rest of method remains the same ...
```

### Running Commands with Allowances

```bash
# Seed only statutory components (default)
python manage.py seed_components

# Seed statutory + common allowances
python manage.py seed_components --allowances

# Seed for specific tenant with allowances
python manage.py seed_components --tenant 1 --allowances

# Overwrite all components including allowances
python manage.py seed_components --overwrite --allowances
```

### Expected Output with Allowances

```
Seeding for all 2 tenants...
Including common allowances

  Tenant: LankaCommerce Pvt Ltd
    ✓ Created: EPF Employee 8% (EPF_EMP)
    ✓ Created: EPF Employer 12% (EPF_EMP_CONTRIB)
    ✓ Created: ETF 3% (ETF)
    ✓ Created: Transport Allowance (TRANSPORT)
    ✓ Created: Medical Allowance (MEDICAL)
    ✓ Created: Housing Allowance (HOUSING)
    ✓ Created: Meal Allowance (MEAL)

  Tenant: QuickMart Supermarket
    ✓ Created: EPF Employee 8% (EPF_EMP)
    ✓ Created: EPF Employer 12% (EPF_EMP_CONTRIB)
    ✓ Created: ETF 3% (ETF)
    ✓ Created: Transport Allowance (TRANSPORT)
    ✓ Created: Medical Allowance (MEDICAL)
    ✓ Created: Housing Allowance (HOUSING)
    ✓ Created: Meal Allowance (MEAL)

============================================================
Summary:
  Created: 14
  Updated: 0
  Skipped: 0
============================================================
```

### Allowance Default Values Guidance

```
Default Values are Examples:
════════════════════════════
The seeded default amounts (5000, 3000, 8000, 2000) are
typical examples for Sri Lankan companies. Tenants should
customize based on:

✓ Industry standards
✓ Geographic location
✓ Position/grade level
✓ Company size and budget
✓ Competitive positioning
✓ Local cost of living

Customization Options:
══════════════════════
1. Change default_value per component
2. Create position-specific components
   (e.g., TRANSPORT_ENTRY, TRANSPORT_SENIOR)
3. Use salary templates with different amounts
4. Adjust via employee salary assignments
```

### Typical Allowance Ranges by Position

```
┌────────────────────────────────────────────────┐
│  Allowance Ranges (LKR per month)              │
├────────────────────────────────────────────────┤
│             │ Entry   │ Mid     │ Senior       │
├─────────────┼─────────┼─────────┼──────────────┤
│ Transport   │ 3,000-  │ 5,000-  │ 8,000-       │
│             │ 5,000   │ 8,000   │ 15,000       │
├─────────────┼─────────┼─────────┼──────────────┤
│ Medical     │ 2,000-  │ 3,000-  │ 5,000-       │
│             │ 3,000   │ 5,000   │ 10,000       │
├─────────────┼─────────┼─────────┼──────────────┤
│ Housing     │ 5,000-  │ 10,000- │ 20,000-      │
│             │ 10,000  │ 20,000  │ 50,000       │
├─────────────┼─────────┼─────────┼──────────────┤
│ Meal        │ 1,500-  │ 2,000-  │ 3,000-       │
│             │ 2,000   │ 3,000   │ 5,000        │
└────────────────────────────────────────────────┘
```

### Expected Outcome
- Common allowances added to seed command
- Transport, Medical, Housing, Meal allowances available
- Optional seeding via --allowances flag
- Customizable default amounts
- Comprehensive descriptions for guidance

### Verification Checklist
- [ ] common_allowances list added to seed_components.py
- [ ] Transport Allowance defined
- [ ] Medical Allowance defined
- [ ] Housing Allowance defined
- [ ] Meal Allowance defined
- [ ] All allowance attributes correct
- [ ] --allowances flag implemented
- [ ] Handle method updated for flag
- [ ] Descriptions include customization guidance
- [ ] Command executes with --allowances flag
- [ ] Allowances visible in database
- [ ] Default amounts are reasonable examples

---

## Summary

This document completed the SalaryComponent model and established the payroll foundation:

### Completed Infrastructure
- ✅ EPF applicable flag for statutory base calculation
- ✅ Fixed/variable flag for attendance-based payroll
- ✅ Active flag for component lifecycle management
- ✅ Display order for professional payslip presentation
- ✅ Description field for internal documentation
- ✅ Five strategic database indexes for performance
- ✅ Database migrations applied successfully
- ✅ Statutory components seed (EPF, ETF)
- ✅ Common allowances seed (Transport, Medical, Housing, Meal)

### Key Achievements
1. **Statutory Compliance** - EPF and ETF components configured per Sri Lankan law
2. **Performance Optimization** - Strategic indexes for fast queries
3. **Lifecycle Management** - Active/inactive component control
4. **Professional Presentation** - Display ordering for payslips
5. **Documentation** - Component descriptions for knowledge preservation
6. **Quick Setup** - Seed commands for immediate usability

### Database Structure Completed
```
payroll_salary_components table (fully operational):
  • Core: name, code, component_type, category
  • Calculation: calculation_type, default_value, percentage, formula
  • Flags: is_taxable, is_epf_applicable, is_fixed, is_active
  • Display: display_order
  • Documentation: description
  • Audit: tenant, created_at, updated_at, created_by, updated_by
  • Indexes: 5 strategic indexes for performance
  • Data: Statutory components + common allowances seeded
```

### Ready for Group B
The SalaryComponent model is complete and ready. Next steps in Group B will build:
- Salary Templates (grouping components)
- Salary Grades (position-based structures)
- Employee salary assignments

---

**Document Status:** ✅ Complete  
**Total Tasks:** 9  
**Estimated Time:** 2 hours 10 minutes  
**Group A Status:** ✅ All 18 Tasks Complete
