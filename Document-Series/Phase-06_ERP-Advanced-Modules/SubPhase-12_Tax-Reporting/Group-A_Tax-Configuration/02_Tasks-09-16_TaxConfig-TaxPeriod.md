# Tasks 09-16: TaxConfiguration Completion and TaxPeriodRecord

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 12 - Tax Reporting  
> **Group:** A - Tax Configuration  
> **Document:** 02 of 02  
> **Tasks Covered:** 09, 10, 11, 12, 13, 14, 15, 16

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-01-08_Tax-Module-Enums-Config.md](01_Tasks-01-08_Tax-Module-Enums-Config.md)

---

## Document Overview

This document completes the TaxConfiguration model with ETF registration, employer TIN, and VAT filing frequency fields, then implements the TaxPeriodRecord model for tracking individual tax filing periods with date ranges and status tracking.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 09 | Add ETF Registration | Low | 10 min |
| 10 | Add Employer TIN | Low | 10 min |
| 11 | Add VAT Filing Frequency | Low | 15 min |
| 12 | Run TaxConfig Migrations | Low | 10 min |
| 13 | Create TaxPeriodRecord Model | Medium | 30 min |
| 14 | Add Period Date Range | Low | 15 min |
| 15 | Add Period Status | Low | 10 min |
| 16 | Run TaxPeriod Migrations | Low | 10 min |

---

## Task 09: Add ETF Registration

