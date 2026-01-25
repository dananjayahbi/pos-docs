# Tasks 17-24: TrialBalance Generator and Calculations

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 11 - Financial Reports  
> **Group:** B - Trial Balance Report  
> **Document:** 01 of 02  
> **Tasks Covered:** 17, 18, 19, 20, 21, 22, 23, 24

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-25-30_TB-Comparison-Output.md](02_Tasks-25-30_TB-Comparison-Output.md)
- **→ Next Group:** [Group-C_Profit-Loss-Statement](../Group-C_Profit-Loss-Statement/)

---

## Document Overview

This document covers the foundation of the Trial Balance report generator, including the TrialBalanceGenerator class that extends BaseReportGenerator, methods for retrieving accounts, calculating opening balances from prior periods, computing period movements (debits and credits), determining closing balances, grouping accounts by type, and validating totals to ensure double-entry integrity.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 17 | Create TrialBalanceGenerator | Medium | 30 min |
| 18 | Add Get All Accounts Method | Low | 15 min |
| 19 | Add Calculate Balance Method | Medium | 25 min |
| 20 | Add Opening Balance Calc | Medium | 30 min |
| 21 | Add Period Movement Calc | Medium | 30 min |
| 22 | Add Closing Balance Calc | Low | 15 min |
| 23 | Add Account Type Grouping | Medium | 25 min |
| 24 | Add Totals Validation | Low | 20 min |

---

## Task 17: Create TrialBalanceGenerator

### Overview
Create the TrialBalanceGenerator class that extends BaseReportGenerator. This class serves as the core engine for generating Trial Balance reports, orchestrating account retrieval, balance calculations, grouping, and validation. The Trial Balance is the foundational financial report that lists all accounts with their opening, period movement, and closing balances.

### Dependencies
- Task 16: BaseReportGenerator created in Group A
- Account model exists with MPTT tree structure
- JournalEntry and JournalEntryLine models exist
- ReportPeriod constants defined
- Django ORM configured

### Instructions

1. **Create trial_balance.py file**
   - Navigate to `apps/accounting/reports/` directory
   - Create file named `trial_balance.py`
   - This will contain all Trial Balance report logic

2. **Import required modules**
   - Import BaseReportGenerator from base module
   - Import Account model
   - Import JournalEntry and JournalEntryLine models
   - Import Django aggregation functions (Sum, Q)
   - Import Decimal for precise calculations
   - Import datetime utilities

3. **Define TrialBalanceGenerator class**
   - Inherit from BaseReportGenerator
   - Add comprehensive class docstring
   - Explain Trial Balance purpose and structure

4. **Initialize report metadata**
   - Override report_name as "Trial Balance"
   - Set report_code as "TB"
   - Set report_category as "financial"
   - Define supported period types (month, quarter, year)

5. **Add __init__ method**
   - Accept tenant parameter
   - Accept optional start_date and end_date
   - Accept optional comparison_mode flag
   - Call parent __init__ method
   - Initialize internal data structures

6. **Create internal data storage**
   - Define self.accounts_data as empty list
   - Define self.account_balances as empty dictionary
   - Define self.totals as empty dictionary
   - These will store calculation results

7. **Add generate method override**
   - Override parent generate method
   - Orchestrate full report generation flow
   - Call methods in proper sequence
   - Return structured report data

8. **Define generation flow sequence**
   - Validate date range
   - Get all accounts
   - Calculate balances for each account
   - Group by account type
   - Validate totals
   - Return formatted data

9. **Add method placeholders**
   - Define placeholder for get_accounts method
   - Define placeholder for calculate_balance method
   - Define placeholder for group_by_type method
   - Define placeholder for validate_totals method
   - Will implement in subsequent tasks

10. **Update reports/__init__.py**
    - Import TrialBalanceGenerator
    - Add to __all__ list
    - Make available for imports

### TrialBalanceGenerator Structure

```
┌──────────────────────────────────────────────────┐
│       TrialBalanceGenerator Class                │
├──────────────────────────────────────────────────┤
│ Inherits from: BaseReportGenerator               │
│                                                  │
│ Report Metadata:                                 │
│  • report_name = "Trial Balance"                 │
│  • report_code = "TB"                            │
│  • report_category = "financial"                 │
│                                                  │
│ Internal Storage:                                │
│  • accounts_data (list)                          │
│  • account_balances (dict)                       │
│  • totals (dict)                                 │
│                                                  │
│ Key Methods:                                     │
│  • generate() - Main orchestration               │
│  • get_accounts() - Retrieve accounts            │
│  • calculate_balance() - Per-account calc        │
│  • calculate_opening_balance() - Prior periods   │
│  • calculate_period_movements() - Current period │
│  • calculate_closing_balance() - Final balance   │
│  • group_by_type() - Type grouping               │
│  • validate_totals() - Double-entry check        │
└──────────────────────────────────────────────────┘
```

### Report Generation Flow

```
┌────────────────────────────────────────────┐
│  TrialBalanceGenerator.generate()          │
└────────────────────────────────────────────┘
                    │
                    ▼
         ┌──────────────────────┐
         │  Validate Date Range │
         └──────────────────────┘
                    │
                    ▼
         ┌──────────────────────┐
         │   Get All Accounts   │  ← Task 18
         └──────────────────────┘
                    │
                    ▼
         ┌──────────────────────┐
         │ Calculate Balance    │  ← Task 19
         │ (for each account)   │
         └──────────────────────┘
                    │
                    ▼
         ┌──────────────────────┐
         │ Group by Type        │  ← Task 23
         └──────────────────────┘
                    │
                    ▼
         ┌──────────────────────┐
         │  Validate Totals     │  ← Task 24
         └──────────────────────┘
                    │
                    ▼
         ┌──────────────────────┐
         │  Return Report Data  │
         └──────────────────────┘
```

### Class Hierarchy

```
┌────────────────────────┐
│   BaseReportGenerator  │  ← Base class (Group A)
└────────────────────────┘
            │
            │ extends
            ▼
┌────────────────────────┐
│ TrialBalanceGenerator  │  ← This task
└────────────────────────┘
            │
            │ uses
            ▼
┌────────────────────────┐
│   Account Model        │
│   JournalEntryLine     │
└────────────────────────┘
```

### Trial Balance Purpose

The Trial Balance is a fundamental accounting report that serves multiple purposes:

| Purpose | Description |
|---------|-------------|
| Verify accuracy | Ensure debits equal credits (double-entry integrity) |
| Prepare statements | Foundation for Income Statement and Balance Sheet |
| Detect errors | Identify posting or calculation mistakes |
| Audit support | Provide detailed account balances for auditors |
| Management review | Quick overview of all account balances |

### Report Period Types

| Period Type | Date Range | Sri Lankan Fiscal Context |
|------------|------------|---------------------------|
| Month | 1st to last day | Standard monthly reporting |
| Quarter | 3 months (Apr-Jun, Jul-Sep, Oct-Dec, Jan-Mar) | IRD quarterly VAT returns |
| Year | Apr 1 - Mar 31 | Sri Lankan fiscal year |
| Custom | User-defined range | Special purpose reporting |

### Trial Balance Columns

```
╔════════════════════════════════════════════════════════════════════╗
║  Account  │  Opening  │  Opening  │  Period  │  Period  │  Closing │  Closing  ║
║  Number   │  Debit    │  Credit   │  Debit   │  Credit  │  Debit   │  Credit   ║
╠═══════════╪═══════════╪═══════════╪══════════╪══════════╪══════════╪═══════════╣
║  1100     │   10,000  │           │    5,000 │    2,000 │   13,000 │           ║
║  1200     │    5,000  │           │    3,000 │    1,000 │    7,000 │           ║
║  2100     │           │     8,000 │    2,000 │    4,000 │          │    10,000 ║
║  ...      │           │           │          │          │          │           ║
╠═══════════╧═══════════╧═══════════╧══════════╧══════════╧══════════╧═══════════╣
║  TOTALS   │   XX,XXX  │   XX,XXX  │   XX,XXX │   XX,XXX │   XX,XXX │   XX,XXX  ║
╚════════════════════════════════════════════════════════════════════════════════╝
```

### Sri Lankan Context

| Aspect | Requirement | Implementation |
|--------|-------------|----------------|
| Currency | All amounts in LKR | Use LKR currency symbol in output |
| Fiscal Year | April 1 - March 31 | Default year period to Apr-Mar |
| IRD Compliance | Annual audited financials | Trail Balance supports audit trail |
| VAT Returns | Quarterly reporting | Support quarterly period selection |
| Number Format | 1,234,567.89 | Use comma thousands separator |

