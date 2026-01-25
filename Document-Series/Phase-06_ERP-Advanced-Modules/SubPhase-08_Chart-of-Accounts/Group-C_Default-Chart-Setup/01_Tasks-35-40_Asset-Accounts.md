# Tasks 35-40: Asset Accounts

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 08 - Chart of Accounts  
> **Group:** C - Default Chart Setup  
> **Document:** 01 of 04  
> **Tasks Covered:** 35, 36, 37, 38, 39, 40

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-41-44_Liability-Accounts.md](02_Tasks-41-44_Liability-Accounts.md)

---

## Document Overview

This document covers the complete asset accounts structure for the default chart of accounts. Assets represent resources owned by the business, including cash, bank accounts, receivables, inventory, and fixed assets. The asset accounts use the 1000-1999 code range and follow a hierarchical structure with header accounts organizing detail accounts beneath them. This foundation enables proper tracking of current assets (cash, receivables, inventory) and long-term assets (property, equipment, vehicles).

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 35 | Define Asset Header Account | Medium | 20 min |
| 36 | Add Cash Accounts | Low | 15 min |
| 37 | Add Bank Accounts | Low | 15 min |
| 38 | Add Receivables Accounts | Low | 15 min |
| 39 | Add Inventory Accounts | Low | 15 min |
| 40 | Add Fixed Asset Accounts | Low | 20 min |

---

## Account Code Numbering System

### Asset Account Range: 1000-1999

The asset accounts follow standard double-entry bookkeeping conventions:

| Range | Category | Examples |
|-------|----------|----------|
| 1000-1099 | Asset Header & Cash | Main header, cash on hand, petty cash |
| 1100-1199 | Bank Accounts | Commercial banks, savings accounts |
| 1200-1299 | Accounts Receivable | Trade receivables, other receivables, VAT input |
| 1300-1499 | Inventory | Merchandise, raw materials, work in progress |
| 1500-1999 | Fixed Assets | Equipment, vehicles, furniture, depreciation |

### Normal Balance
- All asset accounts have a **DEBIT** normal balance
- Increases are recorded as debits
- Decreases are recorded as credits
- Exception: Accumulated Depreciation (contra-asset with credit balance)

---

## Account Hierarchy Structure

```
1000 - Assets [HEADER]
├── 1100 - Cash [HEADER]
│   ├── 1101 - Cash on Hand
│   └── 1102 - Petty Cash
├── 1110 - Bank Accounts [HEADER]
│   ├── 1111 - Commercial Bank Current Account
│   ├── 1112 - Commercial Bank Savings Account
│   └── 1113 - Other Bank Accounts
├── 1200 - Accounts Receivable [HEADER]
│   ├── 1201 - Trade Receivables
│   ├── 1202 - Other Receivables
│   └── 1250 - VAT Input (Tax Paid on Purchases)
├── 1300 - Inventory [HEADER]
│   ├── 1301 - Merchandise Inventory
│   ├── 1302 - Raw Materials
│   └── 1303 - Work in Progress
└── 1500 - Fixed Assets [HEADER]
    ├── 1501 - Equipment
    ├── 1502 - Vehicles
    ├── 1503 - Furniture & Fixtures
    ├── 1504 - Computer Equipment
    └── 1599 - Accumulated Depreciation [CONTRA-ASSET]
```

---

## Task 35: Define Asset Header Account

### Overview
Create the root asset account (code 1000) that serves as the top-level header for all asset accounts in the chart of accounts. This header account groups all asset categories beneath it and cannot have transactions posted directly to it. It's used for financial reporting and organization, appearing as "Assets" on the balance sheet with all sub-accounts rolled up into it.

### Dependencies
- Account model exists with MPTT hierarchy support (Task 34)
- Account type constants defined (ASSET type available)
- Database migrations completed for Account model

### Instructions

