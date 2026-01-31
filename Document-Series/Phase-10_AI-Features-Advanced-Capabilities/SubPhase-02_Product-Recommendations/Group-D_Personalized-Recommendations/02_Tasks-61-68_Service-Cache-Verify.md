# Tasks 61-68: Personalized Service, Cache, and Verification

> **Phase:** 10 - AI Features & Advanced Capabilities  
> **SubPhase:** 02 - Product Recommendations  
> **Group:** D - Personalized Recommendations  
> **Document:** 02 of 02  
> **Tasks Covered:** 61, 62, 63, 64, 65, 66, 67, 68

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-53-60_Matrix-CF-SVD.md](01_Tasks-53-60_Matrix-CF-SVD.md)
- **→ Next Group:** [../Group-E_Trending-Serving/](../Group-E_Trending-Serving/)

---

## Document Overview

This document covers the implementation of the personalized recommendation service that delivers customer-specific product suggestions using collaborative filtering and matrix factorization models. You'll create the service layer that generates recommendations, handles cold start scenarios for new customers, filters out already-purchased products, and implements caching strategies for optimal performance.

Additionally, this document covers the Celery task infrastructure for periodic retraining of collaborative filtering models, ensuring recommendations stay fresh and accurate as customer behavior evolves over time.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 61 | Create PersonalizedService | High | 3 hours |
| 62 | Create get_personalized Method | Medium | 2 hours |
| 63 | Create cold_start_handler | Medium | 1.5 hours |
| 64 | Create exclude_purchased | Low | 45 min |
| 65 | Create CFTrainingTask | Medium | 2 hours |
| 66 | Create CF Schedule | Low | 30 min |
| 67 | Create Personalized Cache | Medium | 1.5 hours |
| 68 | Verify Personalized | Low | 1 hour |

---

## Task 61: Create PersonalizedService

### Overview
Create the `PersonalizedService` class that orchestrates personalized product recommendations for individual customers. This service leverages the collaborative filtering and matrix factorization models built in previous tasks to generate highly targeted product suggestions based on each customer's unique interaction history and preferences.

The service acts as the primary interface between the recommendation algorithms and the API layer, handling all business logic for personalized recommendations including cold start scenarios, filtering, and performance optimization.

### Dependencies
- Task 60: Create train Method (from Document 01)
- Task 52: Create RecommendationEngine (from Group-C)
- MatrixFactorization class with trained models
- UserItemMatrix class for interaction data
- CollaborativeFilter for CF algorithms
- Product model and Customer model

### Instructions

1. **Create the personalized service file**
   - Navigate to `backend/apps/ai/recommendations/services/`
   - Create new file named `personalized_service.py`
   - This service will handle all personalized recommendation logic

2. **Import required dependencies**
   - Import NumPy for array operations
   - Import Django ORM models (Product, Customer, CustomerInteraction)
   - Import typing utilities (List, Optional, Dict, Tuple)
   - Import collaborative filtering classes (CollaborativeFilter, MatrixFactorization, UserItemMatrix)
   - Import cache utilities from Django
   - Import logging for debugging and monitoring
   - Import datetime and timezone utilities

3. **Define the PersonalizedService class**
   - Create class `PersonalizedService` with comprehensive docstring
   - Explain purpose: Generate customer-specific recommendations
   - Document main responsibilities: recommendation generation, cold start handling, filtering
   - Include usage examples in docstring

4. **Add class constructor**
   - Accept `tenant` parameter (Tenant model instance)
   - Store tenant for scoped queries and multi-tenancy isolation
   - Initialize logger instance for service-level logging
   - Initialize `matrix_builder` attribute (UserItemMatrix instance)
   - Initialize `cf_model` attribute (CollaborativeFilter instance)
   - Initialize `mf_model` attribute (MatrixFactorization instance)
   - Set default recommendation parameters (limit, threshold)

5. **Create method to load trained models**
   - Method: `_load_models()`
   - Load latest trained collaborative filtering model from storage
   - Load latest trained matrix factorization model from storage
   - Handle case where models don't exist (first-time setup)
   - Load user-item matrix metadata (mappings, dimensions)
   - Validate model compatibility and versions
   - Return boolean indicating success/failure

6. **Add method to check model freshness**
   - Method: `_is_model_stale(max_age_hours=168)`
   - Check when models were last trained
   - Compare against maximum age threshold (default 7 days)
   - Return boolean indicating if retraining is needed
   - Log warnings if models are stale

7. **Create method to get customer index**
   - Method: `_get_customer_index(customer_id)`
   - Look up customer's index in the user-item matrix
   - Use customer mapping from matrix metadata
   - Handle case where customer is not in matrix (cold start)
   - Return Optional[int] for customer index

8. **Add method to get product indices**
   - Method: `_get_product_indices(product_ids)`
   - Convert list of product IDs to matrix indices
   - Use product mapping from matrix metadata
   - Filter out products not in matrix
   - Return list of valid indices

9. **Create method to score products**
   - Method: `_score_products(customer_idx, product_indices)`
   - Use matrix factorization to compute scores
   - Perform dot product of customer factors with product factors
   - Handle missing factors gracefully
   - Return dict mapping product_idx to score

10. **Add method to convert indices to products**
    - Method: `_indices_to_products(indices, scores)`
    - Convert matrix indices back to Product objects
    - Use reverse product mapping
    - Query products in single batch for efficiency
    - Attach scores to product objects
    - Return list of (Product, score) tuples

11. **Create method to validate recommendations**
    - Method: `_validate_recommendations(products, customer_id)`
    - Check that products are active and available
    - Verify products are in stock (if configured)
    - Ensure products are visible to customer
    - Apply any tenant-specific rules
    - Return filtered list of valid products

12. **Add logging and monitoring hooks**
    - Log when models are loaded
    - Log recommendation generation requests
    - Log cold start scenarios
    - Track recommendation quality metrics
    - Measure response times for performance monitoring

### Service Architecture

```
┌─────────────────────────────────────────────┐
│      PersonalizedService                    │
│                                             │
│  ┌───────────────────────────────────┐     │
│  │  Model Management                 │     │
│  │  - Load trained models            │     │
│  │  - Check freshness               │     │
│  │  - Validate compatibility         │     │
│  └───────────────────────────────────┘     │
│                                             │
│  ┌───────────────────────────────────┐     │
│  │  Recommendation Generation        │     │
│  │  - Get customer index             │     │
│  │  - Score products (dot product)   │     │
│  │  - Convert to Product objects     │     │
│  │  - Validate results               │     │
│  └───────────────────────────────────┘     │
│                                             │
│  ┌───────────────────────────────────┐     │
│  │  Cold Start & Filtering           │     │
│  │  - Handle new customers           │     │
│  │  - Exclude purchased items        │     │
│  │  - Apply business rules           │     │
│  └───────────────────────────────────┘     │
└─────────────────────────────────────────────┘
```

### Class Structure

| Component | Type | Purpose |
|-----------|------|---------|
| `__init__` | Constructor | Initialize service with tenant context |
| `_load_models` | Private Method | Load trained CF/MF models |
| `_is_model_stale` | Private Method | Check model freshness |
| `_get_customer_index` | Private Method | Map customer to matrix index |
| `_get_product_indices` | Private Method | Map products to matrix indices |
| `_score_products` | Private Method | Compute recommendation scores |
| `_indices_to_products` | Private Method | Convert indices to Product objects |
| `_validate_recommendations` | Private Method | Validate and filter results |

### Expected Outcome
- Functional PersonalizedService class with complete model management
- Helper methods for index mapping and score computation
- Foundation for recommendation generation (implemented in Task 62)
- Proper error handling and logging throughout

### Verification Checklist
- [ ] `backend/apps/ai/recommendations/services/personalized_service.py` created
- [ ] PersonalizedService class defined with tenant context
- [ ] Model loading and freshness checking implemented
- [ ] Customer and product index mapping methods created
- [ ] Product scoring and conversion methods implemented
- [ ] Validation and logging infrastructure in place
- [ ] All methods properly typed with type hints
- [ ] Comprehensive docstrings for all methods

---

## Task 62: Create get_personalized Method

### Overview
Create the main `get_personalized` method that generates personalized product recommendations for a specific customer. This method orchestrates the entire recommendation pipeline: loading trained models, computing recommendation scores using matrix factorization, ranking products by score, and returning a curated list of suggested products.

