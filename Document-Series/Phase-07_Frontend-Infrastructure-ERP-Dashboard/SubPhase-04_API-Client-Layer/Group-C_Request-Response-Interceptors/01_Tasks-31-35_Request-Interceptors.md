# Tasks 31-35: Request Interceptors

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 04 - API Client Layer  
> **Group:** C - Request/Response Interceptors  
> **Document:** 01 of 02  
> **Tasks Covered:** 31, 32, 33, 34, 35

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-36-44_Response-Interceptors.md](02_Tasks-36-44_Response-Interceptors.md)

---

## Document Overview

This document covers the implementation of Axios request interceptors for the API client layer. Request interceptors add essential headers to every outgoing request, including authorization tokens, tenant identification, request tracing IDs, and timestamps for performance monitoring. These interceptors ensure consistent request formatting, enable multi-tenancy support, and facilitate distributed tracing and debugging.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 31 | Create Request Interceptor Module | Low | 15 min |
| 32 | Add Authorization Header | Low | 15 min |
| 33 | Add Tenant Header | Low | 15 min |
| 34 | Add Request ID Header | Low | 15 min |
| 35 | Add Request Timestamp | Low | 10 min |

---

## Task 31: Create Request Interceptor Module

### Overview
Create the request interceptor module that will intercept all outgoing Axios requests before they are sent to the server. This interceptor serves as the foundation for adding headers, modifying request configurations, logging requests, and implementing request-level middleware logic.

### Dependencies
- Task 14: Create Axios client instance
- Axios library must be installed and configured
- TypeScript types for Axios interceptors

### Instructions

1. **Locate the API client module**
   - Navigate to `frontend/services/api/` directory
   - Open or locate `apiClient.ts` file
   - This file contains the Axios instance created in Task 14

2. **Import required dependencies**
   - Import Axios types: `AxiosRequestConfig`, `InternalAxiosRequestConfig`
   - Import any UUID generation library if not already available
   - Import auth store or service for token access
   - Import tenant store or service for tenant ID access

3. **Define request interceptor function**
   - Create a named function for request interception
   - Name it descriptively (e.g., `requestInterceptor`)
   - Accept request config as parameter
   - Return modified request config
   - Use proper TypeScript typing

4. **Register request interceptor**
   - Call `apiClient.interceptors.request.use()`
   - Pass request interceptor function as first argument
   - Pass error handler function as second argument
   - Store interceptor ID if removal is needed later

5. **Create request error handler**
   - Define separate function for request errors
   - Handle cases where request preparation fails
   - Log error details for debugging
   - Return rejected promise with error

6. **Add request logging (development)**
   - Log outgoing request method and URL
   - Log request headers (sanitize sensitive data)
   - Only enable in development environment
   - Use conditional logging based on environment variable

7. **Handle edge cases**
   - Check if request config exists
   - Ensure headers object is initialized
   - Handle missing or invalid configurations
   - Provide fallback values where appropriate

### Request Interceptor Flow

```
┌─────────────────────────────────────────┐
│     Application Makes API Request      │
└──────────────────┬──────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────┐
│      Axios Request Interceptor          │
│  (Registered in apiClient.ts)           │
└──────────────────┬──────────────────────┘
                   │
      ┌────────────┴────────────┐
      │                         │
      ▼                         ▼
┌─────────────┐          ┌─────────────────┐
│   Success   │          │  Request Error  │
│   Handler   │          │    Handler      │
└──────┬──────┘          └────────┬────────┘
       │                          │
       ▼                          ▼
┌────────────────────┐    ┌─────────────────┐
│  Modify Request    │    │   Log Error     │
│  Add Headers       │    │  Reject Promise │
│  Return Config     │    └─────────────────┘
└─────────┬──────────┘
          │
          ▼
┌─────────────────────────────────────────┐
│    Request Sent to Server               │
└─────────────────────────────────────────┘
```

### Interceptor Registration Pattern

```
Request Flow:
-----------
Application Request → Interceptor Chain → Modified Request → Server
                           ↓
                    ┌──────────────┐
                    │ Interceptor 1│ (Authorization)
                    └──────┬───────┘
                           │
                    ┌──────────────┐
                    │ Interceptor 2│ (Tenant ID)
                    └──────┬───────┘
                           │
                    ┌──────────────┐
                    │ Interceptor 3│ (Request ID)
                    └──────┬───────┘
                           │
                    ┌──────────────┐
                    │ Interceptor 4│ (Timestamp)
                    └──────────────┘
```

