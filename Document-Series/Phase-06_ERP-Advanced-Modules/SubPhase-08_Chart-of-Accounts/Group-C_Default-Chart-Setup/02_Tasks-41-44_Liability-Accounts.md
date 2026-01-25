# Tasks 41-44: Liability Accounts

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 08 - Chart of Accounts  
> **Group:** C - Default Chart Setup  
> **Document:** 02 of 04  
> **Tasks Covered:** 41, 42, 43, 44

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-35-40_Asset-Accounts.md](01_Tasks-35-40_Asset-Accounts.md)
- **→ Next Document:** [03_Tasks-45-48_Equity-Revenue-Accounts.md](03_Tasks-45-48_Equity-Revenue-Accounts.md)

---

## Document Overview

This document covers the complete liability accounts structure for the default chart of accounts. Liabilities represent obligations and amounts owed by the business to others, including trade creditors, tax authorities, and statutory bodies. The liability accounts use the 2000-2999 code range and include critical Sri Lankan statutory accounts for EPF (Employees' Provident Fund), ETF (Employees' Trust Fund), PAYE (Pay As You Earn income tax), and VAT (Value Added Tax). Proper liability tracking ensures compliance with local regulations and accurate financial reporting.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 41 | Define Liability Header Account | Medium | 20 min |
| 42 | Add Payables Accounts | Low | 15 min |
| 43 | Add Tax Payable Accounts | Low | 20 min |
| 44 | Add EPF/ETF Payable Accounts | Low | 20 min |

---

## Account Code Numbering System

### Liability Account Range: 2000-2999

The liability accounts follow standard double-entry bookkeeping conventions:

| Range | Category | Examples |
|-------|----------|----------|
| 2000-2099 | Liability Header | Main liability grouping |
| 2100-2199 | Accounts Payable | Trade payables, other payables |
| 2200-2299 | Tax Payables | VAT, PAYE, income tax, NBT |
| 2300-2399 | Statutory Payables | EPF, ETF (Sri Lankan employer obligations) |
| 2500-2999 | Long-term Liabilities | Loans, bonds (future expansion) |

### Normal Balance
- All liability accounts have a **CREDIT** normal balance
- Increases are recorded as credits
- Decreases are recorded as debits
- Liabilities represent claims against business assets

---

## Account Hierarchy Structure

```
2000 - Liabilities [HEADER]
├── 2100 - Accounts Payable [HEADER]
│   ├── 2101 - Trade Payables
│   └── 2102 - Other Payables
├── 2150 - VAT Output (Tax Collected on Sales)
├── 2200 - Tax Payables [HEADER]
│   ├── 2210 - PAYE Payable (Withholding Tax)
│   ├── 2220 - Income Tax Payable
│   └── 2230 - NBT Payable (Nation Building Tax)
└── 2300 - Statutory Payables [HEADER]
    ├── 2310 - EPF Payable (Employee + Employer)
    └── 2320 - ETF Payable (Employer Only)
```

---

## Task 41: Define Liability Header Account

### Overview
Create the root liability account (code 2000) that serves as the top-level header for all liability accounts in the chart of accounts. This header account groups all liability categories beneath it and cannot have transactions posted directly to it. It's used for financial reporting and organization, appearing as "Liabilities" on the balance sheet with all sub-accounts rolled up into it.

### Dependencies
- Account model exists with MPTT hierarchy support
- Account type constants defined (LIABILITY type available)
- Asset accounts already created (Tasks 35-40)

### Instructions

1. **Create liability header account object**
   - Add to `apps/accounting/fixtures/default_coa.json`
   - Model: `accounting.account`
   - Primary key: Auto-increment
   - Code: "2000"
   - Name: "Liabilities"

2. **Set account type and classification**
   - Type: LIABILITY (use constant value from Account.TYPE_LIABILITY)
   - Account class: "liability"
   - Purpose: Top-level grouping for all liability accounts

3. **Configure header properties**
   - is_header: true
   - is_active: true
   - is_system: false (not a system control account)
   - allow_transactions: false (no direct posting)

4. **Set hierarchy position**
   - parent: null (top-level account, peer to Assets)
   - level: 0 (MPPT root level)
   - lft and rght: Calculated by MPTT

