# Tasks 17-24: Sales Metrics

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 13 - Dashboard KPIs  
> **Group:** B - Sales KPIs  
> **Document:** 01 of 02  
> **Tasks Covered:** 17, 18, 19, 20, 21, 22, 23, 24

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-25-32_Sales-Trends-Caching.md](02_Tasks-25-32_Sales-Trends-Caching.md)

---

## Document Overview

This document covers the creation of the SalesKPICalculator and implementation of core sales metrics. These metrics provide real-time insights into sales performance including today's sales, weekly and monthly totals, growth percentages, average order value, order counts, and top-performing products and customers. All values are calculated in Sri Lankan Rupees (LKR) and support both POS and Webstore channels.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 17 | Create SalesKPICalculator | Medium | 30 min |
| 18 | Add Today's Sales KPI | Medium | 25 min |
| 19 | Add Weekly Sales KPI | Low | 20 min |
| 20 | Add Monthly Sales KPI | Low | 20 min |
| 21 | Add Sales Growth KPI | Medium | 30 min |
| 22 | Add Average Order Value KPI | Low | 20 min |
| 23 | Add Orders Count KPI | Low | 15 min |
| 24 | Add Top Selling Products KPI | Medium | 35 min |

---

## Task 17: Create SalesKPICalculator

### Overview
Create the SalesKPICalculator class that extends BaseKPICalculator to provide sales-specific performance metrics. This calculator serves as the foundation for all sales-related KPI computations, aggregating data from sales invoices and orders across both POS and Webstore channels.

### Dependencies
- BaseKPICalculator exists (Task 16, Group A)
- SalesInvoice model exists
- Order model exists
- Tenant awareness configured
- Django ORM with timezone support

### Instructions

1. **Create sales.py calculator file**
   - Create file at `apps/dashboard/calculators/sales.py`
   - Import necessary Django components

2. **Import required modules**
   - Import BaseKPICalculator
   - Import Django timezone utilities
   - Import Decimal for currency calculations
   - Import models (SalesInvoice, Order, Product, Customer)
   - Import Django aggregation functions

3. **Define SalesKPICalculator class**
   - Inherit from BaseKPICalculator
   - Add class docstring explaining purpose
   - Set category attribute to 'SALES'

4. **Add __init__ method**
   - Accept tenant parameter
   - Accept optional date_range parameter
   - Call parent __init__
   - Store tenant for filtering

5. **Add _get_base_queryset method**
   - Create private method for base filtering
   - Filter SalesInvoice by tenant
   - Exclude voided invoices
   - Return queryset for reuse

6. **Add _filter_by_date_range method**
   - Accept queryset and date_range parameters
   - Filter by created_at date range
   - Support TODAY, WEEK, MONTH ranges
   - Return filtered queryset

7. **Add calculate method stub**
   - Override BaseKPICalculator.calculate()
   - Return empty dict initially
   - Will call specific metric methods

8. **Update calculators/__init__.py**
   - Import SalesKPICalculator
   - Add to __all__ list

### SalesKPICalculator Structure

```
┌────────────────────────────────────────────────┐
│         SalesKPICalculator Class               │
├────────────────────────────────────────────────┤
│ Attributes:                                    │
│  • category = 'SALES'                          │
│  • tenant (from __init__)                      │
│  • date_range (optional)                       │
│                                                │
│ Methods:                                       │
│  • __init__(tenant, date_range=None)           │
│  • _get_base_queryset()                        │
│  • _filter_by_date_range(qs, range)            │
│  • calculate() - override                      │
│  • get_todays_sales() - Task 18                │
│  • get_weekly_sales() - Task 19                │
│  • get_monthly_sales() - Task 20               │
│  • get_sales_growth() - Task 21                │
│  • get_average_order_value() - Task 22         │
│  • get_orders_count() - Task 23                │
│  • get_top_products() - Task 24                │
└────────────────────────────────────────────────┘
```

### Calculator Relationships

```
┌──────────────────┐
│ BaseKPICalculator│
│   (abstract)     │
└────────┬─────────┘
         │ inherits
         ▼
┌──────────────────┐         queries        ┌─────────────────┐
│SalesKPICalculator│◄────────────────────────│  SalesInvoice   │
└──────────────────┘                        └─────────────────┘
         │                                           │
         │ queries                                   │ has
         ▼                                           ▼
┌──────────────────┐                        ┌─────────────────┐
│     Product      │                        │   InvoiceItem   │
└──────────────────┘                        └─────────────────┘
         │
         │ queries
         ▼
┌──────────────────┐
│     Customer     │
└──────────────────┘
```

### Date Range Constants

| Range | Calculation | Example |
|-------|-------------|---------|
| TODAY | Current date 00:00 to 23:59 | 2026-01-25 00:00 to 23:59 |
| WEEK | Last 7 days including today | 2026-01-19 to 2026-01-25 |
| MONTH | Current month start to today | 2026-01-01 to 2026-01-25 |
| CUSTOM | Specified start and end dates | User-defined range |

### Base Queryset Filtering Logic

```
Sales Invoice Filtering Criteria
════════════════════════════════

✓ INCLUDE:
  • Belongs to tenant
  • Status = 'completed' or 'paid'
  • is_voided = False
  • created_at within range

✗ EXCLUDE:
  • Other tenants' invoices
  • Voided invoices (is_voided = True)
  • Draft invoices
  • Cancelled invoices
```

### Calculation Data Sources

| KPI Metric | Primary Model | Filter Criteria | Aggregation |
|------------|---------------|-----------------|-------------|
| Sales totals | SalesInvoice | Tenant, date, status | SUM(total_amount) |
| Order count | SalesInvoice | Tenant, date, status | COUNT(id) |
| AOV | SalesInvoice | Tenant, date, status | AVG(total_amount) |
| Top products | InvoiceItem | Via invoice tenant | SUM(quantity), GROUP BY product |
| Top customers | SalesInvoice | Tenant, date | SUM(total), GROUP BY customer |

### Currency Handling

```
All monetary values in LKR (Sri Lankan Rupees)
═════════════════════════════════════════════

Storage: Decimal field with 2 decimal places
Display: "LKR 125,450.00"
Calculations: Use Decimal for precision
Aggregations: Cast to Decimal, round to 2 places
```

### Expected Outcome
- Functional SalesKPICalculator class
- Clean inheritance from BaseKPICalculator
- Efficient queryset construction
- Foundation for sales metrics
- Tenant isolation enforced

### Verification Checklist
- [ ] sales.py file created
- [ ] SalesKPICalculator class defined
- [ ] Inherits from BaseKPICalculator
- [ ] __init__ method implemented
- [ ] _get_base_queryset method added
- [ ] _filter_by_date_range method added
- [ ] calculate method stub created
- [ ] Class imported in __init__.py
- [ ] Category set to 'SALES'
- [ ] Tenant filtering implemented

---

## Task 18: Add Today's Sales KPI

### Overview
Implement the get_todays_sales method that calculates total sales for the current day. This metric provides real-time visibility into daily sales performance and is one of the most frequently accessed KPIs in the dashboard.

### Dependencies
- Task 17: Create SalesKPICalculator

### Instructions

