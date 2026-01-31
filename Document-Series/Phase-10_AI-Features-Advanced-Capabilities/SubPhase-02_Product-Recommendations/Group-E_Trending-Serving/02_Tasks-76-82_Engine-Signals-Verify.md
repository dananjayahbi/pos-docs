# Tasks 76-82: Recommendation Engine and Signals

> **Phase:** 10 - AI Features & Advanced Capabilities  
> **SubPhase:** 02 - Product Recommendations  
> **Group:** E - Trending & Serving  
> **Document:** 02 of 02  
> **Tasks Covered:** 76, 77, 78, 79, 80, 81, 82

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-69-75_Trending-Cache.md](01_Tasks-69-75_Trending-Cache.md)
- **→ Next Group:** [Group-F_API-Frontend](../Group-F_API-Frontend/)

---

## Document Overview

This document covers the implementation of the unified recommendation engine and Django signals integration. The RecommendationEngine serves as a Facade pattern that provides a single interface to access all recommendation services (FBT, similar products, personalized recommendations, and trending products). The engine simplifies API development by offering consistent methods that delegate to specialized services. Additionally, this document covers the implementation of Django signals to automatically track user interactions (product views, cart additions, purchases) and update recommendation models in real-time.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 76 | Create RecommendationEngine | High | 60 min |
| 77 | Create Engine get_fbt | Low | 15 min |
| 78 | Create Engine get_similar | Low | 15 min |
| 79 | Create Engine get_personalized | Low | 15 min |
| 80 | Create Engine get_trending | Low | 15 min |
| 81 | Create Recommendation Signals | Medium | 45 min |
| 82 | Verify Engine | Low | 30 min |

---

## Task 76: Create RecommendationEngine

### Overview
Create the RecommendationEngine class that serves as a unified Facade interface for all recommendation services. This engine provides a single entry point for accessing FBT recommendations, similar products, personalized recommendations, and trending products. By implementing the Facade design pattern, the engine simplifies the interaction with multiple recommendation services, handles initialization of service instances, manages error handling consistently, and provides a clean API for controllers to use. This centralized approach ensures consistent behavior across all recommendation types.

### Dependencies
- Task 75: Create Trending Cache (from previous document)
- Task 56: Create FBTService (from Group C)
- Task 62: Create SimilarProductsService (from Group D)
- Task 68: Create PersonalizedService (from Group D)
- Task 69: Create TrendingService (from previous document)

### Instructions

1. **Create engine file structure**
   - Navigate to `backend/apps/ai/recommendations/services/` directory
   - Create new file named `engine.py`
   - This file contains the RecommendationEngine class

2. **Import required dependencies**
   - Import logging for monitoring and debugging
   - Import typing modules (List, Optional, Dict, Any)
   - Import all recommendation services:
     - FBTService from fbt_service
     - SimilarProductsService from similar_products_service
     - PersonalizedService from personalized_service
     - TrendingService from trending_service
   - Import Product model
   - Import Django cache framework

3. **Define RecommendationEngine class**
   - Create class named `RecommendationEngine`
   - This class implements the Facade design pattern
   - Initialize logger for monitoring
   - Add docstring explaining Facade pattern purpose

4. **Create initialization method**
   - Define `__init__` method
   - Initialize service instances as None
   - Use lazy initialization pattern
   - Services instantiated on first use

5. **Implement lazy service initialization**
   - Create private method `_get_fbt_service()`
   - Check if self._fbt_service is None
   - If None, instantiate FBTService()
   - Cache instance in self._fbt_service
   - Return service instance

6. **Implement similar products service getter**
   - Create private method `_get_similar_service()`
   - Check if self._similar_service is None
   - If None, instantiate SimilarProductsService()
   - Cache instance in self._similar_service
   - Return service instance

7. **Implement personalized service getter**
   - Create private method `_get_personalized_service()`
   - Check if self._personalized_service is None
   - If None, instantiate PersonalizedService()
   - Cache instance in self._personalized_service
   - Return service instance

8. **Implement trending service getter**
   - Create private method `_get_trending_service()`
   - Check if self._trending_service is None
   - If None, instantiate TrendingService()
   - Cache instance in self._trending_service
   - Return service instance

9. **Add error handling wrapper**
   - Create private method `_handle_error(method_name, error)`
   - Log error with method name and exception details
   - Return empty list as fallback
   - Add user-friendly error message to logs

10. **Add method stubs for delegation**
    - Create placeholder methods for get_fbt (Task 77)
    - Create placeholder methods for get_similar (Task 78)
    - Create placeholder methods for get_personalized (Task 79)
    - Create placeholder methods for get_trending (Task 80)
    - Add TODO comments for implementation

### Facade Design Pattern

```
┌─────────────────────────────────────────────┐
│        RecommendationEngine (Facade)        │
├─────────────────────────────────────────────┤
│  + get_fbt(product_id, limit)               │
│  + get_similar(product_id, limit)           │
│  + get_personalized(customer_id, limit)     │
│  + get_trending(category_id, limit)         │
├─────────────────────────────────────────────┤
│  - _get_fbt_service()                       │
│  - _get_similar_service()                   │
│  - _get_personalized_service()              │
│  - _get_trending_service()                  │
│  - _handle_error(method, error)             │
└─────────────────────────────────────────────┘
         │           │            │          │
         ▼           ▼            ▼          ▼
    ┌─────────┐ ┌────────┐ ┌──────────┐ ┌──────────┐
    │   FBT   │ │Similar │ │Personal. │ │Trending  │
    │Service  │ │Service │ │Service   │ │Service   │
    └─────────┘ └────────┘ └──────────┘ └──────────┘
```

### Lazy Initialization Pattern

```
First Call to get_fbt():
    ├── _get_fbt_service() called
    ├── self._fbt_service is None
    ├── Create new FBTService()
    ├── Store in self._fbt_service
    └── Return service instance

Second Call to get_fbt():
    ├── _get_fbt_service() called
    ├── self._fbt_service exists
    └── Return cached instance (no new instantiation)

Benefits:
├── Memory efficiency (only create needed services)
├── Faster initialization (deferred creation)
└── Resource optimization (no unused instances)
```