5. **Set balance configuration**
   - normal_balance: "credit"
   - current_balance: 0.00
   - Balance increases with credits, decreases with debits

6. **Add metadata**
   - description: "All obligations and amounts owed by the business to creditors, tax authorities, and statutory bodies"
   - notes: "Header account for balance sheet liabilities section"
   - created_by: null (system default)

### Account Properties

| Property | Value | Explanation |
|----------|-------|-------------|
| code | "2000" | Standard first liability account code |
| name | "Liabilities" | Clear category identification |
| account_type | LIABILITY | Balance sheet account type |
| is_header | true | Groups sub-accounts, no transactions |
| parent | null | Root of liability hierarchy |
| normal_balance | credit | Liability accounts increase with credits |

### Accounting Equation Context

**Fundamental Equation:**
```
Assets = Liabilities + Equity
```

**Balance Sheet Structure:**
```
ASSETS                           LIABILITIES & EQUITY
Current Assets                   Current Liabilities
  Cash                             Accounts Payable
  Receivables                      Tax Payables
  Inventory                        Statutory Payables
Fixed Assets                     Long-term Liabilities
  Equipment                      Equity
  Vehicles                         Owner's Equity
                                   Retained Earnings
```

### Expected Outcome
- Root liability account created with code 2000
- Header configured to accept child accounts
- Foundation for liability hierarchy established
- Financial reporting category defined

### Verification Checklist
- [ ] Account code 2000 defined in fixture
- [ ] Name is "Liabilities"
- [ ] Account type is LIABILITY
- [ ] is_header set to true
- [ ] parent set to null
- [ ] normal_balance is "credit"
- [ ] allow_transactions is false
- [ ] Description explains purpose clearly

---

## Task 42: Add Payables Accounts

### Overview
Define accounts payable accounts for tracking money owed by the business to suppliers and vendors. Includes an accounts payable header (2100) to organize payable types, Trade Payables (2101) for supplier invoices and purchases on credit, and Other Payables (2102) for miscellaneous amounts owed. Trade Payables is a system control account that integrates with the vendor ledger and purchase management system.

### Dependencies
- Task 41: Liability header account exists
- Parent account 2000 available for linkage

### Instructions

1. **Create Accounts Payable header (2100)**
   - Code: "2100"
   - Name: "Accounts Payable"
   - Type: LIABILITY
   - is_header: true
   - parent: Link to account 2000 (Liabilities)
   - Description: "Amounts owed by the business to suppliers and vendors"

2. **Set header account configuration**
   - is_active: true
   - allow_transactions: false (header only)
   - is_system: false
   - normal_balance: "credit"

3. **Create Trade Payables account (2101)**
   - Code: "2101"
   - Name: "Trade Payables"
   - Type: LIABILITY
   - is_header: false
   - parent: Link to account 2100 (Accounts Payable)

4. **Configure Trade Payables as system account**
   - allow_transactions: true
   - is_active: true
   - is_system: true (AP control account)
   - normal_balance: "credit"
   - Description: "Amounts owed to suppliers for goods or services purchased on credit"

5. **Set Trade Payables metadata**
   - This is the AP control account
   - Integrates with supplier/vendor ledger
   - Balances must match subsidiary ledger
   - Used in aging reports and payment scheduling

6. **Create Other Payables account (2102)**
   - Code: "2102"
   - Name: "Other Payables"
   - Type: LIABILITY
   - is_header: false
   - parent: Link to account 2100 (Accounts Payable)

7. **Configure Other Payables properties**
   - allow_transactions: true
   - is_active: true
   - is_system: false
   - normal_balance: "credit"
   - Description: "Non-trade payables including accrued expenses and other amounts owed"

8. **Set initial balances**
   - All payable accounts: current_balance: 0.00
   - Opening balances entered during setup

### Payables Account Details

| Code | Name | Header? | System? | Purpose |
|------|------|---------|---------|---------|
| 2100 | Accounts Payable | Yes | No | Payables grouping |
| 2101 | Trade Payables | No | Yes | Supplier AP control |
| 2102 | Other Payables | No | No | Non-trade obligations |

### Trade Payables Management

