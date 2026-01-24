# Tasks 70-76: Statutory Calculators, Comparison, and Export

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 05 - Salary Structure  
> **Group:** E - Services & Calculations  
> **Document:** 02 of 02  
> **Tasks Covered:** 70, 71, 72, 73, 74, 75, 76

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-65-69_SalaryService.md](01_Tasks-65-69_SalaryService.md)

---

## Document Overview

This document covers the implementation of statutory calculators for EPF, ETF, and PAYE tax calculations, along with salary comparison and export services. These calculators ensure compliance with Sri Lankan labor regulations and tax laws while providing analytical and reporting capabilities.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 70 | Create EPFCalculator Service | High | 30 min |
| 71 | Create ETFCalculator Service | Medium | 20 min |
| 72 | Create PAYECalculator Service | High | 35 min |
| 73 | Implement Annual Tax Projection | Medium | 25 min |
| 74 | Implement Tax Slab Lookup | Medium | 20 min |
| 75 | Create Salary Comparison Service | Medium | 25 min |
| 76 | Create Salary Export Service | Medium | 25 min |

---

## Task 70: Create EPFCalculator Service

### Overview
Create the EPFCalculator service to calculate Employee Provident Fund (EPF) contributions according to Sri Lankan regulations. EPF is mandatory for all employees, with both employee (8%) and employer (12%) contributions calculated on the EPF base salary.

### Dependencies
- EmployeeSalary and EmployeeSalaryComponent models
- Component EPF applicability flags
- EPFConfiguration model (from Group D)

### Instructions

1. **Create epf_calculator.py file**
   - Create file at `apps/payroll/services/epf_calculator.py`
   - This will contain EPF calculation logic

2. **Import required modules**
   - Import Decimal for financial calculations
   - Import EmployeeSalary and EmployeeSalaryComponent models
   - Import EPFConfiguration model
   - Import Django timezone utilities

3. **Define EPFCalculator class**
   - Create class with comprehensive docstring
   - Document EPF calculation rules
   - Include Sri Lankan regulation references

4. **Implement get_epf_base method**
   - Calculate EPF base from salary
   - Sum components where is_epf_applicable=True
   - Return Decimal value

5. **Implement calculate_employee_epf method**
   - Calculate employee's 8% contribution
   - Formula: epf_base × 0.08
   - Return Decimal value

6. **Implement calculate_employer_epf method**
   - Calculate employer's 12% contribution
   - Formula: epf_base × 0.12
   - Return Decimal value

7. **Implement calculate_total_epf method**
   - Calculate combined EPF (20%)
   - Sum employee and employer contributions
   - Return Decimal value

8. **Implement get_epf_ceiling method**
   - Retrieve EPF ceiling from configuration
   - Check if ceiling should be applied
   - Return ceiling amount or None

9. **Apply EPF ceiling if configured**
   - Check tenant EPF configuration
   - If ceiling exists, cap EPF base
   - Recalculate contributions on capped base

10. **Update services __init__.py**
    - Import EPFCalculator
    - Add to __all__ list

### EPF Calculator Structure

```
┌─────────────────────────────────────────────────┐
│           EPFCalculator Service                 │
├─────────────────────────────────────────────────┤
│ Core Methods:                                   │
│  • get_epf_base(salary)                         │
│  • calculate_employee_epf(epf_base)             │
│  • calculate_employer_epf(epf_base)             │
│  • calculate_total_epf(epf_base)                │
│                                                 │
│ Configuration Methods:                          │
│  • get_epf_ceiling(tenant)                      │
│  • apply_ceiling(epf_base, ceiling)             │
└─────────────────────────────────────────────────┘
```

### EPF Calculation Flow

```
┌─────────────────────────────────────────────────────────┐
│              EPF Calculation Flow                       │
└─────────────────────────────────────────────────────────┘

    Employee Salary
        │
        ▼
    ┌─────────────────────────┐
    │  Get EPF Base           │
    │  • Load components      │
    │  • Filter EPF-applicable│
    │  • Sum amounts          │
    └───────────┬─────────────┘
                │
                ▼
    ┌─────────────────────────┐
    │  Check Ceiling          │
    │  • Load configuration   │
    │  • Apply if exists      │
    │  • Cap base if needed   │
    └───────────┬─────────────┘
                │
                ▼
    ┌─────────────────────────┐
    │  Calculate Contributions│
    │                         │
    │  Employee: Base × 8%    │
    │  Employer: Base × 12%   │
    │  Total: Base × 20%      │
    └───────────┬─────────────┘
                │
                ▼
    Return EPF Breakdown
```

### EPF Base Calculation

```
EPF Base Components
═══════════════════

Salary Components:
├── Basic Salary: 150,000 ✅ is_epf_applicable=True
├── Fixed Allowance: 15,000 ✅ is_epf_applicable=True
├── Transport: 10,000 ❌ is_epf_applicable=False
└── Commission: 20,000 ❌ is_epf_applicable=False

EPF Base = 150,000 + 15,000 = 165,000
```

### EPF Contribution Calculation

#### Example 1: Standard Calculation
```
Employee Salary Components:
═══════════════════════════

Basic Salary:          150,000 (EPF-applicable)
Fixed Allowance:        15,000 (EPF-applicable)
Transport Allowance:    10,000 (Not EPF-applicable)
────────────────────────────────────────────────
EPF Base:              165,000

EPF Contributions:
══════════════════
Employee (8%):     165,000 × 0.08 = 13,200.00
Employer (12%):    165,000 × 0.12 = 19,800.00
────────────────────────────────────────────────
Total EPF (20%):   165,000 × 0.20 = 33,000.00
```

#### Example 2: With EPF Ceiling
```
Employee Salary Components:
═══════════════════════════

Basic Salary:          500,000 (EPF-applicable)
Fixed Allowance:        50,000 (EPF-applicable)
────────────────────────────────────────────────
Calculated EPF Base:   550,000
EPF Ceiling:           300,000 (tenant config)
Actual EPF Base:       300,000 (capped)

EPF Contributions:
══════════════════
Employee (8%):     300,000 × 0.08 = 24,000.00
Employer (12%):    300,000 × 0.12 = 36,000.00
────────────────────────────────────────────────
Total EPF (20%):   300,000 × 0.20 = 60,000.00

Note: Contributions capped at ceiling
```

### EPF Rates Reference

| Contribution Type | Rate | Calculation | Who Pays |
|------------------|------|-------------|----------|
| Employee EPF | 8% | EPF Base × 0.08 | Employee (deducted) |
| Employer EPF | 12% | EPF Base × 0.12 | Employer (additional cost) |
| Total EPF | 20% | EPF Base × 0.20 | Combined |

### Component EPF Applicability Matrix

| Component Type | Typically EPF-Applicable | Example |
|---------------|-------------------------|---------|
| Basic Salary | ✅ Yes | Always included |
| Fixed Allowance | ✅ Yes | Housing, cost of living |
| Variable Allowance | ❌ No | Commission, bonus |
| Overtime | ❌ No | Hourly overtime pay |
| Transport | ❌ No | Transport reimbursement |
| Performance Bonus | ❌ No | One-time payments |

### EPF Ceiling Configuration

```
EPF Configuration (Tenant-specific)
═══════════════════════════════════

Configuration 1: No Ceiling
├── epf_ceiling: null
├── apply_ceiling: False
└── Result: No cap on EPF base

Configuration 2: With Ceiling
├── epf_ceiling: 300,000
├── apply_ceiling: True
└── Result: EPF base capped at 300,000

Configuration 3: High Earner
├── Gross Salary: 800,000
├── EPF Base (calculated): 600,000
├── EPF Ceiling: 300,000
└── EPF Base (actual): 300,000
```

### Sri Lankan EPF Regulations

#### Key Regulatory Points
1. **Mandatory Coverage**
   - All employees with monthly earnings
   - Employed by establishments with 5+ employees
   - No upper age limit

2. **Contribution Rates**
   - Employee: 8% of EPF base
   - Employer: 12% of EPF base
   - Total: 20% of EPF base

