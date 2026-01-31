# Tasks 17-22: Dialog SMS Provider Implementation

> **Phase:** 09 - Integrations & Sri Lanka Localizations  
> **SubPhase:** 12 - SMS Gateway Integration  
> **Group:** B - Provider Implementations  
> **Document:** 01 of 03  
> **Tasks Covered:** 17, 18, 19, 20, 21, 22

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [../Group-A_SMS-Configuration/02_Tasks-09-16_SMS-Models-Migrations.md](../Group-A_SMS-Configuration/02_Tasks-09-16_SMS-Models-Migrations.md)
- **→ Next Document:** [02_Tasks-23-28_NotifyLk-Provider.md](02_Tasks-23-28_NotifyLk-Provider.md)

---

## Document Overview

This document covers the implementation of the Dialog SMS provider integration. Dialog is Sri Lanka's largest telecommunications carrier and provides an HTTP-based SMS API. This implementation creates a DialogSMSClient for HTTP communication, implements authentication using Bearer tokens, creates methods for sending SMS, checking balance, and querying message status, and wraps everything in a DialogProvider class that implements the SMSProvider abstract base class.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 17 | Create DialogSMSClient | High | 45 min |
| 18 | Create Dialog Authentication | Low | 20 min |
| 19 | Create Dialog Send Method | Medium | 30 min |
| 20 | Create Dialog Balance Method | Low | 20 min |
| 21 | Create Dialog Status Method | Low | 25 min |
| 22 | Create DialogProvider Class | Medium | 35 min |

---

## Dialog API Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     Dialog API Integration                   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
        ┌──────────────────────────────────────┐
        │      DialogProvider (Task 22)         │
        │  Implements: SMSProvider ABC          │
        │  • send_sms()                         │
        │  • check_balance()                    │
        │  • check_status()                     │
        └──────────────────────────────────────┘
                              │
                              ▼
        ┌──────────────────────────────────────┐
        │    DialogSMSClient (Task 17)          │
        │  Base URL: https://api.dialog.lk/sms/│
        │  • HTTP client configuration          │
        │  • Request/response handling          │
        │  • Error handling and retries         │
        └──────────────────────────────────────┘
                              │
              ┌───────────────┼───────────────┐
              ▼               ▼               ▼
    ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
    │ Auth (T18)   │  │ Send (T19)   │  │ Balance(T20) │
    │ Bearer Token │  │ POST /send   │  │ GET /balance │
    └──────────────┘  └──────────────┘  └──────────────┘
                              │
                              ▼
                      ┌──────────────┐
                      │ Status (T21) │
                      │ GET /status  │
                      └──────────────┘
```

---

## Dialog API Flow Diagram

```
┌──────────┐                                        ┌──────────────┐
│ ERP App  │                                        │  Dialog API  │
└────┬─────┘                                        └──────┬───────┘
     │                                                     │
     │ 1. Request SMS Send                                │
     ├─────────────────────────────────────────────────►  │
     │    DialogProvider.send_sms(                        │
     │      phone="+94771234567",                         │
     │      message="Your OTP is 123456"                  │
     │    )                                               │
     │                                                    │
     │                                  2. Authenticate   │
     │                                  ◄─────────────────┤
     │                                  Bearer Token      │
     │                                                    │
     │                                  3. POST /send     │
     │                                  ◄─────────────────┤
     │                                  { phone, message }│
     │                                                    │
     │ 4. Return message_id                              │
     │  ◄───────────────────────────────────────────────┤
     │    { message_id: "DLG123456" }                    │
     │                                                    │
     │ 5. Check Status (optional)                        │
     ├─────────────────────────────────────────────────►  │
     │    DialogProvider.check_status("DLG123456")       │
     │                                                    │
     │                                  6. GET /status/id │
     │                                  ◄─────────────────┤
     │                                                    │
     │ 7. Return Status                                  │
     │  ◄───────────────────────────────────────────────┤
     │    { status: "delivered" }                        │
     │                                                    │
```

---

## Task 17: Create DialogSMSClient

### Overview
Create the DialogSMSClient class that handles HTTP communication with Dialog's SMS API. This client manages the base URL configuration, HTTP session setup, request/response handling, timeout management, retry logic, and error handling. The client serves as the foundation for all Dialog API interactions.

### Dependencies
- Task 16: SMS Migrations completed
- Group A: SMS Configuration complete
- `requests` library installed
- `urllib3` for retry logic
- Settings configured in Django

### Instructions

#### 1. Create Client File Structure
   - Navigate to `backend/apps/integrations/sms_gateway/providers/`
   - Create directory `dialog/`
   - Create file `client.py` inside dialog directory
   - Create `__init__.py` in dialog directory

#### 2. Import Required Dependencies
   - Import `requests` for HTTP communication
   - Import `urllib3.util.retry.Retry` for retry logic
   - Import `requests.adapters.HTTPAdapter`
   - Import logging for error tracking
   - Import typing for type hints (Dict, Optional, Any)
   - Import Django settings

#### 3. Define DialogSMSClient Class
   - Create class `DialogSMSClient`
   - Define `__init__` method accepting API credentials
   - Store base URL: `https://api.dialog.lk/sms/`
   - Store API key/token from settings
   - Initialize logger instance

