# Group C: Default Chart Setup

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 08 - Chart of Accounts  
> **Group:** C of F  
> **Tasks Covered:** 35-50  
> **Group Goal:** Define comprehensive default account structure for all 5 account types with Sri Lanka-specific accounts

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-B_Account-Model-Hierarchy](../Group-B_Account-Model-Hierarchy/)
- **→ Next Group:** [Group-D_Account-Management-Features](../Group-D_Account-Management-Features/)

---

## Group Overview

This group defines the complete default chart of accounts structure covering all 5 account types. Includes standard accounts for assets (cash, bank, receivables, inventory, fixed assets), liabilities (payables, tax payables, EPF/ETF payables), equity (owner's equity, retained earnings), revenue (sales, services), and expenses (COGS, salaries, rent, utilities). Special attention to Sri Lanka statutory accounts for EPF, ETF, VAT, and PAYE compliance.

### Key Outcomes

- Asset accounts (1000-1999): Cash, Bank, Receivables, Inventory, Fixed Assets
- Liability accounts (2000-2999): Payables, VAT Payable, EPF/ETF Payable, PAYE Payable
- Equity accounts (3000-3999): Owner's Equity, Retained Earnings
- Revenue accounts (4000-4999): Sales Revenue, Service Revenue, Other Income
- Expense accounts (5000-5999): COGS, Salaries, EPF/ETF Expense, Rent, Utilities
- Sri Lanka statutory compliance accounts
- Hierarchical structure with header and detail accounts

### Technology Context

- **Structure:** Hierarchical using MPTT parent-child relationships
- **Fixtures:** JSON fixtures for default account data
- **Localization:** Sri Lanka-specific statutory accounts
- **Templates:** Industry-specific variations (Retail, Service)

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-35-40_Asset-Accounts.md` | Define asset accounts: cash, bank, receivables, inventory, fixed assets | 35-40 |
| 02 | `02_Tasks-41-44_Liability-Accounts.md` | Define liability accounts: payables, VAT, EPF/ETF, PAYE | 41-44 |
| 03 | `03_Tasks-45-48_Equity-Revenue-Accounts.md` | Define equity and revenue accounts | 45-48 |
| 04 | `04_Tasks-49-50_Expense-Accounts.md` | Define expense accounts: COGS, salaries, overhead | 49-50 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 35 | Define Asset Accounts | Medium | Task 34 |
| 36 | Add Cash Accounts | Low | Task 35 |
| 37 | Add Bank Accounts | Low | Task 35 |
| 38 | Add Receivables Accounts | Low | Task 35 |
| 39 | Add Inventory Accounts | Low | Task 35 |
| 40 | Add Fixed Asset Accounts | Low | Task 35 |
| 41 | Define Liability Accounts | Medium | Task 40 |
| 42 | Add Payables Accounts | Low | Task 41 |
| 43 | Add Tax Payable Accounts | Low | Task 41 |
| 44 | Add EPF/ETF Payable Accounts | Low | Task 41 |
| 45 | Define Equity Accounts | Medium | Task 44 |
| 46 | Add Owner Equity Accounts | Low | Task 45 |
| 47 | Define Revenue Accounts | Medium | Task 46 |
| 48 | Add Sales Revenue Accounts | Low | Task 47 |
| 49 | Define Expense Accounts | Medium | Task 48 |
| 50 | Add Common Expense Accounts | Low | Task 49 |

---

## Execution Order

```
Task 35: Define Asset Accounts (header)
    │
    ├─────────────────────────────────────┐
    ▼                                     ▼
Tasks 36-40: Asset Sub-accounts      (parallel)
(Cash, Bank, Receivables, Inventory, Fixed Assets)
    │
    ▼
Task 41: Define Liability Accounts (header)
    │
    ├───────────────────────┐
    ▼                       ▼
Tasks 42-44: Liability    (parallel)
(Payables, VAT, EPF/ETF)
    │
    ▼
Task 45: Define Equity Accounts
    │
    ▼
Task 46: Add Owner Equity
    │
    ▼
Task 47: Define Revenue Accounts
    │
    ▼
Task 48: Add Sales Revenue
    │
    ▼
Task 49: Define Expense Accounts
    │
    ▼
Task 50: Add Common Expenses
```

---

## Expected Deliverables

```
apps/accounting/
├── fixtures/
│   └── default_coa.json         # Complete default chart of accounts
└── data/
    └── default_accounts.py      # Account definitions as Python dict

Documentation:
└── default_chart_structure.md   # Account hierarchy documentation
```

---

## Notes for AI Agents

### Default Account Hierarchy Structure

**ASSETS (1xxx)**
```
1000 - Current Assets [Header]
├── 1100 - Cash [Header]
│   ├── 1101 - Cash on Hand
│   └── 1102 - Petty Cash
├── 1110 - Bank Accounts [Header]
├── 1200 - Accounts Receivable [Header]
│   └── 1201 - Trade Receivables
├── 1250 - VAT Input
└── 1300 - Inventory [Header]
    └── 1301 - Merchandise Inventory
1500 - Fixed Assets [Header]
├── 1501 - Equipment
└── 1599 - Accumulated Depreciation (contra)
```

**LIABILITIES (2xxx)**
```
2000 - Current Liabilities [Header]
├── 2100 - Accounts Payable [Header]
│   └── 2101 - Trade Payables
├── 2150 - VAT Output
├── 2200 - EPF Payable
├── 2201 - ETF Payable
└── 2210 - PAYE Payable
2500 - Long-term Liabilities [Header]
```

**EQUITY (3xxx)**
```
3000 - Owner's Equity
3100 - Retained Earnings
```

**REVENUE (4xxx)**
```
4100 - Sales Revenue
4200 - Service Revenue
4900 - Other Income
```

**EXPENSES (5xxx)**
```
5100 - Cost of Goods Sold
5200 - Salaries & Wages
5210 - EPF/ETF Expense (employer portion)
5300 - Rent Expense
5400 - Utilities Expense
5900 - Other Expenses
```

### Sri Lanka Statutory Accounts
- EPF Payable (2200): Combined employee + employer EPF
- ETF Payable (2201): Employer ETF contribution
- PAYE Payable (2210): Employee income tax withholding
- VAT Output (2150): Sales tax collected
- VAT Input (1250): Purchase tax paid (asset for offset)

### System Accounts (is_system=True)
Mark critical accounts that should not be deleted:
- Trade Receivables (AR Control)
- Trade Payables (AP Control)
- Retained Earnings
- VAT Input/Output
- EPF/ETF/PAYE Payables
