# Tasks 17-26: BaseGenerator and Product/Customer Reports

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 14 - Analytics & Reports  
> **Group:** B - Sales Reports  
> **Document:** 01 of 02  
> **Tasks Covered:** 17, 18, 19, 20, 21, 22, 23, 24, 25, 26

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-27-34_Period-Channel-Cashier.md](02_Tasks-27-34_Period-Channel-Cashier.md)

---

## Document Overview

This document covers the creation of the BaseReportGenerator abstract class and the first two sales report implementations: SalesByProductReport and SalesByCustomerReport. These components establish the foundation for report generation with standardized filtering, data aggregation, and export capabilities.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 17 | Create BaseReportGenerator class | High | 45 min |
| 18 | Add abstract generate method | Medium | 20 min |
| 19 | Add export methods | Medium | 30 min |
| 20 | Create SalesByProductReport | Medium | 35 min |
| 21 | Add product filter | Low | 15 min |
| 22 | Add date range filter | Low | 15 min |
| 23 | Add quantity/revenue columns | Medium | 25 min |
| 24 | Create SalesByCustomerReport | Medium | 35 min |
| 25 | Add customer ranking | Medium | 25 min |
| 26 | Add order count column | Low | 10 min |

---

## Task 17: Create BaseReportGenerator Class

### Overview
Create the BaseReportGenerator abstract class that serves as the foundation for all report generators. This class defines the common interface, shared functionality, and abstract methods that concrete report implementations must override.

### Dependencies
- Task 16: Run ReportInstance migrations
- ReportDefinition model exists
- ReportInstance model exists

### Instructions

1. **Create generators directory structure**
   - Create `generators/` directory in `apps/analytics/`
   - Create `__init__.py` in generators directory
   - Create `base.py` for BaseReportGenerator class

2. **Import required modules**
   - Import ABC and abstractmethod from abc module
   - Import Django models and query utilities
   - Import pandas for data manipulation (optional)
   - Import timezone utilities

3. **Define BaseReportGenerator class**
   - Inherit from ABC (Abstract Base Class)
   - Add comprehensive class docstring
   - Define class as abstract

4. **Add initialization method**
   - Accept report_definition parameter
   - Accept filter_parameters parameter
   - Accept user parameter (optional)
   - Store as instance variables

5. **Add tenant property**
   - Extract tenant from report_definition
   - Used for filtering queryset
   - Returns Tenant object

6. **Add get_base_queryset method**
   - Abstract method to be overridden
   - Returns base QuerySet for report
   - Automatically filters by tenant

7. **Add validate_filters method**
   - Validates filter parameters against definition
   - Uses report_definition.validate_filter_parameters()
   - Returns tuple (is_valid, errors)
   - Raises ValidationError if invalid

8. **Add apply_date_filter method**
   - Common utility for date range filtering
   - Accepts queryset and date field name
   - Extracts date_range from filters
   - Returns filtered queryset

9. **Add get_report_title method**
   - Generates human-readable report title
   - Includes filter summary
   - Used in exports and UI

10. **Add get_filter_value method**
    - Utility to safely extract filter value
    - Handles missing filters with defaults
    - Type conversion support

### BaseReportGenerator Class Structure

```python
from abc import ABC, abstractmethod
from typing import Dict, Any, List, Tuple, Optional
from django.db.models import QuerySet
from django.utils import timezone
from apps.analytics.models import ReportDefinition

class BaseReportGenerator(ABC):
    """
    Abstract base class for all report generators.
    
    Provides common functionality for data retrieval, filtering,
    validation, and export operations. Concrete report classes
    must implement the generate() method.
    
    Attributes:
        report_definition: ReportDefinition instance
        filter_parameters: Applied filter values
        user: User who requested the report (optional)
    """
    
    def __init__(
        self,
        report_definition: ReportDefinition,
        filter_parameters: Dict[str, Any],
        user: Optional[Any] = None
    ):
        """
        Initialize report generator.
        
        Args:
            report_definition: Report definition template
            filter_parameters: Applied filter values
            user: User requesting the report (optional)
        """
        self.report_definition = report_definition
        self.filter_parameters = filter_parameters
        self.user = user
    
    @property
    def tenant(self):
        """Get tenant from report definition."""
        return self.report_definition.tenant
    
    @abstractmethod
    def get_base_queryset(self) -> QuerySet:
        """
        Get base queryset for report data.
        
        Must be implemented by concrete classes.
        Should include tenant filtering.
        
        Returns:
            QuerySet: Base queryset for report
        """
        pass
    
    @abstractmethod
    def generate(self) -> Dict[str, Any]:
        """
        Generate report data.
        
        Must be implemented by concrete classes.
        
        Returns:
            dict: Report data structure
        """
        pass
```

### Inheritance Hierarchy

```
BaseReportGenerator (Abstract)
        │
        ├─── SalesByProductReport
        ├─── SalesByCustomerReport
        ├─── SalesByPeriodReport
        ├─── SalesByChannelReport
        ├─── SalesByCashierReport
        ├─── InventoryStockLevelsReport
        ├─── PurchaseOrdersReport
        └─── [Future reports...]
```

### Common Utility Methods

