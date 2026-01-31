# Tasks 17-26: Koombiyo Client and Methods

> **Phase:** 09 - Integrations & Sri Lanka Localizations  
> **SubPhase:** 08 - Koombiyo Courier API  
> **Group:** B - API Client Implementation  
> **Document:** 01 of 02  
> **Tasks Covered:** 17, 18, 19, 20, 21, 22, 23, 24, 25, 26

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [Group-A_Koombiyo-Configuration/02_Tasks-09-16_Model-Admin-Verify.md](../Group-A_Koombiyo-Configuration/02_Tasks-09-16_Model-Admin-Verify.md)
- **→ Next Document:** [02_Tasks-27-34_Provider-Verify.md](02_Tasks-27-34_Provider-Verify.md)

---

## Document Overview

This document covers the creation of the KoombiyoClient HTTP client class with complete request handling capabilities. It establishes the HTTP communication layer for the Koombiyo Courier API, including authentication, error handling, retry logic, timeout configuration, response parsing, custom exceptions, rate limiting, and request logging.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 17 | Create KoombiyoClient Class | High | 45 min |
| 18 | Create Authentication Header | Low | 15 min |
| 19 | Create Request Method | Medium | 30 min |
| 20 | Create Error Handling | Medium | 30 min |
| 21 | Create Retry Logic | Medium | 35 min |
| 22 | Create Timeout Config | Low | 15 min |
| 23 | Create Response Parser | Medium | 25 min |
| 24 | Create Error Exceptions | Medium | 30 min |
| 25 | Create Rate Limiter | Medium | 35 min |
| 26 | Create Request Logging | Low | 20 min |

---

## Task 17: Create KoombiyoClient Class

### Overview
Create the KoombiyoClient class as the foundational HTTP client for communicating with the Koombiyo Courier API. This class manages all HTTP operations, authentication, configuration, and serves as the primary interface for API interactions. It wraps the HTTP library (httpx or requests) and provides a clean, consistent interface for making API calls.

### Dependencies
- Task 16: Verify configuration settings

### Instructions

1. **Create client module structure**
   - Navigate to `backend/apps/shipping/providers/koombiyo/` directory
   - Create new file named `client.py`
   - This module will contain all HTTP client logic

2. **Import required dependencies**
   - Import HTTP library (httpx or requests)
   - Import settings from configuration module
   - Import typing annotations (Dict, Any, Optional)
   - Import logging for request/response tracking

3. **Define KoombiyoClient class**
   - Create class with clear docstring explaining purpose
   - Inherit from object (or base HTTP client if needed)
   - Define class-level constants and configurations

4. **Initialize client attributes**
   - Define `__init__` method accepting configuration parameters
   - Store API credentials (API key, merchant ID)
   - Store base URL for API endpoint
   - Initialize HTTP session or client instance
   - Set default timeout values

5. **Configure HTTP client session**
   - Create reusable HTTP session for connection pooling
   - Set default headers (Content-Type, Accept)
   - Configure session timeout settings
   - Enable/disable SSL verification based on environment

6. **Implement base URL management**
   - Store base URL from configuration
   - Create method to construct full endpoint URLs
   - Handle URL path joining properly
   - Support both production and sandbox environments

7. **Add client lifecycle methods**
   - Implement `__enter__` method for context manager support
   - Implement `__exit__` method for proper cleanup
   - Create `close()` method to release resources
   - Ensure proper session cleanup on exit

8. **Create configuration validation**
   - Validate required credentials are present
   - Check API key format and length
   - Verify merchant ID format
   - Raise clear exceptions for missing configuration

### Client Architecture

```
┌────────────────────────────────────────┐
│         KoombiyoClient                 │
├────────────────────────────────────────┤
│ Attributes:                            │
│ - base_url: str                        │
│ - api_key: str                         │
│ - merchant_id: str                     │
│ - session: HTTPSession                 │
│ - timeout: int                         │
│ - logger: Logger                       │
├────────────────────────────────────────┤
│ Methods:                               │
│ - __init__(config)                     │
│ - _build_url(endpoint)                 │
│ - _get_headers()                       │
│ - request(method, endpoint, data)      │
│ - close()                              │
│ - __enter__() / __exit__()             │
└────────────────────────────────────────┘
```

### Class Attributes

| Attribute | Type | Description | Source |
|-----------|------|-------------|--------|
| base_url | str | API endpoint URL | Configuration |
| api_key | str | Authentication key | Configuration |
| merchant_id | str | Merchant identifier | Configuration |
| session | HTTPSession | Reusable HTTP session | HTTP library |
| timeout | int | Request timeout (seconds) | Configuration/default |
| logger | Logger | Request logger | Python logging |

### Configuration Parameters

| Parameter | Required | Default | Description |
|-----------|----------|---------|-------------|
| api_key | Yes | - | Koombiyo API key |
| merchant_id | Yes | - | Merchant ID |
| base_url | No | From settings | API endpoint |
| timeout | No | 30 | Request timeout |
| verify_ssl | No | True | SSL verification |

### Client Initialization Flow

```
Start
  │
  ├─→ Load configuration
  │   ├─ Get API credentials
  │   ├─ Get base URL
  │   └─ Get timeout settings
  │
  ├─→ Validate configuration
  │   ├─ Check API key present
  │   ├─ Check merchant ID present
  │   └─ Validate format
  │
  ├─→ Initialize HTTP session
  │   ├─ Create session object
  │   ├─ Set default headers
  │   └─ Configure timeouts
  │
  └─→ Ready for requests
```

### Context Manager Support

| Method | Purpose | Actions |
|--------|---------|---------|
| `__enter__` | Enter context | Return self |
| `__exit__` | Exit context | Close session, cleanup |
| Usage | Clean resource management | Automatic cleanup |

### Expected Outcome
- KoombiyoClient class created with complete initialization
- HTTP session configured and ready
- Configuration loaded from settings
- Proper validation and error handling
- Context manager support for clean resource management

### Verification Checklist
- [ ] `client.py` file created in koombiyo directory
- [ ] KoombiyoClient class defined with docstring
- [ ] `__init__` method initializes all attributes
- [ ] HTTP session created and configured
- [ ] Base URL and credentials stored properly
- [ ] Configuration validation implemented
- [ ] Context manager methods defined
- [ ] Close method releases resources

---

## Task 18: Create Authentication Header

### Overview
Implement authentication header generation for Koombiyo API requests. The Koombiyo API uses custom headers (X-API-Key and X-Merchant-ID) for authentication. This task creates a method to generate the proper authentication headers that will be included in every API request.

### Dependencies
- Task 17: Create KoombiyoClient Class

### Instructions

1. **Define authentication header constants**
   - Create constants for header names
   - Define X-API-Key header constant
   - Define X-Merchant-ID header constant
   - Document header requirements in comments

2. **Create header generation method**
   - Implement `_get_headers()` private method
   - Method should return dictionary of headers
   - Include authentication headers
   - Include content type headers

3. **Build authentication headers**
   - Add X-API-Key header with API key value
   - Add X-Merchant-ID header with merchant ID
   - Use values from instance attributes
   - Ensure proper header formatting

4. **Add standard HTTP headers**
   - Include Content-Type: application/json
   - Include Accept: application/json
   - Include User-Agent with app identifier
   - Add any required API version headers

5. **Support custom headers**
   - Allow method to accept optional custom headers
   - Merge custom headers with authentication headers
   - Ensure authentication headers cannot be overridden
   - Return complete header dictionary

