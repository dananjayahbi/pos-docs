# Tasks 67-72: Options, API, and Verification

> **Phase:** 09 - Integrations & Sri Lanka Localizations  
> **SubPhase:** 09 - Domex & Other Couriers  
> **Group:** D - Courier Comparison  
> **Document:** 02 of 02  
> **Tasks Covered:** 67, 68, 69, 70, 71, 72

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-61-66_Factory-Rates.md](01_Tasks-61-66_Factory-Rates.md)

---

## Document Overview

This document covers the creation of additional rate comparison utilities, including speed-based sorting, convenience methods for identifying cheapest and fastest options, the API endpoint for rate comparison, tenant-level preferred courier settings, and comprehensive verification of the comparison functionality.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 67 | Create sort_by_speed | Low | 20 min |
| 68 | Create Cheapest Option | Low | 15 min |
| 69 | Create Fastest Option | Low | 15 min |
| 70 | Create Rate Comparison API | Medium | 40 min |
| 71 | Create Preferred Courier | Low | 25 min |
| 72 | Verify Comparison | Low | 30 min |

---

## Task 67: Create sort_by_speed

### Overview
Implement the sort_by_speed method in RateComparisonService that sorts a list of CourierRate objects by delivery time in ascending order. This method enables users to find the fastest shipping options, prioritizing shorter delivery times over price considerations. The method handles various delivery time formats and provides consistent sorting.

### Dependencies
- Task 65: Create get_all_rates Method
- CourierRate data structure

### Instructions

1. **Define sort_by_speed method signature**
   - Accept rates parameter (List[CourierRate])
   - Return type hint: List[CourierRate]
   - Optional parameter: ascending (bool, default=True)

2. **Filter unavailable rates**
   - Remove rates where available=False
   - Remove rates without delivery time data
   - Log number of rates filtered out
   - Handle empty list after filtering

3. **Implement delivery time normalization**
   - Convert delivery_estimate strings to days
   - Parse "1-2 days" format to minimum value
   - Handle "Next day" as 1 day
   - Handle "Same day" as 0.5 days
   - Store normalized value for sorting

4. **Implement sorting logic**
   - Sort by delivery_days field in ascending order
   - Use normalized delivery time for comparison
   - Maintain stable sort for equal times
   - Use Python's sorted() function

5. **Add secondary sorting**
   - When delivery times are equal, sort by price
   - Cheaper option wins at same speed
   - Fallback to courier name if still equal

6. **Handle missing delivery data**
   - Rates without delivery_days go to end
   - Log warning for missing delivery data
   - Consider setting default high value (99 days)

7. **Implement descending option**
   - Allow reverse=True for slowest first
   - Default to ascending (fastest first)
   - Document parameter usage

8. **Add logging**
   - Log sorting operation
   - Log number of rates sorted
   - Log fastest rate found

### Method Signature

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| rates | List[CourierRate] | Yes | - | Rates to sort |
| ascending | bool | No | True | Sort order |

### Sorting Flow

```
sort_by_speed(rates)
    ↓
1. Filter unavailable rates
    ↓
2. Normalize delivery times
    ↓
3. Sort by delivery_days (ascending)
    ↓
4. Secondary sort by price
    ↓
5. Return sorted list
```

### Delivery Time Normalization

| Input Format | Normalized Days | Logic |
|--------------|----------------|-------|
| "1 day" | 1 | Extract number |
| "2-3 days" | 2 | Use minimum |
| "Next day" | 1 | Standard conversion |
| "Same day" | 0.5 | Half day |
| "3-5 business days" | 3 | Use minimum |
| null | 99 | Default high value |

### Sorting Priority

| Priority | Field | Order |
|----------|-------|-------|
| 1 | delivery_days | Ascending |
| 2 | price | Ascending |
| 3 | courier | Alphabetical |

### Example Input/Output

**Input:**
```
[
  CourierRate(courier="Koombiyo", price=350, delivery_days=2),
  CourierRate(courier="Domex", price=420, delivery_days=1),
  CourierRate(courier="Royal", price=380, delivery_days=2),
  CourierRate(courier="Trance", available=False)
]
```

**Output:**
```
[
  CourierRate(courier="Domex", price=420, delivery_days=1),
  CourierRate(courier="Koombiyo", price=350, delivery_days=2),
  CourierRate(courier="Royal", price=380, delivery_days=2)
]
```

### Secondary Sort Example

