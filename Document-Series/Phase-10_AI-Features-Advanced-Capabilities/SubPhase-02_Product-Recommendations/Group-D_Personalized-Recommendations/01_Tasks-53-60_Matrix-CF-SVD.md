# Tasks 53-60: Matrix Factorization & Collaborative Filtering

> **Phase:** 10 - AI Features & Advanced Capabilities  
> **SubPhase:** 02 - Product Recommendations  
> **Group:** D - Personalized Recommendations  
> **Document:** 01 of 02  
> **Tasks Covered:** 53, 54, 55, 56, 57, 58, 59, 60

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Group:** [../Group-C_Similar-Products/](../Group-C_Similar-Products/)
- **→ Next Document:** [02_Tasks-61-68_Service-Cache-Verify.md](02_Tasks-61-68_Service-Cache-Verify.md)

---

## Document Overview

This document covers the implementation of advanced personalized recommendation algorithms using collaborative filtering and matrix factorization techniques. You'll build the user-item interaction matrix, implement both user-based and item-based collaborative filtering, and create matrix factorization models using SVD (Singular Value Decomposition) for generating highly accurate product recommendations.

These algorithms analyze customer behavior patterns (views, cart additions, purchases) to predict what products a customer is likely to be interested in, even for products they haven't interacted with before. This is the foundation for "Customers who viewed this also liked" and "Recommended for you" features.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 53 | Create UserItemMatrix | High | 3 hours |
| 54 | Create build_matrix Method | Medium | 2 hours |
| 55 | Create implicit_ratings | Medium | 1.5 hours |
| 56 | Create CollaborativeFilter | High | 3 hours |
| 57 | Create user_based CF | High | 3 hours |
| 58 | Create item_based CF | High | 3 hours |
| 59 | Create MatrixFactorization | High | 4 hours |
| 60 | Create train Method | Medium | 2 hours |

---

## Task 53: Create UserItemMatrix

### Overview
Create the `UserItemMatrix` class that builds and manages user-item interaction matrices for collaborative filtering. This matrix is the core data structure where rows represent customers and columns represent products, with cells containing interaction scores based on customer behavior (views, cart additions, purchases).

### Dependencies
- Task 52: Create RecommendationEngine (from Group-C)
- Multi-tenancy database setup
- Product and Customer models
- CustomerInteraction model (tracking views, carts, purchases)

### Instructions

1. **Create the collaborative filtering module file**
   - Navigate to `backend/apps/ai/recommendations/algorithms/`
   - Create new file named `collaborative.py`
   - This module will house all collaborative filtering classes

2. **Import required dependencies**
   - Import NumPy for matrix operations
   - Import SciPy sparse matrices (csr_matrix, coo_matrix)
   - Import Django ORM models (Product, Customer, CustomerInteraction)
   - Import typing utilities for type hints
   - Import datetime utilities for time-based filtering

3. **Define the UserItemMatrix class**
   - Create class `UserItemMatrix` with docstring explaining purpose
   - This class builds sparse matrices from customer interaction data
   - Initialize with tenant context to ensure multi-tenancy isolation

4. **Add class constructor**
   - Accept `tenant` parameter (Tenant model instance)
   - Store tenant for scoped database queries
   - Initialize placeholder attributes for matrix components
   - Set `customer_mapping` dict (customer_id → row_index)
   - Set `product_mapping` dict (product_id → col_index)
   - Set `reverse_customer_mapping` dict (row_index → customer_id)
   - Set `reverse_product_mapping` dict (col_index → product_id)

5. **Define interaction weight constants**
   - Create class-level constants for implicit ratings
   - `VIEW_WEIGHT = 1.0` - Lowest interaction strength
   - `CART_WEIGHT = 3.0` - Medium interaction strength
   - `PURCHASE_WEIGHT = 5.0` - Highest interaction strength
   - Document rationale: purchases > cart > views

6. **Add matrix storage attributes**
   - Initialize `matrix` attribute (will store CSR sparse matrix)
   - Initialize `shape` attribute (tuple of rows, cols)
   - Initialize `last_built` timestamp (tracks when matrix was generated)
   - Initialize `customer_count` and `product_count` counters

7. **Create helper method for customer mapping**
   - Method: `_build_customer_mapping(queryset)`
   - Accept queryset of Customer objects
   - Iterate through customers and assign sequential indices
   - Build forward and reverse mapping dictionaries
   - Return tuple of (forward_map, reverse_map)

8. **Create helper method for product mapping**
   - Method: `_build_product_mapping(queryset)`
   - Accept queryset of Product objects
   - Iterate through products and assign sequential indices
   - Build forward and reverse mapping dictionaries
   - Return tuple of (forward_map, reverse_map)

### Matrix Structure

```
User-Item Matrix (Sparse CSR Format)

         P1    P2    P3    P4    P5   ... Pn
User1  [ 5.0   0     3.0   1.0   0   ... 0  ]
User2  [ 0     5.0   5.0   0     3.0 ... 0  ]
User3  [ 3.0   1.0   0     5.0   5.0 ... 0  ]
...
Userm  [ 0     0     5.0   3.0   0   ... 1.0]

Where values represent:
- 0: No interaction
- 1.0: View only
- 3.0: Added to cart
- 5.0: Purchased
```

### Matrix Components

| Component | Type | Purpose |
|-----------|------|---------|
| Rows | Customers | Each customer gets unique row index |
| Columns | Products | Each product gets unique column index |
| Values | Interaction Scores | Weighted by interaction type |
| Format | CSR Sparse | Memory-efficient for sparse data |

### Mapping Dictionaries

| Mapping | Format | Example | Purpose |
|---------|--------|---------|---------|
| customer_mapping | {customer_id: row_idx} | {1234: 0, 5678: 1} | ID to matrix row |
| product_mapping | {product_id: col_idx} | {999: 0, 888: 1} | ID to matrix col |
| reverse_customer_mapping | {row_idx: customer_id} | {0: 1234, 1: 5678} | Row to ID |
| reverse_product_mapping | {col_idx: product_id} | {0: 999, 1: 888} | Col to ID |

### Sparse Matrix Advantages

```
Dense Matrix (100K users × 10K products)
├── Memory: 100K × 10K × 8 bytes = 8 GB
├── Storage: Every cell stored
└── Speed: Slower operations on large arrays

CSR Sparse Matrix
├── Memory: Only non-zero values stored
├── Storage: ~0.1-1% of dense size
└── Speed: Fast operations on sparse data
```

### Class Structure Diagram

```
┌───────────────────────────────────────┐
│        UserItemMatrix                 │
├───────────────────────────────────────┤
│ Attributes:                           │
│ - tenant                              │
│ - customer_mapping                    │
│ - product_mapping                     │
│ - reverse_customer_mapping            │
│ - reverse_product_mapping             │
│ - matrix (CSR)                        │
│ - shape                               │
│ - last_built                          │
├───────────────────────────────────────┤
│ Methods:                              │
│ + build_matrix(start_date) → matrix  │
│ + _build_customer_mapping()           │
│ + _build_product_mapping()            │
│ + _calculate_implicit_ratings()       │
│ + get_customer_vector(customer_id)    │
│ + get_product_vector(product_id)      │
│ + get_matrix_stats()                  │
└───────────────────────────────────────┘
```

### Expected Outcome
- UserItemMatrix class defined with proper initialization
- Customer and product mapping dictionaries established
- Interaction weight constants defined
- Helper methods for building mappings
- Foundation for matrix building in next task

### Verification Checklist
- [ ] `backend/apps/ai/recommendations/algorithms/collaborative.py` created
- [ ] UserItemMatrix class defined with tenant parameter
- [ ] Interaction weight constants set (VIEW, CART, PURCHASE)
- [ ] Mapping attributes initialized
- [ ] Helper methods for customer/product mapping created
- [ ] Proper type hints added for all methods
- [ ] Docstrings explain class purpose and usage

---

## Task 54: Create build_matrix Method

### Overview
Implement the `build_matrix` method in UserItemMatrix class that queries customer interactions from the database and constructs the sparse user-item matrix. This method aggregates all customer behavior data (views, cart additions, purchases) and converts it into a mathematical matrix format suitable for collaborative filtering algorithms.

### Dependencies
- Task 53: Create UserItemMatrix

### Instructions

1. **Define the build_matrix method signature**
   - Method name: `build_matrix`
   - Parameters: `tenant` (Tenant instance), `start_date` (optional datetime)
   - Return type: `csr_matrix` (scipy sparse matrix)
   - Add comprehensive docstring explaining parameters and return

2. **Query active customers**
   - Use Django ORM to query Customer model
   - Filter by tenant for multi-tenancy isolation
   - Filter by is_active=True to exclude inactive customers
   - Order by customer_id for consistent indexing
   - Build customer mappings using helper method from Task 53

3. **Query active products**
   - Use Django ORM to query Product model
   - Filter by tenant for multi-tenancy isolation
   - Filter by is_active=True, is_deleted=False
   - Order by product_id for consistent indexing
   - Build product mappings using helper method from Task 53

