# Tasks 35-44: LTV Features and XGBoost Model

> **Phase:** 10 - AI Features & Advanced Capabilities  
> **SubPhase:** 12 - Customer Insights AI (FINAL SUBPHASE)  
> **Group:** C - LTV Prediction  
> **Document:** 01 of 02  
> **Tasks Covered:** 35, 36, 37, 38, 39, 40, 41, 42, 43, 44

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-45-52_LTV-API.md](02_Tasks-45-52_LTV-API.md)

---

## Document Overview

This document covers the implementation of Customer Lifetime Value (LTV) prediction using XGBoost regression. It includes feature engineering for 10+ customer attributes, model training pipeline setup, and LTV tier classification for the Sri Lankan market (LKR currency).

### Tasks Summary Table

| Task | Title | Complexity | Description |
|------|-------|------------|-------------|
| 35 | LTVPredictor Class | Medium | Core predictor class with predict(customer_id) method |
| 36 | LTV Features | Medium | Feature engineering framework, 10+ features |
| 37 | Tenure Feature | Low | Customer tenure calculation in days |
| 38 | Frequency Feature | Low | Order frequency per month |
| 39 | AOV Feature | Low | Average order value calculation |
| 40 | Category Feature | Low | Category diversity measurement |
| 41 | Channel Feature | Low | Acquisition channel one-hot encoding |
| 42 | XGBoost Model | High | XGBRegressor for 12-month LTV prediction |
| 43 | Training Pipeline | High | End-to-end training with 80/20 split |
| 44 | LTV Tiers | Low | Four-tier classification (Platinum/Gold/Silver/Bronze) |

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         LTV PREDICTION SYSTEM                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐       │
│  │   Customer Data  │───▶│ Feature Engineer │───▶│  XGBoost Model   │       │
│  │                  │    │                  │    │                  │       │
│  │ • Orders         │    │ • Tenure         │    │ • n_estimators   │       │
│  │ • Transactions   │    │ • Frequency      │    │ • max_depth      │       │
│  │ • Categories     │    │ • AOV            │    │ • learning_rate  │       │
│  │ • Channels       │    │ • Category Div   │    │                  │       │
│  └──────────────────┘    │ • Channel (OHE)  │    └────────┬─────────┘       │
│                          └──────────────────┘             │                  │
│                                                           ▼                  │
│                          ┌──────────────────┐    ┌──────────────────┐       │
│                          │    LTV Tiers     │◀───│   LTV Result     │       │
│                          │                  │    │                  │       │
│                          │ • Platinum >500K │    │ • predicted_ltv  │       │
│                          │ • Gold 200-500K  │    │ • confidence     │       │
│                          │ • Silver 50-200K │    │ • tier           │       │
│                          │ • Bronze <50K    │    │ • features       │       │
│                          └──────────────────┘    └──────────────────┘       │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Task 35: Create LTVPredictor Class

### Objective
Create the core LTV prediction class that serves as the main interface for generating customer lifetime value predictions.

### Complexity: Medium

### Requirements

#### Class Definition

| Attribute | Type | Description |
|-----------|------|-------------|
| `model` | XGBRegressor | Trained XGBoost model instance |
| `feature_extractor` | LTVFeatureExtractor | Feature engineering component |
| `tier_classifier` | LTVTierClassifier | Tier assignment component |
| `model_path` | Path | Location of saved model file |
| `last_trained` | datetime | Timestamp of last training |

#### Primary Method: predict()

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `customer_id` | UUID | Yes | Target customer identifier |
| `prediction_horizon` | int | No | Months to predict (default: 12) |
| `include_confidence` | bool | No | Include confidence interval |

#### Return Type: LTVResult

| Field | Type | Description |
|-------|------|-------------|
| `customer_id` | UUID | Input customer ID |
| `predicted_ltv` | Decimal | Predicted LTV in LKR |
| `tier` | str | Assigned tier (Platinum/Gold/Silver/Bronze) |
| `confidence_lower` | Decimal | Lower bound (95% CI) |
| `confidence_upper` | Decimal | Upper bound (95% CI) |
| `features_used` | dict | Feature values used in prediction |
| `prediction_date` | datetime | When prediction was made |
| `model_version` | str | Model version identifier |

### Implementation Steps

1. **Create LTVResult dataclass**
   - Define all result fields as specified above
   - Add validation for LTV value (must be positive)
   - Include serialization method for API responses

