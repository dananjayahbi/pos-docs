# Group A: Report Framework

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 11 - Financial Reports  
> **Group:** A of F  
> **Tasks Covered:** 01-16  
> **Group Goal:** Create foundational report framework with configuration model and abstract base generator class

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** None (First Group)
- **→ Next Group:** [Group-B_Trial-Balance-Report](../Group-B_Trial-Balance-Report/)

---

## Group Overview

This group establishes the foundational framework for all financial reports. Creates enumerations for report types and periods, the ReportConfig model for storing report parameters, and the abstract BaseReportGenerator class that defines the common interface for all report generators. Also includes the ReportResult model for caching generated reports.

### Key Outcomes

- Reports module added to accounting app
- ReportType enum (TRIAL_BALANCE, PL, BALANCE_SHEET, CASH_FLOW, GL)
- ReportPeriod enum (MONTHLY, QUARTERLY, YEARLY, CUSTOM)
- ReportConfig model for report parameters
- Date range configuration (start_date, end_date, as_of_date)
- Comparison period support
- Detail level configuration (SUMMARY, DETAIL)
- BaseReportGenerator abstract class
- Abstract generate(), get_data(), format_output() methods
- ReportResult model for storing generated reports
- Report data JSONField and metadata

### Technology Context

- **Pattern:** Abstract Factory for report generators
- **Storage:** JSONField for flexible report data
- **Configuration:** Model-based report parameters
- **Caching:** ReportResult for generated report storage

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-01-08_Reports-Module-Config.md` | Create reports module, enums, and ReportConfig model | 01-08 |
| 02 | `02_Tasks-09-16_BaseGenerator-ReportResult.md` | Create BaseReportGenerator and ReportResult model | 09-16 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 01 | Create reports Module | Low | None |
| 02 | Define ReportType Enum | Low | Task 01 |
| 03 | Define ReportPeriod Enum | Low | Task 02 |
| 04 | Create ReportConfig Model | Medium | Task 03 |
| 05 | Add Config Date Fields | Low | Task 04 |
| 06 | Add Config Comparison Flag | Low | Task 04 |
| 07 | Add Config Prior Period | Low | Task 04 |
| 08 | Add Config Detail Level | Low | Task 04 |
| 09 | Create BaseReportGenerator | High | Task 08 |
| 10 | Add Generate Method | Medium | Task 09 |
| 11 | Add Get Data Method | Medium | Task 09 |
| 12 | Add Format Method | Medium | Task 09 |
| 13 | Create ReportResult Model | Medium | Task 12 |
| 14 | Add Result Data Fields | Low | Task 13 |
| 15 | Add Result Metadata | Low | Task 13 |
| 16 | Run Report Migrations | Low | Task 15 |

---

## Execution Order

```
Task 01: Create reports Module
    │
    ▼
Task 02: Define ReportType Enum
    │
    ▼
Task 03: Define ReportPeriod Enum
    │
    ▼
Task 04: Create ReportConfig Model (base)
    │
    ├─────────────────────────────────────────┐
    ▼                                         ▼
Tasks 05-07: Date Fields              Task 08: Detail Level
(start, end, comparison)
    │                                         │
    └─────────────────────┬───────────────────┘
                          ▼
                     Task 09: Create BaseReportGenerator
                          │
                          ├─────────────────────────────┐
                          ▼                             ▼
                     Tasks 10-12: Abstract Methods
                     (generate, get_data, format)
                          │
                          ▼
                     Task 13: Create ReportResult Model
                          │
                          ├──────────────┐
                          ▼              ▼
                     Task 14        Task 15
                     (data fields)  (metadata)
                          │              │
                          └──────┬───────┘
                                 ▼
                            Task 16: Run Migrations
```

---

## Expected Deliverables

```
apps/accounting/
├── reports/
│   ├── __init__.py
│   ├── enums.py              # ReportType, ReportPeriod enums
│   └── base.py               # BaseReportGenerator class
├── models/
│   ├── __init__.py
│   ├── report_config.py      # ReportConfig model
│   └── report_result.py      # ReportResult model
└── migrations/
    └── 0017_reportconfig_reportresult.py
```

---

## Notes for AI Agents

### Report Type Definitions
- TRIAL_BALANCE: Summary of all account balances
- PL: Profit & Loss / Income Statement
- BALANCE_SHEET: Statement of Financial Position
- CASH_FLOW: Statement of Cash Flows
- GL: General Ledger detail

### Report Period Types
- MONTHLY: Single month
- QUARTERLY: Three-month period (Q1-Q4)
- YEARLY: Full fiscal year
- CUSTOM: User-defined date range

### ReportConfig Fields
- report_type: Type of report
- period_type: Period selection
- start_date: Period start (for range reports)
- end_date: Period end (for range reports)
- as_of_date: Point-in-time date (for BS, TB)
- include_comparison: Boolean for prior period
- comparison_start: Prior period start
- comparison_end: Prior period end
- detail_level: SUMMARY or DETAIL

### BaseReportGenerator Interface
```
BaseReportGenerator (abstract):
├── config: ReportConfig
├── generate() → ReportResult
├── get_data() → dict (abstract)
├── format_output(data) → dict (abstract)
├── validate_config() → bool
└── calculate_comparison() → dict
```

### ReportResult Caching
Store generated reports for:
- Quick re-access without regeneration
- Audit trail of generated reports
- Performance optimization
- Historical comparison
