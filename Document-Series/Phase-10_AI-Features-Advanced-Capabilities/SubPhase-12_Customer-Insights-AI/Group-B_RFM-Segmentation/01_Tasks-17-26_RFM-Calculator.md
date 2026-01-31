# Tasks 17-26: RFM Calculator and Segments

> **Phase:** 10 - AI Features & Advanced Capabilities  
> **SubPhase:** 12 - Customer Insights AI (FINAL SUBPHASE)  
> **Group:** B - RFM Segmentation  
> **Document:** 01 of 02  
> **Tasks Covered:** 17, 18, 19, 20, 21, 22, 23, 24, 25, 26

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-27-34_Model-API.md](02_Tasks-27-34_Model-API.md)

---

## Document Overview

This document covers the implementation of the RFM (Recency, Frequency, Monetary) Calculator, a foundational customer segmentation tool. RFM analysis is a proven marketing technique that segments customers based on their purchasing behavior, enabling targeted marketing strategies and personalized customer experiences.

### What This Document Covers

| Component | Description | Tasks |
|-----------|-------------|-------|
| RFM Calculator Core | Main calculation engine and result structure | 17 |
| Individual Scores | Recency, Frequency, Monetary score calculations | 18, 19, 20 |
| Quintile Method | Statistical scoring using quintile distribution | 21 |
| Segment Mapping | RFM score to segment name mapping engine | 22 |
| Segment Definitions | Champions, Loyal, At Risk, Lost segments | 23, 24, 25, 26 |

### RFM Analysis Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        RFM ANALYSIS FRAMEWORK                           │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   ┌─────────────┐    ┌─────────────┐    ┌─────────────┐                │
│   │  RECENCY    │    │  FREQUENCY  │    │  MONETARY   │                │
│   │     (R)     │    │     (F)     │    │     (M)     │                │
│   ├─────────────┤    ├─────────────┤    ├─────────────┤                │
│   │ When did    │    │ How often   │    │ How much    │                │
│   │ they last   │    │ do they     │    │ do they     │                │
│   │ purchase?   │    │ purchase?   │    │ spend?      │                │
│   └──────┬──────┘    └──────┬──────┘    └──────┬──────┘                │
│          │                  │                  │                        │
│          └──────────────────┼──────────────────┘                        │
│                             ▼                                           │
│                    ┌─────────────────┐                                  │
│                    │  RFM SCORE      │                                  │
│                    │  (e.g., 5-4-5)  │                                  │
│                    └────────┬────────┘                                  │
│                             │                                           │
│                             ▼                                           │
│                    ┌─────────────────┐                                  │
│                    │  CUSTOMER       │                                  │
│                    │  SEGMENT        │                                  │
│                    └─────────────────┘                                  │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Task 17: Create RFMCalculator Class

### Task Metadata

| Attribute | Value |
|-----------|-------|
| **Task ID** | 17 |
| **Complexity** | Medium |
| **Estimated Hours** | 4-6 |
| **Dependencies** | Group-A Data Preparation (Tasks 1-16) |
| **Output** | `RFMCalculator` class with `calculate()` method |

### Objective

Create the main RFM Calculator class that orchestrates the entire RFM scoring process for individual customers or batch processing.

### Class Architecture

```
┌────────────────────────────────────────────────────────────────────┐
│                        RFMCalculator                               │
├────────────────────────────────────────────────────────────────────┤
│ Attributes:                                                        │
│   - customer_data_service: CustomerDataService                     │
│   - score_config: RFMScoreConfiguration                            │
│   - segment_mapper: SegmentMapper                                  │
│   - calculation_date: datetime                                     │
├────────────────────────────────────────────────────────────────────┤
│ Methods:                                                           │
│   + calculate(customer_id) → RFMResult                             │
│   + calculate_batch(customer_ids) → List[RFMResult]                │
│   + calculate_all_customers() → DataFrame                          │
│   - _calculate_recency_score(customer_id) → int                    │
│   - _calculate_frequency_score(customer_id) → int                  │
│   - _calculate_monetary_score(customer_id) → int                   │
│   - _apply_quintile_scoring(values) → List[int]                    │
│   - _map_to_segment(r, f, m) → str                                 │
└────────────────────────────────────────────────────────────────────┘
```

### Implementation Instructions

#### Step 1: Create RFMResult Data Structure

Define a result container that holds all RFM calculation outputs:

