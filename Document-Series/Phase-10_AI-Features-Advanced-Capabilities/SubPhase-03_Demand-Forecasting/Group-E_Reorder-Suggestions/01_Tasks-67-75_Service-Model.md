# Tasks 67-75: Reorder Service and Suggestion Model

> **Phase:** 10 - AI Features & Advanced Capabilities  
> **SubPhase:** 03 - Demand Forecasting  
> **Group:** E - Reorder Suggestions  
> **Document:** 01 of 02  
> **Tasks Covered:** 67, 68, 69, 70, 71, 72, 73, 74, 75

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Group:** [Group-D_Prediction-Algorithms](../Group-D_Prediction-Algorithms/)
- **→ Next Document:** [02_Tasks-76-80_Alert-Task-Dashboard.md](02_Tasks-76-80_Alert-Task-Dashboard.md)

---

## Document Overview

This document covers the creation of the ReorderService for calculating reorder points and optimal order quantities, as well as the ReorderSuggestion model for storing reorder recommendations. It implements inventory replenishment calculations using Economic Order Quantity (EOQ), Reorder Point (ROP), and safety stock formulas to help businesses maintain optimal inventory levels.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 67 | Create ReorderService | High | 45 min |
| 68 | Create safety_stock Method | Medium | 30 min |
| 69 | Create reorder_point Method | Medium | 30 min |
| 70 | Create lead_time_demand Method | Medium | 25 min |
| 71 | Create optimal_order_qty Method | Medium | 35 min |
| 72 | Create ReorderSuggestion Model | Medium | 30 min |
| 73 | Create suggested_qty Field | Low | 15 min |
| 74 | Create reorder_date Field | Low | 15 min |
| 75 | Create urgency Field | Low | 20 min |

---

## Task 67: Create ReorderService

### Overview
Create the ReorderService class that serves as the central service for all reorder point calculations and inventory replenishment logic. This service integrates demand forecasting data with inventory management principles to provide intelligent reorder recommendations. The service will be the foundation for automated inventory optimization.

### Dependencies
- Task 66: Verify Forecasting (Group D)
- ForecastResult model must be available
- Product model with inventory fields
- Supplier model with lead_time field

### Instructions

1. **Create reorder service file**
   - Navigate to `backend/apps/ai/forecasting/services/` directory
   - Create new file named `reorder_service.py`
   - This will contain all reorder calculation logic

2. **Import required dependencies**
   - Import Django models (Product, ForecastResult)
   - Import mathematical functions (sqrt, math module)
   - Import date/time utilities (datetime, timedelta)
   - Import typing utilities (Optional, Dict, Any)
   - Import logging for error tracking

3. **Define ReorderService class**
   - Create class `ReorderService`
   - Add docstring explaining service purpose
   - Initialize class with tenant context if needed

4. **Initialize class constructor**
   - Define `__init__` method accepting optional tenant
   - Store tenant reference for multi-tenancy support
   - Initialize logger for tracking calculations
   - Set default calculation parameters

5. **Create helper method for demand data**
   - Define `_get_demand_statistics` private method
   - Accept product_id parameter
   - Query ForecastResult for historical demand data
   - Calculate average daily demand from forecasts
   - Calculate demand standard deviation
   - Return dictionary with demand metrics

6. **Create helper method for product data**
   - Define `_get_product_details` private method
   - Accept product_id parameter
   - Retrieve product with inventory and supplier info
   - Extract current stock level
   - Extract supplier lead time in days
   - Extract order costs and holding costs
   - Return dictionary with product metrics

7. **Implement service level configuration**
   - Define `SERVICE_LEVEL_Z_SCORES` class constant
   - Map service levels to Z-scores (90%: 1.28, 95%: 1.65, 99%: 2.33)
   - Create method `get_service_level_z` accepting percentage
   - Return corresponding Z-score for calculations

8. **Add error handling**
   - Wrap methods in try-except blocks
   - Handle missing product data gracefully
   - Handle missing forecast data appropriately
   - Log all calculation errors for debugging
   - Return None or raise custom exceptions

9. **Add calculation logging**
   - Log each calculation step for traceability
   - Include product ID in all log messages
   - Log input parameters and calculated results
   - Use INFO level for successful calculations
   - Use WARNING for edge cases

10. **Create service documentation**
    - Add comprehensive docstrings to class
    - Document all method parameters and return values
    - Include formula references in docstrings
    - Add usage examples in module-level docstring

### Service Class Structure

```
ReorderService
├── __init__(tenant)
├── SERVICE_LEVEL_Z_SCORES (constant)
├── get_service_level_z(level)
├── _get_demand_statistics(product_id)
├── _get_product_details(product_id)
├── safety_stock(product_id, service_level)
├── reorder_point(product_id, service_level)
├── lead_time_demand(product_id)
└── optimal_order_qty(product_id, annual_demand)
```

### Service Level Z-Scores

| Service Level | Z-Score | Stockout Risk | Use Case |
|---------------|---------|---------------|----------|
| 85% | 1.04 | 15% | Low priority items |
| 90% | 1.28 | 10% | Standard items |
| 95% | 1.65 | 5% | Important items |
| 99% | 2.33 | 1% | Critical items |
| 99.9% | 3.09 | 0.1% | Essential items |

### Helper Method Returns

| Method | Return Type | Contents |
|--------|-------------|----------|
| _get_demand_statistics | Dict | avg_daily_demand, std_dev_demand, data_points |
| _get_product_details | Dict | current_stock, lead_time_days, order_cost, holding_cost |

### Error Handling Strategy

| Error Type | Handling | Action |
|------------|----------|--------|
| Product Not Found | Log warning | Return None or default values |
| No Forecast Data | Log warning | Use historical sales data |
| Invalid Parameters | Raise ValueError | Include helpful message |
| Database Error | Log error | Re-raise with context |

### Expected Outcome
- Functional ReorderService class with proper initialization
- Helper methods for retrieving demand and product data
- Service level configuration with Z-scores
- Comprehensive error handling and logging
- Well-documented code with docstrings

### Verification Checklist
- [ ] `reorder_service.py` file created in services directory
- [ ] ReorderService class defined with constructor
- [ ] Helper methods for demand and product data implemented
- [ ] Service level Z-score mapping configured
- [ ] Error handling implemented for all methods
- [ ] Logging added for calculation tracking
- [ ] Docstrings added to class and methods
- [ ] Imports organized and complete

---

## Task 68: Create safety_stock Method

### Overview
Implement the safety_stock method in ReorderService to calculate the buffer inventory needed to protect against demand variability and supply uncertainty. Safety stock is crucial for preventing stockouts during unexpected demand spikes or supplier delays. The method uses statistical formulas based on demand standard deviation and lead time.

### Dependencies
- Task 67: Create ReorderService

### Instructions

1. **Define method signature**
   - Create `safety_stock` method in ReorderService class
   - Accept `product_id` parameter (integer or UUID)
   - Accept optional `service_level` parameter (default 95%)
   - Define return type as float (safety stock units)

2. **Retrieve demand statistics**
   - Call `_get_demand_statistics(product_id)` helper method
   - Extract average daily demand value
   - Extract demand standard deviation value
   - Validate that data is available and valid

3. **Retrieve product details**
   - Call `_get_product_details(product_id)` helper method
   - Extract supplier lead time in days
   - Validate lead time is positive number
   - Handle products without supplier information

