# Tasks 17-24: Basket Analysis and Apriori Algorithm

> **Phase:** 10 - AI Features & Advanced Capabilities  
> **SubPhase:** 02 - Product Recommendations  
> **Group:** B - Frequently Bought Together  
> **Document:** 01 of 02  
> **Tasks Covered:** 17, 18, 19, 20, 21, 22, 23, 24

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-25-34_FBT-Service-Cache.md](02_Tasks-25-34_FBT-Service-Cache.md)

---

## Document Overview

This document covers the implementation of the Apriori algorithm for Frequently Bought Together (FBT) recommendations. It establishes the market basket analysis infrastructure, including transaction extraction from orders, data encoding for Apriori input, model training with frequent itemset discovery, association rule generation, and configurable support/confidence thresholds.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 17 | Create BasketAnalyzer | Medium | 45 min |
| 18 | Create get_transactions | Medium | 40 min |
| 19 | Create encode_transactions | Medium | 45 min |
| 20 | Create AprioriTrainer | High | 90 min |
| 21 | Create find_frequent_itemsets | Medium | 40 min |
| 22 | Create generate_rules | Medium | 40 min |
| 23 | Create min_support Setting | Low | 15 min |
| 24 | Create min_confidence Setting | Low | 15 min |

---

## Task 17: Create BasketAnalyzer

### Overview
Create the BasketAnalyzer class responsible for analyzing order baskets to identify product purchase patterns. This class serves as the foundation for market basket analysis, providing methods to extract and process transaction data from completed orders. It interfaces with the Order and OrderItem models to gather historical purchase data for Apriori algorithm training.

### Dependencies
- Task 16: Create ModelTrainer (from Group-A)
- Order and OrderItem models from ERP modules
- Django ORM query interface

### Instructions

1. **Create the analyzer file**
   - Navigate to `backend/apps/ai/recommendations/algorithms/` directory
   - Create new file named `apriori.py`
   - This file contains all Apriori-related classes and functions

2. **Import required dependencies**
   - Import Django model utilities (QuerySet, Q)
   - Import pandas for data manipulation
   - Import mlxtend library components (apriori, association_rules)
   - Import Order and OrderItem models from ERP
   - Import logging utilities for debugging
   - Import typing hints for code clarity

3. **Define BasketAnalyzer class**
   - Create class named `BasketAnalyzer`
   - Initialize with optional tenant parameter
   - Set up logging for analysis operations
   - Store tenant context for multi-tenant filtering

4. **Implement initialization method**
   - Accept tenant parameter (optional for single-tenant scenarios)
   - Set up class attributes for data storage
   - Initialize logger with class name
   - Store tenant reference for query filtering

5. **Add tenant filtering support**
   - Create helper method to filter queries by tenant
   - Apply tenant filter when tenant is provided
   - Support both single-tenant and multi-tenant deployments
   - Handle schema-based multi-tenancy correctly

6. **Create query optimization helpers**
   - Define method to prefetch related order items
   - Use select_related for foreign key optimization
   - Apply prefetch_related for many-to-many relationships
   - Minimize database queries for large datasets

7. **Implement data validation**
   - Add method to validate order data quality
   - Check for null or invalid product references
   - Ensure order status indicates completion
   - Filter out cancelled or returned orders

### BasketAnalyzer Class Structure

```
BasketAnalyzer
├── __init__(tenant)
│   ├── Store tenant context
│   ├── Initialize logger
│   └── Set up data attributes
│
├── _filter_by_tenant(queryset)
│   ├── Apply tenant filter if provided
│   └── Return filtered queryset
│
├── _optimize_query(queryset)
│   ├── Add select_related for FKs
│   ├── Add prefetch_related for M2M
│   └── Return optimized queryset
│
└── _validate_orders(orders)
    ├── Check order completion status
    ├── Validate product references
    └── Return validated orders
```

### Data Flow Architecture

```
┌─────────────────────────────────────────────┐
│          BasketAnalyzer                     │
│                                             │
│  ┌─────────────────────────────────┐       │
│  │   Order Database Query          │       │
│  │   - Filter by tenant            │       │
│  │   - Filter by status            │       │
│  │   - Optimize with prefetch      │       │
│  └─────────────┬───────────────────┘       │
│                │                             │
│                ▼                             │
│  ┌─────────────────────────────────┐       │
│  │   Data Validation               │       │
│  │   - Check completion status     │       │
│  │   - Validate products           │       │
│  │   - Remove invalid entries      │       │
│  └─────────────┬───────────────────┘       │
│                │                             │
│                ▼                             │
│  ┌─────────────────────────────────┐       │
│  │   Transaction Extraction        │       │
│  │   (Handled by get_transactions) │       │
│  └─────────────────────────────────┘       │
└─────────────────────────────────────────────┘
```

### Multi-Tenancy Considerations

| Aspect | Implementation |
|--------|----------------|
| Tenant Context | Store tenant reference in __init__ |
| Query Filtering | Apply schema filter to all queries |
| Data Isolation | Ensure no cross-tenant data leakage |
| Schema Switching | Use django-tenants automatic switching |

### Order Filtering Criteria

| Filter | Purpose | Implementation |
|--------|---------|----------------|
| Order Status | Only completed orders | `status='COMPLETED'` |
| Date Range | Recent transactions for relevance | `created_at__gte=start_date` |
| Minimum Items | Orders with 2+ items | `items__count__gte=2` |
| Valid Products | Exclude deleted/inactive products | `items__product__active=True` |

### Query Optimization Strategy

| Optimization | Query Method | Benefit |
|--------------|--------------|---------|
| Prefetch Items | `prefetch_related('items')` | Reduce N+1 queries |
| Product Details | `select_related('items__product')` | Single JOIN query |
| Batch Size | `iterator(chunk_size=1000)` | Memory efficiency |
| Query Caching | Store frequently used queries | Performance boost |

### Expected Outcome
- Functional BasketAnalyzer class initialized with tenant context
- Query filtering and optimization helpers implemented
- Data validation methods ready for transaction extraction
- Foundation for market basket analysis established
- Multi-tenant support properly configured

### Verification Checklist
- [ ] `backend/apps/ai/recommendations/algorithms/apriori.py` file created
- [ ] BasketAnalyzer class defined with __init__ method
- [ ] Tenant filtering helper implemented
- [ ] Query optimization methods created
- [ ] Order validation logic implemented
- [ ] Multi-tenancy support configured
- [ ] Logging initialized for debugging
- [ ] All imports resolved correctly

---

## Task 18: Create get_transactions

### Overview
Implement the `get_transactions` method in BasketAnalyzer to extract product ID lists from completed orders. This method transforms order data into the transaction format required by the Apriori algorithm: a list of lists where each inner list contains product IDs purchased together in a single order.

### Dependencies
- Task 17: Create BasketAnalyzer

### Instructions

1. **Define method signature**
   - Add method `get_transactions` to BasketAnalyzer class
   - Accept optional date range parameters (start_date, end_date)
   - Accept optional minimum items per transaction parameter
   - Return list of product ID lists

2. **Build initial query**
   - Query Order model for completed orders
   - Apply tenant filtering using helper method
   - Filter by date range if provided
   - Order by creation date for chronological processing

3. **Apply order filters**
   - Filter for COMPLETED order status only
   - Exclude cancelled and refunded orders
   - Exclude orders with only one item (no basket)
   - Apply minimum items filter if specified

4. **Optimize database query**
   - Use prefetch_related for order items
   - Use select_related for product details
   - Apply iterator for large datasets
   - Set appropriate chunk size for memory management

5. **Extract product IDs from orders**
   - Iterate through filtered orders
   - For each order, extract order items
   - Collect product IDs from each item
   - Store as list of product ID integers

