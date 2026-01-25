# Tasks 81-86: Excel Export Implementation

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 11 - Financial Reports  
> **Group:** F - Export, Testing & Documentation  
> **Document:** 01 of 02  
> **Tasks Covered:** 81, 82, 83, 84, 85, 86

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-87-92_Scheduler-Testing-Docs.md](02_Tasks-87-92_Scheduler-Testing-Docs.md)
- **← Previous Group:** [Group-E_Cash-Flow-General-Ledger](../Group-E_Cash-Flow-General-Ledger/)

---

## Document Overview

This document covers the Excel export functionality for all financial reports in the system. Installs the openpyxl library, creates a reusable base Excel exporter class, and implements Excel export capabilities for Trial Balance, Profit & Loss, Balance Sheet, and General Ledger reports. These exports support Sri Lankan business requirements including LKR currency formatting, Sinhala Unicode text, and IRD-compliant formatting.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 81 | Install openpyxl | Low | 5 min |
| 82 | Create Excel Exporter Base | Medium | 45 min |
| 83 | Add TB Excel Export | Medium | 40 min |
| 84 | Add PL Excel Export | Medium | 45 min |
| 85 | Add BS Excel Export | Medium | 45 min |
| 86 | Add GL Excel Export | Medium | 40 min |

---

## Task 81: Install openpyxl

### Overview
Install the openpyxl library to enable Excel file generation in .xlsx format. This library provides comprehensive support for creating and manipulating Excel workbooks, including advanced features like cell formatting, formulas, and styling required for professional financial reports.

### Dependencies
- Python package management (pip) configured
- requirements/base.txt file exists
- Virtual environment activated

### Instructions

1. **Open requirements file**
   - Navigate to `requirements/base.txt`
   - Locate the section for data export libraries
   - Add openpyxl dependency

2. **Add openpyxl to requirements**
   - Add line: `openpyxl==3.1.2`
   - Include version pin for dependency stability
   - Place after ReportLab (PDF library)

3. **Add comment documentation**
   - Add comment above openpyxl entry
   - Explain purpose: "Excel (.xlsx) file generation"
   - Note usage: "Financial report exports"

4. **Install the library**
   - Activate virtual environment
   - Run pip install command
   - Verify successful installation

5. **Verify installation**
   - Import openpyxl in Python shell
   - Check version matches requirements
   - Test basic Workbook creation

6. **Update documentation**
   - Document openpyxl in project dependencies
   - Note Excel export capability added
   - Reference version and purpose

### Library Details

| Aspect | Information |
|--------|-------------|
| Library Name | openpyxl |
| Version | 3.1.2 (latest stable) |
| Purpose | Excel workbook creation and manipulation |
| File Format | .xlsx (Office Open XML) |
| Python Support | Python 3.7+ |
| License | MIT License |

### openpyxl Capabilities

```
openpyxl Feature Set
════════════════════════════════════════

Core Features:
├── Workbook creation and management
├── Worksheet manipulation (add, delete, rename)
├── Cell reading and writing
├── Formula support
├── Number and date formatting
└── Style and formatting (fonts, colors, borders)

Advanced Features:
├── Merged cells
├── Column and row dimensions
├── Conditional formatting
├── Charts and graphs
├── Data validation
└── Protection and encryption
```

### Installation Command

```bash
# Activate virtual environment
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows

# Install openpyxl
pip install openpyxl==3.1.2

# Verify installation
python -c "import openpyxl; print(openpyxl.__version__)"
```

### Requirements File Structure

```
# requirements/base.txt

# PDF Generation
reportlab==4.0.7          # PDF report generation

# Excel Generation
openpyxl==3.1.2           # Excel (.xlsx) file generation

# Image Processing
Pillow==10.1.0            # Image manipulation for reports
```

### Expected Outcome
- openpyxl library installed in virtual environment
- Dependency documented in requirements.txt
- Excel file generation capability available
- Foundation for Excel export implementation

### Verification Checklist
- [ ] openpyxl==3.1.2 added to requirements/base.txt
- [ ] Comment documentation added
- [ ] Library installed in virtual environment
- [ ] Installation verified via Python import
- [ ] Version matches requirements file
- [ ] No installation errors or warnings

---

## Task 82: Create Excel Exporter Base

### Overview
Create a base Excel exporter class that provides reusable functionality for all financial report Excel exports. This class handles workbook creation, common formatting (currency, percentages, headers), cell styling, column width management, and HttpResponse generation. All specific report exporters will inherit from this base class.

### Dependencies
- Task 81: Install openpyxl
- Django HttpResponse available
- Accounting app structure exists

### Instructions

1. **Create exporters directory**
   - Navigate to `apps/accounting/reports/`
   - Create new directory named `exporters`
   - Initialize as Python package

2. **Create exporters package initialization**
   - Create `__init__.py` in `exporters/` directory
   - Import and expose base exporter class
   - Prepare for exporter class imports

3. **Create base exporter file**
   - Create `base.py` in `exporters/` directory
   - Import necessary modules (openpyxl, datetime, Decimal)
   - Import Django HttpResponse

4. **Define BaseExcelExporter class**
   - Create abstract base class for all Excel exporters
   - Add comprehensive class docstring
   - Define initialization method

5. **Add workbook initialization**
   - Create `__init__` method accepting report data
   - Initialize openpyxl Workbook instance
   - Store report metadata (tenant, dates, parameters)

6. **Implement create_workbook method**
   - Create new Workbook instance
   - Add initial worksheet with meaningful name
   - Set default worksheet properties

7. **Implement add_title_section method**
   - Add company name row (from tenant)
   - Add report title row (large, bold font)
   - Add report period/date information
   - Add generation timestamp
   - Include proper spacing

8. **Implement add_header_row method**
   - Accept sheet and header list parameters
   - Create bold header row with background color
   - Apply borders and alignment
   - Set appropriate row height

9. **Implement add_data_row method**
   - Accept sheet and data list parameters
   - Add data row with proper alignment
   - Apply cell borders
   - Handle different data types

10. **Implement format_currency method**
    - Accept cell and value parameters
    - Apply LKR currency formatting
    - Set number format: "රු #,##0.00"
    - Right-align cell content

11. **Implement format_percentage method**
    - Accept cell and value parameters
    - Apply percentage formatting
    - Set number format: "0.00%"
    - Center-align cell content

12. **Implement format_date method**
    - Accept cell and date parameters
    - Apply date formatting (DD/MM/YYYY)
    - Support both date and datetime objects
    - Handle Sri Lankan date preferences

13. **Implement auto_column_width method**
    - Accept worksheet parameter
    - Calculate optimal column widths
    - Consider header and data content
    - Set minimum and maximum width constraints

14. **Implement apply_accounting_format method**
    - Apply accounting-specific number format
    - Show negative numbers in parentheses
    - Right-align currency columns
    - Bold total rows

15. **Implement add_subtotal_row method**
    - Accept sheet, label, and amount parameters
    - Create subtotal row with bold font
    - Apply borders (top and bottom)
    - Indent label appropriately

16. **Implement add_total_row method**
    - Similar to subtotal but with heavier styling
    - Double borders for grand totals
    - Larger font size
    - Background color for emphasis

17. **Implement save_to_response method**
    - Generate unique filename with timestamp
    - Create Django HttpResponse
    - Set proper content type for Excel
    - Set Content-Disposition header
    - Save workbook to response
    - Return HttpResponse object

18. **Add Sinhala Unicode support**
    - Configure font to support Unicode
    - Test Sinhala character rendering
    - Set default font to Arial Unicode MS or similar