### Expected Outcome
- Functional TrialBalanceGenerator class
- Proper inheritance from BaseReportGenerator
- Clear generation flow orchestration
- Foundation for balance calculations
- Support for Sri Lankan fiscal calendar

### Verification Checklist
- [ ] trial_balance.py file created
- [ ] TrialBalanceGenerator class defined
- [ ] Inherits from BaseReportGenerator
- [ ] Report metadata initialized
- [ ] __init__ method implemented
- [ ] Internal data structures defined
- [ ] generate method orchestration defined
- [ ] Method placeholders created
- [ ] Class imported in __init__.py
- [ ] Class docstring comprehensive

---

## Task 18: Add Get All Accounts Method

### Overview
Implement the get_accounts method in TrialBalanceGenerator to retrieve all active accounts for the tenant. This method fetches accounts in proper order (sorted by account code), respects the account hierarchy, and optionally filters by account type. Only active accounts with is_active=True are included.

### Dependencies
- Task 17: Create TrialBalanceGenerator
- Account model with MPTT tree structure
- TenantAwareMixin on Account model

### Instructions

1. **Open trial_balance.py file**
   - Navigate to `apps/accounting/reports/trial_balance.py`
   - Locate TrialBalanceGenerator class

2. **Define get_accounts method**
   - Create method with self parameter
   - Accept optional account_types filter parameter
   - Add method docstring explaining purpose

3. **Build base queryset**
   - Start with Account.objects.filter(tenant=self.tenant)
   - Filter by is_active=True
   - Only include active accounts in report

4. **Apply account type filter**
   - If account_types parameter provided
   - Filter by account_type__in=account_types
   - Allows generating partial reports

5. **Add tree ordering**
   - Use MPPT tree_queryset or order_by
   - Order by tree_id, lft (for hierarchy)
   - Secondary order by code (for same level)

6. **Select related data**
   - Use select_related for account_type
   - Use prefetch_related for parent relationships
   - Optimize database queries

7. **Add prefetch for journal lines**
   - Prefetch related journal entry lines
   - Filter by date range if needed
   - Optimize balance calculation queries

8. **Return queryset**
   - Return ordered, filtered queryset
   - Ready for iteration in balance calculations

9. **Handle edge cases**
   - Empty account list (no active accounts)
   - Invalid account_types parameter
   - Return empty queryset gracefully

### Account Retrieval Logic

```
┌─────────────────────────────────────────┐
│     Get All Accounts Method Flow        │
└─────────────────────────────────────────┘
                │
                ▼
      ┌──────────────────────┐
      │  Base Query: tenant  │
      │  + is_active=True    │
      └──────────────────────┘
                │
                ▼
      ┌──────────────────────┐
      │  Filter by Types?    │───No──┐
      └──────────────────────┘       │
                │ Yes                │
                ▼                    │
      ┌──────────────────────┐       │
      │  Apply Type Filter   │       │
      └──────────────────────┘       │
                │                    │
                └────────┬───────────┘
                         ▼
               ┌──────────────────────┐
               │  Order by Tree + Code│
               └──────────────────────┘
                         │
                         ▼
               ┌──────────────────────┐
               │  Select/Prefetch     │
               │  Related Data        │
               └──────────────────────┘
                         │
                         ▼
               ┌──────────────────────┐
               │   Return Queryset    │
               └──────────────────────┘
```

### Account Ordering

```
MPTT Tree Structure:
═══════════════════════

1000 - Assets (root)
  ├── 1100 - Current Assets (child)
  │     ├── 1110 - Cash (grandchild)
  │     ├── 1120 - Bank (grandchild)
  │     └── 1130 - Accounts Receivable (grandchild)
  └── 1200 - Fixed Assets (child)
        ├── 1210 - Land (grandchild)
        └── 1220 - Building (grandchild)

2000 - Liabilities (root)
  ├── 2100 - Current Liabilities
  └── 2200 - Long-term Liabilities

Result Order (tree_id, lft, code):
1000, 1100, 1110, 1120, 1130, 1200, 1210, 1220, 2000, 2100, 2200...
```

### Query Optimization

| Technique | Purpose | Benefit |
|-----------|---------|---------|
| select_related('account_type') | Join account type | Avoid N+1 queries |
| prefetch_related('parent') | Load hierarchy | Optimize tree traversal |
| filter(is_active=True) | Active only | Exclude closed accounts |
| order_by('tree_id', 'lft', 'code') | Hierarchy order | Proper sequence |

### Account Type Filtering

```python
# All accounts
accounts = generator.get_accounts()

# Only Assets and Liabilities
accounts = generator.get_accounts(
    account_types=['ASSET', 'LIABILITY']
)

# Single type
accounts = generator.get_accounts(
    account_types=['EXPENSE']
)
```

### Active vs Inactive Accounts

| Account State | is_active | Include in TB? | Reason |
|--------------|-----------|----------------|---------|
| Active | True | Yes | Normal account |
| Inactive | False | No | Closed/archived |
| New (no activity) | True | Yes | May have zero balance |
| Historical | False | No | Past fiscal years |

### Sri Lankan Chart of Accounts

Typical account code ranges:

| Range | Type | Example |
|-------|------|---------|
| 1000-1999 | Assets | 1110 - Petty Cash |
| 2000-2999 | Liabilities | 2100 - Accounts Payable |
| 3000-3999 | Equity | 3100 - Capital |
| 4000-4999 | Revenue | 4100 - Sales Revenue |
| 5000-5999 | Expenses | 5100 - Salaries |

### Expected Outcome
- Efficient account retrieval
- Proper hierarchical ordering
- Optional type filtering
- Optimized database queries
- Foundation for balance calculations

### Verification Checklist
- [ ] get_accounts method defined
- [ ] Filters by tenant
- [ ] Filters by is_active=True
- [ ] Accepts account_types parameter
- [ ] Orders by tree hierarchy
- [ ] Orders by code within hierarchy
- [ ] Uses select_related optimization
- [ ] Uses prefetch_related optimization
- [ ] Handles empty results
- [ ] Method docstring complete

---

## Task 19: Add Calculate Balance Method

### Overview
Implement the calculate_balance method that serves as the orchestrator for calculating a single account's complete balance information. This method calls the opening balance, period movement, and closing balance calculation methods, and returns a structured dictionary with all balance components for one account.

### Dependencies
- Task 18: Add Get All Accounts Method
- Task 20: Add Opening Balance Calc (will implement next)
- Task 21: Add Period Movement Calc (will implement next)
- Task 22: Add Closing Balance Calc (will implement next)

### Instructions

1. **Open trial_balance.py file**
   - Continue in `apps/accounting/reports/trial_balance.py`
   - Locate TrialBalanceGenerator class

2. **Define calculate_balance method**
   - Create method accepting self and account parameters
   - Account parameter is an Account model instance
   - Add comprehensive method docstring

3. **Initialize balance dictionary**
   - Create empty dictionary to store results
   - Will contain all balance components
   - Structure defined below

4. **Store account information**
   - Add account code to dictionary
   - Add account name to dictionary
   - Add account type to dictionary
   - Add parent information if exists

5. **Call opening balance calculation**
   - Invoke calculate_opening_balance(account)
   - Stores result in dictionary as 'opening_debit' and 'opening_credit'
   - Handles accounts with debit or credit nature

6. **Call period movement calculation**
   - Invoke calculate_period_movements(account)
   - Stores result as 'period_debit' and 'period_credit'
   - Represents activity during report period

7. **Call closing balance calculation**
   - Invoke calculate_closing_balance(opening, movements)
   - Calculates from opening + movements
   - Stores as 'closing_debit' and 'closing_credit'

8. **Add balance side determination**
   - Determine if account has debit or credit balance
   - Based on account type normal balance
   - Assets/Expenses = Debit, Liabilities/Revenue/Equity = Credit

9. **Calculate balance amounts**
   - For debit balance accounts: debit - credit
   - For credit balance accounts: credit - debit
   - Store net balance amount

10. **Return balance dictionary**
    - Return complete balance structure
    - Ready for grouping and display

11. **Handle zero balance accounts**
    - Include accounts with zero balance
    - Show zero in appropriate column
    - Maintains complete account list

### Balance Calculation Structure

