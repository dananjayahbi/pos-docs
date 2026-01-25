# Tasks 53-62: Customer Analytics Reports

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 14 - Analytics Reports  
> **Group:** D - Customer & Staff Reports  
> **Document:** 01 of 02  
> **Tasks Covered:** 53, 54, 55, 56, 57, 58, 59, 60, 61, 62

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-63-70_Staff-Reports.md](02_Tasks-63-70_Staff-Reports.md)

---

## Document Overview

This document covers the implementation of customer analytics reports, providing critical insights into customer acquisition, retention, and lifetime value (CLV). These reports enable businesses to understand customer behavior patterns, measure marketing effectiveness, and identify high-value customer segments for strategic decision-making.

### Key Features
- **Customer Acquisition Analysis:** Track new customer growth, acquisition channels, and first purchase metrics
- **Retention Metrics:** Monitor repeat purchase behavior, retention rates, and churn analysis
- **Lifetime Value Calculation:** Calculate and segment customers by their total value to the business
- **Advanced Segmentation:** Categorize customers into High, Medium, and Low value tiers
- **Time-based Analysis:** Generate reports across daily, weekly, monthly, and custom date ranges

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 53 | Create CustomerAcquisitionReport model | Medium | 35 min |
| 54 | Implement acquisition calculation logic | High | 45 min |
| 55 | Add acquisition channel tracking | Medium | 30 min |
| 56 | Create CustomerRetentionReport model | Medium | 35 min |
| 57 | Implement retention calculation logic | High | 50 min |
| 58 | Add churn analysis capabilities | High | 40 min |
| 59 | Create CustomerLifetimeValueReport model | High | 40 min |
| 60 | Implement CLV calculation logic | High | 50 min |
| 61 | Add customer segmentation by CLV | Medium | 35 min |
| 62 | Create customer reports API endpoint | Medium | 40 min |

---

## Customer Analytics System Overview

### Report Architecture

```
CustomerReportSystem
│
├── CustomerAcquisitionReport
│   ├── New customer tracking
│   ├── Acquisition channel analysis
│   └── First purchase metrics
│
├── CustomerRetentionReport
│   ├── Repeat purchase analysis
│   ├── Retention rate calculation
│   └── Churn identification
│
└── CustomerLifetimeValueReport
    ├── CLV formula calculation
    ├── Customer segmentation
    └── Value tier analysis
```

### Data Flow

```
Customer Data (Customer Model)
          ↓
Transaction History (SalesInvoice Model)
          ↓
Report Generator (BaseReportGenerator)
          ↓
Analytics Calculation (Period-based aggregation)
          ↓
Report Output (JSON with metrics, charts, tables)
```

### Key Metrics Definitions

| Metric | Formula | Purpose |
|--------|---------|---------|
| Acquisition Rate | New Customers / Time Period | Growth tracking |
| Retention Rate | Repeat Customers / Total Customers × 100% | Loyalty measurement |
| Churn Rate | (Lost Customers / Total Customers) × 100% | Attrition tracking |
| Customer Lifetime Value | AOV × Purchase Frequency × Lifespan | Value prediction |
| Average Order Value | Total Revenue / Number of Orders | Spending behavior |
| Purchase Frequency | Total Orders / Total Customers | Engagement level |

---

## Task 53: Create CustomerAcquisitionReport Model

### Overview
Create the CustomerAcquisitionReport model to track and analyze new customer acquisition over time. This model inherits from BaseReportGenerator and provides specialized fields and methods for acquisition analysis, including channel tracking and first purchase metrics.

### Dependencies
- BaseReportGenerator model exists (from earlier tasks)
- Customer model exists (from core modules)
- SalesInvoice model exists (from sales modules)

### Instructions

1. **Create model file**
   - Navigate to `apps/analytics/reports/models/`
   - Create or open `customer_reports.py`
   - Import necessary dependencies

2. **Import required modules**
   - Import Django models and fields
   - Import BaseReportGenerator from base models
   - Import Customer and SalesInvoice models
   - Import timezone utilities
   - Import JSON field for storing structured data

3. **Define CustomerAcquisitionReport class**
   - Inherit from BaseReportGenerator
   - Add model docstring explaining purpose
   - Set appropriate Meta options

4. **Add acquisition-specific fields**
   - `total_new_customers`: IntegerField for customer count
   - `acquisition_by_channel`: JSONField for channel breakdown
   - `first_purchase_metrics`: JSONField for purchase data
   - `average_first_order_value`: DecimalField for AOV
   - `period_comparison`: JSONField for trend data

5. **Set field properties**
   - Make numeric fields non-negative
   - Set decimal precision (max_digits=15, decimal_places=2)
   - Add help_text for documentation
   - Set appropriate default values (0 for integers, {} for JSON)

6. **Configure Meta class**
   - Set `verbose_name` to "Customer Acquisition Report"
   - Set `verbose_name_plural` to "Customer Acquisition Reports"
   - Add ordering by `['-created_at']`
   - Set `db_table` to 'analytics_customer_acquisition_report'

7. **Add string representation**
   - Implement `__str__` method
   - Return format: "Acquisition Report: {start_date} to {end_date}"
   - Make it informative for admin interface

8. **Add report_type property**
   - Override report_type from base
   - Return constant 'customer_acquisition'
   - Used for report filtering and categorization

### Field Details

| Field Name | Type | Purpose | Example Value |
|------------|------|---------|---------------|
| total_new_customers | Integer | Count of new customers | 247 |
| acquisition_by_channel | JSON | Channel breakdown | {"online": 150, "retail": 97} |
| first_purchase_metrics | JSON | First purchase data | {"avg_value": 5500, "total": 1358500} |
| average_first_order_value | Decimal | Average first purchase | 5500.00 |
| period_comparison | JSON | Previous period comparison | {"growth": 15.3, "trend": "up"} |

### Acquisition Channel Examples

Channels to track (stored in acquisition_by_channel):
- **online**: E-commerce/webstore purchases
- **retail**: In-store POS transactions
- **phone**: Phone order placements
- **wholesale**: B2B customer acquisition
- **referral**: Referred by existing customers
- **marketing**: Marketing campaign responses

### Expected Outcome
- CustomerAcquisitionReport model defined and registered
- Proper field definitions for acquisition tracking
- Inheritance from BaseReportGenerator working correctly
- Model accessible in Django admin
- Database table created via migrations

### Verification Checklist
- [ ] Model file created in correct location
- [ ] All imports are correct and complete
- [ ] CustomerAcquisitionReport inherits from BaseReportGenerator
- [ ] All required fields defined with correct types
- [ ] Field constraints set (non-negative, decimal precision)
- [ ] Meta class configured properly
- [ ] `__str__` method implemented
- [ ] `report_type` property returns 'customer_acquisition'
- [ ] Model runs without errors during migration check

---

## Task 54: Implement Acquisition Calculation Logic

### Overview
Implement the core calculation logic for customer acquisition analysis. This includes identifying new customers within a date range, calculating channel distribution, analyzing first purchase behavior, and generating comparison metrics with previous periods.

### Dependencies
- Task 53: CustomerAcquisitionReport model created
- Customer model has `created_at` field
- SalesInvoice model has customer relationship

### Instructions

1. **Override generate_report_data method**
   - Define method signature: `generate_report_data(self) -> dict`
   - This method is called by BaseReportGenerator
   - Return structured dictionary with all metrics

2. **Extract date range parameters**
   - Get `start_date` and `end_date` from model fields
   - Convert to timezone-aware datetime if needed
   - Validate date range is logical (start before end)

3. **Query new customers in period**
   - Filter Customer model by `created_at`
   - Use `gte` for start_date and `lte` for end_date
   - Ensure tenant filtering is applied
   - Count total new customers

4. **Calculate acquisition by channel**
   - For each new customer, identify acquisition channel
   - Group customers by channel (from Customer.acquisition_channel field)
   - Use aggregation or loop to count per channel
   - Store results as dictionary

5. **Analyze first purchase metrics**
   - For each new customer, find their first invoice
   - Filter SalesInvoice by customer and date
   - Order by created_at, get first
   - Extract invoice total_amount
   - Calculate aggregate: sum, average, min, max

