# Tasks 17-25: Client and Send Methods

> **Phase:** 09 - Integrations & Sri Lanka Localizations  
> **SubPhase:** 11 - WhatsApp Business API  
> **Group:** B - API Client & Auth  
> **Document:** 01 of 02  
> **Tasks Covered:** 17, 18, 19, 20, 21, 22, 23, 24, 25

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [Group-A: 02_Tasks-09-16_OptIn-Migration.md](../Group-A_WhatsApp-Configuration/02_Tasks-09-16_OptIn-Migration.md)
- **→ Next Document:** [02_Tasks-26-32_Media-Phone-Verify.md](02_Tasks-26-32_Media-Phone-Verify.md)

---

## Document Overview

This document covers the creation of the WhatsApp Business API client with authentication, request handling, error management, rate limiting, retry logic, and core message sending methods. It establishes the foundation for all WhatsApp communication by implementing the WhatsAppClient class, authentication mechanisms, and essential sending methods for templates and text messages.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 17 | Create WhatsAppClient Class | High | 60 min |
| 18 | Create Authentication | Low | 20 min |
| 19 | Create Request Handler | Medium | 40 min |
| 20 | Create Error Handling | Medium | 45 min |
| 21 | Create Rate Limiter | Medium | 45 min |
| 22 | Create Retry Logic | Medium | 40 min |
| 23 | Create send_message Method | Medium | 40 min |
| 24 | Create send_template Method | Medium | 35 min |
| 25 | Create send_text Method | Low | 25 min |

---

## Task 17: Create WhatsAppClient Class

### Overview
Create the main WhatsAppClient class that serves as the interface for all WhatsApp Business API interactions. This class initializes the HTTP client, manages API credentials, stores configuration from WhatsApp settings, and provides the foundation for all messaging operations. It acts as a singleton service that maintains connection state and handles API versioning.

### Dependencies
- Task 16: Create Opt-In Migration (Group-A)
- Django project structure is established
- httpx package is installed for async HTTP requests
- WhatsApp Business API credentials are configured

### Instructions

1. **Create the client module file**
   - Navigate to `backend/apps/notifications/clients/` directory
   - Create a new file named `whatsapp_client.py`
   - This will contain the WhatsAppClient class

2. **Import required dependencies**
   - Import httpx for async HTTP client functionality
   - Import Django settings for accessing configuration
   - Import logging module for debug and error tracking
   - Import typing hints for type safety
   - Import datetime for timestamp handling

3. **Define the WhatsAppClient class structure**
   - Create class named `WhatsAppClient`
   - Add class-level constants for API version and base URL
   - Set API version to v18.0 (current stable version)
   - Set base URL to `https://graph.facebook.com`

4. **Implement initialization method**
   - Create `__init__` method that accepts optional config parameters
   - Load WhatsApp configuration from Django settings or database
   - Extract phone number ID, access token, and business account ID
   - Initialize httpx AsyncClient with timeout settings
   - Set default timeout to 30 seconds for API requests

5. **Configure HTTP client settings**
   - Enable automatic retry for connection errors
   - Set up connection pooling for efficiency
   - Configure SSL verification settings
   - Set appropriate headers including User-Agent

6. **Create client properties**
   - Add property for accessing phone number ID
   - Add property for accessing business account ID
   - Add property for checking if client is initialized
   - Ensure credentials are loaded before operations

7. **Implement context manager support**
   - Add `__aenter__` method for async context manager entry
   - Add `__aexit__` method for proper client cleanup
   - Ensure HTTP client is properly closed after use
   - Handle exceptions during cleanup gracefully

8. **Add health check method**
   - Create method to verify API connectivity
   - Make a simple GET request to WhatsApp API
   - Return boolean indicating connection status
   - Log connection issues for troubleshooting

### WhatsApp Cloud API Structure

| Component | Value | Purpose |
|-----------|-------|---------|
| Base URL | `graph.facebook.com` | Facebook Graph API endpoint |
| API Version | `v18.0` | Current stable API version |
| Phone Endpoint | `/{phone_id}/messages` | Send messages endpoint |
| Media Endpoint | `/{phone_id}/media` | Upload/manage media |
| Business Endpoint | `/{business_id}/` | Business account operations |

### Client Configuration Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| phone_number_id | string | Yes | From settings | WhatsApp business phone ID |
| access_token | string | Yes | From settings | Bearer access token |
| business_account_id | string | Yes | From settings | WhatsApp business account |
| api_version | string | No | v18.0 | Graph API version |
| timeout | integer | No | 30 | Request timeout in seconds |
| max_retries | integer | No | 3 | Maximum retry attempts |

### Class Architecture Diagram

```
┌────────────────────────────────────────────────────────┐
│                  WhatsAppClient                        │
├────────────────────────────────────────────────────────┤
│  Properties:                                           │
│  - phone_number_id: str                                │
│  - access_token: str                                   │
│  - business_account_id: str                            │
│  - api_version: str                                    │
│  - base_url: str                                       │
│  - http_client: httpx.AsyncClient                     │
├────────────────────────────────────────────────────────┤
│  Core Methods:                                         │
│  + __init__(config)                                    │
│  + __aenter__()                                        │
│  + __aexit__()                                         │
│  + check_health() → bool                               │
│  + request() → dict [Task 19]                          │
├────────────────────────────────────────────────────────┤
│  Authentication: [Task 18]                             │
│  + _get_auth_headers() → dict                          │
├────────────────────────────────────────────────────────┤
│  Messaging Methods:                                    │
│  + send_message() [Task 23]                            │
│  + send_template() [Task 24]                           │
│  + send_text() [Task 25]                               │
│  + send_image() [Task 26]                              │
│  + send_document() [Task 27]                           │
│  + send_interactive() [Task 28]                        │
└────────────────────────────────────────────────────────┘
```

### API Version Considerations

| Version | Status | Supported Until | Notes |
|---------|--------|----------------|-------|
| v18.0 | Current | Feb 2026 | Recommended for new implementations |
| v17.0 | Deprecated | Nov 2025 | Migration required |
| v16.0 | Unsupported | Aug 2025 | No longer available |

### Expected Outcome
- WhatsAppClient class created with proper initialization
- HTTP client configured with appropriate timeouts
- Configuration loaded from Django settings
- Client ready to be extended with messaging methods
- Context manager support for proper resource cleanup

### Verification Checklist
- [ ] `whatsapp_client.py` file created in clients directory
- [ ] WhatsAppClient class defined with proper structure
- [ ] httpx AsyncClient initialized with correct settings
- [ ] Configuration loaded from WhatsApp settings
- [ ] Context manager methods implemented
- [ ] Health check method tests connectivity
- [ ] No hardcoded credentials in source
- [ ] Logging configured for debugging

---

## Task 18: Create Authentication

### Overview
Implement authentication mechanism using Bearer token for WhatsApp Cloud API requests. Create a private method that generates authentication headers required for all API calls. The authentication uses a long-lived access token obtained from Facebook Business Manager and includes it in the Authorization header of every request.

### Dependencies
- Task 17: Create WhatsAppClient Class

### Instructions

1. **Create authentication header method**
   - Add private method `_get_auth_headers` to WhatsAppClient class
   - Mark as private with underscore prefix
   - Return dictionary containing authentication headers
   - Method should be called before every API request

2. **Implement Bearer token authentication**
   - Extract access token from client configuration
   - Format as Bearer token string
   - Create Authorization header with Bearer scheme
   - Follow OAuth 2.0 Bearer token specification

3. **Add additional required headers**
   - Set Content-Type header to `application/json`
   - Add Accept header for JSON responses
   - Include User-Agent header with application identifier
   - Add API version in headers if required

4. **Implement token validation**
   - Check if access token exists before creating headers
   - Validate token format (should be non-empty string)
   - Raise exception if token is missing or invalid
   - Log warning when using default token

5. **Create token refresh mechanism (optional)**
   - Add method to check token expiration
   - Implement logic to refresh token before expiry
   - Handle token refresh failures gracefully
   - Update stored token after successful refresh

