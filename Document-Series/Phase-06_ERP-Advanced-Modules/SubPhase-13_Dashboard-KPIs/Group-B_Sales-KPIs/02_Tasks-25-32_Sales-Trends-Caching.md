# Tasks 25-32: Sales Trends and Caching

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 13 - Dashboard KPIs  
> **Group:** B - Sales KPIs  
> **Document:** 02 of 02  
> **Tasks Covered:** 25, 26, 27, 28, 29, 30, 31, 32

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-17-24_Sales-Metrics.md](01_Tasks-17-24_Sales-Metrics.md)

---

## Document Overview

This document covers advanced sales analytics including top customers, sales breakdowns by category and channel, trend data for visualization, comparison metrics, and Redis caching implementation. It also includes the API endpoint setup for exposing all sales KPIs to the frontend dashboard. These features enable comprehensive sales analysis and ensure optimal performance through intelligent caching.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 25 | Add Top Customers KPI | Medium | 35 min |
| 26 | Add Sales by Category KPI | Medium | 30 min |
| 27 | Add Sales by Channel KPI | Medium | 30 min |
| 28 | Add Sales Trend Data | Medium | 40 min |
| 29 | Add Comparison Data | Medium | 35 min |
| 30 | Create Sales KPI Cache | Medium | 40 min |
| 31 | Add Cache Invalidation | Medium | 35 min |
| 32 | Create Sales KPI Endpoint | Low | 25 min |

---

## Task 25: Add Top Customers KPI

### Overview
Implement the get_top_customers method that identifies and ranks the highest-value customers by total spending. This metric helps identify VIP customers, track customer loyalty, and inform customer relationship management strategies.

### Dependencies
- Task 24: Add Top Selling Products KPI
- Customer model exists
- SalesInvoice with customer relationship

### Instructions

1. **Add get_top_customers method**
   - Create public method in SalesKPICalculator
   - Return top 5 customers by spending
   - Include today, week, and month rankings

2. **Query customer sales**
   - Get all SalesInvoices grouped by customer
   - Filter by tenant and date range
   - Exclude voided invoices
   - Aggregate total spending

3. **Calculate total spending**
   - SUM(total_amount) for each customer
   - Order by total descending
   - Get top 5 customers

4. **Calculate order count per customer**
   - COUNT(invoices) for each customer
   - Average order value per customer
   - Include in customer data

5. **Add customer details**
   - Customer name
   - Customer code/ID
   - Contact information
   - Customer type (Regular/VIP/Wholesale)
   - Loyalty tier if applicable

6. **Calculate customer metrics**
   - Total spent today/week/month
   - Number of orders
   - Average order value
   - Percentage of total sales
   - Last purchase date

7. **Identify customer trends**
   - Compare to previous period
   - New customers in top 5
   - Customers dropped from top 5
   - Spending trend (increasing/decreasing)

8. **Add loyalty insights**
   - Repeat customer rate
   - Customer lifetime value estimate
   - Purchase frequency
   - Days since last purchase

9. **Format return dictionary**
   - Array of top 5 customers
   - Each with complete metrics
   - Include ranking positions
   - Include trend indicators

10. **Update calculate method**
    - Call get_top_customers()
    - Add result to KPIs dictionary

### Top Customers KPI Structure

```
┌────────────────────────────────────────────────┐
│        Top Customers KPI Output                │
├────────────────────────────────────────────────┤
│ {                                              │
│   "today": [                                   │
│     {                                          │
│       "rank": 1,                               │
│       "customer_id": "CUST-001",               │
│       "name": "Sampath Electronics",           │
│       "customer_type": "Wholesale",            │
│       "total_spent": 185400.00,                │
│       "formatted_amount": "LKR 185,400.00",    │
│       "orders_count": 3,                       │
│       "avg_order_value": 61800.00,             │
│       "percentage_of_sales": 14.8,             │
│       "last_purchase": "2026-01-25 15:30",     │
│       "trend": "up",                           │
│       "rank_change": 0,                        │
│       "loyalty_tier": "Platinum"               │
│     },                                         │
│     ...4 more customers                        │
│   ],                                           │
│   "week": [...similar structure],             │
│   "month": [...similar structure],            │
│   "new_entries": ["CUST-089"],                 │
│   "repeat_customer_rate": 67.5                 │
│ }                                              │
└────────────────────────────────────────────────┘
```

### Top Customers by Spending Example

```
Top 5 Customers by Spending (Today)
══════════════════════════════════

Rank  Customer Name          Orders  Total Spent    AOV       % Sales
──────────────────────────────────────────────────────────────────────
  1   Sampath Electronics      3     185,400.00  61,800.00   14.8%
  2   Tech Solutions Ltd       2     145,000.00  72,500.00   11.6%
  3   Perera Trading Co        4      98,500.00  24,625.00    7.9%
  4   Jayawardena Stores       3      82,300.00  27,433.33    6.6%
  5   Silva Retail             5      67,800.00  13,560.00    5.4%
──────────────────────────────────────────────────────────────────────
TOP 5 TOTAL                   17     579,000.00  34,058.82   46.3%

Insight: Top 5 customers account for 46% of daily revenue
```

### Customer Type Distribution

```
Customer Type Analysis
═════════════════════

Type          Customers  Total Spent   Avg Spent  % of Revenue
────────────────────────────────────────────────────────────────
Wholesale         5      450,000.00   90,000.00     35.9%
VIP              3      320,000.00  106,666.67     25.5%
Regular         37      355,450.00    9,606.76     28.3%
Walk-in         12      130,000.00   10,833.33     10.4%
────────────────────────────────────────────────────────────────
TOTAL           57    1,255,450.00   22,025.44    100.0%

Insight: Wholesale (5 customers) = 36% of revenue
Action: Focus on wholesale customer retention
```

### Customer Ranking Changes

```
Week-over-Week Customer Ranking
═══════════════════════════════

Customer               Last Week  This Week  Change  Spending Change
─────────────────────────────────────────────────────────────────────
Sampath Electronics       #2         #1      ↑ +1    +22.5%
Tech Solutions            #1         #2      ↓ -1     -5.2%
Perera Trading            #5         #3      ↑ +2    +18.3%
Jayawardena Stores        #4         #4      →  0     +2.1%
Silva Retail             #10         #5      ↑ +5    +45.8%  ⭐

New Entry:
• Silva Retail (was #10, jumped to #5)

Dropped Out:
• Fernando Wholesale (was #3 last week)
```

### Customer Loyalty Tiers

```
Loyalty Tier System
══════════════════

Tier        Criteria              Benefits           Customers
──────────────────────────────────────────────────────────────
Platinum    >500K LKR/month       5% discount           3
Gold        250K-500K LKR/month   3% discount           8
Silver      100K-250K LKR/month   2% discount          15
Bronze      50K-100K LKR/month    1% discount          22
Regular     <50K LKR/month        Points only         125
──────────────────────────────────────────────────────────────

Current Top 5 Tiers:
1. Sampath Electronics - Platinum
2. Tech Solutions Ltd  - Platinum
3. Perera Trading Co   - Gold
4. Jayawardena Stores  - Gold
5. Silva Retail        - Silver
```

### Customer Lifetime Value Estimation

```
Estimated CLV (Customer Lifetime Value)
═══════════════════════════════════════

Customer               Months  Total Spent  Avg/Month  Est. 12M CLV
───────────────────────────────────────────────────────────────────
Sampath Electronics      18   2,850,000   158,333.33   1,900,000
Tech Solutions Ltd       24   4,200,000   175,000.00   2,100,000
Perera Trading Co        12     980,000    81,666.67     980,000
Jayawardena Stores       36   3,600,000   100,000.00   1,200,000
Silva Retail              6     350,000    58,333.33     700,000

Total CLV (Top 5): 6,880,000 LKR/year
```

### Purchase Frequency Analysis

```
Customer Purchase Patterns
═════════════════════════

Customer             Last 30 Days                Frequency
                     Orders   Avg Days Between   Category
───────────────────────────────────────────────────────────
Sampath Electronics    12         2.5 days       Very High
Tech Solutions          8         3.8 days       High
Perera Trading         15         2.0 days       Very High
Jayawardena Stores     10         3.0 days       High
Silva Retail           20         1.5 days       Daily

Frequency Categories:
• Daily:      1-2 days between purchases
• Very High:  2-3 days between purchases
• High:       3-5 days between purchases
• Medium:     5-10 days between purchases
• Low:        >10 days between purchases
```

### Customer Retention Metrics

```
Retention Analysis
═════════════════

Metric                        Value      Status
───────────────────────────────────────────────
Repeat Customer Rate          67.5%      Good
New Customer Rate             32.5%      Healthy
30-Day Retention              82.3%      Excellent
60-Day Retention              75.8%      Good
90-Day Retention              68.2%      Fair

Churn Risk:
• High Risk: 3 customers (haven't purchased in 45+ days)
• Medium Risk: 8 customers (30-45 days)
• Low Risk: 46 customers (active in last 30 days)
```

### Customer Contact Information

| Customer | Phone | Email | Preferred Contact | Last Contact |
|----------|-------|-------|------------------|--------------|
| Sampath Electronics | +94 77 123 4567 | sampath@example.lk | Phone | Jan 20 |
| Tech Solutions Ltd | +94 11 234 5678 | info@techsol.lk | Email | Jan 22 |
| Perera Trading | +94 71 987 6543 | perera@trading.lk | Phone | Jan 24 |
| Jayawardena | +94 77 456 7890 | jay@stores.lk | WhatsApp | Jan 23 |
| Silva Retail | +94 11 876 5432 | silva@retail.lk | Email | Jan 25 |

### Customer Segment Performance

```
Customer Segmentation
════════════════════

Segment             Customers  Revenue     AOV       Orders
──────────────────────────────────────────────────────────
VIP (Top 5)            5      579,000   68,000      17
High Value (6-20)     15      425,000   23,500      45
Medium Value (21-50)  30      185,000    8,500      62
Small Value (51+)     28       66,450    3,200      78
──────────────────────────────────────────────────────────
TOTAL                 78    1,255,450   15,700     202

80/20 Rule: Top 5 customers (6.4%) = 46% of revenue ✓
```

### Expected Outcome
- Identification of top 5 customers
- Customer spending metrics
- Purchase frequency analysis
- Loyalty tier tracking
- Customer retention insights
- Support for CRM strategies

### Verification Checklist
- [ ] get_top_customers method implemented
- [ ] Customer sales aggregated correctly
- [ ] Top 5 by spending calculated
- [ ] Order count per customer computed
- [ ] Customer details included
- [ ] AOV per customer calculated
- [ ] Loyalty tier assigned
- [ ] Purchase frequency analyzed
- [ ] Trend comparison added
- [ ] Repeat customer rate calculated
- [ ] Returns proper dictionary structure
- [ ] Integrated into calculate method

---

## Task 26: Add Sales by Category KPI

### Overview
Implement the get_sales_by_category method that breaks down sales performance across product categories. This analysis helps identify which product categories are driving revenue, which need attention, and how to optimize inventory and marketing strategies.

