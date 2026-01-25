# Tasks 35-44: Stock Reports (Level, Movement, Valuation)

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 14 - Analytics and Reports  
> **Group:** C - Inventory and Purchase Reports  
> **Document:** 01 of 02  
> **Tasks Covered:** 35, 36, 37, 38, 39, 40, 41, 42, 43, 44

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-45-54_Purchase-Reports.md](02_Tasks-45-54_Purchase-Reports.md)

---

## Document Overview

This document covers the implementation of comprehensive stock reporting functionality, including stock level reports, stock movement tracking, and stock valuation analysis. These reports provide critical insights into inventory management, warehouse operations, and financial valuation of stock assets.

The stock reporting system consists of three main report generators:
- **StockLevelReport**: Real-time stock quantities with filtering by location, category, and product
- **StockMovementReport**: Transaction-based movement tracking with running balances and period analysis
- **StockValuationReport**: Financial valuation using FIFO, LIFO, and Average costing methods with aging analysis

All report generators inherit from `BaseReportGenerator` and leverage the existing data models (`StockLevel`, `StockMovement`) to provide accurate, real-time inventory intelligence.

### Tasks in This Document

| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 35 | Create StockLevelReport base class | Medium | 30 min |
| 36 | Implement current stock query methods | Medium | 35 min |
| 37 | Add location and category filters | Medium | 30 min |
| 38 | Implement stock level aggregation | High | 40 min |
| 39 | Create StockMovementReport base class | Medium | 30 min |
| 40 | Implement movement transaction queries | High | 45 min |
| 41 | Add running balance calculations | High | 40 min |
| 42 | Create StockValuationReport base class | Medium | 30 min |
| 43 | Implement costing method calculations | High | 50 min |
| 44 | Add aging and valuation analysis | High | 45 min |

---

## Task 35: Create StockLevelReport Base Class

### Overview
Create the foundation `StockLevelReport` class that inherits from `BaseReportGenerator`. This report generator provides current stock level information across products, locations, and categories, serving as the primary tool for real-time inventory visibility.

### Dependencies
- `BaseReportGenerator` class exists in `apps/reports/generators/base.py`
- `StockLevel` model exists in `apps/inventory/models/stock.py`
- `Product` model exists in `apps/inventory/models/product.py`
- `Location` model exists in `apps/inventory/models/location.py`

### Instructions

1. **Create stock reports module**
   - Navigate to `apps/reports/generators/` directory
   - Create new file `stock_reports.py`
   - This will contain all stock-related report generators

2. **Add module imports**
   - Import `BaseReportGenerator` from `base.py`
   - Import necessary Django ORM modules (Q, F, Sum, Count, etc.)
   - Import date/time handling utilities
   - Import `StockLevel`, `Product`, `Location`, `Category` models
   - Import tenant utilities if multi-tenancy is implemented

3. **Create StockLevelReport class**
   - Define class inheriting from `BaseReportGenerator`
   - Add comprehensive class docstring explaining purpose
   - Document expected parameters and output format

4. **Define report metadata**
   - Set `report_name` class attribute to "Stock Level Report"
   - Set `report_code` to "STOCK_LEVEL"
   - Define `report_category` as "inventory"
   - Add `supports_excel` = True
   - Add `supports_pdf` = True
   - Add `supports_csv` = True

5. **Initialize report parameters**
   - Override `__init__` method accepting kwargs
   - Extract `as_of_date` parameter (defaults to today)
   - Extract `location_ids` list parameter for filtering
   - Extract `category_ids` list parameter for filtering
   - Extract `product_ids` list parameter for specific products
   - Extract `include_zero_stock` boolean (default False)
   - Extract `group_by` parameter ('product', 'location', 'category')
   - Call parent `__init__` with remaining kwargs

6. **Define parameter schema**
   - Create `get_parameter_schema()` method
   - Return dictionary defining all accepted parameters
   - Include parameter types, defaults, and descriptions
   - Mark required vs optional parameters

7. **Add validation method**
   - Create `validate_parameters()` method
   - Verify date parameters are valid
   - Check location/category/product IDs exist in database
   - Validate `group_by` is one of allowed values
   - Raise appropriate validation errors

### Expected Outcome
- `StockLevelReport` class properly inherits from `BaseReportGenerator`
- All report metadata attributes are defined
- Parameter initialization and validation is implemented
- Class is ready for query method implementation
- Proper docstrings document usage and parameters

### Verification Checklist
- [ ] `apps/reports/generators/stock_reports.py` file created
- [ ] All necessary imports included
- [ ] `StockLevelReport` class defined with inheritance
- [ ] Report metadata attributes (name, code, category) set
- [ ] `__init__` method extracts all parameters correctly
- [ ] `get_parameter_schema()` documents all parameters
- [ ] `validate_parameters()` performs proper validation
- [ ] Class docstring is comprehensive

---

## Task 36: Implement Current Stock Query Methods

### Overview
Implement the core query methods for `StockLevelReport` that fetch current stock levels from the database. These methods build the base queryset with appropriate filters and annotations for stock quantities.

### Dependencies
- Task 35: Create StockLevelReport base class
- `StockLevel` model with current quantity tracking
- Django ORM knowledge for complex queries

### Instructions

1. **Create base queryset method**
   - Define `get_base_queryset()` method
   - Start with `StockLevel.objects.all()`
   - Apply tenant filtering if multi-tenancy enabled
   - Select related Product, Location, Category for efficiency
   - Return optimized queryset

2. **Implement date filtering**
   - Create `apply_date_filter()` method
   - Accept queryset and as_of_date parameter
   - Filter stock records valid as of specified date
   - Handle historical stock levels if tracking changes over time
   - Consider stock adjustments and movements up to date

3. **Add location filtering**
   - Create `apply_location_filter()` method
   - Accept queryset and location_ids list
   - If location_ids provided, filter to those locations
   - If empty, include all locations
   - Support hierarchical locations if implemented

