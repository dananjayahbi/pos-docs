# SubPhase 05: Salary Structure - Tasks Summary

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase Index:** 05 of 14  
> **SubPhase Goal:** Define pay components, allowances, and deductions for payroll  
> **Total Tasks:** 86 | **Status:** Planning  
> **Estimated Duration:** 12-14 hours

---

## Navigation

- **↑ Parent:** [00_SUBPHASES_SUMMARY.md](../00_SUBPHASES_SUMMARY.md)
- **← Previous SubPhase:** [SubPhase-04_Leave-Management](../SubPhase-04_Leave-Management/)
- **→ Next SubPhase:** [SubPhase-06_Payroll-Processing](../SubPhase-06_Payroll-Processing/)

---

## SubPhase Overview

This sub-phase implements the salary structure configuration for payroll processing. Defines earnings components (basic, allowances, bonuses), deductions (EPF, loans), and employer contributions (EPF, ETF) as per Sri Lanka labor law compliance.

### Key Outcomes
- Salary component types (Earnings, Deductions, Contributions)
- Pre-defined Sri Lanka statutory components (EPF 8%/12%, ETF 3%)
- Configurable allowances (Transport, Medical, etc.)
- Salary template/grade creation
- Employee salary assignment
- Salary history tracking
- Effective date management for salary changes
- Tax slab configuration for PAYE

### Technology Context
- **Backend:** Django 5.x with DRF for API
- **Calculations:** Decimal for precision
- **Frontend:** Next.js 14+ with TypeScript
- **Compliance:** Sri Lanka EPF/ETF Act, PAYE

### Dependencies
- Phase-06 SubPhase-01: Employee model
- Phase-06 SubPhase-02: Designation model (for salary grades)

---

## Task Execution Order

```
TASK GROUP A: Salary Component Models (Tasks 01-18)
        │
        ▼
TASK GROUP B: Salary Template & Grades (Tasks 19-34)
        │
        ▼
TASK GROUP C: Employee Salary Assignment (Tasks 35-48)
        │
        ▼
TASK GROUP D: Statutory Components (EPF/ETF/PAYE) (Tasks 49-64)
        │
        ▼
TASK GROUP E: Services & Calculations (Tasks 65-76)
        │
        ▼
TASK GROUP F: API, Testing & Documentation (Tasks 77-86)
```

---

## Task Index

### Group A: Salary Component Models (Tasks 01-18)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 01 | **Create payroll Django App** | Create new Django app for payroll/salary | None | 🔴 Not Created |
| 02 | **Register payroll App** | Add payroll app to TENANT_APPS | Task 01 | 🔴 Not Created |
| 03 | **Define ComponentType Choices** | Create enum: EARNING, DEDUCTION, EMPLOYER_CONTRIBUTION | Task 01 | 🔴 Not Created |
| 04 | **Define CalculationType Choices** | Create enum: FIXED, PERCENTAGE_OF_BASIC, PERCENTAGE_OF_GROSS, FORMULA | Task 01 | 🔴 Not Created |
| 05 | **Define ComponentCategory Choices** | Create enum: BASIC, ALLOWANCE, BONUS, STATUTORY, LOAN, TAX, OTHER | Task 01 | 🔴 Not Created |
| 06 | **Create SalaryComponent Model Core** | Define component with name, code, component_type | Task 05 | 🔴 Not Created |
| 07 | **Add Component Category Field** | Add category using ComponentCategory | Task 06 | 🔴 Not Created |
| 08 | **Add Calculation Fields** | Add calculation_type, value, percentage, formula | Task 06 | 🔴 Not Created |
| 09 | **Add Taxable Flag** | Add is_taxable boolean for PAYE calculation | Task 06 | 🔴 Not Created |
| 10 | **Add EPF Applicable Flag** | Add is_epf_applicable for EPF base | Task 06 | 🔴 Not Created |
| 11 | **Add Fixed/Variable Flag** | Add is_fixed boolean (fixed vs attendance-based) | Task 06 | 🔴 Not Created |
| 12 | **Add Active Flag** | Add is_active boolean | Task 06 | 🔴 Not Created |
| 13 | **Add Display Order** | Add display_order for payslip arrangement | Task 06 | 🔴 Not Created |
| 14 | **Add Description Field** | Add description for component explanation | Task 06 | 🔴 Not Created |
| 15 | **Create Component Indexes** | Add indexes for code, category, type | Task 06 | 🔴 Not Created |
| 16 | **Run SalaryComponent Migrations** | Generate and apply migrations | Task 15 | 🔴 Not Created |
| 17 | **Create Statutory Components Seed** | Seed EPF Employee, EPF Employer, ETF | Task 16 | 🔴 Not Created |
| 18 | **Create Common Allowances Seed** | Seed Transport, Medical, Housing allowances | Task 17 | 🔴 Not Created |