**Scenario:** Two couriers with same delivery time
```
Input:
  Royal Express: ₨380, 2 days
  Koombiyo: ₨350, 2 days

Output:
  Koombiyo: ₨350, 2 days (cheaper)
  Royal Express: ₨380, 2 days
```

### Edge Cases Handling

| Scenario | Handling | Result |
|----------|----------|--------|
| Empty list | Return empty list | [] |
| All unavailable | Return empty list | [] |
| Single rate | Return as-is | [rate] |
| Missing delivery_days | Place at end | Last in list |
| Equal delivery times | Sort by price | Cheaper first |

### Delivery Estimate Parsing

| Estimate String | Parsing Logic | Result |
|-----------------|---------------|--------|
| "1-2 days" | Extract first number | 1 |
| "Next business day" | Standard mapping | 1 |
| "3-5 days" | Extract first number | 3 |
| "Express delivery" | Check delivery_days field | Use field value |
| null or empty | Default value | 99 |

### Logging Examples

| Event | Level | Message |
|-------|-------|---------|
| Sort Start | DEBUG | "Sorting {count} rates by delivery time" |
| Normalization | DEBUG | "Normalized '{estimate}' to {days} days" |
| Filter | DEBUG | "Filtered out {count} unavailable rates" |
| Empty Result | INFO | "No available rates to sort" |
| Complete | DEBUG | "Sorted {count} rates, fastest: {days} days" |

### Return Value Structure

```
List[CourierRate] (Sorted by Speed)
├── [0] Fastest
│   ├── delivery_days: 1
│   └── price: ₨420
├── [1] Second Fastest
│   ├── delivery_days: 2
│   └── price: ₨350
└── [2] Third Fastest
    ├── delivery_days: 2
    └── price: ₨380
```

### Implementation Considerations

| Aspect | Strategy | Reason |
|--------|----------|--------|
| Parsing | Regex for number extraction | Flexible |
| Default | 99 days for missing | Push to end |
| Stability | Maintain original order | Predictable |
| Performance | O(n log n) sorting | Efficient |

### Expected Outcome
- Functional sort_by_speed method
- Rates sorted by delivery time in ascending order
- Unavailable rates filtered out
- Delivery time normalization implemented
- Secondary sorting by price

### Verification Checklist
- [ ] sort_by_speed method implemented
- [ ] Accepts List[CourierRate] parameter
- [ ] Filters unavailable rates
- [ ] Normalizes delivery time strings
- [ ] Sorts by delivery_days in ascending order
- [ ] Secondary sort by price
- [ ] Handles missing delivery data
- [ ] Handles empty list
- [ ] Logging added for sorting operation
- [ ] Returns sorted List[CourierRate]

---

## Task 68: Create Cheapest Option

### Overview
Implement the get_cheapest_rate method in RateComparisonService that returns the single cheapest shipping option from a list of rates. This convenience method simplifies the common use case of finding the lowest-cost shipping option, wrapping the sort_by_price functionality and returning only the first result.

### Dependencies
- Task 66: Create sort_by_price Method

### Instructions

1. **Define get_cheapest_rate method signature**
   - Accept rates parameter (List[CourierRate])
   - Return type hint: Optional[CourierRate]
   - No additional parameters needed

2. **Call sort_by_price method**
   - Pass rates to sort_by_price()
   - Use default ascending order
   - Handle empty result from sorting

3. **Extract first result**
   - Get first element from sorted list
   - Return None if list is empty
   - Return CourierRate object if available

4. **Add null safety**
   - Check if sorted list is empty
   - Return None for no available rates
   - Log when no cheapest option found

5. **Implement logging**
   - Log method invocation
   - Log cheapest rate found
   - Log when no rates available

6. **Add docstring**
   - Document method purpose
   - Explain return value
   - Provide usage example

### Method Signature

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| rates | List[CourierRate] | Yes | - | Rates to analyze |
| **Return** | Optional[CourierRate] | - | - | Cheapest rate or None |

### Method Flow

```
get_cheapest_rate(rates)
    ↓
1. Call sort_by_price(rates)
    ↓
2. Check if result is empty
    ↓
3. Return first item if available
    ↓
4. Return None if empty
```

### Return Value Logic

| Scenario | Sorted List | Return Value |
|----------|-------------|--------------|
| Multiple rates | [Rate1, Rate2, Rate3] | Rate1 (cheapest) |
| Single rate | [Rate1] | Rate1 |
| No available | [] | None |
| All unavailable | [] | None |

