# Tasks 81-84: Integration Testing

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 12 - Tax Reporting  
> **Group:** F - API, Testing & Documentation  
> **Document:** 01 of 02  
> **Tasks Covered:** 81, 82, 83, 84

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-85-88_Documentation-Deployment.md](02_Tasks-85-88_Documentation-Deployment.md)

---

## Document Overview

This document covers comprehensive integration testing for the tax reporting module. Includes unit tests for VAT return generation with input/output VAT calculations, SVAT adjustments, and decimal precision. Tests EPF/ETF contribution calculations with employee data validation, percentage accuracy, and C-Form generation. Tests filing deadline calculations, reminder logic, and status transitions. Ensures accuracy of Sri Lankan tax calculations.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 81 | Write VAT Return Tests | High | 60 min |
| 82 | Write PAYE Return Tests | High | 50 min |
| 83 | Write EPF Return Tests | High | 45 min |
| 84 | Write ETF Return Tests | Medium | 35 min |

---

## Task 81: Write VAT Return Tests

### Overview
Create comprehensive unit tests for VAT return generation and calculation logic. Tests cover VAT registration validation, period verification, input VAT from purchases, output VAT from sales, SVAT adjustments, net VAT calculation, and PDF/CSV export. Ensures accuracy of Sri Lankan VAT calculations (18% standard rate) and proper handling of edge cases including zero-rated supplies and VAT-exempt transactions.

### Dependencies
- VAT return generation service implemented
- VATReturnGenerator class exists
- Test database configured
- pytest and pytest-django installed

### Instructions

1. **Create test file**
   - Navigate to `apps/accounting/tests/` directory
   - Create file named `test_vat_return.py`
   - This contains all VAT return tests

2. **Add test imports**
   - Import pytest and pytest fixtures
   - Import timezone from django.utils
   - Import VATReturnGenerator service
   - Import TaxConfiguration, TaxPeriodRecord models
   - Import Invoice, InvoiceItem models
   - Import Decimal for precise calculations

3. **Add module docstring**
   - Document test file purpose
   - Note Sri Lankan VAT context (18%)
   - Explain test coverage areas
   - Reference IRD VAT regulations

4. **Create test fixtures**
   - Create @pytest.fixture for tax_configuration
   - Set vat_enabled=True, vat_rate=18.00
   - Set vat_registration_number='VAT-123456789'
   - Returns TaxConfiguration instance

5. **Create tax period fixture**
   - Create @pytest.fixture for tax_period
   - Set period_start='2026-01-01'
   - Set period_end='2026-01-31'
   - Set status='FINALIZED'
   - Links to tax_configuration
   - Returns TaxPeriodRecord instance

6. **Create sales invoice fixtures**
   - Create @pytest.fixture for sales_invoices
   - Generate 5 sample sales invoices
   - Various amounts: LKR 10,000 to 100,000
   - Include VAT at 18%
   - Set invoice_date within period
   - Returns list of Invoice instances

7. **Create purchase invoice fixtures**
   - Create @pytest.fixture for purchase_invoices
   - Generate 3 sample purchase invoices
   - Various amounts for business expenses
   - Include input VAT at 18%
   - Set invoice_date within period
   - Returns list of Invoice instances

8. **Test VAT registration check**
   - Test name: test_vat_registration_required
   - Disable VAT in configuration
   - Attempt to generate VAT return
   - Assert raises ValidationError
   - Verify error message mentions registration

9. **Test period validation**
   - Test name: test_period_must_be_finalized
   - Set period status to 'DRAFT'
   - Attempt to generate VAT return
   - Assert raises ValidationError
   - Verify error message mentions finalization

10. **Test output VAT calculation**
    - Test name: test_output_vat_calculation
    - Create sales invoices totaling LKR 100,000
    - Expected output VAT: LKR 18,000
    - Generate VAT return
    - Assert return.output_vat == Decimal('18000.00')
    - Verify precision to 2 decimal places

11. **Test input VAT calculation**
    - Test name: test_input_vat_calculation
    - Create purchase invoices totaling LKR 50,000
    - Expected input VAT: LKR 9,000
    - Generate VAT return
    - Assert return.input_vat == Decimal('9000.00')
    - Verify deductible input VAT

12. **Test net VAT payable**
    - Test name: test_net_vat_payable
    - Output VAT: LKR 18,000
    - Input VAT: LKR 9,000
    - Expected net: LKR 9,000 payable
    - Generate VAT return
    - Assert return.net_vat == Decimal('9000.00')
    - Assert return.net_vat > 0 (payable to IRD)

