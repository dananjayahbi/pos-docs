# Tasks 31-41: PLGenerator and Profit Calculations

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 11 - Financial Reports  
> **Group:** C - Profit & Loss Statement  
> **Document:** 01 of 02  
> **Tasks Covered:** 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Group:** [../Group-B_Trial-Balance-Report/](../Group-B_Trial-Balance-Report/)
- **→ Next Document:** [02_Tasks-42-48_PL-Comparison-Output.md](02_Tasks-42-48_PL-Comparison-Output.md)
- **→ Next Group:** [../Group-D_Balance-Sheet/](../Group-D_Balance-Sheet/)

---

## Document Overview

This document covers the core Profit & Loss Statement generator and all calculation methods. The PLGenerator extends BaseReportGenerator to compute revenues, expenses, and various profit levels including gross profit, operating income, and net income. These calculations form the foundation of the P&L Statement with proper account categorization and Sri Lankan business context.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 31 | Create PLGenerator | Medium | 40 min |
| 32 | Add Get Revenue Accounts | Low | 15 min |
| 33 | Add Get Expense Accounts | Low | 15 min |
| 34 | Add Calculate Revenue Total | Medium | 30 min |
| 35 | Add Calculate COGS | Medium | 30 min |
| 36 | Add Calculate Gross Profit | Low | 15 min |
| 37 | Add Calculate Operating Expenses | Medium | 35 min |
| 38 | Add Calculate Operating Income | Low | 15 min |
| 39 | Add Calculate Other Income | Low | 20 min |
| 40 | Add Calculate Other Expenses | Low | 20 min |
| 41 | Add Calculate Net Income | Low | 20 min |

---

## Task 31: Create PLGenerator

### Overview
Create the PLGenerator class that extends BaseReportGenerator to generate Profit & Loss Statements. This generator orchestrates all P&L calculations, manages period selection, handles account filtering by category, and produces structured financial data showing revenue, expenses, and profitability.

### Dependencies
- Task 30: BaseReportGenerator exists
- Accounting app structure is in place
- Account model with categories
- GeneralLedger entries exist
- Tenant multi-tenancy configured

### Instructions

1. **Create profit_loss.py file**
   - Navigate to `apps/accounting/reports/` directory
   - Create new file named `profit_loss.py`
   - This will contain the PLGenerator class

2. **Import required modules**
   - Import Django models and querysets
   - Import BaseReportGenerator from base.py
   - Import Account model
   - Import GeneralLedger model
   - Import Decimal for financial calculations
   - Import datetime utilities

3. **Define PLGenerator class**
   - Inherit from BaseReportGenerator
   - Add comprehensive class docstring
   - Explain P&L purpose and structure

4. **Add __init__ method**
   - Accept tenant, start_date, end_date parameters
   - Accept optional comparison parameters
   - Call super().__init__() with base parameters
   - Initialize calculation cache dictionaries

5. **Add report_name property**
   - Override base class property
   - Return "Profit & Loss Statement"
   - Used in PDF headers and API responses

6. **Add report_type property**
   - Override base class property
   - Return "PROFIT_LOSS"
   - Used for report identification

7. **Create validate method**
   - Override base validation method
   - Check start_date is before end_date
   - Validate date range is not in future
   - Check tenant has GL entries
   - Raise ValidationError if issues found

8. **Create _reset_cache method**
   - Private method to clear calculation cache
   - Reset all cached values to None
   - Called when parameters change
   - Ensures fresh calculations

9. **Add generate method stub**
   - Override base generate method
   - Call validate() first
   - Call calculation methods (to be implemented)
   - Return structured P&L data dictionary
   - Will be fully implemented after calculation methods

10. **Update reports/__init__.py**
    - Import PLGenerator class
    - Add to __all__ list
    - Make accessible from reports module

### PLGenerator Class Structure

```
┌───────────────────────────────────────────────────┐
│              PLGenerator                          │
│   (extends BaseReportGenerator)                   │
├───────────────────────────────────────────────────┤
│ Properties:                                       │
│  • report_name: "Profit & Loss Statement"         │
│  • report_type: "PROFIT_LOSS"                     │
│                                                   │
│ Core Methods:                                     │
│  • __init__(tenant, start_date, end_date)         │
│  • validate()                                     │
│  • generate()                                     │
│  • _reset_cache()                                 │
│                                                   │
│ Revenue Methods: (Tasks 32, 34)                   │
│  • get_revenue_accounts()                         │
│  • calculate_revenue_total()                      │
│                                                   │
│ Expense Methods: (Tasks 33, 35, 37, 39, 40)       │
│  • get_expense_accounts()                         │
│  • calculate_cogs()                               │
│  • calculate_operating_expenses()                 │
│  • calculate_other_income()                       │
│  • calculate_other_expenses()                     │
│                                                   │
│ Profit Methods: (Tasks 36, 38, 41)                │
│  • calculate_gross_profit()                       │
│  • calculate_operating_income()                   │
│  • calculate_net_income()                         │
└───────────────────────────────────────────────────┘
```

### Inheritance Hierarchy

```
┌──────────────────────────┐
│   BaseReportGenerator    │
│  (Task 30 - Group A)     │
└────────────┬─────────────┘
             │ extends
             │
┌────────────▼─────────────┐
│      PLGenerator         │
│  (Task 31 - Group C)     │
└──────────────────────────┘
```

### PLGenerator Responsibilities

| Responsibility | Description |
|----------------|-------------|
| Period Management | Handle start_date and end_date for P&L period |
| Account Filtering | Get accounts by category (Revenue, COGS, OpEx) |
| Balance Calculation | Sum GL entries for each account in period |
| Profit Computation | Calculate gross profit, operating income, net income |
| Data Structuring | Format results for templates and API |
| Comparison Support | Enable period-over-period comparison |

### P&L Calculation Flow

```
Start
  │
  ├──> Get Revenue Accounts (4xxx)
  │         │
  │         └──> Calculate Revenue Total
  │                    │
  ├──> Get Expense Accounts (5xxx)
  │         │
  │         ├──> Calculate COGS (5100-5199)
  │         │         │
  │         │         └──> Calculate Gross Profit
  │         │                    │
  │         ├──> Calculate Operating Expenses (5200-5799)
  │         │         │
  │         │         └──> Calculate Operating Income
  │         │                    │
  │         ├──> Calculate Other Income (4900+)
  │         │         │
  │         └──> Calculate Other Expenses (5800-5899)
  │                   │
  └──────────────────>└──> Calculate Net Income
                            │
                            ▼
                       Return P&L Data
```

### Cache Dictionary Structure

```python
# Internal cache for calculation results
{
    'revenue_accounts': None,      # List of revenue account objects
    'expense_accounts': None,      # List of expense account objects
    'revenue_total': None,         # Decimal
    'cogs_total': None,            # Decimal
    'gross_profit': None,          # Decimal
    'operating_expenses': None,    # Decimal
    'operating_income': None,      # Decimal
    'other_income': None,          # Decimal
    'other_expenses': None,        # Decimal
    'net_income': None             # Decimal
}
```

### Sri Lankan Business Context

| P&L Component | Sri Lankan Specifics |
|---------------|---------------------|
| Revenue | Include both goods and services, VAT separate |
| COGS | Import duties, customs, local purchases |
| Operating Expenses | EPF (12%), ETF (3%), Gratuity provisions |
| Salaries | Statutory deductions (PAYE, EPF employee 8%) |
| Utilities | CEB electricity, water board charges |
| Other Expenses | Bank charges in LKR, interest on loans |
| Tax | Corporate tax rate (currently 30% for companies) |

### Expected Outcome
- Functional PLGenerator class
- Proper inheritance from BaseReportGenerator
- Validation logic for parameters
- Cache mechanism for efficiency
- Foundation for calculation methods
- Sri Lankan compliance considerations

### Verification Checklist
- [ ] profit_loss.py file created
- [ ] PLGenerator class defined
- [ ] Inherits from BaseReportGenerator
- [ ] __init__ method implemented
- [ ] report_name property returns correct string
- [ ] report_type property returns "PROFIT_LOSS"
- [ ] validate() method implemented
- [ ] _reset_cache() method implemented
- [ ] generate() method stub created
- [ ] Class imported in __init__.py

---

## Task 32: Add Get Revenue Accounts

### Overview
Add the get_revenue_accounts method to PLGenerator that retrieves all revenue accounts (4xxx series) for the tenant. This method filters accounts by category, ensures they are active, and returns them ordered by account code for consistent P&L presentation.

### Dependencies
- Task 31: Create PLGenerator
- Account model with category field
- Account code convention (4xxx = Revenue)

### Instructions

1. **Open profit_loss.py file**
   - Navigate to PLGenerator class
   - Add get_revenue_accounts method

2. **Create method signature**
   - Method name: get_revenue_accounts
   - No additional parameters (uses self.tenant)
   - Returns QuerySet of Account objects

3. **Check cache first**
   - Check if revenue_accounts already in cache
   - If cached, return cached value
   - Avoids redundant database queries

4. **Query revenue accounts**
   - Filter Account model by tenant
   - Filter by account_category = 'REVENUE'
   - Alternative: Filter by code starting with '4'
   - Ensure is_active = True

5. **Add account code filters**
   - Primary revenue: 4000-4899
   - Other income handled separately (4900+)
   - Exclude contra-revenue if applicable

6. **Order results**
   - Order by account_code ascending
   - Consistent presentation in reports
   - Standard accounting order

7. **Cache the results**
   - Store QuerySet in self._cache['revenue_accounts']
   - Enable reuse across multiple calculations
   - Reduces database load

8. **Add method docstring**
   - Explain revenue account definition
   - Document 4xxx code range
   - List return type and ordering

### Revenue Account Categories

