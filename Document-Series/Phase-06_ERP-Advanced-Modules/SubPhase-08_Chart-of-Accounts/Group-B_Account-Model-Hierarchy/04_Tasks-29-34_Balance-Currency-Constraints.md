# Tasks 29-34: Balance, Currency, and Constraints

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 08 - Chart of Accounts  
> **Group:** B - Account Model & Hierarchy  
> **Document:** 04 of 04  
> **Tasks Covered:** 29, 30, 31, 32, 33, 34

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [03_Tasks-25-28_Hierarchy-System-Fields.md](03_Tasks-25-28_Hierarchy-System-Fields.md)
- **→ Next Group:** [Group-C_Default-Chart-Setup](../Group-C_Default-Chart-Setup/)

---

## Document Overview

This document completes the Account model implementation by adding currency support for multi-currency operations, balance tracking fields, timestamp management, database migrations, and final model constraints. These elements enable accurate balance tracking, support for foreign currency accounts, and ensure data integrity at the database level.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 29 | Add Account Currency | Low | 15 min |
| 30 | Add Account Opening Balance | Low | 15 min |
| 31 | Add Account Current Balance | Low | 15 min |
| 32 | Add Account Timestamps | Low | 10 min |
| 33 | Run Account Migrations | Low | 10 min |
| 34 | Add Account Model Constraints | Medium | 25 min |

---

## Task 29: Add Account Currency

### Overview
Add an optional currency field that allows specific accounts to track balances in foreign currencies while most accounts use the tenant's base currency. This is essential for businesses engaged in international trade or maintaining foreign currency bank accounts. When null, the account inherits the tenant's default currency.

### Dependencies
- Task 18: Create Account Model
- Currency model exists (from earlier phase)
- Tenant model has default_currency field

### Instructions

1. **Open account.py model file**
   - Navigate to `apps/accounting/models/account.py`
   - Locate Account model class

2. **Import Currency model**
   - Add import for Currency model
   - Verify Currency model is accessible

3. **Add currency field**
   - Use ForeignKey to Currency model
   - Set null=True and blank=True (optional override)
   - Set related_name='accounts'
   - Set on_delete=PROTECT (prevent currency deletion if in use)
   - Add help_text explaining currency override

4. **Add currency resolution logic**
   - Implement property method to get effective currency
   - Returns account currency if set, otherwise tenant default
   - Ensures every account has a currency for calculations

5. **Document multi-currency usage**
   - Explain when to set account-specific currency
   - Provide examples of foreign currency accounts
   - Note exchange rate considerations

6. **Update model string representation**
   - Consider including currency code in display
   - Show currency for foreign currency accounts

### Currency Field Specifications

| Attribute | Value | Purpose |
|-----------|-------|---------|
| Field Type | ForeignKey | Links to Currency model |
| Related Model | Currency | Currency definition |
| Related Name | 'accounts' | Reverse relation |
| Null | True | Optional override |
| Blank | True | Can be left empty |
| On Delete | PROTECT | Prevent currency deletion |
| Default | None | Inherits tenant default |

### Currency Inheritance Model

```
┌──────────────────────────────────────────────────────────┐
│              Currency Resolution Logic                    │
├──────────────────────────────────────────────────────────┤
│                                                           │
│  Tenant:                                                  │
│  └── default_currency: LKR (Sri Lankan Rupee)            │
│                                                           │
│  Accounts:                                                │
│  ├── 1201 - Commercial Bank - Main                       │
│  │   └── currency: None → Inherits LKR                   │
│  │                                                        │
│  ├── 1202 - People's Bank - Payroll                      │
│  │   └── currency: None → Inherits LKR                   │
│  │                                                        │
│  ├── 1251 - Commercial Bank - USD                        │
│  │   └── currency: USD → Overrides to USD                │
│  │                                                        │
│  └── 1252 - HSBC - EUR Trade Account                     │
│      └── currency: EUR → Overrides to EUR                │
│                                                           │
│  Property Method:                                         │
│    @property                                              │
│    def effective_currency(self):                          │
│        return self.currency or self.tenant.default_currency│
│                                                           │
└──────────────────────────────────────────────────────────┘
```

### Multi-Currency Account Examples

#### Sri Lankan Business with Exports
```
Base Currency: LKR (Sri Lankan Rupee)

BANK ACCOUNTS:

1200 - Bank Accounts [HEADER]
├── 1210 - Local Currency Accounts [HEADER]
│   ├── 1201 - Commercial Bank - Main (LKR)      currency=None
│   ├── 1202 - People's Bank - Payroll (LKR)     currency=None
│   └── 1203 - BOC - Savings (LKR)               currency=None
│
└── 1250 - Foreign Currency Accounts [HEADER]
    ├── 1251 - Commercial Bank - USD             currency=USD
    ├── 1252 - HSBC - USD Trade Finance          currency=USD
    ├── 1253 - Sampath Bank - EUR                currency=EUR
    └── 1254 - Commercial Bank - GBP             currency=GBP

RECEIVABLES:

1300 - Accounts Receivable [HEADER]
├── 1301 - Trade Receivables - Local (LKR)       currency=None
├── 1302 - Trade Receivables - Export (USD)      currency=USD
└── 1303 - Trade Receivables - Export (EUR)      currency=EUR
```

### Currency Display in UI

#### Account Selection Dropdown
```
Select Bank Account:
┌────────────────────────────────────────────┐
│ 1201 - Commercial Bank - Main (LKR)        │
│ 1202 - People's Bank - Payroll (LKR)       │
│ 1251 - Commercial Bank - USD 💱            │
│ 1252 - HSBC - USD Trade Finance 💱         │
│ 1253 - Sampath Bank - EUR 💱               │
└────────────────────────────────────────────┘

Legend: 💱 = Foreign Currency Account
```

#### Account Balance Display
```
BANK BALANCES
═══════════════════════════════════════════════════════════
Account                              Currency      Balance
──────────────────────────────────────────────────────────
Commercial Bank - Main               LKR       250,000.00
People's Bank - Payroll              LKR       150,000.00
Commercial Bank - USD                USD         5,000.00
HSBC - USD Trade Finance             USD        15,000.00
Sampath Bank - EUR                   EUR         2,000.00
═══════════════════════════════════════════════════════════
```

### Currency Usage Scenarios

#### Scenario 1: Export Business
```
Company: Lanka Exports (Pvt) Ltd
Base Currency: LKR

Foreign Currency Accounts Needed:
├── USD Bank Account (for US customers)
├── EUR Bank Account (for European customers)
├── USD Receivables (export invoices in USD)
└── EUR Receivables (export invoices in EUR)

Benefits:
✓ Track foreign currency balances natively
✓ Avoid constant currency conversion
✓ Proper handling of exchange gains/losses
✓ Simplified bank reconciliation
```

#### Scenario 2: Import Business
```
Company: Ceylon Importers Ltd
Base Currency: LKR

Foreign Currency Accounts Needed:
├── USD Bank Account (for US suppliers)
├── CNY Bank Account (for Chinese suppliers)
├── USD Payables (import bills in USD)
└── CNY Payables (import bills in CNY)

Benefits:
✓ Pay suppliers in their currency
✓ Track import obligations accurately
✓ Manage currency exposure
✓ Proper LC (Letter of Credit) accounting
```

#### Scenario 3: Foreign Investment
```
Company: International Holdings Lanka
Base Currency: LKR

Foreign Currency Accounts Needed:
├── USD Investment Account
├── USD Interest Receivable
└── Foreign Exchange Gain/Loss Accounts

Benefits:
✓ Track foreign investments at original currency
✓ Calculate returns in investment currency
✓ Proper revaluation at reporting dates
```

### Exchange Rate Considerations

```
Multi-Currency Balance Reporting
═══════════════════════════════════════════════════════════

Individual Account Balances (Native Currency):
├── Commercial Bank - Main (LKR):        250,000.00 LKR
├── Commercial Bank - USD:                 5,000.00 USD
└── Sampath Bank - EUR:                    2,000.00 EUR

Reporting Currency Conversion (to LKR):
├── Exchange Rate USD/LKR: 320.00
├── Exchange Rate EUR/LKR: 380.00

Converted Balances:
├── Commercial Bank - Main:              250,000.00 LKR
├── Commercial Bank - USD (5,000 × 320): 1,600,000.00 LKR
└── Sampath Bank - EUR (2,000 × 380):     760,000.00 LKR

Total Bank Balance:                    2,610,000.00 LKR
═══════════════════════════════════════════════════════════

Note: Exchange rates are stored separately in exchange rate table
      and applied during reporting. Account balances always stored
      in account's currency.
```

### Currency Validation Rules

```
Currency Assignment Validation
═══════════════════════════════════════════════════════════

Rule 1: Currency Must Be Active
├─ Check: currency.is_active = True
└─ Error: "Cannot assign inactive currency to account"

Rule 2: Prevent Currency Change with Transactions
├─ Check: Has existing transactions?
├─ If yes: Block currency change
└─ Error: "Cannot change currency - account has transactions"

Rule 3: Currency Matches Transaction Currency (Future)
├─ When posting transaction to account
├─ Check: Transaction currency = Account currency
└─ Error: "Cannot post USD transaction to EUR account"

Rule 4: Control Accounts Use Base Currency
├─ If is_system=True (control account)
├─ Recommendation: Use base currency only
└─ Warning: "System accounts should use base currency"
```

