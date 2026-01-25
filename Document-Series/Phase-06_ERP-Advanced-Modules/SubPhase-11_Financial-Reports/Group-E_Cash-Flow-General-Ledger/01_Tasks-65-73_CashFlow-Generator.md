# Tasks 65-73: CashFlowGenerator Implementation

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 11 - Financial Reports  
> **Group:** E - Cash Flow and General Ledger  
> **Document:** 01 of 02  
> **Tasks Covered:** 65, 66, 67, 68, 69, 70, 71, 72, 73

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-74-80_GeneralLedger-Generator.md](02_Tasks-74-80_GeneralLedger-Generator.md)
- **← Previous Group:** [../Group-D_Balance-Sheet/](../Group-D_Balance-Sheet/)
- **→ Next Group:** [../Group-F_Export-Testing-Documentation/](../Group-F_Export-Testing-Documentation/)

---

## Document Overview

This document covers the implementation of the Cash Flow Statement generator, one of Sri Lanka's essential financial reports required by regulatory authorities. The Cash Flow Statement tracks the movement of cash and cash equivalents through operating, investing, and financing activities using the indirect method, starting from net income and adjusting for non-cash items and working capital changes.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 65 | Create CashFlowGenerator | High | 45 min |
| 66 | Add Operating Activities Calc | High | 60 min |
| 67 | Add Investing Activities Calc | Medium | 35 min |
| 68 | Add Financing Activities Calc | Medium | 35 min |
| 69 | Add Net Cash Change Calc | Low | 15 min |
| 70 | Add Beginning Cash Balance | Low | 15 min |
| 71 | Add Ending Cash Balance | Low | 15 min |
| 72 | Create CF HTML Template | Medium | 40 min |
| 73 | Create CF API Endpoint | Low | 20 min |

---

## Task 65: Create CashFlowGenerator

### Overview
Create the CashFlowGenerator class that extends BaseReportGenerator to produce Cash Flow Statements. This generator implements the indirect method, which is the most commonly used approach in Sri Lanka, starting with net income and adjusting for non-cash items and changes in working capital.

### Dependencies
- BaseReportGenerator class exists
- Financial models (Account, Journal, JournalEntry)
- Accounting period models
- Report configuration infrastructure

### Instructions

1. **Create cash_flow_generator.py file**
   - Navigate to `apps/finance/reports/generators/`
   - Create new file named `cash_flow_generator.py`
   - This will contain the Cash Flow Statement generation logic

2. **Import required modules**
   - Import Django ORM components
   - Import BaseReportGenerator
   - Import financial models (Account, Journal, JournalEntry)
   - Import decimal utilities
   - Import datetime utilities
   - Import Q objects for complex queries

3. **Define CashFlowGenerator class**
   - Inherit from BaseReportGenerator
   - Add comprehensive class docstring
   - Explain indirect method calculation
   - Document Sri Lankan accounting context

4. **Initialize report_type attribute**
   - Set report_type = 'cash_flow'
   - Used for report identification and routing

5. **Initialize report_name attribute**
   - Set report_name = 'Cash Flow Statement'
   - User-facing report title

6. **Define __init__ method**
   - Accept tenant, start_date, end_date parameters
   - Call parent __init__ method
   - Initialize data storage dictionaries
   - Set up calculation flags

7. **Create _initialize_data_structures method**
   - Initialize operating_activities dictionary
   - Initialize investing_activities dictionary
   - Initialize financing_activities dictionary
   - Initialize cash_summary dictionary
   - Set all initial values to Decimal('0.00')

8. **Create _validate_date_range method**
   - Verify start_date is before end_date
   - Check dates are within accounting periods
   - Validate tenant's fiscal year alignment
   - Raise ValidationError for invalid ranges

9. **Create _get_net_income method**
   - Query Income Statement data
   - Calculate net income for the period
   - Handle revenue and expense accounts
   - Return net income as starting point

10. **Create generate method skeleton**
    - Override parent generate method
    - Call _initialize_data_structures
    - Call _validate_date_range
    - Placeholder for activity calculations
    - Return structured data dictionary

11. **Add error handling**
    - Wrap queries in try-except blocks
    - Handle missing account mappings
    - Log calculation errors
    - Provide meaningful error messages

12. **Update generators/__init__.py**
    - Import CashFlowGenerator
    - Add to __all__ list
    - Register in generator registry

### CashFlowGenerator Class Structure

```
┌──────────────────────────────────────────────────┐
│         CashFlowGenerator Class                  │
├──────────────────────────────────────────────────┤
│ Attributes:                                      │
│  • report_type = 'cash_flow'                     │
│  • report_name = 'Cash Flow Statement'           │
│  • tenant (Tenant)                               │
│  • start_date (Date)                             │
│  • end_date (Date)                               │
│  • operating_activities (Dict)                   │
│  • investing_activities (Dict)                   │
│  • financing_activities (Dict)                   │
│  • cash_summary (Dict)                           │
│                                                  │
│ Methods:                                         │
│  • __init__(tenant, start_date, end_date)        │
│  • _initialize_data_structures()                 │
│  • _validate_date_range()                        │
│  • _get_net_income()                             │
│  • generate() → Dict                             │
│                                                  │
│ Inherited from BaseReportGenerator:              │
│  • _format_currency(amount)                      │
│  • _calculate_percentage(part, total)            │
│  • _get_accounting_period()                      │
└──────────────────────────────────────────────────┘
```

### Cash Flow Statement Structure (Indirect Method)

```
┌────────────────────────────────────────────────────────────┐
│              CASH FLOW STATEMENT                           │
│         For Period: [Start Date] to [End Date]             │
├────────────────────────────────────────────────────────────┤
│                                                            │
│ OPERATING ACTIVITIES                                       │
│   Net Income                                    XXX,XXX.XX │
│   Adjustments for non-cash items:                          │
│     + Depreciation                              XX,XXX.XX  │
│     + Amortization                              XX,XXX.XX  │
│     +/- Changes in Working Capital:                        │
│       - Increase in Accounts Receivable       (XX,XXX.XX) │
│       + Decrease in Inventory                   XX,XXX.XX  │
│       + Increase in Accounts Payable            XX,XXX.XX  │
│       + Increase in EPF/ETF Payable             XX,XXX.XX  │
│       + Increase in VAT Payable                 XX,XXX.XX  │
│                                               ───────────  │
│   Net Cash from Operating Activities            XXX,XXX.XX │
│                                                            │
│ INVESTING ACTIVITIES                                       │
│   - Purchase of Property & Equipment          (XX,XXX.XX) │
│   - Purchase of Investments                   (XX,XXX.XX) │
│   + Sale of Property & Equipment                XX,XXX.XX  │
│   + Sale of Investments                         XX,XXX.XX  │
│                                               ───────────  │
│   Net Cash from Investing Activities          (XX,XXX.XX) │
│                                                            │
│ FINANCING ACTIVITIES                                       │
│   + Proceeds from Bank Loans                    XX,XXX.XX  │
│   - Loan Repayments                           (XX,XXX.XX) │
│   + Owner Capital Contributions                 XX,XXX.XX  │
│   - Owner Drawings                            (XX,XXX.XX) │
│   - Dividend Payments                         (XX,XXX.XX) │
│                                               ───────────  │
│   Net Cash from Financing Activities            XX,XXX.XX  │
│                                                            │
│ NET INCREASE/(DECREASE) IN CASH                 XX,XXX.XX  │
│ CASH AT BEGINNING OF PERIOD                    XXX,XXX.XX │
│                                               ───────────  │
│ CASH AT END OF PERIOD                          XXX,XXX.XX │
│                                               ═══════════  │
└────────────────────────────────────────────────────────────┘
```

### Data Structures

```python
# operating_activities dictionary structure
{
    'net_income': Decimal('0.00'),
    'depreciation': Decimal('0.00'),
    'amortization': Decimal('0.00'),
    'accounts_receivable_change': Decimal('0.00'),
    'inventory_change': Decimal('0.00'),
    'prepaid_expenses_change': Decimal('0.00'),
    'accounts_payable_change': Decimal('0.00'),
    'accrued_expenses_change': Decimal('0.00'),
    'epf_payable_change': Decimal('0.00'),
    'etf_payable_change': Decimal('0.00'),
    'vat_payable_change': Decimal('0.00'),
    'subtotal': Decimal('0.00')
}

# investing_activities dictionary structure
{
    'ppe_purchases': Decimal('0.00'),
    'ppe_sales': Decimal('0.00'),
    'investment_purchases': Decimal('0.00'),
    'investment_sales': Decimal('0.00'),
    'subtotal': Decimal('0.00')
}

# financing_activities dictionary structure
{
    'loan_proceeds': Decimal('0.00'),
    'loan_repayments': Decimal('0.00'),
    'capital_contributions': Decimal('0.00'),
    'owner_drawings': Decimal('0.00'),
    'dividend_payments': Decimal('0.00'),
    'subtotal': Decimal('0.00')
}

# cash_summary dictionary structure
{
    'net_change': Decimal('0.00'),
    'beginning_balance': Decimal('0.00'),
    'ending_balance': Decimal('0.00')
}
```

### Indirect Method Explanation

```
Why Indirect Method?
══════════════════════════════════════════════

1. Most Common in Sri Lanka
   - Used by 95%+ of businesses
   - Easier to prepare from accrual records
   - Starts with existing Income Statement data

2. Reconciles Net Income to Cash
   Net Income (Accrual)  →  Adjust  →  Cash from Operations
   
3. Shows Non-Cash Items Impact
   - Depreciation (expense but no cash out)
   - Amortization (expense but no cash out)
   - Working capital changes

4. Regulatory Acceptance
   - Accepted by IRD
   - Required by Sri Lanka Accounting Standards
   - Compatible with SLAS requirements
```

### Sri Lankan Context Considerations

| Context | Implementation | Notes |
|---------|---------------|-------|
| EPF/ETF Payables | Track as working capital | Monthly obligations affect cash |
| VAT Payable | Include in working capital | Collected but not yet paid to IRD |
| Bank Loans | Common financing activity | Track proceeds and repayments |
| Owner Drawings | Replace dividends for partnerships | Common in SME structures |
| Fixed Deposits | Consider as cash equivalents | If maturity ≤ 3 months |
| Foreign Currency | Convert at period-end rates | For import/export businesses |

