# Tasks 01-08: Customer Metrics Model

> **Phase:** 10 - AI Features & Advanced Capabilities  
> **SubPhase:** 12 - Customer Insights AI (FINAL SUBPHASE)  
> **Group:** A - Data Preparation  
> **Document:** 01 of 02  
> **Tasks Covered:** 01, 02, 03, 04, 05, 06, 07, 08

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-09-16_Scheduler-Cleanup.md](02_Tasks-09-16_Scheduler-Cleanup.md)

---

## Document Overview

This document provides comprehensive instructions for creating the **CustomerMetrics** model and the **OrderAggregator** analytics class. These components form the foundation of the Customer Insights AI system, storing aggregated customer behavior data and computing key metrics from order history.

The CustomerMetrics model serves as a denormalized cache of customer statistics, enabling fast retrieval for AI-powered insights without expensive real-time calculations. The OrderAggregator class handles the extraction and computation of these metrics from order records.

### Tasks in This Document

| Task # | Task Name | Complexity | Est. Time | Description |
|--------|-----------|------------|-----------|-------------|
| 01 | Create CustomerMetrics Model | Medium | 45 min | Define model structure with tenant awareness |
| 02 | Create Metrics Fields | Low | 30 min | Add all required data fields |
| 03 | Create Order Aggregator | Medium | 60 min | Build aggregator class architecture |
| 04 | Create First Order Date | Low | 20 min | Implement tenure calculation query |
| 05 | Create Last Order Date | Low | 20 min | Implement recency calculation query |
| 06 | Create Order Count | Low | 15 min | Implement order counting query |
| 07 | Create Total Spend | Low | 20 min | Implement spend summation query |
| 08 | Create Average Order | Low | 15 min | Implement average order formula |

**Total Estimated Time:** ~4 hours

---

## Architecture Overview

### Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        CUSTOMER METRICS DATA FLOW                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────┐    ┌──────────────────┐    ┌────────────────────────┐    │
│  │              │    │                  │    │                        │    │
│  │  Orders      │───▶│  OrderAggregator │───▶│  CustomerMetrics       │    │
│  │  Table       │    │  Class           │    │  Model                 │    │
│  │              │    │                  │    │                        │    │
│  └──────────────┘    └──────────────────┘    └────────────────────────┘    │
│         │                    │                          │                   │
│         │                    │                          │                   │
│         ▼                    ▼                          ▼                   │
│  ┌──────────────┐    ┌──────────────────┐    ┌────────────────────────┐    │
│  │ Raw Order    │    │ Aggregation      │    │ Cached Metrics         │    │
│  │ Records      │    │ Queries          │    │ (Fast Access)          │    │
│  │              │    │ • MIN(date)      │    │                        │    │
│  │ • order_date │    │ • MAX(date)      │    │ • first_order_date     │    │
│  │ • total      │    │ • COUNT(*)       │    │ • last_order_date      │    │
│  │ • customer   │    │ • SUM(total)     │    │ • total_orders         │    │
│  │              │    │ • AVG(total)     │    │ • total_spend          │    │
│  └──────────────┘    └──────────────────┘    │ • average_order        │    │
│                                              └────────────────────────┘    │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Component Relationship

```
┌─────────────────────────────────────────────────────────────────┐
│                     customer_insights app                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  models/                          analytics/                     │
│  ├── __init__.py                  ├── __init__.py               │
│  └── customer_metrics.py          └── aggregator.py             │
│       │                                │                         │
│       │  CustomerMetrics               │  OrderAggregator        │
│       │  ├── tenant_id                 │  ├── aggregate()        │
│       │  ├── customer_id               │  ├── _first_order()     │
│       │  ├── first_order_date          │  ├── _last_order()      │
│       │  ├── last_order_date           │  ├── _order_count()     │
│       │  ├── total_orders              │  ├── _total_spend()     │
│       │  ├── total_spend               │  └── _average_order()   │
│       │  ├── average_order             │                         │
│       │  ├── order_frequency           │                         │
│       │  ├── preferred_categories      │                         │
│       │  ├── preferred_days            │                         │
│       │  ├── preferred_hours           │                         │
│       │  └── updated_at                │                         │
│       │                                │                         │
│       └────────────────────────────────┘                         │
│                    uses                                          │
└─────────────────────────────────────────────────────────────────┘
```

---

## Task 01: Create CustomerMetrics Model

### Overview

