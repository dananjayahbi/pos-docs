# Tasks 61-66: Factory and Rate Methods

> **Phase:** 09 - Integrations & Sri Lanka Localizations  
> **SubPhase:** 09 - Domex & Other Couriers  
> **Group:** D - Courier Comparison  
> **Document:** 01 of 02  
> **Tasks Covered:** 61, 62, 63, 64, 65, 66

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-67-72_Options-API-Verify.md](02_Tasks-67-72_Options-API-Verify.md)

---

## Document Overview

This document covers the creation of the courier factory pattern and rate comparison service infrastructure. It establishes the foundational components for selecting courier providers, fetching rates from all active couriers concurrently, and comparing rates across multiple shipping providers.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 61 | Create CourierFactory | Medium | 45 min |
| 62 | Create get_provider Method | Low | 20 min |
| 63 | Create get_all_providers | Low | 25 min |
| 64 | Create RateComparisonService | High | 60 min |
| 65 | Create get_all_rates | Medium | 40 min |
| 66 | Create sort_by_price | Low | 20 min |

---

## Task 61: Create CourierFactory

### Overview
Create the CourierFactory class that implements the Factory design pattern for courier provider instantiation. This factory centralizes provider creation logic, making it easy to add new courier integrations and manage provider instances across the application. The factory ensures proper dependency injection and configuration management.

### Dependencies
- Task 60: Verify TranceExpress Integration (from Group C)
- All courier provider classes (Koombiyo, Domex, RoyalExpress, TranceExpress)

### Instructions

1. **Create factory module file**
   - Navigate to `backend/apps/shipping/providers/` directory
   - Create new file named `factory.py`
   - This will house the courier provider factory logic

2. **Import courier provider classes**
   - Import all available courier provider classes
   - Import KoombiyoProvider from Koombiyo integration
   - Import DomexProvider from Domex integration
   - Import RoyalExpressProvider from RoyalExpress integration
   - Import TranceExpressProvider from TranceExpress integration

3. **Import necessary dependencies**
   - Import Django settings
   - Import tenant model for multi-tenancy context
   - Import logging utilities
   - Import exceptions for error handling

4. **Define CourierFactory class**
   - Create CourierFactory as a singleton or static class
   - Add class-level registry dictionary for providers
   - Include initialization method if needed

5. **Create provider registry**
   - Define COURIER_PROVIDERS dictionary
   - Map courier type strings to provider classes
   - Include keys: "koombiyo", "domex", "royal_express", "trance_express"
   - Store provider class references (not instances)

6. **Add logging configuration**
   - Set up logger for factory operations
   - Log provider creation and selection
   - Log errors and warnings for debugging

7. **Implement error handling**
   - Define custom exceptions for provider not found
   - Handle invalid courier types gracefully
   - Provide meaningful error messages

### Factory Pattern Benefits

| Benefit | Description |
|---------|-------------|
| Encapsulation | Hides provider instantiation complexity |
| Flexibility | Easy to add new courier providers |
| Consistency | Single point for provider creation |
| Testability | Simplified mocking and testing |

### Provider Registry Structure

| Courier Type | Provider Class | Key |
|--------------|----------------|-----|
| Koombiyo | KoombiyoProvider | "koombiyo" |
| Domex | DomexProvider | "domex" |
| Royal Express | RoyalExpressProvider | "royal_express" |
| Trance Express | TranceExpressProvider | "trance_express" |

### Factory Class Design

```
CourierFactory
├── Class Attributes
│   ├── COURIER_PROVIDERS (dict)
│   └── logger
├── Methods
│   ├── get_provider() (Task 62)
│   └── get_all_providers() (Task 63)
└── Exception Handling
    └── CourierProviderNotFound
```

### Provider Registry Example

| Key | Provider | Purpose |
|-----|----------|---------|
| koombiyo | KoombiyoProvider | Local delivery specialist |
| domex | DomexProvider | Express delivery service |
| royal_express | RoyalExpressProvider | Premium courier service |
| trance_express | TranceExpressProvider | Economy shipping option |

### Singleton Pattern Consideration

