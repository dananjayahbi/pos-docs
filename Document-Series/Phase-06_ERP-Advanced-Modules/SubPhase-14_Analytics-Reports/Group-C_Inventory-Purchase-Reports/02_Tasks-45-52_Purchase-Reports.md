# Tasks 45-52: Purchase & Vendor Performance Reports

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 14 - Analytics & Reports  
> **Group:** C - Inventory & Purchase Reports  
> **Document:** 02 of 02  
> **Tasks Covered:** 45, 46, 47, 48, 49, 50, 51, 52

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-35-44_Stock-Reports.md](01_Tasks-35-44_Stock-Reports.md)

---

## Document Overview

This document covers the implementation of purchase and vendor performance reporting functionality. These reports provide critical insights into purchasing patterns, vendor relationships, and procurement efficiency. The implementation includes three main report types: purchase by vendor (ranking vendors by purchase volume and payment status), purchase by category (analyzing spending across product categories), and vendor performance (evaluating delivery metrics, quality standards, and lead time analysis).

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 45 | Create PurchaseByVendorReport | Medium | 40 min |
| 46 | Add vendor ranking logic | Medium | 30 min |
| 47 | Add payment status column | Low | 15 min |
| 48 | Create PurchaseByCategoryReport | Medium | 35 min |
| 49 | Add category breakdown percentages | Low | 20 min |
| 50 | Create VendorPerformanceReport | High | 60 min |
| 51 | Add lead time analysis | Medium | 35 min |
| 52 | Create inventory report API endpoint | Low | 25 min |

---

## Task 45: Create PurchaseByVendorReport

### Overview
Implement the PurchaseByVendorReport generator that analyzes purchase orders grouped by vendor. This report provides a comprehensive view of procurement spending across all vendors, showing total purchase amounts, order counts, and payment obligations. The report serves as a foundation for vendor comparison and procurement strategy decisions.

### Dependencies
- Task 44 complete, BaseReportGenerator exists, PurchaseOrder/Vendor/GRN models available

### Instructions

1. **Create `apps/analytics/reports/inventory/purchase_vendor_report.py`** with PurchaseByVendorReport class
2. **Import** BaseReportGenerator, PurchaseOrder, Vendor, Django aggregation (Sum, Count, Q)
3. **Define class:** Inherit BaseReportGenerator, set report_name="Purchase by Vendor Report", report_code="PURCHASE_VENDOR"
4. **__init__:** Accept tenant_id, date_from, date_to, vendor_id (optional filters)
5. **get_queryset:** Filter PurchaseOrder by tenant, date range, vendor_id; exclude cancelled/draft
6. **prepare_data:** Group by vendor, annotate total_orders (Count), total_amount (Sum), total_paid, total_pending; order by amount descending
7. **format_row:** Format vendor name/code, orders, amounts with currency, calculate payment %
8. **get_columns:** Define 7 columns - Vendor Code, Name, Orders, Total Amount, Paid, Pending, Payment %
9. **get_report_title:** Include date range if provided
10. **get_summary_stats:** Calculate total vendors, purchase amount, orders, average order value, payment %

### Report Output Structure

```
Vendor Code | Vendor Name        | Orders | Total Amount | Paid Amount | Pending    | Payment %
V-001       | ABC Suppliers Ltd  |    45  | LKR 2,450,000| LKR 2,200,000| LKR 250,000|   89.8%
V-002       | XYZ Trading Co     |    38  | LKR 1,980,000| LKR 1,980,000| LKR 0      |  100.0%

SUMMARY: 15 vendors, 245 orders, LKR 12,450,000 total, 91.5% payment rate
```

### Key Metrics

| Metric | Calculation | Purpose |
|--------|-------------|---------|
| Total Orders | COUNT(purchase_orders) | Volume tracking |
| Total Amount | SUM(po.total_amount) | Spending analysis |
| Amount Pending | Total - Paid | Cash flow management |
| Payment % | (Paid / Total) × 100 | Payment tracking |

### Expected Outcome
- Functional PurchaseByVendorReport class
- Accurate vendor-wise purchase aggregation
- Clear financial metrics per vendor
- Summary statistics for overall view
- Foundation for vendor ranking

### Verification Checklist
- [ ] PurchaseByVendorReport class created
- [ ] Inherits from BaseReportGenerator
- [ ] Accepts tenant_id, date filters, vendor_id
- [ ] get_queryset filters orders correctly
- [ ] prepare_data aggregates by vendor
- [ ] format_row handles vendor details
- [ ] get_columns defines 7 columns
- [ ] get_report_title includes filters
- [ ] get_summary_stats calculates metrics
- [ ] Handles missing vendor gracefully
- [ ] Currency formatting is correct
- [ ] Date range filtering works