4. **Query customer interactions**
   - Query CustomerInteraction model
   - Filter by tenant for isolation
   - Filter by start_date if provided (for time-based windows)
   - Select fields: customer_id, product_id, interaction_type, created_at
   - Order by created_at for chronological processing
   - Use select_related to optimize queries

5. **Prepare data structures for COO matrix**
   - Create empty lists: `row_indices`, `col_indices`, `data_values`
   - These will store coordinates and values for sparse matrix
   - COO (Coordinate) format is efficient for construction

6. **Iterate through interactions**
   - Loop through each CustomerInteraction record
   - Extract customer_id and product_id from interaction
   - Lookup row index from customer_mapping
   - Lookup column index from product_mapping
   - Skip if customer or product not in mappings
   - Call implicit_ratings method (Task 55) to get weight
   - Append row index to row_indices
   - Append column index to col_indices
   - Append weight to data_values

7. **Handle multiple interactions per user-product pair**
   - Same user may interact with same product multiple times
   - Use maximum weight for duplicate user-product pairs
   - Example: User views product (1.0), then purchases (5.0) → use 5.0
   - This ensures purchase overrides view

8. **Create COO sparse matrix**
   - Use scipy.sparse.coo_matrix constructor
   - Pass data_values, (row_indices, col_indices)
   - Set shape to (customer_count, product_count)
   - COO format allows easy construction

9. **Convert to CSR format**
   - Convert COO matrix to CSR (Compressed Sparse Row) format
   - CSR is more efficient for arithmetic operations and row slicing
   - Store in self.matrix attribute
   - Update self.shape attribute
   - Update self.last_built timestamp

10. **Add matrix statistics method**
    - Create method `get_matrix_stats()` that returns dict
    - Include: customer_count, product_count, interaction_count
    - Include: sparsity percentage (1 - non_zero_count / total_cells)
    - Include: last_built timestamp
    - Useful for monitoring and debugging

### Matrix Building Flow

```
┌─────────────────────────────────────────┐
│  1. Query Active Customers & Products   │
│     - Filter by tenant                  │
│     - Filter by is_active               │
│     - Build ID mappings                 │
└─────────────┬───────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────┐
│  2. Query CustomerInteractions          │
│     - Filter by tenant & date range     │
│     - Get: customer, product, type      │
└─────────────┬───────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────┐
│  3. Build COO Matrix Components         │
│     - row_indices: [0, 0, 1, 2, ...]    │
│     - col_indices: [5, 10, 5, 8, ...]   │
│     - data_values: [5.0, 1.0, 3.0, ...] │
└─────────────┬───────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────┐
│  4. Create COO Sparse Matrix            │
│     - Combine row, col, data arrays     │
│     - Set shape (m_customers × n_prods) │
└─────────────┬───────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────┐
│  5. Convert to CSR Format               │
│     - More efficient for operations     │
│     - Store in self.matrix              │
│     - Update metadata                   │
└─────────────────────────────────────────┘
```

### Query Optimization

| Optimization | Technique | Benefit |
|--------------|-----------|---------|
| Tenant Filtering | Filter by tenant first | Reduces dataset size |
| Date Range | Filter interactions by date | Focuses on recent data |
| Select Related | Prefetch related objects | Reduces N+1 queries |
| Ordering | Order by ID | Consistent indexing |
| Active Only | Filter is_active=True | Excludes invalid data |

### Sparse Matrix Formats

| Format | Use Case | Advantages |
|--------|----------|------------|
| COO | Construction | Easy to build incrementally |
| CSR | Row Operations | Fast row slicing, arithmetic |
| CSC | Column Operations | Fast column slicing |
| DOK | Element Access | Fast random access |

### Example Matrix Statistics

```json
{
  "customer_count": 15000,
  "product_count": 5000,
  "interaction_count": 89456,
  "sparsity": 0.998812,  // 99.88% sparse
  "density": 0.001188,    // 0.12% non-zero
  "last_built": "2026-01-31T10:30:00Z",
  "memory_size_mb": 2.4
}
```

### Time Window Strategy

| Window | Start Date | Use Case |
|--------|----------|----------|
| All Time | None | Cold start, new algorithm |
| 1 Year | 365 days ago | Long-term patterns |
| 6 Months | 180 days ago | Balanced recency |
| 3 Months | 90 days ago | Recent trends |
| 1 Month | 30 days ago | Trending products |

### Expected Outcome
- Functional build_matrix method that constructs sparse matrix
- Customer and product mappings populated
- Interactions converted to matrix coordinates and values
- CSR sparse matrix stored in class attribute
- Matrix statistics available for monitoring

### Verification Checklist
- [ ] build_matrix method implemented with proper signature
- [ ] Customer query filters by tenant and is_active
- [ ] Product query filters by tenant and is_active
- [ ] CustomerInteraction query optimized with filters
- [ ] COO matrix construction using row, col, data arrays
- [ ] Duplicate interactions handled (max weight)
- [ ] CSR conversion completed and stored
- [ ] Matrix shape and metadata updated
- [ ] get_matrix_stats method returns useful metrics
- [ ] Method returns CSR matrix successfully

---

## Task 55: Create implicit_ratings

### Overview
Implement the `implicit_ratings` method that converts customer interaction types into numerical weights for the user-item matrix. This method translates qualitative actions (view, cart, purchase) into quantitative values that represent interaction strength, enabling the collaborative filtering algorithms to understand customer preferences.

### Dependencies
- Task 54: Create build_matrix Method

### Instructions

1. **Define the implicit_ratings method**
   - Method name: `calculate_implicit_rating`
   - Parameter: `interaction` (CustomerInteraction model instance)
   - Return type: `float` (interaction weight)
   - Add docstring explaining weight system

2. **Extract interaction type**
   - Get `interaction_type` field from interaction instance
   - Normalize to uppercase for consistent comparison
   - Handle potential None or empty values

3. **Map interaction types to weights**
   - Create mapping logic using if-elif-else or dictionary
   - Map "VIEW" → 1.0 (using VIEW_WEIGHT constant)
   - Map "CART" or "ADD_TO_CART" → 3.0 (using CART_WEIGHT)
   - Map "PURCHASE" or "ORDER" → 5.0 (using PURCHASE_WEIGHT)
   - Map "WISHLIST" → 2.0 (optional, between view and cart)
   - Default fallback to 1.0 for unknown types

4. **Add recency boost (optional enhancement)**
   - Consider adding time decay factor
   - Recent interactions get slightly higher weight
   - Formula: base_weight × (1 + recency_factor)
   - Recency_factor = max(0, 1 - days_old / 365)
   - Keep boost subtle (max 10-20% increase)

5. **Add frequency cap (optional enhancement)**
   - If same user views product 100 times, don't overweight
   - Implement logarithmic scaling for views
   - Formula: VIEW_WEIGHT × log(1 + view_count)
   - Purchases always keep full weight

6. **Handle negative interactions (optional)**
   - Consider returns, negative reviews as negative weights
   - Map "RETURN" → -3.0
   - Map "NEGATIVE_REVIEW" → -1.0
   - Useful for more sophisticated filtering

7. **Create interaction aggregation method**
   - Method: `aggregate_interactions(customer_id, product_id, interactions)`
   - Accept list of interactions for same user-product pair
   - Apply business logic: purchase overrides all
   - If no purchase, sum cart + views with cap
   - Return final aggregated weight

8. **Add interaction validation**
   - Ensure weight is within valid range (e.g., -5.0 to 5.0)
   - Log warnings for unusual patterns
   - Handle edge cases gracefully

### Interaction Weight System

```
Interaction Type Hierarchy (Implicit Feedback)

PURCHASE (5.0)
    ↑
    │ Strong signal of interest
    │ User paid money → high confidence
    │
CART (3.0)
    ↑
    │ Medium signal of interest
    │ User considered buying → moderate confidence
    │
WISHLIST (2.0) [Optional]
    ↑
    │ Weak signal of interest
    │ User wants to remember → low confidence
    │
VIEW (1.0)
    │
    │ Minimal signal
    │ Could be accidental → very low confidence
```

### Weight Rationale

| Weight | Interaction | Rationale |
|--------|-------------|-----------|
| 5.0 | Purchase | Strongest signal - user invested money |
| 3.0 | Cart | Strong intent - user took action |
| 2.0 | Wishlist | Moderate interest - user saved item |
| 1.0 | View | Weak signal - could be browsing |
| 0.0 | No interaction | Default, no data |
| -1.0 to -5.0 | Negative | Returns, complaints (optional) |

### Multiple Interactions Handling

```
Scenario: User interacts with Product X multiple times

Interactions:
1. View on Day 1 → Weight: 1.0
2. View on Day 2 → Weight: 1.0
3. Add to Cart on Day 3 → Weight: 3.0
4. Purchase on Day 4 → Weight: 5.0

Aggregation Logic:
- Purchase present? Use 5.0 (ignore others)
- Final Weight: 5.0

Alternative Scenario (no purchase):
1. View (1.0) + View (1.0) + Cart (3.0)
- Sum with cap: min(sum, MAX_WEIGHT)
- Final Weight: 5.0 or use max(3.0)
```

