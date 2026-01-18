# SubPhase 11: Financial Reports - Tasks Summary

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase Index:** 11 of 14  
> **SubPhase Goal:** Generate standard financial statements and reports  
> **Total Tasks:** 92 | **Status:** Planning  
> **Estimated Duration:** 14-16 hours

---

## Navigation

- **↑ Parent:** [00_SUBPHASES_SUMMARY.md](../00_SUBPHASES_SUMMARY.md)
- **← Previous SubPhase:** [SubPhase-10_Account-Reconciliation](../SubPhase-10_Account-Reconciliation/)
- **→ Next SubPhase:** [SubPhase-12_Tax-Reporting](../SubPhase-12_Tax-Reporting/)

---

## SubPhase Overview

This sub-phase implements comprehensive financial reporting capabilities. Generates standard financial statements including Profit & Loss, Balance Sheet, Cash Flow Statement, and Trial Balance. Includes comparative periods, date range selection, PDF/Excel export, and transaction drill-down.

### Key Outcomes
- Trial Balance report
- Profit & Loss Statement (Income Statement)
- Balance Sheet (Statement of Financial Position)
- Cash Flow Statement
- General Ledger report
- Comparative period analysis
- Date range selection
- PDF and Excel export
- Drill-down to transactions
- Report scheduling

### Technology Context
- **Backend:** Django 5.x with DRF for API
- **Report Generation:** WeasyPrint (PDF), openpyxl (Excel)
- **Data:** Aggregated from journal entries
- **Frontend:** Next.js 14+ with TypeScript
- **Charts:** Chart.js or Recharts for visualizations

### Dependencies
- Phase-06 SubPhase-08: Chart of Accounts
- Phase-06 SubPhase-09: Journal Entries

---

## Task Execution Order

```
TASK GROUP A: Report Framework (Tasks 01-16)
        │
        ▼
TASK GROUP B: Trial Balance Report (Tasks 17-30)
        │
        ▼
TASK GROUP C: Profit & Loss Statement (Tasks 31-48)
        │
        ▼
TASK GROUP D: Balance Sheet (Tasks 49-64)
        │
        ▼
TASK GROUP E: Cash Flow & General Ledger (Tasks 65-80)
        │
        ▼
TASK GROUP F: Export, Testing & Documentation (Tasks 81-92)
```

---

## Task Index

### Group A: Report Framework (Tasks 01-16)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 01 | **Create reports Module** | Add reports module to accounting app | None | 🔴 Not Created |
| 02 | **Define ReportType Enum** | Create: TRIAL_BALANCE, PL, BALANCE_SHEET, CASH_FLOW, GL | Task 01 | 🔴 Not Created |
| 03 | **Define ReportPeriod Enum** | Create: MONTHLY, QUARTERLY, YEARLY, CUSTOM | Task 02 | 🔴 Not Created |
| 04 | **Create ReportConfig Model** | Report configuration settings | Task 03 | 🔴 Not Created |
| 05 | **Add Config Date Fields** | Add start_date, end_date, as_of_date | Task 04 | 🔴 Not Created |
| 06 | **Add Config Comparison Flag** | Add include_comparison boolean | Task 04 | 🔴 Not Created |
| 07 | **Add Config Prior Period** | Add comparison_start, comparison_end | Task 04 | 🔴 Not Created |
| 08 | **Add Config Detail Level** | Add detail_level (SUMMARY, DETAIL) | Task 04 | 🔴 Not Created |
| 09 | **Create BaseReportGenerator** | Abstract base class for reports | Task 08 | 🔴 Not Created |
| 10 | **Add Generate Method** | Abstract generate() method | Task 09 | 🔴 Not Created |
| 11 | **Add Get Data Method** | Abstract get_data() method | Task 09 | 🔴 Not Created |
| 12 | **Add Format Method** | Abstract format_output() method | Task 09 | 🔴 Not Created |
| 13 | **Create ReportResult Model** | Store generated reports | Task 12 | 🔴 Not Created |
| 14 | **Add Result Data Fields** | Add report_data JSONField | Task 13 | 🔴 Not Created |
| 15 | **Add Result Metadata** | Add generated_at, generated_by | Task 13 | 🔴 Not Created |
| 16 | **Run Report Migrations** | Generate and apply migrations | Task 15 | 🔴 Not Created |

