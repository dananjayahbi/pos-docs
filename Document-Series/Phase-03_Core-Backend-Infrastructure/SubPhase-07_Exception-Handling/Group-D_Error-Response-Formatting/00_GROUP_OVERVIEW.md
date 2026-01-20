# Group D: Error Response Formatting

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 07 - Exception Handling  
> **Group:** D of F  
> **Tasks Covered:** 47-60  
> **Group Goal:** Create standardized error response format for all API errors

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-C_Global-Exception-Handler](../Group-C_Global-Exception-Handler/)
- **→ Next Group:** [Group-E_Logging-Sentry](../Group-E_Logging-Sentry/)

---

## Group Overview

This group creates the ErrorResponse class that standardizes all error responses. It ensures consistent format across all API errors with proper field structure.

### Key Components
- **ErrorResponse Class:** Builder for error responses
- **Standard Fields:** error_code, message, details, request_id, timestamp, path
- **Validation Error Formatting:** Field-level error details
- **Nested Error Support:** Handle nested serializer errors
- **Conversion Methods:** to_dict() and to_response()

### Standard Error Response Structure
```
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message",
    "details": {...},
    "request_id": "uuid-string",
    "timestamp": "2024-01-17T10:30:00Z",
    "path": "/api/v1/endpoint/"
  }
}
```

---

## Documents in This Group

| Document # | Document Name | Tasks Covered | Description |
|------------|---------------|---------------|-------------|
| DOC-01 | ErrorResponse Class | Tasks 47-53 | Response class with fields |
| DOC-02 | Validation Formatting | Tasks 54-56 | Field-level and nested errors |
| DOC-03 | Conversion Methods | Tasks 57-60 | to_dict, to_response, tests |

---

## Task Summary

| Task # | Task Name | Key Points |
|--------|-----------|------------|
| 47 | Create response.py File | Response formatting module |
| 48 | Create ErrorResponse Class | Error response builder |
| 49 | Add error_code Field | Unique identifier |
| 50 | Add message Field | User-friendly message |
| 51 | Add details Field | Additional error details |
| 52 | Add request_id Field | Tracking identifier |
| 53 | Add timestamp Field | ISO 8601 timestamp |
| 54 | Add path Field | Request path |
| 55 | Format Validation Errors | Field-level error mapping |
| 56 | Format Nested Errors | Nested serializer errors |
| 57 | Create to_dict Method | Dictionary output |
| 58 | Create to_response Method | DRF Response object |
| 59 | Test Response Formatting | Format tests |
| 60 | Document Response Format | Format documentation |

---

## Execution Order

```
[Tasks 47-54: ErrorResponse Class]
        │
        ▼
[Tasks 55-56: Validation Formatting]
        │
        ▼
[Tasks 57-60: Conversion & Tests]
```

---

## Expected Deliverables

### File Structure
```
backend/apps/core/
└── exceptions/
    └── response.py
```

### ErrorResponse Class Requirements
- Accept error_code, message, details, status_code
- Automatically generate timestamp
- Accept request object for request_id and path
- Provide to_dict() method for serialization
- Provide to_response() method for DRF Response

### Validation Error Details Format
For field-level validation errors:
```
{
  "details": {
    "field_name": ["Error message 1", "Error message 2"],
    "nested_field.child_field": ["Error message"]
  }
}
```

### Nested Error Flattening
Convert nested serializer errors to dot notation:
- `{"address": {"city": ["Required"]}}` → `{"address.city": ["Required"]}`

---

## Notes for AI Agents

1. **Wrapper Object:** Errors wrapped in "error" key
2. **Timestamp Format:** ISO 8601 with timezone (UTC)
3. **Request ID:** From request.request_id attribute
4. **Path:** From request.path
5. **Validation Flattening:** Flatten nested errors with dots
6. **Status Code:** Set on Response object, not in body
7. **Immutable:** Once created, don't modify fields
