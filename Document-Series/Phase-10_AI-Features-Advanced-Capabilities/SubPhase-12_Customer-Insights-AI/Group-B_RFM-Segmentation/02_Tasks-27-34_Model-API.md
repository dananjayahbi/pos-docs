# Tasks 27-34: Segment Model and API

> **Phase:** 10 - AI Features & Advanced Capabilities  
> **SubPhase:** 12 - Customer Insights AI (FINAL SUBPHASE)  
> **Group:** B - RFM Segmentation  
> **Document:** 02 of 02  
> **Tasks Covered:** 27, 28, 29, 30, 31, 32, 33, 34

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-17-26_RFM-Calculator.md](01_Tasks-17-26_RFM-Calculator.md)
- **→ Next Group:** [../Group-C_LTV-Prediction/](../Group-C_LTV-Prediction/)

---

## Document Overview

This document covers the remaining RFM segmentation tasks focused on defining additional customer segments, creating persistence models, scheduling automated calculations, and exposing segment data through REST APIs.

### Tasks at a Glance

| Task | Title | Complexity | Focus Area |
|------|-------|------------|------------|
| 27 | Create New Segment | Low | Segment Definition |
| 28 | Create Promising Segment | Low | Segment Definition |
| 29 | Create CustomerSegment Model | Medium | Data Persistence |
| 30 | Create Segment History | Low | Change Tracking |
| 31 | Create Segment Scheduler | Low | Automation |
| 32 | Create Segment API | Medium | API Endpoint |
| 33 | Create Segment Stats | Low | Analytics Endpoint |
| 34 | Verify RFM Segmentation | Low | Testing & Validation |

### Document Scope

```
┌─────────────────────────────────────────────────────────────────┐
│                    RFM SEGMENTATION - PART 2                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────┐    ┌──────────────────┐                   │
│  │   SEGMENTS (2)   │    │  MODELS (2)      │                   │
│  ├──────────────────┤    ├──────────────────┤                   │
│  │ • New Segment    │    │ • CustomerSegment│                   │
│  │ • Promising      │    │ • SegmentHistory │                   │
│  └──────────────────┘    └──────────────────┘                   │
│                                                                 │
│  ┌──────────────────┐    ┌──────────────────┐                   │
│  │   SCHEDULER      │    │  API ENDPOINTS   │                   │
│  ├──────────────────┤    ├──────────────────┤                   │
│  │ • Celery Beat    │    │ • Segment List   │                   │
│  │ • Weekly Sunday  │    │ • Segment Stats  │                   │
│  └──────────────────┘    └──────────────────┘                   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Expected Deliverables

### File Structure

```
backend/
└── apps/
    └── customer_insights/
        ├── models/
        │   ├── __init__.py
        │   └── customer_segment.py      # CustomerSegment, SegmentHistory
        ├── analytics/
        │   └── rfm.py                   # Add New & Promising segments
        ├── tasks/
        │   └── segment_tasks.py         # Scheduler task
        ├── api/
        │   └── segment_views.py         # API endpoints
        └── tests/
            └── test_rfm_pipeline.py     # Verification tests
```

### Deliverables Summary

| Deliverable | File Location | Description |
|-------------|---------------|-------------|
| New Segment Definition | `analytics/rfm.py` | Segment rules for new customers |
| Promising Segment Definition | `analytics/rfm.py` | Segment rules for promising customers |
| CustomerSegment Model | `models/customer_segment.py` | Stores current segment data |
| SegmentHistory Model | `models/customer_segment.py` | Tracks segment changes over time |
| Segment Scheduler | `tasks/segment_tasks.py` | Celery beat weekly task |
| Segment List API | `api/segment_views.py` | GET endpoint for segments |
| Segment Stats API | `api/segment_views.py` | GET endpoint for statistics |
| Verification Tests | `tests/test_rfm_pipeline.py` | End-to-end pipeline tests |

---

## Task 27: Create New Segment

### Task Information

| Attribute | Value |
|-----------|-------|
| Task ID | 27 |
| Title | Create New Segment |
| Complexity | Low |
| Estimated Duration | 30 minutes |
| Prerequisites | Task 26 (Segment Rules) |

### Objective

Define the "New" segment to identify recently acquired customers who require welcome nurture campaigns to build engagement and loyalty.

### New Segment Definition

```
┌─────────────────────────────────────────────────────────────────┐
│                      NEW SEGMENT PROFILE                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Segment Name: NEW                                              │
│  Customer Type: Recently Acquired                               │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                    RFM SCORE CRITERIA                   │    │
│  ├─────────────────────────────────────────────────────────┤    │
│  │  Recency (R):     4-5  (Very Recent)                    │    │
│  │  Frequency (F):   1    (First Purchase Only)            │    │
│  │  Monetary (M):    1-2  (Low Spend)                      │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  Recommended Action: Welcome Nurture Campaign                   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Segment Characteristics

| Characteristic | Description |
|----------------|-------------|
| Purchase Timing | Made first purchase very recently |
| Purchase Count | Single purchase only |
| Spending Level | Below average or low |
| Engagement Level | Unknown - needs nurturing |
| Churn Risk | Medium - depends on experience |
| Growth Potential | High if properly nurtured |

### Implementation Instructions

1. **Add to Segment Rules**
   - Open the RFM calculator module created in previous tasks
   - Locate the segment classification logic
   - Add "NEW" segment as a new classification option
   - Insert after existing segments but before catch-all logic