### Recency Boost Formula

```
Time Decay Factor

base_weight = 3.0 (CART)
days_old = 30
decay_period = 365

recency_factor = max(0, 1 - days_old / decay_period)
                = max(0, 1 - 30/365)
                = 0.918

boosted_weight = base_weight × (1 + 0.1 × recency_factor)
                = 3.0 × (1 + 0.092)
                = 3.276

Recent interactions slightly stronger
Old interactions gradually decay
```

### Aggregation Strategies

| Strategy | Formula | Use Case |
|----------|---------|----------|
| Maximum | max(weights) | Purchase overrides all |
| Sum Capped | min(sum, max_weight) | Accumulate with limit |
| Weighted Sum | Σ(weight × time_decay) | Consider recency |
| Last Interaction | weights[-1] | Most recent only |
| Logarithmic | base × log(1 + count) | Diminishing returns |

### Implicit vs Explicit Ratings

```
Explicit Ratings (Not used here)
├── User rates product 1-5 stars
├── Direct feedback
└── Sparse data (users rarely rate)

Implicit Ratings (Our approach)
├── Inferred from behavior
├── No user effort required
└── Dense data (all interactions captured)
```

### Edge Cases to Handle

| Case | Handling Strategy |
|------|------------------|
| Unknown interaction type | Default to 1.0, log warning |
| Negative weights | Allow if implementing negative feedback |
| Zero interactions | Return 0.0, exclude from matrix |
| Multiple purchases | Use 5.0 once, don't stack |
| Very old interactions | Apply time decay if enabled |

### Expected Outcome
- Functional implicit_ratings method converting types to weights
- Clear mapping from interaction types to numerical values
- Optional recency and frequency adjustments
- Proper handling of multiple interactions per user-product
- Robust edge case handling

### Verification Checklist
- [ ] calculate_implicit_rating method implemented
- [ ] VIEW mapped to 1.0
- [ ] CART mapped to 3.0
- [ ] PURCHASE mapped to 5.0
- [ ] Unknown types default to 1.0
- [ ] Optional recency boost implemented
- [ ] Optional frequency cap implemented
- [ ] aggregate_interactions method handles duplicates
- [ ] Edge cases handled gracefully
- [ ] Method integrates with build_matrix flow

---

## Task 56: Create CollaborativeFilter

### Overview
Create the `CollaborativeFilter` class that implements collaborative filtering algorithms for generating product recommendations. This class serves as the foundation for both user-based and item-based collaborative filtering, providing methods for computing similarities, finding neighbors, and generating recommendations based on the user-item matrix.

### Dependencies
- Task 55: Create implicit_ratings

### Instructions

1. **Define the CollaborativeFilter class**
   - Create class in same `collaborative.py` file
   - Add comprehensive docstring explaining CF concepts
   - This class will contain user-based and item-based methods

2. **Add class constructor**
   - Accept `matrix` parameter (CSR sparse matrix from UserItemMatrix)
   - Accept `customer_mapping` and `product_mapping` dictionaries
   - Accept `reverse_customer_mapping` and `reverse_product_mapping`
   - Store all mappings for translating between IDs and indices
   - Initialize attributes for storing similarity matrices

3. **Define configuration parameters**
   - `n_neighbors` (default: 20) - number of similar users/items to consider
   - `min_similarity` (default: 0.1) - threshold for valid neighbors
   - `similarity_metric` (default: "cosine") - metric for computing similarity
   - Store as class attributes or constructor parameters

4. **Implement cosine similarity method**
   - Method: `_compute_cosine_similarity(matrix, index1, index2)`
   - Calculate cosine similarity between two vectors
   - Formula: sim = dot(v1, v2) / (norm(v1) × norm(v2))
   - Use NumPy or scipy functions for efficiency
   - Handle zero vectors (return 0.0 similarity)

5. **Implement similarity matrix computation**
   - Method: `_compute_similarity_matrix(matrix, axis)`
   - Compute pairwise similarities for all rows (axis=0) or columns (axis=1)
   - Use sklearn.metrics.pairwise.cosine_similarity for efficiency
   - Return similarity matrix (n×n where n is users or items)
   - Store result to avoid recomputation

6. **Implement find neighbors method**
   - Method: `_find_neighbors(similarity_matrix, index, n_neighbors)`
   - Find top N most similar users or items for given index
   - Sort similarities in descending order
   - Exclude self (index itself)
   - Filter by min_similarity threshold
   - Return list of tuples: [(neighbor_idx, similarity_score), ...]

7. **Create recommendation scoring method**
   - Method: `_compute_recommendation_scores(neighbors, target_vector, matrix)`
   - For each neighbor, get their interaction vector
   - Weight neighbor's ratings by their similarity to target
   - Aggregate weighted scores for each product
   - Formula: score[item] = Σ(similarity[neighbor] × rating[neighbor, item])
   - Return array of scores for all products

8. **Implement product filtering method**
   - Method: `_filter_products(customer_id, candidate_scores, top_k)`
   - Exclude products the customer already interacted with
   - Sort remaining products by score descending
   - Return top K product IDs with scores
   - Format: List of tuples [(product_id, score, reason), ...]

9. **Add explanation generation**
   - Method: `_generate_explanation(product_id, neighbors, method)`
   - Create human-readable explanation for recommendation
   - For user-based: "Users similar to you also liked..."
   - For item-based: "Because you liked X, we recommend Y..."
   - Include similarity scores and neighbor count

10. **Create utility methods**
    - Method: `get_customer_vector(customer_id)` - returns user's rating vector
    - Method: `get_product_vector(product_id)` - returns product's rating vector
    - Method: `get_interaction_count(customer_id)` - counts user's interactions
    - These support both user-based and item-based CF

### Collaborative Filtering Concept

```
Collaborative Filtering Philosophy:

"Users who agreed in the past will agree in the future"

┌─────────────────────────────────────────┐
│  User A: Bought {P1, P2, P3}            │
│  User B: Bought {P1, P2, P4}            │
│                                         │
│  Observation: A and B have similar taste│
│  (both bought P1 and P2)                │
│                                         │
│  Recommendation: Suggest P4 to User A   │
│  Reason: Similar user B liked P4        │
└─────────────────────────────────────────┘
```

### Class Architecture

```
┌────────────────────────────────────────┐
│      CollaborativeFilter               │
├────────────────────────────────────────┤
│ Attributes:                            │
│ - matrix: CSR sparse matrix            │
│ - customer_mapping: dict               │
│ - product_mapping: dict                │
│ - reverse_customer_mapping: dict       │
│ - reverse_product_mapping: dict        │
│ - user_similarity_matrix: Optional     │
│ - item_similarity_matrix: Optional     │
│ - n_neighbors: int = 20                │
│ - min_similarity: float = 0.1          │
├────────────────────────────────────────┤
│ Methods:                               │
│ + user_based_cf(customer, k) → recs    │
│ + item_based_cf(customer, k) → recs    │
│ - _compute_cosine_similarity()         │
│ - _compute_similarity_matrix()         │
│ - _find_neighbors()                    │
│ - _compute_recommendation_scores()     │
│ - _filter_products()                   │
│ - _generate_explanation()              │
│ + get_customer_vector()                │
│ + get_product_vector()                 │
└────────────────────────────────────────┘
```

### Cosine Similarity Explained

```
Cosine Similarity Measures Angle Between Vectors

User A: [5, 3, 0, 1]  (ratings for 4 products)
User B: [4, 3, 0, 2]

                    A · B
cos_sim(A, B) = ─────────────
                |A| × |B|

              (5×4 + 3×3 + 0×0 + 1×2)
            = ─────────────────────────────
              √(25+9+0+1) × √(16+9+0+4)

            = 31 / (√35 × √29)
            = 31 / 31.78
            = 0.975  ← High similarity!

Values range from -1 to 1:
- 1.0: Identical preferences
- 0.0: Uncorrelated
- -1.0: Opposite preferences
```

### Similarity Matrix Structure

```
User Similarity Matrix (m × m where m = customers)

        U1    U2    U3    U4    U5
U1    [1.00  0.85  0.23  0.91  0.45]
U2    [0.85  1.00  0.34  0.78  0.56]
U3    [0.23  0.34  1.00  0.19  0.88]
U4    [0.91  0.78  0.19  1.00  0.41]
U5    [0.45  0.56  0.88  0.41  1.00]

- Diagonal = 1.0 (self-similarity)
- Symmetric matrix
- Pre-compute and cache for efficiency
```

### Finding Neighbors Algorithm

```
For User U1, find top 3 neighbors:

1. Get U1's row from similarity matrix:
   [1.00, 0.85, 0.23, 0.91, 0.45]

2. Exclude self (U1 = 1.00):
   [-, 0.85, 0.23, 0.91, 0.45]

3. Sort descending:
   [0.91 (U4), 0.85 (U2), 0.45 (U5), 0.23 (U3)]

4. Take top 3:
   Neighbors = [(U4, 0.91), (U2, 0.85), (U5, 0.45)]

5. Filter by min_similarity (0.1):
   All pass threshold → keep all 3
```