13. **Test SVAT adjustment**
    - Test name: test_svat_adjustment
    - Create return with net VAT payable
    - Add manual SVAT adjustment: LKR 500
    - Recalculate net VAT
    - Assert final_net_vat includes SVAT
    - Verify adjustment documented

14. **Test zero-rated supplies**
    - Test name: test_zero_rated_supplies
    - Create export invoice (0% VAT)
    - Amount: LKR 50,000
    - Generate VAT return
    - Assert zero_rated_supplies == Decimal('50000.00')
    - Assert output_vat not affected

15. **Test VAT-exempt transactions**
    - Test name: test_exempt_transactions
    - Create exempt invoice (financial services)
    - Amount: LKR 20,000
    - Generate VAT return
    - Assert exempt_supplies == Decimal('20000.00')
    - Assert no VAT calculated

16. **Test date range filtering**
    - Test name: test_invoices_filtered_by_period
    - Create invoices inside and outside period
    - Generate VAT return for January
    - Assert only January invoices included
    - Verify count matches expected

17. **Test decimal precision**
    - Test name: test_decimal_precision
    - Create invoice with odd amount: LKR 123.45
    - Calculate VAT: 123.45 * 0.18 = 22.221
    - Expected: LKR 22.22 (rounded)
    - Assert proper rounding applied
    - Verify no floating point errors

18. **Test VAT return status**
    - Test name: test_return_status_lifecycle
    - Generate return (status=DRAFT)
    - Finalize return (status=FINALIZED)
    - Cannot edit finalized return
    - Assert status transitions valid

### Sri Lankan VAT Testing Context

| Test Area | Sri Lankan Specifics | Expected Behavior |
|-----------|---------------------|-------------------|
| **VAT Rate** | 18% standard rate | All calculations use 18% |
| **Registration** | IRD VAT number required | Format: VAT-XXXXXXXXX |
| **Zero-Rated** | Exports, specific goods | 0% VAT, tracked separately |
| **Exempt** | Financial services, education | No VAT, excluded from return |
| **SVAT** | Simplified VAT scheme | Manual adjustment field |

### VAT Calculation Examples
```
Sales Invoice: LKR 100,000
Output VAT (18%): LKR 18,000
Total: LKR 118,000

Purchase Invoice: LKR 50,000
Input VAT (18%): LKR 9,000
Total: LKR 59,000

Net VAT Payable: 18,000 - 9,000 = LKR 9,000
```

### Test Fixture Structure
```python
@pytest.fixture
def tax_configuration(db):
    """Create test tax configuration with VAT enabled."""
    return TaxConfiguration.objects.create(
        vat_enabled=True,
        vat_rate=Decimal('18.00'),
        vat_registration_number='VAT-123456789',
        # ... other fields
    )

@pytest.fixture
def sales_invoices(db, tax_period):
    """Create sample sales invoices for testing."""
    invoices = []
    for i in range(5):
        invoice = Invoice.objects.create(
            invoice_date=tax_period.period_start + timedelta(days=i),
            subtotal=Decimal('10000.00') * (i + 1),
            vat_amount=Decimal('1800.00') * (i + 1),
            # ... other fields
        )
        invoices.append(invoice)
    return invoices
```

### Expected Test Coverage
- VAT registration validation: ✓
- Period finalization requirement: ✓
- Output VAT calculation: ✓
- Input VAT calculation: ✓
- Net VAT calculation: ✓
- SVAT adjustments: ✓
- Zero-rated supplies: ✓
- Exempt transactions: ✓
- Date range filtering: ✓
- Decimal precision: ✓
- Status lifecycle: ✓

### Expected Outcome
- Comprehensive VAT return test suite
- All calculation accuracy verified
- Edge cases covered
- Sri Lankan VAT rules validated
- Decimal precision ensured

### Verification Checklist
- [ ] test_vat_return.py file created
- [ ] All test imports included
- [ ] Module docstring explains VAT testing
- [ ] tax_configuration fixture created
- [ ] tax_period fixture created
- [ ] sales_invoices fixture created
- [ ] purchase_invoices fixture created
- [ ] test_vat_registration_required implemented
- [ ] test_period_must_be_finalized implemented
- [ ] test_output_vat_calculation implemented
- [ ] test_input_vat_calculation implemented
- [ ] test_net_vat_payable implemented
- [ ] test_svat_adjustment implemented
- [ ] test_zero_rated_supplies implemented
- [ ] test_exempt_transactions implemented
- [ ] test_invoices_filtered_by_period implemented
- [ ] test_decimal_precision implemented
- [ ] test_return_status_lifecycle implemented
- [ ] All tests pass with pytest

