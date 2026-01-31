# Tasks 29-38: TextIt Provider, Factory Registration, and Fallback

> **Phase:** 09 - Integrations & Sri Lanka Localizations  
> **SubPhase:** 12 - SMS Gateway Integration  
> **Group:** B - Provider Implementations  
> **Document:** 03 of 03  
> **Tasks Covered:** 29, 30, 31, 32, 33, 34, 35, 36, 37, 38

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [02_Tasks-23-28_NotifyLk-Provider.md](02_Tasks-23-28_NotifyLk-Provider.md)
- **→ Next Group:** [Group-C_OTP-System](../Group-C_OTP-System/)

---

## Document Overview

This document covers the TextIt SMS provider implementation, registration of all providers in the factory, and creation of the provider fallback system. TextIt is the third SMS provider option, offering reliable SMS services with a simple API. After implementing TextIt, all three providers (Dialog, Notify.lk, TextIt) are registered in the SMSProviderFactory, and a fallback mechanism is created to automatically switch between providers on failure.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 29 | Create TextItClient | High | 60 min |
| 30 | Create TextIt Auth | Low | 20 min |
| 31 | Create TextIt Send | Medium | 40 min |
| 32 | Create TextIt Balance | Low | 30 min |
| 33 | Create TextItProvider | Medium | 45 min |
| 34 | Register Dialog Provider | Low | 15 min |
| 35 | Register NotifyLk Provider | Low | 15 min |
| 36 | Register TextIt Provider | Low | 15 min |
| 37 | Create Provider Fallback | Medium | 50 min |
| 38 | Verify All Providers | Low | 30 min |

---

## Architecture Diagrams

### Provider Factory Registration Flow

```
┌─────────────────────────────────────────────────────────────┐
│                   SMSProviderFactory                        │
│                                                             │
│  ┌───────────────────────────────────────────────────┐    │
│  │         Provider Registry (Dict)                  │    │
│  │                                                    │    │
│  │  "dialog"    → DialogProvider                     │    │
│  │  "notifylk"  → NotifyLkProvider                   │    │
│  │  "textit"    → TextItProvider                     │    │
│  └───────────────────────────────────────────────────┘    │
│                                                             │
│  Methods:                                                   │
│  - register_provider(name, provider_class)                 │
│  - get_provider(name, config) → SMSProvider                │
│  - get_providers() → List[str]                             │
└─────────────────────────────────────────────────────────────┘
                              │
                              ├─→ Task 34: Register Dialog
                              ├─→ Task 35: Register NotifyLk
                              └─→ Task 36: Register TextIt
```

### Provider Fallback Chain

```
┌──────────────────────────────────────────────────────────────┐
│               SMS Sending with Fallback                      │
└──────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │  Try Provider 1 │
                    │    (Dialog)     │
                    └─────────────────┘
                              │
                    ┌─────────┴─────────┐
                    │   Success?        │
                    └─────────┬─────────┘
                         Yes  │  No
                    ┌─────────┴─────────┐
                    │                   │
                    ▼                   ▼
            ┌──────────────┐   ┌─────────────────┐
            │ Return OK    │   │ Retry Attempt 1 │
            │ (Exit)       │   │  (up to 3)      │
            └──────────────┘   └─────────────────┘
                                        │
                                        │ All retries failed
                                        ▼
                              ┌─────────────────┐
                              │  Try Provider 2 │
                              │   (NotifyLk)    │
                              └─────────────────┘
                                        │
                              ┌─────────┴─────────┐
                              │   Success?        │
                              └─────────┬─────────┘
                                   Yes  │  No
                              ┌─────────┴─────────┐
                              │                   │
                              ▼                   ▼
                      ┌──────────────┐   ┌─────────────────┐
                      │ Return OK    │   │ Retry Attempt 2 │
                      │ (Exit)       │   │  (up to 3)      │
                      └──────────────┘   └─────────────────┘
                                                  │
                                                  │ All retries failed
                                                  ▼
                                        ┌─────────────────┐
                                        │  Try Provider 3 │
                                        │    (TextIt)     │
                                        └─────────────────┘
                                                  │
                                        ┌─────────┴─────────┐
                                        │   Success?        │
                                        └─────────┬─────────┘
                                             Yes  │  No
                                        ┌─────────┴─────────┐
                                        │                   │
                                        ▼                   ▼
                                ┌──────────────┐   ┌─────────────────┐
                                │ Return OK    │   │ Retry Attempt 3 │
                                │ (Exit)       │   │  (up to 3)      │
                                └──────────────┘   └─────────────────┘
                                                            │
                                                            │ All failed
                                                            ▼
                                                  ┌─────────────────┐
                                                  │  Raise Error    │
                                                  │  All Failed     │
                                                  └─────────────────┘
```

### TextIt Provider Structure