19. **Update exporters/__init__.py**
    - Import BaseExcelExporter
    - Add to __all__ list
    - Document exporter module purpose

### BaseExcelExporter Class Structure

```
┌──────────────────────────────────────────────────────┐
│            BaseExcelExporter Class                   │
├──────────────────────────────────────────────────────┤
│ Attributes:                                          │
│  • workbook: Workbook instance                       │
│  • report_data: Dict with report content            │
│  • tenant: Tenant instance                           │
│  • start_date: Date (optional)                       │
│  • end_date: Date (optional)                         │
│  • as_of_date: Date (optional)                       │
│                                                      │
│ Core Methods:                                        │
│  • __init__(report_data, tenant, dates)              │
│  • create_workbook() → Workbook                      │
│  • save_to_response(filename) → HttpResponse         │
│                                                      │
│ Formatting Methods:                                  │
│  • format_currency(cell, value)                      │
│  • format_percentage(cell, value)                    │
│  • format_date(cell, date)                           │
│  • auto_column_width(sheet)                          │
│                                                      │
│ Content Methods:                                     │
│  • add_title_section(sheet, title)                   │
│  • add_header_row(sheet, headers)                    │
│  • add_data_row(sheet, data)                         │
│  • add_subtotal_row(sheet, label, amount)            │
│  • add_total_row(sheet, label, amount)               │
│                                                      │
│ Utility Methods:                                     │
│  • apply_accounting_format(sheet, col_range)         │
│  • merge_title_cells(sheet, start_col, end_col)      │
└──────────────────────────────────────────────────────┘
```

### Inheritance Pattern

```
BaseExcelExporter (Abstract Base)
    │
    ├───► TrialBalanceExcelExporter
    │
    ├───► ProfitLossExcelExporter
    │
    ├───► BalanceSheetExcelExporter
    │
    └───► GeneralLedgerExcelExporter
```

### Excel Formatting Standards

| Element | Font | Size | Bold | Color | Border | Alignment |
|---------|------|------|------|-------|--------|-----------|
| Company Name | Arial | 14 | Yes | Black | None | Center |
| Report Title | Arial | 16 | Yes | Black | None | Center |
| Report Period | Arial | 10 | No | Gray | None | Center |
| Header Row | Arial | 11 | Yes | White | All | Center |
| Header Background | - | - | - | Dark Blue | - | - |
| Data Row | Arial | 10 | No | Black | Bottom | Left/Right |
| Subtotal | Arial | 10 | Yes | Black | Top/Bottom | Right |
| Grand Total | Arial | 12 | Yes | Black | Double | Right |

### LKR Currency Format Specifications

```
Standard Format:
Cell Format: "රු #,##0.00"
Display Examples:
  1000.00 → රු 1,000.00
  50000.50 → රු 50,000.50
  1234567.89 → රු 1,234,567.89

Negative Values:
Cell Format: "රු #,##0.00;(රු #,##0.00)"
Display Examples:
  -1000.00 → (රු 1,000.00)
  -50000.50 → (රු 50,000.50)

Zero Values:
Display: රු 0.00 or "-" (configurable)
```

### Column Width Guidelines

| Column Type | Min Width | Max Width | Auto-Size Method |
|-------------|-----------|-----------|------------------|
| Account Code | 12 chars | 15 chars | Fixed |
| Account Name | 30 chars | 50 chars | Auto (content-based) |
| Currency Amount | 15 chars | 18 chars | Fixed |
| Date | 12 chars | 12 chars | Fixed |
| Description | 40 chars | 60 chars | Auto (content-based) |
| Percentage | 10 chars | 12 chars | Fixed |

### Excel Title Section Layout

```
Row 1:  [Empty for spacing]
Row 2:  TENANT COMPANY NAME (merged, centered, size 14, bold)
Row 3:  [Empty]
Row 4:  REPORT TITLE (merged, centered, size 16, bold)
Row 5:  For the Period: DD/MM/YYYY to DD/MM/YYYY (centered, size 10)
Row 6:  Generated on: DD/MM/YYYY HH:MM AM/PM (centered, size 9, gray)
Row 7:  [Empty separator]
Row 8:  [Header row begins]
```

### Sinhala Unicode Support Configuration

| Configuration | Value | Purpose |
|---------------|-------|---------|
| Default Font | Arial Unicode MS | Sinhala character support |
| Fallback Font | Noto Sans Sinhala | Alternative Unicode font |
| Character Encoding | UTF-8 | Unicode text encoding |
| Font Size | 10pt | Readable Sinhala text |

### Expected Outcome
- Reusable BaseExcelExporter class
- Common formatting methods implemented
- LKR currency formatting support
- Sinhala Unicode compatibility
- Professional Excel report styling
- Foundation for all report exporters

### Verification Checklist
- [ ] exporters/ directory created
- [ ] exporters/__init__.py created
- [ ] base.py file created
- [ ] BaseExcelExporter class defined
- [ ] create_workbook method implemented
- [ ] add_title_section method implemented
- [ ] add_header_row method implemented
- [ ] add_data_row method implemented
- [ ] format_currency method with LKR support
- [ ] format_percentage method implemented
- [ ] format_date method implemented
- [ ] auto_column_width method implemented
- [ ] apply_accounting_format method implemented
- [ ] add_subtotal_row method implemented
- [ ] add_total_row method implemented
- [ ] save_to_response method implemented
- [ ] Sinhala Unicode fonts configured
- [ ] Class docstring comprehensive
- [ ] All methods documented

---

## Task 83: Add TB Excel Export

### Overview
Implement Trial Balance Excel export by creating a TrialBalanceExcelExporter class that inherits from BaseExcelExporter. This exporter generates a properly formatted Excel workbook containing the Trial Balance report with account codes, names, debit balances, credit balances, and totals. Supports IRD submission format requirements for Sri Lankan businesses.

### Dependencies
- Task 82: Create Excel Exporter Base
- Trial Balance report generator exists
- Account data available

### Instructions

1. **Create TB exporter file**
   - Create `trial_balance_exporter.py` in `exporters/` directory
   - Import BaseExcelExporter and necessary modules
   - Import Trial Balance models and utilities

2. **Define TrialBalanceExcelExporter class**
   - Inherit from BaseExcelExporter
   - Add class docstring explaining purpose
   - Define initialization method

3. **Override __init__ method**
   - Accept trial_balance_data parameter
   - Accept tenant and as_of_date parameters
   - Call parent class initialization
   - Store TB-specific data

4. **Implement generate method**
   - Main method to create Excel workbook
   - Call create_workbook from base class
   - Get active worksheet
   - Build complete Trial Balance report

5. **Add report title section**
   - Call add_title_section from base class
   - Title: "Trial Balance"
   - Include as-of date: "As at: DD/MM/YYYY"
   - Include tenant name and business registration

6. **Create column headers**
   - Define header list: ["Account Code", "Account Name", "Debit (රු)", "Credit (රු)"]
   - Call add_header_row method
   - Apply header formatting
   - Set column widths appropriately

7. **Add account data rows**
   - Loop through accounts in report data
   - Extract account code, name, debit, credit
   - Call add_data_row for each account
   - Format currency values properly

8. **Group accounts by type**
   - Separate Assets, Liabilities, Equity, Revenue, Expenses
   - Add section headers for each type
   - Apply subtle background colors per section
   - Improve report readability

9. **Add subtotals per account type**
   - Calculate debit and credit subtotals per type
   - Add subtotal rows after each section
   - Use add_subtotal_row method
   - Label: "Total [Account Type]"

