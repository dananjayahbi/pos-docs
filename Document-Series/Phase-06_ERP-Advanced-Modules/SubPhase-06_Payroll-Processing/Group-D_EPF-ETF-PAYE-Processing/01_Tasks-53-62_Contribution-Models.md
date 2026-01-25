# Tasks 53-62: EPF, ETF, and PAYE Models

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 06 - Payroll Processing  
> **Group:** D - EPF/ETF/PAYE Processing  
> **Document:** 01 of 02  
> **Tasks Covered:** 53, 54, 55, 56, 57, 58, 59, 60, 61, 62

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-63-68_Processor-Reports.md](02_Tasks-63-68_Processor-Reports.md)

---

## Document Overview

This document covers the creation of statutory contribution and tax calculation models for Sri Lanka compliance: EPF (Employees' Provident Fund), ETF (Employees' Trust Fund), and PAYE (Pay As You Earn) tax models with their respective fields and migrations.

### Tasks in This Document
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

---

## Task 53: Create EPFContribution Model

### Overview
Create the EPFContribution model to track Employees' Provident Fund contributions for each employee payroll, including both employee and employer contributions as per Sri Lanka EPF regulations.

### Dependencies
- EmployeePayroll model exists
- Core models infrastructure available
- Django project configured

### Instructions

1. **Create EPF contribution model file**
   - Navigate to `apps/payroll/models/` directory
   - Create `epf_contribution.py` file
   - Import required Django modules

2. **Define EPFContribution model**
   - Inherit from BaseModel or models.Model
   - Add model-level Meta configuration
   - Set table name: `payroll_epf_contribution`

3. **Add relationship to EmployeePayroll**
   - Add employee_payroll ForeignKey field
   - Set on_delete=CASCADE
   - Add related_name='epf_contributions'

4. **Add model Meta**
   - Set verbose_name: 'EPF Contribution'
   - Set verbose_name_plural: 'EPF Contributions'
   - Set db_table explicitly
   - Add ordering by calculation_date DESC

5. **Add string representation**
   - Implement __str__ method
   - Return employee name and contribution amount
   - Format: "EPF - {employee} - LKR {total_amount}"

6. **Add model methods**
   - calculate_employee_contribution method
   - calculate_employer_contribution method
   - calculate_total method

7. **Import in models __init__.py**
   - Add import statement for EPFContribution
   - Include in __all__ list

### Model Structure

```
EPFContribution Model:
- Inherits from BaseModel
- Links to EmployeePayroll
- Tracks EPF contributions
- Stores calculation details
```

### Expected Outcome
- EPFContribution model class created
- Linked to EmployeePayroll
- Basic structure in place
- Imported in models package

### Verification Checklist
- [ ] epf_contribution.py file created
- [ ] EPFContribution model defined
- [ ] Inherits from BaseModel
- [ ] employee_payroll FK added
- [ ] Meta class configured
- [ ] __str__ method implemented
- [ ] Imported in models/__init__.py

---

## Task 54: Add EPF Fields

### Overview
Add core EPF contribution fields to store EPF number, contribution amounts for both employee and employer, and calculation metadata.

### Dependencies
- Task 53 completed (EPFContribution model exists)

### Instructions

1. **Add EPF number field**
   - Add epf_number CharField
   - Set max_length=20
   - Set blank=True, null=True
   - Add help_text about EPF registration number

2. **Add employee contribution field**
   - Add employee_amount DecimalField
   - Set max_digits=15, decimal_places=2
   - Set default=Decimal('0.00')
   - Add help_text: "Employee EPF contribution (8%)"

3. **Add employer contribution field**
   - Add employer_amount DecimalField
   - Set max_digits=15, decimal_places=2
   - Set default=Decimal('0.00')
   - Add help_text: "Employer EPF contribution (12%)"

4. **Add total amount field**
   - Add total_amount DecimalField
   - Set max_digits=15, decimal_places=2
   - Set default=Decimal('0.00')
   - Add help_text: "Total EPF contribution (20%)"

5. **Add calculation date field**
   - Add calculation_date DateField
   - Set auto_now_add=False
   - Reference payroll period end date

6. **Add notes field**
   - Add notes TextField
   - Set blank=True, null=True
   - For calculation notes or special cases

7. **Add contribution rate fields**
   - Add employee_rate DecimalField (default 8.00)
   - Add employer_rate DecimalField (default 12.00)
   - Store rates used for calculation

### Field Definitions