2. **Implement LTVPredictor class**
   - Initialize with model loading from configured path
   - Validate model exists and is compatible version
   - Set up feature extractor and tier classifier dependencies

3. **Implement predict() method**
   - Validate customer_id exists in database
   - Extract features using feature extractor
   - Run prediction through XGBoost model
   - Calculate confidence intervals using model uncertainty
   - Assign tier based on predicted value
   - Return complete LTVResult object

4. **Implement batch prediction**
   - Add `predict_batch(customer_ids: List[UUID])` method
   - Optimize for bulk feature extraction
   - Return list of LTVResult objects

5. **Add model management methods**
   - `load_model(path)` - Load saved model
   - `get_model_info()` - Return model metadata
   - `is_model_current()` - Check if retraining needed

### Validation Requirements

| Check | Condition | Action |
|-------|-----------|--------|
| Customer exists | Query customer table | Raise CustomerNotFoundError |
| Model loaded | Check model is not None | Raise ModelNotLoadedError |
| Sufficient data | Customer has 3+ orders | Return low confidence warning |
| Feature completeness | All required features present | Use fallback values for missing |

### Error Handling

| Error | When | Response |
|-------|------|----------|
| CustomerNotFoundError | Invalid customer_id | Return 404 with message |
| ModelNotLoadedError | Model file missing | Return 503, trigger alert |
| InsufficientDataError | New customer, no history | Return prediction with low confidence flag |
| FeatureExtractionError | Data quality issues | Log error, use fallback features |

---

## Task 36: Create LTV Features Framework

### Objective
Build the feature engineering framework that creates 10+ predictive features for LTV modeling.

### Complexity: Medium

### Feature Categories Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                    LTV FEATURE CATEGORIES                            │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐      │
│  │   BEHAVIORAL    │  │   MONETARY      │  │   TEMPORAL      │      │
│  │                 │  │                 │  │                 │      │
│  │ • Order freq    │  │ • AOV           │  │ • Tenure days   │      │
│  │ • Category div  │  │ • Total spend   │  │ • Recency       │      │
│  │ • Channel       │  │ • Max order     │  │ • First order   │      │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘      │
│                                                                      │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐      │
│  │   ENGAGEMENT    │  │   PRODUCT       │  │   DEMOGRAPHIC   │      │
│  │                 │  │                 │  │                 │      │
│  │ • Return rate   │  │ • Pref category │  │ • Location      │      │
│  │ • Complaint cnt │  │ • Brand loyalty │  │ • Segment       │      │
│  │ • Support calls │  │ • Price sens    │  │ • Account type  │      │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘      │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### Complete Feature Specifications

| # | Feature Name | Type | Category | Data Source | Computation |
|---|--------------|------|----------|-------------|-------------|
| 1 | customer_tenure_days | int | Temporal | Orders | Today - first_order_date |
| 2 | order_frequency | float | Behavioral | Orders | Total orders / tenure months |
| 3 | average_order_value | float | Monetary | Orders | Total spend / order count |
| 4 | category_diversity | int | Product | Order Items | Count of unique categories |
| 5 | acquisition_channel | categorical | Demographic | Customer | One-hot encoded (3 values) |
| 6 | days_since_last_order | int | Temporal | Orders | Today - last_order_date |
| 7 | total_orders | int | Behavioral | Orders | Count of all orders |
| 8 | total_spend | float | Monetary | Orders | Sum of all order totals |
| 9 | max_order_value | float | Monetary | Orders | Maximum single order value |
| 10 | return_rate | float | Engagement | Returns | Returns / Total orders |
| 11 | preferred_category | categorical | Product | Order Items | Most purchased category |
| 12 | price_sensitivity | float | Behavioral | Orders | Discount usage percentage |

### LTVFeatureExtractor Class

#### Class Structure

| Component | Purpose |
|-----------|---------|
| `feature_definitions` | Registry of all feature specifications |
| `data_sources` | Database query templates for each source |
| `transformers` | Feature transformation functions |
| `validators` | Data quality validation rules |

#### Primary Method: extract_features()

| Parameter | Type | Description |
|-----------|------|-------------|
| `customer_id` | UUID | Target customer |
| `as_of_date` | date | Feature calculation date (default: today) |
| `feature_set` | str | Which features to extract ('all', 'core', 'extended') |

#### Return: FeatureVector