This is the primary public interface of the PersonalizedService and will be called by API endpoints to deliver recommendations to customers.

### Dependencies
- Task 61: Create PersonalizedService
- Trained matrix factorization models with user/item factors
- Customer interaction history in database

### Instructions

1. **Define the get_personalized method signature**
   - Method: `get_personalized(customer_id, limit=10, exclude_viewed=False)`
   - Accept `customer_id` parameter (int or UUID)
   - Accept `limit` parameter with default of 10 recommendations
   - Accept `exclude_viewed` flag to optionally filter out viewed products
   - Return type: `List[Dict[str, Any]]` (list of product dictionaries with scores)

2. **Add comprehensive method docstring**
   - Describe method purpose and algorithm
   - Document all parameters with types and defaults
   - Document return value structure
   - Include usage examples
   - Note: Uses matrix factorization dot product for scoring

3. **Validate input parameters**
   - Check that `customer_id` is valid and exists
   - Ensure `limit` is positive integer (max 50)
   - Log method invocation with parameters
   - Raise ValueError for invalid inputs

4. **Load and verify trained models**
   - Call `_load_models()` to load latest models
   - Check if models were loaded successfully
   - If models unavailable, return empty list with warning
   - Verify models are not stale (call `_is_model_stale()`)
   - Log model loading status

5. **Get customer's matrix index**
   - Call `_get_customer_index(customer_id)`
   - If customer not in matrix (returns None), handle cold start
   - Log cold start scenario for monitoring
   - Return to cold start handler (will be added in Task 63)

6. **Retrieve customer's factor vector**
   - Access customer's latent factors from matrix factorization model
   - Extract factor vector from model's user_factors matrix
   - Use customer index to slice the factors
   - Validate factor vector shape (should be n_factors dimensions)

7. **Retrieve all product factor vectors**
   - Access product factors from matrix factorization model
   - Get complete item_factors matrix
   - This matrix has shape (n_products, n_factors)
   - Validate matrix dimensions match model configuration

8. **Compute recommendation scores**
   - Perform dot product: customer_factors @ item_factors.T
   - This produces score for each product
   - Result is 1D array of length n_products
   - Higher scores indicate better matches
   - Log computation completion

9. **Get indices of top products**
   - Use NumPy argsort to sort scores in descending order
   - Take top N indices based on limit parameter
   - Account for products to exclude (implemented in Task 64)
   - Ensure sufficient products after filtering

10. **Convert matrix indices to product IDs**
    - Use reverse product mapping from matrix metadata
    - Map each index to corresponding product ID
    - Handle any missing mappings gracefully
    - Build list of product IDs with their scores

11. **Query product details from database**
    - Fetch Product objects for recommended product IDs
    - Use single batch query for efficiency
    - Include related fields (category, images, pricing)
    - Apply tenant scoping to ensure multi-tenancy
    - Preserve score order from ranking

12. **Build response data structure**
    - Create list of dictionaries for each product
    - Include: product_id, name, price, image_url, score
    - Add: category, stock_status, discount information
    - Include confidence level based on score
    - Sort by score in descending order

13. **Apply post-processing filters**
    - Filter out inactive products
    - Remove out-of-stock items (if configured)
    - Exclude products customer already purchased (Task 64)
    - Ensure diversity (avoid too many from same category)
    - Enforce minimum score threshold

14. **Limit to requested number**
    - Slice results to match `limit` parameter
    - Ensure exactly `limit` products if available
    - Handle case where fewer products available
    - Log final count of recommendations

15. **Cache the results**
    - Store recommendations in cache for future requests
    - Use cache key pattern (implemented in Task 67)
    - Set appropriate TTL (6 hours)
    - Log cache write operation

16. **Return recommendations**
    - Return list of product dictionaries
    - Include metadata: total_count, has_more, generated_at
    - Log successful recommendation generation
    - Track latency metric for monitoring

### Recommendation Scoring Process

```
Customer Request
      │
      ▼
┌─────────────────┐
│ Get Customer    │
│ Factor Vector   │  Shape: (50,)
│ [0.2, -0.1, ... │
└─────────────────┘
      │
      ▼
┌─────────────────┐
│ Get All Product │
│ Factor Vectors  │  Shape: (1000, 50)
│ Matrix          │
└─────────────────┘
      │
      ▼
┌─────────────────┐
│ Dot Product     │
│ customer_vec @  │  Result: (1000,)
│ product_matrix.T│  [4.2, 3.8, 5.1, ...]
└─────────────────┘
      │
      ▼
┌─────────────────┐
│ Sort by Score   │
│ Get Top N       │  [342, 89, 521, ...]
│ Indices         │  (product indices)
└─────────────────┘
      │
      ▼
┌─────────────────┐
│ Convert to      │
│ Product Objects │  Query DB
│ & Details       │
└─────────────────┘
      │
      ▼
    Return
```

### Method Flow

| Step | Action | Purpose |
|------|--------|---------|
| 1 | Validate inputs | Ensure valid parameters |
| 2 | Load models | Get trained CF/MF models |
| 3 | Get customer index | Map customer to matrix row |
| 4 | Extract customer factors | Get latent feature vector |
| 5 | Get product factors | Get all item feature vectors |
| 6 | Compute dot product | Calculate similarity scores |
| 7 | Sort and rank | Get top-N products |
| 8 | Convert to products | Map indices to Product objects |
| 9 | Apply filters | Remove purchased, out-of-stock |
| 10 | Cache results | Store for future requests |
| 11 | Return | Send recommendations to API |

### Response Structure

```json
{
  "recommendations": [
    {
      "product_id": 123,
      "name": "Wireless Mouse",
      "price": 2500.00,
      "currency": "LKR",
      "image_url": "https://cdn.example.com/mouse.jpg",
      "category": "Electronics",
      "score": 4.85,
      "confidence": "high",
      "discount_percentage": 15,
      "stock_status": "in_stock"
    },
    // ... more products
  ],
  "metadata": {
    "total_count": 10,
    "has_more": true,
    "generated_at": "2026-01-31T10:30:00Z",
    "algorithm": "matrix_factorization",
    "model_version": "v1.2"
  }
}
```

### Score Interpretation

| Score Range | Confidence | Meaning |
|-------------|------------|---------|
| > 4.5 | Very High | Excellent match, very likely interested |
| 3.5 - 4.5 | High | Strong match, likely interested |
| 2.5 - 3.5 | Medium | Good match, possibly interested |
| 1.5 - 2.5 | Low | Weak match, may not be interested |
| < 1.5 | Very Low | Poor match, filter out |

### Expected Outcome
- Functional get_personalized method that generates recommendations
- Complete scoring pipeline using matrix factorization
- Proper ranking and filtering of products
- Structured response with rich product details
- Integration with caching layer (Task 67)

### Verification Checklist
- [ ] `get_personalized` method implemented in PersonalizedService
- [ ] Method signature matches specification (customer_id, limit, exclude_viewed)
- [ ] Input validation for all parameters
- [ ] Model loading and verification logic
- [ ] Customer factor vector extraction
- [ ] Product factor matrix retrieval
- [ ] Dot product computation for scoring
- [ ] Top-N ranking implementation
- [ ] Index to Product object conversion
- [ ] Response data structure construction
- [ ] Post-processing filters applied
- [ ] Cache integration (prepared for Task 67)
- [ ] Comprehensive logging throughout
- [ ] Type hints and docstrings complete

---

## Task 63: Create cold_start_handler

### Overview
Create the `cold_start_handler` method to address the cold start problem for new customers who have insufficient interaction history. When a customer has fewer than 3 interactions (views, cart additions, or purchases), the collaborative filtering model cannot generate meaningful personalized recommendations. This handler provides fallback recommendations based on trending products.

The cold start problem is a common challenge in recommendation systems and requires special handling to ensure all customers receive relevant suggestions.

### Dependencies
- Task 62: Create get_personalized Method
- Trending products functionality (from Group-E)
- CustomerInteraction model for counting interactions

### Instructions

1. **Define the cold_start_handler method**
   - Method: `cold_start_handler(customer_id, limit=10)`
   - Accept `customer_id` parameter
   - Accept `limit` parameter for number of recommendations
   - Return type: `List[Dict[str, Any]]` (same as get_personalized)
   - Mark as private method with underscore prefix if only internal use

2. **Add method docstring**
   - Explain cold start problem and when this handler is used
   - Document the fallback strategy (trending products)
   - Note the interaction threshold (< 3 interactions)
   - Include examples of cold start scenarios

