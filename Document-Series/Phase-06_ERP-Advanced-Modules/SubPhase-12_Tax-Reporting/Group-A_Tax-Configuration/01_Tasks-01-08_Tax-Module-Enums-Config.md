# Tasks 01-08: Tax Module, Enums, and TaxConfiguration

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 12 - Tax Reporting  
> **Group:** A - Tax Configuration  
> **Document:** 01 of 02  
> **Tasks Covered:** 01, 02, 03, 04, 05, 06, 07, 08

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-09-16_TaxConfig-TaxPeriod.md](02_Tasks-09-16_TaxConfig-TaxPeriod.md)

---

## Document Overview

This document covers the foundation of the tax reporting system for Sri Lankan businesses. It includes creating the tax module within the accounting app, defining essential enumerations for tax types, periods, and filing statuses, and implementing the TaxConfiguration model with VAT, EPF, and SVAT registration fields.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 01 | Create tax Module | Low | 10 min |
| 02 | Define TaxType Enum | Low | 15 min |
| 03 | Define TaxPeriod Enum | Low | 10 min |
| 04 | Define FilingStatus Enum | Low | 10 min |
| 05 | Create TaxConfiguration Model | Medium | 30 min |
| 06 | Add VAT Registration Number | Low | 10 min |
| 07 | Add SVAT Status | Low | 10 min |
| 08 | Add EPF Registration | Low | 10 min |

---

## Task 01: Create Tax Module

### Overview
Create the `tax` submodule within the accounting application to organize all tax reporting functionality. This module will contain models, enumerations, services, and administrative interfaces for managing tax compliance across multiple Sri Lankan tax types (VAT, PAYE, EPF, ETF, WHT).

### Dependencies
- Accounting application (`apps/accounting/`) must exist
- Django project structure is established

### Instructions

1. **Create tax directory structure**
   - Navigate to `apps/accounting/` directory
   - Create new directory named `tax`
   - This will house all tax reporting functionality

2. **Create package initialization file**
   - Create `__init__.py` in `tax/` directory
   - Add module docstring explaining purpose:
     - "Tax reporting and compliance module for Sri Lankan businesses"
     - Handles VAT, PAYE, EPF, ETF, WHT reporting
     - Manages filing periods, deadlines, and submissions

3. **Create enums module**
   - Create `enums.py` in `tax/` directory
   - Will contain TaxType, TaxPeriod, FilingStatus enumerations
   - Provides standardized choices across tax functionality

4. **Verify module structure**
   - Confirm `tax/` directory is recognized as Python package
   - Ensure `__init__.py` is present and properly formatted

### Directory Structure
```
apps/accounting/tax/
├── __init__.py                    # Package initialization with docstring
└── enums.py                       # Tax-related enumerations
```

### Module Purpose

| Module | Purpose |
|--------|---------|
| `tax/__init__.py` | Package entry point and module documentation |
| `enums.py` | Tax types, filing periods, and status enumerations |

### Expected Outcome
- Clean submodule structure within accounting app
- Organized location for tax reporting functionality
- Foundation for Sri Lanka tax compliance system
- Separation of tax concerns from other accounting features

### Verification Checklist
- [ ] `apps/accounting/tax/` directory exists
- [ ] `tax/__init__.py` file created with docstring
- [ ] `tax/enums.py` file created
- [ ] Python recognizes `tax` as importable package

---

## Task 02: Define TaxType Enum

### Overview
Define the TaxType enumeration to categorize different Sri Lankan tax types handled by the system. This enum provides standardized values for VAT, PAYE, EPF, ETF, and WHT, ensuring consistency across tax reporting, calculations, and compliance tracking.

### Dependencies
- Task 01: Create tax Module

### Instructions

1. **Open enums.py file**
   - Navigate to `apps/accounting/tax/enums.py`
   - Prepare to define tax type enumeration

2. **Add module imports**
   - Import Django's TextChoices class
   - Will use Django 3.0+ enumeration pattern
   - Provides database-friendly choices with labels

3. **Add module docstring**
   - Document the purpose of tax enumerations
   - Explain Sri Lankan tax system context
   - Note usage across tax reporting features