---

### Group B: Salary Template & Grades (Tasks 19-34)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 19 | **Create SalaryTemplate Model** | Template/grade for grouping components | Task 18 | 🔴 Not Created |
| 20 | **Add Template Core Fields** | Add name, code, description | Task 19 | 🔴 Not Created |
| 21 | **Add Template Designation Link** | Add designation FK (optional) | Task 19 | 🔴 Not Created |
| 22 | **Add Template Status Field** | Add is_active boolean | Task 19 | 🔴 Not Created |
| 23 | **Run SalaryTemplate Migrations** | Generate and apply migrations | Task 22 | 🔴 Not Created |
| 24 | **Create TemplateComponent Model** | Link components to template | Task 23 | 🔴 Not Created |
| 25 | **Add Template Component Fields** | Add template FK, component FK | Task 24 | 🔴 Not Created |
| 26 | **Add Default Value Field** | Add default_value for template | Task 24 | 🔴 Not Created |
| 27 | **Add Override Fields** | Add can_override, min_value, max_value | Task 24 | 🔴 Not Created |
| 28 | **Run TemplateComponent Migrations** | Generate and apply migrations | Task 27 | 🔴 Not Created |
| 29 | **Create SalaryGrade Model** | Grade/band with salary ranges | Task 28 | 🔴 Not Created |
| 30 | **Add Grade Core Fields** | Add name, code, level | Task 29 | 🔴 Not Created |
| 31 | **Add Grade Salary Range** | Add min_salary, max_salary | Task 29 | 🔴 Not Created |
| 32 | **Add Grade Template Link** | Add template FK | Task 29 | 🔴 Not Created |
| 33 | **Run SalaryGrade Migrations** | Generate and apply migrations | Task 32 | 🔴 Not Created |
| 34 | **Create Default Grades Seed** | Seed sample salary grades | Task 33 | 🔴 Not Created |

---

### Group C: Employee Salary Assignment (Tasks 35-48)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 35 | **Create EmployeeSalary Model** | Assign salary to employee | Task 34 | 🔴 Not Created |
| 36 | **Add Employee FK** | Add employee ForeignKey | Task 35 | 🔴 Not Created |
| 37 | **Add Template FK** | Add salary_template FK (optional) | Task 35 | 🔴 Not Created |
| 38 | **Add Basic Salary Field** | Add basic_salary DecimalField | Task 35 | 🔴 Not Created |
| 39 | **Add Gross Salary Field** | Add gross_salary (calculated) | Task 35 | 🔴 Not Created |
| 40 | **Add Effective Date Fields** | Add effective_from, effective_to | Task 35 | 🔴 Not Created |
| 41 | **Add Current Flag** | Add is_current boolean | Task 35 | 🔴 Not Created |
| 42 | **Run EmployeeSalary Migrations** | Generate and apply migrations | Task 41 | 🔴 Not Created |
| 43 | **Create EmployeeSalaryComponent Model** | Employee-specific component values | Task 42 | 🔴 Not Created |
| 44 | **Add Salary Component Fields** | Add employee_salary FK, component FK, amount | Task 43 | 🔴 Not Created |
| 45 | **Run EmployeeSalaryComponent Migrations** | Generate and apply migrations | Task 44 | 🔴 Not Created |
| 46 | **Create Salary Assignment Signal** | Create history on salary change | Task 45 | 🔴 Not Created |
| 47 | **Create SalaryHistory Model** | Track salary changes over time | Task 46 | 🔴 Not Created |
| 48 | **Run SalaryHistory Migrations** | Generate and apply migrations | Task 47 | 🔴 Not Created |

