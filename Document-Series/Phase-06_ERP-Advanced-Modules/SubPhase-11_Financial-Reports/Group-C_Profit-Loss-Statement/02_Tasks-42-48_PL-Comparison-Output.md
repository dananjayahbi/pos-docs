# Tasks 42-48: PL Data Structure, Comparison, and Output

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 11 - Financial Reports  
> **Group:** C - Profit & Loss Statement  
> **Document:** 02 of 02  
> **Tasks Covered:** 42, 43, 44, 45, 46, 47, 48

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-31-41_PL-Calculations.md](01_Tasks-31-41_PL-Calculations.md)
- **→ Next Group:** [../Group-D_Balance-Sheet/](../Group-D_Balance-Sheet/)

---

## Document Overview

This document covers the output formatting, comparison analysis, and delivery mechanisms for the Profit & Loss Statement. After establishing the core calculation methods, these tasks focus on structuring P&L data for consumption, enabling period-over-period comparison, computing variance metrics, calculating percentage of revenue analysis (common-size), creating professional HTML templates for display, generating PDF exports, and exposing the P&L through a REST API endpoint.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 42 | Create PL Data Structure | Medium | 35 min |
| 43 | Add PL Comparison Mode | Medium | 40 min |
| 44 | Add PL Variance Calc | Low | 20 min |
| 45 | Add PL Percentage of Revenue | Low | 25 min |
| 46 | Create PL HTML Template | Medium | 45 min |
| 47 | Create PL PDF Generator | Medium | 35 min |
| 48 | Create PL API Endpoint | Low | 25 min |

---

## Task 42: Create PL Data Structure

### Overview
Create a standardized data structure method that formats P&L calculation results into a consistent, hierarchical dictionary format. This structure organizes revenue sections, expense categories, profit levels, and metadata into a format suitable for templates, API responses, and PDF generation with proper Sri Lankan formatting.

### Dependencies
- Task 41: Calculate Net Income method exists
- All calculation methods (Tasks 31-41) are functional
- Revenue and expense accounts properly categorized
- GL entries available for period

### Instructions

1. **Open profit_loss.py file**
   - Navigate to `apps/accounting/reports/profit_loss.py`
   - Locate PLGenerator class

2. **Add create_data_structure method**
   - Define public method `create_data_structure()`
   - No parameters (uses instance state)
   - Returns complete P&L data dictionary

3. **Create report metadata section**
   - Build "metadata" dictionary
   - Include report_name, report_type
   - Add period start_date and end_date
   - Add generation timestamp
   - Include tenant information
   - Add currency code (LKR for Sri Lanka)

4. **Create revenue section**
   - Build "revenue" dictionary
   - Include all revenue accounts with balances
   - Group by account type if needed
   - Add "total_revenue" field
   - Format amounts in LKR

5. **Create COGS section**
   - Build "cost_of_goods_sold" dictionary
   - Include all COGS accounts (5100-5199)
   - Add individual account details
   - Include "total_cogs" field
   - Show amounts with proper formatting

6. **Add gross profit section**
   - Create "gross_profit" field
   - Calculate as revenue minus COGS
   - Include gross profit margin percentage
   - Format as LKR amount

7. **Create operating expenses section**
   - Build "operating_expenses" dictionary
   - Include all OpEx accounts (5200-5799)
   - Group by expense type (salaries, rent, utilities, etc.)
   - Separate EPF/ETF expense (Sri Lankan context)
   - Add "total_operating_expenses" field

8. **Add operating income section**
   - Create "operating_income" field
   - Calculate as gross profit minus OpEx
   - Include operating margin percentage
   - Format amounts consistently

9. **Create other income section**
   - Build "other_income" dictionary
   - Include interest income, misc income
   - Add account-level details
   - Include "total_other_income" field

10. **Create other expenses section**
    - Build "other_expenses" dictionary
    - Include interest expense, bank charges
    - Add account-level details
    - Include "total_other_expenses" field

11. **Add net income before tax section**
    - Create "net_income_before_tax" field
    - Calculate as operating income + other income - other expenses
    - Format with LKR formatting

12. **Add tax expense section**
    - Create "income_tax_expense" field
    - Include tax account balance
    - Support IRD tax calculations
    - Format as LKR amount

13. **Add net income section**
    - Create "net_income" field
    - Final bottom line calculation
    - Include net profit margin percentage
    - Highlight as key metric

14. **Add account detail helper method**
    - Create `_format_account_detail()` method
    - Accept account and balance parameters
    - Return dictionary with code, name, balance
    - Apply LKR formatting
    - Include Sinhala/Tamil translations if available

15. **Update generate method**
    - Modify existing generate() method
    - Call all calculation methods first
    - Call create_data_structure()
    - Return structured data dictionary
    - Ensure proper error handling

### PL Data Structure Format

```
┌─────────────────────────────────────────────────┐
│         Profit & Loss Data Structure            │
├─────────────────────────────────────────────────┤
│ metadata:                                       │
│  • report_name                                  │
│  • report_type                                  │
│  • period_start                                 │
│  • period_end                                   │
│  • generated_at                                 │
│  • tenant_id                                    │
│  • currency                                     │
│                                                 │
│ revenue:                                        │
│  • accounts: [{code, name, balance}]            │
│  • total_revenue                                │
│                                                 │
│ cost_of_goods_sold:                             │
│  • accounts: [{code, name, balance}]            │
│  • total_cogs                                   │
│                                                 │
│ gross_profit:                                   │
│  • amount                                       │
│  • margin_percentage                            │
│                                                 │
│ operating_expenses:                             │
│  • salaries: [{code, name, balance}]            │
│  • epf_etf: [{code, name, balance}]             │
│  • rent: [{code, name, balance}]                │
│  • utilities: [{code, name, balance}]           │
│  • depreciation: [{code, name, balance}]        │
│  • other: [{code, name, balance}]               │
│  • total_operating_expenses                     │
│                                                 │
│ operating_income:                               │
│  • amount                                       │
│  • margin_percentage                            │
│                                                 │
│ other_income:                                   │
│  • accounts: [{code, name, balance}]            │
│  • total_other_income                           │
│                                                 │
│ other_expenses:                                 │
│  • accounts: [{code, name, balance}]            │
│  • total_other_expenses                         │
│                                                 │
│ net_income_before_tax:                          │
│  • amount                                       │
│                                                 │
│ income_tax_expense:                             │
│  • amount                                       │
│                                                 │
│ net_income:                                     │
│  • amount                                       │
│  • margin_percentage                            │
└─────────────────────────────────────────────────┘
```

### Data Structure Example

