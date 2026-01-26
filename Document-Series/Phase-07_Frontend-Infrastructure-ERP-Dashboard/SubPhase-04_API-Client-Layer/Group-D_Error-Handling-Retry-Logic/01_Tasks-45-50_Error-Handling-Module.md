# Tasks 45-50: Error Handling Module

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 04 - API Client Layer  
> **Group:** D - Error Handling & Retry Logic  
> **Document:** 01 of 02  
> **Tasks Covered:** 45, 46, 47, 48, 49, 50

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-51-58_Retry-Cancellation-Offline.md](02_Tasks-51-58_Retry-Cancellation-Offline.md)

---

## Document Overview

This document establishes the error handling infrastructure for the API client layer. It covers the creation of the error handling module, the custom ApiException class, parsing utilities for API errors, user-friendly message generation, and specialized detection functions for network and timeout errors. These components provide a robust foundation for graceful error handling throughout the application.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 45 | Create Error Handling Module | Low | 15 min |
| 46 | Create ApiException Class | Medium | 30 min |
| 47 | Create parseApiError Function | Medium | 35 min |
| 48 | Create getErrorMessage Function | Low | 20 min |
| 49 | Create isNetworkError Function | Low | 15 min |
| 50 | Create isTimeoutError Function | Low | 15 min |

---

## Task 45: Create Error Handling Module

### Overview
Create the `lib/apiError.ts` module that serves as the central location for all error handling utilities. This module will export the ApiException class, error parsing functions, and error detection utilities used throughout the API client layer.

### Dependencies
- Task 11: Axios instance configuration must be complete
- TypeScript configuration established
- Frontend lib directory exists

### Instructions

1. **Create apiError.ts file**
   - Navigate to `frontend/lib/` directory
   - Create new file named `apiError.ts`
   - This will house all error handling functionality

2. **Add module header and documentation**
   - Add comprehensive module-level JSDoc comment
   - Describe the purpose: centralized error handling for API requests
   - Document exported utilities (ApiException, parsing, detection)
   - Note usage context: consumed by API client and services

3. **Import required dependencies**
   - Import AxiosError type from 'axios'
   - Import any necessary TypeScript utility types
   - Ensure type safety for error handling functions

4. **Define error-related TypeScript interfaces**
   - Define ApiErrorResponse interface for backend error structure
   - Define ApiErrorDetails interface for field-level validation errors
   - Define RetryConfig interface (used later)
   - Ensure interfaces match backend API error format

5. **Set up module structure**
   - Organize into logical sections with comments:
     * Type definitions
     * ApiException class
     * Error parsing functions
     * Error detection functions
     * User message extraction
   - Use clear section dividers for maintainability

6. **Add module exports**
   - Plan exports for ApiException class
   - Plan exports for parseApiError function
   - Plan exports for getErrorMessage function
   - Plan exports for isNetworkError function
   - Plan exports for isTimeoutError function

### Module Structure
```
lib/apiError.ts
├── Type Definitions
│   ├── ApiErrorResponse
│   ├── ApiErrorDetails
│   └── RetryConfig
├── ApiException Class
├── Error Parsing
│   └── parseApiError
├── Message Extraction
│   └── getErrorMessage
└── Error Detection
    ├── isNetworkError
    └── isTimeoutError
```

### Type Definitions Overview

| Interface | Purpose | Key Fields |
|-----------|---------|------------|
| ApiErrorResponse | Backend error structure | message, code, errors |
| ApiErrorDetails | Field validation errors | field → message mapping |
| RetryConfig | Retry parameters | maxRetries, delays, backoff |

### Expected Outcome
- apiError.ts module created with proper structure
- Type definitions ready for error handling
- Clear organization for future implementations
- Foundation for comprehensive error management

### Verification Checklist
- [ ] `frontend/lib/apiError.ts` file exists
- [ ] Module JSDoc header added
- [ ] Axios dependencies imported
- [ ] ApiErrorResponse interface defined
- [ ] ApiErrorDetails interface defined
- [ ] Module structure organized with sections
- [ ] Export statements prepared

---

## Task 46: Create ApiException Class