### Dependencies
- Task 25: Add Top Customers KPI
- Product model with category field
- Category model exists

### Instructions

1. **Add get_sales_by_category method**
   - Create public method in SalesKPICalculator
   - Return sales breakdown by category
   - Include today, week, and month data

2. **Query sales by category**
   - Join InvoiceItems with Products
   - Group by product category
   - Aggregate sales per category
   - Filter by tenant and date range

3. **Calculate category metrics**
   - Total revenue per category
   - Total units sold per category
   - Number of orders containing category
   - Average order value per category

4. **Calculate category percentages**
   - Percentage of total revenue
   - Percentage of total units
   - Category contribution to daily/weekly/monthly sales

5. **Rank categories**
   - Order by revenue descending
   - Assign rank positions
   - Identify top 3 categories

6. **Calculate category trends**
   - Compare to previous period
   - Growth/decline percentage
   - Trend direction indicator
   - Identify rising/falling categories

7. **Add category details**
   - Category name
   - Number of products in category
   - Average product price in category
   - Stock value in category

8. **Calculate category mix**
   - Revenue concentration (diversification)
   - Category dependency score
   - Balanced vs. concentrated sales

9. **Format return dictionary**
   - Array of all categories
   - Each with complete metrics
   - Include rankings
   - Include trend indicators

10. **Update calculate method**
    - Call get_sales_by_category()
    - Add result to KPIs dictionary

### Sales by Category KPI Structure

```
┌────────────────────────────────────────────────┐
│       Sales by Category KPI Output             │
├────────────────────────────────────────────────┤
│ {                                              │
│   "today": [                                   │
│     {                                          │
│       "rank": 1,                               │
│       "category_id": "CAT-001",                │
│       "category_name": "Electronics",          │
│       "revenue": 945000.00,                    │
│       "formatted_revenue": "LKR 945,000.00",   │
│       "units_sold": 47,                        │
│       "orders_count": 28,                      │
│       "avg_order_value": 33750.00,             │
│       "percentage_of_sales": 75.3,             │
│       "trend": "up",                           │
│       "growth_percent": 12.5,                  │
│       "products_in_category": 85,              │
│       "avg_product_price": 20106.38            │
│     },                                         │
│     ...other categories                        │
│   ],                                           │
│   "top_3_categories": [...],                   │
│   "concentration_score": 68.5,                 │
│   "diversity_status": "Concentrated"           │
│ }                                              │
└────────────────────────────────────────────────┘
```

### Category Performance Example

```
Sales by Category (Today - January 25, 2026)
═══════════════════════════════════════════

Category         Revenue      Units  Orders  %Sales  AOV        Growth
────────────────────────────────────────────────────────────────────────
Electronics    945,000.00     47     28     75.3%  33,750.00   +12.5% ↑
Clothing       150,000.00     85     12     12.0%  12,500.00    +5.2% ↑
Groceries       85,000.00    220     15      6.8%   5,666.67    -3.1% ↓
Home & Living   45,000.00     18      8      3.6%   5,625.00    +8.7% ↑
Personal Care   18,450.00     42      9      1.5%   2,050.00    +2.3% ↑
Other           12,000.00     15      6      1.0%   2,000.00   -12.0% ↓
────────────────────────────────────────────────────────────────────────
TOTAL       1,255,450.00    427     78    100.0%  16,095.51

Concentration: 75.3% in Electronics (High)
Status: Revenue concentrated in one category
```

### Category Revenue Distribution

```
Revenue Distribution Chart
═════════════════════════

Electronics  ████████████████████████████████████████ 75.3%
Clothing     ██████ 12.0%
Groceries    ████ 6.8%
Home         ██ 3.6%
Personal     █ 1.5%
Other        █ 1.0%

Distribution Type: Highly Concentrated
Risk Level: Medium (over-reliance on Electronics)
Recommendation: Diversify revenue sources
```

### Category Trend Analysis

```
Week-over-Week Category Trends
══════════════════════════════

Category        Last Week   This Week   Change     Status
───────────────────────────────────────────────────────────
Electronics     840,000    945,000    +12.5% ↑    Growing
Clothing        142,500    150,000     +5.3% ↑    Stable
Groceries        87,700     85,000     -3.1% ↓    Declining
Home & Living    41,400     45,000     +8.7% ↑    Growing
Personal Care    18,000     18,450     +2.5% ↑    Stable
Other            13,650     12,000    -12.1% ↓    Declining

Rising Stars: Home & Living (+8.7%)
Needs Attention: Other (-12.1%)
```

### Category Mix Analysis

```
Category Mix Score
═════════════════

Metric                        Value      Ideal      Status
──────────────────────────────────────────────────────────
Revenue Concentration         75.3%      <60%       HIGH
Category Count with Sales        6         8+       Low
Top 3 Category Share          94.1%      <75%       HIGH
Diversity Index              0.325      >0.5       Poor
Balance Score                3.2/10      >6.0       Needs Work

Interpretation:
• Over-reliant on Electronics
• Need to grow other categories
• Limited product diversity
• Risk if Electronics demand drops
```

### Category Performance Matrix

```
BCG Matrix: Category Analysis
════════════════════════════

High Growth
    │
    │  ★ Stars              ? Question Marks
    │  ──────────           ─────────────────
    │  • Home & Living      • Personal Care
    │    (+8.7%, high rev)    (+2.5%, low rev)
    │
    │
────┼─────────────────────────────────────────
    │
    │  💰 Cash Cows         🐕 Dogs
    │  ──────────           ────
    │  • Electronics        • Other
    │    (+12.5%, 75%)        (-12%, 1%)
    │  • Clothing            • Groceries
    │    (+5.3%, 12%)         (-3.1%, 7%)
    │
Low Growth

Strategy:
★ Stars: Invest and grow
💰 Cash Cows: Maintain and milk
? Question Marks: Investigate potential
🐕 Dogs: Improve or phase out
```

### Category-Specific Insights

```
Electronics (75.3% of Sales)
═══════════════════════════

Top Products:
1. Laptops         450,000 LKR (15 units)
2. Smartphones     380,000 LKR (24 units)
3. Tablets         115,000 LKR (8 units)

Margin: 22% average
Stock Turn: 12.5 times/month
Customer Type: 60% Regular, 40% Walk-in

Insight: High revenue but margin pressure
Action: Focus on accessories (higher margins)


Clothing (12% of Sales)
══════════════════════

Top Products:
1. Men's Shirts     65,000 LKR (35 units)
2. Women's Dresses  50,000 LKR (20 units)
3. Kids Wear        35,000 LKR (30 units)

Margin: 45% average
Stock Turn: 6.2 times/month
Customer Type: 75% Regular, 25% Walk-in

Insight: Good margins, steady growth
Action: Expand inventory, seasonal promotions


Groceries (6.8% of Sales)
════════════════════════

Top Products:
1. Rice 5kg         27,000 LKR (18 packs)
2. Dhal 1kg         15,000 LKR (15 packs)
3. Sugar 1kg        12,000 LKR (12 packs)

Margin: 15% average
Stock Turn: 25 times/month
Customer Type: 85% Regular, 15% Walk-in

Insight: High turnover, low margins, declining
Action: Review pricing, reduce variety
```

### Seasonal Category Patterns

```
Expected Seasonal Variations (Sri Lanka)
═══════════════════════════════════════

Category          Peak Months          Low Months
──────────────────────────────────────────────────
Electronics       Apr, Nov, Dec        Feb, Jun
Clothing          Apr, Aug, Dec        Jan, Feb
Groceries         Stable year-round    -
Home & Living     Apr, Nov, Dec        May, Jun
Personal Care     Stable year-round    -

Current Month: January
Expected: Electronics post-holiday dip ✓ (observed)
Expected: Clothing low season ✓ (stable but low)
```

### Category Recommendations

| Category | Action | Priority | Expected Impact |
|----------|--------|----------|-----------------|
| Electronics | Maintain stock levels | High | Continue dominance |
| Clothing | Expand with seasonal items | Medium | +3-5% sales |
| Groceries | Review pricing/margins | Medium | Improve profitability |
| Home & Living | Increase inventory | High | +2-3% sales |
| Personal Care | Add premium products | Low | +1% sales |
| Other | Phase out slow movers | Medium | Reduce inventory costs |

### Expected Outcome
- Complete sales breakdown by category
- Revenue distribution analysis
- Category trend identification
- Mix and concentration insights
- Strategic recommendations per category

### Verification Checklist
- [ ] get_sales_by_category method implemented
- [ ] Sales grouped by category
- [ ] Revenue per category calculated
- [ ] Units sold per category computed
- [ ] Percentages calculated
- [ ] Rankings assigned
- [ ] Trend analysis included
- [ ] Category mix scored
- [ ] Top 3 categories identified
- [ ] Concentration score calculated
- [ ] Returns proper dictionary structure
- [ ] Integrated into calculate method

---

## Task 27: Add Sales by Channel KPI

### Overview
Implement the get_sales_by_channel method that breaks down sales performance across different sales channels (POS and Webstore). This analysis is crucial for understanding channel effectiveness, customer preferences, and optimizing omnichannel strategies specific to the Sri Lankan market.

### Dependencies
- Task 26: Add Sales by Category KPI
- SalesInvoice with channel field
- Channel constants defined

### Instructions

1. **Add get_sales_by_channel method**
   - Create public method in SalesKPICalculator
   - Return sales breakdown by channel
   - Include today, week, and month data

2. **Define channel constants**
   - CHANNEL_POS = 'pos'
   - CHANNEL_WEBSTORE = 'webstore'
   - Add to constants if not exists

3. **Query sales by channel**
   - Group SalesInvoices by channel field
   - Aggregate revenue per channel
   - Filter by tenant and date range
   - Exclude voided invoices

4. **Calculate channel metrics**
   - Total revenue per channel
   - Number of orders per channel
   - Average order value per channel
   - Units sold per channel

5. **Calculate channel percentages**
   - Percentage of total revenue
   - Percentage of total orders
   - Channel contribution ratios

6. **Calculate channel trends**
   - Compare to previous period
   - Growth/decline percentage per channel
   - Trend direction indicators
   - Channel shift analysis

7. **Calculate channel efficiency**
   - Revenue per hour of operation
   - Orders per hour
   - Conversion rates (for webstore)
   - Transaction time (for POS)

8. **Add channel-specific metrics**
   - POS: Peak hours, cashier efficiency
   - Webstore: Traffic, conversion rate, cart abandonment
   - Compare performance between channels

9. **Format return dictionary**
   - Object with channel breakdowns
   - Each channel with complete metrics
   - Include comparison data
   - Include trend indicators

10. **Update calculate method**
    - Call get_sales_by_channel()
    - Add result to KPIs dictionary

### Sales by Channel KPI Structure

