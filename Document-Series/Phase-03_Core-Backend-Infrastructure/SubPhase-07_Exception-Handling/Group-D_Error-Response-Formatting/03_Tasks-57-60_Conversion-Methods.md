# Tasks 57-60: Conversion Methods

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 07 - Exception Handling  
> **Group:** D - Error Response Formatting  
> **Document:** 03 of 03  
> **Tasks Covered:** 57, 58, 59, 60

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [02_Tasks-55-56_Validation-Formatting.md](02_Tasks-55-56_Validation-Formatting.md)
- **→ Next Group:** [../Group-E_Logging-Sentry/](../Group-E_Logging-Sentry/)

---

## Document Overview

This document covers the to_dict and to_response methods, testing, and documentation.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 57 | Create to_dict Method | Simple |
| 58 | Create to_response Method | Simple |
| 59 | Test Response Formatting | Medium |
| 60 | Document Response Format | Medium |

---

## Tasks 57-58: Already Implemented

The to_dict and to_response methods are already implemented in ErrorResponse class.

---

## Task 59: Test Response Formatting

Create `backend/apps/core/tests/test_response.py`:

```python
"""Tests for error response formatting."""
import pytest
from apps.core.exceptions.response import ErrorResponse, format_validation_errors


class TestErrorResponse:
    def test_basic_response(self):
        """Test basic error response."""
        error = ErrorResponse(
            error_code='TEST_ERROR',
            message='Test message',
            status_code=400
        )
        
        data = error.to_dict()
        assert data['error']['code'] == 'TEST_ERROR'
        assert data['error']['message'] == 'Test message'
        assert 'request_id' in data['error']
        assert 'timestamp' in data['error']
    
    def test_to_response(self):
        """Test DRF Response conversion."""
        error = ErrorResponse(
            error_code='TEST_ERROR',
            message='Test',
            status_code=400
        )
        
        response = error.to_response()
        assert response.status_code == 400
        assert 'error' in response.data


class TestValidationFormatting:
    def test_simple_errors(self):
        """Test simple validation errors."""
        errors = {'email': ['Invalid'], 'age': ['Required']}
        formatted = format_validation_errors(errors)
        
        assert formatted['email'] == ['Invalid']
        assert formatted['age'] == ['Required']
    
    def test_nested_errors(self):
        """Test nested validation errors."""
        errors = {'address': {'city': ['Required']}}
        formatted = format_validation_errors(errors)
        
        assert 'address.city' in formatted
        assert formatted['address.city'] == ['Required']
```

---

## Task 60: Document Response Format

Update `docs/exceptions/response_format.md`:

```markdown
# Error Response Format

All API errors return standardized JSON format:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message",
    "details": {},
    "request_id": "uuid-string",
    "timestamp": "2024-01-17T10:00:00Z",
    "path": "/api/v1/endpoint/"
  }
}
```

## Fields

- **code:** Unique error identifier (UPPER_SNAKE_CASE)
- **message:** User-friendly error description
- **details:** Additional context (field errors, IDs, etc.)
- **request_id:** Tracking UUID for logs
- **timestamp:** ISO 8601 UTC timestamp
- **path:** Request path that generated error

## Validation Errors

Field-level errors use dot notation:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": {
      "email": ["Invalid format"],
      "address.city": ["Required"],
      "address.postal_code": ["Invalid"]
    }
  }
}
```
```

---

## Group D Complete

✅ ErrorResponse class created
✅ Validation formatting implemented
✅ Conversion methods complete
✅ Tests written
✅ Documentation complete

---

## Notes for AI Agents

- **Standard Format:** Consistent across all errors
- **Validation Flattening:** Nested → dot notation
- **Two Methods:** to_dict() and to_response()
- **Testing:** Test both simple and nested errors
- **Documentation:** Keep format docs updated