| Field | Type | Description |
|-------|------|-------------|
| `customer_id` | UUID | Customer identifier |
| `recency_days` | Integer | Days since last purchase |
| `recency_score` | Integer (1-5) | Recency quintile score |
| `frequency_count` | Integer | Total order count |
| `frequency_score` | Integer (1-5) | Frequency quintile score |
| `monetary_total` | Decimal | Total spend amount |
| `monetary_score` | Integer (1-5) | Monetary quintile score |
| `rfm_score` | String | Combined score (e.g., "5-4-5") |
| `rfm_combined` | Integer | Numeric combined (e.g., 545) |
| `segment_name` | String | Mapped segment name |
| `segment_action` | String | Recommended action |
| `calculated_at` | DateTime | Calculation timestamp |

#### Step 2: Initialize Calculator Dependencies

Configure the calculator with required services:

1. **Customer Data Service** - Inject the data access layer from Group-A
2. **Score Configuration** - Load scoring thresholds and rules
3. **Segment Mapper** - Initialize segment mapping engine
4. **Calculation Date** - Set the reference date for recency calculations

#### Step 3: Implement Calculate Method

The `calculate(customer_id)` method workflow:

```
┌──────────────────────────────────────────────────────────────────┐
│                    calculate(customer_id)                        │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. Validate customer_id exists                                  │
│           │                                                      │
│           ▼                                                      │
│  2. Fetch customer transaction history                           │
│           │                                                      │
│           ▼                                                      │
│  3. Calculate raw metrics:                                       │
│     ├─→ Recency (days since last order)                          │
│     ├─→ Frequency (total order count)                            │
│     └─→ Monetary (total spend)                                   │
│           │                                                      │
│           ▼                                                      │
│  4. Apply scoring (quintile or threshold-based)                  │
│           │                                                      │
│           ▼                                                      │
│  5. Map scores to segment                                        │
│           │                                                      │
│           ▼                                                      │
│  6. Build and return RFMResult                                   │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

#### Step 4: Implement Batch Processing

For `calculate_batch()` and `calculate_all_customers()`:

1. Retrieve all customer IDs from the data service
2. Process in configurable batch sizes (default: 1000)
3. Use parallel processing where appropriate
4. Return results as a list or DataFrame
5. Include progress tracking for large datasets

### Error Handling Requirements

| Scenario | Handling |
|----------|----------|
| Customer not found | Return null result with error flag |
| No transaction history | Return zero scores, "Lost" segment |
| Invalid data | Log warning, use default values |
| Calculation failure | Raise exception with context |

### File Location

```
backend/
└── apps/
    └── analytics/
        └── services/
            └── rfm/
                ├── __init__.py
                ├── calculator.py      ← RFMCalculator class
                └── models.py          ← RFMResult dataclass
