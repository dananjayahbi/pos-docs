# Tasks 49-50: Expense Accounts

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 08 - Chart of Accounts  
> **Group:** C - Default Chart Setup  
> **Document:** 04 of 04  
> **Tasks Covered:** 49, 50

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [03_Tasks-45-48_Equity-Revenue-Accounts.md](03_Tasks-45-48_Equity-Revenue-Accounts.md)

---

## Document Overview

This document covers the complete expense accounts structure for the default chart of accounts. Expense accounts (5000-5999) track all costs incurred to generate revenue and operate the business. These are temporary accounts with debit normal balances that reduce equity through operations. The expense structure includes Cost of Goods Sold (COGS), salary and wage expenses with Sri Lankan statutory contributions (EPF/ETF), and common operating expenses like rent, utilities, and marketing. Proper expense categorization enables accurate profit calculation and financial analysis.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 49 | Define Expense Header Account | Medium | 15 min |
| 50 | Add Common Expense Accounts | Low | 30 min |

---

## Account Code Numbering System

### Expense Account Range: 5000-5999

The expense accounts follow standard categorization:

| Range | Category | Examples |
|-------|----------|----------|
| 5000-5099 | Expense Header | Main expense grouping |
| 5100-5199 | Cost of Goods Sold | Merchandise costs, freight in |
| 5200-5299 | Personnel Costs | Salaries, wages, EPF/ETF employer portions |
| 5300-5399 | Occupancy Costs | Rent, property maintenance |
| 5400-5499 | Utilities | Electricity, water, internet, phone |
| 5500-5599 | Marketing & Sales | Advertising, promotions, commissions |
| 5600-5699 | Administrative | Office supplies, professional fees |
| 5700-5799 | Depreciation & Amortization | Fixed asset depreciation |
| 5800-5899 | Financial Costs | Bank charges, interest expense |
| 5900-5999 | Other Expenses | Miscellaneous operating expenses |

### Normal Balance
- All expense accounts have a **DEBIT** normal balance
- Increases are recorded as debits
- Decreases are recorded as credits (rare, usually corrections)
- Expenses reduce net income and equity

---

## Account Hierarchy Structure

```
5000 - Expenses [HEADER]
├── 5100 - Cost of Goods Sold
├── 5200 - Personnel Costs [HEADER]
│   ├── 5210 - Salaries & Wages
│   ├── 5220 - EPF Expense (Employer Portion)
│   └── 5230 - ETF Expense (Employer Portion)
├── 5300 - Rent Expense
├── 5400 - Utilities [HEADER]
│   ├── 5410 - Electricity
│   ├── 5420 - Water
│   └── 5430 - Internet & Telephone
├── 5500 - Marketing & Advertising
├── 5600 - Office & Administrative [HEADER]
│   ├── 5610 - Office Supplies
│   ├── 5620 - Professional Fees
│   └── 5630 - Insurance
├── 5700 - Depreciation Expense
├── 5800 - Financial Costs [HEADER]
│   ├── 5810 - Bank Charges
│   └── 5820 - Interest Expense
└── 5900 - Miscellaneous Expenses
```

---

## Task 49: Define Expense Header Account

### Overview
Create the root expense account (code 5000) that serves as the top-level header for all expense accounts in the chart of accounts. This header account groups all business costs and expenses beneath it and cannot have transactions posted directly to it. Expenses are temporary accounts that reduce equity through operations, closed to Retained Earnings at period-end. The expense header appears on the income statement and all sub-accounts roll up to calculate total expenses and net income.

### Dependencies
- Account model exists with MPTT hierarchy support
- Revenue accounts already created (Tasks 47-48)
- Understanding of expense classification and income statement structure

### Instructions

1. **Create expense header account object**
   - Add to `apps/accounting/fixtures/default_coa.json`
   - Model: `accounting.account`
   - Primary key: Auto-increment
   - Code: "5000"
   - Name: "Expenses"

2. **Set account type and classification**
   - Type: EXPENSE (use constant value from Account.TYPE_EXPENSE)
   - Account class: "expense"
   - Purpose: Top-level grouping for all expense accounts

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
   - normal_balance: "debit"
   - current_balance: 0.00
   - Balance increases with debits (expenses incurred)
   - Balance decreases with credits (corrections or reversals)