```
┌──────────────────────────────────────────────────────────┐
│                    TextItProvider                        │
│                  (implements SMSProvider)                │
├──────────────────────────────────────────────────────────┤
│  Attributes:                                             │
│  - client: TextItClient                                  │
│  - config: SMSConfig                                     │
│  - provider_name: str = "textit"                         │
│                                                          │
│  Methods:                                                │
│  - send_sms(to, message, sender_id) → SendResult        │
│  - check_balance() → BalanceResult                       │
│  - validate_phone(phone) → bool                          │
│  - get_status() → str                                    │
└──────────────────────────────────────────────────────────┘
                              │
                              │ Uses
                              ▼
┌──────────────────────────────────────────────────────────┐
│                     TextItClient                         │
├──────────────────────────────────────────────────────────┤
│  Attributes:                                             │
│  - base_url: str = "https://textit.lk/api/"            │
│  - api_key: str                                          │
│  - session: requests.Session                             │
│                                                          │
│  Methods:                                                │
│  - authenticate() → None                                 │
│  - send_sms(to, message, sender_id) → dict              │
│  - check_balance() → dict                                │
│  - _make_request(method, endpoint, data) → dict         │
└──────────────────────────────────────────────────────────┘
```

---

## Task 29: Create TextItClient

### Overview
Create the TextItClient class that handles HTTP communication with the TextIt SMS Gateway API. This client manages authentication via API key, sends SMS messages using the /sendsms endpoint, and checks account balance via the /balance endpoint. The base URL is https://textit.lk/api/.

### Dependencies
- Task 16: SMS Migrations (database models)
- Python requests library
- SMSConfig model

### Instructions

1. **Navigate to the sms module**
   - Go to `backend/apps/sms/clients/` directory
   - Create new file `textit_client.py`

2. **Import required dependencies**
   - Import requests for HTTP operations
   - Import typing for type hints (Dict, Optional)
   - Import logging for error tracking
   - Import SMSConfig from models

3. **Define TextItClient class**
   - Create class TextItClient
   - Define base_url as class constant: "https://textit.lk/api/"
   - Initialize with api_key parameter
   - Create requests.Session for connection pooling

4. **Configure session headers**
   - Set User-Agent header
   - Set Accept header to application/json
   - Set timeout defaults (30 seconds)

5. **Implement authenticate method**
   - Store api_key as instance variable
   - API key is sent as query parameter in requests
   - No separate authentication endpoint needed
   - Validate api_key is not empty

6. **Implement _make_request helper method**
   - Accept method (GET/POST), endpoint, data, params
   - Construct full URL from base_url + endpoint
   - Add api_key to query parameters
   - Send request with error handling
   - Parse JSON response
   - Handle HTTP errors (4xx, 5xx)
   - Return response data dictionary

7. **Add error handling**
   - Wrap requests in try-except blocks
   - Catch requests.RequestException
   - Catch JSONDecodeError for invalid responses
   - Log errors with details
   - Raise custom SMSProviderError with context

8. **Add connection pooling**
   - Use Session object for persistent connections
   - Configure retry strategy (3 retries)
   - Set backoff factor (0.3 seconds)
   - Handle connection errors gracefully

9. **Add response validation**
   - Check response status code
   - Validate JSON structure
   - Check for API error messages in response
   - Extract and handle error codes

### TextItClient Purpose

| Feature | Benefit |
|---------|---------|
| Session Management | Reuses connections for efficiency |
| Query Param Auth | Simple API key authentication |
| Error Handling | Graceful failure with logging |
| Response Validation | Ensures valid API responses |
| Base URL Constant | Easy configuration management |

### TextIt API Structure

```
Base URL: https://textit.lk/api/

Endpoints:
- POST /sendsms        → Send SMS message
- GET  /balance        → Check account balance

Authentication:
- Query parameter: ?api_key=YOUR_KEY

Request Format:
- Content-Type: application/x-www-form-urlencoded
- Method: POST (send), GET (balance)

Response Format:
- Content-Type: application/json
- Status codes: 200 (success), 4xx/5xx (error)
```

### Expected Outcome
- TextItClient class created
- HTTP session configured with pooling
- Authentication via api_key query parameter
- Request helper method with error handling
- Logging for debugging and monitoring

### Verification Checklist
- [ ] File `backend/apps/sms/clients/textit_client.py` exists
- [ ] TextItClient class defined
- [ ] base_url set to "https://textit.lk/api/"
- [ ] Session object created
- [ ] _make_request helper method implemented
- [ ] Error handling for HTTP errors
- [ ] Logging configured
- [ ] Type hints added

---

## Task 30: Create TextIt Auth

### Overview
Configure authentication for TextIt API using API key as a query parameter. TextIt uses simple authentication where the api_key is appended to every request as a query parameter. Store the key securely and add it to all API calls.

### Dependencies
- Task 29: Create TextItClient

### Instructions

1. **Understand TextIt authentication**
   - TextIt uses API key authentication
   - Key is sent as query parameter in all requests
   - Format: ?api_key=YOUR_API_KEY
   - No separate login or token endpoint

2. **Store API key in TextItClient**
   - Accept api_key in __init__ method
   - Store as instance variable self.api_key
   - Validate api_key is not None or empty string
   - Raise ValueError if invalid

3. **Implement authenticate method**
   - Method signature: authenticate() -> None
   - Check if api_key is set
   - Validate api_key format (alphanumeric)
   - Log successful authentication
   - Store authentication status flag

4. **Add api_key to all requests**
   - In _make_request helper method
   - Create params dictionary if not exists
   - Add 'api_key' to params
   - Merge with any existing parameters
   - Ensure api_key is always present

5. **Handle authentication errors**
   - Check for 401 Unauthorized responses
   - Check for "Invalid API Key" in response
   - Raise SMSAuthenticationError with message
   - Log authentication failures