### Currency Property Methods

```
Currency Resolution Property (Implementation Pattern)
═══════════════════════════════════════════════════════════

@property
def effective_currency(self):
    """
    Returns the currency for this account.
    If account has specific currency, returns that.
    Otherwise, returns tenant's default currency.
    """
    return self.currency or self.tenant.default_currency

@property
def currency_code(self):
    """
    Returns the currency code (e.g., 'LKR', 'USD', 'EUR')
    """
    return self.effective_currency.code

@property
def is_foreign_currency(self):
    """
    Returns True if account uses non-base currency
    """
    return (self.currency is not None and 
            self.currency != self.tenant.default_currency)

Usage Examples:

account = Account.objects.get(code=1251)
print(account.currency_code)  # "USD"
print(account.is_foreign_currency)  # True

account2 = Account.objects.get(code=1201)
print(account2.currency_code)  # "LKR" (inherited)
print(account2.is_foreign_currency)  # False
```

### Reporting with Multiple Currencies

```
Trial Balance - Multi-Currency
═══════════════════════════════════════════════════════════
Code  Account Name                  Curr    Debit    Credit
──────────────────────────────────────────────────────────
ASSETS
1201  Commercial Bank - Main        LKR   250,000         -
1251  Commercial Bank - USD         USD     5,000         -
1252  HSBC - USD                    USD    15,000         -
1253  Sampath Bank - EUR            EUR     2,000         -

LIABILITIES
2251  USD Payables                  USD         -    10,000
2252  EUR Payables                  EUR         -     1,500

──────────────────────────────────────────────────────────
Foreign Currency Balances at Reporting Date (31-Dec-2026)
Exchange Rates: USD/LKR = 320.00, EUR/LKR = 380.00

Converted to LKR:
1251: 5,000 USD × 320 = 1,600,000 LKR
1252: 15,000 USD × 320 = 4,800,000 LKR
1253: 2,000 EUR × 380 = 760,000 LKR
2251: 10,000 USD × 320 = 3,200,000 LKR (Cr)
2252: 1,500 EUR × 380 = 570,000 LKR (Cr)
═══════════════════════════════════════════════════════════
```

### Sri Lankan Context - Common Currencies

```
Common Currencies in Sri Lankan Business
═══════════════════════════════════════════════════════════

LKR - Sri Lankan Rupee (Base Currency)
├─ Usage: Domestic transactions
├─ All local accounts
└─ Default tenant currency

USD - US Dollar
├─ Usage: Most common foreign currency
├─ Export/import transactions
├─ International payments
└─ Foreign currency reserves

EUR - Euro
├─ Usage: European trade
├─ EU customer/supplier transactions
└─ Some foreign investments

GBP - British Pound
├─ Usage: UK trade relationships
└─ Historical trading partner

CNY - Chinese Yuan
├─ Usage: China trade (growing)
└─ Import from China

INR - Indian Rupee
├─ Usage: India trade
├─ SAARC regional trade
└─ Some import/export

AUD, CAD, JPY
├─ Usage: Less common
└─ Specific trading relationships
```

### Expected Outcome
- Optional currency field for account-specific currency
- Inheritance of tenant default currency when not specified
- Support for multi-currency bank accounts
- Foreign currency receivables and payables
- Proper currency display in UI
- Foundation for exchange rate handling
- Protection against currency deletion while in use

### Verification Checklist
- [ ] currency field added as ForeignKey to Currency
- [ ] null=True and blank=True set
- [ ] on_delete=PROTECT configured
- [ ] related_name='accounts' set
- [ ] effective_currency property implemented
- [ ] is_foreign_currency property implemented
- [ ] Currency validation rules documented
- [ ] Multi-currency examples provided
- [ ] Exchange rate considerations documented
- [ ] Help text explains currency override

---

## Task 30: Add Account Opening Balance

### Overview
Add a decimal field to store the account's opening balance as of a specific date (typically the start of fiscal year or system go-live date). The opening balance represents the balance brought forward from the previous system or period and serves as the starting point for all subsequent transactions.

### Dependencies
- Task 18: Create Account Model
- Task 29: Add Account Currency (for currency context)

### Instructions

1. **Open account.py model file**
   - Continue in `apps/accounting/models/account.py`
   - Locate Account model class

2. **Add opening_balance field**
   - Use DecimalField with appropriate precision
   - Set max_digits=20 for large values
   - Set decimal_places=2 for standard currency precision
   - Default to 0.00 (no opening balance)
   - Mark as required (null=False)

3. **Add opening_balance_date field**
   - Use DateField to track opening balance date
   - Optional field (blank=True, null=True)
   - Represents the date the opening balance is effective
   - Typically fiscal year start or go-live date

4. **Document opening balance usage**
   - Explain when to set opening balances
   - Describe data migration scenarios
   - Note double-entry validation requirements

5. **Add opening balance validation**
   - Consider sign validation based on account type
   - Assets/Expenses: Positive = Debit, Negative = Credit
   - Liabilities/Equity/Revenue: Positive = Credit, Negative = Debit

6. **Document balance import process**
   - Explain bulk import during setup
   - Note the need for balancing entry
   - Reference suspense account usage

### Opening Balance Field Specifications

| Attribute | Value | Purpose |
|-----------|-------|---------|
| Field Type | DecimalField | High precision for currency |
| Max Digits | 20 | Up to 999,999,999,999,999,999.99 |
| Decimal Places | 2 | Standard currency precision |
| Default | 0.00 | No opening balance |
| Required | Yes | Every account has a balance (even zero) |
| Validation | Sign based on type | Ensure proper debit/credit |

### Opening Balance Concept

```
┌──────────────────────────────────────────────────────────┐
│              Opening Balance Explanation                  │
├──────────────────────────────────────────────────────────┤
│                                                           │
│  What is Opening Balance?                                 │
│  • Balance at the start of accounting period              │
│  • Brought forward from previous system/period            │
│  • Set during system implementation/migration             │
│  • Starting point for all future transactions             │
│                                                           │
│  When to Set Opening Balance?                             │
│  • Initial system setup (go-live)                         │
│  • Start of new fiscal year                               │
│  • Data migration from old system                         │
│  • Chart of accounts restructuring                        │
│                                                           │
│  Opening Balance Date:                                    │
│  • Typically start of fiscal year (e.g., Jan 1, 2026)     │
│  • Or system go-live date (e.g., July 1, 2026)           │
│  • Must be consistent across all accounts                 │
│  • Transactions posted after this date                    │
│                                                           │
└──────────────────────────────────────────────────────────┘
```

### Opening Balance Examples

#### Asset Account Opening Balances
```
Opening Balances as of January 1, 2026
═══════════════════════════════════════════════════════════

ASSETS (Debit Balances - Positive)
Code  Account Name                     Opening Balance
──────────────────────────────────────────────────────────
1101  Cash on Hand                     Rs.      50,000.00
1201  Commercial Bank - Main           Rs.     250,000.00
1202  People's Bank - Payroll          Rs.     100,000.00
1301  Trade Receivables - Local        Rs.     350,000.00
1401  Finished Goods Inventory         Rs.     500,000.00
1501  Office Equipment                 Rs.     300,000.00
1502  Furniture & Fixtures             Rs.     150,000.00

Total Asset Opening Balances:          Rs.   1,700,000.00
```

#### Liability Account Opening Balances
```
LIABILITIES (Credit Balances - Positive represents credit)
Code  Account Name                     Opening Balance
──────────────────────────────────────────────────────────
2101  Trade Payables - Suppliers       Rs.     200,000.00
2201  VAT Payable                      Rs.      35,000.00
2301  Bank Loan - Commercial Bank      Rs.     500,000.00

Total Liability Opening Balances:      Rs.     735,000.00
```

#### Equity Account Opening Balances
```
EQUITY (Credit Balances - Positive represents credit)
Code  Account Name                     Opening Balance
──────────────────────────────────────────────────────────
3001  Owner's Capital                  Rs.     800,000.00
3101  Retained Earnings                Rs.     165,000.00

Total Equity Opening Balances:         Rs.     965,000.00
```

### Double-Entry Balance Validation

```
Opening Balance Equation
═══════════════════════════════════════════════════════════

Accounting Equation:
Assets = Liabilities + Equity

Opening Balance Verification:
├── Total Asset Balances:          1,700,000.00 (Dr)
├── Total Liability Balances:        735,000.00 (Cr)
├── Total Equity Balances:           965,000.00 (Cr)
│
└── Validation:
    Assets = Liabilities + Equity
    1,700,000 = 735,000 + 965,000
    1,700,000 = 1,700,000 ✅ BALANCED

If Unbalanced:
Assets: 1,700,000
Liabilities + Equity: 1,650,000
Difference: 50,000 (Out of balance)

Action: Create balancing entry using:
1999 - Opening Balance Adjustments (Suspense Account)
```

### Balance Sign Convention