Create the foundational CustomerMetrics model that stores aggregated customer behavior statistics. This model maintains a one-to-one relationship with Customer records and is scoped by tenant for multi-tenancy support.

### Dependencies

| Dependency | Type | Purpose |
|------------|------|---------|
| Django models | Framework | Model base class |
| Customer model | App Model | Foreign key relationship |
| Tenant model | App Model | Multi-tenancy scoping |
| TimestampMixin | Core Mixin | Auto-updated timestamps |
| TenantAwareMixin | Core Mixin | Tenant isolation |

### Pre-Conditions

- [ ] `customer_insights` app exists in `backend/apps/`
- [ ] App is registered in Django settings
- [ ] Customer model is available and migrated
- [ ] Core mixins are implemented

### Instructions

1. **Navigate to the customer_insights app directory**
   - Locate or create the `models` subdirectory
   - Ensure `__init__.py` exists in the models directory

2. **Create the customer_metrics.py file**
   - Create a new file named `customer_metrics.py` in the models directory

3. **Define the model class**
   - Name the class `CustomerMetrics`
   - Inherit from Django's `models.Model`
   - Include the `TenantAwareMixin` for multi-tenancy
   - Include the `TimestampMixin` for automatic timestamps

4. **Configure the Meta class**
   - Set `db_table` to `customer_metrics`
   - Define `unique_together` constraint for `tenant` and `customer`
   - Set appropriate `verbose_name` and `verbose_name_plural`
   - Add database indexes for query optimization

5. **Register in models __init__.py**
   - Import the CustomerMetrics class
   - Add to the `__all__` list for clean exports

### Model Purpose Table

| Aspect | Description |
|--------|-------------|
| **Primary Function** | Store pre-computed customer behavior metrics |
| **Update Frequency** | Daily batch processing |
| **Data Source** | Aggregated from Orders table |
| **Access Pattern** | Read-heavy, write-daily |
| **Retention** | Persist indefinitely, update in place |

### Database Considerations

| Consideration | Recommendation |
|---------------|----------------|
| Table Size | One row per customer per tenant |
| Partitioning | Consider by tenant_id for large deployments |
| Archival | No archival needed (overwritten daily) |
| Backup | Include in standard backup procedures |

### Expected Outcome

- New file created at `backend/apps/customer_insights/models/customer_metrics.py`
- Model class properly inherits required mixins
- Meta class configured with correct constraints
- Model exported from `models/__init__.py`

### Verification Checklist

- [ ] File exists at correct location
- [ ] Model inherits from TenantAwareMixin
- [ ] Model inherits from TimestampMixin
- [ ] Meta class defines unique_together constraint
- [ ] Model is importable from the app

---

## Task 02: Create Metrics Fields

### Overview

Define all required fields for the CustomerMetrics model that will store aggregated customer statistics. These fields capture order history metrics, behavioral patterns, and preferences.

### Dependencies

| Dependency | Type | Purpose |
|------------|------|---------|
| Task 01 | Prerequisite | CustomerMetrics model exists |
| Django fields | Framework | Field type definitions |
| PostgreSQL | Database | JSON field support |

### Instructions

1. **Add the primary key field**
   - Create a UUID primary key field named `id`
   - Use auto-generation for new records

2. **Add tenant relationship field**
   - Create a foreign key field named `tenant`
   - Reference the Tenant model
   - Set `on_delete` to CASCADE
   - Add a related_name for reverse lookups

3. **Add customer relationship field**
   - Create a foreign key field named `customer`
   - Reference the Customer model
   - Set `on_delete` to CASCADE
   - Add a related_name for reverse lookups

4. **Add date tracking fields**
   - Create `first_order_date` as DateTimeField (nullable)
   - Create `last_order_date` as DateTimeField (nullable)

5. **Add order statistics fields**
   - Create `total_orders` as IntegerField with default of 0
   - Create `total_spend` as DecimalField (max_digits=12, decimal_places=2)
   - Create `average_order` as DecimalField (max_digits=10, decimal_places=2)
   - Create `order_frequency` as FloatField (nullable) for days between orders

6. **Add preference fields**
   - Create `preferred_categories` as JSONField (default empty list)
   - Create `preferred_days` as JSONField (default empty list)
   - Create `preferred_hours` as JSONField (default empty list)

7. **Add metadata field**
   - Create `updated_at` as DateTimeField with auto_now

### Field Specifications Table

