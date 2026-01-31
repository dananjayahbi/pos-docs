# Tasks 81-90: API, Frontend Components, and Integration Tests

> **Phase:** 10 - AI Features & Advanced Capabilities  
> **SubPhase:** 03 - Demand Forecasting  
> **Group:** F - API & Frontend  
> **Document:** 01 of 01  
> **Tasks Covered:** 81, 82, 83, 84, 85, 86, 87, 88, 89, 90

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Group:** [Group-E_Reorder-Suggestions](../Group-E_Reorder-Suggestions/)
- **→ Next SubPhase:** [SubPhase-04_Smart-Search-Backend](../../SubPhase-04_Smart-Search-Backend/)

---

## Document Overview

This document covers the creation of REST API endpoints for demand forecasting, TypeScript types and API clients for frontend integration, React components for data visualization, and end-to-end integration tests. It establishes the complete API and UI layer for the demand forecasting system, including forecast visualization, reorder suggestions management, and festival calendar display.

### Tasks in This Document

| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 81 | Create Forecast API Views | Medium | 90 min |
| 82 | Create Product Forecast Endpoint | Low | 45 min |
| 83 | Create Reorder Suggestions Endpoint | Low | 45 min |
| 84 | Create Festival Calendar API | Low | 40 min |
| 85 | Create Forecast TypeScript Types | Low | 30 min |
| 86 | Create Forecast API Client | Medium | 60 min |
| 87 | Create ForecastChart Component | Medium | 75 min |
| 88 | Create ReorderTable Component | Medium | 70 min |
| 89 | Create FestivalCalendarUI Component | Medium | 65 min |
| 90 | Create Integration Tests | Medium | 80 min |

---

## Task 81: Create Forecast API Views

### Overview

Create a Django REST Framework ViewSet to handle all forecasting-related API endpoints. This ViewSet serves as the central API controller for demand forecasting, providing endpoints for product forecasts, reorder suggestions, festival calendar, and related operations. The ViewSet uses standard DRF conventions with proper authentication, permissions, and error handling.

### Dependencies

- Task 80: Complete Backend Integration (from Group-E)
- Django REST Framework installed and configured
- Forecast service layer functional
- Reorder suggestion service operational

### Instructions

1. **Create API directory structure**
   - Navigate to `backend/apps/ai/forecasting/` directory
   - Create new directory named `api`
   - Create `__init__.py` to make it a Python package
   - Create `views.py` for ViewSet implementation

2. **Import required dependencies**
   - Import ViewSet from rest_framework.viewsets
   - Import Response from rest_framework.response
   - Import status codes from rest_framework.status
   - Import authentication and permission classes
   - Import forecast service and models

3. **Create ForecastViewSet class**
   - Define ViewSet inheriting from viewsets.ViewSet
   - Set base_name to 'forecast' for URL routing
   - Configure authentication_classes (JWT or session)
   - Configure permission_classes (IsAuthenticated)

4. **Add tenant context middleware support**
   - Ensure ViewSet respects tenant isolation
   - Access current tenant from request
   - Filter all queries by current tenant schema

5. **Define common helper methods**
   - Create method to get current tenant from request
   - Create method to validate date parameters
   - Create method to handle common error responses
   - Create method to paginate large result sets

6. **Add logging and monitoring**
   - Log all API requests with tenant context
   - Log errors with full traceback
   - Add performance timing for slow queries
   - Track API usage metrics

7. **Implement error handling structure**
   - Handle ValueError for invalid parameters
   - Handle ObjectDoesNotExist for missing resources
   - Handle PermissionDenied for authorization failures
   - Return consistent error response format

### ViewSet Structure

```
ForecastViewSet
├── list() → Not implemented
├── retrieve() → Not implemented
├── product_forecast() → Custom action (Task 82)
├── reorder_suggestions() → Custom action (Task 83)
└── festivals() → Custom action (Task 84)
```

### Authentication Configuration

| Setting | Value | Purpose |
|---------|-------|---------|
| authentication_classes | [JWTAuthentication, SessionAuthentication] | Support multiple auth methods |
| permission_classes | [IsAuthenticated] | Require authentication |
| Tenant Isolation | Middleware-based | Enforce multi-tenancy |

### Error Response Format

```
{
  "error": "Error type/category",
  "message": "Human-readable error description",
  "details": {
    "field": "Specific field error details",
    "code": "ERROR_CODE"
  },
  "timestamp": "2026-01-31T10:30:00Z"
}
```

### Common Error Handling

| Error Type | HTTP Status | Response Message |
|------------|-------------|------------------|
| Missing Parameter | 400 | "Required parameter missing: {param}" |
| Invalid Date | 400 | "Invalid date format. Use YYYY-MM-DD" |
| Product Not Found | 404 | "Product not found: {product_id}" |
| Permission Denied | 403 | "Access denied to this resource" |
| Server Error | 500 | "Internal server error occurred" |

### Logging Configuration

| Log Level | Use Case |
|-----------|----------|
| INFO | API request start/end, success responses |
| WARNING | Invalid parameters, missing data |
| ERROR | Exceptions, forecast failures |
| DEBUG | Detailed request/response data |

### ViewSet Methods Overview

| Method Type | Implementation Status | Purpose |
|-------------|----------------------|---------|
| list() | Disabled | Not used in this ViewSet |
| retrieve() | Disabled | Not used in this ViewSet |
| Custom Actions | Enabled | Domain-specific endpoints |

### Expected Outcome

- Functional DRF ViewSet for forecasting APIs
- Proper authentication and permission configuration
- Multi-tenant isolation enforced
- Comprehensive error handling structure
- Logging and monitoring in place

### Verification Checklist

- [ ] `backend/apps/ai/forecasting/api/` directory created
- [ ] `views.py` file with ForecastViewSet created
- [ ] Authentication and permission classes configured
- [ ] Tenant isolation middleware integrated
- [ ] Error handling methods implemented
- [ ] Logging configured for all operations
- [ ] ViewSet properly exports for URL routing

---

## Task 82: Create Product Forecast Endpoint

### Overview

Implement the product forecast custom action in the ForecastViewSet. This endpoint provides demand forecasts for a specific product over a configurable time horizon. It supports multiple forecast models (Prophet, ARIMA) and returns predictions with confidence intervals. The endpoint is designed for ERP inventory managers to view future demand projections.

### Dependencies

- Task 81: Create Forecast API Views
- Forecast service layer with Prophet and ARIMA models
- Product model with historical sales data

### Instructions

1. **Add detail_route decorator to method**
   - Use @action decorator from rest_framework.decorators
   - Set methods=['get'] for GET request only
   - Set detail=False since it doesn't require ViewSet PK
   - Set url_path='products/<int:product_id>/forecast'

2. **Define method signature**
   - Create method named `product_forecast`
   - Accept self, request, and product_id parameters
   - Extract query parameters from request.query_params

3. **Extract and validate query parameters**
   - Extract 'horizon' parameter (default: 30 days)
   - Validate horizon is between 7 and 90 days
   - Extract 'model' parameter (default: 'prophet')
   - Validate model is 'prophet' or 'arima'
   - Extract optional 'include_confidence' boolean

4. **Retrieve product and validate access**
   - Query Product model by product_id
   - Ensure product belongs to current tenant
   - Return 404 if product not found
   - Return 403 if product belongs to different tenant

5. **Check forecast availability**
   - Query forecast cache for existing forecast
   - Check if cached forecast is recent (< 24 hours)
   - If fresh cache exists, return cached data
   - Otherwise, proceed to generate new forecast

6. **Generate forecast using service layer**
   - Call ForecastService.generate_product_forecast()
   - Pass product_id, horizon, and model parameters
   - Handle forecast generation failures gracefully
   - Log forecast generation time and model used

7. **Format response data**
   - Structure response with forecasts array
   - Include product metadata (id, name, sku)
   - Include model information and generation timestamp
   - Add horizon and date range information

