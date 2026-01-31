# Tasks 25-34: FBT Service and Cache

> **Phase:** 10 - AI Features & Advanced Capabilities  
> **SubPhase:** 02 - Product Recommendations  
> **Group:** B - Frequently Bought Together  
> **Document:** 02 of 02  
> **Tasks Covered:** 25, 26, 27, 28, 29, 30, 31, 32, 33, 34

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-17-24_Basket-Apriori.md](01_Tasks-17-24_Basket-Apriori.md)
- **→ Next Group:** [Group-C_Similar-Products](../Group-C_Similar-Products/)

---

## Document Overview

This document covers the creation of the FBT service, caching layer, scheduled training tasks, and admin interface. It establishes the high-level service for generating frequently bought together recommendations using the trained Apriori model, implements Redis caching for performance optimization, creates Celery tasks for automated model retraining, and provides an admin interface for monitoring and management.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 25 | Create FBTService | High | 90 min |
| 26 | Create train Method | Medium | 45 min |
| 27 | Create get_fbt Method | Medium | 60 min |
| 28 | Create store_recommendations | Medium | 45 min |
| 29 | Create FBTTrainingTask | Medium | 45 min |
| 30 | Create FBT Schedule | Low | 20 min |
| 31 | Create FBT Cache | Medium | 45 min |
| 32 | Create cache_fbt Method | Low | 25 min |
| 33 | Create FBT Admin | Medium | 50 min |
| 34 | Verify FBT | Low | 30 min |

---

## Task 25: Create FBTService

### Overview
Create the FBTService class that serves as the main service layer for generating frequently bought together recommendations. This service orchestrates the interaction between the basket analyzer, Apriori trainer, recommendation storage, and cache layer. It provides a clean interface for training models and retrieving recommendations while managing the complexity of the underlying ML operations.

### Dependencies
- Task 24: Create min_confidence Setting
- BasketAnalyzer class from Task 17
- AprioriTrainer class from Task 20
- Recommendation model from Group-A
- Redis cache infrastructure from Phase-03

### Instructions

1. **Create FBT service file**
   - Navigate to `backend/apps/ai/recommendations/services/` directory
   - Create new file named `fbt_service.py`
   - This service will handle all FBT-related operations

2. **Import required dependencies**
   - Import BasketAnalyzer from algorithms module
   - Import AprioriTrainer from algorithms module
   - Import Recommendation model
   - Import settings for min_support and min_confidence
   - Import Redis client for caching
   - Import logging for operation tracking
   - Import timezone utilities for date handling

3. **Define FBTService class structure**
   - Create class `FBTService`
   - Initialize with tenant context
   - Store tenant reference for multi-tenant operations
   - Set up logger instance for service

4. **Initialize service dependencies**
   - Create instance of BasketAnalyzer
   - Create instance of AprioriTrainer
   - Connect to Redis cache client
   - Load configuration settings (support, confidence)

5. **Define class constructor**
   - Accept tenant parameter
   - Store tenant reference
   - Initialize analyzer and trainer instances
   - Set up cache connection
   - Configure service-level settings

6. **Add error handling structure**
   - Define custom exception classes for service errors
   - Plan for model training failures
   - Plan for data retrieval failures
   - Plan for cache operation failures

7. **Create service interface methods**
   - Define train method signature (Task 26)
   - Define get_fbt method signature (Task 27)
   - Define store_recommendations method signature (Task 28)
   - Define cache management methods (Task 31-32)

8. **Implement tenant isolation**
   - Ensure all operations are tenant-scoped
   - Use tenant schema context for database queries
   - Include tenant identifier in cache keys
   - Prevent cross-tenant data leakage

### Service Architecture

```
┌──────────────────────────────────────────┐
│           FBTService                     │
│  ┌────────────────────────────────────┐ │
│  │ Tenant Context                     │ │
│  └────────────────────────────────────┘ │
│                                          │
│  ┌──────────────┐  ┌──────────────────┐│
│  │BasketAnalyzer│  │ AprioriTrainer   ││
│  └──────────────┘  └──────────────────┘│
│                                          │
│  ┌──────────────┐  ┌──────────────────┐│
│  │ Redis Cache  │  │ Recommendation   ││
│  │              │  │ Model            ││
│  └──────────────┘  └──────────────────┘│
└──────────────────────────────────────────┘
```

### Service Responsibilities

| Responsibility | Description |
|----------------|-------------|
| Model Training | Coordinate basket analysis and Apriori training |
| Recommendation Retrieval | Fetch FBT recommendations for products |
| Storage Management | Save recommendations to database |
| Cache Management | Handle Redis caching operations |
| Error Handling | Manage failures gracefully |
| Logging | Track operations and performance |

### Class Structure

| Component | Type | Purpose |
|-----------|------|---------|
| `__init__` | Constructor | Initialize service with tenant |
| `train` | Method | Train FBT model (Task 26) |
| `get_fbt` | Method | Get recommendations (Task 27) |
| `store_recommendations` | Method | Save to database (Task 28) |
| `cache_fbt` | Method | Cache recommendations (Task 32) |
| `_get_from_cache` | Private Method | Retrieve from cache |
| `_invalidate_cache` | Private Method | Clear cache entries |

### Configuration Parameters

| Parameter | Source | Default | Purpose |
|-----------|--------|---------|---------|
| min_support | Settings | 0.01 | Minimum support threshold |
| min_confidence | Settings | 0.3 | Minimum confidence threshold |
| cache_ttl | Settings | 86400 | Cache TTL (24 hours) |
| max_recommendations | Settings | 5 | Maximum items to return |
| training_window_days | Settings | 90 | Days of data for training |

### Error Handling Strategy

| Error Type | Handling Approach |
|------------|-------------------|
| Insufficient Data | Log warning, return empty results |
| Model Training Failure | Retry with adjusted parameters |
| Cache Connection Error | Fall back to database |
| Database Error | Propagate with context |
| Invalid Parameters | Raise validation error |

### Expected Outcome
- Complete FBTService class structure
- Proper tenant isolation implemented
- All dependencies initialized correctly
- Clean interface for FBT operations
- Comprehensive error handling

### Verification Checklist
- [ ] `backend/apps/ai/recommendations/services/fbt_service.py` created
- [ ] FBTService class defined with constructor
- [ ] Tenant context stored and used throughout
- [ ] BasketAnalyzer instance initialized
- [ ] AprioriTrainer instance initialized
- [ ] Redis cache client connected
- [ ] Method signatures defined (train, get_fbt, store_recommendations)
- [ ] Error handling structure in place
- [ ] Logging configured
- [ ] Configuration parameters loaded

---

## Task 26: Create train Method

### Overview
Implement the train method in FBTService that orchestrates the complete training pipeline for the FBT recommendation model. This method coordinates data extraction from order baskets, transaction encoding, Apriori model training, rule generation, and storage of the resulting recommendations. It handles the full workflow from raw order data to stored association rules.

### Dependencies
- Task 25: Create FBTService
- Task 18: get_transactions method
- Task 19: encode_transactions method
- Task 21: find_frequent_itemsets method
- Task 22: generate_rules method

### Instructions

1. **Define train method signature**
   - Create method `train` in FBTService class
   - Accept tenant parameter (if not using instance tenant)
   - Accept optional parameters: start_date, end_date
   - Return training result summary (rules count, metrics)

2. **Set training time window**
   - Determine training data range (default: last 90 days)
   - Allow custom date range via parameters
   - Calculate start_date and end_date if not provided
   - Log training time window for monitoring

3. **Extract transaction data**
   - Call BasketAnalyzer.get_transactions method
   - Pass tenant, start_date, and end_date
   - Receive list of product ID lists (baskets)
   - Validate that sufficient transactions exist

4. **Check data sufficiency**
   - Verify minimum number of transactions (e.g., 50)
   - Verify minimum number of unique products (e.g., 10)
   - If insufficient, log warning and return early
   - Provide clear feedback about data requirements

5. **Encode transactions**
   - Call BasketAnalyzer.encode_transactions method
   - Pass transaction list
   - Receive one-hot encoded DataFrame
   - Validate DataFrame structure and content

6. **Find frequent itemsets**
   - Call AprioriTrainer.find_frequent_itemsets method
   - Pass encoded DataFrame and min_support setting
   - Receive frequent itemsets DataFrame
   - Log number of frequent itemsets found

7. **Generate association rules**
   - Call AprioriTrainer.generate_rules method
   - Pass frequent itemsets and min_confidence setting
   - Receive association rules DataFrame
   - Filter rules to ensure quality (minimum lift value)

8. **Process and filter rules**
   - Remove self-recommendations (product recommending itself)
   - Filter by minimum lift value (e.g., lift > 1.0)
   - Sort rules by confidence and lift
   - Limit rules per product to prevent data bloat

9. **Store recommendations**
   - Call store_recommendations method (Task 28)
   - Pass processed rules DataFrame
   - Save to Recommendation model with type="FBT"
   - Associate with current tenant