| Field | Type | Description |
|-------|------|-------------|
| `customer_id` | UUID | Customer identifier |
| `features` | dict | Feature name → value mapping |
| `feature_count` | int | Number of features extracted |
| `extraction_date` | datetime | When features were extracted |
| `missing_features` | list | Features that couldn't be computed |

### Implementation Steps

1. **Create feature registry**
   - Define FeatureDefinition dataclass with name, type, computation method
   - Register all 12+ features in central registry
   - Include feature importance scores from model training

2. **Implement data source queries**
   - Create efficient queries for each data source
   - Use tenant-aware database access
   - Implement query result caching (15-minute TTL)

3. **Build feature computation pipeline**
   - Process features in dependency order
   - Handle missing data with configurable strategies
   - Apply appropriate transformations (scaling, encoding)

4. **Add batch extraction**
   - Optimize for extracting features for multiple customers
   - Use bulk queries to reduce database round trips
   - Return DataFrame-compatible structure for training

### Feature Dependencies

```
┌─────────────────────────────────────────────────────────────────┐
│                   FEATURE DEPENDENCY GRAPH                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  first_order_date ─────┬───▶ customer_tenure_days               │
│                        │                                         │
│  total_orders ─────────┼───▶ order_frequency                    │
│                        │           │                             │
│  tenure_months ────────┘           │                             │
│                                    │                             │
│  total_spend ──────────────────────┼───▶ average_order_value    │
│       │                            │                             │
│       └───────────────▶ max_order_value                         │
│                                                                  │
│  order_items ──────────────────────────▶ category_diversity     │
│       │                                                          │
│       └───────────────▶ preferred_category                       │
│                                                                  │
│  last_order_date ──────────────────────▶ days_since_last_order  │
│                                                                  │
│  returns_count ────┬───▶ return_rate                            │
│  total_orders ─────┘                                             │
│                                                                  │
│  discount_orders ──┬───▶ price_sensitivity                      │
│  total_orders ─────┘                                             │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Task 37: Create Tenure Feature

### Objective
Calculate customer tenure in days from first order to current date.

### Complexity: Low

### Feature Specification

| Property | Value |
|----------|-------|
| Feature Name | `customer_tenure_days` |
| Data Type | Integer |
| Unit | Days |
| Minimum Value | 0 |
| Maximum Value | No limit |
| Null Handling | Use 0 for customers with no orders |

### Calculation Logic

```
customer_tenure_days = (current_date - first_order_date).days
```

### Data Source Query Requirements

| Source | Table | Field |
|--------|-------|-------|
| Primary | orders | created_at |
| Filter | orders | customer_id = target |
| Aggregation | MIN(created_at) | Get earliest order |

### Implementation Steps

1. **Query first order date**
   - Retrieve minimum order date for customer
   - Handle case where customer has no orders

2. **Calculate tenure**
   - Compute difference in days from first order to today
   - Use `as_of_date` parameter if provided for historical features

3. **Apply validation**
   - Ensure non-negative result
   - Cap at reasonable maximum (e.g., 10 years = 3650 days)

### Edge Cases

| Scenario | Handling |
|----------|----------|
| No orders | Return 0 |
| Future first order date | Return 0, log warning |
| Very old customer (>10 years) | Cap at 3650 days |

---

## Task 38: Create Frequency Feature

### Objective
Calculate average number of orders per month for the customer.

### Complexity: Low

### Feature Specification

| Property | Value |
|----------|-------|
| Feature Name | `order_frequency` |
| Data Type | Float |
| Unit | Orders per month |
| Precision | 2 decimal places |
| Minimum Value | 0.0 |
| Null Handling | Use 0.0 for customers with no orders |

### Calculation Logic

```
tenure_months = max(customer_tenure_days / 30.44, 1)  # Avoid division by zero
order_frequency = total_orders / tenure_months
```

### Dependencies

| Required Feature | Purpose |
|------------------|---------|
| `customer_tenure_days` | Calculate months active |
| `total_orders` | Count orders to divide |

### Implementation Steps

1. **Get total order count**
   - Count all completed orders for customer
   - Exclude cancelled and returned orders

2. **Calculate tenure in months**
   - Convert tenure days to months (divide by 30.44)
   - Use minimum of 1 month to avoid division by zero

3. **Compute frequency**
   - Divide total orders by tenure months
   - Round to 2 decimal places

### Frequency Interpretation

| Frequency Range | Customer Type |
|-----------------|---------------|
| > 4.0 | Very frequent buyer |
| 2.0 - 4.0 | Regular buyer |
| 1.0 - 2.0 | Occasional buyer |
| 0.5 - 1.0 | Infrequent buyer |
| < 0.5 | Rare buyer |

---

## Task 39: Create AOV Feature

### Objective
Calculate the average order value (total spend divided by order count).

### Complexity: Low

### Feature Specification

| Property | Value |
|----------|-------|
| Feature Name | `average_order_value` |
| Data Type | Float |
| Currency | LKR (Sri Lankan Rupee) |
| Precision | 2 decimal places |
| Minimum Value | 0.0 |
| Null Handling | Use 0.0 for customers with no orders |

### Calculation Logic

```
average_order_value = total_spend / total_orders
```

### Data Source Query Requirements

| Metric | Query |
|--------|-------|
| Total Spend | SUM(order_total) WHERE customer_id = target |
| Total Orders | COUNT(*) WHERE customer_id = target |

### Implementation Steps

1. **Calculate total spend**
   - Sum all order totals for customer
   - Use completed orders only
   - Apply any refund adjustments

2. **Get order count**
   - Count completed orders
   - Exclude test orders if applicable

3. **Compute AOV**
   - Divide total spend by order count
   - Handle zero orders (return 0.0)
   - Round to 2 decimal places

### AOV Benchmarks (Sri Lanka Market)

| AOV Range (LKR) | Segment |
|-----------------|---------|
| > 25,000 | Premium |
| 10,000 - 25,000 | Mid-range |
| 5,000 - 10,000 | Standard |
| < 5,000 | Budget |

---

## Task 40: Create Category Feature

### Objective
Measure category diversity - the number of unique product categories purchased.

### Complexity: Low

### Feature Specification

| Property | Value |
|----------|-------|
| Feature Name | `category_diversity` |
| Data Type | Integer |
| Unit | Unique categories |
| Minimum Value | 0 |
| Maximum Value | Total categories in catalog |
| Null Handling | Use 0 for customers with no orders |

### Calculation Logic

```
category_diversity = COUNT(DISTINCT category_id) FROM order_items WHERE customer_id = target
```

### Data Source Query Requirements

| Source | Table | Field |
|--------|-------|-------|
| Primary | order_items | product_id |
| Join | products | category_id |
| Filter | orders | customer_id = target |
| Aggregation | COUNT(DISTINCT) | Unique categories |

### Implementation Steps

1. **Retrieve purchased products**
   - Get all products from customer's orders
   - Join with products table for category info

2. **Count unique categories**
   - Apply DISTINCT to category IDs
   - Return count

3. **Normalize if needed**
   - Optionally normalize by total catalog categories
   - `normalized_diversity = diversity / total_categories`

### Category Diversity Interpretation

| Diversity Score | Customer Profile |
|-----------------|------------------|
| 1 | Single-category buyer |
| 2-3 | Focused buyer |
| 4-6 | Moderate explorer |
| 7-10 | Category explorer |
| > 10 | Diverse shopper |

---

## Task 41: Create Channel Feature

### Objective
Encode customer acquisition channel using one-hot encoding.

### Complexity: Low

### Feature Specification

| Property | Value |
|----------|-------|
| Feature Name | `acquisition_channel` |
| Data Type | Categorical (one-hot encoded) |
| Categories | organic, paid, referral |
| Encoding | 3 binary columns |
| Null Handling | Default to 'organic' |

### One-Hot Encoding Output

| Customer Channel | channel_organic | channel_paid | channel_referral |
|------------------|-----------------|--------------|------------------|
| organic | 1 | 0 | 0 |
| paid | 1 | 0 | 0 |
| referral | 0 | 0 | 1 |
| unknown | 1 | 0 | 0 |

### Data Source

| Source | Table | Field |
|--------|-------|-------|
| Primary | customers | acquisition_channel |
| Fallback | Default to 'organic' if null |

### Implementation Steps

1. **Retrieve acquisition channel**
   - Query customer record for channel field
   - Handle null/missing values with default

2. **Validate channel value**
   - Check against allowed values
   - Map unknown values to 'organic'

3. **Apply one-hot encoding**
   - Create 3 binary columns
   - Set appropriate column to 1

4. **Return encoded features**
   - Include all 3 columns in feature vector
   - Maintain consistent column order

### Channel Distribution (Expected)

| Channel | Typical % |
|---------|-----------|
| Organic | 50-60% |
| Paid | 25-35% |
| Referral | 10-20% |

---

## Task 42: Create XGBoost Model

### Objective
Configure and implement XGBoost regression model for 12-month LTV prediction.

### Complexity: High

### Model Configuration

```
┌─────────────────────────────────────────────────────────────────┐
│                    XGBOOST MODEL ARCHITECTURE                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Input Layer (12+ features)                                      │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ tenure │ freq │ aov │ cat_div │ ch_org │ ch_pd │ ch_ref │    │
│  │  recency  │ total_orders │ total_spend │ return_rate   │    │
│  └─────────────────────────────────────────────────────────┘    │
│                            │                                     │
│                            ▼                                     │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │              XGBRegressor Ensemble                       │    │
│  │                                                          │    │
│  │   Tree 1 ──┐                                             │    │
│  │   Tree 2 ──┼──▶ Weighted Average ──▶ LTV Prediction     │    │
│  │   ...      │                                             │    │
│  │   Tree 100 ┘                                             │    │
│  │                                                          │    │
│  └─────────────────────────────────────────────────────────┘    │
│                            │                                     │
│                            ▼                                     │
│  Output: predicted_ltv_12_months (LKR)                          │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Hyperparameter Configuration

