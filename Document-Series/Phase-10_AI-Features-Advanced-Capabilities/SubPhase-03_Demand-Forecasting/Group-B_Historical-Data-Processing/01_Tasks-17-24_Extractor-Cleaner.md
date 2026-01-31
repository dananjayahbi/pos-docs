# Tasks 17-24: Sales Data Extraction and Cleaning

> **Phase:** 10 - AI Features & Advanced Capabilities  
> **SubPhase:** 03 - Demand Forecasting  
> **Group:** B - Historical Data Processing  
> **Document:** 01 of 02  
> **Tasks Covered:** 17, 18, 19, 20, 21, 22, 23, 24

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Group:** [Group-A_Forecasting-Models](../Group-A_Forecasting-Models/)
- **→ Next Document:** [02_Tasks-25-32_Seasonality-Trend.md](02_Tasks-25-32_Seasonality-Trend.md)

---

## Document Overview

This document covers the creation of sales data extraction and cleaning infrastructure for demand forecasting. It establishes the SalesDataExtractor class for retrieving historical sales data at various time granularities (daily, weekly, monthly), and the DataCleaner class for handling missing data, outlier detection, and data smoothing operations essential for accurate forecasting.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 17 | Create SalesDataExtractor | Medium | 45 min |
| 18 | Create get_daily_sales | Medium | 40 min |
| 19 | Create get_weekly_sales | Low | 30 min |
| 20 | Create get_monthly_sales | Low | 30 min |
| 21 | Create DataCleaner | Medium | 40 min |
| 22 | Create handle_missing | Medium | 45 min |
| 23 | Create remove_outliers | Medium | 50 min |
| 24 | Create smooth_data | Low | 30 min |

---

## Task 17: Create SalesDataExtractor

### Overview
Create the SalesDataExtractor class that serves as the foundation for retrieving historical sales data from the OrderItem model. This class provides structured access to sales history with proper tenant isolation, date range filtering, and product-specific data extraction. The extractor transforms database records into pandas DataFrames optimized for time-series analysis and forecasting operations.

### Dependencies
- Task 16: Create ForecastModel migration (Group-A)
- OrderItem model exists with tenant isolation
- Pandas library available in environment

### Instructions

1. **Create data processing module structure**
   - Navigate to `backend/apps/ai/forecasting/` directory
   - Create new subdirectory named `data`
   - Create `__init__.py` file in the data directory
   - This module handles all data extraction and processing

2. **Create extractor module file**
   - Create `extractor.py` in `forecasting/data/` directory
   - Import required dependencies (Django models, pandas, datetime)
   - Import OrderItem model from sales app
   - Import tenant utilities from django-tenants

3. **Define SalesDataExtractor class**
   - Create main class with descriptive docstring
   - Initialize class without constructor parameters
   - Plan for methods to handle different aggregation levels
   - Document class purpose and usage patterns

4. **Implement tenant-aware query methods**
   - Create private method `_get_base_queryset()`
   - Ensure proper tenant schema context
   - Apply base filters for valid orders only
   - Exclude cancelled, refunded, or test orders

5. **Add product filtering logic**
   - Create method to validate product_id parameter
   - Verify product exists and belongs to tenant
   - Handle invalid product_id gracefully
   - Return appropriate error messages

6. **Implement date range validation**
   - Create method to validate start_date and end_date
   - Ensure start_date is before end_date
   - Handle timezone conversions (Asia/Colombo)
   - Set sensible defaults (e.g., last 12 months)

7. **Add data transformation utilities**
   - Create method to convert QuerySet to DataFrame
   - Map database fields to DataFrame columns
   - Handle null values and missing data
   - Optimize data types for memory efficiency

8. **Implement caching strategy**
   - Add optional caching for frequently accessed data
   - Use Redis cache with tenant-specific keys
   - Set appropriate cache expiration (1-24 hours)
   - Implement cache invalidation on new orders

9. **Add logging and monitoring**
   - Log extraction operations with timestamps
   - Track query performance and row counts
   - Record tenant and product identifiers
   - Monitor for anomalies or slow queries

10. **Create utility methods**
    - Add method to get available date range for product
    - Implement method to check data availability
    - Create helper for data quality metrics
    - Add method to get extraction metadata

### SalesDataExtractor Class Structure

| Component | Purpose |
|-----------|---------|
| `__init__()` | Initialize extractor (minimal setup) |
| `_get_base_queryset()` | Get filtered OrderItem queryset |
| `_validate_product(product_id)` | Verify product exists |
| `_validate_dates(start, end)` | Verify date range validity |
| `_queryset_to_dataframe(qs)` | Convert queryset to pandas DataFrame |
| `get_available_range(product_id)` | Get min/max dates for product |
| `check_data_availability(product_id)` | Check if sufficient data exists |

### Base QuerySet Filters

| Filter | Purpose | Implementation |
|--------|---------|----------------|
| Tenant | Isolate tenant data | Automatic with django-tenants |
| Order Status | Valid orders only | `order__status='completed'` |
| Cancelled | Exclude cancelled | `order__is_cancelled=False` |
| Refunded | Exclude refunds | `order__is_refunded=False` |
| Date Range | Within specified period | `order__created_at__range` |
| Product | Specific product | `product_id=product_id` |

### DataFrame Structure

```
┌──────────────┬──────────┬──────────┬─────────┐
│ date         │ quantity │ revenue  │ orders  │
├──────────────┼──────────┼──────────┼─────────┤
│ 2026-01-01   │ 15       │ 15750.00 │ 8       │
│ 2026-01-02   │ 12       │ 12600.00 │ 6       │
│ 2026-01-03   │ 18       │ 18900.00 │ 9       │
└──────────────┴──────────┴──────────┴─────────┘
```

### Date Range Validation Logic

| Scenario | Behavior |
|----------|----------|
| No dates provided | Default to last 365 days |
| Only start_date | End date = today |
| Only end_date | Start date = end - 365 days |
| start > end | Raise ValueError |
| Future dates | Adjust to today |
| Invalid format | Raise ValueError |

### Caching Strategy

```
Cache Key Format:
sales_data:{tenant_id}:{product_id}:{aggregation}:{start}:{end}

Examples:
- sales_data:tenant123:prod456:daily:2026-01-01:2026-01-31
- sales_data:tenant123:prod456:weekly:2025-01-01:2026-01-31
- sales_data:tenant123:prod456:monthly:2024-01-01:2026-01-31
```

| Aggregation | Cache Duration | Rationale |
|-------------|----------------|-----------|
| Daily | 1 hour | Recent data changes frequently |
| Weekly | 6 hours | Weekly patterns more stable |
| Monthly | 24 hours | Monthly data rarely changes |

### Data Quality Metrics

| Metric | Calculation | Purpose |
|--------|-------------|---------|
| Completeness | % of dates with data | Identify gaps |
| Consistency | Check for duplicates | Data integrity |
| Range | Min/max values | Outlier detection |
| Volume | Total records | Sufficiency check |

### Expected Outcome
- Functional SalesDataExtractor class with proper structure
- Tenant-aware data extraction with security isolation
- Robust validation for products and date ranges
- DataFrame conversion with optimized data types
- Caching implementation for performance
- Comprehensive logging for monitoring

### Verification Checklist
- [ ] `backend/apps/ai/forecasting/data/extractor.py` created
- [ ] SalesDataExtractor class defined with docstrings
- [ ] Base queryset method filters by tenant and status
- [ ] Product validation method implemented
- [ ] Date range validation with timezone handling
- [ ] QuerySet to DataFrame conversion working
- [ ] Caching strategy implemented with Redis
- [ ] Logging added for all operations
- [ ] Utility methods for data availability
- [ ] Unit tests cover edge cases