10. **Invalidate cache**
    - Clear all FBT cache entries for tenant
    - Force fresh data retrieval after training
    - Log cache invalidation operation

11. **Log training results**
    - Log number of transactions processed
    - Log number of rules generated
    - Log training duration
    - Log any warnings or errors

12. **Return training summary**
    - Create result dictionary with metrics
    - Include: rules_count, transactions_count, duration
    - Include: training_date, date_range
    - Return for logging or monitoring

### Training Pipeline Flow

```
┌──────────────────────────────────────────┐
│ 1. Determine Time Window                 │
│    (Default: Last 90 days)               │
└─────────────┬────────────────────────────┘
              │
              ▼
┌──────────────────────────────────────────┐
│ 2. Extract Transactions                  │
│    (BasketAnalyzer.get_transactions)     │
└─────────────┬────────────────────────────┘
              │
              ▼
┌──────────────────────────────────────────┐
│ 3. Validate Data Sufficiency             │
│    (Min transactions, min products)      │
└─────────────┬────────────────────────────┘
              │
              ▼
┌──────────────────────────────────────────┐
│ 4. Encode Transactions                   │
│    (BasketAnalyzer.encode_transactions)  │
└─────────────┬────────────────────────────┘
              │
              ▼
┌──────────────────────────────────────────┐
│ 5. Find Frequent Itemsets                │
│    (AprioriTrainer.find_frequent_items)  │
└─────────────┬────────────────────────────┘
              │
              ▼
┌──────────────────────────────────────────┐
│ 6. Generate Association Rules            │
│    (AprioriTrainer.generate_rules)       │
└─────────────┬────────────────────────────┘
              │
              ▼
┌──────────────────────────────────────────┐
│ 7. Process and Filter Rules              │
│    (Remove self-refs, filter by lift)    │
└─────────────┬────────────────────────────┘
              │
              ▼
┌──────────────────────────────────────────┐
│ 8. Store Recommendations                 │
│    (store_recommendations method)        │
└─────────────┬────────────────────────────┘
              │
              ▼
┌──────────────────────────────────────────┐
│ 9. Invalidate Cache                      │
│    (Clear tenant FBT cache)              │
└─────────────┬────────────────────────────┘
              │
              ▼
┌──────────────────────────────────────────┐
│ 10. Return Training Summary              │
└──────────────────────────────────────────┘
```

### Data Sufficiency Requirements

| Metric | Minimum Value | Reasoning |
|--------|---------------|-----------|
| Transactions | 50 | Statistical significance |
| Unique Products | 10 | Meaningful patterns |
| Products per Transaction | 2 | Association requires pairs |
| Date Range | 30 days | Sufficient temporal coverage |

### Rule Filtering Criteria

| Filter | Threshold | Purpose |
|--------|-----------|---------|
| Self-recommendation | Exclude | Avoid redundant suggestions |
| Minimum Lift | > 1.0 | Ensure positive correlation |
| Minimum Confidence | From settings | Quality threshold |
| Maximum Rules per Product | 20 | Prevent data bloat |
| Antecedent Size | 1-2 items | Focus on direct associations |

### Training Summary Fields

| Field | Type | Description |
|-------|------|-------------|
| success | boolean | Training completion status |
| rules_count | integer | Number of rules generated |
| transactions_count | integer | Transactions processed |
| products_count | integer | Unique products involved |
| date_range | dict | Start and end dates |
| duration_seconds | float | Training duration |
| trained_at | datetime | Timestamp of training |
| min_support | float | Support threshold used |
| min_confidence | float | Confidence threshold used |

### Error Scenarios

| Scenario | Handling |
|----------|----------|
| No transactions in date range | Log warning, return empty result |
| Encoding fails | Log error, raise exception |
| No frequent itemsets found | Log warning, return empty result |
| No rules generated | Log info, return empty result |
| Storage fails | Log error, rollback, raise exception |
| Cache invalidation fails | Log warning, continue |

### Expected Outcome
- Fully functional train method
- Complete training pipeline implementation
- Proper error handling at each step
- Comprehensive logging of training process
- Training summary returned for monitoring

### Verification Checklist
- [ ] train method implemented in FBTService
- [ ] Time window calculation correct
- [ ] Transaction extraction integrated
- [ ] Data sufficiency validation in place
- [ ] Transaction encoding called correctly
- [ ] Frequent itemsets generation integrated
- [ ] Association rules generation integrated
- [ ] Rule filtering implemented (self-refs, lift)
- [ ] store_recommendations method called
- [ ] Cache invalidation triggered
- [ ] Training metrics logged
- [ ] Training summary returned
- [ ] Error handling comprehensive
- [ ] All edge cases covered

---

## Task 27: Create get_fbt Method

### Overview
Implement the get_fbt method in FBTService that retrieves frequently bought together recommendations for a specific product. This method implements a cache-first strategy, checking Redis cache before querying the database, ensuring optimal performance for recommendation retrieval. It returns a list of recommended product IDs with confidence scores, sorted by relevance.

### Dependencies
- Task 26: Create train Method
- Task 28: Create store_recommendations (for data availability)
- Task 31: Create FBT Cache (for cache structure)
- Redis cache infrastructure

### Instructions

1. **Define get_fbt method signature**
   - Create method `get_fbt` in FBTService class
   - Accept product_id parameter (required)
   - Accept limit parameter (default: 5)
   - Accept force_refresh parameter (default: False)
   - Return list of recommended product dictionaries

2. **Validate input parameters**
   - Check that product_id is valid and exists
   - Validate limit is positive integer
   - Verify product belongs to current tenant
   - Raise validation error for invalid inputs

3. **Generate cache key**
   - Create cache key format: `fbt:{tenant_id}:{product_id}`
   - Ensure tenant isolation in cache keys
   - Use consistent key naming convention
   - Log cache key for debugging

4. **Check cache first**
   - If force_refresh is False, check Redis cache
   - Use generated cache key
   - Deserialize cached data if found
   - Log cache hit or miss for monitoring

5. **Handle cache hit**
   - If recommendations found in cache, return immediately
   - Parse cached JSON data
   - Validate cached data structure
   - Apply limit to cached results
   - Log cache retrieval success

6. **Handle cache miss**
   - If not in cache, proceed to database query
   - Log cache miss for monitoring
   - Continue to database retrieval step

7. **Query database for recommendations**
   - Query Recommendation model
   - Filter by: source_product_id, tenant, type="FBT"
   - Filter by: is_active=True, deleted_at=None
   - Order by: confidence DESC, lift DESC
   - Apply limit parameter

8. **Process database results**
   - Extract recommended product IDs
   - Include confidence and lift scores
   - Include metadata (support, timestamp)
   - Format as list of dictionaries

9. **Fetch product details**
   - Query Product model for recommended product IDs
   - Retrieve: name, sku, price, image
   - Verify products are active and in stock
   - Filter out deleted or inactive products

10. **Combine data**
    - Merge recommendation scores with product details
    - Create unified recommendation objects
    - Include all relevant fields for display
    - Sort by confidence score

11. **Cache the results**
    - Call cache_fbt method (Task 32) to store in Redis
    - Use TTL from settings (24 hours)
    - Serialize data as JSON
    - Log cache storage success

12. **Return recommendations**
    - Return list of recommendation dictionaries
    - Include: product_id, name, sku, price, image
    - Include: confidence, lift, support scores
    - Return empty list if no recommendations found

### Method Flow Diagram

```
┌─────────────────────────────────────────┐
│ get_fbt(product_id, limit=5)            │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│ Validate Parameters                     │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│ Generate Cache Key                      │
│ fbt:{tenant}:{product_id}               │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│ Check Redis Cache                       │
└────────┬───────────┬────────────────────┘
         │           │
    Cache Hit    Cache Miss
         │           │
         ▼           ▼
┌─────────────┐ ┌──────────────────────────┐
│ Return      │ │ Query Database           │
│ Cached      │ │ (Recommendation model)   │
│ Data        │ └────────┬─────────────────┘
└─────────────┘          │
                         ▼
                ┌─────────────────────────────┐
                │ Fetch Product Details       │
                │ (Product model)             │
                └────────┬────────────────────┘
                         │
                         ▼
                ┌─────────────────────────────┐
                │ Combine Data                │
                │ (Scores + Product Info)     │
                └────────┬────────────────────┘
                         │
                         ▼
                ┌─────────────────────────────┐
                │ Cache Results               │
                │ (cache_fbt method)          │
                └────────┬────────────────────┘
                         │
                         ▼
                ┌─────────────────────────────┐
                │ Return Recommendations      │
                └─────────────────────────────┘
```

### Cache Key Structure

| Component | Format | Example |
|-----------|--------|---------|
| Prefix | fbt | fbt |
| Tenant ID | {tenant_id} | abc123 |
| Product ID | {product_id} | prod_789 |
| Full Key | fbt:{tenant}:{product} | fbt:abc123:prod_789 |