4. **Add category filtering**
   - Create `apply_category_filter()` method
   - Filter through product relationship to category
   - Support multiple categories
   - Handle null/uncategorized products appropriately

5. **Add product filtering**
   - Create `apply_product_filter()` method
   - Direct filter on product_id if specified
   - Support multiple product selection
   - Efficient query using `__in` lookup

6. **Implement zero stock filtering**
   - Create `apply_zero_stock_filter()` method
   - If `include_zero_stock` is False, exclude zero quantities
   - Filter where quantity_on_hand > 0
   - Preserve entries where quantity is exactly zero if flag is True

7. **Create main query builder**
   - Define `build_query()` method
   - Call `get_base_queryset()`
   - Apply all filters in sequence (date, location, category, product, zero stock)
   - Add annotations for calculated fields
   - Return final queryset

8. **Add annotation methods**
   - Create `add_stock_annotations()` method
   - Annotate with calculated fields like available stock
   - Calculate reserved quantities if reservations exist
   - Compute available = on_hand - reserved
   - Add product information fields (SKU, name, UOM)

### Query Optimization Tips

| Technique | Purpose | Implementation |
|-----------|---------|----------------|
| `select_related()` | Reduce queries for foreign keys | Product, Location, Category |
| `prefetch_related()` | Optimize reverse relations | Product variants, attributes |
| `only()` | Limit fields retrieved | Specify needed fields only |
| `annotate()` | Database-level calculations | Sum, Count, computed fields |
| Indexing | Speed up filters | Ensure proper indexes on FK, dates |

### Expected Outcome
- Efficient database queries retrieving current stock levels
- All filtering options properly implemented
- Annotated querysets include calculated fields
- Queries are optimized with select_related/prefetch_related
- Methods are modular and testable

### Verification Checklist
- [ ] `get_base_queryset()` returns optimized base query
- [ ] `apply_date_filter()` correctly filters by as_of_date
- [ ] `apply_location_filter()` handles location filtering
- [ ] `apply_category_filter()` filters by product category
- [ ] `apply_product_filter()` supports product selection
- [ ] `apply_zero_stock_filter()` respects include_zero_stock flag
- [ ] `build_query()` chains all filters correctly
- [ ] `add_stock_annotations()` adds calculated fields
- [ ] Queries use proper select_related for performance

---

## Task 37: Add Location and Category Filters

### Overview
Enhance the `StockLevelReport` with sophisticated location and category filtering capabilities, including hierarchical filtering, multi-select options, and aggregation by location or category groupings.

### Dependencies
- Task 36: Implement current stock query methods
- Location model with potential parent-child relationships
- Category model with potential hierarchical structure

### Instructions

1. **Implement hierarchical location filtering**
   - Create `get_location_hierarchy()` method
   - Accept parent location ID
   - Recursively find all child locations
   - Return list of all location IDs in hierarchy
   - Use efficient recursive CTE query or model method

2. **Add location include/exclude logic**
   - Extend `apply_location_filter()` method
   - Support `include_locations` list parameter
   - Support `exclude_locations` list parameter
   - Apply inclusion first, then exclusion
   - Handle conflicts appropriately

3. **Implement location grouping**
   - Create `group_by_location()` method
   - Group stock levels by location
   - Aggregate quantities across products in same location
   - Calculate location totals and subtotals
   - Return structured data with location information

4. **Implement hierarchical category filtering**
   - Create `get_category_hierarchy()` method
   - Accept parent category ID
   - Find all descendant categories
   - Return complete category ID list
   - Handle circular references safely

5. **Add category include/exclude logic**
   - Extend `apply_category_filter()` method
   - Support `include_categories` parameter
   - Support `exclude_categories` parameter
   - Apply filters through product relationship
   - Handle products with multiple categories if applicable

6. **Implement category grouping**
   - Create `group_by_category()` method
   - Group stock across all locations by category
   - Aggregate quantities for products in same category
   - Calculate category totals
   - Include category metadata (name, description)

7. **Add multi-level grouping**
   - Create `apply_grouping()` method
   - Support grouping by location, then category
   - Support grouping by category, then location
   - Support product-level detail within groups
   - Create nested data structure for hierarchical display

8. **Implement filter summary method**
   - Create `get_filter_summary()` method
   - Return dictionary of applied filters
   - Include counts of filtered items
   - List specific locations/categories included
   - Show date range and other parameters

### Hierarchical Filtering Example

```
Location Hierarchy:
Main Warehouse (ID: 1)
├── Aisle A (ID: 2)
│   ├── Section A1 (ID: 5)
│   └── Section A2 (ID: 6)
└── Aisle B (ID: 3)
    ├── Section B1 (ID: 7)
    └── Section B2 (ID: 8)

Filter by Main Warehouse (ID: 1)
→ Includes all child locations: 2, 3, 5, 6, 7, 8
```

### Expected Outcome
- Hierarchical location filtering working correctly
- Category hierarchy filtering implemented
- Multiple grouping options available
- Include/exclude logic functions properly
- Nested data structures for hierarchical reports

### Verification Checklist
- [ ] `get_location_hierarchy()` recursively finds child locations
- [ ] Include/exclude location logic works correctly
- [ ] `group_by_location()` aggregates by location properly
- [ ] `get_category_hierarchy()` finds descendant categories
- [ ] Include/exclude category logic implemented
- [ ] `group_by_category()` groups by category correctly
- [ ] Multi-level grouping produces nested structures
- [ ] `get_filter_summary()` documents applied filters
- [ ] Edge cases handled (circular refs, missing data)

---

## Task 38: Implement Stock Level Aggregation

### Overview
Implement comprehensive aggregation methods for stock level data, including quantity summaries, value calculations, statistical analysis, and report generation in multiple formats (Excel, PDF, CSV).

### Dependencies
- Task 37: Add location and category filters
- Aggregation utilities from BaseReportGenerator
- Export formatting libraries

### Instructions

