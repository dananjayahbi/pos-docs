# Tasks 53-62: Churn Features and Classification Model

> **Phase:** 10 - AI Features & Advanced Capabilities  
> **SubPhase:** 12 - Customer Insights AI (FINAL SUBPHASE)  
> **Group:** D - Churn Prediction  
> **Document:** 01 of 02  
> **Tasks Covered:** 53, 54, 55, 56, 57, 58, 59, 60, 61, 62

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-63-68_Risk-API.md](02_Tasks-63-68_Risk-API.md)

---

## Document Overview

This document defines the implementation of churn prediction features and the classification model that identifies customers at risk of leaving. The system analyzes behavioral signals, purchase patterns, and engagement metrics to calculate churn probability scores.

### What This Document Covers

| Component | Description |
|-----------|-------------|
| ChurnPredictor Class | Core prediction service with probability output |
| Feature Engineering | 10+ behavioral and transactional features |
| Inactivity Detection | Days since last purchase calculation |
| Frequency Analysis | Purchase frequency decline measurement |
| Value Analysis | Average order value drop detection |
| Engagement Scoring | Multi-channel engagement metrics |
| Support Analysis | Customer support interaction patterns |
| Classification Model | Random Forest classifier configuration |
| Training Pipeline | Model training and retraining workflow |
| Probability Output | Churn risk percentage calculation |

### Churn Prediction Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        CHURN PREDICTION PIPELINE                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────────┐    ┌──────────────────┐    ┌───────────────────────────┐  │
│  │   Customer   │───▶│ Feature Engineer │───▶│   Random Forest Model     │  │
│  │     Data     │    │    (10+ features)│    │   (Classification)        │  │
│  └──────────────┘    └──────────────────┘    └───────────────────────────┘  │
│         │                     │                          │                   │
│         │                     ▼                          ▼                   │
│         │           ┌──────────────────┐      ┌───────────────────────────┐ │
│         │           │ Feature Vector   │      │   Churn Probability       │ │
│         │           │ • Inactivity     │      │   (0-100%)                │ │
│         │           │ • Freq Drop      │      └───────────────────────────┘ │
│         │           │ • AOV Drop       │                 │                   │
│         │           │ • Engagement     │                 ▼                   │
│         │           │ • Support        │      ┌───────────────────────────┐ │
│         │           └──────────────────┘      │   ChurnResult             │ │
│         │                                     │   • probability           │ │
│         └────────────────────────────────────▶│   • risk_level            │ │
│                                               │   • top_factors           │ │
│                                               └───────────────────────────┘ │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Task 53: Create ChurnPredictor Class

### Task Information

| Attribute | Value |
|-----------|-------|
| **Task ID** | 53 |
| **Title** | Create ChurnPredictor Class |
| **Complexity** | Medium |
| **Dependencies** | Feature extractors, trained model |
| **Output** | ChurnResult dataclass |

### Objective

Create the main prediction service class that orchestrates feature extraction, model inference, and result formatting for churn predictions.

### ChurnPredictor Class Design

```
┌─────────────────────────────────────────────────────────────────┐
│                      ChurnPredictor                              │
├─────────────────────────────────────────────────────────────────┤
│ Attributes:                                                      │
│   - model: RandomForestClassifier (loaded from storage)          │
│   - feature_extractor: ChurnFeatureExtractor                     │
│   - model_version: str                                           │
│   - threshold_high: float (default 0.7)                          │
│   - threshold_medium: float (default 0.4)                        │
├─────────────────────────────────────────────────────────────────┤
│ Methods:                                                         │
│   + predict(customer_id) → ChurnResult                           │
│   + predict_batch(customer_ids) → List[ChurnResult]              │
│   + get_risk_level(probability) → str                            │
│   + get_top_factors(features, importances) → List[ChurnFactor]   │
│   + load_model(version) → None                                   │
└─────────────────────────────────────────────────────────────────┘
```

### ChurnResult Structure

| Field | Type | Description |
|-------|------|-------------|
| `customer_id` | UUID | Customer identifier |
| `probability` | float | Churn probability (0.0 to 1.0) |
| `probability_percent` | int | Churn probability (0-100%) |
| `risk_level` | str | "high", "medium", or "low" |
| `top_factors` | List[ChurnFactor] | Top 5 contributing factors |
| `prediction_date` | datetime | When prediction was made |
| `model_version` | str | Model version used |
| `confidence` | float | Prediction confidence score |

### ChurnFactor Structure

| Field | Type | Description |
|-------|------|-------------|
| `feature_name` | str | Name of the feature |
| `feature_value` | float | Customer's feature value |
| `contribution` | float | Factor's contribution to churn |
| `direction` | str | "positive" or "negative" impact |
| `description` | str | Human-readable explanation |

### Implementation Steps

1. **Initialize Predictor**
   - Load trained Random Forest model from storage
   - Initialize feature extractor component
   - Set risk level thresholds
   - Validate model integrity

