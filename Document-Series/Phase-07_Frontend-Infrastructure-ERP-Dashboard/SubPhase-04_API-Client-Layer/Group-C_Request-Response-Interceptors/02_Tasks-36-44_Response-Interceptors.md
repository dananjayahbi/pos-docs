# Tasks 36-44: Response Interceptors and Error Handling

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 04 - API Client Layer  
> **Group:** C - Request/Response Interceptors  
> **Document:** 02 of 02  
> **Tasks Covered:** 36, 37, 38, 39, 40, 41, 42, 43, 44

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-31-35_Request-Interceptors.md](01_Tasks-31-35_Request-Interceptors.md)

---

## Document Overview

This document covers the implementation of response interceptors for the Axios API client. Response interceptors handle successful responses, various error status codes (401, 403, 404, 422, 500), implement a token refresh queue to prevent concurrent refresh attempts, and log response times for performance monitoring. These interceptors provide centralized error handling and transform API responses into a consistent format for the frontend application.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 36 | Create Response Interceptor Module | Low | 15 min |
| 37 | Handle Successful Responses (200-299) | Low | 15 min |
| 38 | Handle 401 Unauthorized | Medium | 30 min |
| 39 | Handle 403 Forbidden | Low | 15 min |
| 40 | Handle 404 Not Found | Low | 15 min |
| 41 | Handle 422 Validation Errors | Medium | 25 min |
| 42 | Handle 500 Server Errors | Low | 15 min |
| 43 | Implement Token Refresh Queue | High | 45 min |
| 44 | Log Response Time | Low | 20 min |

---

## Task 36: Create Response Interceptor Module

### Overview
Create the response interceptor module that processes all responses from the API. This interceptor runs after receiving responses from the backend, allowing centralized handling of successful responses and error cases. Response interceptors can transform response data, handle errors uniformly, and trigger actions like token refresh or user logout.

### Dependencies
- Task 14: Axios instance must be configured
- Request interceptors (Tasks 31-35) should be implemented first

### Instructions

1. **Locate the API client file**
   - Navigate to `frontend/services/api/apiClient.ts`
   - This file contains the Axios instance
   - Response interceptor will be added here

2. **Add response interceptor registration**
   - Use `axiosInstance.interceptors.response.use()` method
   - This method accepts two functions: success handler and error handler
   - Both handlers will be implemented in subsequent tasks

3. **Create success handler function**
   - First parameter to `use()` method
   - Receives Axios response object
   - Processes successful responses (status 200-299)
   - Will be implemented in Task 37

4. **Create error handler function**
   - Second parameter to `use()` method
   - Receives Axios error object
   - Processes error responses (status 400+)
   - Will contain status code routing logic

5. **Add error status routing**
   - Check `error.response.status` to determine error type
   - Route to appropriate handler based on status code
   - Handle cases where response is undefined (network errors)

6. **Add response type interfaces**
   - Define TypeScript interface for successful response data
   - Define interface for error response structure
   - Include field error types for validation errors

7. **Export interceptor setup function**
   - Create function to set up interceptors
   - Call during application initialization
   - Allow removal of interceptors if needed

### Response Interceptor Structure

```
Response Interceptor
├── Success Handler (Task 37)
│   └── Status 200-299
│       └── Extract data property
│
└── Error Handler
    ├── 401 Unauthorized (Task 38)
    ├── 403 Forbidden (Task 39)
    ├── 404 Not Found (Task 40)
    ├── 422 Validation (Task 41)
    ├── 500 Server Error (Task 42)
    └── Network Errors (no response)
```

### Response Object Structure

| Property | Type | Description |
|----------|------|-------------|
| `data` | any | Response payload from backend |
| `status` | number | HTTP status code (200-299) |
| `statusText` | string | HTTP status text |
| `headers` | object | Response headers |
| `config` | object | Original request config |

### Error Object Structure

| Property | Type | Description |
|----------|------|-------------|
| `message` | string | Error message |
| `response` | object | Response object (if received) |
| `response.status` | number | HTTP status code |
| `response.data` | any | Error data from backend |
| `request` | object | Request that caused error |
| `config` | object | Original request config |

### Expected Outcome
- Response interceptor registered on Axios instance
- Framework for handling all API responses
- Structured error routing based on status codes
- Type-safe response and error interfaces

### Verification Checklist
- [ ] Response interceptor registered with two handlers
- [ ] Success handler function defined
- [ ] Error handler function defined
- [ ] Status code routing logic implemented
- [ ] Response type interfaces defined
- [ ] Error type interfaces defined
- [ ] Network error handling included

---

## Task 37: Handle Successful Responses (200-299)

### Overview
Implement the success handler that processes all successful API responses (HTTP status codes 200-299). This handler extracts the response data, performs any necessary transformations, logs response times, and returns data in a consistent format for consumption by frontend components.

### Dependencies
- Task 36: Response interceptor module must exist

### Instructions

1. **Implement success handler function**
   - Accept Axios response object as parameter
   - This function runs for all 2xx status codes
   - Return value will be passed to calling code

2. **Extract data property**
   - Access `response.data` property
   - This contains the actual API response payload
   - Backend typically wraps data in consistent structure

3. **Handle nested data structures**
   - Check if backend returns `{ data: {...} }` format
   - Extract inner data object if present
   - Maintain consistency with backend response format

4. **Preserve response metadata**
   - Keep status code available if needed
   - Preserve headers for pagination info
   - Maintain config for request tracking

5. **Log successful responses (development)**
   - Log response status and endpoint in development mode
   - Include response time if available
   - Use console groups for better organization

6. **Add response transformation**
   - Transform date strings to Date objects if needed
   - Normalize field names (snake_case to camelCase) if required
   - Apply global transformations here

7. **Return processed response**
   - Return the extracted/transformed data
   - This value becomes the resolved promise value
   - Calling code receives this as the response

### Success Response Flow

```
Successful API Call (200-299)
         │
         ▼
   Response Interceptor
         │
         ▼
   Success Handler
         │
         ├─► Extract response.data
         ├─► Apply transformations
         ├─► Log (development)
         └─► Return data
                │
                ▼
         Calling Component
```