6. **Add security measures**
   - Never log the complete access token
   - Mask token in error messages (show only last 4 chars)
   - Ensure tokens are stored securely in database
   - Validate token format against expected pattern

7. **Handle authentication errors**
   - Catch 401 Unauthorized responses
   - Catch 403 Forbidden responses
   - Provide clear error messages for auth failures
   - Log authentication errors for monitoring

### Authentication Flow Diagram

```
┌─────────────┐
│   Request   │
│  Initiated  │
└──────┬──────┘
       │
       ▼
┌─────────────────────────┐
│ _get_auth_headers()     │
│ - Load access_token     │
│ - Validate token        │
│ - Format Bearer header  │
└──────┬──────────────────┘
       │
       ▼
┌─────────────────────────┐
│ Create Headers Dict     │
│ {                       │
│   "Authorization":      │
│     "Bearer {token}"    │
│   "Content-Type":       │
│     "application/json"  │
│ }                       │
└──────┬──────────────────┘
       │
       ▼
┌─────────────────────────┐
│ Return to Request       │
│ Handler (Task 19)       │
└─────────────────────────┘
```

### Header Structure

| Header | Value | Purpose |
|--------|-------|---------|
| Authorization | `Bearer {access_token}` | Authenticates API requests |
| Content-Type | `application/json` | Specifies request body format |
| Accept | `application/json` | Specifies response format |
| User-Agent | `LCC-WhatsApp/1.0` | Identifies client application |

### Token Management

| Aspect | Implementation |
|--------|----------------|
| Storage | Django database encrypted field |
| Lifetime | 60 days (default from Facebook) |
| Refresh | Manual via Facebook Business Manager |
| Security | Never exposed in logs or responses |
| Validation | Check non-empty before use |

### Authentication Error Responses

| Status Code | Error | Meaning | Action Required |
|-------------|-------|---------|-----------------|
| 401 | Unauthorized | Invalid or expired token | Regenerate token in Business Manager |
| 403 | Forbidden | Insufficient permissions | Check app permissions and roles |
| 400 | Bad Request | Malformed auth header | Verify header format |
| 190 | Access Token Error | Token revoked or expired | Obtain new access token |

### Token Security Best Practices

| Practice | Implementation |
|----------|----------------|
| Encryption | Store encrypted in database |
| Environment | Load from secure environment variables |
| Logging | Mask in logs (show only last 4 chars) |
| Rotation | Support token rotation without downtime |
| Validation | Validate before every request |
| Expiry Tracking | Monitor token expiration dates |

### Expected Outcome
- Authentication method implemented and tested
- Bearer token properly formatted in headers
- All required headers included in requests
- Token validation prevents invalid requests
- Security measures protect sensitive credentials

### Verification Checklist
- [ ] `_get_auth_headers` method created
- [ ] Bearer token formatted correctly
- [ ] All required headers included
- [ ] Token validation implemented
- [ ] Security measures in place (no token logging)
- [ ] Authentication errors handled properly
- [ ] Headers tested with API requests

---

## Task 19: Create Request Handler

### Overview
Implement a generic request handler method that manages all HTTP communication with the WhatsApp Cloud API. This method standardizes API calls, handles different HTTP methods (GET, POST, DELETE), manages request/response formatting, integrates authentication headers, and provides a consistent interface for all API operations.

### Dependencies
- Task 18: Create Authentication

### Instructions

1. **Create the request handler method**
   - Add public method `request` to WhatsAppClient class
   - Accept parameters: HTTP method, endpoint, data, and query params
   - Mark as async method since using httpx AsyncClient
   - Return parsed JSON response as dictionary

2. **Define method signature**
   - Parameter: method (str) - HTTP method (GET, POST, DELETE, etc.)
   - Parameter: endpoint (str) - API endpoint path (e.g., 'messages')
   - Parameter: data (dict, optional) - Request body for POST/PUT
   - Parameter: params (dict, optional) - URL query parameters
   - Return type: dictionary containing parsed response

3. **Build complete request URL**
   - Combine base URL with API version
   - Append phone number ID from configuration
   - Add specified endpoint path
   - Result format: `https://graph.facebook.com/v18.0/{phone_id}/{endpoint}`

4. **Prepare request headers**
   - Call `_get_auth_headers` method from Task 18
   - Merge with any additional headers needed
   - Ensure Content-Type is set for POST/PUT requests
   - Add custom headers if provided

5. **Execute HTTP request**
   - Use httpx AsyncClient to make request
   - Pass method, URL, headers, JSON data, and params
   - Set timeout from configuration
   - Enable SSL verification

6. **Handle different HTTP methods**
   - Support GET for retrieving data
   - Support POST for sending messages and creating resources
   - Support DELETE for removing resources
   - Support PUT for updating resources (if needed)

7. **Parse and validate response**
   - Check response status code
   - Parse JSON response body
   - Validate response structure
   - Extract error information if present

8. **Handle response errors**
   - Raise exception for non-2xx status codes
   - Pass to error handler (Task 20) for processing
   - Include response details in exception
   - Log request/response for debugging

9. **Add request logging**
   - Log outgoing request details (method, URL, data size)
   - Log response status and timing
   - Mask sensitive data in logs
   - Use appropriate log levels (DEBUG for details, ERROR for failures)

### Request Flow Diagram

```
┌────────────────────┐
│  Calling Method    │
│  (send_message,    │
│   send_template)   │
└─────────┬──────────┘
          │
          ▼
┌────────────────────────────────────────┐
│  request(method, endpoint, data)       │
├────────────────────────────────────────┤
│  1. Build URL                          │
│     base + version + phone + endpoint  │
│  2. Get auth headers (Task 18)         │
│  3. Prepare request data               │
│  4. Log request                        │
└─────────┬──────────────────────────────┘
          │
          ▼
┌────────────────────────────────────────┐
│  httpx.AsyncClient.request()           │
│  - Execute HTTP request                │
│  - Apply timeout                       │
│  - Handle SSL                          │
└─────────┬──────────────────────────────┘
          │
          ▼
     ┌────┴────┐
     │         │
     ▼         ▼
┌────────┐ ┌────────┐
│ 2xx    │ │ Error  │
│ Success│ │ Status │
└────┬───┘ └────┬───┘
     │          │
     │          ▼
     │    ┌─────────────────┐
     │    │ Error Handler   │
     │    │ (Task 20)       │
     │    └─────────────────┘
     │
     ▼
┌────────────────────┐
│  Parse Response    │
│  - Validate JSON   │
│  - Extract data    │
│  - Log response    │
└─────────┬──────────┘
          │
          ▼
┌────────────────────┐
│  Return Response   │
│  to Caller         │
└────────────────────┘
```

### URL Construction

| Component | Example | Source |
|-----------|---------|--------|
| Base URL | `https://graph.facebook.com` | Class constant |
| API Version | `/v18.0` | Client configuration |
| Phone Number ID | `/123456789` | WhatsApp settings |
| Endpoint | `/messages` | Method parameter |
| **Full URL** | `https://graph.facebook.com/v18.0/123456789/messages` | Combined |

### HTTP Methods Supported

| Method | Purpose | Has Body | Example Endpoint |
|--------|---------|----------|------------------|
| GET | Retrieve data | No | `/media/{media_id}` |
| POST | Send messages, create resources | Yes | `/messages` |
| DELETE | Remove resources | No | `/media/{media_id}` |
| PUT | Update resources | Yes | `/business/{id}` |

### Request Parameters

| Parameter | Type | Required | Example | Description |
|-----------|------|----------|---------|-------------|
| method | string | Yes | "POST" | HTTP method to use |
| endpoint | string | Yes | "messages" | API endpoint path |
| data | dict | No | {"to": "...", "type": "text"} | Request body |
| params | dict | No | {"fields": "id,status"} | URL query parameters |

### Response Structure

| Field | Type | Description |
|-------|------|-------------|
| messages | array | Array of message objects (for send operations) |
| contacts | array | Contact information |
| error | object | Error details (if request failed) |
| meta | object | Metadata about request |