1. **Add get_todays_sales method**
   - Create public method in SalesKPICalculator
   - Accept no additional parameters
   - Return formatted KPI data dictionary

2. **Calculate today's date range**
   - Get current date in tenant's timezone
   - Set start time to 00:00:00
   - Set end time to 23:59:59
   - Use timezone-aware datetime objects

3. **Query today's sales**
   - Use _get_base_queryset()
   - Filter by today's date range
   - Aggregate SUM(total_amount)
   - Handle null results (default to 0)

4. **Calculate yesterday's sales**
   - Get previous day's date range
   - Query sales using same logic
   - Used for comparison calculation

5. **Calculate change percentage**
   - Formula: ((today - yesterday) / yesterday) * 100
   - Handle division by zero (return 0 or null)
   - Round to 1 decimal place

6. **Determine trend direction**
   - If change > 0: trend = 'up'
   - If change < 0: trend = 'down'
   - If change == 0: trend = 'stable'

7. **Format return dictionary**
   - Include raw value (Decimal)
   - Include formatted value (LKR string)
   - Include trend direction
   - Include change percentage
   - Include comparison value (yesterday)

8. **Update calculate method**
   - Call get_todays_sales()
   - Add result to KPIs dictionary
   - Return as part of overall response

### Today's Sales KPI Structure

```
┌────────────────────────────────────────────────┐
│          Today's Sales KPI Output              │
├────────────────────────────────────────────────┤
│ {                                              │
│   "value": 125450.00,           # Decimal      │
│   "formatted": "LKR 125,450.00", # Display     │
│   "trend": "up",                # Direction    │
│   "change_percent": 15.5,       # % change     │
│   "comparison_value": 108600.00,# Yesterday    │
│   "comparison_label": "vs Yesterday"           │
│ }                                              │
└────────────────────────────────────────────────┘
```

### Calculation Flow Diagram

```
Start
  │
  ▼
Get Today's Date Range
(2026-01-25 00:00 to 23:59)
  │
  ▼
Filter Sales Invoices
• tenant = current_tenant
• is_voided = False
• created_at >= today_start
• created_at <= today_end
  │
  ▼
Aggregate Total
SUM(total_amount)
  │
  ▼
Today's Sales = 125,450.00 LKR
  │
  ▼
Get Yesterday's Date Range
(2026-01-24 00:00 to 23:59)
  │
  ▼
Query Yesterday's Sales
Same filters, previous date
  │
  ▼
Yesterday's Sales = 108,600.00 LKR
  │
  ▼
Calculate Change %
((125450 - 108600) / 108600) * 100
= 15.5%
  │
  ▼
Determine Trend
15.5% > 0 → trend = "up"
  │
  ▼
Format Response
Return KPI dictionary
  │
  ▼
End
```

### Sample Data Scenarios

#### Scenario 1: Strong Sales Day
```
Today:     LKR 125,450.00  (45 orders)
Yesterday: LKR 108,600.00  (38 orders)
Change:    +15.5% ↑
Trend:     UP
```

#### Scenario 2: Declining Sales
```
Today:     LKR 85,200.00   (32 orders)
Yesterday: LKR 95,500.00   (40 orders)
Change:    -10.8% ↓
Trend:     DOWN
```

#### Scenario 3: Stable Sales
```
Today:     LKR 100,000.00  (40 orders)
Yesterday: LKR 100,000.00  (40 orders)
Change:    0.0% →
Trend:     STABLE
```

#### Scenario 4: First Day (No Yesterday)
```
Today:     LKR 125,450.00  (45 orders)
Yesterday: LKR 0.00        (0 orders)
Change:    N/A or +∞
Trend:     UP (or N/A)
```

### Currency Formatting

| Value | Raw Decimal | Formatted String | Display |
|-------|-------------|------------------|---------|
| 125450.00 | Decimal('125450.00') | "LKR 125,450.00" | Dashboard |
| 1250.50 | Decimal('1250.50') | "LKR 1,250.50" | Dashboard |
| 1000000.00 | Decimal('1000000.00') | "LKR 1,000,000.00" | Dashboard |
| 0.00 | Decimal('0.00') | "LKR 0.00" | No sales |

### Timezone Considerations

```
Sri Lanka Timezone: UTC+5:30
═══════════════════════════════

Today's date calculation must use:
• timezone.now() - Current time in UTC
• Convert to Asia/Colombo timezone
• Get date (without time)
• Create range: 00:00:00 to 23:59:59

Example:
UTC Time:      2026-01-25 10:30:00 UTC
SL Time:       2026-01-25 16:00:00 +0530
Today Range:   2026-01-25 00:00:00 to 23:59:59 +0530
```

### Performance Optimization

```
Query Optimization Tips
═══════════════════════

✓ Use aggregate functions (SUM, COUNT)
✓ Add database indexes on:
  • tenant_id
  • created_at
  • is_voided
✓ Filter early in queryset chain
✓ Use select_related for foreign keys
✓ Cache result for 5-15 minutes
✓ Avoid N+1 queries
```

### Expected Outcome
- Accurate today's sales calculation
- Comparison with yesterday
- Percentage change computation
- Trend direction indicator
- Proper currency formatting

### Verification Checklist
- [ ] get_todays_sales method implemented
- [ ] Today's date range calculated correctly
- [ ] Sales aggregation works
- [ ] Yesterday's sales calculated
- [ ] Change percentage computed
- [ ] Trend direction determined
- [ ] Currency formatted as LKR
- [ ] Handles zero yesterday sales
- [ ] Returns proper dictionary structure
- [ ] Integrated into calculate method

---

## Task 19: Add Weekly Sales KPI

### Overview
Implement the get_weekly_sales method that calculates total sales for the current week (last 7 days including today). This metric provides insight into weekly sales trends and helps identify patterns across the week.

### Dependencies
- Task 18: Add Today's Sales KPI

### Instructions

1. **Add get_weekly_sales method**
   - Create public method in SalesKPICalculator
   - Follow same pattern as get_todays_sales
   - Return formatted KPI data dictionary

2. **Calculate week date range**
   - Get current date
   - Subtract 6 days to get week start
   - Week = last 7 days including today
   - Use timezone-aware datetime objects

3. **Query this week's sales**
   - Use _get_base_queryset()
   - Filter by week date range
   - Aggregate SUM(total_amount)
   - Handle null results

4. **Calculate previous week's sales**
   - Get previous 7-day period
   - Days 8-14 before today
   - Query sales using same logic
   - Used for comparison

5. **Calculate change percentage**
   - Formula: ((this_week - last_week) / last_week) * 100
   - Handle division by zero
   - Round to 1 decimal place

6. **Determine trend direction**
   - Same logic as Task 18
   - Compare this week to last week

7. **Format return dictionary**
   - Same structure as Today's Sales
   - comparison_label: "vs Last Week"

8. **Update calculate method**
   - Call get_weekly_sales()
   - Add result to KPIs dictionary

### Weekly Sales KPI Structure

```
┌────────────────────────────────────────────────┐
│          Weekly Sales KPI Output               │
├────────────────────────────────────────────────┤
│ {                                              │
│   "value": 785300.00,                          │
│   "formatted": "LKR 785,300.00",               │
│   "trend": "up",                               │
│   "change_percent": 8.3,                       │
│   "comparison_value": 725400.00,               │
│   "comparison_label": "vs Last Week",          │
│   "days_included": 7                           │
│ }                                              │
└────────────────────────────────────────────────┘
```

