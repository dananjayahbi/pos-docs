# Tasks 39-41: Custom & Python Exceptions

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 07 - Exception Handling  
> **Group:** C - Global Exception Handler  
> **Document:** 03 of 04  
> **Tasks Covered:** 39, 40, 41

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [02_Tasks-33-38_DRF-Exception-Handling.md](02_Tasks-33-38_DRF-Exception-Handling.md)
- **→ Next Document:** [04_Tasks-42-46_Context-Registration.md](04_Tasks-42-46_Context-Registration.md)

---

## Document Overview

This document covers handling Django exceptions, custom APIException classes, and unexpected Python exceptions.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 39 | Handle Django Http404 | Medium |
| 40 | Handle Custom APIException | Medium |
| 41 | Handle Python Exception | Medium |

---

## Implementation

Add these handlers to custom_exception_handler after the DRF handling block:

```python
def custom_exception_handler(exc: Exception, context: dict) -> Optional[Response]:
    """Custom exception handler - continued."""
    
    # ... DRF handling code ...
    
    # Get request from context
    request = context.get('request')
    request_id = get_request_id(request)
    request_path = get_request_path(request)
    
    from datetime import datetime
    
    # Task 39: Handle Django Http404
    if isinstance(exc, Http404):
        error_data = {
            'error': {
                'code': ErrorCode.RESOURCE_NOT_FOUND,
                'message': 'Resource not found',
                'details': {},
                'request_id': request_id,
                'timestamp': datetime.utcnow().isoformat() + 'Z',
                'path': request_path
            }
        }
        return Response(error_data, status=status.HTTP_404_NOT_FOUND)
    
    # Handle Django PermissionDenied
    if isinstance(exc, DjangoPermissionDenied):
        error_data = {
            'error': {
                'code': ErrorCode.PERMISSION_DENIED,
                'message': 'Permission denied',
                'details': {},
                'request_id': request_id,
                'timestamp': datetime.utcnow().isoformat() + 'Z',
                'path': request_path
            }
        }
        return Response(error_data, status=status.HTTP_403_FORBIDDEN)
    
    # Task 40: Handle Custom APIException
    if isinstance(exc, APIException):
        error_data = {
            'error': {
                'code': exc.error_code,
                'message': exc.message,
                'details': exc.details,
                'request_id': request_id,
                'timestamp': datetime.utcnow().isoformat() + 'Z',
                'path': request_path
            }
        }
        
        # Log based on status code
        if exc.status_code >= 500:
            logger.error(
                f"Server error: {exc.error_code}",
                exc_info=True,
                extra={
                    'request_id': request_id,
                    'error_code': exc.error_code,
                    'status_code': exc.status_code
                }
            )
        
        return Response(error_data, status=exc.status_code)
    
    # Task 41: Handle Unexpected Python Exception
    logger.error(
        f"Unhandled exception: {type(exc).__name__}",
        exc_info=True,
        extra={
            'request_id': request_id,
            'exception_type': type(exc).__name__,
            'exception_message': str(exc)
        }
    )
    
    error_data = {
        'error': {
            'code': ErrorCode.SERVER_ERROR,
            'message': 'An unexpected error occurred',
            'details': {},
            'request_id': request_id,
            'timestamp': datetime.utcnow().isoformat() + 'Z',
            'path': request_path
        }
    }
    
    # In DEBUG mode, include exception details
    from django.conf import settings
    if settings.DEBUG:
        error_data['error']['details'] = {
            'exception_type': type(exc).__name__,
            'exception_message': str(exc)
        }
    
    return Response(error_data, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
```

---

## Notes for AI Agents

- **Django Exceptions:** Convert to standard format
- **Custom Exceptions:** Use properties directly
- **Unexpected Errors:** Always log with full context
- **Debug Mode:** Include details only in DEBUG
- **Logging:** Different levels for different errors
- **Request ID:** Include in all responses and logs