| Account Code Range | Category | Description |
|-------------------|----------|-------------|
| 4000-4099 | Sales Revenue | Product/goods sales |
| 4100-4199 | Service Revenue | Service income |
| 4200-4299 | Rental Income | Property/equipment rental |
| 4300-4399 | Commission Income | Commission earned |
| 4400-4499 | Fees Income | Consultation/professional fees |
| 4500-4899 | Other Operating Revenue | Other normal revenue |
| 4900-4999 | Other Income | Non-operating income (separate) |

### Revenue Account Examples (Sri Lankan Context)

```
Account Code  Account Name                 Category
══════════════════════════════════════════════════════════
4000          Sales Revenue - Local           Operating
4010          Sales Revenue - Export          Operating
4100          Service Revenue                 Operating
4110          Installation Charges            Operating
4200          Rental Income                   Operating
4300          Commission Income               Operating
4900          Interest Income                 Non-Operating
4910          Dividend Income                 Non-Operating
4920          Foreign Exchange Gain           Non-Operating
```

### Account Filtering Logic

```
Filter Criteria:
═══════════════
1. tenant = current tenant
2. account_category = 'REVENUE'
   OR account_code starts with '4'
3. account_code < '4900'  (exclude other income)
4. is_active = True
5. Order by account_code ASC
```

### Method Return Structure

```
QuerySet<Account>
├── Account 1
│   ├── code: "4000"
│   ├── name: "Sales Revenue - Local"
│   └── category: "REVENUE"
├── Account 2
│   ├── code: "4010"
│   ├── name: "Sales Revenue - Export"
│   └── category: "REVENUE"
└── Account 3
    ├── code: "4100"
    ├── name: "Service Revenue"
    └── category: "REVENUE"
```

### Sri Lankan Revenue Considerations

| Revenue Type | Tax Implication | IRD Requirement |
|--------------|-----------------|-----------------|
| Local Sales | VAT 18% (if applicable) | VAT return quarterly |
| Export Sales | VAT zero-rated | Export documents |
| Service Income | NBT + VAT | Service classification |
| Rental Income | Withholding tax 10% | Rental agreement |
| Interest Income | WHT 5% or 8% | Bank statements |

### Cache Benefits

| Benefit | Impact |
|---------|--------|
| Reduced Queries | Single DB query for multiple calculations |
| Faster Execution | In-memory access after first call |
| Consistency | Same dataset across all methods |
| Scalability | Better performance with many accounts |

### Expected Outcome
- Method retrieves all revenue accounts
- Proper filtering by category and code
- Active accounts only
- Results cached for performance
- Ordered by account code
- Excludes non-operating income

### Verification Checklist
- [ ] get_revenue_accounts method created
- [ ] Cache check implemented
- [ ] Query filters by tenant
- [ ] Filters by revenue category
- [ ] Filters by 4xxx code range (excluding 4900+)
- [ ] Filters active accounts only
- [ ] Results ordered by account_code
- [ ] Results cached after first call
- [ ] Method docstring added

---

## Task 33: Add Get Expense Accounts

### Overview
Add the get_expense_accounts method to PLGenerator that retrieves all expense accounts (5xxx series) for the tenant. This method returns expense accounts including COGS, operating expenses, and other expenses, properly filtered and ordered for P&L calculations.

### Dependencies
- Task 31: Create PLGenerator
- Account model with category field
- Account code convention (5xxx = Expenses)

### Instructions

1. **Open profit_loss.py file**
   - Navigate to PLGenerator class
   - Add get_expense_accounts method after get_revenue_accounts

2. **Create method signature**
   - Method name: get_expense_accounts
   - No additional parameters
   - Returns QuerySet of Account objects

3. **Check cache first**
   - Check if expense_accounts already in cache
   - Return cached value if available
   - Avoids redundant queries

4. **Query expense accounts**
   - Filter Account model by tenant
   - Filter by account_category = 'EXPENSE' or 'COST_OF_SALES'
   - Alternative: Filter by code starting with '5'
   - Ensure is_active = True

5. **Include all expense ranges**
   - COGS: 5100-5199
   - Operating expenses: 5200-5799
   - Other expenses: 5800-5899
   - Ensure comprehensive coverage

6. **Order results**
   - Order by account_code ascending
   - Standard accounting order
   - Groups similar expenses together

7. **Cache the results**
   - Store QuerySet in self._cache['expense_accounts']
   - Enable reuse in multiple calculations
   - Improves performance

8. **Add method docstring**
   - Explain expense account definition
   - Document 5xxx code range
   - List subcategories (COGS, OpEx, Other)

### Expense Account Categories

| Account Code Range | Category | Description |
|-------------------|----------|-------------|
| 5100-5199 | Cost of Goods Sold | Direct costs of sales |
| 5200-5299 | Personnel Costs | Salaries, EPF, ETF, benefits |
| 5300-5399 | Occupancy Costs | Rent, utilities, maintenance |
| 5400-5499 | Administrative Costs | Office supplies, insurance |
| 5500-5599 | Selling & Marketing | Advertising, commissions |
| 5600-5699 | Depreciation | Asset depreciation |
| 5700-5799 | Other Operating Expenses | Miscellaneous OpEx |
| 5800-5899 | Other Expenses | Interest, bank charges |

### Expense Account Examples (Sri Lankan Context)

```
Account Code  Account Name                    Category
═══════════════════════════════════════════════════════════
5100          Purchases - Local               COGS
5110          Purchases - Import              COGS
5120          Direct Labor                    COGS
5130          Freight Inward                  COGS

5200          Salaries & Wages                Operating
5210          EPF Expense (12%)               Operating
5211          ETF Expense (3%)                Operating
5220          Gratuity Provision              Operating

5300          Rent Expense                    Operating
5310          CEB Electricity                 Operating
5320          Water Charges                   Operating
5330          Telephone & Internet            Operating

5400          Office Supplies                 Operating
5410          Insurance Expense               Operating
5420          Professional Fees               Operating

5500          Advertising Expense             Operating
5510          Sales Commissions               Operating

5600          Depreciation Expense            Operating

5800          Interest Expense                Non-Operating
5810          Bank Charges                    Non-Operating
5820          Foreign Exchange Loss           Non-Operating
```

### Expense Filtering Logic

```
Filter Criteria:
═══════════════
1. tenant = current tenant
2. account_category IN ['EXPENSE', 'COST_OF_SALES']
   OR account_code starts with '5'
3. account_code >= '5100' AND <= '5899'
4. is_active = True
5. Order by account_code ASC
```

### Method Return Structure

```
QuerySet<Account>
├── COGS Accounts (5100-5199)
│   ├── 5100: Purchases - Local
│   ├── 5110: Purchases - Import
│   └── 5120: Direct Labor
├── Operating Expense Accounts (5200-5799)
│   ├── 5200: Salaries & Wages
│   ├── 5210: EPF Expense
│   ├── 5300: Rent Expense
│   └── 5600: Depreciation
└── Other Expense Accounts (5800-5899)
    ├── 5800: Interest Expense
    └── 5810: Bank Charges
```

### Sri Lankan Statutory Expenses

| Expense Type | Rate/Amount | Legal Requirement |
|--------------|-------------|-------------------|
| EPF Employer | 12% of basic salary | Mandatory for all employees |
| ETF | 3% of basic salary | Mandatory for all employees |
| EPF Employee | 8% of basic salary | Deducted from salary |
| Gratuity | ½ month per year (after 5 years) | Payment Terms Act |
| PAYE Tax | Progressive rates | Inland Revenue Act |

### Expense Recognition Principles

| Principle | Application |
|-----------|-------------|
| Matching | Expenses matched to revenue period |
| Accrual | Record when incurred, not when paid |
| Classification | Proper categorization (COGS vs OpEx) |
| Consistency | Same treatment across periods |

### Expected Outcome
- Method retrieves all expense accounts
- Proper filtering by category and code
- Includes COGS, operating, and other expenses
- Active accounts only
- Results cached for performance
- Ordered by account code

### Verification Checklist
- [ ] get_expense_accounts method created
- [ ] Cache check implemented
- [ ] Query filters by tenant
- [ ] Filters by expense categories
- [ ] Filters by 5xxx code range
- [ ] Includes COGS (5100-5199)
- [ ] Includes operating expenses (5200-5799)
- [ ] Includes other expenses (5800-5899)
- [ ] Filters active accounts only
- [ ] Results ordered by account_code
- [ ] Results cached
- [ ] Method docstring added

---

## Task 34: Add Calculate Revenue Total

### Overview
Add the calculate_revenue_total method that sums all credit balances from revenue accounts during the P&L period. This method queries general ledger entries, applies date filters, calculates net balances, and returns the total revenue figure used in gross profit and net income calculations.

### Dependencies
- Task 32: Add Get Revenue Accounts
- GeneralLedger model with entries
- Account balances calculation logic

### Instructions

1. **Open profit_loss.py file**
   - Navigate to PLGenerator class
   - Add calculate_revenue_total method

2. **Create method signature**
   - Method name: calculate_revenue_total
   - No additional parameters
   - Returns Decimal (total revenue amount)

3. **Check cache first**
   - Check if revenue_total in cache
   - Return cached value if exists
   - Calculate only once per report generation

4. **Get revenue accounts**
   - Call self.get_revenue_accounts()
   - Uses cached accounts list
   - Only active revenue accounts

5. **Initialize total variable**
   - Create total_revenue variable
   - Initialize to Decimal('0.00')
   - Use Decimal for precision

6. **Loop through revenue accounts**
   - Iterate over each revenue account
   - Calculate balance for each account
   - Sum all account balances

7. **Query GL entries for each account**
   - Filter GeneralLedger by tenant
   - Filter by account
   - Filter by date range (start_date to end_date)
   - Filter by posting_status = 'POSTED'

8. **Calculate net balance**
   - Sum all credit amounts
   - Subtract all debit amounts
   - Revenue is normally credit balance
   - Handle contra-revenue (debit balances)