#### 4. Configure HTTP Session
   - Create `requests.Session()` instance
   - Configure timeout values (connect: 5s, read: 30s)
   - Set User-Agent header
   - Configure connection pooling
   - Set maximum pool connections: 10

#### 5. Implement Retry Strategy
   - Create Retry object with following config:
     - Total retries: 3
     - Backoff factor: 0.5 (exponential backoff)
     - Status forcelist: [429, 500, 502, 503, 504]
     - Allowed methods: ["GET", "POST"]
   - Create HTTPAdapter with retry strategy
   - Mount adapter to session for http:// and https://

#### 6. Create Request Helper Method
   - Define private method `_make_request()`
   - Accept parameters: method, endpoint, data, params
   - Construct full URL from base_url + endpoint
   - Add authentication headers
   - Handle request exceptions (ConnectionError, Timeout, etc.)
   - Log all requests and responses
   - Return response JSON or raise custom exception

#### 7. Implement Response Validation
   - Check response status code
   - Validate response JSON structure
   - Extract error messages from API responses
   - Raise appropriate exceptions for different error types:
     - Authentication errors (401, 403)
     - Rate limiting (429)
     - Server errors (500+)
     - Invalid requests (400)

#### 8. Add Connection Management
   - Implement `close()` method to close session
   - Implement context manager (`__enter__`, `__exit__`)
   - Ensure proper cleanup of resources
   - Handle session lifecycle

### DialogSMSClient Purpose

| Component | Purpose |
|-----------|---------|
| Base URL | Centralized API endpoint configuration |
| Session | Persistent connection pooling and reuse |
| Retry Logic | Automatic retry on transient failures |
| Error Handling | Convert API errors to app exceptions |
| Logging | Track all API interactions for debugging |
| Context Manager | Proper resource cleanup |

### Client Configuration

```
DialogSMSClient Configuration
├── Base URL: https://api.dialog.lk/sms/
├── Timeout: 5s connect, 30s read
├── Retries: 3 attempts with exponential backoff
├── Connection Pool: Max 10 connections
├── Headers: User-Agent, Authorization
└── Error Handling: Custom exceptions
```

### HTTP Session Architecture

```
┌─────────────────────────────────────────┐
│        DialogSMSClient Instance          │
├─────────────────────────────────────────┤
│  requests.Session()                      │
│  ├── Connection Pool (max: 10)          │
│  ├── HTTPAdapter with Retry             │
│  │   ├── Total: 3 retries               │
│  │   ├── Backoff: 0.5 (exponential)     │
│  │   └── Status: [429, 500, 502, ...]   │
│  ├── Default Headers                     │
│  │   ├── User-Agent                      │
│  │   └── Content-Type: application/json │
│  └── Timeout: (5, 30)                    │
└─────────────────────────────────────────┘
```

### Expected Outcome
- DialogSMSClient class created with robust HTTP handling
- Session configured with connection pooling
- Retry logic implemented for resilience
- Comprehensive error handling in place
- Proper resource management via context manager
- Logging configured for debugging

### Verification Checklist
- [ ] File created: `backend/apps/integrations/sms_gateway/providers/dialog/client.py`
- [ ] DialogSMSClient class defined
- [ ] Session initialized with retry logic
- [ ] Base URL configured correctly
- [ ] Error handling implemented
- [ ] Context manager methods present
- [ ] Logging configured
- [ ] Type hints added to all methods

---

## Task 18: Create Dialog Authentication

### Overview
Implement authentication for Dialog SMS API using Bearer token authentication. Dialog requires an API key to be sent in the Authorization header with each request. This task adds the authentication logic to the DialogSMSClient and creates methods to validate credentials.

### Dependencies
- Task 17: Create DialogSMSClient

### Instructions

#### 1. Define Authentication Storage
   - Add `api_key` parameter to DialogSMSClient `__init__`
   - Store API key as instance variable `self.api_key`
   - Load from Django settings: `settings.DIALOG_SMS_API_KEY`
   - Validate that API key is not empty

#### 2. Implement Authentication Header Method
   - Create private method `_get_auth_headers()`
   - Return dictionary with Authorization header
   - Format: `{"Authorization": "Bearer {api_key}"}`
   - Include Content-Type: application/json
   - Include Accept: application/json

#### 3. Integrate Auth into Requests
   - Modify `_make_request()` to call `_get_auth_headers()`
   - Merge auth headers with any custom headers
   - Ensure auth headers are sent with every request
   - Handle missing API key gracefully

#### 4. Create Credential Validation Method
   - Define method `validate_credentials()`
   - Make test request to Dialog API (e.g., GET /balance)
   - Return True if credentials are valid
   - Return False or raise exception if invalid
   - Log authentication failures

#### 5. Implement Token Refresh Logic (if needed)
   - Check if Dialog API supports token refresh
   - If yes, implement refresh method
   - If no, document that API keys are long-lived
   - Handle token expiration scenarios

#### 6. Add Authentication Error Handling
   - Catch 401 Unauthorized responses
   - Catch 403 Forbidden responses
   - Raise custom `AuthenticationError` exception
   - Include detailed error message
   - Log authentication errors with context