6. **Add test authentication method**
   - Create test_authentication method
   - Make simple API call (e.g., balance check)
   - Return True if successful
   - Return False if auth fails
   - Use for connection testing

7. **Secure key storage**
   - Never log the full API key
   - Mask key in logs (show first 4 chars only)
   - Store in environment variable
   - Load from SMSConfig model

### Authentication Purpose

| Feature | Benefit |
|---------|---------|
| Query Parameter | Simple, stateless authentication |
| Persistent Key | No token refresh needed |
| Validation | Prevents invalid key usage |
| Error Detection | Clear auth failure messages |
| Security | Keys masked in logs |

### Authentication Flow

```
┌─────────────────────────────────────────────────────────┐
│                  Client Initialization                  │
│  TextItClient(api_key="abc123xyz...")                  │
└─────────────────┬───────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────┐
│              Validate API Key                           │
│  - Check not None                                       │
│  - Check not empty string                               │
│  - Store in instance variable                           │
└─────────────────┬───────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────┐
│           Every API Request                             │
│  _make_request adds: ?api_key=abc123xyz...             │
└─────────────────┬───────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────┐
│              TextIt API Server                          │
│  Validates key and processes request                    │
└─────────────────────────────────────────────────────────┘
```

### Expected Outcome
- API key stored securely
- authenticate method validates key
- All requests include api_key parameter
- Authentication errors handled gracefully
- Test method to verify credentials

### Verification Checklist
- [ ] api_key parameter in __init__
- [ ] Key validation implemented
- [ ] authenticate method created
- [ ] _make_request adds api_key to params
- [ ] Authentication errors caught
- [ ] test_authentication method added
- [ ] API key masked in logs

---

## Task 31: Create TextIt Send

### Overview
Implement the send_sms method in TextItClient to send SMS messages via the TextIt API. This method makes a POST request to the /sendsms endpoint with recipient phone number, message text, and sender ID, and returns the response containing status and message ID.

### Dependencies
- Task 29: Create TextItClient
- Task 30: Create TextIt Auth

### Instructions

1. **Navigate to TextItClient class**
   - Open `backend/apps/sms/clients/textit_client.py`
   - Add send_sms method to TextItClient

2. **Define send_sms method signature**
   - Method: send_sms(to: str, message: str, sender_id: str) -> Dict
   - to: recipient phone number (format: 94771234567)
   - message: SMS text content (max 160 chars for single)
   - sender_id: sender name/number
   - Returns: dictionary with response data

3. **Validate input parameters**
   - Check phone number format (starts with country code)
   - Validate message is not empty
   - Check message length (warn if > 160 chars)
   - Validate sender_id format
   - Raise ValueError for invalid inputs

4. **Prepare request data**
   - Create data dictionary
   - Add 'to' field with phone number
   - Add 'message' field with text content
   - Add 'from' field with sender_id
   - Format as application/x-www-form-urlencoded

5. **Make POST request to /sendsms**
   - Call self._make_request('POST', 'sendsms', data=data)
   - api_key automatically added by _make_request
   - Set Content-Type header
   - Handle timeout (30 seconds)

6. **Parse response**
   - Response format: {"status": "success", "message_id": "123456"}
   - Extract status field
   - Extract message_id if available
   - Check for error messages
   - Handle different response formats

7. **Handle send errors**
   - Check for "insufficient balance" error
   - Check for "invalid phone number" error
   - Check for "invalid sender ID" error
   - Raise specific exceptions (SMSSendError)
   - Log error details

8. **Return standardized response**
   - Create response dictionary
   - Include success boolean
   - Include message_id if successful
   - Include error message if failed
   - Include provider name ("textit")

9. **Add retry logic**
   - Implement exponential backoff
   - Retry on network errors (max 3 times)
   - Don't retry on auth errors
   - Don't retry on invalid data errors

### Send Method Purpose

| Feature | Benefit |
|---------|---------|
| Input Validation | Prevents API errors |
| Error Handling | Clear failure messages |
| Response Parsing | Standardized results |
| Retry Logic | Handles temporary failures |
| Logging | Debugging and monitoring |

### TextIt Send API

```
Endpoint: POST /sendsms
URL: https://textit.lk/api/sendsms?api_key=YOUR_KEY

Request Body (form-encoded):
{
    "to": "94771234567",
    "message": "Your OTP is 123456",
    "from": "LCCCLOUD"
}

Success Response (200):
{
    "status": "success",
    "message_id": "msg_abc123xyz",
    "balance": 1234.56
}

Error Response (4xx/5xx):
{
    "status": "error",
    "message": "Insufficient balance"
}
```

### Expected Outcome
- send_sms method implemented
- Input validation for all parameters
- POST request to /sendsms endpoint
- Response parsing and error handling
- Standardized return format
- Retry logic for transient failures

### Verification Checklist
- [ ] send_sms method added to TextItClient
- [ ] Phone number validation
- [ ] Message validation
- [ ] Request data formatted correctly
- [ ] POST request to /sendsms
- [ ] Response parsing implemented
- [ ] Error handling for common failures
- [ ] Retry logic added
- [ ] Logging configured

---

## Task 32: Create TextIt Balance

### Overview
Implement the check_balance method in TextItClient to retrieve account balance from the TextIt API. This method makes a GET request to the /balance endpoint and returns the current account balance and currency information.