3. **Log cold start event**
   - Log when cold start handler is invoked
   - Include customer_id in log message
   - Set appropriate log level (INFO or WARNING)
   - Track cold start rate for monitoring

4. **Count customer interactions**
   - Query CustomerInteraction model for this customer
   - Count total interactions (views + carts + purchases)
   - Use tenant-scoped query for multi-tenancy
   - Cache interaction count for performance

5. **Verify cold start condition**
   - Check if interaction count < 3 (configurable threshold)
   - If customer has sufficient interactions, raise exception
   - This method should only be called for true cold start cases
   - Log verification result

6. **Retrieve customer profile data**
   - Get Customer object for additional context
   - Check customer preferences if available
   - Look for category preferences or interests
   - Check customer segment or demographics
   - Use this data to enhance fallback strategy

7. **Fetch trending products**
   - Call trending products service (Group-E)
   - Request products trending in last 7 days
   - Use tenant-scoped trending data
   - Request more products than limit (for filtering)
   - Consider customer's preferred categories if available

8. **Apply customer-specific filters**
   - Filter by customer's location (if applicable)
   - Filter by price range based on customer segment
   - Apply category preferences if known
   - Ensure products are available in customer's region

9. **Diversify product selection**
   - Ensure variety across categories
   - Avoid too many products from same brand
   - Mix different price points
   - Include both popular and emerging products
   - Balance familiarity with discovery

10. **Format response structure**
    - Create response matching get_personalized format
    - Include product_id, name, price, image, etc.
    - Add "reason" field explaining recommendation
    - Set reason to "trending" or "popular_choice"
    - Include confidence level (mark as "cold_start")

11. **Add metadata to response**
    - Flag response as cold_start recommendations
    - Include interaction_count in metadata
    - Add recommendation_strategy: "trending_fallback"
    - Include timestamp of generation
    - Add model_version for tracking

12. **Integrate with get_personalized**
    - Modify get_personalized method to call cold_start_handler
    - Add check after getting customer index
    - If customer_idx is None, call cold_start_handler
    - Return cold start results seamlessly
    - Ensure consistent response structure

13. **Cache cold start results**
    - Use separate cache key for cold start recommendations
    - Pattern: `coldstart:{tenant}:{customer_id}`
    - Set shorter TTL (3 hours) since based on trending
    - Update cache when customer gains more interactions

14. **Log analytics data**
    - Track cold start recommendation requests
    - Measure click-through rate for cold start products
    - Compare performance vs regular personalized
    - Use data to improve cold start strategy

### Cold Start Decision Flow

```
Customer Request
      │
      ▼
┌─────────────────┐
│ Count Customer  │
│ Interactions    │
└─────────────────┘
      │
      ├─── < 3 interactions
      │         │
      │         ▼
      │    ┌─────────────────┐
      │    │ Cold Start      │
      │    │ Handler         │
      │    └─────────────────┘
      │         │
      │         ▼
      │    ┌─────────────────┐
      │    │ Get Trending    │
      │    │ Products        │
      │    └─────────────────┘
      │         │
      │         ▼
      │    ┌─────────────────┐
      │    │ Apply Filters   │
      │    │ & Diversify     │
      │    └─────────────────┘
      │         │
      │         └──────┐
      │                │
      └─── ≥ 3 interactions
                │
                ▼
           ┌─────────────────┐
           │ Regular         │
           │ Personalized    │
           │ (CF/MF)         │
           └─────────────────┘
                │
                ▼
           Both Return
           Same Structure
```

### Interaction Threshold Logic

| Interaction Count | Strategy | Rationale |
|-------------------|----------|-----------|
| 0 interactions | Pure trending | No data, use popularity |
| 1-2 interactions | Trending + hints | Minimal data, blend approaches |
| 3-5 interactions | CF with fallback | Emerging patterns, use cautiously |
| 6+ interactions | Full personalization | Sufficient data for CF/MF |

### Cold Start Response Format

```json
{
  "recommendations": [
    {
      "product_id": 456,
      "name": "Popular Smartphone",
      "price": 45000.00,
      "currency": "LKR",
      "image_url": "https://cdn.example.com/phone.jpg",
      "category": "Electronics",
      "reason": "trending_this_week",
      "confidence": "cold_start",
      "trending_rank": 2,
      "view_count_7d": 1250
    }
  ],
  "metadata": {
    "total_count": 10,
    "recommendation_strategy": "cold_start_trending",
    "interaction_count": 1,
    "threshold": 3,
    "generated_at": "2026-01-31T10:30:00Z"
  }
}
```

### Fallback Strategy Hierarchy

1. **Primary Fallback:** Trending products (last 7 days)
2. **Secondary Fallback:** Category-based popular products (if preferences known)
3. **Tertiary Fallback:** Seasonal/promotional products
4. **Last Resort:** Top-rated products across all categories

### Expected Outcome
- Functional cold start handler that provides meaningful recommendations
- Seamless integration with get_personalized method
- Consistent response format between cold start and regular recommendations
- Proper logging and monitoring of cold start cases
- Foundation for improving cold start strategy over time

### Verification Checklist
- [ ] `cold_start_handler` method implemented
- [ ] Interaction counting logic in place
- [ ] Trending products integration
- [ ] Customer profile data retrieval
- [ ] Product filtering and diversification
- [ ] Response format matches get_personalized
- [ ] Metadata includes cold start indicators
- [ ] Integration with get_personalized complete
- [ ] Separate caching strategy for cold start
- [ ] Analytics tracking for cold start performance
- [ ] Comprehensive logging and monitoring
- [ ] Type hints and docstrings complete

---

## Task 64: Create exclude_purchased

### Overview
Create the `exclude_purchased` method to filter out products that a customer has already purchased from recommendation results. Recommending products a customer already owns diminishes the value of recommendations and wastes valuable recommendation slots.

This filtering step is crucial for maintaining recommendation quality and ensuring customers see fresh, relevant product suggestions.

### Dependencies
- Task 63: Create cold_start_handler
- Order and OrderItem models
- Purchase history tracking

### Instructions

1. **Define the exclude_purchased method**
   - Method: `exclude_purchased(customer_id, products, lookback_days=365)`
   - Accept `customer_id` parameter
   - Accept `products` parameter (list of product dicts or Product objects)
   - Accept `lookback_days` parameter (default 365 for 1 year)
   - Return filtered list of products (same type as input)

2. **Add comprehensive docstring**
   - Explain method purpose and filtering logic
   - Document all parameters with defaults
   - Note performance considerations for large histories
   - Include usage examples in docstring

3. **Validate input parameters**
   - Check that customer_id exists
   - Verify products list is not empty
   - Validate lookback_days is positive integer
   - Handle None or empty products gracefully
   - Return empty list if products is None

4. **Calculate lookback date**
   - Get current date and time
   - Subtract lookback_days to get cutoff date
   - Use timezone-aware datetime
   - Log lookback period for debugging

5. **Query customer's purchase history**
   - Query Order model for customer's orders
   - Filter by customer_id and tenant
   - Filter by order date >= lookback_date
   - Only include completed/paid orders (exclude cancelled)
   - Use select_related for OrderItems for efficiency

6. **Extract purchased product IDs**
   - Iterate through orders and order items
   - Collect all product IDs from order items
   - Use set data structure for O(1) lookup
   - Handle duplicate product IDs (customer bought same item twice)
   - Log count of unique purchased products

7. **Handle large purchase histories**
   - If customer has > 1000 purchased items, consider optimization
   - Use database query with EXISTS instead of fetching all
   - Cache purchased product IDs for repeated filtering
   - Log when using optimized path

8. **Determine product identifier type**
   - Check if products is list of dicts or Product objects
   - If dicts, use product['product_id'] or product['id']
   - If objects, use product.id or product.pk
   - Handle mixed types gracefully with try-except

9. **Filter out purchased products**
   - Iterate through products list
   - For each product, check if ID in purchased_ids set
   - Keep product if NOT in purchased set
   - Preserve original order of products
   - Maintain product scores if present

10. **Track filtering metrics**
    - Count products before filtering
    - Count products after filtering
    - Calculate percentage of products filtered
    - Log filtering statistics
    - Monitor if too many products are being filtered