### Recommendation Scoring Flow

```
┌───────────────────────────────────────┐
│ 1. Find Neighbors for Target User    │
│    - Get top N similar users          │
│    - Filter by min_similarity         │
└────────────┬──────────────────────────┘
             │
             ▼
┌───────────────────────────────────────┐
│ 2. For Each Product (Candidate)      │
│    - Skip if target already interacted│
│    - Look up neighbor's ratings       │
└────────────┬──────────────────────────┘
             │
             ▼
┌───────────────────────────────────────┐
│ 3. Weighted Scoring                   │
│    score = Σ(sim × rating)            │
│    - Higher similarity = more weight  │
│    - Higher rating = more weight      │
└────────────┬──────────────────────────┘
             │
             ▼
┌───────────────────────────────────────┐
│ 4. Normalize Scores                   │
│    normalized = score / Σ(similarities)│
└────────────┬──────────────────────────┘
             │
             ▼
┌───────────────────────────────────────┐
│ 5. Sort & Return Top K                │
│    - Sort by normalized score DESC    │
│    - Return top K products            │
└───────────────────────────────────────┘
```

### Configuration Parameters

| Parameter | Default | Range | Purpose |
|-----------|---------|-------|---------|
| n_neighbors | 20 | 5-100 | Number of similar users/items |
| min_similarity | 0.1 | 0.0-1.0 | Minimum similarity threshold |
| similarity_metric | cosine | cosine, pearson | Similarity calculation method |
| top_k | 10 | 1-100 | Number of recommendations |

### Performance Optimization

| Optimization | Technique | Impact |
|--------------|-----------|--------|
| Matrix Format | Use CSR for row operations | 10-100× faster |
| Similarity Cache | Pre-compute and store | Avoid repeated calculation |
| Top K Heap | Use heap for sorting | O(n log k) vs O(n log n) |
| Sparse Operations | scipy.sparse operations | Memory efficient |
| Batch Processing | Compute multiple users at once | Amortize overhead |

### Expected Outcome
- CollaborativeFilter class with core CF functionality
- Cosine similarity computation methods
- Neighbor finding with thresholding
- Recommendation scoring with weighted aggregation
- Product filtering and ranking
- Utility methods for vector access

### Verification Checklist
- [ ] CollaborativeFilter class defined with proper constructor
- [ ] Matrix and mapping parameters stored correctly
- [ ] Cosine similarity method implemented
- [ ] Similarity matrix computation method created
- [ ] Find neighbors method with sorting and filtering
- [ ] Recommendation scoring method with weighting
- [ ] Product filtering excludes already-interacted items
- [ ] Explanation generation for recommendations
- [ ] Utility methods for vector access
- [ ] Configuration parameters properly set

---

## Task 57: Create user_based CF

### Overview
Implement the user-based collaborative filtering method that generates recommendations by finding similar users and aggregating their preferences. This approach answers the question: "Users who are similar to you also liked these products." It's particularly effective for discovering products that similar customers have purchased.

### Dependencies
- Task 56: Create CollaborativeFilter

### Instructions

1. **Define the user_based_cf method**
   - Method name: `user_based_cf`
   - Parameters: `customer_id` (int), `top_k` (int, default=10)
   - Return type: `List[Dict]` (list of recommendation dictionaries)
   - Add docstring explaining user-based CF algorithm

2. **Validate customer exists**
   - Check if customer_id exists in customer_mapping
   - If not found, return empty list or raise ValueError
   - Log warning for missing customers

3. **Get customer's matrix index**
   - Look up row index from customer_mapping
   - Extract customer's rating vector from matrix
   - Store as `customer_vector` (1D array)

4. **Check for cold start problem**
   - Count non-zero elements in customer_vector
   - If customer has fewer than 3 interactions, handle cold start
   - Options: return popular products, or empty list with message
   - Log cold start scenario for monitoring

5. **Compute or retrieve user similarity matrix**
   - Check if user_similarity_matrix already computed
   - If not, compute: `_compute_similarity_matrix(matrix, axis=0)`
   - Axis=0 means compute similarities between rows (users)
   - Cache result in self.user_similarity_matrix for future calls

6. **Find similar users (neighbors)**
   - Get customer's similarity row from user_similarity_matrix
   - Call `_find_neighbors(similarity_matrix, customer_idx, n_neighbors)`
   - Returns list of tuples: [(neighbor_idx, similarity_score), ...]
   - Ensure neighbors are sorted by similarity descending

7. **Handle insufficient neighbors**
   - If fewer than min_neighbors found (e.g., 3), log warning
   - Consider fallback to popular products or item-based CF
   - Continue with available neighbors if any exist

8. **Compute recommendation scores**
   - For each product (column) in matrix:
     - Skip products customer already interacted with
     - For each neighbor, get their rating for this product
     - Weight rating by neighbor's similarity score
     - Formula: score += similarity[neighbor] × rating[neighbor, product]
   - Normalize by sum of similarity scores
   - Store scores in array (length = number of products)

9. **Filter and rank products**
   - Call `_filter_products(customer_id, scores, top_k)`
   - Exclude products with zero score
   - Sort by score descending
   - Select top K products

10. **Format recommendations**
    - For each recommended product_id:
      - Get product details from database (name, price, image)
      - Calculate confidence score (normalized similarity)
      - Generate explanation using _generate_explanation
      - Create recommendation dict with fields:
        - product_id, product_name, score, confidence, reason
    - Return list of recommendation dictionaries

11. **Add diversity consideration (optional)**
    - If all top products are from same category, diversify
    - Implement MMR (Maximal Marginal Relevance) for diversity
    - Balance between relevance (score) and diversity (category)

12. **Log recommendation metrics**
    - Log number of neighbors found
    - Log score distribution statistics
    - Log execution time for performance monitoring

### User-Based CF Algorithm Flow

```
┌─────────────────────────────────────────┐
│  Input: Customer ID, Top K              │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│  1. Get Customer Vector from Matrix     │
│     Row index from mapping              │
│     Extract ratings: [5, 0, 3, 0, 5, ...]│
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│  2. Compute User Similarity Matrix      │
│     (if not cached)                     │
│     Pairwise cosine similarity          │
│     Result: m×m matrix                  │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│  3. Find Top N Similar Users            │
│     Sort by similarity                  │
│     Filter by min_similarity            │
│     Result: [(user_idx, sim), ...]     │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│  4. Aggregate Neighbor Preferences      │
│     For each product:                   │
│       score = Σ(similarity × rating)    │
│     Exclude already-owned products      │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│  5. Normalize & Rank                    │
│     score / Σ(similarities)             │
│     Sort descending                     │
│     Select top K                        │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│  Output: List of Recommended Products   │
│  [{id, name, score, reason}, ...]       │
└─────────────────────────────────────────┘
```

### Example Calculation

```
Customer A (target) has rated:
  Product P1: 5.0 (purchased)
  Product P2: 3.0 (added to cart)
  Product P3: 1.0 (viewed)

Similar Users Found:
  User B: similarity = 0.85
    - P1: 5.0, P2: 3.0, P4: 5.0
  User C: similarity = 0.73
    - P1: 5.0, P3: 3.0, P5: 5.0

Recommendation Scores:
  P4: (0.85 × 5.0) / 0.85 = 5.0
  P5: (0.73 × 5.0) / 0.73 = 5.0

Normalized Scores (Σ similarities = 1.58):
  P4: (0.85 × 5.0) / 1.58 = 2.69
  P5: (0.73 × 5.0) / 1.58 = 2.31

Ranking: P4 > P5
```

### Cold Start Problem

```
New Customer with No Interactions

Problem:
├── No rating vector available
├── Cannot compute similarity with other users
└── No basis for recommendations

Solutions:
├── 1. Popular Products
│      Return trending/bestselling items
├── 2. Demographic-Based
│      Use customer profile (age, location)
├── 3. Content-Based
│      Switch to content-based recommendations
└── 4. Hybrid Approach
       Combine multiple strategies
```

### User-Based CF Characteristics

| Aspect | Description |
|--------|-------------|
| Strength | Captures user taste patterns |
| Weakness | Scalability (O(m²) for m users) |
| Best For | Datasets with more products than users |
| Updates | Similarity matrix needs recomputation |
| Novelty | Can recommend niche items if similar users liked them |

### Similarity Matrix Caching

```
Cache Strategy for User Similarity Matrix

First Call (Cold):
├── Compute full m×m similarity matrix
├── Time: O(m² × n) where n = products
├── Cache in memory or Redis
└── Expiration: 24 hours or on new data

Subsequent Calls (Warm):
├── Retrieve from cache
├── Time: O(1)
├── Massive speedup
└── Refresh periodically
```

### Recommendation Output Format