### Interceptor Function Structure

| Component | Purpose | Return Type |
|-----------|---------|-------------|
| Request Handler | Modifies outgoing request config | `InternalAxiosRequestConfig` |
| Error Handler | Handles request preparation errors | `Promise<never>` |
| Registration | Attaches interceptor to Axios instance | `number` (interceptor ID) |

### Expected Outcome
- Request interceptor function created and registered
- Foundation for adding request headers
- Request logging in development mode
- Error handling for failed request preparation
- Clean separation of concerns

### Verification Checklist
- [ ] Request interceptor function defined
- [ ] Interceptor registered with `apiClient.interceptors.request.use()`
- [ ] Request error handler implemented
- [ ] Development logging added
- [ ] TypeScript types properly applied
- [ ] Edge cases handled (missing config, headers)
- [ ] No TypeScript compilation errors

---

## Task 32: Add Authorization Header

### Overview
Implement logic to add the Authorization header with Bearer token to all authenticated API requests. This header contains the JWT access token required by the backend for user authentication and authorization. The token is retrieved from the authentication store and included in the format "Bearer {token}".

### Dependencies
- Task 31: Create Request Interceptor Module
- Task 16: Implement token storage in state management
- Authentication store with token getter
- Valid access token available

### Instructions

1. **Import authentication dependencies**
   - Import authentication store or service
   - Import token getter function or hook
   - Import token type definitions if using TypeScript
   - Ensure access to current user's access token

2. **Retrieve access token**
   - Call token getter from auth store
   - Handle case where token is null or undefined
   - Determine if request requires authentication
   - Check token expiration if available

3. **Add Authorization header conditionally**
   - Check if access token exists
   - Only add header if token is present
   - Use Bearer token scheme
   - Format: "Bearer {accessToken}"

4. **Initialize headers object**
   - Ensure `request.headers` object exists
   - Create headers object if not present
   - Avoid overwriting existing headers
   - Maintain header case sensitivity

5. **Set Authorization header**
   - Set `Authorization` header key
   - Concatenate "Bearer " + token value
   - Ensure no extra whitespace
   - Preserve other existing headers

6. **Handle public endpoints**
   - Identify endpoints that don't require authentication
   - Skip Authorization header for public routes
   - Consider adding request config flag (e.g., `skipAuth`)
   - Document which endpoints are public

7. **Handle missing token scenarios**
   - Determine if request should proceed without token
   - Log warning if token expected but missing
   - Consider redirecting to login for protected routes
   - Return modified config regardless

8. **Add token validation (optional)**
   - Check if token is expired
   - Refresh token if expiring soon
   - Validate token format (JWT structure)
   - Handle invalid token cases

### Authorization Header Flow

```
┌─────────────────────────────────────────┐
│    Request Interceptor Triggered        │
└──────────────────┬──────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────┐
│   Retrieve Access Token from Store      │
└──────────────────┬──────────────────────┘
                   │
        ┌──────────┴──────────┐
        │                     │
        ▼                     ▼
   ┌─────────┐          ┌──────────┐
   │  Token  │          │   No     │
   │ Exists? │          │  Token   │
   └────┬────┘          └─────┬────┘
        │                     │
    YES │                 NO  │
        │                     │
        ▼                     ▼
┌────────────────────┐  ┌────────────────┐
│  Check if Public   │  │ Skip Auth      │
│  Endpoint          │  │ Header         │
└─────────┬──────────┘  └────────┬───────┘
          │                      │
  ┌───────┴────────┐            │
  │                │            │
  ▼                ▼            │
┌──────┐      ┌─────────┐      │
│Public│      │Protected│      │
└──┬───┘      └────┬────┘      │
   │               │            │
   │ Skip          │ Add        │
   │               │            │
   └───────────────┴────────────┘
                   │
                   ▼
┌─────────────────────────────────────────┐
│  Set Authorization: Bearer {token}      │
└──────────────────┬──────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────┐
│      Return Modified Request Config     │
└─────────────────────────────────────────┘
```

### Authorization Header Format

| Component | Value | Example |
|-----------|-------|---------|
| Header Name | Authorization | `Authorization` |
| Auth Scheme | Bearer | `Bearer` |
| Token | JWT access token | `eyJhbGciOiJIUzI1NiIs...` |
| Full Header | Bearer {token} | `Bearer eyJhbGciOiJIUzI1NiIs...` |