### Expected Outcome
- Functional CashFlowGenerator class
- Proper inheritance from BaseReportGenerator
- Initialized data structures
- Date validation logic
- Net income calculation
- Foundation for activity calculations

### Verification Checklist
- [ ] cash_flow_generator.py file created
- [ ] CashFlowGenerator class defined
- [ ] Inherits from BaseReportGenerator
- [ ] report_type and report_name set
- [ ] __init__ method implemented
- [ ] _initialize_data_structures method created
- [ ] _validate_date_range method created
- [ ] _get_net_income method created
- [ ] generate method skeleton created
- [ ] Error handling added
- [ ] Imported in __init__.py
- [ ] Added to generator registry

---

## Task 66: Add Operating Activities Calculation

### Overview
Implement the operating activities section calculation using the indirect method. Start with net income from the Income Statement, then adjust for non-cash expenses (depreciation, amortization) and changes in working capital accounts (receivables, inventory, payables, EPF/ETF, VAT).

### Dependencies
- Task 65: Create CashFlowGenerator
- Account model with account type classifications
- Journal entries for the reporting period
- Beginning balance sheet data

### Instructions

1. **Create _calculate_operating_activities method**
   - Define method in CashFlowGenerator class
   - Return dictionary with all operating activity components
   - Use indirect method approach

2. **Get net income as starting point**
   - Call _get_net_income method
   - Store in operating_activities['net_income']
   - This is the accrual basis profit

3. **Calculate depreciation expense**
   - Query depreciation expense accounts
   - Sum all depreciation entries for period
   - Add back to net income (non-cash expense)
   - Store in operating_activities['depreciation']

4. **Calculate amortization expense**
   - Query amortization expense accounts
   - Sum all amortization entries for period
   - Add back to net income (non-cash expense)
   - Store in operating_activities['amortization']

5. **Calculate accounts receivable change**
   - Get AR balance at start_date
   - Get AR balance at end_date
   - Calculate change: end_balance - start_balance
   - Increase in AR = cash outflow (negative)
   - Decrease in AR = cash inflow (positive)
   - Store in operating_activities['accounts_receivable_change']

6. **Calculate inventory change**
   - Get inventory balance at start_date
   - Get inventory balance at end_date
   - Calculate change: end_balance - start_balance
   - Increase in inventory = cash outflow (negative)
   - Decrease in inventory = cash inflow (positive)
   - Store in operating_activities['inventory_change']

7. **Calculate prepaid expenses change**
   - Get prepaid expenses balance at start_date
   - Get prepaid expenses balance at end_date
   - Calculate change
   - Store in operating_activities['prepaid_expenses_change']

8. **Calculate accounts payable change**
   - Get AP balance at start_date
   - Get AP balance at end_date
   - Calculate change: end_balance - start_balance
   - Increase in AP = cash inflow (positive)
   - Decrease in AP = cash outflow (negative)
   - Store in operating_activities['accounts_payable_change']

9. **Calculate accrued expenses change**
   - Get accrued expenses at start_date
   - Get accrued expenses at end_date
   - Calculate change
   - Store in operating_activities['accrued_expenses_change']

10. **Calculate EPF payable change (Sri Lanka specific)**
    - Get EPF payable balance at start_date
    - Get EPF payable balance at end_date
    - Calculate change
    - Increase = cash retained (positive)
    - Store in operating_activities['epf_payable_change']

11. **Calculate ETF payable change (Sri Lanka specific)**
    - Get ETF payable balance at start_date
    - Get ETF payable balance at end_date
    - Calculate change
    - Store in operating_activities['etf_payable_change']

12. **Calculate VAT payable change (Sri Lanka specific)**
    - Get VAT payable balance at start_date
    - Get VAT payable balance at end_date
    - Calculate change
    - Increase = cash collected but not remitted (positive)
    - Store in operating_activities['vat_payable_change']

13. **Calculate operating activities subtotal**
    - Sum all components
    - operating_activities['subtotal'] = sum of all above
    - This is net cash from operating activities

14. **Create _get_account_balance helper method**
    - Accept account_code and date parameters
    - Query journal entries up to date
    - Calculate cumulative balance
    - Handle debit/credit properly based on account type
    - Return balance as Decimal

15. **Create _get_account_type_balance helper method**
    - Accept account_type and date parameters
    - Query all accounts of that type
    - Sum their balances
    - Return total as Decimal

16. **Update generate method**
    - Call _calculate_operating_activities
    - Store result in report data
    - Ensure proper ordering of calculations

### Operating Activities Calculation Flow

```
┌──────────────────────────────────────────────────────────┐
│         OPERATING ACTIVITIES CALCULATION FLOW            │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  Step 1: Start with Net Income (Accrual Basis)          │
│          ↓                                               │
│  Step 2: Add Back Non-Cash Expenses                      │
│          + Depreciation                                  │
│          + Amortization                                  │
│          ↓                                               │
│  Step 3: Adjust for Current Asset Changes                │
│          - Increase in Accounts Receivable               │
│          + Decrease in Accounts Receivable               │
│          - Increase in Inventory                         │
│          + Decrease in Inventory                         │
│          - Increase in Prepaid Expenses                  │
│          + Decrease in Prepaid Expenses                  │
│          ↓                                               │
│  Step 4: Adjust for Current Liability Changes            │
│          + Increase in Accounts Payable                  │
│          - Decrease in Accounts Payable                  │
│          + Increase in Accrued Expenses                  │
│          - Decrease in Accrued Expenses                  │
│          + Increase in EPF/ETF Payable                   │
│          - Decrease in EPF/ETF Payable                   │
│          + Increase in VAT Payable                       │
│          - Decrease in VAT Payable                       │
│          ↓                                               │
│  Result: Net Cash from Operating Activities              │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### Working Capital Change Logic

```
Current Assets: DECREASE = Cash Inflow (+)
                INCREASE = Cash Outflow (-)

Examples:
  Accounts Receivable decreased 100,000
  → Collected cash from customers → +100,000
  
  Inventory increased 50,000
  → Paid cash to purchase inventory → -50,000

Current Liabilities: INCREASE = Cash Inflow (+)
                     DECREASE = Cash Outflow (-)

Examples:
  Accounts Payable increased 75,000
  → Delayed payment to suppliers → +75,000
  
  EPF Payable decreased 25,000
  → Paid EPF to government → -25,000
```

### Working Capital Accounts Mapping

| Account Category | Account Type | Change Impact | Sri Lankan Context |
|-----------------|--------------|---------------|-------------------|
| Accounts Receivable | Current Asset | Increase = Negative | Customer credit sales |
| Inventory | Current Asset | Increase = Negative | Stock purchases |
| Prepaid Expenses | Current Asset | Increase = Negative | Advance payments (rent, insurance) |
| Accounts Payable | Current Liability | Increase = Positive | Supplier credit purchases |
| Accrued Expenses | Current Liability | Increase = Positive | Unpaid utilities, salaries |
| EPF Payable | Current Liability | Increase = Positive | Employee provident fund |
| ETF Payable | Current Liability | Increase = Positive | Employee trust fund |
| VAT Payable | Current Liability | Increase = Positive | Collected VAT not yet remitted |

### Sample Calculation Example

```
Operating Activities Calculation
══════════════════════════════════════════════

Starting Point:
  Net Income                                     500,000.00

Add Back Non-Cash Expenses:
  + Depreciation Expense                          75,000.00
  + Amortization Expense                          10,000.00
                                               ───────────
  Subtotal                                       585,000.00

Adjust for Changes in Current Assets:
  - Increase in Accounts Receivable             (80,000.00)
  + Decrease in Inventory                         30,000.00
  - Increase in Prepaid Expenses                 (5,000.00)
                                               ───────────
  Subtotal                                       530,000.00

Adjust for Changes in Current Liabilities:
  + Increase in Accounts Payable                  45,000.00
  + Increase in Accrued Expenses                  12,000.00
  + Increase in EPF Payable                       15,000.00
  + Increase in ETF Payable                        3,750.00
  + Increase in VAT Payable                       25,000.00
                                               ───────────
Net Cash from Operating Activities              630,750.00
                                               ═══════════
```

### Sri Lankan EPF/ETF Calculation

```
EPF/ETF as Working Capital Items
══════════════════════════════════════════════

Monthly EPF/ETF Accrual:
  Employee Salary: 100,000.00
  Employer EPF (12%): 12,000.00
  Employer ETF (3%): 3,000.00
  
  → Expense recorded: 15,000.00
  → Liability recorded: 15,000.00
  → Cash not yet paid

If payment delayed by 30 days:
  EPF/ETF Payable increases by 15,000.00
  → Positive adjustment to operating cash flow
  → Cash retained in business temporarily

When paid to EPF/ETF department:
  EPF/ETF Payable decreases
  → Negative adjustment to operating cash flow
  → Cash leaves the business
```

### VAT Impact on Cash Flow

```
VAT Collection and Remittance
══════════════════════════════════════════════

Sale Transaction:
  Sale Amount: 100,000.00
  VAT (18%): 18,000.00
  Total Cash Collected: 118,000.00
  
  → Revenue recorded: 100,000.00
  → VAT Payable: 18,000.00

If VAT not yet paid to IRD:
  VAT Payable increased by 18,000.00
  → Cash collected but retained
  → Positive adjustment in cash flow

When remitted to IRD:
  VAT Payable decreased
  → Cash paid to government
  → Negative adjustment in cash flow