1. **Create JSON fixture structure**
   - Create or open `apps/accounting/fixtures/default_coa.json`
   - Begin array structure for account fixtures
   - Prepare to add asset header account

2. **Define asset header account object**
   - Model: `accounting.account`
   - Primary key: Auto-increment or specify pk: 1
   - Code: "1000"
   - Name: "Assets"

3. **Set account type and classification**
   - Type: ASSET (use constant value from Account.TYPE_ASSET)
   - Account class: "asset"
   - Purpose: Top-level grouping for all asset accounts

4. **Configure header properties**
   - is_header: true
   - is_active: true
   - is_system: false (not a system control account)
   - allow_transactions: false (no direct posting)

5. **Set hierarchy position**
   - parent: null (top-level account)
   - level: 0 (MPTT root level)
   - lft and rght: Will be calculated by MPTT

6. **Set balance configuration**
   - normal_balance: "debit"
   - current_balance: 0.00
   - Balance increases with debits, decreases with credits

7. **Add metadata**
   - description: "All assets owned by the business including current and fixed assets"
   - notes: "Header account for financial statement presentation"
   - created_by: null (system default)

### Account Properties

| Property | Value | Explanation |
|----------|-------|-------------|
| code | "1000" | Standard first asset account code |
| name | "Assets" | Clear category identification |
| account_type | ASSET | Balance sheet account type |
| is_header | true | Groups sub-accounts, no transactions |
| parent | null | Root of asset hierarchy |
| normal_balance | debit | Asset accounts increase with debits |

### Expected Outcome
- Root asset account created with code 1000
- Header configured to accept child accounts
- Foundation for asset hierarchy established
- Financial reporting category defined

### Verification Checklist
- [ ] Account code 1000 defined in fixture
- [ ] Name is "Assets"
- [ ] Account type is ASSET
- [ ] is_header set to true
- [ ] parent set to null
- [ ] normal_balance is "debit"
- [ ] allow_transactions is false
- [ ] Description explains purpose clearly

---

## Task 36: Add Cash Accounts

### Overview
Define cash accounts for tracking physical currency held by the business. Includes a cash header account (1100) to organize different cash types, Cash on Hand (1101) for the main cash drawer or register, and Petty Cash (1102) for small miscellaneous expenses. Cash accounts are the most liquid assets and require strong internal controls for cash handling and reconciliation.

### Dependencies
- Task 35: Asset header account exists
- Parent account 1000 available for linkage

### Instructions

1. **Create cash header account (1100)**
   - Code: "1100"
   - Name: "Cash"
   - Type: ASSET
   - is_header: true
   - parent: Link to account 1000 (Assets)
   - Description: "Physical currency and cash equivalents held by business"

2. **Set header account configuration**
   - is_active: true
   - allow_transactions: false (header only)
   - is_system: false
   - normal_balance: "debit"

3. **Create Cash on Hand account (1101)**
   - Code: "1101"
   - Name: "Cash on Hand"
   - Type: ASSET
   - is_header: false
   - parent: Link to account 1100 (Cash)

4. **Configure Cash on Hand properties**
   - allow_transactions: true (active posting account)
   - is_active: true
   - is_system: false
   - normal_balance: "debit"
   - Description: "Main cash drawer or register for daily sales and receipts"

5. **Create Petty Cash account (1102)**
   - Code: "1102"
   - Name: "Petty Cash"
   - Type: ASSET
   - is_header: false
   - parent: Link to account 1100 (Cash)

6. **Configure Petty Cash properties**
   - allow_transactions: true
   - is_active: true
   - is_system: false
   - normal_balance: "debit"
   - Description: "Small cash fund for minor expenses and incidentals"

7. **Set initial balances**
   - All cash accounts: current_balance: 0.00
   - Balances will be set during implementation/setup

### Cash Account Details

