# Tasks 43-51: Royal Express Integration

> **Phase:** 09 - Integrations & Sri Lanka Localizations  
> **SubPhase:** 09 - Domex & Other Couriers  
> **Group:** C - Royal Express & Trance Express  
> **Document:** 01 of 02  
> **Tasks Covered:** 43, 44, 45, 46, 47, 48, 49, 50, 51

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-52-60_TranceExpress.md](02_Tasks-52-60_TranceExpress.md)

---

## Document Overview

This document covers the complete integration of Royal Express courier service into the LCC shipping system. Royal Express is a budget-friendly, island-wide delivery service targeting cost-conscious customers with standard delivery times. The integration implements the ShippingProvider interface, providing create_shipment, track_shipment, and webhook functionality.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 43 | Create RoyalExpress Constants | Low | 15 min |
| 44 | Create RoyalExpress Settings | Low | 20 min |
| 45 | Create RoyalExpress Config | Medium | 30 min |
| 46 | Create RoyalExpressClient | Medium | 45 min |
| 47 | Create RoyalExpressProvider | High | 60 min |
| 48 | Create RoyalExpress Shipment | Medium | 40 min |
| 49 | Create RoyalExpress Tracking | Medium | 40 min |
| 50 | Create RoyalExpress Webhook | Medium | 35 min |
| 51 | Create RoyalExpress Registration | Low | 20 min |

---

## Royal Express Service Overview

Royal Express is positioned as an affordable, reliable courier service covering all areas of Sri Lanka. Understanding the service characteristics helps inform integration decisions.

### Service Features

| Feature | Details |
|---------|---------|
| Coverage | Island-wide (all districts) |
| Delivery Time | 2-4 business days |
| Pricing | Budget-friendly, competitive rates |
| COD Support | Yes, with automated remittance |
| Weight Limit | Up to 25 kg |
| Tracking | Real-time status updates |
| API Authentication | API Key based |

### Target Use Cases

| Use Case | Rationale |
|----------|-----------|
| Cost-Sensitive Orders | Lower shipping fees for budget customers |
| Non-Urgent Deliveries | Standard delivery timeframe acceptable |
| Rural Destinations | Comprehensive island-wide coverage |
| High-Volume Shippers | Competitive bulk rates |

### API Characteristics

| Aspect | Description |
|--------|-------------|
| Base URL | `https://api.royalexpress.lk/v1/` |
| Authentication | Header-based API Key |
| Format | JSON request/response |
| Rate Limit | 100 requests per minute |
| Timeout | 30 seconds recommended |
| Webhooks | Status change notifications |

### Integration Flow

```
Tenant Configuration
        │
        ▼
  RoyalExpress Constants
        │
        ▼
  RoyalExpress Settings
        │
        ▼
   Config Model (DB)
        │
        ▼
   RoyalExpressClient
        │
        ▼
 RoyalExpressProvider
        │
        ├─── Create Shipment
        ├─── Track Shipment
        └─── Process Webhooks
        │
        ▼
 Provider Registration
        │
        ▼
  Available to Tenants
```

---

## Task 43: Create RoyalExpress Constants

### Overview
Create the constants module for Royal Express integration, defining all API endpoints, status codes, service types, and configuration values. These constants ensure consistency across the integration and simplify maintenance.

### Dependencies
- Task 42 (from Group B): PromptX provider registration complete
- Shipping app structure established
- Base provider classes defined

### Instructions

1. **Create royal_express directory**
   - Navigate to `backend/apps/shipping/providers/`
   - Create new directory named `royal_express`
   - This houses all Royal Express integration files

2. **Create constants file**
   - Create `constants.py` in `providers/royal_express/` directory
   - Import necessary dependencies (enum, typing)
   - Organize constants into logical sections

3. **Define API configuration constants**
   - Create `API_BASE_URL` constant pointing to Royal Express API
   - Define `API_VERSION` constant (e.g., "v1")
   - Set `DEFAULT_TIMEOUT` for HTTP requests (30 seconds)
   - Define `MAX_RETRIES` for failed requests (3 retries)

4. **Define API endpoint constants**
   - Create `ENDPOINTS` dictionary or constants
   - Include shipment creation endpoint
   - Include tracking endpoint
   - Include webhook verification endpoint
   - Include authentication endpoint if separate

5. **Define status mapping constants**
   - Create enum or dictionary for Royal Express statuses
   - Map Royal Express statuses to LCC ShipmentStatus
   - Include: PENDING, PICKED_UP, IN_TRANSIT, OUT_FOR_DELIVERY, DELIVERED, FAILED, RETURNED

6. **Define service type constants**
   - Create enum for Royal Express service types
   - Include: STANDARD, EXPRESS (if available)
   - Map to pricing and delivery timeframes

7. **Define validation constants**
   - Maximum weight limit (25 kg)
   - Minimum weight (0.1 kg)
   - Maximum dimensions (length, width, height)
   - Maximum COD amount (if applicable)

8. **Define error code constants**
   - Map Royal Express error codes to messages
   - Include authentication errors
   - Include validation errors
   - Include service unavailable errors

9. **Define webhook event constants**
   - Create enum for webhook event types
   - Include: STATUS_CHANGED, DELIVERED, FAILED, RETURNED
   - Map to internal event handlers

10. **Add documentation**
    - Document each constant group's purpose
    - Include examples where helpful
    - Note any Royal Express-specific behaviors

### Constant Categories

| Category | Purpose | Examples |
|----------|---------|----------|
| API Configuration | Base URL, version, timeout | `API_BASE_URL`, `DEFAULT_TIMEOUT` |
| Endpoints | API endpoint paths | `CREATE_SHIPMENT_ENDPOINT` |
| Status Mapping | External to internal status | `STATUS_MAP` dictionary |
| Service Types | Available service options | `ServiceType` enum |
| Validation | Weight, dimension limits | `MAX_WEIGHT`, `MAX_COD_AMOUNT` |
| Error Codes | Error code to message mapping | `ERROR_MESSAGES` dictionary |
| Webhook Events | Event type definitions | `WebhookEvent` enum |

### API Endpoints Structure

| Endpoint Name | Path | Method | Purpose |
|---------------|------|--------|---------|
| Create Shipment | `/shipments` | POST | Create new shipment |
| Get Tracking | `/tracking/{waybill}` | GET | Get tracking details |
| Verify Webhook | `/webhooks/verify` | POST | Verify webhook signature |
| Get Rates | `/rates` | POST | Calculate shipping rates |

### Status Mapping Example

| Royal Express Status | LCC ShipmentStatus | Description |
|---------------------|-------------------|-------------|
| `ORDER_PLACED` | `PENDING` | Shipment created |
| `PICKED_UP` | `PICKED_UP` | Collected from sender |
| `IN_SORTING` | `IN_TRANSIT` | At sorting facility |
| `OUT_FOR_DELIVERY` | `OUT_FOR_DELIVERY` | On delivery route |
| `DELIVERED` | `DELIVERED` | Successfully delivered |
| `DELIVERY_FAILED` | `FAILED` | Delivery attempt failed |
| `RETURNED` | `RETURNED` | Returned to sender |

### Service Types

| Service Code | Name | Delivery Time | Cost Level |
|--------------|------|---------------|------------|
| `STANDARD` | Standard Delivery | 2-4 days | Budget |
| `EXPRESS` | Express Delivery | 1-2 days | Medium |

### Validation Limits

| Limit | Value | Enforcement |
|-------|-------|-------------|
| Max Weight | 25 kg | Reject shipment creation |
| Min Weight | 0.1 kg | Reject shipment creation |
| Max Length | 120 cm | Reject shipment creation |
| Max Width | 80 cm | Reject shipment creation |
| Max Height | 80 cm | Reject shipment creation |
| Max COD | ₨500,000 | Reject if exceeded |