```json
[
  {
    "product_id": 1234,
    "product_name": "Samsung Galaxy S24",
    "score": 4.67,
    "confidence": 0.93,
    "reason": "Users similar to you also purchased this",
    "similar_users_count": 18,
    "method": "user_based_cf"
  },
  {
    "product_id": 5678,
    "product_name": "Apple AirPods Pro",
    "score": 4.23,
    "confidence": 0.87,
    "reason": "Frequently bought by similar customers",
    "similar_users_count": 15,
    "method": "user_based_cf"
  }
]
```

### Diversity Enhancement

```
Maximal Marginal Relevance (MMR)

Goal: Balance relevance and diversity

For each candidate product p:
  MMR(p) = λ × relevance(p) 
           - (1-λ) × max_similarity(p, already_selected)

Where:
- λ = 0.7 (balance parameter)
- relevance(p) = recommendation score
- max_similarity = highest similarity to already selected items
- Iteratively select products with highest MMR

Result: Diverse recommendations across categories
```

### Expected Outcome
- Functional user_based_cf method generating personalized recommendations
- Similar user discovery based on interaction patterns
- Weighted aggregation of neighbor preferences
- Proper handling of cold start and edge cases
- Formatted recommendations with scores and explanations

### Verification Checklist
- [ ] user_based_cf method implemented with correct signature
- [ ] Customer validation checks existence in mapping
- [ ] Cold start problem handled appropriately
- [ ] User similarity matrix computed or retrieved from cache
- [ ] Similar users found using _find_neighbors
- [ ] Recommendation scores computed with weighted aggregation
- [ ] Products filtered to exclude already-interacted items
- [ ] Results ranked by score and limited to top_k
- [ ] Recommendations formatted with product details and explanations
- [ ] Logging added for monitoring and debugging
- [ ] Method returns list of recommendation dictionaries

---

## Task 58: Create item_based CF

### Overview
Implement the item-based collaborative filtering method that generates recommendations by finding similar products and recommending them based on what the customer has already interacted with. This approach answers: "Users who bought this product also bought these products." It's computationally efficient and produces stable recommendations.

### Dependencies
- Task 56: Create CollaborativeFilter
- Task 57: Create user_based CF (for reference)

### Instructions

1. **Define the item_based_cf method**
   - Method name: `item_based_cf`
   - Parameters: `customer_id` (int), `top_k` (int, default=10)
   - Return type: `List[Dict]` (list of recommendation dictionaries)
   - Add docstring explaining item-based CF algorithm

2. **Validate customer exists**
   - Check if customer_id exists in customer_mapping
   - If not found, return empty list or raise ValueError
   - Log warning for missing customers

3. **Get customer's interaction history**
   - Extract customer's rating vector from matrix (row)
   - Identify products the customer has interacted with (non-zero ratings)
   - Store as list of tuples: [(product_idx, rating), ...]
   - Sort by rating descending to prioritize strong interactions

4. **Check for cold start problem**
   - If customer has no interactions, handle cold start
   - Return popular products or empty list with explanation
   - Log cold start scenario

5. **Compute or retrieve item similarity matrix**
   - Check if item_similarity_matrix already computed
   - If not, compute: `_compute_similarity_matrix(matrix.T, axis=0)`
   - Transpose matrix so columns become rows (products)
   - Cache result in self.item_similarity_matrix for future calls

6. **Find similar items for each interacted product**
   - Loop through customer's interacted products
   - For each product_idx:
     - Call `_find_neighbors(item_similarity_matrix, product_idx, n_neighbors)`
     - Returns similar products with similarity scores
     - Store results: Dict[product_idx, List[(similar_idx, sim_score)]]

7. **Aggregate recommendations from similar items**
   - Create score accumulator: defaultdict(float)
   - For each interacted product and its similar items:
     - For each similar_item:
       - Calculate contribution: customer_rating × similarity_score
       - Add to score accumulator: scores[similar_item] += contribution
   - This weights similar items by both similarity and customer preference

8. **Exclude already-interacted products**
   - Filter out products customer already interacted with
   - Recommendation should only include novel products
   - Store product_ids to exclude in set for efficient lookup

9. **Normalize and rank scores**
   - Normalize scores by dividing by total similarity weights
   - Sort products by normalized score descending
   - Select top K products

10. **Format recommendations**
    - For each recommended product_id:
      - Get product details from database
      - Calculate confidence score
      - Generate explanation: "Because you liked X, Y, Z..."
      - List 2-3 reference products (what customer interacted with)
      - Create recommendation dict with fields:
        - product_id, product_name, score, confidence, reason, reference_products
    - Return list of recommendation dictionaries

11. **Add recency weighting (optional)**
    - Weight recent interactions higher than old ones
    - Formula: contribution = rating × similarity × recency_weight
    - Recency_weight = 1.0 for recent, 0.5 for 6+ months old
    - Makes recommendations more responsive to recent behavior

12. **Log recommendation metrics**
    - Log number of interacted products used
    - Log average similarity scores
    - Log score distribution
    - Log execution time

### Item-Based CF Algorithm Flow

```
┌─────────────────────────────────────────┐
│  Input: Customer ID, Top K              │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│  1. Get Customer's Interaction History  │
│     Extract non-zero ratings            │
│     Result: [(P1, 5.0), (P3, 3.0), ...] │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│  2. Compute Item Similarity Matrix      │
│     (if not cached)                     │
│     Transpose matrix, compute cosine    │
│     Result: n×n matrix (n = products)   │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│  3. Find Similar Items for Each         │
│     For P1: find top N similar products │
│     For P3: find top N similar products │
│     Result: Dict[product → neighbors]   │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│  4. Aggregate Weighted Scores           │
│     For each similar item:              │
│       score += rating × similarity      │
│     Exclude already-interacted products │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│  5. Normalize & Rank                    │
│     score / Σ(similarities)             │
│     Sort descending                     │
│     Select top K                        │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│  Output: List of Recommended Products   │
│  [{id, name, score, reason, refs}, ...] │
└─────────────────────────────────────────┘
```

### Example Calculation

```
Customer A has interacted with:
  P1 (Laptop): rating = 5.0 (purchased)
  P3 (Mouse): rating = 3.0 (added to cart)

Similar Items Found:
  For P1 (Laptop):
    - P5 (Monitor): similarity = 0.82
    - P7 (Keyboard): similarity = 0.75
  
  For P3 (Mouse):
    - P7 (Keyboard): similarity = 0.68
    - P9 (USB Hub): similarity = 0.60

Recommendation Scores:
  P5: 5.0 × 0.82 = 4.10
  P7: (5.0 × 0.75) + (3.0 × 0.68) = 3.75 + 2.04 = 5.79
  P9: 3.0 × 0.60 = 1.80

Ranking: P7 > P5 > P9
```

### Item-Based vs User-Based Comparison

| Aspect | User-Based | Item-Based |
|--------|------------|------------|
| Similarity | Between users | Between products |
| Matrix Size | m × m (users) | n × n (products) |
| Scalability | Poor for many users | Better for many users |
| Stability | Changes as users change | More stable over time |
| Explanation | "Similar users liked..." | "Because you liked X..." |
| Cold Start | Struggles with new users | Struggles with new items |
| Computation | Recompute frequently | Recompute less often |

### Item Similarity Matrix Caching

```
Item Similarity Matrix Characteristics

Size: n × n (n = number of products)
- Typically smaller than user matrix (fewer products than users)
- More stable (product catalog changes slowly)
- Longer cache validity (24-48 hours)

Cache Strategy:
├── Compute during off-peak hours
├── Store in Redis or in-memory
├── Update when new products added
└── Partial updates for modified products
```

### Recommendation Output Format

```json
[
  {
    "product_id": 5678,
    "product_name": "Wireless Keyboard",
    "score": 5.79,
    "confidence": 0.95,
    "reason": "Frequently purchased with products you liked",
    "reference_products": [
      {"id": 1234, "name": "Laptop", "similarity": 0.75},
      {"id": 3456, "name": "Mouse", "similarity": 0.68}
    ],
    "method": "item_based_cf"
  },
  {
    "product_id": 9012,
    "product_name": "Monitor",
    "score": 4.10,
    "confidence": 0.82,
    "reason": "Similar to products you viewed",
    "reference_products": [
      {"id": 1234, "name": "Laptop", "similarity": 0.82}
    ],
    "method": "item_based_cf"
  }
]
```

### Aggregation Weight Strategies

| Strategy | Formula | Use Case |
|----------|---------|----------|
| Uniform | rating × similarity | Basic, treats all interactions equally |
| Recency Weighted | rating × similarity × recency | Emphasize recent behavior |
| Type Weighted | rating × similarity × type_weight | Purchases > carts > views |
| Normalized | Divide by Σ similarities | Prevent score inflation |

### Performance Optimization