4. **Get service level Z-score**
   - Call `get_service_level_z(service_level)` method
   - Retrieve Z-score corresponding to desired service level
   - Validate service level is within reasonable range (85-99%)

5. **Calculate safety stock using formula**
   - Apply formula: SS = Z × σ × √L
   - Where Z = service level Z-score
   - Where σ = demand standard deviation
   - Where L = lead time in days
   - Use math.sqrt for square root calculation

6. **Handle edge cases**
   - If standard deviation is zero, return minimal safety stock
   - If lead time is zero, use minimum buffer (e.g., 1 day)
   - If no forecast data, use conservative calculation
   - Round result to nearest whole unit

7. **Add calculation logging**
   - Log input parameters (product_id, service_level)
   - Log intermediate values (Z, σ, L)
   - Log calculated safety stock result
   - Use structured logging format

8. **Validate result**
   - Ensure result is positive number
   - Check result is reasonable (not extremely large)
   - Apply minimum and maximum bounds if needed
   - Return calculated safety stock value

9. **Add method documentation**
   - Write comprehensive docstring
   - Document safety stock formula
   - Explain service level parameter
   - Include calculation example
   - List possible exceptions

### Safety Stock Formula Breakdown

| Symbol | Name | Description | Unit |
|--------|------|-------------|------|
| SS | Safety Stock | Buffer inventory quantity | Units |
| Z | Z-Score | Service level factor | - |
| σ | Sigma | Demand standard deviation | Units/day |
| L | Lead Time | Supplier delivery time | Days |

### Formula Application Example

```
Given:
- Service Level: 95% → Z = 1.65
- Demand Std Dev (σ): 20 units/day
- Lead Time (L): 7 days

Calculation:
SS = Z × σ × √L
SS = 1.65 × 20 × √7
SS = 1.65 × 20 × 2.646
SS = 87.3 ≈ 87 units
```

### Service Level Impact

| Service Level | Z-Score | Example SS (σ=20, L=7) |
|---------------|---------|------------------------|
| 85% | 1.04 | 55 units |
| 90% | 1.28 | 68 units |
| 95% | 1.65 | 87 units |
| 99% | 2.33 | 123 units |

### Edge Case Handling

| Condition | Problem | Solution |
|-----------|---------|----------|
| σ = 0 | No variability | Return minimal buffer (e.g., 5 units) |
| L = 0 | Instant delivery | Use 1 day as minimum |
| No forecast data | Cannot calculate σ | Use historical sales data |
| Negative result | Calculation error | Return 0 or raise error |

### Method Structure

```
def safety_stock(product_id, service_level=95):
    1. Validate parameters
    2. Get demand statistics
    3. Get product details (lead time)
    4. Get Z-score for service level
    5. Calculate: Z × σ × √L
    6. Validate and round result
    7. Log calculation
    8. Return safety stock
```

### Expected Outcome
- Functional safety_stock method calculating buffer inventory
- Proper handling of service levels and Z-scores
- Statistical formula correctly implemented
- Edge cases handled gracefully
- Comprehensive logging for audit trail

### Verification Checklist
- [ ] safety_stock method added to ReorderService
- [ ] Method accepts product_id and service_level parameters
- [ ] Demand statistics retrieved correctly
- [ ] Lead time extracted from product details
- [ ] Z-score retrieved for service level
- [ ] Formula applied correctly: Z × σ × √L
- [ ] Result rounded to whole units
- [ ] Edge cases handled (zero values, missing data)
- [ ] Calculation logged for tracking
- [ ] Method documented with docstring

---

## Task 69: Create reorder_point Method

### Overview
Implement the reorder_point method to calculate when inventory should be replenished. The reorder point (ROP) is the inventory level at which a new order should be placed to avoid stockouts. It combines average demand during lead time with safety stock to account for variability. This is a critical metric for automated inventory management.

### Dependencies
- Task 68: Create safety_stock Method

### Instructions

1. **Define method signature**
   - Create `reorder_point` method in ReorderService class
   - Accept `product_id` parameter
   - Accept optional `service_level` parameter (default 95%)
   - Define return type as float (reorder point units)

2. **Calculate lead time demand**
   - Call `_get_demand_statistics(product_id)` helper method
   - Extract average daily demand
   - Call `_get_product_details(product_id)` helper method
   - Extract lead time in days
   - Calculate lead time demand: avg_demand × lead_time

3. **Calculate safety stock component**
   - Call `safety_stock(product_id, service_level)` method
   - Retrieve calculated safety stock value
   - This provides buffer against variability

4. **Calculate reorder point using formula**
   - Apply formula: ROP = (D × L) + SS
   - Where D = average daily demand
   - Where L = lead time in days
   - Where SS = safety stock
   - Sum lead time demand and safety stock

5. **Handle edge cases**
   - If average demand is zero, use minimum ROP
   - If lead time is zero, use only safety stock
   - If safety stock calculation fails, use conservative buffer
   - Ensure ROP is always positive

6. **Round and validate result**
   - Round result to nearest whole unit
   - Ensure ROP is greater than safety stock
   - Apply maximum bounds if needed for reasonableness
   - Validate ROP doesn't exceed warehouse capacity

7. **Add calculation logging**
   - Log all input parameters
   - Log intermediate calculations (lead time demand, safety stock)
   - Log final reorder point result
   - Include product ID in all log entries

8. **Create visualization helper**
   - Add method to explain ROP breakdown
   - Show components: lead time demand + safety stock
   - Format for display in admin dashboard
   - Return dictionary with breakdown

9. **Add method documentation**
   - Write detailed docstring with formula
   - Explain when reorder should occur
   - Include practical example
   - Document return value and units
   - List potential exceptions

### Reorder Point Formula Breakdown

| Symbol | Name | Description | Unit |
|--------|------|-------------|------|
| ROP | Reorder Point | When to place order | Units |
| D | Daily Demand | Average consumption | Units/day |
| L | Lead Time | Delivery time | Days |
| SS | Safety Stock | Buffer inventory | Units |

### Formula Components

| Component | Formula | Purpose |
|-----------|---------|---------|
| Lead Time Demand | D × L | Expected usage during lead time |
| Safety Stock | Z × σ × √L | Buffer for variability |
| Reorder Point | (D × L) + SS | Total trigger level |

### Calculation Example

```
Given:
- Average Daily Demand (D): 50 units/day
- Lead Time (L): 10 days
- Safety Stock (SS): 87 units

Calculation:
Lead Time Demand = D × L = 50 × 10 = 500 units
ROP = (D × L) + SS
ROP = 500 + 87
ROP = 587 units

Interpretation:
When inventory drops to 587 units, place a new order.
```

### Reorder Point Visualization

```
Inventory Level
    │
    │                  Order
    │                 Arrives
    │                    ↓
    │  ┌────────────────┐
    │  │                │
ROP ├──┼───┐            │
    │  │   │ Lead Time  │
    │  │   │   Period   │
 SS ├──┼───┴────────────┘
    │  │
  0 └──┴──────────────────→ Time
       ↑
    Place Order
   (at ROP level)
```

### ROP Component Breakdown

| Scenario | Daily Demand | Lead Time | Safety Stock | ROP |
|----------|--------------|-----------|--------------|-----|
| Low Volume | 10 units/day | 5 days | 15 units | 65 units |
| Medium Volume | 50 units/day | 10 days | 87 units | 587 units |
| High Volume | 200 units/day | 7 days | 174 units | 1574 units |