### Dependencies
- Task 29: Create TextItClient
- Task 30: Create TextIt Auth

### Instructions

1. **Navigate to TextItClient class**
   - Open `backend/apps/sms/clients/textit_client.py`
   - Add check_balance method

2. **Define check_balance method signature**
   - Method: check_balance() -> Dict
   - No parameters required (uses stored api_key)
   - Returns: dictionary with balance information

3. **Make GET request to /balance**
   - Call self._make_request('GET', 'balance')
   - api_key automatically added as query parameter
   - No request body needed
   - Handle timeout (15 seconds)

4. **Parse response**
   - Response format: {"status": "success", "balance": 1234.56, "currency": "LKR"}
   - Extract balance field (float)
   - Extract currency field (string)
   - Extract status field
   - Handle missing fields gracefully

5. **Handle balance check errors**
   - Check for authentication errors
   - Check for API unavailable errors
   - Log errors with context
   - Raise SMSProviderError if failed

6. **Return standardized response**
   - Create response dictionary
   - Include success boolean
   - Include balance (as float)
   - Include currency (string)
   - Include timestamp
   - Include provider name ("textit")

7. **Add caching (optional)**
   - Cache balance for 5 minutes
   - Avoid repeated API calls
   - Store in memory (simple dict)
   - Clear cache on errors

8. **Add balance validation**
   - Check if balance is numeric
   - Check if balance is non-negative
   - Warn if balance is low (< 100 LKR)
   - Log balance checks for auditing

### Balance Method Purpose

| Feature | Benefit |
|---------|---------|
| Simple GET Request | Easy to implement and use |
| No Parameters | Uses stored credentials |
| Error Handling | Graceful failure handling |
| Caching | Reduces API calls |
| Low Balance Warning | Prevents send failures |

### TextIt Balance API

```
Endpoint: GET /balance
URL: https://textit.lk/api/balance?api_key=YOUR_KEY

Request: (No body, api_key in query string)

Success Response (200):
{
    "status": "success",
    "balance": 1234.56,
    "currency": "LKR"
}

Error Response (401):
{
    "status": "error",
    "message": "Invalid API key"
}
```

### Expected Outcome
- check_balance method implemented
- GET request to /balance endpoint
- Response parsing with balance and currency
- Error handling for API failures
- Optional caching for performance
- Low balance warnings

### Verification Checklist
- [ ] check_balance method added
- [ ] GET request to /balance
- [ ] Response parsing for balance and currency
- [ ] Error handling implemented
- [ ] Standardized return format
- [ ] Logging configured
- [ ] Optional caching added

---

## Task 33: Create TextItProvider

### Overview
Create the TextItProvider class that implements the SMSProvider abstract base class. This provider wraps the TextItClient and provides a standardized interface for sending SMS messages, checking balance, validating phone numbers, and reporting provider status. It follows the same pattern as DialogProvider and NotifyLkProvider.

### Dependencies
- Task 29: Create TextItClient
- Task 30: Create TextIt Auth
- Task 31: Create TextIt Send
- Task 32: Create TextIt Balance
- Task 16: SMSProvider ABC

### Instructions

1. **Navigate to providers directory**
   - Go to `backend/apps/sms/providers/` directory
   - Create new file `textit_provider.py`

2. **Import required dependencies**
   - Import SMSProvider ABC from base
   - Import TextItClient from clients
   - Import SMSConfig from models
   - Import SendResult, BalanceResult dataclasses
   - Import logging, typing modules

3. **Define TextItProvider class**
   - Inherit from SMSProvider ABC
   - Implement all abstract methods
   - Add provider_name = "textit"

4. **Implement __init__ method**
   - Accept config: SMSConfig parameter
   - Extract api_key from config
   - Create TextItClient instance
   - Authenticate client
   - Store config reference
   - Log initialization

5. **Implement send_sms method**
   - Method: send_sms(to: str, message: str, sender_id: str) -> SendResult
   - Validate phone number (starts with 94)
   - Call client.send_sms()
   - Parse response into SendResult
   - Handle errors and return SendResult with error
   - Log send attempts

6. **Implement check_balance method**
   - Method: check_balance() -> BalanceResult
   - Call client.check_balance()
   - Parse response into BalanceResult
   - Handle errors gracefully
   - Log balance checks

7. **Implement validate_phone method**
   - Method: validate_phone(phone: str) -> bool
   - Check format: starts with country code (94)
   - Check length (11-12 digits for Sri Lanka)
   - Check numeric only
   - Return True if valid, False otherwise

8. **Implement get_status method**
   - Method: get_status() -> str
   - Return "active" if provider is working
   - Return "inactive" if authentication failed
   - Return "error" if other issues
   - Check by making test balance call

9. **Add error mapping**
   - Map TextIt error codes to standard errors
   - Convert API errors to SendResult errors
   - Standardize error messages
   - Log original error details

10. **Add provider metadata**
    - Add docstring with provider description
    - Add supported features list
    - Add rate limit information
    - Add provider contact/support info

### TextItProvider Purpose

| Feature | Benefit |
|---------|---------|
| ABC Implementation | Standardized interface |
| Error Handling | Consistent error reporting |
| Phone Validation | Prevents invalid sends |
| Status Checking | Health monitoring |
| Client Wrapping | Separates concerns |

### Provider Methods Mapping

