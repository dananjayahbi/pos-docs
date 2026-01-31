# Tasks 23-28: NotifyLk Provider Implementation

> **Phase:** 09 - Integrations & Sri Lanka Localizations  
> **SubPhase:** 12 - SMS Gateway Integration  
> **Group:** B - Provider Implementations  
> **Document:** 02 of 03  
> **Tasks Covered:** 23, 24, 25, 26, 27, 28

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-17-22_Dialog-Provider.md](01_Tasks-17-22_Dialog-Provider.md)
- **→ Next Document:** [03_Tasks-29-38_TextIt-Factory-Fallback.md](03_Tasks-29-38_TextIt-Factory-Fallback.md)

---

## Document Overview

This document covers the implementation of the Notify.lk SMS provider, a popular SMS aggregator service in Sri Lanka. Notify.lk provides a RESTful API with dual-header authentication (X-User-Id and X-Api-Key) and supports sending messages, checking balance (in LKR), and tracking message delivery status. This implementation creates the HTTP client, authentication handler, API methods, and the provider class that implements the SMSProvider abstract base class.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 23 | Create NotifyLkClient | High | 45 min |
| 24 | Create NotifyLk Auth | Low | 20 min |
| 25 | Create NotifyLk Send | Medium | 35 min |
| 26 | Create NotifyLk Balance | Low | 20 min |
| 27 | Create NotifyLk Status | Low | 25 min |
| 28 | Create NotifyLkProvider | Medium | 30 min |

---

## Task 23: Create NotifyLkClient

### Overview
Create the NotifyLkClient class as the foundational HTTP client for interacting with the Notify.lk REST API. This client handles HTTP communication, base URL configuration, request/response serialization, error handling, and timeout management. The client uses the base URL https://app.notify.lk/api/v1/ and provides methods for authentication, sending messages, checking balance, and querying delivery status.

### Dependencies
- Task 16: SMS Migrations (Database schema)
- Python requests or httpx library
- SMSProvider abstract base class
- SMSConfiguration model

### Instructions

1. **Create NotifyLkClient file**
   - Navigate to `backend/apps/sms/providers/` directory
   - Create new file named `notifylk.py`
   - Import required dependencies (requests/httpx, typing, logging)

2. **Define base configuration**
   - Set BASE_URL constant to `https://app.notify.lk/api/v1/`
   - Define default timeout (30 seconds)
   - Configure retry logic (3 attempts)
   - Set up user agent string

3. **Create NotifyLkClient class**
   - Initialize with user_id and api_key parameters
   - Store credentials as instance variables
   - Create HTTP session with connection pooling
   - Configure session defaults (headers, timeout)

4. **Implement initialization method**
   - Accept user_id (string) parameter
   - Accept api_key (string) parameter
   - Validate both parameters are non-empty
   - Initialize logging for client operations
   - Create requests.Session or httpx.Client instance

5. **Add request method wrapper**
   - Create private method `_make_request()`
   - Accept method (GET/POST), endpoint, data, params
   - Construct full URL from BASE_URL + endpoint
   - Handle authentication (Task 24 will implement)
   - Return response object or raise exception

6. **Implement error handling**
   - Catch network errors (ConnectionError, Timeout)
   - Catch HTTP errors (4xx, 5xx status codes)
   - Catch JSON parsing errors
   - Log all errors with details
   - Raise custom SMSProviderError with context

7. **Add response validation**
   - Check response status code (200-299 = success)
   - Validate JSON response structure
   - Check for API-specific error fields
   - Extract and validate required response data
   - Return parsed response dictionary

8. **Configure session properties**
   - Set default headers (Content-Type: application/json)
   - Configure connection pool (10 connections)
   - Set timeout for all requests (30s)
   - Enable SSL verification
   - Set retry strategy for transient failures

### NotifyLkClient Purpose