| Parameter | Value | Rationale |
|-----------|-------|-----------|
| `n_estimators` | 100 | Balance between accuracy and training time |
| `max_depth` | 6 | Prevent overfitting on customer data |
| `learning_rate` | 0.1 | Standard learning rate for regression |
| `min_child_weight` | 1 | Default, allows for fine splits |
| `objective` | 'reg:squarederror' | Regression with squared error loss |
| `eval_metric` | 'rmse' | Root Mean Square Error |
| `random_state` | 42 | Reproducibility |
| `n_jobs` | -1 | Use all CPU cores |

### Additional Hyperparameters (Optional Tuning)

| Parameter | Default | Range for Tuning |
|-----------|---------|------------------|
| `subsample` | 0.8 | 0.6 - 1.0 |
| `colsample_bytree` | 0.8 | 0.6 - 1.0 |
| `reg_alpha` | 0 | 0 - 1.0 |
| `reg_lambda` | 1 | 0.5 - 2.0 |
| `gamma` | 0 | 0 - 0.5 |

### Model Implementation Steps

1. **Create model wrapper class**
   - Define LTVXGBoostModel class
   - Encapsulate XGBRegressor with custom logic
   - Include preprocessing pipeline

2. **Configure feature preprocessing**
   - Scale numerical features (StandardScaler)
   - Handle categorical encoding
   - Define feature order for consistency