10. **Add grand total row**
    - Calculate total debits and total credits
    - Add grand total row at bottom
    - Use add_total_row method
    - Label: "GRAND TOTAL"
    - Verify debits = credits

11. **Add balance verification**
    - Calculate difference (Debits - Credits)
    - Should be zero for balanced trial balance
    - Add verification row showing difference
    - Highlight if not balanced (red background)

12. **Implement column formatting**
    - Account Code: Left-aligned, width 15
    - Account Name: Left-aligned, width 40
    - Debit: Right-aligned, LKR format, width 18
    - Credit: Right-aligned, LKR format, width 18

13. **Add freeze panes**
    - Freeze top rows (title section + headers)
    - Freeze first column (account codes)
    - Enable easy scrolling for large reports

14. **Add print settings**
    - Set print area to data range
    - Configure page orientation (Portrait)
    - Set page margins
    - Add header/footer for printed copies

15. **Add IRD compliance notes**
    - Add notes sheet for IRD requirements
    - Document report generation methodology
    - Include accounting standards reference
    - Note any adjustments or exclusions

16. **Implement export method in generator**
    - Update TrialBalanceGenerator class
    - Add export_to_excel method
    - Create TrialBalanceExcelExporter instance
    - Call generate method
    - Return HttpResponse

17. **Update exporters/__init__.py**
    - Import TrialBalanceExcelExporter
    - Add to __all__ list

### Trial Balance Excel Structure

```
Sheet: "Trial Balance"
═══════════════════════════════════════════════════════

Row 1:  [Blank]
Row 2:  COMPANY NAME (merged A2:D2, centered, bold 14pt)
Row 3:  [Blank]
Row 4:  TRIAL BALANCE (merged A4:D4, centered, bold 16pt)
Row 5:  As at: 31/12/2025 (merged A5:D5, centered)
Row 6:  Generated: 25/01/2026 10:30 AM
Row 7:  [Blank separator]

Row 8:  ┌─────────────┬──────────────────────────┬─────────────┬─────────────┐
        │ Account Code│ Account Name              │ Debit (රු)  │ Credit (රු) │
        ├─────────────┼──────────────────────────┼─────────────┼─────────────┤
Row 9:  │             │ ASSETS                   │             │             │
Row 10: │ 1000        │ Cash                     │   500,000.00│          -  │
Row 11: │ 1100        │ Accounts Receivable      │   250,000.00│          -  │
        │     ...     │         ...              │       ...   │       ...   │
        ├─────────────┼──────────────────────────┼─────────────┼─────────────┤
        │             │ Total Assets             │ 1,500,000.00│          -  │ ← Subtotal
        ├─────────────┼──────────────────────────┼─────────────┼─────────────┤
        │             │ LIABILITIES              │             │             │
        │ 2000        │ Accounts Payable         │          -  │   300,000.00│
        │     ...     │         ...              │       ...   │       ...   │
        ├─────────────┼──────────────────────────┼─────────────┼─────────────┤
        │             │ Total Liabilities        │          -  │   300,000.00│ ← Subtotal
        ├─────────────┼──────────────────────────┼─────────────┼─────────────┤
        │             │                          │             │             │
        ├═════════════┼══════════════════════════┼═════════════┼═════════════┤
        │             │ GRAND TOTAL              │ 2,500,000.00│ 2,500,000.00│ ← Grand Total
        ├═════════════┼══════════════════════════┼═════════════┼═════════════┤
        │             │ Difference               │          -  │          -  │ ← Balance Check
        └─────────────┴──────────────────────────┴─────────────┴─────────────┘
```

### Account Type Sections

