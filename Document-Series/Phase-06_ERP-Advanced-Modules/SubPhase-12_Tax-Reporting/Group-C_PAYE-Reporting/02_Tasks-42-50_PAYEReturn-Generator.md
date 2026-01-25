# Tasks 42-50: PAYEReturn Generator and Export Functionality

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 12 - Tax Reporting  
> **Group:** C - PAYE Reporting  
> **Document:** 02 of 02  
> **Tasks Covered:** 42, 43, 44, 45, 46, 47, 48, 49, 50

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-35-41_PAYEReturn-Model.md](01_Tasks-35-41_PAYEReturn-Model.md)

---

## Document Overview

This document covers the PAYEReturnGenerator service class responsible for generating monthly PAYE returns for Sri Lanka income tax compliance. Implements payroll data retrieval, progressive tax bracket calculations, employee schedule generation, T-10 form PDF export, CSV export for IRD submission, tax summary by bracket, year-to-date tracking, and API endpoint integration.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 42 | Create PAYEReturnGenerator | High | 45 min |
| 43 | Add Get Payroll Data Method | Medium | 30 min |
| 44 | Add Calculate Tax Brackets | High | 60 min |
| 45 | Add Employee Schedule Method | Medium | 35 min |
| 46 | Create PAYE Return PDF Template | Medium | 40 min |
| 47 | Create PAYE CSV Export | Medium | 30 min |
| 48 | Add PAYE Summary by Bracket | Medium | 25 min |
| 49 | Add Year-to-Date Tracking | Medium | 35 min |
| 50 | Create PAYE Return API Endpoint | Low | 20 min |

---

## Task 42: Create PAYEReturnGenerator

### Overview
Create the PAYEReturnGenerator service class to orchestrate PAYE return generation. This class manages the complete workflow of fetching payroll data, calculating tax brackets, generating employee schedules, and populating the PAYEReturn model with accurate monthly tax information.

### Dependencies
- Task 41 (PAYEReturn migrations) must be complete
- Payroll models must exist
- TaxPeriod model must exist

### Instructions

1. **Create generators directory**
   - Navigate to `apps/accounting/tax/` directory
   - Create `generators/` subdirectory if not exists
   - Create `__init__.py` in generators directory

2. **Create PAYE return generator module**
   - Create `paye_return.py` in generators directory
   - Import required Django and tenant dependencies
   - Import PAYEReturn model
   - Import Payroll models

3. **Define PAYEReturnGenerator class**
   - Create class with docstring explaining purpose
   - Initialize with tenant context
   - Store tenant reference for schema switching

4. **Add generate_return method**
   - Accept tax_period parameter
   - Create or retrieve PAYEReturn for period
   - Orchestrate all generation steps
   - Return populated PAYEReturn instance

5. **Add validation checks**
   - Verify tax period is valid
   - Check if return already finalized
   - Validate payroll data exists for period
   - Ensure tenant context is correct

6. **Add error handling**
   - Wrap operations in try-except blocks
   - Handle missing payroll data gracefully
   - Log generation errors for debugging
   - Raise descriptive exceptions

### Module Location
```
apps/accounting/tax/generators/
├── __init__.py
├── vat_return.py
└── paye_return.py            # New file
```

### Class Structure

| Component | Purpose |
|-----------|---------|
| `__init__` | Initialize with tenant context |
| `generate_return` | Main orchestration method |
| `_validate_period` | Verify tax period validity |
| `_get_or_create_return` | Get/create PAYEReturn |

### Expected Outcome
- PAYEReturnGenerator class created
- Tenant-aware implementation
- Main generation workflow defined
- Error handling framework in place

### Verification Checklist
- [ ] `generators/paye_return.py` file created
- [ ] PAYEReturnGenerator class defined
- [ ] Tenant context initialization implemented
- [ ] generate_return method signature defined
- [ ] Validation checks implemented
- [ ] Error handling added
- [ ] Docstrings complete

---

## Task 43: Add Get Payroll Data Method

### Overview
Implement the method to retrieve all relevant payroll data for a tax period. This method queries the Payroll model for the specified month, fetches employee salary details, tax deductions, and prepares data for tax bracket calculations.