2. **Implement predict Method**
   - Accept customer_id as input parameter
   - Retrieve customer data from database
   - Extract all churn features
   - Run model inference
   - Calculate probability using predict_proba
   - Determine risk level from thresholds
   - Identify top contributing factors
   - Return ChurnResult object

3. **Implement Batch Prediction**
   - Accept list of customer IDs
   - Optimize with bulk data retrieval
   - Process features in batches
   - Return list of ChurnResult objects

4. **Risk Level Classification**

| Probability Range | Risk Level | Action Priority |
|-------------------|------------|-----------------|
| 70-100% | High | Immediate intervention |
| 40-69% | Medium | Proactive engagement |
| 0-39% | Low | Standard monitoring |

### File Location

Create predictor class in: `apps/ai/services/customer_insights/churn/predictor.py`

---

## Task 54: Create Churn Features

### Task Information

| Attribute | Value |
|-----------|-------|
| **Task ID** | 54 |
| **Title** | Create Churn Features |
| **Complexity** | Medium |
| **Dependencies** | Customer data, Order history |
| **Output** | Feature vector (10+ features) |

### Objective

Design and implement the feature engineering pipeline that extracts behavioral signals indicating potential customer churn.

### Feature Engineering Pipeline

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     FEATURE ENGINEERING FLOW                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────┐                                                            │
│  │  Customer   │                                                            │
│  │    Data     │                                                            │
│  └──────┬──────┘                                                            │
│         │                                                                    │
│         ▼                                                                    │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │                     Feature Extractors                                │   │
│  ├──────────────┬──────────────┬──────────────┬──────────────┬─────────┤   │
│  │  Recency     │  Frequency   │  Monetary    │  Engagement  │ Support │   │
│  │  Features    │  Features    │  Features    │  Features    │ Features│   │
│  ├──────────────┼──────────────┼──────────────┼──────────────┼─────────┤   │
│  │• Days Since  │• Freq 3M     │• AOV Recent  │• Site Visits │• Ticket │   │
│  │  Last Order  │• Freq 6M     │• AOV History │• Email Opens │  Count  │   │
│  │• Days Since  │• Freq Decline│• AOV Decline │• Click Rate  │• Avg    │   │
│  │  Last Visit  │• Order Count │• LTV Change  │• Eng Score   │  Severity│  │
│  └──────────────┴──────────────┴──────────────┴──────────────┴─────────┘   │
│         │                                                                    │
│         ▼                                                                    │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │                    Normalized Feature Vector                          │   │
│  │  [f1, f2, f3, f4, f5, f6, f7, f8, f9, f10, f11, f12]                  │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Complete Feature Set

| # | Feature Name | Category | Description | Range |
|---|--------------|----------|-------------|-------|
| 1 | days_since_last_order | Recency | Days since last purchase | 0 - ∞ |
| 2 | days_since_last_visit | Recency | Days since last site visit | 0 - ∞ |
| 3 | frequency_3m | Frequency | Orders in last 3 months | 0 - n |
| 4 | frequency_6m | Frequency | Orders in last 6 months | 0 - n |
| 5 | frequency_decline | Frequency | Change in order frequency | -1.0 to 1.0 |
| 6 | aov_recent | Monetary | AOV last 3 months | 0 - ∞ |
| 7 | aov_historical | Monetary | AOV last 12 months | 0 - ∞ |
| 8 | aov_decline | Monetary | Change in AOV | -1.0 to 1.0 |
| 9 | engagement_score | Engagement | Combined engagement metric | 0 - 100 |
| 10 | support_ticket_count | Support | Support tickets (90 days) | 0 - n |
| 11 | customer_tenure_days | Demographics | Days since first order | 0 - ∞ |
| 12 | return_rate | Behavior | Percentage of orders returned | 0 - 1.0 |

### Feature Extractor Class Design

```
┌─────────────────────────────────────────────────────────────────┐
│                    ChurnFeatureExtractor                         │
├─────────────────────────────────────────────────────────────────┤
│ Attributes:                                                      │
│   - feature_config: Dict[str, FeatureConfig]                     │
│   - scaler: StandardScaler (fitted on training data)             │
│   - feature_order: List[str]                                     │
├─────────────────────────────────────────────────────────────────┤
│ Methods:                                                         │
│   + extract(customer_id) → Dict[str, float]                      │
│   + extract_batch(customer_ids) → DataFrame                      │
│   + normalize(features) → np.array                               │
│   + get_feature_names() → List[str]                              │
│   + validate_features(features) → bool                           │
└─────────────────────────────────────────────────────────────────┘
```

### Implementation Steps

1. **Create Feature Configuration**
   - Define each feature with name, type, and extraction method
   - Specify normalization parameters
   - Set default values for missing data

2. **Implement Feature Extraction**
   - Query customer order history
   - Query engagement data
   - Query support ticket data
   - Calculate each feature value
   - Handle missing data gracefully

3. **Normalize Features**
   - Apply StandardScaler from training data
   - Ensure consistent feature ordering
   - Handle outliers appropriately

### File Location