6. **Add metadata**
   - description: "All costs and expenses incurred in business operations"
   - notes: "Temporary account closed to Retained Earnings at period-end"
   - Income statement presentation: Reduces revenue to calculate net income

### Account Properties

| Property | Value | Explanation |
|----------|-------|-------------|
| code | "5000" | Standard expense header code |
| name | "Expenses" | Clear cost category identification |
| account_type | EXPENSE | Income statement account type |
| is_header | true | Groups sub-accounts, no transactions |
| parent | null | Root of expense hierarchy |
| normal_balance | debit | Expenses increase with debits |

### Expense Classification Concepts

**Operating vs Non-Operating:**
- **Operating Expenses:** Regular business costs (salaries, rent, utilities)
- **Non-Operating Expenses:** Financial costs (interest expense, one-time losses)

**Direct vs Indirect:**
- **Direct Expenses (COGS):** Directly attributable to products sold
- **Indirect Expenses (Overhead):** Support operations, not directly tied to products

**Fixed vs Variable:**
- **Fixed Expenses:** Don't change with sales volume (rent, salaries)
- **Variable Expenses:** Change with activity level (COGS, commissions)

### Income Statement Structure

**Multi-Step Income Statement:**
```
REVENUE
  Sales Revenue                              500,000
                                            --------
Total Revenue                                500,000

COST OF GOODS SOLD                          (300,000)
                                            --------
GROSS PROFIT                                 200,000
                                               40%

OPERATING EXPENSES
  Personnel Costs:
    Salaries & Wages         100,000
    EPF Expense (Employer)    12,000
    ETF Expense (Employer)     3,000
                             --------
  Total Personnel                            115,000

  Rent Expense                                24,000
  Utilities                                    8,000
  Marketing & Advertising                     12,000
  Office & Administrative                      6,000
  Depreciation                                10,000
                                            --------
Total Operating Expenses                    (175,000)
                                            --------
OPERATING INCOME                              25,000

OTHER EXPENSES
  Bank Charges                                 1,000
  Interest Expense                             2,000
                                            --------
Total Other Expenses                         (3,000)
                                            --------
NET INCOME BEFORE TAX                         22,000

Income Tax Expense                           (6,600)
                                            --------
NET INCOME                                    15,400
```

### Expense Recognition Principle

**Accrual Accounting:**
- Recognize expenses when incurred, not when paid
- Match expenses with related revenue (matching principle)
- Example: Recognize salary expense when earned by employee, not when paid

**Expense Recognition Entry:**
```
DR Salaries Expense (5210)         50,000
    CR Salaries Payable (2xxx)                50,000
    [Accrued salaries for month-end]
```

**Payment Entry:**
```
DR Salaries Payable (2xxx)         50,000
    CR Bank Account (1111)                    50,000
    [Payment of accrued salaries]
```

### Period Closing Process

**Year-End Closing for Expenses:**
1. All expense accounts closed to Income Summary
2. Income Summary closed to Retained Earnings
3. Expense accounts reset to zero for new period

**Closing Entry:**
```
DR Income Summary                  500,000
    CR Expenses (5xxx accounts)               500,000
    [Close all expense accounts to Income Summary]

[After all revenue and expenses closed]
DR Retained Earnings (3200)        100,000
    CR Income Summary                         100,000
    [Close Income Summary net loss to Retained Earnings]

OR if profit:

DR Income Summary                  100,000
    CR Retained Earnings (3200)               100,000
    [Close Income Summary net profit to Retained Earnings]
```

### Expected Outcome
- Root expense account created with code 5000
- Header configured to accept child accounts
- Foundation for expense hierarchy established
- Income statement expense section defined
- Connection to period closing process established

### Verification Checklist
- [ ] Account code 5000 defined in fixture
- [ ] Name is "Expenses"
- [ ] Account type is EXPENSE
- [ ] is_header set to true
- [ ] parent set to null
- [ ] normal_balance is "debit"
- [ ] allow_transactions is false
- [ ] Description explains expense concept clearly

---

## Task 50: Add Common Expense Accounts