6. **Handle data quality issues**
   - Skip orders with no valid items
   - Skip items with null or invalid product references
   - Skip items for inactive/deleted products
   - Log warnings for skipped data

7. **Format transaction data**
   - Create list of lists structure
   - Each inner list represents one order (transaction)
   - Each inner list contains product IDs only
   - Remove duplicate product IDs within same order

8. **Add data statistics logging**
   - Log total number of orders processed
   - Log total number of transactions extracted
   - Log average items per transaction
   - Log any data quality issues encountered

### Transaction Extraction Flow

```
Order Database Query
         │
         ▼
┌────────────────────┐
│  Filter Orders     │
│  - COMPLETED       │
│  - Date range      │
│  - Min items: 2+   │
│  - Active tenant   │
└────────┬───────────┘
         │
         ▼
┌────────────────────┐
│  Optimize Query    │
│  - prefetch items  │
│  - select products │
│  - use iterator    │
└────────┬───────────┘
         │
         ▼
┌────────────────────┐
│  Extract Items     │
│  For each order:   │
│  - Get order items │
│  - Get product IDs │
│  - Create ID list  │
└────────┬───────────┘
         │
         ▼
┌────────────────────┐
│  Validate & Clean  │
│  - Remove nulls    │
│  - Remove dupes    │
│  - Check min items │
└────────┬───────────┘
         │
         ▼
Transaction List Output
[[P1, P2], [P1, P3, P4], [P2, P4]]
```

### Transaction Format Example

| Order ID | Product IDs | Transaction Format |
|----------|-------------|-------------------|
| 1001 | P123, P456 | [123, 456] |
| 1002 | P123, P789, P456 | [123, 789, 456] |
| 1003 | P456, P789 | [456, 789] |
| 1004 | P123 | Excluded (only 1 item) |

**Result:** `[[123, 456], [123, 789, 456], [456, 789]]`

### Query Filtering Parameters

| Parameter | Type | Default | Purpose |
|-----------|------|---------|---------|
| start_date | datetime | 6 months ago | Limit historical data |
| end_date | datetime | now | Upper date boundary |
| min_items | int | 2 | Minimum basket size |
| max_transactions | int | None | Limit for performance |

### Data Quality Checks

| Check | Action | Reason |
|-------|--------|--------|
| Null product_id | Skip item | Invalid data |
| Inactive product | Skip item | Product no longer available |
| Empty transaction | Skip order | No valid items |
| Single-item order | Skip order | No basket pattern |
| Duplicate products | Keep once | Customer bought quantity > 1 |

### Performance Optimization

```
Small Dataset (< 10K orders)
├── Load all: No iterator needed
├── Memory: Minimal impact
└── Speed: Fast processing

Medium Dataset (10K - 100K orders)
├── Use iterator: chunk_size=1000
├── Memory: Controlled usage
└── Speed: Good balance

Large Dataset (> 100K orders)
├── Use iterator: chunk_size=500
├── Apply date limits: Last 6-12 months
├── Memory: Efficient handling
└── Speed: Acceptable with optimization
```

### Expected Outcome
- Functional get_transactions method extracting product ID lists
- Proper order filtering for completed transactions only
- Optimized database queries with prefetching
- Clean transaction data in list-of-lists format
- Data quality validation and error handling
- Performance suitable for large order datasets

### Verification Checklist
- [ ] get_transactions method implemented in BasketAnalyzer
- [ ] Query filters for COMPLETED orders only
- [ ] Date range filtering supported
- [ ] Minimum items per transaction enforced
- [ ] Database query optimization applied
- [ ] Product ID extraction logic implemented
- [ ] Duplicate product removal within transactions
- [ ] Data quality checks and logging added
- [ ] Transaction format matches Apriori requirements
- [ ] Method returns list of product ID lists

---

## Task 19: Create encode_transactions

### Overview
Implement the `encode_transactions` method to transform transaction lists into one-hot encoded format required by the mlxtend Apriori algorithm. This method converts the list-of-lists transaction format into a pandas DataFrame where each row represents a transaction and each column represents a product, with binary values indicating product presence.

### Dependencies
- Task 18: Create get_transactions

### Instructions

1. **Define method signature**
   - Add method `encode_transactions` to BasketAnalyzer class
   - Accept transactions parameter (list of product ID lists)
   - Return pandas DataFrame with one-hot encoding
   - Include error handling for empty transactions

2. **Extract unique products**
   - Flatten transaction lists to get all product IDs
   - Create set of unique product IDs across all transactions
   - Sort product IDs for consistent column ordering
   - Store as ordered list for DataFrame columns

3. **Initialize DataFrame structure**
   - Create empty pandas DataFrame
   - Set columns as unique product IDs
   - Set data type as boolean for memory efficiency
   - Prepare to add transaction rows

4. **Encode transactions**
   - Iterate through each transaction
   - For each transaction, create binary row
   - Set column to True if product in transaction
   - Set column to False if product not in transaction
   - Append row to DataFrame

5. **Optimize encoding process**
   - Use vectorized operations when possible
   - Consider using TransactionEncoder from mlxtend
   - Batch process for large transaction sets
   - Monitor memory usage during encoding

6. **Add data validation**
   - Check for empty transaction list
   - Validate DataFrame structure after encoding
   - Ensure no null values in encoded data
   - Verify boolean data type

7. **Implement alternative encoding method**
   - Use mlxtend's TransactionEncoder class
   - This provides optimized one-hot encoding
   - Automatically handles product ID to column mapping
   - Returns properly formatted DataFrame

8. **Add logging and statistics**
   - Log number of transactions encoded
   - Log number of unique products
   - Log DataFrame shape and memory usage
   - Log encoding time for performance monitoring

### Encoding Process Flow

```
Transaction List Input
[[P1, P2], [P1, P3, P4], [P2, P4]]
         │
         ▼
┌────────────────────┐
│  Extract Unique    │
│  Products          │
│  {P1, P2, P3, P4}  │
└────────┬───────────┘
         │
         ▼
┌────────────────────┐
│  Create DataFrame  │
│  Columns: P1-P4    │
│  Rows: Empty       │
└────────┬───────────┘
         │
         ▼
┌────────────────────┐
│  Encode Each       │
│  Transaction       │
│  Row 1: [T,T,F,F]  │
│  Row 2: [T,F,T,T]  │
│  Row 3: [F,T,F,T]  │
└────────┬───────────┘
         │
         ▼
One-Hot Encoded DataFrame
```

### Encoded DataFrame Structure

**Input Transactions:**
```
[
  [123, 456],
  [123, 789, 456],
  [456, 789]
]
```

**Output DataFrame:**

| Transaction | P123 | P456 | P789 |
|-------------|------|------|------|
| 0 | True | True | False |
| 1 | True | True | True |
| 2 | False | True | True |

### Encoding Methods Comparison

| Method | Approach | Performance | Memory | Recommended |
|--------|----------|-------------|--------|-------------|
| Manual Loop | Iterate and encode | Slow | High | No |
| Vectorized | NumPy operations | Fast | Medium | Yes |
| TransactionEncoder | mlxtend utility | Fastest | Low | Yes (Best) |

### TransactionEncoder Usage

```
Encoding Process
         │
         ▼
┌─────────────────────────────┐
│  from mlxtend.preprocessing │
│  import TransactionEncoder  │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│  te = TransactionEncoder()  │
│  te_ary = te.fit(trans).    │
│           transform(trans)  │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│  df = pd.DataFrame(te_ary,  │
│       columns=te.columns_)  │
└──────────────┬──────────────┘
               │
               ▼
        Encoded DataFrame
```

### Data Type Optimization