8. **Cache forecast results**
   - Store forecast in cache with 24-hour TTL
   - Use cache key format: forecast:product:{product_id}:{horizon}
   - Include metadata for cache invalidation
   - Update forecast cache timestamp

9. **Return formatted response**
   - Return Response with status 200
   - Include all forecast data in response body
   - Add cache headers for client-side caching
   - Include ETag for conditional requests

### Endpoint Specification

| Property | Value |
|----------|-------|
| Method | GET |
| Path | /api/forecasts/products/{product_id}/forecast/ |
| Authentication | Required |
| Tenant Isolation | Yes |

### Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| horizon | integer | No | 30 | Forecast days ahead (7-90) |
| model | string | No | 'prophet' | Model type: 'prophet' or 'arima' |
| include_confidence | boolean | No | true | Include confidence intervals |

### Response Format

```
{
  "product": {
    "id": 123,
    "name": "Product Name",
    "sku": "SKU-001",
    "current_stock": 150
  },
  "forecasts": [
    {
      "date": "2026-02-01",
      "predicted_demand": 45.2,
      "confidence_low": 38.5,
      "confidence_high": 52.8
    },
    ...
  ],
  "model": "prophet",
  "horizon_days": 30,
  "generated_at": "2026-01-31T10:30:00Z",
  "date_range": {
    "start": "2026-02-01",
    "end": "2026-03-02"
  }
}
```

### Forecast Item Structure

| Field | Type | Description |
|-------|------|-------------|
| date | string | ISO date (YYYY-MM-DD) |
| predicted_demand | float | Predicted quantity |
| confidence_low | float | Lower confidence bound (80%) |
| confidence_high | float | Upper confidence bound (80%) |

### Validation Rules

| Parameter | Validation | Error Message |
|-----------|-----------|---------------|
| product_id | Must exist in tenant | "Product not found" |
| horizon | 7 ≤ horizon ≤ 90 | "Horizon must be between 7 and 90 days" |
| model | 'prophet' or 'arima' | "Invalid model. Choose 'prophet' or 'arima'" |

### Cache Strategy

| Aspect | Implementation |
|--------|----------------|
| Cache Key | `forecast:product:{id}:{horizon}:{model}` |
| TTL | 24 hours |
| Invalidation | On product sales update |
| Storage | Redis cache |

### Performance Considerations

| Scenario | Response Time | Strategy |
|----------|---------------|----------|
| Cache Hit | < 50ms | Direct cache return |
| Cache Miss | 500-2000ms | Background task possible |
| Large Horizon | Up to 3s | Consider pagination |

### Expected Outcome

- Functional product forecast endpoint
- Configurable forecast horizon and model
- Cached forecast results for performance
- Proper error handling and validation
- Rich response with product context

### Verification Checklist

- [ ] @action decorator applied correctly
- [ ] Query parameters extracted and validated
- [ ] Product retrieval with tenant isolation
- [ ] Forecast generation integrated
- [ ] Response formatted with all required fields
- [ ] Caching implemented for performance
- [ ] Error handling for all failure cases
- [ ] Documentation added to ViewSet docstring

---

## Task 83: Create Reorder Suggestions Endpoint

### Overview

Implement the reorder suggestions custom action in the ForecastViewSet. This endpoint provides a list of products that need reordering based on forecasted demand, current stock levels, and lead times. It supports filtering by urgency level and product category, enabling inventory managers to prioritize restocking decisions efficiently.

### Dependencies

- Task 81: Create Forecast API Views
- Task 75-80: Reorder suggestion service (from Group-E)
- Reorder suggestion model with urgency calculation

### Instructions

1. **Add list_route decorator to method**
   - Use @action decorator with detail=False
   - Set methods=['get'] for GET request only
   - Set url_path='inventory/reorder'

2. **Extract query parameters**
   - Extract 'urgency' parameter (optional)
   - Extract 'category' parameter (optional)
   - Extract 'limit' parameter (default: 50)
   - Extract 'offset' parameter (default: 0)
   - Extract 'order_by' parameter (default: '-urgency')

3. **Validate filter parameters**
   - Validate urgency is one of: CRITICAL, HIGH, MEDIUM, LOW
   - Validate category exists in tenant's categories
   - Validate limit is between 1 and 100
   - Validate offset is non-negative

4. **Query reorder suggestions**
   - Call ReorderService.get_suggestions()
   - Apply tenant isolation filter
   - Apply urgency filter if provided
   - Apply category filter if provided

5. **Apply sorting and ordering**
   - Support ordering by urgency (default)
   - Support ordering by reorder_date
   - Support ordering by suggested_quantity
   - Support reverse ordering with '-' prefix

6. **Calculate summary statistics**
   - Count total suggestions
   - Count by urgency level (CRITICAL, HIGH, etc.)
   - Calculate total suggested order value
   - Calculate average lead time

7. **Paginate results**
   - Apply offset and limit to queryset
   - Calculate total pages based on limit
   - Include pagination metadata in response
   - Add next/previous page links

8. **Format each suggestion**
   - Include product details (id, name, sku, category)
   - Include current stock and reorder point
   - Include suggested quantity and reorder date
   - Include urgency level and reason
   - Include estimated cost and lead time

9. **Return paginated response**
   - Structure response with suggestions array
   - Include summary statistics
   - Include pagination metadata
   - Return with status 200

### Endpoint Specification

| Property | Value |
|----------|-------|
| Method | GET |
| Path | /api/forecasts/inventory/reorder/ |
| Authentication | Required |
| Tenant Isolation | Yes |

### Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| urgency | string | No | All | Filter by: CRITICAL, HIGH, MEDIUM, LOW |
| category | string | No | All | Filter by product category |
| limit | integer | No | 50 | Results per page (1-100) |
| offset | integer | No | 0 | Pagination offset |
| order_by | string | No | '-urgency' | Sort field |

### Response Format

```
{
  "suggestions": [
    {
      "id": "uuid-string",
      "product": {
        "id": 123,
        "name": "Product Name",
        "sku": "SKU-001",
        "category": "Electronics"
      },
      "current_stock": 15,
      "reorder_point": 50,
      "suggested_quantity": 100,
      "reorder_date": "2026-02-05",
      "urgency": "HIGH",
      "reason": "Stock below reorder point with high forecasted demand",
      "estimated_cost": 15000.00,
      "lead_time_days": 7
    },
    ...
  ],
  "summary": {
    "total": 42,
    "critical": 5,
    "high": 15,
    "medium": 18,
    "low": 4,
    "total_estimated_cost": 580000.00
  },
  "pagination": {
    "limit": 50,
    "offset": 0,
    "total": 42,
    "has_next": false,
    "has_previous": false
  }
}
```

### Urgency Level Definitions

| Level | Criteria | Action Required |
|-------|----------|-----------------|
| CRITICAL | Stock < 5 days supply | Order immediately |
| HIGH | Stock < reorder point | Order within 2 days |
| MEDIUM | Stock approaching reorder point | Order within week |
| LOW | Stock adequate but trending down | Monitor |

### Sorting Options

| order_by Value | Description |
|----------------|-------------|
| urgency | Urgency level (CRITICAL first) |
| -urgency | Urgency level (LOW first) |
| reorder_date | Soonest reorder date first |
| -reorder_date | Latest reorder date first |
| suggested_quantity | Smallest quantity first |
| -suggested_quantity | Largest quantity first |

### Pagination Metadata

| Field | Type | Description |
|-------|------|-------------|
| limit | integer | Results per page |
| offset | integer | Current offset |
| total | integer | Total result count |
| has_next | boolean | More results available |
| has_previous | boolean | Previous page exists |

### Performance Optimization

| Optimization | Implementation |
|--------------|----------------|
| Database Indexing | Index on urgency and reorder_date |
| Query Optimization | Select related for product data |
| Caching | Cache suggestions for 1 hour |
| Pagination | Limit max results to prevent timeouts |

### Expected Outcome