| Field Name | Type | Constraints | Default | Description |
|------------|------|-------------|---------|-------------|
| `id` | UUIDField | primary_key | auto | Unique identifier |
| `tenant` | ForeignKey | not null | - | Tenant reference |
| `customer` | ForeignKey | not null | - | Customer reference |
| `first_order_date` | DateTimeField | nullable | null | Customer's first order |
| `last_order_date` | DateTimeField | nullable | null | Customer's most recent order |
| `total_orders` | IntegerField | not null | 0 | Total order count |
| `total_spend` | DecimalField | not null | 0.00 | Cumulative spending |
| `average_order` | DecimalField | not null | 0.00 | Average order value |
| `order_frequency` | FloatField | nullable | null | Avg days between orders |
| `preferred_categories` | JSONField | not null | [] | Top product categories |
| `preferred_days` | JSONField | not null | [] | Preferred shopping days |
| `preferred_hours` | JSONField | not null | [] | Preferred shopping hours |
| `updated_at` | DateTimeField | not null | auto | Last update timestamp |

### JSON Field Structures

#### preferred_categories

| Key | Type | Description |
|-----|------|-------------|
| `category_id` | UUID | Category identifier |
| `category_name` | String | Category display name |
| `order_count` | Integer | Orders containing category |
| `percentage` | Float | Percentage of total orders |

#### preferred_days

| Key | Type | Description |
|-----|------|-------------|
| `day` | Integer | Day of week (0=Monday, 6=Sunday) |
| `day_name` | String | Day name (Monday, Tuesday, etc.) |
| `order_count` | Integer | Orders on this day |
| `percentage` | Float | Percentage of total orders |

#### preferred_hours

| Key | Type | Description |
|-----|------|-------------|
| `hour` | Integer | Hour of day (0-23) |
| `order_count` | Integer | Orders during this hour |
| `percentage` | Float | Percentage of total orders |

### Index Recommendations

| Index Name | Fields | Purpose |
|------------|--------|---------|
| `idx_metrics_tenant` | tenant_id | Tenant filtering |
| `idx_metrics_customer` | customer_id | Customer lookup |
| `idx_metrics_updated` | updated_at | Stale record detection |
| `idx_metrics_spend` | total_spend | Spending analysis queries |

### Expected Outcome

- All 13 fields defined in the CustomerMetrics model
- Proper field types with appropriate constraints
- Default values set for numeric and JSON fields
- Database indexes defined for query optimization

### Verification Checklist

- [ ] All required fields are defined
- [ ] Field types match specifications
- [ ] Default values are set correctly
- [ ] Nullable fields are properly marked
- [ ] JSON fields have empty list defaults
- [ ] Decimal precision is appropriate for currency

---

## Task 03: Create Order Aggregator

### Overview

Create the OrderAggregator class that handles the extraction and computation of customer metrics from order records. This class provides a clean interface for aggregating order data into the CustomerMetrics model.

### Dependencies

| Dependency | Type | Purpose |
|------------|------|---------|
| Tasks 01-02 | Prerequisite | CustomerMetrics model with fields |
| Order model | App Model | Source data for aggregation |
| Django ORM | Framework | Query construction |
| PostgreSQL | Database | Aggregation functions |

### Pre-Conditions

- [ ] CustomerMetrics model is migrated
- [ ] Order model is available with required fields
- [ ] Analytics directory exists in customer_insights app

### Instructions

1. **Create the analytics directory**
   - Create `analytics` subdirectory in `customer_insights` app
   - Create `__init__.py` file in the analytics directory

2. **Create the aggregator.py file**
   - Create new file at `analytics/aggregator.py`

3. **Define the OrderAggregator class**
   - Create a class named `OrderAggregator`
   - Design for single-customer or batch processing
   - Include logging for debugging and monitoring

4. **Implement the constructor**
   - Accept optional `tenant_id` parameter
   - Store tenant context for all queries
   - Initialize logger instance

5. **Create the main aggregate method**
   - Name the method `aggregate`
   - Accept `customer_id` as required parameter
   - Accept optional `save` parameter (default True)
   - Coordinate calls to individual metric methods
   - Return the aggregated CustomerMetrics instance

6. **Design for extensibility**
   - Use private methods for individual metrics
   - Allow override of individual calculations
   - Support custom aggregation periods

7. **Register in analytics __init__.py**
   - Import the OrderAggregator class
   - Add to the `__all__` list