4. **Define TaxType enumeration class**
   - Create class inheriting from TextChoices
   - Define five main tax types for Sri Lanka
   - Use uppercase enum names, lowercase database values

5. **Define VAT choice**
   - Enum: VAT
   - Value: 'vat'
   - Label: 'Value Added Tax (VAT)'
   - Purpose: 8% consumption tax on goods and services

6. **Define PAYE choice**
   - Enum: PAYE
   - Value: 'paye'
   - Label: 'Pay As You Earn (PAYE)'
   - Purpose: Monthly income tax deductions from employees

7. **Define EPF choice**
   - Enum: EPF
   - Value: 'epf'
   - Label: 'Employees Provident Fund (EPF)'
   - Purpose: Mandatory retirement savings (12% employee + 8% employer)

8. **Define ETF choice**
   - Enum: ETF
   - Value: 'etf'
   - Label: 'Employees Trust Fund (ETF)'
   - Purpose: 3% employer contribution for employee welfare

9. **Define WHT choice**
   - Enum: WHT
   - Value: 'wht'
   - Label: 'Withholding Tax (WHT)'
   - Purpose: Tax withheld on payments to suppliers/contractors

### Tax Type Details

| Tax Type | Database Value | Rate/Details | Filing Frequency | Authority |
|----------|----------------|--------------|------------------|-----------|
| VAT | vat | 8% standard rate | Monthly/Quarterly | Inland Revenue Department |
| PAYE | paye | Progressive rates | Monthly | Inland Revenue Department |
| EPF | epf | 20% total (12%+8%) | Monthly | Central Bank of Sri Lanka |
| ETF | etf | 3% employer only | Monthly | ETF Board |
| WHT | wht | Various rates | Quarterly | Inland Revenue Department |

### Sri Lankan Tax Context

**VAT (Value Added Tax)**
- Standard rate: 8%
- Threshold: Annual turnover > LKR 12 million
- Simplified VAT: Annual turnover LKR 12M-75M
- Full VAT: Annual turnover > LKR 75M
- Monthly or quarterly filing based on turnover

**PAYE (Pay As You Earn)**
- Income tax deducted at source from employee salaries
- Progressive tax slabs (0%, 6%, 12%, 18%, 24%, 30%)
- Tax-free allowance per year
- Monthly deductions, annual reconciliation

