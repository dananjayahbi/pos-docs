# Tasks 69-75: Trending Service and Cache

> **Phase:** 10 - AI Features & Advanced Capabilities  
> **SubPhase:** 02 - Product Recommendations  
> **Group:** E - Trending & Serving  
> **Document:** 01 of 02  
> **Tasks Covered:** 69, 70, 71, 72, 73, 74, 75

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-76-82_Engine-Signals-Verify.md](02_Tasks-76-82_Engine-Signals-Verify.md)

---

## Document Overview

This document covers the implementation of the trending products system. It establishes a comprehensive service for identifying and ranking products based on sales velocity with temporal decay factors. The TrendingService calculates real-time product popularity using sales velocity metrics, applies time decay to prioritize recent sales, and provides category-specific trending results. The system includes a Celery task for periodic updates and Redis caching for optimal performance.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 69 | Create TrendingService | Medium | 45 min |
| 70 | Create sales_velocity | Medium | 30 min |
| 71 | Create time_decay | Low | 20 min |
| 72 | Create get_trending Method | Medium | 40 min |
| 73 | Create category_trending | Medium | 35 min |
| 74 | Create TrendingTask | Medium | 30 min |
| 75 | Create Trending Cache | Medium | 25 min |

---

## Task 69: Create TrendingService

### Overview
Create the TrendingService class to identify and rank trending products based on sales velocity and time decay factors. This service analyzes order data to determine which products are currently popular, applying mathematical formulas to calculate trending scores that combine recent sales velocity with temporal decay. The service provides the foundation for displaying trending products to customers in the webstore.

### Dependencies
- Task 68: Create PersonalizedService (from Group D)
- Backend multi-tenancy infrastructure
- Django ORM and database access
- Order and product models

### Instructions

1. **Create service file structure**
   - Navigate to `backend/apps/ai/recommendations/services/` directory
   - Create new file named `trending_service.py`
   - This file contains the TrendingService class

2. **Import required dependencies**
   - Import Django timezone utilities for date calculations
   - Import datetime and timedelta for temporal operations
   - Import Decimal for precise numeric calculations
   - Import Django cache framework
   - Import tenant-aware models (Product, Order, OrderItem)
   - Import Django database functions (Sum, Count, F, Q)
   - Import logging for error tracking

3. **Define TrendingService class**
   - Create class named `TrendingService`
   - Initialize logger for debugging and monitoring
   - Class handles all trending product calculations

4. **Define class attributes**
   - Set DEFAULT_DECAY_RATE to 0.95
   - Set DEFAULT_VELOCITY_WINDOW to 7 days
   - Set DEFAULT_TRENDING_LIMIT to 20
   - Set CACHE_TTL to 14400 seconds (4 hours)
   - Document the purpose of each constant

5. **Create initialization method**
   - Define `__init__` method with optional parameters
   - Accept decay_rate parameter (defaults to DEFAULT_DECAY_RATE)
   - Accept velocity_window parameter (defaults to DEFAULT_VELOCITY_WINDOW)
   - Store parameters as instance attributes
   - Add docstring explaining parameters

6. **Add helper methods structure**
   - Plan for sales_velocity method (Task 70)
   - Plan for time_decay method (Task 71)
   - Plan for get_trending method (Task 72)
   - Plan for category_trending method (Task 73)

### Service Architecture

```
TrendingService
│
├── Initialization
│   ├── decay_rate (default: 0.95)
│   └── velocity_window (default: 7 days)
│
├── Core Methods
│   ├── sales_velocity (Task 70)
│   ├── time_decay (Task 71)
│   ├── get_trending (Task 72)
│   └── category_trending (Task 73)
│
└── Integration
    ├── TrendingTask (Task 74)
    └── Cache Layer (Task 75)
```

### Service Configuration

| Parameter | Default | Purpose |
|-----------|---------|---------|
| decay_rate | 0.95 | Rate of temporal decay per day |
| velocity_window | 7 days | Lookback period for sales calculation |
| trending_limit | 20 | Maximum trending products to return |
| cache_ttl | 4 hours | Cache lifetime for trending results |

### Decay Rate Impact

| Days Ago | Factor (0.95) | Explanation |
|----------|---------------|-------------|
| 0 | 1.0 | Today: Full weight |
| 1 | 0.95 | Yesterday: 95% weight |
| 7 | 0.70 | Last week: 70% weight |
| 14 | 0.49 | Two weeks: 49% weight |
| 30 | 0.21 | Last month: 21% weight |

### Sales Velocity Concept

```
Sales Velocity = Total Sales / Time Period

Example:
Product A: 140 sales in 7 days = 20 sales/day
Product B: 50 sales in 7 days = 7.14 sales/day
Product C: 30 sales in 7 days = 4.29 sales/day

Product A has highest velocity → More likely to trend
```

### Time Decay Concept

```
Time Decay Factor = decay_rate ^ days_ago

Purpose: Recent sales weigh more than old sales

Example (decay_rate = 0.95):
Sale today:     1.0 × quantity
Sale yesterday: 0.95 × quantity
Sale 7 days:    0.70 × quantity
Sale 30 days:   0.21 × quantity
```

### Trending Score Calculation

```
For each product:
1. Calculate sales velocity over window
2. Apply time decay to each sale
3. Multiply: velocity × average_decay_factor
4. Sort by trending score (highest first)
5. Return top N products
```

### Class Structure Diagram

```
┌──────────────────────────────────────┐
│        TrendingService               │
├──────────────────────────────────────┤
│ Attributes:                          │
│ - decay_rate                         │
│ - velocity_window                    │
│ - logger                             │
├──────────────────────────────────────┤
│ Methods:                             │
│ + __init__(decay_rate, window)       │
│ + sales_velocity(product, days)      │
│ + time_decay(timestamp, rate)        │
│ + get_trending(limit)                │
│ + category_trending(category, limit) │
└──────────────────────────────────────┘
```

### Expected Outcome
- TrendingService class created with proper structure
- Class constants defined for configuration
- Initialization method accepts custom parameters
- Docstrings explain purpose and parameters
- Logger configured for monitoring
- Foundation ready for method implementation

### Verification Checklist
- [ ] `backend/apps/ai/recommendations/services/trending_service.py` file created
- [ ] TrendingService class defined
- [ ] Class constants declared (decay rate, window, limits, TTL)
- [ ] Initialization method accepts parameters
- [ ] Logger initialized for debugging
- [ ] Imports include Django models and utilities
- [ ] Docstring explains service purpose