```
SMSProvider ABC          TextItProvider Implementation
─────────────────────────────────────────────────────────
send_sms()           →   client.send_sms()
                         → Parse to SendResult

check_balance()      →   client.check_balance()
                         → Parse to BalanceResult

validate_phone()     →   Regex validation
                         → Return bool

get_status()         →   Test balance call
                         → Return "active"/"inactive"/"error"
```

### Expected Outcome
- TextItProvider class created
- All SMSProvider methods implemented
- TextItClient wrapped properly
- Phone number validation
- Error handling and logging
- Provider status checking

### Verification Checklist
- [ ] File `backend/apps/sms/providers/textit_provider.py` exists
- [ ] TextItProvider inherits from SMSProvider
- [ ] All abstract methods implemented
- [ ] TextItClient initialized in __init__
- [ ] send_sms returns SendResult
- [ ] check_balance returns BalanceResult
- [ ] validate_phone method added
- [ ] get_status method added
- [ ] Error handling implemented
- [ ] Logging configured

---

## Task 34: Register Dialog Provider

### Overview
Register the DialogProvider with the SMSProviderFactory. This makes the Dialog provider available for use throughout the system. The factory pattern allows dynamic provider selection and management. Register with the key "dialog".

### Dependencies
- Task 22: Create DialogProvider
- Task 16: SMSProviderFactory

### Instructions

1. **Navigate to factory file**
   - Open `backend/apps/sms/factory.py`
   - Locate SMSProviderFactory class

2. **Import DialogProvider**
   - Add import statement at top of file
   - Import from providers.dialog_provider
   - Import DialogProvider class

3. **Register in factory initialization**
   - In SMSProviderFactory.__init__ or class-level setup
   - Call register_provider("dialog", DialogProvider)
   - Provider key must match config setting
   - Use lowercase for consistency

4. **Add provider metadata**
   - Add DIALOG_METADATA dictionary
   - Include display_name: "Dialog SMS"
   - Include description
   - Include supported_features list
   - Include requires_config list

5. **Add validation**
   - Check DialogProvider is not None
   - Validate provider implements SMSProvider
   - Log successful registration
   - Handle import errors gracefully

6. **Update factory registry**
   - Add to _providers dictionary
   - Key: "dialog"
   - Value: DialogProvider class (not instance)
   - Store metadata in _metadata dictionary

7. **Add to supported providers list**
   - Update get_providers() method
   - Return "dialog" in provider list
   - Sort providers alphabetically

### Registration Purpose

| Feature | Benefit |
|---------|---------|
| Centralized Registry | Single source of truth |
| Dynamic Loading | Providers loaded on demand |
| Configuration Driven | Easy provider switching |
| Metadata Storage | Provider information available |

### Factory Structure After Registration

```
SMSProviderFactory
├── _providers: Dict[str, Type[SMSProvider]]
│   ├── "dialog" → DialogProvider
│   ├── "notifylk" → (registered in Task 35)
│   └── "textit" → (registered in Task 36)
│
├── _metadata: Dict[str, Dict]
│   ├── "dialog" → {display_name, description, features}
│   ├── "notifylk" → {...}
│   └── "textit" → {...}
│
└── Methods:
    ├── register_provider(name, class)
    ├── get_provider(name, config) → instance
    └── get_providers() → ["dialog", "notifylk", "textit"]
```

### Expected Outcome
- DialogProvider imported
- Registered with key "dialog"
- Metadata added to factory
- Available via get_provider("dialog")
- Listed in get_providers()

### Verification Checklist
- [ ] DialogProvider imported in factory.py
- [ ] register_provider("dialog", DialogProvider) called
- [ ] Provider metadata added
- [ ] Validation implemented
- [ ] Factory returns DialogProvider for "dialog" key
- [ ] "dialog" in get_providers() list
- [ ] Logging configured

---

## Task 35: Register NotifyLk Provider

### Overview
Register the NotifyLkProvider with the SMSProviderFactory. This makes the Notify.lk provider available for use throughout the system. Register with the key "notifylk" (one word, lowercase).

### Dependencies
- Task 28: Create NotifyLkProvider
- Task 34: Register Dialog Provider

### Instructions

1. **Navigate to factory file**
   - Open `backend/apps/sms/factory.py`
   - Locate SMSProviderFactory class

2. **Import NotifyLkProvider**
   - Add import statement at top of file
   - Import from providers.notifylk_provider
   - Import NotifyLkProvider class

3. **Register in factory initialization**
   - In SMSProviderFactory registration section
   - Call register_provider("notifylk", NotifyLkProvider)
   - Use lowercase, no spaces/hyphens
   - Maintain alphabetical order

4. **Add provider metadata**
   - Add NOTIFYLK_METADATA dictionary
   - Include display_name: "Notify.lk"
   - Include description: "SMS aggregator platform"
   - Include supported_features: ["send", "balance", "status"]
   - Include requires_config: ["user_id", "api_key"]

5. **Add validation**
   - Check NotifyLkProvider is not None
   - Validate provider implements SMSProvider
   - Log successful registration
   - Handle import errors gracefully

6. **Update factory registry**
   - Add to _providers dictionary
   - Key: "notifylk"
   - Value: NotifyLkProvider class
   - Store metadata in _metadata dictionary