---

## Task 46: Add Vendor Ranking Logic

### Overview
Enhance the PurchaseByVendorReport with ranking functionality that assigns numerical ranks to vendors based on purchase volume. This feature enables quick identification of top vendors and facilitates A/B/C vendor classification for strategic procurement management.

### Dependencies
- Task 45: PurchaseByVendorReport created

### Instructions

1. **Add Rank column** as first column in get_columns (center-aligned, narrow width)
2. **calculate_vendor_rank method:** Enumerate sorted data, assign ranks (handle ties with competition ranking: 1,2,2,4,5)
3. **Update prepare_data:** Call calculate_vendor_rank after ordering, return ranked data
4. **Update format_row:** Add rank field formatted as "#1", "#2", etc.
5. **get_vendor_tier method:** Return tier based on rank: A (1-5), B (6-15), C (16+)
6. **Add tier column** after rank; optional color coding (A=Green, B=Yellow, C=Gray)
7. **get_concentration_ratio:** Calculate top 5/10/20 vendor percentages for summary
8. **get_pareto_analysis:** Find vendors contributing 80% of spend, add to summary

### Vendor Ranking Example

```
Rank | Tier | Vendor Code | Vendor Name        | Orders | Total Amount  | Payment %
  #1 |  A   | V-001       | ABC Suppliers Ltd  |   45   | LKR 2,450,000 |  89.8%
  #2 |  A   | V-002       | XYZ Trading Co     |   38   | LKR 1,980,000 | 100.0%

Top 5: 72.4% | Top 10: 88.6% | A-Tier: 5 vendors (75.6%)
```

### Vendor Tier Guidelines

| Tier | Criteria | Strategy |
|------|----------|----------|
| A-Tier | Ranks 1-5, top spend | Strategic partnerships |
| B-Tier | Ranks 6-15, medium | Standard management |
| C-Tier | Rank 16+, low volume | Consolidation opportunities |

### Expected Outcome
- Vendors ranked by purchase volume
- Tier classification (A/B/C)
- Concentration ratio calculations
- Pareto analysis included
- Strategic vendor insights

### Verification Checklist
- [ ] Rank column added to report
- [ ] calculate_vendor_rank method created
- [ ] Tie handling implemented correctly
- [ ] Tier classification working
- [ ] get_vendor_tier method created
- [ ] Concentration analysis added
- [ ] Pareto analysis implemented
- [ ] Summary includes concentration stats
- [ ] Report displays rank prominently
- [ ] Tier labels are clear

---

## Task 47: Add Payment Status Column

### Overview
Add a detailed payment status indicator to the vendor report, providing at-a-glance visibility into payment compliance for each vendor. This enhancement helps identify overdue payments, track payment terms adherence, and manage vendor relationships effectively.

### Dependencies
- Task 46: Vendor ranking implemented

### Instructions

1. **Define constants:** PAYMENT_STATUS_PAID, PARTIAL, UNPAID, OVERDUE
2. **get_payment_status method:** Return status based on payment % and due_date (100%=PAID, 1-99%=PARTIAL, 0%+overdue=OVERDUE)
3. **Update format_row:** Add status and status_color fields
4. **Add Payment Status column** in get_columns (center-aligned, after Payment %)
5. **Implement days_overdue** calculation in format_row (display if >0)
6. **get_payment_aging:** Return bucket (0-30d, 31-60d, 61-90d, 90+d)
7. **Update get_summary_stats:** Add fully_paid, partially_paid, unpaid, overdue vendor counts; avg days to payment
8. **Add payment_status filter** to __init__ and get_queryset
9. **get_payment_alert:** Flag overdue >60d, payment%<50%, or large pending amounts; return alert level

### Payment Status Display

```
Vendor Name        | Total Amount  | Paid        | Pending    | Pay % | Status      | Alert
ABC Suppliers Ltd  | LKR 2,450,000 | LKR 2,200,000| LKR 250,000|  89.8%| Partial     | ⚠
XYZ Trading Co     | LKR 1,980,000 | LKR 1,980,000| LKR 0      | 100.0%| Paid        | ✓
Premier Trading    | LKR 1,580,000 | LKR   790,000| LKR 790,000|  50.0%| Overdue 45d | ⚠⚠

Fully Paid: 6 (40%) | Partial: 7 (47%) | Overdue: 1 (7%)
```

