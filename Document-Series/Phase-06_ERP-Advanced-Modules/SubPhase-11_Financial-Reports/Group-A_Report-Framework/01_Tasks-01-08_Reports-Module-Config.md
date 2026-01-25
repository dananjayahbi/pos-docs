# Tasks 01-08: Reports Module and Configuration

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 11 - Financial Reports  
> **Group:** A - Report Framework  
> **Document:** 01 of 02  
> **Tasks Covered:** 01, 02, 03, 04, 05, 06, 07, 08

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-09-16_BaseGenerator-ReportResult.md](02_Tasks-09-16_BaseGenerator-ReportResult.md)

---

## Document Overview

This document establishes the foundational infrastructure for the financial reporting system. It covers creating the reports module, defining report type and period enumerations, and implementing the ReportConfig model with comprehensive configuration options including date ranges, comparison periods, and detail levels.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 01 | Create reports Module | Low | 10 min |
| 02 | Define ReportType Enum | Low | 15 min |
| 03 | Define ReportPeriod Enum | Low | 10 min |
| 04 | Create ReportConfig Model | Medium | 30 min |
| 05 | Add Config Date Fields | Low | 15 min |
| 06 | Add Config Comparison Flag | Low | 15 min |
| 07 | Add Config Prior Period | Low | 15 min |
| 08 | Add Config Detail Level | Low | 15 min |

---

## Task 01: Create Reports Module

### Overview
Create the `reports` submodule within the accounting application to organize all financial reporting functionality. This submodule will contain report generators, configuration models, enumerations, and utilities for generating financial reports.

### Dependencies
- Accounting application (`apps/accounting/`) must exist
- Django project structure is established
- Core backend infrastructure is in place

### Instructions

1. **Create reports directory structure**
   - Navigate to `apps/accounting/` directory
   - Create new directory named `reports`
   - This will house all financial report generation functionality

2. **Create package initialization file**
   - Create `__init__.py` in `reports/` directory
   - Add module docstring describing the reports functionality
   - This makes the directory a Python package

3. **Create enums module**
   - Create `enums.py` in `reports/` directory
   - This will contain report type and period enumerations
   - Provides type safety for report configuration

4. **Create base generator module**
   - Create `base.py` in `reports/` directory
   - This will contain the abstract BaseReportGenerator class
   - Defines common interface for all report generators

5. **Create generators directory**
   - Create `generators/` subdirectory inside `reports/`
   - This will contain specific report generator implementations
   - Create `__init__.py` in `generators/` directory

6. **Update accounting models package**
   - Prepare to add report-related models
   - Will create `report_config.py` and `report_result.py` in `models/`
   - Update `models/__init__.py` to import these models

### Directory Structure
```
apps/accounting/
├── reports/
│   ├── __init__.py              # Package initialization
│   ├── enums.py                # Report enumerations
│   ├── base.py                 # BaseReportGenerator
│   └── generators/
│       └── __init__.py         # Generators package init
├── models/
│   ├── __init__.py             # Models package (to update)
│   ├── report_config.py        # ReportConfig model (to create)
│   └── report_result.py        # ReportResult model (to create)
└── migrations/                  # Migration files
```

### Module Purpose

| Module | Purpose |
|--------|---------|
| `reports/__init__.py` | Package entry point, exports main classes |
| `reports/enums.py` | Report type and period enumerations |
| `reports/base.py` | Abstract base generator class |
| `reports/generators/` | Specific report implementations |
| `models/report_config.py` | Report configuration model |
| `models/report_result.py` | Report result storage model |

### Expected Outcome
- Clean module structure within accounting app
- Organized location for financial reporting functionality
- Foundation for extensible report generator system
- Separation of concerns (models, generators, enums)

### Verification Checklist
- [ ] `apps/accounting/reports/` directory exists
- [ ] `reports/__init__.py` file created with docstring
- [ ] `reports/enums.py` file created (empty initially)
- [ ] `reports/base.py` file created (empty initially)
- [ ] `reports/generators/` directory exists
- [ ] `reports/generators/__init__.py` file created
- [ ] Ready to add report models to `models/` directory

---

