# Tasks 01-08: Configuration and Client Setup

> **Phase:** 09 - Integrations & Sri Lanka Localizations  
> **SubPhase:** 09 - Domex & Other Couriers  
> **Group:** A - Domex Integration  
> **Document:** 01 of 03  
> **Tasks Covered:** 01, 02, 03, 04, 05, 06, 07, 08

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-09-15_Provider-Waybill.md](02_Tasks-09-15_Provider-Waybill.md)

---

## Document Overview

This document covers the foundational configuration and HTTP client setup for Domex courier integration. It establishes constants for API URLs and endpoints, Django settings for environment-specific configuration, API key management, tenant-specific configuration model, HTTP client wrapper, authentication mechanisms, request handling, and comprehensive error handling.

### Tasks in This Document

| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 01 | Create Domex Constants | Low | 15 min |
| 02 | Create Domex Settings | Low | 20 min |
| 03 | Create Domex API Key | Low | 15 min |
| 04 | Create DomexConfig Model | Medium | 45 min |
| 05 | Create DomexClient Class | Medium | 60 min |
| 06 | Create Authentication | Low | 30 min |
| 07 | Create Request Handler | Medium | 50 min |
| 08 | Create Error Handling | Medium | 45 min |

---

## Task 01: Create Domex Constants

### Overview

Create a constants module to centralize all Domex-specific configuration values including API URLs for sandbox and production environments, endpoint paths, timeout settings, service type definitions, and status code mappings. This provides a single source of truth for all Domex integration constants.

### Dependencies

- SubPhase-08 (Koombiyo Courier API) complete
- Shipping app structure exists
- ShippingProvider interface defined

### Instructions

1. **Create constants file**
   - Navigate to `backend/apps/shipping/providers/domex/` directory
   - Create `constants.py` file
   - Structure constants into logical sections

2. **Define base URLs**
   - Define `DOMEX_SANDBOX_BASE_URL` for testing environment
   - Define `DOMEX_PRODUCTION_BASE_URL` for live environment
   - Include API version in URLs

3. **Define endpoint paths**
   - Define `CREATE_SHIPMENT_ENDPOINT` path
   - Define `GET_RATES_ENDPOINT` path
   - Define `TRACK_SHIPMENT_ENDPOINT` path (with waybill parameter)
   - Define `CANCEL_SHIPMENT_ENDPOINT` path
   - Define `WAYBILL_GENERATION_ENDPOINT` path
   - Define `LABEL_DOWNLOAD_ENDPOINT` path
   - Define `PICKUP_SCHEDULE_ENDPOINT` path
   - Define `WEBHOOK_CALLBACK_ENDPOINT` path

4. **Define timeout and retry settings**
   - Set `REQUEST_TIMEOUT` (default: 30 seconds)
   - Set `MAX_RETRIES` (default: 3 attempts)
   - Set `RETRY_DELAY` (default: 1 second)
   - Set `RETRY_BACKOFF_FACTOR` (default: 2)

5. **Define service types**
   - Define `SERVICE_STANDARD` (2-3 business days)
   - Define `SERVICE_EXPRESS` (1-2 business days)
   - Define `SERVICE_SAME_DAY` (same day delivery)
   - Create service type choices for validation

6. **Define status mappings**
   - Map Domex statuses to internal status codes
   - Include: PENDING, PICKED_UP, IN_TRANSIT, OUT_FOR_DELIVERY, DELIVERED, FAILED, CANCELLED, RETURNED
   - Create bidirectional mapping (Domex → Internal, Internal → Domex)

7. **Define delivery options**
   - Define COD availability flag
   - Define insurance options
   - Define packaging types
   - Define weight categories

8. **Add API version constant**
   - Define current API version (e.g., "v1")
   - Document version compatibility

### Constants Structure

| Section | Constants Included |
|---------|-------------------|
| URLs | Sandbox and production base URLs |
| Endpoints | All API endpoint paths |
| Timeouts | Request timeout, retry settings |
| Services | Service type definitions |
| Status | Status code mappings |
| Options | Delivery options, COD, insurance |

### Base URLs

| Environment | URL Format | Purpose |
|-------------|-----------|---------|
| Sandbox | `https://sandbox-api.domex.lk/v1` | Testing and development |
| Production | `https://api.domex.lk/v1` | Live customer shipments |

### Service Types