| Feature | Benefit |
|---------|---------|
| HTTP Abstraction | Simplifies API communication |
| Error Handling | Graceful failure management |
| Session Pooling | Improved performance |
| Logging | Debugging and monitoring |
| Validation | Data integrity assurance |

### Client Architecture Diagram

```
┌─────────────────────────────────────────────────────┐
│              NotifyLkClient                          │
├─────────────────────────────────────────────────────┤
│  Properties:                                         │
│  - base_url: str                                     │
│  - user_id: str                                      │
│  - api_key: str                                      │
│  - session: requests.Session                         │
│  - timeout: int                                      │
│  - logger: logging.Logger                            │
├─────────────────────────────────────────────────────┤
│  Methods:                                            │
│  + __init__(user_id, api_key)                       │
│  + _make_request(method, endpoint, data, params)    │
│  + _handle_error(response)                           │
│  + _validate_response(response)                      │
│  + close()                                           │
└─────────────────────────────────────────────────────┘
            │
            ├──→ send_message()      (Task 25)
            ├──→ check_balance()     (Task 26)
            └──→ check_status()      (Task 27)
```

### Expected Outcome
- NotifyLkClient class created in notifylk.py
- HTTP client initialized with credentials
- Base URL configured to Notify.lk API endpoint
- Request wrapper method ready for API calls
- Error handling and logging implemented
- Session management configured

### Verification Checklist
- [ ] File `backend/apps/sms/providers/notifylk.py` exists
- [ ] NotifyLkClient class defined
- [ ] BASE_URL constant set to `https://app.notify.lk/api/v1/`
- [ ] Constructor accepts user_id and api_key
- [ ] HTTP session created and configured
- [ ] Error handling implemented
- [ ] Logging configured

---

## Task 24: Create NotifyLk Auth

### Overview
Implement the authentication mechanism for Notify.lk API, which uses a dual-header authentication system. Unlike Dialog's single Authorization header, Notify.lk requires two separate headers: X-User-Id and X-Api-Key. This authentication method must be applied to all API requests (send, balance, status) and should handle authentication failures with clear error messages.

### Dependencies
- Task 23: Create NotifyLkClient

### Instructions

1. **Understand Notify.lk authentication**
   - Authentication uses two HTTP headers
   - X-User-Id header contains the user/account ID
   - X-Api-Key header contains the API key
   - Both headers required for every request
   - No token generation or refresh needed

2. **Store credentials securely**
   - Store user_id in instance variable
   - Store api_key in instance variable
   - Never log credentials in plain text
   - Retrieve from SMSConfiguration model
   - Validate credentials are not empty

3. **Implement authentication method**
   - Create private method `_get_auth_headers()`
   - Return dictionary with two headers
   - Set `X-User-Id` to stored user_id
   - Set `X-Api-Key` to stored api_key
   - Method called by all API request methods

4. **Update _make_request method**
   - Call `_get_auth_headers()` before making request
   - Merge auth headers with request headers
   - Pass headers to HTTP request (GET/POST)
   - Ensure headers sent with every request
   - Log authentication attempt (without exposing keys)

5. **Handle authentication errors**
   - Check for 401 Unauthorized responses
   - Check for 403 Forbidden responses
   - Parse error message from response
   - Raise SMSAuthenticationError with details
   - Log authentication failure

6. **Add credential validation**
   - Validate user_id is non-empty string
   - Validate api_key is non-empty string
   - Check format if specific pattern required
   - Raise ValueError if invalid
   - Validate during initialization

### Dual-Header Authentication

| Header | Value | Purpose |
|--------|-------|---------|
| X-User-Id | Account/User ID | Identifies the account |
| X-Api-Key | API Secret Key | Authenticates the request |
| Content-Type | application/json | Request body format |

### Authentication Flow Diagram

