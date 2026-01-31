# Tasks 83-92: API Endpoints, Frontend Components & Integration Tests

> **Phase:** 10 - AI Features & Advanced Capabilities  
> **SubPhase:** 02 - Product Recommendations  
> **Group:** F - API & Frontend  
> **Document:** 01 of 01  
> **Tasks Covered:** 83, 84, 85, 86, 87, 88, 89, 90, 91, 92

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Group:** [../Group-E_Trending-Serving/00_GROUP_OVERVIEW.md](../Group-E_Trending-Serving/00_GROUP_OVERVIEW.md)
- **→ Next SubPhase:** [../../SubPhase-03_Demand-Forecasting/00_TASKS_SUMMARY.md](../../SubPhase-03_Demand-Forecasting/00_TASKS_SUMMARY.md)

---

## Document Overview

This document covers the creation of the recommendation API layer and frontend integration. It establishes REST API endpoints for all recommendation types (Frequently Bought Together, Similar Products, Personalized, and Trending), TypeScript type definitions, API client methods, React components for displaying recommendations, and comprehensive end-to-end integration tests.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 83 | Create Recommendation API Views | Medium | 45 min |
| 84 | Create FBT Endpoint | Low | 20 min |
| 85 | Create Similar Endpoint | Low | 25 min |
| 86 | Create Personalized Endpoint | Low | 25 min |
| 87 | Create Trending Endpoint | Low | 20 min |
| 88 | Create Recommendation Types | Low | 20 min |
| 89 | Create Recommendation API Client | Medium | 40 min |
| 90 | Create FBTCarousel Component | Medium | 50 min |
| 91 | Create SimilarProductsGrid | Medium | 50 min |
| 92 | Create Integration Tests | Medium | 60 min |

---

## Task 83: Create Recommendation API Views

### Overview
Create the base Django REST Framework ViewSet for recommendation endpoints. This ViewSet serves as the foundation for all recommendation API endpoints, handling common functionality like permission checking, error handling, response formatting, and interaction with the recommendation service layer created in earlier tasks.

### Dependencies
- Task 82: Create Recommendation Serving Layer (Group E)
- Phase-03 SubPhase-02: API Framework Setup
- Phase-04: Product models and serializers

### Instructions

1. **Navigate to API directory**
   - Go to `backend/apps/ai/recommendations/api/` directory
   - Create `views.py` file for ViewSet definitions

2. **Import required dependencies**
   - Import DRF viewsets, decorators, response classes
   - Import recommendation service from `services.py` (Task 82)
   - Import product serializers from product app
   - Import permission classes for authentication
   - Import cache utilities for caching responses

3. **Create base RecommendationViewSet**
   - Define main ViewSet class extending DRF ViewSet
   - Set basename to 'recommendations'
   - Configure permission classes (AllowAny for public endpoints)
   - Initialize recommendation service in constructor

4. **Implement common utility methods**
   - Create method to validate product_id parameter
   - Create method to validate limit parameter (default: 5, max: 20)
   - Create method to handle service errors gracefully
   - Create method to format recommendation responses

5. **Set up caching strategy**
   - Define cache key patterns for different endpoint types
   - Set cache TTL values (FBT: 1 hour, Similar: 1 hour, Personalized: 15 min, Trending: 30 min)
   - Implement cache invalidation on product updates

6. **Configure error handling**
   - Handle ProductNotFound exceptions → 404 response
   - Handle RecommendationNotAvailable → 200 with empty array
   - Handle service errors → 500 with proper error message
   - Add logging for debugging failed recommendations

7. **Add response serialization**
   - Use ProductSerializer to serialize recommended products
   - Include recommendation metadata (score, reason, rank)
   - Format response with pagination support for large result sets

### ViewSet Structure

```
RecommendationViewSet
├── Base Configuration
│   ├── permission_classes
│   ├── serializer_class
│   └── recommendation_service
├── Common Methods
│   ├── validate_product_id()
│   ├── validate_limit()
│   ├── handle_service_error()
│   └── format_response()
├── Endpoint Methods (Tasks 84-87)
│   ├── fbt()
│   ├── similar()
│   ├── personalized()
│   └── trending()
└── Cache Management
    ├── get_cache_key()
    └── invalidate_cache()
```

### Error Response Format

| Status Code | Scenario | Response Structure |
|-------------|----------|-------------------|
| 200 | Success | `{"results": [...], "count": int}` |
| 200 | No recommendations | `{"results": [], "count": 0}` |
| 400 | Invalid parameters | `{"error": "message", "code": "INVALID_PARAM"}` |
| 404 | Product not found | `{"error": "Product not found", "code": "NOT_FOUND"}` |
| 500 | Service error | `{"error": "Service unavailable", "code": "SERVICE_ERROR"}` |

### Caching Strategy

| Endpoint | Cache TTL | Cache Key Pattern | Invalidation Trigger |
|----------|-----------|-------------------|---------------------|
| FBT | 1 hour | `rec:fbt:{product_id}:{limit}` | Product update |
| Similar | 1 hour | `rec:similar:{product_id}:{limit}:{filters}` | Product update |
| Personalized | 15 min | `rec:personal:{user_id}:{limit}` | User activity |
| Trending | 30 min | `rec:trending:{category}:{limit}` | Scheduled update |

### Recommendation Response Schema

| Field | Type | Description |
|-------|------|-------------|
| id | integer | Product ID |
| name | string | Product name |
| slug | string | Product URL slug |
| price | decimal | Current price |
| image_url | string | Main product image |
| score | float | Recommendation score (0-1) |
| reason | string | Recommendation reason (optional) |
| rank | integer | Position in recommendation list |

### Expected Outcome
- Functional ViewSet with common recommendation logic
- Proper error handling and response formatting
- Caching layer for improved performance
- Foundation for specific endpoint implementations
- Logging infrastructure for monitoring

### Verification Checklist
- [ ] `backend/apps/ai/recommendations/api/views.py` file created
- [ ] RecommendationViewSet class defined
- [ ] Recommendation service integrated
- [ ] Error handling implemented
- [ ] Caching strategy configured
- [ ] Response serialization working
- [ ] Logging added for debugging

---

## Task 84: Create FBT Endpoint

### Overview
Create the Frequently Bought Together (FBT) API endpoint that returns products commonly purchased with a given product. This endpoint leverages the FBT service created in Group D and provides a simple, performant way for the frontend to display related product recommendations.

### Dependencies
- Task 83: Create Recommendation API Views
- Task 67: Create FBT Training Pipeline (Group D)
- Task 82: Create Recommendation Serving Layer (Group E)

### Instructions

1. **Add FBT action to ViewSet**
   - Define `fbt` method in RecommendationViewSet
   - Use DRF `@action` decorator with `detail=False`
   - Set HTTP methods to `['get']`
   - Set URL pattern to `/api/products/{id}/fbt/`

2. **Define query parameters**
   - Accept `product_id` as path parameter (required)
   - Accept `limit` as query parameter (optional, default: 5)
   - Validate product_id exists in database
   - Validate limit is between 1 and 20

3. **Implement endpoint logic**
   - Extract product_id from URL path
   - Extract limit from query parameters
   - Check cache for existing recommendations
   - Call recommendation service's `get_fbt()` method
   - Handle empty results gracefully

4. **Format response data**
   - Serialize recommended products with ProductSerializer
   - Include recommendation scores
   - Add metadata (algorithm used, timestamp)
   - Return paginated response if needed