```
┌─────────────────────────────────────────────────┐
│      BaseReportGenerator Utilities              │
├─────────────────────────────────────────────────┤
│                                                 │
│  Validation:                                    │
│  ├── validate_filters()                         │
│  └── raise ValidationError if invalid           │
│                                                 │
│  Filtering:                                     │
│  ├── apply_date_filter(queryset, field)         │
│  ├── apply_choice_filter(queryset, field)       │
│  └── apply_multi_select_filter(queryset, field) │
│                                                 │
│  Data Access:                                   │
│  ├── get_base_queryset() [abstract]             │
│  ├── get_filtered_queryset()                    │
│  └── get_aggregated_data()                      │
│                                                 │
│  Export:                                        │
│  ├── to_pdf(data)                               │
│  ├── to_excel(data)                             │
│  └── to_csv(data)                               │
│                                                 │
│  Utilities:                                     │
│  ├── get_report_title()                         │
│  ├── get_filter_value(key, default)             │
│  └── format_currency(amount)                    │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Validation Method Implementation

```python
def validate_filters(self) -> Tuple[bool, Dict[str, str]]:
    """
    Validate filter parameters against report definition.
    
    Returns:
        tuple: (is_valid, errors_dict)
        
    Raises:
        ValidationError: If validation fails
    """
    is_valid, errors = self.report_definition.validate_filter_parameters(
        self.filter_parameters
    )
    
    if not is_valid:
        from django.core.exceptions import ValidationError
        error_message = "; ".join([f"{k}: {v}" for k, v in errors.items()])
        raise ValidationError(f"Invalid filters: {error_message}")
    
    return is_valid, errors
```

### Date Filter Implementation

```python
def apply_date_filter(
    self,
    queryset: QuerySet,
    date_field: str = 'created_at'
) -> QuerySet:
    """
    Apply date range filter to queryset.
    
    Args:
        queryset: Base queryset
        date_field: Field name for date filtering
        
    Returns:
        QuerySet: Filtered queryset
    """
    date_range = self.filter_parameters.get('date_range')
    
    if not date_range:
        return queryset
    
    if isinstance(date_range, dict):
        start_date = date_range.get('start_date')
        end_date = date_range.get('end_date')
        
        if start_date:
            queryset = queryset.filter(**{f'{date_field}__gte': start_date})
        
        if end_date:
            # Add 1 day to include end date
            from datetime import timedelta
            end_date_inclusive = end_date + timedelta(days=1)
            queryset = queryset.filter(**{f'{date_field}__lt': end_date_inclusive})
    
    return queryset
```

### Expected Outcome
- Well-structured abstract base class
- Common utility methods
- Clear interface for concrete implementations
- Validation and filtering support

### Verification Checklist
- [ ] generators/base.py created
- [ ] BaseReportGenerator class defined
- [ ] Inherits from ABC
- [ ] __init__ method implemented
- [ ] tenant property added
- [ ] get_base_queryset abstract method declared
- [ ] generate abstract method declared
- [ ] validate_filters method implemented
- [ ] apply_date_filter method implemented
- [ ] get_report_title method implemented
- [ ] get_filter_value method implemented
- [ ] Class docstring comprehensive

---

## Task 18: Add Abstract Generate Method

### Overview
Define the abstract generate() method interface that all concrete report generators must implement. Document the expected return structure and establish patterns for data organization and aggregation.

### Dependencies
- Task 17: Create BaseReportGenerator class

### Instructions

1. **Open base.py file**
   - Navigate to `apps/analytics/generators/base.py`
   - Locate BaseReportGenerator class

2. **Define generate method signature**
   - Mark as abstractmethod
   - Returns Dict[str, Any]
   - Add comprehensive docstring

3. **Document return structure**
   - Define standard fields (report_type, period, data, totals)
   - Specify data format (list of dictionaries)
   - Document totals structure
   - Include metadata fields

4. **Add get_aggregated_data helper**
   - Template method for data aggregation
   - Calls get_base_queryset()
   - Applies filters
   - Returns aggregated data

5. **Add calculate_totals helper**
   - Calculates summary totals
   - Accepts data list
   - Returns totals dictionary
   - Handles currency formatting

6. **Add get_metadata method**
   - Returns report metadata
   - Includes generation time
   - Filter summary
   - Row count

7. **Document data structure standards**
   - Column naming conventions
   - Data type expectations
   - Null handling
   - Sorting requirements

### Generate Method Interface

```python
@abstractmethod
def generate(self) -> Dict[str, Any]:
    """
    Generate report data with aggregations and calculations.
    
    This method must be implemented by all concrete report classes.
    It should:
    1. Validate filters
    2. Retrieve and filter data
    3. Perform aggregations/calculations
    4. Format results
    5. Calculate totals
    6. Return standardized structure
    
    Returns:
        dict: Report data with structure:
            {
                'report_type': str,        # Report identifier
                'report_title': str,       # Human-readable title
                'generated_at': datetime,  # Generation timestamp
                'period': str,             # Filter summary
                'filters': dict,           # Applied filters
                'data': list[dict],        # Report rows
                'totals': dict,            # Summary totals
                'row_count': int,          # Number of rows
                'metadata': dict,          # Additional info
            }
            
    Raises:
        ValidationError: If filters are invalid
        DatabaseError: If query fails
    """
    pass
```

### Standard Return Structure

```python
{
    # Report identification
    "report_type": "SALES_BY_PRODUCT",
    "report_title": "Sales by Product - January 2026",
    "generated_at": "2026-01-25T14:30:00Z",
    
    # Filter information
    "period": "2026-01-01 to 2026-01-31",
    "filters": {
        "date_range": {
            "start_date": "2026-01-01",
            "end_date": "2026-01-31"
        },
        "category": [1, 2, 3]
    },
    
    # Report data (main content)
    "data": [
        {
            "id": 1,
            "name": "Product A",
            "quantity": 100,
            "revenue": 50000.00,
            # ... other columns
        },
        # ... more rows
    ],
    
    # Summary totals
    "totals": {
        "quantity": 2500,
        "revenue": 1250000.00,
        "row_count": 45
    },
    
    # Metadata
    "metadata": {
        "row_count": 45,
        "generation_time_seconds": 2.5,
        "filter_summary": "January 2026, 3 categories selected",
        "chart_data": {...}  # Optional visualization data
    }
}
```

### get_aggregated_data Helper Pattern

```python
def get_aggregated_data(self) -> List[Dict[str, Any]]:
    """
    Get aggregated report data with filters applied.
    
    Returns:
        list: Aggregated data rows
    """
    # Validate filters first
    self.validate_filters()
    
    # Get base queryset
    queryset = self.get_base_queryset()
    
    # Apply common filters
    queryset = self.apply_date_filter(queryset)
    queryset = self.apply_custom_filters(queryset)
    
    # Perform aggregations
    data = self.perform_aggregations(queryset)
    
    # Format and return
    return self.format_data(data)