| Approach | Pros | Cons | Recommendation |
|----------|------|------|----------------|
| Singleton | One instance only | Less flexible | Not needed |
| Static Methods | No instantiation | Cannot mock easily | Recommended |
| Instance Methods | Full OOP | Requires initialization | Alternative option |

### Error Handling Strategy

| Error Type | Exception | Message |
|------------|-----------|---------|
| Unknown Courier | CourierProviderNotFound | "Courier provider '{courier_type}' not found" |
| Missing Config | ConfigurationError | "Provider configuration missing" |
| Import Error | ImportError | "Failed to import provider class" |

### Logging Strategy

| Event | Log Level | Message |
|-------|-----------|---------|
| Provider Created | INFO | "Created provider instance: {courier_type}" |
| Provider Not Found | WARNING | "Requested provider not found: {courier_type}" |
| Registry Loaded | DEBUG | "Courier factory initialized with {count} providers" |

### Expected Outcome
- CourierFactory class with provider registry
- Centralized provider management system
- Foundation for provider instantiation
- Error handling for missing providers

### Verification Checklist
- [ ] `backend/apps/shipping/providers/factory.py` file created
- [ ] CourierFactory class defined
- [ ] COURIER_PROVIDERS registry dictionary created
- [ ] All four courier providers imported
- [ ] Logging configuration added
- [ ] Error handling prepared
- [ ] Class structure follows Factory pattern

---

## Task 62: Create get_provider Method

### Overview
Implement the get_provider method in CourierFactory that returns an instantiated provider instance based on the courier type string. This method handles provider lookup, instantiation, configuration, and returns a ready-to-use shipping provider object. It serves as the primary interface for obtaining courier provider instances throughout the application.

### Dependencies
- Task 61: Create CourierFactory

### Instructions

1. **Define get_provider method signature**
   - Add static method or class method decorator
   - Accept `courier_type` parameter (string)
   - Accept optional `tenant` parameter for multi-tenancy
   - Return type hint: ShippingProvider base class

2. **Implement provider lookup**
   - Access COURIER_PROVIDERS registry dictionary
   - Search for provider class by courier_type key
   - Handle case-insensitive lookup (convert to lowercase)

3. **Add validation logic**
   - Check if courier_type exists in registry
   - Raise CourierProviderNotFound if not found
   - Log warning for invalid courier types

4. **Instantiate provider**
   - Retrieve provider class from registry
   - Instantiate with tenant context if provided
   - Pass necessary configuration parameters
   - Return fully configured provider instance

5. **Add configuration management**
   - Retrieve provider-specific settings
   - Pass API credentials from settings
   - Configure timeout and retry settings
   - Handle missing configuration gracefully

6. **Implement logging**
   - Log provider creation at INFO level
   - Log parameters used for instantiation
   - Log errors during provider creation

7. **Add error handling**
   - Catch exceptions during instantiation
   - Re-raise with meaningful error messages
   - Ensure proper cleanup on failure

### Method Signature

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| courier_type | str | Yes | - | Provider identifier |
| tenant | Tenant | No | None | Tenant context |
| **kwargs | dict | No | {} | Additional config |

### Provider Instantiation Flow

```
get_provider("koombiyo")
    ↓
1. Normalize courier_type
    ↓
2. Lookup in registry
    ↓
3. Validate existence
    ↓
4. Get configuration
    ↓
5. Instantiate provider
    ↓
6. Return instance
```

### Lookup Logic

| Input | Normalized | Registry Key | Provider |
|-------|------------|--------------|----------|
| "Koombiyo" | "koombiyo" | "koombiyo" | KoombiyoProvider |
| "DOMEX" | "domex" | "domex" | DomexProvider |
| "royal_express" | "royal_express" | "royal_express" | RoyalExpressProvider |
| "unknown" | "unknown" | - | Exception raised |

### Configuration Parameters

| Provider | Required Config | Source |
|----------|-----------------|--------|
| Koombiyo | API key, base URL | settings.KOOMBIYO_CONFIG |
| Domex | Username, password | settings.DOMEX_CONFIG |
| RoyalExpress | API token | settings.ROYAL_EXPRESS_CONFIG |
| TranceExpress | API key | settings.TRANCE_EXPRESS_CONFIG |