```json
{
  "metadata": {
    "report_name": "Profit & Loss Statement",
    "report_type": "PROFIT_LOSS",
    "period_start": "2026-01-01",
    "period_end": "2026-01-31",
    "generated_at": "2026-01-25T10:30:00Z",
    "tenant_id": "tenant_abc123",
    "currency": "LKR"
  },
  "revenue": {
    "accounts": [
      {
        "code": "4000",
        "name": "Sales Revenue",
        "name_si": "විකුණුම් ආදායම",
        "balance": "2500000.00"
      },
      {
        "code": "4100",
        "name": "Service Revenue",
        "balance": "450000.00"
      }
    ],
    "total_revenue": "2950000.00"
  },
  "cost_of_goods_sold": {
    "accounts": [
      {
        "code": "5100",
        "name": "Purchases",
        "balance": "1200000.00"
      },
      {
        "code": "5110",
        "name": "Direct Labor",
        "balance": "180000.00"
      }
    ],
    "total_cogs": "1380000.00"
  },
  "gross_profit": {
    "amount": "1570000.00",
    "margin_percentage": "53.22"
  },
  "operating_expenses": {
    "salaries": [
      {
        "code": "5200",
        "name": "Salaries & Wages",
        "balance": "350000.00"
      }
    ],
    "epf_etf": [
      {
        "code": "5210",
        "name": "EPF Expense",
        "balance": "42000.00"
      },
      {
        "code": "5211",
        "name": "ETF Expense",
        "balance": "10500.00"
      }
    ],
    "rent": [
      {
        "code": "5300",
        "name": "Rent Expense",
        "balance": "75000.00"
      }
    ],
    "utilities": [
      {
        "code": "5400",
        "name": "Electricity",
        "balance": "18000.00"
      },
      {
        "code": "5401",
        "name": "Water",
        "balance": "3500.00"
      }
    ],
    "depreciation": [
      {
        "code": "5500",
        "name": "Depreciation Expense",
        "balance": "25000.00"
      }
    ],
    "other": [
      {
        "code": "5600",
        "name": "Marketing Expense",
        "balance": "45000.00"
      }
    ],
    "total_operating_expenses": "569000.00"
  },
  "operating_income": {
    "amount": "1001000.00",
    "margin_percentage": "33.93"
  },
  "other_income": {
    "accounts": [
      {
        "code": "4900",
        "name": "Interest Income",
        "balance": "5200.00"
      }
    ],
    "total_other_income": "5200.00"
  },
  "other_expenses": {
    "accounts": [
      {
        "code": "5800",
        "name": "Interest Expense",
        "balance": "12000.00"
      },
      {
        "code": "5810",
        "name": "Bank Charges",
        "balance": "2800.00"
      }
    ],
    "total_other_expenses": "14800.00"
  },
  "net_income_before_tax": {
    "amount": "991400.00"
  },
  "income_tax_expense": {
    "amount": "148710.00"
  },
  "net_income": {
    "amount": "842690.00",
    "margin_percentage": "28.57"
  }
}
```

### Sri Lankan Account Groupings

| Group | Account Codes | Examples |
|-------|--------------|----------|
| Revenue | 4000-4899 | Sales, Service Revenue |
| COGS | 5100-5199 | Purchases, Direct Labor, Materials |
| Salaries | 5200-5209 | Salaries, Wages, Bonuses |
| EPF/ETF | 5210-5219 | Employer contributions (Sri Lankan mandatory) |
| Rent | 5300-5399 | Office rent, Equipment rental |
| Utilities | 5400-5499 | Electricity, Water, Internet, Phone |
| Depreciation | 5500-5599 | Asset depreciation |
| Other OpEx | 5600-5799 | Marketing, Insurance, Repairs |
| Other Income | 4900+ | Interest income, Miscellaneous |
| Other Expenses | 5800-5899 | Interest expense, Bank charges |

### LKR Formatting Requirements

| Format Element | Specification |
|----------------|---------------|
| Currency Symbol | Rs. or LKR |
| Decimal Places | 2 |
| Thousands Separator | Comma (,) |
| Negative Numbers | Parentheses or minus sign |
| Example | Rs. 2,500,000.00 |

### Expected Outcome
- Standardized P&L data structure
- Hierarchical organization of sections
- Proper account grouping
- LKR formatting applied
- Sri Lankan context (EPF/ETF separate)
- Ready for template rendering
- API-friendly format

### Verification Checklist
- [ ] create_data_structure method implemented
- [ ] Metadata section populated
- [ ] Revenue section with accounts array
- [ ] COGS section with accounts
- [ ] Gross profit calculated
- [ ] Operating expenses grouped by type
- [ ] EPF/ETF shown separately
- [ ] Operating income calculated
- [ ] Other income section included
- [ ] Other expenses section included
- [ ] Net income before tax calculated
- [ ] Income tax expense included
- [ ] Net income calculated
- [ ] Margin percentages computed
- [ ] LKR formatting applied
- [ ] generate() method calls create_data_structure()

---

## Task 43: Add PL Comparison Mode

### Overview
Add period-over-period comparison capability to the PLGenerator. This feature enables side-by-side comparison of P&L statements for different periods (e.g., current month vs. prior month, current year vs. prior year), allowing stakeholders to analyze trends, identify changes in revenue and expenses, and track business performance over time.

### Dependencies
- Task 42: Create PL Data Structure
- PLGenerator class functional
- Data structure method implemented
- GL entries span multiple periods

### Instructions

1. **Open profit_loss.py file**
   - Navigate to `apps/accounting/reports/profit_loss.py`
   - Locate PLGenerator class

2. **Add comparison mode flag to __init__**
   - Add `enable_comparison` parameter (default False)
   - Add `comparison_start_date` parameter (optional)
   - Add `comparison_end_date` parameter (optional)
   - Store as instance variables
   - Validate comparison dates if enabled

3. **Create validate_comparison_dates method**
   - Check comparison_start_date is before comparison_end_date
   - Ensure comparison period does not overlap current period
   - Verify comparison dates are not in future
   - Raise ValidationError for invalid dates

4. **Add get_comparison_period helper method**
   - Auto-calculate comparison period if not provided
   - Support "prior_period" mode (same duration before current)
   - Support "prior_year" mode (same period last year)
   - Return tuple of (comparison_start, comparison_end)

5. **Create calculate_comparison_data method**
   - Temporarily store current period dates
   - Set period to comparison dates
   - Call all calculation methods for comparison period
   - Call create_data_structure() for comparison data
   - Restore current period dates
   - Return comparison data structure

6. **Modify create_data_structure method**
   - Check if enable_comparison is True
   - If enabled, call calculate_comparison_data()
   - Add "comparison" section to data structure
   - Include comparison period metadata
   - Include full comparison P&L data
   - Keep current and comparison data separate

7. **Add period comparison helper**
   - Create `_get_period_label()` method
   - Return descriptive label for period
   - Format: "Jan 2026", "Q1 2026", "FY 2026"
   - Support Sinhala and Tamil labels

8. **Update generate method**
   - Call validate_comparison_dates() if comparison enabled
   - Proceed with standard generation
   - Comparison data added via create_data_structure()

9. **Add comparison metadata**
   - Include comparison_enabled flag in metadata
   - Add comparison_period_start and comparison_period_end
   - Add period labels for current and comparison
   - Include comparison_type (prior_period, prior_year, custom)

### Comparison Mode Structure

```
┌─────────────────────────────────────────────────┐
│         Comparison Mode Structure               │
├─────────────────────────────────────────────────┤
│ Current Period Data:                            │
│  • All standard P&L sections                    │
│  • Revenue, COGS, OpEx, Net Income              │
│                                                 │
│ Comparison Section:                             │
│  • comparison_metadata                          │
│    - period_start                               │
│    - period_end                                 │
│    - period_label                               │
│  • comparison_data                              │
│    - revenue                                    │
│    - cost_of_goods_sold                         │
│    - gross_profit                               │
│    - operating_expenses                         │
│    - operating_income                           │
│    - other_income                               │
│    - other_expenses                             │
│    - net_income_before_tax                      │
│    - income_tax_expense                         │
│    - net_income                                 │
└─────────────────────────────────────────────────┘
```

### Comparison Modes

| Mode | Description | Use Case |
|------|-------------|----------|
| Prior Period | Same duration before current period | Month-over-month, quarter-over-quarter |
| Prior Year | Same period one year ago | Year-over-year analysis |
| Custom | User-specified comparison period | Specific historical comparison |

### Comparison Period Calculation

#### Prior Period (Auto-calculate)
```
Current Period: Jan 1 - Jan 31, 2026
           ↓
Prior Period: Dec 1 - Dec 31, 2025
(Same duration, immediately before)

Current Period: Q1 2026 (Jan 1 - Mar 31)
           ↓
Prior Period: Q4 2025 (Oct 1 - Dec 31)
(Same duration quarter)
```

#### Prior Year (Auto-calculate)
```
Current Period: Jan 1 - Jan 31, 2026
           ↓
Prior Year: Jan 1 - Jan 31, 2025
(Same dates, one year ago)

Current Period: 2026 Full Year
           ↓
Prior Year: 2025 Full Year
```

### Comparison Data Example