```
┌──────────────┐
│   Client     │
│  (Django)    │
└──────┬───────┘
       │
       │ 1. Create NotifyLkClient(user_id, api_key)
       ▼
┌──────────────────┐
│ NotifyLkClient   │
│ Store credentials│
└──────┬───────────┘
       │
       │ 2. Call send_message() / check_balance() / check_status()
       ▼
┌─────────────────────┐
│ _get_auth_headers() │
│ Return headers dict │
└──────┬──────────────┘
       │
       │ 3. Headers: { 'X-User-Id': ..., 'X-Api-Key': ... }
       ▼
┌──────────────────────┐
│  _make_request()     │
│  Add headers to HTTP │
└──────┬───────────────┘
       │
       │ 4. HTTP POST/GET with headers
       ▼
┌──────────────────────┐
│  Notify.lk API       │
│  Validate headers    │
└──────┬───────────────┘
       │
       ├─→ 200 OK (Valid)
       └─→ 401 Unauthorized (Invalid)
```

### Expected Outcome
- Authentication headers method implemented
- X-User-Id and X-Api-Key headers included in all requests
- Credentials validated during initialization
- Authentication errors handled gracefully
- Secure credential storage

### Verification Checklist
- [ ] `_get_auth_headers()` method implemented
- [ ] Returns dictionary with X-User-Id and X-Api-Key
- [ ] Method called by all API requests
- [ ] Credentials validated in __init__
- [ ] 401/403 errors handled
- [ ] No plain-text credential logging

---

## Task 25: Create NotifyLk Send Method

### Overview
Implement the send_message() method to send SMS messages via the Notify.lk API. The method makes a POST request to the /send endpoint with message details including sender ID, recipient number, message content, and optional reference ID. The method handles response validation, extracts the message ID from the successful response, and provides detailed error handling for failed sends.

### Dependencies
- Task 23: Create NotifyLkClient
- Task 24: Create NotifyLk Auth

### Instructions

1. **Define send_message method signature**
   - Create method `send_message(sender_id, recipient, message, reference_id=None)`
   - sender_id: String (registered sender ID)
   - recipient: String (phone number in international format)
   - message: String (message content, max length varies)
   - reference_id: Optional string for tracking
   - Return message_id on success

2. **Validate input parameters**
   - Check sender_id is non-empty string
   - Validate recipient phone number format (starts with +94 or 94)
   - Normalize recipient to E.164 format
   - Check message is non-empty and within length limit
   - Validate message encoding (GSM-7 or Unicode)
   - Raise ValueError for invalid inputs

3. **Construct request payload**
   - Create dictionary with required fields
   - Set `user_id` field to stored user_id
   - Set `sender_id` field (must be pre-registered)
   - Set `to` field with recipient number
   - Set `message` field with content
   - Add `reference_id` if provided
   - Ensure JSON serializable

4. **Make POST request to /send endpoint**
   - Call `_make_request('POST', 'send', data=payload)`
   - Set Content-Type header to application/json
   - Include authentication headers (automatic)
   - Set timeout to 30 seconds
   - Handle network errors

5. **Process successful response**
   - Check response status code is 200
   - Parse JSON response body
   - Extract message_id from response (e.g., `response['data']['id']`)
   - Extract status field
   - Log successful send with message_id
   - Return message_id as string

6. **Handle API errors**
   - Check for error codes in response (e.g., `response['error']`)
   - Parse error message and code
   - Handle specific errors:
     - Invalid sender_id (not registered)
     - Invalid recipient format
     - Insufficient balance
     - Message too long
     - Rate limiting
   - Raise SMSProviderError with details

7. **Add response validation**
   - Validate response has expected structure
   - Check for required fields (id, status)
   - Verify message_id is non-empty string
   - Validate status is success/queued
   - Log response for debugging

8. **Implement retry logic**
   - Retry on network errors (max 3 attempts)
   - Retry on 5xx server errors
   - Exponential backoff between retries
   - Don't retry on 4xx client errors
   - Log retry attempts

### Request/Response Structure

