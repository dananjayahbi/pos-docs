# Tasks 49-58: BalanceSheetGenerator and Asset/Liability Calculations

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 11 - Financial Reports  
> **Group:** D - Balance Sheet  
> **Document:** 01 of 02  
> **Tasks Covered:** 49, 50, 51, 52, 53, 54, 55, 56, 57, 58

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-59-64_BS-Validation-Output.md](02_Tasks-59-64_BS-Validation-Output.md)
- **← Previous Group:** [Group-C_Profit-Loss-Statement](../Group-C_Profit-Loss-Statement/)
- **→ Next Group:** [Group-E_Cash-Flow-General-Ledger](../Group-E_Cash-Flow-General-Ledger/)

---

## Document Overview

This document covers the Balance Sheet generator foundation and core asset and liability calculations. These elements establish the infrastructure for generating comprehensive Statement of Financial Position reports showing the company's financial position at a specific point in time.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 49 | Create BalanceSheetGenerator | Medium | 40 min |
| 50 | Add Get Asset Accounts | Low | 15 min |
| 51 | Add Get Liability Accounts | Low | 15 min |
| 52 | Add Get Equity Accounts | Low | 15 min |
| 53 | Add Calculate Current Assets | Medium | 35 min |
| 54 | Add Calculate Fixed Assets | Medium | 40 min |
| 55 | Add Calculate Total Assets | Low | 15 min |
| 56 | Add Calculate Current Liabilities | Medium | 35 min |
| 57 | Add Calculate Long-Term Liabilities | Medium | 30 min |
| 58 | Add Calculate Total Liabilities | Low | 15 min |

---

## Task 49: Create BalanceSheetGenerator

### Overview
Create the BalanceSheetGenerator class that extends BaseReportGenerator. This class serves as the foundation for Balance Sheet (Statement of Financial Position) report generation, implementing point-in-time financial position reporting with Sri Lankan accounting standards.

### Dependencies
- Task 48: BaseReportGenerator exists
- Chart of Accounts system established
- Account model with balance methods
- Django ORM configured

### Instructions

1. **Create balance_sheet.py file**
   - Navigate to `apps/accounting/reports/` directory
   - Create file named `balance_sheet.py`
   - This will contain the BalanceSheetGenerator class

2. **Import required modules**
   - Import BaseReportGenerator from base module
   - Import Account model
   - Import datetime utilities
   - Import Decimal for precise calculations
   - Import Sri Lankan currency formatting utilities

3. **Define BalanceSheetGenerator class**
   - Inherit from BaseReportGenerator
   - Add class docstring explaining Balance Sheet purpose
   - Note point-in-time nature vs period reporting

4. **Add report_name class attribute**
   - Set to "Balance Sheet"
   - Used for report identification
   - Appears in report header

5. **Add report_code class attribute**
   - Set to "BS"
   - Short identifier for the report
   - Used in file naming and logging

6. **Add __init__ method**
   - Accept tenant parameter
   - Accept as_of_date parameter (default to today)
   - Call parent __init__ with parameters
   - Initialize data storage dictionaries
   - Store as_of_date for calculations

7. **Add _initialize_data_structure method**
   - Override parent method if necessary
   - Create nested dictionaries for report sections
   - Sections: assets, liabilities, equity
   - Each section has subsections and line items

8. **Add _get_reporting_period_label method**
   - Return formatted period label
   - Format: "As of [Date]"
   - Example: "As of December 31, 2026"
   - Use Sri Lankan date format (DD/MM/YYYY)

9. **Add _validate_parameters method**
   - Check as_of_date is not in future
   - Validate date format
   - Check tenant has chart of accounts
   - Raise ValidationError if invalid

10. **Update __all__ in reports/__init__.py**
    - Import BalanceSheetGenerator
    - Add to module exports

### BalanceSheetGenerator Class Structure

```
┌─────────────────────────────────────────────────┐
│       BalanceSheetGenerator Class               │
├─────────────────────────────────────────────────┤
│ Attributes:                                     │
│  • report_name = "Balance Sheet"                │
│  • report_code = "BS"                           │
│  • tenant (Tenant instance)                     │
│  • as_of_date (date)                            │
│  • data (dict) - Report data structure          │
│                                                 │
│ Methods:                                        │
│  • __init__(tenant, as_of_date)                 │
│  • _initialize_data_structure()                 │
│  • _get_reporting_period_label()                │
│  • _validate_parameters()                       │
│  • [Methods added in subsequent tasks]          │
│                                                 │
│ Inherited from BaseReportGenerator:             │
│  • generate()                                   │
│  • to_dict()                                    │
│  • to_html()                                    │
│  • to_pdf()                                     │
└─────────────────────────────────────────────────┘
```

### Report Hierarchy

```
BalanceSheetGenerator
    │
    ├─── ASSETS Section
    │     ├─── Current Assets Subsection
    │     │     ├─── Cash and Cash Equivalents
    │     │     ├─── Accounts Receivable
    │     │     ├─── Inventory
    │     │     └─── Prepaid Expenses
    │     │
    │     └─── Non-Current Assets Subsection
    │           ├─── Property, Plant & Equipment
    │           ├─── Accumulated Depreciation (contra)
    │           └─── Net Fixed Assets
    │
    ├─── LIABILITIES Section
    │     ├─── Current Liabilities Subsection
    │     │     ├─── Accounts Payable
    │     │     ├─── EPF/ETF Payable
    │     │     ├─── PAYE Payable
    │     │     ├─── VAT Payable
    │     │     └─── Accrued Expenses
    │     │
    │     └─── Non-Current Liabilities Subsection
    │           └─── Long-term Loans
    │
    └─── EQUITY Section
          ├─── Owner's Capital
          ├─── Retained Earnings
          └─── Current Year Net Income
```

### Data Structure Format

```python
data = {
    'assets': {
        'current': {
            'cash': {'name': 'Cash and Cash Equivalents', 'amount': Decimal},
            'receivables': {'name': 'Accounts Receivable', 'amount': Decimal},
            'inventory': {'name': 'Inventory', 'amount': Decimal},
            'prepaid': {'name': 'Prepaid Expenses', 'amount': Decimal},
            'total': Decimal
        },
        'non_current': {
            'ppe_gross': {'name': 'Property, Plant & Equipment', 'amount': Decimal},
            'accumulated_depreciation': {'name': 'Accumulated Depreciation', 'amount': Decimal},
            'ppe_net': {'name': 'Net Fixed Assets', 'amount': Decimal},
            'total': Decimal
        },
        'total': Decimal
    },
    'liabilities': {
        'current': {...},
        'non_current': {...},
        'total': Decimal
    },
    'equity': {
        'capital': Decimal,
        'retained_earnings': Decimal,
        'current_net_income': Decimal,
        'total': Decimal
    }
}
```

### Point-in-Time Reporting

| Aspect | Balance Sheet | Profit & Loss |
|--------|--------------|---------------|
| Time Period | Point-in-time (as of date) | Period (from-to dates) |
| Data Type | Cumulative balances | Period activity |
| Label | "As of Dec 31, 2026" | "For period Jan 1 - Dec 31, 2026" |
| Frequency | Snapshot | Accumulation |
| Accounts | Assets, Liabilities, Equity | Revenue, Expenses |

### Sri Lankan Context

#### Currency Formatting
- Display all amounts in LKR (Sri Lankan Rupees)
- Format: Rs. 1,234,567.89
- Use comma thousands separator
- Two decimal places for cents

#### Date Format
- Sri Lankan standard: DD/MM/YYYY
- Example: 31/12/2026
- Report header: "As of 31st December 2026"

#### Compliance
- Follow Sri Lanka Accounting Standards (SLFRS/LKAS)
- LKAS 1: Presentation of Financial Statements
- Group current vs non-current correctly
- Show contra accounts separately

### Expected Outcome
- Functional BalanceSheetGenerator class
- Proper inheritance from BaseReportGenerator
- Point-in-time reporting capability
- Foundation for asset/liability calculations
- Sri Lankan standards compliance

### Verification Checklist
- [ ] balance_sheet.py file created
- [ ] BalanceSheetGenerator class defined
- [ ] Inherits from BaseReportGenerator
- [ ] report_name attribute set
- [ ] report_code attribute set
- [ ] __init__ method accepts tenant and as_of_date
- [ ] _initialize_data_structure method defined
- [ ] _get_reporting_period_label method defined
- [ ] _validate_parameters method defined
- [ ] Class imported in reports/__init__.py

---

## Task 50: Add Get Asset Accounts

### Overview
Add method to retrieve all asset accounts (1xxx series) from the chart of accounts. This method filters accounts by code range and returns accounts used in asset calculations for the Balance Sheet.

### Dependencies
- Task 49: Create BalanceSheetGenerator

### Instructions

1. **Open balance_sheet.py file**
   - Navigate to `apps/accounting/reports/balance_sheet.py`
   - Locate BalanceSheetGenerator class

2. **Add _get_asset_accounts method**
   - Define as private instance method
   - No parameters needed (uses self.tenant)
   - Returns queryset of asset accounts

3. **Query asset accounts by code range**
   - Filter accounts where code starts with '1'
   - Code range: 1000-1999
   - Include both parent and detail accounts

4. **Apply tenant filtering**
   - Ensure accounts belong to self.tenant
   - Use tenant-aware queryset filtering
   - Respect multi-tenancy isolation

5. **Filter active accounts only**
   - Include is_active=True filter
   - Exclude disabled/archived accounts
   - Only working accounts in report

6. **Order results logically**
   - Order by account code ascending
   - Standard chart of accounts ordering
   - Maintains hierarchical structure

7. **Add method docstring**
   - Explain asset account retrieval
   - Document code range (1xxx)
   - Note return type (queryset)

### Asset Account Code Structure

```
1xxx - ASSET ACCOUNTS
═══════════════════════════════════════

1000-1099: Setup/Header Accounts
  1000 - ASSETS (Header)

1100-1199: Current Assets
  1100 - Cash and Cash Equivalents
  1110 - Cash in Hand
  1120 - Bank Current Account
  1130 - Bank Savings Account
  1140 - Petty Cash
  1150 - Accounts Receivable
  1160 - Inventory
  1170 - Prepaid Expenses
  1180 - Other Current Assets

1200-1999: Non-Current Assets
  1200 - Property, Plant & Equipment
  1210 - Land
  1220 - Buildings
  1230 - Machinery & Equipment
  1240 - Furniture & Fixtures
  1250 - Vehicles
  1260 - Computer Equipment
  1270 - Office Equipment
  
  1800 - Accumulated Depreciation (Contra Asset)
  1810 - Accumulated Depreciation - Buildings
  1820 - Accumulated Depreciation - Machinery
  1830 - Accumulated Depreciation - Furniture
  1840 - Accumulated Depreciation - Vehicles
  1850 - Accumulated Depreciation - Computer Equipment
```

### Asset Categories

| Category | Code Range | Classification | Examples |
|----------|------------|----------------|----------|
| Current Assets | 1100-1199 | Short-term (< 1 year) | Cash, AR, Inventory |
| Fixed Assets | 1200-1799 | Long-term (> 1 year) | Land, Buildings, Equipment |
| Accumulated Depreciation | 1800-1899 | Contra Asset | Depreciation accounts |
| Other Assets | 1900-1999 | Long-term | Investments, Intangibles |

### Sri Lankan Asset Examples

#### Current Assets (1100-1199)
```
1110 - Cash in Hand                Rs. 125,000.00
1120 - Bank Current Account        Rs. 2,450,000.00
  - Bank of Ceylon (Current)
  - Commercial Bank (Current)
1130 - Bank Savings Account        Rs. 800,000.00
  - Sampath Bank (Savings)
1150 - Accounts Receivable         Rs. 1,250,000.00
1160 - Inventory                   Rs. 3,500,000.00
1170 - Prepaid Insurance           Rs. 45,000.00
```

