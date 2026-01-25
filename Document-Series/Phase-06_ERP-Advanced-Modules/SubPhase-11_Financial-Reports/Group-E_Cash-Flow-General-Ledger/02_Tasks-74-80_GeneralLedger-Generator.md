# Tasks 74-80: GeneralLedgerGenerator Implementation

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 11 - Financial Reports  
> **Group:** E - Cash Flow & General Ledger  
> **Document:** 02 of 02  
> **Tasks Covered:** 74, 75, 76, 77, 78, 79, 80

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-65-73_CashFlow-Generator.md](01_Tasks-65-73_CashFlow-Generator.md)
- **→ Next Group:** [Group-F_Export-Testing-Documentation](../Group-F_Export-Testing-Documentation/)

---

## Document Overview

This document covers the implementation of the General Ledger report generator, which provides detailed transaction-level reporting for accounts. The General Ledger displays all journal entries affecting specific accounts, calculates running balances, and supports filtering by account code ranges and date ranges. This report is essential for detailed transaction analysis and account reconciliation.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 74 | Create GeneralLedgerGenerator | Medium | 30 min |
| 75 | Add Account Filter Method | Low | 15 min |
| 76 | Add Get Transactions Method | Medium | 30 min |
| 77 | Add Running Balance Calc | Medium | 25 min |
| 78 | Create GL Data Structure | Medium | 25 min |
| 79 | Create GL HTML Template | Medium | 30 min |
| 80 | Create GL API Endpoint | Low | 15 min |

---

## Task 74: Create GeneralLedgerGenerator

### Overview
Create the GeneralLedgerGenerator class that extends BaseReportGenerator to provide detailed transaction listings for accounts. This generator retrieves journal entries, calculates running balances, and formats data for general ledger presentation. The GL report is a fundamental accounting tool for transaction-level analysis.

### Dependencies
- Task 73: Create CF API Endpoint
- BaseReportGenerator exists
- Account model with chart of accounts
- JournalEntry and JournalEntryLine models
- Transaction data available

### Instructions

1. **Create general_ledger.py file**
   - Navigate to `apps/accounting/reports/` directory
   - Create file named `general_ledger.py`
   - Import necessary modules

2. **Import required dependencies**
   - Import BaseReportGenerator from base module
   - Import Account model
   - Import JournalEntry and JournalEntryLine models
   - Import Django ORM functions (Sum, Q, F)
   - Import Decimal for precise calculations
   - Import date and datetime utilities

3. **Define GeneralLedgerGenerator class**
   - Inherit from BaseReportGenerator
   - Add class docstring explaining purpose
   - Document Sri Lankan accounting context

4. **Define report_type property**
   - Return 'general_ledger'
   - Used for template selection and identification

5. **Define report_name property**
   - Return 'General Ledger'
   - User-friendly report title

6. **Add __init__ method**
   - Accept tenant, start_date, end_date
   - Accept optional account_code parameter
   - Accept optional account_code_range (start, end)
   - Store parameters as instance variables
   - Call parent __init__ method

7. **Add parameter validation method**
   - Validate date range (start <= end)
   - Validate account code format if provided
   - Validate account code range if provided
   - Raise ValueError for invalid parameters

8. **Add account filter storage**
   - Store account_code if provided
   - Store account_code_range if provided
   - Default to None (all accounts)

9. **Update reports/__init__.py**
   - Import GeneralLedgerGenerator
   - Add to __all__ list
   - Ensure proper module exposure

### GeneralLedgerGenerator Structure

```
┌─────────────────────────────────────────────────┐
│        GeneralLedgerGenerator Class             │
├─────────────────────────────────────────────────┤
│ Properties:                                     │
│  • report_type: 'general_ledger'                │
│  • report_name: 'General Ledger'                │
│                                                 │
│ Initialization:                                 │
│  • tenant (required)                            │
│  • start_date (required)                        │
│  • end_date (required)                          │
│  • account_code (optional)                      │
│  • account_code_range (optional)                │
│                                                 │
│ Methods (to be implemented):                    │
│  • filter_accounts()                            │
│  • get_transactions()                           │
│  • calculate_running_balance()                  │
│  • generate_data()                              │
└─────────────────────────────────────────────────┘
```

### Class Inheritance Hierarchy

```
┌──────────────────────┐
│  BaseReportGenerator │
└──────────────────────┘
           △
           │ inherits
           │
┌──────────────────────────┐
│ GeneralLedgerGenerator   │
│                          │
│ + report_type            │
│ + report_name            │
│ + account_code           │
│ + account_code_range     │
│ + filter_accounts()      │
│ + get_transactions()     │
│ + calculate_running()    │
│ + generate_data()        │
└──────────────────────────┘
```

### Initialization Parameters

| Parameter | Type | Required | Purpose |
|-----------|------|----------|---------|
| tenant | Tenant | Yes | Multi-tenancy context |
| start_date | date | Yes | Report period start |
| end_date | date | Yes | Report period end |
| account_code | str | No | Single account filter |
| account_code_range | tuple | No | Account range filter (start, end) |

### Account Filter Options

```
Filter Type 1: Single Account
═══════════════════════════════
account_code = '1100'
Result: Only account 1100 (Cash on Hand)

Filter Type 2: Account Range
═══════════════════════════════
account_code_range = ('1100', '1199')
Result: All accounts from 1100 to 1199 (Current Assets)

Filter Type 3: All Accounts
═══════════════════════════════
account_code = None
account_code_range = None
Result: All accounts with transactions in period
```

### Sri Lankan Account Code Context

| Code Range | Category | Examples |
|------------|----------|----------|
| 1100-1199 | Current Assets | 1100 Cash, 1120 Bank, 1150 AR |
| 1200-1299 | Fixed Assets | 1200 Equipment, 1210 Vehicles |
| 2100-2199 | Current Liabilities | 2100 AP, 2120 VAT Payable |
| 2200-2299 | Long-term Liabilities | 2200 Loans, 2210 Mortgages |
| 3000-3999 | Equity | 3000 Capital, 3900 Retained |
| 4000-4999 | Revenue | 4000 Sales, 4100 Service Rev |
| 5000-5999 | Cost of Sales | 5000 Purchases, 5100 COGS |
| 6000-6999 | Operating Expenses | 6000 Salaries, 6100 Rent |

