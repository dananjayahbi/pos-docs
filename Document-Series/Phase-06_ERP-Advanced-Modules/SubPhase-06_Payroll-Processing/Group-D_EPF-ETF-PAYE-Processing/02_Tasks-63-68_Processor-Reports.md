# Tasks 63-68: Processor Integration and Statutory Reports

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 06 - Payroll Processing  
> **Group:** D - EPF/ETF/PAYE Processing  
> **Document:** 02 of 02  
> **Tasks Covered:** 63, 64, 65, 66, 67, 68

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-53-62_Contribution-Models.md](01_Tasks-53-62_Contribution-Models.md)

---

## Document Overview

This document covers integrating EPF, ETF, and PAYE calculations into the payroll processor and creating statutory return reports for compliance with Sri Lanka labor and tax regulations.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 63 | Implement EPF in Processor | High | 30 min |
| 64 | Implement ETF in Processor | Medium | 20 min |
| 65 | Implement PAYE in Processor | High | 35 min |
| 66 | Create EPF Return Report | High | 35 min |
| 67 | Create ETF Return Report | Medium | 25 min |
| 68 | Create PAYE Return Report | High | 30 min |

---

## Task 63: Implement EPF in Processor

### Overview
Integrate EPF contribution calculation into the PayrollProcessor service, calculating both employee and employer contributions based on EPF-applicable earnings.

### Dependencies
- EPFContribution model created and migrated
- PayrollProcessor service exists
- Earnings calculation implemented

### Instructions

1. **Add calculate_epf method to PayrollProcessor**
   - Create method in `services/payroll_processor.py`
   - Accept employee_payroll and line_items parameters
   - Return EPFContribution instance

2. **Calculate EPF base**
   - Iterate through earning line items
   - Filter components where is_epf_applicable=True
   - Sum applicable earning amounts
   - Store as epf_base

3. **Get EPF rates**
   - Retrieve employee rate (default 8%)
   - Retrieve employer rate (default 12%)
   - Allow configuration override from settings

4. **Calculate employee EPF**
   - Employee EPF = EPF Base × Employee Rate (8%)
   - Use Decimal precision
   - Round to 2 decimal places

5. **Calculate employer EPF**
   - Employer EPF = EPF Base × Employer Rate (12%)
   - Use Decimal precision
   - Round to 2 decimal places

6. **Calculate total EPF**
   - Total = Employee EPF + Employer EPF (20%)
   - Verify calculation accuracy

7. **Get employee EPF number**
   - Retrieve from Employee model
   - Use epf_number field if available

8. **Create EPFContribution record**
   - Create new EPFContribution instance
   - Set employee_payroll FK
   - Set epf_base, amounts, rates
   - Set calculation_date from payroll period
   - Save record

9. **Store base calculation details**
   - Build JSON structure with component breakdown
   - Include each EPF-applicable component
   - Save in base_calculation_details field

10. **Create deduction line item**
    - Create PayrollLineItem for employee EPF
    - Set line_type=DEDUCTION
    - Set amount to employee_amount
    - Link to EPF component

11. **Integrate into process_employee**
    - Call calculate_epf after earnings calculation
    - Pass calculated line items
    - Include employee EPF in deductions

### EPF Calculation Flow

```
1. Calculate EPF Base:
   - Sum all EPF-applicable earnings
   
2. Calculate Employee EPF (8%):
   - employee_epf = epf_base × 0.08
   
3. Calculate Employer EPF (12%):
   - employer_epf = epf_base × 0.12
   
4. Create EPFContribution record
   
5. Add employee EPF to deductions
```

### EPF-Applicable Components

Typically include:
- Basic salary (pro-rated)
- Fixed allowances marked as EPF-applicable
- Overtime pay (if configured as applicable)

Typically exclude:
- Reimbursements
- Transport allowances
- One-time bonuses

### Expected Outcome
- EPF calculated accurately
- Both employee and employer contributions tracked
- Employee EPF deducted from salary
- EPFContribution record created

### Verification Checklist
- [ ] calculate_epf method added to PayrollProcessor
- [ ] Calculates EPF base from applicable earnings
- [ ] Retrieves EPF rates
- [ ] Calculates employee EPF (8%)
- [ ] Calculates employer EPF (12%)
- [ ] Calculates total EPF (20%)
- [ ] Gets employee EPF number
- [ ] Creates EPFContribution record
- [ ] Stores base calculation details
- [ ] Creates deduction line item
- [ ] Integrated into process_employee

---

## Task 64: Implement ETF in Processor