| Code | Name | Header? | Purpose | Control Level |
|------|------|---------|---------|---------------|
| 1100 | Cash | Yes | Cash grouping | Reporting only |
| 1101 | Cash on Hand | No | Main cash drawer | High - daily reconciliation |
| 1102 | Petty Cash | No | Small expenses | Medium - periodic replenishment |

### Cash Management Considerations

**Internal Controls:**
- Daily cash counts and reconciliation required
- Separation of duties for cash handling
- Documented cash drops and deposits
- Surprise cash audits

**Petty Cash System:**
- Fixed imprest amount (e.g., LKR 10,000)
- Replenishment with receipts
- Periodic reconciliation
- Expense documentation required

### Expected Outcome
- Cash header account organizing cash types
- Cash on Hand account for main cash operations
- Petty Cash account for minor expenses
- Clear hierarchy under Assets (1000)

### Verification Checklist
- [ ] Account 1100 (Cash) created as header
- [ ] Account 1100 parent links to 1000
- [ ] Account 1101 (Cash on Hand) created as detail
- [ ] Account 1101 parent links to 1100
- [ ] Account 1102 (Petty Cash) created as detail
- [ ] Account 1102 parent links to 1100
- [ ] All cash accounts have debit normal balance
- [ ] Header account does not allow transactions
- [ ] Detail accounts allow transactions

---

## Task 37: Add Bank Accounts

### Overview
Define bank accounts for tracking business funds held in financial institutions. Includes a bank accounts header (1110) to organize multiple bank accounts, and standard accounts for commercial bank current accounts (1111) and savings accounts (1112). Bank accounts are reconciled regularly with bank statements and are used for electronic payments, deposits, and transfers.

### Dependencies
- Task 35: Asset header account exists
- Parent account 1000 available

### Instructions

1. **Create Bank Accounts header (1110)**
   - Code: "1110"
   - Name: "Bank Accounts"
   - Type: ASSET
   - is_header: true
   - parent: Link to account 1000 (Assets)
   - Description: "Funds held in banks and financial institutions"

2. **Set header configuration**
   - is_active: true
   - allow_transactions: false
   - is_system: false
   - normal_balance: "debit"

3. **Create Commercial Bank Current Account (1111)**
   - Code: "1111"
   - Name: "Commercial Bank - Current Account"
   - Type: ASSET
   - is_header: false
   - parent: Link to account 1110 (Bank Accounts)

4. **Configure current account properties**
   - allow_transactions: true
   - is_active: true
   - is_system: false
   - normal_balance: "debit"
   - Description: "Main operating bank account for business transactions"

5. **Add bank account metadata**
   - Consider custom fields for bank name
   - Account number (encrypted in production)
   - Branch details
   - Account type identifier

6. **Create Commercial Bank Savings Account (1112)**
   - Code: "1112"
   - Name: "Commercial Bank - Savings Account"
   - Type: ASSET
   - is_header: false
   - parent: Link to account 1110 (Bank Accounts)

7. **Configure savings account properties**
   - allow_transactions: true
   - is_active: true
   - is_system: false
   - normal_balance: "debit"
   - Description: "Savings account for reserve funds and interest earnings"

8. **Set initial balances**
   - All bank accounts: current_balance: 0.00
   - Opening balances entered during setup

### Bank Account Details

| Code | Name | Header? | Purpose | Reconciliation |
|------|------|---------|---------|----------------|
| 1110 | Bank Accounts | Yes | Bank grouping | N/A |
| 1111 | Current Account | No | Daily operations | Monthly minimum |
| 1112 | Savings Account | No | Reserves, interest | Monthly |

### Bank Reconciliation Requirements

**Monthly Reconciliation Process:**
1. Compare bank statement to ledger
2. Identify outstanding checks and deposits
3. Record bank fees and interest
4. Adjust for errors or omissions
5. Document reconciliation with supporting evidence

**Common Reconciling Items:**
- Outstanding checks not yet cleared
- Deposits in transit
- Bank service charges
- NSF (insufficient funds) checks
- Interest earned
- Electronic transfers