7. **Update supported providers**
   - "notifylk" added to get_providers() return
   - Maintain alphabetical sorting
   - Update documentation strings

### Registration Purpose

| Feature | Benefit |
|---------|---------|
| Second Provider | Fallback option available |
| Aggregator Support | Alternative to carrier direct |
| Consistent Pattern | Same registration as Dialog |
| Metadata Available | Provider info accessible |

### Expected Outcome
- NotifyLkProvider imported
- Registered with key "notifylk"
- Metadata added
- Available via get_provider("notifylk")
- Listed in get_providers()

### Verification Checklist
- [ ] NotifyLkProvider imported in factory.py
- [ ] register_provider("notifylk", NotifyLkProvider) called
- [ ] Provider metadata added
- [ ] Validation implemented
- [ ] Factory returns NotifyLkProvider for "notifylk" key
- [ ] "notifylk" in get_providers() list
- [ ] Alphabetical order maintained

---

## Task 36: Register TextIt Provider

### Overview
Register the TextItProvider with the SMSProviderFactory. This makes the TextIt provider available for use throughout the system, completing the registration of all three SMS providers. Register with the key "textit".

### Dependencies
- Task 33: Create TextItProvider
- Task 35: Register NotifyLk Provider

### Instructions

1. **Navigate to factory file**
   - Open `backend/apps/sms/factory.py`
   - Locate SMSProviderFactory class

2. **Import TextItProvider**
   - Add import statement at top of file
   - Import from providers.textit_provider
   - Import TextItProvider class

3. **Register in factory initialization**
   - In SMSProviderFactory registration section
   - Call register_provider("textit", TextItProvider)
   - Use lowercase for consistency
   - Complete the provider registration list

4. **Add provider metadata**
   - Add TEXTIT_METADATA dictionary
   - Include display_name: "TextIt"
   - Include description: "Alternative SMS provider"
   - Include supported_features: ["send", "balance"]
   - Include requires_config: ["api_key"]

5. **Add validation**
   - Check TextItProvider is not None
   - Validate provider implements SMSProvider
   - Log successful registration
   - Handle import errors gracefully

6. **Update factory registry**
   - Add to _providers dictionary
   - Key: "textit"
   - Value: TextItProvider class
   - Store metadata in _metadata dictionary

7. **Finalize provider list**
   - All three providers now registered
   - get_providers() returns: ["dialog", "notifylk", "textit"]
   - Update documentation
   - Add comments for clarity

8. **Add factory verification**
   - Create verify_registrations() method
   - Check all providers are registered
   - Validate each provider implements ABC
   - Log registration summary

### Registration Completion

```
After Task 36, factory has all providers:

_providers = {
    "dialog": DialogProvider,
    "notifylk": NotifyLkProvider,
    "textit": TextItProvider
}

_metadata = {
    "dialog": {
        "display_name": "Dialog SMS",
        "description": "Sri Lanka's largest carrier",
        "features": ["send", "balance", "status"],
        "config": ["partner_id", "password"]
    },
    "notifylk": {
        "display_name": "Notify.lk",
        "description": "SMS aggregator platform",
        "features": ["send", "balance", "status"],
        "config": ["user_id", "api_key"]
    },
    "textit": {
        "display_name": "TextIt",
        "description": "Alternative SMS provider",
        "features": ["send", "balance"],
        "config": ["api_key"]
    }
}
```

### Expected Outcome
- TextItProvider imported
- Registered with key "textit"
- Metadata added
- All three providers available
- Factory verification method added

### Verification Checklist
- [ ] TextItProvider imported in factory.py
- [ ] register_provider("textit", TextItProvider) called
- [ ] Provider metadata added
- [ ] Validation implemented
- [ ] Factory returns TextItProvider for "textit" key
- [ ] get_providers() returns all three providers
- [ ] verify_registrations() method added

---

## Task 37: Create Provider Fallback

### Overview
Implement the provider fallback system that automatically tries alternative providers when the primary provider fails. The fallback order is: Dialog → NotifyLk → TextIt. Each provider is attempted up to 3 times before moving to the next. This ensures high SMS delivery reliability even if one provider experiences issues.

### Dependencies
- Task 34: Register Dialog Provider
- Task 35: Register NotifyLk Provider
- Task 36: Register TextIt Provider

### Instructions

1. **Navigate to sms service**
   - Open `backend/apps/sms/services.py`
   - Locate SMSService class or create it

2. **Define fallback configuration**
   - Create FALLBACK_ORDER constant: ["dialog", "notifylk", "textit"]
   - Create MAX_RETRIES constant: 3
   - Create RETRY_DELAY constant: 1.0 (seconds)
   - Make configurable via settings

3. **Create send_sms_with_fallback method**
   - Method signature: send_sms_with_fallback(to, message, sender_id) -> SendResult
   - Accept phone number, message, sender ID
   - Return SendResult with success status
   - Track which provider succeeded

4. **Implement provider loop**
   - Iterate through FALLBACK_ORDER providers
   - For each provider name in order
   - Get provider instance from factory
   - Get config for provider from database
   - Create provider instance

5. **Implement retry logic per provider**
   - For each provider, attempt up to MAX_RETRIES
   - Use while loop with retry counter
   - Increment retry counter on failure
   - Break on success
   - Sleep RETRY_DELAY between retries