2. **Define Score Ranges**
   - Set R score acceptable range: 4 to 5 (inclusive)
   - Set F score acceptable value: 1 (exactly)
   - Set M score acceptable range: 1 to 2 (inclusive)
   - All three conditions must be true for classification

3. **Set Segment Priority**
   - Position in evaluation order: After "At Risk", before "Lost"
   - Ensure no overlap with existing segment criteria
   - New segment should not conflict with other definitions

### Recommended Actions Table

| Action Category | Specific Actions |
|-----------------|------------------|
| Welcome Series | Send welcome email sequence over first 7 days |
| Education | Provide product guides and usage tips |
| Incentives | Offer small discount on second purchase |
| Engagement | Invite to join loyalty program |
| Feedback | Request first purchase review |

### Acceptance Criteria

- [ ] NEW segment defined in RFM calculator
- [ ] Score criteria correctly implemented (R:4-5, F:1, M:1-2)
- [ ] Segment does not overlap with other definitions
- [ ] Classification returns "NEW" for matching customers
- [ ] Welcome nurture action associated with segment

---

## Task 28: Create Promising Segment

### Task Information

| Attribute | Value |
|-----------|-------|
| Task ID | 28 |
| Title | Create Promising Segment |
| Complexity | Low |
| Estimated Duration | 30 minutes |
| Prerequisites | Task 27 (New Segment) |

### Objective

Define the "Promising" segment to identify customers showing early signs of engagement who should receive targeted campaigns to increase their loyalty.

### Promising Segment Definition

```
┌─────────────────────────────────────────────────────────────────┐
│                   PROMISING SEGMENT PROFILE                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Segment Name: PROMISING                                        │
│  Customer Type: Early Engagers                                  │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                    RFM SCORE CRITERIA                   │    │
│  ├─────────────────────────────────────────────────────────┤    │
│  │  Recency (R):     3-4  (Recent to Fairly Recent)        │    │
│  │  Frequency (F):   1-3  (Low to Moderate Purchases)      │    │
│  │  Monetary (M):    1-3  (Low to Moderate Spend)          │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  Recommended Action: Engagement Campaign                        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Segment Characteristics

| Characteristic | Description |
|----------------|-------------|
| Purchase Timing | Purchased recently but not very recently |
| Purchase Count | Few purchases, showing initial interest |
| Spending Level | Low to moderate, not yet committed |
| Engagement Level | Developing - needs encouragement |
| Churn Risk | Medium-Low with proper engagement |
| Growth Potential | Very High - prime for development |

### Implementation Instructions

1. **Add to Segment Rules**
   - Continue in the RFM calculator module
   - Add "PROMISING" segment after "NEW" segment
   - Define as broader criteria to capture developing customers

2. **Define Score Ranges**
   - Set R score acceptable range: 3 to 4 (inclusive)
   - Set F score acceptable range: 1 to 3 (inclusive)
   - Set M score acceptable range: 1 to 3 (inclusive)
   - All three conditions must be true for classification

3. **Handle Overlap Prevention**
   - Ensure evaluation order prevents NEW customers from being classified as PROMISING
   - Check R score (3-4) does not overlap incorrectly with NEW (4-5)
   - Consider edge case: R=4, F=1, M=1 should be NEW not PROMISING

### Complete Segment Matrix

| Segment | R Score | F Score | M Score | Priority |
|---------|---------|---------|---------|----------|
| Champions | 4-5 | 4-5 | 4-5 | 1 |
| Loyal | 3-5 | 3-5 | 3-5 | 2 |
| At Risk | 1-2 | 3-5 | 3-5 | 3 |
| Lost | 1-2 | 1-2 | 1-2 | 4 |
| **New** | **4-5** | **1** | **1-2** | **5** |
| **Promising** | **3-4** | **1-3** | **1-3** | **6** |

### Recommended Actions Table

| Action Category | Specific Actions |
|-----------------|------------------|
| Engagement Campaign | Personalized product recommendations |
| Value Building | Exclusive early access to sales |
| Education | Category-specific content |
| Community | Social proof and reviews |
| Incentives | Tiered rewards for increased frequency |

### Acceptance Criteria

- [ ] PROMISING segment defined in RFM calculator
- [ ] Score criteria correctly implemented (R:3-4, F:1-3, M:1-3)
- [ ] Evaluation order prevents overlap with NEW segment
- [ ] Segment captures early engagers correctly
- [ ] Engagement campaign action associated with segment

---

## Task 29: Create CustomerSegment Model

### Task Information

| Attribute | Value |
|-----------|-------|
| Task ID | 29 |
| Title | Create CustomerSegment Model |
| Complexity | Medium |
| Estimated Duration | 1.5 hours |
| Prerequisites | Tasks 27-28 (Segment Definitions) |

### Objective

Create a Django model to persist customer RFM segments, enabling efficient querying, reporting, and API access to segmentation data.

### Model Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    CustomerSegment Model                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌───────────────┐    ┌───────────────┐    ┌───────────────┐   │
│  │      id       │    │  customer_id  │    │   segment     │   │
│  │    (UUID)     │    │   (String)    │    │   (String)    │   │
│  │   Primary     │    │   Indexed     │    │   Indexed     │   │
│  └───────────────┘    └───────────────┘    └───────────────┘   │
│                                                                 │
│  ┌───────────────┐    ┌───────────────┐    ┌───────────────┐   │
│  │   r_score     │    │   f_score     │    │   m_score     │   │
│  │  (Int 1-5)    │    │  (Int 1-5)    │    │  (Int 1-5)    │   │
│  └───────────────┘    └───────────────┘    └───────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    calculated_at                        │   │
│  │                     (DateTime)                          │   │
│  │                      Indexed                            │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Field Specifications

| Field | Type | Constraints | Index | Description |
|-------|------|-------------|-------|-------------|
| `id` | UUID | Primary Key, Auto-generated | Primary | Unique identifier |
| `customer_id` | String(36) | Not Null, Foreign Key | Yes | Reference to customer |
| `r_score` | Integer | Range 1-5, Not Null | No | Recency score |
| `f_score` | Integer | Range 1-5, Not Null | No | Frequency score |
| `m_score` | Integer | Range 1-5, Not Null | No | Monetary score |
| `segment` | String(20) | Not Null, Choices | Yes | Segment classification |
| `calculated_at` | DateTime | Not Null, Auto | Yes | Calculation timestamp |

### Segment Choices

| Choice Value | Display Name | Description |
|--------------|--------------|-------------|
| `CHAMPIONS` | Champions | Best customers |
| `LOYAL` | Loyal Customers | Regular buyers |
| `AT_RISK` | At Risk | May churn soon |
| `LOST` | Lost | Already churned |
| `NEW` | New Customers | Recent first-time buyers |
| `PROMISING` | Promising | Developing customers |

### Implementation Instructions

1. **Create Model File**
   - Create file at `models/customer_segment.py`
   - Import UUID field from Django
   - Import tenant-aware base model if using multi-tenancy

2. **Define CustomerSegment Class**
   - Inherit from appropriate base model
   - Add all fields as specified in table above
   - Define field validators for score range (1-5)

3. **Add Segment Choices**
   - Define choices as class constants
   - Use TextChoices or tuple format
   - Include all six segment types

4. **Configure Meta Options**
   - Set database table name
   - Add ordering by calculated_at descending
   - Define unique constraint on customer_id (latest record per customer)

5. **Add Database Indexes**
   - Create index on customer_id
   - Create index on segment
   - Create index on calculated_at
   - Consider composite index on (customer_id, calculated_at)

6. **Implement Utility Methods**
   - Add method to get combined RFM score string
   - Add method to check if segment changed from previous
   - Add class method for bulk upsert operations

### Model Relationships

```
┌──────────────────────────────────────────────────────────────────┐
│                      MODEL RELATIONSHIPS                         │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐         ┌─────────────────┐                    │
│  │   Customer   │ ──1:N── │ CustomerSegment │                    │
│  │              │         │                 │                    │
│  │  (External)  │         │  (This Model)   │                    │
│  └──────────────┘         └────────┬────────┘                    │
│                                    │                             │
│                                    │ 1:N (triggers)              │
│                                    ▼                             │
│                           ┌─────────────────┐                    │
│                           │ SegmentHistory  │                    │
│                           │                 │                    │
│                           │  (Task 30)      │                    │
│                           └─────────────────┘                    │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

