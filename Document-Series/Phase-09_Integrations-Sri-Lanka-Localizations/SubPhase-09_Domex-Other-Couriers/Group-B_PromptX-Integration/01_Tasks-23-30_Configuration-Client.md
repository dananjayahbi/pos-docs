# Tasks 23-30: PromptX Configuration and API Client

> **Phase:** 09 - Integrations & Sri Lanka Localizations  
> **SubPhase:** 09 - Domex & Other Couriers  
> **Group:** B - PromptX Integration  
> **Document:** 01 of 02  
> **Tasks Covered:** 23, 24, 25, 26, 27, 28, 29, 30

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-31-42_Provider-Webhook-Verify.md](02_Tasks-31-42_Provider-Webhook-Verify.md)

---

## Document Overview

This document covers the configuration and API client setup for Prompt X courier integration. It establishes the foundational components including constants, Django settings, configuration models, client class with authentication and request handling, and comprehensive error handling for the PromptX API.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 23 | Create PromptX Constants | Low | 20 min |
| 24 | Create PromptX Settings | Low | 15 min |
| 25 | Create PromptX API Key | Low | 10 min |
| 26 | Create PromptXConfig Model | Medium | 30 min |
| 27 | Create PromptXClient Class | Medium | 35 min |
| 28 | Create PromptX Auth | Low | 20 min |
| 29 | Create PromptX Requests | Medium | 30 min |
| 30 | Create PromptX Errors | Medium | 25 min |

---

## Task 23: Create PromptX Constants

### Overview
Create the constants module for Prompt X API integration. Define all API URLs, endpoints, and configuration constants used throughout the PromptX provider. Centralizing constants ensures consistency and simplifies API endpoint management.

### Dependencies
- Task 22: Verify Domex Integration (from Group-A)
- SubPhase-09 foundation must be complete

### Instructions

1. **Create provider package structure**
   - Navigate to `backend/apps/shipping/providers/` directory
   - Create new directory named `promptx`
   - Create `__init__.py` file for Python package initialization

2. **Create constants file**
   - Create `constants.py` in `promptx/` directory
   - Import necessary typing modules
   - Add module docstring explaining purpose

3. **Define API base URL constant**
   - Define `PROMPTX_API_BASE_URL` constant
   - Set value to PromptX production API URL
   - Add inline comment with staging URL for reference

4. **Define API version constant**
   - Define `PROMPTX_API_VERSION` constant
   - Set current API version (e.g., "v1", "v2")
   - Document version upgrade path if applicable

5. **Create endpoints dictionary**
   - Define `PROMPTX_ENDPOINTS` dictionary
   - Include all PromptX API endpoint paths
   - Group endpoints by functionality

6. **Define authentication constants**
   - Define `PROMPTX_AUTH_TYPE` (Bearer, API Key, etc.)
   - Define `PROMPTX_AUTH_HEADER` name
   - Define token expiry settings if applicable

7. **Define request configuration**
   - Define `PROMPTX_TIMEOUT` for API requests (30 seconds)
   - Define `PROMPTX_MAX_RETRIES` for failed requests
   - Define `PROMPTX_RETRY_DELAY` between attempts

8. **Define service area constants**
   - Define `PROMPTX_SERVICE_AREAS` for Colombo Metro coverage
   - Define `PROMPTX_POSTAL_CODES` for supported areas
   - Define same-day cutoff time (2:00 PM)

9. **Define business logic constants**
   - Define minimum and maximum weight limits
   - Define dimension constraints
   - Define COD maximum amount if applicable

10. **Add status code mappings**
    - Define `PROMPTX_STATUS_CODES` dictionary
    - Map PromptX status strings to internal codes
    - Include all possible shipment statuses

### Constants Structure

| Category | Constants | Purpose |
|----------|-----------|---------|
| API Configuration | Base URL, Version, Timeout | Core API setup |
| Endpoints | Shipment, Rates, Tracking, Cancel | API paths |
| Authentication | Auth type, Header name | Auth setup |
| Service Area | Postal codes, Zones, Cutoff | Coverage definition |
| Limits | Weight, Dimensions, COD | Business rules |
| Status Mapping | Status codes | State management |

### Endpoint Categories

```
Shipment Endpoints
├── CREATE_SHIPMENT
├── GET_SHIPMENT
├── CANCEL_SHIPMENT
└── GET_WAYBILL

Rate Endpoints
├── GET_RATE_QUOTE
└── GET_SERVICE_AVAILABILITY

Tracking Endpoints
├── TRACK_SHIPMENT
├── GET_POD
└── GET_DELIVERY_HISTORY

Webhook Endpoints
├── WEBHOOK_RECEIVER
└── WEBHOOK_VERIFY
```

### Service Area Coverage

| Zone | Areas | Same-Day Eligible |
|------|-------|-------------------|
| Colombo Central | Colombo 01-09 | Yes |
| Colombo Suburbs | Colombo 10-15 | Yes |
| Greater Colombo | Selected suburbs | Conditional |

### Weight and Dimension Limits

| Limit Type | Value | Unit | Enforced By |
|------------|-------|------|-------------|
| Min Weight | 0.1 | kg | Validation |
| Max Weight | 25.0 | kg | API |
| Max Length | 120 | cm | API |
| Max Combined | 200 | cm | API (L+W+H) |

### Request Configuration

| Setting | Value | Purpose |
|---------|-------|---------|
| Timeout | 30 seconds | Prevent hanging |
| Max Retries | 3 | Handle transient failures |
| Retry Delay | 2 seconds | Avoid rate limiting |
| Connection Pool | 10 | Reuse connections |

### Status Code Mapping