| Service Code | Name | Delivery Time | Coverage |
|--------------|------|---------------|----------|
| STANDARD | Standard Delivery | 2-3 business days | Island-wide |
| EXPRESS | Express Delivery | 1-2 business days | Major cities |
| SAME_DAY | Same Day Delivery | Same day | Colombo area |

### Status Mappings

| Domex Status | Internal Status | Description |
|--------------|----------------|-------------|
| PENDING | PENDING | Shipment created |
| PICKED_UP | IN_TRANSIT | Package collected |
| IN_TRANSIT | IN_TRANSIT | On the way |
| OUT_FOR_DELIVERY | OUT_FOR_DELIVERY | Final mile delivery |
| DELIVERED | DELIVERED | Successfully delivered |
| FAILED | FAILED | Delivery failed |
| CANCELLED | CANCELLED | Shipment cancelled |
| RETURNED | RETURNED | Returned to sender |

### Expected Outcome

- Centralized constants file for Domex integration
- Clear separation between sandbox and production URLs
- Complete endpoint path definitions
- Timeout and retry configurations
- Service type and status mappings
- Foundation for client implementation

### Verification Checklist

- [ ] `constants.py` file created in domex provider directory
- [ ] Sandbox and production URLs defined
- [ ] All endpoint paths listed
- [ ] Timeout and retry settings configured
- [ ] Service types defined with descriptions
- [ ] Status mappings created (bidirectional)
- [ ] Delivery options and flags defined
- [ ] API version constant added

---

## Task 02: Create Domex Settings

### Overview

Create a Django settings module for Domex-specific configuration that switches between sandbox and production environments, manages API keys, configures timeouts and retries, and enables/disables feature flags. This settings module integrates with Django's existing settings infrastructure.

### Dependencies

- Task 01: Create Domex Constants

### Instructions

1. **Create settings file**
   - Navigate to `backend/config/settings/` directory
   - Create `domex.py` file for Domex-specific settings
   - Import constants from Task 01

2. **Define environment setting**
   - Create `DOMEX_ENVIRONMENT` setting
   - Default value: "sandbox"
   - Allowed values: "sandbox", "production"
   - Read from environment variable `DOMEX_ENV`

3. **Compute base URL from environment**
   - Create `DOMEX_BASE_URL` setting
   - Use conditional logic based on `DOMEX_ENVIRONMENT`
   - Select sandbox or production URL from constants

4. **Define API key setting**
   - Create `DOMEX_API_KEY` setting
   - Read from environment variable
   - Required in production, optional in sandbox
   - Validation for non-empty value

5. **Define timeout settings**
   - Set `DOMEX_REQUEST_TIMEOUT` (default: 30 seconds)
   - Set `DOMEX_CONNECTION_TIMEOUT` (default: 10 seconds)
   - Allow override via environment variables

6. **Define retry settings**
   - Set `DOMEX_MAX_RETRIES` (default: 3)
   - Set `DOMEX_RETRY_DELAY` (default: 1 second)
   - Set `DOMEX_RETRY_BACKOFF_FACTOR` (default: 2)

7. **Define feature flags**
   - Set `DOMEX_ENABLE_COD` (default: True)
   - Set `DOMEX_ENABLE_PICKUP_SCHEDULING` (default: True)
   - Set `DOMEX_ENABLE_WEBHOOK` (default: True)
   - Set `DOMEX_ENABLE_INSURANCE` (default: False)

8. **Define logging configuration**
   - Set `DOMEX_LOG_REQUESTS` (default: False in production)
   - Set `DOMEX_LOG_RESPONSES` (default: False in production)
   - Set `DOMEX_LOG_SENSITIVE_DATA` (default: False)

9. **Import in main settings**
   - Add import statement in main `settings/__init__.py`
   - Ensure settings are accessible application-wide

### Settings Structure

| Category | Settings | Purpose |
|----------|----------|---------|
| Environment | DOMEX_ENVIRONMENT, DOMEX_BASE_URL | Environment switching |
| Authentication | DOMEX_API_KEY | API authentication |
| Timeouts | REQUEST_TIMEOUT, CONNECTION_TIMEOUT | Connection management |
| Retries | MAX_RETRIES, RETRY_DELAY, BACKOFF_FACTOR | Error recovery |
| Features | ENABLE_COD, ENABLE_PICKUP, ENABLE_WEBHOOK | Feature toggles |
| Logging | LOG_REQUESTS, LOG_RESPONSES | Debug and audit |