### Expected Outcome
- Constants module with all Royal Express configuration
- Organized, well-documented constant definitions
- Status mappings for external to internal conversion
- Validation rules and limits defined
- Endpoint paths and API configuration centralized

### Verification Checklist
- [ ] `backend/apps/shipping/providers/royal_express/constants.py` created
- [ ] API base URL and configuration defined
- [ ] All endpoint paths defined
- [ ] Status mapping enum or dictionary created
- [ ] Service type constants defined
- [ ] Validation limits specified
- [ ] Error code mappings included
- [ ] Webhook event types defined
- [ ] Documentation added for each constant group

---

## Task 44: Create RoyalExpress Settings

### Overview
Create Django settings module for Royal Express integration, defining configuration variables that can be overridden in environment files. This separates environment-specific configuration from code.

### Dependencies
- Task 43: RoyalExpress Constants created

### Instructions

1. **Navigate to settings directory**
   - Go to `backend/config/settings/` directory
   - Identify where third-party integration settings are stored
   - May be in base settings or separate integrations file

2. **Create Royal Express settings section**
   - Add section header comment for Royal Express
   - Group all Royal Express settings together
   - Follow project's settings organization pattern

3. **Define API credentials settings**
   - Create `ROYAL_EXPRESS_API_KEY` setting
   - Load from environment variable with fallback
   - Mark as required for production
   - Use `env()` helper or similar for environment loading

4. **Define API configuration settings**
   - Create `ROYAL_EXPRESS_API_URL` setting
   - Load from environment or use default from constants
   - Create `ROYAL_EXPRESS_TIMEOUT` setting
   - Create `ROYAL_EXPRESS_MAX_RETRIES` setting

5. **Define webhook settings**
   - Create `ROYAL_EXPRESS_WEBHOOK_SECRET` setting
   - Load from environment variable
   - Used for webhook signature verification
   - Mark as required if webhooks enabled

6. **Define feature flags**
   - Create `ROYAL_EXPRESS_ENABLED` boolean setting
   - Create `ROYAL_EXPRESS_SANDBOX_MODE` boolean setting
   - Create `ROYAL_EXPRESS_DEBUG_LOGGING` boolean setting
   - Allow enabling/disabling without code changes

7. **Define business logic settings**
   - Create `ROYAL_EXPRESS_DEFAULT_SERVICE_TYPE` setting
   - Create `ROYAL_EXPRESS_AUTO_RETRY_FAILED` boolean
   - Create `ROYAL_EXPRESS_WEBHOOK_ENABLED` boolean

8. **Add validation settings**
   - Create `ROYAL_EXPRESS_MIN_WEIGHT` setting
   - Create `ROYAL_EXPRESS_MAX_WEIGHT` setting
   - Create `ROYAL_EXPRESS_MAX_COD_AMOUNT` setting

9. **Add environment variable documentation**
   - Document required environment variables
   - Document optional environment variables
   - Provide example values
   - Note security considerations

10. **Update .env.example file**
    - Add Royal Express environment variables
    - Include descriptions and example values
    - Mark required vs optional variables
    - Add security warnings for sensitive data

### Settings Structure

| Setting Name | Type | Source | Purpose |
|--------------|------|--------|---------|
| `ROYAL_EXPRESS_API_KEY` | string | ENV (required) | API authentication |
| `ROYAL_EXPRESS_API_URL` | string | ENV (optional) | Override default API URL |
| `ROYAL_EXPRESS_TIMEOUT` | int | ENV (optional) | HTTP request timeout |
| `ROYAL_EXPRESS_ENABLED` | bool | ENV (optional) | Enable/disable integration |
| `ROYAL_EXPRESS_SANDBOX_MODE` | bool | ENV (optional) | Use sandbox API |
| `ROYAL_EXPRESS_WEBHOOK_SECRET` | string | ENV (required) | Webhook verification |

### Environment Variables

| Variable | Example Value | Description |
|----------|---------------|-------------|
| `ROYAL_EXPRESS_API_KEY` | `rex_live_1234567890abcdef` | Production API key |
| `ROYAL_EXPRESS_API_URL` | `https://api.royalexpress.lk/v1/` | API base URL |
| `ROYAL_EXPRESS_TIMEOUT` | `30` | Request timeout in seconds |
| `ROYAL_EXPRESS_ENABLED` | `True` | Enable Royal Express |
| `ROYAL_EXPRESS_SANDBOX_MODE` | `False` | Production mode |
| `ROYAL_EXPRESS_WEBHOOK_SECRET` | `rex_webhook_secret_xyz` | Webhook signature key |

### Settings File Organization

```
# ============================================================================
# ROYAL EXPRESS COURIER INTEGRATION
# ============================================================================

# API Configuration
ROYAL_EXPRESS_API_KEY = env('ROYAL_EXPRESS_API_KEY', default='')
ROYAL_EXPRESS_API_URL = env('ROYAL_EXPRESS_API_URL', 
    default='https://api.royalexpress.lk/v1/')
ROYAL_EXPRESS_TIMEOUT = env.int('ROYAL_EXPRESS_TIMEOUT', default=30)

# Feature Flags
ROYAL_EXPRESS_ENABLED = env.bool('ROYAL_EXPRESS_ENABLED', default=True)
ROYAL_EXPRESS_SANDBOX_MODE = env.bool('ROYAL_EXPRESS_SANDBOX_MODE', 
    default=False)

# Webhook Configuration
ROYAL_EXPRESS_WEBHOOK_SECRET = env('ROYAL_EXPRESS_WEBHOOK_SECRET', 
    default='')
ROYAL_EXPRESS_WEBHOOK_ENABLED = env.bool('ROYAL_EXPRESS_WEBHOOK_ENABLED', 
    default=True)

# Business Logic
ROYAL_EXPRESS_DEFAULT_SERVICE_TYPE = env('ROYAL_EXPRESS_DEFAULT_SERVICE_TYPE',
    default='STANDARD')
```

### Feature Flags Usage

| Flag | When True | When False |
|------|-----------|------------|
| `ROYAL_EXPRESS_ENABLED` | Provider available to tenants | Provider hidden |
| `ROYAL_EXPRESS_SANDBOX_MODE` | Use test API endpoints | Use production endpoints |
| `ROYAL_EXPRESS_DEBUG_LOGGING` | Log all API requests | Log errors only |
| `ROYAL_EXPRESS_WEBHOOK_ENABLED` | Process webhooks | Ignore webhooks |

### Security Considerations

| Setting | Security Level | Protection |
|---------|---------------|------------|
| API Key | High | Never commit to repo, use env vars |
| Webhook Secret | High | Strong random string, rotate regularly |
| API URL | Low | Safe to commit default value |
| Timeout | None | No security impact |

### Expected Outcome
- Django settings configured for Royal Express
- Environment variables properly loaded
- Feature flags for flexible configuration
- Documentation for all settings
- .env.example updated with examples

### Verification Checklist
- [ ] Royal Express settings section added to settings file
- [ ] API credentials settings defined
- [ ] Webhook settings configured
- [ ] Feature flags implemented
- [ ] Validation settings added
- [ ] Environment variable documentation included
- [ ] .env.example file updated
- [ ] Security best practices followed
- [ ] All settings use env() helper for environment loading

---

## Task 45: Create RoyalExpress Config Model

### Overview
Create the database model for storing tenant-specific Royal Express configuration. This allows each tenant to have their own Royal Express account credentials and settings, supporting multi-tenancy.

### Dependencies
- Task 44: RoyalExpress Settings created
- Shipping app models established
- Tenant model exists

### Instructions