3. **EPF Base Definition**
   - Basic salary and fixed allowances
   - Excludes variable/one-time payments
   - May have ceiling (varies by sector)

4. **Payment Timeline**
   - Due by 15th of following month
   - Penalties for late payment
   - Direct deposit to EPF account

### EPF Calculation Edge Cases

#### Case 1: Mid-Month Joining
```
Scenario: Employee joins on 15th

Salary for Month:
├── Days in month: 30
├── Days worked: 16
├── Basic (prorated): 80,000
├── Allowance (prorated): 8,000
└── EPF Base: 88,000

EPF Calculation:
├── Employee EPF: 88,000 × 0.08 = 7,040
└── Employer EPF: 88,000 × 0.12 = 10,560
```

#### Case 2: Unpaid Leave
```
Scenario: 5 days unpaid leave

Salary Adjustment:
├── Basic (full): 150,000
├── Deduction (5 days): 25,000
├── Actual Basic: 125,000
├── Allowance (prorated): 12,500
└── EPF Base: 137,500

EPF Calculation:
├── Employee EPF: 137,500 × 0.08 = 11,000
└── Employer EPF: 137,500 × 0.12 = 16,500
```

#### Case 3: No EPF-Applicable Components
```
Scenario: Pure commission salary

Salary Structure:
├── Commission: 200,000 (not EPF-applicable)
└── EPF Base: 0

EPF Calculation:
├── Employee EPF: 0
├── Employer EPF: 0
└── Note: Unusual but valid
```

### Expected Outcome
- Functional EPF calculator
- Accurate contribution calculation
- Ceiling support
- Component filtering
- Regulatory compliance

### Verification Checklist
- [ ] epf_calculator.py file created
- [ ] EPFCalculator class defined
- [ ] get_epf_base method implemented
- [ ] calculate_employee_epf method
- [ ] calculate_employer_epf method
- [ ] calculate_total_epf method
- [ ] Ceiling support implemented
- [ ] Decimal precision maintained
- [ ] Services __init__.py updated
- [ ] Comprehensive docstrings

---

## Task 71: Create ETFCalculator Service

### Overview
Create the ETFCalculator service to calculate Employees' Trust Fund (ETF) contributions according to Sri Lankan regulations. ETF is an employer-only contribution of 3% calculated on the same base as EPF.

### Dependencies
- Task 70: Create EPFCalculator Service
- EPFCalculator (for base calculation reuse)
- ETFConfiguration model (from Group D)

### Instructions

1. **Create etf_calculator.py file**
   - Create file at `apps/payroll/services/etf_calculator.py`
   - This will contain ETF calculation logic

2. **Import required modules**
   - Import Decimal for financial calculations
   - Import EPFCalculator (to reuse base calculation)
   - Import ETFConfiguration model
   - Import EmployeeSalary model

3. **Define ETFCalculator class**
   - Create class with comprehensive docstring
   - Document ETF calculation rules
   - Note relationship with EPF base

4. **Implement get_etf_base method**
   - Delegate to EPFCalculator.get_epf_base
   - ETF base is same as EPF base
   - Return Decimal value

5. **Implement calculate_etf method**
   - Calculate employer's 3% contribution
   - Formula: etf_base × 0.03
   - Return Decimal value

6. **Implement get_etf_ceiling method**
   - Retrieve ETF ceiling from configuration
   - Usually same as EPF ceiling
   - Return ceiling amount or None

7. **Apply ETF ceiling if configured**
   - Check tenant ETF configuration
   - If ceiling exists, cap ETF base
   - Recalculate contribution on capped base

8. **Update services __init__.py**
   - Import ETFCalculator
   - Add to __all__ list

### ETF Calculator Structure

```
┌─────────────────────────────────────────────────┐
│           ETFCalculator Service                 │
├─────────────────────────────────────────────────┤
│ Core Methods:                                   │
│  • get_etf_base(salary)                         │
│  • calculate_etf(etf_base)                      │
│                                                 │
│ Configuration Methods:                          │
│  • get_etf_ceiling(tenant)                      │
│  • apply_ceiling(etf_base, ceiling)             │
│                                                 │
│ Helper Methods:                                 │
│  • reuse EPFCalculator.get_epf_base()           │
└─────────────────────────────────────────────────┘
```

### ETF Calculation Flow

```
┌─────────────────────────────────────────────────────────┐
│              ETF Calculation Flow                       │
└─────────────────────────────────────────────────────────┘

    Employee Salary
        │
        ▼
    ┌─────────────────────────┐
    │  Get ETF Base           │
    │  • Use EPF base logic   │
    │  • Same components      │
    │  • Same filtering       │
    └───────────┬─────────────┘
                │
                ▼
    ┌─────────────────────────┐
    │  Check Ceiling          │
    │  • Load configuration   │
    │  • Usually same as EPF  │
    │  • Cap if needed        │
    └───────────┬─────────────┘
                │
                ▼
    ┌─────────────────────────┐
    │  Calculate ETF          │
    │                         │
    │  Employer: Base × 3%    │
    └───────────┬─────────────┘
                │
                ▼
    Return ETF Amount
```

### ETF Contribution Calculation

#### Example 1: Standard Calculation
```
Employee Salary Components:
═══════════════════════════

Basic Salary:          150,000 (EPF/ETF-applicable)
Fixed Allowance:        15,000 (EPF/ETF-applicable)
Transport Allowance:    10,000 (Not applicable)
────────────────────────────────────────────────
ETF Base:              165,000 (same as EPF base)

ETF Contribution:
═════════════════
Employer (3%):     165,000 × 0.03 = 4,950.00

Note: Employee does NOT contribute to ETF
```

#### Example 2: With Ceiling
```
Employee Salary Components:
═══════════════════════════

Basic Salary:          500,000 (EPF/ETF-applicable)
Fixed Allowance:        50,000 (EPF/ETF-applicable)
────────────────────────────────────────────────
Calculated ETF Base:   550,000
ETF Ceiling:           300,000 (tenant config)
Actual ETF Base:       300,000 (capped)

ETF Contribution:
═════════════════
Employer (3%):     300,000 × 0.03 = 9,000.00

Note: Contribution capped at ceiling
```

### ETF vs EPF Comparison

| Aspect | EPF | ETF |
|--------|-----|-----|
| Base Calculation | Sum of EPF-applicable components | Same as EPF base |
| Employee Contribution | 8% | 0% (none) |
| Employer Contribution | 12% | 3% |
| Total Employer Cost | 12% | 3% |
| Combined Rate | 20% | 3% |
| Purpose | Retirement savings | Social security fund |
| Withdrawal | At retirement | Limited access |

### Complete Statutory Contribution Example

```
Complete Payroll Calculation
════════════════════════════

Employee: John Doe
Salary Components:
├── Basic Salary: 150,000 ✅
├── Fixed Allowance: 15,000 ✅
└── Transport: 10,000 ❌

Gross Salary: 175,000

EPF/ETF Base: 165,000

Statutory Calculations:
══════════════════════

EPF (Employee - 8%):
├── 165,000 × 0.08 = 13,200.00
└── Deducted from salary

EPF (Employer - 12%):
├── 165,000 × 0.12 = 19,800.00
└── Additional employer cost

ETF (Employer - 3%):
├── 165,000 × 0.03 = 4,950.00
└── Additional employer cost

Summary:
════════
Gross Salary:           175,000.00
EPF Deduction:          -13,200.00
Net Before Tax:         161,800.00

Employer Costs:
├── EPF (12%):           19,800.00
├── ETF (3%):             4,950.00
└── Total Extra:         24,750.00

Total Cost to Employer:
├── Gross Salary:       175,000.00
├── EPF Employer:        19,800.00
├── ETF:                  4,950.00
└── Total:              199,750.00
```

### Sri Lankan ETF Regulations

#### Key Regulatory Points
1. **Employer-Only Contribution**
   - 3% of ETF base
   - No employee contribution
   - Employer's social obligation

2. **Same Base as EPF**
   - Uses identical base calculation
   - Same component applicability
   - Same ceiling rules (if any)