```json
{
  "metadata": {
    "report_name": "Profit & Loss Statement",
    "period_start": "2026-01-01",
    "period_end": "2026-01-31",
    "period_label": "January 2026",
    "comparison_enabled": true,
    "comparison_type": "prior_period",
    "currency": "LKR"
  },
  "revenue": {
    "total_revenue": "2950000.00"
  },
  "cost_of_goods_sold": {
    "total_cogs": "1380000.00"
  },
  "gross_profit": {
    "amount": "1570000.00",
    "margin_percentage": "53.22"
  },
  "operating_expenses": {
    "total_operating_expenses": "569000.00"
  },
  "operating_income": {
    "amount": "1001000.00"
  },
  "net_income": {
    "amount": "842690.00",
    "margin_percentage": "28.57"
  },
  "comparison": {
    "metadata": {
      "period_start": "2025-12-01",
      "period_end": "2025-12-31",
      "period_label": "December 2025"
    },
    "data": {
      "revenue": {
        "total_revenue": "2650000.00"
      },
      "cost_of_goods_sold": {
        "total_cogs": "1250000.00"
      },
      "gross_profit": {
        "amount": "1400000.00",
        "margin_percentage": "52.83"
      },
      "operating_expenses": {
        "total_operating_expenses": "545000.00"
      },
      "operating_income": {
        "amount": "855000.00"
      },
      "net_income": {
        "amount": "730500.00",
        "margin_percentage": "27.57"
      }
    }
  }
}
```

### Comparison Use Cases

| Scenario | Current Period | Comparison Period | Purpose |
|----------|---------------|-------------------|---------|
| Monthly Review | Jan 2026 | Dec 2025 | Track month-to-month changes |
| Quarterly Analysis | Q1 2026 | Q4 2025 | Compare quarterly performance |
| Year-over-Year | Jan 2026 | Jan 2025 | Annual growth tracking |
| Budget vs Actual | Jan 2026 | Jan 2026 Budget | Performance against plan |

### Period Label Formats

| Period Type | English Label | Sinhala Label | Tamil Label |
|-------------|--------------|---------------|-------------|
| Monthly | "January 2026" | "ජනවාරි 2026" | "ஜனவரி 2026" |
| Quarterly | "Q1 2026" | "1වන කාර්තුව 2026" | "காலாண்டு 1 2026" |
| Annual | "FY 2026" | "මූල්‍ය වර්ෂය 2026" | "நிதியாண்டு 2026" |

### Expected Outcome
- Comparison mode capability added
- Auto-calculate prior period option
- Prior year comparison support
- Custom period comparison
- Comparison data in output structure
- Period labels for clarity
- Foundation for variance analysis

### Verification Checklist
- [ ] enable_comparison parameter added to __init__
- [ ] comparison_start_date parameter added
- [ ] comparison_end_date parameter added
- [ ] validate_comparison_dates method created
- [ ] get_comparison_period helper implemented
- [ ] calculate_comparison_data method created
- [ ] create_data_structure modified to include comparison
- [ ] _get_period_label helper added
- [ ] Comparison metadata included
- [ ] Prior period auto-calculation works
- [ ] Prior year auto-calculation works
- [ ] Custom period comparison supported

---

## Task 44: Add PL Variance Calculation

### Overview
Add variance calculation methods to compute the differences between current and comparison periods. Calculate both absolute variance (amount difference) and relative variance (percentage change) for all P&L line items including revenue, COGS, expenses, and profit levels. These metrics enable quick identification of significant changes and performance trends.

### Dependencies
- Task 43: Add PL Comparison Mode
- Comparison data available in output structure
- Current and comparison periods both calculated

### Instructions

1. **Open profit_loss.py file**
   - Navigate to `apps/accounting/reports/profit_loss.py`
   - Locate PLGenerator class

2. **Create calculate_variance method**
   - Define method with current_value and comparison_value parameters
   - Both parameters are Decimal amounts
   - Returns dictionary with amount and percentage variance

3. **Calculate amount variance**
   - Subtract comparison_value from current_value
   - Result shows increase (positive) or decrease (negative)
   - Format as LKR amount

4. **Calculate percentage variance**
   - Formula: ((current - comparison) / comparison) × 100
   - Handle zero comparison value (return None or "N/A")
   - Return as percentage with 2 decimal places
   - Positive = growth, Negative = decline

5. **Create add_variance_to_structure method**
   - Accept current_data and comparison_data dictionaries
   - Iterate through all P&L sections
   - Calculate variance for each line item
   - Add variance data to structure

6. **Add variance to revenue section**
   - Calculate variance for total_revenue
   - Add amount_variance and percentage_variance fields
   - Calculate variance for each revenue account
   - Include in revenue section of output

7. **Add variance to COGS section**
   - Calculate variance for total_cogs
   - Add variance fields
   - Calculate per-account variances
   - Format with appropriate sign (higher COGS = negative)

8. **Add variance to gross profit**
   - Calculate gross_profit variance
   - Include amount and percentage
   - Show impact on margin percentage

9. **Add variance to operating expenses**
   - Calculate variance for total_operating_expenses
   - Add variance for each expense category
   - Include variances for individual accounts
   - Higher expenses shown as negative variance

10. **Add variance to operating income**
    - Calculate operating_income variance
    - Include margin percentage change
    - Highlight as key performance indicator

11. **Add variance to other sections**
    - Calculate variance for other_income
    - Calculate variance for other_expenses
    - Calculate variance for net_income_before_tax
    - Calculate variance for income_tax_expense

12. **Add variance to net income**
    - Calculate net_income variance (most important)
    - Include amount and percentage variance
    - Calculate margin percentage change
    - Format prominently

13. **Create format_variance helper method**
    - Accept variance dictionary
    - Format amount with LKR currency
    - Format percentage with % symbol
    - Add up/down indicators (↑ ↓)
    - Apply color indicators for positive/negative

14. **Modify create_data_structure method**
    - After adding comparison data
    - Call add_variance_to_structure()
    - Include variance in all sections
    - Ensure variance only added when comparison enabled

15. **Add variance summary section**
    - Create top-level "variance_summary" section
    - Include key variances (revenue, gross profit, net income)
    - Show largest positive and negative changes
    - Provide quick variance overview

### Variance Calculation Structure

```
┌─────────────────────────────────────────────────┐
│         Variance Calculation Structure          │
├─────────────────────────────────────────────────┤
│ For Each Line Item:                             │
│  • current_value                                │
│  • comparison_value                             │
│  • variance                                     │
│    - amount (current - comparison)              │
│    - percentage ((current - comparison) / comp) │
│    - direction (increase/decrease)              │
│    - indicator (↑ or ↓)                         │
└─────────────────────────────────────────────────┘
```

### Variance Formulas

| Metric | Formula | Interpretation |
|--------|---------|----------------|
| Amount Variance | Current - Comparison | Absolute difference in LKR |
| Percentage Variance | ((Current - Comparison) / Comparison) × 100 | Relative change percentage |
| Favorable Variance | Revenue ↑, Expenses ↓ | Positive for business |
| Unfavorable Variance | Revenue ↓, Expenses ↑ | Negative for business |

### Variance Calculation Examples

#### Revenue Variance (Favorable)
```
Current Revenue: Rs. 2,950,000
Comparison Revenue: Rs. 2,650,000

Amount Variance: Rs. 300,000 (favorable ↑)
Percentage Variance: +11.32% (favorable ↑)
```

#### Expense Variance (Unfavorable)
```
Current OpEx: Rs. 569,000
Comparison OpEx: Rs. 545,000

Amount Variance: Rs. 24,000 (unfavorable ↑)
Percentage Variance: +4.40% (unfavorable ↑)
```

#### Net Income Variance
```
Current Net Income: Rs. 842,690
Comparison Net Income: Rs. 730,500

Amount Variance: Rs. 112,190 (favorable ↑)
Percentage Variance: +15.36% (favorable ↑)
```

### Variance Data Structure Example

