# Tasks 25-30: TB Data Structure, Comparison, and Output

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 11 - Financial Reports  
> **Group:** B - Trial Balance Report  
> **Document:** 02 of 02  
> **Tasks Covered:** 25, 26, 27, 28, 29, 30

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-17-24_TrialBalance-Calculations.md](01_Tasks-17-24_TrialBalance-Calculations.md)
- **→ Next Group:** [Group-C_Profit-Loss-Statement](../Group-C_Profit-Loss-Statement/)

---

## Document Overview

This document covers the output structure, comparison capabilities, and presentation layers for the Trial Balance report. These components transform calculated balance data into structured output formats, enable period-to-period comparison with variance analysis, and provide professional HTML/PDF presentation through templates and API endpoints.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 25 | Create TB Data Structure | Medium | 30 min |
| 26 | Add TB Comparison Mode | Medium | 35 min |
| 27 | Add TB Variance Calc | Low | 20 min |
| 28 | Create TB HTML Template | Medium | 40 min |
| 29 | Create TB PDF Generator | Medium | 30 min |
| 30 | Create TB API Endpoint | Low | 20 min |

---

## Task 25: Create TB Data Structure

### Overview
Create the standardized data structure for Trial Balance output that organizes calculated balances into a structured format for templates, API responses, and PDF generation. This structure ensures consistency across all presentation layers and includes account details, balances, grouping, and totals.

### Dependencies
- Task 24: Add Totals Validation
- TrialBalanceGenerator class exists
- Account balance calculations completed

### Instructions

1. **Create generate_report method in TrialBalanceGenerator**
   - This is the main public method that returns formatted data
   - Takes start_date and end_date parameters
   - Returns dictionary with complete Trial Balance data

2. **Initialize report metadata section**
   - Create 'metadata' dictionary within report output
   - Include report_title: "Trial Balance"
   - Include report_type: "trial_balance"
   - Include date_range with start_date and end_date formatted
   - Include generated_at timestamp (current datetime)
   - Include generated_by user information
   - Include tenant information (name, IRD number)

3. **Build report_period dictionary**
   - Create 'report_period' section
   - Include start_date in YYYY-MM-DD format
   - Include end_date in YYYY-MM-DD format
   - Include period_description (e.g., "January 1 - December 31, 2026")
   - Include fiscal_year if applicable

4. **Structure account_groups section**
   - Create 'account_groups' list to hold grouped accounts
   - Each group represents an account type (Assets, Liabilities, etc.)
   - Iterate through account types in proper order

5. **Build individual account group structure**
   - For each account type, create group dictionary
   - Include group_name (e.g., "Assets", "Liabilities")
   - Include group_type code (e.g., "ASSET", "LIABILITY")
   - Include group_order for sorting
   - Create 'accounts' list within group

6. **Structure individual account entries**
   - For each account in group, create account dictionary
   - Include account_code (e.g., "1100")
   - Include account_name (e.g., "Cash in Hand")
   - Include account_level (for indentation in display)
   - Include parent_account_code if applicable

7. **Add balance columns to account entries**
   - Include opening_debit (formatted as decimal)
   - Include opening_credit (formatted as decimal)
   - Include period_debit (sum of debits in period)
   - Include period_credit (sum of credits in period)
   - Include closing_debit (calculated closing balance)
   - Include closing_credit (calculated closing balance)
   - All amounts in LKR with 2 decimal places

8. **Calculate group subtotals**
   - For each account group, create 'subtotals' dictionary
   - Sum opening_debit for all accounts in group
   - Sum opening_credit for all accounts in group
   - Sum period_debit for all accounts in group
   - Sum period_credit for all accounts in group
   - Sum closing_debit for all accounts in group
   - Sum closing_credit for all accounts in group

9. **Build grand totals section**
   - Create 'totals' dictionary at report level
   - Sum all group subtotals for each balance column
   - Include total_opening_debit
   - Include total_opening_credit
   - Include total_period_debit
   - Include total_period_credit
   - Include total_closing_debit
   - Include total_closing_credit

10. **Add validation status**
    - Create 'validation' section
    - Include is_balanced boolean (debits equal credits)
    - Include validation_errors list if imbalances found
    - Include validation_timestamp

11. **Format currency values for Sri Lanka**
    - All amounts formatted with comma separators
    - Format: "1,234,567.89"
    - Currency symbol: "Rs." or "LKR" prefix
    - Zero amounts shown as "-" or "0.00" based on preference

12. **Add display preferences**
    - Include 'display_options' dictionary
    - Include show_zero_balances (boolean)
    - Include show_inactive_accounts (boolean)
    - Include decimal_places (default: 2)
    - Include currency_symbol ("Rs.")

### Trial Balance Data Structure

```
Trial Balance Output Structure
═══════════════════════════════════════════════════

{
  "metadata": {
    "report_title": "Trial Balance",
    "report_type": "trial_balance",
    "date_range": {
      "start_date": "2026-01-01",
      "end_date": "2026-12-31"
    },
    "generated_at": "2026-12-31T23:59:59Z",
    "generated_by": "admin@example.com",
    "tenant": {
      "name": "LankaCommerce Pvt Ltd",
      "ird_number": "123456789V"
    }
  },
  
  "report_period": {
    "start_date": "2026-01-01",
    "end_date": "2026-12-31",
    "period_description": "Year 2026",
    "fiscal_year": 2026
  },
  
  "account_groups": [
    {
      "group_name": "Assets",
      "group_type": "ASSET",
      "group_order": 1,
      "accounts": [
        {
          "account_code": "1100",
          "account_name": "Cash in Hand",
          "account_level": 1,
          "parent_account_code": null,
          "opening_debit": "50,000.00",
          "opening_credit": "0.00",
          "period_debit": "200,000.00",
          "period_credit": "180,000.00",
          "closing_debit": "70,000.00",
          "closing_credit": "0.00"
        },
        {
          "account_code": "1200",
          "account_name": "Bank Accounts",
          "account_level": 1,
          "parent_account_code": null,
          "opening_debit": "1,000,000.00",
          "opening_credit": "0.00",
          "period_debit": "5,000,000.00",
          "period_credit": "4,800,000.00",
          "closing_debit": "1,200,000.00",
          "closing_credit": "0.00"
        }
      ],
      "subtotals": {
        "opening_debit": "1,050,000.00",
        "opening_credit": "0.00",
        "period_debit": "5,200,000.00",
        "period_credit": "4,980,000.00",
        "closing_debit": "1,270,000.00",
        "closing_credit": "0.00"
      }
    },
    {
      "group_name": "Liabilities",
      "group_type": "LIABILITY",
      "group_order": 2,
      "accounts": [ ... ],
      "subtotals": { ... }
    }
  ],
  
  "totals": {
    "total_opening_debit": "5,000,000.00",
    "total_opening_credit": "5,000,000.00",
    "total_period_debit": "20,000,000.00",
    "total_period_credit": "20,000,000.00",
    "total_closing_debit": "8,000,000.00",
    "total_closing_credit": "8,000,000.00"
  },
  
  "validation": {
    "is_balanced": true,
    "validation_errors": [],
    "validation_timestamp": "2026-12-31T23:59:59Z"
  },
  
  "display_options": {
    "show_zero_balances": false,
    "show_inactive_accounts": false,
    "decimal_places": 2,
    "currency_symbol": "Rs."
  }
}
```

