# Tasks 45-52: LTV Model and API

> **Phase:** 10 - AI Features & Advanced Capabilities  
> **SubPhase:** 12 - Customer Insights AI (FINAL SUBPHASE)  
> **Group:** C - LTV Prediction  
> **Document:** 02 of 02  
> **Tasks Covered:** 45, 46, 47, 48, 49, 50, 51, 52

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-35-44_Features-Model.md](01_Tasks-35-44_Features-Model.md)
- **→ Next Group:** [../Group-D_Churn-Prediction/](../Group-D_Churn-Prediction/)

---

## Document Overview

This document covers the **LTV prediction output**, **model storage**, **scheduling**, and **API endpoints** for customer lifetime value predictions. Building on the feature engineering from Document 01, this document focuses on generating predictions, storing results, and exposing LTV data through REST APIs.

### Document Scope

| Aspect | Coverage |
|--------|----------|
| **Prediction Output** | 12-month predicted LTV in LKR |
| **Confidence Scoring** | Model uncertainty quantification (0-100%) |
| **Data Persistence** | CustomerLTV and LTVHistory models |
| **Automation** | Weekly Celery beat scheduling |
| **API Endpoints** | Individual LTV lookup and aggregate reports |
| **Verification** | End-to-end pipeline testing |

### Tasks Summary Table

| Task | Title | Complexity | Primary Deliverable |
|------|-------|------------|---------------------|
| 45 | Predicted LTV | Medium | 12-month LTV value in LKR |
| 46 | LTV Confidence | Low | Prediction confidence 0-100% |
| 47 | CustomerLTV Model | Medium | Django model for LTV storage |
| 48 | LTV History | Low | LTVHistory model for tracking |
| 49 | LTV Scheduler | Low | Celery beat weekly schedule |
| 50 | LTV API | Medium | GET endpoint for customer LTV |
| 51 | LTV Report | Medium | GET endpoint for LTV reports |
| 52 | Verify LTV Prediction | Low | Pipeline verification |

---

## Deliverables Structure

```
backend/
└── apps/
    └── customer_insights/
        ├── models/
        │   ├── __init__.py
        │   └── customer_ltv.py          # Task 47, 48
        ├── analytics/
        │   └── ltv_predictor.py         # Task 45, 46
        ├── api/
        │   ├── ltv_views.py             # Task 50, 51
        │   └── ltv_serializers.py       # API serializers
        ├── tasks/
        │   └── ltv_tasks.py             # Task 49
        └── tests/
            └── test_ltv_pipeline.py     # Task 52
```

---

## Task 45: Create Predicted LTV

### Objective

Generate 12-month predicted customer lifetime value in Sri Lankan Rupees (LKR) using the trained XGBoost model from Document 01.

### LTV Prediction Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                    LTV PREDICTION PIPELINE                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────────────┐  │
│  │   Customer   │───▶│   Feature    │───▶│   XGBoost Model      │  │
│  │     Data     │    │  Engineering │    │   Inference          │  │
│  └──────────────┘    └──────────────┘    └──────────────────────┘  │
│                                                   │                 │
│                                                   ▼                 │
│                      ┌──────────────────────────────────────────┐  │
│                      │         Predicted LTV (LKR)              │  │
│                      │         12-Month Projection              │  │
│                      └──────────────────────────────────────────┘  │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Implementation Requirements

#### LTV Predictor Class

Create a predictor class in `ltv_predictor.py`:

| Method | Purpose | Input | Output |
|--------|---------|-------|--------|
| `load_model` | Load trained XGBoost model | Model path | Model instance |
| `prepare_features` | Extract customer features | Customer ID | Feature vector |
| `predict_ltv` | Generate LTV prediction | Feature vector | LTV in LKR |
| `predict_batch` | Batch prediction | Customer list | LTV dict |

#### Prediction Parameters

| Parameter | Value | Description |
|-----------|-------|-------------|
| Prediction Horizon | 12 months | Future value projection |
| Currency | LKR | Sri Lankan Rupees |
| Minimum LTV | 0 | Floor value |
| Rounding | 2 decimals | Decimal precision |
| Batch Size | 1000 | Customers per batch |

### LTV Calculation Outputs

| Output Field | Type | Description |
|--------------|------|-------------|
| `predicted_ltv` | Decimal | 12-month predicted value |
| `currency` | String | Always "LKR" |
| `prediction_date` | DateTime | When prediction was made |
| `valid_until` | DateTime | Prediction expiry (7 days) |

### Tier Classification

Based on predicted LTV, assign customer tiers:

| Tier | LTV Range (LKR) | Percentile |
|------|-----------------|------------|
| **Platinum** | ≥ 500,000 | Top 5% |
| **Gold** | 200,000 - 499,999 | Top 20% |
| **Silver** | 50,000 - 199,999 | Top 50% |
| **Bronze** | < 50,000 | Bottom 50% |