```json
{
  "revenue": {
    "total_revenue": "2950000.00",
    "variance": {
      "amount": "300000.00",
      "percentage": "11.32",
      "direction": "increase",
      "indicator": "↑",
      "favorable": true
    }
  },
  "cost_of_goods_sold": {
    "total_cogs": "1380000.00",
    "variance": {
      "amount": "130000.00",
      "percentage": "10.40",
      "direction": "increase",
      "indicator": "↑",
      "favorable": false
    }
  },
  "gross_profit": {
    "amount": "1570000.00",
    "margin_percentage": "53.22",
    "variance": {
      "amount": "170000.00",
      "percentage": "12.14",
      "direction": "increase",
      "indicator": "↑",
      "margin_change": "+0.39"
    }
  },
  "operating_expenses": {
    "total_operating_expenses": "569000.00",
    "variance": {
      "amount": "24000.00",
      "percentage": "4.40",
      "direction": "increase",
      "indicator": "↑",
      "favorable": false
    }
  },
  "net_income": {
    "amount": "842690.00",
    "margin_percentage": "28.57",
    "variance": {
      "amount": "112190.00",
      "percentage": "15.36",
      "direction": "increase",
      "indicator": "↑",
      "favorable": true,
      "margin_change": "+1.00"
    }
  },
  "variance_summary": {
    "largest_favorable": {
      "item": "Revenue",
      "amount": "300000.00",
      "percentage": "11.32"
    },
    "largest_unfavorable": {
      "item": "Cost of Goods Sold",
      "amount": "130000.00",
      "percentage": "10.40"
    },
    "net_impact": {
      "amount": "112190.00",
      "percentage": "15.36"
    }
  }
}
```

### Variance Interpretation Guidelines

| Variance Type | Good (Favorable) | Bad (Unfavorable) |
|---------------|------------------|-------------------|
| Revenue | Increase (↑) | Decrease (↓) |
| COGS | Decrease (↓) | Increase (↑) |
| Operating Expenses | Decrease (↓) | Increase (↑) |
| Gross Profit | Increase (↑) | Decrease (↓) |
| Operating Income | Increase (↑) | Decrease (↓) |
| Net Income | Increase (↑) | Decrease (↓) |

### Variance Indicators

| Indicator | Symbol | Color | Meaning |
|-----------|--------|-------|---------|
| Increase | ↑ | Green/Red | Depending on context |
| Decrease | ↓ | Red/Green | Depending on context |
| Favorable | ↑ | Green | Positive impact |
| Unfavorable | ↑/↓ | Red | Negative impact |
| No Change | - | Gray | 0% variance |

### Expected Outcome
- Variance calculations for all P&L items
- Amount variance in LKR
- Percentage variance computed
- Direction indicators (↑ ↓)
- Favorable/unfavorable flags
- Variance summary section
- Quick identification of significant changes

### Verification Checklist
- [ ] calculate_variance method created
- [ ] Amount variance calculation correct
- [ ] Percentage variance calculation correct
- [ ] Zero comparison value handled
- [ ] add_variance_to_structure method implemented
- [ ] Revenue variance calculated
- [ ] COGS variance calculated
- [ ] Gross profit variance calculated
- [ ] Operating expenses variance calculated
- [ ] Operating income variance calculated
- [ ] Net income variance calculated
- [ ] format_variance helper created
- [ ] Direction indicators added
- [ ] Favorable/unfavorable flags set
- [ ] Variance summary section created

---

## Task 45: Add PL Percentage of Revenue

### Overview
Add common-size analysis to the P&L Statement by calculating each line item as a percentage of total revenue. This percentage-of-revenue analysis (also called vertical analysis) enables comparison of cost structure across different periods and identification of expense trends relative to revenue, providing insights into operational efficiency and cost management.

### Dependencies
- Task 42: Create PL Data Structure
- Revenue total calculated
- All expense categories calculated
- Net income calculated

### Instructions

1. **Open profit_loss.py file**
   - Navigate to `apps/accounting/reports/profit_loss.py`
   - Locate PLGenerator class

2. **Create calculate_percentage_of_revenue method**
   - Accept line_item_amount and total_revenue parameters
   - Both are Decimal values
   - Returns percentage as Decimal

3. **Implement percentage calculation**
   - Formula: (line_item / total_revenue) × 100
   - Handle zero revenue (return 0 or None)
   - Round to 2 decimal places
   - Return as percentage value

4. **Create add_percentages_to_structure method**
   - Accept data_structure dictionary
   - Extract total_revenue from structure
   - Iterate through all P&L sections
   - Calculate percentage for each line item
   - Add percentage_of_revenue field

5. **Add percentage to revenue accounts**
   - Calculate percentage for each revenue account
   - Show how each revenue stream contributes to total
   - Total revenue = 100.00%
   - Add percentage_of_revenue field to each account

6. **Add percentage to COGS**
   - Calculate COGS percentage of revenue
   - Shows cost structure efficiency
   - Add to total_cogs
   - Add to individual COGS accounts

7. **Add percentage to gross profit**
   - Calculate as percentage of revenue
   - Equals gross profit margin
   - Key profitability metric
   - Already calculated, add as percentage_of_revenue

8. **Add percentage to operating expenses**
   - Calculate total OpEx as percentage of revenue
   - Calculate each expense category percentage
   - Calculate individual account percentages
   - Shows expense structure

9. **Add percentage to EPF/ETF**
   - Calculate EPF/ETF as percentage of revenue
   - Important for Sri Lankan businesses
   - Track labor cost percentage

10. **Add percentage to operating income**
    - Calculate as percentage of revenue
    - Equals operating margin
    - Key performance indicator
    - Add as percentage_of_revenue field

11. **Add percentage to other income/expenses**
    - Calculate other_income percentage
    - Calculate other_expenses percentage
    - Usually small percentages
    - Include for completeness

12. **Add percentage to net income**
    - Calculate net income percentage of revenue
    - Equals net profit margin
    - Bottom line profitability metric
    - Most important percentage

13. **Create format_percentage helper method**
    - Accept percentage Decimal value
    - Format with 2 decimal places
    - Add % symbol
    - Return formatted string

14. **Modify create_data_structure method**
    - After building complete structure
    - Call add_percentages_to_structure()
    - Include percentages in all sections
    - Ensure percentages always calculated

15. **Add percentage summary section**
    - Create "common_size_analysis" summary
    - Include key percentages (COGS %, OpEx %, Net Margin)
    - Compare to industry benchmarks if available
    - Provide efficiency insights

### Percentage of Revenue Structure

```
┌─────────────────────────────────────────────────┐
│      Percentage of Revenue Structure            │
├─────────────────────────────────────────────────┤
│ Every Line Item Includes:                       │
│  • amount (LKR value)                           │
│  • percentage_of_revenue (% of total revenue)   │
│                                                 │
│ Key Percentages:                                │
│  • Total Revenue = 100.00%                      │
│  • COGS % = Cost structure                      │
│  • Gross Profit % = Gross margin                │
│  • OpEx % = Operating efficiency                │
│  • Operating Income % = Operating margin        │
│  • Net Income % = Net profit margin             │
└─────────────────────────────────────────────────┘
```

### Common-Size P&L Example

```
REVENUE
  Sales Revenue              Rs. 2,500,000    84.75%
  Service Revenue            Rs.   450,000    15.25%
  TOTAL REVENUE             Rs. 2,950,000   100.00%

COST OF GOODS SOLD
  Purchases                  Rs. 1,200,000    40.68%
  Direct Labor               Rs.   180,000     6.10%
  TOTAL COGS                Rs. 1,380,000    46.78%

GROSS PROFIT                Rs. 1,570,000    53.22%

OPERATING EXPENSES
  Salaries & Wages           Rs.   350,000    11.86%
  EPF Expense                Rs.    42,000     1.42%
  ETF Expense                Rs.    10,500     0.36%
  Rent Expense               Rs.    75,000     2.54%
  Utilities                  Rs.    21,500     0.73%
  Depreciation               Rs.    25,000     0.85%
  Other                      Rs.    45,000     1.53%
  TOTAL OPERATING EXPENSES   Rs.   569,000    19.29%

OPERATING INCOME            Rs. 1,001,000    33.93%

OTHER INCOME
  Interest Income            Rs.     5,200     0.18%
  TOTAL OTHER INCOME        Rs.     5,200     0.18%

OTHER EXPENSES
  Interest Expense           Rs.    12,000     0.41%
  Bank Charges               Rs.     2,800     0.09%
  TOTAL OTHER EXPENSES      Rs.    14,800     0.50%

NET INCOME BEFORE TAX       Rs.   991,400    33.61%

INCOME TAX EXPENSE          Rs.   148,710     5.04%

NET INCOME                  Rs.   842,690    28.57%
```