```

### calculate_totals Helper Pattern

```python
def calculate_totals(self, data: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Calculate summary totals from data rows.
    
    Args:
        data: List of data rows
        
    Returns:
        dict: Summary totals
    """
    if not data:
        return {
            'quantity': 0,
            'revenue': 0.0,
            'row_count': 0
        }
    
    return {
        'quantity': sum(row.get('quantity', 0) for row in data),
        'revenue': sum(row.get('revenue', 0.0) for row in data),
        'row_count': len(data)
    }
```

### Data Structure Standards

```
Column Naming Conventions:
═══════════════════════════

Identifiers:
- *_id: Integer IDs
- *_code: String codes
- *_name: Display names

Quantities:
- quantity: Numeric counts
- *_count: Aggregate counts
- items_per_*: Averages

Monetary Values:
- revenue: Total sales amount
- cost: Total cost amount
- profit: Calculated profit
- *_amount: Generic monetary values
- avg_*: Average calculations

Percentages:
- percentage: 0-100 scale
- *_rate: Ratio values
- growth: Period-over-period change

Dates:
- *_date: Date only
- *_at: DateTime with time
- period: Date range string
```

### Expected Outcome
- Clear abstract method interface
- Standardized return structure
- Helper methods for common operations
- Documentation of data standards

### Verification Checklist
- [ ] generate method declared as abstract
- [ ] Method signature documented
- [ ] Return structure documented
- [ ] get_aggregated_data helper added
- [ ] calculate_totals helper added
- [ ] get_metadata method added
- [ ] Data structure standards documented
- [ ] Example return structure provided

---

## Task 19: Add Export Methods

### Overview
Implement export methods in BaseReportGenerator for converting report data to PDF, Excel, and CSV formats. These methods provide standardized export functionality that all report generators can use.

### Dependencies
- Task 18: Add abstract generate method
- WeasyPrint library for PDF generation
- openpyxl library for Excel generation

### Instructions

1. **Create exporters directory**
   - Create `exporters/` directory in `apps/analytics/`
   - Create `__init__.py` in exporters directory
   - Create `pdf.py`, `excel.py`, `csv.py` files

2. **Implement PDF exporter**
   - Create PDFExporter class
   - Accepts report data and template
   - Uses WeasyPrint for rendering
   - Returns bytes

3. **Implement Excel exporter**
   - Create ExcelExporter class
   - Uses openpyxl for workbook creation
   - Multiple sheets support
   - Formatting and formulas
   - Returns bytes

4. **Implement CSV exporter**
   - Create CSVExporter class
   - Simple comma-separated format
   - Handles nested data structures
   - Returns string

5. **Add to_pdf method to BaseReportGenerator**
   - Generates report data if not provided
   - Calls PDFExporter
   - Returns PDF bytes
   - Handles errors

6. **Add to_excel method to BaseReportGenerator**
   - Generates report data if not provided
   - Calls ExcelExporter
   - Returns Excel bytes
   - Handles errors

7. **Add to_csv method to BaseReportGenerator**
   - Generates report data if not provided
   - Calls CSVExporter
   - Returns CSV string
   - Handles errors

8. **Add get_export_filename method**
   - Generates appropriate filename
   - Includes report type and date
   - Includes extension
   - Handles special characters

### Export Method Signatures

```python
def to_pdf(
    self,
    data: Optional[Dict[str, Any]] = None,
    template: Optional[str] = None
) -> bytes:
    """
    Export report data to PDF format.
    
    Args:
        data: Report data (generates if None)
        template: Custom template path (optional)
        
    Returns:
        bytes: PDF file content
        
    Raises:
        ExportError: If PDF generation fails
    """
    if data is None:
        data = self.generate()
    
    from apps.analytics.exporters.pdf import PDFExporter
    exporter = PDFExporter(self.report_definition, data)
    return exporter.export(template=template)


def to_excel(
    self,
    data: Optional[Dict[str, Any]] = None,
    include_charts: bool = True
) -> bytes:
    """
    Export report data to Excel format.
    
    Args:
        data: Report data (generates if None)
        include_charts: Whether to include charts
        
    Returns:
        bytes: Excel file content
        
    Raises:
        ExportError: If Excel generation fails
    """
    if data is None:
        data = self.generate()
    
    from apps.analytics.exporters.excel import ExcelExporter
    exporter = ExcelExporter(self.report_definition, data)
    return exporter.export(include_charts=include_charts)


def to_csv(
    self,
    data: Optional[Dict[str, Any]] = None,
    delimiter: str = ','
) -> str:
    """
    Export report data to CSV format.
    
    Args:
        data: Report data (generates if None)
        delimiter: Field delimiter (default: comma)
        
    Returns:
        str: CSV file content
        
    Raises:
        ExportError: If CSV generation fails
    """
    if data is None:
        data = self.generate()
    
    from apps.analytics.exporters.csv import CSVExporter
    exporter = ExcelExporter(self.report_definition, data)
    return exporter.export(delimiter=delimiter)
```

### PDF Export Structure

```
PDF Layout:
═══════════

┌────────────────────────────────────────────┐
│ REPORT HEADER                              │
│                                            │
│ Report Title: Daily Sales Summary          │
│ Period: January 1-31, 2026                 │
│ Generated: 2026-01-25 14:30:00             │
│ Generated By: John Doe                     │
├────────────────────────────────────────────┤
│                                            │
│ FILTERS APPLIED                            │
│ • Date Range: 2026-01-01 to 2026-01-31    │
│ • Location: Colombo Branch                 │
│ • Category: Electronics, Groceries         │
│                                            │
├────────────────────────────────────────────┤
│                                            │
│ REPORT DATA TABLE                          │
│                                            │
│ ┌──────┬─────────┬─────────┬───────────┐  │
│ │ Rank │ Product │ Qty     │ Revenue   │  │
│ ├──────┼─────────┼─────────┼───────────┤  │
│ │ 1    │ Prod A  │ 250     │ 125,000   │  │
│ │ 2    │ Prod B  │ 200     │ 100,000   │  │
│ │ ...  │ ...     │ ...     │ ...       │  │
│ └──────┴─────────┴─────────┴───────────┘  │
│                                            │
├────────────────────────────────────────────┤
│                                            │
│ SUMMARY TOTALS                             │
│ Total Quantity: 2,500                      │
│ Total Revenue: LKR 1,250,000.00            │
│ Number of Products: 45                     │
│                                            │
├────────────────────────────────────────────┤
│ FOOTER                                     │
│ Page 1 of 3                                │
│ Generated by LankaCommerce ERP             │
└────────────────────────────────────────────┘
```

### Excel Export Structure

```
Workbook Structure:
═══════════════════

Sheet 1: Summary
┌─────────────────┬──────────────┐
│ Report Title    │ Daily Sales  │
│ Period          │ Jan 2026     │
│ Generated       │ 2026-01-25   │
└─────────────────┴──────────────┘

┌─────────────────┬──────────────┐
│ Total Revenue   │ 1,250,000.00 │
│ Total Quantity  │ 2,500        │
│ Product Count   │ 45           │
└─────────────────┴──────────────┘

Sheet 2: Data
┌──────┬────────────┬──────────┬─────────────┐
│ Rank │ Product    │ Quantity │ Revenue     │
├──────┼────────────┼──────────┼─────────────┤
│ 1    │ Product A  │ 250      │ 125,000.00  │
│ 2    │ Product B  │ 200      │ 100,000.00  │
│ ...  │ ...        │ ...      │ ...         │
│ TOTAL│            │ 2,500    │ 1,250,000   │ ← Formula
└──────┴────────────┴──────────┴─────────────┘

Sheet 3: Charts (optional)
[Embedded charts and visualizations]

Features:
- Header row formatting (bold, background color)
- Number formatting (currency, thousands separator)
- Auto-column width
- Freeze panes (header row)
- Formulas in total row
- Conditional formatting (optional)
```

### CSV Export Structure

```csv
Report Title,Daily Sales Summary
Period,2026-01-01 to 2026-01-31
Generated,2026-01-25 14:30:00
Generated By,John Doe

Filters Applied
Date Range,2026-01-01 to 2026-01-31
Location,Colombo Branch
Category,"Electronics, Groceries"

Report Data
Rank,Product Name,SKU,Category,Quantity,Revenue,Percentage
1,Product A,PROD-A,Electronics,250,125000.00,15.5
2,Product B,PROD-B,Groceries,200,100000.00,12.4
3,Product C,PROD-C,Electronics,180,90000.00,11.2

Totals
Total Quantity,2500
Total Revenue,1250000.00
Product Count,45
```

### Filename Generation

```python
def get_export_filename(self, extension: str) -> str:
    """
    Generate appropriate filename for export.
    
    Args:
        extension: File extension (.pdf, .xlsx, .csv)
        
    Returns:
        str: Generated filename
    """
    from django.utils.text import slugify
    from datetime import datetime
    
    # Base name from report code
    base_name = slugify(self.report_definition.code)
    
    # Add date range if present
    date_range = self.filter_parameters.get('date_range')
    if date_range:
        start = date_range.get('start_date', '')
        end = date_range.get('end_date', '')
        if start and end:
            base_name += f"_{start}_to_{end}"
        elif start:
            base_name += f"_{start}"
    
    # Add timestamp
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    
    return f"{base_name}_{timestamp}{extension}"

# Examples:
# sales_daily_summary_20260101_to_20260131_20260125_143000.pdf
# inventory_stock_levels_20260125_143000.xlsx
# customer_analysis_20260125_143000.csv
```

### Expected Outcome
- PDF export capability
- Excel export with formatting
- CSV export for data interchange
- Standardized export interface

### Verification Checklist
- [ ] exporters directory created
- [ ] PDFExporter class implemented
- [ ] ExcelExporter class implemented
- [ ] CSVExporter class implemented
- [ ] to_pdf method added to BaseReportGenerator
- [ ] to_excel method added to BaseReportGenerator
- [ ] to_csv method added to BaseReportGenerator
- [ ] get_export_filename method added
- [ ] All methods have error handling
- [ ] Export methods tested

---

## Task 20: Create SalesByProductReport

### Overview
Create the SalesByProductReport class that generates sales analysis grouped by product. This report shows which products are selling best, their quantities, revenue, and market share within the filtered period.

### Dependencies
- Task 19: Add export methods
- SalesInvoice model exists
- SalesInvoiceLine model exists
- Product model exists

### Instructions

1. **Create sales directory**
   - Create `sales/` directory in `apps/analytics/generators/`
   - Create `__init__.py` in sales directory

2. **Create by_product.py file**
   - Create file at `apps/analytics/generators/sales/by_product.py`
   - Import BaseReportGenerator
   - Import required models

3. **Define SalesByProductReport class**
   - Inherit from BaseReportGenerator
   - Add class docstring
   - Define report type constant

4. **Implement get_base_queryset method**
   - Returns SalesInvoiceLine queryset
   - Filters by tenant
   - Includes related product data
   - Excludes voided/cancelled invoices

5. **Implement generate method**
   - Validates filters
   - Aggregates sales by product
   - Calculates quantity, revenue, percentage
   - Sorts by revenue (descending)
   - Returns standardized structure

6. **Add product aggregation logic**
   - Group by product
   - Sum quantities
   - Sum line totals (revenue)
   - Calculate average price
   - Include product details (name, SKU, category)

7. **Add ranking**
   - Order by revenue descending
   - Add rank field (1, 2, 3...)
   - Handle ties appropriately

8. **Add percentage calculation**
   - Calculate each product's % of total revenue
   - Round to 2 decimal places
   - Include in data rows

9. **Register report definition**
   - Create fixture or migration
   - Define in ReportDefinition table
   - Set appropriate filters and permissions

### SalesByProductReport Class Structure

```python
from django.db.models import Sum, Count, Avg, F, Q
from apps.analytics.generators.base import BaseReportGenerator
from apps.sales.models import SalesInvoice, SalesInvoiceLine
from apps.inventory.models import Product
from typing import Dict, Any, List

class SalesByProductReport(BaseReportGenerator):
    """
    Sales analysis grouped by product.
    
    Shows product sales performance with quantities, revenue,
    and market share analysis for the filtered period.
    
    Filters:
        - date_range (required): Date range for analysis
        - category (optional): Product category filter
        - product (optional): Specific product filter
        - location (optional): Warehouse/location filter
        
    Metrics:
        - Quantity sold
        - Total revenue
        - Average price
        - Percentage of total sales
        - Rank by revenue
    """
    
    REPORT_TYPE = "SALES_BY_PRODUCT"
    
    def get_base_queryset(self):
        """Get base queryset for sales invoice lines."""
        return SalesInvoiceLine.objects.filter(
            invoice__tenant=self.tenant,
            invoice__status='COMPLETED'
        ).select_related(
            'invoice',
            'product',
            'product__category'
        )
    
    def generate(self) -> Dict[str, Any]:
        """Generate sales by product report."""
        # Validate filters
        self.validate_filters()
        
        # Get filtered queryset
        queryset = self.get_base_queryset()
        queryset = self.apply_date_filter(queryset, 'invoice__date')
        queryset = self.apply_product_filters(queryset)
        
        # Aggregate by product
        product_sales = queryset.values(
            'product_id',
            'product__name',
            'product__sku',
            'product__category__name'
        ).annotate(
            quantity=Sum('quantity'),
            revenue=Sum(F('quantity') * F('unit_price')),
            avg_price=Avg('unit_price')
        ).order_by('-revenue')
        
        # Convert to list and add ranking
        data = list(product_sales)
        
        # Calculate total for percentages
        total_revenue = sum(row['revenue'] for row in data)
        
        # Add rank and percentage
        for idx, row in enumerate(data, start=1):
            row['rank'] = idx
            row['percentage'] = (
                (row['revenue'] / total_revenue * 100)
                if total_revenue > 0 else 0
            )
            # Rename fields for clarity
            row['product_name'] = row.pop('product__name')
            row['sku'] = row.pop('product__sku')
            row['category'] = row.pop('product__category__name')
        
        # Calculate totals
        totals = self.calculate_totals(data)
        
        return {
            'report_type': self.REPORT_TYPE,
            'report_title': self.get_report_title(),
            'generated_at': timezone.now(),
            'period': self.get_period_string(),
            'filters': self.filter_parameters,
            'data': data,
            'totals': totals,
            'row_count': len(data),
            'metadata': self.get_metadata()
        }
```

### Data Structure Example

```python
{
    "report_type": "SALES_BY_PRODUCT",
    "report_title": "Sales by Product - January 2026",
    "generated_at": "2026-01-25T14:30:00Z",
    "period": "2026-01-01 to 2026-01-31",
    "filters": {
        "date_range": {
            "start_date": "2026-01-01",
            "end_date": "2026-01-31"
        }
    },
    "data": [
        {
            "rank": 1,
            "product_id": 101,
            "product_name": "Rice 5kg Basmati",
            "sku": "RICE-5KG-BAS",
            "category": "Groceries - Grains",
            "quantity": 250,
            "revenue": 125000.00,
            "avg_price": 500.00,
            "percentage": 15.5
        },
        {
            "rank": 2,
            "product_id": 102,
            "product_name": "Cooking Oil 1L",
            "sku": "OIL-1L-SUN",
            "category": "Groceries - Cooking",
            "quantity": 300,
            "revenue": 105000.00,
            "avg_price": 350.00,
            "percentage": 13.0
        }
    ],
    "totals": {
        "quantity": 2500,
        "revenue": 806500.00,
        "row_count": 45
    },
    "metadata": {
        "top_product": "Rice 5kg Basmati",
        "top_category": "Groceries",
        "generation_time_seconds": 2.3
    }
}
```

### Expected Outcome
- Functional sales by product report
- Proper aggregation by product
- Ranking and percentage calculations
- Standardized return structure

### Verification Checklist
- [ ] sales/by_product.py created
- [ ] SalesByProductReport class defined
- [ ] Inherits from BaseReportGenerator
- [ ] get_base_queryset implemented
- [ ] generate method implemented
- [ ] Product aggregation working
- [ ] Ranking added
- [ ] Percentage calculation correct
- [ ] Returns standardized structure
- [ ] Report definition registered

---

## Task 21: Add Product Filter

### Overview
Add product and product category filtering capabilities to the SalesByProductReport. Allow users to filter the report to specific products or product categories for focused analysis.

### Dependencies
- Task 20: Create SalesByProductReport

### Instructions

1. **Open by_product.py file**
   - Navigate to `apps/analytics/generators/sales/by_product.py`
   - Locate SalesByProductReport class

2. **Add apply_product_filters method**
   - Accepts queryset parameter
   - Extracts product filter from filter_parameters
   - Extracts category filter from filter_parameters
   - Applies filters if present
   - Returns filtered queryset

3. **Implement single product filter**
   - Filter by specific product_id
   - Handle invalid product IDs gracefully

4. **Implement multi-product filter**
   - Filter by list of product_ids
   - Uses __in lookup

5. **Implement category filter**
   - Filter by product category
   - Support single or multiple categories
   - Uses product__category__in lookup

6. **Combine filters with AND logic**
   - If both product and category specified
   - Apply both filters
   - Intersection of results

7. **Update report definition filters**
   - Add product filter definition
   - Add category filter definition
   - Set as optional filters

### apply_product_filters Implementation

```python
def apply_product_filters(self, queryset):
    """
    Apply product and category filters to queryset.
    
    Args:
        queryset: Base queryset
        
    Returns:
        QuerySet: Filtered queryset
    """
    # Product filter (specific products)
    product_ids = self.get_filter_value('product')
    if product_ids:
        if isinstance(product_ids, list):
            queryset = queryset.filter(product_id__in=product_ids)
        else:
            queryset = queryset.filter(product_id=product_ids)
    
    # Category filter
    category_ids = self.get_filter_value('category')
    if category_ids:
        if isinstance(category_ids, list):
            queryset = queryset.filter(product__category_id__in=category_ids)
        else:
            queryset = queryset.filter(product__category_id=category_ids)
    
    return queryset
```

### Filter Configuration in Report Definition

```json
{
  "available_filters": {
    "date_range": {
      "type": "date_range",
      "label": "Date Range",
      "required": true,
      "default": "last_30_days"
    },
    "category": {
      "type": "multi_select",
      "label": "Product Categories",
      "model": "ProductCategory",
      "required": false,
      "help_text": "Filter by specific product categories"
    },
    "product": {
      "type": "multi_select",
      "label": "Products",
      "model": "Product",
      "required": false,
      "help_text": "Filter by specific products"
    },
    "location": {
      "type": "single_select",
      "label": "Location",
      "model": "Warehouse",
      "required": false,
      "help_text": "Filter by warehouse/location"
    }
  }
}
```

### Filter Usage Examples

```python
# Example 1: Filter by single product
filters = {
    'date_range': {
        'start_date': '2026-01-01',
        'end_date': '2026-01-31'
    },
    'product': 101  # Single product ID
}

# Example 2: Filter by multiple products
filters = {
    'date_range': {
        'start_date': '2026-01-01',
        'end_date': '2026-01-31'
    },
    'product': [101, 102, 103]  # Multiple products
}

# Example 3: Filter by category
filters = {
    'date_range': {
        'start_date': '2026-01-01',
        'end_date': '2026-01-31'
    },
    'category': [1, 2]  # Electronics and Groceries
}

# Example 4: Combined filters
filters = {
    'date_range': {
        'start_date': '2026-01-01',
        'end_date': '2026-01-31'
    },
    'category': [1],  # Electronics only
    'product': [101, 102],  # Specific products within category
    'location': 5  # Colombo warehouse
}
```

### Expected Outcome
- Product filtering functionality
- Category filtering functionality
- Combined filter support
- Flexible filter configuration

### Verification Checklist
- [ ] apply_product_filters method added
- [ ] Single product filter working
- [ ] Multi-product filter working
- [ ] Category filter working
- [ ] Combined filters working
- [ ] Filter definitions updated
- [ ] Help text added
- [ ] Tested with various filter combinations

---

## Task 22: Add Date Range Filter

### Overview
Enhance the date range filtering in SalesByProductReport with flexible date range options including presets (today, yesterday, last 7 days, etc.) and custom range selection.

### Dependencies
- Task 21: Add product filter

### Instructions

1. **Add date range preset support**
   - Define common presets (today, yesterday, last_7_days, etc.)
   - Implement preset resolution logic
   - Convert presets to actual date ranges

2. **Add get_date_range method**
   - Extracts date_range from filters
   - Resolves presets to actual dates
   - Validates date range
   - Returns start_date, end_date tuple

3. **Implement preset constants**
   - TODAY: Current date
   - YESTERDAY: Previous date
   - LAST_7_DAYS: Last 7 days
   - LAST_30_DAYS: Last 30 days
   - THIS_MONTH: Current month
   - LAST_MONTH: Previous month
   - THIS_YEAR: Current year
   - CUSTOM: User-specified range

4. **Add date validation**
   - Ensure start_date before end_date
   - Check maximum range (if configured)
   - Handle timezone considerations

5. **Update get_period_string method**
   - Formats date range for display
   - Shows preset name if applicable
   - Shows custom range dates

### Date Range Preset Implementation

```python
from datetime import datetime, timedelta
from django.utils import timezone

class DateRangePresets:
    """Date range preset constants and resolution."""
    
    TODAY = 'today'
    YESTERDAY = 'yesterday'
    LAST_7_DAYS = 'last_7_days'
    LAST_30_DAYS = 'last_30_days'
    THIS_MONTH = 'this_month'
    LAST_MONTH = 'last_month'
    THIS_YEAR = 'this_year'
    CUSTOM = 'custom'
    
    @staticmethod
    def resolve_preset(preset: str) -> tuple:
        """
        Resolve preset to actual date range.
        
        Args:
            preset: Preset name
            
        Returns:
            tuple: (start_date, end_date)
        """
        today = timezone.now().date()
        
        if preset == DateRangePresets.TODAY:
            return today, today
        
        elif preset == DateRangePresets.YESTERDAY:
            yesterday = today - timedelta(days=1)
            return yesterday, yesterday
        
        elif preset == DateRangePresets.LAST_7_DAYS:
            start = today - timedelta(days=6)
            return start, today
        
        elif preset == DateRangePresets.LAST_30_DAYS:
            start = today - timedelta(days=29)
            return start, today
        
        elif preset == DateRangePresets.THIS_MONTH:
            start = today.replace(day=1)
            return start, today
        
        elif preset == DateRangePresets.LAST_MONTH:
            first_this_month = today.replace(day=1)
            last_day_last_month = first_this_month - timedelta(days=1)
            first_last_month = last_day_last_month.replace(day=1)
            return first_last_month, last_day_last_month
        
        elif preset == DateRangePresets.THIS_YEAR:
            start = today.replace(month=1, day=1)
            return start, today
        
        return None, None


def get_date_range(self) -> tuple:
    """
    Get date range from filters with preset support.
    
    Returns:
        tuple: (start_date, end_date) or (None, None)
    """
    date_range = self.filter_parameters.get('date_range')
    
    if not date_range:
        return None, None
    
    # Handle preset
    if isinstance(date_range, str):
        return DateRangePresets.resolve_preset(date_range)
    
    # Handle dictionary with start/end
    if isinstance(date_range, dict):
        start = date_range.get('start_date')
        end = date_range.get('end_date')
        
        # Convert strings to dates if needed
        if isinstance(start, str):
            start = datetime.strptime(start, '%Y-%m-%d').date()
        if isinstance(end, str):
            end = datetime.strptime(end, '%Y-%m-%d').date()
        
        # Validate
        if start and end and start > end:
            raise ValueError("Start date must be before end date")
        
        # Check max range if configured
        max_days = self.report_definition.max_date_range_days
        if max_days and start and end:
            delta = (end - start).days
            if delta > max_days:
                raise ValueError(
                    f"Date range cannot exceed {max_days} days"
                )
        
        return start, end
    
    return None, None
```

### get_period_string Implementation

```python
def get_period_string(self) -> str:
    """
    Get human-readable period string.
    
    Returns:
        str: Formatted period description
    """
    date_range = self.filter_parameters.get('date_range')
    
    # Handle preset names
    preset_names = {
        'today': 'Today',
        'yesterday': 'Yesterday',
        'last_7_days': 'Last 7 Days',
        'last_30_days': 'Last 30 Days',
        'this_month': 'This Month',
        'last_month': 'Last Month',
        'this_year': 'This Year'
    }
    
    if isinstance(date_range, str) and date_range in preset_names:
        return preset_names[date_range]
    
    # Handle custom range
    start, end = self.get_date_range()
    if start and end:
        if start == end:
            return start.strftime('%B %d, %Y')
        return f"{start.strftime('%Y-%m-%d')} to {end.strftime('%Y-%m-%d')}"
    
    return "All Time"
```

### Expected Outcome
- Date range preset support
- Flexible custom range selection
- Date validation
- Human-readable period display

### Verification Checklist
- [ ] DateRangePresets class created
- [ ] All presets implemented
- [ ] get_date_range method added
- [ ] Date validation working
- [ ] Max range check implemented
- [ ] get_period_string method added
- [ ] Preset names displayed correctly
- [ ] Custom ranges formatted properly

---

## Task 23: Add Quantity/Revenue Columns

### Overview
Enhance the SalesByProductReport data structure with additional calculated columns including total cost, profit margin, and unit economics metrics.

### Dependencies
- Task 22: Add date range filter

### Instructions

1. **Add cost calculation**
   - Include product cost in aggregation
   - Calculate total cost (quantity × unit_cost)
   - Add to data rows

2. **Add profit calculation**
   - Calculate profit (revenue - cost)
   - Add profit margin percentage
   - Add to data rows

3. **Add average metrics**
   - Average price per unit
   - Average cost per unit
   - Average profit per unit

4. **Add transaction count**
   - Count distinct invoices
   - Shows how many transactions included product
   - Add to data rows

5. **Format currency values**
   - Use consistent decimal places (2)
   - Add currency code (LKR)
   - Format large numbers with separators

6. **Update totals calculation**
   - Include all new metrics in totals
   - Calculate aggregate profit margin

### Enhanced Data Structure

```python
{
    "rank": 1,
    "product_id": 101,
    "product_name": "Rice 5kg Basmati",
    "sku": "RICE-5KG-BAS",
    "category": "Groceries - Grains",
    
    # Quantity metrics
    "quantity": 250,
    "transaction_count": 45,  # Number of invoices
    "avg_qty_per_transaction": 5.56,
    
    # Revenue metrics
    "revenue": 125000.00,
    "avg_price": 500.00,
    "percentage": 15.5,
    
    # Cost metrics
    "total_cost": 87500.00,
    "avg_cost": 350.00,
    
    # Profit metrics
    "profit": 37500.00,
    "profit_margin": 30.0,  # (profit / revenue * 100)
    "avg_profit_per_unit": 150.00
}
```

### Enhanced Totals Structure

```python
{
    "quantity": 2500,
    "revenue": 806500.00,
    "total_cost": 564550.00,
    "profit": 241950.00,
    "profit_margin": 30.0,  # Overall margin
    "transaction_count": 856,
    "row_count": 45,
    "avg_order_value": 941.84
}
```

### Expected Outcome
- Comprehensive product metrics
- Cost and profit calculations
- Transaction-level analytics
- Formatted currency display

### Verification Checklist
- [ ] Cost columns added
- [ ] Profit columns added
- [ ] Average metrics added
- [ ] Transaction count added
- [ ] Currency formatting working
- [ ] Totals updated
- [ ] All calculations correct

---

## Task 24: Create SalesByCustomerReport

### Overview
Create the SalesByCustomerReport class that generates sales analysis grouped by customer. This report shows customer purchase behavior, total spending, and order patterns.

### Dependencies
- Task 23: Add quantity/revenue columns
- Customer model exists

### Instructions

1. **Create by_customer.py file**
   - Create at `apps/analytics/generators/sales/by_customer.py`
   - Import BaseReportGenerator
   - Import required models

2. **Define SalesByCustomerReport class**
   - Inherit from BaseReportGenerator
   - Add class docstring
   - Define REPORT_TYPE constant

3. **Implement get_base_queryset**
   - Returns SalesInvoice queryset
   - Filters by tenant
   - Includes related customer data
   - Excludes voided/cancelled

4. **Implement generate method**
   - Aggregates sales by customer
   - Calculates total amount, order count
   - Calculates average order value
   - Sorts by total amount descending

5. **Add customer details**
   - Customer name
   - Customer code
   - Customer type (retail/wholesale)
   - Contact information (optional)

6. **Add date filters**
   - Support date range filtering
   - Use invoice date field

7. **Register report definition**
   - Create in ReportDefinition table
   - Set appropriate filters

### SalesByCustomerReport Implementation

```python
class SalesByCustomerReport(BaseReportGenerator):
    """
    Sales analysis grouped by customer.
    
    Shows customer purchase patterns, total spending,
    and order frequency for the filtered period.
    
    Filters:
        - date_range (required): Date range for analysis
        - customer (optional): Specific customer filter
        - customer_type (optional): Retail/wholesale filter
        
    Metrics:
        - Total amount spent
        - Order count
        - Average order value
        - First purchase date
        - Last purchase date
        - Rank by total amount
    """
    
    REPORT_TYPE = "SALES_BY_CUSTOMER"
    
    def get_base_queryset(self):
        """Get base queryset for sales invoices."""
        return SalesInvoice.objects.filter(
            tenant=self.tenant,
            status='COMPLETED'
        ).select_related('customer')
    
    def generate(self) -> Dict[str, Any]:
        """Generate sales by customer report."""
        self.validate_filters()
        
        queryset = self.get_base_queryset()
        queryset = self.apply_date_filter(queryset, 'date')
        queryset = self.apply_customer_filters(queryset)
        
        customer_sales = queryset.values(
            'customer_id',
            'customer__name',
            'customer__code',
            'customer__customer_type'
        ).annotate(
            order_count=Count('id'),
            total_amount=Sum('grand_total'),
            avg_order_value=Avg('grand_total'),
            first_purchase=Min('date'),
            last_purchase=Max('date')
        ).order_by('-total_amount')
        
        data = list(customer_sales)
        total_amount = sum(row['total_amount'] for row in data)
        
        for idx, row in enumerate(data, start=1):
            row['rank'] = idx
            row['percentage'] = (
                (row['total_amount'] / total_amount * 100)
                if total_amount > 0 else 0
            )
            row['customer_name'] = row.pop('customer__name')
            row['customer_code'] = row.pop('customer__code')
            row['customer_type'] = row.pop('customer__customer_type')
        
        return {
            'report_type': self.REPORT_TYPE,
            'report_title': self.get_report_title(),
            'generated_at': timezone.now(),
            'period': self.get_period_string(),
            'filters': self.filter_parameters,
            'data': data,
            'totals': self.calculate_totals(data),
            'row_count': len(data),
            'metadata': self.get_metadata()
        }
```

### Expected Outcome
- Functional customer sales report
- Customer aggregation and metrics
- Order pattern analysis
- Ranking by total spend

### Verification Checklist
- [ ] by_customer.py created
- [ ] SalesByCustomerReport class defined
- [ ] get_base_queryset implemented
- [ ] generate method implemented
- [ ] Customer aggregation working
- [ ] Metrics calculated correctly
- [ ] Report definition registered

---

## Task 25: Add Customer Ranking

### Overview
Add advanced customer ranking and segmentation features to the SalesByCustomerReport including RFM analysis (Recency, Frequency, Monetary) and customer tier classification.

### Dependencies
- Task 24: Create SalesByCustomerReport

### Instructions

1. **Add RFM calculation**
   - Calculate Recency (days since last purchase)
   - Calculate Frequency (order count)
   - Calculate Monetary (total amount)
   - Assign RFM scores

2. **Add customer segmentation**
   - Define customer tiers (VIP, Loyal, Regular, At Risk)
   - Assign based on RFM scores
   - Add to data rows

3. **Add lifetime value calculation**
   - Calculate based on order history
   - Include in metrics

4. **Add purchase frequency metrics**
   - Average days between orders
   - Purchase frequency score

### Expected Outcome
- RFM analysis
- Customer segmentation
- Enhanced ranking metrics

### Verification Checklist
- [ ] RFM calculation added
- [ ] Customer tiers assigned
- [ ] Lifetime value calculated
- [ ] Segmentation working

---

## Task 26: Add Order Count Column

### Overview
Enhance the SalesByCustomerReport with order count metrics and transaction-level analytics.

### Dependencies
- Task 25: Add customer ranking

### Instructions

1. **Add order count**
   - Already included in aggregation
   - Format for display

2. **Add items per order**
   - Calculate average items per transaction
   - Add to metrics

3. **Add purchase patterns**
   - Most common purchase day
   - Most common purchase time
   - Optional analytics

### Expected Outcome
- Order count metrics
- Transaction analytics
- Purchase pattern insights

### Verification Checklist
- [ ] Order count displayed
- [ ] Items per order calculated
- [ ] Purchase patterns analyzed
- [ ] Metrics accurate

---

## Summary

This document established the report generation framework and first two sales reports:

### Completed Infrastructure
- ✅ BaseReportGenerator abstract class
- ✅ Abstract generate() method interface
- ✅ Export methods (PDF, Excel, CSV)
- ✅ SalesByProductReport with full metrics
- ✅ Product and category filtering
- ✅ Date range filtering with presets
- ✅ Quantity, revenue, cost, profit columns
- ✅ SalesByCustomerReport with ranking
- ✅ RFM analysis and segmentation
- ✅ Order count and transaction metrics

### Key Achievements
1. **Report Framework** - Reusable base class for all reports
2. **Export System** - PDF, Excel, CSV generation
3. **Product Analysis** - Comprehensive product sales metrics
4. **Customer Analysis** - Customer behavior and segmentation
5. **Flexible Filtering** - Date presets, product, category filters
6. **Advanced Metrics** - Profit margins, RFM scores, rankings

### Next Steps
Proceed to [02_Tasks-27-34_Period-Channel-Cashier.md](02_Tasks-27-34_Period-Channel-Cashier.md) to implement period analysis, channel comparison, and cashier performance reports.

---

**Document Status:** ✅ Complete  
**Total Tasks:** 10  
**Total Lines:** ~982