## Task 02: Define ReportType Enum

### Overview
Create the ReportType enumeration to define all supported financial report types. This enum provides type safety and ensures consistent report type references throughout the system.

### Dependencies
- Task 01: Reports module must be created
- Python `enum` module available
- Django TextChoices pattern understanding

### Instructions

1. **Open enums module**
   - Navigate to `apps/accounting/reports/enums.py`
   - This will contain all report-related enumerations

2. **Import required modules**
   - Import `models` from `django.db`
   - This provides access to `TextChoices` base class
   - TextChoices integrates with Django model fields

3. **Create ReportType enumeration**
   - Define `ReportType` class inheriting from `models.TextChoices`
   - Each report type needs a database value and human-readable label
   - Use uppercase for enum member names

4. **Define Trial Balance report type**
   - Name: `TRIAL_BALANCE`
   - Value: `'TRIAL_BALANCE'`
   - Label: `'Trial Balance'`
   - Purpose: Summary of all account balances at a point in time

5. **Define Profit & Loss report type**
   - Name: `PROFIT_LOSS`
   - Value: `'PROFIT_LOSS'`
   - Label: `'Profit & Loss Statement'`
   - Purpose: Income and expenses for a period

6. **Define Balance Sheet report type**
   - Name: `BALANCE_SHEET`
   - Value: `'BALANCE_SHEET'`
   - Label: `'Balance Sheet'`
   - Purpose: Financial position at a point in time

7. **Define Cash Flow report type**
   - Name: `CASH_FLOW`
   - Value: `'CASH_FLOW'`
   - Label: `'Cash Flow Statement'`
   - Purpose: Cash movements for a period

8. **Define General Ledger report type**
   - Name: `GENERAL_LEDGER`
   - Value: `'GENERAL_LEDGER'`
   - Label: `'General Ledger'`
   - Purpose: Detailed transaction listing by account

### Report Type Characteristics

| Report Type | Time Frame | Primary Purpose | Sri Lanka Context |
|-------------|-----------|-----------------|-------------------|
| **Trial Balance** | Point-in-time | Verify accounting accuracy | Required for IRD audits |
| **Profit & Loss** | Period range | Business performance | Tax declaration basis |
| **Balance Sheet** | Point-in-time | Financial position | Asset valuation for loans |
| **Cash Flow** | Period range | Liquidity analysis | Bank reconciliation |
| **General Ledger** | Period range | Transaction audit trail | IRD inspection compliance |

### Enum Usage Patterns

| Usage | Example | Benefit |
|-------|---------|---------|
| Model field choices | `report_type = models.CharField(choices=ReportType.choices)` | Database constraint |
| Type checking | `if config.report_type == ReportType.TRIAL_BALANCE:` | Type safety |
| Dropdown options | `form.fields['type'].choices = ReportType.choices` | Consistent UI |
| API serialization | `serializer.CharField(choices=ReportType.choices)` | Validation |

### Expected Outcome
- ReportType enum defined with five report types
- Each type has database value and display label
- Enum ready for use in models and forms
- Type safety for report type references

### Verification Checklist
- [ ] `ReportType` class defined in `enums.py`
- [ ] Inherits from `models.TextChoices`
- [ ] Five report types defined (TRIAL_BALANCE, PROFIT_LOSS, BALANCE_SHEET, CASH_FLOW, GENERAL_LEDGER)
- [ ] Each type has appropriate value and label
- [ ] Enum can be imported from `apps.accounting.reports.enums`

---

## Task 03: Define ReportPeriod Enum

### Overview
Create the ReportPeriod enumeration to define supported reporting periods. This enum standardizes period selection and enables consistent period handling across all financial reports.

### Dependencies
- Task 01: Reports module must be created
- Task 02: ReportType enum pattern established
- Understanding of Sri Lankan fiscal periods

### Instructions

1. **Continue in enums module**
   - Open `apps/accounting/reports/enums.py`
   - Add ReportPeriod enum after ReportType enum

2. **Create ReportPeriod enumeration**
   - Define `ReportPeriod` class inheriting from `models.TextChoices`
   - Will define standard reporting periods
   - Supports both fixed and custom periods