| Data Type | Memory per Value | Suitable For |
|-----------|------------------|--------------|
| object | 8+ bytes | Not recommended |
| int8 | 1 byte | Small datasets |
| bool | 1 bit (packed) | Large datasets (Best) |
| float32 | 4 bytes | Not needed here |

### Memory Considerations

```
Small Dataset
├── Transactions: < 1,000
├── Products: < 100
├── Memory: < 100 KB
└── Method: Any encoding works

Medium Dataset
├── Transactions: 1,000 - 50,000
├── Products: 100 - 1,000
├── Memory: 100 KB - 50 MB
└── Method: Use TransactionEncoder

Large Dataset
├── Transactions: > 50,000
├── Products: > 1,000
├── Memory: > 50 MB
└── Method: TransactionEncoder + chunking
```

### Error Handling

| Error Condition | Handling Strategy |
|----------------|-------------------|
| Empty transaction list | Return empty DataFrame |
| Single product in all transactions | Log warning, proceed |
| Memory error | Reduce batch size, log error |
| Invalid product ID type | Convert to string, log warning |

### Expected Outcome
- Functional encode_transactions method for one-hot encoding
- Pandas DataFrame with boolean values for product presence
- Proper column naming with product IDs
- Optimized encoding using TransactionEncoder
- Memory-efficient data types (boolean)
- Error handling for edge cases
- Performance suitable for large transaction sets

### Verification Checklist
- [ ] encode_transactions method implemented
- [ ] TransactionEncoder from mlxtend imported
- [ ] Method accepts transaction list parameter
- [ ] One-hot encoding produces boolean DataFrame
- [ ] Unique products extracted correctly
- [ ] DataFrame columns represent product IDs
- [ ] DataFrame rows represent transactions
- [ ] Empty transaction handling implemented
- [ ] Memory-efficient data types used
- [ ] Logging for statistics added

---

## Task 20: Create AprioriTrainer

### Overview
Implement the AprioriTrainer class that extends ModelTrainer to handle Apriori algorithm training for Frequently Bought Together recommendations. This trainer orchestrates the entire training pipeline: fetching transactions, encoding data, finding frequent itemsets, generating association rules, and storing results for real-time recommendations.

### Dependencies
- Task 19: Create encode_transactions
- Task 16: Create ModelTrainer (from Group-A)

### Instructions

1. **Define AprioriTrainer class**
   - Create class that inherits from ModelTrainer
   - Override necessary methods for Apriori-specific logic
   - Initialize with tenant context and model type
   - Set model_type to 'apriori' or 'fbt'

2. **Implement initialization method**
   - Call parent ModelTrainer.__init__
   - Initialize BasketAnalyzer instance
   - Set default hyperparameters (min_support, min_confidence)
   - Store tenant reference for data isolation

3. **Override prepare_data method**
   - Fetch transactions using BasketAnalyzer.get_transactions
   - Encode transactions to one-hot format
   - Validate encoded data structure
   - Return encoded DataFrame ready for Apriori
   - Log data preparation statistics

4. **Override train_model method**
   - Accept encoded transaction DataFrame
   - Call find_frequent_itemsets (Task 21)
   - Call generate_rules (Task 22)
   - Store rules and itemsets for later use
   - Log training completion and metrics

5. **Implement model storage**
   - Store frequent itemsets DataFrame
   - Store association rules DataFrame
   - Store as serialized format (pickle or JSON)
   - Create model record in database
   - Store training metadata (support, confidence, metrics)

6. **Implement evaluate_model method**
   - Calculate rule quality metrics (lift, leverage)
   - Compute coverage (% of products in rules)
   - Calculate average confidence and support
   - Log evaluation metrics
   - Return metrics dictionary

7. **Add hyperparameter configuration**
   - Accept min_support from settings or parameter
   - Accept min_confidence from settings or parameter
   - Validate hyperparameter ranges
   - Log hyperparameters used in training

8. **Implement model versioning**
   - Create new version on each training run
   - Store previous model as backup
   - Track model performance over time
   - Support rollback to previous version

9. **Add error handling**
   - Handle insufficient transaction data
   - Handle no frequent itemsets found
   - Handle no rules generated
   - Provide meaningful error messages

10. **Implement training pipeline method**
    - Create end-to-end training method
    - Execute: fetch → encode → itemsets → rules → store
    - Log progress at each step
    - Return training results summary

### AprioriTrainer Class Structure

```
AprioriTrainer (extends ModelTrainer)
├── __init__(tenant, model_type)
│   ├── Call parent init
│   ├── Initialize BasketAnalyzer
│   └── Set default hyperparameters
│
├── prepare_data()
│   ├── Get transactions
│   ├── Encode transactions
│   ├── Validate encoded data
│   └── Return DataFrame
│
├── train_model(encoded_df)
│   ├── Find frequent itemsets
│   ├── Generate association rules
│   ├── Store results
│   └── Return training status
│
├── evaluate_model()
│   ├── Calculate quality metrics
│   ├── Compute coverage
│   └── Return metrics dict
│
├── save_model(itemsets, rules)
│   ├── Serialize data structures
│   ├── Create database record
│   └── Store metadata
│
├── load_model()
│   ├── Retrieve from database
│   ├── Deserialize structures
│   └── Return itemsets & rules
│
└── train_pipeline()
    ├── Execute full workflow
    ├── Log each step
    └── Return summary
```

### Training Pipeline Flow

```
┌─────────────────────────────────────────┐
│        AprioriTrainer.train_pipeline()  │
│                                         │
│  Step 1: Prepare Data                  │
│  ┌───────────────────────────────┐     │
│  │ BasketAnalyzer.get_transactions│     │
│  │ Returns: [[P1,P2], [P1,P3]]   │     │
│  └────────────┬──────────────────┘     │
│               │                         │
│               ▼                         │
│  ┌───────────────────────────────┐     │
│  │ BasketAnalyzer.encode()       │     │
│  │ Returns: One-hot DataFrame    │     │
│  └────────────┬──────────────────┘     │
│               │                         │
│               ▼                         │
│  Step 2: Find Frequent Itemsets        │
│  ┌───────────────────────────────┐     │
│  │ find_frequent_itemsets()      │     │
│  │ Uses: mlxtend.apriori()       │     │
│  │ Returns: Itemsets DataFrame   │     │
│  └────────────┬──────────────────┘     │
│               │                         │
│               ▼                         │
│  Step 3: Generate Rules                │
│  ┌───────────────────────────────┐     │
│  │ generate_rules()              │     │
│  │ Uses: association_rules()     │     │
│  │ Returns: Rules DataFrame      │     │
│  └────────────┬──────────────────┘     │
│               │                         │
│               ▼                         │
│  Step 4: Store Model                   │
│  ┌───────────────────────────────┐     │
│  │ save_model()                  │     │
│  │ - Serialize DataFrames        │     │
│  │ - Create DB record            │     │
│  │ - Store metadata              │     │
│  └───────────────────────────────┘     │
└─────────────────────────────────────────┘
```

### Hyperparameter Configuration

| Parameter | Type | Default | Range | Purpose |
|-----------|------|---------|-------|---------|
| min_support | float | 0.01 | 0.001-0.1 | Minimum itemset frequency |
| min_confidence | float | 0.3 | 0.1-0.9 | Minimum rule confidence |
| max_len | int | None | 2-10 | Maximum itemset size |
| date_range | int (days) | 180 | 30-365 | Historical data window |

### Model Evaluation Metrics

| Metric | Formula | Purpose | Good Value |
|--------|---------|---------|------------|
| Support | freq(A,B) / total | Item frequency | > 0.01 |
| Confidence | freq(A,B) / freq(A) | Rule reliability | > 0.3 |
| Lift | confidence / freq(B) | Rule significance | > 1.0 |
| Conviction | (1-freq(B)) / (1-conf) | Rule strength | > 1.0 |
| Coverage | products_in_rules / total | Rule reach | > 0.5 |