```
┌──────────────────────────────────────────────┐
│    calculate_balance(account)                │
└──────────────────────────────────────────────┘
                    │
                    ▼
         ┌──────────────────────┐
         │ Initialize Dict      │
         │ Add Account Info     │
         └──────────────────────┘
                    │
                    ▼
         ┌──────────────────────┐
         │ Calculate Opening    │  ← Task 20
         │ Balance              │
         └──────────────────────┘
                    │
                    ▼
         ┌──────────────────────┐
         │ Calculate Period     │  ← Task 21
         │ Movements            │
         └──────────────────────┘
                    │
                    ▼
         ┌──────────────────────┐
         │ Calculate Closing    │  ← Task 22
         │ Balance              │
         └──────────────────────┘
                    │
                    ▼
         ┌──────────────────────┐
         │ Determine Side       │
         │ Calculate Net        │
         └──────────────────────┘
                    │
                    ▼
         ┌──────────────────────┐
         │ Return Dictionary    │
         └──────────────────────┘
```

### Balance Dictionary Structure

```python
{
    'account_code': '1110',
    'account_name': 'Cash at Bank - HNB',
    'account_type': 'ASSET',
    'parent_code': '1100',
    'parent_name': 'Current Assets',
    
    'opening_debit': Decimal('50000.00'),
    'opening_credit': Decimal('0.00'),
    
    'period_debit': Decimal('125000.00'),
    'period_credit': Decimal('98000.00'),
    
    'closing_debit': Decimal('77000.00'),
    'closing_credit': Decimal('0.00'),
    
    'balance_side': 'DEBIT',
    'balance_amount': Decimal('77000.00')
}
```

### Account Normal Balance Sides

| Account Type | Normal Balance | Increase | Decrease | Example |
|-------------|----------------|----------|----------|---------|
| Asset | DEBIT | Debit | Credit | Cash, Bank, Inventory |
| Liability | CREDIT | Credit | Debit | Accounts Payable, Loans |
| Equity | CREDIT | Credit | Debit | Capital, Retained Earnings |
| Revenue | CREDIT | Credit | Debit | Sales, Service Income |
| Expense | DEBIT | Debit | Credit | Salaries, Rent, Utilities |

### Balance Calculation Examples

#### Example 1: Asset Account (Debit Balance)

```
Account: 1110 - Cash at Bank
Type: ASSET (Normal Debit Balance)

Opening Balance:
  Debit:  50,000.00 LKR
  Credit:      0.00 LKR

Period Movements:
  Debits:  125,000.00 LKR (deposits)
  Credits:  98,000.00 LKR (payments)

Closing Balance:
  = Opening Dr + Period Dr - Period Cr
  = 50,000 + 125,000 - 98,000
  = 77,000.00 LKR (Debit side)
```

#### Example 2: Liability Account (Credit Balance)

```
Account: 2100 - Accounts Payable
Type: LIABILITY (Normal Credit Balance)

Opening Balance:
  Debit:       0.00 LKR
  Credit:  35,000.00 LKR

Period Movements:
  Debits:   20,000.00 LKR (payments)
  Credits:  45,000.00 LKR (new purchases)

Closing Balance:
  = Opening Cr + Period Cr - Period Dr
  = 35,000 + 45,000 - 20,000
  = 60,000.00 LKR (Credit side)
```

#### Example 3: Account with Zero Balance

```
Account: 5300 - Advertising Expense
Type: EXPENSE (Normal Debit Balance)

Opening Balance:
  Debit:   5,000.00 LKR
  Credit:      0.00 LKR

Period Movements:
  Debits:  10,000.00 LKR (new ads)
  Credits: 15,000.00 LKR (reversal)

Closing Balance:
  = Opening Dr + Period Dr - Period Cr
  = 5,000 + 10,000 - 15,000
  = 0.00 LKR (Zero balance)
```

### Balance Side Logic

```
Determine Balance Side:
════════════════════════

IF account_type in ['ASSET', 'EXPENSE']:
    normal_side = 'DEBIT'
    balance_amount = closing_debit - closing_credit
    
ELIF account_type in ['LIABILITY', 'EQUITY', 'REVENUE']:
    normal_side = 'CREDIT'
    balance_amount = closing_credit - closing_debit
```

### Handling Abnormal Balances

| Account Type | Normal Side | Abnormal Side | Possible Cause |
|-------------|-------------|---------------|----------------|
| Asset | Debit | Credit | Over-payment, error |
| Liability | Credit | Debit | Over-payment on loan |
| Expense | Debit | Credit | Expense reversal |
| Revenue | Credit | Debit | Sales return > sales |

### Sri Lankan Currency Format

All balance amounts displayed in LKR format:

```
Decimal('77000.00')  →  Display: "77,000.00 LKR"
Decimal('1500000.00') →  Display: "1,500,000.00 LKR"
Decimal('0.00')      →  Display: "0.00 LKR"
```

### Expected Outcome
- Orchestrated balance calculation
- Complete balance dictionary
- Proper opening, period, closing values
- Balance side determination
- Support for zero and abnormal balances

### Verification Checklist
- [ ] calculate_balance method defined
- [ ] Accepts account parameter
- [ ] Initializes balance dictionary
- [ ] Stores account information
- [ ] Calls calculate_opening_balance
- [ ] Calls calculate_period_movements
- [ ] Calls calculate_closing_balance
- [ ] Determines balance side
- [ ] Calculates net balance amount
- [ ] Returns complete dictionary
- [ ] Handles zero balances
- [ ] Method docstring complete

---

## Task 20: Add Opening Balance Calc

### Overview
Implement the calculate_opening_balance method that determines the opening balance for an account as of the start of the report period. This method aggregates all posted journal entry lines for the account before the report start date, calculating the cumulative effect of all prior transactions. Essential for understanding the account's starting position.

### Dependencies
- Task 19: Add Calculate Balance Method
- JournalEntry model with posted status
- JournalEntryLine model with debit/credit amounts
- Date range parameters in generator

### Instructions

1. **Open trial_balance.py file**
   - Continue in `apps/accounting/reports/trial_balance.py`
   - Locate TrialBalanceGenerator class

2. **Define calculate_opening_balance method**
   - Create method accepting self and account parameters
   - Add comprehensive docstring
   - Explain opening balance concept

3. **Filter prior period entries**
   - Query JournalEntryLine for given account
   - Filter by entry__date < self.start_date
   - Only include entries before report period

4. **Filter by posted status**
   - Only include posted journal entries
   - Filter by entry__status='POSTED'
   - Exclude draft, void entries

5. **Filter by tenant**
   - Apply tenant filter
   - entry__tenant = self.tenant
   - Ensure data isolation

6. **Aggregate debit amounts**
   - Use aggregate(Sum('debit_amount'))
   - Sum all debit entries before start_date
   - Default to Decimal('0.00') if None

7. **Aggregate credit amounts**
   - Use aggregate(Sum('credit_amount'))
   - Sum all credit entries before start_date
   - Default to Decimal('0.00') if None

8. **Return tuple result**
   - Return (opening_debit, opening_credit)
   - Both as Decimal values
   - Ready for balance calculation

9. **Handle accounts with no history**
   - If no prior entries exist
   - Return (Decimal('0.00'), Decimal('0.00'))
   - New accounts start at zero

10. **Add query optimization**
    - Use select_related for entry
    - Consider database indexes
    - Optimize for performance

### Opening Balance Calculation Logic

```
┌──────────────────────────────────────────────┐
│  calculate_opening_balance(account)          │
└──────────────────────────────────────────────┘
                    │
                    ▼
         ┌──────────────────────┐
         │ Query JournalEntry-  │
         │ Lines for account    │
         └──────────────────────┘
                    │
                    ▼
         ┌──────────────────────┐
         │ Filter: date <       │
         │ start_date           │
         └──────────────────────┘
                    │
                    ▼
         ┌──────────────────────┐
         │ Filter: status =     │
         │ 'POSTED'             │
         └──────────────────────┘
                    │
                    ▼
         ┌──────────────────────┐
         │ Filter: tenant       │
         └──────────────────────┘
                    │
                    ▼
      ┌──────────────┴──────────────┐
      ▼                              ▼
┌─────────────┐              ┌──────────────┐
│ Sum(debit_  │              │ Sum(credit_  │
│ amount)     │              │ amount)      │
└─────────────┘              └──────────────┘
      │                              │
      └──────────────┬───────────────┘
                     ▼
         ┌──────────────────────┐
         │ Return (debit, credit)│
         └──────────────────────┘
```

### Opening Balance Timeline

```
Fiscal Year Timeline:
════════════════════════════════════════════════════════

Apr 1, 2025               Oct 1, 2025              Mar 31, 2026
    │                          │                        │
    │◄──── Prior Period ──────►│◄──── Report Period ───►│
    │                          │                        │
    │                          │                        │
    │                    Opening Balance                │
    │                      Calculated                   │
    │                    (as of Sep 30)                 │
    │                                                    │
    └────────────────────────────────────────────────────┘

Opening Balance = Sum of ALL transactions from beginning
                  of time until September 30, 2025
```

### Opening Balance Examples