#### 7. Create Settings Integration
   - Document required settings in Django
   - Settings keys:
     - `DIALOG_SMS_API_KEY`
     - `DIALOG_SMS_API_URL` (optional override)
   - Add validation for settings on initialization
   - Provide clear error messages for missing settings

#### 8. Implement Security Best Practices
   - Never log the full API key (mask it: `****xxxx`)
   - Store API key in environment variables
   - Don't commit API keys to version control
   - Use Django's secret management
   - Document security considerations

### Authentication Flow

```
┌──────────────────────────────────────────────────┐
│          Dialog API Authentication                │
└──────────────────────────────────────────────────┘
                     │
                     ▼
         ┌─────────────────────┐
         │  Load API Key from  │
         │   Django Settings   │
         └─────────────────────┘
                     │
                     ▼
         ┌─────────────────────┐
         │  Store in Client    │
         │   Instance          │
         └─────────────────────┘
                     │
                     ▼
         ┌─────────────────────┐
         │ Generate Auth Header│
         │ Bearer {api_key}    │
         └─────────────────────┘
                     │
                     ▼
         ┌─────────────────────┐
         │  Attach to Every    │
         │  HTTP Request       │
         └─────────────────────┘
                     │
                     ▼
         ┌─────────────────────┐
         │  Dialog API Validates│
         │  Returns 200/401    │
         └─────────────────────┘
```

### Authentication Purpose

| Component | Purpose |
|-----------|---------|
| Bearer Token | Industry standard for API authentication |
| Header Injection | Automatic auth on every request |
| Validation | Test credentials before first use |
| Error Handling | Clear messages for auth failures |
| Security | Protect credentials from exposure |

### Settings Configuration Example

```
# Settings structure (not actual code)
DIALOG_SMS_API_KEY = env("DIALOG_SMS_API_KEY")
DIALOG_SMS_API_URL = "https://api.dialog.lk/sms/"

# In client initialization:
client = DialogSMSClient(
    api_key=settings.DIALOG_SMS_API_KEY,
    base_url=settings.DIALOG_SMS_API_URL
)
```

### Expected Outcome
- Authentication headers automatically added to all requests
- API key loaded from Django settings
- Credential validation method available
- Authentication errors properly handled
- Security best practices implemented
- Settings documented

### Verification Checklist
- [ ] API key parameter added to `__init__`
- [ ] `_get_auth_headers()` method created
- [ ] Auth headers integrated into `_make_request()`
- [ ] `validate_credentials()` method implemented
- [ ] Authentication error handling added
- [ ] Settings integration complete
- [ ] API key masking in logs implemented
- [ ] Documentation for security practices added

---

## Task 19: Create Dialog Send Method

### Overview
Implement the SMS sending functionality for Dialog API. This method accepts a phone number and message, sends the SMS via Dialog's POST /send endpoint, and returns a message ID that can be used to track the message status. This is the core functionality of the SMS provider.

### Dependencies
- Task 17: Create DialogSMSClient
- Task 18: Create Dialog Authentication

### Instructions

#### 1. Define Send Method Signature
   - Create method `send_sms()`
   - Parameters:
     - `phone_number` (str): Recipient phone in E.164 format
     - `message` (str): SMS message text
     - `sender_id` (str, optional): Sender name/number
   - Return type: Dict with message_id and status
   - Add type hints for all parameters

#### 2. Validate Input Parameters
   - Validate phone number format (must start with +94)
   - Check phone number length (Sri Lankan: 12 chars with +94)
   - Validate message length (max 160 chars for single SMS)
   - Check for empty message
   - Validate sender_id format if provided
   - Raise ValueError for invalid inputs

#### 3. Prepare Request Payload
   - Create dictionary with required fields:
     - `to`: Phone number (E.164 format)
     - `message`: SMS text content
     - `from`: Sender ID (if provided)
   - Add optional parameters:
     - `type`: "SMS" or "Unicode"
     - `callback_url`: For delivery reports (if configured)
   - Convert payload to JSON

#### 4. Make API Request
   - Call `_make_request()` with:
     - Method: "POST"
     - Endpoint: "/send"
     - Data: JSON payload
   - Set timeout appropriate for SMS sending (30s)
   - Handle connection errors
   - Log the request (mask phone number partially)

#### 5. Parse API Response
   - Extract response JSON
   - Expected response structure:
     - `message_id`: Unique identifier from Dialog
     - `status`: Initial status (e.g., "queued", "sent")
     - `credits_used`: Number of credits consumed
   - Validate response has required fields
   - Handle missing fields gracefully

#### 6. Handle Errors
   - Check response status code
   - Handle specific error codes:
     - 400: Invalid request (bad phone/message)
     - 401: Authentication failure
     - 403: Insufficient credits
     - 429: Rate limit exceeded
     - 500+: Server errors
   - Raise custom exceptions for each error type
   - Include error details in exception message

#### 7. Return Standardized Response
   - Create return dictionary with:
     - `message_id`: Dialog's message ID
     - `status`: Delivery status
     - `provider`: "dialog"
     - `credits_used`: Credits consumed
     - `timestamp`: Current datetime
   - Ensure consistent response format
   - Add any additional metadata

#### 8. Implement Logging
   - Log successful sends (INFO level)
   - Log failures (ERROR level)
   - Include message_id in logs
   - Mask sensitive data (phone numbers, message content)
   - Add correlation IDs for tracking