### Expected Outcome
- Functional GeneralLedgerGenerator class
- Proper inheritance from BaseReportGenerator
- Account filtering capability
- Parameter validation
- Foundation for transaction retrieval

### Verification Checklist
- [ ] general_ledger.py file created
- [ ] GeneralLedgerGenerator class defined
- [ ] Inherits from BaseReportGenerator
- [ ] report_type property returns 'general_ledger'
- [ ] report_name property returns 'General Ledger'
- [ ] __init__ method accepts all parameters
- [ ] account_code parameter stored
- [ ] account_code_range parameter stored
- [ ] Parameter validation implemented
- [ ] Class imported in __init__.py

---

## Task 75: Add Account Filter Method

### Overview
Implement the account filtering method that selects which accounts to include in the General Ledger report based on the provided filter criteria. This method supports single account selection, account code range filtering, or all accounts, providing flexible reporting capabilities.

### Dependencies
- Task 74: Create GeneralLedgerGenerator

### Instructions

1. **Open general_ledger.py file**
   - Navigate to GeneralLedgerGenerator class
   - Add filter_accounts method

2. **Define filter_accounts method**
   - Accept no additional parameters (uses instance variables)
   - Return QuerySet of filtered accounts
   - Apply tenant filter automatically

3. **Build base account queryset**
   - Query Account model
   - Filter by tenant
   - Filter by is_active=True
   - Order by account_code

4. **Apply single account filter**
   - Check if self.account_code is set
   - Filter queryset by account_code exact match
   - Return single account queryset

5. **Apply account range filter**
   - Check if self.account_code_range is set
   - Extract start_code and end_code from tuple
   - Filter queryset using code__gte and code__lte
   - Return range queryset

6. **Handle all accounts case**
   - If no filters specified, return all active accounts
   - Optionally limit to accounts with transactions in period
   - Consider performance implications

7. **Add account validation**
   - Verify account exists if single code provided
   - Verify range validity (start < end)
   - Raise ValueError if account not found

8. **Add docstring documentation**
   - Explain filtering logic
   - Document return type
   - Provide usage examples

### Account Filtering Logic Flow

```
┌─────────────────────────────────────┐
│  filter_accounts() method           │
└─────────────────────────────────────┘
            │
            ▼
    ┌───────────────┐
    │ Base QuerySet │  ← Tenant + Active
    └───────────────┘
            │
            ▼
    ┌───────────────────┐
    │ Check Filter Type │
    └───────────────────┘
      │        │        │
      ▼        ▼        ▼
   Single   Range     All
   Account  Filter  Accounts
      │        │        │
      ▼        ▼        ▼
  code='1100' code__gte  Return
              code__lte  All
              └─────┘      │
                  │        │
                  ▼        ▼
           ┌──────────────────┐
           │  Return QuerySet  │
           └──────────────────┘
```

### Filter Examples

#### Example 1: Single Account (Cash on Hand)
```
Input:
  account_code = '1100'

Query:
  Account.objects.filter(
    tenant=self.tenant,
    is_active=True,
    code='1100'
  )

Result:
  [Account(code='1100', name='Cash on Hand')]
```

#### Example 2: Account Range (All Current Assets)
```
Input:
  account_code_range = ('1100', '1199')

Query:
  Account.objects.filter(
    tenant=self.tenant,
    is_active=True,
    code__gte='1100',
    code__lte='1199'
  ).order_by('code')

Result:
  [
    Account(code='1100', name='Cash on Hand'),
    Account(code='1110', name='Petty Cash'),
    Account(code='1120', name='Bank - Commercial'),
    Account(code='1130', name='Bank - Savings'),
    Account(code='1150', name='Accounts Receivable'),
    ...
  ]
```

#### Example 3: All Accounts
```
Input:
  account_code = None
  account_code_range = None

Query:
  Account.objects.filter(
    tenant=self.tenant,
    is_active=True
  ).order_by('code')

Result:
  [All active accounts sorted by code]
```

### Account Selection Scenarios

| Scenario | Filter | Use Case |
|----------|--------|----------|
| Cash reconciliation | code='1100' | Daily cash verification |
| Bank accounts review | range=('1120', '1129') | All bank accounts |
| Asset analysis | range=('1100', '1299') | Complete asset listing |
| Revenue detail | range=('4000', '4999') | All revenue accounts |
| Expense breakdown | range=('6000', '6999') | Operating expenses |
| Full GL | None | Complete transaction detail |

### Performance Considerations

```
Optimization Strategies
══════════════════════

1. Index on account_code
   ✓ Fast single account lookup
   ✓ Efficient range queries

2. Filter by date before account
   ✓ Reduce dataset size first
   ✓ Then apply account filter

3. Use select_related for account type
   ✓ Reduce database queries
   ✓ Include account category data

4. Consider pagination
   ✓ Large account ranges
   ✓ Many transactions per account
```

### Expected Outcome
- Flexible account filtering
- Support for single account, range, or all
- Efficient query construction
- Proper validation and error handling

### Verification Checklist
- [ ] filter_accounts method defined
- [ ] Base queryset with tenant filter
- [ ] Single account filter logic
- [ ] Account range filter logic
- [ ] All accounts handling
- [ ] Account validation implemented
- [ ] Method docstring added
- [ ] Returns correct QuerySet type

---

## Task 76: Add Get Transactions Method

### Overview
Implement the method to retrieve all journal entry lines (transactions) for the filtered accounts within the specified date range. This method fetches detailed transaction data including entry numbers, dates, descriptions, debits, credits, and related references.

### Dependencies
- Task 75: Add Account Filter Method

### Instructions

1. **Open general_ledger.py file**
   - Continue in GeneralLedgerGenerator class
   - Add get_transactions method