3. **Define Monthly period type**
   - Name: `MONTHLY`
   - Value: `'MONTHLY'`
   - Label: `'Monthly'`
   - Purpose: Single calendar or fiscal month

4. **Define Quarterly period type**
   - Name: `QUARTERLY`
   - Value: `'QUARTERLY'`
   - Label: `'Quarterly'`
   - Purpose: Three-month fiscal quarter (Q1, Q2, Q3, Q4)

5. **Define Yearly period type**
   - Name: `YEARLY`
   - Value: `'YEARLY'`
   - Label: `'Yearly'`
   - Label alternative: `'Financial Year'`
   - Purpose: Full fiscal year (April 1 to March 31 in Sri Lanka)

6. **Define Custom period type**
   - Name: `CUSTOM`
   - Value: `'CUSTOM'`
   - Label: `'Custom Date Range'`
   - Purpose: User-defined start and end dates

### Sri Lankan Fiscal Calendar

| Period Type | Standard Dates | Sri Lankan Context |
|-------------|---------------|-------------------|
| **Monthly** | 1st to last day of month | Monthly VAT returns |
| **Quarterly** | Q1: Apr-Jun, Q2: Jul-Sep, Q3: Oct-Dec, Q4: Jan-Mar | Quarterly corporate tax estimates |
| **Yearly** | April 1 to March 31 | Fiscal year for tax purposes |
| **Custom** | User-defined | Ad-hoc management reports |

### Period Selection Logic

```
Period Selection Flow:
├── MONTHLY
│   ├── Select month and year
│   └── Auto-calculate start/end dates
├── QUARTERLY
│   ├── Select quarter (Q1-Q4)
│   ├── Select fiscal year
│   └── Auto-calculate start/end dates
├── YEARLY
│   ├── Select fiscal year
│   └── Set dates: April 1 to March 31
└── CUSTOM
    ├── User enters start_date
    └── User enters end_date
```

### Period Type Usage

| Report Type | Typical Period | Reason |
|-------------|---------------|---------|
| Trial Balance | Point-in-time (as_of_date) | Snapshot of account balances |
| Profit & Loss | MONTHLY, QUARTERLY, YEARLY | Performance over time |
| Balance Sheet | Point-in-time (as_of_date) | Financial position snapshot |
| Cash Flow | MONTHLY, QUARTERLY, YEARLY | Cash movement over time |
| General Ledger | MONTHLY, CUSTOM | Transaction detail listing |

### Expected Outcome
- ReportPeriod enum defined with four period types
- Support for standard and custom periods
- Foundation for period calculation logic
- Integration with Sri Lankan fiscal calendar

### Verification Checklist
- [ ] `ReportPeriod` class defined in `enums.py`
- [ ] Inherits from `models.TextChoices`
- [ ] Four period types defined (MONTHLY, QUARTERLY, YEARLY, CUSTOM)
- [ ] Each period has appropriate value and label
- [ ] Ready for use in ReportConfig model

---

## Task 04: Create ReportConfig Model

### Overview
Create the ReportConfig model to store financial report configuration parameters. This model serves as the central configuration for report generation, storing report type, period selection, and various generation options.

### Dependencies
- Task 01: Reports module created
- Task 02: ReportType enum defined
- Task 03: ReportPeriod enum defined
- Django models and multi-tenancy infrastructure
- Core backend base models (TenantAwareModel, TimestampedModel)

### Instructions

1. **Create report_config model file**
   - Navigate to `apps/accounting/models/` directory
   - Create new file named `report_config.py`
   - This will contain the ReportConfig model

2. **Import required dependencies**
   - Import Django model fields and validators
   - Import `TenantAwareModel` and `TimestampedModel` from core
   - Import `ReportType` and `ReportPeriod` from `reports.enums`
   - Import Python datetime utilities

3. **Define ReportConfig model class**
   - Inherit from `TenantAwareModel` and `TimestampedModel`
   - Provides tenant isolation and automatic timestamps
   - Will store report generation parameters

4. **Add report identification fields**
   - `name`: CharField for report configuration name (max 200 chars)
   - Purpose: Descriptive name for saved configurations
   - Make it required (no null/blank)