| Field | Type | Constraints | Purpose |
|-------|------|-------------|---------|
| epf_number | CharField(20) | blank=True | Employee EPF registration |
| employee_amount | Decimal(15,2) | default=0 | 8% employee contribution |
| employer_amount | Decimal(15,2) | default=0 | 12% employer contribution |
| total_amount | Decimal(15,2) | default=0 | Total 20% contribution |
| calculation_date | DateField | required | Calculation date |
| notes | TextField | blank=True | Additional notes |
| employee_rate | Decimal(5,2) | default=8.00 | Employee rate % |
| employer_rate | Decimal(5,2) | default=12.00 | Employer rate % |

### EPF Rates Reference

Sri Lanka EPF rates:
- Employee: 8% of EPF-eligible earnings
- Employer: 12% of EPF-eligible earnings
- Total: 20%

### Expected Outcome
- All EPF contribution fields added
- Decimal fields for precise calculation
- Rate fields store applied rates
- Notes field for documentation

### Verification Checklist
- [ ] epf_number field added
- [ ] employee_amount field added
- [ ] employer_amount field added
- [ ] total_amount field added
- [ ] calculation_date field added
- [ ] notes field added
- [ ] employee_rate field added
- [ ] employer_rate field added
- [ ] All fields use appropriate types
- [ ] Help text added to fields

---

## Task 55: Add EPF Base Field

### Overview
Add the EPF base field to store the EPF-applicable earnings amount on which EPF contributions are calculated.

### Dependencies
- Task 54 completed (EPF fields added)

### Instructions

1. **Add epf_base field**
   - Add epf_base DecimalField
   - Set max_digits=15, decimal_places=2
   - Set default=Decimal('0.00')
   - Add help_text explaining EPF-applicable earnings

2. **Add base calculation details**
   - Add base_calculation_details JSONField
   - Set blank=True, null=True
   - Store breakdown of EPF base components

3. **Update calculate methods**
   - Update calculate_employee_contribution to use epf_base
   - Update calculate_employer_contribution to use epf_base
   - Ensure calculations reference epf_base

### EPF Base Components

EPF-applicable earnings typically include:
- Basic salary (pro-rated)
- Fixed allowances (if marked EPF-applicable)
- Overtime pay (if marked EPF-applicable)
- Certain bonuses (per policy)

Excludes:
- Reimbursements
- One-time payments
- Non-cash benefits

### Base Calculation Details Structure

```json
{
  "basic_salary": 150000,
  "fixed_allowances": 15000,
  "overtime": 0,
  "total_epf_base": 165000,
  "components": [
    {"name": "Basic Salary", "amount": 150000, "epf_applicable": true},
    {"name": "Transport", "amount": 10000, "epf_applicable": false}
  ]
}
```

### Expected Outcome
- EPF base field added
- Stores EPF-applicable earnings total
- Calculation details stored in JSON

### Verification Checklist
- [ ] epf_base field added
- [ ] DecimalField with correct precision
- [ ] base_calculation_details JSONField added
- [ ] Help text explains EPF base
- [ ] Default value set to 0.00

---

## Task 56: Run EPFContribution Migrations

### Overview
Generate and apply database migrations for the EPFContribution model.

### Dependencies
- Tasks 53-55 completed (EPFContribution model fully defined)

### Instructions

1. **Generate migration file**
   - Run makemigrations command for payroll app
   - Review generated migration file
   - Check field definitions

2. **Review migration**
   - Open migration file in migrations directory
   - Verify all fields included
   - Check constraints and defaults
   - Verify foreign key relationships

3. **Apply migration**
   - Run migrate command
   - Apply to development database
   - Verify no errors

4. **Verify database table**
   - Check table created in database
   - Verify columns exist
   - Check foreign key constraints
   - Verify indexes created

5. **Test model operations**
   - Create test EPFContribution record
   - Verify save operation
   - Test query operations
   - Delete test record

### Migration Commands

```bash
python manage.py makemigrations payroll
python manage.py migrate payroll
```

### Expected Outcome
- Migration file generated
- Database table created
- All fields present in database
- Model operational

### Verification Checklist
- [ ] Migration file generated
- [ ] Migration file reviewed
- [ ] Migration applied successfully
- [ ] Table exists in database
- [ ] All columns created
- [ ] Foreign keys configured
- [ ] Can create records
- [ ] Can query records

---

## Task 57: Create ETFContribution Model

### Overview
Create the ETFContribution model to track Employees' Trust Fund contributions, an employer-only contribution as per Sri Lanka ETF regulations.