### Status & Alert Levels

| Status | Color | Meaning | Alert Level |
|--------|-------|---------|-------------|
| Paid | Green | All paid | ✓ None |
| Partial | Yellow | Some pending | ⚠ Warning if >threshold |
| Overdue | Red | Past due | ⚠⚠ Critical if >60 days |

### Expected Outcome
- Clear payment status for each vendor
- Visual indicators (color, icons)
- Overdue payment tracking
- Payment aging analysis
- Alert system for problem accounts
- Enhanced vendor management

### Verification Checklist
- [ ] Payment status constants defined
- [ ] get_payment_status method created
- [ ] Status column added to report
- [ ] Overdue days calculation working
- [ ] Payment aging buckets implemented
- [ ] Summary includes payment metrics
- [ ] Payment status filtering enabled
- [ ] Alert indicators functional
- [ ] Color coding applied
- [ ] Handles edge cases (null dates)

---

## Task 48: Create PurchaseByCategoryReport

### Overview
Implement a report generator that analyzes purchase orders grouped by product category. This report provides insights into spending patterns across different product lines, enabling better inventory planning, budget allocation, and category management strategies.

### Dependencies
- Task 47 complete, ProductCategory model, PurchaseOrder/PurchaseOrderItem models available

### Instructions

1. **Create `purchase_category_report.py`** with PurchaseByCategoryReport class
2. **Imports:** BaseReportGenerator, PurchaseOrder/Item, ProductCategory, aggregation functions
3. **Define class:** Inherit BaseReportGenerator, set report_name/code
4. **__init__:** Accept tenant_id, date_from/to, category_id, parent_category_id (optional)
5. **get_queryset:** Filter PurchaseOrderItem by tenant (via purchase_order), join ProductCategory, apply date/category filters
6. **prepare_data:** Group by category, annotate total_items (Sum qty), total_orders (Count distinct PO), total_amount (Sum), avg_unit_price (Avg); order by amount desc
7. **format_row:** Format category name/code/parent, items, orders, amount, avg_price with currency
8. **get_columns:** Category Code, Name, Parent Category, Total Items, Orders, Total Amount, Avg Price
9. **get_report_title:** Include date range and category filter
10. **get_summary_stats:** Total categories, items, orders, amount, avg per category, top category

### Report Output Structure

```
Category Code | Category Name      | Parent      | Items | Orders | Total Amount  | Avg Price
CAT-001       | Electronics        | -           | 1,250 |   45   | LKR 3,450,000 | LKR 2,760
CAT-002       | Furniture          | -           |   890 |   38   | LKR 2,680,000 | LKR 3,011
CAT-004       | Kitchen Appliances | Electronics |   450 |   22   | LKR 1,780,000 | LKR 3,956

Total Categories: 18 | Items: 12,450 | Orders: 245 | Amount: LKR 15,850,000
```

### Key Metrics

| Metric | Calculation | Purpose |
|--------|-------------|---------|
| Total Items | SUM(poi.quantity) | Volume analysis |
| Total Amount | SUM(qty × price) | Spending per category |
| Average Price | AVG(poi.unit_price) | Price trends |

### Expected Outcome
- Functional PurchaseByCategoryReport class
- Accurate category-wise aggregation
- Support for category hierarchy
- Summary statistics for overview
- Foundation for percentage breakdown (Task 49)

### Verification Checklist
- [ ] PurchaseByCategoryReport class created
- [ ] Inherits from BaseReportGenerator
- [ ] Accepts tenant_id and date filters
- [ ] get_queryset joins categories correctly
- [ ] prepare_data aggregates by category
- [ ] Handles parent categories
- [ ] format_row extracts category details
- [ ] get_columns defines appropriate columns
- [ ] get_report_title includes filters
- [ ] get_summary_stats calculates metrics
- [ ] Currency formatting correct
- [ ] Handles missing categories

---

## Task 49: Add Category Breakdown Percentages

### Overview
Enhance the PurchaseByCategoryReport with percentage calculations that show each category's contribution to total purchases. This feature enables quick identification of spending distribution and supports Pareto analysis for category prioritization.

### Dependencies
- Task 48: PurchaseByCategoryReport created

### Instructions