### Acceptance Criteria

- [ ] Model file created at correct location
- [ ] All fields defined with correct types and constraints
- [ ] Score validators enforce 1-5 range
- [ ] Segment choices defined for all six types
- [ ] Database indexes created for query optimization
- [ ] Model registered in admin (optional)
- [ ] Migration generated and tested

---

## Task 30: Create Segment History

### Task Information

| Attribute | Value |
|-----------|-------|
| Task ID | 30 |
| Title | Create Segment History |
| Complexity | Low |
| Estimated Duration | 45 minutes |
| Prerequisites | Task 29 (CustomerSegment Model) |

### Objective

Create a SegmentHistory model to track customer segment transitions over time, enabling churn analysis and segment migration reporting.

### History Model Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    SegmentHistory Model                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌───────────────┐    ┌───────────────┐    ┌───────────────┐   │
│  │      id       │    │  customer_id  │    │ from_segment  │   │
│  │    (UUID)     │    │   (String)    │    │   (String)    │   │
│  │   Primary     │    │   Indexed     │    │   Nullable    │   │
│  └───────────────┘    └───────────────┘    └───────────────┘   │
│                                                                 │
│  ┌───────────────┐    ┌───────────────┐    ┌───────────────┐   │
│  │  to_segment   │    │ changed_at    │    │    notes      │   │
│  │   (String)    │    │  (DateTime)   │    │   (Text)      │   │
│  │   Not Null    │    │   Indexed     │    │   Optional    │   │
│  └───────────────┘    └───────────────┘    └───────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Field Specifications

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID | Primary Key | Unique identifier |
| `customer_id` | String(36) | Not Null, Indexed | Customer reference |
| `from_segment` | String(20) | Nullable | Previous segment (null for first) |
| `to_segment` | String(20) | Not Null | New segment |
| `changed_at` | DateTime | Not Null, Indexed | Transition timestamp |
| `notes` | Text | Optional | Reason or context for change |

### Segment Transition Matrix

| From \ To | Champions | Loyal | At Risk | Lost | New | Promising |
|-----------|-----------|-------|---------|------|-----|-----------|
| Champions | - | ⚠️ | ⚠️ | 🔴 | - | - |
| Loyal | ✅ | - | ⚠️ | 🔴 | - | - |
| At Risk | ✅ | ✅ | - | 🔴 | - | - |
| Lost | ✅ | ✅ | - | - | - | - |
| New | ✅ | ✅ | ⚠️ | 🔴 | - | ✅ |
| Promising | ✅ | ✅ | ⚠️ | 🔴 | - | - |
| (None) | ✅ | ✅ | ⚠️ | - | ✅ | ✅ |

Legend: ✅ Positive | ⚠️ Concern | 🔴 Alert | - N/A

### Implementation Instructions

