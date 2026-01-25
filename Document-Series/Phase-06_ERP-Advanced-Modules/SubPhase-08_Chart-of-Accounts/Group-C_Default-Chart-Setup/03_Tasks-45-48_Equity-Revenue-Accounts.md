# Tasks 45-48: Equity and Revenue Accounts

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 08 - Chart of Accounts  
> **Group:** C - Default Chart Setup  
> **Document:** 03 of 04  
> **Tasks Covered:** 45, 46, 47, 48

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [02_Tasks-41-44_Liability-Accounts.md](02_Tasks-41-44_Liability-Accounts.md)
- **→ Next Document:** [04_Tasks-49-50_Expense-Accounts.md](04_Tasks-49-50_Expense-Accounts.md)

---

## Document Overview

This document covers equity and revenue account structures for the default chart of accounts. Equity accounts (3000-3999) represent the owner's stake in the business, including capital invested and retained earnings from operations. Revenue accounts (4000-4999) track income earned from business activities, including sales of goods, services, and other income sources. These accounts form the foundation of the income statement and connect to the balance sheet through retained earnings.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 45 | Define Equity Header Account | Medium | 15 min |
| 46 | Add Owner Equity Accounts | Low | 15 min |
| 47 | Define Revenue Header Account | Medium | 15 min |
| 48 | Add Sales Revenue Accounts | Low | 20 min |

---

## Account Code Numbering System

### Equity Account Range: 3000-3999

| Range | Category | Examples |
|-------|----------|----------|
| 3000-3099 | Equity Header | Owner's Equity grouping |
| 3100-3199 | Capital & Retained Earnings | Owner capital, retained earnings |
| 3900-3999 | Drawings/Dividends | Owner withdrawals, dividend distributions |

### Revenue Account Range: 4000-4999

| Range | Category | Examples |
|-------|----------|----------|
| 4000-4099 | Revenue Header | Revenue grouping |
| 4100-4199 | Sales Revenue | Product sales, service revenue |
| 4200-4899 | Other Revenue | Service income, consulting, rentals |
| 4900-4999 | Other Income | Interest income, miscellaneous |