### Recommendation Object Structure

| Field | Type | Source | Description |
|-------|------|--------|-------------|
| product_id | string | Recommendation | Recommended product ID |
| name | string | Product | Product name |
| sku | string | Product | Product SKU |
| price | decimal | Product | Current price |
| image_url | string | Product | Product image |
| confidence | float | Recommendation | Confidence score (0-1) |
| lift | float | Recommendation | Lift metric |
| support | float | Recommendation | Support value |
| frequency | integer | Recommendation | Times bought together |

### Performance Optimization

| Strategy | Implementation |
|----------|----------------|
| Cache First | Check Redis before database |
| Efficient Queries | Use select_related, prefetch_related |
| Limited Results | Apply limit parameter early |
| Index Usage | Ensure DB indexes on query fields |
| Lazy Loading | Only fetch product details when needed |

### Query Optimization

| Optimization | Description |
|--------------|-------------|
| Filter Early | Apply all filters in single query |
| Select Related | Join Product table efficiently |
| Index Hints | Use indexed fields (product_id, type) |
| Limit Results | Apply LIMIT clause in SQL |
| Cache Results | Store for subsequent requests |

### Error Handling

| Error | Response |
|-------|----------|
| Product Not Found | Return empty list |
| Cache Unavailable | Fall back to database |
| Database Error | Log error, return empty list |
| Invalid Product ID | Raise validation error |
| No Recommendations | Return empty list (not error) |

### Expected Outcome
- Functional get_fbt method with cache-first strategy
- Fast recommendation retrieval
- Comprehensive product information
- Proper error handling
- Efficient database queries

### Verification Checklist
- [ ] get_fbt method implemented in FBTService
- [ ] Parameter validation in place
- [ ] Cache key generation correct
- [ ] Redis cache check implemented
- [ ] Cache hit returns immediately
- [ ] Database query on cache miss
- [ ] Recommendation model filtered correctly
- [ ] Product details fetched and merged
- [ ] Results cached via cache_fbt method
- [ ] Recommendation objects properly formatted
- [ ] Limit parameter respected
- [ ] force_refresh parameter works
- [ ] Error handling comprehensive
- [ ] Performance optimized

---

## Task 28: Create store_recommendations Method

### Overview
Implement the store_recommendations method in FBTService that persists generated association rules to the Recommendation model. This method transforms Apriori algorithm output (association rules DataFrame) into database records, handling both new insertions and updates of existing recommendations. It ensures data integrity, prevents duplicates, and maintains recommendation metadata.

### Dependencies
- Task 27: Create get_fbt Method
- Recommendation model from Group-A
- Association rules format from Task 22

### Instructions

1. **Define store_recommendations method signature**
   - Create method `store_recommendations` in FBTService class
   - Accept rules parameter (DataFrame from Apriori)
   - Accept optional batch_size parameter (default: 100)
   - Return storage summary (created, updated, skipped counts)

2. **Validate input rules**
   - Check that rules DataFrame is not empty
   - Verify required columns exist (antecedents, consequents, confidence, lift, support)
   - Validate data types of columns
   - Log validation results

3. **Transform rules to recommendation format**
   - Iterate through rules DataFrame
   - Extract antecedent (source product ID)
   - Extract consequent (target product ID)
   - Extract metrics (confidence, lift, support)
   - Handle multi-item antecedents/consequents appropriately

4. **Handle multi-item antecedents**
   - Apriori can generate rules with multiple items in antecedent
   - For FBT, focus on single-item antecedents
   - Skip or split rules with multiple antecedents
   - Log decisions for tracking

5. **Prepare recommendation objects**
   - Create list of recommendation dictionaries
   - Map fields: source_product_id, target_product_id
   - Include: recommendation_type="FBT"
   - Include: confidence, lift, support scores
   - Include: tenant reference
   - Include: metadata (trained_at, algorithm_version)

6. **Implement batch processing**
   - Process recommendations in batches (default: 100)
   - Prevents memory issues with large rule sets
   - Improves database transaction efficiency
   - Log progress for monitoring

7. **Check for existing recommendations**
   - For each batch, query existing recommendations
   - Filter by: source_product_id, target_product_id, type="FBT", tenant
   - Identify duplicates to update vs new records to create
   - Use bulk operations for efficiency

8. **Update existing recommendations**
   - For duplicates found in database
   - Update: confidence, lift, support scores
   - Update: last_trained_at timestamp
   - Update: is_active=True (reactivate if needed)
   - Track count of updated records

9. **Create new recommendations**
   - For non-existing recommendations
   - Use bulk_create for efficiency
   - Set all required fields
   - Set is_active=True by default
   - Track count of created records

10. **Handle deactivation of old recommendations**
    - After storing new recommendations
    - Query all FBT recommendations for tenant
    - Identify recommendations not in new rule set
    - Set is_active=False for outdated recommendations
    - Track count of deactivated records

11. **Implement transaction safety**
    - Wrap database operations in transaction
    - Rollback on any error
    - Ensure atomicity of storage operation
    - Log transaction status

12. **Log storage results**
    - Log number of recommendations created
    - Log number of recommendations updated
    - Log number of recommendations deactivated
    - Log storage duration
    - Log any errors or warnings

13. **Return storage summary**
    - Create result dictionary
    - Include: created_count, updated_count, deactivated_count
    - Include: total_processed, storage_duration
    - Include: timestamp
    - Return for monitoring

### Storage Pipeline Flow

```
┌──────────────────────────────────────────┐
│ store_recommendations(rules_df)          │
└────────────┬─────────────────────────────┘
             │
             ▼
┌──────────────────────────────────────────┐
│ Validate Rules DataFrame                 │
└────────────┬─────────────────────────────┘
             │
             ▼
┌──────────────────────────────────────────┐
│ Transform to Recommendation Format       │
│ (Extract antecedents, consequents)       │
└────────────┬─────────────────────────────┘
             │
             ▼
┌──────────────────────────────────────────┐
│ Handle Multi-item Antecedents            │
│ (Filter single-item rules)               │
└────────────┬─────────────────────────────┘
             │
             ▼
┌──────────────────────────────────────────┐
│ Process in Batches                       │
│ (Default: 100 per batch)                 │
└────────────┬─────────────────────────────┘
             │
             ▼
┌──────────────────────────────────────────┐
│ Check Existing Recommendations           │
│ (Query by source, target, type)          │
└────────┬───────────┬─────────────────────┘
         │           │
    Existing      New
         │           │
         ▼           ▼
┌────────────┐ ┌──────────────────────────┐
│ Update     │ │ Bulk Create              │
│ Existing   │ │ New Records              │
└────────┬───┘ └────────┬─────────────────┘
         │              │
         └──────┬───────┘
                │
                ▼
┌──────────────────────────────────────────┐
│ Deactivate Old Recommendations           │
│ (Not in new rule set)                    │
└────────────┬─────────────────────────────┘
             │
             ▼
┌──────────────────────────────────────────┐
│ Return Storage Summary                   │
└──────────────────────────────────────────┘
```

### Rules DataFrame Format

| Column | Type | Description |
|--------|------|-------------|
| antecedents | frozenset | Source product(s) |
| consequents | frozenset | Target product(s) |
| support | float | Support metric |
| confidence | float | Confidence score |
| lift | float | Lift metric |
| leverage | float | Leverage (optional) |
| conviction | float | Conviction (optional) |

### Recommendation Model Fields

| Field | Value | Source |
|-------|-------|--------|
| source_product_id | Product ID | antecedents |
| target_product_id | Product ID | consequents |
| recommendation_type | "FBT" | Constant |
| confidence | Float | confidence column |
| lift | Float | lift column |
| support | Float | support column |
| tenant | Tenant | Service context |
| is_active | True | Default |
| trained_at | Timestamp | Current time |
| metadata | JSON | Algorithm details |

### Batch Processing Strategy

| Parameter | Value | Reasoning |
|-----------|-------|-----------|
| Batch Size | 100 | Balance memory and performance |
| Transaction per Batch | Yes | Ensure atomicity |
| Progress Logging | Every 500 | Monitor long operations |
| Memory Limit | Consider | For very large rule sets |

### Deactivation Logic

| Condition | Action |
|-----------|--------|
| Rule exists in new training | Update/activate |
| Rule absent in new training | Deactivate (is_active=False) |
| Never delete | Preserve historical data |
| Timestamp tracking | Update last_seen_at |

### Storage Summary Fields

| Field | Type | Description |
|-------|------|-------------|
| created_count | integer | New recommendations created |
| updated_count | integer | Existing recommendations updated |
| deactivated_count | integer | Recommendations deactivated |
| total_processed | integer | Total rules processed |
| skipped_count | integer | Rules skipped (invalid) |
| storage_duration | float | Time taken (seconds) |
| stored_at | datetime | Storage timestamp |
| success | boolean | Overall success status |