### Dependencies
- Task 42 (PAYEReturnGenerator class) must be complete
- Payroll models must exist with PAYE fields
- Salary models must be queryable

### Instructions

1. **Add get_payroll_data method**
   - Add method to PAYEReturnGenerator class
   - Accept tax_period parameter
   - Return list of payroll dictionaries

2. **Query payroll records**
   - Filter Payroll by tax period month/year
   - Include only finalized payroll records
   - Filter by tenant schema
   - Order by employee name

3. **Extract employee details**
   - Get employee name and identification
   - Extract basic salary amount
   - Get allowances and deductions
   - Calculate gross taxable income
   - Retrieve PAYE amount deducted

4. **Calculate taxable income**
   - Sum basic salary and taxable allowances
   - Exclude non-taxable allowances (if any)
   - Apply exemptions and reliefs
   - Round to 2 decimal places

5. **Structure payroll data**
   - Create dictionary per employee
   - Include employee_id, name, NIC
   - Include gross_salary, taxable_income
   - Include paye_deducted amount
   - Include designation if available

6. **Handle edge cases**
   - Skip employees with zero taxable income
   - Handle missing NIC numbers
   - Deal with negative adjustments
   - Exclude terminated employees

### Data Structure
```
Payroll Data Format:
[
    {
        'employee_id': int,
        'employee_name': str,
        'nic': str,
        'designation': str,
        'gross_salary': Decimal,
        'taxable_income': Decimal,
        'paye_deducted': Decimal,
        'pay_period': date
    },
    ...
]
```

### Field Mapping

| Source | Target Field |
|--------|--------------|
| Payroll.employee.name | employee_name |
| Payroll.employee.nic | nic |
| Payroll.basic_salary + allowances | gross_salary |
| Calculated taxable amount | taxable_income |
| Payroll.paye_tax | paye_deducted |

### Expected Outcome
- get_payroll_data method implemented
- Efficient payroll queries
- Proper taxable income calculation
- Structured data for next steps

### Verification Checklist
- [ ] get_payroll_data method added
- [ ] Payroll query filters correct
- [ ] Employee details extracted
- [ ] Taxable income calculated correctly
- [ ] Data structure matches specification
- [ ] Edge cases handled
- [ ] Returns empty list if no data

---

## Task 44: Add Calculate Tax Brackets Method

### Overview
Implement the tax bracket calculation method using Sri Lanka's progressive income tax system. This method applies the appropriate tax rates to each employee's monthly income, calculates the expected PAYE, and compares it with actual deductions to ensure accuracy.

### Dependencies
- Task 43 (get_payroll_data method) must be complete
- Tax bracket rates must be defined
- Tax calculation logic must be understood

### Instructions

1. **Define Sri Lanka tax brackets**
   - Define constants for monthly tax brackets
   - Bracket 1: First 100,000 LKR at 0%
   - Bracket 2: Next 41,667 LKR at 6%
   - Bracket 3: Next 41,667 LKR at 12%
   - Bracket 4: Next 41,667 LKR at 18%
   - Bracket 5: Remaining at 24%
   - Update brackets as per current IRD rates

2. **Add calculate_tax_brackets method**
   - Accept payroll_data list parameter
   - Process each employee record
   - Return enhanced data with bracket info

3. **Apply progressive tax calculation**
   - For each employee's taxable_income
   - Apply tax brackets sequentially
   - Calculate tax per bracket
   - Sum total expected PAYE
   - Round to nearest rupee

4. **Determine applicable brackets**
   - Identify which brackets apply
   - Calculate taxable amount per bracket
   - Track amount remaining for next bracket
   - Store bracket breakdown per employee

5. **Add tax bracket breakdown**
   - Create bracket_detail dictionary
   - Include amount taxed per bracket
   - Include tax paid per bracket
   - Include effective tax rate

6. **Validate PAYE deduction**
   - Compare calculated PAYE with actual
   - Flag discrepancies beyond threshold
   - Store variance for reporting
   - Log significant mismatches

7. **Handle tax reliefs and exemptions**
   - Apply personal relief if configured
   - Handle statutory exemptions
   - Apply special allowances
   - Adjust taxable income accordingly

### Tax Bracket Structure (2026 Rates)