---

## Task 82: Write PAYE Return Tests

### Overview
Create comprehensive unit tests for PAYE return generation and tax calculation. Tests cover employee tax bracket calculations according to Sri Lankan IRD slabs, monthly PAYE withholding, annual tax reconciliation, relief allowances (e.g., qualifying payments), and year-end adjustments. Ensures accuracy of progressive tax rate application and proper handling of tax-free thresholds.

### Dependencies
- PAYE return generation service implemented
- PAYEReturnGenerator class exists
- Employee payroll data available
- Test database configured

### Instructions

1. **Create test file**
   - Navigate to `apps/accounting/tests/` directory
   - Create file named `test_paye_return.py`
   - This contains all PAYE return tests

2. **Add test imports**
   - Import pytest and fixtures
   - Import PAYEReturnGenerator service
   - Import TaxConfiguration, TaxPeriodRecord
   - Import Employee, Payroll models
   - Import Decimal for tax calculations
   - Import TaxPAYEEmployee model

3. **Add module docstring**
   - Document PAYE testing purpose
   - Note Sri Lankan tax brackets (2026 rates)
   - Explain progressive tax system
   - Reference IRD PAYE guidelines

4. **Create employee fixtures**
   - Create @pytest.fixture for test_employees
   - Generate 5 employees with varying salaries:
     - Employee 1: LKR 50,000/month (below threshold)
     - Employee 2: LKR 150,000/month (6% bracket)
     - Employee 3: LKR 300,000/month (12% bracket)
     - Employee 4: LKR 500,000/month (18% bracket)
     - Employee 5: LKR 1,000,000/month (24% bracket)
   - Returns list of Employee instances

5. **Create payroll fixtures**
   - Create @pytest.fixture for payroll_records
   - Create monthly payroll for each employee
   - Set payroll_date within tax period
   - Include basic_salary, allowances, deductions
   - Calculate gross_salary
   - Returns list of Payroll instances

6. **Test tax-free threshold**
   - Test name: test_tax_free_threshold
   - Employee earning LKR 50,000/month (LKR 600,000/year)
   - Below annual threshold of LKR 1,200,000
   - Generate PAYE return
   - Assert paye_tax == Decimal('0.00')
   - Verify no tax withheld

7. **Test 6% tax bracket**
   - Test name: test_6_percent_bracket
   - Employee earning LKR 150,000/month (LKR 1,800,000/year)
   - First LKR 1,200,000: Tax-free
   - Next LKR 600,000: 6% = LKR 36,000
   - Expected annual PAYE: LKR 36,000
   - Expected monthly: LKR 3,000
   - Assert calculated tax matches

8. **Test 12% tax bracket**
   - Test name: test_12_percent_bracket
   - Employee earning LKR 300,000/month (LKR 3,600,000/year)
   - First LKR 1,200,000: Tax-free
   - Next LKR 1,000,000: 6% = LKR 60,000
   - Next LKR 1,400,000: 12% = LKR 168,000
   - Expected annual PAYE: LKR 228,000
   - Expected monthly: LKR 19,000
   - Assert progressive calculation correct

9. **Test 18% tax bracket**
   - Test name: test_18_percent_bracket
   - Employee earning LKR 500,000/month (LKR 6,000,000/year)
   - Calculate through all brackets
   - Verify 18% applied to appropriate portion
   - Assert cumulative tax correct

10. **Test 24% tax bracket**
    - Test name: test_24_percent_bracket
    - High earner: LKR 1,000,000/month
    - Calculate through all brackets to 24%
    - Verify maximum bracket applied
    - Assert total annual tax correct

11. **Test relief allowances**
    - Test name: test_qualifying_payment_relief
    - Employee with qualifying payment (e.g., insurance)
    - Relief: LKR 10,000/month deductible
    - Reduces taxable income
    - Recalculate PAYE with relief
    - Assert tax reduced appropriately

12. **Test monthly withholding**
    - Test name: test_monthly_paye_withholding
    - Generate PAYE return for January 2026
    - Calculate monthly withholding for all employees
    - Sum total PAYE withheld
    - Assert matches expected monthly remittance
    - Verify to be paid to IRD by Feb 15