6. **Implement header validation**
   - Verify API key is not empty
   - Verify merchant ID is not empty
   - Raise exception if credentials missing
   - Log header generation (without exposing secrets)

### Authentication Header Structure

```
┌─────────────────────────────────────┐
│     HTTP Request Headers            │
├─────────────────────────────────────┤
│ X-API-Key: {api_key}               │ ← Authentication
│ X-Merchant-ID: {merchant_id}       │ ← Identification
│ Content-Type: application/json     │ ← Format
│ Accept: application/json           │ ← Expected response
│ User-Agent: LCC-Koombiyo/1.0       │ ← Client ID
└─────────────────────────────────────┘
```

### Header Components

| Header Name | Type | Source | Required |
|-------------|------|--------|----------|
| X-API-Key | Authentication | Configuration | Yes |
| X-Merchant-ID | Identification | Configuration | Yes |
| Content-Type | Standard | Fixed value | Yes |
| Accept | Standard | Fixed value | Yes |
| User-Agent | Standard | App constant | No |

### Header Generation Flow

```
_get_headers() called
  │
  ├─→ Create base headers dict
  │   ├─ Content-Type: application/json
  │   ├─ Accept: application/json
  │   └─ User-Agent: LCC-Koombiyo/1.0
  │
  ├─→ Add authentication headers
  │   ├─ Validate API key exists
  │   ├─ Validate merchant ID exists
  │   ├─ X-API-Key: {api_key}
  │   └─ X-Merchant-ID: {merchant_id}
  │
  ├─→ Merge custom headers (if provided)
  │   ├─ Add custom headers to dict
  │   └─ Protect auth headers from override
  │
  └─→ Return complete headers dict
```

### Security Considerations

| Aspect | Implementation |
|--------|----------------|
| Key Storage | Never log full API key |
| Header Transmission | HTTPS only |
| Key Validation | Check before sending |
| Error Messages | Don't expose credentials |

### Header Method Signature

| Component | Details |
|-----------|---------|
| Method Name | `_get_headers` |
| Visibility | Private (underscore prefix) |
| Parameters | Optional custom headers dict |
| Return Type | Dict[str, str] |
| Raises | ValueError if credentials missing |

### Expected Outcome
- Authentication headers properly generated
- All required headers included in every request
- Credentials validated before use
- Secure handling of sensitive values
- Support for custom headers when needed

### Verification Checklist
- [ ] `_get_headers()` method created
- [ ] X-API-Key header included
- [ ] X-Merchant-ID header included
- [ ] Standard HTTP headers included
- [ ] Custom headers support implemented
- [ ] Credential validation performed
- [ ] Security best practices followed
- [ ] Method returns proper dictionary format

---

## Task 19: Create Request Method

### Overview
Implement the core request method that handles all HTTP communications with the Koombiyo API. This method provides a unified interface for making GET, POST, PUT, DELETE requests, handling authentication headers, request/response serialization, and integrating with timeout, error handling, and logging systems.

### Dependencies
- Task 18: Create Authentication Header

### Instructions

1. **Define request method signature**
   - Create `request()` method as primary HTTP interface
   - Accept HTTP method parameter (GET, POST, PUT, DELETE)
   - Accept endpoint path parameter
   - Accept optional data/payload parameter
   - Accept optional custom headers parameter

2. **Construct full request URL**
   - Use base URL from client instance
   - Append endpoint path to base URL
   - Ensure proper URL path joining
   - Handle leading/trailing slashes correctly

3. **Prepare request headers**
   - Call `_get_headers()` to get authentication headers
   - Merge with any custom headers provided
   - Ensure authentication headers take precedence
   - Log headers being used (sanitize credentials)

4. **Serialize request data**
   - Convert data parameter to JSON if present
   - Handle dictionary and object serialization
   - Skip serialization for GET requests
   - Validate data format before sending

5. **Execute HTTP request**
   - Use HTTP session to make request
   - Pass method, URL, headers, and data
   - Apply timeout configuration
   - Capture response object

6. **Handle request execution**
   - Wrap request in try-except block
   - Catch connection errors and timeouts
   - Catch HTTP errors (4xx, 5xx)
   - Log request details before sending

7. **Return raw response**
   - Return complete HTTP response object
   - Don't parse response in this method
   - Allow response parser to handle parsing
   - Include status code and headers

8. **Integrate with other components**
   - Use timeout from configuration (Task 22)
   - Trigger error handling on failures (Task 20)
   - Support retry logic integration (Task 21)
   - Enable request logging (Task 26)

### Request Method Architecture

```
┌────────────────────────────────────┐
│     request(method, endpoint, data) │
├────────────────────────────────────┤
│ 1. Build full URL                  │
│    base_url + endpoint             │
│                                    │
│ 2. Get headers                     │
│    _get_headers() + custom         │
│                                    │
│ 3. Serialize data                  │
│    dict → JSON                     │
│                                    │
│ 4. Execute HTTP request            │
│    session.request(...)            │
│                                    │
│ 5. Return response                 │
│    HTTP Response object            │
└────────────────────────────────────┘
```

### Method Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| method | str | Yes | - | HTTP method (GET/POST/PUT/DELETE) |
| endpoint | str | Yes | - | API endpoint path |
| data | dict | No | None | Request payload |
| headers | dict | No | None | Custom headers |
| timeout | int | No | Instance default | Request timeout |

### HTTP Methods Support

| Method | Use Case | Has Body | Idempotent |
|--------|----------|----------|------------|
| GET | Retrieve data | No | Yes |
| POST | Create resource | Yes | No |
| PUT | Update resource | Yes | Yes |
| DELETE | Delete resource | No | Yes |

### Request Flow Diagram

```
request() called
  │
  ├─→ Validate parameters
  │   ├─ Check method is valid
  │   ├─ Check endpoint is string
  │   └─ Validate data format
  │
  ├─→ Build URL
  │   └─ base_url + endpoint → full_url
  │
  ├─→ Prepare headers
  │   ├─ Get auth headers
  │   └─ Merge custom headers
  │
  ├─→ Serialize data (if present)
  │   └─ dict → JSON string
  │
  ├─→ Log request (Task 26)
  │   ├─ Log method and URL
  │   └─ Log headers (sanitized)
  │
  ├─→ Execute HTTP request
  │   ├─ session.request(...)
  │   ├─ Apply timeout
  │   └─ Capture response
  │
  ├─→ Log response (Task 26)
  │   ├─ Log status code
  │   └─ Log response time
  │
  └─→ Return response object
```

### URL Construction

| Component | Example | Notes |
|-----------|---------|-------|
| Base URL | `https://api.koombiyo.com` | From configuration |
| Endpoint | `/api/v1/shipments` | Method parameter |
| Full URL | `https://api.koombiyo.com/api/v1/shipments` | Constructed |

### Error Conditions

| Error Type | When It Occurs | Handling |
|------------|----------------|----------|
| Connection Error | Network failure | Raise, trigger retry |
| Timeout Error | Request exceeds timeout | Raise, trigger retry |
| HTTP Error | 4xx/5xx status | Raise, trigger error handler |
| Invalid Method | Unknown HTTP method | Raise immediately |

### Integration Points

| Component | Integration | Purpose |
|-----------|-------------|---------|
| Task 18 | _get_headers() | Authentication |
| Task 20 | Error handling | Process failures |
| Task 21 | Retry logic | Automatic retries |
| Task 22 | Timeout config | Request timeouts |
| Task 26 | Request logging | Audit trail |