---

## Task 18: Create get_daily_sales

### Overview
Implement the get_daily_sales method in SalesDataExtractor to retrieve sales data aggregated by day. This method provides daily-level granularity essential for short-term forecasting, recent trend analysis, and detecting daily patterns. It handles date-based aggregation, timezone conversions, and fills gaps in data to create a complete time series.

### Dependencies
- Task 17: Create SalesDataExtractor

### Instructions

1. **Define method signature**
   - Create method in SalesDataExtractor class
   - Parameters: product_id, start_date, end_date
   - Return type: pandas DataFrame
   - Add comprehensive docstring with examples

2. **Validate input parameters**
   - Call `_validate_product()` for product_id
   - Call `_validate_dates()` for date range
   - Ensure date range is reasonable (max 2 years for daily)
   - Handle parameter type conversions

3. **Build daily aggregation query**
   - Use Django ORM with annotations
   - Group by date (truncated to day)
   - Aggregate: Sum(quantity), Sum(revenue), Count(distinct orders)
   - Apply base filters from parent class

4. **Execute query with optimization**
   - Select only required fields
   - Use `values()` for efficient querying
   - Apply database-level date truncation
   - Order results by date ascending

5. **Convert to DataFrame**
   - Transform queryset to pandas DataFrame
   - Set date column as index
   - Ensure date column is datetime type
   - Sort by date index

6. **Fill missing dates**
   - Create complete date range from start to end
   - Reindex DataFrame with complete range
   - Fill missing values with 0 (no sales that day)
   - Maintain data type consistency

7. **Add calculated columns**
   - Average order value (revenue / orders)
   - Average quantity per order
   - Cumulative sales (running total)
   - Day of week column for analysis

8. **Handle timezone conversions**
   - Convert UTC timestamps to Asia/Colombo
   - Ensure date boundaries align with local time
   - Handle daylight saving if applicable
   - Document timezone in metadata

9. **Implement result caching**
   - Generate cache key with parameters
   - Check cache before query execution
   - Store results with appropriate TTL
   - Return cached data if available

10. **Add metadata to result**
    - Include extraction timestamp
    - Record actual date range returned
    - Add data completeness percentage
    - Include row count and aggregation level

### Method Signature

```
def get_daily_sales(
    self,
    product_id: int,
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    fill_missing: bool = True,
    include_metadata: bool = False
) -> pd.DataFrame
```

### Aggregation Query Structure

| Field | Aggregation | Purpose |
|-------|-------------|---------|
| date | TruncDay(created_at) | Group by day |
| total_quantity | Sum(quantity) | Total units sold |
| total_revenue | Sum(price * quantity) | Total sales value |
| order_count | Count(distinct order_id) | Number of orders |

### DataFrame Columns

| Column | Type | Description |
|--------|------|-------------|
| date | datetime64 | Day (index) |
| quantity | int64 | Total quantity sold |
| revenue | float64 | Total revenue (LKR) |
| orders | int64 | Number of orders |
| avg_order_value | float64 | Revenue per order |
| avg_quantity_per_order | float64 | Quantity per order |
| day_of_week | int64 | 0=Monday, 6=Sunday |
| cumulative_quantity | int64 | Running total |

### Date Filling Logic

```
Original Data:
2026-01-01: 15 units
2026-01-03: 12 units  ← Missing 2026-01-02
2026-01-04: 18 units

After Filling:
2026-01-01: 15 units
2026-01-02: 0 units   ← Filled with 0
2026-01-03: 12 units
2026-01-04: 18 units
```

### Performance Considerations

| Aspect | Optimization |
|--------|--------------|
| Query | Use select_related for related fields |
| Aggregation | Database-level grouping |
| Date Range | Limit to 2 years max for daily |
| Indexing | Ensure created_at has index |
| Caching | Cache results for 1 hour |

### Sample Output

```
DataFrame returned by get_daily_sales(product_id=123, start_date='2026-01-01', end_date='2026-01-31'):

              quantity  revenue    orders  avg_order_value  day_of_week
date                                                                    
2026-01-01    15        15750.00   8       1968.75          3
2026-01-02    12        12600.00   6       2100.00          4
2026-01-03    0         0.00       0       0.00             5
2026-01-04    18        18900.00   9       2100.00          6
...
```

### Error Handling

| Error | Handling |
|-------|----------|
| Invalid product_id | Raise ValueError with message |
| Date range > 2 years | Raise ValueError with limit |
| No data found | Return empty DataFrame with structure |
| Database error | Log and raise with context |

### Metadata Structure

```
{
    'extraction_time': '2026-01-31T10:30:00+05:30',
    'aggregation': 'daily',
    'product_id': 123,
    'start_date': '2026-01-01',
    'end_date': '2026-01-31',
    'total_days': 31,
    'days_with_data': 28,
    'completeness': 90.3,
    'total_quantity': 432,
    'total_revenue': 453600.00
}
```

### Expected Outcome
- Functional get_daily_sales method with complete aggregation
- Daily-level data with filled gaps for complete time series
- Calculated columns for enhanced analysis
- Proper timezone handling for Sri Lanka
- Cached results for performance
- Comprehensive metadata for data quality assessment

### Verification Checklist
- [ ] Method defined with proper signature and docstring
- [ ] Input validation for product and dates
- [ ] Daily aggregation query uses database-level grouping
- [ ] Timezone conversion to Asia/Colombo
- [ ] Missing dates filled with zeros
- [ ] Calculated columns added (avg_order_value, day_of_week)
- [ ] DataFrame index set to date
- [ ] Caching implemented with 1-hour TTL
- [ ] Metadata option available
- [ ] Unit tests cover various date ranges

---

## Task 19: Create get_weekly_sales

### Overview
Implement the get_weekly_sales method in SalesDataExtractor to retrieve sales data aggregated by week. This method provides weekly granularity suitable for medium-term forecasting and identifying weekly patterns. It uses ISO week format, handles week boundaries correctly, and maintains consistency with calendar weeks for accurate seasonal analysis.

### Dependencies
- Task 17: Create SalesDataExtractor

### Instructions

1. **Define method signature**
   - Create method in SalesDataExtractor class
   - Parameters: product_id, start_date, end_date
   - Return type: pandas DataFrame
   - Include optional week_start parameter (default: Monday)

2. **Implement week-based aggregation**
   - Use Django ORM TruncWeek annotation
   - Group by ISO week (year + week number)
   - Ensure week starts on Monday (ISO standard)
   - Handle year transitions correctly

3. **Aggregate weekly metrics**
   - Sum quantity sold per week
   - Sum revenue per week
   - Count distinct orders per week
   - Count days with sales in week

4. **Build complete week range**
   - Generate all weeks in date range
   - Use pandas date_range with 'W' frequency
   - Fill missing weeks with zero values
   - Maintain ISO week format

5. **Add week metadata columns**
   - Year column (ISO year)
   - Week number column (1-53)
   - Week start date column
   - Week end date column

6. **Calculate weekly statistics**
   - Average daily sales in week
   - Week-over-week growth rate
   - Percentage of yearly total
   - Cumulative weekly totals

7. **Handle partial weeks**
   - Identify weeks at date range boundaries
   - Flag partial weeks in metadata
   - Option to exclude partial weeks
   - Adjust calculations for partial data

8. **Implement caching**
   - Generate weekly-specific cache key
   - Cache duration: 6 hours
   - Include week boundaries in key
   - Invalidate on new data

9. **Add comparison features**
   - Compare with previous week
   - Compare with same week last year
   - Calculate percentage changes
   - Identify trend direction

10. **Format output for forecasting**
    - Ensure consistent week numbering
    - Index by week_start_date
    - Include sufficient historical data (52+ weeks)
    - Validate data sufficiency for forecasting