#### Fixed Assets (1200-1799)
```
1210 - Land (Colombo)              Rs. 15,000,000.00
1220 - Shop Building               Rs. 8,000,000.00
1230 - POS Equipment               Rs. 450,000.00
1240 - Shop Furniture              Rs. 280,000.00
1250 - Delivery Van                Rs. 2,500,000.00
1260 - Computer Equipment          Rs. 320,000.00
```

#### Contra Asset Accounts (1800-1899)
```
1810 - Accum Depreciation - Building    Rs. (1,200,000.00)
1820 - Accum Depreciation - POS Equip   Rs. (180,000.00)
1830 - Accum Depreciation - Furniture   Rs. (112,000.00)
1840 - Accum Depreciation - Vehicle     Rs. (750,000.00)
1850 - Accum Depreciation - Computers   Rs. (192,000.00)
```

### Account Filtering Logic

```
Filter Criteria:
1. account.code.startswith('1')     ← Asset accounts only
2. account.tenant == self.tenant    ← Tenant isolation
3. account.is_active == True        ← Active accounts only
4. Order by account.code            ← Logical ordering

Result: Queryset of all active asset accounts for tenant
```

### Account Types in Assets

| Account Type | Include? | Reason |
|--------------|----------|--------|
| Parent accounts | Yes | Provide structure/grouping |
| Detail accounts | Yes | Hold actual balances |
| Contra accounts | Yes | Accumulated depreciation |
| Inactive accounts | No | Not in current use |
| Other tenants | No | Multi-tenancy isolation |

### Method Return Value

```python
# Returns Django QuerySet
accounts = self._get_asset_accounts()

# Can be used for:
for account in accounts:
    code = account.code              # e.g., "1110"
    name = account.name              # e.g., "Cash in Hand"
    balance = account.get_balance()  # e.g., Decimal('125000.00')
    
# Or filtered further:
current_assets = accounts.filter(code__gte='1100', code__lt='1200')
fixed_assets = accounts.filter(code__gte='1200', code__lt='1800')
```

### Expected Outcome
- Method retrieves all asset accounts
- Proper code range filtering (1xxx)
- Tenant-aware filtering applied
- Active accounts only
- Ordered by account code
- Foundation for asset calculations

### Verification Checklist
- [ ] _get_asset_accounts method defined
- [ ] Filters for code starting with '1'
- [ ] Tenant filtering applied
- [ ] Active accounts filter applied
- [ ] Results ordered by code
- [ ] Method docstring added
- [ ] Returns QuerySet of accounts

---

## Task 51: Add Get Liability Accounts

### Overview
Add method to retrieve all liability accounts (2xxx series) from the chart of accounts. This method filters accounts by code range and returns accounts used in liability calculations for the Balance Sheet.

### Dependencies
- Task 49: Create BalanceSheetGenerator

### Instructions

1. **Open balance_sheet.py file**
   - Continue in `apps/accounting/reports/balance_sheet.py`
   - Locate BalanceSheetGenerator class

2. **Add _get_liability_accounts method**
   - Define as private instance method
   - Similar structure to _get_asset_accounts
   - Returns queryset of liability accounts

3. **Query liability accounts by code range**
   - Filter accounts where code starts with '2'
   - Code range: 2000-2999
   - Include both parent and detail accounts

4. **Apply tenant filtering**
   - Ensure accounts belong to self.tenant
   - Use tenant-aware queryset filtering
   - Maintain multi-tenancy isolation

5. **Filter active accounts only**
   - Include is_active=True filter
   - Exclude disabled accounts
   - Only operational liability accounts

6. **Order results logically**
   - Order by account code ascending
   - Maintains chart of accounts structure
   - Supports hierarchical reporting

7. **Add method docstring**
   - Explain liability account retrieval
   - Document code range (2xxx)
   - Note return type and usage

### Liability Account Code Structure

```
2xxx - LIABILITY ACCOUNTS
═══════════════════════════════════════

2000-2099: Setup/Header Accounts
  2000 - LIABILITIES (Header)

2100-2199: Current Liabilities
  2100 - Accounts Payable
  2110 - Trade Creditors
  2120 - Supplier Payables
  2130 - EPF Payable (Employees' Provident Fund)
  2135 - ETF Payable (Employees' Trust Fund)
  2140 - PAYE Payable (Pay As You Earn Tax)
  2145 - VAT Payable (Value Added Tax)
  2150 - Accrued Expenses
  2160 - Unearned Revenue
  2170 - Short-term Loans
  2180 - Bank Overdraft

2200-2999: Non-Current Liabilities
  2200 - Long-term Loans
  2210 - Bank Loan - Commercial Bank
  2220 - Bank Loan - Bank of Ceylon
  2230 - Mortgage Payable
  2240 - Vehicle Loan
  2250 - Equipment Financing
```

### Liability Categories

| Category | Code Range | Classification | Examples |
|----------|------------|----------------|----------|
| Current Liabilities | 2100-2199 | Due within 1 year | Payables, taxes, short-term debt |
| Non-Current Liabilities | 2200-2999 | Due beyond 1 year | Long-term loans, mortgages |
| Statutory Liabilities | 2130-2149 | Sri Lankan compliance | EPF, ETF, PAYE, VAT |

### Sri Lankan Liability Examples

#### Current Liabilities (2100-2199)
```
2110 - Trade Creditors             Rs. 850,000.00
2120 - Supplier Payables           Rs. 425,000.00

Statutory Liabilities:
2130 - EPF Payable (12% employer)  Rs. 180,000.00
2135 - ETF Payable (3% employer)   Rs. 45,000.00
2140 - PAYE Payable                Rs. 125,000.00
2145 - VAT Payable (15%)           Rs. 320,000.00

Other Current:
2150 - Accrued Salaries            Rs. 285,000.00
2160 - Unearned Revenue            Rs. 95,000.00
2170 - Short-term Loan             Rs. 500,000.00
2180 - Bank Overdraft              Rs. 150,000.00
```

#### Non-Current Liabilities (2200-2999)
```
2210 - Bank Loan - Commercial Bank Rs. 2,500,000.00
  - Original: Rs. 5,000,000.00
  - Remaining term: 3 years
  
2220 - Bank Loan - Bank of Ceylon  Rs. 1,800,000.00
  - Shop expansion loan
  
2230 - Mortgage - Shop Property    Rs. 4,200,000.00
  - 10-year mortgage
  
2240 - Vehicle Loan - Delivery Van Rs. 1,250,000.00
  - 4-year loan term
```

### Sri Lankan Statutory Liabilities

#### EPF (Employees' Provident Fund)
- **Employer contribution:** 12% of gross salary
- **Employee contribution:** 8% (deducted from salary)
- **Account:** 2130 - EPF Payable
- **Payment:** Monthly to EPF Department
- **Due date:** 15th of following month

#### ETF (Employees' Trust Fund)
- **Employer contribution:** 3% of gross salary
- **No employee contribution**
- **Account:** 2135 - ETF Payable
- **Payment:** Monthly to ETF Board
- **Due date:** 15th of following month

#### PAYE (Pay As You Earn Tax)
- **Income tax withheld** from employee salaries
- **Rates:** Progressive (0%, 6%, 12%, 18%, 24%, 36%)
- **Account:** 2140 - PAYE Payable
- **Payment:** Monthly to Inland Revenue
- **Due date:** 15th of following month

#### VAT (Value Added Tax)
- **Standard rate:** 15% (as of 2026)
- **Account:** 2145 - VAT Payable
- **Calculation:** Output VAT - Input VAT
- **Payment:** Monthly to Inland Revenue
- **Due date:** 20th of following month

### Liability Recognition Timing

| Liability Type | Recognition | Example |
|---------------|-------------|---------|
| Trade Creditors | Goods/services received | Inventory purchased on credit |
| EPF/ETF | Payroll processed | Monthly salary run |
| PAYE | Salary payment | Tax withheld from employee |
| VAT | Sale invoiced | Customer invoice with VAT |
| Loans | Funds received | Bank loan disbursed |
| Accruals | Period-end | Unpaid utilities for month |

### Current vs Non-Current Classification

```
Current Liabilities (2100-2199):
✓ Payable within 12 months
✓ Part of operating cycle
✓ Regular business obligations
✓ Statutory payments

Examples:
- Accounts payable
- EPF/ETF/PAYE/VAT payable
- Accrued expenses
- Current portion of loans

Non-Current Liabilities (2200-2999):
✓ Payable beyond 12 months
✓ Long-term financing
✓ Major capital investments

Examples:
- Bank loans (long-term)
- Mortgages
- Equipment financing
```

### Account Filtering Logic

```
Filter Criteria:
1. account.code.startswith('2')     ← Liability accounts only
2. account.tenant == self.tenant    ← Tenant isolation
3. account.is_active == True        ← Active accounts only
4. Order by account.code            ← Logical ordering

Result: Queryset of all active liability accounts for tenant
```

### Expected Outcome
- Method retrieves all liability accounts
- Proper code range filtering (2xxx)
- Tenant-aware filtering applied
- Active accounts only
- Ordered by account code
- Foundation for liability calculations

### Verification Checklist
- [ ] _get_liability_accounts method defined
- [ ] Filters for code starting with '2'
- [ ] Tenant filtering applied
- [ ] Active accounts filter applied
- [ ] Results ordered by code
- [ ] Method docstring added
- [ ] Returns QuerySet of accounts

---

## Task 52: Add Get Equity Accounts

### Overview
Add method to retrieve all equity accounts (3xxx series) from the chart of accounts. This method filters accounts by code range and returns accounts used in equity calculations, including owner's capital and retained earnings.

### Dependencies
- Task 49: Create BalanceSheetGenerator

### Instructions

1. **Open balance_sheet.py file**
   - Continue in `apps/accounting/reports/balance_sheet.py`
   - Locate BalanceSheetGenerator class

2. **Add _get_equity_accounts method**
   - Define as private instance method
   - Similar structure to asset/liability methods
   - Returns queryset of equity accounts

3. **Query equity accounts by code range**
   - Filter accounts where code starts with '3'
   - Code range: 3000-3999
   - Include capital and retained earnings

4. **Apply tenant filtering**
   - Ensure accounts belong to self.tenant
   - Use tenant-aware queryset filtering
   - Maintain multi-tenancy isolation

5. **Filter active accounts only**
   - Include is_active=True filter
   - Exclude disabled equity accounts
   - Only active capital accounts

6. **Order results logically**
   - Order by account code ascending
   - Maintains chart of accounts structure
   - Capital accounts before retained earnings

7. **Add method docstring**
   - Explain equity account retrieval
   - Document code range (3xxx)
   - Note special handling for retained earnings

### Equity Account Code Structure

```
3xxx - EQUITY ACCOUNTS
═══════════════════════════════════════

3000-3099: Setup/Header Accounts
  3000 - OWNER'S EQUITY (Header)

3100-3199: Capital Accounts
  3100 - Owner's Capital
  3110 - Additional Capital
  3120 - Capital Contributions
  3130 - Partner A Capital
  3140 - Partner B Capital
  3150 - Share Capital (if incorporated)

3200-3299: Retained Earnings
  3200 - Retained Earnings
  3210 - Prior Years' Retained Earnings
  3220 - Current Year Net Income (temporary)

3300-3399: Drawing/Distributions
  3300 - Owner's Drawings
  3310 - Partner A Drawings
  3320 - Partner B Drawings
  3330 - Dividends Declared

3900-3999: Other Equity
  3900 - Treasury Stock (contra equity)
  3910 - Revaluation Reserve
  3920 - General Reserve
```

### Equity Categories

| Category | Code Range | Purpose | Examples |
|----------|------------|---------|----------|
| Capital | 3100-3199 | Owner investment | Owner's capital, share capital |
| Retained Earnings | 3200-3299 | Accumulated profits | Prior RE, current income |
| Drawings | 3300-3399 | Owner withdrawals | Drawings, dividends |
| Reserves | 3900-3999 | Appropriated equity | Revaluation, general reserves |