```

---

## Task 18: Create Recency Score

### Task Metadata

| Attribute | Value |
|-----------|-------|
| **Task ID** | 18 |
| **Complexity** | Low |
| **Estimated Hours** | 2-3 |
| **Dependencies** | Task 17 (RFMCalculator class) |
| **Output** | Recency scoring method |

### Objective

Implement recency scoring based on days since the customer's last order. Lower recency (more recent purchase) results in a higher score.

### Recency Score Thresholds

| Days Since Last Order | Score | Interpretation |
|----------------------|-------|----------------|
| 0-30 days | 5 | Very Recent |
| 31-60 days | 4 | Recent |
| 61-90 days | 3 | Moderate |
| 91-180 days | 2 | Fading |
| 181+ days | 1 | Dormant |

### Scoring Logic Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                 RECENCY SCORE CALCULATION                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   Input: customer_id, calculation_date                          │
│                     │                                           │
│                     ▼                                           │
│   ┌─────────────────────────────────┐                           │
│   │ Get last_order_date for         │                           │
│   │ customer from transaction data  │                           │
│   └─────────────────┬───────────────┘                           │
│                     │                                           │
│                     ▼                                           │
│   ┌─────────────────────────────────┐                           │
│   │ Calculate days_since =          │                           │
│   │ calculation_date - last_order   │                           │
│   └─────────────────┬───────────────┘                           │
│                     │                                           │
│                     ▼                                           │
│   ┌─────────────────────────────────┐                           │
│   │ Apply threshold scoring:        │                           │
│   │ ≤30 → 5, ≤60 → 4, ≤90 → 3       │                           │
│   │ ≤180 → 2, >180 → 1              │                           │
│   └─────────────────┬───────────────┘                           │
│                     │                                           │
│                     ▼                                           │
│   Output: recency_score (1-5), recency_days                     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Implementation Instructions

#### Step 1: Retrieve Last Order Date

1. Query the customer's transaction history from the data service
2. Find the most recent order date
3. Handle case where customer has no orders (return score of 1)

#### Step 2: Calculate Days Since

1. Use the calculation reference date (typically current date)
2. Compute the difference in days
3. Ensure positive integer result

#### Step 3: Apply Threshold-Based Scoring

1. Create a scoring function using the threshold table above
2. Make thresholds configurable for different business contexts
3. Return both raw days value and calculated score

### Configuration Options

| Parameter | Default | Description |
|-----------|---------|-------------|
| `tier_1_max_days` | 30 | Score 5 threshold |
| `tier_2_max_days` | 60 | Score 4 threshold |
| `tier_3_max_days` | 90 | Score 3 threshold |
| `tier_4_max_days` | 180 | Score 2 threshold |
| `no_order_score` | 1 | Score when no orders exist |

---

## Task 19: Create Frequency Score

### Task Metadata

| Attribute | Value |
|-----------|-------|
| **Task ID** | 19 |
| **Complexity** | Low |
| **Estimated Hours** | 2-3 |
| **Dependencies** | Task 17 (RFMCalculator class) |
| **Output** | Frequency scoring method |

### Objective

Implement frequency scoring based on total order count. Higher frequency (more orders) results in a higher score.

### Frequency Scoring Approach

Unlike recency which uses fixed thresholds, frequency scoring uses **quintile distribution** to ensure even distribution across the customer base.

```
┌─────────────────────────────────────────────────────────────────┐
│                 FREQUENCY SCORE DISTRIBUTION                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Quintile 1 (Bottom 20%)  │█████████████████│  Score: 1         │
│  Quintile 2 (20-40%)      │█████████████████│  Score: 2         │
│  Quintile 3 (40-60%)      │█████████████████│  Score: 3         │
│  Quintile 4 (60-80%)      │█████████████████│  Score: 4         │
│  Quintile 5 (Top 20%)     │█████████████████│  Score: 5         │
│                                                                 │
│  Example Distribution:                                          │
│  ─────────────────────────────────────────────────────────────  │
│  1-2 orders → Score 1    │  11-20 orders → Score 4             │
│  3-5 orders → Score 2    │  21+ orders   → Score 5             │
│  6-10 orders → Score 3   │                                      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Implementation Instructions

#### Step 1: Retrieve Order Count

1. Query total order count for the customer from the data service
2. Consider analysis period (e.g., last 12 months or all-time)
3. Exclude cancelled or refunded orders

#### Step 2: Apply Quintile Scoring

1. Use pre-calculated quintile boundaries from the customer population
2. Assign score 1-5 based on which quintile the count falls into
3. Handle edge cases (new customers with 0-1 orders)

#### Step 3: Return Results

1. Return both raw count and calculated score
2. Include the quintile boundaries used for transparency

### Frequency Analysis Period Options

| Period | Use Case |
|--------|----------|
| All-time | Long-term customer value assessment |
| Last 12 months | Recent engagement focus |
| Last 24 months | Balanced historical view |
| Custom period | Business-specific requirements |

---

## Task 20: Create Monetary Score

### Task Metadata

| Attribute | Value |
|-----------|-------|
| **Task ID** | 20 |
| **Complexity** | Low |
| **Estimated Hours** | 2-3 |
| **Dependencies** | Task 17 (RFMCalculator class) |
| **Output** | Monetary scoring method |

### Objective

Implement monetary scoring based on total customer spend. Higher monetary value (more spend) results in a higher score.

### Monetary Calculation Components