5. **Add request validation**
   - Verify product exists and is active
   - Verify product has sufficient purchase history
   - Return appropriate error for inactive products
   - Log requests for analytics

6. **Implement response caching**
   - Cache successful responses for 1 hour
   - Include limit in cache key
   - Invalidate cache when product is updated
   - Use Redis for cache storage

### Endpoint Specification

| Property | Value |
|----------|-------|
| URL Pattern | `/api/products/{product_id}/fbt/` |
| HTTP Method | GET |
| Authentication | Not required (public) |
| Rate Limit | 100 requests/minute per IP |

### Request Parameters

| Parameter | Type | Required | Default | Validation | Description |
|-----------|------|----------|---------|------------|-------------|
| product_id | integer | Yes | - | Exists in DB | ID of anchor product |
| limit | integer | No | 5 | 1-20 | Max recommendations |

### Response Example Structure

```
{
  "product_id": 123,
  "recommendations": [
    {
      "id": 456,
      "name": "Product Name",
      "price": 2500.00,
      "image_url": "/media/products/image.jpg",
      "score": 0.85
    }
  ],
  "count": 5,
  "algorithm": "fbt_association_rules",
  "generated_at": "2026-01-31T10:30:00Z"
}
```

### URL Configuration

| Step | Description |
|------|-------------|
| 1 | Register ViewSet in `urls.py` with router |
| 2 | Set base name to 'recommendations' |
| 3 | FBT endpoint auto-generated at specified path |
| 4 | Include router in main API URLs |

### Caching Flow

```
Request Received
      ↓
Check Cache
      ↓
   Found? ──Yes──→ Return Cached Response
      ↓
     No
      ↓
Call Service
      ↓
Get Recommendations
      ↓
Cache Response (1h TTL)
      ↓
Return Response
```

### Expected Outcome
- Functional FBT API endpoint at specified URL
- Fast response times (< 100ms with cache)
- Proper validation and error handling
- Response caching for performance
- Analytics logging for monitoring

### Verification Checklist
- [ ] FBT action method added to ViewSet
- [ ] URL pattern configured correctly
- [ ] Query parameter validation implemented
- [ ] Service integration working
- [ ] Response format matches specification
- [ ] Caching layer active
- [ ] Error handling tested
- [ ] Endpoint accessible via HTTP client

---

## Task 85: Create Similar Endpoint

### Overview
Create the Similar Products API endpoint that returns products similar to a given product based on attributes, category, price range, and content-based filtering. This endpoint includes advanced filtering options for category and price, providing more control over recommendation results.

### Dependencies
- Task 83: Create Recommendation API Views
- Task 71: Create Similar Products Service (Group D)
- Task 82: Create Recommendation Serving Layer (Group E)

### Instructions

1. **Add similar action to ViewSet**
   - Define `similar` method in RecommendationViewSet
   - Use `@action` decorator with appropriate configuration
   - Set URL pattern to `/api/products/{id}/similar/`
   - Configure HTTP methods for GET requests

2. **Define query parameters**
   - Accept `product_id` as path parameter (required)
   - Accept `limit` as query parameter (optional, default: 8)
   - Accept `category_filter` as query parameter (optional)
   - Accept `price_filter` as query parameter (optional)
   - Accept `min_score` as query parameter (optional, default: 0.3)

3. **Implement category filtering**
   - Parse category_filter parameter (comma-separated category IDs)
   - Validate category IDs exist in database
   - Pass to service layer for filtering
   - Return only products in specified categories

4. **Implement price filtering**
   - Parse price_filter parameter (min_price-max_price format)
   - Validate price range is valid
   - Calculate price range based on anchor product if not specified
   - Filter recommendations by price range

5. **Call similarity service**
   - Extract product_id from path
   - Build filter options from query parameters
   - Call recommendation service's `get_similar()` method
   - Pass filters and scoring threshold

6. **Handle filtering edge cases**
   - Return empty array if filters too restrictive
   - Fallback to relaxed filters if no results
   - Log when fallback occurs for analysis
   - Maintain minimum recommendation count

7. **Format and cache response**
   - Serialize products with scores
   - Include applied filters in response metadata
   - Cache response with filter hash in key
   - Set cache TTL to 1 hour

### Endpoint Specification

| Property | Value |
|----------|-------|
| URL Pattern | `/api/products/{product_id}/similar/` |
| HTTP Method | GET |
| Authentication | Not required (public) |
| Rate Limit | 100 requests/minute per IP |

### Request Parameters

| Parameter | Type | Required | Default | Format | Description |
|-----------|------|----------|---------|--------|-------------|
| product_id | integer | Yes | - | - | Anchor product ID |
| limit | integer | No | 8 | 1-20 | Max recommendations |
| category_filter | string | No | null | "1,3,5" | Category IDs |
| price_filter | string | No | null | "1000-5000" | Price range (LKR) |
| min_score | float | No | 0.3 | 0.0-1.0 | Minimum similarity score |

### Price Filter Examples

| Input | Interpretation |
|-------|----------------|
| "1000-5000" | Products between LKR 1,000 and 5,000 |
| "min-2000" | Products up to LKR 2,000 |
| "5000-max" | Products from LKR 5,000 and above |
| null | ±30% of anchor product price |

### Similarity Scoring Factors

| Factor | Weight | Description |
|--------|--------|-------------|
| Category | 0.3 | Same category increases score |
| Attributes | 0.3 | Shared attributes (color, size, etc.) |
| Price Range | 0.2 | Similar price point |
| Brand | 0.1 | Same brand increases score |
| Tags | 0.1 | Shared tags and keywords |

### Response Example Structure

```
{
  "product_id": 123,
  "recommendations": [
    {
      "id": 789,
      "name": "Similar Product",
      "category": "Electronics",
      "price": 3200.00,
      "image_url": "/media/products/similar.jpg",
      "score": 0.76,
      "match_factors": ["category", "price_range"]
    }
  ],
  "filters_applied": {
    "categories": [1, 3],
    "price_range": [1000, 5000],
    "min_score": 0.3
  },
  "count": 8
}
```

### Filter Fallback Strategy

```
Apply All Filters
      ↓
Results Count >= 3? ──Yes──→ Return Results
      ↓
     No
      ↓
Remove Price Filter
      ↓
Results Count >= 3? ──Yes──→ Return Results
      ↓
     No
      ↓
Remove Category Filter
      ↓
Lower Min Score to 0.2
      ↓
Return Results (or empty)
```

### Expected Outcome
- Functional similar products endpoint with filtering
- Flexible filtering options for customization
- Graceful handling of restrictive filters
- Fast response with caching
- Clear metadata on applied filters

### Verification Checklist
- [ ] Similar action method implemented
- [ ] All query parameters validated
- [ ] Category filtering working
- [ ] Price filtering working
- [ ] Similarity service integrated
- [ ] Fallback logic implemented
- [ ] Response includes filter metadata
- [ ] Caching with filter hash working

---

## Task 86: Create Personalized Endpoint

### Overview
Create the Personalized Recommendations API endpoint that returns product recommendations tailored to the authenticated user based on their browsing history, purchase history, preferences, and collaborative filtering. This endpoint requires authentication and provides the most relevant recommendations for each individual user.

### Dependencies
- Task 83: Create Recommendation API Views
- Task 74: Create Personalization Engine (Group E)
- Task 82: Create Recommendation Serving Layer (Group E)
- Phase-03 SubPhase-04: User Model Authentication