**Request Payload:**
```json
{
  "user_id": "user123",
  "sender_id": "LCCShop",
  "to": "+94771234567",
  "message": "Your OTP is 123456",
  "reference_id": "otp_abc123"
}
```

**Success Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "id": "msg_xyz789",
    "status": "queued",
    "to": "+94771234567",
    "cost": 1.50
  }
}
```

**Error Response (400/500):**
```json
{
  "status": "error",
  "error": {
    "code": "INSUFFICIENT_BALANCE",
    "message": "Insufficient account balance"
  }
}
```

### Send Method Flow

```
┌─────────────────────────────────────────────────────┐
│           send_message(sender, recipient,           │
│                    message, ref_id)                  │
└────────────────┬────────────────────────────────────┘
                 │
                 ▼
        ┌────────────────────┐
        │ Validate Inputs    │
        │ - sender_id        │
        │ - recipient (+94)  │
        │ - message length   │
        └────────┬───────────┘
                 │
                 ▼
        ┌────────────────────┐
        │ Build JSON Payload │
        │ - user_id          │
        │ - sender_id        │
        │ - to               │
        │ - message          │
        │ - reference_id     │
        └────────┬───────────┘
                 │
                 ▼
        ┌────────────────────────┐
        │ POST /send             │
        │ Headers:               │
        │ - X-User-Id            │
        │ - X-Api-Key            │
        │ - Content-Type: json   │
        └────────┬───────────────┘
                 │
                 ├──→ 200 OK
                 │    └─→ Extract message_id
                 │        └─→ Return message_id
                 │
                 ├──→ 400 Bad Request
                 │    └─→ Raise SMSProviderError
                 │
                 ├──→ 403 Forbidden
                 │    └─→ Raise SMSAuthenticationError
                 │
                 └──→ 500 Server Error
                      └─→ Retry (max 3 times)
```

### Expected Outcome
- send_message() method implemented
- POST request to /send endpoint working
- Input validation for all parameters
- Message ID extracted from response
- Error handling for all failure scenarios
- Retry logic for transient failures

### Verification Checklist
- [ ] send_message() method defined
- [ ] Accepts sender_id, recipient, message, reference_id
- [ ] Validates phone number format (+94)
- [ ] Constructs correct JSON payload
- [ ] Makes POST request to /send
- [ ] Returns message_id on success
- [ ] Handles all error scenarios
- [ ] Retry logic implemented

---

## Task 26: Create NotifyLk Balance Method

### Overview
Implement the check_balance() method to retrieve the current account balance from the Notify.lk API. This method makes a GET request to the /balance endpoint and returns the balance amount in LKR (Sri Lankan Rupees). The balance check is useful for monitoring account credits, preventing send failures due to insufficient funds, and displaying balance in admin dashboards.

### Dependencies
- Task 23: Create NotifyLkClient
- Task 24: Create NotifyLk Auth

### Instructions

1. **Define check_balance method signature**
   - Create method `check_balance()`
   - No parameters required (uses stored credentials)
   - Return balance as Decimal (for currency precision)
   - Return currency code (LKR)

2. **Make GET request to /balance endpoint**
   - Call `_make_request('GET', 'balance')`
   - Include authentication headers (automatic)
   - No request body needed for GET
   - Set timeout to 15 seconds
   - Handle network errors

3. **Process successful response**
   - Check response status code is 200
   - Parse JSON response body
   - Extract balance amount from response (e.g., `response['balance']`)
   - Extract currency from response (should be 'LKR')
   - Convert balance to Decimal for precision
   - Log balance check success

4. **Handle response variations**
   - Balance might be in different fields (balance, credit, amount)
   - Check multiple possible field names
   - Validate balance is numeric
   - Ensure balance is not negative
   - Handle missing balance field

5. **Implement error handling**
   - Handle 401 Unauthorized (invalid credentials)
   - Handle 500 Server Error (API down)
   - Handle network timeout
   - Handle malformed JSON response
   - Raise SMSProviderError with details

6. **Return balance data**
   - Return dictionary with balance and currency
   - Format: `{'balance': Decimal('150.50'), 'currency': 'LKR'}`
   - Use Decimal type for monetary values
   - Include currency code for multi-currency support
   - Log returned balance (for monitoring)

7. **Add caching consideration**
   - Balance doesn't change frequently
   - Consider adding TTL cache (5 minutes)
   - Cache key based on user_id
   - Invalidate on send_message success
   - Optional: implement in future

### Balance Response Structure

**Success Response (200 OK):**
```json
{
  "status": "success",
  "balance": 1523.50,
  "currency": "LKR"
}
```

**Alternative Response Format:**
```json
{
  "status": "success",
  "data": {
    "credit": 1523.50,
    "currency": "LKR",
    "updated_at": "2026-01-31T10:30:00Z"
  }
}
```

**Error Response:**
```json
{
  "status": "error",
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid API credentials"
  }
}
```

### Balance Check Flow

```
┌──────────────────┐
│ check_balance()  │
└────────┬─────────┘
         │
         ▼