### Example Usage

**Input:**
```
rates = [
  CourierRate(courier="Domex", price=420, delivery_days=1),
  CourierRate(courier="Koombiyo", price=350, delivery_days=2),
  CourierRate(courier="Royal", price=380, delivery_days=2)
]

cheapest = service.get_cheapest_rate(rates)
```

**Output:**
```
CourierRate(
  courier="Koombiyo",
  price=350,
  delivery_days=2
)
```

### Null Handling

| Input | Sorted Result | Return |
|-------|---------------|--------|
| Valid rates | [Rate1, ...] | Rate1 |
| Empty list | [] | None |
| All unavailable | [] | None |
| None input | Exception | Raise error |

### Logging Examples

| Event | Level | Message |
|-------|-------|---------|
| Success | INFO | "Cheapest rate: {courier} at ₨{price}" |
| No Rates | INFO | "No available rates to compare" |
| Method Call | DEBUG | "Finding cheapest rate from {count} options" |

### Error Handling

| Error | Handling | Response |
|-------|----------|----------|
| Empty input | Return None | Log info message |
| None input | Raise ValueError | Clear error message |
| All unavailable | Return None | Log info message |

### Integration with UI

| UI Element | Usage |
|------------|-------|
| "Best Price" Badge | Display when this rate selected |
| Auto-Select | Default selection in rate list |
| Recommendation | Highlight as recommended option |

### Expected Outcome
- Functional get_cheapest_rate method
- Returns single cheapest option
- Returns None when no rates available
- Proper logging and error handling

### Verification Checklist
- [ ] get_cheapest_rate method implemented
- [ ] Accepts List[CourierRate] parameter
- [ ] Calls sort_by_price internally
- [ ] Returns first sorted result
- [ ] Returns None for empty results
- [ ] Optional[CourierRate] return type
- [ ] Logging added
- [ ] Docstring with example

---

## Task 69: Create Fastest Option

### Overview
Implement the get_fastest_rate method in RateComparisonService that returns the single fastest shipping option from a list of rates. This convenience method simplifies finding the quickest delivery option, wrapping the sort_by_speed functionality and returning only the first result.

### Dependencies
- Task 67: Create sort_by_speed Method

### Instructions

1. **Define get_fastest_rate method signature**
   - Accept rates parameter (List[CourierRate])
   - Return type hint: Optional[CourierRate]
   - No additional parameters needed

2. **Call sort_by_speed method**
   - Pass rates to sort_by_speed()
   - Use default ascending order
   - Handle empty result from sorting

3. **Extract first result**
   - Get first element from sorted list
   - Return None if list is empty
   - Return CourierRate object if available

4. **Add null safety**
   - Check if sorted list is empty
   - Return None for no available rates
   - Log when no fastest option found

5. **Implement logging**
   - Log method invocation
   - Log fastest rate found
   - Log when no rates available

6. **Add docstring**
   - Document method purpose
   - Explain return value
   - Provide usage example

### Method Signature

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| rates | List[CourierRate] | Yes | - | Rates to analyze |
| **Return** | Optional[CourierRate] | - | - | Fastest rate or None |

### Method Flow

```
get_fastest_rate(rates)
    ↓
1. Call sort_by_speed(rates)
    ↓
2. Check if result is empty
    ↓
3. Return first item if available
    ↓
4. Return None if empty
```

### Return Value Logic

| Scenario | Sorted List | Return Value |
|----------|-------------|--------------|
| Multiple rates | [Rate1, Rate2, Rate3] | Rate1 (fastest) |
| Single rate | [Rate1] | Rate1 |
| No available | [] | None |
| All unavailable | [] | None |

### Example Usage

**Input:**
```
rates = [
  CourierRate(courier="Koombiyo", price=350, delivery_days=2),
  CourierRate(courier="Domex", price=420, delivery_days=1),
  CourierRate(courier="Royal", price=380, delivery_days=2)
]

fastest = service.get_fastest_rate(rates)
```

**Output:**
```
CourierRate(
  courier="Domex",
  price=420,
  delivery_days=1
)
```

### Logging Examples

| Event | Level | Message |
|-------|-------|---------|
| Success | INFO | "Fastest rate: {courier} in {days} days" |
| No Rates | INFO | "No available rates to compare" |
| Method Call | DEBUG | "Finding fastest rate from {count} options" |

### Integration with UI

