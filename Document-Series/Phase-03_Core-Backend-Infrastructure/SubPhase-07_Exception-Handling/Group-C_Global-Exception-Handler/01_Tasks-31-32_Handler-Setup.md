# Tasks 31-32: Handler Setup

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 07 - Exception Handling  
> **Group:** C - Global Exception Handler  
> **Document:** 01 of 04  
> **Tasks Covered:** 31, 32

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Group:** [../Group-B_Custom-Exception-Classes/](../Group-B_Custom-Exception-Classes/)
- **→ Next Document:** [02_Tasks-33-38_DRF-Exception-Handling.md](02_Tasks-33-38_DRF-Exception-Handling.md)

---

## Document Overview

This document covers the creation of the global exception handler that intercepts all exceptions and converts them to standardized error responses.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 31 | Create handlers.py File | Simple |
| 32 | Create custom_exception_handler | Medium |

---

## Task 31: Create handlers.py File

### Overview
Create the handlers.py file that will contain the global exception handler function for DRF.

### Dependencies
- Group B: All exception classes created

### Instructions

1. **Create handlers.py file**
   ```bash
   touch backend/apps/core/exceptions/handlers.py
   ```

2. **Add file docstring and imports**
   ```python
   """
   Global Exception Handlers
   
   This module provides the global exception handler for Django REST Framework.
   It intercepts all exceptions and converts them to standardized error responses.
   
   The handler supports:
   - DRF built-in exceptions
   - Django exceptions
   - Custom APIException classes
   - Unexpected Python exceptions
   """
   
   import logging
   from typing import Any, Optional
   from uuid import uuid4
   
   from django.core.exceptions import PermissionDenied as DjangoPermissionDenied
   from django.http import Http404
   from rest_framework import status
   from rest_framework.exceptions import (
       APIException as DRFAPIException,
       AuthenticationFailed,
       NotAuthenticated,
       NotFound,
       PermissionDenied as DRFPermissionDenied,
       Throttled,
       ValidationError as DRFValidationError,
   )
   from rest_framework.response import Response
   from rest_framework.views import exception_handler as drf_exception_handler
   
   from apps.core.exceptions.base import APIException
   from apps.core.exceptions.error_codes import ErrorCode
   
   logger = logging.getLogger(__name__)
   ```

### Expected Outcome
```
backend/apps/core/exceptions/
├── __init__.py
├── base.py
├── error_codes.py
├── api_exceptions.py
└── handlers.py              # New file
```

### Verification Checklist
- [ ] handlers.py file created
- [ ] File docstring added
- [ ] All necessary imports added
- [ ] Logger configured
- [ ] File is valid Python

---

## Task 32: Create custom_exception_handler

### Overview
Create the custom_exception_handler function that serves as the main entry point for all exception handling in DRF.

### Dependencies
- Task 31: handlers.py file exists

### Instructions

1. **Create the custom_exception_handler function**
   ```python
   def custom_exception_handler(exc: Exception, context: dict) -> Optional[Response]:
       """
       Custom exception handler for Django REST Framework.
       
       This handler intercepts all exceptions and converts them to standardized
       error responses. It handles:
       - DRF built-in exceptions
       - Django exceptions (Http404, PermissionDenied)
       - Custom APIException classes
       - Unexpected Python exceptions
       
       Args:
           exc: The exception instance
           context: Context dict with request and view information
           
       Returns:
           Response object with standardized error format
           
       Example:
           In settings.py:
           REST_FRAMEWORK = {
               'EXCEPTION_HANDLER': 'apps.core.exceptions.handlers.custom_exception_handler'
           }
       """
       # Call DRF's default exception handler first
       response = drf_exception_handler(exc, context)
       
       # Get request from context
       request = context.get('request')
       
       # If DRF handled the exception, transform the response
       if response is not None:
           # Will be implemented in next tasks
           pass
       
       # If DRF didn't handle it, check if it's our custom exception
       elif isinstance(exc, APIException):
           # Will be implemented in next tasks
           pass
       
       # Handle Django exceptions
       elif isinstance(exc, Http404):
           # Will be implemented in next tasks
           pass
       
       elif isinstance(exc, DjangoPermissionDenied):
           # Will be implemented in next tasks
           pass
       
       # Handle unexpected exceptions
       else:
           # Will be implemented in next tasks
           pass
       
       return response
   ```

