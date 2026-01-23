# Tasks 33-38: DRF Exception Handling

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 07 - Exception Handling  
> **Group:** C - Global Exception Handler  
> **Document:** 02 of 04  
> **Tasks Covered:** 33, 34, 35, 36, 37, 38

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-31-32_Handler-Setup.md](01_Tasks-31-32_Handler-Setup.md)
- **→ Next Document:** [03_Tasks-39-41_Custom-Python-Exceptions.md](03_Tasks-39-41_Custom-Python-Exceptions.md)

---

## Document Overview

This document covers the implementation of DRF exception handling logic in the custom_exception_handler function.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 33 | Handle DRF ValidationError | Medium |
| 34 | Handle DRF AuthenticationFailed | Medium |
| 35 | Handle DRF NotAuthenticated | Medium |
| 36 | Handle DRF PermissionDenied | Medium |
| 37 | Handle DRF NotFound | Medium |
| 38 | Handle DRF Throttled | Medium |

---

## Implementation

All tasks in this document involve adding logic to the `custom_exception_handler` function in handlers.py. Below is the complete implementation:

```python
def custom_exception_handler(exc: Exception, context: dict) -> Optional[Response]:
    """Custom exception handler for Django REST Framework."""
    
    # Call DRF's default exception handler first
    response = drf_exception_handler(exc, context)
    
    # Get request from context
    request = context.get('request')
    request_id = get_request_id(request)
    request_path = get_request_path(request)
    
    # If DRF handled the exception, transform the response
    if response is not None:
        error_data = {
            'error': {
                'code': ErrorCode.VALIDATION_ERROR,
                'message': 'Validation failed',
                'details': {},
                'request_id': request_id,
                'timestamp': datetime.utcnow().isoformat() + 'Z',
                'path': request_path
            }
        }
        
        # Task 33: Handle DRF ValidationError
        if isinstance(exc, DRFValidationError):
            error_data['error']['code'] = ErrorCode.VALIDATION_ERROR
            error_data['error']['message'] = 'Validation failed'
            error_data['error']['details'] = flatten_validation_errors(response.data)
        
        # Task 34: Handle DRF AuthenticationFailed
        elif isinstance(exc, AuthenticationFailed):
            error_data['error']['code'] = ErrorCode.AUTH_FAILED
            error_data['error']['message'] = str(exc) or 'Authentication failed'
        
        # Task 35: Handle DRF NotAuthenticated
        elif isinstance(exc, NotAuthenticated):
            error_data['error']['code'] = ErrorCode.AUTH_REQUIRED
            error_data['error']['message'] = str(exc) or 'Authentication required'
        
        # Task 36: Handle DRF PermissionDenied
        elif isinstance(exc, DRFPermissionDenied):
            error_data['error']['code'] = ErrorCode.PERMISSION_DENIED
            error_data['error']['message'] = str(exc) or 'Permission denied'
        
        # Task 37: Handle DRF NotFound
        elif isinstance(exc, NotFound):
            error_data['error']['code'] = ErrorCode.RESOURCE_NOT_FOUND
            error_data['error']['message'] = str(exc) or 'Resource not found'
        
        # Task 38: Handle DRF Throttled
        elif isinstance(exc, Throttled):
            error_data['error']['code'] = ErrorCode.RATE_LIMIT_EXCEEDED
            error_data['error']['message'] = str(exc) or 'Rate limit exceeded'
            error_data['error']['details'] = {
                'wait': exc.wait,
                'retry_after': exc.wait
            }
        
        # Generic DRF exception
        else:
            error_data['error']['message'] = str(exc) or 'An error occurred'
            if hasattr(exc, 'detail'):
                error_data['error']['details'] = exc.detail
        
        return Response(error_data, status=response.status_code)
    
    # Continue with custom exception handling...
    return response


def flatten_validation_errors(errors: Any, parent_key: str = '') -> dict:
    """
    Flatten nested validation errors into dot notation.
    
    Args:
        errors: Validation errors (dict, list, or str)
        parent_key: Parent key for nested fields
        
    Returns:
        Flattened errors dict
    """
    flattened = {}
    
    if isinstance(errors, dict):
        for key, value in errors.items():
            new_key = f"{parent_key}.{key}" if parent_key else key
            if isinstance(value, (dict, list)):
                flattened.update(flatten_validation_errors(value, new_key))
            else:
                flattened[new_key] = [str(value)] if not isinstance(value, list) else [str(v) for v in value]
    elif isinstance(errors, list):
        flattened[parent_key] = [str(e) for e in errors]
    else:
        flattened[parent_key] = [str(errors)]
    
    return flattened
```

---

## Verification Checklist

- [ ] DRF ValidationError handled
- [ ] DRF AuthenticationFailed handled
- [ ] DRF NotAuthenticated handled
- [ ] DRF PermissionDenied handled
- [ ] DRF NotFound handled
- [ ] DRF Throttled handled
- [ ] flatten_validation_errors function implemented
- [ ] All cases return Response with standard format

---

## Notes for AI Agents

- **DRF First:** Always call drf_exception_handler first
- **Transform:** Convert DRF responses to standard format
- **Error Codes:** Map DRF exceptions to our ErrorCode enum
- **Validation Flattening:** Convert nested errors to dot notation
- **Throttled:** Include wait time in details
- **Status Codes:** Preserve DRF's status codes