### Week Date Range Calculation

```
Today: January 25, 2026 (Saturday)
═══════════════════════════════════

This Week (Last 7 Days):
  Start: January 19, 2026 (Sunday)
  End:   January 25, 2026 (Saturday)
  Days:  19, 20, 21, 22, 23, 24, 25

Previous Week (8-14 Days Ago):
  Start: January 12, 2026 (Monday)
  End:   January 18, 2026 (Sunday)
  Days:  12, 13, 14, 15, 16, 17, 18
```

### Sample Week Breakdown

```
Week Sales by Day
═════════════════

Date          Day       Sales        Orders
──────────────────────────────────────────
Jan 19 Sun    Sunday    95,000.00    35
Jan 20 Mon    Monday    110,000.00   42
Jan 21 Tue    Tuesday   108,500.00   40
Jan 22 Wed    Wednesday 115,200.00   44
Jan 23 Thu    Thursday  120,000.00   46
Jan 24 Fri    Friday    111,150.00   41
Jan 25 Sat    Saturday  125,450.00   45
──────────────────────────────────────────
TOTAL         7 days    785,300.00   293

Average per day: 112,185.71 LKR
```

### Weekly Comparison Scenarios

#### Scenario 1: Growing Week
```
This Week:     LKR 785,300.00  (293 orders)
Last Week:     LKR 725,400.00  (270 orders)
Change:        +8.3% ↑
Trend:         UP
Insight:       Positive growth momentum
```

#### Scenario 2: Declining Week
```
This Week:     LKR 680,000.00  (250 orders)
Last Week:     LKR 750,000.00  (280 orders)
Change:        -9.3% ↓
Trend:         DOWN
Insight:       May need promotional activity
```

#### Scenario 3: Stable Week
```
This Week:     LKR 700,000.00  (260 orders)
Last Week:     LKR 702,000.00  (262 orders)
Change:        -0.3% →
Trend:         STABLE
Insight:       Consistent performance
```

### Weekly Sales Patterns (Sri Lanka Context)

```
Typical Sri Lankan Retail Week
═══════════════════════════════

Sunday:     Low-Medium (60-70% of avg)
            • Many businesses closed
            • Family day

Monday:     Medium (80-90% of avg)
            • Work week starts
            • Moderate traffic

Tuesday:    Medium (85-95% of avg)
Wednesday:  Medium-High (95-105% of avg)
Thursday:   Medium-High (95-105% of avg)

Friday:     High (105-115% of avg)
            • Payday for many
            • Weekend prep shopping

Saturday:   Highest (110-120% of avg)
            • Weekend shopping
            • Highest foot traffic

Note: Patterns vary by business type and location
```

### Week Period Definitions

| Period | Definition | Days Included | Use Case |
|--------|-----------|---------------|----------|
| This Week | Last 7 days | Today - 6 days to today | Current performance |
| Last Week | Previous 7 days | 8-14 days ago | Comparison baseline |
| 4-Week Average | Last 28 days / 4 | 4 complete weeks | Trend smoothing |
| Month-to-Date | 1st to today | Current month days | Monthly tracking |

### Expected Outcome
- Accurate 7-day sales calculation
- Comparison with previous 7 days
- Weekly trend direction
- Support for week-over-week analysis

### Verification Checklist
- [ ] get_weekly_sales method implemented
- [ ] Week date range calculated (7 days)
- [ ] Sales aggregation works
- [ ] Previous week calculated (8-14 days ago)
- [ ] Change percentage computed
- [ ] Trend direction determined
- [ ] Returns proper dictionary structure
- [ ] Integrated into calculate method
- [ ] Handles edge cases (new tenant)

---

## Task 20: Add Monthly Sales KPI

### Overview
Implement the get_monthly_sales method that calculates total sales for the current month from the 1st to today. This metric provides monthly performance tracking and supports financial reporting requirements.

### Dependencies
- Task 19: Add Weekly Sales KPI

### Instructions

1. **Add get_monthly_sales method**
   - Create public method in SalesKPICalculator
   - Follow established pattern
   - Return formatted KPI data dictionary

2. **Calculate month date range**
   - Get current date
   - Set start to 1st of current month at 00:00:00
   - Set end to today at 23:59:59
   - Use timezone-aware datetime objects

3. **Query this month's sales**
   - Use _get_base_queryset()
   - Filter by month date range
   - Aggregate SUM(total_amount)
   - Handle null results

4. **Calculate previous month's sales**
   - Get same date range in previous month
   - If today is 25th, get 1st to 25th of previous month
   - Query sales using same logic
   - Ensures fair comparison

5. **Calculate change percentage**
   - Formula: ((this_month - last_month) / last_month) * 100
   - Handle division by zero
   - Round to 1 decimal place

6. **Determine trend direction**
   - Same logic as previous tasks
   - Compare this month to last month

7. **Calculate days in period**
   - Count days from 1st to today
   - Include in response for context

8. **Format return dictionary**
   - Same structure as previous KPIs
   - comparison_label: "vs Last Month"
   - Add days_in_period field

9. **Update calculate method**
   - Call get_monthly_sales()
   - Add result to KPIs dictionary

### Monthly Sales KPI Structure

```
┌────────────────────────────────────────────────┐
│          Monthly Sales KPI Output              │
├────────────────────────────────────────────────┤
│ {                                              │
│   "value": 3125000.00,                         │
│   "formatted": "LKR 3,125,000.00",             │
│   "trend": "up",                               │
│   "change_percent": 12.5,                      │
│   "comparison_value": 2778000.00,              │
│   "comparison_label": "vs Last Month",         │
│   "days_in_period": 25,                        │
│   "month": "January 2026"                      │
│ }                                              │
└────────────────────────────────────────────────┘
```

### Month Date Range Calculation

```
Current Date: January 25, 2026
══════════════════════════════

This Month (Month-to-Date):
  Start: January 1, 2026 (00:00:00)
  End:   January 25, 2026 (23:59:59)
  Days:  25 days
  Period: "Jan 1-25, 2026"

Previous Month (Same Period):
  Start: December 1, 2025 (00:00:00)
  End:   December 25, 2025 (23:59:59)
  Days:  25 days
  Period: "Dec 1-25, 2025"

Note: Fair comparison - same number of days
```

### Sample Monthly Breakdown

```
January 2026 Sales (as of Jan 25)
═════════════════════════════════

Week 1 (Jan 1-7):     650,000.00
Week 2 (Jan 8-14):    720,000.00
Week 3 (Jan 15-21):   785,000.00
Week 4 (Jan 22-25):   970,000.00 (partial week)
─────────────────────────────────
TOTAL (25 days):    3,125,000.00

Average per day:      125,000.00 LKR
Projected month:    3,875,000.00 LKR (if pace continues)
```

### Monthly Comparison Scenarios

#### Scenario 1: Strong Month
```
This Month:    LKR 3,125,000.00  (Jan 1-25)
Last Month:    LKR 2,778,000.00  (Dec 1-25)
Change:        +12.5% ↑
Trend:         UP
Insight:       Exceeding previous month performance
```