3. **Payment Timeline**
   - Due by 15th of following month
   - Submitted with EPF contributions
   - Penalties for late payment

4. **Coverage**
   - Same employee coverage as EPF
   - Establishments with 5+ employees
   - No exemptions

### ETF Base Reuse Pattern

```
Code Reuse Strategy
══════════════════

EPFCalculator:
└── get_epf_base(salary)
    ├── Filter EPF-applicable components
    ├── Sum amounts
    ├── Apply ceiling if exists
    └── Return base

ETFCalculator:
└── get_etf_base(salary)
    ├── Call EPFCalculator.get_epf_base(salary)
    └── Return same value

Benefits:
├── No code duplication
├── Consistent base calculation
├── Single point of change
└── Reduced maintenance
```

### Calculation Method Comparison

```python
class ETFCalculator:
    @staticmethod
    def get_etf_base(salary, tenant):
        """
        Get ETF base (same as EPF base)
        Delegates to EPFCalculator for consistency
        """
        return EPFCalculator.get_epf_base(salary, tenant)
    
    @staticmethod
    def calculate_etf(etf_base):
        """
        Calculate ETF contribution (3%)
        
        Args:
            etf_base: Decimal - The ETF base amount
        
        Returns:
            Decimal - ETF contribution amount
        """
        etf_rate = Decimal('0.03')
        etf_amount = etf_base * etf_rate
        return etf_amount.quantize(Decimal('0.01'))
```

### Expected Outcome
- Functional ETF calculator
- Accurate 3% calculation
- Base reuse from EPF
- Ceiling support
- Regulatory compliance

### Verification Checklist
- [ ] etf_calculator.py file created
- [ ] ETFCalculator class defined
- [ ] get_etf_base delegates to EPF
- [ ] calculate_etf method implemented
- [ ] 3% rate correctly applied
- [ ] Ceiling support implemented
- [ ] Decimal precision maintained
- [ ] Services __init__.py updated
- [ ] Comprehensive docstrings

---

## Task 72: Create PAYECalculator Service

### Overview
Create the PAYECalculator service to calculate Pay As You Earn (PAYE) tax according to Sri Lankan tax regulations. PAYE is calculated on taxable income using progressive tax slabs, with monthly deduction from employee salary.

### Dependencies
- PAYETaxSlab model (from Group D)
- EmployeeSalary and components
- EPFCalculator (for deductions)
- Tax year configuration

### Instructions

1. **Create paye_calculator.py file**
   - Create file at `apps/payroll/services/paye_calculator.py`
   - This will contain PAYE calculation logic

2. **Import required modules**
   - Import Decimal for financial calculations
   - Import PAYETaxSlab model
   - Import EmployeeSalary model
   - Import EPFCalculator
   - Import date utilities

3. **Define PAYECalculator class**
   - Create class with comprehensive docstring
   - Document PAYE calculation methodology
   - Include tax slab references

4. **Implement get_taxable_income method**
   - Calculate taxable income from gross
   - Deduct employee EPF contribution
   - Deduct personal allowances/exemptions
   - Return Decimal value

5. **Implement calculate_monthly_paye method**
   - Calculate PAYE for single month
   - Project to annual income
   - Apply progressive tax slabs
   - Divide result by 12
   - Return monthly PAYE amount

6. **Implement calculate_annual_paye method**
   - Calculate PAYE for annual income
   - Apply progressive tax slabs
   - Handle slab transitions
   - Return annual PAYE amount

7. **Implement apply_tax_slabs method**
   - Iterate through tax slabs
   - Calculate tax for each slab
   - Sum total tax
   - Return tax amount

8. **Add helper methods**
   - get_applicable_slabs (for tax year)
   - get_personal_exemptions
   - calculate_slab_tax

9. **Update services __init__.py**
   - Import PAYECalculator
   - Add to __all__ list

### PAYE Calculator Structure

```
┌─────────────────────────────────────────────────┐
│          PAYECalculator Service                 │
├─────────────────────────────────────────────────┤
│ Core Methods:                                   │
│  • get_taxable_income(salary)                   │
│  • calculate_monthly_paye(monthly_income)       │
│  • calculate_annual_paye(annual_income)         │
│  • apply_tax_slabs(taxable_amount)              │
│                                                 │
│ Helper Methods:                                 │
│  • get_applicable_slabs(tax_year)               │
│  • get_personal_exemptions(employee)            │
│  • calculate_slab_tax(amount, slab)             │
│  • project_annual_income(monthly)               │
└─────────────────────────────────────────────────┘
```

### PAYE Calculation Flow

```
┌─────────────────────────────────────────────────────────┐
│            PAYE Tax Calculation Flow                    │
└─────────────────────────────────────────────────────────┘

    Gross Salary (Monthly)
        │
        ▼
    ┌─────────────────────────┐
    │  Calculate Taxable      │
    │  • Gross salary         │
    │  • Minus EPF (8%)       │
    │  • Minus exemptions     │
    └───────────┬─────────────┘
                │
                ▼
    ┌─────────────────────────┐
    │  Project to Annual      │
    │  • Monthly × 12         │
    │  • Annual taxable       │
    └───────────┬─────────────┘
                │
                ▼
    ┌─────────────────────────┐
    │  Apply Tax Slabs        │
    │  • Slab 1: 0% (0-1.2M)  │
    │  • Slab 2: 6% (1.2-1.7M)│
    │  • Slab 3: 12% (1.7-2.2M)│
    │  • Slab 4: 18% (2.2-2.7M)│
    │  • Slab 5: 24% (2.7-3.2M)│
    │  • Slab 6: 30% (3.2M+)  │
    └───────────┬─────────────┘
                │
                ▼
    ┌─────────────────────────┐
    │  Calculate Annual Tax   │
    │  • Sum slab taxes       │
    │  • Total annual PAYE    │
    └───────────┬─────────────┘
                │
                ▼
    ┌─────────────────────────┐
    │  Convert to Monthly     │
    │  • Annual PAYE ÷ 12     │
    │  • Monthly deduction    │
    └───────────┬─────────────┘
                │
                ▼
    Return Monthly PAYE
```

### Taxable Income Calculation

```
Taxable Income Breakdown
═══════════════════════

Gross Salary:                175,000.00

Deductions:
├── EPF Employee (8%):       -13,200.00  (165,000 × 0.08)
└── Personal Allowance:           -0.00  (if any)
────────────────────────────────────────
Taxable Income (Monthly):    161,800.00

Annual Projection:
Taxable Income × 12:       1,941,600.00
```

### Sri Lankan PAYE Tax Slabs (2026)

```
Progressive Tax Slabs
════════════════════

Annual Income (LKR)          Rate    Cumulative Tax
─────────────────────────────────────────────────
0 - 1,200,000                0%           0
1,200,001 - 1,700,000        6%      30,000
1,700,001 - 2,200,000       12%      90,000
2,200,001 - 2,700,000       18%     180,000
2,700,001 - 3,200,000       24%     300,000
3,200,001 and above         30%      -

Note: Rates are illustrative; actual rates may vary by year
```

### Progressive Tax Calculation Example

#### Example 1: Annual Income 1,941,600
```
Tax Calculation by Slab
═══════════════════════

Annual Taxable Income: 1,941,600

Slab 1: 0 - 1,200,000 @ 0%
├── Taxable in slab: 1,200,000
└── Tax: 1,200,000 × 0% = 0

Slab 2: 1,200,001 - 1,700,000 @ 6%
├── Taxable in slab: 500,000
└── Tax: 500,000 × 0.06 = 30,000

Slab 3: 1,700,001 - 2,200,000 @ 12%
├── Taxable in slab: 241,600
└── Tax: 241,600 × 0.12 = 28,992

Total Annual PAYE: 58,992
Monthly PAYE: 58,992 ÷ 12 = 4,916
```