6. **Handle provider success**
   - If send_sms returns success=True
   - Log successful send with provider name
   - Create SMSLog entry with provider name
   - Return SendResult immediately
   - Exit fallback loop

7. **Handle provider failure**
   - If send_sms returns success=False
   - Log failure with error message
   - Increment retry counter
   - If retries exhausted, move to next provider
   - Log provider switch

8. **Handle all providers failed**
   - If all providers in fallback chain fail
   - Log critical error
   - Create SendResult with error
   - Include all error messages
   - Raise SMSProviderError or return failed result

9. **Add exponential backoff**
   - First retry: 1 second delay
   - Second retry: 2 seconds delay
   - Third retry: 4 seconds delay
   - Calculate: RETRY_DELAY * (2 ** attempt)

10. **Add fallback analytics**
    - Track provider success rates
    - Store in SMSLog with provider name
    - Count fallback occurrences
    - Report on provider health

11. **Add circuit breaker (optional)**
    - Disable provider if failure rate > 80%
    - Temporarily skip failing providers
    - Re-enable after cooldown period
    - Prevents wasting time on dead providers

### Fallback Logic Purpose

| Feature | Benefit |
|---------|---------|
| Multiple Providers | High availability |
| Retry Logic | Handles transient failures |
| Ordered Fallback | Prefers primary provider |
| Exponential Backoff | Reduces server load |
| Logging | Debugging and analytics |

### Fallback Algorithm

```python
# Pseudocode for fallback logic

def send_sms_with_fallback(to, message, sender_id):
    for provider_name in FALLBACK_ORDER:
        provider = get_provider(provider_name)
        
        for attempt in range(MAX_RETRIES):
            result = provider.send_sms(to, message, sender_id)
            
            if result.success:
                log_success(provider_name, attempt + 1)
                return result
            
            if attempt < MAX_RETRIES - 1:
                delay = RETRY_DELAY * (2 ** attempt)
                sleep(delay)
            
            log_retry(provider_name, attempt + 1)
        
        log_provider_failed(provider_name)
    
    log_all_failed()
    raise SMSProviderError("All providers failed")
```

### Configuration Example

```python
# settings.py or config

SMS_FALLBACK_CONFIG = {
    'enabled': True,
    'provider_order': ['dialog', 'notifylk', 'textit'],
    'max_retries_per_provider': 3,
    'retry_delay_seconds': 1.0,
    'exponential_backoff': True,
    'circuit_breaker_enabled': False,
    'circuit_breaker_threshold': 0.8,  # 80% failure rate
    'circuit_breaker_cooldown': 300,   # 5 minutes
}
```

### Expected Outcome
- send_sms_with_fallback method created
- Provider loop with fallback order
- Retry logic (up to 3 attempts per provider)
- Exponential backoff delays
- Comprehensive logging
- All providers tried before failure
- Analytics tracking

### Verification Checklist
- [ ] send_sms_with_fallback method added
- [ ] FALLBACK_ORDER constant defined
- [ ] MAX_RETRIES constant defined
- [ ] Provider loop implemented
- [ ] Retry logic with counter
- [ ] Exponential backoff added
- [ ] Success handling with immediate return
- [ ] Failure handling with next provider
- [ ] All failed handling
- [ ] Logging for all events
- [ ] SMSLog entries created

---

## Task 38: Verify All Providers

### Overview
Create comprehensive verification and testing for all three SMS providers. This includes unit tests, integration tests, and manual verification steps. Ensure all providers work correctly, factory registration is complete, and fallback logic functions properly.

### Dependencies
- Task 33: Create TextItProvider
- Task 34: Register Dialog Provider
- Task 35: Register NotifyLk Provider
- Task 36: Register TextIt Provider
- Task 37: Create Provider Fallback

### Instructions

1. **Create provider tests file**
   - Navigate to `backend/apps/sms/tests/`
   - Create `test_providers.py`
   - Import all provider classes
   - Import factory and base classes

2. **Create test fixtures**
   - Create mock SMSConfig for each provider
   - Create mock response objects
   - Create test phone numbers
   - Create test messages

3. **Test factory registration**
   - Test get_providers() returns all three
   - Test get_provider("dialog") returns DialogProvider
   - Test get_provider("notifylk") returns NotifyLkProvider
   - Test get_provider("textit") returns TextItProvider
   - Test invalid provider name raises error

4. **Test DialogProvider**
   - Test initialization with valid config
   - Test send_sms with mock client
   - Test check_balance with mock response
   - Test validate_phone with various formats
   - Test get_status returns correct state
   - Test error handling

5. **Test NotifyLkProvider**
   - Test initialization with valid config
   - Test send_sms with mock client
   - Test check_balance with mock response
   - Test get_delivery_status with mock
   - Test validate_phone method
   - Test get_status method
   - Test error handling

6. **Test TextItProvider**
   - Test initialization with valid config
   - Test send_sms with mock client
   - Test check_balance with mock response
   - Test validate_phone method
   - Test get_status method
   - Test error handling

7. **Test provider fallback**
   - Mock all three providers
   - Test fallback when primary fails
   - Test retry logic (3 attempts per provider)
   - Test success on second provider
   - Test all providers fail scenario
   - Test exponential backoff timing

8. **Create integration tests**
   - Test with real API credentials (if available)
   - Test sending actual SMS (to test number)
   - Test checking actual balance
   - Mark as integration tests (skip in CI)