---

## Task 70: Create sales_velocity

### Overview
Implement the sales_velocity method that calculates the average daily sales rate for a given product over a specified time window. This metric forms the foundation of trending calculations by measuring how quickly a product is selling. The method queries order data to count units sold, divides by the time period, and returns the velocity as a decimal value representing sales per day.

### Dependencies
- Task 69: Create TrendingService

### Instructions

1. **Define method signature**
   - Create method named `sales_velocity` in TrendingService
   - Accept `product_id` parameter (integer or UUID)
   - Accept optional `days` parameter (default: 7)
   - Return type should be Decimal or float
   - Add comprehensive docstring

2. **Calculate time window**
   - Get current datetime using Django timezone.now()
   - Calculate start_date by subtracting days from current date
   - Use timedelta for date arithmetic
   - Ensure timezone-aware datetimes

3. **Query order items**
   - Query OrderItem model for the product
   - Filter by product_id matching parameter
   - Filter by created_at >= start_date
   - Filter for completed orders only (not cancelled/pending)
   - Use select_related for order relationship

4. **Calculate total sales quantity**
   - Use Django aggregation (Sum) on quantity field
   - Handle null result (product never sold)
   - Default to 0 if no sales found
   - Convert to appropriate numeric type

5. **Calculate velocity**
   - Divide total_quantity by days parameter
   - Handle division by zero (if days=0, return 0)
   - Return as Decimal for precision
   - Round to 2 decimal places

6. **Add error handling**
   - Wrap database queries in try-except
   - Catch Product.DoesNotExist exception
   - Log errors with product_id and time window
   - Return 0 on errors to prevent crashes

7. **Optimize query performance**
   - Use only() or values() to fetch minimal fields
   - Consider adding database index on created_at
   - Cache results if called repeatedly
   - Use tenant-aware queries

### Sales Velocity Formula

```
sales_velocity(product_id, days) = total_quantity / days

Where:
- total_quantity = SUM(order_items.quantity)
- Filtered by: product_id, date range, completed orders
- days = time window (default: 7)

Example:
Product sold 140 units in 7 days
velocity = 140 / 7 = 20.0 units/day
```

### Query Structure

```
Filter Conditions:
├── product_id = specified_product
├── order__created_at >= (now - days)
├── order__status = 'completed'
└── order__is_cancelled = False

Aggregation:
└── Sum(quantity)

Result:
└── total_quantity / days
```

### Method Flow

```
Start
  ├─> Validate parameters
  ├─> Calculate start_date (now - days)
  ├─> Query OrderItem
  │   ├─> Filter by product_id
  │   ├─> Filter by date range
  │   └─> Filter by order status
  ├─> Aggregate SUM(quantity)
  ├─> Handle null result → 0
  ├─> Calculate: quantity / days
  └─> Return velocity (Decimal)
```

### Example Calculations

| Product | Units Sold | Days | Velocity | Interpretation |
|---------|-----------|------|----------|----------------|
| A | 140 | 7 | 20.0/day | Very fast moving |
| B | 70 | 7 | 10.0/day | Fast moving |
| C | 35 | 7 | 5.0/day | Moderate |
| D | 7 | 7 | 1.0/day | Slow moving |
| E | 0 | 7 | 0.0/day | Not selling |

### Edge Cases to Handle

| Case | Handling |
|------|----------|
| Product doesn't exist | Return 0, log warning |
| No sales in period | Return 0 (normal) |
| Days = 0 | Return 0, avoid division by zero |
| Negative days | Validate, raise error or use absolute value |
| Cancelled orders | Exclude from calculation |
| Pending orders | Exclude from calculation |

### Performance Considerations

| Optimization | Implementation |
|--------------|----------------|
| Database Index | Add index on (product_id, created_at) |
| Query Efficiency | Use aggregate instead of fetching all records |
| Caching | Cache result for short period (5 minutes) |
| Tenant Isolation | Ensure queries respect tenant schema |

### Method Signature Example Structure

```
def sales_velocity(self, product_id: int, days: int = 7) -> Decimal:
    """
    Calculate average daily sales velocity for product.
    
    Args:
        product_id: ID of product to analyze
        days: Lookback window in days (default: 7)
        
    Returns:
        Decimal representing units sold per day
        
    Example:
        velocity = service.sales_velocity(product_id=123, days=7)
        # Returns 15.43 (average 15.43 units per day)
    """
```

### Expected Outcome
- sales_velocity method implemented correctly
- Accurate calculation of daily sales rate
- Proper handling of edge cases and errors
- Efficient database queries with minimal overhead
- Method ready for use in trending calculations

### Verification Checklist
- [ ] sales_velocity method defined in TrendingService
- [ ] Method accepts product_id and days parameters
- [ ] Time window calculated correctly (now - days)
- [ ] OrderItem queried with proper filters
- [ ] Only completed orders included
- [ ] Total quantity aggregated using Sum
- [ ] Velocity calculated as quantity / days
- [ ] Division by zero handled
- [ ] Null/no sales case handled (returns 0)
- [ ] Error handling for missing products
- [ ] Returns Decimal type for precision
- [ ] Docstring explains parameters and return value

---

## Task 71: Create time_decay

### Overview
Implement the time_decay method that calculates an exponential decay factor based on how long ago an event occurred. This mathematical function applies temporal weighting to sales data, ensuring that recent sales have more influence on trending scores than older sales. The method uses exponential decay with a configurable decay rate, returning a value between 0 and 1.

### Dependencies
- Task 70: Create sales_velocity

### Instructions

1. **Define method signature**
   - Create method named `time_decay` in TrendingService
   - Accept `timestamp` parameter (datetime object)
   - Accept optional `decay_rate` parameter (default: use instance attribute)
   - Return type should be float (between 0 and 1)
   - Add comprehensive docstring

2. **Calculate days ago**
   - Get current datetime using Django timezone.now()
   - Subtract timestamp from current time
   - Extract days from timedelta (.days attribute)
   - Handle negative values (future dates)

3. **Apply exponential decay formula**
   - Use formula: decay_rate ^ days_ago
   - Implement using power operator (**)
   - Ensure result is between 0 and 1
   - Return as float type

4. **Handle edge cases**
   - If days_ago < 0 (future date), return 1.0
   - If days_ago = 0 (today), return 1.0
   - If decay_rate = 1.0, return 1.0 (no decay)
   - If decay_rate = 0, handle gracefully

