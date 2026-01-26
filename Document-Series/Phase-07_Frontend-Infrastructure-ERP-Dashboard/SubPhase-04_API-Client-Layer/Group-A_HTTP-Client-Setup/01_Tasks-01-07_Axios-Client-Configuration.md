# Tasks 01-07: Axios Installation and Base Client Configuration

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 04 - API Client Layer  
> **Group:** A - HTTP Client Setup  
> **Document:** 01 of 02  
> **Tasks Covered:** 01, 02, 03, 04, 05, 06, 07

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-08-14_Types-Factory-Verification.md](02_Tasks-08-14_Types-Factory-Verification.md)

---

## Document Overview

This document establishes the foundational HTTP client infrastructure for the ERP dashboard. It covers installing Axios as the HTTP client library, creating the API directory structure, and configuring the base Axios instance with production-ready settings including base URL configuration, default headers, timeout settings, and CORS credentials support.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 01 | Install Axios | Low | 5 min |
| 02 | Create API Client Directory | Low | 5 min |
| 03 | Create Base API Client | Medium | 20 min |
| 04 | Configure Base URL | Low | 10 min |
| 05 | Configure Default Headers | Low | 10 min |
| 06 | Configure Request Timeout | Low | 5 min |
| 07 | Configure CORS Credentials | Low | 5 min |

---

## Task 01: Install Axios

### Overview
Install Axios as the primary HTTP client library for the Next.js frontend. Axios is chosen for its robust feature set, interceptor support, automatic JSON transformation, and wide adoption in the React/Next.js ecosystem.

### Dependencies
- SubPhase-01: Next.js project must be initialized
- pnpm package manager configured

### Instructions

1. **Navigate to frontend directory**
   - Open terminal in project root
   - Change to frontend application directory
   - Ensure pnpm workspace is configured

2. **Install Axios package**
   - Run pnpm add command
   - Install latest stable Axios version
   - Package added to dependencies in package.json

3. **Verify installation**
   - Check package.json dependencies section
   - Confirm Axios version installed
   - Review pnpm-lock.yaml for dependency tree

4. **Confirm TypeScript types**
   - Axios includes built-in TypeScript types
   - No @types/axios package needed
   - Types automatically available

### Why Axios?

| Feature | Benefit | Comparison to Fetch |
|---------|---------|---------------------|
| Interceptors | Request/response middleware | Manual implementation required |
| Auto JSON Transform | Automatic request/response parsing | Manual JSON.stringify/parse |
| Timeout Support | Built-in timeout configuration | AbortController required |
| Error Handling | Consistent error structure | Manual response.ok checks |
| Request Cancellation | Built-in cancel token | AbortController API |
| Browser Support | Wide compatibility | Modern browsers only |
| Type Safety | Excellent TypeScript support | Basic type support |

### Package Installation

```
Command: pnpm add axios
Location: frontend/
Result: axios added to dependencies
TypeScript: Built-in types included
```

### Installation Verification Checklist
- [ ] Navigate to frontend directory
- [ ] Run pnpm add axios command
- [ ] Verify axios in package.json dependencies
- [ ] Check pnpm-lock.yaml updated
- [ ] Confirm no installation errors
- [ ] TypeScript types available

### Expected Outcome
- Axios library installed in frontend project
- Package added to package.json dependencies
- TypeScript types available for development
- Foundation ready for HTTP client creation

---

## Task 02: Create API Client Directory

### Overview
Establish the directory structure for API client services. This organization separates HTTP client configuration from business logic, providing a centralized location for all API-related code including the base client, interceptors, and module-specific API services.

### Dependencies
- Task 01: Install Axios

### Instructions

1. **Navigate to frontend services directory**
   - Locate frontend/services/ directory
   - If services/ doesn't exist, create it first
   - This directory houses all service layer code

2. **Create api subdirectory**
   - Inside services/, create api/ directory
   - This will contain all API client code
   - Separate from other services (storage, analytics, etc.)