### Overview
Define comprehensive expense accounts covering the major cost categories for business operations. This includes Cost of Goods Sold (5100) for inventory costs, Personnel Costs with salaries and statutory EPF/ETF employer contributions (5200-5230), Rent Expense (5300), Utilities with detailed breakdowns (5400-5430), Marketing expenses (5500), Office and Administrative costs (5600-5630), Depreciation (5700), Financial costs like bank charges and interest (5800-5820), and Miscellaneous expenses (5900). These accounts integrate with inventory, payroll, and payment systems.

### Dependencies
- Task 49: Expense header account exists
- Parent account 5000 available for linkage
- EPF/ETF Payable accounts exist (Task 44)
- Understanding of expense classification
- Integration with inventory and payroll systems

### Instructions

1. **Create Cost of Goods Sold account (5100)**
   - Code: "5100"
   - Name: "Cost of Goods Sold (COGS)"
   - Type: EXPENSE
   - is_header: false
   - parent: Link to account 5000 (Expenses)

2. **Configure COGS as system account**
   - allow_transactions: true
   - is_active: true
   - is_system: true (inventory integration)
   - normal_balance: "debit"
   - Description: "Direct cost of merchandise sold; integrated with inventory system"

3. **Set COGS metadata**
   - Automatically updated from inventory system
   - Records cost of items sold (not selling price)
   - Key metric for gross profit calculation
   - Inventory valuation method affects COGS (FIFO, weighted average)

4. **Create Personnel Costs header (5200)**
   - Code: "5200"
   - Name: "Personnel Costs"
   - Type: EXPENSE
   - is_header: true
   - parent: Link to account 5000 (Expenses)

5. **Configure Personnel Costs header**
   - is_active: true
   - allow_transactions: false
   - is_system: false
   - normal_balance: "debit"
   - Description: "Employee compensation and statutory employer contributions"

6. **Create Salaries & Wages account (5210)**
   - Code: "5210"
   - Name: "Salaries & Wages"
   - Type: EXPENSE
   - is_header: false
   - parent: Link to account 5200 (Personnel Costs)

7. **Configure Salaries & Wages properties**
   - allow_transactions: true
   - is_active: true
   - is_system: true (payroll integration)
   - normal_balance: "debit"
   - Description: "Employee gross salaries and wages; integrated with payroll system"

8. **Create EPF Expense account (5220)**
   - Code: "5220"
   - Name: "EPF Expense - Employer Contribution"
   - Type: EXPENSE
   - is_header: false
   - parent: Link to account 5200 (Personnel Costs)

9. **Configure EPF Expense as system account**
   - allow_transactions: true
   - is_active: true
   - is_system: true (payroll integration)
   - normal_balance: "debit"
   - Description: "Employer's 12% EPF contribution on employee salaries"

10. **Set EPF Expense metadata**
    - Records employer portion only (12% of gross salary)
    - Employee portion (8%) withheld, not an expense
    - Total 20% credited to EPF Payable (2310)
    - Statutory requirement for Sri Lankan businesses

11. **Create ETF Expense account (5230)**
    - Code: "5230"
    - Name: "ETF Expense - Employer Contribution"
    - Type: EXPENSE
    - is_header: false
    - parent: Link to account 5200 (Personnel Costs)

12. **Configure ETF Expense as system account**
    - allow_transactions: true
    - is_active: true
    - is_system: true (payroll integration)
    - normal_balance: "debit"
    - Description: "Employer's 3% ETF contribution on employee salaries"

13. **Set ETF Expense metadata**
    - Records employer contribution only (3% of gross salary)
    - No employee portion for ETF
    - Credited to ETF Payable (2320)
    - Statutory requirement for Sri Lankan businesses

14. **Create Rent Expense account (5300)**
    - Code: "5300"
    - Name: "Rent Expense"
    - Type: EXPENSE
    - is_header: false
    - parent: Link to account 5000 (Expenses)

15. **Configure Rent Expense properties**
    - allow_transactions: true
    - is_active: true
    - is_system: false
    - normal_balance: "debit"
    - Description: "Monthly rent for business premises and facilities"

16. **Create Utilities header (5400)**
    - Code: "5400"
    - Name: "Utilities"
    - Type: EXPENSE
    - is_header: true
    - parent: Link to account 5000 (Expenses)