| Bracket | Monthly Income Range | Rate | Annual Equivalent |
|---------|----------------------|------|-------------------|
| 1 | 0 - 100,000 | 0% | 0 - 1,200,000 |
| 2 | 100,001 - 141,667 | 6% | 1,200,001 - 1,700,000 |
| 3 | 141,668 - 183,333 | 12% | 1,700,001 - 2,200,000 |
| 4 | 183,334 - 225,000 | 18% | 2,200,001 - 2,700,000 |
| 5 | 225,001+ | 24% | 2,700,001+ |

### Calculation Example

**Employee with 200,000 LKR monthly income:**
- Bracket 1: 100,000 × 0% = 0
- Bracket 2: 41,667 × 6% = 2,500
- Bracket 3: 41,667 × 12% = 5,000
- Bracket 4: 16,666 × 18% = 3,000
- **Total PAYE: 10,500 LKR**

### Enhanced Data Structure
```
Enhanced Payroll Data:
[
    {
        ...existing fields...,
        'calculated_paye': Decimal,
        'paye_variance': Decimal,
        'bracket_breakdown': {
            'bracket_1': {'amount': Decimal, 'tax': Decimal},
            'bracket_2': {'amount': Decimal, 'tax': Decimal},
            ...
        },
        'effective_rate': Decimal,
        'highest_bracket': int
    },
    ...
]
```

### Expected Outcome
- Tax bracket calculation implemented
- Sri Lanka tax rates applied correctly
- Progressive taxation working
- Bracket breakdowns generated
- Validation against actual deductions

### Verification Checklist
- [ ] Tax brackets defined accurately
- [ ] calculate_tax_brackets method added
- [ ] Progressive calculation correct
- [ ] Bracket breakdown generated
- [ ] PAYE validation implemented
- [ ] Variance tracking added
- [ ] Test with sample incomes
- [ ] Edge cases handled (very high/low income)

---

## Task 45: Add Employee Schedule Method

### Overview
Create the employee schedule generation method that compiles the complete list of employees with their earnings and tax deductions for the PAYE return. This schedule is required for IRD submission and forms the detailed breakdown section of the T-10 form.

### Dependencies
- Task 44 (calculate_tax_brackets) must be complete
- Enhanced payroll data must be available

### Instructions

1. **Add generate_employee_schedule method**
   - Accept enhanced_payroll_data parameter
   - Sort employees by name
   - Generate sequential employee numbers
   - Return formatted schedule list

2. **Structure employee schedule entries**
   - Assign sequential numbers (1, 2, 3...)
   - Include employee name and NIC
   - Include designation/position
   - Include gross earnings
   - Include taxable income
   - Include PAYE deducted

3. **Calculate schedule totals**
   - Sum total employees
   - Sum total gross earnings
   - Sum total taxable income
   - Sum total PAYE deducted
   - Calculate average PAYE rate

4. **Add schedule formatting**
   - Format currency values with commas
   - Align decimal places (2 decimals)
   - Handle long employee names
   - Truncate if necessary for PDF

5. **Sort and group options**
   - Primary sort by employee name
   - Option to group by department
   - Option to group by tax bracket
   - Maintain consistent ordering

6. **Add metadata to schedule**
   - Include generation timestamp
   - Include tax period details
   - Include company information
   - Include preparer information

7. **Store schedule in PAYEReturn**
   - Update PAYEReturn.employee_details JSON
   - Include full schedule data
   - Include summary totals
   - Include metadata

### Schedule Entry Structure
```
Employee Schedule Format:
{
    'employees': [
        {
            'seq_no': 1,
            'name': 'Employee Name',
            'nic': 'NIC Number',
            'designation': 'Job Title',
            'gross_earnings': '150,000.00',
            'taxable_income': '150,000.00',
            'paye_deducted': '6,500.00',
            'bracket_info': {...}
        },
        ...
    ],
    'totals': {
        'total_employees': 50,
        'total_gross': '7,500,000.00',
        'total_taxable': '7,500,000.00',
        'total_paye': '325,000.00',
        'average_paye_rate': '4.33%'
    },
    'metadata': {
        'generated_at': '2026-01-25T10:30:00',
        'tax_period': '2026-01',
        'company': 'Company Name',
        'preparer': 'HR Manager'
    }
}
```