2. **Add helper function for request ID**
   ```python
   def get_request_id(request) -> str:
       """
       Get or generate request ID for tracking.
       
       Args:
           request: Django request object
           
       Returns:
           Request ID string (UUID)
       """
       # Check if request has request_id attribute (from middleware)
       if hasattr(request, 'request_id'):
           return request.request_id
       
       # Generate new request ID
       return str(uuid4())
   ```

3. **Add helper function for request path**
   ```python
   def get_request_path(request) -> str:
       """
       Get the request path safely.
       
       Args:
           request: Django request object
           
       Returns:
           Request path string
       """
       if request is None:
           return ''
       
       return getattr(request, 'path', '')
   ```

### Handler Flow
```
Exception Raised
      │
      ▼
Call DRF's Default Handler
      │
      ├─ DRF Handled? → Transform Response
      │
      ├─ APIException? → Format Custom Exception
      │
      ├─ Http404? → Convert to NotFoundException
      │
      ├─ PermissionDenied? → Convert to PermissionDeniedException
      │
      └─ Other? → Handle as ServerException
```

### Handler Responsibilities
| Responsibility | Description |
|----------------|-------------|
| **DRF Exceptions** | Transform DRF exceptions to standard format |
| **Custom Exceptions** | Format APIException subclasses |
| **Django Exceptions** | Convert Django exceptions to API format |
| **Unexpected Errors** | Catch-all for Python exceptions |
| **Request Context** | Add request_id, timestamp, path |
| **Logging** | Log all errors appropriately |

### Verification Checklist
- [ ] custom_exception_handler function created
- [ ] Function signature correct (exc, context)
- [ ] Returns Optional[Response]
- [ ] Calls drf_exception_handler first
- [ ] get_request_id helper created
- [ ] get_request_path helper created
- [ ] Flow structure in place
- [ ] Docstrings complete

---

## Integration with DRF

### Settings Configuration

Add to `backend/config/settings/base.py`:

```python
REST_FRAMEWORK = {
    # ... other settings ...
    
    'EXCEPTION_HANDLER': 'apps.core.exceptions.handlers.custom_exception_handler',
    
    # Non-field errors key
    'NON_FIELD_ERRORS_KEY': 'non_field_errors',
}
```

### How It Works

1. **Exception Raised:** Any exception in a DRF view
2. **DRF Calls Handler:** DRF calls our custom_exception_handler
3. **Try DRF First:** We call DRF's default handler first
4. **Transform Response:** Convert response to standard format
5. **Return Response:** Return standardized error response

### Why Call DRF Handler First?

Benefits of calling `drf_exception_handler` first:
- Leverages DRF's built-in exception handling
- Handles permissions, throttling, not found automatically
- We just transform the response format
- Don't need to reimplement DRF logic

### Testing the Handler

```python
# Test in Django shell
from apps.core.exceptions import ValidationException
from rest_framework.test import APIRequestFactory
from apps.core.exceptions.handlers import custom_exception_handler

# Create request
factory = APIRequestFactory()
request = factory.get('/api/test/')

# Create exception
exc = ValidationException(message='Test error')

# Call handler
response = custom_exception_handler(exc, {'request': request})

# Check response
print(response.status_code)  # Should be 400
print(response.data)  # Should be standardized format
```

---

## Common Issues and Solutions

### Issue: Handler Not Being Called
**Problem:** Custom handler not intercepting exceptions
**Solution:** Check REST_FRAMEWORK['EXCEPTION_HANDLER'] setting is correct

### Issue: ImportError
**Problem:** Cannot import custom_exception_handler
**Solution:** Ensure path is correct and apps.core is in INSTALLED_APPS

### Issue: Circular Import
**Problem:** Importing handler causes circular import
**Solution:** Import only what's needed, avoid importing at module level

---

## Next Steps

After completing these tasks, proceed to:
1. **Task 33-38:** Implement DRF exception handling logic
2. **Task 39-41:** Implement custom and Python exception handling
3. **Task 42-46:** Add request context and register handler

The handler structure is now in place and ready to be implemented.

---

## Notes for AI Agents

- **Handler Pattern:** Call DRF first, then transform
- **Request Context:** Extract request_id and path
- **Helper Functions:** Keep helpers simple and focused
- **Error Handling:** Handler itself should not raise exceptions
- **Logging:** Log appropriately at different levels
- **Return Type:** Always return Response or None
- **Settings Integration:** Must be registered in REST_FRAMEWORK