### Edge Case Handling

| Condition | Issue | Solution |
|-----------|-------|----------|
| D = 0 | No demand history | Use minimum ROP (e.g., SS × 2) |
| L = 0 | Same-day delivery | ROP = SS only |
| SS calculation fails | Missing data | Use conservative 20% of monthly demand |
| ROP < SS | Logic error | Set ROP = SS × 1.5 minimum |

### Method Return Structure

```python
# Option 1: Simple return (numeric value)
return reorder_point_value

# Option 2: Detailed return (dictionary)
return {
    'reorder_point': 587,
    'lead_time_demand': 500,
    'safety_stock': 87,
    'breakdown': {
        'avg_daily_demand': 50,
        'lead_time_days': 10,
        'service_level': 95
    }
}
```

### Expected Outcome
- Functional reorder_point method calculating optimal reorder trigger
- Proper integration with safety_stock calculation
- Formula correctly implemented and documented
- Comprehensive breakdown of ROP components
- Logging for audit and troubleshooting

### Verification Checklist
- [ ] reorder_point method added to ReorderService
- [ ] Method accepts product_id and service_level parameters
- [ ] Average daily demand calculated correctly
- [ ] Lead time demand calculated: D × L
- [ ] Safety stock retrieved from safety_stock method
- [ ] Formula applied correctly: (D × L) + SS
- [ ] Result validated and rounded
- [ ] Edge cases handled appropriately
- [ ] Calculation logged with all components
- [ ] Method documented with formula and example
- [ ] ROP greater than or equal to safety stock

---

## Task 70: Create lead_time_demand Method

### Overview
Implement the lead_time_demand method to estimate the expected demand during the supplier lead time period. This method leverages demand forecasting results to predict future consumption rather than using simple historical averages. It provides more accurate demand estimates by incorporating forecast trends and seasonality.

### Dependencies
- Task 69: Create reorder_point Method
- ForecastResult model with future predictions

### Instructions

1. **Define method signature**
   - Create `lead_time_demand` method in ReorderService class
   - Accept `product_id` parameter
   - Accept optional `start_date` parameter (default today)
   - Define return type as float (expected demand units)

2. **Retrieve product lead time**
   - Call `_get_product_details(product_id)` helper method
   - Extract supplier lead time in days
   - Calculate end_date: start_date + lead_time
   - Validate lead time is positive value

3. **Query forecast data for lead time period**
   - Query ForecastResult model for product
   - Filter by date range: start_date to end_date
   - Get daily forecast predictions
   - Order by prediction date ascending

4. **Aggregate forecast demand**
   - Sum all daily predictions within lead time period
   - If forecasts are weekly, interpolate to daily values
   - Handle partial days appropriately
   - Calculate total expected demand

5. **Handle missing forecast data**
   - Check if sufficient forecasts are available
   - If forecasts missing, fall back to historical average
   - Calculate average daily demand from past sales
   - Multiply by lead time days
   - Log fallback usage for monitoring

6. **Apply confidence intervals**
   - Retrieve forecast confidence bounds if available
   - Calculate pessimistic estimate (lower bound)
   - Calculate optimistic estimate (upper bound)
   - Use median or mean prediction as primary value
   - Return expected value with confidence range

7. **Adjust for known events**
   - Check for festivals/holidays during lead time
   - Check for promotional periods in calendar
   - Apply uplift factors if events present
   - Integrate with FestivalCalendar data
   - Log any adjustments made

8. **Round and validate result**
   - Round result to nearest whole unit
   - Ensure result is non-negative
   - Validate result is reasonable compared to historical data
   - Apply sanity checks (not 10x normal demand)

9. **Add calculation logging**
   - Log date range used for calculation
   - Log number of forecast data points used
   - Log total aggregated demand
   - Log any adjustments or fallbacks
   - Include product ID in logs

10. **Add method documentation**
    - Write comprehensive docstring
    - Explain difference from simple average method
    - Document forecast integration approach
    - Include usage examples
    - Note fallback behavior

### Lead Time Demand Calculation Flow

```
1. Get product lead time (L days)
   ↓
2. Define forecast period: today to today+L
   ↓
3. Query ForecastResult for period
   ↓
4. Sum daily forecasts
   ↓
5. Apply event adjustments (festivals)
   ↓
6. Validate and return result
```

### Forecast vs. Historical Comparison

| Method | Calculation | Advantages | Disadvantages |
|--------|-------------|------------|---------------|
| Historical Average | D × L | Simple, always available | Ignores trends, seasonality |
| Forecast-Based | Σ(daily forecasts) | Accounts for trends, events | Requires forecast data |
| Hybrid | Weighted combination | Balanced approach | More complex |

### Forecast Aggregation Example

```
Given:
- Lead Time: 7 days
- Start Date: 2026-02-01
- End Date: 2026-02-07

Daily Forecasts:
- 2026-02-01: 45 units
- 2026-02-02: 48 units
- 2026-02-03: 52 units (weekend)
- 2026-02-04: 55 units (weekend)
- 2026-02-05: 50 units (festival)
- 2026-02-06: 46 units
- 2026-02-07: 44 units

Lead Time Demand = 45+48+52+55+50+46+44 = 340 units
```

### Event Adjustment Strategy

| Event Type | Detection | Adjustment | Example |
|------------|-----------|------------|---------|
| Festival | FestivalCalendar | +15-30% | Sinhala New Year |
| Weekend | Day of week | +10-20% | Saturday/Sunday |
| Promotion | Promotional calendar | +25-50% | Sales campaign |
| Holiday | Holiday calendar | -10% (business) | Poya Day |

### Fallback Strategy

| Scenario | Primary Method | Fallback Method | Last Resort |
|----------|----------------|-----------------|-------------|
| Normal | Forecast sum | 30-day avg × L | Product avg × L |
| New Product | Similar product forecast | Category average | Conservative estimate |
| No Data | Historical sales | Supplier suggestion | Manual input |

### Confidence Interval Handling

```
Forecast with Confidence:
- Lower Bound (10th percentile): 300 units
- Expected Value (50th percentile): 340 units
- Upper Bound (90th percentile): 385 units

Use Expected Value for ROP calculation
Use Upper Bound for safety stock validation
Log confidence range for reporting
```

### Method Return Options

| Return Type | Content | Use Case |
|-------------|---------|----------|
| Float | Simple demand value | Standard reorder calculations |
| Dict | Demand + confidence + breakdown | Advanced analytics, reporting |
| Tuple | (demand, lower, upper) | Risk analysis |

### Expected Outcome
- Functional lead_time_demand method using forecasts
- Integration with ForecastResult model
- Event-aware demand estimation
- Fallback to historical data when needed
- Confidence interval support

### Verification Checklist
- [ ] lead_time_demand method added to ReorderService
- [ ] Method accepts product_id and optional start_date
- [ ] Lead time retrieved from product details
- [ ] Forecast data queried for lead time period
- [ ] Daily forecasts aggregated correctly
- [ ] Fallback to historical average implemented
- [ ] Event adjustments applied (festivals, weekends)
- [ ] Result validated and rounded
- [ ] Calculation logged with details
- [ ] Method documented with examples
- [ ] Confidence intervals handled if available

---

## Task 71: Create optimal_order_qty Method