### Token Retrieval Patterns

#### Option 1: Zustand Store
- Access token from authentication store
- Use getter function or selector
- Direct property access if available
- Example: `useAuthStore.getState().accessToken`

#### Option 2: React Context
- Consume authentication context
- Access token from context value
- Use context provider's getter
- May require hook for component access

#### Option 3: Local Storage (Fallback)
- Read token directly from localStorage
- Use consistent storage key
- Handle JSON parsing if needed
- Less preferred due to direct storage access

### Public vs Protected Endpoints

| Endpoint Type | Requires Token | Example Endpoints |
|---------------|----------------|-------------------|
| Public | No | `/auth/login`, `/auth/register`, `/health` |
| Protected | Yes | `/api/products`, `/api/sales`, `/api/users` |
| Optional Auth | Maybe | `/api/public-products` (enhanced with auth) |

### Token Validation Considerations

- **Token Format:** Validate JWT structure (header.payload.signature)
- **Token Expiration:** Check `exp` claim if token is decoded
- **Token Refresh:** Trigger refresh if token expiring within threshold
- **Token Invalidation:** Handle revoked or blacklisted tokens

### Expected Outcome
- Authorization header added to authenticated requests
- Bearer token format correctly applied
- Public endpoints skip authorization
- Missing token scenarios handled gracefully
- Token validation logic (optional) implemented

### Verification Checklist
- [ ] Access token retrieved from auth store
- [ ] Authorization header added when token exists
- [ ] Header format is "Bearer {token}"
- [ ] Public endpoints skip authorization header
- [ ] Missing token cases handled
- [ ] No errors when token is undefined
- [ ] Existing headers preserved
- [ ] Token validation added (if applicable)

---

## Task 33: Add Tenant Header

### Overview
Implement logic to add the X-Tenant-ID header to all API requests for multi-tenancy support. This header identifies which tenant's data should be accessed on the backend, enabling proper tenant isolation and data segregation. The tenant ID is retrieved from the current user's session or tenant context.

### Dependencies
- Task 31: Create Request Interceptor Module
- Multi-tenant architecture implemented
- Tenant context or store available
- User authenticated and assigned to tenant

### Instructions

1. **Import tenant dependencies**
   - Import tenant store or context
   - Import tenant ID getter function
   - Import user store if tenant is user-dependent
   - Import tenant type definitions

2. **Retrieve current tenant ID**
   - Access tenant context or store
   - Get tenant ID from current user's session
   - Handle case where tenant ID is not set
   - Determine if request requires tenant header

3. **Add X-Tenant-ID header**
   - Set custom header `X-Tenant-ID`
   - Use current tenant ID as value
   - Convert tenant ID to string if necessary
   - Ensure header is set for all tenant-scoped requests

4. **Handle multi-tenant scenarios**
   - Support switching between tenants (if applicable)
   - Update header when tenant changes
   - Validate tenant ID format before setting
   - Handle invalid or missing tenant IDs

5. **Identify tenant-scoped endpoints**
   - Determine which endpoints require tenant ID
   - Skip header for non-tenant-scoped routes
   - Consider adding request config flag (e.g., `skipTenant`)
   - Document tenant-scoped vs global endpoints

6. **Handle tenant-less users**
   - Identify users without tenant assignment
   - Determine if request should proceed
   - Log warning if tenant expected but missing
   - Consider defaulting to system tenant

7. **Support tenant override (optional)**
   - Allow manual tenant ID override via request config
   - Useful for admin operations across tenants
   - Validate override permissions
   - Prioritize override over default tenant

8. **Add tenant validation**
   - Verify tenant ID format (UUID, integer, etc.)
   - Check if tenant is active
   - Handle suspended or deleted tenants
   - Log tenant information for debugging

### Tenant Header Flow