### Method Signature

```
def get_weekly_sales(
    self,
    product_id: int,
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    week_start: str = 'monday',
    include_partial: bool = True,
    min_weeks: int = 52
) -> pd.DataFrame
```

### Week Aggregation Structure

| Aggregation | Implementation | Purpose |
|-------------|----------------|---------|
| Week Start | TruncWeek(created_at) | Group by week |
| ISO Year | ExtractIsoYear | Handle year boundaries |
| ISO Week | ExtractWeek | Week number (1-53) |
| Total Quantity | Sum(quantity) | Weekly sales volume |
| Total Revenue | Sum(revenue) | Weekly sales value |

### DataFrame Columns

| Column | Type | Description |
|--------|------|-------------|
| week_start | datetime64 | Monday of week (index) |
| year | int | ISO year |
| week | int | ISO week number |
| quantity | int64 | Total units sold |
| revenue | float64 | Total revenue (LKR) |
| orders | int64 | Number of orders |
| days_with_sales | int | Days with activity |
| avg_daily_sales | float64 | Quantity / 7 |
| wow_growth | float64 | Week-over-week % change |

### ISO Week Handling

```
Example: December 2025 / January 2026 transition

2025-12-29 (Monday)    → Week 53 of 2025
2025-12-30 (Tuesday)   → Week 53 of 2025
...
2026-01-04 (Sunday)    → Week 53 of 2025
2026-01-05 (Monday)    → Week 1 of 2026
```

| Scenario | Handling |
|----------|----------|
| Year transition | Use ISO year, not calendar year |
| Week 53 | Occurs in some years, include properly |
| Partial first week | Flag and optionally exclude |
| Partial last week | Flag and optionally exclude |

### Weekly Pattern Analysis

| Metric | Calculation | Use Case |
|--------|-------------|----------|
| Avg Daily Sales | total_quantity / 7 | Smooth comparison |
| WoW Growth | (current - previous) / previous | Trend detection |
| YoY Growth | (current - same_week_last_year) / same_week_last_year | Seasonal comparison |
| Volatility | Std dev of daily sales in week | Stability measure |

### Partial Week Detection

```
Date Range: 2026-01-10 (Friday) to 2026-02-20 (Friday)

First Week: 2026-01-05 to 2026-01-11
├── In Range: 2026-01-10 to 2026-01-11 (2 days)
└── Partial: True

Last Week: 2026-02-16 to 2026-02-22
├── In Range: 2026-02-16 to 2026-02-20 (5 days)
└── Partial: True
```

### Caching Strategy

| Cache Key Component | Example |
|---------------------|---------|
| Tenant ID | tenant_123 |
| Product ID | prod_456 |
| Aggregation | weekly |
| Start Week | 2026-W01 |
| End Week | 2026-W52 |
| Include Partial | true |

### Sample Output

```
DataFrame returned by get_weekly_sales(product_id=123, start_date='2026-01-01', end_date='2026-03-31'):

              year  week  quantity  revenue     orders  days_with_sales  wow_growth
week_start                                                                          
2026-01-05    2026  1     95        99750.00    52      7                NaN
2026-01-12    2026  2     102       107100.00   56      7                7.37
2026-01-19    2026  3     88        92400.00    48      6                -13.73
2026-01-26    2026  4     115       120750.00   63      7                30.68
...
```

### Data Sufficiency Check

| Requirement | Minimum | Recommended |
|-------------|---------|-------------|
| Weeks | 52 | 104 (2 years) |
| Completeness | 80% | 95% |
| Consecutive | 26 weeks | 52 weeks |

### Expected Outcome
- Functional get_weekly_sales method with ISO week format
- Weekly aggregation with proper year transition handling
- Filled gaps for complete weekly time series
- Week-over-week and year-over-year comparisons
- Partial week detection and handling
- Cached results with 6-hour duration
- Sufficient data validation for forecasting

### Verification Checklist
- [ ] Method defined with proper signature
- [ ] Weekly aggregation uses ISO week format
- [ ] Year transitions handled correctly
- [ ] Missing weeks filled with zeros
- [ ] Week metadata columns included (year, week number)
- [ ] WoW growth calculation implemented
- [ ] Partial week detection working
- [ ] Caching implemented with 6-hour TTL
- [ ] Data sufficiency validation (min 52 weeks)
- [ ] Unit tests cover edge cases (year transitions, partial weeks)

---

## Task 20: Create get_monthly_sales

### Overview
Implement the get_monthly_sales method in SalesDataExtractor to retrieve sales data aggregated by month. This method provides monthly granularity ideal for long-term forecasting, year-over-year comparisons, and identifying seasonal patterns. It handles month boundaries, fiscal periods, and provides comprehensive monthly statistics for trend analysis.

### Dependencies
- Task 17: Create SalesDataExtractor

### Instructions

1. **Define method signature**
   - Create method in SalesDataExtractor class
   - Parameters: product_id, start_date, end_date
   - Return type: pandas DataFrame
   - Add fiscal_year parameter for alternative calendars

2. **Implement monthly aggregation**
   - Use Django ORM TruncMonth annotation
   - Group by year and month
   - Handle timezone for month boundaries
   - Ensure first day of month alignment

3. **Aggregate monthly metrics**
   - Sum total quantity per month
   - Sum total revenue per month
   - Count distinct orders per month
   - Count active sales days per month

4. **Build complete month range**
   - Generate all months in date range
   - Use pandas period_range with 'M' frequency
   - Fill missing months with zero values
   - Maintain chronological order

5. **Add month metadata**
   - Year column
   - Month number (1-12)
   - Month name (January, February, etc.)
   - Quarter (Q1, Q2, Q3, Q4)
   - Fiscal period if applicable

6. **Calculate monthly statistics**
   - Average daily sales in month
   - Month-over-month growth rate
   - Year-over-year comparison
   - Percentage contribution to year

7. **Handle partial months**
   - Detect partial months at boundaries
   - Flag in is_complete column
   - Calculate pro-rated projections
   - Option to exclude partial months

8. **Add seasonal indicators**
   - Festival months (Sinhala New Year, Christmas)
   - Holiday density per month
   - Seasonal category (high/medium/low)
   - Previous year comparison

9. **Implement caching**
   - Generate monthly cache key
   - Cache duration: 24 hours (more stable)
   - Include month range in key
   - Refresh on month-end

10. **Format for forecasting models**
    - Ensure minimum 12 months of data
    - Validate data completeness
    - Structure for seasonal decomposition
    - Include confidence metrics

### Method Signature

```
def get_monthly_sales(
    self,
    product_id: int,
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    fiscal_year_start: int = 1,
    include_partial: bool = True,
    min_months: int = 12
) -> pd.DataFrame
```

### Monthly Aggregation Structure

| Aggregation | Implementation | Purpose |
|-------------|----------------|---------|
| Month Start | TruncMonth(created_at) | Group by month |
| Year | ExtractYear | Year identifier |
| Month | ExtractMonth | Month number |
| Quantity | Sum(quantity) | Monthly volume |
| Revenue | Sum(revenue) | Monthly sales value |

### DataFrame Columns

| Column | Type | Description |
|--------|------|-------------|
| month_start | datetime64 | First day of month (index) |
| year | int | Calendar year |
| month | int | Month number (1-12) |
| month_name | str | Month name |
| quarter | str | Quarter (Q1-Q4) |
| quantity | int64 | Total units sold |
| revenue | float64 | Total revenue (LKR) |
| orders | int64 | Number of orders |
| active_days | int | Days with sales |
| avg_daily_sales | float64 | Quantity / days_in_month |
| mom_growth | float64 | Month-over-month % |
| yoy_growth | float64 | Year-over-year % |
| is_complete | bool | Full month data |

