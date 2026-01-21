# Group E: Cash Flow & General Ledger

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 11 - Financial Reports  
> **Group:** E of F  
> **Tasks Covered:** 65-80  
> **Group Goal:** Implement Cash Flow Statement and General Ledger report generators

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-D_Balance-Sheet](../Group-D_Balance-Sheet/)
- **→ Next Group:** [Group-F_Export-Testing-Documentation](../Group-F_Export-Testing-Documentation/)

---

## Group Overview

This group implements two essential reports: the Cash Flow Statement showing cash movements categorized by operating, investing, and financing activities, and the General Ledger report providing detailed transaction listings for accounts. Cash Flow calculates net cash change and reconciles beginning to ending cash balances. General Ledger supports account filtering and running balance calculations.

### Key Outcomes

- CashFlowGenerator extending BaseReportGenerator
- Operating activities calculation (indirect method)
- Investing activities calculation
- Financing activities calculation
- Net cash change calculation
- Beginning and ending cash balance tracking
- Cash Flow HTML template and API endpoint
- GeneralLedgerGenerator for transaction detail
- Account range filtering
- Transaction fetch with journal entry details
- Running balance calculation per account
- General Ledger data structure
- GL HTML template and API endpoint

### Technology Context

- **Cash Flow:** Indirect method (adjust net income)
- **Activities:** Three-section categorization
- **GL Detail:** Transaction-level drill-down
- **Filtering:** Account code range and date range

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-65-73_CashFlow-Generator.md` | Create CashFlowGenerator with all activity sections | 65-73 |
| 02 | `02_Tasks-74-80_GeneralLedger-Generator.md` | Create GeneralLedgerGenerator with filtering and running balance | 74-80 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 65 | Create CashFlowGenerator | High | Task 64 |
| 66 | Add Operating Activities Calc | High | Task 65 |
| 67 | Add Investing Activities Calc | Medium | Task 66 |
| 68 | Add Financing Activities Calc | Medium | Task 67 |
| 69 | Add Net Cash Change Calc | Low | Task 68 |
| 70 | Add Beginning Cash Balance | Low | Task 69 |
| 71 | Add Ending Cash Balance | Low | Task 70 |
| 72 | Create CF HTML Template | Medium | Task 71 |
| 73 | Create CF API Endpoint | Low | Task 72 |
| 74 | Create GeneralLedgerGenerator | Medium | Task 73 |
| 75 | Add Account Filter Method | Low | Task 74 |
| 76 | Add Get Transactions Method | Medium | Task 75 |
| 77 | Add Running Balance Calc | Medium | Task 76 |
| 78 | Create GL Data Structure | Medium | Task 77 |
| 79 | Create GL HTML Template | Medium | Task 78 |
| 80 | Create GL API Endpoint | Low | Task 79 |

---

## Execution Order

```
Task 65: Create CashFlowGenerator
    │
    ▼
Task 66: Operating Activities Calc
    │
    ▼
Task 67: Investing Activities Calc
    │
    ▼
Task 68: Financing Activities Calc
    │
    ▼
Task 69: Net Cash Change Calc
    │
    ▼
Task 70: Beginning Cash Balance
    │
    ▼
Task 71: Ending Cash Balance
    │
    ▼
Task 72: CF HTML Template
    │
    ▼
Task 73: CF API Endpoint
    │
    ▼
Task 74: Create GeneralLedgerGenerator
    │
    ▼
Task 75: Account Filter Method
    │
    ▼
Task 76: Get Transactions Method
    │
    ▼
Task 77: Running Balance Calc
    │
    ▼
Task 78: GL Data Structure
    │
    ▼
Task 79: GL HTML Template
    │
    ▼
Task 80: GL API Endpoint
```

---

## Expected Deliverables

```
apps/accounting/
├── reports/
│   ├── __init__.py
│   ├── cash_flow.py           # CashFlowGenerator
│   └── general_ledger.py      # GeneralLedgerGenerator
├── templates/
│   └── reports/
│       ├── cash_flow.html     # Cash Flow template
│       └── general_ledger.html # GL template
├── views/
│   └── reports.py             # Add CF and GL endpoints
└── tests/
    ├── test_cash_flow.py      # Cash Flow tests
    └── test_general_ledger.py # GL tests
```

---

## Notes for AI Agents

### Cash Flow Statement Structure (Indirect Method)
```
CASH FLOWS FROM OPERATING ACTIVITIES
  Net Income                                    XX,XXX
  Adjustments for:
    Depreciation                                 X,XXX
    (Increase)/Decrease in Accounts Receivable  (X,XXX)
    (Increase)/Decrease in Inventory            (X,XXX)
    Increase/(Decrease) in Accounts Payable      X,XXX
    Increase/(Decrease) in Other Payables        X,XXX
  NET CASH FROM OPERATING ACTIVITIES            XX,XXX

CASH FLOWS FROM INVESTING ACTIVITIES
  Purchase of Property & Equipment             (XX,XXX)
  Sale of Investments                            X,XXX
  NET CASH FROM INVESTING ACTIVITIES           (XX,XXX)

CASH FLOWS FROM FINANCING ACTIVITIES
  Loan Proceeds                                 XX,XXX
  Loan Repayments                              (X,XXX)
  Owner Drawings                               (X,XXX)
  NET CASH FROM FINANCING ACTIVITIES            XX,XXX

NET INCREASE/(DECREASE) IN CASH                 XX,XXX

BEGINNING CASH BALANCE                          XX,XXX
ENDING CASH BALANCE                             XX,XXX
```

### Operating Activities (Indirect Method)
Start with Net Income, adjust for:
- Non-cash items (depreciation, amortization)
- Changes in working capital:
  - Receivables increase = cash decrease
  - Inventory increase = cash decrease
  - Payables increase = cash increase

### General Ledger Structure
```
ACCOUNT: 1100 - Cash on Hand
Period: 01/01/2026 to 31/01/2026

Date       | Entry # | Description           | Debit    | Credit   | Balance
-----------|---------|----------------------|----------|----------|----------
           |         | Opening Balance      |          |          |   10,000
01/15/2026 | JE-0001 | Sales Invoice #101   |    5,000 |          |   15,000
01/20/2026 | JE-0005 | Supplier Payment     |          |    3,000 |   12,000
01/25/2026 | JE-0008 | Cash Deposit         |    2,000 |          |   14,000
           |         | TOTALS               |    7,000 |    3,000 |
           |         | Closing Balance      |          |          |   14,000
```

### GL Filtering Options
- account_code: Single account
- account_from, account_to: Range of accounts
- start_date, end_date: Transaction date range
- include_opening: Include opening balance row

### Running Balance Calculation
For each transaction in chronological order:
1. Start with opening balance
2. Add debits for DEBIT-normal accounts
3. Subtract credits for DEBIT-normal accounts
4. Reverse for CREDIT-normal accounts