### Environment Switching Logic

```
If DOMEX_ENVIRONMENT == "production":
    → Use DOMEX_PRODUCTION_BASE_URL
    → Require DOMEX_API_KEY
    → Disable debug logging
Else (sandbox):
    → Use DOMEX_SANDBOX_BASE_URL
    → Optional API key
    → Enable debug logging
```

### Validation Rules

| Setting | Validation | Error Handling |
|---------|-----------|----------------|
| DOMEX_ENVIRONMENT | Must be "sandbox" or "production" | Raise ImproperlyConfigured |
| DOMEX_API_KEY | Required in production, min 20 chars | Raise ImproperlyConfigured |
| Timeouts | Must be positive integers | Use defaults |
| Max Retries | Between 0 and 10 | Use defaults |

### Expected Outcome

- Django settings module for Domex configuration
- Environment-based URL switching
- API key management with validation
- Timeout and retry configuration
- Feature flags for optional functionality
- Logging configuration for debugging

### Verification Checklist

- [ ] `domex.py` file created in settings directory
- [ ] Environment setting with sandbox/production options
- [ ] Base URL computed from environment
- [ ] API key setting with validation
- [ ] Timeout and retry settings defined
- [ ] Feature flags configured
- [ ] Logging settings added
- [ ] Imported in main settings file

---

## Task 03: Create Domex API Key

### Overview

Configure the Domex API key in environment variables for secure authentication with the Domex API. Implement proper security practices including environment variable management, validation, documentation, and production security considerations.

### Dependencies

- Task 02: Create Domex Settings

### Instructions

1. **Add API key to environment template**
   - Open `.env.example` file
   - Add `DOMEX_API_KEY` with placeholder value
   - Add comment explaining key acquisition
   - Document format requirements

2. **Create/update local environment file**
   - Create or update `.env` file (not committed to git)
   - Add actual sandbox API key for development
   - Ensure different key for production

3. **Configure settings to read API key**
   - Ensure `domex.py` reads from `os.environ.get('DOMEX_API_KEY')`
   - Handle missing key gracefully in sandbox
   - Raise error in production if missing

4. **Implement validation logic**
   - Check API key is not empty
   - Verify minimum length (20 characters)
   - Validate format if Domex specifies one
   - Log warning if using default test key

5. **Document API key acquisition**
   - Add section to integration documentation
   - Explain how to obtain API key from Domex
   - Contact details: sales team or developer portal
   - Include onboarding steps

6. **Configure production security**
   - Use AWS Secrets Manager or HashiCorp Vault in production
   - Never hardcode API keys in source code
   - Rotate keys every 90 days
   - Implement key rotation procedure

7. **Update gitignore**
   - Verify `.env` is in `.gitignore`
   - Ensure API keys never committed to repository
   - Add pre-commit hook to scan for secrets

8. **Implement secure logging**
   - Never log API keys in plain text
   - Mask API keys in error messages
   - Redact sensitive data from logs

### API Key Security

| Security Practice | Implementation | Priority |
|-------------------|----------------|----------|
| Never hardcode | Use environment variables | Critical |
| Not in git | Add to .gitignore | Critical |
| Rotation | Every 90 days | High |
| Production storage | AWS Secrets Manager | High |
| Logging | Never log keys | Critical |
| Validation | Check format and length | Medium |

### Environment Variable Structure

```
# .env.example
DOMEX_API_KEY=your_domex_api_key_here
# Obtain from Domex developer portal or sales team
# Format: 32-character alphanumeric string

# .env (not committed)
DOMEX_API_KEY=actual_sandbox_key_value
```

### Validation Requirements

| Check | Rule | Action if Failed |
|-------|------|-----------------|
| Exists | Key must be set in production | Raise ImproperlyConfigured |
| Not empty | Length > 0 | Raise ValueError |
| Min length | Length >= 20 | Raise ValueError |
| Format | Alphanumeric (if required) | Raise ValueError |

### Expected Outcome

- API key configured in environment variables
- Validation ensures key format and presence
- Documentation for key acquisition
- Production security measures implemented
- Keys never exposed in code or logs

### Verification Checklist