1. **Navigate to shipping models**
   - Go to `backend/apps/shipping/models/` directory
   - Identify courier config models location
   - May be in dedicated courier_configs.py file

2. **Create RoyalExpressConfig model class**
   - Inherit from appropriate base model
   - Use TimeStampedModel or similar base
   - Apply tenant-aware model mixins if available

3. **Define tenant relationship**
   - Add ForeignKey to Tenant model
   - Set on_delete=CASCADE for cleanup
   - Add related_name='royal_express_configs'
   - Consider unique constraint per tenant

4. **Define credential fields**
   - Add `api_key` CharField (encrypted)
   - Mark as required field
   - Add max_length appropriate for API keys
   - Consider using encrypted field type

5. **Define configuration fields**
   - Add `is_active` BooleanField (default=True)
   - Add `is_sandbox` BooleanField (default=False)
   - Add `default_service_type` CharField with choices
   - Add `webhook_enabled` BooleanField (default=True)
   - Add `webhook_secret` CharField (encrypted, optional)

6. **Define business logic fields**
   - Add `auto_create_shipments` BooleanField
   - Add `auto_retry_failed` BooleanField
   - Add `max_retry_attempts` IntegerField
   - Add `notification_email` EmailField (optional)

7. **Define metadata fields**
   - Add `last_sync_at` DateTimeField (nullable)
   - Add `total_shipments` IntegerField (default=0)
   - Add `failed_shipments` IntegerField (default=0)
   - Add `notes` TextField (optional)

8. **Add Meta class**
   - Set verbose_name and verbose_name_plural
   - Add unique_together constraint on tenant
   - Define default ordering
   - Add indexes for performance

9. **Implement clean method**
   - Validate API key format
   - Verify credentials with Royal Express API (optional)
   - Validate webhook secret if webhook enabled
   - Check business logic field combinations

10. **Add model methods**
    - Create `get_client()` method to return configured client
    - Create `is_configured()` method to check completeness
    - Create `increment_shipment_count()` method
    - Create `update_last_sync()` method

11. **Add model properties**
    - Create `api_url` property returning correct URL
    - Create `is_ready` property checking configuration status
    - Create `display_name` property for admin

12. **Register model in admin**
    - Create admin class for RoyalExpressConfig
    - Define list_display fields
    - Add search_fields and filters
    - Add readonly_fields for metadata

### Model Fields

| Field | Type | Required | Purpose |
|-------|------|----------|---------|
| `tenant` | ForeignKey | Yes | Links to tenant |
| `api_key` | CharField(encrypted) | Yes | Royal Express API key |
| `is_active` | BooleanField | Yes | Enable/disable integration |
| `is_sandbox` | BooleanField | Yes | Use test environment |
| `default_service_type` | CharField | Yes | Default shipping service |
| `webhook_enabled` | BooleanField | Yes | Process webhooks |
| `webhook_secret` | CharField | No | Webhook verification |
| `auto_create_shipments` | BooleanField | Yes | Automatically create shipments |
| `notification_email` | EmailField | No | Alert notifications |
| `last_sync_at` | DateTimeField | No | Last API sync timestamp |
| `total_shipments` | IntegerField | Yes | Shipment counter |
| `created_at` | DateTimeField | Yes | Record creation time |
| `updated_at` | DateTimeField | Yes | Last update time |

### Service Type Choices

| Choice Value | Display Name | Description |
|--------------|--------------|-------------|
| `STANDARD` | Standard Delivery | 2-4 business days |
| `EXPRESS` | Express Delivery | 1-2 business days (if available) |

### Model Constraints

| Constraint | Type | Purpose |
|------------|------|---------|
| Unique Tenant | unique_together | One config per tenant |
| API Key Required | validation | Cannot be blank |
| Webhook Secret | validation | Required if webhooks enabled |

### Model Methods

| Method | Parameters | Returns | Purpose |
|--------|------------|---------|---------|
| `get_client()` | None | RoyalExpressClient | Get configured HTTP client |
| `is_configured()` | None | bool | Check if fully configured |
| `increment_shipment_count()` | None | None | Increment total_shipments |
| `update_last_sync()` | None | None | Set last_sync_at to now |
| `test_connection()` | None | bool | Verify API credentials |

### Model Properties

| Property | Returns | Purpose |
|----------|---------|---------|
| `api_url` | str | Get correct API URL (sandbox vs prod) |
| `is_ready` | bool | Check if config is complete and active |
| `display_name` | str | Human-readable config identifier |

### Admin Configuration

| Admin Feature | Implementation |
|--------------|----------------|
| List Display | tenant, is_active, service_type, total_shipments |
| Search Fields | tenant__name, api_key |
| Filters | is_active, is_sandbox, default_service_type |
| Readonly Fields | total_shipments, failed_shipments, last_sync_at |
| Actions | Test connection, reset counters |

### Security Considerations

| Field | Security Measure |
|-------|-----------------|
| api_key | Encrypt at rest, mask in admin |
| webhook_secret | Encrypt at rest, mask in admin |
| credentials | Never log in plain text |

### Expected Outcome
- Database model for tenant Royal Express configuration
- Proper field validation and constraints
- Useful helper methods and properties
- Admin interface for configuration management
- Security measures for sensitive data

### Verification Checklist
- [ ] RoyalExpressConfig model created in shipping/models/
- [ ] Tenant foreign key relationship defined
- [ ] Credential fields added with encryption
- [ ] Configuration boolean fields implemented
- [ ] Metadata fields for tracking added
- [ ] Model Meta class configured properly
- [ ] clean() method validates configuration
- [ ] Helper methods implemented
- [ ] Properties for convenient access created
- [ ] Admin class registered and configured
- [ ] Migrations generated and applied
- [ ] Model appears in Django admin

---

## Task 46: Create RoyalExpressClient

### Overview
Create the HTTP client class for Royal Express API communication. This client handles authentication, request formatting, error handling, and response parsing, abstracting API complexity from the provider implementation.

### Dependencies
- Task 45: RoyalExpressConfig model created
- Task 43: RoyalExpress constants available

### Instructions

1. **Create client file**
   - Create `client.py` in `providers/royal_express/` directory
   - Import necessary dependencies (requests, logging, typing)
   - Import constants from constants.py

2. **Define RoyalExpressClient class**
   - Create class with initialization method
   - Accept RoyalExpressConfig instance in constructor
   - Store config for credential access

3. **Initialize client attributes**
   - Set `base_url` from config
   - Set `api_key` from config
   - Set `timeout` from settings or config
   - Create requests Session for connection pooling
   - Configure session headers (Content-Type, Accept)

4. **Implement authentication method**
   - Create `_get_headers()` private method
   - Add API key to headers (check Royal Express docs)
   - Format: `Authorization: Bearer {api_key}` or custom header
   - Include standard headers (User-Agent, Content-Type)

5. **Implement generic request method**
   - Create `_request()` private method
   - Accept method, endpoint, data, params
   - Build full URL from base_url and endpoint
   - Add authentication headers
   - Make HTTP request with timeout
   - Handle connection errors, timeouts
   - Parse JSON response
   - Raise appropriate exceptions for errors

6. **Implement error handling**
   - Create custom exception classes
   - RoyalExpressAPIError for API errors
   - RoyalExpressAuthenticationError for auth failures
   - RoyalExpressConnectionError for network issues
   - Parse error responses and extract messages

7. **Implement retry logic**
   - Wrap _request in retry decorator or logic
   - Retry on transient failures (5xx, timeouts)
   - Use exponential backoff
   - Respect MAX_RETRIES from constants
   - Log retry attempts

8. **Implement create shipment method**
   - Create `create_shipment()` public method
   - Accept shipment data dictionary
   - Validate required fields
   - Format data for Royal Express API
   - Call _request with POST to create endpoint
   - Parse response and return waybill info