### Send Method Flow

```
┌────────────────────────────────────────────────┐
│          send_sms() Method Flow                 │
└────────────────────────────────────────────────┘
                    │
                    ▼
    ┌───────────────────────────┐
    │  1. Validate Inputs        │
    │  • Phone format (+94...)   │
    │  • Message length (≤160)   │
    │  • Sender ID format        │
    └───────────────────────────┘
                    │
                    ▼
    ┌───────────────────────────┐
    │  2. Prepare Payload        │
    │  { to, message, from }     │
    └───────────────────────────┘
                    │
                    ▼
    ┌───────────────────────────┐
    │  3. POST /send             │
    │  with Bearer token         │
    └───────────────────────────┘
                    │
                    ▼
    ┌───────────────────────────┐
    │  4. Parse Response         │
    │  Extract message_id        │
    └───────────────────────────┘
                    │
                    ▼
    ┌───────────────────────────┐
    │  5. Return Result          │
    │  { message_id, status }    │
    └───────────────────────────┘
```

### Send Method Purpose

| Feature | Purpose |
|---------|---------|
| Validation | Ensure data quality before API call |
| Formatting | Convert data to Dialog's expected format |
| Error Handling | Graceful failure with clear messages |
| Response Parsing | Extract message ID for tracking |
| Logging | Audit trail of all sent messages |
| Standardization | Consistent return format for all providers |

### API Request/Response Example

```
# Request to Dialog API (conceptual)
POST https://api.dialog.lk/sms/send
Headers:
  Authorization: Bearer {api_key}
  Content-Type: application/json
Body:
{
  "to": "+94771234567",
  "message": "Your OTP is 123456",
  "from": "LCC"
}

# Response from Dialog API
{
  "message_id": "DLG-MSG-123456789",
  "status": "queued",
  "credits_used": 1,
  "timestamp": "2026-01-31T10:30:00Z"
}
```

### Expected Outcome
- `send_sms()` method fully functional
- Input validation prevents bad requests
- API integration working correctly
- Message ID returned for tracking
- Errors handled with specific exceptions
- Logging captures all send attempts
- Response format standardized

### Verification Checklist
- [ ] `send_sms()` method created with correct signature
- [ ] Phone number validation implemented
- [ ] Message length validation added
- [ ] Request payload properly formatted
- [ ] POST /send endpoint called correctly
- [ ] Response parsed and validated
- [ ] Error handling for all failure scenarios
- [ ] Logging implemented with data masking
- [ ] Return format standardized

---

## Task 20: Create Dialog Balance Method

### Overview
Implement the balance checking functionality for Dialog API. This method queries the Dialog API to retrieve the current SMS credit balance for the account. This is essential for monitoring credit usage and preventing send failures due to insufficient credits.

### Dependencies
- Task 17: Create DialogSMSClient
- Task 18: Create Dialog Authentication

### Instructions

#### 1. Define Balance Method Signature
   - Create method `check_balance()`
   - No parameters required
   - Return type: Dict with balance information
   - Add type hint for return value

#### 2. Make API Request
   - Call `_make_request()` with:
     - Method: "GET"
     - Endpoint: "/balance"
     - No data payload needed
   - Use shorter timeout (10s for simple query)
   - Handle connection errors
   - Log the request

#### 3. Parse Balance Response
   - Extract response JSON
   - Expected response structure:
     - `balance`: Available credits (float or int)
     - `currency`: Currency type (if applicable)
     - `last_updated`: Timestamp of last update
   - Validate response has required fields
   - Handle missing or malformed data

#### 4. Convert Balance Format
   - Convert balance to standard format
   - Ensure numeric type (float)
   - Round to 2 decimal places if needed
   - Handle different currency formats
   - Set default values for missing fields

#### 5. Cache Balance Result (Optional)
   - Consider caching balance for short duration (e.g., 5 minutes)
   - Avoid excessive API calls
   - Implement cache invalidation
   - Use Django cache framework
   - Document cache behavior

#### 6. Handle Errors
   - Handle specific error scenarios:
     - 401: Authentication failure
     - 403: Permission denied
     - 500+: Server errors
   - Raise custom exceptions
   - Provide fallback value (e.g., 0) if needed
   - Log all errors

#### 7. Return Standardized Response
   - Create return dictionary with:
     - `balance`: Current credit balance
     - `currency`: Currency type
     - `provider`: "dialog"
     - `timestamp`: Query timestamp
     - `cached`: Boolean indicating if cached
   - Ensure consistent format
   - Include metadata

#### 8. Implement Warning Thresholds
   - Define low balance threshold (e.g., < 100 credits)
   - Log warning if balance is low
   - Include balance status in response
   - Consider alert mechanism for critical levels

### Balance Check Flow