Create feature extractor in: `apps/ai/services/customer_insights/churn/features.py`

---

## Task 55: Create Inactivity Feature

### Task Information

| Attribute | Value |
|-----------|-------|
| **Task ID** | 55 |
| **Title** | Create Inactivity Feature |
| **Complexity** | Low |
| **Dependencies** | Order history |
| **Formula** | `days_since_last_order = Today - last_order_date` |

### Objective

Calculate the number of days since a customer's last order as a primary churn indicator.

### Inactivity Calculation

```
┌─────────────────────────────────────────────────────────────────┐
│                  INACTIVITY CALCULATION                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   Customer Last Order: 2025-11-15                               │
│   Today's Date:        2026-01-31                               │
│                                                                  │
│   days_since_last_order = 2026-01-31 - 2025-11-15              │
│                         = 77 days                                │
│                                                                  │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │ Risk Thresholds:                                         │   │
│   │   0-30 days   → Low risk (Active customer)               │   │
│   │   31-60 days  → Medium risk (Declining activity)         │   │
│   │   61-90 days  → High risk (At-risk customer)             │   │
│   │   90+ days    → Critical (Churned by definition)         │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Inactivity Thresholds

| Days Inactive | Risk Level | Interpretation |
|---------------|------------|----------------|
| 0-30 | Low | Customer is actively purchasing |
| 31-60 | Medium | Purchase frequency declining |
| 61-90 | High | Significant inactivity, at risk |
| 90+ | Critical | Meets churn definition threshold |

### Implementation Steps

1. **Retrieve Last Order Date**
   - Query orders table for customer
   - Find maximum order date (most recent)
   - Handle customers with no orders

2. **Calculate Days Difference**
   - Get current date (timezone-aware)
   - Subtract last order date from today
   - Return integer days

3. **Handle Edge Cases**

| Scenario | Handling |
|----------|----------|
| No orders ever | Return maximum value (e.g., 9999) |
| Order today | Return 0 |
| Future order date | Return 0 (data error) |

### File Location

Add to feature extractor: `apps/ai/services/customer_insights/churn/features.py`

---

## Task 56: Create Frequency Drop Feature

### Task Information

| Attribute | Value |
|-----------|-------|
| **Task ID** | 56 |
| **Title** | Create Frequency Drop |
| **Complexity** | Medium |
| **Dependencies** | Order history |
| **Formula** | `frequency_decline = (3-month freq - 6-month freq) / 6-month freq` |

### Objective

Measure the change in purchase frequency between recent and historical periods to detect declining engagement.

### Frequency Decline Calculation

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    FREQUENCY DECLINE ANALYSIS                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   Timeline:                                                                  │
│   ├────────────────────────────────────────────────────────────────┤        │
│   │      6 Months Ago              3 Months Ago           Today    │        │
│   │           │                         │                   │      │        │
│   │           ▼                         ▼                   ▼      │        │
│   │  ┌─────────────────────┐   ┌─────────────────────┐            │        │
│   │  │  Historical Period  │   │   Recent Period     │            │        │
│   │  │  (Months 4-6 back)  │   │   (Last 3 months)   │            │        │
│   │  │                     │   │                     │            │        │
│   │  │  Orders: 8          │   │  Orders: 4          │            │        │
│   │  │  Avg/Month: 2.67    │   │  Avg/Month: 1.33    │            │        │
│   │  └─────────────────────┘   └─────────────────────┘            │        │
│                                                                              │
│   Calculation:                                                               │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │  frequency_3m = 4 orders ÷ 3 months = 1.33 orders/month             │   │
│   │  frequency_6m = 8 orders ÷ 6 months = 1.33 orders/month (baseline)  │   │
│   │                                                                      │   │
│   │  frequency_decline = (1.33 - 1.33) / 1.33                           │   │
│   │                    = 0 / 1.33                                        │   │
│   │                    = 0.0 (no change)                                 │   │
│   │                                                                      │   │
│   │  Example with decline:                                               │   │
│   │  If recent = 0.5/month, historical = 2.0/month                       │   │
│   │  decline = (0.5 - 2.0) / 2.0 = -0.75 (75% decline)                  │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Frequency Decline Interpretation

| Decline Value | Interpretation | Churn Signal |
|---------------|----------------|--------------|
| > 0 | Frequency increased | Low risk |
| 0 | No change | Neutral |
| -0.01 to -0.25 | Slight decline | Low risk |
| -0.26 to -0.50 | Moderate decline | Medium risk |
| -0.51 to -0.75 | Significant decline | High risk |
| < -0.75 | Severe decline | Critical risk |

### Implementation Steps

1. **Calculate 3-Month Frequency**
   - Count orders in last 3 months
   - Divide by 3 for monthly rate
   - Store as frequency_3m

2. **Calculate 6-Month Frequency**
   - Count orders in last 6 months
   - Divide by 6 for monthly rate
   - Store as frequency_6m (baseline)

3. **Calculate Decline Rate**
   - Apply formula: (recent - historical) / historical
   - Handle division by zero (return 0 if no historical orders)
   - Cap extreme values at -1.0 to 1.0

### Edge Case Handling

| Scenario | frequency_6m | frequency_3m | Result |
|----------|--------------|--------------|--------|
| New customer (< 6 months) | Use available data | Normal | Adjusted calculation |
| No historical orders | 0 | Any | Return 0 (no baseline) |
| No recent orders | Any | 0 | Return -1.0 (complete stop) |
| Equal frequency | n | n | Return 0 (stable) |

---

## Task 57: Create AOV Drop Feature

### Task Information

| Attribute | Value |
|-----------|-------|
| **Task ID** | 57 |
| **Title** | Create AOV Drop |
| **Complexity** | Medium |
| **Dependencies** | Order history with amounts |
| **Formula** | `aov_decline = (Recent AOV - Historical AOV) / Historical AOV` |

### Objective

Detect decline in average order value which may indicate reduced customer commitment or satisfaction.

### AOV Decline Calculation

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       AOV DECLINE ANALYSIS                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   Customer Order History:                                                    │
│                                                                              │
│   Historical Period (4-12 months ago)    Recent Period (Last 3 months)      │
│   ┌─────────────────────────────────┐    ┌─────────────────────────────┐    │
│   │ Order 1: $150                   │    │ Order 1: $75                │    │
│   │ Order 2: $200                   │    │ Order 2: $80                │    │
│   │ Order 3: $180                   │    │ Order 3: $70                │    │
│   │ Order 4: $170                   │    └─────────────────────────────┘    │
│   │ Order 5: $200                   │                                        │
│   └─────────────────────────────────┘                                        │
│                                                                              │
│   Calculations:                                                              │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │  Historical AOV = ($150+$200+$180+$170+$200) / 5 = $180             │   │
│   │  Recent AOV     = ($75+$80+$70) / 3 = $75                           │   │
│   │                                                                      │   │
│   │  aov_decline = ($75 - $180) / $180                                  │   │
│   │              = -$105 / $180                                          │   │
│   │              = -0.583 (58.3% decline)                               │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### AOV Decline Thresholds

| Decline Value | Interpretation | Risk Level |
|---------------|----------------|------------|
| > 0.10 | AOV increased 10%+ | Very low |
| 0 to 0.10 | Stable/slight increase | Low |
| -0.01 to -0.15 | Minor decline | Low |
| -0.16 to -0.30 | Moderate decline | Medium |
| -0.31 to -0.50 | Significant decline | High |
| < -0.50 | Severe decline | Critical |

### Implementation Steps

1. **Calculate Historical AOV**
   - Query orders from 4-12 months ago
   - Sum order totals
   - Divide by order count
   - Exclude outliers (optional)

2. **Calculate Recent AOV**
   - Query orders from last 3 months
   - Sum order totals
   - Divide by order count

3. **Calculate Decline Percentage**
   - Apply formula: (recent - historical) / historical
   - Handle zero historical AOV
   - Return normalized value

### Data Considerations

| Factor | Recommendation |
|--------|----------------|
| Outlier handling | Exclude orders > 3 std dev from mean |
| Minimum orders | Require at least 2 orders in each period |
| Currency | Ensure consistent currency for comparison |
| Discounts | Use order total after discounts |

---

## Task 58: Create Engagement Feature

### Task Information

| Attribute | Value |
|-----------|-------|
| **Task ID** | 58 |
| **Title** | Create Engagement Feature |
| **Complexity** | Medium |
| **Dependencies** | Analytics data, Email data |
| **Output** | engagement_score (0-100) |

### Objective

Calculate a composite engagement score from multiple interaction channels including site visits, email opens, and click-through rates.

### Engagement Score Calculation

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    ENGAGEMENT SCORE COMPOSITION                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   ┌──────────────────────────────────────────────────────────────────────┐  │
│   │                     Input Signals (Last 30 Days)                      │  │
│   ├──────────────────┬──────────────────┬──────────────────────────────┤  │
│   │   Site Activity  │  Email Activity  │    Click Activity            │  │
│   │   (40% weight)   │   (30% weight)   │    (30% weight)              │  │
│   ├──────────────────┼──────────────────┼──────────────────────────────┤  │
│   │ • Page views     │ • Emails sent    │ • Email link clicks          │  │
│   │ • Sessions       │ • Emails opened  │ • Product page clicks        │  │
│   │ • Time on site   │ • Open rate      │ • CTA clicks                 │  │
│   │ • Products viewed│                  │ • Add to cart                │  │
│   └──────────────────┴──────────────────┴──────────────────────────────┘  │
│                                 │                                          │
│                                 ▼                                          │
│   ┌──────────────────────────────────────────────────────────────────────┐ │
│   │                    Score Calculation                                  │ │
│   │                                                                       │ │
│   │  site_score = normalize(visits, sessions, time) × 0.4                │ │
│   │  email_score = (emails_opened / emails_sent) × 100 × 0.3             │ │
│   │  click_score = (clicks / opportunities) × 100 × 0.3                  │ │
│   │                                                                       │ │
│   │  engagement_score = site_score + email_score + click_score           │ │
│   │                   = 0-100 scale                                       │ │
│   └──────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Engagement Components

| Component | Weight | Inputs | Scoring Method |
|-----------|--------|--------|----------------|
| Site Activity | 40% | Sessions, page views, time on site | Normalize to percentile |
| Email Engagement | 30% | Open rate (opens/sent) | Direct percentage |
| Click Activity | 30% | Click-through rate | Direct percentage |

### Engagement Score Interpretation

| Score Range | Level | Description |
|-------------|-------|-------------|
| 80-100 | Highly Engaged | Active across all channels |
| 60-79 | Engaged | Regular interaction |
| 40-59 | Moderate | Occasional interaction |
| 20-39 | Low | Minimal engagement |
| 0-19 | Disengaged | Almost no activity |

### Implementation Steps

1. **Collect Site Activity Data**
   - Query sessions in last 30 days
   - Calculate total page views
   - Sum time on site
   - Count products viewed

2. **Collect Email Activity Data**
   - Count emails sent to customer
   - Count emails opened
   - Calculate open rate

3. **Collect Click Activity Data**
   - Count email link clicks
   - Count CTA interactions
   - Calculate click-through rate

4. **Calculate Composite Score**
   - Normalize each component to 0-100
   - Apply weights
   - Sum for final score

### Data Source Integration

| Data Type | Source | Query Method |
|-----------|--------|--------------|
| Site visits | Analytics service | API call |
| Email data | Email marketing platform | API call |
| Click data | Event tracking system | Database query |

---

## Task 59: Create Support Tickets Feature

### Task Information

| Attribute | Value |
|-----------|-------|
| **Task ID** | 59 |
| **Title** | Create Support Tickets |
| **Complexity** | Low |
| **Dependencies** | Support ticket system |
| **Formula** | `support_ticket_count = Count in last 90 days` |

### Objective

Count recent support tickets as an indicator of customer satisfaction and potential frustration.

### Support Ticket Analysis

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    SUPPORT TICKET ANALYSIS                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   Customer Support History (Last 90 Days):                                   │
│                                                                              │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │  Ticket #1234  │ Complaint    │ Resolved   │ 2025-12-15            │   │
│   │  Ticket #1567  │ Question     │ Resolved   │ 2026-01-02            │   │
│   │  Ticket #1890  │ Return       │ Resolved   │ 2026-01-20            │   │
│   │  Ticket #2001  │ Complaint    │ Open       │ 2026-01-28            │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│   Metrics:                                                                   │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │  support_ticket_count = 4                                           │   │
│   │  complaint_count = 2                                                 │   │
│   │  open_tickets = 1                                                    │   │
│   │  avg_resolution_days = 3.5                                          │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Support Ticket Thresholds

| Ticket Count (90 days) | Risk Interpretation |
|------------------------|---------------------|
| 0 | No issues or no engagement |
| 1-2 | Normal support needs |
| 3-5 | Elevated issues |
| 6+ | High frustration indicator |

### Additional Support Metrics

| Metric | Calculation | Weight in Churn |
|--------|-------------|-----------------|
| Total count | Count all tickets | Primary |
| Complaint ratio | Complaints / Total | Secondary |
| Open tickets | Count unresolved | Secondary |
| Escalations | Count escalated | High impact |

### Implementation Steps

1. **Query Support Tickets**
   - Filter by customer ID
   - Filter by date (last 90 days)
   - Include all ticket types

2. **Calculate Primary Count**
   - Simple count of matching tickets
   - Store as support_ticket_count

3. **Calculate Secondary Metrics (Optional)**
   - Count by ticket type
   - Calculate resolution times
   - Track escalation rate

### Edge Cases

| Scenario | Handling |
|----------|----------|
| No support system integration | Return 0 |
| Customer never contacted support | Return 0 |
| Multiple tickets same issue | Count each ticket |

---

## Task 60: Create Classification Model

### Task Information

| Attribute | Value |
|-----------|-------|
| **Task ID** | 60 |
| **Title** | Create Classification Model |
| **Complexity** | High |
| **Dependencies** | Feature extractor, Training data |
| **Model** | RandomForestClassifier (sklearn) |

### Objective

Configure and implement a Random Forest classifier to predict binary churn outcome (churned vs. retained).

### Model Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    RANDOM FOREST CLASSIFIER                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │                     Feature Input (12 features)                      │   │
│   │  [f1, f2, f3, f4, f5, f6, f7, f8, f9, f10, f11, f12]                │   │
│   └───────────────────────────────┬─────────────────────────────────────┘   │
│                                   │                                          │
│                                   ▼                                          │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │              Random Forest Ensemble (100 Trees)                      │   │
│   │   ┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐                │   │
│   │   │Tree 1 │ │Tree 2 │ │Tree 3 │ │  ...  │ │Tree100│                │   │
│   │   │       │ │       │ │       │ │       │ │       │                │   │
│   │   │ Vote  │ │ Vote  │ │ Vote  │ │ Vote  │ │ Vote  │                │   │
│   │   │  0/1  │ │  0/1  │ │  0/1  │ │  0/1  │ │  0/1  │                │   │
│   │   └───┬───┘ └───┬───┘ └───┬───┘ └───┬───┘ └───┬───┘                │   │
│   │       └─────────┴─────────┴────┬────┴─────────┘                     │   │
│   │                                │                                     │   │
│   │                     Majority Vote / Probability                      │   │
│   └────────────────────────────────┼────────────────────────────────────┘   │
│                                    │                                         │
│                                    ▼                                         │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │                         Output                                       │   │
│   │   • Prediction: 0 (Retained) or 1 (Churned)                         │   │
│   │   • Probability: 0.0 to 1.0                                          │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Hyperparameter Configuration

| Parameter | Value | Rationale |
|-----------|-------|-----------|
| `n_estimators` | 100 | Balance of accuracy and speed |
| `max_depth` | 10 | Prevent overfitting |
| `min_samples_split` | 5 | Ensure meaningful splits |
| `class_weight` | balanced | Handle imbalanced classes |
| `random_state` | 42 | Reproducibility |
| `n_jobs` | -1 | Use all CPU cores |
| `oob_score` | True | Out-of-bag scoring |

### Model Configuration Object

| Property | Type | Description |
|----------|------|-------------|
| `model_type` | str | "random_forest" |
| `version` | str | Semantic version (e.g., "1.0.0") |
| `hyperparameters` | dict | All model parameters |
| `feature_names` | list | Ordered feature list |
| `target_column` | str | "churned" |
| `classes` | list | [0, 1] |

### Implementation Steps

1. **Create Model Configuration**
   - Define hyperparameters as configuration
   - Store feature list and order
   - Set version tracking

2. **Initialize Model**
   - Import RandomForestClassifier from sklearn
   - Apply hyperparameters from config
   - Configure class weights for imbalance

3. **Create Model Wrapper**
   - Wrap sklearn model with custom class
   - Add serialization methods
   - Include metadata (version, features, training date)

4. **Implement Feature Importance**
   - Extract feature_importances_ after training
   - Map to feature names
   - Store for explanation purposes

### Feature Importance Tracking

| Feature | Expected Importance | Notes |
|---------|---------------------|-------|
| days_since_last_order | High | Primary churn indicator |
| frequency_decline | High | Strong behavioral signal |
| engagement_score | Medium-High | Multi-channel indicator |
| aov_decline | Medium | Value commitment signal |
| support_ticket_count | Medium | Satisfaction indicator |

### File Location

Create model configuration in: `apps/ai/services/customer_insights/churn/model.py`

---

## Task 61: Create Training Pipeline

### Task Information

| Attribute | Value |
|-----------|-------|
| **Task ID** | 61 |
| **Title** | Create Training Pipeline |
| **Complexity** | High |
| **Dependencies** | Model, Features, Historical data |
| **Schedule** | Monthly retraining |

### Objective

Implement an end-to-end training pipeline for the churn model including data preparation, training, validation, and deployment.

### Training Pipeline Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       TRAINING PIPELINE                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   ┌──────────────────────────────────────────────────────────────────────┐  │
│   │ Step 1: Data Collection                                               │  │
│   │ ┌────────────────────────────────────────────────────────────────┐   │  │
│   │ │ • Query customers with known outcomes                          │   │  │
│   │ │ • Churn Definition: No order in 90+ days                       │   │  │
│   │ │ • Observation window: 12 months historical data                │   │  │
│   │ └────────────────────────────────────────────────────────────────┘   │  │
│   └──────────────────────────────────────────────────────────────────────┘  │
│                                     │                                        │
│                                     ▼                                        │
│   ┌──────────────────────────────────────────────────────────────────────┐  │
│   │ Step 2: Feature Engineering                                          │  │
│   │ ┌────────────────────────────────────────────────────────────────┐   │  │
│   │ │ • Extract all 12 features for each customer                    │   │  │
│   │ │ • Handle missing values                                         │   │  │
│   │ │ • Normalize features (fit StandardScaler)                       │   │  │
│   │ └────────────────────────────────────────────────────────────────┘   │  │
│   └──────────────────────────────────────────────────────────────────────┘  │
│                                     │                                        │
│                                     ▼                                        │
│   ┌──────────────────────────────────────────────────────────────────────┐  │
│   │ Step 3: Train/Test Split                                             │  │
│   │ ┌────────────────────────────────────────────────────────────────┐   │  │
│   │ │ • 80% Training set                                              │   │  │
│   │ │ • 20% Test set                                                  │   │  │
│   │ │ • Stratified split to maintain class balance                    │   │  │
│   │ └────────────────────────────────────────────────────────────────┘   │  │
│   └──────────────────────────────────────────────────────────────────────┘  │
│                                     │                                        │
│                                     ▼                                        │
│   ┌──────────────────────────────────────────────────────────────────────┐  │
│   │ Step 4: Model Training                                               │  │
│   │ ┌────────────────────────────────────────────────────────────────┐   │  │
│   │ │ • Fit RandomForestClassifier                                    │   │  │
│   │ │ • Apply hyperparameters                                         │   │  │
│   │ │ • Extract feature importances                                   │   │  │
│   │ └────────────────────────────────────────────────────────────────┘   │  │
│   └──────────────────────────────────────────────────────────────────────┘  │
│                                     │                                        │
│                                     ▼                                        │
│   ┌──────────────────────────────────────────────────────────────────────┐  │
│   │ Step 5: Evaluation                                                   │  │
│   │ ┌────────────────────────────────────────────────────────────────┐   │  │
│   │ │ • Calculate Precision, Recall, F1-Score                        │   │  │
│   │ │ • Generate confusion matrix                                     │   │  │
│   │ │ • Validate against performance thresholds                       │   │  │
│   │ └────────────────────────────────────────────────────────────────┘   │  │
│   └──────────────────────────────────────────────────────────────────────┘  │
│                                     │                                        │
│                                     ▼                                        │
│   ┌──────────────────────────────────────────────────────────────────────┐  │
│   │ Step 6: Model Deployment                                             │  │
│   │ ┌────────────────────────────────────────────────────────────────┐   │  │
│   │ │ • Serialize model and scaler                                    │   │  │
│   │ │ • Store with version metadata                                   │   │  │
│   │ │ • Update model registry                                         │   │  │
│   │ └────────────────────────────────────────────────────────────────┘   │  │
│   └──────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Churn Definition

| Criterion | Definition |
|-----------|------------|
| Churned (Label = 1) | No order in 90+ days from observation date |
| Retained (Label = 0) | At least one order within 90 days |
| Observation date | Point in time for feature calculation |
| Outcome date | 90 days after observation date |

### Data Split Configuration

| Split | Percentage | Purpose |
|-------|------------|---------|
| Training | 80% | Model fitting |
| Testing | 20% | Final evaluation |
| Validation (optional) | Cross-validation | Hyperparameter tuning |

### Evaluation Metrics

| Metric | Target | Calculation |
|--------|--------|-------------|
| Precision | ≥ 0.70 | TP / (TP + FP) |
| Recall | ≥ 0.75 | TP / (TP + FN) |
| F1-Score | ≥ 0.72 | 2 × (Precision × Recall) / (Precision + Recall) |
| AUC-ROC | ≥ 0.80 | Area under ROC curve |

### Retraining Schedule

| Frequency | Trigger | Action |
|-----------|---------|--------|
| Monthly | Scheduled | Full pipeline rerun |
| On-demand | Performance drop | Immediate retraining |
| Quarterly | Review | Hyperparameter optimization |

### Implementation Steps

1. **Create Training Data Collector**
   - Query customers with sufficient history
   - Label based on churn definition
   - Balance classes if needed

2. **Implement Feature Pipeline**
   - Extract features for all training customers
   - Fit scaler on training data
   - Save scaler for inference

3. **Implement Training Logic**
   - Split data with stratification
   - Fit model on training set
   - Calculate metrics on test set

4. **Implement Deployment**
   - Serialize model with joblib
   - Store metadata (version, metrics, date)
   - Update model registry

### Model Artifacts

| Artifact | Format | Storage Location |
|----------|--------|------------------|
| Model | .joblib | ai_models/churn/ |
| Scaler | .joblib | ai_models/churn/ |
| Metadata | .json | ai_models/churn/ |
| Metrics | .json | ai_models/churn/ |

---

## Task 62: Create Churn Probability

### Task Information

| Attribute | Value |
|-----------|-------|
| **Task ID** | 62 |
| **Title** | Create Churn Probability |
| **Complexity** | Medium |
| **Dependencies** | Trained model |
| **Output** | Probability 0-100% |

### Objective

Implement probability output using the model's predict_proba method to provide nuanced risk assessment.

### Probability Calculation

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    PROBABILITY OUTPUT                                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   Model Output:                                                              │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │  model.predict_proba(features)                                      │   │
│   │                                                                      │   │
│   │  Returns: [[P(class=0), P(class=1)]]                                │   │
│   │           [[0.25, 0.75]]                                             │   │
│   │                                                                      │   │
│   │  P(churn) = P(class=1) = 0.75                                       │   │
│   │  P(retain) = P(class=0) = 0.25                                      │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│   Conversion to Percentage:                                                  │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │  probability_raw = 0.75                                             │   │
│   │  probability_percent = round(0.75 × 100) = 75%                      │   │
│   │                                                                      │   │
│   │  Risk Level: HIGH (≥70%)                                            │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│   Probability Distribution:                                                  │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │  0%                    50%                   100%                   │   │
│   │  │──────────────────────│───────────────────────│                   │   │
│   │  │    RETAINED          │        CHURNED        │                   │   │
│   │  │                      │                  ▲    │                   │   │
│   │  │                      │                  │    │                   │   │
│   │  │                      │               75%     │                   │   │
│   │  │    Low Risk          │ Medium │   High Risk  │                   │   │
│   │  └──────────────────────┴────────┴──────────────┘                   │   │
│   │       0-39%              40-69%       70-100%                        │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Probability Interpretation Table

| Probability | Risk Level | Recommended Action |
|-------------|------------|-------------------|
| 0-19% | Very Low | Standard engagement |
| 20-39% | Low | Monitor periodically |
| 40-59% | Medium | Proactive outreach |
| 60-79% | High | Immediate intervention |
| 80-100% | Critical | Urgent retention campaign |

### Implementation Steps

1. **Extract Probability from Model**
   - Use predict_proba method
   - Get probability for class=1 (churn)
   - Handle edge cases

2. **Convert to Percentage**
   - Multiply by 100
   - Round to integer
   - Ensure range 0-100

3. **Assign Risk Level**
   - Apply threshold logic
   - Return categorical risk level
   - Include in result object

### Confidence Scoring

| Scenario | Confidence Adjustment |
|----------|----------------------|
| Probability near 50% | Lower confidence |
| Probability near 0% or 100% | Higher confidence |
| Limited customer data | Lower confidence |
| Long customer history | Higher confidence |

### Output Format

| Field | Example Value | Description |
|-------|---------------|-------------|
| probability | 0.75 | Raw model output |
| probability_percent | 75 | Percentage (0-100) |
| risk_level | "high" | Categorical label |
| confidence | 0.85 | Prediction confidence |

---

## Summary and Cross-References

### Tasks Completed in This Document

| Task ID | Title | Complexity | Status |
|---------|-------|------------|--------|
| 53 | ChurnPredictor Class | Medium | Defined |
| 54 | Churn Features | Medium | Defined |
| 55 | Inactivity Feature | Low | Defined |
| 56 | Frequency Drop | Medium | Defined |
| 57 | AOV Drop | Medium | Defined |
| 58 | Engagement Feature | Medium | Defined |
| 59 | Support Tickets | Low | Defined |
| 60 | Classification Model | High | Defined |
| 61 | Training Pipeline | High | Defined |
| 62 | Churn Probability | Medium | Defined |

### Files to Create

| File | Purpose |
|------|---------|
| `apps/ai/services/customer_insights/churn/__init__.py` | Package init |
| `apps/ai/services/customer_insights/churn/predictor.py` | ChurnPredictor class |
| `apps/ai/services/customer_insights/churn/features.py` | Feature extraction |
| `apps/ai/services/customer_insights/churn/model.py` | Model configuration |
| `apps/ai/services/customer_insights/churn/training.py` | Training pipeline |

### Dependencies Map

```
┌─────────────────────────────────────────────────────────────────┐
│                    DEPENDENCY CHAIN                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   Task 55-59 ──┐                                                │
│   (Features)    │                                                │
│                 ├───▶ Task 54 ───▶ Task 60 ───▶ Task 61         │
│   Order Data ──┘     (Feature     (Model)      (Training)       │
│   Analytics ───────▶  Extractor)                   │             │
│   Support ─────────▶                               │             │
│                                                    ▼             │
│                            Task 53 ◀──────── Task 62            │
│                          (Predictor)        (Probability)        │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Next Document Preview