**EPF (Employees' Provident Fund)**
- Employee contribution: 8% of basic salary
- Employer contribution: 12% of basic salary
- Total: 20% to retirement fund
- Mandatory for all employees
- Monthly contributions due by 15th of next month

**ETF (Employees' Trust Fund)**
- Employer-only contribution: 3% of basic salary
- Separate from EPF
- Provides employee welfare benefits
- Monthly contributions due by 15th of next month

**WHT (Withholding Tax)**
- Deducted from various payments (services, rent, interest)
- Rates vary: 5%, 10%, 14% depending on payment type
- Quarterly filing and remittance
- Recipient gets credit against annual tax liability

### Expected Outcome
- TaxType enum with five standardized choices
- Database-safe values ('vat', 'paye', 'epf', 'etf', 'wht')
- Human-readable labels for admin interfaces
- Foundation for tax-specific logic and filtering

### Verification Checklist
- [ ] TaxType class inherits from TextChoices
- [ ] All five tax types defined (VAT, PAYE, EPF, ETF, WHT)
- [ ] Database values are lowercase strings
- [ ] Labels include full descriptive names
- [ ] Enum can be imported and used in models

---

## Task 03: Define TaxPeriod Enum

### Overview
Define the TaxPeriod enumeration to represent different tax filing frequencies used in Sri Lankan tax compliance. This enum standardizes period types (monthly, quarterly, annual) used across different tax types and filing requirements.

### Dependencies
- Task 02: Define TaxType Enum

### Instructions

1. **Open enums.py file**
   - Continue in `apps/accounting/tax/enums.py`
   - Add TaxPeriod enum after TaxType

2. **Define TaxPeriod enumeration class**
   - Create class inheriting from TextChoices
   - Define three standard filing periods
   - Use uppercase enum names, lowercase values

3. **Define MONTHLY choice**
   - Enum: MONTHLY
   - Value: 'monthly'
   - Label: 'Monthly'
   - Purpose: Most common filing period (PAYE, EPF, ETF, VAT for large businesses)

4. **Define QUARTERLY choice**
   - Enum: QUARTERLY
   - Value: 'quarterly'
   - Label: 'Quarterly'
   - Purpose: Smaller VAT-registered businesses, some WHT filings

5. **Define ANNUAL choice**
   - Enum: ANNUAL
   - Value: 'annual'
   - Label: 'Annual'
   - Purpose: Annual tax returns, summaries, reconciliations

### Tax Period Usage

| Period Type | Tax Types | Due Date Pattern | Use Cases |
|-------------|-----------|------------------|-----------|
| MONTHLY | VAT, PAYE, EPF, ETF | 15th-20th of next month | High-turnover businesses, payroll taxes |
| QUARTERLY | VAT, WHT | 15th-30th after quarter end | Small businesses, quarterly withholding |
| ANNUAL | All types | April 30th (year end) | Annual returns, summaries, reconciliations |

### Filing Period Matrix

**Monthly Filers**
- VAT: Turnover > LKR 75 million annually
- PAYE: All employers with employees
- EPF: All employers with employees
- ETF: All employers with employees
- Due: 15th of following month (PAYE, EPF, ETF), 20th (VAT)

**Quarterly Filers**
- VAT: Turnover LKR 12M-75M (Simplified VAT)
- WHT: Various withholding tax types
- Due: 15th-30th of month following quarter end

**Annual Filers**
- All tax types require annual summary returns
- Final reconciliation of monthly/quarterly filings
- Due: April 30th of following year (tax year = calendar year)

### Period Calculation Examples

**Monthly Period**
- January 2026: Jan 1 - Jan 31, Due: Feb 15-20
- February 2026: Feb 1 - Feb 28, Due: Mar 15-20
- March 2026: Mar 1 - Mar 31, Due: Apr 15-20

**Quarterly Period**
- Q1 2026: Jan 1 - Mar 31, Due: Apr 15-30
- Q2 2026: Apr 1 - Jun 30, Due: Jul 15-30
- Q3 2026: Jul 1 - Sep 30, Due: Oct 15-30
- Q4 2026: Oct 1 - Dec 31, Due: Jan 15-30 (2027)

**Annual Period**
- Tax Year 2026: Jan 1 - Dec 31, Due: Apr 30, 2027
- All monthly/quarterly filings must reconcile to annual totals

### Expected Outcome
- TaxPeriod enum with three filing frequencies
- Standardized period types across tax system
- Support for different filing schedules per tax type
- Foundation for automatic period calculation

### Verification Checklist
- [ ] TaxPeriod class inherits from TextChoices
- [ ] Three period types defined (MONTHLY, QUARTERLY, ANNUAL)
- [ ] Database values are lowercase strings
- [ ] Labels are clear and descriptive
- [ ] Enum can be used in TaxConfiguration and TaxPeriodRecord models

---

## Task 04: Define FilingStatus Enum

### Overview
Define the FilingStatus enumeration to track the lifecycle of tax filings from initial period creation through acceptance by tax authorities. This enum provides standardized status values for managing the filing process and compliance tracking.

### Dependencies
- Task 03: Define TaxPeriod Enum

### Instructions

1. **Open enums.py file**
   - Continue in `apps/accounting/tax/enums.py`
   - Add FilingStatus enum after TaxPeriod

2. **Define FilingStatus enumeration class**
   - Create class inheriting from TextChoices
   - Define four status stages
   - Use uppercase enum names, lowercase values

3. **Define PENDING choice**
   - Enum: PENDING
   - Value: 'pending'
   - Label: 'Pending'
   - Purpose: Period created but return not yet generated
   - Initial status for new tax periods

4. **Define GENERATED choice**
   - Enum: GENERATED
   - Value: 'generated'
   - Label: 'Generated'
   - Purpose: Return calculated and generated, ready for review
   - Waiting for submission or approval

5. **Define FILED choice**
   - Enum: FILED
   - Value: 'filed'
   - Label: 'Filed'
   - Purpose: Return submitted to tax authority
   - Awaiting acceptance or rejection

6. **Define ACCEPTED choice**
   - Enum: ACCEPTED
   - Value: 'accepted'
   - Label: 'Accepted'
   - Purpose: Return accepted by tax authority
   - Filing complete and compliant

7. **Define REJECTED choice** (optional but recommended)
   - Enum: REJECTED
   - Value: 'rejected'
   - Label: 'Rejected'
   - Purpose: Return rejected, requires correction and resubmission
   - Triggers alert and corrective action

### Filing Status Lifecycle

```
┌─────────────────────────────────────────────────────────────┐
│                      Tax Filing Lifecycle                    │
└─────────────────────────────────────────────────────────────┘

    ┌──────────┐
    │ PENDING  │  Period created, data collection in progress
    └─────┬────┘
          │
          │ Generate return with tax calculations
          ▼
    ┌──────────┐
    │GENERATED │  Return ready for review and submission
    └─────┬────┘
          │
          │ Submit to tax authority online/offline
          ▼
    ┌──────────┐
    │  FILED   │  Waiting for authority acceptance
    └─────┬────┘
          │
          ├──────────────┐
          │              │
          ▼              ▼
    ┌──────────┐   ┌──────────┐
    │ACCEPTED  │   │REJECTED  │
    └──────────┘   └─────┬────┘
                         │
                         └──────► Back to GENERATED
                                  (Fix errors, resubmit)
```

### Status Transitions

| From Status | To Status | Trigger | Action Required |
|-------------|-----------|---------|-----------------|
| PENDING | GENERATED | Calculate return | System: Run tax calculations |
| GENERATED | FILED | Submit return | User: File via online portal |
| FILED | ACCEPTED | Authority accepts | None (automatic if no issues) |
| FILED | REJECTED | Authority rejects | User: Fix errors, regenerate |
| REJECTED | GENERATED | Corrections made | System: Recalculate with fixes |

### Status Business Rules

**PENDING**
- Automatic status when tax period created
- Data collection phase (transactions, payroll, etc.)
- Cannot submit until moved to GENERATED
- May remain PENDING past due date (compliance risk)

**GENERATED**
- Return calculations complete
- PDF/report ready for review
- Can be regenerated if data changes
- Ready for filing with tax authority
- Must be reviewed before filing

**FILED**
- Return submitted (online portal or physical)
- Record submission date and reference number
- Track acknowledgment receipt
- Cannot modify return while in FILED status
- Awaiting authority processing

**ACCEPTED**
- Official acceptance from tax authority
- Filing complete and compliant
- Record acceptance date and certificate
- Archive return documents
- Close period for amendments (unless amended return needed)

**REJECTED** (if implemented)
- Authority found errors or inconsistencies
- Rejection reason must be recorded
- Return to GENERATED status for corrections
- May incur penalties or interest
- Resubmission required before deadline

### Expected Outcome
- FilingStatus enum with four or five status choices
- Clear lifecycle tracking for tax filings
- Support for status-based business logic
- Foundation for compliance alerts and dashboards

### Verification Checklist
- [ ] FilingStatus class inherits from TextChoices
- [ ] Four main statuses defined (PENDING, GENERATED, FILED, ACCEPTED)
- [ ] Optional REJECTED status included for error handling
- [ ] Database values are lowercase strings
- [ ] Labels clearly describe each status stage
- [ ] Status transitions form logical workflow

---

## Task 05: Create TaxConfiguration Model

### Overview
Create the TaxConfiguration model to store tenant-specific tax registration details and filing preferences. This model maintains each tenant's VAT registration, EPF/ETF numbers, employer TIN, and filing frequency settings required for Sri Lankan tax compliance.

### Dependencies
- Task 04: Define FilingStatus Enum
- Core models and mixins available
- Multi-tenancy infrastructure established

### Instructions

1. **Create tax configuration model file**
   - Navigate to `apps/accounting/models/` directory
   - Create new file `tax_configuration.py`
   - Will contain TaxConfiguration model

2. **Add model imports**
   - Import Django's models module
   - Import BaseTenantModel from core app
   - Import TaxType and TaxPeriod enums from tax.enums
   - Import validators for registration number formats

3. **Add model docstring**
   - Document model purpose and scope
   - Explain tenant-specific tax settings
   - Note relationship to tax reporting features
   - Include Sri Lankan tax context

4. **Define TaxConfiguration model class**
   - Inherit from BaseTenantModel for multi-tenancy
   - Model is per-tenant (each tenant has one configuration)
   - Contains all tax registration details

5. **Set model metadata**
   - Database table name: 'accounting_tax_configuration'
   - Verbose names: 'Tax Configuration' / 'Tax Configurations'
   - Ordering: by creation date
   - Unique constraint: one config per tenant

6. **Define base model structure**
   - Use BaseTenantModel for automatic tenant isolation
   - Include created_at and updated_at from base model
   - Add created_by and updated_by audit fields
   - Ensure model follows LCC base model patterns

7. **Add string representation**
   - Return format: "Tax Config - {tenant_name}"
   - Provides clear identification in admin interfaces
   - Useful for debugging and logging

### Model Architecture

```
┌─────────────────────────────────────────────────┐
│           TaxConfiguration Model                │
├─────────────────────────────────────────────────┤
│ Inherits from: BaseTenantModel                  │
│ Purpose: Tenant-specific tax settings           │
│ Scope: One per tenant (singleton pattern)       │
├─────────────────────────────────────────────────┤
│ VAT Registration:                                │
│   - vat_registration_no                         │
│   - is_svat_registered                          │
│   - vat_filing_period                           │
├─────────────────────────────────────────────────┤
│ Payroll Tax Registration:                       │
│   - epf_registration_no                         │
│   - etf_registration_no                         │
│   - tin_number (employer)                       │
├─────────────────────────────────────────────────┤
│ Auto Fields (from BaseTenantModel):             │
│   - tenant (ForeignKey)                         │
│   - created_at                                  │
│   - updated_at                                  │
│   - created_by                                  │
│   - updated_by                                  │
│   - is_active                                   │
└─────────────────────────────────────────────────┘
```

### Expected Outcome
- TaxConfiguration model created in models directory
- Inherits from BaseTenantModel for multi-tenancy
- Ready to receive registration number fields
- Foundation for tenant tax compliance tracking
- Model follows LCC architectural patterns

### Verification Checklist
- [ ] `tax_configuration.py` file created in `models/` directory
- [ ] TaxConfiguration class inherits from BaseTenantModel
- [ ] Model imports include enums and validators
- [ ] Model docstring explains purpose and scope
- [ ] Meta class defines table name and verbose names
- [ ] __str__ method returns meaningful representation

---

## Task 06: Add VAT Registration Number

### Overview
Add the VAT registration number field to TaxConfiguration model. This field stores the business's official VAT registration number issued by Sri Lanka Inland Revenue Department, required for VAT filing and compliance.

### Dependencies
- Task 05: Create TaxConfiguration Model

### Instructions

1. **Open tax_configuration.py file**
   - Navigate to `apps/accounting/models/tax_configuration.py`
   - Locate TaxConfiguration model class

2. **Add VAT registration number field**
   - Field name: `vat_registration_no`
   - Field type: CharField
   - Max length: 20 characters
   - Allow null and blank (not all businesses are VAT registered)

3. **Add field validation**
   - Add validator for Sri Lankan VAT format
   - Format: XXXXXXXXX-7000 (9 digits, hyphen, 7000)
   - Example: 123456789-7000
   - Validator should check digit count and suffix

4. **Set field attributes**
   - verbose_name: 'VAT Registration Number'
   - help_text: 'VAT registration number issued by Inland Revenue Department (format: XXXXXXXXX-7000)'
   - blank=True (optional field)
   - null=True (database allows NULL)
   - unique=False (different tenants can have same format)

5. **Add field comments**
   - Document VAT number format requirements
   - Explain when field should be populated
   - Note relationship to VAT filing features

### VAT Registration Context

**VAT Registration Thresholds (Sri Lanka)**
- Mandatory registration: Annual turnover > LKR 12 million
- Simplified VAT: LKR 12M - 75M turnover
- Full VAT: LKR 75M+ turnover
- Voluntary registration: Below threshold but wants VAT credit

**VAT Number Format**
- Structure: [9-digit business number]-7000
- Example: 415678912-7000
- Issued by: Inland Revenue Department of Sri Lanka
- Validation: Must end with "-7000"
- Leading zeros: Not typically included

**Registration Process**
- Apply online via RAMIS portal (revenue.gov.lk)
- Provide business registration, financial projections
- Processing time: 2-4 weeks
- Certificate issued with VAT number
- Effective date specified on certificate

**Field Usage**
- Required for VAT return filing
- Displayed on VAT invoices and receipts
- Used in electronic filing portal authentication
- Required for VAT credit claims
- Must match Business Registration Number prefix

### Expected Outcome
- VAT registration number field added to model
- Format validation ensures data quality
- Optional field (businesses may not be VAT registered)
- Supports Sri Lankan VAT number format
- Ready for use in VAT reporting features

### Verification Checklist
- [ ] `vat_registration_no` field added to TaxConfiguration
- [ ] Field type is CharField with max_length=20
- [ ] Field allows null and blank values
- [ ] Validator checks VAT number format (XXXXXXXXX-7000)
- [ ] Verbose name and help text are descriptive
- [ ] Field comments explain format and usage

---

## Task 07: Add SVAT Status

### Overview
Add the Simplified VAT registration status field to TaxConfiguration model. This boolean field indicates whether the business is registered under the Simplified VAT scheme, which has different filing requirements and is designed for smaller businesses.

### Dependencies
- Task 05: Create TaxConfiguration Model

### Instructions

1. **Open tax_configuration.py file**
   - Continue in `apps/accounting/models/tax_configuration.py`
   - Add field after vat_registration_no

2. **Add SVAT status field**
   - Field name: `is_svat_registered`
   - Field type: BooleanField
   - Default: False (most businesses not on SVAT)
   - Required field (not null)

3. **Set field attributes**
   - verbose_name: 'Simplified VAT Registered'
   - help_text: 'Whether business is registered under Simplified VAT scheme (turnover LKR 12M-75M)'
   - default=False
   - blank=False (must explicitly set)

4. **Add field comments**
   - Document SVAT scheme eligibility
   - Explain difference from full VAT
   - Note impact on filing requirements

### Simplified VAT (SVAT) Context

**SVAT Scheme Overview**
- Introduced for small and medium enterprises
- Annual turnover threshold: LKR 12 million to LKR 75 million
- Simplified record-keeping requirements
- Quarterly filing instead of monthly
- Reduced documentation burden

**SVAT vs Full VAT Comparison**

| Aspect | Simplified VAT | Full VAT |
|--------|---------------|----------|
| Turnover Range | LKR 12M - 75M | > LKR 75M |
| Filing Frequency | Quarterly | Monthly |
| Due Date | 30th after quarter | 20th of next month |
| Input Credit | Full credit allowed | Full credit allowed |
| Record Keeping | Simplified | Comprehensive |
| Audit Risk | Lower | Higher |
| Invoice Format | Standard | Standard |

**SVAT Eligibility**
- Annual turnover between LKR 12M and LKR 75M
- Voluntary registration not applicable
- Mandatory graduation to full VAT when exceed LKR 75M
- Cannot opt for SVAT if turnover > LKR 75M
- Automatic classification based on turnover

**SVAT Filing Requirements**
- Quarterly VAT returns (not monthly)
- Due: 30th of month following quarter end
- Simplified Form 200 (SVAT version)
- Less detailed transaction breakdown
- Reduced audit and documentation requirements

**Field Business Logic**
- If `is_svat_registered = True`:
  - Expect `vat_filing_period = QUARTERLY`
  - Use SVAT return format (Form 200-S)
  - Less frequent filing reminders
  - Simplified compliance checks
- If `is_svat_registered = False`:
  - Either not VAT registered or full VAT
  - Use standard VAT return format
  - Monthly filing if VAT registered with high turnover

### Expected Outcome
- SVAT status field added to model
- Boolean flag for easy checking
- Affects filing frequency and return format
- Supports Sri Lankan VAT scheme differentiation
- Used in automatic filing schedule generation

### Verification Checklist
- [ ] `is_svat_registered` field added to TaxConfiguration
- [ ] Field type is BooleanField with default=False
- [ ] Verbose name and help text explain SVAT scheme
- [ ] Field is non-nullable (required)
- [ ] Field comments document SVAT eligibility and impact

---

## Task 08: Add EPF Registration

### Overview
Add the EPF (Employees' Provident Fund) registration number field to TaxConfiguration model. This field stores the employer's EPF registration number issued by Central Bank of Sri Lanka, required for monthly EPF contribution filing.

### Dependencies
- Task 05: Create TaxConfiguration Model

### Instructions

1. **Open tax_configuration.py file**
   - Continue in `apps/accounting/models/tax_configuration.py`
   - Add field after is_svat_registered

2. **Add EPF registration number field**
   - Field name: `epf_registration_no`
   - Field type: CharField
   - Max length: 15 characters
   - Allow null and blank (not all businesses have employees)

3. **Add field validation**
   - Add validator for Sri Lankan EPF format
   - Format: E/XXXXXX (starts with "E/", followed by 6 digits)
   - Example: E/123456
   - Validator should check prefix and digit count

4. **Set field attributes**
   - verbose_name: 'EPF Registration Number'
   - help_text: 'EPF registration number issued by Central Bank of Sri Lanka (format: E/XXXXXX)'
   - blank=True (optional field)
   - null=True (database allows NULL)

5. **Add field comments**
   - Document EPF number format requirements
   - Explain when field should be populated
   - Note relationship to payroll and EPF filing

### EPF Registration Context

**EPF Scheme Overview**
- Mandatory retirement savings fund for all employees
- Governed by Central Bank of Sri Lanka
- Employee contribution: 8% of basic salary
- Employer contribution: 12% of basic salary
- Total contribution: 20% of basic salary
- Monthly contribution due by 15th of next month

**EPF Number Format**
- Structure: E/[6-digit employer number]
- Example: E/456789
- Issued by: Central Bank of Sri Lanka - EPF Department
- Prefix: Always "E/"
- Format validation: Must match E/\d{6} pattern

**Registration Requirements**
- Mandatory for all employers with employees
- Register within 14 days of hiring first employee
- Apply at Central Bank EPF counter or online
- Provide business registration and employee details
- Processing time: 1-2 weeks
- Certificate issued with EPF number

**EPF Contributions**
- Employee: 8% of basic salary (deducted from wages)
- Employer: 12% of basic salary (additional cost)
- Total: 20% to employee's retirement account
- Monthly deadline: 15th of following month
- Late payment penalties: 10% per month
- Online filing via EPF portal

**Field Usage**
- Required for monthly EPF contribution filing
- Displayed on EPF Form 1 (monthly return)
- Used in EPF portal authentication
- Required for employee EPF account setup
- Must match Certificate of Registration

**Business Rules**
- If employer has employees → EPF number required
- Null/blank acceptable only if no employees
- Used to track EPF filing periods and deadlines
- Linked to payroll processing for automatic calculations

### Expected Outcome
- EPF registration number field added to model
- Format validation ensures data quality
- Optional field (businesses without employees may not have)
- Supports Sri Lankan EPF number format
- Ready for use in EPF reporting features

### Verification Checklist
- [ ] `epf_registration_no` field added to TaxConfiguration
- [ ] Field type is CharField with max_length=15
- [ ] Field allows null and blank values
- [ ] Validator checks EPF number format (E/XXXXXX)
- [ ] Verbose name and help text are descriptive
- [ ] Field comments explain format and usage
- [ ] Field linked to EPF contribution filing logic

---

## Summary

This document established the foundation of the tax reporting system:

**Module Structure**
- Created `apps/accounting/tax/` submodule
- Organized tax functionality in dedicated package

**Enumerations**
- TaxType: VAT, PAYE, EPF, ETF, WHT
- TaxPeriod: MONTHLY, QUARTERLY, ANNUAL
- FilingStatus: PENDING, GENERATED, FILED, ACCEPTED

**TaxConfiguration Model**
- Base model structure with multi-tenancy
- VAT registration number (XXXXXXXXX-7000 format)
- SVAT registration status (boolean flag)
- EPF registration number (E/XXXXXX format)

**Next Steps**
The next document will complete the TaxConfiguration model with ETF registration, employer TIN, and filing frequency fields, then create the TaxPeriodRecord model for tracking individual filing periods.

---

**Document Status:** Complete  
**Last Updated:** 2026-01-25