```
┌────────────────────────────────────────────────┐
│        check_balance() Method Flow              │
└────────────────────────────────────────────────┘
                    │
                    ▼
    ┌───────────────────────────┐
    │  1. Check Cache (optional) │
    │  Return if fresh           │
    └───────────────────────────┘
                    │
                    ▼
    ┌───────────────────────────┐
    │  2. GET /balance           │
    │  with Bearer token         │
    └───────────────────────────┘
                    │
                    ▼
    ┌───────────────────────────┐
    │  3. Parse Response         │
    │  Extract balance value     │
    └───────────────────────────┘
                    │
                    ▼
    ┌───────────────────────────┐
    │  4. Check Threshold        │
    │  Warn if low               │
    └───────────────────────────┘
                    │
                    ▼
    ┌───────────────────────────┐
    │  5. Cache Result (optional)│
    │  TTL: 5 minutes            │
    └───────────────────────────┘
                    │
                    ▼
    ┌───────────────────────────┐
    │  6. Return Balance         │
    │  { balance, currency }     │
    └───────────────────────────┘
```

### Balance Method Purpose

| Feature | Purpose |
|---------|---------|
| Real-time Check | Get current credit balance |
| Monitoring | Track credit consumption |
| Prevention | Avoid send failures due to low credits |
| Alerting | Warn when balance is low |
| Caching | Reduce unnecessary API calls |

### API Request/Response Example

```
# Request to Dialog API (conceptual)
GET https://api.dialog.lk/sms/balance
Headers:
  Authorization: Bearer {api_key}

# Response from Dialog API
{
  "balance": 1500.50,
  "currency": "LKR",
  "last_updated": "2026-01-31T10:30:00Z"
}

# Standardized Return Format
{
  "balance": 1500.50,
  "currency": "LKR",
  "provider": "dialog",
  "timestamp": "2026-01-31T10:31:00Z",
  "cached": false,
  "status": "ok",  # or "low" if below threshold
  "threshold_warning": false
}
```

### Expected Outcome
- `check_balance()` method fully functional
- Balance retrieved from Dialog API
- Response parsed and standardized
- Low balance warnings implemented
- Optional caching configured
- Error handling complete

### Verification Checklist
- [ ] `check_balance()` method created
- [ ] GET /balance endpoint called correctly
- [ ] Response parsed and validated
- [ ] Balance format standardized (float)
- [ ] Low balance threshold check implemented
- [ ] Warning logged when balance is low
- [ ] Error handling for all scenarios
- [ ] Optional caching implemented
- [ ] Return format consistent

---

## Task 21: Create Dialog Status Method

### Overview
Implement the message status checking functionality for Dialog API. This method accepts a message ID and queries the Dialog API to retrieve the current delivery status of the SMS. This enables tracking of message delivery and handling of delivery failures.

### Dependencies
- Task 17: Create DialogSMSClient
- Task 18: Create Dialog Authentication
- Task 19: Create Dialog Send Method (for message IDs)

### Instructions

#### 1. Define Status Method Signature
   - Create method `check_status()`
   - Parameters:
     - `message_id` (str): Dialog's message identifier
   - Return type: Dict with status information
   - Add type hints

#### 2. Validate Input
   - Validate message_id is not empty
   - Check message_id format if Dialog has specific format
   - Raise ValueError for invalid message_id
   - Log validation failures

#### 3. Make API Request
   - Call `_make_request()` with:
     - Method: "GET"
     - Endpoint: f"/status/{message_id}"
     - No data payload
   - Use standard timeout (15s)
   - Handle connection errors
   - Log the request with message_id

#### 4. Parse Status Response
   - Extract response JSON
   - Expected response fields:
     - `message_id`: Echo of input ID
     - `status`: Current delivery status
     - `delivered_at`: Timestamp (if delivered)
     - `error_code`: Error code (if failed)
     - `error_message`: Error description (if failed)
   - Validate response structure
   - Handle missing fields

#### 5. Map Status Values
   - Define status mapping dictionary:
     - Dialog status → Standard status
     - Examples:
       - "queued" → "pending"
       - "sent" → "sent"
       - "delivered" → "delivered"
       - "failed" → "failed"
       - "expired" → "failed"
   - Use consistent status values across all providers
   - Document all possible status values

#### 6. Handle Status Errors
   - Handle specific error scenarios:
     - 404: Message ID not found
     - 401: Authentication failure
     - 500+: Server errors
   - Raise custom exceptions with context
   - Include original message_id in error
   - Log all errors with details

#### 7. Return Standardized Response
   - Create return dictionary with:
     - `message_id`: Original message ID
     - `status`: Standardized status value
     - `delivered_at`: Delivery timestamp (if applicable)
     - `error_code`: Error code (if failed)
     - `error_message`: Human-readable error
     - `provider`: "dialog"
     - `raw_status`: Original Dialog status
     - `timestamp`: Query timestamp
   - Ensure consistent format across providers
   - Include all relevant metadata

#### 8. Implement Status Caching (Optional)
   - Consider caching status for delivered messages
   - Delivered status won't change
   - Cache TTL: indefinite for delivered, short for pending
   - Implement cache invalidation strategy
   - Document caching behavior

### Status Check Flow