17. **Configure Utilities header**
    - is_active: true
    - allow_transactions: false
    - is_system: false
    - normal_balance: "debit"
    - Description: "Utility expenses for business operations"

18. **Create Electricity Expense account (5410)**
    - Code: "5410"
    - Name: "Electricity Expense"
    - Type: EXPENSE
    - is_header: false
    - parent: Link to account 5400 (Utilities)

19. **Configure Electricity properties**
    - allow_transactions: true
    - is_active: true
    - is_system: false
    - normal_balance: "debit"
    - Description: "Electricity and power consumption costs"

20. **Create Water Expense account (5420)**
    - Code: "5420"
    - Name: "Water Expense"
    - Type: EXPENSE
    - is_header: false
    - parent: Link to account 5400 (Utilities)

21. **Configure Water properties**
    - allow_transactions: true
    - is_active: true
    - is_system: false
    - normal_balance: "debit"
    - Description: "Water and sewage service costs"

22. **Create Internet & Telephone account (5430)**
    - Code: "5430"
    - Name: "Internet & Telephone"
    - Type: EXPENSE
    - is_header: false
    - parent: Link to account 5400 (Utilities)

23. **Configure Internet & Telephone properties**
    - allow_transactions: true
    - is_active: true
    - is_system: false
    - normal_balance: "debit"
    - Description: "Internet, phone, and communication service costs"

24. **Create Marketing & Advertising account (5500)**
    - Code: "5500"
    - Name: "Marketing & Advertising"
    - Type: EXPENSE
    - is_header: false
    - parent: Link to account 5000 (Expenses)

25. **Configure Marketing properties**
    - allow_transactions: true
    - is_active: true
    - is_system: false
    - normal_balance: "debit"
    - Description: "Marketing campaigns, advertising, and promotional costs"

26. **Create Office & Administrative header (5600)**
    - Code: "5600"
    - Name: "Office & Administrative"
    - Type: EXPENSE
    - is_header: true
    - parent: Link to account 5000 (Expenses)

27. **Configure Office & Administrative header**
    - is_active: true
    - allow_transactions: false
    - is_system: false
    - normal_balance: "debit"
    - Description: "General office and administrative expenses"

28. **Create Office Supplies account (5610)**
    - Code: "5610"
    - Name: "Office Supplies"
    - Type: EXPENSE
    - is_header: false
    - parent: Link to account 5600 (Office & Administrative)

29. **Configure Office Supplies properties**
    - allow_transactions: true
    - is_active: true
    - is_system: false
    - normal_balance: "debit"
    - Description: "Stationery, printer supplies, and general office materials"

30. **Create Professional Fees account (5620)**
    - Code: "5620"
    - Name: "Professional Fees"
    - Type: EXPENSE
    - is_header: false
    - parent: Link to account 5600 (Office & Administrative)

31. **Configure Professional Fees properties**
    - allow_transactions: true
    - is_active: true
    - is_system: false
    - normal_balance: "debit"
    - Description: "Accounting, legal, consulting, and professional service fees"

32. **Create Insurance Expense account (5630)**
    - Code: "5630"
    - Name: "Insurance Expense"
    - Type: EXPENSE
    - is_header: false
    - parent: Link to account 5600 (Office & Administrative)

33. **Configure Insurance properties**
    - allow_transactions: true
    - is_active: true
    - is_system: false
    - normal_balance: "debit"
    - Description: "Business insurance premiums including property, liability, and vehicle insurance"

34. **Create Depreciation Expense account (5700)**
    - Code: "5700"
    - Name: "Depreciation Expense"
    - Type: EXPENSE
    - is_header: false
    - parent: Link to account 5000 (Expenses)

35. **Configure Depreciation as system account**
    - allow_transactions: true
    - is_active: true
    - is_system: true (fixed asset integration)
    - normal_balance: "debit"
    - Description: "Systematic allocation of fixed asset costs over useful life"

36. **Set Depreciation metadata**
    - Non-cash expense
    - Offsets Accumulated Depreciation (1599)
    - Calculated based on depreciation schedules
    - Different methods: straight-line, declining balance