6. **Calculate average first order value**
   - Sum all first purchase amounts
   - Divide by number of customers with purchases
   - Round to 2 decimal places
   - Handle division by zero case

7. **Generate period comparison data**
   - Calculate previous period dates (same duration, shifted back)
   - Query customers from previous period
   - Calculate growth percentage: ((current - previous) / previous) × 100
   - Determine trend direction: up, down, stable
   - Store comparison metrics

8. **Build channel breakdown structure**
   - Create dictionary with channel names as keys
   - Include count and percentage for each channel
   - Calculate percentage: (channel_count / total) × 100
   - Sort by count descending

9. **Compile first purchase metrics**
   - Structure: total_value, average_value, min_value, max_value
   - Include purchase_rate: customers_with_purchase / total_customers
   - Add time_to_first_purchase metric (average days)

10. **Construct return dictionary**
    - Include all calculated metrics
    - Add metadata: calculation_date, data_points
    - Ensure JSON serializable format
    - Include any warnings or notes

11. **Store calculated data in model fields**
    - Set `total_new_customers` from count
    - Set `acquisition_by_channel` from channel dict
    - Set `first_purchase_metrics` from purchase analysis
    - Set `average_first_order_value` from calculation
    - Set `period_comparison` from trend data
    - Call `self.save()` to persist

### Calculation Logic Flow

```
1. Extract Parameters
   └─> start_date, end_date

2. Query New Customers
   └─> Filter by created_at in range
   └─> Apply tenant filter
   └─> Count results

3. Channel Analysis
   └─> Group by acquisition_channel
   └─> Count per channel
   └─> Calculate percentages

4. First Purchase Analysis
   └─> For each customer, get first invoice
   └─> Extract amounts
   └─> Calculate aggregates

5. Trend Comparison
   └─> Query previous period
   └─> Calculate growth rate
   └─> Determine trend direction

6. Save Results
   └─> Update model fields
   └─> Persist to database
```

### Return Data Structure

```
{
  "period": {
    "start": "2026-01-01",
    "end": "2026-01-31"
  },
  "acquisition": {
    "total_new_customers": 247,
    "by_channel": {
      "online": {"count": 150, "percentage": 60.7},
      "retail": {"count": 97, "percentage": 39.3}
    }
  },
  "first_purchase": {
    "customers_with_purchase": 231,
    "purchase_rate": 93.5,
    "total_value": 1358500.00,
    "average_value": 5880.52,
    "min_value": 450.00,
    "max_value": 75000.00,
    "avg_days_to_purchase": 2.3
  },
  "comparison": {
    "previous_period_customers": 215,
    "growth_count": 32,
    "growth_percentage": 14.9,
    "trend": "up"
  },
  "metadata": {
    "calculated_at": "2026-02-01T10:30:00Z",
    "data_points": 247
  }
}
```

### Expected Outcome
- Accurate calculation of new customer acquisition
- Detailed channel breakdown with percentages
- Comprehensive first purchase analysis
- Period-over-period growth comparison
- All data stored in model fields
- Report data method returns complete metrics

### Verification Checklist
- [ ] `generate_report_data` method implemented
- [ ] Date range extraction working correctly
- [ ] New customer query filters properly by date
- [ ] Tenant isolation maintained in queries
- [ ] Channel grouping logic accurate
- [ ] First purchase identification correct (earliest invoice)
- [ ] Aggregate calculations accurate (sum, average, etc.)
- [ ] Division by zero handled gracefully
- [ ] Previous period calculation logic correct
- [ ] Growth percentage formula accurate
- [ ] All model fields updated with calculated values
- [ ] Return dictionary structure matches specification
- [ ] JSON serialization works without errors
- [ ] Test with sample data yields expected results

---

## Task 55: Add Acquisition Channel Tracking

### Overview
Enhance the acquisition analysis with detailed channel tracking capabilities, including source attribution, campaign tracking, referral analysis, and conversion funnel metrics. This provides deeper insights into which channels are most effective for customer acquisition.

### Dependencies
- Task 54: Acquisition calculation logic implemented
- Customer model may need additional fields for tracking

### Instructions

1. **Extend Customer model if needed**
   - Add `acquisition_channel` field if not exists (CharField, choices)
   - Add `acquisition_source` field for detailed source (e.g., "google_ads")
   - Add `acquisition_campaign` field for campaign name
   - Add `referral_code` field for referral tracking
   - Add `utm_parameters` JSONField for marketing attribution

2. **Define channel constants**
   - Create ACQUISITION_CHANNELS constant tuple
   - Include: online, retail, phone, wholesale, referral, marketing, organic
   - Add display names for each channel

3. **Add channel detail extraction method**
   - Define `get_channel_details(self, customer) -> dict`
   - Extract channel from customer
   - Get source and campaign info
   - Parse UTM parameters if available
   - Return structured dictionary

4. **Implement channel performance analysis**
   - For each channel, calculate metrics:
     - Customer count
     - Total first purchase value
     - Average first purchase value
     - Conversion rate (purchases / customers)
     - Time to first purchase
   - Rank channels by performance

5. **Add referral tracking logic**
   - Identify customers acquired via referral
   - Link to referring customer if applicable
   - Calculate referral effectiveness
   - Track referral chain depth

6. **Implement source attribution**
   - Parse acquisition_source field
   - Group by source categories:
     - Paid advertising (Google Ads, Facebook Ads)
     - Organic (direct, search, social)
     - Referral (existing customers, partners)
     - Marketing campaigns (email, SMS)
   - Calculate cost-effectiveness metrics if data available

7. **Add campaign tracking**
   - Group customers by campaign
   - Calculate campaign performance:
     - Customer acquisition count
     - Total revenue from campaign
     - Average customer value
     - ROI if cost data available
   - Rank campaigns by effectiveness

8. **Create channel comparison method**
   - Compare channels across multiple dimensions
   - Calculate best performing channel
   - Identify underperforming channels
   - Generate recommendations

9. **Add UTM parameter analysis**
   - Parse utm_source, utm_medium, utm_campaign
   - Track marketing attribution
   - Correlate with conversion metrics
   - Store in structured format

10. **Enhance report data output**
    - Add `channel_details` section to report
    - Include detailed breakdown per channel
    - Add referral tracking data
    - Include campaign performance metrics
    - Add source attribution insights

### Channel Tracking Structure

```
Channel Details:
├── Channel Name (e.g., "online")
│   ├── Count: 150 customers
│   ├── First Purchase Value: $827,500
│   ├── Average Value: $5,516
│   ├── Conversion Rate: 94.7%
│   ├── Avg Time to Purchase: 1.8 days
│   └── Sources:
│       ├── google_ads: 75 customers
│       ├── facebook_ads: 45 customers
│       └── organic_search: 30 customers
```

### Enhanced Return Data Structure

```
{
  "acquisition": {
    "total_new_customers": 247,
    "by_channel": { ... }
  },
  "channel_details": {
    "online": {
      "count": 150,
      "percentage": 60.7,
      "first_purchase_total": 827500.00,
      "first_purchase_average": 5516.67,
      "conversion_rate": 94.7,
      "avg_time_to_purchase": 1.8,
      "sources": {
        "google_ads": 75,
        "facebook_ads": 45,
        "organic_search": 30
      }
    },
    "retail": { ... }
  },
  "referrals": {
    "total_referred": 23,
    "referring_customers": 18,
    "referral_rate": 9.3,
    "avg_referral_value": 6200.00
  },
  "campaigns": [
    {
      "name": "spring_sale_2026",
      "customers": 45,
      "revenue": 267500.00,
      "avg_value": 5944.44,
      "channel": "online"
    }
  ]
}
```

### Expected Outcome
- Comprehensive channel tracking implemented
- Detailed source and campaign attribution
- Referral analysis capabilities added
- Enhanced report data with channel insights
- Marketing effectiveness metrics available

