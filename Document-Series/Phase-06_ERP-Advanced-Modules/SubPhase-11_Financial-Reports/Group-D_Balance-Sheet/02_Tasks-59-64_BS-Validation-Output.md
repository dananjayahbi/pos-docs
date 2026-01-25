# Tasks 59-64: Retained Earnings, Balance Validation, and Output

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 11 - Financial Reports  
> **Group:** D - Balance Sheet  
> **Document:** 02 of 02  
> **Tasks Covered:** 59, 60, 61, 62, 63, 64

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-49-58_BalanceSheet-Calculations.md](01_Tasks-49-58_BalanceSheet-Calculations.md)
- **→ Next Group:** [Group-E_Cash-Flow-General-Ledger](../Group-E_Cash-Flow-General-Ledger/)

---

## Document Overview

This document covers the final components of the Balance Sheet report, including retained earnings calculation with current period net income, equity totals, fundamental accounting equation validation, structured data output, professional HTML template rendering, and API endpoint implementation. These elements complete the Statement of Financial Position functionality.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 59 | Add Calculate Retained Earnings | High | 45 min |
| 60 | Add Calculate Total Equity | Low | 15 min |
| 61 | Add Balance Validation | Medium | 30 min |
| 62 | Create BS Data Structure | Medium | 35 min |
| 63 | Create BS HTML Template | Medium | 40 min |
| 64 | Create BS API Endpoint | Low | 20 min |

---

## Task 59: Add Calculate Retained Earnings

### Overview
Implement the retained earnings calculation method that computes the cumulative retained earnings as of the report date. This includes opening retained earnings from prior periods plus the current period net income from the Profit & Loss statement. Critical for accurate equity presentation in Sri Lankan businesses, where retained earnings represent accumulated profits not withdrawn by owners.

### Dependencies
- Task 52: Add Get Equity Accounts
- Task 48: Create ProfitLossGenerator (for current net income)
- Equity accounts configured in chart of accounts (3xxx range)
- Prior period closing entries properly posted

### Instructions

1. **Add retained earnings method to BalanceSheetGenerator**
   - Navigate to `apps/accounting/reports/balance_sheet.py`
   - Create method named `calculate_retained_earnings`
   - Accept tenant, as_of_date parameters
   - Return decimal value for retained earnings

2. **Retrieve opening retained earnings balance**
   - Query retained earnings account (typically 3400 or similar)
   - Get cumulative balance up to start of current fiscal period
   - This represents all prior period profits/losses
   - Use account code filtering for retained earnings accounts

3. **Calculate current period net income**
   - Instantiate ProfitLossGenerator
   - Calculate net income for current fiscal period up to as_of_date
   - Include period from fiscal year start to as_of_date
   - Retrieve net profit value from P&L generator

4. **Handle period boundaries correctly**
   - Determine current fiscal year start date
   - If as_of_date is mid-year, include partial year net income
   - If as_of_date is year-end, include full year net income
   - Handle year-end closing entries appropriately

5. **Compute total retained earnings**
   - Add opening retained earnings to current net income
   - Formula: Opening RE + Current Period Net Income = Total RE
   - Handle negative values (accumulated losses)
   - Return final retained earnings amount

6. **Handle closing entries and adjustments**
   - Check if year-end closing has been posted
   - If posted, current net income already in RE account
   - If not posted, calculate and add current income
   - Prevent double-counting of closed periods

7. **Add retained earnings breakdown option**
   - Optionally return detailed breakdown
   - Show opening balance separately
   - Show current period addition separately
   - Useful for financial statement notes

8. **Implement error handling**
   - Handle missing retained earnings account
   - Handle missing fiscal period configuration
   - Handle P&L calculation errors
   - Log warnings for data issues

### Retained Earnings Calculation Flow

```
┌─────────────────────────────────────────────────────────────┐
│  RETAINED EARNINGS CALCULATION                              │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
    ┌──────────────────────────────────────────────┐
    │  Get Opening Retained Earnings               │
    │  (Cumulative balance from prior periods)     │
    │  Account: 3400 Retained Earnings             │
    └──────────────────────────────────────────────┘
                           │
                           ▼
    ┌──────────────────────────────────────────────┐
    │  Determine Current Fiscal Period             │
    │  Start Date: Fiscal year start               │
    │  End Date: as_of_date parameter              │
    └──────────────────────────────────────────────┘
                           │
                           ▼
    ┌──────────────────────────────────────────────┐
    │  Calculate Current Period Net Income         │
    │  Use ProfitLossGenerator                     │
    │  Period: FY Start → as_of_date               │
    └──────────────────────────────────────────────┘
                           │
                           ▼
    ┌──────────────────────────────────────────────┐
    │  Check for Year-End Closing                  │
    │  Has current period been closed?             │
    └──────────────────────────────────────────────┘
                           │
                ┌──────────┴──────────┐
                ▼                     ▼
         [NOT CLOSED]           [CLOSED]
                │                     │
                ▼                     ▼
    Add Current Net Income    Already in RE Account
                │                     │
                └──────────┬──────────┘
                           ▼
    ┌──────────────────────────────────────────────┐
    │  Total Retained Earnings =                   │
    │  Opening RE + Current Net Income             │
    └──────────────────────────────────────────────┘
                           │
                           ▼
                    [RETURN TOTAL]
```

### Retained Earnings Components

| Component | Description | Account Code | Calculation |
|-----------|-------------|--------------|-------------|
| Opening RE | Prior period accumulated profits | 3400 | Balance before current FY |
| Current Net Income | Current period profit/loss | From P&L | Revenue - Expenses |
| Dividends/Withdrawals | Distributions to owners | 3500 | Reduces retained earnings |
| Adjustments | Prior period corrections | 3600 | Add/subtract as needed |
| **Total RE** | **Final retained earnings** | **Calculated** | **Sum of components** |