### Account Group Order

| Group Name | Group Type | Order | Account Code Range |
|------------|-----------|-------|-------------------|
| Assets | ASSET | 1 | 1000-1999 |
| Liabilities | LIABILITY | 2 | 2000-2999 |
| Equity | EQUITY | 3 | 3000-3999 |
| Revenue | REVENUE | 4 | 4000-4999 |
| Expenses | EXPENSE | 5 | 5000-5999 |

### Balance Column Descriptions

| Column | Description | Calculation |
|--------|-------------|-------------|
| Opening Debit | Debit balance at period start | Sum of debits before start_date |
| Opening Credit | Credit balance at period start | Sum of credits before start_date |
| Period Debit | Debits during period | Sum of debits between start_date and end_date |
| Period Credit | Credits during period | Sum of credits between start_date and end_date |
| Closing Debit | Debit balance at period end | Opening + Period debits - Period credits |
| Closing Credit | Credit balance at period end | Opening + Period credits - Period debits |

### Sri Lankan Formatting Standards

#### Currency Format
```
Amount: 1234567.89
Formatted: "Rs. 1,234,567.89"
OR: "LKR 1,234,567.89"

Zero amounts:
Display as: "0.00" or "-" (configurable)
```

#### Date Format
```
ISO Format: "2026-12-31"
Display Format: "31 December 2026"
Display Format (Sinhala): "2026 දෙසැම්බර් 31"
```

#### Report Header Format
```
TRIAL BALANCE
As at 31 December 2026

LankaCommerce Pvt Ltd
IRD No: 123456789V
```

### Expected Outcome
- Standardized data structure for Trial Balance
- Consistent format across all presentation layers
- Proper grouping by account type
- Complete balance information (opening, period, closing)
- Validated totals (debits equal credits)
- Sri Lankan formatting standards

### Verification Checklist
- [ ] generate_report method created
- [ ] Metadata section included
- [ ] Report period information added
- [ ] Account groups properly structured
- [ ] Individual accounts with all balance columns
- [ ] Group subtotals calculated
- [ ] Grand totals calculated
- [ ] Validation status included
- [ ] LKR currency formatting applied
- [ ] Display options configured
- [ ] Structure matches expected JSON format

---

## Task 26: Add TB Comparison Mode

### Overview
Add comparison mode capability to the Trial Balance generator, enabling side-by-side comparison of current period with a prior period. This feature supports variance analysis, trend identification, and period-over-period financial review required for management reporting and IRD compliance.

### Dependencies
- Task 25: Create TB Data Structure
- generate_report method exists

### Instructions

1. **Add comparison parameters to generate_report**
   - Add optional parameter: include_comparison (boolean, default False)
   - Add optional parameter: comparison_start_date (date, default None)
   - Add optional parameter: comparison_end_date (date, default None)
   - Validate comparison dates if comparison mode enabled

2. **Validate comparison date ranges**
   - Ensure comparison dates are provided if include_comparison=True
   - Verify comparison period does not overlap with current period
   - Typically comparison period is prior year or prior quarter
   - Raise validation error if dates invalid

3. **Generate current period data**
   - Call existing balance calculation methods for current period
   - Store results in 'current_period' section
   - Use existing data structure from Task 25

4. **Generate comparison period data**
   - If include_comparison=True, generate second report
   - Use comparison_start_date and comparison_end_date
   - Call same calculation methods with comparison dates
   - Store results in 'comparison_period' section

5. **Structure comparison output format**
   - Create 'comparison' dictionary at root level
   - Include is_comparison_mode: true
   - Include current_period dictionary (full Trial Balance data)
   - Include comparison_period dictionary (full Trial Balance data)
   - Include variance calculations (to be done in Task 27)

6. **Add comparison period metadata**
   - For comparison_period, include all metadata
   - Label as "Comparison Period" in report_title
   - Include comparison date range clearly
   - Include same fiscal year information if applicable

7. **Ensure account matching between periods**
   - Both periods must include same accounts
   - If account exists in current but not comparison, show zeros for comparison
   - If account exists in comparison but not current, include in output
   - Maintain consistent account ordering

8. **Add period comparison labels**
   - Current period labeled as "Current Year" or "Current Quarter"
   - Comparison period labeled as "Prior Year" or "Prior Quarter"
   - Labels configurable based on date ranges

9. **Handle fiscal year differences**
   - If comparison crosses fiscal years, note in metadata
   - Ensure opening balances calculated correctly
   - Account for different fiscal year start dates

10. **Optimize comparison data retrieval**
    - Fetch all required journal entries in single query
    - Filter by date ranges for both periods
    - Cache account list to avoid duplicate queries
    - Use database aggregation where possible

### Comparison Mode Data Structure

```
Comparison Mode Output Structure
════════════════════════════════════════════

{
  "comparison": {
    "is_comparison_mode": true,
    "comparison_type": "year_over_year",
    
    "current_period": {
      "metadata": {
        "report_title": "Trial Balance - Current Year",
        "date_range": {
          "start_date": "2026-01-01",
          "end_date": "2026-12-31"
        },
        "period_label": "Year 2026"
      },
      "account_groups": [ ... ],
      "totals": { ... }
    },
    
    "comparison_period": {
      "metadata": {
        "report_title": "Trial Balance - Prior Year",
        "date_range": {
          "start_date": "2025-01-01",
          "end_date": "2025-12-31"
        },
        "period_label": "Year 2025"
      },
      "account_groups": [ ... ],
      "totals": { ... }
    },
    
    "variance": {
      // To be populated in Task 27
    }
  }
}
```

### Comparison Period Types

| Comparison Type | Current Period | Comparison Period | Use Case |
|----------------|----------------|-------------------|----------|
| Year over Year | 2026-01-01 to 2026-12-31 | 2025-01-01 to 2025-12-31 | Annual comparison |
| Quarter over Quarter | 2026-Q1 | 2025-Q4 | Quarterly trends |
| Month over Month | 2026-06 | 2026-05 | Monthly analysis |
| Custom Range | Any range | Any prior range | Flexible analysis |