---

### Group D: Statutory Components (EPF/ETF/PAYE) (Tasks 49-64)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 49 | **Create EPFSettings Model** | EPF rate configuration | Task 48 | 🔴 Not Created |
| 50 | **Add EPF Rate Fields** | Add employee_rate (8%), employer_rate (12%) | Task 49 | 🔴 Not Created |
| 51 | **Add EPF Ceiling Field** | Add max_contribution ceiling (if any) | Task 49 | 🔴 Not Created |
| 52 | **Run EPFSettings Migrations** | Generate and apply migrations | Task 51 | 🔴 Not Created |
| 53 | **Create ETFSettings Model** | ETF rate configuration | Task 52 | 🔴 Not Created |
| 54 | **Add ETF Rate Field** | Add employer_rate (3%) | Task 53 | 🔴 Not Created |
| 55 | **Run ETFSettings Migrations** | Generate and apply migrations | Task 54 | 🔴 Not Created |
| 56 | **Create PAYETaxSlab Model** | Tax slabs for PAYE calculation | Task 55 | 🔴 Not Created |
| 57 | **Add Tax Slab Fields** | Add from_amount, to_amount, rate | Task 56 | 🔴 Not Created |
| 58 | **Add Tax Year Field** | Add tax_year for annual slabs | Task 56 | 🔴 Not Created |
| 59 | **Run PAYETaxSlab Migrations** | Generate and apply migrations | Task 58 | 🔴 Not Created |
| 60 | **Create Current Tax Slabs Seed** | Seed Sri Lanka PAYE slabs | Task 59 | 🔴 Not Created |
| 61 | **Create TaxExemption Model** | Tax exemptions configuration | Task 59 | 🔴 Not Created |
| 62 | **Add Exemption Fields** | Add name, annual_amount, monthly_amount | Task 61 | 🔴 Not Created |
| 63 | **Run TaxExemption Migrations** | Generate and apply migrations | Task 62 | 🔴 Not Created |
| 64 | **Create Default Exemptions Seed** | Seed personal relief, etc. | Task 63 | 🔴 Not Created |

---

### Group E: Services & Calculations (Tasks 65-76)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 65 | **Create SalaryService Class** | Main service for salary operations | Task 64 | 🔴 Not Created |
| 66 | **Implement Assign Template** | Assign salary template to employee | Task 65 | 🔴 Not Created |
| 67 | **Implement Override Component** | Override component value for employee | Task 65 | 🔴 Not Created |
| 68 | **Implement Calculate Gross** | Calculate gross salary from components | Task 65 | 🔴 Not Created |
| 69 | **Implement Salary Revision** | Create new salary with effective date | Task 65 | 🔴 Not Created |
| 70 | **Create EPFCalculator Service** | Calculate EPF contributions | Task 65 | 🔴 Not Created |
| 71 | **Create ETFCalculator Service** | Calculate ETF contribution | Task 65 | 🔴 Not Created |
| 72 | **Create PAYECalculator Service** | Calculate PAYE tax | Task 65 | 🔴 Not Created |
| 73 | **Implement Annual Tax Projection** | Project annual tax from monthly | Task 72 | 🔴 Not Created |
| 74 | **Implement Tax Slab Lookup** | Find applicable tax rate | Task 72 | 🔴 Not Created |
| 75 | **Create Salary Comparison Service** | Compare salaries pre/post revision | Task 65 | 🔴 Not Created |
| 76 | **Create Salary Export Service** | Export salary data for reports | Task 65 | 🔴 Not Created |

