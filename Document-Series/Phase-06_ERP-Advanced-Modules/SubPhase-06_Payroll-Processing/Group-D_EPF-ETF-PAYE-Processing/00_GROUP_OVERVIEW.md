# Group D: EPF/ETF/PAYE Processing

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 06 - Payroll Processing  
> **Group:** D of F  
> **Tasks Covered:** 53-68  
> **Group Goal:** Implement EPF, ETF, and PAYE tax processing with Sri Lanka compliance

---

## Navigation

- **↑ Parent:** [SubPhase-06 Summary](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group C: Payroll Calculation Engine](../Group-C_Payroll-Calculation-Engine/)
- **→ Next Group:** [Group E: Approval & Finalization](../Group-E_Approval-Finalization/)

---

## Group Overview

### Key Outcomes

1. **EPFContribution Model** - Track EPF contributions per month
2. **EPF Fields** - employee_payroll FK, employee_amount, employer_amount
3. **EPF Base Field** - epf_base (applicable earnings)
4. **EPFContribution Migrations** - Apply migrations
5. **ETFContribution Model** - Track ETF contributions
6. **ETF Fields** - employee_payroll FK, employer_amount
7. **ETFContribution Migrations** - Apply migrations
8. **PAYECalculation Model** - Track PAYE tax calculations
9. **PAYE Fields** - taxable_income, tax_amount, ytd_tax
10. **PAYECalculation Migrations** - Apply migrations
11. **Implement EPF in Processor** - Integrate EPF calculation
12. **Implement ETF in Processor** - Integrate ETF calculation
13. **Implement PAYE in Processor** - Integrate PAYE calculation
14. **EPF Return Report** - Generate EPF return data
15. **ETF Return Report** - Generate ETF return data
16. **PAYE Return Report** - Generate PAYE return data

### Technology Context

| Technology | Purpose |
|------------|---------|
| Django ORM | Contribution models |
| Decimal | Precise calculations |
| Report Service | Statutory returns |
| Excel Export | Return file generation |

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | `01_Tasks-53-62_Contribution-Models.md` | 53-62 | EPF, ETF, PAYE models, migrations |
| 02 | `02_Tasks-63-68_Processor-Reports.md` | 63-68 | Processor integration, return reports |

---

## Task Summary

| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 53 | Create EPFContribution Model | Medium | 25 min |
| 54 | Add EPF Fields | Medium | 20 min |
| 55 | Add EPF Base Field | Low | 15 min |
| 56 | Run EPFContribution Migrations | Low | 15 min |
| 57 | Create ETFContribution Model | Medium | 20 min |
| 58 | Add ETF Fields | Low | 15 min |
| 59 | Run ETFContribution Migrations | Low | 15 min |
| 60 | Create PAYECalculation Model | Medium | 25 min |
| 61 | Add PAYE Fields | Medium | 20 min |
| 62 | Run PAYECalculation Migrations | Low | 15 min |
| 63 | Implement EPF in Processor | High | 30 min |
| 64 | Implement ETF in Processor | Medium | 20 min |
| 65 | Implement PAYE in Processor | High | 35 min |
| 66 | Create EPF Return Report | High | 35 min |
| 67 | Create ETF Return Report | Medium | 25 min |
| 68 | Create PAYE Return Report | High | 30 min |

---

## Execution Order

```
[Tasks 53-62: EPF, ETF, PAYE models, migrations]
         │
         ▼
[Tasks 63-68: Processor integration, reports]
```

---

## Expected Deliverables

```
apps/payroll/
├── models/
│   ├── epf_contribution.py       # Tasks 53-55
│   ├── etf_contribution.py       # Tasks 57-58
│   └── paye_calculation.py       # Tasks 60-61
├── services/
│   ├── payroll_processor.py      # Tasks 63-65 (extend)
│   └── statutory_reports.py      # Tasks 66-68
└── migrations/
    ├── 0017_epf_contribution.py  # Task 56
    ├── 0018_etf_contribution.py  # Task 59
    └── 0019_paye_calculation.py  # Task 62
```

---

## Notes for AI Agents