### Verification Checklist
- [ ] Customer model has required tracking fields
- [ ] Channel constants defined
- [ ] Channel detail extraction method working
- [ ] Channel performance metrics calculated correctly
- [ ] Referral tracking logic implemented
- [ ] Source attribution parsing works
- [ ] Campaign tracking functional
- [ ] UTM parameters parsed correctly
- [ ] Enhanced report data includes channel details
- [ ] All metrics calculate accurately with test data
- [ ] JSON structure matches specification

---

## Task 56: Create CustomerRetentionReport Model

### Overview
Create the CustomerRetentionReport model to analyze customer retention and repeat purchase behavior. This model tracks returning customers, calculates retention rates, identifies churned customers, and provides insights into customer loyalty patterns.

### Dependencies
- BaseReportGenerator model exists
- Customer model with purchase history
- SalesInvoice model for transaction tracking

### Instructions

1. **Create or extend model file**
   - Work in `apps/analytics/reports/models/customer_reports.py`
   - Continue after CustomerAcquisitionReport

2. **Define CustomerRetentionReport class**
   - Inherit from BaseReportGenerator
   - Add comprehensive docstring
   - Explain retention analysis purpose

3. **Add retention-specific fields**
   - `total_customers`: IntegerField for customer base count
   - `repeat_customers`: IntegerField for returning customers
   - `retention_rate`: DecimalField for percentage (0-100)
   - `churn_count`: IntegerField for lost customers
   - `churn_rate`: DecimalField for churn percentage
   - `retention_by_cohort`: JSONField for cohort analysis
   - `repeat_purchase_metrics`: JSONField for purchase data

4. **Add additional tracking fields**
   - `average_repeat_purchases`: DecimalField for frequency
   - `repeat_customer_value`: DecimalField for total value
   - `cohort_comparison`: JSONField for trend tracking
   - `churn_risk_segment`: JSONField for at-risk customers

5. **Set field properties**
   - Non-negative constraints on count fields
   - Decimal precision (max_digits=5, decimal_places=2) for rates
   - Decimal precision (max_digits=15, decimal_places=2) for values
   - Default values: 0 for counts, {} for JSON
   - Add descriptive help_text

6. **Configure Meta class**
   - `verbose_name`: "Customer Retention Report"
   - `verbose_name_plural`: "Customer Retention Reports"
   - `ordering`: ['-created_at']
   - `db_table`: 'analytics_customer_retention_report'
   - Add indexes for performance if needed

7. **Implement string representation**
   - Format: "Retention Report: {start_date} to {end_date} - {retention_rate}%"
   - Include key metric for quick reference

8. **Add report_type property**
   - Return 'customer_retention'
   - Used for report categorization

9. **Add helper properties**
   - `lost_customers`: Calculated property (total - repeat)
   - `loyalty_score`: Calculated metric (custom formula)
   - `is_healthy`: Boolean based on retention threshold

### Field Definitions

| Field Name | Type | Purpose | Example |
|------------|------|---------|---------|
| total_customers | Integer | Customer base size | 1547 |
| repeat_customers | Integer | Returning customer count | 1092 |
| retention_rate | Decimal | Retention percentage | 70.59 |
| churn_count | Integer | Lost customer count | 455 |
| churn_rate | Decimal | Churn percentage | 29.41 |
| retention_by_cohort | JSON | Cohort breakdown | {"2025-Q4": 75.2} |
| repeat_purchase_metrics | JSON | Purchase patterns | {"avg_frequency": 3.2} |
| average_repeat_purchases | Decimal | Purchase frequency | 3.24 |
| repeat_customer_value | Decimal | Total repeat value | 8573400.00 |

### Retention Metrics Formulas

| Metric | Formula | Notes |
|--------|---------|-------|
| Retention Rate | (Repeat Customers / Total Customers) × 100 | Percentage retained |
| Churn Rate | (Churned Customers / Total Customers) × 100 | Percentage lost |
| Churn Count | Total Customers - Repeat Customers | Absolute number |
| Average Frequency | Total Repeat Purchases / Repeat Customers | Purchases per customer |

### Expected Outcome
- CustomerRetentionReport model fully defined
- Proper field structure for retention tracking
- Inheritance and integration with BaseReportGenerator
- Model registered and accessible
- Migration ready

### Verification Checklist
- [ ] Model class defined in correct file
- [ ] All imports correct and complete
- [ ] Inherits from BaseReportGenerator
- [ ] All required fields defined
- [ ] Field types and constraints correct
- [ ] Meta class configured
- [ ] `__str__` method implemented
- [ ] `report_type` property returns correct value
- [ ] Helper properties defined
- [ ] Model runs migration check without errors

---

## Task 57: Implement Retention Calculation Logic

### Overview
Implement the core logic for calculating customer retention metrics, including identifying repeat customers, computing retention and churn rates, analyzing purchase frequency, and performing cohort analysis to track retention trends over time.

### Dependencies
- Task 56: CustomerRetentionReport model created
- SalesInvoice model has customer and date fields
- Customer model accessible for base count

### Instructions

1. **Override generate_report_data method**
   - Signature: `generate_report_data(self) -> dict`
   - Called by BaseReportGenerator framework
   - Return comprehensive retention metrics

2. **Extract and validate date range**
   - Get start_date and end_date from model
   - Ensure dates are timezone-aware
   - Validate logical date range

3. **Define repeat customer criteria**
   - Customer is "repeat" if they have 2+ purchases
   - Alternatively: purchased in previous period AND current period
   - Choose definition based on business requirements
   - Document chosen definition clearly

4. **Calculate customer base**
   - Query all customers who made at least one purchase in period
   - Apply tenant filtering
   - Count total unique customers
   - Store as `total_customers`

5. **Identify repeat customers**
   - For each customer in base, count their purchases in period
   - Filter those with purchase_count >= 2
   - Alternatively: check if purchased in both periods
   - Count repeat customers
   - Store as `repeat_customers`

6. **Calculate retention rate**
   - Formula: (repeat_customers / total_customers) × 100
   - Handle zero division case
   - Round to 2 decimal places
   - Store as `retention_rate`

7. **Calculate churn metrics**
   - Churn count: total_customers - repeat_customers
   - Churn rate: (churn_count / total_customers) × 100
   - Store both metrics

8. **Analyze repeat purchase patterns**
   - For repeat customers, calculate:
     - Total number of repeat purchases
     - Average purchases per customer
     - Purchase frequency distribution
     - Time between purchases
   - Store in `repeat_purchase_metrics` JSON

9. **Calculate repeat customer value**
   - Sum all invoice amounts for repeat customers
   - Calculate average order value for repeaters
   - Compare to first-time customer value
   - Store metrics

10. **Perform cohort analysis**
    - Group customers by acquisition cohort (month/quarter)
    - For each cohort, calculate retention rate in current period
    - Track how retention changes over customer lifetime
    - Store in `retention_by_cohort` JSON

11. **Compare with previous period**
    - Calculate previous period metrics
    - Compute retention rate change
    - Identify trend (improving/declining)
    - Store in `cohort_comparison`

12. **Update model fields**
    - Set all calculated numeric fields
    - Set all JSON fields with structured data
    - Call `self.save()` to persist

13. **Return comprehensive data dictionary**
    - Include all calculated metrics
    - Add metadata and timestamps
    - Ensure JSON serializable

### Calculation Flow

```
1. Define Period & Criteria
   └─> start_date, end_date
   └─> repeat customer definition

2. Build Customer Base
   └─> Query customers with purchases in period
   └─> Count total unique customers

3. Identify Repeat Customers
   └─> Count purchases per customer
   └─> Filter by repeat criteria (2+ purchases)
   └─> Count repeat customers

4. Calculate Rates
   └─> Retention rate = (repeat / total) × 100
   └─> Churn rate = 100 - retention rate

5. Analyze Patterns
   └─> Purchase frequency
   └─> Time between purchases
   └─> Value metrics

6. Cohort Analysis
   └─> Group by acquisition date
   └─> Calculate retention per cohort
   └─> Track trends

7. Store Results
   └─> Update all model fields
   └─> Save to database
```

### Return Data Structure

