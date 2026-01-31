# Tasks 09-16: Scheduler and Data Cleanup

> **Phase:** 10 - AI Features & Advanced Capabilities  
> **SubPhase:** 12 - Customer Insights AI (FINAL SUBPHASE)  
> **Group:** A - Data Preparation  
> **Document:** 02 of 02  
> **Tasks Covered:** 09, 10, 11, 12, 13, 14, 15, 16

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-01-08_Metrics-Model.md](01_Tasks-01-08_Metrics-Model.md)
- **→ Next Group:** [../Group-B_RFM-Segmentation/](../Group-B_RFM-Segmentation/)

---

## Document Overview

This document covers the remaining data preparation tasks for Customer Insights AI, focusing on behavioral pattern metrics, automated scheduling, historical tracking, and data quality cleanup. These tasks complete the foundation required for RFM segmentation and AI-powered customer analysis.

### Tasks Summary

| Task | Title | Priority | Effort | Dependencies |
|------|-------|----------|--------|--------------|
| 09 | Order Frequency Calculation | Medium | 3 hours | Task 02, 03 |
| 10 | Product Category Preferences | Medium | 3 hours | Task 02 |
| 11 | Purchase Day Patterns | Low | 2 hours | Task 02 |
| 12 | Time of Day Patterns | Low | 2 hours | Task 02 |
| 13 | Metrics Scheduler Setup | Low | 2 hours | Tasks 09-12 |
| 14 | Historical Snapshots Model | Medium | 4 hours | Task 13 |
| 15 | Data Cleanup (IQR Method) | Low | 3 hours | Task 14 |
| 16 | Data Preparation Verification | Low | 2 hours | All previous |

### Deliverables Structure

```
backend/
└── apps/
    └── customer_insights/
        ├── models/
        │   ├── customer_metrics.py      # Extended with pattern fields
        │   └── customer_metrics_history.py  # NEW: Historical snapshots
        ├── analytics/
        │   ├── aggregator.py            # Extended with pattern methods
        │   └── cleanup.py               # NEW: IQR-based cleanup
        └── tasks/
            └── scheduler.py             # NEW: Celery beat tasks
```

---

## Task 09: Order Frequency Calculation

### Objective

Calculate and store the average number of days between customer orders, providing insight into purchase regularity and customer engagement patterns.

### Formula Definition

```
Average Order Frequency = (Last Order Date - First Order Date) / (Order Count - 1)
```

| Component | Description | Data Type |
|-----------|-------------|-----------|
| Last Order Date | Most recent order timestamp | DateTime |
| First Order Date | Earliest order timestamp | DateTime |
| Order Count | Total number of orders | Integer |
| Result | Average days between orders | Decimal (2 places) |

### Edge Cases

| Scenario | Order Count | Calculation | Result |
|----------|-------------|-------------|--------|
| New customer | 1 | Cannot calculate | NULL |
| Two orders | 2 | (Last - First) / 1 | Days between |
| Multiple orders | 3+ | (Last - First) / (Count - 1) | Average interval |
| Same-day orders | 2+ | Days = 0 | 0.00 |

### Implementation Steps

#### Step 09.1: Extend CustomerMetrics Model

**Location:** `backend/apps/customer_insights/models/customer_metrics.py`

Add the following field to the CustomerMetrics model:

| Field Name | Field Type | Properties |
|------------|------------|------------|
| `avg_order_frequency_days` | DecimalField | max_digits=8, decimal_places=2, null=True, blank=True |

**Field Description:** Stores the calculated average days between consecutive orders.

#### Step 09.2: Create Frequency Calculator Method

**Location:** `backend/apps/customer_insights/analytics/aggregator.py`

Create a method in the MetricsAggregator class:

| Method | Parameters | Returns |
|--------|------------|---------|
| `calculate_order_frequency` | customer_id: UUID | Decimal or None |

**Method Logic:**

1. Query orders for customer sorted by date
2. Get first order date and last order date
3. Get total order count
4. If order count < 2, return None
5. Calculate: (last_date - first_date).days / (count - 1)
6. Round to 2 decimal places
7. Return result

#### Step 09.3: Integrate with Aggregation Pipeline

Update the main aggregation method to include order frequency calculation:

