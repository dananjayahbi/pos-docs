# Tasks 63-68: Risk Model and API

> **Phase:** 10 - AI Features & Advanced Capabilities  
> **SubPhase:** 12 - Customer Insights AI (FINAL SUBPHASE)  
> **Group:** D - Churn Prediction  
> **Document:** 02 of 02  
> **Tasks Covered:** 63, 64, 65, 66, 67, 68

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-53-62_Features-Model.md](01_Tasks-53-62_Features-Model.md)
- **→ Next Group:** [../Group-E_Insights-Dashboard/](../Group-E_Insights-Dashboard/)

---

## Document Overview

This document covers the risk classification system, data persistence layer, scheduling infrastructure, and API endpoints for the churn prediction system. These tasks transform raw prediction scores into actionable business intelligence through tiered risk classification and RESTful API access.

### Tasks Summary

| Task | Title | Complexity | Focus Area |
|------|-------|------------|------------|
| 63 | Create Risk Tiers | Low | Classification thresholds |
| 64 | Create ChurnRisk Model | Medium | Data persistence layer |
| 65 | Create Risk Scheduler | Low | Automated processing |
| 66 | Create Churn API | Medium | Individual risk endpoint |
| 67 | Create At-Risk List | Low | Bulk risk endpoint |
| 68 | Verify Churn Prediction | Low | End-to-end validation |

### Document Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                    RISK MODEL AND API FLOW                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│   ┌──────────────┐     ┌──────────────┐     ┌──────────────┐       │
│   │   Task 63    │     │   Task 64    │     │   Task 65    │       │
│   │  Risk Tiers  │────▶│ ChurnRisk    │────▶│  Scheduler   │       │
│   │  Definition  │     │    Model     │     │   (Weekly)   │       │
│   └──────────────┘     └──────────────┘     └──────────────┘       │
│          │                    │                    │                │
│          ▼                    ▼                    ▼                │
│   ┌──────────────────────────────────────────────────────┐         │
│   │                    Database Layer                     │         │
│   │              (ChurnRisk Records Stored)               │         │
│   └──────────────────────────────────────────────────────┘         │
│                              │                                      │
│          ┌───────────────────┼───────────────────┐                 │
│          ▼                   ▼                   ▼                 │
│   ┌──────────────┐    ┌──────────────┐    ┌──────────────┐        │
│   │   Task 66    │    │   Task 67    │    │   Task 68    │        │
│   │  Churn API   │    │ At-Risk List │    │   Verify     │        │
│   │  (Single)    │    │   (Bulk)     │    │  Pipeline    │        │
│   └──────────────┘    └──────────────┘    └──────────────┘        │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Expected Deliverables

```
backend/
└── apps/
    └── customer_insights/
        ├── models/
        │   └── churn_risk.py          # Task 64: ChurnRisk model
        ├── analytics/
        │   └── churn_predictor.py     # Tasks 63, 65: Tiers + Scheduler
        ├── api/
        │   ├── views/
        │   │   └── churn_views.py     # Tasks 66, 67: API endpoints
        │   ├── serializers/
        │   │   └── churn_serializers.py
        │   └── urls.py
        └── tests/
            └── test_churn_pipeline.py # Task 68: Verification
```

---

## Task 63: Create Risk Tiers

> **Complexity:** Low  
> **Estimated Time:** 2-3 hours  
> **Prerequisites:** Churn prediction model from Document 01

### Objective

Define the risk classification system that converts continuous probability scores (0-100) into discrete business-actionable risk tiers.

### Risk Tier Definitions

| Tier | Probability Range | Business Meaning | Action Priority |
|------|-------------------|------------------|-----------------|
| **Critical** | > 80% | Imminent churn expected | Immediate intervention |
| **High** | 50% - 80% | Significant risk | Proactive engagement |
| **Medium** | 20% - 50% | Moderate concern | Monitoring required |
| **Low** | < 20% | Healthy relationship | Standard service |

### Risk Tier Visualization