```
{
  "period": {
    "start": "2026-01-01",
    "end": "2026-01-31"
  },
  "customer_base": {
    "total_customers": 1547,
    "new_in_period": 247,
    "existing_before_period": 1300
  },
  "retention": {
    "repeat_customers": 1092,
    "retention_rate": 70.59,
    "one_time_customers": 455
  },
  "churn": {
    "churned_customers": 455,
    "churn_rate": 29.41
  },
  "repeat_patterns": {
    "total_repeat_purchases": 3542,
    "average_per_customer": 3.24,
    "purchase_frequency_distribution": {
      "2_purchases": 412,
      "3_purchases": 289,
      "4_purchases": 201,
      "5+_purchases": 190
    },
    "avg_days_between_purchases": 12.5
  },
  "value": {
    "repeat_customer_total": 8573400.00,
    "average_per_repeat_customer": 7850.92,
    "avg_order_value_repeaters": 2420.18
  },
  "cohort_analysis": {
    "2025-Q3": {"retention_rate": 78.5, "customers": 342},
    "2025-Q4": {"retention_rate": 75.2, "customers": 487},
    "2026-Q1": {"retention_rate": 62.8, "customers": 247}
  },
  "comparison": {
    "previous_period_retention": 68.2,
    "change": 2.39,
    "trend": "improving"
  }
}
```

### Expected Outcome
- Accurate retention rate calculation
- Proper churn identification
- Comprehensive repeat purchase analysis
- Cohort-based retention tracking
- All data stored in model fields
- Complete metrics dictionary returned

### Verification Checklist
- [ ] `generate_report_data` method implemented
- [ ] Repeat customer criteria clearly defined
- [ ] Customer base query correct and tenant-filtered
- [ ] Repeat customer identification logic accurate
- [ ] Retention rate formula correct
- [ ] Churn calculations accurate
- [ ] Purchase frequency analysis working
- [ ] Cohort grouping logic correct
- [ ] Previous period comparison implemented
- [ ] All model fields updated correctly
- [ ] Return dictionary structure matches spec
- [ ] Test with sample data yields expected results
- [ ] Edge cases handled (zero customers, etc.)

---

## Task 58: Add Churn Analysis Capabilities

### Overview
Enhance the retention report with advanced churn analysis capabilities, including churn prediction, risk segmentation, win-back opportunity identification, and detailed churn reasons analysis. This helps businesses proactively address customer attrition.

### Dependencies
- Task 57: Retention calculation logic implemented
- Customer model with activity tracking
- SalesInvoice model for purchase history

### Instructions

1. **Define churn criteria**
   - Create CHURN_PERIOD_MONTHS constant (default: 3 months)
   - Customer is "churned" if no purchase in X months
   - Make period configurable per report
   - Document churn definition clearly

2. **Add churn identification method**
   - Define `identify_churned_customers(self) -> QuerySet`
   - Query customers with last purchase > X months ago
   - Exclude customers in current period
   - Return churned customer queryset

3. **Implement churn risk scoring**
   - Define `calculate_churn_risk(self, customer) -> float`
   - Factors to consider:
     - Days since last purchase
     - Decrease in purchase frequency
     - Decrease in average order value
     - Engagement metrics (if available)
   - Return risk score 0-100

4. **Create risk segmentation**
   - Segment all customers by churn risk:
     - High Risk: 70-100 (no purchase in 2-3 months)
     - Medium Risk: 40-69 (declining activity)
     - Low Risk: 0-39 (active customers)
   - Count customers in each segment
   - Store in `churn_risk_segment` field

5. **Add churn reason analysis**
   - Track potential churn reasons:
     - Price sensitivity (decreased spending)
     - Product dissatisfaction (returns)
     - Competition (lost to competitors)
     - Service issues (complaints)
   - Analyze patterns in churned customers
   - Categorize by likely reason

6. **Implement cohort churn tracking**
   - For each acquisition cohort, calculate:
     - Churn rate over time
     - Time to churn (average months)
     - Churn curve visualization data
   - Track which cohorts have highest churn

7. **Add win-back opportunity identification**
   - Identify high-value churned customers
   - Criteria: previous CLV above threshold
   - Calculate potential recovery value
   - Prioritize win-back targets

8. **Create churn trend analysis**
   - Track churn rate changes over time
   - Compare current churn to historical average
   - Identify seasonal patterns
   - Detect anomalies (sudden churn spikes)

9. **Implement early warning system**
   - Identify customers showing pre-churn signals:
     - Decreased purchase frequency
     - Longer time between purchases
     - Reduced order values
     - No recent engagement
   - Flag for retention campaigns

10. **Add retention campaign targeting**
    - Generate customer segments for campaigns:
      - High risk, high value (immediate action)
      - Medium risk (nurture campaigns)
      - Win-back targets (re-engagement)
    - Export customer lists for marketing

11. **Enhance report data output**
    - Add `churn_analysis` section
    - Include risk segmentation data
    - Add churn reason breakdown
    - Include win-back opportunities
    - Add early warning alerts

### Churn Analysis Structure

```
Churn Analysis:
├── Identification
│   ├── Churned customers: 455
│   ├── Churn rate: 29.41%
│   └── Average time to churn: 4.7 months
│
├── Risk Segmentation
│   ├── High Risk: 127 customers
│   ├── Medium Risk: 284 customers
│   └── Low Risk: 1136 customers
│
├── Churn Reasons
│   ├── Price sensitivity: 35%
│   ├── Product issues: 22%
│   ├── Competition: 28%
│   └── Unknown: 15%
│
└── Win-Back Opportunities
    ├── High-value churned: 87 customers
    ├── Potential recovery value: $523,400
    └── Recommended actions: targeted offers
```

### Churn Risk Scoring Algorithm

```
Risk Score = weighted sum of:
  - Days since last purchase (40%)
    - 0-30 days: 0 points
    - 31-60 days: 25 points
    - 61-90 days: 50 points
    - 90+ days: 100 points
  
  - Purchase frequency trend (30%)
    - Increasing: 0 points
    - Stable: 15 points
    - Decreasing: 60 points
    - Stopped: 100 points
  
  - Order value trend (20%)
    - Increasing: 0 points
    - Stable: 10 points
    - Decreasing: 40 points
  
  - Engagement (10%)
    - Active: 0 points
    - Moderate: 20 points
    - Low: 50 points

Total Score: 0-100
```

### Enhanced Return Data Structure

```
{
  "retention": { ... },
  "churn_analysis": {
    "churned_customers": 455,
    "churn_rate": 29.41,
    "avg_time_to_churn_months": 4.7,
    "churn_by_cohort": {
      "2025-Q3": {"count": 117, "rate": 34.2},
      "2025-Q4": {"count": 153, "rate": 31.4}
    }
  },
  "risk_segmentation": {
    "high_risk": {
      "count": 127,
      "percentage": 8.2,
      "avg_risk_score": 82.5,
      "estimated_value_at_risk": 897500.00
    },
    "medium_risk": {
      "count": 284,
      "percentage": 18.4,
      "avg_risk_score": 55.2
    },
    "low_risk": {
      "count": 1136,
      "percentage": 73.4,
      "avg_risk_score": 15.8
    }
  },
  "churn_reasons": {
    "price_sensitivity": {"count": 159, "percentage": 34.9},
    "product_issues": {"count": 100, "percentage": 22.0},
    "competition": {"count": 127, "percentage": 27.9},
    "unknown": {"count": 69, "percentage": 15.2}
  },
  "win_back_opportunities": {
    "high_value_churned": 87,
    "potential_recovery_value": 523400.00,
    "avg_previous_clv": 6018.39,
    "recommended_campaigns": [
      "win_back_offer_20_percent",
      "personalized_product_recommendations"
    ]
  },
  "early_warning": {
    "customers_at_risk": 127,
    "immediate_action_needed": 43,
    "alerts": [
      "High-value customer #1234 showing churn signals",
      "Churn rate increased 5% from last month"
    ]
  }
}
```

### Expected Outcome
- Comprehensive churn identification system
- Risk scoring algorithm implemented
- Customer segmentation by churn risk
- Churn reason analysis capabilities
- Win-back opportunity identification
- Early warning system for at-risk customers
- Enhanced report with actionable insights