9. **Implement tracking method**
   - Create `get_tracking()` public method
   - Accept waybill number
   - Call _request with GET to tracking endpoint
   - Parse tracking events from response
   - Return standardized tracking data

10. **Implement rate calculation method**
    - Create `calculate_rate()` public method
    - Accept origin, destination, weight, dimensions
    - Call _request with POST to rates endpoint
    - Parse rate information from response
    - Return pricing details

11. **Implement webhook verification**
    - Create `verify_webhook_signature()` method
    - Accept request headers and body
    - Extract signature from headers
    - Calculate expected signature
    - Compare and return boolean

12. **Add logging**
    - Log all API requests (sanitize credentials)
    - Log all API responses
    - Log errors with full context
    - Use appropriate log levels

13. **Add docstrings**
    - Document each method's purpose
    - Document parameters and return types
    - Document exceptions raised
    - Include usage examples

### Client Class Structure

| Component | Purpose |
|-----------|---------|
| `__init__()` | Initialize client with config |
| `_get_headers()` | Build authentication headers |
| `_request()` | Generic HTTP request handler |
| `create_shipment()` | Create new shipment |
| `get_tracking()` | Get tracking information |
| `calculate_rate()` | Get shipping rate quote |
| `verify_webhook_signature()` | Verify webhook authenticity |

### HTTP Request Flow

```
Client Method Call
        │
        ▼
   Validate Input
        │
        ▼
   Format Request Data
        │
        ▼
  _get_headers() → Add Authentication
        │
        ▼
    _request() → Make HTTP Call
        │
        ├─── Success → Parse Response
        │                    │
        │                    ▼
        │             Return Data
        │
        └─── Error → Retry Logic
                          │
                          ├─── Transient → Retry
                          │
                          └─── Permanent → Raise Exception
```

### Authentication Headers

| Header | Value | Purpose |
|--------|-------|---------|
| `Authorization` | `Bearer {api_key}` | API authentication |
| `Content-Type` | `application/json` | Request format |
| `Accept` | `application/json` | Response format |
| `User-Agent` | `LCC-Shipping/1.0` | Client identification |

### Error Handling

| Error Type | Status Codes | Action |
|------------|--------------|--------|
| Authentication | 401, 403 | Raise RoyalExpressAuthenticationError |
| Validation | 400, 422 | Raise RoyalExpressAPIError with details |
| Not Found | 404 | Raise RoyalExpressAPIError |
| Server Error | 500, 502, 503, 504 | Retry with backoff |
| Timeout | N/A | Retry with backoff |
| Connection | N/A | Raise RoyalExpressConnectionError |

### Retry Strategy

| Attempt | Wait Time | Action |
|---------|-----------|--------|
| 1 | 0s | Immediate |
| 2 | 2s | Exponential backoff |
| 3 | 4s | Exponential backoff |
| 4+ | Fail | Raise exception |

### Create Shipment Request Format

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `sender` | object | Yes | Sender details |
| `recipient` | object | Yes | Recipient details |
| `package` | object | Yes | Package details (weight, dimensions) |
| `service_type` | string | Yes | Service level (STANDARD/EXPRESS) |
| `cod_amount` | decimal | No | Cash on delivery amount |
| `reference` | string | No | Merchant reference |

### Tracking Response Format

| Field | Type | Description |
|-------|------|-------------|
| `waybill` | string | Tracking number |
| `status` | string | Current status |
| `events` | array | List of tracking events |
| `estimated_delivery` | datetime | Expected delivery time |

### Expected Outcome
- HTTP client class for Royal Express API
- Authentication and request handling implemented
- Error handling with retry logic
- Methods for shipment creation and tracking
- Webhook signature verification
- Comprehensive logging

### Verification Checklist
- [ ] `backend/apps/shipping/providers/royal_express/client.py` created
- [ ] RoyalExpressClient class defined
- [ ] Client initialized with config
- [ ] Authentication headers implemented
- [ ] Generic _request() method created
- [ ] Error handling and custom exceptions
- [ ] Retry logic with exponential backoff
- [ ] create_shipment() method implemented
- [ ] get_tracking() method implemented
- [ ] calculate_rate() method implemented
- [ ] verify_webhook_signature() method added
- [ ] Logging added to all methods
- [ ] Docstrings and type hints complete

---

## Task 47: Create RoyalExpressProvider

### Overview
Create the Royal Express provider class that implements the ShippingProvider abstract base class. This provider orchestrates shipment creation, tracking, and webhook handling using the RoyalExpressClient, and integrates with LCC's shipping system.

### Dependencies
- Task 46: RoyalExpressClient created
- ShippingProvider ABC defined
- Shipment models available

### Instructions

1. **Create provider file**
   - Create `provider.py` in `providers/royal_express/` directory
   - Import ShippingProvider ABC
   - Import RoyalExpressClient and related classes

2. **Define RoyalExpressProvider class**
   - Inherit from ShippingProvider ABC
   - Implement all required abstract methods
   - Add Royal Express-specific methods

3. **Implement __init__ method**
   - Accept tenant parameter
   - Load RoyalExpressConfig for tenant
   - Initialize RoyalExpressClient with config
   - Cache config and client as instance variables

4. **Implement get_provider_name method**
   - Return "Royal Express" as display name
   - Used for UI and logging

5. **Implement get_provider_code method**
   - Return "royal_express" as unique identifier
   - Used for provider registration

6. **Implement is_available method**
   - Check if config exists for tenant
   - Check if config is_active is True
   - Verify API credentials are present
   - Return boolean availability status

7. **Implement calculate_rate method**
   - Accept origin, destination, weight, dimensions, service_type
   - Validate input parameters
   - Call client.calculate_rate()
   - Parse response and extract pricing
   - Return Rate object with pricing details
   - Handle errors and return None or raise exception

8. **Implement create_shipment method**
   - Accept Shipment model instance
   - Validate shipment data completeness
   - Transform shipment to Royal Express format
   - Call client.create_shipment()
   - Parse response for waybill and status
   - Update shipment with waybill and tracking URL
   - Save shipment to database
   - Return updated shipment

9. **Implement track_shipment method**
   - Accept waybill number
   - Call client.get_tracking()
   - Parse tracking events
   - Transform to LCC tracking format
   - Create or update ShipmentTracking records
   - Return list of tracking events

10. **Implement cancel_shipment method**
    - Accept shipment or waybill
    - Call Royal Express cancel API (if available)
    - Update shipment status
    - Return success boolean

11. **Implement validate_address method**
    - Accept address data
    - Validate against Royal Express requirements
    - Check for coverage area
    - Return validation result with errors

12. **Implement webhook handler**
    - Create handle_webhook() method
    - Accept request object
    - Verify webhook signature using client
    - Parse webhook payload
    - Extract waybill and new status
    - Update corresponding shipment
    - Create tracking event
    - Return success response

13. **Add data transformation methods**
    - Create `_transform_shipment_to_api()` private method
    - Create `_transform_tracking_from_api()` private method
    - Create `_map_status()` private method
    - Handle format conversions

14. **Add validation methods**
    - Create `_validate_shipment_data()` method
    - Check required fields present
    - Validate weight and dimensions
    - Validate COD amount if applicable
    - Raise ValidationError for issues

15. **Add error handling**
    - Wrap API calls in try-except blocks
    - Log errors appropriately
    - Raise meaningful exceptions
    - Maintain shipment status consistency

16. **Add logging**
    - Log shipment creation attempts
    - Log tracking requests
    - Log webhook events
    - Include tenant and shipment context

### Provider Methods