13. **Test annual reconciliation**
    - Test name: test_annual_reconciliation
    - Generate returns for all 12 months
    - Sum monthly PAYE withheld
    - Compare to annual tax calculated
    - Assert annual match within rounding
    - Verify no over/under withholding

14. **Test mid-year employment**
    - Test name: test_mid_year_employee
    - Employee joined in June 2026
    - Only 7 months of salary
    - Calculate pro-rated annual income
    - Apply tax brackets to annualized amount
    - Assert correct proportion withheld

15. **Test bonus taxation**
    - Test name: test_bonus_taxation
    - Employee receives LKR 100,000 bonus
    - Add to monthly salary for PAYE calculation
    - May push into higher bracket
    - Verify correct tax on bonus
    - Assert total withholding includes bonus tax

16. **Test PAYE summary report**
    - Test name: test_paye_summary_generation
    - Generate PAYE return for period
    - Verify summary includes:
      - Total employees
      - Total gross salary
      - Total PAYE withheld
      - Average PAYE per employee
    - Assert summary data accurate

17. **Test employee detail breakdown**
    - Test name: test_employee_detail_breakdown
    - PAYE return includes per-employee detail
    - Each employee listed with:
      - Name and EPF number
      - Gross salary
      - PAYE withheld
      - Tax bracket
    - Assert all employees included

### Sri Lankan PAYE Tax Brackets (2026)

| Annual Income (LKR) | Tax Rate | Tax on Band |
|---------------------|----------|-------------|
| First 1,200,000 | 0% | 0 |
| Next 1,000,000 (1.2M-2.2M) | 6% | Up to 60,000 |
| Next 1,000,000 (2.2M-3.2M) | 12% | Up to 120,000 |
| Next 1,000,000 (3.2M-4.2M) | 18% | Up to 180,000 |
| Above 4,200,000 | 24% | Variable |

### PAYE Calculation Example
```
Annual Salary: LKR 3,600,000

Bracket 1 (0-1.2M):     LKR 1,200,000 @ 0%  = LKR 0
Bracket 2 (1.2M-2.2M):  LKR 1,000,000 @ 6%  = LKR 60,000
Bracket 3 (2.2M-3.2M):  LKR 1,000,000 @ 12% = LKR 120,000
Bracket 4 (3.2M-3.6M):  LKR   400,000 @ 18% = LKR 72,000
                                Total PAYE   = LKR 252,000/year
                                Monthly PAYE = LKR 21,000
```

### Expected Test Coverage
- Tax-free threshold: ✓
- Each tax bracket (6%, 12%, 18%, 24%): ✓
- Progressive calculation: ✓
- Relief allowances: ✓
- Monthly withholding: ✓
- Annual reconciliation: ✓
- Mid-year employment: ✓
- Bonus taxation: ✓
- Summary reports: ✓
- Employee breakdown: ✓

### Expected Outcome
- Comprehensive PAYE test suite
- Tax bracket accuracy verified
- Progressive calculation validated
- Edge cases covered
- Sri Lankan PAYE rules confirmed

### Verification Checklist
- [ ] test_paye_return.py file created
- [ ] All test imports included
- [ ] Module docstring explains PAYE testing
- [ ] test_employees fixture created
- [ ] payroll_records fixture created
- [ ] test_tax_free_threshold implemented
- [ ] test_6_percent_bracket implemented
- [ ] test_12_percent_bracket implemented
- [ ] test_18_percent_bracket implemented
- [ ] test_24_percent_bracket implemented
- [ ] test_qualifying_payment_relief implemented
- [ ] test_monthly_paye_withholding implemented
- [ ] test_annual_reconciliation implemented
- [ ] test_mid_year_employee implemented
- [ ] test_bonus_taxation implemented
- [ ] test_paye_summary_generation implemented
- [ ] test_employee_detail_breakdown implemented
- [ ] All tests pass with pytest

---

## Task 83: Write EPF Return Tests

### Overview
Create comprehensive unit tests for EPF contribution calculation and C-Form generation. Tests cover employee contribution (8% of basic salary), employer contribution (12% of basic salary), total contribution (20%), contribution limits, and C-Form formatting. Ensures accuracy of Sri Lankan CBSL EPF regulations and proper handling of maximum contribution thresholds if applicable.

### Dependencies
- EPF return generation service implemented
- EPFReturnGenerator class exists
- Employee and payroll data available
- C-Form template configured

### Instructions

1. **Create test file**
   - Navigate to `apps/accounting/tests/` directory
   - Create file named `test_epf_return.py`
   - This contains all EPF return tests