### Verification Checklist
- [ ] Churn period constant defined and configurable
- [ ] Churned customer identification query works
- [ ] Churn risk scoring algorithm implemented
- [ ] Risk scoring factors weighted correctly
- [ ] Customer segmentation by risk functional
- [ ] Churn reason categorization logic working
- [ ] Cohort churn tracking accurate
- [ ] Win-back opportunity identification correct
- [ ] High-value churned customer filtering works
- [ ] Early warning signals detected properly
- [ ] Report data includes all churn analysis sections
- [ ] Test with edge cases (new customers, all churned, etc.)
- [ ] Performance acceptable with large customer base

---

## Task 59: Create CustomerLifetimeValueReport Model

### Overview
Create the CustomerLifetimeValueReport model to calculate and analyze customer lifetime value (CLV). This model provides insights into customer value distribution, segmentation by value tiers, and predictions for future customer worth, enabling strategic customer management decisions.

### Dependencies
- BaseReportGenerator model exists
- Customer and SalesInvoice models available
- Retention and acquisition reports for context

### Instructions

1. **Define model in customer_reports.py**
   - Add CustomerLifetimeValueReport class
   - Inherit from BaseReportGenerator
   - Add comprehensive docstring

2. **Add CLV calculation fields**
   - `total_customers_analyzed`: IntegerField for sample size
   - `average_customer_lifetime_value`: DecimalField for mean CLV
   - `median_customer_lifetime_value`: DecimalField for median
   - `total_customer_value`: DecimalField for aggregate value
   - `clv_distribution`: JSONField for value distribution

3. **Add segmentation fields**
   - `high_value_customers`: IntegerField for count
   - `high_value_threshold`: DecimalField (>500,000 LKR)
   - `medium_value_customers`: IntegerField
   - `medium_value_range`: JSONField (100,000-500,000 LKR)
   - `low_value_customers`: IntegerField
   - `low_value_threshold`: DecimalField (<100,000 LKR)

4. **Add CLV component fields**
   - `average_order_value`: DecimalField (AOV)
   - `average_purchase_frequency`: DecimalField (orders per customer)
   - `average_customer_lifespan_months`: DecimalField
   - `clv_by_segment`: JSONField for segment breakdown

5. **Add predictive fields**
   - `predicted_clv`: JSONField with predictions
   - `clv_growth_trend`: DecimalField for trend direction
   - `top_customers`: JSONField for highest value customers

6. **Set field properties**
   - Large decimal precision for currency (max_digits=15, decimal_places=2)
   - Non-negative constraints on counts
   - Appropriate defaults (0, {}, [])
   - Descriptive help_text

7. **Configure Meta class**
   - `verbose_name`: "Customer Lifetime Value Report"
   - `verbose_name_plural`: "Customer Lifetime Value Reports"
   - `ordering`: ['-created_at']
   - `db_table`: 'analytics_customer_lifetime_value_report'

8. **Implement string representation**
   - Format: "CLV Report: {start_date} to {end_date} - Avg CLV: {average}"
   - Include key metric for quick insight

9. **Add report_type property**
   - Return 'customer_lifetime_value'
   - Used for filtering and categorization

10. **Add helper properties**
    - `high_value_percentage`: Calculated property
    - `value_concentration`: Top 20% customer value percentage
    - `clv_health_score`: Overall CLV health indicator

### Field Definitions

| Field Name | Type | Purpose | Example |
|------------|------|---------|---------|
| total_customers_analyzed | Integer | Sample size | 1547 |
| average_customer_lifetime_value | Decimal | Mean CLV | 247850.00 |
| median_customer_lifetime_value | Decimal | Median CLV | 156200.00 |
| total_customer_value | Decimal | Sum of all CLV | 383341950.00 |
| clv_distribution | JSON | Value distribution | {"0-100k": 892} |
| high_value_customers | Integer | >500k LKR count | 127 |
| medium_value_customers | Integer | 100k-500k count | 528 |
| low_value_customers | Integer | <100k count | 892 |
| average_order_value | Decimal | AOV | 4580.50 |
| average_purchase_frequency | Decimal | Orders per customer | 3.7 |
| average_customer_lifespan_months | Decimal | Average lifespan | 18.5 |

### CLV Segmentation Thresholds

| Segment | Threshold (LKR) | Characteristics |
|---------|-----------------|-----------------|
| High Value | > 500,000 | Top tier customers, VIP treatment |
| Medium Value | 100,000 - 500,000 | Regular customers, growth potential |
| Low Value | < 100,000 | Entry level, nurture opportunities |

### Expected Outcome
- CustomerLifetimeValueReport model fully defined
- Comprehensive fields for CLV tracking
- Segmentation structure in place
- Integration with BaseReportGenerator
- Model ready for migration

### Verification Checklist
- [ ] Model class defined correctly
- [ ] All imports present
- [ ] Inherits from BaseReportGenerator
- [ ] All CLV-specific fields defined
- [ ] Segmentation fields included
- [ ] Field types and constraints correct
- [ ] Decimal precision appropriate for currency
- [ ] Meta class configured
- [ ] `__str__` method implemented
- [ ] `report_type` property returns correct value
- [ ] Helper properties defined
- [ ] Migration check passes

---

## Task 60: Implement CLV Calculation Logic

### Overview
Implement the core customer lifetime value calculation logic using proven CLV formulas. Calculate average order value, purchase frequency, customer lifespan, and compute CLV using both historical and predictive methods. Aggregate data for distribution analysis and segment customers by value.

### Dependencies
- Task 59: CustomerLifetimeValueReport model created
- SalesInvoice model with customer relationships
- Customer model with registration dates

### Instructions

1. **Override generate_report_data method**
   - Signature: `generate_report_data(self) -> dict`
   - Return comprehensive CLV metrics
   - Called by report generation framework

2. **Extract date range and parameters**
   - Get start_date and end_date
   - Define analysis period for historical data
   - Set lifespan calculation parameters

3. **Query customer base**
   - Get all customers with at least one purchase
   - Apply tenant filtering
   - Count total customers for analysis
   - Store in `total_customers_analyzed`

4. **Calculate Average Order Value (AOV)**
   - Sum all invoice totals in period
   - Count total number of invoices
   - Formula: Total Revenue / Total Orders
   - Store in `average_order_value`

5. **Calculate Purchase Frequency**
   - For each customer, count their orders
   - Calculate average orders per customer
   - Formula: Total Orders / Total Customers
   - Store in `average_purchase_frequency`

6. **Calculate Customer Lifespan**
   - Method 1: Days from first to last purchase
   - Method 2: Average active period across all customers
   - Convert to months
   - Handle edge cases (single purchase customers)
   - Store in `average_customer_lifespan_months`

7. **Calculate CLV for each customer**
   - Formula: CLV = AOV × Purchase Frequency × Lifespan
   - Alternative: CLV = Sum of all customer purchases (historical)
   - Calculate both historical and predictive CLV
   - Store in array for distribution analysis

8. **Calculate aggregate CLV metrics**
   - Total CLV: Sum of all customer CLVs
   - Average CLV: Mean across all customers
   - Median CLV: 50th percentile value
   - Store in respective fields

9. **Create CLV distribution**
   - Bucket customers by CLV ranges:
     - 0-50k, 50k-100k, 100k-250k, 250k-500k, 500k-1M, >1M
   - Count customers in each bucket
   - Calculate percentages
   - Store in `clv_distribution` JSON

10. **Segment customers by value tiers**
    - High Value: CLV > 500,000 LKR
    - Medium Value: 100,000 ≤ CLV ≤ 500,000
    - Low Value: CLV < 100,000
    - Count customers in each segment
    - Store in segment count fields

11. **Calculate segment statistics**
    - For each segment:
      - Average CLV
      - Total value contribution
      - Percentage of total value
      - Average purchase frequency
      - Average order value
    - Store in `clv_by_segment` JSON

12. **Identify top customers**
    - Sort customers by CLV descending
    - Get top 10-20 customers
    - Extract customer ID, name, CLV
    - Store in `top_customers` JSON