5. **Add report type field**
   - `report_type`: CharField with ReportType.choices
   - Purpose: Specifies which report to generate
   - Max length should accommodate enum values (20 chars)
   - Required field

6. **Add period type field**
   - `period_type`: CharField with ReportPeriod.choices
   - Purpose: Specifies period selection method
   - Max length should accommodate enum values (15 chars)
   - Required field

7. **Add tenant relation field**
   - `tenant`: ForeignKey to Tenant model
   - Purpose: Links config to specific tenant
   - Set `related_name='report_configs'`
   - Enable cascade deletion

8. **Add active status field**
   - `is_active`: BooleanField with default True
   - Purpose: Mark configuration as active/archived
   - Allows soft deletion of configs

### Model Field Summary

| Field | Type | Purpose | Required |
|-------|------|---------|----------|
| `name` | CharField(200) | Configuration name | Yes |
| `report_type` | CharField(20) | Type of report (enum) | Yes |
| `period_type` | CharField(15) | Period selection (enum) | Yes |
| `tenant` | ForeignKey | Tenant isolation | Yes |
| `is_active` | BooleanField | Active status | Yes (default True) |

### Model Structure

```
ReportConfig Model:
├── Identification
│   ├── name (CharField)
│   └── is_active (BooleanField)
├── Report Configuration
│   ├── report_type (ReportType enum)
│   └── period_type (ReportPeriod enum)
├── Multi-tenancy
│   └── tenant (ForeignKey)
├── Date Configuration (Task 05)
│   ├── start_date
│   ├── end_date
│   └── as_of_date
├── Comparison Configuration (Tasks 06-07)
│   ├── include_comparison
│   ├── comparison_start_date
│   └── comparison_end_date
└── Detail Configuration (Task 08)
    └── detail_level
```

### Model Meta Configuration

| Meta Option | Value | Purpose |
|-------------|-------|---------|
| `verbose_name` | `'Report Configuration'` | Admin display name |
| `verbose_name_plural` | `'Report Configurations'` | Admin plural name |
| `ordering` | `['-created_at']` | Default sort order |
| `indexes` | `tenant, report_type, is_active` | Query optimization |

### Expected Outcome
- ReportConfig model defined with core fields
- Tenant-aware with proper isolation
- Foundation for additional configuration fields
- Ready for date, comparison, and detail fields

### Verification Checklist
- [ ] `report_config.py` file created in `models/` directory
- [ ] ReportConfig class defined
- [ ] Inherits from TenantAwareModel and TimestampedModel
- [ ] Core fields defined (name, report_type, period_type, tenant, is_active)
- [ ] Model Meta class configured
- [ ] Proper imports from enums module

---

## Task 05: Add Config Date Fields

### Overview
Add date-related fields to the ReportConfig model to support period-based and point-in-time report generation. These fields handle both date range reports (P&L, Cash Flow) and snapshot reports (Balance Sheet, Trial Balance).

### Dependencies
- Task 04: ReportConfig model base structure created
- Understanding of date range vs. point-in-time reports
- Sri Lankan fiscal calendar awareness

### Instructions

1. **Open ReportConfig model**
   - Navigate to `apps/accounting/models/report_config.py`
   - Add date fields to existing model

2. **Add start_date field**
   - Type: `DateField`
   - Purpose: Beginning of reporting period
   - Set `null=True, blank=True` (not all reports need it)
   - Used for P&L, Cash Flow, General Ledger

3. **Add end_date field**
   - Type: `DateField`
   - Purpose: End of reporting period
   - Set `null=True, blank=True` (not all reports need it)
   - Used for P&L, Cash Flow, General Ledger

4. **Add as_of_date field**
   - Type: `DateField`
   - Purpose: Point-in-time date for snapshot reports
   - Set `null=True, blank=True` (only for snapshot reports)
   - Used for Balance Sheet, Trial Balance

5. **Add fiscal_year field**
   - Type: `IntegerField`
   - Purpose: Store fiscal year reference
   - Set `null=True, blank=True`
   - Helpful for yearly and quarterly periods