### Account Matching Logic

```
Account Matching Between Periods
═════════════════════════════════

Scenario 1: Account exists in both periods
Current:   1100 - Cash in Hand = Rs. 70,000
Comparison: 1100 - Cash in Hand = Rs. 50,000
Result:    Show both, calculate variance

Scenario 2: Account exists only in current
Current:   1150 - Petty Cash = Rs. 5,000
Comparison: 1150 - Petty Cash = (not exists)
Result:    Show current, comparison = 0.00

Scenario 3: Account exists only in comparison
Current:   1175 - Old Account = (not exists)
Comparison: 1175 - Old Account = Rs. 10,000
Result:    Show both, current = 0.00

Scenario 4: Account closed during period
Current:   1180 - Closed Account = Rs. 0.00
Comparison: 1180 - Closed Account = Rs. 15,000
Result:    Include if show_zero_balances = true
```

### Comparison Period Labels

#### English Labels
```
Current Period: "Year 2026"
Comparison Period: "Year 2025"

Current Period: "Q1 2026 (Jan-Mar)"
Comparison Period: "Q1 2025 (Jan-Mar)"

Current Period: "June 2026"
Comparison Period: "May 2026"
```

#### Sinhala Labels
```
වත්මන් කාලය: "වර්ෂ 2026"
සංසන්දන කාලය: "වර්ෂ 2025"
```

#### Tamil Labels
```
தற்போதைய காலம்: "ஆண்டு 2026"
ஒப்பீட்டு காலம்: "ஆண்டு 2025"
```

### Date Range Validation

```python
# Pseudo-code for validation logic

def validate_comparison_dates(current_start, current_end, 
                             comparison_start, comparison_end):
    """
    Validate comparison date ranges
    """
    # Check all dates provided
    if not all([comparison_start, comparison_end]):
        raise ValidationError("Comparison dates required")
    
    # Check comparison period before current period
    if comparison_end >= current_start:
        raise ValidationError("Comparison period must be before current")
    
    # Check period lengths are similar (optional)
    current_days = (current_end - current_start).days
    comparison_days = (comparison_end - comparison_start).days
    
    if abs(current_days - comparison_days) > 5:
        # Warning: periods not same length
        pass
    
    return True
```

### Expected Outcome
- Comparison mode capability enabled
- Side-by-side period data
- Proper account matching between periods
- Support for different comparison types
- Validated date ranges
- Foundation for variance analysis

### Verification Checklist
- [ ] include_comparison parameter added
- [ ] comparison_start_date parameter added
- [ ] comparison_end_date parameter added
- [ ] Date validation logic implemented
- [ ] Current period data generated
- [ ] Comparison period data generated
- [ ] Comparison mode data structure created
- [ ] Account matching logic implemented
- [ ] Period labels configured
- [ ] Metadata for both periods included
- [ ] Fiscal year handling verified

---

## Task 27: Add TB Variance Calc

### Overview
Implement variance calculation logic for Trial Balance comparison mode, computing the differences between current and comparison periods in both absolute amounts and percentages. Variance analysis helps identify significant changes, trends, and anomalies requiring management attention or IRD disclosure.

### Dependencies
- Task 26: Add TB Comparison Mode
- Comparison mode data structure exists

### Instructions

1. **Create calculate_variance method**
   - Accept current_amount and comparison_amount as parameters
   - Return dictionary with amount_variance and percentage_variance
   - Handle zero/null values appropriately

2. **Calculate amount variance**
   - Formula: current_amount - comparison_amount
   - Positive variance indicates increase
   - Negative variance indicates decrease
   - Example: Current Rs. 70,000 - Comparison Rs. 50,000 = Rs. 20,000

3. **Calculate percentage variance**
   - Formula: ((current - comparison) / comparison) × 100
   - Handle division by zero (comparison = 0)
   - If comparison is zero but current has value, show as "N/A" or "New"
   - Round to 2 decimal places

4. **Add variance to account level**
   - For each account in output, add 'variance' dictionary
   - Include variance for opening_debit, opening_credit
   - Include variance for period_debit, period_credit
   - Include variance for closing_debit, closing_credit

5. **Add variance to group subtotals**
   - Calculate variance for each subtotal line
   - Include amount and percentage for each balance column
   - Group variances help identify category-level changes

6. **Add variance to grand totals**
   - Calculate variance for total_opening_debit/credit
   - Calculate variance for total_period_debit/credit
   - Calculate variance for total_closing_debit/credit
   - Grand total variances validate overall changes

7. **Format variance display**
   - Positive variances: "+Rs. 20,000.00 (+40.00%)"
   - Negative variances: "-Rs. 10,000.00 (-20.00%)"
   - Zero variance: "Rs. 0.00 (0.00%)"
   - New accounts: "Rs. 50,000.00 (New)"
   - Closed accounts: "-Rs. 50,000.00 (Closed)"

8. **Add variance classification**
   - Classify variance as: favorable, unfavorable, or neutral
   - For Assets: increase = favorable
   - For Liabilities: decrease = favorable
   - For Revenue: increase = favorable
   - For Expenses: decrease = favorable

9. **Add materiality threshold**
   - Define materiality percentage (e.g., 10%)
   - Flag variances exceeding threshold
   - Include 'is_material' boolean in variance data
   - Helps focus on significant changes

10. **Add variance summary section**
    - Create 'variance_summary' at report level
    - List top 10 material variances
    - Include account code, name, amount, percentage
    - Order by absolute variance amount (largest first)

11. **Handle special cases**
    - Account switched from debit to credit (or vice versa)
    - Account with zero balance in both periods
    - Account closed during comparison period
    - New account created during current period

### Variance Calculation Examples

```
Variance Calculation Examples
══════════════════════════════════════════════

Example 1: Simple Increase
Current:    Rs. 70,000.00
Comparison: Rs. 50,000.00
Amount Variance: +Rs. 20,000.00
Percentage Variance: +40.00%
Classification: Favorable (Asset increase)

Example 2: Decrease
Current:    Rs. 45,000.00
Comparison: Rs. 60,000.00
Amount Variance: -Rs. 15,000.00
Percentage Variance: -25.00%
Classification: Unfavorable (Asset decrease)

Example 3: New Account
Current:    Rs. 25,000.00
Comparison: Rs. 0.00
Amount Variance: +Rs. 25,000.00
Percentage Variance: N/A (New)
Classification: New

Example 4: Closed Account
Current:    Rs. 0.00
Comparison: Rs. 30,000.00
Amount Variance: -Rs. 30,000.00
Percentage Variance: N/A (Closed)
Classification: Closed

Example 5: No Change
Current:    Rs. 100,000.00
Comparison: Rs. 100,000.00
Amount Variance: Rs. 0.00
Percentage Variance: 0.00%
Classification: No change
```