### Request Logging Format

```
Request Log Entry:
- Timestamp: ISO 8601 format
- Method: HTTP method used
- URL: Full API endpoint (with phone ID masked)
- Data Size: Bytes of request body
- Duration: Time taken for request
- Status: HTTP status code
- Response Size: Bytes of response body
```

### Expected Outcome
- Generic request handler method implemented
- All HTTP methods supported (GET, POST, DELETE)
- URLs constructed correctly with all components
- Authentication headers integrated seamlessly
- Responses parsed and validated
- Comprehensive logging for debugging

### Verification Checklist
- [ ] `request` method created with correct signature
- [ ] URL construction includes all components
- [ ] Authentication headers applied to all requests
- [ ] All HTTP methods supported
- [ ] JSON parsing implemented
- [ ] Error responses handled (passed to Task 20)
- [ ] Request and response logging added
- [ ] Timeout configured and applied

---

## Task 20: Create Error Handling

### Overview
Implement comprehensive error handling for WhatsApp API responses. Create custom exception classes for different error types, parse error responses from the API, map error codes to specific exceptions, provide meaningful error messages, and enable retry logic for transient errors. This ensures robust error management across all API operations.

### Dependencies
- Task 19: Create Request Handler

### Instructions

1. **Create custom exception classes**
   - Create base exception class `WhatsAppAPIError`
   - Inherit from Python's `Exception` class
   - Create specific exception classes for different error types
   - Each exception should store error code, message, and details

2. **Define specific exception types**
   - `WhatsAppAuthenticationError` - For auth failures (190, 401, 403)
   - `WhatsAppRateLimitError` - For rate limit exceeded (130, 429)
   - `WhatsAppValidationError` - For invalid parameters (100, 131)
   - `WhatsAppNetworkError` - For connection issues (5xx)
   - `WhatsAppMediaError` - For media upload/download failures
   - `WhatsAppTemporaryError` - For transient errors (can retry)

3. **Create error parser method**
   - Add method `_parse_error_response` to WhatsAppClient
   - Accept response object as parameter
   - Extract error code from response body
   - Extract error message and error description
   - Extract error subcode if present

4. **Map error codes to exceptions**
   - Create mapping dictionary of error codes to exception classes
   - Include all common WhatsApp API error codes
   - Handle unknown error codes with generic exception
   - Document error code meanings

5. **Implement error handler method**
   - Add method `_handle_error` to WhatsAppClient
   - Accept response and error details as parameters
   - Determine appropriate exception type
   - Create exception instance with full context
   - Log error details before raising exception

6. **Integrate with request handler**
   - Modify request method from Task 19
   - Check response status code after every request
   - Call error handler for non-2xx responses
   - Allow exceptions to propagate to caller

7. **Add error context**
   - Include request details in exception (URL, method, data)
   - Include response details (status, body)
   - Add timestamp of error occurrence
   - Include tenant context if available

8. **Implement retry classification**
   - Mark transient errors as retryable (5xx, 429)
   - Mark permanent errors as non-retryable (4xx except 429)
   - Add `is_retryable` property to exceptions
   - Use in retry logic (Task 22)

9. **Add user-friendly messages**
   - Translate API error messages to user-friendly text
   - Provide actionable guidance for common errors
   - Keep technical details in exception properties
   - Log technical details, display friendly messages

### Error Handling Flow Diagram

```
┌────────────────────────┐
│  API Response          │
│  Received              │
└──────────┬─────────────┘
           │
           ▼
      ┌────────────┐
      │ Status OK? │
      │ (2xx)      │
      └──┬──────┬──┘
         │      │
        Yes     No
         │      │
         │      ▼
         │  ┌──────────────────────┐
         │  │ _parse_error_response│
         │  │ - Extract error code │
         │  │ - Extract message    │
         │  │ - Extract subcode    │
         │  └──────────┬───────────┘
         │             │
         │             ▼
         │  ┌──────────────────────┐
         │  │ Map to Exception     │
         │  │ Type                 │
         │  └──────────┬───────────┘
         │             │
         │             ▼
         │  ┌──────────────────────┐
         │  │ Create Exception     │
         │  │ - Add context        │
         │  │ - Add details        │
         │  │ - Set retryable flag │
         │  └──────────┬───────────┘
         │             │
         │             ▼
         │  ┌──────────────────────┐
         │  │ Log Error            │
         │  │ - ERROR level        │
         │  │ - Include details    │
         │  └──────────┬───────────┘
         │             │
         │             ▼
         │  ┌──────────────────────┐
         │  │ Raise Exception      │
         │  └──────────────────────┘
         │
         ▼
┌────────────────────────┐
│  Return Success        │
│  Response              │
└────────────────────────┘
```

### WhatsApp API Error Codes

| Error Code | Error Type | Description | Retryable | Action |
|------------|------------|-------------|-----------|--------|
| 100 | Invalid Parameter | Request contains invalid parameter | No | Check parameter values |
| 130 | Rate Limit Exceeded | Too many messages sent | Yes | Wait and retry with backoff |
| 131 | Phone Number Error | Invalid recipient phone number | No | Validate phone format |
| 132 | Parameter Required | Required parameter missing | No | Add missing parameter |
| 133 | Message Undeliverable | Cannot deliver to recipient | No | Check recipient status |
| 190 | Access Token Error | Invalid or expired token | No | Regenerate access token |
| 368 | Temporarily Blocked | Sending temporarily blocked | Yes | Wait and retry later |
| 429 | Too Many Requests | Rate limit hit | Yes | Apply exponential backoff |
| 500 | Internal Server Error | Facebook server error | Yes | Retry with backoff |
| 503 | Service Unavailable | Temporary outage | Yes | Retry with longer backoff |

### Exception Class Hierarchy

```
Exception
    │
    └── WhatsAppAPIError (base)
            │
            ├── WhatsAppAuthenticationError (190, 401, 403)
            │
            ├── WhatsAppRateLimitError (130, 429)
            │
            ├── WhatsAppValidationError (100, 131, 132)
            │
            ├── WhatsAppNetworkError (500, 503, timeouts)
            │
            ├── WhatsAppMediaError (media-specific errors)
            │
            └── WhatsAppTemporaryError (368, transient errors)
```

### Exception Properties

| Property | Type | Description |
|----------|------|-------------|
| error_code | int | WhatsApp API error code |
| message | str | User-friendly error message |
| api_message | str | Original API error message |
| error_subcode | int | API error subcode (optional) |
| request_url | str | URL that was called |
| request_data | dict | Request data sent (sanitized) |
| response_body | dict | Full API response |
| is_retryable | bool | Whether error is transient |
| timestamp | datetime | When error occurred |

### Error Response Format (from WhatsApp API)

```
{
  "error": {
    "message": "Message failed to send because more than 24 hours...",
    "type": "OAuthException",
    "code": 131,
    "error_subcode": 2388041,
    "error_data": {
      "details": "Additional error details"
    },
    "fbtrace_id": "AaBbCcDdEeFfGgHh"
  }
}
```

### Error Logging Format

```
Log Entry:
- Level: ERROR
- Timestamp: ISO 8601
- Error Code: WhatsApp error code
- Error Type: Exception class name
- Message: User-friendly message
- API Message: Original API message
- Request: Method, URL, data size
- Tenant: Tenant ID (if available)
- Trace ID: Facebook trace ID (for support)
```

### User-Friendly Error Messages

| Error Code | User-Friendly Message |
|------------|----------------------|
| 100 | Invalid message format. Please check your message content. |
| 130 | Message limit reached. Please try again in a few minutes. |
| 131 | Invalid phone number. Please verify the recipient's number. |
| 190 | WhatsApp connection issue. Please contact support. |
| 429 | Too many messages sent. Automatically retrying... |
| 500 | WhatsApp service temporarily unavailable. Retrying... |

### Expected Outcome
- Custom exception classes created for different error types
- Error responses parsed and mapped to exceptions
- Comprehensive error context included in exceptions
- Transient errors marked as retryable
- User-friendly error messages provided
- All errors logged with full details