### Backend Response Format

| Scenario | Backend Format | Handler Action |
|----------|---------------|----------------|
| Single object | `{ data: {...} }` | Extract data property |
| List response | `{ data: [...], meta: {...} }` | Extract data, preserve meta |
| Paginated | `{ data: [...], pagination: {...} }` | Preserve pagination info |
| Simple | `{ ... }` | Return as-is |

### Transformation Examples

| Transformation | Purpose | When to Apply |
|----------------|---------|---------------|
| Date parsing | Convert ISO strings to Date | If backend returns date strings |
| camelCase | Frontend convention | If backend uses snake_case |
| Null handling | Default values | If nulls should be empty strings |
| Numeric parsing | Type consistency | If backend returns string numbers |

### Logging Structure (Development)

```
console.group(`✓ ${method} ${url}`)
  ├─ Status: 200
  ├─ Duration: 245ms
  ├─ Data: {...}
  └─ Timestamp
console.groupEnd()
```

### Expected Outcome
- All successful responses processed uniformly
- Response data extracted and transformed
- Development logging for debugging
- Consistent data format for frontend

### Verification Checklist
- [ ] Success handler extracts response.data
- [ ] Nested data structures handled correctly
- [ ] Response metadata preserved when needed
- [ ] Development logging implemented
- [ ] Transformations applied appropriately
- [ ] Return value is properly typed
- [ ] Handles various backend response formats

---

## Task 38: Handle 401 Unauthorized (Token Refresh Logic)

### Overview
Implement the 401 Unauthorized error handler that manages expired access tokens. When the API returns 401, attempt to refresh the access token using the refresh token. If refresh succeeds, retry the original request with the new token. If refresh fails or no refresh token exists, logout the user and redirect to the login page. This handler is critical for maintaining user sessions.

### Dependencies
- Task 36: Response interceptor module must exist
- Task 26: Token refresh function must be implemented
- Token storage service must be available

### Instructions

1. **Create 401 error handler function**
   - Check if `error.response.status === 401`
   - Extract original request config from error
   - Determine if token refresh should be attempted

2. **Check for refresh token availability**
   - Access token storage to get refresh token
   - If no refresh token exists, skip refresh attempt
   - Proceed directly to logout flow

3. **Prevent infinite refresh loops**
   - Check if the failed request was already a token refresh request
   - Use a flag in request config (e.g., `_retry`)
   - Do not attempt refresh if already retrying

4. **Mark request as retry**
   - Set `originalRequest._retry = true` flag
   - Prevents infinite loop if refreshed token also expires
   - Ensures each request only retries once

5. **Call token refresh function**
   - Use the token refresh service from Task 26
   - Pass the refresh token to the refresh endpoint
   - Wait for new access token in response

6. **Handle successful token refresh**
   - Store new access token in token storage
   - Update refresh token if provided by backend
   - Update Authorization header in original request
   - Retry original request with new token

7. **Handle failed token refresh**
   - Catch refresh errors (invalid/expired refresh token)
   - Clear all tokens from storage
   - Dispatch logout action to store
   - Redirect user to login page

8. **Queue concurrent requests**
   - If refresh is already in progress, queue the request
   - Implement in Task 43 for proper handling
   - Prevents multiple simultaneous refresh calls

9. **Return retry promise**
   - Return the retried request promise
   - This allows original calling code to receive the result
   - Transparent to the component making the API call

### 401 Handling Flow Diagram

```
API Returns 401
      │
      ▼
 Check Refresh Token
      │
  ┌───┴───┐
  │       │
  ▼       ▼
 Yes      No
  │       │
  │       └─► Logout & Redirect
  │
  ▼
Check _retry Flag
  │
┌─┴─┐
│   │
▼   ▼
Yes No
│   │
│   └─► Set _retry = true
│       │
│       ▼
│   Attempt Token Refresh
│       │
│   ┌───┴───┐
│   │       │
│   ▼       ▼
│ Success  Fail
│   │       │
│   │       └─► Logout & Redirect
│   │
│   ▼
│ Update Tokens
│   │
│   ▼
│ Retry Original Request
│   │
└───┴─► Return Promise
```

### Token Refresh Decision Logic