| Method | Abstract | Parameters | Returns | Purpose |
|--------|----------|------------|---------|---------|
| `get_provider_name()` | Yes | None | str | Display name |
| `get_provider_code()` | Yes | None | str | Unique code |
| `is_available()` | Yes | tenant | bool | Check availability |
| `calculate_rate()` | Yes | origin, destination, weight | Rate | Get shipping cost |
| `create_shipment()` | Yes | shipment | Shipment | Create shipment |
| `track_shipment()` | Yes | waybill | List[TrackingEvent] | Get tracking |
| `cancel_shipment()` | Yes | shipment | bool | Cancel shipment |
| `validate_address()` | No | address | ValidationResult | Verify address |
| `handle_webhook()` | No | request | Response | Process webhook |

### Shipment Creation Flow

```
create_shipment(shipment)
        │
        ▼
  Validate Shipment Data
        │
        ▼
  Transform to API Format
        │
        ▼
  Call client.create_shipment()
        │
        ├─── Success
        │       │
        │       ▼
        │   Extract Waybill
        │       │
        │       ▼
        │   Update Shipment Model
        │       │
        │       ▼
        │   Save to Database
        │       │
        │       ▼
        │   Return Shipment
        │
        └─── Error
                │
                ▼
            Log Error
                │
                ▼
          Raise Exception
```

### Tracking Flow

```
track_shipment(waybill)
        │
        ▼
  Call client.get_tracking()
        │
        ▼
  Parse Tracking Events
        │
        ▼
  Transform to LCC Format
        │
        ▼
  Create ShipmentTracking Records
        │
        ▼
  Return Tracking Events
```

### Webhook Processing Flow

```
Webhook Request
        │
        ▼
  Verify Signature
        │
        ├─── Invalid → Return 401
        │
        ▼
  Parse Payload
        │
        ▼
  Extract Waybill & Status
        │
        ▼
  Find Shipment in DB
        │
        ├─── Not Found → Log & Return 404
        │
        ▼
  Map Status to LCC Format
        │
        ▼
  Update Shipment Status
        │
        ▼
  Create Tracking Event
        │
        ▼
  Send Notifications (if configured)
        │
        ▼
  Return 200 OK
```

### Data Transformation

| Direction | From | To | Purpose |
|-----------|------|-----|---------|
| Outbound | Shipment model | Royal Express API | Create shipment request |
| Inbound | Royal Express status | ShipmentStatus enum | Status updates |
| Inbound | Royal Express tracking | TrackingEvent model | Tracking history |

### Status Mapping

| Royal Express Status | LCC Status | Trigger Notification |
|---------------------|-----------|---------------------|
| `ORDER_PLACED` | `PENDING` | No |
| `PICKED_UP` | `PICKED_UP` | Yes |
| `IN_SORTING` | `IN_TRANSIT` | No |
| `OUT_FOR_DELIVERY` | `OUT_FOR_DELIVERY` | Yes |
| `DELIVERED` | `DELIVERED` | Yes |
| `DELIVERY_FAILED` | `FAILED` | Yes |
| `RETURNED` | `RETURNED` | Yes |

### Error Scenarios

| Scenario | Action | Impact |
|----------|--------|--------|
| Config Not Found | Raise ProviderNotConfigured | Cannot use provider |
| Invalid Credentials | Raise AuthenticationError | Must reconfigure |
| API Error | Log and raise APIError | Shipment creation fails |
| Validation Error | Raise ValidationError | Show to user |
| Network Timeout | Retry then raise | Temporary failure |

### Expected Outcome
- Full ShippingProvider implementation for Royal Express
- Shipment creation with API integration
- Tracking with event history
- Webhook handling for status updates
- Proper error handling and logging
- Data transformation between formats

### Verification Checklist
- [ ] `backend/apps/shipping/providers/royal_express/provider.py` created
- [ ] RoyalExpressProvider class inherits from ShippingProvider
- [ ] All abstract methods implemented
- [ ] get_provider_name() and get_provider_code() return correct values
- [ ] is_available() checks config properly
- [ ] calculate_rate() method implemented
- [ ] create_shipment() creates shipments via API
- [ ] track_shipment() fetches and transforms tracking
- [ ] cancel_shipment() method implemented
- [ ] handle_webhook() processes status updates
- [ ] Data transformation methods created
- [ ] Validation methods implemented
- [ ] Error handling comprehensive
- [ ] Logging added throughout

---

## Task 48: Create RoyalExpress Shipment Method

### Overview
Enhance the create_shipment implementation in RoyalExpressProvider with comprehensive shipment creation logic, including data validation, API communication, error recovery, and database persistence.

### Dependencies
- Task 47: RoyalExpressProvider created with basic structure

### Instructions

1. **Review create_shipment method signature**
   - Confirm method accepts Shipment model instance
   - Verify return type is updated Shipment
   - Check parameter naming consistency

2. **Implement comprehensive validation**
   - Call _validate_shipment_data() at method start
   - Check sender address completeness
   - Check recipient address completeness
   - Validate package weight within limits
   - Validate dimensions if provided
   - Validate COD amount if applicable
   - Raise ValidationError with specific messages

3. **Implement address formatting**
   - Create _format_address() helper method
   - Extract and format address fields
   - Ensure Royal Express required fields present
   - Format phone numbers to +94 format
   - Handle missing optional fields gracefully

4. **Build shipment request payload**
   - Create dictionary with shipment data
   - Include sender details (name, phone, address)
   - Include recipient details (name, phone, address)
   - Include package details (weight, dimensions, description)
   - Include service type from config or shipment
   - Include COD amount if payment_method is COD
   - Include merchant reference (shipment ID)

5. **Make API call**
   - Wrap client.create_shipment() in try-except
   - Pass formatted payload to client
   - Handle RoyalExpressAPIError exceptions
   - Handle RoyalExpressAuthenticationError
   - Handle connection and timeout errors

6. **Parse API response**
   - Extract waybill number from response
   - Extract tracking URL from response
   - Extract initial status from response
   - Extract estimated delivery date if provided
   - Validate response completeness

7. **Update shipment model**
   - Set shipment.waybill to response waybill
   - Set shipment.tracking_url to response URL
   - Map API status to ShipmentStatus enum
   - Set shipment.status to mapped status
   - Set shipment.provider_response to full API response (JSON)
   - Set shipment.created_at_provider to current timestamp

8. **Create initial tracking event**
   - Create ShipmentTracking model instance
   - Set shipment foreign key
   - Set status to current status
   - Set event_time to current time
   - Set description based on status
   - Set raw_data to API response
   - Save tracking event

9. **Save shipment**
   - Call shipment.save() to persist changes
   - Handle potential database errors
   - Use transaction if supported

10. **Update config statistics**
    - Call config.increment_shipment_count()
    - Update config.last_sync_at
    - Save config changes

11. **Add comprehensive logging**
    - Log shipment creation start with ID
    - Log API request (sanitize sensitive data)
    - Log API response summary
    - Log shipment model updates
    - Log completion successfully

12. **Implement error recovery**
    - On validation error, mark shipment as FAILED
    - On API error, mark shipment as PENDING_RETRY
    - Store error message in shipment.notes
    - Log error with full context
    - Re-raise exception after cleanup

13. **Return shipment**
    - Return updated shipment model instance
    - Ensure all fields populated correctly

### Validation Rules

| Field | Validation | Error Message |
|-------|------------|---------------|
| Sender Name | Required, min 2 chars | "Sender name is required" |
| Sender Phone | Required, valid format | "Valid sender phone required" |
| Sender Address | Required, min 10 chars | "Complete sender address required" |
| Recipient Name | Required, min 2 chars | "Recipient name is required" |
| Recipient Phone | Required, valid format | "Valid recipient phone required" |
| Recipient Address | Required, min 10 chars | "Complete recipient address required" |
| Weight | Required, 0.1-25 kg | "Weight must be between 0.1kg and 25kg" |
| COD Amount | If COD, max ₨500,000 | "COD amount exceeds maximum" |