### Expected Outcome
- Employee schedule generation method complete
- Properly formatted schedule entries
- Accurate totals calculation
- Schedule stored in PAYEReturn model

### Verification Checklist
- [ ] generate_employee_schedule method added
- [ ] Sequential numbering implemented
- [ ] All required fields included
- [ ] Totals calculated correctly
- [ ] Formatting applied
- [ ] Schedule stored in JSON field
- [ ] Metadata included

---

## Task 46: Create PAYE Return PDF Template

### Overview
Design and implement the PDF template for the PAYE return in Sri Lanka IRD T-10 form format. This template renders the monthly PAYE return with company details, employee schedule, tax breakdown, and official declarations required for regulatory submission.

### Dependencies
- Task 45 (employee schedule) must be complete
- PDF rendering library must be configured
- T-10 form structure must be understood

### Instructions

1. **Create template file**
   - Create `paye_return.html` in `templates/tax/`
   - Set up base PDF template structure
   - Include CSS for T-10 form layout
   - Add page break handling

2. **Add T-10 form header**
   - IRD logo and title
   - Form name: "T-10 - Employer's Monthly Return of PAYE"
   - Tax period (month and year)
   - Employer details section

3. **Add employer information section**
   - Company name and address
   - Employer registration number
   - Tax Identification Number (TIN)
   - Contact person name
   - Contact telephone/email

4. **Add employee schedule table**
   - Column headers (sequential number, name, NIC, earnings, PAYE)
   - Loop through employee schedule entries
   - Format currency with proper alignment
   - Handle multi-page schedules

5. **Add summary section**
   - Total number of employees
   - Total gross remuneration
   - Total PAYE deducted
   - Previous month arrears (if any)
   - Total payable to IRD

6. **Add tax bracket summary**
   - Breakdown by tax bracket
   - Number of employees per bracket
   - Total income per bracket
   - Total tax per bracket
   - Average effective rate

7. **Add declaration section**
   - Statutory declaration text
   - Authorized signatory fields
   - Name and designation
   - Date and stamp
   - Company seal area

8. **Style for print/PDF**
   - Use A4 page size
   - Set appropriate margins
   - Use official form fonts
   - Black and white optimized
   - Ensure table borders visible

9. **Add page numbering**
   - Page X of Y footer
   - Header repeat on each page
   - Employee schedule continuation markers

### T-10 Form Sections

| Section | Content | Priority |
|---------|---------|----------|
| Header | Form title, period, employer ID | Critical |
| Employer Info | Company details, TIN, contact | Critical |
| Employee Schedule | Detailed employee list | Critical |
| Summary | Totals and calculations | Critical |
| Tax Breakdown | By bracket analysis | Important |
| Declaration | Legal statement | Critical |

### Template Variables

| Variable | Source | Purpose |
|----------|--------|---------|
| `paye_return` | PAYEReturn object | Main data |
| `company` | Tenant model | Employer details |
| `employee_schedule` | JSON field | Employee list |
| `tax_period` | TaxPeriod FK | Period info |
| `generated_at` | timestamp | Generation date |

### Expected Outcome
- T-10 form PDF template created
- All required sections included
- Professional IRD-compliant layout
- Multi-page support working

### Verification Checklist
- [ ] Template file created
- [ ] T-10 form structure implemented
- [ ] Employer details section complete
- [ ] Employee schedule table working
- [ ] Summary section added
- [ ] Tax bracket breakdown included
- [ ] Declaration section added
- [ ] Print/PDF styling applied
- [ ] Page numbering working
- [ ] Test with sample data

---

## Task 47: Create PAYE CSV Export

### Overview
Implement CSV export functionality for PAYE returns in the format required by Sri Lanka IRD for digital submission. The CSV file includes employer details, employee schedule, and tax calculations in a structured format that can be uploaded to the IRD portal.

### Dependencies
- Task 46 (PDF template) must be complete
- PAYEReturn data must be complete

### Instructions

1. **Add export_to_csv method**
   - Add method to PAYEReturnGenerator class
   - Accept paye_return parameter
   - Return CSV file as BytesIO or string

