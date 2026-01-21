# Group C: Request/Response Interceptors

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 04 - API Client Layer  
> **Group:** C of F  
> **Tasks Covered:** 31-44  
> **Group Goal:** Implement Axios interceptors for request headers and response handling

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-B_Authentication-Token-Management](../Group-B_Authentication-Token-Management/)
- **→ Next Group:** [Group-D_Error-Handling-Retry-Logic](../Group-D_Error-Handling-Retry-Logic/)

---

## Group Overview

This group implements Axios interceptors for request and response handling. Request interceptors add Authorization header with Bearer token, X-Tenant-ID for multi-tenancy, X-Request-ID for tracing, and timestamp for performance logging. Response interceptors handle successful responses, 401 (token refresh or logout), 403 (permission denied), 404 (not found), 422 (validation errors), and 500 (server errors). Implements a token refresh queue to handle concurrent requests during refresh.

### Key Outcomes

- Request interceptors module
- Authorization Bearer header
- X-Tenant-ID header for multi-tenant
- X-Request-ID for request tracing
- Request timestamp logging
- Response interceptors module
- Success response extraction
- 401 Unauthorized handling
- 403 Forbidden handling
- 404 Not Found handling
- 422 Validation error parsing
- 500 Server error handling
- Token refresh queue
- Response time logging

### Technology Context

- **Interceptors:** Axios interceptor API
- **Multi-Tenant:** X-Tenant-ID header
- **Request Tracing:** UUID for X-Request-ID
- **Token Refresh:** Queue pattern for concurrent

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-31-35_Request-Interceptors.md` | Create request interceptors for headers | 31-35 |
| 02 | `02_Tasks-36-44_Response-Interceptors.md` | Create response interceptors for error handling | 36-44 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 31 | Create Request Interceptor Module | Low | Task 14 |
| 32 | Add Authorization Header | Low | Task 31, 16 |
| 33 | Add Tenant Header | Low | Task 31 |
| 34 | Add Request ID Header | Low | Task 31 |
| 35 | Add Request Timestamp | Low | Task 31 |
| 36 | Create Response Interceptor Module | Low | Task 14 |
| 37 | Handle Successful Responses | Low | Task 36 |
| 38 | Handle 401 Unauthorized | Medium | Task 36, 26 |
| 39 | Handle 403 Forbidden | Low | Task 36 |
| 40 | Handle 404 Not Found | Low | Task 36 |
| 41 | Handle 422 Validation Errors | Medium | Task 36 |
| 42 | Handle 500 Server Errors | Low | Task 36 |
| 43 | Implement Token Refresh Queue | High | Task 38 |
| 44 | Log Response Time | Low | Task 36 |

---

## Execution Order

```
Task 31: Request Interceptors
    │
    ├────┬────┬────┐
    ▼    ▼    ▼    ▼
   32   33   34   35
   │    │    │    │
   └────┴────┴────┘
              │
              ▼
        Task 36: Response Interceptors
              │
    ┌────┬────┼────┬────┬────┐
    ▼    ▼    ▼    ▼    ▼    ▼
   37   38   39   40   41   42
        │
        ▼
      Task 43: Token Refresh Queue
              │
              ▼
        Task 44: Log Response Time
```

---

## Expected Deliverables

```
frontend/
└── services/
    └── api/
        └── apiClient.ts (with interceptors)
```

---

## Notes for AI Agents

### Request Interceptor Headers
| Header | Value | Purpose |
|--------|-------|---------|
| Authorization | Bearer {token} | JWT authentication |
| X-Tenant-ID | {tenantId} | Multi-tenant routing |
| X-Request-ID | UUID | Request tracing |

### Request ID Generation
- Use crypto.randomUUID() or uuid library
- Unique per request
- Logged for debugging

### Response Status Handling
| Status | Handler | Action |
|--------|---------|--------|
| 200-299 | Success | Extract data |
| 401 | Unauthorized | Refresh token or logout |
| 403 | Forbidden | Throw permission error |
| 404 | Not Found | Throw not found error |
| 422 | Validation | Parse field errors |
| 500 | Server Error | Throw server error |

### 401 Handling Flow
1. Check if refresh token exists
2. If yes, attempt refresh
3. If refresh succeeds, retry original request
4. If refresh fails, logout user

### Token Refresh Queue Pattern (Task 43)
- First 401 triggers refresh
- Subsequent requests queue
- After refresh, replay queued requests
- Prevents multiple refresh calls

### Validation Error Format (Task 41)
| Field | Type | Description |
|-------|------|-------------|
| field | string | Field name |
| messages | string[] | Error messages |

### Performance Logging (Task 44)
- Store start time in request config
- Calculate duration on response
- Log to console in development
- Consider analytics in production