```
┌────────────────────────────────────────────────┐
│       Sales by Channel KPI Output              │
├────────────────────────────────────────────────┤
│ {                                              │
│   "pos": {                                     │
│     "revenue": 800000.00,                      │
│     "formatted_revenue": "LKR 800,000.00",     │
│     "orders": 52,                              │
│     "units_sold": 285,                         │
│     "avg_order_value": 15384.62,               │
│     "percentage_revenue": 63.7,                │
│     "percentage_orders": 66.7,                 │
│     "trend": "up",                             │
│     "growth_percent": 8.5,                     │
│     "peak_hour": "14:00-15:00",                │
│     "orders_per_hour": 4.7,                    │
│     "avg_transaction_time": "3.2 min"          │
│   },                                           │
│   "webstore": {                                │
│     "revenue": 455450.00,                      │
│     "formatted_revenue": "LKR 455,450.00",     │
│     "orders": 26,                              │
│     "units_sold": 142,                         │
│     "avg_order_value": 17517.31,               │
│     "percentage_revenue": 36.3,                │
│     "percentage_orders": 33.3,                 │
│     "trend": "up",                             │
│     "growth_percent": 15.2,                    │
│     "site_visits": 450,                        │
│     "conversion_rate": 5.78,                   │
│     "cart_abandonment_rate": 18.5              │
│   },                                           │
│   "total": {                                   │
│     "revenue": 1255450.00,                     │
│     "orders": 78                               │
│   },                                           │
│   "channel_shift": "Webstore gaining"          │
│ }                                              │
└────────────────────────────────────────────────┘
```

### Channel Performance Comparison

```
Channel Performance (Today - January 25, 2026)
═════════════════════════════════════════════

Metric              POS           Webstore      Difference
────────────────────────────────────────────────────────────
Revenue          800,000.00     455,450.00    +75.6% POS
Orders                  52             26    +100.0% POS
Units Sold             285            142    +100.7% POS
AOV               15,384.62      17,517.31    +13.9% Web
% Revenue            63.7%          36.3%         -
% Orders             66.7%          33.3%         -
Growth %            +8.5%         +15.2%    +6.7pp Web

Insights:
• POS dominates volume (2:1 ratio)
• Webstore has higher AOV (+14%)
• Webstore growing faster (+15% vs +9%)
• Both channels performing well
```

### Channel Revenue Breakdown

```
Revenue by Channel
═════════════════

POS          ████████████████████████████████ 63.7%  (800,000 LKR)
Webstore     ████████████████ 36.3%  (455,450 LKR)

Channel Mix: Balanced (both >30%)
Status: Healthy omnichannel presence
Sri Lanka Context: POS still dominant but webstore growing
```

### Channel Trend Analysis

```
Week-over-Week Channel Growth
════════════════════════════

Channel      Last Week   This Week   Change      Status
──────────────────────────────────────────────────────────
POS          737,000     800,000    +8.5% ↑     Steady
Webstore     395,400     455,450   +15.2% ↑     Accelerating

Month-over-Month:
POS:         2,050,000   2,200,000   +7.3% ↑
Webstore:      875,000   1,100,000  +25.7% ↑

Insight: Webstore growth outpacing POS
Trend: Digital channel adoption increasing
Action: Invest in webstore infrastructure
```

### POS Channel Deep Dive

```
POS Performance Details
══════════════════════

Today's Metrics:
───────────────
Revenue:             800,000 LKR
Orders:              52
Units Sold:          285
Average Order:       15,384.62 LKR
Orders/Hour:         4.7

Peak Performance:
────────────────
Peak Hour:           14:00-15:00 (8 orders)
Busiest Period:      13:00-16:00 (22 orders)
Slowest Period:      08:00-10:00 (5 orders)

Transaction Efficiency:
──────────────────────
Avg Transaction Time:   3.2 minutes
Fastest Transaction:    1.5 minutes
Slowest Transaction:    8.3 minutes

Payment Methods:
───────────────
Cash:                35 orders (67.3%)
Card:                12 orders (23.1%)
Digital Wallet:       5 orders (9.6%)

Staff Performance:
─────────────────
Cashier A:           22 orders (42.3%)
Cashier B:           18 orders (34.6%)
Cashier C:           12 orders (23.1%)

Customer Types:
──────────────
Regular:             38 orders (73.1%)
Walk-in:             14 orders (26.9%)
```

### Webstore Channel Deep Dive

```
Webstore Performance Details
════════════════════════════

Today's Metrics:
───────────────
Revenue:             455,450 LKR
Orders:              26
Units Sold:          142
Average Order:       17,517.31 LKR
Orders/Hour:         2.4

Traffic & Conversion:
────────────────────
Site Visits:         450
Product Views:       1,250
Add to Carts:        32
Orders:              26
Conversion Rate:     5.78%
Cart Abandonment:    18.5%

Top Pages:
─────────
Homepage:            185 visits
Product Pages:       520 visits
Category Pages:      280 visits
Checkout:            32 visits

Device Breakdown:
────────────────
Mobile:              315 visits (70.0%)
Desktop:             105 visits (23.3%)
Tablet:               30 visits (6.7%)

Payment Methods:
───────────────
Credit/Debit Card:   18 orders (69.2%)
Digital Wallet:       5 orders (19.2%)
Bank Transfer:        3 orders (11.6%)

Shipping Methods:
────────────────
Standard (5-7 days): 18 orders (69.2%)
Express (2-3 days):   6 orders (23.1%)
Same Day:             2 orders (7.7%)

Customer Types:
──────────────
Registered:          22 orders (84.6%)
Guest Checkout:       4 orders (15.4%)
First Time:           8 orders (30.8%)
Returning:           18 orders (69.2%)
```

### Channel Comparison Matrix

```
Channel Effectiveness Scorecard
══════════════════════════════

Metric                POS     Webstore    Winner
──────────────────────────────────────────────────
Revenue Volume        ⭐⭐⭐      ⭐⭐        POS
Average Order Value   ⭐⭐       ⭐⭐⭐      Webstore
Growth Rate           ⭐⭐       ⭐⭐⭐      Webstore
Operating Hours       ⭐⭐⭐      ⭐⭐⭐      Tie (24/7)
Customer Reach        ⭐⭐       ⭐⭐⭐      Webstore
Transaction Speed     ⭐⭐⭐      ⭐⭐        POS
Customer Service      ⭐⭐⭐      ⭐⭐        POS
Operating Cost        ⭐⭐       ⭐⭐⭐      Webstore
Impulse Purchases     ⭐⭐⭐      ⭐          POS
Product Discovery     ⭐⭐       ⭐⭐⭐      Webstore

Overall Score:        23/30    24/30      Webstore
Status:               Strong   Stronger   -
```

### Sri Lankan Market Context

```
Sri Lanka E-commerce Landscape (2026)
════════════════════════════════════

National Statistics:
• Internet Penetration: 58% (14M users)
• Smartphone Users: 75% of internet users
• Online Shopping Adoption: 35% (growing)
• Average Cart Value: 15,000-25,000 LKR

Regional Preferences:
────────────────────
Colombo:          50% webstore, 50% POS
Suburbs:          30% webstore, 70% POS
Rural Areas:      10% webstore, 90% POS

Your Business Mix:
─────────────────
Webstore: 36.3% (above national average ✓)
POS:      63.7% (traditional retail strong)

Insight: Good omnichannel balance for SL market
```

### Channel Strategy Recommendations

```
Channel Optimization Strategies
══════════════════════════════

POS Channel:
───────────
✓ Maintain as primary revenue channel
✓ Optimize peak hour staffing (13:00-16:00)
✓ Reduce transaction time (target: <3 min)
✓ Increase card payment adoption
✓ Implement queue management
✓ Train staff on upselling

Webstore Channel:
────────────────
✓ Invest in mobile experience (70% traffic)
✓ Reduce cart abandonment (18.5% → 12%)
✓ Improve conversion rate (5.78% → 7%)
✓ Expand payment options
✓ Add same-day delivery for Colombo
✓ Implement live chat support
✓ Create mobile app

Cross-Channel:
─────────────
✓ Enable click-and-collect
✓ Allow in-store returns for webstore
✓ Unified loyalty program
✓ Cross-channel inventory visibility
✓ Consistent pricing across channels
```

### Channel-Specific KPIs

```
Key Performance Indicators by Channel
════════════════════════════════════

POS KPIs:
────────
• Orders per hour: 4.7 (Target: 5.0)
• Avg transaction time: 3.2 min (Target: 2.5 min)
• Customer service rating: 4.5/5
• Staff utilization: 85%
• Cash handling accuracy: 99.8%

Webstore KPIs:
─────────────
• Conversion rate: 5.78% (Target: 7.0%)
• Cart abandonment: 18.5% (Target: 12%)
• Page load time: 2.1s (Target: <2.0s)
• Mobile responsiveness: 8.5/10
• Customer satisfaction: 4.3/5
• On-time delivery: 94%
```

### Expected Outcome
- Complete sales breakdown by channel
- Channel performance comparison
- Channel-specific metrics and insights
- Omnichannel strategy recommendations
- Sri Lankan market context

### Verification Checklist
- [ ] get_sales_by_channel method implemented
- [ ] Channel constants defined
- [ ] Sales grouped by channel
- [ ] Revenue per channel calculated
- [ ] Orders per channel computed
- [ ] AOV per channel calculated
- [ ] Percentages calculated
- [ ] Trend analysis included
- [ ] Channel-specific metrics added
- [ ] Comparison data generated
- [ ] Returns proper dictionary structure
- [ ] Integrated into calculate method

---

## Task 28: Add Sales Trend Data

### Overview
Implement the get_sales_trend_data method that generates time-series data for sales visualization in charts and graphs. This data enables the frontend to display trend lines, identify patterns, and provide visual insights into sales performance over time.

### Dependencies
- Task 27: Add Sales by Channel KPI

### Instructions

1. **Add get_sales_trend_data method**
   - Create public method in SalesKPICalculator
   - Return time-series data for charts
   - Support multiple time ranges

2. **Define time range options**
   - TREND_7_DAYS: Last 7 days daily data
   - TREND_30_DAYS: Last 30 days daily data
   - TREND_12_WEEKS: Last 12 weeks weekly data
   - TREND_12_MONTHS: Last 12 months monthly data

3. **Generate daily trend data**
   - Loop through last N days
   - Query sales for each day
   - Aggregate revenue and orders
   - Create data point for each day

4. **Generate weekly trend data**
   - Loop through last N weeks
   - Define week boundaries (Sun-Sat)
   - Query sales for each week
   - Create data point for each week

5. **Generate monthly trend data**
   - Loop through last N months
   - Define month boundaries
   - Query sales for each month
   - Create data point for each month

6. **Include data point structure**
   - Date/period label
   - Total revenue
   - Number of orders
   - Average order value
   - Units sold
   - Day of week (for daily data)

7. **Add moving averages**
   - 7-day moving average for daily data
   - 4-week moving average for weekly data
   - 3-month moving average for monthly data
   - Include in response

8. **Add trend line calculation**
   - Calculate linear regression
   - Determine trend direction
   - Calculate trend strength (R-squared)
   - Include slope and intercept

9. **Format for chart libraries**
   - Structure compatible with Chart.js
   - Include labels array
   - Include datasets array
   - Include formatting options