1. **Create quantity aggregation method**
   - Define `aggregate_quantities()` method
   - Calculate total quantity on hand across filtered stock
   - Calculate total available quantity (on hand - reserved)
   - Calculate total reserved quantity
   - Calculate total committed quantity if applicable
   - Return dictionary with aggregated values

2. **Implement value calculations**
   - Create `calculate_stock_value()` method
   - Get unit cost for each product from latest purchase or standard cost
   - Multiply quantity by unit cost for each stock record
   - Sum total value across all filtered stock
   - Calculate average cost per unit across portfolio
   - Return value totals and averages

3. **Add statistical analysis**
   - Create `calculate_statistics()` method
   - Calculate min, max, average stock quantities
   - Identify products with highest/lowest stock levels
   - Calculate stock turnover indicators if movement data available
   - Compute variance and standard deviation if meaningful
   - Return statistics dictionary

4. **Implement threshold analysis**
   - Create `analyze_thresholds()` method
   - Compare current stock to minimum stock levels
   - Identify items below reorder point
   - Flag items exceeding maximum stock levels
   - Categorize stock levels (critical, low, normal, high, excess)
   - Return categorized lists and counts

5. **Create summary data method**
   - Define `get_summary_data()` method
   - Combine quantity aggregates, values, and statistics
   - Include threshold analysis results
   - Add filter summary information
   - Structure data for report header/summary section
   - Return comprehensive summary dictionary

6. **Implement detail data method**
   - Create `get_detail_data()` method
   - Execute build_query() to get filtered queryset
   - Apply grouping based on group_by parameter
   - Convert queryset to list of dictionaries
   - Include all relevant fields (product, location, quantities, values)
   - Apply sorting based on report parameters
   - Return list of detail records

7. **Override generate method**
   - Override `generate()` method from BaseReportGenerator
   - Call `validate_parameters()` first
   - Get summary data using `get_summary_data()`
   - Get detail data using `get_detail_data()`
   - Structure complete report data dictionary
   - Return report data ready for formatting

8. **Implement Excel export**
   - Create `export_to_excel()` method
   - Generate summary sheet with aggregates
   - Create detail sheet with stock levels
   - Apply formatting (headers, borders, number formats)
   - Add filters to Excel columns
   - Add charts if appropriate (stock distribution, value by category)
   - Return Excel file object or path

9. **Implement PDF export**
   - Create `export_to_pdf()` method
   - Design PDF layout with header and footer
   - Include report title, parameters, and date
   - Render summary section with key metrics
   - Create table for stock level details
   - Apply pagination and page breaks appropriately
   - Return PDF file object or path

10. **Implement CSV export**
    - Create `export_to_csv()` method
    - Flatten nested data structures for CSV format
    - Include all relevant columns
    - Add header row with column names
    - Handle encoding properly (UTF-8)
    - Return CSV file object or path

### Aggregation Example Structure

```
Stock Level Report Aggregation:
{
  "summary": {
    "total_quantity": 15420,
    "total_available": 14890,
    "total_reserved": 530,
    "total_value": 487650.00,
    "average_unit_cost": 31.62,
    "unique_products": 247,
    "locations_count": 12,
    "below_reorder": 18,
    "excess_stock": 5
  },
  "details": [
    {
      "product_sku": "PROD-001",
      "product_name": "Widget A",
      "location_name": "Main Warehouse",
      "quantity_on_hand": 150,
      "quantity_available": 145,
      "quantity_reserved": 5,
      "unit_cost": 12.50,
      "total_value": 1875.00,
      "status": "normal"
    },
    ...
  ]
}
```

### Expected Outcome
- Complete aggregation methods for quantities and values
- Statistical analysis provides meaningful insights
- Threshold analysis identifies inventory issues
- All export formats (Excel, PDF, CSV) working
- Report data is well-structured and complete

### Verification Checklist
- [ ] `aggregate_quantities()` calculates all quantity totals
- [ ] `calculate_stock_value()` computes accurate valuations
- [ ] `calculate_statistics()` provides meaningful metrics
- [ ] `analyze_thresholds()` identifies reorder points
- [ ] `get_summary_data()` combines all summary information
- [ ] `get_detail_data()` returns properly structured details
- [ ] `generate()` method orchestrates report creation
- [ ] `export_to_excel()` produces formatted Excel file
- [ ] `export_to_pdf()` creates readable PDF report
- [ ] `export_to_csv()` generates proper CSV output
- [ ] All export formats include summary and details

---

## Task 39: Create StockMovementReport Base Class

### Overview
Create the `StockMovementReport` class that tracks stock movements (receipts, issues, adjustments, transfers) over a specified time period. This report provides transaction-level detail with running balances and movement analysis.

### Dependencies
- `BaseReportGenerator` class exists
- `StockMovement` model exists in `apps/inventory/models/stock.py`
- Task 35-38 completed (for reference and consistency)

### Instructions

1. **Define StockMovementReport class**
   - Create class in `stock_reports.py` below StockLevelReport
   - Inherit from `BaseReportGenerator`
   - Add comprehensive class docstring
   - Explain movement tracking and running balance calculation

2. **Define report metadata**
   - Set `report_name` to "Stock Movement Report"
   - Set `report_code` to "STOCK_MOVEMENT"
   - Set `report_category` to "inventory"
   - Enable Excel, PDF, and CSV exports
   - Add `supports_charts` = True for movement visualization

3. **Initialize report parameters**
   - Override `__init__` method
   - Extract `start_date` parameter (required)
   - Extract `end_date` parameter (required)
   - Extract `location_ids` list for filtering
   - Extract `product_ids` list for filtering
   - Extract `movement_types` list (receipt, issue, adjustment, transfer)
   - Extract `include_zero_movements` boolean (default False)
   - Extract `show_running_balance` boolean (default True)
   - Extract `group_by` parameter options
   - Call parent `__init__`