#### Example 1: Cash Account (Multi-Year)

```
Account: 1110 - Cash at Bank
Report Period: Oct 1 - Dec 31, 2025

All Prior Transactions:
══════════════════════════
2024-04-15: DR  100,000.00  (Initial capital)
2024-05-20: CR   30,000.00  (Payment)
2024-06-10: DR   50,000.00  (Collection)
2024-12-31: CR   15,000.00  (Expense)
2025-01-15: DR   25,000.00  (Sale)
2025-09-30: CR   20,000.00  (Payment)

Opening Balance Calculation (as of Sep 30, 2025):
════════════════════════════════════════════════
Total Debits:  100,000 + 50,000 + 25,000 = 175,000.00 LKR
Total Credits:  30,000 + 15,000 + 20,000 =  65,000.00 LKR

Opening Balance (Oct 1, 2025):
  Debit:  175,000.00 LKR
  Credit:  65,000.00 LKR
  Net:    110,000.00 LKR (Debit)
```

#### Example 2: Revenue Account (Year-to-Date)

```
Account: 4100 - Sales Revenue
Report Period: Jan 1 - Mar 31, 2026
Fiscal Year: Apr 1, 2025 - Mar 31, 2026

Prior Transactions (Apr 1 - Dec 31, 2025):
═══════════════════════════════════════════
Apr-Dec 2025 Total Credits: 5,500,000.00 LKR
Apr-Dec 2025 Total Debits:     50,000.00 LKR (returns)

Opening Balance (as of Dec 31, 2025):
═══════════════════════════════════════
  Debit:      50,000.00 LKR
  Credit:  5,500,000.00 LKR
  Net:     5,450,000.00 LKR (Credit)
```

#### Example 3: New Account (No Prior History)

```
Account: 5250 - Software Subscriptions
Report Period: Oct 1 - Dec 31, 2025
Account Created: Oct 5, 2025

Prior Transactions: NONE

Opening Balance (as of Sep 30, 2025):
══════════════════════════════════════
  Debit:  0.00 LKR
  Credit: 0.00 LKR
  Net:    0.00 LKR
```

### Query Structure

```sql
-- Conceptual SQL (Django ORM will generate)
SELECT 
    SUM(debit_amount) as total_debit,
    SUM(credit_amount) as total_credit
FROM journal_entry_lines
WHERE account_id = <account_id>
  AND entry.date < <start_date>
  AND entry.status = 'POSTED'
  AND entry.tenant_id = <tenant_id>
```

### Posted Status Importance

| Entry Status | Include in Opening Balance? | Reason |
|-------------|----------------------------|---------|
| POSTED | Yes | Official, finalized entries |
| DRAFT | No | Not yet approved |
| VOID | No | Cancelled entries |
| PENDING | No | Awaiting approval |

### Performance Considerations

| Optimization | Implementation | Benefit |
|-------------|----------------|---------|
| Date index | Index on entry.date | Fast date filtering |
| Status index | Index on entry.status | Fast status filtering |
| Aggregate function | Use database SUM() | Efficient calculation |
| select_related | Join entry table | Reduce queries |

### Sri Lankan Fiscal Context

```
Fiscal Year: April 1 - March 31

Report for Q3 (Oct-Dec 2025):
═══════════════════════════════
Opening Balance = All transactions from:
  - Previous fiscal years (before Apr 1, 2025)
  - Current fiscal year Q1 (Apr-Jun 2025)
  - Current fiscal year Q2 (Jul-Sep 2025)

Total: All history up to September 30, 2025
```

### Expected Outcome
- Accurate opening balance calculation
- Proper prior period filtering
- Tenant-aware queries
- Support for accounts with no history
- Foundation for closing balance

### Verification Checklist
- [ ] calculate_opening_balance method defined
- [ ] Accepts account parameter
- [ ] Filters by date < start_date
- [ ] Filters by status = 'POSTED'
- [ ] Filters by tenant
- [ ] Aggregates debit amounts
- [ ] Aggregates credit amounts
- [ ] Returns tuple (debit, credit)
- [ ] Handles no prior entries
- [ ] Uses Decimal for precision
- [ ] Query optimized
- [ ] Method docstring complete

---

## Task 21: Add Period Movement Calc

### Overview
Implement the calculate_period_movements method that calculates the total debits and credits for an account during the report period. This method aggregates all posted journal entry lines within the specified date range, providing insight into account activity during the period. Combined with opening balance, this determines the closing balance.

### Dependencies
- Task 20: Add Opening Balance Calc
- JournalEntry and JournalEntryLine models
- Date range parameters (start_date, end_date)

### Instructions

1. **Open trial_balance.py file**
   - Continue in `apps/accounting/reports/trial_balance.py`
   - Locate TrialBalanceGenerator class

2. **Define calculate_period_movements method**
   - Create method accepting self and account parameters
   - Add comprehensive docstring
   - Explain period movement concept

3. **Filter current period entries**
   - Query JournalEntryLine for given account
   - Filter by entry__date >= self.start_date
   - Filter by entry__date <= self.end_date
   - Include only entries within report period

4. **Filter by posted status**
   - Only include posted entries
   - entry__status = 'POSTED'
   - Exclude draft, void, pending

5. **Filter by tenant**
   - Apply tenant filter
   - entry__tenant = self.tenant
   - Ensure data isolation

6. **Aggregate period debits**
   - Use aggregate(Sum('debit_amount'))
   - Sum all debits within date range
   - Default to Decimal('0.00') if None

7. **Aggregate period credits**
   - Use aggregate(Sum('credit_amount'))
   - Sum all credits within date range
   - Default to Decimal('0.00') if None

8. **Return tuple result**
   - Return (period_debit, period_credit)
   - Both as Decimal values
   - Represents period activity

9. **Handle inactive periods**
   - If no entries in period
   - Return (Decimal('0.00'), Decimal('0.00'))
   - Account had no activity

10. **Add query optimization**
    - Use select_related for entry
    - Consider date range indexes
    - Optimize for large datasets

### Period Movement Calculation Logic

```
┌──────────────────────────────────────────────┐
│  calculate_period_movements(account)         │
└──────────────────────────────────────────────┘
                    │
                    ▼
         ┌──────────────────────┐
         │ Query JournalEntry-  │
         │ Lines for account    │
         └──────────────────────┘
                    │
                    ▼
         ┌──────────────────────┐
         │ Filter: date >=      │
         │ start_date AND       │
         │ date <= end_date     │
         └──────────────────────┘
                    │
                    ▼
         ┌──────────────────────┐
         │ Filter: status =     │
         │ 'POSTED'             │
         └──────────────────────┘
                    │
                    ▼
         ┌──────────────────────┐
         │ Filter: tenant       │
         └──────────────────────┘
                    │
                    ▼
      ┌──────────────┴──────────────┐
      ▼                              ▼
┌─────────────┐              ┌──────────────┐
│ Sum(debit_  │              │ Sum(credit_  │
│ amount)     │              │ amount)      │
└─────────────┘              └──────────────┘
      │                              │
      └──────────────┬───────────────┘
                     ▼
         ┌──────────────────────┐
         │ Return (debit, credit)│
         └──────────────────────┘
```

### Period Movement Timeline

```
Fiscal Year Timeline:
════════════════════════════════════════════════════════

Apr 1, 2025               Oct 1, 2025              Dec 31, 2025
    │                          │                        │
    │◄──── Prior Period ──────►│◄──── Report Period ───►│
    │                          │                        │
    │                          │      ↓ Debit: 50,000   │
    │                          │      ↓ Credit: 30,000  │
    │                          │      ↓ Debit: 25,000   │
    │                          │      ↓ Credit: 15,000  │
    │                          │                        │
    │                  Period Movements:                │
    │                  Total Debits: 75,000.00          │
    │                  Total Credits: 45,000.00         │
    │                                                    │
    └────────────────────────────────────────────────────┘

Period Movements = Sum of transactions ONLY within
                   October 1 - December 31, 2025
```

### Period Movement Examples

#### Example 1: Bank Account (Active Period)

```
Account: 1110 - Cash at Bank - Commercial Bank
Report Period: Oct 1 - Dec 31, 2025

Transactions During Period:
═══════════════════════════════════════════════
2025-10-05: DR  150,000.00  (Customer payment)
2025-10-12: CR   85,000.00  (Supplier payment)
2025-11-03: DR  200,000.00  (Cash sale)
2025-11-20: CR  120,000.00  (Rent payment)
2025-12-15: DR  100,000.00  (Collection)
2025-12-28: CR   95,000.00  (Salaries)

Period Movement Calculation:
════════════════════════════
Total Period Debits:  150,000 + 200,000 + 100,000 = 450,000.00 LKR
Total Period Credits:  85,000 + 120,000 +  95,000 = 300,000.00 LKR

Period Movements:
  Debit:   450,000.00 LKR
  Credit:  300,000.00 LKR
  Net Movement: +150,000.00 LKR (Increase)
```