```
Churn Probability Scale (0-100%)

 0%                    20%                   50%                   80%                  100%
 ├────────────────────┬──────────────────────┬──────────────────────┬────────────────────┤
 │                    │                      │                      │                    │
 │       LOW          │       MEDIUM         │        HIGH          │     CRITICAL       │
 │     (Green)        │      (Yellow)        │      (Orange)        │       (Red)        │
 │                    │                      │                      │                    │
 │  < 20% churn       │  20-50% churn        │  50-80% churn        │  > 80% churn       │
 │  probability       │  probability         │  probability         │  probability       │
 │                    │                      │                      │                    │
 └────────────────────┴──────────────────────┴──────────────────────┴────────────────────┘
```

### Implementation Steps

#### Step 1: Create Risk Tier Constants

**Location:** `backend/apps/customer_insights/constants.py`

Define the following:
- Create an enumeration or choices class for risk tiers
- Define threshold constants for each tier boundary (20, 50, 80)
- Include display labels and color codes for UI rendering

#### Step 2: Create Tier Classification Function

**Location:** `backend/apps/customer_insights/analytics/churn_predictor.py`

Implement a classifier function that:
- Accepts a probability score (integer 0-100)
- Returns the corresponding risk tier string
- Handles edge cases (exactly on boundaries)
- Validates input is within valid range

#### Step 3: Add Tier Metadata

Create a configuration structure that includes:
- Tier name (Critical, High, Medium, Low)
- Probability range (min, max)
- Color code for UI (hex or named color)
- Priority score for sorting (1=Critical, 4=Low)
- Suggested actions or descriptions

### Validation Criteria

| Test Case | Input | Expected Output |
|-----------|-------|-----------------|
| Critical boundary | 81 | Critical |
| Critical exact | 80 | High (not Critical) |
| High range | 65 | High |
| Medium boundary | 50 | High (not Medium) |
| Medium range | 35 | Medium |
| Low boundary | 20 | Medium (not Low) |
| Low range | 10 | Low |
| Edge case zero | 0 | Low |
| Edge case max | 100 | Critical |

---

## Task 64: Create ChurnRisk Model

> **Complexity:** Medium  
> **Estimated Time:** 4-5 hours  
> **Prerequisites:** Task 63 (Risk Tiers)

### Objective

Create the database model to persist churn risk calculations, enabling historical tracking, API access, and analytics reporting.

### Model Schema