┌────────────────────┐
│ GET /balance       │
│ Headers:           │
│ - X-User-Id        │
│ - X-Api-Key        │
└────────┬───────────┘
         │
         ├──→ 200 OK
         │    ├─→ Parse JSON
         │    ├─→ Extract balance (1523.50)
         │    ├─→ Extract currency (LKR)
         │    ├─→ Convert to Decimal
         │    └─→ Return {'balance': Decimal('1523.50'), 'currency': 'LKR'}
         │
         ├──→ 401 Unauthorized
         │    └─→ Raise SMSAuthenticationError
         │
         └──→ 500 Server Error
              └─→ Raise SMSProviderError
```

### Expected Outcome
- check_balance() method implemented
- GET request to /balance endpoint working
- Balance returned as Decimal type
- Currency code (LKR) included
- Error handling for all failure scenarios
- Balance value validated as numeric

### Verification Checklist
- [ ] check_balance() method defined
- [ ] No parameters required
- [ ] Makes GET request to /balance
- [ ] Extracts balance from response
- [ ] Returns balance as Decimal
- [ ] Returns currency as 'LKR'
- [ ] Handles authentication errors
- [ ] Validates balance is numeric

---

## Task 27: Create NotifyLk Status Method

### Overview
Implement the check_status() method to query the delivery status of a previously sent message. This method makes a GET request to the /status/{id} endpoint, where {id} is the message ID returned by send_message(). The status check provides delivery confirmation, identifies failed messages, and enables delivery tracking for audit and customer notification purposes.

### Dependencies
- Task 23: Create NotifyLkClient
- Task 24: Create NotifyLk Auth
- Task 25: Create NotifyLk Send Method

### Instructions

1. **Define check_status method signature**
   - Create method `check_status(message_id)`
   - message_id: String (ID returned by send_message)
   - Return status dictionary with delivery information
   - Include timestamp and status code

2. **Validate message_id parameter**
   - Check message_id is non-empty string
   - Validate format (alphanumeric, specific pattern)
   - Raise ValueError if invalid
   - Log status check attempt

3. **Construct status endpoint URL**
   - Build endpoint path: `/status/{message_id}`
   - Replace {message_id} placeholder with actual ID
   - Example: `/status/msg_xyz789`
   - URL encode if necessary
   - No query parameters needed

4. **Make GET request to status endpoint**
   - Call `_make_request('GET', f'status/{message_id}')`
   - Include authentication headers (automatic)
   - No request body needed
   - Set timeout to 15 seconds
   - Handle network errors

5. **Process successful response**
   - Check response status code is 200
   - Parse JSON response body
   - Extract status field (delivered, pending, failed)
   - Extract delivery timestamp if available
   - Extract error details if status is failed
   - Parse carrier response if available

6. **Map status codes**
   - Map Notify.lk status to standard codes:
     - `delivered` → 'DELIVERED'
     - `queued` → 'PENDING'
     - `sent` → 'SENT'
     - `failed` → 'FAILED'
     - `expired` → 'EXPIRED'
   - Handle unknown status codes
   - Log status mapping

7. **Handle error responses**
   - 404 Not Found: Message ID not found
   - 401 Unauthorized: Invalid credentials
   - Handle message too old (purged from system)
   - Handle API errors gracefully
   - Raise SMSProviderError with details

8. **Return status information**
   - Return dictionary with:
     - status: Mapped status code
     - delivered_at: Timestamp or None
     - error_message: Error details or None
     - carrier_status: Carrier response or None
   - Log status result
   - Cache status if delivered (immutable)

### Status Response Structure

**Success Response (Delivered):**
```json
{
  "status": "success",
  "data": {
    "id": "msg_xyz789",
    "status": "delivered",
    "to": "+94771234567",
    "delivered_at": "2026-01-31T10:35:42Z",
    "cost": 1.50
  }
}
```

**Success Response (Pending):**
```json
{
  "status": "success",
  "data": {
    "id": "msg_xyz789",
    "status": "queued",
    "to": "+94771234567",
    "queued_at": "2026-01-31T10:30:00Z"
  }
}
```

**Success Response (Failed):**
```json
{
  "status": "success",
  "data": {
    "id": "msg_xyz789",
    "status": "failed",
    "to": "+94771234567",
    "error": {
      "code": "INVALID_NUMBER",
      "message": "Recipient number is invalid"
    },
    "failed_at": "2026-01-31T10:31:00Z"
  }
}
```

**Error Response (Not Found):**
```json
{
  "status": "error",
  "error": {
    "code": "NOT_FOUND",
    "message": "Message ID not found"
  }
}
```

### Status Check Flow

```
┌─────────────────────────┐
│ check_status(msg_id)    │
└───────────┬─────────────┘
            │
            ▼
   ┌────────────────────┐
   │ Validate message_id│
   └────────┬───────────┘
            │
            ▼
   ┌────────────────────────┐
   │ GET /status/{msg_id}   │
   │ Headers:               │
   │ - X-User-Id            │
   │ - X-Api-Key            │
   └────────┬───────────────┘
            │
            ├──→ 200 OK (Delivered)
            │    └─→ {
            │         'status': 'DELIVERED',
            │         'delivered_at': '2026-01-31T10:35:42Z',
            │         'error_message': None
            │        }
            │
            ├──→ 200 OK (Pending)
            │    └─→ {
            │         'status': 'PENDING',
            │         'delivered_at': None,
            │         'error_message': None
            │        }
            │
            ├──→ 200 OK (Failed)
            │    └─→ {
            │         'status': 'FAILED',
            │         'delivered_at': None,
            │         'error_message': 'Invalid number'
            │        }
            │
            ├──→ 404 Not Found
            │    └─→ Raise SMSProviderError('Message not found')
            │
            └──→ 401 Unauthorized
                 └─→ Raise SMSAuthenticationError