### Service Initialization Flow

| Service | Private Getter | Lazy Init | Purpose |
|---------|---------------|-----------|---------|
| FBTService | `_get_fbt_service()` | Yes | Frequently bought together |
| SimilarProductsService | `_get_similar_service()` | Yes | Similar products |
| PersonalizedService | `_get_personalized_service()` | Yes | Customer-specific |
| TrendingService | `_get_trending_service()` | Yes | Trending products |

### Error Handling Strategy

```
Try-Catch Pattern:
    try:
        service = self._get_service()
        results = service.method(params)
        return results
    except Exception as e:
        self._handle_error('method_name', e)
        return []

Benefits:
├── Graceful degradation (empty list instead of crash)
├── Consistent logging (all errors tracked)
├── User experience protection (no 500 errors)
└── Debug information (exception details logged)
```

### Class Attributes

| Attribute | Type | Purpose |
|-----------|------|---------|
| _fbt_service | FBTService | None | Cached FBT service instance |
| _similar_service | SimilarProductsService | None | Cached similar service instance |
| _personalized_service | PersonalizedService | None | Cached personalized service |
| _trending_service | TrendingService | None | Cached trending service |
| logger | Logger | Logging instance for monitoring |

### Expected Outcome
- RecommendationEngine class created with Facade pattern
- Lazy initialization for all services
- Centralized error handling
- Foundation for delegation methods

### Verification Checklist
- [ ] `backend/apps/ai/recommendations/services/engine.py` created
- [ ] RecommendationEngine class defined
- [ ] Lazy initialization methods for all services
- [ ] Error handling method implemented
- [ ] Logger initialized
- [ ] Imports for all required services
- [ ] Docstrings added for class and methods

---

## Task 77: Create Engine get_fbt

### Overview
Implement the get_fbt method in the RecommendationEngine class. This method provides a unified interface to retrieve frequently bought together (FBT) recommendations for a given product. The method delegates to the FBTService, handling initialization, error management, and result formatting. This delegation pattern ensures the engine maintains a consistent API while leveraging specialized service logic.

### Dependencies
- Task 76: Create RecommendationEngine

### Instructions

1. **Define get_fbt method signature**
   - Method name: `get_fbt`
   - Parameters:
     - product_id: int (required)
     - limit: int = 5 (optional, default 5)
   - Return type: List[Product]
   - Add docstring explaining purpose and parameters

2. **Implement method logic**
   - Add try-except block for error handling
   - Call `self._get_fbt_service()` to get service instance
   - Call service's `get_frequently_bought_together` method
   - Pass product_id and limit parameters
   - Return result directly

3. **Add exception handling**
   - Catch Exception as e
   - Call `self._handle_error('get_fbt', e)`
   - Return empty list on error

4. **Add parameter validation**
   - Verify product_id is positive integer
   - Verify limit is between 1 and 50
   - Log validation errors if parameters invalid
   - Return empty list if validation fails

5. **Add method documentation**
   - Document expected return format
   - Explain limit parameter behavior
   - Note error handling approach
   - Provide usage examples in docstring

### Method Flow Diagram

```
get_fbt(product_id, limit=5)
    │
    ├── Validate Parameters
    │   ├── product_id > 0?
    │   └── 1 ≤ limit ≤ 50?
    │
    ├── Get Service Instance
    │   └── _get_fbt_service()
    │
    ├── Delegate to Service
    │   └── service.get_frequently_bought_together(product_id, limit)
    │
    ├── Return Results
    │   └── List[Product]
    │
    └── On Error
        ├── _handle_error('get_fbt', e)
        └── return []
```

### Delegation Pattern

```
API Layer:
    recommendations = engine.get_fbt(product_id=123, limit=5)

Engine Layer (Facade):
    service = _get_fbt_service()
    return service.get_frequently_bought_together(123, 5)

Service Layer:
    [FBT calculation logic from Task 56]
    return list of products

Benefits:
├── Clean API (simple method signature)
├── Encapsulation (hides service complexity)
├── Flexibility (can change service implementation)
└── Consistency (all engines methods work same way)
```

### Parameter Validation

| Parameter | Validation | Error Behavior |
|-----------|------------|----------------|
| product_id | Must be > 0 | Log error, return [] |
| limit | Must be 1-50 | Clamp to range or return [] |
| product_id | Must exist | Let service handle |

### Usage Examples

```
Example 1: Default Limit
    engine = RecommendationEngine()
    products = engine.get_fbt(product_id=123)
    # Returns up to 5 FBT products

Example 2: Custom Limit
    engine = RecommendationEngine()
    products = engine.get_fbt(product_id=123, limit=10)
    # Returns up to 10 FBT products

Example 3: Error Handling
    engine = RecommendationEngine()
    products = engine.get_fbt(product_id=-1)
    # Validation fails, returns []
```

### Return Format

| Field | Type | Description |
|-------|------|-------------|
| Return | List[Product] | Ordered list of products |
| Order | Score descending | Highest confidence first |
| Empty | [] | No recommendations or error |
| Limit | ≤ limit | Never exceeds requested limit |

### Expected Outcome
- get_fbt method implemented and functional
- Proper delegation to FBTService
- Parameter validation in place
- Error handling implemented

### Verification Checklist
- [ ] get_fbt method defined in RecommendationEngine
- [ ] Docstring added with parameters and return type
- [ ] Parameter validation implemented
- [ ] Service delegation working
- [ ] Try-except block for error handling
- [ ] Empty list returned on error
- [ ] Method tested with valid product_id

---

## Task 78: Create Engine get_similar

### Overview
Implement the get_similar method in the RecommendationEngine class. This method provides access to similar product recommendations based on product attributes, categories, and features. The method delegates to SimilarProductsService, maintaining the same pattern as get_fbt for consistency across the engine's API.