1. **Add SegmentHistory Model**
   - Add to same file as CustomerSegment
   - Define all fields per specification
   - Use same segment choices as CustomerSegment

2. **Configure Meta Options**
   - Order by changed_at descending
   - Set appropriate table name
   - Add get_latest_by option

3. **Create Signal Handler**
   - Listen for CustomerSegment post_save signal
   - Compare new segment with previous record
   - Create SegmentHistory entry if segment changed

4. **Add Query Methods**
   - Add class method to get customer transition history
   - Add method to get segment migration report
   - Add method to identify at-risk transitions

5. **Track First Assignment**
   - When from_segment is null, this is first assignment
   - Track initial segment distribution
   - Do not trigger alerts on initial assignment

### History Trigger Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                   HISTORY TRIGGER FLOW                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────┐                                               │
│  │ RFM Calcul.  │                                               │
│  │  Runs        │                                               │
│  └──────┬───────┘                                               │
│         │                                                       │
│         ▼                                                       │
│  ┌──────────────┐                                               │
│  │ CustomerSeg. │                                               │
│  │  Updated     │                                               │
│  └──────┬───────┘                                               │
│         │                                                       │
│         ▼                                                       │
│  ┌──────────────┐     ┌──────────────┐                          │
│  │ Check Prev.  │────▶│ Segment Same │──▶ No Action             │
│  │   Segment    │     │      ?       │                          │
│  └──────────────┘     └──────┬───────┘                          │
│                              │ Different                        │
│                              ▼                                  │
│                       ┌──────────────┐                          │
│                       │ Create       │                          │
│                       │ History Rec. │                          │
│                       └──────────────┘                          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Acceptance Criteria

- [ ] SegmentHistory model created with all fields
- [ ] Signal handler creates history on segment change
- [ ] First assignment tracked with null from_segment
- [ ] Same segment updates do not create history entries
- [ ] Query methods for migration analysis
- [ ] Migration generated and tested

---

## Task 31: Create Segment Scheduler

### Task Information

| Attribute | Value |
|-----------|-------|
| Task ID | 31 |
| Title | Create Segment Scheduler |
| Complexity | Low |
| Estimated Duration | 45 minutes |
| Prerequisites | Tasks 29-30 (Models) |

### Objective

Configure a Celery Beat scheduled task to automatically recalculate customer RFM segments on a weekly basis every Sunday.

### Scheduler Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    SEGMENT SCHEDULER                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                    Celery Beat                           │   │
│  │                                                          │   │
│  │   Schedule: Every Sunday at 02:00 AM                     │   │
│  │   Timezone: Server local (or UTC)                        │   │
│  │                                                          │   │
│  └────────────────────────┬─────────────────────────────────┘   │
│                           │                                     │
│                           ▼                                     │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                  Segment Task                            │   │
│  │                                                          │   │
│  │   1. Query all active customers                          │   │
│  │   2. Calculate RFM scores for each                       │   │
│  │   3. Assign segments based on rules                      │   │
│  │   4. Update CustomerSegment records                      │   │
│  │   5. Trigger SegmentHistory for changes                  │   │
│  │                                                          │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Schedule Configuration

| Setting | Value | Description |
|---------|-------|-------------|
| Task Name | `calculate_rfm_segments` | Unique task identifier |
| Schedule | Crontab | Every Sunday at 2 AM |
| Day of Week | 0 (Sunday) | Weekly execution |
| Hour | 2 | 2:00 AM local time |
| Minute | 0 | Start of hour |
| Timezone | UTC or Local | Consistent execution |

### Implementation Instructions

1. **Create Task Function**
   - Create file at `tasks/segment_tasks.py`
   - Define Celery task for segment calculation
   - Import RFM calculator from analytics module
   - Import CustomerSegment model

2. **Implement Task Logic**
   - Query all customers with transactions
   - Process in batches to manage memory
   - Calculate RFM scores using existing calculator
   - Bulk upsert CustomerSegment records
   - Log progress and completion

3. **Configure Celery Beat Schedule**
   - Add to project's celery beat schedule
   - Use crontab for weekly Sunday execution
   - Set appropriate timeout for long-running task

4. **Add Task Options**
   - Set task retry policy for failures
   - Configure result expiration
   - Add task routing if using multiple queues

5. **Handle Multi-Tenancy**
   - If multi-tenant, iterate through all tenants
   - Switch schema context for each tenant
   - Maintain separate schedules or single global schedule

### Celery Beat Configuration

| Parameter | Value | Purpose |
|-----------|-------|---------|
| `task` | Task import path | Which task to run |
| `schedule` | `crontab(hour=2, minute=0, day_of_week=0)` | When to run |
| `options` | `{'queue': 'analytics'}` | Task routing |
| `args` | `()` | Positional arguments |
| `kwargs` | `{}` | Keyword arguments |

### Task Execution Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    TASK EXECUTION FLOW                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  START                                                          │
│    │                                                            │
│    ▼                                                            │
│  ┌──────────────┐                                               │
│  │ Get Active   │                                               │
│  │  Customers   │                                               │
│  └──────┬───────┘                                               │
│         │                                                       │
│         ▼                                                       │
│  ┌──────────────┐                                               │
│  │ Batch Loop   │◀───────────────────┐                          │
│  │ (1000 each)  │                    │                          │
│  └──────┬───────┘                    │                          │
│         │                            │                          │
│         ▼                            │                          │
│  ┌──────────────┐    ┌──────────────┐│                          │
│  │ Calculate    │───▶│ Update       ││                          │
│  │ RFM Scores   │    │ Segments     │┘                          │
│  └──────────────┘    └──────┬───────┘                           │
│                             │                                   │
│                             ▼                                   │
│                      ┌──────────────┐                           │
│                      │ More Batches │──Yes──▶ Loop              │
│                      │      ?       │                           │
│                      └──────┬───────┘                           │
│                             │ No                                │
│                             ▼                                   │
│                      ┌──────────────┐                           │
│                      │ Log Summary  │                           │
│                      │ & Complete   │                           │
│                      └──────────────┘                           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Monitoring Recommendations