### Overview
Create a custom ApiException class that extends the standard Error class. This class encapsulates all information about API errors in a structured format, including HTTP status codes, error codes, user messages, field-level validation errors, and error type flags.

### Dependencies
- Task 45: Error handling module created
- ApiErrorResponse and ApiErrorDetails types defined

### Instructions

1. **Define ApiException class**
   - Create class that extends Error
   - Name it ApiException to distinguish from generic errors
   - This will be the standard error type for all API failures

2. **Add class properties**
   - Add `message: string` property (inherited from Error)
   - Add `code: string` property for application error codes
   - Add `status: number` property for HTTP status codes
   - Add `details: ApiErrorDetails | null` property for field errors
   - Add `isNetworkError: boolean` flag
   - Add `isTimeoutError: boolean` flag
   - Add `originalError?: unknown` property to preserve original error

3. **Create constructor**
   - Accept message as first parameter (required)
   - Accept options object as second parameter (optional)
   - Options should include: code, status, details, isNetworkError, isTimeoutError, originalError
   - Call super(message) to initialize Error base class
   - Set Error.name to 'ApiException'
   - Assign all optional properties from options

4. **Set proper prototype chain**
   - Use Object.setPrototypeOf to fix prototype chain
   - This ensures instanceof checks work correctly
   - Required for proper TypeScript/JavaScript inheritance

5. **Add static factory methods**
   - Create static method `fromAxiosError()` for Axios error conversion
   - Create static method `networkError()` for network failures
   - Create static method `timeoutError()` for timeout failures
   - Create static method `serverError()` for 5xx errors
   - These provide convenient creation patterns

6. **Implement toJSON method**
   - Allow serialization of ApiException for logging
   - Include all relevant properties
   - Exclude originalError to prevent circular references
   - Return clean object for JSON.stringify

7. **Add JSDoc documentation**
   - Document class purpose and usage
   - Document each property with @property tags
   - Document constructor parameters
   - Document static factory methods
   - Include usage examples

### ApiException Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| message | string | (required) | User-friendly error message |
| code | string | 'UNKNOWN' | Application error code |
| status | number | 0 | HTTP status code |
| details | ApiErrorDetails \| null | null | Field-level validation errors |
| isNetworkError | boolean | false | Network connectivity failure |
| isTimeoutError | boolean | false | Request timeout failure |
| originalError | unknown | undefined | Original error object |

### Constructor Options

| Option | Type | Description |
|--------|------|-------------|
| code | string | Error code from backend |
| status | number | HTTP status code |
| details | object | Field validation errors |
| isNetworkError | boolean | Flag for network errors |
| isTimeoutError | boolean | Flag for timeout errors |
| originalError | unknown | Preserve original error |

### Static Factory Methods

| Method | Purpose | Returns |
|--------|---------|---------|
| fromAxiosError() | Convert AxiosError to ApiException | ApiException |
| networkError() | Create network error instance | ApiException |
| timeoutError() | Create timeout error instance | ApiException |
| serverError() | Create 5xx error instance | ApiException |

### Usage Patterns

**Creating from Axios error:**
```
ParseApiError will use fromAxiosError factory
Returns properly typed ApiException
```

**Creating specific error types:**
```
Use factory methods for common scenarios
Ensures consistent error structure
```

**Serializing for logging:**
```
JSON.stringify(apiException)
Uses toJSON() for clean output
```

### Expected Outcome
- ApiException class fully implemented
- Proper Error inheritance with prototype chain
- Comprehensive property set for all error scenarios
- Static factory methods for convenience
- Ready for use in parseApiError function

### Verification Checklist
- [ ] ApiException class extends Error
- [ ] All properties defined with correct types
- [ ] Constructor accepts message and options
- [ ] super(message) called in constructor
- [ ] Error.name set to 'ApiException'
- [ ] Object.setPrototypeOf fixes prototype chain
- [ ] Static fromAxiosError method created
- [ ] Static factory methods for common errors
- [ ] toJSON method implemented
- [ ] JSDoc documentation complete

---

## Task 47: Create parseApiError Function