2. **Define CSV structure**
   - Row 1: Employer header information
   - Row 2: Column headers
   - Rows 3+: Employee records
   - Last row: Summary totals

3. **Add employer header row**
   - Employer name
   - TIN (Tax Identification Number)
   - Tax period (YYYY-MM)
   - Return type (Monthly PAYE)
   - Generation date

4. **Define column headers**
   - Sequential Number
   - Employee Name
   - NIC Number
   - Designation
   - Gross Earnings
   - Taxable Income
   - PAYE Deducted

5. **Write employee records**
   - Loop through employee schedule
   - Write one row per employee
   - Format numbers without commas (raw decimals)
   - Escape special characters in names

6. **Add summary row**
   - Label "TOTAL"
   - Sum of all employees
   - Sum of gross earnings
   - Sum of taxable income
   - Sum of PAYE deducted

7. **Handle data formatting**
   - Use standard decimal format (X.XX)
   - No thousands separators in numeric fields
   - Quote text fields if they contain commas
   - UTF-8 encoding for Sinhala/Tamil names

8. **Add export endpoint integration**
   - Create download view
   - Generate filename: `PAYE_RETURN_[TIN]_[PERIOD].csv`
   - Set proper content-type headers
   - Trigger browser download

9. **Add validation before export**
   - Verify return is finalized
   - Check all required fields populated
   - Ensure no negative values
   - Validate NIC format

### CSV Format Specification

```
Line 1: EMPLOYER,Company Name,TIN123456,2026-01,Monthly PAYE,2026-01-25
Line 2: No,Name,NIC,Designation,Gross Earnings,Taxable Income,PAYE Deducted
Line 3: 1,John Doe,123456789V,Manager,200000.00,200000.00,10500.00
Line 4: 2,Jane Smith,987654321V,Executive,150000.00,150000.00,6500.00
...
Last: TOTAL,50,,,7500000.00,7500000.00,325000.00
```

### Export Method Signature

| Parameter | Type | Purpose |
|-----------|------|---------|
| `paye_return` | PAYEReturn | Return to export |
| `file_format` | str | 'csv' or 'excel' |
| `include_details` | bool | Include bracket info |

### Expected Outcome
- CSV export method implemented
- IRD-compliant format
- Proper data formatting
- Download functionality working

### Verification Checklist
- [ ] export_to_csv method added
- [ ] CSV structure matches IRD specs
- [ ] Employer header row correct
- [ ] Column headers defined
- [ ] Employee records exported
- [ ] Summary row included
- [ ] Data formatting correct
- [ ] UTF-8 encoding working
- [ ] Filename generation proper
- [ ] Download triggers correctly

---

## Task 48: Add PAYE Summary by Bracket

### Overview
Create a summary method that aggregates PAYE data by tax bracket for analysis and reporting. This summary shows how many employees fall into each bracket, total income per bracket, and total tax collected per bracket, providing insights into the organization's tax distribution.

### Dependencies
- Task 47 (CSV export) must be complete
- Tax bracket calculations must be complete

### Instructions

1. **Add summarize_by_bracket method**
   - Add method to PAYEReturnGenerator class
   - Accept enhanced_payroll_data parameter
   - Return bracket summary dictionary

2. **Initialize bracket counters**
   - Create dictionary for each bracket
   - Initialize employee count to 0
   - Initialize total income to 0
   - Initialize total tax to 0

3. **Aggregate data by bracket**
   - Loop through all employees
   - Determine highest bracket reached
   - Increment employee count for that bracket
   - Add full income to bracket total
   - Add full tax to bracket total

4. **Calculate bracket percentages**
   - Calculate percentage of employees per bracket
   - Calculate percentage of total PAYE per bracket
   - Calculate average income per bracket
   - Calculate average tax per bracket

5. **Format summary output**
   - Create readable bracket labels
   - Format currency values
   - Format percentages (2 decimals)
   - Sort brackets in order

6. **Add visualization data**
   - Prepare data for charts
   - Include bracket distribution
   - Include income distribution
   - Include tax distribution

7. **Store summary in PAYEReturn**
   - Add to PAYEReturn JSON field
   - Include full breakdown
   - Include percentages
   - Include visualization data