```

### Status Mapping Table

| Notify.lk Status | Standard Code | Description |
|-----------------|---------------|-------------|
| delivered | DELIVERED | Message delivered to recipient |
| queued | PENDING | Message queued for delivery |
| sent | SENT | Message sent to carrier |
| failed | FAILED | Delivery failed |
| expired | EXPIRED | Message expired before delivery |

### Expected Outcome
- check_status() method implemented
- GET request to /status/{id} endpoint working
- Status codes mapped to standard values
- Delivery timestamp extracted when available
- Error messages captured for failed deliveries
- 404 errors handled for missing message IDs

### Verification Checklist
- [ ] check_status(message_id) method defined
- [ ] Validates message_id parameter
- [ ] Makes GET request to /status/{message_id}
- [ ] Extracts status from response
- [ ] Maps Notify.lk status to standard codes
- [ ] Returns status dictionary
- [ ] Handles 404 Not Found
- [ ] Includes delivered_at timestamp

---

## Task 28: Create NotifyLkProvider

### Overview
Create the NotifyLkProvider class that implements the SMSProvider abstract base class. This provider wraps the NotifyLkClient and provides a standardized interface for sending SMS messages, checking balance, and querying delivery status. The provider handles credential retrieval from SMSConfiguration, client initialization, logging, and error translation to ensure consistent behavior across all SMS providers in the system.

### Dependencies
- Task 16: SMS Migrations (SMSConfiguration model)
- Task 23: Create NotifyLkClient
- Task 24: Create NotifyLk Auth
- Task 25: Create NotifyLk Send Method
- Task 26: Create NotifyLk Balance Method
- Task 27: Create NotifyLk Status Method
- SMSProvider abstract base class

### Instructions

1. **Create NotifyLkProvider class**
   - Define class in `backend/apps/sms/providers/notifylk.py`
   - Inherit from SMSProvider abstract base class
   - Import NotifyLkClient (defined in same file)
   - Set provider_name attribute to 'notifylk'

2. **Implement __init__ method**
   - Accept configuration parameter (SMSConfiguration instance)
   - Extract user_id from configuration.credentials['user_id']
   - Extract api_key from configuration.credentials['api_key']
   - Validate both credentials exist and non-empty
   - Initialize NotifyLkClient with credentials
   - Store configuration reference
   - Set up logging

3. **Implement send_sms method**
   - Method signature: `send_sms(sender_id, recipient, message, reference_id=None)`
   - Validate provider is enabled (check configuration.is_active)
   - Call client.send_message() with parameters
   - Catch SMSProviderError and log
   - Return message_id on success
   - Raise exception on failure
   - Log send attempt and result

4. **Implement get_balance method**
   - Method signature: `get_balance()`
   - Call client.check_balance()
   - Extract balance and currency from result
   - Return as dictionary
   - Handle errors gracefully
   - Log balance check
   - Cache result (optional)

5. **Implement get_delivery_status method**
   - Method signature: `get_delivery_status(message_id)`
   - Validate message_id parameter
   - Call client.check_status(message_id)
   - Return status dictionary
   - Handle 404 errors (message not found)
   - Log status check
   - Return None if not found

6. **Implement validate_credentials method**
   - Method signature: `validate_credentials(credentials_dict)`
   - Check 'user_id' key exists in dictionary
   - Check 'api_key' key exists in dictionary
   - Validate both are non-empty strings
   - Optionally test credentials by calling check_balance
   - Return True if valid, False otherwise
   - Log validation result

7. **Add error translation**
   - Catch NotifyLkClient exceptions
   - Translate to standard SMSProviderError
   - Include original error details
   - Map error codes to standard codes
   - Preserve error context for debugging
   - Log all errors

8. **Implement cleanup method**
   - Override __del__ or add close() method
   - Close HTTP client session
   - Clean up resources
   - Log cleanup action
   - Handle cleanup errors gracefully

### Provider Class Structure

```python
# Conceptual structure (NO CODE)