6. **Add validation method**
   - Create `clean()` method
   - Validate date field requirements based on report type
   - Ensure date logic consistency

### Date Field Requirements by Report Type

| Report Type | Required Fields | Optional Fields | Notes |
|-------------|----------------|-----------------|-------|
| **Trial Balance** | as_of_date | - | Snapshot at specific date |
| **Profit & Loss** | start_date, end_date | as_of_date | Period range required |
| **Balance Sheet** | as_of_date | - | Snapshot at specific date |
| **Cash Flow** | start_date, end_date | - | Period range required |
| **General Ledger** | start_date, end_date | - | Period range required |

### Date Field Validation Logic

```
Date Validation Rules:
├── For Snapshot Reports (TB, BS):
│   ├── as_of_date is REQUIRED
│   └── start_date/end_date are OPTIONAL
├── For Period Reports (P&L, CF, GL):
│   ├── start_date and end_date are REQUIRED
│   ├── end_date must be >= start_date
│   └── as_of_date is OPTIONAL (defaults to end_date)
└── For CUSTOM period:
    └── User must provide explicit dates
```

### Period Type Date Calculation

| Period Type | Date Calculation Logic |
|-------------|----------------------|
| **MONTHLY** | If month=5, year=2026: start_date=2026-05-01, end_date=2026-05-31 |
| **QUARTERLY** | If Q1, FY2026: start_date=2026-04-01, end_date=2026-06-30 |
| **YEARLY** | If FY2026: start_date=2026-04-01, end_date=2027-03-31 |
| **CUSTOM** | User provides start_date and end_date directly |

### Sri Lankan Fiscal Year Context

| Fiscal Year | Start Date | End Date | Tax Year |
|-------------|-----------|----------|----------|
| FY 2024/25 | 2024-04-01 | 2025-03-31 | 2024/25 |
| FY 2025/26 | 2025-04-01 | 2026-03-31 | 2025/26 |
| FY 2026/27 | 2026-04-01 | 2027-03-31 | 2026/27 |

### Expected Outcome
- Date fields added to ReportConfig model
- Support for both range and snapshot reports
- Validation logic for date consistency
- Ready for period calculation utilities

### Verification Checklist
- [ ] `start_date` field added to model
- [ ] `end_date` field added to model
- [ ] `as_of_date` field added to model
- [ ] `fiscal_year` field added to model
- [ ] All date fields allow null/blank appropriately
- [ ] `clean()` method validates date logic

---

## Task 06: Add Config Comparison Flag

### Overview
Add the comparison flag field to enable period-over-period comparison in financial reports. This allows users to generate reports that show current period data alongside prior period data for variance analysis.

### Dependencies
- Task 04: ReportConfig model base structure created
- Task 05: Date fields added to model
- Understanding of period comparison reporting

### Instructions

1. **Open ReportConfig model**
   - Navigate to `apps/accounting/models/report_config.py`
   - Add comparison configuration fields

2. **Add include_comparison field**
   - Type: `BooleanField`
   - Purpose: Flag to enable prior period comparison
   - Set `default=False`
   - When True, report will include comparison columns

3. **Add comparison_period_type field**
   - Type: `CharField` with choices
   - Purpose: Specify comparison period type
   - Choices: `'PRIOR_PERIOD'`, `'PRIOR_YEAR'`, `'CUSTOM'`
   - Set `null=True, blank=True` (only needed if include_comparison=True)

4. **Add comparison configuration**
   - Create inline choices for comparison types
   - PRIOR_PERIOD: Previous month/quarter
   - PRIOR_YEAR: Same period last year
   - CUSTOM: User-defined comparison dates

### Comparison Flag Purpose

| Feature | Purpose | Business Value |
|---------|---------|----------------|
| **Period Comparison** | Show current vs. prior period | Trend analysis |
| **Variance Analysis** | Calculate differences (amount & %) | Performance monitoring |
| **Year-over-Year** | Compare to same period last year | Seasonal analysis |
| **Benchmark** | Compare actual vs. budget/forecast | Goal tracking |

### Comparison Types