### Instructions

1. **Add personalized action to ViewSet**
   - Define `personalized` method in RecommendationViewSet
   - Use `@action` decorator with detail=False
   - Set URL pattern to `/api/recommendations/personalized/`
   - Configure for GET requests only

2. **Configure authentication**
   - Set permission_classes to `[IsAuthenticated]`
   - Require valid JWT token or session cookie
   - Return 401 Unauthorized for anonymous users
   - Extract user_id from authenticated request

3. **Define query parameters**
   - Accept `limit` parameter (default: 12)
   - Accept `category_id` parameter (optional) for category-specific recommendations
   - Accept `page` parameter for pagination
   - Accept `diversity` parameter (0.0-1.0, default: 0.3) for result diversity

4. **Implement personalization logic**
   - Extract user_id from request.user
   - Check if user has sufficient activity history
   - Call recommendation service's `get_personalized()` method
   - Pass user context (history, preferences)

5. **Handle cold start scenarios**
   - Check user's activity level (new vs existing user)
   - For new users (< 5 interactions), fallback to trending products
   - For users with some history, blend personalized + popular
   - Gradually increase personalization as activity increases

6. **Implement diversity control**
   - Use diversity parameter to balance relevance vs variety
   - Lower diversity = more focused on user preferences
   - Higher diversity = more exploration of new categories
   - Implement diversity injection algorithm

7. **Add real-time updates**
   - Consider recent user activity (last 24 hours)
   - Weigh recent interactions more heavily
   - Update cache when user makes significant action
   - Set short cache TTL (15 minutes)

8. **Format response with explanations**
   - Include "recommended because" text for each item
   - Provide transparency on recommendation logic
   - Add category diversity metrics
   - Include user activity summary (optional)

### Endpoint Specification

| Property | Value |
|----------|-------|
| URL Pattern | `/api/recommendations/personalized/` |
| HTTP Method | GET |
| Authentication | Required (JWT or session) |
| Rate Limit | 50 requests/minute per user |

### Request Parameters

| Parameter | Type | Required | Default | Range | Description |
|-----------|------|----------|---------|-------|-------------|
| limit | integer | No | 12 | 1-50 | Number of recommendations |
| category_id | integer | No | null | - | Filter by category |
| page | integer | No | 1 | 1+ | Pagination page |
| diversity | float | No | 0.3 | 0.0-1.0 | Result diversity factor |

### Cold Start Strategy

| User Activity Level | Strategy | Example |
|---------------------|----------|---------|
| No activity (0) | 100% Trending | New user, show popular items |
| Minimal (1-5) | 70% Personalized + 30% Trending | Some history available |
| Low (6-20) | 85% Personalized + 15% Popular | Growing profile |
| Medium (21-50) | 95% Personalized + 5% Popular | Good profile |
| High (51+) | 100% Personalized | Rich profile |

### Recommendation Reasons

| Reason Code | Display Text | Scenario |
|-------------|--------------|----------|
| PURCHASE_HISTORY | "Based on your previous purchases" | User bought similar |
| BROWSING_HISTORY | "You viewed similar products" | User browsed category |
| SIMILAR_USERS | "Customers like you also bought" | Collaborative filtering |
| CATEGORY_PREFERENCE | "Based on your interests" | Category affinity |
| TRENDING | "Popular right now" | Trending product |

### Response Example Structure

```
{
  "user_id": 456,
  "recommendations": [
    {
      "id": 789,
      "name": "Personalized Product",
      "price": 4500.00,
      "image_url": "/media/products/item.jpg",
      "score": 0.92,
      "reason": "PURCHASE_HISTORY",
      "reason_text": "Based on your previous purchases"
    }
  ],
  "count": 12,
  "page": 1,
  "total_pages": 3,
  "user_activity_level": "HIGH",
  "diversity_score": 0.45,
  "generated_at": "2026-01-31T10:30:00Z"
}
```

### Personalization Flow

```
User Request
      ↓
Authentication Check ──Failed──→ 401 Error
      ↓
   Success
      ↓
Get User Profile
      ↓
Activity Level Check
      ↓
   Sufficient? ──No──→ Use Trending Fallback
      ↓
    Yes
      ↓
Generate Personalized Recs
      ↓
Apply Diversity
      ↓
Cache Results (15 min)
      ↓
Return Response
```

### Expected Outcome
- Authenticated personalized recommendations endpoint
- Cold start handling for new users
- Diversity control for balanced results
- Explanation text for transparency
- Short cache TTL for freshness

### Verification Checklist
- [ ] Personalized action method created
- [ ] Authentication required and working
- [ ] User context extraction implemented
- [ ] Cold start logic functioning
- [ ] Diversity control working
- [ ] Recommendation reasons included
- [ ] Cache with short TTL configured
- [ ] Fallback to trending for new users

---

## Task 87: Create Trending Endpoint

### Overview
Create the Trending Products API endpoint that returns currently popular products based on recent activity, sales velocity, view counts, and time-decay algorithms. This endpoint serves both anonymous and authenticated users and can be filtered by category for more targeted trending recommendations.

### Dependencies
- Task 83: Create Recommendation API Views
- Task 77: Create Trending Products Service (Group E)
- Task 82: Create Recommendation Serving Layer (Group E)

### Instructions

1. **Add trending action to ViewSet**
   - Define `trending` method in RecommendationViewSet
   - Use `@action` decorator with detail=False
   - Set URL pattern to `/api/recommendations/trending/`
   - Allow both authenticated and anonymous access

2. **Define query parameters**
   - Accept `limit` parameter (optional, default: 10)
   - Accept `category_id` parameter (optional)
   - Accept `time_window` parameter (optional: 24h, 7d, 30d, default: 7d)
   - Accept `region` parameter (optional) for geographic trending

3. **Implement trending logic**
   - Call recommendation service's `get_trending()` method
   - Pass category filter if specified
   - Pass time window for trend calculation
   - Use pre-computed trending scores from Task 77

4. **Apply category filtering**
   - If category_id provided, filter to that category only
   - Include subcategories in filter
   - Maintain minimum trending threshold
   - Fallback to general trending if category has insufficient data

5. **Implement time window logic**
   - 24h window: Recent spikes, very fresh trends
   - 7d window: Weekly trends (default)
   - 30d window: Monthly trends, more stable
   - Calculate decay factor based on time window

6. **Add tenant-specific filtering**
   - Filter products available in current tenant
   - Respect product availability and stock status
   - Consider tenant-specific pricing
   - Handle multi-tenant context properly

7. **Optimize for performance**
   - Use pre-computed trending scores
   - Cache aggressively (30 minutes TTL)
   - Warm cache during scheduled updates
   - Return cached results for anonymous users

8. **Format response with metadata**
   - Include trending score for transparency
   - Add trend direction (up/down/stable)
   - Include time window used
   - Add last update timestamp

### Endpoint Specification

| Property | Value |
|----------|-------|
| URL Pattern | `/api/recommendations/trending/` |
| HTTP Method | GET |
| Authentication | Not required (public) |
| Rate Limit | 200 requests/minute per IP |

### Request Parameters

| Parameter | Type | Required | Default | Options | Description |
|-----------|------|----------|---------|---------|-------------|
| limit | integer | No | 10 | 1-50 | Number of products |
| category_id | integer | No | null | - | Filter by category |
| time_window | string | No | "7d" | 24h, 7d, 30d | Trending time window |
| region | string | No | null | - | Geographic filter (future) |