---

### Group B: Trial Balance Report (Tasks 17-30)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 17 | **Create TrialBalanceGenerator** | Trial balance report generator | Task 16 | 🔴 Not Created |
| 18 | **Add Get All Accounts Method** | Fetch all active accounts | Task 17 | 🔴 Not Created |
| 19 | **Add Calculate Balance Method** | Sum debits/credits per account | Task 18 | 🔴 Not Created |
| 20 | **Add Opening Balance Calc** | Calculate opening balance | Task 19 | 🔴 Not Created |
| 21 | **Add Period Movement Calc** | Calculate period debits/credits | Task 20 | 🔴 Not Created |
| 22 | **Add Closing Balance Calc** | Calculate closing balance | Task 21 | 🔴 Not Created |
| 23 | **Add Account Type Grouping** | Group by account type | Task 22 | 🔴 Not Created |
| 24 | **Add Totals Validation** | Validate debits = credits | Task 23 | 🔴 Not Created |
| 25 | **Create TB Data Structure** | Define output JSON structure | Task 24 | 🔴 Not Created |
| 26 | **Add TB Comparison Mode** | Add prior period comparison | Task 25 | 🔴 Not Created |
| 27 | **Add TB Variance Calc** | Calculate variance amounts/% | Task 26 | 🔴 Not Created |
| 28 | **Create TB HTML Template** | HTML template for TB report | Task 27 | 🔴 Not Created |
| 29 | **Create TB PDF Generator** | Generate PDF from template | Task 28 | 🔴 Not Created |
| 30 | **Create TB API Endpoint** | GET /reports/trial-balance/ | Task 29 | 🔴 Not Created |

---

### Group C: Profit & Loss Statement (Tasks 31-48)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 31 | **Create PLGenerator** | Profit & Loss report generator | Task 30 | 🔴 Not Created |
| 32 | **Add Get Revenue Accounts** | Fetch revenue accounts (4xxx) | Task 31 | 🔴 Not Created |
| 33 | **Add Get Expense Accounts** | Fetch expense accounts (5xxx) | Task 31 | 🔴 Not Created |
| 34 | **Add Calculate Revenue Total** | Sum revenue account balances | Task 32 | 🔴 Not Created |
| 35 | **Add Calculate COGS** | Sum cost of goods sold | Task 33 | 🔴 Not Created |
| 36 | **Add Calculate Gross Profit** | Revenue - COGS | Task 35 | 🔴 Not Created |
| 37 | **Add Calculate Operating Expenses** | Sum operating expenses | Task 36 | 🔴 Not Created |
| 38 | **Add Calculate Operating Income** | Gross Profit - OpEx | Task 37 | 🔴 Not Created |
| 39 | **Add Calculate Other Income** | Interest, other income | Task 38 | 🔴 Not Created |
| 40 | **Add Calculate Other Expenses** | Interest expense, other | Task 39 | 🔴 Not Created |
| 41 | **Add Calculate Net Income** | Final net profit/loss | Task 40 | 🔴 Not Created |
| 42 | **Create PL Data Structure** | Define output JSON structure | Task 41 | 🔴 Not Created |
| 43 | **Add PL Comparison Mode** | Prior period comparison | Task 42 | 🔴 Not Created |
| 44 | **Add PL Variance Calc** | Calculate changes | Task 43 | 🔴 Not Created |
| 45 | **Add PL Percentage of Revenue** | Calculate % of revenue | Task 44 | 🔴 Not Created |
| 46 | **Create PL HTML Template** | HTML template for P&L | Task 45 | 🔴 Not Created |
| 47 | **Create PL PDF Generator** | Generate PDF | Task 46 | 🔴 Not Created |
| 48 | **Create PL API Endpoint** | GET /reports/profit-loss/ | Task 47 | 🔴 Not Created |