### Request Payload Structure

| Field | Type | Example | Source |
|-------|------|---------|--------|
| `sender.name` | string | "ABC Store" | shipment.sender_name |
| `sender.phone` | string | "+94712345678" | shipment.sender_phone |
| `sender.address` | string | "123 Main St, Colombo 03" | shipment.sender_address |
| `recipient.name` | string | "John Doe" | shipment.recipient_name |
| `recipient.phone` | string | "+94771234567" | shipment.recipient_phone |
| `recipient.address` | string | "456 Galle Rd, Colombo 06" | shipment.recipient_address |
| `package.weight` | number | 2.5 | shipment.weight |
| `package.description` | string | "Electronics" | shipment.description |
| `service_type` | string | "STANDARD" | config.default_service_type |
| `cod_amount` | number | 5000.00 | shipment.cod_amount |
| `reference` | string | "SHIP-12345" | shipment.id or reference |

### API Response Expected Fields

| Field | Type | Description |
|-------|------|-------------|
| `waybill` | string | Tracking number |
| `tracking_url` | string | Public tracking URL |
| `status` | string | Initial status (ORDER_PLACED) |
| `estimated_delivery` | string | ISO datetime |
| `service_type` | string | Confirmed service |

### Error Handling Matrix

| Error Type | Shipment Status | Action |
|------------|----------------|--------|
| ValidationError | DRAFT/FAILED | Log, raise, don't call API |
| AuthenticationError | PENDING_RETRY | Log, update config, raise |
| APIError (4xx) | FAILED | Log, save error, raise |
| APIError (5xx) | PENDING_RETRY | Log, schedule retry, raise |
| ConnectionError | PENDING_RETRY | Log, schedule retry, raise |
| TimeoutError | PENDING_RETRY | Log, schedule retry, raise |

### Logging Strategy

| Event | Log Level | Include |
|-------|-----------|---------|
| Method start | INFO | Shipment ID, tenant |
| Validation pass | DEBUG | Field summary |
| API request | INFO | Endpoint, sanitized payload |
| API response | INFO | Status, waybill |
| Model update | DEBUG | Updated fields |
| Success | INFO | Waybill, status |
| Validation error | WARNING | Error details |
| API error | ERROR | Error, response, traceback |

### Expected Outcome
- Robust shipment creation with full validation
- API integration with error handling
- Database persistence of shipment and tracking
- Comprehensive logging for debugging
- Graceful error recovery

### Verification Checklist
- [ ] create_shipment() method fully implemented
- [ ] Validation checks all required fields
- [ ] Address formatting handles various inputs
- [ ] Request payload properly structured
- [ ] API call wrapped in error handling
- [ ] Response parsing extracts all fields
- [ ] Shipment model updated with response data
- [ ] Initial tracking event created
- [ ] Config statistics incremented
- [ ] Errors handled and logged properly
- [ ] Shipment returned successfully

---

## Task 49: Create RoyalExpress Tracking Method

### Overview
Implement comprehensive tracking functionality in the RoyalExpressProvider, enabling retrieval of shipment status and tracking history from the Royal Express API and persisting tracking events in the LCC database.

### Dependencies
- Task 47: RoyalExpressProvider created
- ShipmentTracking model available

### Instructions

1. **Review track_shipment method signature**
   - Confirm method accepts waybill parameter
   - Optionally accept Shipment instance
   - Return list of TrackingEvent objects

2. **Implement input validation**
   - Check waybill is not empty
   - Validate waybill format if Royal Express has format
   - Raise ValueError for invalid input

3. **Retrieve shipment from database**
   - Query Shipment by waybill
   - Filter by current tenant for security
   - Handle shipment not found case

4. **Make tracking API call**
   - Wrap client.get_tracking() in try-except
   - Pass waybill to client method
   - Handle API errors gracefully
   - Log API request and response

5. **Parse tracking response**
   - Extract current status from response
   - Extract tracking events array
   - Extract estimated delivery if available
   - Validate response structure

6. **Transform tracking events**
   - Iterate through API events
   - Map each event status to LCC status
   - Parse event timestamp
   - Extract event location if provided
   - Extract event description/remarks
   - Create standardized TrackingEvent objects

7. **Update shipment status**
   - Compare current API status with shipment.status
   - If different, update shipment.status
   - Map API status to ShipmentStatus enum
   - Update shipment.updated_at
   - Save shipment if changed

8. **Persist tracking events**
   - For each new event, check if exists in DB
   - Create ShipmentTracking record if not exists
   - Set shipment foreign key
   - Set status, event_time, location, description
   - Set raw_data to original API event
   - Save tracking record

9. **Handle status change notifications**
   - If status changed to delivered, trigger notification
   - If status changed to failed, trigger notification
   - Use notification system if available
   - Log notification dispatch

10. **Update config metadata**
    - Update config.last_sync_at
    - Save config

11. **Return tracking events**
    - Return list of TrackingEvent objects
    - Include all historical and new events
    - Order by event_time ascending

12. **Add error handling**
    - Handle waybill not found (404)
    - Handle API errors
    - Log errors with context
    - Return partial data if possible

13. **Add caching (optional)**
    - Cache tracking results for 5-10 minutes
    - Check cache before API call
    - Reduce API load for frequent tracking

### Method Signature

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| waybill | str | Yes | Tracking number |
| shipment | Shipment | No | Optional shipment instance |
| force_refresh | bool | No | Bypass cache |

| Returns | Type | Description |
|---------|------|-------------|
| events | List[TrackingEvent] | List of tracking events |

### API Response Structure

| Field | Type | Description |
|-------|------|-------------|
| `waybill` | string | Tracking number |
| `current_status` | string | Latest status |
| `estimated_delivery` | string | Expected delivery datetime |
| `events` | array | List of status events |
| `events[].status` | string | Event status code |
| `events[].timestamp` | string | Event datetime ISO |
| `events[].location` | string | Event location |
| `events[].remarks` | string | Event description |

### Status Mapping for Tracking

| Royal Express Event Status | LCC Status | Notification |
|---------------------------|-----------|--------------|
| `ORDER_PLACED` | `PENDING` | No |
| `PICKED_UP` | `PICKED_UP` | Yes |
| `IN_WAREHOUSE` | `IN_TRANSIT` | No |
| `IN_SORTING` | `IN_TRANSIT` | No |
| `OUT_FOR_DELIVERY` | `OUT_FOR_DELIVERY` | Yes |
| `DELIVERED` | `DELIVERED` | Yes |
| `DELIVERY_FAILED` | `FAILED` | Yes |
| `RETURNED_TO_SENDER` | `RETURNED` | Yes |

### TrackingEvent Object Structure

| Field | Type | Description |
|-------|------|-------------|
| `id` | int | Database ID |
| `shipment` | Shipment | Related shipment |
| `status` | ShipmentStatus | Mapped status |
| `event_time` | datetime | When event occurred |
| `location` | str | Where event occurred |
| `description` | str | Event description |
| `raw_data` | dict | Original API event |
| `created_at` | datetime | When record created |

### Tracking Data Flow

```
track_shipment(waybill)
        │
        ▼
  Validate Waybill
        │
        ▼
  Find Shipment in DB
        │
        ▼
  Call client.get_tracking(waybill)
        │
        ▼
  Parse API Response
        │
        ▼
  Transform Events
        │
        ├─── For each event
        │       │
        │       ▼
        │   Map Status
        │       │
        │       ▼
        │   Check if Event Exists in DB
        │       │
        │       ├─── Exists: Skip
        │       │
        │       └─── New: Create ShipmentTracking
        │
        ▼
  Update Shipment Current Status
        │
        ▼
  Trigger Notifications (if needed)
        │
        ▼
  Return TrackingEvent List
```