### Acceptance Criteria

| # | Criterion | Validation |
|---|-----------|------------|
| 1 | Predictions generated for all active customers | Count match |
| 2 | LTV values are non-negative | Range check |
| 3 | Currency is always LKR | Value check |
| 4 | Tier assignment follows thresholds | Tier validation |
| 5 | Batch processing completes within timeout | Performance test |

---

## Task 46: Create LTV Confidence

### Objective

Calculate prediction confidence scores (0-100%) to indicate model uncertainty for each LTV prediction.

### Confidence Scoring Architecture

```
┌───────────────────────────────────────────────────────────────┐
│                  CONFIDENCE CALCULATION                        │
├───────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────────────┐                                          │
│  │  XGBoost Trees  │                                          │
│  │   (Ensemble)    │                                          │
│  └────────┬────────┘                                          │
│           │                                                   │
│           ▼                                                   │
│  ┌─────────────────┐    ┌─────────────────┐                   │
│  │  Tree Variance  │───▶│  Normalize to   │                   │
│  │   Calculation   │    │    0-100%       │                   │
│  └─────────────────┘    └────────┬────────┘                   │
│                                  │                            │
│                                  ▼                            │
│                      ┌───────────────────┐                    │
│                      │   Confidence      │                    │
│                      │   Score (0-100)   │                    │
│                      └───────────────────┘                    │
│                                                               │
└───────────────────────────────────────────────────────────────┘
```

### Confidence Calculation Method

#### Ensemble Variance Approach

| Step | Action | Purpose |
|------|--------|---------|
| 1 | Get predictions from all trees | Individual estimates |
| 2 | Calculate standard deviation | Measure disagreement |
| 3 | Normalize to 0-1 range | Standardize scale |
| 4 | Convert to percentage | User-friendly format |
| 5 | Invert (high variance = low confidence) | Intuitive interpretation |

### Confidence Factors

| Factor | Impact on Confidence | Weight |
|--------|---------------------|--------|
| Data completeness | High | 30% |
| Purchase history length | High | 25% |
| Prediction variance | High | 25% |
| Recent activity | Medium | 20% |

### Confidence Score Interpretation

| Score Range | Label | Meaning |
|-------------|-------|---------|
| 90-100% | Very High | Highly reliable prediction |
| 70-89% | High | Reliable prediction |
| 50-69% | Moderate | Use with caution |
| 30-49% | Low | Consider supplemental data |
| 0-29% | Very Low | Insufficient data |

### Implementation Requirements

| Requirement | Description |
|-------------|-------------|
| Score range | Integer 0-100 |
| Calculation method | Tree ensemble variance |
| Data factor | Penalize incomplete profiles |
| History factor | Boost for longer history |
| Caching | Cache scores with predictions |

### Confidence Thresholds for Actions

| Action | Minimum Confidence | Rationale |
|--------|-------------------|-----------|
| Automated marketing | 70% | Reduce false targeting |
| Credit decisions | 80% | High-stakes decisions |
| Reporting inclusion | 50% | Aggregate accuracy |
| Display to users | 30% | Always show with disclaimer |

### Acceptance Criteria

| # | Criterion | Validation |
|---|-----------|------------|
| 1 | Confidence scores between 0-100 | Range check |
| 2 | Integer values only | Type check |
| 3 | Stored alongside LTV predictions | Database join |
| 4 | Lower with sparse data | Logic verification |
| 5 | Variance method implemented | Algorithm review |

---

## Task 47: Create CustomerLTV Model

### Objective

Create a Django model to store LTV predictions with customer associations, tier classifications, and temporal tracking.

### Model Diagram