### Sri Lanka Banking Context

**Common Banks:**
- Bank of Ceylon (BOC)
- Commercial Bank of Ceylon
- Hatton National Bank (HNB)
- Sampath Bank
- Nations Trust Bank

**Account Types:**
- Current Account: Business transactions, no interest
- Savings Account: Interest-bearing, withdrawal limits
- Fixed Deposits: Separate asset account if needed

### Expected Outcome
- Bank Accounts header organizing bank holdings
- Current account for daily operations
- Savings account for reserves
- Structure supports multiple bank accounts

### Verification Checklist
- [ ] Account 1110 (Bank Accounts) created as header
- [ ] Account 1110 parent links to 1000
- [ ] Account 1111 (Current Account) created as detail
- [ ] Account 1111 parent links to 1110
- [ ] Account 1112 (Savings Account) created as detail
- [ ] Account 1112 parent links to 1110
- [ ] All bank accounts have debit normal balance
- [ ] Header does not allow transactions
- [ ] Detail accounts allow transactions

---

## Task 38: Add Receivables Accounts

### Overview
Define accounts receivable accounts for tracking money owed to the business by customers. Includes a receivables header (1200), Trade Receivables (1201) for customer invoices, Other Receivables (1202) for non-trade amounts owed, and VAT Input (1250) for value-added tax paid on purchases that can be offset against VAT collected. Receivables are current assets expected to be collected within one year.

### Dependencies
- Task 35: Asset header account exists
- Understanding of Sri Lankan VAT system

### Instructions

1. **Create Accounts Receivable header (1200)**
   - Code: "1200"
   - Name: "Accounts Receivable"
   - Type: ASSET
   - is_header: true
   - parent: Link to account 1000 (Assets)
   - Description: "Amounts owed to the business by customers and others"

2. **Set header configuration**
   - is_active: true
   - allow_transactions: false
   - is_system: false
   - normal_balance: "debit"

3. **Create Trade Receivables account (1201)**
   - Code: "1201"
   - Name: "Trade Receivables"
   - Type: ASSET
   - is_header: false
   - parent: Link to account 1200 (Accounts Receivable)

4. **Configure Trade Receivables as system account**
   - allow_transactions: true
   - is_active: true
   - is_system: true (AR control account)
   - normal_balance: "debit"
   - Description: "Amounts owed by customers for goods or services sold on credit"

5. **Set Trade Receivables metadata**
   - This is the AR control account
   - Integrates with customer ledger
   - Balances must match subsidiary ledger
   - Used in aging reports

6. **Create Other Receivables account (1202)**
   - Code: "1202"
   - Name: "Other Receivables"
   - Type: ASSET
   - is_header: false
   - parent: Link to account 1200 (Accounts Receivable)

7. **Configure Other Receivables properties**
   - allow_transactions: true
   - is_active: true
   - is_system: false
   - normal_balance: "debit"
   - Description: "Non-trade receivables including employee advances and other amounts due"

8. **Create VAT Input account (1250)**
   - Code: "1250"
   - Name: "VAT Input (Tax Paid on Purchases)"
   - Type: ASSET
   - is_header: false
   - parent: Link to account 1200 (Accounts Receivable)

9. **Configure VAT Input as system account**
   - allow_transactions: true
   - is_active: true
   - is_system: true (statutory compliance)
   - normal_balance: "debit"
   - Description: "Value Added Tax paid on purchases, offset against VAT collected"

10. **Set VAT Input metadata**
    - Sri Lankan VAT compliance account
    - Used in VAT return calculations
    - Offset against VAT Output (liability)
    - Monthly reconciliation required

### Receivables Account Details

| Code | Name | Header? | System? | Purpose |
|------|------|---------|---------|---------|
| 1200 | Accounts Receivable | Yes | No | Receivables grouping |
| 1201 | Trade Receivables | No | Yes | Customer AR control |
| 1202 | Other Receivables | No | No | Non-trade amounts |
| 1250 | VAT Input | No | Yes | Input tax for offset |

