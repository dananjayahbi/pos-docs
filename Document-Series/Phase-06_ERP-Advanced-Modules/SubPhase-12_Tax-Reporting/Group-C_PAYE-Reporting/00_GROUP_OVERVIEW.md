# Group C: PAYE Reporting

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 12 - Tax Reporting  
> **Group:** C of F  
> **Tasks Covered:** 35-50  
> **Group Goal:** Implement PAYE return generation with employee schedules and tax bracket reporting

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-B_VAT-Return](../Group-B_VAT-Return/)
- **→ Next Group:** [Group-D_EPF-ETF-Returns](../Group-D_EPF-ETF-Returns/)

---

## Group Overview

This group implements PAYE (Pay As You Earn) tax return generation for Sri Lanka income tax compliance. Creates the PAYEReturn model to track monthly employee count, total remuneration, and total PAYE deducted. Implements PAYEReturnGenerator to fetch payroll data, apply tax brackets, and generate employee schedules. Creates IRD T-10 form format PDF and CSV exports with year-to-date tracking.

### Key Outcomes

- PAYEReturn model with period link
- Total employees count field
- Total remuneration (taxable salaries)
- Total PAYE deducted field
- Employee details JSONField
- PAYEReturnGenerator service class
- Get payroll data method
- Tax bracket calculation method
- Employee schedule generation
- PAYE return PDF template (T-10 form)
- CSV export for IRD submission
- PAYE summary by tax bracket
- Year-to-date PAYE tracking
- API endpoint for PAYE returns

### Technology Context

- **Tax Brackets:** Sri Lanka progressive tax slabs
- **T-10 Form:** Monthly PAYE return format
- **Payroll Integration:** Data from Payroll Processing
- **YTD Tracking:** Cumulative per employee

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-35-41_PAYEReturn-Model.md` | Create PAYEReturn model with all fields | 35-41 |
| 02 | `02_Tasks-42-50_PAYEReturn-Generator.md` | Create PAYEReturnGenerator with calculations and exports | 42-50 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 35 | Create PAYEReturn Model | Medium | Task 34 |
| 36 | Add PAYE Period FK | Low | Task 35 |
| 37 | Add Total Employees Field | Low | Task 35 |
| 38 | Add Total Remuneration | Low | Task 35 |
| 39 | Add Total PAYE Deducted | Low | Task 35 |
| 40 | Add Employee Details JSON | Medium | Task 35 |
| 41 | Run PAYEReturn Migrations | Low | Task 40 |
| 42 | Create PAYEReturnGenerator | High | Task 41 |
| 43 | Add Get Payroll Data Method | Medium | Task 42 |
| 44 | Add Calculate Tax Brackets | High | Task 43 |
| 45 | Add Employee Schedule Method | Medium | Task 44 |
| 46 | Create PAYE Return PDF Template | Medium | Task 45 |
| 47 | Create PAYE CSV Export | Medium | Task 46 |
| 48 | Add PAYE Summary by Bracket | Medium | Task 47 |
| 49 | Add Year-to-Date Tracking | Medium | Task 48 |
| 50 | Create PAYE Return API Endpoint | Low | Task 49 |

---

## Execution Order

```
Task 35: Create PAYEReturn Model
    │
    ├─────────────────────────────────────────┐
    ▼                                         ▼
Task 36: Period FK    Tasks 37-40: PAYE Fields
    │                 (Employees, Remuneration, 
    │                  PAYE, Employee Details)
    │                         │
    └─────────────────────────┘
                  │
                  ▼
             Task 41: Run Migrations
                  │
                  ▼
             Task 42: Create PAYEReturnGenerator
                  │
                  ▼
             Task 43: Get Payroll Data
                  │
                  ▼
             Task 44: Calculate Tax Brackets
                  │
                  ▼
             Task 45: Employee Schedule
                  │
                  ▼
             Task 46: PDF Template
                  │
                  ▼
             Task 47: CSV Export
                  │
                  ▼
             Task 48: Summary by Bracket
                  │
                  ▼
             Task 49: Year-to-Date Tracking
                  │
                  ▼
             Task 50: API Endpoint
```

---

## Expected Deliverables

```
apps/accounting/
├── tax/
│   ├── __init__.py
│   ├── enums.py
│   └── generators/
│       ├── __init__.py
│       ├── vat_return.py
│       └── paye_return.py     # PAYEReturnGenerator
├── models/
│   ├── vat_return.py
│   └── paye_return.py         # PAYEReturn model
├── templates/
│   └── tax/
│       ├── vat_return.html
│       └── paye_return.html   # T-10 form template
├── views/
│   └── tax.py                 # Add PAYE endpoint
├── serializers/
│   ├── vat_return.py
│   └── paye_return.py         # PAYEReturn serializer
└── migrations/
    └── 0020_payereturn.py
```

---

## Notes for AI Agents

### Sri Lanka PAYE Tax Brackets (2024/25)
| Annual Income (LKR) | Tax Rate |
|---------------------|----------|
| First 1,200,000 | 0% |
| Next 500,000 | 6% |
| Next 500,000 | 12% |
| Next 500,000 | 18% |
| Next 500,000 | 24% |
| Next 500,000 | 30% |
| Balance | 36% |

### Monthly PAYE Calculation
- Calculate annual taxable income
- Apply progressive tax brackets
- Divide by 12 for monthly deduction
- Consider YTD payments for accuracy

### PAYE Return Structure (T-10 Form)
```
MONTHLY PAYE RETURN - T-10

Employer TIN: XXXXXXXXX
Period: January 2026

SUMMARY
Total Number of Employees: 50
Total Remuneration: 5,000,000 LKR
Total PAYE Deducted: 450,000 LKR

EMPLOYEE SCHEDULE (Attached)
```

### Employee Details JSON Structure
```json
{
  "employees": [
    {
      "nic": "XXXXXXXXXX",
      "name": "Employee Name",
      "basic_salary": 100000,
      "allowances": 20000,
      "gross_salary": 120000,
      "epf_employee": 9600,
      "taxable_income": 110400,
      "paye_deducted": 8500,
      "ytd_paye": 25500
    }
  ]
}
```

### Filing Deadline
- 15th of the following month
- Example: January PAYE due by February 15th

### Year-to-Date Tracking Purpose
- Accurate bracket application
- Avoid over/under deduction
- Year-end reconciliation
- Employee statements