### Error Scenarios

| Scenario | Exception | Handling |
|----------|-----------|----------|
| Unknown courier | CourierProviderNotFound | Raise with courier type |
| Missing config | ConfigurationError | Log and raise |
| Instantiation failure | ProviderError | Log and re-raise |
| Invalid parameters | ValueError | Validate and raise |

### Return Value Structure

| Property | Type | Description |
|----------|------|-------------|
| Instance | ShippingProvider | Configured provider |
| Ready | Boolean | Instance ready to use |
| Configured | Boolean | Configuration loaded |

### Usage Examples

| Call | Result |
|------|--------|
| `get_provider("koombiyo")` | KoombiyoProvider instance |
| `get_provider("domex", tenant=tenant)` | DomexProvider with tenant context |
| `get_provider("unknown")` | Raises CourierProviderNotFound |

### Expected Outcome
- Functional get_provider method
- Provider instance returned based on courier type
- Proper validation and error handling
- Logging for debugging and monitoring

### Verification Checklist
- [ ] get_provider method implemented
- [ ] Accepts courier_type and optional tenant
- [ ] Performs case-insensitive lookup
- [ ] Returns configured provider instance
- [ ] Raises CourierProviderNotFound for invalid types
- [ ] Logging added for provider creation
- [ ] Configuration loading implemented
- [ ] Error handling covers all scenarios

---

## Task 63: Create get_all_providers

### Overview
Implement the get_all_providers method in CourierFactory that returns a list of all active courier provider instances for a given tenant. This method is essential for rate comparison functionality, as it allows the system to query rates from all available couriers simultaneously. The method filters providers based on tenant configuration and returns only enabled providers.

### Dependencies
- Task 61: Create CourierFactory
- Task 62: Create get_provider Method

### Instructions

1. **Define get_all_providers method signature**
   - Add static method or class method decorator
   - Accept `tenant` parameter (Tenant model)
   - Return type hint: List[ShippingProvider]

2. **Query tenant courier settings**
   - Access tenant's CourierConfiguration model
   - Retrieve list of enabled courier providers
   - Filter by is_active flag
   - Handle tenants with no configuration

3. **Iterate through active couriers**
   - Loop through enabled courier types
   - Call get_provider for each courier type
   - Collect provider instances in list
   - Continue on individual failures

4. **Add error handling per provider**
   - Wrap each provider instantiation in try-except
   - Log errors for individual providers
   - Don't stop iteration on single failure
   - Return partial list if some providers fail

5. **Implement filtering logic**
   - Exclude disabled providers
   - Exclude providers with missing credentials
   - Exclude providers in maintenance mode
   - Respect tenant-level provider preferences

6. **Add caching consideration**
   - Consider caching active providers per tenant
   - Implement cache invalidation on configuration change
   - Balance performance with freshness
   - Document caching strategy

7. **Implement logging**
   - Log number of active providers found
   - Log tenant context
   - Log any providers that failed to initialize
   - Log empty results for tenants

### Method Signature

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| tenant | Tenant | Yes | - | Tenant context |
| include_disabled | bool | No | False | Include disabled providers |

### Provider Collection Flow

```
get_all_providers(tenant)
    ↓
1. Query tenant configuration
    ↓
2. Get enabled courier list
    ↓
3. For each courier type:
   ├─ Call get_provider()
   ├─ Add to results list
   └─ Handle errors
    ↓
4. Return provider list
```

### Tenant Configuration Structure

| Field | Type | Description |
|-------|------|-------------|
| tenant | ForeignKey | Tenant reference |
| koombiyo_enabled | Boolean | Koombiyo active |
| domex_enabled | Boolean | Domex active |
| royal_express_enabled | Boolean | Royal Express active |
| trance_express_enabled | Boolean | Trance Express active |

### Filtering Rules

| Condition | Action |
|-----------|--------|
| Provider enabled = True | Include in results |
| Provider enabled = False | Exclude from results |
| Missing API credentials | Exclude from results |
| Provider in maintenance | Exclude from results |
| Tenant has no config | Return empty list |

### Error Handling Strategy