```
Balance Sign Interpretation by Account Type
═══════════════════════════════════════════════════════════

DEBIT BALANCE ACCOUNTS (Positive = Debit):
├── Assets
│   └── Example: Cash Rs. 50,000 = Debit balance
├── Expenses
│   └── Example: Rent Expense Rs. 10,000 = Debit balance

CREDIT BALANCE ACCOUNTS (Positive = Credit):
├── Liabilities
│   └── Example: Payables Rs. 200,000 = Credit balance
├── Equity
│   └── Example: Capital Rs. 800,000 = Credit balance
├── Revenue
│   └── Example: Sales Rs. 500,000 = Credit balance

Negative Values:
├── Asset with negative balance (unusual) = Credit balance
├── Liability with negative balance (unusual) = Debit balance
└── Used for contra accounts or adjustments

Note: opening_balance field stores absolute value with sign
      indicating normal balance direction for that account type.
```

### Opening Balance Entry Pattern

```
Opening Balance Journal Entry
═══════════════════════════════════════════════════════════

Date: January 1, 2026 (Opening Balance Date)
Description: Opening Balances - System Go-Live

DEBITS (Assets & Expenses):
1101  Cash on Hand                      50,000.00
1201  Commercial Bank - Main           250,000.00
1202  People's Bank - Payroll          100,000.00
1301  Trade Receivables - Local        350,000.00
1401  Finished Goods Inventory         500,000.00
1501  Office Equipment                 300,000.00
1502  Furniture & Fixtures             150,000.00
                                     ────────────
Total Debits                         1,700,000.00

CREDITS (Liabilities, Equity, Revenue):
2101  Trade Payables                   200,000.00
2201  VAT Payable                       35,000.00
2301  Bank Loan                        500,000.00
3001  Owner's Capital                  800,000.00
3101  Retained Earnings                165,000.00
                                     ────────────
Total Credits                        1,700,000.00
                                     ════════════
Balance Check: ✅ Debits = Credits
```

### Data Migration Process

```
Opening Balance Import Workflow
═══════════════════════════════════════════════════════════

Step 1: Export from Old System
├── Generate trial balance from previous system
├── As of specific date (e.g., Dec 31, 2025)
└── Verify balances are correct

Step 2: Map Accounts
├── Map old account codes to new chart of accounts
├── Consolidate or split accounts as needed
└── Document mapping decisions

Step 3: Prepare Import File
├── Create CSV/Excel with: code, opening_balance
├── Validate data format
└── Ensure double-entry balance

Step 4: Import Opening Balances
├── Run data migration script
├── Update opening_balance field for each account
├── Set opening_balance_date = Go-live date
└── Create opening balance journal entry

Step 5: Verify Import
├── Run trial balance report
├── Verify: Assets = Liabilities + Equity
├── Reconcile against old system totals
└── Investigate discrepancies

Step 6: Clear Suspense Account
├── Check 1999 - Opening Balance Adjustments
├── Should be zero if perfectly balanced
├── Investigate and correct any balance
└── Archive suspense account

Step 7: Lock Opening Period
├── Prevent backdated transactions before opening date
├── Document opening balances as baseline
└── Begin regular operations
```

### CSV Import Example

```
opening_balances_import.csv
═══════════════════════════════════════════════════════════

account_code,opening_balance,opening_balance_date
1101,50000.00,2026-01-01
1201,250000.00,2026-01-01
1202,100000.00,2026-01-01
1301,350000.00,2026-01-01
1401,500000.00,2026-01-01
1501,300000.00,2026-01-01
1502,150000.00,2026-01-01
2101,200000.00,2026-01-01
2201,35000.00,2026-01-01
2301,500000.00,2026-01-01
3001,800000.00,2026-01-01
3101,165000.00,2026-01-01
═══════════════════════════════════════════════════════════

Total Debits (Assets): 1,700,000.00
Total Credits (Liab + Equity): 1,700,000.00
Balance: ✅ OK
```

### Foreign Currency Opening Balances

```
Foreign Currency Account Opening Balances
═══════════════════════════════════════════════════════════

1251 - Commercial Bank - USD Account
├── Currency: USD
├── Opening Balance: 10,000.00 USD
├── Exchange Rate on Jan 1, 2026: 310.00 LKR/USD
└── Equivalent in LKR: 3,100,000.00 LKR

Note: Opening balance stored in account's currency (USD).
      LKR equivalent calculated for reporting purposes only.

Opening Balance Entry:
Dr: 1251 - Commercial Bank - USD    USD 10,000.00 (3,100,000 LKR)
Cr: 1999 - Opening Balance Adj      USD 10,000.00 (3,100,000 LKR)
```

### Opening Balance Validation Rules

```
Validation Rules
═══════════════════════════════════════════════════════════

Rule 1: Opening Balance Must Balance
├── Sum of Debit Balances = Sum of Credit Balances
└── Error if out of balance: "Opening balances do not balance"

Rule 2: Control Accounts Match Subsidiary
├── AR Control = Sum of Customer Balances
├── AP Control = Sum of Supplier Balances
└── Inventory Control = Sum of Product Values

Rule 3: Header Accounts Have No Opening Balance
├── If is_header=True, opening_balance should be 0
├── Header balance calculated from children
└── Warning: "Header accounts should not have opening balances"

Rule 4: System Accounts Reviewed
├── Opening balances for system accounts require approval
└── Warning: "Review opening balance for system account"

Rule 5: Date Consistency
├── All opening_balance_date should be same date
└── Error: "Opening balance dates are inconsistent"
```

### Expected Outcome
- Opening balance field to store starting balances
- Opening balance date to track effective date
- Support for data migration from old systems
- Double-entry validation of opening balances
- Proper handling of foreign currency balances
- Foundation for accurate reporting from day one
- Clear audit trail of starting position

### Verification Checklist
- [ ] opening_balance field added as DecimalField(20, 2)
- [ ] Default set to 0.00
- [ ] opening_balance_date field added as DateField
- [ ] Field marked as required for opening_balance
- [ ] Sign convention documented by account type
- [ ] Double-entry validation documented
- [ ] Data migration process documented
- [ ] CSV import example provided
- [ ] Suspense account usage explained
- [ ] Foreign currency handling documented

---

## Task 31: Add Account Current Balance

### Overview
Add a cached decimal field that stores the current running balance of the account, automatically updated by journal entry postings. This field provides fast balance lookups without summing all transactions and serves as the primary balance field for reporting. Current balance represents opening balance plus all posted transactions.

### Dependencies
- Task 30: Add Account Opening Balance
- Task 29: Add Account Currency
- Understanding of debit/credit mechanics

### Instructions

1. **Open account.py model file**
   - Continue in `apps/accounting/models/account.py`
   - Locate Account model class

2. **Add current_balance field**
   - Use DecimalField with same precision as opening_balance
   - Set max_digits=20, decimal_places=2
   - Default to 0.00
   - Mark as required (null=False)
   - Add database index for performance

3. **Document balance update logic**
   - Explain how current_balance is updated
   - Describe debit/credit impact by account type
   - Note that balance updates are transactional

4. **Add balance calculation methods**
   - Implement method to recalculate balance from transactions
   - Add balance verification method
   - Include balance history tracking considerations

5. **Document balance reporting**
   - Explain usage in trial balance
   - Note header account balance calculation
   - Describe balance sheet and P&L usage

6. **Add balance validation**
   - Consider overdraft detection for bank accounts
   - Warning for unusual balances (negative assets)
   - Reconciliation validation

### Current Balance Field Specifications

| Attribute | Value | Purpose |
|-----------|-------|---------|
| Field Type | DecimalField | High precision for currency |
| Max Digits | 20 | Up to 999,999,999,999,999,999.99 |
| Decimal Places | 2 | Standard currency precision |
| Default | 0.00 | Starting balance |
| Required | Yes | Every account has current balance |
| Indexed | Yes | Fast balance queries for reporting |

### Current Balance Concept

```
┌──────────────────────────────────────────────────────────┐
│              Current Balance Calculation                  │
├──────────────────────────────────────────────────────────┤
│                                                           │
│  Current Balance Formula:                                 │
│                                                           │
│    Current Balance = Opening Balance                      │
│                    + Sum of Debits                        │
│                    - Sum of Credits                       │
│                                                           │
│  For DEBIT balance accounts (Assets, Expenses):           │
│    • Debits INCREASE balance                              │
│    • Credits DECREASE balance                             │
│                                                           │
│  For CREDIT balance accounts (Liabilities, Equity, Rev):  │
│    • Credits INCREASE balance                             │
│    • Debits DECREASE balance                              │
│                                                           │
│  Implementation:                                          │
│    • Opening balance set during migration                 │
│    • Current balance updated with each transaction        │
│    • Cached for fast retrieval                            │
│    • Can be recalculated from transaction history         │
│                                                           │
└──────────────────────────────────────────────────────────┘
```

### Balance Calculation Examples

#### Asset Account (Debit Balance)
```
Account: 1201 - Commercial Bank - Main
Normal Balance: DEBIT (Asset)
═══════════════════════════════════════════════════════════

Date        Description              Debit      Credit    Balance
──────────────────────────────────────────────────────────────
01-Jan-26   Opening Balance                              250,000
05-Jan-26   Customer Payment        100,000               350,000
10-Jan-26   Supplier Payment                   50,000    300,000
15-Jan-26   Sales Receipt            75,000               375,000
20-Jan-26   Rent Payment                       30,000    345,000
31-Jan-26   Current Balance                              345,000
═══════════════════════════════════════════════════════════

Calculation:
Opening Balance:           250,000
Plus: Total Debits:        175,000 (100,000 + 75,000)
Minus: Total Credits:       80,000 (50,000 + 30,000)
Current Balance:           345,000 ✅
```