### Expected Outcome
- Generic request method handles all HTTP methods
- Proper URL construction and header management
- Request data serialized correctly
- Response returned for further processing
- Integration with timeout, retry, and logging

### Verification Checklist
- [ ] `request()` method created with full signature
- [ ] URL construction handles all edge cases
- [ ] Authentication headers included automatically
- [ ] Request data serialization works
- [ ] All HTTP methods supported (GET/POST/PUT/DELETE)
- [ ] Error conditions handled properly
- [ ] Timeout configuration applied
- [ ] Returns response object for parsing

---

## Task 20: Create Error Handling

### Overview
Implement comprehensive error handling for Koombiyo API requests. This system detects, categorizes, and handles various error conditions including network errors, authentication failures, validation errors, rate limiting, and server errors. It provides clear error messages and integrates with the retry logic system.

### Dependencies
- Task 19: Create Request Method

### Instructions

1. **Define error categories**
   - Identify different error types (network, auth, validation, API)
   - Map HTTP status codes to error types
   - Define error severity levels
   - Document expected error scenarios

2. **Create error detection logic**
   - Check HTTP response status codes
   - Identify 4xx client errors vs 5xx server errors
   - Detect network and timeout errors
   - Parse error messages from API responses

3. **Implement status code handling**
   - Handle 400 Bad Request (validation errors)
   - Handle 401 Unauthorized (authentication failures)
   - Handle 403 Forbidden (permission errors)
   - Handle 404 Not Found (resource errors)
   - Handle 429 Too Many Requests (rate limiting)
   - Handle 500 Internal Server Error (server issues)
   - Handle 502/503/504 Gateway/Service errors

4. **Parse API error responses**
   - Extract error messages from response body
   - Parse error codes if provided
   - Extract field-specific validation errors
   - Handle both structured and unstructured errors

5. **Create error handling method**
   - Implement `_handle_error()` private method
   - Accept response object as parameter
   - Determine error type based on status code
   - Extract error details from response
   - Raise appropriate exception type

6. **Integrate with request method**
   - Check response status after request
   - Call error handler for error status codes
   - Pass response to error handler
   - Allow errors to propagate to caller

7. **Support error retry decisions**
   - Determine which errors should trigger retry
   - 5xx errors → retry
   - Timeout errors → retry
   - 401/403 errors → don't retry
   - 400 validation errors → don't retry
   - 429 rate limit → retry with backoff

8. **Log error details**
   - Log error type and status code
   - Log error message from API
   - Log request details that caused error
   - Don't log sensitive data

### Error Handling Flow

```
Response received
  │
  ├─→ Check status code
  │   │
  │   ├─ 2xx Success → Return response
  │   │
  │   ├─ 4xx Client Error
  │   │   ├─ Parse error message
  │   │   ├─ Log error details
  │   │   └─ Raise client exception
  │   │
  │   ├─ 5xx Server Error
  │   │   ├─ Parse error message
  │   │   ├─ Log error details
  │   │   ├─ Mark for retry
  │   │   └─ Raise server exception
  │   │
  │   └─ Network/Timeout Error
  │       ├─ Log error details
  │       ├─ Mark for retry
  │       └─ Raise network exception
  │
  └─→ Continue processing
```

### HTTP Status Code Mapping

| Status Code | Category | Error Type | Retry? | Description |
|-------------|----------|------------|--------|-------------|
| 400 | Client | Validation | No | Bad request data |
| 401 | Client | Authentication | No | Invalid credentials |
| 403 | Client | Authorization | No | Access denied |
| 404 | Client | Not Found | No | Resource doesn't exist |
| 429 | Client | Rate Limit | Yes | Too many requests |
| 500 | Server | Internal | Yes | Server error |
| 502 | Server | Gateway | Yes | Bad gateway |
| 503 | Server | Unavailable | Yes | Service unavailable |
| 504 | Server | Timeout | Yes | Gateway timeout |

### Error Response Structure

```
Koombiyo API Error Response
┌────────────────────────────────┐
│ {                              │
│   "success": false,            │
│   "error": {                   │
│     "code": "VALIDATION_ERROR",│
│     "message": "Invalid data", │
│     "details": {               │
│       "field": "pickup_date",  │
│       "issue": "Invalid format"│
│     }                          │
│   }                            │
│ }                              │
└────────────────────────────────┘
```

### Error Extraction Process

| Step | Action | Purpose |
|------|--------|---------|
| 1 | Check response.status_code | Identify error category |
| 2 | Parse response.json() | Extract error structure |
| 3 | Get error message | Human-readable description |
| 4 | Get error code | Machine-readable identifier |
| 5 | Get field errors | Validation details |

### Error Decision Matrix

| Error Condition | Log Level | Exception Type | Retry | Notify |
|----------------|-----------|----------------|-------|--------|
| Network failure | ERROR | NetworkError | Yes | No |
| Timeout | WARNING | TimeoutError | Yes | No |
| 401 Auth | ERROR | AuthError | No | Yes |
| 400 Validation | WARNING | ValidationError | No | No |
| 500 Server | ERROR | APIError | Yes | Yes |
| 429 Rate limit | WARNING | RateLimitError | Yes | No |

### Error Handler Method

| Aspect | Details |
|--------|---------|
| Method Name | `_handle_error` |
| Parameters | response: HTTPResponse |
| Returns | None (raises exception) |
| Raises | Custom exception based on error type |

### Integration with Retry Logic

```
Error occurs
  │
  ├─→ _handle_error() examines error
  │   │
  │   ├─ Retryable? (5xx, timeout, 429)
  │   │   ├─ Set retry flag
  │   │   └─ Raise with retry marker
  │   │
  │   └─ Not retryable? (4xx)
  │       └─ Raise without retry marker
  │
  └─→ Retry logic checks retry flag
      │
      ├─ Retry flag set → Retry request
      │
      └─ No retry flag → Propagate error
```

### Expected Outcome
- All error conditions properly detected and categorized
- Clear, informative error messages
- Appropriate exceptions raised for each error type
- Integration with retry logic for transient errors
- Comprehensive error logging

### Verification Checklist
- [ ] `_handle_error()` method created
- [ ] All HTTP status codes handled
- [ ] Error messages extracted from responses
- [ ] Appropriate exceptions raised
- [ ] Retry decisions made correctly
- [ ] Error logging implemented
- [ ] Integration with request method complete
- [ ] Network and timeout errors handled

---

## Task 21: Create Retry Logic

### Overview
Implement automatic retry logic with exponential backoff for transient errors. This system automatically retries failed requests for network errors, timeouts, and server errors (5xx), using an exponential backoff strategy to avoid overwhelming the API. It respects maximum retry limits and provides clear feedback about retry attempts.

### Dependencies
- Task 20: Create Error Handling

### Instructions

1. **Define retry configuration**
   - Set maximum number of retry attempts (default: 3)
   - Define initial backoff delay (default: 1 second)
   - Set maximum backoff delay (default: 60 seconds)
   - Configure backoff multiplier (default: 2 for exponential)

2. **Identify retryable errors**
   - Network connection errors → retryable
   - Timeout errors → retryable
   - 5xx server errors → retryable
   - 429 rate limit errors → retryable
   - 4xx client errors → not retryable
   - Authentication errors → not retryable

