# Tasks 47-53: Store API Client Core & Modules Setup

**Document Number:** Phase-08 > SubPhase-01 > Group-D > Document-01  
**Status:** Active  
**Last Updated:** 2026-01-26  
**Dependencies:** Group-C Tasks 37-46 (Store Configuration)  
**Scope:** Store API Client Foundation, Authentication, Error Handling, Core Modules

---

## Navigation

- **Parent:** [Group-D Overview](00_GROUP_OVERVIEW.md)
- **Previous:** [Group-C Doc 02](../Group-C_Store-Configuration/02_Tasks-41-46_Business-SEO-Verify.md)
- **Next:** [Group-D Doc 02](02_Tasks-54-60_Extended-Modules-Verify.md)
- **Phase:** [Phase-08 Overview](../../00_PHASE_OVERVIEW.md)
- **SubPhase:** [SubPhase-01 Overview](../00_SUBPHASE_OVERVIEW.md)

---

## Document Overview

This document provides comprehensive instructions for establishing the Store API Client infrastructure for the Next.js webstore frontend. The API client serves as the communication layer between the React components and the Django backend, handling all HTTP requests, authentication, error management, and data transformation.

The client implements a modular architecture with separate concerns for authentication, error handling, and domain-specific API modules (products, categories, cart). It leverages Axios for HTTP communication and implements TypeScript interfaces for type-safe API interactions.

### Tasks Summary

| Task | Name | Complexity | Lines | Dependencies |
|------|------|------------|-------|--------------|
| 47 | Create Store API Client | High | 150-200 | Tasks 31, 32 |
| 48 | Configure Store Base URL | Medium | 50-75 | Task 47 |
| 49 | Create Store Auth Interceptor | High | 100-150 | Task 47, 48 |
| 50 | Create Store Error Handler | High | 150-200 | Task 47, 48 |
| 51 | Create Products API Module | Medium | 100-150 | Task 47-50 |
| 52 | Create Categories API Module | Medium | 75-100 | Task 47-50 |
| 53 | Create Cart API Module | High | 150-200 | Task 47-50 |

**Total Estimated Lines:** 775-1,075 lines across 7 files

### Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     Store API Client Layer                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────┐      ┌──────────────┐      ┌──────────────┐  │
│  │   Base API   │      │     Auth     │      │    Error     │  │
│  │    Client    │──────│ Interceptor  │──────│   Handler    │  │
│  │  (Axios)     │      │              │      │              │  │
│  └──────┬───────┘      └──────────────┘      └──────────────┘  │
│         │                                                        │
│         │  Modules                                              │
│  ┌──────┴────────────────────────────────────────────┐         │
│  │                                                     │         │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐           │         │
│  │  │Products │  │Categories│  │  Cart   │           │         │
│  │  │   API   │  │   API    │  │   API   │   ...     │         │
│  │  └─────────┘  └─────────┘  └─────────┘           │         │
│  │                                                     │         │
│  └─────────────────────────────────────────────────────┘       │
│                                                                   │
└───────────────────────────────┬─────────────────────────────────┘
                                │
                                ▼
                    ┌───────────────────────┐
                    │   Django Backend      │
                    │   /api/v1/store/*     │
                    └───────────────────────┘
```

### API Client Responsibilities

| Layer | Responsibility | Purpose |
|-------|----------------|---------|
| **Base Client** | Axios instance configuration | Central HTTP client setup |
| **Base URL Config** | Environment-based URL management | Multi-environment support |
| **Auth Interceptor** | Token injection & refresh | Secure API access |
| **Error Handler** | Unified error processing | User-friendly error handling |
| **Products Module** | Product catalog operations | Product listing & details |
| **Categories Module** | Category tree operations | Navigation & filtering |
| **Cart Module** | Shopping cart operations | Cart management with LKR |

---

## Task 47: Create Store API Client

### Overview

Establish the foundational API client using Axios that serves as the core HTTP communication layer for the webstore. This client provides a singleton instance with pre-configured settings, interceptors, and TypeScript interfaces for type-safe API interactions. The client implements request/response middleware for authentication, error handling, and response transformation.

**Complexity:** High  
**Estimated Lines:** 150-200  
**File Location:** `src/lib/api/storeClient.ts`

### Dependencies

- **Task 31:** NEXT_PUBLIC_API_URL environment variable configured
- **Task 32:** Environment variables validation setup
- **External:** Axios library installed in package.json

### Technical Specifications

#### Client Configuration Properties

| Property | Type | Purpose | Default |
|----------|------|---------|---------|
| baseURL | string | Backend API base URL | from env |
| timeout | number | Request timeout (ms) | 30000 |
| headers | object | Default headers | application/json |
| withCredentials | boolean | Send cookies | true |
| validateStatus | function | Valid status codes | 200-299 |

#### Interceptor Chain

```
Request Flow:
─────────────
1. Component makes API call
2. Request Interceptor (add auth token)
3. Request Interceptor (add headers)
4. Axios HTTP Request
5. Backend Processing
6. Axios HTTP Response
7. Response Interceptor (parse data)
8. Response Interceptor (handle errors)
9. Component receives data/error
```

### Instructions

#### Step 1: Install Required Dependencies

1. Navigate to the webstore frontend directory
2. Install Axios library via package manager
3. Verify Axios version is compatible with Next.js (v1.6.0+)
4. Install Axios TypeScript types if not included
5. Update package.json lock file

#### Step 2: Create API Client Base File

1. Create new directory structure: `src/lib/api/`
2. Create main client file: `storeClient.ts`
3. Import Axios and AxiosInstance type
4. Import AxiosRequestConfig and AxiosResponse types
5. Import environment configuration from Task 31

#### Step 3: Define TypeScript Interfaces

1. Create interface for API response wrapper:
   - Generic data type parameter
   - Success boolean flag
   - Optional message string
   - Optional error details object
   - Timestamp field
   
2. Create interface for pagination metadata:
   - Current page number
   - Total pages count
   - Items per page
   - Total items count
   - Has next/previous page flags
   
3. Create interface for error response:
   - Error code string
   - Error message string
   - Field errors array (for validation)
   - Stack trace (development only)
   
4. Create interface for client configuration:
   - Base URL string
   - Timeout number
   - Headers object
   - Retry configuration

#### Step 4: Configure Default Headers

1. Create headers configuration object with:
   - Content-Type: 'application/json'
   - Accept: 'application/json'
   - X-Client-Version: from package.json
   - X-Client-Platform: 'webstore'
   
2. Add conditional headers for:
   - Development mode indicators
   - CSRF token placeholder
   - Locale header (en-LK for Sri Lanka)
   - Timezone header (Asia/Colombo)

#### Step 5: Create Axios Instance Configuration

1. Create configuration object with:
   - baseURL from environment (NEXT_PUBLIC_API_URL)
   - timeout set to 30000ms (30 seconds)
   - headers from Step 4
   - withCredentials set to true
   - validateStatus function (accept 200-299)
   
2. Add conditional development configurations:
   - Extended timeout for debugging
   - Verbose error messages
   - Request/response logging flags

#### Step 6: Implement Request Interceptors Placeholder

1. Add request interceptor function signature
2. Log outgoing requests in development mode
3. Add request timestamp to config
4. Return modified config object
5. Add error handler for request failures
6. Document interceptor purpose (will be extended in Task 49)

#### Step 7: Implement Response Interceptors Placeholder

1. Add response interceptor function signature
2. Log incoming responses in development mode
3. Calculate request duration
4. Extract data from response wrapper if present
5. Add error handler for response failures
6. Document interceptor purpose (will be extended in Task 50)

#### Step 8: Create Singleton Instance

1. Instantiate Axios with configuration object
2. Apply request interceptors
3. Apply response interceptors
4. Export instance as default export
5. Prevent multiple instances with module caching
6. Add instance initialization timestamp

#### Step 9: Create Helper Functions

1. Create function to get current instance
2. Create function to check if client is configured
3. Create function to update base URL dynamically
4. Create function to reset client to defaults
5. Create function to check client health
6. Export helper functions as named exports

#### Step 10: Add TypeScript Type Exports

1. Export all interface types
2. Export AxiosInstance type alias
3. Export configuration types
4. Export error types
5. Export response types
6. Create index file for clean imports

### Expected Outcome

Upon completion, you will have:

1. **Core API Client File** (`storeClient.ts`):
   - Configured Axios instance with singleton pattern
   - TypeScript interfaces for type-safe API calls
   - Request/response interceptor placeholders
   - Default headers with Sri Lankan context
   - Environment-based configuration

2. **Type Definitions**:
   - Generic API response wrapper interface
   - Pagination metadata interface
   - Error response interface
   - Client configuration interface

3. **Helper Functions**:
   - Instance getter function
   - Configuration checker function
   - URL updater function
   - Health check function

4. **Export Structure**:
   - Default export: Axios instance
   - Named exports: Types and helpers
   - Clean import paths via index file

### Verification Checklist

```
□ Axios library installed and version verified
□ storeClient.ts file created in correct location
□ All TypeScript interfaces defined with proper types
□ Default headers include Sri Lankan context (en-LK, Asia/Colombo)
□ Axios instance configured with environment baseURL
□ Timeout set to 30000ms (30 seconds)
□ withCredentials enabled for cookie support
□ Request interceptor placeholder added
□ Response interceptor placeholder added
□ Singleton pattern implemented correctly
□ Helper functions created and exported
□ All types exported for external use
□ No TypeScript compilation errors
□ Import paths work correctly from components
□ Development logging enabled conditionally
```

---

## Task 48: Configure Store Base URL

### Overview

Establish the base URL configuration system that manages API endpoints across different environments (development, staging, production). This configuration ensures the API client communicates with the correct backend server, handles URL formatting, validates URL structure, and supports path prefixes for API versioning.

**Complexity:** Medium  
**Estimated Lines:** 50-75  
**File Location:** `src/lib/api/config.ts`

### Dependencies

- **Task 31:** NEXT_PUBLIC_API_URL environment variable
- **Task 47:** Store API client instance created

### URL Structure Breakdown

```
Complete API URL Structure:
───────────────────────────

┌─────────────────────────────────────────────────────────────┐
│  https://api.example.lk/api/v1/store/products?page=1       │
└─────────────────────────────────────────────────────────────┘
  │      │               │          │        │           │
  │      │               │          │        │           └─ Query Params
  │      │               │          │        └───────────── Resource
  │      │               │          └────────────────────── Path Prefix
  │      │               └───────────────────────────────── API Version
  │      └───────────────────────────────────────────────── Domain
  └──────────────────────────────────────────────────────── Protocol

Environment Examples:
─────────────────────
Development:   http://localhost:8000/api/v1/store
Staging:       https://staging-api.example.lk/api/v1/store
Production:    https://api.example.lk/api/v1/store
Testing:       http://localhost:8000/api/v1/store (override)
```

### Instructions

#### Step 1: Create Configuration File

1. Create new file: `src/lib/api/config.ts`
2. Import environment configuration utilities
3. Import URL validation libraries
4. Define configuration constants
5. Set up TypeScript interfaces for config

#### Step 2: Define Environment Detection

1. Create function to detect current environment:
   - Check NODE_ENV variable
   - Check NEXT_PUBLIC_VERCEL_ENV for Vercel deployments
   - Default to 'development' if undefined
   
2. Map environments to labels:
   - development → 'Development'
   - staging → 'Staging'
   - production → 'Production'
   - test → 'Testing'

#### Step 3: Extract Base URL from Environment

1. Read NEXT_PUBLIC_API_URL from environment
2. Validate URL is defined and not empty string
3. Throw descriptive error if URL missing
4. Trim whitespace from URL value
5. Store original URL for reference

#### Step 4: Implement URL Normalization

1. Create function to normalize URL:
   - Remove trailing slashes
   - Ensure protocol is present (http/https)
   - Validate protocol is http or https
   - Convert to lowercase domain
   - Preserve path casing
   
2. Handle localhost special cases:
   - Accept localhost without protocol
   - Default to http for localhost
   - Accept localhost with port numbers
   - Support 127.0.0.1 IP format

#### Step 5: Configure Path Prefix

1. Define API path prefix constant: `/api/v1/store`
2. Create function to append path prefix:
   - Check if base URL already contains prefix
   - Avoid duplicate prefix addition
   - Handle leading/trailing slashes correctly
   - Return combined URL string
   
3. Support path prefix override:
   - Check for NEXT_PUBLIC_API_PREFIX env var
   - Use custom prefix if provided
   - Default to standard prefix otherwise

#### Step 6: Implement URL Validation

1. Create URL validation function:
   - Verify valid URL format using URL constructor
   - Check protocol is http or https
   - Verify host is present
   - Validate port if specified (1-65535)
   - Return validation result object
   
2. Create error messages for validation failures:
   - Invalid URL format
   - Missing protocol
   - Invalid protocol (not http/https)
   - Missing host/domain
   - Invalid port number

#### Step 7: Support Multiple Environments

1. Create environment-specific URL mapping:
   ```
   development   → localhost:8000
   staging       → staging-api.domain.lk
   production    → api.domain.lk
   test          → localhost:8000
   ```
   
2. Implement fallback logic:
   - Use environment variable if set
   - Fall back to environment mapping
   - Use default localhost if all else fails
   
3. Add environment override support:
   - Check for NEXT_PUBLIC_API_URL_OVERRIDE
   - Log warning when override is active
   - Useful for testing/debugging

#### Step 8: Create Configuration Object

1. Build complete configuration object:
   - baseURL: normalized base URL with prefix
   - environment: current environment name
   - apiPrefix: path prefix value
   - originalURL: unmodified URL from env
   - isValidated: validation status
   
2. Add helper properties:
   - isDevelopment: boolean flag
   - isProduction: boolean flag
   - isLocalhost: boolean flag
   - version: API version ('v1')

#### Step 9: Implement Getters and Setters

1. Create getter functions:
   - getBaseURL(): returns full base URL
   - getApiPrefix(): returns path prefix
   - getEnvironment(): returns environment name
   - isConfigured(): returns configuration status
   
2. Create setter functions:
   - setBaseURL(url): updates base URL
   - validateAndSet(url): validates then sets
   - resetToDefault(): resets to env config

#### Step 10: Integrate with API Client

1. Import configuration in storeClient.ts
2. Replace hardcoded baseURL with config.getBaseURL()
3. Use configuration helpers for validation
4. Add configuration check on client initialization
5. Export configuration for testing purposes
6. Document configuration usage in comments

### Expected Outcome

Upon completion, you will have:

1. **Configuration File** (`config.ts`):
   - Environment detection logic
   - URL normalization functions
   - Path prefix configuration
   - URL validation with error messages
   - Multi-environment support

2. **Configuration Object**:
   - Complete base URL with prefix
   - Environment metadata
   - Validation status
   - Helper boolean flags

3. **Utility Functions**:
   - getBaseURL() for retrieving full URL
   - URL validation function
   - Environment detection
   - Configuration reset capability

4. **Integration**:
   - API client uses configuration
   - Environment-based URL selection
   - Override support for testing
   - Sri Lankan domain examples (.lk)

### Verification Checklist

```
□ config.ts file created in correct location
□ Environment detection function implemented
□ NEXT_PUBLIC_API_URL extracted from environment
□ URL normalization handles trailing slashes
□ Protocol validation (http/https only)
□ Localhost special cases handled correctly
□ Path prefix /api/v1/store configured
□ Path prefix prevents duplication
□ URL validation function works correctly
□ Validation errors are descriptive
□ Multi-environment mapping defined
□ Environment fallback logic implemented
□ Override support for testing added
□ Configuration object has all properties
□ Getter functions return correct values
□ Setter functions validate input
□ storeClient.ts uses getBaseURL()
□ No hardcoded URLs in client code
□ TypeScript types defined for config
□ Configuration logs in development mode
```

---

## Task 49: Create Store Auth Interceptor

### Overview

Implement the authentication interceptor that automatically injects JWT tokens into API requests, handles token expiration, manages token refresh flows, and gracefully handles guest checkout scenarios. The interceptor ensures secure API communication while providing seamless user experience for both authenticated and guest users.

**Complexity:** High  
**Estimated Lines:** 100-150  
**File Location:** `src/lib/api/interceptors/auth.ts`

### Dependencies

- **Task 47:** Store API client created
- **Task 48:** Base URL configuration complete
- **Related:** Authentication system (from Phase-07 or similar)

### Authentication Flow

```
Request Authentication Flow:
────────────────────────────

┌─────────────────────────────────────────────────────────────┐
│                      Component API Call                      │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
              ┌──────────────────────┐
              │  Auth Interceptor    │
              └──────────┬───────────┘
                         │
         ┌───────────────┴───────────────┐
         │                               │
         ▼                               ▼
   ┌─────────────┐              ┌──────────────┐
   │ Get Token   │              │ Check Guest  │
   │ from Storage│              │ Mode         │
   └──────┬──────┘              └──────┬───────┘
          │                            │
          ▼                            │
   ┌─────────────┐                    │
   │ Token Valid?│                    │
   └──────┬──────┘                    │
          │                            │
     ┌────┴────┐                      │
     │         │                      │
     ▼         ▼                      ▼
   Yes        No              ┌──────────────┐
     │         │              │ Skip Token   │
     │    ┌────┴─────┐        │ (Optional)   │
     │    │ Refresh  │        └──────┬───────┘
     │    │ Token    │               │
     │    └────┬─────┘               │
     │         │                     │
     └─────────┴─────────────────────┘
                │
                ▼
     ┌──────────────────────┐
     │ Add Authorization    │
     │ Header: Bearer token │
     └──────────┬───────────┘
                │
                ▼
     ┌──────────────────────┐
     │  Proceed with        │
     │  Backend Request     │
     └──────────────────────┘
```

### Token Storage Strategy

| Storage Method | Use Case | Pros | Cons |
|----------------|----------|------|------|
| **HttpOnly Cookie** | Production recommended | Secure, XSS-safe | CSRF consideration |
| **LocalStorage** | Development fallback | Easy access | Vulnerable to XSS |
| **Memory** | High-security option | Most secure | Lost on refresh |
| **SessionStorage** | Temporary sessions | Tab-specific | Lost on tab close |

### Instructions

#### Step 1: Create Interceptor File

1. Create directory: `src/lib/api/interceptors/`
2. Create file: `auth.ts`
3. Import AxiosRequestConfig type
4. Import storage utilities
5. Import token validation helpers

#### Step 2: Define Token Interface

1. Create interface for JWT token payload:
   - user_id: user identifier
   - email: user email
   - exp: expiration timestamp
   - iat: issued at timestamp
   - token_type: 'access' or 'refresh'
   
2. Create interface for token storage object:
   - accessToken: JWT access token string
   - refreshToken: JWT refresh token string
   - expiresAt: expiration date
   - tokenType: 'Bearer'

#### Step 3: Implement Token Retrieval

1. Create function getAccessToken():
   - Check localStorage for 'auth_token' key
   - Check sessionStorage as fallback
   - Check cookies for 'access_token'
   - Return token string or null
   - Add error handling for storage access
   
2. Create function getRefreshToken():
   - Check localStorage for 'refresh_token' key
   - Check cookies for 'refresh_token'
   - Return token string or null
   
3. Add logging for token retrieval:
   - Log in development mode only
   - Mask token in logs (show first/last 4 chars)
   - Log storage method used

#### Step 4: Implement Token Validation

1. Create function isTokenExpired(token):
   - Decode JWT token (without verification)
   - Extract 'exp' claim
   - Convert to Date object
   - Compare with current time
   - Return boolean expired status
   
2. Add validation checks:
   - Verify token format (3 parts separated by dots)
   - Check exp claim exists
   - Add buffer time (5 minutes before expiry)
   - Handle invalid token gracefully
   
3. Create function isTokenValid(token):
   - Check token exists and not empty
   - Check token format is valid
   - Check token not expired
   - Return overall validity boolean

#### Step 5: Implement Token Refresh Logic

1. Create function refreshAccessToken():
   - Get refresh token from storage
   - Make POST request to /api/v1/auth/token/refresh
   - Send refresh token in request body
   - Receive new access token in response
   - Update storage with new tokens
   - Return new access token
   
2. Add refresh error handling:
   - Handle network errors
   - Handle invalid refresh token (401)
   - Handle server errors (500)
   - Clear tokens on refresh failure
   - Redirect to login if needed
   
3. Implement refresh token locking:
   - Prevent concurrent refresh requests
   - Queue requests during refresh
   - Release queue after refresh complete
   - Handle refresh failures in queue

#### Step 6: Create Request Interceptor Function

1. Define async interceptor function:
   - Parameter: AxiosRequestConfig
   - Return: Modified AxiosRequestConfig
   
2. Implement interceptor logic:
   - Get access token from storage
   - Validate token if present
   - Refresh token if expired
   - Add Authorization header if token valid
   - Skip token for public endpoints
   - Handle errors gracefully
   
3. Check for guest mode:
   - Read guest mode flag from config
   - Skip token for guest checkout
   - Add X-Guest-Mode header instead
   - Generate guest session ID if needed

#### Step 7: Implement Authorization Header Addition

1. Create function addAuthHeader(config, token):
   - Check if Authorization header already exists
   - Format token: `Bearer ${token}`
   - Add to config.headers
   - Ensure headers object exists
   - Return modified config
   
2. Handle header edge cases:
   - Preserve existing headers
   - Handle null/undefined headers object
   - Handle case-insensitive header names
   - Avoid duplicate Authorization headers

#### Step 8: Handle 401 Unauthorized Responses

1. Create response interceptor for 401:
   - Intercept responses with 401 status
   - Check if token refresh already attempted
   - Attempt token refresh if not tried
   - Retry original request with new token
   - Clear tokens if refresh fails
   
2. Implement retry logic:
   - Maximum 1 retry per request
   - Mark request as retried
   - Clone original request config
   - Update Authorization header
   - Resend request
   
3. Handle logout on persistent 401:
   - Clear all tokens from storage
   - Clear user data from state
   - Redirect to login page
   - Show session expired message
   - Preserve return URL for redirect

#### Step 9: Implement Guest Checkout Support

1. Create function isGuestCheckoutRequest(config):
   - Check URL path contains /checkout
   - Check for guest mode flag in config
   - Check for guest session in storage
   - Return boolean guest status
   
2. Handle guest authentication:
   - Generate guest session ID if needed
   - Store guest session in localStorage
   - Add X-Guest-Session header
   - Skip token requirement for guest
   - Track guest cart items
   
3. Guest to authenticated conversion:
   - Detect login during guest session
   - Merge guest cart with user cart
   - Migrate guest data to user account
   - Clear guest session after merge

#### Step 10: Register Interceptor with Client

1. Import auth interceptor in storeClient.ts
2. Register request interceptor:
   - Call client.interceptors.request.use()
   - Pass auth interceptor function
   - Add error handler
   
3. Register response interceptor for 401:
   - Call client.interceptors.response.use()
   - Pass success handler (pass through)
   - Pass 401 error handler
   
4. Export interceptor functions:
   - Export for testing purposes
   - Export token utility functions
   - Export guest mode helpers

### Expected Outcome

Upon completion, you will have:

1. **Authentication Interceptor** (`auth.ts`):
   - Automatic token injection in requests
   - Token expiration detection
   - Token refresh mechanism
   - Guest checkout support
   - 401 handling with retry logic

2. **Token Management**:
   - Token retrieval from storage/cookies
   - Token validation and expiry checks
   - Refresh token flow implementation
   - Token storage updates

3. **Header Management**:
   - Authorization: Bearer {token}
   - X-Guest-Session: {session_id}
   - Conditional header addition

4. **User Experience**:
   - Seamless authentication for logged-in users
   - Graceful guest checkout handling
   - Automatic token refresh
   - Session expiry notifications

### Verification Checklist

```
□ auth.ts file created in interceptors directory
□ Token interface defined with all claims
□ getAccessToken() retrieves from storage
□ getRefreshToken() retrieves from storage
□ Token format validation implemented
□ isTokenExpired() checks expiry correctly
□ 5-minute buffer before expiry added
□ refreshAccessToken() calls refresh endpoint
□ Refresh token error handling implemented
□ Concurrent refresh prevention added
□ Request interceptor function created
□ Authorization header added correctly
□ Bearer token format used
□ Guest mode detection implemented
□ X-Guest-Session header for guests
□ 401 response interceptor added
□ Retry logic with max 1 attempt
□ Tokens cleared on persistent 401
□ Redirect to login on auth failure
□ Guest to authenticated conversion supported
□ Interceptor registered with client
□ No console errors during token operations
□ Tokens masked in logs
□ Guest checkout works without token
```

---

## Task 50: Create Store Error Handler

### Overview

Implement comprehensive error handling middleware that intercepts all API errors, transforms them into user-friendly messages, handles various HTTP status codes, implements retry logic for transient failures, and integrates with notification systems. The error handler provides consistent error responses across the application and improves user experience during API failures.

**Complexity:** High  
**Estimated Lines:** 150-200  
**File Location:** `src/lib/api/interceptors/errors.ts`

### Dependencies

- **Task 47:** Store API client created
- **Task 48:** Base URL configuration
- **Task 49:** Auth interceptor for 401 handling

### Error Handling Architecture

```
Error Flow Processing:
──────────────────────

API Request
    │
    ▼
Backend Error
    │
    ▼
┌───────────────────────────┐
│  Axios Error Interceptor  │
└───────────┬───────────────┘
            │
    ┌───────┴───────┐
    │               │
    ▼               ▼
Network Error   HTTP Error
    │               │
    │       ┌───────┴────────┐
    │       │                │
    │       ▼                ▼
    │   Client Error    Server Error
    │   (4xx)          (5xx)
    │       │                │
    └───────┴────────────────┘
            │
            ▼
    ┌───────────────┐
    │  Parse Error  │
    │  Response     │
    └───────┬───────┘
            │
            ▼
    ┌───────────────┐
    │  Map Status   │
    │  to Message   │
    └───────┬───────┘
            │
            ▼
    ┌───────────────┐
    │  Apply Retry  │
    │  Logic        │
    └───────┬───────┘
            │
            ▼
    ┌───────────────┐
    │  Log Error    │
    └───────┬───────┘
            │
            ▼
    ┌───────────────┐
    │  Show User    │
    │  Message      │
    └───────┬───────┘
            │
            ▼
    Throw Transformed
    Error to Component
```

### HTTP Status Code Mapping

| Status | Category | User Message | Action |
|--------|----------|--------------|--------|
| **400** | Bad Request | Invalid request data | Show validation errors |
| **401** | Unauthorized | Please log in to continue | Redirect to login |
| **403** | Forbidden | Access denied | Show error message |
| **404** | Not Found | Item not found | Redirect or show 404 |
| **409** | Conflict | Resource already exists | Show specific message |
| **422** | Validation Error | Please check your input | Show field errors |
| **429** | Rate Limited | Too many requests | Show retry timer |
| **500** | Server Error | Server error, please retry | Offer retry option |
| **502** | Bad Gateway | Service unavailable | Show maintenance mode |
| **503** | Unavailable | Service temporarily down | Show status page |

### Instructions

#### Step 1: Create Error Handler File

1. Create file: `src/lib/api/interceptors/errors.ts`
2. Import AxiosError type
3. Import notification/toast utilities
4. Import logging utilities
5. Import error tracking service (optional)

#### Step 2: Define Error Interfaces

1. Create interface for API error response:
   - error: string (error code)
   - message: string (error message)
   - details: object (additional context)
   - field_errors: array (validation errors)
   - timestamp: string (error time)
   - request_id: string (tracking ID)
   
2. Create interface for transformed error:
   - title: string (error title)
   - message: string (user-friendly message)
   - statusCode: number
   - isRetryable: boolean
   - originalError: AxiosError
   
3. Create interface for retry configuration:
   - maxRetries: number
   - retryDelay: number (ms)
   - retryableStatuses: number[]
   - backoffMultiplier: number

#### Step 3: Implement Error Type Detection

1. Create function isNetworkError(error):
   - Check for 'Network Error' message
   - Check for error.code === 'ECONNABORTED'
   - Check for timeout errors
   - Return boolean network error status
   
2. Create function isServerError(error):
   - Check status code >= 500
   - Return boolean server error status
   
3. Create function isClientError(error):
   - Check status code >= 400 && < 500
   - Return boolean client error status
   
4. Create function isTimeoutError(error):
   - Check for 'ECONNABORTED' code
   - Check for 'timeout' in message
   - Return boolean timeout status

#### Step 4: Implement Error Response Parser

1. Create function parseErrorResponse(error):
   - Extract response object from error
   - Check if response.data exists
   - Parse error message from response
   - Extract field errors for validation
   - Extract error code if present
   - Return parsed error object
   
2. Handle different response formats:
   - Django Rest Framework format
   - Custom backend error format
   - Plain text error responses
   - HTML error pages (500 errors)
   - Empty responses
   
3. Add fallback error messages:
   - Default message if none provided
   - Technical message for developers
   - User-friendly message for display

#### Step 5: Create Status Code Message Mapping

1. Create object mapping status codes to messages:
   - 400: "Invalid request. Please check your input."
   - 401: "Please log in to continue."
   - 403: "You don't have permission to access this."
   - 404: "The requested item was not found."
   - 409: "This item already exists."
   - 422: "Please fix the errors and try again."
   - 429: "Too many requests. Please wait and try again."
   - 500: "Server error. Please try again later."
   - 502: "Service is temporarily unavailable."
   - 503: "Service is under maintenance."
   
2. Add Sri Lankan context messages:
   - Payment failures (LKR context)
   - Shipping address errors (Sri Lanka)
   - Phone number validation (+94)
   - Postal code validation (5 digits)

#### Step 6: Implement User-Friendly Message Generator

1. Create function getUserMessage(error):
   - Get status code from error
   - Look up message in mapping
   - Use custom message if provided
   - Fall back to generic message
   - Return user-friendly string
   
2. Handle validation errors specially:
   - Extract field-specific errors
   - Format as readable list
   - Include field labels
   - Group related field errors
   
3. Format special error types:
   - Network errors: "Connection problem"
   - Timeout errors: "Request took too long"
   - Unknown errors: "Something went wrong"

#### Step 7: Implement Retry Logic

1. Create retry configuration:
   - maxRetries: 3
   - retryDelay: 1000ms (1 second)
   - retryableStatuses: [408, 429, 500, 502, 503]
   - backoffMultiplier: 2 (exponential)
   
2. Create function shouldRetry(error, retryCount):
   - Check if retry count < maxRetries
   - Check if status is retryable
   - Check if method is idempotent (GET, PUT, DELETE)
   - Avoid retrying POST requests
   - Return boolean retry decision
   
3. Implement exponential backoff:
   - Calculate delay: retryDelay * (backoffMultiplier ^ retryCount)
   - Add jitter to prevent thundering herd
   - Maximum delay cap (30 seconds)
   - Return delay in milliseconds
   
4. Create function retryRequest(originalRequest):
   - Wait for backoff delay
   - Clone original request config
   - Increment retry count in config
   - Resend request via axios
   - Return response or throw error

#### Step 8: Implement Error Logging

1. Create function logError(error, context):
   - Log to console in development
   - Send to error tracking service in production
   - Include request context:
     - URL and method
     - Request headers (sanitized)
     - Request body (sanitized)
     - Response status and data
     - User information (if available)
     - Timestamp
   
2. Sanitize sensitive data:
   - Remove Authorization headers
   - Mask password fields
   - Mask payment card data
   - Mask personal information
   - Keep error stack trace
   
3. Add log levels:
   - ERROR: Server errors (500+)
   - WARN: Client errors (400+)
   - INFO: Retry attempts
   - DEBUG: All error details

#### Step 9: Create Error Notification System

1. Create function showErrorNotification(error):
   - Get user-friendly message
   - Show toast/snackbar notification
   - Set appropriate notification type (error/warning)
   - Set duration based on severity
   - Add dismiss action
   
2. Handle notification types:
   - Critical errors: Red, persistent
   - Warnings: Orange, 5 seconds
   - Info: Blue, 3 seconds
   - Success (after retry): Green, 3 seconds
   
3. Add action buttons:
   - "Retry" for retryable errors
   - "Dismiss" for all errors
   - "Contact Support" for critical errors
   - "Refresh Page" for severe errors

#### Step 10: Implement Response Interceptor

1. Create error interceptor function:
   - Parameter: AxiosError
   - Detect error type (network/HTTP)
   - Parse error response
   - Get user-friendly message
   - Log error with context
   - Attempt retry if applicable
   - Show user notification
   - Throw transformed error
   
2. Register interceptor with client:
   - Import in storeClient.ts
   - Register with client.interceptors.response.use()
   - Pass null for success handler (no-op)
   - Pass error handler function
   
3. Export error utilities:
   - Export error interfaces
   - Export error type checkers
   - Export message generator
   - Export retry configuration

### Expected Outcome

Upon completion, you will have:

1. **Error Handler** (`errors.ts`):
   - Comprehensive error interception
   - Network and HTTP error handling
   - Status code to message mapping
   - User-friendly error messages
   - Sri Lankan context in messages

2. **Retry Mechanism**:
   - Automatic retry for transient failures
   - Exponential backoff with jitter
   - Retry only idempotent requests
   - Configurable retry parameters

3. **Error Logging**:
   - Development console logging
   - Production error tracking
   - Sanitized sensitive data
   - Contextual error information

4. **User Notifications**:
   - Toast/snackbar error messages
   - Actionable error notifications
   - Severity-based styling
   - Dismiss and retry actions

### Verification Checklist

```
□ errors.ts file created in interceptors directory
□ API error interface defined completely
□ Transformed error interface defined
□ Retry configuration interface defined
□ isNetworkError() detects connection issues
□ isServerError() identifies 5xx errors
□ isClientError() identifies 4xx errors
□ isTimeoutError() detects timeout scenarios
□ parseErrorResponse() extracts error data
□ Django REST Framework errors parsed
□ Custom backend errors parsed
□ Status code mapping object complete
□ Sri Lankan context messages added (LKR, +94)
□ getUserMessage() returns friendly messages
□ Validation errors formatted as list
□ Field labels included in error messages
□ Retry configuration set correctly
□ shouldRetry() checks all conditions
□ POST requests not retried
□ Exponential backoff implemented
□ Jitter added to backoff
□ Maximum retry delay capped
□ retryRequest() resends with delay
□ Error logging function complete
□ Sensitive data sanitized in logs
□ Log levels assigned correctly
□ Error tracking service integrated (optional)
□ showErrorNotification() displays toast
□ Notification types configured
□ Action buttons added to notifications
□ Error interceptor function complete
□ Interceptor registered with client
□ Errors transformed before throwing
□ No unhandled promise rejections
□ Network errors show appropriate message
□ Timeout errors trigger retry
```

---

## Task 51: Create Products API Module

### Overview

Develop the Products API module that provides methods for retrieving product listings, individual product details, product variants, and product reviews. The module implements pagination for large product catalogs, supports filtering and sorting, handles product search queries, and includes TypeScript interfaces for type-safe data handling.

**Complexity:** Medium  
**Estimated Lines:** 100-150  
**File Location:** `src/lib/api/modules/products.ts`

### Dependencies

- **Task 47-50:** API client with auth and error handling
- **Backend:** Products API endpoints (/api/v1/store/products)

### API Endpoints Overview

```
Products API Endpoints:
───────────────────────

GET  /api/v1/store/products
     └─ List all products with pagination & filters

GET  /api/v1/store/products/:slug
     └─ Get single product by slug

GET  /api/v1/store/products/:id/variants
     └─ Get product variants (size, color, etc.)

GET  /api/v1/store/products/:id/reviews
     └─ Get product reviews & ratings

Query Parameters:
─────────────────
page          : Page number (1-based)
page_size     : Items per page (default: 24)
search        : Search query string
category      : Filter by category slug
min_price     : Minimum price (LKR)
max_price     : Maximum price (LKR)
sort          : Sort field (price, name, created)
order         : Sort order (asc, desc)
in_stock      : Filter by availability (true/false)
featured      : Show featured products only
on_sale       : Show discounted products only
```

### Product Data Structure

| Field | Type | Description | Example (Sri Lanka) |
|-------|------|-------------|---------------------|
| id | number | Product ID | 1234 |
| slug | string | URL-friendly name | "samsung-galaxy-s23" |
| name | string | Product name | "Samsung Galaxy S23" |
| description | string | Product description | "Latest smartphone..." |
| price | number | Regular price (LKR) | 185000.00 |
| sale_price | number | Discounted price | 175000.00 |
| currency | string | Currency code | "LKR" |
| in_stock | boolean | Availability | true |
| stock_quantity | number | Available units | 15 |
| category | object | Category info | {...} |
| images | array | Product images | [...] |
| variants | array | Product variants | [...] |
| rating | number | Average rating | 4.5 |
| review_count | number | Number of reviews | 23 |

### Instructions

#### Step 1: Create Products Module File

1. Create directory: `src/lib/api/modules/`
2. Create file: `products.ts`
3. Import storeClient instance
4. Import TypeScript types from client
5. Set up module structure with comments

#### Step 2: Define TypeScript Interfaces

1. Create interface Product:
   - id: number
   - slug: string
   - name: string
   - description: string
   - short_description: string
   - price: number
   - sale_price: number | null
   - currency: string (default 'LKR')
   - in_stock: boolean
   - stock_quantity: number
   - sku: string
   - category: CategorySummary
   - images: ProductImage[]
   - variants: ProductVariant[]
   - rating: number
   - review_count: number
   - created_at: string
   - updated_at: string
   
2. Create interface ProductImage:
   - id: number
   - url: string
   - alt_text: string
   - is_primary: boolean
   - order: number
   
3. Create interface ProductVariant:
   - id: number
   - name: string
   - sku: string
   - price: number
   - in_stock: boolean
   - attributes: Record<string, string>
   
4. Create interface ProductReview:
   - id: number
   - user_name: string
   - rating: number (1-5)
   - title: string
   - comment: string
   - created_at: string
   - verified_purchase: boolean

5. Create interface ProductsListParams:
   - page?: number
   - page_size?: number
   - search?: string
   - category?: string
   - min_price?: number
   - max_price?: number
   - sort?: string
   - order?: 'asc' | 'desc'
   - in_stock?: boolean
   - featured?: boolean
   - on_sale?: boolean

#### Step 3: Implement Get Products List Function

1. Create async function getProducts(params):
   - Parameter: ProductsListParams object
   - Return: Promise<ApiResponse<Product[]>>
   
2. Build query parameters:
   - Convert params object to URLSearchParams
   - Handle undefined values (skip them)
   - Format boolean values as strings
   - Format price values with 2 decimals
   
3. Make GET request:
   - Endpoint: '/products'
   - Include query parameters
   - Use storeClient instance
   - Return response data
   
4. Handle response:
   - Extract products array
   - Extract pagination metadata
   - Return wrapped response
   - Include total count
   
5. Add error handling:
   - Catch and rethrow errors
   - Add context (function name)
   - Log errors in development

#### Step 4: Implement Get Single Product Function

1. Create async function getProduct(slug):
   - Parameter: product slug string
   - Return: Promise<Product>
   
2. Validate input:
   - Check slug is not empty
   - Trim whitespace
   - Convert to lowercase
   - Throw error if invalid
   
3. Make GET request:
   - Endpoint: `/products/${slug}`
   - No query parameters needed
   - Use storeClient instance
   - Return product data
   
4. Handle 404 errors:
   - Catch 404 specifically
   - Return null or throw NotFoundError
   - Show "Product not found" message

#### Step 5: Implement Get Product Variants Function

1. Create async function getProductVariants(productId):
   - Parameter: product ID number
   - Return: Promise<ProductVariant[]>
   
2. Make GET request:
   - Endpoint: `/products/${productId}/variants`
   - Use storeClient instance
   - Return variants array
   
3. Handle products without variants:
   - Return empty array if none
   - Don't treat as error
   - Log info in development

#### Step 6: Implement Get Product Reviews Function

1. Create async function getProductReviews(productId, params):
   - Parameter: product ID number
   - Parameter: pagination params (page, page_size)
   - Return: Promise<ApiResponse<ProductReview[]>>
   
2. Build query parameters:
   - page (default: 1)
   - page_size (default: 10)
   - sort: 'created_at' (newest first)
   
3. Make GET request:
   - Endpoint: `/products/${productId}/reviews`
   - Include query parameters
   - Return reviews with pagination
   
4. Calculate rating statistics:
   - Average rating
   - Total review count
   - Rating distribution (1-5 stars)

#### Step 7: Implement Search Products Function

1. Create async function searchProducts(query, params):
   - Parameter: search query string
   - Parameter: optional filters
   - Return: Promise<ApiResponse<Product[]>>
   
2. Build search parameters:
   - search: query string
   - Include other filters from params
   - Add highlighting option
   - Set relevance sorting
   
3. Make GET request:
   - Endpoint: '/products'
   - Include search parameter
   - Use same endpoint as list
   - Return filtered results
   
4. Handle empty results:
   - Return empty array
   - Include suggestions if available
   - Log search query for analytics

#### Step 8: Implement Product Caching Strategy

1. Create simple in-memory cache:
   - Map<string, CacheEntry> structure
   - CacheEntry: { data, timestamp }
   - TTL (Time To Live): 5 minutes
   
2. Implement cache getter:
   - Check if key exists in cache
   - Check if entry not expired
   - Return cached data if valid
   - Return null if expired/missing
   
3. Implement cache setter:
   - Store data with current timestamp
   - Set key as function-params combination
   - Limit cache size (max 100 entries)
   - Remove oldest entries when full
   
4. Add cache clearing:
   - Function to clear specific product
   - Function to clear all cache
   - Auto-clear on product update
   - Clear on logout/login

#### Step 9: Add Helper Functions

1. Create function formatPrice(price, currency):
   - Format number with 2 decimals
   - Add currency symbol (රු for LKR)
   - Add thousand separators
   - Return formatted string: "රු 185,000.00"
   
2. Create function isProductOnSale(product):
   - Check if sale_price exists
   - Check if sale_price < price
   - Return boolean
   
3. Create function calculateDiscount(product):
   - Calculate discount amount
   - Calculate discount percentage
   - Return object: { amount, percentage }
   
4. Create function getProductUrl(product):
   - Build URL: `/products/${slug}`
   - Return absolute or relative URL
   - Handle base URL from config

#### Step 10: Export Module Functions

1. Export all API functions:
   - getProducts
   - getProduct
   - getProductVariants
   - getProductReviews
   - searchProducts
   
2. Export helper functions:
   - formatPrice
   - isProductOnSale
   - calculateDiscount
   - getProductUrl
   
3. Export TypeScript interfaces:
   - Product
   - ProductImage
   - ProductVariant
   - ProductReview
   - ProductsListParams
   
4. Create default export object:
   - Group all functions
   - Allow named or default imports
   - Provide clean API

### Expected Outcome

Upon completion, you will have:

1. **Products Module** (`products.ts`):
   - Complete CRUD operations for products
   - Pagination support
   - Filtering and sorting
   - Search functionality
   - Variant and review retrieval

2. **TypeScript Interfaces**:
   - Product with Sri Lankan context (LKR)
   - ProductImage for gallery
   - ProductVariant for options
   - ProductReview for user feedback
   - Query parameters interface

3. **Helper Functions**:
   - Price formatting with රු symbol
   - Sale detection
   - Discount calculation
   - URL generation

4. **Caching**:
   - Simple in-memory cache
   - 5-minute TTL
   - Automatic expiry
   - Cache management functions

### Verification Checklist

```
□ products.ts file created in modules directory
□ Product interface defined with all fields
□ currency field defaults to 'LKR'
□ ProductImage interface defined
□ ProductVariant interface defined
□ ProductReview interface defined
□ ProductsListParams interface defined
□ getProducts() function implemented
□ Query parameters built correctly
□ Pagination metadata included
□ getProduct() function by slug implemented
□ Slug validation added
□ 404 errors handled gracefully
□ getProductVariants() function implemented
□ Empty variants return empty array
□ getProductReviews() function implemented
□ Reviews pagination works correctly
□ searchProducts() function implemented
□ Empty search results handled
□ In-memory cache implemented
□ Cache TTL set to 5 minutes
□ Cache size limited to 100 entries
□ formatPrice() formats with රු symbol
□ Thousand separators added (185,000.00)
□ isProductOnSale() checks sale_price
□ calculateDiscount() returns amount & percentage
□ getProductUrl() builds correct paths
□ All functions exported correctly
□ TypeScript interfaces exported
□ No TypeScript compilation errors
□ Imports work from components
□ Error handling consistent
□ Development logging added
```

---

## Task 52: Create Categories API Module

### Overview

Develop the Categories API module that provides methods for retrieving category listings, category hierarchies, single category details, and products within categories. The module implements category tree navigation, supports nested categories, handles category-based product filtering, and includes caching for improved performance.

**Complexity:** Medium  
**Estimated Lines:** 75-100  
**File Location:** `src/lib/api/modules/categories.ts`

### Dependencies

- **Task 47-50:** API client infrastructure
- **Task 51:** Products module for category products
- **Backend:** Categories API endpoints

### Category Hierarchy Structure

```
Category Tree Example:
──────────────────────

Electronics (root)
│
├── Mobile Phones
│   ├── Smartphones
│   │   ├── Android
│   │   └── iOS
│   └── Feature Phones
│
├── Computers
│   ├── Laptops
│   │   ├── Gaming Laptops
│   │   └── Business Laptops
│   ├── Desktops
│   └── Tablets
│
└── Accessories
    ├── Chargers
    ├── Cases
    └── Screen Protectors

Data Structure:
───────────────
{
  id: 1,
  name: "Electronics",
  slug: "electronics",
  parent: null,
  children: [
    {
      id: 2,
      name: "Mobile Phones",
      slug: "mobile-phones",
      parent: 1,
      children: [...]
    }
  ]
}
```

### API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | /categories | List all categories (flat or tree) |
| GET | /categories/:slug | Get single category details |
| GET | /categories/:slug/products | Get products in category |
| GET | /categories/tree | Get hierarchical category tree |
| GET | /categories/:slug/children | Get direct child categories |

### Instructions

#### Step 1: Create Categories Module File

1. Create file: `src/lib/api/modules/categories.ts`
2. Import storeClient instance
3. Import Product interface from products module
4. Import shared TypeScript types
5. Set up module structure

#### Step 2: Define TypeScript Interfaces

1. Create interface Category:
   - id: number
   - name: string
   - slug: string
   - description: string
   - parent_id: number | null
   - level: number (depth in tree)
   - order: number (display order)
   - image: string | null (category image URL)
   - product_count: number
   - is_active: boolean
   - children: Category[] (nested categories)
   - created_at: string
   - updated_at: string
   
2. Create interface CategorySummary (lightweight):
   - id: number
   - name: string
   - slug: string
   - parent_id: number | null
   - product_count: number
   
3. Create interface CategoryTree:
   - Same as Category but with enforced children
   - Represents hierarchical structure
   - Used for navigation menus

#### Step 3: Implement Get All Categories Function

1. Create async function getCategories(options):
   - Parameter: options object (flat: boolean, active_only: boolean)
   - Return: Promise<Category[]>
   
2. Build query parameters:
   - flat: return flat list vs tree
   - active_only: filter active categories
   - include_product_count: boolean
   
3. Make GET request:
   - Endpoint: '/categories'
   - Include query parameters
   - Use storeClient instance
   - Return categories array
   
4. Handle response format:
   - Backend may return flat or nested
   - Convert based on 'flat' parameter
   - Sort by order field

#### Step 4: Implement Get Category Tree Function

1. Create async function getCategoryTree():
   - No parameters needed
   - Return: Promise<CategoryTree[]>
   
2. Make GET request:
   - Endpoint: '/categories/tree' or '/categories?flat=false'
   - Use storeClient instance
   - Return nested category array
   
3. Build tree structure:
   - If backend returns flat, build tree locally
   - Group by parent_id
   - Recursively nest children
   - Sort by order field
   - Set level based on depth

#### Step 5: Implement Get Single Category Function

1. Create async function getCategory(slug):
   - Parameter: category slug string
   - Return: Promise<Category>
   
2. Validate input:
   - Check slug not empty
   - Trim and lowercase
   - Throw error if invalid
   
3. Make GET request:
   - Endpoint: `/categories/${slug}`
   - Use storeClient instance
   - Return category object
   
4. Include related data:
   - Parent category info
   - Direct children
   - Product count
   - Breadcrumb path

#### Step 6: Implement Get Category Products Function

1. Create async function getCategoryProducts(slug, params):
   - Parameter: category slug
   - Parameter: pagination/filter params
   - Return: Promise<ApiResponse<Product[]>>
   
2. Build query parameters:
   - page, page_size from params
   - sort, order from params
   - Other filters (price range, etc.)
   
3. Make GET request:
   - Endpoint: `/categories/${slug}/products`
   - Include query parameters
   - Return products with pagination
   
4. Option: Reuse products module:
   - Call getProducts() with category filter
   - Pass category slug in params
   - Simpler than separate endpoint

#### Step 7: Implement Category Helper Functions

1. Create function getCategoryPath(category, allCategories):
   - Parameter: category object
   - Parameter: all categories array
   - Return: Category[] (breadcrumb trail)
   - Logic:
     - Start with current category
     - Traverse up using parent_id
     - Build path array from root to current
     - Return ordered path
   
2. Create function getCategoryChildren(categoryId, allCategories):
   - Parameter: category ID
   - Parameter: all categories array
   - Return: Category[] (direct children)
   - Filter where parent_id === categoryId
   - Sort by order field
   
3. Create function getCategoryLevel(category, allCategories):
   - Calculate depth in hierarchy
   - Count ancestors to root
   - Return level number (0 for root)

#### Step 8: Implement Category Caching

1. Create cache structure:
   - Separate cache for categories vs products
   - Cache key: 'categories_tree' for full tree
   - Cache key: 'category_{slug}' for single
   - TTL: 10 minutes (categories change rarely)
   
2. Implement cache functions:
   - getCachedCategories()
   - setCachedCategories(data)
   - clearCategoryCache()
   
3. Use cache in get functions:
   - Check cache before API call
   - Return cached data if valid
   - Make API call if cache miss
   - Update cache with fresh data

#### Step 9: Implement Navigation Menu Builder

1. Create function buildNavigationMenu(categories):
   - Parameter: category tree array
   - Return: Navigation menu structure
   - Logic:
     - Filter only active categories
     - Limit to max 2 levels for menu
     - Format for UI component
     - Include product counts
   
2. Format for mega menu:
   - Group by root categories
   - Include featured subcategories
   - Add "View All" links
   - Include category images
   
3. Add helper data:
   - hasChildren boolean
   - isExpandable boolean
   - Full URL path

#### Step 10: Export Module Functions

1. Export API functions:
   - getCategories
   - getCategoryTree
   - getCategory
   - getCategoryProducts
   
2. Export helper functions:
   - getCategoryPath
   - getCategoryChildren
   - getCategoryLevel
   - buildNavigationMenu
   
3. Export TypeScript interfaces:
   - Category
   - CategorySummary
   - CategoryTree
   
4. Create default export:
   - Object with all functions
   - Allow default or named imports

### Expected Outcome

Upon completion, you will have:

1. **Categories Module** (`categories.ts`):
   - Retrieve all categories (flat/tree)
   - Get single category details
   - Get products by category
   - Build category tree structure
   - Navigate category hierarchy

2. **TypeScript Interfaces**:
   - Category with full details
   - CategorySummary for lightweight use
   - CategoryTree for navigation

3. **Helper Functions**:
   - Build breadcrumb paths
   - Get child categories
   - Calculate category levels
   - Build navigation menus

4. **Caching**:
   - 10-minute cache for categories
   - Separate cache keys per category
   - Cache invalidation on updates

### Verification Checklist

```
□ categories.ts file created in modules directory
□ Category interface defined with all fields
□ CategorySummary interface for lightweight use
□ CategoryTree interface for navigation
□ getCategories() function implemented
□ Supports flat and tree format
□ active_only filter works
□ getCategoryTree() builds hierarchy correctly
□ Parent-child relationships maintained
□ Sorting by order field works
□ getCategory() retrieves single category
□ Slug validation added
□ Parent and children included
□ getCategoryProducts() retrieves products
□ Pagination works for category products
□ getCategoryPath() builds breadcrumbs
□ Path goes from root to current
□ getCategoryChildren() filters correctly
□ getCategoryLevel() calculates depth
□ Category caching implemented
□ Cache TTL set to 10 minutes
□ Cache keys unique per category
□ buildNavigationMenu() formats correctly
□ Menu limits to 2 levels
□ Only active categories in menu
□ All functions exported
□ TypeScript interfaces exported
□ No compilation errors
□ Category tree structure correct
□ Nested categories display properly
```

---

## Task 53: Create Cart API Module

### Overview

Develop the Cart API module that manages shopping cart operations including adding items, updating quantities, removing items, applying coupons, and handling cart synchronization between guest and authenticated users. The module implements Sri Lankan currency (LKR) formatting, handles cart persistence, and provides cart calculation functions.

**Complexity:** High  
**Estimated Lines:** 150-200  
**File Location:** `src/lib/api/modules/cart.ts`

### Dependencies

- **Task 47-50:** API client with auth and error handling
- **Task 49:** Auth interceptor for user/guest handling
- **Backend:** Cart API endpoints

### Cart Architecture

```
Cart Flow:
──────────

┌──────────────┐         ┌──────────────┐
│  Guest User  │         │ Logged User  │
└──────┬───────┘         └──────┬───────┘
       │                        │
       ▼                        ▼
┌──────────────┐         ┌──────────────┐
│ Local Cart   │         │ Server Cart  │
│ (LocalStore) │         │ (Database)   │
└──────┬───────┘         └──────┬───────┘
       │                        │
       │   User Logs In         │
       └────────┬───────────────┘
                ▼
         ┌─────────────┐
         │ Merge Carts │
         └──────┬──────┘
                │
                ▼
         ┌─────────────┐
         │ Server Cart │
         │  (Unified)  │
         └─────────────┘

Cart Operations:
────────────────
1. Add Item → Update Quantity
2. Update Item → Recalculate Totals
3. Remove Item → Update Cart
4. Apply Coupon → Recalculate Discount
5. Clear Cart → Empty All Items
6. Sync Cart → Merge Guest + User
```

### Cart Data Structure

```typescript
Cart {
  id: string                    // Cart ID
  items: CartItem[]             // Cart items
  subtotal: number              // Subtotal (LKR)
  discount: number              // Discount amount (LKR)
  coupon: Coupon | null         // Applied coupon
  tax: number                   // Tax amount (LKR)
  shipping: number              // Shipping cost (LKR)
  total: number                 // Grand total (LKR)
  currency: 'LKR'               // Currency code
  item_count: number            // Total items
  created_at: string
  updated_at: string
}

CartItem {
  id: string
  product_id: number
  variant_id: number | null
  name: string
  slug: string
  price: number                 // Unit price (LKR)
  quantity: number
  subtotal: number              // price * quantity (LKR)
  image: string
  in_stock: boolean
  max_quantity: number
}
```

### Cart Calculations (Sri Lankan Context)

| Calculation | Formula | Example (LKR) |
|-------------|---------|---------------|
| **Item Subtotal** | Price × Quantity | 15,000 × 2 = 30,000 |
| **Cart Subtotal** | Sum(Item Subtotals) | 30,000 + 50,000 = 80,000 |
| **Discount** | Subtotal × (Coupon%) | 80,000 × 10% = 8,000 |
| **After Discount** | Subtotal - Discount | 80,000 - 8,000 = 72,000 |
| **Tax (VAT)** | After Discount × 0% | 0 (if applicable) |
| **Shipping** | Fixed or Calculated | 500 (within Colombo) |
| **Grand Total** | After Discount + Tax + Shipping | 72,000 + 0 + 500 = 72,500 |

### Instructions

#### Step 1: Create Cart Module File

1. Create file: `src/lib/api/modules/cart.ts`
2. Import storeClient instance
3. Import Product interface from products
4. Import auth utilities for guest handling
5. Set up module structure

#### Step 2: Define TypeScript Interfaces

1. Create interface Cart:
   - id: string
   - items: CartItem[]
   - subtotal: number (LKR)
   - discount: number (LKR)
   - coupon: Coupon | null
   - tax: number (LKR)
   - shipping: number (LKR)
   - total: number (LKR)
   - currency: 'LKR'
   - item_count: number
   - created_at: string
   - updated_at: string
   
2. Create interface CartItem:
   - id: string
   - product_id: number
   - variant_id: number | null
   - name: string
   - slug: string
   - price: number (LKR)
   - quantity: number
   - subtotal: number (LKR)
   - image: string
   - in_stock: boolean
   - max_quantity: number
   
3. Create interface Coupon:
   - code: string
   - discount_type: 'percentage' | 'fixed'
   - discount_value: number
   - min_purchase: number (LKR)
   - max_discount: number (LKR)
   - expiry_date: string
   
4. Create interface AddToCartParams:
   - product_id: number
   - variant_id?: number
   - quantity: number
   
5. Create interface UpdateCartItemParams:
   - quantity: number

#### Step 3: Implement Get Cart Function

1. Create async function getCart():
   - No parameters
   - Return: Promise<Cart>
   
2. Determine cart source:
   - Check if user authenticated
   - If authenticated: fetch from server
   - If guest: fetch from local storage
   
3. Make GET request (authenticated):
   - Endpoint: '/cart'
   - Use storeClient with auth token
   - Return cart object
   
4. Handle guest cart:
   - Read from localStorage key 'guest_cart'
   - Parse JSON data
   - Return cart object
   - Initialize empty cart if none exists
   
5. Calculate cart totals:
   - Sum item subtotals
   - Apply discount if coupon present
   - Add tax (if applicable)
   - Add shipping estimate
   - Return complete cart

#### Step 4: Implement Add to Cart Function

1. Create async function addToCart(params):
   - Parameter: AddToCartParams object
   - Return: Promise<Cart>
   
2. Validate input:
   - Check product_id is valid number
   - Check quantity > 0
   - Check quantity within limits
   - Throw error if invalid
   
3. Make POST request (authenticated):
   - Endpoint: '/cart/items'
   - Body: product_id, variant_id, quantity
   - Use storeClient with auth
   - Return updated cart
   
4. Handle guest cart:
   - Read current guest cart
   - Check if item already exists
   - If exists: increase quantity
   - If new: add to items array
   - Recalculate totals
   - Save to localStorage
   - Return updated cart
   
5. Handle errors:
   - Out of stock
   - Quantity exceeds max
   - Invalid product
   - Show user-friendly messages

#### Step 5: Implement Update Cart Item Function

1. Create async function updateCartItem(itemId, params):
   - Parameter: cart item ID
   - Parameter: UpdateCartItemParams
   - Return: Promise<Cart>
   
2. Validate quantity:
   - Check quantity >= 1
   - Check quantity <= max_quantity
   - If quantity = 0, suggest removeCartItem instead
   
3. Make PUT request (authenticated):
   - Endpoint: `/cart/items/${itemId}`
   - Body: { quantity }
   - Use storeClient
   - Return updated cart
   
4. Handle guest cart:
   - Find item in guest cart by itemId
   - Update quantity
   - Recalculate item subtotal
   - Recalculate cart totals
   - Save to localStorage
   - Return updated cart

#### Step 6: Implement Remove Cart Item Function

1. Create async function removeCartItem(itemId):
   - Parameter: cart item ID
   - Return: Promise<Cart>
   
2. Make DELETE request (authenticated):
   - Endpoint: `/cart/items/${itemId}`
   - Use storeClient
   - Return updated cart
   
3. Handle guest cart:
   - Filter out item with matching itemId
   - Recalculate cart totals
   - Save to localStorage
   - Return updated cart
   
4. Show confirmation:
   - Optional: confirm before delete
   - Show success message
   - Update UI immediately

#### Step 7: Implement Clear Cart Function

1. Create async function clearCart():
   - No parameters
   - Return: Promise<void>
   
2. Make DELETE request (authenticated):
   - Endpoint: '/cart'
   - Use storeClient
   - Return success status
   
3. Handle guest cart:
   - Remove 'guest_cart' from localStorage
   - Initialize empty cart
   - Return success
   
4. Clear cart state:
   - Update global cart state
   - Clear cart item count
   - Reset UI elements

#### Step 8: Implement Coupon Functions

1. Create async function applyCoupon(code):
   - Parameter: coupon code string
   - Return: Promise<Cart>
   
2. Validate coupon code:
   - Check code not empty
   - Trim whitespace
   - Convert to uppercase
   
3. Make POST request:
   - Endpoint: '/cart/coupon'
   - Body: { code }
   - Use storeClient
   - Return cart with applied discount
   
4. Handle coupon errors:
   - Invalid code
   - Expired coupon
   - Minimum purchase not met
   - Already used coupon
   - Show specific error messages
   
5. Create async function removeCoupon():
   - Make DELETE request to '/cart/coupon'
   - Return cart without discount
   - Recalculate totals

#### Step 9: Implement Cart Synchronization

1. Create async function syncCart():
   - Called when user logs in
   - Merge guest cart with user cart
   - Return: Promise<Cart>
   
2. Sync logic:
   - Get guest cart from localStorage
   - Get user cart from server
   - Merge items:
     - If item in both: sum quantities
     - If item only in guest: add to user cart
     - If item only in user: keep in cart
   
3. Make POST request:
   - Endpoint: '/cart/sync'
   - Body: { guest_cart_items }
   - Server performs merge
   - Return unified cart
   
4. Clean up:
   - Remove guest_cart from localStorage
   - Update global cart state
   - Show merge notification if items added

#### Step 10: Implement Cart Helper Functions

1. Create function calculateCartTotals(cart):
   - Calculate subtotal: sum(items.subtotal)
   - Calculate discount: based on coupon
   - Calculate tax: if applicable (usually 0 in Sri Lanka)
   - Calculate shipping: based on delivery address
   - Calculate total: subtotal - discount + tax + shipping
   - Return updated cart object
   
2. Create function formatCartPrice(amount):
   - Format with 2 decimals
   - Add thousand separators
   - Add LKR symbol: "රු 72,500.00"
   - Return formatted string
   
3. Create function getCartItemCount(cart):
   - Sum all item quantities
   - Return total item count
   
4. Create function isCartEmpty(cart):
   - Check if cart.items.length === 0
   - Return boolean
   
5. Create function validateCartItem(item):
   - Check in_stock status
   - Check quantity <= max_quantity
   - Return validation result

### Expected Outcome

Upon completion, you will have:

1. **Cart Module** (`cart.ts`):
   - Get current cart (user/guest)
   - Add items to cart
   - Update item quantities
   - Remove items from cart
   - Clear entire cart
   - Apply/remove coupons
   - Sync guest cart with user cart

2. **TypeScript Interfaces**:
   - Cart with LKR currency
   - CartItem with Sri Lankan pricing
   - Coupon with discount types
   - Request parameter interfaces

3. **Cart Calculations**:
   - Subtotal calculation
   - Discount application
   - Tax calculation (if needed)
   - Shipping cost inclusion
   - Grand total with LKR formatting

4. **Guest Cart Handling**:
   - LocalStorage persistence
   - Guest to user migration
   - Cart synchronization on login
   - Conflict resolution

### Verification Checklist

```
□ cart.ts file created in modules directory
□ Cart interface defined with all fields
□ currency field set to 'LKR'
□ CartItem interface defined
□ Coupon interface defined
□ AddToCartParams interface defined
□ UpdateCartItemParams interface defined
□ getCart() fetches user or guest cart
□ Guest cart reads from localStorage
□ Empty cart initialized for new guests
□ addToCart() adds items correctly
□ Existing items increment quantity
□ New items added to array
□ updateCartItem() updates quantity
□ Quantity validation (1 to max_quantity)
□ Item subtotal recalculated
□ removeCartItem() removes items
□ Cart totals recalculated after removal
□ clearCart() empties entire cart
□ applyCoupon() applies discount
□ Coupon validation implemented
□ Coupon error messages specific
□ removeCoupon() removes discount
□ syncCart() merges guest and user carts
□ Duplicate items have quantities summed
□ Guest cart cleared after sync
□ calculateCartTotals() sums correctly
□ Discount applied to subtotal
□ Shipping cost added
□ formatCartPrice() uses රු symbol
□ Thousand separators added (72,500.00)
□ getCartItemCount() sums quantities
□ isCartEmpty() checks length
□ validateCartItem() checks stock
□ All functions exported
□ TypeScript interfaces exported
□ No compilation errors
□ Cart persists in localStorage for guests
□ Cart syncs on login
```

---

## Summary

This document has provided comprehensive instructions for implementing the Store API Client infrastructure and core API modules (Products, Categories, Cart) for the Next.js webstore frontend.

### Completed Components

1. **Task 47 - Store API Client:**
   - Axios-based HTTP client with TypeScript
   - Singleton pattern for instance management
   - Request/response interceptor placeholders
   - Environment-based configuration
   - Default headers with Sri Lankan context

2. **Task 48 - Base URL Configuration:**
   - Multi-environment URL management
   - URL normalization and validation
   - Path prefix configuration (/api/v1/store)
   - Support for testing overrides

3. **Task 49 - Auth Interceptor:**
   - Automatic JWT token injection
   - Token expiration and refresh logic
   - Guest checkout support
   - 401 handling with retry
   - Token storage management

4. **Task 50 - Error Handler:**
   - Comprehensive error interception
   - User-friendly error messages
   - Retry logic with exponential backoff
   - Error logging and tracking
   - Notification system integration

5. **Task 51 - Products API Module:**
   - Product listing with pagination
   - Single product retrieval
   - Product variants and reviews
   - Search functionality
   - Price formatting with LKR

6. **Task 52 - Categories API Module:**
   - Category tree hierarchy
   - Category product listings
   - Navigation menu builder
   - Breadcrumb path generation
   - Category caching (10 min TTL)

7. **Task 53 - Cart API Module:**
   - Cart operations (CRUD)
   - Coupon application
   - Guest cart handling
   - Cart synchronization
   - LKR currency formatting

### Key Features Implemented

| Feature | Implementation | Sri Lankan Context |
|---------|----------------|-------------------|
| **Authentication** | JWT Bearer tokens | Guest checkout support |
| **Error Handling** | User-friendly messages | LKR in payment errors |
| **Currency** | LKR throughout | රු symbol formatting |
| **Caching** | Products (5 min), Categories (10 min) | Performance optimization |
| **Pagination** | page, page_size params | Standard REST pattern |
| **Guest Handling** | LocalStorage persistence | Cart sync on login |
| **Localization** | en-LK, Asia/Colombo | Sri Lankan context |

### Integration Points

The API client integrates with:
- **Environment Configuration** (Task 31): NEXT_PUBLIC_API_URL
- **Authentication System** (Phase-07): JWT token management
- **State Management** (Future): Cart and product state
- **UI Components** (Future): Product cards, cart widget
- **Django Backend** (/api/v1/store): All API endpoints

### File Structure Created

```
src/lib/api/
├── storeClient.ts              # Base Axios client (Task 47)
├── config.ts                   # URL configuration (Task 48)
├── interceptors/
│   ├── auth.ts                 # Auth interceptor (Task 49)
│   └── errors.ts               # Error handler (Task 50)
└── modules/
    ├── products.ts             # Products API (Task 51)
    ├── categories.ts           # Categories API (Task 52)
    └── cart.ts                 # Cart API (Task 53)
```

### Next Steps

Proceed to **Group-D Document 02 (Tasks 54-60)** for:
- Orders API Module
- Wishlist API Module
- User Account API Module
- Reviews API Module
- Extended API functionality
- Complete testing and verification

### Technical Metrics

- **Total Files Created:** 7 files
- **Total Lines of Code:** ~775-1,075 lines
- **TypeScript Interfaces:** 25+ interfaces
- **API Functions:** 30+ functions
- **Helper Functions:** 15+ utilities
- **Error Handling:** Comprehensive across all modules
- **Caching Strategy:** Multi-level with TTL
- **Sri Lankan Context:** Currency, locale, timezone throughout

### Quality Assurance

All tasks include:
- ✅ TypeScript type safety
- ✅ Error handling and validation
- ✅ Development logging
- ✅ Sri Lankan context (LKR, +94, en-LK)
- ✅ Comprehensive verification checklists
- ✅ Detailed step-by-step instructions
- ✅ No code snippets (instruction-only approach)

---

**Document Status:** Complete and ready for implementation  
**Next Document:** [Group-D Doc 02 - Tasks 54-60](02_Tasks-54-60_Extended-Modules-Verify.md)  
**Estimated Implementation Time:** 12-16 hours for all 7 tasks