#### Scenario 2: Declining Month
```
This Month:    LKR 2,450,000.00  (Jan 1-25)
Last Month:    LKR 2,778,000.00  (Dec 1-25)
Change:        -11.8% ↓
Trend:         DOWN
Insight:       Post-holiday sales slowdown
```

#### Scenario 3: Stable Month
```
This Month:    LKR 2,780,000.00  (Jan 1-25)
Last Month:    LKR 2,778,000.00  (Dec 1-25)
Change:        +0.1% →
Trend:         STABLE
Insight:       Consistent month-over-month performance
```

### Monthly Sales Patterns (Sri Lanka)

```
Typical Monthly Sales Patterns
══════════════════════════════

High Sales Months:
• December: Year-end holidays, Christmas
• April: Sinhala & Tamil New Year
• July-August: School holidays
• November: Deepavali season

Low Sales Months:
• January: Post-holiday slowdown
• February: Shortest month
• June: Mid-year lull

Festival Impact:
• Vesak (May): Religious spending
• Poson (June): Religious items
• Ramadan/Eid: Increased food sales
```

### Month-End Projections

```
Projection Calculation (as of Jan 25)
═════════════════════════════════════

Current MTD:      3,125,000.00 LKR (25 days)
Days in Month:    31 days
Days Remaining:   6 days

Method 1 - Simple Average:
  Daily Average = 3,125,000 / 25 = 125,000
  Projection = 125,000 × 31 = 3,875,000 LKR

Method 2 - Weighted Average:
  Last 7 days avg = 140,000
  Projection = (3,125,000) + (140,000 × 6) = 3,965,000 LKR

Confidence: Medium (6 days remaining)
```

### Monthly Sales by Category

| Category | Amount | % of Total | Growth |
|----------|--------|------------|--------|
| Electronics | 950,000 | 30.4% | +15% |
| Clothing | 780,000 | 25.0% | +8% |
| Groceries | 625,000 | 20.0% | +5% |
| Home & Living | 470,000 | 15.0% | +12% |
| Other | 300,000 | 9.6% | +10% |
| **Total** | **3,125,000** | **100%** | **+12.5%** |

### Expected Outcome
- Accurate month-to-date calculation
- Fair comparison with previous month
- Monthly trend tracking
- Support for financial reporting

### Verification Checklist
- [ ] get_monthly_sales method implemented
- [ ] Month start calculated (1st at 00:00)
- [ ] Month-to-date range correct
- [ ] Previous month same-period calculated
- [ ] Change percentage computed
- [ ] Trend direction determined
- [ ] Days in period included
- [ ] Month name formatted
- [ ] Returns proper dictionary structure
- [ ] Integrated into calculate method

---

## Task 21: Add Sales Growth KPI

### Overview
Implement the get_sales_growth method that calculates and compares sales growth across multiple periods (day-over-day, week-over-week, month-over-month). This comprehensive metric provides insight into sales momentum and helps identify growth trends.

### Dependencies
- Task 18: Add Today's Sales KPI
- Task 19: Add Weekly Sales KPI
- Task 20: Add Monthly Sales KPI

### Instructions

1. **Add get_sales_growth method**
   - Create public method in SalesKPICalculator
   - Return comprehensive growth analysis
   - Include multiple period comparisons

2. **Extract existing growth calculations**
   - Reuse logic from Tasks 18, 19, 20
   - Day-over-day from get_todays_sales
   - Week-over-week from get_weekly_sales
   - Month-over-month from get_monthly_sales

3. **Add quarter-over-quarter calculation**
   - Calculate current quarter-to-date
   - Calculate same period in previous quarter
   - Compute growth percentage

4. **Add year-over-year calculation**
   - Calculate year-to-date sales
   - Calculate same period last year
   - Compute growth percentage

5. **Determine overall trend**
   - Analyze multiple periods
   - If majority show growth: overall trend = 'up'
   - If majority show decline: overall trend = 'down'
   - Otherwise: trend = 'mixed'

6. **Identify best and worst periods**
   - Find period with highest growth %
   - Find period with lowest growth %
   - Include in response

7. **Format return dictionary**
   - Include all period growth percentages
   - Include overall trend
   - Include best/worst performers
   - Include growth summary text

8. **Update calculate method**
   - Call get_sales_growth()
   - Add result to KPIs dictionary

### Sales Growth KPI Structure

```
┌────────────────────────────────────────────────┐
│          Sales Growth KPI Output               │
├────────────────────────────────────────────────┤
│ {                                              │
│   "overall_trend": "up",                       │
│   "day_over_day": {                            │
│     "percent": 15.5,                           │
│     "direction": "up",                         │
│     "from": 108600.00,                         │
│     "to": 125450.00                            │
│   },                                           │
│   "week_over_week": {                          │
│     "percent": 8.3,                            │
│     "direction": "up",                         │
│     "from": 725400.00,                         │
│     "to": 785300.00                            │
│   },                                           │
│   "month_over_month": {                        │
│     "percent": 12.5,                           │
│     "direction": "up",                         │
│     "from": 2778000.00,                        │
│     "to": 3125000.00                           │
│   },                                           │
│   "best_period": "day_over_day",               │
│   "best_percent": 15.5,                        │
│   "worst_period": "week_over_week",            │
│   "worst_percent": 8.3,                        │
│   "summary": "Strong growth across all periods"│
│ }                                              │
└────────────────────────────────────────────────┘
```

### Growth Calculation Formulas

```
Growth Percentage Formula
═════════════════════════

Growth % = ((Current - Previous) / Previous) × 100

Examples:

Day-over-Day:
  Today:     125,450.00
  Yesterday: 108,600.00
  Growth = ((125450 - 108600) / 108600) × 100
        = (16850 / 108600) × 100
        = 15.5%

Week-over-Week:
  This Week: 785,300.00
  Last Week: 725,400.00
  Growth = ((785300 - 725400) / 725400) × 100
        = (59900 / 725400) × 100
        = 8.3%

Month-over-Month:
  This Month: 3,125,000.00
  Last Month: 2,778,000.00
  Growth = ((3125000 - 2778000) / 2778000) × 100
        = (347000 / 2778000) × 100
        = 12.5%
```

### Growth Trend Scenarios

#### Scenario 1: Strong Across-the-Board Growth
```
Day-over-Day:     +15.5% ↑
Week-over-Week:   +8.3% ↑
Month-over-Month: +12.5% ↑

Overall Trend:    UP
Best Period:      Day-over-Day (15.5%)
Worst Period:     Week-over-Week (8.3%)
Summary:          "Strong growth across all periods"
Insight:          Business momentum building
```

#### Scenario 2: Mixed Performance
```
Day-over-Day:     +5.2% ↑
Week-over-Week:   -3.1% ↓
Month-over-Month: +8.7% ↑

Overall Trend:    MIXED
Best Period:      Month-over-Month (8.7%)
Worst Period:     Week-over-Week (-3.1%)
Summary:          "Mixed growth with some declines"
Insight:          Recent week slowdown, but month trending up
```