- [ ] `DOMEX_API_KEY` added to `.env.example`
- [ ] Local `.env` file configured with sandbox key
- [ ] Settings read API key from environment
- [ ] Validation logic implemented
- [ ] Documentation added for key acquisition
- [ ] Production security configured (Secrets Manager)
- [ ] `.env` in `.gitignore`
- [ ] Logging redacts API keys

---

## Task 04: Create DomexConfig Model

### Overview

Create the `DomexConfig` model to store tenant-specific Domex configuration including API credentials, service preferences, default settings, and operational parameters. This model enables multi-tenant support where each tenant can have their own Domex account and configuration.

### Dependencies

- Task 02: Create Domex Settings
- Phase 02: Multi-tenancy infrastructure
- Phase 03: Base models and mixins

### Instructions

1. **Create config model file**
   - Navigate to `backend/apps/shipping/providers/domex/` directory
   - Create `config.py` file
   - Import necessary Django and tenant models

2. **Define DomexConfig model**
   - Inherit from `TenantAwareModel` for multi-tenancy
   - Add timestamp fields (created_at, updated_at)
   - Add soft delete support (is_deleted)

3. **Add tenant relationship**
   - Create foreign key to Tenant model
   - Set on_delete behavior (PROTECT or CASCADE)
   - Add related_name for reverse lookup

4. **Add credential fields**
   - Add `api_key` field (encrypted CharField, max 255)
   - Add `is_sandbox` field (BooleanField, default True)
   - Add `is_active` field (BooleanField, default True)

5. **Add service preference fields**
   - Add `default_service_type` (CharField with choices)
   - Add `enable_cod` (BooleanField, default True)
   - Add `enable_insurance` (BooleanField, default False)
   - Add `default_pickup_location` (JSONField)

6. **Add operational settings**
   - Add `webhook_secret` (CharField, for webhook validation)
   - Add `auto_schedule_pickup` (BooleanField, default False)
   - Add `notification_email` (EmailField, optional)
   - Add `notification_phone` (CharField, optional)

7. **Add metadata fields**
   - Add `last_sync_at` (DateTimeField, nullable)
   - Add `total_shipments` (IntegerField, default 0)
   - Add `config_metadata` (JSONField, for additional data)

8. **Implement model methods**
   - Create `get_base_url()` method (returns sandbox or production URL)
   - Create `get_client()` method (returns configured DomexClient instance)
   - Create `validate_credentials()` method (tests API connection)
   - Create `is_configured()` property (checks if setup complete)

9. **Add model validation**
   - Validate API key format and length
   - Validate service type against allowed choices
   - Validate webhook secret if webhooks enabled
   - Custom clean() method for cross-field validation

10. **Configure model Meta**
    - Set verbose name and plural
    - Add unique constraint (one config per tenant)
    - Define default ordering
    - Add indexes for performance

### Model Fields

| Field Name | Type | Required | Default | Description |
|------------|------|----------|---------|-------------|
| tenant | ForeignKey | Yes | - | Associated tenant |
| api_key | CharField | Yes | - | Encrypted API key |
| is_sandbox | BooleanField | No | True | Use sandbox environment |
| is_active | BooleanField | No | True | Configuration active |
| default_service_type | CharField | No | STANDARD | Default service |
| enable_cod | BooleanField | No | True | COD support |
| enable_insurance | BooleanField | No | False | Insurance option |
| webhook_secret | CharField | No | - | Webhook validation |
| auto_schedule_pickup | BooleanField | No | False | Auto pickup |
| notification_email | EmailField | No | - | Alert email |
| config_metadata | JSONField | No | {} | Additional config |

### Model Methods

| Method | Returns | Purpose |
|--------|---------|---------|
| `get_base_url()` | str | Returns appropriate API URL |
| `get_client()` | DomexClient | Returns configured client |
| `validate_credentials()` | bool | Tests API connection |
| `is_configured()` | bool | Checks setup completion |

### Expected Outcome

- DomexConfig model for tenant-specific configuration
- Encrypted storage of API credentials
- Service preference management
- Validation methods for credentials
- Integration with multi-tenancy system

### Verification Checklist

- [ ] `config.py` file created in domex directory
- [ ] DomexConfig model defined
- [ ] Tenant relationship configured
- [ ] Credential fields added with encryption
- [ ] Service preference fields defined
- [ ] Operational settings configured
- [ ] Model methods implemented
- [ ] Validation logic added
- [ ] Meta class configured with constraints