3. **Implement prediction method**
   - Accept feature vector or DataFrame
   - Apply preprocessing transformations
   - Return prediction with optional confidence

4. **Add model persistence**
   - Save model using joblib or pickle
   - Include metadata (version, training date, features)
   - Version model files with timestamps

5. **Implement feature importance extraction**
   - Extract feature importance scores from trained model
   - Return ranked list of features
   - Use for model interpretability

### Model Artifacts

| Artifact | Format | Purpose |
|----------|--------|---------|
| `ltv_model.joblib` | Joblib pickle | Trained XGBoost model |
| `feature_scaler.joblib` | Joblib pickle | Fitted StandardScaler |
| `model_metadata.json` | JSON | Version, features, training info |
| `feature_importance.json` | JSON | Feature importance rankings |

### Target Variable Definition

| Property | Value |
|----------|-------|
| Target | 12-month future LTV |
| Calculation | Sum of order values in 12 months following observation |
| Currency | LKR (Sri Lankan Rupee) |
| Minimum | 0 |
| Outlier Handling | Cap at 99th percentile |

---

## Task 43: Create Training Pipeline

### Objective
Build end-to-end training pipeline for LTV model with proper data handling and evaluation.

### Complexity: High

### Training Pipeline Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         LTV TRAINING PIPELINE                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌────────────────┐    ┌────────────────┐    ┌────────────────┐             │
│  │  Data Query    │───▶│  Data Clean    │───▶│  Feature Eng   │             │
│  │                │    │                │    │                │             │
│  │ • 12+ months   │    │ • Remove nulls │    │ • Extract all  │             │
│  │ • Complete LTV │    │ • Handle outl  │    │ • Scale/encode │             │
│  │ • Active cust  │    │ • Validate     │    │ • Store scaler │             │
│  └────────────────┘    └────────────────┘    └────────────────┘             │
│           │                                            │                     │
│           │                                            ▼                     │
│           │            ┌────────────────────────────────────────┐           │
│           │            │            Train/Test Split            │           │
│           │            │                                        │           │
│           │            │   ┌──────────────┐  ┌──────────────┐   │           │
│           │            │   │  Train 80%   │  │  Test 20%    │   │           │
│           │            │   │              │  │              │   │           │
│           │            │   │ ~8000 cust   │  │ ~2000 cust   │   │           │
│           │            │   └──────────────┘  └──────────────┘   │           │
│           │            └────────────────────────────────────────┘           │
│           │                         │                │                       │
│           │                         ▼                ▼                       │
│           │            ┌─────────────────┐  ┌─────────────────┐             │
│           │            │  Model Train    │  │   Evaluate      │             │
│           │            │                 │  │                 │             │
│           │            │  XGBRegressor   │─▶│  RMSE, MAE      │             │
│           │            │  100 trees      │  │  R², MAPE       │             │
│           │            └─────────────────┘  └────────┬────────┘             │
│           │                                          │                       │
│           │                                          ▼                       │
│           │                                 ┌─────────────────┐             │
│           │                                 │  Save Model     │             │
│           │                                 │                 │             │
│           │                                 │  • Artifacts    │             │
│           │                                 │  • Metrics      │             │
│           │                                 │  • Metadata     │             │
│           │                                 └─────────────────┘             │
│           │                                                                  │
└───────────┴──────────────────────────────────────────────────────────────────┘
```

### Data Requirements

| Requirement | Value |
|-------------|-------|
| Minimum customer history | 12 months |
| Minimum orders | 2 |
| Data quality | Complete order records |
| Sample size | 10,000+ customers preferred |

### Data Query Criteria

| Filter | Condition |
|--------|-----------|
| First order date | At least 24 months ago |
| Order count | >= 2 orders in first 12 months |
| Active status | Not marked as deleted/inactive |
| Data completeness | All required fields non-null |

### Train/Test Split Configuration

| Parameter | Value |
|-----------|-------|
| Split ratio | 80% train / 20% test |
| Stratification | By LTV quartile |
| Random seed | 42 |
| Shuffle | True |

### Evaluation Metrics

| Metric | Description | Target |
|--------|-------------|--------|
| RMSE | Root Mean Square Error | < 50,000 LKR |
| MAE | Mean Absolute Error | < 35,000 LKR |
| R² | Coefficient of determination | > 0.6 |
| MAPE | Mean Absolute Percentage Error | < 30% |

### Implementation Steps

1. **Create LTVTrainingPipeline class**
   - Initialize with configuration parameters
   - Set up logging for training runs
   - Configure MLflow or similar for experiment tracking

2. **Implement data extraction**
   - Query customers meeting criteria
   - Calculate actual 12-month LTV for each
   - Extract features as of observation date

3. **Build preprocessing pipeline**
   - Create sklearn Pipeline with transformers
   - Handle numerical scaling
   - Apply categorical encoding
   - Save fitted transformers for inference

4. **Execute training**
   - Split data using stratified sampling
   - Train XGBoost model
   - Perform cross-validation (5-fold)
   - Log training metrics

5. **Run evaluation**
   - Calculate all metrics on test set
   - Generate residual plots
   - Create feature importance chart
   - Produce model card with statistics

6. **Save artifacts**
   - Serialize model and transformers
   - Save metrics and metadata
   - Update model registry

### Retraining Schedule

| Aspect | Configuration |
|--------|---------------|
| Frequency | Monthly |
| Trigger | Scheduled job (1st of month) |
| Validation | Automatic comparison with previous model |
| Rollback | Keep last 3 model versions |
| Alerting | Notify if metrics degrade > 10% |

### Cross-Validation Strategy

| Parameter | Value |
|-----------|-------|
| Method | K-Fold |
| Folds | 5 |
| Scoring | Negative MSE |
| Parallel | Yes (n_jobs=-1) |

---

## Task 44: Create LTV Tiers

### Objective
Define and implement LTV tier classification system for Sri Lankan market.

### Complexity: Low

### Tier Definitions (LKR)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           LTV TIER STRUCTURE                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│    PLATINUM                                                                  │
│    ████████████████████████████████████████████████████  > 500,000 LKR      │
│    Top ~5% of customers | Highest value | VIP treatment                      │
│                                                                              │
│    GOLD                                                                      │
│    ██████████████████████████████████████  200,000 - 500,000 LKR            │
│    Top ~15% | High value | Priority support                                  │
│                                                                              │
│    SILVER                                                                    │
│    ████████████████████████  50,000 - 200,000 LKR                           │
│    Middle ~40% | Moderate value | Standard service                           │
│                                                                              │
│    BRONZE                                                                    │
│    ████████████  < 50,000 LKR                                               │
│    Lower ~40% | Entry level | Growth potential                               │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Tier Configuration Table

| Tier | Min LTV (LKR) | Max LTV (LKR) | Priority | Color Code |
|------|---------------|---------------|----------|------------|
| Platinum | 500,001 | Unlimited | 1 | #E5E4E2 |
| Gold | 200,001 | 500,000 | 2 | #FFD700 |
| Silver | 50,001 | 200,000 | 3 | #C0C0C0 |
| Bronze | 0 | 50,000 | 4 | #CD7F32 |

### LTVTierClassifier Class

| Method | Parameters | Returns |
|--------|------------|---------|
| `classify(ltv_value)` | Decimal LTV in LKR | Tier name string |
| `get_tier_info(tier)` | Tier name | TierInfo object |
| `get_all_tiers()` | None | List of tier configurations |
| `validate_tier(tier)` | Tier name | Boolean |

### TierInfo Object

| Field | Type | Description |
|-------|------|-------------|
| `name` | str | Tier name |
| `min_ltv` | Decimal | Minimum LTV threshold |
| `max_ltv` | Decimal | Maximum LTV threshold |
| `priority` | int | Priority ranking (1=highest) |
| `color_code` | str | Hex color for UI |
| `benefits` | list | Associated benefits/features |

### Implementation Steps

1. **Create tier configuration**
   - Define tier thresholds in configuration file
   - Allow for tenant-specific customization
   - Include default values for Sri Lankan market

2. **Implement classifier class**
   - Create LTVTierClassifier with threshold logic
   - Add boundary validation
   - Handle edge cases (exactly on boundary)

3. **Add tier assignment logic**
   - Use upper bound inclusive for tier assignment
   - Example: 500,000 LKR → Gold (not Platinum)
   - Example: 500,001 LKR → Platinum

4. **Create tier benefits mapping**
   - Define what each tier qualifies for
   - Link to marketing and service tiers
   - Expose through API for frontend use

### Tier Benefits Matrix

| Benefit | Bronze | Silver | Gold | Platinum |
|---------|--------|--------|------|----------|
| Priority Support | ❌ | ❌ | ✅ | ✅ |
| Free Shipping | ❌ | ❌ | ✅ | ✅ |
| Exclusive Offers | ❌ | ✅ | ✅ | ✅ |
| Early Access | ❌ | ❌ | ❌ | ✅ |
| Personal Manager | ❌ | ❌ | ❌ | ✅ |
| Discount Level | 0% | 5% | 10% | 15% |

### Tier Distribution Monitoring

| Metric | Expected Range |
|--------|----------------|
| Platinum % | 3-7% |
| Gold % | 12-18% |
| Silver % | 35-45% |
| Bronze % | 35-45% |

---

## Implementation Sequence

### Recommended Order

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    IMPLEMENTATION SEQUENCE                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  WEEK 1: Individual Features (Tasks 37-41)                                   │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  Day 1-2: Task 37 (Tenure) + Task 38 (Frequency)                    │    │
│  │  Day 3: Task 39 (AOV) + Task 40 (Category)                          │    │
│  │  Day 4: Task 41 (Channel encoding)                                  │    │
│  │  Day 5: Integration testing for all features                        │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                  │                                           │
│                                  ▼                                           │
│  WEEK 2: Framework & Model (Tasks 36, 42, 44)                               │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  Day 1-2: Task 36 (Feature Framework) - Combine all features        │    │
│  │  Day 3-4: Task 42 (XGBoost Model) - Configure and implement         │    │
│  │  Day 5: Task 44 (LTV Tiers) - Tier classification                   │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                  │                                           │
│                                  ▼                                           │
│  WEEK 3: Pipeline & Integration (Tasks 43, 35)                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  Day 1-3: Task 43 (Training Pipeline) - Full training workflow      │    │
│  │  Day 4-5: Task 35 (LTVPredictor) - Main prediction class            │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Task Dependencies

| Task | Depends On | Required Before |
|------|------------|-----------------|
| 35 | 36, 42, 44 | API integration |
| 36 | 37, 38, 39, 40, 41 | 43 |
| 37 | None | 36 |
| 38 | 37 | 36 |
| 39 | None | 36 |
| 40 | None | 36 |
| 41 | None | 36 |
| 42 | 36 | 35, 43 |
| 43 | 36, 42 | 35 |
| 44 | None | 35 |

---

## File Structure

### Module Organization

```
backend/apps/ai/ltv/
├── __init__.py
├── predictor.py           # Task 35: LTVPredictor class
├── features/
│   ├── __init__.py
│   ├── extractor.py       # Task 36: Feature extraction framework
│   ├── tenure.py          # Task 37: Tenure feature
│   ├── frequency.py       # Task 38: Frequency feature
│   ├── aov.py             # Task 39: AOV feature
│   ├── category.py        # Task 40: Category diversity
│   └── channel.py         # Task 41: Channel encoding
├── models/
│   ├── __init__.py
│   ├── xgboost_model.py   # Task 42: XGBoost implementation
│   └── training.py        # Task 43: Training pipeline
├── tiers/
│   ├── __init__.py
│   └── classifier.py      # Task 44: Tier classification
├── schemas/
│   ├── __init__.py
│   ├── features.py        # Feature vector schemas
│   └── results.py         # LTVResult schemas
└── tests/
    ├── __init__.py
    ├── test_predictor.py
    ├── test_features.py
    ├── test_model.py
    └── test_tiers.py