| Condition | Action |
|-----------|--------|
| No refresh token | Logout immediately |
| Refresh token exists, no _retry flag | Attempt refresh |
| Refresh token exists, _retry flag set | Logout (already tried) |
| Refresh succeeds | Update tokens, retry request |
| Refresh fails | Logout and redirect |
| Request was to /auth/refresh/ | Logout (don't retry refresh) |

### Original Request Retry

| Step | Action | Purpose |
|------|--------|---------|
| 1 | Clone request config | Preserve original request details |
| 2 | Update Authorization header | Use new access token |
| 3 | Set _retry flag | Prevent infinite loops |
| 4 | Call axios(updatedConfig) | Retry the request |
| 5 | Return promise | Pass result to caller |

### Logout Flow

| Step | Action |
|------|--------|
| 1 | Clear access token from storage |
| 2 | Clear refresh token from storage |
| 3 | Dispatch logout action to auth store |
| 4 | Redirect to login page |
| 5 | Show "Session expired" message |

### Error Scenarios

| Scenario | Handling |
|----------|----------|
| Network error during refresh | Logout user |
| Refresh returns 401 | Logout user (refresh token expired) |
| Refresh returns 500 | Logout user (server error) |
| Original request times out | Standard timeout handling |

### Expected Outcome
- Expired tokens automatically refreshed
- User sessions maintained seamlessly
- Failed refresh triggers proper logout
- No infinite refresh loops
- Original requests retried transparently

### Verification Checklist
- [ ] 401 status code detected correctly
- [ ] Refresh token existence checked
- [ ] _retry flag prevents infinite loops
- [ ] Token refresh function called
- [ ] New tokens stored on success
- [ ] Original request retried with new token
- [ ] Logout triggered on refresh failure
- [ ] User redirected to login page
- [ ] No multiple simultaneous refresh calls

---

## Task 39: Handle 403 Forbidden (Permission Errors)

### Overview
Implement the 403 Forbidden error handler that manages permission-related errors. When the API returns 403, it indicates the user is authenticated but lacks the necessary permissions to access the requested resource. This handler should create a user-friendly error, optionally show a permission denied message, and reject the promise with a structured error object.

### Dependencies
- Task 36: Response interceptor module must exist
- Error notification service may be needed

### Instructions

1. **Create 403 error handler function**
   - Check if `error.response.status === 403`
   - Extract error details from response data
   - Prepare to create permission error

2. **Extract error message from response**
   - Access `error.response.data.message` or similar
   - Backend may provide specific permission error details
   - Fallback to default message if not provided

3. **Create permission error object**
   - Construct structured error with type 'PermissionError'
   - Include original error message
   - Add status code and resource information

4. **Add resource context**
   - Extract requested resource from URL
   - Include HTTP method (GET, POST, PUT, DELETE)
   - Helps user understand what action was denied

5. **Log permission denial (development)**
   - Log warning with resource and method
   - Include user identity if available
   - Helps developers debug permission issues

6. **Show user notification (optional)**
   - Display toast/alert with permission denied message
   - Use friendly language: "You don't have permission to access this resource"
   - Consider whether to show notification here or in component

7. **Add permission error details**
   - Include required permission/role if provided by backend
   - Add suggestion for requesting access
   - Provide support contact if applicable

8. **Reject the promise**
   - Throw the structured permission error
   - Error will be caught by calling component
   - Component can handle error appropriately

### 403 Handling Flow

```
API Returns 403
      │
      ▼
Extract Error Message
      │
      ▼
Create PermissionError
      │
      ├─► Log (development)
      │
      ├─► Show notification (optional)
      │
      └─► Throw error
            │
            ▼
     Component catches error
```

### Permission Error Structure

| Property | Type | Description |
|----------|------|-------------|
| `type` | string | 'PermissionError' |
| `message` | string | User-friendly error message |
| `statusCode` | number | 403 |
| `resource` | string | Requested resource path |
| `method` | string | HTTP method used |
| `requiredPermission` | string | Required permission (if known) |
| `timestamp` | Date | When error occurred |

### Backend Error Response Format

| Backend Format | Handler Action |
|----------------|----------------|
| `{ message: "..." }` | Use message as-is |
| `{ detail: "..." }` | Map detail to message |
| `{ error: "...", required_permission: "..." }` | Include permission info |
| No message | Use default "Access denied" |

### User-Friendly Messages

| Scenario | Message |
|----------|---------|
| Default | "You don't have permission to access this resource" |
| Specific resource | "You don't have permission to view customer details" |
| With role | "This action requires Admin role" |
| Contact support | "Contact your administrator to request access" |

### Notification Options

| Approach | Pros | Cons |
|----------|------|------|
| Show in interceptor | Centralized, consistent | May duplicate component notifications |
| Show in component | More control, context-aware | Requires every component to handle |
| Hybrid | Use event bus or global handler | More complex setup |

### Development Logging

```
console.warn(`Permission Denied`)
├─ Resource: /api/customers/123
├─ Method: PUT
├─ User: john@example.com
├─ Required: customers.edit
└─ Timestamp: 2026-01-25T10:30:00Z
```

### Expected Outcome
- 403 errors caught and processed
- User-friendly permission error created
- Error details logged for debugging
- Optional notification shown to user
- Structured error rejected for component handling

### Verification Checklist
- [ ] 403 status code detected correctly
- [ ] Error message extracted from response
- [ ] PermissionError object created
- [ ] Resource and method information included
- [ ] Required permission extracted if available
- [ ] Development logging implemented
- [ ] User notification strategy decided
- [ ] Error properly rejected for component handling

---

## Task 40: Handle 404 Not Found

### Overview
Implement the 404 Not Found error handler that manages cases where the requested resource does not exist. When the API returns 404, create a user-friendly error indicating the resource was not found, log the missing resource, and reject the promise with a structured error object. This handler helps distinguish between client errors and server errors.

### Dependencies
- Task 36: Response interceptor module must exist

### Instructions

1. **Create 404 error handler function**
   - Check if `error.response.status === 404`
   - Extract resource URL from error config
   - Prepare to create not found error

2. **Extract resource information**
   - Get request URL from `error.config.url`
   - Extract resource ID if present in URL
   - Parse resource type (customers, products, orders, etc.)

3. **Create NotFoundError object**
   - Construct structured error with type 'NotFoundError'
   - Include resource URL and type
   - Add user-friendly message

4. **Generate user-friendly message**
   - Create message based on resource type
   - Examples: "Customer not found", "Product not found"
   - Fallback to generic "Resource not found"

5. **Add error context**
   - Include HTTP method used
   - Add request timestamp
   - Include resource ID if available

6. **Log missing resource (development)**
   - Log warning with resource URL
   - Include parameters used in request
   - Helps developers debug routing issues

7. **Consider notification strategy**
   - Decide if notification should show here or in component
   - 404 errors are often expected (e.g., checking if email exists)
   - May not want to show notification for every 404

8. **Reject the promise**
   - Throw the structured NotFoundError
   - Component can catch and handle appropriately
   - Component can decide whether to show error to user

### 404 Handling Flow

```
API Returns 404
      │
      ▼
Extract Resource Info
      │
      ▼
Parse Resource Type
      │
      ▼
Create NotFoundError
      │
      ├─► Generate friendly message
      │
      ├─► Log (development)
      │
      └─► Throw error
            │
            ▼
     Component handles error
```

### NotFoundError Structure

| Property | Type | Description |
|----------|------|-------------|
| `type` | string | 'NotFoundError' |
| `message` | string | User-friendly error message |
| `statusCode` | number | 404 |
| `resource` | string | Requested resource path |
| `resourceType` | string | Type of resource (customer, product) |
| `resourceId` | string | ID of missing resource |
| `method` | string | HTTP method used |
| `timestamp` | Date | When error occurred |

### Resource Type Extraction

| URL Pattern | Resource Type | Message |
|-------------|---------------|---------|
| `/api/customers/123` | customer | "Customer not found" |
| `/api/products/456` | product | "Product not found" |
| `/api/orders/789` | order | "Order not found" |
| `/api/users/42` | user | "User not found" |
| Unknown pattern | resource | "Resource not found" |

### URL Parsing Logic

```
URL: /api/tenants/abc123/customers/456
│
├─► Base: /api/tenants/abc123
├─► Resource: customers
├─► ID: 456
└─► Type: customer
```

### Message Generation

| Scenario | Message Format |
|----------|----------------|
| Has resource type & ID | "The {type} with ID {id} was not found" |
| Has resource type only | "{Type} not found" |
| No resource type | "The requested resource was not found" |
| List endpoint | "No results found" |

### When to Show Notifications

| Scenario | Show Notification |
|----------|-------------------|
| User navigates to detail page | Yes (user expects resource) |
| Checking if email exists | No (expected behavior) |
| Searching with no results | No (handled by component) |
| Fetching user profile | Yes (unexpected error) |

### Development Logging

```
console.warn(`Resource Not Found`)
├─ URL: /api/customers/123
├─ Method: GET
├─ Resource Type: customer
├─ Resource ID: 123
└─ Timestamp: 2026-01-25T10:30:00Z
```

### Expected Outcome
- 404 errors caught and processed
- Resource type and ID extracted
- User-friendly NotFoundError created
- Error details logged for debugging
- Structured error rejected for component handling

### Verification Checklist
- [ ] 404 status code detected correctly
- [ ] Resource URL extracted from config
- [ ] Resource type parsed from URL
- [ ] Resource ID extracted if present
- [ ] NotFoundError object created
- [ ] User-friendly message generated
- [ ] Development logging implemented
- [ ] Notification strategy considered
- [ ] Error properly rejected for component handling

---

## Task 41: Handle 422 Validation Errors (Field-Level Errors)

### Overview
Implement the 422 Unprocessable Entity error handler that manages validation errors from the backend. When the API returns 422, it indicates the request syntax was correct but the data failed validation. This handler should parse field-level validation errors, create a structured error object with field-specific messages, and reject the promise so components can display errors next to form fields.

### Dependencies
- Task 36: Response interceptor module must exist
- Form error handling in components

### Instructions

1. **Create 422 error handler function**
   - Check if `error.response.status === 422`
   - Extract validation errors from response data
   - Prepare to parse field-level errors

2. **Understand backend error format**
   - Backend typically returns object with field names as keys
   - Each field has array of error messages
   - Example: `{ email: ["Email already exists"], password: ["Too short"] }`

3. **Parse field-level errors**
   - Extract errors object from response data
   - Convert to standardized format if needed
   - Handle nested field paths (e.g., "address.street")

4. **Create ValidationError object**
   - Construct structured error with type 'ValidationError'
   - Include parsed field errors
   - Add overall validation message

5. **Handle different error formats**
   - Django REST Framework: `{ field: [messages] }`
   - Some APIs: `{ field: message }` (string, not array)
   - Some APIs: `{ errors: [{field, message}] }` (array of objects)
   - Normalize to consistent format

6. **Handle non-field errors**
   - Some validation errors aren't specific to a field
   - Backend may use `non_field_errors` or `_errors` key
   - Include these as general errors

7. **Create field error structure**
   - Each field error has: field name, array of messages
   - Use array even if only one message
   - Allows multiple validation rules per field

8. **Log validation errors (development)**
   - Log warning with field errors
   - Show which fields failed validation
   - Helps developers debug form issues

9. **Consider error aggregation**
   - Provide method to get all messages as flat array
   - Provide method to get first error per field
   - Helps with different UI patterns

10. **Reject the promise**
    - Throw the structured ValidationError
    - Component can access field errors via error.fieldErrors
    - Form can display errors next to respective fields

### 422 Handling Flow

```
API Returns 422
      │
      ▼
Extract validation errors
      │
      ▼
Parse field errors
      │
      ├─► Normalize format
      │
      ├─► Handle non-field errors
      │
      └─► Create ValidationError
            │
            ├─► Log (development)
            │
            └─► Throw error
                  │
                  ▼
         Component displays field errors
```

### ValidationError Structure

| Property | Type | Description |
|----------|------|-------------|
| `type` | string | 'ValidationError' |
| `message` | string | Overall validation error message |
| `statusCode` | number | 422 |
| `fieldErrors` | object | Map of field names to error messages |
| `nonFieldErrors` | string[] | Errors not tied to specific field |
| `timestamp` | Date | When error occurred |

### Field Errors Format

```typescript
fieldErrors: {
  email: ["This email is already registered"],
  password: [
    "Password must be at least 8 characters",
    "Password must contain a number"
  ],
  age: ["Must be at least 18 years old"]
}
```

### Backend Error Format Examples

**Django REST Framework:**
```json
{
  "email": ["This field must be unique."],
  "password": ["This field is required."],
  "non_field_errors": ["Passwords do not match"]
}
```

**Alternative Format 1:**
```json
{
  "errors": {
    "email": "Invalid email address",
    "password": "Too short"
  }
}
```

**Alternative Format 2:**
```json
{
  "errors": [
    {"field": "email", "message": "Required"},
    {"field": "password", "message": "Too short"}
  ]
}
```

### Normalization Logic

| Input Format | Normalization Action |
|--------------|---------------------|
| `{ field: [messages] }` | Use as-is (already normalized) |
| `{ field: message }` | Convert to `{ field: [message] }` |
| `{ errors: [{field, message}] }` | Convert to `{ field: [message] }` format |
| `{ field: { error: message } }` | Flatten to `{ field: [message] }` |

### Non-Field Errors

| Backend Key | Purpose |
|-------------|---------|
| `non_field_errors` | Django convention |
| `_errors` | Generic key |
| `general` | General errors |
| Root message | Overall validation message |

### Helper Methods

| Method | Purpose | Example |
|--------|---------|---------|
| `getFieldError(field)` | Get errors for specific field | `error.getFieldError('email')` |
| `getAllMessages()` | Flat array of all messages | For general display |
| `getFirstError(field)` | First error for field | For simple UI |
| `hasFieldError(field)` | Check if field has error | For conditional rendering |

### Component Usage Example Pattern

```
ValidationError thrown
      │
      ▼
Component catches error
      │
      ├─► Iterate over fieldErrors
      ├─► Set error state for each field
      ├─► Display errors below inputs
      └─► Show general errors at top
```

### Development Logging

```
console.warn(`Validation Error`)
├─ Fields with errors: email, password, age
├─ Total errors: 4
├─ Field errors:
│   ├─ email: ["Already registered"]
│   ├─ password: ["Too short", "No number"]
│   └─ age: ["Must be 18+"]
└─ Non-field errors: ["Passwords don't match"]
```

### Expected Outcome
- 422 errors caught and processed
- Field-level errors parsed and normalized
- ValidationError object created
- Helper methods for accessing errors
- Structured error rejected for component handling
- Components can display errors per field

### Verification Checklist
- [ ] 422 status code detected correctly
- [ ] Validation errors extracted from response
- [ ] Field errors parsed into normalized format
- [ ] Multiple backend formats handled
- [ ] Non-field errors extracted
- [ ] ValidationError object created
- [ ] Helper methods for error access
- [ ] Development logging implemented
- [ ] Error properly rejected for component handling
- [ ] Format supports form field display

---

## Task 42: Handle 500 Server Errors

### Overview
Implement the 500 Internal Server Error handler that manages unexpected backend errors. When the API returns 500 or other 5xx status codes, it indicates a server-side problem. This handler should create a user-friendly error message, log the error details for debugging, optionally report to error tracking service, and reject the promise with a structured error object.

### Dependencies
- Task 36: Response interceptor module must exist
- Error tracking service (optional, e.g., Sentry)

### Instructions

1. **Create 500 error handler function**
   - Check if `error.response.status >= 500`
   - Covers 500, 502, 503, 504, etc.
   - Prepare to create server error

2. **Extract error details**
   - Access `error.response.data` for backend error details
   - Backend may include error ID for tracking
   - Extract stack trace if provided (dev environment only)

3. **Create ServerError object**
   - Construct structured error with type 'ServerError'
   - Include status code (500, 502, 503, 504)
   - Add user-friendly message

4. **Generate user-friendly message**
   - Hide technical details from users
   - Generic message: "Something went wrong on our end"
   - Mention error ID if available for support reference

5. **Add error context**
   - Include request URL and method
   - Add timestamp
   - Include error ID from backend if provided

6. **Log server error details**
   - Log error level (not warning) for 5xx errors
   - Include full error details
   - Log stack trace if available

7. **Report to error tracking service**
   - Send error to Sentry, LogRocket, etc.
   - Include user context (ID, email)
   - Include request details (URL, method, params)
   - Tag with environment (dev, staging, prod)

8. **Handle specific 5xx codes**
   - 502 Bad Gateway: "Service temporarily unavailable"
   - 503 Service Unavailable: "Service under maintenance"
   - 504 Gateway Timeout: "Request timed out"
   - Different messages for better UX

9. **Show error notification**
   - Display toast/alert with generic error message
   - Include error ID if available
   - Suggest user contact support if issue persists

10. **Reject the promise**
    - Throw the structured ServerError
    - Component can catch and handle appropriately
    - Component may show retry button

### 500 Handling Flow

```
API Returns 5xx
      │
      ▼
Extract Error Details
      │
      ▼
Create ServerError
      │
      ├─► Log error
      │
      ├─► Report to tracking service
      │
      ├─► Show user notification
      │
      └─► Throw error
            │
            ▼
     Component handles error
```

### ServerError Structure

| Property | Type | Description |
|----------|------|-------------|
| `type` | string | 'ServerError' |
| `message` | string | User-friendly error message |
| `statusCode` | number | 5xx status code |
| `errorId` | string | Backend error ID (if provided) |
| `resource` | string | Requested resource path |
| `method` | string | HTTP method used |
| `timestamp` | Date | When error occurred |
| `retryable` | boolean | Whether request can be retried |

### Status Code Messages

| Status | Code | User Message |
|--------|------|--------------|
| Internal Server Error | 500 | "Something went wrong. Please try again." |
| Bad Gateway | 502 | "Service temporarily unavailable. Please try again." |
| Service Unavailable | 503 | "Service is under maintenance. Please try again later." |
| Gateway Timeout | 504 | "Request timed out. Please try again." |
| Other 5xx | 5xx | "An unexpected error occurred. Please try again." |

### Backend Error Response Format

| Backend Format | Handler Action |
|----------------|----------------|
| `{ error_id: "..." }` | Extract and include in error |
| `{ message: "..." }` | Log but don't show to user |
| `{ stack: "..." }` | Log in development only |
| `{ request_id: "..." }` | Include for tracking |

### Error Tracking Data

| Data | Purpose |
|------|---------|
| Error message | What went wrong |
| Status code | Type of server error |
| Request URL | Which endpoint failed |
| Request method | HTTP verb used |
| User ID | Who experienced error |
| Timestamp | When error occurred |
| Environment | Dev/staging/prod |
| Browser info | Client context |

### Retryable vs Non-Retryable

| Status | Retryable | Reason |
|--------|-----------|--------|
| 500 | Maybe | Could be transient |
| 502 | Yes | Gateway issue, may resolve |
| 503 | Yes | Service temporarily down |
| 504 | Yes | Timeout, may succeed on retry |

### User Notification Content

```
Title: "Something Went Wrong"
Message: "We're experiencing technical difficulties. 
         Please try again in a few moments."
Error ID: #ABC123XYZ (if available)
Action: [Try Again] [Contact Support]
```

### Development Logging

```
console.error(`Server Error`)
├─ Status: 500
├─ URL: /api/orders/create
├─ Method: POST
├─ Error ID: ABC123XYZ
├─ Message: Internal server error
├─ Stack: [stack trace if available]
└─ Timestamp: 2026-01-25T10:30:00Z
```

### Error Tracking Service Integration

```
Sentry.captureException(error, {
  tags: {
    statusCode: 500,
    resource: '/api/orders/create'
  },
  contexts: {
    request: {
      url: '/api/orders/create',
      method: 'POST',
      data: {...}
    },
    user: {
      id: userId,
      email: userEmail
    }
  }
})
```

### Expected Outcome
- 5xx errors caught and processed
- User-friendly ServerError created
- Error details logged for debugging
- Errors reported to tracking service
- User notification shown
- Structured error rejected for component handling

### Verification Checklist
- [ ] All 5xx status codes handled
- [ ] Error details extracted from response
- [ ] ServerError object created
- [ ] Status-specific messages generated
- [ ] Error ID extracted if available
- [ ] Error logged with full details
- [ ] Error reported to tracking service
- [ ] User notification shown
- [ ] Retryable flag set appropriately
- [ ] Error properly rejected for component handling

---

## Task 43: Implement Token Refresh Queue

### Overview
Implement a token refresh queue to handle concurrent API requests during token refresh. When multiple API calls fail with 401 simultaneously (common when token expires), only the first should trigger token refresh while others queue. After refresh completes, all queued requests retry with the new token. This prevents multiple simultaneous refresh calls and race conditions.

### Dependencies
- Task 38: 401 Unauthorized handler must exist
- Task 26: Token refresh function must be implemented

### Instructions

1. **Create queue state variables**
   - Create `isRefreshing` boolean flag (initially false)
   - Create `refreshSubscribers` array (initially empty)
   - These track refresh state and queued requests

2. **Understand the race condition problem**
   - Multiple requests fail with 401 at same time
   - Each triggers token refresh independently
   - Results in multiple refresh API calls
   - Can cause token invalidation or conflicts

3. **Modify 401 handler to check refresh state**
   - Before calling refresh, check `isRefreshing` flag
   - If true, another refresh is in progress
   - Add current request to queue instead

4. **Implement queue subscription**
   - Create function to add request to queue
   - Return a Promise that resolves when refresh completes
   - Store resolve function in `refreshSubscribers` array

5. **Set refreshing flag**
   - When first 401 occurs, set `isRefreshing = true`
   - Call token refresh function
   - Prevents other requests from starting refresh

6. **Handle successful token refresh**
   - After refresh succeeds, get new access token
   - Call all subscribers with new token
   - Each subscriber retries its request with new token

7. **Implement subscriber notification**
   - Iterate through `refreshSubscribers` array
   - Call each resolve function with new token
   - Clear the subscribers array after notification

8. **Handle failed token refresh**
   - If refresh fails, reject all queued requests
   - Call reject on all subscriber promises
   - Clear subscribers array
   - Trigger logout flow

9. **Reset refreshing flag**
   - After refresh completes (success or fail), set `isRefreshing = false`
   - Allows future refresh attempts if needed
   - Use try-finally to ensure flag is reset

10. **Subscriber retry logic**
    - When subscriber receives new token, update request config
    - Set Authorization header with new token
    - Retry the original request
    - Return result to original caller

### Token Refresh Queue Flow

```
Multiple 401 Errors Occur
      │
      ├─────────┬─────────┬─────────┐
      ▼         ▼         ▼         ▼
   Request1  Request2  Request3  Request4
      │         │         │         │
      └─────────┴─────────┴─────────┘
                │
                ▼
         Check isRefreshing
                │
        ┌───────┴───────┐
        │               │
        ▼               ▼
      false           true
        │               │
        ▼               └──► Add to Queue
   Set isRefreshing = true   (wait for notification)
        │
        ▼
   Call Token Refresh
        │
    ┌───┴───┐
    │       │
    ▼       ▼
  Success  Fail
    │       │
    │       └──► Reject All Queued
    │
    ▼
  Notify All Queued with New Token
    │
    ▼
  Each Retries Original Request
    │
    ▼
  Set isRefreshing = false
```

### Queue Implementation Pattern

```
State Variables:
├─ isRefreshing: boolean = false
└─ refreshSubscribers: Array<(token: string) => void> = []

On 401 Error:
├─ If isRefreshing === false:
│   ├─ Set isRefreshing = true
│   ├─ Call refresh token API
│   ├─ On success:
│   │   ├─ Update stored token
│   │   ├─ Notify all subscribers
│   │   └─ Clear subscribers array
│   ├─ On failure:
│   │   ├─ Reject all subscribers
│   │   ├─ Clear subscribers array
│   │   └─ Trigger logout
│   └─ Finally:
│       └─ Set isRefreshing = false
│
└─ If isRefreshing === true:
    └─ Return new Promise that:
        ├─ Is stored in refreshSubscribers
        └─ Resolves when notified with new token
```

### Subscriber Function Structure

```
function subscribeTokenRefresh(callback) {
  return new Promise((resolve, reject) => {
    refreshSubscribers.push((token) => {
      try {
        callback(token);
        resolve(token);
      } catch (error) {
        reject(error);
      }
    });
  });
}
```

### Notification Logic

```
function notifySubscribers(token) {
  refreshSubscribers.forEach(callback => {
    callback(token);
  });
  refreshSubscribers = [];
}
```

### Queue States

| State | isRefreshing | refreshSubscribers | Action |
|-------|--------------|-------------------|--------|
| Initial | false | [] | Ready for refresh |
| First 401 | true | [] | Start refresh |
| Additional 401s | true | [callbacks] | Queue requests |
| Refresh success | false | [] | All retrying |
| Refresh failure | false | [] | All rejected |

### Race Condition Scenarios

| Scenario | Without Queue | With Queue |
|----------|---------------|------------|
| 5 requests expire | 5 refresh calls | 1 refresh call |
| Token invalidation | Possible | Prevented |
| Inconsistent tokens | Possible | Prevented |
| Duplicate requests | Possible | Prevented |

### Request Retry After Notification

```
Original Request Failed with 401
      │
      ▼
Added to Queue
      │
      ▼
Wait for Notification
      │
      ▼
Receive New Token
      │
      ▼
Update Authorization Header
      │
      ▼
Retry Original Request
      │
      ▼
Return Result to Caller
```

### Error Handling in Queue

| Error Scenario | Handling |
|----------------|----------|
| Refresh API fails | Reject all queued requests |
| Network error | Reject all queued requests |
| Subscriber throws | Catch and reject that subscriber only |
| Timeout during refresh | Reject all after timeout |

### Concurrency Example

```
Time: T0 - Token expires
├─ T0+10ms: Request A fails → starts refresh, isRefreshing=true
├─ T0+15ms: Request B fails → queued (refresh in progress)
├─ T0+20ms: Request C fails → queued (refresh in progress)
├─ T0+30ms: Request D fails → queued (refresh in progress)
├─ T0+200ms: Refresh completes
├─ T0+205ms: Notify A, B, C, D with new token
├─ T0+210ms: A retries
├─ T0+215ms: B retries
├─ T0+220ms: C retries
├─ T0+225ms: D retries
└─ T0+230ms: All complete, isRefreshing=false
```

### Expected Outcome
- Single token refresh for concurrent 401s
- Queued requests wait for refresh
- All requests retry with new token
- No race conditions or duplicate refreshes
- Clean state management

### Verification Checklist
- [ ] isRefreshing flag initialized
- [ ] refreshSubscribers array initialized
- [ ] 401 handler checks isRefreshing before refresh
- [ ] Requests queue when refresh in progress
- [ ] First 401 sets isRefreshing to true
- [ ] Token refresh called only once
- [ ] Subscribers notified after successful refresh
- [ ] Each subscriber retries with new token
- [ ] Failed refresh rejects all queued requests
- [ ] isRefreshing reset after completion
- [ ] No race conditions in concurrent scenarios

---

## Task 44: Log Response Time (Performance Monitoring)

### Overview
Implement response time logging to monitor API performance. Add a timestamp to each request and calculate the duration when the response is received. Log response times in development for debugging slow requests and optionally send performance metrics to analytics service in production. This helps identify performance bottlenecks and slow endpoints.

### Dependencies
- Task 36: Response interceptor module must exist
- Task 31: Request interceptor module must exist
- Analytics service (optional)

### Instructions

1. **Add timestamp in request interceptor**
   - Before request is sent, add start timestamp
   - Store in request config: `config.metadata.startTime`
   - Use `Date.now()` or `performance.now()` for precision

2. **Modify request interceptor to add metadata**
   - Check if `config.metadata` exists, create if not
   - Add `startTime` property to metadata
   - Metadata persists through interceptors

3. **Calculate duration in response interceptor**
   - In success handler, access `response.config.metadata.startTime`
   - Calculate duration: `endTime - startTime`
   - Duration is in milliseconds

4. **Add duration to response object**
   - Optionally add duration to response config
   - Allows components to access response time if needed
   - Store as `response.config.metadata.duration`

5. **Log response time (development)**
   - Log successful responses with duration
   - Color-code based on performance thresholds
   - Include endpoint and HTTP method

6. **Define performance thresholds**
   - Fast: < 200ms (green)
   - Normal: 200-500ms (yellow)
   - Slow: 500-1000ms (orange)
   - Very slow: > 1000ms (red)

7. **Format log output**
   - Include HTTP method and status code
   - Show endpoint path
   - Display duration with appropriate unit (ms)
   - Use console colors or emojis for visibility

8. **Log in error handler too**
   - Calculate duration even for failed requests
   - Helps identify if slow response caused timeout
   - Log with error details

9. **Send metrics to analytics (production)**
   - Optionally send performance data to service
   - Include endpoint, method, duration, status
   - Aggregate data for performance dashboards
   - Consider sampling to reduce overhead

10. **Add performance warnings**
    - If response exceeds threshold, log warning
    - Alert developers to investigate slow endpoints
    - Include request details for debugging

11. **Consider percentile tracking**
    - Track p50, p95, p99 response times
    - Identify consistently slow endpoints
    - May require analytics service

### Response Time Flow

```
Request Sent
      │
      ├─► Add startTime to config.metadata
      │
      ▼
API Processing
      │
      ▼
Response Received
      │
      ├─► Calculate duration (endTime - startTime)
      │
      ├─► Add duration to config.metadata
      │
      ├─► Log performance (development)
      │
      ├─► Send to analytics (production)
      │
      └─► Continue response processing
```

### Metadata Structure

```typescript
config.metadata = {
  startTime: number,        // Timestamp when request sent
  endTime: number,          // Timestamp when response received
  duration: number,         // Duration in milliseconds
  requestId: string         // From Task 34
}
```

### Performance Thresholds

| Category | Duration | Color | Action |
|----------|----------|-------|--------|
| Fast | < 200ms | Green | No action |
| Normal | 200-500ms | Yellow | Monitor |
| Slow | 500-1000ms | Orange | Investigate |
| Very Slow | > 1000ms | Red | Optimize |

### Development Logging Format

```
✓ GET /api/customers → 200 (245ms)
⚠ POST /api/orders → 200 (875ms)
✗ GET /api/products/123 → 404 (123ms)
```

### Colored Console Output

```typescript
if (duration < 200) {
  console.log(`✓ ${method} ${url} → ${status} (${duration}ms)`);
} else if (duration < 500) {
  console.warn(`⚠ ${method} ${url} → ${status} (${duration}ms)`);
} else {
  console.error(`✗ ${method} ${url} → ${status} (${duration}ms)`);
}
```

### Performance Log Details

| Property | Value | Purpose |
|----------|-------|---------|
| Method | GET, POST, etc. | Request type |
| URL | /api/customers | Endpoint |
| Status | 200, 404, etc. | Response status |
| Duration | 245ms | Response time |
| Threshold | Fast/Slow | Performance category |

### Analytics Data Structure

```typescript
{
  endpoint: '/api/customers',
  method: 'GET',
  status: 200,
  duration: 245,
  timestamp: '2026-01-25T10:30:00Z',
  userId: 'user123',
  tenantId: 'tenant456'
}
```

### Timing API Options

| API | Precision | Browser Support |
|-----|-----------|----------------|
| `Date.now()` | Milliseconds | All browsers |
| `performance.now()` | Microseconds | Modern browsers |
| `performance.getEntries()` | Detailed timing | Modern browsers |

### Sampling Strategy (Production)

| Traffic Level | Sample Rate | Reason |
|---------------|-------------|--------|
| Low (< 100 req/min) | 100% | Capture all data |
| Medium (100-1000) | 50% | Balance detail/overhead |
| High (> 1000) | 10% | Reduce overhead |

### Performance Warning Thresholds

```
if (duration > 1000) {
  console.warn(`Slow API Request Detected`)
  ├─ Endpoint: ${endpoint}
  ├─ Duration: ${duration}ms
  ├─ Method: ${method}
  └─ Consider optimization
}
```

### Integration with Error Tracking

```
Sentry.addBreadcrumb({
  category: 'api',
  message: `${method} ${url}`,
  level: duration > 1000 ? 'warning' : 'info',
  data: {
    duration,
    status,
    endpoint
  }
});
```

### Aggregated Metrics

| Metric | Calculation | Use Case |
|--------|-------------|----------|
| Average | Sum / Count | Overall performance |
| Median (p50) | Middle value | Typical performance |
| p95 | 95th percentile | Slow requests |
| p99 | 99th percentile | Worst case |

### Expected Outcome
- Response times logged for all requests
- Performance thresholds enforced
- Slow requests identified and logged
- Optional analytics integration
- Performance data for optimization

### Verification Checklist
- [ ] startTime added in request interceptor
- [ ] Metadata structure created
- [ ] Duration calculated in response interceptor
- [ ] Duration added to response config
- [ ] Development logging implemented
- [ ] Performance thresholds defined
- [ ] Color-coded console output
- [ ] Error responses also timed
- [ ] Analytics integration (optional)
- [ ] Performance warnings for slow requests
- [ ] Sampling strategy considered for production

---

## Summary

This document covered the implementation of response interceptors for the Axios API client. The nine tasks established comprehensive error handling and performance monitoring:

### Key Achievements

1. **Response Interceptor Framework** (Task 36)
   - Centralized response processing
   - Structured error routing

2. **Success Response Handling** (Task 37)
   - Data extraction and transformation
   - Consistent response format

3. **Authentication Flow** (Task 38)
   - Automatic token refresh on 401
   - Transparent request retry
   - Logout on refresh failure

4. **Permission Management** (Task 39)
   - User-friendly permission errors
   - Resource context in errors

5. **Resource Not Found** (Task 40)
   - Structured 404 errors
   - Resource type extraction

6. **Validation Errors** (Task 41)
   - Field-level error parsing
   - Multiple backend format support
   - Form-friendly error structure

7. **Server Error Handling** (Task 42)
   - User-friendly error messages
   - Error tracking integration
   - Status-specific messages

8. **Token Refresh Queue** (Task 43)
   - Prevents concurrent refresh calls
   - Queues requests during refresh
   - Race condition prevention

9. **Performance Monitoring** (Task 44)
   - Response time logging
   - Performance thresholds
   - Slow request identification

### Response Status Coverage

| Status Range | Handler | Implementation |
|--------------|---------|----------------|
| 200-299 | Success | Task 37 |
| 401 | Unauthorized | Task 38 |
| 403 | Forbidden | Task 39 |
| 404 | Not Found | Task 40 |
| 422 | Validation | Task 41 |
| 500-599 | Server Error | Task 42 |

### Integration Points

```
Response Interceptor
├── Success Handler
│   ├── Extract data
│   ├── Log performance (Task 44)
│   └── Return to caller
│
└── Error Handler
    ├── 401 → Token refresh (Task 38)
    │   └── Queue concurrent (Task 43)
    ├── 403 → Permission error (Task 39)
    ├── 404 → Not found error (Task 40)
    ├── 422 → Validation error (Task 41)
    └── 5xx → Server error (Task 42)
```

### Error Object Hierarchy

```
BaseError
├── PermissionError (403)
├── NotFoundError (404)
├── ValidationError (422)
└── ServerError (5xx)
```

### Testing Considerations

| Test Scenario | What to Verify |
|---------------|----------------|
| Successful response | Data extracted correctly |
| Expired token | Refresh triggered, request retried |
| Multiple 401s | Single refresh call |
| Permission denied | Permission error created |
| Resource not found | NotFound error with resource info |
| Validation failure | Field errors parsed correctly |
| Server error | User-friendly message, error tracked |
| Slow response | Performance warning logged |

### Next Steps

After completing these tasks:
1. Implement request retry logic (Group D)
2. Add timeout configuration (Group D)
3. Implement offline queue (Group E)
4. Create API hooks for React components (Group F)
5. Test all error scenarios
6. Monitor performance metrics
7. Configure error tracking service

---

## Appendix

### Error Type Reference

| Type | Status | Use Case |
|------|--------|----------|
| PermissionError | 403 | Insufficient permissions |
| NotFoundError | 404 | Resource doesn't exist |
| ValidationError | 422 | Form validation failed |
| ServerError | 5xx | Backend error |
| NetworkError | N/A | No response received |

### Performance Monitoring Tools

| Tool | Purpose |
|------|---------|
| Browser DevTools | Network tab timing |
| Sentry | Error tracking + performance |
| LogRocket | Session replay + performance |
| Google Analytics | Custom timing events |
| DataDog | APM and logging |

### Backend Error Format Standards

| Standard | Format |
|----------|--------|
| JSON:API | `{ errors: [{ status, title, detail }] }` |
| RFC 7807 | `{ type, title, status, detail }` |
| Django REST | `{ field: [messages] }` |
| Custom | Varies by backend |

---

**Document End**