4. **Define movement type constants**
   - Create class constants for movement types
   - MOVEMENT_TYPE_RECEIPT = 'receipt'
   - MOVEMENT_TYPE_ISSUE = 'issue'
   - MOVEMENT_TYPE_ADJUSTMENT = 'adjustment'
   - MOVEMENT_TYPE_TRANSFER = 'transfer'
   - MOVEMENT_TYPES_ALL list containing all types

5. **Create parameter schema**
   - Define `get_parameter_schema()` method
   - Document all parameters with types and descriptions
   - Mark start_date and end_date as required
   - Define allowed values for movement_types
   - Include default values

6. **Implement validation**
   - Create `validate_parameters()` method
   - Ensure start_date < end_date
   - Verify date range is not excessive (e.g., max 1 year)
   - Validate movement_types are from allowed list
   - Check location_ids and product_ids exist
   - Raise descriptive validation errors

7. **Add movement type helper methods**
   - Create `get_movement_type_display()` method
   - Return human-readable name for movement type
   - Create `get_movement_types_filter()` method
   - Return Q object for filtering by movement types

### Movement Type Descriptions

| Movement Type | Direction | Purpose | Examples |
|---------------|-----------|---------|----------|
| Receipt | In | Add stock | Purchase receipts, production receipts, returns |
| Issue | Out | Remove stock | Sales, production usage, wastage |
| Adjustment | In/Out | Correct stock | Cycle counts, damage adjustments |
| Transfer | In/Out | Move between locations | Warehouse transfers, relocations |

### Expected Outcome
- `StockMovementReport` class properly structured
- All parameters defined and documented
- Validation ensures data integrity
- Movement type constants standardized
- Class ready for query implementation

### Verification Checklist
- [ ] `StockMovementReport` class defined with inheritance
- [ ] Report metadata attributes set correctly
- [ ] `__init__` extracts all parameters
- [ ] Movement type constants defined
- [ ] `get_parameter_schema()` documents parameters
- [ ] `validate_parameters()` validates date ranges
- [ ] Movement type helper methods implemented
- [ ] Class docstring is comprehensive

---

## Task 40: Implement Movement Transaction Queries

### Overview
Implement the core query methods for `StockMovementReport` that retrieve stock movement transactions from the database, with proper filtering, sorting, and related data optimization.

### Dependencies
- Task 39: Create StockMovementReport base class
- `StockMovement` model with transaction details
- Efficient query patterns for large datasets

### Instructions

1. **Create base movement queryset**
   - Define `get_base_queryset()` method
   - Start with `StockMovement.objects.all()`
   - Apply tenant filtering if needed
   - Select related Product, Location, User (who made movement)
   - Prefetch related data if needed
   - Return optimized queryset

2. **Implement date range filtering**
   - Create `apply_date_range_filter()` method
   - Filter movements between start_date and end_date
   - Use `movement_date__gte` and `movement_date__lte`
   - Consider timezone handling for accurate results
   - Include boundary dates appropriately

3. **Add movement type filtering**
   - Create `apply_movement_type_filter()` method
   - Accept queryset and movement_types list
   - If movement_types provided, filter to those types
   - Use `movement_type__in` for efficiency
   - If empty or None, include all movement types

4. **Implement location filtering**
   - Create `apply_location_filter()` method
   - Filter by source_location or destination_location
   - For transfers, consider both locations
   - Use Q objects for OR conditions
   - Support hierarchical locations if implemented

5. **Add product filtering**
   - Create `apply_product_filter()` method
   - Direct filter on product_id field
   - Support multiple product selection
   - Efficient `__in` lookup

6. **Implement reference filtering**
   - Create `apply_reference_filter()` method
   - Support filtering by reference_type (e.g., 'sale', 'purchase')
   - Support filtering by reference_id
   - Useful for tracing movements related to specific transactions
   - Use combined filters for both type and ID

7. **Add zero movement filtering**
   - Create `apply_zero_movement_filter()` method
   - If `include_zero_movements` is False, exclude zero quantity
   - Filter where `quantity != 0` or `quantity__gt=0`
   - Preserve zero movements if flag is True (for audit trails)

8. **Implement sorting**
   - Create `apply_sorting()` method
   - Default sort by movement_date ascending, then ID
   - Support custom sort parameters
   - Common sorts: by date, product, location, quantity
   - Use database-level ordering for performance

9. **Add annotation methods**
   - Create `add_movement_annotations()` method
   - Annotate with product SKU, name, UOM
   - Annotate with location name
   - Annotate with user name who made movement
   - Add calculated fields if needed
   - Return annotated queryset

10. **Create main query builder**
    - Define `build_query()` method
    - Get base queryset
    - Apply all filters in logical sequence
    - Apply sorting
    - Add annotations
    - Return final querysetready for execution

### Query Optimization for Large Datasets

| Challenge | Solution | Implementation |
|-----------|----------|----------------|
| Large date ranges | Indexed date fields | Add database index on movement_date |
| Many movements | Pagination | Implement cursor or offset pagination |
| Related data | select_related | Eager load Product, Location, User |
| Aggregations | Database-level | Use aggregate() and annotate() |
| Memory usage | Iterator | Use iterator() for very large querysets |

### Expected Outcome
- Efficient queries retrieving movement transactions
- All filtering options working correctly
- Queries optimized for performance
- Related data loaded efficiently
- Methods are modular and testable

### Verification Checklist
- [ ] `get_base_queryset()` returns optimized query
- [ ] `apply_date_range_filter()` filters by date range correctly
- [ ] `apply_movement_type_filter()` filters by type
- [ ] `apply_location_filter()` handles location filtering
- [ ] `apply_product_filter()` supports product selection
- [ ] `apply_reference_filter()` traces related transactions
- [ ] `apply_zero_movement_filter()` respects flag
- [ ] `apply_sorting()` orders results properly
- [ ] `add_movement_annotations()` adds calculated fields
- [ ] `build_query()` chains all operations correctly

---

## Task 41: Add Running Balance Calculations

### Overview
Implement sophisticated running balance calculations for stock movement reports, showing cumulative stock levels after each transaction. This provides visibility into stock position at any point in time during the reporting period.