2. **Add test imports**
   - Import pytest and fixtures
   - Import EPFReturnGenerator service
   - Import TaxConfiguration, TaxPeriodRecord
   - Import Employee, Payroll models
   - Import Decimal for calculations
   - Import EPFContribution model

3. **Add module docstring**
   - Document EPF testing purpose
   - Note CBSL EPF rates (8% + 12%)
   - Explain contribution breakdown
   - Reference CBSL EPF Act

4. **Create employee fixtures**
   - Create @pytest.fixture for epf_employees
   - Generate employees with varying salaries:
     - Employee 1: Basic LKR 50,000
     - Employee 2: Basic LKR 100,000
     - Employee 3: Basic LKR 200,000
   - Ensure EPF registration numbers
   - Returns list of Employee instances

5. **Create payroll fixtures**
   - Create @pytest.fixture for epf_payroll
   - Create monthly payroll records
   - Set basic_salary (for EPF calculation)
   - Set allowances (usually EPF-exempt)
   - Returns list of Payroll instances

6. **Test employee contribution (8%)**
   - Test name: test_employee_contribution_8_percent
   - Employee with basic salary LKR 100,000
   - Expected employee contribution: LKR 8,000
   - Generate EPF return
   - Assert employee_contribution == Decimal('8000.00')
   - Verify 8% calculation

7. **Test employer contribution (12%)**
   - Test name: test_employer_contribution_12_percent
   - Employee with basic salary LKR 100,000
   - Expected employer contribution: LKR 12,000
   - Generate EPF return
   - Assert employer_contribution == Decimal('12000.00')
   - Verify 12% calculation

8. **Test total contribution (20%)**
   - Test name: test_total_contribution_20_percent
   - Employee with basic salary LKR 100,000
   - Employee: LKR 8,000
   - Employer: LKR 12,000
   - Total: LKR 20,000
   - Assert total_contribution == Decimal('20000.00')
   - Verify sum correct

9. **Test allowances excluded**
   - Test name: test_allowances_excluded_from_epf
   - Employee basic: LKR 80,000
   - Allowances: LKR 20,000 (transport, meal)
   - Gross salary: LKR 100,000
   - EPF calculated on basic only
   - Assert contribution on LKR 80,000 only
   - Verify allowances not included

10. **Test multiple employees**
    - Test name: test_multiple_employees_epf
    - Generate return for 10 employees
    - Calculate each employee and employer contribution
    - Sum total contributions
    - Assert summary totals correct
    - Verify per-employee breakdown

11. **Test C-Form generation**
    - Test name: test_c_form_generation
    - Generate EPF return with C-Form
    - Verify C-Form includes:
      - Employer name and EPF number
      - Contribution month
      - Employee list with EPF numbers
      - Individual contributions
      - Total contributions
    - Assert C-Form format valid

12. **Test C-Form employee listing**
    - Test name: test_c_form_employee_listing
    - Each employee on C-Form shows:
      - EPF number
      - Full name
      - Basic salary
      - Employee contribution (8%)
      - Employer contribution (12%)
    - Assert all fields present

13. **Test C-Form totals**
    - Test name: test_c_form_totals
    - C-Form footer shows:
      - Total employees
      - Total basic salaries
      - Total employee contributions
      - Total employer contributions
      - Grand total contribution
    - Assert totals match sum of rows

14. **Test mid-month joining**
    - Test name: test_mid_month_joining
    - Employee joined on 15th of month
    - Pro-rated basic salary for half month
    - Calculate EPF on pro-rated amount
    - Assert contribution proportional

15. **Test resignation handling**
    - Test name: test_resignation_mid_month
    - Employee resigned on 20th of month
    - Pro-rated salary for days worked
    - Calculate EPF on final salary
    - Assert included in monthly return

16. **Test EPF number validation**
    - Test name: test_epf_number_required
    - Employee without EPF number
    - Attempt to generate return
    - Assert raises ValidationError
    - Verify error message clear

17. **Test decimal precision**
    - Test name: test_epf_decimal_precision
    - Basic salary: LKR 123,456.78
    - Employee contribution: 123,456.78 * 0.08 = 9,876.54
    - Employer contribution: 123,456.78 * 0.12 = 14,814.81
    - Verify proper rounding
    - Assert no precision errors

### Sri Lankan EPF Contribution Rates

| Contributor | Rate | Base | Recipient |
|-------------|------|------|-----------|
| **Employee** | 8% | Basic Salary | Employee's EPF account |
| **Employer** | 12% | Basic Salary | Employee's EPF account |
| **Total** | 20% | Basic Salary | CBSL EPF Fund |