### Overview
Implement the optimal_order_qty method to calculate the Economic Order Quantity (EOQ), which minimizes the total cost of inventory by balancing ordering costs against holding costs. EOQ is a fundamental inventory optimization formula that determines the ideal order size to minimize expenses while maintaining adequate stock levels.

### Dependencies
- Task 70: Create lead_time_demand Method

### Instructions

1. **Define method signature**
   - Create `optimal_order_qty` method in ReorderService class
   - Accept `product_id` parameter
   - Accept optional `annual_demand` parameter (calculated if not provided)
   - Define return type as float (order quantity units)

2. **Calculate annual demand**
   - If annual_demand not provided, calculate from forecasts
   - Query ForecastResult for next 365 days
   - Sum all forecast predictions
   - Alternative: Use last 365 days historical sales
   - Validate demand is positive value

3. **Retrieve product cost data**
   - Call `_get_product_details(product_id)` helper method
   - Extract order_cost (fixed cost per order)
   - Extract holding_cost (cost to hold one unit per year)
   - Validate both costs are positive values
   - Convert percentages to absolute values if needed

4. **Calculate EOQ using formula**
   - Apply formula: EOQ = √((2 × D × S) / H)
   - Where D = annual demand (units/year)
   - Where S = order cost (LKR/order)
   - Where H = holding cost (LKR/unit/year)
   - Use math.sqrt for square root calculation

5. **Handle missing cost data**
   - If order_cost not set, use industry default (e.g., 5000 LKR)
   - If holding_cost not set, estimate as 20-25% of product cost
   - Log when using default values
   - Warn users to configure actual costs

6. **Apply business constraints**
   - Check supplier minimum order quantity (MOQ)
   - If EOQ < MOQ, adjust to MOQ
   - Check supplier maximum order quantity
   - Check warehouse capacity constraints
   - Round to supplier pack sizes if applicable

7. **Validate result reasonableness**
   - Ensure EOQ is reasonable (not too small or large)
   - Compare to historical order sizes
   - Check EOQ is within 10-90 days of demand
   - Apply sanity checks (not more than annual demand)

8. **Calculate order frequency**
   - Calculate orders per year: annual_demand / EOQ
   - Calculate days between orders: 365 / orders_per_year
   - Include in return value or log for reference
   - Help validate EOQ is practical

9. **Add calculation logging**
   - Log all input parameters (D, S, H)
   - Log calculated EOQ before constraints
   - Log applied constraints and adjustments
   - Log final order quantity and frequency
   - Include product ID in all logs

10. **Add method documentation**
    - Write comprehensive docstring with EOQ formula
    - Explain cost trade-off concept
    - Document assumptions and limitations
    - Include calculation examples
    - Note constraint handling

### EOQ Formula Breakdown

| Symbol | Name | Description | Unit |
|--------|------|-------------|------|
| EOQ | Economic Order Quantity | Optimal order size | Units |
| D | Annual Demand | Yearly consumption | Units/year |
| S | Order Cost | Fixed cost per order | LKR/order |
| H | Holding Cost | Cost to store one unit/year | LKR/unit/year |

### EOQ Formula Derivation

```
Total Cost = Order Cost + Holding Cost
TC = (D/Q × S) + (Q/2 × H)

Where:
- D/Q = number of orders per year
- Q/2 = average inventory level
- S = cost per order
- H = holding cost per unit

Minimize TC by taking derivative and setting to 0:
dTC/dQ = -DS/Q² + H/2 = 0

Solving for Q:
Q = √(2DS/H)
```

### EOQ Calculation Example

```
Given:
- Annual Demand (D): 12,000 units/year
- Order Cost (S): 5,000 LKR/order
- Holding Cost (H): 100 LKR/unit/year

Calculation:
EOQ = √((2 × D × S) / H)
EOQ = √((2 × 12,000 × 5,000) / 100)
EOQ = √(120,000,000 / 100)
EOQ = √1,200,000
EOQ = 1,095 units

Result:
- Optimal order size: 1,095 units
- Orders per year: 12,000 / 1,095 ≈ 11 orders
- Days between orders: 365 / 11 ≈ 33 days
```

### Cost Trade-off Visualization

```
Cost (LKR)
    │
    │     Order Cost
    │     (decreases with larger Q)
    │   ╱
    │  ╱
    │ ╱         Total Cost
    │╱           (minimized at EOQ)
    ├─────────────────────────
    │╲           ╱
    │ ╲         ╱
    │  ╲       ╱
    │   ╲  Holding Cost
    │    ╲ (increases with larger Q)
    │     ╲
    └──────────────────────────→ Order Quantity
             ↑
            EOQ
```

### Holding Cost Calculation

| Component | % of Product Value | Example (1000 LKR product) |
|-----------|-------------------|----------------------------|
| Capital Cost | 10-15% | 100-150 LKR |
| Storage Cost | 3-5% | 30-50 LKR |
| Insurance | 1-2% | 10-20 LKR |
| Obsolescence | 3-5% | 30-50 LKR |
| Shrinkage | 1-2% | 10-20 LKR |
| **Total** | **18-29%** | **180-290 LKR/year** |

### Order Cost Components

| Component | Description | Example Amount |
|-----------|-------------|----------------|
| Order Processing | Staff time, system costs | 1,500 LKR |
| Shipping | Freight charges | 2,000 LKR |
| Receiving | Inspection, putaway | 1,000 LKR |
| Invoice Processing | Payment, reconciliation | 500 LKR |
| **Total Order Cost** | | **5,000 LKR/order** |

### Supplier Constraints

| Constraint Type | Example | Adjustment |
|-----------------|---------|------------|
| Minimum Order Qty (MOQ) | 500 units | If EOQ < MOQ, use MOQ |
| Pack Size | 50 units | Round EOQ to nearest multiple |
| Maximum Order | 5,000 units | If EOQ > max, use max |
| Lead Time | 14 days | Consider in reorder timing |

### EOQ Validation Checks

| Check | Formula | Acceptable Range |
|-------|---------|------------------|
| Days of Supply | EOQ / avg_daily_demand | 20-60 days |
| Order Frequency | 365 / (D / EOQ) | 6-24 orders/year |
| As % of Annual | (EOQ / D) × 100 | 5-20% |
| Turnover Rate | D / (EOQ / 2) | 8-30 times/year |

### Edge Case Handling

| Condition | Issue | Solution |
|-----------|-------|----------|
| D = 0 | No demand | Return supplier MOQ or 0 |
| S = 0 | No order cost | Use minimum default (1000 LKR) |
| H = 0 | No holding cost | Estimate as 20% of product cost |
| Very high EOQ | > annual demand | Cap at 3 months demand |
| Very low EOQ | < 7 days demand | Use 2 weeks minimum |

### Method Return Structure

```python
# Option 1: Simple numeric return
return eoq_value

# Option 2: Detailed dictionary
return {
    'eoq': 1095,
    'annual_demand': 12000,
    'order_cost': 5000,
    'holding_cost': 100,
    'orders_per_year': 11,
    'days_between_orders': 33,
    'applied_constraints': ['rounded_to_pack_size'],
    'adjusted_from': 1092
}
```

### Expected Outcome
- Functional optimal_order_qty method calculating EOQ
- Proper implementation of Wilson's formula
- Cost data extraction and validation
- Supplier constraint handling
- Order frequency calculations