| PromptX Status | Internal Status | Description |
|----------------|-----------------|-------------|
| PENDING | PENDING | Order created |
| CONFIRMED | CONFIRMED | Booking confirmed |
| PICKED | PICKED_UP | Picked from sender |
| INTRANSIT | IN_TRANSIT | In delivery network |
| OUT_DELIVERY | OUT_FOR_DELIVERY | Out for delivery |
| DELIVERED | DELIVERED | Successfully delivered |
| FAILED | DELIVERY_FAILED | Delivery attempt failed |
| RETURNED | RETURNED | Returned to sender |
| CANCELLED | CANCELLED | Booking cancelled |

### Same-Day Delivery Configuration

| Parameter | Value | Notes |
|-----------|-------|-------|
| Cutoff Time | 14:00 | 2:00 PM local time |
| Timezone | Asia/Colombo | UTC+5:30 |
| Operating Days | Mon-Sat | No Sunday delivery |
| Holiday Check | Required | Check holiday calendar |

### Expected Outcome
- Complete constants module for PromptX integration
- All API endpoints defined and organized
- Service area and business rules documented
- Status mappings for state transitions

### Verification Checklist
- [ ] `backend/apps/shipping/providers/promptx/__init__.py` created
- [ ] `backend/apps/shipping/providers/promptx/constants.py` created
- [ ] API base URL and version defined
- [ ] All endpoints dictionary populated
- [ ] Authentication constants defined
- [ ] Request configuration constants set
- [ ] Service area constants defined
- [ ] Weight and dimension limits specified
- [ ] Status code mapping complete
- [ ] Same-day delivery settings configured

---

## Task 24: Create PromptX Settings

### Overview
Create Django settings configuration for PromptX integration. Define settings file with environment-based configuration for API credentials, feature flags, and provider-specific settings. This separates PromptX configuration from core application settings.

### Dependencies
- Task 23: Create PromptX Constants

### Instructions

1. **Create settings directory structure**
   - Navigate to `backend/config/settings/` directory
   - Create `integrations/` subdirectory if not exists
   - Organize integration-specific settings

2. **Create PromptX settings file**
   - Create `promptx.py` in `settings/integrations/` directory
   - Import Django settings utilities
   - Import environment variable helpers

3. **Define enabled flag**
   - Create `PROMPTX_ENABLED` setting
   - Read from environment variable
   - Default to False for safety

4. **Define test mode flag**
   - Create `PROMPTX_TEST_MODE` setting
   - Allow testing without real API calls
   - Read from environment variable

5. **Define sandbox mode**
   - Create `PROMPTX_SANDBOX` setting
   - Toggle between production and sandbox API
   - Default to True in development

6. **Configure webhook settings**
   - Define `PROMPTX_WEBHOOK_SECRET` for signature verification
   - Define `PROMPTX_WEBHOOK_PATH` for URL routing
   - Define webhook retry configuration

7. **Set notification preferences**
   - Define email notification settings
   - Define SMS notification toggle
   - Configure notification templates

8. **Configure logging settings**
   - Define `PROMPTX_LOG_REQUESTS` for debugging
   - Define `PROMPTX_LOG_RESPONSES` setting
   - Set log level for PromptX operations

9. **Define cache settings**
   - Configure rate quote caching duration
   - Configure service availability caching
   - Define cache key prefixes

10. **Import settings in main config**
    - Import PromptX settings in main settings file
    - Add to INSTALLED_APPS if needed
    - Document setting dependencies

### Settings Categories

| Category | Settings | Purpose |
|----------|----------|---------|
| Feature Flags | ENABLED, TEST_MODE, SANDBOX | Control provider |
| Webhooks | SECRET, PATH, RETRY | Webhook handling |
| Notifications | EMAIL, SMS, TEMPLATES | User alerts |
| Logging | LOG_REQUESTS, LOG_LEVEL | Debugging |
| Caching | CACHE_DURATION, PREFIXES | Performance |

### Environment Variables Required

| Variable | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| PROMPTX_ENABLED | Boolean | No | False | Enable provider |
| PROMPTX_SANDBOX | Boolean | No | True | Use sandbox API |
| PROMPTX_TEST_MODE | Boolean | No | False | Mock API calls |
| PROMPTX_WEBHOOK_SECRET | String | Yes | - | Webhook verification |
| PROMPTX_LOG_REQUESTS | Boolean | No | False | Log API requests |

### Settings Structure

```
PROMPTX Configuration
├── Feature Flags
│   ├── ENABLED
│   ├── TEST_MODE
│   └── SANDBOX
├── API Configuration
│   ├── BASE_URL (from constants)
│   ├── TIMEOUT (from constants)
│   └── MAX_RETRIES (from constants)
├── Webhook Configuration
│   ├── SECRET
│   ├── PATH
│   └── RETRY_CONFIG
├── Notification Settings
│   ├── EMAIL_NOTIFICATIONS
│   ├── SMS_NOTIFICATIONS
│   └── TEMPLATES
└── Performance Settings
    ├── CACHE_DURATION
    └── LOG_LEVEL
```

### Test Mode Behavior

| Operation | Real Mode | Test Mode |
|-----------|-----------|-----------|
| Create Shipment | API call | Mock response |
| Get Rates | API call | Fixed test rates |
| Track Shipment | API call | Mock tracking |
| Cancel Shipment | API call | Mock success |
| Webhook | Process | Log only |

### Webhook Configuration

| Setting | Value | Purpose |
|---------|-------|---------|
| Path | /api/webhooks/promptx/ | Webhook receiver URL |
| Secret | From environment | Signature verification |
| Max Retries | 3 | Failed webhook delivery |
| Retry Delay | 300 seconds | Wait between retries |

### Cache Duration Settings