2. **Define get_transactions method**
   - Accept account queryset as parameter
   - Return list of transaction dictionaries
   - Each transaction represents one journal entry line

3. **Build transaction queryset**
   - Query JournalEntryLine model
   - Filter by journal_entry__tenant
   - Filter by journal_entry__date range (start_date to end_date)
   - Filter by account in filtered account queryset

4. **Add related data selection**
   - Use select_related('journal_entry', 'account')
   - Include entry number, date, description
   - Optimize query performance

5. **Order transactions appropriately**
   - Primary order: account_code
   - Secondary order: journal_entry__date
   - Tertiary order: journal_entry__entry_number
   - Ensure chronological flow within account

6. **Extract transaction details**
   - Iterate through queryset
   - Extract entry number (e.g., "JE-2026-001")
   - Extract transaction date
   - Extract description/reference
   - Extract debit amount
   - Extract credit amount
   - Extract source reference if available

7. **Format transaction data**
   - Create dictionary for each transaction
   - Include account_code and account_name
   - Include entry_number, date, description
   - Include debit_amount and credit_amount
   - Include source_type and source_reference
   - Format amounts as Decimal for precision

8. **Handle special transaction types**
   - Opening balance entries
   - Closing entries
   - Adjustment entries
   - Transfer entries

9. **Add transaction filtering options**
   - Optionally filter by transaction type
   - Optionally filter by source module
   - Optionally exclude internal transfers

### Transaction Retrieval Flow

```
┌─────────────────────────────────────┐
│  get_transactions(accounts) method  │
└─────────────────────────────────────┘
            │
            ▼
    ┌───────────────────┐
    │ Build Base Query  │
    │ JournalEntryLine  │
    └───────────────────┘
            │
            ▼
    ┌───────────────────┐
    │  Apply Filters    │
    │ • Tenant          │
    │ • Date range      │
    │ • Accounts        │
    └───────────────────┘
            │
            ▼
    ┌───────────────────┐
    │ Select Related    │
    │ • journal_entry   │
    │ • account         │
    └───────────────────┘
            │
            ▼
    ┌───────────────────┐
    │   Order By        │
    │ • account_code    │
    │ • date            │
    │ • entry_number    │
    └───────────────────┘
            │
            ▼
    ┌───────────────────┐
    │ Extract & Format  │
    │ Transaction Data  │
    └───────────────────┘
            │
            ▼
    ┌───────────────────┐
    │ Return List of    │
    │   Dictionaries    │
    └───────────────────┘
```

### Transaction Data Structure

```python
transaction = {
    'account_code': '1100',
    'account_name': 'Cash on Hand',
    'entry_number': 'JE-2026-001',
    'date': date(2026, 1, 15),
    'description': 'Cash sale - Invoice #INV-001',
    'debit_amount': Decimal('5000.00'),
    'credit_amount': Decimal('0.00'),
    'source_type': 'invoice',
    'source_reference': 'INV-001',
    'reference_number': 'REF-12345'
}
```

### Transaction Data Fields

| Field | Type | Purpose | Example |
|-------|------|---------|---------|
| account_code | str | Account identifier | '1100' |
| account_name | str | Account description | 'Cash on Hand' |
| entry_number | str | Journal entry ID | 'JE-2026-001' |
| date | date | Transaction date | 2026-01-15 |
| description | str | Transaction detail | 'Cash sale - INV-001' |
| debit_amount | Decimal | Debit value | 5000.00 |
| credit_amount | Decimal | Credit value | 0.00 |
| source_type | str | Origin module | 'invoice' |
| source_reference | str | Source document ID | 'INV-001' |
| reference_number | str | External reference | 'REF-12345' |

### Example Transaction Listings

#### Example 1: Cash Account Transactions
```
Account: 1100 - Cash on Hand
Period: 2026-01-01 to 2026-01-31

Date       | Entry #     | Description                | Debit      | Credit
-----------|-------------|----------------------------|------------|----------
2026-01-01 | JE-2026-001 | Opening balance           |  10,000.00 |
2026-01-05 | JE-2026-002 | Cash sale - INV-001       |   5,000.00 |
2026-01-08 | JE-2026-003 | Payment to supplier       |            |  3,000.00
2026-01-10 | JE-2026-004 | Cash refund - RFD-001     |            |    500.00
2026-01-15 | JE-2026-005 | Cash sale - INV-002       |   8,500.00 |
2026-01-20 | JE-2026-006 | Rent payment              |            |  2,000.00
2026-01-25 | JE-2026-007 | Cash sale - INV-003       |   3,200.00 |
2026-01-31 | JE-2026-008 | Bank deposit              |            | 15,000.00
```

#### Example 2: Bank Account Transactions
```
Account: 1120 - Bank - Commercial Bank
Period: 2026-01-01 to 2026-01-31

Date       | Entry #     | Description                | Debit      | Credit
-----------|-------------|----------------------------|------------|----------
2026-01-01 | JE-2026-009 | Opening balance           |  50,000.00 |
2026-01-03 | JE-2026-010 | Customer payment - INV-005|   8,500.00 |
2026-01-07 | JE-2026-011 | Supplier payment - PO-123 |            |  12,000.00
2026-01-12 | JE-2026-012 | Loan repayment            |            |   5,000.00
2026-01-18 | JE-2026-013 | Customer payment - INV-008|  15,200.00 |
2026-01-22 | JE-2026-014 | Utility bill payment      |            |   1,500.00
2026-01-28 | JE-2026-015 | Employee salary payment   |            |  35,000.00
2026-01-31 | JE-2026-016 | Bank charges              |            |     250.00
```

### Sri Lankan Transaction References

| Source Type | Reference Format | Description |
|-------------|------------------|-------------|
| invoice | INV-YYYY-NNNN | Sales invoice |
| purchase_order | PO-YYYY-NNNN | Purchase order |
| payment | PAY-YYYY-NNNN | Payment voucher |
| receipt | RCT-YYYY-NNNN | Receipt voucher |
| refund | RFD-YYYY-NNNN | Refund document |
| adjustment | ADJ-YYYY-NNNN | Journal adjustment |
| transfer | TRF-YYYY-NNNN | Internal transfer |