```
┌──────────────────────────────────────────────────────────────────┐
│                       CustomerLTV Model                          │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  id (UUID)           ──────────────────  Primary Key       │  │
│  ├────────────────────────────────────────────────────────────┤  │
│  │  customer_id         ──────────────────  String (Indexed)  │  │
│  │  predicted_ltv       ──────────────────  Decimal(12,2)     │  │
│  │  tier                ──────────────────  Enum (4 values)   │  │
│  │  confidence          ──────────────────  Integer (0-100)   │  │
│  │  calculated_at       ──────────────────  DateTime          │  │
│  ├────────────────────────────────────────────────────────────┤  │
│  │  Indexes: customer_id, tier, calculated_at                 │  │
│  │  Constraints: confidence 0-100, predicted_ltv >= 0         │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

### Model Fields Specification

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID | Primary Key | Unique identifier |
| `customer_id` | CharField(50) | Indexed, Not Null | Customer reference |
| `predicted_ltv` | DecimalField(12,2) | >= 0 | 12-month LTV in LKR |
| `tier` | CharField(10) | Choices | Platinum/Gold/Silver/Bronze |
| `confidence` | IntegerField | 0-100 | Prediction confidence |
| `calculated_at` | DateTimeField | Auto Now Add | Prediction timestamp |

### Tier Choices Definition

| Choice Value | Display Name | Description |
|--------------|--------------|-------------|
| `platinum` | Platinum | Highest value customers |
| `gold` | Gold | High value customers |
| `silver` | Silver | Medium value customers |
| `bronze` | Bronze | Standard customers |

### Model Configuration

| Setting | Value | Purpose |
|---------|-------|---------|
| `db_table` | `customer_ltv` | Explicit table name |
| `ordering` | `['-calculated_at']` | Latest first |
| `indexes` | customer_id, tier, calculated_at | Query optimization |
| `unique_together` | None (allow history) | Multiple records per customer |

### Database Indexes

| Index Name | Columns | Type | Purpose |
|------------|---------|------|---------|
| `idx_ltv_customer` | customer_id | B-tree | Fast customer lookup |
| `idx_ltv_tier` | tier | B-tree | Tier filtering |
| `idx_ltv_calculated` | calculated_at | B-tree | Time-based queries |
| `idx_ltv_cust_date` | customer_id, calculated_at | Composite | Latest per customer |

### Model Methods

| Method | Arguments | Returns | Purpose |
|--------|-----------|---------|---------|
| `get_latest_for_customer` | customer_id | CustomerLTV | Latest prediction |
| `get_tier_distribution` | None | Dict | Count per tier |
| `get_average_ltv` | None | Decimal | Overall average |
| `is_recent` | None | Boolean | Within 7 days |

### Manager Methods

| Method | Description |
|--------|-------------|
| `active()` | Predictions within last 7 days |
| `by_tier(tier)` | Filter by tier |
| `top_customers(limit)` | Highest LTV customers |
| `calculate_stats()` | Aggregate statistics |

### Acceptance Criteria

| # | Criterion | Validation |
|---|-----------|------------|
| 1 | All required fields present | Schema check |
| 2 | UUID primary key | Type validation |
| 3 | Confidence constraint 0-100 | Constraint test |
| 4 | LTV non-negative constraint | Constraint test |
| 5 | Indexes created | Database inspection |

---

## Task 48: Create LTV History

### Objective

Create an LTVHistory model to track LTV changes over time, enabling trend analysis and prediction accuracy evaluation.

### LTV History Architecture

```
┌───────────────────────────────────────────────────────────────────┐
│                    LTV HISTORY TRACKING                           │
├───────────────────────────────────────────────────────────────────┤
│                                                                   │
│   Week 1        Week 2        Week 3        Week 4                │
│  ┌──────┐      ┌──────┐      ┌──────┐      ┌──────┐              │
│  │ LTV  │      │ LTV  │      │ LTV  │      │ LTV  │              │
│  │ 150K │──────│ 155K │──────│ 160K │──────│ 158K │              │
│  └──────┘      └──────┘      └──────┘      └──────┘              │
│     │            │            │            │                      │
│     ▼            ▼            ▼            ▼                      │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │                  LTVHistory Table                         │    │
│  │  Records: [Week1], [Week2], [Week3], [Week4]              │    │
│  └──────────────────────────────────────────────────────────┘    │
│                                                                   │
└───────────────────────────────────────────────────────────────────┘
```

### LTVHistory Model Fields

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID | Primary Key | Unique identifier |
| `customer_id` | CharField(50) | Indexed, Not Null | Customer reference |
| `ltv_value` | DecimalField(12,2) | >= 0 | LTV at this point |
| `previous_ltv` | DecimalField(12,2) | >= 0, Nullable | Previous LTV value |
| `ltv_change` | DecimalField(12,2) | Nullable | Absolute change |
| `ltv_change_percent` | DecimalField(5,2) | Nullable | Percentage change |
| `tier` | CharField(10) | Choices | Tier at this time |
| `previous_tier` | CharField(10) | Choices, Nullable | Previous tier |
| `tier_changed` | BooleanField | Default False | Tier change flag |
| `confidence` | IntegerField | 0-100 | Confidence at time |
| `recorded_at` | DateTimeField | Auto Now Add | Record timestamp |

### History Record Structure

```
┌────────────────────────────────────────────────────────────────┐
│                    LTVHistory Record                            │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  Current Snapshot          │  Previous Values                  │
│  ──────────────────        │  ────────────────                  │
│  ltv_value: 165,000        │  previous_ltv: 150,000             │
│  tier: Gold                │  previous_tier: Silver             │
│  confidence: 85            │                                    │
│                            │                                    │
│  Computed Fields           │                                    │
│  ──────────────────        │                                    │
│  ltv_change: +15,000       │                                    │
│  ltv_change_percent: +10%  │                                    │
│  tier_changed: True        │                                    │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