### Fiscal Period Scenarios

#### Scenario 1: Mid-Year Balance Sheet (e.g., June 30)
```
Fiscal Year: April 1, 2025 - March 31, 2026
Report Date: June 30, 2025

Opening RE (as of March 31, 2025):    LKR 1,500,000
Current Period Net Income (Apr-Jun):  LKR   350,000
Total Retained Earnings:              LKR 1,850,000
```

#### Scenario 2: Year-End Balance Sheet (Before Closing)
```
Fiscal Year: April 1, 2025 - March 31, 2026
Report Date: March 31, 2026 (before closing entries)

Opening RE (as of March 31, 2025):    LKR 1,500,000
Current Period Net Income (Full FY):  LKR   980,000
Total Retained Earnings:              LKR 2,480,000

Note: Closing entries will transfer net income to RE account
```

#### Scenario 3: Year-End Balance Sheet (After Closing)
```
Fiscal Year: April 1, 2025 - March 31, 2026
Report Date: March 31, 2026 (after closing entries)

Retained Earnings Account Balance:    LKR 2,480,000
Current Period Net Income:            LKR         0 (already closed)
Total Retained Earnings:              LKR 2,480,000

Note: Net income already transferred to RE account
```

### Sri Lankan Business Context

#### Sole Proprietorship / Partnership
- Retained earnings may be called "Owner's Capital" or "Partner Capital"
- Include in equity section
- Shows accumulated profits not withdrawn
- Format: Owner's Equity = Capital + Retained Earnings

#### Private Limited Company
- Clearly separate share capital from retained earnings
- Share capital: Original investment (cannot reduce without formalities)
- Retained earnings: Accumulated profits available for dividends
- Format follows IRD requirements

#### Public Limited Company
- Separate ordinary share capital from retained earnings
- Show statutory reserves if required
- Dividend provisions reduce retained earnings
- Comply with Companies Act disclosure requirements

### Expected Outcome
- Accurate retained earnings calculation
- Proper inclusion of current period net income
- Correct handling of closing entries
- Clear separation of RE components
- Support for Sri Lankan business structures

### Verification Checklist
- [ ] `calculate_retained_earnings` method created
- [ ] Opening RE retrieved from account balance
- [ ] Current period net income calculated via P&L
- [ ] Fiscal period boundaries handled correctly
- [ ] Closing entries checked and handled
- [ ] Total RE calculated as Opening + Current
- [ ] Negative values (losses) handled properly
- [ ] Error handling for missing accounts
- [ ] Works for mid-year and year-end dates
- [ ] Sri Lankan business types supported

---

## Task 60: Add Calculate Total Equity