```
┌─────────────────────────────────────────┐
│    Request Interceptor Triggered        │
└──────────────────┬──────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────┐
│   Retrieve Tenant ID from Context       │
└──────────────────┬──────────────────────┘
                   │
        ┌──────────┴──────────┐
        │                     │
        ▼                     ▼
   ┌─────────┐          ┌──────────┐
   │ Tenant  │          │   No     │
   │   ID    │          │ Tenant   │
   │ Exists? │          │   ID     │
   └────┬────┘          └─────┬────┘
        │                     │
    YES │                 NO  │
        │                     │
        ▼                     ▼
┌────────────────────┐  ┌────────────────┐
│  Check if Tenant   │  │  Skip Tenant   │
│  Required          │  │  Header        │
└─────────┬──────────┘  └────────┬───────┘
          │                      │
  ┌───────┴────────┐            │
  │                │            │
  ▼                ▼            │
┌──────┐      ┌─────────┐      │
│Global│      │ Tenant  │      │
│Route │      │ Scoped  │      │
└──┬───┘      └────┬────┘      │
   │               │            │
   │ Skip          │ Add        │
   │               │            │
   └───────────────┴────────────┘
                   │
                   ▼
┌─────────────────────────────────────────┐
│    Set X-Tenant-ID: {tenantId}          │
└──────────────────┬──────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────┐
│      Return Modified Request Config     │
└─────────────────────────────────────────┘
```

### Tenant Header Format

| Component | Value | Example |
|-----------|-------|---------|
| Header Name | X-Tenant-ID | `X-Tenant-ID` |
| Value Type | String (UUID or ID) | `550e8400-e29b-41d4-a716-446655440000` |
| Alternative | Numeric ID | `12345` |
| Alternative | Slug | `acme-corp` |

### Multi-Tenancy Architecture

```
┌──────────────────────────────────────────────┐
│              Frontend Application            │
│  ┌────────────────────────────────────────┐  │
│  │      Tenant Context / Store            │  │
│  │  - Current Tenant ID                   │  │
│  │  - Tenant Name                         │  │
│  │  - Tenant Settings                     │  │
│  └────────────────┬───────────────────────┘  │
└───────────────────┼──────────────────────────┘
                    │
                    │ X-Tenant-ID Header
                    ▼
┌──────────────────────────────────────────────┐
│              Backend API Server              │
│  ┌────────────────────────────────────────┐  │
│  │     Tenant Middleware                  │  │
│  │  - Extract X-Tenant-ID                 │  │
│  │  - Validate Tenant                     │  │
│  │  - Set Tenant Context                  │  │
│  └────────────────┬───────────────────────┘  │
│                   │                          │
│  ┌────────────────▼───────────────────────┐  │
│  │     Database Router                    │  │
│  │  - Route to Tenant Schema              │  │
│  │  - Apply Tenant Filters                │  │
│  └────────────────────────────────────────┘  │
└──────────────────────────────────────────────┘
```

### Tenant Retrieval Strategies

#### Strategy 1: User-Based Tenant
- Tenant ID stored with user profile
- Retrieved from authentication state
- Single tenant per user (most common)
- User switches require re-authentication

#### Strategy 2: Explicit Tenant Selection
- User selects tenant from dropdown
- Multiple tenants per user possible
- Tenant ID stored in separate context
- Tenant switching without re-auth

#### Strategy 3: Domain-Based Tenant
- Tenant determined by subdomain
- Example: `tenant1.app.com`, `tenant2.app.com`
- Tenant ID resolved from hostname
- Less flexible but secure

#### Strategy 4: Admin Override
- Admin users can impersonate tenants
- Temporary tenant override
- Requires permission validation
- Audit logging recommended

### Global vs Tenant-Scoped Endpoints

| Endpoint Type | Requires Tenant | Example Endpoints |
|---------------|-----------------|-------------------|
| Global | No | `/auth/login`, `/tenants`, `/system/health` |
| Tenant-Scoped | Yes | `/api/products`, `/api/sales`, `/api/inventory` |
| Shared Resources | Optional | `/api/countries`, `/api/currencies` |

### Tenant ID Formats

| Format | Example | Use Case |
|--------|---------|----------|
| UUID | `550e8400-e29b-41d4-a716-446655440000` | Unique, secure, distributed |
| Integer | `12345` | Simple, sequential |
| Slug | `acme-corp` | Human-readable, URL-friendly |
| Composite | `tenant_12345` | Namespaced, self-describing |

### Expected Outcome
- X-Tenant-ID header added to tenant-scoped requests
- Tenant ID correctly retrieved from context
- Global endpoints skip tenant header
- Missing tenant scenarios handled
- Tenant validation logic implemented

### Verification Checklist
- [ ] Tenant ID retrieved from context/store
- [ ] X-Tenant-ID header added when tenant exists
- [ ] Header value is correct format (UUID, ID, etc.)
- [ ] Global endpoints skip tenant header
- [ ] Missing tenant cases handled
- [ ] Tenant switching updates header
- [ ] Admin override supported (if applicable)
- [ ] Tenant validation added