| Comparison Type | Calculation Logic | Example |
|----------------|------------------|---------|
| **PRIOR_PERIOD** | Previous sequential period | Current: May 2026, Prior: Apr 2026 |
| **PRIOR_YEAR** | Same period last year | Current: Q1 FY2026, Prior: Q1 FY2025 |
| **CUSTOM** | User-defined dates | Current: Any period, Prior: Any period |

### Report Output with Comparison

```
Profit & Loss Statement Example:
┌─────────────────────────────────────────────────────────────┐
│ Account           │ Current Period │ Prior Period │ Variance │
├───────────────────┼────────────────┼──────────────┼──────────┤
│ Revenue           │ ₨ 1,000,000   │ ₨ 850,000   │ +17.6%   │
│ Cost of Sales     │ ₨ 600,000     │ ₨ 520,000   │ +15.4%   │
│ Gross Profit      │ ₨ 400,000     │ ₨ 330,000   │ +21.2%   │
└─────────────────────────────────────────────────────────────┘
```

### Comparison Period Logic

```
Comparison Period Calculation:
├── If include_comparison = False:
│   └── No comparison columns
├── If include_comparison = True:
│   ├── AND comparison_period_type = PRIOR_PERIOD:
│   │   ├── If MONTHLY: Prior month
│   │   ├── If QUARTERLY: Prior quarter
│   │   └── If YEARLY: Prior fiscal year
│   ├── AND comparison_period_type = PRIOR_YEAR:
│   │   └── Same period, year - 1
│   └── AND comparison_period_type = CUSTOM:
│       └── Use comparison_start_date and comparison_end_date
```

### Validation Rules

| Validation | Rule | Error Message |
|------------|------|---------------|
| **Comparison Dates** | If include_comparison=True, comparison period must be valid | "Comparison period required when comparison enabled" |
| **Period Length** | Comparison period should match current period length | "Comparison period length mismatch" |
| **Date Order** | Comparison period should be before current period | "Comparison period must be earlier" |

### Expected Outcome
- Comparison flag added to ReportConfig
- Comparison type field for period selection
- Foundation for comparison date fields (Task 07)
- Support for variance analysis features

### Verification Checklist
- [ ] `include_comparison` BooleanField added
- [ ] `comparison_period_type` CharField added with choices
- [ ] Default value set to False for include_comparison
- [ ] Field allows null/blank appropriately
- [ ] Ready for comparison date fields

---

## Task 07: Add Config Prior Period

### Overview
Add comparison date fields to store the prior period date range for comparison reporting. These fields work in conjunction with the comparison flag to enable period-over-period analysis.

### Dependencies
- Task 04: ReportConfig model base structure created
- Task 05: Date fields added
- Task 06: Comparison flag added

### Instructions

1. **Open ReportConfig model**
   - Navigate to `apps/accounting/models/report_config.py`
   - Add comparison date fields

2. **Add comparison_start_date field**
   - Type: `DateField`
   - Purpose: Beginning of comparison period
   - Set `null=True, blank=True`
   - Only required if `include_comparison=True` and `comparison_period_type='CUSTOM'`

3. **Add comparison_end_date field**
   - Type: `DateField`
   - Purpose: End of comparison period
   - Set `null=True, blank=True`
   - Only required if `include_comparison=True` and `comparison_period_type='CUSTOM'`

4. **Add comparison_as_of_date field**
   - Type: `DateField`
   - Purpose: Snapshot date for comparison (for TB, BS)
   - Set `null=True, blank=True`
   - Used for snapshot report comparisons

5. **Update validation method**
   - Extend `clean()` method to validate comparison dates
   - Check if comparison dates are required
   - Validate comparison period is before current period
   - Ensure period lengths are comparable

### Comparison Date Field Usage

| Report Type | Current Period Fields | Comparison Period Fields |
|-------------|----------------------|-------------------------|
| **Trial Balance** | as_of_date | comparison_as_of_date |
| **Profit & Loss** | start_date, end_date | comparison_start_date, comparison_end_date |
| **Balance Sheet** | as_of_date | comparison_as_of_date |
| **Cash Flow** | start_date, end_date | comparison_start_date, comparison_end_date |
| **General Ledger** | start_date, end_date | comparison_start_date, comparison_end_date |