### Sri Lankan Business Equity Structures

#### Sole Proprietorship
```
3100 - Owner's Capital             Rs. 5,000,000.00
  - Initial investment
  - Additional contributions

3200 - Retained Earnings           Rs. 2,450,000.00
  - Accumulated profits from prior years

3220 - Current Year Net Income     Rs. 680,000.00
  - Profit from current period
  - Transferred to RE at year-end

3300 - Owner's Drawings            Rs. (450,000.00)
  - Monthly drawings for personal use
  - Contra equity account
```

#### Partnership
```
3130 - Partner A Capital           Rs. 3,000,000.00
  - 60% ownership

3140 - Partner B Capital           Rs. 2,000,000.00
  - 40% ownership

3200 - Retained Earnings           Rs. 1,200,000.00
  - Undistributed profits

3310 - Partner A Drawings          Rs. (180,000.00)
3320 - Partner B Drawings          Rs. (120,000.00)
```

#### Private Limited Company
```
3150 - Share Capital               Rs. 10,000,000.00
  - Issued and paid-up capital
  - 100,000 shares @ Rs. 100 each

3200 - Retained Earnings           Rs. 4,250,000.00
  - Accumulated undistributed profits

3220 - Current Year Net Income     Rs. 1,450,000.00
  - Profit after tax for current year

3330 - Dividends Declared          Rs. (500,000.00)
  - Interim dividends declared

3920 - General Reserve             Rs. 800,000.00
  - Transfer from retained earnings
```

### Retained Earnings Calculation

```
Opening Retained Earnings (Prior Years):
    3210 - Prior Years' Retained Earnings    Rs. 2,450,000.00

Plus: Current Year Net Income
    From Profit & Loss Statement             Rs. 680,000.00
    (Revenue - Expenses for period)

Less: Dividends/Distributions
    3330 - Dividends Declared                Rs. (200,000.00)

Equals: Ending Retained Earnings            Rs. 2,930,000.00
        (This becomes opening balance next period)
```

### Current Year Net Income

```
Special Handling:
- Net Income calculated from P&L generator
- Represents current period profit/loss
- Shown separately in equity section
- Added to retained earnings at period-end
- Temporary account, closed annually

Balance Sheet Presentation:
EQUITY
  Owner's Capital                 Rs. 5,000,000.00
  Retained Earnings               Rs. 2,450,000.00
  Current Year Net Income         Rs.   680,000.00
  Less: Owner's Drawings          Rs.  (450,000.00)
  ─────────────────────────────────────────────────
  TOTAL EQUITY                    Rs. 7,680,000.00
```

### Drawing/Distribution Accounts