3. **Verify directory structure**
   - Confirm services/api/ path exists
   - Ready for apiClient.ts file creation
   - Maintains clean separation of concerns

### Directory Organization Rationale

#### Services Directory Purpose
```
frontend/services/
├── api/              ← HTTP client and API services
├── storage/          ← Local/session storage utilities
├── analytics/        ← Analytics tracking
├── websocket/        ← Real-time connections
└── validation/       ← Form validation services
```

#### API Directory Contents (Future State)
```
frontend/services/api/
├── apiClient.ts           ← Base Axios instance
├── interceptors/
│   ├── auth.interceptor.ts
│   ├── error.interceptor.ts
│   └── retry.interceptor.ts
├── modules/
│   ├── products.api.ts
│   ├── customers.api.ts
│   ├── orders.api.ts
│   └── ...
└── utils/
    ├── queryBuilder.ts
    └── responseTransformer.ts
```

### Directory Structure Benefits

| Benefit | Description |
|---------|-------------|
| Centralization | All API code in one location |
| Modularity | Clear separation between modules |
| Maintainability | Easy to locate and update API code |
| Scalability | Structure supports growth |
| Testing | Simplified test organization |

### Expected Outcome
- services/api/ directory created
- Organized structure for API client code
- Foundation for future module APIs
- Clear separation of concerns

### Verification Checklist
- [ ] frontend/services/ directory exists
- [ ] frontend/services/api/ subdirectory created
- [ ] Path accessible from root
- [ ] Ready for apiClient.ts creation

---

## Task 03: Create Base API Client

### Overview
Create the core Axios instance (apiClient.ts) that serves as the foundation for all API requests. This singleton instance will be imported and used across the application, ensuring consistent HTTP configuration, headers, and behavior for all backend communication.

### Dependencies
- Task 01: Install Axios
- Task 02: Create API Client Directory

### Instructions

1. **Create apiClient.ts file**
   - Navigate to frontend/services/api/
   - Create new file: apiClient.ts
   - This file exports the base Axios instance

2. **Import Axios library**
   - Import Axios and AxiosInstance type
   - Import type definitions for configuration
   - Prepare for instance creation

3. **Create Axios instance**
   - Use axios.create() method
   - Pass configuration object
   - Assign to apiClient constant

4. **Export the instance**
   - Export apiClient as default export
   - Also export as named export for flexibility
   - Makes client available throughout app

5. **Add comprehensive comments**
   - Document purpose of base client
   - Explain configuration decisions
   - Note usage patterns

### Base Client Structure

```
Import Dependencies
    ↓
Create Axios Instance
    ↓
Configure Base Settings
    ↓
Export for Use
```

### Axios Instance Creation Pattern

#### Step 1: Import
```
- Import axios from 'axios'
- Import AxiosInstance type
- Import custom types (if created)
```

#### Step 2: Create
```
- Call axios.create()
- Pass configuration object
- Store in constant
```

#### Step 3: Configure
```
- Set baseURL
- Set timeout
- Set headers
- Set credentials
```

#### Step 4: Export
```
- Default export for main use
- Named export for flexibility
- Type-safe exports
```

### File Organization

| Section | Purpose |
|---------|---------|
| Imports | Dependencies and types |
| Configuration | Base URL, timeout, headers |
| Instance Creation | axios.create() call |
| Exports | Default and named exports |

### Usage Pattern (Preview)

Once created, other modules will import and use the client:

```
Importing the Client:
- import apiClient from '@/services/api/apiClient'
- import { apiClient } from '@/services/api/apiClient'

Making Requests:
- apiClient.get('/products')
- apiClient.post('/orders', data)
- apiClient.put('/customers/123', data)
- apiClient.delete('/items/456')
```

### Expected Outcome
- apiClient.ts file created
- Axios instance configured
- Exported for application-wide use
- Foundation for all API requests