| UI Element | Usage |
|------------|-------|
| "Fastest Delivery" Badge | Display when this rate selected |
| Express Option | Highlight for urgent shipments |
| Time-Sensitive | Recommend for time-critical orders |

### Expected Outcome
- Functional get_fastest_rate method
- Returns single fastest option
- Returns None when no rates available
- Proper logging and error handling

### Verification Checklist
- [ ] get_fastest_rate method implemented
- [ ] Accepts List[CourierRate] parameter
- [ ] Calls sort_by_speed internally
- [ ] Returns first sorted result
- [ ] Returns None for empty results
- [ ] Optional[CourierRate] return type
- [ ] Logging added
- [ ] Docstring with example

---

## Task 70: Create Rate Comparison API

### Overview
Create the rate comparison API endpoint that exposes the rate comparison functionality to frontend applications and external integrations. This endpoint accepts shipping parameters, fetches rates from all active couriers, sorts them by price and speed, identifies cheapest and fastest options, and returns a comprehensive comparison response.

### Dependencies
- Task 69: Create Fastest Option Method
- RateComparisonService complete

### Instructions

1. **Create comparison views file**
   - Navigate to `backend/apps/shipping/api/` directory
   - Create new file named `comparison_views.py`
   - This will house rate comparison endpoints

2. **Import necessary dependencies**
   - Import DRF viewsets and decorators
   - Import RateComparisonService
   - Import serializers for request/response
   - Import authentication and permission classes

3. **Define request serializer**
   - Create RateComparisonRequestSerializer
   - Fields: destination, weight, dimensions (optional)
   - Add validation for required fields
   - Validate weight is positive number

4. **Define response serializer**
   - Create CourierRateSerializer for individual rates
   - Create RateComparisonResponseSerializer
   - Include fields: rates, cheapest, fastest, success_count

5. **Create comparison view**
   - Define RateComparisonView or viewset
   - Use APIView or GenericAPIView
   - Add authentication (tenant-aware)
   - Add permission classes

6. **Implement compare endpoint**
   - Endpoint: GET /api/shipping/compare/
   - Accept query parameters or POST body
   - Create RateComparisonService instance
   - Call get_all_rates with parameters

7. **Process and sort results**
   - Get rates from service
   - Sort by price using sort_by_price
   - Sort by speed using sort_by_speed
   - Get cheapest using get_cheapest_rate
   - Get fastest using get_fastest_rate

8. **Build response object**
   - Include all rates list
   - Include sorted_by_price list
   - Include sorted_by_speed list
   - Include cheapest single object
   - Include fastest single object
   - Add metadata (success_count, total_count)

9. **Add error handling**
   - Validate request parameters
   - Handle service exceptions
   - Return appropriate HTTP status codes
   - Provide error messages

10. **Register URL route**
    - Add route to shipping URLs
    - Pattern: `compare/`
    - Name: `rate-comparison`

11. **Add API documentation**
    - Add docstring with OpenAPI specs
    - Document query parameters
    - Document response structure
    - Provide usage examples

### Endpoint Specification

| Property | Value |
|----------|-------|
| Method | GET |
| Path | `/api/shipping/compare/` |
| Authentication | Required (Tenant-aware) |
| Permissions | IsAuthenticated |

### Request Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| destination | string | Yes | Delivery destination |
| weight | decimal | Yes | Package weight in kg |
| dimensions | object | No | Package dimensions (L×W×H) |
| sender | string | No | Pickup location |

### Response Structure

```
{
  "rates": [
    {
      "courier": "Koombiyo",
      "courier_type": "koombiyo",
      "price": "350.00",
      "delivery_days": 2,
      "delivery_estimate": "2-3 days",
      "available": true
    },
    ...
  ],
  "sorted_by_price": [...],
  "sorted_by_speed": [...],
  "cheapest": {
    "courier": "Koombiyo",
    "price": "350.00",
    "delivery_days": 2
  },
  "fastest": {
    "courier": "Domex",
    "price": "420.00",
    "delivery_days": 1
  },
  "metadata": {
    "success_count": 3,
    "total_count": 4,
    "response_time": 2.5
  }
}
```

### Request Serializer Fields

| Field | Type | Required | Validators |
|-------|------|----------|------------|
| destination | CharField | Yes | max_length=255 |
| weight | DecimalField | Yes | min_value=0.1, max_decimal_places=2 |
| dimensions | JSONField | No | Valid JSON object |
| sender | CharField | No | max_length=255 |