### Dependencies
- Task 76: Create RecommendationEngine

### Instructions

1. **Define get_similar method signature**
   - Method name: `get_similar`
   - Parameters:
     - product_id: int (required)
     - limit: int = 10 (optional, default 10)
   - Return type: List[Product]
   - Add docstring explaining purpose

2. **Implement method logic**
   - Add try-except block for error handling
   - Call `self._get_similar_service()` to get service instance
   - Call service's `get_similar_products` method
   - Pass product_id and limit parameters
   - Return result directly

3. **Add exception handling**
   - Catch Exception as e
   - Call `self._handle_error('get_similar', e)`
   - Return empty list on error

4. **Add parameter validation**
   - Verify product_id is positive integer
   - Verify limit is between 1 and 50
   - Log validation errors if parameters invalid
   - Return empty list if validation fails

5. **Add method documentation**
   - Document similarity calculation approach
   - Explain limit parameter behavior
   - Note error handling approach
   - Provide usage examples in docstring

### Method Flow Diagram

```
get_similar(product_id, limit=10)
    │
    ├── Validate Parameters
    │   ├── product_id > 0?
    │   └── 1 ≤ limit ≤ 50?
    │
    ├── Get Service Instance
    │   └── _get_similar_service()
    │
    ├── Delegate to Service
    │   └── service.get_similar_products(product_id, limit)
    │
    ├── Return Results
    │   └── List[Product] (similar products)
    │
    └── On Error
        ├── _handle_error('get_similar', e)
        └── return []
```

### Delegation Pattern

```
API Layer:
    recommendations = engine.get_similar(product_id=456, limit=10)

Engine Layer (Facade):
    service = _get_similar_service()
    return service.get_similar_products(456, 10)

Service Layer:
    [Cosine similarity calculation from Task 62]
    return list of similar products

Benefits:
├── Consistent API across all recommendation types
├── Service encapsulation (complex logic hidden)
├── Testability (can mock service)
└── Maintainability (single point of change)
```

### Similarity Scoring Context

```
SimilarProductsService Criteria:
├── Category Match (40% weight)
├── Price Range (20% weight)
├── Brand Match (15% weight)
├── Attribute Overlap (15% weight)
└── Tag Similarity (10% weight)

Result Ordering:
└── Highest similarity score first
```

### Parameter Specifications

| Parameter | Default | Range | Purpose |
|-----------|---------|-------|---------|
| product_id | Required | > 0 | Source product for similarity |
| limit | 10 | 1-50 | Max similar products |

### Usage Examples

```
Example 1: Default Limit
    engine = RecommendationEngine()
    products = engine.get_similar(product_id=456)
    # Returns up to 10 similar products

Example 2: Custom Limit
    engine = RecommendationEngine()
    products = engine.get_similar(product_id=456, limit=20)
    # Returns up to 20 similar products

Example 3: Small Limit
    engine = RecommendationEngine()
    products = engine.get_similar(product_id=456, limit=3)
    # Returns up to 3 most similar products
```

### Return Characteristics

| Aspect | Behavior |
|--------|----------|
| Order | Descending by similarity score |
| Exclusion | Source product not included |
| Active Only | Only active products returned |
| Tenant Filter | Same tenant as source product |
| Stock Status | Optional filter (service decides) |

### Expected Outcome
- get_similar method implemented and functional
- Proper delegation to SimilarProductsService
- Consistent error handling with get_fbt
- Parameter validation in place

### Verification Checklist
- [ ] get_similar method defined in RecommendationEngine
- [ ] Docstring added with parameters and return type
- [ ] Parameter validation implemented
- [ ] Service delegation working
- [ ] Try-except block for error handling
- [ ] Empty list returned on error
- [ ] Method tested with valid product_id
- [ ] Consistent pattern with get_fbt

---

## Task 79: Create Engine get_personalized

### Overview
Implement the get_personalized method in the RecommendationEngine class. This method provides personalized product recommendations based on customer interaction history, preferences, and behavior patterns. The method delegates to PersonalizedService, which uses collaborative filtering to identify products that match the customer's profile and purchase patterns.

### Dependencies
- Task 76: Create RecommendationEngine

### Instructions

1. **Define get_personalized method signature**
   - Method name: `get_personalized`
   - Parameters:
     - customer_id: int (required)
     - limit: int = 10 (optional, default 10)
   - Return type: List[Product]
   - Add docstring explaining personalization approach

2. **Implement method logic**
   - Add try-except block for error handling
   - Call `self._get_personalized_service()` to get service
   - Call service's `get_personalized_recommendations` method
   - Pass customer_id and limit parameters
   - Return result directly

3. **Add exception handling**
   - Catch Exception as e
   - Call `self._handle_error('get_personalized', e)`
   - Return empty list on error

4. **Add parameter validation**
   - Verify customer_id is positive integer
   - Verify limit is between 1 and 50
   - Log validation errors if parameters invalid
   - Return empty list if validation fails

5. **Handle new customer scenario**
   - If customer has no interaction history
   - Service should fall back to trending products
   - Or popular products in preferred categories
   - Document fallback behavior in docstring

6. **Add method documentation**
   - Document personalization factors
   - Explain cold start handling
   - Note error handling approach
   - Provide usage examples

### Method Flow Diagram

```
get_personalized(customer_id, limit=10)
    │
    ├── Validate Parameters
    │   ├── customer_id > 0?
    │   └── 1 ≤ limit ≤ 50?
    │
    ├── Get Service Instance
    │   └── _get_personalized_service()
    │
    ├── Delegate to Service
    │   └── service.get_personalized_recommendations(customer_id, limit)
    │       │
    │       ├── Has Interaction History?
    │       │   ├── Yes: Collaborative Filtering
    │       │   └── No: Fallback to Trending
    │       │
    │       └── Return Personalized Products
    │
    ├── Return Results
    │   └── List[Product]
    │
    └── On Error
        ├── _handle_error('get_personalized', e)
        └── return []
```

### Delegation Pattern