### Dependencies
- Task 40: Implement movement transaction queries
- Understanding of window functions or iterative calculation
- Efficient algorithm for balance computation

### Instructions

1. **Create opening balance calculation**
   - Define `calculate_opening_balance()` method
   - Accept product_id and location_id parameters
   - Sum all movements before start_date
   - Alternatively, get StockLevel as of day before start_date
   - Return opening balance quantity
   - Cache results to avoid recalculation

2. **Implement closing balance calculation**
   - Create `calculate_closing_balance()` method
   - Add opening balance to sum of movements in period
   - Alternatively, get StockLevel as of end_date
   - Return closing balance quantity
   - Verify against current stock levels for accuracy

3. **Add running balance computation**
   - Create `calculate_running_balances()` method
   - Accept list of movement records (sorted by date)
   - Start with opening balance
   - Iterate through movements in chronological order
   - Add receipts, subtract issues, apply adjustments
   - Update running balance after each movement
   - Attach running balance to each movement record

4. **Implement balance by product and location**
   - Create `calculate_balances_by_product_location()` method
   - Group movements by product and location combination
   - Calculate separate running balances for each group
   - Handle transfers between locations correctly
   - Return dictionary with balances for each combination

5. **Add cumulative calculations**
   - Create `calculate_cumulative_quantities()` method
   - Calculate cumulative in (total receipts to date)
   - Calculate cumulative out (total issues to date)
   - Calculate cumulative adjustments
   - Calculate net cumulative (in - out + adjustments)
   - Attach cumulative figures to each movement

6. **Implement balance verification**
   - Create `verify_balances()` method
   - Compare calculated closing balance to actual stock level
   - Identify discrepancies if any
   - Flag movements that may cause issues
   - Return verification results with discrepancy details

7. **Add balance snapshot method**
   - Create `get_balance_snapshot()` method
   - Accept specific date parameter
   - Calculate stock balance as of that date
   - Consider all movements up to that date
   - Return snapshot balance by product and location

8. **Implement window function approach (optional)**
   - Create `calculate_running_balances_sql()` method
   - Use database window functions if supported (PostgreSQL)
   - Define OVER(PARTITION BY product, location ORDER BY date)
   - Calculate running totals at database level
   - More efficient for very large datasets
   - Return queryset with running balance annotations

### Running Balance Calculation Example

```
Product: Widget A | Location: Main Warehouse
Start Date: 2026-01-01 | End Date: 2026-01-31

Opening Balance (Dec 31, 2025): 100 units

Movements in January:
Date       | Type       | Quantity | Running Balance
-----------+------------+----------+----------------
2026-01-05 | Receipt    | +50      | 150
2026-01-10 | Issue      | -30      | 120
2026-01-15 | Adjustment | +5       | 125
2026-01-20 | Issue      | -25      | 100
2026-01-25 | Transfer   | -50      | 50

Closing Balance (Jan 31, 2026): 50 units
```

### Expected Outcome
- Accurate opening balance calculation
- Running balance computed for each movement
- Balances tracked separately by product and location
- Cumulative calculations provide insights
- Balance verification ensures accuracy

### Verification Checklist
- [ ] `calculate_opening_balance()` returns correct starting point
- [ ] `calculate_closing_balance()` matches actual stock
- [ ] `calculate_running_balances()` computes balances correctly
- [ ] `calculate_balances_by_product_location()` groups properly
- [ ] `calculate_cumulative_quantities()` tracks cumulative totals
- [ ] `verify_balances()` identifies discrepancies
- [ ] `get_balance_snapshot()` provides point-in-time balance
- [ ] Window function approach (if implemented) is efficient
- [ ] Running balances are chronologically correct
- [ ] Transfer movements handled correctly

---

## Task 42: Create StockValuationReport Base Class

### Overview
Create the `StockValuationReport` class that calculates the financial value of inventory using different costing methods (FIFO, LIFO, Average Cost). This report is critical for financial reporting, inventory valuation, and cost of goods sold calculations.

### Dependencies
- `BaseReportGenerator` class exists
- `StockLevel` and `StockMovement` models exist
- Understanding of inventory costing methods
- Access to purchase cost data

### Instructions

1. **Define StockValuationReport class**
   - Create class in `stock_reports.py` below StockMovementReport
   - Inherit from `BaseReportGenerator`
   - Add comprehensive class docstring
   - Explain costing methods and use cases

2. **Define report metadata**
   - Set `report_name` to "Stock Valuation Report"
   - Set `report_code` to "STOCK_VALUATION"
   - Set `report_category` to "inventory"
   - Set `supports_excel` = True
   - Set `supports_pdf` = True
   - Set `supports_csv` = True

3. **Define costing method constants**
   - Create class constant COSTING_METHOD_FIFO = 'fifo'
   - Create class constant COSTING_METHOD_LIFO = 'lifo'
   - Create class constant COSTING_METHOD_AVERAGE = 'average'
   - Create class constant COSTING_METHOD_STANDARD = 'standard'
   - Create COSTING_METHODS_ALL list

4. **Initialize report parameters**
   - Override `__init__` method
   - Extract `as_of_date` parameter (defaults to today)
   - Extract `costing_method` parameter (default 'average')
   - Extract `location_ids` list for filtering
   - Extract `category_ids` list for filtering
   - Extract `product_ids` list for filtering
   - Extract `include_zero_stock` boolean
   - Extract `include_aging_analysis` boolean (default True)
   - Call parent `__init__`

5. **Create parameter schema**
   - Define `get_parameter_schema()` method
   - Document all parameters
   - Define costing_method allowed values
   - Include descriptions of each costing method
   - Specify default values

6. **Implement validation**
   - Create `validate_parameters()` method
   - Validate costing_method is from allowed list
   - Verify as_of_date is valid
   - Check location/category/product IDs exist
   - Ensure data is available for selected costing method
   - Raise appropriate validation errors

