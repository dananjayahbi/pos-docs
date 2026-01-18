# SubPhase 04: API Client Layer - Tasks Summary

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase Index:** 04 of 14  
> **SubPhase Goal:** Create typed API client for backend communication with JWT authentication, error handling, and request management  
> **Total Tasks:** 90 | **Status:** Planning  
> **Estimated Duration:** 8-10 hours

---

## Navigation

- **↑ Parent:** [00_SUBPHASES_SUMMARY.md](../00_SUBPHASES_SUMMARY.md)
- **← Previous SubPhase:** [SubPhase-03_Component-Library-Setup](../SubPhase-03_Component-Library-Setup/)
- **→ Next SubPhase:** [SubPhase-05_State-Management](../SubPhase-05_State-Management/)

---

## SubPhase Overview

This sub-phase establishes the API client layer for communication between the Next.js frontend and Django REST Framework backend. It includes type-safe API calls, JWT token handling, request/response interceptors, error handling, and module-specific API services.

### Key Outcomes
- Axios-based API client configured
- JWT access and refresh token handling
- Request/response interceptors
- Automatic token refresh on expiry
- Type-safe API service functions
- Centralized error handling
- Request retry logic for transient failures
- Module-specific API services created

### Technology Context
- **HTTP Client:** Axios
- **Type Safety:** TypeScript with strict typing
- **Token Storage:** HTTP-only cookies (secure) or localStorage
- **Backend API:** Django REST Framework at /api/v1/
- **Authentication:** JWT (access + refresh tokens)