```
API Layer:
    recommendations = engine.get_personalized(customer_id=789, limit=10)

Engine Layer (Facade):
    service = _get_personalized_service()
    return service.get_personalized_recommendations(789, 10)

Service Layer:
    [Collaborative filtering from Task 68]
    ├── Load customer interaction history
    ├── Calculate user-item matrix
    ├── Find similar customers
    ├── Recommend products they liked
    └── return list of personalized products

Benefits:
├── Personalized user experience
├── Higher conversion rates
├── Customer retention
└── Engagement improvement
```

### Personalization Factors

```
PersonalizedService Considers:
├── Product Views (weight: 1.0)
├── Cart Additions (weight: 2.0)
├── Purchases (weight: 5.0)
├── Category Preferences
├── Brand Preferences
├── Price Range Patterns
└── Time-based Patterns

Cold Start Strategy:
├── New Customer (<5 interactions)
│   └── Fallback to trending products
└── Established Customer (≥5 interactions)
    └── Collaborative filtering
```

### Parameter Specifications

| Parameter | Default | Range | Purpose |
|-----------|---------|-------|---------|
| customer_id | Required | > 0 | Target customer for personalization |
| limit | 10 | 1-50 | Max personalized products |

### Usage Examples

```
Example 1: Established Customer
    engine = RecommendationEngine()
    products = engine.get_personalized(customer_id=789)
    # Returns 10 products based on customer history

Example 2: New Customer
    engine = RecommendationEngine()
    products = engine.get_personalized(customer_id=999)
    # Customer has no history, returns trending products

Example 3: Custom Limit
    engine = RecommendationEngine()
    products = engine.get_personalized(customer_id=789, limit=20)
    # Returns up to 20 personalized products
```

### Return Characteristics

| Aspect | Behavior |
|--------|----------|
| Order | Descending by recommendation score |
| Exclusion | Already purchased products excluded |
| Active Only | Only active products returned |
| Tenant Filter | Same tenant as customer |
| Diversity | Mix of categories when possible |

### Cold Start Handling

```
Customer Interaction Count:
├── 0 interactions
│   └── Return trending products
├── 1-4 interactions
│   └── Blend: 50% trending + 50% category-based
└── 5+ interactions
    └── Full collaborative filtering
```

### Expected Outcome
- get_personalized method implemented and functional
- Proper delegation to PersonalizedService
- Cold start scenario handled
- Consistent error handling

### Verification Checklist
- [ ] get_personalized method defined in RecommendationEngine
- [ ] Docstring added with parameters and return type
- [ ] Parameter validation implemented
- [ ] Service delegation working
- [ ] Try-except block for error handling
- [ ] Empty list returned on error
- [ ] Method tested with existing customer
- [ ] Method tested with new customer (cold start)
- [ ] Consistent pattern with other engine methods

---

## Task 80: Create Engine get_trending

### Overview
Implement the get_trending method in the RecommendationEngine class. This method provides access to trending products based on sales velocity and temporal decay factors. The method delegates to TrendingService and supports optional category filtering to show trending products within specific categories. This is the final delegation method in the engine, completing the unified recommendation interface.

### Dependencies
- Task 76: Create RecommendationEngine

### Instructions

1. **Define get_trending method signature**
   - Method name: `get_trending`
   - Parameters:
     - category_id: Optional[int] = None (optional, for category filter)
     - limit: int = 20 (optional, default 20)
   - Return type: List[Product]
   - Add docstring explaining trending calculation

2. **Implement method logic**
   - Add try-except block for error handling
   - Call `self._get_trending_service()` to get service instance
   - If category_id is None:
     - Call service's `get_trending` method
   - If category_id is provided:
     - Call service's `category_trending` method
   - Pass appropriate parameters
   - Return result directly

3. **Add exception handling**
   - Catch Exception as e
   - Call `self._handle_error('get_trending', e)`
   - Return empty list on error

4. **Add parameter validation**
   - Verify category_id is positive integer if provided
   - Verify limit is between 1 and 100
   - Log validation errors if parameters invalid
   - Return empty list if validation fails

5. **Implement category filtering logic**
   - Check if category_id is None
   - Route to appropriate service method
   - Ensure consistent return format

6. **Add method documentation**
   - Document trending calculation approach
   - Explain category filtering behavior
   - Note cache usage from Task 75
   - Provide usage examples

### Method Flow Diagram

```
get_trending(category_id=None, limit=20)
    │
    ├── Validate Parameters
    │   ├── category_id > 0 (if provided)?
    │   └── 1 ≤ limit ≤ 100?
    │
    ├── Get Service Instance
    │   └── _get_trending_service()
    │
    ├── Route Based on Category
    │   │
    │   ├── category_id is None
    │   │   └── service.get_trending(limit)
    │   │       └── Returns global trending
    │   │
    │   └── category_id is provided
    │       └── service.category_trending(category_id, limit)
    │           └── Returns category trending
    │
    ├── Return Results
    │   └── List[Product] (cached, from Task 75)
    │
    └── On Error
        ├── _handle_error('get_trending', e)
        └── return []
```

### Delegation Pattern

```
API Layer - Global Trending:
    recommendations = engine.get_trending(limit=20)

Engine Layer (Facade):
    service = _get_trending_service()
    return service.get_trending(20)

Service Layer:
    [Sales velocity + time decay from Task 72]
    └── return cached trending products

---

API Layer - Category Trending:
    recommendations = engine.get_trending(category_id=5, limit=10)

Engine Layer (Facade):
    service = _get_trending_service()
    return service.category_trending(5, 10)

Service Layer:
    [Category-specific trending from Task 73]
    └── return cached category trending
```

### Trending Calculation Context

```
TrendingService Formula:
    Trending Score = Sales Velocity × Time Decay Factor

Sales Velocity (from Task 70):
    velocity = total_sales / days

Time Decay (from Task 71):
    decay = 0.95 ^ days_ago

Example:
    Product A: 20 sales/day × 1.0 (today) = 20.0
    Product B: 15 sales/day × 0.95 (yesterday) = 14.25
    Product C: 30 sales/day × 0.70 (7 days ago) = 21.0

Ranking: A (20.0) > C (21.0) > B (14.25)
```