11. **Handle edge cases**
    - If all products were purchased, return empty list
    - Log warning if all recommendations filtered out
    - If no products purchased, return original list unchanged
    - Handle case where product IDs don't match (data inconsistency)

12. **Add optional exception for repurchasable products**
    - Some products can be purchased repeatedly (consumables)
    - Check product category or repurchasable flag
    - For repurchasable products, only exclude if purchased recently
    - Use shorter lookback period for consumables (30 days)

13. **Optimize database queries**
    - Use single query with IN clause for product IDs
    - Avoid N+1 query problems
    - Consider caching purchased IDs for active sessions
    - Use database indexes on customer_id and product_id

14. **Integrate with get_personalized**
    - Call exclude_purchased after getting top-N products
    - Pass recommended products list
    - Replace original list with filtered list
    - Ensure enough products remain after filtering
    - Fetch additional products if too many filtered

15. **Add configuration options**
    - Make lookback_days configurable per tenant
    - Allow disabling purchased filtering (for testing)
    - Support different lookback for different categories
    - Store configuration in tenant settings

### Purchase Filtering Flow

```
Recommended Products
[P1, P2, P3, P4, P5, P6, P7, P8]
      │
      ▼
┌─────────────────────┐
│ Query Purchase      │
│ History             │
│ (last 365 days)     │
└─────────────────────┘
      │
      ▼
Purchased Product IDs
{P2, P5, P8}
      │
      ▼
┌─────────────────────┐
│ Filter Logic        │
│ P1 → ✓ Keep         │
│ P2 → ✗ Purchased    │
│ P3 → ✓ Keep         │
│ P4 → ✓ Keep         │
│ P5 → ✗ Purchased    │
│ P6 → ✓ Keep         │
│ P7 → ✓ Keep         │
│ P8 → ✗ Purchased    │
└─────────────────────┘
      │
      ▼
Filtered Products
[P1, P3, P4, P6, P7]
```

### Product Categories and Lookback

| Category | Repurchasable | Lookback Period |
|----------|---------------|-----------------|
| Electronics | No | 365 days |
| Clothing | No | 365 days |
| Food & Beverages | Yes | 30 days |
| Cosmetics | Yes | 90 days |
| Books | No | Never exclude |
| Subscriptions | Yes | 30 days |

### Filtering Statistics

Track these metrics for monitoring:

| Metric | Purpose |
|--------|---------|
| Products before filter | Baseline count |
| Products after filter | Result count |
| Filter percentage | Efficiency measure |
| Avg purchased count per customer | History size |
| Times all products filtered | Edge case frequency |

### Performance Considerations

| Scenario | Optimization Strategy |
|----------|----------------------|
| < 100 purchases | Simple Python filtering |
| 100-1000 purchases | Set-based filtering |
| > 1000 purchases | Database EXISTS query |
| Repeated calls | Cache purchased IDs (5 min TTL) |

### Expected Outcome
- Functional exclude_purchased method with efficient filtering
- Integration with get_personalized method
- Smart handling of repurchasable products
- Optimized database queries for large histories
- Proper logging and monitoring of filtering effectiveness

### Verification Checklist
- [ ] `exclude_purchased` method implemented
- [ ] Purchase history query with proper filtering
- [ ] Efficient set-based product filtering
- [ ] Support for both dict and object product types
- [ ] Repurchasable products handling
- [ ] Configurable lookback period
- [ ] Integration with get_personalized
- [ ] Performance optimization for large histories
- [ ] Comprehensive logging and metrics
- [ ] Edge case handling (all filtered, none filtered)
- [ ] Type hints and docstrings complete

---

## Task 65: Create CFTrainingTask

### Overview
Create a Celery task for periodic retraining of the collaborative filtering and matrix factorization models. As customer behavior evolves and new interactions accumulate, the recommendation models need to be retrained to maintain accuracy and relevance. This task automates the model training process, running on a scheduled basis to keep recommendations fresh.

The training task handles the complete training pipeline: building the user-item matrix, training the collaborative filtering model, performing matrix factorization, and storing the trained models.

### Dependencies
- Task 64: Create exclude_purchased
- Celery task queue configured
- MatrixFactorization and CollaborativeFilter classes
- UserItemMatrix class
- Model storage infrastructure

### Instructions

1. **Create the CF tasks module**
   - Navigate to `backend/apps/ai/recommendations/tasks/`
   - Create new file named `cf_tasks.py`
   - This module will contain all CF-related Celery tasks

2. **Import required dependencies**
   - Import Celery task decorator and related utilities
   - Import logger for task monitoring
   - Import UserItemMatrix, CollaborativeFilter, MatrixFactorization
   - Import Django models (Tenant)
   - Import datetime utilities
   - Import exception handling utilities
   - Import model storage utilities

3. **Define the training task**
   - Use Celery shared_task decorator
   - Task name: `train_cf_task`
   - Set task queue: `training`
   - Configure task options: max_retries=3, default_retry_delay=300
   - Add task binding for access to task instance
   - Include comprehensive docstring

4. **Add task signature**
   - Method: `train_cf_task(tenant_id, start_date=None, force_retrain=False)`
   - Accept `tenant_id` parameter (to train for specific tenant)
   - Accept optional `start_date` for historical data cutoff
   - Accept `force_retrain` flag to bypass staleness checks
   - Return dict with training results and metrics

5. **Set up task logging**
   - Log task start with tenant_id and parameters
   - Create task-specific logger
   - Set appropriate log level (INFO)
   - Include task_id in log messages for tracing

6. **Retrieve tenant object**
   - Query Tenant model with tenant_id
   - Handle case where tenant doesn't exist
   - Activate tenant schema for multi-tenancy
   - Log tenant information

7. **Check if retraining is needed**
   - If force_retrain is False, check model freshness
   - Query last training timestamp from model metadata
   - Compare against training frequency (7 days)
   - Skip training if models are fresh
   - Log skip reason and return early

8. **Calculate training date range**
   - If start_date not provided, use last 90 days
   - Convert dates to timezone-aware datetimes
   - Log date range for training data
   - Validate date range is reasonable

9. **Initialize matrix builder**
   - Create UserItemMatrix instance with tenant
   - Log initialization
   - Handle any initialization errors

10. **Build user-item interaction matrix**
    - Call build_matrix method with date range
    - Pass tenant and start_date parameters
    - Wait for matrix construction (may take time)
    - Log matrix dimensions (customers × products)
    - Handle sparse matrix storage

11. **Apply implicit ratings**
    - Call implicit_ratings method
    - Weight interactions: view=1, cart=3, purchase=5
    - Update matrix with weighted values
    - Log completion of weighting

12. **Train collaborative filtering model**
    - Initialize CollaborativeFilter with tenant
    - Train both user-based and item-based CF
    - Compute similarity matrices
    - Log training progress
    - Handle training errors with try-except

13. **Train matrix factorization model**
    - Initialize MatrixFactorization with parameters
    - n_factors=50, n_epochs=20, lr=0.01, reg=0.1
    - Call train method with user-item matrix
    - Perform SVD decomposition
    - Extract user_factors and item_factors matrices
    - Log training convergence metrics

14. **Validate trained models**
    - Check factor matrix dimensions
    - Verify no NaN or Inf values in factors
    - Compute basic quality metrics (reconstruction error)
    - Log validation results
    - Raise exception if validation fails

15. **Store trained models**
    - Save user_factors and item_factors to persistent storage
    - Save customer and product mappings
    - Save model metadata (training date, version, parameters)
    - Use pickle or joblib for serialization
    - Store in tenant-scoped storage path
    - Log storage location

16. **Compute training metrics**
    - Calculate training duration
    - Count number of customers and products in matrix
    - Count total interactions processed
    - Compute matrix sparsity percentage
    - Log all metrics

17. **Clear old cached recommendations**
    - Invalidate all personalized recommendation caches
    - Use cache key pattern: `personalized:{tenant}:*`
    - Clear cold start caches as well
    - Force fresh recommendations after retraining
    - Log cache clearing

18. **Update training metadata**
    - Record training completion timestamp
    - Store model version number
    - Save training metrics to database
    - Update last_trained_at field
    - Log successful completion

19. **Handle task failures**
    - Wrap main logic in try-except block
    - Catch and log specific exception types
    - Retry task with exponential backoff
    - Send alert/notification on repeated failures
    - Store error details for debugging

20. **Return task results**
    - Create result dictionary with status
    - Include training metrics
    - Add model version and timestamp
    - Include any warnings or issues
    - Return comprehensive result object