### Error Scenarios

| Error | HTTP Code | Action | Return |
|-------|-----------|--------|--------|
| Invalid waybill format | N/A | Raise ValueError | Exception |
| Waybill not found | 404 | Log, raise NotFoundError | Exception |
| API authentication error | 401 | Log, raise AuthError | Exception |
| API error | 4xx/5xx | Log, raise APIError | Exception |
| Connection timeout | N/A | Log, retry, raise | Exception |
| Shipment not in DB | N/A | Log warning | Continue API call |

### Deduplication Logic

| Scenario | Action |
|----------|--------|
| Event exists with same timestamp | Skip creation |
| Event exists with same status but different time | Create new event |
| All events are new | Create all |
| Status unchanged from last check | Still create events |

### Notification Triggers

| Status Change | Notification Type | Recipients |
|---------------|------------------|------------|
| Any → PICKED_UP | Email, SMS | Customer |
| Any → OUT_FOR_DELIVERY | Email, SMS, push | Customer |
| Any → DELIVERED | Email, SMS, push | Customer, merchant |
| Any → FAILED | Email, SMS | Customer, merchant |
| Any → RETURNED | Email | Merchant |

### Logging Requirements

| Event | Log Level | Details |
|-------|-----------|---------|
| Tracking start | INFO | Waybill, tenant |
| API call | INFO | Endpoint, waybill |
| API success | INFO | Event count, current status |
| New events created | DEBUG | Event count, statuses |
| Status change | INFO | Old status, new status |
| Error | ERROR | Error type, message, traceback |

### Expected Outcome
- Tracking retrieval from Royal Express API
- Parsing and transformation of tracking events
- Database persistence of new events
- Shipment status updates
- Notification triggers for status changes
- Comprehensive error handling

### Verification Checklist
- [ ] track_shipment() method fully implemented
- [ ] Waybill validation performed
- [ ] Shipment retrieved from database
- [ ] API call made via client.get_tracking()
- [ ] Response parsed and validated
- [ ] Events transformed to LCC format
- [ ] Status mapping applied correctly
- [ ] New ShipmentTracking records created
- [ ] Duplicate events handled
- [ ] Shipment current status updated
- [ ] Notifications triggered for important statuses
- [ ] Config last_sync_at updated
- [ ] Errors handled gracefully
- [ ] Method returns list of events

---

## Task 50: Create RoyalExpress Webhook Handler

### Overview
Implement webhook handling for Royal Express to receive real-time shipment status updates. This enables the LCC system to update shipment statuses immediately without polling the tracking API.

### Dependencies
- Task 47: RoyalExpressProvider created
- Django webhook URL routing configured

### Instructions

1. **Create webhook URL pattern**
   - Add URL route in shipping app urls.py
   - Pattern: `/api/webhooks/royal-express/`
   - Link to webhook view function
   - Use `csrf_exempt` decorator for external requests

2. **Create webhook view**
   - Create `webhooks.py` in `providers/royal_express/` directory
   - Define `royal_express_webhook` view function
   - Accept POST requests only
   - Return appropriate HTTP responses

3. **Implement signature verification**
   - Extract webhook signature from headers
   - Header name likely: `X-RoyalExpress-Signature`
   - Extract request body as bytes
   - Use client.verify_webhook_signature()
   - If invalid, log and return 401 Unauthorized
   - If valid, proceed with processing

4. **Parse webhook payload**
   - Read request body as JSON
   - Handle JSON parse errors
   - Extract waybill number
   - Extract new status code
   - Extract timestamp
   - Extract any additional data (location, remarks)

5. **Find associated shipment**
   - Query Shipment model by waybill
   - Include tenant filter if multi-tenant webhook
   - Handle shipment not found (log warning, return 404)
   - Load shipment with related objects if needed

6. **Map status code**
   - Use status mapping from constants
   - Map Royal Express status to ShipmentStatus enum
   - Handle unknown status codes gracefully

7. **Update shipment status**
   - Compare new status with current shipment.status
   - If different, update shipment.status
   - Update shipment.updated_at
   - Add webhook payload to shipment.provider_response
   - Save shipment model

8. **Create tracking event**
   - Create new ShipmentTracking record
   - Set shipment foreign key
   - Set status to new status
   - Set event_time from webhook timestamp
   - Set location if provided
   - Set description from webhook
   - Set raw_data to webhook payload
   - Save tracking event

9. **Trigger notifications**
   - Check if status change requires notification
   - Use notification rules from Task 49
   - Send email/SMS for important statuses
   - Log notification dispatch

10. **Log webhook processing**
    - Log webhook received with waybill
    - Log signature verification result
    - Log shipment update
    - Log any errors encountered

11. **Return success response**
    - Return HTTP 200 with JSON response
    - Include acknowledgment message
    - Format: `{"status": "success", "waybill": "..."}`

12. **Implement error handling**
    - Catch signature verification failures → 401
    - Catch JSON parsing errors → 400
    - Catch shipment not found → 404
    - Catch database errors → 500
    - Log all errors with full context
    - Always return appropriate HTTP status

13. **Add idempotency**
    - Check if event already exists in database
    - Compare timestamp and status
    - If duplicate, skip processing but return 200
    - Prevents duplicate notifications

14. **Add security measures**
    - Only accept POST requests
    - Verify signature on all requests
    - Rate limit webhooks (optional)
    - Log suspicious activity

### Webhook Request Structure

| Component | Details |
|-----------|---------|
| Method | POST |
| Content-Type | application/json |
| Authentication | Signature header |
| Body | JSON with event data |

### Webhook Headers

| Header | Purpose | Example |
|--------|---------|---------|
| `Content-Type` | Format | `application/json` |
| `X-RoyalExpress-Signature` | Authentication | `sha256=abc123...` |
| `X-RoyalExpress-Event` | Event type | `status.changed` |
| `X-RoyalExpress-Timestamp` | Request time | `1635789456` |

### Webhook Payload Example

| Field | Type | Example |
|-------|------|---------|
| `event` | string | `status.changed` |
| `waybill` | string | `REX1234567890` |
| `status` | string | `OUT_FOR_DELIVERY` |
| `timestamp` | string | `2026-01-31T10:30:00Z` |
| `location` | string | `Colombo Hub` |
| `remarks` | string | `Out for delivery` |

### Signature Verification

```
Algorithm: HMAC-SHA256
Secret: webhook_secret from config
Data: Raw request body (bytes)
Expected: Signature from header
Compare: Constant-time comparison
Result: Boolean (valid/invalid)
```

### Webhook Processing Flow

```
POST /api/webhooks/royal-express/
        │
        ▼
  Extract Signature Header
        │
        ▼
  Verify Signature
        │
        ├─── Invalid → Return 401
        │
        ▼
  Parse JSON Payload
        │
        ├─── Error → Return 400
        │
        ▼
  Extract Waybill & Status
        │
        ▼
  Find Shipment in DB
        │
        ├─── Not Found → Return 404
        │
        ▼
  Check for Duplicate Event
        │
        ├─── Duplicate → Return 200 (skip processing)
        │
        ▼
  Map Status Code
        │
        ▼
  Update Shipment Status
        │
        ▼
  Create Tracking Event
        │
        ▼
  Trigger Notifications
        │
        ▼
  Log Processing
        │
        ▼
  Return 200 OK
```

### HTTP Response Codes

| Code | Scenario | Response Body |
|------|----------|---------------|
| 200 | Success | `{"status": "success"}` |
| 400 | Invalid JSON | `{"error": "Invalid payload"}` |
| 401 | Invalid signature | `{"error": "Unauthorized"}` |
| 404 | Waybill not found | `{"error": "Shipment not found"}` |
| 500 | Server error | `{"error": "Internal error"}` |