7. **Add costing method description helper**
   - Create `get_costing_method_description()` method
   - Return detailed explanation of selected costing method
   - Include when to use each method
   - Add any limitations or requirements

### Costing Method Descriptions

| Method | Description | Use Case | Calculation |
|--------|-------------|----------|-------------|
| FIFO | First In, First Out | Assumes oldest stock sold first | Values inventory at most recent costs |
| LIFO | Last In, First Out | Assumes newest stock sold first | Values inventory at oldest costs |
| Average | Weighted Average Cost | Smooths cost fluctuations | Values at average of all purchase costs |
| Standard | Predetermined Standard Cost | Simplifies valuation | Uses fixed standard cost per product |

### Expected Outcome
- `StockValuationReport` class properly structured
- Costing method constants defined
- All parameters initialized and validated
- Helper methods for costing descriptions
- Foundation for valuation calculations

### Verification Checklist
- [ ] `StockValuationReport` class defined with inheritance
- [ ] Report metadata attributes set
- [ ] Costing method constants created
- [ ] `__init__` extracts all parameters correctly
- [ ] `get_parameter_schema()` documents parameters
- [ ] `validate_parameters()` validates costing method
- [ ] `get_costing_method_description()` provides explanations
- [ ] Class docstring explains valuation concepts

---

## Task 43: Implement Costing Method Calculations

### Overview
Implement the core valuation calculation methods for each costing method (FIFO, LIFO, Average, Standard). These methods compute the unit cost and total value of inventory based on historical purchase data and movement patterns.

### Dependencies
- Task 42: Create StockValuationReport base class
- Purchase cost data available (from Purchase Orders or Stock Receipts)
- Stock movement history for FIFO/LIFO calculations

### Instructions

1. **Create base cost data retrieval**
   - Define `get_cost_data()` method
   - Retrieve purchase costs from stock receipts
   - Get standard costs from product master data
   - Fetch cost history if available
   - Return structured cost data by product

2. **Implement FIFO valuation**
   - Create `calculate_fifo_value()` method
   - Accept product_id, quantity, and as_of_date
   - Retrieve all stock receipts chronologically
   - Create queue of (cost, quantity) tuples ordered by date
   - Consume from oldest receipts first
   - Calculate weighted cost for quantity on hand
   - Return unit cost and total value

3. **Implement LIFO valuation**
   - Create `calculate_lifo_value()` method
   - Accept product_id, quantity, and as_of_date
   - Retrieve all stock receipts chronologically
   - Create stack of (cost, quantity) tuples
   - Consume from newest receipts first
   - Calculate weighted cost for quantity on hand
   - Return unit cost and total value

4. **Implement weighted average valuation**
   - Create `calculate_average_value()` method
   - Accept product_id, quantity, and as_of_date
   - Retrieve all stock receipts up to date
   - Calculate total cost of all purchases
   - Calculate total quantity purchased
   - Compute weighted average = total cost / total quantity
   - Apply average cost to quantity on hand
   - Return average unit cost and total value

5. **Implement standard cost valuation**
   - Create `calculate_standard_value()` method
   - Accept product_id and quantity
   - Retrieve standard cost from Product model
   - Multiply quantity by standard cost
   - Return standard unit cost and total value
   - Flag if standard cost not set

6. **Create main valuation orchestrator**
   - Define `calculate_valuation()` method
   - Accept product_id, quantity, location_id, as_of_date
   - Determine which costing method to use
   - Call appropriate calculation method (FIFO, LIFO, Average, Standard)
   - Handle errors if cost data unavailable
   - Return valuation result dictionary

7. **Implement bulk valuation**
   - Create `calculate_bulk_valuation()` method
   - Accept list of (product_id, quantity, location_id) tuples
   - Calculate valuation for each item
   - Optimize to batch retrieve cost data
   - Use caching to avoid redundant calculations
   - Return list of valuation results

8. **Add cost layer tracking**
   - Create `get_cost_layers()` method
   - For FIFO/LIFO, track individual cost layers
   - Return list of (receipt_date, quantity, unit_cost) layers
   - Useful for detailed valuation breakdown
   - Show which purchases contribute to current value

9. **Implement cost variance analysis**
   - Create `calculate_cost_variance()` method
   - Compare different costing methods
   - Calculate variance between FIFO vs LIFO
   - Calculate variance between Average vs Standard
   - Identify products with significant variance
   - Return variance analysis results

10. **Add missing cost handling**
    - Create `handle_missing_costs()` method
    - Identify products without cost data
    - Use fallback methods (last known cost, category average)
    - Flag items using estimated costs
    - Log warnings for missing costs
    - Return list of assumptions made

### FIFO Calculation Example

```
Product: Widget A | Quantity on Hand: 100 units

Purchase History:
Date       | Qty Purchased | Unit Cost
-----------+---------------+----------
2025-10-15 | 50            | $10.00
2025-11-20 | 80            | $11.00
2025-12-10 | 60            | $12.00

FIFO Valuation (all quantities in stock):
- First 50 units @ $10.00 = $500.00
- Next 50 units @ $11.00 = $550.00
- Total 100 units = $1,050.00
- Average cost = $10.50 per unit
```

### Expected Outcome
- All four costing methods properly implemented
- Accurate calculations matching accounting standards
- Efficient bulk valuation for entire inventory
- Cost layer tracking for transparency
- Missing cost scenarios handled gracefully

### Verification Checklist
- [ ] `get_cost_data()` retrieves purchase costs
- [ ] `calculate_fifo_value()` implements FIFO correctly
- [ ] `calculate_lifo_value()` implements LIFO correctly
- [ ] `calculate_average_value()` calculates weighted average
- [ ] `calculate_standard_value()` uses standard costs
- [ ] `calculate_valuation()` orchestrates costing method selection
- [ ] `calculate_bulk_valuation()` efficiently values multiple items
- [ ] `get_cost_layers()` tracks individual receipt layers
- [ ] `calculate_cost_variance()` compares methods
- [ ] `handle_missing_costs()` provides fallback logic
- [ ] Calculations match manual verification