5. **Validate parameters**
   - Ensure timestamp is timezone-aware
   - Validate decay_rate is between 0 and 1
   - Log warning if decay_rate is outside expected range
   - Use instance decay_rate if parameter not provided

6. **Add caching optimization (optional)**
   - Consider memoizing results for same timestamp
   - Clear cache periodically (daily)
   - Useful when processing many sales from same day

### Time Decay Formula

```
time_decay(timestamp, decay_rate) = decay_rate ^ days_ago

Where:
- days_ago = (now - timestamp).days
- decay_rate = typically 0.95 (95% retention per day)
- Result range: 0.0 to 1.0

Example:
decay_rate = 0.95
Sale from today:     0.95^0 = 1.00 (100% weight)
Sale from yesterday: 0.95^1 = 0.95 (95% weight)
Sale from 7 days:    0.95^7 = 0.70 (70% weight)
Sale from 30 days:   0.95^30 = 0.21 (21% weight)
```

### Decay Rate Examples

| Decay Rate | Day 1 | Day 7 | Day 14 | Day 30 | Interpretation |
|------------|-------|-------|--------|--------|----------------|
| 0.90 | 0.90 | 0.48 | 0.23 | 0.04 | Aggressive decay |
| 0.95 | 0.95 | 0.70 | 0.49 | 0.21 | Standard decay |
| 0.98 | 0.98 | 0.87 | 0.76 | 0.55 | Gentle decay |
| 1.00 | 1.00 | 1.00 | 1.00 | 1.00 | No decay |

### Method Flow

```
Start
  ├─> Validate timestamp (timezone-aware)
  ├─> Validate decay_rate (0 < rate <= 1)
  ├─> Calculate: now - timestamp
  ├─> Extract days_ago from timedelta
  ├─> Handle negative days (future) → return 1.0
  ├─> Apply formula: decay_rate ^ days_ago
  └─> Return decay_factor (float)
```

### Decay Curve Visualization

```
Weight
1.0 │●
    │ ●
0.9 │  ●
    │   ●
0.8 │    ●
    │     ●
0.7 │      ●───────────── Day 7
    │       ●●
0.6 │         ●●
    │           ●●
0.5 │             ●●──── Day 14
    │               ●●●
0.4 │                  ●●●
    │                     ●●●●
0.3 │                         ●●●●
    │                             ●●●●●●
0.2 │                                   ●●●●●──── Day 30
    │                                         ●●●●●●●●
0.1 │                                                  ●●●●●●●●●
    │
0.0 └────────────────────────────────────────────────────────────
    0    5    10   15   20   25   30   35   40   45   50
                          Days Ago

Decay Rate: 0.95
```

### Usage in Trending Score

```
For each sale in time window:
1. Get sale timestamp
2. Calculate decay_factor = time_decay(timestamp)
3. Weight sale: quantity × decay_factor
4. Sum all weighted sales
5. Calculate velocity from weighted sum

Example:
Product sold:
- 10 units today:     10 × 1.00 = 10.00
- 5 units yesterday:  5 × 0.95 = 4.75
- 8 units 7 days ago: 8 × 0.70 = 5.60
Total weighted: 20.35 units
```

### Edge Cases to Handle

| Case | Handling |
|------|----------|
| Future timestamp | Return 1.0 (full weight) |
| Same day (days=0) | Return 1.0 (full weight) |
| Very old (>90 days) | Return near 0 (minimal weight) |
| Naive datetime | Convert to timezone-aware |
| Invalid decay_rate | Use default or raise error |

### Mathematical Properties

| Property | Description |
|----------|-------------|
| Monotonic | Decay factor decreases as days increase |
| Bounded | Result always between 0 and 1 |
| Exponential | Decay accelerates over time |
| Smooth | Continuous function, no jumps |
| Configurable | Decay rate adjusts curve steepness |

### Method Signature Example Structure

```
def time_decay(self, timestamp: datetime, decay_rate: float = None) -> float:
    """
    Calculate exponential time decay factor.
    
    Args:
        timestamp: When event occurred (timezone-aware)
        decay_rate: Decay rate per day (default: instance rate)
        
    Returns:
        Float between 0 and 1 representing decay factor
        
    Example:
        factor = service.time_decay(seven_days_ago)
        # Returns 0.70 (70% weight for decay_rate=0.95)
    """
```

### Expected Outcome
- time_decay method implemented with exponential formula
- Accurate decay factor calculation based on age
- Proper handling of edge cases (future dates, same day)
- Configurable decay rate parameter
- Method ready for integration in trending calculations

### Verification Checklist
- [ ] time_decay method defined in TrendingService
- [ ] Method accepts timestamp and optional decay_rate
- [ ] Days ago calculated correctly (now - timestamp)
- [ ] Exponential formula implemented (rate ^ days)
- [ ] Result is float between 0 and 1
- [ ] Future dates handled (return 1.0)
- [ ] Same day handled (return 1.0)
- [ ] Decay rate validated (0 < rate <= 1)
- [ ] Timezone-aware datetime handling
- [ ] Docstring explains parameters and formula
- [ ] Test cases cover various time periods

---

## Task 72: Create get_trending Method

### Overview
Implement the get_trending method that combines sales velocity and time decay to identify top trending products. This core method orchestrates the trending calculation by fetching recent sales data, applying time decay weights to each sale, calculating velocity scores, and returning the highest-scoring products. The method provides the primary interface for retrieving trending products across the entire catalog.

### Dependencies
- Task 71: Create time_decay

### Instructions

1. **Define method signature**
   - Create method named `get_trending` in TrendingService
   - Accept optional `limit` parameter (default: 20)
   - Accept optional `min_sales` parameter (default: 5)
   - Return list of product dictionaries with scores
   - Add comprehensive docstring

2. **Calculate time window**
   - Use velocity_window instance attribute
   - Calculate start_date (now - velocity_window days)
   - Ensure timezone-aware datetime

3. **Query order data**
   - Fetch OrderItem records within time window
   - Filter for completed orders only
   - Select related product and order
   - Group by product_id

4. **Apply time decay to sales**
   - For each order item, get order timestamp
   - Calculate decay_factor using time_decay method
   - Multiply quantity by decay_factor
   - Track weighted_quantity per product

5. **Calculate trending scores**
   - For each product, sum all weighted quantities
   - Divide by velocity_window to get velocity
   - Store as trending_score
   - Create product dictionary with id, name, score