### Time Window Configuration

| Window | Calculation | Update Frequency | Use Case |
|--------|-------------|------------------|----------|
| 24h | Last 24 hours | Every 15 minutes | Real-time trends |
| 7d | Last 7 days | Every 30 minutes | Weekly trends (default) |
| 30d | Last 30 days | Every 2 hours | Monthly trends |

### Trending Score Components

| Factor | Weight | Description |
|--------|--------|-------------|
| Sales Velocity | 0.4 | Recent purchase rate |
| View Count | 0.2 | Page views and impressions |
| Cart Additions | 0.15 | Add-to-cart actions |
| Time Decay | 0.15 | Recency weighting |
| Engagement | 0.1 | Clicks, shares, reviews |

### Response Example Structure

```
{
  "recommendations": [
    {
      "id": 234,
      "name": "Trending Product",
      "category": "Electronics",
      "price": 5600.00,
      "image_url": "/media/products/trending.jpg",
      "trending_score": 0.88,
      "trend_direction": "up",
      "rank": 1,
      "sales_last_week": 156
    }
  ],
  "count": 10,
  "time_window": "7d",
  "category_filter": null,
  "last_updated": "2026-01-31T10:00:00Z",
  "next_update": "2026-01-31T10:30:00Z"
}
```

### Trend Direction Logic

| Scenario | Direction | Indicator |
|----------|-----------|-----------|
| Score increased > 10% | "up" | ↑ |
| Score decreased > 10% | "down" | ↓ |
| Score stable (±10%) | "stable" | → |
| New entry | "new" | ★ |

### Cache Strategy

```
Request Received
      ↓
Generate Cache Key (category + time_window)
      ↓
Check Cache
      ↓
   Found? ──Yes──→ Return Cached Response
      ↓
     No
      ↓
Get Trending Data
      ↓
Apply Filters
      ↓
Cache Response (30 min TTL)
      ↓
Return Response
```

### Expected Outcome
- Public trending products endpoint
- Configurable time windows for flexibility
- Category filtering support
- Aggressive caching for performance
- Trend direction indicators
- Pre-computed scores for speed

### Verification Checklist
- [ ] Trending action method implemented
- [ ] Time window parameter working
- [ ] Category filtering functional
- [ ] Trending service integrated
- [ ] Caching with 30 min TTL active
- [ ] Response includes trend metadata
- [ ] Anonymous access allowed
- [ ] Tenant-specific filtering working

---

## Task 88: Create Recommendation Types

### Overview
Create comprehensive TypeScript type definitions for recommendation data structures used across the frontend application. These types ensure type safety, improve developer experience with autocomplete, and establish consistent data contracts between the API and frontend components.

### Dependencies
- Task 87: Create Trending Endpoint (API contracts defined)
- Phase-07 SubPhase-01: Frontend project structure

### Instructions

1. **Create types directory structure**
   - Navigate to `frontend/lib/recommendations/` directory
   - Create `types.ts` file for type definitions
   - Organize types by recommendation category

2. **Define base Product interface**
   - Create `Product` interface with common product fields
   - Include fields: id, name, slug, price, image_url, category
   - Add optional fields: description, brand, in_stock
   - Ensure compatibility with product API responses

3. **Define RecommendedProduct interface**
   - Extend base Product interface
   - Add recommendation-specific fields: score, reason, rank
   - Add optional fields: reason_text, match_factors
   - Include metadata: algorithm, timestamp

4. **Create FBT-specific types**
   - Define `FBTRecommendation` interface
   - Define `FBTProps` interface for component props
   - Include fields: productId, limit, recommendations array
   - Add loading states and error handling types

5. **Create Similar Products types**
   - Define `SimilarProductsRecommendation` interface
   - Define `SimilarGridProps` interface for component props
   - Include filter types: CategoryFilter, PriceFilter
   - Add grid configuration: columns, spacing

6. **Create Personalized types**
   - Define `PersonalizedRecommendation` interface
   - Include user context fields
   - Define reason enum for recommendation reasons
   - Add diversity and activity level types

7. **Create Trending types**
   - Define `TrendingProduct` interface
   - Include trending-specific fields: trending_score, trend_direction
   - Define time window enum
   - Add sales velocity and ranking fields

8. **Create API response types**
   - Define generic `RecommendationsResponse<T>` type
   - Include pagination fields: count, page, total_pages
   - Add metadata fields: generated_at, filters_applied
   - Create error response types

9. **Create component prop types**
   - Define loading state types
   - Create error state types
   - Define callback function types
   - Add configuration types for customization

10. **Add utility types**
    - Create type guards for runtime checking
    - Define union types for recommendation variants
    - Add helper types for filtering and sorting
    - Include discriminated union types

### Type Organization Structure

```
types.ts
├── Base Types
│   ├── Product
│   └── RecommendedProduct
├── FBT Types
│   ├── FBTRecommendation
│   └── FBTProps
├── Similar Types
│   ├── SimilarProductsRecommendation
│   ├── SimilarGridProps
│   ├── CategoryFilter
│   └── PriceFilter
├── Personalized Types
│   ├── PersonalizedRecommendation
│   ├── PersonalizedProps
│   ├── RecommendationReason (enum)
│   └── ActivityLevel (enum)
├── Trending Types
│   ├── TrendingProduct
│   ├── TrendingProps
│   ├── TimeWindow (enum)
│   └── TrendDirection (enum)
├── API Response Types
│   ├── RecommendationsResponse<T>
│   ├── PaginatedResponse<T>
│   └── ErrorResponse
└── Utility Types
    ├── LoadingState
    ├── ErrorState
    └── Type Guards
```

### Key Type Definitions

| Type | Purpose | Key Fields |
|------|---------|-----------|
| Product | Base product data | id, name, price, image_url |
| RecommendedProduct | Product with rec metadata | score, reason, rank |
| FBTProps | FBT component props | productId, limit, onProductClick |
| SimilarGridProps | Similar grid props | productId, columns, filters |
| TrendingProduct | Trending with scores | trending_score, trend_direction |

### Enum Definitions

| Enum | Values | Usage |
|------|--------|-------|
| RecommendationReason | PURCHASE_HISTORY, BROWSING_HISTORY, SIMILAR_USERS, CATEGORY_PREFERENCE, TRENDING | Personalized reasons |
| TimeWindow | TWENTY_FOUR_HOURS, SEVEN_DAYS, THIRTY_DAYS | Trending time windows |
| TrendDirection | UP, DOWN, STABLE, NEW | Trend indicators |
| ActivityLevel | NONE, MINIMAL, LOW, MEDIUM, HIGH | User activity |

### Component Props Patterns

| Component | Required Props | Optional Props |
|-----------|---------------|----------------|
| FBTCarousel | productId | limit, onProductClick, className |
| SimilarProductsGrid | productId | limit, columns, filters, onProductClick |
| PersonalizedSection | (none) | limit, categoryId, diversity |
| TrendingSection | (none) | limit, categoryId, timeWindow |

### Type Safety Features

| Feature | Implementation |
|---------|----------------|
| Strict null checks | Use `T | null` explicitly |
| Optional properties | Use `field?: type` syntax |
| Readonly arrays | Use `readonly T[]` where appropriate |
| Discriminated unions | Use `type` field for variant identification |
| Generic constraints | Use `extends` for type constraints |

### Expected Outcome
- Comprehensive TypeScript type definitions
- Type safety across recommendation features
- Improved IDE autocomplete and error checking
- Consistent data contracts with backend
- Reusable types for future features