```
┌────────────────────────────────────────────────┐
│        check_status() Method Flow               │
└────────────────────────────────────────────────┘
                    │
                    ▼
    ┌───────────────────────────┐
    │  1. Validate message_id    │
    │  Not empty, correct format │
    └───────────────────────────┘
                    │
                    ▼
    ┌───────────────────────────┐
    │  2. Check Cache (optional) │
    │  Return if delivered       │
    └───────────────────────────┘
                    │
                    ▼
    ┌───────────────────────────┐
    │  3. GET /status/{id}       │
    │  with Bearer token         │
    └───────────────────────────┘
                    │
                    ▼
    ┌───────────────────────────┐
    │  4. Parse Response         │
    │  Extract status, times     │
    └───────────────────────────┘
                    │
                    ▼
    ┌───────────────────────────┐
    │  5. Map Status             │
    │  Dialog → Standard         │
    └───────────────────────────┘
                    │
                    ▼
    ┌───────────────────────────┐
    │  6. Cache if Delivered     │
    │  (optional)                │
    └───────────────────────────┘
                    │
                    ▼
    ┌───────────────────────────┐
    │  7. Return Status          │
    │  { status, timestamps }    │
    └───────────────────────────┘
```

### Status Mapping Table

| Dialog Status | Standard Status | Description |
|--------------|----------------|-------------|
| queued | pending | Message queued for sending |
| sent | sent | Sent to carrier |
| delivered | delivered | Successfully delivered |
| failed | failed | Delivery failed |
| expired | failed | Message expired |
| rejected | failed | Rejected by carrier |
| unknown | pending | Status unknown |

### Status Method Purpose

| Feature | Purpose |
|---------|---------|
| Tracking | Monitor message delivery |
| Debugging | Diagnose delivery failures |
| Standardization | Consistent status across providers |
| Caching | Reduce API calls for delivered messages |
| Error Details | Understand why delivery failed |

### API Request/Response Example

```
# Request to Dialog API (conceptual)
GET https://api.dialog.lk/sms/status/DLG-MSG-123456789
Headers:
  Authorization: Bearer {api_key}

# Response from Dialog API - Delivered
{
  "message_id": "DLG-MSG-123456789",
  "status": "delivered",
  "delivered_at": "2026-01-31T10:31:30Z",
  "sent_at": "2026-01-31T10:30:15Z"
}

# Response from Dialog API - Failed
{
  "message_id": "DLG-MSG-123456789",
  "status": "failed",
  "error_code": "INVALID_NUMBER",
  "error_message": "The recipient number is invalid"
}

# Standardized Return Format
{
  "message_id": "DLG-MSG-123456789",
  "status": "delivered",
  "delivered_at": "2026-01-31T10:31:30Z",
  "sent_at": "2026-01-31T10:30:15Z",
  "provider": "dialog",
  "raw_status": "delivered",
  "timestamp": "2026-01-31T10:32:00Z",
  "cached": false
}
```

### Expected Outcome
- `check_status()` method fully functional
- Message status retrieved from Dialog API
- Status values mapped to standard format
- Delivery timestamps captured
- Error details extracted for failures
- Optional caching implemented
- Consistent return format

### Verification Checklist
- [ ] `check_status()` method created with correct signature
- [ ] message_id validation implemented
- [ ] GET /status/{id} endpoint called correctly
- [ ] Response parsed and validated
- [ ] Status mapping dictionary defined
- [ ] All Dialog statuses mapped to standard values
- [ ] Error handling for missing message_id (404)
- [ ] Delivery timestamps extracted
- [ ] Error codes and messages captured
- [ ] Optional caching implemented
- [ ] Return format standardized

---

## Task 22: Create DialogProvider Class

### Overview
Create the DialogProvider class that implements the SMSProvider abstract base class. This provider wraps the DialogSMSClient and provides a consistent interface for the SMS gateway system. It handles provider configuration, credential management, method implementation, error handling, and integration with the SMS gateway models.

### Dependencies
- Task 17: Create DialogSMSClient
- Task 18: Create Dialog Authentication
- Task 19: Create Dialog Send Method
- Task 20: Create Dialog Balance Method
- Task 21: Create Dialog Status Method
- Task 16: SMSProvider ABC defined

### Instructions

#### 1. Create Provider File
   - In `backend/apps/integrations/sms_gateway/providers/dialog/`
   - Create file `provider.py`
   - Import DialogSMSClient from client.py
   - Import SMSProvider ABC from base module
   - Import required Django models

#### 2. Define DialogProvider Class
   - Create class `DialogProvider(SMSProvider)`
   - Define class attribute `provider_name = "dialog"`
   - Define class attribute `provider_code = "DIALOG"`
   - Initialize with configuration dictionary
   - Store provider config

#### 3. Implement Initialization
   - Define `__init__()` method
   - Accept `config` parameter (dict)
   - Extract API credentials from config:
     - `api_key`
     - `base_url` (optional, use default)
     - `sender_id` (optional default sender)
   - Initialize DialogSMSClient instance
   - Validate credentials on initialization
   - Store client instance as `self.client`

#### 4. Implement send_sms() Method
   - Override abstract method from SMSProvider
   - Accept parameters:
     - `phone_number` (str)
     - `message` (str)
     - `sender_id` (str, optional)
     - `tenant` (Tenant instance, optional)
   - Call `self.client.send_sms()`
   - Create SMSMessage model instance
   - Save to database with:
     - Provider: "dialog"
     - Message ID from Dialog
     - Status: from response
     - Tenant (if provided)
   - Return SMSMessage instance
   - Handle all exceptions