### Overview
Integrate ETF contribution calculation into the PayrollProcessor service. ETF is an employer-only contribution with no employee deduction.

### Dependencies
- Task 63 completed (EPF calculation implemented)
- ETFContribution model exists

### Instructions

1. **Add calculate_etf method to PayrollProcessor**
   - Create method in PayrollProcessor service
   - Accept employee_payroll and epf_base parameters
   - Return ETFContribution instance

2. **Use EPF base for ETF**
   - ETF base typically same as EPF base
   - Accept epf_base from EPF calculation
   - No need to recalculate

3. **Get ETF rate**
   - Retrieve ETF rate (default 3%)
   - Allow configuration override

4. **Calculate employer ETF**
   - Employer ETF = ETF Base × ETF Rate (3%)
   - Use Decimal precision
   - Round to 2 decimal places

5. **Create ETFContribution record**
   - Create new ETFContribution instance
   - Set employee_payroll FK
   - Set etf_base (from EPF calculation)
   - Set employer_amount
   - Set etf_rate
   - Set calculation_date
   - Save record

6. **Store base calculation details**
   - Copy from EPF base details (same base)
   - Save in base_calculation_details field

7. **No deduction line item needed**
   - ETF is employer cost only
   - Not deducted from employee salary
   - Track in contribution record only

8. **Integrate into process_employee**
   - Call calculate_etf after EPF calculation
    - Pass epf_base from EPF calculation
   - ETF record created but no deduction

### ETF Calculation Flow

```
1. Use EPF Base (already calculated):
   - etf_base = epf_base
   
2. Calculate Employer ETF (3%):
   - employer_etf = etf_base × 0.03
   
3. Create ETFContribution record
   
4. No employee deduction (employer cost only)
```

### ETF Characteristics

- Employer contribution only
- Employee pays nothing
- Rate: 3% of ETF-eligible earnings
- ETF base same as EPF base
- Managed by Central Bank of Sri Lanka

### Expected Outcome
- ETF calculated using EPF base
- Employer contribution tracked
- No employee deduction
- ETFContribution record created

### Verification Checklist
- [ ] calculate_etf method added to PayrollProcessor
- [ ] Uses EPF base for calculation
- [ ] Retrieves ETF rate (3%)
- [ ] Calculates employer ETF
- [ ] Creates ETFContribution record
- [ ] Stores base calculation details
- [ ] No deduction line item created
- [ ] Integrated into process_employee

---

## Task 65: Implement PAYE in Processor

### Overview
Integrate PAYE (Pay As You Earn) tax calculation into the PayrollProcessor service, implementing Sri Lanka progressive income tax with exemptions and reliefs.

### Dependencies
- Task 63 completed (EPF calculation for deductible amount)
- PAYECalculation model exists
- Earnings and gross calculated

### Instructions

1. **Add calculate_paye method to PayrollProcessor**
   - Create method in PayrollProcessor service
   - Accept employee_payroll, gross_salary, epf_employee parameters
   - Return PAYECalculation instance

2. **Calculate gross taxable income**
   - Start with gross_salary
   - Subtract non-taxable components
   - Get monthly gross taxable

3. **Project annual income**
   - Annual Gross = Monthly Gross × 12
   - Used for tax slab application

4. **Calculate exemptions**
   - Personal relief: LKR 1,200,000 (configurable)
   - EPF employee deduction: epf_employee × 12
   - Other exemptions per policy
   - Sum total exemptions

5. **Calculate taxable income**
   - Annual Taxable = Annual Gross - Total Exemptions
   - Ensure not negative (minimum 0)

6. **Apply tax slabs**
   - Get tax slab configuration from settings
   - Apply progressive tax calculation
   - Track tax per slab

7. **Calculate annual tax**
   - Sum tax from all applicable slabs
   - Store slab breakdown in JSON

8. **Calculate monthly tax**
   - Monthly Tax = Annual Tax ÷ 12
   - Round to nearest rupee

9. **Calculate YTD amounts**
   - Get YTD gross from previous months
   - Get YTD tax from previous months
   - Add current month amounts

10. **Create PAYECalculation record**
    - Create new PAYECalculation instance
    - Set all income and tax fields
    - Set exemptions JSON
    - Set tax_slabs_applied JSON
    - Set YTD amounts
    - Save record

11. **Create deduction line item**
    - Create PayrollLineItem for PAYE tax
    - Set line_type=DEDUCTION
    - Set amount to monthly_tax
    - Link to PAYE component