#### Example 2: Annual Income 3,500,000
```
Tax Calculation by Slab
═══════════════════════

Annual Taxable Income: 3,500,000

Slab 1: 0 - 1,200,000 @ 0%
└── Tax: 0

Slab 2: 1,200,001 - 1,700,000 @ 6%
└── Tax: 500,000 × 0.06 = 30,000

Slab 3: 1,700,001 - 2,200,000 @ 12%
└── Tax: 500,000 × 0.12 = 60,000

Slab 4: 2,200,001 - 2,700,000 @ 18%
└── Tax: 500,000 × 0.18 = 90,000

Slab 5: 2,700,001 - 3,200,000 @ 24%
└── Tax: 500,000 × 0.24 = 120,000

Slab 6: 3,200,001+ @ 30%
└── Tax: 300,000 × 0.30 = 90,000

Total Annual PAYE: 390,000
Monthly PAYE: 390,000 ÷ 12 = 32,500
```

### Complete Payroll Example with PAYE

```
Employee: Jane Smith
Monthly Gross: 175,000
═══════════════════════

Step 1: Calculate EPF/ETF Base
Basic: 150,000 ✅
Fixed Allowance: 15,000 ✅
EPF/ETF Base: 165,000

Step 2: Calculate Statutory Deductions
EPF Employee (8%): 165,000 × 0.08 = 13,200

Step 3: Calculate Taxable Income
Gross: 175,000
EPF Deduction: -13,200
Monthly Taxable: 161,800
Annual Taxable: 1,941,600

Step 4: Calculate Annual PAYE
Slab 1 (0-1.2M @ 0%): 0
Slab 2 (1.2M-1.7M @ 6%): 30,000
Slab 3 (1.7M-1,941,600 @ 12%): 28,992
Annual PAYE: 58,992

Step 5: Calculate Monthly PAYE
Monthly PAYE: 58,992 ÷ 12 = 4,916

Net Salary Calculation:
═══════════════════════
Gross Salary:          175,000.00
EPF Deduction:         -13,200.00
PAYE Tax:               -4,916.00
─────────────────────────────────
Net Salary:            156,884.00

Employer Costs:
═══════════════
EPF Employer (12%):     19,800.00
ETF (3%):                4,950.00
─────────────────────────────────
Total Employer Cost:    24,750.00
```

### Tax Slab Lookup Algorithm

```
Progressive Tax Algorithm
════════════════════════

Function: calculate_tax(annual_income, slabs)

total_tax = 0
remaining_income = annual_income

For each slab in slabs (ordered by from_amount):
    slab_start = slab.from_amount
    slab_end = slab.to_amount or infinity
    slab_rate = slab.rate
    
    taxable_in_slab = min(remaining_income, slab_end - slab_start)
    
    if taxable_in_slab > 0:
        slab_tax = taxable_in_slab × slab_rate
        total_tax += slab_tax
        remaining_income -= taxable_in_slab
    
    if remaining_income <= 0:
        break

return total_tax
```

### Personal Exemptions and Allowances

```
Tax Exemptions (If Applicable)
══════════════════════════════

Personal Exemptions:
├── Self exemption: May apply
├── Spouse exemption: If dependent
├── Child exemptions: Per dependent child
└── Disability exemptions: If applicable

Taxable Calculation:
Gross:                     175,000
EPF (8%):                  -13,200
Personal Exemptions:       -10,000 (if any)
────────────────────────────────────
Taxable Income:            151,800

Note: Exemptions vary by year and regulation
```

### PAYE Edge Cases

#### Case 1: Income Below Tax Threshold
```
Monthly Gross: 80,000
Annual: 960,000

Result: Below 1,200,000 threshold
PAYE: 0 (no tax applicable)
```

#### Case 2: Mid-Year Salary Change
```
Jan-Jun: 150,000/month = 900,000
Jul-Dec: 200,000/month = 1,200,000
Annual: 2,100,000

PAYE Calculation:
Based on total annual income
Tax recalculated each month
```

#### Case 3: Bonus Payment
```
Regular Monthly: 175,000
Bonus Month: 175,000 + 200,000 = 375,000

PAYE for Bonus Month:
Project annual: 375,000 × 12 = 4,500,000
Calculate tax on projected annual
Adjust for previous months paid
```

### Expected Outcome
- Functional PAYE calculator
- Progressive tax slab support
- Accurate monthly/annual calculation
- Exemption handling
- Tax regulation compliance

### Verification Checklist
- [ ] paye_calculator.py file created
- [ ] PAYECalculator class defined
- [ ] get_taxable_income implemented
- [ ] calculate_monthly_paye implemented
- [ ] calculate_annual_paye implemented
- [ ] apply_tax_slabs implemented
- [ ] Progressive tax logic correct
- [ ] Slab lookup functional
- [ ] Decimal precision maintained
- [ ] Services __init__.py updated

---

## Task 73: Implement Annual Tax Projection

### Overview
Implement the annual tax projection method in PAYECalculator. This method projects annual tax liability from monthly income, useful for mid-year calculations, salary changes, and tax planning. It handles scenarios where full year data is not yet available.

### Dependencies
- Task 72: Create PAYECalculator Service
- PAYETaxSlab model

### Instructions

1. **Open paye_calculator.py file**
   - Locate PAYECalculator class

2. **Add project_annual_tax method**
   - Accept monthly_income as parameter
   - Accept months_worked parameter (default=12)
   - Accept tenant parameter

3. **Implement projection logic**
   - Multiply monthly_income by months remaining
   - Add year-to-date income if available
   - Project full year taxable income

4. **Calculate projected annual tax**
   - Call calculate_annual_paye with projected income
   - Apply tax slabs
   - Return projected annual tax

5. **Implement mid-year adjustment**
   - Calculate tax paid year-to-date
   - Calculate tax owed on projected annual
   - Determine remaining tax liability
   - Return adjustment amount

6. **Handle partial year scenarios**
   - New employee (not full year)
   - Salary change mid-year
   - Bonus/irregular income
   - Return appropriate projection

7. **Add projection breakdown method**
   - Return detailed breakdown
   - Show assumptions used
   - Show calculations by period
   - Return as dictionary

### Annual Tax Projection Flow

```
┌─────────────────────────────────────────────────────────┐
│         Annual Tax Projection Flow                      │
└─────────────────────────────────────────────────────────┘

    Monthly Income + Current Month
        │
        ▼
    ┌─────────────────────────┐
    │  Calculate YTD Income   │
    │  • Months worked so far │
    │  • Total income YTD     │
    └───────────┬─────────────┘
                │
                ▼
    ┌─────────────────────────┐
    │  Project Remaining      │
    │  • Months remaining     │
    │  • Expected income      │
    │  • Projected total      │
    └───────────┬─────────────┘
                │
                ▼
    ┌─────────────────────────┐
    │  Calculate Annual Tax   │
    │  • Apply slabs          │
    │  • Full year tax        │
    └───────────┬─────────────┘
                │
                ▼
    ┌─────────────────────────┐
    │  Adjust for YTD Paid    │
    │  • Tax paid so far      │
    │  • Remaining liability  │
    │  • Monthly adjustment   │
    └───────────┬─────────────┘
                │
                ▼
    Return Projected Tax & Adjustment
```

### Projection Scenarios

#### Scenario 1: Mid-Year Projection (June)
```
Current Month: June (Month 6)
Monthly Income: 175,000
═══════════════════════════

Year-to-Date (Jan-Jun):
├── Months worked: 6
├── Income per month: 175,000
└── YTD Income: 1,050,000

Remaining Year (Jul-Dec):
├── Months remaining: 6
├── Expected per month: 175,000
└── Projected income: 1,050,000

Full Year Projection:
├── YTD: 1,050,000
├── Remaining: 1,050,000
└── Annual Projected: 2,100,000

Projected Annual Tax:
Slab 1 (0-1.2M @ 0%): 0
Slab 2 (1.2M-1.7M @ 6%): 30,000
Slab 3 (1.7M-2.1M @ 12%): 48,000
Total Projected PAYE: 78,000

Monthly Average: 78,000 ÷ 12 = 6,500
```