---

### Group D: Balance Sheet (Tasks 49-64)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 49 | **Create BalanceSheetGenerator** | Balance sheet report generator | Task 48 | 🔴 Not Created |
| 50 | **Add Get Asset Accounts** | Fetch asset accounts (1xxx) | Task 49 | 🔴 Not Created |
| 51 | **Add Get Liability Accounts** | Fetch liability accounts (2xxx) | Task 49 | 🔴 Not Created |
| 52 | **Add Get Equity Accounts** | Fetch equity accounts (3xxx) | Task 49 | 🔴 Not Created |
| 53 | **Add Calculate Current Assets** | Sum current assets | Task 50 | 🔴 Not Created |
| 54 | **Add Calculate Fixed Assets** | Sum fixed assets (net) | Task 50 | 🔴 Not Created |
| 55 | **Add Calculate Total Assets** | Sum all assets | Task 54 | 🔴 Not Created |
| 56 | **Add Calculate Current Liabilities** | Sum current liabilities | Task 51 | 🔴 Not Created |
| 57 | **Add Calculate Long-Term Liabilities** | Sum long-term liabilities | Task 51 | 🔴 Not Created |
| 58 | **Add Calculate Total Liabilities** | Sum all liabilities | Task 57 | 🔴 Not Created |
| 59 | **Add Calculate Retained Earnings** | Cumulative net income | Task 52 | 🔴 Not Created |
| 60 | **Add Calculate Total Equity** | Sum equity accounts | Task 59 | 🔴 Not Created |
| 61 | **Add Balance Validation** | Verify A = L + E | Task 60 | 🔴 Not Created |
| 62 | **Create BS Data Structure** | Define output JSON structure | Task 61 | 🔴 Not Created |
| 63 | **Create BS HTML Template** | HTML template for BS | Task 62 | 🔴 Not Created |
| 64 | **Create BS API Endpoint** | GET /reports/balance-sheet/ | Task 63 | 🔴 Not Created |

---

### Group E: Cash Flow & General Ledger (Tasks 65-80)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 65 | **Create CashFlowGenerator** | Cash flow statement generator | Task 64 | 🔴 Not Created |
| 66 | **Add Operating Activities Calc** | Calculate operating cash flow | Task 65 | 🔴 Not Created |
| 67 | **Add Investing Activities Calc** | Calculate investing cash flow | Task 66 | 🔴 Not Created |
| 68 | **Add Financing Activities Calc** | Calculate financing cash flow | Task 67 | 🔴 Not Created |
| 69 | **Add Net Cash Change Calc** | Sum all activities | Task 68 | 🔴 Not Created |
| 70 | **Add Beginning Cash Balance** | Get opening cash balance | Task 69 | 🔴 Not Created |
| 71 | **Add Ending Cash Balance** | Calculate closing cash | Task 70 | 🔴 Not Created |
| 72 | **Create CF HTML Template** | HTML template for CF | Task 71 | 🔴 Not Created |
| 73 | **Create CF API Endpoint** | GET /reports/cash-flow/ | Task 72 | 🔴 Not Created |
| 74 | **Create GeneralLedgerGenerator** | GL report generator | Task 73 | 🔴 Not Created |
| 75 | **Add Account Filter Method** | Filter by account/range | Task 74 | 🔴 Not Created |
| 76 | **Add Get Transactions Method** | Fetch journal entries | Task 75 | 🔴 Not Created |
| 77 | **Add Running Balance Calc** | Calculate running balance | Task 76 | 🔴 Not Created |
| 78 | **Create GL Data Structure** | Define output JSON structure | Task 77 | 🔴 Not Created |
| 79 | **Create GL HTML Template** | HTML template for GL | Task 78 | 🔴 Not Created |
| 80 | **Create GL API Endpoint** | GET /reports/general-ledger/ | Task 79 | 🔴 Not Created |

---