### Variance Data Structure

```json
{
  "variance": {
    "account_code": "1100",
    "account_name": "Cash in Hand",
    
    "closing_balance": {
      "current_debit": "70,000.00",
      "comparison_debit": "50,000.00",
      "amount_variance": "20,000.00",
      "percentage_variance": "40.00",
      "variance_direction": "increase",
      "is_material": true,
      "classification": "favorable"
    },
    
    "opening_balance": {
      "current_debit": "50,000.00",
      "comparison_debit": "40,000.00",
      "amount_variance": "10,000.00",
      "percentage_variance": "25.00",
      "variance_direction": "increase",
      "is_material": true,
      "classification": "favorable"
    },
    
    "period_movement": {
      "current_debit": "200,000.00",
      "comparison_debit": "180,000.00",
      "amount_variance": "20,000.00",
      "percentage_variance": "11.11",
      "variance_direction": "increase",
      "is_material": true,
      "classification": "neutral"
    }
  }
}
```

### Variance Classification Rules

| Account Type | Direction | Classification | Explanation |
|--------------|-----------|----------------|-------------|
| Asset | Increase | Favorable | More assets = stronger position |
| Asset | Decrease | Unfavorable | Fewer assets = weaker position |
| Liability | Increase | Unfavorable | More debt = riskier position |
| Liability | Decrease | Favorable | Less debt = stronger position |
| Equity | Increase | Favorable | More equity = stronger position |
| Revenue | Increase | Favorable | More income = better performance |
| Revenue | Decrease | Unfavorable | Less income = worse performance |
| Expense | Increase | Unfavorable | More expenses = worse margins |
| Expense | Decrease | Favorable | Less expenses = better margins |

### Materiality Threshold Configuration

```python
# Materiality settings

MATERIALITY_PERCENTAGE = 10.0  # 10% change is material
MATERIALITY_ABSOLUTE = 100000.00  # Rs. 100,000 is material

def is_material_variance(amount_variance, percentage_variance, 
                        comparison_amount):
    """
    Determine if variance is material
    """
    # Check percentage threshold
    if abs(percentage_variance) >= MATERIALITY_PERCENTAGE:
        return True
    
    # Check absolute amount threshold
    if abs(amount_variance) >= MATERIALITY_ABSOLUTE:
        return True
    
    return False
```

### Variance Summary Section

```json
{
  "variance_summary": {
    "material_variances_count": 15,
    "total_favorable_count": 8,
    "total_unfavorable_count": 7,
    
    "top_variances": [
      {
        "rank": 1,
        "account_code": "5100",
        "account_name": "Salaries and Wages",
        "current_amount": "2,500,000.00",
        "comparison_amount": "2,000,000.00",
        "amount_variance": "500,000.00",
        "percentage_variance": "25.00",
        "classification": "unfavorable"
      },
      {
        "rank": 2,
        "account_code": "4100",
        "account_name": "Sales Revenue",
        "current_amount": "8,000,000.00",
        "comparison_amount": "7,500,000.00",
        "amount_variance": "500,000.00",
        "percentage_variance": "6.67",
        "classification": "favorable"
      }
    ]
  }
}
```

### Expected Outcome
- Variance calculations for all balance columns
- Amount and percentage variances
- Variance classification (favorable/unfavorable)
- Materiality flagging
- Variance summary with top changes
- Foundation for management analysis

### Verification Checklist
- [ ] calculate_variance method created
- [ ] Amount variance calculated correctly
- [ ] Percentage variance calculated correctly
- [ ] Zero division handled
- [ ] Variance added to account level
- [ ] Variance added to group subtotals
- [ ] Variance added to grand totals
- [ ] Variance formatting applied
- [ ] Classification logic implemented
- [ ] Materiality threshold configured
- [ ] Variance summary section created
- [ ] Special cases handled

---

## Task 28: Create TB HTML Template

### Overview
Create the HTML template for Trial Balance report display, providing a professional, printable format with proper column alignment, grouping, and Sri Lankan formatting standards. This template is used for both browser display and PDF generation via WeasyPrint.

### Dependencies
- Task 27: Add TB Variance Calc
- Django template engine configured
- Static CSS files for styling

### Instructions

1. **Create template file**
   - Create file at `apps/accounting/templates/reports/trial_balance.html`
   - Extend base report template if available
   - Use Django template language

2. **Add report header section**
   - Include report title "TRIAL BALANCE"
   - Include report subtitle with date range
   - Include tenant business name
   - Include tenant IRD number
   - Include generation date and time
   - Center-align header elements

3. **Add period information section**
   - Display "For the period: DD Month YYYY to DD Month YYYY"
   - Display fiscal year if applicable
   - Display comparison period if comparison mode enabled

4. **Create table structure**
   - Use HTML table with proper semantic markup
   - Include thead, tbody, tfoot sections
   - Use th for headers, td for data cells
   - Apply CSS classes for styling

5. **Define table columns**
   - Column 1: Account Code (left-aligned)
   - Column 2: Account Name (left-aligned, with indentation)
   - Column 3: Opening Debit (right-aligned)
   - Column 4: Opening Credit (right-aligned)
   - Column 5: Period Debit (right-aligned)
   - Column 6: Period Credit (right-aligned)
   - Column 7: Closing Debit (right-aligned)
   - Column 8: Closing Credit (right-aligned)

6. **Add comparison columns if enabled**
   - When comparison mode, add columns for comparison period
   - Add columns for variance (amount and percentage)
   - Total columns: 16 (8 current + 8 comparison/variance)

7. **Implement account grouping**
   - For each account group (Assets, Liabilities, etc.)
   - Add group header row with bold text
   - List accounts within group
   - Add subtotal row after each group
   - Use background color to distinguish groups

8. **Apply account hierarchy indentation**
   - Parent accounts: no indentation
   - Level 1 sub-accounts: 20px left padding
   - Level 2 sub-accounts: 40px left padding
   - Level 3 sub-accounts: 60px left padding
   - Use CSS classes like `indent-1`, `indent-2`

9. **Format currency values**
   - Right-align all amounts
   - Use comma thousands separator
   - Two decimal places
   - Prefix with "Rs." or show in LKR column header
   - Zero values display as "-" or "0.00"

10. **Add grand totals row**
    - Bold text for "TOTAL" label
    - Sum of all group subtotals
    - Double underline or thick border
    - Highlight row with background color

11. **Add validation section**
    - Show "Debits = Credits" if balanced
    - Show warning message if imbalanced
    - Display any validation errors