**AP Control Account:**
- Subsidiary ledger tracks individual suppliers
- Control account shows total AP balance
- Must reconcile to supplier ledger sum
- Integration with purchasing and inventory systems

**Aging Analysis:**
- Current (0-30 days)
- 31-60 days
- 61-90 days
- Over 90 days (overdue, potential penalties)

**Payment Management:**
- Payment terms tracking (Net 30, Net 60, 2/10 Net 30)
- Discount capture opportunities
- Cash flow planning
- Supplier relationship management

### Journal Entry Examples

**Purchase on Credit:**
```
DR Inventory (1301)                    50,000
DR VAT Input (1250)                     9,000  [18% of 50,000]
    CR Trade Payables (2101)                       59,000
```

**Payment to Supplier:**
```
DR Trade Payables (2101)               59,000
    CR Bank Account (1111)                         59,000
```

**Early Payment Discount:**
```
DR Trade Payables (2101)              100,000
    CR Bank Account (1111)                         98,000
    CR Purchase Discounts (Income)                  2,000
```

### Other Payables Examples

**Accrued Expenses:**
- Accrued salaries (earned but not yet paid)
- Accrued utilities
- Accrued professional fees
- Interest payable

**Deposits and Advances:**
- Customer deposits received
- Rental deposits held
- Advance payments from customers

### Expected Outcome
- Accounts Payable header organizing payable types
- Trade Payables as AP control account
- Other Payables for non-trade obligations
- Clear hierarchy under Liabilities (2000)
- Integration with purchasing system defined

### Verification Checklist
- [ ] Account 2100 (Accounts Payable) created as header
- [ ] Account 2100 parent links to 2000
- [ ] Account 2101 (Trade Payables) created as detail
- [ ] Account 2101 marked as system account
- [ ] Account 2101 parent links to 2100
- [ ] Account 2102 (Other Payables) created as detail
- [ ] Account 2102 parent links to 2100
- [ ] All payable accounts have credit normal balance
- [ ] Header account does not allow transactions
- [ ] Detail accounts allow transactions

---

## Task 43: Add Tax Payable Accounts

### Overview
Define tax payable accounts for tracking tax obligations to government authorities. Includes VAT Output (2150) for value-added tax collected from customers, PAYE Payable (2210) for employee income tax withholdings, Income Tax Payable (2220) for company income tax, and NBT Payable (2230) for Nation Building Tax. These are statutory compliance accounts critical for Sri Lankan businesses, with specific reporting and payment deadlines.

### Dependencies
- Task 41: Liability header account exists
- Understanding of Sri Lankan tax system and rates
- VAT Input account exists (1250) for offset calculation

### Instructions

1. **Create VAT Output account (2150)**
   - Code: "2150"
   - Name: "VAT Output (Tax Collected on Sales)"
   - Type: LIABILITY
   - is_header: false
   - parent: Link to account 2000 (Liabilities)

2. **Configure VAT Output as system account**
   - allow_transactions: true
   - is_active: true
   - is_system: true (statutory compliance)
   - normal_balance: "credit"
   - Description: "Value Added Tax collected from customers on sales, payable to Inland Revenue"

3. **Set VAT Output metadata**
   - Sri Lankan VAT compliance account
   - Monthly VAT return required
   - Offset against VAT Input (1250)
   - Net VAT calculated and paid

4. **Create Tax Payables header (2200)**
   - Code: "2200"
   - Name: "Tax Payables"
   - Type: LIABILITY
   - is_header: true
   - parent: Link to account 2000 (Liabilities)
   - Description: "Tax obligations to government authorities"

5. **Set Tax Payables header configuration**
   - is_active: true
   - allow_transactions: false
   - is_system: false
   - normal_balance: "credit"

6. **Create PAYE Payable account (2210)**
   - Code: "2210"
   - Name: "PAYE Payable (Withholding Tax)"
   - Type: LIABILITY
   - is_header: false
   - parent: Link to account 2200 (Tax Payables)

7. **Configure PAYE Payable as system account**
   - allow_transactions: true
   - is_active: true
   - is_system: true (statutory compliance)
   - normal_balance: "credit"
   - Description: "Employee income tax withheld from salaries, payable to Inland Revenue"

