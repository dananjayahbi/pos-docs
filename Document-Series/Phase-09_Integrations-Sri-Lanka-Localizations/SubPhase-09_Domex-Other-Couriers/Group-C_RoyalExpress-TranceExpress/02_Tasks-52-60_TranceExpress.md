# Tasks 52-60: Trance Express Integration & Verification

> **Phase:** 09 - Integrations & Sri Lanka Localizations  
> **SubPhase:** 09 - Domex & Other Couriers  
> **Group:** C - Royal Express & Trance Express  
> **Document:** 02 of 02  
> **Tasks Covered:** 52, 53, 54, 55, 56, 57, 58, 59, 60

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-43-51_RoyalExpress.md](01_Tasks-43-51_RoyalExpress.md)

---

## Document Overview

This document covers the complete integration of Trance Express courier service and verification of both Royal Express and Trance Express integrations. Trance Express is a premium express delivery service focused on major cities with faster delivery times. The integration follows the same ShippingProvider pattern as Royal Express but with service-specific configurations.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 52 | Create TranceExpress Constants | Low | 15 min |
| 53 | Create TranceExpress Settings | Low | 20 min |
| 54 | Create TranceExpress Config | Medium | 30 min |
| 55 | Create TranceExpressClient | Medium | 45 min |
| 56 | Create TranceExpressProvider | High | 60 min |
| 57 | Create TranceExpress Shipment | Medium | 40 min |
| 58 | Create TranceExpress Tracking | Medium | 40 min |
| 59 | Create TranceExpress Registration | Low | 20 min |
| 60 | Verify Royal & Trance Integrations | Low | 30 min |

---

## Trance Express Service Overview

Trance Express is positioned as a premium, fast delivery service serving major urban centers in Sri Lanka. Understanding the service characteristics helps inform integration decisions.

### Service Features

| Feature | Details |
|---------|---------|
| Coverage | Major cities and urban centers |
| Delivery Time | 1-2 business days |
| Pricing | Premium rates, higher cost |
| COD Support | Yes, with faster remittance |
| Weight Limit | Up to 30 kg |
| Tracking | Real-time GPS tracking |
| API Authentication | Bearer token based |

### Target Use Cases

| Use Case | Rationale |
|----------|-----------|
| Urgent Deliveries | Fast delivery timeframe |
| High-Value Items | Premium service quality |
| Urban Destinations | Focus on major cities |
| Time-Sensitive Orders | Guaranteed delivery windows |

### API Characteristics

| Aspect | Description |
|--------|-------------|
| Base URL | `https://api.tranceexpress.lk/api/v2/` |
| Authentication | Bearer token in Authorization header |
| Format | JSON request/response |
| Rate Limit | 200 requests per minute |
| Timeout | 30 seconds recommended |
| Webhooks | Not supported (polling only) |

### Integration Flow

```
Tenant Configuration
        │
        ▼
  TranceExpress Constants
        │
        ▼
  TranceExpress Settings
        │
        ▼
   Config Model (DB)
        │
        ▼
   TranceExpressClient
        │
        ▼
 TranceExpressProvider
        │
        ├─── Create Shipment
        ├─── Track Shipment
        └─── (No Webhooks)
        │
        ▼
 Provider Registration
        │
        ▼
  Available to Tenants
```

---

## Task 52: Create TranceExpress Constants

### Overview
Create the constants module for Trance Express integration, defining all API endpoints, status codes, service types, and configuration values. These constants ensure consistency and simplify maintenance.

### Dependencies
- Task 42 (from Group B): PromptX provider registration complete
- Shipping app structure established
- Base provider classes defined

### Instructions

1. **Create trance_express directory**
   - Navigate to `backend/apps/shipping/providers/`
   - Create new directory named `trance_express`
   - This houses all Trance Express integration files

2. **Create constants file**
   - Create `constants.py` in `providers/trance_express/` directory
   - Import necessary dependencies (enum, typing)
   - Organize constants into logical sections

3. **Define API configuration constants**
   - Create `API_BASE_URL` constant pointing to Trance Express API
   - Define `API_VERSION` constant (e.g., "v2")
   - Set `DEFAULT_TIMEOUT` for HTTP requests (30 seconds)
   - Define `MAX_RETRIES` for failed requests (3 retries)

4. **Define API endpoint constants**
   - Create `ENDPOINTS` dictionary or constants
   - Include shipment creation endpoint
   - Include tracking endpoint
   - Include rate calculation endpoint
   - Include authentication/token endpoint if separate

5. **Define status mapping constants**
   - Create enum or dictionary for Trance Express statuses
   - Map Trance Express statuses to LCC ShipmentStatus
   - Include: BOOKED, PICKED_UP, IN_TRANSIT, OUT_FOR_DELIVERY, DELIVERED, CANCELLED, RETURNED

6. **Define service type constants**
   - Create enum for Trance Express service types
   - Include: EXPRESS, SAME_DAY (if available)
   - Map to pricing and delivery timeframes

7. **Define validation constants**
   - Maximum weight limit (30 kg)
   - Minimum weight (0.1 kg)
   - Maximum dimensions (length, width, height)
   - Maximum COD amount
   - Coverage area restrictions

8. **Define error code constants**
   - Map Trance Express error codes to messages
   - Include authentication errors
   - Include validation errors
   - Include service area errors

9. **Define service areas**
   - Create list or enum of covered cities
   - Include: Colombo, Gampaha, Kandy, Galle, etc.
   - Used for address validation

10. **Add documentation**
    - Document each constant group's purpose
    - Include examples where helpful
    - Note Trance Express-specific behaviors

### Constant Categories

| Category | Purpose | Examples |
|----------|---------|----------|
| API Configuration | Base URL, version, timeout | `API_BASE_URL`, `DEFAULT_TIMEOUT` |
| Endpoints | API endpoint paths | `CREATE_SHIPMENT_ENDPOINT` |
| Status Mapping | External to internal status | `STATUS_MAP` dictionary |
| Service Types | Available service options | `ServiceType` enum |
| Validation | Weight, dimension limits | `MAX_WEIGHT`, `MAX_COD_AMOUNT` |
| Error Codes | Error code to message mapping | `ERROR_MESSAGES` dictionary |
| Service Areas | Covered cities/districts | `COVERED_CITIES` list |

### API Endpoints Structure

| Endpoint Name | Path | Method | Purpose |
|---------------|------|--------|---------|
| Create Shipment | `/shipments/create` | POST | Create new shipment |
| Get Tracking | `/shipments/{id}/track` | GET | Get tracking details |
| Get Rates | `/rates/calculate` | POST | Calculate shipping rates |
| Authenticate | `/auth/token` | POST | Get access token |

### Status Mapping Example