10. **Update calculate method**
    - Call get_sales_trend_data()
    - Add result to KPIs dictionary

### Sales Trend Data KPI Structure

```
┌────────────────────────────────────────────────┐
│        Sales Trend Data KPI Output             │
├────────────────────────────────────────────────┤
│ {                                              │
│   "period": "7_DAYS",                          │
│   "data_points": [                             │
│     {                                          │
│       "date": "2026-01-19",                    │
│       "day_of_week": "Sunday",                 │
│       "revenue": 95000.00,                     │
│       "formatted_revenue": "LKR 95,000.00",    │
│       "orders": 35,                            │
│       "units": 180,                            │
│       "avg_order_value": 2714.29               │
│     },                                         │
│     ...6 more days                             │
│   ],                                           │
│   "moving_average": [                          │
│     { "date": "2026-01-19", "value": 98500 },  │
│     ...                                        │
│   ],                                           │
│   "trend_line": {                              │
│     "direction": "up",                         │
│     "slope": 4285.71,                          │
│     "strength": 0.82,                          │
│     "points": [                                │
│       { "date": "2026-01-19", "value": 95000 },│
│       { "date": "2026-01-25", "value": 125450 }│
│     ]                                          │
│   },                                           │
│   "chart_config": {                            │
│     "labels": ["Jan 19", ..., "Jan 25"],       │
│     "datasets": [...]                          │
│   }                                            │
│ }                                              │
└────────────────────────────────────────────────┘
```

### 7-Day Trend Data Example

```
Last 7 Days Sales Trend
══════════════════════

Date        Day       Revenue      Orders   AOV        Units
───────────────────────────────────────────────────────────────
Jan 19      Sunday     95,000.00    35    2,714.29    180
Jan 20      Monday    110,000.00    42    2,619.05    220
Jan 21      Tuesday   108,500.00    40    2,712.50    210
Jan 22      Wednesday 115,200.00    44    2,618.18    230
Jan 23      Thursday  120,000.00    46    2,608.70    245
Jan 24      Friday    111,150.00    41    2,710.98    215
Jan 25      Saturday  125,450.00    45    2,787.78    250
───────────────────────────────────────────────────────────────
Total/Avg   7 days    785,300.00   293    2,680.27   1,550

7-Day MA:   112,185.71 LKR/day
Trend:      Upward (+4,285.71 LKR/day)
Strength:   Strong (R² = 0.82)
```

### Visual Trend Chart Data

```
Daily Sales Trend Chart
══════════════════════

125K ┤                                          •
     │                                      •
120K ┤                                  •
     │                              •
115K ┤                          •
     │                      •
110K ┤                  •
     │              •
105K ┤
     │
100K ┤
     │
 95K ┤          •
     └───┬───┬───┬───┬───┬───┬───
        19  20  21  22  23  24  25 (January)

Trend Line: y = 95,000 + 4,285.71x
Direction: Upward ↗
Strength: 0.82 (Strong positive correlation)
```

### 30-Day Trend Data

```
Last 30 Days Sales Summary
═════════════════════════

Week 1 (Dec 27-Jan 2):    625,000 LKR  (215 orders)
Week 2 (Jan 3-9):         680,000 LKR  (238 orders)
Week 3 (Jan 10-16):       720,000 LKR  (260 orders)
Week 4 (Jan 17-23):       750,000 LKR  (278 orders)
Week 5 (Jan 24-25):       236,600 LKR   (86 orders)
─────────────────────────────────────────────────
Total (30 days):        3,011,600 LKR (1,077 orders)

Daily Average:            100,386.67 LKR/day
Best Day:      Jan 25    125,450.00 LKR
Worst Day:     Dec 29     78,200.00 LKR
Variance:                  12.5%
Trend:                     Steadily increasing
```

### Moving Average Calculations

```
7-Day Moving Average
═══════════════════

Date      Revenue    7-Day MA    Status vs MA
────────────────────────────────────────────
Jan 19     95,000    98,500      -3.5% below
Jan 20    110,000   101,250      +8.6% above
Jan 21    108,500   103,750      +4.6% above
Jan 22    115,200   106,850      +7.8% above
Jan 23    120,000   110,250      +8.8% above
Jan 24    111,150   111,630      -0.4% below
Jan 25    125,450   112,186      +11.8% above

Insight: Recent days above MA = Positive trend
Action: Momentum building, maintain strategies
```

### Trend Strength Interpretation

```
Trend Strength (R-squared values)
════════════════════════════════

R² Value    Strength        Interpretation
──────────────────────────────────────────
0.90-1.00   Very Strong     Highly predictable trend
0.70-0.89   Strong          Clear trend pattern
0.50-0.69   Moderate        Trend exists but variable
0.30-0.49   Weak            Limited trend clarity
0.00-0.29   Very Weak       No clear trend

Your 7-Day R²: 0.82 = Strong
Meaning: Sales following predictable upward pattern
Confidence: High in short-term projections
```

### Chart.js Configuration

```json
Chart Configuration for Frontend
═══════════════════════════════

{
  "type": "line",
  "data": {
    "labels": ["Jan 19", "Jan 20", "Jan 21", "Jan 22", 
               "Jan 23", "Jan 24", "Jan 25"],
    "datasets": [
      {
        "label": "Daily Sales",
        "data": [95000, 110000, 108500, 115200, 
                 120000, 111150, 125450],
        "borderColor": "rgb(75, 192, 192)",
        "backgroundColor": "rgba(75, 192, 192, 0.2)",
        "tension": 0.1
      },
      {
        "label": "7-Day Moving Average",
        "data": [98500, 101250, 103750, 106850, 
                 110250, 111630, 112186],
        "borderColor": "rgb(255, 159, 64)",
        "borderDash": [5, 5],
        "fill": false
      },
      {
        "label": "Trend Line",
        "data": [95000, 99286, 103571, 107857, 
                 112143, 116429, 120714],
        "borderColor": "rgb(255, 99, 132)",
        "borderDash": [10, 5],
        "fill": false,
        "pointRadius": 0
      }
    ]
  },
  "options": {
    "responsive": true,
    "plugins": {
      "title": {
        "display": true,
        "text": "7-Day Sales Trend"
      },
      "tooltip": {
        "callbacks": {
          "label": function(context) {
            return "LKR " + context.parsed.y.toLocaleString();
          }
        }
      }
    },
    "scales": {
      "y": {
        "ticks": {
          "callback": function(value) {
            return "LKR " + (value/1000) + "K";
          }
        }
      }
    }
  }
}
```

### Seasonal Pattern Detection

```
Weekly Sales Pattern Detection
══════════════════════════════

Day         Avg Sales   Index   Pattern
────────────────────────────────────────
Sunday       95,000     0.85    Below Avg
Monday      110,000     0.98    Near Avg
Tuesday     108,500     0.97    Near Avg
Wednesday   115,200     1.03    Above Avg
Thursday    120,000     1.07    Above Avg
Friday      111,150     0.99    Near Avg
Saturday    125,450     1.12    Peak Day

Avg Daily:  112,186 LKR

Insight: Weekend (Sat) = Peak, Sunday = Lowest
Pattern: Builds through week, peaks Saturday
Action: Maximize Saturday staffing/inventory
```

### Forecast Based on Trend

```
Short-Term Sales Forecast
════════════════════════

Based on 7-day trend (slope: +4,285.71/day):

Date           Forecast      Confidence
─────────────────────────────────────────
Jan 26 (Sun)   129,736 LKR   High (82%)
Jan 27 (Mon)   134,022 LKR   High (82%)
Jan 28 (Tue)   138,307 LKR   Medium (70%)
Jan 29 (Wed)   142,593 LKR   Medium (65%)
Jan 30 (Thu)   146,879 LKR   Medium (60%)

Note: Forecasts based on trend continuation
Actual results may vary due to:
• Day of week effects
• Promotions/events
• External factors
• Market conditions
```

### Expected Outcome
- Time-series data for visualization
- Multiple time period support
- Moving averages included
- Trend line calculation
- Chart-ready data format
- Forecast capability

### Verification Checklist
- [ ] get_sales_trend_data method implemented
- [ ] Time range options defined
- [ ] Daily trend data generated
- [ ] Weekly trend data generated
- [ ] Monthly trend data generated
- [ ] Data points structure complete
- [ ] Moving averages calculated
- [ ] Trend line computed
- [ ] Chart configuration included
- [ ] Returns proper dictionary structure
- [ ] Integrated into calculate method

---

## Task 29: Add Comparison Data

### Overview
Implement the get_comparison_data method that provides detailed period-over-period comparisons for sales metrics. This comprehensive comparison includes day-over-day, week-over-week, month-over-month, and year-over-year analysis with variance calculations and contextual insights.

### Dependencies
- Task 28: Add Sales Trend Data

### Instructions

1. **Add get_comparison_data method**
   - Create public method in SalesKPICalculator
   - Return comprehensive comparison metrics
   - Support multiple comparison types

2. **Implement day-over-day comparison**
   - Current day vs yesterday
   - Absolute difference
   - Percentage change
   - Trend direction

3. **Implement week-over-week comparison**
   - Current week vs last week
   - Same day-of-week comparison
   - Weekly trend analysis
   - Week-to-date vs last week same period

4. **Implement month-over-month comparison**
   - Current month vs last month
   - Same date comparison (MTD)
   - Monthly trend analysis
   - Month-to-date vs last month same period

5. **Implement year-over-year comparison**
   - Current year vs last year
   - Same period comparison
   - Annual growth rate
   - YTD comparison

6. **Calculate variance analysis**
   - Absolute variance (difference)
   - Relative variance (percentage)
   - Variance significance (material/immaterial)
   - Variance direction (favorable/unfavorable)

7. **Add contextual insights**
   - Identify causes of variances
   - Seasonal factors
   - Business events impact
   - External factors

8. **Calculate compound metrics**
   - CAGR (Compound Annual Growth Rate)
   - Run rate projections
   - Velocity metrics
   - Momentum indicators

9. **Format return dictionary**
   - Comparison object with all periods
   - Include absolute and relative values
   - Include context and insights
   - Include visualization data

10. **Update calculate method**
    - Call get_comparison_data()
    - Add result to KPIs dictionary

### Comparison Data KPI Structure

```
┌────────────────────────────────────────────────┐
│        Comparison Data KPI Output              │
├────────────────────────────────────────────────┤
│ {                                              │
│   "day_over_day": {                            │
│     "current": {                               │
│       "date": "2026-01-25",                    │
│       "revenue": 125450.00,                    │
│       "orders": 45                             │
│     },                                         │
│     "previous": {                              │
│       "date": "2026-01-24",                    │
│       "revenue": 111150.00,                    │
│       "orders": 41                             │
│     },                                         │
│     "variance": {                              │
│       "absolute": 14300.00,                    │
│       "percentage": 12.9,                      │
│       "direction": "favorable",                │
│       "significance": "material"               │
│     },                                         │
│     "insight": "Strong Saturday performance"   │
│   },                                           │
│   "week_over_week": {...},                     │
│   "month_over_month": {...},                   │
│   "year_over_year": {...},                     │
│   "overall_momentum": "accelerating"           │
│ }                                              │
└────────────────────────────────────────────────┘
```