- Functional reorder suggestions endpoint
- Flexible filtering by urgency and category
- Paginated results with summary statistics
- Sorted results for easy prioritization
- Rich product and inventory context

### Verification Checklist

- [ ] @action decorator applied correctly
- [ ] Query parameters validated
- [ ] Tenant isolation enforced
- [ ] Urgency and category filters working
- [ ] Sorting and pagination implemented
- [ ] Summary statistics calculated
- [ ] Response formatted correctly
- [ ] Performance optimized with caching

---

## Task 84: Create Festival Calendar API

### Overview

Implement the festival calendar custom action in the ForecastViewSet. This endpoint provides a list of Sri Lankan festivals and holidays within a specified date range, including their demand impact factors. This data is used by frontend components to visualize demand spikes and by forecast models to improve predictions around festival periods.

### Dependencies

- Task 81: Create Forecast API Views
- Task 71-72: Festival calendar and impact factors (from Group-E)
- Festival model with Sri Lankan festival data

### Instructions

1. **Add list_route decorator to method**
   - Use @action decorator with detail=False
   - Set methods=['get'] for GET request only
   - Set url_path='festivals'

2. **Extract date range parameters**
   - Extract 'start_date' parameter (default: today)
   - Extract 'end_date' parameter (default: +90 days)
   - Validate date format (YYYY-MM-DD)
   - Ensure end_date is after start_date

3. **Validate date range**
   - Check that date range is not more than 365 days
   - Parse dates and handle parse errors
   - Set defaults if parameters not provided
   - Return 400 error for invalid dates

4. **Query festival data**
   - Query Festival model with date range filter
   - Filter festivals where date is between start and end
   - Order by festival date ascending
   - Include festival type and impact factor

5. **Filter by festival type (optional)**
   - Extract 'type' query parameter
   - Valid types: RELIGIOUS, CULTURAL, NATIONAL, COMMERCIAL
   - Filter queryset if type parameter provided
   - Return all types if parameter not provided

6. **Calculate demand impact metadata**
   - For each festival, include impact_factor
   - Calculate expected demand multiplier
   - Include impact_start_date (days before)
   - Include impact_end_date (days after)

7. **Format festival response**
   - Include festival basic info (name, type, date)
   - Include multi-day festival support (start/end dates)
   - Include impact factor and duration
   - Include description and cultural significance

8. **Add calendar metadata**
   - Include total festival count in range
   - Include count by type (religious, cultural, etc.)
   - Include highest impact festival
   - Include date range queried

9. **Return formatted response**
   - Structure response with festivals array
   - Include metadata and statistics
   - Return with status 200
   - Add appropriate cache headers

### Endpoint Specification

| Property | Value |
|----------|-------|
| Method | GET |
| Path | /api/forecasts/festivals/ |
| Authentication | Required |
| Tenant Isolation | No (global calendar) |

### Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| start_date | string | No | Today | Start date (YYYY-MM-DD) |
| end_date | string | No | +90 days | End date (YYYY-MM-DD) |
| type | string | No | All | Festival type filter |

### Response Format

```
{
  "festivals": [
    {
      "id": "uuid-string",
      "name": "Thai Pongal",
      "type": "RELIGIOUS",
      "date": "2026-01-14",
      "is_multi_day": true,
      "start_date": "2026-01-14",
      "end_date": "2026-01-15",
      "impact_factor": 2.5,
      "impact_start_days": 3,
      "impact_end_days": 1,
      "description": "Tamil harvest festival",
      "affected_categories": ["Food", "Groceries", "Traditional Items"]
    },
    {
      "id": "uuid-string",
      "name": "Sinhala and Tamil New Year",
      "type": "CULTURAL",
      "date": "2026-04-14",
      "is_multi_day": true,
      "start_date": "2026-04-13",
      "end_date": "2026-04-14",
      "impact_factor": 4.0,
      "impact_start_days": 7,
      "impact_end_days": 2,
      "description": "Sri Lankan New Year celebration",
      "affected_categories": ["All Categories"]
    },
    ...
  ],
  "metadata": {
    "date_range": {
      "start": "2026-01-31",
      "end": "2026-04-30"
    },
    "total_festivals": 12,
    "by_type": {
      "RELIGIOUS": 7,
      "CULTURAL": 3,
      "NATIONAL": 2
    },
    "highest_impact": {
      "name": "Sinhala and Tamil New Year",
      "impact_factor": 4.0
    }
  }
}
```

### Festival Types

| Type | Description | Example |
|------|-------------|---------|
| RELIGIOUS | Religious holidays | Vesak, Christmas, Eid |
| CULTURAL | Cultural celebrations | New Year, Pongal |
| NATIONAL | National holidays | Independence Day |
| COMMERCIAL | Commercial events | Black Friday |

### Impact Factor Scale

| Factor | Impact | Demand Increase |
|--------|--------|-----------------|
| 1.0-1.5 | Low | 0-50% |
| 1.5-2.5 | Medium | 50-150% |
| 2.5-3.5 | High | 150-250% |
| 3.5+ | Very High | 250%+ |

### Sri Lankan Major Festivals

| Festival | Typical Date | Type | Impact Factor |
|----------|-------------|------|---------------|
| Thai Pongal | January 14-15 | Religious | 2.5 |
| Independence Day | February 4 | National | 1.5 |
| Sinhala/Tamil New Year | April 13-14 | Cultural | 4.0 |
| Vesak | May (full moon) | Religious | 3.5 |
| Christmas | December 25 | Religious | 3.0 |

### Date Range Validation

| Validation | Rule | Error Message |
|------------|------|---------------|
| Format | YYYY-MM-DD | "Invalid date format" |
| Order | end > start | "End date must be after start date" |
| Range | ≤ 365 days | "Date range cannot exceed 365 days" |

### Expected Outcome

- Functional festival calendar endpoint
- Configurable date range queries
- Festival type filtering support
- Rich festival metadata with impact factors
- Cultural context for Sri Lankan festivals

### Verification Checklist

- [ ] @action decorator applied correctly
- [ ] Date range parameters validated
- [ ] Festival query with date filtering
- [ ] Festival type filtering implemented
- [ ] Impact factors included in response
- [ ] Metadata and statistics calculated
- [ ] Response formatted correctly
- [ ] Major Sri Lankan festivals included in data

---

## Task 85: Create Forecast TypeScript Types

### Overview

Create comprehensive TypeScript type definitions for all forecast-related data structures used in the frontend application. These types ensure type safety, enable autocomplete in IDEs, and serve as documentation for the forecast API responses. The types cover forecasts, reorder suggestions, festivals, and all related data structures.

### Dependencies

- Task 84: Create Festival Calendar API
- Next.js frontend project with TypeScript configured
- API response formats defined from Tasks 82-84

### Instructions

1. **Create types directory structure**
   - Navigate to `frontend/lib/` directory
   - Create `forecasting/` subdirectory
   - Create `types.ts` file for type definitions

2. **Define forecast data types**
   - Create ForecastItem interface for individual predictions
   - Create ForecastResponse interface for API response
   - Include all fields returned by product forecast endpoint
   - Add JSDoc comments for documentation

3. **Define product context types**
   - Create ProductInfo interface for product metadata
   - Include fields: id, name, sku, category, current_stock
   - Used in forecast and reorder responses

4. **Define reorder suggestion types**
   - Create ReorderSuggestion interface
   - Include product, stock, quantity, date, urgency fields
   - Create ReorderSummary interface for statistics
   - Create ReorderResponse interface for paginated API response

5. **Define festival types**
   - Create Festival interface with all festival fields
   - Create FestivalType enum (RELIGIOUS, CULTURAL, etc.)
   - Create FestivalMetadata interface for calendar stats
   - Create FestivalResponse interface for API response

6. **Define urgency and status enums**
   - Create UrgencyLevel enum (CRITICAL, HIGH, MEDIUM, LOW)
   - Create ModelType enum (prophet, arima)
   - Export all enums for use in components