```

### Expected Outcome
- Complete operating activities calculation
- Proper indirect method implementation
- Non-cash expense adjustments
- Working capital change calculations
- Sri Lankan specific items (EPF/ETF/VAT)
- Accurate net cash from operating activities

### Verification Checklist
- [ ] _calculate_operating_activities method created
- [ ] Net income retrieved correctly
- [ ] Depreciation calculated and added back
- [ ] Amortization calculated and added back
- [ ] Accounts receivable change calculated
- [ ] Inventory change calculated
- [ ] Prepaid expenses change calculated
- [ ] Accounts payable change calculated
- [ ] Accrued expenses change calculated
- [ ] EPF payable change calculated
- [ ] ETF payable change calculated
- [ ] VAT payable change calculated
- [ ] Operating activities subtotal calculated
- [ ] _get_account_balance helper created
- [ ] _get_account_type_balance helper created
- [ ] Proper sign conventions applied
- [ ] Method called in generate()

---

## Task 67: Add Investing Activities Calculation

### Overview
Implement the investing activities section calculation, which tracks cash flows from the purchase and sale of long-term assets. This includes property, plant & equipment (PP&E), investments, and other capital expenditures. Investing activities typically show cash outflows as businesses invest in their infrastructure.

### Dependencies
- Task 66: Add Operating Activities Calc
- Fixed asset accounts configured
- Investment accounts configured
- Asset purchase and disposal transactions recorded

### Instructions

1. **Create _calculate_investing_activities method**
   - Define method in CashFlowGenerator class
   - Return dictionary with investing activity components
   - Focus on capital expenditures and asset sales

2. **Calculate PP&E purchases**
   - Query fixed asset addition transactions
   - Filter by date range (start_date to end_date)
   - Include land, buildings, equipment, vehicles
   - Exclude depreciation entries
   - Sum all capital expenditures
   - Store as negative value (cash outflow)
   - Store in investing_activities['ppe_purchases']

3. **Calculate PP&E sales**
   - Query fixed asset disposal transactions
   - Get proceeds from asset sales (not book value)
   - Filter by date range
   - Sum all proceeds
   - Store as positive value (cash inflow)
   - Store in investing_activities['ppe_sales']

4. **Calculate investment purchases**
   - Query investment account additions
   - Include securities, bonds, fixed deposits (>3 months)
   - Filter by date range
   - Sum purchase amounts
   - Store as negative value (cash outflow)
   - Store in investing_activities['investment_purchases']

5. **Calculate investment sales**
   - Query investment account reductions
   - Get proceeds from investment sales
   - Filter by date range
   - Sum sale proceeds
   - Store as positive value (cash inflow)
   - Store in investing_activities['investment_sales']

6. **Calculate investing activities subtotal**
   - Sum all investing components
   - investing_activities['subtotal'] = sum of all above
   - Usually negative (more purchases than sales)

7. **Create _get_ppe_transactions helper method**
   - Accept transaction_type ('purchase' or 'sale')
   - Query fixed asset accounts
   - Filter by transaction type and date range
   - Identify through journal entry memos or accounts
   - Return total amount

8. **Create _get_investment_transactions helper method**
   - Accept transaction_type ('purchase' or 'sale')
   - Query investment accounts
   - Distinguish from short-term cash equivalents
   - Return total amount

9. **Handle gain/loss on asset sales**
   - Note: Gains/losses already in net income
   - Don't double-count in investing section
   - Only report actual cash proceeds
   - Document calculation approach

10. **Update generate method**
    - Call _calculate_investing_activities
    - Store result in report data
    - Maintain proper calculation sequence

### Investing Activities Structure

```
┌──────────────────────────────────────────────────────────┐
│            INVESTING ACTIVITIES SECTION                  │
├──────────────────────────────────────────────────────────┤
│                                                          │
│ Cash Outflows (Negative):                               │
│   - Purchase of Property & Equipment                     │
│   - Purchase of Investments                              │
│   - Acquisition of Intangible Assets                     │
│                                                          │
│ Cash Inflows (Positive):                                 │
│   + Proceeds from Sale of Property & Equipment           │
│   + Proceeds from Sale of Investments                    │
│   + Maturity of Long-term Investments                    │
│                                                          │
│ Net Cash Used in Investing Activities                    │
│   (Typically negative - more purchases than sales)       │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### PP&E Transaction Identification

```
Identifying PP&E Purchases
══════════════════════════════════════════════

Journal Entry for Asset Purchase:
  DR  Equipment (Asset)           500,000.00
  DR  VAT Recoverable (Asset)      90,000.00
      CR  Bank (Asset)                         590,000.00

Cash Flow Impact: -590,000.00 (total cash paid)

Identifying PP&E Sales
══════════════════════════════════════════════

Journal Entry for Asset Sale:
  DR  Bank (Asset)                250,000.00
      CR  Equipment (Asset)                    200,000.00
      CR  Gain on Sale (Income)                 50,000.00

Cash Flow Impact: +250,000.00 (cash received)

Note: The 50,000 gain is already in Net Income
      Don't adjust in operating activities
      Only show cash proceeds in investing activities
```

### Asset Categories to Track

| Asset Category | Account Names | Sri Lankan Context |
|---------------|---------------|-------------------|
| Land | Land, Land Improvements | Capital asset, no depreciation |
| Buildings | Buildings, Building Improvements | Office, warehouse, retail space |
| Equipment | Machinery, Equipment, Tools | Manufacturing, POS systems |
| Vehicles | Motor Vehicles, Delivery Vans | Company cars, delivery fleet |
| Furniture | Office Furniture, Fixtures | Desks, shelving, displays |
| Computers | Computer Equipment, IT Assets | Servers, workstations, tablets |
| Investments | Fixed Deposits (>3mo), Bonds | Long-term savings, securities |

### Sample Investing Activities Calculation

```
Investing Activities Calculation
══════════════════════════════════════════════

Equipment Purchases:
  January: New POS system                    (150,000.00)
  March: Delivery van                        (2,500,000.00)
  June: Refrigeration unit                     (450,000.00)
  September: Computer equipment                (180,000.00)
                                           ──────────────
  Total PP&E Purchases                      (3,280,000.00)

Asset Sales:
  April: Old delivery vehicle                   300,000.00
  August: Surplus equipment                      75,000.00
                                           ──────────────
  Total PP&E Sales                              375,000.00

Investment Activities:
  Fixed Deposit (1-year term)                  (500,000.00)
  
Net Cash Used in Investing Activities       (3,405,000.00)
                                           ══════════════
```

### Investment vs Cash Equivalents

```
Classification Guidelines
══════════════════════════════════════════════

Cash Equivalents (NOT Investing Activities):
  ✓ Fixed deposits ≤ 3 months maturity
  ✓ Treasury bills ≤ 3 months
  ✓ Money market funds
  → Included in cash balance, not separate line item

Investments (ARE Investing Activities):
  ✓ Fixed deposits > 3 months maturity
  ✓ Corporate bonds
  ✓ Equity investments
  ✓ Government securities > 3 months
  → Separate investing activity transactions

Sri Lanka Example:
  3-month FD at 8% → Cash Equivalent
  1-year FD at 12% → Investment (Investing Activity)
```

### Capital Expenditure Tracking

```
Capital vs Operating Expenditure
══════════════════════════════════════════════

Capital Expenditure (Investing Activity):
  • Purchases > capitalization threshold (e.g., 10,000 LKR)
  • Expected useful life > 1 year
  • Creates or improves long-term asset
  • Examples: Equipment, vehicles, buildings
  → Shows in investing activities

Operating Expenditure (Operating Activity):
  • Routine maintenance and repairs
  • Small tools and supplies
  • Below capitalization threshold
  • Examples: Office supplies, minor repairs
  → Already included in net income calculation
```

### Sri Lankan Business Examples

```
Retail Business Investing Activities
══════════════════════════════════════════════

Store Expansion Project:
  - Building renovation               (1,500,000.00)
  - New shelving and displays           (250,000.00)
  - Additional POS terminals            (180,000.00)
  - Security camera system               (120,000.00)
  - Air conditioning units               (350,000.00)
                                     ──────────────
  Total Capital Expenditure           (2,400,000.00)

Asset Disposals:
  + Sale of old equipment                  85,000.00
                                     ──────────────
Net Investing Activities              (2,315,000.00)
                                     ══════════════

Manufacturing Business Investing Activities
══════════════════════════════════════════════

Capacity Expansion:
  - New production machinery          (5,000,000.00)
  - Factory building extension        (3,500,000.00)
  - Generator backup system             (800,000.00)
  - Quality testing equipment           (450,000.00)
                                     ──────────────
  Total Capital Expenditure           (9,750,000.00)

Asset Disposals:
  + Sale of old machinery                 400,000.00
                                     ──────────────
Net Investing Activities              (9,350,000.00)
                                     ══════════════
```

### Expected Outcome
- Complete investing activities calculation
- PP&E purchase tracking
- PP&E sale proceeds calculation
- Investment purchase/sale tracking
- Proper cash flow classification
- Sri Lankan business context

### Verification Checklist
- [ ] _calculate_investing_activities method created
- [ ] PP&E purchases calculated
- [ ] PP&E sales calculated
- [ ] Investment purchases calculated
- [ ] Investment sales calculated
- [ ] Investing activities subtotal calculated
- [ ] _get_ppe_transactions helper created
- [ ] _get_investment_transactions helper created
- [ ] Gain/loss handling documented
- [ ] Cash vs investment distinction clear
- [ ] Method called in generate()
- [ ] Proper sign conventions (negative for purchases)

---

## Task 68: Add Financing Activities Calculation

### Overview
Implement the financing activities section calculation, which tracks cash flows from debt and equity financing. This includes bank loans, loan repayments, owner capital contributions, owner drawings, and dividend payments. Sri Lankan SMEs commonly use bank financing and owner equity rather than complex capital structures.

### Dependencies
- Task 67: Add Investing Activities Calc
- Loan accounts configured
- Owner equity accounts configured
- Loan and equity transactions recorded

### Instructions

1. **Create _calculate_financing_activities method**
   - Define method in CashFlowGenerator class
   - Return dictionary with financing activity components
   - Focus on debt and equity transactions

2. **Calculate loan proceeds**
   - Query bank loan accounts for new borrowing
   - Include term loans, overdrafts, lines of credit
   - Filter by date range (start_date to end_date)
   - Look for increases in loan liability accounts
   - Sum all loan disbursements received
   - Store as positive value (cash inflow)
   - Store in financing_activities['loan_proceeds']

3. **Calculate loan repayments**
   - Query loan payment transactions
   - Include principal repayments only (not interest)
   - Interest is already in operating activities via net income
   - Filter by date range
   - Sum all principal payments
   - Store as negative value (cash outflow)
   - Store in financing_activities['loan_repayments']

4. **Calculate owner capital contributions**
   - Query owner equity accounts for additions
   - Include cash injections by owners/partners
   - Filter by date range
   - Sum all capital contributions
   - Store as positive value (cash inflow)
   - Store in financing_activities['capital_contributions']