12. **Apply print-specific styling**
    - Use @media print CSS rules
    - Set page size to A4 portrait or landscape
    - Add page headers with report title
    - Add page footers with page numbers
    - Control page breaks (avoid breaking groups)
    - Hide non-printable elements (buttons, etc.)

13. **Add responsive design**
    - For small screens, allow horizontal scroll
    - For tablets, reduce font sizes slightly
    - For mobile, consider stacked layout
    - Use CSS media queries

14. **Include Sri Lankan localization**
    - Date format: "31 December 2026"
    - Currency: "Rs." prefix
    - Optional Sinhala/Tamil translations for headers
    - IRD compliance formatting

### Template Structure

```html
Template Structure Outline
═══════════════════════════════════════

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Trial Balance</title>
    <link rel="stylesheet" href="report_styles.css">
</head>
<body>
    <!-- Report Header -->
    <div class="report-header">
        <h1>TRIAL BALANCE</h1>
        <h2>{{ tenant_name }}</h2>
        <p>IRD No: {{ ird_number }}</p>
        <p>As at {{ end_date }}</p>
    </div>
    
    <!-- Period Information -->
    <div class="period-info">
        <p>For the period: {{ start_date }} to {{ end_date }}</p>
    </div>
    
    <!-- Trial Balance Table -->
    <table class="trial-balance-table">
        <thead>
            <tr>
                <th>Code</th>
                <th>Account Name</th>
                <th>Opening Dr</th>
                <th>Opening Cr</th>
                <th>Period Dr</th>
                <th>Period Cr</th>
                <th>Closing Dr</th>
                <th>Closing Cr</th>
            </tr>
        </thead>
        <tbody>
            <!-- Account Groups Loop -->
            {% for group in account_groups %}
                <tr class="group-header">
                    <td colspan="8">{{ group.group_name }}</td>
                </tr>
                
                <!-- Accounts Loop -->
                {% for account in group.accounts %}
                    <tr class="indent-{{ account.level }}">
                        <td>{{ account.code }}</td>
                        <td>{{ account.name }}</td>
                        <td class="amount">{{ account.opening_dr }}</td>
                        <td class="amount">{{ account.opening_cr }}</td>
                        <td class="amount">{{ account.period_dr }}</td>
                        <td class="amount">{{ account.period_cr }}</td>
                        <td class="amount">{{ account.closing_dr }}</td>
                        <td class="amount">{{ account.closing_cr }}</td>
                    </tr>
                {% endfor %}
                
                <!-- Group Subtotal -->
                <tr class="subtotal">
                    <td colspan="2">Subtotal - {{ group.group_name }}</td>
                    <td class="amount">{{ group.subtotal_opening_dr }}</td>
                    <td class="amount">{{ group.subtotal_opening_cr }}</td>
                    <td class="amount">{{ group.subtotal_period_dr }}</td>
                    <td class="amount">{{ group.subtotal_period_cr }}</td>
                    <td class="amount">{{ group.subtotal_closing_dr }}</td>
                    <td class="amount">{{ group.subtotal_closing_cr }}</td>
                </tr>
            {% endfor %}
        </tbody>
        <tfoot>
            <!-- Grand Total -->
            <tr class="grand-total">
                <td colspan="2">TOTAL</td>
                <td class="amount">{{ total_opening_dr }}</td>
                <td class="amount">{{ total_opening_cr }}</td>
                <td class="amount">{{ total_period_dr }}</td>
                <td class="amount">{{ total_period_cr }}</td>
                <td class="amount">{{ total_closing_dr }}</td>
                <td class="amount">{{ total_closing_cr }}</td>
            </tr>
        </tfoot>
    </table>
    
    <!-- Validation Status -->
    <div class="validation">
        {% if is_balanced %}
            <p class="success">✓ Trial Balance is balanced</p>
        {% else %}
            <p class="error">⚠ Trial Balance is NOT balanced</p>
        {% endif %}
    </div>
    
    <!-- Report Footer -->
    <div class="report-footer">
        <p>Generated: {{ generated_at }}</p>
        <p>Page <span class="page-number"></span></p>
    </div>
</body>
</html>
```

### CSS Styling Guidelines

```css
/* Key CSS Classes */

.report-header {
    text-align: center;
    margin-bottom: 30px;
    border-bottom: 2px solid #000;
}

.trial-balance-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 10pt;
}

.trial-balance-table th {
    background-color: #f0f0f0;
    font-weight: bold;
    text-align: right;
    padding: 8px;
    border: 1px solid #000;
}

.trial-balance-table th:first-child,
.trial-balance-table th:nth-child(2) {
    text-align: left;
}

.trial-balance-table td {
    padding: 5px 8px;
    border: 1px solid #ddd;
}

.amount {
    text-align: right;
    font-family: 'Courier New', monospace;
}

.group-header {
    background-color: #e0e0e0;
    font-weight: bold;
}

.subtotal {
    background-color: #f5f5f5;
    font-weight: bold;
    border-top: 2px solid #000;
}

.grand-total {
    background-color: #d0d0d0;
    font-weight: bold;
    border-top: 3px double #000;
    border-bottom: 3px double #000;
}

.indent-1 { padding-left: 20px; }
.indent-2 { padding-left: 40px; }
.indent-3 { padding-left: 60px; }

@media print {
    @page {
        size: A4 landscape;
        margin: 15mm;
    }
    
    .no-print { display: none; }
    
    table { page-break-inside: avoid; }
    tr { page-break-inside: avoid; }
}
```

### Sample Output Layout

```
═══════════════════════════════════════════════════════════════════════
                         TRIAL BALANCE
                    LankaCommerce Pvt Ltd
                     IRD No: 123456789V
                 For the period: 1 January 2026 to 31 December 2026
═══════════════════════════════════════════════════════════════════════

Code | Account Name         | Opening Dr | Opening Cr | Period Dr  | Period Cr  | Closing Dr | Closing Cr
-----|----------------------|------------|------------|------------|------------|------------|------------
     | ASSETS               |            |            |            |            |            |
1100 | Cash in Hand         |  50,000.00 |          - | 200,000.00 | 180,000.00 |  70,000.00 |          -
1200 | Bank Accounts        |1,000,000.00|          - |5,000,000.00|4,800,000.00|1,200,000.00|          -
     | Subtotal - Assets    |1,050,000.00|          - |5,200,000.00|4,980,000.00|1,270,000.00|          -
     |                      |            |            |            |            |            |
     | LIABILITIES          |            |            |            |            |            |
2100 | Accounts Payable     |          - | 500,000.00 | 300,000.00 | 350,000.00 |          - | 550,000.00
     | Subtotal - Liabilities|          - | 500,000.00 | 300,000.00 | 350,000.00 |          - | 550,000.00
     |                      |            |            |            |            |            |
═════|══════════════════════|════════════|════════════|════════════|════════════|════════════|════════════
     | TOTAL                |1,050,000.00| 500,000.00 |5,500,000.00|5,330,000.00|1,270,000.00| 550,000.00
═════|══════════════════════|════════════|════════════|════════════|════════════|════════════|════════════

✓ Trial Balance is balanced

Generated: 31 December 2026 at 11:59 PM                          Page 1 of 1
```