```
Optimization Techniques for Item-Based CF

1. Pre-compute Item Similarities
   ├── Compute during nightly batch job
   ├── Store top 100 similar items per product
   └── Reduces real-time computation

2. Sparse Matrix Operations
   ├── Use scipy.sparse for memory efficiency
   ├── Only store non-zero similarities
   └── 100× memory reduction

3. Top-K Heap
   ├── Use heapq for top-K selection
   ├── O(n log k) instead of O(n log n)
   └── Faster for large product catalogs

4. Batch Processing
   ├── Process multiple customers together
   ├── Amortize matrix access overhead
   └── GPU acceleration for large batches
```

### Item-Based CF Advantages

```
Why Item-Based CF Often Outperforms User-Based:

1. Scalability
   └── Fewer products than users typically
   └── Smaller similarity matrix

2. Stability
   └── Product relationships stable over time
   └── Less frequent recomputation needed

3. Explainability
   └── "Because you bought X" is intuitive
   └── Users understand the recommendation

4. Performance
   └── Similarity matrix cached longer
   └── Faster recommendation generation

5. Quality
   └── More stable recommendations
   └── Less sensitive to data sparsity
```

### Cold Start Handling

```
Item Cold Start (New Product)
├── No user interactions yet
├── No similarity to compute
└── Solutions:
    ├── Content-based similarity
    ├── Vendor/brand relationships
    └── Category-based fallback

User Cold Start (New Customer)
├── No interaction history
├── Cannot find similar items
└── Solutions:
    ├── Popular products
    ├── Demographic-based
    └── Ask for preferences
```

### Expected Outcome
- Functional item_based_cf method generating recommendations
- Similar item discovery based on product relationships
- Weighted aggregation considering customer preferences and item similarities
- Proper handling of cold start and edge cases
- Formatted recommendations with reference products and explanations

### Verification Checklist
- [ ] item_based_cf method implemented with correct signature
- [ ] Customer validation checks existence in mapping
- [ ] Customer interaction history extracted correctly
- [ ] Cold start problem handled appropriately
- [ ] Item similarity matrix computed or retrieved from cache
- [ ] Similar items found for each interacted product
- [ ] Scores aggregated with proper weighting (rating × similarity)
- [ ] Already-interacted products excluded from results
- [ ] Results normalized and ranked by score
- [ ] Recommendations formatted with reference products
- [ ] Explanations generated showing why item was recommended
- [ ] Logging added for monitoring
- [ ] Method returns list of recommendation dictionaries

---

## Task 59: Create MatrixFactorization

### Overview
Create the `MatrixFactorization` class that implements matrix factorization techniques (SVD - Singular Value Decomposition, or NMF - Non-negative Matrix Factorization) to discover latent factors in the user-item interaction matrix. This advanced technique decomposes the matrix into lower-dimensional user and item factor matrices, enabling more sophisticated and accurate recommendations by capturing hidden patterns in user preferences.

### Dependencies
- Task 58: Create item_based CF

### Instructions

1. **Create matrix factorization module file**
   - Navigate to `backend/apps/ai/recommendations/algorithms/`
   - Create new file named `matrix_factorization.py`
   - This module houses matrix factorization algorithms

2. **Import required dependencies**
   - Import NumPy for matrix operations
   - Import scipy.sparse for sparse matrix handling
   - Import sklearn.decomposition (TruncatedSVD, NMF)
   - Import typing utilities for type hints
   - Import Optional, Tuple for return types

3. **Define the MatrixFactorization class**
   - Create class with comprehensive docstring
   - Explain concept: Decompose R ≈ U × V^T
   - R = user-item matrix, U = user factors, V = item factors
   - Document that this discovers latent features

4. **Add class constructor**
   - Accept `n_factors` parameter (default: 50) - number of latent dimensions
   - Accept `n_epochs` parameter (default: 20) - training iterations
   - Accept `learning_rate` parameter (default: 0.01) - gradient descent LR
   - Accept `regularization` parameter (default: 0.1) - L2 regularization
   - Accept `algorithm` parameter (default: "svd") - "svd" or "nmf"
   - Store all hyperparameters as instance attributes

5. **Initialize factor matrices**
   - `user_factors`: Will store user latent factor matrix (m × k)
   - `item_factors`: Will store item latent factor matrix (n × k)
   - Where m = users, n = items, k = n_factors
   - Set to None initially, populated during training

6. **Add model metadata attributes**
   - `is_trained`: Boolean flag, False initially
   - `training_loss`: List to track loss per epoch
   - `training_time`: Float for total training duration
   - `convergence_epoch`: Int, which epoch reached convergence

7. **Implement SVD factorization method**
   - Method: `_fit_svd(matrix)` - private method
   - Use sklearn.decomposition.TruncatedSVD
   - Set n_components = n_factors
   - Fit to sparse matrix
   - Extract components as item_factors
   - Transform matrix to get user_factors
   - Return (user_factors, item_factors)

8. **Implement NMF factorization method (alternative)**
   - Method: `_fit_nmf(matrix)` - private method
   - Use sklearn.decomposition.NMF
   - Set n_components = n_factors
   - Set initialization method (e.g., "nndsvd")
   - Fit to dense matrix (NMF requires non-negative, dense)
   - Convert sparse to dense if needed
   - Return (user_factors, item_factors)

9. **Implement custom SGD training (optional advanced)**
   - Method: `_fit_sgd(matrix)` - private method for custom training
   - Initialize user_factors and item_factors randomly (small values)
   - For each epoch (n_epochs):
     - Shuffle non-zero entries
     - For each non-zero rating:
       - Compute prediction: u_factors[i] · v_factors[j]
       - Compute error: rating - prediction
       - Update factors using gradient descent
       - u_factors[i] += lr × (error × v_factors[j] - reg × u_factors[i])
       - v_factors[j] += lr × (error × u_factors[i] - reg × v_factors[j])
     - Compute and store epoch loss
     - Check for convergence (loss change < threshold)
   - Return (user_factors, item_factors)

10. **Add prediction method**
    - Method: `predict(user_idx, item_idx)` - predict rating
    - Compute dot product: user_factors[user_idx] · item_factors[item_idx]
    - Return predicted rating as float
    - Handle index out of bounds gracefully

11. **Add batch prediction method**
    - Method: `predict_all()` - reconstruct full matrix
    - Compute: user_factors × item_factors^T
    - Returns predicted ratings for all user-item pairs
    - Useful for generating recommendations for all users

12. **Add model saving/loading methods (optional)**
    - Method: `save_model(filepath)` - serialize factors to disk
    - Method: `load_model(filepath)` - deserialize factors from disk
    - Use NumPy save/load or pickle for serialization

### Matrix Factorization Concept

```
Matrix Factorization (SVD/NMF)

Original Matrix R (m × n):

        P1   P2   P3   P4   P5
U1    [ 5    0    3    0    1  ]
U2    [ 0    4    5    0    0  ]
U3    [ 2    0    0    4    5  ]
U4    [ 0    5    4    0    3  ]

Factorize into:

User Factors U (m × k):      Item Factors V (n × k):

       F1   F2   F3                F1   F2   F3
U1   [ 0.9  0.2  0.1 ]      P1   [ 1.1  0.3  0.2 ]
U2   [ 0.1  1.0  0.3 ]      P2   [ 0.2  1.2  0.4 ]
U3   [ 0.3  0.1  1.1 ]      P3   [ 0.8  0.9  0.1 ]
U4   [ 0.2  0.9  0.4 ]      P4   [ 0.1  0.2  1.0 ]
                             P5   [ 0.3  0.4  0.9 ]

Reconstruction: R ≈ U × V^T

Prediction for U1, P2:
= U1 · P2^T
= [0.9, 0.2, 0.1] · [0.2, 1.2, 0.4]
= 0.9×0.2 + 0.2×1.2 + 0.1×0.4
= 0.18 + 0.24 + 0.04
= 0.46 (low → not recommended)
```

### Latent Factors Interpretation

```
Latent Factors = Hidden Features

For Movies Example:
Factor 1: "Action" intensity
Factor 2: "Romance" intensity
Factor 3: "Comedy" intensity

User Vector [0.9, 0.2, 0.1]:
- Loves action movies (0.9)
- Dislikes romance (0.2)
- Not into comedy (0.1)

Movie Vector [1.1, 0.3, 0.2]:
- Very action-heavy (1.1)
- Some romance (0.3)
- Little comedy (0.2)

Dot Product = 0.9×1.1 + 0.2×0.3 + 0.1×0.2
            = 1.09 (HIGH → recommended!)
```

### Class Architecture

```
┌────────────────────────────────────────┐
│      MatrixFactorization               │
├────────────────────────────────────────┤
│ Attributes:                            │
│ - n_factors: int = 50                  │
│ - n_epochs: int = 20                   │
│ - learning_rate: float = 0.01          │
│ - regularization: float = 0.1          │
│ - algorithm: str = "svd"               │
│ - user_factors: ndarray (m × k)        │
│ - item_factors: ndarray (n × k)        │
│ - is_trained: bool = False             │
│ - training_loss: List[float]           │
├────────────────────────────────────────┤
│ Methods:                               │
│ + train(matrix) → model                │
│ + predict(user_idx, item_idx) → float │
│ + predict_all() → matrix               │
│ + recommend(user_idx, k) → list        │
│ - _fit_svd(matrix) → factors           │
│ - _fit_nmf(matrix) → factors           │
│ - _fit_sgd(matrix) → factors           │
│ + save_model(path)                     │
│ + load_model(path)                     │
└────────────────────────────────────────┘
```