#### Example 2: Expense Account (Debit Activity)

```
Account: 5100 - Salaries and Wages
Report Period: Oct 1 - Dec 31, 2025

Transactions During Period:
═══════════════════════════
2025-10-31: DR  250,000.00  (October salaries)
2025-11-30: DR  250,000.00  (November salaries)
2025-12-31: DR  275,000.00  (December salaries + bonus)

Period Movement Calculation:
════════════════════════════
Total Period Debits:   250,000 + 250,000 + 275,000 = 775,000.00 LKR
Total Period Credits:                                       0.00 LKR

Period Movements:
  Debit:   775,000.00 LKR
  Credit:        0.00 LKR
  Net Movement: +775,000.00 LKR (Expense increase)
```

#### Example 3: Revenue Account (Credit Activity)

```
Account: 4100 - Sales Revenue
Report Period: Oct 1 - Dec 31, 2025

Transactions During Period:
═══════════════════════════
2025-10-01 to 2025-10-31: CR  2,500,000.00  (October sales)
2025-11-01 to 2025-11-30: CR  2,800,000.00  (November sales)
2025-12-01 to 2025-12-31: CR  3,200,000.00  (December sales)
2025-12-15:               DR     50,000.00  (Sales return)

Period Movement Calculation:
════════════════════════════
Total Period Debits:                                 50,000.00 LKR
Total Period Credits: 2,500,000 + 2,800,000 + 3,200,000 = 8,500,000.00 LKR

Period Movements:
  Debit:      50,000.00 LKR
  Credit:  8,500,000.00 LKR
  Net Movement: +8,450,000.00 LKR (Revenue increase)
```

#### Example 4: Dormant Account (No Activity)

```
Account: 1500 - Investments
Report Period: Oct 1 - Dec 31, 2025

Transactions During Period: NONE

Period Movement Calculation:
════════════════════════════
Total Period Debits:  0.00 LKR
Total Period Credits: 0.00 LKR

Period Movements:
  Debit:   0.00 LKR
  Credit:  0.00 LKR
  Net Movement: 0.00 LKR (No activity)
```

### Date Range Filtering

```
Date Range Logic (Inclusive):
══════════════════════════════

start_date = 2025-10-01
end_date = 2025-12-31

Included:
  ✓ 2025-10-01 00:00:00  (First moment of period)
  ✓ 2025-10-15 14:30:00  (Middle of period)
  ✓ 2025-12-31 23:59:59  (Last moment of period)

Excluded:
  ✗ 2025-09-30 23:59:59  (Before start)
  ✗ 2026-01-01 00:00:01  (After end)
```

### Period Movement vs Opening Balance

| Component | Date Range | Purpose |
|-----------|------------|---------|
| Opening Balance | All dates < start_date | Starting position |
| Period Movements | start_date ≤ date ≤ end_date | Activity during period |
| Closing Balance | Opening + Movements | Ending position |

### Query Performance

```
Optimization Strategy:
══════════════════════

1. Date Range Index:
   - Index on (tenant_id, entry.date)
   - Speeds up date filtering

2. Composite Index:
   - Index on (account_id, entry.date, entry.status)
   - Optimizes common query pattern

3. Aggregate Function:
   - Database-level SUM() operation
   - Faster than Python iteration

4. Batch Processing:
   - Consider paginating for very large datasets
   - Use iterator() for memory efficiency
```

### Sri Lankan Quarterly Reporting

```
Fiscal Year: Apr 1, 2025 - Mar 31, 2026

Quarter 1 (Q1): Apr 1 - Jun 30, 2025
Quarter 2 (Q2): Jul 1 - Sep 30, 2025
Quarter 3 (Q3): Oct 1 - Dec 31, 2025  ← Example period
Quarter 4 (Q4): Jan 1 - Mar 31, 2026

Period movements for Q3 include ONLY transactions
from October 1 through December 31, 2025.

Used for:
- IRD VAT returns (quarterly)
- Management reporting
- Budget variance analysis
```

### Expected Outcome
- Accurate period movement calculation
- Proper date range filtering
- Tenant-aware queries
- Support for inactive accounts
- Foundation for closing balance

### Verification Checklist
- [ ] calculate_period_movements method defined
- [ ] Accepts account parameter
- [ ] Filters by start_date <= date <= end_date
- [ ] Filters by status = 'POSTED'
- [ ] Filters by tenant
- [ ] Aggregates period debits
- [ ] Aggregates period credits
- [ ] Returns tuple (debit, credit)
- [ ] Handles no period activity
- [ ] Uses Decimal for precision
- [ ] Query optimized
- [ ] Method docstring complete

---

## Task 22: Add Closing Balance Calc

### Overview
Implement the calculate_closing_balance method that determines the closing balance for an account at the end of the report period. This method combines the opening balance and period movements using the fundamental accounting equation: Closing = Opening + Movements. It returns the final debit or credit position of the account.

### Dependencies
- Task 20: Add Opening Balance Calc
- Task 21: Add Period Movement Calc

### Instructions

1. **Open trial_balance.py file**
   - Continue in `apps/accounting/reports/trial_balance.py`
   - Locate TrialBalanceGenerator class

2. **Define calculate_closing_balance method**
   - Create method accepting self, opening_balance, and period_movements parameters
   - opening_balance is tuple (opening_dr, opening_cr)
   - period_movements is tuple (period_dr, period_cr)
   - Add comprehensive docstring

3. **Unpack opening balance**
   - Extract opening_debit from tuple
   - Extract opening_credit from tuple
   - Both are Decimal values

4. **Unpack period movements**
   - Extract period_debit from tuple
   - Extract period_credit from tuple
   - Both are Decimal values

5. **Calculate total debits**
   - Add opening_debit + period_debit
   - This is cumulative debit side
   - Store as total_debit

6. **Calculate total credits**
   - Add opening_credit + period_credit
   - This is cumulative credit side
   - Store as total_credit

7. **Determine closing position**
   - If total_debit > total_credit: debit balance
   - If total_credit > total_debit: credit balance
   - If equal: zero balance

8. **Return closing balance tuple**
   - Return (closing_debit, closing_credit)
   - If debit balance: (balance_amount, Decimal('0.00'))
   - If credit balance: (Decimal('0.00'), balance_amount)
   - If zero: (Decimal('0.00'), Decimal('0.00'))

9. **Maintain accounting equation**
   - Ensure closing balance reflects net position
   - Positive balance goes to appropriate side
   - Never have both debit and credit closing

10. **Handle edge cases**
    - Zero opening and zero movement
    - Very large balances
    - Negative intermediate calculations

### Closing Balance Calculation Logic

```
┌──────────────────────────────────────────────┐
│  calculate_closing_balance(opening, movement)│
└──────────────────────────────────────────────┘
                    │
                    ▼
         ┌──────────────────────┐
         │ Unpack Opening:      │
         │ opening_dr, opening_cr│
         └──────────────────────┘
                    │
                    ▼
         ┌──────────────────────┐
         │ Unpack Movements:    │
         │ period_dr, period_cr │
         └──────────────────────┘
                    │
                    ▼
         ┌──────────────────────┐
         │ Total Debits =       │
         │ opening_dr + period_dr│
         └──────────────────────┘
                    │
                    ▼
         ┌──────────────────────┐
         │ Total Credits =      │
         │ opening_cr + period_cr│
         └──────────────────────┘
                    │
                    ▼
         ┌──────────────────────┐
         │ Compare Totals       │
         └──────────────────────┘
                    │
      ┌─────────────┼─────────────┐
      ▼             ▼             ▼
┌──────────┐  ┌──────────┐  ┌──────────┐
│ DR > CR  │  │ CR > DR  │  │ DR = CR  │
│ Debit Bal│  │Credit Bal│  │ Zero Bal │
└──────────┘  └──────────┘  └──────────┘
      │             │             │
      └─────────────┼─────────────┘
                    ▼
         ┌──────────────────────┐
         │Return (closing_dr,   │
         │        closing_cr)   │
         └──────────────────────┘
```

### Closing Balance Formula

```
Fundamental Accounting Equation:
════════════════════════════════

Closing Balance = Opening Balance + Period Movements

Debit Balance Accounts:
───────────────────────
Closing = (Opening Dr + Period Dr) - (Opening Cr + Period Cr)

Credit Balance Accounts:
────────────────────────
Closing = (Opening Cr + Period Cr) - (Opening Dr + Period Dr)
```