### Overview
Create the parseApiError function that converts various error types (especially AxiosError) into standardized ApiException instances. This function handles different error scenarios: successful responses with error data, HTTP error responses, network failures, timeout errors, and unknown errors.

### Dependencies
- Task 46: ApiException class must be implemented
- AxiosError type imported from axios
- Understanding of Axios error structure

### Instructions

1. **Define parseApiError function signature**
   - Accept `error: unknown` as parameter
   - Return type should be `ApiException`
   - Make function exported from module
   - Ensure type safety with proper type guards

2. **Add function documentation**
   - Add JSDoc comment describing purpose
   - Document parameter: unknown error from catch block
   - Document return: standardized ApiException
   - Include examples of different error types handled

3. **Check if error is already ApiException**
   - First check: `if (error instanceof ApiException)`
   - If true, return error as-is (no conversion needed)
   - This prevents double-wrapping of errors
   - Use type guard for proper TypeScript typing

4. **Check if error is AxiosError**
   - Import and use `isAxiosError` type guard from axios
   - If true, proceed with Axios-specific parsing
   - Most API errors will be AxiosError instances

5. **Handle AxiosError with response (HTTP error)**
   - Check if `error.response` exists
   - Extract response data, status, statusText
   - Parse response data for error message and code
   - Extract field-level errors if present (validation errors)
   - Create ApiException with extracted data

6. **Handle AxiosError request sent but no response (network error)**
   - Check if `error.request` exists but no response
   - Indicates network connectivity problem
   - Create ApiException with isNetworkError flag
   - Use appropriate user-friendly message

7. **Handle AxiosError timeout**
   - Check error.code for 'ECONNABORTED' or message contains 'timeout'
   - Create ApiException with isTimeoutError flag
   - Use timeout-specific user message

8. **Handle AxiosError setup failure**
   - Error occurred before request was sent
   - Usually indicates client-side configuration issue
   - Create ApiException with error.message

9. **Handle non-Axios errors**
   - Check if error is Error instance
   - Use error.message if available
   - Otherwise convert to string

10. **Handle unknown error types**
    - Catch-all for unexpected error types
    - Convert to string representation
    - Create generic ApiException

11. **Preserve original error**
    - In all cases, include originalError property
    - Useful for debugging and logging
    - Maintain error chain

### Error Type Decision Tree

```
                    parseApiError(error)
                            │
                            ▼
                 Is ApiException?
                   /          \
                 Yes           No
                  │             │
              Return as-is       ▼
                           Is AxiosError?
                            /          \
                          Yes           No
                           │             │
                           ▼             ▼
                   Has response?     Is Error?
                    /          \      /      \
                  Yes           No   Yes      No
                   │             │    │       │
                   ▼             ▼    ▼       ▼
            HTTP Error    Network/   Use    Convert
            Parse data    Timeout   .message to string
```

### Axios Error Structure

| Scenario | error.response | error.request | Interpretation |
|----------|---------------|---------------|----------------|
| HTTP 4xx/5xx | ✓ exists | ✓ exists | Server responded with error |
| Network failure | ✗ null | ✓ exists | Request sent, no response |
| Timeout | ✗ null | ✓ exists | Request exceeded time limit |
| Setup error | ✗ null | ✗ null | Error before request sent |

### Response Data Parsing

**Expected backend error format:**
```
{
  message: string,          // Main error message
  code?: string,           // Application error code
  errors?: {               // Field-level errors
    field1: string[],
    field2: string[]
  }
}
```

**Parsing strategy:**
```
1. Try to access response.data
2. Check if data.message exists (use it)
3. Otherwise use statusText
4. Extract data.code if present
5. Parse data.errors into ApiErrorDetails format
6. Include status code from response
```

### Error Code Detection

| Condition | Error Code | Set Flag |
|-----------|-----------|----------|
| error.code === 'ECONNABORTED' | TIMEOUT | isTimeoutError |
| error.message.includes('timeout') | TIMEOUT | isTimeoutError |
| error.code === 'ERR_NETWORK' | NETWORK | isNetworkError |
| No response and has request | NETWORK | isNetworkError |