### Verification Checklist
- [ ] optimal_order_qty method added to ReorderService
- [ ] Method accepts product_id and optional annual_demand
- [ ] Annual demand calculated from forecasts if not provided
- [ ] Order cost and holding cost retrieved
- [ ] EOQ formula applied correctly: √((2DS)/H)
- [ ] Default costs used if missing (with logging)
- [ ] Supplier constraints applied (MOQ, pack size)
- [ ] Result validated for reasonableness
- [ ] Order frequency calculated
- [ ] Calculation logged with all components
- [ ] Method documented with formula and examples

---

## Task 72: Create ReorderSuggestion Model

### Overview
Create the ReorderSuggestion Django model to store calculated reorder recommendations in the database. This model captures the output of the ReorderService calculations and provides a historical record of reorder suggestions for analysis, reporting, and automated purchase order generation.

### Dependencies
- Task 71: Create optimal_order_qty Method
- Product model
- TenantModel for multi-tenancy

### Instructions

1. **Create model file**
   - Navigate to `backend/apps/ai/forecasting/models/` directory
   - Create new file named `reorder_suggestion.py`
   - Import necessary Django model classes

2. **Import required dependencies**
   - Import Django models and fields
   - Import TenantModel or TenantModelMixin
   - Import Product model from inventory app
   - Import timezone utilities
   - Import decimal and math utilities

3. **Define ReorderSuggestion model class**
   - Create class extending TenantModel
   - Add docstring explaining model purpose
   - Set Django Meta options

4. **Add product foreign key relationship**
   - Create ForeignKey to Product model
   - Set on_delete to CASCADE (if product deleted, remove suggestions)
   - Set related_name to 'reorder_suggestions'
   - Add db_index for query performance

5. **Add calculation date fields**
   - Create `calculated_at` DateTimeField with auto_now_add
   - Create `reorder_date` DateField (from Task 74)
   - Create optional `valid_until` DateField
   - Add indexes on date fields

6. **Add suggested quantities (Task 73 details)**
   - Create `suggested_qty` PositiveIntegerField
   - Create `optimal_order_qty` PositiveIntegerField (EOQ)
   - Create `current_stock_level` PositiveIntegerField (snapshot)
   - Add validators for reasonable ranges

7. **Add urgency field (Task 75 details)**
   - Create `urgency` CharField with choices
   - Define urgency levels: LOW, MEDIUM, HIGH, CRITICAL
   - Add default value (MEDIUM)
   - Add db_index for filtering

8. **Add calculation breakdown fields**
   - Create `safety_stock_used` PositiveIntegerField
   - Create `reorder_point_used` PositiveIntegerField
   - Create `lead_time_demand` PositiveIntegerField
   - Create `service_level` DecimalField (percentage)
   - Store calculation inputs for transparency

9. **Add status and action tracking**
   - Create `status` CharField (PENDING, APPROVED, ORDERED, CANCELLED)
   - Create `action_taken_at` DateTimeField (null=True)
   - Create `action_taken_by` ForeignKey to User (null=True)
   - Create `notes` TextField (optional, blank=True)

10. **Add cost calculation fields**
    - Create `estimated_order_cost` DecimalField
    - Create `estimated_value` DecimalField (qty × unit_price)
    - Create `annual_demand_used` PositiveIntegerField
    - Help with budget planning

11. **Configure model Meta options**
    - Set table name: 'ai_reorder_suggestions'
    - Add ordering: ['-calculated_at', '-urgency']
    - Add unique_together: ['product', 'calculated_at'] (one per day)
    - Add verbose_name and verbose_name_plural
    - Add indexes on commonly queried fields

12. **Implement __str__ method**
    - Return readable string representation
    - Format: "Product Name - Reorder 500 units (HIGH urgency)"
    - Include key information for admin display

13. **Create helper methods**
    - Add `is_urgent()` method returning boolean
    - Add `days_until_reorder()` method calculating days
    - Add `get_urgency_display_color()` for UI rendering
    - Add `to_dict()` method for API serialization

14. **Add validation methods**
    - Override `clean()` method for model validation
    - Validate suggested_qty > 0
    - Validate reorder_date is future date
    - Validate current_stock_level is reasonable

15. **Create custom manager**
    - Create ReorderSuggestionManager class
    - Add `active()` queryset method for non-cancelled
    - Add `urgent()` queryset method for HIGH/CRITICAL
    - Add `for_product(product_id)` convenience method

### Model Field Summary

| Field | Type | Purpose | Null | Index |
|-------|------|---------|------|-------|
| product | ForeignKey | Link to Product | No | Yes |
| calculated_at | DateTimeField | Calculation timestamp | No | Yes |
| reorder_date | DateField | When to reorder | No | Yes |
| suggested_qty | PositiveIntegerField | How much to order | No | No |
| optimal_order_qty | PositiveIntegerField | EOQ calculation | No | No |
| current_stock_level | PositiveIntegerField | Stock snapshot | No | No |
| urgency | CharField | Priority level | No | Yes |
| status | CharField | Action status | No | Yes |

### Urgency Level Choices

| Choice Value | Display Name | Use Case |
|--------------|--------------|----------|
| LOW | Low | Stock comfortable, plan ahead |
| MEDIUM | Medium | Standard reorder timeframe |
| HIGH | High | Stock below ROP, order soon |
| CRITICAL | Critical | Below safety stock, urgent |

### Status Choices

| Choice Value | Display Name | Meaning |
|--------------|--------------|---------|
| PENDING | Pending Review | Awaiting action |
| APPROVED | Approved | Ready to order |
| ORDERED | Order Placed | PO created |
| CANCELLED | Cancelled | Not needed |

### Model Relationships

```
ReorderSuggestion
├── ForeignKey → Product (CASCADE)
├── ForeignKey → User (action_taken_by, NULL)
└── Related from: PurchaseOrder (potential)
```

### Model Meta Configuration

```python
class Meta:
    db_table = 'ai_reorder_suggestions'
    ordering = ['-calculated_at', '-urgency']
    unique_together = [['product', 'calculated_at']]
    indexes = [
        models.Index(fields=['product', '-calculated_at']),
        models.Index(fields=['urgency', 'status']),
        models.Index(fields=['reorder_date']),
    ]
    verbose_name = 'Reorder Suggestion'
    verbose_name_plural = 'Reorder Suggestions'
```

### Helper Methods

| Method | Return Type | Purpose |
|--------|-------------|---------|
| is_urgent() | bool | Returns True if HIGH or CRITICAL |
| days_until_reorder() | int | Days from today to reorder_date |
| get_urgency_color() | str | CSS color for urgency display |
| to_dict() | dict | JSON-serializable representation |

### Expected Outcome
- Functional Django model for storing reorder suggestions
- Proper relationships with Product model
- Comprehensive fields capturing all calculation details
- Status tracking for workflow management
- Helper methods for common operations

### Verification Checklist
- [ ] reorder_suggestion.py file created in models directory
- [ ] ReorderSuggestion model defined extending TenantModel
- [ ] Product ForeignKey relationship added
- [ ] Date fields (calculated_at, reorder_date) added
- [ ] Quantity fields (suggested_qty, optimal_order_qty) added
- [ ] Urgency CharField with choices defined
- [ ] Status CharField with choices defined
- [ ] Calculation breakdown fields added
- [ ] Cost estimation fields added
- [ ] Model Meta options configured
- [ ] __str__ method implemented
- [ ] Helper methods created
- [ ] Validation in clean() method
- [ ] Custom manager class created

---