### Overview
Add the ETF (Employees' Trust Fund) registration number field to TaxConfiguration model. This field stores the employer's ETF registration number issued by ETF Board, required for monthly ETF contribution filing.

### Dependencies
- Task 08: Add EPF Registration

### Instructions

1. **Open tax_configuration.py file**
   - Continue in `apps/accounting/models/tax_configuration.py`
   - Add field after epf_registration_no

2. **Add ETF registration number field**
   - Field name: `etf_registration_no`
   - Field type: CharField
   - Max length: 15 characters
   - Allow null and blank (not all businesses have employees)

3. **Add field validation**
   - Add validator for Sri Lankan ETF format
   - Format: Numeric sequence (typically 6 digits)
   - Example: 123456
   - Validator should verify numeric characters only

4. **Set field attributes**
   - verbose_name: 'ETF Registration Number'
   - help_text: 'ETF registration number issued by Employees Trust Fund Board (6-digit numeric)'
   - blank=True (optional field)
   - null=True (database allows NULL)

5. **Add field comments**
   - Document ETF number format requirements
   - Explain when field should be populated
   - Note relationship to payroll and ETF filing

### ETF Registration Context

**ETF Scheme Overview**
- Employees' Trust Fund provides employee welfare benefits
- Governed by ETF Board (separate from EPF)
- Employer-only contribution: 3% of basic salary
- No employee contribution required
- Monthly contribution due by 15th of next month
- Benefits: Housing, education, medical assistance

**ETF Number Format**
- Structure: 6-digit numeric sequence
- Example: 456789
- Issued by: Employees' Trust Fund Board
- No prefix (unlike EPF's "E/")
- Format validation: Must be 6 digits

**Registration Requirements**
- Mandatory for all employers with employees
- Register simultaneously with EPF (often same visit)
- Apply at ETF Board offices or online
- Provide business registration and employee count
- Processing time: 1-2 weeks
- Certificate issued with ETF number

**ETF Contributions**
- Employer: 3% of basic salary (no employee deduction)
- Additional cost to employer (beyond EPF 12%)
- Total employer burden: 15% (12% EPF + 3% ETF)
- Monthly deadline: 15th of following month
- Late payment penalties apply
- Online filing via ETF portal

**ETF vs EPF Comparison**

| Aspect | EPF | ETF |
|--------|-----|-----|
| Contribution | 20% (8% + 12%) | 3% employer only |
| Purpose | Retirement savings | Employee welfare |
| Authority | Central Bank | ETF Board |
| Number Format | E/XXXXXX | XXXXXX |
| Monthly Due | 15th | 15th |
| Portal | epf.lk | etfb.lk |

**Field Usage**
- Required for monthly ETF contribution filing
- Displayed on ETF Form (monthly return)
- Used in ETF portal authentication
- Required for employer registration verification
- Must match Certificate of Registration

**Business Rules**
- If employer has employees → ETF number required
- Null/blank acceptable only if no employees
- Usually registered together with EPF
- Used to track ETF filing periods and deadlines
- Linked to payroll processing for automatic calculations

### Expected Outcome
- ETF registration number field added to model
- Format validation ensures data quality
- Optional field (businesses without employees may not have)
- Supports Sri Lankan ETF number format
- Ready for use in ETF reporting features

### Verification Checklist
- [ ] `etf_registration_no` field added to TaxConfiguration
- [ ] Field type is CharField with max_length=15
- [ ] Field allows null and blank values
- [ ] Validator checks ETF number format (6 digits)
- [ ] Verbose name and help text are descriptive
- [ ] Field comments explain format and usage

---

## Task 10: Add Employer TIN

### Overview
Add the Tax Identification Number (TIN) field to TaxConfiguration model. This field stores the employer's unique TIN issued by Sri Lanka Inland Revenue Department, used for all tax-related communications and filings.

### Dependencies
- Task 09: Add ETF Registration

### Instructions

1. **Open tax_configuration.py file**
   - Continue in `apps/accounting/models/tax_configuration.py`
   - Add field after etf_registration_no

2. **Add TIN field**
   - Field name: `tin_number`
   - Field type: CharField
   - Max length: 15 characters
   - Allow null and blank (optional for small businesses)

3. **Add field validation**
   - Add validator for Sri Lankan TIN format
   - Format: 9-digit numeric sequence
   - Example: 123456789
   - Validator should verify 9 digits

4. **Set field attributes**
   - verbose_name: 'Tax Identification Number (TIN)'
   - help_text: 'Employer TIN issued by Inland Revenue Department (9-digit numeric)'
   - blank=True (optional field)
   - null=True (database allows NULL)
   - unique per tenant consideration

5. **Add field comments**
   - Document TIN format requirements
   - Explain when field should be populated
   - Note relationship to all tax filings

### TIN Context

**TIN Overview**
- Universal identifier for all tax matters
- Issued by: Inland Revenue Department of Sri Lanka
- Used for: Income tax, VAT, PAYE, WHT, all tax returns
- Replaces older tax file numbers
- Mandatory for all businesses and individuals filing taxes

**TIN Number Format**
- Structure: 9-digit numeric sequence
- Example: 415678912
- No prefix or suffix
- Leading zeros: Not typically included
- Validation: Must be exactly 9 digits

**TIN Registration**
- Automatically issued when register for any tax
- Apply online via RAMIS portal (revenue.gov.lk)
- Required documents: Business registration, NIC
- Processing time: Immediate to 1 week
- TIN certificate downloadable from RAMIS
- One TIN per business entity (not per tax type)

**TIN Usage**

| Tax Type | TIN Usage |
|----------|-----------|
| VAT | Must appear on all VAT returns and correspondence |
| PAYE | Employer TIN on payroll tax returns |
| WHT | TIN when issuing withholding certificates |
| Corporate Tax | Company TIN on income tax returns |
| EPF/ETF | May be requested for cross-reference |

**TIN vs Other Numbers**
- **TIN:** Universal tax identifier (all tax types)
- **VAT Number:** Specific to VAT registration (includes -7000)
- **EPF Number:** Specific to EPF contributions (E/ prefix)
- **ETF Number:** Specific to ETF contributions (numeric)
- **Business Registration Number:** Different from TIN

**Field Usage**
- Required for filing any tax return online
- Appears on all tax correspondence
- Used for RAMIS portal authentication
- Cross-reference across different tax types
- Employer identification on employee tax forms

**Business Rules**
- Businesses filing any tax should have TIN
- May be null if business too small for tax registration
- Same TIN used for VAT, PAYE, corporate tax
- Not the same as business registration number
- Critical for automated e-filing integration

### Expected Outcome
- TIN field added to model
- Format validation ensures data quality
- Optional field (very small businesses may not have)
- Supports Sri Lankan TIN format
- Ready for use across all tax reporting features

### Verification Checklist
- [ ] `tin_number` field added to TaxConfiguration
- [ ] Field type is CharField with max_length=15
- [ ] Field allows null and blank values
- [ ] Validator checks TIN format (9 digits)
- [ ] Verbose name and help text are descriptive
- [ ] Field comments explain format and usage

---

## Task 11: Add VAT Filing Frequency

### Overview
Add the VAT filing frequency field to TaxConfiguration model. This field specifies whether the business files VAT returns monthly or quarterly, determining the schedule for VAT filing periods and deadlines.

### Dependencies
- Task 10: Add Employer TIN
- Task 03: Define TaxPeriod Enum (provides choices)

### Instructions

1. **Open tax_configuration.py file**
   - Continue in `apps/accounting/models/tax_configuration.py`
   - Add field after tin_number

2. **Add VAT filing period field**
   - Field name: `vat_filing_period`
   - Field type: CharField with choices from TaxPeriod enum
   - Max length: 20 characters
   - Allow null and blank (not applicable if not VAT registered)

3. **Set field choices**
   - Use TaxPeriod.choices
   - Limit to MONTHLY and QUARTERLY (exclude ANNUAL)
   - MONTHLY: For businesses with turnover > LKR 75M
   - QUARTERLY: For SVAT businesses (LKR 12M-75M)

4. **Set field attributes**
   - verbose_name: 'VAT Filing Period'
   - help_text: 'VAT filing frequency: Monthly (>75M turnover) or Quarterly (SVAT 12M-75M)'
   - blank=True (optional, only if VAT registered)
   - null=True (database allows NULL)
   - default: None (must be explicitly set)

5. **Add field validation**
   - Validate that if vat_registration_no is filled, vat_filing_period must be set
   - Validate that if is_svat_registered=True, vat_filing_period should be QUARTERLY
   - Add custom model validation in clean() method

6. **Add field comments**
   - Document filing frequency determination
   - Explain relationship to turnover thresholds
   - Note automatic period generation logic

### VAT Filing Frequency Context

**Filing Frequency Determination**

| Annual Turnover | Registration Type | Filing Frequency | Due Date |
|-----------------|-------------------|------------------|----------|
| < LKR 12M | Not registered | N/A | N/A |
| LKR 12M - 75M | SVAT | Quarterly | 30th after quarter |
| > LKR 75M | Full VAT | Monthly | 20th of next month |

**Monthly Filing (Full VAT)**
- Applies to: Large businesses with turnover > LKR 75M
- Form: VAT Form 200
- Due date: 20th of following month
- Example: January VAT due February 20th
- Online filing via RAMIS portal
- More frequent cash flow impact
- Higher compliance burden

**Quarterly Filing (SVAT)**
- Applies to: SMEs with turnover LKR 12M-75M
- Form: Simplified VAT Form 200-S
- Due date: 30th of month following quarter end
- Example: Q1 (Jan-Mar) VAT due April 30th
- Reduced filing burden
- Longer payment cycles
- Simplified documentation

**Filing Period Impact**

**System Behavior Based on Filing Period:**

**If `vat_filing_period = MONTHLY`:**
- Auto-generate 12 periods per year (Jan, Feb, Mar, ...)
- Each period: 1st to last day of month
- Due date: 20th of next month
- Filing reminders: 5 days before due date
- Late penalties: Daily after due date

**If `vat_filing_period = QUARTERLY`:**
- Auto-generate 4 periods per year (Q1-Q4)
- Q1: Jan 1 - Mar 31, due Apr 30
- Q2: Apr 1 - Jun 30, due Jul 30
- Q3: Jul 1 - Sep 30, due Oct 30
- Q4: Oct 1 - Dec 31, due Jan 30
- Filing reminders: 7 days before due date
- More time for data collection and reconciliation

**Business Rules**
- Must be set if vat_registration_no is filled
- If is_svat_registered=True → should be QUARTERLY
- If is_svat_registered=False and VAT registered → should be MONTHLY
- Cannot change mid-year (requires authority approval)
- Used by period generation task to create TaxPeriodRecords

**Validation Logic**
```
Validation Rules:
1. If vat_registration_no is filled:
   - vat_filing_period MUST be set
   - Error: "VAT filing period required for VAT-registered businesses"

2. If is_svat_registered=True:
   - vat_filing_period SHOULD be QUARTERLY
   - Warning: "SVAT businesses typically file quarterly"

3. If is_svat_registered=False and vat_registration_no filled:
   - vat_filing_period SHOULD be MONTHLY
   - Warning: "Full VAT businesses typically file monthly"

4. If vat_registration_no is null:
   - vat_filing_period SHOULD be null
   - Optional warning: "Filing period not needed without VAT registration"
```

### Expected Outcome
- VAT filing period field added to model
- Uses TaxPeriod enum for standardized values
- Validation ensures logical consistency
- Determines automatic period generation
- Supports both monthly and quarterly VAT filing

### Verification Checklist
- [ ] `vat_filing_period` field added to TaxConfiguration
- [ ] Field uses TaxPeriod enum choices (MONTHLY/QUARTERLY)
- [ ] Field allows null and blank values
- [ ] Verbose name and help text explain usage
- [ ] Validation logic checks consistency with VAT registration
- [ ] Field comments document business rules

---

## Task 12: Run TaxConfig Migrations

### Overview
Generate and apply Django migrations for the TaxConfiguration model with all registration fields. This creates the database table and establishes the schema for storing tenant tax settings.

### Dependencies
- Task 11: Add VAT Filing Frequency (all TaxConfiguration fields complete)

### Instructions

1. **Verify model is complete**
   - Confirm all fields added to TaxConfiguration
   - Check imports are correct
   - Ensure model is registered in models/__init__.py

2. **Add model to models package**
   - Open `apps/accounting/models/__init__.py`
   - Import TaxConfiguration from tax_configuration module
   - Add to __all__ list for package exports

3. **Generate migration file**
   - Run makemigrations command for accounting app
   - Django will detect new TaxConfiguration model
   - Review generated migration file

4. **Review migration contents**
   - Check CreateModel operation for TaxConfiguration
   - Verify all fields present with correct types
   - Confirm indexes and constraints
   - Check verbose names and help texts

5. **Apply migration**
   - Run migrate command to apply changes
   - Creates accounting_tax_configuration table
   - Establishes foreign key to tenant model
   - Sets up indexes for lookups

6. **Verify database schema**
   - Check table created successfully
   - Verify column types match field definitions
   - Confirm constraints and indexes applied
   - Test model queries in Django shell

### Migration Checklist

**Pre-Migration**
- [ ] TaxConfiguration model complete with all fields
- [ ] Model imported in models/__init__.py
- [ ] No syntax errors in model file
- [ ] All validators and choices defined

**Migration Generation**
- [ ] Run `python manage.py makemigrations accounting`
- [ ] Migration file created (e.g., 0018_taxconfiguration.py)
- [ ] Review migration operations
- [ ] Check field definitions and attributes

**Migration Application**
- [ ] Run `python manage.py migrate accounting`
- [ ] No errors during migration
- [ ] Table created: accounting_tax_configuration
- [ ] Foreign keys and indexes established

**Post-Migration Verification**
- [ ] Test model import: `from apps.accounting.models import TaxConfiguration`
- [ ] Create test instance in Django shell
- [ ] Verify field validation works
- [ ] Check admin interface (if registered)

### Expected Migration Operations

The migration should include:
- CreateModel for TaxConfiguration
- Fields: tenant (ForeignKey), registration numbers, status flags
- Meta options: db_table, verbose_name, ordering
- Indexes: on tenant, created_at
- Constraints: Possibly unique_together on tenant

### Expected Outcome
- Database table created for TaxConfiguration
- All fields properly defined in schema
- Ready to store tenant tax settings
- Foundation for tax reporting features

### Verification Checklist
- [ ] Migration file generated successfully
- [ ] Migration applied without errors
- [ ] Database table exists with correct schema
- [ ] Model can be imported and instantiated
- [ ] Field validations work as expected

---

## Task 13: Create TaxPeriodRecord Model

### Overview
Create the TaxPeriodRecord model to track individual tax filing periods for each tax type. This model maintains the schedule of tax periods, their date ranges, due dates, and filing status, enabling deadline tracking and compliance management.

### Dependencies
- Task 12: Run TaxConfig Migrations
- TaxType, TaxPeriod, FilingStatus enums available

### Instructions

1. **Create tax period model file**
   - Navigate to `apps/accounting/models/` directory
   - Create new file `tax_period.py`
   - Will contain TaxPeriodRecord model

2. **Add model imports**
   - Import Django's models module
   - Import BaseTenantModel from core app
   - Import TaxType, TaxPeriod, FilingStatus enums
   - Import date utilities for period calculations

3. **Add model docstring**
   - Document model purpose: tracking tax filing periods
   - Explain relationship to TaxConfiguration
   - Note automatic period generation
   - Include period lifecycle explanation

4. **Define TaxPeriodRecord model class**
   - Inherit from BaseTenantModel for multi-tenancy
   - Model tracks one period for one tax type
   - Multiple periods per tenant (one per tax type per period)

5. **Add core period fields**
   - Field: `tax_type` (CharField with TaxType choices)
   - Field: `period_type` (CharField with TaxPeriod choices)
   - Field: `year` (IntegerField for tax year)
   - Field: `period_number` (IntegerField for month/quarter)

6. **Add configuration reference**
   - Field: `tax_configuration` (ForeignKey to TaxConfiguration)
   - Relates period to tenant's tax settings
   - Cascade delete when configuration deleted

7. **Set model metadata**
   - Database table name: 'accounting_tax_period_record'
   - Verbose names: 'Tax Period Record' / 'Tax Period Records'
   - Ordering: by year, period_number (chronological)
   - Unique constraint: tenant + tax_type + year + period_number

8. **Add string representation**
   - Return format: "{TaxType} - {Year} {Period} - {Status}"
   - Example: "VAT - 2026 Q1 - Filed"
   - Provides clear identification in admin

### Model Architecture

```
┌─────────────────────────────────────────────────┐
│          TaxPeriodRecord Model                  │
├─────────────────────────────────────────────────┤
│ Inherits from: BaseTenantModel                  │
│ Purpose: Track individual tax filing periods    │
│ Scope: Multiple per tenant (per tax per period) │
├─────────────────────────────────────────────────┤
│ Period Identification:                          │
│   - tax_type (VAT, PAYE, EPF, ETF, WHT)        │
│   - period_type (MONTHLY, QUARTERLY, ANNUAL)    │
│   - year (2026, 2027, etc.)                     │
│   - period_number (1-12 for monthly, 1-4 Q)    │
├─────────────────────────────────────────────────┤
│ Date Tracking:                                  │
│   - start_date                                  │
│   - end_date                                    │
│   - due_date                                    │
├─────────────────────────────────────────────────┤
│ Status Tracking:                                │
│   - filing_status (PENDING, GENERATED, etc.)    │
│   - filed_date                                  │
│   - accepted_date                               │
├─────────────────────────────────────────────────┤
│ Relationships:                                  │
│   - tax_configuration (ForeignKey)              │
│   - return_document (ForeignKey, future)        │
├─────────────────────────────────────────────────┤
│ Auto Fields (from BaseTenantModel):             │
│   - tenant (ForeignKey)                         │
│   - created_at, updated_at                      │
│   - created_by, updated_by                      │
└─────────────────────────────────────────────────┘
```

### Period Examples

**Monthly VAT Periods (2026)**
- Period 1: Jan 1-31, Due Feb 20, Status: ACCEPTED
- Period 2: Feb 1-28, Due Mar 20, Status: FILED
- Period 3: Mar 1-31, Due Apr 20, Status: PENDING
- ...Period 12: Dec 1-31, Due Jan 20 2027, Status: PENDING

**Quarterly VAT Periods (2026)**
- Period 1 (Q1): Jan 1 - Mar 31, Due Apr 30, Status: GENERATED
- Period 2 (Q2): Apr 1 - Jun 30, Due Jul 30, Status: PENDING
- Period 3 (Q3): Jul 1 - Sep 30, Due Oct 30, Status: PENDING
- Period 4 (Q4): Oct 1 - Dec 31, Due Jan 30 2027, Status: PENDING

**Multiple Tax Types (Employer with Employees)**
- VAT Monthly: 12 periods per year
- PAYE Monthly: 12 periods per year
- EPF Monthly: 12 periods per year
- ETF Monthly: 12 periods per year
- Total: 48 period records per year for one tenant

### Expected Outcome
- TaxPeriodRecord model created in models directory
- Inherits from BaseTenantModel for multi-tenancy
- Tracks tax type, period dates, and status
- Foundation for filing deadline management
- Ready to receive date range and status fields

### Verification Checklist
- [ ] `tax_period.py` file created in `models/` directory
- [ ] TaxPeriodRecord class inherits from BaseTenantModel
- [ ] Model imports include enums and TaxConfiguration
- [ ] Core period fields defined (tax_type, period_type, year, period_number)
- [ ] ForeignKey to TaxConfiguration included
- [ ] Meta class defines table name and unique constraints
- [ ] __str__ method returns meaningful representation

---

## Task 14: Add Period Date Range

### Overview
Add date range fields to TaxPeriodRecord model to track the exact start date, end date, and due date for each tax period. These fields define when the period begins, ends, and when the return must be filed.

### Dependencies
- Task 13: Create TaxPeriodRecord Model

### Instructions

1. **Open tax_period.py file**
   - Navigate to `apps/accounting/models/tax_period.py`
   - Locate TaxPeriodRecord model class

2. **Add start_date field**
   - Field name: `start_date`
   - Field type: DateField
   - Required field (not null)
   - First day of the tax period

3. **Add end_date field**
   - Field name: `end_date`
   - Field type: DateField
   - Required field (not null)
   - Last day of the tax period

4. **Add due_date field**
   - Field name: `due_date`
   - Field type: DateField
   - Required field (not null)
   - Deadline for filing the return

5. **Set field attributes**
   - verbose_name: Clear descriptive names
   - help_text: Explain each date's purpose
   - blank=False (all dates required)
   - null=False (database requires values)

6. **Add date validation**
   - Validate end_date > start_date
   - Validate due_date >= end_date
   - Add custom validation in clean() method
   - Prevent invalid date ranges

7. **Add field comments**
   - Document date calculation logic
   - Explain relationship to period_type
   - Note automatic date assignment during period creation

### Date Range Calculation Logic

**Monthly Periods**
```
Period: January 2026
- start_date: 2026-01-01 (first day of month)
- end_date: 2026-01-31 (last day of month)
- due_date: 2026-02-20 (20th of next month)

Period: February 2026
- start_date: 2026-02-01
- end_date: 2026-02-28 (or 29 in leap year)
- due_date: 2026-03-20
```

**Quarterly Periods**
```
Period: Q1 2026
- start_date: 2026-01-01 (first day of quarter)
- end_date: 2026-03-31 (last day of quarter)
- due_date: 2026-04-30 (30th of month after quarter)

Period: Q2 2026
- start_date: 2026-04-01
- end_date: 2026-06-30
- due_date: 2026-07-30

Period: Q3 2026
- start_date: 2026-07-01
- end_date: 2026-09-30
- due_date: 2026-10-30

Period: Q4 2026
- start_date: 2026-10-01
- end_date: 2026-12-31
- due_date: 2027-01-30 (crosses year boundary)
```

**Annual Periods**
```
Period: 2026 Tax Year
- start_date: 2026-01-01 (first day of year)
- end_date: 2026-12-31 (last day of year)
- due_date: 2027-04-30 (April 30 of next year)
```

### Due Date Rules by Tax Type

| Tax Type | Period Type | Due Date Rule | Example |
|----------|-------------|---------------|---------|
| VAT | Monthly | 20th of next month | Jan → Feb 20 |
| VAT | Quarterly | 30th after quarter | Q1 → Apr 30 |
| PAYE | Monthly | 15th of next month | Jan → Feb 15 |
| EPF | Monthly | 15th of next month | Jan → Feb 15 |
| ETF | Monthly | 15th of next month | Jan → Feb 15 |
| WHT | Quarterly | 15th after quarter | Q1 → Apr 15 |
| Annual | Annual | April 30 next year | 2026 → Apr 30 2027 |

### Date Validation Rules

**Validation 1: End Date After Start Date**
```
Rule: end_date must be > start_date
Error: "Period end date must be after start date"
Example: start=2026-01-01, end=2026-01-31 ✓
Example: start=2026-01-01, end=2025-12-31 ✗
```

**Validation 2: Due Date After or Equal End Date**
```
Rule: due_date must be >= end_date
Error: "Due date cannot be before period ends"
Example: end=2026-01-31, due=2026-02-20 ✓
Example: end=2026-01-31, due=2026-01-15 ✗
```

**Validation 3: Period Length Consistency**
```
For MONTHLY: end_date should be within same month as start_date
For QUARTERLY: period should span ~3 months
For ANNUAL: period should span full year (365/366 days)
```

### Automatic Date Assignment

**When Creating Period Record:**
1. System receives: tax_type, period_type, year, period_number
2. Calculate start_date based on period_type and period_number
3. Calculate end_date based on start_date and period_type
4. Calculate due_date based on tax_type and end_date
5. Assign all three dates automatically
6. User can override if needed (e.g., extension granted)

### Expected Outcome
- Three date fields added to model
- Clear definition of period boundaries
- Due date tracking for compliance
- Date validation prevents invalid ranges
- Foundation for deadline reminders and alerts

### Verification Checklist
- [ ] `start_date` field added to TaxPeriodRecord
- [ ] `end_date` field added to TaxPeriodRecord
- [ ] `due_date` field added to TaxPeriodRecord
- [ ] All date fields are DateField type
- [ ] All date fields are required (not null/blank)
- [ ] Validation logic checks date consistency
- [ ] Verbose names and help texts are descriptive

---

## Task 15: Add Period Status

### Overview
Add filing status field and related tracking fields to TaxPeriodRecord model. These fields track the lifecycle of the tax filing from period creation through acceptance, including submission and acceptance dates.

### Dependencies
- Task 14: Add Period Date Range
- Task 04: Define FilingStatus Enum

### Instructions

1. **Open tax_period.py file**
   - Continue in `apps/accounting/models/tax_period.py`
   - Add status fields after date fields

2. **Add filing_status field**
   - Field name: `filing_status`
   - Field type: CharField with FilingStatus choices
   - Default: FilingStatus.PENDING
   - Required field (not null)

3. **Add filed_date field**
   - Field name: `filed_date`
   - Field type: DateField
   - Optional (null=True, blank=True)
   - Set when return is filed with authority

4. **Add accepted_date field**
   - Field name: `accepted_date`
   - Field type: DateField
   - Optional (null=True, blank=True)
   - Set when authority accepts the return

5. **Add reference_number field**
   - Field name: `reference_number`
   - Field type: CharField
   - Max length: 50
   - Optional (null=True, blank=True)
   - Filing reference from tax authority system

6. **Set field attributes**
   - verbose_name: Clear descriptive names
   - help_text: Explain each field's purpose
   - Appropriate null/blank settings

7. **Add status validation**
   - Validate filed_date exists if status is FILED or beyond
   - Validate accepted_date exists if status is ACCEPTED
   - Add custom validation in clean() method
   - Prevent inconsistent status/date combinations

### Status Field Details

**filing_status**
- Type: CharField with choices from FilingStatus enum
- Default: PENDING (new periods start pending)
- Tracks: Current stage in filing lifecycle
- Options: PENDING, GENERATED, FILED, ACCEPTED, (REJECTED)
- Usage: Filters, dashboards, compliance reports

**filed_date**
- Type: DateField, optional
- Records: Date when return submitted to authority
- Set by: User action or automated filing
- Validation: Must be set if status is FILED or ACCEPTED
- Usage: Compliance tracking, audit trail

**accepted_date**
- Type: DateField, optional
- Records: Date when authority accepted return
- Set by: Manual entry or API callback (if integrated)
- Validation: Must be set if status is ACCEPTED
- Usage: Compliance confirmation, period closure

**reference_number**
- Type: CharField(50), optional
- Records: Acknowledgment number from tax authority
- Examples: "VAT/2026/01/12345", "PAYE-202601-ABCD"
- Set by: User entry after submission
- Usage: Future reference, correspondence, audits

### Status Lifecycle with Dates

```
┌──────────────────────────────────────────────────┐
│         Status Lifecycle with Date Tracking      │
└──────────────────────────────────────────────────┘

PENDING
├─ filing_status: PENDING
├─ filed_date: NULL
├─ accepted_date: NULL
└─ reference_number: NULL

   ↓ [Generate return]

GENERATED
├─ filing_status: GENERATED
├─ filed_date: NULL
├─ accepted_date: NULL
└─ reference_number: NULL

   ↓ [Submit to authority]

FILED
├─ filing_status: FILED
├─ filed_date: 2026-02-18 ← Set on submission
├─ accepted_date: NULL
└─ reference_number: "VAT/2026/01/12345" ← From authority

   ↓ [Authority processes]

ACCEPTED
├─ filing_status: ACCEPTED
├─ filed_date: 2026-02-18
├─ accepted_date: 2026-02-20 ← Set on acceptance
└─ reference_number: "VAT/2026/01/12345"

   ↓ [If rejected]

REJECTED (alternative path)
├─ filing_status: REJECTED
├─ filed_date: 2026-02-18
├─ accepted_date: NULL
└─ reference_number: "VAT/2026/01/12345"
   
   ↓ [Fix and regenerate]
   
   Back to GENERATED (with corrections)
```

### Validation Rules

**Rule 1: Filed Date Required for FILED/ACCEPTED**
```
If filing_status in [FILED, ACCEPTED]:
   filed_date MUST NOT be NULL
Error: "Filed date required for FILED or ACCEPTED status"
```

**Rule 2: Accepted Date Required for ACCEPTED**
```
If filing_status == ACCEPTED:
   accepted_date MUST NOT be NULL
Error: "Accepted date required for ACCEPTED status"
```

**Rule 3: Date Chronology**
```
If both filed_date and accepted_date exist:
   accepted_date must be >= filed_date
Error: "Accepted date cannot be before filed date"
```

**Rule 4: Status Consistency**
```
If filing_status == PENDING or GENERATED:
   filed_date SHOULD be NULL
   accepted_date SHOULD be NULL
Warning: "Status inconsistent with filing dates"
```

### Status Query Examples

**Overdue Periods (not filed before due date)**
```
TaxPeriodRecord.objects.filter(
   filing_status__in=[PENDING, GENERATED],
   due_date__lt=today
)
```

**Recently Filed (awaiting acceptance)**
```
TaxPeriodRecord.objects.filter(
   filing_status=FILED,
   filed_date__gte=date_7_days_ago
)
```

**Compliance Summary (accepted vs pending)**
```
Accepted: filing_status=ACCEPTED
Pending: filing_status in [PENDING, GENERATED, FILED]
Overdue: PENDING/GENERATED and due_date < today
```

### Expected Outcome
- Filing status field with lifecycle tracking
- Filed and accepted date fields for audit trail
- Reference number field for authority correspondence
- Validation ensures status/date consistency
- Ready for compliance tracking and reporting

### Verification Checklist
- [ ] `filing_status` field added with FilingStatus choices
- [ ] `filed_date` field added (optional DateField)
- [ ] `accepted_date` field added (optional DateField)
- [ ] `reference_number` field added (optional CharField)
- [ ] Default status is PENDING
- [ ] Validation logic checks status/date consistency
- [ ] Field help texts explain purpose and usage

---

## Task 16: Run TaxPeriod Migrations

### Overview
Generate and apply Django migrations for the TaxPeriodRecord model with all date and status fields. This creates the database table for tracking tax filing periods and establishes the schema for compliance management.

### Dependencies
- Task 15: Add Period Status (all TaxPeriodRecord fields complete)

### Instructions

1. **Verify model is complete**
   - Confirm all fields added to TaxPeriodRecord
   - Check imports are correct
   - Ensure model is registered in models/__init__.py
   - Verify validation logic in clean() method

2. **Add model to models package**
   - Open `apps/accounting/models/__init__.py`
   - Import TaxPeriodRecord from tax_period module
   - Add to __all__ list for package exports

3. **Generate migration file**
   - Run makemigrations command for accounting app
   - Django will detect new TaxPeriodRecord model
   - Review generated migration file

4. **Review migration contents**
   - Check CreateModel operation for TaxPeriodRecord
   - Verify all fields present with correct types
   - Confirm ForeignKey to TaxConfiguration
   - Check unique constraint on tenant + tax_type + year + period_number
   - Verify indexes on common query fields (due_date, filing_status)

5. **Apply migration**
   - Run migrate command to apply changes
   - Creates accounting_tax_period_record table
   - Establishes foreign keys to tenant and tax_configuration
   - Sets up indexes for efficient queries

6. **Verify database schema**
   - Check table created successfully
   - Verify column types match field definitions
   - Confirm constraints and indexes applied
   - Test model queries in Django shell

7. **Test period creation**
   - Create sample TaxPeriodRecord in shell
   - Test date validation
   - Test status transitions
   - Verify unique constraints work

### Migration Checklist

**Pre-Migration**
- [ ] TaxPeriodRecord model complete with all fields
- [ ] Model imported in models/__init__.py
- [ ] No syntax errors in model file
- [ ] All validators and choices defined
- [ ] TaxConfiguration model already migrated (dependency)

**Migration Generation**
- [ ] Run `python manage.py makemigrations accounting`
- [ ] Migration file created (e.g., 0019_taxperiodrecord.py)
- [ ] Review migration operations
- [ ] Check field definitions and relationships
- [ ] Verify unique_together constraint

**Migration Application**
- [ ] Run `python manage.py migrate accounting`
- [ ] No errors during migration
- [ ] Table created: accounting_tax_period_record
- [ ] Foreign keys established (tenant, tax_configuration)
- [ ] Indexes created for performance

**Post-Migration Verification**
- [ ] Test model import: `from apps.accounting.models import TaxPeriodRecord`
- [ ] Create test instance with valid dates
- [ ] Test date validation (invalid ranges should fail)
- [ ] Test status validation (ACCEPTED requires accepted_date)
- [ ] Verify unique constraint (duplicate periods should fail)
- [ ] Check admin interface if registered

### Expected Migration Operations

The migration should include:
- CreateModel for TaxPeriodRecord
- Fields: tenant, tax_configuration (FK), tax_type, period_type, year, period_number
- Fields: start_date, end_date, due_date
- Fields: filing_status, filed_date, accepted_date, reference_number
- Meta options: db_table, verbose_name, ordering, unique_together
- Indexes: on tenant, due_date, filing_status, tax_type
- Foreign key constraint to TaxConfiguration with CASCADE delete

### Test Scenarios

**Test 1: Create Valid Period**
```
Create period:
  tax_type: VAT
  period_type: MONTHLY
  year: 2026
  period_number: 1
  start_date: 2026-01-01
  end_date: 2026-01-31
  due_date: 2026-02-20
  filing_status: PENDING

Expected: Success
```

**Test 2: Invalid Date Range**
```
Create period with end_date before start_date
Expected: Validation error
```

**Test 3: Duplicate Period**
```
Create two periods with same:
  tenant, tax_type, year, period_number
Expected: Unique constraint error
```

**Test 4: Status Without Filed Date**
```
Update period:
  filing_status: FILED
  filed_date: NULL

Expected: Validation error
```

### Expected Outcome
- Database table created for TaxPeriodRecord
- All fields properly defined in schema
- Relationships to tenant and tax_configuration established
- Unique constraints prevent duplicate periods
- Ready for tax period tracking and compliance management

### Verification Checklist
- [ ] Migration file generated successfully
- [ ] Migration applied without errors
- [ ] Database table exists with correct schema
- [ ] Model can be imported and instantiated
- [ ] Field validations work as expected
- [ ] Foreign key relationships functional
- [ ] Unique constraint prevents duplicates
- [ ] Test periods can be created and queried

---

## Summary

This document completed the tax configuration infrastructure:

**TaxConfiguration Model Completion**
- ETF registration number (6-digit format)
- Employer TIN (9-digit tax identifier)
- VAT filing frequency (MONTHLY/QUARTERLY)
- Validation logic for field consistency
- Database migrations applied

**TaxPeriodRecord Model**
- Core period identification (tax_type, year, period_number)
- Date range tracking (start_date, end_date, due_date)
- Status lifecycle (filing_status, filed/accepted dates)
- Reference number for authority correspondence
- Unique constraints prevent duplicates
- Database migrations applied

**System Capabilities**
- Store tenant-specific tax registration details
- Track individual filing periods for each tax type
- Monitor filing deadlines and compliance status
- Support multiple tax types (VAT, PAYE, EPF, ETF, WHT)
- Handle different filing frequencies (monthly, quarterly)
- Audit trail with filing and acceptance dates

**Next Steps in SubPhase**
The next group (Group-B: VAT Return) will implement VAT return generation using the foundation established here. It will create models for VAT return headers, line items, input/output tax calculations, and summary totals.

---

**Document Status:** Complete  
**Last Updated:** 2026-01-25