| Item | Duration | Reason |
|------|----------|--------|
| Rate Quotes | 300 seconds | Rates change slowly |
| Service Availability | 600 seconds | Rarely changes |
| Tracking Status | 60 seconds | Updates frequently |

### Logging Configuration

| Log Level | When to Use | What to Log |
|-----------|-------------|-------------|
| DEBUG | Development | All requests/responses |
| INFO | Staging | Important operations |
| WARNING | Production | Issues and errors |
| ERROR | Always | Failures only |

### Expected Outcome
- Comprehensive settings file for PromptX integration
- Environment-based configuration management
- Feature flags for enabling/disabling provider
- Test mode for development without API usage

### Verification Checklist
- [ ] `backend/config/settings/integrations/promptx.py` created
- [ ] PROMPTX_ENABLED flag defined
- [ ] PROMPTX_SANDBOX flag defined
- [ ] PROMPTX_TEST_MODE flag defined
- [ ] Webhook settings configured
- [ ] Notification preferences set
- [ ] Logging configuration defined
- [ ] Cache settings specified
- [ ] Settings imported in main config
- [ ] Environment variables documented

---

## Task 25: Create PromptX API Key

### Overview
Create the API key setting for PromptX authentication. Configure environment variable handling for secure API key storage and retrieval. Implement validation to ensure API key is present when PromptX provider is enabled.

### Dependencies
- Task 24: Create PromptX Settings

### Instructions

1. **Add API key setting**
   - Open `settings/integrations/promptx.py`
   - Add `PROMPTX_API_KEY` setting
   - Read from environment variable

2. **Implement secure retrieval**
   - Use Django's `get_env_variable()` or similar
   - Raise clear error if missing when ENABLED=True
   - Allow None if provider is disabled

3. **Add validation logic**
   - Create validation function for API key format
   - Check if key matches expected pattern
   - Validate key is not empty or placeholder

4. **Create conditional requirement**
   - API key required only if PROMPTX_ENABLED=True
   - Skip validation if TEST_MODE=True
   - Provide clear error message if missing

5. **Add to .env.example**
   - Document PROMPTX_API_KEY in environment template
   - Provide example format (not real key)
   - Add usage instructions

6. **Create settings validation**
   - Add validation in Django checks framework
   - Verify API key exists when needed
   - Provide helpful error messages

7. **Document API key management**
   - Add comments explaining where to obtain key
   - Document key rotation process
   - Note security best practices

8. **Add fallback for development**
   - Allow test key in development environments
   - Clearly mark as test credentials
   - Prevent use in production

### API Key Configuration

| Setting | Value | Description |
|---------|-------|-------------|
| PROMPTX_API_KEY | From environment | Bearer token for API |
| PROMPTX_API_KEY_HEADER | "Authorization" | Header name |
| PROMPTX_API_KEY_PREFIX | "Bearer" | Token prefix |

### Environment Variable Setup

| Variable | Required When | Example Format |
|----------|---------------|----------------|
| PROMPTX_API_KEY | ENABLED=True & TEST_MODE=False | Bearer_abc123xyz... |
| PROMPTX_SANDBOX_API_KEY | SANDBOX=True | Bearer_test_abc... |

### Validation Rules

| Rule | Validation | Error Message |
|------|------------|---------------|
| Presence | Not empty | "PromptX API key is required" |
| Format | Starts with expected prefix | "Invalid API key format" |
| Length | Minimum length check | "API key too short" |
| Production | Not test key in prod | "Cannot use test key in production" |

### Settings Check Implementation

```
Django System Check
├── Check: promptx_api_key_configured
├── Level: ERROR if missing
├── Condition: PROMPTX_ENABLED=True
├── Message: "PROMPTX_API_KEY not configured"
└── Hint: "Set PROMPTX_API_KEY environment variable"
```

### API Key Storage Best Practices

| Practice | Implementation |
|----------|----------------|
| Never commit | Add to .gitignore |
| Use env vars | Read from environment |
| Rotate regularly | Document rotation process |
| Separate by env | Different keys for dev/prod |
| Encrypt at rest | Use secrets management |

### Error Handling

| Scenario | Behavior |
|----------|----------|
| Missing in prod | Raise ImproperlyConfigured |
| Missing in dev | Warning only if ENABLED |
| Invalid format | Validation error |
| Test mode | Skip validation |

### .env.example Documentation

```
# PromptX Courier Integration
PROMPTX_ENABLED=false
PROMPTX_SANDBOX=true
PROMPTX_API_KEY=Bearer_your_api_key_here
PROMPTX_TEST_MODE=false
```

### Expected Outcome
- Secure API key configuration with environment variables
- Validation ensuring key is present when needed
- Clear error messages for configuration issues
- Documentation for API key management

### Verification Checklist
- [ ] PROMPTX_API_KEY setting added to promptx.py
- [ ] Environment variable reading implemented
- [ ] Validation logic for API key format
- [ ] Conditional requirement based on ENABLED flag
- [ ] .env.example updated with API key variable
- [ ] Django system check added for validation
- [ ] Documentation comments added
- [ ] Test mode bypass implemented
- [ ] Production safety checks in place

---

## Task 26: Create PromptXConfig Model

### Overview
Create the PromptXConfig database model for storing tenant-specific PromptX credentials and configuration. This model allows each tenant to have their own PromptX account credentials, enabling multi-tenant support with separate courier accounts.

### Dependencies
- Task 24: Create PromptX Settings
- Multi-tenancy infrastructure must be in place

### Instructions

1. **Create config file**
   - Create `config.py` in `promptx/` directory
   - Import Django model modules
   - Import tenant model and base classes

2. **Define PromptXConfig model**
   - Inherit from appropriate base model
   - Add tenant foreign key relationship
   - Use TenantMixin if applicable