## Task 73: Create suggested_qty Field

### Overview
Implement the suggested_qty field in the ReorderSuggestion model with proper validation, documentation, and business logic. This field stores the recommended order quantity calculated by the ReorderService. While the field definition is part of Task 72, this task focuses on its specific configuration, validation rules, and integration with the order quantity calculation logic.

### Dependencies
- Task 72: Create ReorderSuggestion Model

### Instructions

1. **Define field in model**
   - Add `suggested_qty` to ReorderSuggestion model
   - Use PositiveIntegerField type
   - Set verbose_name to "Suggested Order Quantity"
   - Add help_text explaining the field purpose

2. **Add field validation**
   - Set validators list with MinValueValidator(1)
   - Add MaxValueValidator for reasonable upper bound (e.g., 100000)
   - Ensure quantity is always positive
   - Add validation in model's clean() method

3. **Set database constraints**
   - Ensure null=False (required field)
   - Set blank=False (must be provided)
   - Add database-level constraint for positive values
   - Consider adding check constraint in migration

4. **Link to optimal_order_qty calculation**
   - Document relationship with EOQ calculation
   - Typically suggested_qty = optimal_order_qty
   - May be adjusted for supplier constraints
   - May be adjusted for budget constraints

5. **Add business logic for quantity adjustment**
   - Create method `calculate_suggested_qty(eoq, constraints)`
   - Apply supplier minimum order quantity (MOQ)
   - Round to supplier pack sizes
   - Check budget/cash flow limits
   - Return adjusted quantity

6. **Create quantity validation logic**
   - Validate against warehouse capacity
   - Validate against budget allocations
   - Check quantity covers lead time demand + safety stock
   - Ensure quantity is practical for the product

7. **Add field documentation**
   - Document in model docstring
   - Explain how suggested_qty is calculated
   - Note differences from optimal_order_qty
   - List constraint factors

8. **Create admin display customization**
   - Format field in admin list_display
   - Add color coding for different quantity ranges
   - Show comparison to optimal_order_qty
   - Display as currency if needed (qty × unit_price)

9. **Add API serialization rules**
   - Include in API responses
   - Add read-only flag (calculated value)
   - Format with appropriate unit labels
   - Include currency value in response

### Field Definition

```python
suggested_qty = models.PositiveIntegerField(
    verbose_name="Suggested Order Quantity",
    help_text="Recommended quantity to order based on EOQ and constraints",
    validators=[
        MinValueValidator(1, message="Order quantity must be at least 1"),
        MaxValueValidator(100000, message="Order quantity seems unreasonably high")
    ]
)
```

### Quantity Calculation Logic

```
Calculate Suggested Quantity:
1. Start with optimal_order_qty (EOQ)
2. Apply supplier MOQ constraint
3. Round to pack size
4. Check budget limit
5. Check warehouse capacity
6. Validate covers demand + safety stock
7. Return final suggested_qty
```

### Constraint Application Example

```
EOQ Calculation: 1,095 units
Supplier MOQ: 500 units ✓ (EOQ > MOQ)
Pack Size: 50 units → Round 1,095 to 1,100 units
Budget Limit: 200,000 LKR ✓ (1,100 × 150 = 165,000)
Warehouse Capacity: 5,000 units ✓ (1,100 < 5,000)

Final suggested_qty: 1,100 units
```

### Validation Rules

| Rule | Check | Action if Failed |
|------|-------|------------------|
| Minimum Quantity | >= 1 | Raise ValidationError |
| Maximum Quantity | <= 100,000 | Raise ValidationError |
| Supplier MOQ | >= supplier.min_order_qty | Adjust to MOQ |
| Pack Size | multiple of pack_size | Round up to nearest multiple |
| Budget | qty × price <= budget | Reduce to budget limit |
| Capacity | <= warehouse.capacity | Reduce to capacity |

### Admin Display Format

```python
def get_suggested_qty_display(self, obj):
    """Format suggested quantity for admin display."""
    qty = obj.suggested_qty
    value = qty * obj.product.unit_cost
    
    # Color coding
    if qty > obj.optimal_order_qty * 1.2:
        color = 'red'  # Much higher than optimal
    elif qty < obj.optimal_order_qty * 0.8:
        color = 'orange'  # Much lower than optimal
    else:
        color = 'green'  # Close to optimal
    
    return format_html(
        '<span style="color: {};">{} units<br/>(LKR {:,.0f})</span>',
        color, qty, value
    )
```

### API Response Format

```json
{
    "id": 123,
    "product": {
        "id": 456,
        "name": "Product Name",
        "sku": "SKU-001"
    },
    "suggested_qty": 1100,
    "suggested_qty_display": "1,100 units",
    "optimal_order_qty": 1095,
    "variance_from_optimal": 5,
    "variance_percentage": 0.46,
    "estimated_value": 165000,
    "estimated_value_display": "LKR 165,000"
}
```

### Expected Outcome
- Properly configured suggested_qty field with validation
- Business logic for quantity adjustment
- Constraint application (MOQ, pack size, budget)
- Admin display formatting
- API serialization support

### Verification Checklist
- [ ] suggested_qty field added to model
- [ ] PositiveIntegerField type used
- [ ] Verbose name and help text set
- [ ] MinValueValidator(1) added
- [ ] MaxValueValidator added
- [ ] null=False, blank=False set
- [ ] Quantity adjustment logic implemented
- [ ] Supplier MOQ constraint applied
- [ ] Pack size rounding implemented
- [ ] Budget validation added
- [ ] Warehouse capacity checked
- [ ] Admin display customized
- [ ] API serialization configured
- [ ] Field documented in model docstring

---

## Task 74: Create reorder_date Field

### Overview
Implement the reorder_date field in the ReorderSuggestion model to specify when the order should be placed. This date is calculated based on current stock levels, reorder point, demand forecast, and lead time to ensure the order arrives before stock runs out. Proper timing is critical for maintaining inventory levels without stockouts or excess inventory.

### Dependencies
- Task 73: Create suggested_qty Field

### Instructions

1. **Define field in model**
   - Add `reorder_date` to ReorderSuggestion model
   - Use DateField type
   - Set verbose_name to "Recommended Order Date"
   - Add help_text explaining when to place order

2. **Add field validation**
   - Ensure reorder_date is not in the past
   - Validate date is reasonable (within next 90 days typically)
   - Add validation in model's clean() method
   - Allow manual override with warning

3. **Set database constraints**
   - Set null=False (required field)
   - Set blank=False (must be calculated)
   - Add database index for date queries
   - Consider adding check constraint for future dates

4. **Implement reorder date calculation logic**
   - Calculate based on: (current_stock - reorder_point) / avg_daily_demand
   - Result is days until ROP reached
   - Subtract lead time to get order date
   - Add safety buffer (e.g., 1-2 days)

5. **Create calculation method**
   - Define `calculate_reorder_date(product_id)` in ReorderService
   - Get current stock level from product
   - Get reorder point from Task 69 calculation
   - Get average daily demand from forecasts
   - Calculate days until reorder point
   - Subtract lead time and buffer
   - Return calculated date

6. **Handle different urgency scenarios**
   - If current stock < safety stock: reorder_date = today
   - If current stock < ROP: reorder_date = today + buffer
   - If current stock > ROP: calculate based on consumption rate
   - Log urgency determination