### Percentage of Revenue Data Example

```json
{
  "revenue": {
    "accounts": [
      {
        "code": "4000",
        "name": "Sales Revenue",
        "balance": "2500000.00",
        "percentage_of_revenue": "84.75"
      },
      {
        "code": "4100",
        "name": "Service Revenue",
        "balance": "450000.00",
        "percentage_of_revenue": "15.25"
      }
    ],
    "total_revenue": "2950000.00",
    "percentage_of_revenue": "100.00"
  },
  "cost_of_goods_sold": {
    "total_cogs": "1380000.00",
    "percentage_of_revenue": "46.78"
  },
  "gross_profit": {
    "amount": "1570000.00",
    "percentage_of_revenue": "53.22"
  },
  "operating_expenses": {
    "salaries": [
      {
        "code": "5200",
        "name": "Salaries & Wages",
        "balance": "350000.00",
        "percentage_of_revenue": "11.86"
      }
    ],
    "epf_etf": [
      {
        "code": "5210",
        "name": "EPF Expense",
        "balance": "42000.00",
        "percentage_of_revenue": "1.42"
      },
      {
        "code": "5211",
        "name": "ETF Expense",
        "balance": "10500.00",
        "percentage_of_revenue": "0.36"
      }
    ],
    "total_operating_expenses": "569000.00",
    "percentage_of_revenue": "19.29"
  },
  "operating_income": {
    "amount": "1001000.00",
    "percentage_of_revenue": "33.93"
  },
  "net_income": {
    "amount": "842690.00",
    "percentage_of_revenue": "28.57"
  },
  "common_size_analysis": {
    "cogs_percentage": "46.78",
    "gross_margin": "53.22",
    "opex_percentage": "19.29",
    "operating_margin": "33.93",
    "net_margin": "28.57",
    "efficiency_metrics": {
      "labor_cost_percentage": "13.64",
      "rent_percentage": "2.54",
      "depreciation_percentage": "0.85"
    }
  }
}
```

### Industry Benchmark Comparisons (Sri Lanka Retail)

| Metric | Typical Range | Excellent | Concern |
|--------|--------------|-----------|---------|
| COGS % | 40-60% | < 45% | > 65% |
| Gross Margin % | 40-60% | > 55% | < 35% |
| Operating Expenses % | 15-25% | < 20% | > 30% |
| Operating Margin % | 20-40% | > 35% | < 15% |
| Net Profit Margin % | 5-15% | > 12% | < 5% |

### Sri Lankan Context - EPF/ETF Analysis

| Component | Calculation | Typical % |
|-----------|-------------|-----------|
| Salaries | Base salary costs | 10-15% of revenue |
| EPF (12%) | Employer contribution | 1.2-1.8% of revenue |
| ETF (3%) | Employer contribution | 0.3-0.5% of revenue |
| Total Labor | Salaries + EPF + ETF | 11.5-17.3% of revenue |

### Common-Size Analysis Use Cases

| Use Case | Analysis | Benefit |
|----------|----------|---------|
| Period Comparison | Compare % across months | Identify structural changes |
| Budget vs Actual | Compare % to budget targets | Spot cost overruns |
| Industry Benchmark | Compare to industry averages | Assess competitiveness |
| Efficiency Tracking | Monitor OpEx % over time | Improve cost control |
| Pricing Strategy | Analyze COGS % changes | Adjust pricing |

### Expected Outcome
- Percentage of revenue for all line items
- Common-size analysis complete
- Easy comparison across periods
- Structural cost analysis
- Efficiency metrics calculated
- Industry benchmark ready

### Verification Checklist
- [ ] calculate_percentage_of_revenue method created
- [ ] Percentage formula correct
- [ ] Zero revenue handled
- [ ] add_percentages_to_structure method implemented
- [ ] Revenue accounts have percentages
- [ ] COGS percentage calculated
- [ ] Gross profit percentage added
- [ ] Operating expenses percentages calculated
- [ ] EPF/ETF percentages included
- [ ] Operating income percentage added
- [ ] Net income percentage calculated
- [ ] format_percentage helper created
- [ ] All percentages sum logically
- [ ] common_size_analysis section added

---

## Task 46: Create PL HTML Template

### Overview
Create a professional HTML template for rendering the Profit & Loss Statement. The template displays all P&L sections with proper formatting, includes comparison data and variance analysis when available, shows percentage of revenue for each line item, supports multi-language display (English, Sinhala, Tamil), formats currency in LKR, and provides a print-friendly layout suitable for IRD compliance.

### Dependencies
- Task 45: Add PL Percentage of Revenue
- All P&L data structure complete
- Variance calculations functional
- Django template system configured

### Instructions

1. **Create profit_loss.html file**
   - Navigate to `apps/accounting/templates/reports/`
   - Create `profit_loss.html` template file
   - Use Django template syntax

2. **Add template header**
   - Extend base template or standalone HTML
   - Include CSS for styling
   - Add responsive design support
   - Include print media CSS

3. **Create report title section**
   - Display "Profit & Loss Statement" heading
   - Show in English, Sinhala, Tamil based on settings
   - Include company logo if available
   - Add IRD compliance statement if needed

4. **Add metadata section**
   - Display tenant business name
   - Show report period (start to end date)
   - Display generation timestamp
   - Include currency (LKR)
   - Add comparison period if enabled

5. **Create revenue section table**
   - Table header: Account, Amount, % of Revenue
   - List all revenue accounts
   - Show individual account balances
   - Display percentage for each account
   - Bold total revenue line
   - Add variance column if comparison enabled

6. **Create COGS section table**
   - Header: Cost of Goods Sold
   - List all COGS accounts (5100-5199)
   - Show amounts and percentages
   - Bold total COGS line
   - Include variance if applicable

7. **Add gross profit display**
   - Prominent display of gross profit
   - Show amount, percentage, variance
   - Use larger font or highlighting
   - Label as "Gross Profit" / "මුළු ලාභය"

8. **Create operating expenses section**
   - Group expenses by category
   - Salaries subsection
   - EPF/ETF subsection (Sri Lankan context)
   - Rent subsection
   - Utilities subsection
   - Depreciation subsection
   - Other expenses subsection
   - Show amounts and percentages
   - Bold total operating expenses
   - Include variances

9. **Add operating income display**
   - Display operating income prominently
   - Show amount, percentage, variance
   - Highlight as key metric

10. **Create other income/expenses sections**
    - Other Income table
    - Other Expenses table
    - Show accounts with amounts and percentages
    - Include totals

11. **Add net income before tax**
    - Display calculation clearly
    - Show amount and percentage
    - Include variance

12. **Add tax expense section**
    - Show income tax expense
    - Display as percentage of revenue
    - Include IRD compliance note

13. **Add net income display**
    - Largest, most prominent display
    - Show final net income
    - Display net profit margin percentage
    - Include variance if comparison enabled
    - Use highlighting or color

14. **Create comparison columns**
    - If comparison enabled, add comparison columns
    - Show current period, prior period, variance side-by-side
    - Format variance with indicators (↑ ↓)
    - Color-code favorable/unfavorable

15. **Add styling and formatting**
    - LKR currency formatting (Rs. 2,500,000.00)
    - Align numbers right
    - Alternate row colors for readability
    - Bold section headers
    - Use borders and spacing
    - Print-friendly CSS

16. **Add footer section**
    - Disclaimer text
    - Generated by system name
    - Generation timestamp
    - Page numbers for print
    - IRD reference if applicable

17. **Add multi-language support**
    - Use Django i18n for labels
    - Support Sinhala labels (විකුණුම්, වියදම්)
    - Support Tamil labels
    - Fallback to English