### Summary Structure
```
Bracket Summary Format:
{
    'bracket_summary': [
        {
            'bracket': 1,
            'label': '0 - 100,000 (0%)',
            'employee_count': 15,
            'employee_percent': 30.0,
            'total_income': 1200000.00,
            'income_percent': 16.0,
            'total_tax': 0.00,
            'tax_percent': 0.0,
            'avg_income': 80000.00,
            'avg_tax': 0.00
        },
        {
            'bracket': 2,
            'label': '100,001 - 141,667 (6%)',
            'employee_count': 12,
            'employee_percent': 24.0,
            'total_income': 1440000.00,
            'income_percent': 19.2,
            'total_tax': 28800.00,
            'tax_percent': 8.86,
            'avg_income': 120000.00,
            'avg_tax': 2400.00
        },
        ...
    ],
    'overall': {
        'total_employees': 50,
        'total_income': 7500000.00,
        'total_tax': 325000.00,
        'effective_rate': 4.33
    }
}
```

### Aggregation Logic

| Metric | Calculation |
|--------|-------------|
| Employee Count | Count per highest bracket |
| Total Income | Sum all income in bracket |
| Total Tax | Sum all tax from bracket |
| Employee % | (Count / Total) × 100 |
| Income % | (Bracket Income / Total) × 100 |
| Tax % | (Bracket Tax / Total) × 100 |
| Avg Income | Total Income / Count |
| Avg Tax | Total Tax / Count |

### Expected Outcome
- Bracket summary method implemented
- Data aggregated by tax bracket
- Percentages calculated correctly
- Summary stored in PAYEReturn

### Verification Checklist
- [ ] summarize_by_bracket method added
- [ ] Bracket counters initialized
- [ ] Data aggregation working
- [ ] Percentages calculated
- [ ] Summary formatted properly
- [ ] Visualization data prepared
- [ ] Summary stored in model
- [ ] Test with various distributions

---

## Task 49: Add Year-to-Date Tracking

### Overview
Implement year-to-date (YTD) tracking functionality for PAYE returns and employee tax deductions. This feature maintains cumulative totals for each employee throughout the tax year, enabling accurate annual reporting, tax certificate generation, and validation of monthly PAYE calculations.

### Dependencies
- Task 48 (bracket summary) must be complete
- PAYEReturn model must support YTD fields

### Instructions

1. **Add calculate_ytd method**
   - Add method to PAYEReturnGenerator class
   - Accept employee_id and tax_period parameters
   - Return YTD summary dictionary

2. **Query historical PAYE data**
   - Get all PAYEReturns from January to current month
   - Filter by current tax year
   - Extract employee records from JSON fields
   - Aggregate by employee

3. **Calculate YTD totals per employee**
   - Sum YTD gross earnings
   - Sum YTD taxable income
   - Sum YTD PAYE deducted
   - Calculate YTD effective rate

4. **Add YTD to employee schedule**
   - Enhance employee schedule with YTD fields
   - Show current month values
   - Show YTD cumulative values
   - Show remaining tax year projection

5. **Implement YTD validation**
   - Compare monthly calculation with YTD
   - Flag inconsistencies
   - Detect missing months
   - Identify duplicate returns

6. **Add YTD summary to return**
   - Store YTD totals in PAYEReturn
   - Include company-wide YTD
   - Include per-employee YTD
   - Include month-over-month change

7. **Create YTD report method**
   - Generate YTD report for any point in year
   - Show monthly progression
   - Show employee YTD details
   - Export to Excel/CSV

8. **Handle year boundary**
   - Reset YTD calculations at year start
   - Archive previous year data
   - Validate year transitions
   - Support multi-year queries

### YTD Data Structure
```
YTD Tracking Format:
{
    'employee_ytd': [
        {
            'employee_id': 1,
            'employee_name': 'John Doe',
            'nic': '123456789V',
            'ytd_gross': 2000000.00,
            'ytd_taxable': 2000000.00,
            'ytd_paye': 105000.00,
            'ytd_effective_rate': 5.25,
            'months_paid': 10,
            'current_month': {
                'gross': 200000.00,
                'taxable': 200000.00,
                'paye': 10500.00
            },
            'projection': {
                'annual_gross': 2400000.00,
                'annual_paye': 126000.00
            }
        },
        ...
    ],
    'company_ytd': {
        'total_employees': 50,
        'ytd_gross': 75000000.00,
        'ytd_paye': 3250000.00,
        'months_processed': 10,
        'average_monthly_paye': 325000.00
    }
}
```