### Expected Outcome
- parseApiError function fully implemented
- Handles all Axios error scenarios
- Creates properly typed ApiException instances
- Preserves error information and context
- Ready for use in API client interceptors

### Verification Checklist
- [ ] Function signature defined with proper types
- [ ] JSDoc documentation added
- [ ] ApiException pass-through check implemented
- [ ] AxiosError type guard used
- [ ] HTTP error response parsing implemented
- [ ] Network error detection implemented
- [ ] Timeout error detection implemented
- [ ] Setup error handling implemented
- [ ] Non-Axios Error handling implemented
- [ ] Unknown error fallback implemented
- [ ] originalError preserved in all cases

---

## Task 48: Create getErrorMessage Function

### Overview
Create a function that extracts user-friendly error messages from ApiException instances. This function provides a centralized way to convert technical error information into messages suitable for display to end users, with sensible fallbacks and context-aware messaging.

### Dependencies
- Task 47: parseApiError function must be implemented
- ApiException class available
- Understanding of HTTP status codes

### Instructions

1. **Define getErrorMessage function signature**
   - Accept `error: ApiException | Error | unknown` as parameter
   - Return type should be `string`
   - Make function exported from module
   - Handle various input types gracefully

2. **Add function documentation**
   - Add JSDoc comment describing purpose
   - Document parameter types
   - Document return: user-friendly error message
   - Note: function never returns technical details

3. **Handle non-Error types**
   - Check if error is undefined or null
   - Return generic "An unexpected error occurred" message
   - Handle string errors (use the string directly)
   - Convert unknown types to string

4. **Handle Error instances**
   - Check if error is Error but not ApiException
   - Return error.message if it exists and is user-friendly
   - Avoid exposing technical stack traces

5. **Handle ApiException with explicit message**
   - Check if error is ApiException
   - If error.message exists and is meaningful, return it
   - User-friendly messages should be preserved

6. **Provide status-based messages**
   - Create mapping of HTTP status codes to user messages
   - Use status code to determine appropriate message
   - Prioritize clarity and actionability

7. **Handle network errors**
   - Check isNetworkError flag
   - Return message about connectivity
   - Suggest checking internet connection

8. **Handle timeout errors**
   - Check isTimeoutError flag
   - Return message about timeout
   - Suggest retrying the operation

9. **Handle authentication errors (401)**
   - Detect status code 401
   - Return message about expired session
   - Suggest logging in again

10. **Handle authorization errors (403)**
    - Detect status code 403
    - Return message about insufficient permissions
    - Keep message non-technical

11. **Handle not found errors (404)**
    - Detect status code 404
    - Return message about resource not found
    - Avoid exposing URL details

12. **Handle validation errors (422)**
    - Detect status code 422
    - Check if error.details exists
    - If field errors present, format them clearly
    - Otherwise return generic validation message

13. **Handle server errors (5xx)**
    - Detect 500, 502, 503, 504 status codes
    - Return message about server issues
    - Suggest trying again later

14. **Provide fallback message**
    - If no specific case matches
    - Return generic but helpful message
    - Maintain professional tone

### HTTP Status Code Message Mapping

| Status Code | User-Friendly Message |
|-------------|----------------------|
| 400 | The request was invalid. Please check your input. |
| 401 | Your session has expired. Please log in again. |
| 403 | You don't have permission to perform this action. |
| 404 | The requested resource was not found. |
| 408 | The request timed out. Please try again. |
| 422 | Please check your input and try again. |
| 429 | Too many requests. Please wait a moment and try again. |
| 500 | Something went wrong on our end. Please try again later. |
| 502 | The server is temporarily unavailable. Please try again. |
| 503 | The service is currently undergoing maintenance. |
| 504 | The request took too long. Please try again. |

### Error Type Priority

```
Priority order for message selection:

1. isNetworkError flag → Network message
2. isTimeoutError flag → Timeout message
3. Specific HTTP status code → Status message
4. error.message (if user-friendly) → Use as-is
5. Fallback → Generic message
```

### Field Validation Error Formatting