12. **Integrate into process_employee**
    - Call calculate_paye after EPF calculation
    - Pass gross and EPF employee amount
    - Include PAYE in deductions

### PAYE Calculation Flow

```
1. Calculate Gross Taxable Income:
   - gross_taxable = gross_salary (exclude non-taxable)

2. Project Annual Income:
   - annual_income = gross_taxable × 12

3. Calculate Exemptions:
   - personal_relief = 1,200,000
   - epf_deduction = employee_epf × 12
   - total_exemptions = personal_relief + epf_deduction

4. Calculate Taxable Income:
   - taxable = annual_income - total_exemptions
   - taxable = max(0, taxable)

5. Apply Tax Slabs:
   - Apply progressive rates to income bands
   - Sum tax from all slabs

6. Calculate Monthly Tax:
   - monthly_tax = annual_tax ÷ 12
```

### Sri Lanka Tax Slabs Reference

| Annual Income | Rate | Tax on Band |
|---------------|------|-------------|
| 0 - 1,200,000 | 0% | 0 |
| 1,200,001 - 1,700,000 | 6% | Up to 30,000 |
| 1,700,001 - 2,200,000 | 12% | Up to 60,000 |
| 2,200,001 - 2,700,000 | 18% | Up to 90,000 |
| 2,700,001 - 3,200,000 | 24% | Up to 120,000 |
| 3,200,001+ | 36% | Unlimited |

### Tax Slabs JSON Structure

```json
{
  "slabs": [
    {"from": 0, "to": 1200000, "rate": 0, "income_in_slab": 0, "tax": 0},
    {"from": 1200001, "to": 1700000, "rate": 6, "income_in_slab": 500000, "tax": 30000},
    {"from": 1700001, "to": 2200000, "rate": 12, "income_in_slab": 200000, "tax": 24000}
  ],
  "total_taxable_income": 1900000,
  "total_annual_tax": 54000,
  "monthly_tax": 4500
}
```

### Exemptions JSON Structure

```json
{
  "personal_relief": 1200000,
  "epf_employee_deduction": 96000,
  "other_exemptions": 0,
  "total_exemptions": 1296000
}
```

### Expected Outcome
- PAYE tax calculated per Sri Lanka regulations
- Progressive tax slabs applied correctly
- Exemptions and reliefs deducted
- Monthly tax deducted from salary
- PAYECalculation record created

### Verification Checklist
- [ ] calculate_paye method added to PayrollProcessor
- [ ] Calculates gross taxable income
- [ ] Projects annual income
- [ ] Calculates exemptions
- [ ] Applies personal relief
- [ ] Deducts EPF employee contribution
- [ ] Calculates taxable income
- [ ] Applies tax slabs progressively
- [ ] Stores slab breakdown in JSON
- [ ] Calculates monthly tax
- [ ] Calculates YTD amounts
- [ ] Creates PAYECalculation record
- [ ] Creates deduction line item
- [ ] Integrated into process_employee

---

## Task 66: Create EPF Return Report

### Overview
Create service to generate EPF return report (C Form) for submission to EPF Department, showing all employee EPF contributions for the month.

### Dependencies
- Task 63 completed (EPF calculations in processor)
- EPFContribution records being created

### Instructions

1. **Create statutory reports service**
   - Create `services/statutory_reports.py` file
   - Import required models and libraries

2. **Add generate_epf_return method**
   - Accept period_id or payroll_run_id parameter
   - Accept format parameter (excel, pdf, csv)
   - Return file path or file content

3. **Query EPF contributions**
   - Get all EPFContribution records for period
   - Join with EmployeePayroll and Employee
   - Order by employee_id or epf_number

4. **Calculate totals**
   - Sum epf_base for all employees
   - Sum employee_amount (8%)
   - Sum employer_amount (12%)
   - Sum total_amount (20%)

5. **Get company EPF details**
   - Retrieve company EPF number
   - Get company name and address
   - Get period month and year

6. **Build report data structure**
   - Header: Company info, EPF number, period
   - Details: Each employee's EPF record
   - Footer: Totals

7. **Format employee records**
   - EPF number
   - Employee name
   - EPF base amount
   - Employee contribution
   - Employer contribution

8. **Generate Excel format**
   - Use openpyxl or xlsxwriter
   - Create worksheet with formatted data
   - Apply styling and formatting
   - Add formulas for totals

9. **Generate PDF format**
   - Use ReportLab or WeasyPrint
   - Create formatted PDF document
   - Add company letterhead
   - Include all EPF records