The next document [02_Tasks-63-68_Risk-API.md](02_Tasks-63-68_Risk-API.md) covers:
- Risk scoring API endpoint
- Churn alerts system
- At-risk customer dashboard
- Retention campaign integration
- Batch prediction scheduling
- Churn prediction monitoring

---

## Appendix: Feature Reference

### Complete Feature Specification

| Feature | Type | Source | Calculation | Range | Weight |
|---------|------|--------|-------------|-------|--------|
| days_since_last_order | int | Orders | Today - last_order_date | 0-∞ | High |
| days_since_last_visit | int | Analytics | Today - last_visit_date | 0-∞ | Medium |
| frequency_3m | float | Orders | Orders in 90 days / 3 | 0-∞ | Medium |
| frequency_6m | float | Orders | Orders in 180 days / 6 | 0-∞ | Medium |
| frequency_decline | float | Calculated | (f3m - f6m) / f6m | -1 to 1 | High |
| aov_recent | float | Orders | Avg order value (90 days) | 0-∞ | Medium |
| aov_historical | float | Orders | Avg order value (12 months) | 0-∞ | Low |
| aov_decline | float | Calculated | (recent - hist) / hist | -1 to 1 | Medium |
| engagement_score | float | Multi | Composite engagement | 0-100 | High |
| support_ticket_count | int | Support | Tickets in 90 days | 0-∞ | Medium |
| customer_tenure_days | int | Customer | Days since first order | 0-∞ | Low |
| return_rate | float | Orders | Returns / Total orders | 0-1 | Medium |

---

*Document Version: 1.0*  
*Last Updated: 2026-01-31*  
*Tasks Covered: 53-62 of 68 (Group D Churn Prediction)*