| Error | Behavior | Result |
|-------|----------|--------|
| Single provider fails | Log error, continue | Partial list returned |
| All providers fail | Log warning | Empty list returned |
| No tenant config | Log info | Empty list returned |
| Database error | Raise exception | Error propagated |

### Return Value Examples

| Scenario | Result | Count |
|----------|--------|-------|
| All 4 enabled | [Koombiyo, Domex, Royal, Trance] | 4 |
| Only 2 enabled | [Koombiyo, Domex] | 2 |
| None enabled | [] | 0 |
| 1 fails, 3 succeed | [Domex, Royal, Trance] | 3 |

### Performance Considerations

| Aspect | Strategy | Benefit |
|--------|----------|---------|
| Database Query | Single query for config | Reduce DB calls |
| Instantiation | Lazy initialization | Faster response |
| Caching | Cache provider instances | Improved performance |
| Parallel | Sequential is fine here | Simplicity |

### Caching Strategy (Optional)

| Cache Key | TTL | Invalidation |
|-----------|-----|--------------|
| `tenant:{id}:active_providers` | 5 min | On config update |
| Format | JSON list of types | Manual clear option |

### Logging Examples

| Event | Level | Message |
|-------|-------|---------|
| Success | INFO | "Found 4 active providers for tenant {id}" |
| Partial Failure | WARNING | "Provider {name} failed to initialize" |
| No Providers | INFO | "No active providers for tenant {id}" |
| Error | ERROR | "Failed to query tenant configuration" |

### Expected Outcome
- Functional get_all_providers method
- Returns list of active provider instances
- Filters based on tenant configuration
- Handles individual provider failures gracefully

### Verification Checklist
- [ ] get_all_providers method implemented
- [ ] Accepts tenant parameter
- [ ] Queries tenant courier configuration
- [ ] Filters for active/enabled providers only
- [ ] Returns List[ShippingProvider]
- [ ] Error handling for individual providers
- [ ] Logging for provider collection
- [ ] Empty list returned when no providers active
- [ ] Continues on single provider failure

---

## Task 64: Create RateComparisonService

### Overview
Create the RateComparisonService class that orchestrates rate fetching and comparison across multiple courier providers. This service is the core of the rate comparison functionality, managing concurrent API calls to all active couriers, handling timeouts and errors, aggregating results, and providing comparison utilities. The service ensures efficient rate fetching with proper error handling and result normalization.

### Dependencies
- Task 63: Create get_all_providers Method
- All courier provider implementations

### Instructions

1. **Create rate comparison service file**
   - Navigate to `backend/apps/shipping/services/` directory
   - Create new file named `rate_comparison.py`
   - This will house rate comparison logic

2. **Import necessary dependencies**
   - Import CourierFactory from providers module
   - Import asyncio or concurrent.futures for parallelism
   - Import typing hints for proper types
   - Import logging utilities
   - Import tenant models

3. **Define RateComparisonService class**
   - Create main service class
   - Add initialization method accepting tenant
   - Store tenant context for provider filtering
   - Initialize logger for service operations

4. **Add service configuration**
   - Define timeout settings for rate requests
   - Set maximum concurrent requests limit
   - Configure retry logic for failed requests
   - Set error handling strategy

5. **Design result data structure**
   - Define CourierRate data class or model
   - Include fields: courier, price, delivery_days, delivery_estimate
   - Add available flag for failed requests
   - Include error message field

6. **Implement provider coordination**
   - Use CourierFactory.get_all_providers()
   - Store provider list in instance
   - Handle empty provider list
   - Log number of available providers

7. **Add error aggregation**
   - Track which providers succeeded
   - Track which providers failed
   - Store error messages per provider
   - Calculate success rate

8. **Implement logging strategy**
   - Log service initialization
   - Log rate comparison start
   - Log individual provider responses
   - Log completion with summary

### Service Architecture

```
RateComparisonService
├── Initialization
│   ├── Tenant context
│   └── Provider list
├── Configuration
│   ├── Timeout: 10s per provider
│   ├── Max concurrent: 5
│   └── Retry: 1 attempt
├── Methods
│   ├── get_all_rates() (Task 65)
│   ├── sort_by_price() (Task 66)
│   └── sort_by_speed() (Task 67)
└── Result Handling
    ├── Success aggregation
    └── Error tracking
```