### SVD vs NMF Comparison

| Aspect | SVD | NMF |
|--------|-----|-----|
| Full Name | Singular Value Decomposition | Non-negative Matrix Factorization |
| Factors | Can be negative | Must be non-negative |
| Sparsity | Handles sparse matrices well | Better with dense, non-negative |
| Speed | Faster (TruncatedSVD) | Slower, iterative |
| Interpretability | Abstract factors | More interpretable (parts-based) |
| Use Case | General CF | When non-negativity meaningful |

### Hyperparameter Tuning

| Parameter | Low Value | Medium Value | High Value | Impact |
|-----------|-----------|--------------|------------|--------|
| n_factors | 10-20 | 50 | 100-200 | More factors = more capacity |
| n_epochs | 10 | 20 | 50+ | More epochs = better fit |
| learning_rate | 0.001 | 0.01 | 0.1 | Higher LR = faster, less stable |
| regularization | 0.01 | 0.1 | 1.0 | Higher reg = less overfitting |

### Gradient Descent Update Rules

```
Stochastic Gradient Descent (SGD) for Matrix Factorization

For each rating r_ui (user u, item i):

1. Compute Prediction:
   r̂_ui = u_factors[u] · i_factors[i]

2. Compute Error:
   e_ui = r_ui - r̂_ui

3. Compute Gradients:
   ∂L/∂u_f = -2 × e_ui × i_factors[i,f] + 2 × λ × u_factors[u,f]
   ∂L/∂i_f = -2 × e_ui × u_factors[u,f] + 2 × λ × i_factors[i,f]

4. Update Factors:
   u_factors[u,f] += α × (e_ui × i_factors[i,f] - λ × u_factors[u,f])
   i_factors[i,f] += α × (e_ui × u_factors[u,f] - λ × i_factors[i,f])

Where:
- α = learning_rate
- λ = regularization
- f = factor index
```

### Loss Function

```
Objective: Minimize Reconstruction Error + Regularization

Loss = Σ (r_ui - r̂_ui)² + λ × (||U||² + ||V||²)
       all ratings

Components:
1. Reconstruction Error: Σ (r_ui - r̂_ui)²
   - How well does U×V^T approximate R?

2. Regularization: λ × (||U||² + ||V||²)
   - Prevent overfitting to training data
   - Keep factor magnitudes small

Convergence:
- Loss decreases each epoch
- Stop when loss change < threshold (e.g., 0.001)
```

### Training Process

```
┌─────────────────────────────────────┐
│ 1. Initialize                       │
│    - Random small user_factors      │
│    - Random small item_factors      │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│ 2. For Each Epoch (20 iterations)   │
│    ┌───────────────────────────┐   │
│    │ For Each Rating r_ui      │   │
│    │   - Compute error         │   │
│    │   - Update user factors   │   │
│    │   - Update item factors   │   │
│    └───────────────────────────┘   │
│    - Compute epoch loss             │
│    - Check convergence              │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│ 3. Finalize                         │
│    - Store trained factors          │
│    - Set is_trained = True          │
│    - Return model                   │
└─────────────────────────────────────┘
```

### Convergence Monitoring

```python
Example Loss Trajectory:

Epoch  Loss      Change
─────────────────────────
1      12.456    -
2      8.234     -4.222
3      6.123     -2.111
4      5.012     -1.111
5      4.456     -0.556
...
18     2.103     -0.008
19     2.099     -0.004  ← Converged (< 0.01)
20     2.098     -0.001

Convergence criteria:
- Absolute change < 0.01
- Relative change < 0.1%
- Or max epochs reached
```

### Expected Outcome
- MatrixFactorization class with configurable hyperparameters
- SVD implementation using TruncatedSVD
- Optional NMF implementation
- Optional custom SGD training loop
- Prediction methods for individual and batch predictions
- Model serialization for persistence

### Verification Checklist
- [ ] `backend/apps/ai/recommendations/algorithms/matrix_factorization.py` created
- [ ] MatrixFactorization class defined with constructor parameters
- [ ] Hyperparameters stored (n_factors, n_epochs, learning_rate, regularization)
- [ ] Factor matrices initialized (user_factors, item_factors)
- [ ] SVD method implemented using TruncatedSVD
- [ ] Optional NMF method implemented
- [ ] Optional custom SGD method implemented
- [ ] Prediction method for individual user-item pairs
- [ ] Batch prediction method for full matrix reconstruction
- [ ] Model metadata tracking (is_trained, training_loss)
- [ ] Proper type hints and docstrings
- [ ] Error handling for edge cases

---

## Task 60: Create train Method

### Overview
Implement the `train` method in the MatrixFactorization class that orchestrates the training process, validates inputs, selects the appropriate algorithm, executes the factorization, and stores the resulting user and item factor matrices. This method is the main entry point for training the matrix factorization model.

### Dependencies
- Task 59: Create MatrixFactorization

### Instructions

1. **Define the train method signature**
   - Method name: `train`
   - Parameter: `matrix` (scipy.sparse.csr_matrix) - user-item interaction matrix
   - Return type: `self` (for method chaining)
   - Add comprehensive docstring with parameters and returns

2. **Validate input matrix**
   - Check that matrix is not None
   - Check that matrix is 2-dimensional
   - Check that matrix shape is (m, n) where m > 0, n > 0
   - Check that matrix contains non-zero elements
   - Raise ValueError with descriptive message if validation fails

3. **Log training start**
   - Log matrix dimensions: m users, n items
   - Log hyperparameters: n_factors, n_epochs, learning_rate, regularization
   - Log selected algorithm (svd, nmf, or sgd)
   - Log sparsity level of matrix

4. **Record start time**
   - Store current timestamp for computing training duration
   - Use time.time() or datetime.now()

5. **Select and execute algorithm**
   - Based on self.algorithm parameter:
     - If "svd": call self._fit_svd(matrix)
     - If "nmf": call self._fit_nmf(matrix)
     - If "sgd": call self._fit_sgd(matrix)
     - Else: raise ValueError for unknown algorithm
   - Store returned factors in self.user_factors and self.item_factors

6. **Validate factor matrices**
   - Check that user_factors shape is (m, n_factors)
   - Check that item_factors shape is (n, n_factors)
   - Check for NaN or Inf values in factors
   - Raise RuntimeError if factor matrices are invalid

7. **Compute final reconstruction error**
   - Reconstruct matrix: predictions = user_factors × item_factors^T
   - Compute RMSE (Root Mean Square Error) on non-zero entries
   - Formula: RMSE = sqrt(mean((actual - predicted)²))
   - Store in self.final_rmse attribute

8. **Record training completion**
   - Set self.is_trained = True
   - Compute training duration: end_time - start_time
   - Store in self.training_time attribute
   - Log training completion with duration and RMSE

9. **Add model statistics method**
   - Method: `get_training_stats()` returns dict
   - Include: n_factors, n_epochs, training_time, final_rmse
   - Include: algorithm used, convergence epoch (if applicable)
   - Include: matrix dimensions and sparsity
   - Useful for model evaluation and comparison

10. **Add recommendation generation method**
    - Method: `recommend(user_idx, top_k=10, exclude_interacted=True)`
    - Get user's factor vector: self.user_factors[user_idx]
    - Compute scores for all items: user_factors[user_idx] × item_factors^T
    - If exclude_interacted, filter out items user already rated
    - Sort by score descending
    - Return top K item indices with scores
    - Format: List[(item_idx, predicted_score)]

11. **Implement error handling**
    - Wrap training in try-except block
    - Catch and log sklearn exceptions (convergence warnings, etc.)
    - Catch memory errors for large matrices
    - Provide fallback strategies or informative error messages
    - Ensure graceful degradation

12. **Add model persistence integration**
    - After successful training, optionally auto-save model
    - Use model versioning (e.g., model_v1_2026-01-31.npz)
    - Store metadata alongside factors (hyperparameters, stats)

### Training Method Flow

```
┌─────────────────────────────────────────┐
│  Input: User-Item Matrix (m × n)       │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│  1. Validate Input Matrix               │
│     - Check dimensions                  │
│     - Check for non-zero entries        │
│     - Raise error if invalid            │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│  2. Log Training Parameters             │
│     - Matrix size: m × n                │
│     - Hyperparameters                   │
│     - Algorithm selection               │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│  3. Execute Factorization Algorithm     │
│     ┌─────────────────────────────┐    │
│     │ If SVD:                     │    │
│     │   TruncatedSVD.fit()        │    │
│     ├─────────────────────────────┤    │
│     │ If NMF:                     │    │
│     │   NMF.fit()                 │    │
│     ├─────────────────────────────┤    │
│     │ If SGD:                     │    │
│     │   Custom gradient descent   │    │
│     └─────────────────────────────┘    │
│     Result: user_factors, item_factors  │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│  4. Validate Factor Matrices            │
│     - Check shapes (m×k, n×k)           │
│     - Check for NaN/Inf                 │
│     - Raise error if invalid            │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│  5. Compute Reconstruction Error        │
│     - Reconstruct: U × V^T              │
│     - Compute RMSE on known ratings     │
│     - Store final_rmse                  │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│  6. Finalize Training                   │
│     - Set is_trained = True             │
│     - Record training_time              │
│     - Log completion                    │
│     - Return self                       │
└─────────────────────────────────────────┘
```