### Expected Outcome
- Complete transaction retrieval
- Detailed journal entry line data
- Proper ordering and grouping
- Source reference tracking
- Optimized query performance

### Verification Checklist
- [ ] get_transactions method defined
- [ ] JournalEntryLine query built
- [ ] Tenant and date filters applied
- [ ] Account filter applied
- [ ] select_related for performance
- [ ] Correct ordering implemented
- [ ] Transaction data extracted
- [ ] Dictionary format created
- [ ] Source references included
- [ ] Method docstring added

---

## Task 77: Add Running Balance Calculation

### Overview
Implement the running balance calculation for each transaction line in the General Ledger. The running balance accumulates debits and credits chronologically, showing the account balance after each transaction. This is essential for account reconciliation and understanding the account's financial position at any point in time.

### Dependencies
- Task 76: Add Get Transactions Method

### Instructions

1. **Open general_ledger.py file**
   - Continue in GeneralLedgerGenerator class
   - Add calculate_running_balance method

2. **Define calculate_running_balance method**
   - Accept transactions list as parameter
   - Accept account object for balance type determination
   - Return transactions with running balance added

3. **Determine opening balance**
   - Query account balance before start_date
   - Sum all debits and credits before period
   - Calculate net balance (debits - credits for assets/expenses)
   - Use appropriate formula for account type

4. **Initialize running balance**
   - Set initial balance to opening balance
   - Create variable to track current balance
   - Consider account type for calculation direction

5. **Iterate through transactions**
   - Process each transaction in chronological order
   - For each transaction, calculate impact on balance
   - Update running balance accordingly

6. **Apply debit/credit balance rules**
   - Asset accounts: Debit increases, Credit decreases
   - Liability accounts: Credit increases, Debit decreases
   - Equity accounts: Credit increases, Debit decreases
   - Revenue accounts: Credit increases, Debit decreases
   - Expense accounts: Debit increases, Credit decreases

7. **Calculate balance per transaction**
   - If debit amount exists, apply to balance
   - If credit amount exists, apply to balance
   - Store running balance with transaction
   - Format balance as Decimal

8. **Add balance to transaction dictionary**
   - Add 'running_balance' key to each transaction dict
   - Format balance with proper sign
   - Consider displaying debit/credit balance notation

9. **Handle zero balances**
   - Display zero as 0.00
   - Maintain proper formatting
   - Consider balance notation (Dr/Cr)

10. **Add Sri Lankan formatting**
    - Use LKR currency symbol where needed
    - Format amounts with commas (e.g., 1,000,000.00)
    - Apply two decimal places for rupees

### Balance Calculation Logic

```
Running Balance Calculation Flow
═════════════════════════════════

For Asset/Expense Accounts:
  Opening Balance: 10,000.00 (Dr)
  
  Transaction 1: Debit 5,000.00
    Balance = 10,000.00 + 5,000.00 = 15,000.00 (Dr)
  
  Transaction 2: Credit 3,000.00
    Balance = 15,000.00 - 3,000.00 = 12,000.00 (Dr)
  
  Transaction 3: Debit 8,000.00
    Balance = 12,000.00 + 8,000.00 = 20,000.00 (Dr)

For Liability/Revenue Accounts:
  Opening Balance: 5,000.00 (Cr)
  
  Transaction 1: Credit 3,000.00
    Balance = 5,000.00 + 3,000.00 = 8,000.00 (Cr)
  
  Transaction 2: Debit 2,000.00
    Balance = 8,000.00 - 2,000.00 = 6,000.00 (Cr)
  
  Transaction 3: Credit 4,000.00
    Balance = 6,000.00 + 4,000.00 = 10,000.00 (Cr)
```

### Account Type Balance Rules

| Account Type | Normal Balance | Debit Effect | Credit Effect |
|--------------|----------------|--------------|---------------|
| Asset | Debit (Dr) | Increase (+) | Decrease (-) |
| Liability | Credit (Cr) | Decrease (-) | Increase (+) |
| Equity | Credit (Cr) | Decrease (-) | Increase (+) |
| Revenue | Credit (Cr) | Decrease (-) | Increase (+) |
| Expense | Debit (Dr) | Increase (+) | Decrease (-) |

### Running Balance Example - Cash Account

```
ACCOUNT: 1100 - Cash on Hand (Asset)
Period: 2026-01-01 to 2026-01-31
Opening Balance: LKR 10,000.00 (Dr)

Date       | Entry #     | Description    | Debit     | Credit    | Balance
-----------|-------------|----------------|-----------|-----------|-------------
           |             | Opening Balance|           |           |  10,000.00 Dr
2026-01-05 | JE-2026-001 | Cash sale      |  5,000.00 |           |  15,000.00 Dr
2026-01-08 | JE-2026-002 | Supplier pay   |           |  3,000.00 |  12,000.00 Dr
2026-01-10 | JE-2026-003 | Cash refund    |           |    500.00 |  11,500.00 Dr
2026-01-15 | JE-2026-004 | Cash sale      |  8,500.00 |           |  20,000.00 Dr
2026-01-20 | JE-2026-005 | Rent payment   |           |  2,000.00 |  18,000.00 Dr
2026-01-25 | JE-2026-006 | Cash sale      |  3,200.00 |           |  21,200.00 Dr
2026-01-31 | JE-2026-007 | Bank deposit   |           | 15,000.00 |   6,200.00 Dr

Closing Balance: LKR 6,200.00 (Dr)
```

### Running Balance Example - Revenue Account