### Quarter Assignment

| Month | Quarter | Fiscal Quarter (Apr start) |
|-------|---------|---------------------------|
| Jan | Q1 | Q4 |
| Feb | Q1 | Q4 |
| Mar | Q1 | Q4 |
| Apr | Q2 | Q1 |
| May | Q2 | Q1 |
| Jun | Q2 | Q1 |
| Jul | Q3 | Q2 |
| Aug | Q3 | Q2 |
| Sep | Q3 | Q2 |
| Oct | Q4 | Q3 |
| Nov | Q4 | Q3 |
| Dec | Q4 | Q3 |

### Partial Month Handling

```
Date Range: 2026-01-15 to 2026-03-20

January 2026:
├── Days in Month: 31
├── Days in Range: 17 (15th to 31st)
├── Completeness: 54.8%
└── is_complete: False

February 2026:
├── Days in Month: 28
├── Days in Range: 28 (all)
├── Completeness: 100%
└── is_complete: True

March 2026:
├── Days in Month: 31
├── Days in Range: 20 (1st to 20th)
├── Completeness: 64.5%
└── is_complete: False
```

### Seasonal Indicators

| Month | Festivals | Category | Notes |
|-------|-----------|----------|-------|
| January | Thai Pongal | Medium | Post-holiday |
| February | Independence Day | Low | Regular |
| March | - | Low | Regular |
| April | Sinhala New Year | High | Major festival |
| May | Vesak | High | Buddhist festival |
| June | Poson | Medium | Buddhist festival |
| July | - | Low | Regular |
| August | - | Low | Regular |
| September | - | Low | Regular |
| October | - | Medium | Pre-festival prep |
| November | - | Medium | Pre-holiday |
| December | Christmas | High | Holiday season |

### Month-over-Month Growth

```
MoM Growth = ((Current Month - Previous Month) / Previous Month) × 100

Example:
January 2026: 450 units
February 2026: 520 units
MoM Growth = ((520 - 450) / 450) × 100 = 15.56%
```

### Year-over-Year Comparison

```
YoY Growth = ((Current Month - Same Month Last Year) / Same Month Last Year) × 100

Example:
January 2025: 420 units
January 2026: 450 units
YoY Growth = ((450 - 420) / 420) × 100 = 7.14%
```

### Sample Output

```
DataFrame returned by get_monthly_sales(product_id=123, start_date='2025-01-01', end_date='2026-03-31'):

              year  month  month_name  quarter  quantity  revenue      mom_growth  yoy_growth
month_start                                                                                   
2025-01-01    2025  1      January     Q1       420       441000.00    NaN         NaN
2025-02-01    2025  2      February    Q1       385       404250.00    -8.33       NaN
2025-03-01    2025  3      March       Q1       410       430500.00    6.49        NaN
...
2026-01-01    2026  1      January     Q1       450       472500.00    8.11        7.14
2026-02-01    2026  2      February    Q1       520       546000.00    15.56       35.06
2026-03-01    2026  3      March       Q1       485       509250.00    -6.73       18.29
```

### Data Sufficiency Requirements

| Aspect | Minimum | Recommended |
|--------|---------|-------------|
| Total Months | 12 | 24 (2 years) |
| Complete Months | 10 | 20 |
| Consecutive | 6 months | 12 months |
| Completeness | 75% | 90% |

### Caching Configuration

| Parameter | Value | Rationale |
|-----------|-------|-----------|
| TTL | 24 hours | Monthly data stable |
| Key Pattern | `sales_monthly:{tenant}:{product}:{start}:{end}` | Unique identification |
| Invalidation | On month change | Keep current data fresh |

### Expected Outcome
- Functional get_monthly_sales method with complete aggregation
- Monthly data with proper year and quarter assignment
- Growth calculations (MoM and YoY)
- Seasonal indicators for Sri Lankan festivals
- Partial month detection and handling
- Cached results with 24-hour duration
- Data sufficiency validation for forecasting

### Verification Checklist
- [ ] Method defined with proper signature and docstring
- [ ] Monthly aggregation with first-day-of-month alignment
- [ ] Missing months filled with zeros
- [ ] Month metadata columns (year, month, quarter, month_name)
- [ ] MoM and YoY growth calculations
- [ ] Seasonal indicators for Sri Lankan festivals
- [ ] Partial month detection and flagging
- [ ] Caching implemented with 24-hour TTL
- [ ] Data sufficiency validation (min 12 months)
- [ ] Unit tests cover various scenarios

---

## Task 21: Create DataCleaner

### Overview
Create the DataCleaner class that provides data cleaning and preprocessing functionality for sales time series data. This class handles common data quality issues including missing values, outliers, and noise that can negatively impact forecasting accuracy. It provides configurable cleaning strategies optimized for different data characteristics and forecasting requirements.

### Dependencies
- Task 20: Create get_monthly_sales

### Instructions

1. **Create cleaner module file**
   - Create `cleaner.py` in `forecasting/data/` directory
   - Import required dependencies (pandas, numpy, scipy)
   - Import statistical utilities
   - Add comprehensive module docstring

2. **Define DataCleaner class**
   - Create main class with initialization
   - Accept configuration parameters in constructor
   - Store default cleaning strategies
   - Document all cleaning methods

3. **Initialize cleaning configuration**
   - Define default imputation method
   - Set outlier detection thresholds
   - Configure smoothing parameters
   - Allow custom configuration override

4. **Create data validation method**
   - Verify DataFrame structure and columns
   - Check for required columns (date, quantity)
   - Validate data types
   - Ensure chronological ordering

5. **Implement data quality assessment**
   - Calculate missing data percentage
   - Identify outlier count and percentage
   - Measure data volatility
   - Generate quality score (0-100)

6. **Add missing data detection**
   - Identify missing dates in sequence
   - Calculate gap sizes (consecutive missing)
   - Classify gaps by severity
   - Report missing data statistics

7. **Create preprocessing utilities**
   - Method to reset index if needed
   - Method to sort by date
   - Method to handle duplicate dates
   - Method to convert data types

8. **Implement logging framework**
   - Log cleaning operations performed
   - Track before/after statistics
   - Record configuration used
   - Save cleaning metadata

9. **Add statistical helpers**
   - Calculate descriptive statistics
   - Compute percentiles for thresholds
   - Generate distribution metrics
   - Identify data characteristics

10. **Create quality report generator**
    - Generate comprehensive data quality report
    - Include visualizable metrics
    - Provide cleaning recommendations
    - Output structured report format

### DataCleaner Class Structure

| Component | Purpose |
|-----------|---------|
| `__init__(config)` | Initialize with configuration |
| `validate_data(df)` | Verify DataFrame structure |
| `assess_quality(df)` | Generate quality metrics |
| `detect_missing(df)` | Identify missing data |
| `get_statistics(df)` | Calculate descriptive stats |
| `generate_report(df)` | Create quality report |

### Configuration Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| missing_strategy | str | 'interpolate' | Method for handling missing data |
| outlier_method | str | 'iqr' | Outlier detection method |
| outlier_threshold | float | 1.5 | Multiplier for outlier bounds |
| smoothing_window | int | 7 | Window size for smoothing |
| min_data_points | int | 30 | Minimum required data points |
| quality_threshold | float | 0.7 | Minimum acceptable quality score |

### Data Quality Metrics

| Metric | Calculation | Good Threshold |
|--------|-------------|----------------|
| Completeness | (non-null / total) × 100 | > 95% |
| Consistency | (non-duplicate / total) × 100 | 100% |
| Outlier Rate | (outliers / total) × 100 | < 5% |
| Volatility | Coefficient of variation | < 1.0 |
| Quality Score | Weighted average of above | > 70 |