### Model Storage Structure

```
RecommendationModel (Database)
├── id: UUID
├── tenant: ForeignKey
├── model_type: 'apriori'
├── version: Integer (auto-increment)
├── status: 'trained'
├── hyperparameters: JSON
│   ├── min_support: 0.01
│   └── min_confidence: 0.3
├── metrics: JSON
│   ├── num_itemsets: 150
│   ├── num_rules: 420
│   ├── avg_support: 0.025
│   ├── avg_confidence: 0.45
│   ├── avg_lift: 2.3
│   └── coverage: 0.67
├── model_data: Binary (pickled)
│   ├── frequent_itemsets: DataFrame
│   └── association_rules: DataFrame
├── trained_at: DateTime
└── is_active: Boolean
```

### Training Frequency Strategy

| Trigger | Condition | Action |
|---------|-----------|--------|
| Scheduled | Daily at 2 AM | Retrain if 100+ new orders |
| Manual | Admin request | Train immediately |
| Threshold | 500+ new orders | Trigger training job |
| Quality Drop | Recommendations CTR < 2% | Retrain with different params |

### Error Scenarios and Handling

| Error | Cause | Handling |
|-------|-------|----------|
| No transactions | Insufficient order data | Log warning, skip training |
| No frequent itemsets | min_support too high | Lower threshold, retry |
| No rules generated | min_confidence too high | Lower threshold, retry |
| Memory error | Too many transactions | Sample data, reduce date range |
| Database error | Connection/permission issue | Retry with backoff, alert admin |

### Training Performance Optimization

```
Small Store (< 100 orders/day)
├── Training: Once per week
├── Date range: 6 months
├── Performance: < 5 seconds
└── Resources: Minimal

Medium Store (100-1000 orders/day)
├── Training: Daily
├── Date range: 3 months
├── Performance: 30-60 seconds
└── Resources: Moderate

Large Store (> 1000 orders/day)
├── Training: Multiple times daily
├── Date range: 1 month
├── Performance: 2-5 minutes
├── Resources: Significant
└── Optimization: Background task, sampling
```

### Expected Outcome
- Fully functional AprioriTrainer class extending ModelTrainer
- Complete training pipeline from transactions to stored rules
- Proper hyperparameter configuration from settings
- Model evaluation with quality metrics
- Model versioning and storage in database
- Error handling for edge cases
- Performance optimization for large datasets
- Integration with Celery for background training

### Verification Checklist
- [ ] AprioriTrainer class defined extending ModelTrainer
- [ ] __init__ method initializes BasketAnalyzer
- [ ] prepare_data method fetches and encodes transactions
- [ ] train_model method finds itemsets and generates rules
- [ ] evaluate_model calculates quality metrics
- [ ] save_model stores DataFrames and metadata
- [ ] load_model retrieves and deserializes model
- [ ] train_pipeline orchestrates full workflow
- [ ] Hyperparameters configurable from settings
- [ ] Model versioning implemented
- [ ] Error handling for insufficient data
- [ ] Logging at each pipeline step
- [ ] Integration with RecommendationModel database

---

## Task 21: Create find_frequent_itemsets

### Overview
Implement the `find_frequent_itemsets` method that uses the mlxtend library's Apriori algorithm to discover frequent itemsets in the encoded transaction data. This method identifies product combinations that frequently appear together in orders, serving as the foundation for generating association rules.

### Dependencies
- Task 20: Create AprioriTrainer

### Instructions

1. **Define method signature**
   - Add method `find_frequent_itemsets` to AprioriTrainer class
   - Accept encoded_df parameter (pandas DataFrame)
   - Accept min_support parameter (default from settings)
   - Accept max_len parameter (optional, maximum itemset size)
   - Return pandas DataFrame with frequent itemsets

2. **Import Apriori function**
   - Import from mlxtend.frequent_patterns
   - Ensure mlxtend is in project dependencies
   - Import supporting utilities if needed

3. **Validate input data**
   - Check encoded_df is not empty
   - Verify DataFrame has boolean or binary values
   - Ensure DataFrame has at least 2 columns (products)
   - Check sufficient transactions for meaningful results

4. **Configure Apriori parameters**
   - Set min_support from parameter or settings
   - Set use_colnames=True to get product names/IDs
   - Set max_len if provided (limit itemset size)
   - Set low_memory=False for better performance on large data

5. **Execute Apriori algorithm**
   - Call mlxtend.frequent_patterns.apriori()
   - Pass encoded DataFrame as input
   - Pass configured parameters
   - Receive frequent itemsets DataFrame as output

6. **Process itemsets DataFrame**
   - DataFrame columns: 'support', 'itemsets'
   - 'itemsets' column contains frozensets of product IDs
   - 'support' column contains frequency values
   - Sort by support in descending order

7. **Add itemset size information**
   - Calculate length of each itemset
   - Add 'length' column to DataFrame
   - Useful for filtering by itemset size
   - Helps identify pairs, triplets, etc.

8. **Filter and validate results**
   - Remove itemsets with only 1 item (not useful for recommendations)
   - Validate support values are within expected range
   - Check minimum number of itemsets found
   - Log warning if very few itemsets discovered

9. **Add logging and statistics**
   - Log total number of frequent itemsets found
   - Log distribution by itemset size (pairs, triplets, etc.)
   - Log support range (min, max, average)
   - Log processing time

10. **Implement result caching**
    - Cache frequent itemsets for current session
    - Avoid recomputation during rule generation
    - Store as class attribute or in-memory cache

### Apriori Algorithm Flow

```
┌───────────────────────────────────────┐
│     One-Hot Encoded DataFrame         │
│   Transaction x Product Matrix        │
│   (Boolean values)                    │
└────────────────┬──────────────────────┘
                 │
                 ▼
┌───────────────────────────────────────┐
│   mlxtend.frequent_patterns.apriori() │
│   Parameters:                         │
│   - min_support: 0.01                 │
│   - use_colnames: True                │
│   - max_len: None                     │
└────────────────┬──────────────────────┘
                 │
                 ▼
┌───────────────────────────────────────┐
│      Frequent Itemsets DataFrame      │
│   Columns: support, itemsets          │
│   ┌─────────┬──────────────────┐     │
│   │ support │ itemsets         │     │
│   ├─────────┼──────────────────┤     │
│   │ 0.045   │ {P123, P456}     │     │
│   │ 0.032   │ {P123, P789}     │     │
│   │ 0.028   │ {P456, P789}     │     │
│   │ 0.015   │ {P123, P456,P789}│     │
│   └─────────┴──────────────────┘     │
└────────────────┬──────────────────────┘
                 │
                 ▼
┌───────────────────────────────────────┐
│   Add Length Column & Filter          │
│   - Calculate itemset size            │
│   - Remove single-item itemsets       │
│   - Sort by support descending        │
└────────────────┬──────────────────────┘
                 │
                 ▼
        Return Itemsets DataFrame
```

### Frequent Itemsets DataFrame Structure

| support | itemsets | length |
|---------|----------|--------|
| 0.045 | frozenset({123, 456}) | 2 |
| 0.032 | frozenset({123, 789}) | 2 |
| 0.028 | frozenset({456, 789}) | 2 |
| 0.022 | frozenset({123, 234, 456}) | 3 |
| 0.015 | frozenset({123, 456, 789}) | 3 |

### Support Threshold Guidelines

| min_support | Itemsets Found | Use Case |
|-------------|----------------|----------|
| 0.001 | Many (thousands) | Large stores, diverse products |
| 0.01 | Moderate (hundreds) | Medium stores, balanced |
| 0.05 | Few (tens) | Small stores, popular items only |
| 0.1 | Very few | Very popular combinations only |