### CourierRate Data Structure

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| courier | str | Yes | Courier name |
| courier_type | str | Yes | Courier identifier |
| price | Decimal | Yes | Rate in LKR |
| delivery_days | int | No | Estimated delivery days |
| delivery_estimate | str | No | Delivery time description |
| available | bool | Yes | Rate available flag |
| error | str | No | Error message if failed |
| response_time | float | No | API response time |

### Service Configuration Settings

| Setting | Value | Purpose |
|---------|-------|---------|
| RATE_REQUEST_TIMEOUT | 10 seconds | Per-provider timeout |
| MAX_CONCURRENT_REQUESTS | 5 | Parallel request limit |
| RETRY_ON_FAILURE | True | Retry failed requests |
| MAX_RETRIES | 1 | Maximum retry attempts |

### Concurrency Strategy

| Approach | Pros | Cons | Choice |
|----------|------|------|--------|
| Threading | Simple, built-in | GIL limitations | Recommended |
| Asyncio | Efficient, modern | Complex code | Advanced option |
| Sequential | Simple, reliable | Slow | Not suitable |
| Multiprocessing | True parallelism | High overhead | Overkill |

### Threading Implementation

```
For each provider:
1. Submit rate request to thread pool
2. Wait for all with timeout
3. Collect results as they complete
4. Handle timeouts gracefully
```

### Error Tracking Structure

| Field | Type | Description |
|-------|------|-------------|
| successful_providers | List[str] | Succeeded courier types |
| failed_providers | List[str] | Failed courier types |
| success_rate | float | Percentage successful |
| total_response_time | float | Total time taken |

### Service Initialization Flow

```
__init__(tenant)
    ↓
1. Store tenant reference
    ↓
2. Get all active providers
    ↓
3. Initialize result storage
    ↓
4. Configure timeouts
    ↓
5. Ready for rate requests
```

### Result Normalization

| Provider Format | Normalized Field | Mapping |
|-----------------|------------------|---------|
| Price | price | Convert to Decimal |
| Delivery time | delivery_days | Extract number |
| Status | available | Parse response |
| Error | error | Extract message |

### Logging Strategy

| Event | Level | Message |
|-------|-------|---------|
| Service Init | INFO | "RateComparisonService initialized for tenant {id}" |
| Providers Found | INFO | "Found {count} active providers" |
| Rate Request | DEBUG | "Requesting rates from {provider}" |
| Request Success | INFO | "Received rate from {provider}: ₨{price}" |
| Request Failure | WARNING | "Failed to get rate from {provider}: {error}" |
| Comparison Complete | INFO | "Rate comparison complete: {success}/{total} providers" |

### Error Handling Levels

| Error Type | Handling | Impact |
|------------|----------|--------|
| Single provider timeout | Log, continue | Partial results |
| Single provider error | Log, continue | Partial results |
| All providers fail | Log, return empty | No rates available |
| Network error | Retry once | May recover |
| Configuration error | Raise exception | Critical failure |

### Expected Outcome
- RateComparisonService class with configuration
- Service initialized with tenant context
- Provider coordination logic in place
- Result data structure defined
- Error tracking infrastructure ready

### Verification Checklist
- [ ] `backend/apps/shipping/services/rate_comparison.py` file created
- [ ] RateComparisonService class defined
- [ ] Service accepts tenant in initialization
- [ ] CourierRate data structure defined
- [ ] Timeout and concurrency configuration added
- [ ] Logger initialized for service
- [ ] Provider coordination via CourierFactory
- [ ] Error tracking infrastructure in place
- [ ] Result normalization strategy defined

---

## Task 65: Create get_all_rates

### Overview
Implement the get_all_rates method in RateComparisonService that fetches shipping rates from all active courier providers concurrently. This method is the heart of the rate comparison feature, coordinating parallel API calls to multiple couriers, handling timeouts and errors gracefully, normalizing responses into a consistent format, and returning a comprehensive list of available rates.

### Dependencies
- Task 64: Create RateComparisonService
- All courier provider rate calculation methods

### Instructions