### Verification Checklist
- [ ] apiClient.ts created in services/api/
- [ ] Axios imported correctly
- [ ] axios.create() called
- [ ] Instance assigned to constant
- [ ] Default export added
- [ ] Named export added
- [ ] File compiles without errors

---

## Task 04: Configure Base URL

### Overview
Configure the base URL for the Axios instance using the NEXT_PUBLIC_API_URL environment variable. This centralizes API endpoint configuration, enabling different backend URLs for development, staging, and production environments without code changes.

### Dependencies
- Task 03: Create Base API Client
- SubPhase-01: Environment variables configured

### Instructions

1. **Understand environment variable pattern**
   - Next.js exposes variables prefixed with NEXT_PUBLIC_
   - These variables are available in browser code
   - Must be set in .env.local or .env files

2. **Add baseURL to Axios config**
   - In apiClient.ts configuration object
   - Set baseURL property
   - Use process.env.NEXT_PUBLIC_API_URL

3. **Add fallback URL**
   - Provide default URL for development
   - Use logical OR operator for fallback
   - Prevents undefined baseURL errors

4. **Add configuration comment**
   - Document environment variable usage
   - Explain fallback strategy
   - Note URL format requirements

### Environment Variable Configuration

#### Development Environment
```
File: .env.local

NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

#### Staging Environment
```
File: .env.staging

NEXT_PUBLIC_API_URL=https://staging-api.lankacommerce.com/api/v1
```

#### Production Environment
```
File: .env.production

NEXT_PUBLIC_API_URL=https://api.lankacommerce.com/api/v1
```

### Base URL Pattern

| Environment | Base URL | Purpose |
|-------------|----------|---------|
| Local Dev | http://localhost:8000/api/v1 | Backend dev server |
| Staging | https://staging-api.example.com/api/v1 | Testing environment |
| Production | https://api.example.com/api/v1 | Live production API |

### URL Structure Explanation

```
https://api.lankacommerce.com/api/v1
│      │                       │   │
│      │                       │   └─ API version
│      │                       └───── API path prefix
│      └───────────────────────────── Domain
└──────────────────────────────────── Protocol
```

### Configuration Object

```
Configuration Object:
{
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1',
  // ... other configuration
}
```

### Request URL Construction

When making requests, Axios combines baseURL with endpoint:

| Base URL | Endpoint | Final URL |
|----------|----------|-----------|
| http://localhost:8000/api/v1 | /products | http://localhost:8000/api/v1/products |
| http://localhost:8000/api/v1 | /orders/123 | http://localhost:8000/api/v1/orders/123 |
| http://localhost:8000/api/v1 | /customers?page=2 | http://localhost:8000/api/v1/customers?page=2 |

### Why NEXT_PUBLIC_ Prefix?

| Aspect | Explanation |
|--------|-------------|
| Client-Side Access | Variables available in browser JavaScript |
| Security | Forces explicit decision for client exposure |
| Build-Time Inlining | Values embedded during build process |
| No Server Required | Values available in static exports |

### Expected Outcome
- baseURL configured in Axios instance
- Environment variable properly referenced
- Fallback URL prevents errors
- Different URLs per environment supported

### Verification Checklist
- [ ] baseURL property added to config
- [ ] process.env.NEXT_PUBLIC_API_URL referenced
- [ ] Fallback URL provided
- [ ] Configuration commented
- [ ] Environment variable created in .env.local
- [ ] Test request shows correct base URL

---

## Task 05: Configure Default Headers

### Overview
Configure default HTTP headers that will be automatically included with every request. These headers ensure proper content negotiation, specify data formats, and establish communication standards between the frontend and Django REST Framework backend.

### Dependencies
- Task 03: Create Base API Client

### Instructions

1. **Add headers configuration section**
   - In Axios config object, add headers property
   - Create nested object for header definitions
   - Organize by header type

2. **Set Content-Type header**
   - Add 'Content-Type': 'application/json'
   - Tells server we're sending JSON data
   - DRF expects this for POST/PUT/PATCH requests

3. **Set Accept header**
   - Add 'Accept': 'application/json'
   - Tells server we want JSON responses
   - Matches DRF's default response format

4. **Add comments for each header**
   - Explain purpose of Content-Type
   - Explain purpose of Accept
   - Note DRF compatibility

### HTTP Headers Explained

#### Content-Type Header
```
Purpose: Indicates the media type of the request body
Value: application/json
When Used: POST, PUT, PATCH requests with body
Effect: Server parses request as JSON
```

#### Accept Header
```
Purpose: Indicates preferred response media type
Value: application/json
When Used: All requests
Effect: Server responds with JSON format
```

### Headers Configuration Structure

```
headers: {
  'Content-Type': 'application/json',    ← Request body format
  'Accept': 'application/json'           ← Response format preference
}
```

### Header Flow Diagram

```
Frontend Request
    │
    ├─ Content-Type: application/json (tells server: "I'm sending JSON")
    │
    └─ Accept: application/json (tells server: "I want JSON back")
    │
    ▼