#### Scenario 2: Salary Increase Mid-Year
```
Jan-Jun: 150,000/month
Jul-Dec: 200,000/month (promotion)
Current: July
═══════════════════════════

YTD Income (Jan-Jun):
6 months × 150,000 = 900,000

Remaining Projection (Jul-Dec):
6 months × 200,000 = 1,200,000

Annual Projected: 2,100,000

Projected Annual Tax: 78,000

Tax Already Paid (Jan-Jun):
Based on 150,000/month projection: 18,000

Adjustment Needed:
Total tax owed: 78,000
Already paid: 18,000
Remaining: 60,000
Over 6 months: 60,000 ÷ 6 = 10,000/month
```

#### Scenario 3: New Employee (Joins March)
```
Join Date: March 1
Monthly Income: 175,000
Current Month: March
═══════════════════════════

Months Working This Year: 10 (March-December)

Annual Income Projection:
10 months × 175,000 = 1,750,000

Projected Annual Tax:
Slab 1 (0-1.2M @ 0%): 0
Slab 2 (1.2M-1.7M @ 6%): 30,000
Slab 3 (1.7M-1.75M @ 12%): 6,000
Total: 36,000

Monthly PAYE: 36,000 ÷ 10 = 3,600

Note: Tax spread over 10 working months, not 12
```

### Projection Calculation Methods

```python
class PAYECalculator:
    @staticmethod
    def project_annual_tax(
        monthly_income: Decimal,
        current_month: int,
        ytd_income: Decimal,
        tenant: Tenant
    ) -> dict:
        """
        Project annual tax liability
        
        Returns:
            {
                'ytd_income': Decimal,
                'remaining_income': Decimal,
                'projected_annual': Decimal,
                'projected_tax': Decimal,
                'ytd_tax_paid': Decimal,
                'remaining_tax': Decimal,
                'monthly_adjustment': Decimal
            }
        """
        pass
```

### Projection Breakdown Structure

```
Tax Projection Report
════════════════════

Employee: John Doe
Projection Date: June 30, 2026
Current Monthly Income: 175,000

Year-to-Date Summary:
═══════════════════
Months Worked:          6
Total Income YTD:       1,050,000
Average Monthly:        175,000
Tax Paid YTD:           18,000

Remaining Year Projection:
═════════════════════════
Months Remaining:       6
Expected Monthly:       175,000
Projected Income:       1,050,000

Full Year Projection:
════════════════════
Total Annual Income:    2,100,000
Projected Annual Tax:   78,000
Average Monthly Tax:    6,500

Adjustment Required:
═══════════════════
Total Tax Owed:         78,000
Already Paid:           18,000
Remaining Liability:    60,000
Monthly (Jul-Dec):      10,000

Action: Increase monthly PAYE from 3,000 to 10,000
```

### Use Cases for Projection

| Scenario | Use Case | Benefit |
|----------|----------|---------|
| Mid-Year Review | Tax liability check | Avoid year-end surprise |
| Salary Increase | Adjust PAYE deduction | Proper withholding |
| New Hire | Calculate first year tax | Accurate deduction |
| Bonus Payment | Plan for extra tax | Cash flow management |
| Tax Planning | Optimize deductions | Reduce liability |

### Expected Outcome
- Annual tax projection from monthly
- Mid-year adjustment calculation
- Partial year handling
- Projection breakdown reporting

### Verification Checklist
- [ ] project_annual_tax method added
- [ ] YTD calculation implemented
- [ ] Remaining year projection
- [ ] Full year tax calculation
- [ ] Adjustment calculation
- [ ] Partial year handling
- [ ] Projection breakdown format
- [ ] Return value correct

---

## Task 74: Implement Tax Slab Lookup

### Overview
Implement the tax slab lookup method in PAYECalculator. This method retrieves applicable tax slabs for a given tax year and provides efficient slab-based calculations. It supports multi-year slab configurations and handles slab changes across years.

### Dependencies
- Task 73: Implement Annual Tax Projection
- PAYETaxSlab model with year filtering

### Instructions

1. **Open paye_calculator.py file**
   - Locate PAYECalculator class

2. **Add get_applicable_slabs method**
   - Accept tax_year parameter
   - Accept tenant parameter
   - Query PAYETaxSlab model

3. **Implement slab filtering**
   - Filter by tax_year
   - Filter by tenant
   - Filter by is_active=True
   - Order by from_amount ascending

4. **Add slab caching**
   - Cache slabs per tax year
   - Avoid repeated database queries
   - Invalidate cache on slab changes

5. **Implement find_slab_for_amount method**
   - Accept income amount and tax year
   - Return the applicable slab
   - Handle boundary conditions

6. **Add slab validation**
   - Ensure no gaps in slab ranges
   - Ensure no overlaps
   - Validate rate values (0-100%)

7. **Implement get_effective_rate method**
   - Calculate effective tax rate
   - Based on total income
   - Return as percentage

### Tax Slab Lookup Flow

```
┌─────────────────────────────────────────────────────────┐
│            Tax Slab Lookup Flow                         │
└─────────────────────────────────────────────────────────┘

    Tax Year + Tenant
        │
        ▼
    ┌─────────────────────────┐
    │  Check Cache            │
    │  • Year cached?         │
    │  • Return if found      │
    └───────────┬─────────────┘
                │ Not cached
                ▼
    ┌─────────────────────────┐
    │  Query Database         │
    │  • Filter by year       │
    │  • Filter by tenant     │
    │  • Filter active        │
    │  • Order by from_amount │
    └───────────┬─────────────┘
                │
                ▼
    ┌─────────────────────────┐
    │  Validate Slabs         │
    │  • Check continuity     │
    │  • Check overlaps       │
    │  • Validate rates       │
    └───────────┬─────────────┘
                │
                ▼
    ┌─────────────────────────┐
    │  Cache Slabs            │
    │  • Store in memory      │
    │  • Set expiry           │
    └───────────┬─────────────┘
                │
                ▼
    Return Tax Slabs (List)
```

### Tax Slab Data Structure

```
PAYETaxSlab Model
════════════════

Slab 1:
├── tax_year: 2026
├── from_amount: 0
├── to_amount: 1,200,000
├── rate: 0.00 (0%)
├── is_active: True
└── tenant: Tenant X

Slab 2:
├── tax_year: 2026
├── from_amount: 1,200,001
├── to_amount: 1,700,000
├── rate: 6.00 (6%)
├── is_active: True
└── tenant: Tenant X

Slab 3:
├── tax_year: 2026
├── from_amount: 1,700,001
├── to_amount: 2,200,000
├── rate: 12.00 (12%)
├── is_active: True
└── tenant: Tenant X

...and so on
```

### Slab Lookup Examples

#### Example 1: Find Slab for Income Amount
```
Annual Income: 1,850,000
Tax Year: 2026

Lookup Process:
═══════════════

Check Slab 1 (0 - 1,200,000):
├── 1,850,000 > 1,200,000
└── Not this slab

Check Slab 2 (1,200,001 - 1,700,000):
├── 1,850,000 > 1,700,000
└── Not this slab

Check Slab 3 (1,700,001 - 2,200,000):
├── 1,850,000 >= 1,700,001 ✓
├── 1,850,000 <= 2,200,000 ✓
└── Found: Slab 3 @ 12%

Marginal Rate: 12%
```

#### Example 2: Effective Tax Rate Calculation
```
Annual Income: 2,100,000
Tax Year: 2026

Tax Breakdown:
═════════════
Slab 1 (0-1.2M @ 0%):           0
Slab 2 (1.2M-1.7M @ 6%):    30,000
Slab 3 (1.7M-2.1M @ 12%):   48,000
────────────────────────────────
Total Tax:                  78,000

Effective Tax Rate:
78,000 ÷ 2,100,000 = 3.71%

Note: Lower than marginal rate (12%)
```

### Slab Validation Rules