#### Liability Account (Credit Balance)
```
Account: 2101 - Trade Payables
Normal Balance: CREDIT (Liability)
═══════════════════════════════════════════════════════════

Date        Description              Debit      Credit    Balance
──────────────────────────────────────────────────────────────
01-Jan-26   Opening Balance                              200,000
08-Jan-26   Purchase Invoice                   50,000    250,000
12-Jan-26   Supplier Payment         30,000               220,000
18-Jan-26   Purchase Invoice                   75,000    295,000
25-Jan-26   Supplier Payment         50,000               245,000
31-Jan-26   Current Balance                              245,000
═══════════════════════════════════════════════════════════

Calculation:
Opening Balance:           200,000 (Cr)
Plus: Total Credits:       125,000 (50,000 + 75,000)
Minus: Total Debits:        80,000 (30,000 + 50,000)
Current Balance:           245,000 (Cr) ✅
```

#### Revenue Account (Credit Balance)
```
Account: 4001 - Product Sales - Local
Normal Balance: CREDIT (Revenue)
═══════════════════════════════════════════════════════════

Date        Description              Debit      Credit    Balance
──────────────────────────────────────────────────────────────
01-Jan-26   Opening Balance                                    0
05-Jan-26   Sales Invoice #101                 50,000     50,000
10-Jan-26   Sales Invoice #102                 75,000    125,000
15-Jan-26   Sales Return             5,000                120,000
20-Jan-26   Sales Invoice #103                100,000    220,000
31-Jan-26   Current Balance                              220,000
═══════════════════════════════════════════════════════════

Calculation:
Opening Balance:                 0
Plus: Total Credits:       225,000 (50,000 + 75,000 + 100,000)
Minus: Total Debits:         5,000 (Sales Return)
Current Balance:           220,000 (Cr) ✅
```

### Balance Update Logic

```
Transaction Posting Balance Update
═══════════════════════════════════════════════════════════

Transaction: Customer Payment Received
Date: January 15, 2026
Amount: Rs. 100,000

Journal Entry:
Dr: 1201 - Commercial Bank        100,000
Cr: 1301 - Trade Receivables      100,000

Balance Updates:

Account 1201 (Bank - DEBIT account):
├── Before: current_balance = 250,000
├── Transaction: +100,000 (Debit)
└── After: current_balance = 350,000 ✅

Account 1301 (Receivables - DEBIT account):
├── Before: current_balance = 350,000
├── Transaction: -100,000 (Credit)
└── After: current_balance = 250,000 ✅

Implementation (Pseudo-code):

def post_transaction(transaction):
    for line in transaction.lines:
        account = line.account
        
        if line.type == 'DEBIT':
            if account.normal_balance == 'DEBIT':
                account.current_balance += line.amount
            else:  # Credit normal balance
                account.current_balance -= line.amount
        
        else:  # CREDIT line
            if account.normal_balance == 'CREDIT':
                account.current_balance += line.amount
            else:  # Debit normal balance
                account.current_balance -= line.amount
        
        account.save()
```

### Balance Verification and Recalculation

```
Balance Recalculation Method
═══════════════════════════════════════════════════════════

Purpose: Verify cached balance matches transaction history

def recalculate_balance(self):
    """
    Recalculates balance from opening balance and all transactions.
    Returns the calculated balance for comparison.
    """
    from apps.accounting.models import JournalEntryLine
    
    # Start with opening balance
    balance = self.opening_balance
    
    # Get all posted transactions for this account
    transactions = JournalEntryLine.objects.filter(
        account=self,
        journal_entry__status='POSTED',
        journal_entry__date__gte=self.opening_balance_date
    )
    
    # Apply each transaction
    for line in transactions.order_by('journal_entry__date', 'id'):
        if line.type == 'DEBIT':
            if self.account_type.normal_balance == 'DEBIT':
                balance += line.amount
            else:
                balance -= line.amount
        else:  # CREDIT
            if self.account_type.normal_balance == 'CREDIT':
                balance += line.amount
            else:
                balance -= line.amount
    
    return balance

def verify_balance(self):
    """
    Verifies current_balance matches calculated balance.
    Returns True if matched, False if discrepancy found.
    """
    calculated = self.recalculate_balance()
    return abs(self.current_balance - calculated) < 0.01  # Allow 1¢ rounding

def fix_balance(self):
    """
    Recalculates and updates current_balance.
    Use when balance verification fails.
    """
    self.current_balance = self.recalculate_balance()
    self.save()
```

### Balance Queries for Reporting

```
Trial Balance Query
═══════════════════════════════════════════════════════════

# Get all accounts with non-zero balances
accounts = Account.objects.filter(
    tenant=tenant,
    is_header=False,  # Detail accounts only
    status='ACTIVE'
).exclude(
    current_balance=0
).order_by('code')

# Separate debits and credits
debit_accounts = [acc for acc in accounts 
                  if acc.current_balance > 0]
credit_accounts = [acc for acc in accounts 
                   if acc.current_balance < 0]

# Calculate totals
total_debits = sum(acc.current_balance for acc in debit_accounts)
total_credits = sum(abs(acc.current_balance) for acc in credit_accounts)

# Verify balance
assert total_debits == total_credits, "Trial Balance does not balance!"
```

### Balance Sheet Query
```
Balance Sheet Asset Query
═══════════════════════════════════════════════════════════

# Get all asset accounts
assets = Account.objects.filter(
    tenant=tenant,
    account_type__type_code=1,  # Assets
    status='ACTIVE'
).select_related('account_type', 'currency')

# Calculate by category
current_assets = assets.filter(
    category='CURRENT_ASSET'
).aggregate(total=Sum('current_balance'))['total']

fixed_assets = assets.filter(
    category='FIXED_ASSET'
).aggregate(total=Sum('current_balance'))['total']

total_assets = current_assets + fixed_assets
```

### Header Account Balance Calculation

```
Header Account Balance (Calculated from Children)
═══════════════════════════════════════════════════════════

1200 - Bank Accounts [HEADER]
├── current_balance field ignored (should be 0)
└── Balance calculated from children:

    1201 - Commercial Bank         250,000
    1202 - People's Bank            150,000
    1203 - Sampath Bank             200,000
    ─────────────────────────────────────
    1200 - Bank Accounts Total      600,000

Implementation:

@property
def effective_balance(self):
    """
    Returns balance for reporting.
    If header, calculates from children.
    If detail, returns current_balance.
    """
    if self.is_header:
        # Calculate from descendants
        return self.get_descendants().aggregate(
            total=Sum('current_balance')
        )['total'] or 0
    return self.current_balance
```

### Balance Alerts and Warnings

```
Balance Validation Rules
═══════════════════════════════════════════════════════════

Warning 1: Negative Asset Balance
├── Account Type: Asset
├── Current Balance: Negative
└── Alert: "Unusual negative balance for asset account"

Warning 2: Overdraft Detection
├── Account: Bank Account
├── Current Balance: < 0
└── Alert: "Bank account overdrawn: Rs. {amount}"

Warning 3: Unusual Credit Balance
├── Account Type: Asset (normally debit)
├── Current Balance: Negative
└── Alert: "Asset account has credit balance"

Warning 4: Large Balance Change
├── Change: > 50% from previous month
└── Alert: "Significant balance change detected"

Warning 5: Inactive Account with Balance
├── Status: INACTIVE
├── Current Balance: != 0
└── Alert: "Inactive account has non-zero balance"
```

### Balance History Tracking

```
Balance History (Optional Enhancement)
═══════════════════════════════════════════════════════════

Purpose: Track balance changes over time for audit/analysis

AccountBalanceHistory Model:
├── account (ForeignKey)
├── balance_date (DateField)
├── opening_balance (DecimalField)
├── period_debits (DecimalField)
├── period_credits (DecimalField)
├── closing_balance (DecimalField)
└── created_at (DateTimeField)

Use Cases:
• Month-end balance snapshots
• Comparative balance reports
• Balance trend analysis
• Audit trail of balance changes
• Year-over-year comparisons

Implementation: Create balance snapshot during period close
```

### Multi-Currency Balance Reporting

```
Foreign Currency Balance Display
═══════════════════════════════════════════════════════════

Account: 1251 - Commercial Bank - USD
Currency: USD
Current Balance: 5,000.00 USD

Reporting:
├── Native Currency: 5,000.00 USD
├── Exchange Rate (31-Dec-26): 320.00 LKR/USD
└── Reporting Currency: 1,600,000.00 LKR

Trial Balance Display:
Code  Account Name              Currency  Balance    LKR Equiv
────────────────────────────────────────────────────────────
1201  Commercial Bank - Main    LKR       250,000    250,000
1251  Commercial Bank - USD     USD         5,000  1,600,000
1252  HSBC - USD Trade          USD        15,000  4,800,000
1253  Sampath Bank - EUR        EUR         2,000    760,000

Note: current_balance always stored in account's currency.
      LKR equivalent calculated for consolidated reporting.
```