---

### Group F: API, Testing & Documentation (Tasks 77-86)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 77 | **Create SalaryComponentSerializer** | DRF serializer for components | Task 76 | 🔴 Not Created |
| 78 | **Create SalaryTemplateSerializer** | DRF serializer for templates | Task 77 | 🔴 Not Created |
| 79 | **Create EmployeeSalarySerializer** | DRF serializer for employee salary | Task 77 | 🔴 Not Created |
| 80 | **Create SalaryComponentViewSet** | ViewSet for component CRUD | Task 79 | 🔴 Not Created |
| 81 | **Create SalaryTemplateViewSet** | ViewSet for template management | Task 80 | 🔴 Not Created |
| 82 | **Create EmployeeSalaryViewSet** | ViewSet for salary assignment | Task 80 | 🔴 Not Created |
| 83 | **Add Salary Actions** | Custom actions: assign, revise, compare | Task 82 | 🔴 Not Created |
| 84 | **Register Salary API URLs** | Add all endpoints to URL config | Task 83 | 🔴 Not Created |
| 85 | **Create Salary Module Tests** | Unit and integration tests | Task 84 | 🔴 Not Created |
| 86 | **Create Salary Documentation** | API docs, component configuration guide | Task 85 | 🔴 Not Created |

---

## Expected File Structure

```
backend/apps/payroll/
├── __init__.py
├── admin.py                    # Admin for Salary models
├── apps.py                     # App configuration
├── models/
│   ├── __init__.py
│   ├── salary_component.py    # SalaryComponent model
│   ├── salary_template.py     # SalaryTemplate model
│   ├── template_component.py  # TemplateComponent model
│   ├── salary_grade.py        # SalaryGrade model
│   ├── employee_salary.py     # EmployeeSalary model
│   ├── salary_history.py      # SalaryHistory model
│   ├── epf_settings.py        # EPFSettings model
│   ├── etf_settings.py        # ETFSettings model
│   ├── paye_slab.py           # PAYETaxSlab model
│   └── tax_exemption.py       # TaxExemption model
├── services/
│   ├── __init__.py
│   ├── salary_service.py      # Salary operations
│   ├── epf_calculator.py      # EPF calculations
│   ├── etf_calculator.py      # ETF calculations
│   ├── paye_calculator.py     # PAYE tax calculations
│   └── export_service.py      # Export service
├── serializers/
│   ├── __init__.py
│   ├── component_serializer.py
│   ├── template_serializer.py
│   └── employee_salary_serializer.py
├── views/
│   ├── __init__.py
│   ├── component_viewset.py
│   ├── template_viewset.py
│   └── employee_salary_viewset.py
├── filters.py                  # Salary filtering
├── urls.py                     # URL routing
├── signals.py                  # Salary change signals
├── tests/
│   ├── __init__.py
│   ├── test_models.py
│   ├── test_epf_etf.py
│   ├── test_paye.py
│   └── test_api.py
├── management/
│   └── commands/
│       ├── seed_components.py
│       ├── seed_grades.py
│       └── seed_tax_slabs.py
└── migrations/
```

---

## Salary Structure Diagram

```
EARNINGS (Taxable/Non-Taxable):
─────────────────────────────────────────────────────────
│ Basic Salary              │ ✅ Taxable │ ✅ EPF Base │
│ Transport Allowance       │ ✅ Taxable │ ❌ EPF Base │
│ Medical Allowance         │ ❌ Taxable │ ❌ EPF Base │
│ Housing Allowance         │ ✅ Taxable │ ❌ EPF Base │
│ Overtime Pay              │ ✅ Taxable │ ✅ EPF Base │
│ Bonus                     │ ✅ Taxable │ ❌ EPF Base │
│ Commission                │ ✅ Taxable │ ❌ EPF Base │
─────────────────────────────────────────────────────────

DEDUCTIONS (Employee):
─────────────────────────────────────────────────────────
│ EPF Employee (8%)         │ Statutory               │
│ PAYE Tax                  │ Statutory               │
│ Loan Repayment            │ Company                 │
│ Advance Deduction         │ Company                 │
│ No-Pay Deduction          │ Attendance-based        │
─────────────────────────────────────────────────────────

EMPLOYER CONTRIBUTIONS:
─────────────────────────────────────────────────────────
│ EPF Employer (12%)        │ Statutory               │
│ ETF (3%)                  │ Statutory               │
─────────────────────────────────────────────────────────
```