8. **Set PAYE Payable metadata**
   - Withheld from employee gross salary
   - Monthly remittance to Inland Revenue
   - Based on PAYE tax tables
   - Employer acts as collecting agent

9. **Create Income Tax Payable account (2220)**
   - Code: "2220"
   - Name: "Income Tax Payable"
   - Type: LIABILITY
   - is_header: false
   - parent: Link to account 2200 (Tax Payables)

10. **Configure Income Tax Payable properties**
    - allow_transactions: true
    - is_active: true
    - is_system: true
    - normal_balance: "credit"
    - Description: "Corporate income tax payable on business profits"

11. **Create NBT Payable account (2230)**
    - Code: "2230"
    - Name: "NBT Payable (Nation Building Tax)"
    - Type: LIABILITY
    - is_header: false
    - parent: Link to account 2200 (Tax Payables)

12. **Configure NBT Payable properties**
    - allow_transactions: true
    - is_active: true
    - is_system: true
    - normal_balance: "credit"
    - Description: "Nation Building Tax on economic service activities"

### Tax Payable Account Details

| Code | Name | System? | Tax Type | Payment Frequency |
|------|------|---------|----------|-------------------|
| 2150 | VAT Output | Yes | Sales tax | Monthly |
| 2200 | Tax Payables | No | Header | N/A |
| 2210 | PAYE Payable | Yes | Income withholding | Monthly |
| 2220 | Income Tax Payable | Yes | Corporate tax | Quarterly + Annual |
| 2230 | NBT Payable | Yes | Economic service tax | Quarterly |

### Sri Lankan VAT System

**Current VAT Rate:** 18% (verify current rate, subject to change)

**VAT Registration Threshold:**
- Mandatory registration if turnover exceeds LKR 3,000,000 per quarter
- Voluntary registration available below threshold

**VAT Return Process:**
1. Calculate VAT Output (collected from sales)
2. Calculate VAT Input (paid on purchases)
3. Net VAT = VAT Output - VAT Input
4. File VAT Return Form within 20 days of month-end
5. Pay net amount to Inland Revenue Department

**Monthly VAT Reconciliation:**
```
VAT Output (2150)               Credit Balance
Less: VAT Input (1250)          Debit Balance
-------------------------------------------
Net VAT Payable                 Amount to Pay
```

**Journal Entry for VAT on Sale:**
```
DR Accounts Receivable (1201)  118,000
    CR Sales Revenue (4110)                100,000
    CR VAT Output (2150)                    18,000
```

**Journal Entry for VAT Payment:**
```
DR VAT Output (2150)            50,000
    CR VAT Input (1250)                     20,000
    CR Bank Account (1111)                  30,000
```

### PAYE (Pay As You Earn) Withholding Tax

**PAYE System:**
- Employer withholds income tax from employee salaries
- Based on progressive tax brackets
- Monthly remittance to Inland Revenue
- Annual reconciliation with tax returns

**PAYE Tax Slabs (2026 - verify current):**
- First LKR 1,200,000 annual: Tax-free
- Next LKR 1,200,000: 6%
- Next LKR 1,200,000: 12%
- Next LKR 1,200,000: 18%
- Balance: 24%

**Monthly PAYE Process:**
1. Calculate employee gross salary
2. Apply PAYE formula based on annual projection
3. Withhold calculated tax from salary
4. Credit PAYE Payable account
5. Remit to Inland Revenue by 15th of following month

**Journal Entry for Salary with PAYE:**
```
DR Salaries Expense (5200)      100,000
    CR PAYE Payable (2210)                  12,000
    CR EPF Payable (2310)                    8,000
    CR Bank Account (1111)                  80,000
```

**Journal Entry for PAYE Payment:**
```
DR PAYE Payable (2210)          12,000
    CR Bank Account (1111)                  12,000
```

### Corporate Income Tax

**Income Tax Rate:**
- Standard corporate rate: 30% (verify current rate)
- SME concessionary rate: 14% (for qualifying businesses)
- Based on taxable profit after adjustments

