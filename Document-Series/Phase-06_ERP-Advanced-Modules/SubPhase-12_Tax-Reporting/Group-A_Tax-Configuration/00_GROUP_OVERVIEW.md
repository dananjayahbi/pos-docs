# Group A: Tax Configuration

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 12 - Tax Reporting  
> **Group:** A of F  
> **Tasks Covered:** 01-16  
> **Group Goal:** Create tax reporting module with configuration model and period tracking

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** None (First Group)
- **→ Next Group:** [Group-B_VAT-Return](../Group-B_VAT-Return/)

---

## Group Overview

This group establishes the foundational infrastructure for Sri Lanka tax reporting. Creates the tax module with enumerations for tax types, periods, and filing statuses. Implements the TaxConfiguration model for storing tenant-specific tax registration details (VAT, EPF, ETF, TIN) and the TaxPeriodRecord model for tracking filing periods and deadlines.

### Key Outcomes

- Tax reporting module created under accounting app
- TaxType enum (VAT, PAYE, EPF, ETF, WHT)
- TaxPeriod enum (MONTHLY, QUARTERLY, ANNUAL)
- FilingStatus enum (PENDING, GENERATED, FILED, ACCEPTED)
- TaxConfiguration model for tenant settings
- VAT registration number field
- SVAT registration status
- EPF registration number
- ETF registration number
- Employer TIN (Tax Identification Number)
- VAT filing frequency configuration
- TaxPeriodRecord model for period tracking
- Period date range (start, end, due date)
- Period filing status

### Technology Context

- **Compliance:** Sri Lanka Inland Revenue Department formats
- **Multi-tenant:** Per-tenant tax configuration
- **Scheduling:** Period-based filing deadlines
- **Status Tracking:** Full filing lifecycle

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-01-08_Tax-Module-Enums-Config.md` | Create tax module, enums, and TaxConfiguration model | 01-08 |
| 02 | `02_Tasks-09-16_TaxConfig-TaxPeriod.md` | Complete TaxConfiguration fields and TaxPeriodRecord model | 09-16 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 01 | Create tax Module | Low | None |
| 02 | Define TaxType Enum | Low | Task 01 |
| 03 | Define TaxPeriod Enum | Low | Task 02 |
| 04 | Define FilingStatus Enum | Low | Task 03 |
| 05 | Create TaxConfiguration Model | Medium | Task 04 |
| 06 | Add VAT Registration Number | Low | Task 05 |
| 07 | Add SVAT Status | Low | Task 05 |
| 08 | Add EPF Registration | Low | Task 05 |
| 09 | Add ETF Registration | Low | Task 05 |
| 10 | Add Employer TIN | Low | Task 05 |
| 11 | Add VAT Filing Frequency | Low | Task 05 |
| 12 | Run TaxConfig Migrations | Low | Task 11 |
| 13 | Create TaxPeriodRecord Model | Medium | Task 12 |
| 14 | Add Period Date Range | Low | Task 13 |
| 15 | Add Period Status | Low | Task 13 |
| 16 | Run TaxPeriod Migrations | Low | Task 15 |

---

## Execution Order

```
Task 01: Create tax Module
    │
    ▼
Task 02: Define TaxType Enum
    │
    ▼
Task 03: Define TaxPeriod Enum
    │
    ▼
Task 04: Define FilingStatus Enum
    │
    ▼
Task 05: Create TaxConfiguration Model (base)
    │
    ├─────────────────────────────────────────────┐
    ▼                                             ▼
Tasks 06-10: Registration Fields          Task 11: Filing Frequency
(VAT, SVAT, EPF, ETF, TIN)
    │                                             │
    └─────────────────────┬───────────────────────┘
                          ▼
                     Task 12: Run TaxConfig Migrations
                          │
                          ▼
                     Task 13: Create TaxPeriodRecord Model
                          │
                          ├──────────────┐
                          ▼              ▼
                     Task 14        Task 15
                     (date range)   (status)
                          │              │
                          └──────┬───────┘
                                 ▼
                            Task 16: Run TaxPeriod Migrations
```

---

## Expected Deliverables

```
apps/accounting/
├── tax/
│   ├── __init__.py
│   └── enums.py               # TaxType, TaxPeriod, FilingStatus
├── models/
│   ├── __init__.py
│   ├── tax_configuration.py   # TaxConfiguration model
│   └── tax_period.py          # TaxPeriodRecord model
└── migrations/
    └── 0018_taxconfiguration_taxperiodrecord.py
```

---

## Notes for AI Agents

### Sri Lanka Tax Registration Numbers

| Registration | Format | Authority |
|--------------|--------|-----------|
| VAT Number | XXXXXXXXX-7000 | Inland Revenue |
| TIN | XXXXXXXXX | Inland Revenue |
| EPF Number | E/XXXXXX | Central Bank of SL |
| ETF Number | XXXXXX | ETF Board |

### TaxType Enum Values
- VAT: Value Added Tax (8%)
- PAYE: Pay As You Earn (income tax)
- EPF: Employees' Provident Fund (20% total)
- ETF: Employees' Trust Fund (3%)
- WHT: Withholding Tax (various rates)

### TaxPeriod Enum Values
- MONTHLY: Most taxes (VAT, PAYE, EPF)
- QUARTERLY: Quarterly VAT filers
- ANNUAL: Annual returns and summaries

### FilingStatus Lifecycle
```
PENDING → GENERATED → FILED → ACCEPTED
                          ↓
                      REJECTED (if issues)
```

### TaxConfiguration Fields
- vat_registration_no: VAT number
- is_svat_registered: Boolean for Simplified VAT
- epf_registration_no: EPF number
- etf_registration_no: ETF number
- tin_number: Employer TIN
- vat_filing_period: MONTHLY or QUARTERLY

### TaxPeriodRecord Purpose
Tracks each tax period:
- Which tax type (VAT, PAYE, EPF, ETF)
- Period dates (start_date, end_date)
- Due date for filing
- Current filing status
- Reference to generated return (if any)