### Trade Receivables Management

**AR Control Account:**
- Subsidiary ledger tracks individual customers
- Control account shows total AR balance
- Must reconcile to customer ledger sum
- Integration with sales invoicing system

**Aging Analysis:**
- Current (0-30 days)
- 31-60 days
- 61-90 days
- Over 90 days (collection risk)

**Credit Management:**
- Credit limit enforcement
- Payment terms tracking
- Collection procedures
- Bad debt provisions

### Sri Lankan VAT Input Tax

**VAT Rate (Sri Lanka):**
- Standard rate: 18% (as of 2026, verify current rate)
- Applied to most goods and services
- Businesses registered for VAT claim input tax

**VAT Input Treatment:**
- Record when purchasing goods/services with VAT
- Accumulates as asset (prepaid tax)
- Offset against VAT Output monthly
- Net VAT payable or refundable

**VAT Return Process:**
1. Calculate VAT Output (collected from sales)
2. Calculate VAT Input (paid on purchases)
3. Net VAT = Output minus Input
4. Pay net amount to Inland Revenue
5. Or claim refund if Input exceeds Output

### Expected Outcome
- Accounts Receivable header organizing receivables
- Trade Receivables as AR control account
- Other Receivables for non-trade amounts
- VAT Input for tax compliance
- Integration points identified

### Verification Checklist
- [ ] Account 1200 (Accounts Receivable) created as header
- [ ] Account 1200 parent links to 1000
- [ ] Account 1201 (Trade Receivables) created as detail
- [ ] Account 1201 marked as system account
- [ ] Account 1201 parent links to 1200
- [ ] Account 1202 (Other Receivables) created
- [ ] Account 1202 parent links to 1200
- [ ] Account 1250 (VAT Input) created
- [ ] Account 1250 marked as system account
- [ ] Account 1250 parent links to 1200
- [ ] All receivables have debit normal balance

---

## Task 39: Add Inventory Accounts

### Overview
Define inventory accounts for tracking goods held for resale or used in production. Includes an inventory header (1300), Merchandise Inventory (1301) for finished goods ready for sale, Raw Materials (1302) for production inputs, and Work in Progress (1303) for partially completed goods. Inventory valuation methods (FIFO, weighted average) affect cost of goods sold calculations.

### Dependencies
- Task 35: Asset header account exists
- Understanding of inventory valuation methods

### Instructions

1. **Create Inventory header (1300)**
   - Code: "1300"
   - Name: "Inventory"
   - Type: ASSET
   - is_header: true
   - parent: Link to account 1000 (Assets)
   - Description: "Goods held for resale or used in production"

2. **Set header configuration**
   - is_active: true
   - allow_transactions: false
   - is_system: false
   - normal_balance: "debit"

3. **Create Merchandise Inventory account (1301)**
   - Code: "1301"
   - Name: "Merchandise Inventory"
   - Type: ASSET
   - is_header: false
   - parent: Link to account 1300 (Inventory)

4. **Configure Merchandise Inventory properties**
   - allow_transactions: true
   - is_active: true
   - is_system: true (inventory control account)
   - normal_balance: "debit"
   - Description: "Finished goods available for sale to customers"

5. **Set Merchandise Inventory metadata**
   - Integration with inventory management system
   - Perpetual or periodic inventory system
   - Valuation method (FIFO, weighted average)
   - Physical count reconciliation required

6. **Create Raw Materials account (1302)**
   - Code: "1302"
   - Name: "Raw Materials"
   - Type: ASSET
   - is_header: false
   - parent: Link to account 1300 (Inventory)

7. **Configure Raw Materials properties**
   - allow_transactions: true
   - is_active: true
   - is_system: false
   - normal_balance: "debit"
   - Description: "Materials and supplies used in production or assembly"