**When error.details exists (422 status):**
```
Strategy:
1. Check if details object has keys
2. Extract first field and its error messages
3. Format as "Field: message"
4. Or list all field errors if multiple
5. Keep concise for UI display
```

**Example formatting:**
```
Single field: "Email: This field is required"
Multiple fields: "Please check the following fields: Email, Password"
```

### Message Tone Guidelines

| Guideline | Example |
|-----------|---------|
| Be concise | ✓ "Session expired. Please log in." |
|           | ✗ "Your authentication session has expired..." |
| Be actionable | ✓ "Check your connection and try again." |
|               | ✗ "Network error occurred." |
| Be non-technical | ✓ "Something went wrong." |
|                  | ✗ "Internal server error 500." |
| Be professional | ✓ "Please try again later." |
|                 | ✗ "Oops! Something broke!" |

### Expected Outcome
- getErrorMessage function fully implemented
- Comprehensive status code coverage
- User-friendly messages for all scenarios
- Appropriate tone and actionability
- Ready for use in UI error displays

### Verification Checklist
- [ ] Function signature defined with proper types
- [ ] JSDoc documentation added
- [ ] Null/undefined handling implemented
- [ ] String error handling implemented
- [ ] Generic Error handling implemented
- [ ] ApiException.message handling implemented
- [ ] isNetworkError check implemented
- [ ] isTimeoutError check implemented
- [ ] 401 status message implemented
- [ ] 403 status message implemented
- [ ] 404 status message implemented
- [ ] 422 status and field errors implemented
- [ ] 5xx status messages implemented
- [ ] Fallback message implemented

---

## Task 49: Create isNetworkError Function

### Overview
Create a utility function that determines if an error represents a network connectivity failure. This function examines various error properties and patterns to identify network-related issues, which is essential for retry logic and user feedback.

### Dependencies
- Task 45: Error handling module created
- ApiException class available
- AxiosError type available

### Instructions

1. **Define isNetworkError function signature**
   - Accept `error: unknown` as parameter
   - Return type should be `boolean`
   - Make function exported from module
   - Type-safe implementation with guards

2. **Add function documentation**
   - Add JSDoc comment describing purpose
   - Document parameter: any error object
   - Document return: true if network error, false otherwise
   - Include examples of network error scenarios

3. **Check if error is ApiException**
   - Use instanceof check for ApiException
   - If true, return the isNetworkError flag
   - This is the most reliable check

4. **Check if error is AxiosError**
   - Import isAxiosError type guard from axios
   - Proceed with Axios-specific checks

5. **Check for ERR_NETWORK error code**
   - Examine error.code property
   - If equals 'ERR_NETWORK', return true
   - This is Axios's standard network error code

6. **Check for no response with request sent**
   - Check if error.request exists
   - Check if error.response is null/undefined
   - If both conditions true, likely network error
   - Return true

7. **Check error message patterns**
   - Examine error.message (if exists)
   - Check for common network error phrases:
     * "Network Error"
     * "network error"
     * "ERR_NETWORK"
     * "Failed to fetch"
     * "NetworkError"
   - Use case-insensitive matching

8. **Handle generic Error instances**
   - Check if error is Error
   - Check message property for network keywords
   - Return true if patterns match

9. **Return false as default**
   - If no network error indicators found
   - Return false to be conservative
   - Avoid false positives

### Network Error Detection Strategy

```
                isNetworkError(error)
                        │
                        ▼
              Is ApiException?
               /            \
             Yes             No
              │               │
              ▼               ▼
    Return           Is AxiosError?
    isNetworkError    /          \
    flag            Yes           No
                     │             │
                     ▼             ▼
            Check code &     Check Error
            response         message
                     │             │
                     ▼             ▼
            Network        Match patterns?
            indicators?     /          \
             /      \     Yes           No
           Yes      No     │             │
            │        │     ▼             ▼
            ▼        ▼   Return       Return
        Return     Return  true        false
         true      false
```

### Network Error Indicators

