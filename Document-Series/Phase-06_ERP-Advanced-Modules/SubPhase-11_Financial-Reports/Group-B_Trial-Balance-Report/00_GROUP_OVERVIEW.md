# Group B: Trial Balance Report

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 11 - Financial Reports  
> **Group:** B of F  
> **Tasks Covered:** 17-30  
> **Group Goal:** Implement Trial Balance report generator with opening, period, and closing balances

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-A_Report-Framework](../Group-A_Report-Framework/)
- **→ Next Group:** [Group-C_Profit-Loss-Statement](../Group-C_Profit-Loss-Statement/)

---

## Group Overview

This group implements the Trial Balance report, the foundational accounting report that lists all accounts with their debit and credit balances. Includes calculation of opening balances, period movements (debits/credits), and closing balances. Supports comparison mode with prior period variance calculations. Generates HTML template for display and PDF export via API endpoint.

### Key Outcomes

- TrialBalanceGenerator extending BaseReportGenerator
- Get all active accounts method
- Balance calculation for each account
- Opening balance calculation from prior periods
- Period movement calculation (debits and credits)
- Closing balance calculation
- Account type grouping (Assets, Liabilities, etc.)
- Total validation (debits must equal credits)
- Trial Balance output data structure
- Prior period comparison mode
- Variance calculation (amount and percentage)
- HTML template for TB report
- PDF generator using WeasyPrint
- API endpoint GET /reports/trial-balance/

### Technology Context

- **Calculations:** Aggregate journal entry lines
- **Grouping:** MPTT tree traversal for hierarchy
- **PDF:** WeasyPrint for professional output
- **Validation:** Double-entry integrity check

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-17-24_TrialBalance-Calculations.md` | Create generator with balance calculations and grouping | 17-24 |
| 02 | `02_Tasks-25-30_TB-Comparison-Output.md` | Add data structure, comparison mode, template, and API | 25-30 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 17 | Create TrialBalanceGenerator | Medium | Task 16 |
| 18 | Add Get All Accounts Method | Low | Task 17 |
| 19 | Add Calculate Balance Method | Medium | Task 18 |
| 20 | Add Opening Balance Calc | Medium | Task 19 |
| 21 | Add Period Movement Calc | Medium | Task 20 |
| 22 | Add Closing Balance Calc | Low | Task 21 |
| 23 | Add Account Type Grouping | Medium | Task 22 |
| 24 | Add Totals Validation | Low | Task 23 |
| 25 | Create TB Data Structure | Medium | Task 24 |
| 26 | Add TB Comparison Mode | Medium | Task 25 |
| 27 | Add TB Variance Calc | Low | Task 26 |
| 28 | Create TB HTML Template | Medium | Task 27 |
| 29 | Create TB PDF Generator | Medium | Task 28 |
| 30 | Create TB API Endpoint | Low | Task 29 |

---

## Execution Order

```
Task 17: Create TrialBalanceGenerator
    │
    ▼
Task 18: Get All Accounts Method
    │
    ▼
Task 19: Calculate Balance Method
    │
    ▼
Task 20: Opening Balance Calc
    │
    ▼
Task 21: Period Movement Calc
    │
    ▼
Task 22: Closing Balance Calc
    │
    ▼
Task 23: Account Type Grouping
    │
    ▼
Task 24: Totals Validation
    │
    ▼
Task 25: Create Data Structure
    │
    ▼
Task 26: Comparison Mode
    │
    ▼
Task 27: Variance Calculation
    │
    ▼
Task 28: HTML Template
    │
    ▼
Task 29: PDF Generator
    │
    ▼
Task 30: API Endpoint
```

---

## Expected Deliverables

```
apps/accounting/
├── reports/
│   ├── __init__.py
│   └── trial_balance.py       # TrialBalanceGenerator
├── templates/
│   └── reports/
│       └── trial_balance.html # PDF/HTML template
├── views/
│   └── reports.py             # Add TB endpoint
└── tests/
    └── test_trial_balance.py  # TB tests
```

---

## Notes for AI Agents

### Trial Balance Structure
```
Account | Opening Dr | Opening Cr | Period Dr | Period Cr | Closing Dr | Closing Cr
--------|------------|------------|-----------|-----------|------------|----------
ASSETS
1100    |     10,000 |            |     5,000 |     2,000 |     13,000 |
1200    |      5,000 |            |     3,000 |     1,000 |      7,000 |
LIABILITIES
2100    |            |      8,000 |     2,000 |     4,000 |            |     10,000
...
TOTALS  |     XX,XXX |     XX,XXX |    XX,XXX |    XX,XXX |     XX,XXX |     XX,XXX
```

### Balance Calculation Rules
- Opening Balance: Sum of all posted entries before start_date
- Period Debits: Sum of debit entries within date range
- Period Credits: Sum of credit entries within date range
- Closing Balance: Opening + Period Debits - Period Credits

### Account Type Grouping Order
1. Assets (1xxx)
2. Liabilities (2xxx)
3. Equity (3xxx)
4. Revenue (4xxx)
5. Expenses (5xxx)

### Validation Rule
Total Debits MUST equal Total Credits for:
- Opening balances
- Period movements
- Closing balances

### Comparison Data Structure
```json
{
  "current_period": { ... },
  "prior_period": { ... },
  "variance": {
    "amount": 0.00,
    "percentage": 0.00
  }
}
```

### Report Date Logic
Trial Balance is an "as of" report:
- Shows cumulative balances up to a point in time
- Period movements show activity within date range
- Closing = Opening + Movements