### Expected Outcome
- Cached current balance for fast reporting
- Automatic balance updates with transactions
- Balance recalculation and verification methods
- Support for trial balance generation
- Header account balance calculation from children
- Balance alerts for unusual situations
- Foundation for financial statements
- Audit trail of balance changes

### Verification Checklist
- [ ] current_balance field added as DecimalField(20, 2)
- [ ] Default set to 0.00
- [ ] Database index created for performance
- [ ] Balance update logic documented
- [ ] Recalculation method designed
- [ ] Verification method designed
- [ ] Query patterns for reporting documented
- [ ] Header account balance calculation explained
- [ ] Balance validation rules defined
- [ ] Multi-currency balance handling documented

---

## Task 32: Add Account Timestamps

### Overview
Add timestamp fields to track account creation and modification dates for audit purposes. These fields may be inherited from a base model (TimestampMixin) or explicitly added if not using mixins. Timestamps provide essential audit trail information and support change tracking.

### Dependencies
- Task 18: Create Account Model
- Base model mixins configured (if using)

### Instructions

1. **Verify existing timestamp fields**
   - Check if Account inherits from TimestampMixin or base model
   - Determine if created_at and updated_at already exist
   - If inherited, document the inheritance

2. **Add timestamps if not inherited**
   - If not using mixins, add created_at field (DateTimeField, auto_now_add=True)
   - Add updated_at field (DateTimeField, auto_now=True)
   - Add created_by field (ForeignKey to User, optional)
   - Add updated_by field (ForeignKey to User, optional)

3. **Configure automatic timestamp updates**
   - Ensure auto_now_add for created_at
   - Ensure auto_now for updated_at
   - Consider using Django signals for user tracking

4. **Document timestamp usage**
   - Explain audit trail purpose
   - Note automatic updates on save
   - Describe timezone handling

5. **Add timestamp queries**
   - Document how to query recently created accounts
   - Show how to track account modifications
   - Explain audit report generation

### Timestamp Field Specifications

| Field | Type | Purpose | Auto-Update |
|-------|------|---------|-------------|
| created_at | DateTimeField | Account creation date/time | auto_now_add=True |
| updated_at | DateTimeField | Last modification date/time | auto_now=True |
| created_by | ForeignKey(User) | User who created account | Manual/Signal |
| updated_by | ForeignKey(User) | User who last modified | Manual/Signal |

### TimestampMixin Pattern

```
Using Base Mixin (Recommended)
═══════════════════════════════════════════════════════════

# apps/core/models/base.py
class TimestampMixin(models.Model):
    """
    Abstract base model that adds timestamp fields.
    """
    created_at = models.DateTimeField(
        auto_now_add=True,
        help_text="Date and time when record was created"
    )
    updated_at = models.DateTimeField(
        auto_now=True,
        help_text="Date and time when record was last updated"
    )
    
    class Meta:
        abstract = True

# apps/accounting/models/account.py
class Account(MPTTModel, TenantAwareMixin, TimestampMixin):
    """
    Account model inherits timestamp fields from TimestampMixin
    """
    # Other fields...
    pass

Result:
✓ created_at and updated_at automatically included
✓ Consistent across all models using the mixin
✓ DRY principle maintained
```

### Explicit Timestamp Fields

```
Adding Timestamps Directly (If Not Using Mixin)
═══════════════════════════════════════════════════════════

class Account(MPTTModel, TenantAwareMixin):
    # ... other fields ...
    
    # Timestamp fields
    created_at = models.DateTimeField(
        auto_now_add=True,
        db_index=True,
        help_text="Date and time when account was created"
    )
    
    updated_at = models.DateTimeField(
        auto_now=True,
        db_index=True,
        help_text="Date and time when account was last modified"
    )
    
    created_by = models.ForeignKey(
        'users.User',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='created_accounts',
        help_text="User who created this account"
    )
    
    updated_by = models.ForeignKey(
        'users.User',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='updated_accounts',
        help_text="User who last modified this account"
    )
```

### Automatic Timestamp Behavior

```
Timestamp Auto-Update Behavior
═══════════════════════════════════════════════════════════

CREATE Operation:
├── created_at: Set to current timestamp
├── updated_at: Set to current timestamp (same as created_at)
├── created_by: Set to current user (if tracked)
└── updated_by: Set to current user (if tracked)

UPDATE Operation:
├── created_at: Unchanged (immutable)
├── updated_at: Updated to current timestamp
├── created_by: Unchanged (immutable)
└── updated_by: Updated to current user (if tracked)

Example:

# Create new account
account = Account.objects.create(
    code=1205,
    name="New Bank Account",
    tenant=tenant
)
# created_at = 2026-01-15 10:30:00
# updated_at = 2026-01-15 10:30:00

# Later, update account
account.name = "Updated Bank Account"
account.save()
# created_at = 2026-01-15 10:30:00 (unchanged)
# updated_at = 2026-01-20 14:45:00 (updated)
```

### Timezone Handling

```
Timestamp Timezone Configuration
═══════════════════════════════════════════════════════════

Django Settings (settings.py):
├── USE_TZ = True  # Enable timezone support
├── TIME_ZONE = 'Asia/Colombo'  # Sri Lanka timezone
└── All datetimes stored in UTC, displayed in local timezone

Storage:
├── Database: Timestamps stored as UTC
└── Example: 2026-01-15 05:00:00 UTC

Display:
├── Application: Converted to Asia/Colombo
└── Example: 2026-01-15 10:30:00 +0530 (Colombo time)

Query Filtering:
from django.utils import timezone

# Current time in UTC
now = timezone.now()

# Filter accounts created today (Colombo time)
today_start = timezone.now().replace(hour=0, minute=0, second=0)
today_accounts = Account.objects.filter(
    created_at__gte=today_start
)
```

### Audit Trail Queries

```
Timestamp-Based Queries
═══════════════════════════════════════════════════════════

Query 1: Recently Created Accounts
accounts = Account.objects.filter(
    tenant=tenant,
    created_at__gte=timezone.now() - timedelta(days=7)
).order_by('-created_at')

Query 2: Recently Modified Accounts
accounts = Account.objects.filter(
    tenant=tenant,
    updated_at__gte=timezone.now() - timedelta(days=1)
).order_by('-updated_at')

Query 3: Accounts Not Modified in Long Time
stale_accounts = Account.objects.filter(
    tenant=tenant,
    updated_at__lte=timezone.now() - timedelta(days=365)
)

Query 4: Accounts Created in Date Range
accounts = Account.objects.filter(
    tenant=tenant,
    created_at__range=[start_date, end_date]
)

Query 5: Accounts by Creator
accounts = Account.objects.filter(
    tenant=tenant,
    created_by=user
).order_by('-created_at')
```

### Audit Report Example

```
ACCOUNT CREATION AUDIT REPORT
Period: January 1-31, 2026
═══════════════════════════════════════════════════════════

Date       Time     Code  Account Name           Created By
──────────────────────────────────────────────────────────
01-Jan-26  09:00    1000  Assets                 System
01-Jan-26  09:01    1100  Current Assets         System
01-Jan-26  09:02    1201  Commercial Bank        System
15-Jan-26  14:30    1205  New Bank Account       J. Silva
20-Jan-26  10:15    4105  Special Sales          S. Fernando
25-Jan-26  16:45    6105  Marketing Expense      J. Silva
═══════════════════════════════════════════════════════════

Total Accounts Created: 6
Created by System: 3
Created by Users: 3
```

```
ACCOUNT MODIFICATION AUDIT REPORT
Period: January 1-31, 2026
═══════════════════════════════════════════════════════════

Date       Time     Code  Account Name           Modified By
──────────────────────────────────────────────────────────
05-Jan-26  11:20    1201  Commercial Bank        S. Fernando
15-Jan-26  14:30    1205  New Bank Account       J. Silva
20-Jan-26  10:15    1201  Commercial Bank        J. Silva
═══════════════════════════════════════════════════════════

Changes by User:
├── J. Silva: 2 modifications
└── S. Fernando: 1 modification
```

### User Tracking with Signals

```
Automatic User Tracking (Optional Enhancement)
═══════════════════════════════════════════════════════════

# apps/accounting/signals.py
from django.db.models.signals import pre_save
from django.dispatch import receiver
from .models import Account
from threading import local

_user = local()

class CurrentUserMiddleware:
    """Middleware to capture current user"""
    def __init__(self, get_response):
        self.get_response = get_response
    
    def __call__(self, request):
        _user.value = getattr(request, 'user', None)
        return self.get_response(request)

@receiver(pre_save, sender=Account)
def update_account_user(sender, instance, **kwargs):
    """Automatically set created_by and updated_by"""
    user = getattr(_user, 'value', None)
    if user and user.is_authenticated:
        if not instance.pk:  # New record
            instance.created_by = user
        instance.updated_by = user
```

### Change Log Table (Advanced)