### Verification Checklist
- [ ] Base `WhatsAppAPIError` exception created
- [ ] Specific exception classes for each error type
- [ ] Error parser method extracts all error details
- [ ] Error code to exception mapping implemented
- [ ] Error handler integrated with request method
- [ ] Retryable vs non-retryable errors classified
- [ ] User-friendly messages created for common errors
- [ ] Error logging includes full context
- [ ] Exception properties include request/response details

---

## Task 21: Create Rate Limiter

### Overview
Implement rate limiting mechanism to comply with WhatsApp Cloud API rate limits and prevent account suspension. Create a rate limiter that tracks message sending rates per tenant, enforces tier-based limits, implements token bucket algorithm, queues messages when limits are reached, and provides rate limit status information.

### Dependencies
- Task 20: Create Error Handling

### Instructions

1. **Understand WhatsApp rate limit tiers**
   - Tier 0 (Unverified): 250 messages per day
   - Tier 1: 1,000 messages per day
   - Tier 2: 10,000 messages per day
   - Tier 3: 100,000 messages per day
   - Research Tier 4+ limits for high-volume accounts

2. **Create rate limiter class**
   - Create separate class `WhatsAppRateLimiter`
   - Store in same module as WhatsAppClient
   - Maintain per-tenant rate limit state
   - Use Redis for distributed rate limiting

3. **Implement token bucket algorithm**
   - Create bucket with capacity equal to daily limit
   - Refill tokens at constant rate (daily limit / 86400 seconds)
   - Consume one token per message sent
   - Reject messages when bucket is empty

4. **Track rate limit metrics**
   - Store current token count in Redis
   - Track last refill timestamp
   - Calculate tokens available at any time
   - Store tier level for each tenant

5. **Create rate limit check method**
   - Add method `check_rate_limit` to rate limiter
   - Accept tenant ID and message count parameters
   - Return boolean indicating if send is allowed
   - Return wait time if limit exceeded

6. **Implement rate limit consumption**
   - Add method `consume_tokens` after successful send
   - Decrement available token count
   - Update last send timestamp
   - Handle concurrent requests atomically

7. **Add rate limit status method**
   - Create method to get current rate limit status
   - Return remaining messages for current period
   - Return time until limit resets
   - Return current tier level

8. **Handle rate limit errors from API**
   - Detect rate limit errors (130, 429) from Task 20
   - Update local rate limit state
   - Calculate appropriate backoff time
   - Return error to caller with retry information

9. **Integrate with WhatsAppClient**
   - Add rate limiter instance to WhatsAppClient
   - Check rate limit before sending messages
   - Update rate limit after successful sends
   - Handle rate limit exceeded scenarios

10. **Configure tier upgrade paths**
    - Document requirements for tier upgrades
    - Add method to check current tier
    - Provide guidance when approaching limits
    - Log warnings at 80% and 90% of limit

11. **Implement graceful degradation**
    - Queue messages when rate limit reached
    - Process queue when capacity available
    - Prioritize messages by importance
    - Notify admins when consistently hitting limits

### Rate Limit Tiers

| Tier | Daily Limit | Messages/Second | Typical Use Case |
|------|-------------|-----------------|------------------|
| 0 (Unverified) | 250 | 0.003 | Testing, small businesses |
| 1 | 1,000 | 0.012 | Small businesses |
| 2 | 10,000 | 0.116 | Medium businesses |
| 3 | 100,000 | 1.157 | Large businesses |
| 4+ | Custom | Custom | Enterprise |

### Token Bucket Algorithm

```
┌──────────────────────────────────────┐
│         Token Bucket                 │
├──────────────────────────────────────┤
│  Capacity: Daily Limit               │
│  Refill Rate: Limit / 86400 per sec │
│  Current Tokens: Available count     │
└──────────────────────────────────────┘
           │
           ▼
┌──────────────────────────────────────┐
│  Message Send Request                │
└──────────┬───────────────────────────┘
           │
           ▼
      ┌─────────┐
      │ Tokens  │
      │ Avail?  │
      └─┬─────┬─┘
        │     │
       Yes    No
        │     │
        │     ▼
        │  ┌──────────────────┐
        │  │ Calculate Wait   │
        │  │ Time             │
        │  └────────┬─────────┘
        │           │
        │           ▼
        │  ┌──────────────────┐
        │  │ Return Error     │
        │  │ with Wait Time   │
        │  └──────────────────┘
        │
        ▼
┌───────────────────┐
│ Consume Token     │
│ (decrement count) │
└────────┬──────────┘
         │
         ▼
┌───────────────────┐
│ Allow Send        │
└───────────────────┘
```

### Rate Limit State (Redis Storage)

| Key | Type | Value | TTL |
|-----|------|-------|-----|
| `whatsapp:ratelimit:{tenant_id}:tokens` | Integer | Current token count | 24 hours |
| `whatsapp:ratelimit:{tenant_id}:tier` | Integer | Current tier level | None |
| `whatsapp:ratelimit:{tenant_id}:last_refill` | Timestamp | Last refill time | 24 hours |
| `whatsapp:ratelimit:{tenant_id}:reset_time` | Timestamp | Next reset time | 24 hours |

### Rate Limit Check Flow

```
check_rate_limit(tenant_id, count=1):
    1. Get current tier for tenant
    2. Calculate daily limit from tier
    3. Get current token count from Redis
    4. Calculate tokens to add since last refill
    5. Refill tokens (up to capacity)
    6. Check if enough tokens available
    7. If yes: return True
    8. If no: calculate wait time, return False + wait time
```

### Rate Limit Status Response

| Field | Type | Description |
|-------|------|-------------|
| tier | integer | Current tier level (0-4+) |
| daily_limit | integer | Maximum messages per day |
| remaining | integer | Messages remaining in current period |
| reset_at | datetime | When limit resets (ISO 8601) |
| wait_time | integer | Seconds to wait if limit exceeded |
| percentage_used | float | Percentage of limit used |

### Rate Limit Warning Thresholds

| Threshold | Action |
|-----------|--------|
| 80% | Log WARNING, notify admins |
| 90% | Log WARNING, send email alert |
| 95% | Log ERROR, send urgent alert |
| 100% | Reject new messages, queue for later |

### Tier Upgrade Requirements

| From Tier | To Tier | Requirements |
|-----------|---------|--------------|
| 0 → 1 | Business verification complete |
| 1 → 2 | Phone number verified, good quality rating |
| 2 → 3 | Consistent usage, high quality rating |
| 3 → 4+ | Contact Facebook for enterprise limits |

### Expected Outcome
- Rate limiter class implemented with token bucket algorithm
- Per-tenant rate limiting enforced
- Redis used for distributed rate limit state
- Rate limit status queryable at any time
- Messages queued when limits exceeded
- Tier-based limits respected
- Admin alerts when approaching limits

### Verification Checklist
- [ ] WhatsAppRateLimiter class created
- [ ] Token bucket algorithm implemented
- [ ] Redis storage for rate limit state
- [ ] Per-tenant rate tracking
- [ ] All tier limits configured
- [ ] Rate limit check before sends
- [ ] Token consumption after sends
- [ ] Status method returns accurate information
- [ ] Warning alerts at 80%, 90%, 95%
- [ ] Integration with WhatsAppClient complete

---

## Task 22: Create Retry Logic

### Overview
Implement automatic retry mechanism with exponential backoff for transient errors. Create retry logic that handles rate limits, temporary network failures, and server errors gracefully. Use intelligent backoff strategies to avoid overwhelming the API while maximizing message delivery success rate.

### Dependencies
- Task 21: Create Rate Limiter

### Instructions

1. **Define retry configuration**
   - Set maximum retry attempts (default: 3)
   - Set base delay for exponential backoff (default: 1 second)
   - Set maximum delay cap (default: 60 seconds)
   - Define which errors are retryable (from Task 20)

2. **Create retry decorator**
   - Implement decorator function `retry_with_backoff`
   - Accept configuration parameters (max_retries, base_delay, max_delay)
   - Wrap async functions to add retry behavior
   - Preserve function signatures and return types