### EPF Calculation Examples
```
Example 1: Basic Salary LKR 100,000
Employee Contribution (8%):  LKR 8,000
Employer Contribution (12%): LKR 12,000
Total Contribution:          LKR 20,000

Example 2: Basic LKR 80,000 + Allowances LKR 20,000
Gross Salary:                LKR 100,000
EPF Base (basic only):       LKR 80,000
Employee Contribution (8%):  LKR 6,400
Employer Contribution (12%): LKR 9,600
Total Contribution:          LKR 16,000
```

### C-Form Structure
```
EMPLOYEES' PROVIDENT FUND - FORM C
Contribution Period: January 2026
Employer: XYZ Company Ltd
EPF Employer Number: EPF-12345

No. | EPF Number   | Name         | Basic Salary | Employee (8%) | Employer (12%) | Total
----|--------------|--------------|--------------|---------------|----------------|-------
1   | EPF-100001   | John Doe     | 100,000.00   | 8,000.00      | 12,000.00      | 20,000.00
2   | EPF-100002   | Jane Smith   | 150,000.00   | 12,000.00     | 18,000.00      | 30,000.00

Total: 2 employees | Total Basic: 250,000.00 | Total EPF: 50,000.00
```

### Expected Test Coverage
- Employee contribution (8%): ✓
- Employer contribution (12%): ✓
- Total contribution (20%): ✓
- Allowances excluded: ✓
- Multiple employees: ✓
- C-Form generation: ✓
- C-Form employee listing: ✓
- C-Form totals: ✓
- Pro-rated salaries: ✓
- EPF number validation: ✓
- Decimal precision: ✓

### Expected Outcome
- Comprehensive EPF test suite
- Contribution accuracy verified
- C-Form generation validated
- CBSL regulations confirmed
- Edge cases covered

### Verification Checklist
- [ ] test_epf_return.py file created
- [ ] All test imports included
- [ ] Module docstring explains EPF testing
- [ ] epf_employees fixture created
- [ ] epf_payroll fixture created
- [ ] test_employee_contribution_8_percent implemented
- [ ] test_employer_contribution_12_percent implemented
- [ ] test_total_contribution_20_percent implemented
- [ ] test_allowances_excluded_from_epf implemented
- [ ] test_multiple_employees_epf implemented
- [ ] test_c_form_generation implemented
- [ ] test_c_form_employee_listing implemented
- [ ] test_c_form_totals implemented
- [ ] test_mid_month_joining implemented
- [ ] test_resignation_mid_month implemented
- [ ] test_epf_number_required implemented
- [ ] test_epf_decimal_precision implemented
- [ ] All tests pass with pytest

---

## Task 84: Write ETF Return Tests

### Overview
Create comprehensive unit tests for ETF contribution calculation and return generation. Tests cover employer contribution (3% of gross salary - note: ETF is on gross, not just basic), employee exemption (ETF paid by employer only), total ETF calculation, and return formatting. Ensures accuracy of Sri Lankan ETF Board regulations and proper handling of gross salary calculation including allowances.

### Dependencies
- ETF return generation service implemented
- ETFReturnGenerator class exists
- Employee and payroll data available
- Test database configured

### Instructions

1. **Create test file**
   - Navigate to `apps/accounting/tests/` directory
   - Create file named `test_etf_return.py`
   - This contains all ETF return tests

2. **Add test imports**
   - Import pytest and fixtures
   - Import ETFReturnGenerator service
   - Import TaxConfiguration, TaxPeriodRecord
   - Import Employee, Payroll models
   - Import Decimal for calculations
   - Import ETFContribution model

3. **Add module docstring**
   - Document ETF testing purpose
   - Note ETF Board rate (3% on gross)
   - Explain employer-only contribution
   - Note difference from EPF (gross vs basic)
   - Reference ETF Act

4. **Create employee fixtures**
   - Create @pytest.fixture for etf_employees
   - Generate employees with varying compensation:
     - Employee 1: Basic LKR 80,000 + Allowances LKR 20,000
     - Employee 2: Basic LKR 150,000 + Allowances LKR 50,000
     - Employee 3: Basic LKR 200,000 (no allowances)
   - Returns list of Employee instances

5. **Create payroll fixtures**
   - Create @pytest.fixture for etf_payroll
   - Create monthly payroll records
   - Set basic_salary and allowances
   - Calculate gross_salary (basic + allowances)
   - Returns list of Payroll instances