### Itemset Size Distribution

```
Typical Distribution
┌────────────────────────────────┐
│  Size  │  Count  │  % Total   │
├────────┼─────────┼────────────┤
│   2    │   350   │   70%      │
│   3    │   120   │   24%      │
│   4    │    25   │    5%      │
│   5+   │     5   │    1%      │
└────────┴─────────┴────────────┘
```

### Apriori Algorithm Parameters

| Parameter | Type | Recommended | Effect |
|-----------|------|-------------|--------|
| min_support | float | 0.01 | Lower = more itemsets, slower |
| use_colnames | bool | True | Return product IDs not indices |
| max_len | int | None | Limit itemset size for performance |
| low_memory | bool | False | True for very large datasets |
| verbose | int | 0 | Set to 1 for progress updates |

### Performance Considerations

```
Dataset Size vs Processing Time
┌───────────────────────────────────────┐
│  Transactions  │  Products  │  Time   │
├────────────────┼────────────┼─────────┤
│     1,000      │     100    │  < 1s   │
│    10,000      │     500    │  2-5s   │
│    50,000      │   1,000    │ 10-30s  │
│   100,000      │   2,000    │ 1-3min  │
│   500,000+     │   5,000+   │ 5-15min │
└────────────────┴────────────┴─────────┘

Optimization Tips:
- Use min_support ≥ 0.01 for large datasets
- Set max_len to reduce computation
- Use low_memory=True for memory constraints
- Sample transactions if dataset too large
```

### Error Handling

| Condition | Error Type | Handling |
|-----------|------------|----------|
| Empty DataFrame | ValueError | Return empty itemsets, log warning |
| min_support too high | No itemsets | Lower threshold, retry, log |
| Memory error | MemoryError | Reduce data, increase min_support |
| Invalid data type | TypeError | Convert to boolean, log warning |

### Expected Outcome
- Functional find_frequent_itemsets method using mlxtend
- Pandas DataFrame with product combinations and support values
- Itemsets filtered to exclude single items
- Length column added for itemset size
- Proper sorting by support descending
- Logging for itemset statistics
- Performance optimized for large datasets
- Error handling for edge cases

### Verification Checklist
- [ ] find_frequent_itemsets method implemented
- [ ] mlxtend.frequent_patterns.apriori imported
- [ ] Method accepts encoded DataFrame parameter
- [ ] min_support parameter configurable
- [ ] max_len parameter supported
- [ ] Apriori algorithm executed correctly
- [ ] Itemsets DataFrame returned with support and itemsets columns
- [ ] Single-item itemsets filtered out
- [ ] Length column added to DataFrame
- [ ] Results sorted by support descending
- [ ] Logging for statistics implemented
- [ ] Error handling for empty results

---

## Task 22: Create generate_rules

### Overview
Implement the `generate_rules` method that generates association rules from frequent itemsets using mlxtend's association_rules function. This method creates rules in the format "if customer buys A, they will also buy B" with confidence, lift, and other quality metrics, which directly power the Frequently Bought Together recommendations.

### Dependencies
- Task 21: Create find_frequent_itemsets

### Instructions

1. **Define method signature**
   - Add method `generate_rules` to AprioriTrainer class
   - Accept frequent_itemsets parameter (DataFrame from Task 21)
   - Accept min_confidence parameter (default from settings)
   - Accept metric parameter (default 'confidence')
   - Return pandas DataFrame with association rules

2. **Import association_rules function**
   - Import from mlxtend.frequent_patterns
   - Ensure consistent mlxtend version
   - Import supporting utilities

3. **Validate input itemsets**
   - Check frequent_itemsets DataFrame not empty
   - Verify required columns present (support, itemsets)
   - Ensure itemsets contain at least pairs (size ≥ 2)
   - Check sufficient itemsets for rule generation

4. **Configure rule generation parameters**
   - Set metric for rule filtering (confidence, lift, leverage)
   - Set min_threshold based on metric chosen
   - Set num_itemsets if limiting results
   - Configure support_only if needed

5. **Execute association_rules function**
   - Call mlxtend.frequent_patterns.association_rules()
   - Pass frequent_itemsets DataFrame as input
   - Pass metric and min_threshold parameters
   - Receive rules DataFrame as output

6. **Process rules DataFrame**
   - Columns include: antecedents, consequents, support, confidence, lift
   - Additional columns: leverage, conviction, zhangs_metric
   - Each row represents one association rule
   - Antecedents = "if customer buys these"
   - Consequents = "recommend these"

7. **Filter and refine rules**
   - Remove rules with single-product consequents if needed
   - Filter by minimum lift threshold (e.g., lift > 1.0)
   - Remove redundant or overlapping rules
   - Limit to top N rules by confidence or lift

8. **Add rule quality scoring**
   - Calculate composite quality score
   - Combine confidence, lift, support metrics
   - Rank rules by quality score
   - Useful for prioritizing recommendations

9. **Convert rule format for storage**
   - Convert frozensets to lists for JSON serialization
   - Create human-readable rule descriptions
   - Store product IDs as integers or strings
   - Prepare for database storage or caching

10. **Add logging and statistics**
    - Log total number of rules generated
    - Log metric distributions (confidence, lift ranges)
    - Log average rule quality metrics
    - Log processing time

### Association Rules Generation Flow

```
┌────────────────────────────────────────┐
│   Frequent Itemsets DataFrame          │
│   (from find_frequent_itemsets)        │
│   Contains product combinations         │
└──────────────┬─────────────────────────┘
               │
               ▼
┌────────────────────────────────────────┐
│  mlxtend.frequent_patterns.            │
│  association_rules()                   │
│  Parameters:                           │
│  - df: frequent_itemsets               │
│  - metric: 'confidence'                │
│  - min_threshold: 0.3                  │
└──────────────┬─────────────────────────┘
               │
               ▼
┌────────────────────────────────────────┐
│      Association Rules DataFrame        │
│  ┌───────────────┬──────────────┬─────┐│
│  │ antecedents   │ consequents  │conf ││
│  ├───────────────┼──────────────┼─────┤│
│  │ {P123}        │ {P456}       │0.45 ││
│  │ {P123}        │ {P789}       │0.38 ││
│  │ {P456}        │ {P789}       │0.42 ││
│  │ {P123, P456}  │ {P789}       │0.52 ││
│  └───────────────┴──────────────┴─────┘│
│  Additional columns: support, lift,    │
│  leverage, conviction                  │
└──────────────┬─────────────────────────┘
               │
               ▼
┌────────────────────────────────────────┐
│   Filter & Rank Rules                  │
│   - Filter by lift > 1.0               │
│   - Sort by confidence desc            │
│   - Limit to top N rules               │
│   - Convert frozensets to lists        │
└──────────────┬─────────────────────────┘
               │
               ▼
        Return Rules DataFrame
```

### Association Rules DataFrame Structure

| antecedents | consequents | support | confidence | lift | leverage | conviction |
|-------------|-------------|---------|------------|------|----------|------------|
| {123} | {456} | 0.045 | 0.45 | 2.1 | 0.023 | 1.65 |
| {123} | {789} | 0.032 | 0.38 | 1.8 | 0.015 | 1.48 |
| {456} | {789} | 0.028 | 0.42 | 1.9 | 0.018 | 1.58 |
| {123, 456} | {789} | 0.015 | 0.52 | 2.4 | 0.009 | 1.82 |

### Rule Quality Metrics Explained

| Metric | Formula | Meaning | Good Value |
|--------|---------|---------|------------|
| Support | P(A ∪ B) | How often rule occurs | > 0.01 |
| Confidence | P(B\|A) | How reliable is rule | > 0.3 |
| Lift | P(B\|A) / P(B) | How much better than random | > 1.0 |
| Leverage | P(A ∪ B) - P(A)×P(B) | Difference from independence | > 0 |
| Conviction | (1-P(B)) / (1-Conf) | Implication strength | > 1.0 |