| Trance Express Status | LCC ShipmentStatus | Description |
|----------------------|-------------------|-------------|
| `BOOKED` | `PENDING` | Shipment created |
| `PICKED_UP` | `PICKED_UP` | Collected from sender |
| `IN_HUB` | `IN_TRANSIT` | At distribution hub |
| `OUT_FOR_DELIVERY` | `OUT_FOR_DELIVERY` | On delivery route |
| `DELIVERED` | `DELIVERED` | Successfully delivered |
| `CANCELLED` | `CANCELLED` | Shipment cancelled |
| `RETURNED` | `RETURNED` | Returned to sender |

### Service Types

| Service Code | Name | Delivery Time | Cost Level |
|--------------|------|---------------|------------|
| `EXPRESS` | Express Delivery | 1-2 days | Premium |
| `SAME_DAY` | Same Day Delivery | Same day | Premium Plus |

### Validation Limits

| Limit | Value | Enforcement |
|-------|-------|-------------|
| Max Weight | 30 kg | Reject shipment creation |
| Min Weight | 0.1 kg | Reject shipment creation |
| Max Length | 150 cm | Reject shipment creation |
| Max Width | 100 cm | Reject shipment creation |
| Max Height | 100 cm | Reject shipment creation |
| Max COD | ₨750,000 | Reject if exceeded |

### Covered Cities/Districts

| Category | Cities |
|----------|--------|
| Tier 1 (Same Day) | Colombo, Mount Lavinia, Dehiwala |
| Tier 2 (Express) | Gampaha, Kandy, Negombo, Galle |
| Tier 3 (Express) | Kurunegala, Anuradhapura, Jaffna |

### Expected Outcome
- Constants module with all Trance Express configuration
- Organized, well-documented constant definitions
- Status mappings for external to internal conversion
- Validation rules and service area definitions
- Endpoint paths and API configuration centralized

### Verification Checklist
- [ ] `backend/apps/shipping/providers/trance_express/constants.py` created
- [ ] API base URL and configuration defined
- [ ] All endpoint paths defined
- [ ] Status mapping enum or dictionary created
- [ ] Service type constants defined
- [ ] Validation limits specified
- [ ] Error code mappings included
- [ ] Service areas/covered cities defined
- [ ] Documentation added for each constant group

---

## Task 53: Create TranceExpress Settings

### Overview
Create Django settings module for Trance Express integration, defining configuration variables that can be overridden in environment files. This separates environment-specific configuration from code.

### Dependencies
- Task 52: TranceExpress Constants created

### Instructions

1. **Navigate to settings directory**
   - Go to `backend/config/settings/` directory
   - Identify where integration settings are stored
   - May be in base settings or separate integrations file

2. **Create Trance Express settings section**
   - Add section header comment for Trance Express
   - Group all Trance Express settings together
   - Follow project's settings organization pattern

3. **Define API credentials settings**
   - Create `TRANCE_EXPRESS_API_KEY` setting
   - Create `TRANCE_EXPRESS_API_SECRET` setting (if required)
   - Load from environment variables with fallback
   - Mark as required for production

4. **Define API configuration settings**
   - Create `TRANCE_EXPRESS_API_URL` setting
   - Load from environment or use default from constants
   - Create `TRANCE_EXPRESS_TIMEOUT` setting
   - Create `TRANCE_EXPRESS_MAX_RETRIES` setting

5. **Define authentication settings**
   - Create `TRANCE_EXPRESS_TOKEN_EXPIRY` setting
   - Create `TRANCE_EXPRESS_AUTO_REFRESH_TOKEN` boolean
   - Define token storage strategy

6. **Define feature flags**
   - Create `TRANCE_EXPRESS_ENABLED` boolean setting
   - Create `TRANCE_EXPRESS_SANDBOX_MODE` boolean setting
   - Create `TRANCE_EXPRESS_DEBUG_LOGGING` boolean setting

7. **Define business logic settings**
   - Create `TRANCE_EXPRESS_DEFAULT_SERVICE_TYPE` setting
   - Create `TRANCE_EXPRESS_AUTO_RETRY_FAILED` boolean
   - Create `TRANCE_EXPRESS_TRACKING_POLL_INTERVAL` (minutes)

8. **Add validation settings**
   - Create `TRANCE_EXPRESS_MIN_WEIGHT` setting
   - Create `TRANCE_EXPRESS_MAX_WEIGHT` setting
   - Create `TRANCE_EXPRESS_MAX_COD_AMOUNT` setting

9. **Add environment variable documentation**
   - Document required environment variables
   - Document optional environment variables
   - Provide example values
   - Note security considerations

10. **Update .env.example file**
    - Add Trance Express environment variables
    - Include descriptions and example values
    - Mark required vs optional variables
    - Add security warnings for sensitive data

### Settings Structure

| Setting Name | Type | Source | Purpose |
|--------------|------|--------|---------|
| `TRANCE_EXPRESS_API_KEY` | string | ENV (required) | API authentication |
| `TRANCE_EXPRESS_API_SECRET` | string | ENV (required) | API secret key |
| `TRANCE_EXPRESS_API_URL` | string | ENV (optional) | Override default API URL |
| `TRANCE_EXPRESS_TIMEOUT` | int | ENV (optional) | HTTP request timeout |
| `TRANCE_EXPRESS_ENABLED` | bool | ENV (optional) | Enable/disable integration |
| `TRANCE_EXPRESS_SANDBOX_MODE` | bool | ENV (optional) | Use sandbox API |

### Environment Variables

| Variable | Example Value | Description |
|----------|---------------|-------------|
| `TRANCE_EXPRESS_API_KEY` | `tex_live_abc123xyz` | Production API key |
| `TRANCE_EXPRESS_API_SECRET` | `secret_def456uvw` | API secret key |
| `TRANCE_EXPRESS_API_URL` | `https://api.tranceexpress.lk/api/v2/` | API base URL |
| `TRANCE_EXPRESS_TIMEOUT` | `30` | Request timeout seconds |
| `TRANCE_EXPRESS_ENABLED` | `True` | Enable Trance Express |
| `TRANCE_EXPRESS_SANDBOX_MODE` | `False` | Production mode |

### Settings File Organization

```
# ============================================================================
# TRANCE EXPRESS COURIER INTEGRATION
# ============================================================================

# API Configuration
TRANCE_EXPRESS_API_KEY = env('TRANCE_EXPRESS_API_KEY', default='')
TRANCE_EXPRESS_API_SECRET = env('TRANCE_EXPRESS_API_SECRET', default='')
TRANCE_EXPRESS_API_URL = env('TRANCE_EXPRESS_API_URL', 
    default='https://api.tranceexpress.lk/api/v2/')
TRANCE_EXPRESS_TIMEOUT = env.int('TRANCE_EXPRESS_TIMEOUT', default=30)

# Feature Flags
TRANCE_EXPRESS_ENABLED = env.bool('TRANCE_EXPRESS_ENABLED', default=True)
TRANCE_EXPRESS_SANDBOX_MODE = env.bool('TRANCE_EXPRESS_SANDBOX_MODE', 
    default=False)

# Business Logic
TRANCE_EXPRESS_DEFAULT_SERVICE_TYPE = env(
    'TRANCE_EXPRESS_DEFAULT_SERVICE_TYPE', default='EXPRESS')
TRANCE_EXPRESS_TRACKING_POLL_INTERVAL = env.int(
    'TRANCE_EXPRESS_TRACKING_POLL_INTERVAL', default=15)
```