### Response Serializer Structure

```
CourierRateSerializer
├── courier (CharField)
├── courier_type (CharField)
├── price (DecimalField)
├── delivery_days (IntegerField)
├── delivery_estimate (CharField)
└── available (BooleanField)

RateComparisonResponseSerializer
├── rates (List[CourierRateSerializer])
├── sorted_by_price (List[CourierRateSerializer])
├── sorted_by_speed (List[CourierRateSerializer])
├── cheapest (CourierRateSerializer)
├── fastest (CourierRateSerializer)
└── metadata (Dict)
```

### API View Structure

```
RateComparisonView (APIView)
├── authentication_classes
├── permission_classes
├── get() method
│   ├── Validate request
│   ├── Get tenant from request
│   ├── Create RateComparisonService
│   ├── Call get_all_rates()
│   ├── Sort and process results
│   └── Return Response
└── Error handling
```

### HTTP Status Codes

| Status | Scenario |
|--------|----------|
| 200 | Success with rates |
| 400 | Invalid request parameters |
| 401 | Unauthenticated |
| 403 | Permission denied |
| 500 | Server error |

### Error Response Format

```
{
  "error": "Invalid request parameters",
  "detail": "Weight must be a positive number",
  "code": "invalid_weight"
}
```

### URL Configuration

```
router or urlpatterns
└── path('compare/', RateComparisonView.as_view(), name='rate-comparison')
```

### Authentication & Permissions

| Layer | Implementation |
|-------|----------------|
| Authentication | TenantAuthentication |
| Permission | IsAuthenticated |
| Tenant Resolution | From request user |

### Logging Strategy

| Event | Level | Message |
|-------|-------|---------|
| Request | INFO | "Rate comparison request: {destination}, {weight}kg" |
| Success | INFO | "Returned {count} rates in {time}s" |
| No Rates | WARNING | "No rates available for destination {dest}" |
| Error | ERROR | "Rate comparison failed: {error}" |

### API Documentation Example

```
GET /api/shipping/compare/?destination=Colombo&weight=2.5

Returns shipping rates from all active couriers for the specified
destination and weight. Includes sorted results and recommendations.

Query Parameters:
  - destination (required): Delivery destination city
  - weight (required): Package weight in kilograms
  - dimensions (optional): Package dimensions in cm (LxWxH)

Response includes:
  - All available rates
  - Rates sorted by price (cheapest first)
  - Rates sorted by speed (fastest first)
  - Single cheapest option
  - Single fastest option
  - Metadata about the comparison
```

### Performance Considerations

| Aspect | Strategy | Benefit |
|--------|----------|---------|
| Caching | Cache rates for 5 min | Reduce API calls |
| Timeout | 30s total timeout | Prevent hanging |
| Async | Concurrent provider calls | Faster response |
| Pagination | Not needed | Full results always |

### Expected Outcome
- Functional rate comparison API endpoint
- Accepts shipping parameters via query or body
- Returns comprehensive comparison response
- Includes sorted results and recommendations
- Proper error handling and logging

### Verification Checklist
- [ ] `backend/apps/shipping/api/comparison_views.py` file created
- [ ] RateComparisonRequestSerializer defined
- [ ] CourierRateSerializer defined
- [ ] RateComparisonResponseSerializer defined
- [ ] RateComparisonView or viewset created
- [ ] GET endpoint implemented
- [ ] Request validation added
- [ ] RateComparisonService integrated
- [ ] Response includes all rates, sorted lists, cheapest, fastest
- [ ] Error handling implemented
- [ ] URL route registered
- [ ] Authentication and permissions configured
- [ ] API documentation added
- [ ] Logging implemented

---

## Task 71: Create Preferred Courier

### Overview
Implement tenant-level preferred courier setting that allows each tenant to designate a default courier provider. This setting is used when auto-selecting a shipping option or when the user doesn't explicitly choose a courier. The preferred courier is prioritized in rate comparisons and recommendations.

### Dependencies
- Task 61: Create CourierFactory
- Tenant model

### Instructions

1. **Add preferred_courier field to tenant settings**
   - Navigate to tenant-related models
   - Locate CourierConfiguration model or create it
   - Add preferred_courier field (CharField)
   - Set choices from available courier types

2. **Define courier choices**
   - Create COURIER_CHOICES constant
   - Include: koombiyo, domex, royal_express, trance_express
   - Allow null/blank for no preference
   - Set default to None (no preference)