9. **Create manual verification checklist**
   - Test Dialog provider manually
   - Test NotifyLk provider manually
   - Test TextIt provider manually
   - Test fallback by disabling primary
   - Verify logs are created
   - Verify SMSLog entries

10. **Create verification script**
    - Create `verify_sms_providers.py`
    - Load all providers from factory
    - Test each provider's status
    - Test balance checks
    - Print verification report
    - Exit with status code

11. **Document test coverage**
    - Run coverage report
    - Ensure > 80% coverage
    - Document untested scenarios
    - Add TODO for missing tests

### Verification Purpose

| Feature | Benefit |
|---------|---------|
| Unit Tests | Fast, isolated testing |
| Integration Tests | Real-world validation |
| Mock Tests | Test without API calls |
| Manual Tests | Human verification |
| Coverage Report | Identify gaps |

### Test Structure

```
backend/apps/sms/tests/
├── __init__.py
├── test_providers.py          # Provider unit tests
│   ├── TestDialogProvider
│   ├── TestNotifyLkProvider
│   └── TestTextItProvider
│
├── test_factory.py            # Factory tests
│   └── TestSMSProviderFactory
│
├── test_fallback.py           # Fallback logic tests
│   └── TestProviderFallback
│
└── test_integration.py        # Integration tests
    ├── TestDialogIntegration
    ├── TestNotifyLkIntegration
    └── TestTextItIntegration
```

### Verification Script Example

```python
# verify_sms_providers.py

from apps.sms.factory import SMSProviderFactory
from apps.sms.models import SMSConfig

def verify_providers():
    factory = SMSProviderFactory()
    providers = factory.get_providers()
    
    print(f"Registered providers: {providers}")
    
    for provider_name in providers:
        config = SMSConfig.objects.get(provider=provider_name)
        provider = factory.get_provider(provider_name, config)
        
        status = provider.get_status()
        print(f"{provider_name}: {status}")
        
        if status == "active":
            balance = provider.check_balance()
            print(f"  Balance: {balance.balance} {balance.currency}")
    
    print("\nVerification complete!")

if __name__ == "__main__":
    verify_providers()
```

### Manual Verification Checklist

```
□ Dialog Provider
  □ Configuration loaded from database
  □ Authentication successful
  □ Send SMS to test number
  □ Balance check returns value
  □ Status check returns "active"

□ NotifyLk Provider
  □ Configuration loaded from database
  □ Authentication successful
  □ Send SMS to test number
  □ Balance check returns value
  □ Status check returns "active"
  □ Delivery status retrieved

□ TextIt Provider
  □ Configuration loaded from database
  □ Authentication successful
  □ Send SMS to test number
  □ Balance check returns value
  □ Status check returns "active"

□ Factory
  □ All three providers registered
  □ get_providers() returns ["dialog", "notifylk", "textit"]
  □ get_provider(name) returns correct instance

□ Fallback
  □ Primary provider attempted first
  □ Fallback to second on failure
  □ Retry logic works (3 attempts)
  □ All providers tried before error
  □ Logs show provider switches
```

### Expected Outcome
- Comprehensive test suite created
- All providers tested individually
- Factory registration verified
- Fallback logic tested
- Integration tests added
- Manual verification performed
- Verification script created
- Coverage report generated

### Verification Checklist
- [ ] test_providers.py created
- [ ] Factory tests added
- [ ] Dialog provider tests
- [ ] NotifyLk provider tests
- [ ] TextIt provider tests
- [ ] Fallback tests added
- [ ] Integration tests created
- [ ] Manual checklist completed
- [ ] Verification script works
- [ ] Coverage > 80%
- [ ] All tests passing

---

## Summary

This document covered the implementation of the TextIt SMS provider, registration of all three providers in the factory, and creation of the provider fallback system. The key accomplishments are:

### Completed Tasks

1. **TextIt Provider Implementation**
   - TextItClient with HTTP communication
   - Authentication via API key query parameter
   - Send SMS via POST /sendsms
   - Balance check via GET /balance
   - TextItProvider implementing SMSProvider ABC

2. **Factory Registration**
   - Dialog provider registered with key "dialog"
   - NotifyLk provider registered with key "notifylk"
   - TextIt provider registered with key "textit"
   - All providers available via factory

3. **Fallback System**
   - Provider fallback chain: Dialog → NotifyLk → TextIt
   - Retry logic: 3 attempts per provider
   - Exponential backoff between retries
   - Comprehensive logging and analytics

4. **Verification**
   - Unit tests for all providers
   - Integration tests for real API calls
   - Manual verification checklist
   - Verification script for quick testing

### Key Features

- **Three SMS Providers:** Dialog (carrier), NotifyLk (aggregator), TextIt (alternative)
- **Factory Pattern:** Centralized provider management and registration
- **Automatic Fallback:** High availability with provider switching
- **Retry Logic:** Handles transient failures with exponential backoff
- **Comprehensive Testing:** Unit, integration, and manual verification

### Next Steps

With all SMS providers implemented, registered, and verified, the next group focuses on the OTP (One-Time Password) system. This includes OTP generation, storage, verification, rate limiting, and cleanup of expired OTPs.

---

## Document Change Log

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-01-31 | System | Initial document creation |

---

**End of Document 03 - TextIt Provider, Factory Registration, and Fallback**
