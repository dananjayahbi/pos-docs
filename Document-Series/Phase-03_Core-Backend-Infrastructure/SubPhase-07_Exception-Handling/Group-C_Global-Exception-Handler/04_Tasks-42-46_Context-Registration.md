# Tasks 42-46: Context & Registration

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 07 - Exception Handling  
> **Group:** C - Global Exception Handler  
> **Document:** 04 of 04  
> **Tasks Covered:** 42, 43, 44, 45, 46

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [03_Tasks-39-41_Custom-Python-Exceptions.md](03_Tasks-39-41_Custom-Python-Exceptions.md)
- **→ Next Group:** [../Group-D_Error-Response-Formatting/](../Group-D_Error-Response-Formatting/)

---

## Document Overview

This document covers adding request context (request_id, timestamp), registering the handler in DRF, and testing.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 42 | Add Request ID | Simple |
| 43 | Add Timestamp | Simple |
| 44 | Register Handler in DRF | Simple |
| 45 | Test Exception Handler | Medium |
| 46 | Document Handler | Medium |

---

## Task 42-43: Request ID and Timestamp

Already implemented in previous tasks. Ensureall error responses include:

```python
{
    'error': {
        'request_id': request_id,  # Task 42
        'timestamp': datetime.utcnow().isoformat() + 'Z',  # Task 43
        # ... other fields
    }
}
```

---

## Task 44: Register Handler in DRF

Update `config/settings/base.py`:

```python
REST_FRAMEWORK = {
    'EXCEPTION_HANDLER': 'apps.core.exceptions.handlers.custom_exception_handler',
    'NON_FIELD_ERRORS_KEY': 'non_field_errors',
    # ... other settings
}
```

---

## Task 45: Test Exception Handler

Create `backend/apps/core/tests/test_handlers.py`:

```python
"""Tests for exception handlers."""
import pytest
from rest_framework.test import APIRequestFactory
from apps.core.exceptions import ValidationException, NotFoundException
from apps.core.exceptions.handlers import custom_exception_handler


class TestExceptionHandler:
    def setup_method(self):
        self.factory = APIRequestFactory()
    
    def test_validation_exception(self):
        """Test ValidationException handling."""
        request = self.factory.get('/api/test/')
        exc = ValidationException(message='Test error')
        response = custom_exception_handler(exc, {'request': request})
        
        assert response.status_code == 400
        assert 'error' in response.data
        assert response.data['error']['code'] == 'VALIDATION_ERROR'
    
    def test_not_found_exception(self):
        """Test NotFoundException handling."""
        request = self.factory.get('/api/test/')
        exc = NotFoundException(message='Not found')
        response = custom_exception_handler(exc, {'request': request})
        
        assert response.status_code == 404
        assert response.data['error']['code'] == 'RESOURCE_NOT_FOUND'
```

---

## Task 46: Document Handler

Document in `docs/exceptions/handlers.md`:

```markdown
# Exception Handlers

## custom_exception_handler

The global exception handler for all API exceptions.

### Configuration

```python
REST_FRAMEWORK = {
    'EXCEPTION_HANDLER': 'apps.core.exceptions.handlers.custom_exception_handler'
}
```

### Handling Order

1. Call DRF's default handler
2. Transform DRF exceptions
3. Handle Django exceptions
4. Handle custom APIException
5. Handle unexpected exceptions

### Response Format

All exceptions return:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Error message",
    "details": {},
    "request_id": "uuid",
    "timestamp": "2024-01-17T10:00:00Z",
    "path": "/api/endpoint/"
  }
}
```
```

---

## Group C Complete

✅ All exception handler tasks completed
✅ Handler registered in DRF
✅ Tests created
✅ Documentation complete

---

## Notes for AI Agents

- **Registration:** Must be in REST_FRAMEWORK settings
- **Testing:** Test each exception type
- **Documentation:** Keep handler docs updated
- **Request Context:** Always include request_id and timestamp