### Day-over-Day Comparison

```
Day-over-Day Analysis
════════════════════

Today (Jan 25):      125,450 LKR  (45 orders)
Yesterday (Jan 24):  111,150 LKR  (41 orders)
──────────────────────────────────────────────
Variance:            +14,300 LKR  (+4 orders)
Change %:            +12.9%       (+9.8%)
Direction:           Favorable ✓
Significance:        Material (>10%)

Breakdown:
• Revenue per order: +2,787.78 vs 2,710.98 (+2.8%)
• Units sold: 250 vs 215 (+16.3%)
• Hours of operation: 11 vs 11 (same)
• Orders per hour: 4.09 vs 3.73 (+9.7%)

Insight:
Saturday typically outperforms Friday by 8-12%.
Today's 12.9% increase is within expected range.
Both order count and AOV increased.
```

### Week-over-Week Comparison

```
Week-over-Week Analysis
══════════════════════

This Week (Jan 19-25):   785,300 LKR  (293 orders)
Last Week (Jan 12-18):   725,400 LKR  (270 orders)
────────────────────────────────────────────────
Variance:                +59,900 LKR  (+23 orders)
Change %:                +8.3%        (+8.5%)
Direction:               Favorable ✓
Significance:            Material

Daily Breakdown:
             This Week    Last Week   Change
─────────────────────────────────────────────
Sunday        95,000       88,500     +7.3%
Monday       110,000      102,000     +7.8%
Tuesday      108,500      101,500     +6.9%
Wednesday    115,200      107,800     +6.9%
Thursday     120,000      112,500     +6.7%
Friday       111,150      105,100     +5.8%
Saturday     125,450      108,000    +16.2%  ⭐

Insight:
• All days showed growth (positive across board)
• Saturday had exceptional performance (+16%)
• Average daily growth: 8.3%
• Consistent improvement pattern
```

### Month-over-Month Comparison

```
Month-over-Month Analysis
════════════════════════

This Month (Jan 1-25):     3,125,000 LKR  (1,143 orders)
Last Month (Dec 1-25):     2,778,000 LKR  (1,050 orders)
──────────────────────────────────────────────────────
Variance:                   +347,000 LKR  (+93 orders)
Change %:                   +12.5%        (+8.9%)
Direction:                  Favorable ✓
Significance:               Highly Material (>10%)

Weekly Progression:
                This Month   Last Month   Change
────────────────────────────────────────────────
Week 1 (1-7)      650,000      580,000    +12.1%
Week 2 (8-14)     720,000      665,000     +8.3%
Week 3 (15-21)    785,000      708,000    +10.9%
Week 4 (22-25)    970,000      825,000    +17.6%  ⭐

Insight:
• Strong recovery from December holiday slowdown
• Week 4 (partial) showing strongest growth
• New Year promotions driving traffic
• Customer engagement improving
```

### Year-over-Year Comparison

```
Year-over-Year Analysis
══════════════════════

This Year (Jan 1-25, 2026):  3,125,000 LKR  (1,143 orders)
Last Year (Jan 1-25, 2025):  2,650,000 LKR  (1,020 orders)
────────────────────────────────────────────────────────
Variance:                     +475,000 LKR  (+123 orders)
Change %:                     +17.9%        (+12.1%)
Direction:                    Favorable ✓
Significance:                 Exceptional (>15%)

CAGR (3-Year):                +15.2% annually

Multi-Year Comparison:
Year    Jan 1-25 Revenue   Growth YoY
─────────────────────────────────────
2024    2,200,000 LKR      N/A
2025    2,650,000 LKR     +20.5%
2026    3,125,000 LKR     +17.9%

Insight:
• Sustained double-digit growth for 2 years
• Strong market position
• Business expansion successful
• Customer base growing steadily
```

### Variance Significance Thresholds

```
Variance Significance Rules
══════════════════════════

Classification         Revenue Change    Order Change
──────────────────────────────────────────────────────
Exceptional            >15%              >15%
Highly Material        10-15%            10-15%
Material               5-10%             5-10%
Marginal               2-5%              2-5%
Immaterial             <2%               <2%

Favorability:
• Favorable:   Positive change (revenue up)
• Unfavorable: Negative change (revenue down)
• Neutral:     <2% change (within normal variance)

Investigation Triggers:
• Any unfavorable material variance (>5% down)
• Exceptional favorable variance (understand cause)
• Pattern breaks (expected vs actual significantly different)
```

### Contextual Factors Analysis

```
Variance Context Factors
═══════════════════════

Factor              Impact      This Period
──────────────────────────────────────────────
Seasonality         Medium      Post-holiday recovery
Day of Week         High        Saturday vs Friday
Public Holidays     None        No holidays this week
Promotions          Medium      New Year sale ongoing
Weather             Low         Normal weather
Competition         Low         No new competitors
Economic            Positive    Stable economy
Currency            Stable      LKR stable vs USD

Net Effect: Positive conditions supporting growth

Key Drivers This Period:
1. Post-holiday shopping resumption
2. New Year promotions effective
3. Saturday peak day performance
4. Increased customer traffic
5. Higher average order values
```

### Momentum Indicators

```
Sales Momentum Analysis
══════════════════════

Indicator                  Value      Status
──────────────────────────────────────────────
Velocity (revenue/day)     125,000    Increasing ↑
Acceleration (change rate) +8.3%      Positive ↑
Consistency (variance)     12.5%      Stable ✓
Trend Direction            Upward     Sustained ↗
Momentum Score             8.2/10     Strong 💪

Classification: ACCELERATING

Meaning:
• Sales are not just growing, but growing faster
• Positive trend sustained across all periods
• Low variance = predictable growth
• High momentum = strong business health

Forecast: Continued growth expected
Risk Level: Low
Action: Maintain current strategies
```

### Compound Growth Metrics

```
Compound Annual Growth Rate (CAGR)
═════════════════════════════════

Period          Start       End        CAGR
────────────────────────────────────────────
3-Year         1,800K     3,125K     +15.2%
2-Year         2,200K     3,125K     +19.1%
1-Year         2,650K     3,125K     +17.9%

Interpretation:
• Sustained high growth over multiple years
• 3-year CAGR of 15.2% is excellent for retail
• Growth rate stable (not declining)
• Business model validated

Run Rate Projections:
• Current daily rate: 125,000 LKR
• Projected monthly: 3,875,000 LKR (31 days)
• Projected annual: 45,625,000 LKR
• Adjusted for seasonality: 42,000,000 LKR
```

### Same-Store Sales Comparison

```
Same-Store Sales (SSS) Analysis
═══════════════════════════════

Metric              Current    Last Year   Change
──────────────────────────────────────────────────
Daily Average       125,000    106,000     +17.9%
Weekly Average      112,186     94,643     +18.5%
Monthly Average     125,000    106,000     +17.9%

SSS Index: 117.9 (base: 100)

Industry Benchmark:
• Excellent: >110
• Good:      105-110
• Average:   100-105
• Poor:      <100

Your SSS: 117.9 = Excellent ⭐

Insight: Strong organic growth (not just expansion)
```

### Expected Outcome
- Comprehensive period-over-period comparisons
- Variance analysis with context
- Momentum indicators
- Growth rate calculations
- Actionable insights
- Support for strategic planning

### Verification Checklist
- [ ] get_comparison_data method implemented
- [ ] Day-over-day comparison calculated
- [ ] Week-over-week comparison calculated
- [ ] Month-over-month comparison calculated
- [ ] Year-over-year comparison calculated
- [ ] Variance analysis included
- [ ] Significance classification added
- [ ] Contextual insights generated
- [ ] Momentum indicators computed
- [ ] CAGR calculated
- [ ] Returns proper dictionary structure
- [ ] Integrated into calculate method

---

## Task 30: Create Sales KPI Cache

### Overview
Implement Redis caching for sales KPIs to optimize performance and reduce database load. This caching layer ensures fast response times for dashboard queries while maintaining data freshness through intelligent TTL (Time-To-Live) settings and cache invalidation strategies.

### Dependencies
- Task 29: Add Comparison Data
- Redis server installed and configured
- Redis Python client (redis-py)
- Cache service infrastructure

### Instructions

1. **Create cache service module**
   - Create file at `apps/dashboard/services/cache_service.py`
   - Import Redis client
   - Setup connection configuration

2. **Define cache key patterns**
   - kpi:sales:today:{tenant_id}
   - kpi:sales:week:{tenant_id}
   - kpi:sales:month:{tenant_id}
   - kpi:sales:top_products:{tenant_id}
   - kpi:sales:top_customers:{tenant_id}
   - kpi:sales:trend:{period}:{tenant_id}

3. **Set TTL (Time-To-Live) values**
   - Today's KPIs: 15 minutes (frequent updates)
   - Weekly KPIs: 1 hour (less frequent changes)
   - Monthly KPIs: 6 hours (stable data)
   - Trend data: 30 minutes (visualization)
   - Top products/customers: 1 hour

4. **Implement cache_get method**
   - Accept cache key parameter
   - Query Redis for key
   - Deserialize JSON data
   - Return data or None if not found
   - Handle Redis connection errors

5. **Implement cache_set method**
   - Accept key, data, and TTL parameters
   - Serialize data to JSON
   - Store in Redis with TTL
   - Handle serialization errors
   - Log cache writes

6. **Implement cache_delete method**
   - Accept cache key or pattern
   - Delete from Redis
   - Support wildcard patterns
   - Return deletion count

7. **Implement cache_exists method**
   - Check if key exists in Redis
   - Return boolean
   - Use for cache hit/miss logging

8. **Add cache wrapper decorator**
   - Create @cache_kpi decorator
   - Automatically check cache before calculation
   - Store result in cache after calculation
   - Handle cache failures gracefully

9. **Integrate with SalesKPICalculator**
   - Wrap calculate method with cache decorator
   - Add cache_key generation logic
   - Include tenant_id in keys
   - Add cache hit/miss logging

10. **Add cache monitoring**
    - Track cache hit rate
    - Track cache miss rate
    - Log cache performance
    - Monitor Redis memory usage

### Cache Service Structure

```
┌────────────────────────────────────────────────┐
│           CacheService Class                   │
├────────────────────────────────────────────────┤
│ Methods:                                       │
│  • __init__(redis_client)                      │
│  • generate_key(pattern, **kwargs)             │
│  • get(key) -> dict | None                     │
│  • set(key, data, ttl) -> bool                 │
│  • delete(key_pattern) -> int                  │
│  • exists(key) -> bool                         │
│  • clear_tenant_cache(tenant_id) -> int        │
│  • get_cache_stats() -> dict                   │
│                                                │
│ Decorator:                                     │
│  • @cache_kpi(key_pattern, ttl)                │
└────────────────────────────────────────────────┘
```

### Cache Key Patterns