### Automatic Comparison Date Calculation

| Scenario | Current Period | Auto-Calculated Prior Period |
|----------|---------------|----------------------------|
| **Monthly (Prior Period)** | May 2026 (2026-05-01 to 2026-05-31) | Apr 2026 (2026-04-01 to 2026-04-30) |
| **Quarterly (Prior Period)** | Q2 FY2026 (2026-07-01 to 2026-09-30) | Q1 FY2026 (2026-04-01 to 2026-06-30) |
| **Yearly (Prior Year)** | FY2026 (2026-04-01 to 2027-03-31) | FY2025 (2025-04-01 to 2026-03-31) |
| **Monthly (Prior Year)** | May 2026 (2026-05-01 to 2026-05-31) | May 2025 (2025-05-01 to 2025-05-31) |

### Comparison Validation Logic

```
Comparison Date Validation:
├── If include_comparison = False:
│   └── Skip comparison date validation
├── If include_comparison = True:
│   ├── If comparison_period_type = CUSTOM:
│   │   ├── comparison_start_date REQUIRED
│   │   ├── comparison_end_date REQUIRED
│   │   └── Validate date range
│   ├── If comparison_period_type = PRIOR_PERIOD:
│   │   └── Auto-calculate based on current period
│   └── If comparison_period_type = PRIOR_YEAR:
│       └── Auto-calculate: dates - 12 months
└── Additional Checks:
    ├── comparison_end_date >= comparison_start_date
    ├── comparison_end_date < start_date (prior to current)
    └── Period lengths should be similar (within tolerance)
```

### Period Length Comparison

| Validation | Rule | Tolerance |
|------------|------|-----------|
| **Monthly** | Both periods should be 28-31 days | ±3 days acceptable |
| **Quarterly** | Both periods should be ~90 days | ±5 days acceptable |
| **Yearly** | Both periods should be 365/366 days | ±7 days acceptable |
| **Custom** | No strict requirement | User responsibility |

### Expected Outcome
- Comparison date fields added to model
- Support for custom comparison periods
- Validation ensures data integrity
- Ready for automatic period calculation utilities

### Verification Checklist
- [ ] `comparison_start_date` field added
- [ ] `comparison_end_date` field added
- [ ] `comparison_as_of_date` field added
- [ ] All comparison fields allow null/blank
- [ ] Validation logic updated in `clean()` method
- [ ] Fields properly documented

---

## Task 08: Add Config Detail Level

### Overview
Add the detail level field to control the granularity of financial report output. This allows users to choose between summary-level reporting and detailed transaction-level reporting based on their needs.

### Dependencies
- Task 04: ReportConfig model base structure created
- Understanding of report detail requirements
- Knowledge of account hierarchies and sub-accounts

### Instructions

1. **Open ReportConfig model**
   - Navigate to `apps/accounting/models/report_config.py`
   - Add detail level configuration

2. **Create DetailLevel enumeration**
   - Define inline TextChoices class within the model
   - Name: `DetailLevel`
   - Provides choices for detail level field

3. **Define SUMMARY detail level**
   - Value: `'SUMMARY'`
   - Label: `'Summary'`
   - Shows only main account categories
   - Aggregates all transactions

4. **Define DETAIL detail level**
   - Value: `'DETAIL'`
   - Label: `'Detailed'`
   - Shows individual sub-accounts
   - May include transaction line items

5. **Add detail_level field**
   - Type: `CharField`
   - Choices: `DetailLevel.choices`
   - Max length: 15 characters
   - Default: `DetailLevel.SUMMARY`
   - Purpose: Controls output granularity

6. **Add include_zero_balances field**
   - Type: `BooleanField`
   - Purpose: Whether to show accounts with zero balance
   - Default: `False`
   - Useful for audit trails and complete listings

### Detail Level Characteristics

| Detail Level | Display | Use Case | Performance |
|-------------|---------|----------|-------------|
| **SUMMARY** | Main accounts only | Executive overview, quick analysis | Fast |
| **DETAIL** | Sub-accounts, line items | Detailed analysis, audit | Slower |

### Report Output Examples