1. **Update prepare_data:** Calculate total_amount sum, then for each row: percentage = (category_amount/total)×100
2. **Add cumulative percentage:** Sort by amount desc, accumulate percentages: cumulative[n] = cumulative[n-1] + percentage[n]
3. **Update get_columns:** Add "Percentage" and "Cumulative %" columns after Total Amount
4. **Update format_row:** Format percentage and cumulative_percentage with % symbol (2 decimals)
5. **get_category_distribution:** Count categories by ranges: Large (>20%), Medium (10-20%), Small (<10%)
6. **get_pareto_categories:** Find categories contributing 80% of spend using cumulative percentages
7. **get_concentration_index:** Calculate HHI = Σ(percentage²); interpret: <1500=Low, 1500-2500=Moderate, >2500=High
8. **get_category_tier:** Classify as A (top 20% spend), B (next 30%), C (remaining 50%); add tier column
9. **get_percentage_bar (optional):** Create ASCII bar: "███████░░░ 70%"

### Enhanced Report with Percentages

```
Category Name      | Total Amount  | Percentage | Cumulative | Tier | Visual
Electronics        | LKR 3,450,000 |    27.8%   |    27.8%   |  A   | ███████░░░
Furniture          | LKR 2,680,000 |    21.6%   |    49.4%   |  A   | ██████░░░░
Office Supplies    | LKR 1,950,000 |    15.7%   |    65.1%   |  B   | ████░░░░░░
Kitchen Appliances | LKR 1,780,000 |    14.4%   |    79.5%   |  B   | ████░░░░░░

Pareto: 4 categories = 80% | HHI: 1,847 (Moderate)
```

### Category Tier Guidelines

| Tier | Criteria | Focus |
|------|----------|-------|
| A-Tier | Top 20% spend | Strategic sourcing, contracts |
| B-Tier | Next 30% spend | Regular monitoring |
| C-Tier | Bottom 50% spend | Consolidation opportunities |

### Concentration Metrics

**HHI Interpretation:**
- <1500: Low concentration (diverse)
- 1500-2500: Moderate concentration (balanced)
- >2500: High concentration (risky)

### Expected Outcome
- Percentage calculations accurate
- Cumulative percentages computed
- Pareto analysis performed
- Concentration index calculated
- Category tiers assigned
- Visual indicators added
- Strategic insights provided

### Verification Checklist
- [ ] Percentage calculation implemented
- [ ] Percentages sum to 100%
- [ ] Cumulative percentage working
- [ ] Percentage column added to report
- [ ] get_category_distribution created
- [ ] Pareto analysis functional
- [ ] HHI calculation correct
- [ ] Category tiers assigned
- [ ] Visual bars displayed (if implemented)
- [ ] Summary includes distribution stats
- [ ] Handles zero total gracefully

---

## Task 50: Create VendorPerformanceReport

### Overview
Implement a comprehensive vendor performance report that evaluates vendors based on multiple metrics including delivery performance, quality standards, lead time analysis, and payment compliance. This report is the most complex in the purchase reporting suite and provides critical data for vendor management and strategic sourcing decisions.

### Dependencies
- Task 49 complete, GRN model, QualityCheck model (if available), PurchaseOrder with expected dates

### Instructions

1. **Create `vendor_performance_report.py`** with VendorPerformanceReport class
2. **Imports:** BaseReportGenerator, PurchaseOrder, GRN, Vendor, QualityCheck, date/aggregation utilities
3. **Define performance constants:** DELIVERY_ON_TIME, EARLY, LATE, QUALITY_PASS, FAIL, PARTIAL
4. **Class definition:** Inherit BaseReportGenerator, set report_name/code, accept tenant_id, dates, vendor_id, min_orders (default:3)
5. **get_queryset:** Filter Vendors by tenant with orders >= min_orders, apply date/vendor filters, prefetch GRN/quality records
6. **calculate_delivery_metrics:** Query GRNs, count total/on_time/early/late deliveries, calculate on_time_%, avg_delay_days
7. **calculate_lead_time_metrics:** Calculate lead time (received - order date), compute avg/min/max/variance
8. **calculate_quality_metrics:** Count inspections/passed/failed, calculate pass_rate, rejection_rate
9. **calculate_order_metrics:** Count orders, sum amounts, calculate avg order value, count products, order frequency
10. **calculate_payment_metrics:** Extract payment terms, calculate actual payment days, count early/on_time/late, compliance_rate
11. **calculate_overall_score:** Weight dimensions (Delivery:30%, Quality:25%, Lead time:20%, Payment:15%, Order:10%), return score 0-100 and rating A-F
12. **prepare_data:** For each vendor, run all metric calculations, combine, sort by score
13. **format_row:** Format all metrics, percentages, days, score, rating
14. **get_columns:** Vendor Code/Name, Orders, On-Time%, Quality%, Avg Lead Time, Variance, Score, Rating
15. **get_summary_stats:** Total vendors, avg score, best/worst vendor, rating distribution, avg metrics