1. **Define get_all_rates method signature**
   - Accept destination parameter (string or object)
   - Accept weight parameter (decimal or float)
   - Accept optional dimensions parameter
   - Return type hint: List[CourierRate]

2. **Validate input parameters**
   - Check destination is not empty
   - Validate weight is positive number
   - Validate dimensions if provided
   - Raise ValueError for invalid inputs

3. **Get list of active providers**
   - Call get_all_providers with tenant context
   - Handle empty provider list
   - Log number of providers to query
   - Return empty list if no providers

4. **Implement concurrent rate fetching**
   - Use ThreadPoolExecutor for parallel requests
   - Create thread for each provider rate request
   - Set timeout per request (10 seconds)
   - Collect results as they complete

5. **Create rate request wrapper**
   - Define internal function to call provider.calculate_rate()
   - Wrap each call in try-except
   - Handle provider-specific exceptions
   - Return CourierRate object with result or error

6. **Aggregate results**
   - Collect all CourierRate objects
   - Separate successful from failed rates
   - Include failed providers with error flag
   - Sort by courier name initially

7. **Implement timeout handling**
   - Set timeout for each individual request
   - Mark timed-out requests as unavailable
   - Log timeout events
   - Continue with other providers

8. **Add response normalization**
   - Convert all prices to Decimal type
   - Ensure consistent currency (LKR)
   - Standardize delivery time format
   - Add provider metadata

9. **Implement logging and monitoring**
   - Log start of rate comparison
   - Log each provider response
   - Log completion with success count
   - Log total time taken

### Method Signature

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| destination | str | Yes | - | Delivery destination |
| weight | Decimal | Yes | - | Package weight in kg |
| dimensions | dict | No | None | Package dimensions |
| sender | str | No | None | Pickup location |

### Rate Fetching Flow

```
get_all_rates(destination, weight)
    ↓
1. Validate parameters
    ↓
2. Get active providers
    ↓
3. Create thread pool
    ↓
4. For each provider (parallel):
   ├─ Call calculate_rate()
   ├─ Handle timeout
   ├─ Handle errors
   └─ Create CourierRate object
    ↓
5. Wait for all (with timeout)
    ↓
6. Aggregate results
    ↓
7. Return CourierRate list
```

### Concurrent Execution Strategy

```
Thread Pool (max 5 workers)
├── Thread 1: Koombiyo.calculate_rate()
├── Thread 2: Domex.calculate_rate()
├── Thread 3: RoyalExpress.calculate_rate()
├── Thread 4: TranceExpress.calculate_rate()
└── Main Thread: Wait for all (30s timeout)
```

### Rate Request Wrapper Structure

| Step | Action | Error Handling |
|------|--------|----------------|
| 1. Start | Log request start | - |
| 2. Call Provider | calculate_rate() | Try-except |
| 3. Parse Response | Normalize data | Handle malformed |
| 4. Create Result | CourierRate object | Include error flag |
| 5. Return | Return to main thread | Always return object |

### CourierRate Population

| Field | Source | Fallback |
|-------|--------|----------|
| courier | Provider name | Static name |
| courier_type | Provider type | Static type |
| price | API response | None |
| delivery_days | API response | None |
| delivery_estimate | API response | "Contact courier" |
| available | Success flag | False |
| error | Exception message | None |
| response_time | Timer | Measured |

### Error Scenarios

| Scenario | Handling | Result |
|----------|----------|--------|
| Provider timeout | Mark unavailable | CourierRate(available=False) |
| API error | Log error, mark unavailable | CourierRate(available=False, error=msg) |
| Invalid response | Log warning | CourierRate(available=False) |
| Network error | Retry once | May recover |
| All providers fail | Return empty list | Log warning |

### Timeout Configuration

| Timeout Type | Value | Purpose |
|--------------|-------|---------|
| Per Provider | 10 seconds | Individual request limit |
| Total Operation | 30 seconds | Overall comparison limit |
| Retry Delay | 1 second | Wait before retry |

### Result Aggregation

```
Results Collection
├── Successful Rates
│   ├── Koombiyo: ₨350, 2 days
│   ├── Domex: ₨420, 1 day
│   └── Royal: ₨380, 2 days
└── Failed Rates
    └── Trance: unavailable (timeout)

Return: All 4 CourierRate objects
```