```

---

## Testing Requirements

### Unit Test Coverage

| Component | Test Cases |
|-----------|------------|
| Tenure Feature | Calculation accuracy, edge cases, null handling |
| Frequency Feature | Division by zero, new customers, accuracy |
| AOV Feature | Calculation, refunds, zero orders |
| Category Feature | Counting logic, empty orders |
| Channel Feature | One-hot encoding, unknown channels |
| XGBoost Model | Prediction shape, feature order, bounds |
| Tier Classifier | Boundary values, all tiers, invalid inputs |
| Training Pipeline | Data split, metric calculation, artifact saving |
| LTVPredictor | End-to-end prediction, error handling |

### Integration Test Scenarios

| Scenario | Description |
|----------|-------------|
| New customer | Customer with minimal history |
| High-value customer | Platinum tier prediction |
| Multi-channel | Test channel encoding varieties |
| Batch prediction | Multiple customers at once |
| Model reload | Model persistence and loading |

### Performance Benchmarks

| Operation | Target |
|-----------|--------|
| Single prediction | < 100ms |
| Batch prediction (100) | < 2 seconds |
| Feature extraction | < 50ms per customer |
| Model loading | < 1 second |
| Full training | < 30 minutes |

---

## Acceptance Criteria

### Task 35: LTVPredictor Class
- [ ] predict() method returns complete LTVResult
- [ ] Batch prediction supports 1000+ customers
- [ ] Error handling for missing customers
- [ ] Model version tracking implemented

### Task 36: LTV Features Framework
- [ ] 10+ features implemented and documented
- [ ] Batch extraction optimized
- [ ] Feature registry with metadata
- [ ] Missing data handling strategies

### Task 37-41: Individual Features
- [ ] Each feature calculates correctly
- [ ] Edge cases handled
- [ ] Unit tests passing
- [ ] Documentation complete

### Task 42: XGBoost Model
- [ ] Hyperparameters configured as specified
- [ ] Model serialization working
- [ ] Feature importance accessible
- [ ] Prediction within expected bounds

### Task 43: Training Pipeline
- [ ] 80/20 split implemented
- [ ] Cross-validation working
- [ ] All metrics calculated (RMSE, MAE, R², MAPE)
- [ ] Monthly retraining scheduled

### Task 44: LTV Tiers
- [ ] All 4 tiers defined with correct thresholds
- [ ] Classification logic accurate
- [ ] Benefits matrix documented
- [ ] API endpoint returning tier info

---

## Document Summary

| Aspect | Details |
|--------|---------|
| Tasks Covered | 35, 36, 37, 38, 39, 40, 41, 42, 43, 44 |
| Total Complexity | 2 High, 3 Medium, 5 Low |
| ML Library | XGBoost |
| Feature Count | 12+ features |
| Prediction Target | 12-month LTV in LKR |
| Retraining | Monthly |
| Tier Count | 4 (Platinum, Gold, Silver, Bronze) |

---

**Next Document:** [02_Tasks-45-52_LTV-API.md](02_Tasks-45-52_LTV-API.md) - LTV API endpoints, caching, and integration