3. **Create migration**
   - Generate migration for new field
   - Apply migration to database
   - Handle existing tenants (default to None)

4. **Add preferred courier to admin**
   - Update CourierConfiguration admin
   - Make preferred_courier editable
   - Add to list_display for visibility
   - Add filtering by preferred_courier

5. **Create getter method**
   - Add get_preferred_courier() method
   - Return preferred_courier from tenant config
   - Return None if not set
   - Handle missing configuration

6. **Implement fallback logic**
   - If preferred courier unavailable, fall back to cheapest
   - Log when preferred courier not available
   - Use RateComparisonService for fallback

7. **Add to API response**
   - Include preferred_courier in rate comparison response
   - Mark preferred courier in rates list
   - Add is_preferred flag to CourierRate

8. **Update serializers**
   - Add preferred_courier field to response
   - Add is_preferred boolean to CourierRateSerializer
   - Document preferred courier usage

### Field Specification

| Property | Value |
|----------|-------|
| Field Name | preferred_courier |
| Type | CharField |
| Max Length | 50 |
| Choices | COURIER_CHOICES |
| Null | True |
| Blank | True |
| Default | None |

### Courier Choices Definition

| Value | Display Name | Description |
|-------|--------------|-------------|
| koombiyo | Koombiyo | Local delivery specialist |
| domex | Domex | Express delivery service |
| royal_express | Royal Express | Premium courier |
| trance_express | Trance Express | Economy option |
| None | No Preference | Let system choose |

### Database Schema

```
CourierConfiguration
├── tenant (ForeignKey)
├── koombiyo_enabled (Boolean)
├── domex_enabled (Boolean)
├── royal_express_enabled (Boolean)
├── trance_express_enabled (Boolean)
├── preferred_courier (CharField) [NEW]
├── created_at (DateTime)
└── updated_at (DateTime)
```

### Getter Method Signature

| Method | Return Type | Description |
|--------|-------------|-------------|
| get_preferred_courier | Optional[str] | Returns courier type or None |

### Fallback Logic Flow

```
Get Preferred Courier
    ↓
1. Check tenant config
    ↓
2. Get preferred_courier value
    ↓
3. If set and available → Use it
    ↓
4. If not available → Fall back to cheapest
    ↓
5. Log fallback reason
```

### API Response Enhancement

```
{
  "rates": [
    {
      "courier": "Koombiyo",
      "price": "350.00",
      "is_preferred": true  <--- NEW
    },
    {
      "courier": "Domex",
      "price": "420.00",
      "is_preferred": false
    }
  ],
  "preferred_courier": "koombiyo",  <--- NEW
  "cheapest": {...},
  "fastest": {...}
}
```

### Admin Interface Updates

| Section | Changes |
|---------|---------|
| List Display | Add preferred_courier column |
| List Filter | Add filter by preferred_courier |
| Fieldsets | Add "Preferences" section |
| Inline Help | Add explanation text |

### Usage Scenarios

| Scenario | Behavior |
|----------|----------|
| Preferred set and available | Auto-select preferred |
| Preferred set but unavailable | Fall back to cheapest, log warning |
| Preferred not set | Use cheapest option |
| All couriers unavailable | Return error |

### Logging Examples

| Event | Level | Message |
|-------|-------|---------|
| Preferred Used | INFO | "Using preferred courier: {courier}" |
| Preferred Unavailable | WARNING | "Preferred courier {courier} unavailable, using {fallback}" |
| No Preference | DEBUG | "No preferred courier set, using cheapest" |

### Validation Rules

| Rule | Validation |
|------|------------|
| Valid Choice | Must be in COURIER_CHOICES |
| Enabled Check | Should be enabled for tenant |
| Configuration | Must have valid configuration |

### Migration Considerations

| Aspect | Handling |
|--------|----------|
| Existing Tenants | Set to None (no preference) |
| Backwards Compatibility | Nullable field |
| Data Migration | No data migration needed |

### Expected Outcome
- Preferred courier field added to tenant configuration
- Getter method for retrieving preferred courier
- Fallback logic when preferred unavailable
- API response includes preference information
- Admin interface updated

### Verification Checklist
- [ ] preferred_courier field added to model
- [ ] COURIER_CHOICES constant defined
- [ ] Migration created and applied
- [ ] get_preferred_courier() method implemented
- [ ] Fallback logic implemented
- [ ] is_preferred flag added to CourierRate
- [ ] API response includes preferred_courier
- [ ] Admin interface updated
- [ ] Validation for valid choices
- [ ] Logging for preference usage
- [ ] Documentation updated