3. **Add credential fields**
   - Add `api_key` field (CharField, encrypted)
   - Add `api_secret` field if needed (CharField, encrypted)
   - Add `account_id` field (CharField)

4. **Add configuration fields**
   - Add `is_active` field (BooleanField)
   - Add `is_sandbox` field (BooleanField)
   - Add `same_day_enabled` field (BooleanField)

5. **Add operational fields**
   - Add `default_pickup_address` field (JSONField)
   - Add `notification_email` field (EmailField)
   - Add `notification_phone` field (CharField)

6. **Add business logic fields**
   - Add `cod_enabled` field (BooleanField)
   - Add `max_cod_amount` field (DecimalField)
   - Add `default_insurance_enabled` field (BooleanField)

7. **Add tracking fields**
   - Add `created_at` timestamp
   - Add `updated_at` timestamp
   - Add `last_verified_at` timestamp

8. **Add model methods**
   - Add `get_api_key()` method with decryption
   - Add `verify_credentials()` method for testing
   - Add `is_configured()` property

9. **Add model metadata**
   - Define verbose_name and verbose_name_plural
   - Add database indexes on tenant and is_active
   - Define ordering by tenant

10. **Implement validation**
    - Add field validators for phone format
    - Validate email format
    - Ensure unique constraint per tenant

### Model Field Structure

| Field | Type | Nullable | Default | Purpose |
|-------|------|----------|---------|---------|
| tenant | ForeignKey | No | - | Tenant relationship |
| api_key | CharField(255) | No | - | API authentication |
| account_id | CharField(100) | Yes | - | Account identifier |
| is_active | BooleanField | No | True | Enable/disable |
| is_sandbox | BooleanField | No | False | Test mode |
| same_day_enabled | BooleanField | No | True | Same-day feature |
| default_pickup_address | JSONField | Yes | - | Default pickup |
| notification_email | EmailField | Yes | - | Alert email |
| notification_phone | CharField(20) | Yes | - | SMS alerts |
| cod_enabled | BooleanField | No | False | COD feature |
| max_cod_amount | DecimalField | Yes | - | COD limit |
| created_at | DateTimeField | No | auto_now_add | Creation time |
| updated_at | DateTimeField | No | auto_now | Update time |
| last_verified_at | DateTimeField | Yes | - | Last credential test |

### Model Relationships

```
PromptXConfig
├── tenant: ForeignKey(Tenant)
│   └── related_name: promptx_configs
└── Unique Together: [tenant]
```

### Default Pickup Address Structure

```json
{
  "contact_name": "Store Manager",
  "phone": "+94771234567",
  "address_line_1": "123 Main Street",
  "address_line_2": "Floor 2",
  "city": "Colombo",
  "postal_code": "00100",
  "country": "LK",
  "landmark": "Near Town Hall"
}
```

### Model Methods

| Method | Return Type | Purpose |
|--------|-------------|---------|
| get_api_key() | str | Decrypt and return API key |
| verify_credentials() | bool | Test API connectivity |
| is_configured() | bool | Check if fully configured |
| get_pickup_address() | dict | Return parsed pickup address |
| update_last_verified() | None | Update verification timestamp |

### Business Logic Properties

| Property | Type | Logic |
|----------|------|-------|
| is_configured | bool | API key exists and is_active |
| can_process_cod | bool | cod_enabled and API supports it |
| same_day_available | bool | same_day_enabled and within cutoff |

### Database Indexes

| Index | Fields | Purpose |
|-------|--------|---------|
| idx_tenant | [tenant] | Fast tenant lookup |
| idx_active | [is_active] | Filter active configs |
| idx_tenant_active | [tenant, is_active] | Combined filter |

### Security Considerations

| Aspect | Implementation |
|--------|----------------|
| API Key Storage | Encrypt at rest |
| Access Control | Tenant isolation |
| Audit Trail | Track changes |
| Credentials Test | Verify before save |

### Validation Rules

| Field | Validation | Error Message |
|-------|------------|---------------|
| api_key | Not empty | "API key is required" |
| notification_phone | Valid format | "Invalid phone format" |
| max_cod_amount | Positive value | "Amount must be positive" |
| tenant | Unique per tenant | "Config already exists" |

### Model Signals

| Signal | Trigger | Action |
|--------|---------|--------|
| pre_save | Before save | Encrypt credentials |
| post_save | After save | Clear cached config |
| pre_delete | Before delete | Archive shipments |

### Expected Outcome
- Database model for tenant-specific PromptX configuration
- Secure storage for API credentials
- Flexible configuration options per tenant
- Validation and business logic methods

### Verification Checklist
- [ ] `backend/apps/shipping/providers/promptx/config.py` created
- [ ] PromptXConfig model defined with all fields
- [ ] Tenant foreign key relationship established
- [ ] Credential fields with encryption support
- [ ] Configuration fields (active, sandbox, etc.)
- [ ] Operational fields (pickup, notifications)
- [ ] Business logic fields (COD, insurance)
- [ ] Timestamp fields for tracking
- [ ] Model methods implemented
- [ ] Validation rules defined
- [ ] Database indexes specified
- [ ] Model metadata configured

---

## Task 27: Create PromptXClient Class

### Overview
Create the PromptXClient class that handles low-level HTTP communication with the PromptX API. This client provides a clean interface for making authenticated requests, handling responses, and managing connection pooling.

### Dependencies
- Task 26: Create PromptXConfig Model
- Task 23: Create PromptX Constants

### Instructions

1. **Create client file**
   - Create `client.py` in `promptx/` directory
   - Import requests library and utilities
   - Import constants and configuration