### History Tracking Logic

| Event | Action | Fields Updated |
|-------|--------|----------------|
| New prediction | Create history record | All current fields |
| LTV increase | Record change | ltv_change (+), percent |
| LTV decrease | Record change | ltv_change (-), percent |
| Tier upgrade | Flag change | tier_changed = True |
| Tier downgrade | Flag change | tier_changed = True |
| No change | Still record | For continuity |

### Query Patterns

| Query | Purpose | Index Used |
|-------|---------|------------|
| Last N records for customer | Show trend | customer_id, recorded_at |
| Tier changes in period | Track movements | tier_changed, recorded_at |
| Significant LTV changes | Alert detection | ltv_change_percent |
| Weekly snapshots | Reporting | recorded_at |

### Retention Policy

| Age | Action | Rationale |
|-----|--------|-----------|
| 0-90 days | Keep all | Recent analysis |
| 91-365 days | Keep monthly | Medium-term trends |
| 1-3 years | Keep quarterly | Long-term patterns |
| > 3 years | Delete | Storage management |

### Acceptance Criteria

| # | Criterion | Validation |
|---|-----------|------------|
| 1 | History created on each LTV calculation | Record count |
| 2 | Change values calculated correctly | Math verification |
| 3 | Tier changes flagged | Flag validation |
| 4 | Retention policy enforced | Old record check |
| 5 | Query performance acceptable | < 100ms |

---

## Task 49: Create LTV Scheduler

### Objective

Implement a Celery beat schedule to automatically run LTV predictions weekly on Sunday, ensuring fresh predictions for the upcoming week.

### Scheduler Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                   LTV CELERY SCHEDULER                            │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────┐                                                 │
│  │ Celery Beat │                                                 │
│  │  (Sunday    │                                                 │
│  │   2:00 AM)  │                                                 │
│  └──────┬──────┘                                                 │
│         │                                                        │
│         ▼                                                        │
│  ┌─────────────────────────────────────────────────────┐        │
│  │          calculate_all_customer_ltv Task            │        │
│  └─────────────────────────────────────────────────────┘        │
│         │                                                        │
│         ├──────────────┬──────────────┬──────────────┐          │
│         ▼              ▼              ▼              ▼          │
│  ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌───────────┐    │
│  │  Batch 1  │  │  Batch 2  │  │  Batch 3  │  │  Batch N  │    │
│  │  (1000)   │  │  (1000)   │  │  (1000)   │  │  (1000)   │    │
│  └───────────┘  └───────────┘  └───────────┘  └───────────┘    │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

### Celery Beat Configuration

| Setting | Value | Description |
|---------|-------|-------------|
| Schedule Name | `calculate-ltv-weekly` | Unique identifier |
| Task | `customer_insights.tasks.calculate_all_customer_ltv` | Task path |
| Schedule | `crontab(hour=2, minute=0, day_of_week=0)` | Sunday 2:00 AM |
| Timezone | `Asia/Colombo` | Sri Lanka timezone |
| Enabled | True | Active by default |

### Task Definition

| Task | Description |
|------|-------------|
| `calculate_all_customer_ltv` | Main orchestration task |
| `calculate_customer_ltv_batch` | Batch processing task |
| `cleanup_old_ltv_history` | Retention enforcement |
| `notify_ltv_completion` | Completion notification |

### Task Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `batch_size` | Integer | 1000 | Customers per batch |
| `parallel_batches` | Integer | 4 | Concurrent batches |
| `timeout` | Integer | 3600 | Task timeout (seconds) |
| `retry_count` | Integer | 3 | Max retries on failure |
| `retry_delay` | Integer | 300 | Delay between retries |

### Execution Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    WEEKLY LTV CALCULATION                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Step 1: Get Active Customers                                   │
│  ────────────────────────────                                   │
│  Query all customers with activity in last 12 months            │
│                                                                 │
│  Step 2: Create Batches                                         │
│  ────────────────────────────                                   │
│  Divide customers into batches of 1000                          │
│                                                                 │
│  Step 3: Dispatch Batch Tasks                                   │
│  ────────────────────────────                                   │
│  Use Celery group for parallel processing                       │
│                                                                 │
│  Step 4: Process Each Batch                                     │
│  ────────────────────────────                                   │
│  Calculate features → Predict LTV → Store results               │
│                                                                 │
│  Step 5: Cleanup Old History                                    │
│  ────────────────────────────                                   │
│  Apply retention policy to LTVHistory                           │
│                                                                 │
│  Step 6: Send Notifications                                     │
│  ────────────────────────────                                   │
│  Notify admins of completion/errors                             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Error Handling