---

## Task 05: Create DomexClient Class

### Overview

Create the `DomexClient` class as an HTTP wrapper for interacting with the Domex API. This client handles HTTP requests, manages authentication, implements retry logic, and provides a clean interface for all Domex API operations.

### Dependencies

- Task 04: Create DomexConfig Model
- Python requests library installed

### Instructions

1. **Create client file**
   - Navigate to `backend/apps/shipping/providers/domex/` directory
   - Create `client.py` file
   - Import necessary libraries (requests, logging, typing)

2. **Define DomexClient class**
   - Create class with initialization method
   - Accept config parameter (DomexConfig instance)
   - Store configuration and setup session

3. **Initialize HTTP session**
   - Create requests.Session instance
   - Configure session with default headers
   - Set connection pooling parameters
   - Configure timeout defaults

4. **Store configuration**
   - Store config instance as attribute
   - Extract base URL from config
   - Store API key for authentication
   - Set timeout from config or defaults

5. **Implement session configuration**
   - Set User-Agent header with LCC version
   - Set Accept header (application/json)
   - Configure retry adapter for resilience
   - Set connection pool size

6. **Create base request method**
   - Define `_request()` private method
   - Accept method, endpoint, data, params
   - Build full URL from base + endpoint
   - Handle request preparation

7. **Implement timeout handling**
   - Use tuple timeout (connect, read)
   - Default: (10, 30) seconds
   - Allow override per request
   - Log timeout occurrences

8. **Add request logging**
   - Log request method and URL
   - Log request headers (mask sensitive data)
   - Log request body (if debug enabled)
   - Log request ID for tracing

9. **Implement connection pooling**
   - Configure HTTPAdapter with pool settings
   - Set pool_connections (10)
   - Set pool_maxsize (20)
   - Mount adapter to session

10. **Create close method**
    - Define `close()` method
    - Close requests session
    - Clean up resources
    - Implement context manager support

### Client Class Structure

| Component | Purpose | Configuration |
|-----------|---------|---------------|
| Session | HTTP connection pool | Reusable connections |
| Base URL | API endpoint | From config |
| Headers | Default headers | User-Agent, Accept |
| Timeout | Request timeout | (10, 30) seconds |
| Retry Adapter | Automatic retries | Max 3 attempts |

### Default Headers

| Header | Value | Purpose |
|--------|-------|---------|
| User-Agent | LankaCommerce-Cloud/1.0 | Client identification |
| Accept | application/json | Response format |
| Content-Type | application/json | Request format |
| X-Client-Version | 1.0.0 | API version tracking |

### Expected Outcome

- DomexClient class for HTTP communication
- Configured session with connection pooling
- Default headers and timeout settings
- Logging for debugging and monitoring
- Retry logic for resilience
- Clean interface for API operations

### Verification Checklist

- [ ] `client.py` file created in domex directory
- [ ] DomexClient class defined
- [ ] Initialization accepts config parameter
- [ ] HTTP session created with pooling
- [ ] Default headers configured
- [ ] Timeout handling implemented
- [ ] Request logging added
- [ ] Retry adapter configured
- [ ] Close method implemented
- [ ] Context manager support added

---

## Task 06: Create Authentication

### Overview

Implement authentication mechanism for Domex API requests. Domex uses API key-based authentication where the key is passed in request headers. This task configures the authentication flow and ensures all requests include proper credentials.

### Dependencies

- Task 05: Create DomexClient Class

### Instructions

1. **Identify authentication method**
   - Domex uses API key authentication
   - Key passed in HTTP header
   - Header name: `X-API-Key` or `Authorization: Bearer {key}`
   - No OAuth or JWT required

2. **Update client initialization**
   - Store API key from config
   - Validate API key presence
   - Raise error if key missing and not sandbox

3. **Implement auth header method**
   - Create `_get_auth_headers()` private method
   - Return dictionary with authentication header
   - Format: `{"X-API-Key": self.api_key}`
   - Or Bearer token format if required

4. **Integrate with request method**
   - Update `_request()` method
   - Merge auth headers with request headers
   - Ensure auth headers not overridden
   - Auth headers have priority

5. **Handle authentication errors**
   - Detect 401 Unauthorized responses
   - Raise AuthenticationError with message
   - Log authentication failures
   - Don't retry on auth errors