10. **Generate CSV format**
    - Simple comma-separated format
    - Include header row
    - One employee per line

11. **Save report file**
    - Save to media/reports/ directory
    - Use naming convention: EPF_YYYY_MM_CompanyName.xlsx
    - Return file path

### EPF Return Report Structure

```
EPF CONTRIBUTION RETURN - FORM C
─────────────────────────────────────────────────────────

Employer: Lanka Commerce Pvt Ltd
Employer EPF No: EP/2345/6789
Month: January 2026
Period: 01-Jan-2026 to 31-Jan-2026

─────────────────────────────────────────────────────────
EPF No    | Name           | EPF Base   | Employee | Employer | Total
─────────────────────────────────────────────────────────
123456    | John Doe       | 165,000    | 13,200   | 19,800   | 33,000
123457    | Jane Smith     | 145,000    | 11,600   | 17,400   | 29,000
123458    | Bob Wilson     | 175,000    | 14,000   | 21,000   | 35,000
─────────────────────────────────────────────────────────
TOTAL:                       485,000      38,800     58,200   | 97,000

─────────────────────────────────────────────────────────
Prepared by: HR Manager
Date: 25-Jan-2026
Signature: ___________________
```

### Report Fields

| Field | Description |
|-------|-------------|
| EPF No | Employee's EPF registration number |
| Name | Employee full name |
| EPF Base | EPF-applicable earnings |
| Employee | 8% employee contribution |
| Employer | 12% employer contribution |
| Total | Combined 20% contribution |

### Expected Outcome
- EPF return report generated
- All employees for period included
- Totals calculated correctly
- Multiple format support
- Ready for submission

### Verification Checklist
- [ ] statutory_reports.py service created
- [ ] generate_epf_return method added
- [ ] Queries EPFContribution records
- [ ] Joins with Employee data
- [ ] Calculates totals
- [ ] Gets company EPF details
- [ ] Formats employee records
- [ ] Generates Excel format
- [ ] Generates PDF format
- [ ] Generates CSV format
- [ ] Saves report file
- [ ] Returns file path

---

## Task 67: Create ETF Return Report

### Overview
Create ETF return report for submission to Central Bank, showing employer ETF contributions for all employees.

### Dependencies
- Task 64 completed (ETF calculations)
- Task 66 completed (EPF report for reference)

### Instructions

1. **Add generate_etf_return method**
   - Add to statutory_reports service
   - Accept period_id or run_id parameter
   - Accept format parameter
   - Return file path

2. **Query ETF contributions**
   - Get all ETFContribution records for period
   - Join with EmployeePayroll and Employee
   - Order by employee_id

3. **Calculate totals**
   - Sum etf_base for all employees
   - Sum employer_amount (3%)

4. **Get company ETF details**
   - Retrieve company ETF number
   - Get company name
   - Get period details

5. **Build report data structure**
   - Header: Company info, ETF number
   - Details: Each employee's ETF record
   - Footer: Totals

6. **Format employee records**
   - Employee number or ETF member number
   - Employee name
   - ETF base
   - Employer contribution (3%)

7. **Generate report formats**
   - Excel: Formatted worksheet
   - PDF: Formatted document
   - CSV: Simple comma-separated

8. **Save report file**
   - Save to media/reports/
   - Naming: ETF_YYYY_MM_CompanyName.xlsx
   - Return file path

### ETF Return Report Structure

```
ETF CONTRIBUTION RETURN
─────────────────────────────────────────────────────────

Employer: Lanka Commerce Pvt Ltd
ETF No: ETF/6789/0123
Month: January 2026

─────────────────────────────────────────────────────────
Member No | Name           | ETF Base   | Contribution (3%)
─────────────────────────────────────────────────────────
E123456   | John Doe       | 165,000    | 4,950
E123457   | Jane Smith     | 145,000    | 4,350
E123458   | Bob Wilson     | 175,000    | 5,250
─────────────────────────────────────────────────────────
TOTAL:                       485,000      14,550

─────────────────────────────────────────────────────────
Prepared by: HR Manager
Date: 25-Jan-2026
```

### Expected Outcome
- ETF return report generated
- Employer contributions tracked
- Multiple formats supported
- Ready for submission

### Verification Checklist
- [ ] generate_etf_return method added
- [ ] Queries ETFContribution records
- [ ] Calculates totals
- [ ] Gets company ETF details
- [ ] Formats employee records
- [ ] Generates Excel format
- [ ] Generates PDF format
- [ ] Generates CSV format
- [ ] Saves report file
- [ ] Returns file path

---