```
ACCOUNT: 4000 - Sales Revenue (Revenue)
Period: 2026-01-01 to 2026-01-31
Opening Balance: LKR 0.00

Date       | Entry #     | Description    | Debit     | Credit    | Balance
-----------|-------------|----------------|-----------|-----------|-------------
           |             | Opening Balance|           |           |       0.00
2026-01-05 | JE-2026-001 | Cash sale      |           |  5,000.00 |   5,000.00 Cr
2026-01-10 | JE-2026-003 | Sale refund    |    500.00 |           |   4,500.00 Cr
2026-01-15 | JE-2026-004 | Cash sale      |           |  8,500.00 |  13,000.00 Cr
2026-01-25 | JE-2026-006 | Cash sale      |           |  3,200.00 |  16,200.00 Cr

Closing Balance: LKR 16,200.00 (Cr)
```

### Balance Calculation Steps

```
Step-by-Step Calculation Process
═════════════════════════════════

Step 1: Get Opening Balance
  ┌─────────────────────────────┐
  │ Query all transactions      │
  │ before start_date           │
  │ Sum debits and credits      │
  │ Calculate net balance       │
  └─────────────────────────────┘

Step 2: Initialize Running Balance
  ┌─────────────────────────────┐
  │ current_balance =           │
  │   opening_balance           │
  └─────────────────────────────┘

Step 3: Process Each Transaction
  ┌─────────────────────────────┐
  │ FOR each transaction:       │
  │   IF debit:                 │
  │     Apply debit rule        │
  │   IF credit:                │
  │     Apply credit rule       │
  │   Store running balance     │
  └─────────────────────────────┘

Step 4: Return Enhanced Data
  ┌─────────────────────────────┐
  │ Return transactions with    │
  │ running_balance field added │
  └─────────────────────────────┘
```

### Expected Outcome
- Accurate running balance calculation
- Account type-aware balance logic
- Opening balance inclusion
- Chronological balance tracking
- Proper debit/credit handling

### Verification Checklist
- [ ] calculate_running_balance method defined
- [ ] Opening balance query implemented
- [ ] Running balance initialization
- [ ] Transaction iteration logic
- [ ] Debit/credit rules applied correctly
- [ ] Balance calculation for all account types
- [ ] running_balance added to transactions
- [ ] LKR formatting applied
- [ ] Zero balance handling
- [ ] Method docstring added

---

## Task 78: Create GL Data Structure

### Overview
Create the structured data format for the General Ledger report that organizes transactions by account with running balances, opening balances, closing balances, and transaction details. This data structure serves as the foundation for template rendering and API responses.

### Dependencies
- Task 77: Add Running Balance Calc

### Instructions

1. **Open general_ledger.py file**
   - Continue in GeneralLedgerGenerator class
   - Add generate_data method (overriding base class)

2. **Define generate_data method**
   - Override base class method
   - Return dictionary with complete GL data structure
   - Include report metadata

3. **Get filtered accounts**
   - Call filter_accounts method
   - Store filtered account queryset
   - Handle empty account list case

4. **Build account sections**
   - Iterate through each filtered account
   - Create section for each account
   - Include account details

5. **Get transactions per account**
   - Call get_transactions for current account
   - Pass single-account queryset
   - Handle accounts with no transactions

6. **Calculate opening balance per account**
   - Query balance before start_date
   - Calculate based on account type
   - Format as Decimal with LKR

7. **Calculate running balances**
   - Call calculate_running_balance method
   - Pass transactions and account
   - Get enhanced transaction list

8. **Calculate closing balance**
   - Take last running balance from transaction list
   - If no transactions, closing = opening
   - Format with proper currency

9. **Build account section dictionary**
   - Include account_code and account_name
   - Include account_type and normal_balance
   - Include opening_balance
   - Include transactions list
   - Include closing_balance
   - Include transaction_count

10. **Calculate report totals**
    - Total debit movements (sum of all debits)
    - Total credit movements (sum of all credits)
    - Verify debits = credits
    - Include validation status

11. **Add report metadata**
    - Report title
    - Tenant information
    - Date range (start_date, end_date)
    - Filter criteria (account code/range)
    - Generation timestamp
    - Generated by user

12. **Return complete data structure**
    - Return dictionary with all sections
    - Include metadata and accounts list
    - Include summary totals

### GL Data Structure Format

```python
{
    'report_metadata': {
        'report_title': 'General Ledger',
        'report_type': 'general_ledger',
        'tenant_name': 'LankaCommerce (Pvt) Ltd',
        'start_date': '2026-01-01',
        'end_date': '2026-01-31',
        'filter_type': 'range',  # 'single', 'range', or 'all'
        'filter_value': '1100-1199',
        'generated_at': '2026-02-01 10:30:00',
        'generated_by': 'admin@lankacommerce.lk'
    },
    'accounts': [
        {
            'account_code': '1100',
            'account_name': 'Cash on Hand',
            'account_type': 'asset',
            'normal_balance': 'debit',
            'opening_balance': Decimal('10000.00'),
            'opening_balance_type': 'Dr',
            'transactions': [
                {
                    'date': '2026-01-05',
                    'entry_number': 'JE-2026-001',
                    'description': 'Cash sale - INV-001',
                    'debit_amount': Decimal('5000.00'),
                    'credit_amount': Decimal('0.00'),
                    'running_balance': Decimal('15000.00'),
                    'source_type': 'invoice',
                    'source_reference': 'INV-001'
                },
                # ... more transactions
            ],
            'closing_balance': Decimal('6200.00'),
            'closing_balance_type': 'Dr',
            'transaction_count': 7,
            'total_debits': Decimal('16700.00'),
            'total_credits': Decimal('20500.00')
        },
        # ... more accounts
    ],
    'summary': {
        'total_accounts': 12,
        'total_transactions': 145,
        'total_debit_movements': Decimal('2500000.00'),
        'total_credit_movements': Decimal('2500000.00'),
        'balanced': True
    }
}
```

### Account Section Structure