```
┌─────────────────────────────────────────────────────────────────┐
│                        ChurnRisk Model                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ id: UUID (Primary Key)                                   │   │
│  │   - Auto-generated unique identifier                     │   │
│  │   - Used for API references                              │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ customer_id: String (Indexed)                            │   │
│  │   - Reference to customer record                         │   │
│  │   - Foreign key to Customer model                        │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ churn_probability: Integer (0-100)                       │   │
│  │   - Percentage likelihood of churn                       │   │
│  │   - Constrained to valid range                           │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ risk_tier: String (Choices)                              │   │
│  │   - Critical / High / Medium / Low                       │   │
│  │   - Derived from probability                             │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ key_factors: JSONField (Array)                           │   │
│  │   - Top contributing risk factors                        │   │
│  │   - Ordered by importance                                │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ calculated_at: DateTime (Auto)                           │   │
│  │   - Timestamp of calculation                             │   │
│  │   - Used for freshness checks                            │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Field Specifications

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID | Primary Key, Auto | Unique record identifier |
| `customer_id` | String(50) | Indexed, Not Null | Customer reference key |
| `churn_probability` | Integer | Range 0-100 | Percentage score |
| `risk_tier` | String(20) | Choices | Classification tier |
| `key_factors` | JSON Array | Max 10 items | Contributing factors |
| `calculated_at` | DateTime | Auto-set | Calculation timestamp |

### Implementation Steps

#### Step 1: Create Model File

**Location:** `backend/apps/customer_insights/models/churn_risk.py`

Define the ChurnRisk model with:
- UUID primary key field
- Customer reference field with index
- Probability field with min/max validators
- Risk tier field using choices from Task 63
- JSON field for key factors array
- DateTime field with auto-now functionality

#### Step 2: Add Model Constraints

Implement the following database constraints:
- Unique constraint on customer_id + calculated_at combination
- Check constraint for probability range (0-100)
- Index on risk_tier for filtered queries
- Index on calculated_at for time-based queries

#### Step 3: Create Model Methods

Add the following instance methods:
- `save()` override to auto-calculate risk_tier from probability
- `is_stale()` method to check if recalculation needed (>7 days)
- `get_latest_for_customer()` class method for most recent record
- String representation showing customer and tier

#### Step 4: Add Manager Methods

Create a custom manager with:
- `at_risk()` - filter Critical and High tier customers
- `by_tier(tier_name)` - filter by specific tier
- `recent(days=7)` - filter recent calculations
- `stale(days=7)` - filter outdated records

### Key Factors Structure

The `key_factors` field stores an array of risk factor objects:

| Factor Field | Type | Description |
|--------------|------|-------------|
| `name` | String | Factor identifier (e.g., "purchase_decline") |
| `display_name` | String | Human-readable label |
| `impact_score` | Float | Contribution to risk (0.0-1.0) |
| `description` | String | Explanation of factor |

### Database Migrations

Create migration that includes:
- Table creation with all fields
- Index creation for performance
- Check constraints for data integrity

---

## Task 65: Create Risk Scheduler

> **Complexity:** Low  
> **Estimated Time:** 2-3 hours  
> **Prerequisites:** Task 64 (ChurnRisk Model), Celery configuration

### Objective

Configure automated weekly execution of churn risk calculations for all active customers, ensuring risk scores remain current without manual intervention.

### Scheduling Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                     RISK SCHEDULER ARCHITECTURE                      │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌─────────────────┐                                                │
│  │   Celery Beat   │                                                │
│  │   (Scheduler)   │                                                │
│  └────────┬────────┘                                                │
│           │ Triggers weekly (Sunday midnight)                        │
│           ▼                                                          │
│  ┌─────────────────────────────────────────────────────┐            │
│  │           calculate_all_churn_risks                  │            │
│  │              (Orchestrator Task)                     │            │
│  └────────────────────────┬────────────────────────────┘            │
│                           │                                          │
│           ┌───────────────┼───────────────┐                         │
│           ▼               ▼               ▼                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                 │
│  │   Batch 1   │  │   Batch 2   │  │   Batch N   │                 │
│  │ (100 custs) │  │ (100 custs) │  │ (remaining) │                 │
│  └─────────────┘  └─────────────┘  └─────────────┘                 │
│           │               │               │                         │
│           ▼               ▼               ▼                         │
│  ┌─────────────────────────────────────────────────────┐            │
│  │              ChurnRisk Model Records                 │            │
│  │               (Database Storage)                     │            │
│  └─────────────────────────────────────────────────────┘            │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### Schedule Configuration

| Setting | Value | Description |
|---------|-------|-------------|
| Schedule | Weekly | Once per week |
| Day | Sunday | Lowest traffic day |
| Time | 00:00 UTC | Midnight UTC |
| Queue | `insights` | Dedicated queue |
| Timeout | 4 hours | Max execution time |
| Retry | 3 attempts | On transient failures |

### Implementation Steps

#### Step 1: Create Celery Task

**Location:** `backend/apps/customer_insights/tasks/churn_tasks.py`

Create the main orchestrator task that:
- Queries all active customers
- Divides customers into batches (100 per batch)
- Dispatches batch processing subtasks
- Tracks overall progress
- Handles errors gracefully

#### Step 2: Create Batch Processing Task

Create a subtask for batch processing that:
- Receives a list of customer IDs
- Loads customer feature data
- Runs churn prediction model
- Creates/updates ChurnRisk records
- Reports batch completion status

#### Step 3: Configure Celery Beat Schedule

**Location:** `backend/config/celery.py`

Add schedule entry with:
- Task name: `calculate_all_churn_risks`
- Crontab: Sunday at midnight
- Queue assignment: `insights`
- Options: expires after 24 hours

#### Step 4: Add Monitoring

Implement task monitoring that includes:
- Start/end logging with timestamps
- Customer count and batch count logging
- Error rate tracking
- Execution duration metrics

### Execution Timeline

```
Sunday 00:00 UTC
    │
    ├── 00:00 - Task triggered by Celery Beat
    │
    ├── 00:01 - Query active customers (~10,000)
    │
    ├── 00:02 - Create 100 batches of 100 customers
    │
    ├── 00:05 - Begin parallel batch processing
    │        │
    │        ├── Batch 1-10: Processing...
    │        ├── Batch 11-20: Processing...
    │        └── ... (concurrent)
    │
    ├── 01:30 - All batches complete (estimated)
    │
    └── 01:31 - Summary logged, task complete