2. **Define PromptXClient class**
   - Create class with initialization method
   - Accept config parameter (PromptXConfig instance)
   - Store configuration for reuse

3. **Initialize HTTP session**
   - Create requests.Session instance
   - Configure connection pooling
   - Set default headers

4. **Store base configuration**
   - Store API base URL from constants
   - Store timeout from constants
   - Store retry configuration

5. **Create constructor parameters**
   - Accept PromptXConfig instance
   - Accept optional custom timeout
   - Accept optional custom base_url (for testing)

6. **Implement context manager**
   - Implement `__enter__` method
   - Implement `__exit__` method
   - Ensure session cleanup

7. **Add configuration properties**
   - Create property for API key retrieval
   - Create property for base URL
   - Create property for headers

8. **Implement connection validation**
   - Create method to test connectivity
   - Verify credentials on initialization
   - Handle connection errors gracefully

9. **Add session management**
   - Implement session creation with pooling
   - Configure keep-alive
   - Set connection limits

10. **Implement cleanup methods**
    - Create close() method for session
    - Add destructor if needed
    - Ensure proper resource cleanup

### Client Class Structure

```
PromptXClient
├── __init__(config, timeout, base_url)
├── Properties
│   ├── api_key
│   ├── base_url
│   ├── headers
│   └── is_sandbox
├── Context Manager
│   ├── __enter__()
│   └── __exit__()
├── Connection Methods
│   ├── _create_session()
│   ├── test_connection()
│   └── close()
└── Request Method (Task 29)
    └── request()
```

### Client Initialization

| Parameter | Type | Required | Default | Purpose |
|-----------|------|----------|---------|---------|
| config | PromptXConfig | Yes | - | Tenant configuration |
| timeout | int | No | 30 | Request timeout |
| base_url | str | No | From constants | API base URL |
| verify_ssl | bool | No | True | SSL verification |

### Session Configuration

| Setting | Value | Purpose |
|---------|-------|---------|
| Pool Connections | 10 | Reuse connections |
| Pool Max Size | 20 | Maximum connections |
| Max Retries | 3 | Retry failed requests |
| Keep-Alive | True | Persistent connections |

### Default Headers

| Header | Value | Purpose |
|--------|-------|---------|
| Content-Type | application/json | Request format |
| Accept | application/json | Response format |
| User-Agent | LCC-PromptX-Client/1.0 | Client identification |
| X-API-Version | v1 | API version |

### Property Implementations

| Property | Returns | Logic |
|----------|---------|-------|
| api_key | str | config.get_api_key() |
| base_url | str | config-based or override |
| headers | dict | Default + auth headers |
| is_sandbox | bool | config.is_sandbox |
| is_configured | bool | config.is_configured() |

### Context Manager Usage

```
Usage Pattern:
with PromptXClient(config) as client:
    # Client is initialized
    # Session is open
    # Make API calls
    pass
# Session automatically closed
```

### Connection Testing

| Test | Endpoint | Expected | Action |
|------|----------|----------|--------|
| Connectivity | /health or /ping | 200 OK | Verify reachable |
| Authentication | /auth/verify | 200 OK | Verify credentials |
| Rate Limit | Any endpoint | Headers check | Verify limits |

### Error Handling in Constructor

| Error | Exception | Action |
|-------|-----------|--------|
| Missing config | ValueError | Raise with message |
| Invalid API key | ValueError | Raise validation error |
| Connection failed | ConnectionError | Log and raise |
| Invalid URL | ValueError | Validate and raise |

### Session Pooling Benefits

| Benefit | Impact |
|---------|--------|
| Connection Reuse | Faster requests |
| Reduced Overhead | Less TCP handshakes |
| Keep-Alive | Persistent connections |
| Resource Efficiency | Lower memory usage |

### SSL Configuration

| Mode | Setting | When to Use |
|------|---------|-------------|
| Verify | verify=True | Production |
| No Verify | verify=False | Development only |
| Custom CA | verify='/path/to/ca' | Corporate proxy |

### Expected Outcome
- Fully functional HTTP client for PromptX API
- Session management with connection pooling
- Context manager support for clean resource handling
- Configuration-based initialization

### Verification Checklist
- [ ] `backend/apps/shipping/providers/promptx/client.py` created
- [ ] PromptXClient class defined
- [ ] Constructor accepts config parameter
- [ ] HTTP session initialized with pooling
- [ ] Default headers configured
- [ ] Context manager implemented (__enter__, __exit__)
- [ ] Properties for api_key, base_url, headers
- [ ] Connection testing method added
- [ ] Session cleanup in close() method
- [ ] Error handling in constructor
- [ ] SSL verification configured

---

## Task 28: Create PromptX Auth

### Overview
Implement authentication logic for PromptX API requests. Add bearer token authentication to all HTTP requests, handle token refresh if applicable, and manage authentication errors.

### Dependencies
- Task 27: Create PromptXClient Class

### Instructions

1. **Open client file**
   - Open `client.py` in `promptx/` directory
   - Locate PromptXClient class
   - Prepare to add authentication methods

2. **Implement auth header generation**
   - Create `_get_auth_header()` method
   - Format bearer token properly
   - Return Authorization header dict

3. **Add auth header to session**
   - Update session initialization
   - Add Authorization header to session.headers
   - Ensure header is included in all requests

4. **Implement token validation**
   - Create `_validate_token()` method
   - Check token format and structure
   - Raise error if invalid

5. **Handle bearer token format**
   - Ensure "Bearer " prefix exists
   - Handle both prefixed and unprefixed tokens
   - Normalize token format

6. **Add auth error handling**
   - Detect 401 Unauthorized responses
   - Detect 403 Forbidden responses
   - Raise appropriate exceptions