### Report Output Structure

```
VENDOR PERFORMANCE REPORT - January-March 2026

Vendor         | Orders | On-Time | Quality | Avg Lead | Variance | Score | Rating | Tier
               |        | Deliver | Pass %  | Time     |          |       |        |
XYZ Trading Co |   38   |  97.4%  |  98.5%  |  12 days |  2 days  |  94.2 |   A    | Gold
ABC Suppliers  |   45   |  89.8%  |  95.2%  |  15 days |  4 days  |  88.6 |   B+   | Silver

SUMMARY: 15 vendors | Avg Score: 82.4 | Best: XYZ (94.2)

DELIVERY: XYZ - 38 total, 37 on-time, 1 late (avg delay: 2d)
QUALITY: XYZ - 152 inspections, 150 passed (98.5%), 45 items rejected (0.8%)
LEAD TIME: XYZ - 12d avg, 9-15d range, 2d variance (Excellent consistency)

RATINGS: A (90-100): 2 vendors | B (80-89): 6 | C (70-79): 4 | D (60-69): 2
```

### Performance Scoring (100 points total)

| Dimension | Weight | Calculation |
|-----------|--------|-------------|
| Delivery Performance | 30% | On-time rate × 0.30 |
| Quality Performance | 25% | Quality pass rate × 0.25 |
| Lead Time Consistency | 20% | (Benchmark/actual) × 0.20 |
| Payment Compliance | 15% | Compliance rate × 0.15 |
| Order Reliability | 10% | Fulfillment rate × 0.10 |

### Vendor Rating Scale

| Score | Rating | Tier | Action |
|-------|--------|------|--------|
| 90-100 | A | Gold | Strategic partner status |
| 80-89 | B | Silver | Reliable vendor, maintain |
| 70-79 | C | Bronze | Monitor performance |
| 60-69 | D | Review | Improvement plan required |
| <60 | F | Critical | Consider replacement |

### Expected Outcome
- Comprehensive vendor performance analysis
- Multi-dimensional scoring system
- Clear performance ratings (A-F)
- Detailed metrics for each dimension
- Actionable recommendations
- Strategic vendor insights

### Verification Checklist
- [ ] VendorPerformanceReport class created
- [ ] All metric calculation methods implemented
- [ ] Delivery metrics accurate
- [ ] Lead time analysis working
- [ ] Quality metrics calculated
- [ ] Order metrics aggregated
- [ ] Payment metrics tracked
- [ ] Overall scoring algorithm correct
- [ ] Vendor ratings assigned properly
- [ ] Report displays all metrics
- [ ] Summary statistics comprehensive
- [ ] Recommendations generated
- [ ] Handles missing data gracefully
- [ ] Performance trends tracked

---

## Task 51: Add Lead Time Analysis

### Overview
Enhance the VendorPerformanceReport with advanced lead time analysis capabilities, including trend analysis, seasonal patterns, and predictive metrics. This enhancement provides deeper insights into vendor delivery patterns and helps optimize procurement planning.

### Dependencies
- Task 50: VendorPerformanceReport fully implemented

### Instructions

1. **calculate_lead_time_trend:** Split date range into periods, calculate avg per period, apply linear regression for slope/direction (improving/stable/declining)
2. **analyze_seasonal_patterns:** Group by month/quarter, calculate avg per season, identify peak/off-peak periods
3. **calculate_lead_time_percentiles:** Compute P10, P25, P50, P75, P90 for realistic expectations
4. **calculate_variability_index:** Calculate CV = (σ/μ)×100; classify: <15%=Consistent, 15-25%=Moderate, >25%=High variability
5. **calculate_on_time_probability:** Given target days, return probability based on historical distribution
6. **forecast_lead_time:** Use moving average/exponential smoothing considering trend/seasonality, return forecast with confidence interval
7. **compare_to_benchmark:** Compare to industry/best-in-class/average vendors, calculate performance gap
8. **analyze_lead_time_components:** Break down into order processing, supplier processing, transit, receiving; identify bottlenecks
9. **get_lead_time_alerts:** Check patterns: increasing trend (>10%/quarter), high CV (>25%), frequent delays (>30%), outliers
10. **Update report output:** Add trend indicator (↑↓→), percentiles, variability index, on-time probability, seasonal patterns, forecast, alerts

### Enhanced Lead Time Analysis Output