**Quarterly ESC (Economic Service Charge) or Income Tax:**
- Advance payment system
- Paid quarterly on estimated annual income
- Reconciled with annual income tax return
- Deadline: Within 3 months of quarter-end

**Year-End Tax Calculation:**
```
Accounting Profit
+/- Tax Adjustments (depreciation differences, etc.)
= Taxable Profit
× Tax Rate (30% or 14%)
= Tax Liability
- Quarterly Payments Already Made
= Balance Payable/(Refundable)
```

### Nation Building Tax (NBT)

**NBT Overview:**
- Tax on economic service activities
- Rate: 2% of turnover (verify current rate)
- Threshold: Applies if quarterly turnover exceeds LKR 3,000,000
- Quarterly filing and payment

**NBT Calculation:**
```
Gross Turnover for Quarter
× 2%
= NBT Payable
```

**Journal Entry for NBT:**
```
DR NBT Expense (5xxx)            10,000
    CR NBT Payable (2230)                   10,000
```

### Tax Compliance Deadlines

| Tax | Filing Frequency | Payment Deadline |
|-----|------------------|------------------|
| VAT | Monthly | 20th of following month |
| PAYE | Monthly | 15th of following month |
| Income Tax (Quarterly) | Quarterly | Within 3 months of quarter |
| NBT | Quarterly | Within 3 months of quarter |
| Annual Income Tax Return | Annual | Within 4 months of year-end |

### Expected Outcome
- VAT Output account for sales tax collection
- Tax Payables header organizing tax obligations
- PAYE Payable for employee income tax withholding
- Income Tax Payable for corporate tax
- NBT Payable for economic service tax
- All accounts marked as system accounts
- Foundation for Sri Lankan tax compliance

### Verification Checklist
- [ ] Account 2150 (VAT Output) created
- [ ] Account 2150 marked as system account
- [ ] Account 2150 parent links to 2000
- [ ] Account 2200 (Tax Payables) created as header
- [ ] Account 2200 parent links to 2000
- [ ] Account 2210 (PAYE Payable) created
- [ ] Account 2210 marked as system account
- [ ] Account 2210 parent links to 2200
- [ ] Account 2220 (Income Tax Payable) created
- [ ] Account 2220 marked as system account
- [ ] Account 2220 parent links to 2200
- [ ] Account 2230 (NBT Payable) created
- [ ] Account 2230 marked as system account
- [ ] Account 2230 parent links to 2200
- [ ] All tax accounts have credit normal balance

---

## Task 44: Add EPF/ETF Payable Accounts

### Overview
Define Employees' Provident Fund (EPF) and Employees' Trust Fund (ETF) payable accounts for Sri Lankan statutory retirement fund obligations. EPF Payable (2310) tracks both employee contributions (8% of salary) and employer contributions (12% of salary) that must be remitted to the EPF. ETF Payable (2320) tracks employer-only contributions (3% of salary) to the ETF. These are mandatory for all employees earning above threshold and are critical compliance accounts.

### Dependencies
- Task 41: Liability header account exists
- Task 43: Tax Payables structure created
- Understanding of Sri Lankan EPF/ETF regulations

### Instructions

1. **Create Statutory Payables header (2300)**
   - Code: "2300"
   - Name: "Statutory Payables"
   - Type: LIABILITY
   - is_header: true
   - parent: Link to account 2000 (Liabilities)
   - Description: "Statutory contributions for employee retirement and welfare funds"

2. **Set Statutory Payables header configuration**
   - is_active: true
   - allow_transactions: false
   - is_system: false
   - normal_balance: "credit"

3. **Create EPF Payable account (2310)**
   - Code: "2310"
   - Name: "EPF Payable (Employees' Provident Fund)"
   - Type: LIABILITY
   - is_header: false
   - parent: Link to account 2300 (Statutory Payables)

4. **Configure EPF Payable as system account**
   - allow_transactions: true
   - is_active: true
   - is_system: true (statutory compliance)
   - normal_balance: "credit"
   - Description: "EPF contributions (8% employee + 12% employer) payable to Central Bank EPF Department"

5. **Set EPF Payable metadata**
   - Combined employee and employer contributions
   - Employee: 8% of gross salary (withheld)
   - Employer: 12% of gross salary (additional expense)
   - Total remitted: 20% of gross salary
   - Monthly remittance deadline: Before end of following month