```
┌────────────────────────────────────────────────┐
│          Account Section Structure             │
├────────────────────────────────────────────────┤
│ Account Information:                           │
│  • account_code                                │
│  • account_name                                │
│  • account_type                                │
│  • normal_balance                              │
│                                                │
│ Balance Information:                           │
│  • opening_balance                             │
│  • opening_balance_type (Dr/Cr)                │
│  • closing_balance                             │
│  • closing_balance_type (Dr/Cr)                │
│                                                │
│ Transaction Details:                           │
│  • transactions[] list                         │
│  • transaction_count                           │
│  • total_debits                                │
│  • total_credits                               │
└────────────────────────────────────────────────┘
```

### Report Metadata Fields

| Field | Type | Purpose | Example |
|-------|------|---------|---------|
| report_title | str | Report name | 'General Ledger' |
| report_type | str | Report identifier | 'general_ledger' |
| tenant_name | str | Business name | 'LankaCommerce (Pvt) Ltd' |
| start_date | str | Period start | '2026-01-01' |
| end_date | str | Period end | '2026-01-31' |
| filter_type | str | Filter category | 'range' |
| filter_value | str | Filter details | '1100-1199' |
| generated_at | str | Generation time | '2026-02-01 10:30:00' |
| generated_by | str | User email | 'admin@example.lk' |

### Summary Calculations

```
Summary Statistics
══════════════════

Total Accounts:
  Count of accounts in report
  Example: 12 accounts

Total Transactions:
  Count of all transaction lines
  Example: 145 transactions

Total Debit Movements:
  Sum of all debit amounts
  Example: LKR 2,500,000.00

Total Credit Movements:
  Sum of all credit amounts
  Example: LKR 2,500,000.00

Balanced Status:
  Verify debits = credits
  True if balanced, False if discrepancy
```

### Expected Outcome
- Well-structured GL data
- Account-wise organization
- Complete balance tracking
- Transaction detail preservation
- Summary statistics
- Metadata inclusion

### Verification Checklist
- [ ] generate_data method defined
- [ ] Overrides base class method
- [ ] filter_accounts called
- [ ] Account iteration implemented
- [ ] get_transactions called per account
- [ ] Opening balance calculated
- [ ] Running balances calculated
- [ ] Closing balance determined
- [ ] Account section dictionary created
- [ ] Summary totals calculated
- [ ] Report metadata included
- [ ] Complete data structure returned

---

## Task 79: Create GL HTML Template

### Overview
Create the HTML template for rendering the General Ledger report in a professional, printable format. The template displays account details with transaction listings, running balances, and proper formatting suitable for Sri Lankan accounting standards and audit requirements.

### Dependencies
- Task 78: Create GL Data Structure

### Instructions

1. **Create template file**
   - Navigate to `apps/accounting/templates/reports/`
   - Create file `general_ledger.html`
   - Extend base report template if available

2. **Add template header**
   - Display report title "GENERAL LEDGER"
   - Show tenant business name
   - Display date range (start_date to end_date)
   - Show filter information (account/range)

3. **Add company information section**
   - Display tenant name (bold, large font)
   - Show address if available
   - Show tax identification numbers
   - Display report generation date

4. **Create report filters display**
   - Show account filter (single or range)
   - Display date range clearly
   - Format dates as DD/MM/YYYY (Sri Lankan standard)

5. **Iterate through accounts**
   - Loop through accounts list
   - Create section for each account
   - Display account header

6. **Create account header section**
   - Show account code and name (bold)
   - Display account type
   - Show opening balance with Dr/Cr notation
   - Format: "ACCOUNT: 1100 - Cash on Hand (Asset)"

7. **Create transaction table**
   - Add table header row
   - Columns: Date, Entry #, Description, Debit, Credit, Balance
   - Use proper table structure

8. **Add opening balance row**
   - Display "Opening Balance" in description
   - Show opening balance in Balance column
   - Leave Debit/Credit columns empty
   - Format with Dr/Cr notation

9. **Display transaction rows**
   - Loop through transactions
   - Display date in DD/MM/YYYY format
   - Show entry number as link if clickable
   - Display transaction description
   - Show debit amount if non-zero
   - Show credit amount if non-zero
   - Display running balance with Dr/Cr notation

10. **Add closing balance row**
    - Display "Closing Balance" in description
    - Show closing balance in Balance column
    - Format with bold text
    - Include Dr/Cr notation

11. **Add account summary**
    - Show transaction count
    - Display total debits
    - Display total credits
    - Add separator line

12. **Create report summary section**
    - Show total accounts processed
    - Display total transactions
    - Show total debit movements
    - Show total credit movements
    - Display balanced status indicator

13. **Add print-specific styling**
    - Page breaks between accounts if needed
    - Proper margins for printing
    - Header repeat on each page
    - Footer with page numbers

14. **Apply Sri Lankan formatting**
    - Use DD/MM/YYYY date format
    - Format currency with commas (1,000,000.00)
    - Add "LKR" currency notation
    - Right-align all amounts

15. **Add responsive design**
    - Ensure table fits on page width
    - Adjust font sizes appropriately
    - Handle long descriptions with wrapping

### Template Layout Structure