```
Slab Validation Checks
═════════════════════

1. No Gaps:
   Slab 1: 0 - 1,200,000
   Slab 2: 1,200,001 - 1,700,000 ✓ (continuous)
   
   Invalid:
   Slab 1: 0 - 1,200,000
   Slab 2: 1,300,000 - 1,700,000 ✗ (gap: 1.2M-1.3M)

2. No Overlaps:
   Slab 1: 0 - 1,200,000
   Slab 2: 1,200,001 - 1,700,000 ✓ (no overlap)
   
   Invalid:
   Slab 1: 0 - 1,200,000
   Slab 2: 1,100,000 - 1,700,000 ✗ (overlap: 1.1M-1.2M)

3. Rate Range:
   Valid: 0% - 100%
   Invalid: -5% or 150%

4. Ascending Order:
   Slab 1: from_amount = 0
   Slab 2: from_amount = 1,200,001 ✓
   Slab 3: from_amount = 1,700,001 ✓
```

### Slab Caching Strategy

```
Cache Management
═══════════════

Cache Key: "tax_slabs_{year}_{tenant_id}"

Cache Entry:
{
    'year': 2026,
    'tenant_id': 1,
    'slabs': [
        {
            'from': 0,
            'to': 1200000,
            'rate': 0.00
        },
        ...
    ],
    'cached_at': '2026-01-24 10:00:00',
    'expires_at': '2026-01-24 22:00:00'
}

Cache Invalidation:
├── On slab update
├── On slab creation
├── On slab deletion
└── After expiry time (12 hours)
```

### Multi-Year Slab Support

```
Tax Year Transitions
═══════════════════

2025 Slabs:
├── Slab 1: 0 - 1,000,000 @ 0%
├── Slab 2: 1,000,001 - 1,500,000 @ 5%
└── Slab 3: 1,500,001+ @ 10%

2026 Slabs (new rates):
├── Slab 1: 0 - 1,200,000 @ 0%
├── Slab 2: 1,200,001 - 1,700,000 @ 6%
└── Slab 3: 1,700,001+ @ 12%

Employee Payment (December 2025):
└── Use 2025 slabs

Employee Payment (January 2026):
└── Use 2026 slabs (automatic)
```

### Slab Boundary Handling

```
Income at Boundary
═════════════════

Case 1: Exactly at boundary
Income: 1,200,000
├── Falls in Slab 1 (0 - 1,200,000)
└── Tax rate: 0%

Case 2: Just above boundary
Income: 1,200,001
├── Falls in Slab 2 (1,200,001 - 1,700,000)
└── Tax rate: 6% (only on amount above 1.2M)

Case 3: Far above boundary
Income: 2,500,000
├── Multiple slabs apply
└── Progressive calculation
```

### Expected Outcome
- Efficient slab lookup
- Caching for performance
- Multi-year support
- Slab validation
- Effective rate calculation

### Verification Checklist
- [ ] get_applicable_slabs implemented
- [ ] Year filtering working
- [ ] Tenant filtering working
- [ ] Slab ordering correct
- [ ] Caching implemented
- [ ] find_slab_for_amount added
- [ ] Slab validation added
- [ ] get_effective_rate implemented
- [ ] Multi-year support

---

## Task 75: Create Salary Comparison Service

### Overview
Create a salary comparison service within SalaryService to compare two salary structures (e.g., before and after revision). This service provides detailed breakdowns showing differences in components, gross salary, statutory contributions, and net pay.

### Dependencies
- Tasks 65-69: SalaryService implementation
- Tasks 70-72: Calculator services
- EmployeeSalary with components

### Instructions

1. **Open salary_service.py file**
   - Locate SalaryService class
   - Add comparison methods

2. **Add compare_salaries method**
   - Accept old_salary_id parameter
   - Accept new_salary_id parameter
   - Accept tenant parameter
   - Return comparison dictionary

3. **Load both salary records**
   - Query EmployeeSalary for old salary
   - Query EmployeeSalary for new salary
   - Prefetch all components

4. **Compare gross salaries**
   - Get old gross
   - Get new gross
   - Calculate difference (absolute and percentage)
   - Add to comparison result

5. **Compare components**
   - Iterate through all components
   - Find matching components
   - Calculate differences
   - Identify new/removed components

6. **Calculate statutory changes**
   - Compare EPF employee contributions
   - Compare EPF employer contributions
   - Compare ETF contributions
   - Compare PAYE amounts

7. **Calculate net salary changes**
   - Old net = old gross - old deductions
   - New net = new gross - new deductions
   - Calculate difference
   - Add to comparison result

8. **Format comparison output**
   - Structure as nested dictionary
   - Include all relevant metrics
   - Add percentage changes
   - Return formatted result

### Salary Comparison Flow

```
┌─────────────────────────────────────────────────────────┐
│         Salary Comparison Flow                          │
└─────────────────────────────────────────────────────────┘

    Old Salary ID + New Salary ID
        │
        ▼
    ┌─────────────────────────┐
    │  Load Salary Records    │
    │  • Get old salary       │
    │  • Get new salary       │
    │  • Load components      │
    └───────────┬─────────────┘
                │
                ▼
    ┌─────────────────────────┐
    │  Compare Gross          │
    │  • Old gross            │
    │  • New gross            │
    │  • Difference           │
    │  • % change             │
    └───────────┬─────────────┘
                │
                ▼
    ┌─────────────────────────┐
    │  Compare Components     │
    │  • Match components     │
    │  • Calculate changes    │
    │  • New components       │
    │  • Removed components   │
    └───────────┬─────────────┘
                │
                ▼
    ┌─────────────────────────┐
    │  Compare Statutory      │
    │  • EPF changes          │
    │  • ETF changes          │
    │  • PAYE changes         │
    └───────────┬─────────────┘
                │
                ▼
    ┌─────────────────────────┐
    │  Compare Net Salary     │
    │  • Old net              │
    │  • New net              │
    │  • Net change           │
    └───────────┬─────────────┘
                │
                ▼
    Return Comparison Dictionary
```

### Comparison Output Structure

```python
comparison_result = {
    'summary': {
        'old_gross': Decimal('175000.00'),
        'new_gross': Decimal('192500.00'),
        'gross_change': Decimal('17500.00'),
        'gross_change_percent': Decimal('10.00'),
        'old_net': Decimal('156884.00'),
        'new_net': Decimal('172160.40'),
        'net_change': Decimal('15276.40'),
        'net_change_percent': Decimal('9.74')
    },
    'components': [
        {
            'name': 'Basic Salary',
            'old_amount': Decimal('150000.00'),
            'new_amount': Decimal('165000.00'),
            'change': Decimal('15000.00'),
            'change_percent': Decimal('10.00')
        },
        {
            'name': 'Fixed Allowance',
            'old_amount': Decimal('15000.00'),
            'new_amount': Decimal('16500.00'),
            'change': Decimal('1500.00'),
            'change_percent': Decimal('10.00')
        }
    ],
    'statutory': {
        'epf_employee': {
            'old': Decimal('13200.00'),
            'new': Decimal('14520.00'),
            'change': Decimal('1320.00')
        },
        'epf_employer': {
            'old': Decimal('19800.00'),
            'new': Decimal('21780.00'),
            'change': Decimal('1980.00')
        },
        'etf': {
            'old': Decimal('4950.00'),
            'new': Decimal('5445.00'),
            'change': Decimal('495.00')
        },
        'paye': {
            'old': Decimal('4916.00'),
            'new': Decimal('5819.60'),
            'change': Decimal('903.60')
        }
    },
    'employer_cost': {
        'old_total': Decimal('199750.00'),
        'new_total': Decimal('219725.00'),
        'change': Decimal('19975.00'),
        'change_percent': Decimal('10.00')
    }
}
```

### Comparison Example: Annual Increment