### Parameter Specifications

| Parameter | Default | Range | Purpose |
|-----------|---------|-------|---------|
| category_id | None | > 0 or None | Filter to specific category |
| limit | 20 | 1-100 | Max trending products |

### Category Filtering Behavior

```
No Category (category_id=None):
├── Returns global trending products
├── All categories included
├── Sorted by trending score
└── Cache key: trending:{tenant}

With Category (category_id=5):
├── Returns trending in category only
├── Products must be in category
├── Sorted by trending score within category
└── Cache key: trending:{tenant}:category:{id}
```

### Usage Examples

```
Example 1: Global Trending
    engine = RecommendationEngine()
    products = engine.get_trending()
    # Returns 20 trending products across all categories

Example 2: Category Trending
    engine = RecommendationEngine()
    products = engine.get_trending(category_id=5, limit=10)
    # Returns 10 trending products in category 5

Example 3: Large Limit
    engine = RecommendationEngine()
    products = engine.get_trending(limit=50)
    # Returns up to 50 trending products

Example 4: Homepage Widget
    engine = RecommendationEngine()
    top_trending = engine.get_trending(limit=8)
    # Returns 8 products for homepage trending widget
```

### Return Characteristics

| Aspect | Behavior |
|--------|----------|
| Order | Descending by trending score |
| Cache | Results cached for 4 hours (Task 75) |
| Active Only | Only active products returned |
| In Stock | Depends on service implementation |
| Tenant Filter | Same tenant only |

### Cache Integration

```
Cache Flow (from Task 75):
├── Check Redis cache
│   ├── Hit: Return cached results
│   └── Miss: Calculate trending
│       ├── Compute trending scores
│       ├── Store in cache (TTL: 4 hours)
│       └── Return results
└── Background update via TrendingTask (Task 74)
```

### Expected Outcome
- get_trending method implemented and functional
- Category filtering working correctly
- Proper delegation to TrendingService
- Cache integration from Task 75

### Verification Checklist
- [ ] get_trending method defined in RecommendationEngine
- [ ] Docstring added with parameters and return type
- [ ] Parameter validation implemented
- [ ] Service delegation working
- [ ] Category filtering logic correct
- [ ] Try-except block for error handling
- [ ] Empty list returned on error
- [ ] Method tested with global trending
- [ ] Method tested with category trending
- [ ] Cache working (verified in Task 75)
- [ ] All four engine methods now complete

---

## Task 81: Create Recommendation Signals

### Overview
Create Django signals to automatically track user interactions with products and update the recommendation system in real-time. Implement three critical signals: product_viewed (when customer views product detail page), product_added_to_cart (when customer adds product to cart), and product_purchased (when order is completed). These signals create CustomerInteraction records with appropriate interaction types and weights, enabling the personalized recommendation system to learn from user behavior.

### Dependencies
- Task 80: Create Engine get_trending
- CustomerInteraction model (from Group A)
- Product model
- Order model
- Cart model

### Instructions

1. **Create signals file structure**
   - Navigate to `backend/apps/ai/recommendations/` directory
   - Create new file named `signals.py`
   - This file contains all recommendation-related signals

2. **Import required dependencies**
   - Import Django signals (post_save, pre_save)
   - Import receiver decorator
   - Import models: Product, Order, OrderItem, Cart, CartItem
   - Import CustomerInteraction model
   - Import logging for debugging
   - Import timezone utilities

3. **Define interaction type constants**
   - Create constant VIEW = 'VIEW'
   - Create constant CART = 'CART'
   - Create constant PURCHASE = 'PURCHASE'
   - Add comment explaining each type

4. **Implement product_viewed signal receiver**
   - Create function `handle_product_view`
   - Decorate with @receiver for appropriate signal
   - Parameters: sender, instance, created, **kwargs
   - Signal connects to ProductView model save
   - Only execute if created=True (new view)

5. **Implement product_viewed logic**
   - Extract customer_id from instance
   - Extract product_id from instance
   - Create CustomerInteraction record:
     - customer: customer_id
     - product: product_id
     - interaction_type: VIEW
     - interaction_weight: 1.0
   - Use get_or_create to avoid duplicates
   - Log interaction creation
   - Handle exceptions gracefully

6. **Implement product_added_to_cart signal receiver**
   - Create function `handle_cart_addition`
   - Decorate with @receiver for CartItem post_save
   - Parameters: sender, instance, created, **kwargs
   - Only execute if created=True (new cart item)

7. **Implement cart addition logic**
   - Extract customer from instance.cart.customer
   - Extract product from instance.product
   - Create CustomerInteraction record:
     - customer: customer
     - product: product
     - interaction_type: CART
     - interaction_weight: 2.0
   - Use get_or_create to avoid duplicates
   - Log interaction creation
   - Handle exceptions gracefully

8. **Implement product_purchased signal receiver**
   - Create function `handle_purchase`
   - Decorate with @receiver for Order post_save
   - Parameters: sender, instance, created, **kwargs
   - Check if order status is COMPLETED

9. **Implement purchase logic**
   - Check if order.status == 'COMPLETED'
   - Only create interactions for completed orders
   - Iterate through order.items.all()
   - For each OrderItem:
     - Extract customer from order.customer
     - Extract product from item.product
     - Create CustomerInteraction record:
       - customer: customer
       - product: product
       - interaction_type: PURCHASE
       - interaction_weight: 5.0
     - Use get_or_create to avoid duplicates
   - Log total interactions created
   - Handle exceptions gracefully

10. **Add signal registration**
    - Create default_app_config in __init__.py
    - Or use ready() method in apps.py
    - Import signals.py to register receivers
    - Document signal registration process

### Signal Architecture