7. **Add business day adjustment**
   - Check if calculated date is weekend/holiday
   - Move date to previous business day if needed
   - Consider supplier operating days
   - Integration with holiday calendar

8. **Create date validation logic**
   - Ensure date is not too far in future (> 90 days)
   - Warn if date is very soon (< 2 days)
   - Check against supplier lead time
   - Validate date makes sense given stock levels

9. **Add admin display customization**
   - Format date in readable format
   - Show days until reorder date
   - Color code by urgency (red if today/tomorrow)
   - Add countdown timer or indicator

10. **Add API serialization**
    - Include in API responses
    - Format as ISO date string
    - Add relative time display ("in 5 days")
    - Include business day calculation

### Field Definition

```python
reorder_date = models.DateField(
    verbose_name="Recommended Order Date",
    help_text="Date when the purchase order should be placed",
    validators=[
        # Custom validator to ensure future date
    ],
    db_index=True
)
```

### Reorder Date Calculation Formula

```
Days Until ROP = (Current Stock - Reorder Point) / Avg Daily Demand

If Days Until ROP > Lead Time:
    Reorder Date = Today + (Days Until ROP - Lead Time - Buffer)
Else:
    Reorder Date = Today (urgent)
```

### Calculation Examples

```
Example 1: Normal Scenario
- Current Stock: 600 units
- Reorder Point: 400 units
- Avg Daily Demand: 20 units/day
- Lead Time: 7 days
- Buffer: 2 days

Days Until ROP = (600 - 400) / 20 = 10 days
Reorder Date = Today + (10 - 7 - 2) = Today + 1 day

Example 2: Urgent Scenario
- Current Stock: 380 units
- Reorder Point: 400 units
- Already below ROP!

Reorder Date = Today (URGENT)

Example 3: Comfortable Stock
- Current Stock: 1200 units
- Reorder Point: 400 units
- Avg Daily Demand: 20 units/day
- Lead Time: 7 days
- Buffer: 2 days

Days Until ROP = (1200 - 400) / 20 = 40 days
Reorder Date = Today + (40 - 7 - 2) = Today + 31 days
```

### Urgency-Based Date Calculation

| Stock Level | Days Until ROP | Reorder Date | Urgency |
|-------------|----------------|--------------|---------|
| < Safety Stock | Negative | Today | CRITICAL |
| < ROP | 0-7 days | Today + buffer | HIGH |
| < 1.5 × ROP | 7-14 days | Calculate normally | MEDIUM |
| > 1.5 × ROP | 14+ days | Calculate normally | LOW |

### Business Day Adjustment

```
If calculated reorder_date is weekend:
    Move to Friday before weekend
    
If calculated reorder_date is public holiday:
    Move to previous business day
    
If calculated reorder_date is supplier off-day:
    Move to previous supplier operating day
```

### Date Validation Rules

| Rule | Check | Action |
|------|-------|--------|
| Future Date | >= today | Allow |
| Too Soon | < today + 2 days | Warn, allow override |
| Too Far | > today + 90 days | Warn, allow override |
| Past Date | < today | Reject (ValidationError) |
| Weekend | is weekend day | Adjust to Friday |
| Holiday | is public holiday | Adjust to previous day |

### Admin Display Format

```python
def get_reorder_date_display(self, obj):
    """Format reorder date with urgency indicator."""
    days_until = (obj.reorder_date - timezone.now().date()).days
    
    if days_until <= 0:
        color = 'red'
        urgency_text = 'ORDER NOW'
    elif days_until <= 2:
        color = 'orange'
        urgency_text = f'in {days_until} day(s)'
    else:
        color = 'green'
        urgency_text = f'in {days_until} days'
    
    return format_html(
        '<span style="color: {};">{}<br/><small>{}</small></span>',
        color,
        obj.reorder_date.strftime('%Y-%m-%d'),
        urgency_text
    )
```

### API Response Format

```json
{
    "reorder_date": "2026-02-15",
    "reorder_date_display": "February 15, 2026",
    "days_until_reorder": 15,
    "relative_time": "in 15 days",
    "is_urgent": false,
    "is_weekend": false,
    "is_holiday": false,
    "calculation_breakdown": {
        "current_stock": 600,
        "reorder_point": 400,
        "avg_daily_demand": 20,
        "days_until_rop": 10,
        "lead_time_days": 7,
        "buffer_days": 2
    }
}
```

### Expected Outcome
- Properly configured reorder_date field
- Intelligent date calculation based on stock and demand
- Urgency-aware date setting
- Business day adjustment logic
- Admin display with urgency indicators

### Verification Checklist
- [ ] reorder_date field added to model
- [ ] DateField type used
- [ ] Verbose name and help text set
- [ ] Database index added
- [ ] Future date validation implemented
- [ ] calculate_reorder_date method created in ReorderService
- [ ] Days until ROP calculation implemented
- [ ] Urgency-based date setting (CRITICAL = today)
- [ ] Business day adjustment logic added
- [ ] Weekend/holiday checking implemented
- [ ] Date validation rules applied
- [ ] Admin display customized with color coding
- [ ] API serialization with relative time
- [ ] Field documented in model docstring

---

## Task 75: Create urgency Field

### Overview
Implement the urgency field in the ReorderSuggestion model to classify reorder suggestions by priority level. This field helps procurement teams prioritize their purchasing activities by indicating which items need immediate attention versus those that can be ordered according to regular schedules. The urgency level is calculated based on current stock relative to safety stock and reorder point.

### Dependencies
- Task 74: Create reorder_date Field

### Instructions

1. **Define urgency level choices**
   - Create URGENCY_CHOICES tuple with four levels
   - Define LOW ('low'), MEDIUM ('medium'), HIGH ('high'), CRITICAL ('critical')
   - Set display names for each choice
   - Document criteria for each level

2. **Define field in model**
   - Add `urgency` to ReorderSuggestion model
   - Use CharField with max_length=10
   - Set choices=URGENCY_CHOICES
   - Set default='medium'
   - Add verbose_name and help_text

3. **Add database optimization**
   - Set db_index=True for filtering
   - Consider adding to model indexes list
   - Include in unique_together if needed
   - Optimize for admin list queries

4. **Implement urgency calculation logic**
   - Create `calculate_urgency(product_id)` in ReorderService
   - Get current stock level
   - Get safety stock value
   - Get reorder point value
   - Apply urgency determination rules

5. **Define urgency determination rules**
   - CRITICAL: current_stock < safety_stock
   - HIGH: safety_stock <= current_stock < reorder_point
   - MEDIUM: reorder_point <= current_stock < (1.5 × reorder_point)
   - LOW: current_stock >= (1.5 × reorder_point)
   - Log urgency determination reasoning

6. **Add urgency-based business logic**
   - Create `is_urgent()` model method returning boolean
   - Return True for HIGH or CRITICAL urgency
   - Create `requires_immediate_action()` for CRITICAL only
   - Use in admin filters and notifications