6. **Implement key validation**
   - Validate key format before use
   - Check key not empty or placeholder
   - Warn if using test/demo key
   - Log key prefix for debugging (first 4 chars only)

7. **Add authentication testing**
   - Create `test_authentication()` method
   - Make test API call
   - Verify credentials work
   - Return boolean result

8. **Handle sandbox authentication**
   - Allow requests without key in sandbox
   - Use demo key if available
   - Log warning when using demo credentials

### Authentication Flow

```
Request Preparation
    ↓
Get API Key from Config
    ↓
Validate Key Format
    ↓
Build Auth Headers
    ↓
Merge with Request Headers
    ↓
Send Request
    ↓
Check Response
    ↓
If 401: Raise AuthenticationError
If 200: Continue
```

### Expected Outcome

- API key authentication implemented
- Auth headers added to all requests
- Validation for API key presence and format
- Error handling for authentication failures
- Test method for credential verification

### Verification Checklist

- [ ] Authentication method identified (API key)
- [ ] API key stored from config
- [ ] `_get_auth_headers()` method created
- [ ] Auth headers merged in request method
- [ ] 401 error handling implemented
- [ ] Key validation added
- [ ] Authentication test method created
- [ ] Sandbox authentication handled

---

## Task 07: Create Request Handler

### Overview

Implement the request handling logic in the DomexClient class. This includes the core `_request()` method that sends HTTP requests, the `request()` public method that wraps it, and specific helper methods for common HTTP operations (GET, POST, PUT, DELETE).

### Dependencies

- Task 06: Create Authentication

### Instructions

1. **Implement _request private method**
   - Build full URL from base URL + endpoint
   - Merge authentication headers
   - Add request ID for tracing
   - Prepare request body (JSON serialization)
   - Handle query parameters

2. **Add request logging**
   - Log request initiation (method, URL)
   - Log request headers (mask sensitive data)
   - Log request body (if debug mode enabled)
   - Generate and log unique request ID

3. **Execute HTTP request**
   - Use session.request() method
   - Pass method, URL, headers, data, params
   - Apply timeout tuple
   - Catch connection errors

4. **Add response logging**
   - Log response status code
   - Log response time (elapsed)
   - Log response headers
   - Log response body (if debug enabled)

5. **Implement response validation**
   - Check response status code
   - Validate content-type is JSON
   - Parse JSON response body
   - Handle empty responses

6. **Create public request method**
   - Define `request()` public method
   - Wrapper around `_request()`
   - Add error handling wrapper
   - Return parsed response

7. **Implement HTTP method helpers**
   - Create `get()` method (calls request with GET)
   - Create `post()` method (calls request with POST)
   - Create `put()` method (calls request with PUT)
   - Create `delete()` method (calls request with DELETE)

8. **Add request preparation**
   - Serialize data to JSON
   - Validate data structure
   - Add content-type header
   - Handle file uploads (if needed)

9. **Implement request ID generation**
   - Generate unique ID per request
   - Use UUID or timestamp-based ID
   - Include in headers (X-Request-ID)
   - Log for correlation

10. **Add connection error handling**
    - Catch requests.ConnectionError
    - Catch requests.Timeout
    - Log error details
    - Pass to error handler (Task 08)

### Request Handler Flow

```
request(method, endpoint, data, params)
    ↓
Build full URL
    ↓
Get auth headers
    ↓
Generate request ID
    ↓
Prepare request data (JSON)
    ↓
Log request details
    ↓
Execute HTTP request
    ↓
Log response details
    ↓
Validate response status
    ↓
Parse JSON response
    ↓
Return parsed data
```

### Expected Outcome

- Functional request handler for API calls
- Request and response logging
- JSON serialization and parsing
- HTTP method helpers for convenience
- Request ID generation for tracing
- Connection error handling

### Verification Checklist

- [ ] `_request()` private method implemented
- [ ] Request logging added
- [ ] HTTP request execution working
- [ ] Response logging added
- [ ] Response validation implemented
- [ ] Public `request()` method created
- [ ] HTTP helper methods created (get, post, put, delete)
- [ ] Request preparation logic added
- [ ] Request ID generation implemented
- [ ] Connection error handling added

---

## Task 08: Create Error Handling

### Overview

Implement comprehensive error handling for the Domex API integration. This includes custom exception classes, error detection and classification, retry logic for transient errors, error logging, and user-friendly error messages.