### Missing Data Classification

| Gap Size | Classification | Recommended Strategy |
|----------|----------------|---------------------|
| 1-2 days | Small | Linear interpolation |
| 3-7 days | Medium | Forward fill |
| 8-14 days | Large | Mean/median imputation |
| > 14 days | Critical | Manual review required |

### Data Quality Assessment

```
Quality Score Calculation:

Quality Score = (
    0.35 × Completeness +
    0.25 × Consistency +
    0.20 × (100 - OutlierRate) +
    0.20 × Stability
)

Example:
├── Completeness: 92% → 92 points
├── Consistency: 100% → 100 points
├── Outlier Rate: 3% → 97 points
├── Stability: 85% → 85 points
└── Quality Score: 93.35
```

### Quality Score Interpretation

| Score Range | Rating | Action Required |
|-------------|--------|-----------------|
| 90-100 | Excellent | No action needed |
| 80-89 | Good | Minor cleaning |
| 70-79 | Fair | Moderate cleaning |
| 60-69 | Poor | Extensive cleaning |
| < 60 | Critical | Review data source |

### Missing Data Detection

```
Time Series: 2026-01-01 to 2026-01-10

Date         Value    Status
2026-01-01   15       Present
2026-01-02   NaN      Missing ← Gap 1 start
2026-01-03   NaN      Missing ← Gap 1 (2 days)
2026-01-04   12       Present
2026-01-05   18       Present
2026-01-06   NaN      Missing ← Gap 2 (1 day)
2026-01-07   20       Present
2026-01-08   NaN      Missing ← Gap 3 start
2026-01-09   NaN      Missing ← Gap 3 (2 days)
2026-01-10   22       Present

Missing Summary:
├── Total Missing: 5 days (50%)
├── Gap Count: 3
├── Largest Gap: 2 days
└── Recommendation: Interpolate
```

### Statistical Metrics

| Statistic | Purpose | Use Case |
|-----------|---------|----------|
| Mean | Central tendency | Baseline comparison |
| Median | Robust center | Outlier-resistant |
| Std Dev | Variability | Volatility measure |
| CV | Relative variability | Cross-product comparison |
| Skewness | Distribution shape | Normality check |
| Kurtosis | Tail heaviness | Extreme value detection |

### Quality Report Structure

```
{
    "product_id": 123,
    "date_range": {
        "start": "2026-01-01",
        "end": "2026-12-31",
        "total_days": 365
    },
    "completeness": {
        "total_points": 365,
        "present": 350,
        "missing": 15,
        "percentage": 95.89
    },
    "missing_analysis": {
        "gap_count": 5,
        "max_gap": 3,
        "small_gaps": 3,
        "medium_gaps": 2,
        "large_gaps": 0
    },
    "outliers": {
        "count": 8,
        "percentage": 2.29,
        "method": "iqr",
        "threshold": 1.5
    },
    "statistics": {
        "mean": 125.5,
        "median": 120.0,
        "std": 35.2,
        "cv": 0.28,
        "min": 45,
        "max": 280
    },
    "quality_score": 92.5,
    "rating": "Excellent",
    "recommendations": [
        "Minor interpolation needed for 5 gaps",
        "Consider reviewing 8 outlier points"
    ]
}
```

### Expected Outcome
- Functional DataCleaner class with configuration support
- Comprehensive data validation and quality assessment
- Missing data detection with gap classification
- Statistical analysis utilities
- Quality report generation with actionable insights
- Configurable cleaning strategies for different scenarios

### Verification Checklist
- [ ] `backend/apps/ai/forecasting/data/cleaner.py` created
- [ ] DataCleaner class defined with initialization
- [ ] Configuration parameters accepted and stored
- [ ] Data validation method checks structure
- [ ] Quality assessment calculates metrics
- [ ] Missing data detection identifies gaps
- [ ] Statistical helpers implemented
- [ ] Quality report generation working
- [ ] Logging framework in place
- [ ] Unit tests cover various data quality scenarios

---

## Task 22: Create handle_missing

### Overview
Implement the handle_missing method in DataCleaner to handle missing values in sales time series data. This method provides intelligent imputation strategies based on gap size and data characteristics, ensuring complete time series suitable for forecasting while maintaining data integrity and statistical validity.

### Dependencies
- Task 21: Create DataCleaner

### Instructions

1. **Define method signature**
   - Create method in DataCleaner class
   - Parameters: df (DataFrame), strategy (optional), validate (bool)
   - Return type: pandas DataFrame
   - Add comprehensive docstring

2. **Validate input data**
   - Check DataFrame structure and required columns
   - Ensure date index or date column exists
   - Verify data is sorted chronologically
   - Handle edge cases (empty DataFrame, no missing data)

3. **Detect missing values**
   - Identify NaN values in quantity column
   - Identify missing dates in time series
   - Calculate gap sizes and locations
   - Generate missing data statistics

4. **Implement interpolation strategy**
   - For small gaps (1-2 days): linear interpolation
   - Preserve trend between known points
   - Use pandas interpolate() method
   - Validate interpolated values are reasonable

5. **Implement forward fill strategy**
   - For medium gaps (3-7 days): forward fill
   - Carry last known value forward
   - Use pandas ffill() method
   - Apply maximum gap limit

6. **Implement mean imputation**
   - For larger gaps (8-14 days): use mean
   - Calculate mean from surrounding window
   - Use rolling mean or global mean
   - Consider seasonal patterns if available

7. **Add custom imputation methods**
   - Median imputation option
   - Backward fill option
   - Zero fill option (for true zero sales)
   - Weighted average option

8. **Implement hybrid strategy**
   - Apply different methods based on gap size
   - Small gaps: interpolate
   - Medium gaps: forward fill
   - Large gaps: mean imputation
   - Log strategy used for each gap

9. **Validate imputed values**
   - Ensure no negative values created
   - Check values are within reasonable range
   - Validate data type consistency
   - Round to appropriate precision (integers for quantity)

10. **Add metadata tracking**
    - Flag imputed values in separate column
    - Record imputation method used
    - Count total values imputed
    - Generate imputation report

### Method Signature

```
def handle_missing(
    self,
    df: pd.DataFrame,
    strategy: str = 'auto',
    max_gap: Optional[int] = 14,
    validate: bool = True
) -> pd.DataFrame
```

### Strategy Options

| Strategy | Description | Best For |
|----------|-------------|----------|
| auto | Gap-size-based selection | General use |
| interpolate | Linear interpolation | Short gaps |
| ffill | Forward fill | Medium gaps |
| bfill | Backward fill | End gaps |
| mean | Mean imputation | Long gaps |
| median | Median imputation | Skewed data |
| zero | Fill with zeros | True zero sales |
| drop | Remove missing rows | Limited data loss |

### Gap-Based Strategy Selection (Auto Mode)

```
Gap Analysis and Strategy Selection:

Gap Size: 1-2 days
├── Strategy: Linear Interpolation
├── Rationale: Preserve trend
└── Example: [10, NaN, 14] → [10, 12, 14]

Gap Size: 3-7 days
├── Strategy: Forward Fill
├── Rationale: Recent value relevant
└── Example: [10, NaN, NaN, NaN] → [10, 10, 10, 10]

Gap Size: 8-14 days
├── Strategy: Mean Imputation
├── Rationale: Reduce bias
└── Example: [10, NaN, NaN, 20] → [10, 15, 15, 20]

Gap Size: > 14 days
├── Strategy: Warning + Manual Review
├── Rationale: Too large to impute reliably
└── Action: Return None or raise exception
```

### Linear Interpolation Example