5. **Calculate owner drawings**
   - Query drawing accounts for withdrawals
   - Track owner withdrawals for personal use
   - Common in partnerships and sole proprietorships
   - Filter by date range
   - Sum all drawings
   - Store as negative value (cash outflow)
   - Store in financing_activities['owner_drawings']

6. **Calculate dividend payments**
   - Query dividend accounts for payments
   - More common in private limited companies
   - Less common in partnerships (use drawings instead)
   - Filter by date range
   - Sum all dividend payments
   - Store as negative value (cash outflow)
   - Store in financing_activities['dividend_payments']

7. **Calculate financing activities subtotal**
   - Sum all financing components
   - financing_activities['subtotal'] = sum of all above
   - Can be positive or negative depending on financing strategy

8. **Create _get_loan_transactions helper method**
   - Accept transaction_type ('proceeds' or 'repayment')
   - Query loan liability accounts
   - Distinguish between principal and interest
   - Filter by date range
   - Return total amount

9. **Create _separate_principal_interest helper method**
   - Accept loan payment transaction
   - Split payment into principal and interest components
   - Interest goes to operating activities (via net income)
   - Principal goes to financing activities
   - Return principal amount only

10. **Create _get_equity_transactions helper method**
    - Accept transaction_type ('contribution' or 'withdrawal')
    - Query owner equity and drawing accounts
    - Handle different business structures (sole proprietor, partnership, Ltd)
    - Return total amount

11. **Handle business structure variations**
    - Sole proprietorship: Focus on owner drawings
    - Partnership: Track multiple partner drawings
    - Private Ltd: Focus on dividends, may have owner loans
    - Document which accounts to use for each structure

12. **Update generate method**
    - Call _calculate_financing_activities
    - Store result in report data
    - Maintain proper calculation sequence

### Financing Activities Structure

```
┌──────────────────────────────────────────────────────────┐
│            FINANCING ACTIVITIES SECTION                  │
├──────────────────────────────────────────────────────────┤
│                                                          │
│ Cash Inflows (Positive):                                 │
│   + Proceeds from Bank Loans                             │
│   + Proceeds from Lines of Credit                        │
│   + Owner Capital Contributions                          │
│   + Share Capital Issuance (if applicable)               │
│                                                          │
│ Cash Outflows (Negative):                                │
│   - Loan Principal Repayments                            │
│   - Owner Drawings                                       │
│   - Dividend Payments                                    │
│                                                          │
│ Net Cash from/(Used in) Financing Activities             │
│   (Positive = net borrowing/contributions)               │
│   (Negative = net repayments/distributions)              │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### Loan Principal vs Interest

```
Separating Principal and Interest
══════════════════════════════════════════════

Monthly Loan Payment: 50,000.00
  Principal portion: 35,000.00
  Interest portion: 15,000.00

Cash Flow Treatment:
  ✓ Interest (15,000.00)
    → Already deducted in net income calculation
    → Part of operating activities (indirect method)
    → No separate adjustment needed
    
  ✓ Principal (35,000.00)
    → Reduction of liability, not an expense
    → NOT in net income
    → Shows as cash outflow in financing activities

Journal Entry:
  DR  Loan Payable (Liability)       35,000.00
  DR  Interest Expense (Expense)     15,000.00
      CR  Bank (Asset)                           50,000.00
```

### Loan Types in Sri Lanka

| Loan Type | Typical Use | Repayment | Cash Flow Treatment |
|-----------|-------------|-----------|-------------------|
| Term Loan | Capital purchases | Monthly principal + interest | Proceeds (+), Repayments (-) |
| Overdraft | Working capital | Interest only, principal flexible | Drawings (+), Repayments (-) |
| Pawning Loan | Short-term cash | Lump sum repayment | Proceeds (+), Repayment (-) |
| Lease Finance | Vehicle/equipment | Monthly installments | Principal in financing |
| Import Loan | Inventory purchase | Short-term, trade-linked | Proceeds (+), Repayment (-) |

### Owner Equity Transactions

```
Business Structure Variations
══════════════════════════════════════════════

Sole Proprietorship:
  Owner Capital Account
  Owner Drawings Account
  
  Capital Injection:
    DR  Bank                     100,000.00
        CR  Owner Capital                    100,000.00
    → Financing Inflow: +100,000.00
  
  Owner Withdrawal:
    DR  Owner Drawings            25,000.00
        CR  Bank                              25,000.00
    → Financing Outflow: -25,000.00

Partnership:
  Partner A Capital, Partner B Capital
  Partner A Drawings, Partner B Drawings
  
  Track each partner separately
  Sum all capital contributions
  Sum all partner drawings
  
Private Limited Company:
  Share Capital Account
  Retained Earnings
  Dividends Payable
  
  Capital Injection (Share Issuance):
    DR  Bank                     500,000.00
        CR  Share Capital                    500,000.00
    → Financing Inflow: +500,000.00
  
  Dividend Payment:
    DR  Dividends Payable         75,000.00
        CR  Bank                              75,000.00
    → Financing Outflow: -75,000.00
```

### Sample Financing Activities Calculation

```
Financing Activities Calculation
══════════════════════════════════════════════

Loan Transactions:
  January: New term loan received            1,500,000.00
  April: Overdraft facility used               300,000.00
  Total Loan Proceeds                        1,800,000.00

  Monthly term loan payments (principal):
    12 months × 35,000                        (420,000.00)
  Overdraft repayment (partial):              (150,000.00)
  Total Loan Repayments                       (570,000.00)

Owner Equity Transactions:
  March: Owner capital injection               200,000.00
  Monthly drawings: 12 months × 30,000        (360,000.00)

Dividend Payments:
  June: Interim dividend                      (100,000.00)
  December: Final dividend                    (150,000.00)
  Total Dividends                             (250,000.00)

Net Cash from Financing Activities             820,000.00
                                             ════════════

Interpretation: Net borrowing and capital 
contributions exceeded withdrawals and dividends
```

### Sri Lankan SME Patterns

```
Typical Financing Patterns by Business Type
══════════════════════════════════════════════

Small Retail Shop (Sole Proprietor):
  ✓ Owner capital for startup
  ✓ Pawning loans for inventory
  ✓ Monthly drawings for living expenses
  ✗ Rarely use term loans
  ✗ No dividends

Medium Manufacturing (Partnership):
  ✓ Partner capital contributions
  ✓ Term loans for machinery
  ✓ Overdraft for working capital
  ✓ Partner drawings (instead of salary)
  ✗ No dividends (partnership structure)

Large Retail Chain (Pvt Ltd):
  ✓ Share capital from founders/investors
  ✓ Multiple term loans for expansion
  ✓ Bank overdraft facility
  ✓ Dividend payments to shareholders
  ✗ Directors may take salary (operating) not drawings
```

### Leasing vs Loan Financing

```
Lease Finance Treatment
══════════════════════════════════════════════

Finance Lease (Capital Lease):
  Similar to loan financing
  
  Initial Recognition:
    DR  Vehicle (Asset)           2,000,000.00
        CR  Lease Liability                   2,000,000.00
  → NOT a financing activity (no cash yet)
  
  Monthly Payment:
    DR  Lease Liability (Principal) 45,000.00
    DR  Interest Expense            20,000.00
        CR  Bank                              65,000.00
  → Principal: Financing Activity (-45,000.00)
  → Interest: Operating Activity (via net income)

Operating Lease:
  Treated as rental expense
  → Included in operating activities via net income
  → Not shown in financing activities
```

### Expected Outcome
- Complete financing activities calculation
- Loan proceeds tracking
- Principal repayment calculation
- Owner contribution/drawing tracking
- Dividend payment tracking
- Sri Lankan business structure handling

### Verification Checklist
- [ ] _calculate_financing_activities method created
- [ ] Loan proceeds calculated
- [ ] Loan repayments calculated (principal only)
- [ ] Capital contributions calculated
- [ ] Owner drawings calculated
- [ ] Dividend payments calculated
- [ ] Financing activities subtotal calculated
- [ ] _get_loan_transactions helper created
- [ ] _separate_principal_interest helper created
- [ ] _get_equity_transactions helper created
- [ ] Business structure variations handled
- [ ] Principal vs interest separation documented
- [ ] Method called in generate()

---

## Task 69: Add Net Cash Change Calculation

### Overview
Calculate the net change in cash by summing the three activity sections (operating, investing, financing). This represents the total increase or decrease in cash for the period and is the key output of the Cash Flow Statement.

### Dependencies
- Task 66: Add Operating Activities Calc
- Task 67: Add Investing Activities Calc
- Task 68: Add Financing Activities Calc

### Instructions

1. **Create _calculate_net_cash_change method**
   - Define method in CashFlowGenerator class
   - Return net cash change as Decimal
   - Sum the three activity subtotals

2. **Retrieve operating activities subtotal**
   - Get operating_activities['subtotal']
   - This is net cash from operating activities
   - Usually positive for profitable businesses

3. **Retrieve investing activities subtotal**
   - Get investing_activities['subtotal']
   - This is net cash used in investing activities
   - Usually negative (more purchases than sales)

4. **Retrieve financing activities subtotal**
   - Get financing_activities['subtotal']
   - This is net cash from financing activities
   - Can be positive (net borrowing) or negative (net repayments)

5. **Calculate total net change**
   - Sum all three subtotals
   - net_change = operating + investing + financing
   - Store in cash_summary['net_change']

6. **Add validation checks**
   - Verify all three subtotals are calculated
   - Handle None or missing values
   - Ensure result is Decimal type
   - Log calculation for audit trail

7. **Create summary display helper**
   - Format the three-section summary
   - Show clear breakdown
   - Highlight positive/negative amounts
   - Prepare for reporting

8. **Update generate method**
   - Call _calculate_net_cash_change
   - Store result in report data
   - Ensure called after all three activity sections

### Net Cash Change Calculation Flow

```
┌──────────────────────────────────────────────────────────┐
│            NET CASH CHANGE CALCULATION                   │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  Net Cash from Operating Activities          XXX,XXX.XX │
│                                                          │
│  Net Cash Used in Investing Activities      (XX,XXX.XX) │
│                                                          │
│  Net Cash from Financing Activities           XX,XXX.XX │
│                                           ─────────────  │
│                                                          │
│  NET INCREASE/(DECREASE) IN CASH             XX,XXX.XX  │
│                                           ═════════════  │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### Calculation Examples