| Source | Indicator | Check Method |
|--------|-----------|--------------|
| ApiException | isNetworkError flag | Direct property check |
| AxiosError | error.code === 'ERR_NETWORK' | String comparison |
| AxiosError | request exists, no response | Property existence |
| Error message | Contains "network error" | Regex or includes() |
| Error message | Contains "failed to fetch" | Case-insensitive match |

### Common Network Error Scenarios

| Scenario | Detection Method |
|----------|------------------|
| No internet connection | ERR_NETWORK code |
| DNS resolution failure | No response with request sent |
| Connection refused | AxiosError with no response |
| CORS blocked by browser | Depends on browser (may vary) |
| Firewall blocking request | No response received |

### Message Pattern Matching

**Keywords to check (case-insensitive):**
- "network error"
- "err_network"
- "failed to fetch"
- "networkerror"
- "connection refused"
- "connection timeout" (may overlap with timeout)

**Implementation approach:**
```
Convert message to lowercase
Check if includes any keyword
Use logical OR for multiple patterns
```

### Expected Outcome
- isNetworkError function fully implemented
- Accurate detection of network failures
- Multiple fallback detection methods
- Type-safe with proper guards
- Ready for use in retry logic

### Verification Checklist
- [ ] Function signature defined with boolean return
- [ ] JSDoc documentation added
- [ ] ApiException instanceof check implemented
- [ ] isAxiosError type guard used
- [ ] ERR_NETWORK code check implemented
- [ ] Request without response check implemented
- [ ] Message pattern matching implemented
- [ ] Generic Error message check implemented
- [ ] Default false return implemented
- [ ] Case-insensitive matching for patterns

---

## Task 50: Create isTimeoutError Function

### Overview
Create a utility function that determines if an error represents a request timeout. This function identifies timeout scenarios by examining error codes, messages, and status codes, which is crucial for implementing appropriate retry strategies and user notifications.

### Dependencies
- Task 45: Error handling module created
- ApiException class available
- AxiosError type available

### Instructions

1. **Define isTimeoutError function signature**
   - Accept `error: unknown` as parameter
   - Return type should be `boolean`
   - Make function exported from module
   - Ensure type safety with guards

2. **Add function documentation**
   - Add JSDoc comment describing purpose
   - Document parameter: any error object
   - Document return: true if timeout error, false otherwise
   - Include examples of timeout scenarios

3. **Check if error is ApiException**
   - Use instanceof check for ApiException
   - If true, return the isTimeoutError flag
   - Most reliable check for parsed errors

4. **Check if error is AxiosError**
   - Import isAxiosError type guard from axios
   - Proceed with Axios-specific timeout checks

5. **Check for ECONNABORTED error code**
   - Examine error.code property
   - If equals 'ECONNABORTED', return true
   - This is Axios's timeout error code

6. **Check for ETIMEDOUT error code**
   - Also check if code equals 'ETIMEDOUT'
   - Alternative timeout code
   - Return true if matches

7. **Check HTTP status code 408**
   - Examine error.response?.status
   - If equals 408, return true
   - HTTP standard timeout status

8. **Check error message for timeout keywords**
   - Examine error.message (if exists)
   - Check for timeout-related phrases:
     * "timeout"
     * "timed out"
     * "time out"
     * "ECONNABORTED"
     * "ETIMEDOUT"
   - Use case-insensitive matching

9. **Handle generic Error instances**
   - Check if error is Error
   - Check message for timeout keywords
   - Return true if patterns match

10. **Return false as default**
    - If no timeout indicators found
    - Return false to avoid false positives
    - Conservative approach

### Timeout Error Detection Strategy

```
                isTimeoutError(error)
                        │
                        ▼
              Is ApiException?
               /            \
             Yes             No
              │               │
              ▼               ▼
    Return           Is AxiosError?
    isTimeoutError    /          \
    flag            Yes           No
                     │             │
                     ▼             ▼
            Check code &     Check Error
            status 408       message
                     │             │
                     ▼             ▼
            Timeout         Match patterns?
            indicators?     /          \
             /      \     Yes           No
           Yes      No     │             │
            │        │     ▼             ▼
            ▼        ▼   Return       Return
        Return     Return  true        false
         true      false
```

### Timeout Error Indicators