### Expected Outcome
- Professional HTML template for Trial Balance
- Proper column alignment and formatting
- Account grouping with subtotals
- Grand total row with validation
- Print-ready styling with page breaks
- Sri Lankan formatting standards
- Responsive design for different devices

### Verification Checklist
- [ ] Template file created
- [ ] Report header section added
- [ ] Period information displayed
- [ ] Table structure created
- [ ] All columns defined
- [ ] Account grouping implemented
- [ ] Hierarchy indentation applied
- [ ] Currency formatting correct
- [ ] Grand totals row added
- [ ] Validation section included
- [ ] Print-specific CSS added
- [ ] Responsive design implemented
- [ ] Sri Lankan localization applied

---

## Task 29: Create TB PDF Generator

### Overview
Create PDF generation capability for the Trial Balance report using WeasyPrint, converting the HTML template into a professional PDF document suitable for printing, archival, and IRD submission. Includes proper page layout, headers/footers, and Sri Lankan formatting compliance.

### Dependencies
- Task 28: Create TB HTML Template
- WeasyPrint library installed
- HTML template functional

### Instructions

1. **Install WeasyPrint dependencies**
   - Add weasyprint to requirements.txt
   - Install system dependencies (GTK, Pango, etc.)
   - For Windows: ensure GTK libraries available
   - For Linux: apt-get install libpango-1.0-0 libpangocairo-1.0-0

2. **Create PDF generation method**
   - Create generate_pdf method in TrialBalanceGenerator
   - Accept report_data dictionary parameter
   - Accept optional output_path for file saving
   - Return PDF as bytes if no output_path provided

3. **Render HTML template**
   - Use Django template rendering
   - Pass report_data as context
   - Render trial_balance.html template
   - Store rendered HTML string

4. **Configure PDF page settings**
   - Set page size to A4 landscape for better table fit
   - Alternative: A4 portrait for simpler reports
   - Set margins: 15mm top/bottom, 10mm left/right
   - Configure page header and footer

5. **Add page header**
   - Include report title "TRIAL BALANCE"
   - Include tenant business name
   - Include IRD number
   - Include date range
   - Apply to all pages except first

6. **Add page footer**
   - Include generation timestamp
   - Include page number (e.g., "Page 1 of 5")
   - Include "Generated by LankaCommerce ERP"
   - Center-align footer text

7. **Configure WeasyPrint CSS**
   - Create separate CSS file for PDF-specific styling
   - Located at `apps/accounting/static/css/reports_pdf.css`
   - Include all print-optimized styles
   - Handle table column widths
   - Configure page break behavior

8. **Generate PDF with WeasyPrint**
   - Import HTML from rendered template string
   - Apply CSS stylesheets
   - Set base URL for static files
   - Generate PDF bytes

9. **Handle PDF output options**
   - If output_path provided, save to file
   - If no output_path, return bytes for response
   - Return filename suggestion (e.g., "trial_balance_2026.pdf")

10. **Add PDF metadata**
    - Set PDF title: "Trial Balance - [Date Range]"
    - Set author: Tenant business name
    - Set subject: "Financial Report"
    - Set creator: "LankaCommerce ERP"
    - Set creation date

11. **Optimize PDF for printing**
    - Ensure proper color profiles (RGB for screen, CMYK for print)
    - Set appropriate font embedding
    - Compress images if any
    - Optimize file size

12. **Handle comparison mode PDFs**
    - For comparison reports, use landscape orientation
    - Adjust table columns to fit both periods
    - May require smaller font sizes
    - Consider splitting into multiple pages if needed

13. **Add error handling**
    - Catch WeasyPrint rendering errors
    - Handle missing fonts
    - Handle invalid CSS
    - Return meaningful error messages

### PDF Generation Method Structure

```python
# Pseudo-code structure

from weasyprint import HTML, CSS
from django.template.loader import render_to_string
from django.conf import settings
import os

class TrialBalanceGenerator:
    
    def generate_pdf(self, report_data, output_path=None):
        """
        Generate PDF from Trial Balance report data
        
        Args:
            report_data: Dictionary containing TB data
            output_path: Optional file path to save PDF
        
        Returns:
            PDF bytes if no output_path, else filename
        """
        # Step 1: Render HTML template
        html_string = render_to_string(
            'reports/trial_balance.html',
            context=report_data
        )
        
        # Step 2: Load CSS files
        css_path = os.path.join(
            settings.STATIC_ROOT,
            'css/reports_pdf.css'
        )
        css = CSS(filename=css_path)
        
        # Step 3: Create WeasyPrint HTML object
        html = HTML(string=html_string)
        
        # Step 4: Generate PDF
        if output_path:
            # Save to file
            html.write_pdf(
                output_path,
                stylesheets=[css]
            )
            return output_path
        else:
            # Return bytes
            pdf_bytes = html.write_pdf(
                stylesheets=[css]
            )
            return pdf_bytes
```

### WeasyPrint Page Configuration

```css
/* PDF-specific CSS */

@page {
    size: A4 landscape;
    margin: 15mm 10mm;
    
    @top-center {
        content: "TRIAL BALANCE - " string(report-date);
        font-size: 12pt;
        font-weight: bold;
    }
    
    @bottom-center {
        content: "Page " counter(page) " of " counter(pages);
        font-size: 9pt;
    }
    
    @bottom-left {
        content: "Generated: " string(generated-date);
        font-size: 8pt;
    }
}

/* Table page break rules */
table {
    page-break-inside: avoid;
}

.group-header {
    page-break-after: avoid;
}

.subtotal {
    page-break-before: avoid;
}

/* Font embedding */
body {
    font-family: 'DejaVu Sans', Arial, sans-serif;
}

.amount {
    font-family: 'DejaVu Sans Mono', 'Courier New', monospace;
}
```

### PDF Output Specifications

| Specification | Value | Notes |
|---------------|-------|-------|
| Page Size | A4 Landscape | 297mm × 210mm |
| Orientation | Landscape | Better for wide tables |
| Margins | 15mm (top/bottom), 10mm (sides) | Standard business margins |
| Font Size | 10pt body, 8pt footnotes | Readable yet compact |
| Color Mode | RGB | Screen display optimized |
| Resolution | 96 DPI | Standard screen resolution |
| File Format | PDF/A-1b | Archival compliance |