6. **Create ETF Payable account (2320)**
   - Code: "2320"
   - Name: "ETF Payable (Employees' Trust Fund)"
   - Type: LIABILITY
   - is_header: false
   - parent: Link to account 2300 (Statutory Payables)

7. **Configure ETF Payable as system account**
   - allow_transactions: true
   - is_active: true
   - is_system: true (statutory compliance)
   - normal_balance: "credit"
   - Description: "ETF employer contribution (3% of salary) payable to ETF Board"

8. **Set ETF Payable metadata**
   - Employer contribution only (no employee portion)
   - 3% of gross salary
   - Separate from EPF
   - Monthly remittance with EPF
   - Benefits training and welfare programs

9. **Set initial balances**
   - EPF Payable: current_balance: 0.00
   - ETF Payable: current_balance: 0.00
   - Balances accumulate during month, cleared on payment

### EPF/ETF Account Details

| Code | Name | System? | Rate | Paid By | Remittance |
|------|------|---------|------|---------|------------|
| 2300 | Statutory Payables | No | N/A | Header | N/A |
| 2310 | EPF Payable | Yes | 20% total | 8% Emp + 12% Empr | Monthly |
| 2320 | ETF Payable | Yes | 3% | Employer only | Monthly |

### Sri Lankan EPF (Employees' Provident Fund)

**EPF Overview:**
- Mandatory retirement savings scheme
- Administered by Central Bank of Sri Lanka
- Applies to all employees earning above LKR 1,000/month
- Provides retirement benefits to employees

**EPF Contribution Rates:**
- Employee Contribution: 8% of gross salary (withheld from pay)
- Employer Contribution: 12% of gross salary (additional expense)
- Total remitted: 20% of gross salary

**EPF Remittance Process:**
1. Calculate monthly contributions for all employees
2. Submit Form C1 (employee details) if changes
3. Submit Form C2 (monthly contribution schedule)
4. Remit total EPF amount by last day of following month
5. Keep records for audit

**Example Calculation:**
```
Employee Gross Salary: LKR 50,000

Employee EPF (8%):    LKR 4,000  (withheld from salary)
Employer EPF (12%):   LKR 6,000  (employer expense)
---------------------------------------------------
Total EPF Remittance: LKR 10,000 (credited to EPF Payable)
```

### Sri Lankan ETF (Employees' Trust Fund)

**ETF Overview:**
- Employer-funded retirement and welfare scheme
- Administered by Employees' Trust Fund Board
- Applies to all employees and employers covered by EPF
- Funds used for training and welfare programs

**ETF Contribution Rate:**
- Employer Contribution: 3% of gross salary
- No employee contribution
- Separate from EPF

**ETF Remittance Process:**
1. Calculate monthly contributions for all employees
2. Submit monthly return with employee details
3. Remit total ETF amount by last day of following month
4. Typically remitted together with EPF

**Example Calculation:**
```
Employee Gross Salary: LKR 50,000

Employer ETF (3%):    LKR 1,500  (employer expense)
---------------------------------------------------
Total ETF Remittance: LKR 1,500  (credited to ETF Payable)
```

### Complete Payroll Journal Entries

**Recording Monthly Salary with Statutory Deductions:**
```
DR Salaries & Wages Expense (5200)    50,000  [Gross salary]
DR EPF Expense - Employer (5210)       6,000  [12% employer portion]
DR ETF Expense - Employer (5210)       1,500  [3% employer portion]
    CR EPF Payable (2310)                         10,000  [8% + 12% = 20%]
    CR ETF Payable (2320)                          1,500  [3%]
    CR PAYE Payable (2210)                         5,000  [Income tax]
    CR Bank/Cash (1101/1111)                      41,000  [Net pay]
```

**Breakdown:**
- Gross Salary: 50,000
- Less Employee EPF (8%): -4,000
- Less PAYE: -5,000
- **Net Pay to Employee: 41,000**

**Employer Additional Costs:**
- Employer EPF (12%): 6,000
- Employer ETF (3%): 1,500
- **Total Employer Cost: 57,500**