6. **Filter by minimum sales**
   - Exclude products with fewer than min_sales threshold
   - Prevents rarely-sold items from appearing
   - Configurable threshold based on business needs

7. **Sort and limit results**
   - Sort products by trending_score (descending)
   - Take top N products (limit parameter)
   - Return as list of dictionaries

8. **Add caching check**
   - Before calculation, check cache for results
   - Cache key: `trending:{tenant_id}`
   - If cached, return immediately
   - If not cached, calculate and store in cache (Task 75)

9. **Handle empty results**
   - If no products meet criteria, return empty list
   - Log info message about no trending products
   - Don't raise exceptions

10. **Optimize query performance**
    - Use select_related for foreign keys
    - Fetch only needed fields (values/values_list)
    - Consider using raw SQL for complex aggregation
    - Limit OrderItem query to velocity_window

### Trending Score Formula

```
For each product:
1. Get all sales in velocity_window
2. Apply time decay to each sale:
   weighted_quantity = SUM(quantity × time_decay(timestamp))
3. Calculate velocity:
   trending_score = weighted_quantity / velocity_window_days

Example:
Product A over 7 days:
- Day 0: 10 units × 1.00 = 10.00
- Day 2: 15 units × 0.90 = 13.50
- Day 5: 8 units × 0.77 = 6.16
Total weighted: 29.66
Trending score: 29.66 / 7 = 4.24
```

### Method Flow

```
Start
  ├─> Check cache for existing results
  │   └─> If found, return cached data
  ├─> Calculate start_date (now - window)
  ├─> Query OrderItems
  │   ├─> Filter by date range
  │   ├─> Filter completed orders
  │   └─> Group by product_id
  ├─> For each product:
  │   ├─> Calculate weighted_quantity
  │   │   └─> For each sale: qty × time_decay
  │   ├─> Calculate velocity (weighted / days)
  │   └─> Create product dict with score
  ├─> Filter by min_sales threshold
  ├─> Sort by trending_score (desc)
  ├─> Limit to top N products
  ├─> Cache results for TTL
  └─> Return list of products
```

### Data Structure

```python
# Return format (no code, but showing structure)
[
    {
        'product_id': 123,
        'name': 'Product Name',
        'trending_score': 4.24,
        'total_quantity': 33,
        'weighted_quantity': 29.66
    },
    {
        'product_id': 456,
        'name': 'Another Product',
        'trending_score': 3.87,
        'total_quantity': 28,
        'weighted_quantity': 27.09
    },
    ...
]
```

### Calculation Example

| Product | Day 0 | Day 1 | Day 3 | Day 5 | Weighted | Score | Rank |
|---------|-------|-------|-------|-------|----------|-------|------|
| A | 20×1.0 | 15×0.95 | 10×0.86 | 5×0.77 | 52.1 | 7.44 | 1 |
| B | 10×1.0 | 10×0.95 | 10×0.86 | 10×0.77 | 35.8 | 5.11 | 2 |
| C | 5×1.0 | 8×0.95 | 12×0.86 | 8×0.77 | 30.0 | 4.29 | 3 |
| D | 15×1.0 | 5×0.95 | 5×0.86 | 2×0.77 | 24.6 | 3.51 | 4 |

### Query Optimization

| Optimization | Implementation |
|--------------|----------------|
| Select Related | Load product data with order items |
| Date Index | Database index on created_at field |
| Aggregate First | Calculate totals in database, not Python |
| Limit Query | Only fetch needed date range |
| Cache Results | Store computed trending list |

### Minimum Sales Threshold

| Threshold | Effect |
|-----------|--------|
| min_sales = 0 | Include all products (risky) |
| min_sales = 5 | Require at least 5 sales (balanced) |
| min_sales = 10 | More conservative, established products |
| min_sales = 20 | Very conservative, popular items only |

### Performance Considerations

```
Optimization Strategy:
1. Cache results for 4 hours (Task 75)
2. Use database aggregation, not Python loops
3. Index order_date and product_id
4. Limit to velocity_window only
5. Paginate if needed for large catalogs

Expected Performance:
- Query time: < 500ms for 10,000 orders
- Cache hit: < 5ms
- Memory: Minimal (only trending products)
```

### Edge Cases to Handle

| Case | Handling |
|------|----------|
| No sales in window | Return empty list |
| All products below min_sales | Return empty list |
| Single product only | Return list with one item |
| Tie in scores | Sort by product_id secondary |
| Deleted products | Filter out inactive products |

### Method Signature Example Structure

```
def get_trending(self, limit: int = 20, min_sales: int = 5) -> List[Dict]:
    """
    Get top trending products based on sales velocity and time decay.
    
    Args:
        limit: Maximum number of products to return (default: 20)
        min_sales: Minimum sales required to be considered (default: 5)
        
    Returns:
        List of dicts with product_id, name, trending_score
        Sorted by trending_score descending
        
    Example:
        trending = service.get_trending(limit=10)
        # Returns top 10 trending products
    """
```

### Expected Outcome
- get_trending method implemented with complete logic
- Accurate trending score calculation combining velocity and decay
- Efficient database queries with proper filtering
- Sorted results with configurable limit
- Foundation for trending product displays

### Verification Checklist
- [ ] get_trending method defined in TrendingService
- [ ] Method accepts limit and min_sales parameters
- [ ] Time window calculated from velocity_window
- [ ] OrderItems queried with date and status filters
- [ ] Time decay applied to each sale
- [ ] Weighted quantities calculated per product
- [ ] Trending scores computed (weighted / days)
- [ ] Results filtered by min_sales threshold
- [ ] Products sorted by score descending
- [ ] Limited to top N results
- [ ] Returns list of product dictionaries
- [ ] Empty list returned when no products qualify
- [ ] Docstring explains parameters and return format

---

## Task 73: Create category_trending

### Overview
Implement the category_trending method that extends trending functionality to specific product categories. This method applies the same velocity and decay calculations as get_trending but filters results to a single category, enabling category-specific trending displays in the webstore. Customers can view what's trending in categories like Electronics, Clothing, or Food items.

### Dependencies
- Task 72: Create get_trending Method

### Instructions

1. **Define method signature**
   - Create method named `category_trending` in TrendingService
   - Accept `category_id` parameter (required)
   - Accept optional `limit` parameter (default: 10)
   - Accept optional `min_sales` parameter (default: 3)
   - Return list of product dictionaries with scores
   - Add comprehensive docstring