```
Redis Cache Key Structure
════════════════════════

Pattern: kpi:{category}:{metric}:{tenant_id}:{params}

Examples:
─────────────────────────────────────────────────────
kpi:sales:today:TENANT123
kpi:sales:week:TENANT123
kpi:sales:month:TENANT123
kpi:sales:top_products:TENANT123
kpi:sales:top_customers:today:TENANT123
kpi:sales:trend:7days:TENANT123
kpi:sales:category:today:TENANT123
kpi:sales:channel:today:TENANT123

Wildcards for bulk operations:
───────────────────────────────
kpi:sales:*:TENANT123              (all sales KPIs for tenant)
kpi:sales:today:*                  (all tenants' today KPIs)
kpi:*:*:TENANT123                  (all KPIs for tenant)
```

### TTL Strategy

```
Time-To-Live Configuration
═════════════════════════

KPI Category          TTL       Reason
────────────────────────────────────────────────────
Today's Sales         900s      15 min - frequent changes
Today's Orders        900s      15 min - real-time tracking
Today's AOV           900s      15 min - derived from orders
Weekly Sales         3600s      1 hour - less volatile
Monthly Sales       21600s      6 hours - stable data
Top Products         3600s      1 hour - changes gradually
Top Customers        3600s      1 hour - changes gradually
Sales by Category    1800s      30 min - moderate changes
Sales by Channel     1800s      30 min - moderate changes
Trend Data (7d)      1800s      30 min - for charts
Trend Data (30d)     7200s      2 hours - historical
Comparison Data      3600s      1 hour - calculated metrics

Cache Refresh Strategy:
• Proactive: Regenerate before TTL expires (critical metrics)
• Reactive: Wait for TTL expiry and regenerate on demand
• Event-driven: Invalidate on new sales (real-time accuracy)
```

### Cache Implementation Example

```python
# Pseudocode structure (not actual code)

class CacheService:
    """Redis cache service for KPI data"""
    
    def __init__(self, redis_client):
        self.redis = redis_client
    
    def generate_key(self, pattern, **kwargs):
        """Generate cache key from pattern and parameters"""
        # Format: kpi:sales:today:TENANT123
        key = pattern.format(**kwargs)
        return key
    
    def get(self, key):
        """Get cached data"""
        try:
            data = self.redis.get(key)
            if data:
                return json.loads(data)
            return None
        except Exception as e:
            logger.error(f"Cache get error: {e}")
            return None
    
    def set(self, key, data, ttl=3600):
        """Set cached data with TTL"""
        try:
            serialized = json.dumps(data)
            self.redis.setex(key, ttl, serialized)
            return True
        except Exception as e:
            logger.error(f"Cache set error: {e}")
            return False
    
    def delete(self, key_pattern):
        """Delete keys matching pattern"""
        try:
            keys = self.redis.keys(key_pattern)
            if keys:
                return self.redis.delete(*keys)
            return 0
        except Exception as e:
            logger.error(f"Cache delete error: {e}")
            return 0
```

### Cache Decorator Usage

```python
# Pseudocode showing decorator usage

@cache_kpi(key_pattern="kpi:sales:today:{tenant_id}", ttl=900)
def get_todays_sales(self):
    """Calculate today's sales (cached for 15 min)"""
    # Calculation logic here
    return result

# Decorator logic:
# 1. Generate cache key using tenant_id
# 2. Check if key exists in Redis
# 3. If exists and not expired: return cached data
# 4. If not exists or expired:
#    - Call original function
#    - Cache result with TTL
#    - Return result
```

### Cache Hit/Miss Tracking

```
Cache Performance Metrics
════════════════════════

Metric              Value       Status
───────────────────────────────────────
Cache Hit Rate      87.5%       Excellent
Cache Miss Rate     12.5%       Good
Avg Response (hit)  15ms        Fast
Avg Response (miss) 250ms       Acceptable
Cache Size          125MB       Healthy
Keys Count          2,450       Normal
Memory Usage        12.2%       Low

Hit Rate Categories:
• Excellent: >85%
• Good:      70-85%
• Fair:      50-70%
• Poor:      <50%

Your Hit Rate: 87.5% ✓ Excellent
```

### Cache Warming Strategy

```
Cache Warming Schedule
═════════════════════

Time       Action                      KPIs Warmed
──────────────────────────────────────────────────
00:05      Warm yesterday's summary    All tenants
06:00      Warm early morning KPIs     Active tenants
08:00      Warm business hours KPIs    All tenants
12:00      Warm midday KPIs            Active tenants
18:00      Warm evening KPIs           Active tenants
23:55      Pre-warm next day cache     All tenants

Warming Process:
1. Identify tenants with activity
2. Calculate KPIs for each tenant
3. Store in cache with full TTL
4. Log warming completion
5. Monitor for failures

Benefits:
• First request always hits cache
• Consistent response times
• Reduced load during peak hours
```

### Cache Invalidation Rules

```
Cache Invalidation Triggers
══════════════════════════

Event                  Keys Invalidated
─────────────────────────────────────────────────
New Sale Created       kpi:sales:today:*
                       kpi:sales:week:*
                       kpi:sales:month:*
                       kpi:sales:trend:*

Sale Voided            kpi:sales:today:*
                       kpi:sales:top_products:*
                       kpi:sales:top_customers:*

Day Changed            kpi:sales:today:*
(midnight)             kpi:sales:comparison:*

Week Changed           kpi:sales:week:*
(Sunday midnight)      kpi:sales:trend:*

Month Changed          kpi:sales:month:*
(1st of month)         kpi:sales:comparison:*

Product Updated        kpi:sales:top_products:*
                       kpi:sales:category:*

Customer Updated       kpi:sales:top_customers:*

Note: Task 31 implements these invalidation triggers
```

### Redis Configuration

```
Redis Configuration for KPI Caching
═══════════════════════════════════

Connection:
───────────
Host:              localhost
Port:              6379
Database:          1 (dedicated for KPIs)
Password:          [configured]
Connection Pool:   Max 50 connections
Timeout:           5 seconds

Memory Management:
─────────────────
Max Memory:        512MB (adjust based on scale)
Eviction Policy:   allkeys-lru
                   (Least Recently Used eviction)

Persistence:
───────────
AOF:               Enabled (append-only file)
AOF Sync:          everysec
RDB Snapshot:      Disabled (cache data, not critical)

Performance:
───────────
TCP Backlog:       511
Timeout:           300 seconds
TCP Keepalive:     300 seconds
```

### Expected Outcome
- Redis caching infrastructure
- Optimized KPI response times
- Reduced database load
- Intelligent TTL management
- Cache monitoring and statistics
- Foundation for cache invalidation

### Verification Checklist
- [ ] cache_service.py module created
- [ ] CacheService class implemented
- [ ] Cache key patterns defined
- [ ] TTL values configured
- [ ] cache_get method implemented
- [ ] cache_set method implemented
- [ ] cache_delete method implemented
- [ ] cache_exists method implemented
- [ ] Cache decorator created
- [ ] SalesKPICalculator integration
- [ ] Cache monitoring added
- [ ] Redis connection configured
- [ ] Error handling implemented
- [ ] Logging added

---

## Task 31: Add Cache Invalidation

### Overview
Implement automatic cache invalidation using Django signals to ensure KPI data stays fresh when underlying data changes. This system listens for sales-related events and intelligently invalidates only the affected cache entries, maintaining accuracy without sacrificing performance.

### Dependencies
- Task 30: Create Sales KPI Cache
- Django signals framework
- SalesInvoice model signals

### Instructions

1. **Create signals module**
   - Create file at `apps/dashboard/signals.py`
   - Import Django signal decorators
   - Import cache service
   - Import relevant models

2. **Add post_save signal for SalesInvoice**
   - Listen to SalesInvoice save events
   - Trigger on invoice creation
   - Trigger on invoice updates
   - Extract tenant_id from invoice

3. **Invalidate today's KPIs**
   - Delete kpi:sales:today:{tenant_id}
   - Delete kpi:sales:top_products:{tenant_id}
   - Delete kpi:sales:top_customers:today:{tenant_id}
   - Delete kpi:sales:category:today:{tenant_id}
   - Delete kpi:sales:channel:today:{tenant_id}

4. **Invalidate weekly KPIs**
   - Delete kpi:sales:week:{tenant_id}
   - Delete kpi:sales:trend:7days:{tenant_id}
   - Delete kpi:sales:comparison:week:{tenant_id}

5. **Invalidate monthly KPIs**
   - Delete kpi:sales:month:{tenant_id}
   - Delete kpi:sales:trend:30days:{tenant_id}
   - Delete kpi:sales:comparison:month:{tenant_id}

6. **Add post_delete signal for voided invoices**
   - Listen to invoice deletion/void events
   - Invalidate same keys as post_save
   - Log invalidation events

7. **Add scheduled invalidation**
   - Daily at midnight: invalidate previous day caches
   - Weekly on Sunday midnight: invalidate previous week
   - Monthly on 1st: invalidate previous month
   - Use Celery beat for scheduling

8. **Implement selective invalidation**
   - Only invalidate affected tenant's cache
   - Preserve other tenants' cache
   - Batch invalidations for efficiency
   - Log invalidation operations

9. **Add invalidation metrics**
   - Count invalidations per hour
   - Track invalidation sources (signal vs scheduled)
   - Monitor cache rebuild frequency
   - Alert on excessive invalidations

10. **Register signals**
    - Import signals in app ready() method
    - Ensure signals are connected
    - Test signal firing

### Signals Module Structure

```
┌────────────────────────────────────────────────┐
│         Cache Invalidation Signals             │
├────────────────────────────────────────────────┤
│ Signals:                                       │
│  • invoice_saved(sender, instance, created)    │
│  • invoice_deleted(sender, instance)           │
│  • invoice_voided(sender, instance)            │
│  • day_changed_task()                          │
│  • week_changed_task()                         │
│  • month_changed_task()                        │
│                                                │
│ Helper Methods:                                │
│  • invalidate_sales_kpis(tenant_id)            │
│  • invalidate_pattern(pattern)                 │
│  • log_invalidation(event, keys_count)         │
└────────────────────────────────────────────────┘
```

### Signal Implementation Example

```python
# Pseudocode structure (not actual code)

from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from apps.sales.models import SalesInvoice
from apps.dashboard.services.cache_service import cache_service

@receiver(post_save, sender=SalesInvoice)
def invalidate_sales_cache_on_save(sender, instance, created, **kwargs):
    """
    Invalidate sales KPI cache when invoice is created or updated
    """
    tenant_id = instance.tenant_id
    
    # Invalidate today's metrics
    cache_service.delete(f"kpi:sales:today:{tenant_id}")
    cache_service.delete(f"kpi:sales:top_products:{tenant_id}")
    cache_service.delete(f"kpi:sales:top_customers:today:{tenant_id}")
    cache_service.delete(f"kpi:sales:category:today:{tenant_id}")
    cache_service.delete(f"kpi:sales:channel:today:{tenant_id}")
    
    # Invalidate weekly metrics
    cache_service.delete(f"kpi:sales:week:{tenant_id}")
    cache_service.delete(f"kpi:sales:trend:7days:{tenant_id}")
    
    # Invalidate monthly metrics
    cache_service.delete(f"kpi:sales:month:{tenant_id}")
    
    logger.info(f"Invalidated sales cache for tenant {tenant_id}")

@receiver(post_delete, sender=SalesInvoice)
def invalidate_sales_cache_on_delete(sender, instance, **kwargs):
    """
    Invalidate sales KPI cache when invoice is deleted/voided
    """
    tenant_id = instance.tenant_id
    
    # Same invalidation as post_save
    invalidate_sales_kpis(tenant_id)
    
    logger.info(f"Invalidated sales cache for tenant {tenant_id} (delete)")

def invalidate_sales_kpis(tenant_id):
    """Helper to invalidate all sales KPIs for a tenant"""
    patterns = [
        f"kpi:sales:*:{tenant_id}",
    ]
    for pattern in patterns:
        count = cache_service.delete(pattern)
        logger.debug(f"Deleted {count} cache keys for pattern {pattern}")
```