6. **Test employer contribution (3%)**
   - Test name: test_employer_contribution_3_percent
   - Employee gross salary: LKR 100,000
   - Expected ETF contribution: LKR 3,000
   - Generate ETF return
   - Assert etf_contribution == Decimal('3000.00')
   - Verify 3% calculation

7. **Test employee exemption**
   - Test name: test_employee_does_not_contribute
   - ETF paid by employer only
   - Employee does not contribute
   - Generate ETF return
   - Assert employee_contribution == None or not present
   - Verify only employer amount shown

8. **Test gross salary calculation**
   - Test name: test_etf_on_gross_salary
   - Employee basic: LKR 80,000
   - Allowances: LKR 20,000
   - Gross: LKR 100,000
   - ETF: 100,000 * 0.03 = LKR 3,000
   - Assert ETF calculated on full gross
   - Verify allowances included (unlike EPF)

9. **Test ETF vs EPF comparison**
   - Test name: test_etf_vs_epf_base_difference
   - Employee basic: LKR 80,000
   - Allowances: LKR 20,000
   - Gross: LKR 100,000
   - EPF base: Basic only (LKR 80,000)
   - ETF base: Gross (LKR 100,000)
   - Assert different calculation bases
   - Document key difference

10. **Test multiple employees**
    - Test name: test_multiple_employees_etf
    - Generate return for 10 employees
    - Various gross salaries
    - Calculate each ETF contribution
    - Sum total contributions
    - Assert summary totals correct

11. **Test ETF return format**
    - Test name: test_etf_return_format
    - Generate ETF return
    - Verify return includes:
      - Employer name and ETF registration
      - Contribution month
      - Employee count
      - Total gross salaries
      - Total ETF contribution (3%)
    - Assert all required fields present

12. **Test employee listing**
    - Test name: test_etf_employee_listing
    - Each employee on return shows:
      - EPF number (used for ID)
      - Full name
      - Gross salary
      - ETF contribution (3%)
    - Assert all employees included

13. **Test ETF remittance calculation**
    - Test name: test_etf_remittance_amount
    - Sum all ETF contributions
    - Amount to remit to ETF Board
    - Due last day of following month
    - Assert remittance total correct
    - Verify payable amount

14. **Test mid-month employment**
    - Test name: test_mid_month_employment_etf
    - Employee joined mid-month
    - Pro-rated gross salary
    - Calculate ETF on pro-rated amount
    - Assert contribution proportional

15. **Test decimal precision**
    - Test name: test_etf_decimal_precision
    - Gross salary: LKR 123,456.78
    - ETF: 123,456.78 * 0.03 = 3,703.70
    - Verify proper rounding
    - Assert no precision errors
    - Test multiple employees and sum

16. **Test zero gross salary**
    - Test name: test_zero_gross_salary
    - Employee on unpaid leave
    - Gross salary: LKR 0
    - ETF contribution: LKR 0
    - Assert handled without error
    - Verify excluded from return or shown as zero

### Sri Lankan ETF Contribution Rules

| Aspect | Details |
|--------|---------|
| **Rate** | 3% of gross salary |
| **Base** | Gross salary (basic + allowances) |
| **Contributor** | Employer only |
| **Employee** | No contribution from employee |
| **Authority** | ETF Board |
| **Due Date** | Last day of following month |

### ETF Calculation Examples
```
Example 1: Basic LKR 100,000 (no allowances)
Gross Salary:         LKR 100,000
ETF (3% employer):    LKR 3,000
Employee contributes: LKR 0

Example 2: Basic LKR 80,000 + Allowances LKR 20,000
Gross Salary:         LKR 100,000
ETF (3% employer):    LKR 3,000
Employee contributes: LKR 0

Example 3: Basic LKR 150,000 + Allowances LKR 50,000
Gross Salary:         LKR 200,000
ETF (3% employer):    LKR 6,000
Employee contributes: LKR 0
```

### EPF vs ETF Comparison

| Aspect | EPF | ETF |
|--------|-----|-----|
| **Calculation Base** | Basic salary only | Gross salary (basic + allowances) |
| **Employee Contribution** | 8% | 0% |
| **Employer Contribution** | 12% | 3% |
| **Total Rate** | 20% | 3% |
| **Authority** | CBSL | ETF Board |
| **Due Date** | Last day of next month | Last day of next month |