| Step | Action | Condition |
|------|--------|-----------|
| 1 | Call frequency calculator | After order count calculation |
| 2 | Store result in metrics | Field: avg_order_frequency_days |
| 3 | Handle None gracefully | For single-order customers |

### Validation Rules

| Check | Expected | Action on Failure |
|-------|----------|-------------------|
| Frequency >= 0 | Always true | Log error, set NULL |
| Frequency < 3650 | Reasonable max (10 years) | Cap at maximum |
| Order count >= 2 | Required for calculation | Return NULL |

---

## Task 10: Product Category Preferences

### Objective

Identify and store each customer's top 3 product categories by total spend, enabling category-based targeting and personalized recommendations.

### Data Structure

| Field | Type | Format | Example |
|-------|------|--------|---------|
| `top_categories` | ArrayField | List of UUIDs | ["uuid1", "uuid2", "uuid3"] |

### Calculation Logic

```
┌─────────────────────────────────────────────────────────┐
│              Category Preference Flow                    │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Orders ──► Order Items ──► Products ──► Categories     │
│                  │                           │           │
│                  ▼                           ▼           │
│           Line Total              Category ID            │
│                  │                           │           │
│                  └──────────┬────────────────┘           │
│                             ▼                            │
│                    Aggregate by Category                 │
│                             │                            │
│                             ▼                            │
│                    Sort by Total Spend                   │
│                             │                            │
│                             ▼                            │
│                    Take Top 3 Categories                 │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### Implementation Steps

#### Step 10.1: Add Model Field

**Location:** `backend/apps/customer_insights/models/customer_metrics.py`

| Field Name | Field Type | Properties |
|------------|------------|------------|
| `top_categories` | ArrayField | base_field=UUIDField(), size=3, null=True, blank=True |

**Note:** Requires PostgreSQL ArrayField from django.contrib.postgres.fields

#### Step 10.2: Create Category Aggregation Method

**Location:** `backend/apps/customer_insights/analytics/aggregator.py`

| Method | Parameters | Returns |
|--------|------------|---------|
| `calculate_top_categories` | customer_id: UUID | List[UUID] (max 3) |

**Query Requirements:**

| Join | Table | On Field |
|------|-------|----------|
| 1 | Order | customer_id |
| 2 | OrderItem | order_id |
| 3 | Product | product_id |
| 4 | Category | category_id |

**Aggregation Steps:**

1. Filter orders by customer_id
2. Join to order items, then products, then categories
3. Sum line totals grouped by category_id
4. Order by sum descending
5. Take first 3 category IDs
6. Return as list

#### Step 10.3: Handle Edge Cases

| Scenario | Categories Found | Action |
|----------|------------------|--------|
| No orders | 0 | Return empty list |
| 1 category | 1 | Return list with 1 item |
| 2 categories | 2 | Return list with 2 items |
| 3+ categories | 3+ | Return top 3 only |

### Category Hierarchy Consideration

| Level | Include | Rationale |
|-------|---------|-----------|
| Primary Category | Yes | Main classification |
| Sub-Category | Optional | More granular targeting |
| Product Type | No | Too specific |

**Recommendation:** Use primary category level for initial implementation.

---

## Task 11: Purchase Day Patterns

### Objective

Identify which days of the week customers prefer to make purchases, stored as an array of day indices for behavioral targeting.

### Day Index Mapping

| Day | Index | Abbreviation |
|-----|-------|--------------|
| Monday | 0 | Mon |
| Tuesday | 1 | Tue |
| Wednesday | 2 | Wed |
| Thursday | 3 | Thu |
| Friday | 4 | Fri |
| Saturday | 5 | Sat |
| Sunday | 6 | Sun |

### Implementation Steps

#### Step 11.1: Add Model Field

**Location:** `backend/apps/customer_insights/models/customer_metrics.py`

| Field Name | Field Type | Properties |
|------------|------------|------------|
| `preferred_days` | ArrayField | base_field=SmallIntegerField(), size=7, null=True, blank=True |

**Validation:** Values must be 0-6 inclusive

#### Step 11.2: Create Day Pattern Method

**Location:** `backend/apps/customer_insights/analytics/aggregator.py`

| Method | Parameters | Returns |
|--------|------------|---------|
| `calculate_preferred_days` | customer_id: UUID | List[int] |

**Calculation Logic:**

1. Query all orders for customer
2. Extract day of week from order date (using database function)
3. Count orders per day of week
4. Sort by count descending
5. Return top 2 days (configurable)

#### Step 11.3: Configuration Options

| Setting | Default | Description |
|---------|---------|-------------|
| `PREFERRED_DAYS_COUNT` | 2 | Number of top days to store |
| `MIN_ORDERS_FOR_PATTERN` | 3 | Minimum orders to establish pattern |

### Pattern Visualization

```
┌──────────────────────────────────────────────────────────┐
│           Weekly Order Distribution                       │
├──────────────────────────────────────────────────────────┤
│                                                           │
│  Mon │████████████████████████ 24%                       │
│  Tue │████████████████ 16%                               │
│  Wed │██████████████ 14%                                 │
│  Thu │████████████ 12%                                   │
│  Fri │██████████████████████ 22%                         │
│  Sat │████████ 8%                                        │
│  Sun │████ 4%                                            │
│                                                           │
│  Result: preferred_days = [0, 4]  (Monday, Friday)       │
│                                                           │
└──────────────────────────────────────────────────────────┘
```

---

## Task 12: Time of Day Patterns

### Objective

Identify preferred shopping hours for each customer, enabling time-targeted marketing and personalized communication scheduling.

### Hour Index Mapping

| Range | Hours | Period |
|-------|-------|--------|
| 0-5 | 0, 1, 2, 3, 4, 5 | Night/Early Morning |
| 6-11 | 6, 7, 8, 9, 10, 11 | Morning |
| 12-17 | 12, 13, 14, 15, 16, 17 | Afternoon |
| 18-23 | 18, 19, 20, 21, 22, 23 | Evening |

### Implementation Steps

#### Step 12.1: Add Model Field

**Location:** `backend/apps/customer_insights/models/customer_metrics.py`

| Field Name | Field Type | Properties |
|------------|------------|------------|
| `preferred_hours` | ArrayField | base_field=SmallIntegerField(), size=24, null=True, blank=True |

**Validation:** Values must be 0-23 inclusive

#### Step 12.2: Create Hour Pattern Method

**Location:** `backend/apps/customer_insights/analytics/aggregator.py`

| Method | Parameters | Returns |
|--------|------------|---------|
| `calculate_preferred_hours` | customer_id: UUID | List[int] |

**Calculation Logic:**

1. Query all orders for customer
2. Extract hour from order timestamp (consider timezone)
3. Count orders per hour
4. Sort by count descending
5. Return top 2 hours (configurable)

#### Step 12.3: Timezone Considerations

| Aspect | Handling |
|--------|----------|
| Storage | Store in UTC |
| Calculation | Convert to tenant timezone |
| Display | Use customer's local timezone |

**Tenant Timezone Source:** From tenant settings table

### Pattern Analysis

```
┌──────────────────────────────────────────────────────────┐
│           Hourly Order Distribution                       │
├──────────────────────────────────────────────────────────┤
│                                                           │
│  00-05 │██ 2%                                            │
│  06-11 │████████████████ 18%                             │
│  12-17 │██████████████████████████████████████ 42%       │
│  18-23 │██████████████████████████████████ 38%           │
│                                                           │
│  Peak Hours: 14:00 (22%), 19:00 (18%)                    │
│  Result: preferred_hours = [14, 19]                       │
│                                                           │
└──────────────────────────────────────────────────────────┘
```

---

## Task 13: Metrics Scheduler Setup

### Objective

Configure Celery Beat to automatically recalculate customer metrics on a daily schedule, ensuring data freshness for AI analysis.

### Scheduler Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                    Celery Beat Scheduler Flow                        │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌─────────────┐    ┌─────────────┐    ┌──────────────────────┐    │
│  │ Celery Beat │───►│ Redis Queue │───►│ Celery Worker        │    │
│  │ (Scheduler) │    │             │    │                      │    │
│  └─────────────┘    └─────────────┘    │ ┌──────────────────┐ │    │
│        │                                │ │ Tenant Iterator  │ │    │
│        │ Triggers at                    │ └────────┬─────────┘ │    │
│        │ 03:00 UTC                      │          │           │    │
│        ▼                                │          ▼           │    │
│  ┌─────────────────┐                    │ ┌──────────────────┐ │    │
│  │ Schedule Entry  │                    │ │ Metrics          │ │    │
│  │ - Daily         │                    │ │ Aggregator       │ │    │
│  │ - 3:00 AM       │                    │ └──────────────────┘ │    │
│  └─────────────────┘                    └──────────────────────┘    │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### Implementation Steps

#### Step 13.1: Create Scheduler Task Module

**Location:** `backend/apps/customer_insights/tasks/scheduler.py`

Create a new module with the following tasks:

| Task Name | Frequency | Time | Description |
|-----------|-----------|------|-------------|
| `aggregate_all_customer_metrics` | Daily | 03:00 UTC | Main aggregation task |
| `aggregate_tenant_metrics` | On-demand | N/A | Per-tenant subtask |
| `aggregate_customer_metrics` | On-demand | N/A | Per-customer subtask |

#### Step 13.2: Configure Celery Beat Schedule

**Location:** `backend/config/celery.py` (or settings)

| Setting | Value | Description |
|---------|-------|-------------|
| Task Name | `customer-insights-daily-aggregation` | Unique identifier |
| Task Path | `apps.customer_insights.tasks.scheduler.aggregate_all_customer_metrics` | Full import path |
| Schedule | `crontab(hour=3, minute=0)` | Daily at 3 AM UTC |
| Options | `{'queue': 'insights'}` | Dedicated queue |

#### Step 13.3: Task Hierarchy

```
aggregate_all_customer_metrics
│
├── For each active tenant:
│   │
│   └── aggregate_tenant_metrics.delay(tenant_id)
│       │
│       └── For each customer with orders:
│           │
│           └── aggregate_customer_metrics.delay(customer_id)
│               │
│               ├── Calculate order frequency
│               ├── Calculate top categories
│               ├── Calculate preferred days
│               ├── Calculate preferred hours
│               └── Update CustomerMetrics record
```

#### Step 13.4: Task Configuration Options

| Option | Value | Purpose |
|--------|-------|---------|
| `rate_limit` | '100/m' | Prevent database overload |
| `soft_time_limit` | 300 | 5-minute timeout per customer |
| `autoretry_for` | (DatabaseError,) | Auto-retry on DB issues |
| `max_retries` | 3 | Maximum retry attempts |
| `retry_backoff` | True | Exponential backoff |

### Monitoring Configuration

| Metric | Alert Threshold | Action |
|--------|-----------------|--------|
| Task Duration | > 4 hours | Alert operations |
| Failed Tasks | > 5% | Investigate errors |
| Queue Depth | > 10,000 | Scale workers |

---

## Task 14: Historical Snapshots Model

### Objective

Create a model to store monthly snapshots of customer metrics, enabling trend analysis, churn prediction, and historical comparisons.

### Model Design

```
┌───────────────────────────────────────────────────────────────────┐
│                 CustomerMetricsHistory Model                       │
├───────────────────────────────────────────────────────────────────┤
│                                                                    │
│  ┌─────────────────┐         ┌─────────────────────────────────┐ │
│  │ CustomerMetrics │ ◄────── │ CustomerMetricsHistory          │ │
│  │ (Current State) │  1:N    │ (Monthly Snapshots)             │ │
│  └─────────────────┘         └─────────────────────────────────┘ │
│                                                                    │
│  Fields:                                                           │
│  - customer (FK)                                                   │
│  - snapshot_date                                                   │
│  - snapshot_month (YYYY-MM)                                        │
│  - All metric fields from CustomerMetrics                          │
│                                                                    │
└───────────────────────────────────────────────────────────────────┘
```

### Implementation Steps

#### Step 14.1: Create History Model

**Location:** `backend/apps/customer_insights/models/customer_metrics_history.py`

| Field | Type | Properties | Description |
|-------|------|------------|-------------|
| `id` | UUIDField | primary_key=True, default=uuid4 | Unique identifier |
| `customer` | ForeignKey | to='customers.Customer', on_delete=CASCADE | Customer reference |
| `snapshot_date` | DateField | auto_now_add=True | When snapshot taken |
| `snapshot_month` | CharField | max_length=7 | Format: YYYY-MM |
| `total_spend` | DecimalField | max_digits=12, decimal_places=2 | Copied from current |
| `order_count` | PositiveIntegerField | | Copied from current |
| `avg_order_value` | DecimalField | max_digits=10, decimal_places=2 | Copied from current |
| `first_order_date` | DateField | null=True | Copied from current |
| `last_order_date` | DateField | null=True | Copied from current |
| `avg_order_frequency_days` | DecimalField | max_digits=8, decimal_places=2, null=True | Copied from current |
| `top_categories` | ArrayField | UUIDField array | Copied from current |
| `preferred_days` | ArrayField | SmallIntegerField array | Copied from current |
| `preferred_hours` | ArrayField | SmallIntegerField array | Copied from current |

#### Step 14.2: Add Model Meta Options

| Option | Value | Purpose |
|--------|-------|---------|
| `unique_together` | [('customer', 'snapshot_month')] | One snapshot per month |
| `ordering` | ['-snapshot_date'] | Most recent first |
| `indexes` | customer, snapshot_month | Query optimization |

#### Step 14.3: Create Snapshot Task

**Location:** `backend/apps/customer_insights/tasks/scheduler.py`

| Task Name | Frequency | Time | Description |
|-----------|-----------|------|-------------|
| `create_monthly_snapshots` | Monthly | 1st day, 04:00 UTC | Create all snapshots |

**Celery Beat Configuration:**

| Setting | Value |
|---------|-------|
| Schedule | `crontab(day_of_month=1, hour=4, minute=0)` |
| Task | `apps.customer_insights.tasks.scheduler.create_monthly_snapshots` |

#### Step 14.4: Snapshot Creation Logic

| Step | Action | Description |
|------|--------|-------------|
| 1 | Get previous month | Calculate YYYY-MM for snapshot_month |
| 2 | Iterate tenants | Process each tenant separately |
| 3 | Iterate customers | Get all CustomerMetrics records |
| 4 | Check existing | Skip if snapshot already exists |
| 5 | Create snapshot | Copy all fields to history record |
| 6 | Log completion | Record success/failure counts |

### Retention Policy

| Duration | Action | Rationale |
|----------|--------|-----------|
| 0-24 months | Keep all | Active analysis period |
| 24-60 months | Keep quarterly | Trend analysis |
| 60+ months | Archive/Delete | Compliance requirements |

---

## Task 15: Data Cleanup (IQR Method)

### Objective

Identify and handle statistical outliers in customer metrics using the Interquartile Range (IQR) method, ensuring AI models receive clean, representative data.

### IQR Method Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                    IQR Outlier Detection                             │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Data Distribution:                                                  │
│                                                                      │
│  ◄─────────────────────────────────────────────────────────────────►│
│  │         │                           │                           │ │
│  │   ▼     │          ▼                │           ▼               │ │
│  │ Outlier │         IQR               │         Outlier           │ │
│  │         │     ◄─────────►           │                           │ │
│  ├─────────┼─────┬─────────┬───────────┼───────────────────────────┤ │
│  │         Q1    │   Q2    │    Q3     │                           │ │
│  │         │     │(Median) │           │                           │ │
│  │         │     │         │           │                           │ │
│  │◄────────┼─────┴─────────┴───────────┼──────────────────────────►│ │
│  │   <Q1-3*IQR                    >Q3+3*IQR                        │ │
│  │  (Lower Bound)                (Upper Bound)                     │ │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### Threshold Configuration

| Metric | IQR Multiplier | Lower Bound | Upper Bound |
|--------|----------------|-------------|-------------|
| `total_spend` | 3.0 | Q1 - 3×IQR | Q3 + 3×IQR |
| `order_count` | 3.0 | Q1 - 3×IQR | Q3 + 3×IQR |
| `avg_order_value` | 3.0 | Q1 - 3×IQR | Q3 + 3×IQR |

**Note:** Using 3×IQR (extreme outliers) rather than 1.5×IQR (mild outliers) to avoid over-aggressive filtering.

### Implementation Steps

#### Step 15.1: Create Cleanup Module

**Location:** `backend/apps/customer_insights/analytics/cleanup.py`

Create a new module with the following components:

| Class/Function | Purpose |
|----------------|---------|
| `OutlierDetector` | Calculate IQR bounds for metrics |
| `DataCleaner` | Flag or adjust outlier records |
| `cleanup_customer_metrics` | Main cleanup function |

#### Step 15.2: IQR Calculation Method

**Method:** `calculate_iqr_bounds`

| Parameter | Type | Description |
|-----------|------|-------------|
| `metric_name` | str | Field to analyze |
| `tenant_id` | UUID | Scope to tenant |

| Return Value | Type | Description |
|--------------|------|-------------|
| `lower_bound` | Decimal | Q1 - 3×IQR |
| `upper_bound` | Decimal | Q3 + 3×IQR |

**Calculation Steps:**

1. Query all CustomerMetrics for tenant
2. Extract values for specified metric
3. Calculate Q1 (25th percentile)
4. Calculate Q3 (75th percentile)
5. Calculate IQR = Q3 - Q1
6. Calculate bounds using 3×IQR multiplier
7. Return bounds tuple

#### Step 15.3: Outlier Handling Strategies

| Strategy | Description | Use Case |
|----------|-------------|----------|
| **Flag** | Mark as outlier, keep original | Audit trail needed |
| **Cap** | Replace with bound value | Preserve record count |
| **Exclude** | Remove from AI analysis | Clean dataset required |

**Recommended:** Flag strategy with exclusion during AI training

#### Step 15.4: Add Outlier Flag Field

**Location:** `backend/apps/customer_insights/models/customer_metrics.py`

| Field Name | Type | Properties |
|------------|------|------------|
| `is_outlier` | BooleanField | default=False |
| `outlier_fields` | ArrayField | CharField array, null=True |
| `outlier_detected_at` | DateTimeField | null=True |

#### Step 15.5: Cleanup Task Integration

**Location:** `backend/apps/customer_insights/tasks/scheduler.py`

Add cleanup task to daily schedule:

| Task Name | Frequency | Time | Order |
|-----------|-----------|------|-------|
| `detect_and_flag_outliers` | Daily | 03:30 UTC | After aggregation |

**Task Flow:**

```
┌───────────────────────────────────────────────────────────────┐
│                  Daily Cleanup Flow                            │
├───────────────────────────────────────────────────────────────┤
│                                                                │
│  03:00 ─► aggregate_all_customer_metrics                      │
│              │                                                 │
│              ▼ (completion trigger)                            │
│  03:30 ─► detect_and_flag_outliers                            │
│              │                                                 │
│              ├── Calculate IQR for total_spend                │
│              ├── Calculate IQR for order_count                │
│              ├── Calculate IQR for avg_order_value            │
│              │                                                 │
│              ▼                                                 │
│           Flag outliers in CustomerMetrics                    │
│              │                                                 │
│              ▼                                                 │
│           Log outlier statistics                              │
│                                                                │
└───────────────────────────────────────────────────────────────┘
```

### Outlier Statistics Logging

| Statistic | Purpose |
|-----------|---------|
| Total records analyzed | Baseline count |
| Outliers detected | Count per metric |
| Outlier percentage | Health indicator |
| Top outlier values | Investigation targets |

---

## Task 16: Data Preparation Verification

### Objective

Verify that all data preparation components are functioning correctly before proceeding to RFM Segmentation (Group B).

### Verification Checklist

#### Model Verification

| Check | Model | Validation |
|-------|-------|------------|
| ☐ | CustomerMetrics | All fields present and correct types |
| ☐ | CustomerMetricsHistory | All fields present and correct types |
| ☐ | CustomerMetrics | Unique constraint on customer field |
| ☐ | CustomerMetricsHistory | Unique constraint on customer + month |

#### Field Verification

| Field | Type | Nullable | Validation |
|-------|------|----------|------------|
| ☐ `total_spend` | Decimal(12,2) | No | >= 0 |
| ☐ `order_count` | PositiveInteger | No | >= 0 |
| ☐ `avg_order_value` | Decimal(10,2) | Yes | >= 0 |
| ☐ `first_order_date` | Date | Yes | <= last_order_date |
| ☐ `last_order_date` | Date | Yes | >= first_order_date |
| ☐ `avg_order_frequency_days` | Decimal(8,2) | Yes | >= 0 |
| ☐ `top_categories` | UUID Array | Yes | Max 3 items |
| ☐ `preferred_days` | Integer Array | Yes | Values 0-6 |
| ☐ `preferred_hours` | Integer Array | Yes | Values 0-23 |
| ☐ `is_outlier` | Boolean | No | True/False |

#### Calculation Verification

| Metric | Test Scenario | Expected Result |
|--------|---------------|-----------------|
| ☐ Order Frequency | Customer with 2 orders, 30 days apart | 30.00 |
| ☐ Order Frequency | Customer with 1 order | NULL |
| ☐ Top Categories | Customer with orders in 5 categories | Top 3 by spend |
| ☐ Preferred Days | Customer with 10 orders across week | Top 2 days |
| ☐ Preferred Hours | Customer with 10 orders across day | Top 2 hours |

#### Scheduler Verification

| Check | Task | Validation |
|-------|------|------------|
| ☐ | Daily Aggregation | Runs at 03:00 UTC |
| ☐ | Outlier Detection | Runs at 03:30 UTC |
| ☐ | Monthly Snapshots | Runs 1st of month at 04:00 UTC |
| ☐ | Task Chaining | Cleanup waits for aggregation |

### Verification Test Scenarios

#### Scenario 1: New Customer

| Step | Action | Expected |
|------|--------|----------|
| 1 | Create customer with 0 orders | No CustomerMetrics record |
| 2 | Create first order | CustomerMetrics created |
| 3 | Check metrics | total_spend > 0, order_count = 1 |
| 4 | Check frequency | NULL (only 1 order) |

#### Scenario 2: Active Customer

| Step | Action | Expected |
|------|--------|----------|
| 1 | Customer with 10 orders over 90 days | Metrics populated |
| 2 | Check frequency | Calculated correctly |
| 3 | Check patterns | Days and hours populated |
| 4 | Run cleanup | Outlier flag set appropriately |

#### Scenario 3: High-Value Customer (Potential Outlier)

| Step | Action | Expected |
|------|--------|----------|
| 1 | Customer with $100,000 total spend | Metrics calculated |
| 2 | Run IQR cleanup | Flagged if exceeds bounds |
| 3 | Check outlier fields | Lists which metrics triggered |

### Data Quality Metrics

| Metric | Target | Alert Threshold |
|--------|--------|-----------------|
| Records with NULL frequency | < 30% | > 50% |
| Records with empty categories | < 20% | > 40% |
| Records flagged as outliers | < 5% | > 10% |
| Snapshot coverage | 100% | < 95% |

### Verification Commands

| Action | Tool | Location |
|--------|------|----------|
| Run migrations | Django migrate | Terminal |
| Verify models | Django shell | Check model fields |
| Test aggregation | Django management command | Custom command |
| Check Celery Beat | Celery inspect | Celery CLI |
| Review task logs | Application logs | Log aggregator |

---

## Integration Points

### Dependencies

```
┌─────────────────────────────────────────────────────────────────────┐
│                    Module Dependencies                               │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌─────────────────┐                                                │
│  │ Orders Module   │◄─────────────────────────────────┐             │
│  │ (Source Data)   │                                  │             │
│  └────────┬────────┘                                  │             │
│           │                                           │             │
│           ▼                                           │             │
│  ┌─────────────────┐     ┌─────────────────┐         │             │
│  │ Aggregator      │────►│ CustomerMetrics │         │             │
│  │ (analytics/)    │     │ (models/)       │         │             │
│  └────────┬────────┘     └────────┬────────┘         │             │
│           │                       │                   │             │
│           ▼                       ▼                   │             │
│  ┌─────────────────┐     ┌─────────────────┐         │             │
│  │ Scheduler       │────►│ History Model   │         │             │
│  │ (tasks/)        │     │ (models/)       │         │             │
│  └────────┬────────┘     └─────────────────┘         │             │
│           │                                           │             │
│           ▼                                           │             │
│  ┌─────────────────┐                                 │             │
│  │ Cleanup         │─────────────────────────────────┘             │
│  │ (analytics/)    │                                               │
│  └─────────────────┘                                               │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### API Endpoints (Future)

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/insights/metrics/{customer_id}/` | GET | Retrieve customer metrics |
| `/api/insights/metrics/{customer_id}/history/` | GET | Retrieve historical snapshots |
| `/api/insights/admin/trigger-aggregation/` | POST | Manual aggregation trigger |
| `/api/insights/admin/trigger-cleanup/` | POST | Manual cleanup trigger |

### Event Hooks

| Event | Trigger | Action |
|-------|---------|--------|
| Order Created | Signal | Queue metrics update |
| Order Updated | Signal | Queue metrics update |
| Order Deleted | Signal | Queue metrics recalculation |
| Tenant Created | Signal | Initialize scheduler for tenant |

---

## Performance Considerations

### Database Optimization

| Optimization | Table | Implementation |
|--------------|-------|----------------|
| Index on customer | CustomerMetrics | Single-column index |
| Index on snapshot_month | CustomerMetricsHistory | Single-column index |
| Composite index | CustomerMetricsHistory | (customer, snapshot_month) |
| Partial index | CustomerMetrics | WHERE is_outlier = false |

### Query Optimization

| Query | Optimization | Expected Improvement |
|-------|--------------|----------------------|
| Category aggregation | Subquery materialization | 40% faster |
| Day/Hour patterns | Database functions | 30% faster |
| IQR calculation | Batch processing | 50% faster |

### Task Optimization

| Aspect | Strategy | Configuration |
|--------|----------|---------------|
| Concurrency | Parallel tenant processing | 4 workers |
| Batching | Process customers in batches | 100 per batch |
| Rate Limiting | Prevent DB overload | 100 tasks/minute |
| Timeout | Prevent hung tasks | 5 minutes soft limit |

---

## Error Handling

### Common Errors

| Error | Cause | Resolution |
|-------|-------|------------|
| Division by zero | Order count = 1 | Check order_count >= 2 |
| Empty array | No category data | Return empty list |
| Null pointer | Customer deleted | Skip with logging |
| Timeout | Large customer | Increase timeout |
| Database lock | Concurrent updates | Implement retry logic |

### Retry Strategy

| Attempt | Delay | Action |
|---------|-------|--------|
| 1 | Immediate | First try |
| 2 | 30 seconds | Retry with backoff |
| 3 | 2 minutes | Retry with longer backoff |
| 4 | 10 minutes | Final retry |
| Failure | N/A | Log error, alert operations |

---

## Security Considerations

| Concern | Mitigation |
|---------|------------|
| Data access | Tenant isolation via middleware |
| Task execution | Celery task signatures |
| Admin endpoints | Permission-based access |
| Sensitive data | No PII in metrics (only aggregates) |
| Audit trail | Log all metric calculations |

---

## Acceptance Criteria Summary

### Task 09: Order Frequency
- [ ] Formula correctly calculates average days between orders
- [ ] Handles edge cases (1 order, same-day orders)
- [ ] Field added to CustomerMetrics model
- [ ] Integration with aggregator pipeline

### Task 10: Product Categories
- [ ] Top 3 categories by spend calculated
- [ ] ArrayField stores category UUIDs
- [ ] Handles customers with fewer than 3 categories
- [ ] Category hierarchy level documented

### Task 11: Purchase Days
- [ ] Day indices 0-6 correctly mapped
- [ ] Top days by order count calculated
- [ ] ArrayField stores day indices
- [ ] Configurable number of days to store

### Task 12: Time of Day
- [ ] Hour indices 0-23 correctly mapped
- [ ] Timezone handling documented
- [ ] Top hours by order count calculated
- [ ] ArrayField stores hour indices

### Task 13: Metrics Scheduler
- [ ] Celery Beat configured for daily 3 AM run
- [ ] Task hierarchy implemented (tenant → customer)
- [ ] Rate limiting configured
- [ ] Monitoring alerts defined

### Task 14: Historical Snapshots
- [ ] CustomerMetricsHistory model created
- [ ] Monthly snapshot task configured
- [ ] Unique constraint on customer + month
- [ ] Retention policy documented

### Task 15: Data Cleanup
- [ ] IQR method implemented with 3× multiplier
- [ ] Outlier fields added to CustomerMetrics
- [ ] Cleanup task integrated with scheduler
- [ ] Outlier statistics logged

### Task 16: Verification
- [ ] All model fields verified
- [ ] Calculation logic tested
- [ ] Scheduler tasks confirmed running
- [ ] Data quality metrics within targets

---

## Next Steps

Upon completion of all tasks in this document, proceed to:

**[Group B: RFM Segmentation](../Group-B_RFM-Segmentation/)**

Group B will utilize the prepared customer metrics to calculate RFM scores and segment customers for targeted marketing and AI analysis.

---

## Document Metadata

| Attribute | Value |
|-----------|-------|
| Created | 2026-01-31 |
| Last Updated | 2026-01-31 |
| Author | Development Team |
| Status | Draft |
| Review Status | Pending |

---

*End of Document 02 - Group A: Data Preparation*