class NotifyLkProvider(SMSProvider):
    provider_name = 'notifylk'
    
    def __init__(self, configuration: SMSConfiguration):
        # Extract credentials
        # Initialize NotifyLkClient
        # Set up logging
    
    def send_sms(self, sender_id, recipient, message, reference_id=None):
        # Validate provider enabled
        # Call client.send_message()
        # Return message_id
    
    def get_balance(self):
        # Call client.check_balance()
        # Return balance dict
    
    def get_delivery_status(self, message_id):
        # Call client.check_status()
        # Return status dict
    
    def validate_credentials(self, credentials_dict):
        # Check user_id and api_key exist
        # Optionally test with API call
        # Return boolean
```

### Provider Integration Diagram

```
┌────────────────────────────────────────────────────┐
│              Django Application                    │
└────────────────┬───────────────────────────────────┘
                 │
                 ▼
┌────────────────────────────────────────────────────┐
│           SMSProviderFactory                       │
│  get_provider('notifylk') → NotifyLkProvider      │
└────────────────┬───────────────────────────────────┘
                 │
                 ▼
┌────────────────────────────────────────────────────┐
│          NotifyLkProvider                          │
│  Implements: SMSProvider ABC                       │
├────────────────────────────────────────────────────┤
│  + send_sms()           → Calls client             │
│  + get_balance()        → Calls client             │
│  + get_delivery_status()→ Calls client             │
│  + validate_credentials()                           │
└────────────────┬───────────────────────────────────┘
                 │
                 ▼