```
Account Change Log (Optional Enhancement)
═══════════════════════════════════════════════════════════

Purpose: Detailed audit trail of all account changes

AccountChangeLog Model:
├── account (ForeignKey)
├── change_date (DateTimeField)
├── changed_by (ForeignKey to User)
├── change_type (CharField: CREATE, UPDATE, DELETE)
├── field_name (CharField)
├── old_value (TextField)
├── new_value (TextField)
└── ip_address (GenericIPAddressField)

Example Log Entries:
┌────────────────────────────────────────────────────┐
│ Date: 2026-01-15 14:30:00                          │
│ Account: 1201 - Commercial Bank                    │
│ Changed By: J. Silva                               │
│ Change Type: UPDATE                                │
│ Field: name                                        │
│ Old Value: Commercial Bank - Branch 1              │
│ New Value: Commercial Bank - Main Account          │
│ IP Address: 192.168.1.100                          │
└────────────────────────────────────────────────────┘
```

### Expected Outcome
- Automatic creation timestamp on new accounts
- Automatic update timestamp on modifications
- Optional user tracking for audit compliance
- Timezone-aware datetime storage
- Query capabilities for audit reports
- Foundation for change tracking and compliance
- Support for audit trail requirements

### Verification Checklist
- [ ] Timestamp fields exist (inherited or explicit)
- [ ] created_at with auto_now_add=True
- [ ] updated_at with auto_now=True
- [ ] Timezone configuration set (USE_TZ=True)
- [ ] Database indexes on timestamp fields (optional)
- [ ] created_by and updated_by fields (optional)
- [ ] User tracking mechanism (if required)
- [ ] Audit query examples documented
- [ ] Timezone handling documented

---

## Task 33: Run Account Migrations

### Overview
Generate and execute Django database migrations to create the Account table with all defined fields, indexes, and constraints. This task translates the Account model definition into actual database schema changes, creating the physical table structure in PostgreSQL within the tenant schema.

### Dependencies
- All previous tasks in Group B completed
- Account model fully defined with all fields
- Database connection configured
- django-tenants schema migration support configured

### Instructions

1. **Verify model completeness**
   - Review Account model for all required fields
   - Ensure all foreign keys properly defined
   - Check all field validators and constraints
   - Verify Meta class configuration

2. **Generate migration file**
   - Run: python manage.py makemigrations accounting
   - Review generated migration file
   - Verify migration operations are correct
   - Check for any warnings or errors

3. **Review migration dependencies**
   - Ensure migration dependencies are correct
   - Verify AccountTypeConfig migration exists (from Group A)
   - Check Currency model migration exists
   - Confirm Tenant model migration exists

4. **Run migration**
   - For public schema: python manage.py migrate_schemas --schema=public
   - For tenant schemas: python manage.py migrate_schemas
   - Or: python manage.py migrate (if not using django-tenants)
   - Verify migration applied successfully

5. **Verify database schema**
   - Connect to database and inspect account table
   - Verify all columns created correctly
   - Check indexes are in place
   - Confirm foreign key constraints exist

6. **Test model in Django shell**
   - Create test account instance
   - Verify all fields work correctly
   - Test MPTT tree operations
   - Confirm relationships function properly

### Migration Generation Command

```
Generate Migration
═══════════════════════════════════════════════════════════

Command:
$ python manage.py makemigrations accounting

Expected Output:
Migrations for 'accounting':
  accounting/migrations/0002_account.py
    - Create model Account
    - Add index on Account fields
    - Add unique constraint on (tenant, code)

Files Created:
apps/accounting/migrations/0002_account.py
```

### Migration File Structure

```
Migration File Example
═══════════════════════════════════════════════════════════

# apps/accounting/migrations/0002_account.py

from django.db import migrations, models
import django.db.models.deletion
import mptt.fields

class Migration(migrations.Migration):

    dependencies = [
        ('accounting', '0001_initial'),  # AccountTypeConfig
        ('currency', '0001_initial'),    # Currency model
        ('tenants', '0001_initial'),     # Tenant model
    ]

    operations = [
        migrations.CreateModel(
            name='Account',
            fields=[
                ('id', models.BigAutoField(...)),
                
                # Core fields
                ('code', models.PositiveIntegerField(...)),
                ('name', models.CharField(max_length=200, ...)),
                ('category', models.CharField(max_length=50, ...)),
                ('status', models.CharField(max_length=20, ...)),
                ('description', models.TextField(...)),
                
                # Hierarchy fields
                ('lft', models.PositiveIntegerField(...)),
                ('rght', models.PositiveIntegerField(...)),
                ('tree_id', models.PositiveIntegerField(...)),
                ('level', models.PositiveIntegerField(...)),
                
                # Flags
                ('is_header', models.BooleanField(default=False)),
                ('is_system', models.BooleanField(default=False)),
                
                # Balance fields
                ('opening_balance', models.DecimalField(...)),
                ('opening_balance_date', models.DateField(...)),
                ('current_balance', models.DecimalField(...)),
                
                # Timestamps
                ('created_at', models.DateTimeField(...)),
                ('updated_at', models.DateTimeField(...)),
                
                # Foreign keys
                ('tenant', models.ForeignKey(...)),
                ('account_type', models.ForeignKey(...)),
                ('currency', models.ForeignKey(...)),
                ('parent', mptt.fields.TreeForeignKey(...)),
            ],
            options={
                'verbose_name': 'Account',
                'verbose_name_plural': 'Accounts',
                'ordering': ['tree_id', 'lft'],
            },
        ),
        
        migrations.AddIndex(
            model_name='account',
            index=models.Index(fields=['code'], name='...'),
        ),
        
        migrations.AddConstraint(
            model_name='account',
            constraint=models.UniqueConstraint(
                fields=['tenant', 'code'], name='...'
            ),
        ),
    ]
```

### Running Migrations

```
Migration Execution
═══════════════════════════════════════════════════════════

Option 1: Standard Django (No Tenancy)
$ python manage.py migrate accounting

Option 2: Django-Tenants (Public Schema)
$ python manage.py migrate_schemas --schema=public accounting

Option 3: Django-Tenants (All Tenant Schemas)
$ python manage.py migrate_schemas accounting

Option 4: Django-Tenants (Specific Tenant)
$ python manage.py migrate_schemas --schema=tenant_acme accounting

Expected Output:
Running migrations:
  Applying accounting.0002_account... OK
```

### Database Schema Verification

```
PostgreSQL Schema Inspection
═══════════════════════════════════════════════════════════

-- Connect to database
psql -U postgres -d pos_erp

-- Switch to tenant schema (if using django-tenants)
SET search_path TO tenant_demo;

-- List tables
\dt

-- Describe account table
\d+ accounting_account

Expected Structure:
                                  Table "tenant_demo.accounting_account"
 Column                | Type                  | Nullable | Default
-----------------------+-----------------------+----------+----------
 id                    | bigint                | not null | 
 code                  | integer               | not null | 
 name                  | character varying(200)| not null | 
 category              | character varying(50) |          | 
 status                | character varying(20) | not null | 
 description           | text                  |          | 
 is_header             | boolean               | not null | false
 is_system             | boolean               | not null | false
 opening_balance       | numeric(20,2)         | not null | 0.00
 opening_balance_date  | date                  |          | 
 current_balance       | numeric(20,2)         | not null | 0.00
 created_at            | timestamp with tz     | not null | 
 updated_at            | timestamp with tz     | not null | 
 lft                   | integer               | not null | 
 rght                  | integer               | not null | 
 tree_id               | integer               | not null | 
 level                 | integer               | not null | 
 tenant_id             | bigint                | not null | 
 account_type_id       | bigint                | not null | 
 currency_id           | bigint                |          | 
 parent_id             | bigint                |          | 
Indexes:
    "accounting_account_pkey" PRIMARY KEY, btree (id)
    "accounting_account_code_idx" btree (code)
    "accounting_account_tenant_code_uniq" UNIQUE (tenant_id, code)
    "accounting_account_tree_id_idx" btree (tree_id)
Foreign-key constraints:
    "fk_account_tenant" FOREIGN KEY (tenant_id) 
        REFERENCES tenants_tenant(id)
    "fk_account_type" FOREIGN KEY (account_type_id) 
        REFERENCES accounting_accounttypeconfig(id) ON DELETE PROTECT
    "fk_account_currency" FOREIGN KEY (currency_id) 
        REFERENCES currency_currency(id) ON DELETE PROTECT
    "fk_account_parent" FOREIGN KEY (parent_id) 
        REFERENCES accounting_account(id) ON DELETE PROTECT
```

### Django Shell Testing

```
Model Testing in Django Shell
═══════════════════════════════════════════════════════════

$ python manage.py shell

# Import models
>>> from apps.accounting.models import Account, AccountTypeConfig
>>> from apps.tenants.models import Tenant
>>> from apps.currency.models import Currency

# Get tenant
>>> tenant = Tenant.objects.first()

# Get account type
>>> asset_type = AccountTypeConfig.objects.get(
...     tenant=tenant, type_code=1
... )

# Get currency
>>> lkr = Currency.objects.get(code='LKR')

# Create root account
>>> assets = Account.objects.create(
...     tenant=tenant,
...     code=1000,
...     name="Assets",
...     account_type=asset_type,
...     is_header=True
... )
>>> print(assets)
1000 - Assets

# Create child account
>>> cash = Account.objects.create(
...     tenant=tenant,
...     code=1101,
...     name="Cash on Hand",
...     account_type=asset_type,
...     parent=assets,
...     opening_balance=50000.00
... )

# Test MPTT methods
>>> assets.get_children()
<QuerySet [<Account: 1101 - Cash on Hand>]>

>>> cash.get_ancestors()
<QuerySet [<Account: 1000 - Assets>]>

>>> cash.get_root()
<Account: 1000 - Assets>

# Test currency
>>> cash.effective_currency
<Currency: LKR>

# Test balance update
>>> cash.current_balance = 60000.00
>>> cash.save()

Success! ✅ Model working correctly
```