### Dependencies
- EmployeePayroll model exists
- EPFContribution model created (for reference)

### Instructions

1. **Create ETF contribution model file**
   - Navigate to `apps/payroll/models/` directory
   - Create `etf_contribution.py` file
   - Import required modules

2. **Define ETFContribution model**
   - Inherit from BaseModel
   - Add model-level Meta configuration
   - Set table name: `payroll_etf_contribution`

3. **Add relationship to EmployeePayroll**
   - Add employee_payroll ForeignKey
   - Set on_delete=CASCADE
   - Add related_name='etf_contributions'

4. **Add model Meta**
   - Set verbose_name: 'ETF Contribution'
   - Set verbose_name_plural: 'ETF Contributions'
   - Set db_table explicitly
   - Add ordering by calculation_date DESC

5. **Add string representation**
   - Implement __str__ method
   - Return employee name and ETF amount
   - Format: "ETF - {employee} - LKR {employer_amount}"

6. **Add model methods**
   - calculate_contribution method
   - validate_etf_base method

7. **Import in models __init__.py**
   - Add import statement
   - Include in __all__ list

### Model Structure

```
ETFContribution Model:
- Inherits from BaseModel
- Links to EmployeePayroll
- Tracks employer-only ETF contribution
- Stores calculation details
```

### ETF Overview

Sri Lanka ETF:
- Employer-only contribution (no employee contribution)
- Rate: 3% of ETF-eligible earnings
- ETF base usually same as EPF base
- Managed by Central Bank of Sri Lanka

### Expected Outcome
- ETFContribution model created
- Linked to EmployeePayroll
- Structure similar to EPFContribution
- Ready for field addition

### Verification Checklist
- [ ] etf_contribution.py file created
- [ ] ETFContribution model defined
- [ ] Inherits from BaseModel
- [ ] employee_payroll FK added
- [ ] Meta class configured
- [ ] __str__ method implemented
- [ ] Imported in models/__init__.py

---

## Task 58: Add ETF Fields

### Overview
Add ETF contribution fields to store ETF base amount, employer contribution, and calculation metadata.

### Dependencies
- Task 57 completed (ETFContribution model exists)

### Instructions

1. **Add ETF base field**
   - Add etf_base DecimalField
   - Set max_digits=15, decimal_places=2
   - Set default=Decimal('0.00')
   - Add help_text about ETF-eligible earnings

2. **Add employer contribution field**
   - Add employer_amount DecimalField
   - Set max_digits=15, decimal_places=2
   - Set default=Decimal('0.00')
   - Add help_text: "Employer ETF contribution (3%)"

3. **Add calculation date field**
   - Add calculation_date DateField
   - Reference payroll period end date

4. **Add ETF rate field**
   - Add etf_rate DecimalField
   - Set max_digits=5, decimal_places=2
   - Set default=Decimal('3.00')
   - Store rate used for calculation

5. **Add notes field**
   - Add notes TextField
   - Set blank=True, null=True
   - For special cases or adjustments

6. **Add base calculation details**
   - Add base_calculation_details JSONField
   - Set blank=True, null=True
   - Store breakdown of ETF base

### Field Definitions

| Field | Type | Constraints | Purpose |
|-------|------|-------------|---------|
| etf_base | Decimal(15,2) | default=0 | ETF-eligible earnings |
| employer_amount | Decimal(15,2) | default=0 | 3% employer contribution |
| calculation_date | DateField | required | Calculation date |
| etf_rate | Decimal(5,2) | default=3.00 | ETF rate % |
| notes | TextField | blank=True | Additional notes |
| base_calculation_details | JSONField | blank=True | Base breakdown |

### ETF Rate Reference

Sri Lanka ETF:
- Employer: 3% of ETF-eligible earnings
- Employee: 0% (no employee contribution)
- Base: Usually same as EPF base

### Expected Outcome
- All ETF contribution fields added
- Simpler than EPF (employer only)
- ETF base and rate stored
- Calculation details tracked

### Verification Checklist
- [ ] etf_base field added
- [ ] employer_amount field added
- [ ] calculation_date field added
- [ ] etf_rate field added
- [ ] notes field added
- [ ] base_calculation_details field added
- [ ] All fields use appropriate types
- [ ] Help text added

---

## Task 59: Run ETFContribution Migrations

### Overview
Generate and apply database migrations for the ETFContribution model.

### Dependencies
- Tasks 57-58 completed (ETFContribution model fully defined)

