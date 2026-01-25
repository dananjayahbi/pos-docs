# Tasks 51-62: EPF Return and C-Form Generator

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 12 - Tax Reporting  
> **Group:** D - EPF/ETF Returns  
> **Document:** 01 of 02  
> **Tasks Covered:** 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-63-68_ETF-Return.md](02_Tasks-63-68_ETF-Return.md)

---

## Document Overview

This document covers the implementation of EPF (Employees' Provident Fund) return generation for Sri Lanka statutory compliance. Includes the EPFReturn model for C-Form data with employee (8%) and employer (12%) contributions totaling 20%, the EPFReturnGenerator service class, C-Form PDF generation in CBSL (Central Bank of Sri Lanka) format, and CSV export for online submission.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 51 | Create EPFReturn model | Medium | 30 min |
| 52 | Add EPF period foreign key | Low | 15 min |
| 53 | Add total employee contribution | Low | 15 min |
| 54 | Add total employer contribution | Low | 15 min |
| 55 | Add total contribution field | Low | 15 min |
| 56 | Add employee schedule JSONField | Medium | 25 min |
| 57 | Run EPFReturn migrations | Low | 10 min |
| 58 | Create EPFReturnGenerator class | High | 45 min |
| 59 | Add get EPF data method | Medium | 30 min |
| 60 | Add generate C-Form method | Medium | 35 min |
| 61 | Create C-Form PDF template | Medium | 40 min |
| 62 | Create EPF CSV export | Medium | 30 min |

---

## Task 51: Create EPFReturn Model

### Overview
Create the EPFReturn model to store EPF (Employees' Provident Fund) return data for submission to the Central Bank of Sri Lanka. This model captures the C-Form data including employee and employer contributions at 8% and 12% respectively, totaling 20% of gross salary.

### Dependencies
- Accounting application (`apps/accounting/`) must exist
- TaxPeriod model must exist (from VAT implementation)
- Django project structure is established

### Instructions

1. **Create EPF return model file**
   - Navigate to `apps/accounting/models/` directory
   - Create new file named `epf_return.py`
   - This will contain the EPFReturn model

2. **Add necessary imports**
   - Import Django model base classes
   - Import DecimalField, JSONField, DateField
   - Import TaxPeriod model
   - Import BaseModel from core mixins

3. **Create EPFReturn model class**
   - Inherit from BaseModel
   - Define model docstring explaining EPF C-Form purpose
   - Set appropriate Meta options

4. **Configure model metadata**
   - Set `db_table = 'accounting_epf_returns'`
   - Set `verbose_name = 'EPF Return'`
   - Set `verbose_name_plural = 'EPF Returns'`
   - Set `ordering = ['-period__start_date']`

5. **Add model __str__ method**
   - Return format: "EPF Return - {period} - {employer_reg_no}"
   - Provide clear identification of return

6. **Register model in models package**
   - Open `apps/accounting/models/__init__.py`
   - Import EPFReturn
   - Add to `__all__` list

### EPF Return Purpose

| Purpose | Details |
|---------|---------|
| Authority | Central Bank of Sri Lanka (CBSL) |
| Form Name | C-Form |
| Frequency | Monthly |
| Employee Contribution | 8% of gross salary |
| Employer Contribution | 12% of gross salary |
| Total Contribution | 20% of gross salary |

### EPF Contribution Breakdown

```
Gross Salary: 100,000 LKR

Employee Contribution (8%):    8,000 LKR
Employer Contribution (12%):  12,000 LKR
─────────────────────────────────────
Total EPF Contribution:       20,000 LKR
```

### Model Relationships

| Relationship | Target Model | Type | Purpose |
|--------------|-------------|------|---------|
| period | TaxPeriod | ForeignKey | Links to tax month/year |
| tenant | Tenant | ForeignKey | Multi-tenancy support |

### Expected Outcome
- EPFReturn model created in `apps/accounting/models/epf_return.py`
- Model inherits from BaseModel
- Proper metadata configuration
- Clear model documentation
- Model registered in package

### Verification Checklist
- [ ] `apps/accounting/models/epf_return.py` file created
- [ ] EPFReturn class defined with BaseModel inheritance
- [ ] Model Meta class configured
- [ ] __str__ method implemented
- [ ] Model imported in `models/__init__.py`
- [ ] Docstring explains EPF C-Form purpose

---

## Task 52: Add EPF Period Foreign Key

### Overview
Add the period foreign key to the EPFReturn model linking it to the TaxPeriod model. This establishes which tax month/year the EPF return covers and ensures proper period tracking.

### Dependencies
- Task 51: Create EPFReturn model
- TaxPeriod model must exist

### Instructions

1. **Add period foreign key field**
   - Add ForeignKey to TaxPeriod model
   - Set `on_delete=models.PROTECT`
   - Set `related_name='epf_returns'`
   - Set `verbose_name='Tax Period'`

2. **Add help text**
   - Explain: "The tax period (month/year) this EPF return covers"
   - Clarifies the period relationship

3. **Add unique constraint consideration**
   - Consider `unique_together` for period and tenant
   - Prevents duplicate returns for same period
   - Will be added in Meta class

4. **Update Meta class**
   - Add `unique_together = [('tenant', 'period')]`
   - Ensures one EPF return per tenant per period
   - Maintains data integrity

### Period Linkage

| Field | Type | Relationship |
|-------|------|--------------|
| period | ForeignKey | TaxPeriod (one EPF return per period) |

### EPF Return Period Example

```
TaxPeriod: January 2026
  │
  ├─ EPF Return (C-Form)
  │   ├─ Employee Contributions
  │   ├─ Employer Contributions
  │   └─ Employee Schedule
  │
  ├─ ETF Return
  └─ PAYE Return
```

### Data Integrity

| Constraint | Purpose |
|------------|---------|
| PROTECT on_delete | Prevents period deletion if returns exist |
| unique_together | One EPF return per tenant per period |

### Expected Outcome
- Period foreign key added to EPFReturn
- Proper cascade behavior with PROTECT
- Unique constraint prevents duplicates
- Clear relationship to tax periods

### Verification Checklist
- [ ] period ForeignKey field added
- [ ] on_delete=models.PROTECT set
- [ ] related_name='epf_returns' set
- [ ] Help text added
- [ ] unique_together constraint added in Meta

---

## Task 53: Add Total Employee Contribution

### Overview
Add the total_employee_contribution field to store the aggregate 8% employee contribution amount for all employees in the EPF return. This represents the sum of all employee deductions for the period.

### Dependencies
- Task 51: Create EPFReturn model

### Instructions

1. **Add total_employee_contribution field**
   - Add DecimalField for currency amount
   - Set `max_digits=15`
   - Set `decimal_places=2`
   - Set `default=Decimal('0.00')`

2. **Add field labels and help text**
   - Set `verbose_name='Total Employee Contribution'`
   - Set help text: "Total 8% employee contribution for the period"

3. **Add validation consideration**
   - Field should be non-negative
   - Consider adding validator for positive values
   - Will be calculated from payroll data

4. **Add field indexing**
   - Consider adding `db_index=True`
   - Useful for reporting and queries
   - Improves query performance

### Employee Contribution Details

| Detail | Value |
|--------|-------|
| Rate | 8% |
| Base | Gross Salary |
| Deducted From | Employee Salary |
| Purpose | Employee retirement fund |

### Calculation Example

```
Employee 1: Gross 50,000 → 8% = 4,000
Employee 2: Gross 75,000 → 8% = 6,000
Employee 3: Gross 60,000 → 8% = 4,800
────────────────────────────────────
Total Employee Contribution: 14,800
```

### Field Specifications

| Attribute | Value | Reason |
|-----------|-------|--------|
| max_digits | 15 | Supports up to 999,999,999,999.99 |
| decimal_places | 2 | Standard currency precision |
| default | Decimal('0.00') | Safe initial value |

### Expected Outcome
- total_employee_contribution field added
- Proper decimal precision for currency
- Default value prevents null issues
- Clear documentation of 8% rate

### Verification Checklist
- [ ] total_employee_contribution DecimalField added
- [ ] max_digits=15, decimal_places=2 set
- [ ] default=Decimal('0.00') set
- [ ] verbose_name set
- [ ] Help text explains 8% contribution

---

## Task 54: Add Total Employer Contribution

### Overview
Add the total_employer_contribution field to store the aggregate 12% employer contribution amount for all employees in the EPF return. This represents the employer's matching contribution for the period.

### Dependencies
- Task 51: Create EPFReturn model

### Instructions

1. **Add total_employer_contribution field**
   - Add DecimalField for currency amount
   - Set `max_digits=15`
   - Set `decimal_places=2`
   - Set `default=Decimal('0.00')`

2. **Add field labels and help text**
   - Set `verbose_name='Total Employer Contribution'`
   - Set help text: "Total 12% employer contribution for the period"

3. **Add validation consideration**
   - Field should be non-negative
   - Should be 1.5x employee contribution (12%/8% = 1.5)
   - Consider adding business rule validation

4. **Add field indexing**
   - Consider adding `db_index=True`
   - Useful for cost analysis queries
   - Improves reporting performance

### Employer Contribution Details

| Detail | Value |
|--------|-------|
| Rate | 12% |
| Base | Gross Salary |
| Paid By | Employer (not deducted from salary) |
| Purpose | Employer statutory contribution |

### Calculation Example

```
Employee 1: Gross 50,000 → 12% = 6,000
Employee 2: Gross 75,000 → 12% = 9,000
Employee 3: Gross 60,000 → 12% = 7,200
─────────────────────────────────────
Total Employer Contribution: 22,200
```

### Contribution Relationship

```
Employee Contribution (8%): 14,800
Employer Contribution (12%): 22,200
Ratio: 22,200 / 14,800 = 1.5 ✓
```

### Field Specifications

| Attribute | Value | Reason |
|-----------|-------|--------|
| max_digits | 15 | Supports large organizations |
| decimal_places | 2 | Standard currency precision |
| default | Decimal('0.00') | Safe initial value |

### Expected Outcome
- total_employer_contribution field added
- Proper decimal precision for currency
- Default value prevents null issues
- Clear documentation of 12% rate

### Verification Checklist
- [ ] total_employer_contribution DecimalField added
- [ ] max_digits=15, decimal_places=2 set
- [ ] default=Decimal('0.00') set
- [ ] verbose_name set
- [ ] Help text explains 12% contribution

---

## Task 55: Add Total Contribution Field

### Overview
Add the total_contribution field to store the combined EPF contribution (employee 8% + employer 12% = 20%). This calculated field represents the total amount to be remitted to the EPF.

### Dependencies
- Task 53: Add total employee contribution
- Task 54: Add total employer contribution

### Instructions

1. **Add total_contribution field**
   - Add DecimalField for currency amount
   - Set `max_digits=15`
   - Set `decimal_places=2`
   - Set `default=Decimal('0.00')`

2. **Add field labels and help text**
   - Set `verbose_name='Total Contribution'`
   - Set help text: "Total EPF contribution (Employee 8% + Employer 12% = 20%)"

3. **Add calculated field note**
   - Document that this should equal employee + employer
   - Note in docstring: "Should be calculated as total_employee + total_employer"
   - Consider adding save() method validation

4. **Add field indexing**
   - Add `db_index=True`
   - Primary field for payment tracking
   - Critical for financial reporting

### Total Contribution Details

| Component | Rate | Purpose |
|-----------|------|---------|
| Employee | 8% | Employee retirement savings |
| Employer | 12% | Employer matching contribution |
| **Total** | **20%** | **Total remittance to EPF** |

### Calculation Example

```
Gross Payroll: 185,000

Employee Contribution (8%): 14,800
Employer Contribution (12%): 22,200
─────────────────────────────────────
Total Contribution (20%): 37,000

Verification: 185,000 × 20% = 37,000 ✓
```

### Field Calculation Logic

```
total_contribution = total_employee_contribution + total_employer_contribution
                  = (gross_payroll × 8%) + (gross_payroll × 12%)
                  = gross_payroll × 20%
```

### Data Integrity Checks

| Check | Formula | Purpose |
|-------|---------|---------|
| Sum Check | total = employee + employer | Verify correct calculation |
| Rate Check | total = gross × 20% | Verify percentage application |
| Ratio Check | employer / employee = 1.5 | Verify rate relationship |

### Expected Outcome
- total_contribution field added
- Represents combined 20% contribution
- Clear documentation of calculation
- Field indexed for reporting

### Verification Checklist
- [ ] total_contribution DecimalField added
- [ ] max_digits=15, decimal_places=2 set
- [ ] default=Decimal('0.00') set
- [ ] verbose_name set
- [ ] Help text explains 20% total
- [ ] db_index=True set

---

## Task 56: Add Employee Schedule JSONField

### Overview
Add the employee_schedule JSONField to store detailed per-employee EPF contribution data. This field contains the member schedule that accompanies the C-Form, including each employee's EPF number, name, salary, and contributions.

### Dependencies
- Task 51: Create EPFReturn model

### Instructions

1. **Add employee_schedule field**
   - Add JSONField for structured data
   - Set `default=list`
   - Set `blank=True`

2. **Add field labels and help text**
   - Set `verbose_name='Employee Schedule'`
   - Set help text: "Detailed per-employee EPF contribution data (C-Form member schedule)"

3. **Document JSON structure**
   - Add docstring explaining expected schema
   - Include example structure
   - Document required fields per employee

4. **Document validation requirements**
   - Note that schedule should match totals
   - Sum of employee_contribution should equal total_employee_contribution
   - Sum of employer_contribution should equal total_employer_contribution

### Employee Schedule JSON Structure

```json
[
  {
    "epf_number": "EPF/123456",
    "employee_name": "John Silva",
    "nic": "871234567V",
    "gross_salary": "50000.00",
    "employee_contribution": "4000.00",
    "employer_contribution": "6000.00",
    "total_contribution": "10000.00"
  },
  {
    "epf_number": "EPF/123457",
    "employee_name": "Mary Fernando",
    "nic": "891234567V",
    "gross_salary": "75000.00",
    "employee_contribution": "6000.00",
    "employer_contribution": "9000.00",
    "total_contribution": "15000.00"
  }
]
```

### Employee Schedule Fields

| Field | Type | Description |
|-------|------|-------------|
| epf_number | string | EPF membership number |
| employee_name | string | Full name of employee |
| nic | string | National Identity Card number |
| gross_salary | string | Gross salary for the period |
| employee_contribution | string | Employee 8% contribution |
| employer_contribution | string | Employer 12% contribution |
| total_contribution | string | Total 20% contribution |

### Data Validation Rules

| Rule | Check |
|------|-------|
| EPF Number Format | EPF/XXXXXX |
| Employee Contribution | gross_salary × 8% |
| Employer Contribution | gross_salary × 12% |
| Total Contribution | employee + employer |
| Sum Validation | Sum matches totals |

### Schedule Summary Example

```
Employee Schedule (3 employees)
─────────────────────────────────────────
1. John Silva (EPF/123456)
   Gross: 50,000 → Total: 10,000
   
2. Mary Fernando (EPF/123457)
   Gross: 75,000 → Total: 15,000
   
3. Peter Perera (EPF/123458)
   Gross: 60,000 → Total: 12,000
─────────────────────────────────────────
Schedule Total: 37,000
Return Total: 37,000 ✓
```

### Expected Outcome
- employee_schedule JSONField added
- Structured storage for member schedule
- Clear JSON schema documented
- Validation rules defined

### Verification Checklist
- [ ] employee_schedule JSONField added
- [ ] default=list set
- [ ] blank=True set
- [ ] verbose_name set
- [ ] Help text explains C-Form member schedule
- [ ] JSON structure documented in docstring
- [ ] Validation rules documented

---

## Task 57: Run EPFReturn Migrations

### Overview
Create and run Django migrations to create the EPFReturn model table in the database. This migration will create the accounting_epf_returns table with all fields, indexes, and constraints.

### Dependencies
- Task 51: Create EPFReturn model
- Task 52: Add EPF period foreign key
- Task 53: Add total employee contribution
- Task 54: Add total employer contribution
- Task 55: Add total contribution field
- Task 56: Add employee schedule JSONField

### Instructions

1. **Verify all model fields are added**
   - Check EPFReturn model is complete
   - Ensure all fields from Tasks 52-56 are present
   - Verify Meta class configuration

2. **Create migration file**
   - Navigate to project root
   - Run command: `python manage.py makemigrations accounting`
   - Review generated migration file

3. **Review migration file**
   - Check migration file in `apps/accounting/migrations/`
   - Verify all fields are included
   - Check foreign keys and constraints
   - Verify unique_together constraint

4. **Run migration**
   - Execute command: `python manage.py migrate accounting`
   - Verify migration applies successfully
   - Check for any errors

5. **Verify database table**
   - Connect to PostgreSQL database
   - Check table exists: `accounting_epf_returns`
   - Verify all columns created
   - Check indexes created

### Migration Contents

| Component | Description |
|-----------|-------------|
| CreateModel | Creates accounting_epf_returns table |
| Fields | All model fields with proper types |
| ForeignKey | Links to tax periods and tenant |
| Indexes | db_index fields indexed |
| Constraints | unique_together for tenant+period |

### Expected Migration Fields

```
- id (BigAutoField, PK)
- tenant_id (ForeignKey)
- period_id (ForeignKey)
- total_employee_contribution (Decimal)
- total_employer_contribution (Decimal)
- total_contribution (Decimal)
- employee_schedule (JSON)
- created_at (DateTime)
- updated_at (DateTime)
- created_by_id (ForeignKey)
- updated_by_id (ForeignKey)
```

### Migration Verification

| Check | Command |
|-------|---------|
| List Migrations | `python manage.py showmigrations accounting` |
| Migration Status | Check for [X] mark |
| Table Exists | `\dt accounting_epf_returns` in psql |
| Table Structure | `\d accounting_epf_returns` in psql |

### Expected Outcome
- Migration file created successfully
- Migration runs without errors
- Database table created
- All fields and constraints present

### Verification Checklist
- [ ] All model fields added to EPFReturn
- [ ] makemigrations command executed
- [ ] Migration file reviewed
- [ ] migrate command executed successfully
- [ ] accounting_epf_returns table exists in database
- [ ] All fields present in table
- [ ] Foreign keys created
- [ ] unique_together constraint applied

---

## Task 58: Create EPFReturnGenerator Class

### Overview
Create the EPFReturnGenerator service class in the tax generators module. This class handles EPF return generation logic, including fetching payroll data, calculating contributions, and generating the C-Form for CBSL submission.

### Dependencies
- Task 57: Run EPFReturn migrations
- PayrollProcessing model must exist
- Employee model with EPF data must exist

### Instructions

1. **Create EPF return generator file**
   - Navigate to `apps/accounting/tax/generators/` directory
   - Create new file named `epf_return.py`
   - This will contain the EPFReturnGenerator class

2. **Add necessary imports**
   - Import EPFReturn model
   - Import TaxPeriod model
   - Import PayrollProcessing model
   - Import Employee model
   - Import Decimal, datetime utilities
   - Import PDF generation libraries

3. **Create EPFReturnGenerator class**
   - Define class with clear docstring
   - Explain C-Form generation purpose
   - Document CBSL compliance

4. **Add __init__ method**
   - Accept tenant parameter
   - Accept period parameter
   - Store as instance variables
   - Initialize return_data dictionary

5. **Add class structure planning**
   - Plan get_epf_data() method (Task 59)
   - Plan generate_c_form() method (Task 60)
   - Plan export_csv() method (Task 62)
   - Plan validate_data() helper method

6. **Add class constants**
   - EMPLOYEE_RATE = Decimal('0.08')
   - EMPLOYER_RATE = Decimal('0.12')
   - TOTAL_RATE = Decimal('0.20')
   - Document EPF rates

7. **Register generator in package**
   - Open `apps/accounting/tax/generators/__init__.py`
   - Import EPFReturnGenerator
   - Add to `__all__` list

### Generator Class Structure

```
EPFReturnGenerator
├── __init__(tenant, period)
├── get_epf_data()              # Task 59
├── generate_c_form()           # Task 60
├── export_csv()                # Task 62
├── validate_data()
├── calculate_contributions()
└── get_employee_schedule()
```

### Generator Responsibilities

| Method | Purpose |
|--------|---------|
| get_epf_data | Fetch payroll data for period |
| generate_c_form | Create C-Form PDF |
| export_csv | Export for online submission |
| validate_data | Verify data integrity |
| calculate_contributions | Calculate totals |
| get_employee_schedule | Build member schedule |

### EPF Rate Constants

```python
EMPLOYEE_RATE = Decimal('0.08')   # 8%
EMPLOYER_RATE = Decimal('0.12')   # 12%
TOTAL_RATE = Decimal('0.20')      # 20%
```

### Generator Usage Pattern

```
# Initialize generator
generator = EPFReturnGenerator(
    tenant=tenant,
    period=tax_period
)

# Get EPF data from payroll
epf_data = generator.get_epf_data()

# Generate C-Form PDF
c_form_pdf = generator.generate_c_form()

# Export CSV for online submission
csv_file = generator.export_csv()
```

### Expected Outcome
- EPFReturnGenerator class created
- Proper class structure defined
- EPF rate constants defined
- Class registered in package
- Ready for method implementation

### Verification Checklist
- [ ] `apps/accounting/tax/generators/epf_return.py` file created
- [ ] EPFReturnGenerator class defined
- [ ] Necessary imports added
- [ ] __init__ method implemented
- [ ] EPF rate constants defined
- [ ] Class docstring explains C-Form purpose
- [ ] Generator imported in package `__init__.py`

---

## Task 59: Add Get EPF Data Method

### Overview
Implement the get_epf_data() method in EPFReturnGenerator to fetch EPF contribution data from payroll processing records for the specified period. This method retrieves employee salary data and calculates EPF contributions.

### Dependencies
- Task 58: Create EPFReturnGenerator class
- PayrollProcessing model must exist
- Employee model with EPF numbers must exist

### Instructions

1. **Add get_epf_data method signature**
   - Define method: `def get_epf_data(self)`
   - Returns dictionary with EPF data
   - Add method docstring

2. **Query payroll processing records**
   - Filter by tenant and period
   - Filter by status = 'approved'
   - Include related employee data
   - Include EPF number from employee

3. **Initialize totals**
   - total_employee_contribution = Decimal('0.00')
   - total_employer_contribution = Decimal('0.00')
   - employee_schedule = []

4. **Iterate through payroll records**
   - For each approved payroll record
   - Get gross_salary from record
   - Calculate employee_contribution (8%)
   - Calculate employer_contribution (12%)

5. **Build employee schedule entry**
   - Extract employee EPF number
   - Extract employee name
   - Extract NIC number
   - Add gross_salary
   - Add contributions
   - Append to schedule

6. **Calculate totals**
   - Sum all employee contributions
   - Sum all employer contributions
   - Calculate total (employee + employer)

7. **Return EPF data dictionary**
   - Include all totals
   - Include employee schedule
   - Include period information
   - Include employer details

### Method Return Structure

```python
{
    'period': tax_period,
    'employer_reg_no': 'E/123456',
    'employer_name': 'ABC Company (Pvt) Ltd',
    'total_employees': 3,
    'total_employee_contribution': Decimal('14800.00'),
    'total_employer_contribution': Decimal('22200.00'),
    'total_contribution': Decimal('37000.00'),
    'employee_schedule': [...]
}
```

### Employee Schedule Entry Structure

```python
{
    'epf_number': 'EPF/123456',
    'employee_name': 'John Silva',
    'nic': '871234567V',
    'gross_salary': Decimal('50000.00'),
    'employee_contribution': Decimal('4000.00'),
    'employer_contribution': Decimal('6000.00'),
    'total_contribution': Decimal('10000.00')
}
```

### Calculation Logic

```
For each employee:
  employee_contribution = gross_salary × EMPLOYEE_RATE (8%)
  employer_contribution = gross_salary × EMPLOYER_RATE (12%)
  total_contribution = employee_contribution + employer_contribution

Aggregate:
  total_employee_contribution = sum(all employee_contribution)
  total_employer_contribution = sum(all employer_contribution)
  total_contribution = total_employee + total_employer
```

### Data Source

| Field | Source |
|-------|--------|
| gross_salary | PayrollProcessing.gross_salary |
| epf_number | Employee.epf_number |
| employee_name | Employee.full_name |
| nic | Employee.nic |
| period | TaxPeriod |
| employer_reg_no | Tenant.epf_registration_no |

### Expected Outcome
- get_epf_data() method implemented
- Fetches data from payroll records
- Calculates EPF contributions correctly
- Returns structured EPF data dictionary

### Verification Checklist
- [ ] get_epf_data() method defined
- [ ] Queries payroll processing records
- [ ] Filters by tenant and period
- [ ] Calculates employee contribution (8%)
- [ ] Calculates employer contribution (12%)
- [ ] Builds employee schedule
- [ ] Calculates totals correctly
- [ ] Returns complete EPF data dictionary

---

## Task 60: Add Generate C-Form Method

### Overview
Implement the generate_c_form() method in EPFReturnGenerator to create the EPF C-Form PDF in CBSL (Central Bank of Sri Lanka) compliant format. This method uses the EPF data to generate a properly formatted C-Form for submission.

### Dependencies
- Task 59: Add get EPF data method
- PDF template must exist (Task 61)

### Instructions

1. **Add generate_c_form method signature**
   - Define method: `def generate_c_form(self)`
   - Returns PDF file or path
   - Add method docstring

2. **Get EPF data**
   - Call self.get_epf_data()
   - Store in local variable
   - Validate data is complete

3. **Create or update EPFReturn record**
   - Check if return exists for period
   - Create new or update existing
   - Save all EPF data to model

4. **Prepare template context**
   - Add employer information
   - Add period information (month/year)
   - Add summary totals
   - Add employee schedule

5. **Load C-Form template**
   - Load template from templates/tax/c_form.html
   - Pass context data
   - Render HTML content

6. **Generate PDF from HTML**
   - Use PDF generation library (WeasyPrint/ReportLab)
   - Convert rendered HTML to PDF
   - Apply CBSL formatting specifications

7. **Add C-Form header**
   - Title: "C-FORM - EMPLOYEES' PROVIDENT FUND"
   - Employer registration number
   - Period (Month Year)

8. **Add summary section**
   - Total number of members
   - Total employee contribution (8%)
   - Total employer contribution (12%)
   - Total contribution (20%)

9. **Add employee schedule table**
   - Member EPF number
   - Member name
   - NIC
   - Gross salary
   - Employee contribution
   - Employer contribution
   - Total contribution

10. **Return PDF file**
    - Save to appropriate location
    - Return file path or PDF content
    - Log generation success

### C-Form Structure

```
═══════════════════════════════════════════════════════
         C-FORM - EMPLOYEES' PROVIDENT FUND
═══════════════════════════════════════════════════════

Employer Registration No: E/123456
Employer Name: ABC Company (Pvt) Ltd
Period: January 2026

SUMMARY OF CONTRIBUTIONS
────────────────────────────────────────────────────────
Total Number of Members:          3
Total Employee Contribution (8%): 14,800.00
Total Employer Contribution (12%): 22,200.00
TOTAL CONTRIBUTION:               37,000.00

MEMBER SCHEDULE
────────────────────────────────────────────────────────
EPF No    Name           NIC        Gross    Employee  Employer  Total
                                    Salary   Contrib   Contrib   Contrib
────────────────────────────────────────────────────────
EPF/123456 John Silva   871234567V 50,000  4,000.00  6,000.00  10,000.00
EPF/123457 Mary Fernando 891234567V 75,000  6,000.00  9,000.00  15,000.00
EPF/123458 Peter Perera 901234567V 60,000  4,800.00  7,200.00  12,000.00
────────────────────────────────────────────────────────
TOTALS:                           185,000 14,800.00 22,200.00  37,000.00
```

### Template Context Data

```python
{
    'employer_reg_no': 'E/123456',
    'employer_name': 'ABC Company (Pvt) Ltd',
    'period_month': 'January',
    'period_year': '2026',
    'total_members': 3,
    'total_employee_contribution': Decimal('14800.00'),
    'total_employer_contribution': Decimal('22200.00'),
    'total_contribution': Decimal('37000.00'),
    'employee_schedule': [...]
}
```

### CBSL Compliance Requirements

| Requirement | Implementation |
|-------------|----------------|
| Form Title | C-FORM - EMPLOYEES' PROVIDENT FUND |
| Employer ID | Registration number clearly displayed |
| Period | Month and year prominently shown |
| Summary | Total members and contributions |
| Schedule | Detailed per-employee breakdown |
| Totals | Column totals match summary |

### Expected Outcome
- generate_c_form() method implemented
- Creates EPFReturn database record
- Generates CBSL-compliant C-Form PDF
- Returns PDF file for submission

### Verification Checklist
- [ ] generate_c_form() method defined
- [ ] Calls get_epf_data() for data
- [ ] Creates/updates EPFReturn record
- [ ] Prepares template context
- [ ] Loads c_form.html template
- [ ] Generates PDF from template
- [ ] C-Form header formatted correctly
- [ ] Summary section included
- [ ] Employee schedule table included
- [ ] Returns PDF file or path

---

## Task 61: Create C-Form PDF Template

### Overview
Create the HTML template for the EPF C-Form that will be rendered to PDF. This template must follow CBSL (Central Bank of Sri Lanka) formatting requirements and present EPF contribution data in a clear, official format.

### Dependencies
- Task 60: Add generate C-Form method
- Django template system configured

### Instructions

1. **Create C-Form template file**
   - Navigate to `apps/accounting/templates/tax/` directory
   - Create new file named `c_form.html`
   - This will contain the C-Form layout

2. **Add template doctype and structure**
   - Add HTML5 doctype
   - Create HTML structure
   - Add head section with styles
   - Create body with C-Form content

3. **Add page styling**
   - Set A4 page size
   - Add appropriate margins
   - Define font families (official/formal)
   - Set color scheme (black/white for official docs)

4. **Create C-Form header**
   - Add bold title: "C-FORM - EMPLOYEES' PROVIDENT FUND"
   - Add decorative borders
   - Add employer registration number
   - Add employer name
   - Add period (month/year)

5. **Create summary section**
   - Add section title: "SUMMARY OF CONTRIBUTIONS"
   - Add bordered box
   - Display total number of members
   - Display total employee contribution (8%)
   - Display total employer contribution (12%)
   - Display total contribution (20%)

6. **Create employee schedule table**
   - Add section title: "MEMBER SCHEDULE"
   - Create table with columns:
     - EPF Number
     - Employee Name
     - NIC
     - Gross Salary
     - Employee Contribution (8%)
     - Employer Contribution (12%)
     - Total Contribution (20%)
   - Add table borders and styling

7. **Add employee schedule rows**
   - Loop through employee_schedule
   - Display each employee's data
   - Format currency values
   - Align numbers to right

8. **Add schedule totals row**
   - Add footer row to schedule table
   - Show "TOTALS:" label
   - Sum gross salary column
   - Sum employee contribution
   - Sum employer contribution
   - Sum total contribution
   - Bold formatting for emphasis

9. **Add footer section**
   - Signature lines
   - Date
   - Authorized signatory designation
   - Company stamp area

10. **Add print-friendly styling**
    - Page break controls
    - Print media queries
    - Ensure proper pagination
    - Avoid content splitting

### Template Structure

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>EPF C-Form</title>
    <style>
        /* Page and layout styles */
        /* Header styles */
        /* Summary box styles */
        /* Table styles */
        /* Footer styles */
    </style>
</head>
<body>
    <!-- C-Form Header -->
    <div class="header">
        <h1>C-FORM - EMPLOYEES' PROVIDENT FUND</h1>
        <p>Employer Registration No: {{ employer_reg_no }}</p>
        <p>Employer Name: {{ employer_name }}</p>
        <p>Period: {{ period_month }} {{ period_year }}</p>
    </div>
    
    <!-- Summary Section -->
    <div class="summary">
        <h2>SUMMARY OF CONTRIBUTIONS</h2>
        <!-- Summary data -->
    </div>
    
    <!-- Member Schedule -->
    <div class="schedule">
        <h2>MEMBER SCHEDULE</h2>
        <table>
            <!-- Schedule table -->
        </table>
    </div>
    
    <!-- Footer -->
    <div class="footer">
        <!-- Signature lines -->
    </div>
</body>
</html>
```

### Styling Guidelines

| Element | Style |
|---------|-------|
| Page Size | A4 (210mm × 297mm) |
| Margins | 20mm all sides |
| Font | Arial or Helvetica |
| Font Size | 10pt body, 14pt headings |
| Colors | Black text, minimal decoration |
| Borders | 1px solid black for tables |

### Summary Box Format

```
╔════════════════════════════════════════════╗
║     SUMMARY OF CONTRIBUTIONS               ║
╠════════════════════════════════════════════╣
║ Total Number of Members:          3        ║
║ Total Employee Contribution (8%): 14,800   ║
║ Total Employer Contribution (12%): 22,200  ║
║ TOTAL CONTRIBUTION:               37,000   ║
╚════════════════════════════════════════════╝
```

### Schedule Table Format

```
┌─────────┬──────────────┬──────────┬─────────┬─────────┬─────────┬─────────┐
│ EPF No  │ Name         │ NIC      │ Gross   │ Employee│ Employer│ Total   │
│         │              │          │ Salary  │ Contrib │ Contrib │ Contrib │
├─────────┼──────────────┼──────────┼─────────┼─────────┼─────────┼─────────┤
│EPF/12345│John Silva    │871234567V│ 50,000  │  4,000  │  6,000  │ 10,000  │
├─────────┼──────────────┼──────────┼─────────┼─────────┼─────────┼─────────┤
│TOTALS:  │              │          │185,000  │ 14,800  │ 22,200  │ 37,000  │
└─────────┴──────────────┴──────────┴─────────┴─────────┴─────────┴─────────┘
```

### Expected Outcome
- c_form.html template created
- CBSL-compliant layout
- Professional formatting
- Print-friendly design
- Clear data presentation

### Verification Checklist
- [ ] `apps/accounting/templates/tax/c_form.html` created
- [ ] HTML5 doctype and structure
- [ ] Page styling for A4 format
- [ ] C-Form header with title
- [ ] Employer details section
- [ ] Summary of contributions box
- [ ] Member schedule table
- [ ] Table columns properly aligned
- [ ] Totals row in schedule
- [ ] Footer with signature lines
- [ ] Print media queries added
- [ ] Currency values formatted correctly

---

## Task 62: Create EPF CSV Export

### Overview
Implement the export_csv() method in EPFReturnGenerator to export EPF contribution data in CSV format for online submission to CBSL. This provides an alternative electronic submission method alongside the PDF C-Form.

### Dependencies
- Task 59: Add get EPF data method
- Task 60: Add generate C-Form method

### Instructions

1. **Add export_csv method signature**
   - Define method: `def export_csv(self)`
   - Returns CSV file or content
   - Add method docstring

2. **Import CSV library**
   - Import Python csv module
   - Import StringIO or file handling
   - Prepare for CSV generation

3. **Get EPF data**
   - Call self.get_epf_data()
   - Validate data completeness
   - Prepare for CSV formatting

4. **Create CSV structure**
   - Define CSV columns
   - Match CBSL online submission format
   - Include all required fields

5. **Write CSV header row**
   - EPF Number
   - Employee Name
   - NIC
   - Gross Salary
   - Employee Contribution
   - Employer Contribution
   - Total Contribution

6. **Write employee data rows**
   - Iterate through employee_schedule
   - Write each employee as CSV row
   - Format decimal values appropriately

7. **Write summary row**
   - Add blank row separator
   - Add TOTALS row
   - Include aggregate totals
   - Match C-Form summary

8. **Add metadata rows**
   - Add employer registration number
   - Add period information
   - Add generation date
   - Add total member count

9. **Return CSV file**
   - Save to appropriate location
   - Return file path or CSV content
   - Provide download filename

### CSV File Structure

```csv
C-FORM - EPF CONTRIBUTION
Employer Registration No,E/123456
Employer Name,ABC Company (Pvt) Ltd
Period,January 2026
Total Members,3
Generation Date,2026-01-25

EPF Number,Employee Name,NIC,Gross Salary,Employee Contribution (8%),Employer Contribution (12%),Total Contribution (20%)
EPF/123456,John Silva,871234567V,50000.00,4000.00,6000.00,10000.00
EPF/123457,Mary Fernando,891234567V,75000.00,6000.00,9000.00,15000.00
EPF/123458,Peter Perera,901234567V,60000.00,4800.00,7200.00,12000.00

TOTALS,,,185000.00,14800.00,22200.00,37000.00
```

### CSV Column Specifications

| Column | Description | Format |
|--------|-------------|--------|
| EPF Number | Employee EPF membership number | EPF/XXXXXX |
| Employee Name | Full name | Text |
| NIC | National Identity Card | 9 digits + V/X or 12 digits |
| Gross Salary | Gross salary for period | Decimal (2 places) |
| Employee Contribution | 8% contribution | Decimal (2 places) |
| Employer Contribution | 12% contribution | Decimal (2 places) |
| Total Contribution | 20% total | Decimal (2 places) |

### CSV Generation Process

```
1. Create CSV writer
2. Write metadata section
3. Write blank row
4. Write column headers
5. Write employee data rows
6. Write blank row
7. Write totals row
8. Save CSV file
9. Return file path
```

### Filename Convention

```
EPF_C-Form_{employer_reg_no}_{period}_{date}.csv

Example:
EPF_C-Form_E123456_202601_20260125.csv
```

### Expected Outcome
- export_csv() method implemented
- Generates CSV in CBSL format
- Includes all EPF contribution data
- Suitable for online submission

### Verification Checklist
- [ ] export_csv() method defined
- [ ] CSV library imported
- [ ] Gets EPF data from get_epf_data()
- [ ] Creates CSV with proper structure
- [ ] Writes metadata section
- [ ] Writes column headers
- [ ] Writes employee data rows
- [ ] Writes totals row
- [ ] Formats decimal values correctly
- [ ] Returns CSV file or content
- [ ] Filename follows convention
- [ ] CSV validates for CBSL submission

---

## Summary

This document covered the implementation of EPF return generation including:

- **EPFReturn Model** (Tasks 51-56): Database model storing C-Form data with period foreign key, employee contribution (8%), employer contribution (12%), total contribution (20%), and employee schedule JSON
- **Database Migration** (Task 57): Creating the accounting_epf_returns table with all fields, indexes, and constraints
- **EPFReturnGenerator** (Tasks 58-62): Service class for EPF data retrieval, C-Form PDF generation in CBSL format, and CSV export for online submission

### Key EPF Rates
- **Employee Contribution:** 8% of gross salary
- **Employer Contribution:** 12% of gross salary
- **Total EPF Contribution:** 20% of gross salary

### C-Form Components
- Employer registration details
- Period (month/year)
- Summary of contributions
- Member schedule (per-employee breakdown)
- Aggregate totals

### Submission Formats
- **PDF:** C-Form for physical/email submission to CBSL
- **CSV:** Electronic file for online submission portal

---

## Next Steps

Proceed to [02_Tasks-63-68_ETF-Return.md](02_Tasks-63-68_ETF-Return.md) to implement ETF (Employees' Trust Fund) return generation with the ETFReturn model and ETFReturnGenerator for 3% employer contribution reporting to the ETF Board.