3. **Implement exponential backoff**
   - Calculate delay: initial_delay * (multiplier ^ attempt)
   - Apply jitter to prevent thundering herd
   - Cap delay at maximum backoff value
   - Wait specified delay before retry

4. **Create retry decorator or wrapper**
   - Implement `_retry_request()` method
   - Wrap the actual request execution
   - Accept request parameters
   - Loop through retry attempts
   - Apply backoff between attempts

5. **Track retry attempts**
   - Maintain counter for current attempt number
   - Log each retry attempt with attempt number
   - Include error that triggered retry
   - Track total retry time

6. **Implement retry loop logic**
   - Execute request attempt
   - If successful → return response
   - If error occurs → check if retryable
   - If retryable and attempts remain → backoff and retry
   - If not retryable or max attempts → raise error

7. **Handle maximum retries exceeded**
   - After all retry attempts exhausted
   - Raise final exception with details
   - Include information about all retry attempts
   - Log retry failure with context

8. **Integrate with request method**
   - Wrap request method calls with retry logic
   - Pass through all request parameters
   - Apply retry only when appropriate
   - Allow disabling retry for specific requests

### Retry Logic Flow

```
request() called
  │
  └─→ _retry_request() wrapper
      │
      ├─→ Attempt 1
      │   ├─ Execute request
      │   ├─ Success? → Return response
      │   └─ Retryable error?
      │       ├─ No → Raise error
      │       └─ Yes → Continue
      │
      ├─→ Backoff (1 second)
      │   └─ Sleep with jitter
      │
      ├─→ Attempt 2
      │   ├─ Execute request
      │   ├─ Success? → Return response
      │   └─ Retryable error?
      │       ├─ No → Raise error
      │       └─ Yes → Continue
      │
      ├─→ Backoff (2 seconds)
      │   └─ Sleep with jitter
      │
      ├─→ Attempt 3
      │   ├─ Execute request
      │   ├─ Success? → Return response
      │   └─ Retryable error?
      │       ├─ No → Raise error
      │       └─ Yes → Continue
      │
      └─→ Max attempts reached
          └─ Raise with all attempt details
```

### Retry Configuration

| Parameter | Default | Description | Range |
|-----------|---------|-------------|-------|
| max_retries | 3 | Maximum retry attempts | 1-5 |
| initial_delay | 1.0 | First backoff delay (seconds) | 0.5-5.0 |
| max_delay | 60.0 | Maximum backoff delay (seconds) | 10-300 |
| backoff_multiplier | 2.0 | Exponential growth factor | 1.5-3.0 |
| jitter | True | Add randomness to delay | Boolean |

### Exponential Backoff Calculation

| Attempt | Base Delay | Formula | Example Delay |
|---------|------------|---------|---------------|
| 1 | N/A | No delay | 0s |
| 2 | initial_delay | 1.0 * 2^0 | 1s |
| 3 | initial_delay | 1.0 * 2^1 | 2s |
| 4 | initial_delay | 1.0 * 2^2 | 4s |
| 5 | initial_delay | 1.0 * 2^3 | 8s |

### Jitter Implementation

```
Base backoff delay calculated
  │
  ├─→ Add random jitter
  │   └─ delay += random(-0.1 * delay, +0.1 * delay)
  │
  ├─→ Prevents thundering herd
  │   └─ Multiple clients don't retry simultaneously
  │
  └─→ Final delay with randomness
```

### Retryable vs Non-Retryable Errors