| Metric | Alert Threshold | Action |
|--------|-----------------|--------|
| Execution Time | > 1 hour | Investigate slow query |
| Customer Count | 0 | Check data source |
| Failure Rate | > 10% | Review error logs |
| Segment Distribution | Major shift | Review for anomalies |

### Acceptance Criteria

- [ ] Celery task created for segment calculation
- [ ] Task registered in Celery Beat schedule
- [ ] Schedule set for weekly Sunday 2 AM
- [ ] Batch processing implemented for scalability
- [ ] Error handling and retry logic configured
- [ ] Logging for monitoring and debugging

---

## Task 32: Create Segment API

### Task Information

| Attribute | Value |
|-----------|-------|
| Task ID | 32 |
| Title | Create Segment API |
| Complexity | Medium |
| Estimated Duration | 1.5 hours |
| Prerequisites | Tasks 29-31 (Models, Scheduler) |

### Objective

Create a REST API endpoint to retrieve customer segment data with filtering capabilities for segment type and date range.

### API Specification

```
┌─────────────────────────────────────────────────────────────────┐
│                    SEGMENT LIST API                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Endpoint:  GET /api/insights/segments                          │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                    Query Parameters                     │    │
│  ├─────────────────────────────────────────────────────────┤    │
│  │  segment      - Filter by segment name                  │    │
│  │  start_date   - Filter from date (YYYY-MM-DD)          │    │
│  │  end_date     - Filter to date (YYYY-MM-DD)            │    │
│  │  page         - Page number for pagination              │    │
│  │  page_size    - Results per page (default: 50)         │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  Returns: Paginated list of CustomerSegment records             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Endpoint Details

| Attribute | Value |
|-----------|-------|
| Method | GET |
| Path | `/api/insights/segments` |
| Authentication | Required (Token/Session) |
| Permissions | `view_customersegment` |
| Rate Limit | 100 requests/minute |
| Response Format | JSON |

### Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `segment` | String | No | All | Filter by segment name |
| `start_date` | Date | No | 30 days ago | Date range start |
| `end_date` | Date | No | Today | Date range end |
| `page` | Integer | No | 1 | Pagination page number |
| `page_size` | Integer | No | 50 | Results per page (max 100) |

### Response Structure

| Field | Type | Description |
|-------|------|-------------|
| `count` | Integer | Total matching records |
| `next` | URL/Null | Next page URL |
| `previous` | URL/Null | Previous page URL |
| `results` | Array | List of segment objects |
| `results[].id` | UUID | Segment record ID |
| `results[].customer_id` | String | Customer reference |
| `results[].r_score` | Integer | Recency score (1-5) |
| `results[].f_score` | Integer | Frequency score (1-5) |
| `results[].m_score` | Integer | Monetary score (1-5) |
| `results[].segment` | String | Segment classification |
| `results[].calculated_at` | DateTime | Calculation timestamp |

### Implementation Instructions

1. **Create View Class**
   - Create file at `api/segment_views.py`
   - Define ListAPIView for segment listing
   - Set queryset to CustomerSegment model
   - Configure pagination class

2. **Create Serializer**
   - Define CustomerSegmentSerializer
   - Include all model fields
   - Add computed field for combined RFM score

3. **Implement Filtering**
   - Create filter class for query parameters
   - Support segment name exact match
   - Support date range filtering on calculated_at
   - Validate date format

4. **Add Authentication**
   - Require authentication (Token or Session)
   - Add permission check for viewing segments
   - Handle unauthorized access with 401/403

5. **Configure URL Routing**
   - Add URL pattern in insights app URLs
   - Include in main API router
   - Set appropriate URL namespace

### API Request/Response Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    API REQUEST FLOW                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Client                                                         │
│    │                                                            │
│    │ GET /api/insights/segments?segment=CHAMPIONS               │
│    ▼                                                            │
│  ┌──────────────┐                                               │
│  │ Auth Check   │──Fail──▶ 401 Unauthorized                     │
│  └──────┬───────┘                                               │
│         │ Pass                                                  │
│         ▼                                                       │
│  ┌──────────────┐                                               │
│  │ Permission   │──Fail──▶ 403 Forbidden                        │
│  │   Check      │                                               │
│  └──────┬───────┘                                               │
│         │ Pass                                                  │
│         ▼                                                       │
│  ┌──────────────┐                                               │
│  │ Parse &      │                                               │
│  │ Validate     │                                               │
│  │ Parameters   │                                               │
│  └──────┬───────┘                                               │
│         │                                                       │
│         ▼                                                       │
│  ┌──────────────┐                                               │
│  │ Query        │                                               │
│  │ Database     │                                               │
│  └──────┬───────┘                                               │
│         │                                                       │
│         ▼                                                       │
│  ┌──────────────┐                                               │
│  │ Serialize &  │                                               │
│  │ Paginate     │                                               │
│  └──────┬───────┘                                               │
│         │                                                       │
│         ▼                                                       │
│     200 OK + JSON                                               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Example Request/Response

**Request:**
```
GET /api/insights/segments?segment=CHAMPIONS&page_size=10
Authorization: Token abc123...
```

**Response Fields:**
| Field Path | Example Value |
|------------|---------------|
| `count` | 156 |
| `next` | `/api/insights/segments?segment=CHAMPIONS&page=2` |
| `results[0].id` | `550e8400-e29b-41d4-a716-446655440000` |
| `results[0].customer_id` | `cust_12345` |
| `results[0].r_score` | 5 |
| `results[0].f_score` | 5 |
| `results[0].m_score` | 4 |
| `results[0].segment` | `CHAMPIONS` |
| `results[0].calculated_at` | `2026-01-31T02:00:00Z` |

### Acceptance Criteria

- [ ] API endpoint accessible at `/api/insights/segments`
- [ ] Segment filter works correctly
- [ ] Date range filter works correctly
- [ ] Pagination implemented and functional
- [ ] Authentication required for access
- [ ] Response matches expected structure

---

## Task 33: Create Segment Stats

### Task Information

| Attribute | Value |
|-----------|-------|
| Task ID | 33 |
| Title | Create Segment Stats |
| Complexity | Low |
| Estimated Duration | 45 minutes |
| Prerequisites | Task 32 (Segment API) |

### Objective

Create an API endpoint that returns aggregate statistics showing the count of customers in each segment, providing a quick overview of segment distribution.

### API Specification

```
┌─────────────────────────────────────────────────────────────────┐
│                    SEGMENT STATS API                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Endpoint:  GET /api/insights/segments/stats                    │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                    Response Format                      │    │
│  ├─────────────────────────────────────────────────────────┤    │
│  │  {                                                      │    │
│  │    "total": 5420,                                       │    │
│  │    "calculated_at": "2026-01-26T02:00:00Z",            │    │
│  │    "segments": {                                        │    │
│  │      "champions": 542,                                  │    │
│  │      "loyal": 1084,                                     │    │
│  │      "at_risk": 813,                                    │    │
│  │      "lost": 1626,                                      │    │
│  │      "new": 542,                                        │    │
│  │      "promising": 813                                   │    │
│  │    }                                                    │    │
│  │  }                                                      │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Endpoint Details