7. **Define pagination types**
   - Create PaginationMetadata interface
   - Include limit, offset, total, has_next, has_previous
   - Reusable across paginated endpoints

8. **Define date range types**
   - Create DateRange interface with start and end dates
   - Used in festival queries and forecast responses

9. **Add type guards and utilities**
   - Create type guard functions (e.g., isReorderSuggestion)
   - Add utility types for partial updates
   - Add type helpers for common transformations

10. **Export all types**
    - Use named exports for all interfaces and types
    - Organize exports logically by category
    - Add index.ts for convenient imports

### Type Definitions Structure

```
types.ts
├── Enums
│   ├── ModelType
│   ├── UrgencyLevel
│   └── FestivalType
├── Product Types
│   └── ProductInfo
├── Forecast Types
│   ├── ForecastItem
│   └── ForecastResponse
├── Reorder Types
│   ├── ReorderSuggestion
│   ├── ReorderSummary
│   └── ReorderResponse
├── Festival Types
│   ├── Festival
│   ├── FestivalMetadata
│   └── FestivalResponse
├── Common Types
│   ├── PaginationMetadata
│   └── DateRange
└── Type Guards
    └── Utility functions
```

### Core Type Definitions

#### ForecastItem

| Field | Type | Description |
|-------|------|-------------|
| date | string | ISO date string (YYYY-MM-DD) |
| predicted_demand | number | Predicted quantity |
| confidence_low | number | Lower confidence bound |
| confidence_high | number | Upper confidence bound |

#### ForecastResponse

| Field | Type | Description |
|-------|------|-------------|
| product | ProductInfo | Product metadata |
| forecasts | ForecastItem[] | Array of predictions |
| model | ModelType | Model used |
| horizon_days | number | Forecast horizon |
| generated_at | string | ISO timestamp |
| date_range | DateRange | Forecast period |

#### ReorderSuggestion

| Field | Type | Description |
|-------|------|-------------|
| id | string | Suggestion UUID |
| product | ProductInfo | Product info |
| current_stock | number | Current inventory |
| reorder_point | number | Reorder threshold |
| suggested_quantity | number | Suggested order qty |
| reorder_date | string | Suggested order date |
| urgency | UrgencyLevel | Urgency level |
| reason | string | Explanation |
| estimated_cost | number | Cost estimate |
| lead_time_days | number | Supplier lead time |

#### Festival

| Field | Type | Description |
|-------|------|-------------|
| id | string | Festival UUID |
| name | string | Festival name |
| type | FestivalType | Festival category |
| date | string | Festival date |
| is_multi_day | boolean | Multi-day flag |
| start_date | string | Start date if multi-day |
| end_date | string | End date if multi-day |
| impact_factor | number | Demand multiplier |
| impact_start_days | number | Impact lead time |
| impact_end_days | number | Impact trail time |
| description | string | Festival description |
| affected_categories | string[] | Affected product categories |

### Enums

#### ModelType

```
enum ModelType {
  PROPHET = 'prophet',
  ARIMA = 'arima'
}
```

#### UrgencyLevel

```
enum UrgencyLevel {
  CRITICAL = 'CRITICAL',
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW'
}
```

#### FestivalType

```
enum FestivalType {
  RELIGIOUS = 'RELIGIOUS',
  CULTURAL = 'CULTURAL',
  NATIONAL = 'NATIONAL',
  COMMERCIAL = 'COMMERCIAL'
}
```

### Type Guard Examples

| Function | Purpose |
|----------|---------|
| isForecastResponse() | Validate forecast response structure |
| isReorderSuggestion() | Validate reorder suggestion |
| isValidUrgencyLevel() | Check urgency level validity |

### JSDoc Documentation Guidelines

- Add @interface tag for interfaces
- Add @description for complex types
- Add @example for type usage
- Document all enum values
- Add @see tags for related types

### Expected Outcome

- Complete TypeScript type definitions for forecasting
- Type-safe API response handling
- IDE autocomplete support for all forecast data
- Documentation through JSDoc comments
- Reusable types across frontend application

### Verification Checklist

- [ ] `frontend/lib/forecasting/types.ts` file created
- [ ] All interfaces defined with proper fields
- [ ] Enums created for categorical values
- [ ] Type guards implemented for validation
- [ ] JSDoc comments added for documentation
- [ ] All types properly exported
- [ ] No TypeScript compilation errors
- [ ] Types match API response formats exactly

---

## Task 86: Create Forecast API Client

### Overview

Create a TypeScript API client module for interacting with the forecast API endpoints. This client provides typed methods for fetching product forecasts, reorder suggestions, and festival data, with built-in error handling, request cancellation, and response transformation. The client uses the Fetch API with proper authentication headers and follows Next.js best practices.

### Dependencies

- Task 85: Create Forecast TypeScript Types
- Task 82-84: Forecast API endpoints operational
- Next.js frontend with API configuration

### Instructions

1. **Create API client file**
   - Navigate to `frontend/lib/forecasting/` directory
   - Create `client.ts` file for API client implementation
   - Import forecast types from types.ts
   - Import error handling utilities

2. **Define API configuration**
   - Create config object with base URL
   - Define API endpoint paths as constants
   - Configure default timeout (30 seconds)
   - Set default headers (Content-Type, Accept)

3. **Create base fetch wrapper**
   - Implement fetchWithAuth() helper function
   - Add JWT token from auth context or cookie
   - Add tenant identifier header
   - Handle network errors and timeouts

4. **Implement getProductForecast method**
   - Accept product_id and optional parameters
   - Build query string from parameters
   - Call API endpoint with proper URL
   - Parse and validate response
   - Transform response to typed ForecastResponse
   - Handle errors and return typed error

5. **Implement getReorderSuggestions method**
   - Accept optional filter parameters
   - Build query string for urgency, category, pagination
   - Call reorder suggestions endpoint
   - Parse and validate response
   - Transform response to typed ReorderResponse
   - Handle pagination metadata

6. **Implement getFestivals method**
   - Accept start_date, end_date, and type parameters
   - Build query string from date range
   - Call festivals endpoint
   - Parse and validate response
   - Transform response to typed FestivalResponse
   - Handle date parsing errors

7. **Add request cancellation support**
   - Use AbortController for each request
   - Return abort function with response promise
   - Clean up controllers on component unmount
   - Handle cancellation errors gracefully

8. **Implement error handling**
   - Create custom error classes (APIError, NetworkError)
   - Parse API error responses
   - Provide user-friendly error messages
   - Log errors for debugging
   - Include error codes and details

9. **Add response caching (optional)**
   - Implement in-memory cache for GET requests
   - Cache based on URL and parameters
   - Set appropriate cache TTL
   - Invalidate cache on mutations

10. **Export client methods**
    - Export all API methods as named exports
    - Create default client instance
    - Allow custom configuration for testing
    - Document usage with JSDoc

### API Client Structure

```
forecastClient
├── Configuration
│   ├── BASE_URL
│   ├── ENDPOINTS
│   └── DEFAULT_TIMEOUT
├── Core Methods
│   ├── fetchWithAuth()
│   ├── buildQueryString()
│   └── handleResponse()
├── API Methods
│   ├── getProductForecast()
│   ├── getReorderSuggestions()
│   └── getFestivals()
└── Error Handling
    ├── APIError
    └── NetworkError
```

### API Method Signatures

#### getProductForecast

```
Parameters:
- productId: number (required)
- options: {
    horizon?: number (7-90, default: 30)
    model?: ModelType (default: 'prophet')
    include_confidence?: boolean (default: true)
  }

Returns: Promise<ForecastResponse>
```

#### getReorderSuggestions

```
Parameters:
- filters: {
    urgency?: UrgencyLevel
    category?: string
    limit?: number (1-100, default: 50)
    offset?: number (default: 0)
    order_by?: string (default: '-urgency')
  }

Returns: Promise<ReorderResponse>
```

#### getFestivals