```
┌─────────────────────────────────────────────────────────────────┐
│                 MONETARY VALUE CALCULATION                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   Total Revenue                                                 │
│   ┌─────────────────────────────────────────────┐               │
│   │  Σ (order_total) for all completed orders   │               │
│   └─────────────────────────────────────────────┘               │
│                           │                                     │
│                           ▼                                     │
│   Adjustments (Optional)                                        │
│   ┌─────────────────────────────────────────────┐               │
│   │  - Subtract refunds                         │               │
│   │  - Subtract discounts (if not in total)     │               │
│   │  - Currency normalization                   │               │
│   └─────────────────────────────────────────────┘               │
│                           │                                     │
│                           ▼                                     │
│   Final Monetary Value                                          │
│   ┌─────────────────────────────────────────────┐               │
│   │  Net spend for quintile scoring             │               │
│   └─────────────────────────────────────────────┘               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Implementation Instructions

#### Step 1: Calculate Total Spend

1. Sum all completed order totals for the customer
2. Handle multi-currency scenarios (convert to base currency)
3. Apply any adjustments (refunds, partial cancellations)

#### Step 2: Apply Quintile Scoring

1. Use pre-calculated quintile boundaries from the customer population
2. Assign score 1-5 based on which quintile the amount falls into
3. Handle edge cases (customers with zero spend)

#### Step 3: Return Results

1. Return both raw monetary value and calculated score
2. Include currency information for multi-currency tenants

### Monetary Value Considerations

| Factor | Handling |
|--------|----------|
| Currency conversion | Convert to tenant's base currency |
| Refunds | Subtract from total if tracking net value |
| Taxes | Typically included in order total |
| Shipping | Include if part of customer value |
| B2B vs B2C | Different thresholds may apply |

---

## Task 21: Create Quintile Method

### Task Metadata

| Attribute | Value |
|-----------|-------|
| **Task ID** | 21 |
| **Complexity** | Medium |
| **Estimated Hours** | 3-4 |
| **Dependencies** | Tasks 19, 20 (Frequency and Monetary scores) |
| **Output** | Reusable quintile scoring utility |

### Objective

Implement a quintile-based scoring method using pandas `qcut` function to divide customers into 5 equal groups based on their metric values.

### Quintile Distribution Explained

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     QUINTILE SCORING METHOD                             │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  Customer Population Sorted by Metric Value                             │
│  ═════════════════════════════════════════════════════════════════════  │
│                                                                         │
│  │◄────── Lowest ─────────────────────────────── Highest ──────►│       │
│  │                                                                │      │
│  │  Q1   │   Q2   │   Q3   │   Q4   │   Q5   │                          │
│  │ 0-20% │ 20-40% │ 40-60% │ 60-80% │ 80-100%│                          │
│  │Score 1│Score 2 │Score 3 │Score 4 │Score 5 │                          │
│  │       │        │        │        │        │                          │
│  └───────┴────────┴────────┴────────┴────────┘                          │
│                                                                         │
│  Each quintile contains exactly 20% of customers                        │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Implementation Instructions

#### Step 1: Create Quintile Calculator Utility

Create a reusable utility that can be applied to any metric:

1. Accept a pandas Series or array of values
2. Handle ties and duplicate values appropriately
3. Return scores from 1 to 5

#### Step 2: Handle Edge Cases

| Edge Case | Solution |
|-----------|----------|
| Duplicate values at boundaries | Use `duplicates='drop'` or assign to higher bin |
| Too few unique values | Fall back to rank-based scoring |
| Zero or null values | Assign to quintile 1 or handle separately |
| Single value | All customers get score 3 (middle) |

#### Step 3: Calculate and Store Boundaries

1. Compute quintile boundaries (20th, 40th, 60th, 80th percentiles)
2. Store boundaries for later reference and individual scoring
3. Update boundaries periodically (e.g., weekly during batch process)

### Quintile Boundary Storage

| Metric | P20 | P40 | P60 | P80 | Updated |
|--------|-----|-----|-----|-----|---------|
| Frequency | 3 | 7 | 15 | 28 | 2026-01-31 |
| Monetary | $150 | $450 | $1,200 | $3,500 | 2026-01-31 |

### Inverse Scoring Note

For **recency**, lower is better, so the scoring is inverted:
- Quintile 1 (lowest days) → Score 5
- Quintile 5 (highest days) → Score 1

---

## Task 22: Create RFM Segments

### Task Metadata

| Attribute | Value |
|-----------|-------|
| **Task ID** | 22 |
| **Complexity** | Medium |
| **Estimated Hours** | 4-5 |
| **Dependencies** | Tasks 18-21 (All scoring methods) |
| **Output** | Segment mapper with 6 segment categories |

### Objective

Create a segment mapping engine that translates RFM scores (1-5 for each dimension) into meaningful customer segment names with associated actions.

### Segment Mapping Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        RFM SEGMENT MAPPING                              │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│              RECENCY (R)                                                │
│         1    2    3    4    5                                           │
│       ┌────┬────┬────┬────┬────┐                                        │
│     5 │Lost│Risk│Loyal│Chmp│Chmp│                                       │
│       ├────┼────┼────┼────┼────┤                                        │
│   F 4 │Lost│Risk│Loyal│Loyal│Chmp│                                      │
│   R   ├────┼────┼────┼────┼────┤                                        │
│   E 3 │Lost│Risk│Prom│Loyal│Loyal│                                      │
│   Q   ├────┼────┼────┼────┼────┤                                        │
│     2 │Lost│Lost│Risk│Prom│New │                                        │
│       ├────┼────┼────┼────┼────┤                                        │
│     1 │Lost│Lost│Risk│New │New │                                        │
│       └────┴────┴────┴────┴────┘                                        │
│                                                                         │
│  Legend: Chmp=Champions, Prom=Promising, New=New Customers              │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Complete Segment Definitions

| Segment | R Score | F Score | M Score | Description |
|---------|---------|---------|---------|-------------|
| **Champions** | 4-5 | 4-5 | 4-5 | Best customers, highest value |
| **Loyal Customers** | 2-5 | 3-5 | 3-5 | Consistent buyers, good value |
| **Promising** | 3-4 | 2-3 | 2-3 | Potential to grow |
| **New Customers** | 4-5 | 1-2 | 1-2 | Recent first-time buyers |
| **At Risk** | 2-3 | 2-4 | 2-4 | Declining engagement |
| **Lost** | 1-2 | 1-2 | 1-2 | Inactive, low value |

### Implementation Instructions

#### Step 1: Create Segment Mapper Class

Create a class that encapsulates segment mapping logic:

1. Accept R, F, M scores as input
2. Evaluate against segment rules in priority order
3. Return segment name and associated metadata

#### Step 2: Define Segment Rules

Implement segment matching rules in priority order:

```
Priority Order:
1. Champions (highest value customers first)
2. Loyal Customers
3. Promising
4. New Customers
5. At Risk
6. Lost (catch-all for remaining)
```

#### Step 3: Associate Segment Actions

Each segment should include recommended actions:

| Segment | Primary Action | Secondary Actions |
|---------|---------------|-------------------|
| Champions | VIP treatment | Early access, exclusive offers |
| Loyal Customers | Loyalty rewards | Cross-sell, referral program |
| Promising | Nurture campaigns | Personalized recommendations |
| New Customers | Welcome series | Education, first repeat incentive |
| At Risk | Win-back campaign | Personalized re-engagement |
| Lost | Reactivation offer | Deep discount, survey |

---

## Task 23: Create Champions Segment

### Task Metadata

| Attribute | Value |
|-----------|-------|
| **Task ID** | 23 |
| **Complexity** | Low |
| **Estimated Hours** | 1-2 |
| **Dependencies** | Task 22 (Segment mapper) |
| **Output** | Champions segment rule |

### Objective

Define and implement the Champions segment for the highest-value customers who are recent, frequent, and high-spending.

### Champions Segment Criteria

```
┌─────────────────────────────────────────────────────────────────────────┐
│                      CHAMPIONS SEGMENT                                  │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐               │
│  │   RECENCY     │  │  FREQUENCY    │  │   MONETARY    │               │
│  │   Score: 4-5  │  │   Score: 4-5  │  │   Score: 4-5  │               │
│  │               │  │               │  │               │               │
│  │  Recent       │  │  Frequent     │  │  High         │               │
│  │  Purchases    │  │  Buyer        │  │  Spender      │               │
│  └───────────────┘  └───────────────┘  └───────────────┘               │
│          │                  │                  │                        │
│          └──────────────────┼──────────────────┘                        │
│                             │                                           │
│                        ALL THREE                                        │
│                        REQUIRED                                         │
│                             │                                           │
│                             ▼                                           │
│                    ┌─────────────────┐                                  │
│                    │   CHAMPIONS     │                                  │
│                    │   🏆 VIP        │                                  │
│                    └─────────────────┘                                  │
│                                                                         │
│  Expected: ~5-10% of customer base                                      │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Champions Characteristics