---

## Task 72: Verify Comparison

### Overview
Perform comprehensive verification of the courier comparison functionality to ensure all components work correctly together. This includes testing the factory pattern, rate fetching, sorting algorithms, convenience methods, API endpoint, and preferred courier settings. Verification covers happy paths, edge cases, error scenarios, and integration between components.

### Dependencies
- Task 71: Create Preferred Courier Setting
- All previous tasks in this group complete

### Instructions

1. **Test CourierFactory**
   - Test get_provider with valid courier types
   - Test get_provider with invalid courier type
   - Test get_all_providers with active tenant
   - Test get_all_providers with disabled couriers
   - Verify provider instances configured correctly

2. **Test RateComparisonService initialization**
   - Initialize service with valid tenant
   - Verify tenant context stored
   - Verify provider list retrieved
   - Test with tenant having no providers

3. **Test get_all_rates method**
   - Test with valid destination and weight
   - Test with all providers responding
   - Test with some providers failing
   - Test with all providers failing
   - Verify timeout handling
   - Verify result normalization

4. **Test sorting methods**
   - Test sort_by_price with multiple rates
   - Test sort_by_price with equal prices
   - Test sort_by_price with unavailable rates
   - Test sort_by_speed with multiple rates
   - Test sort_by_speed with equal times
   - Test sort_by_speed with missing delivery data

5. **Test convenience methods**
   - Test get_cheapest_rate with valid rates
   - Test get_cheapest_rate with empty list
   - Test get_fastest_rate with valid rates
   - Test get_fastest_rate with empty list

6. **Test API endpoint**
   - Test GET request with valid parameters
   - Test with missing required parameters
   - Test with invalid weight value
   - Test authentication requirement
   - Verify response structure
   - Verify sorted results included
   - Verify cheapest and fastest included

7. **Test preferred courier**
   - Set preferred courier for tenant
   - Verify preferred courier in response
   - Test with preferred courier unavailable
   - Verify fallback to cheapest
   - Test with no preferred courier set

8. **Test error scenarios**
   - All couriers timeout
   - Invalid destination
   - Network errors
   - Missing configuration
   - Database connection issues

9. **Test performance**
   - Measure response time with 4 providers
   - Verify concurrent execution
   - Check for N+1 query issues
   - Verify timeout limits respected

10. **Integration testing**
    - Test full flow: request → service → providers → response
    - Test with real API credentials (staging)
    - Verify rate calculations match provider APIs
    - Test cross-courier comparison accuracy

11. **Document test results**
    - Create test report
    - Document any issues found
    - Verify all acceptance criteria met
    - Sign off on completion

### Test Cases Summary

| Category | Test Count | Coverage |
|----------|------------|----------|
| CourierFactory | 4 | Provider creation |
| RateComparisonService | 6 | Core service |
| Sorting Methods | 6 | Price & speed sorting |
| Convenience Methods | 4 | Cheapest & fastest |
| API Endpoint | 7 | REST API |
| Preferred Courier | 4 | Tenant preferences |
| Error Scenarios | 5 | Error handling |
| Performance | 4 | Speed & efficiency |
| Integration | 4 | End-to-end |

### Factory Verification Tests

| Test | Expected Result |
|------|----------------|
| get_provider("koombiyo") | Returns KoombiyoProvider instance |
| get_provider("invalid") | Raises CourierProviderNotFound |
| get_all_providers(tenant) | Returns list of active providers |
| get_all_providers(no_providers) | Returns empty list |

### Service Verification Tests

| Test | Expected Result |
|------|----------------|
| get_all_rates valid | Returns 3-4 CourierRate objects |
| get_all_rates timeout | Returns partial results |
| get_all_rates all fail | Returns empty list |
| sort_by_price | Cheapest first |
| sort_by_speed | Fastest first |
| get_cheapest_rate | Single cheapest option |

### API Verification Tests

| Test | Request | Expected Response |
|------|---------|-------------------|
| Valid Request | GET ?destination=Colombo&weight=2 | 200, full response |
| Missing Weight | GET ?destination=Colombo | 400, error message |
| Invalid Weight | GET ?weight=-1 | 400, validation error |
| Unauthenticated | GET (no auth) | 401, auth required |
| Valid with Preferred | GET (with preferred set) | 200, is_preferred=true |