9. **Add to total**
   - Add account balance to total_revenue
   - Keep running sum
   - Maintain Decimal precision

10. **Cache and return**
    - Store result in self._cache['revenue_total']
    - Return total_revenue Decimal
    - Ready for gross profit calculation

### Revenue Calculation Formula

```
Revenue Total = Σ (Credits - Debits) for all Revenue Accounts

For each revenue account (4000-4899):
  Account Balance = Σ Credit Entries - Σ Debit Entries
  
Total Revenue = Sum of all account balances
```

### GL Entry Structure for Revenue

```
GeneralLedger Entries (Sample)
═══════════════════════════════════════════════════════════
Date       Account  Description       Debit    Credit
───────────────────────────────────────────────────────────
2026-01-15 4000     Cash Sale           -      25,000.00
2026-01-16 4000     Credit Sale         -      15,000.00
2026-01-17 4000     Sales Return    1,000.00      -
2026-01-20 4100     Service Income      -       5,000.00
───────────────────────────────────────────────────────────

Account 4000 Balance = 40,000.00 - 1,000.00 = 39,000.00
Account 4100 Balance = 5,000.00
Total Revenue = 44,000.00
```

### Revenue Components

| Component | Account Range | Calculation |
|-----------|---------------|-------------|
| Sales Revenue | 4000-4099 | Credits - Debits |
| Service Revenue | 4100-4199 | Credits - Debits |
| Rental Income | 4200-4299 | Credits - Debits |
| Commission Income | 4300-4399 | Credits - Debits |
| Other Operating Revenue | 4400-4899 | Credits - Debits |

### Calculation Example (LKR)

```
Revenue Accounts Summary
════════════════════════════════════════════════════════════
Account  Name                    Credits      Debits    Balance
────────────────────────────────────────────────────────────
4000     Sales Revenue - Local   850,000.00   12,000   838,000.00
4010     Sales Revenue - Export  250,000.00      -     250,000.00
4100     Service Revenue         150,000.00    5,000   145,000.00
4200     Rental Income            50,000.00      -      50,000.00
4300     Commission Income        25,000.00      -      25,000.00
────────────────────────────────────────────────────────────
TOTAL REVENUE                 1,325,000.00   17,000 1,308,000.00
════════════════════════════════════════════════════════════
```

### Date Range Filtering

```
P&L Period: January 1 - January 31, 2026
════════════════════════════════════════

Include:
  ✓ Entries posted between Jan 1 - Jan 31
  ✓ Status = 'POSTED'
  ✓ Belong to revenue accounts

Exclude:
  ✗ Entries before January 1
  ✗ Entries after January 31
  ✗ Draft or unposted entries
  ✗ Voided entries
```

### Contra-Revenue Handling

| Contra Account | Type | Treatment |
|----------------|------|-----------|
| Sales Returns | Debit to 4000 | Reduces revenue |
| Sales Allowances | Debit to 4005 | Reduces revenue |
| Sales Discounts | Debit to 4010 | Reduces revenue |

### Sri Lankan Revenue Recognition

| Revenue Type | Recognition Point | Documentation |
|--------------|------------------|---------------|
| Local Sales | At point of sale | Tax invoice |
| Export Sales | When goods shipped | Shipping documents |
| Service Income | When service completed | Service completion certificate |
| Rental Income | Monthly accrual | Rental agreement |
| Interest Income | Accrual basis | Bank statements |

### Expected Outcome
- Method calculates total revenue
- Sums all revenue account balances
- Applies date range filters
- Handles contra-revenue correctly
- Uses Decimal for precision
- Result cached for reuse
- Returns revenue figure in LKR

### Verification Checklist
- [ ] calculate_revenue_total method created
- [ ] Cache check implemented
- [ ] Calls get_revenue_accounts()
- [ ] Initializes total to Decimal('0.00')
- [ ] Loops through all revenue accounts
- [ ] Queries GL entries by account and date range
- [ ] Filters posted entries only
- [ ] Calculates credit minus debit
- [ ] Sums all account balances
- [ ] Caches result
- [ ] Returns Decimal value
- [ ] Method docstring added

---

## Task 35: Add Calculate COGS

### Overview
Add the calculate_cogs method that calculates Cost of Goods Sold by summing all debit balances from COGS accounts (5100-5199 range) during the P&L period. COGS represents direct costs of producing or purchasing goods sold, including purchases, direct labor, and freight inward.

### Dependencies
- Task 33: Add Get Expense Accounts
- GeneralLedger entries for COGS accounts
- Account code range 5100-5199 defined

### Instructions

1. **Open profit_loss.py file**
   - Navigate to PLGenerator class
   - Add calculate_cogs method

2. **Create method signature**
   - Method name: calculate_cogs
   - No additional parameters
   - Returns Decimal (COGS amount)

3. **Check cache first**
   - Check if cogs_total in cache
   - Return cached value if exists
   - Avoid redundant calculations

4. **Get expense accounts**
   - Call self.get_expense_accounts()
   - Uses cached expense accounts
   - Will filter to COGS range

5. **Filter COGS accounts**
   - From expense accounts, filter code >= '5100' AND <= '5199'
   - These are direct cost accounts
   - Include all COGS subcategories

6. **Initialize total variable**
   - Create total_cogs variable
   - Initialize to Decimal('0.00')
   - Maintain precision

7. **Loop through COGS accounts**
   - Iterate over filtered COGS accounts
   - Calculate balance for each account
   - Sum all COGS balances

8. **Query GL entries for each COGS account**
   - Filter GeneralLedger by tenant
   - Filter by account
   - Filter by date range
   - Filter posting_status = 'POSTED'

9. **Calculate net balance**
   - Sum all debit amounts
   - Subtract all credit amounts
   - COGS is normally debit balance
   - Purchase returns are credits (reduce COGS)

10. **Add to total**
    - Add account balance to total_cogs
    - Maintain running sum
    - Keep Decimal precision

11. **Cache and return**
    - Store result in self._cache['cogs_total']
    - Return total_cogs Decimal
    - Used in gross profit calculation

### COGS Calculation Formula

```
COGS = Σ (Debits - Credits) for accounts 5100-5199

For each COGS account:
  Account Balance = Σ Debit Entries - Σ Credit Entries
  
Total COGS = Sum of all COGS account balances
```

### COGS Account Categories

| Account Code Range | Category | Description |
|-------------------|----------|-------------|
| 5100-5109 | Purchases | Goods purchased for resale |
| 5110-5119 | Import Purchases | Imported goods with duties |
| 5120-5129 | Direct Labor | Production labor costs |
| 5130-5139 | Direct Materials | Raw materials consumed |
| 5140-5149 | Freight Inward | Shipping costs on purchases |
| 5150-5159 | Custom Duties | Import duties and taxes |
| 5160-5169 | Manufacturing Overhead | Direct production costs |
| 5190-5199 | Purchase Returns | Credits for returned goods |

### COGS Account Examples (Sri Lankan Context)

```
Account Code  Account Name                 Type
══════════════════════════════════════════════════════════
5100          Purchases - Local            Debit (expense)
5110          Purchases - Import           Debit (expense)
5115          Import Duties                Debit (expense)
5116          Port Charges                 Debit (expense)
5120          Direct Labor                 Debit (expense)
5130          Direct Materials             Debit (expense)
5140          Freight Inward               Debit (expense)
5190          Purchase Returns             Credit (contra)
5195          Purchase Allowances          Credit (contra)
```

### COGS Calculation Example (LKR)

```
COGS Accounts Summary
═══════════════════════════════════════════════════════════
Account  Name                     Debits      Credits    Balance
───────────────────────────────────────────────────────────
5100     Purchases - Local      450,000.00    8,000    442,000.00
5110     Purchases - Import     180,000.00      -      180,000.00
5115     Import Duties           25,000.00      -       25,000.00
5120     Direct Labor            65,000.00      -       65,000.00
5140     Freight Inward          12,000.00      -       12,000.00
5190     Purchase Returns            -       5,000      (5,000.00)
───────────────────────────────────────────────────────────
TOTAL COGS                     732,000.00   13,000    719,000.00
═══════════════════════════════════════════════════════════
```

### Import Purchase Components (Sri Lanka)

```
Import Purchase Breakdown
═════════════════════════════════════════
FOB Value (Foreign)              USD 10,000
Exchange Rate                       LKR 320
FOB Value (LKR)                   3,200,000

+ Custom Duty (10%)                 320,000
+ PAL/CESS                          160,000
+ VAT (18% on taxable value)        662,400
+ Port Charges                       50,000
+ Freight Inward                     80,000
═════════════════════════════════════════
Total Landed Cost               4,472,400
```

### GL Entry Structure for COGS

```
GeneralLedger Entries (Sample)
═══════════════════════════════════════════════════════════
Date       Account  Description          Debit     Credit
───────────────────────────────────────────────────────────
2026-01-10 5100     Purchase - Supplier A  45,000      -
2026-01-12 5110     Import Purchase       180,000      -
2026-01-12 5115     Custom Duty            25,000      -
2026-01-15 5120     Factory Wages          65,000      -
2026-01-18 5100     Purchase Return           -    5,000
2026-01-20 5140     Freight Charges        12,000      -
───────────────────────────────────────────────────────────
Total COGS Debits:  327,000
Total COGS Credits:   5,000
Net COGS:          322,000
```

### Purchase Returns Handling

| Transaction | Account | Debit | Credit | Effect |
|-------------|---------|-------|--------|--------|
| Original Purchase | 5100 | 45,000 | - | Increases COGS |
| Return Goods | 5190 or 5100 | - | 5,000 | Reduces COGS |
| Net COGS | 5100 | - | - | 40,000 (net) |

### Sri Lankan COGS Components