```
Parameters:
- dateRange: {
    start_date?: string (YYYY-MM-DD, default: today)
    end_date?: string (YYYY-MM-DD, default: +90 days)
    type?: FestivalType
  }

Returns: Promise<FestivalResponse>
```

### Error Handling

| Error Type | Status Code | Handling |
|------------|-------------|----------|
| NetworkError | N/A | Retry with exponential backoff |
| AuthError | 401 | Redirect to login |
| PermissionError | 403 | Show permission denied message |
| NotFoundError | 404 | Show not found message |
| ValidationError | 400 | Show field-specific errors |
| ServerError | 500 | Show generic error, log details |

### Request Headers

| Header | Value | Purpose |
|--------|-------|---------|
| Authorization | Bearer {token} | JWT authentication |
| Content-Type | application/json | JSON request body |
| Accept | application/json | JSON response |
| X-Tenant-ID | {tenant_id} | Multi-tenant isolation |

### Response Transformation

| Transformation | Purpose |
|----------------|---------|
| Date parsing | Convert ISO strings to Date objects |
| Number parsing | Ensure numeric fields are numbers |
| Enum validation | Validate enum values |
| Null handling | Provide defaults for null values |

### Request Cancellation Pattern

```
Usage:
const { promise, cancel } = getProductForecast(123);
promise.then(data => ...).catch(err => ...);

// On component unmount:
useEffect(() => {
  return () => cancel();
}, []);
```

### Caching Strategy

| Resource | Cache Duration | Invalidation Trigger |
|----------|----------------|---------------------|
| Product Forecast | 1 hour | Product update |
| Reorder Suggestions | 15 minutes | Stock change |
| Festivals | 24 hours | Calendar update |

### Expected Outcome

- Complete API client with typed methods
- Error handling for all error scenarios
- Request cancellation support
- Response transformation and validation
- Reusable across all forecast components

### Verification Checklist

- [ ] `frontend/lib/forecasting/client.ts` file created
- [ ] All three API methods implemented
- [ ] Type-safe parameters and return types
- [ ] Authentication headers included
- [ ] Error handling for all scenarios
- [ ] Request cancellation implemented
- [ ] Response transformation working
- [ ] JSDoc documentation added
- [ ] No TypeScript compilation errors

---

## Task 87: Create ForecastChart Component

### Overview

Create a React component that visualizes product demand forecasts using an interactive line chart. The component displays historical sales data alongside predicted demand with confidence intervals, using Recharts for rendering. It supports multiple visualization modes, date range selection, and responsive design for various screen sizes.

### Dependencies

- Task 86: Create Forecast API Client
- Task 85: Create Forecast TypeScript Types
- Recharts library installed
- Shadcn/UI components for UI elements

### Instructions

1. **Create component directory structure**
   - Navigate to `frontend/components/` directory
   - Create `inventory/` subdirectory if not exists
   - Create `ForecastChart.tsx` file

2. **Import required dependencies**
   - Import React hooks (useState, useEffect, useMemo)
   - Import Recharts components (LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid, Area, ComposedChart)
   - Import forecast types and API client
   - Import Shadcn/UI components (Card, Select, Skeleton)

3. **Define component props interface**
   - Accept productId: number (required)
   - Accept horizon?: number (optional, default: 30)
   - Accept model?: ModelType (optional, default: 'prophet')
   - Accept showHistorical?: boolean (optional, default: true)
   - Accept height?: number (optional, default: 400)

4. **Implement data fetching logic**
   - Use useEffect to fetch forecast on mount
   - Call getProductForecast with productId and options
   - Handle loading state with boolean flag
   - Handle error state with error object
   - Store forecast data in state

5. **Transform data for chart**
   - Combine historical and forecast data
   - Format dates for X-axis display
   - Create data points with actual and predicted values
   - Add confidence interval data (low and high)
   - Use useMemo to memoize transformation

6. **Implement chart configuration**
   - Set chart margins and dimensions
   - Configure responsive container
   - Set X-axis with date formatting
   - Set Y-axis with quantity labels
   - Add grid lines for readability

7. **Add multiple data series**
   - Historical sales line (blue, solid)
   - Predicted demand line (green, solid)
   - Confidence interval area (green, semi-transparent)
   - Add visual distinction between historical and forecast

8. **Create interactive tooltip**
   - Show date, actual value, predicted value
   - Show confidence interval range
   - Format numbers with proper units
   - Style tooltip with brand colors

9. **Add chart controls**
   - Horizon selector (7, 30, 90 days)
   - Model selector (Prophet, ARIMA)
   - Toggle historical data display
   - Export chart as image (optional)

10. **Implement responsive design**
    - Use ResponsiveContainer from Recharts
    - Adjust chart height for mobile
    - Simplify X-axis labels on small screens
    - Hide legend on very small screens

11. **Add loading and error states**
    - Show Skeleton component while loading
    - Show error message if fetch fails
    - Provide retry button on error
    - Show empty state if no data

### Component Structure

```
ForecastChart
├── State Management
│   ├── forecast data
│   ├── loading
│   ├── error
│   └── chart options
├── Data Fetching
│   └── useEffect with API call
├── Data Transformation
│   └── useMemo for chart data
├── UI Elements
│   ├── Controls (selectors)
│   ├── Chart (Recharts)
│   └── Error/Loading states
└── Responsive Container
```

### Chart Configuration

| Element | Configuration |
|---------|--------------|
| Chart Type | ComposedChart (Line + Area) |
| Data Series | Historical (actual), Forecast (predicted), Confidence (area) |
| X-Axis | Date formatted as MMM DD |
| Y-Axis | Quantity with unit label |
| Tooltip | Custom with formatted data |
| Legend | Show series labels |
| Grid | Light gray dashed lines |

### Data Series Styling