### Security Checklist

| Security Measure | Implementation |
|-----------------|----------------|
| Signature verification | HMAC-SHA256 with secret |
| Constant-time comparison | Use `hmac.compare_digest()` |
| CSRF exemption | `@csrf_exempt` decorator |
| Rate limiting | Throttle middleware (optional) |
| IP whitelisting | Check source IP (optional) |
| Logging | Log all webhook attempts |

### Idempotency Strategy

| Check | Action |
|-------|--------|
| Event exists with exact timestamp | Skip processing, return 200 |
| Status unchanged | Still create tracking event |
| Multiple webhooks for same status | Accept all, deduplicate by timestamp |

### Notification Matrix

| Status Change | Email | SMS | Push |
|---------------|-------|-----|------|
| PENDING → PICKED_UP | Yes | Yes | No |
| PICKED_UP → IN_TRANSIT | No | No | No |
| IN_TRANSIT → OUT_FOR_DELIVERY | Yes | Yes | Yes |
| OUT_FOR_DELIVERY → DELIVERED | Yes | Yes | Yes |
| Any → FAILED | Yes | Yes | No |
| Any → RETURNED | Yes | No | No |

### Error Logging

| Error Type | Log Level | Include |
|------------|-----------|---------|
| Invalid signature | WARNING | Headers, IP, waybill |
| Invalid JSON | WARNING | Raw body, error |
| Shipment not found | INFO | Waybill |
| Database error | ERROR | Traceback, payload |
| Notification failure | WARNING | Error, recipient |

### Expected Outcome
- Webhook endpoint for Royal Express status updates
- Signature verification for security
- Real-time shipment status updates
- Tracking event creation
- Notification triggers
- Comprehensive error handling and logging

### Verification Checklist
- [ ] Webhook URL pattern added to urls.py
- [ ] Webhook view function created in webhooks.py
- [ ] POST method only accepted
- [ ] Signature verification implemented
- [ ] JSON payload parsing added
- [ ] Waybill extraction working
- [ ] Shipment lookup from database
- [ ] Status mapping applied
- [ ] Shipment model updated
- [ ] ShipmentTracking record created
- [ ] Notifications triggered appropriately
- [ ] Idempotency check implemented
- [ ] Error handling for all scenarios
- [ ] Appropriate HTTP status codes returned
- [ ] Logging comprehensive
- [ ] CSRF exempt decorator applied

---

## Task 51: Create RoyalExpress Provider Registration

### Overview
Register the RoyalExpressProvider with the LCC shipping provider factory/registry, making it available for tenant configuration and use throughout the system.

### Dependencies
- Task 47: RoyalExpressProvider fully implemented
- CourierFactory or provider registry exists

### Instructions

1. **Locate provider registry**
   - Find CourierFactory or provider registry module
   - Typically in `backend/apps/shipping/providers/` directory
   - May be in `__init__.py` or `registry.py` file

2. **Import RoyalExpressProvider**
   - Add import statement for RoyalExpressProvider
   - Import from `providers.royal_express.provider`
   - Ensure import path is correct

3. **Register provider**
   - Use factory registration method
   - Register with key `"royal_express"`
   - Map key to RoyalExpressProvider class
   - Ensure key matches provider.get_provider_code()

4. **Update provider list**
   - Add Royal Express to AVAILABLE_PROVIDERS list/dict
   - Include display name, description, features
   - Include coverage area information
   - Include pricing tier (budget/standard/premium)

5. **Add provider metadata**
   - Define provider capabilities
   - Tracking support: Yes
   - COD support: Yes
   - Webhook support: Yes
   - Coverage: Island-wide

6. **Update documentation**
   - Add Royal Express to provider docs
   - Include integration guide
   - Document configuration steps
   - Note API requirements

7. **Create admin display**
   - Ensure Royal Express appears in admin provider list
   - Add logo/icon if available
   - Configure admin display settings

8. **Add to tenant configuration UI**
   - Ensure Royal Express appears in tenant settings
   - Provide configuration form
   - Include credential input fields
   - Add test connection button

9. **Create database migration if needed**
   - If provider choices are database-driven
   - Add Royal Express to provider choices
   - Run and apply migration

10. **Update provider selection logic**
    - Ensure Royal Express available in provider dropdowns
    - Add to shipment creation provider selection
    - Include in rate comparison logic

### Registration Methods

| Method | Use Case |
|--------|----------|
| Factory Registration | Most common, dict-based |
| Decorator Registration | Class-level decorator |
| Manual Registration | Direct registry manipulation |

### Provider Registry Structure

```python
COURIER_PROVIDERS = {
    'koombiyo': KoombiyoProvider,
    'domex': DomexProvider,
    'promptx': PromptXProvider,
    'royal_express': RoyalExpressProvider,  # New
    'trance_express': TranceExpressProvider,  # Next task
}
```

### Provider Metadata

| Field | Value |
|-------|-------|
| `code` | `royal_express` |
| `name` | `Royal Express` |
| `description` | `Budget-friendly island-wide delivery` |
| `coverage` | `Island-wide` |
| `delivery_time` | `2-4 business days` |
| `pricing_tier` | `Budget` |
| `tracking_support` | `True` |
| `cod_support` | `True` |
| `webhook_support` | `True` |
| `requires_account` | `True` |

### Provider Capabilities

| Capability | Supported |
|------------|-----------|
| Create Shipment | ✓ |
| Track Shipment | ✓ |
| Cancel Shipment | ✓ |
| Calculate Rate | ✓ |
| Validate Address | ✓ |
| Webhooks | ✓ |
| Bulk Operations | ✗ |
| Pickup Scheduling | ✗ |

### Admin Integration

| Component | Implementation |
|-----------|----------------|
| Provider List | Show in admin provider list |
| Configuration Form | RoyalExpressConfig admin |
| Test Connection | Admin action |
| Logo Display | Icon in provider list |

### Frontend Integration

| Location | Display |
|----------|---------|
| Tenant Settings | Configuration page |
| Shipment Creation | Provider dropdown option |
| Rate Comparison | Include in rate fetching |
| Tracking | Show Royal Express tracking UI |

### Expected Outcome
- Royal Express provider registered in factory
- Available for tenant configuration
- Appears in admin and frontend
- Fully integrated with shipping system
- Ready for use by tenants

### Verification Checklist
- [ ] RoyalExpressProvider imported in registry
- [ ] Provider registered with key "royal_express"
- [ ] Added to AVAILABLE_PROVIDERS list
- [ ] Provider metadata defined
- [ ] Capabilities documented
- [ ] Admin integration complete
- [ ] Frontend shows provider option
- [ ] Configuration form accessible
- [ ] Provider can be selected for shipments
- [ ] Integration tests pass

---

## Summary

This document covered the complete integration of Royal Express courier service into the LCC shipping system. All nine tasks establish a fully functional, production-ready courier provider with shipment creation, tracking, webhook support, and proper error handling.

### Completed Tasks
1. ✓ Created Royal Express constants and configuration
2. ✓ Created Django settings for environment configuration
3. ✓ Created database config model for tenant credentials
4. ✓ Created HTTP client for API communication
5. ✓ Created provider class implementing ShippingProvider
6. ✓ Implemented shipment creation with validation
7. ✓ Implemented tracking with event history
8. ✓ Implemented webhook handler for real-time updates
9. ✓ Registered provider in shipping system

### Next Steps
Proceed to [02_Tasks-52-60_TranceExpress.md](02_Tasks-52-60_TranceExpress.md) to implement Trance Express courier integration following a similar pattern.