2. **Validate category parameter**
   - Check if category_id is provided and valid
   - Verify category exists in database
   - Handle null or invalid category gracefully
   - Log warning if category not found

3. **Filter products by category**
   - Query Product model for category_id match
   - Get list of product IDs in category
   - Handle subcategories if applicable
   - Consider category hierarchy

4. **Apply trending calculation**
   - Use same logic as get_trending method
   - Add additional filter for product_id in category
   - Calculate weighted quantities with time decay
   - Compute trending scores

5. **Adjust default parameters**
   - Use lower limit (10 vs 20) for categories
   - Use lower min_sales (3 vs 5) for smaller categories
   - Make parameters configurable
   - Document reasoning for different defaults

6. **Implement caching strategy**
   - Cache key: `trending:{tenant_id}:category:{category_id}`
   - Separate cache per category
   - Same TTL as general trending (4 hours)
   - Cache implementation in Task 75

7. **Handle empty categories**
   - Return empty list if category has no products
   - Return empty list if no products meet min_sales
   - Log info message
   - Don't raise exceptions

8. **Optimize for multiple categories**
   - Consider batch fetching if calling for many categories
   - Use select_related for category relationship
   - Cache aggressively since categories are stable

### Category Filtering Approach

```
Two-Step Process:

Step 1: Get products in category
├─> Query Product model
├─> Filter by category_id
├─> Extract product_id list
└─> Handle subcategories if needed

Step 2: Apply trending calculation
├─> Query OrderItems for products in list
├─> Apply same logic as get_trending
├─> Filter by date range and status
├─> Calculate weighted quantities
└─> Return top N by score
```

### Method Flow

```
Start
  ├─> Validate category_id parameter
  ├─> Check cache: trending:{tenant}:category:{id}
  │   └─> If found, return cached data
  ├─> Query products in category
  │   └─> Extract product_id list
  ├─> Calculate start_date (now - window)
  ├─> Query OrderItems
  │   ├─> Filter by product_id IN category
  │   ├─> Filter by date range
  │   └─> Filter completed orders
  ├─> For each product:
  │   ├─> Calculate weighted_quantity
  │   ├─> Calculate trending_score
  │   └─> Create product dict
  ├─> Filter by min_sales threshold
  ├─> Sort by trending_score (desc)
  ├─> Limit to top N products
  ├─> Cache results for TTL
  └─> Return list of products
```

### Category-Specific Defaults

| Parameter | General | Category | Reasoning |
|-----------|---------|----------|-----------|
| limit | 20 | 10 | Categories have fewer products |
| min_sales | 5 | 3 | Lower volume per category |
| cache_ttl | 4 hours | 4 hours | Same refresh rate |

### Use Cases

| Use Case | Implementation |
|----------|----------------|
| Category page | Show trending in current category |
| Navigation menu | Display trending badge on categories |
| Recommendations | "Trending in Electronics" widget |
| Analytics | Track trending by category over time |

### Example Scenarios

```
Scenario 1: Electronics Category
- Category has 150 products
- 12 products sold in last 7 days
- Return top 10 by trending score
- Display on Electronics landing page

Scenario 2: Small Category
- Category has 20 products
- 3 products sold in last 7 days
- Lower min_sales to 2
- Return all qualifying products

Scenario 3: Empty Category
- Category has 50 products
- 0 products sold in last 7 days
- Return empty list
- Show fallback UI in frontend
```

### Cache Strategy

```
Cache Structure:
trending:{tenant_id}                 ← General trending (Task 72)
trending:{tenant_id}:category:1      ← Electronics
trending:{tenant_id}:category:2      ← Clothing
trending:{tenant_id}:category:3      ← Food
trending:{tenant_id}:category:4      ← Home & Garden

Benefits:
- Each category cached independently
- Invalidate specific category on product changes
- Reduces database load for popular categories
- Fast response for category pages
```

### Subcategory Handling

| Approach | Description | Pros | Cons |
|----------|-------------|------|------|
| Leaf Only | Show trending for current category only | Simple, precise | May miss items in subcategories |
| Include Subcategories | Show trending for category + children | Comprehensive | More complex query |
| Configurable | Parameter to control behavior | Flexible | More parameters to manage |

### Query Optimization

```
Optimization Techniques:

1. Category Product Lookup
   - Cache category→products mapping
   - Use database index on category_id
   - Consider materialized view

2. Order Query Optimization
   - Use product_id IN (list) filter
   - Index on (product_id, created_at)
   - Limit to date range first

3. Aggregation Strategy
   - Calculate in database if possible
   - Use Django ORM efficiently
   - Consider raw SQL for complex cases
```

### Integration Points

| Integration | Usage |
|-------------|-------|
| Frontend | Category pages show trending widget |
| API | GET /api/trending/category/{id}/ |
| Admin | View trending by category in dashboard |
| Analytics | Track trending changes over time |

### Method Signature Example Structure

```
def category_trending(
    self, 
    category_id: int, 
    limit: int = 10, 
    min_sales: int = 3
) -> List[Dict]:
    """
    Get trending products within specific category.
    
    Args:
        category_id: Category to filter by (required)
        limit: Maximum products to return (default: 10)
        min_sales: Minimum sales threshold (default: 3)
        
    Returns:
        List of dicts with product_id, name, trending_score
        Filtered to category, sorted by score descending
        
    Example:
        electronics = service.category_trending(
            category_id=5, 
            limit=10
        )
    """
```

### Expected Outcome
- category_trending method implemented with filtering
- Same trending calculation applied to category subset
- Appropriate defaults for category-specific usage
- Efficient querying with category filter
- Ready for category page integration

### Verification Checklist
- [ ] category_trending method defined in TrendingService
- [ ] Method accepts category_id (required) and optional parameters
- [ ] Category validation implemented
- [ ] Products filtered by category_id
- [ ] Same trending calculation as get_trending applied
- [ ] Weighted quantities calculated with time decay
- [ ] Trending scores computed correctly
- [ ] Results filtered by min_sales (default: 3)
- [ ] Products sorted by score descending
- [ ] Limited to top N results (default: 10)
- [ ] Returns list of product dictionaries
- [ ] Empty list for categories with no qualifying products
- [ ] Docstring explains category-specific behavior

---

## Task 74: Create TrendingTask