13. **Calculate CLV trends**
    - Compare current period to previous
    - Calculate growth rate
    - Identify improving/declining trend
    - Store in `clv_growth_trend`

14. **Generate predictive CLV**
    - For active customers, predict future value
    - Use historical patterns
    - Apply retention rate adjustments
    - Store predictions in `predicted_clv`

15. **Update all model fields**
    - Set calculated numeric fields
    - Set JSON fields with structured data
    - Call `self.save()`

16. **Return comprehensive data dictionary**
    - Include all calculations
    - Add metadata
    - Ensure JSON serializable

### CLV Calculation Flow

```
1. Data Collection
   └─> Query customers & invoices
   └─> Apply date filters

2. Component Calculations
   ├─> AOV = Total Revenue / Order Count
   ├─> Frequency = Orders / Customers
   └─> Lifespan = Avg months active

3. CLV Calculation (per customer)
   └─> CLV = AOV × Frequency × Lifespan
   └─> Alternative: Historical sum

4. Aggregation
   ├─> Average CLV
   ├─> Median CLV
   ├─> Total CLV
   └─> Distribution

5. Segmentation
   ├─> High Value (>500k)
   ├─> Medium Value (100k-500k)
   └─> Low Value (<100k)

6. Analysis
   ├─> Top customers
   ├─> Trends
   └─> Predictions

7. Save Results
```

### CLV Formula Details

**Standard Formula:**
```
CLV = Average Order Value × Purchase Frequency × Customer Lifespan
```

**Component Definitions:**
- **AOV:** Total revenue / Total number of orders
- **Purchase Frequency:** Total orders / Total unique customers
- **Customer Lifespan:** Average months from first to last purchase

**Example Calculation:**
```
AOV = 4,580.50 LKR
Purchase Frequency = 3.7 orders per customer
Lifespan = 18.5 months

CLV = 4,580.50 × 3.7 × 18.5
CLV = 313,581.23 LKR per customer
```

### Return Data Structure

```
{
  "period": {
    "start": "2026-01-01",
    "end": "2026-01-31"
  },
  "customer_base": {
    "total_analyzed": 1547,
    "with_purchases": 1547,
    "active_customers": 1092
  },
  "clv_components": {
    "average_order_value": 4580.50,
    "purchase_frequency": 3.7,
    "customer_lifespan_months": 18.5
  },
  "clv_metrics": {
    "average_clv": 313581.23,
    "median_clv": 156200.00,
    "total_customer_value": 485042523.81,
    "min_clv": 450.00,
    "max_clv": 2873500.00
  },
  "distribution": {
    "0-50k": {"count": 412, "percentage": 26.6},
    "50k-100k": {"count": 480, "percentage": 31.0},
    "100k-250k": {"count": 358, "percentage": 23.1},
    "250k-500k": {"count": 170, "percentage": 11.0},
    "500k-1M": {"count": 97, "percentage": 6.3},
    ">1M": {"count": 30, "percentage": 1.9}
  },
  "segmentation": {
    "high_value": {
      "count": 127,
      "percentage": 8.2,
      "avg_clv": 752300.00,
      "total_value": 95542100.00,
      "value_contribution_pct": 19.7
    },
    "medium_value": {
      "count": 528,
      "percentage": 34.1,
      "avg_clv": 287450.00,
      "total_value": 151773600.00,
      "value_contribution_pct": 31.3
    },
    "low_value": {
      "count": 892,
      "percentage": 57.7,
      "avg_clv": 54200.00,
      "total_value": 48346400.00,
      "value_contribution_pct": 10.0
    }
  },
  "top_customers": [
    {
      "customer_id": "CUST001234",
      "name": "ABC Corporation",
      "clv": 2873500.00,
      "orders": 127,
      "avg_order": 22634.65
    }
  ],
  "trends": {
    "clv_growth_rate": 12.5,
    "trend_direction": "increasing",
    "previous_period_avg_clv": 278500.00
  },
  "predictions": {
    "predicted_avg_clv_next_period": 351200.00,
    "confidence": "medium",
    "methodology": "historical_trend_extrapolation"
  }
}
```

### Expected Outcome
- Accurate CLV calculation for all customers
- Proper component metric calculations (AOV, frequency, lifespan)
- Correct customer segmentation by value tiers
- Comprehensive distribution analysis
- Top customer identification
- All metrics stored in model fields
- Complete data dictionary returned

### Verification Checklist
- [ ] `generate_report_data` method implemented
- [ ] Customer query correct and tenant-filtered
- [ ] AOV calculation accurate
- [ ] Purchase frequency formula correct
- [ ] Customer lifespan calculation logical
- [ ] CLV formula implemented correctly
- [ ] Historical and predictive methods available
- [ ] Distribution buckets correct
- [ ] Segmentation thresholds applied correctly
- [ ] Top customers sorted properly
- [ ] Trend calculations accurate
- [ ] All model fields updated
- [ ] Return dictionary complete and structured
- [ ] Test with sample data validates correctly
- [ ] Edge cases handled (single purchase, new customers)

---

## Task 61: Add Customer Segmentation by CLV

### Overview
Enhance the CLV report with advanced segmentation capabilities beyond simple value tiers. Implement RFM (Recency, Frequency, Monetary) segmentation, cohort-based CLV analysis, predictive segment modeling, and actionable customer segment profiles for targeted marketing and retention strategies.

### Dependencies
- Task 60: CLV calculation logic implemented
- Customer model with transaction history
- Retention metrics available

### Instructions

1. **Implement RFM segmentation**
   - Calculate Recency score (days since last purchase)
   - Calculate Frequency score (number of purchases)
   - Calculate Monetary score (total spend)
   - Combine into RFM segments

2. **Define RFM scoring methodology**
   - Divide customers into quintiles for each metric
   - Recency: 5 (most recent) to 1 (least recent)
   - Frequency: 5 (most frequent) to 1 (least frequent)
   - Monetary: 5 (highest spend) to 1 (lowest spend)
   - Create RFM score (e.g., "555" = best customers)

3. **Create segment profiles**
   - Define standard segments:
     - Champions (555, 554, 544)
     - Loyal Customers (543, 533, 532)
     - Potential Loyalists (553, 551, 552)
     - New Customers (512, 511, 412)
     - Promising (525, 524, 523)
     - Need Attention (535, 534, 443)
     - About to Sleep (331, 321, 312)
     - At Risk (255, 254, 245)
     - Can't Lose Them (155, 154, 144)
     - Hibernating (332, 322, 231)
     - Lost (111, 112, 121)

4. **Calculate segment characteristics**
   - For each segment:
     - Customer count
     - Average CLV
     - Total value contribution
     - Average recency, frequency, monetary values
     - Recommended actions

5. **Implement cohort-based segmentation**
   - Group customers by acquisition cohort
   - Calculate average CLV per cohort
   - Track how CLV evolves over customer lifetime
   - Identify best-performing cohorts

6. **Add behavioral segmentation**
   - Product preference segments
   - Purchase channel preference
   - Seasonality patterns
   - Price sensitivity levels
   - Cross-sell/up-sell potential

7. **Create value migration analysis**
   - Track customers moving between segments
   - Identify upward migration (increasing value)
   - Identify downward migration (declining value)
   - Calculate migration rates

8. **Implement predictive segmentation**
   - Predict future segment for current customers
   - Use historical patterns
   - Consider retention probability
   - Adjust CLV predictions by segment

9. **Add segment action recommendations**
   - For each segment, define:
     - Primary goal (retain, grow, win-back, etc.)
     - Recommended marketing approach
     - Optimal communication frequency
     - Suggested offers/incentives
     - Priority level

10. **Create segment comparison metrics**
    - Compare segments across dimensions:
      - CLV contribution
      - Growth potential
      - Retention risk
      - Marketing efficiency
    - Rank segments by strategic importance

11. **Implement custom segment builder**
    - Allow defining custom segments
    - Support multiple criteria (CLV + behavior + demographics)
    - Save segment definitions for reuse
    - Export customer lists per segment

12. **Enhance report data output**
    - Add `rfm_segmentation` section
    - Include `segment_profiles` with details
    - Add `cohort_analysis` data
    - Include `segment_recommendations`
    - Add `value_migration` tracking