### API Structure
- **Base URL:** `NEXT_PUBLIC_API_URL` (e.g., http://localhost:8000/api/v1)
- **Auth Endpoints:** /auth/login, /auth/refresh, /auth/logout
- **Module Endpoints:** /products, /inventory, /sales, /customers, etc.

---

## Task Execution Order

```
TASK GROUP A: HTTP Client Setup (Tasks 01-14)
        │
        ▼
TASK GROUP B: Authentication & Token Management (Tasks 15-30)
        │
        ▼
TASK GROUP C: Request/Response Interceptors (Tasks 31-44)
        │
        ▼
TASK GROUP D: Error Handling & Retry Logic (Tasks 45-58)
        │
        ▼
TASK GROUP E: Module API Services (Tasks 59-78)
        │
        ▼
TASK GROUP F: API Utilities & Documentation (Tasks 79-90)
```

---

## Task Index

### Group A: HTTP Client Setup (Tasks 01-14)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 01 | **Install Axios** | Add axios as dependency for HTTP requests | SubPhase-01 | 🔴 Not Created |
| 02 | **Create API Client Directory** | Set up services/api/ directory structure | Task 01 | 🔴 Not Created |
| 03 | **Create Base API Client** | Create apiClient.ts with Axios instance | Task 01 | 🔴 Not Created |
| 04 | **Configure Base URL** | Set baseURL from NEXT_PUBLIC_API_URL env variable | Task 03 | 🔴 Not Created |
| 05 | **Configure Default Headers** | Set Content-Type, Accept headers | Task 03 | 🔴 Not Created |
| 06 | **Configure Request Timeout** | Set default timeout (30 seconds) | Task 03 | 🔴 Not Created |
| 07 | **Configure CORS Credentials** | Set withCredentials for cookie-based auth | Task 03 | 🔴 Not Created |
| 08 | **Create Type Definitions** | Create types/api.ts for API response types | Task 02 | 🔴 Not Created |
| 09 | **Create APIResponse Type** | Define generic APIResponse<T> type | Task 08 | 🔴 Not Created |
| 10 | **Create PaginatedResponse Type** | Define PaginatedResponse<T> for list endpoints | Task 08 | 🔴 Not Created |
| 11 | **Create APIError Type** | Define APIError interface for error responses | Task 08 | 🔴 Not Created |
| 12 | **Create RequestConfig Type** | Define custom request config options | Task 08 | 🔴 Not Created |
| 13 | **Create API Client Factory** | Create factory function for custom instances | Task 03 | 🔴 Not Created |
| 14 | **Verify API Client Setup** | Test basic GET/POST requests work | Task 07 | 🔴 Not Created |

---

### Group B: Authentication & Token Management (Tasks 15-30)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 15 | **Create Token Storage Module** | Create lib/tokenStorage.ts for token management | Task 02 | 🔴 Not Created |
| 16 | **Implement getAccessToken** | Function to retrieve access token from storage | Task 15 | 🔴 Not Created |
| 17 | **Implement setAccessToken** | Function to store access token securely | Task 15 | 🔴 Not Created |
| 18 | **Implement getRefreshToken** | Function to retrieve refresh token | Task 15 | 🔴 Not Created |
| 19 | **Implement setRefreshToken** | Function to store refresh token | Task 15 | 🔴 Not Created |
| 20 | **Implement clearTokens** | Function to clear all tokens on logout | Task 15 | 🔴 Not Created |
| 21 | **Implement isTokenExpired** | Function to check JWT expiration | Task 15 | 🔴 Not Created |
| 22 | **Create Auth Types** | Define LoginRequest, LoginResponse, User types | Task 08 | 🔴 Not Created |
| 23 | **Create Auth Service** | Create services/api/authService.ts | Task 22 | 🔴 Not Created |
| 24 | **Implement login Function** | POST /auth/login with credentials | Task 23 | 🔴 Not Created |
| 25 | **Implement logout Function** | POST /auth/logout to invalidate tokens | Task 23 | 🔴 Not Created |
| 26 | **Implement refreshToken Function** | POST /auth/refresh to get new access token | Task 23 | 🔴 Not Created |
| 27 | **Implement getCurrentUser Function** | GET /auth/me to get current user | Task 23 | 🔴 Not Created |
| 28 | **Implement forgotPassword Function** | POST /auth/forgot-password | Task 23 | 🔴 Not Created |
| 29 | **Implement resetPassword Function** | POST /auth/reset-password | Task 23 | 🔴 Not Created |
| 30 | **Implement changePassword Function** | POST /auth/change-password | Task 23 | 🔴 Not Created |

---

### Group C: Request/Response Interceptors (Tasks 31-44)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 31 | **Create Request Interceptor Module** | Set up request interceptors in apiClient | Task 14 | 🔴 Not Created |
| 32 | **Add Authorization Header** | Attach Bearer token to authenticated requests | Task 31, 16 | 🔴 Not Created |
| 33 | **Add Tenant Header** | Attach X-Tenant-ID header for multi-tenant | Task 31 | 🔴 Not Created |
| 34 | **Add Request ID Header** | Generate and attach X-Request-ID for tracing | Task 31 | 🔴 Not Created |
| 35 | **Add Request Timestamp** | Log request start time for performance | Task 31 | 🔴 Not Created |
| 36 | **Create Response Interceptor Module** | Set up response interceptors in apiClient | Task 14 | 🔴 Not Created |
| 37 | **Handle Successful Responses** | Extract data from successful responses | Task 36 | 🔴 Not Created |
| 38 | **Handle 401 Unauthorized** | Trigger token refresh or logout on 401 | Task 36, 26 | 🔴 Not Created |
| 39 | **Handle 403 Forbidden** | Handle permission denied errors | Task 36 | 🔴 Not Created |
| 40 | **Handle 404 Not Found** | Handle resource not found errors | Task 36 | 🔴 Not Created |
| 41 | **Handle 422 Validation Errors** | Parse and format validation errors | Task 36 | 🔴 Not Created |
| 42 | **Handle 500 Server Errors** | Handle internal server errors | Task 36 | 🔴 Not Created |
| 43 | **Implement Token Refresh Queue** | Queue requests during token refresh | Task 38 | 🔴 Not Created |
| 44 | **Log Response Time** | Calculate and log request duration | Task 36 | 🔴 Not Created |

---

### Group D: Error Handling & Retry Logic (Tasks 45-58)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 45 | **Create Error Handling Module** | Create lib/apiError.ts for error utilities | Task 11 | 🔴 Not Created |
| 46 | **Create ApiException Class** | Custom exception class with typed errors | Task 45 | 🔴 Not Created |
| 47 | **Create parseApiError Function** | Parse Axios errors into ApiException | Task 46 | 🔴 Not Created |
| 48 | **Create getErrorMessage Function** | Extract user-friendly error messages | Task 47 | 🔴 Not Created |
| 49 | **Create isNetworkError Function** | Detect network connectivity errors | Task 45 | 🔴 Not Created |
| 50 | **Create isTimeoutError Function** | Detect request timeout errors | Task 45 | 🔴 Not Created |
| 51 | **Create Retry Configuration** | Define retry options (count, delay, backoff) | Task 45 | 🔴 Not Created |
| 52 | **Implement Retry Logic** | Add automatic retry for transient failures | Task 51 | 🔴 Not Created |
| 53 | **Implement Exponential Backoff** | Increase delay between retry attempts | Task 52 | 🔴 Not Created |
| 54 | **Create isRetryable Function** | Determine if error should trigger retry | Task 52 | 🔴 Not Created |
| 55 | **Create Request Cancellation** | Implement AbortController for request cancel | Task 03 | 🔴 Not Created |
| 56 | **Create useAbortController Hook** | Hook to manage request cancellation | Task 55 | 🔴 Not Created |
| 57 | **Implement Offline Detection** | Detect offline state and queue requests | Task 49 | 🔴 Not Created |
| 58 | **Create Error Boundary Integration** | Connect API errors to React error boundary | Task 48 | 🔴 Not Created |

---

### Group E: Module API Services (Tasks 59-78)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 59 | **Create Product Types** | Define Product, Category, Variant types | Task 08 | 🔴 Not Created |
| 60 | **Create Product Service** | Implement productService with CRUD operations | Task 59 | 🔴 Not Created |
| 61 | **Create Category Service** | Implement categoryService with CRUD operations | Task 59 | 🔴 Not Created |
| 62 | **Create Inventory Types** | Define Stock, Warehouse, Movement types | Task 08 | 🔴 Not Created |
| 63 | **Create Inventory Service** | Implement inventoryService for stock operations | Task 62 | 🔴 Not Created |
| 64 | **Create Warehouse Service** | Implement warehouseService for warehouse ops | Task 62 | 🔴 Not Created |
| 65 | **Create Customer Types** | Define Customer, Address, Contact types | Task 08 | 🔴 Not Created |
| 66 | **Create Customer Service** | Implement customerService with CRUD operations | Task 65 | 🔴 Not Created |
| 67 | **Create Vendor Types** | Define Vendor, PurchaseOrder types | Task 08 | 🔴 Not Created |
| 68 | **Create Vendor Service** | Implement vendorService with CRUD operations | Task 67 | 🔴 Not Created |
| 69 | **Create Sales Types** | Define Order, Invoice, Payment types | Task 08 | 🔴 Not Created |
| 70 | **Create Sales Service** | Implement salesService for order management | Task 69 | 🔴 Not Created |
| 71 | **Create Invoice Service** | Implement invoiceService for invoicing | Task 69 | 🔴 Not Created |
| 72 | **Create HR Types** | Define Employee, Attendance, Leave types | Task 08 | 🔴 Not Created |
| 73 | **Create Employee Service** | Implement employeeService with CRUD operations | Task 72 | 🔴 Not Created |
| 74 | **Create Attendance Service** | Implement attendanceService for time tracking | Task 72 | 🔴 Not Created |
| 75 | **Create Payroll Service** | Implement payrollService for salary processing | Task 72 | 🔴 Not Created |
| 76 | **Create Reports Types** | Define ReportDefinition, ReportInstance types | Task 08 | 🔴 Not Created |
| 77 | **Create Reports Service** | Implement reportsService for analytics | Task 76 | 🔴 Not Created |
| 78 | **Create Settings Service** | Implement settingsService for tenant settings | Task 08 | 🔴 Not Created |

---

### Group F: API Utilities & Documentation (Tasks 79-90)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 79 | **Create Query String Builder** | Utility to build query params from objects | Task 02 | 🔴 Not Created |
| 80 | **Create URL Path Builder** | Utility to build URLs with path params | Task 02 | 🔴 Not Created |
| 81 | **Create Form Data Builder** | Utility to convert objects to FormData | Task 02 | 🔴 Not Created |
| 82 | **Create File Upload Helper** | Helper for multipart file uploads | Task 81 | 🔴 Not Created |
| 83 | **Create Download File Helper** | Helper for file download responses | Task 02 | 🔴 Not Created |
| 84 | **Create API Cache Layer** | Simple in-memory cache for GET requests | Task 02 | 🔴 Not Created |
| 85 | **Create API Rate Limiter** | Client-side rate limiting for sensitive endpoints | Task 02 | 🔴 Not Created |
| 86 | **Create Service Index File** | Create index.ts exporting all services | Task 78 | 🔴 Not Created |
| 87 | **Create API Mock Server** | Set up MSW for development mocking | Task 86 | 🔴 Not Created |
| 88 | **Create API Client Tests** | Unit tests for API client | Task 87 | 🔴 Not Created |
| 89 | **Create API Documentation** | Document all API services and usage | Task 88 | 🔴 Not Created |
| 90 | **Final Verification & Integration** | Test full API flow with backend | Task 89 | 🔴 Not Created |

---

## Expected Final Structure

```
frontend/
├── lib/
│   ├── apiError.ts           # Error handling utilities
│   ├── tokenStorage.ts       # Token management
│   └── utils.ts              # General utilities
├── services/
│   └── api/
│       ├── apiClient.ts      # Base Axios client
│       ├── authService.ts    # Authentication API
│       ├── productService.ts # Product CRUD
│       ├── categoryService.ts
│       ├── inventoryService.ts
│       ├── warehouseService.ts
│       ├── customerService.ts
│       ├── vendorService.ts
│       ├── salesService.ts
│       ├── invoiceService.ts
│       ├── employeeService.ts
│       ├── attendanceService.ts
│       ├── payrollService.ts
│       ├── reportsService.ts
│       ├── settingsService.ts
│       └── index.ts          # Service exports
├── hooks/
│   └── useAbortController.ts
├── types/
│   ├── api.ts                # API response types
│   ├── auth.ts               # Auth types
│   ├── product.ts            # Product types
│   ├── inventory.ts          # Inventory types
│   ├── customer.ts           # Customer types
│   ├── vendor.ts             # Vendor types
│   ├── sales.ts              # Sales types
│   ├── hr.ts                 # HR types
│   ├── reports.ts            # Reports types
│   └── index.ts              # Type exports
└── mocks/
    ├── handlers.ts           # MSW request handlers
    └── server.ts             # MSW server setup
```

---

## API Response Format Reference

### Standard Response
```typescript
interface APIResponse<T> {
  data: T;
  message?: string;
  timestamp: string;
}
```

### Paginated Response
```typescript
interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    totalPages: number;
    totalCount: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}
```

### Error Response
```typescript
interface APIError {
  code: string;
  message: string;
  details?: Record<string, string[]>;
  timestamp: string;
}
```

---

## Progress Tracking

| Metric | Count |
|--------|-------|
| Total Tasks | 90 |
| Tasks Completed | 0 |
| Tasks In Progress | 0 |
| Tasks Not Started | 90 |

**Last Updated:** 2026-01-17  
**Current Status:** Ready for task document creation

---

## Notes for AI Agents

1. **Execution Order:** Tasks must be executed in numerical order within each group
2. **Base URL:** Always use environment variable for API base URL
3. **Token Security:** Prefer HTTP-only cookies over localStorage for tokens
4. **Type Safety:** All API calls must be fully typed with TypeScript
5. **Error Handling:** Always wrap API calls in try-catch with proper error parsing
6. **Retry Logic:** Only retry on network errors and 5xx responses, not 4xx
7. **Abort Controller:** Use AbortController for cancellable requests
8. **Multi-Tenant:** Always include tenant header in requests
9. **Dependencies:** This sub-phase depends on SubPhase-01 (Next.js setup)
10. **No Code Snippets in Tasks:** Individual task documents should focus on descriptions, not implementation code
11. **Backend Alignment:** API services should match Django REST Framework endpoints
12. **Testing:** Use MSW (Mock Service Worker) for testing API calls