### Training Task Flow

```
Task Triggered
      │
      ▼
┌─────────────────────┐
│ Get Tenant &        │
│ Activate Schema     │
└─────────────────────┘
      │
      ▼
┌─────────────────────┐
│ Check Freshness     │
│ Skip if Recent      │
└─────────────────────┘
      │
      ▼
┌─────────────────────┐
│ Build User-Item     │
│ Matrix (90 days)    │
└─────────────────────┘
      │
      ▼
┌─────────────────────┐
│ Apply Implicit      │
│ Ratings Weights     │
└─────────────────────┘
      │
      ▼
┌─────────────────────┐
│ Train Collaborative │
│ Filtering Model     │
└─────────────────────┘
      │
      ▼
┌─────────────────────┐
│ Train Matrix        │
│ Factorization (SVD) │
└─────────────────────┘
      │
      ▼
┌─────────────────────┐
│ Validate Models     │
│ Check Quality       │
└─────────────────────┘
      │
      ▼
┌─────────────────────┐
│ Store Models &      │
│ Metadata            │
└─────────────────────┘
      │
      ▼
┌─────────────────────┐
│ Clear Old Caches    │
└─────────────────────┘
      │
      ▼
   Complete
```

### Task Parameters

| Parameter | Type | Default | Purpose |
|-----------|------|---------|---------|
| tenant_id | int | Required | Tenant to train models for |
| start_date | datetime | 90 days ago | Historical data cutoff |
| force_retrain | bool | False | Bypass freshness check |

### Training Metrics

Track and return these metrics:

| Metric | Description |
|--------|-------------|
| training_duration | Time taken for complete training |
| customer_count | Number of customers in matrix |
| product_count | Number of products in matrix |
| interaction_count | Total interactions processed |
| matrix_sparsity | Percentage of empty matrix cells |
| reconstruction_error | MF model quality metric |
| model_version | Version number of trained model |
| trained_at | Timestamp of training completion |

### Celery Task Configuration

```python
# Task decorator configuration
@shared_task(
    name='train_cf_task',
    queue='training',
    bind=True,
    max_retries=3,
    default_retry_delay=300,  # 5 minutes
    time_limit=3600,  # 1 hour max
    soft_time_limit=3000,  # 50 min warning
)
```

### Expected Outcome
- Functional Celery task for CF model training
- Complete training pipeline from data to stored models
- Proper error handling and retry logic
- Comprehensive logging and metrics tracking
- Cache invalidation after training

### Verification Checklist
- [ ] `backend/apps/ai/recommendations/tasks/cf_tasks.py` created
- [ ] `train_cf_task` Celery task defined
- [ ] Task configuration (queue, retries, timeouts)
- [ ] Tenant retrieval and schema activation
- [ ] Model freshness checking
- [ ] User-item matrix building
- [ ] Implicit ratings application
- [ ] CF model training
- [ ] Matrix factorization training
- [ ] Model validation logic
- [ ] Model storage implementation
- [ ] Training metrics computation
- [ ] Cache invalidation
- [ ] Error handling and retries
- [ ] Comprehensive logging throughout
- [ ] Type hints and docstrings complete

---

## Task 66: Create CF Schedule

### Overview
Create a periodic schedule for the CF training task to run automatically on a weekly basis. Scheduled retraining ensures that recommendation models stay current with evolving customer behavior without requiring manual intervention. The schedule is configured to run during low-traffic hours (Sunday 3:00 AM) to minimize impact on system performance.

### Dependencies
- Task 65: Create CFTrainingTask
- Celery Beat scheduler configured
- Periodic task infrastructure

### Instructions

1. **Locate Celery configuration**
   - Navigate to `backend/config/celery.py`
   - This file contains Celery app configuration
   - Look for beat_schedule configuration section

2. **Add CF training schedule entry**
   - Add new entry to CELERY_BEAT_SCHEDULE dict
   - Entry name: `train-cf-models-weekly`
   - Provide descriptive comment explaining schedule purpose

3. **Configure schedule timing**
   - Use crontab schedule: every Sunday at 3:00 AM
   - Import crontab from celery.schedules
   - Schedule: `crontab(hour=3, minute=0, day_of_week=0)`
   - Day 0 = Sunday in Celery's crontab

4. **Set task reference**
   - Set 'task' key to task name: `'train_cf_task'`
   - Must match task name from Task 65
   - Celery will look up task by this name

5. **Configure task arguments**
   - Add 'args' key for positional arguments
   - For multi-tenant, either schedule per tenant or iterate all
   - Option 1: Schedule separate task per tenant
   - Option 2: Create wrapper task that trains all tenants
   - Document chosen approach

6. **Add task options**
   - Set 'options' dict for task-specific config
   - Set queue: `{'queue': 'training'}`
   - Set priority: `{'priority': 5}` (medium priority)
   - Set time_limit if needed

7. **Handle multi-tenant scheduling**
   - If many tenants, don't schedule all simultaneously
   - Add staggered scheduling (5 min intervals)
   - Create schedule entries for each active tenant
   - Query active tenants and generate schedule dynamically

8. **Add schedule for immediate training**
   - Create optional schedule for high-priority tenants
   - Run every 3 days instead of weekly
   - Use for enterprise or high-traffic tenants
   - Separate schedule entry with different crontab

9. **Configure timezone**
   - Set CELERY_TIMEZONE in celery.py
   - Use 'Asia/Colombo' for Sri Lanka
   - Ensure schedule runs at correct local time
   - Document timezone in comments

10. **Add schedule metadata**
    - Include description of what task does
    - Note expected duration (varies by data size)
    - Document impact on system resources
    - Add contact for alerts/failures

11. **Create monitoring for scheduled task**
    - Log when schedule triggers task
    - Track task execution history
    - Monitor for missed schedules
    - Alert if task fails repeatedly

12. **Add configuration options**
    - Make schedule configurable via environment variables
    - Allow disabling schedule for development
    - Support custom schedule per tenant
    - Store schedule preferences in tenant settings

13. **Document schedule behavior**
    - Add comments explaining schedule frequency
    - Document why Sunday 3 AM was chosen
    - Note considerations for different timezones
    - Include instructions for changing schedule

14. **Test schedule configuration**
    - Validate crontab syntax
    - Use Celery Beat's --loglevel=debug to verify
    - Check schedule shows up in Celery Beat logs
    - Manually trigger to verify task runs correctly

15. **Set up alerting**
    - Configure alerts for training failures
    - Send notification if training takes too long
    - Alert if models become stale despite schedule
    - Integrate with monitoring platform

### Schedule Configuration Example

```python
CELERY_BEAT_SCHEDULE = {
    'train-cf-models-weekly': {
        'task': 'train_cf_task',
        'schedule': crontab(
            hour=3,
            minute=0,
            day_of_week=0,  # Sunday
        ),
        'args': (),  # Configured per tenant
        'options': {
            'queue': 'training',
            'priority': 5,
        },
    },
}
```

### Schedule Timing Diagram

```
Week Timeline
├─── Monday ────────────────────┐
│                               │
├─── Tuesday ───────────────────┤
│                               │  Normal operations
├─── Wednesday ─────────────────┤  Fresh recommendations
│                               │  from Sunday's training
├─── Thursday ──────────────────┤
│                               │
├─── Friday ────────────────────┤
│                               │
├─── Saturday ──────────────────┤
│                               │
├─── Sunday 3:00 AM ────────────┤ ← CF Training Runs
│    ▼ Train CF Models          │   (Low traffic time)
│    ▼ Store new models         │
│    ▼ Clear caches             │
└───────────────────────────────┘
```

### Multi-Tenant Scheduling Strategy

| Strategy | Pros | Cons | Recommended For |
|----------|------|------|-----------------|
| Single task trains all | Simple config | Long runtime | < 10 tenants |
| Staggered per tenant | Distributed load | Complex config | 10-100 tenants |
| On-demand per tenant | Flexible | Requires trigger | > 100 tenants |

### Schedule Configuration by Tenant Type

| Tenant Type | Schedule | Rationale |
|-------------|----------|-----------|
| Enterprise | Every 3 days | High data volume, needs freshness |
| Standard | Weekly (Sunday) | Balanced freshness and resources |
| Startup | Bi-weekly | Lower data volume |
| Trial | Monthly | Minimal data, save resources |

### Crontab Schedule Examples