3. **Implement exponential backoff algorithm**
   - Calculate delay as: base_delay * (2 ^ attempt_number)
   - Add jitter (randomization) to prevent thundering herd
   - Cap maximum delay to prevent excessive waits
   - Formula: `min(base_delay * 2^attempt + random(0, 1), max_delay)`

4. **Identify retryable errors**
   - Retry on rate limit errors (130, 429)
   - Retry on server errors (500, 503)
   - Retry on temporary errors (368)
   - Retry on network timeouts
   - Do NOT retry on validation errors (100, 131)
   - Do NOT retry on authentication errors (190)

5. **Create retry execution method**
   - Add method `_execute_with_retry` to WhatsAppClient
   - Accept async function to execute and parameters
   - Implement retry loop with backoff
   - Track retry attempts and delays

6. **Handle rate limit specific retries**
   - Extract Retry-After header from 429 responses
   - Use provided wait time instead of exponential backoff
   - Respect API's rate limit guidance
   - Log rate limit retries separately

7. **Add retry logging**
   - Log each retry attempt with attempt number
   - Log calculated backoff delay
   - Log reason for retry (error type)
   - Log final success or failure after all retries

8. **Implement circuit breaker pattern (optional)**
   - Track consecutive failures
   - Open circuit after threshold failures (e.g., 5)
   - Prevent requests when circuit is open
   - Close circuit after timeout period

9. **Apply retry to message sending methods**
   - Wrap `request` method with retry decorator
   - Apply to all message sending operations
   - Exclude operations that shouldn't retry
   - Make retry behavior configurable per tenant

10. **Add retry metrics**
    - Track total retry attempts
    - Track success rate after retries
    - Track average backoff delays
    - Store metrics in Redis or database

### Retry Flow Diagram

```
┌────────────────────┐
│  Execute Request   │
└─────────┬──────────┘
          │
          ▼
     ┌─────────┐
     │ Success?│
     └─┬─────┬─┘
       │     │
      Yes    No
       │     │
       │     ▼
       │  ┌──────────────┐
       │  │ Error        │
       │  │ Retryable?   │
       │  └─┬──────────┬─┘
       │    │          │
       │   Yes         No
       │    │          │
       │    ▼          ▼
       │  ┌──────────────────┐
       │  │ Attempts         │
       │  │ Remaining?       │
       │  └─┬──────────┬─────┘
       │    │          │
       │   Yes         No
       │    │          │
       │    ▼          ▼
       │  ┌──────────────────┐
       │  │ Calculate Backoff│
       │  │ - Exponential    │
       │  │ - Add jitter     │
       │  │ - Cap max delay  │
       │  └────────┬─────────┘
       │           │
       │           ▼
       │  ┌──────────────────┐
       │  │ Wait (asyncio    │
       │  │ .sleep)          │
       │  └────────┬─────────┘
       │           │
       │           ▼
       │  ┌──────────────────┐
       │  │ Log Retry        │
       │  │ Attempt          │
       │  └────────┬─────────┘
       │           │
       │           └──────┐
       │                  │
       │    ┌─────────────┘
       │    │
       │    └─► Retry ──► Back to Execute
       │
       ▼
┌──────────────────┐
│ Return Success   │
│ Response         │
└──────────────────┘
       │
       │ (No path)
       ▼
┌──────────────────┐
│ Raise Final      │
│ Exception        │
└──────────────────┘
```

### Exponential Backoff Calculation

| Attempt | Base Formula | With Jitter | Capped at 60s | Example |
|---------|--------------|-------------|---------------|---------|
| 1 | 1 * 2^0 = 1s | 1s + rand(0-1s) | 1-2s | 1.3s |
| 2 | 1 * 2^1 = 2s | 2s + rand(0-1s) | 2-3s | 2.7s |
| 3 | 1 * 2^2 = 4s | 4s + rand(0-1s) | 4-5s | 4.4s |
| 4 | 1 * 2^3 = 8s | 8s + rand(0-1s) | 8-9s | 8.6s |
| 5 | 1 * 2^4 = 16s | 16s + rand(0-1s) | 16-17s | 16.2s |
| 6 | 1 * 2^5 = 32s | 32s + rand(0-1s) | 32-33s | 32.9s |
| 7 | 1 * 2^6 = 64s | 64s + rand(0-1s) | 60s (capped) | 60s |

### Retry Configuration

| Parameter | Default | Min | Max | Description |
|-----------|---------|-----|-----|-------------|
| max_retries | 3 | 0 | 10 | Maximum retry attempts |
| base_delay | 1.0 | 0.1 | 10.0 | Initial delay in seconds |
| max_delay | 60.0 | 1.0 | 300.0 | Maximum delay cap |
| jitter_factor | 1.0 | 0.0 | 2.0 | Random jitter multiplier |

### Error Type Retry Matrix

| Error Type | Error Codes | Retryable | Max Retries | Backoff Strategy |
|------------|-------------|-----------|-------------|------------------|
| Rate Limit | 130, 429 | Yes | 5 | Use Retry-After header |
| Server Error | 500, 503 | Yes | 3 | Exponential backoff |
| Temporary | 368 | Yes | 3 | Exponential backoff |
| Timeout | Network timeout | Yes | 3 | Exponential backoff |
| Validation | 100, 131, 132 | No | 0 | Immediate failure |
| Auth | 190, 401, 403 | No | 0 | Immediate failure |
| Not Found | 404 | No | 0 | Immediate failure |

### Rate Limit Retry Handling

```
API Response with rate limit error:
{
  "error": {
    "code": 130,
    "message": "Rate limit exceeded"
  }
}

Headers:
  Retry-After: 3600  (seconds to wait)

Retry Logic:
1. Detect rate limit error (130 or 429)
2. Extract Retry-After from response headers
3. If present: wait for specified duration
4. If absent: use exponential backoff
5. Log rate limit hit for monitoring
6. Retry after waiting
```

### Retry Metrics Tracking

| Metric | Type | Description |
|--------|------|-------------|
| total_retries | Counter | Total retry attempts across all requests |
| retry_success_rate | Gauge | Percentage of requests that succeeded after retry |
| average_backoff | Gauge | Average backoff delay in seconds |
| max_backoff_reached | Counter | Times max delay cap was hit |
| retries_by_error | Counter | Retry count by error type |
| circuit_breaker_opens | Counter | Times circuit opened |

### Circuit Breaker States

| State | Description | Behavior |
|-------|-------------|----------|
| Closed | Normal operation | Allow all requests |
| Open | Too many failures | Reject all requests immediately |
| Half-Open | Testing recovery | Allow limited probe requests |

### Retry Logging Examples

```
Attempt 1:
[INFO] Sending message to +94771234567
[ERROR] Request failed: Rate limit exceeded (code: 130)
[INFO] Retrying in 1.3 seconds (attempt 1/3)

Attempt 2:
[INFO] Retry attempt 1 - sending message to +94771234567
[ERROR] Request failed: Service unavailable (code: 503)
[INFO] Retrying in 2.7 seconds (attempt 2/3)

Attempt 3:
[INFO] Retry attempt 2 - sending message to +94771234567
[INFO] Message sent successfully (message_id: wamid.abc123)
[INFO] Request succeeded after 2 retries

Final Failure:
[INFO] Retry attempt 3 - sending message to +94771234567
[ERROR] Request failed: Service unavailable (code: 503)
[ERROR] Max retries (3) exceeded, giving up
[ERROR] Final error: WhatsAppNetworkError(503)
```

### Expected Outcome
- Retry decorator implemented with exponential backoff
- Transient errors automatically retried
- Rate limit errors handled with Retry-After respect
- Non-retryable errors fail immediately
- Comprehensive retry logging
- Optional circuit breaker protection
- Configurable retry parameters