### Overview
Create a Celery periodic task that automates trending product calculations. This task runs every 4 hours to refresh trending results across all tenants, pre-computing and caching trending products so that API requests are served instantly from cache. The task orchestrates calls to TrendingService methods, handles multi-tenant execution, and manages cache population.

### Dependencies
- Task 73: Create category_trending
- Celery infrastructure configured
- Redis cache available
- Multi-tenant middleware setup

### Instructions

1. **Create task file structure**
   - Navigate to `backend/apps/ai/recommendations/tasks/` directory
   - Create new file named `trending_tasks.py`
   - Import required Celery decorators and utilities

2. **Import dependencies**
   - Import shared_task or task decorator from Celery
   - Import TrendingService from services module
   - Import tenant models and utilities
   - Import Django cache framework
   - Import logging for monitoring

3. **Define compute_trending_task**
   - Create function named `compute_trending_task`
   - Decorate with @shared_task or @task
   - No parameters required (runs on schedule)
   - Add docstring explaining purpose

4. **Implement multi-tenant logic**
   - Query all active tenants from database
   - Loop through each tenant
   - Activate tenant schema for each iteration
   - Handle tenant switching properly

5. **Calculate general trending**
   - For each tenant, instantiate TrendingService
   - Call get_trending method with appropriate limit
   - Store results in cache (Task 75)
   - Log success or errors

6. **Calculate category trending**
   - Query active categories for current tenant
   - For each category, call category_trending method
   - Store results in cache with category-specific key
   - Consider limiting to top N categories

7. **Handle errors gracefully**
   - Wrap tenant processing in try-except
   - Log errors with tenant_id for debugging
   - Continue to next tenant on error
   - Don't let one tenant failure stop others

8. **Add logging and monitoring**
   - Log task start time
   - Log number of tenants processed
   - Log cache refresh success/failure
   - Log total execution time
   - Track errors for alerting

9. **Configure task options**
   - Set time_limit for task execution
   - Set soft_time_limit for warnings
   - Configure max_retries for transient failures
   - Set retry backoff strategy

10. **Return task summary**
    - Return dict with execution statistics
    - Include tenants_processed count
    - Include categories_refreshed count
    - Include errors count and details

### Task Architecture

```
compute_trending_task
│
├── Initialize
│   ├── Get logger
│   └── Record start time
│
├── Get Active Tenants
│   └── Query all tenants
│
├── For Each Tenant
│   ├── Activate tenant schema
│   ├── Instantiate TrendingService
│   │
│   ├── General Trending
│   │   ├── Call get_trending()
│   │   └── Cache results
│   │
│   └── Category Trending
│       ├── Get active categories
│       ├── For each category
│       │   ├── Call category_trending()
│       │   └── Cache results
│       └── Handle errors
│
└── Return Summary
    ├── Tenants processed
    ├── Categories refreshed
    ├── Execution time
    └── Error count
```

### Celery Task Configuration

| Setting | Value | Purpose |
|---------|-------|---------|
| name | compute_trending_task | Task identifier |
| time_limit | 600 seconds | Maximum execution time |
| soft_time_limit | 540 seconds | Warning threshold |
| max_retries | 3 | Retry on transient errors |
| retry_backoff | True | Exponential backoff |
| rate_limit | None | No rate limiting |

### Periodic Schedule Configuration

```
Celery Beat Schedule:

Task: compute_trending_task
Frequency: Every 4 hours
Cron: 0 */4 * * *
Times: 00:00, 04:00, 08:00, 12:00, 16:00, 20:00

Reasoning:
- 4 hours matches cache TTL
- Ensures cache never expires
- Balances freshness vs. compute cost
- Covers business hours and off-hours
```

### Multi-Tenant Processing

```
For each tenant:
1. Switch to tenant schema
   └── Use django-tenants schema activation
2. Process tenant trending
   ├── General trending (all products)
   └── Category trending (per category)
3. Store results in cache
   └── Use tenant-aware cache keys
4. Log tenant completion
5. Move to next tenant

Error Handling:
- Catch exceptions per tenant
- Log error with tenant_id
- Continue to next tenant
- Report errors at end
```

### Cache Population

| Cache Key | Content | TTL |
|-----------|---------|-----|
| trending:{tenant_id} | General trending list | 4 hours |
| trending:{tenant_id}:category:{id} | Category trending list | 4 hours |

### Execution Flow

```
Start Task
  ├─> Log: "Starting trending calculation"
  ├─> Get all active tenants → [T1, T2, T3, ...]
  │
  ├─> Process Tenant T1
  │   ├─> Activate tenant T1 schema
  │   ├─> Create TrendingService instance
  │   ├─> Calculate general trending
  │   │   └─> Cache: trending:T1
  │   ├─> Get categories → [C1, C2, C3]
  │   ├─> Calculate category C1 trending
  │   │   └─> Cache: trending:T1:category:C1
  │   ├─> Calculate category C2 trending
  │   │   └─> Cache: trending:T1:category:C2
  │   └─> Log: "Tenant T1 complete"
  │
  ├─> Process Tenant T2...
  ├─> Process Tenant T3...
  │
  └─> Log: "Task complete - processed N tenants"
```

### Error Handling Strategy

| Error Type | Handling |
|------------|----------|
| Tenant not found | Log warning, skip tenant |
| Database error | Log error, retry tenant (3x) |
| Cache error | Log error, continue (trending still works) |
| Timeout | Log error, move to next tenant |
| Unknown error | Log error, continue processing |

### Logging Examples

```
INFO: Starting trending calculation for 15 tenants
INFO: Processing tenant: acme-corp (1/15)
INFO: Cached general trending for acme-corp (20 products)
INFO: Cached category trending for Electronics (10 products)
INFO: Cached category trending for Clothing (10 products)
INFO: Tenant acme-corp complete in 2.3s
INFO: Processing tenant: beta-shop (2/15)
ERROR: Failed to process tenant: gamma-store - Database timeout
INFO: Task complete - 14/15 tenants processed in 45s
```

### Performance Considerations

| Consideration | Implementation |
|---------------|----------------|
| Database Load | Spread across 4-hour window |
| Cache Load | Batch cache writes per tenant |
| Execution Time | Parallel tenant processing (advanced) |
| Resource Usage | Monitor memory for large tenants |

### Monitoring and Alerts

| Metric | Threshold | Action |
|--------|-----------|--------|
| Execution time | > 10 minutes | Alert DevOps |
| Failed tenants | > 10% | Alert DevOps |
| Cache errors | > 5% | Alert DevOps |
| Task not running | > 5 hours | Alert Critical |