```html
<!DOCTYPE html>
<html>
<head>
    <title>General Ledger</title>
    <style>
        /* Print-optimized styles */
    </style>
</head>
<body>
    <!-- Header Section -->
    <div class="report-header">
        <h1>GENERAL LEDGER</h1>
        <h2>{{ tenant_name }}</h2>
        <p>Period: {{ start_date }} to {{ end_date }}</p>
        <p>Filter: {{ filter_description }}</p>
    </div>

    <!-- For each account -->
    {% for account in accounts %}
    <div class="account-section">
        <!-- Account Header -->
        <h3>ACCOUNT: {{ account.account_code }} - {{ account.account_name }}</h3>
        
        <!-- Transaction Table -->
        <table>
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Entry #</th>
                    <th>Description</th>
                    <th>Debit</th>
                    <th>Credit</th>
                    <th>Balance</th>
                </tr>
            </thead>
            <tbody>
                <!-- Opening Balance -->
                <tr>
                    <td></td>
                    <td></td>
                    <td>Opening Balance</td>
                    <td></td>
                    <td></td>
                    <td>{{ account.opening_balance }}</td>
                </tr>
                
                <!-- Transactions -->
                {% for transaction in account.transactions %}
                <tr>
                    <td>{{ transaction.date }}</td>
                    <td>{{ transaction.entry_number }}</td>
                    <td>{{ transaction.description }}</td>
                    <td>{{ transaction.debit_amount }}</td>
                    <td>{{ transaction.credit_amount }}</td>
                    <td>{{ transaction.running_balance }}</td>
                </tr>
                {% endfor %}
                
                <!-- Closing Balance -->
                <tr class="closing-balance">
                    <td></td>
                    <td></td>
                    <td><strong>Closing Balance</strong></td>
                    <td></td>
                    <td></td>
                    <td><strong>{{ account.closing_balance }}</strong></td>
                </tr>
            </tbody>
        </table>
        
        <!-- Account Summary -->
        <div class="account-summary">
            <p>Transactions: {{ account.transaction_count }}</p>
            <p>Total Debits: LKR {{ account.total_debits }}</p>
            <p>Total Credits: LKR {{ account.total_credits }}</p>
        </div>
    </div>
    {% endfor %}

    <!-- Report Summary -->
    <div class="report-summary">
        <h3>REPORT SUMMARY</h3>
        <table>
            <tr>
                <td>Total Accounts:</td>
                <td>{{ summary.total_accounts }}</td>
            </tr>
            <tr>
                <td>Total Transactions:</td>
                <td>{{ summary.total_transactions }}</td>
            </tr>
            <tr>
                <td>Total Debit Movements:</td>
                <td>LKR {{ summary.total_debit_movements }}</td>
            </tr>
            <tr>
                <td>Total Credit Movements:</td>
                <td>LKR {{ summary.total_credit_movements }}</td>
            </tr>
            <tr>
                <td>Balanced:</td>
                <td>{{ summary.balanced }}</td>
            </tr>
        </table>
    </div>
</body>
</html>
```

### Styling Guidelines

```css
/* Report-wide styles */
body {
    font-family: 'Arial', sans-serif;
    font-size: 10pt;
    margin: 20mm;
}

/* Header styling */
.report-header {
    text-align: center;
    margin-bottom: 20px;
    border-bottom: 2px solid #000;
}

.report-header h1 {
    font-size: 18pt;
    margin-bottom: 5px;
}

/* Account section */
.account-section {
    margin-bottom: 30px;
    page-break-inside: avoid;
}

.account-section h3 {
    background-color: #f0f0f0;
    padding: 5px;
    font-size: 12pt;
}

/* Transaction table */
table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 10px;
}

table th {
    background-color: #e0e0e0;
    border: 1px solid #000;
    padding: 5px;
    text-align: left;
}

table td {
    border: 1px solid #ccc;
    padding: 5px;
}

table td.amount {
    text-align: right;
}

/* Print-specific */
@media print {
    @page {
        margin: 15mm;
        size: A4 portrait;
    }
    
    .account-section {
        page-break-after: auto;
    }
}
```

### Expected Outcome
- Professional GL template
- Clear account organization
- Readable transaction listings
- Proper balance display
- Print-optimized layout
- Sri Lankan formatting standards

### Verification Checklist
- [ ] general_ledger.html file created
- [ ] Template extends base if available
- [ ] Report header section added
- [ ] Company information displayed
- [ ] Filter information shown
- [ ] Account iteration implemented
- [ ] Account header section created
- [ ] Transaction table structure added
- [ ] Opening balance row added
- [ ] Transaction rows displayed
- [ ] Closing balance row added
- [ ] Account summary section added
- [ ] Report summary section added
- [ ] Print-specific styling applied
- [ ] Sri Lankan date/currency formatting
- [ ] Responsive design implemented

---

## Task 80: Create GL API Endpoint

### Overview
Create the REST API endpoint for the General Ledger report that accepts filter parameters, generates the report data, and returns it in JSON or HTML format. This endpoint enables integration with the frontend dashboard and external systems.

### Dependencies
- Task 79: Create GL HTML Template

### Instructions

1. **Open reports views file**
   - Navigate to `apps/accounting/views/reports.py`
   - Locate report views class or function area

2. **Create GeneralLedgerView class**
   - Inherit from APIView or appropriate DRF base
   - Add class docstring
   - Define supported HTTP methods

3. **Implement GET method**
   - Accept request and query parameters
   - Extract start_date from query params (required)
   - Extract end_date from query params (required)
   - Extract account_code from query params (optional)
   - Extract account_code_start and account_code_end for range (optional)
   - Extract format parameter (json or html)

4. **Validate query parameters**
   - Ensure start_date and end_date are provided
   - Parse dates from string format (YYYY-MM-DD)
   - Validate date range (start <= end)
   - Validate account code format if provided
   - Return 400 error for invalid parameters

5. **Get tenant from request**
   - Extract tenant from authenticated user
   - Verify user has permission for reports
   - Handle multi-tenancy context

6. **Instantiate GeneralLedgerGenerator**
   - Pass tenant, start_date, end_date
   - Pass account_code if single account requested
   - Pass account_code_range if range requested
   - Handle instantiation errors

7. **Generate report data**
   - Call generator.generate_data()
   - Catch any generation errors
   - Log errors appropriately

8. **Handle JSON response**
   - If format=json or default
   - Serialize data structure
   - Convert Decimal to float/string for JSON
   - Return JSON response with appropriate status

9. **Handle HTML response**
   - If format=html
   - Render general_ledger.html template
   - Pass data as context
   - Return rendered HTML response

10. **Add permission checking**
    - Verify user has 'view_reports' permission
    - Check tenant access rights
    - Return 403 for unauthorized access

11. **Add error handling**
    - Catch ValueError for invalid parameters
    - Catch DoesNotExist for invalid accounts
    - Return appropriate error messages
    - Use proper HTTP status codes

12. **Update URL routing**
    - Add URL pattern for /api/reports/general-ledger/
    - Map to GeneralLedgerView
    - Include in urlpatterns

13. **Add API documentation**
    - Document endpoint in docstring
    - List all query parameters
    - Provide example requests
    - Show example responses