8. **Create Work in Progress account (1303)**
   - Code: "1303"
   - Name: "Work in Progress"
   - Type: ASSET
   - is_header: false
   - parent: Link to account 1300 (Inventory)

9. **Configure Work in Progress properties**
   - allow_transactions: true
   - is_active: true
   - is_system: false
   - normal_balance: "debit"
   - Description: "Partially completed goods in production process"

10. **Set initial balances**
    - All inventory accounts: current_balance: 0.00
    - Opening inventory entered during setup
    - Physical count establishes beginning balance

### Inventory Account Details

| Code | Name | Header? | System? | Use Case |
|------|------|---------|---------|----------|
| 1300 | Inventory | Yes | No | Inventory grouping |
| 1301 | Merchandise Inventory | No | Yes | Retail finished goods |
| 1302 | Raw Materials | No | No | Manufacturing inputs |
| 1303 | Work in Progress | No | No | Production in process |

### Inventory Valuation Methods

**FIFO (First-In, First-Out):**
- First items purchased are first items sold
- Matches physical flow in most businesses
- Ending inventory at recent costs
- COGS at older costs

**Weighted Average:**
- Average cost of all units available
- Smooths out price fluctuations
- Simpler calculation
- Common in Sri Lankan SMEs

**Specific Identification:**
- Each item tracked individually
- Used for unique, high-value items
- Most accurate but complex

### Inventory Systems

**Perpetual Inventory:**
- Continuous tracking of inventory levels
- Updated with each sale and purchase
- Real-time inventory information
- Requires integrated POS/ERP system

**Periodic Inventory:**
- Physical counts at intervals
- Calculate COGS: Beginning + Purchases - Ending
- Less accurate between counts
- Lower technology requirements

### Inventory Management Best Practices

**Physical Count Procedures:**
1. Schedule regular cycle counts
2. Full physical inventory annually
3. Investigate variances
4. Adjust inventory records
5. Document count process

**Internal Controls:**
- Separation of duties (purchasing, receiving, custody)
- Secure storage areas
- Inventory movement documentation
- Reorder point monitoring
- Obsolete inventory identification

### Cost Flow and COGS Calculation

**Inventory Equation:**
```
Beginning Inventory
+ Purchases
- Ending Inventory
= Cost of Goods Sold
```

**Journal Entry Flow:**
- Purchase: DR Inventory, CR Cash/Accounts Payable
- Sale: DR Cost of Goods Sold, CR Inventory
- Adjustment: DR/CR Inventory, CR/DR COGS or Adjustment Account

### Expected Outcome
- Inventory header organizing stock accounts
- Merchandise Inventory as control account
- Raw Materials for production businesses
- Work in Progress for manufacturing
- Foundation for inventory management integration

### Verification Checklist
- [ ] Account 1300 (Inventory) created as header
- [ ] Account 1300 parent links to 1000
- [ ] Account 1301 (Merchandise Inventory) created
- [ ] Account 1301 marked as system account
- [ ] Account 1301 parent links to 1300
- [ ] Account 1302 (Raw Materials) created
- [ ] Account 1302 parent links to 1300
- [ ] Account 1303 (Work in Progress) created
- [ ] Account 1303 parent links to 1300
- [ ] All inventory accounts have debit normal balance
- [ ] Header does not allow transactions

---

## Task 40: Add Fixed Asset Accounts

### Overview
Define fixed asset accounts for tracking long-term tangible property used in business operations. Includes a fixed assets header (1500), accounts for Equipment (1501), Vehicles (1502), Furniture & Fixtures (1503), Computer Equipment (1504), and Accumulated Depreciation (1599) as a contra-asset account. Fixed assets are capitalized and depreciated over their useful lives rather than expensed immediately.

### Dependencies
- Task 35: Asset header account exists
- Understanding of depreciation methods and Sri Lankan tax rules

### Instructions