#### Scenario 3: Declining Trend
```
Day-over-Day:     -8.5% ↓
Week-over-Week:   -6.2% ↓
Month-over-Month: -4.3% ↓

Overall Trend:    DOWN
Best Period:      Month-over-Month (-4.3%)
Worst Period:     Day-over-Day (-8.5%)
Summary:          "Declining growth across all periods"
Insight:          Requires immediate attention
```

#### Scenario 4: Recovery Pattern
```
Day-over-Day:     +12.0% ↑
Week-over-Week:   -2.5% ↓
Month-over-Month: -5.0% ↓

Overall Trend:    MIXED
Best Period:      Day-over-Day (12.0%)
Worst Period:     Month-over-Month (-5.0%)
Summary:          "Recent recovery from monthly decline"
Insight:          Positive momentum building
```

### Growth Visualization Data

```
Growth Chart Data Structure
═══════════════════════════

For trending/charting:
{
  "periods": ["Day", "Week", "Month"],
  "growth_rates": [15.5, 8.3, 12.5],
  "colors": ["green", "green", "green"],
  "average": 12.1
}
```

### Growth Thresholds (Business Rules)

| Growth % | Classification | Color | Action |
|----------|----------------|-------|--------|
| > 10% | Excellent | Dark Green | Celebrate, replicate |
| 5% to 10% | Good | Green | Maintain momentum |
| 0% to 5% | Moderate | Yellow | Monitor closely |
| -5% to 0% | Slight Decline | Orange | Investigate causes |
| < -5% | Concerning | Red | Immediate action |

### Contextual Growth Analysis

```
Growth Context Factors
═════════════════════

Consider these when analyzing growth:

✓ Seasonality: Festival seasons vs regular
✓ Day of Week: Friday/Saturday vs Sunday
✓ Promotions: Active campaigns impact
✓ Competition: New competitor openings
✓ Economic: Inflation, currency changes
✓ Weather: Rain, holidays affect foot traffic
✓ Holidays: Public/bank holidays
✓ Events: Local events, strikes, etc.
```

### Expected Outcome
- Comprehensive growth analysis
- Multi-period comparison
- Trend identification
- Actionable insights
- Support for strategic decisions

### Verification Checklist
- [ ] get_sales_growth method implemented
- [ ] Day-over-day growth calculated
- [ ] Week-over-week growth calculated
- [ ] Month-over-month growth calculated
- [ ] Overall trend determined
- [ ] Best period identified
- [ ] Worst period identified
- [ ] Summary text generated
- [ ] Returns proper dictionary structure
- [ ] Integrated into calculate method

---

## Task 22: Add Average Order Value KPI

### Overview
Implement the get_average_order_value method that calculates the average transaction value across different periods. Average Order Value (AOV) is a critical metric for understanding customer spending behavior and measuring the effectiveness of upselling strategies.

### Dependencies
- Task 21: Add Sales Growth KPI

### Instructions

1. **Add get_average_order_value method**
   - Create public method in SalesKPICalculator
   - Calculate for today, week, and month
   - Return formatted KPI data dictionary

2. **Calculate today's AOV**
   - Get today's total sales (from Task 18)
   - Get today's order count
   - Formula: AOV = Total Sales / Order Count
   - Handle division by zero (return 0 if no orders)

3. **Calculate weekly AOV**
   - Get week's total sales
   - Get week's order count
   - Calculate average

4. **Calculate monthly AOV**
   - Get month's total sales
   - Get month's order count
   - Calculate average

5. **Calculate AOV trend**
   - Compare today's AOV to yesterday's
   - Determine if AOV is increasing or decreasing
   - Calculate percentage change

6. **Identify high-value orders**
   - Query orders with amount > (2 × average)
   - Count high-value transactions
   - Include percentage of total

7. **Identify low-value orders**
   - Query orders with amount < (0.5 × average)
   - Count low-value transactions
   - Include percentage of total

8. **Format return dictionary**
   - Include AOV for each period
   - Include trend information
   - Include high/low value order stats
   - Include formatted currency strings

9. **Update calculate method**
   - Call get_average_order_value()
   - Add result to KPIs dictionary

### Average Order Value KPI Structure

```
┌────────────────────────────────────────────────┐
│       Average Order Value KPI Output           │
├────────────────────────────────────────────────┤
│ {                                              │
│   "today": {                                   │
│     "value": 2787.78,                          │
│     "formatted": "LKR 2,787.78",               │
│     "orders": 45                               │
│   },                                           │
│   "week": {                                    │
│     "value": 2680.27,                          │
│     "formatted": "LKR 2,680.27",               │
│     "orders": 293                              │
│   },                                           │
│   "month": {                                   │
│     "value": 2734.38,                          │
│     "formatted": "LKR 2,734.38",               │
│     "orders": 1143                             │
│   },                                           │
│   "trend": "up",                               │
│   "change_percent": 4.0,                       │
│   "comparison_value": 2680.56,                 │
│   "high_value_orders": {                       │
│     "count": 8,                                │
│     "percentage": 17.8                         │
│   },                                           │
│   "low_value_orders": {                        │
│     "count": 5,                                │
│     "percentage": 11.1                         │
│   }                                            │
│ }                                              │
└────────────────────────────────────────────────┘
```

### AOV Calculation Examples

```
Today's AOV Calculation
══════════════════════

Total Sales:   LKR 125,450.00
Order Count:   45 orders
AOV = 125,450 / 45 = 2,787.78 LKR

Weekly AOV Calculation
═════════════════════

Total Sales:   LKR 785,300.00
Order Count:   293 orders
AOV = 785,300 / 293 = 2,680.27 LKR

Monthly AOV Calculation
══════════════════════

Total Sales:   LKR 3,125,000.00
Order Count:   1,143 orders
AOV = 3,125,000 / 1,143 = 2,734.38 LKR
```

### Order Value Distribution

```
Sample Order Distribution (Today)
═════════════════════════════════

Order Value Range    Orders    % of Total    Revenue %
───────────────────────────────────────────────────────
LKR 0 - 1,000          5         11.1%         2.5%     ← Low value
LKR 1,001 - 2,000     12         26.7%        15.8%
LKR 2,001 - 3,000     15         33.3%        34.2%     ← Average
LKR 3,001 - 4,000      5         11.1%        15.5%
LKR 4,001 - 5,000      3          6.7%        11.2%
LKR 5,001+             5         11.1%        20.8%     ← High value
───────────────────────────────────────────────────────
TOTAL                 45        100.0%       100.0%

Average:              2,787.78 LKR
Median:               2,650.00 LKR
High Value Threshold: 5,575.56 LKR (2× avg)
Low Value Threshold:  1,393.89 LKR (0.5× avg)
```

### AOV Trend Scenarios

#### Scenario 1: Increasing AOV
```
Today's AOV:        LKR 2,787.78 (45 orders)
Yesterday's AOV:    LKR 2,680.56 (38 orders)
Change:             +4.0% ↑
Trend:              UP

Insight: Customers spending more per transaction
Action:  Continue upselling strategies
```

#### Scenario 2: Decreasing AOV
```
Today's AOV:        LKR 2,450.00 (52 orders)
Yesterday's AOV:    LKR 2,780.00 (42 orders)
Change:             -11.9% ↓
Trend:              DOWN

Insight: More orders but lower value per order
Action:  Review product mix, promote higher-value items
```