```
Original Data:
Date         Quantity
2026-01-01   15
2026-01-02   NaN
2026-01-03   NaN
2026-01-04   21

After Interpolation:
Date         Quantity  Imputed
2026-01-01   15        False
2026-01-02   17        True   ← (15 + 21) / 2 = 18, but linear: 15 + (21-15)/3*1
2026-01-03   19        True   ← 15 + (21-15)/3*2
2026-01-04   21        False

Calculation:
├── Gap: 2 days between known values
├── Slope: (21 - 15) / 3 = 2 per day
├── Day 2: 15 + 2×1 = 17
└── Day 3: 15 + 2×2 = 19
```

### Forward Fill Example

```
Original Data:
Date         Quantity
2026-01-01   15
2026-01-02   NaN
2026-01-03   NaN
2026-01-04   NaN
2026-01-05   NaN
2026-01-06   NaN
2026-01-07   12

After Forward Fill (max_gap=5):
Date         Quantity  Imputed
2026-01-01   15        False
2026-01-02   15        True
2026-01-03   15        True
2026-01-04   15        True
2026-01-05   15        True
2026-01-06   NaN       False  ← Exceeds max_gap
2026-01-07   12        False
```

### Mean Imputation Example

```
Original Data (with context):
Date         Quantity
2026-01-01   12
2026-01-02   15
2026-01-03   NaN
2026-01-04   NaN
2026-01-05   18
2026-01-06   14

After Mean Imputation (window=3):
Date         Quantity  Imputed  Method
2026-01-01   12        False    -
2026-01-02   15        False    -
2026-01-03   14.75     True     Rolling mean [12,15,18,14]
2026-01-04   14.75     True     Rolling mean [12,15,18,14]
2026-01-05   18        False    -
2026-01-06   14        False    -

Mean Calculation:
└── Mean of [12, 15, 18, 14] = 14.75
```

### Validation Rules

| Check | Condition | Action |
|-------|-----------|--------|
| Negative Values | value < 0 | Set to 0 |
| Extreme Values | value > 3× std | Cap to threshold |
| Non-Integer | Quantity not int | Round to nearest integer |
| Data Type | Not numeric | Skip or convert |

### Imputation Metadata

```
DataFrame columns after imputation:

Original columns:
├── date
├── quantity
└── revenue

Added columns:
├── quantity_imputed (bool)
├── imputation_method (str)
└── original_quantity (float, NaN if imputed)

Example row:
{
    "date": "2026-01-03",
    "quantity": 17,
    "revenue": 17850.00,
    "quantity_imputed": True,
    "imputation_method": "interpolate",
    "original_quantity": NaN
}
```

### Imputation Report

```
{
    "total_values": 365,
    "missing_before": 15,
    "missing_after": 0,
    "imputed_count": 15,
    "methods_used": {
        "interpolate": 8,
        "ffill": 5,
        "mean": 2
    },
    "gaps_filled": {
        "small": 4,
        "medium": 2,
        "large": 1
    },
    "validation": {
        "negatives_corrected": 0,
        "extremes_capped": 1,
        "values_rounded": 15
    }
}
```

### Expected Outcome
- Functional handle_missing method with multiple strategies
- Automatic strategy selection based on gap size
- Linear interpolation for short gaps preserving trends
- Forward fill for medium gaps maintaining recent values
- Mean imputation for longer gaps reducing bias
- Validation ensuring reasonable imputed values
- Metadata tracking imputed values and methods
- Comprehensive imputation report

### Verification Checklist
- [ ] Method defined with proper signature and docstring
- [ ] Input validation for DataFrame structure
- [ ] Missing value detection for NaN and date gaps
- [ ] Linear interpolation implemented correctly
- [ ] Forward fill with max_gap limit working
- [ ] Mean imputation with window calculation
- [ ] Auto strategy selects appropriate method by gap size
- [ ] Validation rules applied to imputed values
- [ ] Metadata columns added for tracking
- [ ] Imputation report generated
- [ ] Unit tests cover all strategies and edge cases

---

## Task 23: Create remove_outliers

### Overview
Implement the remove_outliers method in DataCleaner to identify and handle outliers in sales data. This method provides multiple outlier detection algorithms (IQR, Z-score, Modified Z-score) and handling strategies (remove, cap, flag) to improve data quality and forecasting accuracy while preserving legitimate sales spikes.

### Dependencies
- Task 22: Create handle_missing

### Instructions

1. **Define method signature**
   - Create method in DataCleaner class
   - Parameters: df, method, action, threshold
   - Return type: pandas DataFrame
   - Support multiple detection and action strategies

2. **Implement IQR method**
   - Calculate Q1 (25th percentile) and Q3 (75th percentile)
   - Calculate Interquartile Range (IQR = Q3 - Q1)
   - Define bounds: [Q1 - k×IQR, Q3 + k×IQR]
   - Default k = 1.5 (standard), k = 3.0 (extreme)

3. **Implement Z-score method**
   - Calculate mean and standard deviation
   - Compute Z-score for each value: z = (x - mean) / std
   - Flag values where |z| > threshold
   - Default threshold = 3.0 (3 standard deviations)

4. **Implement Modified Z-score**
   - Use median instead of mean (robust to outliers)
   - Calculate MAD (Median Absolute Deviation)
   - Compute modified Z: M = 0.6745 × (x - median) / MAD
   - Flag values where |M| > threshold (default 3.5)

5. **Add domain-specific detection**
   - Consider business rules (max daily capacity)
   - Account for promotional periods (expected spikes)
   - Use historical patterns (typical range)
   - Implement whitelist for known legitimate spikes

6. **Implement removal action**
   - Remove outlier rows from DataFrame
   - Log removed values and dates
   - Calculate impact on dataset
   - Provide summary statistics

7. **Implement capping action**
   - Replace outliers with boundary values
   - Lower bound for low outliers
   - Upper bound for high outliers
   - Preserve data volume while reducing extremes

8. **Implement flagging action**
   - Add is_outlier boolean column
   - Add outlier_score numeric column
   - Preserve original values
   - Allow downstream decision-making

9. **Add validation and safety checks**
   - Ensure outlier rate is reasonable (< 10%)
   - Warn if too many values flagged
   - Validate bounds are sensible
   - Check for data distribution issues

10. **Generate outlier report**
    - List detected outliers with dates and values
    - Show detection method and thresholds
    - Include statistical summary
    - Provide action taken and impact

### Method Signature

```
def remove_outliers(
    self,
    df: pd.DataFrame,
    method: str = 'iqr',
    action: str = 'cap',
    threshold: Optional[float] = None,
    protect_spikes: bool = True
) -> pd.DataFrame
```

### Detection Methods

| Method | Formula | Threshold | Best For |
|--------|---------|-----------|----------|
| IQR | [Q1-k×IQR, Q3+k×IQR] | k=1.5 | General use |
| Z-score | \|z\| = \|(x-μ)/σ\| | 3.0 | Normal distribution |
| Modified Z | \|M\| = \|0.6745(x-median)/MAD\| | 3.5 | Skewed data |
| Percentile | [P2.5, P97.5] | N/A | Non-parametric |

### IQR Method Details

```
IQR Outlier Detection:

Data: [10, 12, 15, 18, 20, 22, 25, 28, 30, 150]

Step 1: Calculate Quartiles
├── Q1 (25%): 15
├── Q3 (75%): 28
└── IQR: 28 - 15 = 13

Step 2: Calculate Bounds
├── Lower: Q1 - 1.5×IQR = 15 - 1.5×13 = -4.5
└── Upper: Q3 + 1.5×IQR = 28 + 1.5×13 = 47.5

Step 3: Identify Outliers
├── Values < -4.5: None
├── Values > 47.5: 150
└── Outliers: [150]
```