1. **Create Fixed Assets header (1500)**
   - Code: "1500"
   - Name: "Fixed Assets"
   - Type: ASSET
   - is_header: true
   - parent: Link to account 1000 (Assets)
   - Description: "Long-term tangible property used in business operations"

2. **Set header configuration**
   - is_active: true
   - allow_transactions: false
   - is_system: false
   - normal_balance: "debit"

3. **Create Equipment account (1501)**
   - Code: "1501"
   - Name: "Equipment"
   - Type: ASSET
   - is_header: false
   - parent: Link to account 1500 (Fixed Assets)

4. **Configure Equipment properties**
   - allow_transactions: true
   - is_active: true
   - is_system: false
   - normal_balance: "debit"
   - Description: "Machinery, tools, and equipment used in business operations"

5. **Create Vehicles account (1502)**
   - Code: "1502"
   - Name: "Vehicles"
   - Type: ASSET
   - is_header: false
   - parent: Link to account 1500 (Fixed Assets)

6. **Configure Vehicles properties**
   - allow_transactions: true
   - is_active: true
   - is_system: false
   - normal_balance: "debit"
   - Description: "Motor vehicles used for business purposes"

7. **Create Furniture & Fixtures account (1503)**
   - Code: "1503"
   - Name: "Furniture & Fixtures"
   - Type: ASSET
   - is_header: false
   - parent: Link to account 1500 (Fixed Assets)

8. **Configure Furniture properties**
   - allow_transactions: true
   - is_active: true
   - is_system: false
   - normal_balance: "debit"
   - Description: "Office furniture, shelving, display cases, and fixtures"

9. **Create Computer Equipment account (1504)**
   - Code: "1504"
   - Name: "Computer Equipment"
   - Type: ASSET
   - is_header: false
   - parent: Link to account 1500 (Fixed Assets)

10. **Configure Computer Equipment properties**
    - allow_transactions: true
    - is_active: true
    - is_system: false
    - normal_balance: "debit"
    - Description: "Computers, servers, printers, and technology hardware"

11. **Create Accumulated Depreciation account (1599)**
    - Code: "1599"
    - Name: "Accumulated Depreciation"
    - Type: ASSET (with contra-asset flag)
    - is_header: false
    - parent: Link to account 1500 (Fixed Assets)

12. **Configure Accumulated Depreciation as contra-asset**
    - allow_transactions: true
    - is_active: true
    - is_system: true
    - normal_balance: "credit" (contra to normal asset debit)
    - Description: "Cumulative depreciation expense on all fixed assets"

13. **Set contra-asset behavior**
    - Increases with credits (depreciation expense)
    - Reduces net fixed asset value
    - Reports negative on balance sheet under assets
    - Never reset; accumulates over asset life

### Fixed Asset Account Details

| Code | Name | Header? | System? | Normal Balance | Purpose |
|------|------|---------|---------|----------------|---------|
| 1500 | Fixed Assets | Yes | No | Debit | FA grouping |
| 1501 | Equipment | No | No | Debit | Machinery/tools |
| 1502 | Vehicles | No | No | Debit | Motor vehicles |
| 1503 | Furniture & Fixtures | No | No | Debit | Office furniture |
| 1504 | Computer Equipment | No | No | Debit | IT hardware |
| 1599 | Accumulated Depreciation | No | Yes | Credit | Contra-asset |

### Depreciation Methods

**Straight-Line Depreciation:**
- Most common method
- Equal expense each year
- Formula: (Cost - Salvage Value) / Useful Life
- Example: LKR 100,000 equipment, 5-year life = LKR 20,000/year

**Declining Balance:**
- Accelerated depreciation
- Higher expense in early years
- Common for vehicles and technology

**Units of Production:**
- Based on usage, not time
- Example: Depreciate per kilometer driven

### Sri Lankan Tax Depreciation Rates