---

## Task 44: Add Aging and Valuation Analysis

### Overview
Implement aging analysis, valuation summaries, and analytical reporting features for the `StockValuationReport`. These features provide insights into inventory age, slow-moving items, value concentration, and financial metrics.

### Dependencies
- Task 43: Implement costing method calculations
- Stock receipt dates for aging calculations
- Movement history for turnover analysis

### Instructions

1. **Implement aging analysis**
   - Create `calculate_aging_buckets()` method
   - Define age buckets (0-30, 31-60, 61-90, 91-180, 180+ days)
   - For each stock item, determine age based on receipt date
   - Use FIFO logic to age inventory layers
   - Assign quantity to appropriate age bucket
   - Calculate value in each age bucket
   - Return aging distribution by product and total

2. **Add slow-moving identification**
   - Create `identify_slow_moving()` method
   - Calculate days of stock on hand (quantity / avg daily usage)
   - Identify items with > 90 days (or configurable threshold)
   - Flag items with no recent movements
   - Calculate value tied up in slow-moving stock
   - Return list of slow-moving items with metrics

3. **Implement obsolete stock detection**
   - Create `detect_obsolete_stock()` method
   - Identify items with no movement in X days (e.g., 180)
   - Check for discontinued products
   - Find items with zero forecast demand
   - Calculate value of potentially obsolete stock
   - Return obsolete items for review

4. **Add value concentration analysis**
   - Create `analyze_value_concentration()` method
   - Sort products by total value descending
   - Calculate cumulative percentage of total value
   - Identify top 20% products (A items - 80% of value)
   - Identify middle 30% (B items - 15% of value)
   - Identify bottom 50% (C items - 5% of value)
   - Return ABC classification results

5. **Implement turnover analysis**
   - Create `calculate_turnover_metrics()` method
   - Calculate inventory turnover ratio (COGS / Avg Inventory)
   - Calculate days sales in inventory (365 / turnover ratio)
   - Compute turnover by product category
   - Identify fast vs slow turnover items
   - Return turnover metrics

6. **Add valuation summary**
   - Create `get_valuation_summary()` method
   - Calculate total inventory value
   - Break down by location, category
   - Show value by costing method
   - Include aging buckets summary
   - Add slow-moving and obsolete value totals
   - Return comprehensive summary dictionary

7. **Implement detailed report data**
   - Create `get_detail_data()` method
   - Get current stock levels with valuation
   - Include unit costs, total values
   - Add aging information for each item
   - Include turnover metrics if available
   - Attach ABC classification
   - Return detailed line items

8. **Override generate method**
   - Override `generate()` method
   - Validate parameters
   - Calculate valuations for all stock
   - Perform aging analysis
   - Generate summaries and analytics
   - Structure complete report data
   - Return report ready for export

9. **Implement Excel export with charts**
   - Create enhanced `export_to_excel()` method
   - Include valuation summary sheet
   - Create detail sheet with all items
   - Add aging analysis sheet with chart
   - Include ABC classification sheet
   - Add pivot tables if appropriate
   - Apply conditional formatting (highlight slow movers)
   - Return formatted Excel workbook

10. **Add variance reporting**
    - Create `generate_variance_report()` method
    - Compare current valuation to prior period
    - Calculate value changes by category
    - Identify significant variances
    - Explain variance drivers (price changes, quantity changes)
    - Return variance analysis

### Aging Analysis Example

```
Stock Aging Analysis as of 2026-01-25

Product: Widget A | Total Quantity: 150 | Total Value: $1,950

Age Bucket    | Quantity | Value    | % of Value
--------------+----------+----------+-----------
0-30 days     | 60       | $780     | 40%
31-60 days    | 50       | $650     | 33%
61-90 days    | 25       | $325     | 17%
91-180 days   | 15       | $195     | 10%
180+ days     | 0        | $0       | 0%

Average Age: 52 days
Slow-Moving: No (threshold: 90 days)
```

### Expected Outcome
- Comprehensive aging analysis by product
- Slow-moving and obsolete stock identified
- ABC classification for inventory management
- Turnover metrics for performance assessment
- Rich Excel export with multiple analytical sheets

### Verification Checklist
- [ ] `calculate_aging_buckets()` correctly ages inventory
- [ ] `identify_slow_moving()` flags slow items
- [ ] `detect_obsolete_stock()` finds obsolete items
- [ ] `analyze_value_concentration()` performs ABC analysis
- [ ] `calculate_turnover_metrics()` computes ratios
- [ ] `get_valuation_summary()` provides complete summary
- [ ] `get_detail_data()` includes all analytical fields
- [ ] `generate()` method orchestrates full report creation
- [ ] Enhanced Excel export includes charts and analytics
- [ ] `generate_variance_report()` compares periods
- [ ] Aging logic matches FIFO/LIFO method selected
- [ ] All calculations are accurate and verifiable

---

## Report Integration and Testing

### Overview
After implementing all three stock reports, ensure proper integration with the broader reporting framework and conduct comprehensive testing.

### Integration Steps

1. **Register reports in report registry**
   - Add StockLevelReport to report registry
   - Add StockMovementReport to report registry
   - Add StockValuationReport to report registry
   - Ensure proper categorization

2. **Create report views/endpoints**
   - Create API endpoints for each report
   - Accept parameters via query string or POST body
   - Return report data in requested format
   - Handle errors gracefully

3. **Add to admin interface**
   - Register reports in Django admin if applicable
   - Create report scheduling interface
   - Allow users to save report templates

4. **Implement caching**
   - Cache report results for performance
   - Set appropriate cache TTL
   - Invalidate cache on stock changes

### Testing Checklist