### Instructions

1. **Generate migration file**
   - Run makemigrations for payroll app
   - Review generated migration
   - Verify field definitions

2. **Review migration**
   - Open migration file
   - Verify all fields included
   - Check defaults and constraints

3. **Apply migration**
   - Run migrate command
   - Apply to database
   - Verify successful application

4. **Verify database table**
   - Check table created
   - Verify columns
   - Check foreign keys

5. **Test model operations**
   - Create test ETFContribution record
   - Verify operations
   - Delete test record

### Expected Outcome
- Migration generated and applied
- Database table created
- Model operational

### Verification Checklist
- [ ] Migration file generated
- [ ] Migration reviewed
- [ ] Migration applied
- [ ] Table exists in database
- [ ] All columns created
- [ ] Foreign keys configured
- [ ] Model operational

---

## Task 60: Create PAYECalculation Model

### Overview
Create the PAYECalculation model to track Pay As You Earn tax calculations for each employee payroll, implementing Sri Lanka income tax regulations.

### Dependencies
- EmployeePayroll model exists
- EPF and ETF models created (for reference)

### Instructions

1. **Create PAYE calculation model file**
   - Navigate to `apps/payroll/models/` directory
   - Create `paye_calculation.py` file
   - Import required modules

2. **Define PAYECalculation model**
   - Inherit from BaseModel
   - Add model-level Meta configuration
   - Set table name: `payroll_paye_calculation`

3. **Add relationship to EmployeePayroll**
   - Add employee_payroll ForeignKey
   - Set on_delete=CASCADE
   - Add related_name='paye_calculations'

4. **Add model Meta**
   - Set verbose_name: 'PAYE Calculation'
   - Set verbose_name_plural: 'PAYE Calculations'
   - Set db_table explicitly
   - Add ordering by calculation_date DESC

5. **Add string representation**
   - Implement __str__ method
   - Return employee name and tax amount
   - Format: "PAYE - {employee} - LKR {monthly_tax}"

6. **Add model methods**
   - calculate_taxable_income method
   - apply_tax_slabs method
   - calculate_monthly_tax method

7. **Import in models __init__.py**
   - Add import statement
   - Include in __all__ list

### Model Structure

```
PAYECalculation Model:
- Inherits from BaseModel
- Links to EmployeePayroll
- Tracks PAYE tax calculation
- Stores slab breakdown and YTD data
```

### PAYE Overview

Sri Lanka PAYE Tax:
- Progressive tax on employment income
- Applied monthly based on annual projection
- Allows exemptions (personal relief, EPF)
- Multiple tax slabs with increasing rates

### Expected Outcome
- PAYECalculation model created
- Linked to EmployeePayroll
- Ready for field addition
- Methods placeholders created

### Verification Checklist
- [ ] paye_calculation.py file created
- [ ] PAYECalculation model defined
- [ ] Inherits from BaseModel
- [ ] employee_payroll FK added
- [ ] Meta class configured
- [ ] __str__ method implemented
- [ ] Imported in models/__init__.py

---

## Task 61: Add PAYE Fields

### Overview
Add comprehensive PAYE tax calculation fields to store income, exemptions, tax slabs, monthly and year-to-date tax amounts.

### Dependencies
- Task 60 completed (PAYECalculation model exists)

### Instructions

1. **Add income fields**
   - Add gross_income DecimalField (total gross)
   - Add taxable_income DecimalField (after exemptions)
   - Set max_digits=15, decimal_places=2

2. **Add EPF deduction field**
   - Add epf_deduction DecimalField
   - Employee's EPF contribution (deductible)
   - Set default=Decimal('0.00')

3. **Add exemptions field**
   - Add exemptions JSONField
   - Store applied exemptions breakdown
   - Set blank=True, null=True

4. **Add tax slabs field**
   - Add tax_slabs_applied JSONField
   - Store tax calculation breakdown by slab
   - Include slab ranges, rates, and amounts

5. **Add monthly tax field**
   - Add monthly_tax DecimalField
   - Store calculated monthly PAYE tax
   - Set default=Decimal('0.00')

6. **Add year-to-date fields**
   - Add ytd_gross DecimalField (year-to-date gross)
   - Add ytd_tax DecimalField (year-to-date tax)
   - Track cumulative amounts

7. **Add annual projection field**
   - Add annual_projected_tax DecimalField
   - Store projected annual tax
   - Used for monthly calculation

8. **Add calculation date field**
   - Add calculation_date DateField
   - Reference calculation date