### Preferred Courier Tests

| Test | Setup | Expected Behavior |
|------|-------|-------------------|
| Preferred Available | Set to "koombiyo" | Koombiyo marked preferred |
| Preferred Unavailable | Set to disabled courier | Falls back to cheapest |
| No Preference | None set | Cheapest used |
| Preferred in Response | API call | preferred_courier field present |

### Error Scenario Tests

| Scenario | Expected Handling |
|----------|-------------------|
| All Timeout | Empty list, log warning |
| Network Error | Retry once, then mark unavailable |
| Invalid Config | Raise ConfigurationError |
| DB Connection Lost | Raise database error |
| Malformed API Response | Log error, mark unavailable |

### Performance Benchmarks

| Metric | Target | Acceptable |
|--------|--------|------------|
| Total Response Time | < 5 seconds | < 10 seconds |
| Single Provider Time | < 3 seconds | < 5 seconds |
| Concurrent Execution | Yes | N/A |
| Memory Usage | < 50 MB | < 100 MB |

### Integration Test Scenarios

| Scenario | Steps | Validation |
|----------|-------|------------|
| Full Flow | Request → Service → Providers → Response | Complete data |
| Real APIs | Use staging credentials | Matches provider sites |
| Cross-Comparison | Compare Koombiyo vs Domex | Accurate difference |
| Tenant Isolation | Two tenants same request | Different configs respected |

### Acceptance Criteria

| Criterion | Status |
|-----------|--------|
| Factory creates providers correctly | ✓ |
| Service fetches rates concurrently | ✓ |
| Sorting algorithms work correctly | ✓ |
| Convenience methods return correct results | ✓ |
| API endpoint responds correctly | ✓ |
| Preferred courier implemented | ✓ |
| Error handling graceful | ✓ |
| Performance within targets | ✓ |
| Integration tests pass | ✓ |

### Test Execution Checklist

- [ ] Set up test environment
- [ ] Configure test tenant with all couriers enabled
- [ ] Run CourierFactory tests
- [ ] Run RateComparisonService tests
- [ ] Run sorting method tests
- [ ] Run convenience method tests
- [ ] Run API endpoint tests
- [ ] Run preferred courier tests
- [ ] Run error scenario tests
- [ ] Run performance tests
- [ ] Run integration tests
- [ ] Document test results
- [ ] Fix any issues found
- [ ] Re-run failed tests
- [ ] Sign off on verification

### Test Environment Setup

| Component | Configuration |
|-----------|---------------|
| Database | Test database with sample tenants |
| Couriers | All 4 providers with test credentials |
| Tenant | 2 test tenants (one with preferences) |
| Network | Mock or staging environment |

### Expected Outcome
- All courier comparison functionality verified
- Factory pattern working correctly
- Rate fetching concurrent and reliable
- Sorting algorithms accurate
- API endpoint functional
- Preferred courier feature working
- Error handling comprehensive
- Performance within acceptable limits

### Verification Checklist
- [ ] CourierFactory tests passed
- [ ] RateComparisonService tests passed
- [ ] Sorting method tests passed
- [ ] Convenience method tests passed
- [ ] API endpoint tests passed
- [ ] Preferred courier tests passed
- [ ] Error scenario tests passed
- [ ] Performance benchmarks met
- [ ] Integration tests passed
- [ ] Test report documented
- [ ] All issues resolved
- [ ] Sign-off obtained

---

## Summary

This document completed the courier comparison functionality with speed-based sorting, convenience methods for finding optimal options, a comprehensive API endpoint for rate comparison, tenant-level preferred courier settings, and thorough verification of all components working together.

### Completed Tasks
1. ✓ Implemented sort_by_speed for fastest option identification
2. ✓ Created get_cheapest_rate convenience method
3. ✓ Created get_fastest_rate convenience method
4. ✓ Implemented rate comparison API endpoint
5. ✓ Added preferred courier setting per tenant
6. ✓ Verified all comparison functionality

### Group D Complete
All courier comparison functionality is now implemented and verified. The system can fetch rates from multiple couriers concurrently, sort by price or speed, identify optimal options, respect tenant preferences, and expose comparison functionality through a REST API.

### Next Steps
Proceed to **Group E: Fallback & Reliability** to implement fallback mechanisms, retry logic, circuit breakers, and monitoring for the courier integration system.