#### 5. Implement check_balance() Method
   - Override abstract method from SMSProvider
   - Call `self.client.check_balance()`
   - Return balance value
   - Handle errors gracefully
   - Log balance queries
   - Update provider metrics (if tracked)

#### 6. Implement check_status() Method
   - Override abstract method from SMSProvider
   - Accept `message_id` parameter
   - Call `self.client.check_status(message_id)`
   - Look up SMSMessage in database by message_id
   - Update SMSMessage status if changed
   - Save updated status to database
   - Return updated SMSMessage instance
   - Handle message not found scenario

#### 7. Implement Additional Helper Methods
   - Create `validate_config()` method
     - Validate required config keys present
     - Validate config values format
     - Return validation errors
   - Create `get_provider_info()` method
     - Return provider metadata
     - Include features supported
     - Include status values
   - Create `test_connection()` method
     - Test API connectivity
     - Validate credentials
     - Return connection status

#### 8. Implement Error Handling
   - Wrap all client calls in try-except blocks
   - Catch specific client exceptions
   - Translate to SMSProvider exceptions:
     - AuthenticationError
     - InsufficientCreditsError
     - RateLimitError
     - SMSProviderError (general)
   - Log all errors with context
   - Update message status to "failed" on errors

#### 9. Add Context Manager Support
   - Implement `__enter__()` method
   - Implement `__exit__()` method
   - Ensure client cleanup on context exit
   - Allow usage with `with` statement

#### 10. Integrate with Django Models
   - Import SMSMessage, SMSProvider models
   - Create or update SMSMessage records
   - Link messages to provider
   - Link messages to tenant
   - Update message status based on API responses
   - Store all metadata (message_id, timestamps, etc.)

### DialogProvider Architecture

```
┌────────────────────────────────────────────────┐
│         DialogProvider (Task 22)                │
│  Implements: SMSProvider ABC                    │
├────────────────────────────────────────────────┤
│  + send_sms(phone, message, sender, tenant)    │
│  + check_balance() → float                      │
│  + check_status(message_id) → SMSMessage       │
│  + validate_config() → bool                     │
│  + test_connection() → bool                     │
├────────────────────────────────────────────────┤
│  Internal:                                      │
│  - self.client: DialogSMSClient                 │
│  - self.config: Dict                            │
│  - self.provider_name: "dialog"                 │
└────────────────────────────────────────────────┘
                    │
                    │ uses
                    ▼
┌────────────────────────────────────────────────┐
│         DialogSMSClient (Task 17)               │
│  HTTP Client for Dialog API                     │
├────────────────────────────────────────────────┤
│  + send_sms() → Dict                            │
│  + check_balance() → Dict                       │
│  + check_status() → Dict                        │
└────────────────────────────────────────────────┘
                    │
                    │ interacts with
                    ▼
┌────────────────────────────────────────────────┐
│         Django Models (Task 16)                 │
├────────────────────────────────────────────────┤
│  • SMSMessage: Track sent messages              │
│  • SMSProvider: Store provider config           │
└────────────────────────────────────────────────┘
```

### Provider Method Flow

```
ERP App → DialogProvider.send_sms()
              │
              ├─→ Validate inputs
              │
              ├─→ DialogSMSClient.send_sms()
              │       │
              │       └─→ Dialog API
              │               │
              │               ▼
              │       Response: message_id
              │
              ├─→ Create SMSMessage record
              │     • message_id
              │     • status
              │     • provider: "dialog"
              │     • tenant (if any)
              │
              └─→ Return SMSMessage instance
```

### DialogProvider Purpose

| Component | Purpose |
|-----------|---------|
| ABC Implementation | Consistent interface for all providers |
| Client Wrapper | Simplified access to Dialog API |
| Database Integration | Persist all messages and statuses |
| Error Translation | Convert API errors to app exceptions |
| Config Management | Handle provider configuration |
| Testing | Validate setup and connectivity |

### Configuration Format

```python
# Configuration dictionary structure (conceptual)
dialog_config = {
    "api_key": "your-dialog-api-key-here",
    "base_url": "https://api.dialog.lk/sms/",  # optional
    "sender_id": "LCC",  # optional default sender
    "timeout": 30,  # optional
    "retry_count": 3  # optional
}

# Provider initialization
provider = DialogProvider(config=dialog_config)

# Usage
sms_message = provider.send_sms(
    phone_number="+94771234567",
    message="Your OTP is 123456",
    sender_id="LCC",
    tenant=current_tenant
)
```

### Error Handling Diagram

```
┌────────────────────────────────────────────────┐
│    DialogProvider Error Handling Flow           │
└────────────────────────────────────────────────┘
                    │
                    ▼
    ┌───────────────────────────┐
    │  Call client.send_sms()    │
    └───────────────────────────┘
                    │
                    ▼
        ┌───────────────────┐
        │  Success?         │
        └───────────────────┘
             │         │
        Yes  │         │  No
             │         │
             ▼         ▼
    ┌──────────┐  ┌──────────────────┐
    │ Create   │  │ Catch Exception   │
    │ SMS      │  │ • Auth Error      │
    │ Message  │  │ • Credits Error   │
    │ Record   │  │ • Rate Limit      │
    └──────────┘  │ • Network Error   │
                  └──────────────────┘
                          │
                          ▼
                  ┌──────────────────┐
                  │ Create Failed     │
                  │ SMS Message       │
                  │ status="failed"   │
                  └──────────────────┘
                          │
                          ▼
                  ┌──────────────────┐
                  │ Log Error         │
                  └──────────────────┘
                          │
                          ▼
                  ┌──────────────────┐
                  │ Re-raise as       │
                  │ SMSProviderError  │
                  └──────────────────┘
```