| Attribute | Description |
|-----------|-------------|
| **Definition** | R ≥ 4 AND F ≥ 4 AND M ≥ 4 |
| **Behavior** | Recent purchase, frequent buying, high spend |
| **Typical Size** | 5-10% of active customers |
| **Value** | Highest customer lifetime value |
| **Retention** | High retention, low churn risk |

### Recommended Actions for Champions

| Action Type | Implementation |
|-------------|----------------|
| **VIP Treatment** | Priority customer service, dedicated support |
| **Early Access** | New product launches, pre-sale access |
| **Exclusive Offers** | Members-only promotions, VIP discounts |
| **Referral Program** | High-value referral incentives |
| **Feedback Loop** | Product feedback requests, beta testing |

### Implementation Instructions

1. Add Champions rule to segment mapper with highest priority
2. Define criteria: R ≥ 4, F ≥ 4, M ≥ 4 (all conditions must be true)
3. Associate with action type "VIP_TREATMENT"
4. Tag customers for marketing automation workflows

---

## Task 24: Create Loyal Segment

### Task Metadata

| Attribute | Value |
|-----------|-------|
| **Task ID** | 24 |
| **Complexity** | Low |
| **Estimated Hours** | 1-2 |
| **Dependencies** | Task 22 (Segment mapper) |
| **Output** | Loyal Customers segment rule |