## Task 68: Create PAYE Return Report

### Overview
Create PAYE return report for Inland Revenue Department showing income tax withheld from all employees.

### Dependencies
- Task 65 completed (PAYE calculations)
- Tasks 66-67 completed (EPF/ETF reports for reference)

### Instructions

1. **Add generate_paye_return method**
   - Add to statutory_reports service
   - Accept period_id parameter
   - Accept format parameter
   - Return file path

2. **Query PAYE calculations**
   - Get all PAYECalculation records for period
   - Join with EmployeePayroll and Employee
   - Order by employee_id

3. **Calculate totals**
   - Sum gross_income for all employees
   - Sum taxable_income
   - Sum monthly_tax

4. **Get company tax details**
   - Retrieve company TIN (Tax Identification Number)
   - Get company name and address
   - Get period details

5. **Build report data structure**
   - Header: Company info, TIN, period
   - Details: Each employee's PAYE record
   - Footer: Totals and summary

6. **Format employee records**
   - Employee NIC number
   - Employee name
   - Gross income
   - Taxable income
   - Tax withheld

7. **Add tax slab summary**
   - Aggregate employees per tax slab
   - Show count and total tax per slab

8. **Generate report formats**
   - Excel: Formatted with multiple sheets
   - PDF: Professional tax return format
   - CSV: For data import
   - XML: For online submission (future)

9. **Save report file**
   - Save to media/reports/
   - Naming: PAYE_YYYY_MM_CompanyName.xlsx
   - Return file path

### PAYE Return Report Structure

```
PAYE RETURN
─────────────────────────────────────────────────────────

Employer: Lanka Commerce Pvt Ltd
TIN: 123-456-789-V
Month: January 2026

─────────────────────────────────────────────────────────
NIC No       | Name           | Gross      | Taxable   | Tax
─────────────────────────────────────────────────────────
891234567V   | John Doe       | 200,000    | 108,000   | 5,500
901234567V   | Jane Smith     | 180,000    | 88,000    | 4,200
881234567V   | Bob Wilson     | 220,000    | 128,000   | 6,800
─────────────────────────────────────────────────────────
TOTAL:                          600,000      324,000     16,500

TAX SLAB SUMMARY:
─────────────────────────────────────────────────────────
Slab                    | Employees | Total Tax
─────────────────────────────────────────────────────────
0% (0 - 1.2M)          | 5         | 0
6% (1.2M - 1.7M)       | 8         | 8,500
12% (1.7M - 2.2M)      | 4         | 6,000
18% (2.2M+)            | 3         | 2,000

─────────────────────────────────────────────────────────
Total Tax Withheld: LKR 16,500
Prepared by: HR Manager
Date: 25-Jan-2026
```

### Report Sections

| Section | Content |
|---------|---------|
| Header | Company details, TIN, period |
| Employee Details | Individual tax records |
| Totals | Sum of all amounts |
| Slab Summary | Aggregated by tax bracket |
| Footer | Preparation details |

### Expected Outcome
- PAYE return report generated
- All employee tax records included
- Tax slab summary provided
- Multiple formats supported
- Compliant with IRD requirements

### Verification Checklist
- [ ] generate_paye_return method added
- [ ] Queries PAYECalculation records
- [ ] Calculates totals
- [ ] Gets company TIN
- [ ] Formats employee records
- [ ] Includes NIC numbers
- [ ] Shows gross and taxable income
- [ ] Shows tax withheld
- [ ] Adds tax slab summary
- [ ] Generates Excel format
- [ ] Generates PDF format
- [ ] Generates CSV format
- [ ] Saves report file
- [ ] Returns file path

---

## Summary

This document covered processor integration and statutory reporting:

**Processor Integration (Tasks 63-65):**
- EPF calculation with 8% employee and 12% employer contributions
- ETF calculation with 3% employer-only contribution
- PAYE tax calculation with progressive slabs and exemptions
- All integrated into PayrollProcessor.process_employee workflow

**Statutory Reports (Tasks 66-68):**
- EPF Return Report (Form C) for EPF Department
- ETF Return Report for Central Bank
- PAYE Return Report for Inland Revenue Department
- Multiple format support (Excel, PDF, CSV)
- Professional formatting ready for submission

**Key Outcomes:**
- Complete Sri Lanka statutory compliance
- Accurate EPF, ETF, and PAYE calculations
- Automated return report generation
- Multi-format export capabilities
- Ready for regulatory submission

These implementations ensure full compliance with Sri Lanka labor and tax regulations for payroll processing.