### Verification Checklist
- [ ] Retry decorator created and tested
- [ ] Exponential backoff algorithm implemented
- [ ] Jitter added to prevent thundering herd
- [ ] Maximum delay cap enforced
- [ ] Retryable vs non-retryable errors classified
- [ ] Rate limit Retry-After header respected
- [ ] Retry applied to request method
- [ ] Retry logging includes all details
- [ ] Retry metrics tracked
- [ ] Circuit breaker implemented (optional)
- [ ] Configuration parameters documented

---

## Task 23: Create send_message Method

### Overview
Create the core generic message sending method that serves as the foundation for all other sending methods. This method constructs the base message payload, handles recipient formatting, calls the WhatsApp API through the request handler, processes responses, extracts message IDs, and provides a consistent interface for all message types.

### Dependencies
- Task 22: Create Retry Logic

### Instructions

1. **Create the send_message method**
   - Add async method `send_message` to WhatsAppClient class
   - Mark as the core method used by all specialized sending methods
   - Accept recipient phone number and message dictionary
   - Return message ID and status from API response

2. **Define method signature**
   - Parameter: to (str) - Recipient phone number
   - Parameter: message_data (dict) - Message payload
   - Parameter: metadata (dict, optional) - Additional metadata
   - Return: dictionary with message_id, status, and timestamp

3. **Validate recipient phone number**
   - Check if phone number is provided and non-empty
   - Validate phone format (will use Task 30 helper)
   - Convert to WhatsApp format (94XXXXXXXXX)
   - Raise validation error for invalid numbers

4. **Construct base message payload**
   - Create dictionary with required fields
   - Set "messaging_product" to "whatsapp"
   - Set "recipient_type" to "individual"
   - Add "to" field with formatted phone number
   - Merge with provided message_data

5. **Add message metadata**
   - Include message type in payload
   - Add optional metadata if provided
   - Include timestamp for tracking
   - Add tenant context for multi-tenancy

6. **Call request handler**
   - Use `request` method from Task 19
   - Set HTTP method to POST
   - Set endpoint to "messages"
   - Pass constructed payload as data
   - Retry logic applies automatically from Task 22

7. **Process API response**
   - Extract message ID from response (messages[0].id)
   - Extract status from response
   - Extract contact information
   - Handle missing fields gracefully

8. **Create return response**
   - Build dictionary with standardized response format
   - Include message_id from WhatsApp
   - Include send status
   - Include timestamp of send
   - Include recipient phone number

9. **Handle send failures**
   - Catch exceptions from request handler
   - Re-raise with additional context
   - Log failure details
   - Include original error in context

10. **Add method documentation**
    - Document all parameters and return values
    - Provide usage examples in docstring
    - Document error conditions
    - Document message_data structure requirements

### send_message Flow

```
┌────────────────────────────┐
│ send_message(to, data)     │
└──────────┬─────────────────┘
           │
           ▼
┌──────────────────────────────┐
│ Validate Phone Number        │
│ - Check non-empty            │
│ - Format validation          │
└──────────┬───────────────────┘
           │
           ▼
┌──────────────────────────────┐
│ Format Phone for WhatsApp    │
│ - Remove + prefix            │
│ - Add country code           │
│ → 94XXXXXXXXX                │
└──────────┬───────────────────┘
           │
           ▼
┌──────────────────────────────┐
│ Construct Payload            │
│ {                            │
│   "messaging_product":       │
│     "whatsapp",              │
│   "recipient_type":          │
│     "individual",            │
│   "to": "94XXXXXXXXX",       │
│   ...message_data            │
│ }                            │
└──────────┬───────────────────┘
           │
           ▼
┌──────────────────────────────┐
│ Call request(POST,           │
│   "messages", payload)       │
│ (with auto-retry from T-22)  │
└──────────┬───────────────────┘
           │
           ▼
┌──────────────────────────────┐
│ Parse Response               │
│ - Extract message_id         │
│ - Extract status             │
│ - Extract contact info       │
└──────────┬───────────────────┘
           │
           ▼
┌──────────────────────────────┐
│ Return Success Response      │
│ {                            │
│   "message_id": "wamid...",  │
│   "status": "sent",          │
│   "to": "94XXXXXXXXX",       │
│   "timestamp": "..."         │
│ }                            │
└──────────────────────────────┘
```

### Message Payload Structure

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| messaging_product | string | Yes | Always "whatsapp" |
| recipient_type | string | Yes | Always "individual" (for now) |
| to | string | Yes | Recipient phone in WhatsApp format |
| type | string | Yes | Message type (text, template, image, etc.) |
| [type-specific] | object | Yes | Type-specific message content |

### Base Payload Template

```
{
  "messaging_product": "whatsapp",
  "recipient_type": "individual",
  "to": "94771234567",
  "type": "text",  // or template, image, document, etc.
  "text": {        // type-specific content
    "body": "Hello World"
  }
}
```

### API Success Response

```
{
  "messaging_product": "whatsapp",
  "contacts": [
    {
      "input": "94771234567",
      "wa_id": "94771234567"
    }
  ],
  "messages": [
    {
      "id": "wamid.HBgLOTQ3NzEyMzQ1NjcVAgARGBI5QUFBQUE...",
      "message_status": "sent"
    }
  ]
}
```

### Return Response Structure

| Field | Type | Description |
|-------|------|-------------|
| message_id | string | WhatsApp message ID (wamid...) |
| status | string | Send status (sent, queued, failed) |
| to | string | Recipient phone number |
| timestamp | string | ISO 8601 timestamp of send |
| wa_id | string | WhatsApp ID of recipient (from response) |

### Message Types (for type field)

| Type | Description | Used By |
|------|-------------|---------|
| text | Plain text message | Task 25 |
| template | Pre-approved template | Task 24 |
| image | Image message | Task 26 |
| document | Document message | Task 27 |
| interactive | Buttons or lists | Task 28 |
| video | Video message | Future |
| audio | Audio message | Future |

### Phone Number Formatting

| Input Format | Output Format | Notes |
|--------------|---------------|-------|
| +94771234567 | 94771234567 | Remove + prefix |
| 0771234567 | 94771234567 | Replace 0 with 94 |
| 94771234567 | 94771234567 | Already correct |
| 771234567 | 94771234567 | Add 94 prefix |

### Error Scenarios

| Scenario | Error Type | Handling |
|----------|------------|----------|
| Empty phone number | WhatsAppValidationError | Raise immediately |
| Invalid phone format | WhatsAppValidationError | Raise immediately |
| Missing message_data | WhatsAppValidationError | Raise immediately |
| Invalid message type | WhatsAppValidationError | Raise immediately |
| Rate limit hit | WhatsAppRateLimitError | Retry with backoff (Task 22) |
| Network error | WhatsAppNetworkError | Retry with backoff |
| Invalid token | WhatsAppAuthenticationError | Raise immediately |

### Usage by Other Methods

```
Task 24 (send_template) calls:
  send_message(to, {
    "type": "template",
    "template": {...}
  })

Task 25 (send_text) calls:
  send_message(to, {
    "type": "text",
    "text": {"body": "..."}
  })

Task 26 (send_image) calls:
  send_message(to, {
    "type": "image",
    "image": {..}
  })
```

### Expected Outcome
- Core send_message method implemented
- All message types can use this method
- Phone number validation and formatting
- Proper payload construction
- Response parsing and standardization
- Error handling integrated
- Foundation for all other sending methods

### Verification Checklist
- [ ] send_message method created with correct signature
- [ ] Phone number validation implemented
- [ ] Phone formatting to WhatsApp format
- [ ] Base payload constructed correctly
- [ ] Request handler called with correct parameters
- [ ] Response parsed and message_id extracted
- [ ] Standardized return format
- [ ] Error handling for all scenarios
- [ ] Method documentation complete
- [ ] Ready to be used by specialized methods

---

## Task 24: Create send_template Method

### Overview
Implement method for sending pre-approved template messages. WhatsApp requires the first message to a user to use an approved template. Create the send_template method that constructs template payloads, handles template parameters, supports header/body/footer/button parameters, validates template existence, and calls the core send_message method.

### Dependencies
- Task 23: Create send_message Method

### Instructions