#### Contra Equity Nature
- Reduce total equity
- Shown as negative amounts
- Represent owner withdrawals
- Not expenses (don't affect net income)

#### Examples
```
3300 - Owner's Drawings            Rs. (450,000.00)
  - Monthly personal draws: Rs. 37,500 × 12 months
  
3330 - Dividends Declared          Rs. (500,000.00)
  - Interim dividend: Rs. 5 per share × 100,000 shares
  
Note: Shown in parentheses or with minus sign
```

### Equity Account Types

| Account Type | Normal Balance | Effect on Equity | Example |
|--------------|---------------|------------------|---------|
| Capital | Credit | Increases | Owner invests cash |
| Retained Earnings | Credit | Increases | Accumulated profits |
| Current Income | Credit | Increases | Period profit |
| Drawings | Debit | Decreases | Owner withdrawal |
| Dividends | Debit | Decreases | Shareholder distribution |

### Sri Lankan Company Types and Equity

#### Sole Trader (Individual Business)
- Single owner's capital account
- No share capital
- Drawings for personal use
- Simplest structure

#### Partnership
- Multiple capital accounts (one per partner)
- Partnership agreement defines profit sharing
- Individual drawing accounts
- Partnership Act governs

#### Private Limited Company (Pvt Ltd)
- Share capital structure
- Companies Act No. 07 of 2007
- Must maintain statutory registers
- Dividends require director approval

#### Public Limited Company (PLC)
- Larger share capital
- Listed on Colombo Stock Exchange (CSE)
- More stringent reporting requirements
- Mandatory audits

### Account Filtering Logic

```
Filter Criteria:
1. account.code.startswith('3')     ← Equity accounts only
2. account.tenant == self.tenant    ← Tenant isolation
3. account.is_active == True        ← Active accounts only
4. Order by account.code            ← Logical ordering

Result: Queryset of all active equity accounts for tenant
```

### Expected Outcome
- Method retrieves all equity accounts
- Proper code range filtering (3xxx)
- Tenant-aware filtering applied
- Active accounts only
- Ordered by account code
- Foundation for equity calculations

### Verification Checklist
- [ ] _get_equity_accounts method defined
- [ ] Filters for code starting with '3'
- [ ] Tenant filtering applied
- [ ] Active accounts filter applied
- [ ] Results ordered by code
- [ ] Method docstring added
- [ ] Returns QuerySet of accounts

---

## Task 53: Add Calculate Current Assets

### Overview
Add method to calculate total current assets by summing balances of accounts in the 1100-1199 code range. Current assets are short-term resources expected to be converted to cash or consumed within one year.

### Dependencies
- Task 50: Add Get Asset Accounts

### Instructions

1. **Open balance_sheet.py file**
   - Continue in `apps/accounting/reports/balance_sheet.py`
   - Locate BalanceSheetGenerator class

2. **Add _calculate_current_assets method**
   - Define as private instance method
   - Returns dictionary with current asset details
   - Uses as_of_date for balance calculation

3. **Get all asset accounts**
   - Call self._get_asset_accounts()
   - Filter for current asset range (1100-1199)
   - Exclude header/parent accounts if needed

4. **Define current asset categories**
   - Cash and Cash Equivalents (1100-1149)
   - Accounts Receivable (1150-1159)
   - Inventory (1160-1169)
   - Prepaid Expenses (1170-1179)
   - Other Current Assets (1180-1199)

5. **Calculate balance for each category**
   - Sum account balances using get_balance(as_of_date)
   - Use Decimal type for precision
   - Initialize all categories to Decimal('0.00')

6. **Calculate subtotals**
   - Sum each category separately
   - Store individual category totals
   - Useful for detailed reporting

7. **Calculate total current assets**
   - Sum all category subtotals
   - Store as 'total_current_assets'
   - Return comprehensive dictionary

8. **Store results in data structure**
   - Update self.data['assets']['current']
   - Store each category amount
   - Store total current assets

9. **Add method docstring**
   - Explain current assets calculation
   - Document categories included
   - Note date parameter usage

### Current Assets Categories

```
CURRENT ASSETS (1100-1199)
═══════════════════════════════════════

Cash and Cash Equivalents (1100-1149)
  1110 - Cash in Hand
  1120 - Bank Current Account
  1130 - Bank Savings Account
  1140 - Petty Cash
  1145 - Cash in Transit

Accounts Receivable (1150-1159)
  1150 - Accounts Receivable
  1155 - Notes Receivable
  1158 - Allowance for Doubtful Debts (contra)

Inventory (1160-1169)
  1160 - Inventory - Raw Materials
  1162 - Inventory - Work in Progress
  1165 - Inventory - Finished Goods
  1167 - Inventory - Merchandise

Prepaid Expenses (1170-1179)
  1170 - Prepaid Rent
  1172 - Prepaid Insurance
  1175 - Prepaid Licenses
  1177 - Prepaid Utilities

Other Current Assets (1180-1199)
  1180 - Advances to Suppliers
  1185 - Employee Advances
  1190 - Other Receivables
```

### Current Assets Calculation

```
Category Subtotals:
──────────────────────────────────────

Cash and Cash Equivalents:
  1110 - Cash in Hand              Rs.   125,000.00
  1120 - Bank - BOC Current        Rs. 1,250,000.00
  1120 - Bank - Commercial Current Rs.   680,000.00
  1130 - Bank - Sampath Savings    Rs.   800,000.00
  1140 - Petty Cash                Rs.    15,000.00
  ─────────────────────────────────────────────────
  Subtotal Cash                    Rs. 2,870,000.00

Accounts Receivable:
  1150 - Accounts Receivable       Rs. 1,450,000.00
  1158 - Allowance for Bad Debts   Rs.   (50,000.00)
  ─────────────────────────────────────────────────
  Subtotal Receivables             Rs. 1,400,000.00

Inventory:
  1165 - Finished Goods            Rs. 2,800,000.00
  1167 - Merchandise               Rs.   950,000.00
  ─────────────────────────────────────────────────
  Subtotal Inventory               Rs. 3,750,000.00

Prepaid Expenses:
  1170 - Prepaid Rent              Rs.    85,000.00
  1172 - Prepaid Insurance         Rs.    45,000.00
  ─────────────────────────────────────────────────
  Subtotal Prepaid                 Rs.   130,000.00

Other Current Assets:
  1180 - Advances to Suppliers     Rs.    75,000.00
  1185 - Employee Advances         Rs.    35,000.00
  ─────────────────────────────────────────────────
  Subtotal Other                   Rs.   110,000.00

═════════════════════════════════════════════════
TOTAL CURRENT ASSETS               Rs. 8,260,000.00
═════════════════════════════════════════════════
```

### Sri Lankan Current Assets Examples

#### Retail Store
```
Cash in Hand (Counter float)        Rs.   50,000.00
Bank - Bank of Ceylon               Rs. 1,800,000.00
Bank - Commercial Bank              Rs.   950,000.00
Accounts Receivable (Credit sales)  Rs.   680,000.00
Inventory (Merchandise)             Rs. 4,200,000.00
Prepaid Shop Rent (3 months)        Rs.   150,000.00
────────────────────────────────────────────────
Total Current Assets               Rs. 7,830,000.00
```

#### Service Business
```
Cash and Bank                       Rs. 1,250,000.00
Accounts Receivable (Customers)     Rs.   850,000.00
Prepaid Insurance                   Rs.    45,000.00
Prepaid Office Rent                 Rs.   120,000.00
Employee Advances                   Rs.    25,000.00
────────────────────────────────────────────────
Total Current Assets               Rs. 2,290,000.00
```

### Cash and Cash Equivalents Detail

#### Physical Cash (1110)
- Cash in register/till
- Daily float maintained
- Counted at end of day
- Security concerns in Sri Lanka
- Typical range: Rs. 50,000 - 200,000

#### Bank Current Accounts (1120)
- Operating accounts for transactions
- Check/cheque payments
- Online transfers (CEFT, SLIPS)
- Multiple banks common
- Popular banks: BOC, Commercial, HNB, Sampath

#### Bank Savings Accounts (1130)
- Interest-earning accounts
- Excess cash parking
- Interest rates: 6-8% typical
- Easy access to funds

#### Petty Cash (1140)
- Small daily expenses
- Maintained on imprest system
- Typical amount: Rs. 10,000 - 50,000
- Replenished regularly

### Accounts Receivable Considerations

#### Gross Receivables
- Total amount owed by customers
- Credit sales outstanding
- Payment terms typically 30-90 days

#### Allowance for Doubtful Debts
- Contra asset account
- Estimated uncollectible amounts
- Reduces receivables to net realizable value
- Common rates: 2-5% of receivables

#### Net Receivables
- Gross Receivables - Allowance
- Reported on Balance Sheet
- More conservative estimate

### Inventory Valuation

#### Valuation Methods
- FIFO (First In, First Out) - Most common in Sri Lanka
- Weighted Average Cost
- Lower of Cost or Net Realizable Value

#### Inventory Categories
- Raw Materials (Manufacturing)
- Work in Progress (Manufacturing)
- Finished Goods (Manufacturing)
- Merchandise (Retail/Trading)

#### Inventory Value
- Cost includes: Purchase price + Import duties + Freight
- VAT on purchases is input VAT (not included in cost)

### Prepaid Expenses Common Items

| Prepaid Item | Typical Amount | Payment Frequency |
|--------------|---------------|-------------------|
| Shop Rent | Rs. 100,000-300,000 | Quarterly advance |
| Insurance | Rs. 40,000-100,000 | Annual policy |
| Business Licenses | Rs. 10,000-50,000 | Annual renewal |
| Software Subscriptions | Rs. 20,000-80,000 | Annual payment |

### Current Asset Liquidity Ranking

```
Most Liquid → Least Liquid
──────────────────────────────────────

1. Cash in Hand                    ← Immediately available
2. Bank Accounts                   ← Same-day access
3. Marketable Securities           ← Quick conversion
4. Accounts Receivable             ← 30-90 days
5. Inventory                       ← Time to sell + collect
6. Prepaid Expenses               ← Not convertible (consumed)
```

### Return Value Structure

```python
{
    'cash_and_equivalents': {
        'name': 'Cash and Cash Equivalents',
        'amount': Decimal('2870000.00'),
        'accounts': [list of account details]
    },
    'accounts_receivable': {
        'name': 'Accounts Receivable',
        'amount': Decimal('1400000.00'),  # Net of allowance
        'accounts': [list of account details]
    },
    'inventory': {
        'name': 'Inventory',
        'amount': Decimal('3750000.00'),
        'accounts': [list of account details]
    },
    'prepaid_expenses': {
        'name': 'Prepaid Expenses',
        'amount': Decimal('130000.00'),
        'accounts': [list of account details]
    },
    'other_current_assets': {
        'name': 'Other Current Assets',
        'amount': Decimal('110000.00'),
        'accounts': [list of account details]
    },
    'total': Decimal('8260000.00')
}
```

### Expected Outcome
- Current assets categorized properly
- Accurate balance calculations
- Subtotals for each category
- Total current assets calculated
- Sri Lankan business context considered
- Point-in-time balance accuracy

### Verification Checklist
- [ ] _calculate_current_assets method defined
- [ ] Asset accounts filtered (1100-1199)
- [ ] Cash and equivalents calculated
- [ ] Accounts receivable calculated (net)
- [ ] Inventory calculated
- [ ] Prepaid expenses calculated
- [ ] Other current assets calculated
- [ ] Total current assets summed
- [ ] Results stored in data structure
- [ ] Method docstring added

---

## Task 54: Add Calculate Fixed Assets

### Overview
Add method to calculate total fixed assets (Property, Plant & Equipment) net of accumulated depreciation. Fixed assets represent long-term tangible resources used in business operations, shown at cost less accumulated depreciation.

### Dependencies
- Task 50: Add Get Asset Accounts

### Instructions

1. **Open balance_sheet.py file**
   - Continue in `apps/accounting/reports/balance_sheet.py`
   - Locate BalanceSheetGenerator class

2. **Add _calculate_fixed_assets method**
   - Define as private instance method
   - Returns dictionary with fixed asset details
   - Calculates gross and net amounts

3. **Get all asset accounts**
   - Call self._get_asset_accounts()
   - Filter for fixed asset range (1200-1799)
   - Separate from depreciation range (1800-1899)

4. **Define fixed asset categories**
   - Land (1210-1219)
   - Buildings (1220-1229)
   - Machinery & Equipment (1230-1239)
   - Furniture & Fixtures (1240-1249)
   - Vehicles (1250-1259)
   - Computer Equipment (1260-1269)
   - Office Equipment (1270-1279)

5. **Calculate gross fixed assets**
   - Sum all accounts in 1200-1799 range
   - This is the cost/acquisition value
   - Store as 'gross_fixed_assets'

6. **Get accumulated depreciation accounts**
   - Filter accounts in 1800-1899 range
   - These are contra asset accounts
   - Calculate total accumulated depreciation

7. **Calculate net fixed assets**
   - Formula: Gross Fixed Assets - Accumulated Depreciation
   - Store as 'net_fixed_assets'
   - This is the book value/carrying value

8. **Calculate by category with depreciation**
   - For each asset category, calculate:
     - Gross cost
     - Related accumulated depreciation
     - Net book value
   - Enables detailed reporting

9. **Store results in data structure**
   - Update self.data['assets']['non_current']
   - Store gross, depreciation, and net amounts
   - Maintain category breakdown

10. **Add method docstring**
    - Explain fixed assets and depreciation
    - Document net calculation
    - Note contra account handling

### Fixed Assets Code Structure

```
FIXED ASSETS (1200-1899)
═══════════════════════════════════════

Asset Cost Accounts (1200-1799):

1200-1209: Header/Setup
  1200 - Property, Plant & Equipment (Header)

1210-1219: Land
  1210 - Land - Colombo Office
  1215 - Land - Kandy Branch

1220-1229: Buildings
  1220 - Shop Building - Colombo
  1225 - Warehouse - Colombo

1230-1239: Machinery & Equipment
  1230 - POS Equipment
  1235 - Production Machinery
  1238 - Generator

1240-1249: Furniture & Fixtures
  1240 - Shop Furniture
  1245 - Office Furniture

1250-1259: Vehicles
  1250 - Delivery Van - Toyota
  1255 - Company Car - Honda

1260-1269: Computer Equipment
  1260 - Desktop Computers
  1265 - Laptops
  1268 - Servers

1270-1279: Office Equipment
  1270 - Printers & Scanners
  1275 - Photocopier

Accumulated Depreciation (1800-1899):

1800 - Accumulated Depreciation (Header)

1810-1819: Buildings Depreciation
  1810 - Accum Depreciation - Shop Building
  1815 - Accum Depreciation - Warehouse

1820-1829: Machinery Depreciation
  1820 - Accum Depreciation - POS Equipment
  1825 - Accum Depreciation - Machinery

1830-1839: Furniture Depreciation
  1830 - Accum Depreciation - Shop Furniture
  1835 - Accum Depreciation - Office Furniture

1840-1849: Vehicle Depreciation
  1840 - Accum Depreciation - Delivery Van
  1845 - Accum Depreciation - Company Car

1850-1859: Computer Depreciation
  1850 - Accum Depreciation - Computers

1860-1869: Office Equipment Depreciation
  1860 - Accum Depreciation - Office Equipment
```

### Fixed Assets Calculation

```
PROPERTY, PLANT & EQUIPMENT
═══════════════════════════════════════

Asset Category          Cost      Accum Depr    Net Value
─────────────────────────────────────────────────────────

Land:
  Colombo Office   15,000,000          -      15,000,000
  (Land not depreciated)

Buildings:
  Shop Building     8,000,000  (1,200,000)     6,800,000
  Warehouse         3,500,000    (525,000)     2,975,000
  ───────────────────────────────────────────────────────
  Subtotal         11,500,000  (1,725,000)     9,775,000

Machinery & Equipment:
  POS Equipment       450,000    (180,000)       270,000
  Generator           380,000    (114,000)       266,000
  ───────────────────────────────────────────────────────
  Subtotal            830,000    (294,000)       536,000

Furniture & Fixtures:
  Shop Furniture      280,000    (112,000)       168,000
  Office Furniture    150,000     (45,000)       105,000
  ───────────────────────────────────────────────────────
  Subtotal            430,000    (157,000)       273,000

Vehicles:
  Delivery Van      2,500,000    (750,000)     1,750,000
  Company Car       1,800,000    (540,000)     1,260,000
  ───────────────────────────────────────────────────────
  Subtotal          4,300,000  (1,290,000)     3,010,000

Computer Equipment:
  Computers           320,000    (192,000)       128,000
  Servers             280,000     (84,000)       196,000
  ───────────────────────────────────────────────────────
  Subtotal            600,000    (276,000)       324,000

Office Equipment:
  Printers             85,000     (42,500)        42,500
  Photocopier         120,000     (48,000)        72,000
  ───────────────────────────────────────────────────────
  Subtotal            205,000     (90,500)       114,500

═══════════════════════════════════════════════════════
TOTAL FIXED ASSETS 37,865,000  (4,832,500)   33,032,500
═══════════════════════════════════════════════════════

Balance Sheet Presentation:
  Property, Plant & Equipment (at cost)   Rs. 37,865,000.00
  Less: Accumulated Depreciation          Rs. (4,832,500.00)
  ─────────────────────────────────────────────────────────
  Net Fixed Assets                        Rs. 33,032,500.00
```

### Sri Lankan Depreciation Methods

#### Straight-Line Method (Most Common)
```
Annual Depreciation = (Cost - Salvage Value) / Useful Life

Example - Building:
  Cost: Rs. 8,000,000
  Salvage Value: Rs. 0
  Useful Life: 40 years
  Annual Depreciation: Rs. 8,000,000 / 40 = Rs. 200,000
  Rate: 2.5% per year
```

#### Reducing Balance Method
```
Annual Depreciation = Book Value × Depreciation Rate

Example - Vehicle:
  Cost: Rs. 2,500,000
  Rate: 25% per year
  Year 1: Rs. 2,500,000 × 25% = Rs. 625,000
  Year 2: Rs. 1,875,000 × 25% = Rs. 468,750
  Year 3: Rs. 1,406,250 × 25% = Rs. 351,563
```

### Sri Lankan Standard Depreciation Rates

| Asset Type | Straight-Line Rate | Reducing Balance Rate | Useful Life |
|------------|-------------------|----------------------|-------------|
| Buildings | 2.5% - 5% | 5% - 10% | 20-40 years |
| Machinery | 10% - 20% | 20% - 30% | 5-10 years |
| Furniture | 10% - 20% | 20% - 25% | 5-10 years |
| Vehicles | 20% - 25% | 25% - 33.33% | 4-5 years |
| Computers | 20% - 25% | 33.33% - 40% | 4-5 years |
| Office Equipment | 10% - 20% | 20% - 25% | 5-10 years |

### Asset Acquisition and Capitalization

#### Purchase of Fixed Asset
```
Example: Purchase Delivery Van
Date: January 1, 2025
Cost: Rs. 2,500,000
Registration: Rs. 50,000
Insurance (1 year): Rs. 45,000

Capitalized Cost:
  Vehicle cost             Rs. 2,500,000
  Registration              Rs.    50,000
  ─────────────────────────────────────
  Total capitalized        Rs. 2,550,000

Insurance is prepaid expense (not capitalized)
```

#### Assets that are NOT Depreciated
- **Land:** Appreciates, not depreciated
- **Capital Work in Progress:** Not yet in use
- **Antiques/Artwork:** May appreciate

### Contra Asset Account - Accumulated Depreciation

#### Nature of Account
- Asset account with credit balance
- Reduces total assets
- Accumulates over time
- Never exceeds cost of related asset

#### Journal Entry for Depreciation
```
Debit: Depreciation Expense (5xxx)     Rs. 100,000
Credit: Accumulated Depreciation (18xx) Rs. 100,000

Effect on Financial Statements:
- Income Statement: Depreciation expense (reduces profit)
- Balance Sheet: Accum depreciation (reduces asset value)
```

### Net Book Value vs Fair Market Value

```
Net Book Value (Carrying Value):
= Cost - Accumulated Depreciation
= Amount shown on Balance Sheet
= Not necessarily market value

Example:
  Building purchased 2016: Rs. 5,000,000
  Accumulated Depreciation: Rs. 1,250,000
  Net Book Value 2026: Rs. 3,750,000
  
  Fair Market Value 2026: Rs. 12,000,000 (appreciated!)
  
Note: Balance Sheet shows book value, not market value
```

### Sri Lankan Fixed Asset Examples

#### Small Retail Shop
```
Shop Building (leasehold improvement) Rs. 2,000,000
Less: Accumulated Depreciation         Rs.  (400,000)
Net Building                           Rs. 1,600,000

Shop Furniture & Fixtures              Rs.   350,000
Less: Accumulated Depreciation         Rs.  (140,000)
Net Furniture                          Rs.   210,000

POS System & Equipment                 Rs.   180,000
Less: Accumulated Depreciation         Rs.   (90,000)
Net POS Equipment                      Rs.    90,000

Computer & Office Equipment            Rs.   120,000
Less: Accumulated Depreciation         Rs.   (60,000)
Net Computer Equipment                 Rs.    60,000
───────────────────────────────────────────────────
Total Net Fixed Assets                 Rs. 1,960,000
```

#### Service Business
```
Office Furniture                       Rs.   280,000
Less: Accumulated Depreciation         Rs.   (84,000)
Net Furniture                          Rs.   196,000

Computer Equipment                     Rs.   450,000
Less: Accumulated Depreciation         Rs.  (225,000)
Net Computers                          Rs.   225,000

Company Vehicle                        Rs. 1,800,000
Less: Accumulated Depreciation         Rs.  (720,000)
Net Vehicle                            Rs. 1,080,000
───────────────────────────────────────────────────
Total Net Fixed Assets                 Rs. 1,501,000
```

### Disposal of Fixed Assets

When asset is sold or discarded:
1. Remove asset cost (debit accumulated depreciation)
2. Remove accumulated depreciation (debit accumulated depreciation)
3. Record proceeds (debit cash)
4. Record gain or loss (difference)

### Return Value Structure

```python
{
    'gross_fixed_assets': Decimal('37865000.00'),
    'accumulated_depreciation': Decimal('-4832500.00'),  # Negative
    'net_fixed_assets': Decimal('33032500.00'),
    
    'categories': {
        'land': {
            'name': 'Land',
            'cost': Decimal('15000000.00'),
            'depreciation': Decimal('0.00'),
            'net': Decimal('15000000.00')
        },
        'buildings': {
            'name': 'Buildings',
            'cost': Decimal('11500000.00'),
            'depreciation': Decimal('-1725000.00'),
            'net': Decimal('9775000.00')
        },
        # ... other categories
    },
    
    'total': Decimal('33032500.00')  # Net fixed assets
}
```

### Expected Outcome
- Gross fixed assets calculated
- Accumulated depreciation totaled
- Net fixed assets computed
- Category breakdown available
- Contra account handled correctly
- Sri Lankan depreciation standards considered

### Verification Checklist
- [ ] _calculate_fixed_assets method defined
- [ ] Fixed asset accounts filtered (1200-1799)
- [ ] Gross fixed assets calculated
- [ ] Accumulated depreciation retrieved (1800-1899)
- [ ] Net fixed assets calculated
- [ ] Category breakdown implemented
- [ ] Land not depreciated
- [ ] Contra account shown as negative
- [ ] Results stored in data structure
- [ ] Method docstring added

---

## Task 55: Add Calculate Total Assets

### Overview
Add method to calculate total assets by summing current assets and non-current (fixed) assets. This represents the total resources controlled by the business at the reporting date.

### Dependencies
- Task 53: Add Calculate Current Assets
- Task 54: Add Calculate Fixed Assets

### Instructions

1. **Open balance_sheet.py file**
   - Continue in `apps/accounting/reports/balance_sheet.py`
   - Locate BalanceSheetGenerator class

2. **Add _calculate_total_assets method**
   - Define as private instance method
   - Returns Decimal with total assets
   - Depends on current and fixed asset calculations

3. **Call current assets calculation**
   - Invoke self._calculate_current_assets()
   - Get total from returned dictionary
   - Store as current_assets_total

4. **Call fixed assets calculation**
   - Invoke self._calculate_fixed_assets()
   - Get net fixed assets from returned dictionary
   - Store as non_current_assets_total

5. **Sum total assets**
   - Add current_assets_total + non_current_assets_total
   - Use Decimal arithmetic
   - Store result as total_assets

6. **Store in data structure**
   - Update self.data['assets']['total']
   - Include both subtotals and grand total
   - Maintain hierarchy for reporting

7. **Return total assets**
   - Return Decimal value
   - Used in validation (Assets = Liabilities + Equity)
   - Critical for Balance Sheet equation

8. **Add method docstring**
   - Explain total assets calculation
   - Note components included
   - Mention accounting equation usage

### Total Assets Calculation

```
ASSETS
═══════════════════════════════════════

CURRENT ASSETS
  Cash and Cash Equivalents      Rs.  2,870,000.00
  Accounts Receivable (Net)      Rs.  1,400,000.00
  Inventory                      Rs.  3,750,000.00
  Prepaid Expenses               Rs.    130,000.00
  Other Current Assets           Rs.    110,000.00
  ────────────────────────────────────────────────
  TOTAL CURRENT ASSETS           Rs.  8,260,000.00

NON-CURRENT ASSETS
  Property, Plant & Equipment
    At Cost                      Rs. 37,865,000.00
    Less: Accumulated Depr       Rs. (4,832,500.00)
  ────────────────────────────────────────────────
  Net Fixed Assets               Rs. 33,032,500.00
  ────────────────────────────────────────────────
  TOTAL NON-CURRENT ASSETS       Rs. 33,032,500.00

═════════════════════════════════════════════════
TOTAL ASSETS                     Rs. 41,292,500.00
═════════════════════════════════════════════════
```

### Asset Classification

```
Total Assets = Current Assets + Non-Current Assets

Current Assets:
✓ Expected to be realized within 12 months
✓ Liquid or near-liquid resources
✓ Operating cycle assets

Non-Current Assets:
✓ Held for longer than 12 months
✓ Not easily convertible to cash
✓ Long-term operational assets
```

### Assets in Accounting Equation

```
FUNDAMENTAL ACCOUNTING EQUATION
═══════════════════════════════════════

ASSETS = LIABILITIES + EQUITY

Total Assets is left side of equation
Must equal right side (L + E)
Balance Sheet must balance
```

### Sri Lankan Total Assets Examples

#### Small Retail Business
```
ASSETS
Current Assets:
  Cash and Bank                  Rs.  1,250,000.00
  Accounts Receivable            Rs.    450,000.00
  Inventory                      Rs.  2,800,000.00
  Prepaid Expenses               Rs.     85,000.00
  ────────────────────────────────────────────────
  Total Current Assets           Rs.  4,585,000.00

Non-Current Assets:
  Shop Building (Net)            Rs.  1,600,000.00
  Furniture & Fixtures (Net)     Rs.    210,000.00
  POS Equipment (Net)            Rs.     90,000.00
  Computer Equipment (Net)       Rs.     60,000.00
  ────────────────────────────────────────────────
  Total Non-Current Assets       Rs.  1,960,000.00

═════════════════════════════════════════════════
TOTAL ASSETS                     Rs.  6,545,000.00
═════════════════════════════════════════════════
```

#### Service Business
```
ASSETS
Current Assets:
  Cash and Bank                  Rs.    850,000.00
  Accounts Receivable            Rs.    620,000.00
  Prepaid Expenses               Rs.     45,000.00
  ────────────────────────────────────────────────
  Total Current Assets           Rs.  1,515,000.00

Non-Current Assets:
  Office Furniture (Net)         Rs.    196,000.00
  Computer Equipment (Net)       Rs.    225,000.00
  Company Vehicle (Net)          Rs.  1,080,000.00
  ────────────────────────────────────────────────
  Total Non-Current Assets       Rs.  1,501,000.00

═════════════════════════════════════════════════
TOTAL ASSETS                     Rs.  3,016,000.00
═════════════════════════════════════════════════
```

### Current vs Non-Current Ratio

```
Asset Structure Analysis:
────────────────────────────────────────

Example Business:
Total Assets: Rs. 41,292,500.00

Current Assets:    Rs.  8,260,000.00 (20%)
Non-Current Assets: Rs. 33,032,500.00 (80%)

Interpretation:
- Capital-intensive business
- Significant investment in fixed assets
- Lower liquidity ratio
- Typical for manufacturing/retail with property

Service Business Comparison:
Current Assets:    Rs.  1,515,000.00 (50%)
Non-Current Assets: Rs.  1,501,000.00 (50%)

- More balanced structure
- Higher liquidity
- Typical for service businesses
```

### Total Assets Growth

```
Year-over-Year Comparison:
────────────────────────────────────────

                   2025              2026         Change
Current Assets:    Rs. 7,100,000    Rs. 8,260,000   +16%
Fixed Assets:      Rs. 31,500,000   Rs. 33,032,500  +5%
─────────────────────────────────────────────────────────
Total Assets:      Rs. 38,600,000   Rs. 41,292,500  +7%

Analysis:
- Business growth of 7%
- Current assets growing faster (working capital increase)
- Fixed assets growing slower (depreciation vs new purchases)
```

### Total Assets per Business Type

| Business Type | Typical Assets | Current % | Non-Current % |
|---------------|---------------|-----------|---------------|
| Retail Shop | Rs. 5-10M | 60-70% | 30-40% |
| Restaurant | Rs. 8-15M | 40-50% | 50-60% |
| Manufacturing | Rs. 20-50M | 30-40% | 60-70% |
| Service Business | Rs. 2-5M | 50-60% | 40-50% |
| Software/IT | Rs. 3-8M | 70-80% | 20-30% |

### Method Flow

```
_calculate_total_assets()
    │
    ├──→ Call _calculate_current_assets()
    │       └──→ Returns: Rs. 8,260,000.00
    │
    ├──→ Call _calculate_fixed_assets()
    │       └──→ Returns: Rs. 33,032,500.00 (net)
    │
    ├──→ Sum totals:
    │       8,260,000.00 + 33,032,500.00
    │       = 41,292,500.00
    │
    └──→ Store and return: Rs. 41,292,500.00
```

### Data Structure Update

```python
self.data['assets'] = {
    'current': {
        'total': Decimal('8260000.00'),
        # ... category details
    },
    'non_current': {
        'total': Decimal('33032500.00'),
        # ... category details
    },
    'total': Decimal('41292500.00')  # ← Set by this method
}
```

### Usage in Balance Validation

```
Later used in Task 61 (Balance Validation):

total_assets = self._calculate_total_assets()
total_liabilities = self._calculate_total_liabilities()
total_equity = self._calculate_total_equity()

if total_assets != (total_liabilities + total_equity):
    raise BalanceSheetValidationError(
        f"Balance Sheet does not balance. "
        f"Assets: {total_assets}, "
        f"Liabilities + Equity: {total_liabilities + total_equity}"
    )
```

### Expected Outcome
- Total assets accurately calculated
- Sum of current and non-current assets
- Stored in data structure
- Available for Balance Sheet equation validation
- Proper Decimal precision maintained

### Verification Checklist
- [ ] _calculate_total_assets method defined
- [ ] Calls _calculate_current_assets
- [ ] Calls _calculate_fixed_assets
- [ ] Sums current and non-current totals
- [ ] Uses Decimal arithmetic
- [ ] Stores result in self.data['assets']['total']
- [ ] Returns total assets value
- [ ] Method docstring added

---

## Task 56: Add Calculate Current Liabilities

### Overview
Add method to calculate total current liabilities by summing balances of accounts in the 2100-2199 code range. Includes trade payables, accrued expenses, and Sri Lankan statutory liabilities (EPF, ETF, PAYE, VAT).

### Dependencies
- Task 51: Add Get Liability Accounts

### Instructions

1. **Open balance_sheet.py file**
   - Continue in `apps/accounting/reports/balance_sheet.py`
   - Locate BalanceSheetGenerator class

2. **Add _calculate_current_liabilities method**
   - Define as private instance method
   - Returns dictionary with current liability details
   - Uses as_of_date for balance calculation

3. **Get all liability accounts**
   - Call self._get_liability_accounts()
   - Filter for current liability range (2100-2199)
   - Exclude header accounts

4. **Define current liability categories**
   - Trade Payables (2100-2129)
   - Statutory Liabilities (2130-2149) - EPF, ETF, PAYE, VAT
   - Accrued Expenses (2150-2159)
   - Unearned Revenue (2160-2169)
   - Short-term Debt (2170-2189)
   - Other Current Liabilities (2190-2199)

5. **Calculate balance for each category**
   - Sum account balances using get_balance(as_of_date)
   - Use Decimal type for precision
   - Initialize all categories to Decimal('0.00')

6. **Handle statutory liabilities separately**
   - EPF Payable (2130)
   - ETF Payable (2135)
   - PAYE Payable (2140)
   - VAT Payable (2145)
   - These are critical for Sri Lankan compliance

7. **Calculate subtotals**
   - Sum each category separately
   - Store individual category totals
   - Useful for detailed reporting

8. **Calculate total current liabilities**
   - Sum all category subtotals
   - Store as 'total_current_liabilities'
   - Return comprehensive dictionary

9. **Store results in data structure**
   - Update self.data['liabilities']['current']
   - Store each category amount
   - Store total current liabilities

10. **Add method docstring**
    - Explain current liabilities calculation
    - Document Sri Lankan statutory liabilities
    - Note date parameter usage

### Current Liabilities Code Structure

```
CURRENT LIABILITIES (2100-2199)
═══════════════════════════════════════

Trade Payables (2100-2129)
  2110 - Trade Creditors
  2120 - Supplier Payables
  2125 - Accounts Payable - Other

Statutory Liabilities (2130-2149)
  2130 - EPF Payable (Employees' Provident Fund)
  2135 - ETF Payable (Employees' Trust Fund)
  2140 - PAYE Payable (Pay As You Earn Tax)
  2145 - VAT Payable (Value Added Tax)
  2148 - WHT Payable (Withholding Tax)

Accrued Expenses (2150-2159)
  2150 - Accrued Salaries & Wages
  2152 - Accrued Interest
  2155 - Accrued Utilities
  2158 - Accrued Rent

Unearned Revenue (2160-2169)
  2160 - Unearned Revenue
  2165 - Customer Deposits
  2168 - Advance Payments

Short-term Debt (2170-2189)
  2170 - Short-term Loan
  2175 - Line of Credit
  2180 - Bank Overdraft
  2185 - Current Portion of Long-term Debt

Other Current Liabilities (2190-2199)
  2190 - Other Payables
  2195 - Dividends Payable
```

### Current Liabilities Calculation

```
CURRENT LIABILITIES
═══════════════════════════════════════

Trade Payables:
  2110 - Trade Creditors           Rs.   850,000.00
  2120 - Supplier Payables         Rs.   425,000.00
  ────────────────────────────────────────────────
  Subtotal Trade Payables          Rs. 1,275,000.00

Statutory Liabilities:
  2130 - EPF Payable (12%)         Rs.   180,000.00
  2135 - ETF Payable (3%)          Rs.    45,000.00
  2140 - PAYE Payable              Rs.   125,000.00
  2145 - VAT Payable (15%)         Rs.   320,000.00
  ────────────────────────────────────────────────
  Subtotal Statutory               Rs.   670,000.00

Accrued Expenses:
  2150 - Accrued Salaries          Rs.   285,000.00
  2155 - Accrued Utilities         Rs.    35,000.00
  2158 - Accrued Rent              Rs.   100,000.00
  ────────────────────────────────────────────────
  Subtotal Accrued                 Rs.   420,000.00

Unearned Revenue:
  2160 - Customer Deposits         Rs.    95,000.00
  ────────────────────────────────────────────────
  Subtotal Unearned                Rs.    95,000.00

Short-term Debt:
  2170 - Short-term Loan           Rs.   500,000.00
  2180 - Bank Overdraft            Rs.   150,000.00
  ────────────────────────────────────────────────
  Subtotal Short-term Debt         Rs.   650,000.00

═════════════════════════════════════════════════
TOTAL CURRENT LIABILITIES          Rs. 3,110,000.00
═════════════════════════════════════════════════
```

### Sri Lankan Statutory Liabilities Detail

#### EPF Payable (2130) - Employees' Provident Fund
```
Monthly Calculation:
────────────────────────────────────────
Employee gross salary:           Rs. 1,500,000 (total payroll)
Employer contribution (12%):     Rs.   180,000
Employee contribution (8%):      Rs.   120,000
────────────────────────────────────────
Total EPF payable:               Rs.   300,000

Accounting:
- Employer's 12% = Expense (recorded in P&L)
- Employee's 8% = Liability (deducted from salary)
- Combined remitted to EPF Department

Balance Sheet shows:
  2130 - EPF Payable             Rs.   300,000.00
  (Employer's Rs. 180,000 + Employee's Rs. 120,000)

Due Date: 15th of following month
Penalty: Interest on late payment
```

#### ETF Payable (2135) - Employees' Trust Fund
```
Monthly Calculation:
────────────────────────────────────────
Employee gross salary:           Rs. 1,500,000
Employer contribution (3%):      Rs.    45,000
Employee contribution:           Rs.         - (No employee contribution)
────────────────────────────────────────
Total ETF payable:               Rs.    45,000

Accounting:
- Employer pays 3% only
- No deduction from employee salary
- 100% employer expense

Balance Sheet shows:
  2135 - ETF Payable             Rs.    45,000.00

Due Date: 15th of following month
Administered by: ETF Board
```

#### PAYE Payable (2140) - Pay As You Earn Tax
```
Monthly Calculation:
────────────────────────────────────────
Employee income tax withholding based on tax slabs:

Tax-Free Allowance: Rs. 250,000/month (Rs. 3M/year)
6% on next Rs. 500,000
12% on next Rs. 500,000
18% on next Rs. 500,000
24% on next Rs. 500,000
36% on balance

Example for 5 employees totaling:    Rs.   125,000
────────────────────────────────────────────────
Total PAYE payable:                   Rs.   125,000

Accounting:
- Deducted from employee salaries
- Not an employer expense
- Pure liability until remitted

Balance Sheet shows:
  2140 - PAYE Payable            Rs.   125,000.00

Due Date: 15th of following month
Remit to: Inland Revenue Department
```

#### VAT Payable (2145) - Value Added Tax
```
Monthly Calculation:
────────────────────────────────────────
Output VAT (Sales):
  Sales Rs. 10,000,000 × 15%     Rs. 1,500,000

Input VAT (Purchases):
  Purchases Rs. 7,200,000 × 15%  Rs. 1,080,000

Net VAT Payable:                 Rs.   420,000
Less: Previous overpayment:      Rs.  (100,000)
────────────────────────────────────────────────
Current VAT Payable:             Rs.   320,000

Accounting:
- Output VAT: Collected from customers
- Input VAT: Paid to suppliers
- Net difference remitted to IRD

Balance Sheet shows:
  2145 - VAT Payable             Rs.   320,000.00

Due Date: 20th of following month
Submission: VAT return (Form 200)
```

### Statutory Liability Payment Schedule

| Liability | Rate/Type | Due Date | Form | Authority |
|-----------|-----------|----------|------|-----------|
| EPF | 12% employer + 8% employee | 15th next month | C1, C2 | EPF Department |
| ETF | 3% employer only | 15th next month | Form 6A | ETF Board |
| PAYE | Progressive rates | 15th next month | Form EA | Inland Revenue |
| VAT | 15% standard | 20th next month | Form 200 | Inland Revenue |

### Trade Payables Details

```
Trade Creditors Management:
────────────────────────────────────────

Supplier A - Inventory supplies
  Invoice Date: 15/12/2026
  Amount: Rs. 250,000
  Terms: Net 30
  Due: 14/01/2027

Supplier B - Equipment vendor
  Invoice Date: 20/12/2026
  Amount: Rs. 175,000
  Terms: Net 60
  Due: 18/02/2027

Supplier C - Utilities
  Invoice Date: 01/01/2027
  Amount: Rs. 35,000
  Terms: Net 15
  Due: 16/01/2027

Total Trade Creditors: Rs. 850,000
```

### Accrued Expenses

```
Period-End Accruals:
────────────────────────────────────────

Accrued Salaries (December 26-31):
  6 days × Rs. 50,000/day           Rs.   285,000

Accrued Electricity (December):
  Not yet billed, estimated         Rs.    35,000

Accrued Rent (January advance):
  Paid in arrears                   Rs.   100,000

Accrued Interest on Loan:
  December interest not yet due     Rs.    28,000
────────────────────────────────────────────────
Total Accrued Expenses              Rs.   448,000

Purpose: Match expenses to period incurred
```

### Unearned Revenue

```
Customer Deposits/Advance Payments:
────────────────────────────────────────

Customer A - Special order deposit
  Received: 15/12/2026
  Amount: Rs. 50,000
  Delivery: 10/01/2027

Customer B - Maintenance contract
  Received: 01/12/2026 (1 year)
  Amount: Rs. 120,000
  Earned monthly: Rs. 10,000
  Unearned: Rs. 110,000 (11 months)

Wedding order deposits:
  Various customers               Rs.    45,000
────────────────────────────────────────────────
Total Unearned Revenue            Rs.   205,000

Liability until goods/services delivered
```

### Short-term Debt

```
Short-term Borrowings:
────────────────────────────────────────

Short-term Bank Loan:
  Original: Rs. 1,000,000
  Remaining: Rs. 500,000
  Maturity: 6 months
  Rate: 12% per annum

Bank Overdraft - Commercial Bank:
  Limit: Rs. 500,000
  Used: Rs. 150,000
  Available: Rs. 350,000

Current Portion of Long-term Debt:
  Next 12 months of loan repayments
  Amount: Rs. 600,000
────────────────────────────────────────────────
Total Short-term Debt             Rs. 1,250,000
```

### Current Liability Ratios

```
Working Capital = Current Assets - Current Liabilities

Example:
Current Assets:      Rs.  8,260,000
Current Liabilities: Rs.  3,110,000
────────────────────────────────────
Working Capital:     Rs.  5,150,000

Current Ratio = Current Assets / Current Liabilities
= 8,260,000 / 3,110,000
= 2.66:1

Interpretation:
- Ratio > 2.0 is generally healthy
- Company can cover short-term obligations
- Good liquidity position
```

### Return Value Structure

```python
{
    'trade_payables': {
        'name': 'Accounts Payable',
        'amount': Decimal('1275000.00'),
        'accounts': [list of account details]
    },
    'statutory_liabilities': {
        'name': 'Statutory Liabilities',
        'amount': Decimal('670000.00'),
        'epf': Decimal('180000.00'),
        'etf': Decimal('45000.00'),
        'paye': Decimal('125000.00'),
        'vat': Decimal('320000.00')
    },
    'accrued_expenses': {
        'name': 'Accrued Expenses',
        'amount': Decimal('420000.00'),
        'accounts': [list of account details]
    },
    'unearned_revenue': {
        'name': 'Unearned Revenue',
        'amount': Decimal('95000.00'),
        'accounts': [list of account details]
    },
    'short_term_debt': {
        'name': 'Short-term Debt',
        'amount': Decimal('650000.00'),
        'accounts': [list of account details]
    },
    'total': Decimal('3110000.00')
}
```

### Expected Outcome
- Current liabilities categorized properly
- Sri Lankan statutory liabilities calculated
- Accurate balance calculations
- Subtotals for each category
- Total current liabilities calculated
- Compliance with Sri Lankan regulations

### Verification Checklist
- [ ] _calculate_current_liabilities method defined
- [ ] Liability accounts filtered (2100-2199)
- [ ] Trade payables calculated
- [ ] EPF payable calculated
- [ ] ETF payable calculated
- [ ] PAYE payable calculated
- [ ] VAT payable calculated
- [ ] Accrued expenses calculated
- [ ] Unearned revenue calculated
- [ ] Short-term debt calculated
- [ ] Total current liabilities summed
- [ ] Results stored in data structure
- [ ] Method docstring added

---

## Task 57: Add Calculate Long-Term Liabilities

### Overview
Add method to calculate total long-term (non-current) liabilities by summing balances of accounts in the 2200-2999 code range. These are obligations due beyond 12 months, typically bank loans, mortgages, and equipment financing.

### Dependencies
- Task 51: Add Get Liability Accounts

### Instructions

1. **Open balance_sheet.py file**
   - Continue in `apps/accounting/reports/balance_sheet.py`
   - Locate BalanceSheetGenerator class

2. **Add _calculate_long_term_liabilities method**
   - Define as private instance method
   - Returns dictionary with long-term liability details
   - Uses as_of_date for balance calculation

3. **Get all liability accounts**
   - Call self._get_liability_accounts()
   - Filter for long-term liability range (2200-2999)
   - Exclude current portion of long-term debt

4. **Define long-term liability categories**
   - Bank Loans (2200-2229)
   - Mortgages (2230-2239)
   - Vehicle/Equipment Loans (2240-2259)
   - Bonds Payable (2260-2269)
   - Other Long-term Liabilities (2270-2999)

5. **Calculate balance for each category**
   - Sum account balances using get_balance(as_of_date)
   - Use Decimal type for precision
   - Exclude current portion (reclassified to current liabilities)

6. **Handle current portion separation**
   - Long-term debt due within 12 months
   - Should be in current liabilities (2185)
   - Only truly long-term portion here

7. **Calculate subtotals**
   - Sum each loan/mortgage category
   - Store individual category totals
   - Useful for detailed reporting

8. **Calculate total long-term liabilities**
   - Sum all category subtotals
   - Store as 'total_long_term_liabilities'
   - Return comprehensive dictionary

9. **Store results in data structure**
   - Update self.data['liabilities']['non_current']
   - Store each category amount
   - Store total long-term liabilities

10. **Add method docstring**
    - Explain long-term liabilities calculation
    - Document categories and timeframe
    - Note current portion exclusion

### Long-Term Liabilities Code Structure

```
NON-CURRENT LIABILITIES (2200-2999)
═══════════════════════════════════════

Bank Loans (2200-2229)
  2210 - Bank Loan - Commercial Bank
  2215 - Bank Loan - Bank of Ceylon
  2220 - Bank Loan - HNB
  2225 - Bank Loan - Sampath Bank

Mortgages (2230-2239)
  2230 - Mortgage Payable - Shop Property
  2235 - Mortgage Payable - Warehouse

Vehicle & Equipment Loans (2240-2259)
  2240 - Vehicle Loan - Delivery Van
  2245 - Vehicle Loan - Company Car
  2250 - Equipment Financing - POS Systems
  2255 - Equipment Financing - Machinery

Bonds & Debentures (2260-2269)
  2260 - Bonds Payable
  2265 - Debentures

Other Long-term (2270-2999)
  2270 - Deferred Tax Liability
  2275 - Lease Liability (Finance Lease)
  2280 - Long-term Payables
```

### Long-Term Liabilities Calculation

```
NON-CURRENT LIABILITIES
═══════════════════════════════════════

Bank Loans:
  2210 - Commercial Bank Loan      Rs. 2,500,000.00
    Original: Rs. 5,000,000 (2023)
    Term: 5 years
    Rate: 14% p.a.
    Remaining: 3 years
    
  2215 - Bank of Ceylon Loan       Rs. 1,800,000.00
    Shop expansion loan
    Term: 4 years remaining
    Rate: 13.5% p.a.
  ────────────────────────────────────────────────
  Subtotal Bank Loans              Rs. 4,300,000.00

Mortgages:
  2230 - Shop Property Mortgage    Rs. 4,200,000.00
    Original: Rs. 7,000,000 (2020)
    Property: Colombo 03
    Term: 10 years remaining
    Rate: 12% p.a.
  ────────────────────────────────────────────────
  Subtotal Mortgages               Rs. 4,200,000.00

Vehicle & Equipment Loans:
  2240 - Delivery Van Loan         Rs. 1,250,000.00
    Original: Rs. 2,000,000
    Term: 4 years remaining
    Rate: 15% p.a.
    
  2250 - Equipment Financing       Rs.   420,000.00
    POS system lease
    Term: 2 years remaining
  ────────────────────────────────────────────────
  Subtotal Vehicle/Equipment       Rs. 1,670,000.00

═════════════════════════════════════════════════
TOTAL NON-CURRENT LIABILITIES      Rs. 10,170,000.00
═════════════════════════════════════════════════

Note: Excludes current portion (next 12 months)
Current portion shown in Current Liabilities
```

### Current Portion vs Long-Term Portion

```
Total Loan Balance: Rs. 3,000,000
────────────────────────────────────────

Payment Schedule (next 12 months):
  Principal payments              Rs.   500,000
  (This is the current portion)

Remaining Balance (after 12 months):
  Long-term portion               Rs. 2,500,000

Balance Sheet Presentation:
────────────────────────────────────────
CURRENT LIABILITIES:
  Current Portion of LT Debt      Rs.   500,000

NON-CURRENT LIABILITIES:
  Long-term Loan                  Rs. 2,500,000
────────────────────────────────────────
Total Loan Obligation             Rs. 3,000,000
```

### Sri Lankan Bank Loan Examples

#### Commercial Bank Business Loan
```
Loan Details:
────────────────────────────────────────
Purpose: Working capital & expansion
Amount: Rs. 5,000,000
Date: January 1, 2023
Term: 5 years (60 months)
Interest Rate: 14% per annum
Monthly Payment: Rs. 116,393

As of December 31, 2026 (4 years elapsed):
  Original Loan:                 Rs. 5,000,000.00
  Principal Paid (4 years):      Rs. 2,500,000.00
  Remaining Balance:             Rs. 2,500,000.00
  
Classification (as of 31/12/2026):
  Current Portion (2027):        Rs.   700,000.00 (→ Current Liabilities)
  Long-term (2028-2029):         Rs. 1,800,000.00 (→ Non-Current)
```

#### Mortgage on Shop Property
```
Mortgage Details:
────────────────────────────────────────
Property: Shop at 123 Galle Road, Colombo 03
Amount: Rs. 7,000,000
Date: January 1, 2020
Term: 15 years (180 months)
Interest Rate: 12% per annum
Monthly Payment: Rs. 84,027

As of December 31, 2026 (7 years elapsed):
  Original Mortgage:             Rs. 7,000,000.00
  Principal Paid (7 years):      Rs. 2,800,000.00
  Remaining Balance:             Rs. 4,200,000.00
  
Classification (as of 31/12/2026):
  Current Portion (2027):        Rs.   400,000.00
  Long-term (2028-2034):         Rs. 3,800,000.00

Security: First mortgage on property
Collateral Value: Rs. 15,000,000 (2026 valuation)
```

#### Vehicle Loan - Delivery Van
```
Vehicle Loan Details:
────────────────────────────────────────
Vehicle: Toyota Hiace Delivery Van
Amount: Rs. 2,000,000
Date: January 1, 2024
Term: 5 years (60 months)
Interest Rate: 15% per annum
Monthly Payment: Rs. 47,564

As of December 31, 2026 (3 years elapsed):
  Original Loan:                 Rs. 2,000,000.00
  Principal Paid (3 years):      Rs.   750,000.00
  Remaining Balance:             Rs. 1,250,000.00
  
Classification (as of 31/12/2026):
  Current Portion (2027):        Rs.   300,000.00
  Long-term (2028-2029):         Rs.   950,000.00

Security: Vehicle registration in bank's name until paid
```

### Sri Lankan Interest Rates (2026)

| Loan Type | Typical Rate | Term | Purpose |
|-----------|-------------|------|---------|
| Business Term Loan | 12-16% | 3-7 years | Working capital, expansion |
| Property Mortgage | 11-14% | 10-20 years | Commercial property purchase |
| Vehicle Loan | 14-18% | 3-5 years | Company vehicle purchase |
| Equipment Financing | 13-17% | 2-5 years | Machinery, equipment |
| Overdraft Facility | 15-20% | Revolving | Short-term cash flow |

### Long-Term Debt Covenants

```
Common Loan Covenants (Sri Lankan Banks):
────────────────────────────────────────

Financial Covenants:
1. Debt-to-Equity Ratio < 3:1
2. Current Ratio > 1.5:1
3. Debt Service Coverage > 1.25x
4. Minimum Working Capital: Rs. 2M

Operational Covenants:
1. Maintain business registration
2. Keep insurance current
3. Submit annual audited financials
4. No additional loans without approval

Non-compliance = Potential default
```

### Loan Amortization Schedule

```
Bank Loan Rs. 5,000,000 @ 14% for 5 years
Monthly Payment: Rs. 116,393

Year | Opening Balance | Principal | Interest | Closing Balance
-----|----------------|-----------|----------|----------------
2023 | 5,000,000      | 700,000   | 700,000  | 4,300,000
2024 | 4,300,000      | 800,000   | 602,000  | 3,500,000
2025 | 3,500,000      | 910,000   | 490,000  | 2,590,000
2026 | 2,590,000      | 1,030,000 | 362,000  | 1,560,000 ← Long-term
2027 | 1,560,000      | 560,000   | 218,000  | 1,000,000 ← Current

As of Dec 31, 2026:
  Total Balance: Rs. 1,560,000
  Current (2027): Rs. 560,000 → Current Liabilities
  Long-term (2028): Rs. 1,000,000 → Non-Current Liabilities
```

### Debt-to-Equity Ratio

```
Financial Leverage Analysis:
────────────────────────────────────────

Total Long-term Liabilities:   Rs. 10,170,000
Total Equity:                  Rs. 28,012,500

Debt-to-Equity Ratio = 10,170,000 / 28,012,500
                     = 0.36:1

Interpretation:
- Low leverage (< 1.0 is conservative)
- Rs. 0.36 of debt for every Rs. 1 of equity
- Less financial risk
- More capacity to borrow if needed

Industry Benchmarks:
- Retail: 0.5 - 1.5
- Manufacturing: 1.0 - 2.5
- Service: 0.3 - 1.0
```

### Sri Lankan Loan Security Requirements

#### Typical Collateral
1. **Property Mortgages**
   - Land & building title deeds
   - First mortgage registration
   - Valuation by bank-approved valuer

2. **Vehicle Loans**
   - Vehicle registration book
   - Comprehensive insurance
   - Registered in bank's name

3. **Business Loans**
   - Director personal guarantees
   - Equipment hypothecation
   - Stock & receivables pledge
   - Fixed deposit liens

4. **Additional Security**
   - Life insurance on key person
   - Business continuity insurance
   - Key man insurance

### Long-Term Liability Maturity Schedule

```
Debt Maturity Analysis (as of 31/12/2026):
────────────────────────────────────────

Due in 2027 (Current):           Rs.  1,600,000
Due in 2028:                     Rs.  1,800,000
Due in 2029:                     Rs.  1,750,000
Due in 2030:                     Rs.  1,650,000
Due in 2031-2036:                Rs.  4,970,000
───────────────────────────────────────────────
Total Long-term Obligations:     Rs. 10,170,000

Note: 2027 amount reclassified to current liabilities
```

### Return Value Structure

```python
{
    'bank_loans': {
        'name': 'Bank Loans',
        'amount': Decimal('4300000.00'),
        'accounts': [
            {
                'code': '2210',
                'name': 'Commercial Bank Loan',
                'balance': Decimal('2500000.00'),
                'original_amount': Decimal('5000000.00'),
                'interest_rate': Decimal('14.00'),
                'maturity_date': '2028-01-01'
            },
            # ... more loans
        ]
    },
    'mortgages': {
        'name': 'Mortgages',
        'amount': Decimal('4200000.00'),
        'accounts': [list of mortgage details]
    },
    'vehicle_equipment_loans': {
        'name': 'Vehicle & Equipment Loans',
        'amount': Decimal('1670000.00'),
        'accounts': [list of loan details]
    },
    'total': Decimal('10170000.00')
}
```

### Expected Outcome
- Long-term liabilities categorized properly
- Current portion excluded
- Accurate balance calculations
- Loan details maintained
- Total non-current liabilities calculated
- Sri Lankan lending practices considered

### Verification Checklist
- [ ] _calculate_long_term_liabilities method defined
- [ ] Liability accounts filtered (2200-2999)
- [ ] Bank loans calculated
- [ ] Mortgages calculated
- [ ] Vehicle/equipment loans calculated
- [ ] Current portion excluded
- [ ] Total long-term liabilities summed
- [ ] Results stored in data structure
- [ ] Method docstring added

---

## Task 58: Add Calculate Total Liabilities

### Overview
Add method to calculate total liabilities by summing current liabilities and non-current (long-term) liabilities. This represents the total obligations of the business at the reporting date.

### Dependencies
- Task 56: Add Calculate Current Liabilities
- Task 57: Add Calculate Long-Term Liabilities

### Instructions

1. **Open balance_sheet.py file**
   - Continue in `apps/accounting/reports/balance_sheet.py`
   - Locate BalanceSheetGenerator class

2. **Add _calculate_total_liabilities method**
   - Define as private instance method
   - Returns Decimal with total liabilities
   - Depends on current and long-term liability calculations

3. **Call current liabilities calculation**
   - Invoke self._calculate_current_liabilities()
   - Get total from returned dictionary
   - Store as current_liabilities_total

4. **Call long-term liabilities calculation**
   - Invoke self._calculate_long_term_liabilities()
   - Get total from returned dictionary
   - Store as non_current_liabilities_total

5. **Sum total liabilities**
   - Add current_liabilities_total + non_current_liabilities_total
   - Use Decimal arithmetic
   - Store result as total_liabilities

6. **Store in data structure**
   - Update self.data['liabilities']['total']
   - Include both subtotals and grand total
   - Maintain hierarchy for reporting

7. **Return total liabilities**
   - Return Decimal value
   - Used in accounting equation validation
   - Critical for Assets = Liabilities + Equity

8. **Add method docstring**
   - Explain total liabilities calculation
   - Note components included
   - Mention accounting equation usage

### Total Liabilities Calculation

```
LIABILITIES
═══════════════════════════════════════

CURRENT LIABILITIES
  Accounts Payable                Rs.  1,275,000.00
  Statutory Liabilities:
    EPF Payable                   Rs.    180,000.00
    ETF Payable                   Rs.     45,000.00
    PAYE Payable                  Rs.    125,000.00
    VAT Payable                   Rs.    320,000.00
  Accrued Expenses                Rs.    420,000.00
  Unearned Revenue                Rs.     95,000.00
  Short-term Debt                 Rs.    650,000.00
  ────────────────────────────────────────────────
  TOTAL CURRENT LIABILITIES       Rs.  3,110,000.00

NON-CURRENT LIABILITIES
  Bank Loans                      Rs.  4,300,000.00
  Mortgages                       Rs.  4,200,000.00
  Vehicle & Equipment Loans       Rs.  1,670,000.00
  ────────────────────────────────────────────────
  TOTAL NON-CURRENT LIABILITIES   Rs. 10,170,000.00

═════════════════════════════════════════════════
TOTAL LIABILITIES                 Rs. 13,280,000.00
═════════════════════════════════════════════════
```

### Liability Classification

```
Total Liabilities = Current Liabilities + Non-Current Liabilities

Current Liabilities:
✓ Due within 12 months
✓ Operating obligations
✓ Statutory payments
✓ Short-term debt

Non-Current Liabilities:
✓ Due beyond 12 months
✓ Long-term financing
✓ Mortgages and loans
```

### Liabilities in Accounting Equation

```
FUNDAMENTAL ACCOUNTING EQUATION
═══════════════════════════════════════

ASSETS = LIABILITIES + EQUITY

Assets:                          Rs. 41,292,500.00
Liabilities:                     Rs. 13,280,000.00
Equity (calculated):             Rs. 28,012,500.00
────────────────────────────────────────────────
Verify: 13,280,000 + 28,012,500 = 41,292,500 ✓
```

### Sri Lankan Total Liabilities Examples

#### Small Retail Business
```
LIABILITIES
Current Liabilities:
  Accounts Payable                Rs.    650,000.00
  EPF Payable                     Rs.     48,000.00
  ETF Payable                     Rs.     12,000.00
  VAT Payable                     Rs.    125,000.00
  Accrued Expenses                Rs.     85,000.00
  Short-term Loan                 Rs.    300,000.00
  ────────────────────────────────────────────────
  Total Current Liabilities       Rs.  1,220,000.00

Non-Current Liabilities:
  Bank Loan                       Rs.  1,500,000.00
  Shop Mortgage                   Rs.  2,200,000.00
  ────────────────────────────────────────────────
  Total Non-Current Liabilities   Rs.  3,700,000.00

═════════════════════════════════════════════════
TOTAL LIABILITIES                 Rs.  4,920,000.00
═════════════════════════════════════════════════
```

#### Service Business
```
LIABILITIES
Current Liabilities:
  Accounts Payable                Rs.    180,000.00
  EPF/ETF/PAYE Payable            Rs.     95,000.00
  Accrued Expenses                Rs.     65,000.00
  ────────────────────────────────────────────────
  Total Current Liabilities       Rs.    340,000.00

Non-Current Liabilities:
  Vehicle Loan                    Rs.    950,000.00
  Equipment Financing             Rs.    225,000.00
  ────────────────────────────────────────────────
  Total Non-Current Liabilities   Rs.  1,175,000.00

═════════════════════════════════════════════════
TOTAL LIABILITIES                 Rs.  1,515,000.00
═════════════════════════════════════════════════
```

### Liability Composition Analysis

```
Total Liabilities Breakdown:
────────────────────────────────────────

Total: Rs. 13,280,000

Current:    Rs.  3,110,000 (23.4%)
Non-Current: Rs. 10,170,000 (76.6%)

Interpretation:
- High proportion of long-term debt
- Manageable current obligations
- Strong liquidity position
- Typical for capital-intensive business

Industry Comparison:
Retail (typical):
  Current: 60-70%
  Non-Current: 30-40%

Manufacturing (typical):
  Current: 30-40%
  Non-Current: 60-70%
```

### Debt Ratios

#### Total Debt Ratio
```
Total Debt Ratio = Total Liabilities / Total Assets

= 13,280,000 / 41,292,500
= 0.32 or 32%

Interpretation:
- 32% of assets financed by debt
- 68% financed by equity
- Low to moderate leverage
- Conservative capital structure
```

#### Debt-to-Equity Ratio
```
Debt-to-Equity = Total Liabilities / Total Equity

= 13,280,000 / 28,012,500
= 0.47:1

Interpretation:
- Rs. 0.47 of debt per Rs. 1 of equity
- Low leverage
- More equity than debt financing
- Lower financial risk

Industry Benchmarks:
- Retail: 0.5 - 1.5
- Service: 0.3 - 1.0
- Manufacturing: 1.0 - 2.5
```

#### Current Ratio
```
Current Ratio = Current Assets / Current Liabilities

= 8,260,000 / 3,110,000
= 2.66:1

Interpretation:
- Rs. 2.66 of current assets per Rs. 1 of current liabilities
- Strong liquidity
- Can easily meet short-term obligations
- Healthy working capital

Acceptable Ranges:
- < 1.0: Liquidity concerns
- 1.0 - 1.5: Adequate
- 1.5 - 3.0: Good
- > 3.0: May be inefficient (excess cash)
```

### Liability Trends

```
Year-over-Year Comparison:
────────────────────────────────────────

                   2025              2026         Change
Current:           Rs.  2,850,000    Rs.  3,110,000   +9%
Non-Current:       Rs. 11,200,000    Rs. 10,170,000   -9%
─────────────────────────────────────────────────────────
Total Liabilities: Rs. 14,050,000    Rs. 13,280,000   -5%

Analysis:
- Overall debt decreased (paying down loans)
- Current liabilities increased (growth, more inventory)
- Non-current debt reduced (loan payments)
- Healthier liability structure
```

### Sri Lankan Compliance Considerations

#### Statutory Liabilities Priority
```
Payment Priority (Critical):
1. EPF/ETF (15th of month) - Penalties for late payment
2. PAYE (15th of month) - Interest on delays
3. VAT (20th of month) - Penalties accumulate
4. Trade creditors (per terms) - Maintain relationships

Failure to pay statutory:
- Interest charges
- Penalties
- Possible legal action
- Business reputation damage
```

#### Loan Covenant Monitoring
```
Quarterly Covenant Checks:

1. Debt-to-Equity < 3:1
   Current: 0.47 ✓ Compliant

2. Current Ratio > 1.5:1
   Current: 2.66 ✓ Compliant

3. Debt Service Coverage > 1.25x
   Calculate: Net Income + Interest + Depreciation
              ÷ (Principal + Interest Payments)
   Must exceed 1.25 ✓

4. Submit financials within 90 days of year-end ✓
```

### Method Flow

```
_calculate_total_liabilities()
    │
    ├──→ Call _calculate_current_liabilities()
    │       └──→ Returns: Rs. 3,110,000.00
    │
    ├──→ Call _calculate_long_term_liabilities()
    │       └──→ Returns: Rs. 10,170,000.00
    │
    ├──→ Sum totals:
    │       3,110,000.00 + 10,170,000.00
    │       = 13,280,000.00
    │
    └──→ Store and return: Rs. 13,280,000.00
```

### Data Structure Update

```python
self.data['liabilities'] = {
    'current': {
        'total': Decimal('3110000.00'),
        # ... category details
    },
    'non_current': {
        'total': Decimal('10170000.00'),
        # ... category details
    },
    'total': Decimal('13280000.00')  # ← Set by this method
}
```

### Usage in Balance Validation

```
Later used in Task 61 (Balance Validation):

total_assets = self._calculate_total_assets()          # 41,292,500
total_liabilities = self._calculate_total_liabilities() # 13,280,000
total_equity = self._calculate_total_equity()          # 28,012,500

if total_assets != (total_liabilities + total_equity):
    # 41,292,500 = 13,280,000 + 28,012,500 ✓
    raise BalanceSheetValidationError("Balance Sheet does not balance")
```

### Expected Outcome
- Total liabilities accurately calculated
- Sum of current and non-current liabilities
- Stored in data structure
- Available for accounting equation validation
- Proper Decimal precision maintained

### Verification Checklist
- [ ] _calculate_total_liabilities method defined
- [ ] Calls _calculate_current_liabilities
- [ ] Calls _calculate_long_term_liabilities
- [ ] Sums current and non-current totals
- [ ] Uses Decimal arithmetic
- [ ] Stores result in self.data['liabilities']['total']
- [ ] Returns total liabilities value
- [ ] Method docstring added

---

## Summary

This document established the Balance Sheet generator foundation and core asset/liability calculations:

### Completed Infrastructure
- ✅ BalanceSheetGenerator class extending BaseReportGenerator
- ✅ Asset accounts retrieval method (1xxx)
- ✅ Liability accounts retrieval method (2xxx)
- ✅ Equity accounts retrieval method (3xxx)
- ✅ Current assets calculation with categorization
- ✅ Fixed assets calculation net of depreciation
- ✅ Total assets calculation
- ✅ Current liabilities calculation including Sri Lankan statutory obligations
- ✅ Long-term liabilities calculation
- ✅ Total liabilities calculation

### Key Achievements
1. **Point-in-Time Reporting** - Balance Sheet as of specific date
2. **Asset Classification** - Current vs non-current separation
3. **Depreciation Handling** - Net fixed assets calculation
4. **Sri Lankan Compliance** - EPF, ETF, PAYE, VAT payables
5. **Debt Management** - Current portion separation
6. **Foundation for Equation** - Assets and Liabilities ready for validation

### Next Steps
Proceed to [02_Tasks-59-64_BS-Validation-Output.md](02_Tasks-59-64_BS-Validation-Output.md) to implement retained earnings calculation, total equity calculation, balance validation (Assets = Liabilities + Equity), output data structure, HTML template, and API endpoint.

---

**Document Status:** ✅ Complete  
**Total Tasks:** 10  
**Total Lines:** ~990