```

### Error Handling Strategy

| Error Type | Handling | Retry |
|------------|----------|-------|
| Database connection | Retry with backoff | Yes (3x) |
| Model prediction failure | Log and skip customer | No |
| Batch timeout | Requeue remaining | Yes (1x) |
| Memory error | Reduce batch size | No |

---

## Task 66: Create Churn API

> **Complexity:** Medium  
> **Estimated Time:** 4-5 hours  
> **Prerequisites:** Task 64 (ChurnRisk Model)

### Objective

Create a RESTful API endpoint that returns churn risk details for a specific customer, enabling real-time access to prediction data.

### API Specification

```
┌─────────────────────────────────────────────────────────────────────┐
│                      CHURN API ENDPOINT                              │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Endpoint: GET /api/insights/churn/{customer_id}                    │
│                                                                      │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │                        REQUEST                                 │  │
│  ├───────────────────────────────────────────────────────────────┤  │
│  │  Method: GET                                                   │  │
│  │  Path Parameter: customer_id (string)                         │  │
│  │  Headers:                                                      │  │
│  │    - Authorization: Bearer <token>                            │  │
│  │    - Content-Type: application/json                           │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                              │                                       │
│                              ▼                                       │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │                        RESPONSE                                │  │
│  ├───────────────────────────────────────────────────────────────┤  │
│  │  Status: 200 OK                                                │  │
│  │  Body:                                                         │  │
│  │    - id: UUID                                                  │  │
│  │    - customer_id: string                                       │  │
│  │    - churn_probability: integer (0-100)                       │  │
│  │    - risk_tier: string (Critical/High/Medium/Low)             │  │
│  │    - key_factors: array of factor objects                     │  │
│  │    - calculated_at: ISO datetime                              │  │
│  │    - is_stale: boolean                                        │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### Response Schema

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | Unique record identifier |
| `customer_id` | String | Customer reference |
| `churn_probability` | Integer | Risk score 0-100 |
| `risk_tier` | String | Classification tier |
| `risk_tier_display` | Object | Tier metadata (color, priority) |
| `key_factors` | Array | Top risk contributors |
| `calculated_at` | ISO DateTime | When calculated |
| `is_stale` | Boolean | True if >7 days old |

### Implementation Steps

#### Step 1: Create API View

**Location:** `backend/apps/customer_insights/api/views/churn_views.py`

Create a view class that:
- Accepts customer_id as path parameter
- Retrieves latest ChurnRisk record for customer
- Returns 404 if customer or risk record not found
- Includes stale indicator in response

#### Step 2: Create Serializer

**Location:** `backend/apps/customer_insights/api/serializers/churn_serializers.py`

Create serializer with:
- All model fields included
- Computed `is_stale` field
- Nested `risk_tier_display` object
- Formatted datetime fields

#### Step 3: Configure URL Route

**Location:** `backend/apps/customer_insights/api/urls.py`

Add URL pattern:
- Path: `churn/<str:customer_id>/`
- Name: `churn-detail`
- View: ChurnDetailView

#### Step 4: Add Authentication

Configure endpoint security:
- Require authenticated requests
- Check user has insights permission
- Validate customer belongs to user's tenant

### Response Examples

#### Success Response (200)

Response body structure:
- Customer risk data with all fields populated
- Risk tier display metadata included
- Key factors array with top 5 factors
- Freshness indicator

#### Not Found Response (404)

Response for missing data:
- Error message indicating customer not found
- Or error indicating no risk calculation exists
- Suggestion to trigger calculation

### API Flow Diagram

```
Client Request                    Server Processing
     │                                  │
     │  GET /api/insights/churn/C123   │
     │─────────────────────────────────▶│
     │                                  │
     │                           ┌──────┴──────┐
     │                           │   Validate   │
     │                           │    Token     │
     │                           └──────┬──────┘
     │                                  │
     │                           ┌──────┴──────┐
     │                           │   Check     │
     │                           │ Permissions │
     │                           └──────┬──────┘
     │                                  │
     │                           ┌──────┴──────┐
     │                           │   Query     │
     │                           │ ChurnRisk   │
     │                           └──────┬──────┘
     │                                  │
     │                           ┌──────┴──────┐
     │                           │  Serialize  │
     │                           │  Response   │
     │                           └──────┬──────┘
     │                                  │
     │  200 OK + Risk Data             │
     │◀─────────────────────────────────│
     │                                  │
```