7. **Implement credential refresh (if supported)**
   - Check if PromptX supports token refresh
   - Implement refresh logic if applicable
   - Update stored credentials

8. **Add authentication testing**
   - Create `verify_auth()` method
   - Make test API call to verify credentials
   - Return authentication status

9. **Handle authentication edge cases**
   - Handle missing API key
   - Handle expired tokens
   - Handle invalid credentials

10. **Add logging for auth operations**
    - Log authentication attempts (without exposing credentials)
    - Log authentication failures
    - Log successful authentications

### Authentication Flow

```
Initialize Client
    ↓
Retrieve API Key from Config
    ↓
Validate Token Format
    ↓
Generate Auth Header
    ↓
Add to Session Headers
    ↓
Test Authentication (optional)
    ↓
Client Ready for Requests
```

### Auth Header Format

| Component | Value | Example |
|-----------|-------|---------|
| Header Name | Authorization | "Authorization" |
| Auth Type | Bearer | "Bearer" |
| Token | From config | "abc123xyz..." |
| Full Header | "Bearer {token}" | "Bearer abc123xyz..." |

### Authentication Methods

| Method | Purpose | Returns |
|--------|---------|---------|
| _get_auth_header() | Build auth header | dict |
| _validate_token() | Check token validity | bool |
| verify_auth() | Test authentication | bool |
| _handle_auth_error() | Process auth failures | None (raises) |

### Token Validation Rules

| Check | Rule | Error |
|-------|------|-------|
| Presence | Token not empty | "API key required" |
| Format | Valid structure | "Invalid token format" |
| Length | Minimum length | "Token too short" |
| Characters | Alphanumeric + allowed | "Invalid characters" |

### Authentication Errors

| Status Code | Error Type | Handling |
|-------------|------------|----------|
| 401 | Unauthorized | Invalid credentials |
| 403 | Forbidden | Insufficient permissions |
| 429 | Rate Limited | Retry with backoff |

### Auth Error Exception Mapping

| HTTP Status | Exception Class | Message |
|-------------|-----------------|---------|
| 401 | PromptXAuthenticationError | "Invalid API credentials" |
| 403 | PromptXPermissionError | "Insufficient permissions" |
| 419 | PromptXTokenExpiredError | "Token has expired" |

### Logging Strategy

| Event | Log Level | Message Template |
|-------|-----------|------------------|
| Auth Success | INFO | "PromptX authenticated for tenant {id}" |
| Auth Failure | WARNING | "PromptX auth failed: {error}" |
| Token Invalid | ERROR | "Invalid PromptX token format" |
| Missing Token | ERROR | "PromptX API key not configured" |

### Security Best Practices

| Practice | Implementation |
|----------|----------------|
| Never log tokens | Mask in logs |
| Secure storage | Encrypted in DB |
| HTTPS only | Enforce SSL |
| Header security | Use Authorization header |

### Bearer Token Handling

```
Token Sources:
1. From config.api_key (primary)
2. From environment (fallback)
3. From tenant settings (override)

Token Format:
- Input: "abc123xyz..." or "Bearer abc123xyz..."
- Normalized: "Bearer abc123xyz..."
- Header: {"Authorization": "Bearer abc123xyz..."}
```

### Expected Outcome
- Authentication logic integrated into PromptXClient
- Bearer token properly formatted and added to requests
- Authentication errors handled appropriately
- Secure credential management

### Verification Checklist
- [ ] _get_auth_header() method implemented
- [ ] Authorization header added to session
- [ ] _validate_token() method created
- [ ] Bearer token format handling
- [ ] Auth error detection and handling
- [ ] verify_auth() test method added
- [ ] Credential refresh logic (if applicable)
- [ ] Edge case handling (missing key, expired, invalid)
- [ ] Logging for auth operations
- [ ] Security best practices followed
- [ ] No credentials logged in plain text

---

## Task 29: Create PromptX Requests

### Overview
Implement the core request method in PromptXClient that handles all HTTP operations. This method provides a unified interface for making API calls with automatic retry, error handling, and response parsing.

### Dependencies
- Task 28: Create PromptX Auth

### Instructions

1. **Add request method to client**
   - Open `client.py`
   - Add `request()` method to PromptXClient
   - Accept HTTP method, endpoint, and data parameters

2. **Implement HTTP method support**
   - Support GET, POST, PUT, PATCH, DELETE
   - Validate HTTP method parameter
   - Raise error for unsupported methods

3. **Build request URL**
   - Combine base URL with endpoint
   - Handle leading/trailing slashes
   - Validate final URL format

4. **Prepare request data**
   - Accept data parameter (dict)
   - Serialize to JSON for POST/PUT/PATCH
   - Use query params for GET requests

5. **Add request timeout**
   - Use client's configured timeout
   - Allow per-request timeout override
   - Handle timeout exceptions

6. **Implement retry logic**
   - Retry on network errors
   - Retry on server errors (5xx)
   - Use exponential backoff
   - Respect max_retries setting

7. **Make HTTP request**
   - Use session.request() method
   - Include headers and authentication
   - Capture response

8. **Handle HTTP errors**
   - Check response status code
   - Raise exceptions for error statuses
   - Include response body in exceptions

9. **Parse response**
   - Parse JSON response body
   - Handle non-JSON responses
   - Return parsed data

10. **Add request logging**
    - Log request details (method, URL)
    - Log response status and time
    - Redact sensitive data

### Request Method Signature

```
def request(
    method: str,
    endpoint: str,
    data: Optional[dict] = None,
    params: Optional[dict] = None,
    timeout: Optional[int] = None,
    retry: bool = True
) -> dict:
```

### Supported HTTP Methods