| Attribute | Value |
|-----------|-------|
| Method | GET |
| Path | `/api/insights/segments/stats` |
| Authentication | Required |
| Permissions | `view_customersegment` |
| Rate Limit | 200 requests/minute |
| Response Format | JSON |

### Response Structure

| Field | Type | Description |
|-------|------|-------------|
| `total` | Integer | Total customers with segments |
| `calculated_at` | DateTime | Most recent calculation time |
| `segments` | Object | Segment counts by name |
| `segments.champions` | Integer | Count of Champions |
| `segments.loyal` | Integer | Count of Loyal customers |
| `segments.at_risk` | Integer | Count of At Risk customers |
| `segments.lost` | Integer | Count of Lost customers |
| `segments.new` | Integer | Count of New customers |
| `segments.promising` | Integer | Count of Promising customers |

### Optional Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `as_of_date` | Date | No | Latest | Get stats as of specific date |
| `include_percentages` | Boolean | No | false | Include percentage breakdown |

### Extended Response (with percentages)

| Field | Type | Example |
|-------|------|---------|
| `segments.champions.count` | Integer | 542 |
| `segments.champions.percentage` | Float | 10.0 |
| `segments.loyal.count` | Integer | 1084 |
| `segments.loyal.percentage` | Float | 20.0 |
| ... | ... | ... |

### Implementation Instructions

1. **Create Stats View**
   - Add to existing `segment_views.py`
   - Define APIView or simple function view
   - No pagination needed (single aggregate response)

2. **Implement Aggregation Query**
   - Query CustomerSegment with latest calculated_at per customer
   - Use Django's aggregation/annotation
   - Group by segment and count
   - Get most recent calculation timestamp

3. **Build Response**
   - Create response dictionary
   - Include total count
   - Include breakdown by each segment type
   - Handle segments with zero customers

4. **Add Caching**
   - Cache response for appropriate duration (e.g., 5 minutes)
   - Invalidate cache when new segments calculated
   - Use cache key specific to tenant if multi-tenant

5. **Configure URL**
   - Add URL pattern for stats endpoint
   - Ensure it doesn't conflict with segment list
   - Use explicit path for clarity

### Stats Calculation Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    STATS CALCULATION FLOW                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Request                                                        │
│    │                                                            │
│    ▼                                                            │
│  ┌──────────────┐                                               │
│  │ Check Cache  │──Hit──▶ Return Cached Response                │
│  └──────┬───────┘                                               │
│         │ Miss                                                  │
│         ▼                                                       │
│  ┌──────────────┐                                               │
│  │ Query Latest │                                               │
│  │ Segments     │                                               │
│  └──────┬───────┘                                               │
│         │                                                       │
│         ▼                                                       │
│  ┌──────────────┐                                               │
│  │ Group By     │                                               │
│  │ Segment      │                                               │
│  │ Count(*)     │                                               │
│  └──────┬───────┘                                               │
│         │                                                       │
│         ▼                                                       │
│  ┌──────────────┐                                               │
│  │ Build        │                                               │
│  │ Response     │                                               │
│  └──────┬───────┘                                               │
│         │                                                       │
│         ▼                                                       │
│  ┌──────────────┐                                               │
│  │ Cache        │                                               │
│  │ Response     │                                               │
│  └──────┬───────┘                                               │
│         │                                                       │
│         ▼                                                       │
│     Return Response                                             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Acceptance Criteria