### Verification Checklist
- [ ] `frontend/lib/recommendations/types.ts` file created
- [ ] All base interfaces defined
- [ ] Recommendation-specific types created
- [ ] Enums for constants defined
- [ ] Component prop types defined
- [ ] API response types defined
- [ ] Type guards implemented
- [ ] No TypeScript compilation errors
- [ ] Types match API response structures

---

## Task 89: Create Recommendation API Client

### Overview
Create a centralized API client module for making recommendation requests to the backend. This client provides a clean, type-safe interface for all recommendation endpoints, handles authentication, error handling, request caching, and provides consistent error messages across the application.

### Dependencies
- Task 88: Create Recommendation Types
- Task 84-87: All API endpoints created
- Phase-07 SubPhase-02: API client infrastructure

### Instructions

1. **Create client file structure**
   - Navigate to `frontend/lib/recommendations/` directory
   - Create `client.ts` file for API client
   - Import types from `types.ts`

2. **Set up base configuration**
   - Define base API URL from environment variables
   - Configure default headers (Content-Type, Accept)
   - Set up authentication header injection
   - Configure default timeout (10 seconds)

3. **Create base fetch wrapper**
   - Implement generic `makeRequest<T>()` function
   - Handle authentication token attachment
   - Parse JSON responses automatically
   - Catch network errors and format consistently

4. **Implement getFBT method**
   - Define method signature: `getFBT(productId: number, limit?: number)`
   - Build request URL with parameters
   - Make GET request to `/api/products/{id}/fbt/`
   - Return typed response: `Promise<FBTRecommendation[]>`
   - Handle 404 errors gracefully (return empty array)

5. **Implement getSimilar method**
   - Define method signature with optional filters
   - Accept parameters: productId, limit, categoryFilter, priceFilter
   - Build query string from filters
   - Make GET request to `/api/products/{id}/similar/`
   - Return typed response: `Promise<SimilarProductsRecommendation[]>`

6. **Implement getPersonalized method**
   - Define method signature: `getPersonalized(options?: PersonalizedOptions)`
   - Require authentication (check for token)
   - Include auth token in request headers
   - Make GET request to `/api/recommendations/personalized/`
   - Handle 401 errors (redirect to login or show error)
   - Return typed response

7. **Implement getTrending method**
   - Define method signature with optional filters
   - Accept parameters: limit, categoryId, timeWindow
   - Build query string with parameters
   - Make GET request to `/api/recommendations/trending/`
   - Return typed response: `Promise<TrendingProduct[]>`

8. **Add error handling**
   - Create custom error classes: `RecommendationError`, `AuthenticationError`
   - Parse API error responses
   - Provide user-friendly error messages
   - Log errors to console in development
   - Report errors to monitoring service in production

9. **Implement request caching**
   - Use browser cache for GET requests
   - Set Cache-Control headers appropriately
   - Implement client-side cache with TTL
   - Clear cache on authentication changes

10. **Add request cancellation**
    - Use AbortController for cancellable requests
    - Cancel pending requests on component unmount
    - Prevent race conditions
    - Clean up resources properly

11. **Create client instance**
    - Export singleton client instance
    - Allow configuration override for testing
    - Support multiple instances if needed
    - Provide clear documentation

### API Client Structure

```
client.ts
├── Configuration
│   ├── Base URL
│   ├── Default Headers
│   └── Timeout Settings
├── Base Request Handler
│   ├── makeRequest<T>()
│   ├── buildURL()
│   └── parseResponse()
├── Recommendation Methods
│   ├── getFBT()
│   ├── getSimilar()
│   ├── getPersonalized()
│   └── getTrending()
├── Error Handling
│   ├── RecommendationError
│   ├── AuthenticationError
│   └── formatError()
└── Utilities
    ├── Cache Management
    ├── Token Management
    └── Request Cancellation
```

### Method Signatures

| Method | Parameters | Return Type | Auth Required |
|--------|------------|-------------|---------------|
| getFBT | productId: number, limit?: number | Promise<FBTRecommendation[]> | No |
| getSimilar | productId: number, options?: SimilarOptions | Promise<SimilarProductsRecommendation[]> | No |
| getPersonalized | options?: PersonalizedOptions | Promise<PersonalizedRecommendation[]> | Yes |
| getTrending | options?: TrendingOptions | Promise<TrendingProduct[]> | No |

### Options Types

| Type | Fields | Description |
|------|--------|-------------|
| SimilarOptions | limit, categoryFilter, priceFilter, minScore | Similar products filters |
| PersonalizedOptions | limit, categoryId, diversity, page | Personalized options |
| TrendingOptions | limit, categoryId, timeWindow | Trending filters |

### Error Handling Strategy

| Error Type | HTTP Status | Client Action |
|------------|-------------|---------------|
| Network Error | - | Show "Check connection" message |
| 400 Bad Request | 400 | Show validation error |
| 401 Unauthorized | 401 | Redirect to login |
| 404 Not Found | 404 | Return empty array |
| 500 Server Error | 500 | Show "Try again" message |

### Request Flow

```
Component Call
      ↓
API Client Method
      ↓
Build URL + Query Params
      ↓
Check Auth Required? ──Yes──→ Attach Token
      ↓
Make Fetch Request
      ↓
Response OK? ──No──→ Throw Error
      ↓
    Yes
      ↓
Parse JSON
      ↓
Type Check
      ↓
Return Typed Data
```

### Caching Strategy

| Method | Cache TTL | Cache Key | Invalidation |
|--------|-----------|-----------|--------------|
| getFBT | 5 minutes | `fbt:${productId}:${limit}` | Product update |
| getSimilar | 5 minutes | `similar:${productId}:${hash}` | Product update |
| getPersonalized | 2 minutes | `personal:${userId}` | User action |
| getTrending | 5 minutes | `trending:${category}:${window}` | Time-based |

### Expected Outcome
- Centralized API client for all recommendations
- Type-safe method signatures
- Consistent error handling
- Request caching for performance
- Clean, maintainable code structure
- Easy to test and mock

### Verification Checklist
- [ ] `frontend/lib/recommendations/client.ts` file created
- [ ] All four methods implemented
- [ ] Type annotations complete
- [ ] Authentication handling working
- [ ] Error handling implemented
- [ ] Request caching functional
- [ ] AbortController for cancellation
- [ ] No TypeScript errors
- [ ] Methods match API contracts

---

## Task 90: Create FBTCarousel Component

### Overview
Create a React component that displays Frequently Bought Together recommendations in a horizontal scrollable carousel. This component fetches FBT data for a given product and presents it in an attractive, interactive format with skeleton loading states, smooth scrolling, and click navigation to recommended products.

### Dependencies
- Task 89: Create Recommendation API Client
- Task 88: Create Recommendation Types
- Phase-07 SubPhase-03: Shadcn/UI components installed

### Instructions

1. **Create component file**
   - Navigate to `frontend/components/product/` directory
   - Create `FBTCarousel.tsx` file
   - Import necessary dependencies and types

2. **Define component props**
   - Accept `productId` (required) - anchor product ID
   - Accept `limit` (optional, default: 5) - number of recommendations
   - Accept `onProductClick` (optional) - callback for product clicks
   - Accept `className` (optional) - for styling customization

3. **Set up component state**
   - Define state for recommendations array
   - Define loading state (boolean)
   - Define error state (string | null)
   - Use proper TypeScript typing for all state