### RFM Segmentation Structure

```
RFM Analysis:
├── Scoring Methodology
│   ├── Recency: 1-5 (days since last purchase)
│   ├── Frequency: 1-5 (number of purchases)
│   └── Monetary: 1-5 (total spend)
│
├── Segments
│   ├── Champions (RFM: 555, 554, 544)
│   │   ├── Count: 142 customers
│   │   ├── Avg CLV: 875,400 LKR
│   │   └── Action: VIP treatment, exclusives
│   │
│   ├── Loyal Customers (543, 533, 532)
│   │   ├── Count: 287 customers
│   │   ├── Avg CLV: 523,100 LKR
│   │   └── Action: Loyalty rewards, referrals
│   │
│   └── At Risk (255, 254, 245)
│       ├── Count: 93 customers
│       ├── Avg CLV: 412,700 LKR
│       └── Action: Win-back campaigns, surveys
```

### Segment Profile Example

```
{
  "segment_name": "Champions",
  "rfm_codes": ["555", "554", "544"],
  "characteristics": {
    "count": 142,
    "percentage": 9.2,
    "avg_clv": 875400.00,
    "total_value": 124306800.00,
    "value_contribution_pct": 25.6,
    "avg_recency_days": 5.2,
    "avg_frequency": 15.7,
    "avg_monetary": 13745.22
  },
  "behavior": {
    "repeat_rate": 98.5,
    "avg_order_value": 8945.50,
    "preferred_channel": "online",
    "engagement_level": "very_high"
  },
  "recommendations": {
    "goal": "retain_and_delight",
    "strategies": [
      "Exclusive VIP offers",
      "Early access to new products",
      "Personalized recommendations",
      "Premium customer service"
    ],
    "communication_frequency": "weekly",
    "priority": "critical"
  }
}
```

### Enhanced Return Data Structure

```
{
  "clv_metrics": { ... },
  "rfm_segmentation": {
    "methodology": "quintile_based",
    "total_customers": 1547,
    "segments": {
      "champions": {
        "rfm_codes": ["555", "554", "544"],
        "count": 142,
        "percentage": 9.2,
        "avg_clv": 875400.00,
        "value_contribution": 25.6,
        "characteristics": { ... },
        "recommendations": { ... }
      },
      "loyal_customers": { ... },
      "at_risk": { ... }
      // ... other segments
    }
  },
  "cohort_clv_analysis": {
    "2024-Q1": {
      "customer_count": 287,
      "avg_clv": 389200.00,
      "months_active": 24,
      "clv_trajectory": "stable"
    },
    "2025-Q1": {
      "customer_count": 342,
      "avg_clv": 267500.00,
      "months_active": 12,
      "clv_trajectory": "growing"
    }
  },
  "behavioral_segments": {
    "high_frequency_buyers": {
      "count": 234,
      "avg_frequency": 12.5,
      "avg_clv": 582300.00
    },
    "seasonal_buyers": {
      "count": 187,
      "peak_months": ["Nov", "Dec"],
      "avg_clv": 234500.00
    }
  },
  "value_migration": {
    "upward_migration": {
      "count": 87,
      "from_segment": "medium_value",
      "to_segment": "high_value",
      "avg_clv_increase": 287400.00
    },
    "downward_migration": {
      "count": 43,
      "from_segment": "high_value",
      "to_segment": "medium_value",
      "avg_clv_decrease": 189200.00
    }
  },
  "segment_recommendations": {
    "immediate_action": [
      "Champions: Launch exclusive product line",
      "At Risk: Urgent win-back campaign"
    ],
    "monthly_focus": [
      "Loyal Customers: Referral program",
      "Potential Loyalists: Engagement campaigns"
    ]
  }
}
```

### Expected Outcome
- Comprehensive RFM segmentation implemented
- Customer segment profiles created with characteristics
- Cohort-based CLV analysis functional
- Behavioral segmentation capabilities added
- Value migration tracking operational
- Actionable recommendations per segment
- Enhanced report with detailed segmentation data

### Verification Checklist
- [ ] RFM scoring algorithm implemented correctly
- [ ] Quintile calculation logic accurate
- [ ] Segment definitions match standard profiles
- [ ] Segment characteristics calculated properly
- [ ] Cohort grouping and analysis working
- [ ] Behavioral patterns identified correctly
- [ ] Value migration tracking functional
- [ ] Recommendations relevant and actionable
- [ ] Custom segment builder operational
- [ ] Report data includes all segmentation sections
- [ ] Test with diverse customer data
- [ ] Segment distribution reasonable
- [ ] Performance acceptable with large datasets

---

## Task 62: Create Customer Reports API Endpoint

### Overview
Create RESTful API endpoints to generate and retrieve customer analytics reports (acquisition, retention, CLV). Implement request validation, parameter handling, async report generation, result caching, and proper response formatting. Enable frontend integration and external system access to customer insights.

### Dependencies
- Tasks 53-61: All customer report models and logic complete
- DRF (Django Rest Framework) configured
- BaseReportGenerator API patterns established
- Authentication and permissions configured

### Instructions

1. **Create serializers file**
   - Navigate to `apps/analytics/api/serializers/`
   - Create or open `customer_report_serializers.py`
   - Import necessary modules

2. **Define CustomerAcquisitionReportSerializer**
   - Inherit from ModelSerializer or base report serializer
   - Include all model fields
   - Add computed fields: growth_rate, channel_performance
   - Implement validation for date ranges

3. **Define CustomerRetentionReportSerializer**
   - Include retention-specific fields
   - Add churn analysis data
   - Include risk segmentation output
   - Validate retention period parameters

4. **Define CustomerLifetimeValueReportSerializer**
   - Include CLV metrics and components
   - Add segmentation data
   - Include RFM analysis results
   - Validate CLV calculation parameters

5. **Create report generation request serializer**
   - Define CustomerReportRequestSerializer
   - Fields: report_type, start_date, end_date, parameters
   - Validate date ranges (start before end)
   - Validate report type choices
   - Validate optional parameters (churn_period, etc.)

6. **Create viewset for customer reports**
   - Navigate to `apps/analytics/api/views/`
   - Create `CustomerReportViewSet`
   - Inherit from appropriate base viewset

7. **Implement generate action**
   - Endpoint: POST `/api/analytics/customer-reports/generate/`
   - Accept report parameters in request body
   - Validate input using request serializer
   - Determine report type (acquisition, retention, CLV)

8. **Add report instance creation logic**
   - Based on report_type, create appropriate model instance
   - Set date range from request
   - Set additional parameters
   - Don't generate immediately (async or task queue)

9. **Implement async report generation**
   - Option 1: Use Celery task
   - Option 2: Use Django async views
   - Call `report.generate()` method
   - Handle errors and timeouts
   - Store generation status

10. **Add list action**
    - Endpoint: GET `/api/analytics/customer-reports/`
    - List all customer reports
    - Support filtering by report_type, date range, status
    - Support pagination
    - Return serialized report list

11. **Add retrieve action**
    - Endpoint: GET `/api/analytics/customer-reports/{id}/`
    - Retrieve single report by ID
    - Include full report data
    - Return serialized report with results

12. **Add report type filter action**
    - Custom action: GET `/api/analytics/customer-reports/acquisition/`
    - Filter by specific report type
    - Apply additional filters (date, tenant)
    - Return filtered list

13. **Implement caching for report results**
    - Cache generated report data
    - Use cache key based on report parameters
    - Set appropriate TTL (time to live)
    - Return cached data if available and fresh

14. **Add report export functionality**
    - Action: GET `/api/analytics/customer-reports/{id}/export/`
    - Support formats: JSON, CSV, PDF
    - Generate formatted export file
    - Return file download response

15. **Implement permissions**
    - Require authentication for all endpoints
    - Check user has analytics view permission
    - Ensure tenant isolation
    - Limit report generation rate per user

16. **Add error handling**
    - Handle invalid date ranges
    - Handle insufficient data scenarios
    - Handle calculation errors gracefully
    - Return appropriate HTTP status codes
    - Provide clear error messages

