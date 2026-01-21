# Group A: Salary Component Models

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 05 - Salary Structure  
> **Group:** A of F  
> **Tasks Covered:** 01-18  
> **Group Goal:** Create payroll Django app with SalaryComponent model and seed data

---

## Navigation

- **↑ Parent:** [SubPhase-05 Summary](../00_TASKS_SUMMARY.md)
- **→ Next Group:** [Group B: Salary Template & Grades](../Group-B_Salary-Template-Grades/)

---

## Group Overview

### Key Outcomes

1. **Payroll Django App** - New Django app for payroll/salary
2. **App Registration** - Register payroll in TENANT_APPS
3. **ComponentType Choices** - EARNING, DEDUCTION, EMPLOYER_CONTRIBUTION
4. **CalculationType Choices** - FIXED, PERCENTAGE_OF_BASIC, PERCENTAGE_OF_GROSS, FORMULA
5. **ComponentCategory Choices** - BASIC, ALLOWANCE, BONUS, STATUTORY, LOAN, TAX, OTHER
6. **SalaryComponent Model Core** - name, code, component_type
7. **Component Category Field** - category using ComponentCategory
8. **Calculation Fields** - calculation_type, value, percentage, formula
9. **Taxable Flag** - is_taxable for PAYE calculation
10. **EPF Applicable Flag** - is_epf_applicable for EPF base
11. **Fixed/Variable Flag** - is_fixed (fixed vs attendance-based)
12. **Active Flag** - is_active boolean
13. **Display Order** - display_order for payslip arrangement
14. **Description Field** - description for explanation
15. **Component Indexes** - Indexes for code, category, type
16. **SalaryComponent Migrations** - Apply migrations
17. **Statutory Components Seed** - EPF Employee, EPF Employer, ETF
18. **Common Allowances Seed** - Transport, Medical, Housing

### Technology Context

| Technology | Purpose |
|------------|---------|
| Django ORM | SalaryComponent model |
| Decimal | Financial precision |
| Choice Fields | Type, category enums |
| Management Command | Seed data |

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | `01_Tasks-01-09_App-Component-Core.md` | 01-09 | Django app, choices, core model fields |
| 02 | `02_Tasks-10-18_Flags-Index-Seed.md` | 10-18 | EPF, fixed flags, indexes, seed data |

---

## Task Summary

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

## Execution Order

```
[Tasks 01-09: Django app, choices, core model]
         │
         ▼
[Tasks 10-18: Flags, indexes, seed data]
```

---

## Expected Deliverables

```
apps/payroll/
├── __init__.py
├── apps.py                       # Tasks 01-02
├── constants.py                  # Tasks 03-05
├── models/
│   ├── __init__.py
│   └── salary_component.py       # Tasks 06-15
├── management/
│   └── commands/
│       └── seed_components.py    # Tasks 17-18
└── migrations/
    └── 0001_salary_component.py  # Task 16
```

---

## Notes for AI Agents

### ComponentType Choices
| Type | Description |
|------|-------------|
| EARNING | Adds to gross (Basic, Allowances) |
| DEDUCTION | Deducts from gross (EPF, Tax, Loans) |
| EMPLOYER_CONTRIBUTION | Employer cost (EPF Employer, ETF) |

### CalculationType Choices
| Type | Description |
|------|-------------|
| FIXED | Fixed amount (e.g., 15000) |
| PERCENTAGE_OF_BASIC | % of basic (e.g., 8%) |
| PERCENTAGE_OF_GROSS | % of gross |
| FORMULA | Custom formula expression |

### ComponentCategory Choices
| Category | Description |
|----------|-------------|
| BASIC | Basic salary |
| ALLOWANCE | Transport, Medical, Housing |
| BONUS | Performance bonus, 13th month |
| STATUTORY | EPF, ETF, PAYE |
| LOAN | Loan repayments |
| TAX | Tax deductions |
| OTHER | Other components |

### SalaryComponent Model Fields
- name: CharField (e.g., "Basic Salary")
- code: CharField (unique, e.g., "BASIC")
- component_type: ComponentType choice
- category: ComponentCategory choice
- calculation_type: CalculationType choice
- default_value: Decimal (for FIXED)
- percentage: Decimal (for percentage types)
- formula: TextField (for FORMULA type)
- is_taxable: Boolean
- is_epf_applicable: Boolean
- is_fixed: Boolean (vs attendance-based)
- is_active: Boolean
- display_order: Integer
- description: TextField

### Taxable vs Non-Taxable
```
Taxable (is_taxable=True):
- Basic Salary
- Transport Allowance
- Overtime
- Bonus

Non-Taxable (is_taxable=False):
- Medical Allowance (up to limit)
- Reimbursements
```

### EPF Applicable
```
EPF Base (is_epf_applicable=True):
- Basic Salary
- Fixed Allowances
- Overtime

Not EPF Base (is_epf_applicable=False):
- Bonus
- Reimbursements
- One-time payments
```

### Fixed vs Variable
```
Fixed (is_fixed=True):
- Basic Salary (same every month)
- Transport Allowance

Variable (is_fixed=False):
- Overtime Pay (attendance-based)
- Commission (performance-based)
- No-Pay Deduction
```

### Statutory Components Seed
| Name | Code | Type | Calc Type | Value |
|------|------|------|-----------|-------|
| EPF Employee | EPF_EMP | DEDUCTION | PERCENTAGE_OF_BASIC | 8% |
| EPF Employer | EPF_EMP_CONTRIB | EMPLOYER_CONTRIBUTION | PERCENTAGE_OF_BASIC | 12% |
| ETF | ETF | EMPLOYER_CONTRIBUTION | PERCENTAGE_OF_BASIC | 3% |
| PAYE Tax | PAYE | DEDUCTION | FORMULA | tax_formula |

### Common Allowances Seed
| Name | Code | Type | Category | Taxable | EPF |
|------|------|------|----------|---------|-----|
| Transport Allowance | TRANSPORT | EARNING | ALLOWANCE | Yes | No |
| Medical Allowance | MEDICAL | EARNING | ALLOWANCE | No | No |
| Housing Allowance | HOUSING | EARNING | ALLOWANCE | Yes | No |
| Meal Allowance | MEAL | EARNING | ALLOWANCE | No | No |

### Display Order
```
Payslip display order:
1. Basic Salary (order=10)
2. Allowances (order=20-30)
3. Overtime (order=40)
4. Bonus (order=50)
5. Gross (calculated)
6. Deductions (order=100+)
7. Net (calculated)
```