```
Example 1: Growing Business with Expansion
══════════════════════════════════════════════

Net Cash from Operating Activities              650,000.00
Net Cash Used in Investing Activities        (1,200,000.00)
Net Cash from Financing Activities              800,000.00
                                             ─────────────
NET INCREASE IN CASH                            250,000.00
                                             ═════════════

Interpretation:
  • Strong operating cash flow (+650K)
  • Heavy capital investment (-1,200K)
  • Funded by loans/equity (+800K)
  • Overall cash increased by 250K


Example 2: Mature Business with Deleveraging
══════════════════════════════════════════════

Net Cash from Operating Activities              920,000.00
Net Cash Used in Investing Activities          (180,000.00)
Net Cash Used in Financing Activities          (650,000.00)
                                             ─────────────
NET INCREASE IN CASH                             90,000.00
                                             ═════════════

Interpretation:
  • Strong operating cash flow (+920K)
  • Modest capital investment (-180K)
  • Paying down debt + dividends (-650K)
  • Small cash increase overall


Example 3: Startup with Negative Operations
══════════════════════════════════════════════

Net Cash Used in Operating Activities          (350,000.00)
Net Cash Used in Investing Activities          (800,000.00)
Net Cash from Financing Activities            1,500,000.00
                                             ─────────────
NET INCREASE IN CASH                            350,000.00
                                             ═════════════

Interpretation:
  • Operating losses burning cash (-350K)
  • Building infrastructure (-800K)
  • Funded by capital injection (+1,500K)
  • Cash cushion increased by 350K


Example 4: Distressed Business
══════════════════════════════════════════════

Net Cash from Operating Activities              120,000.00
Net Cash from Investing Activities              450,000.00
Net Cash Used in Financing Activities          (850,000.00)
                                             ─────────────
NET DECREASE IN CASH                           (280,000.00)
                                             ═════════════

Interpretation:
  • Weak operating cash flow (+120K)
  • Selling assets to raise cash (+450K)
  • Debt repayments required (-850K)
  • Overall cash declined by 280K
```

### Three-Section Summary Format

```
┌──────────────────────────────────────────────────────────┐
│            CASH FLOW SUMMARY BY ACTIVITY                 │
├──────────────────────────────────────────────────────────┤
│                                                          │
│ OPERATING ACTIVITIES                                     │
│   Description: Cash from core business operations        │
│   Amount: XXX,XXX.XX                                     │
│   Typical Sign: Positive for profitable business         │
│                                                          │
│ INVESTING ACTIVITIES                                     │
│   Description: Cash from capital expenditures            │
│   Amount: (XX,XXX.XX)                                    │
│   Typical Sign: Negative (buying more than selling)      │
│                                                          │
│ FINANCING ACTIVITIES                                     │
│   Description: Cash from debt and equity                 │
│   Amount: XX,XXX.XX                                      │
│   Typical Sign: Positive (growth) or Negative (mature)   │
│                                                          │
│ NET CHANGE                                               │
│   Total: XX,XXX.XX                                       │
│   Interpretation: See analysis below                     │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### Validation Rules

| Validation Check | Rule | Action |
|-----------------|------|--------|
| All sections calculated | All three subtotals exist | Raise error if missing |
| Decimal precision | Result has 2 decimal places | Format to 2 decimals |
| Reasonable magnitude | Check against cash balance | Warn if exceeds cash balance significantly |
| Sign logic | Validate typical patterns | Warn on unusual patterns |
| Zero result | Sum equals zero | Flag for review (unlikely but possible) |

### Interpretation Guidelines

```
Positive Net Change: Cash Increased
══════════════════════════════════════════════

Good Scenarios:
  ✓ Strong operations funding growth
  ✓ Successful capital raising
  ✓ Asset sales combined with profits

Concerning Scenarios:
  ✗ Large loan proceeds masking operation losses
  ✗ Asset liquidation to survive
  ✗ Unsustainable borrowing

Negative Net Change: Cash Decreased
══════════════════════════════════════════════

Good Scenarios:
  ✓ Strategic investments in growth
  ✓ Paying down expensive debt
  ✓ Returning capital to owners (if strong cash position)

Concerning Scenarios:
  ✗ Operating losses draining cash
  ✗ Over-investment without funding
  ✗ Loan repayments exceeding generation
```

### Expected Outcome
- Net cash change calculated accurately
- Sum of three activity sections
- Proper validation and error handling
- Clear presentation format
- Foundation for cash reconciliation

### Verification Checklist
- [ ] _calculate_net_cash_change method created
- [ ] Operating activities subtotal retrieved
- [ ] Investing activities subtotal retrieved
- [ ] Financing activities subtotal retrieved
- [ ] Total net change calculated
- [ ] Result stored in cash_summary['net_change']
- [ ] Validation checks implemented
- [ ] Summary display helper created
- [ ] Proper Decimal handling
- [ ] Method called in generate()
- [ ] Result matches sum of three sections

---

## Task 70: Add Beginning Cash Balance

### Overview
Retrieve and calculate the beginning cash balance for the reporting period. This represents the total cash and cash equivalents at the start of the period (start_date) and serves as the baseline for the cash flow reconciliation.

### Dependencies
- Task 69: Add Net Cash Change Calc
- Cash and cash equivalent accounts configured
- Beginning balance sheet data available

### Instructions

1. **Create _get_beginning_cash_balance method**
   - Define method in CashFlowGenerator class
   - Return beginning cash balance as Decimal
   - Query cash accounts at start_date

2. **Define cash and cash equivalent accounts**
   - Cash on hand account
   - Bank current accounts
   - Bank savings accounts
   - Short-term fixed deposits (≤3 months)
   - Money market funds (if applicable)
   - Petty cash accounts

3. **Query each cash account balance**
   - Get balance at start_date (beginning of period)
   - Use _get_account_balance helper method
   - Query cumulative balance up to but not including start_date
   - Handle multiple bank accounts

4. **Sum all cash account balances**
   - Add cash on hand
   - Add all bank account balances
   - Add cash equivalents
   - Total represents beginning cash position

5. **Handle multiple currencies**
   - If multi-currency operation
   - Convert foreign currency cash to LKR
   - Use exchange rate at start_date
   - Sum in base currency

6. **Store beginning balance**
   - Save in cash_summary['beginning_balance']
   - Format to 2 decimal places
   - Ensure Decimal type

7. **Add validation checks**
   - Verify balance is not negative (flag warning if so)
   - Check against prior period's ending balance
   - Ensure reasonable magnitude
   - Log balance for audit trail

8. **Create _get_cash_equivalent_accounts helper**
   - Return list of account codes for cash equivalents
   - Include only accounts with ≤3 months maturity
   - Exclude longer-term investments
   - Document classification criteria

9. **Update generate method**
   - Call _get_beginning_cash_balance
   - Store result in report data
   - Ensure called after net change calculation

### Cash and Cash Equivalents Definition

```
┌──────────────────────────────────────────────────────────┐
│         CASH AND CASH EQUIVALENTS COMPONENTS             │
├──────────────────────────────────────────────────────────┤
│                                                          │
│ CASH                                                     │
│   • Cash on Hand (Till, petty cash)                      │
│   • Cash in Transit (deposits not yet cleared)           │
│                                                          │
│ BANK ACCOUNTS                                            │
│   • Current Accounts (checking)                          │
│   • Savings Accounts                                     │
│   • Overdraft Facilities (if used)                       │
│                                                          │
│ CASH EQUIVALENTS                                         │
│   • Fixed Deposits ≤ 3 months maturity                   │
│   • Treasury Bills ≤ 3 months                            │
│   • Money Market Funds                                   │
│                                                          │
│ EXCLUDED FROM CASH                                       │
│   • Fixed Deposits > 3 months (Long-term Investments)    │
│   • Restricted Cash (e.g., escrow, deposit guarantees)   │
│   • Blocked Accounts                                     │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### Account Mapping Example

```
Sri Lankan Business Cash Accounts
══════════════════════════════════════════════

Cash on Hand:
  1001 - Petty Cash                              5,000.00
  1002 - Cash Register (POS 1)                  15,000.00
  1003 - Cash Register (POS 2)                  12,000.00
  1004 - Safe                                   50,000.00

Bank Accounts:
  1010 - Commercial Bank Current A/C           450,000.00
  1011 - HNB Savings Account                   220,000.00
  1012 - People's Bank Current A/C             180,000.00
  1013 - Sampath Bank USD Account (equiv)      135,000.00
  
Cash Equivalents:
  1020 - Commercial Bank FD (90-day)           500,000.00
  1021 - HNB Treasury Bill (60-day)            300,000.00

                                            ─────────────
TOTAL CASH AND CASH EQUIVALENTS             1,867,000.00
                                            ═════════════
```

### Multi-Currency Handling

```
Foreign Currency Cash Conversion
══════════════════════════════════════════════

Scenario: Business has USD bank account

USD Account Balance: $1,000.00
Exchange Rate on 2026-01-01: 1 USD = 320 LKR

LKR Equivalent: 1,000 × 320 = 320,000.00 LKR

Include in beginning cash balance:
  Bank - USD Account (LKR equivalent)    320,000.00

Note: Use start_date exchange rate for consistency
```

### Beginning Balance Validation

```
Cross-Validation Checks
══════════════════════════════════════════════

Check 1: Match Prior Period Ending Balance
  Current period start = Prior period end
  
  Prior Period (Dec 2025):
    Ending Cash Balance:              1,867,000.00
  
  Current Period (Jan 2026):
    Beginning Cash Balance:           1,867,000.00
    
  ✓ Balances match → Validation passed


Check 2: Reasonable Magnitude
  Compare to typical business cash needs
  
  Monthly Revenue: 5,000,000.00
  Beginning Cash: 1,867,000.00
  
  Cash as % of Monthly Revenue: 37%
  ✓ Within reasonable range (20-50%)


Check 3: Negative Balance Check
  Beginning Cash Balance: (150,000.00)
  
  ✗ Negative balance detected
  → Likely overdraft situation
  → Flag for review
```

### Fixed Deposit Classification