Backend (Django REST Framework)
    │
    ├─ Parses request as JSON (based on Content-Type)
    │
    └─ Returns JSON response (based on Accept)
    │
    ▼
Frontend receives JSON response
```

### Why These Headers Matter

| Header | Without It | With It |
|--------|-----------|---------|
| Content-Type | Server may not parse JSON correctly | Server correctly interprets request |
| Accept | Server might return HTML error pages | Server returns JSON error responses |

### Common Content Types (Reference)

| Content-Type | Use Case | Example |
|-------------|----------|---------|
| application/json | API requests (ours) | {"name": "Product"} |
| application/x-www-form-urlencoded | HTML forms | name=Product&price=100 |
| multipart/form-data | File uploads | Binary file data |
| text/plain | Plain text | Simple text content |
| text/html | HTML content | \<html\>...\</html\> |

### Django REST Framework Integration

DRF Content Negotiation:
```
1. Client sends Accept header
2. DRF checks Accept header
3. DRF matches with configured renderers
4. DRF returns response in requested format
5. Default: JSON (JSONRenderer)
```

### Header Override Pattern (Advanced)

While default headers apply to all requests, individual requests can override:

```
Override Default Headers:
- apiClient.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
- Overrides default application/json for file upload
```

### Expected Outcome
- Content-Type header configured
- Accept header configured
- All requests include JSON headers by default
- Compatible with DRF backend

### Verification Checklist
- [ ] headers object added to config
- [ ] Content-Type: application/json set
- [ ] Accept: application/json set
- [ ] Headers commented
- [ ] Test request includes headers
- [ ] Backend receives correct headers

---

## Task 06: Configure Request Timeout

### Overview
Configure a request timeout of 30 seconds (30000 milliseconds) for all API requests. This prevents requests from hanging indefinitely, improves user experience with timely error feedback, and protects against unresponsive server scenarios.

### Dependencies
- Task 03: Create Base API Client

### Instructions

1. **Add timeout configuration**
   - In Axios config object, add timeout property
   - Set value to 30000 (milliseconds)
   - Applies to all requests by default

2. **Understand timeout behavior**
   - Timeout starts when request is initiated
   - Includes connection time + response time
   - If exceeded, request is cancelled

3. **Add timeout comment**
   - Document 30-second timeout value
   - Explain why this duration chosen
   - Note that individual requests can override

### Timeout Configuration

```
Configuration:
timeout: 30000  // 30 seconds in milliseconds
```

### Timeout Duration Rationale

| Duration | Too Short? | Too Long? | Chosen: 30s |
|----------|------------|-----------|-------------|
| 5s | May fail on slow connections | ✗ | - |
| 15s | May fail for complex queries | ✗ | - |
| 30s | Reasonable for most operations | - | ✓ Balanced |
| 60s+ | User waiting too long | ✓ | - |

### Timeout Behavior Flow

```
Request Initiated (t=0s)
    │
    ├─ Establishing connection
    │
    ├─ Sending request
    │
    ├─ Server processing
    │
    ├─ Receiving response
    │
    ▼
