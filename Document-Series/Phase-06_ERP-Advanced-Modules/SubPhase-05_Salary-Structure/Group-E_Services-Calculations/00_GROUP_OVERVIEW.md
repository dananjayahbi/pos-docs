# Group E: Services & Calculations

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 05 - Salary Structure  
> **Group:** E of F  
> **Tasks Covered:** 65-76  
> **Group Goal:** Implement salary services and statutory calculations

---

## Navigation

- **↑ Parent:** [SubPhase-05 Summary](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group D: Statutory Components (EPF/ETF/PAYE)](../Group-D_Statutory-Components-EPF-ETF-PAYE/)
- **→ Next Group:** [Group F: API, Testing & Documentation](../Group-F_API-Testing-Documentation/)

---

## Group Overview

### Key Outcomes

1. **SalaryService Class** - Main service for salary operations
2. **Assign Template** - Assign salary template to employee
3. **Override Component** - Override component value
4. **Calculate Gross** - Calculate gross from components
5. **Salary Revision** - Create revision with effective date
6. **EPFCalculator Service** - Calculate EPF contributions
7. **ETFCalculator Service** - Calculate ETF contribution
8. **PAYECalculator Service** - Calculate PAYE tax
9. **Annual Tax Projection** - Project annual from monthly
10. **Tax Slab Lookup** - Find applicable tax rate
11. **Salary Comparison Service** - Compare pre/post revision
12. **Salary Export Service** - Export salary data

### Technology Context

| Technology | Purpose |
|------------|---------|
| Service Layer | Business logic |
| Decimal | Financial precision |
| Calculators | Statutory calculations |
| Export | Report generation |

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | `01_Tasks-65-69_SalaryService.md` | 65-69 | SalaryService, template assignment, revision |
| 02 | `02_Tasks-70-76_Calculators-Export.md` | 70-76 | EPF, ETF, PAYE calculators, comparison, export |

---

## Task Summary

| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 65 | Create SalaryService Class | High | 35 min |
| 66 | Implement Assign Template | Medium | 25 min |
| 67 | Implement Override Component | Medium | 25 min |
| 68 | Implement Calculate Gross | Medium | 25 min |
| 69 | Implement Salary Revision | High | 30 min |
| 70 | Create EPFCalculator Service | High | 30 min |
| 71 | Create ETFCalculator Service | Medium | 20 min |
| 72 | Create PAYECalculator Service | High | 35 min |
| 73 | Implement Annual Tax Projection | Medium | 25 min |
| 74 | Implement Tax Slab Lookup | Medium | 20 min |
| 75 | Create Salary Comparison Service | Medium | 25 min |
| 76 | Create Salary Export Service | Medium | 25 min |

---

## Execution Order

```
[Tasks 65-69: SalaryService operations]
         │
         ▼
[Tasks 70-76: Calculators, comparison, export]
```

---

## Expected Deliverables

```
apps/payroll/
├── services/
│   ├── __init__.py
│   ├── salary_service.py         # Tasks 65-69, 75
│   ├── epf_calculator.py         # Task 70
│   ├── etf_calculator.py         # Task 71
│   ├── paye_calculator.py        # Tasks 72-74
│   └── export_service.py         # Task 76
```

---

## Notes for AI Agents

### SalaryService Methods
- assign_template(employee_id, template_id, effective_from)
- override_component(salary_id, component_id, value)
- calculate_gross(salary_id)
- create_revision(employee_id, data, effective_from, reason)
- get_current_salary(employee_id)
- get_salary_for_date(employee_id, date)
- compare_salaries(old_salary_id, new_salary_id)

### Assign Template Flow
```
1. Create new EmployeeSalary record
2. Copy TemplateComponents to EmployeeSalaryComponent
3. Apply default values from template
4. Calculate gross_salary
5. Set as current (is_current=True)
6. Close previous salary if exists
7. Create SalaryHistory entry
```

### Override Component Flow
```
1. Find EmployeeSalaryComponent
2. Validate can_override=True
3. Validate within min/max range
4. Update amount
5. Set is_overridden=True
6. Recalculate gross_salary
7. Create SalaryHistory entry
```

### Calculate Gross
```
Gross = Sum of all EARNING components

for component in salary.components:
    if component.type == EARNING:
        if component.calculation_type == FIXED:
            gross += component.amount
        elif component.calculation_type == PERCENTAGE_OF_BASIC:
            gross += basic * (component.percentage / 100)
        # ... other calculation types
```

### EPFCalculator Methods
- calculate_employee_epf(epf_base)
- calculate_employer_epf(epf_base)
- calculate_total_epf(epf_base)
- get_epf_base(salary)

### EPF Calculation
```
EPF Base:
- Sum of is_epf_applicable=True components
- Typically: Basic + Fixed Allowances

Employee EPF = EPF Base × 8%
Employer EPF = EPF Base × 12%

Example:
EPF Base: 165,000
Employee EPF: 165,000 × 0.08 = 13,200
Employer EPF: 165,000 × 0.12 = 19,800
```

### ETFCalculator Methods
- calculate_etf(epf_base)
- get_etf_base(salary) (same as EPF base)

### ETF Calculation
```
ETF = EPF Base × 3%

Example:
EPF Base: 165,000
ETF: 165,000 × 0.03 = 4,950
```

### PAYECalculator Methods
- calculate_monthly_paye(monthly_taxable)
- calculate_annual_paye(annual_taxable)
- project_annual_tax(monthly_income)
- get_applicable_slabs(tax_year)
- get_tax_exemptions(employee_id)

### PAYE Tax Calculation
```
1. Calculate taxable income:
   Taxable = Gross - EPF Employee - Exemptions

2. Apply progressive slabs:
   For each slab:
     taxable_in_slab = min(taxable, slab.to) - slab.from
     tax += taxable_in_slab × slab.rate

3. Divide by 12 for monthly
```

### Annual Tax Projection
```
Monthly Income: 200,000
Projected Annual: 200,000 × 12 = 2,400,000

Apply annual slabs to projected income.
Divide result by 12 for monthly tax.
```

### Salary Comparison
```json
{
  "old_salary": {
    "basic": 150000,
    "gross": 195000
  },
  "new_salary": {
    "basic": 165000,
    "gross": 213000
  },
  "change": {
    "basic": 15000,
    "gross": 18000,
    "basic_percentage": 10.0,
    "gross_percentage": 9.23
  },
  "component_changes": [
    {
      "component": "Basic Salary",
      "old": 150000,
      "new": 165000,
      "change": 15000
    }
  ]
}
```

### Salary Export
```
Export formats:
- Excel (for HR)
- CSV (for payroll systems)
- PDF (for records)

Export content:
- Employee details
- Current salary breakdown
- Statutory contributions
- Net salary
```

### Calculation Precision
```
All financial calculations use Decimal:
- Intermediate: 4 decimal places
- Final amounts: Round to 2 decimal places
- Percentages: 2 decimal places
```