| Component | Description | Documentation |
|-----------|-------------|---------------|
| Local Purchases | From local suppliers | Purchase invoices |
| Import Purchases | FOB + duties + freight | Bill of entry, shipping docs |
| Custom Duties | Import tariffs | Customs declaration |
| PAL/CESS | Port & Airport Levy | Customs receipt |
| Direct Labor | Production workers | Payroll records |
| Freight Inward | Transport to warehouse | Freight bills |

### Expected Outcome
- Method calculates total COGS
- Filters accounts in 5100-5199 range
- Sums all COGS account balances
- Applies date range filters
- Handles purchase returns correctly
- Uses Decimal precision
- Result cached for reuse
- Returns COGS figure in LKR

### Verification Checklist
- [ ] calculate_cogs method created
- [ ] Cache check implemented
- [ ] Calls get_expense_accounts()
- [ ] Filters accounts 5100-5199
- [ ] Initializes total to Decimal('0.00')
- [ ] Loops through COGS accounts
- [ ] Queries GL entries by account and date range
- [ ] Filters posted entries only
- [ ] Calculates debit minus credit
- [ ] Handles purchase returns (credits)
- [ ] Sums all COGS balances
- [ ] Caches result
- [ ] Returns Decimal value
- [ ] Method docstring added

---

## Task 36: Add Calculate Gross Profit

### Overview
Add the calculate_gross_profit method that computes gross profit by subtracting Cost of Goods Sold from Total Revenue. Gross profit represents the profit earned from core business operations before deducting operating expenses, and is a key profitability indicator.

### Dependencies
- Task 34: Add Calculate Revenue Total
- Task 35: Add Calculate COGS

### Instructions

1. **Open profit_loss.py file**
   - Navigate to PLGenerator class
   - Add calculate_gross_profit method

2. **Create method signature**
   - Method name: calculate_gross_profit
   - No additional parameters
   - Returns Decimal (gross profit amount)

3. **Check cache first**
   - Check if gross_profit in cache
   - Return cached value if exists
   - Single calculation per report

4. **Get revenue total**
   - Call self.calculate_revenue_total()
   - Returns total revenue Decimal
   - Uses cached value if available

5. **Get COGS total**
   - Call self.calculate_cogs()
   - Returns COGS Decimal
   - Uses cached value if available

6. **Calculate gross profit**
   - Subtract COGS from revenue
   - Formula: gross_profit = revenue_total - cogs_total
   - Result can be positive or negative

7. **Handle negative gross profit**
   - Negative means COGS exceeds revenue
   - Indicates loss at gross profit level
   - Still valid result, return as-is

8. **Cache and return**
   - Store result in self._cache['gross_profit']
   - Return gross_profit Decimal
   - Used in operating income calculation

9. **Add method docstring**
   - Explain gross profit definition
   - Document calculation formula
   - Note importance in profitability analysis

### Gross Profit Calculation Formula

```
Gross Profit = Total Revenue - Cost of Goods Sold

Where:
  Total Revenue = Sum of all revenue accounts (4000-4899)
  COGS = Sum of all COGS accounts (5100-5199)
```

### Gross Profit Calculation Example (LKR)

```
Gross Profit Calculation
══════════════════════════════════════════════
Total Revenue                    1,308,000.00
Less: Cost of Goods Sold          (719,000.00)
──────────────────────────────────────────────
GROSS PROFIT                       589,000.00
══════════════════════════════════════════════

Gross Profit Margin = 589,000 / 1,308,000 = 45.0%
```

### P&L Statement Position

```
PROFIT & LOSS STATEMENT
For Period: January 1-31, 2026
═════════════════════════════════════════════════════════
REVENUE
  Sales Revenue - Local                        838,000.00
  Sales Revenue - Export                       250,000.00
  Service Revenue                              145,000.00
  Rental Income                                 50,000.00
  Commission Income                             25,000.00
                                             ─────────────
  TOTAL REVENUE                              1,308,000.00

COST OF GOODS SOLD
  Purchases - Local                            442,000.00
  Purchases - Import                           180,000.00
  Import Duties                                 25,000.00
  Direct Labor                                  65,000.00
  Freight Inward                                12,000.00
  Purchase Returns                              (5,000.00)
                                             ─────────────
  TOTAL COGS                                   719,000.00

GROSS PROFIT                                   589,000.00  ← This calculation
═════════════════════════════════════════════════════════
```

### Gross Profit Scenarios

| Scenario | Revenue | COGS | Gross Profit | Margin |
|----------|---------|------|--------------|--------|
| Healthy | 1,308,000 | 719,000 | 589,000 | 45.0% |
| Moderate | 1,308,000 | 915,000 | 393,000 | 30.0% |
| Low | 1,308,000 | 1,111,000 | 197,000 | 15.0% |
| Loss | 1,308,000 | 1,400,000 | (92,000) | -7.0% |

### Industry Benchmarks (Sri Lanka)

| Industry | Typical Gross Margin |
|----------|---------------------|
| Retail Trade | 20-30% |
| Wholesale | 10-20% |
| Manufacturing | 30-50% |
| Restaurants | 60-70% |
| Software/Services | 70-90% |
| Construction | 15-25% |

### Gross Profit Importance

| Purpose | Why It Matters |
|---------|----------------|
| Pricing Analysis | Shows if selling prices cover direct costs |
| Product Mix | Identifies high vs low margin products |
| Supplier Negotiation | Guides purchase price discussions |
| Efficiency Measure | Production/procurement efficiency |
| Trend Analysis | Month-over-month margin changes |
| Benchmarking | Compare to industry standards |

### Negative Gross Profit Analysis

```
Negative Gross Profit Causes
═══════════════════════════════════════════════════════════
1. Selling Below Cost
   - Clearance sales, damaged goods
   - Promotional pricing too aggressive

2. High Import Costs
   - Exchange rate fluctuations (LKR weakening)
   - Increased custom duties

3. Theft/Shrinkage
   - Inventory losses not properly recorded
   - Missing purchase documentation

4. Accounting Errors
   - Revenue not fully recorded
   - COGS overstated or duplicated
```

### Sri Lankan Context Considerations

| Factor | Impact on Gross Profit |
|--------|----------------------|
| Exchange Rate | Weakening LKR increases import COGS |
| Fuel Prices | Higher transport costs increase freight |
| Import Restrictions | Limited supply can increase prices |
| VAT Treatment | VAT should not be in COGS |
| NBT | Nation Building Tax on turnover |

### Expected Outcome
- Method calculates gross profit
- Subtracts COGS from revenue
- Handles positive and negative results
- Uses Decimal precision
- Result cached for reuse
- Returns gross profit in LKR
- Foundation for operating income

### Verification Checklist
- [ ] calculate_gross_profit method created
- [ ] Cache check implemented
- [ ] Calls calculate_revenue_total()
- [ ] Calls calculate_cogs()
- [ ] Calculates revenue minus COGS
- [ ] Handles negative values correctly
- [ ] Uses Decimal arithmetic
- [ ] Caches result
- [ ] Returns Decimal value
- [ ] Method docstring added

---

## Task 37: Add Calculate Operating Expenses

### Overview
Add the calculate_operating_expenses method that sums all operating expense accounts (5200-5799 range) during the P&L period. Operating expenses include salaries, EPF/ETF, rent, utilities, depreciation, and other costs necessary to run the business but not directly tied to production.

### Dependencies
- Task 33: Add Get Expense Accounts
- GeneralLedger entries for operating expense accounts
- Account code range 5200-5799 defined

### Instructions

1. **Open profit_loss.py file**
   - Navigate to PLGenerator class
   - Add calculate_operating_expenses method

2. **Create method signature**
   - Method name: calculate_operating_expenses
   - No additional parameters
   - Returns Decimal (operating expenses total)

3. **Check cache first**
   - Check if operating_expenses in cache
   - Return cached value if exists
   - Single calculation per report

4. **Get expense accounts**
   - Call self.get_expense_accounts()
   - Uses cached expense accounts list
   - Will filter to operating expense range

5. **Filter operating expense accounts**
   - From expense accounts, filter code >= '5200' AND <= '5799'
   - Excludes COGS (5100-5199)
   - Excludes other expenses (5800-5899)

6. **Initialize total variable**
   - Create total_opex variable
   - Initialize to Decimal('0.00')
   - Maintain precision

7. **Loop through operating expense accounts**
   - Iterate over filtered accounts
   - Calculate balance for each account
   - Sum all operating expense balances

8. **Query GL entries for each account**
   - Filter GeneralLedger by tenant
   - Filter by account
   - Filter by date range (start_date to end_date)
   - Filter posting_status = 'POSTED'

9. **Calculate net balance**
   - Sum all debit amounts
   - Subtract all credit amounts
   - Operating expenses are normally debits
   - Credits may be reversals or recoveries

10. **Add to total**
    - Add account balance to total_opex
    - Maintain running sum
    - Keep Decimal precision

11. **Cache and return**
    - Store result in self._cache['operating_expenses']
    - Return total_opex Decimal
    - Used in operating income calculation

### Operating Expenses Calculation Formula

```
Operating Expenses = Σ (Debits - Credits) for accounts 5200-5799

For each operating expense account:
  Account Balance = Σ Debit Entries - Σ Credit Entries
  
Total Operating Expenses = Sum of all OpEx account balances
```

### Operating Expense Categories

| Account Code Range | Category | Description |
|-------------------|----------|-------------|
| 5200-5299 | Personnel Costs | Salaries, EPF, ETF, bonuses |
| 5300-5399 | Occupancy Costs | Rent, utilities, maintenance |
| 5400-5499 | Administrative | Office supplies, insurance, legal |
| 5500-5599 | Selling & Marketing | Advertising, commissions, travel |
| 5600-5699 | Depreciation | Asset depreciation expense |
| 5700-5799 | Other Operating | Miscellaneous operating costs |

### Operating Expense Examples (Sri Lankan Context)