**Remitting EPF to Central Bank:**
```
DR EPF Payable (2310)                 10,000
    CR Bank Account (1111)                        10,000
```

**Remitting ETF to ETF Board:**
```
DR ETF Payable (2320)                  1,500
    CR Bank Account (1111)                         1,500
```

### Monthly Reconciliation

**EPF Reconciliation:**
```
Beginning Balance (previous month unpaid)     5,000
Add: Current Month Employee EPF (8%)         20,000
Add: Current Month Employer EPF (12%)        30,000
Less: Payments Made This Month             (50,000)
---------------------------------------------------
Ending Balance (EPF Payable)                  5,000
```

**ETF Reconciliation:**
```
Beginning Balance                              2,000
Add: Current Month Employer ETF (3%)          7,500
Less: Payments Made This Month               (9,000)
---------------------------------------------------
Ending Balance (ETF Payable)                    500
```

### Compliance Requirements

**Monthly Deadlines:**
- EPF and ETF contributions: Due by last day of following month
- Example: January contributions due by February 28/29

**Required Forms:**
- EPF Form C1: Employee registration/changes
- EPF Form C2: Monthly contribution schedule
- ETF Monthly Return: Contribution details

**Penalties for Late Payment:**
- Interest charges on late contributions
- Penalties for non-compliance
- Potential legal action for persistent default

**Record Keeping:**
- Maintain employee EPF/ETF registers
- Keep contribution receipts
- Document employee membership numbers
- Retain for statutory period (7 years minimum)

### Employer Cost Calculation Summary

**Total Statutory Cost on Salary:**
```
Gross Salary:                      100%
Add: Employer EPF:                  12%
Add: Employer ETF:                   3%
-------------------------------------------
Total Cost to Employer:            115%
```

**Example:**
- Employee receives LKR 50,000 gross
- Employee pays 8% EPF = LKR 4,000 (from their salary)
- Employee pays PAYE = Variable based on income
- Employer pays additional 15% = LKR 7,500 (12% EPF + 3% ETF)
- **Total cost to employer: LKR 57,500**

### Integration with Expense Accounts

**Note:** While EPF/ETF Payable accounts (2310, 2320) record the liability, the corresponding expense accounts for employer portions will be defined in Task 50:
- EPF/ETF Expense - Employer (5210)
- This ensures proper P&L recognition of employer statutory obligations

### Expected Outcome
- Statutory Payables header organizing retirement contributions
- EPF Payable account for combined employee+employer contributions
- ETF Payable account for employer-only contributions
- Both marked as system accounts for compliance
- Foundation for Sri Lankan payroll processing
- Clear separation of employee withholding vs employer expense

### Verification Checklist
- [ ] Account 2300 (Statutory Payables) created as header
- [ ] Account 2300 parent links to 2000
- [ ] Account 2310 (EPF Payable) created
- [ ] Account 2310 marked as system account
- [ ] Account 2310 parent links to 2300
- [ ] Account 2310 description mentions 8% + 12%
- [ ] Account 2320 (ETF Payable) created
- [ ] Account 2320 marked as system account
- [ ] Account 2320 parent links to 2300
- [ ] Account 2320 description mentions 3% employer only
- [ ] Both accounts have credit normal balance
- [ ] Header does not allow transactions
- [ ] Detail accounts allow transactions

---

## Summary

This document established the complete liability structure for the default chart of accounts, covering:

- **Liability Header (2000):** Root account for all liabilities
- **Accounts Payable (2100-2102):** Trade payables and other payables with AP control
- **VAT Output (2150):** Sales tax collected, offset against VAT Input
- **Tax Payables (2200-2230):** PAYE withholding, Income Tax, NBT
- **Statutory Payables (2300-2320):** EPF and ETF for Sri Lankan compliance

The liability hierarchy supports double-entry bookkeeping with proper parent-child relationships, header accounts for organization, and critical system accounts for statutory compliance. Sri Lankan-specific accounts (EPF, ETF, PAYE, VAT, NBT) are properly configured with descriptions of rates, deadlines, and remittance procedures.

Next document covers Equity and Revenue Accounts (Tasks 45-48) including owner's equity, retained earnings, and sales revenue structure.