### Rule Filtering Strategies

| Strategy | Filter Criteria | Result |
|----------|----------------|--------|
| Conservative | conf ≥ 0.5, lift ≥ 2.0 | Few high-quality rules |
| Balanced | conf ≥ 0.3, lift ≥ 1.5 | Moderate rules |
| Aggressive | conf ≥ 0.2, lift ≥ 1.2 | Many rules, lower quality |
| Custom | Use composite score | Optimized for use case |

### Rule Interpretation Example

**Rule:** `{Product A} → {Product B}`
- **Antecedents:** {Product A} = Customer bought Product A
- **Consequents:** {Product B} = Recommend Product B
- **Confidence:** 0.45 = 45% of customers who bought A also bought B
- **Lift:** 2.1 = Customers are 2.1x more likely to buy B when they buy A
- **Interpretation:** Strong recommendation to show Product B to customers viewing Product A

### Rule Ranking Composite Score

```
Composite Score Formula:
score = (confidence × 0.4) + (normalized_lift × 0.4) + (normalized_support × 0.2)

Where:
- confidence: raw confidence value (0-1)
- normalized_lift: (lift - 1) / max_lift
- normalized_support: support / max_support

Example Calculation:
Rule: {P123} → {P456}
- confidence: 0.45
- lift: 2.1 (normalized: 0.55)
- support: 0.045 (normalized: 0.30)
- score = (0.45 × 0.4) + (0.55 × 0.4) + (0.30 × 0.2)
- score = 0.18 + 0.22 + 0.06 = 0.46
```

### Rule Storage Format Conversion

```
From mlxtend Format:
┌─────────────────────────────────────┐
│ antecedents: frozenset({123, 456})  │
│ consequents: frozenset({789})       │
└─────────────────────────────────────┘

To Storage Format:
┌─────────────────────────────────────┐
│ antecedents: [123, 456]             │
│ consequents: [789]                  │
│ description: "123, 456 → 789"       │
└─────────────────────────────────────┘
```

### Performance Optimization

```
Itemset Count vs Rule Count
┌─────────────────────────────────┐
│  Itemsets  │  Rules Generated   │
├────────────┼────────────────────┤
│    100     │      200-500       │
│    500     │    1,000-2,000     │
│  1,000     │    3,000-6,000     │
│  5,000     │   20,000-40,000    │
└────────────┴────────────────────┘

Optimization Strategies:
- Set higher min_confidence to reduce rules
- Limit antecedent size (fewer multi-product conditions)
- Filter by lift threshold early
- Store only top N rules per product
```

### Expected Outcome
- Functional generate_rules method using mlxtend
- Pandas DataFrame with association rules and quality metrics
- Rules filtered by confidence and lift thresholds
- Composite quality scoring implemented
- Frozensets converted to lists for storage
- Logging for rule statistics
- Performance optimized for large itemset counts
- Rules ready for recommendation service

### Verification Checklist
- [ ] generate_rules method implemented
- [ ] mlxtend.frequent_patterns.association_rules imported
- [ ] Method accepts frequent_itemsets DataFrame
- [ ] min_confidence parameter configurable
- [ ] metric parameter supported
- [ ] Association rules generated correctly
- [ ] Rules DataFrame contains all quality metrics
- [ ] Lift filtering applied (lift > 1.0)
- [ ] Rules sorted by confidence or quality score
- [ ] Frozensets converted to lists
- [ ] Logging for rule statistics implemented
- [ ] Error handling for insufficient itemsets

---

## Task 23: Create min_support Setting

### Overview
Create the FBT_MIN_SUPPORT configuration setting to control the minimum support threshold for the Apriori algorithm. This setting determines how frequently a product combination must appear in transactions to be considered a frequent itemset. Proper configuration balances between finding meaningful patterns and computational efficiency.

### Dependencies
- Task 22: Create generate_rules

### Instructions

1. **Navigate to settings configuration**
   - Open `backend/config/settings/base.py` or equivalent
   - Locate AI/ML configuration section
   - Add new setting under recommendation settings group

2. **Define FBT_MIN_SUPPORT setting**
   - Create setting constant FBT_MIN_SUPPORT
   - Set default value to 0.01 (1% of transactions)
   - Add type hint as float
   - Add inline comment explaining purpose

3. **Define valid range constraints**
   - Minimum value: 0.001 (0.1% of transactions)
   - Maximum value: 0.1 (10% of transactions)
   - Document reasoning for range limits
   - Add validation if using django-constance or similar

4. **Create setting validation function**
   - Define function to validate min_support value
   - Check value is between 0.001 and 0.1
   - Check value is float or convertible to float
   - Raise ValueError with helpful message if invalid

5. **Add setting documentation**
   - Document what min_support controls
   - Explain impact of higher vs lower values
   - Provide usage examples for different store sizes
   - Include performance considerations

6. **Create environment variable override**
   - Support FBT_MIN_SUPPORT environment variable
   - Allow dynamic configuration without code changes
   - Fallback to default if not provided
   - Validate environment variable value

7. **Add to admin configuration interface**
   - If using django-constance or similar admin tool
   - Create UI field for adjusting min_support
   - Add help text explaining parameter
   - Restrict access to admin users only

8. **Update related code references**
   - Update AprioriTrainer to read from settings
   - Replace hardcoded values with setting reference
   - Ensure default parameter uses setting value
   - Test that changes propagate correctly

### Setting Configuration Structure

```
# backend/config/settings/base.py

# ============================================
# AI & ML Settings - Product Recommendations
# ============================================

# Frequently Bought Together (Apriori Algorithm)
# ------------------------------------------------

# Minimum support threshold for Apriori algorithm
# Controls frequency threshold for itemsets to be considered "frequent"
# Range: 0.001 (0.1%) to 0.1 (10%)
# Lower = More itemsets found (slower, more patterns)
# Higher = Fewer itemsets found (faster, popular patterns only)
FBT_MIN_SUPPORT = float(os.getenv('FBT_MIN_SUPPORT', '0.01'))

# Validate min_support range
if not (0.001 <= FBT_MIN_SUPPORT <= 0.1):
    raise ValueError(
        f"FBT_MIN_SUPPORT must be between 0.001 and 0.1, got {FBT_MIN_SUPPORT}"
    )
```

### min_support Value Guidelines

| Value | Itemsets Found | Use Case | Performance |
|-------|---------------|----------|-------------|
| 0.001 | Very many | Large stores, niche products | Slow |
| 0.005 | Many | Large stores, balanced | Moderate |
| 0.01 | Moderate | Medium stores, recommended | Good |
| 0.02 | Fewer | Medium stores, popular items | Fast |
| 0.05 | Few | Small stores, best sellers | Very fast |
| 0.1 | Very few | Very popular combos only | Fastest |

### Impact of min_support on Itemsets

```
Example Store: 10,000 transactions

min_support = 0.001 (10+ occurrences)
├── Itemsets found: ~5,000
├── Processing time: 30-60 seconds
└── Memory: High

min_support = 0.01 (100+ occurrences)
├── Itemsets found: ~500
├── Processing time: 5-10 seconds
└── Memory: Moderate

min_support = 0.05 (500+ occurrences)
├── Itemsets found: ~50
├── Processing time: 1-2 seconds
└── Memory: Low
```

### Store Size Recommendations