37. **Create Financial Costs header (5800)**
    - Code: "5800"
    - Name: "Financial Costs"
    - Type: EXPENSE
    - is_header: true
    - parent: Link to account 5000 (Expenses)

38. **Configure Financial Costs header**
    - is_active: true
    - allow_transactions: false
    - is_system: false
    - normal_balance: "debit"
    - Description: "Banking and financing-related expenses"

39. **Create Bank Charges account (5810)**
    - Code: "5810"
    - Name: "Bank Charges & Fees"
    - Type: EXPENSE
    - is_header: false
    - parent: Link to account 5800 (Financial Costs)

40. **Configure Bank Charges properties**
    - allow_transactions: true
    - is_active: true
    - is_system: false
    - normal_balance: "debit"
    - Description: "Bank service charges, transaction fees, and account maintenance costs"

41. **Create Interest Expense account (5820)**
    - Code: "5820"
    - Name: "Interest Expense"
    - Type: EXPENSE
    - is_header: false
    - parent: Link to account 5800 (Financial Costs)

42. **Configure Interest Expense properties**
    - allow_transactions: true
    - is_active: true
    - is_system: false
    - normal_balance: "debit"
    - Description: "Interest on loans, overdrafts, and other borrowings"

43. **Create Miscellaneous Expenses account (5900)**
    - Code: "5900"
    - Name: "Miscellaneous Expenses"
    - Type: EXPENSE
    - is_header: false
    - parent: Link to account 5000 (Expenses)

44. **Configure Miscellaneous Expenses properties**
    - allow_transactions: true
    - is_active: true
    - is_system: false
    - normal_balance: "debit"
    - Description: "Other operating expenses not classified elsewhere"

### Expense Account Summary Table

| Code | Name | Header? | System? | Category | Integration |
|------|------|---------|---------|----------|-------------|
| 5100 | Cost of Goods Sold | No | Yes | COGS | Inventory |
| 5200 | Personnel Costs | Yes | No | Header | N/A |
| 5210 | Salaries & Wages | No | Yes | Personnel | Payroll |
| 5220 | EPF Expense | No | Yes | Personnel | Payroll |
| 5230 | ETF Expense | No | Yes | Personnel | Payroll |
| 5300 | Rent Expense | No | No | Occupancy | Manual |
| 5400 | Utilities | Yes | No | Header | N/A |
| 5410 | Electricity | No | No | Utilities | Manual |
| 5420 | Water | No | No | Utilities | Manual |
| 5430 | Internet & Telephone | No | No | Utilities | Manual |
| 5500 | Marketing & Advertising | No | No | Marketing | Manual |
| 5600 | Office & Administrative | Yes | No | Header | N/A |
| 5610 | Office Supplies | No | No | Admin | Manual |
| 5620 | Professional Fees | No | No | Admin | Manual |
| 5630 | Insurance | No | No | Admin | Manual |
| 5700 | Depreciation | No | Yes | Non-cash | Fixed Assets |
| 5800 | Financial Costs | Yes | No | Header | N/A |
| 5810 | Bank Charges | No | No | Financial | Bank Recon |
| 5820 | Interest Expense | No | No | Financial | Manual |
| 5900 | Miscellaneous | No | No | Other | Manual |

### Cost of Goods Sold (COGS)

**COGS Calculation:**
```
Beginning Inventory                 100,000
Add: Purchases                      500,000
                                   --------
Goods Available for Sale            600,000
Less: Ending Inventory            (150,000)
                                   --------
Cost of Goods Sold                  450,000
```

**Perpetual Inventory Entry (at sale):**
```
DR Cost of Goods Sold (5100)        45,000
    CR Inventory (1301)                       45,000
    [Cost of items sold recorded]
```

**Periodic Inventory Entry (at period-end):**
```
DR Cost of Goods Sold (5100)       500,000
    CR Purchases (temporary)                 500,000
    [Transfer purchases to COGS]

DR Inventory (1301)                150,000
    CR Cost of Goods Sold (5100)             150,000
    [Adjust for ending inventory]
```

### Personnel Costs and Payroll