```
User Actions → Django Signals → CustomerInteraction Records → Personalization

┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│ Product View │──────▶│product_viewed│──────▶│  CREATE VIEW │
│ Detail Page  │      │   signal     │      │ interaction  │
└──────────────┘      └──────────────┘      └──────────────┘
        │
        │                                    weight: 1.0

┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│  Add to Cart │──────▶│cart_addition │──────▶│  CREATE CART │
│    Button    │      │   signal     │      │ interaction  │
└──────────────┘      └──────────────┘      └──────────────┘
        │
        │                                    weight: 2.0

┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│Order Complete│──────▶│   purchase   │──────▶│CREATE PURCHASE│
│   Checkout   │      │   signal     │      │ interaction  │
└──────────────┘      └──────────────┘      └──────────────┘
        │
        │                                    weight: 5.0
```

### Interaction Weights

| Interaction Type | Weight | Rationale |
|------------------|--------|-----------|
| VIEW | 1.0 | Low intent, exploratory browsing |
| CART | 2.0 | Medium intent, considering purchase |
| PURCHASE | 5.0 | High intent, strong signal |

### Weight Impact on Recommendations

```
Customer A Interactions:
├── Viewed Product 1 (weight: 1.0)
├── Viewed Product 2 (weight: 1.0)
├── Added Product 2 to cart (weight: 2.0)
└── Purchased Product 2 (weight: 5.0)

Product 2 Total Weight: 1.0 + 2.0 + 5.0 = 8.0
Product 1 Total Weight: 1.0

Recommendation Score:
└── Products similar to Product 2 ranked higher
    (due to stronger interaction signals)
```

### Signal Receivers

| Signal | Sender | Trigger | Creates |
|--------|--------|---------|---------|
| post_save | ProductView | Product detail page visit | VIEW interaction |
| post_save | CartItem | Add to cart action | CART interaction |
| post_save | Order | Order status = COMPLETED | PURCHASE interactions |

### ProductView Signal Flow

```
1. Customer visits /products/123/
2. ProductView model created
3. post_save signal triggered
4. handle_product_view() executed
5. CustomerInteraction created:
   - customer: current_customer
   - product: product_id=123
   - interaction_type: VIEW
   - interaction_weight: 1.0
6. PersonalizedService uses this data
```

### Cart Addition Signal Flow

```
1. Customer clicks "Add to Cart"
2. CartItem model created
3. post_save signal triggered
4. handle_cart_addition() executed
5. CustomerInteraction created:
   - customer: cart.customer
   - product: cart_item.product
   - interaction_type: CART
   - interaction_weight: 2.0
6. Stronger signal than VIEW
```

### Purchase Signal Flow

```
1. Customer completes checkout
2. Order status set to COMPLETED
3. post_save signal triggered
4. handle_purchase() executed
5. For each OrderItem:
   - CustomerInteraction created
   - interaction_type: PURCHASE
   - interaction_weight: 5.0
6. Strongest signal for recommendations
```

### Duplicate Handling

```
get_or_create Usage:

First View of Product 123:
├── Check if interaction exists
├── Not found
├── Create new CustomerInteraction
└── Return (interaction, created=True)

Second View of Product 123:
├── Check if interaction exists
├── Found existing interaction
├── Don't create duplicate
└── Return (interaction, created=False)

Alternative: Update timestamp
├── Use update_or_create
├── Update created_at field
└── Tracks most recent interaction
```

### Error Handling Strategy

```
try:
    # Create interaction
    CustomerInteraction.objects.get_or_create(...)
    logger.info(f"Created {type} interaction...")
except Exception as e:
    logger.error(f"Failed to create interaction: {e}")
    # Don't raise - signal should not break user flow

Benefits:
├── User experience not affected by logging failures
├── Errors logged for debugging
├── Recommendation system degraded but functional
└── Non-critical path failure isolation
```

### Signal Registration

```
Method 1: apps.py ready()
class RecommendationsConfig(AppConfig):
    def ready(self):
        import apps.ai.recommendations.signals

Method 2: __init__.py
default_app_config = 'apps.ai.recommendations.apps.RecommendationsConfig'

Method 3: settings.py INSTALLED_APPS
INSTALLED_APPS = [
    'apps.ai.recommendations.apps.RecommendationsConfig',
]
```

### Expected Outcome
- Django signals created for three interaction types
- Automatic CustomerInteraction creation
- Real-time recommendation data collection
- Proper error handling and logging

### Verification Checklist
- [ ] `backend/apps/ai/recommendations/signals.py` created
- [ ] All required imports added
- [ ] Interaction type constants defined
- [ ] handle_product_view function implemented
- [ ] handle_cart_addition function implemented
- [ ] handle_purchase function implemented
- [ ] @receiver decorators applied correctly
- [ ] get_or_create used to prevent duplicates
- [ ] Error handling implemented
- [ ] Logging statements added
- [ ] Signals registered in apps.py or __init__.py
- [ ] Interaction weights match specifications

---

## Task 82: Verify Engine

### Overview
Perform comprehensive verification of the RecommendationEngine and all related services to ensure the complete recommendation system is working correctly. This task involves testing each engine method, verifying signal integration, checking cache performance, and validating the entire recommendation flow from user interaction to recommendation delivery. Create test scenarios covering all recommendation types and edge cases.

### Dependencies
- Task 81: Create Recommendation Signals

### Instructions

1. **Create verification test file**
   - Navigate to `backend/apps/ai/recommendations/tests/` directory
   - Create or update file `test_engine_integration.py`
   - Import all necessary testing utilities

2. **Import required dependencies**
   - Import Django test framework (TestCase, TransactionTestCase)
   - Import RecommendationEngine
   - Import all service classes
   - Import models (Product, Customer, Order, CustomerInteraction)
   - Import signals module
   - Import cache framework

3. **Create test data fixtures**
   - Define setUp method
   - Create test tenant
   - Create test products (minimum 20 products)
   - Create test customers (minimum 5 customers)
   - Create test orders with order items
   - Create product relationships for FBT
   - Activate tenant schema