| Store Size | Orders/Month | Recommended min_support | Rationale |
|------------|-------------|------------------------|-----------|
| Small | < 500 | 0.02 - 0.05 | Few patterns, need higher frequency |
| Medium | 500 - 5,000 | 0.01 - 0.02 | Balanced approach |
| Large | 5,000 - 50,000 | 0.005 - 0.01 | Many patterns available |
| Very Large | > 50,000 | 0.001 - 0.005 | Abundant data, find niche patterns |

### Admin Interface Configuration

```
If using django-constance:

CONSTANCE_CONFIG = {
    'FBT_MIN_SUPPORT': (
        0.01,
        'Minimum support threshold for Apriori algorithm (0.001-0.1)',
        float
    ),
}

CONSTANCE_CONFIG_FIELDSETS = {
    'AI & Recommendations': (
        'FBT_MIN_SUPPORT',
        'FBT_MIN_CONFIDENCE',
    ),
}
```

### Validation Function Implementation

```
Validation Logic:

def validate_fbt_min_support(value):
    """Validate FBT min_support setting value"""
    try:
        value = float(value)
    except (ValueError, TypeError):
        raise ValueError("FBT_MIN_SUPPORT must be a float")
    
    if value < 0.001:
        raise ValueError("FBT_MIN_SUPPORT too low (min: 0.001)")
    
    if value > 0.1:
        raise ValueError("FBT_MIN_SUPPORT too high (max: 0.1)")
    
    return value

# Apply validation
FBT_MIN_SUPPORT = validate_fbt_min_support(
    os.getenv('FBT_MIN_SUPPORT', '0.01')
)
```

### Environment Variable Usage

```
Docker Compose:
environment:
  - FBT_MIN_SUPPORT=0.01

.env file:
FBT_MIN_SUPPORT=0.01

Command line:
FBT_MIN_SUPPORT=0.015 python manage.py train_recommendations

Kubernetes ConfigMap:
data:
  FBT_MIN_SUPPORT: "0.01"
```

### Integration with AprioriTrainer

```
Usage in AprioriTrainer:

from django.conf import settings

class AprioriTrainer(ModelTrainer):
    def __init__(self, tenant=None):
        super().__init__(tenant, model_type='apriori')
        self.min_support = settings.FBT_MIN_SUPPORT
    
    def find_frequent_itemsets(self, encoded_df, min_support=None):
        # Use parameter if provided, else use setting
        support = min_support or self.min_support
        # Continue with apriori algorithm...
```

### Expected Outcome
- FBT_MIN_SUPPORT setting defined in Django settings
- Default value set to 0.01 (1%)
- Valid range enforced (0.001 to 0.1)
- Environment variable override supported
- Validation function implemented
- Documentation and comments added
- Admin interface configured (if applicable)
- AprioriTrainer updated to use setting

### Verification Checklist
- [ ] FBT_MIN_SUPPORT added to settings file
- [ ] Default value set to 0.01
- [ ] Range validation implemented (0.001-0.1)
- [ ] Environment variable support added
- [ ] Validation function created
- [ ] Type hint added (float)
- [ ] Documentation comments added
- [ ] Admin interface configured (if using constance)
- [ ] AprioriTrainer reads from settings
- [ ] Setting tested with different values

---

## Task 24: Create min_confidence Setting

### Overview
Create the FBT_MIN_CONFIDENCE configuration setting to control the minimum confidence threshold for association rule generation. This setting determines the reliability threshold for rules to be considered actionable recommendations. Higher confidence means more reliable but fewer recommendations, while lower confidence provides more variety but potentially less relevant suggestions.

### Dependencies
- Task 22: Create generate_rules
- Task 23: Create min_support Setting

### Instructions

1. **Navigate to settings configuration**
   - Open `backend/config/settings/base.py` or equivalent
   - Locate FBT_MIN_SUPPORT setting created in Task 23
   - Add FBT_MIN_CONFIDENCE setting below it

2. **Define FBT_MIN_CONFIDENCE setting**
   - Create setting constant FBT_MIN_CONFIDENCE
   - Set default value to 0.3 (30% confidence)
   - Add type hint as float
   - Add inline comment explaining purpose

3. **Define valid range constraints**
   - Minimum value: 0.1 (10% confidence)
   - Maximum value: 0.9 (90% confidence)
   - Document reasoning for range limits
   - Add validation similar to min_support

4. **Create setting validation function**
   - Define function to validate min_confidence value
   - Check value is between 0.1 and 0.9
   - Check value is float or convertible to float
   - Raise ValueError with helpful message if invalid

5. **Add setting documentation**
   - Document what min_confidence controls
   - Explain confidence metric in context of recommendations
   - Provide usage examples for different scenarios
   - Include trade-offs between confidence and coverage

6. **Create environment variable override**
   - Support FBT_MIN_CONFIDENCE environment variable
   - Allow runtime configuration changes
   - Fallback to default if not provided
   - Validate environment variable value

7. **Add to admin configuration interface**
   - Add to django-constance config if applicable
   - Create UI field for adjusting min_confidence
   - Add help text explaining impact
   - Group with FBT_MIN_SUPPORT in admin

8. **Update related code references**
   - Update AprioriTrainer to read from settings
   - Update generate_rules to use setting as default
   - Ensure parameter can still be overridden
   - Test that changes work correctly

9. **Document relationship with min_support**
   - Explain how both settings work together
   - Provide guidance on balanced configuration
   - Include examples of good setting combinations
   - Add warning about conflicting values

### Setting Configuration Structure

```
# backend/config/settings/base.py

# Frequently Bought Together (Apriori Algorithm)
# ------------------------------------------------

# Minimum support threshold (from Task 23)
FBT_MIN_SUPPORT = float(os.getenv('FBT_MIN_SUPPORT', '0.01'))

# Minimum confidence threshold for association rules
# Controls reliability threshold for generated recommendations
# Range: 0.1 (10%) to 0.9 (90%)
# Lower = More rules generated (more variety, less reliable)
# Higher = Fewer rules generated (more reliable, less variety)
FBT_MIN_CONFIDENCE = float(os.getenv('FBT_MIN_CONFIDENCE', '0.3'))

# Validate min_confidence range
if not (0.1 <= FBT_MIN_CONFIDENCE <= 0.9):
    raise ValueError(
        f"FBT_MIN_CONFIDENCE must be between 0.1 and 0.9, "
        f"got {FBT_MIN_CONFIDENCE}"
    )
```

### min_confidence Value Guidelines

| Value | Rules Found | Reliability | Use Case |
|-------|-------------|-------------|----------|
| 0.1 | Very many | Low | Exploratory, discovery phase |
| 0.2 | Many | Moderate | General recommendations |
| 0.3 | Moderate | Good | Balanced (recommended) |
| 0.4 | Fewer | High | Quality-focused |
| 0.5 | Few | Very high | Conservative, high trust |
| 0.7+ | Very few | Extremely high | Only strongest patterns |

### Confidence Metric Explained

```
Confidence = P(B|A) = (Transactions with A and B) / (Transactions with A)

Example:
- 100 customers bought Product A
- 35 of them also bought Product B
- Confidence (A → B) = 35/100 = 0.35 (35%)

Interpretation:
35% of customers who buy A also buy B
If we recommend B to customers viewing A,
we expect 35% conversion rate
```

### Impact of min_confidence on Rules

```
Example Itemsets: 500 frequent itemsets found

min_confidence = 0.1 (10%)
├── Rules generated: ~2,000
├── Average confidence: 0.22
├── Coverage: High (many products)
└── Reliability: Lower

min_confidence = 0.3 (30%)
├── Rules generated: ~600
├── Average confidence: 0.42
├── Coverage: Moderate
└── Reliability: Good

min_confidence = 0.5 (50%)
├── Rules generated: ~150
├── Average confidence: 0.61
├── Coverage: Low
└── Reliability: High
```

### Business Context Recommendations