### Closing Balance Examples

#### Example 1: Asset Account (Debit Balance)

```
Account: 1110 - Cash at Bank
Type: ASSET

Opening Balance:
  Debit:  110,000.00 LKR
  Credit:       0.00 LKR

Period Movements:
  Debit:  450,000.00 LKR
  Credit: 300,000.00 LKR

Calculation:
════════════
Total Debits:  110,000 + 450,000 = 560,000.00 LKR
Total Credits:       0 + 300,000 = 300,000.00 LKR

Closing Balance:
  560,000 - 300,000 = 260,000.00 LKR (Debit side)

Return: (Decimal('260000.00'), Decimal('0.00'))
```

#### Example 2: Liability Account (Credit Balance)

```
Account: 2100 - Accounts Payable
Type: LIABILITY

Opening Balance:
  Debit:       0.00 LKR
  Credit:  60,000.00 LKR

Period Movements:
  Debit:   45,000.00 LKR
  Credit: 120,000.00 LKR

Calculation:
════════════
Total Debits:        0 +  45,000 =  45,000.00 LKR
Total Credits:  60,000 + 120,000 = 180,000.00 LKR

Closing Balance:
  180,000 - 45,000 = 135,000.00 LKR (Credit side)

Return: (Decimal('0.00'), Decimal('135000.00'))
```

#### Example 3: Account Resulting in Zero Balance

```
Account: 1300 - Temporary Account
Type: ASSET

Opening Balance:
  Debit:  50,000.00 LKR
  Credit:      0.00 LKR

Period Movements:
  Debit:   25,000.00 LKR
  Credit:  75,000.00 LKR

Calculation:
════════════
Total Debits:  50,000 + 25,000 = 75,000.00 LKR
Total Credits:      0 + 75,000 = 75,000.00 LKR

Closing Balance:
  75,000 - 75,000 = 0.00 LKR (Zero balance)

Return: (Decimal('0.00'), Decimal('0.00'))
```

#### Example 4: Revenue Account (Credit Balance)

```
Account: 4100 - Sales Revenue
Type: REVENUE

Opening Balance:
  Debit:      50,000.00 LKR
  Credit:  5,500,000.00 LKR

Period Movements:
  Debit:      25,000.00 LKR
  Credit:  8,500,000.00 LKR

Calculation:
════════════
Total Debits:     50,000 +    25,000 =     75,000.00 LKR
Total Credits: 5,500,000 + 8,500,000 = 14,000,000.00 LKR

Closing Balance:
  14,000,000 - 75,000 = 13,925,000.00 LKR (Credit side)

Return: (Decimal('0.00'), Decimal('13925000.00'))
```

### Balance Side Rules

```
Closing Balance Representation:
════════════════════════════════

Debit Balance:
  - Closing Debit column: balance amount
  - Closing Credit column: 0.00
  - Example: (260000.00, 0.00)

Credit Balance:
  - Closing Debit column: 0.00
  - Closing Credit column: balance amount
  - Example: (0.00, 135000.00)

Zero Balance:
  - Closing Debit column: 0.00
  - Closing Credit column: 0.00
  - Example: (0.00, 0.00)

Never Both:
  - Never return non-zero for both debit and credit
  - Violates accounting principles
```

### Verification Matrix

| Total Debits | Total Credits | Closing Debit | Closing Credit | Balance Type |
|-------------|---------------|---------------|----------------|--------------|
| 560,000 | 300,000 | 260,000 | 0 | Debit |
| 45,000 | 180,000 | 0 | 135,000 | Credit |
| 75,000 | 75,000 | 0 | 0 | Zero |
| 1,000,000 | 500,000 | 500,000 | 0 | Debit |
| 250,000 | 1,000,000 | 0 | 750,000 | Credit |

### Precision Handling

```python
# Using Decimal for precision
from decimal import Decimal

# All calculations maintain precision
opening_dr = Decimal('110000.00')
period_dr = Decimal('450000.00')
total_dr = opening_dr + period_dr  # Decimal('560000.00')

# No floating point errors
# Example: 0.1 + 0.2 = 0.30000000000000004 (float)
#          Decimal('0.1') + Decimal('0.2') = Decimal('0.3') ✓
```

### Method Signature

```python
def calculate_closing_balance(
    self,
    opening_balance: Tuple[Decimal, Decimal],
    period_movements: Tuple[Decimal, Decimal]
) -> Tuple[Decimal, Decimal]:
    """
    Calculate closing balance from opening and movements.
    
    Args:
        opening_balance: (opening_debit, opening_credit)
        period_movements: (period_debit, period_credit)
    
    Returns:
        (closing_debit, closing_credit)
    """
```

### Expected Outcome
- Accurate closing balance calculation
- Proper combination of opening and movements
- Single-side balance representation
- Support for zero balances
- Decimal precision maintained

### Verification Checklist
- [ ] calculate_closing_balance method defined
- [ ] Accepts opening_balance tuple
- [ ] Accepts period_movements tuple
- [ ] Unpacks opening values
- [ ] Unpacks movement values
- [ ] Calculates total debits
- [ ] Calculates total credits
- [ ] Determines balance side
- [ ] Returns proper tuple format
- [ ] Handles zero balances
- [ ] Uses Decimal throughout
- [ ] Method docstring complete

---

## Task 23: Add Account Type Grouping

### Overview
Implement the group_by_type method that organizes accounts and their balances by account type (Assets, Liabilities, Equity, Revenue, Expenses). This method creates a hierarchical structure with subtotals for each account type, making the Trial Balance report easier to read and analyze. Groups follow standard financial statement ordering.

### Dependencies
- Task 22: Add Closing Balance Calc
- Account balances calculated
- AccountType model with ordering

### Instructions

1. **Open trial_balance.py file**
   - Continue in `apps/accounting/reports/trial_balance.py`
   - Locate TrialBalanceGenerator class

2. **Define group_by_type method**
   - Create method accepting self parameter
   - Uses self.accounts_data (list of balance dictionaries)
   - Add comprehensive docstring

3. **Initialize grouped structure**
   - Create empty dictionary for grouped results
   - Keys will be account type names
   - Values will be lists of accounts

4. **Define account type order**
   - Create ordered list of account types
   - Order: ASSET, LIABILITY, EQUITY, REVENUE, EXPENSE
   - Follows standard financial statement order

5. **Iterate through account balances**
   - Loop through self.accounts_data
   - Extract account_type from each balance dictionary
   - Group by account type

6. **Create type groups**
   - For each account type, create a group entry
   - Include list of accounts in that type
   - Maintain original account order within group

7. **Calculate subtotals per type**
   - For each group, sum opening debits/credits
   - Sum period debits/credits
   - Sum closing debits/credits
   - Store subtotals in group structure

8. **Add group metadata**
   - Include account type display name
   - Include account count in group
   - Include subtotal amounts

9. **Return ordered groups**
   - Return dictionary of groups in proper order
   - ASSET first, EXPENSE last
   - Each group contains accounts and subtotals

10. **Handle empty groups**
    - If no accounts in a type, still show type header
    - Show zero subtotals
    - Maintain complete structure

### Account Type Grouping Logic

```
┌──────────────────────────────────────────────┐
│      group_by_type()                         │
└──────────────────────────────────────────────┘
                    │
                    ▼
         ┌──────────────────────┐
         │ Initialize Groups    │
         │ Dictionary           │
         └──────────────────────┘
                    │
                    ▼
         ┌──────────────────────┐
         │ Define Type Order:   │
         │ ASSET, LIABILITY,    │
         │ EQUITY, REVENUE,     │
         │ EXPENSE              │
         └──────────────────────┘
                    │
                    ▼
         ┌──────────────────────┐
         │ Iterate Account      │
         │ Balances             │
         └──────────────────────┘
                    │
                    ▼
         ┌──────────────────────┐
         │ Group by Type        │
         └──────────────────────┘
                    │
                    ▼
         ┌──────────────────────┐
         │ Calculate Subtotals  │
         │ for Each Type        │
         └──────────────────────┘
                    │
                    ▼
         ┌──────────────────────┐
         │ Add Group Metadata   │
         └──────────────────────┘
                    │
                    ▼
         ┌──────────────────────┐
         │ Return Ordered       │
         │ Groups               │
         └──────────────────────┘
```

### Grouped Trial Balance Structure