### Feature Flags Usage

| Flag | When True | When False |
|------|-----------|------------|
| `TRANCE_EXPRESS_ENABLED` | Provider available to tenants | Provider hidden |
| `TRANCE_EXPRESS_SANDBOX_MODE` | Use test API endpoints | Use production endpoints |
| `TRANCE_EXPRESS_DEBUG_LOGGING` | Log all API requests | Log errors only |
| `TRANCE_EXPRESS_AUTO_REFRESH_TOKEN` | Auto-refresh expired tokens | Manual refresh required |

### Security Considerations

| Setting | Security Level | Protection |
|---------|---------------|------------|
| API Key | High | Never commit to repo, use env vars |
| API Secret | High | Strong random string, rotate regularly |
| API URL | Low | Safe to commit default value |
| Timeout | None | No security impact |

### Expected Outcome
- Django settings configured for Trance Express
- Environment variables properly loaded
- Feature flags for flexible configuration
- Documentation for all settings
- .env.example updated with examples

### Verification Checklist
- [ ] Trance Express settings section added to settings file
- [ ] API credentials settings defined
- [ ] Authentication settings configured
- [ ] Feature flags implemented
- [ ] Validation settings added
- [ ] Environment variable documentation included
- [ ] .env.example file updated
- [ ] Security best practices followed
- [ ] All settings use env() helper for environment loading

---

## Task 54: Create TranceExpress Config Model

### Overview
Create the database model for storing tenant-specific Trance Express configuration. This allows each tenant to have their own Trance Express account credentials and settings.

### Dependencies
- Task 53: TranceExpress Settings created
- Shipping app models established
- Tenant model exists

### Instructions

1. **Navigate to shipping models**
   - Go to `backend/apps/shipping/models/` directory
   - Identify courier config models location
   - May be in dedicated courier_configs.py file

2. **Create TranceExpressConfig model class**
   - Inherit from appropriate base model
   - Use TimeStampedModel or similar base
   - Apply tenant-aware model mixins

3. **Define tenant relationship**
   - Add ForeignKey to Tenant model
   - Set on_delete=CASCADE
   - Add related_name='trance_express_configs'
   - Apply unique constraint per tenant

4. **Define credential fields**
   - Add `api_key` CharField (encrypted)
   - Add `api_secret` CharField (encrypted)
   - Mark as required fields
   - Consider using encrypted field type

5. **Define configuration fields**
   - Add `is_active` BooleanField (default=True)
   - Add `is_sandbox` BooleanField (default=False)
   - Add `default_service_type` CharField with choices
   - Add `auto_refresh_token` BooleanField (default=True)

6. **Define authentication cache fields**
   - Add `access_token` TextField (encrypted, nullable)
   - Add `token_expires_at` DateTimeField (nullable)
   - Used for caching bearer tokens

7. **Define business logic fields**
   - Add `auto_create_shipments` BooleanField
   - Add `auto_retry_failed` BooleanField
   - Add `tracking_poll_interval` IntegerField (minutes)
   - Add `notification_email` EmailField (optional)

8. **Define metadata fields**
   - Add `last_sync_at` DateTimeField (nullable)
   - Add `total_shipments` IntegerField (default=0)
   - Add `failed_shipments` IntegerField (default=0)
   - Add `notes` TextField (optional)

9. **Add Meta class**
   - Set verbose_name and verbose_name_plural
   - Add unique_together constraint on tenant
   - Define default ordering
   - Add indexes for performance

10. **Implement clean method**
    - Validate API key format
    - Validate API secret format
    - Check service type is valid
    - Validate business logic field combinations

11. **Add model methods**
    - Create `get_client()` method to return configured client
    - Create `is_configured()` method to check completeness
    - Create `get_valid_token()` method for token management
    - Create `refresh_token()` method if auto-refresh enabled
    - Create `increment_shipment_count()` method

12. **Add model properties**
    - Create `api_url` property returning correct URL
    - Create `is_ready` property checking configuration status
    - Create `token_is_valid` property checking token expiry
    - Create `display_name` property for admin

13. **Register model in admin**
    - Create admin class for TranceExpressConfig
    - Define list_display fields
    - Add search_fields and filters
    - Add readonly_fields for metadata and tokens

### Model Fields

| Field | Type | Required | Purpose |
|-------|------|----------|---------|
| `tenant` | ForeignKey | Yes | Links to tenant |
| `api_key` | CharField(encrypted) | Yes | Trance Express API key |
| `api_secret` | CharField(encrypted) | Yes | Trance Express API secret |
| `is_active` | BooleanField | Yes | Enable/disable integration |
| `is_sandbox` | BooleanField | Yes | Use test environment |
| `default_service_type` | CharField | Yes | Default shipping service |
| `access_token` | TextField(encrypted) | No | Cached bearer token |
| `token_expires_at` | DateTimeField | No | Token expiry timestamp |
| `auto_refresh_token` | BooleanField | Yes | Auto-refresh tokens |
| `auto_create_shipments` | BooleanField | Yes | Auto shipment creation |
| `tracking_poll_interval` | IntegerField | Yes | Tracking update frequency |
| `notification_email` | EmailField | No | Alert notifications |
| `last_sync_at` | DateTimeField | No | Last API sync timestamp |
| `total_shipments` | IntegerField | Yes | Shipment counter |

### Service Type Choices

| Choice Value | Display Name | Description |
|--------------|--------------|-------------|
| `EXPRESS` | Express Delivery | 1-2 business days |
| `SAME_DAY` | Same Day Delivery | Same day (major cities only) |

### Model Constraints

| Constraint | Type | Purpose |
|------------|------|---------|
| Unique Tenant | unique_together | One config per tenant |
| API Key Required | validation | Cannot be blank |
| API Secret Required | validation | Cannot be blank |

### Model Methods

| Method | Parameters | Returns | Purpose |
|--------|------------|---------|---------|
| `get_client()` | None | TranceExpressClient | Get configured HTTP client |
| `is_configured()` | None | bool | Check if fully configured |
| `get_valid_token()` | None | str | Get valid access token |
| `refresh_token()` | None | bool | Refresh access token |
| `increment_shipment_count()` | None | None | Increment counter |
| `test_connection()` | None | bool | Verify credentials |