Response Received (t<30s) → Success
    OR
Timeout Exceeded (t≥30s) → Error
```

### Timeout Scenarios

#### Scenario 1: Fast Response (Success)
```
Timeline:
0s  → Request sent
0.5s → Response received
Result: Success (well within timeout)
```

#### Scenario 2: Slow Response (Success)
```
Timeline:
0s  → Request sent
25s → Response received
Result: Success (within timeout)
```

#### Scenario 3: Very Slow Response (Timeout)
```
Timeline:
0s  → Request sent
30s → Timeout triggered
Result: Error thrown (request cancelled)
```

#### Scenario 4: Unresponsive Server (Timeout)
```
Timeline:
0s  → Request sent
30s → Timeout triggered
Result: Error thrown (prevents hanging)
```

### Timeout Error Handling

When timeout occurs, Axios throws error:
```
Error Properties:
- error.code = 'ECONNABORTED'
- error.message = 'timeout of 30000ms exceeded'
- Request can be retried or user notified
```

### Operation-Specific Timeout Considerations

| Operation Type | Expected Duration | 30s Sufficient? |
|----------------|-------------------|-----------------|
| GET list (paginated) | 1-3s | ✓ |
| GET single item | 0.5-1s | ✓ |
| POST/PUT simple | 1-2s | ✓ |
| POST with file upload | 5-15s | ✓ |
| Complex reports | 10-20s | ✓ |
| Bulk imports | 20-30s | ✓ (borderline) |

### Override Pattern (Future)

For operations that legitimately take longer:
```
Override Example:
apiClient.post('/bulk-import', data, {
  timeout: 60000  // 60 seconds for bulk operations
})
```

### Timeout vs. Connection Issues

| Issue Type | Timeout Helps? | Explanation |
|------------|----------------|-------------|
| Slow server | ✓ | Prevents indefinite waiting |
| Unresponsive server | ✓ | Fails fast instead of hanging |
| No internet | ✗ | Connection error (different from timeout) |
| Server down | ✗ | Connection refused (immediate error) |

### Expected Outcome
- 30-second timeout configured
- Requests won't hang indefinitely
- Better user experience
- Prevents frozen UI

### Verification Checklist
- [ ] timeout: 30000 added to config
- [ ] Timeout value in milliseconds
- [ ] Timeout commented
- [ ] Test long-running request
- [ ] Verify timeout error after 30s
- [ ] Confirm error handling works

---

## Task 07: Configure CORS Credentials

### Overview
Enable the withCredentials option to allow the Axios client to send and receive HTTP cookies, authentication credentials, and session information with cross-origin requests. This is essential for session-based authentication and CSRF token handling with the Django backend.

### Dependencies
- Task 03: Create Base API Client

### Instructions

1. **Add withCredentials configuration**
   - In Axios config object, add withCredentials property
   - Set value to true
   - Enables credential transmission

2. **Understand CORS credentials behavior**
   - Allows cookies to be sent with requests
   - Allows cookies to be received from responses
   - Required for session authentication
   - Required for CSRF token cookies

3. **Add configuration comment**
   - Document withCredentials purpose
   - Explain cookie/session handling
   - Note Django CSRF token requirement

### CORS Credentials Configuration

```
Configuration:
withCredentials: true  // Allow cookies and credentials
```

### withCredentials Effect

| Setting | Cookies Sent? | Cookies Stored? | Use Case |
|---------|---------------|-----------------|----------|
| false (default) | ✗ | ✗ | Public APIs, no auth |
| true | ✓ | ✓ | Session auth, CSRF |

### Cookie Flow with withCredentials

```
First Request (Login):
Frontend → POST /auth/login (withCredentials: true)
    ↓