```
Fixed Deposit Maturity Classification
══════════════════════════════════════════════

Report Period: January 1 - December 31, 2026
Beginning Date: January 1, 2026

Fixed Deposit Details:
  FD #1: 90-day maturity (March 31, 2026)
         Original: 500,000.00
         Remaining: 90 days from Jan 1
         Classification: Cash Equivalent ✓
  
  FD #2: 180-day maturity (June 30, 2026)
         Original: 750,000.00
         Remaining: 180 days from Jan 1
         Classification: Investment ✗
  
  FD #3: 1-year maturity (Dec 31, 2026)
         Original: 1,000,000.00
         Remaining: 365 days from Jan 1
         Classification: Investment ✗

Beginning Cash Balance includes only FD #1
```

### Sri Lankan Bank Accounts

| Bank | Account Type | Typical Use | Include in Cash? |
|------|-------------|-------------|-----------------|
| Commercial Bank | Current Account | Operating transactions | ✓ Yes |
| HNB | Savings Account | Backup funds | ✓ Yes |
| People's Bank | Current Account | Payroll | ✓ Yes |
| Sampath Bank | Fixed Deposit 30-day | Short-term savings | ✓ Yes (if ≤3mo) |
| BOC | Fixed Deposit 1-year | Long-term savings | ✗ No (>3mo) |
| NSB | Savings Account | Reserve fund | ✓ Yes |

### Expected Outcome
- Beginning cash balance calculated accurately
- All cash and cash equivalent accounts included
- Proper classification of accounts
- Multi-currency handling (if applicable)
- Validation against prior period

### Verification Checklist
- [ ] _get_beginning_cash_balance method created
- [ ] Cash on hand accounts included
- [ ] Bank current accounts included
- [ ] Bank savings accounts included
- [ ] Cash equivalents (≤3mo) included
- [ ] Long-term investments excluded
- [ ] Multi-currency conversion handled
- [ ] Beginning balance stored
- [ ] Validation checks implemented
- [ ] _get_cash_equivalent_accounts helper created
- [ ] Method called in generate()
- [ ] Balance matches prior period end (if applicable)

---

## Task 71: Add Ending Cash Balance

### Overview
Calculate the ending cash balance by adding the net cash change to the beginning cash balance. This represents the total cash and cash equivalents at the end of the reporting period (end_date) and should match the cash balance on the Balance Sheet for the same date.

### Dependencies
- Task 69: Add Net Cash Change Calc
- Task 70: Add Beginning Cash Balance

### Instructions

1. **Create _calculate_ending_cash_balance method**
   - Define method in CashFlowGenerator class
   - Return ending cash balance as Decimal
   - Use beginning balance and net change

2. **Retrieve beginning cash balance**
   - Get cash_summary['beginning_balance']
   - This was calculated in Task 70
   - Represents cash at start of period

3. **Retrieve net cash change**
   - Get cash_summary['net_change']
   - This was calculated in Task 69
   - Represents total change during period

4. **Calculate ending balance**
   - ending_balance = beginning_balance + net_change
   - Simple addition formula
   - Store in cash_summary['ending_balance']

5. **Query actual ending balance for verification**
   - Use _get_account_balance to query cash accounts at end_date
   - Sum all cash and cash equivalent accounts
   - This should match calculated ending balance

6. **Compare calculated vs actual**
   - Calculate difference
   - If difference > tolerance (e.g., 1.00), flag discrepancy
   - Log comparison for audit trail
   - Small differences may be due to rounding

7. **Handle reconciliation discrepancies**
   - If mismatch detected, investigate
   - Check for missing transactions
   - Verify account classifications
   - Document reconciliation items

8. **Store reconciliation status**
   - Add 'reconciled' flag to cash_summary
   - Store difference amount
   - Include in report output if material

9. **Format for display**
   - Format to 2 decimal places
   - Add thousands separators
   - Prepare for report presentation

10. **Update generate method**
    - Call _calculate_ending_cash_balance
    - Store result in report data
    - Ensure called after net change and beginning balance

### Ending Balance Calculation Flow

```
┌──────────────────────────────────────────────────────────┐
│           ENDING CASH BALANCE CALCULATION                │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  BEGINNING CASH BALANCE                    1,867,000.00 │
│  (Cash and Cash Equivalents at Start)                   │
│                                                          │
│  ADD: Net Increase/(Decrease) in Cash        250,000.00 │
│  (From Operating, Investing, Financing)                 │
│                                           ─────────────  │
│                                                          │
│  ENDING CASH BALANCE                       2,117,000.00 │
│  (Cash and Cash Equivalents at End)       ═════════════  │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### Complete Cash Flow Statement Example

```
LANKACOMMERCE PVT LTD
CASH FLOW STATEMENT
For the Year Ended December 31, 2026
(All amounts in LKR)
═══════════════════════════════════════════════════════════

CASH FLOWS FROM OPERATING ACTIVITIES
  Net Income                                       500,000.00
  Adjustments for:
    Depreciation                                    75,000.00
    Amortization                                    10,000.00
  Changes in Working Capital:
    Increase in Accounts Receivable               (80,000.00)
    Decrease in Inventory                           30,000.00
    Increase in Accounts Payable                    45,000.00
    Increase in EPF/ETF Payable                     18,750.00
    Increase in VAT Payable                         25,000.00
                                                ─────────────
  Net Cash from Operating Activities               623,750.00

CASH FLOWS FROM INVESTING ACTIVITIES
  Purchase of Equipment                          (450,000.00)
  Purchase of Vehicle                          (2,500,000.00)
  Sale of Old Equipment                            75,000.00
  Fixed Deposit (1-year)                         (500,000.00)
                                                ─────────────
  Net Cash Used in Investing Activities        (3,375,000.00)

CASH FLOWS FROM FINANCING ACTIVITIES
  Proceeds from Bank Loan                        1,500,000.00
  Loan Repayments                                 (420,000.00)
  Owner Capital Contribution                       200,000.00
  Owner Drawings                                  (360,000.00)
  Dividend Payments                               (250,000.00)
                                                ─────────────
  Net Cash from Financing Activities               670,000.00

                                                ─────────────
NET DECREASE IN CASH                              (2,081,250.00)

CASH AND CASH EQUIVALENTS
  Beginning of Year                              3,948,250.00
                                                ─────────────
  End of Year                                    1,867,000.00
                                                ═════════════
```

### Reconciliation Process

```
Cash Flow Statement Reconciliation
══════════════════════════════════════════════

Calculated Ending Balance:
  Beginning Balance                     1,867,000.00
  Plus: Net Cash Change                   250,000.00
                                       ─────────────
  Calculated Ending                     2,117,000.00

Actual Balance Sheet Cash (Dec 31, 2026):
  Cash on Hand                             82,000.00
  Bank Accounts                         1,535,000.00
  Cash Equivalents (FD ≤3mo)              500,000.00
                                       ─────────────
  Actual Ending                         2,117,000.00

Reconciliation:
  Calculated Ending                     2,117,000.00
  Actual Ending                         2,117,000.00
                                       ─────────────
  Difference                                    0.00
                                       ═════════════

Status: ✓ RECONCILED
```

### Discrepancy Investigation

```
When Calculated ≠ Actual
══════════════════════════════════════════════

Example Discrepancy:
  Calculated Ending: 2,117,000.00
  Actual Ending:     2,115,500.00
  Difference:          (1,500.00)

Investigation Steps:
  1. Check for unrecorded transactions
     → Cash receipts not journalized
     → Bank charges not recorded
  
  2. Verify account classifications
     → Cash account misclassified as non-cash
     → Investment wrongly included in cash
  
  3. Review period cutoff
     → Transaction dated incorrectly
     → Bank reconciliation timing difference
  
  4. Check for FX revaluation
     → Foreign currency translation adjustments
     → Should be in operating activities

Resolution:
  If < 1% of cash balance: Accept as immaterial
  If > 1% of cash balance: Investigate and correct
```

### Balance Sheet Cross-Reference

```
Balance Sheet Validation
══════════════════════════════════════════════

BALANCE SHEET - December 31, 2026

ASSETS
Current Assets:
  Cash and Cash Equivalents              2,117,000.00 ✓
    Cash on Hand                            82,000.00
    Bank - Commercial                      850,000.00
    Bank - HNB                             685,000.00
    FD - 90 day                            500,000.00

This MUST match Cash Flow Statement ending balance

CASH FLOW STATEMENT - December 31, 2026

Cash at End of Period                    2,117,000.00 ✓

Verification: ✓ Balances Match
```

### Expected Outcome
- Ending cash balance calculated correctly
- Reconciliation with balance sheet
- Discrepancy investigation process
- Audit trail documentation
- Complete cash flow statement

### Verification Checklist
- [ ] _calculate_ending_cash_balance method created
- [ ] Beginning balance retrieved
- [ ] Net cash change retrieved
- [ ] Ending balance calculated (beginning + change)
- [ ] Ending balance stored
- [ ] Actual ending balance queried
- [ ] Calculated vs actual compared
- [ ] Reconciliation status recorded
- [ ] Discrepancy handling implemented
- [ ] Display formatting applied
- [ ] Method called in generate()
- [ ] Balance matches balance sheet

---

## Task 72: Create Cash Flow HTML Template

### Overview
Create a professional HTML template for rendering the Cash Flow Statement. The template should present the three activity sections clearly, show proper accounting formatting, include the company header with Sri Lankan context, and be suitable for viewing, printing, and PDF export.

### Dependencies
- Task 71: Add Ending Cash Balance
- Django template system configured
- CSS framework available (Bootstrap or custom)
- Report templates directory structure

### Instructions

1. **Create cash_flow_report.html file**
   - Navigate to `templates/finance/reports/`
   - Create new file named `cash_flow_report.html`
   - Extend base report template

2. **Add template header**
   - Include Django template tags
   - Extend base template
   - Define title block

3. **Create company header section**
   - Display tenant business name
   - Include business registration number
   - Show address and contact information
   - Format according to Sri Lankan standards

4. **Add report title section**
   - Display "CASH FLOW STATEMENT"
   - Show reporting period (start_date to end_date)
   - Include currency notation (All amounts in LKR)
   - Add generation timestamp

5. **Create operating activities section**
   - Section header: "CASH FLOWS FROM OPERATING ACTIVITIES"
   - Display net income as starting point
   - List adjustments for non-cash items (indented)
   - List working capital changes (indented)
   - Show subtotal with emphasis
   - Use proper accounting formatting (parentheses for negatives)

6. **Create investing activities section**
   - Section header: "CASH FLOWS FROM INVESTING ACTIVITIES"
   - List all investing transactions
   - Group purchases separately from sales
   - Show subtotal
   - Typically negative (more purchases)

7. **Create financing activities section**
   - Section header: "CASH FLOWS FROM FINANCING ACTIVITIES"
   - List loan transactions
   - List equity transactions
   - Show subtotal
   - Can be positive or negative

8. **Create cash reconciliation section**
   - Display net change in cash (emphasized)
   - Show beginning cash balance
   - Show ending cash balance (double underline)
   - Use clear visual hierarchy

9. **Add accounting formatting CSS**
   - Right-align all numbers
   - Use monospace font for amounts
   - Add thousand separators
   - Negative amounts in parentheses
   - Subtotals with single underline
   - Totals with double underline
   - Proper indentation for sub-items

10. **Add print styles**
    - Optimize for A4 paper
    - Remove unnecessary UI elements
    - Ensure proper page breaks
    - Include page headers/footers for multi-page

11. **Add responsive design**
    - Mobile-friendly layout
    - Responsive tables
    - Readable on tablets
    - Maintain formatting integrity

12. **Include notes section (optional)**
    - Add space for report notes
    - Accounting policy references
    - Significant non-cash transactions
    - Sri Lankan regulatory notes

### HTML Template Structure

```html
<!DOCTYPE html>
{% extends 'finance/reports/base_report.html' %}
{% load humanize %}