```
ADVANCED LEAD TIME ANALYSIS - ABC Suppliers (V-001) - Q1 2026

SUMMARY: Avg: 15.3d | Median: 14.0d | StdDev: 4.2d | CV: 27.5% ⚠ | Trend: ↑ +8.5%

PERCENTILES: P10: 9.5d | P25: 12.0d | P50: 14.0d | P75: 18.0d | P90: 22.5d

TREND: Jan 14.2d → Feb 15.1d (+0.9d) → Mar 16.5d (+1.4d) = ↑ INCREASING (⚠ Action needed)

SEASONAL: Jan 14.5d (normal) | Feb 15.0d (normal) | Mar 16.8d (+1.5d, 10% slower)

ON-TIME PROBABILITY: 12d=28% | 14d=52% | 16d=74% | 18d=88% ✓ (Recommended)

FORECAST (Apr 2026): 17.2 days (Range: 15.5-19.0d, 75% confidence)

COMPARISON: This vendor 15.3d vs Avg 14.8d vs Best 11.2d (Gap: +4.1d, 37% worse)

BOTTLENECK: Supplier processing 8.2d (54%) - High improvement opportunity

ALERTS: ⚠⚠ High CV (27.5%) | ⚠ Trend +8.5%/mo | ⚠ Bottleneck identified

RECOMMENDATIONS:
1. Target 14 days (current: 15.3d)
2. Address supplier processing (8.2d → reduce)
3. Improve consistency (CV: 27.5% → <20%)
4. March orders: place 2-3 days earlier
5. Monitor trend - escalate if continues
```

### Key Analysis Methods

**Trend Detection:** Linear regression on time periods → slope = trend direction
**Seasonal Patterns:** Group by month → compare to average → identify deviations
**Probability:** Empirical CDF → P(delivery ≤ X days) = count(≤X) / total
**Variability Index:** CV = (σ / μ) × 100 | <15%=Excellent | 15-25%=Acceptable | >25%=Concerning

### Expected Outcome
- Advanced lead time metrics
- Trend detection and alerts
- Seasonal pattern insights
- Probabilistic delivery estimates
- Detailed component analysis
- Predictive capabilities
- Benchmarking comparisons
- Actionable recommendations

### Verification Checklist
- [ ] Trend analysis implemented
- [ ] Seasonal pattern detection working
- [ ] Percentile calculations accurate
- [ ] Variability index computed
- [ ] Probability calculator functional
- [ ] Forecasting method implemented
- [ ] Comparison to benchmarks working
- [ ] Component breakdown available
- [ ] Alerts generated appropriately
- [ ] Report displays all analysis
- [ ] Handles insufficient data gracefully
- [ ] Statistical methods validated

---

## Task 52: Create Inventory Report API Endpoint

### Overview
Implement a unified API endpoint that provides access to all inventory and purchase reports. This endpoint serves as the interface for frontend dashboards, mobile applications, and external integrations to request and retrieve report data in various formats.

### Dependencies
- Task 51 complete, all report generators implemented, Django REST Framework installed, authentication system in place

### Instructions

1. **Create `apps/analytics/api/inventory_report_views.py`**
2. **Imports:** DRF (APIView, Response, status), auth/permission classes, all report generators, serializers, pagination, export utils
3. **Define report type constants:** STOCK_LEVEL, STOCK_MOVEMENT, STOCK_VALUATION, PURCHASE_VENDOR, PURCHASE_CATEGORY, VENDOR_PERFORMANCE
4. **InventoryReportListView:** GET endpoint returning available reports with metadata (type, name, description, required/optional params)
5. **InventoryReportGenerateView:** POST endpoint accepting report_type + params, validate, instantiate generator, return JSON
6. **validate_report_params:** Check required params per type, validate dates (ISO 8601), ranges, filter IDs
7. **Format parameter support:** Accept 'json', 'pdf', 'excel', 'csv'; implement export_to_pdf, export_to_excel, export_to_csv methods
8. **Response caching:** Generate cache key "report:{type}:{tenant}:{params_hash}", check cache (15min timeout), set cache-control headers
9. **ScheduleReportView (optional):** Accept schedule params (frequency, recipients, format), create scheduled task
10. **Error handling:** Catch exceptions, return 400/404/500 with messages, log errors
11. **API documentation:** Use drf-spectacular/swagger, document endpoints with examples
12. **URL routing:** Add to `apps/analytics/api/urls.py` - GET /inventory-reports/, POST /inventory-reports/generate/
13. **Rate limiting:** Add throttling (10 req/min per user), return 429 if exceeded
14. **Security:** Enforce authentication, validate tenant access, check permissions, sanitize inputs