### Invalidation Event Mapping

```
Cache Invalidation Event Matrix
══════════════════════════════

Event                     KPIs Invalidated                TTL Reset
─────────────────────────────────────────────────────────────────
New Sale Created          Today, Week, Month              Yes
Sale Amount Updated       Today, Week, Month              Yes
Sale Voided               All Sales KPIs                  Yes
Sale Deleted              All Sales KPIs                  Yes

Product Added to Sale     Top Products, Category          Yes
Customer Changed          Top Customers                   Yes

Day Boundary (00:00)      Today → Yesterday               Scheduled
Week Boundary (Sun)       This Week → Last Week           Scheduled
Month Boundary (1st)      This Month → Last Month         Scheduled

Manual Refresh            Requested KPIs only             No
Cache Expired             Specific KPI on next request    No
```

### Scheduled Invalidation Tasks

```
Celery Beat Schedule
═══════════════════

# Pseudocode for celery beat configuration

from celery.schedules import crontab

CELERY_BEAT_SCHEDULE = {
    'invalidate-daily-cache': {
        'task': 'dashboard.tasks.invalidate_daily_cache',
        'schedule': crontab(hour=0, minute=5),  # 00:05 daily
        'args': (),
    },
    'invalidate-weekly-cache': {
        'task': 'dashboard.tasks.invalidate_weekly_cache',
        'schedule': crontab(
            hour=0, minute=10, day_of_week=0  # Sunday 00:10
        ),
        'args': (),
    },
    'invalidate-monthly-cache': {
        'task': 'dashboard.tasks.invalidate_monthly_cache',
        'schedule': crontab(
            hour=0, minute=15, day_of_month=1  # 1st of month 00:15
        ),
        'args': (),
    },
}
```

### Invalidation Flow Diagram

```
Sale Creation Invalidation Flow
══════════════════════════════

User Creates Sale
      │
      ▼
SalesInvoice.save()
      │
      ▼
post_save Signal Fired
      │
      ├─► Extract tenant_id
      │
      ├─► Delete today's KPI cache
      │    └─► kpi:sales:today:TENANT123
      │
      ├─► Delete week's KPI cache
      │    └─► kpi:sales:week:TENANT123
      │
      ├─► Delete month's KPI cache
      │    └─► kpi:sales:month:TENANT123
      │
      ├─► Delete top products cache
      │    └─► kpi:sales:top_products:TENANT123
      │
      ├─► Delete top customers cache
      │    └─► kpi:sales:top_customers:*:TENANT123
      │
      ├─► Delete category breakdown
      │    └─► kpi:sales:category:*:TENANT123
      │
      └─► Delete channel breakdown
           └─► kpi:sales:channel:*:TENANT123
      │
      ▼
Log Invalidation Event
      │
      ▼
Next Request Regenerates Cache
```

### Selective Invalidation Strategy

```
Selective Invalidation Rules
═══════════════════════════

Question: Which caches to invalidate?
Answer: Only those affected by the change

Change Type          Caches to Invalidate
─────────────────────────────────────────────────
New sale             Today, Week, Month, Trends
Sale amount edit     Same as new sale
Sale status change   Depends on new status
Sale voided          All sales KPIs
Product quantity     Top products, Category
Customer changed     Top customers only
Payment updated      Channel breakdown (if method changed)

Optimization:
• Don't invalidate trend data on every sale
  (trends update every 30 min anyway)
• Don't invalidate monthly for small edits
  (impact is minimal)
• Batch invalidations within 1-second window
  (multiple items in one invoice = 1 invalidation)
```

### Invalidation Metrics

```
Cache Invalidation Dashboard
═══════════════════════════

Today's Metrics:
───────────────
Total Invalidations:        450
  • Signal-triggered:       380 (84.4%)
  • Scheduled:               50 (11.1%)
  • Manual:                  20 (4.4%)

Invalidations per Hour:
──────────────────────
08:00-09:00    25
09:00-10:00    35
10:00-11:00    42
11:00-12:00    48
12:00-13:00    55  ← Peak
13:00-14:00    62  ← Peak
14:00-15:00    58
15:00-16:00    50
16:00-17:00    38
17:00-18:00    25
18:00-19:00    12

Cache Rebuild Statistics:
────────────────────────
Avg Rebuild Time:     180ms
Max Rebuild Time:     450ms
Min Rebuild Time:      85ms
Cache Hit Rate:       87.5%
Cache Miss Rate:      12.5%

Status: Healthy ✓
Recommendation: Increase cache TTL for monthly KPIs
```

### Invalidation Logging

```
Cache Invalidation Log Sample
════════════════════════════

[2026-01-25 14:32:15] INFO: Cache invalidation triggered
  Event: post_save
  Model: SalesInvoice
  Tenant: TENANT123
  Invoice: INV-2026-00542
  Keys Deleted: 8
  Patterns:
    - kpi:sales:today:TENANT123 (deleted: 1)
    - kpi:sales:week:TENANT123 (deleted: 1)
    - kpi:sales:month:TENANT123 (deleted: 1)
    - kpi:sales:top_products:TENANT123 (deleted: 2)
    - kpi:sales:top_customers:*:TENANT123 (deleted: 2)
    - kpi:sales:category:*:TENANT123 (deleted: 1)
  Duration: 12ms

[2026-01-25 00:05:02] INFO: Scheduled cache invalidation
  Event: daily_boundary
  Tenants Affected: 45
  Keys Deleted: 180
  Patterns:
    - kpi:sales:today:* (deleted: 45)
    - kpi:sales:comparison:day:* (deleted: 45)
  Duration: 234ms
```

### Performance Impact

```
Cache Invalidation Performance
═════════════════════════════

Operation                  Avg Time    Impact
──────────────────────────────────────────────
Single Key Deletion        < 1ms       None
Pattern Deletion (10 keys) 5-8ms       Minimal
Bulk Deletion (100 keys)   35-50ms     Low
Signal Processing          2-5ms       Minimal
Cache Rebuild              150-250ms   Low

Total Overhead per Sale:
  Signal: 5ms
  Invalidation: 8ms
  Total: 13ms (0.013 seconds)

Percentage of Sale Creation Time: <1%
Impact on User Experience: Negligible

Conclusion: Invalidation is lightweight and efficient
```

### Expected Outcome
- Automatic cache invalidation on data changes
- Selective invalidation to minimize overhead
- Scheduled boundary invalidations
- Invalidation monitoring and logging
- Maintained cache accuracy
- No performance degradation

### Verification Checklist
- [ ] signals.py module created
- [ ] post_save signal handler implemented
- [ ] post_delete signal handler implemented
- [ ] Selective invalidation logic added
- [ ] Scheduled tasks created
- [ ] Celery beat configuration added
- [ ] Helper methods implemented
- [ ] Invalidation metrics tracking
- [ ] Logging implemented
- [ ] Signals registered in AppConfig
- [ ] Testing completed

---

## Task 32: Create Sales KPI Endpoint

### Overview
Implement the API endpoint that exposes all sales KPIs to the frontend dashboard. This RESTful endpoint aggregates all calculated metrics, handles tenant filtering, supports multiple time periods, and provides a comprehensive response for dashboard visualization.

### Dependencies
- Task 31: Add Cache Invalidation
- Django REST Framework configured
- Authentication middleware
- Tenant middleware

### Instructions

1. **Create dashboard views module**
   - Modify `apps/dashboard/views/dashboard.py`
   - Import DRF components
   - Import SalesKPICalculator
   - Import cache service

2. **Define SalesKPIView class**
   - Extend APIView or ViewSet
   - Add authentication classes
   - Add permission classes (IsAuthenticated)
   - Add tenant filtering

3. **Implement GET method**
   - Accept period parameter (today/week/month)
   - Extract tenant from request
   - Initialize SalesKPICalculator
   - Call calculate method
   - Return Response with KPI data

4. **Add query parameters**
   - period: today, week, month, custom
   - start_date: for custom period
   - end_date: for custom period
   - include_trends: boolean
   - include_comparison: boolean

5. **Format response structure**
   - Include metadata (timestamp, tenant, period)
   - Include all KPI categories
   - Include cache status (hit/miss)
   - Include calculation time

6. **Add error handling**
   - Handle invalid periods
   - Handle date parsing errors
   - Handle calculator exceptions
   - Return appropriate HTTP status codes

7. **Add response caching headers**
   - Set Cache-Control header
   - Set ETag for response
   - Set Last-Modified header
   - Support conditional requests

8. **Register URL routes**
   - Add to dashboard URL patterns
   - Use namespace for organization
   - Support versioning (api/v1/)

9. **Add API documentation**
   - Document endpoint in OpenAPI/Swagger
   - Include request/response examples
   - Document all parameters
   - Add authentication notes

10. **Add monitoring and logging**
    - Log API requests
    - Track response times
    - Monitor error rates
    - Alert on failures

### Sales KPI Endpoint Structure

```
┌────────────────────────────────────────────────┐
│          Sales KPI API Endpoint                │
├────────────────────────────────────────────────┤
│ Endpoint: /api/v1/dashboard/sales-kpis/        │
│ Method: GET                                    │
│ Authentication: Required (JWT Token)           │
│ Permissions: IsAuthenticated                   │
│                                                │
│ Query Parameters:                              │
│  • period: today|week|month|custom             │
│  • start_date: YYYY-MM-DD (for custom)         │
│  • end_date: YYYY-MM-DD (for custom)           │
│  • include_trends: true|false                  │
│  • include_comparison: true|false              │
│                                                │
│ Response Format: JSON                          │
│ Status Codes:                                  │
│  • 200: Success                                │
│  • 400: Bad Request                            │
│  • 401: Unauthorized                           │
│  • 403: Forbidden                              │
│  • 500: Internal Server Error                  │
└────────────────────────────────────────────────┘
```

### API Request Examples

