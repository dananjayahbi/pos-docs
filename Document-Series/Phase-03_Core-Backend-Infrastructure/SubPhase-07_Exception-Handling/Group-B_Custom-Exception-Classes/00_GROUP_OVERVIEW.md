# Group B: Custom Exception Classes

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 07 - Exception Handling  
> **Group:** B of F  
> **Tasks Covered:** 15-30  
> **Group Goal:** Create all custom exception classes for different error scenarios

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-A_Exception-Infrastructure](../Group-A_Exception-Infrastructure/)
- **→ Next Group:** [Group-C_Global-Exception-Handler](../Group-C_Global-Exception-Handler/)

---

## Group Overview

This group creates all the custom exception classes that extend the base APIException. Each exception is mapped to a specific HTTP status code and error scenario.

### Key Components
- **HTTP 400 Exceptions:** ValidationException
- **HTTP 401 Exceptions:** AuthenticationException, InvalidTokenException, TokenExpiredException
- **HTTP 403 Exceptions:** PermissionDeniedException
- **HTTP 404 Exceptions:** NotFoundException, TenantNotFoundException
- **HTTP 409 Exceptions:** ConflictException, ResourceExistsException
- **HTTP 429 Exceptions:** RateLimitException
- **HTTP 500 Exceptions:** ServerException
- **HTTP 503 Exceptions:** ServiceUnavailableException
- **Business Logic:** TenantInactiveException, BusinessRuleException

### Exception Mapping Table
| Exception Class | HTTP Status | Error Code Prefix |
|-----------------|-------------|-------------------|
| ValidationException | 400 | VALIDATION_ |
| AuthenticationException | 401 | AUTH_ |
| InvalidTokenException | 401 | AUTH_TOKEN_ |
| TokenExpiredException | 401 | AUTH_TOKEN_ |
| PermissionDeniedException | 403 | PERMISSION_ |
| NotFoundException | 404 | RESOURCE_ |
| TenantNotFoundException | 404 | TENANT_ |
| TenantInactiveException | 403 | TENANT_ |
| ConflictException | 409 | CONFLICT_ |
| ResourceExistsException | 409 | CONFLICT_ |
| RateLimitException | 429 | RATE_LIMIT_ |
| ServerException | 500 | SERVER_ |
| ServiceUnavailableException | 503 | SERVER_ |
| BusinessRuleException | 400/422 | BUSINESS_ |

---

## Documents in This Group

| Document # | Document Name | Tasks Covered | Description |
|------------|---------------|---------------|-------------|
| DOC-01 | Client Error Exceptions | Tasks 15-19 | 4xx client error exceptions |
| DOC-02 | Auth & Permission Exceptions | Tasks 20-27 | Auth, token, permission exceptions |
| DOC-03 | Server & Business Exceptions | Tasks 28-30 | 5xx and business logic exceptions |

---

## Task Summary

| Task # | Task Name | Key Points |
|--------|-----------|------------|
| 15 | Create ValidationException | 400 Bad Request - input validation |
| 16 | Create AuthenticationException | 401 Unauthorized - auth failed |
| 17 | Create PermissionDeniedException | 403 Forbidden - no access |
| 18 | Create NotFoundException | 404 Not Found - resource missing |
| 19 | Create ConflictException | 409 Conflict - state conflict |
| 20 | Create RateLimitException | 429 Too Many Requests |
| 21 | Create ServerException | 500 Internal Server Error |
| 22 | Create ServiceUnavailableException | 503 Service Unavailable |
| 23 | Create TenantNotFoundException | Tenant not found (404) |
| 24 | Create TenantInactiveException | Tenant inactive (403) |
| 25 | Create InvalidTokenException | JWT token invalid (401) |
| 26 | Create TokenExpiredException | JWT token expired (401) |
| 27 | Create ResourceExistsException | Duplicate resource (409) |
| 28 | Create BusinessRuleException | Business logic violation |
| 29 | Export All Exceptions | In __init__.py |
| 30 | Document Exception Classes | Complete documentation |

---

## Execution Order

```
[Tasks 15-19: Client Error Exceptions]
        │
        ▼
[Tasks 20-24: Additional Exceptions]
        │
        ▼
[Tasks 25-28: Token & Business Exceptions]
        │
        ▼
[Tasks 29-30: Export & Documentation]
```

---

## Expected Deliverables

### File Structure
```
backend/apps/core/
└── exceptions/
    ├── __init__.py (exports all exceptions)
    ├── base.py
    ├── error_codes.py
    └── api_exceptions.py (all custom exceptions)
```

### Exception Class Requirements
Each exception class should:
- Inherit from APIException base class
- Define default error_code
- Define default message
- Define appropriate status_code
- Accept optional custom message and details
- Be importable from exceptions/__init__.py

### Use Cases
| Exception | When to Use |
|-----------|-------------|
| ValidationException | Invalid form/request data |
| AuthenticationException | Login failure, invalid credentials |
| PermissionDeniedException | User lacks required permission |
| NotFoundException | Requested resource doesn't exist |
| ConflictException | Concurrent modification conflict |
| RateLimitException | Too many requests |
| TenantNotFoundException | Domain/subdomain not mapped |
| TenantInactiveException | Tenant subscription expired |
| BusinessRuleException | Business logic constraint violated |

---

## Notes for AI Agents

1. **Inheritance:** All inherit from APIException
2. **Default Values:** Each exception has sensible defaults
3. **Customizable:** Allow custom message and details
4. **Status Codes:** Match HTTP semantics
5. **Error Codes:** Use consistent naming convention
6. **Export:** All exceptions exported from __init__.py
7. **Documentation:** Include docstrings with examples