1. **Create the send_template method**
   - Add async method `send_template` to WhatsAppClient class
   - This is a specialized wrapper around send_message
   - Accept recipient, template name, and parameters
   - Return same format as send_message

2. **Define method signature**
   - Parameter: to (str) - Recipient phone number
   - Parameter: template_name (str) - Registered template name
   - Parameter: language_code (str) - Template language (default: "en")
   - Parameter: parameters (list, optional) - Template parameters
   - Parameter: header_params (list, optional) - Header parameters
   - Parameter: button_params (list, optional) - Button parameters
   - Return: send_message return value

3. **Validate template name**
   - Check template_name is provided and non-empty
   - Optionally verify template exists in database (from Task 38)
   - Raise validation error if template not found
   - Log template usage for analytics

4. **Construct template payload**
   - Create template object with name and language
   - Build components array for parameters
   - Add body component with parameters if provided
   - Add header component if header_params provided
   - Add button components if button_params provided

5. **Format body parameters**
   - Accept list of parameter values
   - Convert to WhatsApp parameter format
   - Each parameter: {"type": "text", "text": "value"}
   - Maintain parameter order (important!)
   - Support up to 10 body parameters

6. **Format header parameters**
   - Support text, image, document, video headers
   - For text: {"type": "text", "text": "value"}
   - For media: {"type": "image", "image": {"link": "url"}}
   - Add to components array with type "header"

7. **Format button parameters**
   - Support dynamic button URLs
   - Format: {"type": "button", "sub_type": "url", "index": 0, "parameters": [...]}
   - Include button index (0-based)
   - Add URL parameters for dynamic URLs

8. **Build complete message data**
   - Set type to "template"
   - Add template object with all components
   - Ensure proper nesting structure
   - Validate against WhatsApp schema

9. **Call send_message**
   - Pass recipient and constructed template payload
   - Let send_message handle phone formatting
   - Let send_message handle API call
   - Return send_message response directly

10. **Add usage logging**
    - Log template name and parameters used
    - Track template usage for analytics
    - Monitor template delivery rates
    - Alert on template failures

11. **Handle template-specific errors**
    - Template not found (error code 132)
    - Parameter count mismatch
    - Invalid parameter type
    - Template not approved
    - Provide clear error messages

### send_template Flow

```
┌─────────────────────────────────┐
│ send_template(to, name, params) │
└──────────┬──────────────────────┘
           │
           ▼
┌──────────────────────────────────┐
│ Validate Template Name           │
│ - Non-empty check                │
│ - Existence check (optional)     │
└──────────┬───────────────────────┘
           │
           ▼
┌──────────────────────────────────┐
│ Format Body Parameters           │
│ ["John", "100"] →                │
│ [{"type": "text",                │
│   "text": "John"},               │
│  {"type": "text",                │
│   "text": "100"}]                │
└──────────┬───────────────────────┘
           │
           ▼
┌──────────────────────────────────┐
│ Build Components Array           │
│ - Add body component             │
│ - Add header if provided         │
│ - Add buttons if provided        │
└──────────┬───────────────────────┘
           │
           ▼
┌──────────────────────────────────┐
│ Construct Template Payload       │
│ {                                │
│   "type": "template",            │
│   "template": {                  │
│     "name": "...",               │
│     "language": {"code": "en"},  │
│     "components": [...]          │
│   }                              │
│ }                                │
└──────────┬───────────────────────┘
           │
           ▼
┌──────────────────────────────────┐
│ Call send_message(to, payload)   │
└──────────┬───────────────────────┘
           │
           ▼
┌──────────────────────────────────┐
│ Return message_id and status     │
└──────────────────────────────────┘
```

### Template Message Payload Structure

```
{
  "messaging_product": "whatsapp",
  "recipient_type": "individual",
  "to": "94771234567",
  "type": "template",
  "template": {
    "name": "order_confirmation",
    "language": {
      "code": "en"
    },
    "components": [
      {
        "type": "header",
        "parameters": [
          {
            "type": "text",
            "text": "Order #1234"
          }
        ]
      },
      {
        "type": "body",
        "parameters": [
          {
            "type": "text",
            "text": "John Doe"
          },
          {
            "type": "text",
            "text": "Rs. 5,000"
          }
        ]
      },
      {
        "type": "button",
        "sub_type": "url",
        "index": 0,
        "parameters": [
          {
            "type": "text",
            "text": "order-1234"
          }
        ]
      }
    ]
  }
}
```

### Template Components

| Component Type | Purpose | Max Parameters |
|----------------|---------|----------------|
| header | Header text or media | 1 |
| body | Main message body | 10 |
| footer | Footer text | 0 (static) |
| button | Dynamic button URLs | 1 per button |

### Parameter Types

| Type | Used In | Format | Example |
|------|---------|--------|---------|
| text | header, body, button | `{"type": "text", "text": "value"}` | Name, amount |
| image | header | `{"type": "image", "image": {"link": "url"}}` | Product image |
| document | header | `{"type": "document", "document": {"link": "url"}}` | Invoice PDF |
| video | header | `{"type": "video", "video": {"link": "url"}}` | Demo video |

### Language Codes

| Language | Code | Example Template Name |
|----------|------|----------------------|
| English | en | order_confirmation |
| English (US) | en_US | order_confirmation_us |
| Sinhala | si | order_confirmation_si |
| Tamil | ta | order_confirmation_ta |

### Common LCC Templates

| Template Name | Parameters | Usage |
|---------------|------------|-------|
| order_confirmation | [customer_name, order_id, total] | After order placed |
| order_shipped | [customer_name, tracking_url] | When order ships |
| payment_reminder | [customer_name, invoice_id, amount, due_date] | Payment overdue |
| appointment_reminder | [customer_name, date, time, location] | Before appointment |
| otp_verification | [otp_code, expiry_minutes] | OTP for login |

### Example Template Definition

```
Template: order_confirmation
Category: TRANSACTIONAL
Language: en

Header: Order Confirmation
Body: Hello {{1}}, your order {{2}} has been confirmed! 
      Total amount: Rs. {{3}}. 
      We'll notify you when it ships.
Footer: Thank you for shopping with us!
Buttons:
  - View Order → https://lcc.lk/orders/{{1}}
  - Contact Support → Quick Reply
```

### Parameter Mapping Example

```
Template Body: "Hello {{1}}, your order {{2}} totals Rs. {{3}}"

Python Call:
send_template(
  to="+94771234567",
  template_name="order_confirmation",
  language_code="en",
  parameters=["Kasun", "ORD-1234", "5,000"]
)

Result Message:
"Hello Kasun, your order ORD-1234 totals Rs. 5,000"
```

### Template-Specific Error Codes

| Error Code | Description | Resolution |
|------------|-------------|------------|
| 132 | Parameter format error | Check parameter types and count |
| 133 | Template not found | Verify template name and approval |
| 135 | Template paused | Contact Facebook support |
| 136 | Template parameters mismatch | Match parameter count in template |

### Template Status Check

| Status | Can Send | Notes |
|--------|----------|-------|
| APPROVED | Yes | Ready to use |
| PENDING | No | Waiting for approval |
| REJECTED | No | Needs modification |
| PAUSED | No | Paused by admin or quality issues |
| DISABLED | No | Disabled by Facebook |

### Expected Outcome
- send_template method implemented
- Template payload constructed correctly
- All component types supported (header, body, button)
- Parameter formatting handles all types
- Template validation integrated
- Usage logging for analytics
- Clear error messages for template issues

### Verification Checklist
- [ ] send_template method created with correct signature
- [ ] Template name validation implemented
- [ ] Body parameters formatted correctly
- [ ] Header parameters supported (text and media)
- [ ] Button parameters supported
- [ ] Complete payload structure matches WhatsApp schema
- [ ] Calls send_message with constructed payload
- [ ] Template usage logged
- [ ] Template-specific errors handled
- [ ] Documentation includes example templates
- [ ] Supports all LCC template types

---

## Task 25: Create send_text Method