- [ ] Stats endpoint accessible at `/api/insights/segments/stats`
- [ ] Returns count for all six segment types
- [ ] Includes total customer count
- [ ] Includes most recent calculation timestamp
- [ ] Zero counts included for empty segments
- [ ] Response caching implemented

---

## Task 34: Verify RFM Segmentation

### Task Information

| Attribute | Value |
|-----------|-------|
| Task ID | 34 |
| Title | Verify RFM Segmentation |
| Complexity | Low |
| Estimated Duration | 1 hour |
| Prerequisites | Tasks 27-33 (All prior tasks) |

### Objective

Create comprehensive verification tests to ensure the entire RFM segmentation pipeline works correctly from data ingestion through API output.

### Verification Scope

```
┌─────────────────────────────────────────────────────────────────┐
│                    VERIFICATION PIPELINE                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Stage 1: RFM Calculator                                 │   │
│  │  ─────────────────────────                               │   │
│  │  • Score calculation accuracy                            │   │
│  │  • Segment classification correctness                    │   │
│  │  • Edge case handling                                    │   │
│  └──────────────────────────────────────────────────────────┘   │
│                         │                                       │
│                         ▼                                       │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Stage 2: Data Persistence                               │   │
│  │  ─────────────────────────                               │   │
│  │  • CustomerSegment model operations                      │   │
│  │  • SegmentHistory tracking                               │   │
│  │  • Data integrity                                        │   │
│  └──────────────────────────────────────────────────────────┘   │
│                         │                                       │
│                         ▼                                       │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Stage 3: Scheduler                                      │   │
│  │  ─────────────────────                                   │   │
│  │  • Task registration                                     │   │
│  │  • Schedule configuration                                │   │
│  │  • Execution completion                                  │   │
│  └──────────────────────────────────────────────────────────┘   │
│                         │                                       │
│                         ▼                                       │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Stage 4: API Endpoints                                  │   │
│  │  ──────────────────────                                  │   │
│  │  • Segment list endpoint                                 │   │
│  │  • Stats endpoint                                        │   │
│  │  • Filtering and pagination                              │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Test Categories

| Category | Test Count | Focus Area |
|----------|------------|------------|
| Calculator Tests | 8-10 | Score calculation, classification |
| Model Tests | 5-6 | CRUD, constraints, history |
| Scheduler Tests | 3-4 | Task execution, scheduling |
| API Tests | 6-8 | Endpoints, filters, auth |
| Integration Tests | 4-5 | End-to-end pipeline |

### Calculator Verification Tests

| Test Case | Input | Expected Output |
|-----------|-------|-----------------|
| Champion Customer | R:5, F:5, M:5 | Segment: CHAMPIONS |
| Loyal Customer | R:4, F:4, M:4 | Segment: LOYAL |
| At Risk Customer | R:2, F:4, M:5 | Segment: AT_RISK |
| Lost Customer | R:1, F:1, M:1 | Segment: LOST |
| New Customer | R:5, F:1, M:1 | Segment: NEW |
| Promising Customer | R:3, F:2, M:2 | Segment: PROMISING |
| Score Boundaries | R:3, F:3, M:3 | Segment: (verify priority) |
| Invalid Scores | R:6, F:0, M:-1 | Validation Error |

### Model Verification Tests

| Test Case | Action | Verification |
|-----------|--------|--------------|
| Create Segment | Save new record | Record persisted with all fields |
| Update Segment | Change segment type | History entry created |
| Same Segment Update | Update without change | No history entry created |
| Score Validation | Set score > 5 | Validation error raised |
| Customer Unique | Same customer twice | Handled per constraint |

### Scheduler Verification Tests

| Test Case | Verification |
|-----------|--------------|
| Task Registered | Task appears in Celery task registry |
| Schedule Configured | Crontab set for Sunday 2 AM |
| Task Completes | Segments calculated for all customers |
| Batch Processing | Memory efficient for large datasets |

### API Verification Tests

| Endpoint | Test Case | Expected |
|----------|-----------|----------|
| /segments | No auth | 401 Unauthorized |
| /segments | Valid auth | 200 with data |
| /segments | Filter by segment | Filtered results |
| /segments | Invalid segment | Empty or error |
| /segments/stats | Valid request | All segment counts |
| /segments/stats | Cached response | Same data, faster |

### Implementation Instructions

1. **Create Test File**
   - Create `tests/test_rfm_pipeline.py`
   - Import all components (calculator, models, tasks, views)
   - Set up test fixtures for customer and transaction data

2. **Implement Calculator Tests**
   - Test each segment classification
   - Test score boundary conditions
   - Test invalid input handling
   - Verify NEW and PROMISING segments specifically

3. **Implement Model Tests**
   - Test CustomerSegment CRUD operations
   - Test SegmentHistory signal handler
   - Test field validators
   - Test unique constraints

4. **Implement Scheduler Tests**
   - Verify task is registered
   - Mock Celery beat schedule
   - Test task execution with sample data
   - Verify batch processing works

5. **Implement API Tests**
   - Use Django REST framework test client
   - Test authentication requirements
   - Test all filter combinations
   - Test pagination

6. **Implement Integration Tests**
   - Create customers with transactions
   - Run RFM calculation
   - Verify segments persisted
   - Query via API and verify

### End-to-End Test Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    E2E TEST FLOW                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Setup                                                          │
│    │                                                            │
│    ▼                                                            │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ Create Test Data                                         │   │
│  │ • 100 test customers                                     │   │
│  │ • Varied transaction histories                           │   │
│  │ • Coverage of all segment types                          │   │
│  └────────────────────────┬─────────────────────────────────┘   │
│                           │                                     │
│                           ▼                                     │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ Execute RFM Calculation                                  │   │
│  │ • Trigger scheduled task                                 │   │
│  │ • Wait for completion                                    │   │
│  └────────────────────────┬─────────────────────────────────┘   │
│                           │                                     │
│                           ▼                                     │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ Verify Database State                                    │   │
│  │ • 100 CustomerSegment records exist                      │   │
│  │ • All segment types represented                          │   │
│  │ • Scores within valid range                              │   │
│  └────────────────────────┬─────────────────────────────────┘   │
│                           │                                     │
│                           ▼                                     │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ Verify API Response                                      │   │
│  │ • /segments returns correct count                        │   │
│  │ • /segments/stats matches database                       │   │
│  │ • Filters return expected results                        │   │
│  └────────────────────────┬─────────────────────────────────┘   │
│                           │                                     │
│                           ▼                                     │
│                       PASS/FAIL                                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Acceptance Criteria

- [ ] All calculator tests passing
- [ ] All model tests passing
- [ ] All scheduler tests passing
- [ ] All API tests passing
- [ ] Integration test completes successfully
- [ ] Test coverage > 80% for RFM module

---

## API Summary

### Complete Endpoint Reference

| Endpoint | Method | Purpose | Auth | Task |
|----------|--------|---------|------|------|
| `/api/insights/segments` | GET | List customer segments | Yes | 32 |
| `/api/insights/segments/stats` | GET | Segment statistics | Yes | 33 |

### API Response Codes

| Code | Meaning | When Returned |
|------|---------|---------------|
| 200 | OK | Successful request |
| 400 | Bad Request | Invalid parameters |
| 401 | Unauthorized | Missing authentication |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 500 | Server Error | Internal error |

---

## Model Summary

### CustomerSegment Model

| Field | Type | Key Points |
|-------|------|------------|
| id | UUID | Auto-generated primary key |
| customer_id | String | Foreign reference, indexed |
| r_score | Integer | 1-5, validated |
| f_score | Integer | 1-5, validated |
| m_score | Integer | 1-5, validated |
| segment | String | 6 choices, indexed |
| calculated_at | DateTime | Auto-set, indexed |

### SegmentHistory Model

| Field | Type | Key Points |
|-------|------|------------|
| id | UUID | Auto-generated primary key |
| customer_id | String | Foreign reference, indexed |
| from_segment | String | Nullable for first record |
| to_segment | String | Required |
| changed_at | DateTime | Auto-set, indexed |
| notes | Text | Optional context |

---

## Complete Segment Reference

### All Six Segments

| Segment | R | F | M | Action | Priority |
|---------|---|---|---|--------|----------|
| Champions | 4-5 | 4-5 | 4-5 | Reward & retain | 1 |
| Loyal | 3-5 | 3-5 | 3-5 | Upsell & loyalty | 2 |
| At Risk | 1-2 | 3-5 | 3-5 | Win-back urgent | 3 |
| Lost | 1-2 | 1-2 | 1-2 | Re-activation | 4 |
| New | 4-5 | 1 | 1-2 | Welcome nurture | 5 |
| Promising | 3-4 | 1-3 | 1-3 | Engagement | 6 |

---

## Integration with Other Components

### Dependencies

| Component | Dependency Type | Description |
|-----------|-----------------|-------------|
| Customer Data (Group A) | Input | Cleaned customer profiles |
| Transaction Data (Group A) | Input | Order history for RFM |
| RFM Calculator (Doc 01) | Core Logic | Score calculation engine |
| Celery/Redis | Infrastructure | Task scheduling |
| Django REST Framework | Infrastructure | API framework |

### Downstream Consumers

| Consumer | Usage |
|----------|-------|
| LTV Prediction (Group C) | Segment as input feature |
| Churn Prediction (Group D) | Segment risk indicators |
| Dashboard (Group E) | Visualization of segments |
| Marketing System | Campaign targeting |

---

## Troubleshooting Guide

### Common Issues

| Issue | Possible Cause | Resolution |
|-------|----------------|------------|
| All customers in one segment | Score boundaries too wide | Review segment criteria |
| History not tracking | Signal not connected | Check signal registration |
| API returns empty | No segments calculated | Run scheduler task |
| Stats don't match list | Cache stale | Clear cache or wait |
| Scheduler not running | Celery Beat not started | Start beat worker |

---

## Document Completion Checklist

### Tasks Covered

- [x] Task 27: New Segment Definition
- [x] Task 28: Promising Segment Definition
- [x] Task 29: CustomerSegment Model
- [x] Task 30: SegmentHistory Model
- [x] Task 31: Segment Scheduler
- [x] Task 32: Segment List API
- [x] Task 33: Segment Stats API
- [x] Task 34: Verification Testing

### Deliverables Documented

- [x] Segment definitions and criteria
- [x] Model field specifications
- [x] API endpoint specifications
- [x] Scheduler configuration
- [x] Testing requirements
- [x] Integration points

---

## Next Steps

Upon completion of Group B (RFM Segmentation):

1. **Proceed to Group C** - LTV Prediction models
2. **Verify Integration** - Ensure segments feed into LTV calculations
3. **Monitor Production** - Watch segment distribution after first run
4. **Iterate** - Adjust segment boundaries based on business feedback

---

**End of Document 02 - Group B RFM Segmentation**

*Total Tasks: 8 | Complexity: 1 Medium, 7 Low | Estimated Duration: 6.5 hours*
