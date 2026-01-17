# SubPhase 06: Core Middleware Stack - Tasks Summary

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase Index:** 06 of 12  
> **SubPhase Goal:** Implement essential middleware for the application  
> **Total Tasks:** 88 | **Status:** Planning  
> **Estimated Duration:** 6-7 hours

---

## Navigation

- **↑ Parent:** [00_SUBPHASES_SUMMARY.md](../00_SUBPHASES_SUMMARY.md)
- **← Previous SubPhase:** [SubPhase-05_Role-Permission-System](../SubPhase-05_Role-Permission-System/)
- **→ Next SubPhase:** [SubPhase-07_Exception-Handling](../SubPhase-07_Exception-Handling/)

---

## SubPhase Overview

This sub-phase implements the core middleware stack for the LankaCommerce Cloud platform. These middleware components handle tenant resolution, request logging, security headers, rate limiting, and timezone management.

### Key Outcomes
- TenantMiddleware configured
- RequestLoggingMiddleware created
- SecurityHeadersMiddleware implemented
- RateLimitMiddleware working
- TimezoneMiddleware active
- Middleware order optimized

### Middleware Stack Order
```
1. SecurityMiddleware (Django)
2. CorsMiddleware (django-cors-headers)
3. TenantMiddleware (django-tenants)
4. SecurityHeadersMiddleware (custom)
5. RateLimitMiddleware (custom)
6. SessionMiddleware (Django)
7. AuthenticationMiddleware (Django)
8. RequestLoggingMiddleware (custom)
9. TimezoneMiddleware (custom)
10. ResponseFormatterMiddleware (custom)
```

### Dependencies
- **Requires:** SubPhase-04 (User Model & Authentication)

---

## Task Execution Order

```
TASK GROUP A: Middleware Infrastructure (Tasks 01-14)
        │
        ▼
TASK GROUP B: Tenant Middleware (Tasks 15-28)
        │
        ▼
TASK GROUP C: Request Logging Middleware (Tasks 29-44)
        │
        ▼
TASK GROUP D: Security Headers Middleware (Tasks 45-58)
        │
        ▼
TASK GROUP E: Rate Limiting Middleware (Tasks 59-74)
        │
        ▼
TASK GROUP F: Timezone & Configuration (Tasks 75-88)
```

---

## Task Index

### Group A: Middleware Infrastructure (Tasks 01-14)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 01 | **Create middleware Directory** | apps/core/middleware/ | SubPhase-04 | 🔴 Not Created |
| 02 | **Create middleware __init__.py** | Export all middleware | Task 01 | 🔴 Not Created |
| 03 | **Create Base Middleware Class** | Abstract base class | Task 02 | 🔴 Not Created |
| 04 | **Add process_request Method** | Request hook | Task 03 | 🔴 Not Created |
| 05 | **Add process_response Method** | Response hook | Task 04 | 🔴 Not Created |
| 06 | **Add process_exception Method** | Exception hook | Task 05 | 🔴 Not Created |
| 07 | **Create Middleware Utilities** | Helper functions | Task 06 | 🔴 Not Created |
| 08 | **Add get_client_ip Utility** | Extract client IP | Task 07 | 🔴 Not Created |
| 09 | **Add get_user_agent Utility** | Extract user agent | Task 08 | 🔴 Not Created |
| 10 | **Add generate_request_id** | Unique request ID | Task 09 | 🔴 Not Created |
| 11 | **Create Middleware Settings** | settings/middleware.py | Task 10 | 🔴 Not Created |
| 12 | **Define Middleware Constants** | Configurable values | Task 11 | 🔴 Not Created |
| 13 | **Document Middleware Order** | Order documentation | Task 12 | 🔴 Not Created |
| 14 | **Test Base Infrastructure** | Verify setup | Task 13 | 🔴 Not Created |

---

### Group B: Tenant Middleware (Tasks 15-28)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 15 | **Configure django-tenants Middleware** | TenantMainMiddleware | Task 14 | 🔴 Not Created |
| 16 | **Create Custom TenantMiddleware** | Extend default | Task 15 | 🔴 Not Created |
| 17 | **Add Tenant Resolution Logic** | Resolve from host | Task 16 | 🔴 Not Created |
| 18 | **Add Subdomain Resolution** | tenant.example.com | Task 17 | 🔴 Not Created |
| 19 | **Add Custom Domain Resolution** | mybusiness.com | Task 18 | 🔴 Not Created |
| 20 | **Handle Public Schema** | www.example.com | Task 19 | 🔴 Not Created |
| 21 | **Add Tenant Not Found Handler** | 404 for invalid tenant | Task 20 | 🔴 Not Created |
| 22 | **Add Tenant Inactive Handler** | 403 for inactive | Task 21 | 🔴 Not Created |
| 23 | **Set request.tenant** | Attach to request | Task 22 | 🔴 Not Created |
| 24 | **Add Thread Local Storage** | For non-request access | Task 23 | 🔴 Not Created |
| 25 | **Create get_current_tenant** | Utility function | Task 24 | 🔴 Not Created |
| 26 | **Register in MIDDLEWARE** | Add to settings | Task 25 | 🔴 Not Created |
| 27 | **Test Tenant Resolution** | Tenant middleware tests | Task 26 | 🔴 Not Created |
| 28 | **Document Tenant Middleware** | Middleware documentation | Task 27 | 🔴 Not Created |