---

## Task 67: Create At-Risk List

> **Complexity:** Low  
> **Estimated Time:** 3-4 hours  
> **Prerequisites:** Task 66 (Churn API)

### Objective

Create an API endpoint that returns a filtered list of customers at high risk of churn, enabling proactive retention campaigns.

### API Specification

```
┌─────────────────────────────────────────────────────────────────────┐
│                    AT-RISK LIST ENDPOINT                             │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Endpoint: GET /api/insights/churn/at-risk                          │
│                                                                      │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │                      QUERY PARAMETERS                          │  │
│  ├───────────────────────────────────────────────────────────────┤  │
│  │  tier (optional): Filter by specific tier                     │  │
│  │  limit (optional): Max results (default 100)                  │  │
│  │  offset (optional): Pagination offset                         │  │
│  │  sort (optional): Sort field (-probability, -calculated_at)  │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                              │                                       │
│                              ▼                                       │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │                        RESPONSE                                │  │
│  ├───────────────────────────────────────────────────────────────┤  │
│  │  customers: array of at-risk customer objects                 │  │
│  │  total: total count of at-risk customers                      │  │
│  │  by_tier: count breakdown per tier                            │  │
│  │  pagination: next/previous links                              │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### Filter Logic

The endpoint filters customers where `risk_tier >= High`:

| Included Tiers | Probability Range |
|----------------|-------------------|
| Critical | > 80% |
| High | 50% - 80% |

Medium and Low tiers are excluded from the at-risk list.

### Response Schema

| Field | Type | Description |
|-------|------|-------------|
| `customers` | Array | List of at-risk customer records |
| `total` | Integer | Total at-risk customer count |
| `by_tier` | Object | Count breakdown by tier |
| `pagination` | Object | Next/prev page links |

### Customer Object in Response

| Field | Type | Description |
|-------|------|-------------|
| `customer_id` | String | Customer identifier |
| `customer_name` | String | Customer display name |
| `churn_probability` | Integer | Risk score |
| `risk_tier` | String | Critical or High |
| `key_factors` | Array | Top 3 risk factors |
| `calculated_at` | DateTime | Calculation timestamp |

### By-Tier Response Structure

| Field | Type | Description |
|-------|------|-------------|
| `critical` | Integer | Count of Critical tier |
| `high` | Integer | Count of High tier |

### Implementation Steps

#### Step 1: Create List View

**Location:** `backend/apps/customer_insights/api/views/churn_views.py`

Create a list view that:
- Filters ChurnRisk records for Critical and High tiers
- Supports pagination with configurable page size
- Supports optional tier filter parameter
- Orders by probability descending (highest risk first)

#### Step 2: Create List Serializer

Create a serializer that:
- Includes customer basic info (from joined data)
- Limits key_factors to top 3 items
- Excludes verbose fields for list performance
- Includes tier summary statistics

#### Step 3: Add Query Optimization

Implement query optimizations:
- Select only required fields
- Use database aggregation for tier counts
- Index utilization verification
- Pagination without full count (for large datasets)

#### Step 4: Configure URL Route

Add URL pattern:
- Path: `churn/at-risk/`
- Name: `churn-at-risk-list`
- View: ChurnAtRiskListView

### Response Structure Diagram

```
{
    "customers": [
        ┌─────────────────────────────────────────┐
        │  Customer 1 (Critical - 95%)            │
        │  - Top 3 risk factors                   │
        │  - Basic customer info                  │
        ├─────────────────────────────────────────┤
        │  Customer 2 (Critical - 88%)            │
        │  - Top 3 risk factors                   │
        │  - Basic customer info                  │
        ├─────────────────────────────────────────┤
        │  Customer 3 (High - 72%)                │
        │  - Top 3 risk factors                   │
        │  - Basic customer info                  │
        └─────────────────────────────────────────┘
    ],
    
    "total": 156,
    
    "by_tier": {
        ┌─────────────────────────────────────────┐
        │  "critical": 23                         │
        │  "high": 133                            │
        └─────────────────────────────────────────┘
    },
    
    "pagination": {
        "next": "/api/insights/churn/at-risk?offset=100",
        "previous": null
    }
}
```

### Use Cases

| Use Case | Query Parameters | Description |
|----------|------------------|-------------|
| Dashboard widget | `limit=5` | Top 5 at-risk customers |
| Critical only | `tier=critical` | Only critical tier |
| Export all | `limit=1000` | Bulk export |
| Paginated list | `offset=100&limit=100` | Page through results |

---

## Task 68: Verify Churn Prediction

> **Complexity:** Low  
> **Estimated Time:** 3-4 hours  
> **Prerequisites:** Tasks 63-67 complete

### Objective

Validate the complete churn prediction pipeline from feature extraction through API response, ensuring all components work correctly together.

### Verification Scope

```
┌─────────────────────────────────────────────────────────────────────┐
│                   PIPELINE VERIFICATION SCOPE                        │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│   Document 01 Components            Document 02 Components          │
│   ┌─────────────────────┐           ┌─────────────────────┐        │
│   │ Feature Extraction  │──────────▶│   Risk Tiers        │        │
│   └─────────────────────┘           └─────────────────────┘        │
│            │                                  │                     │
│            ▼                                  ▼                     │
│   ┌─────────────────────┐           ┌─────────────────────┐        │
│   │ ML Model Inference  │──────────▶│  ChurnRisk Model    │        │
│   └─────────────────────┘           └─────────────────────┘        │
│            │                                  │                     │
│            ▼                                  ▼                     │
│   ┌─────────────────────┐           ┌─────────────────────┐        │
│   │ Feature Engineering │──────────▶│    Scheduler        │        │
│   └─────────────────────┘           └─────────────────────┘        │
│                                               │                     │
│                                               ▼                     │
│                                     ┌─────────────────────┐        │
│                                     │    API Endpoints    │        │
│                                     └─────────────────────┘        │
│                                                                      │
│   ═══════════════════════════════════════════════════════════════   │
│                    VERIFICATION COVERAGE                             │
│   ═══════════════════════════════════════════════════════════════   │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### Test Categories