| Schedule | Crontab Expression | Description |
|----------|-------------------|-------------|
| Weekly (Sunday 3 AM) | `crontab(hour=3, minute=0, day_of_week=0)` | Default schedule |
| Every 3 days (3 AM) | `crontab(hour=3, minute=0, day_of_month='*/3')` | High-priority |
| Daily (3 AM) | `crontab(hour=3, minute=0)` | Maximum freshness |
| Twice weekly | `crontab(hour=3, minute=0, day_of_week='0,3')` | Sun & Wed |

### Expected Outcome
- Weekly scheduled training of CF models
- Automatic execution without manual intervention
- Low-impact timing during off-peak hours
- Proper multi-tenant scheduling strategy
- Monitoring and alerting for schedule health

### Verification Checklist
- [ ] Schedule added to CELERY_BEAT_SCHEDULE
- [ ] Crontab expression correct (Sunday 3:00 AM)
- [ ] Task name reference matches cf_tasks.py
- [ ] Queue set to 'training'
- [ ] Timezone configured correctly
- [ ] Multi-tenant strategy implemented
- [ ] Schedule metadata and documentation
- [ ] Testing of schedule trigger
- [ ] Monitoring and alerting setup
- [ ] Configuration options for customization

---

## Task 67: Create Personalized Cache

### Overview
Implement caching for personalized recommendations to dramatically improve response times and reduce computational load. Since generating personalized recommendations involves matrix factorization calculations and database queries, caching results for a reasonable time period (6 hours) provides significant performance benefits without sacrificing recommendation freshness.

This task implements a Redis-based caching strategy with proper cache key patterns, TTL management, and invalidation logic.

### Dependencies
- Task 66: Create CF Schedule
- Redis cache configured
- PersonalizedService with get_personalized method

### Instructions

1. **Import caching utilities**
   - Navigate to `backend/apps/ai/recommendations/services/personalized_service.py`
   - Import Django cache framework (`from django.core.cache import cache`)
   - Import cache key utilities
   - Import JSON for serialization
   - Import hashlib for cache key generation

2. **Define cache key pattern**
   - Create class constant: `CACHE_KEY_PREFIX = "personalized"`
   - Key pattern: `personalized:{tenant}:{customer_id}:{options_hash}`
   - Include options_hash to cache different parameter combinations
   - Document key pattern in class docstring

3. **Create cache key generation method**
   - Method: `_generate_cache_key(customer_id, limit, exclude_viewed)`
   - Accept all parameters that affect recommendations
   - Build key using pattern: `{prefix}:{tenant_id}:{customer_id}`
   - Add hash of options (limit, exclude_viewed) to key
   - Return complete cache key string

4. **Define cache TTL constant**
   - Create class constant: `CACHE_TTL = 6 * 3600`  # 6 hours in seconds
   - Document why 6 hours was chosen
   - Balance between freshness and performance
   - Make configurable via settings

5. **Create method to serialize recommendations**
   - Method: `_serialize_recommendations(recommendations)`
   - Convert Product objects to dictionaries
   - Include all necessary fields for reconstruction
   - Use JSON-serializable types only
   - Handle datetime serialization (ISO format)
   - Return serializable dict structure

6. **Create method to deserialize recommendations**
   - Method: `_deserialize_recommendations(cached_data)`
   - Parse cached JSON data
   - Reconstruct product information
   - Restore original data types
   - Handle missing fields gracefully
   - Return list matching get_personalized return type

7. **Modify get_personalized to check cache**
   - At start of get_personalized method, generate cache key
   - Check if key exists in cache
   - If cache hit, deserialize and return cached recommendations
   - Log cache hit with customer_id
   - Skip all computation if cached result exists