| Error Type | Action | Notification |
|------------|--------|--------------|
| Database connection | Retry with backoff | After 3 failures |
| Model loading | Fail task | Immediate |
| Batch failure | Continue others | Log error |
| Timeout | Retry once | After failure |

### Monitoring Metrics

| Metric | Description | Alert Threshold |
|--------|-------------|-----------------|
| `ltv_calculation_duration` | Total execution time | > 4 hours |
| `ltv_customers_processed` | Customer count | < expected |
| `ltv_batch_failures` | Failed batches | > 0 |
| `ltv_average_confidence` | Mean confidence | < 50% |

### Acceptance Criteria

| # | Criterion | Validation |
|---|-----------|------------|
| 1 | Runs every Sunday at 2 AM | Schedule verification |
| 2 | All active customers processed | Count comparison |
| 3 | Errors logged and notified | Log inspection |
| 4 | Completes within 4 hours | Duration check |
| 5 | History cleanup executed | Old record count |

---

## Task 50: Create LTV API

### Objective

Create a REST API endpoint to retrieve LTV details for a specific customer, returning prediction, tier, confidence, and historical trend.

### API Endpoint Specification

```
┌──────────────────────────────────────────────────────────────────┐
│                    LTV API ENDPOINT                              │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  GET /api/insights/ltv/{customer_id}                             │
│                                                                  │
│  Headers:                                                        │
│  ────────                                                        │
│  Authorization: Bearer <token>                                   │
│  Content-Type: application/json                                  │
│                                                                  │
│  Path Parameters:                                                │
│  ────────────────                                                │
│  customer_id: string (required)                                  │
│                                                                  │
│  Query Parameters:                                               │
│  ─────────────────                                               │
│  include_history: boolean (default: false)                       │
│  history_limit: integer (default: 10, max: 52)                   │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

### Request Flow

```
┌───────────────────────────────────────────────────────────────────┐
│                       API REQUEST FLOW                            │
├───────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Client                    Server                    Database     │
│    │                         │                          │         │
│    │── GET /ltv/{id} ───────▶│                          │         │
│    │                         │                          │         │
│    │                         │── Validate Token ────────│         │
│    │                         │                          │         │
│    │                         │── Query CustomerLTV ────▶│         │
│    │                         │◀─── LTV Record ──────────│         │
│    │                         │                          │         │
│    │                         │── Query LTVHistory? ────▶│         │
│    │                         │◀─── History Records ─────│         │
│    │                         │                          │         │
│    │◀─── JSON Response ──────│                          │         │
│    │                         │                          │         │
└───────────────────────────────────────────────────────────────────┘
```

### Response Structure

| Field | Type | Description |
|-------|------|-------------|
| `customer_id` | String | Customer identifier |
| `predicted_ltv` | Decimal | 12-month LTV in LKR |
| `currency` | String | Always "LKR" |
| `tier` | String | Platinum/Gold/Silver/Bronze |
| `tier_display` | String | Human-readable tier |
| `confidence` | Integer | 0-100 confidence score |
| `confidence_label` | String | Very High/High/Moderate/Low/Very Low |
| `calculated_at` | DateTime | ISO 8601 timestamp |
| `valid_until` | DateTime | Prediction expiry |
| `history` | Array | Optional historical records |

### Response Example Structure

```
┌──────────────────────────────────────────────────────────────────┐
│                    RESPONSE STRUCTURE                            │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  {                                                               │
│    "customer_id": "...",                                         │
│    "predicted_ltv": 245000.00,                                   │
│    "currency": "LKR",                                            │
│    "tier": "gold",                                               │
│    "tier_display": "Gold",                                       │
│    "confidence": 85,                                             │
│    "confidence_label": "High",                                   │
│    "calculated_at": "2026-01-25T02:15:00Z",                      │
│    "valid_until": "2026-02-01T02:15:00Z",                        │
│    "history": [                                                  │
│      { "date": "...", "ltv": 240000, "tier": "gold" },           │
│      { "date": "...", "ltv": 235000, "tier": "gold" },           │
│      ...                                                         │
│    ]                                                             │
│  }                                                               │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

### Error Responses

| Status Code | Scenario | Response Body |
|-------------|----------|---------------|
| 400 | Invalid customer_id format | `{"error": "invalid_customer_id", "message": "..."}` |
| 401 | Missing/invalid token | `{"error": "unauthorized", "message": "..."}` |
| 403 | Insufficient permissions | `{"error": "forbidden", "message": "..."}` |
| 404 | Customer not found | `{"error": "not_found", "message": "..."}` |
| 404 | No LTV prediction available | `{"error": "no_prediction", "message": "..."}` |
| 500 | Internal error | `{"error": "internal_error", "message": "..."}` |

### Permission Requirements

| Permission | Description |
|------------|-------------|
| `view_customer_ltv` | Required to access endpoint |
| `view_any_customer` | Access any customer's LTV |
| Tenant isolation | Only own tenant's customers |