```
Account Code  Account Name                 Description
═══════════════════════════════════════════════════════════════
PERSONNEL COSTS (5200-5299)
5200          Salaries & Wages             Gross salaries
5210          EPF Expense (12%)            Employer contribution
5211          ETF Expense (3%)             Training fund
5220          Gratuity Provision           Long-term benefit
5230          Medical Insurance            Employee health benefits
5240          Staff Training               Training & development
5250          Bonus & Incentives           Performance bonuses

OCCUPANCY COSTS (5300-5399)
5300          Rent Expense                 Office/shop rent
5310          CEB Electricity              Ceylon Electricity Board
5320          Water Charges                National Water Board
5330          Telephone & Internet         Communication costs
5340          Building Maintenance         Repairs & upkeep
5350          Security Services            Security guards

ADMINISTRATIVE (5400-5499)
5400          Office Supplies              Stationery, consumables
5410          Insurance Expense            General insurance
5420          Professional Fees            Audit, legal fees
5430          Subscriptions                Software, magazines
5440          Postage & Courier            Mail services

SELLING & MARKETING (5500-5599)
5500          Advertising Expense          Promotions, ads
5510          Sales Commissions            Commission to sales staff
5520          Travel & Entertainment       Business travel
5530          Vehicle Expenses             Fuel, maintenance
5540          Delivery Expenses            Customer delivery costs

DEPRECIATION (5600-5699)
5600          Depreciation - Buildings     Building depreciation
5610          Depreciation - Vehicles      Vehicle depreciation
5620          Depreciation - Equipment     Equipment depreciation
5630          Depreciation - Computers     IT asset depreciation

OTHER OPERATING (5700-5799)
5700          License & Permits            Business licenses
5710          Property Tax                 Municipal tax
5720          Bad Debt Expense             Uncollectible receivables
5730          Donations                    Charitable contributions
```

### Operating Expense Calculation Example (LKR)

```
Operating Expenses Summary
═════════════════════════════════════════════════════════════
Category                              Debits    Credits  Balance
─────────────────────────────────────────────────────────────
PERSONNEL COSTS
  Salaries & Wages                  180,000        -    180,000
  EPF Expense (12%)                  21,600        -     21,600
  ETF Expense (3%)                    5,400        -      5,400
  Gratuity Provision                  8,000        -      8,000
  Medical Insurance                   6,000        -      6,000
                                   ─────────  ─────────────────
  Subtotal Personnel                221,000        -    221,000

OCCUPANCY COSTS
  Rent Expense                       50,000        -     50,000
  CEB Electricity                    12,000        -     12,000
  Water Charges                       3,000        -      3,000
  Telephone & Internet                8,000        -      8,000
  Building Maintenance                5,000        -      5,000
                                   ─────────  ─────────────────
  Subtotal Occupancy                 78,000        -     78,000

ADMINISTRATIVE
  Office Supplies                     4,000        -      4,000
  Insurance Expense                   8,000        -      8,000
  Professional Fees                  15,000        -     15,000
                                   ─────────  ─────────────────
  Subtotal Administrative            27,000        -     27,000

SELLING & MARKETING
  Advertising Expense                18,000        -     18,000
  Sales Commissions                  12,000        -     12,000
  Travel & Entertainment              6,000        -      6,000
  Vehicle Expenses                    9,000        -      9,000
                                   ─────────  ─────────────────
  Subtotal Selling                   45,000        -     45,000

DEPRECIATION
  Depreciation - Equipment            8,000        -      8,000
  Depreciation - Vehicles             6,000        -      6,000
  Depreciation - Computers            3,000        -      3,000
                                   ─────────  ─────────────────
  Subtotal Depreciation              17,000        -     17,000

OTHER OPERATING
  License & Permits                   2,000        -      2,000
  Bad Debt Expense                    3,000        -      3,000
                                   ─────────  ─────────────────
  Subtotal Other                      5,000        -      5,000
─────────────────────────────────────────────────────────────
TOTAL OPERATING EXPENSES           393,000        -    393,000
═════════════════════════════════════════════════════════════
```

### Sri Lankan Statutory Requirements

| Expense Type | Calculation | Legal Basis |
|--------------|-------------|-------------|
| EPF Employer | 12% of basic + fixed allowances | EPF Act No. 15 of 1958 |
| ETF | 3% of basic + fixed allowances | ETF Act No. 46 of 1980 |
| EPF Employee | 8% (deducted from salary) | Employee contribution |
| Gratuity | ½ month per year after 5 years | Payment Terms Act |

### EPF/ETF Calculation Example

```
Employee Salary Breakdown
═════════════════════════════════════════════════════════
Basic Salary                                   150,000.00
Fixed Allowances                                30,000.00
                                             ─────────────
Total for EPF/ETF Calculation                  180,000.00

Employer Contributions:
  EPF (12%)        180,000 × 12% =              21,600.00
  ETF (3%)         180,000 × 3%  =               5,400.00
                                             ─────────────
Total Employer Contribution                     27,000.00

Employee Contribution:
  EPF (8%)         180,000 × 8%  =              14,400.00
                                             (deducted from salary)
```

### Operating Expense Ratios

| Metric | Formula | Target Range |
|--------|---------|--------------|
| OpEx Ratio | Operating Expenses / Revenue | 20-40% |
| Personnel Ratio | Personnel Costs / Revenue | 15-30% |
| Occupancy Ratio | Occupancy Costs / Revenue | 5-15% |
| Marketing Ratio | Marketing Costs / Revenue | 5-15% |

### Expected Outcome
- Method calculates total operating expenses
- Filters accounts in 5200-5799 range
- Sums all operating expense balances
- Includes EPF, ETF, and other Sri Lankan expenses
- Applies date range filters
- Uses Decimal precision
- Result cached for reuse
- Returns operating expenses in LKR

### Verification Checklist
- [ ] calculate_operating_expenses method created
- [ ] Cache check implemented
- [ ] Calls get_expense_accounts()
- [ ] Filters accounts 5200-5799
- [ ] Initializes total to Decimal('0.00')
- [ ] Loops through operating expense accounts
- [ ] Queries GL entries by account and date range
- [ ] Filters posted entries only
- [ ] Calculates debit minus credit
- [ ] Sums all operating expense balances
- [ ] Caches result
- [ ] Returns Decimal value
- [ ] Method docstring added

---

## Task 38: Add Calculate Operating Income

### Overview
Add the calculate_operating_income method that computes operating income by subtracting operating expenses from gross profit. Operating income (also called EBIT - Earnings Before Interest and Tax) shows profitability from core business operations before considering financing costs and taxes.

### Dependencies
- Task 36: Add Calculate Gross Profit
- Task 37: Add Calculate Operating Expenses

### Instructions

1. **Open profit_loss.py file**
   - Navigate to PLGenerator class
   - Add calculate_operating_income method

2. **Create method signature**
   - Method name: calculate_operating_income
   - No additional parameters
   - Returns Decimal (operating income amount)

3. **Check cache first**
   - Check if operating_income in cache
   - Return cached value if exists
   - Single calculation per report

4. **Get gross profit**
   - Call self.calculate_gross_profit()
   - Returns gross profit Decimal
   - Uses cached value if available

5. **Get operating expenses**
   - Call self.calculate_operating_expenses()
   - Returns operating expenses Decimal
   - Uses cached value if available

6. **Calculate operating income**
   - Subtract operating expenses from gross profit
   - Formula: operating_income = gross_profit - operating_expenses
   - Result can be positive (profit) or negative (loss)

7. **Handle negative operating income**
   - Negative means operating loss
   - Core business not profitable before financing
   - Still valid result, return as-is

8. **Cache and return**
   - Store result in self._cache['operating_income']
   - Return operating_income Decimal
   - Used in net income calculation

9. **Add method docstring**
   - Explain operating income definition
   - Document calculation formula
   - Note importance as EBIT measure

### Operating Income Calculation Formula

```
Operating Income = Gross Profit - Operating Expenses

Where:
  Gross Profit = Total Revenue - COGS
  Operating Expenses = Sum of accounts 5200-5799
  
Also known as: EBIT (Earnings Before Interest and Tax)
```

### Operating Income Calculation Example (LKR)

```
Operating Income Calculation
══════════════════════════════════════════════
Gross Profit                           589,000.00
Less: Operating Expenses              (393,000.00)
──────────────────────────────────────────────
OPERATING INCOME (EBIT)                196,000.00
══════════════════════════════════════════════

Operating Margin = 196,000 / 1,308,000 = 15.0%
```

### P&L Statement Position

```
PROFIT & LOSS STATEMENT
For Period: January 1-31, 2026
═════════════════════════════════════════════════════════
REVENUE
  TOTAL REVENUE                              1,308,000.00

COST OF GOODS SOLD
  TOTAL COGS                                   719,000.00
                                             ─────────────
GROSS PROFIT                                   589,000.00
                                             ═════════════

OPERATING EXPENSES
  Personnel Costs                              221,000.00
    Salaries & Wages                 180,000
    EPF Expense (12%)                 21,600
    ETF Expense (3%)                   5,400
    Gratuity Provision                 8,000
    Medical Insurance                  6,000
  
  Occupancy Costs                               78,000.00
    Rent                              50,000
    Electricity                       12,000
    Water                              3,000
    Telephone & Internet               8,000
    Maintenance                        5,000
  
  Administrative Costs                          27,000.00
  Selling & Marketing                           45,000.00
  Depreciation                                  17,000.00
  Other Operating                                5,000.00
                                             ─────────────
  TOTAL OPERATING EXPENSES                     393,000.00
                                             ─────────────
OPERATING INCOME (EBIT)                        196,000.00  ← This calculation
═════════════════════════════════════════════════════════
```

### Operating Income Scenarios

| Scenario | Gross Profit | Operating Expenses | Operating Income | Margin |
|----------|-------------|-------------------|-----------------|--------|
| Strong | 589,000 | 393,000 | 196,000 | 15.0% |
| Moderate | 589,000 | 491,000 | 98,000 | 7.5% |
| Break-even | 589,000 | 589,000 | 0 | 0.0% |
| Operating Loss | 589,000 | 688,000 | (99,000) | -7.5% |