4. **Implement data fetching**
   - Use `useEffect` hook to fetch on mount
   - Call `getFBT()` from API client
   - Handle loading states during fetch
   - Handle errors gracefully
   - Update state with recommendations

5. **Create skeleton loading UI**
   - Display while data is loading
   - Show 5 skeleton cards in carousel layout
   - Use Shadcn/UI Skeleton component
   - Match final layout dimensions

6. **Implement carousel container**
   - Use horizontal scroll container
   - Enable smooth scrolling behavior
   - Hide scrollbar or style it minimally
   - Make touch-friendly for mobile

7. **Create product card component**
   - Display product image with aspect ratio
   - Show product name (truncate if needed)
   - Display price formatted as LKR
   - Add subtle hover effect
   - Make entire card clickable

8. **Add navigation buttons**
   - Create left/right scroll buttons
   - Show/hide based on scroll position
   - Smooth scroll animation on click
   - Use appropriate icons (ChevronLeft, ChevronRight)

9. **Implement product click handling**
   - Call onProductClick callback if provided
   - Otherwise, navigate to product page
   - Use Next.js Link for client-side navigation
   - Track click analytics (optional)

10. **Add section header**
    - Display "Frequently Bought Together" heading
    - Style consistently with app theme
    - Optional: Show product count badge

11. **Handle empty state**
    - Show message if no recommendations
    - Don't render component if productId invalid
    - Provide helpful feedback to user

12. **Optimize for performance**
    - Memoize product cards with React.memo
    - Use lazy loading for images
    - Debounce scroll events if needed
    - Clean up on unmount

### Component Structure

```
FBTCarousel
├── Container
│   ├── Section Header
│   │   ├── Title
│   │   └── Count Badge
│   ├── Carousel Wrapper
│   │   ├── Left Button
│   │   ├── Scroll Container
│   │   │   └── Product Cards
│   │   └── Right Button
│   └── Error/Empty State
└── Skeleton Loading State
```

### Props Interface

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| productId | number | Yes | - | Anchor product ID |
| limit | number | No | 5 | Max recommendations |
| onProductClick | (product: RecommendedProduct) => void | No | - | Click callback |
| className | string | No | - | Custom CSS classes |

### State Management

| State | Type | Initial Value | Purpose |
|-------|------|---------------|---------|
| recommendations | RecommendedProduct[] | [] | Store rec data |
| isLoading | boolean | true | Track loading |
| error | string \| null | null | Store error message |
| scrollPosition | number | 0 | Track scroll for buttons |

### Carousel Behavior

| Feature | Implementation |
|---------|----------------|
| Horizontal Scroll | overflow-x-auto, scroll-snap |
| Smooth Scrolling | scroll-behavior: smooth |
| Touch Support | Native touch scrolling |
| Keyboard Nav | Arrow key support (optional) |
| Auto-hide Scrollbar | scrollbar-hide class |

### Product Card Layout

```
┌─────────────────┐
│                 │
│  Product Image  │
│   (200x200)     │
│                 │
├─────────────────┤
│ Product Name    │
│ (2 lines max)   │
├─────────────────┤
│ ₨ 2,500.00     │
└─────────────────┘
     Hover: ↑
```

### Loading Skeleton

```
┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐
│ ░░░░ │ │ ░░░░ │ │ ░░░░ │ │ ░░░░ │ │ ░░░░ │
│ ░░░░ │ │ ░░░░ │ │ ░░░░ │ │ ░░░░ │ │ ░░░░ │
│ ░░░░ │ │ ░░░░ │ │ ░░░░ │ │ ░░░░ │ │ ░░░░ │
│ ░░░░ │ │ ░░░░ │ │ ░░░░ │ │ ░░░░ │ │ ░░░░ │
└──────┘ └──────┘ └──────┘ └──────┘ └──────┘
```

### Responsive Design

| Breakpoint | Cards Visible | Card Width | Gap |
|------------|---------------|------------|-----|
| Mobile (< 640px) | 2-3 | 160px | 8px |
| Tablet (640-1024px) | 3-4 | 200px | 12px |
| Desktop (> 1024px) | 4-5 | 220px | 16px |

### Expected Outcome
- Functional FBT carousel component
- Smooth horizontal scrolling
- Skeleton loading state
- Click navigation to products
- Responsive on all devices
- Clean, attractive UI

### Verification Checklist
- [ ] `frontend/components/product/FBTCarousel.tsx` file created
- [ ] Component renders with valid productId
- [ ] Data fetching working
- [ ] Skeleton loading displays
- [ ] Carousel scrolls smoothly
- [ ] Navigation buttons functional
- [ ] Product cards clickable
- [ ] Responsive on mobile/tablet/desktop
- [ ] Error handling implemented
- [ ] Empty state handled
- [ ] TypeScript types correct
- [ ] No console errors

---

## Task 91: Create SimilarProductsGrid

### Overview
Create a React component that displays Similar Products recommendations in a responsive grid layout. This component supports 2-4 column configurations, includes filtering options for category and price, displays similarity scores, and provides an excellent browsing experience with proper loading states and error handling.

### Dependencies
- Task 89: Create Recommendation API Client
- Task 88: Create Recommendation Types
- Phase-07 SubPhase-03: Shadcn/UI components

### Instructions

1. **Create component file**
   - Navigate to `frontend/components/product/` directory
   - Create `SimilarProductsGrid.tsx` file
   - Import types, client, and UI components

2. **Define component props**
   - Accept `productId` (required) - anchor product ID
   - Accept `limit` (optional, default: 8) - number of recommendations
   - Accept `columns` (optional, default: 4) - grid columns (2-4)
   - Accept `showFilters` (optional, default: true) - show filter controls
   - Accept `onProductClick` (optional) - click callback
   - Accept `className` (optional) - custom styling

3. **Set up component state**
   - Recommendations array state
   - Loading state (boolean)
   - Error state (string | null)
   - Filter state: selectedCategories, priceRange
   - Applied filters state for display

4. **Implement data fetching with filters**
   - Use `useEffect` with dependencies on productId and filters
   - Call `getSimilar()` from API client with filters
   - Debounce filter changes to avoid excessive requests
   - Update recommendations on successful fetch

5. **Create filter controls**
   - Category multi-select dropdown
   - Price range slider or input fields
   - "Apply Filters" button
   - "Clear Filters" button
   - Show active filter count

6. **Fetch available categories**
   - Load categories for the filter dropdown
   - Fetch categories related to anchor product
   - Allow multi-selection
   - Update categories when product changes

7. **Implement price filter UI**
   - Min and max price input fields
   - Currency formatting (LKR)
   - Validation for min < max
   - Reset to defaults option

8. **Create grid layout**
   - Use CSS Grid for responsive layout
   - Support 2, 3, or 4 columns based on prop
   - Adjust columns on mobile (1-2 columns)
   - Maintain aspect ratio for images

9. **Create product card component**
   - Product image with lazy loading
   - Product name (max 2 lines)
   - Category badge
   - Price display
   - Similarity score indicator (badge or progress bar)
   - Match factors badges (optional)
   - Hover effects

10. **Add similarity score display**
    - Show score as percentage (0-100%)
    - Visual indicator (color-coded)
    - Tooltip with explanation
    - Sort by score (highest first)

11. **Implement skeleton loading**
    - Grid of skeleton cards during loading
    - Match final grid layout
    - Shimmer animation
    - Respect columns prop