{% block title %}Cash Flow Statement{% endblock %}

{% block content %}
<div class="cash-flow-report">
  
  <!-- Company Header -->
  <div class="company-header">
    <h1>{{ tenant.business_name }}</h1>
    <p>Company Registration No: {{ tenant.registration_number }}</p>
    <p>{{ tenant.address }}</p>
  </div>
  
  <!-- Report Title -->
  <div class="report-title">
    <h2>CASH FLOW STATEMENT</h2>
    <p>For the Period from {{ start_date }} to {{ end_date }}</p>
    <p class="currency-note">(All amounts in LKR)</p>
  </div>
  
  <!-- Operating Activities -->
  <section class="operating-activities">
    <h3>CASH FLOWS FROM OPERATING ACTIVITIES</h3>
    <table>
      <tr>
        <td class="item-description">Net Income</td>
        <td class="amount">{{ net_income|format_currency }}</td>
      </tr>
      <tr>
        <td colspan="2" class="section-header">Adjustments for:</td>
      </tr>
      <tr>
        <td class="item-description indent">Depreciation</td>
        <td class="amount">{{ depreciation|format_currency }}</td>
      </tr>
      <!-- More adjustments -->
      <tr class="subtotal">
        <td class="item-description">Net Cash from Operating Activities</td>
        <td class="amount">{{ operating_subtotal|format_currency }}</td>
      </tr>
    </table>
  </section>
  
  <!-- Similar sections for Investing and Financing -->
  
  <!-- Cash Reconciliation -->
  <section class="cash-summary">
    <table>
      <tr class="emphasis">
        <td class="item-description">NET INCREASE/(DECREASE) IN CASH</td>
        <td class="amount">{{ net_change|format_currency }}</td>
      </tr>
      <tr>
        <td class="item-description">Cash at Beginning of Period</td>
        <td class="amount">{{ beginning_balance|format_currency }}</td>
      </tr>
      <tr class="total">
        <td class="item-description">CASH AT END OF PERIOD</td>
        <td class="amount">{{ ending_balance|format_currency }}</td>
      </tr>
    </table>
  </section>
  
</div>
{% endblock %}
```

### CSS Styling Guidelines

```css
/* Cash Flow Report Styles */

.cash-flow-report {
  font-family: 'Arial', sans-serif;
  max-width: 210mm; /* A4 width */
  margin: 0 auto;
  padding: 20mm;
}

.company-header {
  text-align: center;
  margin-bottom: 30px;
  border-bottom: 2px solid #333;
  padding-bottom: 15px;
}

.report-title {
  text-align: center;
  margin-bottom: 40px;
}

.report-title h2 {
  font-size: 18pt;
  font-weight: bold;
  margin-bottom: 10px;
}

.currency-note {
  font-style: italic;
  font-size: 9pt;
  color: #666;
}

/* Section Styles */
section {
  margin-bottom: 30px;
}

section h3 {
  font-size: 12pt;
  font-weight: bold;
  margin-bottom: 15px;
  text-decoration: underline;
}

/* Table Styles */
table {
  width: 100%;
  border-collapse: collapse;
}

tr {
  border-bottom: 1px solid #eee;
}

td {
  padding: 5px 10px;
}

.item-description {
  text-align: left;
}

.amount {
  text-align: right;
  font-family: 'Courier New', monospace;
  white-space: nowrap;
}

.indent {
  padding-left: 30px;
}

.section-header {
  font-weight: bold;
  padding-top: 10px;
}

.subtotal {
  border-top: 1px solid #333;
  font-weight: bold;
}

.total {
  border-top: 3px double #333;
  border-bottom: 3px double #333;
  font-weight: bold;
  font-size: 11pt;
}

.emphasis {
  background-color: #f5f5f5;
  font-weight: bold;
}

/* Negative amounts in parentheses */
.negative {
  color: #000; /* Keep black, use parentheses */
}

/* Print Styles */
@media print {
  .cash-flow-report {
    padding: 10mm;
  }
  
  .no-print {
    display: none;
  }
  
  section {
    page-break-inside: avoid;
  }
}
```

### Sri Lankan Business Header Example

```html
<div class="company-header">
  <h1>LANKACOMMERCE PVT LTD</h1>
  <p class="reg-number">Company Registration No: PV 12345</p>
  <p class="address">
    No. 123, Galle Road, Colombo 03<br>
    Tel: +94 11 234 5678 | Email: info@lankacommerce.lk<br>
    VAT Reg No: 123-456-789-1234
  </p>
</div>

<div class="report-title">
  <h2>CASH FLOW STATEMENT</h2>
  <h3>(INDIRECT METHOD)</h3>
  <p class="period">For the Year Ended December 31, 2026</p>
  <p class="currency-note">(All amounts in Sri Lankan Rupees)</p>
</div>
```

### Complete Visual Layout

```
┌─────────────────────────────────────────────────────────┐
│              LANKACOMMERCE PVT LTD                      │
│         Company Registration No: PV 12345               │
│          No. 123, Galle Road, Colombo 03                │
│      Tel: +94 11 234 5678 | info@lankacommerce.lk      │
├─────────────────────────────────────────────────────────┤
│                                                         │
│              CASH FLOW STATEMENT                        │
│               (INDIRECT METHOD)                         │
│        For the Year Ended December 31, 2026            │
│          (All amounts in Sri Lankan Rupees)            │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ CASH FLOWS FROM OPERATING ACTIVITIES                   │
│   Net Income                                500,000.00 │
│   Adjustments for non-cash items:                      │
│     Depreciation                             75,000.00 │
│     Amortization                             10,000.00 │
│   Changes in working capital:                          │
│     (Increase)/Decrease in Receivables     (80,000.00)│
│     (Increase)/Decrease in Inventory         30,000.00 │
│     Increase/(Decrease) in Payables          45,000.00 │
│     Increase/(Decrease) in EPF/ETF           18,750.00 │
│     Increase/(Decrease) in VAT Payable       25,000.00 │
│                                           ─────────────│
│   Net Cash from Operating Activities        623,750.00 │
│                                                         │
│ CASH FLOWS FROM INVESTING ACTIVITIES                   │
│   Purchase of Equipment                    (450,000.00)│
│   Purchase of Vehicle                    (2,500,000.00)│
│   Sale of Equipment                          75,000.00 │
│                                           ─────────────│
│   Net Cash Used in Investing Activities  (2,875,000.00)│
│                                                         │
│ CASH FLOWS FROM FINANCING ACTIVITIES                   │
│   Proceeds from Bank Loan                 1,500,000.00 │
│   Loan Repayments                          (420,000.00)│
│   Owner Capital Contribution                200,000.00 │
│   Owner Drawings                           (360,000.00)│
│                                           ─────────────│
│   Net Cash from Financing Activities        920,000.00 │
│                                                         │
│                                           ─────────────│
│ NET DECREASE IN CASH                     (1,331,250.00)│
│                                                         │
│ CASH AT BEGINNING OF PERIOD               3,198,250.00 │
│                                           ─────────────│
│ CASH AT END OF PERIOD                     1,867,000.00 │
│                                           ═════════════│
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Expected Outcome
- Professional HTML template
- Clear section presentation
- Proper accounting formatting
- Sri Lankan business context
- Print-ready output
- Responsive design

### Verification Checklist
- [ ] cash_flow_report.html file created
- [ ] Extends base report template
- [ ] Company header section added
- [ ] Report title section added
- [ ] Operating activities section created
- [ ] Investing activities section created
- [ ] Financing activities section created
- [ ] Cash reconciliation section created
- [ ] Accounting formatting CSS added
- [ ] Negative amounts in parentheses
- [ ] Proper indentation implemented
- [ ] Print styles added
- [ ] Responsive design implemented
- [ ] Sri Lankan context included
- [ ] Thousand separators working
- [ ] Template renders correctly

---

## Task 73: Create Cash Flow API Endpoint

### Overview
Create a REST API endpoint to generate and retrieve Cash Flow Statements. The endpoint should accept date range parameters, return JSON-formatted report data, support filtering options, and integrate with the CashFlowGenerator class.

### Dependencies
- Task 72: Create CF HTML Template
- CashFlowGenerator class fully implemented
- Django REST Framework configured
- API authentication enabled

### Instructions

1. **Create cash_flow_views.py file**
   - Navigate to `apps/finance/reports/api/`
   - Create new file named `cash_flow_views.py`
   - This will contain the Cash Flow API views

2. **Import required modules**
   - Import Django REST Framework components
   - Import CashFlowGenerator
   - Import authentication/permission classes
   - Import serializers and exceptions

3. **Define CashFlowReportSerializer**
   - Create serializer class for request parameters
   - Fields: start_date, end_date, format (optional)
   - Validate date range
   - Validate date format

4. **Create CashFlowReportView**
   - Inherit from APIView or GenericAPIView
   - Require authentication
   - Require tenant context