| Series | Color | Line Style | Opacity |
|--------|-------|------------|---------|
| Historical | Blue (#0066CC) | Solid, 2px | 1.0 |
| Forecast | Green (#00AA44) | Solid, 2px | 1.0 |
| Confidence | Green (#00AA44) | Area fill | 0.2 |

### Visual Layout

```
┌─────────────────────────────────────────┐
│ [Horizon: 30 days ▼] [Model: Prophet ▼]│
├─────────────────────────────────────────┤
│  Quantity                               │
│  │                                      │
│  │     ╱───────╲                       │
│  │    ╱         ╲                      │
│  │   ╱Historical ╲  Forecast╲         │
│  │  ╱             ╲:::::::::::╲       │
│  │ ╱               ╲:::::::::::│      │
│  └─────────────────────────────────────│
│    Jan 31  Feb 7   Feb 14  Feb 21     │
│                                         │
│  ━ Historical  ━ Predicted  ▢ Confidence│
└─────────────────────────────────────────┘
```

### Tooltip Format

```
February 15, 2026
Actual: 45 units
Predicted: 48 units
Confidence: 42 - 54 units
```

### Responsive Breakpoints

| Screen Size | Chart Height | Legend | X-Axis Labels |
|------------|--------------|--------|---------------|
| Mobile (<640px) | 300px | Hidden | Every 7 days |
| Tablet (640-1024px) | 350px | Visible | Every 5 days |
| Desktop (>1024px) | 400px | Visible | Every 3 days |

### Error States

| Error Type | Message | Action |
|------------|---------|--------|
| Network Error | "Failed to load forecast data" | Retry button |
| Not Found | "Product not found" | Go back link |
| No Data | "No forecast available for this product" | Info message |

### Expected Outcome

- Interactive forecast visualization component
- Combined historical and predicted data display
- Confidence interval visualization
- Responsive design for all devices
- Intuitive controls for customization

### Verification Checklist

- [ ] `frontend/components/inventory/ForecastChart.tsx` created
- [ ] Data fetching with API client working
- [ ] Chart renders historical and forecast data
- [ ] Confidence intervals displayed correctly
- [ ] Horizon and model selectors functional
- [ ] Tooltip shows formatted data
- [ ] Responsive on mobile and desktop
- [ ] Loading and error states implemented
- [ ] TypeScript types properly applied
- [ ] Component properly exported

---

## Task 88: Create ReorderTable Component

### Overview

Create a React component that displays reorder suggestions in an interactive, sortable data table. The component shows products that need reordering with key information like current stock, suggested quantity, urgency level, and reorder date. It uses Shadcn/UI Table components with filtering, sorting, pagination, and bulk action support.

### Dependencies

- Task 86: Create Forecast API Client
- Task 85: Create Forecast TypeScript Types
- Shadcn/UI Table components installed
- Shadcn/UI Badge and Button components

### Instructions

1. **Create component file**
   - Navigate to `frontend/components/inventory/` directory
   - Create `ReorderTable.tsx` file

2. **Import required dependencies**
   - Import React hooks (useState, useEffect, useMemo)
   - Import Shadcn/UI components (Table, Badge, Button, Select)
   - Import forecast types and API client
   - Import icons for actions

3. **Define component props interface**
   - Accept initialFilters?: ReorderFilters (optional)
   - Accept onReorder?: (suggestion: ReorderSuggestion) => void
   - Accept selectable?: boolean (default: false)
   - Accept onSelectionChange?: (selected: string[]) => void

4. **Implement data fetching**
   - Use useEffect to fetch suggestions on mount
   - Call getReorderSuggestions with filters
   - Handle loading and error states
   - Support pagination with offset/limit

5. **Create filter controls**
   - Urgency filter dropdown (All, Critical, High, Medium, Low)
   - Category filter dropdown
   - Search by product name or SKU
   - Apply filters button and reset filters button

6. **Implement table columns**
   - Checkbox column (if selectable)
   - Product column (name, SKU, category)
   - Current Stock column with visual indicator
   - Reorder Point column
   - Suggested Quantity column
   - Reorder Date column
   - Urgency column with colored badge
   - Actions column with "Order" button

7. **Add sorting functionality**
   - Click column headers to sort
   - Support ascending and descending order
   - Visual indicator for sort direction
   - Multi-column sorting (optional)

8. **Create urgency badges**
   - CRITICAL: Red badge
   - HIGH: Orange badge
   - MEDIUM: Yellow badge
   - LOW: Blue badge
   - Use Shadcn/UI Badge component

9. **Add stock level indicators**
   - Red indicator: below reorder point
   - Yellow indicator: at reorder point
   - Green indicator: above reorder point
   - Show percentage of reorder point

10. **Implement pagination controls**
    - Previous and Next buttons
    - Page number display
    - Items per page selector (10, 25, 50, 100)
    - Total results counter

11. **Add bulk actions (if selectable)**
    - Select all checkbox in header
    - Bulk order button
    - Bulk export to CSV
    - Selection counter

12. **Create row actions**
    - "Order Now" button for each row
    - "View Forecast" link to forecast chart
    - "View Product" link to product detail
    - Action menu with more options

13. **Add empty and error states**
    - Empty state: "No reorder suggestions"
    - Loading state: Skeleton rows
    - Error state: Error message with retry
    - No results for filters: Clear filters message

### Component Structure

```
ReorderTable
├── State Management
│   ├── suggestions data
│   ├── filters
│   ├── pagination
│   ├── sorting
│   └── selection
├── Data Fetching
│   └── useEffect with API call
├── Filter Controls
│   ├── Urgency filter
│   ├── Category filter
│   └── Search input
├── Table
│   ├── Header with sort
│   ├── Body with rows
│   └── Pagination footer
└── Actions
    └── Row and bulk actions
```

### Table Columns

| Column | Width | Sortable | Description |
|--------|-------|----------|-------------|
| Checkbox | 50px | No | Row selection |
| Product | 250px | Yes | Name, SKU, category |
| Current Stock | 120px | Yes | Current quantity |
| Reorder Point | 120px | Yes | Threshold quantity |
| Suggested Qty | 120px | Yes | Order quantity |
| Reorder Date | 120px | Yes | Suggested date |
| Urgency | 100px | Yes | Priority badge |
| Actions | 150px | No | Action buttons |

### Urgency Badge Styling

| Urgency | Color | Background | Text |
|---------|-------|------------|------|
| CRITICAL | Red | bg-red-100 | text-red-800 |
| HIGH | Orange | bg-orange-100 | text-orange-800 |
| MEDIUM | Yellow | bg-yellow-100 | text-yellow-800 |
| LOW | Blue | bg-blue-100 | text-blue-800 |

### Stock Level Indicator

```
Current Stock: 15 / Reorder Point: 50
[███░░░░░░░] 30%
Color: Red (below threshold)

Current Stock: 75 / Reorder Point: 50
[██████████] 150%
Color: Green (above threshold)
```

### Filter UI Layout

```
┌──────────────────────────────────────────┐
│ Urgency: [All ▼] Category: [All ▼]      │
│ Search: [________________] [Apply] [Reset]│
└──────────────────────────────────────────┘
```

### Table Layout

```
┌─┬──────────────┬──────┬──────┬──────┬───────┬────────┬─────────┐
│☐│ Product      │Stock │Reorder│Qty  │Date   │Urgency │Actions  │
├─┼──────────────┼──────┼──────┼──────┼───────┼────────┼─────────┤
│☐│Widget A      │  15  │  50  │ 100 │Feb 05 │CRITICAL│[Order]  │
│ │SKU-001       │      │      │     │       │        │         │
│ │Electronics   │      │      │     │       │        │         │
├─┼──────────────┼──────┼──────┼──────┼───────┼────────┼─────────┤
│☐│Widget B      │  45  │  40  │  80 │Feb 10 │HIGH    │[Order]  │
│ │SKU-002       │      │      │     │       │        │         │
│ │Electronics   │      │      │     │       │        │         │
└─┴──────────────┴──────┴──────┴──────┴───────┴────────┴─────────┘

[< Previous]  Page 1 of 3  [Next >]
```

### Pagination Controls

| Element | Description |
|---------|-------------|
| Previous Button | Go to previous page (disabled on first page) |
| Next Button | Go to next page (disabled on last page) |
| Page Info | "Page X of Y" or "Showing X-Y of Z results" |
| Per Page Selector | Dropdown with 10, 25, 50, 100 options |

### Responsive Design

| Screen Size | Layout Adjustments |
|------------|-------------------|
| Mobile | Stack product info vertically, hide less critical columns |
| Tablet | Show all columns, smaller padding |
| Desktop | Full table with all features |

### Expected Outcome

- Functional reorder suggestions table
- Sortable and filterable data
- Urgency-based visual indicators
- Pagination for large datasets
- Responsive design for all devices
- Bulk action support

### Verification Checklist

- [ ] `frontend/components/inventory/ReorderTable.tsx` created
- [ ] Data fetching from API working
- [ ] All table columns rendered correctly
- [ ] Sorting functionality implemented
- [ ] Filter controls functional
- [ ] Urgency badges styled correctly
- [ ] Stock indicators working
- [ ] Pagination controls implemented
- [ ] Row actions functional
- [ ] Responsive on mobile and desktop
- [ ] Loading and error states implemented

---

## Task 89: Create FestivalCalendarUI Component

### Overview

Create a React component that displays Sri Lankan festivals and holidays in a visual calendar format. The component shows festivals with their dates, types, and demand impact factors. It supports date range navigation, festival type filtering, and detailed festival information tooltips. This component helps inventory managers anticipate demand spikes during festival periods.

### Dependencies

- Task 86: Create Forecast API Client
- Task 85: Create Forecast TypeScript Types
- Shadcn/UI Calendar component (optional) or custom implementation
- Date manipulation library (date-fns or similar)

### Instructions

1. **Create component file**
   - Navigate to `frontend/components/inventory/` directory
   - Create `FestivalCalendar.tsx` file

2. **Import required dependencies**
   - Import React hooks (useState, useEffect)
   - Import Shadcn/UI components (Card, Badge, Popover, Button)
   - Import date-fns for date manipulation
   - Import forecast types and API client
   - Import calendar icons

3. **Define component props interface**
   - Accept initialDate?: Date (default: today)
   - Accept view?: 'month' | 'quarter' | 'year' (default: 'quarter')
   - Accept showImpactFactors?: boolean (default: true)
   - Accept onFestivalClick?: (festival: Festival) => void

4. **Implement data fetching**
   - Use useEffect to fetch festivals based on date range
   - Calculate start and end dates based on view
   - Call getFestivals API method
   - Handle loading and error states

5. **Create calendar navigation controls**
   - Previous period button
   - Current period label (e.g., "Q1 2026")
   - Next period button
   - Today button to reset to current date
   - View selector (Month, Quarter, Year)

6. **Implement festival type filter**
   - Toggle buttons for each festival type
   - RELIGIOUS, CULTURAL, NATIONAL, COMMERCIAL
   - "All Types" option
   - Apply filter to displayed festivals

7. **Create calendar grid layout**
   - Month view: Traditional calendar grid (7 columns)
   - Quarter view: Timeline with months
   - Year view: Compact timeline with all months
   - Mark festival dates on calendar

8. **Display festival indicators**
   - Visual marker on festival dates
   - Color-coded by festival type
   - Size or brightness based on impact factor
   - Multiple festivals on same date: stacked indicators

9. **Create festival detail popover**
   - Trigger on festival indicator hover or click
   - Show festival name, type, date(s)
   - Show impact factor with visual indicator
   - Show affected categories
   - Show description

10. **Add impact factor visualization**
    - Use bar or heat map for impact intensity
    - Show impact duration (start and end days)
    - Color gradient: low (blue) to high (red)
    - Legend explaining impact scale

11. **Implement festival list view (alternative)**
    - List festivals in chronological order
    - Show festival card with all details
    - Filter and search functionality
    - Export to calendar file (ICS)

12. **Add responsive design**
    - Month view on desktop
    - List view on mobile (calendar too small)
    - Simplified indicators on small screens
    - Touch-friendly interactions

13. **Create empty and loading states**
    - Loading: Skeleton calendar grid
    - No festivals: "No festivals in this period"
    - Error: Error message with retry button

### Component Structure

```
FestivalCalendarUI
├── State Management
│   ├── festivals data
│   ├── date range
│   ├── view mode
│   └── filters
├── Data Fetching
│   └── useEffect with API call
├── Navigation Controls
│   ├── Period navigation
│   └── View selector
├── Filter Controls
│   └── Festival type toggles
├── Calendar Display
│   ├── Grid/Timeline layout
│   └── Festival indicators
├── Festival Details
│   └── Popover with info
└── Legend
    └── Impact factor scale
```

### Calendar View Options

| View | Date Range | Layout | Best For |
|------|-----------|--------|----------|
| Month | 1 month | Calendar grid | Detailed planning |
| Quarter | 3 months | Timeline | Medium-term planning |
| Year | 12 months | Compact timeline | Long-term planning |

### Festival Type Colors

| Type | Color | Background | Example |
|------|-------|------------|---------|
| RELIGIOUS | Purple | bg-purple-200 | Vesak, Christmas |
| CULTURAL | Orange | bg-orange-200 | New Year |
| NATIONAL | Blue | bg-blue-200 | Independence Day |
| COMMERCIAL | Green | bg-green-200 | Black Friday |

### Impact Factor Visualization

| Impact | Color | Heat Map |
|--------|-------|----------|
| 1.0-1.5 | Light Blue | █░░░░ |
| 1.5-2.5 | Yellow | ███░░ |
| 2.5-3.5 | Orange | ████░ |
| 3.5+ | Red | █████ |

### Calendar Grid Layout (Month View)

```
┌─────────────────────────────────────────┐
│ [< Previous]  February 2026  [Next >]   │
│ [Today] [Month ▼]                       │
├───┬───┬───┬───┬───┬───┬───┐            │
│Sun│Mon│Tue│Wed│Thu│Fri│Sat│            │
├───┼───┼───┼───┼───┼───┼───┤            │
│ 1 │ 2 │ 3 │ 4*│ 5 │ 6 │ 7 │  * Festival│
├───┼───┼───┼───┼───┼───┼───┤            │
│ 8 │ 9 │10 │11 │12 │13*│14*│            │
├───┼───┼───┼───┼───┼───┼───┤            │
│15 │16 │17 │18 │19 │20 │21 │            │
└───┴───┴───┴───┴───┴───┴───┘            │
│                                         │
│ Filter: [RELIGIOUS] [CULTURAL] [ALL]   │
│                                         │
│ Impact Factor Legend:                   │
│ █░░░░ Low  ███░░ Medium  █████ High   │
└─────────────────────────────────────────┘
```

### Festival Popover Content

```
┌────────────────────────────┐
│ Sinhala & Tamil New Year   │
│ Type: CULTURAL             │
│ Date: April 13-14, 2026    │
│                            │
│ Impact Factor: 4.0 (High)  │
│ ████░ Very High Impact     │
│                            │
│ Impact Duration:           │
│ • 7 days before            │
│ • 2 days after             │
│                            │
│ Affected Categories:       │
│ • All Categories           │
│                            │
│ Sri Lankan New Year        │
│ celebration...             │
└────────────────────────────┘
```

### Timeline View (Quarter View)

```
January        February       March
├──────────────┼──────────────┼──────────────┤
│    Pongal    │Independence  │              │
│      ●       │      ●       │              │
│   Impact:2.5 │   Impact:1.5 │              │
└──────────────┴──────────────┴──────────────┘
```

### Responsive Behavior

| Screen Size | View | Interactions |
|------------|------|--------------|
| Mobile (<640px) | List view | Tap to expand festival |
| Tablet (640-1024px) | Month view | Hover/tap for popover |
| Desktop (>1024px) | Quarter view | Hover for popover |

### Expected Outcome

- Visual festival calendar component
- Multiple view options (month, quarter, year)
- Festival type filtering
- Impact factor visualization
- Interactive festival details
- Responsive design for all devices

### Verification Checklist

- [ ] `frontend/components/inventory/FestivalCalendar.tsx` created
- [ ] Data fetching from API working
- [ ] Navigation controls functional
- [ ] Festival type filters working
- [ ] Calendar grid/timeline rendering correctly
- [ ] Festival indicators color-coded
- [ ] Impact factors visualized
- [ ] Popover with festival details functional
- [ ] Responsive design implemented
- [ ] Loading and error states working

---

## Task 90: Create Integration Tests

### Overview

Create comprehensive end-to-end integration tests for the demand forecasting system, covering API endpoints, frontend components, and their interactions. These tests validate the complete user workflow from requesting forecasts to viewing visualizations and acting on reorder suggestions. Use pytest for backend tests and React Testing Library for frontend tests.

### Dependencies

- Task 81-89: All API and frontend components complete
- pytest and pytest-django installed for backend testing
- React Testing Library and Jest configured for frontend testing
- Test database configured with sample data

### Instructions

1. **Create backend test directory structure**
   - Navigate to `backend/tests/` directory
   - Create `ai/` subdirectory if not exists
   - Create `test_forecasting_e2e.py` file

2. **Set up test fixtures and data**
   - Create pytest fixture for test tenant
   - Create fixture for test products with historical sales
   - Create fixture for authenticated test user
   - Create fixture for festival calendar data
   - Use FactoryBoy or similar for data generation

3. **Test forecast API endpoint (Task 82)**
   - Test successful product forecast retrieval
   - Test with different horizon values (7, 30, 90 days)
   - Test with different models (Prophet, ARIMA)
   - Test with invalid product ID (404)
   - Test without authentication (401)
   - Test tenant isolation (can't access other tenant's products)
   - Verify response format matches schema

4. **Test reorder suggestions API (Task 83)**
   - Test successful suggestions retrieval
   - Test urgency filtering (CRITICAL, HIGH, etc.)
   - Test category filtering
   - Test pagination (limit, offset)
   - Test sorting (by urgency, date, quantity)
   - Verify summary statistics calculation
   - Test empty results scenario

5. **Test festival calendar API (Task 84)**
   - Test successful festival retrieval
   - Test date range filtering
   - Test festival type filtering
   - Test invalid date range (400)
   - Test date range > 365 days (400)
   - Verify metadata calculation
   - Test Sri Lankan festival data accuracy

6. **Test API error handling**
   - Test invalid parameters return 400
   - Test missing authentication returns 401
   - Test insufficient permissions return 403
   - Test not found resources return 404
   - Test server errors return 500 with proper format
   - Test error message clarity

7. **Create frontend component tests**
   - Navigate to `frontend/components/inventory/__tests__/`
   - Create test files for each component
   - Use React Testing Library conventions

8. **Test ForecastChart component (Task 87)**
   - Test component renders with mock data
   - Test loading state displays skeleton
   - Test error state displays error message
   - Test horizon selector changes data
   - Test model selector changes data
   - Test chart renders historical and forecast data
   - Test tooltip displays on hover
   - Test responsive behavior

9. **Test ReorderTable component (Task 88)**
   - Test table renders with mock suggestions
   - Test sorting by different columns
   - Test urgency filtering works
   - Test category filtering works
   - Test pagination controls work
   - Test row selection (if enabled)
   - Test bulk actions (if enabled)
   - Test "Order Now" button click

10. **Test FestivalCalendarUI component (Task 89)**
    - Test calendar renders with mock festivals
    - Test navigation controls work
    - Test view selector changes layout
    - Test festival type filtering works
    - Test festival popover displays on click
    - Test impact factor visualization
    - Test responsive behavior

11. **Test API client integration**
    - Test API client methods with mocked fetch
    - Test error handling in API client
    - Test request cancellation works
    - Test response transformation
    - Test authentication header inclusion

12. **Create end-to-end workflow tests**
    - Test complete user journey: login → view product → request forecast → view chart
    - Test reorder workflow: view suggestions → filter by urgency → order product
    - Test festival planning: view calendar → identify high-impact festivals → adjust inventory

13. **Test tenant isolation**
    - Test Tenant A cannot access Tenant B's forecasts
    - Test API returns only current tenant's data
    - Test cross-tenant requests return 403

14. **Add performance tests**
    - Test API response times under load
    - Test large forecast horizon performance
    - Test pagination with large datasets
    - Test component rendering with large data

15. **Document test coverage**
    - Run coverage report for backend (pytest-cov)
    - Run coverage report for frontend (Jest coverage)
    - Aim for >80% code coverage
    - Document any untested edge cases

### Test File Structure

```
backend/tests/ai/
├── __init__.py
├── test_forecasting_e2e.py
│   ├── Fixtures
│   ├── API Tests (Task 82-84)
│   ├── Error Handling Tests
│   ├── Tenant Isolation Tests
│   └── Performance Tests
└── conftest.py (shared fixtures)

frontend/components/inventory/__tests__/
├── ForecastChart.test.tsx
├── ReorderTable.test.tsx
└── FestivalCalendar.test.tsx
```

### Backend Test Categories

| Category | Test Count | Coverage |
|----------|-----------|----------|
| Product Forecast API | 10 tests | Endpoint, validation, errors |
| Reorder Suggestions API | 12 tests | Filtering, pagination, sorting |
| Festival Calendar API | 8 tests | Date ranges, filtering |
| Error Handling | 6 tests | All error scenarios |
| Tenant Isolation | 4 tests | Multi-tenancy security |
| Performance | 3 tests | Response times |

### Frontend Test Categories

| Category | Test Count | Coverage |
|----------|-----------|----------|
| ForecastChart | 8 tests | Rendering, interactions, states |
| ReorderTable | 10 tests | Table, filtering, sorting |
| FestivalCalendar | 7 tests | Calendar, navigation, popover |
| API Client | 5 tests | Client methods, errors |

### Test Naming Convention

```
Backend (pytest):
- test_{function_name}_{scenario}
- Example: test_product_forecast_success()
- Example: test_product_forecast_invalid_product_id()

Frontend (Jest):
- "should {expected behavior} when {condition}"
- Example: "should render chart when data is loaded"
- Example: "should show error message when API fails"
```

### Assertion Examples

#### Backend API Test

```
Test: test_product_forecast_success()
Assertions:
- Response status code is 200
- Response contains 'forecasts' key
- Forecasts array has correct length (horizon days)
- Each forecast has date, predicted_demand, confidence_low, confidence_high
- product.id matches request parameter
- generated_at is recent timestamp
```

#### Frontend Component Test

```
Test: "should render forecast chart with data"
Assertions:
- Chart component is in document
- Historical data line is rendered
- Forecast data line is rendered
- Confidence interval area is rendered
- X-axis shows correct date range
- Tooltip appears on hover
```

### Mock Data Requirements

| Data Type | Quantity | Purpose |
|-----------|----------|---------|
| Test Tenants | 2 | Tenant isolation tests |
| Test Products | 10 | Various product scenarios |
| Historical Sales | 180 days | Realistic forecast input |
| Festivals | 20 | Calendar year coverage |
| Reorder Suggestions | 15 | Table pagination tests |

### Coverage Goals

| Component | Target Coverage | Priority |
|-----------|----------------|----------|
| API ViewSets | >90% | Critical |
| Service Layer | >85% | Critical |
| API Client | >80% | High |
| React Components | >75% | High |
| Utility Functions | >80% | Medium |

### Performance Benchmarks

| Operation | Max Response Time | Test |
|-----------|------------------|------|
| Product Forecast | <500ms | With cache |
| Reorder Suggestions | <200ms | Page of 50 |
| Festival Calendar | <100ms | 90-day range |
| Chart Render | <100ms | 30 data points |

### Expected Outcome

- Comprehensive test suite for forecasting system
- >80% code coverage for critical paths
- All API endpoints tested with multiple scenarios
- All frontend components tested with interactions
- Tenant isolation verified
- Performance validated

### Verification Checklist

- [ ] Backend test file created with all API tests
- [ ] Frontend test files created for all components
- [ ] Test fixtures and mock data set up
- [ ] All success scenarios tested
- [ ] All error scenarios tested
- [ ] Tenant isolation tested
- [ ] Performance tests implemented
- [ ] Coverage reports generated
- [ ] All tests passing
- [ ] Test documentation added

---

## Summary

This document covered the complete API and frontend implementation for the demand forecasting system. The work includes creating Django REST Framework API endpoints for forecasts, reorder suggestions, and festival data; building TypeScript types and API clients for type-safe frontend integration; developing React components for data visualization using Recharts and Shadcn/UI; and implementing comprehensive integration tests to ensure system reliability.

### Completed Tasks

1. ✓ Created ForecastViewSet with authentication and multi-tenancy
2. ✓ Implemented product forecast endpoint with caching
3. ✓ Implemented reorder suggestions endpoint with filtering
4. ✓ Implemented festival calendar API with Sri Lankan festivals
5. ✓ Created comprehensive TypeScript type definitions
6. ✓ Built forecast API client with error handling
7. ✓ Built ForecastChart component with Recharts
8. ✓ Built ReorderTable component with Shadcn/UI
9. ✓ Built FestivalCalendarUI component with visual indicators
10. ✓ Created end-to-end integration test suite

### Key Deliverables

- **API Layer:** RESTful endpoints for all forecast operations
- **Type Safety:** Complete TypeScript types for frontend
- **API Client:** Type-safe client with error handling
- **Visualizations:** Interactive charts for demand forecasts
- **Data Tables:** Sortable, filterable reorder suggestions
- **Calendar UI:** Visual festival calendar with impact factors
- **Test Coverage:** Comprehensive E2E tests for reliability

### Next Steps

Proceed to [SubPhase-04_Smart-Search-Backend](../../SubPhase-04_Smart-Search-Backend/) to implement semantic search capabilities for products, including vector embeddings, search API, and intelligent query understanding for the ERP system.

---

**End of Document**