---

### Group C: Request Logging Middleware (Tasks 29-44)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 29 | **Create RequestLoggingMiddleware File** | logging.py | Task 28 | 🔴 Not Created |
| 30 | **Create RequestLoggingMiddleware Class** | Main class | Task 29 | 🔴 Not Created |
| 31 | **Add Request Start Time** | Capture start time | Task 30 | 🔴 Not Created |
| 32 | **Add Request End Time** | Capture end time | Task 31 | 🔴 Not Created |
| 33 | **Calculate Response Duration** | Request duration | Task 32 | 🔴 Not Created |
| 34 | **Log Request Details** | Method, path, user | Task 33 | 🔴 Not Created |
| 35 | **Log Response Details** | Status, duration | Task 34 | 🔴 Not Created |
| 36 | **Add Request ID Header** | X-Request-ID | Task 35 | 🔴 Not Created |
| 37 | **Add Tenant ID to Logs** | Tenant context | Task 36 | 🔴 Not Created |
| 38 | **Add User ID to Logs** | User context | Task 37 | 🔴 Not Created |
| 39 | **Configure Log Format** | Structured logging | Task 38 | 🔴 Not Created |
| 40 | **Add Request Body Logging** | Optional, sanitized | Task 39 | 🔴 Not Created |
| 41 | **Exclude Health Check** | Skip /health/ | Task 40 | 🔴 Not Created |
| 42 | **Exclude Static Files** | Skip /static/ | Task 41 | 🔴 Not Created |
| 43 | **Register in MIDDLEWARE** | Add to settings | Task 42 | 🔴 Not Created |
| 44 | **Test Request Logging** | Logging tests | Task 43 | 🔴 Not Created |

---

### Group D: Security Headers Middleware (Tasks 45-58)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 45 | **Create SecurityHeadersMiddleware File** | security.py | Task 44 | 🔴 Not Created |
| 46 | **Create SecurityHeadersMiddleware Class** | Main class | Task 45 | 🔴 Not Created |
| 47 | **Add X-Content-Type-Options** | nosniff | Task 46 | 🔴 Not Created |
| 48 | **Add X-Frame-Options** | DENY or SAMEORIGIN | Task 47 | 🔴 Not Created |
| 49 | **Add X-XSS-Protection** | 1; mode=block | Task 48 | 🔴 Not Created |
| 50 | **Add Referrer-Policy** | strict-origin | Task 49 | 🔴 Not Created |
| 51 | **Add Content-Security-Policy** | CSP header | Task 50 | 🔴 Not Created |
| 52 | **Configure CSP Directives** | Per environment | Task 51 | 🔴 Not Created |
| 53 | **Add Permissions-Policy** | Feature policy | Task 52 | 🔴 Not Created |
| 54 | **Add Strict-Transport-Security** | HSTS header | Task 53 | 🔴 Not Created |
| 55 | **Configure HSTS Age** | max-age value | Task 54 | 🔴 Not Created |
| 56 | **Add X-Request-ID** | Request tracking | Task 55 | 🔴 Not Created |
| 57 | **Register in MIDDLEWARE** | Add to settings | Task 56 | 🔴 Not Created |
| 58 | **Test Security Headers** | Header tests | Task 57 | 🔴 Not Created |

---

### Group E: Rate Limiting Middleware (Tasks 59-74)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 59 | **Create RateLimitMiddleware File** | ratelimit.py | Task 58 | 🔴 Not Created |
| 60 | **Create RateLimitMiddleware Class** | Main class | Task 59 | 🔴 Not Created |
| 61 | **Configure Redis Backend** | Redis for counting | Task 60 | 🔴 Not Created |
| 62 | **Add IP-Based Rate Limit** | Per client IP | Task 61 | 🔴 Not Created |
| 63 | **Add User-Based Rate Limit** | Per authenticated user | Task 62 | 🔴 Not Created |
| 64 | **Add Tenant-Based Rate Limit** | Per tenant | Task 63 | 🔴 Not Created |
| 65 | **Add Endpoint-Based Rate Limit** | Per endpoint | Task 64 | 🔴 Not Created |
| 66 | **Configure Rate Limit Windows** | Sliding window | Task 65 | 🔴 Not Created |
| 67 | **Add X-RateLimit-Limit Header** | Max requests | Task 66 | 🔴 Not Created |
| 68 | **Add X-RateLimit-Remaining Header** | Remaining requests | Task 67 | 🔴 Not Created |
| 69 | **Add X-RateLimit-Reset Header** | Reset time | Task 68 | 🔴 Not Created |
| 70 | **Add Retry-After Header** | When exceeded | Task 69 | 🔴 Not Created |
| 71 | **Return 429 Response** | Too many requests | Task 70 | 🔴 Not Created |
| 72 | **Add Whitelist** | Bypass for IPs | Task 71 | 🔴 Not Created |
| 73 | **Register in MIDDLEWARE** | Add to settings | Task 72 | 🔴 Not Created |
| 74 | **Test Rate Limiting** | Rate limit tests | Task 73 | 🔴 Not Created |