12. **Handle empty and error states**
    - No results message with helpful text
    - Suggest removing filters if no results
    - Error message with retry button
    - Maintain grid layout for consistency

13. **Add responsive behavior**
    - Adjust columns on mobile: 1-2 columns
    - Adjust columns on tablet: 2-3 columns
    - Full columns on desktop
    - Adjust card sizes proportionally

### Component Structure

```
SimilarProductsGrid
├── Container
│   ├── Section Header
│   │   ├── Title
│   │   └── Filter Toggle
│   ├── Filter Panel (conditional)
│   │   ├── Category Multi-Select
│   │   ├── Price Range Filter
│   │   ├── Apply Button
│   │   └── Clear Button
│   ├── Active Filters Display
│   ├── Grid Container
│   │   └── Product Cards
│   └── Empty/Error State
└── Skeleton Grid
```

### Props Interface

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| productId | number | Yes | - | Anchor product ID |
| limit | number | No | 8 | Max recommendations |
| columns | 2 \| 3 \| 4 | No | 4 | Grid columns |
| showFilters | boolean | No | true | Show filter controls |
| onProductClick | (product) => void | No | - | Click callback |
| className | string | No | - | Custom CSS |

### State Management

| State | Type | Initial | Purpose |
|-------|------|---------|---------|
| recommendations | SimilarProductsRecommendation[] | [] | Store data |
| isLoading | boolean | true | Loading indicator |
| error | string \| null | null | Error message |
| selectedCategories | number[] | [] | Category filter |
| priceRange | [number, number] \| null | null | Price filter |
| appliedFilters | FilterState | {} | Display filters |

### Grid Responsive Layout

| Breakpoint | Columns | Card Width | Gap |
|------------|---------|------------|-----|
| Mobile (< 640px) | 1-2 | 100% / 50% | 12px |
| Tablet (640-1024px) | 2-3 | ~33% | 16px |
| Desktop (> 1024px) | 3-4 | ~25% | 20px |

### Product Card Design

```
┌───────────────────────────┐
│                           │
│   Product Image           │
│   (Aspect 1:1)            │
│                           │
├───────────────────────────┤
│ Category Badge            │
├───────────────────────────┤
│ Product Name              │
│ (Max 2 lines)             │
├───────────────────────────┤
│ ₨ 3,450.00               │
├───────────────────────────┤
│ ●●●●○ 85% Similar        │
└───────────────────────────┘
```

### Filter Panel Layout

```
┌────────────────────────────────────────┐
│  Category Filter                       │
│  ☐ Electronics  ☐ Accessories         │
│  ☐ Computers    ☐ Phones              │
├────────────────────────────────────────┤
│  Price Range                           │
│  Min: [₨ 1000] Max: [₨ 5000]         │
├────────────────────────────────────────┤
│  [Apply Filters]  [Clear]              │
└────────────────────────────────────────┘
```

### Similarity Score Indicator

| Score Range | Color | Label | Display |
|-------------|-------|-------|---------|
| 90-100% | Green | Highly Similar | ●●●●● |
| 75-89% | Blue | Very Similar | ●●●●○ |
| 60-74% | Yellow | Similar | ●●●○○ |
| < 60% | Gray | Somewhat Similar | ●●○○○ |

### Filter Application Flow

```
User Changes Filter
      ↓
Update Filter State
      ↓
Debounce (300ms)
      ↓
Show Loading State
      ↓
Call API with Filters
      ↓
Receive Results
      ↓
Update Grid
      ↓
Update Active Filters Display
```

### Empty State Messages

| Scenario | Message | Action |
|----------|---------|--------|
| No Results | "No similar products found" | Remove some filters |
| Too Restrictive | "Try adjusting your filters" | Clear filters button |
| Error | "Unable to load recommendations" | Retry button |

### Expected Outcome
- Functional similar products grid
- Working category and price filters
- Responsive grid layout
- Similarity scores displayed
- Smooth filtering experience
- Proper loading and error states

### Verification Checklist
- [ ] `frontend/components/product/SimilarProductsGrid.tsx` file created
- [ ] Component renders with productId
- [ ] Grid layout responsive (2-4 columns)
- [ ] Category filter functional
- [ ] Price filter functional
- [ ] Filter debouncing working
- [ ] Similarity scores displayed
- [ ] Product cards clickable
- [ ] Skeleton loading shows
- [ ] Empty state handled
- [ ] Error state handled
- [ ] Mobile responsive
- [ ] TypeScript types correct

---

## Task 92: Create Integration Tests

### Overview
Create comprehensive end-to-end integration tests for the recommendation system. These tests verify the complete flow from API endpoints through to data processing, covering all recommendation types, error scenarios, cold start handling, and performance benchmarks. Tests ensure the entire recommendation system works correctly across all layers.

### Dependencies
- Task 91: Create SimilarProductsGrid (all frontend complete)
- Task 84-87: All API endpoints created
- Phase-03 SubPhase-12: Testing infrastructure

### Instructions

1. **Create test file structure**
   - Navigate to `tests/ai/` directory
   - Create `test_recommendations_e2e.py` file
   - Import necessary test utilities and fixtures

2. **Set up test fixtures**
   - Create fixture for test database with sample data
   - Create fixture for authenticated test client
   - Create fixture for sample products with relationships
   - Create fixture for sample users with purchase history
   - Create fixture for cached recommendation data

3. **Create test data setup**
   - Insert sample products (at least 20)
   - Create purchase history (orders with items)
   - Generate product views and interactions
   - Set up product relationships (categories, attributes)
   - Pre-compute some recommendation scores

4. **Test: FBT Endpoint**
   - Test successful FBT request with valid product
   - Verify response format and structure
   - Check recommendation scores present
   - Test limit parameter (default and custom)
   - Test with product that has no FBT data
   - Test with invalid product ID (404)
   - Verify cache headers in response

5. **Test: Similar Products Endpoint**
   - Test successful similar products request
   - Test category filter application
   - Test price filter application
   - Test combined filters (category + price)
   - Test with very restrictive filters (fallback)
   - Test min_score parameter
   - Verify similarity scores in response
   - Test invalid product ID

6. **Test: Personalized Endpoint**
   - Test successful personalized request (authenticated)
   - Test without authentication (401 error)
   - Test with new user (cold start fallback)
   - Test with active user (personalized results)
   - Test category_id filter
   - Test diversity parameter effect
   - Test pagination (page parameter)
   - Verify recommendation reasons included

7. **Test: Trending Endpoint**
   - Test successful trending request
   - Test with different time windows (24h, 7d, 30d)
   - Test category filter
   - Test limit parameter
   - Verify trending scores present
   - Verify trend direction indicators
   - Test cache behavior (repeated requests)
   - Test anonymous access

8. **Test: Cold Start Scenarios**
   - Test FBT for product with no purchase history
   - Test similar for new product with minimal data
   - Test personalized for brand new user
   - Test trending with no recent activity
   - Verify graceful fallbacks
   - Check that empty arrays returned (not errors)

9. **Test: Error Handling**
   - Test invalid product IDs (404)
   - Test invalid parameters (400)
   - Test authentication failures (401)
   - Test service unavailable scenarios (500)
   - Test malformed requests
   - Verify error response format

10. **Test: Performance Benchmarks**
    - Measure FBT endpoint response time (target < 100ms with cache)
    - Measure similar endpoint response time
    - Measure personalized response time
    - Test cache hit rates
    - Test database query counts (N+1 prevention)
    - Verify cache invalidation on updates