### YTD Calculations

| Field | Calculation |
|-------|-------------|
| YTD Gross | Sum(monthly_gross) Jan-Current |
| YTD Taxable | Sum(monthly_taxable) Jan-Current |
| YTD PAYE | Sum(monthly_paye) Jan-Current |
| YTD Rate | (YTD PAYE / YTD Gross) × 100 |
| Projection | (YTD / Months) × 12 |

### Expected Outcome
- YTD tracking method implemented
- Historical data aggregation working
- Per-employee YTD calculated
- Company-wide YTD summary available

### Verification Checklist
- [ ] calculate_ytd method added
- [ ] Historical query implemented
- [ ] Employee YTD aggregation working
- [ ] Company YTD summary calculated
- [ ] Validation checks added
- [ ] YTD stored in model
- [ ] Year boundary handling correct
- [ ] Test across year transition

---

## Task 50: Create PAYE Return API Endpoint

### Overview
Create the REST API endpoint for PAYE return generation, retrieval, and management. This endpoint enables frontend applications to trigger PAYE return generation, retrieve return details, download PDF/CSV exports, and access YTD summaries through a clean RESTful interface.

### Dependencies
- Task 49 (YTD tracking) must be complete
- API framework must be configured
- Serializers must be available

### Instructions

1. **Create PAYE serializer**
   - Create `paye_return.py` in `serializers/`
   - Define PAYEReturnSerializer class
   - Include all model fields
   - Add nested employee schedule

2. **Add serializer methods**
   - Add get_employee_count method
   - Add get_bracket_summary method
   - Add get_ytd_summary method
   - Add get_download_urls method

3. **Create PAYE viewset**
   - Add PAYEReturnViewSet to views/tax.py
   - Inherit from ModelViewSet
   - Apply tenant filtering
   - Add permission classes

4. **Add list endpoint**
   - GET /api/tax/paye-returns/
   - Filter by tax period, year
   - Paginate results
   - Return serialized returns

5. **Add retrieve endpoint**
   - GET /api/tax/paye-returns/{id}/
   - Return full PAYE return details
   - Include employee schedule
   - Include all summaries

6. **Add generate action**
   - POST /api/tax/paye-returns/generate/
   - Accept tax_period_id in payload
   - Trigger PAYEReturnGenerator
   - Return created return

7. **Add download actions**
   - GET /api/tax/paye-returns/{id}/download_pdf/
   - GET /api/tax/paye-returns/{id}/download_csv/
   - Generate and return file
   - Set proper content-type

8. **Add YTD action**
   - GET /api/tax/paye-returns/ytd_summary/
   - Accept year and month parameters
   - Return YTD data for period
   - Include company and employee YTD

9. **Add validation**
   - Validate tax period exists
   - Prevent duplicate generation
   - Check user permissions
   - Validate finalization status

10. **Add error responses**
    - Handle payroll data missing
    - Handle generation errors
    - Return descriptive error messages
    - Use appropriate status codes

### API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/tax/paye-returns/` | List all returns |
| GET | `/api/tax/paye-returns/{id}/` | Get return details |
| POST | `/api/tax/paye-returns/generate/` | Generate new return |
| GET | `/api/tax/paye-returns/{id}/download_pdf/` | Download PDF |
| GET | `/api/tax/paye-returns/{id}/download_csv/` | Download CSV |
| GET | `/api/tax/paye-returns/ytd_summary/` | Get YTD data |
| PUT | `/api/tax/paye-returns/{id}/finalize/` | Finalize return |

### Request/Response Examples

**Generate Return Request:**
```json
POST /api/tax/paye-returns/generate/
{
    "tax_period_id": 45,
    "include_ytd": true
}
```