| Source | Indicator | Check Method |
|--------|-----------|--------------|
| ApiException | isTimeoutError flag | Direct property check |
| AxiosError | error.code === 'ECONNABORTED' | String comparison |
| AxiosError | error.code === 'ETIMEDOUT' | String comparison |
| HTTP response | status === 408 | Status code check |
| Error message | Contains "timeout" | Case-insensitive match |

### Timeout Types

| Type | Description | Detection |
|------|-------------|-----------|
| Request timeout | Client-side timeout config exceeded | ECONNABORTED code |
| Server timeout | Server returns 408 status | HTTP 408 status |
| Connection timeout | TCP connection setup timeout | ETIMEDOUT code |
| Response timeout | Waiting for response timeout | Axios timeout config |

### Message Pattern Matching

**Keywords to check (case-insensitive):**
- "timeout"
- "timed out"
- "time out"
- "econnaborted"
- "etimedout"

**Implementation approach:**
```
Convert message to lowercase
Check if includes any keyword
Use logical OR for multiple patterns
Prioritize exact code matches over message matching
```

### Axios Timeout Configuration Context

**Where timeouts come from:**
- Axios instance config: `timeout: 30000` (30 seconds)
- Individual request config: overrides instance timeout
- When exceeded: throws error with ECONNABORTED code

**Timeout vs Network Error:**
```
Timeout: Request sent, no response within time limit
Network Error: Unable to send request or establish connection
```

### Expected Outcome
- isTimeoutError function fully implemented
- Accurate detection of timeout failures
- Multiple fallback detection methods
- Distinguishes timeouts from network errors
- Ready for use in retry logic

### Verification Checklist
- [ ] Function signature defined with boolean return
- [ ] JSDoc documentation added
- [ ] ApiException instanceof check implemented
- [ ] isAxiosError type guard used
- [ ] ECONNABORTED code check implemented
- [ ] ETIMEDOUT code check implemented
- [ ] HTTP 408 status check implemented
- [ ] Message pattern matching implemented
- [ ] Generic Error message check implemented
- [ ] Default false return implemented
- [ ] Case-insensitive matching for patterns

---

## Appendix A: Error Handling Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                      API Request Failed                      │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
                  ┌──────────────────────┐
                  │   Error Caught in    │
                  │   Try-Catch Block    │
                  └──────────┬───────────┘
                             │
                             ▼
                  ┌──────────────────────┐
                  │  parseApiError()     │
                  │  Converts to         │
                  │  ApiException        │
                  └──────────┬───────────┘
                             │
                ┌────────────┴────────────┐
                ▼                         ▼
    ┌──────────────────────┐  ┌──────────────────────┐
    │  isNetworkError()    │  │  isTimeoutError()    │
    │  Check error type    │  │  Check error type    │
    └──────────┬───────────┘  └──────────┬───────────┘
               │                          │
               └────────────┬─────────────┘
                            │
                            ▼
                 ┌──────────────────────┐
                 │  getErrorMessage()   │
                 │  Extract user        │
                 │  friendly message    │
                 └──────────┬───────────┘
                            │
               ┌────────────┴────────────┐
               ▼                         ▼
    ┌──────────────────┐      ┌──────────────────┐
    │  Display to User │      │  Log for Debug   │
    └──────────────────┘      └──────────────────┘