### Model Properties

| Property | Returns | Purpose |
|----------|---------|---------|
| `api_url` | str | Get correct API URL |
| `is_ready` | bool | Check if complete and active |
| `token_is_valid` | bool | Check if token not expired |
| `display_name` | str | Human-readable identifier |

### Token Management Flow

```
get_valid_token()
        │
        ▼
  Check token_expires_at
        │
        ├─── Valid → Return access_token
        │
        └─── Expired or None
                │
                ▼
        Check auto_refresh_token
                │
                ├─── True → refresh_token()
                │               │
                │               ▼
                │           Save new token
                │               │
                │               ▼
                │        Return new token
                │
                └─── False → Return None
```

### Admin Configuration

| Admin Feature | Implementation |
|--------------|----------------|
| List Display | tenant, is_active, service_type, total_shipments |
| Search Fields | tenant__name, api_key |
| Filters | is_active, is_sandbox, default_service_type |
| Readonly Fields | access_token, token_expires_at, total_shipments |
| Actions | Test connection, refresh token |

### Expected Outcome
- Database model for tenant Trance Express configuration
- Proper field validation and constraints
- Token management methods
- Helper methods and properties
- Admin interface for configuration management
- Security measures for sensitive data

### Verification Checklist
- [ ] TranceExpressConfig model created in shipping/models/
- [ ] Tenant foreign key relationship defined
- [ ] Credential fields added with encryption
- [ ] Token cache fields implemented
- [ ] Configuration boolean fields added
- [ ] Metadata fields for tracking added
- [ ] Model Meta class configured
- [ ] clean() method validates configuration
- [ ] Token management methods implemented
- [ ] Helper methods and properties created
- [ ] Admin class registered and configured
- [ ] Migrations generated and applied

---

## Task 55: Create TranceExpressClient

### Overview
Create the HTTP client class for Trance Express API communication. This client handles bearer token authentication, request formatting, error handling, and response parsing.

### Dependencies
- Task 54: TranceExpressConfig model created
- Task 52: TranceExpress constants available

### Instructions

1. **Create client file**
   - Create `client.py` in `providers/trance_express/` directory
   - Import necessary dependencies (requests, logging, typing)
   - Import constants from constants.py

2. **Define TranceExpressClient class**
   - Create class with initialization method
   - Accept TranceExpressConfig instance in constructor
   - Store config for credential and token access

3. **Initialize client attributes**
   - Set `base_url` from config
   - Set `api_key` and `api_secret` from config
   - Set `timeout` from settings or config
   - Create requests Session for connection pooling
   - Configure session headers

4. **Implement token authentication**
   - Create `_get_access_token()` private method
   - Check if cached token is valid
   - If valid, return cached token
   - If expired/missing, call authenticate endpoint
   - Cache new token in config model
   - Return access token

5. **Implement authentication method**
   - Create `_authenticate()` private method
   - Send POST to authentication endpoint
   - Include api_key and api_secret in body
   - Parse response for access_token and expires_in
   - Calculate token_expires_at
   - Update config with token data
   - Return access token

6. **Implement headers method**
   - Create `_get_headers()` private method
   - Get valid access token
   - Format: `Authorization: Bearer {token}`
   - Include standard headers (Content-Type, Accept)

7. **Implement generic request method**
   - Create `_request()` private method
   - Accept method, endpoint, data, params
   - Build full URL
   - Get authentication headers
   - Make HTTP request with timeout
   - Handle 401 (refresh token and retry once)
   - Handle connection errors, timeouts
   - Parse JSON response
   - Raise appropriate exceptions

8. **Implement error handling**
   - Create custom exception classes
   - TranceExpressAPIError for API errors
   - TranceExpressAuthenticationError for auth failures
   - TranceExpressConnectionError for network issues
   - Parse error responses and extract messages

9. **Implement retry logic**
   - Wrap _request in retry mechanism
   - Retry on transient failures (5xx, timeouts)
   - Use exponential backoff
   - Respect MAX_RETRIES from constants
   - Log retry attempts

10. **Implement create shipment method**
    - Create `create_shipment()` public method
    - Accept shipment data dictionary
    - Validate required fields
    - Format data for Trance Express API
    - Call _request with POST to create endpoint
    - Parse response and return shipment info

11. **Implement tracking method**
    - Create `get_tracking()` public method
    - Accept shipment ID (not waybill)
    - Call _request with GET to tracking endpoint
    - Parse tracking events from response
    - Return standardized tracking data

12. **Implement rate calculation method**
    - Create `calculate_rate()` public method
    - Accept origin, destination, weight, service_type
    - Call _request with POST to rates endpoint
    - Parse rate information
    - Return pricing details

13. **Add logging**
    - Log all API requests (sanitize credentials)
    - Log token refreshes
    - Log all responses
    - Log errors with context

14. **Add docstrings**
    - Document each method's purpose
    - Document parameters and return types
    - Document exceptions raised
    - Include usage examples

### Client Class Structure

| Component | Purpose |
|-----------|---------|
| `__init__()` | Initialize client with config |
| `_authenticate()` | Get new access token |
| `_get_access_token()` | Get valid cached or new token |
| `_get_headers()` | Build authentication headers |
| `_request()` | Generic HTTP request handler |
| `create_shipment()` | Create new shipment |
| `get_tracking()` | Get tracking information |
| `calculate_rate()` | Get shipping rate quote |

### Authentication Flow

```
API Call Initiated
        │
        ▼
  _get_access_token()
        │
        ▼
  Check config.token_is_valid
        │
        ├─── Valid → Return cached token
        │
        └─── Invalid/Missing
                │
                ▼
        _authenticate()
                │
                ▼
        POST /auth/token
                │
                ▼
        Parse access_token & expires_in
                │
                ▼
        Update config model
                │
                ▼
        Return new token
```

### Authentication Headers

| Header | Value | Purpose |
|--------|-------|---------|
| `Authorization` | `Bearer {access_token}` | API authentication |
| `Content-Type` | `application/json` | Request format |
| `Accept` | `application/json` | Response format |
| `User-Agent` | `LCC-Shipping/1.0` | Client identification |

### Error Handling

| Error Type | Status Codes | Action |
|------------|--------------|--------|
| Authentication | 401 | Refresh token, retry once |
| Authorization | 403 | Raise TranceExpressAuthenticationError |
| Validation | 400, 422 | Raise TranceExpressAPIError with details |
| Not Found | 404 | Raise TranceExpressAPIError |
| Server Error | 500, 502, 503, 504 | Retry with backoff |
| Timeout | N/A | Retry with backoff |
| Connection | N/A | Raise TranceExpressConnectionError |

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
| `receiver` | object | Yes | Receiver details |
| `parcel` | object | Yes | Parcel details |
| `service` | string | Yes | Service type (EXPRESS/SAME_DAY) |
| `cod_amount` | decimal | No | COD amount |
| `merchant_ref` | string | No | Merchant reference |