#### Scenario 3: High Order Count, Stable AOV
```
Today's AOV:        LKR 2,700.00 (60 orders)
Yesterday's AOV:    LKR 2,705.00 (45 orders)
Change:             -0.2% →
Trend:              STABLE

Insight: Increased traffic with consistent spending
Action:  Maintain current strategies
```

### AOV by Sales Channel

```
Channel Comparison
═════════════════

Channel      Orders    Total Sales      AOV        % Diff
─────────────────────────────────────────────────────────
POS            32      80,000.00     2,500.00    -10.3%
Webstore       13      45,450.00     3,496.15    +25.4%
─────────────────────────────────────────────────────────
TOTAL          45     125,450.00     2,787.78      -

Insight: Webstore has 40% higher AOV than POS
Reason:  Less impulse buying, more considered purchases
```

### AOV Improvement Strategies

| Strategy | Expected AOV Impact | Implementation |
|----------|-------------------|----------------|
| Product bundling | +15-25% | Suggest complementary products |
| Minimum for free shipping | +20-30% | Webstore threshold incentive |
| Volume discounts | +10-20% | "Buy 3, get 10% off" |
| Upselling at checkout | +5-15% | "Customers also bought..." |
| Premium alternatives | +15-25% | Show higher-end options |
| Cross-selling | +10-20% | Related product suggestions |

### AOV Benchmarks (Sri Lankan Retail)

```
Industry AOV Benchmarks
══════════════════════

Retail Type              Typical AOV Range
──────────────────────────────────────────
Grocery Supermarket      1,500 - 3,000 LKR
Clothing/Fashion         2,500 - 5,000 LKR
Electronics              8,000 - 25,000 LKR
Restaurant/Food          800 - 2,000 LKR
Home & Living            3,000 - 8,000 LKR
Pharmacy                 500 - 1,500 LKR
Book Store               1,000 - 2,500 LKR
```

### High-Value Order Analysis

```
High-Value Orders (> 2× Average)
════════════════════════════════

Definition: Orders exceeding 5,575 LKR (2× 2,787.78)

Order #      Amount      Products    Customer Type
─────────────────────────────────────────────────
INV-1234    8,450.00        12      Regular
INV-1235    6,200.00         8      VIP
INV-1236    7,100.00        10      Regular
INV-1237   11,500.00        18      Wholesale
INV-1238    5,800.00         7      Regular

Total: 5 orders (11.1% of total)
Revenue: 39,050.00 (31.1% of daily revenue)

Insight: 11% of orders generate 31% of revenue
Action:  Focus on retaining these customers
```

### Expected Outcome
- Accurate AOV calculation for multiple periods
- Trend analysis for AOV changes
- High and low-value order identification
- Channel-specific AOV comparison
- Support for pricing strategies

### Verification Checklist
- [ ] get_average_order_value method implemented
- [ ] Today's AOV calculated
- [ ] Weekly AOV calculated
- [ ] Monthly AOV calculated
- [ ] AOV trend determined
- [ ] Change percentage computed
- [ ] High-value orders identified
- [ ] Low-value orders identified
- [ ] Currency formatted properly
- [ ] Returns proper dictionary structure
- [ ] Integrated into calculate method

---

## Task 23: Add Orders Count KPI

### Overview
Implement the get_orders_count method that tracks the number of orders processed across different periods. Order count is a fundamental metric that measures sales volume and customer activity, complementing revenue-based KPIs.

### Dependencies
- Task 22: Add Average Order Value KPI

### Instructions

1. **Add get_orders_count method**
   - Create public method in SalesKPICalculator
   - Count orders for today, week, and month
   - Return formatted KPI data dictionary

2. **Count today's orders**
   - Use _get_base_queryset()
   - Filter by today's date range
   - Count total orders
   - Exclude voided orders

3. **Count weekly orders**
   - Filter by week date range (7 days)
   - Count total orders
   - Calculate daily average

4. **Count monthly orders**
   - Filter by month-to-date range
   - Count total orders
   - Calculate daily average

5. **Calculate order count trend**
   - Compare today's count to yesterday's
   - Determine trend direction
   - Calculate percentage change

6. **Calculate peak hour orders**
   - Group today's orders by hour
   - Identify hour with most orders
   - Include count and time range

7. **Calculate average orders per day**
   - For week: total orders / 7
   - For month: total orders / days in period
   - Include in response

8. **Analyze order frequency**
   - Calculate time between orders
   - Average minutes between orders
   - Include busiest time period

9. **Format return dictionary**
   - Include counts for each period
   - Include trend information
   - Include averages
   - Include peak hour data

10. **Update calculate method**
    - Call get_orders_count()
    - Add result to KPIs dictionary

### Orders Count KPI Structure

```
┌────────────────────────────────────────────────┐
│         Orders Count KPI Output                │
├────────────────────────────────────────────────┤
│ {                                              │
│   "today": {                                   │
│     "count": 45,                               │
│     "peak_hour": {                             │
│       "hour": "14:00-15:00",                   │
│       "count": 8                               │
│     }                                          │
│   },                                           │
│   "week": {                                    │
│     "count": 293,                              │
│     "daily_average": 41.86                     │
│   },                                           │
│   "month": {                                   │
│     "count": 1143,                             │
│     "daily_average": 45.72                     │
│   },                                           │
│   "trend": "up",                               │
│   "change_percent": 8.3,                       │
│   "comparison_value": 42,                      │
│   "avg_minutes_between_orders": 18.7,          │
│   "busiest_period": "13:00-16:00"              │
│ }                                              │
└────────────────────────────────────────────────┘
```

### Order Count Calculation Examples

```
Today's Order Count
══════════════════

Total Orders:      45
Voided Orders:     2  (excluded)
Valid Orders:      43 (counted)

Yesterday's Count: 42
Change:            +1 order
Percent Change:    +2.4%

Weekly Order Count
═════════════════

Total Orders:      293
Days:              7
Daily Average:     41.86 orders/day

Monthly Order Count
══════════════════

Total Orders:      1,143
Days:              25
Daily Average:     45.72 orders/day
Projected Month:   1,417 orders (31 days)
```

### Hourly Order Distribution

```
Today's Orders by Hour (January 25, 2026)
════════════════════════════════════════

Time Range    Orders    % of Day    Revenue
─────────────────────────────────────────────
08:00-09:00      2        4.4%      5,200
09:00-10:00      3        6.7%      8,100
10:00-11:00      4        8.9%     10,500
11:00-12:00      5       11.1%     13,800
12:00-13:00      6       13.3%     16,200
13:00-14:00      7       15.6%     19,500     ← Peak starts
14:00-15:00      8       17.8%     22,400     ← PEAK HOUR
15:00-16:00      7       15.6%     19,500
16:00-17:00      5       11.1%     13,800
17:00-18:00      3        6.7%      8,100
18:00-19:00      2        4.4%      5,200
─────────────────────────────────────────────
TOTAL           45      100.0%    125,450

Peak Hour:       14:00-15:00 (8 orders)
Busiest Period:  13:00-16:00 (22 orders, 48.9%)
Slowest Period:  08:00-10:00 (5 orders, 11.1%)
```