---

### Group F: Timezone & Configuration (Tasks 75-88)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 75 | **Create TimezoneMiddleware File** | timezone.py | Task 74 | 🔴 Not Created |
| 76 | **Create TimezoneMiddleware Class** | Main class | Task 75 | 🔴 Not Created |
| 77 | **Get Tenant Timezone** | From tenant settings | Task 76 | 🔴 Not Created |
| 78 | **Get User Timezone** | From user profile | Task 77 | 🔴 Not Created |
| 79 | **Activate Timezone** | timezone.activate() | Task 78 | 🔴 Not Created |
| 80 | **Add Default Timezone** | Asia/Colombo fallback | Task 79 | 🔴 Not Created |
| 81 | **Register in MIDDLEWARE** | Add to settings | Task 80 | 🔴 Not Created |
| 82 | **Update MIDDLEWARE Setting** | Complete stack | Task 81 | 🔴 Not Created |
| 83 | **Verify Middleware Order** | Correct ordering | Task 82 | 🔴 Not Created |
| 84 | **Create Middleware Tests Suite** | All middleware tests | Task 83 | 🔴 Not Created |
| 85 | **Test Middleware Integration** | End-to-end tests | Task 84 | 🔴 Not Created |
| 86 | **Document All Middleware** | Complete documentation | Task 85 | 🔴 Not Created |
| 87 | **Create Middleware README** | Usage guide | Task 86 | 🔴 Not Created |
| 88 | **Verify Server Starts** | Final verification | Task 87 | 🔴 Not Created |

---

## Expected Final Structure

```
backend/apps/core/
├── middleware/
│   ├── __init__.py
│   ├── base.py
│   ├── tenant.py
│   ├── logging.py
│   ├── security.py
│   ├── ratelimit.py
│   ├── timezone.py
│   └── utils.py
├── tests/
│   ├── test_tenant_middleware.py
│   ├── test_logging_middleware.py
│   ├── test_security_middleware.py
│   ├── test_ratelimit_middleware.py
│   └── test_timezone_middleware.py
└── docs/
    └── middleware.md
```

---

## Middleware Stack Diagram

```
┌─────────────────────────────────────────────────────┐
│              MIDDLEWARE STACK                       │
├─────────────────────────────────────────────────────┤
│                                                     │
│  REQUEST FLOW (Top → Bottom)                        │
│  ┌─────────────────────────────────────────────┐   │
│  │ 1. SecurityMiddleware (Django)              │   │
│  │    HSTS, SSL redirect                       │   │
│  ├─────────────────────────────────────────────┤   │
│  │ 2. CorsMiddleware                           │   │
│  │    CORS headers                             │   │
│  ├─────────────────────────────────────────────┤   │
│  │ 3. TenantMiddleware                         │   │
│  │    Resolve tenant from host                 │   │
│  ├─────────────────────────────────────────────┤   │
│  │ 4. SecurityHeadersMiddleware                │   │
│  │    Add security headers                     │   │
│  ├─────────────────────────────────────────────┤   │
│  │ 5. RateLimitMiddleware                      │   │
│  │    Rate limit check                         │   │
│  ├─────────────────────────────────────────────┤   │
│  │ 6. SessionMiddleware (Django)               │   │
│  │    Session handling                         │   │
│  ├─────────────────────────────────────────────┤   │
│  │ 7. AuthenticationMiddleware (Django)        │   │
│  │    User authentication                      │   │
│  ├─────────────────────────────────────────────┤   │
│  │ 8. RequestLoggingMiddleware                 │   │
│  │    Log request/response                     │   │
│  ├─────────────────────────────────────────────┤   │
│  │ 9. TimezoneMiddleware                       │   │
│  │    Set timezone                             │   │
│  └─────────────────────────────────────────────┘   │
│                     │                               │
│                     ▼                               │
│                 [VIEW]                              │
│                     │                               │
│                     ▼                               │
│  RESPONSE FLOW (Bottom → Top)                       │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## Progress Tracking

| Metric | Count |
|--------|-------|
| Total Tasks | 88 |
| Tasks Completed | 0 |
| Tasks In Progress | 0 |
| Tasks Not Started | 88 |

**Last Updated:** 2026-01-17  
**Current Status:** Ready for task document creation

---

## Notes for AI Agents

1. **Execution Order:** Complete Group A before B, etc.
2. **Middleware Order Matters:** Follow defined stack order
3. **Tenant First:** TenantMiddleware early in stack
4. **Rate Limit:** Before expensive operations
5. **Logging:** After authentication for user context
6. **Redis Required:** Rate limiting needs Redis
7. **Security Headers:** All responses get headers
8. **Timezone:** Asia/Colombo default for Sri Lanka
9. **Testing Required:** Test each middleware isolation