### Task Signature Example Structure

```
@shared_task(
    name='compute_trending_task',
    time_limit=600,
    soft_time_limit=540
)
def compute_trending_task():
    """
    Periodic task to compute and cache trending products.
    
    Runs every 4 hours to refresh trending calculations
    for all tenants. Calculates both general trending and
    category-specific trending, storing results in cache.
    
    Returns:
        Dict with execution summary:
        - tenants_processed: Number of tenants updated
        - categories_refreshed: Total categories updated
        - errors: List of error messages
        - execution_time: Total time in seconds
    """
```

### Expected Outcome
- Celery task created for automated trending updates
- Multi-tenant processing implemented correctly
- General and category trending cached every 4 hours
- Robust error handling prevents task failures
- Monitoring and logging for production visibility

### Verification Checklist
- [ ] `backend/apps/ai/recommendations/tasks/trending_tasks.py` file created
- [ ] compute_trending_task function defined
- [ ] Decorated with Celery @shared_task or @task
- [ ] All active tenants queried
- [ ] Tenant schema activation implemented
- [ ] TrendingService instantiated per tenant
- [ ] get_trending called and cached
- [ ] Active categories queried per tenant
- [ ] category_trending called for each category and cached
- [ ] Error handling wraps tenant processing
- [ ] Errors logged with tenant context
- [ ] Task continues after errors
- [ ] Execution summary returned
- [ ] Logging tracks progress and errors
- [ ] Task options configured (time limits, retries)
- [ ] Docstring explains task purpose and schedule

---

## Task 75: Create Trending Cache

### Overview
Implement comprehensive caching for trending products using Redis. This task creates cache management logic to store and retrieve trending results, reducing database load and ensuring fast API responses. The cache layer uses tenant-aware keys with 4-hour TTL, and integrates with both TrendingService methods and the TrendingTask to maintain fresh data.

### Dependencies
- Task 74: Create TrendingTask

### Instructions

1. **Define cache key structure**
   - Create cache key format: `trending:{tenant_id}`
   - Create category cache key format: `trending:{tenant_id}:category:{category_id}`
   - Ensure keys are unique per tenant
   - Document key naming conventions

2. **Set cache TTL configuration**
   - Set CACHE_TTL to 14400 seconds (4 hours)
   - Align TTL with TrendingTask schedule
   - Ensure cache doesn't expire before task runs
   - Make TTL configurable via settings

3. **Implement cache write logic**
   - Add caching to get_trending method
   - After calculating trending, store in cache
   - Use Django cache.set() with proper key and TTL
   - Serialize data appropriately (JSON)

4. **Implement cache read logic**
   - At start of get_trending, check cache
   - If cache hit, deserialize and return immediately
   - If cache miss, calculate and store
   - Log cache hits and misses for monitoring

5. **Implement category cache**
   - Add caching to category_trending method
   - Use category-specific cache keys
   - Same read-before-calculate pattern
   - Same TTL as general trending

6. **Add cache invalidation**
   - Create method to invalidate trending cache
   - Called when products are added/removed
   - Called when prices change significantly
   - Optional: manual cache clear endpoint

7. **Handle cache failures gracefully**
   - Wrap cache operations in try-except
   - If cache unavailable, calculate without caching
   - Log cache errors but don't fail requests
   - Fallback to database calculation

8. **Implement cache warming**
   - TrendingTask populates cache proactively
   - Prevents cache misses during business hours
   - Pre-calculates for all tenants and categories
   - Ensures consistent performance

9. **Add cache monitoring**
   - Log cache hit rate
   - Track cache size per tenant
   - Monitor cache expiration
   - Alert if cache consistently misses

10. **Optimize cache storage**
    - Store only necessary fields (id, name, score)
    - Consider compression for large catalogs
    - Use pickle or JSON for serialization
    - Balance size vs. readability

### Cache Key Structure

```
Key Format:

General Trending:
trending:{tenant_id}
Example: trending:123

Category Trending:
trending:{tenant_id}:category:{category_id}
Examples: 
- trending:123:category:5
- trending:456:category:12

Benefits:
- Tenant isolation (multi-tenancy)
- Category-specific caching
- Easy pattern matching for invalidation
- Clear naming convention
```

### Cache Flow Diagram

```
API Request: Get Trending Products
│
├─> Check cache: trending:{tenant_id}
│
├─> Cache Hit?
│   ├─> YES → Return cached data (fast path)
│   │           └─> Response time: < 5ms
│   │
│   └─> NO → Calculate trending (slow path)
│               ├─> Query database
│               ├─> Apply time decay
│               ├─> Calculate scores
│               ├─> Store in cache (TTL: 4h)
│               └─> Return calculated data
│                   └─> Response time: 100-500ms
```

### Cache TTL Strategy

| Configuration | Value | Reasoning |
|---------------|-------|-----------|
| TTL | 4 hours | Balances freshness vs. performance |
| Task Schedule | Every 4 hours | Keeps cache warm |
| Overlap | Task runs before expiry | Prevents cold cache |
| Invalidation | On product changes | Optional early refresh |

### Cache Write Implementation

```
Process: get_trending() method

1. Check if cache exists
   └── cache.get(f"trending:{tenant_id}")

2. If cache exists:
   └── Return cached data immediately

3. If cache missing:
   ├── Calculate trending products
   ├── Store in cache:
   │   └── cache.set(
   │         key=f"trending:{tenant_id}",
   │         value=trending_data,
   │         timeout=14400
   │       )
   └── Return calculated data
```

### Data Serialization

| Format | Pros | Cons | Recommended |
|--------|------|------|-------------|
| JSON | Human-readable, universal | Slightly larger | ✓ Yes |
| Pickle | Python-native, compact | Not human-readable | ✓ Yes |
| MessagePack | Very compact, fast | Requires library | Advanced |
| String | Simple | Limited data types | No |

### Cache Structure Example

```json
# Cached data format (as JSON)
{
  "timestamp": "2026-01-31T10:00:00Z",
  "products": [
    {
      "product_id": 123,
      "name": "Wireless Mouse",
      "trending_score": 8.45,
      "total_quantity": 67,
      "weighted_quantity": 59.15
    },
    {
      "product_id": 456,
      "name": "USB-C Cable",
      "trending_score": 6.32,
      "total_quantity": 48,
      "weighted_quantity": 44.24
    }
  ],
  "count": 20
}
```