### Group F: Export, Testing & Documentation (Tasks 81-92)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 81 | **Install openpyxl** | Add openpyxl for Excel export | Task 80 | 🔴 Not Created |
| 82 | **Create Excel Exporter Base** | Base class for Excel export | Task 81 | 🔴 Not Created |
| 83 | **Add TB Excel Export** | Trial Balance to Excel | Task 82 | 🔴 Not Created |
| 84 | **Add PL Excel Export** | P&L to Excel | Task 83 | 🔴 Not Created |
| 85 | **Add BS Excel Export** | Balance Sheet to Excel | Task 84 | 🔴 Not Created |
| 86 | **Add GL Excel Export** | General Ledger to Excel | Task 85 | 🔴 Not Created |
| 87 | **Create Report Scheduler** | Celery task for scheduled reports | Task 86 | 🔴 Not Created |
| 88 | **Add Email Report Method** | Email generated reports | Task 87 | 🔴 Not Created |
| 89 | **Create Report ViewSet** | API ViewSet for all reports | Task 88 | 🔴 Not Created |
| 90 | **Add Report URL Routes** | Register routes in urls.py | Task 89 | 🔴 Not Created |
| 91 | **Write Report Generator Tests** | Unit tests for generators | Task 90 | 🔴 Not Created |
| 92 | **Create Report API Documentation** | Document all endpoints | Task 91 | 🔴 Not Created |

---

## Expected File Structure

```
apps/accounting/
├── reports/
│   ├── __init__.py
│   ├── base.py                 # BaseReportGenerator
│   ├── trial_balance.py        # TrialBalanceGenerator
│   ├── profit_loss.py          # PLGenerator
│   ├── balance_sheet.py        # BalanceSheetGenerator
│   ├── cash_flow.py            # CashFlowGenerator
│   ├── general_ledger.py       # GeneralLedgerGenerator
│   └── exporters/
│       ├── __init__.py
│       ├── pdf_exporter.py     # PDF export utility
│       └── excel_exporter.py   # Excel export utility
├── templates/
│   └── reports/
│       ├── trial_balance.html
│       ├── profit_loss.html
│       ├── balance_sheet.html
│       ├── cash_flow.html
│       └── general_ledger.html
├── models/
│   └── report_config.py        # Report configuration model
├── serializers/
│   └── report.py               # Report serializers
├── views/
│   └── reports.py              # Report ViewSet
├── tasks.py                    # Scheduled report tasks
├── tests/
│   ├── test_trial_balance.py
│   ├── test_profit_loss.py
│   ├── test_balance_sheet.py
│   └── test_exporters.py
└── migrations/

frontend/src/app/(dashboard)/accounting/
├── reports/
│   ├── page.tsx                # Report selection
│   ├── trial-balance/
│   │   └── page.tsx            # Trial Balance
│   ├── profit-loss/
│   │   └── page.tsx            # P&L Statement
│   ├── balance-sheet/
│   │   └── page.tsx            # Balance Sheet
│   ├── cash-flow/
│   │   └── page.tsx            # Cash Flow
│   └── general-ledger/
│       └── page.tsx            # General Ledger
├── components/
│   ├── ReportHeader.tsx        # Report header with dates
│   ├── ReportFilters.tsx       # Date range, comparison
│   ├── ReportTable.tsx         # Generic report table
│   ├── DrillDownModal.tsx      # Transaction drill-down
│   └── ExportButtons.tsx       # PDF/Excel export
└── hooks/
    └── useReports.ts
```

---

## Progress Tracking

| Group | Tasks | Completed | Percentage |
|-------|-------|-----------|------------|
| Group A: Report Framework | 16 | 0 | 0% |
| Group B: Trial Balance Report | 14 | 0 | 0% |
| Group C: Profit & Loss Statement | 18 | 0 | 0% |
| Group D: Balance Sheet | 16 | 0 | 0% |
| Group E: Cash Flow & General Ledger | 16 | 0 | 0% |
| Group F: Export, Testing & Documentation | 12 | 0 | 0% |
| **TOTAL** | **92** | **0** | **0%** |

---

## Notes for AI Agents