### Error Handling

| Error | Response |
|-------|----------|
| Empty DataFrame | Log warning, return zero counts |
| Invalid Column | Raise validation error |
| Database Error | Rollback transaction, raise error |
| Duplicate Key | Update existing record |
| Product Not Found | Skip, log warning |

### Expected Outcome
- Functional store_recommendations method
- Efficient batch processing
- Proper handling of duplicates
- Historical data preservation
- Comprehensive storage summary

### Verification Checklist
- [ ] store_recommendations method implemented
- [ ] Rules DataFrame validation in place
- [ ] Transformation logic correct
- [ ] Multi-item antecedent handling implemented
- [ ] Batch processing implemented
- [ ] Existing recommendations checked
- [ ] Update logic for existing records
- [ ] Bulk create for new records
- [ ] Deactivation of old recommendations
- [ ] Transaction safety ensured
- [ ] Storage summary returned
- [ ] Logging comprehensive
- [ ] Error handling robust

---

## Task 29: Create FBTTrainingTask

### Overview
Create a Celery task for FBT model training that enables asynchronous, scheduled execution of the training pipeline. This task wraps the FBTService.train method in a Celery task, allowing it to be executed in the background without blocking the main application, scheduled automatically, and retried on failures.

### Dependencies
- Task 28: Create store_recommendations
- Celery infrastructure from Phase-03
- FBTService with train method

### Instructions

1. **Create FBT tasks file**
   - Navigate to `backend/apps/ai/recommendations/tasks/` directory
   - Create new file named `fbt_tasks.py`
   - This file will contain all FBT-related Celery tasks

2. **Import required dependencies**
   - Import Celery app instance
   - Import FBTService
   - Import Tenant model
   - Import task decorators (shared_task or app.task)
   - Import logging utilities
   - Import exception handling utilities

3. **Define task decorator configuration**
   - Use `@shared_task` or `@app.task` decorator
   - Set task name: "recommendations.train_fbt"
   - Set queue: "training" (dedicated queue for ML tasks)
   - Set priority: medium (5)
   - Enable task result backend
   - Set time_limit: 3600 (1 hour)
   - Set soft_time_limit: 3000 (50 minutes)

4. **Create train_fbt_task function**
   - Define function `train_fbt_task`
   - Accept tenant_id parameter (required)
   - Accept optional parameters: start_date, end_date
   - Return training result summary

5. **Implement tenant retrieval**
   - Query Tenant model using tenant_id
   - Handle case where tenant not found
   - Raise appropriate error if tenant invalid
   - Log tenant information

6. **Set up tenant schema context**
   - Switch to tenant schema for database operations
   - Use schema context manager or utility
   - Ensure all queries use tenant schema
   - Handle context errors gracefully

7. **Initialize FBTService**
   - Create FBTService instance with tenant
   - Log service initialization
   - Handle initialization errors

8. **Call train method**
   - Invoke FBTService.train method
   - Pass start_date and end_date if provided
   - Capture training result summary
   - Handle training exceptions

9. **Implement retry logic**
   - Configure automatic retry on failure
   - Set max_retries: 3
   - Set retry_backoff: exponential (2, 4, 8 minutes)
   - Define retry_on: specific exceptions (database errors, timeout)
   - Log retry attempts

10. **Log task execution**
    - Log task start with tenant ID
    - Log progress at key steps
    - Log training metrics from result
    - Log task completion or failure
    - Include execution duration