### Operating Margin Benchmarks (Sri Lanka)

| Industry | Typical Operating Margin |
|----------|-------------------------|
| Retail | 5-10% |
| Manufacturing | 10-15% |
| Services | 15-25% |
| Technology | 20-35% |
| Hospitality | 10-20% |
| Healthcare | 15-25% |

### Operating Income Importance

| Purpose | Why It Matters |
|---------|----------------|
| Core Business Performance | Shows profitability from main operations |
| Efficiency Measure | How well company controls operating costs |
| Comparison Tool | Compare across companies (ignores financing) |
| Management Control | Managers control OpEx more than financing |
| Trend Analysis | Month-over-month operational performance |
| Creditworthiness | Lenders assess ability to service debt |

### Operating Loss Analysis

```
Operating Loss Causes
═══════════════════════════════════════════════════════════
1. Low Gross Profit
   - Poor pricing strategy
   - High COGS relative to revenue

2. High Operating Expenses
   - Excessive personnel costs
   - High rent or occupancy costs
   - Inefficient operations

3. Low Sales Volume
   - Revenue too low to cover fixed costs
   - Seasonality impact

4. Growth Phase
   - Investment in infrastructure
   - Expansion costs temporarily exceed revenue
```

### EBIT vs EBITDA

```
Calculation Comparison
═══════════════════════════════════════════════════════════
Operating Income (EBIT)                          196,000.00

Add Back:
  Depreciation                                    17,000.00
  (Non-cash expense)
                                               ─────────────
EBITDA                                           213,000.00
═══════════════════════════════════════════════════════════

EBITDA shows cash-generating ability before D&A
```

### Sri Lankan Context Considerations

| Factor | Impact on Operating Income |
|--------|---------------------------|
| EPF/ETF Rates | Higher personnel costs (15% extra) |
| Electricity Tariff | CEB rate changes affect costs |
| Fuel Prices | Transport and vehicle costs |
| Rent (Colombo) | Premium locations very expensive |
| Minimum Wage | Rising labor costs |
| Exchange Rate | Import-dependent supplies |

### Expected Outcome
- Method calculates operating income
- Subtracts operating expenses from gross profit
- Handles positive and negative results
- Uses Decimal precision
- Result cached for reuse
- Returns operating income (EBIT) in LKR
- Key profitability metric

### Verification Checklist
- [ ] calculate_operating_income method created
- [ ] Cache check implemented
- [ ] Calls calculate_gross_profit()
- [ ] Calls calculate_operating_expenses()
- [ ] Calculates gross profit minus operating expenses
- [ ] Handles negative values correctly
- [ ] Uses Decimal arithmetic
- [ ] Caches result
- [ ] Returns Decimal value
- [ ] Method docstring added

---

## Task 39: Add Calculate Other Income

### Overview
Add the calculate_other_income method that sums all non-operating income accounts (typically 4900+ range) during the P&L period. Other income includes interest income, dividend income, foreign exchange gains, and other income not related to core business operations.

### Dependencies
- Task 32: Add Get Revenue Accounts
- GeneralLedger entries for other income accounts
- Account code range 4900+ defined

### Instructions

1. **Open profit_loss.py file**
   - Navigate to PLGenerator class
   - Add calculate_other_income method

2. **Create method signature**
   - Method name: calculate_other_income
   - No additional parameters
   - Returns Decimal (other income amount)

3. **Check cache first**
   - Check if other_income in cache
   - Return cached value if exists
   - Single calculation per report

4. **Query other income accounts**
   - Query Account model by tenant
   - Filter by account_category = 'REVENUE' or 'OTHER_INCOME'
   - Filter by code >= '4900'
   - Filter is_active = True

5. **Initialize total variable**
   - Create total_other_income variable
   - Initialize to Decimal('0.00')
   - Maintain precision

6. **Loop through other income accounts**
   - Iterate over filtered accounts
   - Calculate balance for each account
   - Sum all other income balances

7. **Query GL entries for each account**
   - Filter GeneralLedger by tenant
   - Filter by account
   - Filter by date range (start_date to end_date)
   - Filter posting_status = 'POSTED'

8. **Calculate net balance**
   - Sum all credit amounts
   - Subtract all debit amounts
   - Other income is normally credit balance
   - Handle any reversals or adjustments

9. **Add to total**
   - Add account balance to total_other_income
   - Maintain running sum
   - Keep Decimal precision

10. **Cache and return**
    - Store result in self._cache['other_income']
    - Return total_other_income Decimal
    - Used in net income calculation

### Other Income Calculation Formula

```
Other Income = Σ (Credits - Debits) for accounts 4900+

For each other income account:
  Account Balance = Σ Credit Entries - Σ Debit Entries
  
Total Other Income = Sum of all other income account balances
```

### Other Income Account Categories

| Account Code Range | Category | Description |
|-------------------|----------|-------------|
| 4900-4909 | Interest Income | Bank interest, deposits |
| 4910-4919 | Dividend Income | Investment dividends |
| 4920-4929 | Foreign Exchange Gains | FX gains realized |
| 4930-4939 | Investment Gains | Gains on asset sales |
| 4940-4949 | Rental Income - Non-Operating | Non-core property rental |
| 4950-4959 | Miscellaneous Income | Other non-operating income |

### Other Income Examples (Sri Lankan Context)

```
Account Code  Account Name                 Description
═══════════════════════════════════════════════════════════════
4900          Interest Income - Bank       Savings account interest
4901          Interest Income - FD         Fixed deposit interest
4905          Interest on Loans Given      Interest from receivables
4910          Dividend Income              Stock dividends
4920          Foreign Exchange Gain        Realized FX gains
4930          Gain on Asset Sale           Profit from asset disposal
4940          Scrap Sales                  Waste material sales
4950          Sundry Income                Miscellaneous income
```

### Other Income Calculation Example (LKR)

```
Other Income Summary
═════════════════════════════════════════════════════════════
Account  Name                       Credits    Debits   Balance
─────────────────────────────────────────────────────────────
4900     Interest Income - Bank      2,500        -      2,500
4901     Interest Income - FD        8,000        -      8,000
4920     Foreign Exchange Gain       3,500        -      3,500
4930     Gain on Asset Sale          5,000        -      5,000
4950     Sundry Income               1,000        -      1,000
─────────────────────────────────────────────────────────────
TOTAL OTHER INCOME                  20,000        -     20,000
═════════════════════════════════════════════════════════════
```

### P&L Statement Position

```
PROFIT & LOSS STATEMENT (Continued)
═════════════════════════════════════════════════════════
OPERATING INCOME (EBIT)                        196,000.00

OTHER INCOME
  Interest Income - Bank                         2,500.00
  Interest Income - FD                           8,000.00
  Foreign Exchange Gain                          3,500.00
  Gain on Asset Sale                             5,000.00
  Sundry Income                                  1,000.00
                                             ─────────────
  TOTAL OTHER INCOME                            20,000.00  ← This calculation
═════════════════════════════════════════════════════════
```

### Interest Income Examples (Sri Lanka)

| Source | Type | Tax Treatment |
|--------|------|---------------|
| Savings Account | Bank interest | WHT 5% |
| Fixed Deposit | FD interest | WHT 5% or 8% |
| Treasury Bills | Government securities | Varies by tenor |
| Corporate Debentures | Bond interest | WHT 10% |
| Loans to Employees | Interest charged | Fully taxable |

### Interest Income Calculation

```
Fixed Deposit Interest Calculation
═══════════════════════════════════════════════════════
Principal Amount                             1,000,000
Interest Rate (Annual)                            10%
Period                                        6 months
                                           ─────────────
Gross Interest                                  50,000
Less: WHT @ 5%                                  (2,500)
                                           ─────────────
Net Interest Received                           47,500

Book Entry:
  Debit:  Bank Account                          47,500
  Debit:  WHT Receivable                         2,500
  Credit: Interest Income (4901)                50,000
═══════════════════════════════════════════════════════
```

### Foreign Exchange Gain Example

```
FX Gain on Export Receipt
═══════════════════════════════════════════════════════
Export Invoice                         USD 10,000
Exchange Rate at Invoice Date            LKR 310
Receivable Booked                      3,100,000

Payment Received Date                  (30 days later)
Exchange Rate at Receipt                 LKR 315
Amount Received                        3,150,000
                                      ─────────────
Foreign Exchange Gain                     50,000

Book Entry:
  Debit:  Bank Account                  3,150,000
  Credit: Accounts Receivable           3,100,000
  Credit: FX Gain (4920)                   50,000
═══════════════════════════════════════════════════════
```

### Asset Sale Gain Calculation

```
Gain on Asset Sale
═══════════════════════════════════════════════════════
Asset: Vehicle
Original Cost                              2,000,000
Accumulated Depreciation                  (1,200,000)
                                         ─────────────
Net Book Value                               800,000

Sale Price                                 1,000,000
Less: Net Book Value                        (800,000)
                                         ─────────────
Gain on Sale                                 200,000

Book Entry:
  Debit:  Bank                            1,000,000
  Debit:  Accumulated Depreciation        1,200,000
  Credit: Asset - Vehicle                 2,000,000
  Credit: Gain on Asset Sale (4930)         200,000
═══════════════════════════════════════════════════════
```

### Sri Lankan Tax Implications

| Income Type | Tax Rate | Tax Type |
|-------------|----------|----------|
| Interest Income | 5% or 8% WHT | Withholding Tax |
| Dividend Income | 14% WHT | Withholding Tax |
| FX Gains | Taxable at corporate rate | Part of taxable profit |
| Asset Sale Gains | Taxable at corporate rate | Capital gains |

### Expected Outcome
- Method calculates total other income
- Filters accounts in 4900+ range
- Sums all non-operating income
- Applies date range filters
- Handles various income types
- Uses Decimal precision
- Result cached for reuse
- Returns other income in LKR