### Z-Score Method Example

```
Z-Score Outlier Detection:

Data: [10, 12, 15, 18, 20, 22, 25, 28, 30, 150]

Step 1: Calculate Statistics
├── Mean (μ): 33.0
└── Std Dev (σ): 41.2

Step 2: Calculate Z-Scores
Value  Z-Score  Outlier?
10     -0.56    No
12     -0.51    No
15     -0.44    No
18     -0.36    No
20     -0.32    No
22     -0.27    No
25     -0.19    No
28     -0.12    No
30     -0.07    No
150    2.84     No (< 3.0)

Note: Z-score less effective with single extreme outlier
      due to influence on mean and std dev
```

### Modified Z-Score Example

```
Modified Z-Score (Robust):

Data: [10, 12, 15, 18, 20, 22, 25, 28, 30, 150]

Step 1: Calculate Robust Statistics
├── Median: 21
└── MAD: median(|x - median|) = 8

Step 2: Calculate Modified Z-Scores
Value  M-Score  Outlier? (threshold=3.5)
10     -0.93    No
12     -0.76    No
15     -0.51    No
18     -0.25    No
20     -0.08    No
22     0.08     No
25     0.34     No
28     0.59     No
30     0.76     No
150    10.92    Yes (> 3.5)

More robust: Outlier detected despite single extreme value
```

### Action Strategies

| Action | Description | Use Case |
|--------|-------------|----------|
| remove | Delete outlier rows | Clean training data |
| cap | Replace with boundary value | Preserve volume |
| flag | Mark but keep original | Manual review |
| winsorize | Replace with percentile | Statistical analysis |

### Capping Example

```
Original Data with Outlier:
Date         Quantity  IQR_Bounds
2026-01-01   15        [5, 35]
2026-01-02   18        [5, 35]
2026-01-03   150       [5, 35]  ← Outlier
2026-01-04   20        [5, 35]

After Capping (action='cap'):
Date         Quantity  Original  Capped
2026-01-01   15        15        False
2026-01-02   18        18        False
2026-01-03   35        150       True  ← Capped to upper bound
2026-01-04   20        20        False
```

### Spike Protection

| Scenario | Detection | Protection |
|----------|-----------|------------|
| Festival Period | Calendar check | Whitelist dates |
| Flash Sale | Event log | Exclude from outliers |
| New Product Launch | Product age < 30 days | Higher tolerance |
| Seasonal Peak | Historical pattern | Adjusted bounds |

### Outlier Report Structure

```
{
    "detection": {
        "method": "iqr",
        "threshold": 1.5,
        "total_checked": 365,
        "outliers_found": 8
    },
    "statistics": {
        "outlier_percentage": 2.19,
        "lower_bound": 5,
        "upper_bound": 35,
        "mean": 18.5,
        "median": 17.0,
        "q1": 12.0,
        "q3": 25.0,
        "iqr": 13.0
    },
    "outliers": [
        {
            "date": "2026-01-15",
            "value": 150,
            "score": 8.85,
            "action": "capped",
            "new_value": 35,
            "protected": false
        },
        // ... more outliers
    ],
    "action_summary": {
        "action_type": "cap",
        "values_modified": 8,
        "values_removed": 0,
        "protected_spikes": 2
    },
    "recommendations": [
        "Outlier rate within acceptable range",
        "Consider investigating spike on 2026-01-15"
    ]
}
```

### Safety Checks

| Check | Threshold | Action |
|-------|-----------|--------|
| High Outlier Rate | > 10% | Warning, review method |
| All Values Flagged | 100% | Error, invalid method |
| Invalid Bounds | Lower > Upper | Error, check data |
| Insufficient Data | < 30 points | Warning, skip detection |

### Expected Outcome
- Functional remove_outliers method with multiple detection algorithms
- IQR method for robust general outlier detection
- Z-score and Modified Z-score for statistical detection
- Multiple action strategies (remove, cap, flag)
- Spike protection for legitimate sales events
- Comprehensive outlier report with details
- Validation ensuring reasonable outlier rates

### Verification Checklist
- [ ] Method defined with proper signature and docstring
- [ ] IQR method implemented with configurable k
- [ ] Z-score method with mean and standard deviation
- [ ] Modified Z-score using median and MAD
- [ ] Remove action deletes outlier rows
- [ ] Cap action replaces with boundary values
- [ ] Flag action adds metadata columns
- [ ] Spike protection for known events
- [ ] Safety checks for outlier rate and data volume
- [ ] Outlier report generated with details
- [ ] Unit tests cover all methods and actions

---

## Task 24: Create smooth_data

### Overview
Implement the smooth_data method in DataCleaner to reduce noise and volatility in sales time series data through moving average smoothing. This method provides multiple smoothing techniques (simple, weighted, exponential) optimized for different data characteristics and forecasting horizons, improving signal-to-noise ratio while preserving important trends.

### Dependencies
- Task 23: Create remove_outliers

### Instructions

1. **Define method signature**
   - Create method in DataCleaner class
   - Parameters: df, method, window, min_periods
   - Return type: pandas DataFrame
   - Support multiple smoothing algorithms

2. **Implement simple moving average (SMA)**
   - Calculate rolling mean over window
   - Equal weight for all values in window
   - Use pandas rolling().mean()
   - Default window: 7 days

3. **Implement weighted moving average (WMA)**
   - Apply linear weights (recent data weighted higher)
   - Weights: [1, 2, 3, ..., n] for window n
   - Normalize weights to sum to 1
   - More responsive to recent changes

4. **Implement exponential moving average (EMA)**
   - Apply exponential decay weights
   - Recent values weighted significantly higher
   - Smoothing factor: α = 2/(window + 1)
   - Use pandas ewm() method

5. **Add adaptive window sizing**
   - Adjust window based on data frequency
   - Daily data: 7-day window
   - Weekly data: 4-week window
   - Monthly data: 3-month window
   - Auto-detect appropriate window

6. **Implement centered smoothing**
   - Center window for symmetric smoothing
   - Use future and past values equally
   - Only for historical analysis (not forecasting)
   - Provide option to disable for real-time use

7. **Handle edge effects**
   - Implement min_periods parameter
   - Allow partial window calculations at edges
   - Provide padding options (repeat, reflect, constant)
   - Document edge behavior clearly

8. **Add smoothing strength control**
   - Provide preset levels (light, medium, strong)
   - Map to appropriate window sizes
   - Allow custom window override
   - Balance smoothing vs responsiveness

9. **Preserve trend characteristics**
   - Validate smoothing doesn't remove trends
   - Compare smoothed vs original trend
   - Ensure seasonal patterns preserved
   - Add correlation metric

10. **Generate smoothing metadata**
    - Record smoothing method and parameters
    - Calculate smoothness improvement metric
    - Compare volatility before/after
    - Provide visualization-ready data

### Method Signature

```
def smooth_data(
    self,
    df: pd.DataFrame,
    method: str = 'sma',
    window: Optional[int] = None,
    min_periods: Optional[int] = 1,
    center: bool = False
) -> pd.DataFrame
```

### Smoothing Methods

| Method | Algorithm | Responsiveness | Smoothness | Best For |
|--------|-----------|----------------|------------|----------|
| SMA | Equal weights | Medium | Medium | General use |
| WMA | Linear weights | Medium-High | Medium | Trend following |
| EMA | Exponential weights | High | Light-Medium | Recent emphasis |
| Savitzky-Golay | Polynomial fit | Low | High | Preserving features |

### Simple Moving Average (SMA)