Backend → Sets sessionid cookie, csrftoken cookie
    ↓
Browser → Stores cookies

Subsequent Requests:
Frontend → GET /products (withCredentials: true)
    ↓
Browser → Automatically includes sessionid, csrftoken
    ↓
Backend → Validates session, authorizes request
    ↓
Frontend → Receives authenticated response
```

### Django CSRF Protection Integration

#### CSRF Token Flow
```
Step 1: Get CSRF Token
- Django sets csrftoken cookie on first request
- Cookie stored in browser

Step 2: Include in Requests
- Browser sends csrftoken cookie automatically (withCredentials)
- Frontend extracts token from cookie
- Frontend includes token in X-CSRFToken header

Step 3: Django Validates
- Django receives csrftoken cookie
- Django receives X-CSRFToken header
- Django compares both values
- Request authorized if tokens match
```

### Why withCredentials Required

| Reason | Explanation |
|--------|-------------|
| Session Authentication | sessionid cookie must be sent with requests |
| CSRF Protection | csrftoken cookie must be sent and stored |
| Persistent Login | Maintains user session across requests |
| Secure Communication | Credentials only sent over HTTPS in production |

### Browser Security Behavior

```
Same-Origin Request:
- Cookies sent automatically
- withCredentials not required

Cross-Origin Request:
- Cookies NOT sent by default (security)
- withCredentials: true REQUIRED
- Backend must allow with CORS headers
```

### Backend CORS Configuration (Reference)

Django must allow credentials in CORS settings:
```
Required Django Settings:
- CORS_ALLOW_CREDENTIALS = True
- CORS_ALLOWED_ORIGINS = ['http://localhost:3000']
- SESSION_COOKIE_SAMESITE = 'Lax' or None
- CSRF_COOKIE_SAMESITE = 'Lax' or None
- CSRF_TRUSTED_ORIGINS = ['http://localhost:3000']
```

### Cookie Security Attributes

| Attribute | Value | Purpose |
|-----------|-------|---------|
| HttpOnly | true | Prevents JavaScript access (security) |
| Secure | true (production) | HTTPS only |
| SameSite | Lax | CSRF protection |
| Domain | .example.com | Cookie scope |
| Path | / | Cookie availability |

### Development vs Production

#### Development (localhost)
```
Frontend: http://localhost:3000
Backend: http://localhost:8000
HTTPS: Not required
Secure cookies: false
```

#### Production
```
Frontend: https://erp.lankacommerce.com
Backend: https://api.lankacommerce.com
HTTPS: Required
Secure cookies: true
```

### Common Issues and Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| Cookies not sent | withCredentials: false | Set to true |
| CORS error | Backend not allowing credentials | Configure Django CORS |
| CSRF error | Token not included | Add CSRF interceptor |
| Session lost | Cookie expired | Implement refresh mechanism |

### Expected Outcome
- withCredentials enabled
- Cookies sent with requests
- Cookies stored from responses
- Session authentication supported
- CSRF tokens handled

### Verification Checklist
- [ ] withCredentials: true added
- [ ] Configuration commented
- [ ] Test request includes cookies
- [ ] Browser stores received cookies
- [ ] Session persists across requests
- [ ] CSRF tokens transmitted correctly

---

## Summary

This document established the foundation of the API client layer by installing Axios, creating the directory structure, and configuring the base Axios instance with production-ready settings. The apiClient now has:

✅ Axios installed as HTTP client  
✅ services/api/ directory created  
✅ Base Axios instance configured  
✅ Base URL from environment variable  
✅ JSON content headers  
✅ 30-second timeout  
✅ CORS credentials enabled  

The next document will create TypeScript type definitions for API responses and errors, implement the API client factory function, and verify the complete setup.