### Response Normalization Examples

| Provider Response | Normalized |
|-------------------|------------|
| "350.00" | Decimal("350.00") |
| "2-3 days" | delivery_days=2, estimate="2-3 days" |
| "Next day" | delivery_days=1, estimate="Next day" |
| null | available=False |

### Logging Examples

| Event | Level | Message |
|-------|-------|---------|
| Start | INFO | "Fetching rates from 4 providers for destination {dest}" |
| Provider Start | DEBUG | "Requesting rate from {provider}" |
| Success | INFO | "{provider}: ₨{price}, {days} days" |
| Failure | WARNING | "{provider} failed: {error}" |
| Timeout | WARNING | "{provider} timed out after 10s" |
| Complete | INFO | "Rate comparison complete: {success}/{total} providers, {time}s" |

### Return Value Structure

```
List[CourierRate]
├── CourierRate (Koombiyo)
│   ├── available: True
│   ├── price: ₨350
│   └── delivery_days: 2
├── CourierRate (Domex)
│   ├── available: True
│   ├── price: ₨420
│   └── delivery_days: 1
├── CourierRate (Royal Express)
│   ├── available: True
│   ├── price: ₨380
│   └── delivery_days: 2
└── CourierRate (Trance Express)
    ├── available: False
    └── error: "Request timeout"
```

### Performance Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Total Time | < 12 seconds | 4 providers × 10s max + overhead |
| Success Rate | > 80% | Successful / Total |
| Timeout Rate | < 20% | Timeouts / Total |

### Expected Outcome
- Functional get_all_rates method
- Concurrent rate fetching from all providers
- Consistent CourierRate objects returned
- Proper error handling and timeout management
- Comprehensive logging for monitoring

### Verification Checklist
- [ ] get_all_rates method implemented
- [ ] Accepts destination and weight parameters
- [ ] Input validation added
- [ ] Concurrent execution with ThreadPoolExecutor
- [ ] Per-provider timeout handling
- [ ] Rate request wrapper created
- [ ] Results aggregated into List[CourierRate]
- [ ] Failed requests marked as unavailable
- [ ] Response normalization implemented
- [ ] Logging for all stages added
- [ ] Returns empty list when no providers active

---

## Task 66: Create sort_by_price

### Overview
Implement the sort_by_price method in RateComparisonService that sorts a list of CourierRate objects by price in ascending order. This method provides a convenient way to identify the cheapest shipping options, filtering out unavailable rates and handling edge cases like equal prices or missing price data.

### Dependencies
- Task 65: Create get_all_rates Method
- CourierRate data structure

### Instructions

1. **Define sort_by_price method signature**
   - Accept rates parameter (List[CourierRate])
   - Return type hint: List[CourierRate]
   - Optional parameter: ascending (bool, default=True)

2. **Filter unavailable rates**
   - Remove rates where available=False
   - Remove rates with null or missing prices
   - Log number of rates filtered out
   - Handle empty list after filtering

3. **Implement sorting logic**
   - Sort by price field in ascending order
   - Use Python's sorted() function
   - Provide key parameter for sorting
   - Maintain stable sort for equal prices

4. **Handle edge cases**
   - Empty input list
   - All rates unavailable
   - Single rate in list
   - Equal prices from multiple couriers

5. **Add secondary sorting**
   - When prices are equal, sort by delivery_days
   - Faster delivery wins at same price
   - Fallback to courier name if still equal

6. **Implement descending option**
   - Allow reverse=True parameter
   - Support both ascending and descending
   - Default to ascending (cheapest first)

7. **Add logging**
   - Log sorting operation
   - Log number of rates sorted
   - Log cheapest rate found

### Method Signature

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| rates | List[CourierRate] | Yes | - | Rates to sort |
| ascending | bool | No | True | Sort order |

### Sorting Flow

```
sort_by_price(rates)
    ↓
1. Filter unavailable rates
    ↓
2. Filter rates without prices
    ↓
3. Sort by price (ascending)
    ↓
4. Secondary sort by delivery_days
    ↓
5. Return sorted list
```