### Caching Strategy

| Cache Key | TTL | Invalidation |
|-----------|-----|--------------|
| `ltv:{tenant}:{customer_id}` | 1 hour | On new calculation |
| `ltv_history:{tenant}:{customer_id}` | 6 hours | On new history entry |

### Acceptance Criteria

| # | Criterion | Validation |
|---|-----------|------------|
| 1 | Returns 200 with valid LTV data | Response check |
| 2 | History included when requested | Field presence |
| 3 | Proper error codes returned | Error testing |
| 4 | Authentication required | 401 without token |
| 5 | Tenant isolation enforced | Cross-tenant test |

---

## Task 51: Create LTV Report

### Objective

Create an API endpoint to retrieve aggregate LTV statistics including tier distribution, average LTV, total predicted value, and top customers.

### Report Endpoint Specification

```
┌──────────────────────────────────────────────────────────────────┐
│                    LTV REPORT ENDPOINT                           │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  GET /api/insights/ltv/report                                    │
│                                                                  │
│  Headers:                                                        │
│  ────────                                                        │
│  Authorization: Bearer <token>                                   │
│  Content-Type: application/json                                  │
│                                                                  │
│  Query Parameters:                                               │
│  ─────────────────                                               │
│  top_count: integer (default: 10, max: 100)                      │
│  min_confidence: integer (default: 0, max: 100)                  │
│  tier: string (optional, filter by tier)                         │
│  include_trends: boolean (default: false)                        │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

### Report Components

```
┌───────────────────────────────────────────────────────────────────┐
│                    LTV REPORT STRUCTURE                           │
├───────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                    TIER DISTRIBUTION                        │ │
│  ├─────────────────────────────────────────────────────────────┤ │
│  │  Platinum: 150 (5%)   │  Gold: 450 (15%)                    │ │
│  │  Silver: 900 (30%)    │  Bronze: 1500 (50%)                 │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                    AGGREGATE METRICS                        │ │
│  ├─────────────────────────────────────────────────────────────┤ │
│  │  Total Customers: 3,000                                     │ │
│  │  Average LTV: LKR 125,500                                   │ │
│  │  Median LTV: LKR 85,000                                     │ │
│  │  Total Predicted: LKR 376,500,000                           │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                    TOP CUSTOMERS                            │ │
│  ├─────────────────────────────────────────────────────────────┤ │
│  │  1. Customer A: LKR 1,250,000 (Platinum)                    │ │
│  │  2. Customer B: LKR 980,000 (Platinum)                      │ │
│  │  3. Customer C: LKR 875,000 (Platinum)                      │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                   │
└───────────────────────────────────────────────────────────────────┘
```

### Response Fields

| Section | Field | Type | Description |
|---------|-------|------|-------------|
| **summary** | `total_customers` | Integer | Customers with predictions |
| | `avg_ltv` | Decimal | Mean LTV value |
| | `median_ltv` | Decimal | Median LTV value |
| | `total_predicted` | Decimal | Sum of all LTV |
| | `avg_confidence` | Integer | Mean confidence |
| **tier_distribution** | `platinum` | Object | Count, percentage, avg_ltv |
| | `gold` | Object | Count, percentage, avg_ltv |
| | `silver` | Object | Count, percentage, avg_ltv |
| | `bronze` | Object | Count, percentage, avg_ltv |
| **top_customers** | Array | Object[] | Highest LTV customers |
| **trends** | `week_over_week` | Object | Optional trend data |

### Tier Distribution Object

| Field | Type | Description |
|-------|------|-------------|
| `count` | Integer | Customers in tier |
| `percentage` | Decimal | Percent of total |
| `avg_ltv` | Decimal | Average LTV in tier |
| `total_ltv` | Decimal | Sum of LTV in tier |
| `min_ltv` | Decimal | Minimum in tier |
| `max_ltv` | Decimal | Maximum in tier |

### Top Customer Object

| Field | Type | Description |
|-------|------|-------------|
| `rank` | Integer | Position (1-based) |
| `customer_id` | String | Customer identifier |
| `predicted_ltv` | Decimal | LTV value |
| `tier` | String | Customer tier |
| `confidence` | Integer | Confidence score |
| `ltv_change` | Decimal | Week-over-week change |

### Performance Optimization

| Technique | Implementation |
|-----------|----------------|
| Materialized aggregates | Pre-calculate tier counts |
| Cached results | Redis cache with 30-min TTL |
| Limit top customers | Cap at 100 maximum |
| Async calculation | Background task for heavy queries |

### Permission Requirements

| Permission | Access Level |
|------------|--------------|
| `view_ltv_report` | Required for endpoint |
| `view_all_customers` | See all customer details |
| `view_limited_report` | Summary only, no customer list |

### Acceptance Criteria

| # | Criterion | Validation |
|---|-----------|------------|
| 1 | Tier distribution accurate | Count verification |
| 2 | Averages calculated correctly | Math check |
| 3 | Top customers sorted by LTV | Order verification |
| 4 | Responds within 2 seconds | Performance test |
| 5 | Filters applied correctly | Filter testing |

---

## Task 52: Verify LTV Prediction

### Objective

Verify the entire LTV prediction pipeline works correctly end-to-end, from feature engineering through API responses.

### Verification Architecture

```
┌───────────────────────────────────────────────────────────────────┐
│                   LTV PIPELINE VERIFICATION                       │
├───────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────┐   ┌─────────────┐   ┌─────────────┐             │
│  │   Feature   │──▶│    Model    │──▶│  Database   │             │
│  │ Engineering │   │ Prediction  │   │   Storage   │             │
│  └─────────────┘   └─────────────┘   └─────────────┘             │
│        │                 │                 │                      │
│        ▼                 ▼                 ▼                      │
│  ┌─────────────┐   ┌─────────────┐   ┌─────────────┐             │
│  │   Verify    │   │   Verify    │   │   Verify    │             │
│  │  Features   │   │ Predictions │   │   Models    │             │
│  └─────────────┘   └─────────────┘   └─────────────┘             │
│                                                                   │
│        ┌─────────────────────────────────────┐                    │
│        │         ┌─────────────┐             │                    │
│        │         │   Verify    │             │                    │
│        │         │    APIs     │             │                    │
│        │         └─────────────┘             │                    │
│        │                                     │                    │
│        │       Integration Tests             │                    │
│        └─────────────────────────────────────┘                    │
│                                                                   │
└───────────────────────────────────────────────────────────────────┘
```

### Test Categories

| Category | Test Count | Coverage |
|----------|------------|----------|
| Unit Tests | 25+ | Individual functions |
| Integration Tests | 15+ | Component interactions |
| API Tests | 20+ | Endpoint behavior |
| Performance Tests | 5+ | Speed and load |
| End-to-End Tests | 5+ | Full pipeline |

### Unit Test Coverage

| Component | Tests |
|-----------|-------|
| Feature extraction | 8 tests |
| LTV calculation | 5 tests |
| Confidence scoring | 4 tests |
| Tier classification | 4 tests |
| Model persistence | 4 tests |

### Integration Test Scenarios

| Scenario | Verification Points |
|----------|---------------------|
| New customer LTV | Features → Model → Storage → API |
| LTV update | Scheduler → Calculation → History |
| Tier change | LTV change → Tier update → History flag |
| API response | Request → Auth → Query → Response |
| Report generation | Aggregation → Caching → Response |

### API Test Cases

| Test Case | Method | Expected Result |
|-----------|--------|-----------------|
| Valid customer LTV | GET | 200 with data |
| Invalid customer ID | GET | 400 error |
| Customer not found | GET | 404 error |
| No prediction | GET | 404 with message |
| Unauthorized access | GET | 401 error |
| Report generation | GET | 200 with stats |
| Report with filters | GET | Filtered results |

### End-to-End Test Flow

```
┌───────────────────────────────────────────────────────────────────┐
│                    E2E TEST SEQUENCE                              │
├───────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Step 1: Setup Test Data                                          │
│  ───────────────────────                                          │
│  Create test customers with known purchase history                │
│                                                                   │
│  Step 2: Run Feature Engineering                                  │
│  ───────────────────────────────                                  │
│  Generate features for test customers                             │
│                                                                   │
│  Step 3: Execute Predictions                                      │
│  ───────────────────────────                                      │
│  Run LTV model on test customers                                  │
│                                                                   │
│  Step 4: Verify Storage                                           │
│  ─────────────────────                                            │
│  Check CustomerLTV and LTVHistory records                         │
│                                                                   │
│  Step 5: Test API Endpoints                                       │
│  ─────────────────────────                                        │
│  Verify individual and report APIs                                │
│                                                                   │
│  Step 6: Verify Scheduler                                         │
│  ───────────────────────                                          │
│  Trigger scheduled task and verify execution                      │
│                                                                   │
│  Step 7: Cleanup                                                  │
│  ────────                                                         │
│  Remove test data                                                 │
│                                                                   │
└───────────────────────────────────────────────────────────────────┘
```

### Performance Benchmarks

| Metric | Target | Maximum |
|--------|--------|---------|
| Single prediction | < 100ms | 250ms |
| Batch (1000 customers) | < 30s | 60s |
| Full recalculation (10K) | < 10min | 30min |
| API response time | < 200ms | 500ms |
| Report generation | < 2s | 5s |

### Verification Checklist

| # | Verification Item | Pass Criteria |
|---|-------------------|---------------|
| 1 | Features extracted correctly | Expected values match |
| 2 | Model loads without errors | No exceptions |
| 3 | Predictions are reasonable | Within expected range |
| 4 | Confidence scores valid | 0-100 range |
| 5 | Tier assignments correct | Match thresholds |
| 6 | CustomerLTV records created | Count matches |
| 7 | LTVHistory records created | History present |
| 8 | Individual API works | Returns correct data |
| 9 | Report API works | All sections present |
| 10 | Scheduler executes | Task completes |
| 11 | Error handling works | Proper error responses |
| 12 | Tenant isolation enforced | Cross-tenant blocked |

### Test Data Requirements

| Data Type | Count | Purpose |
|-----------|-------|---------|
| High-value customers | 10 | Platinum tier testing |
| Medium-value customers | 30 | Gold/Silver testing |
| Low-value customers | 60 | Bronze tier testing |
| New customers | 20 | Low-confidence testing |
| Inactive customers | 10 | Edge case handling |

### Acceptance Criteria

| # | Criterion | Validation |
|---|-----------|------------|
| 1 | All unit tests pass | 100% pass rate |
| 2 | All integration tests pass | 100% pass rate |
| 3 | All API tests pass | 100% pass rate |
| 4 | Performance within targets | Benchmark results |
| 5 | E2E tests complete successfully | Full pipeline verified |

---

## Model Relationship Diagram

```
┌───────────────────────────────────────────────────────────────────────┐
│                    LTV MODEL RELATIONSHIPS                            │
├───────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌─────────────────┐         ┌─────────────────────────────────────┐ │
│  │    Customer     │         │           CustomerLTV               │ │
│  │    (External)   │◄────────│  - id (UUID, PK)                    │ │
│  │                 │ 1     N │  - customer_id (FK)                 │ │
│  │  - id           │         │  - predicted_ltv (Decimal)          │ │
│  │  - name         │         │  - tier (Enum)                      │ │
│  │  - email        │         │  - confidence (Int)                 │ │
│  └─────────────────┘         │  - calculated_at (DateTime)         │ │
│                              └──────────────┬──────────────────────┘ │
│                                             │                        │
│                                             │ 1                      │
│                                             │                        │
│                                             ▼ N                      │
│                              ┌─────────────────────────────────────┐ │
│                              │           LTVHistory                │ │
│                              │  - id (UUID, PK)                    │ │
│                              │  - customer_id (String)             │ │
│                              │  - ltv_value (Decimal)              │ │
│                              │  - previous_ltv (Decimal, Nullable) │ │
│                              │  - ltv_change (Decimal, Nullable)   │ │
│                              │  - tier (Enum)                      │ │
│                              │  - tier_changed (Boolean)           │ │
│                              │  - recorded_at (DateTime)           │ │
│                              └─────────────────────────────────────┘ │
│                                                                       │
└───────────────────────────────────────────────────────────────────────┘
```

---

## API Summary

### Endpoint Overview

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/insights/ltv/{customer_id}` | GET | Individual customer LTV |
| `/api/insights/ltv/report` | GET | Aggregate LTV statistics |