### Class Structure Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                      OrderAggregator                             │
├─────────────────────────────────────────────────────────────────┤
│  Attributes:                                                     │
│  ├── tenant_id: UUID          # Tenant context                  │
│  ├── logger: Logger           # Logging instance                │
│  └── order_model: Model       # Order model reference           │
├─────────────────────────────────────────────────────────────────┤
│  Public Methods:                                                 │
│  ├── aggregate(customer_id, save=True) -> CustomerMetrics       │
│  ├── aggregate_batch(customer_ids) -> List[CustomerMetrics]     │
│  └── aggregate_all() -> int  # Returns count processed          │
├─────────────────────────────────────────────────────────────────┤
│  Private Methods:                                                │
│  ├── _get_base_queryset(customer_id) -> QuerySet                │
│  ├── _first_order_date(queryset) -> datetime | None             │
│  ├── _last_order_date(queryset) -> datetime | None              │
│  ├── _order_count(queryset) -> int                              │
│  ├── _total_spend(queryset) -> Decimal                          │
│  ├── _average_order(total_spend, order_count) -> Decimal        │
│  ├── _order_frequency(first_date, last_date, count) -> float    │
│  ├── _preferred_categories(queryset) -> list                    │
│  ├── _preferred_days(queryset) -> list                          │
│  └── _preferred_hours(queryset) -> list                         │
└─────────────────────────────────────────────────────────────────┘
```

### Method Parameters Table

| Method | Parameters | Return Type | Description |
|--------|------------|-------------|-------------|
| `__init__` | tenant_id: UUID (optional) | None | Initialize aggregator |
| `aggregate` | customer_id: UUID, save: bool | CustomerMetrics | Aggregate single customer |
| `aggregate_batch` | customer_ids: List[UUID] | List[CustomerMetrics] | Batch aggregation |
| `aggregate_all` | none | int | Process all customers |
| `_get_base_queryset` | customer_id: UUID | QuerySet | Get filtered orders |

### Query Optimization Strategies

| Strategy | Application | Benefit |
|----------|-------------|---------|
| Single Query Aggregation | Combine MIN, MAX, COUNT, SUM | Reduce database round trips |
| Prefetch Related | Load categories in batch | Avoid N+1 queries |
| Chunked Processing | Process in batches of 1000 | Memory efficiency |
| Index Usage | Use indexed fields in filters | Query performance |

### Expected Outcome

- New file created at `backend/apps/customer_insights/analytics/aggregator.py`
- OrderAggregator class with proper initialization
- Main `aggregate` method defined and documented
- Class exported from `analytics/__init__.py`

### Verification Checklist

- [ ] Analytics directory exists with __init__.py
- [ ] aggregator.py file created
- [ ] OrderAggregator class defined
- [ ] Constructor accepts tenant_id parameter
- [ ] aggregate method signature is correct
- [ ] Class is importable from the app

---

## Task 04: Create First Order Date

### Overview

Implement the first order date calculation method that queries the minimum order date for a customer. This metric indicates customer tenure and is used for loyalty analysis.

### Dependencies

| Dependency | Type | Purpose |
|------------|------|---------|
| Task 03 | Prerequisite | OrderAggregator class exists |
| Order model | App Model | order_date field |
| Django Min | ORM Function | Aggregation query |

### Instructions

1. **Define the private method**
   - Name the method `_first_order_date`
   - Accept a QuerySet parameter (pre-filtered orders)
   - Return a datetime object or None

2. **Implement the MIN aggregation**
   - Use Django's `Min` aggregation function
   - Target the `order_date` field (or equivalent)
   - Handle the case of no orders (return None)

3. **Add result extraction**
   - Extract the aggregated value from the result dictionary
   - Ensure proper datetime type is returned
   - Handle timezone awareness appropriately

4. **Add logging**
   - Log debug message with customer and result
   - Log warning if calculation fails

### Query Design

```
┌────────────────────────────────────────────────────────────────┐
│                   First Order Date Query                        │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Input: QuerySet (pre-filtered for customer + tenant)           │
│                                                                 │
│  ┌────────────────┐                                            │
│  │ Orders Table   │                                            │
│  │                │                                            │
│  │ customer_id    │──┐                                         │
│  │ order_date     │  │                                         │
│  │ ...            │  │                                         │
│  └────────────────┘  │                                         │
│                      ▼                                          │
│            ┌──────────────────┐                                │
│            │ MIN(order_date)  │                                │
│            └────────┬─────────┘                                │
│                     │                                           │
│                     ▼                                           │
│  Output: datetime | None                                        │
│                                                                 │
│  Example: 2024-03-15 10:30:00+00:00                            │
│                                                                 │
└────────────────────────────────────────────────────────────────┘
```

### Business Logic

| Scenario | Behavior | Return Value |
|----------|----------|--------------|
| Customer has orders | Return earliest date | datetime |
| Customer has no orders | Return null | None |
| Order dates are null | Skip null dates | datetime or None |
| Multiple orders same date | Return that date | datetime |

### Expected Outcome

- `_first_order_date` method added to OrderAggregator
- Method uses Django Min aggregation
- Proper null handling implemented
- Method integrates with main aggregate flow

### Verification Checklist

- [ ] Method exists in OrderAggregator class
- [ ] Method accepts QuerySet parameter
- [ ] Min aggregation is used correctly
- [ ] None is returned for empty querysets
- [ ] Datetime type is preserved

---

## Task 05: Create Last Order Date

### Overview

Implement the last order date calculation method that queries the maximum order date for a customer. This metric indicates recency and is critical for churn prediction.

### Dependencies

| Dependency | Type | Purpose |
|------------|------|---------|
| Task 03 | Prerequisite | OrderAggregator class exists |
| Order model | App Model | order_date field |
| Django Max | ORM Function | Aggregation query |

### Instructions

1. **Define the private method**
   - Name the method `_last_order_date`
   - Accept a QuerySet parameter (pre-filtered orders)
   - Return a datetime object or None

2. **Implement the MAX aggregation**
   - Use Django's `Max` aggregation function
   - Target the `order_date` field
   - Handle the case of no orders (return None)

3. **Add result extraction**
   - Extract the aggregated value from the result dictionary
   - Ensure proper datetime type is returned
   - Handle timezone awareness appropriately

4. **Add logging**
   - Log debug message with customer and result
   - Log warning if calculation fails

### Query Design

```
┌────────────────────────────────────────────────────────────────┐
│                    Last Order Date Query                        │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Input: QuerySet (pre-filtered for customer + tenant)           │
│                                                                 │
│  ┌────────────────┐                                            │
│  │ Orders Table   │                                            │
│  │                │                                            │
│  │ customer_id    │──┐                                         │
│  │ order_date     │  │                                         │
│  │ ...            │  │                                         │
│  └────────────────┘  │                                         │
│                      ▼                                          │
│            ┌──────────────────┐                                │
│            │ MAX(order_date)  │                                │
│            └────────┬─────────┘                                │
│                     │                                           │
│                     ▼                                           │
│  Output: datetime | None                                        │
│                                                                 │
│  Example: 2025-01-28 14:45:00+00:00                            │
│                                                                 │
└────────────────────────────────────────────────────────────────┘
```

### Recency Analysis Usage

| Days Since Last Order | Classification | Action Trigger |
|-----------------------|----------------|----------------|
| 0-7 days | Active | None required |
| 8-30 days | Recent | Engagement campaign |
| 31-90 days | At Risk | Re-activation campaign |
| 90+ days | Churned | Win-back campaign |

### Business Logic

| Scenario | Behavior | Return Value |
|----------|----------|--------------|
| Customer has orders | Return latest date | datetime |
| Customer has no orders | Return null | None |
| Single order | Return that date | datetime |
| Future-dated orders | Include in MAX | datetime |

### Expected Outcome

- `_last_order_date` method added to OrderAggregator
- Method uses Django Max aggregation
- Proper null handling implemented
- Method integrates with main aggregate flow

### Verification Checklist

- [ ] Method exists in OrderAggregator class
- [ ] Method accepts QuerySet parameter
- [ ] Max aggregation is used correctly
- [ ] None is returned for empty querysets
- [ ] Datetime type is preserved

---

## Task 06: Create Order Count

### Overview

Implement the order count calculation method that counts the total number of completed orders for a customer. This metric is fundamental for frequency analysis and customer segmentation.

### Dependencies

| Dependency | Type | Purpose |
|------------|------|---------|
| Task 03 | Prerequisite | OrderAggregator class exists |
| Order model | App Model | Order records |
| Django Count | ORM Function | Aggregation query |

### Instructions

1. **Define the private method**
   - Name the method `_order_count`
   - Accept a QuerySet parameter (pre-filtered orders)
   - Return an integer (0 for no orders)

2. **Implement the COUNT aggregation**
   - Use Django's `Count` aggregation function
   - Count all records in the queryset
   - Return 0 instead of None for empty sets

3. **Add status filtering consideration**
   - Document which order statuses to include
   - Typically exclude: cancelled, refunded, draft
   - Include: completed, fulfilled, delivered

4. **Add logging**
   - Log debug message with customer and count
   - Log warning if count is unexpectedly high

### Query Design

```
┌────────────────────────────────────────────────────────────────┐
│                     Order Count Query                           │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Input: QuerySet (pre-filtered for customer + tenant + status)  │
│                                                                 │
│  ┌────────────────┐                                            │
│  │ Orders Table   │                                            │
│  │                │                                            │
│  │ customer_id    │──┐                                         │
│  │ status         │  │                                         │
│  │ ...            │  │                                         │
│  └────────────────┘  │                                         │
│                      ▼                                          │
│            ┌──────────────────┐                                │
│            │ COUNT(*)         │                                │
│            └────────┬─────────┘                                │
│                     │                                           │
│                     ▼                                           │
│  Output: int (0 or positive)                                    │
│                                                                 │
│  Example: 47                                                    │
│                                                                 │
└────────────────────────────────────────────────────────────────┘
```

### Order Status Inclusion

| Status | Include in Count | Reason |
|--------|------------------|--------|
| `completed` | ✅ Yes | Valid purchase |
| `fulfilled` | ✅ Yes | Valid purchase |
| `delivered` | ✅ Yes | Valid purchase |
| `processing` | ✅ Yes | Valid purchase |
| `cancelled` | ❌ No | Not a purchase |
| `refunded` | ❌ No | Money returned |
| `draft` | ❌ No | Not submitted |
| `failed` | ❌ No | Payment failed |

### Business Logic

| Scenario | Behavior | Return Value |
|----------|----------|--------------|
| Customer has orders | Return count | int > 0 |
| Customer has no orders | Return zero | 0 |
| All orders cancelled | Return zero | 0 |
| Mix of statuses | Count valid only | int ≥ 0 |

### Expected Outcome

- `_order_count` method added to OrderAggregator
- Method uses Django Count aggregation
- Returns 0 for empty querysets (not None)
- Method integrates with main aggregate flow

### Verification Checklist

- [ ] Method exists in OrderAggregator class
- [ ] Method accepts QuerySet parameter
- [ ] Count aggregation is used correctly
- [ ] Zero is returned for empty querysets
- [ ] Integer type is guaranteed

---

## Task 07: Create Total Spend

### Overview

Implement the total spend calculation method that sums all order totals for a customer. This metric is essential for customer lifetime value (CLV) analysis and tier classification.

### Dependencies

| Dependency | Type | Purpose |
|------------|------|---------|
| Task 03 | Prerequisite | OrderAggregator class exists |
| Order model | App Model | order_total field |
| Django Sum | ORM Function | Aggregation query |
| Decimal | Python Type | Currency precision |

### Instructions

1. **Define the private method**
   - Name the method `_total_spend`
   - Accept a QuerySet parameter (pre-filtered orders)
   - Return a Decimal value (0.00 for no orders)

2. **Implement the SUM aggregation**
   - Use Django's `Sum` aggregation function
   - Target the `order_total` field (or `grand_total`)
   - Return Decimal('0.00') instead of None for empty sets

3. **Ensure decimal precision**
   - Use Decimal type for currency accuracy
   - Avoid floating-point arithmetic
   - Match field precision (12 digits, 2 decimal places)

4. **Add logging**
   - Log debug message with customer and total
   - Log info for high-value customers

### Query Design

```
┌────────────────────────────────────────────────────────────────┐
│                     Total Spend Query                           │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Input: QuerySet (pre-filtered for customer + tenant + status)  │
│                                                                 │
│  ┌────────────────┐                                            │
│  │ Orders Table   │                                            │
│  │                │                                            │
│  │ customer_id    │──┐                                         │
│  │ order_total    │  │                                         │
│  │ ...            │  │                                         │
│  └────────────────┘  │                                         │
│                      ▼                                          │
│            ┌──────────────────┐                                │
│            │ SUM(order_total) │                                │
│            └────────┬─────────┘                                │
│                     │                                           │
│                     ▼                                           │
│  Output: Decimal                                                │
│                                                                 │
│  Example: 15842.50                                              │
│                                                                 │
└────────────────────────────────────────────────────────────────┘
```

### Currency Handling

| Consideration | Implementation |
|---------------|----------------|
| Decimal Precision | Use Decimal, not float |
| Null Handling | Coalesce to 0.00 |
| Currency Code | Store separately if multi-currency |
| Rounding | Round to 2 decimal places |

### Customer Value Tiers

| Tier | Spend Range | Percentage of Customers |
|------|-------------|-------------------------|
| Bronze | $0 - $500 | ~60% |
| Silver | $501 - $2,000 | ~25% |
| Gold | $2,001 - $10,000 | ~12% |
| Platinum | $10,001+ | ~3% |

### Business Logic

| Scenario | Behavior | Return Value |
|----------|----------|--------------|
| Customer has orders | Return sum | Decimal > 0 |
| Customer has no orders | Return zero | Decimal(0.00) |
| All orders cancelled | Return zero | Decimal(0.00) |
| Refunded orders | Exclude from sum | Decimal ≥ 0 |

### Expected Outcome

- `_total_spend` method added to OrderAggregator
- Method uses Django Sum aggregation
- Returns Decimal('0.00') for empty querysets
- Method integrates with main aggregate flow

### Verification Checklist

- [ ] Method exists in OrderAggregator class
- [ ] Method accepts QuerySet parameter
- [ ] Sum aggregation is used correctly
- [ ] Decimal('0.00') is returned for empty querysets
- [ ] Decimal type is guaranteed (not float)

---

## Task 08: Create Average Order

### Overview

Implement the average order calculation method that computes the mean order value for a customer. This metric helps identify customer spending patterns and is used for promotional targeting.

### Dependencies

| Dependency | Type | Purpose |
|------------|------|---------|
| Task 06 | Prerequisite | Order count method |
| Task 07 | Prerequisite | Total spend method |
| Decimal | Python Type | Currency precision |

### Instructions

1. **Define the private method**
   - Name the method `_average_order`
   - Accept `total_spend` (Decimal) parameter
   - Accept `order_count` (int) parameter
   - Return a Decimal value

2. **Implement the calculation**
   - Formula: `average = total_spend / order_count`
   - Handle division by zero (return Decimal('0.00'))
   - Round to 2 decimal places

3. **Add validation**
   - Verify order_count is positive before division
   - Verify total_spend is not negative
   - Log warning for unexpected values

4. **Add logging**
   - Log debug message with calculation inputs and result
   - Log info for unusually high or low averages

### Calculation Flow

```
┌────────────────────────────────────────────────────────────────┐
│                   Average Order Calculation                     │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Inputs:                                                        │
│  ┌────────────────┐    ┌────────────────┐                      │
│  │ total_spend    │    │ order_count    │                      │
│  │ (from Task 07) │    │ (from Task 06) │                      │
│  │                │    │                │                      │
│  │ e.g., 15842.50 │    │ e.g., 47       │                      │
│  └───────┬────────┘    └───────┬────────┘                      │
│          │                     │                                │
│          └──────────┬──────────┘                                │
│                     ▼                                           │
│          ┌──────────────────────┐                              │
│          │  total_spend         │                              │
│          │  ─────────────       │                              │
│          │  order_count         │                              │
│          │                      │                              │
│          │  15842.50 / 47       │                              │
│          └──────────┬───────────┘                              │
│                     │                                           │
│                     ▼                                           │
│          ┌──────────────────────┐                              │
│          │  Round to 2 places   │                              │
│          └──────────┬───────────┘                              │
│                     │                                           │
│                     ▼                                           │
│  Output: Decimal                                                │
│                                                                 │
│  Example: 337.07                                                │
│                                                                 │
└────────────────────────────────────────────────────────────────┘
```

### Edge Cases

| Scenario | Handling | Return Value |
|----------|----------|--------------|
| order_count = 0 | Return zero | Decimal('0.00') |
| total_spend = 0 | Normal calc | Decimal('0.00') |
| Single order | Return total | Same as total_spend |
| Large numbers | Use Decimal | Precise result |

### Average Order Segments

| Segment | AOV Range | Marketing Approach |
|---------|-----------|-------------------|
| Low | $0 - $25 | Upsell bundles |
| Medium | $26 - $75 | Cross-sell related |
| High | $76 - $200 | Loyalty rewards |
| Premium | $201+ | VIP treatment |

### Business Logic

| Input | Calculation | Output |
|-------|-------------|--------|
| spend=1000, count=10 | 1000/10 | 100.00 |
| spend=0, count=0 | 0/0 (guarded) | 0.00 |
| spend=150, count=1 | 150/1 | 150.00 |
| spend=333.33, count=3 | 333.33/3 | 111.11 |

### Expected Outcome

- `_average_order` method added to OrderAggregator
- Method performs safe division with zero-check
- Returns properly rounded Decimal value
- Method integrates with main aggregate flow

### Verification Checklist

- [ ] Method exists in OrderAggregator class
- [ ] Method accepts two parameters (spend, count)
- [ ] Division by zero is handled
- [ ] Result is rounded to 2 decimal places
- [ ] Decimal type is guaranteed

---

## Integration Summary

### Complete Aggregate Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         aggregate(customer_id) Flow                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────┐                                                        │
│  │ 1. Get/Create   │                                                        │
│  │ CustomerMetrics │                                                        │
│  └────────┬────────┘                                                        │
│           │                                                                  │
│           ▼                                                                  │
│  ┌─────────────────┐                                                        │
│  │ 2. Build Base   │                                                        │
│  │ QuerySet        │─────────────────────────────────────┐                  │
│  └────────┬────────┘                                     │                  │
│           │                                              │                  │
│           ▼                                              ▼                  │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐             │
│  │ 3a. First Date  │  │ 3b. Last Date   │  │ 3c. Count       │             │
│  │ _first_order()  │  │ _last_order()   │  │ _order_count()  │             │
│  └────────┬────────┘  └────────┬────────┘  └────────┬────────┘             │
│           │                    │                    │                       │
│           ▼                    ▼                    ▼                       │
│  ┌─────────────────────────────────────────────────────────┐               │
│  │                    3d. Total Spend                       │               │
│  │                    _total_spend()                        │               │
│  └───────────────────────────┬─────────────────────────────┘               │
│                              │                                              │
│                              ▼                                              │
│  ┌─────────────────────────────────────────────────────────┐               │
│  │                    3e. Average Order                     │               │
│  │                    _average_order(spend, count)          │               │
│  └───────────────────────────┬─────────────────────────────┘               │
│                              │                                              │
│                              ▼                                              │
│  ┌─────────────────┐                                                        │
│  │ 4. Update Model │                                                        │
│  │ & Save          │                                                        │
│  └────────┬────────┘                                                        │
│           │                                                                  │
│           ▼                                                                  │
│  ┌─────────────────┐                                                        │
│  │ 5. Return       │                                                        │
│  │ CustomerMetrics │                                                        │
│  └─────────────────┘                                                        │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Files Created

| File Path | Purpose | Tasks |
|-----------|---------|-------|
| `models/customer_metrics.py` | Model definition | 01, 02 |
| `models/__init__.py` | Model exports | 01 |
| `analytics/aggregator.py` | Aggregation logic | 03-08 |
| `analytics/__init__.py` | Analytics exports | 03 |

### Migration Requirements

After completing all tasks, generate and apply migrations:

| Step | Action | Command Reference |
|------|--------|-------------------|
| 1 | Generate migration | Django makemigrations |
| 2 | Review migration file | Check SQL operations |
| 3 | Apply migration | Django migrate |
| 4 | Verify table creation | Check database |

---

## Testing Considerations

### Unit Test Coverage

| Component | Test Scenarios |
|-----------|----------------|
| CustomerMetrics Model | Field validation, constraints, defaults |
| _first_order_date | With orders, without orders, null dates |
| _last_order_date | With orders, without orders, single order |
| _order_count | Zero count, positive count, filtered statuses |
| _total_spend | Zero spend, positive spend, decimal precision |
| _average_order | Division by zero, normal calculation, rounding |

### Integration Test Scenarios

| Scenario | Description |
|----------|-------------|
| New customer | Customer with no order history |
| Active customer | Customer with multiple recent orders |
| Churned customer | Customer with old orders only |
| High-value customer | Customer with large total spend |
| Frequent buyer | Customer with many small orders |

---

## Next Document Preview

The next document **[02_Tasks-09-16_Scheduler-Cleanup.md](02_Tasks-09-16_Scheduler-Cleanup.md)** covers:

- Task 09: Order Frequency Calculation
- Task 10: Preferred Categories Analysis
- Task 11: Preferred Days Analysis
- Task 12: Preferred Hours Analysis
- Task 13: Metrics Update Scheduler
- Task 14: Batch Processing Implementation
- Task 15: Data Cleanup Procedures
- Task 16: Metrics Validation

---

## Document Metadata

| Attribute | Value |
|-----------|-------|
| **Created** | 2026-01-31 |
| **Last Updated** | 2026-01-31 |
| **Author** | Development Team |
| **Status** | Draft |
| **Review Status** | Pending |

---

## Revision History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | 2026-01-31 | Initial document creation | Dev Team |