```
Salary Comparison Report
═══════════════════════

Employee: John Doe
Comparison: 2025 vs 2026 Salary
Reason: Annual Increment (10%)

GROSS SALARY:
═════════════
Old (2025):             175,000.00
New (2026):             192,500.00
Change:                 +17,500.00  (+10.00%)

COMPONENT BREAKDOWN:
═══════════════════

Basic Salary:
├── Old: 150,000.00
├── New: 165,000.00
└── Change: +15,000.00 (+10.00%)

Fixed Allowance:
├── Old: 15,000.00
├── New: 16,500.00
└── Change: +1,500.00 (+10.00%)

Performance Bonus:
├── Old: 10,000.00
├── New: 11,000.00
└── Change: +1,000.00 (+10.00%)

STATUTORY DEDUCTIONS:
════════════════════

EPF Employee (8%):
├── Old: 13,200.00
├── New: 14,520.00
└── Change: +1,320.00

PAYE Tax:
├── Old: 4,916.00
├── New: 5,819.60
└── Change: +903.60

Total Deductions:
├── Old: 18,116.00
├── New: 20,339.60
└── Change: +2,223.60

NET SALARY:
═══════════
Old (2025):             156,884.00
New (2026):             172,160.40
Change:                 +15,276.40  (+9.74%)

EMPLOYER COSTS:
═══════════════

EPF Employer (12%):
├── Old: 19,800.00
├── New: 21,780.00
└── Change: +1,980.00

ETF (3%):
├── Old: 4,950.00
├── New: 5,445.00
└── Change: +495.00

Total Employer Cost:
├── Old: 199,750.00  (Gross + EPF + ETF)
├── New: 219,725.00
└── Change: +19,975.00 (+10.00%)
```

### Component Matching Logic

```
Component Matching Strategy
══════════════════════════

Old Salary Components:
├── Basic Salary (ID: 10)
├── Fixed Allowance (ID: 11)
└── Transport (ID: 12)

New Salary Components:
├── Basic Salary (ID: 20)
├── Fixed Allowance (ID: 21)
└── Project Allowance (ID: 22) [NEW]

Matching:
═════════
Basic Salary:
├── Old ID: 10, Amount: 150,000
├── New ID: 20, Amount: 165,000
└── Match: By component name ✓

Fixed Allowance:
├── Old ID: 11, Amount: 15,000
├── New ID: 21, Amount: 16,500
└── Match: By component name ✓

Transport:
├── Old ID: 12, Amount: 10,000
├── New: Not found
└── Status: REMOVED

Project Allowance:
├── Old: Not found
├── New ID: 22, Amount: 20,000
└── Status: NEW
```

### Comparison Use Cases

| Scenario | Old Salary | New Salary | Purpose |
|----------|------------|------------|---------|
| Annual increment | 2025 structure | 2026 structure | Review raise |
| Promotion | Current role | New role | Evaluate promotion |
| Allowance adjustment | Before adjustment | After adjustment | Impact analysis |
| Template change | Template A | Template B | Compare templates |
| Negotiation | Current offer | Counter offer | Decision making |

### Expected Outcome
- Comprehensive salary comparison
- Component-level changes
- Statutory impact analysis
- Net salary calculation
- Formatted comparison report

### Verification Checklist
- [ ] compare_salaries method added
- [ ] Both salaries loaded correctly
- [ ] Gross comparison implemented
- [ ] Component matching logic
- [ ] New/removed component detection
- [ ] Statutory calculations
- [ ] Net salary comparison
- [ ] Percentage changes calculated
- [ ] Output properly structured

---

## Task 76: Create Salary Export Service

### Overview
Create a salary export service to generate salary reports in various formats (CSV, Excel, PDF). This service enables exporting salary data for payroll processing, reporting, auditing, and compliance purposes.

### Dependencies
- SalaryService and all calculators
- Export libraries (csv, openpyxl, reportlab)
- EmployeeSalary with components

### Instructions

1. **Create export_service.py file**
   - Create file at `apps/payroll/services/export_service.py`
   - This will contain export functionality

2. **Import required modules**
   - Import csv module
   - Import openpyxl for Excel
   - Import date utilities
   - Import models and calculators

3. **Define SalaryExportService class**
   - Create class with comprehensive docstring
   - Document export formats and options

4. **Implement export_to_csv method**
   - Accept employee list and date range
   - Accept tenant parameter
   - Generate CSV with salary data
   - Return file path or content

5. **Implement export_to_excel method**
   - Create workbook
   - Add salary summary sheet
   - Add component breakdown sheet
   - Add statutory calculations sheet
   - Return Excel file

6. **Implement export_payroll_register method**
   - Export complete payroll register
   - Include all employees
   - Show gross, deductions, net
   - Format for payroll processing

7. **Implement export_statutory_report method**
   - Export EPF/ETF report
   - Export PAYE report
   - Format for statutory submissions
   - Return formatted reports

8. **Add filtering options**
   - Filter by department
   - Filter by date range
   - Filter by employee status
   - Filter by salary range

9. **Add customization options**
   - Select columns to include
   - Choose sort order
   - Set number formats
   - Configure headers/footers

10. **Update services __init__.py**
    - Import SalaryExportService
    - Add to __all__ list

### Export Service Structure

```
┌─────────────────────────────────────────────────┐
│        SalaryExportService Class                │
├─────────────────────────────────────────────────┤
│ Export Methods:                                 │
│  • export_to_csv(employees, options)            │
│  • export_to_excel(employees, options)          │
│  • export_payroll_register(date_range)          │
│  • export_statutory_report(type, date_range)    │
│                                                 │
│ Formatting Methods:                             │
│  • format_currency(amount)                      │
│  • format_percentage(rate)                      │
│  • format_date(date)                            │
│                                                 │
│ Helper Methods:                                 │
│  • apply_filters(queryset, filters)             │
│  • sort_results(data, sort_by)                  │
│  • calculate_totals(employees)                  │
└─────────────────────────────────────────────────┘
```

### CSV Export Format

```csv
Employee ID,Employee Name,Department,Basic Salary,Allowances,Gross Salary,EPF Employee,PAYE,Total Deductions,Net Salary,EPF Employer,ETF,Employer Cost
EMP001,John Doe,Sales,150000.00,25000.00,175000.00,13200.00,4916.00,18116.00,156884.00,19800.00,4950.00,199750.00
EMP002,Jane Smith,Marketing,120000.00,18000.00,138000.00,10800.00,3156.00,13956.00,124044.00,16200.00,4050.00,158250.00
EMP003,Bob Wilson,IT,180000.00,30000.00,210000.00,15600.00,6783.00,22383.00,187617.00,23400.00,5850.00,239250.00
,,,,,TOTALS:,523000.00,39600.00,14855.00,54455.00,468545.00,59400.00,14850.00,597250.00
```

### Excel Export Structure

```
Workbook: Payroll_Export_January_2026.xlsx
══════════════════════════════════════════

Sheet 1: Salary Summary
┌─────────────┬──────────────┬────────────┬─────────────┐
│ Employee ID │ Name         │ Gross      │ Net         │
├─────────────┼──────────────┼────────────┼─────────────┤
│ EMP001      │ John Doe     │ 175,000.00 │ 156,884.00  │
│ EMP002      │ Jane Smith   │ 138,000.00 │ 124,044.00  │
│ EMP003      │ Bob Wilson   │ 210,000.00 │ 187,617.00  │
├─────────────┼──────────────┼────────────┼─────────────┤
│             │ TOTAL        │ 523,000.00 │ 468,545.00  │
└─────────────┴──────────────┴────────────┴─────────────┘

Sheet 2: Component Breakdown
┌─────────────┬──────────────┬────────┬───────────┬─────────┐
│ Employee ID │ Component    │ Type   │ Amount    │ Calc    │
├─────────────┼──────────────┼────────┼───────────┼─────────┤
│ EMP001      │ Basic Salary │ EARN   │ 150,000   │ FIXED   │
│ EMP001      │ Fixed Allow  │ EARN   │  15,000   │ FIXED   │
│ EMP001      │ EPF 8%       │ DED    │  13,200   │ %       │
└─────────────┴──────────────┴────────┴───────────┴─────────┘

Sheet 3: Statutory Summary
┌─────────────┬──────────┬──────────┬────────┬────────┐
│ Employee ID │ EPF Emp  │ EPF Empr │ ETF    │ PAYE   │
├─────────────┼──────────┼──────────┼────────┼────────┤
│ EMP001      │ 13,200   │ 19,800   │ 4,950  │ 4,916  │
│ EMP002      │ 10,800   │ 16,200   │ 4,050  │ 3,156  │
│ EMP003      │ 15,600   │ 23,400   │ 5,850  │ 6,783  │
├─────────────┼──────────┼──────────┼────────┼────────┤
│ TOTAL       │ 39,600   │ 59,400   │ 14,850 │ 14,855 │
└─────────────┴──────────┴──────────┴────────┴────────┘
```