**Complete Payroll Entry:**
```
DR Salaries & Wages (5210)         100,000  [Gross salary expense]
DR EPF Expense - Employer (5220)    12,000  [12% employer EPF]
DR ETF Expense - Employer (5230)     3,000  [3% employer ETF]
    CR EPF Payable (2310)                     20,000  [8% + 12%]
    CR ETF Payable (2320)                      3,000  [3%]
    CR PAYE Payable (2210)                    10,000  [Income tax]
    CR Bank Account (1111)                    82,000  [Net pay]
```

**Breakdown:**
- Total Cost to Employer: 115,000 (100,000 + 12,000 + 3,000)
- Employee Receives (Net): 82,000
- Statutory Withholdings: 28,000 (EPF 8,000 + PAYE 10,000)
- Employer Statutory: 15,000 (EPF 12,000 + ETF 3,000)

**EPF/ETF Summary:**
- Employee EPF Withheld (8%): 8,000 (from gross salary, not expense)
- Employer EPF Expense (12%): 12,000 (business expense)
- Employer ETF Expense (3%): 3,000 (business expense)
- Total EPF Remittance: 20,000 (to EPF Payable 2310)
- Total ETF Remittance: 3,000 (to ETF Payable 2320)

### Occupancy and Utilities

**Monthly Rent Payment:**
```
DR Rent Expense (5300)              25,000
    CR Bank Account (1111)                    25,000
    [Monthly office rent payment]
```

**Electricity Bill:**
```
DR Electricity Expense (5410)        8,000
DR VAT Input (1250)                  1,440  [18% VAT]
    CR Bank Account (1111)                     9,440
    [Electricity bill payment with VAT]
```

**Telephone & Internet:**
```
DR Internet & Telephone (5430)       5,000
DR VAT Input (1250)                    900
    CR Bank Account (1111)                     5,900
    [Communication services]
```

### Marketing and Advertising

**Advertising Campaign:**
```
DR Marketing & Advertising (5500)   50,000
DR VAT Input (1250)                  9,000
    CR Bank Account (1111)                    59,000
    [Facebook and Google ads campaign]
```

**Promotional Materials:**
```
DR Marketing & Advertising (5500)   15,000
DR VAT Input (1250)                  2,700
    CR Accounts Payable (2101)                17,700
    [Printed flyers and promotional items]
```

### Office and Administrative Expenses

**Office Supplies Purchase:**
```
DR Office Supplies (5610)            3,000
DR VAT Input (1250)                    540
    CR Bank Account (1111)                     3,540
    [Stationery and printer supplies]
```

**Accounting Fees:**
```
DR Professional Fees (5620)         20,000
DR VAT Input (1250)                  3,600
    CR Bank Account (1111)                    23,600
    [Monthly accounting and bookkeeping services]
```

**Insurance Premium:**
```
DR Insurance Expense (5630)         30,000
    CR Bank Account (1111)                    30,000
    [Annual business insurance premium]
```

### Depreciation Expense

**Monthly Depreciation Entry:**
```
DR Depreciation Expense (5700)      10,000
    CR Accumulated Depreciation (1599)        10,000
    [Monthly depreciation on fixed assets]
```

**Depreciation Schedule Example:**
- Equipment (1501): Original cost 100,000, 5-year life, straight-line
- Annual depreciation: 100,000 / 5 = 20,000
- Monthly depreciation: 20,000 / 12 = 1,667

**Fixed Asset Depreciation Calculation:**
```
Asset Category          Cost    Rate    Annual    Monthly
Equipment             100,000    20%     20,000      1,667
Vehicles               80,000    20%     16,000      1,333
Furniture              60,000   12.5%     7,500        625
Computer Equipment     40,000    25%     10,000        833
                      -------           -------     ------
Total                 280,000            53,500      4,458
```

### Financial Costs

**Bank Service Charges:**
```
DR Bank Charges & Fees (5810)        1,500
    CR Bank Account (1111)                     1,500
    [Monthly bank account maintenance fees]
```

**Interest on Loan:**
```
DR Interest Expense (5820)          12,000
    CR Bank Account (1111)                    12,000
    [Quarterly loan interest payment]
```

### Expense Analysis Ratios

**Gross Profit Margin:**
```
Gross Profit Margin = (Revenue - COGS) / Revenue × 100%
Example: (500,000 - 300,000) / 500,000 = 40%
```