| Category | Tests | Focus |
|----------|-------|-------|
| Unit Tests | 15+ | Individual component logic |
| Integration Tests | 8+ | Component interactions |
| End-to-End Tests | 5+ | Full pipeline flow |
| Performance Tests | 3+ | Speed and resource usage |

### Implementation Steps

#### Step 1: Create Unit Tests

**Location:** `backend/apps/customer_insights/tests/test_churn_unit.py`

Create tests for:
- Risk tier classification logic
- ChurnRisk model validation
- Serializer output format
- Manager query methods

#### Step 2: Create Integration Tests

**Location:** `backend/apps/customer_insights/tests/test_churn_integration.py`

Create tests for:
- Feature extraction to model prediction flow
- Prediction to database storage flow
- Database to API response flow
- Scheduler task execution

#### Step 3: Create End-to-End Tests

**Location:** `backend/apps/customer_insights/tests/test_churn_e2e.py`

Create tests for:
- Full prediction pipeline for test customer
- API endpoint authentication and response
- At-risk list filtering and pagination
- Stale data handling

#### Step 4: Create Performance Tests

**Location:** `backend/apps/customer_insights/tests/test_churn_performance.py`

Create tests for:
- Batch processing throughput
- API response time
- Database query efficiency
- Memory usage during bulk operations

### Test Scenarios

#### Scenario 1: New Customer Prediction

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Create test customer with transaction history | Customer created |
| 2 | Trigger churn prediction task | Task completes |
| 3 | Query ChurnRisk for customer | Record exists |
| 4 | Verify probability in range | 0-100 integer |
| 5 | Verify tier matches probability | Correct tier |

#### Scenario 2: API Response Validation

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Request churn risk via API | 200 response |
| 2 | Verify all fields present | Complete schema |
| 3 | Verify tier display metadata | Color and priority |
| 4 | Verify key_factors format | Valid array |

#### Scenario 3: At-Risk List Accuracy

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Create customers across all tiers | Test data ready |
| 2 | Query at-risk endpoint | Only High/Critical |
| 3 | Verify tier counts | Accurate by_tier |
| 4 | Test pagination | Correct pages |

### Verification Checklist