### Input Validation Checks

| Validation | Check | Error Message |
|------------|-------|---------------|
| Not None | matrix is not None | "Matrix cannot be None" |
| Dimensions | matrix.ndim == 2 | "Matrix must be 2-dimensional" |
| Shape | m > 0 and n > 0 | "Matrix dimensions must be positive" |
| Non-empty | matrix.nnz > 0 | "Matrix has no non-zero entries" |
| Sparsity | nnz / (m×n) < 0.5 | Warning: "Matrix is dense, consider alternatives" |

### Training Statistics Output

```json
{
  "algorithm": "svd",
  "n_factors": 50,
  "n_epochs": 20,
  "learning_rate": 0.01,
  "regularization": 0.1,
  "matrix_shape": [15000, 5000],
  "matrix_sparsity": 0.998,
  "training_time_seconds": 45.3,
  "final_rmse": 0.87,
  "convergence_epoch": 18,
  "user_factors_shape": [15000, 50],
  "item_factors_shape": [5000, 50],
  "model_size_mb": 3.2,
  "timestamp": "2026-01-31T10:30:00Z"
}
```

### RMSE Calculation

```
Root Mean Square Error (RMSE)

For all known ratings (i, j) where r_ij ≠ 0:

predictions = user_factors × item_factors^T

RMSE = √(1/N × Σ (r_ij - predictions_ij)²)

Where:
- N = number of non-zero ratings
- Lower RMSE = better fit

Interpretation:
- RMSE = 0.5: Excellent fit
- RMSE = 1.0: Good fit
- RMSE = 2.0: Acceptable fit
- RMSE > 3.0: Poor fit, tune hyperparameters
```

### Recommendation Generation Flow

```
recommend(user_idx=42, top_k=10)
│
├─ 1. Get User Factor Vector
│      user_vector = user_factors[42]  # Shape: (50,)
│
├─ 2. Compute Scores for All Items
│      scores = user_vector × item_factors^T  # Shape: (5000,)
│
├─ 3. Get User's Interaction History
│      interacted_items = matrix[42].nonzero()[1]
│
├─ 4. Filter Out Interacted Items
│      scores[interacted_items] = -inf
│
├─ 5. Sort by Score Descending
│      sorted_indices = argsort(scores)[::-1]
│
├─ 6. Select Top K
│      top_k_indices = sorted_indices[:10]
│      top_k_scores = scores[top_k_indices]
│
└─ 7. Return Recommendations
       [(item_idx, score), ...]
```

### Error Handling Strategy

| Error Type | Handling | Recovery |
|------------|----------|----------|
| Invalid Matrix | Raise ValueError immediately | User must fix input |
| Memory Error | Log error, reduce n_factors | Retry with smaller factors |
| Convergence Failure | Log warning, continue | Use result even if not converged |
| NaN in Factors | Raise RuntimeError | Reduce learning_rate, retry |
| Sklearn Exception | Log exception, re-raise | User must debug |

### Model Persistence Format

```
Model Save Format (.npz file)

model_v1_2026-01-31.npz:
├── user_factors: ndarray (m × k)
├── item_factors: ndarray (n × k)
├── metadata: dict
│   ├── n_factors: 50
│   ├── algorithm: "svd"
│   ├── training_time: 45.3
│   ├── final_rmse: 0.87
│   ├── timestamp: "2026-01-31T10:30:00Z"
│   └── matrix_shape: [15000, 5000]

Load with:
- np.load('model.npz')
- Reconstruct MatrixFactorization instance
- Set user_factors and item_factors
```

### Training Performance Benchmarks

| Matrix Size | n_factors | Algorithm | Time | Memory |
|-------------|-----------|-----------|------|--------|
| 10K × 1K | 50 | SVD | 5s | 200MB |
| 50K × 5K | 50 | SVD | 45s | 1GB |
| 100K × 10K | 50 | SVD | 3min | 2.5GB |
| 10K × 1K | 50 | SGD (20 epochs) | 2min | 150MB |
| 50K × 5K | 50 | SGD (20 epochs) | 15min | 800MB |

### Expected Outcome
- Functional train method that orchestrates factorization process
- Input validation ensuring data quality
- Algorithm selection and execution
- Factor matrix validation and storage
- Training statistics and RMSE computation
- Recommendation generation capability
- Robust error handling and logging

### Verification Checklist
- [ ] train method implemented with correct signature
- [ ] Input matrix validation checks all conditions
- [ ] Training parameters logged before execution
- [ ] Start time recorded for duration tracking
- [ ] Algorithm selection based on self.algorithm
- [ ] Appropriate factorization method called
- [ ] Factor matrices validated for shape and values
- [ ] RMSE computed on known ratings
- [ ] is_trained flag set to True
- [ ] Training time computed and stored
- [ ] get_training_stats method returns comprehensive dict
- [ ] recommend method generates top-K recommendations
- [ ] Error handling wraps training process
- [ ] Method returns self for chaining
- [ ] Logging statements at key points

---

## Summary

This document covered the implementation of advanced personalized recommendation algorithms using collaborative filtering and matrix factorization. You've built the user-item interaction matrix with weighted implicit ratings, implemented both user-based and item-based collaborative filtering with cosine similarity, and created matrix factorization models using SVD to discover latent factors for sophisticated recommendations.

### Completed Tasks
1. ✓ Created UserItemMatrix class with customer/product mappings
2. ✓ Implemented build_matrix method constructing sparse CSR matrices
3. ✓ Created implicit_ratings system weighting views/carts/purchases
4. ✓ Built CollaborativeFilter class with similarity computations
5. ✓ Implemented user_based_cf finding similar users for recommendations
6. ✓ Implemented item_based_cf finding similar products for recommendations
7. ✓ Created MatrixFactorization class with SVD/NMF algorithms
8. ✓ Implemented train method orchestrating factorization process

### Key Concepts Covered
- **User-Item Matrix**: Sparse matrix representation of customer interactions
- **Implicit Ratings**: Converting actions (views, carts, purchases) to numeric weights
- **Collaborative Filtering**: Finding patterns in user behavior for recommendations
- **Cosine Similarity**: Measuring similarity between users or products
- **Matrix Factorization**: Discovering latent factors using SVD/NMF
- **Cold Start Handling**: Strategies for new users and products
- **Recommendation Scoring**: Weighted aggregation of neighbor preferences

### Algorithms Implemented

| Algorithm | Type | Complexity | Scalability | Best For |
|-----------|------|------------|-------------|----------|
| User-Based CF | Memory-based | O(m²n) | Moderate | Similar user patterns |
| Item-Based CF | Memory-based | O(n²m) | Better | Product relationships |
| Matrix Factorization | Model-based | O(mnk) | Excellent | Large-scale systems |

### Files Created
- `backend/apps/ai/recommendations/algorithms/collaborative.py` - Collaborative filtering implementations
- `backend/apps/ai/recommendations/algorithms/matrix_factorization.py` - Matrix factorization with SVD/NMF

### Integration Points
These algorithms integrate with:
- **RecommendationEngine** (Group-C): Main orchestrator calling these algorithms
- **CustomerInteraction model**: Source of interaction data
- **Product and Customer models**: Entity data and metadata
- **Cache layer**: Storing similarity matrices and factor matrices
- **API endpoints**: Serving recommendations to frontend

### Next Steps
Proceed to [02_Tasks-61-68_Service-Cache-Verify.md](02_Tasks-61-68_Service-Cache-Verify.md) to:
- Create RecommendationService for orchestrating all algorithms
- Implement caching strategies for similarity matrices and factors
- Build verification and testing utilities
- Create API endpoints for serving recommendations
- Implement A/B testing framework
- Add monitoring and performance tracking
- Create recommendation explanations for users
- Integrate with frontend webstore

### Performance Considerations
- Pre-compute and cache similarity matrices (24-48 hour expiry)
- Use sparse matrices for memory efficiency
- Implement batch processing for multiple users
- Consider GPU acceleration for large-scale factorization
- Monitor RMSE and recommendation quality metrics
- Tune hyperparameters based on business metrics (CTR, conversion)

### Business Impact
These personalized recommendation algorithms drive:
- **Increased Sales**: Cross-selling and upselling opportunities
- **Customer Engagement**: Personalized shopping experiences
- **Discovery**: Helping customers find relevant products
- **Retention**: Improving customer satisfaction and loyalty
- **Competitive Advantage**: AI-powered recommendations differentiate LCC