```
SMA Calculation (window=3):

Date         Original  Calculation              SMA
2026-01-01   10        -                        NaN
2026-01-02   12        -                        NaN
2026-01-03   15        (10+12+15)/3             12.33
2026-01-04   18        (12+15+18)/3             15.00
2026-01-05   20        (15+18+20)/3             17.67
2026-01-06   22        (18+20+22)/3             20.00

Formula: SMA_t = (x_{t-n+1} + ... + x_t) / n
```

### Weighted Moving Average (WMA)

```
WMA Calculation (window=3):

Weights: [1, 2, 3] (normalized: [0.167, 0.333, 0.500])

Date         Original  Calculation                      WMA
2026-01-01   10        -                                NaN
2026-01-02   12        -                                NaN
2026-01-03   15        (10×1 + 12×2 + 15×3)/(1+2+3)   13.33
2026-01-04   18        (12×1 + 15×2 + 18×3)/(1+2+3)   16.00
2026-01-05   20        (15×1 + 18×2 + 20×3)/(1+2+3)   18.50
2026-01-06   22        (18×1 + 20×2 + 22×3)/(1+2+3)   20.67

Formula: WMA_t = Σ(w_i × x_{t-n+i}) / Σ(w_i)
         where w_i = i (linear increasing weights)
```

### Exponential Moving Average (EMA)

```
EMA Calculation (window=3, α=0.5):

Smoothing factor: α = 2/(window+1) = 2/(3+1) = 0.5

Date         Original  Calculation                    EMA
2026-01-01   10        10                             10.00
2026-01-02   12        0.5×12 + 0.5×10               11.00
2026-01-03   15        0.5×15 + 0.5×11               13.00
2026-01-04   18        0.5×18 + 0.5×13               15.50
2026-01-05   20        0.5×20 + 0.5×15.5             17.75
2026-01-06   22        0.5×22 + 0.5×17.75            19.88

Formula: EMA_t = α × x_t + (1-α) × EMA_{t-1}
```

### Adaptive Window Sizing

| Data Frequency | Default Window | Preset Levels |
|----------------|----------------|---------------|
| Daily | 7 days | Light=3, Medium=7, Strong=14 |
| Weekly | 4 weeks | Light=2, Medium=4, Strong=8 |
| Monthly | 3 months | Light=2, Medium=3, Strong=6 |

### Centered vs Forward Smoothing

```
Forward Smoothing (Real-time):
2026-01-03: Uses [01, 02, 03] ← Only past + current
2026-01-04: Uses [02, 03, 04]
2026-01-05: Uses [03, 04, 05]

Centered Smoothing (Historical Analysis):
2026-01-03: Uses [02, 03, 04] ← Past + current + future
2026-01-04: Uses [03, 04, 05]
2026-01-05: Uses [04, 05, 06]
```

| Mode | Use Case | Limitation |
|------|----------|------------|
| Forward | Real-time forecasting | Edge lag |
| Centered | Historical analysis | Can't use for prediction |

### Edge Handling with min_periods

```
Window=5, min_periods=3:

Date         Original  Window Size  Valid?  SMA
2026-01-01   10        1            No      NaN
2026-01-02   12        2            No      NaN
2026-01-03   15        3            Yes     12.33 (uses 3)
2026-01-04   18        4            Yes     13.75 (uses 4)
2026-01-05   20        5            Yes     15.00 (uses 5)
2026-01-06   22        5            Yes     17.40 (uses 5)
```

### Volatility Reduction Metrics

| Metric | Formula | Interpretation |
|--------|---------|----------------|
| Std Dev Reduction | (σ_original - σ_smoothed) / σ_original | Higher = more smoothing |
| Coefficient of Variation | σ / μ | Lower = less volatile |
| Smoothness Score | 1 - (changes / n) | Higher = smoother |

### Before/After Comparison

```
Original Data (Daily Sales):
Day  1   2   3   4   5   6   7   8   9   10
     12  15  10  18  14  20  12  16  11  19

Statistics:
├── Mean: 14.7
├── Std Dev: 3.47
├── CV: 0.236
└── Volatility: High

After SMA (window=3):
Day  1   2   3     4     5     6     7     8     9     10
     NaN NaN 12.3  14.3  14.0  17.3  15.3  16.0  13.0  15.3

Statistics:
├── Mean: 14.7 (preserved)
├── Std Dev: 1.78 (48.7% reduction)
├── CV: 0.121 (48.7% reduction)
└── Volatility: Medium

Smoothing Effectiveness: 48.7%
```

### Smoothing Presets

| Preset | Window (Daily) | Use Case |
|--------|----------------|----------|
| Light | 3 | Minimal smoothing, preserve detail |
| Medium | 7 | Balance smoothing and responsiveness |
| Strong | 14 | Heavy smoothing, long-term trends |
| Custom | User-defined | Specific requirements |

### DataFrame Output Structure

```
Columns after smoothing:

Original:
├── date
├── quantity
└── revenue

Added:
├── quantity_smoothed
├── quantity_original (preserved)
├── smoothing_method
└── smoothing_window

Example row:
{
    "date": "2026-01-05",
    "quantity": 20,
    "quantity_smoothed": 17.67,
    "quantity_original": 20,
    "smoothing_method": "sma",
    "smoothing_window": 3
}
```

### Smoothing Metadata

```
{
    "method": "sma",
    "window": 7,
    "min_periods": 3,
    "centered": false,
    "original_stats": {
        "mean": 14.7,
        "std": 3.47,
        "cv": 0.236,
        "min": 10,
        "max": 20
    },
    "smoothed_stats": {
        "mean": 14.7,
        "std": 1.78,
        "cv": 0.121,
        "min": 11.5,
        "max": 17.8
    },
    "improvement": {
        "volatility_reduction": 48.7,
        "smoothness_score": 0.875,
        "trend_preservation": 0.95
    }
}
```

### Expected Outcome
- Functional smooth_data method with multiple algorithms
- Simple moving average for general noise reduction
- Weighted and exponential moving averages for trend emphasis
- Adaptive window sizing based on data frequency
- Edge handling with configurable min_periods
- Centered and forward smoothing options
- Volatility reduction with preserved trends
- Comprehensive smoothing metadata and metrics

### Verification Checklist
- [ ] Method defined with proper signature and docstring
- [ ] SMA implemented using pandas rolling mean
- [ ] WMA implemented with linear weights
- [ ] EMA implemented with exponential weights
- [ ] Adaptive window sizing for different frequencies
- [ ] Centered smoothing option available
- [ ] min_periods parameter controls edge behavior
- [ ] Volatility metrics calculated before/after
- [ ] Original data preserved in separate column
- [ ] Smoothing metadata generated
- [ ] Unit tests cover all smoothing methods

---

## Summary

This document established the sales data extraction and cleaning infrastructure for demand forecasting. Created the SalesDataExtractor class with methods for daily, weekly, and monthly data aggregation, and the DataCleaner class with comprehensive data quality handling including missing value imputation, outlier detection/removal, and noise smoothing.

### Completed Tasks
1. ✓ Created SalesDataExtractor class with tenant isolation and caching
2. ✓ Implemented get_daily_sales with date filling and aggregation
3. ✓ Implemented get_weekly_sales with ISO week format
4. ✓ Implemented get_monthly_sales with seasonal indicators
5. ✓ Created DataCleaner class with quality assessment
6. ✓ Implemented handle_missing with multiple imputation strategies
7. ✓ Implemented remove_outliers with IQR, Z-score, and capping
8. ✓ Implemented smooth_data with SMA, WMA, and EMA algorithms

### Next Steps
Proceed to [02_Tasks-25-32_Seasonality-Trend.md](02_Tasks-25-32_Seasonality-Trend.md) to create SeasonalityDetector and TrendAnalyzer classes for pattern detection and trend analysis in the processed sales data.