```
Example 1: Today's Sales KPIs
════════════════════════════

GET /api/v1/dashboard/sales-kpis/?period=today
Authorization: Bearer <jwt_token>

Response: 200 OK
{
  "metadata": {
    "timestamp": "2026-01-25T16:45:30+0530",
    "tenant_id": "TENANT123",
    "period": "today",
    "date": "2026-01-25",
    "cached": true,
    "cache_age": "8 minutes",
    "calculation_time": "15ms"
  },
  "kpis": {
    "todays_sales": {...},
    "orders_count": {...},
    "average_order_value": {...},
    ...
  }
}


Example 2: Weekly Sales with Trends
══════════════════════════════════

GET /api/v1/dashboard/sales-kpis/?period=week&include_trends=true
Authorization: Bearer <jwt_token>

Response: 200 OK
{
  "metadata": {
    "timestamp": "2026-01-25T16:45:30+0530",
    "period": "week",
    "date_range": {
      "start": "2026-01-19",
      "end": "2026-01-25"
    },
    "cached": false,
    "calculation_time": "245ms"
  },
  "kpis": {...},
  "trends": {...}
}


Example 3: Custom Date Range
═══════════════════════════

GET /api/v1/dashboard/sales-kpis/?period=custom&start_date=2026-01-01&end_date=2026-01-15
Authorization: Bearer <jwt_token>

Response: 200 OK
{
  "metadata": {
    "period": "custom",
    "date_range": {
      "start": "2026-01-01",
      "end": "2026-01-15"
    }
  },
  "kpis": {...}
}
```

### Complete API Response Structure

```json
{
  "metadata": {
    "timestamp": "2026-01-25T16:45:30+0530",
    "tenant_id": "TENANT123",
    "tenant_name": "LankaCommerce Retail",
    "period": "today",
    "date": "2026-01-25",
    "cached": true,
    "cache_key": "kpi:sales:today:TENANT123",
    "cache_age_seconds": 480,
    "cache_ttl_seconds": 900,
    "calculation_time_ms": 15
  },
  "kpis": {
    "todays_sales": {
      "value": 125450.00,
      "formatted": "LKR 125,450.00",
      "trend": "up",
      "change_percent": 15.5,
      "comparison_value": 108600.00,
      "comparison_label": "vs Yesterday"
    },
    "weekly_sales": {
      "value": 785300.00,
      "formatted": "LKR 785,300.00",
      "trend": "up",
      "change_percent": 8.3,
      "days_included": 7
    },
    "monthly_sales": {
      "value": 3125000.00,
      "formatted": "LKR 3,125,000.00",
      "trend": "up",
      "change_percent": 12.5,
      "days_in_period": 25
    },
    "sales_growth": {...},
    "average_order_value": {...},
    "orders_count": {...},
    "top_products": [...],
    "top_customers": [...],
    "sales_by_category": {...},
    "sales_by_channel": {...}
  },
  "trends": {
    "period": "7_DAYS",
    "data_points": [...],
    "moving_average": [...],
    "trend_line": {...}
  },
  "comparison": {
    "day_over_day": {...},
    "week_over_week": {...},
    "month_over_month": {...}
  }
}
```

### View Implementation Example

```python
# Pseudocode structure (not actual code)

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.utils import timezone
from apps.dashboard.calculators.sales import SalesKPICalculator
from apps.dashboard.services.cache_service import cache_service

class SalesKPIView(APIView):
    """
    API endpoint for sales KPIs
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        """
        GET /api/v1/dashboard/sales-kpis/
        
        Query Parameters:
        - period: today, week, month, custom
        - start_date: YYYY-MM-DD (for custom period)
        - end_date: YYYY-MM-DD (for custom period)
        - include_trends: true/false
        - include_comparison: true/false
        """
        start_time = timezone.now()
        
        # Extract parameters
        period = request.GET.get('period', 'today')
        include_trends = request.GET.get('include_trends', 'false') == 'true'
        include_comparison = request.GET.get('include_comparison', 'true') == 'true'
        
        # Get tenant from request
        tenant = request.tenant  # From middleware
        
        # Generate cache key
        cache_key = f"kpi:sales:{period}:{tenant.id}"
        
        # Check cache
        cached_data = cache_service.get(cache_key)
        if cached_data:
            cached_data['metadata']['cached'] = True
            return Response(cached_data, status=status.HTTP_200_OK)
        
        # Calculate KPIs
        try:
            calculator = SalesKPICalculator(tenant=tenant, period=period)
            kpis = calculator.calculate()
            
            # Build response
            response_data = {
                'metadata': {
                    'timestamp': timezone.now().isoformat(),
                    'tenant_id': tenant.id,
                    'tenant_name': tenant.name,
                    'period': period,
                    'cached': False,
                    'calculation_time_ms': (timezone.now() - start_time).total_seconds() * 1000
                },
                'kpis': kpis
            }
            
            if include_trends:
                response_data['trends'] = calculator.get_sales_trend_data()
            
            if include_comparison:
                response_data['comparison'] = calculator.get_comparison_data()
            
            # Cache the result
            ttl = 900 if period == 'today' else 3600
            cache_service.set(cache_key, response_data, ttl)
            
            return Response(response_data, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.error(f"Error calculating sales KPIs: {e}")
            return Response(
                {'error': 'Failed to calculate KPIs'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
```

### URL Configuration

```python
# apps/dashboard/urls.py

from django.urls import path
from apps.dashboard.views.dashboard import SalesKPIView

app_name = 'dashboard'

urlpatterns = [
    path('api/v1/dashboard/sales-kpis/', 
         SalesKPIView.as_view(), 
         name='sales-kpis'),
]
```

### API Documentation (OpenAPI/Swagger)

```yaml
/api/v1/dashboard/sales-kpis/:
  get:
    summary: Get Sales KPIs
    description: |
      Returns comprehensive sales performance metrics including
      today's sales, weekly/monthly totals, trends, top products,
      top customers, and channel breakdowns.
    tags:
      - Dashboard
      - Sales KPIs
    security:
      - bearerAuth: []
    parameters:
      - name: period
        in: query
        description: Time period for KPIs
        required: false
        schema:
          type: string
          enum: [today, week, month, custom]
          default: today
      - name: start_date
        in: query
        description: Start date for custom period (YYYY-MM-DD)
        required: false
        schema:
          type: string
          format: date
      - name: end_date
        in: query
        description: End date for custom period (YYYY-MM-DD)
        required: false
        schema:
          type: string
          format: date
      - name: include_trends
        in: query
        description: Include trend data for charts
        required: false
        schema:
          type: boolean
          default: false
      - name: include_comparison
        in: query
        description: Include period comparison data
        required: false
        schema:
          type: boolean
          default: true
    responses:
      '200':
        description: Successful response
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/SalesKPIResponse'
      '400':
        description: Bad request
      '401':
        description: Unauthorized
      '500':
        description: Internal server error
```

### Frontend Integration Example

```javascript
// Frontend JavaScript example

async function loadSalesKPIs(period = 'today', options = {}) {
  const { includeTrends = false, includeComparison = true } = options;
  
  const params = new URLSearchParams({
    period,
    include_trends: includeTrends,
    include_comparison: includeComparison
  });
  
  try {
    const response = await fetch(
      `/api/v1/dashboard/sales-kpis/?${params}`,
      {
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data = await response.json();
    
    // Update dashboard
    updateSalesMetrics(data.kpis);
    
    if (data.trends) {
      renderSalesChart(data.trends);
    }
    
    if (data.comparison) {
      updateComparisonCards(data.comparison);
    }
    
    // Show cache status
    if (data.metadata.cached) {
      console.log(`Loaded from cache (${data.metadata.cache_age})`);
    }
    
    return data;
    
  } catch (error) {
    console.error('Failed to load sales KPIs:', error);
    showErrorMessage('Unable to load sales data');
  }
}

// Usage
loadSalesKPIs('today', { includeTrends: true });
```

### Rate Limiting

```
API Rate Limiting Configuration
═══════════════════════════════

Endpoint: /api/v1/dashboard/sales-kpis/

Limits:
  • Per User: 100 requests/minute
  • Per Tenant: 500 requests/minute
  • Per IP: 200 requests/minute

Exceeded Response:
  HTTP 429 Too Many Requests
  {
    "error": "Rate limit exceeded",
    "retry_after": 45,
    "limit": 100,
    "period": "minute"
  }

Headers:
  X-RateLimit-Limit: 100
  X-RateLimit-Remaining: 0
  X-RateLimit-Reset: 1643116800
  Retry-After: 45
```

### Expected Outcome
- Functional RESTful API endpoint
- Comprehensive KPI data exposure
- Query parameter support
- Proper authentication/authorization
- Response caching
- Error handling
- API documentation
- Frontend integration ready

### Verification Checklist
- [ ] SalesKPIView class implemented
- [ ] GET method with parameters
- [ ] Tenant filtering implemented
- [ ] Calculator integration complete
- [ ] Response formatting correct
- [ ] Error handling added
- [ ] URL routing configured
- [ ] Authentication required
- [ ] Permissions checked
- [ ] Cache integration working
- [ ] API documentation created
- [ ] Rate limiting configured
- [ ] Logging implemented
- [ ] Frontend integration tested

---

## Summary

This document completed the advanced sales analytics and infrastructure:

### Completed Components
- ✅ Top Customers KPI with loyalty analysis
- ✅ Sales by Category KPI with distribution insights
- ✅ Sales by Channel KPI (POS vs Webstore)
- ✅ Sales Trend Data for chart visualization
- ✅ Comprehensive Comparison Data (DoD/WoW/MoM/YoY)
- ✅ Redis Caching Infrastructure
- ✅ Automatic Cache Invalidation via Signals
- ✅ RESTful API Endpoint for Dashboard

### Key Achievements
1. **Customer Intelligence** - VIP identification and loyalty tracking
2. **Category Analysis** - Product mix and concentration insights
3. **Omnichannel Metrics** - POS and Webstore comparison
4. **Visual Data** - Trend lines and charts support
5. **Performance** - Redis caching with 87%+ hit rate
6. **Real-Time Accuracy** - Signal-based cache invalidation
7. **API Exposure** - Complete frontend integration
8. **Sri Lankan Context** - LKR currency, local market patterns

### Architecture Delivered
```
┌─────────────────────────────────────────────┐
│         Sales KPI System Architecture       │
├─────────────────────────────────────────────┤
│                                             │
│  Frontend Dashboard                         │
│       │                                     │
│       ▼                                     │
│  API Endpoint (Task 32)                     │
│       │                                     │
│       ▼                                     │
│  Cache Layer (Task 30)                      │
│       │                                     │
│       ▼                                     │
│  SalesKPICalculator (Tasks 17-29)           │
│       │                                     │
│       ▼                                     │
│  Database Queries                           │
│                                             │
│  Signal Triggers (Task 31) ─────┐           │
│                                 │           │
│                                 ▼           │
│                          Cache Invalidation │
└─────────────────────────────────────────────┘
```

### Performance Metrics
- **Cache Hit Rate:** 87.5%
- **Avg Response Time (cached):** 15ms
- **Avg Response Time (uncached):** 250ms
- **Daily Invalidations:** ~450
- **API Availability:** 99.9%

---

**Document Status:** ✅ Complete  
**Total Tasks:** 8  
**Estimated Time:** 4.5 hours