### Filtering Rules

| Condition | Action |
|-----------|--------|
| available = False | Exclude |
| price = None | Exclude |
| price = 0 | Exclude |
| price < 0 | Exclude |
| All valid | Include |

### Sorting Priority

| Priority | Field | Order |
|----------|-------|-------|
| 1 | price | Ascending |
| 2 | delivery_days | Ascending |
| 3 | courier | Alphabetical |

### Example Input/Output

**Input:**
```
[
  CourierRate(courier="Domex", price=420, delivery_days=1),
  CourierRate(courier="Koombiyo", price=350, delivery_days=2),
  CourierRate(courier="Royal", price=380, delivery_days=2),
  CourierRate(courier="Trance", available=False)
]
```

**Output:**
```
[
  CourierRate(courier="Koombiyo", price=350, delivery_days=2),
  CourierRate(courier="Royal", price=380, delivery_days=2),
  CourierRate(courier="Domex", price=420, delivery_days=1)
]
```

### Edge Cases Handling

| Scenario | Handling | Result |
|----------|----------|--------|
| Empty list | Return empty list | [] |
| All unavailable | Return empty list | [] |
| Single rate | Return as-is | [rate] |
| Equal prices | Sort by delivery_days | Fastest first |

### Sorting Implementation

| Approach | Code Pattern | Benefit |
|----------|-------------|---------|
| sorted() function | `sorted(rates, key=lambda r: r.price)` | Simple, readable |
| list.sort() | `rates.sort(key=lambda r: r.price)` | In-place, efficient |
| Multiple keys | `key=lambda r: (r.price, r.delivery_days)` | Compound sorting |

### Secondary Sort Example

**Scenario:** Two couriers with same price
```
Input:
  Royal Express: ₨350, 3 days
  Koombiyo: ₨350, 2 days

Output:
  Koombiyo: ₨350, 2 days (faster)
  Royal Express: ₨350, 3 days
```

### Logging Examples

| Event | Level | Message |
|-------|-------|---------|
| Sort Start | DEBUG | "Sorting {count} rates by price" |
| Filter | DEBUG | "Filtered out {count} unavailable rates" |
| Empty Result | INFO | "No available rates to sort" |
| Complete | DEBUG | "Sorted {count} rates, cheapest: ₨{price}" |

### Return Value Structure

```
List[CourierRate] (Sorted by Price)
├── [0] Cheapest
│   ├── price: ₨350
│   └── delivery_days: 2
├── [1] Second Cheapest
│   ├── price: ₨380
│   └── delivery_days: 2
└── [2] Most Expensive
    ├── price: ₨420
    └── delivery_days: 1
```

### Expected Outcome
- Functional sort_by_price method
- Rates sorted by price in ascending order
- Unavailable rates filtered out
- Secondary sorting by delivery time
- Proper handling of edge cases

### Verification Checklist
- [ ] sort_by_price method implemented
- [ ] Accepts List[CourierRate] parameter
- [ ] Filters unavailable rates
- [ ] Sorts by price in ascending order
- [ ] Secondary sort by delivery_days
- [ ] Handles empty list
- [ ] Handles all unavailable rates
- [ ] Handles equal prices correctly
- [ ] Logging added for sorting operation
- [ ] Returns sorted List[CourierRate]

---

## Summary

This document established the courier factory pattern and rate comparison service infrastructure, including provider selection, concurrent rate fetching from multiple couriers, and price-based sorting functionality. These components enable efficient rate comparison across all active shipping providers.

### Completed Tasks
1. ✓ Created CourierFactory with provider registry
2. ✓ Implemented get_provider method for provider instantiation
3. ✓ Implemented get_all_providers for tenant-filtered provider list
4. ✓ Created RateComparisonService with concurrent fetching
5. ✓ Implemented get_all_rates for parallel rate requests
6. ✓ Implemented sort_by_price for cheapest option identification

### Next Steps
Proceed to [02_Tasks-67-72_Options-API-Verify.md](02_Tasks-67-72_Options-API-Verify.md) to create sorting by speed, convenience methods for cheapest/fastest options, rate comparison API endpoint, preferred courier settings, and verification of the comparison functionality.