17. **Create URL routing**
    - Register viewset in router
    - Configure URL patterns
    - Enable custom actions
    - Document endpoints

18. **Add API documentation**
    - Use drf-spectacular or similar
    - Document request/response schemas
    - Add example requests
    - Describe parameters and filters

### API Endpoint Structure

```
Customer Reports Endpoints:

POST   /api/analytics/customer-reports/generate/
       Generate new customer report (acquisition/retention/CLV)

GET    /api/analytics/customer-reports/
       List all customer reports with filters

GET    /api/analytics/customer-reports/{id}/
       Retrieve specific report with full data

GET    /api/analytics/customer-reports/acquisition/
       List acquisition reports only

GET    /api/analytics/customer-reports/retention/
       List retention reports only

GET    /api/analytics/customer-reports/clv/
       List CLV reports only

GET    /api/analytics/customer-reports/{id}/export/
       Export report in specified format

DELETE /api/analytics/customer-reports/{id}/
       Delete report (if permissions allow)
```

### Request/Response Examples

**Generate Acquisition Report:**
```
POST /api/analytics/customer-reports/generate/

Request:
{
  "report_type": "acquisition",
  "start_date": "2026-01-01",
  "end_date": "2026-01-31",
  "parameters": {
    "include_channel_analysis": true,
    "compare_to_previous_period": true
  }
}

Response (202 Accepted):
{
  "id": "RPT-ACQ-20260201-001",
  "report_type": "acquisition",
  "status": "generating",
  "created_at": "2026-02-01T10:30:00Z",
  "estimated_completion": "2026-02-01T10:31:00Z",
  "message": "Report generation started"
}
```

**Retrieve Report:**
```
GET /api/analytics/customer-reports/RPT-ACQ-20260201-001/

Response (200 OK):
{
  "id": "RPT-ACQ-20260201-001",
  "report_type": "acquisition",
  "status": "completed",
  "generated_at": "2026-02-01T10:30:45Z",
  "date_range": {
    "start": "2026-01-01",
    "end": "2026-01-31"
  },
  "data": {
    "acquisition": {
      "total_new_customers": 247,
      "by_channel": { ... }
    },
    "first_purchase": { ... },
    "comparison": { ... }
  },
  "charts": [
    {
      "type": "line",
      "title": "Acquisition Trend",
      "data": { ... }
    }
  ]
}
```

**List Reports:**
```
GET /api/analytics/customer-reports/?report_type=retention&start_date=2026-01-01

Response (200 OK):
{
  "count": 12,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": "RPT-RET-20260201-003",
      "report_type": "retention",
      "status": "completed",
      "date_range": { ... },
      "summary": {
        "retention_rate": 70.59,
        "churn_rate": 29.41
      },
      "generated_at": "2026-02-01T11:15:00Z"
    }
  ]
}
```

### Expected Outcome
- Complete API endpoints for customer reports
- Request validation and error handling
- Async report generation working
- Report retrieval with full data
- Filtering and pagination functional
- Export capabilities available
- Proper authentication and permissions
- Comprehensive API documentation
- Frontend-ready API responses

### Verification Checklist
- [ ] All serializers defined correctly
- [ ] Request validation working
- [ ] Viewset created with proper inheritance
- [ ] Generate action creates report instance
- [ ] Async generation working (Celery or async)
- [ ] List action returns filtered results
- [ ] Retrieve action returns complete report data
- [ ] Report type filtering works
- [ ] Caching implemented and functional
- [ ] Export functionality working (JSON, CSV)
- [ ] Permissions checked correctly
- [ ] Tenant isolation maintained
- [ ] Error handling comprehensive
- [ ] URL routing configured
- [ ] API documentation generated
- [ ] Test all endpoints with Postman/curl
- [ ] Response times acceptable
- [ ] Frontend integration tested

---

## Implementation Notes

### Data Optimization Strategies

1. **Query Optimization**
   - Use `select_related` and `prefetch_related` for customer/invoice queries
   - Apply database indexes on frequently queried fields (customer_id, created_at)
   - Use aggregation at database level when possible
   - Consider materialized views for complex calculations

2. **Caching Strategy**
   - Cache report results with appropriate TTL
   - Cache intermediate calculations (AOV, frequency)
   - Invalidate cache when source data changes
   - Use Redis for distributed caching

3. **Async Processing**
   - Generate reports asynchronously for large datasets
   - Use Celery for background task processing
   - Implement progress tracking for long-running reports
   - Set reasonable timeouts

### Testing Considerations

1. **Unit Tests**
   - Test each calculation method independently
   - Test edge cases (zero customers, single purchase, etc.)
   - Test segmentation logic with boundary values
   - Verify formulas with known test data

2. **Integration Tests**
   - Test report generation end-to-end
   - Test API endpoints with various parameters
   - Test multi-tenant data isolation
   - Test concurrent report generation

3. **Performance Tests**
   - Test with large customer datasets (10k, 100k, 1M)
   - Measure report generation time
   - Test cache effectiveness
   - Monitor database query counts

### Security Considerations

1. **Data Access Control**
   - Ensure tenant isolation in all queries
   - Verify user permissions before report access
   - Log report generation for audit trail
   - Anonymize sensitive customer data if needed

2. **Input Validation**
   - Validate all date ranges
   - Sanitize user inputs
   - Prevent SQL injection via parameterized queries
   - Limit report generation rate per user

### Business Logic Rules

1. **Churn Definition**
   - Default: No purchase in 3 months
   - Configurable per business type
   - Consider product lifecycle (longer for big-ticket items)

2. **CLV Calculation**
   - Use historical method for existing customers
   - Use predictive method for new customers
   - Adjust for industry norms
   - Factor in retention probability

3. **Segmentation Thresholds**
   - High Value: >500,000 LKR (adjust for business)
   - Medium Value: 100,000-500,000 LKR
   - Low Value: <100,000 LKR
   - Review and adjust quarterly

---

## Notes for AI Agents

### Context Understanding
- These reports provide critical customer insights for strategic decision-making
- Customer analytics drive marketing, sales, and retention strategies
- Reports must be accurate, timely, and actionable
- Data quality directly impacts business outcomes

### Key Relationships
- CustomerAcquisitionReport focuses on new customer growth and channels
- CustomerRetentionReport measures loyalty and identifies churn risk
- CustomerLifetimeValueReport quantifies long-term customer worth
- All three reports interconnect for holistic customer understanding

### Common Pitfalls to Avoid
1. **Calculation Errors**
   - Double-check formulas against business definitions
   - Handle division by zero cases
   - Ensure consistent date/time handling

2. **Performance Issues**
   - Don't load all customers into memory
   - Use database aggregation functions
   - Implement pagination for large result sets

3. **Data Quality**
   - Validate input data (null checks, outliers)
   - Handle missing purchase data gracefully
   - Document assumptions clearly

4. **Tenant Isolation**
   - Always apply tenant filters
   - Test with multiple tenants
   - Verify data segregation

### Implementation Order
1. Start with models and basic fields
2. Implement calculation logic with simple formulas
3. Add advanced features (segmentation, trends)
4. Create API endpoints
5. Test thoroughly with realistic data
6. Optimize performance
7. Document for users

### Testing Strategy
- Create fixtures with known outcomes
- Test boundary conditions extensively
- Validate against manual calculations
- Use sample data from real business scenarios
- Test with empty datasets and full datasets

### Future Enhancements
- Machine learning for churn prediction
- Real-time customer value scoring
- Automated segment recommendations
- Predictive CLV with advanced models
- Customer journey mapping integration
- A/B testing framework for retention strategies

---

**Document Status:** Complete  
**Total Tasks:** 10 (Tasks 53-62)  
**Estimated Total Time:** 6 hours 40 minutes  
**Complexity:** High - Advanced analytics calculations and segmentation

**Related Documents:**
- Previous: Group-C Inventory & Purchase Reports
- Next: Group-D Staff Performance Reports (Tasks 63-70)
- Reference: Phase-03 Customer Model Implementation
- Reference: Phase-04 Sales Invoice Module