### Expected Test Coverage
- Employer contribution (3%): ✓
- Employee exemption: ✓
- Gross salary base: ✓
- ETF vs EPF difference: ✓
- Multiple employees: ✓
- Return format: ✓
- Employee listing: ✓
- Remittance calculation: ✓
- Pro-rated salaries: ✓
- Decimal precision: ✓
- Zero salary handling: ✓

### Expected Outcome
- Comprehensive ETF test suite
- Contribution accuracy verified
- Gross salary calculation validated
- ETF Board regulations confirmed
- Key differences from EPF documented

### Verification Checklist
- [ ] test_etf_return.py file created
- [ ] All test imports included
- [ ] Module docstring explains ETF testing
- [ ] etf_employees fixture created
- [ ] etf_payroll fixture created
- [ ] test_employer_contribution_3_percent implemented
- [ ] test_employee_does_not_contribute implemented
- [ ] test_etf_on_gross_salary implemented
- [ ] test_etf_vs_epf_base_difference implemented
- [ ] test_multiple_employees_etf implemented
- [ ] test_etf_return_format implemented
- [ ] test_etf_employee_listing implemented
- [ ] test_etf_remittance_amount implemented
- [ ] test_mid_month_employment_etf implemented
- [ ] test_etf_decimal_precision implemented
- [ ] test_zero_gross_salary implemented
- [ ] All tests pass with pytest

---

## Notes for AI Agents

### Testing Philosophy
Tax calculations require absolute accuracy with zero tolerance for errors. Tests must verify calculations to two decimal places (Sri Lankan Rupee cents), handle edge cases like month boundaries and pro-rated salaries, and validate against published tax authority guidelines.

### Sri Lankan Tax Testing Context
All tests reflect 2026 Sri Lankan tax rates and regulations:
- VAT: 18% standard rate
- PAYE: Progressive brackets (0%, 6%, 12%, 18%, 24%)
- EPF: 20% total (8% employee + 12% employer) on basic salary
- ETF: 3% employer-only on gross salary

### Decimal Precision Requirements
Use Python's Decimal class for all monetary calculations to avoid floating-point errors. Example: `Decimal('100.00')` not `100.0`. Round to 2 decimal places for currency display. Never use float for money calculations.

### Fixture Best Practices
- Use pytest fixtures to avoid code duplication
- Mark fixtures with appropriate scope (@pytest.fixture(scope='module'))
- Use factories for generating multiple test objects
- Reset database state between tests with @pytest.mark.django_db

### Test Organization
Group related tests in classes for better organization:
```python
class TestVATCalculations:
    def test_output_vat(self): ...
    def test_input_vat(self): ...
    def test_net_vat(self): ...

class TestVATExports:
    def test_pdf_export(self): ...
    def test_csv_export(self): ...
```

### Running Tests
```bash
# Run all tax tests
pytest apps/accounting/tests/test_*_return.py -v

# Run specific test file
pytest apps/accounting/tests/test_vat_return.py -v

# Run specific test
pytest apps/accounting/tests/test_vat_return.py::test_output_vat_calculation -v

# Run with coverage
pytest apps/accounting/tests/ --cov=apps.accounting.tax --cov-report=html
```

### Common Testing Pitfalls
- **Don't** use approximate assertions for currency (`assert x == 100.00`)
- **Do** use exact decimal comparison (`assert x == Decimal('100.00')`)
- **Don't** hardcode dates (use timezone.now() or fixtures)
- **Do** test timezone-aware datetime handling
- **Don't** assume employee counts or salary ranges
- **Do** test with empty datasets and edge cases

### Sri Lankan Tax Calculation Accuracy
IRD and CBSL perform audits with zero tolerance for calculation errors. Tests must ensure:
- VAT calculations match IRD guidelines exactly
- PAYE brackets applied correctly with no gaps/overlaps
- EPF percentages (8% + 12%) verified
- ETF percentage (3%) on correct base (gross)
- All calculations rounded properly (not truncated)

### Multi-Tenant Testing
If implementing multi-tenant system:
- Ensure tenant isolation in all tests
- Verify tenant A cannot access tenant B's data
- Test tenant context switching
- Validate tenant-specific configurations

### Performance Testing
- Test return generation with 100+ employees
- Verify query optimization (N+1 queries)
- Measure generation time (should be < 5 seconds for 100 employees)
- Test concurrent generation (multiple users)

### Integration with CI/CD
- All tests must pass before deployment
- Run tests automatically on pull requests
- Generate coverage reports (target: >90%)
- Block merge if tests fail