### Order Count Trend Scenarios

#### Scenario 1: Increasing Order Volume
```
Today:         45 orders (+8.3%)
Yesterday:     42 orders
Trend:         UP

Weekly Avg:    41.86 orders/day
Today vs Avg:  +7.5%

Insight:       Above-average order volume
Action:        Ensure adequate staffing
```

#### Scenario 2: Declining Order Volume
```
Today:         32 orders (-15.8%)
Yesterday:     38 orders
Trend:         DOWN

Weekly Avg:    41.86 orders/day
Today vs Avg:  -23.5%

Insight:       Significantly below average
Action:        Investigate causes, run promotions
```

#### Scenario 3: Stable Order Volume
```
Today:         42 orders (+0.0%)
Yesterday:     42 orders
Trend:         STABLE

Weekly Avg:    41.86 orders/day
Today vs Avg:  +0.3%

Insight:       Consistent with typical volume
Action:        Maintain current operations
```

### Order Frequency Analysis

```
Time Between Orders (Today)
══════════════════════════

Business Hours:  11 hours (08:00-19:00)
Total Minutes:   660 minutes
Total Orders:    45

Average Time Between Orders:
  = 660 / 45
  = 14.7 minutes

Median Time:     12 minutes
Fastest Period:  3 minutes (lunch rush)
Slowest Period:  45 minutes (early morning)
```

### Weekly Order Pattern

```
Orders by Day of Week
════════════════════

Day          Orders    % of Week    Avg Order Value
──────────────────────────────────────────────────
Sunday         35       11.9%          2,714.29
Monday         42       14.3%          2,619.05
Tuesday        40       13.7%          2,712.50
Wednesday      44       15.0%          2,618.18
Thursday       46       15.7%          2,608.70
Friday         41       14.0%          2,710.98
Saturday       45       15.4%          2,787.78
──────────────────────────────────────────────────
TOTAL         293      100.0%          2,680.27

Insight: Saturday has highest order count
Pattern: Consistent mid-week, peaks on weekend
```

### Order Count by Channel

```
Channel Distribution
═══════════════════

Channel        Orders    % of Total    Orders/Day
───────────────────────────────────────────────
POS              32        71.1%         32
Webstore         13        28.9%         13
───────────────────────────────────────────────
TOTAL            45       100.0%         45

POS Insight:      Dominates order count (71%)
Webstore Insight: Fewer orders but higher AOV
```

### Order Count Benchmarks

```
Industry Benchmarks (Sri Lankan Retail)
═══════════════════════════════════════

Store Type           Orders/Day Range
──────────────────────────────────────
Small Boutique       20-40
Medium Retail        40-80
Large Store          80-150
Supermarket          150-400
Department Store     200-500
Quick Service        100-300
```

### Staff Planning Based on Orders

| Orders/Day | Cashiers Needed | Floor Staff | Manager |
|------------|----------------|-------------|---------|
| 0-20 | 1 | 1 | Part-time |
| 21-40 | 1-2 | 2 | 1 |
| 41-60 | 2 | 2-3 | 1 |
| 61-80 | 2-3 | 3-4 | 1 |
| 81-100 | 3 | 4-5 | 1-2 |
| 100+ | 3+ | 5+ | 2 |

### Order Velocity Metrics

```
Order Velocity Analysis
══════════════════════

Metric                Value        Status
──────────────────────────────────────────
Orders/Hour Avg       4.09         Good
Peak Hour Orders      8            High
Off-Peak Orders       2            Low
Lunch Rush (12-14)    13 orders    Very High
Evening (17-19)       5 orders     Medium

Velocity Score: 7.5/10 (Healthy volume)
```

### Expected Outcome
- Accurate order count tracking
- Multi-period comparison
- Peak hour identification
- Order frequency analysis
- Support for staffing decisions

### Verification Checklist
- [ ] get_orders_count method implemented
- [ ] Today's count calculated
- [ ] Weekly count calculated
- [ ] Monthly count calculated
- [ ] Daily averages computed
- [ ] Peak hour identified
- [ ] Order frequency calculated
- [ ] Trend direction determined
- [ ] Change percentage computed
- [ ] Returns proper dictionary structure
- [ ] Integrated into calculate method

---

## Task 24: Add Top Selling Products KPI

### Overview
Implement the get_top_products method that identifies and ranks the best-selling products by quantity and revenue. This metric provides crucial insights for inventory management, marketing decisions, and product strategy.

### Dependencies
- Task 23: Add Orders Count KPI

### Instructions

1. **Add get_top_products method**
   - Create public method in SalesKPICalculator
   - Return top 5 products by sales
   - Include both quantity and revenue rankings

2. **Query invoice items**
   - Get all InvoiceItems for today
   - Filter by tenant through invoice relationship
   - Exclude voided invoices
   - Group by product

3. **Calculate quantity sold**
   - SUM(quantity) for each product
   - Order by quantity descending
   - Get top 5 products

4. **Calculate revenue per product**
   - SUM(quantity × unit_price) for each product
   - Order by revenue descending
   - Get top 5 products

5. **Combine rankings**
   - Create unified list of top products
   - Include both quantity and revenue rank
   - Handle products in both lists

6. **Add product details**
   - Product name
   - Category
   - SKU
   - Current stock level
   - Product image URL (if available)

7. **Calculate metrics**
   - Total quantity sold
   - Total revenue generated
   - Percentage of daily sales
   - Average selling price
   - Units per order

8. **Add comparison data**
   - Compare to yesterday's top products
   - Identify new entries to top 5
   - Identify products that dropped off

9. **Format return dictionary**
   - Array of top 5 products
   - Each with complete metrics
   - Include ranking positions
   - Include trend indicators

10. **Update calculate method**
    - Call get_top_products()
    - Add result to KPIs dictionary

### Top Products KPI Structure

```
┌────────────────────────────────────────────────┐
│        Top Selling Products KPI Output         │
├────────────────────────────────────────────────┤
│ {                                              │
│   "by_quantity": [                             │
│     {                                          │
│       "rank": 1,                               │
│       "product_id": "PRD-001",                 │
│       "name": "Samsung Galaxy A54",            │
│       "category": "Electronics",               │
│       "sku": "SMSNG-A54-BLK",                  │
│       "quantity_sold": 24,                     │
│       "revenue": 576000.00,                    │
│       "formatted_revenue": "LKR 576,000.00",   │
│       "avg_price": 24000.00,                   │
│       "percentage_of_sales": 15.2,             │
│       "stock_level": 45,                       │
│       "trend": "up",                           │
│       "rank_change": 0                         │
│     },                                         │
│     ...4 more products                         │
│   ],                                           │
│   "by_revenue": [                              │
│     ...similar structure                       │
│   ],                                           │
│   "new_entries": ["PRD-008"],                  │
│   "dropped_out": ["PRD-015"]                   │
│ }                                              │
└────────────────────────────────────────────────┘
```

### Top Products by Quantity Example