### Tracking Response Format

| Field | Type | Description |
|-------|------|-------------|
| `shipment_id` | string | Trance Express shipment ID |
| `status` | string | Current status |
| `events` | array | List of tracking events |
| `estimated_delivery` | datetime | Expected delivery time |

### Expected Outcome
- HTTP client class for Trance Express API
- Bearer token authentication with caching
- Request handling with token refresh
- Error handling with retry logic
- Methods for shipment creation and tracking
- Comprehensive logging

### Verification Checklist
- [ ] `backend/apps/shipping/providers/trance_express/client.py` created
- [ ] TranceExpressClient class defined
- [ ] Client initialized with config
- [ ] Token authentication implemented
- [ ] Token caching with expiry check
- [ ] Token refresh on 401 errors
- [ ] Generic _request() method created
- [ ] Error handling and custom exceptions
- [ ] Retry logic with exponential backoff
- [ ] create_shipment() method implemented
- [ ] get_tracking() method implemented
- [ ] calculate_rate() method implemented
- [ ] Logging added to all methods
- [ ] Docstrings and type hints complete

---

## Task 56: Create TranceExpressProvider

### Overview
Create the Trance Express provider class that implements the ShippingProvider abstract base class. This provider orchestrates shipment creation and tracking using the TranceExpressClient.

### Dependencies
- Task 55: TranceExpressClient created
- ShippingProvider ABC defined
- Shipment models available

### Instructions

1. **Create provider file**
   - Create `provider.py` in `providers/trance_express/` directory
   - Import ShippingProvider ABC
   - Import TranceExpressClient and related classes

2. **Define TranceExpressProvider class**
   - Inherit from ShippingProvider ABC
   - Implement all required abstract methods
   - Add Trance Express-specific methods

3. **Implement __init__ method**
   - Accept tenant parameter
   - Load TranceExpressConfig for tenant
   - Initialize TranceExpressClient with config
   - Cache config and client

4. **Implement provider metadata methods**
   - `get_provider_name()` returns "Trance Express"
   - `get_provider_code()` returns "trance_express"

5. **Implement is_available method**
   - Check if config exists for tenant
   - Check if config.is_active is True
   - Verify credentials are present
   - Return boolean availability status

6. **Implement calculate_rate method**
   - Accept origin, destination, weight, dimensions, service_type
   - Validate destination is in covered areas
   - Call client.calculate_rate()
   - Parse response and extract pricing
   - Return Rate object

7. **Implement create_shipment method**
   - Accept Shipment model instance
   - Validate shipment data
   - Validate destination is in coverage area
   - Transform shipment to Trance Express format
   - Call client.create_shipment()
   - Parse response for shipment_id and status
   - Update shipment model
   - Save to database
   - Return updated shipment

8. **Implement track_shipment method**
   - Accept shipment_id or waybill
   - Call client.get_tracking()
   - Parse tracking events
   - Transform to LCC format
   - Create or update ShipmentTracking records
   - Return list of tracking events

9. **Implement cancel_shipment method**
   - Accept shipment
   - Call Trance Express cancel API (if available)
   - Update shipment status
   - Return success boolean

10. **Implement validate_address method**
    - Accept address data
    - Check if city/district is in covered areas
    - Validate address completeness
    - Return validation result with errors

11. **Add data transformation methods**
    - `_transform_shipment_to_api()` private method
    - `_transform_tracking_from_api()` private method
    - `_map_status()` private method

12. **Add validation methods**
    - `_validate_shipment_data()` method
    - `_validate_coverage_area()` method
    - Check required fields
    - Validate weight and dimensions
    - Raise ValidationError for issues

13. **Add error handling**
    - Wrap API calls in try-except blocks
    - Log errors appropriately
    - Raise meaningful exceptions
    - Maintain shipment status consistency

14. **Add logging**
    - Log shipment creation attempts
    - Log tracking requests
    - Include tenant and shipment context

### Provider Methods

| Method | Abstract | Parameters | Returns | Purpose |
|--------|----------|------------|---------|---------|
| `get_provider_name()` | Yes | None | str | Display name |
| `get_provider_code()` | Yes | None | str | Unique code |
| `is_available()` | Yes | tenant | bool | Check availability |
| `calculate_rate()` | Yes | origin, destination, weight | Rate | Get shipping cost |
| `create_shipment()` | Yes | shipment | Shipment | Create shipment |
| `track_shipment()` | Yes | shipment_id | List[TrackingEvent] | Get tracking |
| `cancel_shipment()` | Yes | shipment | bool | Cancel shipment |
| `validate_address()` | No | address | ValidationResult | Verify address |
| `_validate_coverage_area()` | No | address | bool | Check coverage |

### Shipment Creation Flow

```
create_shipment(shipment)
        │
        ▼
  Validate Shipment Data
        │
        ▼
  Validate Coverage Area
        │
        ├─── Outside Coverage → Raise ValidationError
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
        │   Extract shipment_id
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

### Coverage Area Validation

```
_validate_coverage_area(address)
        │
        ▼
  Extract city/district from address
        │
        ▼
  Check against COVERED_CITIES constant
        │
        ├─── Found → Return True
        │
        └─── Not Found
                │
                ▼
            Raise ValidationError
            "Trance Express does not cover this area"