| Business Goal | Recommended min_confidence | Reasoning |
|---------------|---------------------------|-----------|
| Maximize revenue | 0.2 - 0.3 | More recommendations, more opportunities |
| Build customer trust | 0.4 - 0.5 | Higher quality, more relevant |
| New store (little data) | 0.2 - 0.3 | Need variety to learn preferences |
| Established store | 0.3 - 0.4 | Balanced quality and variety |
| Premium products | 0.5 - 0.7 | High reliability to maintain brand |

### Support-Confidence Balance

| min_support | min_confidence | Result | Use Case |
|-------------|----------------|--------|----------|
| 0.001 | 0.1 | Many rules, low quality | Exploratory |
| 0.005 | 0.2 | Balanced | General purpose |
| 0.01 | 0.3 | Good balance | Recommended |
| 0.02 | 0.4 | Quality focus | High standards |
| 0.05 | 0.5 | Few high-quality rules | Conservative |

### Admin Interface Configuration

```
If using django-constance:

CONSTANCE_CONFIG = {
    'FBT_MIN_SUPPORT': (
        0.01,
        'Minimum support threshold for Apriori (0.001-0.1)',
        float
    ),
    'FBT_MIN_CONFIDENCE': (
        0.3,
        'Minimum confidence threshold for rules (0.1-0.9)',
        float
    ),
}

CONSTANCE_CONFIG_FIELDSETS = {
    'AI & Recommendations': {
        'fields': (
            'FBT_MIN_SUPPORT',
            'FBT_MIN_CONFIDENCE',
        ),
        'description': 'Configure Frequently Bought Together algorithm parameters'
    },
}
```

### Validation Function Implementation

```
Validation Logic:

def validate_fbt_min_confidence(value):
    """Validate FBT min_confidence setting value"""
    try:
        value = float(value)
    except (ValueError, TypeError):
        raise ValueError("FBT_MIN_CONFIDENCE must be a float")
    
    if value < 0.1:
        raise ValueError("FBT_MIN_CONFIDENCE too low (min: 0.1)")
    
    if value > 0.9:
        raise ValueError("FBT_MIN_CONFIDENCE too high (max: 0.9)")
    
    return value

# Apply validation
FBT_MIN_CONFIDENCE = validate_fbt_min_confidence(
    os.getenv('FBT_MIN_CONFIDENCE', '0.3')
)
```

### Integration with AprioriTrainer

```
Usage in AprioriTrainer:

from django.conf import settings

class AprioriTrainer(ModelTrainer):
    def __init__(self, tenant=None):
        super().__init__(tenant, model_type='apriori')
        self.min_support = settings.FBT_MIN_SUPPORT
        self.min_confidence = settings.FBT_MIN_CONFIDENCE
    
    def generate_rules(self, frequent_itemsets, min_confidence=None):
        # Use parameter if provided, else use setting
        confidence = min_confidence or self.min_confidence
        # Continue with association_rules generation...
```

### Combined Settings Usage Example

```
Training with Settings:

# Default values from settings
trainer = AprioriTrainer(tenant=current_tenant)
trainer.train_pipeline()
# Uses: min_support=0.01, min_confidence=0.3

# Override for specific scenario
trainer.train_model(
    encoded_df=data,
    min_support=0.005,      # More patterns
    min_confidence=0.4      # Higher quality
)

# Environment variable override
# Set in .env: FBT_MIN_CONFIDENCE=0.35
# Automatically used by all training runs
```

### A/B Testing Configuration

```
Scenario: Test different confidence thresholds

Group A (Conservative):
├── FBT_MIN_SUPPORT: 0.01
├── FBT_MIN_CONFIDENCE: 0.4
└── Expected: Fewer, high-quality recommendations

Group B (Balanced):
├── FBT_MIN_SUPPORT: 0.01
├── FBT_MIN_CONFIDENCE: 0.3
└── Expected: Moderate variety and quality

Group C (Aggressive):
├── FBT_MIN_SUPPORT: 0.01
├── FBT_MIN_CONFIDENCE: 0.2
└── Expected: Many recommendations, varied quality

Measure: Click-through rate, conversion rate, revenue
```

### Expected Outcome
- FBT_MIN_CONFIDENCE setting defined in Django settings
- Default value set to 0.3 (30%)
- Valid range enforced (0.1 to 0.9)
- Environment variable override supported
- Validation function implemented
- Documentation and comments added
- Admin interface configured (if applicable)
- AprioriTrainer updated to use both settings
- Clear documentation of support-confidence relationship

### Verification Checklist
- [ ] FBT_MIN_CONFIDENCE added to settings file
- [ ] Default value set to 0.3
- [ ] Range validation implemented (0.1-0.9)
- [ ] Environment variable support added
- [ ] Validation function created
- [ ] Type hint added (float)
- [ ] Documentation comments added
- [ ] Admin interface configured (if using constance)
- [ ] AprioriTrainer reads from settings
- [ ] Both settings work together correctly
- [ ] Setting tested with different values
- [ ] Relationship with min_support documented

---

## Summary

This document established the market basket analysis and Apriori algorithm implementation for Frequently Bought Together recommendations. Key achievements include transaction extraction from orders, one-hot encoding for algorithm input, frequent itemset discovery, association rule generation with quality metrics, and configurable support/confidence thresholds.

### Completed Tasks
1. ✓ Created BasketAnalyzer for order basket analysis
2. ✓ Implemented get_transactions to extract product ID lists
3. ✓ Created encode_transactions for one-hot encoding
4. ✓ Implemented AprioriTrainer extending ModelTrainer
5. ✓ Created find_frequent_itemsets using mlxtend Apriori
6. ✓ Implemented generate_rules with quality metrics
7. ✓ Added FBT_MIN_SUPPORT configuration setting
8. ✓ Added FBT_MIN_CONFIDENCE configuration setting

### Key Deliverables
- **File Created:** `backend/apps/ai/recommendations/algorithms/apriori.py`
- **Classes Implemented:**
  - BasketAnalyzer: Transaction data extraction and preparation
  - AprioriTrainer: Complete training pipeline for FBT recommendations
- **Configuration Added:**
  - FBT_MIN_SUPPORT: Itemset frequency threshold (default: 0.01)
  - FBT_MIN_CONFIDENCE: Rule reliability threshold (default: 0.3)

### Technical Highlights
- Market basket analysis with order data
- Optimized database queries with prefetching
- One-hot encoding using mlxtend TransactionEncoder
- Apriori algorithm for frequent itemset mining
- Association rules with multiple quality metrics
- Configurable hyperparameters via Django settings
- Multi-tenant data isolation maintained
- Performance optimization for large datasets

### Algorithm Overview

```
┌────────────────────────────────────────────┐
│    Frequently Bought Together Pipeline     │
│                                            │
│  1. BasketAnalyzer.get_transactions()      │
│     ↓ [[P1,P2], [P1,P3], [P2,P3]]         │
│                                            │
│  2. BasketAnalyzer.encode_transactions()   │
│     ↓ One-hot DataFrame (bool)             │
│                                            │
│  3. AprioriTrainer.find_frequent_itemsets()│
│     ↓ Itemsets DataFrame (support values)  │
│                                            │
│  4. AprioriTrainer.generate_rules()        │
│     ↓ Rules DataFrame (confidence, lift)   │
│                                            │
│  5. Store in RecommendationModel           │
│     ↓ Ready for real-time recommendations  │
└────────────────────────────────────────────┘
```

### Next Steps
Proceed to [02_Tasks-25-34_FBT-Service-Cache.md](02_Tasks-25-34_FBT-Service-Cache.md) to implement the FrequentlyBoughtTogetherService, recommendation retrieval logic, Redis caching layer, batch recommendation generation, and Celery-based model training tasks.