### Common Migration Issues

```
Troubleshooting Migration Problems
═══════════════════════════════════════════════════════════

Issue 1: Dependency Error
Error: "Migration accounting.0002 depends on nonexistent node"
Solution: 
  - Check migration dependencies
  - Ensure AccountTypeConfig migration exists
  - Run migrations in correct order

Issue 2: Column Already Exists
Error: "column 'code' of relation 'accounting_account' already exists"
Solution:
  - Migration already applied
  - Check migration status: python manage.py showmigrations
  - If needed, fake migration: python manage.py migrate --fake

Issue 3: Foreign Key Constraint Fails
Error: "violates foreign key constraint"
Solution:
  - Ensure referenced models exist
  - Run migrations for dependent apps first
  - Check data integrity

Issue 4: Unique Constraint Violation
Error: "duplicate key value violates unique constraint"
Solution:
  - Check for existing data
  - May need data migration to clean duplicates
  - Adjust migration order

Issue 5: MPTT Fields Missing
Error: "no such column: lft"
Solution:
  - Ensure MPTTModel is inherited
  - Run makemigrations to capture MPTT fields
  - Rebuild tree: Account.objects.rebuild()
```

### Migration Rollback

```
Rolling Back Migration (If Needed)
═══════════════════════════════════════════════════════════

Rollback to Previous Migration:
$ python manage.py migrate accounting 0001_initial

This will:
├── Drop accounting_account table
├── Remove indexes
├── Remove constraints
└── Revert to state before 0002_account

Use Cases:
• Need to modify model before migration
• Migration caused errors
• Testing migration changes

Note: Be careful with rollback on production!
      May result in data loss.
```

### Post-Migration Verification Checklist

```
Verification Checklist
═══════════════════════════════════════════════════════════

Database Level:
☐ Table accounting_account exists
☐ All columns present and correct types
☐ Primary key constraint in place
☐ Unique constraint on (tenant_id, code)
☐ Foreign key constraints to:
  ☐ tenants_tenant
  ☐ accounting_accounttypeconfig
  ☐ currency_currency
  ☐ accounting_account (self-reference for parent)
☐ Indexes created:
  ☐ On code field
  ☐ On tree_id (MPTT)
  ☐ On lft, rght (MPTT)

Django Level:
☐ Model can be imported successfully
☐ Can create account instances
☐ MPTT methods work (get_children, get_ancestors)
☐ Foreign key relationships function
☐ Validation rules work
☐ Model appears in Django admin (if registered)

Tenant Schema Level (if using django-tenants):
☐ Table exists in public schema (if SharedModel)
☐ Table exists in tenant schemas (if TenantModel)
☐ Schema routing works correctly
☐ Can query accounts per tenant
```

### Expected Outcome
- Database table accounting_account created successfully
- All fields, indexes, and constraints in place
- MPTT tree structure fields configured
- Foreign key relationships established
- Model functional and testable in Django shell
- Foundation ready for account creation and management
- Schema properly isolated per tenant (if using multi-tenancy)

### Verification Checklist
- [ ] makemigrations executed successfully
- [ ] Migration file generated and reviewed
- [ ] Dependencies correct in migration
- [ ] migrate command executed without errors
- [ ] Database table exists with correct schema
- [ ] All columns, indexes, constraints verified
- [ ] Foreign keys properly constrained
- [ ] MPTT fields present (tree_id, level, lft, rght)
- [ ] Test account created in Django shell
- [ ] MPTT tree operations tested
- [ ] Model ready for use

---

## Task 34: Add Account Model Constraints

### Overview
Add database-level constraints and indexes to enforce data integrity, improve query performance, and implement business rules at the database level. Constraints include unique constraints, check constraints, and additional indexes beyond those automatically created by field definitions.

### Dependencies
- Task 33: Run Account Migrations
- Account table created in database
- All fields defined and migrated

### Instructions

1. **Review required constraints**
   - Identify business rules to enforce at database level
   - Determine unique constraints needed
   - Define check constraints for validation
   - Plan indexes for query optimization

2. **Add unique constraints**
   - Unique on (tenant, code) - already in Meta
   - Consider unique on (tenant, name) for better UX (optional)
   - Ensure constraints respect tenant isolation

3. **Add check constraints**
   - Balance field validation (optional)
   - Code range validation (optional)
   - Status field validation
   - Ensure valid enum values

4. **Add indexes for performance**
   - Index on status for filtering
   - Index on is_header for queries
   - Index on is_system for admin queries
   - Compound indexes for common query patterns

5. **Create constraint migration**
   - Generate new migration for constraints
   - Review migration operations
   - Test migration on development database

6. **Document constraints**
   - List all constraints and their purpose
   - Explain business rules enforced
   - Note performance impact of indexes

### Constraint Types

```
┌──────────────────────────────────────────────────────────┐
│              Database Constraint Types                    │
├──────────────────────────────────────────────────────────┤
│                                                           │
│  UNIQUE CONSTRAINTS:                                      │
│    • Ensure no duplicate values                           │
│    • Example: (tenant, code) must be unique               │
│    • Enforced at database level                           │
│                                                           │
│  CHECK CONSTRAINTS:                                       │
│    • Validate field values against conditions             │
│    • Example: code >= 1000 AND code <= 9999               │
│    • Prevent invalid data insertion                       │
│                                                           │
│  FOREIGN KEY CONSTRAINTS:                                 │
│    • Ensure referential integrity                         │
│    • Example: account_type_id must exist                  │
│    • Prevent orphaned records                             │
│                                                           │
│  NOT NULL CONSTRAINTS:                                    │
│    • Ensure required fields have values                   │
│    • Example: code, name cannot be null                   │
│    • Enforced by field definition                         │
│                                                           │
│  INDEXES:                                                 │
│    • Improve query performance                            │
│    • Example: Index on status field                       │
│    • Speed up WHERE and JOIN operations                   │
│                                                           │
└──────────────────────────────────────────────────────────┘
```

### Unique Constraints

```
Unique Constraint Definitions
═══════════════════════════════════════════════════════════

class Account(MPTTModel, ...):
    # ... fields ...
    
    class Meta:
        # Unique constraints
        unique_together = [
            ['tenant', 'code'],  # Code unique per tenant
        ]
        
        # Alternative (Django 2.2+)
        constraints = [
            models.UniqueConstraint(
                fields=['tenant', 'code'],
                name='unique_account_code_per_tenant'
            ),
        ]

Purpose: Prevents duplicate account codes within same tenant

Database Level:
ALTER TABLE accounting_account 
ADD CONSTRAINT unique_account_code_per_tenant 
UNIQUE (tenant_id, code);

Violation Example:
Tenant A already has account code 1201
Attempt to create another account code 1201 for Tenant A
Result: IntegrityError - duplicate key violates unique constraint
```

### Check Constraints

```
Check Constraint Examples
═══════════════════════════════════════════════════════════

1. Code Range Constraint
   Ensure code is within valid range (1000-9999)

class Meta:
    constraints = [
        models.CheckConstraint(
            check=models.Q(code__gte=1000) & models.Q(code__lte=9999),
            name='account_code_range'
        ),
    ]

2. Status Valid Values Constraint
   Ensure status is one of allowed values

class Meta:
    constraints = [
        models.CheckConstraint(
            check=models.Q(
                status__in=['ACTIVE', 'INACTIVE', 'ARCHIVED']
            ),
            name='account_status_valid'
        ),
    ]

3. Opening Balance Date Constraint (Optional)
   Ensure opening balance date not in future

class Meta:
    constraints = [
        models.CheckConstraint(
            check=models.Q(
                opening_balance_date__lte=models.functions.Now()
            ),
            name='opening_balance_date_not_future'
        ),
    ]

4. Header Account Parent Constraint (Optional)
   Ensure header accounts have parent (except root)

class Meta:
    constraints = [
        models.CheckConstraint(
            check=models.Q(is_header=False) | models.Q(level__gt=0),
            name='header_must_have_parent_if_not_root'
        ),
    ]

Note: Check constraints supported in PostgreSQL and Django 2.2+
```

### Performance Indexes

```
Index Definitions for Query Optimization
═══════════════════════════════════════════════════════════

class Meta:
    indexes = [
        # Single-column indexes
        models.Index(fields=['code'], name='idx_account_code'),
        models.Index(fields=['status'], name='idx_account_status'),
        models.Index(fields=['is_header'], name='idx_account_is_header'),
        models.Index(fields=['is_system'], name='idx_account_is_system'),
        models.Index(fields=['category'], name='idx_account_category'),
        
        # Multi-column (compound) indexes
        models.Index(
            fields=['tenant', 'status', 'is_header'],
            name='idx_account_tenant_status_header'
        ),
        models.Index(
            fields=['tenant', 'account_type'],
            name='idx_account_tenant_type'
        ),
        models.Index(
            fields=['tenant', 'parent'],
            name='idx_account_tenant_parent'
        ),
        
        # Timestamp indexes for audit queries
        models.Index(fields=['created_at'], name='idx_account_created_at'),
        models.Index(fields=['updated_at'], name='idx_account_updated_at'),
    ]

Index Purpose:
├── Single-column: Fast filtering on individual fields
├── Compound: Optimize queries with multiple WHERE conditions
└── Order: Column order matters (most selective first)
```