| Method | Purpose | Data Location |
|--------|---------|---------------|
| GET | Retrieve resource | Query params |
| POST | Create resource | Request body |
| PUT | Replace resource | Request body |
| PATCH | Update resource | Request body |
| DELETE | Remove resource | Query params |

### Request Flow

```
request(method, endpoint, data)
    ↓
Validate method
    ↓
Build full URL
    ↓
Prepare request data/params
    ↓
Apply authentication
    ↓
Make HTTP request (with retry)
    ↓
Check status code
    ↓
Parse response
    ↓
Return data
```

### Retry Strategy

| Condition | Retry | Delay | Max Attempts |
|-----------|-------|-------|--------------|
| Connection error | Yes | 2s, 4s, 8s | 3 |
| 5xx Server error | Yes | 2s, 4s, 8s | 3 |
| 4xx Client error | No | - | 1 |
| 429 Rate limit | Yes | From header | 3 |
| Timeout | Yes | 2s, 4s | 3 |

### URL Construction

| Component | Source | Example |
|-----------|--------|---------|
| Base URL | Client config | https://api.promptx.lk |
| API Version | Constants | /v1 |
| Endpoint | Parameter | /shipments |
| Full URL | Concatenated | https://api.promptx.lk/v1/shipments |

### Request Data Handling

| HTTP Method | Data Parameter | Sent As |
|-------------|---------------|---------|
| GET | data → params | Query string |
| POST | data → body | JSON body |
| PUT | data → body | JSON body |
| PATCH | data → body | JSON body |
| DELETE | data → params | Query string |

### Response Status Handling

| Status Range | Action | Exception |
|--------------|--------|-----------|
| 2xx (Success) | Parse and return | None |
| 3xx (Redirect) | Follow redirect | None |
| 4xx (Client Error) | Raise exception | PromptXClientError |
| 5xx (Server Error) | Retry then raise | PromptXServerError |
| Timeout | Retry then raise | PromptXTimeoutError |
| Connection | Retry then raise | PromptXConnectionError |

### Response Parsing

| Content-Type | Parsing | Return |
|--------------|---------|--------|
| application/json | response.json() | dict |
| text/plain | response.text | str |
| application/pdf | response.content | bytes |
| Other | response.content | bytes |

### Request Logging

| Log Entry | Details | Sensitive Data |
|-----------|---------|----------------|
| Request Start | Method, URL, timestamp | Redact tokens |
| Request End | Status, duration | Redact keys |
| Request Error | Error type, message | Redact credentials |

### Logging Format

```
[PromptX] {method} {endpoint} - {status} ({duration}ms)
Example:
[PromptX] POST /shipments - 201 (342ms)
[PromptX] GET /rates - 200 (123ms)
[PromptX] POST /shipments - 400 (Error: Invalid address)
```

### Error Response Handling

| Error Type | Response Processing | Exception Data |
|------------|--------------------|-----------------
| API Error | Parse error details | Code, message, details |
| Network Error | Connection details | Timeout, host |
| Parse Error | Raw response | Body content |

### Timeout Configuration

| Timeout Type | Value | Purpose |
|-------------|-------|---------|
| Connect | 10s | TCP connection |
| Read | 30s | Response reading |
| Total | 60s | Complete request |

### Expected Outcome
- Unified request method for all API calls
- Automatic retry on transient failures
- Proper error handling and exceptions
- Response parsing and logging

### Verification Checklist
- [ ] request() method added to PromptXClient
- [ ] HTTP method validation implemented
- [ ] URL construction logic correct
- [ ] Request data handling for all methods
- [ ] Timeout configuration working
- [ ] Retry logic with exponential backoff
- [ ] HTTP request execution with session
- [ ] Status code checking and error raising
- [ ] Response parsing (JSON and others)
- [ ] Request logging implemented
- [ ] Sensitive data redaction in logs
- [ ] Edge cases handled (network errors, timeouts)

---

## Task 30: Create PromptX Errors

### Overview
Define custom exception classes for PromptX API integration. Create a hierarchy of exceptions to handle different error scenarios, making error handling more specific and informative throughout the application.

### Dependencies
- Task 29: Create PromptX Requests

### Instructions

1. **Create errors file**
   - Create `errors.py` in `promptx/` directory
   - Import Python's base Exception class
   - Add module docstring

2. **Define base exception class**
   - Create `PromptXError` inheriting from Exception
   - This is the base for all PromptX errors
   - Add initialization with message and details

3. **Create API-level exceptions**
   - Create `PromptXAPIError` for general API errors
   - Include status code and response data
   - Store original response for debugging

4. **Create authentication exceptions**
   - Create `PromptXAuthenticationError` for auth failures
   - Create `PromptXPermissionError` for forbidden access
   - Create `PromptXTokenExpiredError` if applicable

5. **Create client error exceptions (4xx)**
   - Create `PromptXClientError` base class
   - Create `PromptXValidationError` for validation failures
   - Create `PromptXNotFoundError` for 404 responses
   - Create `PromptXRateLimitError` for 429 responses

6. **Create server error exceptions (5xx)**
   - Create `PromptXServerError` for 5xx responses
   - Include retry information
   - Add server error details

7. **Create network exceptions**
   - Create `PromptXConnectionError` for connection failures
   - Create `PromptXTimeoutError` for timeouts
   - Include network-related details

8. **Create business logic exceptions**
   - Create `PromptXShipmentError` for shipment failures
   - Create `PromptXAddressError` for address validation
   - Create `PromptXServiceUnavailableError` for coverage issues

9. **Create webhook exceptions**
   - Create `PromptXWebhookError` for webhook failures
   - Create `PromptXWebhookSignatureError` for signature mismatches

10. **Add helper methods**
    - Add `from_response()` class method to parse API errors
    - Add error code mapping
    - Add human-readable error messages