---

## Task 34: Add Request ID Header

### Overview
Implement logic to add the X-Request-ID header to all API requests for distributed tracing and debugging. This unique identifier allows tracking a request through the entire system, from frontend to backend, through multiple services, and into logs. Request IDs enable correlation of logs, error tracking, and performance monitoring across distributed systems.

### Dependencies
- Task 31: Create Request Interceptor Module
- UUID generation library (crypto.randomUUID() or uuid package)
- Logging infrastructure for request correlation

### Instructions

1. **Import UUID generation library**
   - Use browser's `crypto.randomUUID()` if available
   - Import `uuid` package as fallback (e.g., `v4` from `uuid`)
   - Check browser compatibility
   - Import TypeScript types if needed

2. **Generate unique request ID**
   - Create new UUID for each request
   - Use UUID v4 format (random)
   - Ensure uniqueness across all requests
   - Generate ID at interceptor execution time

3. **Add X-Request-ID header**
   - Set custom header `X-Request-ID`
   - Use generated UUID as value
   - Ensure header is set for all requests
   - Include in both authenticated and public requests

4. **Handle existing request IDs**
   - Check if request already has X-Request-ID
   - Preserve existing ID if present
   - Only generate new ID if missing
   - Support request ID propagation in chained calls

5. **Support custom request IDs**
   - Allow manual request ID via request config
   - Useful for request replay or testing
   - Prioritize custom ID over generated ID
   - Document custom ID usage

6. **Store request ID for logging**
   - Attach request ID to request config metadata
   - Make accessible for error handlers
   - Include in client-side logs
   - Enable correlation with backend logs

7. **Implement request ID logging**
   - Log request ID with every request
   - Include in development console logs
   - Send to analytics or monitoring service
   - Log format: `[REQUEST_ID: ${requestId}] ${method} ${url}`

8. **Handle UUID generation errors**
   - Catch errors from UUID library
   - Fallback to timestamp-based ID if needed
   - Log warning if UUID generation fails
   - Ensure interceptor doesn't break on error

### Request ID Flow

```
┌─────────────────────────────────────────┐
│    Request Interceptor Triggered        │
└──────────────────┬──────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────┐
│   Check for Existing X-Request-ID       │
└──────────────────┬──────────────────────┘
                   │
        ┌──────────┴──────────┐
        │                     │
        ▼                     ▼
   ┌─────────┐          ┌──────────┐
   │   ID    │          │   No     │
   │ Exists? │          │   ID     │
   └────┬────┘          └─────┬────┘
        │                     │
    YES │                 NO  │
        │                     │
        ▼                     ▼
┌────────────────────┐  ┌────────────────┐
│  Preserve Existing │  │  Generate New  │
│  Request ID        │  │  UUID v4       │
└─────────┬──────────┘  └────────┬───────┘
          │                      │
          └──────────┬───────────┘
                     │
                     ▼
┌─────────────────────────────────────────┐
│    Set X-Request-ID: {uuid}             │
└──────────────────┬──────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────┐
│   Store Request ID in Config Metadata   │
└──────────────────┬──────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────┐
│      Log Request ID (Development)       │
└──────────────────┬──────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────┐
│      Return Modified Request Config     │
└─────────────────────────────────────────┘
```

### Request ID Header Format

| Component | Value | Example |
|-----------|-------|---------|
| Header Name | X-Request-ID | `X-Request-ID` |
| Value Format | UUID v4 | `f47ac10b-58cc-4372-a567-0e02b2c3d479` |
| Alternative | Custom format | `req_1706198400_abc123` |

### UUID Generation Methods

#### Method 1: Native crypto.randomUUID()
- Browser native API (modern browsers)
- No external dependencies
- Best performance
- May require polyfill for older browsers

```typescript
Browser Support: Chrome 92+, Firefox 95+, Safari 15.4+
Fallback Required: Yes (for IE, older browsers)
```

#### Method 2: uuid Package
- NPM package: `uuid`
- Cross-browser compatible
- Multiple UUID versions supported
- Larger bundle size

```typescript
Import: import { v4 as uuidv4 } from 'uuid'
Size: ~5KB minified
Compatibility: All browsers
```

#### Method 3: Custom ID Generator (Fallback)
- Timestamp + random string
- No UUID library needed
- Less unique but functional
- Example: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