18. **Create responsive layout**
    - Mobile-friendly display
    - Tablet optimization
    - Desktop full width
    - Print layout optimization

### HTML Template Structure

```
┌─────────────────────────────────────────────────┐
│              P&L HTML Template                  │
├─────────────────────────────────────────────────┤
│ Header:                                         │
│  • Company Logo                                 │
│  • Report Title                                 │
│  • Business Name                                │
│  • Period Information                           │
│                                                 │
│ Revenue Section:                                │
│  • Account table (Code, Name, Amount, %)        │
│  • Total Revenue (bold)                         │
│                                                 │
│ COGS Section:                                   │
│  • Account table                                │
│  • Total COGS (bold)                            │
│                                                 │
│ Gross Profit (highlighted)                      │
│                                                 │
│ Operating Expenses:                             │
│  • Salaries subsection                          │
│  • EPF/ETF subsection                           │
│  • Rent, Utilities, etc.                        │
│  • Total OpEx (bold)                            │
│                                                 │
│ Operating Income (highlighted)                  │
│                                                 │
│ Other Income/Expenses                           │
│                                                 │
│ Net Income Before Tax                           │
│                                                 │
│ Tax Expense                                     │
│                                                 │
│ NET INCOME (most prominent)                     │
│                                                 │
│ Footer:                                         │
│  • Disclaimer                                   │
│  • Timestamp                                    │
│  • Page numbers                                 │
└─────────────────────────────────────────────────┘
```

### Table Layout with Comparison

```
═══════════════════════════════════════════════════════════════════
                    PROFIT & LOSS STATEMENT
           LankaCommerce (Pvt) Ltd - Colombo Branch
              Period: January 1 - 31, 2026
═══════════════════════════════════════════════════════════════════

Account                Current      Prior      Variance    % of Rev
───────────────────────────────────────────────────────────────────
REVENUE
Sales Revenue       2,500,000  2,250,000   +250,000 ↑    84.75%
Service Revenue       450,000    400,000    +50,000 ↑    15.25%
───────────────────────────────────────────────────────────────────
TOTAL REVENUE       2,950,000  2,650,000   +300,000 ↑   100.00%

COST OF GOODS SOLD
Purchases           1,200,000  1,100,000   +100,000 ↑    40.68%
Direct Labor          180,000    150,000    +30,000 ↑     6.10%
───────────────────────────────────────────────────────────────────
TOTAL COGS          1,380,000  1,250,000   +130,000 ↑    46.78%

GROSS PROFIT        1,570,000  1,400,000   +170,000 ↑    53.22%

OPERATING EXPENSES
Salaries & Wages      350,000    340,000    +10,000 ↑    11.86%
EPF Expense            42,000     40,800     +1,200 ↑     1.42%
ETF Expense            10,500     10,200       +300 ↑     0.36%
Rent Expense           75,000     75,000         -         2.54%
Utilities              21,500     20,000     +1,500 ↑     0.73%
Depreciation           25,000     25,000         -         0.85%
Marketing              45,000     34,000    +11,000 ↑     1.53%
───────────────────────────────────────────────────────────────────
TOTAL OPERATING EXP   569,000    545,000    +24,000 ↑    19.29%

OPERATING INCOME    1,001,000    855,000   +146,000 ↑    33.93%

OTHER INCOME
Interest Income         5,200      4,500       +700 ↑     0.18%
───────────────────────────────────────────────────────────────────
TOTAL OTHER INCOME      5,200      4,500       +700 ↑     0.18%

OTHER EXPENSES
Interest Expense       12,000     11,000     +1,000 ↑     0.41%
Bank Charges            2,800      2,500       +300 ↑     0.09%
───────────────────────────────────────────────────────────────────
TOTAL OTHER EXPENSES   14,800     13,500     +1,300 ↑     0.50%

NET INCOME BEFORE TAX 991,400    846,000   +145,400 ↑    33.61%

INCOME TAX EXPENSE    148,710    126,900    +21,810 ↑     5.04%

═══════════════════════════════════════════════════════════════════
NET INCOME            842,690    730,500   +112,190 ↑    28.57%
═══════════════════════════════════════════════════════════════════
```

### CSS Styling Guidelines

| Element | Styling |
|---------|---------|
| Report Title | Large font, bold, centered |
| Section Headers | Bold, background color, 14pt |
| Total Lines | Bold, larger font, border top/bottom |
| Net Income | Extra bold, highlighted background, 16pt |
| Variance Positive | Green text, ↑ indicator |
| Variance Negative | Red text, ↓ indicator |
| Percentages | Right-aligned, 2 decimals |
| Currency | Right-aligned, comma separator |

### Multi-Language Labels

| English | Sinhala | Tamil |
|---------|---------|-------|
| Revenue | ආදායම | வருவாய் |
| Cost of Goods Sold | විකුණුම් පිරිවැය | விற்பனை செலவு |
| Gross Profit | මුළු ලාභය | மொத்த இலாபம் |
| Operating Expenses | මෙහෙයුම් වියදම් | இயக்க செலவுகள் |
| Net Income | ශුද්ධ ආදායම | நிகர வருமானம் |
| Salaries | වැටුප් | சம்பளம் |

### Expected Outcome
- Professional HTML template
- All P&L sections displayed
- Comparison columns if enabled
- Variance indicators
- Percentage of revenue shown
- LKR currency formatting
- Multi-language support
- Print-friendly layout
- IRD compliant format

### Verification Checklist
- [ ] profit_loss.html file created
- [ ] Template header complete
- [ ] Report title section added
- [ ] Metadata section included
- [ ] Revenue table created
- [ ] COGS table created
- [ ] Gross profit displayed
- [ ] Operating expenses grouped properly
- [ ] EPF/ETF shown separately
- [ ] Operating income displayed
- [ ] Other income/expenses sections added
- [ ] Net income prominently shown
- [ ] Comparison columns added (if enabled)
- [ ] Variance indicators included
- [ ] LKR formatting applied
- [ ] Multi-language labels supported
- [ ] Print CSS added
- [ ] Responsive layout implemented

---

## Task 47: Create PL PDF Generator

### Overview
Create a PDF generation method for the Profit & Loss Statement using WeasyPrint. This method renders the HTML template to a professionally formatted PDF document suitable for printing, sharing, and IRD submission. The PDF includes proper page layout, headers/footers, page breaks, and maintains all formatting from the HTML template.

### Dependencies
- Task 46: Create PL HTML Template
- WeasyPrint library installed
- HTML template functional
- All P&L data structure complete

### Instructions

1. **Open profit_loss.py file**
   - Navigate to `apps/accounting/reports/profit_loss.py`
   - Locate PLGenerator class

2. **Import PDF generation libraries**
   - Import WeasyPrint modules (HTML, CSS)
   - Import Django template rendering utilities
   - Import file handling modules
   - Import BytesIO for in-memory PDF

3. **Create generate_pdf method**
   - Define public method `generate_pdf()`
   - Returns PDF file as bytes
   - Can save to file or return as response

4. **Generate P&L data**
   - Call generate() method to get P&L data structure
   - Ensure all calculations complete
   - Include comparison data if enabled
   - Include variance and percentages

5. **Prepare template context**
   - Create context dictionary with P&L data
   - Add metadata (business name, period, etc.)
   - Include formatting helpers
   - Add currency symbol (Rs.)
   - Include language settings

6. **Render HTML template**
   - Load profit_loss.html template
   - Render with context data
   - Generate complete HTML string
   - Apply template variables

7. **Add PDF-specific CSS**
   - Define page size (A4)
   - Set margins (top, bottom, left, right)
   - Add header and footer styles
   - Configure page break rules
   - Set font sizes for print

8. **Create page header**
   - Add company name to header
   - Include report title
   - Add period information
   - Format for each page

9. **Create page footer**
   - Add page numbers (Page X of Y)
   - Include generation timestamp
   - Add disclaimer text
   - Include IRD compliance statement if needed