**Operating Expense Ratio:**
```
Operating Expense Ratio = Operating Expenses / Revenue × 100%
Example: 175,000 / 500,000 = 35%
```

**Net Profit Margin:**
```
Net Profit Margin = Net Income / Revenue × 100%
Example: 15,400 / 500,000 = 3.08%
```

**Personnel Cost Ratio:**
```
Personnel Cost Ratio = Personnel Costs / Revenue × 100%
Example: 115,000 / 500,000 = 23%
```

### Expected Outcome
- Cost of Goods Sold integrated with inventory system
- Personnel Costs structure with salaries and statutory contributions
- EPF/ETF Expense accounts for employer obligations
- Comprehensive operating expense accounts (rent, utilities, marketing)
- Office and administrative expense breakdown
- Depreciation expense for fixed assets
- Financial costs for banking and interest
- Miscellaneous catch-all account
- Complete expense structure for P&L reporting
- Integration points with payroll and inventory defined

### Verification Checklist
- [ ] Account 5100 (COGS) created as system account
- [ ] Account 5100 parent links to 5000
- [ ] Account 5200 (Personnel Costs) created as header
- [ ] Account 5200 parent links to 5000
- [ ] Account 5210 (Salaries & Wages) created as system account
- [ ] Account 5210 parent links to 5200
- [ ] Account 5220 (EPF Expense) created as system account
- [ ] Account 5220 parent links to 5200
- [ ] Account 5230 (ETF Expense) created as system account
- [ ] Account 5230 parent links to 5200
- [ ] Account 5300 (Rent) created
- [ ] Account 5300 parent links to 5000
- [ ] Account 5400 (Utilities) created as header
- [ ] Account 5400 parent links to 5000
- [ ] Accounts 5410, 5420, 5430 created under Utilities
- [ ] Account 5500 (Marketing) created
- [ ] Account 5500 parent links to 5000
- [ ] Account 5600 (Office & Admin) created as header
- [ ] Account 5600 parent links to 5000
- [ ] Accounts 5610, 5620, 5630 created under Office & Admin
- [ ] Account 5700 (Depreciation) created as system account
- [ ] Account 5700 parent links to 5000
- [ ] Account 5800 (Financial Costs) created as header
- [ ] Account 5800 parent links to 5000
- [ ] Accounts 5810, 5820 created under Financial Costs
- [ ] Account 5900 (Miscellaneous) created
- [ ] Account 5900 parent links to 5000
- [ ] All expense accounts have debit normal balance
- [ ] Headers do not allow transactions
- [ ] Detail accounts allow transactions
- [ ] System accounts (COGS, Salaries, EPF, ETF, Depreciation) marked correctly

---

## Summary

This document completed the expense structure for the default chart of accounts, covering:

- **Expense Header (5000):** Root account for all expenses
- **Cost of Goods Sold (5100):** Inventory cost integration
- **Personnel Costs (5200-5230):** Salaries, EPF expense (12%), ETF expense (3%)
- **Rent Expense (5300):** Occupancy costs
- **Utilities (5400-5430):** Electricity, water, internet/telephone
- **Marketing & Advertising (5500):** Promotional costs
- **Office & Administrative (5600-5630):** Supplies, professional fees, insurance
- **Depreciation Expense (5700):** Fixed asset allocation
- **Financial Costs (5800-5820):** Bank charges, interest expense
- **Miscellaneous Expenses (5900):** Other operating costs

The expense hierarchy supports comprehensive P&L reporting with proper parent-child relationships and system accounts for integration with inventory, payroll, and fixed asset management. Sri Lankan statutory employer contributions (EPF 12%, ETF 3%) are properly structured as separate expense accounts that feed into the corresponding payable accounts.

**Complete Default Chart of Accounts Summary:**
- Assets (1000-1999): Cash, Bank, Receivables, Inventory, Fixed Assets
- Liabilities (2000-2999): Payables, VAT, EPF/ETF/PAYE Payables
- Equity (3000-3999): Capital, Retained Earnings, Drawings
- Revenue (4000-4999): Product Sales, Service Sales, Other Income
- Expenses (5000-5999): COGS, Personnel, Operating Expenses, Depreciation

The chart of accounts is now complete and ready for implementation through JSON fixtures.