**Inland Revenue Department Rates (verify current):**
- Computers & IT Equipment: 25% per annum
- Furniture & Fixtures: 12.5% per annum
- Machinery & Equipment: 12.5% - 20% per annum
- Motor Vehicles: 20% per annum
- Buildings: 5% per annum

**Note:** Tax depreciation may differ from book depreciation. Maintain separate schedules if needed for tax compliance.

### Capitalization Threshold

**Determine Capitalization Policy:**
- Assets below threshold: Expense immediately
- Assets above threshold: Capitalize and depreciate
- Common threshold: LKR 50,000 - 100,000
- Consider materiality and tracking burden

### Fixed Asset Management

**Asset Register:**
- Description and serial number
- Purchase date and cost
- Depreciation method and rate
- Useful life estimate
- Salvage value
- Current book value
- Disposal information

**Journal Entries:**

**Purchase:**
```
DR Equipment (1501)               100,000
    CR Cash/Bank (1111)                       100,000
```

**Depreciation:**
```
DR Depreciation Expense (5xxx)     20,000
    CR Accumulated Depreciation (1599)        20,000
```

**Disposal:**
```
DR Accumulated Depreciation (1599) 60,000
DR Cash (sale proceeds)            45,000
DR Loss on Disposal (5xxx)          5,000
    CR Equipment (1501)                       110,000
```

### Accumulated Depreciation Behavior

**Contra-Asset Account:**
- Offsets fixed asset accounts
- Credit balance (opposite of normal asset)
- Reduces total asset value
- Never directly reduced except on disposal

**Balance Sheet Presentation:**
```
Fixed Assets:
  Equipment                    100,000
  Vehicles                      80,000
  Less: Accumulated Depr.      (50,000)
  Net Fixed Assets             130,000
```

### Asset Impairment

**Impairment Indicators:**
- Physical damage or obsolescence
- Market value decline
- Changes in asset usage
- Economic factors

**Impairment Write-Down:**
- Reduce asset carrying value to recoverable amount
- Record impairment loss in income statement
- Not recovered in future periods

### Expected Outcome
- Fixed Assets header organizing long-term assets
- Individual accounts for major asset categories
- Accumulated Depreciation as contra-asset
- Foundation for depreciation tracking
- Asset management integration points identified

### Verification Checklist
- [ ] Account 1500 (Fixed Assets) created as header
- [ ] Account 1500 parent links to 1000
- [ ] Account 1501 (Equipment) created
- [ ] Account 1501 parent links to 1500
- [ ] Account 1502 (Vehicles) created
- [ ] Account 1502 parent links to 1500
- [ ] Account 1503 (Furniture) created
- [ ] Account 1503 parent links to 1500
- [ ] Account 1504 (Computer Equipment) created
- [ ] Account 1504 parent links to 1500
- [ ] Account 1599 (Accumulated Depreciation) created
- [ ] Account 1599 has CREDIT normal balance (contra-asset)
- [ ] Account 1599 marked as system account
- [ ] Account 1599 parent links to 1500
- [ ] All other fixed assets have debit normal balance

---

## Summary

This document established the complete asset structure for the default chart of accounts, covering:

- **Asset Header (1000):** Root account for all assets
- **Cash Accounts (1100-1102):** Cash on hand and petty cash
- **Bank Accounts (1110-1112):** Current and savings accounts
- **Receivables (1200-1250):** Trade receivables, other receivables, VAT input
- **Inventory (1300-1303):** Merchandise, raw materials, work in progress
- **Fixed Assets (1500-1599):** Equipment, vehicles, furniture, depreciation

The asset hierarchy supports double-entry bookkeeping with proper parent-child relationships, header accounts for organization, and system accounts for integration with AR and inventory management. Sri Lankan VAT compliance is addressed through the VAT Input account. The structure accommodates both retail and manufacturing businesses with appropriate inventory accounts.

Next document covers Liability Accounts (Tasks 41-44) including accounts payable, VAT output, and statutory EPF/ETF/PAYE payables.