### Authentication

All endpoints require Bearer token authentication and appropriate permissions.

### Rate Limiting

| Endpoint | Rate Limit | Window |
|----------|------------|--------|
| Individual LTV | 100 req/min | Per user |
| LTV Report | 10 req/min | Per user |

---

## Dependencies

### Internal Dependencies

| Dependency | Purpose |
|------------|---------|
| Document 01 (Tasks 35-44) | Feature engineering, model training |
| Group A (Data Preparation) | Base customer data |
| Group B (Segmentation) | Customer segments |

### External Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| Django REST Framework | 3.14+ | API framework |
| Celery | 5.3+ | Task scheduling |
| Redis | 7.0+ | Caching |
| XGBoost | 1.7+ | ML predictions |

---

## Completion Checklist

| Task | Deliverable | Status |
|------|-------------|--------|
| 45 | Predicted LTV output | ☐ Pending |
| 46 | Confidence scoring | ☐ Pending |
| 47 | CustomerLTV model | ☐ Pending |
| 48 | LTVHistory model | ☐ Pending |
| 49 | Celery scheduler | ☐ Pending |
| 50 | Individual LTV API | ☐ Pending |
| 51 | LTV Report API | ☐ Pending |
| 52 | Pipeline verification | ☐ Pending |

---

## Next Steps

After completing all tasks in this document:

1. **Proceed to Group D:** [Churn Prediction](../Group-D_Churn-Prediction/)
2. **Integration Testing:** Verify LTV integrates with segmentation
3. **Documentation:** Update API documentation
4. **Monitoring:** Set up LTV pipeline dashboards

---

*Document 02 of 02 - Group C: LTV Prediction*