### Verification Checklist
- [ ] calculate_other_income method created
- [ ] Cache check implemented
- [ ] Queries accounts >= '4900'
- [ ] Filters by revenue/other income category
- [ ] Filters active accounts only
- [ ] Initializes total to Decimal('0.00')
- [ ] Loops through other income accounts
- [ ] Queries GL entries by account and date range
- [ ] Filters posted entries only
- [ ] Calculates credit minus debit
- [ ] Sums all other income balances
- [ ] Caches result
- [ ] Returns Decimal value
- [ ] Method docstring added

---

## Task 40: Add Calculate Other Expenses

### Overview
Add the calculate_other_expenses method that sums all non-operating expense accounts (typically 5800-5899 range) during the P&L period. Other expenses include interest expense, bank charges, foreign exchange losses, and other costs not related to core business operations.

### Dependencies
- Task 33: Add Get Expense Accounts
- GeneralLedger entries for other expense accounts
- Account code range 5800-5899 defined

### Instructions

1. **Open profit_loss.py file**
   - Navigate to PLGenerator class
   - Add calculate_other_expenses method

2. **Create method signature**
   - Method name: calculate_other_expenses
   - No additional parameters
   - Returns Decimal (other expenses amount)

3. **Check cache first**
   - Check if other_expenses in cache
   - Return cached value if exists
   - Single calculation per report

4. **Get expense accounts**
   - Call self.get_expense_accounts()
   - Uses cached expense accounts
   - Will filter to other expense range

5. **Filter other expense accounts**
   - From expense accounts, filter code >= '5800' AND <= '5899'
   - Excludes COGS (5100-5199)
   - Excludes operating expenses (5200-5799)

6. **Initialize total variable**
   - Create total_other_expenses variable
   - Initialize to Decimal('0.00')
   - Maintain precision

7. **Loop through other expense accounts**
   - Iterate over filtered accounts
   - Calculate balance for each account
   - Sum all other expense balances

8. **Query GL entries for each account**
   - Filter GeneralLedger by tenant
   - Filter by account
   - Filter by date range (start_date to end_date)
   - Filter posting_status = 'POSTED'

9. **Calculate net balance**
   - Sum all debit amounts
   - Subtract all credit amounts
   - Other expenses are normally debits
   - Credits may be reversals or refunds

10. **Add to total**
    - Add account balance to total_other_expenses
    - Maintain running sum
    - Keep Decimal precision

11. **Cache and return**
    - Store result in self._cache['other_expenses']
    - Return total_other_expenses Decimal
    - Used in net income calculation

### Other Expenses Calculation Formula

```
Other Expenses = Σ (Debits - Credits) for accounts 5800-5899

For each other expense account:
  Account Balance = Σ Debit Entries - Σ Credit Entries
  
Total Other Expenses = Sum of all other expense account balances
```

### Other Expense Account Categories

| Account Code Range | Category | Description |
|-------------------|----------|-------------|
| 5800-5809 | Interest Expense | Loan interest, overdraft |
| 5810-5819 | Bank Charges | Transaction fees, service charges |
| 5820-5829 | Foreign Exchange Losses | FX losses realized |
| 5830-5839 | Investment Losses | Losses on asset sales |
| 5840-5849 | Penalties & Fines | Late fees, regulatory fines |
| 5850-5859 | Miscellaneous Expenses | Other non-operating costs |

### Other Expense Examples (Sri Lankan Context)

```
Account Code  Account Name                    Description
════════════════════════════════════════════════════════════════
5800          Interest Expense - Bank Loan    Loan interest payments
5801          Interest Expense - Overdraft    OD interest charges
5805          Interest on Late Payments       Supplier late fees
5810          Bank Charges                    Transaction fees
5811          Credit Card Charges             Merchant fees
5820          Foreign Exchange Loss           Realized FX losses
5830          Loss on Asset Sale              Loss from asset disposal
5840          IRD Penalties                   Tax late payment penalties
5841          EPF/ETF Late Fees               Statutory payment fines
5850          Miscellaneous Expenses          Other non-operating costs
```

### Other Expense Calculation Example (LKR)

```
Other Expenses Summary
═════════════════════════════════════════════════════════════
Account  Name                        Debits    Credits  Balance
─────────────────────────────────────────────────────────────
5800     Interest Expense - Loan     12,000        -     12,000
5801     Interest Expense - OD        3,500        -      3,500
5810     Bank Charges                 2,000        -      2,000
5820     Foreign Exchange Loss        4,500        -      4,500
5840     IRD Penalties                1,000        -      1,000
5850     Miscellaneous Expenses         500        -        500
─────────────────────────────────────────────────────────────
TOTAL OTHER EXPENSES                23,500        -     23,500
═════════════════════════════════════════════════════════════
```

### P&L Statement Position

```
PROFIT & LOSS STATEMENT (Continued)
═════════════════════════════════════════════════════════
OPERATING INCOME (EBIT)                        196,000.00

OTHER INCOME                                    20,000.00
                                             ─────────────
                                               216,000.00

OTHER EXPENSES
  Interest Expense - Loan                       12,000.00
  Interest Expense - Overdraft                   3,500.00
  Bank Charges                                   2,000.00
  Foreign Exchange Loss                          4,500.00
  IRD Penalties                                  1,000.00
  Miscellaneous Expenses                           500.00
                                             ─────────────
  TOTAL OTHER EXPENSES                          23,500.00  ← This calculation
═════════════════════════════════════════════════════════
```

### Interest Expense Examples (Sri Lanka)

| Loan Type | Typical Rate (2026) | Calculation Basis |
|-----------|-------------------|-------------------|
| Term Loan | 12-18% p.a. | Reducing balance |
| Overdraft | 15-20% p.a. | Daily balance |
| Pawning | 12-15% p.a. | Flat rate |
| Credit Card | 24-36% p.a. | Outstanding balance |
| Leasing | 10-15% p.a. | Flat or reducing |

### Interest Expense Calculation

```
Bank Loan Interest Calculation
═══════════════════════════════════════════════════════
Loan Amount                                  2,000,000
Interest Rate (Annual)                            15%
Payment Frequency                             Monthly
Loan Term                                     5 years

Monthly Interest Rate = 15% / 12 = 1.25%
Monthly Payment (Principal + Interest)

Month 1:
  Opening Balance                           2,000,000
  Interest @ 1.25%                             25,000
  Principal Payment                            15,000
  Closing Balance                           1,985,000

Book Entry for Interest:
  Debit:  Interest Expense (5800)              25,000
  Credit: Bank Loan Payable                    15,000
  Credit: Bank Account                         40,000
═══════════════════════════════════════════════════════
```

### Bank Charges Examples (Sri Lanka)

| Charge Type | Typical Fee | Frequency |
|-------------|------------|-----------|
| Account Maintenance | LKR 500-1,000 | Monthly |
| Transaction Fees | LKR 10-50 per transaction | Per transaction |
| SLIPS Payment | LKR 5 per payment | Per use |
| CEFT Transfer | LKR 25-100 | Per transfer |
| Foreign Remittance | 0.1-0.25% + fees | Per transaction |
| Credit Card MDR | 2-3% of sale | Per transaction |
| Checkbook Charges | LKR 500-1,000 | Per checkbook |

### Foreign Exchange Loss Example

```
FX Loss on Import Payment
═══════════════════════════════════════════════════════
Import Invoice                         USD 10,000
Exchange Rate at Invoice Date            LKR 310
Payable Booked                         3,100,000

Payment Made Date                      (60 days later)
Exchange Rate at Payment                 LKR 320
Amount Paid                            3,200,000
                                      ─────────────
Foreign Exchange Loss                    100,000

Book Entry:
  Debit:  Accounts Payable              3,100,000
  Debit:  FX Loss (5820)                  100,000
  Credit: Bank Account                  3,200,000
═══════════════════════════════════════════════════════
```

### Penalties and Fines (Sri Lanka)

| Penalty Type | Cause | Typical Amount |
|--------------|-------|----------------|
| IRD Late Payment | Tax paid after due date | 2% per month |
| EPF Late Payment | Contribution submitted late | 12% p.a. on arrears |
| ETF Late Payment | Contribution submitted late | Statutory penalty |
| VAT Late Filing | VAT return filed late | LKR 10,000 per month |
| Municipal Tax | Property tax not paid | Varies by council |

### Asset Sale Loss Calculation

```
Loss on Asset Sale
═══════════════════════════════════════════════════════
Asset: Equipment
Original Cost                              1,500,000
Accumulated Depreciation                    (900,000)
                                         ─────────────
Net Book Value                               600,000

Sale Price                                   450,000
Less: Net Book Value                        (600,000)
                                         ─────────────
Loss on Sale                                (150,000)

Book Entry:
  Debit:  Bank                              450,000
  Debit:  Accumulated Depreciation          900,000
  Debit:  Loss on Asset Sale (5830)         150,000
  Credit: Asset - Equipment               1,500,000
═══════════════════════════════════════════════════════
```

### Expected Outcome
- Method calculates total other expenses
- Filters accounts in 5800-5899 range
- Sums all non-operating expenses
- Includes interest, bank charges, FX losses
- Applies date range filters
- Uses Decimal precision
- Result cached for reuse
- Returns other expenses in LKR

### Verification Checklist
- [ ] calculate_other_expenses method created
- [ ] Cache check implemented
- [ ] Calls get_expense_accounts()
- [ ] Filters accounts 5800-5899
- [ ] Initializes total to Decimal('0.00')
- [ ] Loops through other expense accounts
- [ ] Queries GL entries by account and date range
- [ ] Filters posted entries only
- [ ] Calculates debit minus credit
- [ ] Sums all other expense balances
- [ ] Caches result
- [ ] Returns Decimal value
- [ ] Method docstring added