```

### Status Mapping

| Trance Express Status | LCC Status | Trigger Notification |
|----------------------|-----------|---------------------|
| `BOOKED` | `PENDING` | No |
| `PICKED_UP` | `PICKED_UP` | Yes |
| `IN_HUB` | `IN_TRANSIT` | No |
| `OUT_FOR_DELIVERY` | `OUT_FOR_DELIVERY` | Yes |
| `DELIVERED` | `DELIVERED` | Yes |
| `CANCELLED` | `CANCELLED` | Yes |
| `RETURNED` | `RETURNED` | Yes |

### Error Scenarios

| Scenario | Action | Impact |
|----------|--------|--------|
| Config Not Found | Raise ProviderNotConfigured | Cannot use provider |
| Outside Coverage | Raise ValidationError | Show area restriction |
| Invalid Credentials | Raise AuthenticationError | Must reconfigure |
| API Error | Log and raise APIError | Shipment creation fails |
| Network Timeout | Retry then raise | Temporary failure |

### Expected Outcome
- Full ShippingProvider implementation for Trance Express
- Shipment creation with coverage validation
- Tracking with event history
- Proper error handling and logging
- Data transformation between formats

### Verification Checklist
- [ ] `backend/apps/shipping/providers/trance_express/provider.py` created
- [ ] TranceExpressProvider inherits from ShippingProvider
- [ ] All abstract methods implemented
- [ ] Provider metadata methods return correct values
- [ ] is_available() checks config properly
- [ ] calculate_rate() with coverage validation
- [ ] create_shipment() creates shipments via API
- [ ] Coverage area validation implemented
- [ ] track_shipment() fetches and transforms tracking
- [ ] cancel_shipment() method implemented
- [ ] Data transformation methods created
- [ ] Validation methods implemented
- [ ] Error handling comprehensive
- [ ] Logging added throughout

---

## Task 57: Create TranceExpress Shipment Method

### Overview
Enhance the create_shipment implementation in TranceExpressProvider with comprehensive shipment creation logic, including coverage validation, data formatting, and error handling.

### Dependencies
- Task 56: TranceExpressProvider created with basic structure

### Instructions

1. **Review create_shipment method signature**
   - Confirm method accepts Shipment model instance
   - Verify return type is updated Shipment

2. **Implement validation**
   - Call _validate_shipment_data()
   - Validate sender address completeness
   - Validate receiver address completeness
   - Validate package weight within limits (0.1-30 kg)
   - Validate dimensions if provided
   - Validate COD amount if applicable

3. **Implement coverage validation**
   - Extract destination city/district
   - Call _validate_coverage_area()
   - Check against COVERED_CITIES
   - Raise ValidationError if outside coverage
   - Include list of covered areas in error message

4. **Implement address formatting**
   - Create _format_address() helper
   - Extract and format address fields
   - Format phone numbers to +94 format
   - Handle missing optional fields

5. **Build shipment request payload**
   - Create dictionary with shipment data
   - Map sender to API format (sender object)
   - Map receiver to API format (receiver object)
   - Map package to API format (parcel object)
   - Include service type
   - Include COD amount if applicable
   - Include merchant reference

6. **Make API call**
   - Wrap client.create_shipment() in try-except
   - Pass formatted payload
   - Handle TranceExpressAPIError
   - Handle authentication errors
   - Handle connection errors

7. **Parse API response**
   - Extract shipment_id from response
   - Extract tracking URL (if provided)
   - Extract initial status
   - Extract estimated delivery date
   - Validate response completeness

8. **Update shipment model**
   - Set shipment.waybill to shipment_id
   - Set shipment.tracking_url
   - Map API status to ShipmentStatus
   - Set shipment.status
   - Set shipment.provider_response (JSON)
   - Set shipment.created_at_provider

9. **Create initial tracking event**
   - Create ShipmentTracking instance
   - Set shipment foreign key
   - Set status to current status
   - Set event_time to current time
   - Set description
   - Set raw_data
   - Save tracking event

10. **Save shipment**
    - Call shipment.save()
    - Handle database errors
    - Use transaction if supported

11. **Update config statistics**
    - Call config.increment_shipment_count()
    - Update config.last_sync_at
    - Save config

12. **Add logging**
    - Log shipment creation start
    - Log coverage validation result
    - Log API request (sanitized)
    - Log API response summary
    - Log completion

13. **Implement error recovery**
    - On validation error, mark shipment FAILED
    - On coverage error, mark shipment FAILED
    - On API error, mark PENDING_RETRY
    - Store error message in shipment.notes
    - Re-raise exception after cleanup

14. **Return shipment**
    - Return updated shipment model

### Validation Rules

| Field | Validation | Error Message |
|-------|------------|---------------|
| Sender Name | Required, min 2 chars | "Sender name is required" |
| Sender Phone | Required, valid format | "Valid sender phone required" |
| Sender Address | Required, min 10 chars | "Complete sender address required" |
| Receiver Name | Required, min 2 chars | "Receiver name is required" |
| Receiver Phone | Required, valid format | "Valid receiver phone required" |
| Receiver Address | Required, min 10 chars | "Complete receiver address required" |
| Receiver City | Must be in covered areas | "Trance Express does not cover {city}" |
| Weight | Required, 0.1-30 kg | "Weight must be between 0.1kg and 30kg" |
| COD Amount | If COD, max ₨750,000 | "COD amount exceeds maximum" |

### Coverage Validation

| City/District | Service Available | Service Type |
|---------------|------------------|--------------|
| Colombo | Yes | EXPRESS, SAME_DAY |
| Mount Lavinia | Yes | EXPRESS, SAME_DAY |
| Gampaha | Yes | EXPRESS |
| Kandy | Yes | EXPRESS |
| Negombo | Yes | EXPRESS |
| Galle | Yes | EXPRESS |
| Other areas | Check COVERED_CITIES | EXPRESS |

### Request Payload Structure

| Field | Type | Example |
|-------|------|---------|
| `sender.name` | string | "XYZ Store" |
| `sender.phone` | string | "+94712345678" |
| `sender.address` | string | "123 Main St, Colombo" |
| `receiver.name` | string | "Jane Doe" |
| `receiver.phone` | string | "+94771234567" |
| `receiver.address` | string | "456 Galle Rd, Colombo" |
| `parcel.weight` | number | 3.5 |
| `parcel.description` | string | "Electronics" |
| `service` | string | "EXPRESS" |
| `cod_amount` | number | 7500.00 |
| `merchant_ref` | string | "SHIP-67890" |

### Expected Outcome
- Robust shipment creation with coverage validation
- API integration with error handling
- Database persistence
- Comprehensive logging

### Verification Checklist
- [ ] create_shipment() fully implemented
- [ ] Validation checks all required fields
- [ ] Coverage area validation performed
- [ ] Address formatting handles various inputs
- [ ] Request payload properly structured
- [ ] API call wrapped in error handling
- [ ] Response parsing extracts all fields
- [ ] Shipment model updated
- [ ] Initial tracking event created
- [ ] Config statistics incremented
- [ ] Errors handled and logged
- [ ] Shipment returned successfully

---

## Task 58: Create TranceExpress Tracking Method

### Overview
Implement comprehensive tracking functionality in the TranceExpressProvider, enabling retrieval of shipment status and tracking history from the Trance Express API.

### Dependencies
- Task 56: TranceExpressProvider created
- ShipmentTracking model available

### Instructions

1. **Review track_shipment method signature**
   - Accept shipment_id or waybill parameter
   - Return list of TrackingEvent objects

2. **Implement input validation**
   - Check shipment_id is not empty
   - Validate format if applicable

3. **Retrieve shipment from database**
   - Query Shipment by waybill/shipment_id
   - Filter by current tenant
   - Handle shipment not found

4. **Make tracking API call**
   - Wrap client.get_tracking() in try-except
   - Pass shipment_id to client
   - Handle API errors
   - Log request and response

5. **Parse tracking response**
   - Extract current status
   - Extract tracking events array
   - Extract estimated delivery
   - Validate response structure

6. **Transform tracking events**
   - Iterate through API events
   - Map status to LCC status
   - Parse event timestamp
   - Extract location and description
   - Create TrackingEvent objects

7. **Update shipment status**
   - Compare API status with shipment.status
   - If different, update shipment.status
   - Map status using _map_status()
   - Save shipment if changed

8. **Persist tracking events**
   - For each new event, check if exists
   - Create ShipmentTracking record if new
   - Set all required fields
   - Save tracking record

9. **Handle status change notifications**
   - If status changed to key statuses, notify
   - Use notification system
   - Log notification dispatch

10. **Update config metadata**
    - Update config.last_sync_at
    - Save config

11. **Return tracking events**
    - Return list of TrackingEvent objects
    - Order by event_time ascending

12. **Add error handling**
    - Handle shipment_id not found (404)
    - Handle API errors
    - Log errors with context
    - Return partial data if possible

### Tracking Data Flow

```
track_shipment(shipment_id)
        │
        ▼
  Validate shipment_id
        │
        ▼
  Find Shipment in DB
        │
        ▼
  Call client.get_tracking(shipment_id)
        │
        ▼
  Parse API Response
        │
        ▼
  Transform Events
        │
        ▼
  Update Shipment Status
        │
        ▼
  Create New ShipmentTracking Records
        │
        ▼
  Trigger Notifications
        │
        ▼
  Return TrackingEvent List