### Cache Invalidation Triggers

| Event | Action | Reasoning |
|-------|--------|-----------|
| Product added | Invalidate cache | New product may be trending |
| Product deleted | Invalidate cache | Remove from trending |
| Price change (>20%) | Invalidate cache | May affect trending |
| Manual trigger | Invalidate cache | Admin maintenance |
| Scheduled refresh | Refresh cache | Keep data fresh |

### Invalidation Implementation

```
Cache Invalidation Methods:

1. Clear All Trending (Tenant)
   └── cache.delete(f"trending:{tenant_id}")
   └── cache.delete_pattern(f"trending:{tenant_id}:category:*")

2. Clear Category Trending
   └── cache.delete(f"trending:{tenant_id}:category:{category_id}")

3. Warm Cache (Refresh)
   └── Called by TrendingTask
   └── Recalculates and stores
```

### Error Handling

| Error | Handling |
|-------|----------|
| Redis unavailable | Skip cache, calculate directly |
| Serialization error | Log error, return calculation |
| Deserialization error | Invalidate cache, recalculate |
| Timeout | Use short timeout, fallback to DB |

### Performance Impact

```
Scenario: 1000 requests/hour for trending products

Without Cache:
- Database queries: 1000
- Avg response time: 250ms
- DB load: Very high

With Cache (95% hit rate):
- Database queries: 50
- Cached responses: 950
- Avg response time: 10ms
- DB load: Very low

Improvement:
- 95% reduction in DB queries
- 96% faster response time
- Scalable to high traffic
```

### Cache Monitoring Metrics

| Metric | Target | Action |
|--------|--------|--------|
| Hit Rate | > 90% | Good performance |
| Miss Rate | < 10% | Acceptable |
| Avg Size | < 100KB | Optimal |
| Expiration Rate | Match task frequency | Healthy |

### Multi-Tenant Considerations

```
Tenant Isolation:
- Each tenant has separate cache keys
- No data leakage between tenants
- Cache invalidation per tenant
- Separate monitoring per tenant

Key Pattern:
trending:{tenant_A}         ← Tenant A general
trending:{tenant_A}:category:1
trending:{tenant_B}         ← Tenant B general
trending:{tenant_B}:category:1

No Cross-Contamination:
- Tenant A cannot see Tenant B data
- Cache keys include tenant identifier
- Redis namespacing per tenant schema
```

### Integration with TrendingTask

```
TrendingTask → Cache Population:

Every 4 hours:
1. Task starts
2. For each tenant:
   ├── Calculate trending
   ├── Write to cache: trending:{tenant}
   ├── For each category:
   │   ├── Calculate category trending
   │   └── Write to cache: trending:{tenant}:category:{id}
   └── Log completion
3. Task completes

Result:
- All caches refreshed before expiry
- No cache misses during business hours
- Consistent performance
```

### Settings Configuration

```python
# Django settings example structure (no code)

TRENDING_CACHE_SETTINGS = {
    'ttl': 14400,  # 4 hours in seconds
    'key_prefix': 'trending',
    'default_limit': 20,
    'category_limit': 10,
    'min_sales': 5,
    'category_min_sales': 3,
    'enable_caching': True,
    'cache_backend': 'default'  # Redis
}
```

### Expected Outcome
- Comprehensive cache implementation for trending products
- Fast API responses via cache hits (< 10ms)
- Automatic cache warming via TrendingTask
- Graceful fallback when cache unavailable
- Production-ready with monitoring and invalidation

### Verification Checklist
- [ ] Cache key structure defined (tenant-aware)
- [ ] CACHE_TTL set to 14400 seconds (4 hours)
- [ ] Cache read logic added to get_trending
- [ ] Cache write logic added to get_trending
- [ ] Cache read logic added to category_trending
- [ ] Cache write logic added to category_trending
- [ ] Cache invalidation method created
- [ ] Error handling for cache failures
- [ ] TrendingTask populates cache
- [ ] Cache hit/miss logging implemented
- [ ] JSON or pickle serialization used
- [ ] Multi-tenant cache isolation verified
- [ ] Fallback to database on cache failure
- [ ] Settings for cache configuration
- [ ] Documentation of cache key patterns

---

## Summary

This document established the trending products system, including the TrendingService with sales velocity and time decay calculations, methods for general and category-specific trending, a Celery task for periodic updates, and comprehensive caching for optimal performance. The system identifies popular products using mathematical formulas that weigh recent sales more heavily than older sales.

### Completed Tasks
1. ✓ Created TrendingService with configuration parameters
2. ✓ Implemented sales_velocity method for calculating sales per day
3. ✓ Implemented time_decay method for exponential temporal decay
4. ✓ Implemented get_trending method for top trending products
5. ✓ Implemented category_trending method for category-specific trending
6. ✓ Created TrendingTask for automated 4-hour updates
7. ✓ Implemented trending cache with 4-hour TTL

### Key Formulas

**Sales Velocity:**
```
velocity = total_sales_quantity / days
```

**Time Decay:**
```
decay_factor = decay_rate ^ days_ago
```

**Trending Score:**
```
trending_score = (sum of quantity × decay_factor) / days
```

### Architecture Summary

```
┌─────────────────────────────────────────┐
│         TrendingService                 │
├─────────────────────────────────────────┤
│ • sales_velocity()                      │
│ • time_decay()                          │
│ • get_trending()                        │
│ • category_trending()                   │
└─────────────────────────────────────────┘
              │
              ├──> TrendingTask (Celery)
              │    • Runs every 4 hours
              │    • Processes all tenants
              │    • Warms cache
              │
              └──> Redis Cache
                   • TTL: 4 hours
                   • Keys: trending:{tenant}
                   • Keys: trending:{tenant}:category:{id}
```

### Expected Deliverables

```
backend/apps/ai/recommendations/
├── services/
│   └── trending_service.py
│       └── TrendingService class
│           ├── sales_velocity()
│           ├── time_decay()
│           ├── get_trending()
│           └── category_trending()
└── tasks/
    └── trending_tasks.py
        └── compute_trending_task()
```

### Next Steps
Proceed to [02_Tasks-76-82_Engine-Signals-Verify.md](02_Tasks-76-82_Engine-Signals-Verify.md) to create the unified RecommendationEngine, integrate all recommendation services (FBT, Similar, Personalized, Trending), implement recommendation signals for tracking user interactions, and verify the complete recommendation system.