### API Endpoint Structure

**List Available Reports**
```
GET /api/analytics/inventory-reports/
Response: { "reports": [ { "type": "purchase_vendor", "name": "Purchase by Vendor", ... } ] }
```

**Generate Report**
```
POST /api/analytics/inventory-reports/generate/
Body: { "report_type": "purchase_vendor", "tenant_id": "...", "date_from": "2026-01-01", ... }
Response: { "report_type": "...", "data": { "summary": {...}, "rows": [...] } }
```

**Export Formats:** JSON (default), PDF, Excel, CSV - set "format" parameter

### Request Validation

| Report Type | Required Params | Optional Params |
|-------------|----------------|-----------------|
| stock_level | tenant_id | location_id, category_id, dates |
| purchase_vendor | tenant_id | date_from, date_to, vendor_id |
| vendor_performance | tenant_id, date_from, date_to | vendor_id, min_orders |

### Security & Performance

**Authentication:** Token-based, validate tenant access
**Rate Limiting:** 10 requests/min per user  
**Caching:** 15min cache, key: "report:{type}:{tenant}:{params_hash}"
**Query Optimization:** Use select_related, prefetch_related, database indexes

### Expected Outcome
- Functional REST API endpoint
- Support for all inventory reports
- Multiple export formats (JSON, PDF, Excel, CSV)
- Request validation and error handling
- Response caching for performance
- API documentation
- Rate limiting and security
- Clean URL structure

### Verification Checklist
- [ ] API views created
- [ ] Report type constants defined
- [ ] List view returns available reports
- [ ] Generate view accepts parameters
- [ ] Parameter validation working
- [ ] All report types supported
- [ ] JSON format working
- [ ] PDF export functional (if implemented)
- [ ] Excel export functional (if implemented)
- [ ] CSV export functional (if implemented)
- [ ] Response caching implemented
- [ ] Error handling comprehensive
- [ ] URL routing configured
- [ ] Authentication enforced
- [ ] Authorization checked
- [ ] Rate limiting applied
- [ ] API documentation complete
- [ ] Testing performed

---

## Summary

This document covered the implementation of purchase and vendor performance reporting functionality:

### Completed Features

**Purchase Reports**
- ✅ PurchaseByVendorReport with ranking and payment status
- ✅ Vendor ranking by purchase volume
- ✅ Payment status tracking and aging analysis
- ✅ PurchaseByCategoryReport with percentage breakdown
- ✅ Category concentration analysis and Pareto insights

**Vendor Performance**
- ✅ VendorPerformanceReport with multi-dimensional scoring
- ✅ Delivery performance metrics
- ✅ Quality performance tracking
- ✅ Advanced lead time analysis with trends and forecasting
- ✅ Overall vendor scoring and rating system

**API Integration**
- ✅ Unified inventory report API endpoint
- ✅ Multiple export formats support
- ✅ Request validation and error handling
- ✅ Caching and performance optimization

### Key Achievements

1. **Comprehensive Vendor Analysis** - Multi-dimensional performance evaluation
2. **Strategic Insights** - Ranking, tiering, and concentration analysis
3. **Predictive Capabilities** - Lead time forecasting and trend detection
4. **Payment Management** - Detailed payment status and aging tracking
5. **API Access** - RESTful interface for report generation and export

### Business Value

**Procurement Optimization**
- Identify top-performing vendors
- Negotiate better terms with high-volume vendors
- Allocate business strategically

**Risk Management**
- Detect vendor concentration risk
- Identify unreliable vendors
- Monitor performance trends
- Plan backup suppliers

**Financial Control**
- Track payment obligations by vendor
- Monitor payment aging
- Manage cash flow effectively
- Ensure payment compliance

**Performance Improvement**
- Set vendor performance targets
- Conduct data-driven review meetings
- Track improvement initiatives
- Reward exceptional performance

### Integration Points

These reports integrate with:
- **Stock Reports** (Tasks 35-44) - Complete inventory analysis suite
- **Dashboard KPIs** (SubPhase 13) - Summary metrics for dashboards
- **Frontend UI** - Report viewing and download interfaces
- **Scheduled Reports** - Automated report generation and distribution

### Next Steps

1. **Testing** - Thoroughly test all report generators with various data scenarios
2. **Performance Tuning** - Optimize queries for large datasets
3. **UI Integration** - Connect reports to frontend dashboards
4. **User Training** - Document report usage and interpretation
5. **Scheduled Reports** - Implement automated report distribution
6. **Advanced Features** - Add drill-down capabilities and interactive reports