### Exception Hierarchy

```
Exception (Python Base)
└── PromptXError (Base)
    ├── PromptXAPIError
    │   ├── PromptXAuthenticationError
    │   ├── PromptXPermissionError
    │   ├── PromptXClientError (4xx)
    │   │   ├── PromptXValidationError
    │   │   ├── PromptXNotFoundError
    │   │   └── PromptXRateLimitError
    │   └── PromptXServerError (5xx)
    ├── PromptXConnectionError
    ├── PromptXTimeoutError
    ├── PromptXShipmentError
    ├── PromptXAddressError
    ├── PromptXServiceUnavailableError
    ├── PromptXWebhookError
    └── PromptXWebhookSignatureError
```

### Base Exception Structure

| Attribute | Type | Purpose |
|-----------|------|---------|
| message | str | Error message |
| details | dict | Additional error details |
| status_code | int | HTTP status (if applicable) |
| response | dict | API response (if applicable) |
| error_code | str | PromptX error code |

### Exception Classes

| Exception | When to Raise | HTTP Status |
|-----------|---------------|-------------|
| PromptXError | Generic error | N/A |
| PromptXAPIError | API returned error | Any |
| PromptXAuthenticationError | Invalid credentials | 401 |
| PromptXPermissionError | Access denied | 403 |
| PromptXClientError | Client mistake | 4xx |
| PromptXValidationError | Invalid data | 400, 422 |
| PromptXNotFoundError | Resource not found | 404 |
| PromptXRateLimitError | Too many requests | 429 |
| PromptXServerError | Server issue | 5xx |
| PromptXConnectionError | Network failure | N/A |
| PromptXTimeoutError | Request timeout | N/A |

### Business Logic Exceptions

| Exception | Scenario | Example |
|-----------|----------|---------|
| PromptXShipmentError | Shipment creation failed | Invalid weight |
| PromptXAddressError | Address validation failed | Invalid postal code |
| PromptXServiceUnavailableError | Service not available | Outside coverage area |

### Exception Initialization

```
PromptXError(
    message: str,
    details: Optional[dict] = None,
    status_code: Optional[int] = None,
    response: Optional[dict] = None
)
```

### Error Code Mapping

| PromptX Error Code | Exception Class | Message |
|-------------------|-----------------|---------|
| AUTH_FAILED | PromptXAuthenticationError | Invalid API credentials |
| INVALID_ADDRESS | PromptXAddressError | Address validation failed |
| OUT_OF_COVERAGE | PromptXServiceUnavailableError | Service unavailable in area |
| INVALID_WEIGHT | PromptXValidationError | Weight exceeds limit |
| SHIPMENT_NOT_FOUND | PromptXNotFoundError | Shipment not found |
| RATE_LIMIT | PromptXRateLimitError | Too many requests |

### Helper Methods

| Method | Purpose | Returns |
|--------|---------|---------|
| from_response() | Create exception from API response | Exception instance |
| to_dict() | Serialize exception | dict |
| get_user_message() | Human-readable message | str |

### Usage in Request Method

```
Response Handling:
if response.status_code == 401:
    raise PromptXAuthenticationError.from_response(response)
elif response.status_code == 404:
    raise PromptXNotFoundError.from_response(response)
elif 400 <= response.status_code < 500:
    raise PromptXClientError.from_response(response)
elif 500 <= response.status_code < 600:
    raise PromptXServerError.from_response(response)
```

### Exception Details Structure

```json
{
  "error_code": "INVALID_ADDRESS",
  "message": "Address validation failed",
  "field_errors": {
    "postal_code": "Invalid postal code format"
  },
  "timestamp": "2026-01-31T10:30:00Z",
  "request_id": "abc-123-xyz"
}
```

### Logging Integration

| Exception Type | Log Level | Include Stack Trace |
|----------------|-----------|---------------------|
| PromptXClientError | WARNING | No |
| PromptXServerError | ERROR | Yes |
| PromptXConnectionError | ERROR | Yes |
| PromptXTimeoutError | WARNING | No |

### Expected Outcome
- Comprehensive exception hierarchy for error handling
- Specific exceptions for different error scenarios
- Helper methods for creating exceptions from responses
- Clear, informative error messages

### Verification Checklist
- [ ] `backend/apps/shipping/providers/promptx/errors.py` created
- [ ] PromptXError base exception defined
- [ ] PromptXAPIError with status and response
- [ ] Authentication exceptions (Auth, Permission, Token)
- [ ] Client error exceptions (Validation, NotFound, RateLimit)
- [ ] Server error exception
- [ ] Network exceptions (Connection, Timeout)
- [ ] Business logic exceptions (Shipment, Address, ServiceUnavailable)
- [ ] Webhook exceptions
- [ ] from_response() class method
- [ ] Error code mapping implemented
- [ ] to_dict() serialization method
- [ ] get_user_message() for user-facing messages

---

## Summary

This document established the configuration and API client foundation for Prompt X integration. All core components are now in place for making authenticated API requests with proper error handling.

### Completed Tasks
1. ✓ Created PromptX constants with API URLs and endpoints
2. ✓ Created PromptX settings with environment configuration
3. ✓ Created PromptX API key setting with validation
4. ✓ Created PromptXConfig model for tenant credentials
5. ✓ Created PromptXClient class with session management
6. ✓ Created authentication with bearer token handling
7. ✓ Created request method with retry and parsing
8. ✓ Created comprehensive error exception hierarchy

### Next Steps
Proceed to [02_Tasks-31-42_Provider-Webhook-Verify.md](02_Tasks-31-42_Provider-Webhook-Verify.md) to implement the PromptXProvider class with shipping operations, webhook handling, admin interface, and integration verification.