9. **Add notes field**
   - Add notes TextField
   - Set blank=True, null=True
   - For adjustments or special cases

### Field Definitions

| Field | Type | Constraints | Purpose |
|-------|------|-------------|---------|
| gross_income | Decimal(15,2) | required | Monthly gross income |
| taxable_income | Decimal(15,2) | required | After exemptions |
| epf_deduction | Decimal(15,2) | default=0 | Employee EPF (deductible) |
| exemptions | JSONField | blank=True | Exemptions breakdown |
| tax_slabs_applied | JSONField | blank=True | Tax slab breakdown |
| monthly_tax | Decimal(15,2) | default=0 | Monthly PAYE tax |
| ytd_gross | Decimal(15,2) | default=0 | Year-to-date gross |
| ytd_tax | Decimal(15,2) | default=0 | Year-to-date tax |
| annual_projected_tax | Decimal(15,2) | default=0 | Projected annual tax |
| calculation_date | DateField | required | Calculation date |
| notes | TextField | blank=True | Additional notes |

### Exemptions Structure

```json
{
  "personal_relief": 1200000,
  "epf_contribution": 96000,
  "other_exemptions": 0,
  "total_exemptions": 1296000
}
```

### Tax Slabs Structure

```json
{
  "slabs": [
    {"from": 0, "to": 1200000, "rate": 0, "tax": 0},
    {"from": 1200001, "to": 1700000, "rate": 6, "tax": 30000},
    {"from": 1700001, "to": 2200000, "rate": 12, "tax": 60000}
  ],
  "total_annual_tax": 90000,
  "monthly_tax": 7500
}
```

### Expected Outcome
- All PAYE calculation fields added
- Income and tax amounts stored
- Exemptions and slabs tracked in JSON
- YTD tracking enabled

### Verification Checklist
- [ ] gross_income field added
- [ ] taxable_income field added
- [ ] epf_deduction field added
- [ ] exemptions JSONField added
- [ ] tax_slabs_applied JSONField added
- [ ] monthly_tax field added
- [ ] ytd_gross field added
- [ ] ytd_tax field added
- [ ] annual_projected_tax field added
- [ ] calculation_date field added
- [ ] notes field added
- [ ] All fields use appropriate types

---

## Task 62: Run PAYECalculation Migrations

### Overview
Generate and apply database migrations for the PAYECalculation model.

### Dependencies
- Tasks 60-61 completed (PAYECalculation model fully defined)

### Instructions

1. **Generate migration file**
   - Run makemigrations for payroll app
   - Review generated migration
   - Verify all fields included

2. **Review migration**
   - Open migration file
   - Check field definitions
   - Verify JSON fields configured correctly
   - Check decimal precision

3. **Apply migration**
   - Run migrate command
   - Apply to database
   - Verify successful execution

4. **Verify database table**
   - Check table created
   - Verify all columns exist
   - Check foreign key to EmployeePayroll
   - Verify JSON field support

5. **Test model operations**
   - Create test PAYECalculation record
   - Test JSON field operations
   - Verify decimal calculations
   - Delete test record

### Migration Commands

```bash
python manage.py makemigrations payroll
python manage.py migrate payroll
```

### Expected Outcome
- Migration generated successfully
- Database table created
- All fields present
- Model fully operational

### Verification Checklist
- [ ] Migration file generated
- [ ] Migration reviewed
- [ ] Migration applied successfully
- [ ] Table exists in database
- [ ] All columns created
- [ ] Foreign keys configured
- [ ] JSON fields working
- [ ] Can create records
- [ ] Can query records

---

## Summary

This document covered the creation of statutory contribution and tax calculation models:

**EPF Model (Tasks 53-56):**
- EPFContribution model with employee and employer contributions
- EPF base field for applicable earnings
- 8% employee and 12% employer rates
- Migration applied

**ETF Model (Tasks 57-59):**
- ETFContribution model for employer-only contribution
- 3% employer contribution rate
- ETF base typically same as EPF base
- Migration applied

**PAYE Model (Tasks 60-62):**
- PAYECalculation model for income tax
- Taxable income calculation with exemptions
- Progressive tax slabs application
- YTD tracking for tax cumulation
- Migration applied

**Key Outcomes:**
- All three statutory models created
- Proper field definitions for precise calculations
- JSON fields for detailed breakdowns
- Migrations applied successfully
- Models ready for processor integration

These models provide the foundation for Sri Lanka statutory compliance in payroll processing.