#### StockLevelReport Testing
- [ ] Report generates with default parameters
- [ ] Location filtering works correctly
- [ ] Category filtering works correctly
- [ ] Product filtering works correctly
- [ ] Zero stock filtering functions properly
- [ ] Grouping by location produces correct aggregates
- [ ] Grouping by category produces correct aggregates
- [ ] Threshold analysis identifies reorder points
- [ ] Excel export opens without errors
- [ ] PDF export renders correctly
- [ ] CSV export includes all data
- [ ] Multi-tenancy filtering works (if applicable)
- [ ] Large datasets perform acceptably

#### StockMovementReport Testing
- [ ] Report generates for date range
- [ ] Date range validation prevents invalid ranges
- [ ] Movement type filtering works
- [ ] Location filtering works
- [ ] Product filtering works
- [ ] Opening balance calculation is accurate
- [ ] Running balance calculation is correct
- [ ] Closing balance matches actual stock
- [ ] Transfers between locations handled correctly
- [ ] Cumulative calculations are accurate
- [ ] Balance verification detects discrepancies
- [ ] Excel export includes all movements
- [ ] PDF export is readable
- [ ] CSV export is complete

#### StockValuationReport Testing
- [ ] Report generates with each costing method
- [ ] FIFO valuation matches manual calculation
- [ ] LIFO valuation matches manual calculation
- [ ] Average cost valuation is accurate
- [ ] Standard cost valuation uses correct costs
- [ ] Missing cost scenarios handled gracefully
- [ ] Aging analysis produces correct buckets
- [ ] Slow-moving identification works
- [ ] Obsolete stock detection functions
- [ ] ABC classification is logical
- [ ] Turnover metrics calculate correctly
- [ ] Excel export includes all analytical sheets
- [ ] Charts in Excel display properly
- [ ] Variance report compares periods correctly

### Performance Testing

| Scenario | Target | Metric |
|----------|--------|--------|
| Small dataset (< 1,000 items) | < 2 seconds | Report generation time |
| Medium dataset (1,000-10,000) | < 5 seconds | Report generation time |
| Large dataset (> 10,000) | < 15 seconds | Report generation time |
| Excel export | < 10 seconds | File generation time |
| PDF export | < 10 seconds | File generation time |
| Database queries | < 10 | Number of queries (with select_related) |

### Common Issues and Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| Slow queries | Missing indexes | Add indexes on foreign keys, date fields |
| Memory errors | Loading all data at once | Use pagination or iterator() |
| Incorrect balances | Movement order wrong | Ensure chronological sorting |
| Missing costs | No purchase data | Implement fallback cost logic |
| Timeout on large reports | Complex calculations | Implement async processing |
| Excel formatting broken | Invalid cell values | Validate data before export |

---

## Notes for AI Agents

### Important Context
When implementing these stock reports, AI agents should be aware of:

1. **Data Consistency**: Stock levels must remain consistent across all reports. The closing balance in StockMovementReport should match the stock level in StockLevelReport for the same date.

2. **Performance Considerations**: Stock data can grow very large. Always use database-level filtering and aggregation rather than Python-level operations on large querysets.

3. **Costing Method Implications**: Different costing methods (FIFO, LIFO, Average) can produce significantly different valuations. Ensure users understand which method they're using and why.

4. **Multi-tenancy**: If the application uses multi-tenancy, ensure all queries are properly filtered by tenant to prevent data leakage.

5. **Timezone Awareness**: Stock movements are timestamped. Ensure proper timezone handling when filtering by date ranges to avoid off-by-one errors.

### Code Organization
- Keep all three report classes in the same `stock_reports.py` file for cohesion
- Share common utility methods between reports (e.g., location filtering)
- Consider creating a `StockReportBase` class if significant code is duplicated
- Extract complex calculations into separate utility functions for testability

### Common Pitfalls to Avoid
1. **N+1 Queries**: Always use `select_related()` and `prefetch_related()` to avoid loading related objects in loops
2. **Floating Point Precision**: Use `Decimal` type for all monetary and quantity calculations to avoid rounding errors
3. **Missing Transaction Boundaries**: Wrap stock movements and level updates in database transactions to ensure consistency
4. **Stale Data**: Be aware of caching - invalidate caches when stock levels change
5. **Memory Leaks**: Use `iterator()` for very large querysets to avoid loading all data into memory

### Suggested Testing Approach
1. Create fixtures with known stock data and movements
2. Manually calculate expected results
3. Run reports and compare output to expected values
4. Test edge cases: zero stock, negative adjustments, transfers, missing costs
5. Test performance with realistic data volumes
6. Verify multi-tenancy isolation if applicable

### Integration Points
These reports integrate with:
- **Inventory Management**: Primary data source for stock levels and movements
- **Purchase Module**: Source of cost data for valuation
- **Sales Module**: Drives stock issues and COGS calculations
- **Financial Reporting**: Provides inventory asset valuation for balance sheet
- **Warehouse Management**: Uses location-based filtering extensively

### Future Enhancements
Consider these potential enhancements:
- Real-time dashboards showing current stock levels
- Automated alerts for low stock or slow-moving items
- Predictive analytics for future stock requirements
- Integration with business intelligence tools
- Mobile-friendly report views
- Scheduled report generation and email delivery
- Export to additional formats (JSON, XML for API consumers)

---

## Document Summary

This document provided comprehensive instructions for implementing stock reporting functionality covering tasks 35-44. The three main report types are:

1. **StockLevelReport (Tasks 35-38)**: Current stock quantities with flexible filtering and grouping options
2. **StockMovementReport (Tasks 39-41)**: Transaction-level movement tracking with running balance calculations
3. **StockValuationReport (Tasks 42-44)**: Financial valuation using multiple costing methods with aging and turnover analysis

Each report class follows the established `BaseReportGenerator` pattern, ensuring consistency with other reporting modules. The implementation includes proper parameter validation, efficient database queries, rich export formats (Excel, PDF, CSV), and comprehensive analytical features.

Key deliverables include query optimization for large datasets, accurate financial calculations matching accounting standards, and detailed documentation for maintenance and future enhancement.

---

**End of Document**