8. **Add cache write after computation**
   - After computing recommendations in get_personalized
   - Before returning results, serialize recommendations
   - Write to cache with generated key and TTL
   - Log cache write operation
   - Handle cache write failures gracefully (don't fail request)

9. **Create cache invalidation method**
   - Method: `invalidate_cache(customer_id=None)`
   - If customer_id provided, invalidate specific customer's cache
   - If customer_id is None, invalidate all personalized caches for tenant
   - Use cache.delete_pattern for pattern-based deletion
   - Log invalidation operations

10. **Invalidate cache on customer interactions**
    - When customer views a product, consider invalidating cache
    - When customer adds to cart, invalidate cache
    - When customer makes purchase, immediately invalidate cache
    - Balance between freshness and cache efficiency
    - Implement selective invalidation strategy

11. **Add cache warming functionality**
    - Method: `warm_cache(customer_ids)`
    - Pre-compute recommendations for list of customers
    - Write results to cache before they're requested
    - Use for high-value customers or predicted activity
    - Run as background task during low-traffic periods

12. **Implement cache versioning**
    - Add model version to cache key
    - When models are retrained (Task 65), version changes
    - Old cache entries automatically become invalid
    - No need to explicitly clear all caches
    - Version from model metadata

13. **Create cache statistics tracking**
    - Track cache hit rate (hits / total requests)
    - Track average response time (cached vs computed)
    - Monitor cache size and memory usage
    - Log statistics periodically
    - Use for cache strategy optimization

14. **Add cache bypass option**
    - Add parameter to get_personalized: `use_cache=True`
    - Allow bypassing cache for testing or troubleshooting
    - Log when cache is bypassed
    - Document when to use bypass option

15. **Handle cache failures gracefully**
    - Wrap all cache operations in try-except
    - If cache read fails, compute recommendations normally
    - If cache write fails, return results anyway
    - Log cache errors but don't fail requests
    - Degrade gracefully if Redis unavailable

16. **Create cold start cache strategy**
    - Use separate cache key pattern for cold start recommendations
    - Pattern: `coldstart:{tenant}:{customer_id}`
    - Shorter TTL (3 hours) since based on trending
    - Invalidate when customer gains interactions
    - Update threshold check in cold_start_handler

17. **Optimize cache storage**
    - Only cache essential product fields
    - Compress large cache entries if needed
    - Use efficient serialization (MessagePack or pickle)
    - Monitor cache entry sizes
    - Set max cache entry size limit

### Caching Architecture

```
API Request
     │
     ▼
┌──────────────┐
│ Generate     │
│ Cache Key    │
└──────────────┘
     │
     ▼
┌──────────────┐      Yes
│ Check Cache  │ ───────────► Deserialize ───► Return
└──────────────┘              Cached Data       (Fast)
     │
     │ No (Cache Miss)
     ▼
┌──────────────┐
│ Load Models  │
└──────────────┘
     │
     ▼
┌──────────────┐
│ Compute      │
│ Scores       │
└──────────────┘
     │
     ▼
┌──────────────┐
│ Rank & Filter│
└──────────────┘
     │
     ▼
┌──────────────┐
│ Serialize &  │
│ Cache Result │
└──────────────┘
     │
     ▼
   Return
```

### Cache Key Pattern

```
personalized:{tenant_id}:{customer_id}:{options_hash}

Example:
personalized:42:12345:a7f3c2e1

Where:
- 42 = tenant_id
- 12345 = customer_id
- a7f3c2e1 = hash of {limit:10, exclude_viewed:false}
```

### Cache TTL Strategy

| Recommendation Type | TTL | Rationale |
|---------------------|-----|-----------|
| Personalized (regular) | 6 hours | Balance freshness and performance |
| Cold start (trending) | 3 hours | Based on trending, changes faster |
| Similar products | 12 hours | Product similarity stable |
| Category-based | 24 hours | Category trends change slowly |

### Cache Invalidation Events

| Event | Invalidation Strategy |
|-------|----------------------|
| New purchase | Immediate invalidation for customer |
| Cart addition | Optional, configurable |
| Product view | No invalidation (too frequent) |
| Model retrained | Version change, auto-invalidate all |
| Product discontinued | Lazy invalidation (check on read) |

### Performance Comparison

| Scenario | Without Cache | With Cache | Improvement |
|----------|---------------|------------|-------------|
| Get recommendations | ~200-500ms | ~5-10ms | 20-50× faster |
| High traffic (100 req/s) | High CPU/load | Low load | 90% reduction |
| Database queries | Every request | Once per 6h | Massive savings |
| Model loading | Every request | Once per 6h | Memory efficient |

### Expected Outcome
- Efficient Redis-based caching for recommendations
- Dramatic improvement in response times
- Reduced computational load and database queries
- Proper cache invalidation on model updates
- Graceful degradation if cache unavailable

### Verification Checklist
- [ ] Cache key generation method implemented
- [ ] Cache key pattern follows specification
- [ ] Serialization/deserialization methods created
- [ ] get_personalized checks cache before computing
- [ ] Cache write after successful computation
- [ ] TTL set to 6 hours
- [ ] Cache invalidation method implemented
- [ ] Model version included in cache key
- [ ] Separate strategy for cold start cache
- [ ] Cache statistics tracking
- [ ] Graceful error handling for cache failures
- [ ] Cache warming functionality (optional)
- [ ] Comprehensive logging of cache operations
- [ ] Performance monitoring and metrics

---

## Task 68: Verify Personalized

### Overview
Perform comprehensive verification and testing of the complete personalized recommendation system. This task ensures all components work correctly together: the PersonalizedService generates accurate recommendations, the cold start handler provides appropriate fallbacks, purchased products are filtered correctly, the training task runs successfully, scheduled retraining works, and caching improves performance as expected.

### Dependencies
- Task 67: Create Personalized Cache
- All previous tasks in Group-D complete
- Test data and fixtures available

### Instructions

1. **Create verification test file**
   - Navigate to `backend/apps/ai/recommendations/tests/`
   - Create new file named `test_personalized_verification.py`
   - Import all necessary testing utilities
   - Import PersonalizedService and related classes

2. **Import testing dependencies**
   - Import Django test framework (TestCase)
   - Import factory_boy for test data generation
   - Import mock/patch utilities for mocking
   - Import Redis cache utilities
   - Import Celery test utilities
   - Import datetime utilities

3. **Create test fixtures and factories**
   - Define CustomerFactory for test customers
   - Define ProductFactory for test products
   - Define InteractionFactory for customer interactions
   - Define OrderFactory for purchase history
   - Create fixtures with varied interaction patterns

4. **Set up test case class**
   - Class: `TestPersonalizedRecommendations`
   - Inherit from Django TestCase
   - Add setUp method to create test data
   - Add tearDown method to clean up
   - Create test tenant and activate schema

5. **Test basic recommendation generation**
   - Test: `test_get_personalized_basic()`
   - Create customer with sufficient interactions (> 3)
   - Create varied product catalog
   - Train basic CF/MF models with test data
   - Call get_personalized with customer_id
   - Verify recommendations returned
   - Check return type is list of dicts
   - Verify limit parameter respected
   - Assert all required fields present in results

6. **Test recommendation scoring**
   - Test: `test_recommendation_scores()`
   - Verify scores are reasonable (> 0, no NaN)
   - Check scores in descending order
   - Verify high-interaction products score higher
   - Test score consistency across multiple calls

7. **Test cold start scenario**
   - Test: `test_cold_start_handler()`
   - Create customer with 0-2 interactions
   - Call get_personalized for new customer
   - Verify cold start handler invoked
   - Check that trending products returned
   - Verify response includes cold_start flag
   - Assert recommendation count matches limit

8. **Test threshold boundary**
   - Test: `test_cold_start_threshold()`
   - Create customers with 2, 3, and 4 interactions
   - Call get_personalized for each
   - Verify < 3 uses cold start
   - Verify >= 3 uses personalized
   - Log which strategy used

9. **Test exclude purchased filter**
   - Test: `test_exclude_purchased_products()`
   - Create customer with purchase history
   - Generate recommendations
   - Verify purchased products not in results
   - Test with various lookback periods
   - Verify repurchasable products handled correctly

10. **Test with empty purchase history**
    - Test: `test_no_purchased_products()`
    - Create customer with no purchases
    - Generate recommendations
    - Verify all products eligible for recommendation
    - Assert filter doesn't remove valid products

11. **Test cache functionality**
    - Test: `test_cache_hit()`
    - Clear cache before test
    - Call get_personalized first time (cache miss)
    - Call get_personalized second time (cache hit)
    - Verify second call much faster
    - Check cache contains expected data
    - Verify cache key pattern correct

12. **Test cache invalidation**
    - Test: `test_cache_invalidation()`
    - Generate and cache recommendations
    - Make customer purchase product
    - Verify cache invalidated
    - Call get_personalized again
    - Verify fresh recommendations generated

13. **Test model loading**
    - Test: `test_model_loading()`
    - Train and save models
    - Create new service instance
    - Verify models loaded correctly
    - Check user/item factors accessible
    - Verify mappings loaded

14. **Test training task execution**
    - Test: `test_cf_training_task()`
    - Create sufficient interaction data
    - Trigger train_cf_task manually
    - Wait for task completion
    - Verify models saved to storage
    - Check training metrics returned
    - Verify cache cleared after training

15. **Test training task with insufficient data**
    - Test: `test_training_insufficient_data()`
    - Create minimal interaction data
    - Attempt training
    - Verify graceful handling
    - Check appropriate warnings logged

16. **Test multi-tenant isolation**
    - Test: `test_tenant_isolation()`
    - Create two tenants with different data
    - Train models for each tenant
    - Generate recommendations for each
    - Verify recommendations don't cross tenants
    - Check cache keys include tenant_id

17. **Test error handling**
    - Test: `test_error_handling()`
    - Test with invalid customer_id
    - Test with missing models
    - Test with Redis unavailable (mock)
    - Verify graceful degradation
    - Check error logging

18. **Test parameter variations**
    - Test: `test_parameter_variations()`
    - Test different limit values (5, 10, 20, 50)
    - Test with exclude_viewed=True/False
    - Verify results match parameters
    - Check each combination cached separately

19. **Verify performance benchmarks**
    - Test: `test_performance()`
    - Measure time for cache miss (first call)
    - Measure time for cache hit (subsequent calls)
    - Assert cache hit < 50ms
    - Assert cache miss < 1000ms (reasonable)
    - Log performance metrics

20. **Test scheduled task configuration**
    - Test: `test_celery_schedule_configured()`
    - Verify schedule exists in CELERY_BEAT_SCHEDULE
    - Check crontab expression correct
    - Verify task reference valid
    - Assert queue set to 'training'

21. **Integration test: complete flow**
    - Test: `test_complete_recommendation_flow()`
    - Create realistic customer journey:
      1. New customer (cold start)
      2. View products
      3. Add to cart
      4. Make purchase
      5. Get recommendations again
    - Verify recommendations evolve appropriately
    - Check cache invalidated at right times
    - Assert purchased items filtered

22. **Test recommendation diversity**
    - Test: `test_recommendation_diversity()`
    - Generate recommendations for customer
    - Check products from multiple categories
    - Verify not all products from same brand
    - Assert price range diversity

23. **Test edge cases**
    - Test: `test_edge_cases()`
    - Test with single product in catalog
    - Test with customer who purchased everything
    - Test with all interactions on same product
    - Verify system handles gracefully

24. **Create manual verification script**
    - Create: `verify_personalized_system.py` in scripts/
    - Script to manually test system with real data
    - Print detailed output for human verification
    - Include sample customer IDs
    - Show recommendations with scores

25. **Document verification results**
    - Run all tests and collect results
    - Document any failures or warnings
    - Create verification report
    - List any known limitations
    - Document performance metrics

### Verification Test Structure

```
Test Suite: Personalized Recommendations
│
├── Unit Tests
│   ├── test_service_initialization
│   ├── test_model_loading
│   ├── test_index_mapping
│   └── test_score_computation
│
├── Integration Tests
│   ├── test_get_personalized_basic
│   ├── test_cold_start_handler
│   ├── test_exclude_purchased
│   └── test_complete_flow
│
├── Performance Tests
│   ├── test_cache_performance
│   ├── test_computation_time
│   └── test_load_testing
│
├── Task Tests
│   ├── test_training_task
│   ├── test_schedule_config
│   └── test_task_error_handling
│
└── Edge Case Tests
    ├── test_empty_data
    ├── test_invalid_inputs
    └── test_error_scenarios
```

### Test Data Setup

| Entity | Count | Purpose |
|--------|-------|---------|
| Customers | 100 | Varied interaction patterns |
| Products | 500 | Diverse catalog |
| Interactions | 5,000 | View/cart/purchase mix |
| Orders | 1,000 | Purchase history |
| Categories | 20 | Category diversity |

### Expected Test Results

| Test Category | Expected Pass Rate | Notes |
|---------------|-------------------|-------|
| Unit tests | 100% | Core functionality |
| Integration tests | 100% | End-to-end flows |
| Performance tests | > 95% | Allow minor variance |
| Edge cases | 100% | Graceful handling |

### Verification Checklist

**Core Functionality:**
- [ ] PersonalizedService generates recommendations
- [ ] get_personalized returns correct structure
- [ ] Recommendations sorted by score
- [ ] Limit parameter respected
- [ ] Cold start handler works for new customers
- [ ] Threshold (3 interactions) enforced correctly
- [ ] exclude_purchased filters bought products
- [ ] Repurchasable products handled

**Model Training:**
- [ ] train_cf_task executes successfully
- [ ] Models saved to correct location
- [ ] Training metrics computed
- [ ] Models can be loaded
- [ ] User/item factors accessible

**Scheduling:**
- [ ] Schedule configured in Celery Beat
- [ ] Crontab expression correct (Sunday 3 AM)
- [ ] Task queue set to 'training'
- [ ] Multi-tenant strategy implemented

**Caching:**
- [ ] Cache hit returns cached data
- [ ] Cache miss computes and caches
- [ ] Cache key pattern correct
- [ ] TTL set to 6 hours
- [ ] Cache invalidation works
- [ ] Model version in cache key

**Performance:**
- [ ] Cache hit < 50ms
- [ ] Cache miss < 1000ms
- [ ] Training completes in reasonable time
- [ ] No memory leaks
- [ ] Database queries optimized

**Error Handling:**
- [ ] Invalid customer_id handled
- [ ] Missing models handled gracefully
- [ ] Cache failures don't break requests
- [ ] Training failures logged and retried

**Multi-Tenancy:**
- [ ] Tenant isolation verified
- [ ] Cache keys include tenant_id
- [ ] Models stored per tenant
- [ ] No data leakage between tenants

### Manual Verification Steps

1. **Start Django development server**
   - Ensure all services running (Redis, PostgreSQL, Celery)
   - Activate test tenant schema

2. **Create test data**
   - Run: `python manage.py create_test_data`
   - Verify customers, products, and interactions created

3. **Train models manually**
   - Run: `python manage.py train_cf_models --tenant-id=1`
   - Verify training completes successfully
   - Check models saved

4. **Test API endpoint**
   - Make request: `GET /api/recommendations/personalized/?customer_id=123`
   - Verify recommendations returned
   - Check response structure

5. **Verify caching**
   - Make same request twice
   - Check Redis for cached data
   - Verify second request faster

6. **Test cold start**
   - Make request for new customer with 0 interactions
   - Verify trending products returned
   - Check metadata includes cold_start flag

7. **Verify filtering**
   - Check customer's purchase history
   - Verify purchased products not in recommendations

8. **Test scheduled task**
   - Verify Celery Beat running
   - Check beat schedule: `celery -A config beat -l info`
   - Verify train_cf_task in schedule

### Expected Outcome
- All verification tests passing
- Complete personalized recommendation system working
- Proper cold start handling for new customers
- Efficient caching improving performance
- Scheduled training keeping models fresh
- Comprehensive documentation of verification results

### Final Deliverables

```
backend/apps/ai/recommendations/
├── services/
│   └── personalized_service.py        ✓ Complete
├── tasks/
│   └── cf_tasks.py                    ✓ Complete
├── tests/
│   └── test_personalized_verification.py  ✓ Complete
└── scripts/
    └── verify_personalized_system.py  ✓ Complete

Documentation:
└── VERIFICATION_REPORT.md             ✓ Results
```

---

## Group Completion Summary

### What We Built

This document covered the implementation of the personalized recommendation service layer, bringing together the collaborative filtering and matrix factorization algorithms into a production-ready system.

**Major Components:**

1. **PersonalizedService** - Orchestrates personalized recommendations
   - Model loading and management
   - Score computation using matrix factorization
   - Index mapping and product conversion
   - Validation and business logic

2. **get_personalized Method** - Core recommendation generation
   - Dot product scoring between user/item factors
   - Ranking and filtering
   - Structured response generation
   - Cache integration

3. **cold_start_handler** - Handles new customers
   - Detects insufficient interaction history
   - Fallback to trending products
   - Seamless integration with main flow

4. **exclude_purchased** - Filters bought products
   - Purchase history querying
   - Efficient set-based filtering
   - Repurchasable product handling

5. **CFTrainingTask** - Automated model training
   - Complete training pipeline
   - Model validation and storage
   - Metrics tracking
   - Error handling and retries

6. **CF Schedule** - Weekly automated retraining
   - Celery Beat schedule configuration
   - Sunday 3:00 AM execution
   - Multi-tenant strategy

7. **Personalized Cache** - Performance optimization
   - Redis-based caching
   - 6-hour TTL
   - Smart invalidation
   - Model versioning

8. **Complete Verification** - System testing
   - Comprehensive test suite
   - Performance benchmarks
   - Integration testing
   - Manual verification

### Recommendation Flow

```
Customer Request → Check Cache → [Hit] → Return Cached
                      ↓
                   [Miss]
                      ↓
              Check Interaction Count
                      ↓
           ┌──────────┴──────────┐
           │                     │
      < 3 interactions      ≥ 3 interactions
           │                     │
           ▼                     ▼
    Cold Start Handler    Load MF Models
    (Trending Products)         │
           │                     ▼
           │              Get Customer Factors
           │                     │
           │                     ▼
           │              Compute Scores (Dot Product)
           │                     │
           │                     ▼
           │              Rank Products
           └──────────┬──────────┘
                      │
                      ▼
              Exclude Purchased
                      │
                      ▼
              Apply Filters
                      │
                      ▼
               Cache Results
                      │
                      ▼
                   Return
```

### Key Achievements

- ✅ **Personalized recommendations** using collaborative filtering
- ✅ **Cold start handling** for new customers
- ✅ **Smart filtering** to exclude purchased products
- ✅ **Automated training** with weekly schedule
- ✅ **Performance optimization** through caching
- ✅ **Complete verification** with comprehensive tests

### Integration Points

| Component | Integrates With | Purpose |
|-----------|-----------------|---------|
| PersonalizedService | MatrixFactorization (Task 59) | Get trained user/item factors |
| PersonalizedService | CollaborativeFilter (Task 56) | Alternative CF algorithms |
| cold_start_handler | TrendingService (Group-E) | Fallback recommendations |
| exclude_purchased | Order/OrderItem models | Purchase history |
| CFTrainingTask | UserItemMatrix (Task 53) | Training data |
| Cache | Redis | Performance optimization |

### Next Steps

After completing Group-D, proceed to:

**→ Group-E: Trending & Serving**
- Trending product identification
- Real-time recommendation serving
- API endpoint implementation
- Response formatting
- A/B testing infrastructure

The personalized recommendation system is now complete and ready for integration with the API layer in Group-E.

---

## Additional Notes

### Performance Considerations

**Optimization Strategies:**
- Cache all recommendations (6-hour TTL)
- Pre-compute factors during training
- Use sparse matrix operations
- Batch database queries
- Index customer/product lookups

**Expected Performance:**
- Cached request: < 50ms
- Uncached request: 200-500ms
- Training task: 10-60 min (depends on data size)
- Cache hit rate: > 80%

### Monitoring and Metrics

**Key Metrics to Track:**
- Recommendation generation time
- Cache hit rate
- Cold start rate
- Training success rate
- Model freshness
- Recommendation click-through rate

### Security Considerations

- Validate customer_id to prevent unauthorized access
- Ensure tenant isolation in all queries
- Sanitize inputs for cache keys
- Secure model storage location
- Rate limit API endpoints

### Scalability Notes

- Matrix factorization scales to millions of products
- Cache reduces load significantly
- Training task can be distributed
- Consider separate Redis for recommendations
- Monitor memory usage for large matrices

### Troubleshooting

**Common Issues:**

1. **No recommendations returned**
   - Check if models trained
   - Verify customer has interactions
   - Check model freshness

2. **Slow performance**
   - Verify cache working
   - Check Redis connectivity
   - Monitor database query count

3. **Training failures**
   - Check sufficient interaction data
   - Verify disk space for model storage
   - Review memory limits

4. **Cache misses**
   - Check Redis availability
   - Verify cache key pattern
   - Check TTL configuration

---

**End of Document**

**Group D Complete:** ✓ Personalized Recommendations System

**Next:** [Group-E_Trending-Serving](../Group-E_Trending-Serving/)