**SUMMARY Level - Profit & Loss:**
```
Revenue                          ₨ 1,000,000
Cost of Goods Sold              ₨   600,000
Gross Profit                    ₨   400,000
Operating Expenses              ₨   250,000
Net Profit                      ₨   150,000
```

**DETAIL Level - Profit & Loss:**
```
Revenue                          ₨ 1,000,000
  ├─ Product Sales              ₨   850,000
  ├─ Service Revenue            ₨   100,000
  └─ Other Income               ₨    50,000
Cost of Goods Sold              ₨   600,000
  ├─ Raw Materials              ₨   400,000
  ├─ Direct Labor               ₨   150,000
  └─ Manufacturing Overhead     ₨    50,000
Gross Profit                    ₨   400,000
Operating Expenses              ₨   250,000
  ├─ Salaries & Wages          ₨   150,000
  ├─ Rent                       ₨    50,000
  ├─ Utilities                  ₨    20,000
  └─ Other Expenses             ₨    30,000
Net Profit                      ₨   150,000
```

### Detail Level by Report Type

| Report Type | SUMMARY Level | DETAIL Level |
|-------------|--------------|--------------|
| **Trial Balance** | Account groups | Individual accounts |
| **Profit & Loss** | Main categories | Sub-accounts + transactions |
| **Balance Sheet** | Asset/Liability categories | Sub-accounts |
| **Cash Flow** | Activity categories | Individual cash movements |
| **General Ledger** | Account summaries | All transactions |

### Zero Balance Handling

| Setting | Behavior | Use Case |
|---------|----------|----------|
| **include_zero_balances = False** | Hide accounts with zero balance | Clean, focused reports |
| **include_zero_balances = True** | Show all accounts regardless | Audit compliance, complete view |

### Sri Lankan Reporting Requirements

| Requirement | Detail Level | Zero Balances | Context |
|-------------|-------------|---------------|---------|
| **IRD Tax Returns** | SUMMARY | False | High-level tax calculation |
| **Audit Reports** | DETAIL | True | Complete transaction trail |
| **Management Reports** | SUMMARY | False | Quick decision-making |
| **Bank Loan Applications** | DETAIL | False | Detailed financial position |

### Model Configuration Summary

After Task 08, the ReportConfig model includes:

```
ReportConfig Model - Complete Structure:
├── Identification
│   ├── name
│   └── is_active
├── Report Type & Period
│   ├── report_type (ReportType enum)
│   └── period_type (ReportPeriod enum)
├── Date Configuration
│   ├── start_date
│   ├── end_date
│   ├── as_of_date
│   └── fiscal_year
├── Comparison Configuration
│   ├── include_comparison
│   ├── comparison_period_type
│   ├── comparison_start_date
│   ├── comparison_end_date
│   └── comparison_as_of_date
├── Detail Configuration
│   ├── detail_level (DetailLevel enum)
│   └── include_zero_balances
└── Multi-tenancy & Timestamps
    ├── tenant
    ├── created_at
    ├── updated_at
    ├── created_by
    └── updated_by
```

### Expected Outcome
- Detail level field added to ReportConfig
- DetailLevel enumeration defined
- Zero balance control flag added
- Complete report configuration model ready
- Foundation for report generation logic

### Verification Checklist
- [ ] `DetailLevel` inner class defined with SUMMARY and DETAIL
- [ ] `detail_level` field added with choices
- [ ] Default value set to SUMMARY
- [ ] `include_zero_balances` BooleanField added
- [ ] Model is complete and ready for migrations
- [ ] ReportConfig can be imported in `models/__init__.py`

---

## Summary

This document established the core infrastructure for the financial reporting system:

- **Reports Module Created:** Organized structure for report generators and utilities
- **Enumerations Defined:** ReportType (5 types) and ReportPeriod (4 types) for type safety
- **ReportConfig Model:** Complete configuration model with:
  - Report identification and tenant isolation
  - Date configuration (start, end, as_of, fiscal_year)
  - Comparison support (flag, type, dates)
  - Detail level control (SUMMARY/DETAIL, zero balances)

The next document will create the BaseReportGenerator abstract class and ReportResult model for report generation and caching.