---

## Sri Lanka EPF/ETF Rates

```
EPF (Employees' Provident Fund):
─────────────────────────────────────
Employee Contribution:     8% of EPF-applicable earnings
Employer Contribution:    12% of EPF-applicable earnings
Total EPF:                20% of EPF-applicable earnings

ETF (Employees' Trust Fund):
─────────────────────────────────────
Employer Contribution:     3% of EPF-applicable earnings

EPF-APPLICABLE BASE:
- Basic Salary: ✅
- Fixed Allowances: ✅ (Transport, etc.)
- Variable Earnings: ✅ (Overtime)
- Reimbursements: ❌
- Bonuses: ❌ (typically)
```

---

## PAYE Tax Slabs (Sample)

```
Sri Lanka PAYE Tax Slabs (2024):
─────────────────────────────────────
Annual Income          | Tax Rate
-----------------------|----------
Up to LKR 1,200,000    |    0%
LKR 1,200,001 - 1,700,000 |   6%
LKR 1,700,001 - 2,200,000 |  12%
LKR 2,200,001 - 2,700,000 |  18%
LKR 2,700,001 - 3,200,000 |  24%
LKR 3,200,001 - 3,700,000 |  30%
Over LKR 3,700,000     |  36%

Personal Relief: LKR 1,200,000/year
```

---

## Salary Calculation Example

```
EMPLOYEE: John Doe
GRADE: Senior Developer (Grade 5)

EARNINGS:
─────────────────────────────────────
Basic Salary:           LKR 150,000
Transport Allowance:    LKR  15,000
Medical Allowance:      LKR  10,000
Overtime (10 hrs):      LKR   8,500
─────────────────────────────────────
GROSS SALARY:           LKR 183,500

DEDUCTIONS:
─────────────────────────────────────
EPF Employee (8%):      LKR  12,000  (on Basic 150K)
PAYE Tax:               LKR   5,250
─────────────────────────────────────
TOTAL DEDUCTIONS:       LKR  17,250

NET SALARY:             LKR 166,250

EMPLOYER COST:
─────────────────────────────────────
EPF Employer (12%):     LKR  18,000
ETF (3%):               LKR   4,500
─────────────────────────────────────
TOTAL CTC:              LKR 206,000
```

---

## Key Business Rules

1. **Basic Salary Required:** Every employee must have basic salary
2. **EPF Base:** Define which components are EPF-applicable
3. **Taxable Components:** Mark components as taxable for PAYE
4. **Effective Date:** Salary changes apply from effective date
5. **Only One Current:** Only one current salary per employee
6. **Template Override:** Components can be overridden per employee
7. **Audit Trail:** Track all salary changes with history

---

## Progress Tracking

| Metric | Count |
|--------|-------|
| Total Tasks | 86 |
| Tasks Completed | 0 |
| Tasks In Progress | 0 |
| Completion Percentage | 0% |

**Last Updated:** 2026-01-17  
**Next Action:** Create Task 01 (payroll Django App)

---

## Notes for AI Agents

- Use Decimal for all financial calculations
- EPF/ETF rates may change - keep configurable
- PAYE slabs updated annually - support versioning
- Salary history critical for audits
- Consider currency handling (LKR default)
- Gross salary is sum of all earnings
- Net salary is gross minus deductions
- Employer cost includes employer contributions

---

*End of SubPhase 05 Tasks Summary*