### Critical Implementation Details

1. **Report Date Logic:**
   - Trial Balance: As of date (point in time)
   - P&L: Date range (period activity)
   - Balance Sheet: As of date (point in time)
   - Cash Flow: Date range (period activity)
   - General Ledger: Date range (transactions)

2. **Account Balance Calculation:**
   - For balance sheet accounts (1xxx, 2xxx, 3xxx): Cumulative balance
   - For income statement (4xxx, 5xxx): Period activity only

3. **Retained Earnings:**
   - Balance Sheet must include current period net income
   - RE = Prior RE + Current Period Net Income

4. **Comparison Mode:**
   - Prior Period: Same length period before current
   - Prior Year: Same period last year
   - Variance: Amount and percentage change

5. **Drill-Down:**
   - Click account → Show transactions
   - Include journal entry number, date, description

### Report Structures

**Trial Balance:**
```
Account | Opening Dr | Opening Cr | Period Dr | Period Cr | Closing Dr | Closing Cr
--------|------------|------------|-----------|-----------|------------|----------
1100    |     X,XXX  |            |    XXX    |    XXX    |     X,XXX  |
```

**Profit & Loss:**
```
REVENUE
  Sales Revenue                    XXX,XXX
  Service Revenue                   XX,XXX
  Total Revenue                   XXX,XXX

COST OF GOODS SOLD
  Purchases                        XX,XXX
  Total COGS                       XX,XXX

GROSS PROFIT                      XXX,XXX

OPERATING EXPENSES
  Salaries                         XX,XXX
  Rent                              X,XXX
  Utilities                         X,XXX
  Total Operating Expenses         XX,XXX

OPERATING INCOME                   XX,XXX

NET INCOME                         XX,XXX
```

**Balance Sheet:**
```
ASSETS
  Current Assets
    Cash                           XX,XXX
    Accounts Receivable            XX,XXX
    Inventory                      XX,XXX
    Total Current Assets          XXX,XXX
  Fixed Assets
    Equipment                      XX,XXX
    Less: Accumulated Depr        (X,XXX)
    Net Fixed Assets               XX,XXX
  TOTAL ASSETS                    XXX,XXX

LIABILITIES
  Current Liabilities
    Accounts Payable               XX,XXX
    EPF/ETF Payable                 X,XXX
    Total Current Liabilities      XX,XXX
  TOTAL LIABILITIES                XX,XXX

EQUITY
  Owner's Equity                   XX,XXX
  Retained Earnings                XX,XXX
  TOTAL EQUITY                     XX,XXX

TOTAL LIABILITIES & EQUITY        XXX,XXX
```

### Sri Lanka Specific

1. **Currency Format:**
   - LKR 1,234,567.89
   - Negative in parentheses: (LKR 1,234.56)

2. **Fiscal Year:**
   - Calendar year (Jan-Dec) most common
   - Some use Apr-Mar (government fiscal year)
   - Configurable per tenant

3. **Statutory Requirements:**
   - Annual financial statements required
   - Companies Act compliance
   - SLFRS (Sri Lanka Financial Reporting Standards)

### Export Formats

1. **PDF:**
   - Professional letterhead
   - Company logo
   - Digital signature option
   - Print-ready A4 format

2. **Excel:**
   - Raw data for analysis
   - Formatted with headers
   - Formulas preserved where applicable
   - Multiple sheets for comparison

---

## Completion Checklist

- [ ] Report framework with base generator
- [ ] ReportConfig model
- [ ] Trial Balance generator
- [ ] Profit & Loss generator
- [ ] Balance Sheet generator
- [ ] Cash Flow generator
- [ ] General Ledger generator
- [ ] Comparison period logic
- [ ] Variance calculations
- [ ] HTML templates for all reports
- [ ] PDF export (WeasyPrint)
- [ ] Excel export (openpyxl)
- [ ] Report scheduling (Celery)
- [ ] Email delivery
- [ ] DRF ViewSet and endpoints
- [ ] Unit tests for all generators
- [ ] API documentation