```
Top 5 Products by Units Sold (Today)
═══════════════════════════════════

Rank  Product Name           Qty    Revenue      % Sales  Avg Price
────────────────────────────────────────────────────────────────────
  1   Samsung Galaxy A54      24   576,000.00    15.2%   24,000.00
  2   Rice 5kg Pack           18    27,000.00     7.1%    1,500.00
  3   Dell Laptop i5          15   750,000.00    19.8%   50,000.00
  4   Lux Soap 100g           14     2,800.00     0.7%      200.00
  5   Coca Cola 1.5L          12     3,600.00     0.9%      300.00
────────────────────────────────────────────────────────────────────
TOP 5 TOTAL                   83  1,359,400.00   35.7%   16,366.27
```

### Top Products by Revenue Example

```
Top 5 Products by Revenue (Today)
════════════════════════════════

Rank  Product Name           Qty    Revenue      % Sales  Avg Price
────────────────────────────────────────────────────────────────────
  1   Dell Laptop i5          15   750,000.00    19.8%   50,000.00
  2   Samsung Galaxy A54      24   576,000.00    15.2%   24,000.00
  3   iPhone 13 Pro            8   480,000.00    12.7%   60,000.00
  4   LG Refrigerator          3   270,000.00     7.1%   90,000.00
  5   Sony TV 55"              2   200,000.00     5.3%  100,000.00
────────────────────────────────────────────────────────────────────
TOP 5 TOTAL                   52  2,276,000.00   60.1%   43,769.23

Insight: Top 5 products generate 60% of daily revenue
```

### Product Performance Matrix

```
Product Analysis Grid
════════════════════

Product              Qty Rank  Rev Rank  Status      Action
──────────────────────────────────────────────────────────────
Samsung Galaxy A54      #1       #2      Star        Maintain stock
Dell Laptop i5          #3       #1      High Value  Increase stock
Rice 5kg Pack           #2      #15      Volume      Monitor margin
Lux Soap                #4      #45      Basic       Adequate stock
iPhone 13 Pro          #12       #3      Premium     VIP customer item
──────────────────────────────────────────────────────────────

Legend:
• Star:       High qty + High revenue
• High Value: Medium qty + High revenue (premium)
• Volume:     High qty + Low revenue (essentials)
• Basic:      Low qty + Low revenue (convenience)
• Premium:    Low qty + Very high revenue (luxury)
```

### Trend Analysis

```
Day-over-Day Product Ranking Changes
═══════════════════════════════════

Product             Yesterday  Today  Change
─────────────────────────────────────────────
Samsung A54            #2       #1     ↑ +1
Dell Laptop            #1       #2     ↓ -1
Rice 5kg               #4       #3     ↑ +1
Lux Soap               #3       #4     ↓ -1
Coca Cola              #7       #5     ↑ +2  ⭐ Rising

New Entry:
• iPhone 13 Pro (not in yesterday's top 10)

Dropped Out:
• Samsung TV 43" (was #5 yesterday)
```

### Category Performance

```
Top Products by Category
═══════════════════════

Electronics:
  1. Samsung Galaxy A54    24 units   576,000 LKR
  2. Dell Laptop i5        15 units   750,000 LKR
  3. iPhone 13 Pro          8 units   480,000 LKR
  Category Total:          47 units 1,806,000 LKR

Groceries:
  1. Rice 5kg Pack         18 units    27,000 LKR
  2. Dhal 1kg              15 units    15,000 LKR
  3. Sugar 1kg             12 units    12,000 LKR
  Category Total:          45 units    54,000 LKR

Personal Care:
  1. Lux Soap 100g         14 units     2,800 LKR
  2. Signal Toothpaste     10 units     3,000 LKR
  3. Sunsilk Shampoo        8 units     3,200 LKR
  Category Total:          32 units     9,000 LKR
```

### Stock Level Alerts

| Product | Sold Today | Current Stock | Days of Stock | Alert |
|---------|-----------|---------------|---------------|-------|
| Samsung Galaxy A54 | 24 | 45 | 1.9 | ⚠️ LOW |
| Dell Laptop i5 | 15 | 8 | 0.5 | 🔴 CRITICAL |
| Rice 5kg Pack | 18 | 120 | 6.7 | ✅ OK |
| Lux Soap | 14 | 200 | 14.3 | ✅ OK |
| iPhone 13 Pro | 8 | 3 | 0.4 | 🔴 CRITICAL |

**Actions Required:**
- Reorder Dell Laptop i5 immediately
- Reorder Samsung Galaxy A54 today
- Reorder iPhone 13 Pro if demand continues

### Sales Velocity

```
Product Velocity Metrics
═══════════════════════

Product              Orders/Hour  Avg Order Qty  Stock Turns/Month
───────────────────────────────────────────────────────────────────
Samsung Galaxy A54      2.2          1.6            15.2
Dell Laptop i5          1.4          1.2            12.5
Rice 5kg Pack           1.6          1.5            18.0
Lux Soap                1.3          1.1            22.0
Coca Cola 1.5L          1.1          1.0            20.0

High Velocity = Fast-moving items (>15 turns/month)
Medium Velocity = Steady sellers (8-15 turns/month)
Low Velocity = Slow movers (<8 turns/month)
```

### Product Mix Analysis

```
Sales Composition
════════════════

By Volume:
• Electronics:    40% of units sold
• Groceries:      35% of units sold
• Personal Care:  15% of units sold
• Other:          10% of units sold

By Revenue:
• Electronics:    75% of revenue
• Groceries:      12% of revenue
• Personal Care:   8% of revenue
• Other:           5% of revenue

Insight: Electronics drive revenue, groceries drive traffic
```

### Expected Outcome
- Identification of top 5 selling products
- Dual ranking by quantity and revenue
- Product performance metrics
- Stock level awareness
- Trend identification
- Support for inventory decisions

### Verification Checklist
- [ ] get_top_products method implemented
- [ ] Invoice items queried correctly
- [ ] Products grouped and aggregated
- [ ] Top 5 by quantity calculated
- [ ] Top 5 by revenue calculated
- [ ] Product details included
- [ ] Metrics calculated correctly
- [ ] Stock levels included
- [ ] Trend comparison added
- [ ] New/dropped products identified
- [ ] Returns proper dictionary structure
- [ ] Integrated into calculate method

---

## Summary

This document established the core sales metrics foundation:

### Completed Components
- ✅ SalesKPICalculator with base functionality
- ✅ Today's Sales KPI with day-over-day comparison
- ✅ Weekly Sales KPI with 7-day tracking
- ✅ Monthly Sales KPI with month-to-date calculation
- ✅ Sales Growth KPI with multi-period analysis
- ✅ Average Order Value KPI with trend tracking
- ✅ Orders Count KPI with peak hour analysis
- ✅ Top Selling Products KPI with dual rankings

### Key Achievements
1. **Real-Time Metrics** - Current sales performance tracking
2. **Historical Comparison** - Trend analysis across periods
3. **Customer Insights** - AOV and order patterns
4. **Product Intelligence** - Top performers identification
5. **Sri Lankan Context** - LKR currency, local business patterns

### Next Steps
Proceed to [02_Tasks-25-32_Sales-Trends-Caching.md](02_Tasks-25-32_Sales-Trends-Caching.md) to implement top customers, sales by category/channel, trend data for charts, Redis caching, and API endpoints.

---

**Document Status:** ✅ Complete  
**Total Tasks:** 8  
**Estimated Time:** 3.5 hours