11. **Handle errors gracefully**
    - Catch specific exceptions (DataError, ServiceError)
    - Log error details with context
    - Send alert for critical failures (optional)
    - Return error summary (don't let task fail silently)

12. **Return task result**
    - Return training summary dictionary
    - Include: tenant_id, success status
    - Include: training metrics from FBTService
    - Include: task execution metadata
    - Store result in Celery backend for retrieval

### Task Configuration

```
@shared_task(
    name="recommendations.train_fbt",
    queue="training",
    bind=True,
    max_retries=3,
    time_limit=3600,
    soft_time_limit=3000,
    autoretry_for=(DatabaseError, TimeoutError),
    retry_backoff=True,
    retry_backoff_max=600,
    retry_jitter=True
)
```

### Task Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| tenant_id | string | Yes | - | Tenant identifier |
| start_date | string | No | 90 days ago | Training data start date |
| end_date | string | No | Today | Training data end date |
| force_retrain | boolean | No | False | Force retraining even if recent |

### Task Flow Diagram

```
┌──────────────────────────────────────────┐
│ train_fbt_task(tenant_id)                │
└────────────┬─────────────────────────────┘
             │
             ▼
┌──────────────────────────────────────────┐
│ Retrieve Tenant                          │
└────────────┬─────────────────────────────┘
             │
             ▼
┌──────────────────────────────────────────┐
│ Set Tenant Schema Context                │
└────────────┬─────────────────────────────┘
             │
             ▼
┌──────────────────────────────────────────┐
│ Initialize FBTService                    │
└────────────┬─────────────────────────────┘
             │
             ▼
┌──────────────────────────────────────────┐
│ Call FBTService.train()                  │
└────────────┬─────────────────────────────┘
             │
        Success│Failure
             │ │
             ▼ ▼
┌─────────────┐ ┌──────────────────────────┐
│ Log Success │ │ Handle Error & Retry     │
└──────┬──────┘ └────────┬─────────────────┘
       │                 │
       └─────────┬───────┘
                 │
                 ▼
┌──────────────────────────────────────────┐
│ Return Task Result                       │
└──────────────────────────────────────────┘
```

### Retry Strategy

| Scenario | Max Retries | Backoff | Retry On |
|----------|-------------|---------|----------|
| Database Connection | 3 | Exponential | DatabaseError |
| Timeout | 2 | Linear | TimeoutError |
| Data Insufficient | 1 | None | DataError |
| Service Error | 3 | Exponential | ServiceError |
| Unknown Error | 0 | None | Don't retry |

### Task Result Format

| Field | Type | Description |
|-------|------|-------------|
| tenant_id | string | Tenant identifier |
| success | boolean | Task success status |
| rules_count | integer | Rules generated |
| transactions_count | integer | Transactions processed |
| training_duration | float | Duration in seconds |
| trained_at | datetime | Training timestamp |
| error | string | Error message if failed |
| retry_count | integer | Number of retries |

### Queue Configuration

| Queue | Priority | Workers | Purpose |
|-------|----------|---------|---------|
| training | Medium | 2-4 | ML model training tasks |
| default | High | 4-8 | Regular tasks |
| celery | Low | 2 | Periodic tasks |

### Error Handling

| Error Type | Action |
|------------|--------|
| Tenant Not Found | Log error, fail task |
| Schema Switch Error | Log error, retry |
| Training Error | Log error, retry with backoff |
| Timeout | Log error, retry once |
| Unknown Error | Log error, don't retry |

### Expected Outcome
- Functional Celery task for FBT training
- Proper tenant isolation
- Automatic retry on transient failures
- Comprehensive logging
- Task result stored for monitoring

### Verification Checklist
- [ ] `backend/apps/ai/recommendations/tasks/fbt_tasks.py` created
- [ ] train_fbt_task function defined
- [ ] Celery decorator configured correctly
- [ ] Queue set to "training"
- [ ] Tenant retrieval implemented
- [ ] Schema context switching in place
- [ ] FBTService initialized correctly
- [ ] train method called with parameters
- [ ] Retry logic configured
- [ ] Error handling comprehensive
- [ ] Logging at all key steps
- [ ] Task result formatted correctly
- [ ] Time limits set appropriately

---

## Task 30: Create FBT Schedule

### Overview
Configure a Celery Beat schedule to automatically execute the FBT training task on a daily basis. This ensures that recommendation models stay up-to-date with the latest transaction data without manual intervention. The schedule triggers training at an optimal time when system load is low.

### Dependencies
- Task 29: Create FBTTrainingTask
- Celery Beat configuration from Phase-03
- Tenant management system

### Instructions

1. **Locate Celery Beat configuration**
   - Navigate to project settings or Celery configuration file
   - Find `CELERY_BEAT_SCHEDULE` dictionary
   - This configuration defines all periodic tasks

2. **Add FBT training schedule entry**
   - Create new entry in CELERY_BEAT_SCHEDULE
   - Key name: "train_fbt_daily"
   - Configure task reference, schedule, and arguments

3. **Set schedule timing**
   - Use crontab schedule for daily execution
   - Set time: 2:00 AM (low traffic period)
   - Time should be in server timezone
   - Consider timezone differences for global deployments

4. **Configure task reference**
   - Reference: "recommendations.train_fbt"
   - Must match task name from Task 29
   - Verify task is registered in Celery app

5. **Implement tenant iteration**
   - Schedule should process all active tenants
   - Create wrapper task or iteration logic
   - Pass tenant_id to train_fbt_task for each tenant
   - Consider rate limiting between tenants

6. **Add schedule options**
   - Set priority for scheduled tasks
   - Configure execution options (expires, time_limit)
   - Define retry policy for scheduled tasks
   - Set queue to "training"

7. **Implement schedule conditions**
   - Optional: Check if training needed (based on last trained time)
   - Optional: Skip tenants with insufficient data
   - Optional: Stagger tenant training to avoid load spikes
   - Log scheduling decisions

8. **Create tenant training coordinator task**
   - Define separate task: `train_all_tenants_fbt`
   - This task fetches all active tenants
   - Dispatches train_fbt_task for each tenant
   - Implements rate limiting and error handling

9. **Configure coordinator schedule**
   - Schedule coordinator task in CELERY_BEAT_SCHEDULE
   - Coordinator then dispatches individual training tasks
   - Provides better control and monitoring
   - Allows for conditional execution per tenant

10. **Add schedule monitoring**
    - Log when schedule triggers
    - Track which tenants are processed
    - Monitor execution duration
    - Alert on schedule failures

11. **Document schedule configuration**
    - Add comments explaining schedule logic
    - Document timing decisions
    - Explain tenant iteration approach
    - Note any special considerations

### Schedule Configuration Example

```python
CELERY_BEAT_SCHEDULE = {
    'train_fbt_daily': {
        'task': 'recommendations.train_all_tenants_fbt',
        'schedule': crontab(hour=2, minute=0),
        'options': {
            'queue': 'training',
            'expires': 3600,
        }
    },
}
```

### Timing Considerations

| Time | Reason |
|------|--------|
| 2:00 AM | Low user activity |
| Daily | Fresh recommendations |
| Server Timezone | Consistent scheduling |
| Avoid Peak Hours | Prevent performance impact |

### Tenant Coordinator Task Flow

```
┌──────────────────────────────────────────┐
│ train_all_tenants_fbt() - Scheduled      │
│ (Triggered at 2:00 AM daily)             │
└────────────┬─────────────────────────────┘
             │
             ▼
┌──────────────────────────────────────────┐
│ Fetch All Active Tenants                 │
└────────────┬─────────────────────────────┘
             │
             ▼
┌──────────────────────────────────────────┐
│ For Each Tenant:                         │
│   - Check last training time             │
│   - Check data availability              │
│   - Determine if training needed         │
└────────────┬─────────────────────────────┘
             │
             ▼
┌──────────────────────────────────────────┐
│ Dispatch train_fbt_task(tenant_id)       │
│ (Multiple tasks queued)                  │
└────────────┬─────────────────────────────┘
             │
             ▼
┌──────────────────────────────────────────┐
│ Rate Limit: 5 seconds between tasks      │
│ Prevents overwhelming system             │
└────────────┬─────────────────────────────┘
             │
             ▼
┌──────────────────────────────────────────┐
│ Log Coordinator Summary                  │
│ (Tenants processed, tasks dispatched)    │
└──────────────────────────────────────────┘
```

### Coordinator Task Configuration

| Parameter | Value | Purpose |
|-----------|-------|---------|
| Name | train_all_tenants_fbt | Descriptive identifier |
| Queue | training | ML training queue |
| Rate Limit | 10/m | Max 10 tenants per minute |
| Time Limit | 7200 | 2 hours for all tenants |
| Soft Time Limit | 6600 | 110 minutes warning |

### Training Frequency Options

| Frequency | Crontab | Use Case |
|-----------|---------|----------|
| Daily | `crontab(hour=2, minute=0)` | Standard (recommended) |
| Twice Daily | `crontab(hour='2,14', minute=0)` | High-volume stores |
| Weekly | `crontab(hour=2, minute=0, day_of_week=1)` | Low-volume stores |
| Custom | `crontab(hour=2, minute=0, day_of_week='1,4')` | Mon & Thu only |

### Conditional Training Logic

| Condition | Action |
|-----------|--------|
| Last trained < 20 hours ago | Skip, log info |
| Insufficient transactions | Skip, log warning |
| Training in progress | Skip, log warning |
| Never trained | Always train |
| Manual override flag | Always train |

### Rate Limiting Strategy

| Strategy | Implementation |
|----------|----------------|
| Between Tenants | 5 second delay |
| Concurrent Limit | Max 2 training tasks |
| Queue Management | Use dedicated training queue |
| Priority | Medium priority for scheduled |

### Monitoring and Alerting

| Metric | Threshold | Alert |
|--------|-----------|-------|
| Schedule Miss | 1 per week | Email admin |
| Task Failure Rate | > 20% | Slack notification |
| Execution Duration | > 90 min | Log warning |
| Tenant Coverage | < 80% | Daily report |

### Expected Outcome
- Automated daily FBT training
- All active tenants processed
- Proper rate limiting
- Comprehensive logging
- Schedule monitoring in place

### Verification Checklist
- [ ] CELERY_BEAT_SCHEDULE configuration updated
- [ ] FBT training schedule entry added
- [ ] Schedule timing set to 2:00 AM
- [ ] Coordinator task created (train_all_tenants_fbt)
- [ ] Tenant iteration logic implemented
- [ ] Rate limiting between tenants
- [ ] Conditional training checks in place
- [ ] Task reference correct
- [ ] Queue set to "training"
- [ ] Schedule options configured
- [ ] Logging implemented
- [ ] Schedule tested in development
- [ ] Documentation added

---

## Task 31: Create FBT Cache

### Overview
Design and implement the Redis caching structure for FBT recommendations. This establishes the cache key format, TTL (time-to-live) settings, data structure, and cache management utilities. Proper caching significantly reduces database load and improves recommendation retrieval performance.

### Dependencies
- Task 30: Create FBT Schedule
- Redis infrastructure from Phase-03
- FBTService with get_fbt method

### Instructions

1. **Define cache key structure**
   - Create consistent key naming convention
   - Format: `fbt:{tenant_id}:{product_id}`
   - Ensures tenant isolation
   - Enables efficient key pattern matching

2. **Document cache key components**
   - Prefix: "fbt" (identifies cache type)
   - Tenant ID: Ensures multi-tenant isolation
   - Product ID: Specific product being queried
   - Use colon separator for Redis best practices

3. **Set cache TTL (Time To Live)**
   - Define TTL: 86400 seconds (24 hours)
   - Balances freshness with performance
   - Cache expires before next training
   - Configurable via settings

4. **Define cached data structure**
   - Store as JSON string in Redis
   - Include: list of recommended products
   - Include: confidence scores and metrics
   - Include: cache timestamp

5. **Create cache utility functions**
   - Function: `generate_fbt_cache_key(tenant_id, product_id)`
   - Function: `get_fbt_from_cache(tenant_id, product_id)`
   - Function: `set_fbt_cache(tenant_id, product_id, data, ttl)`
   - Function: `invalidate_fbt_cache(tenant_id, product_id=None)`

6. **Implement cache key generator**
   - Create `generate_fbt_cache_key` function
   - Accept tenant_id and product_id parameters
   - Return formatted cache key string
   - Validate inputs before formatting

7. **Implement cache retrieval function**
   - Create `get_fbt_from_cache` function
   - Generate cache key
   - Query Redis using key
   - Deserialize JSON data if found
   - Return None if cache miss
   - Handle Redis connection errors

8. **Implement cache storage function**
   - Create `set_fbt_cache` function
   - Generate cache key
   - Serialize data to JSON
   - Store in Redis with TTL
   - Log cache storage success
   - Handle storage errors

9. **Implement cache invalidation function**
   - Create `invalidate_fbt_cache` function
   - If product_id provided: delete specific key
   - If product_id is None: delete all tenant FBT keys
   - Use Redis pattern matching for bulk deletion
   - Log invalidation operations

10. **Add cache health check**
    - Function to verify Redis connection
    - Test cache read/write operations
    - Return connection status
    - Log connection issues

11. **Implement cache warming (optional)**
    - Function to pre-populate cache for popular products
    - Triggered after training completion
    - Reduces cold start latency
    - Runs asynchronously

12. **Add cache metrics tracking**
    - Track cache hit rate
    - Track cache miss rate
    - Log cache performance metrics
    - Optional: Send to monitoring system

### Cache Key Structure

```
Format: fbt:{tenant_id}:{product_id}

Examples:
- fbt:tenant_abc123:prod_12345
- fbt:tenant_xyz789:prod_67890

Pattern for deletion:
- fbt:tenant_abc123:*  (All FBT for tenant)
- fbt:*:prod_12345     (Specific product across tenants)
```

### Cache Data Structure

```json
{
  "product_id": "prod_12345",
  "recommendations": [
    {
      "product_id": "prod_67890",
      "name": "Product Name",
      "sku": "SKU-123",
      "price": "29.99",
      "confidence": 0.85,
      "lift": 2.3,
      "support": 0.05
    },
    ...
  ],
  "cached_at": "2026-01-31T10:30:00Z",
  "version": "1.0"
}
```

### Cache Configuration

| Setting | Value | Purpose |
|---------|-------|---------|
| Key Prefix | fbt | Identify FBT cache entries |
| TTL | 86400 seconds | 24 hours |
| Max Size | No limit | Store all products |
| Serialization | JSON | Human-readable |
| Compression | None | Small data size |

### Cache Utility Functions

| Function | Purpose | Parameters | Returns |
|----------|---------|------------|---------|
| generate_fbt_cache_key | Create cache key | tenant_id, product_id | string |
| get_fbt_from_cache | Retrieve from cache | tenant_id, product_id | dict or None |
| set_fbt_cache | Store in cache | tenant_id, product_id, data, ttl | boolean |
| invalidate_fbt_cache | Clear cache | tenant_id, product_id (optional) | integer (count) |

### Cache Invalidation Scenarios

| Scenario | Invalidation Scope | Trigger |
|----------|-------------------|---------|
| Model Training | All tenant FBT keys | After successful training |
| Product Update | Single product key | Product price/stock change |
| Tenant Deletion | All tenant keys | Tenant account deletion |
| Manual Clear | All or selective | Admin action |

### Cache Performance Metrics

| Metric | Calculation | Target |
|--------|-------------|--------|
| Hit Rate | Hits / (Hits + Misses) | > 80% |
| Average TTL | Average remaining TTL | ~12 hours |
| Storage Size | Total bytes used | Monitor |
| Response Time | Cache query duration | < 5ms |

### Error Handling

| Error | Handling |
|-------|----------|
| Redis Connection Failed | Log error, fall back to database |
| Serialization Error | Log error, skip caching |
| Key Not Found | Return None (cache miss) |
| Deserialization Error | Delete corrupt key, return None |
| Eviction | Normal behavior, log if excessive |

### Cache Warming Strategy

| Priority | Products to Warm | Reasoning |
|----------|------------------|-----------|
| High | Top 100 best-sellers | Highest traffic |
| Medium | Recently viewed | User behavior patterns |
| Low | New arrivals | Discovery |

### Expected Outcome
- Well-defined cache structure
- Efficient cache utility functions
- Proper TTL configuration
- Tenant-isolated caching
- Cache invalidation strategy

### Verification Checklist
- [ ] Cache key format defined (fbt:{tenant}:{product})
- [ ] TTL set to 24 hours (86400 seconds)
- [ ] Cache data structure documented
- [ ] generate_fbt_cache_key function created
- [ ] get_fbt_from_cache function created
- [ ] set_fbt_cache function created
- [ ] invalidate_fbt_cache function created
- [ ] Cache utilities integrated with FBTService
- [ ] Error handling implemented
- [ ] Cache metrics tracking added
- [ ] Documentation complete
- [ ] Cache tested with Redis

---

## Task 32: Create cache_fbt Method

### Overview
Implement the cache_fbt method in FBTService that stores FBT recommendations in Redis cache. This method serializes recommendation data, sets appropriate TTL, and handles caching errors gracefully. It's called after database retrieval to populate the cache for subsequent requests.

### Dependencies
- Task 31: Create FBT Cache (cache structure and utilities)
- Task 27: get_fbt method (calls cache_fbt)

### Instructions

1. **Define cache_fbt method signature**
   - Create method `cache_fbt` in FBTService class
   - Accept product_id parameter (required)
   - Accept recommendations parameter (list of recommendation dicts)
   - Accept optional ttl parameter (default: from settings)
   - Return boolean indicating cache success

2. **Validate input parameters**
   - Check that product_id is valid
   - Check that recommendations is a list
   - Validate recommendation data structure
   - Log validation errors

3. **Generate cache key**
   - Call generate_fbt_cache_key utility function
   - Pass tenant_id (from service instance)
   - Pass product_id parameter
   - Store cache key for logging

4. **Prepare cache data**
   - Create cache data dictionary
   - Include: product_id
   - Include: recommendations list
   - Include: cached_at timestamp
   - Include: version number (for future compatibility)

5. **Serialize data**
   - Convert cache data to JSON string
   - Use json.dumps with proper formatting
   - Handle serialization errors (datetime, decimal)
   - Log serialization issues

6. **Store in Redis**
   - Connect to Redis client
   - Use SET command with TTL
   - Set key: cache_key
   - Set value: serialized JSON
   - Set expiration: ttl seconds

7. **Handle Redis errors**
   - Catch Redis connection errors
   - Catch Redis timeout errors
   - Log error details
   - Return False on failure (don't break application flow)

8. **Log caching operation**
   - Log cache key used
   - Log number of recommendations cached
   - Log TTL applied
   - Log success or failure

9. **Implement cache verification (optional)**
   - After storing, optionally verify cache
   - Perform GET to confirm storage
   - Compare stored data with input
   - Log verification result

10. **Return cache status**
    - Return True if caching successful
    - Return False if caching failed
    - Caller can log or take action based on result

11. **Add cache metadata**
    - Include cache version in data
    - Include tenant_id for verification
    - Include expiry timestamp
    - Helps with cache debugging

### Method Flow Diagram

```
┌──────────────────────────────────────────┐
│ cache_fbt(product_id, recommendations)   │
└────────────┬─────────────────────────────┘
             │
             ▼
┌──────────────────────────────────────────┐
│ Validate Input Parameters                │
└────────────┬─────────────────────────────┘
             │
             ▼
┌──────────────────────────────────────────┐
│ Generate Cache Key                       │
│ (fbt:{tenant}:{product_id})              │
└────────────┬─────────────────────────────┘
             │
             ▼
┌──────────────────────────────────────────┐
│ Prepare Cache Data Dictionary            │
│ (product_id, recommendations, metadata)  │
└────────────┬─────────────────────────────┘
             │
             ▼
┌──────────────────────────────────────────┐
│ Serialize Data to JSON                   │
└────────────┬─────────────────────────────┘
             │
        Success│Failure
             │ │
             ▼ ▼
┌─────────────┐ ┌──────────────────────────┐
│ Store in    │ │ Log Serialization Error  │
│ Redis       │ │ Return False             │
│ with TTL    │ └──────────────────────────┘
└──────┬──────┘
       │
  Success│Failure
       │ │
       ▼ ▼
┌──────┐ ┌────────────────────────────────┐
│ Log  │ │ Log Redis Error, Return False  │
│ & OK │ └────────────────────────────────┘
└──────┘
```

### Cache Data Format

| Field | Type | Description |
|-------|------|-------------|
| product_id | string | Source product ID |
| recommendations | array | List of recommended products |
| cached_at | datetime | Cache creation timestamp |
| version | string | Cache format version |
| tenant_id | string | Tenant identifier (metadata) |
| expires_at | datetime | Calculated expiry time |

### Serialization Handling

| Data Type | Serialization Approach |
|-----------|----------------------|
| Decimal | Convert to float or string |
| Datetime | Convert to ISO format string |
| UUID | Convert to string |
| Enum | Convert to value |
| Custom Objects | Implement JSON encoder |

### Redis SET Operation

| Parameter | Value | Purpose |
|-----------|-------|---------|
| Key | fbt:{tenant}:{product} | Unique identifier |
| Value | JSON string | Recommendation data |
| EX | 86400 | Expiry in seconds (TTL) |
| NX | False | Allow overwrite |

### Error Scenarios

| Error | Action |
|-------|--------|
| Invalid product_id | Log error, return False |
| Empty recommendations | Log info, cache empty list |
| Serialization fails | Log error, return False |
| Redis connection error | Log error, return False |
| Redis timeout | Log warning, return False |
| Unexpected error | Log exception, return False |

### Logging Strategy

| Event | Level | Message |
|-------|-------|---------|
| Cache success | DEBUG | "Cached FBT for {product_id}: {count} items" |
| Cache failure | WARNING | "Failed to cache FBT for {product_id}: {error}" |
| Serialization error | ERROR | "Serialization error for {product_id}: {error}" |
| Empty recommendations | INFO | "Caching empty FBT for {product_id}" |

### Integration with get_fbt

```
get_fbt Method:
    │
    ▼
Check Cache (miss)
    │
    ▼
Query Database
    │
    ▼
Fetch Product Details
    │
    ▼
Call cache_fbt(product_id, recommendations)  ← Task 32
    │
    ▼
Return Recommendations
```

### Performance Considerations

| Aspect | Optimization |
|--------|--------------|
| Serialization | Use efficient JSON encoder |
| Redis Connection | Use connection pool |
| Error Handling | Fail fast, don't block |
| Logging | Use appropriate log levels |
| Data Size | Limit recommendation count |

### Expected Outcome
- Functional cache_fbt method
- Efficient caching of recommendations
- Graceful error handling
- Comprehensive logging
- Integration with get_fbt method

### Verification Checklist
- [ ] cache_fbt method implemented in FBTService
- [ ] Method signature correct (product_id, recommendations, ttl)
- [ ] Input validation in place
- [ ] Cache key generation integrated
- [ ] Data preparation correct
- [ ] JSON serialization handles all data types
- [ ] Redis SET operation with TTL
- [ ] Error handling comprehensive
- [ ] Logging at appropriate levels
- [ ] Return value (boolean) correct
- [ ] Cache metadata included
- [ ] Method tested with various inputs
- [ ] Integration with get_fbt verified

---

## Task 33: Create FBT Admin

### Overview
Create an admin interface for managing and monitoring FBT recommendations. This admin panel provides visibility into stored recommendations, allows manual training triggers, displays training history and metrics, and enables administrators to review and manage the FBT system effectively.

### Dependencies
- Task 28: Create store_recommendations (data to display)
- Django Admin framework
- Recommendation model

### Instructions

1. **Create FBT admin file**
   - Navigate to `backend/apps/ai/recommendations/admin/` directory
   - Create new file named `fbt_admin.py`
   - This will contain FBT-specific admin configurations

2. **Import required dependencies**
   - Import Django admin module
   - Import Recommendation model
   - Import admin utilities and filters
   - Import custom actions
   - Import timezone utilities

3. **Create FBTRecommendationAdmin class**
   - Define admin class for Recommendation model filtered to FBT type
   - Inherit from admin.ModelAdmin
   - Configure list display, filters, and actions
   - Customize for FBT-specific needs

4. **Configure list display**
   - Fields: source_product (with link)
   - Fields: target_product (with link)
   - Fields: confidence (formatted)
   - Fields: lift (formatted)
   - Fields: support (formatted)
   - Fields: is_active (boolean icon)
   - Fields: trained_at (formatted date)
   - Fields: tenant (if multi-tenant admin)

5. **Add list filters**
   - Filter by: is_active (Yes/No)
   - Filter by: tenant (if multi-tenant)
   - Filter by: confidence range (high/medium/low)
   - Filter by: lift value range
   - Filter by: trained_at date range

6. **Implement search functionality**
   - Search by: source product SKU
   - Search by: source product name
   - Search by: target product SKU
   - Search by: target product name
   - Use related field lookups

7. **Add custom actions**
   - Action: "Activate selected recommendations"
   - Action: "Deactivate selected recommendations"
   - Action: "Delete selected recommendations"
   - Action: "Trigger FBT training" (for tenant)
   - Include confirmation steps

8. **Create custom display methods**
   - Method: `display_source_product` (clickable link)
   - Method: `display_target_product` (clickable link)
   - Method: `display_confidence` (formatted as percentage)
   - Method: `display_lift` (formatted with color coding)
   - Method: `display_metrics_summary` (combined view)

9. **Add fieldsets for detail view**
   - Fieldset: "Product Information" (source, target)
   - Fieldset: "Metrics" (confidence, lift, support)
   - Fieldset: "Status" (is_active, trained_at)
   - Fieldset: "Metadata" (created_at, updated_at, tenant)
   - Organize logically for readability

10. **Implement inline displays**
    - Show related recommendations for product
    - Display as table inline
    - Allow quick review of related rules
    - Read-only display

11. **Add training trigger action**
    - Custom admin action to trigger FBT training
    - Calls train_fbt_task asynchronously
    - Shows confirmation dialog
    - Displays success message
    - Logs training trigger

12. **Create custom admin views**
    - View: FBT Dashboard (overview stats)
    - View: Training History (list of training runs)
    - View: Performance Metrics (cache hits, recommendations served)
    - Link from admin index

13. **Add metrics display**
    - Show total FBT recommendations count
    - Show active vs inactive count
    - Show average confidence
    - Show last training date
    - Show cache hit rate (if tracked)

14. **Implement permissions**
    - View permission: All staff
    - Add/Edit permission: Admin only
    - Delete permission: Superuser only
    - Training trigger: Admin only

15. **Register admin in Django admin**
    - Import admin class in admin/__init__.py
    - Register with admin site
    - Add custom admin site title if needed

### Admin Interface Structure

```
┌───────────────────────────────────────────┐
│ FBT Recommendations Admin                 │
├───────────────────────────────────────────┤
│ Filters:                                  │
│ - Is Active: [All|Yes|No]                │
│ - Confidence: [All|High|Medium|Low]      │
│ - Trained Date: [Date picker]            │
│                                           │
│ Search: [SKU or Product Name]            │
│                                           │
│ Actions: [Activate|Deactivate|Train]     │
├───────────────────────────────────────────┤
│ Results:                                  │
│ ┌────────┬────────┬────┬────┬────┬────┐ │
│ │ Source │ Target │Conf│Lift│Supp│Act?│ │
│ ├────────┼────────┼────┼────┼────┼────┤ │
│ │ Prod A │ Prod B │85% │2.3 │0.05│ ✓  │ │
│ │ Prod A │ Prod C │72% │1.8 │0.03│ ✓  │ │
│ │ Prod B │ Prod D │68% │1.5 │0.02│ ✓  │ │
│ └────────┴────────┴────┴────┴────┴────┘ │
│                                           │
│ [Pagination]                              │
└───────────────────────────────────────────┘
```

### List Display Fields

| Field | Display | Sortable | Filterable |
|-------|---------|----------|------------|
| source_product | Product name (link) | Yes | Yes |
| target_product | Product name (link) | Yes | Yes |
| confidence | Percentage (85%) | Yes | Yes |
| lift | Float with color | Yes | Yes |
| support | Float value | Yes | No |
| is_active | Boolean icon | Yes | Yes |
| trained_at | Date/time | Yes | Yes |

### Custom Actions

| Action Name | Description | Permissions |
|-------------|-------------|-------------|
| activate_recommendations | Set is_active=True | Admin |
| deactivate_recommendations | Set is_active=False | Admin |
| trigger_fbt_training | Launch training task | Admin |
| export_to_csv | Export recommendations | Staff |

### Metric Display Fields

| Metric | Calculation | Display |
|--------|-------------|---------|
| Total Recommendations | Count all FBT | 1,234 |
| Active Recommendations | Count active | 987 (80%) |
| Average Confidence | Mean confidence | 73.5% |
| Last Training | Max trained_at | 2 hours ago |
| Recommendation Coverage | Products with FBT | 456 / 500 (91%) |

### Color Coding for Metrics

| Metric | Range | Color |
|--------|-------|-------|
| Confidence | > 80% | Green |
| Confidence | 60-80% | Yellow |
| Confidence | < 60% | Red |
| Lift | > 2.0 | Green |
| Lift | 1.5-2.0 | Yellow |
| Lift | < 1.5 | Red |

### Custom Admin Views Structure

```
Admin Menu:
├── Recommendations
│   ├── FBT Recommendations (List)
│   ├── FBT Dashboard (Custom View)
│   ├── Training History (Custom View)
│   └── Performance Metrics (Custom View)
```

### Training Trigger Action Flow

```
1. Admin selects "Trigger FBT Training" action
2. Confirmation dialog appears
3. Admin confirms action
4. train_fbt_task dispatched to Celery
5. Success message displayed
6. Redirect to admin list view
7. Training runs in background
```

### Expected Outcome
- Functional admin interface for FBT
- List view with relevant fields
- Filters and search capability
- Custom actions for management
- Training trigger functionality
- Metrics dashboard

### Verification Checklist
- [ ] `backend/apps/ai/recommendations/admin/fbt_admin.py` created
- [ ] FBTRecommendationAdmin class defined
- [ ] List display fields configured
- [ ] List filters added (is_active, confidence, date)
- [ ] Search fields configured (product SKU, name)
- [ ] Custom display methods implemented
- [ ] Activate/deactivate actions created
- [ ] Trigger training action implemented
- [ ] Fieldsets organized for detail view
- [ ] Custom admin views created (optional)
- [ ] Metrics display implemented
- [ ] Color coding for metrics
- [ ] Permissions configured
- [ ] Admin registered with Django admin
- [ ] Interface tested in browser

---

## Task 34: Verify FBT

### Overview
Perform comprehensive verification and testing of the complete FBT (Frequently Bought Together) system. This final task ensures all components work together correctly, validates data flow from training to retrieval, tests cache behavior, confirms scheduled tasks execute properly, and verifies the admin interface functions as expected.

### Dependencies
- Task 33: Create FBT Admin
- All previous tasks in Group-B

### Instructions

1. **Verify development environment setup**
   - Confirm Django development server running
   - Verify Celery workers running
   - Verify Celery Beat scheduler running
   - Verify Redis server running and accessible
   - Check database connectivity

2. **Prepare test data**
   - Ensure sufficient order data exists (minimum 50 orders)
   - Verify orders have multiple products per order
   - Create test tenant if using multi-tenancy
   - Populate with realistic product catalog
   - Verify data meets minimum requirements

3. **Test manual training execution**
   - Open Django shell or create test script
   - Import FBTService
   - Create service instance with test tenant
   - Call train method manually
   - Verify training completes without errors
   - Review training summary output

4. **Verify recommendation storage**
   - After training, query Recommendation model
   - Filter by type="FBT" and test tenant
   - Verify recommendations exist
   - Check confidence, lift, support values
   - Confirm is_active=True
   - Verify trained_at timestamp set

5. **Test recommendation retrieval**
   - Call FBTService.get_fbt method
   - Provide product_id with known recommendations
   - Verify returns expected recommendations
   - Check recommendation format (product details + scores)
   - Verify limit parameter works
   - Test with product having no recommendations

6. **Verify cache behavior**
   - First call to get_fbt should query database
   - Check Redis for cache key (fbt:{tenant}:{product})
   - Second call should hit cache (faster response)
   - Verify cached data structure
   - Check TTL is set correctly (24 hours)
   - Test force_refresh parameter bypasses cache

7. **Test cache invalidation**
   - Call invalidate_fbt_cache for specific product
   - Verify Redis key deleted
   - Call invalidate_fbt_cache for entire tenant
   - Verify all tenant FBT keys deleted
   - Confirm next get_fbt query hits database

8. **Test Celery task execution**
   - Import train_fbt_task
   - Call task.delay(tenant_id) to queue task
   - Monitor Celery worker logs
   - Verify task executes successfully
   - Check task result in Celery backend
   - Confirm recommendations updated

9. **Verify scheduled training**
   - Check Celery Beat schedule configuration
   - Confirm schedule entry exists for FBT training
   - Optionally trigger schedule manually for testing
   - Review coordinator task (train_all_tenants_fbt)
   - Verify it dispatches tasks for all tenants

10. **Test admin interface**
    - Log in to Django admin
    - Navigate to FBT Recommendations section
    - Verify list view displays correctly
    - Test filters (is_active, confidence, date)
    - Test search by product name/SKU
    - Test custom actions (activate, deactivate)
    - Test training trigger action

11. **Verify admin training trigger**
    - In admin, select "Trigger FBT Training" action
    - Confirm action in dialog
    - Verify task queued in Celery
    - Monitor training execution
    - Refresh admin list to see updated recommendations

12. **Test edge cases**
    - Product with no purchase history
    - Product only purchased alone (no FBT)
    - New product added after training
    - Tenant with insufficient data
    - Very high confidence threshold (no results)
    - Cache unavailable (Redis down)

13. **Performance testing**
    - Measure get_fbt response time (cache hit)
    - Measure get_fbt response time (cache miss)
    - Verify cache hit < 10ms
    - Verify database query < 100ms
    - Test with concurrent requests

14. **Error handling verification**
    - Test with invalid product_id
    - Test with invalid tenant_id
    - Test with Redis unavailable
    - Test with database connection error
    - Verify graceful error handling

15. **Integration testing**
    - Create end-to-end test scenario
    - Train model → Store recommendations → Retrieve via API
    - Simulate typical user flow
    - Verify data consistency throughout
    - Check logs for errors or warnings

16. **Review logs**
    - Check application logs for errors
    - Review Celery worker logs
    - Review Celery Beat logs
    - Verify appropriate logging levels
    - Ensure no sensitive data in logs

17. **Documentation review**
    - Verify all code has docstrings
    - Check inline comments for clarity
    - Ensure README includes FBT setup instructions
    - Document any configuration requirements
    - Update API documentation if applicable

18. **Create verification report**
    - Document all tests performed
    - Note any issues found and resolutions
    - List performance metrics
    - Summarize system capabilities
    - Provide sign-off checklist

### Verification Test Cases

| Test Case | Expected Result |
|-----------|----------------|
| Manual training | Completes, recommendations stored |
| get_fbt with cache hit | Returns in < 10ms |
| get_fbt with cache miss | Returns in < 100ms, caches result |
| Cache invalidation | Keys deleted, next query hits DB |
| Celery task | Executes successfully |
| Scheduled task | Triggers at configured time |
| Admin list view | Displays recommendations |
| Admin training trigger | Queues training task |
| Invalid product_id | Returns empty list gracefully |
| Redis unavailable | Falls back to database |

### Performance Benchmarks

| Operation | Target | Acceptable | Critical |
|-----------|--------|------------|----------|
| Training (1000 orders) | < 30s | < 60s | < 120s |
| get_fbt (cache hit) | < 5ms | < 10ms | < 20ms |
| get_fbt (cache miss) | < 50ms | < 100ms | < 200ms |
| Cache storage | < 2ms | < 5ms | < 10ms |
| Cache invalidation | < 10ms | < 20ms | < 50ms |

### Integration Test Scenario

```
1. Prepare Test Data
   └── Create 100 orders with 2-5 products each

2. Execute Training
   └── Call FBTService.train()
   └── Verify 50+ recommendations created

3. Retrieve Recommendations
   └── Call get_fbt for 5 different products
   └── Verify cache populated

4. Cache Verification
   └── Check Redis for cache keys
   └── Verify TTL set correctly

5. Invalidation Test
   └── Invalidate cache
   └── Verify next retrieval hits database

6. Scheduled Training
   └── Trigger scheduled task
   └── Verify recommendations updated

7. Admin Verification
   └── View recommendations in admin
   └── Test filters and actions
```

### Verification Checklist

**Data Preparation:**
- [ ] Sufficient order data exists
- [ ] Multiple products per order
- [ ] Test tenant configured
- [ ] Product catalog populated

**Training:**
- [ ] Manual training executes successfully
- [ ] Training summary returned
- [ ] Recommendations stored in database
- [ ] Metrics (confidence, lift) calculated correctly

**Retrieval:**
- [ ] get_fbt returns recommendations
- [ ] Product details included
- [ ] Scores included (confidence, lift, support)
- [ ] Limit parameter works
- [ ] Empty results handled gracefully

**Caching:**
- [ ] First call caches results
- [ ] Second call hits cache
- [ ] Cache key format correct
- [ ] TTL set to 24 hours
- [ ] force_refresh bypasses cache
- [ ] Invalidation clears cache

**Celery Tasks:**
- [ ] train_fbt_task executes
- [ ] Task result stored
- [ ] Coordinator task dispatches to tenants
- [ ] Scheduled training configured
- [ ] Schedule triggers correctly

**Admin Interface:**
- [ ] List view displays recommendations
- [ ] Filters work (is_active, confidence)
- [ ] Search by product works
- [ ] Custom actions function
- [ ] Training trigger queues task
- [ ] Metrics displayed correctly

**Error Handling:**
- [ ] Invalid inputs handled gracefully
- [ ] Redis unavailable handled
- [ ] Database errors handled
- [ ] Logging appropriate

**Performance:**
- [ ] Cache hit < 10ms
- [ ] Database query < 100ms
- [ ] Training completes in reasonable time
- [ ] No memory issues with large datasets

**Documentation:**
- [ ] Code documented with docstrings
- [ ] Configuration documented
- [ ] README updated
- [ ] API documentation updated (if applicable)

**Final Sign-off:**
- [ ] All components functioning
- [ ] Integration tested end-to-end
- [ ] Performance acceptable
- [ ] No critical errors
- [ ] Ready for production deployment

### Expected Outcome
- Complete FBT system verified and operational
- All components tested individually and integrated
- Performance meets benchmarks
- Error handling robust
- Admin interface functional
- Documentation complete

### Verification Report Template

```
FBT System Verification Report
Date: [Date]
Tester: [Name]
Environment: [Development/Staging]

1. Component Tests:
   - Training: [Pass/Fail]
   - Retrieval: [Pass/Fail]
   - Caching: [Pass/Fail]
   - Tasks: [Pass/Fail]
   - Admin: [Pass/Fail]

2. Performance Metrics:
   - Training Time: [X seconds]
   - Cache Hit Time: [X ms]
   - Cache Miss Time: [X ms]

3. Issues Found:
   - [List any issues]

4. Resolutions:
   - [List resolutions]

5. Recommendations:
   - [Any suggestions]

6. Sign-off:
   Status: [Ready/Not Ready for Production]
   Signature: [Name]
```

---

## Summary

This document established the FBT service layer, caching infrastructure, scheduled training, and admin interface. These components complete the Frequently Bought Together recommendation system.

### Completed Tasks
1. ✓ Created FBTService for orchestrating FBT operations
2. ✓ Implemented train method for model training pipeline
3. ✓ Implemented get_fbt method with cache-first retrieval
4. ✓ Created store_recommendations for persisting rules
5. ✓ Created FBTTrainingTask for asynchronous training
6. ✓ Configured daily schedule for automated training
7. ✓ Designed FBT cache structure and utilities
8. ✓ Implemented cache_fbt method for storing results
9. ✓ Created admin interface for monitoring and management
10. ✓ Verified complete FBT system functionality

### Next Steps
Proceed to [Group-C_Similar-Products](../Group-C_Similar-Products/) to implement content-based filtering for similar product recommendations.