### Filename Generation

```python
# Filename generation logic

def generate_filename(start_date, end_date, tenant_name):
    """
    Generate descriptive filename for PDF
    """
    # Format: trial_balance_YYYY-MM-DD_to_YYYY-MM-DD_TenantName.pdf
    
    filename = (
        f"trial_balance_"
        f"{start_date.strftime('%Y-%m-%d')}_to_"
        f"{end_date.strftime('%Y-%m-%d')}_"
        f"{tenant_name.replace(' ', '_')}.pdf"
    )
    
    return filename

# Example output:
# trial_balance_2026-01-01_to_2026-12-31_LankaCommerce.pdf
```

### Error Handling Examples

```python
# Error handling for PDF generation

try:
    pdf_bytes = generate_pdf(report_data)
    
except FontNotFoundError as e:
    logger.error(f"Font missing: {e}")
    # Fallback to system fonts
    
except CSSError as e:
    logger.error(f"Invalid CSS: {e}")
    # Use default styling
    
except MemoryError:
    logger.error("Insufficient memory for PDF generation")
    # Split report into multiple PDFs
    
except Exception as e:
    logger.error(f"PDF generation failed: {e}")
    # Return error response
```

### WeasyPrint Installation

```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install -y \
    python3-pip \
    python3-cffi \
    python3-brotli \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libgdk-pixbuf2.0-0 \
    libffi-dev \
    shared-mime-info

pip install weasyprint

# Windows
# Download GTK installer from:
# https://github.com/tschoonj/GTK-for-Windows-Runtime-Environment-Installer
# Then:
pip install weasyprint

# macOS
brew install cairo pango gdk-pixbuf libffi
pip install weasyprint
```

### Expected Outcome
- PDF generation from HTML template
- Professional PDF output
- Proper page headers and footers
- Page numbers on all pages
- Print-optimized formatting
- Landscape orientation for wide tables
- IRD-compliant formatting
- Downloadable PDF files

### Verification Checklist
- [ ] WeasyPrint dependencies installed
- [ ] generate_pdf method created
- [ ] HTML template rendering works
- [ ] PDF page settings configured
- [ ] Page headers added
- [ ] Page footers added
- [ ] PDF-specific CSS created
- [ ] WeasyPrint generation successful
- [ ] PDF output options implemented
- [ ] PDF metadata added
- [ ] Print optimization applied
- [ ] Comparison mode PDFs handled
- [ ] Error handling implemented

---

## Task 30: Create TB API Endpoint

### Overview
Create RESTful API endpoint for Trial Balance report generation, providing access to report data in JSON format and PDF download capability. Supports query parameters for date ranges, comparison mode, and output format, enabling integration with frontend applications and external systems.

### Dependencies
- Task 29: Create TB PDF Generator
- Django REST Framework configured
- TrialBalanceGenerator class complete

### Instructions

1. **Create API view class**
   - Create TrialBalanceView in `apps/accounting/views/reports.py`
   - Use Django REST Framework's APIView or generic view
   - Apply tenant-aware permissions
   - Require authentication

2. **Define GET endpoint**
   - URL pattern: `/api/reports/trial-balance/`
   - HTTP method: GET
   - Returns Trial Balance data or PDF
   - Supports query parameters

3. **Add query parameters**
   - `start_date` (required): Period start date (YYYY-MM-DD)
   - `end_date` (required): Period end date (YYYY-MM-DD)
   - `format` (optional): Response format ('json' or 'pdf', default 'json')
   - `include_comparison` (optional): Enable comparison mode (boolean)
   - `comparison_start_date` (optional): Comparison period start
   - `comparison_end_date` (optional): Comparison period end
   - `show_zero_balances` (optional): Include zero balance accounts (boolean)

4. **Validate query parameters**
   - Ensure start_date and end_date provided
   - Validate date format (YYYY-MM-DD)
   - Ensure start_date before end_date
   - If comparison mode, validate comparison dates
   - Return 400 Bad Request for invalid parameters

5. **Instantiate TrialBalanceGenerator**
   - Get current tenant from request
   - Create generator instance with tenant
   - Pass validated parameters

6. **Generate report data**
   - Call generate_report method with dates
   - Include comparison if requested
   - Handle any generation errors
   - Return appropriate error responses

7. **Handle JSON response**
   - If format='json' or default
   - Return report data as JSON
   - Include all metadata, account groups, totals
   - HTTP 200 OK status
   - Content-Type: application/json

8. **Handle PDF response**
   - If format='pdf'
   - Call generate_pdf method
   - Return PDF as file download
   - HTTP 200 OK status
   - Content-Type: application/pdf
   - Content-Disposition: attachment with filename

9. **Add response caching**
   - Cache JSON responses for performance
   - Cache key based on tenant, dates, parameters
   - Cache duration: 1 hour (configurable)
   - Invalidate cache on new journal entries

10. **Add rate limiting**
    - Limit requests per user/tenant
    - Prevent excessive PDF generation
    - Return 429 Too Many Requests if exceeded

11. **Add error handling**
    - Catch validation errors (400 Bad Request)
    - Catch not found errors (404 Not Found)
    - Catch generation errors (500 Internal Server Error)
    - Return structured error responses

12. **Add API documentation**
    - Use DRF auto-documentation or OpenAPI
    - Document all query parameters
    - Provide example requests and responses
    - Include error response formats

13. **Register URL pattern**
    - Add URL pattern to `apps/accounting/urls.py`
    - Pattern: `path('reports/trial-balance/', TrialBalanceView.as_view())`
    - Include in API URL namespace

### API Endpoint Structure

```python
# API View Structure

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.http import HttpResponse
from datetime import datetime

class TrialBalanceView(APIView):
    """
    Trial Balance Report API Endpoint
    
    GET /api/reports/trial-balance/
    """
    
    permission_classes = [IsAuthenticated, IsTenantUser]
    
    def get(self, request):
        """
        Generate Trial Balance report
        
        Query Parameters:
            start_date (required): Period start (YYYY-MM-DD)
            end_date (required): Period end (YYYY-MM-DD)
            format (optional): 'json' or 'pdf' (default: 'json')
            include_comparison (optional): true/false
            comparison_start_date (optional): Comparison start
            comparison_end_date (optional): Comparison end
            show_zero_balances (optional): true/false
        """
        # Step 1: Extract parameters
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')
        format_type = request.query_params.get('format', 'json')
        include_comparison = request.query_params.get(
            'include_comparison', 'false'
        ).lower() == 'true'
        
        # Step 2: Validate parameters
        if not start_date or not end_date:
            return Response(
                {'error': 'start_date and end_date are required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            start_date = datetime.strptime(start_date, '%Y-%m-%d').date()
            end_date = datetime.strptime(end_date, '%Y-%m-%d').date()
        except ValueError:
            return Response(
                {'error': 'Invalid date format. Use YYYY-MM-DD'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Step 3: Generate report
        generator = TrialBalanceGenerator(tenant=request.tenant)
        
        try:
            report_data = generator.generate_report(
                start_date=start_date,
                end_date=end_date,
                include_comparison=include_comparison
            )
        except Exception as e:
            return Response(
                {'error': f'Report generation failed: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
        # Step 4: Return response based on format
        if format_type == 'pdf':
            # Generate PDF
            pdf_bytes = generator.generate_pdf(report_data)
            
            # Create response
            response = HttpResponse(
                pdf_bytes,
                content_type='application/pdf'
            )
            response['Content-Disposition'] = (
                f'attachment; filename="trial_balance_'
                f'{start_date}_{end_date}.pdf"'
            )
            return response
        
        else:
            # Return JSON
            return Response(report_data, status=status.HTTP_200_OK)
```