| Error Category | Retryable | Reason |
|----------------|-----------|--------|
| Network Error | Yes | Transient connection issue |
| Timeout | Yes | May succeed with retry |
| 500 Server Error | Yes | Temporary server issue |
| 502 Bad Gateway | Yes | Gateway/proxy issue |
| 503 Service Unavailable | Yes | Temporary unavailability |
| 504 Gateway Timeout | Yes | Gateway timeout |
| 429 Rate Limit | Yes | Wait and retry |
| 400 Bad Request | No | Invalid data (won't change) |
| 401 Unauthorized | No | Invalid credentials |
| 403 Forbidden | No | Access denied |
| 404 Not Found | No | Resource doesn't exist |

### Retry State Tracking

| Information | Tracked | Purpose |
|-------------|---------|---------|
| Attempt number | Yes | Know current attempt |
| Total attempts | Yes | Enforce max limit |
| Last error | Yes | Understand failure |
| Total backoff time | Yes | Track delay cost |
| Request parameters | Yes | Re-execute request |

### Retry Method Signature

| Component | Details |
|-----------|---------|
| Method Name | `_retry_request` |
| Parameters | method, endpoint, data, headers |
| Returns | Response object |
| Raises | Final exception after max retries |

### Logging for Retries

| Log Point | Level | Information |
|-----------|-------|-------------|
| Retry attempt | INFO | Attempt number, error, backoff |
| Backoff wait | DEBUG | Wait duration |
| Retry success | INFO | Attempt number succeeded |
| Max retries | ERROR | All attempts failed |

### Expected Outcome
- Automatic retry for transient failures
- Exponential backoff prevents API overload
- Maximum retry limit prevents infinite loops
- Clear logging of retry attempts
- Improved reliability for network issues

### Verification Checklist
- [ ] Retry configuration defined
- [ ] Exponential backoff implemented correctly
- [ ] Jitter added to backoff delays
- [ ] Retryable errors identified properly
- [ ] Maximum retry limit enforced
- [ ] Retry attempts logged
- [ ] Non-retryable errors fail immediately
- [ ] Integration with error handling complete

---

## Task 22: Create Timeout Config

### Overview
Implement comprehensive timeout configuration for HTTP requests to prevent hanging requests and ensure responsive failure. This includes both connection timeout (time to establish connection) and read timeout (time to receive response), with sensible defaults and configuration override support.

### Dependencies
- Task 19: Create Request Method

### Instructions

1. **Define timeout types**
   - Connection timeout: time to establish TCP connection
   - Read timeout: time to receive complete response
   - Total timeout: overall request time limit
   - Understand timeout behavior for each type

2. **Set default timeout values**
   - Connection timeout: 5 seconds (reasonable for establishment)
   - Read timeout: 30 seconds (allow for API processing)
   - Total timeout: 35 seconds (connection + read + buffer)
   - Document rationale for each value

3. **Create timeout configuration**
   - Define timeout constants or configuration class
   - Support tuple format (connect, read) for HTTP library
   - Allow separate configuration of each timeout type
   - Support None for no timeout (not recommended)

4. **Implement timeout in request method**
   - Pass timeout to HTTP session request
   - Use tuple format: (connect_timeout, read_timeout)
   - Apply to all request types (GET, POST, PUT, DELETE)
   - Ensure timeout is always specified

5. **Support timeout override**
   - Allow request method to accept timeout parameter
   - Override default timeout for specific requests
   - Validate override values are positive
   - Document when overrides are appropriate

6. **Handle timeout errors**
   - Catch connection timeout exceptions
   - Catch read timeout exceptions
   - Raise custom timeout exception
   - Mark timeout errors as retryable
   - Log timeout events with details

7. **Configure timeout from settings**
   - Load timeout values from configuration
   - Support environment-specific timeouts
   - Allow production vs development differences
   - Validate loaded timeout values

8. **Add timeout documentation**
   - Document timeout behavior in docstrings
   - Explain when timeouts occur
   - Provide guidance on timeout tuning
   - Include examples of timeout configuration

### Timeout Types

```
┌────────────────────────────────────────┐
│         HTTP Request Timeline          │
├────────────────────────────────────────┤
│                                        │
│ ├─ Connection Timeout (5s)             │
│ │  └─ Establish TCP connection        │
│ │                                     │
│ └─ Read Timeout (30s)                  │
│    └─ Receive complete response       │
│                                        │
│ Total Timeout (35s)                    │
│ └─ Overall request limit               │
│                                        │
└────────────────────────────────────────┘
```

### Timeout Configuration

| Timeout Type | Default | Min | Max | Purpose |
|-------------|---------|-----|-----|---------|
| Connection | 5s | 2s | 10s | TCP connection establishment |
| Read | 30s | 10s | 120s | Response reception |
| Total | 35s | 15s | 150s | Overall request limit |

### Timeout Implementation

| Aspect | Implementation |
|--------|----------------|
| Format | Tuple (connect, read) |
| HTTP Library | Depends on library (httpx/requests) |
| Default | (5, 30) |
| Override | Per-request parameter |

### Timeout Configuration Flow

```
Request initiated
  │
  ├─→ Load default timeouts
  │   ├─ Connection: 5s
  │   ├─ Read: 30s
  │   └─ Total: 35s
  │
  ├─→ Check for override
  │   ├─ Request-specific timeout provided?
  │   ├─ Yes → Use override
  │   └─ No → Use default
  │
  ├─→ Validate timeout values
  │   ├─ Positive numbers?
  │   └─ Reasonable ranges?
  │
  ├─→ Apply to request
  │   └─ Pass to HTTP library
  │
  └─→ Monitor timeout
      ├─ Connection timeout → Retry
      └─ Read timeout → Retry
```

### Timeout Error Handling

| Error Type | Exception | Message | Retry |
|------------|-----------|---------|-------|
| Connection Timeout | ConnectionTimeout | "Failed to connect to API" | Yes |
| Read Timeout | ReadTimeout | "API response too slow" | Yes |
| Total Timeout | TotalTimeout | "Request exceeded time limit" | Yes |

### Timeout Tuning Guidelines

| Scenario | Connection | Read | Rationale |
|----------|------------|------|-----------|
| Standard requests | 5s | 30s | Balanced performance |
| Quick operations | 3s | 10s | Fast failure detection |
| Large payloads | 10s | 60s | Allow for data transfer |
| Background jobs | 15s | 120s | Longer tolerance |

### Timeout Configuration in Settings

```
Settings structure:
┌─────────────────────────────────┐
│ KOOMBIYO_CONFIG = {             │
│   'TIMEOUTS': {                 │
│     'connect': 5,               │
│     'read': 30,                 │
│     'total': 35                 │
│   }                             │
│ }                               │
└─────────────────────────────────┘
```

### Timeout Override Example

| Use Case | Override Reason | Custom Timeout |
|----------|----------------|----------------|
| Quick health check | Fast response expected | (2, 5) |
| File upload | Large data transfer | (10, 90) |
| Bulk operations | Complex processing | (15, 120) |

### Expected Outcome
- Timeout configuration for all requests
- Separate control of connection and read timeouts
- Sensible defaults with override capability
- Timeout errors properly caught and handled
- Integration with retry logic

### Verification Checklist
- [ ] Default timeout values defined
- [ ] Connection timeout configured (5s)
- [ ] Read timeout configured (30s)
- [ ] Timeout applied to all requests
- [ ] Timeout override support implemented
- [ ] Timeout errors caught and logged
- [ ] Timeout errors marked as retryable
- [ ] Configuration loaded from settings

---

## Task 23: Create Response Parser

### Overview
Implement a response parser that validates and extracts data from Koombiyo API responses. The parser checks for success indicators, validates response structure, extracts data payloads, handles error responses, and converts API data into usable Python objects. This ensures consistent response handling across all API methods.

### Dependencies
- Task 19: Create Request Method

### Instructions

1. **Understand Koombiyo response structure**
   - Identify common response format
   - Locate success/error indicators
   - Understand data payload location
   - Document response schema

2. **Create response parser method**
   - Implement `_parse_response()` method
   - Accept HTTP response object as parameter
   - Return parsed data dictionary or object
   - Raise exception on parse failures

3. **Validate response format**
   - Check response has valid JSON
   - Verify expected structure exists
   - Validate required fields present
   - Handle malformed responses

4. **Check success indicator**
   - Look for "success" field or status indicator
   - Determine if request succeeded
   - If success=false → handle as error
   - If success=true → extract data

5. **Extract data payload**
   - Locate data in response structure
   - Extract relevant fields
   - Convert to appropriate Python types
   - Handle nested data structures

6. **Handle error responses**
   - Detect error indicator in response
   - Extract error message and code
   - Extract detailed error information
   - Raise appropriate exception

7. **Implement type conversion**
   - Convert date strings to datetime objects
   - Convert numeric strings to int/float
   - Handle null/empty values
   - Preserve original data for debugging

8. **Add response validation**
   - Validate required fields in data
   - Check data types match expectations
   - Validate enum values
   - Log validation issues

### Koombiyo Response Structure

```
Success Response:
┌────────────────────────────────┐
│ {                              │
│   "success": true,             │ ← Check this
│   "data": {                    │ ← Extract this
│     "waybill_number": "WB123", │
│     "status": "pending",       │
│     "tracking_url": "..."      │
│   },                           │
│   "message": "Success"         │
│ }                              │
└────────────────────────────────┘

Error Response:
┌────────────────────────────────┐
│ {                              │
│   "success": false,            │ ← Check this
│   "error": {                   │ ← Extract this
│     "code": "INVALID_DATA",    │
│     "message": "Error details" │
│   }                            │
│ }                              │
└────────────────────────────────┘
```

### Response Parsing Flow

```
Response object received
  │
  ├─→ Parse JSON
  │   ├─ response.json()
  │   ├─ Catch JSON decode errors
  │   └─ Validate JSON structure
  │
  ├─→ Check success indicator
  │   │
  │   ├─ success == true
  │   │   ├─ Extract data payload
  │   │   ├─ Validate data structure
  │   │   ├─ Convert types
  │   │   └─ Return parsed data
  │   │
  │   └─ success == false
  │       ├─ Extract error details
  │       └─ Raise exception
  │
  └─→ Return parsed result
```

### Response Parser Method

| Aspect | Details |
|--------|---------|
| Method Name | `_parse_response` |
| Parameters | response: HTTPResponse |
| Returns | Dict[str, Any] (parsed data) |
| Raises | ParseError, APIError |

### Parsing Steps

| Step | Action | Error Handling |
|------|--------|----------------|
| 1 | Parse JSON | Raise ParseError |
| 2 | Check success field | Raise if missing |
| 3 | Extract data/error | Raise if not found |
| 4 | Validate structure | Raise if invalid |
| 5 | Convert types | Log warnings |
| 6 | Return result | - |

### Data Type Conversions

| API Type | Python Type | Example |
|----------|-------------|---------|
| Date string | datetime | "2026-01-31" → datetime(2026, 1, 31) |
| Number string | int/float | "123.45" → 123.45 |
| Boolean string | bool | "true" → True |
| Null | None | null → None |
| Array | list | [...] → [...] |
| Object | dict | {...} → {...} |

### Response Validation

| Check | Purpose | Action |
|-------|---------|--------|
| Required fields | Data completeness | Raise if missing |
| Field types | Type safety | Convert or raise |
| Value ranges | Data validity | Validate constraints |
| Enum values | Valid options | Check against allowed |

### Error Response Parsing

```
Error detected in response
  │
  ├─→ Extract error object
  │   ├─ error.code
  │   ├─ error.message
  │   └─ error.details
  │
  ├─→ Map to exception type
  │   ├─ VALIDATION_ERROR → ValidationError
  │   ├─ AUTH_ERROR → AuthError
  │   └─ Other → APIError
  │
  └─→ Raise exception with details
```

### Common Response Fields

| Field | Location | Type | Required |
|-------|----------|------|----------|
| success | Root | boolean | Yes |
| data | Root | object | If success=true |
| error | Root | object | If success=false |
| message | Root | string | No |

### Parser Error Conditions

| Condition | Exception | Message |
|-----------|-----------|---------|
| Invalid JSON | ParseError | "Invalid JSON response" |
| Missing success | ParseError | "Response missing success field" |
| Missing data | ParseError | "Response missing data" |
| Invalid structure | ParseError | "Unexpected response structure" |

### Expected Outcome
- Reliable response parsing for all API calls
- Success/error detection and handling
- Data extraction and type conversion
- Validation of response structure
- Clear error messages for parse failures

### Verification Checklist
- [ ] `_parse_response()` method created
- [ ] JSON parsing with error handling
- [ ] Success indicator checked
- [ ] Data payload extracted correctly
- [ ] Error responses handled
- [ ] Type conversions implemented
- [ ] Response validation performed
- [ ] Clear exceptions for parse errors

---

## Task 24: Create Error Exceptions

### Overview
Define custom exception classes for different Koombiyo API error scenarios. This provides a clear, type-safe way to handle different error conditions throughout the application. Each exception type represents a specific error category, making error handling more precise and enabling appropriate retry and recovery strategies.

### Dependencies
- Task 20: Create Error Handling

### Instructions

1. **Create exceptions module**
   - Navigate to `backend/apps/shipping/providers/koombiyo/` directory
   - Create new file named `exceptions.py`
   - This module will contain all custom exception classes

2. **Define base exception class**
   - Create `KoombiyoAPIException` as base class
   - Inherit from Python's built-in Exception
   - Add common attributes (message, status_code, response)
   - Implement `__str__` and `__repr__` methods

3. **Create authentication exception**
   - Define `KoombiyoAuthError` class
   - Inherit from `KoombiyoAPIException`
   - Used for 401 Unauthorized errors
   - Store credential-related error details

4. **Create validation exception**
   - Define `KoombiyoValidationError` class
   - Inherit from `KoombiyoAPIException`
   - Used for 400 Bad Request errors
   - Store field-specific validation errors

5. **Create rate limit exception**
   - Define `KoombiyoRateLimitError` class
   - Inherit from `KoombiyoAPIException`
   - Used for 429 Too Many Requests
   - Store retry-after information

6. **Create network exception**
   - Define `KoombiyoNetworkError` class
   - Inherit from `KoombiyoAPIException`
   - Used for connection failures
   - Store network error details

7. **Create timeout exception**
   - Define `KoombiyoTimeoutError` class
   - Inherit from `KoombiyoAPIException`
   - Used for timeout errors
   - Store timeout type (connection/read)

8. **Create server error exception**
   - Define `KoombiyoServerError` class
   - Inherit from `KoombiyoAPIException`
   - Used for 5xx server errors
   - Mark as retryable

9. **Add exception attributes**
   - message: Human-readable error description
   - status_code: HTTP status code (if applicable)
   - error_code: API-specific error code
   - response: Original response object
   - is_retryable: Boolean flag for retry logic

### Exception Hierarchy

```
Exception (Python built-in)
  │
  └── KoombiyoAPIException (Base)
      │
      ├── KoombiyoAuthError (401)
      │   └── Invalid credentials
      │
      ├── KoombiyoValidationError (400)
      │   └── Invalid data
      │
      ├── KoombiyoRateLimitError (429)
      │   └── Too many requests
      │
      ├── KoombiyoNetworkError
      │   └── Connection failure
      │
      ├── KoombiyoTimeoutError
      │   └── Request timeout
      │
      └── KoombiyoServerError (5xx)
          └── Server error
```

### Exception Classes

| Exception Class | HTTP Status | Retryable | Use Case |
|----------------|-------------|-----------|----------|
| KoombiyoAPIException | Any | Varies | Base exception |
| KoombiyoAuthError | 401, 403 | No | Authentication failure |
| KoombiyoValidationError | 400 | No | Invalid request data |
| KoombiyoRateLimitError | 429 | Yes | Rate limit exceeded |
| KoombiyoNetworkError | N/A | Yes | Network/connection issues |
| KoombiyoTimeoutError | N/A | Yes | Request timeout |
| KoombiyoServerError | 500-599 | Yes | Server-side errors |

### Base Exception Structure

```
class KoombiyoAPIException:
  │
  ├── Attributes:
  │   ├─ message: str
  │   ├─ status_code: Optional[int]
  │   ├─ error_code: Optional[str]
  │   ├─ response: Optional[Response]
  │   └─ is_retryable: bool
  │
  └── Methods:
      ├─ __init__(message, ...)
      ├─ __str__() → string representation
      └─ __repr__() → detailed representation
```

### Exception Attributes

| Attribute | Type | Purpose | Required |
|-----------|------|---------|----------|
| message | str | Human-readable error | Yes |
| status_code | int | HTTP status code | No |
| error_code | str | API error code | No |
| response | Response | Original response | No |
| is_retryable | bool | Can retry? | Yes |

### Exception Usage Examples

| Scenario | Exception Raised | Attributes Set |
|----------|------------------|----------------|
| Invalid API key | KoombiyoAuthError | message, status_code=401 |
| Missing required field | KoombiyoValidationError | message, status_code=400, field_errors |
| Too many requests | KoombiyoRateLimitError | message, status_code=429, retry_after |
| Connection refused | KoombiyoNetworkError | message, original_error |
| Request timeout | KoombiyoTimeoutError | message, timeout_type |
| Internal server error | KoombiyoServerError | message, status_code=500 |

### Validation Error Details

```
KoombiyoValidationError structure:
┌─────────────────────────────────┐
│ message: "Validation failed"    │
│ status_code: 400                │
│ field_errors: {                 │
│   "pickup_date": [              │
│     "Invalid date format"       │
│   ],                            │
│   "recipient_phone": [          │
│     "Invalid phone number"      │
│   ]                             │
│ }                               │
└─────────────────────────────────┘
```

### Rate Limit Error Details

```
KoombiyoRateLimitError structure:
┌─────────────────────────────────┐
│ message: "Rate limit exceeded"  │
│ status_code: 429                │
│ retry_after: 60 (seconds)       │
│ is_retryable: True              │
└─────────────────────────────────┘
```

### Exception Initialization

| Exception | Additional Parameters | Purpose |
|-----------|----------------------|---------|
| KoombiyoValidationError | field_errors: dict | Field-specific errors |
| KoombiyoRateLimitError | retry_after: int | Retry delay |
| KoombiyoTimeoutError | timeout_type: str | Connection/read |
| KoombiyoNetworkError | original_error: Exception | Underlying error |

### Exception String Representation

| Method | Output | Purpose |
|--------|--------|---------|
| `__str__` | Error message | User-friendly |
| `__repr__` | Full details | Debugging |

### Expected Outcome
- Complete set of custom exception classes
- Clear exception hierarchy
- Type-safe error handling
- Retryable flag for each exception type
- Detailed error information in exceptions

### Verification Checklist
- [ ] `exceptions.py` file created
- [ ] Base `KoombiyoAPIException` defined
- [ ] `KoombiyoAuthError` implemented
- [ ] `KoombiyoValidationError` implemented
- [ ] `KoombiyoRateLimitError` implemented
- [ ] `KoombiyoNetworkError` implemented
- [ ] `KoombiyoTimeoutError` implemented
- [ ] `KoombiyoServerError` implemented
- [ ] All exceptions have `is_retryable` flag
- [ ] String methods implemented

---

## Task 25: Create Rate Limiter

### Overview
Implement a rate limiter to prevent exceeding Koombiyo API rate limits. This component uses the token bucket algorithm to control the rate of API requests, ensuring compliance with API rate limits (typically 10 requests per second). It provides automatic throttling, prevents rate limit errors, and improves overall API reliability.

### Dependencies
- Task 17: Create KoombiyoClient Class

### Instructions

1. **Understand rate limit requirements**
   - Identify Koombiyo API rate limit (10 requests/second)
   - Understand burst allowance
   - Determine rate limit scope (per key, per IP)
   - Document rate limit behavior

2. **Choose rate limiting algorithm**
   - Select token bucket algorithm
   - Tokens replenish at constant rate
   - Requests consume tokens
   - Bucket has maximum capacity

3. **Create rate limiter class**
   - Define `RateLimiter` class
   - Store rate limit configuration
   - Track token bucket state
   - Provide acquire method

4. **Implement token bucket algorithm**
   - Initialize bucket with full capacity
   - Replenish tokens at specified rate
   - Consume token on each request
   - Block when no tokens available

5. **Calculate token replenishment**
   - Determine time since last replenishment
   - Calculate tokens to add based on elapsed time
   - Add tokens to bucket (up to capacity)
   - Update last replenishment timestamp

6. **Implement acquire method**
   - Check if tokens available
   - If available → consume token and proceed
   - If not → wait for token replenishment
   - Return when token acquired

7. **Add rate limiter to client**
   - Create rate limiter instance in KoombiyoClient
   - Initialize with configured rate limit
   - Call acquire before each request
   - Integrate seamlessly with request flow

8. **Handle rate limit configuration**
   - Load rate limit from settings
   - Support different limits for different environments
   - Allow disabling rate limiting for testing
   - Validate rate limit values

### Token Bucket Algorithm

```
Token Bucket Visualization:
┌────────────────────────────┐
│   Token Bucket (Max: 10)   │
├────────────────────────────┤
│ ●●●●●●●●●●                 │ ← 10 tokens (full)
│                            │
│ Refill: 10 tokens/second   │
│ Consume: 1 token/request   │
└────────────────────────────┘

Request Flow:
┌─────────────┐    ┌──────────────┐    ┌──────────────┐
│   Request   │───▶│ Acquire Token│───▶│ Execute Req  │
└─────────────┘    └──────────────┘    └──────────────┘
                         │
                         ├─ Tokens available → Proceed
                         └─ No tokens → Wait for refill
```

### Rate Limiter Configuration

| Parameter | Value | Description |
|-----------|-------|-------------|
| rate | 10 | Requests per second |
| burst | 10 | Bucket capacity |
| refill_rate | 10/sec | Token replenishment rate |
| wait_timeout | 5 sec | Max wait for token |

### Rate Limiter Class Structure

```
class RateLimiter:
  │
  ├── Attributes:
  │   ├─ rate: float (tokens/second)
  │   ├─ capacity: int (max tokens)
  │   ├─ tokens: float (current tokens)
  │   ├─ last_update: float (timestamp)
  │   └─ lock: threading.Lock
  │
  └── Methods:
      ├─ __init__(rate, capacity)
      ├─ _refill() → None
      ├─ acquire(tokens=1) → None
      └─ try_acquire(tokens=1) → bool
```

### Token Replenishment Logic

```
acquire() called
  │
  ├─→ Calculate elapsed time
  │   └─ now - last_update
  │
  ├─→ Calculate new tokens
  │   └─ elapsed_time * rate
  │
  ├─→ Update bucket
  │   ├─ Add new tokens
  │   ├─ Cap at capacity
  │   └─ Update last_update
  │
  ├─→ Check token availability
  │   │
  │   ├─ Tokens >= 1
  │   │   ├─ Consume 1 token
  │   │   └─ Return immediately
  │   │
  │   └─ Tokens < 1
  │       ├─ Calculate wait time
  │       ├─ Sleep for wait time
  │       └─ Retry acquisition
  │
  └─→ Token acquired
```

### Rate Limiter Integration

| Integration Point | Action | Purpose |
|-------------------|--------|---------|
| Client __init__ | Create RateLimiter | Initialize rate limiting |
| request() method | Call rate_limiter.acquire() | Throttle requests |
| Before HTTP call | Wait for token | Prevent rate limit |
| Configuration | Load rate limit | Set limits |

### Thread Safety

| Aspect | Implementation |
|--------|----------------|
| Token updates | Protected by lock |
| Concurrent requests | Synchronized acquisition |
| Last update time | Atomic update |

### Rate Limit Scenarios

| Scenario | Tokens | Action | Result |
|----------|--------|--------|--------|
| First request | 10 | Consume 1 | 9 remaining, proceed |
| Burst requests | 0 | Wait | Sleep until refill |
| Slow requests | Always full | Consume 1 | Always proceed |
| High load | Varies | Queue | Requests throttled |

### Wait Time Calculation

```
No tokens available:
  │
  ├─→ Calculate tokens needed
  │   └─ tokens_needed = 1 - current_tokens
  │
  ├─→ Calculate wait time
  │   └─ wait_time = tokens_needed / rate
  │
  ├─→ Sleep for wait time
  │   └─ time.sleep(wait_time)
  │
  └─→ Tokens replenished → Retry
```

### Rate Limiter Configuration in Settings

```
Settings structure:
┌─────────────────────────────────┐
│ KOOMBIYO_CONFIG = {             │
│   'RATE_LIMIT': {               │
│     'enabled': True,            │
│     'rate': 10,                 │
│     'burst': 10                 │
│   }                             │
│ }                               │
└─────────────────────────────────┘
```

### Expected Outcome
- Rate limiting prevents API limit violations
- Token bucket algorithm smooths request rate
- Automatic throttling with minimal latency
- Thread-safe for concurrent requests
- Configurable rate limits from settings

### Verification Checklist
- [ ] `RateLimiter` class created
- [ ] Token bucket algorithm implemented
- [ ] Token replenishment logic correct
- [ ] acquire() method blocks when needed
- [ ] Thread safety ensured (locks)
- [ ] Integrated with KoombiyoClient
- [ ] Configuration loaded from settings
- [ ] Rate limiting tested with high load

---

## Task 26: Create Request Logging

### Overview
Implement comprehensive request and response logging for all Koombiyo API interactions. This provides an audit trail, aids in debugging, monitors API usage, and helps identify issues. Logging captures request details, response information, timing metrics, and errors while protecting sensitive data like API keys.

### Dependencies
- Task 17: Create KoombiyoClient Class

### Instructions

1. **Configure logging module**
   - Import Python logging module
   - Create logger for Koombiyo client
   - Set logger name (e.g., "shipping.koombiyo.client")
   - Configure log levels (DEBUG, INFO, WARNING, ERROR)

2. **Define log format**
   - Create structured log format
   - Include timestamp, level, logger name
   - Include message and context
   - Support JSON format for parsing

3. **Log request initiation**
   - Log before executing HTTP request
   - Include HTTP method (GET, POST, etc.)
   - Include endpoint URL
   - Include request ID for tracing

4. **Log request details**
   - Log request headers (sanitized)
   - Log request payload/body (if present)
   - Don't log API keys or sensitive data
   - Truncate large payloads

5. **Log response received**
   - Log after receiving HTTP response
   - Include response status code
   - Include response time (duration)
   - Include response size

6. **Log response details**
   - Log response headers
   - Log response body (truncated if large)
   - Log parsed data structure
   - Log success/error indicator

7. **Log errors and exceptions**
   - Log all exceptions with ERROR level
   - Include full exception details
   - Include stack trace for debugging
   - Log retry attempts

8. **Implement log sanitization**
   - Remove or mask API keys
   - Remove or mask merchant IDs
   - Remove or mask customer personal data
   - Replace sensitive data with placeholders

9. **Add performance metrics**
   - Calculate request duration
   - Log slow requests (> threshold)
   - Track request count
   - Log rate limit information

10. **Support log levels**
    - DEBUG: Detailed request/response data
    - INFO: Request summary, success/failure
    - WARNING: Slow requests, retry attempts
    - ERROR: Exceptions, failures

### Logging Architecture

```
┌────────────────────────────────────┐
│     Request Execution Flow         │
├────────────────────────────────────┤
│                                    │
│ 1. Log Request Initiated (INFO)    │
│    ├─ Method, URL, Request ID     │
│    └─ Headers (sanitized)         │
│                                    │
│ 2. Execute Request                 │
│    └─ HTTP call to API            │
│                                    │
│ 3. Log Response Received (INFO)    │
│    ├─ Status code, Duration       │
│    └─ Response size               │
│                                    │
│ 4. Log Response Details (DEBUG)    │
│    ├─ Headers                     │
│    └─ Body (truncated)            │
│                                    │
│ 5. Log Errors (ERROR)              │
│    └─ Exception, Stack trace      │
│                                    │
└────────────────────────────────────┘
```

### Log Levels and Content

| Log Level | When | What to Log |
|-----------|------|-------------|
| DEBUG | Always | Full request/response details |
| INFO | Always | Request summary, outcome |
| WARNING | Issues | Slow requests, retries |
| ERROR | Failures | Exceptions, errors |

### Request Log Entry

```
INFO level example:
┌─────────────────────────────────────┐
│ [2026-01-31 10:15:23] INFO          │
│ koombiyo.client.request             │
│                                     │
│ Request initiated:                  │
│ - Method: POST                      │
│ - URL: /api/v1/shipments            │
│ - Request ID: req-abc123            │
│ - Headers: {sanitized}              │
└─────────────────────────────────────┘
```

### Response Log Entry

```
INFO level example:
┌─────────────────────────────────────┐
│ [2026-01-31 10:15:24] INFO          │
│ koombiyo.client.response            │
│                                     │
│ Response received:                  │
│ - Request ID: req-abc123            │
│ - Status: 200 OK                    │
│ - Duration: 850ms                   │
│ - Size: 2.4 KB                      │
└─────────────────────────────────────┘
```

### Error Log Entry

```
ERROR level example:
┌─────────────────────────────────────┐
│ [2026-01-31 10:15:30] ERROR         │
│ koombiyo.client.error               │
│                                     │
│ Request failed:                     │
│ - Request ID: req-def456            │
│ - Error: Connection timeout         │
│ - Retry attempt: 2/3                │
│ - Stack trace: ...                  │
└─────────────────────────────────────┘
```

### Data Sanitization

| Data Type | Action | Example |
|-----------|--------|---------|
| API Key | Mask | "API-KEY-xxx...xxx" |
| Merchant ID | Mask | "MERCHANT-xxx...xxx" |
| Customer email | Hash/mask | "c***@example.com" |
| Phone number | Mask | "+94 XX XXX XXXX" |
| Full data | Log | (non-sensitive only) |

### Sanitization Implementation

```
Sanitize headers:
  │
  ├─→ Copy headers dict
  │
  ├─→ For each sensitive key:
  │   ├─ X-API-Key → "API-KEY-xxx...xxx"
  │   └─ X-Merchant-ID → "MERCHANT-xxx...xxx"
  │
  └─→ Return sanitized headers
```

### Performance Metrics

| Metric | Logged | Threshold | Action |
|--------|--------|-----------|--------|
| Request duration | Yes | > 2 seconds | Log WARNING |
| Response size | Yes | > 1 MB | Log INFO |
| Retry count | Yes | > 0 | Log WARNING |
| Rate limit hits | Yes | Any | Log INFO |

### Log Context Information

| Context | Included | Purpose |
|---------|----------|---------|
| Request ID | Yes | Trace requests |
| Timestamp | Yes | Time analysis |
| Tenant ID | Yes | Multi-tenant tracking |
| User ID | Optional | User actions |
| Endpoint | Yes | API usage patterns |

### Logging Integration Points

```
KoombiyoClient methods:
┌─────────────────────────────────┐
│ request()                       │
│ ├─ Log request start            │
│ ├─ Execute request              │
│ ├─ Log response                 │
│ └─ Log errors (if any)          │
│                                 │
│ _handle_error()                 │
│ └─ Log error details            │
│                                 │
│ _retry_request()                │
│ └─ Log retry attempts           │
└─────────────────────────────────┘
```

### Log Configuration

```
Settings structure:
┌─────────────────────────────────┐
│ LOGGING = {                     │
│   'loggers': {                  │
│     'shipping.koombiyo': {      │
│       'level': 'INFO',          │
│       'handlers': ['file'],     │
│       'propagate': False        │
│     }                           │
│   }                             │
│ }                               │
└─────────────────────────────────┘
```

### Expected Outcome
- Complete audit trail of API interactions
- Request and response details logged
- Sensitive data properly sanitized
- Performance metrics captured
- Error details logged for debugging

### Verification Checklist
- [ ] Logger configured for Koombiyo client
- [ ] Request initiation logged
- [ ] Request details logged (sanitized)
- [ ] Response status and timing logged
- [ ] Response details logged (DEBUG level)
- [ ] Errors and exceptions logged
- [ ] Sensitive data sanitized
- [ ] Performance metrics included
- [ ] Log levels appropriate
- [ ] Integration with client methods complete

---

## Summary

This document covered the implementation of the KoombiyoClient HTTP client with complete request handling capabilities. The client includes:

- **KoombiyoClient Class**: Foundation for HTTP communication
- **Authentication**: Custom header-based authentication
- **Request Method**: Unified interface for all HTTP operations
- **Error Handling**: Comprehensive error detection and categorization
- **Retry Logic**: Exponential backoff for transient failures
- **Timeout Config**: Connection and read timeout management
- **Response Parser**: Structured response validation and extraction
- **Custom Exceptions**: Type-safe error handling
- **Rate Limiter**: Token bucket algorithm for rate limiting
- **Request Logging**: Complete audit trail with sanitization

The next document will implement the ShippingProvider abstract interface and KoombiyoProvider implementation.
