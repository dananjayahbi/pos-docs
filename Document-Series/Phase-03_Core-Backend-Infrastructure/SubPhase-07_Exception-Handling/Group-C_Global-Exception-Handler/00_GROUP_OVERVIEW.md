# Group C: Global Exception Handler

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 07 - Exception Handling  
> **Group:** C of F  
> **Tasks Covered:** 31-46  
> **Group Goal:** Create the global exception handler that catches and formats all exceptions

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-B_Custom-Exception-Classes](../Group-B_Custom-Exception-Classes/)
- **→ Next Group:** [Group-D_Error-Response-Formatting](../Group-D_Error-Response-Formatting/)

---

## Group Overview

This group creates the global exception handler function that intercepts all exceptions and converts them to standardized error responses. It handles both DRF exceptions and custom exceptions.

### Key Components
- **custom_exception_handler Function:** Main handler entry point
- **DRF Exception Handling:** Convert DRF exceptions to standard format
- **Custom Exception Handling:** Handle our APIException subclasses
- **Unexpected Exception Handling:** Catch-all for Python exceptions
- **Request Context:** Include request_id and timestamp

### Exception Types to Handle
| Exception Source | Examples |
|------------------|----------|
| DRF Exceptions | ValidationError, AuthenticationFailed, PermissionDenied, NotFound, Throttled |
| Django Exceptions | Http404, PermissionDenied |
| Custom Exceptions | APIException subclasses |
| Python Exceptions | Unexpected errors (500) |

---

## Documents in This Group

| Document # | Document Name | Tasks Covered | Description |
|------------|---------------|---------------|-------------|
| DOC-01 | Handler Setup | Tasks 31-32 | Create handler file and function |
| DOC-02 | DRF Exception Handling | Tasks 33-38 | Handle DRF exceptions |
| DOC-03 | Custom & Python Exceptions | Tasks 39-41 | Handle custom and unexpected |
| DOC-04 | Context & Registration | Tasks 42-46 | Request context and DRF config |

---

## Task Summary

| Task # | Task Name | Key Points |
|--------|-----------|------------|
| 31 | Create handlers.py File | Exception handlers module |
| 32 | Create custom_exception_handler | Main handler function |
| 33 | Handle DRF ValidationError | Serialize validation errors |
| 34 | Handle DRF AuthenticationFailed | Convert to standard format |
| 35 | Handle DRF NotAuthenticated | Convert to standard format |
| 36 | Handle DRF PermissionDenied | Convert to standard format |
| 37 | Handle DRF NotFound | Convert to standard format |
| 38 | Handle DRF Throttled | Convert to rate limit format |
| 39 | Handle Django Http404 | Convert Django 404 |
| 40 | Handle Custom APIException | Our exception classes |
| 41 | Handle Python Exception | Catch-all for unexpected |
| 42 | Add Request ID | Include in response |
| 43 | Add Timestamp | Include in response |
| 44 | Register Handler in DRF | EXCEPTION_HANDLER setting |
| 45 | Test Exception Handler | Handler tests |
| 46 | Document Handler | Handler documentation |

---

## Execution Order

```
[Tasks 31-32: Handler Setup]
        │
        ▼
[Tasks 33-38: DRF Exceptions]
        │
        ▼
[Tasks 39-41: Custom & Python]
        │
        ▼
[Tasks 42-46: Context & Registration]
```

---

## Expected Deliverables

### File Structure
```
backend/apps/core/
└── exceptions/
    └── handlers.py
```

### Handler Requirements
- Accept `exc` (exception) and `context` (request context)
- Return Response object with standard error format
- Call DRF's default handler first for built-in handling
- Transform all responses to standard format
- Log exceptions appropriately
- Never expose internal details for 500 errors in production

### DRF Configuration
In settings, configure the custom exception handler:
- REST_FRAMEWORK['EXCEPTION_HANDLER'] should point to custom_exception_handler

### Handler Logic Flow
1. Call DRF's default exception handler
2. If handled by DRF, transform to standard format
3. If custom APIException, format using its properties
4. If unhandled Python exception, log and return generic 500
5. Add request_id and timestamp to all responses

---

## Notes for AI Agents

1. **Call Default First:** Call DRF's default handler first
2. **Transform Response:** Convert to standard error format
3. **Request ID:** Get from request.request_id if available
4. **Timestamp:** Use ISO 8601 format
5. **500 Errors:** Log full traceback, return generic message
6. **Environment Check:** Show details in DEBUG mode only
7. **Test Coverage:** Test each exception type