### Objective

Define and implement the Loyal Customers segment for consistent buyers with good value who may not be the absolute highest tier.

### Loyal Customers Segment Criteria

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    LOYAL CUSTOMERS SEGMENT                              │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐               │
│  │   RECENCY     │  │  FREQUENCY    │  │   MONETARY    │               │
│  │   Score: 2-5  │  │   Score: 3-5  │  │   Score: 3-5  │               │
│  │               │  │               │  │               │               │
│  │  Within       │  │  Regular      │  │  Above        │               │
│  │  6 months     │  │  Buyer        │  │  Average      │               │
│  └───────────────┘  └───────────────┘  └───────────────┘               │
│          │                  │                  │                        │
│          └──────────────────┼──────────────────┘                        │
│                             │                                           │
│                      NOT Champions                                      │
│                      (lower priority)                                   │
│                             │                                           │
│                             ▼                                           │
│                    ┌─────────────────┐                                  │
│                    │ LOYAL CUSTOMERS │                                  │
│                    │   ⭐ Valued     │                                  │
│                    └─────────────────┘                                  │
│                                                                         │
│  Expected: ~15-25% of customer base                                     │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Loyal Customers Characteristics

| Attribute | Description |
|-----------|-------------|
| **Definition** | R ≥ 2 AND F ≥ 3 AND M ≥ 3 (excluding Champions) |
| **Behavior** | Consistent purchases, reliable spend |
| **Typical Size** | 15-25% of active customers |
| **Value** | High lifetime value, predictable |
| **Opportunity** | Potential to become Champions |

### Recommended Actions for Loyal Customers

| Action Type | Implementation |
|-------------|----------------|
| **Loyalty Rewards** | Points accumulation, tier benefits |
| **Cross-Sell** | Complementary product recommendations |
| **Upgrade Path** | Incentives to increase frequency/spend |
| **Referral Program** | Moderate referral incentives |
| **Engagement** | Regular newsletters, product updates |

### Implementation Instructions

1. Add Loyal Customers rule after Champions in priority order
2. Define criteria: R ≥ 2, F ≥ 3, M ≥ 3
3. Ensure Champions are excluded (processed first)
4. Associate with action type "LOYALTY_REWARDS"

---

## Task 25: Create At Risk Segment

### Task Metadata

| Attribute | Value |
|-----------|-------|
| **Task ID** | 25 |
| **Complexity** | Low |
| **Estimated Hours** | 1-2 |
| **Dependencies** | Task 22 (Segment mapper) |
| **Output** | At Risk segment rule |

### Objective

Define and implement the At Risk segment for customers showing declining engagement who were previously valuable.

### At Risk Segment Criteria