10. **Generate PDF with WeasyPrint**
    - Create WeasyPrint HTML object from rendered HTML
    - Apply CSS stylesheets
    - Generate PDF bytes
    - Store in BytesIO buffer

11. **Add filename generation helper**
    - Create `get_pdf_filename()` method
    - Format: "PL_Statement_TenantName_Period.pdf"
    - Include date range in filename
    - Sanitize filename for filesystem

12. **Add save_to_file method**
    - Accept file path parameter
    - Generate PDF bytes
    - Write to specified file path
    - Return success status

13. **Add return_as_response method**
    - Generate PDF bytes
    - Create Django FileResponse
    - Set content type to application/pdf
    - Set Content-Disposition header with filename
    - Return HTTP response

14. **Handle PDF generation errors**
    - Try-except block around PDF generation
    - Catch WeasyPrint errors
    - Catch template rendering errors
    - Log errors appropriately
    - Raise custom exceptions

15. **Add PDF metadata**
    - Set PDF title
    - Set PDF author (tenant name)
    - Set PDF subject (Profit & Loss Statement)
    - Set PDF creation date
    - Include keywords for searchability

16. **Optimize PDF output**
    - Compress images if any
    - Optimize file size
    - Ensure fast rendering
    - Maintain print quality

### PDF Generation Flow

```
┌────────────────────────────────────────────────┐
│         PDF Generation Flow                    │
├────────────────────────────────────────────────┤
│ 1. Call generate() → Get P&L data              │
│         ↓                                      │
│ 2. Prepare template context                   │
│         ↓                                      │
│ 3. Render profit_loss.html                    │
│         ↓                                      │
│ 4. Apply PDF-specific CSS                     │
│         ↓                                      │
│ 5. Add headers and footers                    │
│         ↓                                      │
│ 6. Generate PDF with WeasyPrint               │
│         ↓                                      │
│ 7. Return as file or HTTP response            │
└────────────────────────────────────────────────┘
```

### PDF-Specific CSS

```css
@page {
    size: A4;
    margin: 2cm 1.5cm;
    
    @top-center {
        content: "Profit & Loss Statement";
        font-size: 10pt;
        font-weight: bold;
    }
    
    @bottom-center {
        content: "Page " counter(page) " of " counter(pages);
        font-size: 9pt;
    }
    
    @bottom-left {
        content: "Generated: " string(generation-date);
        font-size: 8pt;
    }
}

body {
    font-family: "Helvetica", "Arial", sans-serif;
    font-size: 10pt;
}

.page-break {
    page-break-before: always;
}

.no-break {
    page-break-inside: avoid;
}

table {
    width: 100%;
    border-collapse: collapse;
}

th {
    background-color: #333;
    color: white;
    font-weight: bold;
}

.total-row {
    font-weight: bold;
    border-top: 2px solid #000;
    border-bottom: 2px solid #000;
}

.net-income {
    font-size: 12pt;
    font-weight: bold;
    background-color: #f0f0f0;
}
```

### PDF Page Layout

```
┌─────────────────────────────────────────┐
│          [Header Section]               │
│  Company Name - P&L Statement           │
│  Period: Jan 1 - Jan 31, 2026          │
├─────────────────────────────────────────┤
│                                         │
│         [Report Content]                │
│                                         │
│  Revenue Section                        │
│  COGS Section                           │
│  Gross Profit                           │
│  Operating Expenses                     │
│  Operating Income                       │
│  Other Income/Expenses                  │
│  Net Income Before Tax                  │
│  Tax Expense                            │
│  NET INCOME                             │
│                                         │
├─────────────────────────────────────────┤
│          [Footer Section]               │
│  Page 1 of 2        Generated: Date     │
│  IRD Compliance Statement               │
└─────────────────────────────────────────┘
```

### PDF Filename Format

| Component | Format | Example |
|-----------|--------|---------|
| Prefix | PL_Statement_ | PL_Statement_ |
| Tenant Name | Sanitized name | LankaCommerce |
| Date Range | YYYYMMDD_YYYYMMDD | 20260101_20260131 |
| Extension | .pdf | .pdf |
| Full Name | Combined | PL_Statement_LankaCommerce_20260101_20260131.pdf |

### WeasyPrint Configuration

```python
# Basic PDF generation
from weasyprint import HTML, CSS
from io import BytesIO

def generate_pdf(self):
    # Get P&L data
    data = self.generate()
    
    # Render template
    html_string = render_to_string('reports/profit_loss.html', {
        'data': data,
        'tenant': self.tenant,
        'currency': 'LKR'
    })
    
    # Generate PDF
    pdf_buffer = BytesIO()
    HTML(string=html_string).write_pdf(
        pdf_buffer,
        stylesheets=[CSS(string=pdf_css)]
    )
    
    return pdf_buffer.getvalue()
```

### PDF Metadata Configuration

| Metadata Field | Value |
|----------------|-------|
| Title | Profit & Loss Statement - Period |
| Author | Tenant Business Name |
| Subject | Financial Report - P&L Statement |
| Creator | LankaERP System |
| Keywords | P&L, Income Statement, Financial Report, IRD |

### Expected Outcome
- PDF generation method functional
- Professional PDF output
- Proper page layout (A4)
- Headers and footers on each page
- Page numbers included
- Print-ready quality
- IRD compliant format
- File save capability
- HTTP response capability

### Verification Checklist
- [ ] PDF generation libraries imported
- [ ] generate_pdf method created
- [ ] P&L data generated
- [ ] Template context prepared
- [ ] HTML template rendered
- [ ] PDF-specific CSS added
- [ ] Page headers configured
- [ ] Page footers configured
- [ ] WeasyPrint PDF generation working
- [ ] get_pdf_filename helper created
- [ ] save_to_file method implemented
- [ ] return_as_response method implemented
- [ ] Error handling added
- [ ] PDF metadata set
- [ ] Output optimized

---

## Task 48: Create PL API Endpoint

### Overview
Create a REST API endpoint for accessing the Profit & Loss Statement. The endpoint accepts period parameters, comparison options, and output format preferences, returning P&L data as JSON or PDF. This API enables frontend dashboards, mobile apps, and external integrations to retrieve P&L statements programmatically with proper authentication and tenant isolation.

### Dependencies
- Task 47: Create PL PDF Generator
- PLGenerator class complete
- All P&L methods functional
- Django REST Framework configured
- API authentication in place

### Instructions

1. **Open reports views file**
   - Navigate to `apps/accounting/views/reports.py`
   - Or create if it doesn't exist

2. **Import required modules**
   - Import Django REST Framework views (APIView)
   - Import Response, status codes
   - Import PLGenerator class
   - Import serializers if needed
   - Import authentication classes
   - Import permission classes

3. **Create ProfitLossAPIView class**
   - Inherit from APIView
   - Add authentication_classes
   - Add permission_classes (IsAuthenticated)
   - Add view docstring

4. **Define get method**
   - Accept request parameter
   - Extract query parameters
   - Validate parameters
   - Return P&L data

5. **Extract query parameters**
   - start_date (required)
   - end_date (required)
   - enable_comparison (optional, default False)
   - comparison_start_date (optional)
   - comparison_end_date (optional)
   - format (optional: 'json' or 'pdf', default 'json')

6. **Validate date parameters**
   - Check start_date and end_date provided
   - Parse date strings to date objects
   - Validate date format (YYYY-MM-DD)
   - Check start_date before end_date
   - Validate comparison dates if provided
   - Return 400 error for invalid dates

7. **Get tenant from request**
   - Extract tenant from request.user
   - Handle multi-tenancy
   - Ensure tenant isolation

8. **Instantiate PLGenerator**
   - Create PLGenerator instance
   - Pass tenant, start_date, end_date
   - Pass comparison parameters if enabled
   - Handle initialization errors

9. **Handle JSON format response**
   - If format='json' (default)
   - Call generator.generate()
   - Get P&L data structure
   - Return as JSON response
   - Include HTTP 200 status