**Response:**
```json
{
    "id": 123,
    "tax_period": {
        "id": 45,
        "period_type": "monthly",
        "month": 1,
        "year": 2026
    },
    "total_employees": 50,
    "total_remuneration": "7500000.00",
    "total_paye_deducted": "325000.00",
    "status": "draft",
    "employee_schedule": [...],
    "bracket_summary": {...},
    "ytd_summary": {...},
    "created_at": "2026-01-25T10:30:00Z"
}
```

### Expected Outcome
- PAYE return API endpoints implemented
- Serializer with all required fields
- Generate, retrieve, and download working
- YTD summary endpoint functional

### Verification Checklist
- [ ] PAYEReturnSerializer created
- [ ] PAYEReturnViewSet implemented
- [ ] List endpoint working
- [ ] Retrieve endpoint working
- [ ] Generate action implemented
- [ ] PDF download working
- [ ] CSV download working
- [ ] YTD action working
- [ ] Validation added
- [ ] Error handling complete
- [ ] Test all endpoints
- [ ] API documentation updated

---

## Integration Testing

### Test Scenarios

| Test Case | Description | Expected Result |
|-----------|-------------|-----------------|
| Generate return for period | Trigger generation for Jan 2026 | Return created with 50 employees |
| Tax bracket calculation | Verify progressive tax | Correct PAYE for each bracket |
| Employee schedule | Check employee list | All 50 employees listed |
| PDF generation | Generate T-10 form | PDF downloads correctly |
| CSV export | Export for IRD | CSV format matches specs |
| Bracket summary | View tax distribution | Correct counts per bracket |
| YTD tracking | Check cumulative totals | Accurate YTD amounts |
| API endpoint | Call generate endpoint | Return 201 with data |

### Data Validation

- Verify total employees count matches schedule length
- Confirm total remuneration equals sum of individual amounts
- Ensure total PAYE equals sum of employee deductions
- Check bracket summary totals match overall totals
- Validate YTD amounts for continuity

### Error Handling

- Test with no payroll data for period
- Test with finalized return (prevent re-generation)
- Test with invalid tax period
- Test CSV export with special characters in names
- Test API with missing required fields

---

## Success Criteria

### Functional Requirements

- [ ] PAYEReturnGenerator class fully functional
- [ ] Payroll data retrieval working correctly
- [ ] Tax bracket calculation accurate
- [ ] Employee schedule generated properly
- [ ] T-10 PDF template renders correctly
- [ ] CSV export matches IRD format
- [ ] Bracket summary aggregates data
- [ ] YTD tracking calculates cumulative totals
- [ ] API endpoints respond correctly
- [ ] All downloads working

### Technical Requirements

- [ ] Code follows Django best practices
- [ ] Tenant isolation maintained
- [ ] Error handling comprehensive
- [ ] Logging implemented
- [ ] Performance optimized for large datasets
- [ ] Database queries efficient
- [ ] Memory usage reasonable for PDF generation

### Documentation Requirements

- [ ] All methods have docstrings
- [ ] API documentation updated
- [ ] Tax calculation logic documented
- [ ] IRD form requirements documented
- [ ] CSV format specification documented

---

## Notes

- Tax brackets must be updated annually per IRD notices
- T-10 form format may change - stay updated with IRD
- CSV format must match current IRD portal requirements
- YTD calculations must handle mid-year employee joins/exits
- Consider performance for companies with 1000+ employees
- PDF generation may require optimization for large schedules
- Tax reliefs and exemptions may need configuration per company
- Ensure data privacy for employee salary information
- Maintain audit trail for all return generations
- Consider implementing return amendments/corrections workflow

---

## Related Documentation

- [01_Tasks-35-41_PAYEReturn-Model.md](01_Tasks-35-41_PAYEReturn-Model.md) - PAYEReturn model structure
- [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md) - Group objectives and context
- [Group-B_VAT-Return](../Group-B_VAT-Return/) - Similar return generation pattern
- [Phase-05 Payroll Processing](../../../Phase-05_ERP-Core-Modules-Part2/SubPhase-10_Payroll-Processing/) - Source payroll data

---

**Document Status:** Complete  
**Last Updated:** 2026-01-25  
**Tasks Covered:** 42-50 (PAYEReturn Generator and Export Functionality)