### Index Usage Examples

```
Query Performance with Indexes
═══════════════════════════════════════════════════════════

Query 1: Active Accounts (Uses idx_account_status)
Account.objects.filter(status='ACTIVE')
Index Hit: idx_account_status
Performance: Fast ✅

Query 2: Tenant's Active Detail Accounts (Uses compound index)
Account.objects.filter(
    tenant=tenant,
    status='ACTIVE',
    is_header=False
)
Index Hit: idx_account_tenant_status_header
Performance: Very Fast ✅

Query 3: Recently Created Accounts (Uses idx_account_created_at)
Account.objects.filter(
    created_at__gte=one_week_ago
).order_by('-created_at')
Index Hit: idx_account_created_at
Performance: Fast ✅

Query 4: Accounts by Type (Uses idx_account_tenant_type)
Account.objects.filter(
    tenant=tenant,
    account_type__type_code=1  # Assets
)
Index Hit: idx_account_tenant_type
Performance: Fast ✅
```

### Complete Meta Class Example

```
Full Meta Class with Constraints and Indexes
═══════════════════════════════════════════════════════════

class Account(MPTTModel, TenantAwareMixin, TimestampMixin):
    # ... all fields defined above ...
    
    class Meta:
        verbose_name = "Account"
        verbose_name_plural = "Accounts"
        
        # Ordering
        ordering = ['tree_id', 'lft']  # MPTT tree order
        
        # Unique constraints
        constraints = [
            # Unique account code per tenant
            models.UniqueConstraint(
                fields=['tenant', 'code'],
                name='unique_account_code_per_tenant'
            ),
            
            # Check: Code in valid range
            models.CheckConstraint(
                check=models.Q(code__gte=1000) & models.Q(code__lte=9999),
                name='account_code_valid_range'
            ),
            
            # Check: Status is valid
            models.CheckConstraint(
                check=models.Q(
                    status__in=['ACTIVE', 'INACTIVE', 'ARCHIVED']
                ),
                name='account_status_valid'
            ),
        ]
        
        # Performance indexes
        indexes = [
            models.Index(fields=['code'], name='idx_account_code'),
            models.Index(fields=['status'], name='idx_account_status'),
            models.Index(fields=['is_header'], name='idx_account_is_header'),
            models.Index(fields=['is_system'], name='idx_account_is_system'),
            models.Index(
                fields=['tenant', 'status', 'is_header'],
                name='idx_account_tenant_status_header'
            ),
            models.Index(
                fields=['tenant', 'account_type'],
                name='idx_account_tenant_type'
            ),
        ]
        
        # Permissions (optional)
        permissions = [
            ('view_system_accounts', 'Can view system accounts'),
            ('modify_system_accounts', 'Can modify system accounts'),
        ]
    
    class MPTTMeta:
        order_insertion_by = ['code']
```

### Constraint Migration Generation

```
Creating Constraint Migration
═══════════════════════════════════════════════════════════

Step 1: Add constraints to model Meta class
Step 2: Generate migration

$ python manage.py makemigrations accounting --name add_account_constraints

Generated Migration:
# apps/accounting/migrations/0003_add_account_constraints.py

from django.db import migrations, models

class Migration(migrations.Migration):

    dependencies = [
        ('accounting', '0002_account'),
    ]

    operations = [
        # Add check constraint
        migrations.AddConstraint(
            model_name='account',
            constraint=models.CheckConstraint(
                check=models.Q(code__gte=1000, code__lte=9999),
                name='account_code_valid_range'
            ),
        ),
        
        migrations.AddConstraint(
            model_name='account',
            constraint=models.CheckConstraint(
                check=models.Q(
                    status__in=['ACTIVE', 'INACTIVE', 'ARCHIVED']
                ),
                name='account_status_valid'
            ),
        ),
        
        # Add indexes
        migrations.AddIndex(
            model_name='account',
            index=models.Index(
                fields=['status'],
                name='idx_account_status'
            ),
        ),
        
        migrations.AddIndex(
            model_name='account',
            index=models.Index(
                fields=['is_header'],
                name='idx_account_is_header'
            ),
        ),
        
        # Additional indexes...
    ]

Step 3: Apply migration
$ python manage.py migrate accounting
```

### Constraint Violation Examples

```
Database Constraint Violations
═══════════════════════════════════════════════════════════

Violation 1: Duplicate Code
attempt = Account.objects.create(
    tenant=tenant_a,
    code=1201,  # Already exists
    name="Duplicate",
    ...
)
Result: ❌ IntegrityError
Message: "duplicate key value violates unique constraint 
         'unique_account_code_per_tenant'"

Violation 2: Invalid Code Range
attempt = Account.objects.create(
    tenant=tenant_a,
    code=500,  # Outside 1000-9999 range
    name="Invalid Code",
    ...
)
Result: ❌ IntegrityError
Message: "new row violates check constraint 
         'account_code_valid_range'"

Violation 3: Invalid Status
attempt = Account.objects.create(
    tenant=tenant_a,
    code=1299,
    status='DELETED',  # Not in allowed values
    ...
)
Result: ❌ IntegrityError (if check constraint)
Or: ❌ ValidationError (if model validation)
Message: "invalid status value"
```

### Index Size and Maintenance

```
Index Considerations
═══════════════════════════════════════════════════════════

Benefits:
✓ Faster query performance
✓ Speed up WHERE, JOIN, ORDER BY operations
✓ Improve sorting and filtering

Costs:
✗ Additional disk space
✗ Slower INSERT/UPDATE operations (index maintenance)
✗ More memory usage

Guidelines:
• Index frequently queried columns
• Index foreign keys (often automatic)
• Index columns in WHERE clauses
• Avoid indexing rarely-used columns
• Monitor index usage and size

Monitoring Index Usage (PostgreSQL):
SELECT
    schemaname,
    tablename,
    indexname,
    idx_scan as index_scans,
    pg_size_pretty(pg_relation_size(indexrelid)) as index_size
FROM pg_stat_user_indexes
WHERE tablename = 'accounting_account'
ORDER BY idx_scan DESC;

Remove Unused Indexes:
DROP INDEX IF EXISTS idx_unused_index;
```

### Expected Outcome
- Database constraints enforce business rules
- Unique account codes per tenant guaranteed
- Check constraints validate field values
- Indexes improve query performance
- Data integrity maintained at database level
- Clear error messages on constraint violations
- Optimized queries for common patterns
- Foundation for reliable account management

### Verification Checklist
- [ ] Unique constraint on (tenant, code) exists
- [ ] Check constraints for code range (optional)
- [ ] Check constraints for status values (optional)
- [ ] Indexes on frequently queried fields created
- [ ] Compound indexes for common query patterns
- [ ] Migration for constraints generated and applied
- [ ] Constraint violations tested and verified
- [ ] Index usage monitored (optional)
- [ ] Documentation updated with constraints
- [ ] Performance impact assessed

---

## Summary

This document completed the Account model implementation with balance tracking, currency support, and database integrity:

### Completed Tasks
- ✅ Currency Field (Task 29) - Optional foreign currency support with tenant default inheritance
- ✅ Opening Balance (Task 30) - Initial balance for data migration and setup
- ✅ Current Balance (Task 31) - Cached running balance updated by transactions
- ✅ Timestamps (Task 32) - Audit trail with created_at and updated_at
- ✅ Run Migrations (Task 33) - Database table created with all fields
- ✅ Model Constraints (Task 34) - Unique constraints, check constraints, and performance indexes

### Key Achievements
1. **Multi-Currency Support** - Optional currency field for foreign currency accounts
2. **Balance Tracking** - Opening and current balance fields with update logic
3. **Audit Trail** - Automatic timestamps for all account changes
4. **Database Schema** - Physical table created with proper structure
5. **Data Integrity** - Constraints enforce business rules at database level
6. **Query Performance** - Strategic indexes for common query patterns

### Account Model Complete Structure
- **Identification**: code, name
- **Classification**: account_type, category, status
- **Hierarchy**: parent, MPTT fields (tree_id, level, lft, rght)
- **Flags**: is_header, is_system
- **Currency**: optional currency override
- **Balances**: opening_balance, current_balance
- **Timestamps**: created_at, updated_at
- **Relationships**: tenant, account_type, currency, parent

### Database Features
- Unique constraint on (tenant, code)
- Check constraints for validation
- Foreign key constraints for referential integrity
- Indexes for query performance
- MPTT tree structure support
- Full tenant schema isolation

### Next Steps
Proceed to Group-C_Default-Chart-Setup to implement:
- Default chart of accounts template
- Account creation utilities
- Bulk account import
- Chart validation
- Standard account assignments

---

**Document Status:** ✅ Complete  
**Total Tasks:** 6  
**Group B:** ✅ Complete  
**Total Lines:** ~980