11. **Test: Data Consistency**
    - Verify recommendation scores valid (0-1)
    - Check product data consistency
    - Verify no duplicate recommendations
    - Check that inactive products excluded
    - Verify tenant isolation (multi-tenancy)

12. **Test: Integration with Frontend**
    - Test full request flow from frontend client
    - Verify CORS headers
    - Test error responses parsed correctly
    - Verify TypeScript types match responses
    - Test with actual network requests (optional)

13. **Create test utilities**
    - Helper to create test products
    - Helper to create purchase history
    - Helper to verify response structure
    - Helper to measure performance
    - Helper to check cache state

### Test Structure

```
test_recommendations_e2e.py
├── Fixtures
│   ├── test_db
│   ├── auth_client
│   ├── sample_products
│   └── sample_users
├── FBT Tests
│   ├── test_fbt_endpoint
│   ├── test_fbt_limit
│   └── test_fbt_cold_start
├── Similar Tests
│   ├── test_similar_endpoint
│   ├── test_similar_with_filters
│   └── test_similar_cold_start
├── Personalized Tests
│   ├── test_personalized_endpoint
│   ├── test_personalized_auth
│   └── test_personalized_cold_start
├── Trending Tests
│   ├── test_trending_endpoint
│   ├── test_trending_time_windows
│   └── test_trending_cache
├── Error Tests
│   ├── test_error_handling
│   └── test_validation_errors
└── Performance Tests
    ├── test_response_times
    └── test_cache_performance
```

### Test Cases Matrix

| Test Case | Endpoint | Scenario | Expected Outcome |
|-----------|----------|----------|------------------|
| test_fbt_endpoint | /api/products/{id}/fbt/ | Valid product | 200, array of products |
| test_fbt_limit | /api/products/{id}/fbt/ | Custom limit | Correct count |
| test_fbt_cold_start | /api/products/{id}/fbt/ | No purchase data | 200, empty array |
| test_similar_endpoint | /api/products/{id}/similar/ | Valid product | 200, array with scores |
| test_similar_filters | /api/products/{id}/similar/ | With filters | Filtered results |
| test_personalized_endpoint | /api/recommendations/personalized/ | Authenticated | 200, personalized list |
| test_personalized_auth | /api/recommendations/personalized/ | No auth | 401 error |
| test_trending_endpoint | /api/recommendations/trending/ | No filters | 200, trending products |

### Assertion Checklist

| Aspect | Assertions |
|--------|----------|
| Response Status | Assert status code correct (200, 400, 404, etc.) |
| Response Structure | Assert JSON structure matches schema |
| Data Types | Assert field types correct (int, float, string) |
| Data Validity | Assert scores in range, prices positive |
| Counts | Assert recommendation counts match limit |
| Authentication | Assert auth required endpoints reject anonymous |
| Caching | Assert cache headers present |

### Performance Benchmarks

| Metric | Target | Test |
|--------|--------|------|
| FBT (cached) | < 50ms | Measure with time.time() |
| FBT (uncached) | < 200ms | First request |
| Similar (cached) | < 50ms | Repeated request |
| Personalized | < 300ms | With user history |
| Trending (cached) | < 50ms | Repeated request |
| DB Queries | < 5 per request | Use Django debug toolbar |

### Sample Test Structure

```python
Test Flow Example:
1. Setup: Create test data
2. Request: Make API call
3. Assert: Check status code
4. Assert: Verify response structure
5. Assert: Check data validity
6. Assert: Verify business logic
7. Teardown: Clean up test data
```

### Mock Data Requirements

| Data Type | Quantity | Purpose |
|-----------|----------|---------|
| Products | 50+ | Test recommendations |
| Users | 10+ | Test personalization |
| Orders | 100+ | Test FBT and history |
| Views | 500+ | Test trending |
| Categories | 10+ | Test filters |

### Expected Outcome
- Comprehensive test suite covering all endpoints
- All tests passing successfully
- Performance benchmarks met
- Cold start scenarios handled
- Error cases covered
- Integration verified end-to-end

### Verification Checklist
- [ ] `tests/ai/test_recommendations_e2e.py` file created
- [ ] Test fixtures set up
- [ ] FBT endpoint tests passing
- [ ] Similar endpoint tests passing
- [ ] Personalized endpoint tests passing
- [ ] Trending endpoint tests passing
- [ ] Cold start tests passing
- [ ] Error handling tests passing
- [ ] Performance benchmarks met
- [ ] All assertions passing
- [ ] No flaky tests
- [ ] Test coverage > 90%
- [ ] Documentation for running tests

---

## Summary

This document established the complete API and frontend layer for the product recommendation system. It covered the creation of REST API endpoints for all recommendation types (FBT, Similar, Personalized, Trending), TypeScript type definitions for type safety, a centralized API client for clean data fetching, interactive React components for displaying recommendations, and comprehensive integration tests to ensure system reliability.

### Completed Tasks
1. ✓ Created Recommendation API ViewSet with common functionality
2. ✓ Created FBT endpoint for frequently bought together recommendations
3. ✓ Created Similar Products endpoint with filtering options
4. ✓ Created Personalized endpoint with authentication and cold start handling
5. ✓ Created Trending endpoint with time window configurations
6. ✓ Created comprehensive TypeScript type definitions
7. ✓ Created API client with error handling and caching
8. ✓ Created FBTCarousel component with horizontal scrolling
9. ✓ Created SimilarProductsGrid component with filters
10. ✓ Created integration tests covering all endpoints and scenarios

### Architecture Overview

```
Recommendation System Architecture

Frontend Layer
├── Components
│   ├── FBTCarousel.tsx
│   └── SimilarProductsGrid.tsx
├── API Client (client.ts)
└── Type Definitions (types.ts)
      ↓
   HTTP/JSON
      ↓
Backend API Layer
├── RecommendationViewSet
│   ├── fbt()
│   ├── similar()
│   ├── personalized()
│   └── trending()
└── Caching Layer
      ↓
Service Layer (Task 82)
├── FBT Service
├── Similar Service
├── Personalization Engine
└── Trending Service
      ↓
Data Layer
├── ML Models
├── Redis Cache
└── PostgreSQL
```

### Key Deliverables

| File | Lines | Purpose |
|------|-------|---------|
| backend/apps/ai/recommendations/api/views.py | ~400 | API endpoints |
| frontend/lib/recommendations/types.ts | ~150 | Type definitions |
| frontend/lib/recommendations/client.ts | ~250 | API client |
| frontend/components/product/FBTCarousel.tsx | ~300 | FBT carousel |
| frontend/components/product/SimilarProductsGrid.tsx | ~400 | Similar grid |
| tests/ai/test_recommendations_e2e.py | ~600 | Integration tests |

### Performance Targets Achieved

| Metric | Target | Implementation |
|--------|--------|----------------|
| API Response (cached) | < 100ms | Redis caching |
| API Response (uncached) | < 300ms | Optimized queries |
| Frontend Load Time | < 200ms | Lazy loading |
| Cache Hit Rate | > 80% | Strategic caching |

### Next Steps
Proceed to [../../SubPhase-03_Demand-Forecasting/00_TASKS_SUMMARY.md](../../SubPhase-03_Demand-Forecasting/00_TASKS_SUMMARY.md) to begin implementing demand forecasting capabilities for inventory management and sales predictions.

---

*Document Version: 1.0*  
*Last Updated: 2026-01-31*  
*Status: Complete*