5. **Implement GET method**
   - Accept query parameters: start_date, end_date, format
   - Default format to 'json'
   - Validate tenant permissions
   - Extract and validate parameters

6. **Validate request parameters**
   - Ensure start_date and end_date are provided
   - Validate date format (YYYY-MM-DD)
   - Ensure start_date < end_date
   - Check date range is reasonable (not > 10 years)

7. **Instantiate CashFlowGenerator**
   - Get tenant from request
   - Create generator instance
   - Pass validated dates

8. **Generate report data**
   - Call generator.generate() method
   - Catch and handle exceptions
   - Return error response if generation fails

9. **Format response data**
   - Structure JSON response
   - Include metadata (report_type, generation_time, currency)
   - Include all three activity sections
   - Include cash summary

10. **Handle format parameter**
    - If format='json': Return JSON response
    - If format='html': Render HTML template
    - If format='pdf': Generate PDF (future enhancement)
    - Default to JSON

11. **Add error handling**
    - Invalid date format → 400 Bad Request
    - Missing parameters → 400 Bad Request
    - Permission denied → 403 Forbidden
    - Calculation error → 500 Internal Server Error

12. **Create URL pattern**
    - Add to `urls.py`: `/api/reports/cash-flow/`
    - Accept GET requests
    - Include in API documentation

13. **Add API documentation**
    - Add docstring to view
    - Document parameters
    - Document response format
    - Include example requests/responses

14. **Test endpoint**
    - Test with valid parameters
    - Test with invalid parameters
    - Test with different date ranges
    - Test with different formats

### API Endpoint Structure

```python
# URL Pattern
GET /api/reports/cash-flow/

# Query Parameters
- start_date (required): YYYY-MM-DD
- end_date (required): YYYY-MM-DD
- format (optional): json|html|pdf (default: json)

# Headers
- Authorization: Token <auth_token>
- Tenant-ID: <tenant_id>

# Response (JSON format)
{
  "report_type": "cash_flow",
  "report_name": "Cash Flow Statement",
  "period": {
    "start_date": "2026-01-01",
    "end_date": "2026-12-31"
  },
  "currency": "LKR",
  "generated_at": "2026-01-25T10:30:00Z",
  "data": {
    "operating_activities": { ... },
    "investing_activities": { ... },
    "financing_activities": { ... },
    "cash_summary": { ... }
  }
}
```

### Sample Request/Response

```bash
# Request
curl -X GET \
  'https://api.lankaerp.com/api/reports/cash-flow/?start_date=2026-01-01&end_date=2026-12-31' \
  -H 'Authorization: Token abc123xyz789' \
  -H 'Tenant-ID: tenant-001'

# Response (200 OK)
{
  "report_type": "cash_flow",
  "report_name": "Cash Flow Statement",
  "period": {
    "start_date": "2026-01-01",
    "end_date": "2026-12-31"
  },
  "currency": "LKR",
  "generated_at": "2026-01-25T10:30:15.123Z",
  "tenant": {
    "id": "tenant-001",
    "name": "LankaCommerce Pvt Ltd"
  },
  "data": {
    "operating_activities": {
      "net_income": "500000.00",
      "depreciation": "75000.00",
      "amortization": "10000.00",
      "accounts_receivable_change": "-80000.00",
      "inventory_change": "30000.00",
      "accounts_payable_change": "45000.00",
      "epf_payable_change": "15000.00",
      "etf_payable_change": "3750.00",
      "vat_payable_change": "25000.00",
      "subtotal": "623750.00"
    },
    "investing_activities": {
      "ppe_purchases": "-2950000.00",
      "ppe_sales": "75000.00",
      "investment_purchases": "-500000.00",
      "investment_sales": "0.00",
      "subtotal": "-3375000.00"
    },
    "financing_activities": {
      "loan_proceeds": "1500000.00",
      "loan_repayments": "-420000.00",
      "capital_contributions": "200000.00",
      "owner_drawings": "-360000.00",
      "dividend_payments": "-250000.00",
      "subtotal": "670000.00"
    },
    "cash_summary": {
      "net_change": "-2081250.00",
      "beginning_balance": "3948250.00",
      "ending_balance": "1867000.00"
    }
  }
}
```

### Error Responses

```json
# Missing Parameters (400 Bad Request)
{
  "error": "Bad Request",
  "message": "Both start_date and end_date are required",
  "code": "MISSING_PARAMETERS"
}

# Invalid Date Format (400 Bad Request)
{
  "error": "Bad Request",
  "message": "Invalid date format. Use YYYY-MM-DD",
  "code": "INVALID_DATE_FORMAT"
}

# Invalid Date Range (400 Bad Request)
{
  "error": "Bad Request",
  "message": "start_date must be before end_date",
  "code": "INVALID_DATE_RANGE"
}

# Permission Denied (403 Forbidden)
{
  "error": "Forbidden",
  "message": "You do not have permission to view this report",
  "code": "PERMISSION_DENIED"
}

# Calculation Error (500 Internal Server Error)
{
  "error": "Internal Server Error",
  "message": "Error calculating cash flow: Missing account mapping",
  "code": "CALCULATION_ERROR"
}
```

### View Implementation Example

```python
class CashFlowReportView(APIView):
    """
    Generate Cash Flow Statement for a given period.
    
    GET /api/reports/cash-flow/
    Query Params:
        - start_date: YYYY-MM-DD (required)
        - end_date: YYYY-MM-DD (required)
        - format: json|html|pdf (optional, default: json)
    """
    
    permission_classes = [IsAuthenticated, HasReportPermission]
    
    def get(self, request):
        # Validate parameters
        serializer = CashFlowReportSerializer(data=request.query_params)
        if not serializer.is_valid():
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Extract validated data
        start_date = serializer.validated_data['start_date']
        end_date = serializer.validated_data['end_date']
        report_format = serializer.validated_data.get('format', 'json')
        
        # Get tenant from request
        tenant = request.user.tenant
        
        try:
            # Generate report
            generator = CashFlowGenerator(tenant, start_date, end_date)
            report_data = generator.generate()
            
            # Handle format
            if report_format == 'html':
                return render(request, 'finance/reports/cash_flow_report.html', {
                    'report_data': report_data
                })
            elif report_format == 'json':
                return Response({
                    'report_type': 'cash_flow',
                    'report_name': 'Cash Flow Statement',
                    'period': {
                        'start_date': start_date,
                        'end_date': end_date
                    },
                    'currency': 'LKR',
                    'generated_at': timezone.now(),
                    'data': report_data
                })
            
        except Exception as e:
            return Response(
                {
                    'error': 'Calculation Error',
                    'message': str(e)
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
```

### URL Configuration

```python
# apps/finance/reports/api/urls.py

from django.urls import path
from .cash_flow_views import CashFlowReportView

urlpatterns = [
    path('cash-flow/', CashFlowReportView.as_view(), name='cash-flow-report'),
    # Other report endpoints...
]
```

### API Testing Examples

```bash
# Test 1: Valid request with JSON format
curl -X GET \
  'http://localhost:8000/api/reports/cash-flow/?start_date=2026-01-01&end_date=2026-12-31&format=json' \
  -H 'Authorization: Token YOUR_TOKEN' \
  -H 'Tenant-ID: YOUR_TENANT_ID'

# Test 2: Valid request with HTML format
curl -X GET \
  'http://localhost:8000/api/reports/cash-flow/?start_date=2026-01-01&end_date=2026-12-31&format=html' \
  -H 'Authorization: Token YOUR_TOKEN' \
  -H 'Tenant-ID: YOUR_TENANT_ID'

# Test 3: Missing parameters
curl -X GET \
  'http://localhost:8000/api/reports/cash-flow/?start_date=2026-01-01' \
  -H 'Authorization: Token YOUR_TOKEN' \
  -H 'Tenant-ID: YOUR_TENANT_ID'

# Test 4: Invalid date format
curl -X GET \
  'http://localhost:8000/api/reports/cash-flow/?start_date=01-01-2026&end_date=31-12-2026' \
  -H 'Authorization: Token YOUR_TOKEN' \
  -H 'Tenant-ID: YOUR_TENANT_ID'
```

### Expected Outcome
- Functional REST API endpoint
- JSON response format
- Date validation
- Error handling
- Authentication/authorization
- Multiple format support

### Verification Checklist
- [ ] cash_flow_views.py file created
- [ ] CashFlowReportSerializer defined
- [ ] CashFlowReportView class created
- [ ] GET method implemented
- [ ] Parameter validation added
- [ ] CashFlowGenerator instantiated
- [ ] Report generation called
- [ ] JSON response formatted
- [ ] HTML format supported
- [ ] Error handling implemented
- [ ] URL pattern added
- [ ] API documentation added
- [ ] Endpoint tested with valid params
- [ ] Endpoint tested with invalid params
- [ ] Authentication required
- [ ] Tenant context validated

---

## Summary

This document established the complete Cash Flow Statement generation system:

### Completed Infrastructure
- ✅ CashFlowGenerator class extending BaseReportGenerator
- ✅ Operating activities calculation (indirect method)
- ✅ Investing activities calculation
- ✅ Financing activities calculation
- ✅ Net cash change calculation
- ✅ Beginning and ending cash balances
- ✅ Professional HTML template
- ✅ REST API endpoint

### Key Achievements
1. **Indirect Method Implementation** - Standard approach used in Sri Lanka
2. **Working Capital Tracking** - Comprehensive adjustment calculations
3. **Sri Lankan Context** - EPF/ETF payables, VAT tracking, local loan types
4. **Three Activity Sections** - Operating, Investing, Financing
5. **Cash Reconciliation** - Beginning + Change = Ending
6. **Professional Presentation** - HTML template with proper formatting
7. **API Integration** - RESTful endpoint with validation

### Sri Lankan Specific Features
- EPF/ETF payable tracking in working capital
- VAT payable as working capital item
- Common loan types (term, overdraft, pawning)
- Owner drawings for partnerships
- LKR currency formatting
- Business structure variations (sole proprietor, partnership, Ltd)

### Next Steps
Proceed to [02_Tasks-74-80_GeneralLedger-Generator.md](02_Tasks-74-80_GeneralLedger-Generator.md) to implement the General Ledger report generator, which provides detailed transaction listings for all accounts.

---

**Document Status:** ✅ Complete  
**Total Tasks:** 9  
**Total Lines:** ~990