7. **Implement urgency color coding**
   - Create `get_urgency_color()` model method
   - CRITICAL: red (#DC2626)
   - HIGH: orange (#EA580C)
   - MEDIUM: yellow (#CA8A04)
   - LOW: green (#16A34A)
   - Use in admin and frontend display

8. **Add urgency sorting logic**
   - Define urgency sort order in model Meta
   - CRITICAL first, then HIGH, MEDIUM, LOW
   - Combine with date sorting for prioritization
   - Use in queryset ordering

9. **Create urgency-based filtering**
   - Add manager methods: `urgent()`, `critical()`, `low_priority()`
   - Add admin filters for urgency levels
   - Create dashboard widgets for urgent items
   - Enable API filtering by urgency

10. **Add notification integration**
    - Send email/SMS for CRITICAL urgency
    - Send dashboard alert for HIGH urgency
    - Daily digest for MEDIUM urgency
    - Weekly summary for LOW urgency
    - Configure in notification system

11. **Add admin display customization**
    - Show urgency with color badge
    - Add icon indicators for urgency
    - Sort by urgency by default
    - Add urgency count summary

12. **Add API serialization**
    - Include urgency value and display name
    - Add color code for frontend rendering
    - Include urgency_rank for sorting
    - Add boolean flags (is_urgent, is_critical)

### Urgency Choices Definition

```python
URGENCY_CHOICES = [
    ('low', 'Low Priority'),
    ('medium', 'Medium Priority'),
    ('high', 'High Priority'),
    ('critical', 'Critical - Immediate Action Required'),
]
```

### Urgency Determination Rules

| Urgency Level | Stock Condition | Reorder Timing | Action Required |
|---------------|----------------|----------------|-----------------|
| CRITICAL | Stock < Safety Stock | Order immediately | Today |
| HIGH | Safety Stock ≤ Stock < ROP | Order soon | Within 2 days |
| MEDIUM | ROP ≤ Stock < 1.5 × ROP | Order normally | Within 1 week |
| LOW | Stock ≥ 1.5 × ROP | Plan ahead | Within 2-4 weeks |

### Calculation Examples

```
Example 1: CRITICAL Urgency
- Current Stock: 50 units
- Safety Stock: 87 units
- Reorder Point: 587 units
- Condition: 50 < 87 (below safety stock)
- Urgency: CRITICAL

Example 2: HIGH Urgency
- Current Stock: 400 units
- Safety Stock: 87 units
- Reorder Point: 587 units
- Condition: 87 ≤ 400 < 587 (below ROP)
- Urgency: HIGH

Example 3: MEDIUM Urgency
- Current Stock: 650 units
- Safety Stock: 87 units
- Reorder Point: 587 units
- 1.5 × ROP: 880 units
- Condition: 587 ≤ 650 < 880
- Urgency: MEDIUM

Example 4: LOW Urgency
- Current Stock: 1200 units
- Safety Stock: 87 units
- Reorder Point: 587 units
- 1.5 × ROP: 880 units
- Condition: 1200 >= 880
- Urgency: LOW
```

### Urgency Calculation Logic

```
def calculate_urgency(product_id):
    stock = get_current_stock(product_id)
    ss = safety_stock(product_id)
    rop = reorder_point(product_id)
    
    if stock < ss:
        return 'critical'
    elif stock < rop:
        return 'high'
    elif stock < (rop * 1.5):
        return 'medium'
    else:
        return 'low'
```

### Urgency Color Scheme

| Urgency | Color | Hex Code | Use Case |
|---------|-------|----------|----------|
| CRITICAL | Red | #DC2626 | Immediate attention |
| HIGH | Orange | #EA580C | Priority handling |
| MEDIUM | Yellow | #CA8A04 | Normal processing |
| LOW | Green | #16A34A | Routine planning |

### Manager Methods

```python
class ReorderSuggestionManager(models.Manager):
    def urgent(self):
        """Return HIGH and CRITICAL suggestions."""
        return self.filter(urgency__in=['high', 'critical'])
    
    def critical(self):
        """Return only CRITICAL suggestions."""
        return self.filter(urgency='critical')
    
    def low_priority(self):
        """Return LOW priority suggestions."""
        return self.filter(urgency='low')
```

### Admin Display Format

```python
def get_urgency_badge(self, obj):
    """Display urgency as colored badge."""
    colors = {
        'critical': '#DC2626',
        'high': '#EA580C',
        'medium': '#CA8A04',
        'low': '#16A34A'
    }
    icons = {
        'critical': '🔴',
        'high': '🟠',
        'medium': '🟡',
        'low': '🟢'
    }
    
    return format_html(
        '<span style="background: {}; color: white; padding: 3px 8px; '
        'border-radius: 3px; font-weight: bold;">{} {}</span>',
        colors[obj.urgency],
        icons[obj.urgency],
        obj.get_urgency_display()
    )
```

### Notification Rules

| Urgency | Channel | Timing | Recipients |
|---------|---------|--------|------------|
| CRITICAL | Email + SMS | Immediate | Procurement Manager, Buyer |
| HIGH | Email + Dashboard | Within 1 hour | Procurement Team |
| MEDIUM | Dashboard | Daily digest | Procurement Team |
| LOW | Email | Weekly summary | Procurement Team |

### API Response Format

```json
{
    "urgency": "high",
    "urgency_display": "High Priority",
    "urgency_color": "#EA580C",
    "urgency_icon": "🟠",
    "urgency_rank": 2,
    "is_urgent": true,
    "is_critical": false,
    "requires_immediate_action": false,
    "stock_status": {
        "current_stock": 400,
        "safety_stock": 87,
        "reorder_point": 587,
        "status_text": "Below reorder point"
    }
}
```

### Expected Outcome
- Properly configured urgency field with choices
- Intelligent urgency calculation based on stock levels
- Color-coded display in admin and API
- Manager methods for filtering by urgency
- Notification integration for urgent items

### Verification Checklist
- [ ] URGENCY_CHOICES defined with four levels
- [ ] urgency field added to model with choices
- [ ] CharField with max_length=10 used
- [ ] Default value set to 'medium'
- [ ] Database index added
- [ ] calculate_urgency method created in ReorderService
- [ ] Urgency rules implemented (CRITICAL/HIGH/MEDIUM/LOW)
- [ ] get_urgency_color() method added
- [ ] is_urgent() method added
- [ ] Manager methods (urgent, critical) created
- [ ] Admin display with color badges configured
- [ ] Notification integration added
- [ ] API serialization with color and rank
- [ ] Field documented in model docstring

---

## Summary

This document established the foundation for the reorder suggestion system by implementing the ReorderService with calculation methods for safety stock, reorder point, lead time demand, and optimal order quantity. It also created the ReorderSuggestion model to store these calculations with proper fields for suggested quantity, reorder date, and urgency level.

### Completed Tasks
1. ✓ Created ReorderService class with initialization and helper methods
2. ✓ Implemented safety_stock method using statistical formula
3. ✓ Implemented reorder_point method combining demand and safety stock
4. ✓ Implemented lead_time_demand method using forecasts
5. ✓ Implemented optimal_order_qty method using EOQ formula
6. ✓ Created ReorderSuggestion model with relationships and tracking
7. ✓ Created suggested_qty field with validation and constraints
8. ✓ Created reorder_date field with intelligent calculation
9. ✓ Created urgency field with priority classification

### Key Formulas Implemented
- **Safety Stock:** SS = Z × σ × √L
- **Reorder Point:** ROP = (D × L) + SS
- **Economic Order Quantity:** EOQ = √((2DS)/H)
- **Urgency:** Based on current stock vs. safety stock and ROP

### Next Steps
Proceed to [02_Tasks-76-80_Alert-Task-Dashboard.md](02_Tasks-76-80_Alert-Task-Dashboard.md) to create the ReorderAlert system, batch generation functionality, Celery task for automation, and admin dashboard for managing reorder suggestions.