4. **Implement test_engine_initialization**
   - Create RecommendationEngine instance
   - Verify engine instantiates successfully
   - Verify lazy initialization (services are None initially)
   - Call each engine method once
   - Verify service instances created after first call
   - Verify service instances cached (same instance on second call)

5. **Implement test_get_fbt_method**
   - Create engine instance
   - Create test product with FBT relationships
   - Call engine.get_fbt(product_id)
   - Verify result is list
   - Verify result contains Product objects
   - Verify result length ≤ limit
   - Verify FBT logic correct (products bought together)
   - Test with invalid product_id (negative)
   - Verify empty list returned on error

6. **Implement test_get_similar_method**
   - Create engine instance
   - Create test products with similar attributes
   - Call engine.get_similar(product_id)
   - Verify result is list
   - Verify result contains Product objects
   - Verify result length ≤ limit
   - Verify similarity scoring (same category ranked higher)
   - Test with invalid product_id
   - Verify empty list returned on error

7. **Implement test_get_personalized_method**
   - Create engine instance
   - Create test customer with interaction history
   - Create CustomerInteraction records
   - Call engine.get_personalized(customer_id)
   - Verify result is list
   - Verify result contains Product objects
   - Verify result length ≤ limit
   - Verify personalization (based on interactions)
   - Test with new customer (no interactions)
   - Verify fallback to trending
   - Test with invalid customer_id
   - Verify empty list returned on error

8. **Implement test_get_trending_method**
   - Create engine instance
   - Create test orders to generate sales data
   - Populate trending cache using TrendingTask
   - Call engine.get_trending()
   - Verify result is list
   - Verify result contains Product objects
   - Verify result length ≤ limit
   - Verify trending calculation (recent sales ranked higher)
   - Test with category_id parameter
   - Verify category filtering works
   - Test with invalid category_id
   - Verify empty list returned on error

9. **Implement test_signals_integration**
   - Create test customer and product
   - Verify no CustomerInteraction exists initially
   - Create ProductView instance
   - Verify VIEW interaction created automatically
   - Create CartItem instance
   - Verify CART interaction created automatically
   - Create Order with status COMPLETED
   - Verify PURCHASE interactions created for all items
   - Verify interaction weights correct
   - Verify no duplicate interactions created

10. **Implement test_error_handling**
    - Mock service methods to raise exceptions
    - Call engine methods
    - Verify exceptions caught gracefully
    - Verify empty lists returned
    - Verify errors logged
    - Verify user experience not disrupted

11. **Implement test_cache_performance**
    - Clear cache
    - Call engine.get_trending()
    - Measure execution time (first call, no cache)
    - Call engine.get_trending() again
    - Measure execution time (second call, from cache)
    - Verify cache hit is faster
    - Verify cache TTL respected (4 hours)

12. **Implement test_limit_parameters**
    - Test each engine method with various limits
    - Verify limit=1 returns max 1 product
    - Verify limit=50 returns max 50 products
    - Verify limit=0 returns empty list
    - Verify limit=1000 clamped or handled properly
    - Verify negative limits handled gracefully

13. **Implement test_cross_tenant_isolation**
    - Create two test tenants
    - Create products in each tenant
    - Switch to tenant A
    - Call engine methods
    - Verify only tenant A products returned
    - Switch to tenant B
    - Call engine methods
    - Verify only tenant B products returned
    - Verify no data leakage between tenants

14. **Create manual verification script**
    - Create Django management command `verify_recommendations`
    - Command tests engine in live environment
    - Run all engine methods with sample data
    - Print results to console
    - Report success/failure for each method
    - Provide usage instructions

15. **Document verification results**
    - Create verification report document
    - List all tests performed
    - Document success/failure status
    - Note any issues found
    - Provide recommendations for fixes
    - Update README with verification status

### Test Structure

```
test_engine_integration.py
│
├── setUp()
│   ├── Create test tenant
│   ├── Create test products
│   ├── Create test customers
│   ├── Create test orders
│   └── Activate tenant schema
│
├── Test Cases
│   ├── test_engine_initialization
│   ├── test_get_fbt_method
│   ├── test_get_similar_method
│   ├── test_get_personalized_method
│   ├── test_get_trending_method
│   ├── test_signals_integration
│   ├── test_error_handling
│   ├── test_cache_performance
│   ├── test_limit_parameters
│   └── test_cross_tenant_isolation
│
└── tearDown()
    └── Clean up test data
```

### Verification Scenarios

| Scenario | Expected Outcome |
|----------|------------------|
| Engine initialization | All services lazy-loaded |
| FBT recommendations | Related products returned |
| Similar products | Similar items by attributes |
| Personalized (existing) | Based on interaction history |
| Personalized (new) | Falls back to trending |
| Trending (global) | Recent best-sellers returned |
| Trending (category) | Category-specific trending |
| View signal | VIEW interaction created |
| Cart signal | CART interaction created |
| Purchase signal | PURCHASE interactions created |
| Error handling | Graceful degradation, no crash |
| Cache performance | Second call faster |
| Tenant isolation | No cross-tenant data |

### Manual Testing Commands

```
Test Engine Methods:
$ python manage.py shell
>>> from apps.ai.recommendations.services.engine import RecommendationEngine
>>> engine = RecommendationEngine()
>>> engine.get_fbt(product_id=1)
>>> engine.get_similar(product_id=1)
>>> engine.get_personalized(customer_id=1)
>>> engine.get_trending()

Test Signals:
$ python manage.py shell
>>> from apps.products.models import Product
>>> from apps.ai.recommendations.models import CustomerInteraction
>>> # Create ProductView
>>> # Check CustomerInteraction created

Test Cache:
$ python manage.py shell
>>> from django.core.cache import cache
>>> cache.get('trending:tenant_1')
>>> # Verify cached data

Run Tests:
$ python manage.py test apps.ai.recommendations.tests.test_engine_integration
```

### Verification Checklist