10. **Handle PDF format response**
    - If format='pdf'
    - Call generator.generate_pdf()
    - Get PDF bytes
    - Create FileResponse with PDF
    - Set content type to application/pdf
    - Set Content-Disposition with filename
    - Return HTTP response

11. **Add error handling**
    - Catch ValidationError
    - Catch database errors
    - Catch calculation errors
    - Return appropriate HTTP error codes
    - Include error messages in response

12. **Add response metadata**
    - Include request parameters in response
    - Add generation timestamp
    - Include API version
    - Add success flag

13. **Create URL pattern**
    - Add URL route in urls.py
    - Path: `/api/accounting/reports/profit-loss/`
    - Method: GET
    - Name: 'profit-loss-report'

14. **Add API documentation**
    - Document endpoint purpose
    - List all query parameters
    - Provide example requests
    - Show example responses
    - Include error codes

15. **Add rate limiting**
    - Implement rate limiting for API
    - Prevent abuse
    - Configure limits per tenant

16. **Add caching**
    - Cache P&L results for same parameters
    - Set appropriate cache timeout
    - Invalidate on new GL entries
    - Improve performance

### API Endpoint Specification

```
┌─────────────────────────────────────────────────┐
│         Profit & Loss API Endpoint              │
├─────────────────────────────────────────────────┤
│ URL: /api/accounting/reports/profit-loss/       │
│ Method: GET                                     │
│ Authentication: Required                        │
│                                                 │
│ Query Parameters:                               │
│  • start_date (required, YYYY-MM-DD)            │
│  • end_date (required, YYYY-MM-DD)              │
│  • enable_comparison (optional, boolean)        │
│  • comparison_start_date (optional)             │
│  • comparison_end_date (optional)               │
│  • format (optional, 'json' or 'pdf')           │
│                                                 │
│ Response Formats:                               │
│  • JSON: P&L data structure                     │
│  • PDF: Binary PDF file                         │
│                                                 │
│ Status Codes:                                   │
│  • 200: Success                                 │
│  • 400: Bad Request (invalid parameters)        │
│  • 401: Unauthorized                            │
│  • 500: Server Error                            │
└─────────────────────────────────────────────────┘
```

### API Request Examples

#### Basic Request (JSON)
```
GET /api/accounting/reports/profit-loss/?start_date=2026-01-01&end_date=2026-01-31
Authorization: Bearer <token>
```

#### Request with Comparison
```
GET /api/accounting/reports/profit-loss/
    ?start_date=2026-01-01
    &end_date=2026-01-31
    &enable_comparison=true
    &comparison_start_date=2025-12-01
    &comparison_end_date=2025-12-31
Authorization: Bearer <token>
```

#### Request for PDF
```
GET /api/accounting/reports/profit-loss/
    ?start_date=2026-01-01
    &end_date=2026-01-31
    &format=pdf
Authorization: Bearer <token>
```

### API Response Example (JSON)

```json
{
  "success": true,
  "metadata": {
    "api_version": "1.0",
    "generated_at": "2026-01-25T10:30:00Z",
    "request_parameters": {
      "start_date": "2026-01-01",
      "end_date": "2026-01-31",
      "enable_comparison": false,
      "format": "json"
    }
  },
  "data": {
    "report_metadata": {
      "report_name": "Profit & Loss Statement",
      "report_type": "PROFIT_LOSS",
      "period_start": "2026-01-01",
      "period_end": "2026-01-31",
      "currency": "LKR",
      "tenant": "lankacommerce_tenant"
    },
    "revenue": {
      "total_revenue": "2950000.00",
      "percentage_of_revenue": "100.00"
    },
    "cost_of_goods_sold": {
      "total_cogs": "1380000.00",
      "percentage_of_revenue": "46.78"
    },
    "gross_profit": {
      "amount": "1570000.00",
      "percentage_of_revenue": "53.22"
    },
    "operating_expenses": {
      "total_operating_expenses": "569000.00",
      "percentage_of_revenue": "19.29"
    },
    "operating_income": {
      "amount": "1001000.00",
      "percentage_of_revenue": "33.93"
    },
    "net_income": {
      "amount": "842690.00",
      "percentage_of_revenue": "28.57"
    }
  }
}
```

### API Error Response Example

```json
{
  "success": false,
  "error": {
    "code": "INVALID_DATE_RANGE",
    "message": "start_date must be before end_date",
    "details": {
      "start_date": "2026-02-01",
      "end_date": "2026-01-31"
    }
  }
}
```

### Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| start_date | Date (YYYY-MM-DD) | Yes | - | Period start date |
| end_date | Date (YYYY-MM-DD) | Yes | - | Period end date |
| enable_comparison | Boolean | No | false | Enable period comparison |
| comparison_start_date | Date | No | - | Comparison period start |
| comparison_end_date | Date | No | - | Comparison period end |
| format | String | No | 'json' | Response format ('json' or 'pdf') |

### HTTP Status Codes

| Code | Meaning | When Used |
|------|---------|-----------|
| 200 | Success | P&L generated successfully |
| 400 | Bad Request | Invalid parameters |
| 401 | Unauthorized | Missing or invalid authentication |
| 403 | Forbidden | User lacks permission |
| 500 | Server Error | Calculation or generation error |

### URL Configuration

```python
# apps/accounting/urls.py
from django.urls import path
from apps.accounting.views.reports import ProfitLossAPIView

urlpatterns = [
    path('reports/profit-loss/', ProfitLossAPIView.as_view(), name='profit-loss-report'),
]
```

### Authentication Requirements

| Requirement | Implementation |
|-------------|----------------|
| Authentication | Token-based or Session |
| Authorization | IsAuthenticated permission |
| Tenant Isolation | Automatic via request.user.tenant |
| Rate Limiting | 60 requests per hour per user |

### Expected Outcome
- Functional P&L API endpoint
- JSON response format
- PDF response format
- Query parameter validation
- Error handling
- Authentication required
- Tenant isolation enforced
- Proper HTTP status codes
- API documentation

### Verification Checklist
- [ ] ProfitLossAPIView class created
- [ ] get method implemented
- [ ] Query parameters extracted
- [ ] Date validation implemented
- [ ] Tenant extracted from request
- [ ] PLGenerator instantiated
- [ ] JSON format response handled
- [ ] PDF format response handled
- [ ] Error handling added
- [ ] Response metadata included
- [ ] URL pattern added
- [ ] API documentation created
- [ ] Authentication configured
- [ ] Tenant isolation verified
- [ ] Rate limiting added
- [ ] Caching implemented

---

## Summary

This document completed the Profit & Loss Statement implementation with output, comparison, and delivery features:

### Completed Features
- ✅ Structured P&L data format (Task 42)
- ✅ Period-over-period comparison mode (Task 43)
- ✅ Variance calculations with amount and percentage (Task 44)
- ✅ Percentage of revenue (common-size) analysis (Task 45)
- ✅ Professional HTML template with multi-language support (Task 46)
- ✅ PDF generation with WeasyPrint (Task 47)
- ✅ REST API endpoint for JSON and PDF delivery (Task 48)

### Key Achievements
1. **Structured Output** - Hierarchical P&L data format for all consumers
2. **Comparison Analysis** - Side-by-side period comparison with auto-calculation
3. **Variance Metrics** - Amount and percentage variances with favorable/unfavorable indicators
4. **Common-Size Analysis** - Every line item as percentage of revenue
5. **Professional Display** - HTML template with LKR formatting and multi-language labels
6. **PDF Export** - IRD-compliant PDF generation with WeasyPrint
7. **API Access** - REST endpoint for programmatic access

### Sri Lankan Context
- LKR currency formatting (Rs. 2,500,000.00)
- EPF/ETF shown separately in operating expenses
- Sinhala and Tamil label support
- IRD compliance considerations
- Bank charges prominently shown

### Next Steps
Proceed to [Group-D_Balance-Sheet](../Group-D_Balance-Sheet/) to implement the Balance Sheet report with assets, liabilities, equity sections, financial position calculations, and similar comparison/output capabilities.

---

**Document Status:** ✅ Complete  
**Total Tasks:** 7  
**Total Lines:** ~980