### Expected Outcome
- DialogProvider class fully implements SMSProvider ABC
- All required methods implemented (send_sms, check_balance, check_status)
- Client integration complete
- Database integration working
- Error handling comprehensive
- Configuration management robust
- Helper methods for validation and testing

### Verification Checklist
- [ ] File created: `provider.py` in dialog directory
- [ ] DialogProvider class inherits from SMSProvider
- [ ] `__init__()` accepts and stores config
- [ ] DialogSMSClient initialized correctly
- [ ] `send_sms()` method implemented
- [ ] SMSMessage created on successful send
- [ ] `check_balance()` method implemented
- [ ] `check_status()` method implemented
- [ ] Status updates saved to database
- [ ] `validate_config()` method implemented
- [ ] `test_connection()` method implemented
- [ ] Error handling for all methods
- [ ] Context manager support added
- [ ] All exceptions properly translated
- [ ] Logging added to all methods

---

## Integration Testing Considerations

### Testing the Complete Dialog Provider

Once all tasks are complete, the Dialog provider should be tested end-to-end:

1. **Configuration Testing**
   - Validate config with valid credentials
   - Validate config with invalid credentials
   - Test missing required fields
   - Test optional field defaults

2. **Authentication Testing**
   - Test successful authentication
   - Test invalid API key
   - Test expired credentials (if applicable)
   - Test connection failure scenarios

3. **Send SMS Testing**
   - Send to valid Sri Lankan number
   - Send to invalid number format
   - Send with various message lengths
   - Send with different sender IDs
   - Test with special characters in message
   - Test with Unicode characters

4. **Balance Testing**
   - Check balance with valid credentials
   - Test balance caching (if implemented)
   - Test low balance scenarios
   - Test balance warning threshold

5. **Status Testing**
   - Check status of queued message
   - Check status of delivered message
   - Check status of failed message
   - Check status with invalid message_id
   - Test status caching for delivered messages

6. **Error Handling Testing**
   - Test network timeout
   - Test API rate limiting
   - Test insufficient credits
   - Test invalid response format
   - Test server errors (500+)

7. **Database Integration Testing**
   - Verify SMSMessage records created
   - Verify status updates persist
   - Verify tenant association
   - Verify message_id storage
   - Query messages by status

8. **Provider Interface Testing**
   - Test through SMSProviderFactory
   - Test provider switching
   - Test fallback behavior
   - Test with multiple tenants

### Test Data Requirements

```
# Test phone numbers (use test numbers from Dialog)
valid_test_number = "+94771234567"
invalid_number = "1234567890"
international_number = "+1234567890"

# Test messages
short_message = "Test"
normal_message = "Your OTP is 123456"
long_message = "A" * 160
unicode_message = "සිංහල SMS පණිවිඩයක්"

# Test API key (use sandbox/test key)
test_api_key = "test_dialog_api_key_here"
invalid_api_key = "invalid_key"
```

---

## Documentation and Deployment

### Required Documentation

1. **API Integration Guide**
   - Document Dialog API endpoints used
   - Document authentication method
   - Document request/response formats
   - Include API limitations and quotas

2. **Configuration Guide**
   - Document all config parameters
   - Provide example configurations
   - Document environment variables
   - Security best practices for API keys

3. **Developer Guide**
   - How to use DialogProvider in code
   - Example usage patterns
   - Error handling guidelines
   - Testing recommendations

4. **Operations Guide**
   - How to monitor Dialog integration
   - How to handle failures
   - How to check balance
   - Alert configuration

### Deployment Checklist

- [ ] Dialog API account created
- [ ] API key obtained from Dialog
- [ ] API key stored securely in environment
- [ ] Django settings configured
- [ ] Database migrations applied
- [ ] Provider registered in factory
- [ ] Tests passing
- [ ] Documentation complete
- [ ] Monitoring configured
- [ ] Balance alerts configured
- [ ] Rate limiting configured
- [ ] Error notifications setup

---

## Summary

This document covered the complete implementation of the Dialog SMS provider integration:

- **Task 17**: Created DialogSMSClient with HTTP communication, retry logic, and error handling
- **Task 18**: Implemented Bearer token authentication for Dialog API
- **Task 19**: Created send_sms method to send SMS messages and receive message IDs
- **Task 20**: Created check_balance method to monitor SMS credits
- **Task 21**: Created check_status method to track message delivery
- **Task 22**: Created DialogProvider class implementing SMSProvider ABC with full database integration

The Dialog provider is now ready for registration in the SMSProviderFactory (Task 34) and integration with the fallback system (Task 37).

### Next Steps

Proceed to Document 02 to implement the Notify.lk provider following a similar pattern.

---

**Document Status:** Ready for Implementation  
**Last Updated:** 2026-01-31  
**Task Range:** 17-22  
**Implementation Priority:** High