### Dependencies

- Task 07: Create Request Handler

### Instructions

1. **Create exceptions file**
   - Create `exceptions.py` in domex directory
   - Define custom exception hierarchy
   - Inherit from base ShippingProviderError

2. **Define exception classes**
   - Create `DomexError` base exception
   - Create `DomexAuthenticationError` (401)
   - Create `DomexValidationError` (400)
   - Create `DomexRateLimitError` (429)
   - Create `DomexServerError` (5xx)
   - Create `DomexConnectionError` (network issues)
   - Create `DomexTimeoutError` (request timeout)

3. **Implement error detection**
   - Parse response status codes
   - Extract error message from response body
   - Map status codes to exception classes
   - Handle malformed error responses

4. **Add error context**
   - Include request ID in exceptions
   - Include endpoint and method
   - Include response status code
   - Include original error message

5. **Implement error classification**
   - Classify errors as client/server/network
   - Determine if error is retryable
   - Set retry strategy per error type
   - Log classification for analytics

6. **Add retry logic**
   - Detect retryable errors (5xx, timeout, network)
   - Implement exponential backoff
   - Respect max retry attempts
   - Log retry attempts

7. **Implement error logging**
   - Log all errors with context
   - Use appropriate log levels (ERROR, WARNING)
   - Include stack traces for unexpected errors
   - Mask sensitive data in logs

8. **Create error response parser**
   - Parse Domex error response format
   - Extract error code and message
   - Extract field-specific errors
   - Handle various error formats

9. **Add user-friendly messages**
   - Map technical errors to user messages
   - Provide actionable guidance
   - Localize error messages (English/Sinhala)
   - Include support contact info

10. **Integrate with request handler**
    - Wrap request execution in try-except
    - Catch HTTP errors and raise custom exceptions
    - Catch connection errors and raise DomexConnectionError
    - Catch timeout errors and raise DomexTimeoutError

### Exception Hierarchy

```
ShippingProviderError (base)
    ↓
DomexError
    ├── DomexAuthenticationError (401, 403)
    ├── DomexValidationError (400, 422)
    ├── DomexRateLimitError (429)
    ├── DomexServerError (500, 502, 503)
    ├── DomexConnectionError (network)
    └── DomexTimeoutError (timeout)
```

### Error Classification

| Status Code | Exception Class | Retryable | Retry Strategy |
|-------------|----------------|-----------|----------------|
| 400 | ValidationError | No | Fail immediately |
| 401 | AuthenticationError | No | Fail immediately |
| 403 | AuthenticationError | No | Fail immediately |
| 429 | RateLimitError | Yes | Linear backoff |
| 500 | ServerError | Yes | Exponential backoff |
| 502 | ServerError | Yes | Exponential backoff |
| 503 | ServerError | Yes | Exponential backoff |
| Timeout | TimeoutError | Yes | Exponential backoff |
| Connection | ConnectionError | Yes | Exponential backoff |

### Expected Outcome

- Custom exception classes for all error types
- Error detection and classification
- Retry logic for transient errors
- Comprehensive error logging
- User-friendly error messages
- Integration with request handler

### Verification Checklist

- [ ] `exceptions.py` file created
- [ ] Exception hierarchy defined
- [ ] All exception classes created
- [ ] Error detection logic implemented
- [ ] Error classification working
- [ ] Retry logic with backoff implemented
- [ ] Error logging added
- [ ] Error response parser created
- [ ] User-friendly messages defined
- [ ] Integration with request handler complete

---

## Summary

This document established the foundational configuration and HTTP client infrastructure for Domex courier integration. All tasks create a solid base for implementing the provider interface and business logic in subsequent documents.

### Completed Tasks

1. ✓ Created Domex constants for URLs, endpoints, and configurations
2. ✓ Created Django settings for environment and feature management
3. ✓ Configured API key with security best practices
4. ✓ Created DomexConfig model for tenant-specific settings
5. ✓ Created DomexClient class with HTTP session
6. ✓ Implemented API key authentication
7. ✓ Created request handler with logging
8. ✓ Implemented comprehensive error handling

### Next Steps

Proceed to [02_Tasks-09-15_Provider-Waybill.md](02_Tasks-09-15_Provider-Waybill.md) to implement the DomexProvider class, shipping methods (create, get rates, track, cancel), waybill generation, and label download functionality.