```
TRIAL BALANCE
As of December 31, 2025
═══════════════════════════════════════════════════════════════════

ASSETS                         Opening          Period          Closing
                               Dr      Cr      Dr      Cr      Dr      Cr
─────────────────────────────────────────────────────────────────────
1100 - Current Assets      50,000       0  100,000  60,000  90,000       0
1110 - Cash at Bank       110,000       0  450,000 300,000 260,000       0
1200 - Fixed Assets       500,000       0        0       0 500,000       0
                          ─────────────────────────────────────────────
  ASSETS SUBTOTAL         660,000       0  550,000 360,000 850,000       0

LIABILITIES
2100 - Accounts Payable         0  60,000   45,000 120,000       0 135,000
2200 - Bank Loan                0 200,000   10,000       0       0 190,000
                          ─────────────────────────────────────────────
  LIABILITIES SUBTOTAL          0 260,000   55,000 120,000       0 325,000

EQUITY
3100 - Capital                  0 400,000        0       0       0 400,000
                          ─────────────────────────────────────────────
  EQUITY SUBTOTAL               0 400,000        0       0       0 400,000

REVENUE
4100 - Sales Revenue       50,000 5,500,000  25,000 8,500,000  75,000 14,000,000
                          ─────────────────────────────────────────────
  REVENUE SUBTOTAL         50,000 5,500,000  25,000 8,500,000  75,000 14,000,000

EXPENSES
5100 - Salaries           200,000       0  775,000       0  975,000       0
5200 - Rent                24,000       0   36,000       0   60,000       0
                          ─────────────────────────────────────────────
  EXPENSES SUBTOTAL        224,000       0  811,000       0 1,035,000       0

═══════════════════════════════════════════════════════════════════
TOTAL                      934,000 6,160,000 1,441,000 8,980,000 1,960,000 14,725,000
```

### Grouped Data Structure

```python
{
    'ASSET': {
        'display_name': 'ASSETS',
        'order': 1,
        'accounts': [
            {
                'account_code': '1100',
                'account_name': 'Current Assets',
                'opening_debit': Decimal('50000.00'),
                'opening_credit': Decimal('0.00'),
                'period_debit': Decimal('100000.00'),
                'period_credit': Decimal('60000.00'),
                'closing_debit': Decimal('90000.00'),
                'closing_credit': Decimal('0.00')
            },
            # ... more accounts
        ],
        'subtotals': {
            'opening_debit': Decimal('660000.00'),
            'opening_credit': Decimal('0.00'),
            'period_debit': Decimal('550000.00'),
            'period_credit': Decimal('360000.00'),
            'closing_debit': Decimal('850000.00'),
            'closing_credit': Decimal('0.00')
        },
        'account_count': 3
    },
    'LIABILITY': {
        # ... similar structure
    },
    # ... other types
}
```

### Account Type Ordering

| Order | Type | Display Name | Accounts In Type | Typical Balance |
|-------|------|--------------|------------------|----------------|
| 1 | ASSET | ASSETS | 1xxx | Debit |
| 2 | LIABILITY | LIABILITIES | 2xxx | Credit |
| 3 | EQUITY | EQUITY | 3xxx | Credit |
| 4 | REVENUE | REVENUE | 4xxx | Credit |
| 5 | EXPENSE | EXPENSES | 5xxx | Debit |

### Subtotal Calculation

```
For each Account Type:
══════════════════════

Subtotal Opening Debit = Sum of all account opening debits in type
Subtotal Opening Credit = Sum of all account opening credits in type
Subtotal Period Debit = Sum of all account period debits in type
Subtotal Period Credit = Sum of all account period credits in type
Subtotal Closing Debit = Sum of all account closing debits in type
Subtotal Closing Credit = Sum of all account closing credits in type

Example (ASSETS):
═════════════════
Account 1100: Opening Dr = 50,000
Account 1110: Opening Dr = 110,000
Account 1200: Opening Dr = 500,000
─────────────────────────────────
ASSETS Subtotal Opening Dr = 660,000
```

### Sri Lankan Chart of Accounts Grouping

```
Standard Sri Lankan Account Code Ranges:
════════════════════════════════════════

1xxx - ASSETS
  1100-1199: Current Assets
  1200-1299: Fixed Assets
  1300-1399: Long-term Investments
  1400-1499: Other Assets

2xxx - LIABILITIES
  2100-2199: Current Liabilities
  2200-2299: Long-term Liabilities
  2300-2399: Other Liabilities

3xxx - EQUITY
  3100-3199: Capital
  3200-3299: Reserves
  3300-3399: Retained Earnings

4xxx - REVENUE
  4100-4199: Operating Revenue
  4200-4299: Other Income
  4300-4399: Non-operating Revenue

5xxx - EXPENSES
  5100-5199: Personnel Costs
  5200-5299: Operating Expenses
  5300-5399: Financial Costs
  5400-5499: Depreciation
```

### Grouping Benefits

| Benefit | Description | Use Case |
|---------|-------------|----------|
| Readability | Easy to scan by category | Management review |
| Subtotals | Quick category totals | Analysis |
| Organization | Logical structure | Financial statements |
| Navigation | Find accounts easily | Large Trial Balances |
| Comparison | Compare categories across periods | Variance analysis |

### Empty Group Handling

```
If no EQUITY accounts have balances:
════════════════════════════════════

EQUITY
  (No accounts with activity)
                          ─────────────────────────────────────────────
  EQUITY SUBTOTAL               0       0        0       0       0       0

Still show the group header and zero subtotals.
Maintains consistent structure across all reports.
```

### Expected Outcome
- Well-organized account groups
- Subtotals per account type
- Standard financial statement ordering
- Support for empty groups
- Foundation for formatted output

### Verification Checklist
- [ ] group_by_type method defined
- [ ] Initializes grouped structure
- [ ] Defines account type order
- [ ] Iterates through account balances
- [ ] Groups by account type
- [ ] Calculates subtotals per type
- [ ] Includes group metadata
- [ ] Returns ordered groups
- [ ] Handles empty groups
- [ ] Maintains account order within groups
- [ ] Uses proper Sri Lankan ordering
- [ ] Method docstring complete

---

## Task 24: Add Totals Validation

### Overview
Implement the validate_totals method that verifies double-entry bookkeeping integrity by ensuring total debits equal total credits for opening balances, period movements, and closing balances. This validation is critical for Trial Balance accuracy and compliance with accounting principles. Any discrepancy indicates a data integrity issue that must be resolved.

### Dependencies
- Task 23: Add Account Type Grouping
- All account balances calculated and grouped
- Subtotals calculated per type

### Instructions

1. **Open trial_balance.py file**
   - Continue in `apps/accounting/reports/trial_balance.py`
   - Locate TrialBalanceGenerator class

2. **Define validate_totals method**
   - Create method accepting self parameter
   - Uses grouped account data
   - Add comprehensive docstring

3. **Initialize total accumulators**
   - Create variables for total opening debits
   - Create variables for total opening credits
   - Create variables for total period debits
   - Create variables for total period credits
   - Create variables for total closing debits
   - Create variables for total closing credits

4. **Iterate through all groups**
   - Loop through grouped account types
   - Access subtotals for each group
   - Accumulate grand totals

5. **Sum opening balances**
   - Add all group opening debits
   - Add all group opening credits
   - Store as total opening debit/credit

6. **Sum period movements**
   - Add all group period debits
   - Add all group period credits
   - Store as total period debit/credit

7. **Sum closing balances**
   - Add all group closing debits
   - Add all group closing credits
   - Store as total closing debit/credit

8. **Compare debits and credits**
   - Check if opening debits == opening credits
   - Check if period debits == period credits
   - Check if closing debits == closing credits

9. **Handle validation results**
   - If all equal: validation passes
   - If any differ: validation fails
   - Calculate differences for each section

10. **Return validation result**
    - Return dictionary with totals
    - Include validation status (pass/fail)
    - Include differences if any
    - Include error messages if needed

11. **Log validation failures**
    - Log critical error if totals don't match
    - Include difference amounts
    - Help troubleshoot data issues

### Totals Validation Logic

```
┌──────────────────────────────────────────────┐
│      validate_totals()                       │
└──────────────────────────────────────────────┘
                    │
                    ▼
         ┌──────────────────────┐
         │ Initialize Total     │
         │ Accumulators (6)     │
         └──────────────────────┘
                    │
                    ▼
         ┌──────────────────────┐
         │ Iterate Account Type │
         │ Groups               │
         └──────────────────────┘
                    │
                    ▼
         ┌──────────────────────┐
         │ Sum Opening Debits & │
         │ Credits              │
         └──────────────────────┘
                    │
                    ▼
         ┌──────────────────────┐
         │ Sum Period Debits &  │
         │ Credits              │
         └──────────────────────┘
                    │
                    ▼
         ┌──────────────────────┐
         │ Sum Closing Debits & │
         │ Credits              │
         └──────────────────────┘
                    │
                    ▼
         ┌──────────────────────┐
         │ Compare:             │
         │ Opening Dr = Op Cr?  │
         │ Period Dr = Pd Cr?   │
         │ Closing Dr = Cl Cr?  │
         └──────────────────────┘
                    │
      ┌─────────────┴─────────────┐
      ▼                            ▼
┌─────────────┐          ┌──────────────┐
│ All Equal   │          │ Not Equal    │
│ PASS ✓      │          │ FAIL ✗       │
└─────────────┘          └──────────────┘
      │                            │
      └─────────────┬──────────────┘
                    ▼
         ┌──────────────────────┐
         │ Return Validation    │
         │ Result Dictionary    │
         └──────────────────────┘
```