```
┌─────────────────────────────────────────────────────────────────────────┐
│                       AT RISK SEGMENT                                   │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐               │
│  │   RECENCY     │  │  FREQUENCY    │  │   MONETARY    │               │
│  │   Score: 2-3  │  │   Score: 2-4  │  │   Score: 2-4  │               │
│  │               │  │               │  │               │               │
│  │  Fading       │  │  Was          │  │  Was          │               │
│  │  Away         │  │  Active       │  │  Valuable     │               │
│  └───────────────┘  └───────────────┘  └───────────────┘               │
│          │                  │                  │                        │
│          └──────────────────┼──────────────────┘                        │
│                             │                                           │
│                       ⚠️ WARNING                                        │
│                     Needs Attention                                     │
│                             │                                           │
│                             ▼                                           │
│                    ┌─────────────────┐                                  │
│                    │    AT RISK      │                                  │
│                    │   ⚠️ Declining  │                                  │
│                    └─────────────────┘                                  │
│                                                                         │
│  Expected: ~10-15% of customer base                                     │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### At Risk Characteristics

| Attribute | Description |
|-----------|-------------|
| **Definition** | R: 2-3 AND F: 2-4 AND M: 2-4 |
| **Behavior** | Declining purchase frequency, fading recency |
| **Typical Size** | 10-15% of active customers |
| **Risk Level** | Medium-High churn risk |
| **Urgency** | Time-sensitive intervention needed |

### Recommended Actions for At Risk

| Action Type | Implementation |
|-------------|----------------|
| **Win-Back Campaign** | Personalized re-engagement emails |
| **Special Offer** | Exclusive discount to encourage return |
| **Survey** | Understand reasons for disengagement |
| **Personal Outreach** | High-value customers get phone call |
| **Product Updates** | Inform about new products/features |

### Implementation Instructions

1. Add At Risk rule with appropriate priority
2. Define criteria: R in {2,3}, F in {2,3,4}, M in {2,3,4}
3. Ensure higher-value segments are excluded
4. Associate with action type "WIN_BACK_CAMPAIGN"
5. Flag for marketing automation trigger

---

## Task 26: Create Lost Segment

### Task Metadata

| Attribute | Value |
|-----------|-------|
| **Task ID** | 26 |
| **Complexity** | Low |
| **Estimated Hours** | 1-2 |
| **Dependencies** | Task 22 (Segment mapper) |
| **Output** | Lost segment rule |

### Objective

Define and implement the Lost segment for inactive customers with low historical value who have not engaged recently.

### Lost Segment Criteria

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        LOST SEGMENT                                     │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐               │
│  │   RECENCY     │  │  FREQUENCY    │  │   MONETARY    │               │
│  │   Score: 1-2  │  │   Score: 1-2  │  │   Score: 1-2  │               │
│  │               │  │               │  │               │               │
│  │  Dormant      │  │  Infrequent   │  │  Low          │               │
│  │  (6+ months)  │  │  Buyer        │  │  Spender      │               │
│  └───────────────┘  └───────────────┘  └───────────────┘               │
│          │                  │                  │                        │
│          └──────────────────┼──────────────────┘                        │
│                             │                                           │
│                       ❌ INACTIVE                                       │
│                     Low Priority                                        │
│                             │                                           │
│                             ▼                                           │
│                    ┌─────────────────┐                                  │
│                    │      LOST       │                                  │
│                    │   ❌ Inactive   │                                  │
│                    └─────────────────┘                                  │
│                                                                         │
│  Expected: ~20-30% of customer base                                     │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Lost Segment Characteristics

| Attribute | Description |
|-----------|-------------|
| **Definition** | R ≤ 2 AND F ≤ 2 AND M ≤ 2 |
| **Behavior** | Long inactive, minimal historical engagement |
| **Typical Size** | 20-30% of customer base |
| **Risk Level** | Already churned |
| **Priority** | Low (cost vs. benefit analysis needed) |

### Recommended Actions for Lost Customers

| Action Type | Implementation |
|-------------|----------------|
| **Reactivation Offer** | Deep discount to re-engage |
| **Exit Survey** | Understand why they left |
| **List Cleanup** | Consider removing from active marketing |
| **Seasonal Campaign** | Major sale/event announcements only |
| **Re-Permission** | Email re-opt-in campaigns |

### Implementation Instructions

1. Add Lost segment as lowest priority (catch-all)
2. Define criteria: R ≤ 2, F ≤ 2, M ≤ 2
3. Associate with action type "REACTIVATION_OFFER"
4. Consider separate handling for marketing costs

---

## Complete Segment Matrix

### RFM Score to Segment Mapping Table

| R | F | M | Segment | Action Priority |
|---|---|---|---------|-----------------|
| 5 | 5 | 5 | Champions | VIP Treatment |
| 5 | 5 | 4 | Champions | VIP Treatment |
| 5 | 4 | 5 | Champions | VIP Treatment |
| 5 | 4 | 4 | Champions | VIP Treatment |
| 4 | 5 | 5 | Champions | VIP Treatment |
| 4 | 5 | 4 | Champions | VIP Treatment |
| 4 | 4 | 5 | Champions | VIP Treatment |
| 4 | 4 | 4 | Champions | VIP Treatment |
| 3-5 | 3-5 | 3-5 | Loyal Customers | Loyalty Rewards |
| 4-5 | 1-2 | 1-2 | New Customers | Welcome Series |
| 3-4 | 2-3 | 2-3 | Promising | Nurture Campaign |
| 2-3 | 2-4 | 2-4 | At Risk | Win-Back Campaign |
| 1-2 | 1-2 | 1-2 | Lost | Reactivation Offer |

### Segment Distribution Visualization

```
┌─────────────────────────────────────────────────────────────────────────┐
│                   EXPECTED SEGMENT DISTRIBUTION                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  Champions      ████████                                    8%          │
│                                                                         │
│  Loyal          ██████████████████████                      20%         │
│                                                                         │
│  Promising      ██████████████                              12%         │
│                                                                         │
│  New Customers  ██████████                                  10%         │
│                                                                         │
│  At Risk        ████████████████████                        18%         │
│                                                                         │
│  Lost           ████████████████████████████████            32%         │
│                                                                         │
│  ═══════════════════════════════════════════════════════════════════    │
│  Note: Distribution varies by business type and customer base age       │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Testing Requirements