### Distributed Tracing Flow

```
Frontend                Backend API           Database          External Service
   │                        │                     │                    │
   │  X-Request-ID:         │                     │                    │
   │  f47ac10b-58cc-...     │                     │                    │
   ├───────────────────────>│                     │                    │
   │                        │  Log: Request ID    │                    │
   │                        │  f47ac10b-58cc-...  │                    │
   │                        │                     │                    │
   │                        ├────────────────────>│                    │
   │                        │  (with Request ID)  │                    │
   │                        │                     │                    │
   │                        │                     │  Log: Query with   │
   │                        │                     │  f47ac10b-58cc-... │
   │                        │                     │                    │
   │                        ├──────────────────────────────────────────>│
   │                        │         X-Request-ID: f47ac10b-58cc-...  │
   │                        │                     │                    │
   │                        │                     │       Log: External│
   │                        │                     │       Request with │
   │                        │                     │       Request ID   │
   │                        │<──────────────────────────────────────────│
   │                        │                     │                    │
   │<───────────────────────┤                     │                    │
   │  Response with         │                     │                    │
   │  X-Request-ID echo     │                     │                    │
```

### Request ID Use Cases

| Use Case | Benefit | Example |
|----------|---------|---------|
| Error Tracking | Correlate frontend and backend errors | User reports error, provide Request ID |
| Performance Monitoring | Track request duration across services | Identify slow requests by ID |
| Debugging | Trace request through entire system | Search logs by Request ID |
| Load Testing | Identify specific test requests | Tag load test requests |
| API Rate Limiting | Track request patterns per user | Count requests by ID pattern |

### Request ID Storage and Propagation

#### Storage Locations
- **Request Config:** `config.headers['X-Request-ID']`
- **Metadata:** `config.metadata.requestId`
- **Log Context:** Global logger context
- **Error Objects:** Attach to thrown errors

#### Propagation Strategy
- **Nested Requests:** Preserve parent Request ID
- **Chained Calls:** Create child Request IDs (e.g., `parent-child`)
- **Retry Attempts:** Keep same Request ID for retries
- **Response Echo:** Backend should return Request ID in response

### Expected Outcome
- X-Request-ID header added to all requests
- Unique UUID generated per request
- Request ID logged in development
- Request ID stored in config metadata
- Support for custom request IDs
- Error handling for UUID generation

### Verification Checklist
- [ ] UUID generation library imported
- [ ] X-Request-ID header added to all requests
- [ ] Unique UUID v4 generated per request
- [ ] Existing request IDs preserved
- [ ] Custom request IDs supported
- [ ] Request ID logged in development
- [ ] Request ID stored in config metadata
- [ ] Error handling for UUID generation failures
- [ ] Browser compatibility verified

---

## Task 35: Add Request Timestamp

### Overview
Implement logic to add request timestamp metadata to outgoing requests for performance logging and monitoring. While not sent as a header, the timestamp is stored in the request config and used later in response interceptors to calculate request duration. This enables performance tracking, slow request identification, and latency analysis.

### Dependencies
- Task 31: Create Request Interceptor Module
- Response interceptor for duration calculation (Task 44)
- Date/time utilities for timestamp handling

### Instructions

1. **Determine timestamp storage approach**
   - Store timestamp in request config metadata
   - Avoid sending as header (not needed by backend)
   - Use high-resolution timestamp if available
   - Consider using `performance.now()` for precision

2. **Capture request start time**
   - Record timestamp when interceptor executes
   - Use `Date.now()` for absolute timestamp
   - Use `performance.now()` for duration measurement
   - Store both if needed for different purposes

3. **Create metadata object**
   - Initialize `config.metadata` if not exists
   - Avoid overwriting existing metadata
   - Store timestamp with descriptive key
   - Example: `config.metadata.requestStartTime`

4. **Store high-resolution timestamp**
   - Use `performance.now()` for precise duration
   - Measure in milliseconds with decimal precision
   - Check browser support and fallback
   - Store as `config.metadata.startPerformance`

5. **Store absolute timestamp**
   - Use `Date.now()` or `new Date()`
   - Useful for logging and debugging
   - Correlate with server timestamps
   - Store as `config.metadata.requestTimestamp`

6. **Add timestamp to request config**
   - Set multiple timestamp types as needed
   - Ensure metadata object structure
   - Make timestamps accessible to response interceptor
   - Don't interfere with other metadata