┌────────────────────────────────────────────────────┐
│          NotifyLkClient                            │
│  HTTP Client for Notify.lk API                     │
├────────────────────────────────────────────────────┤
│  + send_message()       → POST /send               │
│  + check_balance()      → GET /balance             │
│  + check_status()       → GET /status/{id}         │
└────────────────┬───────────────────────────────────┘
                 │
                 ▼
┌────────────────────────────────────────────────────┐
│         Notify.lk REST API                         │
│         https://app.notify.lk/api/v1/              │
└────────────────────────────────────────────────────┘
```

### Expected Outcome
- NotifyLkProvider class created
- Implements all SMSProvider abstract methods
- Wraps NotifyLkClient for API calls
- Credentials loaded from SMSConfiguration
- Error handling and logging implemented
- Credential validation working

### Verification Checklist
- [ ] NotifyLkProvider class defined
- [ ] Inherits from SMSProvider ABC
- [ ] __init__ extracts user_id and api_key
- [ ] send_sms() method implemented
- [ ] get_balance() method implemented
- [ ] get_delivery_status() method implemented
- [ ] validate_credentials() method implemented
- [ ] All methods use NotifyLkClient
- [ ] Error handling implemented
- [ ] Logging configured

---

## Summary

This document covered the complete implementation of the Notify.lk SMS provider, from HTTP client creation to the provider class that integrates with the SMS system. The NotifyLkClient handles all API communication with dual-header authentication (X-User-Id and X-Api-Key), while the NotifyLkProvider provides a standardized interface that implements the SMSProvider abstract base class.

### Completed Tasks

| Task # | Task Name | Deliverable |
|--------|-----------|-------------|
| 23 | Create NotifyLkClient | HTTP client with session management |
| 24 | Create NotifyLk Auth | Dual-header authentication (X-User-Id, X-Api-Key) |
| 25 | Create NotifyLk Send | POST /send endpoint implementation |
| 26 | Create NotifyLk Balance | GET /balance endpoint (returns LKR) |
| 27 | Create NotifyLk Status | GET /status/{id} endpoint |
| 28 | Create NotifyLkProvider | SMSProvider implementation |

### Key Technical Details

- **Base URL:** https://app.notify.lk/api/v1/
- **Authentication:** X-User-Id and X-Api-Key headers
- **Currency:** LKR (Sri Lankan Rupees)
- **Status Codes:** delivered, queued, sent, failed, expired
- **Retry Logic:** 3 attempts for network/server errors
- **Timeout:** 30 seconds for send, 15 seconds for balance/status

### Integration Points

- SMSConfiguration model stores user_id and api_key
- SMSProvider ABC defines interface contract
- SMSProviderFactory will register NotifyLkProvider (Task 35)
- Provider fallback system will use NotifyLk as alternative (Task 37)

### Next Steps

Proceed to [03_Tasks-29-38_TextIt-Factory-Fallback.md](03_Tasks-29-38_TextIt-Factory-Fallback.md) to implement the TextIt provider, register all three providers (Dialog, NotifyLk, TextIt) with the factory, implement provider fallback logic, and verify all providers are working correctly.

---

**Document Status:** Complete  
**Last Updated:** 2026-01-31  
**Next Review:** After Task 38 completion