### API Endpoint Specification

```
Endpoint: GET /api/reports/general-ledger/

Query Parameters:
  - start_date (required): YYYY-MM-DD format
  - end_date (required): YYYY-MM-DD format
  - account_code (optional): Single account code (e.g., '1100')
  - account_code_start (optional): Range start code (e.g., '1100')
  - account_code_end (optional): Range end code (e.g., '1199')
  - format (optional): 'json' or 'html' (default: 'json')

Response Formats:
  - JSON: Complete data structure
  - HTML: Rendered report template

Authentication:
  - Required: Bearer token or session auth
  - Permission: 'view_reports'
```

### Example API Requests

#### Example 1: Single Account GL
```http
GET /api/reports/general-ledger/?start_date=2026-01-01&end_date=2026-01-31&account_code=1100
Authorization: Bearer <token>

Response: 200 OK
{
    "report_metadata": {
        "report_title": "General Ledger",
        "tenant_name": "LankaCommerce (Pvt) Ltd",
        "start_date": "2026-01-01",
        "end_date": "2026-01-31",
        "filter_type": "single",
        "filter_value": "1100"
    },
    "accounts": [
        {
            "account_code": "1100",
            "account_name": "Cash on Hand",
            "opening_balance": "10000.00",
            "transactions": [...],
            "closing_balance": "6200.00"
        }
    ],
    "summary": {
        "total_accounts": 1,
        "total_transactions": 7,
        "balanced": true
    }
}
```

#### Example 2: Account Range GL
```http
GET /api/reports/general-ledger/?start_date=2026-01-01&end_date=2026-01-31&account_code_start=1100&account_code_end=1199
Authorization: Bearer <token>

Response: 200 OK
{
    "report_metadata": {
        "filter_type": "range",
        "filter_value": "1100-1199"
    },
    "accounts": [
        { "account_code": "1100", ... },
        { "account_code": "1110", ... },
        { "account_code": "1120", ... },
        ...
    ],
    "summary": {
        "total_accounts": 12,
        "total_transactions": 145
    }
}
```

#### Example 3: All Accounts GL
```http
GET /api/reports/general-ledger/?start_date=2026-01-01&end_date=2026-01-31
Authorization: Bearer <token>

Response: 200 OK
{
    "report_metadata": {
        "filter_type": "all",
        "filter_value": "All Accounts"
    },
    "accounts": [
        { "account_code": "1100", ... },
        { "account_code": "1120", ... },
        { "account_code": "2100", ... },
        ...
    ]
}
```

#### Example 4: HTML Format
```http
GET /api/reports/general-ledger/?start_date=2026-01-01&end_date=2026-01-31&account_code=1100&format=html
Authorization: Bearer <token>

Response: 200 OK
Content-Type: text/html

<!DOCTYPE html>
<html>
<head><title>General Ledger</title></head>
<body>
    <!-- Rendered HTML template -->
</body>
</html>
```

### Error Responses

#### Missing Required Parameters
```json
{
    "error": "Missing required parameters",
    "details": "start_date and end_date are required",
    "status": 400
}
```

#### Invalid Date Format
```json
{
    "error": "Invalid date format",
    "details": "Date must be in YYYY-MM-DD format",
    "status": 400
}
```

#### Invalid Account Code
```json
{
    "error": "Account not found",
    "details": "Account code '9999' does not exist",
    "status": 404
}
```

#### Unauthorized Access
```json
{
    "error": "Permission denied",
    "details": "You do not have permission to view reports",
    "status": 403
}
```

### URL Configuration

```python
# apps/accounting/urls.py

from django.urls import path
from .views.reports import (
    BalanceSheetView,
    IncomeStatementView,
    TrialBalanceView,
    CashFlowView,
    GeneralLedgerView,
)

urlpatterns = [
    # ... other report endpoints
    path('reports/general-ledger/', GeneralLedgerView.as_view(), name='general-ledger'),
]
```

### Expected Outcome
- Functional GL API endpoint
- Query parameter support
- Multiple format responses (JSON/HTML)
- Proper error handling
- Authentication and authorization
- URL routing configured

### Verification Checklist
- [ ] GeneralLedgerView class created
- [ ] GET method implemented
- [ ] Query parameter extraction
- [ ] Parameter validation
- [ ] Tenant retrieval from request
- [ ] GeneralLedgerGenerator instantiation
- [ ] generate_data() call
- [ ] JSON response handling
- [ ] HTML response handling
- [ ] Permission checking
- [ ] Error handling implemented
- [ ] URL pattern added
- [ ] API documentation in docstring

---

## Summary

This document implemented the complete General Ledger report generator:

### Completed Components
- ✅ GeneralLedgerGenerator class with BaseReportGenerator inheritance
- ✅ Account filtering (single, range, all accounts)
- ✅ Transaction retrieval with journal entry details
- ✅ Running balance calculation with account type awareness
- ✅ Structured data format for GL reports
- ✅ Professional HTML template with Sri Lankan formatting
- ✅ REST API endpoint with flexible parameters

### Key Features
1. **Flexible Filtering** - Single account, range, or all accounts
2. **Running Balances** - Transaction-level balance tracking
3. **Account Type Awareness** - Proper debit/credit handling
4. **Sri Lankan Context** - LKR formatting, DD/MM/YYYY dates
5. **API Integration** - JSON and HTML response formats
6. **Audit Trail** - Complete transaction detail with references

### Integration Points
- Extends BaseReportGenerator framework
- Uses Account, JournalEntry, JournalEntryLine models
- Integrates with authentication and permissions
- Supports multi-tenant architecture
- Provides data for frontend dashboard

### Next Steps
Proceed to [Group-F_Export-Testing-Documentation](../Group-F_Export-Testing-Documentation/) to implement report export functionality (PDF, Excel, CSV), comprehensive testing suites, and complete API documentation.

---

**Document Status:** ✅ Complete  
**Total Tasks:** 7  
**Total Lines:** ~970