7. **Support timestamp override**
   - Allow custom timestamp via config (for testing)
   - Prioritize custom timestamp if provided
   - Useful for request replay scenarios
   - Document override mechanism

8. **Handle timestamp errors**
   - Catch errors from timestamp generation
   - Fallback to alternative method
   - Ensure interceptor doesn't break
   - Log warning if timestamp fails

### Request Timestamp Flow

```
┌─────────────────────────────────────────┐
│    Request Interceptor Triggered        │
└──────────────────┬──────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────┐
│   Check if Metadata Exists              │
└──────────────────┬──────────────────────┘
                   │
        ┌──────────┴──────────┐
        │                     │
        ▼                     ▼
   ┌─────────┐          ┌──────────┐
   │Metadata │          │   No     │
   │ Exists? │          │Metadata  │
   └────┬────┘          └─────┬────┘
        │                     │
    YES │                 NO  │
        │                     │
        ▼                     ▼
┌────────────────────┐  ┌────────────────┐
│  Preserve Existing │  │  Create New    │
│  Metadata          │  │  Metadata {}   │
└─────────┬──────────┘  └────────┬───────┘
          │                      │
          └──────────┬───────────┘
                     │
                     ▼
┌─────────────────────────────────────────┐
│   Capture Timestamp: performance.now()  │
└──────────────────┬──────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────┐
│   Capture Absolute Time: Date.now()     │
└──────────────────┬──────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────┐
│   Store in config.metadata              │
│   - startPerformance                    │
│   - requestTimestamp                    │
└──────────────────┬──────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────┐
│      Return Modified Request Config     │
└──────────────────┬──────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────┐
│   Request Sent to Server                │
└──────────────────┬──────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────┐
│   Response Interceptor (Task 44)        │
│   - Calculate Duration                  │
│   - Log Performance                     │
└─────────────────────────────────────────┘
```

### Timestamp Storage Structure

| Property | Type | Purpose | Example |
|----------|------|---------|---------|
| `requestTimestamp` | `number` | Absolute time (Unix epoch) | `1706198400000` |
| `startPerformance` | `number` | High-res timer for duration | `123456.789` |
| `requestDate` | `Date` | Date object (optional) | `new Date('2025-01-25')` |
| `requestId` | `string` | Request ID (from Task 34) | `f47ac10b-58cc-...` |

### Metadata Object Structure

```typescript
Request Config Metadata:
{
  metadata: {
    requestId: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    requestTimestamp: 1706198400000,
    startPerformance: 123456.789,
    tenantId: '550e8400-e29b-41d4-a716-446655440000',
    // ... other metadata
  }
}
```

### Performance API vs Date API

| Method | Precision | Use Case | Browser Support |
|--------|-----------|----------|-----------------|
| `performance.now()` | Microseconds | Duration measurement | Chrome 20+, Firefox 15+, Safari 8+ |
| `Date.now()` | Milliseconds | Absolute timestamp | All browsers |
| `new Date()` | Milliseconds | Date object, formatting | All browsers |

### Performance Timing Flow

```
Request Flow with Timing:
-------------------------

1. Request Interceptor
   ├─> Capture: performance.now() = 123456.789
   ├─> Store in config.metadata.startPerformance
   └─> Send request

2. Network Request
   ├─> DNS Lookup
   ├─> TCP Connection
   ├─> Request Sent
   ├─> Waiting (Server Processing)
   └─> Response Received

3. Response Interceptor (Task 44)
   ├─> Capture: performance.now() = 123789.456
   ├─> Calculate: duration = 123789.456 - 123456.789 = 332.667ms
   └─> Log performance metrics
```

### Duration Calculation Example

```typescript
Request Interceptor (Task 35):
  startPerformance = performance.now() // 123456.789

Response Interceptor (Task 44):
  endPerformance = performance.now()   // 123789.456
  duration = endPerformance - startPerformance
  // duration = 332.667 milliseconds
  
  console.log(`Request completed in ${duration.toFixed(2)}ms`)
  // Output: "Request completed in 332.67ms"
```

### Performance Monitoring Use Cases

| Use Case | Metric | Threshold Example |
|----------|--------|-------------------|
| Slow Request Detection | Duration > threshold | > 1000ms = SLOW |
| API Performance Tracking | Average duration | Track trends over time |
| Network Issue Detection | Duration variance | High variance = network issues |
| Cache Hit Analysis | Fast vs slow requests | < 100ms = likely cached |
| Load Testing | Request throughput | Requests per second |