### Payroll Register Export

```
PAYROLL REGISTER
Month: January 2026
Company: LankaCommerce Pvt Ltd
═══════════════════════════════════════════════════════════

┌─────┬────────────┬─────────────────┬───────────────────────────┬────────────────────────────┬─────────────┐
│ No. │ Employee   │ Earnings        │ Deductions                │ Employer Costs             │ Net Pay     │
│     │            ├────────┬────────┼──────┬──────┬──────┬──────┼──────┬──────┬──────┬──────┤             │
│     │            │ Basic  │ Allow  │ EPF  │ PAYE │ Other│ Total│ EPF  │ ETF  │ Other│ Total│             │
├─────┼────────────┼────────┼────────┼──────┼──────┼──────┼──────┼──────┼──────┼──────┼──────┼─────────────┤
│ 1   │ John Doe   │150,000 │ 25,000 │13,200│ 4,916│  -   │18,116│19,800│4,950 │  -   │24,750│ 156,884.00  │
│ 2   │ Jane Smith │120,000 │ 18,000 │10,800│ 3,156│  -   │13,956│16,200│4,050 │  -   │20,250│ 124,044.00  │
│ 3   │ Bob Wilson │180,000 │ 30,000 │15,600│ 6,783│  -   │22,383│23,400│5,850 │  -   │29,250│ 187,617.00  │
├─────┼────────────┼────────┼────────┼──────┼──────┼──────┼──────┼──────┼──────┼──────┼──────┼─────────────┤
│     │ TOTALS     │450,000 │ 73,000 │39,600│14,855│  -   │54,455│59,400│14,850│  -   │74,250│ 468,545.00  │
└─────┴────────────┴────────┴────────┴──────┴──────┴──────┴──────┴──────┴──────┴──────┴──────┴─────────────┘

Prepared by: ________________    Date: ________________
Approved by: ________________    Date: ________________
```

### Statutory Report Exports

#### EPF/ETF Submission Report
```
EPF/ETF CONTRIBUTION REPORT
Month: January 2026
Company: LankaCommerce Pvt Ltd
EPF No: EPF/12345
═══════════════════════════════════════════════════

┌─────┬────────────┬──────────┬──────────┬──────────┬──────────┬───────────┐
│ No. │ EPF Number │ Name     │ EPF Base │ EPF Emp  │ EPF Empr │ ETF       │
│     │            │          │          │ (8%)     │ (12%)    │ (3%)      │
├─────┼────────────┼──────────┼──────────┼──────────┼──────────┼───────────┤
│ 1   │ 12345678   │ John Doe │ 165,000  │ 13,200   │ 19,800   │ 4,950     │
│ 2   │ 23456789   │ Jane S.  │ 135,000  │ 10,800   │ 16,200   │ 4,050     │
│ 3   │ 34567890   │ Bob W.   │ 195,000  │ 15,600   │ 23,400   │ 5,850     │
├─────┼────────────┼──────────┼──────────┼──────────┼──────────┼───────────┤
│     │ TOTALS     │          │ 495,000  │ 39,600   │ 59,400   │ 14,850    │
└─────┴────────────┴──────────┴──────────┴──────────┴──────────┴───────────┘

Total EPF: 99,000.00 (Employee: 39,600.00 + Employer: 59,400.00)
Total ETF: 14,850.00

Payment Due Date: February 15, 2026
```

#### PAYE Tax Report
```
PAYE TAX DEDUCTION REPORT
Month: January 2026
Company: LankaCommerce Pvt Ltd
TIN: 123456789V
═══════════════════════════════════════════════════

┌─────┬──────────┬────────────┬─────────────┬──────────────┬─────────────┐
│ No. │ NIC      │ Name       │ Monthly     │ Annual       │ Monthly     │
│     │          │            │ Taxable     │ Projected    │ PAYE        │
├─────┼──────────┼────────────┼─────────────┼──────────────┼─────────────┤
│ 1   │ 801234567V│ John Doe  │ 161,800.00  │ 1,941,600.00 │ 4,916.00    │
│ 2   │ 851234567V│ Jane Smith│ 127,200.00  │ 1,526,400.00 │ 3,156.00    │
│ 3   │ 901234567V│ Bob Wilson│ 194,400.00  │ 2,332,800.00 │ 6,783.00    │
├─────┼──────────┼────────────┼─────────────┼──────────────┼─────────────┤
│     │          │ TOTALS     │ 483,400.00  │ 5,800,800.00 │ 14,855.00   │
└─────┴──────────┴────────────┴─────────────┴──────────────┴─────────────┘

Payment Due Date: February 15, 2026
```

### Export Options Configuration

```python
export_options = {
    'format': 'excel',  # csv, excel, pdf
    'include_columns': [
        'employee_id',
        'employee_name',
        'gross_salary',
        'deductions',
        'net_salary'
    ],
    'filters': {
        'department': 'Sales',
        'date_from': '2026-01-01',
        'date_to': '2026-01-31',
        'min_salary': 100000,
        'max_salary': 500000
    },
    'sort_by': 'employee_name',  # employee_id, gross_salary, etc.
    'sort_order': 'asc',  # asc or desc
    'include_totals': True,
    'include_summary': True,
    'page_size': 'A4',
    'orientation': 'landscape'
}
```

### Export Use Cases

| Report Type | Format | Frequency | Purpose |
|-------------|--------|-----------|---------|
| Payroll Register | Excel | Monthly | Salary processing |
| EPF/ETF Report | CSV | Monthly | Statutory submission |
| PAYE Report | PDF | Monthly | Tax authority |
| Salary Slips | PDF | Monthly | Employee distribution |
| Department Analysis | Excel | Quarterly | Cost analysis |
| Annual Summary | PDF | Yearly | Audit and records |

### Expected Outcome
- Multi-format export capability
- Payroll register generation
- Statutory report exports
- Customizable options
- Formatted outputs

### Verification Checklist
- [ ] export_service.py file created
- [ ] SalaryExportService class defined
- [ ] export_to_csv implemented
- [ ] export_to_excel implemented
- [ ] export_payroll_register implemented
- [ ] export_statutory_report implemented
- [ ] Filtering options working
- [ ] Formatting applied correctly
- [ ] Totals calculated properly
- [ ] Services __init__.py updated

---

## Summary

This document implemented statutory calculators and reporting services:

### Completed Functionality
- ✅ EPFCalculator - Employee Provident Fund calculations
- ✅ ETFCalculator - Employees' Trust Fund calculations
- ✅ PAYECalculator - Pay As You Earn tax calculations
- ✅ Annual tax projection
- ✅ Tax slab lookup and management
- ✅ Salary comparison service
- ✅ Salary export service

### Key Achievements
1. **Statutory Compliance** - EPF, ETF, PAYE per Sri Lankan law
2. **Accurate Calculations** - Progressive tax, ceiling support
3. **Tax Management** - Slab lookup, projections, effective rates
4. **Comparison Tools** - Before/after analysis
5. **Export Capability** - CSV, Excel, statutory reports

### Service Summary
| Service | Primary Function | Regulatory |
|---------|-----------------|------------|
| EPFCalculator | EPF contributions (8% + 12%) | ✅ Mandatory |
| ETFCalculator | ETF contributions (3%) | ✅ Mandatory |
| PAYECalculator | Progressive income tax | ✅ Mandatory |
| Comparison | Salary change analysis | ❌ Internal |
| Export | Reporting and submissions | ✅ Required |

### Regulatory Compliance
- ✅ EPF rates: Employee 8%, Employer 12%
- ✅ ETF rate: Employer 3%
- ✅ PAYE: Progressive tax slabs
- ✅ Ceiling support for high earners
- ✅ Export formats for statutory submissions

---

**Document Status:** ✅ Complete  
**Total Tasks:** 7  
**Estimated Time:** 180 minutes