```
Engine Core:
├── [ ] RecommendationEngine instantiates
├── [ ] Lazy initialization works
├── [ ] Service caching works
└── [ ] Error handler catches exceptions

get_fbt Method:
├── [ ] Returns list of products
├── [ ] Respects limit parameter
├── [ ] FBT logic accurate
├── [ ] Handles invalid product_id
└── [ ] Empty list on error

get_similar Method:
├── [ ] Returns list of products
├── [ ] Respects limit parameter
├── [ ] Similarity scoring accurate
├── [ ] Handles invalid product_id
└── [ ] Empty list on error

get_personalized Method:
├── [ ] Returns list of products
├── [ ] Respects limit parameter
├── [ ] Uses interaction history
├── [ ] Falls back for new customers
├── [ ] Handles invalid customer_id
└── [ ] Empty list on error

get_trending Method:
├── [ ] Returns list of products
├── [ ] Respects limit parameter
├── [ ] Trending calculation accurate
├── [ ] Category filtering works
├── [ ] Handles invalid category_id
└── [ ] Cache integration working

Signals:
├── [ ] VIEW signal creates interaction
├── [ ] CART signal creates interaction
├── [ ] PURCHASE signal creates interactions
├── [ ] Correct interaction weights
├── [ ] No duplicate interactions
└── [ ] Errors logged, not raised

Performance:
├── [ ] Cache hit faster than miss
├── [ ] TTL respected (4 hours)
├── [ ] No N+1 query issues
└── [ ] Acceptable response times

Data Integrity:
├── [ ] Tenant isolation verified
├── [ ] No cross-tenant leakage
├── [ ] Active products only
└── [ ] Deleted products excluded
```

### Expected Outcomes

| Verification | Success Criteria |
|--------------|------------------|
| Unit Tests | All tests pass, 100% coverage |
| Integration Tests | End-to-end flow works |
| Performance | Cached < 100ms, Uncached < 2s |
| Error Handling | No uncaught exceptions |
| Signals | All interactions tracked |
| Cache | 4-hour TTL, proper invalidation |
| Tenant Isolation | No data leakage |

### Performance Benchmarks

```
Expected Response Times:

get_fbt:
├── Uncached: < 500ms
└── Cached: < 100ms

get_similar:
├── Uncached: < 800ms
└── Cached: < 100ms

get_personalized:
├── Uncached: < 1.5s
└── Cached: < 200ms

get_trending:
├── Uncached: < 2s
└── Cached: < 50ms (always cached)
```

### Common Issues and Solutions

| Issue | Symptom | Solution |
|-------|---------|----------|
| Service not initialized | AttributeError | Check lazy initialization |
| Empty results | [] returned | Verify test data exists |
| Cache miss | Slow response | Run TrendingTask first |
| Signal not firing | No interactions | Check signal registration |
| Tenant isolation | Wrong products | Verify tenant middleware |
| Test failures | Assertion errors | Check test data setup |

### Final Verification Report Template

```
Recommendation Engine Verification Report
==========================================

Date: [Date]
Tenant: [Tenant ID]
Environment: [Dev/Staging/Production]

Component Status:
├── RecommendationEngine: [PASS/FAIL]
├── FBTService: [PASS/FAIL]
├── SimilarProductsService: [PASS/FAIL]
├── PersonalizedService: [PASS/FAIL]
└── TrendingService: [PASS/FAIL]

Method Status:
├── get_fbt: [PASS/FAIL]
├── get_similar: [PASS/FAIL]
├── get_personalized: [PASS/FAIL]
└── get_trending: [PASS/FAIL]

Signal Status:
├── product_viewed: [PASS/FAIL]
├── product_added_to_cart: [PASS/FAIL]
└── product_purchased: [PASS/FAIL]

Performance:
├── Average Response Time: [X]ms
├── Cache Hit Rate: [X]%
└── Error Rate: [X]%

Issues Found: [Count]
[List issues with severity]

Recommendations:
[List any improvements needed]

Overall Status: [PASS/FAIL]
```

### Expected Outcome
- Complete test suite for recommendation engine
- All tests passing
- Signals working correctly
- Cache performance verified
- Tenant isolation confirmed
- Documentation updated

### Final Verification Checklist
- [ ] Test file created: `test_engine_integration.py`
- [ ] All test methods implemented
- [ ] Test data fixtures created
- [ ] All unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing performed
- [ ] Performance benchmarks met
- [ ] Error handling verified
- [ ] Signal integration working
- [ ] Cache performance acceptable
- [ ] Tenant isolation confirmed
- [ ] Management command created
- [ ] Verification report generated
- [ ] README updated with verification status
- [ ] All 82 tasks in SubPhase-02 complete

---

## Summary

This document completed the implementation of the unified recommendation engine and automatic interaction tracking through Django signals. The RecommendationEngine provides a clean Facade interface that simplifies access to all four recommendation types: FBT, similar products, personalized recommendations, and trending products. The engine implements lazy initialization for optimal resource usage and consistent error handling for graceful degradation.

The Django signals integration enables real-time learning from user behavior by automatically creating CustomerInteraction records for product views, cart additions, and purchases. These interactions feed the personalized recommendation system with weighted signals that reflect user intent and preferences.

Comprehensive verification ensures the entire recommendation system works correctly, with proper tenant isolation, cache performance, error handling, and signal integration.

### Completed Tasks
1. ✓ Created RecommendationEngine with Facade pattern
2. ✓ Implemented get_fbt delegation method
3. ✓ Implemented get_similar delegation method
4. ✓ Implemented get_personalized delegation method
5. ✓ Implemented get_trending delegation method
6. ✓ Created Django signals for interaction tracking
7. ✓ Verified complete engine functionality

### Files Created
- `backend/apps/ai/recommendations/services/engine.py`
- `backend/apps/ai/recommendations/signals.py`
- `backend/apps/ai/recommendations/tests/test_engine_integration.py`

### Next Steps
Proceed to [Group-F_API-Frontend](../Group-F_API-Frontend/) to create REST API endpoints, frontend components, and complete the webstore integration for the recommendation system.