### Performance Logging Strategy

#### Development Mode
- Log every request duration
- Console output with color coding
- Show slow requests prominently
- Include full request details

#### Production Mode
- Log only slow requests (> threshold)
- Send metrics to analytics service
- Aggregate performance data
- Alert on performance degradation

#### Performance Thresholds

| Category | Duration | Action |
|----------|----------|--------|
| Fast | < 100ms | No logging (or info level) |
| Normal | 100-500ms | Info level logging |
| Slow | 500-1000ms | Warning level logging |
| Very Slow | > 1000ms | Error level logging + alert |

### Expected Outcome
- Request timestamp captured in interceptor
- High-resolution timestamp for duration measurement
- Absolute timestamp for logging
- Metadata object created and populated
- Foundation for performance monitoring
- No headers sent (internal use only)

### Verification Checklist
- [ ] `performance.now()` captured at request start
- [ ] `Date.now()` captured for absolute timestamp
- [ ] Timestamps stored in `config.metadata`
- [ ] Metadata object initialized properly
- [ ] Existing metadata preserved
- [ ] Custom timestamp override supported
- [ ] Error handling for timestamp failures
- [ ] Browser compatibility verified
- [ ] No timestamp headers sent to server

---

## Summary and Next Steps

### Tasks Completed
This document covered the implementation of request interceptors for the API client layer:

| Task # | Task Name | Key Outcome |
|--------|-----------|-------------|
| 31 | Create Request Interceptor Module | Foundation for request modification |
| 32 | Add Authorization Header | Bearer token authentication |
| 33 | Add Tenant Header | Multi-tenancy support |
| 34 | Add Request ID Header | Distributed tracing |
| 35 | Add Request Timestamp | Performance monitoring foundation |

### Request Headers Summary

| Header | Format | Purpose | Required For |
|--------|--------|---------|--------------|
| Authorization | `Bearer {token}` | Authentication | Protected endpoints |
| X-Tenant-ID | `{tenantId}` | Multi-tenancy | Tenant-scoped endpoints |
| X-Request-ID | `{uuid}` | Request tracing | All requests |

### Metadata Summary

| Metadata Field | Type | Purpose |
|----------------|------|---------|
| `requestId` | `string` | Request correlation |
| `requestTimestamp` | `number` | Absolute time |
| `startPerformance` | `number` | Duration calculation |
| `tenantId` | `string` | Tenant context |

### Testing Recommendations

1. **Authorization Testing**
   - Test with valid token
   - Test with expired token
   - Test with missing token
   - Test public endpoints without token

2. **Multi-Tenancy Testing**
   - Test with different tenant IDs
   - Test tenant switching
   - Test global endpoints
   - Test missing tenant scenarios

3. **Request ID Testing**
   - Verify unique IDs generated
   - Test request ID propagation
   - Test custom request IDs
   - Verify ID in logs

4. **Performance Testing**
   - Verify timestamps captured
   - Test duration calculation
   - Test high-frequency requests
   - Verify metadata structure

### Integration Points

The request interceptors integrate with:
- **Authentication Store:** Provides access tokens
- **Tenant Context:** Provides tenant identification
- **Response Interceptors (Task 36-44):** Consume request metadata
- **Error Handling:** Receives request context for errors
- **Logging System:** Uses request ID for correlation

### Next Document

Continue to [02_Tasks-36-44_Response-Interceptors.md](02_Tasks-36-44_Response-Interceptors.md) to implement:
- Response interceptor module
- Success response extraction
- 401 Unauthorized handling (token refresh)
- 403 Forbidden handling
- 404 Not Found handling
- 422 Validation error parsing
- 500 Server error handling
- Token refresh queue
- Response time logging

### Best Practices Reminder

1. **Always validate input:** Check for null/undefined values
2. **Preserve existing config:** Don't overwrite other interceptors
3. **Handle errors gracefully:** Don't break request flow
4. **Log appropriately:** Development verbose, production minimal
5. **Type safety:** Use TypeScript for compile-time checks
6. **Browser compatibility:** Test across browsers
7. **Performance:** Keep interceptor logic lightweight
8. **Security:** Never log sensitive token values

---

**Document Status:** Complete  
**Last Updated:** January 25, 2026  
**Next Review:** After implementation of Tasks 31-35