```

### Status Mapping for Tracking

| Trance Express Status | LCC Status | Notification |
|----------------------|-----------|--------------|
| `BOOKED` | `PENDING` | No |
| `PICKED_UP` | `PICKED_UP` | Yes |
| `IN_HUB` | `IN_TRANSIT` | No |
| `OUT_FOR_DELIVERY` | `OUT_FOR_DELIVERY` | Yes |
| `DELIVERED` | `DELIVERED` | Yes |
| `CANCELLED` | `CANCELLED` | Yes |
| `RETURNED` | `RETURNED` | Yes |

### Expected Outcome
- Tracking retrieval from Trance Express API
- Event parsing and transformation
- Database persistence of tracking events
- Status updates and notifications

### Verification Checklist
- [ ] track_shipment() fully implemented
- [ ] Shipment_id validation performed
- [ ] Shipment retrieved from database
- [ ] API call via client.get_tracking()
- [ ] Response parsed and validated
- [ ] Events transformed to LCC format
- [ ] Status mapping applied
- [ ] New ShipmentTracking records created
- [ ] Duplicate events handled
- [ ] Shipment status updated
- [ ] Notifications triggered
- [ ] Config updated
- [ ] Errors handled gracefully
- [ ] Returns list of events

---

## Task 59: Create TranceExpress Provider Registration

### Overview
Register the TranceExpressProvider with the LCC shipping provider factory/registry, making it available for tenant configuration and use.

### Dependencies
- Task 56: TranceExpressProvider fully implemented
- CourierFactory or provider registry exists

### Instructions

1. **Locate provider registry**
   - Find CourierFactory or provider registry module
   - Typically in `backend/apps/shipping/providers/`

2. **Import TranceExpressProvider**
   - Add import statement
   - Import from `providers.trance_express.provider`

3. **Register provider**
   - Use factory registration method
   - Register with key `"trance_express"`
   - Map to TranceExpressProvider class

4. **Update provider list**
   - Add Trance Express to AVAILABLE_PROVIDERS
   - Include display name, description, features
   - Include coverage information
   - Include pricing tier (premium)

5. **Add provider metadata**
   - Define capabilities
   - Tracking support: Yes
   - COD support: Yes
   - Webhook support: No
   - Coverage: Major cities

6. **Update documentation**
   - Add Trance Express to provider docs
   - Include integration guide
   - Document coverage limitations

7. **Create admin display**
   - Ensure appears in admin provider list
   - Add logo/icon
   - Configure display settings

8. **Add to tenant configuration UI**
   - Ensure appears in tenant settings
   - Provide configuration form
   - Include credential input fields

9. **Update provider selection logic**
   - Available in provider dropdowns
   - Include in shipment creation
   - Include in rate comparison

### Provider Registry Structure

```python
COURIER_PROVIDERS = {
    'koombiyo': KoombiyoProvider,
    'domex': DomexProvider,
    'promptx': PromptXProvider,
    'royal_express': RoyalExpressProvider,
    'trance_express': TranceExpressProvider,  # New
}
```

### Provider Metadata

| Field | Value |
|-------|-------|
| `code` | `trance_express` |
| `name` | `Trance Express` |
| `description` | `Premium express delivery for major cities` |
| `coverage` | `Major cities only` |
| `delivery_time` | `1-2 business days` |
| `pricing_tier` | `Premium` |
| `tracking_support` | `True` |
| `cod_support` | `True` |
| `webhook_support` | `False` |
| `requires_account` | `True` |

### Provider Capabilities

| Capability | Supported |
|------------|-----------|
| Create Shipment | ✓ |
| Track Shipment | ✓ |
| Cancel Shipment | ✓ |
| Calculate Rate | ✓ |
| Validate Address | ✓ |
| Webhooks | ✗ |
| Coverage Validation | ✓ |

### Expected Outcome
- Trance Express provider registered
- Available for tenant configuration
- Appears in admin and frontend
- Fully integrated with shipping system

### Verification Checklist
- [ ] TranceExpressProvider imported in registry
- [ ] Provider registered with key "trance_express"
- [ ] Added to AVAILABLE_PROVIDERS list
- [ ] Provider metadata defined
- [ ] Capabilities documented
- [ ] Admin integration complete
- [ ] Frontend shows provider option
- [ ] Configuration form accessible
- [ ] Provider selectable for shipments
- [ ] Integration tests pass

---

## Task 60: Verify Royal Express & Trance Express Integrations

### Overview
Perform comprehensive verification of both Royal Express and Trance Express integrations to ensure all components work correctly, are properly integrated, and meet quality standards.

### Dependencies
- Task 51: Royal Express registration complete
- Task 59: Trance Express registration complete

### Instructions

1. **Verify code structure**
   - Check all files created for Royal Express
   - Check all files created for Trance Express
   - Verify directory structure is correct
   - Ensure __init__.py files exist

2. **Verify constants modules**
   - Review Royal Express constants
   - Review Trance Express constants
   - Ensure all required constants defined
   - Check status mappings are correct

3. **Verify settings configuration**
   - Review Royal Express settings
   - Review Trance Express settings
   - Check environment variables in .env.example
   - Verify security best practices

4. **Verify database models**
   - Check RoyalExpressConfig model
   - Check TranceExpressConfig model
   - Verify fields and constraints
   - Ensure migrations applied

5. **Verify HTTP clients**
   - Review RoyalExpressClient implementation
   - Review TranceExpressClient implementation
   - Check authentication methods
   - Verify error handling

6. **Verify provider implementations**
   - Check RoyalExpressProvider methods
   - Check TranceExpressProvider methods
   - Ensure all abstract methods implemented
   - Verify data transformations

7. **Verify webhook handler (Royal Express)**
   - Check webhook URL routing
   - Verify signature verification
   - Test webhook processing logic
   - Ensure proper error handling

8. **Verify provider registrations**
   - Check both providers in registry
   - Verify provider codes unique
   - Ensure metadata correct
   - Check admin integration

9. **Test admin interfaces**
   - Access Royal Express config in admin
   - Access Trance Express config in admin
   - Test creating config records
   - Verify readonly fields

10. **Test provider availability**
    - Create test tenant
    - Configure Royal Express
    - Configure Trance Express
    - Verify providers appear as available

11. **Test shipment creation**
    - Create test shipment with Royal Express
    - Create test shipment with Trance Express
    - Verify API calls made correctly
    - Check database records created

12. **Test tracking functionality**
    - Test Royal Express tracking
    - Test Trance Express tracking
    - Verify tracking events created
    - Check status updates

13. **Test error scenarios**
    - Test invalid credentials
    - Test network errors
    - Test validation errors
    - Verify error handling

14. **Test coverage validation (Trance Express)**
    - Test address in covered area
    - Test address outside coverage
    - Verify error messages

15. **Review logging**
    - Check log output for Royal Express
    - Check log output for Trance Express
    - Verify sensitive data sanitized
    - Ensure appropriate log levels

16. **Review documentation**
    - Check inline code comments
    - Verify docstrings complete
    - Review admin help text
    - Check integration guides

17. **Run automated tests**
    - Run unit tests for clients
    - Run unit tests for providers
    - Run integration tests
    - Check test coverage

18. **Performance testing**
    - Test API call performance
    - Check database query efficiency
    - Verify caching works (Trance Express tokens)
    - Monitor resource usage

19. **Security review**
    - Verify credentials encrypted
    - Check webhook signature verification
    - Review authentication flows
    - Ensure no sensitive data in logs

20. **Final checklist**
    - All files created and organized
    - All models migrated
    - All providers registered
    - Admin interfaces functional
    - Frontend integration working
    - Tests passing
    - Documentation complete
    - Ready for production use

### Verification Checklist Matrix

| Component | Royal Express | Trance Express |
|-----------|---------------|----------------|
| Constants | ✓ | ✓ |
| Settings | ✓ | ✓ |
| Config Model | ✓ | ✓ |
| HTTP Client | ✓ | ✓ |
| Provider Class | ✓ | ✓ |
| Shipment Creation | ✓ | ✓ |
| Tracking | ✓ | ✓ |
| Webhook Handler | ✓ | N/A |
| Registration | ✓ | ✓ |
| Admin Interface | ✓ | ✓ |
| Tests | ✓ | ✓ |
| Documentation | ✓ | ✓ |

### File Structure Verification

```
backend/apps/shipping/providers/
├── royal_express/
│   ├── __init__.py ✓
│   ├── constants.py ✓
│   ├── config.py ✓
│   ├── client.py ✓
│   ├── provider.py ✓
│   └── webhooks.py ✓
├── trance_express/
│   ├── __init__.py ✓
│   ├── constants.py ✓
│   ├── config.py ✓
│   ├── client.py ✓
│   └── provider.py ✓
└── __init__.py ✓ (registry updated)
```

### Test Cases to Verify

| Test Case | Royal Express | Trance Express |
|-----------|---------------|----------------|
| Provider registration | Pass | Pass |
| Config creation | Pass | Pass |
| API authentication | Pass | Pass |
| Shipment creation (valid) | Pass | Pass |
| Shipment creation (invalid) | Fail gracefully | Fail gracefully |
| Coverage validation | N/A | Pass/Fail correctly |
| Tracking (existing) | Pass | Pass |
| Tracking (not found) | Fail gracefully | Fail gracefully |
| Webhook processing | Pass | N/A |
| Token refresh | N/A | Pass |
| Error handling | Pass | Pass |

### Integration Points to Verify

| Integration Point | Description | Status |
|------------------|-------------|--------|
| Provider Registry | Both providers registered | ✓ |
| Admin Interface | Both configs accessible | ✓ |
| Tenant Settings | Both providers selectable | ✓ |
| Shipment Creation | Both providers work | ✓ |
| Rate Comparison | Both providers included | ✓ |
| Tracking UI | Both providers supported | ✓ |
| Notification System | Integrates correctly | ✓ |

### Common Issues to Check

| Issue | Check | Resolution |
|-------|-------|------------|
| Import errors | All imports resolve | Fix import paths |
| Missing migrations | Migrations applied | Run makemigrations & migrate |
| Config not found | Model created properly | Check foreign keys |
| API auth fails | Credentials correct | Verify settings |
| Token not cached | Token save logic | Check config.save() |
| Webhook fails | Signature verification | Check secret configuration |
| Coverage error | City list correct | Update COVERED_CITIES |

### Expected Outcome
- Both Royal Express and Trance Express fully functional
- All components properly integrated
- Tests passing
- Documentation complete
- Ready for production deployment

### Verification Checklist
- [ ] All Royal Express files created and verified
- [ ] All Trance Express files created and verified
- [ ] Constants modules complete
- [ ] Settings configured correctly
- [ ] Database models migrated
- [ ] HTTP clients functional
- [ ] Provider implementations complete
- [ ] Webhook handler working (Royal Express)
- [ ] Both providers registered
- [ ] Admin interfaces accessible
- [ ] Shipment creation tested
- [ ] Tracking functionality tested
- [ ] Error handling verified
- [ ] Coverage validation tested (Trance Express)
- [ ] Logging reviewed
- [ ] Documentation complete
- [ ] Automated tests passing
- [ ] Security review done
- [ ] Performance acceptable
- [ ] Ready for production

---

## Summary

This document completed the Trance Express courier integration and verified both Royal Express and Trance Express integrations. All courier providers in Group C are now fully implemented, tested, and ready for production use.

### Completed Tasks
1. ✓ Created Trance Express constants and configuration
2. ✓ Created Django settings for Trance Express
3. ✓ Created database config model for tenant credentials
4. ✓ Created HTTP client with bearer token authentication
5. ✓ Created provider class implementing ShippingProvider
6. ✓ Implemented shipment creation with coverage validation
7. ✓ Implemented tracking functionality
8. ✓ Registered provider in shipping system
9. ✓ Verified both Royal Express and Trance Express integrations

### Group C Summary
- **Royal Express:** Budget-friendly, island-wide coverage, webhook support
- **Trance Express:** Premium express, major cities only, no webhooks
- Both providers fully integrated with LCC shipping system
- Both ready for tenant configuration and use

### Next Steps
Proceed to Group D documentation for courier comparison and selection features.