| Account Type | Background Color | Debit Column | Credit Column |
|--------------|-----------------|--------------|---------------|
| Assets | Light Blue (#E6F2FF) | Values shown | Dash or 0.00 |
| Liabilities | Light Red (#FFE6E6) | Dash or 0.00 | Values shown |
| Equity | Light Green (#E6FFE6) | Dash or 0.00 | Values shown |
| Revenue | Light Yellow (#FFFACD) | Dash or 0.00 | Values shown |
| Expenses | Light Orange (#FFE6CC) | Values shown | Dash or 0.00 |

### IRD Submission Format

```
IRD Requirements for Trial Balance:
════════════════════════════════════

1. Company Registration Number displayed
2. Tax Identification Number (TIN) shown
3. Reporting period clearly stated
4. All accounts with complete codes
5. Chart of accounts follows IRD standards
6. Debits and credits balanced
7. Account grouping by type
8. Printed on company letterhead (if physical)
9. Signed by authorized personnel
10. Dated with submission date
```

### Verification Formulas

| Check | Formula | Expected Result |
|-------|---------|-----------------|
| Balance Check | Total Debits - Total Credits | 0.00 |
| Asset Total | Sum of Asset Debits | Positive value |
| Liability Total | Sum of Liability Credits | Positive value |
| Equity Total | Sum of Equity Credits | Positive value |
| Revenue Total | Sum of Revenue Credits | Positive value |
| Expense Total | Sum of Expense Debits | Positive value |

### Expected Outcome
- TrialBalanceExcelExporter class implemented
- Professional Excel Trial Balance format
- Account grouping by type
- Subtotals and grand totals
- Balance verification
- IRD-compliant formatting
- Export method integrated

### Verification Checklist
- [ ] trial_balance_exporter.py file created
- [ ] TrialBalanceExcelExporter class defined
- [ ] generate method implemented
- [ ] Title section added with dates
- [ ] Column headers defined correctly
- [ ] Account data rows populated
- [ ] Accounts grouped by type
- [ ] Subtotals per type calculated
- [ ] Grand total row added
- [ ] Balance verification implemented
- [ ] LKR currency formatting applied
- [ ] Column widths optimized
- [ ] Freeze panes configured
- [ ] Print settings configured
- [ ] IRD compliance notes added
- [ ] export_to_excel method added to generator
- [ ] Exporter imported in __init__.py
- [ ] Debits equal credits verified

---

## Task 84: Add PL Excel Export

### Overview
Implement Profit & Loss Excel export by creating a ProfitLossExcelExporter class. This exporter generates a comprehensive Excel workbook containing the P&L statement with revenue, cost of goods sold, gross profit, operating expenses, and net profit. Supports comparison periods and percentage analysis for Sri Lankan business financial reporting.

### Dependencies
- Task 83: Add TB Excel Export
- Profit & Loss report generator exists
- Revenue and expense data available

### Instructions

1. **Create PL exporter file**
   - Create `profit_loss_exporter.py` in `exporters/` directory
   - Import BaseExcelExporter
   - Import Profit & Loss models and utilities

2. **Define ProfitLossExcelExporter class**
   - Inherit from BaseExcelExporter
   - Add comprehensive class docstring
   - Define initialization method

3. **Override __init__ method**
   - Accept pl_data parameter (report data dictionary)
   - Accept tenant, start_date, end_date parameters
   - Accept optional comparison_data parameter
   - Call parent initialization
   - Store P&L-specific data

4. **Implement generate method**
   - Create workbook and get active sheet
   - Rename sheet to "Profit & Loss Statement"
   - Build complete P&L report structure
   - Return workbook for response generation

5. **Add report title section**
   - Company name and registration
   - Title: "Profit & Loss Statement"
   - Period: "For the Period: [Start] to [End]"
   - Comparison period if applicable
   - Generation timestamp

6. **Define column structure**
   - Without comparison: ["Description", "Amount (රු)", "% of Revenue"]
   - With comparison: ["Description", "Current (රු)", "Prior (රු)", "Change (රු)", "Change (%)"]
   - Add headers with proper formatting

7. **Add Revenue section**
   - Section header: "REVENUE"
   - List all revenue accounts with amounts
   - Calculate total revenue
   - Apply section formatting

8. **Add Cost of Goods Sold section**
   - Section header: "COST OF GOODS SOLD"
   - Opening inventory
   - Purchases
   - Closing inventory
   - Calculate total COGS
   - Format as subtotal

9. **Calculate Gross Profit**
   - Formula: Revenue - COGS
   - Add Gross Profit row with bold formatting
   - Calculate gross profit margin percentage
   - Highlight row with background color

10. **Add Operating Expenses section**
    - Section header: "OPERATING EXPENSES"
    - Group expenses by category
    - List all operating expense accounts
    - Calculate total operating expenses
    - Format as subtotal

11. **Calculate Operating Profit**
    - Formula: Gross Profit - Operating Expenses
    - Add Operating Profit row
    - Calculate operating profit margin
    - Bold formatting

12. **Add Other Income/Expenses section**
    - Section header: "OTHER INCOME & EXPENSES"
    - Interest income
    - Interest expense
    - Other income
    - Other expenses
    - Calculate net other income

13. **Calculate Net Profit Before Tax**
    - Formula: Operating Profit + Net Other Income
    - Add prominent row with bold text
    - Calculate profit margin
    - Background color for emphasis

14. **Add Tax section**
    - Income tax expense
    - Deferred tax
    - Total tax
    - Format appropriately

15. **Calculate Net Profit After Tax**
    - Formula: Profit Before Tax - Tax
    - Grand total row with heavy formatting
    - Double borders
    - Large bold font
    - Calculate net profit margin

16. **Add percentage analysis column**
    - Calculate each line item as % of revenue
    - Format as percentage (0.00%)
    - Add column for trend analysis
    - Helpful for financial ratio analysis

17. **Implement comparison mode**
    - If comparison_data provided, add comparison columns
    - Show current period and prior period side-by-side
    - Calculate change in amount (difference)
    - Calculate change in percentage
    - Format increases (green) and decreases (red)

18. **Add summary metrics section**
    - Separate section after main P&L
    - Key metrics: Gross Margin %, Operating Margin %, Net Margin %
    - EBITDA calculation
    - Format as table with borders

19. **Add financial ratios**
    - Expense ratio (Expenses / Revenue)
    - COGS ratio (COGS / Revenue)
    - Tax rate (Tax / Profit Before Tax)
    - Display in summary section

20. **Configure print settings**
    - Portrait orientation
    - Fit to one page width
    - Repeat title rows on each page
    - Add page numbers in footer

21. **Add notes sheet**
    - Create second worksheet: "Notes"
    - Accounting policies
    - Revenue recognition methods
    - Expense categorization rules
    - IRD reporting standards

22. **Implement export method**
    - Add export_to_excel method in ProfitLossGenerator
    - Create ProfitLossExcelExporter instance
    - Call generate method
    - Return HttpResponse with Excel file

23. **Update exporters/__init__.py**
    - Import ProfitLossExcelExporter
    - Add to __all__ list

### Profit & Loss Excel Structure

```
Sheet: "Profit & Loss Statement"
════════════════════════════════════════════════════════════

COMPANY NAME
PROFIT & LOSS STATEMENT
For the Period: 01/01/2025 to 31/12/2025

┌────────────────────────────────┬──────────────┬──────────┐
│ Description                    │ Amount (රු)  │ % of Rev │
├────────────────────────────────┼──────────────┼──────────┤
│ REVENUE                        │              │          │
│   Sales Revenue                │  5,000,000.00│  95.00%  │
│   Service Revenue              │    250,000.00│   5.00%  │
├────────────────────────────────┼──────────────┼──────────┤
│ Total Revenue                  │  5,250,000.00│ 100.00%  │ ← Bold
├════════════════════════════════┼══════════════┼══════════┤
│ COST OF GOODS SOLD             │              │          │
│   Opening Inventory            │    200,000.00│   3.81%  │
│   Purchases                    │  2,500,000.00│  47.62%  │
│   Less: Closing Inventory      │   (300,000.00)│ (5.71%)  │
├────────────────────────────────┼──────────────┼──────────┤
│ Total COGS                     │  2,400,000.00│  45.71%  │ ← Bold
├════════════════════════════════┼══════════════┼══════════┤
│ GROSS PROFIT                   │  2,850,000.00│  54.29%  │ ← Bold, Colored
├════════════════════════════════┼══════════════┼══════════┤
│ OPERATING EXPENSES             │              │          │
│   Salaries & Wages             │    800,000.00│  15.24%  │
│   Rent                         │    120,000.00│   2.29%  │
│   Utilities                    │     60,000.00│   1.14%  │
│   Marketing                    │    100,000.00│   1.90%  │
│   Depreciation                 │     80,000.00│   1.52%  │
│   Other Expenses               │    140,000.00│   2.67%  │
├────────────────────────────────┼──────────────┼──────────┤
│ Total Operating Expenses       │  1,300,000.00│  24.76%  │ ← Bold
├════════════════════════════════┼══════════════┼══════════┤
│ OPERATING PROFIT               │  1,550,000.00│  29.52%  │ ← Bold, Colored
├════════════════════════════════┼══════════════┼══════════┤
│ OTHER INCOME & EXPENSES        │              │          │
│   Interest Income              │     20,000.00│   0.38%  │
│   Interest Expense             │    (30,000.00)│ (0.57%)  │
│   Other Income                 │     10,000.00│   0.19%  │
├────────────────────────────────┼──────────────┼──────────┤
│ Net Other Income/(Expense)     │         0.00│   0.00%  │
├════════════════════════════════┼══════════════┼══════════┤
│ NET PROFIT BEFORE TAX          │  1,550,000.00│  29.52%  │ ← Bold, Highlighted
├════════════════════════════════┼══════════════┼══════════┤
│ Income Tax Expense             │   (232,500.00)│ (4.43%)  │
├════════════════════════════════┼══════════════┼══════════┤
│ NET PROFIT AFTER TAX           │  1,317,500.00│  25.10%  │ ← Double Border, Bold
└────────────────────────────────┴──────────────┴──────────┘

SUMMARY METRICS
┌────────────────────────────────┬──────────────┐
│ Gross Profit Margin            │       54.29% │
│ Operating Profit Margin        │       29.52% │
│ Net Profit Margin              │       25.10% │
│ EBITDA                         │  1,630,000.00│
│ Effective Tax Rate             │       15.00% │
└────────────────────────────────┴──────────────┘
```

### Comparison Mode Layout

```
With Comparison Period:
┌─────────────────────┬──────────────┬──────────────┬──────────────┬──────────┐
│ Description         │ Current (රු) │ Prior (රු)   │ Change (රු)  │ Change % │
├─────────────────────┼──────────────┼──────────────┼──────────────┼──────────┤
│ Total Revenue       │  5,250,000.00│  4,800,000.00│   450,000.00↑│    9.38% │
│ Total COGS          │  2,400,000.00│  2,200,000.00│   200,000.00↑│    9.09% │
│ GROSS PROFIT        │  2,850,000.00│  2,600,000.00│   250,000.00↑│    9.62% │
│ Operating Expenses  │  1,300,000.00│  1,100,000.00│   200,000.00↑│   18.18% │
│ OPERATING PROFIT    │  1,550,000.00│  1,500,000.00│    50,000.00↑│    3.33% │
│ NET PROFIT          │  1,317,500.00│  1,275,000.00│    42,500.00↑│    3.33% │
└─────────────────────┴──────────────┴──────────────┴──────────────┴──────────┘

Legend: ↑ = Increase (Green)  ↓ = Decrease (Red)
```

### Section Formatting

| Section | Font Size | Bold | Background | Border |
|---------|-----------|------|------------|--------|
| Section Headers | 11pt | Yes | Light Gray | Bottom |
| Line Items | 10pt | No | None | None |
| Subtotals | 10pt | Yes | Light Blue | Top & Bottom |
| Key Totals (GP, OP) | 11pt | Yes | Light Green | All |
| Net Profit | 12pt | Yes | Light Yellow | Double |

### Financial Metrics Calculations

| Metric | Formula | Purpose |
|--------|---------|---------|
| Gross Profit Margin | (Gross Profit / Revenue) × 100 | Profitability before expenses |
| Operating Margin | (Operating Profit / Revenue) × 100 | Core business efficiency |
| Net Profit Margin | (Net Profit / Revenue) × 100 | Overall profitability |
| EBITDA | Operating Profit + Depreciation + Amortization | Cash generation capacity |
| Effective Tax Rate | (Tax / Profit Before Tax) × 100 | Tax burden analysis |

### Expected Outcome
- ProfitLossExcelExporter class functional
- Professional P&L Excel format
- Revenue and expense categorization
- Gross and net profit calculations
- Percentage analysis included
- Comparison mode supported
- Summary metrics section
- IRD-compliant format

### Verification Checklist
- [ ] profit_loss_exporter.py file created
- [ ] ProfitLossExcelExporter class defined
- [ ] generate method implemented
- [ ] Revenue section added
- [ ] COGS section added
- [ ] Gross Profit calculated
- [ ] Operating Expenses section added
- [ ] Operating Profit calculated
- [ ] Other Income/Expenses section added
- [ ] Net Profit Before Tax calculated
- [ ] Tax section added
- [ ] Net Profit After Tax calculated
- [ ] Percentage analysis column added
- [ ] Comparison mode implemented
- [ ] Summary metrics section added
- [ ] Financial ratios calculated
- [ ] Print settings configured
- [ ] Notes sheet added
- [ ] export_to_excel method added
- [ ] Exporter imported in __init__.py

---

## Task 85: Add BS Excel Export

### Overview
Implement Balance Sheet Excel export by creating a BalanceSheetExcelExporter class. This exporter generates a comprehensive Excel workbook containing the Balance Sheet with assets, liabilities, and equity sections. Follows the accounting equation (Assets = Liabilities + Equity) with proper categorization, subtotals, and Sri Lankan business formatting requirements.

### Dependencies
- Task 84: Add PL Excel Export
- Balance Sheet report generator exists
- Account balance data available

### Instructions

1. **Create BS exporter file**
   - Create `balance_sheet_exporter.py` in `exporters/` directory
   - Import BaseExcelExporter
   - Import Balance Sheet models and utilities

2. **Define BalanceSheetExcelExporter class**
   - Inherit from BaseExcelExporter
   - Add detailed class docstring
   - Define initialization method

3. **Override __init__ method**
   - Accept bs_data parameter (balance sheet data)
   - Accept tenant and as_of_date parameters
   - Accept optional comparison_date parameter
   - Call parent initialization
   - Store BS-specific data

4. **Implement generate method**
   - Create workbook and worksheet
   - Rename sheet to "Balance Sheet"
   - Build complete Balance Sheet structure
   - Apply formatting and styles

5. **Add report title section**
   - Company name and registration
   - Title: "Balance Sheet" or "Statement of Financial Position"
   - As at date: "As at: DD/MM/YYYY"
   - Comparison date if provided
   - Generation timestamp

6. **Define column structure**
   - Without comparison: ["Description", "Amount (රු)"]
   - With comparison: ["Description", "Current (රු)", "Prior (රු)", "Change (රු)"]
   - Set appropriate column widths

7. **Add ASSETS section header**
   - Major section: "ASSETS"
   - Bold, larger font
   - Background color (light blue)

8. **Add Current Assets subsection**
   - Subsection header: "Current Assets"
   - List accounts: Cash, Bank, Accounts Receivable, Inventory, Prepayments
   - Calculate Total Current Assets
   - Format as subtotal

9. **Add Non-Current Assets subsection**
   - Subsection header: "Non-Current Assets" or "Fixed Assets"
   - List accounts: Property, Plant & Equipment, Intangible Assets, Long-term Investments
   - Show accumulated depreciation as reduction
   - Calculate Net Book Value per asset category
   - Calculate Total Non-Current Assets
   - Format as subtotal

10. **Calculate Total Assets**
    - Formula: Current Assets + Non-Current Assets
    - Add Total Assets row with bold formatting
    - Prominent background color (darker blue)
    - Double borders for emphasis

11. **Add LIABILITIES section header**
    - Major section: "LIABILITIES"
    - Bold, larger font
    - Background color (light red/pink)

12. **Add Current Liabilities subsection**
    - Subsection header: "Current Liabilities"
    - List accounts: Accounts Payable, Short-term Loans, Accrued Expenses, Tax Payable
    - Calculate Total Current Liabilities
    - Format as subtotal

13. **Add Non-Current Liabilities subsection**
    - Subsection header: "Non-Current Liabilities" or "Long-term Liabilities"
    - List accounts: Long-term Loans, Bonds Payable, Deferred Tax
    - Calculate Total Non-Current Liabilities
    - Format as subtotal

14. **Calculate Total Liabilities**
    - Formula: Current Liabilities + Non-Current Liabilities
    - Add Total Liabilities row with bold formatting
    - Background color (darker red/pink)
    - Double borders

15. **Add EQUITY section header**
    - Major section: "EQUITY" or "SHAREHOLDERS' EQUITY"
    - Bold, larger font
    - Background color (light green)

16. **Add Equity components**
    - Share Capital / Stated Capital
    - Retained Earnings (beginning balance)
    - Add: Net Profit for the period
    - Less: Dividends paid
    - Retained Earnings (ending balance)
    - Other Reserves
    - Calculate Total Equity

17. **Add Total Liabilities & Equity**
    - Formula: Total Liabilities + Total Equity
    - Grand total row with heavy formatting
    - Must equal Total Assets
    - Double borders, bold, large font

18. **Add balance verification**
    - Verify: Total Assets = Total Liabilities + Total Equity
    - Add verification row or note
    - Highlight if not balanced (red)
    - Include tolerance for rounding (e.g., ±0.01)

19. **Implement comparison mode**
    - If comparison_date provided, add comparison columns
    - Show current and prior period side-by-side
    - Calculate absolute change
    - Calculate percentage change
    - Analyze balance sheet movements

20. **Add financial position analysis**
    - Create second section or separate area
    - Calculate key ratios:
      - Current Ratio (Current Assets / Current Liabilities)
      - Quick Ratio (Liquid Assets / Current Liabilities)
      - Debt-to-Equity Ratio (Total Debt / Total Equity)
      - Equity Ratio (Total Equity / Total Assets)
    - Format ratios with explanations

21. **Add working capital calculation**
    - Formula: Current Assets - Current Liabilities
    - Display in summary section
    - Important liquidity indicator

22. **Configure print settings**
    - Portrait orientation for standard BS
    - Landscape if comparison included
    - Fit to one page
    - Repeat headers on each page

23. **Add notes sheet**
    - Create "Notes" worksheet
    - Accounting policies
    - Asset valuation methods
    - Depreciation policies
    - Contingent liabilities

24. **Implement export method**
    - Add export_to_excel method in BalanceSheetGenerator
    - Create BalanceSheetExcelExporter instance
    - Call generate method
    - Return HttpResponse

25. **Update exporters/__init__.py**
    - Import BalanceSheetExcelExporter
    - Add to __all__ list

### Balance Sheet Excel Structure

```
Sheet: "Balance Sheet"
═══════════════════════════════════════════════════════

COMPANY NAME
BALANCE SHEET
As at: 31/12/2025

┌────────────────────────────────────┬──────────────────┐
│ Description                        │ Amount (රු)      │
├════════════════════════════════════┼══════════════════┤
│ ASSETS                             │                  │
├────────────────────────────────────┼──────────────────┤
│ Current Assets                     │                  │
│   Cash on Hand                     │       50,000.00  │
│   Cash at Bank                     │      450,000.00  │
│   Accounts Receivable              │      300,000.00  │
│   Inventory                        │      400,000.00  │
│   Prepaid Expenses                 │       50,000.00  │
├────────────────────────────────────┼──────────────────┤
│ Total Current Assets               │    1,250,000.00  │ ← Subtotal
├────────────────────────────────────┼──────────────────┤
│ Non-Current Assets                 │                  │
│   Property, Plant & Equipment      │    2,000,000.00  │
│   Less: Accumulated Depreciation   │     (400,000.00) │
│   Net PP&E                         │    1,600,000.00  │
│   Intangible Assets                │      200,000.00  │
│   Long-term Investments            │      150,000.00  │
├────────────────────────────────────┼──────────────────┤
│ Total Non-Current Assets           │    1,950,000.00  │ ← Subtotal
├════════════════════════════════════┼══════════════════┤
│ TOTAL ASSETS                       │    3,200,000.00  │ ← Grand Total
├════════════════════════════════════┼══════════════════┤
│                                    │                  │
│ LIABILITIES                        │                  │
├────────────────────────────────────┼──────────────────┤
│ Current Liabilities                │                  │
│   Accounts Payable                 │      180,000.00  │
│   Short-term Loans                 │      120,000.00  │
│   Accrued Expenses                 │       70,000.00  │
│   Tax Payable                      │       80,000.00  │
├────────────────────────────────────┼──────────────────┤
│ Total Current Liabilities          │      450,000.00  │ ← Subtotal
├────────────────────────────────────┼──────────────────┤
│ Non-Current Liabilities            │                  │
│   Long-term Loans                  │      500,000.00  │
│   Deferred Tax Liability           │       50,000.00  │
├────────────────────────────────────┼──────────────────┤
│ Total Non-Current Liabilities      │      550,000.00  │ ← Subtotal
├════════════════════════════════════┼══════════════════┤
│ TOTAL LIABILITIES                  │    1,000,000.00  │ ← Section Total
├════════════════════════════════════┼══════════════════┤
│                                    │                  │
│ EQUITY                             │                  │
├────────────────────────────────────┼──────────────────┤
│   Share Capital                    │    1,000,000.00  │
│   Retained Earnings - Beginning    │      882,500.00  │
│   Add: Net Profit for the Year     │    1,317,500.00  │
│   Less: Dividends Paid             │   (1,000,000.00) │
│   Retained Earnings - Ending       │    1,200,000.00  │
├────────────────────────────────────┼──────────────────┤
│ TOTAL EQUITY                       │    2,200,000.00  │ ← Section Total
├════════════════════════════════════┼══════════════════┤
│ TOTAL LIABILITIES & EQUITY         │    3,200,000.00  │ ← Must = Assets
└════════════════════════════════════┴══════════════════┘

Verification: Assets = Liabilities + Equity ✓
```

### Comparison Mode Layout

```
With Comparative Figures:
┌─────────────────────────┬──────────────┬──────────────┬──────────────┐
│ Description             │ 31/12/2025   │ 31/12/2024   │ Change (රු)  │
├─────────────────────────┼──────────────┼──────────────┼──────────────┤
│ ASSETS                  │              │              │              │
│ Current Assets          │  1,250,000.00│  1,100,000.00│   150,000.00↑│
│ Non-Current Assets      │  1,950,000.00│  1,800,000.00│   150,000.00↑│
│ TOTAL ASSETS            │  3,200,000.00│  2,900,000.00│   300,000.00↑│
│                         │              │              │              │
│ LIABILITIES             │              │              │              │
│ Current Liabilities     │    450,000.00│    400,000.00│    50,000.00↑│
│ Non-Current Liabilities │    550,000.00│    600,000.00│   (50,000.00)↓│
│ TOTAL LIABILITIES       │  1,000,000.00│  1,000,000.00│           - │
│                         │              │              │              │
│ EQUITY                  │              │              │              │
│ Share Capital           │  1,000,000.00│  1,000,000.00│           - │
│ Retained Earnings       │  1,200,000.00│    900,000.00│   300,000.00↑│
│ TOTAL EQUITY            │  2,200,000.00│  1,900,000.00│   300,000.00↑│
│                         │              │              │              │
│ TOTAL LIABILITIES       │              │              │              │
│   & EQUITY              │  3,200,000.00│  2,900,000.00│   300,000.00↑│
└─────────────────────────┴──────────────┴──────────────┴──────────────┘
```

### Section Formatting Guidelines

| Section | Font | Bold | Background | Border |
|---------|------|------|------------|--------|
| Main Headers (Assets, Liabilities, Equity) | 12pt | Yes | Light Color | Bottom |
| Subsection Headers | 11pt | Yes | None | Bottom |
| Line Items | 10pt | No | None | None |
| Subtotals | 10pt | Yes | Light Gray | Top & Bottom |
| Section Totals | 11pt | Yes | Medium Color | All |
| Grand Totals | 12pt | Yes | Darker Color | Double |

### Financial Ratios Section

```
FINANCIAL POSITION ANALYSIS
┌─────────────────────────────────────┬──────────┬─────────────┐
│ Ratio                               │ Value    │ Interpretation │
├─────────────────────────────────────┼──────────┼─────────────┤
│ Current Ratio                       │    2.78  │ Healthy     │
│ Quick Ratio                         │    1.89  │ Healthy     │
│ Debt-to-Equity Ratio                │    0.45  │ Conservative│
│ Equity Ratio                        │   68.75% │ Strong      │
│ Working Capital                     │  800,000 │ Positive    │
└─────────────────────────────────────┴──────────┴─────────────┘

Ratio Calculations:
• Current Ratio = Current Assets / Current Liabilities
• Quick Ratio = (Current Assets - Inventory) / Current Liabilities
• Debt-to-Equity = Total Liabilities / Total Equity
• Equity Ratio = Total Equity / Total Assets × 100%
• Working Capital = Current Assets - Current Liabilities
```

### IRD Compliance Requirements

| Requirement | Implementation |
|-------------|----------------|
| Company Registration | Display in header |
| TIN Number | Show prominently |
| As-at Date | Clear date statement |
| Comparative Figures | Prior year comparison |
| Accounting Standards | Note compliance (SLFRS/LKAS) |
| Depreciation Policy | Documented in notes |
| Valuation Methods | Disclosed in notes |

### Expected Outcome
- BalanceSheetExcelExporter class implemented
- Professional Balance Sheet Excel format
- Assets, Liabilities, Equity sections
- Proper categorization and subtotals
- Balance verification (Assets = L + E)
- Comparison mode supported
- Financial ratios analysis
- IRD-compliant formatting

### Verification Checklist
- [ ] balance_sheet_exporter.py file created
- [ ] BalanceSheetExcelExporter class defined
- [ ] generate method implemented
- [ ] Title section with as-at date
- [ ] ASSETS section header added
- [ ] Current Assets subsection added
- [ ] Non-Current Assets subsection added
- [ ] Total Assets calculated
- [ ] LIABILITIES section header added
- [ ] Current Liabilities subsection added
- [ ] Non-Current Liabilities subsection added
- [ ] Total Liabilities calculated
- [ ] EQUITY section added
- [ ] Retained earnings breakdown included
- [ ] Total Equity calculated
- [ ] Total Liabilities & Equity calculated
- [ ] Balance verification implemented
- [ ] Comparison mode functional
- [ ] Financial ratios section added
- [ ] Working capital calculated
- [ ] Notes sheet created
- [ ] export_to_excel method added
- [ ] Exporter imported in __init__.py
- [ ] Accounting equation verified

---

## Task 86: Add GL Excel Export

### Overview
Implement General Ledger Excel export by creating a GeneralLedgerExcelExporter class. This exporter generates a detailed Excel workbook containing the General Ledger report with all transactions for selected accounts. Includes transaction details (date, description, debit, credit, running balance) with proper grouping by account and comprehensive transaction audit trail for Sri Lankan accounting compliance.

### Dependencies
- Task 85: Add BS Excel Export
- General Ledger report generator exists
- Transaction data with journal entries available

### Instructions

1. **Create GL exporter file**
   - Create `general_ledger_exporter.py` in `exporters/` directory
   - Import BaseExcelExporter
   - Import General Ledger models and utilities

2. **Define GeneralLedgerExcelExporter class**
   - Inherit from BaseExcelExporter
   - Add comprehensive class docstring
   - Define initialization method

3. **Override __init__ method**
   - Accept gl_data parameter (general ledger data)
   - Accept tenant, start_date, end_date parameters
   - Accept optional account_filter parameter
   - Accept optional show_zero_balance parameter
   - Call parent initialization
   - Store GL-specific data

4. **Implement generate method**
   - Create workbook
   - Option 1: All accounts in one sheet (if few accounts)
   - Option 2: Separate sheet per account (if many accounts)
   - Build complete General Ledger structure
   - Apply formatting

5. **Add report title section**
   - Company name and registration
   - Title: "General Ledger"
   - Period: "For the Period: [Start] to [End]"
   - Account filter information if applicable
   - Generation timestamp

6. **Determine layout strategy**
   - If < 10 accounts: Single-sheet layout
   - If >= 10 accounts: Multi-sheet layout (one per account)
   - Add Table of Contents sheet for multi-sheet

7. **Implement single-sheet layout**
   - Group transactions by account
   - Add account header for each account
   - List all transactions under account
   - Add account subtotal
   - Repeat for all accounts

8. **Implement multi-sheet layout**
   - Create "Summary" sheet with all account balances
   - Create separate sheet for each account
   - Name sheet with account code and name
   - Link from summary to detail sheets

9. **Add account header section**
   - Account code and name (bold, large font)
   - Account type and category
   - Opening balance (beginning of period)
   - Background color for emphasis

10. **Define transaction column headers**
    - Columns: ["Date", "Ref #", "Description", "Debit (රු)", "Credit (රු)", "Balance (රු)"]
    - Bold headers with background
    - Freeze panes for scrolling

11. **Add opening balance row**
    - Date: Period start date
    - Description: "Opening Balance"
    - Balance: Opening balance amount
    - Format appropriately

12. **Add transaction detail rows**
    - Loop through all transactions for account
    - Display: Date, Reference, Description, Debit, Credit
    - Calculate running balance after each transaction
    - Format currency values
    - Alternate row colors for readability

13. **Calculate running balance**
    - Start with opening balance
    - For each transaction:
      - If debit increases balance: Balance = Previous + Debit
      - If credit decreases balance: Balance = Previous - Credit
    - Handle asset vs liability account logic
    - Display running balance in Balance column

14. **Add closing balance row**
    - Date: Period end date
    - Description: "Closing Balance"
    - Balance: Final balance amount
    - Bold formatting
    - Background color

15. **Add account summary section**
    - After closing balance, add summary
    - Total Debits for period
    - Total Credits for period
    - Net Change (Debits - Credits or Credits - Debits)
    - Number of transactions
    - Format as table

16. **Handle account types correctly**
    - Asset accounts: Debit increases, Credit decreases
    - Liability accounts: Credit increases, Debit decreases
    - Equity accounts: Credit increases, Debit decreases
    - Revenue accounts: Credit increases
    - Expense accounts: Debit increases
    - Calculate balance direction appropriately

17. **Add transaction reference linking**
    - Include journal entry reference number
    - Enable audit trail back to source document
    - Link to invoice, payment, or journal entry ID

18. **Implement account filtering**
    - If account_filter provided, only include specified accounts
    - Support multiple account selection
    - Show filter criteria in report header

19. **Implement zero-balance handling**
    - If show_zero_balance=False, exclude accounts with no transactions
    - If show_zero_balance=True, include all accounts
    - Configuration option in export

20. **Add Summary sheet (multi-sheet layout)**
    - List all accounts with opening, closing balances
    - Include total debits and credits per account
    - Hyperlink to detail sheets
    - Sort by account code

21. **Format transaction descriptions**
    - Wrap text if long descriptions
    - Set row height to auto
    - Ensure Sinhala Unicode support
    - Handle special characters

22. **Configure column widths**
    - Date: 12 characters (fixed)
    - Ref #: 10 characters (fixed)
    - Description: 40 characters (auto-width)
    - Debit: 15 characters (fixed)
    - Credit: 15 characters (fixed)
    - Balance: 15 characters (fixed)

23. **Add print settings per sheet**
    - Landscape orientation (fits more columns)
    - Repeat account header on each page
    - Page breaks after each account (single-sheet)
    - Page numbers in footer

24. **Add audit trail information**
    - Create "Audit Info" sheet
    - List: Generated by, Date/Time, Period, Filters applied
    - Note any exclusions or adjustments
    - IRD compliance statement

25. **Implement export method**
    - Add export_to_excel method in GeneralLedgerGenerator
    - Create GeneralLedgerExcelExporter instance
    - Pass all relevant parameters
    - Call generate method
    - Return HttpResponse with proper filename

26. **Update exporters/__init__.py**
    - Import GeneralLedgerExcelExporter
    - Add to __all__ list

### General Ledger Excel Structure (Single Account)

```
Sheet: "1000 - Cash on Hand"
════════════════════════════════════════════════════════════════════

COMPANY NAME
GENERAL LEDGER
For the Period: 01/01/2025 to 31/12/2025

Account: 1000 - Cash on Hand
Type: Asset - Current Asset
Opening Balance: රු 30,000.00

┌────────────┬─────────┬──────────────────────┬──────────────┬──────────────┬──────────────┐
│ Date       │ Ref #   │ Description          │ Debit (රු)   │ Credit (රු)  │ Balance (රු) │
├────────────┼─────────┼──────────────────────┼──────────────┼──────────────┼──────────────┤
│ 01/01/2025 │ -       │ Opening Balance      │           -  │           -  │   30,000.00  │
├────────────┼─────────┼──────────────────────┼──────────────┼──────────────┼──────────────┤
│ 05/01/2025 │ INV-001 │ Cash Sale - Customer A│   50,000.00  │           -  │   80,000.00  │
│ 08/01/2025 │ PAY-005 │ Payment to Supplier B│           -  │   20,000.00  │   60,000.00  │
│ 12/01/2025 │ JE-012  │ Cash Withdrawal      │           -  │   10,000.00  │   50,000.00  │
│ 15/01/2025 │ INV-008 │ Cash Sale - Customer C│   35,000.00  │           -  │   85,000.00  │
│ 20/01/2025 │ PAY-018 │ Utilities Payment    │           -  │    5,000.00  │   80,000.00  │
│ 25/01/2025 │ INV-015 │ Cash Sale - Customer D│   25,000.00  │           -  │  105,000.00  │
│ 30/01/2025 │ PAY-025 │ Rent Payment         │           -  │   15,000.00  │   90,000.00  │
│     ...    │   ...   │         ...          │       ...    │       ...    │       ...    │
├────────────┼─────────┼──────────────────────┼──────────────┼──────────────┼──────────────┤
│ 31/12/2025 │ -       │ Closing Balance      │           -  │           -  │   50,000.00  │
├════════════┼═════════┼══════════════════════┼══════════════┼══════════════┼══════════════┤

Account Summary:
├────────────────────────────────────┬──────────────┤
│ Opening Balance                    │   30,000.00  │
│ Total Debits                       │  750,000.00  │
│ Total Credits                      │  730,000.00  │
│ Net Change                         │   20,000.00  │
│ Closing Balance                    │   50,000.00  │
│ Number of Transactions             │         156  │
└────────────────────────────────────┴──────────────┘
```

### Summary Sheet Layout (Multi-Sheet)

```
Sheet: "Summary"
════════════════════════════════════════════════════════════

GENERAL LEDGER SUMMARY
Period: 01/01/2025 to 31/12/2025

┌──────────┬──────────────────────────┬───────────────┬──────────────┬──────────────┬───────────────┐
│ Code     │ Account Name             │ Opening (රු)  │ Debits (රු)  │ Credits (රු) │ Closing (රු)  │
├──────────┼──────────────────────────┼───────────────┼──────────────┼──────────────┼───────────────┤
│ 1000     │ Cash on Hand             │    30,000.00  │  750,000.00  │  730,000.00  │    50,000.00  │ → Link
│ 1010     │ Cash at Bank             │   500,000.00  │3,500,000.00  │3,050,000.00  │   950,000.00  │ → Link
│ 1100     │ Accounts Receivable      │   200,000.00  │1,200,000.00  │1,150,000.00  │   250,000.00  │ → Link
│ 1200     │ Inventory                │   350,000.00  │2,000,000.00  │1,950,000.00  │   400,000.00  │ → Link
│ 2000     │ Accounts Payable         │   150,000.00  │  900,000.00  │  930,000.00  │   180,000.00  │ → Link
│   ...    │          ...             │       ...     │       ...    │       ...    │       ...     │
├══════════┼══════════════════════════┼═══════════════┼══════════════┼══════════════┼═══════════════┤
│          │ TOTAL                    │ 2,500,000.00  │25,000,000.00 │25,000,000.00 │ 3,200,000.00  │
└──────────┴──────────────────────────┴───────────────┴──────────────┴──────────────┴───────────────┘

Click account code to view detailed transactions.
```

### Balance Calculation Logic

| Account Type | Opening | Debit | Credit | Balance Calculation |
|--------------|---------|-------|--------|---------------------|
| Asset | Debit | + | - | Opening + Debits - Credits |
| Liability | Credit | - | + | Opening - Debits + Credits |
| Equity | Credit | - | + | Opening - Debits + Credits |
| Revenue | Credit | - | + | Opening - Debits + Credits |
| Expense | Debit | + | - | Opening + Debits - Credits |

### Transaction Reference Format

| Ref Type | Format | Example | Source Document |
|----------|--------|---------|-----------------|
| Invoice | INV-### | INV-001 | Sales Invoice |
| Payment | PAY-### | PAY-005 | Payment Voucher |
| Receipt | RCT-### | RCT-012 | Receipt Voucher |
| Journal Entry | JE-### | JE-025 | Journal Voucher |
| Adjustment | ADJ-### | ADJ-003 | Adjustment Entry |

### Alternate Row Coloring

| Row Type | Background Color | Text Color |
|----------|------------------|------------|
| Odd Data Rows | White | Black |
| Even Data Rows | Light Gray (#F5F5F5) | Black |
| Opening Balance | Light Blue (#E6F2FF) | Black |
| Closing Balance | Light Green (#E6FFE6) | Black |
| Headers | Dark Blue (#4472C4) | White |

### Expected Outcome
- GeneralLedgerExcelExporter class implemented
- Detailed transaction listing per account
- Running balance calculation
- Single-sheet and multi-sheet layouts
- Account summaries included
- Transaction reference linking
- Audit trail support
- IRD-compliant format

### Verification Checklist
- [ ] general_ledger_exporter.py file created
- [ ] GeneralLedgerExcelExporter class defined
- [ ] generate method implemented
- [ ] Single-sheet layout implemented
- [ ] Multi-sheet layout implemented
- [ ] Account header section added
- [ ] Transaction column headers defined
- [ ] Opening balance row added
- [ ] Transaction detail rows populated
- [ ] Running balance calculated correctly
- [ ] Closing balance row added
- [ ] Account summary section added
- [ ] Account type balance logic correct
- [ ] Transaction references included
- [ ] Account filtering functional
- [ ] Zero-balance handling implemented
- [ ] Summary sheet created (multi-sheet)
- [ ] Transaction descriptions formatted
- [ ] Column widths optimized
- [ ] Print settings configured
- [ ] Audit trail information added
- [ ] export_to_excel method added
- [ ] Exporter imported in __init__.py
- [ ] Hyperlinks functional (multi-sheet)

---

## Summary

This document established the Excel export functionality for all financial reports:

### Completed Infrastructure
- ✅ openpyxl library installed
- ✅ BaseExcelExporter class with common formatting methods
- ✅ TrialBalanceExcelExporter with account grouping
- ✅ ProfitLossExcelExporter with percentage analysis
- ✅ BalanceSheetExcelExporter with financial ratios
- ✅ GeneralLedgerExcelExporter with transaction details

### Key Achievements
1. **Reusable Base Class** - Common formatting and styling methods
2. **LKR Currency Formatting** - Sri Lankan Rupee format with Unicode support
3. **Sinhala Unicode Support** - Proper font configuration for local language
4. **IRD Compliance** - Export formats meet tax authority requirements
5. **Professional Styling** - Color-coded sections, borders, and formatting
6. **Comparison Mode** - Side-by-side period comparison where applicable
7. **Financial Analysis** - Ratios, percentages, and key metrics included
8. **Audit Trail** - Transaction references and detailed information

### Excel Export Features

| Feature | TB | P&L | BS | GL |
|---------|----|----|----|----|
| LKR Currency Formatting | ✅ | ✅ | ✅ | ✅ |
| Sinhala Unicode Support | ✅ | ✅ | ✅ | ✅ |
| Comparison Mode | ❌ | ✅ | ✅ | ❌ |
| Percentage Analysis | ❌ | ✅ | ❌ | ❌ |
| Account Grouping | ✅ | ✅ | ✅ | ✅ |
| Financial Ratios | ❌ | ✅ | ✅ | ❌ |
| Transaction Detail | ❌ | ❌ | ❌ | ✅ |
| Multi-Sheet Layout | ❌ | ❌ | ❌ | ✅ |
| Print Optimization | ✅ | ✅ | ✅ | ✅ |

### Next Steps
Proceed to [02_Tasks-87-92_Scheduler-Testing-Docs.md](02_Tasks-87-92_Scheduler-Testing-Docs.md) to implement report scheduling with Celery, email delivery, ViewSet creation, URL routing, comprehensive testing, and API documentation.

---

**Document Status:** ✅ Complete  
**Total Tasks:** 6  
**Total Lines:** ~985