```
┌─────────────────────────────────────────────────────────────────────┐
│                    VERIFICATION CHECKLIST                            │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  □ Risk tier thresholds correctly implemented                       │
│    ├── □ Critical: >80%                                             │
│    ├── □ High: 50-80%                                               │
│    ├── □ Medium: 20-50%                                             │
│    └── □ Low: <20%                                                  │
│                                                                      │
│  □ ChurnRisk model functions correctly                              │
│    ├── □ UUID generation works                                      │
│    ├── □ Probability validation enforced                            │
│    ├── □ Tier auto-calculated on save                               │
│    └── □ Key factors stored as JSON                                 │
│                                                                      │
│  □ Scheduler executes properly                                      │
│    ├── □ Weekly schedule configured                                 │
│    ├── □ All customers processed                                    │
│    ├── □ Batch processing works                                     │
│    └── □ Errors handled gracefully                                  │
│                                                                      │
│  □ Individual API works                                             │
│    ├── □ Returns correct customer data                              │
│    ├── □ 404 for missing customer                                   │
│    ├── □ Authentication required                                    │
│    └── □ Stale indicator accurate                                   │
│                                                                      │
│  □ At-risk list API works                                           │
│    ├── □ Filters High and Critical only                             │
│    ├── □ Tier counts accurate                                       │
│    ├── □ Pagination functional                                      │
│    └── □ Sorting by probability                                     │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### Performance Benchmarks

| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| Single prediction | < 200ms | Timer in test |
| Batch of 100 | < 5s | Task duration |
| Full weekly run (10k) | < 2 hours | Task monitoring |
| API response time | < 100ms | Request timer |
| At-risk query (1k results) | < 500ms | Query profiling |

---

## API Reference Summary

### Endpoints Overview

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/insights/churn/{customer_id}` | GET | Individual churn risk |
| `/api/insights/churn/at-risk` | GET | At-risk customer list |

### Authentication

All endpoints require:
- Bearer token authentication
- `insights.view` permission
- Tenant context from request

### Error Responses

| Status | Reason | Response |
|--------|--------|----------|
| 401 | Unauthorized | Missing or invalid token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Customer or risk data missing |
| 500 | Server Error | Internal processing error |

---

## Integration Points

### Upstream Dependencies

| Component | Source | Purpose |
|-----------|--------|---------|
| Customer Data | Customer Module | Customer identifiers |
| Transaction History | Sales Module | Purchase patterns |
| ML Model | Document 01 | Prediction scores |
| Feature Vectors | Document 01 | Input features |

### Downstream Consumers

| Consumer | Usage |
|----------|-------|
| Dashboard | Display at-risk customers |
| Notifications | Alert on critical customers |
| Marketing | Retention campaign targeting |
| Reports | Churn risk analytics |

---

## Document Summary

This document establishes the complete risk classification and API layer for churn prediction:

| Task | Deliverable | Status |
|------|-------------|--------|
| 63 | Risk tier definitions | Ready |
| 64 | ChurnRisk database model | Ready |
| 65 | Weekly scheduler | Ready |
| 66 | Individual churn API | Ready |
| 67 | At-risk list API | Ready |
| 68 | Pipeline verification | Ready |

### Next Steps

After completing this group:
1. Proceed to Group-E: Insights Dashboard
2. Integrate churn data into unified dashboard
3. Configure alerting for critical customers
4. Enable retention workflow automation

---

## Appendix: Complete File Structure

```
backend/apps/customer_insights/
├── __init__.py
├── models/
│   ├── __init__.py
│   └── churn_risk.py              # Task 64
├── analytics/
│   ├── __init__.py
│   └── churn_predictor.py         # Tasks 63, 65
├── tasks/
│   ├── __init__.py
│   └── churn_tasks.py             # Task 65
├── api/
│   ├── __init__.py
│   ├── views/
│   │   ├── __init__.py
│   │   └── churn_views.py         # Tasks 66, 67
│   ├── serializers/
│   │   ├── __init__.py
│   │   └── churn_serializers.py   # Tasks 66, 67
│   └── urls.py
├── constants.py                    # Task 63
└── tests/
    ├── __init__.py
    ├── test_churn_unit.py         # Task 68
    ├── test_churn_integration.py  # Task 68
    ├── test_churn_e2e.py          # Task 68
    └── test_churn_performance.py  # Task 68
```

---

*Document created: Phase 10, SubPhase 12, Group D, Document 02*  
*Tasks covered: 63, 64, 65, 66, 67, 68*