---

## Task 41: Add Calculate Net Income

### Overview
Add the calculate_net_income method that computes the final net income (net profit or net loss) by combining operating income, other income, and other expenses. Net income represents the company's bottom line profit after all revenues and expenses have been accounted for, before income tax.

### Dependencies
- Task 38: Add Calculate Operating Income
- Task 39: Add Calculate Other Income
- Task 40: Add Calculate Other Expenses

### Instructions

1. **Open profit_loss.py file**
   - Navigate to PLGenerator class
   - Add calculate_net_income method

2. **Create method signature**
   - Method name: calculate_net_income
   - No additional parameters
   - Returns Decimal (net income amount)

3. **Check cache first**
   - Check if net_income in cache
   - Return cached value if exists
   - Single calculation per report

4. **Get operating income**
   - Call self.calculate_operating_income()
   - Returns operating income (EBIT) Decimal
   - Uses cached value if available

5. **Get other income**
   - Call self.calculate_other_income()
   - Returns non-operating income Decimal
   - Uses cached value if available

6. **Get other expenses**
   - Call self.calculate_other_expenses()
   - Returns non-operating expenses Decimal
   - Uses cached value if available

7. **Calculate net income**
   - Formula: net_income = operating_income + other_income - other_expenses
   - Combine all three components
   - Result can be positive (profit) or negative (loss)

8. **Handle negative net income**
   - Negative means net loss for the period
   - Company lost money overall
   - Still valid result, return as-is

9. **Cache and return**
   - Store result in self._cache['net_income']
   - Return net_income Decimal
   - This is the P&L bottom line

10. **Add method docstring**
    - Explain net income definition
    - Document calculation formula
    - Note this is before income tax

### Net Income Calculation Formula

```
Net Income = Operating Income + Other Income - Other Expenses

Where:
  Operating Income = Gross Profit - Operating Expenses
  Other Income = Non-operating income (interest, dividends, FX gains)
  Other Expenses = Non-operating expenses (interest, bank charges, FX losses)

Also known as: Net Profit Before Tax (NPBT) or Earnings Before Tax (EBT)
```

### Net Income Calculation Example (LKR)

```
Net Income Calculation
══════════════════════════════════════════════
Operating Income (EBIT)                196,000.00
Add: Other Income                       20,000.00
                                     ─────────────
                                       216,000.00
Less: Other Expenses                   (23,500.00)
══════════════════════════════════════════════
NET INCOME BEFORE TAX                  192,500.00
══════════════════════════════════════════════

Net Profit Margin = 192,500 / 1,308,000 = 14.7%
```

### Complete P&L Statement

```
PROFIT & LOSS STATEMENT
For Period: January 1-31, 2026
═════════════════════════════════════════════════════════
REVENUE
  Sales Revenue - Local                        838,000.00
  Sales Revenue - Export                       250,000.00
  Service Revenue                              145,000.00
  Rental Income                                 50,000.00
  Commission Income                             25,000.00
                                             ─────────────
  TOTAL REVENUE                              1,308,000.00
                                             ═════════════

COST OF GOODS SOLD
  Purchases - Local                            442,000.00
  Purchases - Import                           180,000.00
  Import Duties                                 25,000.00
  Direct Labor                                  65,000.00
  Freight Inward                                12,000.00
  Purchase Returns                              (5,000.00)
                                             ─────────────
  TOTAL COGS                                   719,000.00
                                             ─────────────
GROSS PROFIT                                   589,000.00
                                             ═════════════

OPERATING EXPENSES
  Personnel Costs                              221,000.00
  Occupancy Costs                               78,000.00
  Administrative Costs                          27,000.00
  Selling & Marketing                           45,000.00
  Depreciation                                  17,000.00
  Other Operating                                5,000.00
                                             ─────────────
  TOTAL OPERATING EXPENSES                     393,000.00
                                             ─────────────
OPERATING INCOME (EBIT)                        196,000.00
                                             ═════════════

OTHER INCOME
  Interest Income                               10,500.00
  Foreign Exchange Gain                          3,500.00
  Gain on Asset Sale                             5,000.00
  Sundry Income                                  1,000.00
                                             ─────────────
  TOTAL OTHER INCOME                            20,000.00

OTHER EXPENSES
  Interest Expense                              15,500.00
  Bank Charges                                   2,000.00
  Foreign Exchange Loss                          4,500.00
  Penalties                                      1,000.00
  Miscellaneous Expenses                           500.00
                                             ─────────────
  TOTAL OTHER EXPENSES                          23,500.00
                                             ─────────────
NET INCOME BEFORE TAX                          192,500.00  ← Final Result
═════════════════════════════════════════════════════════
```

### Net Income Scenarios

| Scenario | Operating Income | Other Income | Other Expenses | Net Income | Status |
|----------|-----------------|--------------|----------------|------------|--------|
| Strong Profit | 196,000 | 20,000 | 23,500 | 192,500 | Profitable |
| Moderate Profit | 100,000 | 10,000 | 20,000 | 90,000 | Profitable |
| Break-even | 50,000 | 5,000 | 55,000 | 0 | Break-even |
| Net Loss | 30,000 | 5,000 | 60,000 | (25,000) | Loss |

### Profitability Ratios

| Ratio | Formula | Example Calculation |
|-------|---------|-------------------|
| Net Profit Margin | (Net Income / Revenue) × 100 | (192,500 / 1,308,000) × 100 = 14.7% |
| Return on Sales | Net Income / Revenue | 192,500 / 1,308,000 = 0.147 |
| Operating Margin | (Operating Income / Revenue) × 100 | (196,000 / 1,308,000) × 100 = 15.0% |
| Gross Margin | (Gross Profit / Revenue) × 100 | (589,000 / 1,308,000) × 100 = 45.0% |

### Industry Benchmarks (Sri Lankan Context)

| Industry | Typical Net Margin | Good Performance |
|----------|-------------------|------------------|
| Retail | 3-8% | >10% |
| Manufacturing | 8-15% | >15% |
| Services | 10-20% | >20% |
| Technology | 15-30% | >30% |
| Hospitality | 5-15% | >15% |

### After-Tax Calculation (Optional Context)

```
Complete Income Statement with Tax
═════════════════════════════════════════════════════════
NET INCOME BEFORE TAX                          192,500.00

Less: Income Tax Expense
  Corporate Tax @ 30%                           57,750.00
                                             ─────────────
NET INCOME AFTER TAX                           134,750.00
═════════════════════════════════════════════════════════

Tax Rate: 30% (Standard corporate tax rate in Sri Lanka)
Note: Tax calculation is separate task (not in this document)
```

### Loss Analysis Framework

```
Net Loss Investigation
═══════════════════════════════════════════════════════════
If Net Income < 0, analyze:

1. Revenue Problems
   - Low sales volume
   - Price competition
   - Market conditions

2. Gross Profit Issues
   - High COGS
   - Poor supplier terms
   - Inventory losses

3. Operating Expense Problems
   - Excessive personnel costs
   - High rent/utilities
   - Inefficient operations

4. Financing Costs
   - High interest expense
   - Poor debt management
   - FX losses
```

### Sri Lankan Tax Considerations

| Tax Type | Rate | Application |
|----------|------|-------------|
| Corporate Income Tax | 30% | On taxable profit |
| Economic Service Charge (ESC) | 0.5% of turnover | Minimum tax |
| VAT | 18% | On taxable supplies |
| NBT | 2% of turnover | Nation Building Tax |
| WHT on Dividends | 14% | When distributing profits |

### Expected Outcome
- Method calculates final net income
- Combines operating income, other income, other expenses
- Handles profit and loss scenarios
- Uses Decimal precision
- Result cached for reuse
- Returns net income (bottom line) in LKR
- Before-tax profit figure

### Verification Checklist
- [ ] calculate_net_income method created
- [ ] Cache check implemented
- [ ] Calls calculate_operating_income()
- [ ] Calls calculate_other_income()
- [ ] Calls calculate_other_expenses()
- [ ] Calculates: operating_income + other_income - other_expenses
- [ ] Handles negative values (losses) correctly
- [ ] Uses Decimal arithmetic
- [ ] Caches result
- [ ] Returns Decimal value
- [ ] Method docstring added

---

## Summary

This document established the core calculation engine for the Profit & Loss Statement:

### Completed Infrastructure
- ✅ PLGenerator class extending BaseReportGenerator
- ✅ Revenue account retrieval (4xxx accounts)
- ✅ Expense account retrieval (5xxx accounts)
- ✅ Revenue total calculation
- ✅ Cost of Goods Sold calculation (5100-5199)
- ✅ Gross profit calculation (Revenue - COGS)
- ✅ Operating expenses calculation (5200-5799)
- ✅ Operating income calculation (Gross Profit - OpEx)
- ✅ Other income calculation (4900+ accounts)
- ✅ Other expenses calculation (5800-5899)
- ✅ Net income calculation (final bottom line)

### Key Achievements
1. **Comprehensive Calculations** - All P&L components computed
2. **Sri Lankan Compliance** - EPF/ETF, import duties, LKR context
3. **Account Categorization** - Proper COGS, OpEx, and other items
4. **Performance Optimization** - Caching mechanism for efficiency
5. **Decimal Precision** - Financial-grade accuracy

### Calculation Hierarchy
```
Revenue (4xxx)
  - COGS (5100-5199)
    = Gross Profit
      - Operating Expenses (5200-5799)
        = Operating Income
          + Other Income (4900+)
          - Other Expenses (5800-5899)
            = Net Income
```

### Next Steps
Proceed to [02_Tasks-42-48_PL-Comparison-Output.md](02_Tasks-42-48_PL-Comparison-Output.md) to implement data structure, period comparison, variance analysis, percentage calculations, HTML template, PDF generation, and API endpoint.

---

**Document Status:** ✅ Complete  
**Total Tasks:** 11  
**Total Lines:** ~990