---

## Notes for AI Agents

### Implementation Priority

1. **Start with PurchaseByVendorReport** (Task 45) - Foundation for vendor analysis
2. **Add ranking** (Task 46) - Enhances vendor comparison
3. **Implement payment status** (Task 47) - Critical for financial management
4. **Create PurchaseByCategoryReport** (Task 48) - Different aggregation pattern
5. **Add percentages** (Task 49) - Strategic category insights
6. **Build VendorPerformanceReport** (Task 50) - Most complex, build on previous tasks
7. **Enhance with lead time analysis** (Task 51) - Advanced analytics
8. **Create API endpoint** (Task 52) - Ties everything together

### Key Implementation Considerations

**Data Sources**
- PurchaseOrder model: Order totals, dates, vendor relationships
- GRN model: Delivery dates, received quantities, quality data
- Vendor model: Vendor details, payment terms
- ProductCategory model: Category hierarchy
- Ensure models have required timestamp fields

**Performance Optimization**
- Use Django ORM aggregation (annotate, aggregate)
- Avoid N+1 queries with select_related/prefetch_related
- Add database indexes on frequently filtered fields
- Consider materialized views for complex aggregations
- Implement caching for expensive calculations

**Tenant Isolation**
- Always filter by tenant_id first
- Use tenant middleware if available
- Validate tenant access in API endpoints
- Include tenant in cache keys

**Edge Cases to Handle**
- Vendors with no orders (exclude or show separately)
- Missing GRN data (mark as pending/unknown)
- Null/empty vendor assignments
- Division by zero in percentage calculations
- Date ranges with no data (show empty report with message)
- Tied rankings (handle consistently)

**Statistical Methods**
- Use robust statistical libraries (NumPy, pandas) if available
- Validate statistical assumptions (minimum sample size)
- Handle outliers appropriately
- Provide confidence intervals for predictions
- Document calculation methods in code comments

**Testing Scenarios**
- Single vendor vs. multiple vendors
- Short vs. long date ranges
- Large vs. small datasets
- Missing optional data (quality checks, delivery dates)
- Extreme values (very large orders, long delays)
- Concurrent API requests

### Code Organization

**File Structure**
```
apps/analytics/reports/inventory/
├── __init__.py
├── purchase_vendor_report.py         # Tasks 45-47
├── purchase_category_report.py       # Tasks 48-49
├── vendor_performance_report.py      # Tasks 50-51
└── utils.py                          # Shared utilities
```

**Shared Utilities**
- Date range validation
- Currency formatting
- Percentage formatting
- Statistical calculations
- Export helpers (PDF, Excel)

**Constants Module**
- Report type constants
- Payment status constants
- Performance rating thresholds
- Scoring weights
- Tier definitions

### Documentation Standards

**Code Documentation**
- Docstrings for all classes and methods
- Explain complex calculations with formulas
- Document metric definitions
- Include usage examples
- Reference business requirements

**API Documentation**
- OpenAPI/Swagger specification
- Request/response examples
- Error response documentation
- Parameter descriptions
- Authentication requirements

**User Documentation**
- Report interpretation guides
- Metric definitions and calculations
- Use case examples
- FAQ section
- Troubleshooting tips

### Integration with Existing Systems

**Django Apps**
- Import models from inventory, purchasing apps
- Use tenant middleware from multi-tenancy system
- Integrate with authentication/permissions
- Connect to task queue (Celery) for scheduled reports

**Frontend Integration**
- Define clear API contracts
- Provide JSON schema for responses
- Support CORS if needed
- Implement pagination for large datasets
- Provide progress indicators for slow reports

**External Systems**
- Support webhook notifications for scheduled reports
- Enable API key authentication for integrations
- Provide CSV export for data warehouse imports
- Document integration patterns

### Maintenance Considerations

**Monitoring**
- Log report generation times
- Track API endpoint usage
- Monitor cache hit rates
- Alert on generation failures
- Track query performance

**Upgrades**
- Version API endpoints
- Maintain backward compatibility
- Deprecate old endpoints gracefully
- Document breaking changes
- Provide migration guides

**Scalability**
- Design for horizontal scaling
- Use connection pooling
- Implement query timeouts
- Consider read replicas for reporting
- Archive old report data

---

**Document Status:** ✅ Complete  
**Total Tasks:** 8  
**Total Lines:** ~980  
**Complexity:** High (Tasks 50-51), Medium (Tasks 45-49), Low (Task 52)  
**Estimated Total Time:** 4-5 hours