```

---

## Appendix B: ApiException Structure Diagram

```
┌───────────────────────────────────────────────────────────┐
│                      ApiException                          │
├───────────────────────────────────────────────────────────┤
│  Properties:                                               │
│  ├─ message: string (User-friendly error message)         │
│  ├─ code: string (Application error code: "UNKNOWN")      │
│  ├─ status: number (HTTP status code: 0)                  │
│  ├─ details: ApiErrorDetails | null                       │
│  │   └─ { fieldName: string[] }                           │
│  ├─ isNetworkError: boolean (false)                       │
│  ├─ isTimeoutError: boolean (false)                       │
│  └─ originalError?: unknown                               │
├───────────────────────────────────────────────────────────┤
│  Static Factory Methods:                                   │
│  ├─ fromAxiosError(error: AxiosError): ApiException       │
│  ├─ networkError(message?: string): ApiException          │
│  ├─ timeoutError(message?: string): ApiException          │
│  └─ serverError(status: number, message?: string)         │
├───────────────────────────────────────────────────────────┤
│  Instance Methods:                                         │
│  └─ toJSON(): object                                       │
└───────────────────────────────────────────────────────────┘
```

---

## Appendix C: Error Detection Decision Matrix

| Error Characteristic | isNetworkError | isTimeoutError | Retry? |
|---------------------|----------------|----------------|--------|
| error.code = 'ERR_NETWORK' | ✓ | ✗ | ✓ |
| error.code = 'ECONNABORTED' | ✗ | ✓ | ✓ |
| error.code = 'ETIMEDOUT' | ✗ | ✓ | ✓ |
| status = 408 | ✗ | ✓ | ✓ |
| No response + request exists | ✓ | ✗ | ✓ |
| Message contains "network" | ✓ | ✗ | ✓ |
| Message contains "timeout" | ✗ | ✓ | ✓ |
| status = 401 | ✗ | ✗ | ✗ |
| status = 403 | ✗ | ✗ | ✗ |
| status = 404 | ✗ | ✗ | ✗ |
| status = 422 | ✗ | ✗ | ✗ |
| status = 429 | ✗ | ✗ | ✓ |
| status = 5xx | ✗ | ✗ | ✓ |

---

## Appendix D: Testing Scenarios

### Test Cases for parseApiError

| Test Case | Input | Expected Output |
|-----------|-------|-----------------|
| Already ApiException | ApiException instance | Return as-is |
| AxiosError 404 | AxiosError with 404 response | ApiException with status 404 |
| AxiosError network | AxiosError no response | isNetworkError = true |
| AxiosError timeout | AxiosError ECONNABORTED | isTimeoutError = true |
| Generic Error | new Error("test") | ApiException with message |
| String error | "Something failed" | ApiException with message |
| Null error | null | Generic ApiException |

### Test Cases for getErrorMessage

| Test Case | Input | Expected Output |
|-----------|-------|-----------------|
| Network error | isNetworkError = true | "Check your internet connection" |
| Timeout error | isTimeoutError = true | "Request timed out. Please try again" |
| 401 status | status = 401 | "Session expired. Please log in again" |
| 403 status | status = 403 | "You don't have permission" |
| 404 status | status = 404 | "Resource was not found" |
| 422 with details | status = 422 + field errors | Format field errors |
| 500 status | status = 500 | "Something went wrong" |
| Unknown error | status = 0 | "An unexpected error occurred" |

### Test Cases for isNetworkError

| Test Case | Input | Expected Result |
|-----------|-------|-----------------|
| ApiException with flag | isNetworkError = true | true |
| ERR_NETWORK code | error.code = 'ERR_NETWORK' | true |
| No response + request | request exists, response null | true |
| Message "Network Error" | message includes "network" | true |
| Regular 404 error | AxiosError 404 | false |
| Null input | null | false |

### Test Cases for isTimeoutError

| Test Case | Input | Expected Result |
|-----------|-------|-----------------|
| ApiException with flag | isTimeoutError = true | true |
| ECONNABORTED code | error.code = 'ECONNABORTED' | true |
| ETIMEDOUT code | error.code = 'ETIMEDOUT' | true |
| Status 408 | response.status = 408 | true |
| Message "timeout" | message includes "timeout" | true |
| Network error | isNetworkError = true | false |
| Null input | null | false |

---

## Summary

This document established the complete error handling infrastructure for the API client layer. The ApiException class provides a standardized error representation, parseApiError converts various error types into this format, getErrorMessage extracts user-friendly messages, and detection functions (isNetworkError, isTimeoutError) enable intelligent error handling and retry logic. These utilities form the foundation for robust error management throughout the application.

**Next Steps:**
- Proceed to [02_Tasks-51-58_Retry-Cancellation-Offline.md](02_Tasks-51-58_Retry-Cancellation-Offline.md)
- Implement retry configuration and logic
- Add request cancellation capabilities
- Integrate offline detection
