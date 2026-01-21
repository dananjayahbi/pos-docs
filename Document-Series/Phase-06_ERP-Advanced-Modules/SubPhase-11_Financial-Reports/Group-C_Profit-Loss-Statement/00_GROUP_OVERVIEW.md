# Group C: Profit & Loss Statement

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 11 - Financial Reports  
> **Group:** C of F  
> **Tasks Covered:** 31-48  
> **Group Goal:** Implement Profit & Loss (Income Statement) generator with revenue, expenses, and net income calculations

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-B_Trial-Balance-Report](../Group-B_Trial-Balance-Report/)
- **→ Next Group:** [Group-D_Balance-Sheet](../Group-D_Balance-Sheet/)

---

## Group Overview

This group implements the Profit & Loss Statement (Income Statement), showing revenues, expenses, and net income for a period. Separates revenue accounts, cost of goods sold, operating expenses, and other income/expenses to calculate gross profit, operating income, and net income. Includes comparison mode, variance calculations, percentage of revenue analysis, HTML template, and API endpoint.

### Key Outcomes

- PLGenerator extending BaseReportGenerator
- Get revenue accounts method (4xxx)
- Get expense accounts method (5xxx)
- Revenue total calculation
- Cost of goods sold calculation
- Gross profit calculation (Revenue - COGS)
- Operating expenses calculation
- Operating income calculation (Gross Profit - OpEx)
- Other income and other expenses calculations
- Net income calculation (final bottom line)
- P&L output data structure
- Prior period comparison mode
- Variance calculation (amount and percentage)
- Percentage of revenue analysis
- HTML template for P&L report
- PDF generator
- API endpoint GET /reports/profit-loss/

### Technology Context

- **Period-Based:** Activity within date range only
- **Categorization:** Account category-based grouping
- **Percentages:** Common-size analysis vs revenue
- **Comparison:** Year-over-year or period-over-period

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-31-41_PL-Calculations.md` | Create generator with revenue, expense, and profit calculations | 31-41 |
| 02 | `02_Tasks-42-48_PL-Comparison-Output.md` | Add data structure, comparison, percentages, template, and API | 42-48 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 31 | Create PLGenerator | Medium | Task 30 |
| 32 | Add Get Revenue Accounts | Low | Task 31 |
| 33 | Add Get Expense Accounts | Low | Task 31 |
| 34 | Add Calculate Revenue Total | Medium | Task 32 |
| 35 | Add Calculate COGS | Medium | Task 33 |
| 36 | Add Calculate Gross Profit | Low | Task 35 |
| 37 | Add Calculate Operating Expenses | Medium | Task 36 |
| 38 | Add Calculate Operating Income | Low | Task 37 |
| 39 | Add Calculate Other Income | Low | Task 38 |
| 40 | Add Calculate Other Expenses | Low | Task 39 |
| 41 | Add Calculate Net Income | Low | Task 40 |
| 42 | Create PL Data Structure | Medium | Task 41 |
| 43 | Add PL Comparison Mode | Medium | Task 42 |
| 44 | Add PL Variance Calc | Low | Task 43 |
| 45 | Add PL Percentage of Revenue | Low | Task 44 |
| 46 | Create PL HTML Template | Medium | Task 45 |
| 47 | Create PL PDF Generator | Medium | Task 46 |
| 48 | Create PL API Endpoint | Low | Task 47 |

---

## Execution Order

```
Task 31: Create PLGenerator
    │
    ├──────────────┐
    ▼              ▼
Task 32        Task 33
(Revenue Accts) (Expense Accts)
    │              │
    ▼              │
Task 34            │
(Revenue Total)    │
    │              ▼
    │          Task 35
    │          (COGS)
    │              │
    └──────┬───────┘
           ▼
      Task 36: Gross Profit
           │
           ▼
      Task 37: Operating Expenses
           │
           ▼
      Task 38: Operating Income
           │
           ├──────────────┐
           ▼              ▼
      Task 39         Task 40
      (Other Income)  (Other Expenses)
           │              │
           └──────┬───────┘
                  ▼
             Task 41: Net Income
                  │
                  ▼
             Tasks 42-48: Output & API
```

---

## Expected Deliverables

```
apps/accounting/
├── reports/
│   ├── __init__.py
│   └── profit_loss.py         # PLGenerator
├── templates/
│   └── reports/
│       └── profit_loss.html   # PDF/HTML template
├── views/
│   └── reports.py             # Add PL endpoint
└── tests/
    └── test_profit_loss.py    # PL tests
```

---

## Notes for AI Agents

### P&L Statement Structure
```
REVENUE
  Sales Revenue                    XXX,XXX    100.0%
  Service Revenue                   XX,XXX     XX.X%
  TOTAL REVENUE                   XXX,XXX    100.0%

COST OF GOODS SOLD
  Purchases                        XX,XXX     XX.X%
  Direct Labor                      X,XXX      X.X%
  TOTAL COGS                       XX,XXX     XX.X%

GROSS PROFIT                      XXX,XXX     XX.X%

OPERATING EXPENSES
  Salaries & Wages                 XX,XXX     XX.X%
  EPF/ETF Expense                   X,XXX      X.X%
  Rent Expense                      X,XXX      X.X%
  Utilities                         X,XXX      X.X%
  Depreciation                      X,XXX      X.X%
  TOTAL OPERATING EXPENSES         XX,XXX     XX.X%

OPERATING INCOME                   XX,XXX     XX.X%

OTHER INCOME
  Interest Income                     XXX      X.X%
  TOTAL OTHER INCOME                  XXX      X.X%

OTHER EXPENSES
  Interest Expense                    XXX      X.X%
  Bank Charges                        XXX      X.X%
  TOTAL OTHER EXPENSES              X,XXX      X.X%

NET INCOME BEFORE TAX              XX,XXX     XX.X%

INCOME TAX EXPENSE                  X,XXX      X.X%

NET INCOME                         XX,XXX     XX.X%
```

### Account Categories for P&L
- Revenue (4xxx): All income accounts
- COGS (5100-5199): Direct cost accounts
- Operating Expenses (5200-5799): Operational costs
- Other Income (4900+): Non-operating income
- Other Expenses (5800-5899): Non-operating costs

### Percentage of Revenue
Each line item shows:
- Amount
- % of Total Revenue
- Variance from prior period (if comparison enabled)

### Period-Based Calculations
P&L shows activity for a period:
- Only transactions within start_date to end_date
- NOT cumulative like Balance Sheet
- Resets each fiscal year

### Sri Lanka Considerations
- EPF/ETF Expense: Show as operating expense
- Bank Charges: Common in Other Expenses
- Net income flows to Retained Earnings on Balance Sheet