### Double-Entry Principle

```
Fundamental Accounting Principle:
═════════════════════════════════

Total Debits MUST ALWAYS Equal Total Credits

Every transaction affects at least two accounts:
  - One account is debited
  - One account is credited
  - Debit amount = Credit amount

Trial Balance Validation:
  ✓ Opening Debits = Opening Credits
  ✓ Period Debits = Period Credits
  ✓ Closing Debits = Closing Credits

If any inequality exists → DATA ERROR
```

### Validation Result Structure

```python
{
    'validation_passed': True,  # or False
    'totals': {
        'opening': {
            'debit': Decimal('934000.00'),
            'credit': Decimal('934000.00'),
            'difference': Decimal('0.00'),
            'balanced': True
        },
        'period': {
            'debit': Decimal('1441000.00'),
            'credit': Decimal('1441000.00'),
            'difference': Decimal('0.00'),
            'balanced': True
        },
        'closing': {
            'debit': Decimal('1960000.00'),
            'credit': Decimal('1960000.00'),
            'difference': Decimal('0.00'),
            'balanced': True
        }
    },
    'errors': []  # List of error messages if any
}
```

### Validation Examples

#### Example 1: Balanced Trial Balance (PASS)

```
Trial Balance - December 31, 2025
══════════════════════════════════════════════════

                        Opening        Period        Closing
                        Dr      Cr     Dr      Cr    Dr      Cr
─────────────────────────────────────────────────────────────
ASSETS              660,000       0  550,000 360,000 850,000       0
LIABILITIES               0 260,000   55,000 120,000       0 325,000
EQUITY                    0 400,000        0       0       0 400,000
REVENUE              50,000 5,500,000  25,000 8,500,000  75,000 14,000,000
EXPENSES            224,000       0  811,000       0 1,035,000       0
─────────────────────────────────────────────────────────────
TOTAL               934,000 6,160,000 1,441,000 8,980,000 1,960,000 14,725,000

Validation:
═══════════
Opening:  934,000 Dr = 6,160,000 Cr  ✗ FAIL
Wait, this doesn't balance!

Correct Example:
════════════════
TOTAL               6,160,000 6,160,000 8,980,000 8,980,000 14,725,000 14,725,000

Opening:  6,160,000 Dr = 6,160,000 Cr  ✓ PASS
Period:   8,980,000 Dr = 8,980,000 Cr  ✓ PASS
Closing: 14,725,000 Dr = 14,725,000 Cr  ✓ PASS

Result: VALIDATION PASSED ✓
```

#### Example 2: Unbalanced Trial Balance (FAIL)

```
Trial Balance - December 31, 2025
══════════════════════════════════════════════════

                        Opening        Period        Closing
                        Dr      Cr     Dr      Cr    Dr      Cr
─────────────────────────────────────────────────────────────
TOTAL             1,500,000 1,500,000 800,000 750,000 2,300,000 2,250,000
                                                          ↑         ↑
                                              Difference: 50,000 LKR

Validation:
═══════════
Opening:  1,500,000 Dr = 1,500,000 Cr  ✓ PASS (Difference: 0)
Period:     800,000 Dr =   750,000 Cr  ✗ FAIL (Difference: 50,000)
Closing:  2,300,000 Dr = 2,250,000 Cr  ✗ FAIL (Difference: 50,000)

Result: VALIDATION FAILED ✗

Errors:
  - Period movements unbalanced: Debits exceed Credits by 50,000.00 LKR
  - Closing balances unbalanced: Debits exceed Credits by 50,000.00 LKR

Action Required:
  - Review journal entries for period
  - Check for missing credit entry of 50,000 LKR
  - Verify data integrity
```

### Difference Calculation

```python
# Calculate differences
opening_diff = abs(opening_debit - opening_credit)
period_diff = abs(period_debit - period_credit)
closing_diff = abs(closing_debit - closing_credit)

# Determine which side is larger
if opening_debit > opening_credit:
    error_msg = f"Opening: Debits exceed Credits by {opening_diff} LKR"
elif opening_credit > opening_debit:
    error_msg = f"Opening: Credits exceed Debits by {opening_diff} LKR"
```

### Common Causes of Imbalance

| Cause | Description | Example |
|-------|-------------|---------|
| Missing entry | One side of transaction not recorded | Debit posted, credit missing |
| Amount typo | Different amounts for debit/credit | Dr 10,000 vs Cr 1,000 |
| Wrong account | Posted to wrong side | Debit instead of credit |
| Incomplete reversal | Reversal entry not fully posted | Only one line reversed |
| Data import error | Import truncated or corrupted | Partial CSV import |
| System bug | Software calculation error | Rounding issue |

### Validation Thresholds

```
Strict Validation (Recommended):
═════════════════════════════════
Tolerance: 0.00 LKR (exact match)
Any difference is a failure.

Acceptable for:
  - Trial Balance
  - Balance Sheet
  - Income Statement

Never use tolerance for financial reports.
```

### Error Messages

```python
error_messages = []

if opening_diff > 0:
    error_messages.append(
        f"Opening balances unbalanced: "
        f"Difference of {opening_diff:,.2f} LKR"
    )

if period_diff > 0:
    error_messages.append(
        f"Period movements unbalanced: "
        f"Difference of {period_diff:,.2f} LKR"
    )

if closing_diff > 0:
    error_messages.append(
        f"Closing balances unbalanced: "
        f"Difference of {closing_diff:,.2f} LKR"
    )
```

### Sri Lankan Audit Requirements

| Requirement | Description | Validation Role |
|------------|-------------|-----------------|
| IRD Audit | Annual audited financials required | TB must balance |
| Company Law | Accurate records mandated | Double-entry integrity |
| Professional Standards | SLSQC compliance | Zero tolerance for errors |
| Bank Requirements | Loan covenants need accurate reports | Validation ensures accuracy |

### Expected Outcome
- Comprehensive totals validation
- Double-entry integrity verification
- Clear error messages if unbalanced
- Support for troubleshooting
- Foundation for reliable reports

### Verification Checklist
- [ ] validate_totals method defined
- [ ] Initializes total accumulators
- [ ] Iterates through all groups
- [ ] Sums opening debits and credits
- [ ] Sums period debits and credits
- [ ] Sums closing debits and credits
- [ ] Compares debits vs credits
- [ ] Calculates differences
- [ ] Returns validation result dictionary
- [ ] Includes error messages if failed
- [ ] Logs validation failures
- [ ] Uses Decimal precision
- [ ] Method docstring complete

---

## Summary

This document established the core Trial Balance calculation engine:

### Completed Infrastructure
- ✅ TrialBalanceGenerator class extending BaseReportGenerator
- ✅ Get all active accounts method with hierarchy ordering
- ✅ Balance calculation orchestration method
- ✅ Opening balance calculation from prior periods
- ✅ Period movement calculation for date range
- ✅ Closing balance calculation (opening + movements)
- ✅ Account type grouping with subtotals
- ✅ Totals validation for double-entry integrity

### Key Achievements
1. **Solid Foundation** - TrialBalanceGenerator ready for report generation
2. **Complete Calculations** - Opening, period, closing balances
3. **Organized Structure** - Account type grouping with subtotals
4. **Data Integrity** - Double-entry validation ensures accuracy
5. **Sri Lankan Context** - LKR currency, fiscal year support

### Calculation Flow
```
Accounts Retrieved → Opening Balance Calculated →
Period Movements Calculated → Closing Balance Calculated →
Grouped by Type → Subtotals Calculated → Totals Validated →
Ready for Output
```

### Next Steps
Proceed to [02_Tasks-25-30_TB-Comparison-Output.md](02_Tasks-25-30_TB-Comparison-Output.md) to implement:
- Trial Balance data structure for output
- Comparison mode with prior period
- Variance calculations
- HTML template for display/PDF
- PDF generator using WeasyPrint
- API endpoint for report access

---

**Document Status:** ✅ Complete  
**Total Tasks:** 8  
**Total Lines:** ~990