### Unit Tests

| Test Case | Description |
|-----------|-------------|
| Calculator initialization | Verify all dependencies injected |
| Recency score thresholds | Test each threshold boundary |
| Frequency quintile calculation | Verify even distribution |
| Monetary quintile calculation | Verify even distribution |
| Segment mapping accuracy | Test all segment rules |
| Edge cases | Zero orders, null values, single customer |

### Integration Tests

| Test Case | Description |
|-----------|-------------|
| End-to-end calculation | Full RFM calculation for test customer |
| Batch processing | Process 1000+ customers efficiently |
| Data service integration | Verify correct data retrieval |
| Result persistence | Store and retrieve RFM results |

### Validation Criteria

| Metric | Target |
|--------|--------|
| Score accuracy | 100% match with expected values |
| Segment assignment | All customers assigned to exactly one segment |
| Quintile distribution | Each quintile ≈ 20% (±2%) |
| Processing speed | < 1 second per 1000 customers |

---

## File Structure Summary

```
backend/
└── apps/
    └── analytics/
        └── services/
            └── rfm/
                ├── __init__.py
                ├── calculator.py          # Task 17: RFMCalculator
                ├── models.py              # RFMResult, RFMConfig
                ├── scoring/
                │   ├── __init__.py
                │   ├── recency.py         # Task 18: Recency score
                │   ├── frequency.py       # Task 19: Frequency score
                │   ├── monetary.py        # Task 20: Monetary score
                │   └── quintile.py        # Task 21: Quintile method
                └── segments/
                    ├── __init__.py
                    ├── mapper.py          # Task 22: Segment mapper
                    ├── champions.py       # Task 23: Champions
                    ├── loyal.py           # Task 24: Loyal
                    ├── at_risk.py         # Task 25: At Risk
                    └── lost.py            # Task 26: Lost
```

---

## Completion Checklist

### Task 17: RFMCalculator Class
- [ ] Create RFMResult dataclass with all required fields
- [ ] Implement RFMCalculator class with dependency injection
- [ ] Implement `calculate(customer_id)` method
- [ ] Implement batch processing methods
- [ ] Add error handling and validation

### Task 18: Recency Score
- [ ] Implement recency calculation method
- [ ] Apply threshold-based scoring (0-30, 31-60, 61-90, 91-180, 181+)
- [ ] Make thresholds configurable
- [ ] Handle edge cases (no orders)

### Task 19: Frequency Score
- [ ] Implement frequency count retrieval
- [ ] Apply quintile-based scoring
- [ ] Configure analysis period
- [ ] Handle edge cases

### Task 20: Monetary Score
- [ ] Implement monetary value calculation
- [ ] Apply quintile-based scoring
- [ ] Handle multi-currency scenarios
- [ ] Apply adjustments (refunds, etc.)

### Task 21: Quintile Method
- [ ] Create reusable quintile calculator
- [ ] Use pandas qcut with 5 bins
- [ ] Handle edge cases (duplicates, insufficient data)
- [ ] Store and update boundaries

### Task 22: RFM Segments
- [ ] Create segment mapper class
- [ ] Define all 6 segment rules
- [ ] Implement priority-based matching
- [ ] Associate actions with segments

### Task 23: Champions Segment
- [ ] Define Champions criteria (R:4-5, F:4-5, M:4-5)
- [ ] Implement segment rule
- [ ] Associate VIP treatment actions

### Task 24: Loyal Segment
- [ ] Define Loyal criteria (R:2-5, F:3-5, M:3-5)
- [ ] Implement segment rule
- [ ] Associate loyalty rewards actions

### Task 25: At Risk Segment
- [ ] Define At Risk criteria (R:2-3, F:2-4, M:2-4)
- [ ] Implement segment rule
- [ ] Associate win-back campaign actions

### Task 26: Lost Segment
- [ ] Define Lost criteria (R:1-2, F:1-2, M:1-2)
- [ ] Implement segment rule
- [ ] Associate reactivation offer actions

---

## Next Steps

After completing these tasks, proceed to:

**→ [02_Tasks-27-34_Model-API.md](02_Tasks-27-34_Model-API.md)** - RFM Model Integration and API Endpoints

This next document covers:
- Django model for storing RFM results
- API endpoints for RFM data access
- Scheduled calculation jobs
- Dashboard integration