### Overview
Implement a convenience method for sending simple text messages. This is the most commonly used message type for interactive conversations within the 24-hour messaging window. Create the send_text method that accepts plain text, handles message length limits, supports preview_url feature, and provides a simple interface for text-only messages.

### Dependencies
- Task 23: Create send_message Method

### Instructions

1. **Create the send_text method**
   - Add async method `send_text` to WhatsAppClient class
   - Simple wrapper around send_message
   - Accept recipient and text content
   - Return same format as send_message

2. **Define method signature**
   - Parameter: to (str) - Recipient phone number
   - Parameter: text (str) - Message text content
   - Parameter: preview_url (bool, optional) - Enable URL preview (default: False)
   - Return: send_message return value

3. **Validate text content**
   - Check text is provided and non-empty
   - Validate text length (max 4096 characters)
   - Raise validation error if empty or too long
   - Trim whitespace from text

4. **Handle long messages**
   - Check if text exceeds 4096 character limit
   - Option 1: Truncate with warning
   - Option 2: Split into multiple messages
   - Option 3: Raise error (recommended)
   - Log warning for messages approaching limit

5. **Construct text payload**
   - Create message data dictionary
   - Set type to "text"
   - Add text object with body field
   - Include preview_url setting if True

6. **Handle preview_url feature**
   - When True: WhatsApp displays link preview for URLs in text
   - When False: URLs shown as plain text
   - Only affects first URL in message
   - Useful for sharing links to orders, products, etc.

7. **Call send_message**
   - Pass recipient and constructed text payload
   - Let send_message handle phone formatting and API call
   - Return response directly

8. **Add convenience for common use cases**
   - Consider helper for text with emoji
   - Consider helper for text with formatting (bold, italic)
   - Document WhatsApp text formatting syntax

9. **Handle text-specific errors**
   - Empty text error
   - Text too long error
   - Invalid characters (rare)
   - Provide clear error messages

### send_text Flow

```
┌─────────────────────────┐
│ send_text(to, text)     │
└──────────┬──────────────┘
           │
           ▼
┌──────────────────────────┐
│ Validate Text            │
│ - Non-empty check        │
│ - Length check (≤4096)   │
│ - Trim whitespace        │
└──────────┬───────────────┘
           │
           ▼
┌──────────────────────────┐
│ Construct Payload        │
│ {                        │
│   "type": "text",        │
│   "text": {              │
│     "body": "...",       │
│     "preview_url": false │
│   }                      │
│ }                        │
└──────────┬───────────────┘
           │
           ▼
┌──────────────────────────┐
│ Call send_message(to,    │
│   payload)               │
└──────────┬───────────────┘
           │
           ▼
┌──────────────────────────┐
│ Return message_id and    │
│ status                   │
└──────────────────────────┘
```

### Text Message Payload

```
{
  "messaging_product": "whatsapp",
  "recipient_type": "individual",
  "to": "94771234567",
  "type": "text",
  "text": {
    "body": "Your order has been confirmed! Order ID: ORD-1234",
    "preview_url": false
  }
}
```

### Text Message Limits

| Limit | Value | Notes |
|-------|-------|-------|
| Maximum length | 4096 characters | Enforced by WhatsApp |
| Recommended length | 1000 characters | Better user experience |
| Warning threshold | 3500 characters | Log warning |
| URLs per message | Unlimited | Only first gets preview |

### preview_url Feature

| Setting | Effect | Use Case |
|---------|--------|----------|
| true | Shows link preview card | Sharing order links, products |
| false | Shows URL as plain text | Bulk messages, simple notifications |

### Preview URL Example

```
With preview_url=true:
┌────────────────────────────┐
│ Your order has shipped!    │
│                            │
│ ┌────────────────────────┐ │
│ │ [Image Preview]        │ │
│ │ LankaCommerce Cloud    │ │
│ │ Track Your Order       │ │
│ │ lcc.lk/track/ORD-1234  │ │
│ └────────────────────────┘ │
└────────────────────────────┘

With preview_url=false:
┌────────────────────────────┐
│ Your order has shipped!    │
│ lcc.lk/track/ORD-1234      │
└────────────────────────────┘
```

### WhatsApp Text Formatting

| Format | Syntax | Example | Rendered |
|--------|--------|---------|----------|
| Bold | `*text*` | `*Important*` | **Important** |
| Italic | `_text_` | `_Note_` | _Note_ |
| Strikethrough | `~text~` | `~Wrong~` | ~~Wrong~~ |
| Monospace | ` ```text``` ` | ` ```code``` ` | `code` |

### Common Text Message Use Cases

| Use Case | Example | preview_url |
|----------|---------|-------------|
| Order confirmation | "Your order #1234 is confirmed!" | false |
| Shipping notification | "Your order has shipped! Track: [URL]" | true |
| Payment reminder | "Invoice #1234 is overdue. Pay now: [URL]" | true |
| General reply | "Thank you for contacting us!" | false |
| Support response | "We received your query and will respond soon." | false |

### Example Usage Scenarios

```
Scenario 1: Simple notification
send_text(
  to="+94771234567",
  text="Your order #ORD-1234 has been confirmed!"
)

Scenario 2: With tracking link
send_text(
  to="+94771234567",
  text="Your order has shipped! Track here: https://lcc.lk/track/ORD-1234",
  preview_url=True
)

Scenario 3: Formatted text
send_text(
  to="+94771234567",
  text="*Order Update*\nYour order ORD-1234 is _on the way_!\n\nTotal: *Rs. 5,000*"
)

Scenario 4: Multi-line message
send_text(
  to="+94771234567",
  text="""Hello Kasun,

Your order has been confirmed!

Order ID: ORD-1234
Total: Rs. 5,000
Expected Delivery: Feb 5, 2026

Thank you for shopping with us!"""
)
```

### Text Length Handling

| Length | Action | User Feedback |
|--------|--------|---------------|
| 0 | Raise error | "Message text cannot be empty" |
| 1-4096 | Send normally | None |
| 3500-4096 | Send with warning | Log: "Message approaching length limit" |
| >4096 | Raise error | "Message exceeds 4096 character limit" |

### Text-Specific Errors

| Error | Description | Resolution |
|-------|-------------|------------|
| Empty text | text parameter is empty or whitespace | Provide message content |
| Text too long | Exceeds 4096 characters | Shorten message or split |
| Invalid encoding | Contains unsupported characters | Use UTF-8 encoding |

### Expected Outcome
- send_text method implemented
- Simple interface for text messages
- Text validation and length checking
- preview_url feature supported
- Text formatting documented
- Most commonly used message method

### Verification Checklist
- [ ] send_text method created with correct signature
- [ ] Text validation (non-empty, length ≤4096)
- [ ] Text payload constructed correctly
- [ ] preview_url parameter supported
- [ ] Calls send_message with text payload
- [ ] Error handling for empty and long text
- [ ] Documentation includes formatting syntax
- [ ] Example usage for common scenarios
- [ ] Warning logged for messages near limit
- [ ] Tested with URLs, emojis, and formatted text

---

## Summary

This document covered the foundation of WhatsApp API integration: creating the client class, implementing authentication, building request handling, error management, rate limiting, retry logic, and core message sending methods. These components work together to provide a robust, production-ready WhatsApp messaging infrastructure.

### Completed Components

| Task | Component | Purpose |
|------|-----------|---------|
| 17 | WhatsAppClient Class | Main API client interface |
| 18 | Authentication | Bearer token management |
| 19 | Request Handler | Generic API communication |
| 20 | Error Handling | Comprehensive error management |
| 21 | Rate Limiter | Tier-based rate limiting |
| 22 | Retry Logic | Exponential backoff retry |
| 23 | send_message | Core sending method |
| 24 | send_template | Template message sending |
| 25 | send_text | Simple text message sending |

### Next Document

The next document covers media sending (images, documents), interactive messages (buttons, lists), phone number utilities (validation, formatting), message logging, and API verification.

**Continue to:** [02_Tasks-26-32_Media-Phone-Verify.md](02_Tasks-26-32_Media-Phone-Verify.md)