### EPFContribution Model Fields
- employee_payroll: FK to EmployeePayroll
- epf_number: CharField (employee's EPF number)
- epf_base: Decimal (EPF-applicable earnings)
- employee_amount: Decimal (8% contribution)
- employer_amount: Decimal (12% contribution)
- total_amount: Decimal (20% total)
- calculation_date: DateField
- notes: TextField

### EPF Calculation
```
EPF-Applicable Earnings:
├── Basic Salary (pro-rata)
├── Fixed Allowances (if EPF applicable)
└── Overtime (if EPF applicable)
────────────────────────────────────
EPF Base: 165,000

Employee EPF: 165,000 × 8% = 13,200
Employer EPF: 165,000 × 12% = 19,800
Total EPF: 33,000
```

### ETFContribution Model Fields
- employee_payroll: FK to EmployeePayroll
- etf_base: Decimal (same as EPF base)
- employer_amount: Decimal (3%)
- calculation_date: DateField

### ETF Calculation
```
ETF Base = EPF Base (same calculation)
Employer ETF: 165,000 × 3% = 4,950
```

### PAYECalculation Model Fields
- employee_payroll: FK to EmployeePayroll
- gross_income: Decimal
- epf_deduction: Decimal (employee EPF)
- exemptions: JSONField (applied exemptions)
- taxable_income: Decimal
- tax_slabs_applied: JSONField (slab breakdown)
- monthly_tax: Decimal
- ytd_gross: Decimal
- ytd_tax: Decimal
- annual_projected_tax: Decimal
- calculation_date: DateField

### PAYE Calculation Flow
```
1. Gross Taxable = Gross - Non-taxable items
2. Annual Projection = Monthly × 12
3. Less Exemptions:
   - Personal Relief: 1,200,000
   - EPF Deduction: employee_epf × 12
4. Taxable Income = Annual - Exemptions
5. Apply Tax Slabs (progressive)
6. Monthly Tax = Annual Tax / 12
```

### Tax Slabs Applied JSON
```json
{
  "slabs": [
    {"from": 0, "to": 1200000, "rate": 0, "tax": 0},
    {"from": 1200001, "to": 1700000, "rate": 6, "tax": 30000},
    {"from": 1700001, "to": 2000000, "rate": 12, "tax": 36000}
  ],
  "total_annual_tax": 66000,
  "monthly_tax": 5500
}
```

### Processor Integration
```
process_employee():
  # ... existing calculations
  
  # Calculate EPF
  epf_base = calculate_epf_base(line_items)
  epf_employee = epf_base * 0.08
  epf_employer = epf_base * 0.12
  create_epf_contribution(...)
  
  # Calculate ETF
  etf_amount = epf_base * 0.03
  create_etf_contribution(...)
  
  # Calculate PAYE
  taxable = gross - non_taxable - epf_employee
  paye_tax = calculate_paye(taxable, employee)
  create_paye_calculation(...)
```

### EPF Return Report (C Form)
```
EPF Return Format:
─────────────────────────────────────────────────────────
Employer: Lanka Commerce Pvt Ltd
Employer EPF No: EP/2345
Month: January 2026
─────────────────────────────────────────────────────────
EPF No    | Name        | EPF Base   | Employee | Employer
123456    | John Doe    | 165,000    | 13,200   | 19,800
123457    | Jane Smith  | 145,000    | 11,600   | 17,400
─────────────────────────────────────────────────────────
TOTAL                     310,000      24,800     37,200
```

### ETF Return Report
```
ETF Return Format:
─────────────────────────────────────────────────────────
Employer: Lanka Commerce Pvt Ltd
ETF No: ETF/6789
Month: January 2026
─────────────────────────────────────────────────────────
Member No | Name        | ETF Base   | Contribution
E123456   | John Doe    | 165,000    | 4,950
E123457   | Jane Smith  | 145,000    | 4,350
─────────────────────────────────────────────────────────
TOTAL                     310,000      9,300
```

### PAYE Return Report
```
PAYE Return Format:
─────────────────────────────────────────────────────────
Employer: Lanka Commerce Pvt Ltd
TIN: 123456789
Month: January 2026
─────────────────────────────────────────────────────────
NIC No       | Name        | Gross      | Tax
891234567V   | John Doe    | 200,000    | 5,500
901234567V   | Jane Smith  | 180,000    | 4,200
─────────────────────────────────────────────────────────
TOTAL                       380,000      9,700
```

### Report Export Formats
- Excel (.xlsx) - For submission
- PDF - For records
- CSV - For data import
- XML - For online submission (future)