### Overview
Implement the total equity calculation method that sums all equity components including share capital (or owner's capital), retained earnings, and any other equity accounts. Provides the complete equity section total for the Balance Sheet and completes the accounting equation (Assets = Liabilities + Equity).

### Dependencies
- Task 52: Add Get Equity Accounts
- Task 59: Add Calculate Retained Earnings
- All equity accounts configured (3xxx range)

### Instructions

1. **Add total equity method to BalanceSheetGenerator**
   - Navigate to `apps/accounting/reports/balance_sheet.py`
   - Create method named `calculate_total_equity`
   - Accept tenant, as_of_date parameters
   - Return decimal value for total equity

2. **Retrieve share capital or owner's capital**
   - Query equity capital accounts (typically 3100-3199)
   - Get balances as of as_of_date
   - For companies: ordinary share capital, preference shares
   - For sole traders: owner's capital account

3. **Get retained earnings amount**
   - Call `calculate_retained_earnings` method from Task 59
   - This includes opening RE plus current net income
   - Returns cumulative retained profits
   - Already accounts for current period

4. **Get other equity accounts**
   - Query additional equity accounts (reserves, etc.)
   - Include statutory reserves if applicable
   - Include revaluation reserves for fixed assets
   - Include any share premium accounts

5. **Sum all equity components**
   - Add share/owner capital amounts
   - Add retained earnings total
   - Add other equity account balances
   - Calculate grand total equity

6. **Handle partner equity for partnerships**
   - If partnership, get each partner's capital account
   - Sum all partner capital accounts
   - Include partnership retained earnings
   - Present separately by partner if needed

7. **Handle negative equity scenarios**
   - If losses exceed capital (negative equity)
   - Display as negative total
   - Add warning or note to report
   - Flag for management attention

8. **Create equity breakdown structure**
   - Return detailed breakdown dictionary
   - Show each equity component separately
   - Include subtotals for clarity
   - Support detailed equity section rendering

### Total Equity Calculation Flow

```
┌─────────────────────────────────────────────────────────────┐
│  TOTAL EQUITY CALCULATION                                   │
└─────────────────────────────────────────────────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        ▼                  ▼                  ▼
┌──────────────┐  ┌─────────────────┐  ┌──────────────┐
│ Share/Owner  │  │ Retained        │  │ Other Equity │
│ Capital      │  │ Earnings        │  │ Accounts     │
│ (3100-3199)  │  │ (Task 59)       │  │ (3200-3999)  │
└──────────────┘  └─────────────────┘  └──────────────┘
        │                  │                  │
        └──────────────────┼──────────────────┘
                           ▼
                ┌────────────────────┐
                │  SUM ALL EQUITY    │
                │  COMPONENTS        │
                └────────────────────┘
                           │
                           ▼
                    [TOTAL EQUITY]
```

### Equity Section Components

| Component | Account Range | Description | Example (LKR) |
|-----------|---------------|-------------|---------------|
| Share Capital | 3100-3199 | Ordinary/preference shares | 5,000,000 |
| Share Premium | 3200-3299 | Excess over par value | 500,000 |
| Revaluation Reserve | 3300-3399 | Fixed asset revaluation | 250,000 |
| Retained Earnings | 3400-3499 | Accumulated profits | 1,850,000 |
| Other Reserves | 3500-3599 | Statutory/other reserves | 100,000 |
| **TOTAL EQUITY** | **3xxx** | **Sum of all equity** | **7,700,000** |

### Equity Presentation by Business Type

#### Private Limited Company
```
EQUITY
  Share Capital
    Ordinary Shares (10,000 @ LKR 500)    5,000,000
    
  Reserves
    General Reserve                         100,000
    Revaluation Reserve                     250,000
    
  Retained Earnings
    Balance at start of year              1,500,000
    Net profit for the year                 350,000
    Total Retained Earnings               1,850,000
    
  TOTAL EQUITY                            7,200,000
```

#### Sole Proprietorship
```
EQUITY
  Owner's Capital
    Capital Account - J. Silva             4,000,000
    
  Retained Earnings
    Balance at start of year              1,200,000
    Net profit for the year                 450,000
    Less: Drawings during the year        (200,000)
    Total Retained Earnings               1,450,000
    
  TOTAL OWNER'S EQUITY                    5,450,000
```

#### Partnership
```
EQUITY
  Partners' Capital
    Partner A - Capital Account           3,000,000
    Partner B - Capital Account           2,000,000
    Total Partners' Capital               5,000,000
    
  Retained Earnings
    Balance at start of year                800,000
    Net profit for the year                 420,000
    Less: Partner drawings                (150,000)
    Total Retained Earnings               1,070,000
    
  TOTAL PARTNERSHIP EQUITY                6,070,000
```

### Expected Outcome
- Complete equity section total
- All equity components included
- Proper categorization by type
- Support for different business structures
- Ready for accounting equation validation

### Verification Checklist
- [ ] `calculate_total_equity` method created
- [ ] Share/owner capital retrieved correctly
- [ ] Retained earnings included via Task 59 method
- [ ] Other equity accounts captured
- [ ] All equity components summed properly
- [ ] Partnership equity handled correctly
- [ ] Negative equity scenarios handled
- [ ] Detailed breakdown returned
- [ ] Compatible with Sri Lankan business types
- [ ] Ready for use in accounting equation check

---

## Task 61: Add Balance Validation

### Overview
Implement the fundamental accounting equation validation method that ensures Assets equal Liabilities plus Equity. This critical validation confirms the mathematical accuracy of the Balance Sheet and identifies any posting errors, unbalanced entries, or data integrity issues. Non-validation indicates serious accounting problems requiring immediate investigation.

### Dependencies
- Task 55: Add Calculate Total Assets
- Task 58: Add Calculate Total Liabilities
- Task 60: Add Calculate Total Equity
- All account balances properly posted

### Instructions

1. **Add validation method to BalanceSheetGenerator**
   - Navigate to `apps/accounting/reports/balance_sheet.py`
   - Create method named `validate_balance_sheet`
   - Accept tenant, as_of_date parameters
   - Return validation result with details

2. **Calculate total assets**
   - Call `calculate_total_assets` method from Task 55
   - This includes current and fixed assets
   - Get final total assets amount
   - Store for comparison

3. **Calculate total liabilities**
   - Call `calculate_total_liabilities` method from Task 58
   - This includes current and long-term liabilities
   - Get final total liabilities amount
   - Store for comparison

4. **Calculate total equity**
   - Call `calculate_total_equity` method from Task 60
   - This includes capital and retained earnings
   - Get final total equity amount
   - Store for comparison

5. **Compute liabilities plus equity**
   - Add total liabilities to total equity
   - This represents the right side of equation
   - Should equal total assets
   - Store calculated total

6. **Compare assets to liabilities plus equity**
   - Check if total assets equals liabilities plus equity
   - Use decimal precision (handle rounding differences)
   - Allow tolerance for minor rounding (e.g., 0.01)
   - Determine if balanced or unbalanced

7. **Calculate difference if unbalanced**
   - If not balanced, compute difference amount
   - Difference = Assets - (Liabilities + Equity)
   - Positive difference: assets overstated or L+E understated
   - Negative difference: assets understated or L+E overstated

8. **Create validation result structure**
   - Return dictionary with validation details
   - Include is_balanced boolean flag
   - Include all three totals (assets, liabilities, equity)
   - Include difference amount if unbalanced

9. **Add validation severity levels**
   - Minor difference (< 1.00): Warning level
   - Moderate difference (1.00 - 100.00): Error level
   - Major difference (> 100.00): Critical error level
   - Determine severity based on amount

10. **Log validation results**
    - Log successful validation
    - Log warnings for minor differences
    - Log errors for significant differences
    - Include tenant and date in logs

11. **Generate diagnostic messages**
    - If unbalanced, create helpful error message
    - Suggest common causes (unposted entries, incorrect classification)
    - Provide investigation steps
    - Include amount and direction of difference

12. **Handle edge cases**
    - All zero balances (new tenant)
    - Very small balances (rounding issues)
    - Large balances (formatting overflow)
    - Missing accounts (incomplete setup)

### Accounting Equation Validation Flow

```
┌─────────────────────────────────────────────────────────────┐
│  ACCOUNTING EQUATION VALIDATION                             │
│  ASSETS = LIABILITIES + EQUITY                              │
└─────────────────────────────────────────────────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        ▼                  ▼                  ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ Total Assets │  │ Total        │  │ Total Equity │
│ (Task 55)    │  │ Liabilities  │  │ (Task 60)    │
│              │  │ (Task 58)    │  │              │
└──────────────┘  └──────────────┘  └──────────────┘
        │                  │                  │
        │                  └────────┬─────────┘
        │                           ▼
        │                  ┌─────────────────┐
        │                  │ Liabilities +   │
        │                  │ Equity          │
        │                  └─────────────────┘
        │                           │
        └───────────┬───────────────┘
                    ▼
         ┌────────────────────┐
         │ Assets = L + E ?   │
         └────────────────────┘
                    │
        ┌───────────┴───────────┐
        ▼                       ▼
    [BALANCED]            [UNBALANCED]
        │                       │
        ▼                       ▼
  Return Success      Calculate Difference
  is_balanced=True    Determine Severity
                      Generate Diagnostics
                      Log Error
                      is_balanced=False
```

### Validation Result Structure

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| is_balanced | Boolean | Whether equation balances | True |
| total_assets | Decimal | Total assets amount | 15,234,567.89 |
| total_liabilities | Decimal | Total liabilities amount | 8,456,789.12 |
| total_equity | Decimal | Total equity amount | 6,777,778.77 |
| liabilities_plus_equity | Decimal | L + E calculation | 15,234,567.89 |
| difference | Decimal | Assets - (L+E) | 0.00 |
| severity | String | Error severity level | 'success' |
| message | String | Validation message | 'Balance Sheet is balanced' |

### Validation Scenarios

#### Scenario 1: Balanced (Success)
```
Total Assets:              LKR 15,234,567.89
Total Liabilities:         LKR  8,456,789.12
Total Equity:              LKR  6,777,778.77
Liabilities + Equity:      LKR 15,234,567.89
Difference:                LKR          0.00

Status: ✓ BALANCED
Message: "Balance Sheet is mathematically correct"
```

#### Scenario 2: Minor Rounding Difference (Warning)
```
Total Assets:              LKR 15,234,567.89
Total Liabilities:         LKR  8,456,789.12
Total Equity:              LKR  6,777,778.78
Liabilities + Equity:      LKR 15,234,567.90
Difference:                LKR         -0.01

Status: ⚠ WARNING (Minor Rounding)
Message: "Minor rounding difference of LKR 0.01 detected. 
         This is within acceptable tolerance."
Action: Accept with warning
```

#### Scenario 3: Significant Unbalanced (Error)
```
Total Assets:              LKR 15,234,567.89
Total Liabilities:         LKR  8,456,789.12
Total Equity:              LKR  6,777,528.77
Liabilities + Equity:      LKR 15,234,317.89
Difference:                LKR        250.00

Status: ✗ UNBALANCED (Error)
Message: "Balance Sheet does not balance. Assets exceed 
         Liabilities + Equity by LKR 250.00"
Action: Investigation required
```

#### Scenario 4: Critical Unbalanced (Critical)
```
Total Assets:              LKR 15,234,567.89
Total Liabilities:         LKR  8,456,789.12
Total Equity:              LKR  6,527,778.77
Liabilities + Equity:      LKR 14,984,567.89
Difference:                LKR    250,000.00

Status: ✗✗ CRITICAL ERROR
Message: "Balance Sheet severely unbalanced. Assets exceed 
         Liabilities + Equity by LKR 250,000.00"
Action: Immediate investigation required
```

### Common Causes of Unbalanced Balance Sheet

| Cause | Description | Investigation Steps |
|-------|-------------|---------------------|
| Unposted Entries | Journal entries created but not posted | Review unposted journal entries |
| Single-Entry Posting | Entry made to only one account | Check recent journal entries for completeness |
| Account Misclassification | Account in wrong category (asset vs. liability) | Review chart of accounts classification |
| Data Migration Issues | Incomplete or incorrect data import | Verify opening balances from migration |
| Rounding Errors | Accumulated decimal rounding | Check precision in calculations |
| Deleted Transactions | Transactions deleted after posting | Review audit log for deletions |
| Period Boundary Issues | Entries in wrong fiscal period | Check date ranges and period assignments |
| Currency Conversion Errors | Multi-currency rounding issues | Review foreign currency transactions |

### Error Message Generation

#### Success Message
```python
"Balance Sheet is balanced as of [date]. 
Total Assets (LKR [amount]) = Liabilities ([amount]) + Equity ([amount])."
```

#### Warning Message
```python
"Balance Sheet has minor rounding difference of LKR [difference]. 
This is within acceptable tolerance of LKR 0.01. 
Consider this acceptable for reporting purposes."
```

#### Error Message
```python
"Balance Sheet does not balance as of [date].
Total Assets: LKR [amount]
Total Liabilities + Equity: LKR [amount]
Difference: LKR [difference]

This indicates a data integrity issue. Common causes:
- Unposted journal entries
- Incomplete transaction entries
- Account misclassification

Action Required: Review recent transactions and journal entries."
```

### Expected Outcome
- Reliable accounting equation validation
- Clear identification of balanced/unbalanced state
- Detailed difference calculation
- Severity classification
- Helpful diagnostic messages
- Investigation guidance for errors

### Verification Checklist
- [ ] `validate_balance_sheet` method created
- [ ] Total assets retrieved from Task 55 method
- [ ] Total liabilities retrieved from Task 58 method
- [ ] Total equity retrieved from Task 60 method
- [ ] Liabilities + Equity calculated correctly
- [ ] Comparison performed with rounding tolerance
- [ ] Difference calculated if unbalanced
- [ ] Validation result structure returned
- [ ] Severity levels determined correctly
- [ ] Diagnostic messages generated
- [ ] Logging implemented
- [ ] Edge cases handled properly

---

## Task 62: Create BS Data Structure

### Overview
Create the standardized data structure for Balance Sheet output that organizes assets, liabilities, and equity in a hierarchical format suitable for rendering in HTML, PDF, or JSON responses. This structure follows Sri Lankan financial reporting standards and supports both detailed and summarized views.

### Dependencies
- Task 55: Add Calculate Total Assets
- Task 58: Add Calculate Total Liabilities
- Task 60: Add Calculate Total Equity
- Task 61: Add Balance Validation
- All calculation methods completed

### Instructions

1. **Add generate method to BalanceSheetGenerator**
   - Navigate to `apps/accounting/reports/balance_sheet.py`
   - Create method named `generate`
   - Accept tenant, as_of_date, options parameters
   - Return complete Balance Sheet data structure

2. **Create main data structure dictionary**
   - Initialize primary dictionary to hold all BS data
   - Include metadata section (tenant, date, currency)
   - Include assets section
   - Include liabilities section
   - Include equity section
   - Include validation section

3. **Populate metadata section**
   - Tenant/company name
   - Report title: "Balance Sheet" or "Statement of Financial Position"
   - Report date (as_of_date)
   - Report generation timestamp
   - Currency (LKR)
   - Fiscal period information

4. **Structure assets section**
   - Create nested dictionary for assets
   - Current assets subsection with account details
   - Non-current/fixed assets subsection
   - Accumulated depreciation (contra account)
   - Net fixed assets calculation
   - Subtotal for each category
   - Total assets

5. **Structure liabilities section**
   - Create nested dictionary for liabilities
   - Current liabilities subsection with account details
   - Non-current/long-term liabilities subsection
   - Subtotal for each category
   - Total liabilities

6. **Structure equity section**
   - Create nested dictionary for equity
   - Share capital or owner's capital
   - Retained earnings breakdown (opening + current)
   - Other reserves if applicable
   - Subtotal for each component
   - Total equity

7. **Add validation information**
   - Call `validate_balance_sheet` method
   - Include validation result in data structure
   - Show whether balanced or unbalanced
   - Include difference if unbalanced
   - Add validation message

8. **Include account-level details**
   - For each line item, include account code
   - Include account name
   - Include account balance
   - Group by category (current, fixed, etc.)
   - Sort accounts logically

9. **Add formatting hints**
   - Include display_level for indentation (1, 2, 3)
   - Include is_bold flag for section totals
   - Include is_subtotal and is_total flags
   - Include should_underline for totals
   - Support hierarchical rendering

10. **Calculate all totals and subtotals**
    - Current assets subtotal
    - Fixed assets subtotal (gross and net)
    - Total assets
    - Current liabilities subtotal
    - Long-term liabilities subtotal
    - Total liabilities
    - Total equity
    - Total liabilities and equity (should equal assets)

11. **Add optional detail level control**
    - Support summary view (only subtotals)
    - Support detailed view (all accounts)
    - Control via options parameter
    - Default to detailed view

12. **Include comparative period support (optional)**
    - If comparative date provided in options
    - Calculate prior period balances
    - Include current and prior columns
    - Calculate variance amounts and percentages
    - Structure for side-by-side comparison

### Balance Sheet Data Structure Schema

```
{
  "metadata": {
    "tenant": {
      "id": "tenant_id",
      "name": "ABC Trading (Pvt) Ltd",
      "tax_id": "123456789V"
    },
    "report_title": "Balance Sheet",
    "alternate_title": "Statement of Financial Position",
    "as_of_date": "2025-06-30",
    "generated_at": "2025-06-30T14:30:00Z",
    "currency": "LKR",
    "fiscal_year": "2025-04-01 to 2026-03-31"
  },
  
  "assets": {
    "current_assets": {
      "title": "Current Assets",
      "accounts": [
        {
          "code": "1100",
          "name": "Cash on Hand",
          "balance": 150000.00,
          "display_level": 2
        },
        {
          "code": "1110",
          "name": "Cash at Bank",
          "balance": 2500000.00,
          "display_level": 2
        },
        ...
      ],
      "subtotal": 5234567.89,
      "is_subtotal": true
    },
    
    "non_current_assets": {
      "title": "Non-Current Assets",
      "fixed_assets_gross": 8000000.00,
      "accumulated_depreciation": -1200000.00,
      "fixed_assets_net": 6800000.00,
      "accounts": [...],
      "subtotal": 6800000.00,
      "is_subtotal": true
    },
    
    "total": 12034567.89,
    "is_total": true
  },
  
  "liabilities": {
    "current_liabilities": {
      "title": "Current Liabilities",
      "accounts": [...],
      "subtotal": 3456789.12,
      "is_subtotal": true
    },
    
    "non_current_liabilities": {
      "title": "Non-Current Liabilities",
      "accounts": [...],
      "subtotal": 2000000.00,
      "is_subtotal": true
    },
    
    "total": 5456789.12,
    "is_total": true
  },
  
  "equity": {
    "title": "Owner's Equity",
    "capital": {
      "title": "Share Capital",
      "amount": 5000000.00,
      "display_level": 2
    },
    
    "retained_earnings": {
      "title": "Retained Earnings",
      "opening_balance": 1200000.00,
      "current_period_income": 377778.77,
      "total": 1577778.77,
      "display_level": 2
    },
    
    "total": 6577778.77,
    "is_total": true
  },
  
  "validation": {
    "is_balanced": true,
    "total_assets": 12034567.89,
    "total_liabilities": 5456789.12,
    "total_equity": 6577778.77,
    "liabilities_plus_equity": 12034567.89,
    "difference": 0.00,
    "message": "Balance Sheet is balanced"
  }
}
```

### Display Level Guidelines

| Level | Purpose | Example | Formatting |
|-------|---------|---------|------------|
| 1 | Section headers | "ASSETS", "LIABILITIES" | Bold, uppercase |
| 2 | Subsection headers | "Current Assets" | Bold, title case |
| 3 | Account line items | "Cash on Hand" | Normal, indented |
| 4 | Sub-items | "Less: Accumulated Depreciation" | Italic, double indent |

### Expected Outcome
- Comprehensive, structured Balance Sheet data
- Hierarchical organization of accounts
- All totals and subtotals calculated
- Validation information included
- Ready for template rendering or API response
- Support for different detail levels
- Sri Lankan formatting conventions

### Verification Checklist
- [ ] `generate` method created in BalanceSheetGenerator
- [ ] Main data structure dictionary initialized
- [ ] Metadata section populated correctly
- [ ] Assets section structured with current/non-current
- [ ] Liabilities section structured properly
- [ ] Equity section includes capital and RE
- [ ] Validation information included
- [ ] Account-level details provided
- [ ] Display hints (level, bold, underline) added
- [ ] All subtotals calculated correctly
- [ ] Total assets calculated
- [ ] Total liabilities calculated
- [ ] Total equity calculated
- [ ] Accounting equation verified
- [ ] Optional detail levels supported
- [ ] Structure ready for template rendering

---

## Task 63: Create BS HTML Template

### Overview
Create a professional HTML template for rendering the Balance Sheet report with proper formatting, Sri Lankan currency display, hierarchical structure, and print-friendly styling. The template should present financial position clearly, support PDF generation, and meet Sri Lankan business reporting standards.

### Dependencies
- Task 62: Create BS Data Structure
- Django template system configured
- Template directory structure exists
- CSS styling framework available

### Instructions

1. **Create template file**
   - Navigate to `apps/accounting/templates/reports/` directory
   - Create new file named `balance_sheet.html`
   - Set up Django template structure
   - Extend base report template if available

2. **Add template header section**
   - Include company/tenant name prominently
   - Add report title: "Balance Sheet" or "Statement of Financial Position"
   - Display as_of_date clearly ("As at June 30, 2025")
   - Include company address and tax ID
   - Add report generation date/time

3. **Create report container structure**
   - Set up main container div
   - Add page styling for A4 or letter size
   - Include print-friendly CSS classes
   - Set up header, body, footer sections

4. **Design assets section template**
   - Create "ASSETS" section header
   - Add "Current Assets" subsection header
   - Loop through current assets accounts
   - Display account name and balance (right-aligned)
   - Add subtotal line for current assets
   - Create "Non-Current Assets" subsection
   - Show fixed assets gross amount
   - Show accumulated depreciation (bracketed)
   - Show net fixed assets
   - Add bold total assets line

5. **Design liabilities section template**
   - Create "LIABILITIES" section header
   - Add "Current Liabilities" subsection header
   - Loop through current liabilities accounts
   - Display account name and balance
   - Add subtotal line for current liabilities
   - Create "Non-Current Liabilities" subsection
   - Loop through long-term liabilities
   - Add subtotal line
   - Add bold total liabilities line

6. **Design equity section template**
   - Create "EQUITY" section header (or "OWNER'S EQUITY")
   - Display share capital or owner's capital
   - Create "Retained Earnings" subsection
   - Show opening retained earnings
   - Show current period net income
   - Show total retained earnings
   - Add other equity items if present
   - Add bold total equity line

7. **Add total liabilities and equity line**
   - Create summary line
   - Show "Total Liabilities and Equity"
   - Display calculated total (should equal total assets)
   - Use double underline styling
   - Make bold and prominent

8. **Implement currency formatting**
   - Format all amounts as LKR
   - Use comma separators (e.g., 1,234,567.89)
   - Right-align all monetary amounts
   - Show two decimal places consistently
   - Use parentheses for negative amounts or "Less:" prefix

9. **Add hierarchical indentation**
   - Indent level 1: Section headers (no indent)
   - Indent level 2: Subsection headers (small indent)
   - Indent level 3: Account names (standard indent)
   - Indent level 4: Sub-items like accumulated depreciation (double indent)
   - Use CSS classes for consistent spacing

10. **Implement subtotal and total styling**
    - Subtotals: Single underline above
    - Section totals: Bold with single underline above
    - Grand total: Bold with double underline above
    - Add extra spacing before totals
    - Use distinct visual hierarchy

11. **Add validation indicator**
    - If balanced: Show checkmark or "Balanced" indicator
    - If unbalanced: Show warning message
    - Display validation difference if applicable
    - Use color coding (green for balanced, red for unbalanced)

12. **Include footer information**
    - Add IRD compliance statement if required
    - Include preparation date and time
    - Add page numbers for multi-page reports
    - Include "Unaudited" or "Audited" designation if applicable

13. **Implement print-friendly CSS**
    - Page break settings for long reports
    - Hide navigation elements when printing
    - Adjust margins for printing
    - Ensure black and white printer compatibility
    - Set appropriate font sizes for print

14. **Add responsive design considerations**
    - Ensure readability on different screen sizes
    - Maintain table structure on smaller screens
    - Keep alignment consistent
    - Test on mobile devices

### Template Structure Example

```html
<!DOCTYPE html>
<html>
<head>
    <title>Balance Sheet - {{ metadata.tenant.name }}</title>
    <style>
        /* CSS styling */
    </style>
</head>
<body>
    <!-- Header Section -->
    <div class="report-header">
        <h1>{{ metadata.tenant.name }}</h1>
        <h2>Balance Sheet</h2>
        <h3>As at {{ metadata.as_of_date|date:"F d, Y" }}</h3>
    </div>
    
    <!-- Assets Section -->
    <div class="report-section">
        <h3 class="section-title">ASSETS</h3>
        
        <div class="subsection">
            <h4 class="subsection-title">Current Assets</h4>
            {% for account in assets.current_assets.accounts %}
            <div class="account-line level-3">
                <span class="account-name">{{ account.name }}</span>
                <span class="account-balance">{{ account.balance|format_currency }}</span>
            </div>
            {% endfor %}
            <div class="subtotal-line">
                <span class="label">Total Current Assets</span>
                <span class="amount">{{ assets.current_assets.subtotal|format_currency }}</span>
            </div>
        </div>
        
        <!-- Non-Current Assets -->
        <!-- ... -->
        
        <div class="total-line double-underline">
            <span class="label">TOTAL ASSETS</span>
            <span class="amount">{{ assets.total|format_currency }}</span>
        </div>
    </div>
    
    <!-- Liabilities Section -->
    <!-- ... -->
    
    <!-- Equity Section -->
    <!-- ... -->
    
    <!-- Total L + E -->
    <!-- ... -->
    
    <!-- Validation -->
    <div class="validation">
        {% if validation.is_balanced %}
        <span class="balanced">✓ Balance Sheet is balanced</span>
        {% else %}
        <span class="unbalanced">⚠ Unbalanced by {{ validation.difference|format_currency }}</span>
        {% endif %}
    </div>
    
    <!-- Footer -->
    <div class="report-footer">
        <p>Generated on {{ metadata.generated_at|date:"F d, Y H:i" }}</p>
    </div>
</body>
</html>
```

### CSS Styling Guidelines

| Element | Styling | Purpose |
|---------|---------|---------|
| Report header | Center-aligned, larger font | Company identification |
| Section titles | Bold, uppercase, 16pt | Major sections (Assets, Liabilities, Equity) |
| Subsection titles | Bold, 14pt | Current/Non-current divisions |
| Account lines | Normal, 12pt, indented | Individual accounts |
| Subtotals | Bold, single top border | Section summaries |
| Totals | Bold, double top border | Grand totals |
| Amounts | Right-aligned, monospace | Currency values |

### Sri Lankan Report Format Conventions

- Currency displayed as "LKR 1,234,567.89"
- Date format: "As at 30th June 2025" or "30/06/2025"
- Company name at top with tax ID below
- Decimals: Always show two decimal places
- Negative amounts: Use parentheses (1,234.56) or "Less:" prefix
- Signature lines if required for formal reports

### Expected Outcome
- Professional, printable Balance Sheet report
- Clear hierarchical structure
- Proper Sri Lankan formatting
- Print-friendly design
- Validation indicator visible
- Ready for PDF generation
- Mobile-responsive layout

### Verification Checklist
- [ ] `balance_sheet.html` template created
- [ ] Template header section completed
- [ ] Assets section properly structured
- [ ] Liabilities section properly structured
- [ ] Equity section properly structured
- [ ] Total L+E line displayed
- [ ] Currency formatting implemented (LKR)
- [ ] Hierarchical indentation applied
- [ ] Subtotal styling with underlines
- [ ] Total styling with double underlines
- [ ] Validation indicator included
- [ ] Footer information added
- [ ] Print-friendly CSS implemented
- [ ] Responsive design tested
- [ ] Renders correctly with sample data
- [ ] Compatible with PDF generation library

---

## Task 64: Create BS API Endpoint

### Overview
Implement the REST API endpoint for generating Balance Sheet reports. The endpoint accepts date parameters, generates the Balance Sheet using the BalanceSheetGenerator, and returns the structured data in JSON format or renders the HTML template. Supports both programmatic access and direct viewing.

### Dependencies
- Task 62: Create BS Data Structure
- Task 63: Create BS HTML Template
- Django REST Framework configured
- Authentication and permissions configured
- Report views module exists

### Instructions

1. **Open reports views module**
   - Navigate to `apps/accounting/views/reports.py`
   - Import required modules (Django REST Framework, generators)
   - Import BalanceSheetGenerator class
   - Prepare to add new endpoint

2. **Create BalanceSheetView class**
   - Create class extending APIView or similar
   - Name it `BalanceSheetView` or `BalanceSheetAPIView`
   - Add appropriate decorators for authentication
   - Add tenant context handling

3. **Implement GET method handler**
   - Define `get` method accepting request parameter
   - Extract tenant from request context
   - Parse query parameters (as_of_date, format)
   - Validate input parameters

4. **Parse and validate as_of_date parameter**
   - Get as_of_date from query parameters
   - Default to today's date if not provided
   - Validate date format (YYYY-MM-DD)
   - Return error for invalid dates
   - Convert to date object

5. **Parse format parameter**
   - Get format from query parameters (default: 'json')
   - Support 'json' format for API response
   - Support 'html' format for rendered template
   - Support 'pdf' format for downloadable PDF (optional)
   - Validate format value

6. **Instantiate BalanceSheetGenerator**
   - Create BalanceSheetGenerator instance
   - Pass tenant and configuration if needed
   - Handle instantiation errors
   - Prepare for generation

7. **Generate Balance Sheet data**
   - Call `generate` method with tenant and as_of_date
   - Catch any generation exceptions
   - Handle errors gracefully with error responses
   - Store generated data structure

8. **Handle JSON format response**
   - If format is 'json', return JSON response
   - Use Django REST Framework Response class
   - Include complete data structure from Task 62
   - Set appropriate HTTP status code (200)
   - Add CORS headers if needed

9. **Handle HTML format response**
   - If format is 'html', render HTML template
   - Use Django render function with balance_sheet.html template
   - Pass generated data structure to template context
   - Return rendered HTML response
   - Set content type appropriately

10. **Handle PDF format response (optional)**
    - If format is 'pdf', generate PDF from HTML
    - Use PDF generation library (e.g., WeasyPrint, ReportLab)
    - Render HTML template first, then convert to PDF
    - Return PDF as downloadable file
    - Set appropriate content-disposition header

11. **Add error handling**
    - Catch ValueError for invalid parameters
    - Catch calculation errors from generator
    - Catch template rendering errors
    - Return appropriate error responses (400, 500)
    - Include helpful error messages

12. **Add permission checks**
    - Verify user has permission to view financial reports
    - Check tenant access permissions
    - Return 403 Forbidden if unauthorized
    - Use Django permission decorators or DRF permissions

13. **Add response caching (optional)**
    - Consider caching Balance Sheet for recent dates
    - Implement cache invalidation on data changes
    - Use Django cache framework
    - Set appropriate cache timeout
    - Add cache headers to response

14. **Register URL route**
    - Open `apps/accounting/urls.py`
    - Add route: `path('reports/balance-sheet/', BalanceSheetView.as_view())`
    - Ensure route is included in main URL configuration
    - Test URL routing

### API Endpoint Specification

**Endpoint:** `GET /api/accounting/reports/balance-sheet/`

**Query Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| as_of_date | String (YYYY-MM-DD) | No | Today | Date for Balance Sheet |
| format | String | No | 'json' | Response format: 'json', 'html', 'pdf' |
| detail_level | String | No | 'detailed' | 'summary' or 'detailed' |

**Response (JSON format):**
```json
{
  "success": true,
  "data": {
    "metadata": { ... },
    "assets": { ... },
    "liabilities": { ... },
    "equity": { ... },
    "validation": { ... }
  }
}
```

**Response (HTML format):**
```html
<!DOCTYPE html>
<html>
  <!-- Rendered Balance Sheet template -->
</html>
```

**Error Response:**
```json
{
  "success": false,
  "error": {
    "code": "INVALID_DATE",
    "message": "Invalid date format. Use YYYY-MM-DD."
  }
}
```

### Usage Examples

#### Example 1: Get Balance Sheet as JSON
```
GET /api/accounting/reports/balance-sheet/?as_of_date=2025-06-30&format=json

Response: Complete Balance Sheet data structure in JSON
```

#### Example 2: Get Balance Sheet as HTML
```
GET /api/accounting/reports/balance-sheet/?as_of_date=2025-06-30&format=html

Response: Rendered HTML page with Balance Sheet
```

#### Example 3: Download Balance Sheet as PDF
```
GET /api/accounting/reports/balance-sheet/?as_of_date=2025-06-30&format=pdf

Response: PDF file download (Content-Type: application/pdf)
Filename: balance-sheet-2025-06-30.pdf
```

#### Example 4: Get Current Balance Sheet (default date)
```
GET /api/accounting/reports/balance-sheet/

Response: Balance Sheet as of today in JSON format
```

### Security Considerations

| Aspect | Implementation | Purpose |
|--------|----------------|---------|
| Authentication | Require login token/session | Prevent unauthorized access |
| Tenant Isolation | Enforce tenant context from request | Prevent cross-tenant data leakage |
| Permission Check | Verify 'view_financial_reports' permission | Role-based access control |
| Rate Limiting | Limit requests per user/IP | Prevent abuse and DoS |
| Input Validation | Validate all query parameters | Prevent injection attacks |
| Error Messages | Generic errors for security | Avoid information disclosure |

### Expected Outcome
- RESTful API endpoint for Balance Sheet
- Support for multiple output formats
- Proper error handling
- Authentication and authorization
- Clear, documented API interface
- Ready for frontend integration

### Verification Checklist
- [ ] `BalanceSheetView` class created
- [ ] GET method handler implemented
- [ ] as_of_date parameter parsed and validated
- [ ] format parameter parsed and validated
- [ ] BalanceSheetGenerator instantiated correctly
- [ ] `generate` method called with correct parameters
- [ ] JSON format response implemented
- [ ] HTML format response implemented
- [ ] PDF format response implemented (optional)
- [ ] Error handling added for all failure cases
- [ ] Permission checks implemented
- [ ] URL route registered in urls.py
- [ ] Authentication required
- [ ] Tenant isolation enforced
- [ ] API tested with various parameters
- [ ] Documentation added for API endpoint

---

## Summary

This document covered Tasks 59-64, completing the Balance Sheet report implementation:

- **Task 59:** Retained earnings calculation with current period net income integration
- **Task 60:** Total equity calculation summing all equity components
- **Task 61:** Fundamental accounting equation validation (Assets = Liabilities + Equity)
- **Task 62:** Comprehensive Balance Sheet data structure with hierarchical organization
- **Task 63:** Professional HTML template with Sri Lankan formatting conventions
- **Task 64:** RESTful API endpoint with multiple output format support

The Balance Sheet module now provides:
- Complete statement of financial position as of any date
- Proper separation of current and non-current items
- Accurate retained earnings including current period results
- Mathematical validation of accounting equation
- Professional reporting output
- Programmatic API access

### Next Steps

Proceed to **Group E: Cash Flow Statement and General Ledger** to implement:
- Cash Flow Statement (operating, investing, financing activities)
- General Ledger report with transaction details
- Trial Balance verification
- Account transaction history

---

**Document Status:** Complete  
**Last Updated:** Phase 06, SubPhase 11, Group D, Document 02  
**Tasks Covered:** 59, 60, 61, 62, 63, 64