### Normal Balances
- **Equity accounts:** CREDIT normal balance (owner's claim on assets)
- **Revenue accounts:** CREDIT normal balance (increase equity)
- **Drawings:** DEBIT normal balance (contra-equity, reduces owner's equity)

---

## Account Hierarchy Structure

```
3000 - Owner's Equity [HEADER]
├── 3100 - Capital
├── 3200 - Retained Earnings
└── 3900 - Drawings (Owner Withdrawals)

4000 - Revenue [HEADER]
├── 4100 - Sales Revenue [HEADER]
│   ├── 4110 - Product Sales
│   └── 4120 - Service Sales
├── 4200 - Service Revenue [HEADER]
│   ├── 4210 - Consulting Services
│   └── 4220 - Professional Services
└── 4900 - Other Income [HEADER]
    ├── 4910 - Interest Income
    └── 4920 - Miscellaneous Income
```

---

## Task 45: Define Equity Header Account

### Overview
Create the root equity account (code 3000) that serves as the top-level header for all equity accounts in the chart of accounts. This account represents the owner's equity or shareholders' equity in the business. In the accounting equation (Assets = Liabilities + Equity), this account and its children represent the residual interest in assets after deducting liabilities. The equity section shows what the business owes to its owners.

### Dependencies
- Account model exists with MPTT hierarchy support
- Asset and Liability accounts already created
- Understanding of accounting equation and equity concepts

### Instructions

1. **Create equity header account object**
   - Add to `apps/accounting/fixtures/default_coa.json`
   - Model: `accounting.account`
   - Primary key: Auto-increment
   - Code: "3000"
   - Name: "Owner's Equity"

2. **Set account type and classification**
   - Type: EQUITY (use constant value from Account.TYPE_EQUITY)
   - Account class: "equity"
   - Purpose: Top-level grouping for all equity accounts

3. **Configure header properties**
   - is_header: true
   - is_active: true
   - is_system: false
   - allow_transactions: false (no direct posting)

4. **Set hierarchy position**
   - parent: null (top-level account)
   - level: 0 (MPTT root level)
   - Peer to Assets (1000) and Liabilities (2000)

5. **Set balance configuration**
   - normal_balance: "credit"
   - current_balance: 0.00
   - Balance increases with credits (investments, profits)
   - Balance decreases with debits (withdrawals, losses)

6. **Add metadata**
   - description: "Owner's residual interest in business assets after deducting liabilities"
   - notes: "Header account for balance sheet equity section; equity = assets - liabilities"
   - Alternative name: "Shareholders' Equity" for corporations

### Account Properties

| Property | Value | Explanation |
|----------|-------|-------------|
| code | "3000" | Standard equity header code |
| name | "Owner's Equity" | Clear identification for sole proprietor/partnership |
| account_type | EQUITY | Balance sheet account type |
| is_header | true | Groups sub-accounts, no transactions |
| parent | null | Root of equity hierarchy |
| normal_balance | credit | Equity increases with credits |

### Accounting Equation Context

**Fundamental Equation:**
```
Assets = Liabilities + Equity
```

**Rearranged:**
```
Equity = Assets - Liabilities
```

**Example:**
```
Assets:          LKR 1,000,000
Liabilities:     LKR  400,000
----------------------------
Owner's Equity:  LKR  600,000
```

### Equity vs Capital

**Owner's Equity (Broad Term):**
- Total owner's stake in business
- Includes all equity accounts
- Changes with profits, losses, investments, withdrawals

**Capital (Specific Account):**
- Owner's initial and additional investments
- Direct cash or asset contributions
- Relatively stable unless new capital injected

### Business Type Variations

**Sole Proprietorship:**
- Owner's Equity
- Capital
- Drawings

**Partnership:**
- Partners' Equity
- Partner A Capital
- Partner B Capital
- Partner A Drawings
- Partner B Drawings

**Corporation:**
- Shareholders' Equity
- Share Capital/Common Stock
- Retained Earnings
- Dividends

**Note:** Default chart uses sole proprietorship structure; can be adapted for other business types.

### Expected Outcome
- Root equity account created with code 3000
- Header configured to accept child accounts
- Foundation for equity hierarchy established
- Balance sheet equity section defined

### Verification Checklist
- [ ] Account code 3000 defined in fixture
- [ ] Name is "Owner's Equity"
- [ ] Account type is EQUITY
- [ ] is_header set to true
- [ ] parent set to null
- [ ] normal_balance is "credit"
- [ ] allow_transactions is false
- [ ] Description explains equity concept clearly

---

## Task 46: Add Owner Equity Accounts

### Overview
Define specific equity accounts that track the owner's investment and accumulated profits. Capital (3100) records the owner's initial and additional investments in the business. Retained Earnings (3200) accumulates net income from operations over time and is a system account automatically updated by period closing processes. Drawings (3900) tracks owner withdrawals and has a debit balance as it reduces equity.

### Dependencies
- Task 45: Equity header account exists
- Parent account 3000 available for linkage
- Understanding of period closing and profit distribution

### Instructions

1. **Create Capital account (3100)**
   - Code: "3100"
   - Name: "Capital"
   - Type: EQUITY
   - is_header: false
   - parent: Link to account 3000 (Owner's Equity)

2. **Configure Capital properties**
   - allow_transactions: true
   - is_active: true
   - is_system: false
   - normal_balance: "credit"
   - Description: "Owner's capital contributions and investments in the business"

3. **Set Capital metadata**
   - Records initial business investment
   - Additional capital injections
   - Relatively permanent
   - Not frequently adjusted

4. **Create Retained Earnings account (3200)**
   - Code: "3200"
   - Name: "Retained Earnings"
   - Type: EQUITY
   - is_header: false
   - parent: Link to account 3000 (Owner's Equity)

5. **Configure Retained Earnings as system account**
   - allow_transactions: true
   - is_active: true
   - is_system: true (automatic updates)
   - normal_balance: "credit"
   - Description: "Cumulative net income retained in the business; updated automatically on period close"

6. **Set Retained Earnings metadata**
   - Accumulates all profit and loss
   - Updated by period closing process
   - Net Income - Drawings = Retained Earnings increase
   - System account: Do not delete

7. **Create Drawings account (3900)**
   - Code: "3900"
   - Name: "Drawings (Owner Withdrawals)"
   - Type: EQUITY
   - is_header: false
   - parent: Link to account 3000 (Owner's Equity)

8. **Configure Drawings as contra-equity**
   - allow_transactions: true
   - is_active: true
   - is_system: false
   - normal_balance: "debit" (contra-equity)
   - Description: "Owner withdrawals and personal expenses; reduces equity"

9. **Set Drawings metadata**
   - Debit normal balance (opposite of equity)
   - Tracks owner withdrawals
   - Closed to Retained Earnings at year-end
   - Similar to dividends in corporations

### Owner Equity Account Details

| Code | Name | Header? | System? | Normal Balance | Purpose |
|------|------|---------|---------|----------------|---------|
| 3100 | Capital | No | No | Credit | Owner investments |
| 3200 | Retained Earnings | No | Yes | Credit | Accumulated profits |
| 3900 | Drawings | No | No | Debit (contra) | Owner withdrawals |

### Capital Account Usage

**Initial Investment:**
```
DR Bank Account (1111)            500,000
    CR Capital (3100)                        500,000
    [Owner's initial capital investment]
```

**Additional Capital Contribution:**
```
DR Equipment (1501)               100,000
    CR Capital (3100)                        100,000
    [Owner contributed equipment]
```

**Capital Increases With:**
- Cash invested by owner
- Property contributed to business
- Additional investments

**Capital is NOT affected by:**
- Profits and losses (go to Retained Earnings)
- Day-to-day operations
- Sales and expenses

### Retained Earnings Account

**Purpose:**
- Accumulates net income over business life
- Bridge between income statement and balance sheet
- Shows profit reinvested in business

**Period Closing Process:**
1. Close all revenue accounts to Income Summary
2. Close all expense accounts to Income Summary
3. Close Income Summary to Retained Earnings
4. Close Drawings to Retained Earnings

**Year-End Closing Entry (Example):**
```
DR Revenue (4xxx)                  800,000
    CR Income Summary                        800,000
    [Close revenue accounts]

DR Income Summary                  600,000
    CR Expense (5xxx)                        600,000
    [Close expense accounts]

DR Income Summary                  200,000
    CR Retained Earnings (3200)              200,000
    [Transfer net income]

DR Retained Earnings (3200)         50,000
    CR Drawings (3900)                        50,000
    [Close drawings to retained earnings]
```

**Retained Earnings Flow:**
```
Beginning Retained Earnings
+ Net Income for Period
- Drawings/Dividends
= Ending Retained Earnings
```

### Drawings (Owner Withdrawals)

**Purpose:**
- Track owner's personal withdrawals
- Separate from business expenses
- Reduces owner's equity

**Recording Drawings:**
```
DR Drawings (3900)                 10,000
    CR Bank Account (1111)                    10,000
    [Owner withdrawal for personal use]
```

**Drawings vs Salary:**
- Sole proprietors don't receive "salary"
- Drawings are not business expenses
- Don't affect profit calculation
- Closed to Retained Earnings at year-end

**Common Drawing Transactions:**
- Cash withdrawals for personal use
- Personal expenses paid by business
- Business assets taken for personal use
- Owner's personal tax payments

### Statement of Changes in Equity

**Annual Reconciliation:**
```
Owner's Equity - Beginning Balance:        400,000
Add: Capital Contributions                  50,000
Add: Net Income (from P&L)                 200,000
Less: Drawings                            (80,000)
------------------------------------------------------
Owner's Equity - Ending Balance:           570,000
```

**Components:**
- Capital: 500,000 (400,000 + 100,000 + 50,000 - 50,000)
- Retained Earnings: 70,000 (0 + 200,000 - 80,000 - 50,000)
- Drawings: 0 (closed to Retained Earnings)

### Balance Sheet Presentation

**Equity Section:**
```
LIABILITIES & OWNER'S EQUITY

Current Liabilities                        150,000
Long-term Liabilities                      100,000
                                          --------
Total Liabilities                         250,000

Owner's Equity:
  Capital                     500,000
  Retained Earnings            70,000
                              --------
Total Owner's Equity                      570,000
                                          ========
Total Liabilities & Equity                820,000
```

### Expected Outcome
- Capital account for owner investments
- Retained Earnings as system account for accumulated profits
- Drawings account as contra-equity for withdrawals
- Clear hierarchy under Owner's Equity (3000)
- Foundation for period closing process

### Verification Checklist
- [ ] Account 3100 (Capital) created
- [ ] Account 3100 parent links to 3000
- [ ] Account 3100 has credit normal balance
- [ ] Account 3200 (Retained Earnings) created
- [ ] Account 3200 marked as system account
- [ ] Account 3200 parent links to 3000
- [ ] Account 3200 has credit normal balance
- [ ] Account 3900 (Drawings) created
- [ ] Account 3900 parent links to 3000
- [ ] Account 3900 has DEBIT normal balance (contra-equity)
- [ ] All accounts allow transactions

---

## Task 47: Define Revenue Header Account

### Overview
Create the root revenue account (code 4000) that serves as the top-level header for all revenue and income accounts in the chart of accounts. Revenue represents income earned from business operations and is a temporary account that is closed to Retained Earnings at period-end. Revenue accounts have credit balances and increase equity through profitable operations. This header organizes all income sources including sales, services, and other income.

### Dependencies
- Account model exists with MPTT hierarchy support
- Equity accounts already created (connection to retained earnings)
- Understanding of revenue recognition principles

### Instructions

1. **Create revenue header account object**
   - Add to `apps/accounting/fixtures/default_coa.json`
   - Model: `accounting.account`
   - Primary key: Auto-increment
   - Code: "4000"
   - Name: "Revenue"

2. **Set account type and classification**
   - Type: REVENUE (use constant value from Account.TYPE_REVENUE)
   - Account class: "revenue" or "income"
   - Purpose: Top-level grouping for all revenue accounts

3. **Configure header properties**
   - is_header: true
   - is_active: true
   - is_system: false
   - allow_transactions: false (no direct posting)

4. **Set hierarchy position**
   - parent: null (top-level account)
   - level: 0 (MPTT root level)
   - Income statement account (temporary)

5. **Set balance configuration**
   - normal_balance: "credit"
   - current_balance: 0.00
   - Balance increases with credits (revenue earned)
   - Balance decreases with debits (returns, discounts)

6. **Add metadata**
   - description: "Income earned from business operations including sales and services"
   - notes: "Temporary account closed to Retained Earnings at period-end"
   - Income statement presentation: Top line of P&L

### Account Properties

| Property | Value | Explanation |
|----------|-------|-------------|
| code | "4000" | Standard revenue header code |
| name | "Revenue" | Clear income category identification |
| account_type | REVENUE | Income statement account type |
| is_header | true | Groups sub-accounts, no transactions |
| parent | null | Root of revenue hierarchy |
| normal_balance | credit | Revenue increases with credits |

### Revenue Recognition Principles

**Accrual Accounting:**
- Recognize revenue when earned, not when cash received
- Delivery of goods or completion of service
- Amount can be reasonably measured
- Collection is reasonably assured

**Cash Accounting (simpler for SMEs):**
- Recognize revenue when cash received
- Simpler but less accurate
- Acceptable for small businesses in Sri Lanka

**Journal Entry for Sale:**
```
DR Accounts Receivable (1201)     118,000
    CR Sales Revenue (4110)                  100,000
    CR VAT Output (2150)                      18,000
    [Sale on credit with VAT]
```

### Income Statement Context

**Income Statement Structure:**
```
INCOME STATEMENT
For the Year Ended December 31, 2026

REVENUE
  Sales Revenue                              500,000
  Service Revenue                            200,000
  Other Income                                10,000
                                            --------
Total Revenue                                710,000

COST OF GOODS SOLD                          (300,000)
                                            --------
GROSS PROFIT                                 410,000

OPERATING EXPENSES
  Salaries & Wages                          (150,000)
  Rent                                       (60,000)
  Utilities                                  (20,000)
  Other Expenses                             (50,000)
                                            --------
Total Operating Expenses                    (280,000)
                                            --------
NET INCOME                                   130,000
```

### Temporary vs Permanent Accounts

**Temporary Accounts (Closed Annually):**
- Revenue accounts (4xxx)
- Expense accounts (5xxx)
- Drawings (3900)
- Reset to zero at year-end
- Balances transfer to Retained Earnings

**Permanent Accounts (Never Closed):**
- Asset accounts (1xxx)
- Liability accounts (2xxx)
- Equity accounts (3xxx except Drawings)
- Carry forward to next period
- Accumulate over business life

### Expected Outcome
- Root revenue account created with code 4000
- Header configured to accept child accounts
- Foundation for revenue hierarchy established
- Income statement top-line category defined
- Connection to period closing process established

### Verification Checklist
- [ ] Account code 4000 defined in fixture
- [ ] Name is "Revenue"
- [ ] Account type is REVENUE
- [ ] is_header set to true
- [ ] parent set to null
- [ ] normal_balance is "credit"
- [ ] allow_transactions is false
- [ ] Description explains revenue concept clearly

---

## Task 48: Add Sales Revenue Accounts

### Overview
Define specific revenue accounts that track income from different business activities. Sales Revenue header (4100) organizes revenue from product and service sales. Product Sales (4110) records income from merchandise sold, Service Sales (4120) tracks service income, and Other Income (4900) captures miscellaneous revenue like interest, discounts received, and gains. These accounts integrate with the POS and invoicing systems to automatically record sales transactions.

### Dependencies
- Task 47: Revenue header account exists
- Parent account 4000 available for linkage
- Understanding of business revenue streams
- VAT Output account exists for tax calculations

### Instructions

1. **Create Sales Revenue header (4100)**
   - Code: "4100"
   - Name: "Sales Revenue"
   - Type: REVENUE
   - is_header: true
   - parent: Link to account 4000 (Revenue)

2. **Configure Sales Revenue header**
   - is_active: true
   - allow_transactions: false (header only)
   - is_system: false
   - normal_balance: "credit"
   - Description: "Revenue from sale of goods and products"

3. **Create Product Sales account (4110)**
   - Code: "4110"
   - Name: "Product Sales"
   - Type: REVENUE
   - is_header: false
   - parent: Link to account 4100 (Sales Revenue)

4. **Configure Product Sales as system account**
   - allow_transactions: true
   - is_active: true
   - is_system: true (POS integration)
   - normal_balance: "credit"
   - Description: "Revenue from sale of merchandise and products; integrated with POS system"

5. **Set Product Sales metadata**
   - Primary revenue account for retail business
   - Integration with POS system
   - Automatic posting from sales transactions
   - Excludes VAT (recorded separately)

6. **Create Service Sales account (4120)**
   - Code: "4120"
   - Name: "Service Sales"
   - Type: REVENUE
   - is_header: false
   - parent: Link to account 4100 (Sales Revenue)

7. **Configure Service Sales properties**
   - allow_transactions: true
   - is_active: true
   - is_system: false
   - normal_balance: "credit"
   - Description: "Revenue from services provided to customers"

8. **Set Service Sales metadata**
   - For service-based businesses
   - Professional services, consulting, repairs
   - Installation, maintenance, support
   - May not apply VAT depending on service type

9. **Create Other Income header (4900)**
   - Code: "4900"
   - Name: "Other Income"
   - Type: REVENUE
   - is_header: true
   - parent: Link to account 4000 (Revenue)

10. **Configure Other Income header**
    - is_active: true
    - allow_transactions: false (header only)
    - is_system: false
    - normal_balance: "credit"
    - Description: "Non-operating income and miscellaneous revenue"

11. **Create Interest Income account (4910)**
    - Code: "4910"
    - Name: "Interest Income"
    - Type: REVENUE
    - is_header: false
    - parent: Link to account 4900 (Other Income)

12. **Configure Interest Income properties**
    - allow_transactions: true
    - is_active: true
    - is_system: false
    - normal_balance: "credit"
    - Description: "Interest earned on bank deposits and investments"

13. **Create Miscellaneous Income account (4920)**
    - Code: "4920"
    - Name: "Miscellaneous Income"
    - Type: REVENUE
    - is_header: false
    - parent: Link to account 4900 (Other Income)

14. **Configure Miscellaneous Income properties**
    - allow_transactions: true
    - is_active: true
    - is_system: false
    - normal_balance: "credit"
    - Description: "Other miscellaneous income including discounts received and gains on asset disposal"

### Sales Revenue Account Details

| Code | Name | Header? | System? | Purpose | VAT? |
|------|------|---------|---------|---------|------|
| 4100 | Sales Revenue | Yes | No | Revenue grouping | N/A |
| 4110 | Product Sales | No | Yes | Merchandise sales | Usually |
| 4120 | Service Sales | No | No | Service income | Varies |
| 4900 | Other Income | Yes | No | Miscellaneous grouping | N/A |
| 4910 | Interest Income | No | No | Bank interest | No |
| 4920 | Miscellaneous Income | No | No | Other revenue | Varies |

### Product Sales (Retail Revenue)

**Typical Transactions:**
- POS daily sales
- Credit sales to customers
- Online/webstore sales
- Wholesale sales

**POS Sale with Cash:**
```
DR Cash on Hand (1101)             118,000
    CR Product Sales (4110)                  100,000
    CR VAT Output (2150)                      18,000
    [Daily POS sales with VAT]
```

**Credit Sale with Invoice:**
```
DR Accounts Receivable (1201)     118,000
    CR Product Sales (4110)                  100,000
    CR VAT Output (2150)                      18,000
    [Customer invoice with VAT]
```

**Sales Returns:**
```
DR Sales Returns (contra-revenue)   10,000
DR VAT Output (2150)                 1,800
    CR Accounts Receivable (1201)             11,800
    [Customer return of defective goods]
```

**Sales Discounts:**
```
DR Cash (1101)                      98,000
DR Sales Discounts (contra-revenue)  2,000
    CR Accounts Receivable (1201)            100,000
    [Customer paid with early payment discount]
```

### Service Sales (Service Revenue)

**Service Types:**
- Professional consulting
- IT support and maintenance
- Repair services
- Installation and setup
- Training and education
- Subscription services

**Service Completion:**
```
DR Accounts Receivable (1201)      59,000
    CR Service Sales (4120)                   50,000
    CR VAT Output (2150)                       9,000
    [Consulting services rendered]
```

**Monthly Subscription:**
```
DR Accounts Receivable (1201)      11,800
    CR Service Sales (4120)                   10,000
    CR VAT Output (2150)                       1,800
    [Monthly maintenance contract]
```

### Other Income Sources

**Interest Income:**
- Bank account interest
- Savings account returns
- Fixed deposit interest
- Investment income

**Interest Earned:**
```
DR Bank Account (1111)               2,500
    CR Interest Income (4910)                  2,500
    [Quarterly interest credited by bank]
```

**Miscellaneous Income Examples:**
- Discounts received from suppliers
- Gains on asset disposal
- Rental income from property
- Commissions earned
- Scrap sales
- Insurance claim proceeds

**Purchase Discount Received:**
```
DR Accounts Payable (2101)         100,000
    CR Bank Account (1111)                    98,000
    CR Miscellaneous Income (4920)             2,000
    [Early payment discount from supplier]
```

**Asset Disposal Gain:**
```
DR Cash (1101)                      80,000
DR Accumulated Depreciation (1599)  60,000
    CR Equipment (1501)                       100,000
    CR Miscellaneous Income (4920)             40,000
    [Sold equipment above book value]
```

### Revenue Recognition Timing

**Point of Sale (Retail):**
- Revenue recognized when goods transferred to customer
- Cash or credit sale
- Immediate recognition

**Service Completion:**
- Revenue recognized when service completed
- For long-term projects, may use percentage-of-completion
- Milestone-based recognition

**Subscription/Recurring:**
- Revenue recognized over service period
- Monthly/quarterly recognition
- Deferred revenue for prepayments

### VAT Implications

**VAT on Sales:**
- Most goods and services subject to 18% VAT
- Revenue recorded net of VAT
- VAT Output recorded separately in liability account

**Sale Breakdown:**
```
Total Invoice Amount:     118,000
Less: VAT (18%)           (18,000)
---------------------------------
Net Revenue:              100,000
```

**VAT Exempt Items:**
- Basic food items (rice, bread, etc.)
- Certain medical supplies
- Educational services
- Financial services

### Income Statement Presentation

**Single-Step Format:**
```
REVENUE
  Product Sales                    500,000
  Service Sales                    150,000
  Other Income                      10,000
                                  --------
Total Revenue                      660,000
```

**Multi-Step Format:**
```
SALES REVENUE
  Product Sales                    500,000
  Less: Sales Returns              (10,000)
  Less: Sales Discounts             (5,000)
                                  --------
Net Sales                          485,000

SERVICE REVENUE                    150,000
                                  --------
TOTAL OPERATING REVENUE            635,000

OTHER INCOME
  Interest Income                    2,500
  Miscellaneous Income               7,500
                                  --------
Total Other Income                  10,000
                                  --------
TOTAL REVENUE                      645,000
```

### POS Integration

**Automatic Revenue Recognition:**
- POS system posts sales to Product Sales (4110)
- Daily batch processing
- Sales summarized by payment method
- VAT calculated and recorded automatically

**Daily POS Batch Entry:**
```
DR Cash on Hand (1101)             354,000  [Cash sales]
DR Card Settlement (1120)          236,000  [Card sales]
    CR Product Sales (4110)                  500,000
    CR VAT Output (2150)                      90,000
    [Daily POS sales batch]
```

### Expected Outcome
- Sales Revenue header organizing product and service sales
- Product Sales as system account integrated with POS
- Service Sales for service-based revenue
- Other Income header with Interest and Miscellaneous accounts
- Foundation for revenue recognition and reporting
- VAT integration established

### Verification Checklist
- [ ] Account 4100 (Sales Revenue) created as header
- [ ] Account 4100 parent links to 4000
- [ ] Account 4110 (Product Sales) created
- [ ] Account 4110 marked as system account
- [ ] Account 4110 parent links to 4100
- [ ] Account 4120 (Service Sales) created
- [ ] Account 4120 parent links to 4100
- [ ] Account 4900 (Other Income) created as header
- [ ] Account 4900 parent links to 4000
- [ ] Account 4910 (Interest Income) created
- [ ] Account 4910 parent links to 4900
- [ ] Account 4920 (Miscellaneous Income) created
- [ ] Account 4920 parent links to 4900
- [ ] All revenue accounts have credit normal balance
- [ ] Headers do not allow transactions
- [ ] Detail accounts allow transactions

---

## Summary

This document established the complete equity and revenue structures for the default chart of accounts, covering:

**Equity Accounts (3000-3999):**
- **Owner's Equity Header (3000):** Root account for equity
- **Capital (3100):** Owner investments and contributions
- **Retained Earnings (3200):** Accumulated profits (system account)
- **Drawings (3900):** Owner withdrawals (contra-equity, debit balance)

**Revenue Accounts (4000-4999):**
- **Revenue Header (4000):** Root account for all income
- **Sales Revenue (4100-4120):** Product and service sales with POS integration
- **Other Income (4900-4920):** Interest and miscellaneous income

The equity accounts connect the balance sheet to the income statement through Retained Earnings, which accumulates net income from revenue and expense accounts. Revenue accounts are temporary and closed to Retained Earnings at period-end. The structure supports double-entry bookkeeping with proper parent-child relationships and system accounts for automated processes.

Next document covers Expense Accounts (Tasks 49-50) including cost of goods sold, salaries with EPF/ETF, and operating expenses.