### URL Configuration

```python
# apps/accounting/urls.py

from django.urls import path
from .views.reports import TrialBalanceView

urlpatterns = [
    # ... other patterns
    
    path(
        'reports/trial-balance/',
        TrialBalanceView.as_view(),
        name='trial-balance-report'
    ),
]
```

### API Request Examples

#### Example 1: JSON Response
```http
GET /api/reports/trial-balance/?start_date=2026-01-01&end_date=2026-12-31
Authorization: Bearer <token>

Response: 200 OK
Content-Type: application/json

{
  "metadata": { ... },
  "report_period": { ... },
  "account_groups": [ ... ],
  "totals": { ... }
}
```

#### Example 2: PDF Download
```http
GET /api/reports/trial-balance/?start_date=2026-01-01&end_date=2026-12-31&format=pdf
Authorization: Bearer <token>

Response: 200 OK
Content-Type: application/pdf
Content-Disposition: attachment; filename="trial_balance_2026-01-01_2026-12-31.pdf"

[PDF Binary Data]
```

#### Example 3: Comparison Mode
```http
GET /api/reports/trial-balance/
    ?start_date=2026-01-01
    &end_date=2026-12-31
    &include_comparison=true
    &comparison_start_date=2025-01-01
    &comparison_end_date=2025-12-31
Authorization: Bearer <token>

Response: 200 OK
Content-Type: application/json

{
  "comparison": {
    "is_comparison_mode": true,
    "current_period": { ... },
    "comparison_period": { ... },
    "variance": { ... }
  }
}
```

### Error Response Format

```json
{
  "error": "start_date and end_date are required",
  "error_code": "MISSING_PARAMETERS",
  "status": 400
}

{
  "error": "Invalid date format. Use YYYY-MM-DD",
  "error_code": "INVALID_DATE_FORMAT",
  "status": 400
}

{
  "error": "Report generation failed: Database connection error",
  "error_code": "GENERATION_ERROR",
  "status": 500
}
```

### Query Parameter Validation

| Parameter | Type | Required | Validation | Default |
|-----------|------|----------|------------|---------|
| start_date | Date | Yes | YYYY-MM-DD format | - |
| end_date | Date | Yes | YYYY-MM-DD, after start_date | - |
| format | String | No | 'json' or 'pdf' | 'json' |
| include_comparison | Boolean | No | 'true' or 'false' | false |
| comparison_start_date | Date | If comparison | YYYY-MM-DD | - |
| comparison_end_date | Date | If comparison | YYYY-MM-DD | - |
| show_zero_balances | Boolean | No | 'true' or 'false' | false |

### Rate Limiting Configuration

```python
# Rate limiting settings

from rest_framework.throttling import UserRateThrottle

class TrialBalanceRateThrottle(UserRateThrottle):
    rate = '10/hour'  # 10 requests per hour per user

# Apply to view
class TrialBalanceView(APIView):
    throttle_classes = [TrialBalanceRateThrottle]
```

### Caching Strategy

```python
# Response caching

from django.core.cache import cache
import hashlib
import json

def get_cache_key(tenant_id, start_date, end_date, params):
    """
    Generate cache key for report
    """
    key_data = {
        'tenant_id': tenant_id,
        'start_date': str(start_date),
        'end_date': str(end_date),
        'params': params
    }
    key_string = json.dumps(key_data, sort_keys=True)
    key_hash = hashlib.md5(key_string.encode()).hexdigest()
    return f'trial_balance:{key_hash}'

# In view:
cache_key = get_cache_key(
    request.tenant.id,
    start_date,
    end_date,
    request.query_params
)

# Try cache first
cached_data = cache.get(cache_key)
if cached_data:
    return Response(cached_data)

# Generate and cache
report_data = generator.generate_report(...)
cache.set(cache_key, report_data, timeout=3600)  # 1 hour

return Response(report_data)
```

### Expected Outcome
- RESTful API endpoint for Trial Balance
- JSON and PDF response formats
- Query parameter support
- Comparison mode via API
- Response caching for performance
- Rate limiting for protection
- Proper error handling
- API documentation

### Verification Checklist
- [ ] API view class created
- [ ] GET endpoint defined
- [ ] Query parameters added
- [ ] Parameter validation implemented
- [ ] TrialBalanceGenerator instantiated
- [ ] Report data generation works
- [ ] JSON response handled
- [ ] PDF response handled
- [ ] Response caching added
- [ ] Rate limiting configured
- [ ] Error handling implemented
- [ ] API documentation added
- [ ] URL pattern registered

---

## Summary

This document completed the Trial Balance report output, comparison, and presentation layers:

### Completed Components
- ✅ Trial Balance data structure (Task 25)
- ✅ Comparison mode with prior periods (Task 26)
- ✅ Variance calculation (amount and percentage) (Task 27)
- ✅ HTML template for display (Task 28)
- ✅ PDF generator with WeasyPrint (Task 29)
- ✅ RESTful API endpoint (Task 30)

### Key Achievements
1. **Structured Output** - Comprehensive data format for all presentation layers
2. **Period Comparison** - Side-by-side analysis with variance calculations
3. **Professional Templates** - Print-ready HTML/PDF reports
4. **API Access** - RESTful endpoint for JSON and PDF formats
5. **Sri Lankan Compliance** - LKR formatting, IRD standards
6. **Performance Optimization** - Caching and rate limiting

### Next Steps
Proceed to [Group-C_Profit-Loss-Statement](../Group-C_Profit-Loss-Statement/) to implement the Profit & Loss (Income Statement) report with revenue/expense grouping, period comparison, and percentage analysis.

---

**Document Status:** ✅ Complete  
**Total Tasks:** 6  
**Total Lines:** ~980
