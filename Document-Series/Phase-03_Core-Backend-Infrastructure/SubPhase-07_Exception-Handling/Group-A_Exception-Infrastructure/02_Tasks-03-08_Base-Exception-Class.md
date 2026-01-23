# Tasks 03-08: Base Exception Class

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 07 - Exception Handling  
> **Group:** A - Exception Infrastructure  
> **Document:** 02 of 04  
> **Tasks Covered:** 03, 04, 05, 06, 07, 08

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-01-02_Exception-Module-Setup.md](01_Tasks-01-02_Exception-Module-Setup.md)
- **→ Next Document:** [03_Tasks-09-11_Error-Code-Constants.md](03_Tasks-09-11_Error-Code-Constants.md)

---

## Document Overview

This document covers the creation of the base APIException class that all custom exceptions will inherit from. This base class defines the core properties and behavior for all API exceptions.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 03 | Create base.py File | Simple |
| 04 | Create APIException Base | Medium |
| 05 | Add error_code Property | Simple |
| 06 | Add message Property | Simple |
| 07 | Add details Property | Simple |
| 08 | Add status_code Property | Simple |

---

## Task 03: Create base.py File

### Overview
Create the base.py file that will contain the base exception classes used throughout the application.

### Dependencies
- Task 02: exceptions __init__.py exists

### Instructions

1. **Create the base.py file**
   - Create file named `base.py` in the exceptions directory
   - File path: `backend/apps/core/exceptions/base.py`

2. **Add file docstring**
   ```python
   """
   Base Exception Classes
   
   This module defines the base exception classes for the API. All custom
   exceptions should inherit from APIException to ensure consistent error
   handling and response formatting.
   """
   ```

3. **Add necessary imports**
   ```python
   from typing import Any, Dict, Optional
   ```

### Expected Outcome
```
backend/apps/core/exceptions/
├── __init__.py
└── base.py                   # New file
```

### Verification Checklist
- [ ] `base.py` file exists in exceptions directory
- [ ] File contains docstring
- [ ] File contains necessary imports
- [ ] File is a valid Python file

---

## Task 04: Create APIException Base

### Overview
Create the APIException base class that inherits from Python's Exception class. This will be the parent class for all API-specific exceptions.

### Dependencies
- Task 03: base.py file exists

### Instructions

1. **Define the APIException class**
   ```python
   class APIException(Exception):
       """
       Base exception class for all API exceptions.
       
       All custom API exceptions should inherit from this class to ensure
       consistent error handling, logging, and response formatting.
       
       Attributes:
           error_code (str): Unique error code identifier (e.g., 'VALIDATION_ERROR')
           message (str): Human-readable error message
           details (Dict[str, Any]): Additional error details and context
           status_code (int): HTTP status code (default: 500)
       
       Example:
           >>> raise APIException(
           ...     error_code='SERVER_ERROR',
           ...     message='An unexpected error occurred',
           ...     details={'component': 'payment_processor'},
           ...     status_code=500
           ... )
       """
       pass
   ```

2. **Add class-level default attributes**
   ```python
   # Default values for all API exceptions
   default_error_code = 'API_ERROR'
   default_message = 'An error occurred'
   default_status_code = 500
   ```

### Base Class Design Principles
| Principle | Reason |
|-----------|--------|
| **Inherit from Exception** | Standard Python exception handling |
| **Default Values** | Graceful degradation if not specified |
| **Status Code 500** | Fail-safe to server error if unknown |
| **Immutable Codes** | Error codes should not change after release |
| **JSON Serializable** | All properties must be JSON-safe |

### Verification Checklist
- [ ] APIException class defined
- [ ] Class inherits from Exception
- [ ] Class docstring explains purpose and usage
- [ ] Default class attributes defined
- [ ] Example usage included in docstring

---

## Task 05: Add error_code Property

### Overview
Add the error_code property that uniquely identifies the type of error. This code is used by API consumers to programmatically handle different error types.

### Dependencies
- Task 04: APIException class exists

### Instructions

1. **Add __init__ method signature**
   ```python
   def __init__(
       self,
       error_code: Optional[str] = None,
       message: Optional[str] = None,
       details: Optional[Dict[str, Any]] = None,
       status_code: Optional[int] = None,
   ):
       """
       Initialize an API exception.
       
       Args:
           error_code: Unique error identifier (e.g., 'VALIDATION_ERROR')
           message: Human-readable error message
           details: Additional error context and information
           status_code: HTTP status code for the error response
       """
       pass
   ```

2. **Store error_code property**
   ```python
   # Use provided error_code or fall back to class default
   self.error_code = error_code or self.default_error_code
   ```

3. **Document error_code format**
   - Use UPPER_SNAKE_CASE format
   - Should be descriptive and unique
   - Examples: `VALIDATION_ERROR`, `RESOURCE_NOT_FOUND`, `AUTH_TOKEN_EXPIRED`

### Error Code Naming Convention
| Category | Format | Examples |
|----------|--------|----------|
| **Validation** | VALIDATION_xxx | VALIDATION_ERROR, VALIDATION_FAILED |
| **Authentication** | AUTH_xxx | AUTH_FAILED, AUTH_TOKEN_INVALID |
| **Authorization** | PERMISSION_xxx | PERMISSION_DENIED, PERMISSION_REQUIRED |
| **Resources** | RESOURCE_xxx | RESOURCE_NOT_FOUND, RESOURCE_EXISTS |
| **Server** | SERVER_xxx | SERVER_ERROR, SERVER_UNAVAILABLE |

### Verification Checklist
- [ ] __init__ method defined with error_code parameter
- [ ] error_code stored as instance attribute
- [ ] Falls back to default_error_code if not provided
- [ ] Type hint indicates Optional[str]
- [ ] Naming convention documented

---

## Task 06: Add message Property

### Overview
Add the message property that contains a human-readable description of the error. This message is displayed to end users or logged for debugging.

### Dependencies
- Task 05: error_code property added

### Instructions

1. **Store message property**
   ```python
   # Use provided message or fall back to class default
   self.message = message or self.default_message
   ```

2. **Call parent Exception class**
   ```python
   # Pass message to parent Exception class
   super().__init__(self.message)
   ```

3. **Add message guidelines in docstring**
   - Should be clear and actionable
   - Avoid technical jargon for user-facing errors
   - Include context when helpful
   - Keep it concise (1-2 sentences)

### Message Best Practices
| Do | Don't |
|----|-------|
| "Email address is invalid" | "Regex validation failed on email field" |
| "Resource not found" | "SELECT query returned 0 rows" |
| "Authentication required" | "Token missing from Authorization header" |
| "Permission denied" | "User.has_perm() returned False" |

### Message Localization Considerations
- Messages should be in English by default
- Store as string literals (not f-strings with variables)
- Use details dict for variable data
- Consider i18n/l10n in future for Sinhala support

### Verification Checklist
- [ ] message stored as instance attribute
- [ ] Falls back to default_message if not provided
- [ ] Passed to parent Exception class via super()
- [ ] Message guidelines documented
- [ ] Type hint indicates Optional[str]

---

## Task 07: Add details Property

### Overview
Add the details property that stores additional context and information about the error. This is a dictionary that can contain any JSON-serializable data.

### Dependencies
- Task 06: message property added

### Instructions

1. **Store details property**
   ```python
   # Store additional error details (must be JSON serializable)
   self.details = details or {}
   ```

2. **Add details validation**
   ```python
   # Ensure details is a dictionary
   if not isinstance(self.details, dict):
       self.details = {'value': self.details}
   ```

3. **Document details usage**
   ```python
   """
   The details dict can contain:
   - Field-level validation errors
   - Resource identifiers
   - Suggested actions
   - Related error information
   - Debugging context
   
   Example details:
   {
       'field': 'email',
       'value': 'invalid-email',
       'constraint': 'must be valid email format',
       'suggestion': 'Check email format and try again'
   }
   """
   ```

### Details Dictionary Use Cases
| Use Case | Example |
|----------|---------|
| **Validation Errors** | `{'email': ['Invalid format'], 'age': ['Must be positive']}` |
| **Resource Context** | `{'resource_type': 'Product', 'resource_id': 123}` |
| **Suggestions** | `{'suggestion': 'Try logging in again'}` |
| **Related IDs** | `{'request_id': 'uuid', 'transaction_id': 'tx_123'}` |
| **Debugging** | `{'query_params': {...}, 'attempted_action': 'update'}` |

### JSON Serialization Requirements
All values in the details dict must be JSON-serializable:
- ✅ Strings, numbers, booleans
- ✅ Lists, dicts (nested)
- ✅ None
- ❌ Objects, classes
- ❌ Functions
- ❌ DateTime objects (convert to ISO string first)

### Verification Checklist
- [ ] details stored as instance attribute
- [ ] Defaults to empty dict if not provided
- [ ] Non-dict values wrapped in dict
- [ ] Usage examples documented
- [ ] Type hint indicates Optional[Dict[str, Any]]

---

## Task 08: Add status_code Property

### Overview
Add the status_code property that specifies the HTTP status code to return when this exception is raised. This determines the response status.

### Dependencies
- Task 07: details property added

### Instructions

1. **Store status_code property**
   ```python
   # Use provided status_code or fall back to class default (500)
   self.status_code = status_code or self.default_status_code
   ```

2. **Add status code validation**
   ```python
   # Ensure status_code is a valid HTTP status code
   if not isinstance(self.status_code, int) or self.status_code < 100 or self.status_code > 599:
       self.status_code = 500
   ```

3. **Add __str__ and __repr__ methods**
   ```python
   def __str__(self):
       """String representation of the exception."""
       return f"[{self.error_code}] {self.message}"
   
   def __repr__(self):
       """Developer representation of the exception."""
       return (
           f"{self.__class__.__name__}("
           f"error_code={self.error_code!r}, "
           f"message={self.message!r}, "
           f"status_code={self.status_code})"
       )
   ```

### HTTP Status Code Categories
| Range | Category | When to Use |
|-------|----------|-------------|
| **400-499** | Client Errors | Invalid input, auth failure, not found |
| **500-599** | Server Errors | Unexpected errors, service down |

### Common Status Codes
| Code | Meaning | Exception Type |
|------|---------|----------------|
| 400 | Bad Request | ValidationException |
| 401 | Unauthorized | AuthenticationException |
| 403 | Forbidden | PermissionDeniedException |
| 404 | Not Found | NotFoundException |
| 409 | Conflict | ConflictException |
| 429 | Too Many Requests | RateLimitException |
| 500 | Internal Server Error | ServerException |
| 503 | Service Unavailable | ServiceUnavailableException |

### Verification Checklist
- [ ] status_code stored as instance attribute
- [ ] Falls back to 500 if not provided
- [ ] Validates status_code is in valid range (100-599)
- [ ] __str__ method returns readable format
- [ ] __repr__ method returns developer format
- [ ] Type hint indicates Optional[int]

---

## Complete Implementation

### Full base.py File
```python
"""
Base Exception Classes

This module defines the base exception classes for the API. All custom
exceptions should inherit from APIException to ensure consistent error
handling and response formatting.
"""

from typing import Any, Dict, Optional


class APIException(Exception):
    """
    Base exception class for all API exceptions.
    
    All custom API exceptions should inherit from this class to ensure
    consistent error handling, logging, and response formatting.
    
    Attributes:
        error_code (str): Unique error code identifier (e.g., 'VALIDATION_ERROR')
        message (str): Human-readable error message
        details (Dict[str, Any]): Additional error details and context
        status_code (int): HTTP status code (default: 500)
    
    Example:
        >>> raise APIException(
        ...     error_code='SERVER_ERROR',
        ...     message='An unexpected error occurred',
        ...     details={'component': 'payment_processor'},
        ...     status_code=500
        ... )
    """
    
    # Default values for all API exceptions
    default_error_code = 'API_ERROR'
    default_message = 'An error occurred'
    default_status_code = 500
    
    def __init__(
        self,
        error_code: Optional[str] = None,
        message: Optional[str] = None,
        details: Optional[Dict[str, Any]] = None,
        status_code: Optional[int] = None,
    ):
        """
        Initialize an API exception.
        
        Args:
            error_code: Unique error identifier (e.g., 'VALIDATION_ERROR')
            message: Human-readable error message
            details: Additional error context and information
            status_code: HTTP status code for the error response
        """
        # Use provided values or fall back to defaults
        self.error_code = error_code or self.default_error_code
        self.message = message or self.default_message
        self.details = details or {}
        
        # Ensure details is a dictionary
        if not isinstance(self.details, dict):
            self.details = {'value': self.details}
        
        # Use provided status_code or fall back to default (500)
        self.status_code = status_code or self.default_status_code
        
        # Validate status_code is in valid range
        if not isinstance(self.status_code, int) or self.status_code < 100 or self.status_code > 599:
            self.status_code = 500
        
        # Pass message to parent Exception class
        super().__init__(self.message)
    
    def __str__(self):
        """String representation of the exception."""
        return f"[{self.error_code}] {self.message}"
    
    def __repr__(self):
        """Developer representation of the exception."""
        return (
            f"{self.__class__.__name__}("
            f"error_code={self.error_code!r}, "
            f"message={self.message!r}, "
            f"status_code={self.status_code})"
        )
```

### Usage Examples

**Basic Usage:**
```python
from apps.core.exceptions.base import APIException

# Raise with defaults
raise APIException()

# Raise with custom values
raise APIException(
    error_code='PAYMENT_FAILED',
    message='Payment processing failed',
    details={'gateway': 'PayHere', 'transaction_id': 'tx_123'},
    status_code=400
)
```

**Creating Custom Exceptions:**
```python
class ValidationException(APIException):
    default_error_code = 'VALIDATION_ERROR'
    default_message = 'Validation failed'
    default_status_code = 400

# Use custom exception
raise ValidationException(
    message='Email is required',
    details={'field': 'email'}
)
```

### Expected Outcome
```
backend/apps/core/exceptions/
├── __init__.py
└── base.py                   # Contains APIException
```

### Integration with __init__.py
Update `__init__.py` to export APIException:
```python
from .base import APIException

__all__ = [
    'APIException',
]
```

---

## Testing the Base Exception

### Manual Testing
```python
# Test default values
exc = APIException()
assert exc.error_code == 'API_ERROR'
assert exc.message == 'An error occurred'
assert exc.details == {}
assert exc.status_code == 500

# Test custom values
exc = APIException(
    error_code='TEST_ERROR',
    message='Test message',
    details={'key': 'value'},
    status_code=400
)
assert exc.error_code == 'TEST_ERROR'
assert exc.message == 'Test message'
assert exc.details == {'key': 'value'}
assert exc.status_code == 400

# Test string representations
assert str(exc) == '[TEST_ERROR] Test message'
assert 'TEST_ERROR' in repr(exc)
```

### Unit Test Template
```python
# backend/apps/core/tests/test_exceptions.py
import pytest
from apps.core.exceptions.base import APIException


class TestAPIException:
    def test_default_values(self):
        """Test exception with default values."""
        exc = APIException()
        assert exc.error_code == 'API_ERROR'
        assert exc.message == 'An error occurred'
        assert exc.details == {}
        assert exc.status_code == 500
    
    def test_custom_values(self):
        """Test exception with custom values."""
        exc = APIException(
            error_code='CUSTOM_ERROR',
            message='Custom message',
            details={'field': 'value'},
            status_code=400
        )
        assert exc.error_code == 'CUSTOM_ERROR'
        assert exc.message == 'Custom message'
        assert exc.details == {'field': 'value'}
        assert exc.status_code == 400
    
    def test_str_representation(self):
        """Test string representation."""
        exc = APIException(error_code='TEST', message='Test message')
        assert str(exc) == '[TEST] Test message'
    
    def test_invalid_status_code(self):
        """Test that invalid status codes default to 500."""
        exc = APIException(status_code=999)
        assert exc.status_code == 500
```

---

## Common Issues and Solutions

### Issue: Details Not JSON Serializable
**Problem:** Passing non-JSON-safe objects in details
**Solution:** Convert objects to JSON-safe types (str, int, dict, list)

### Issue: Status Code Outside Valid Range
**Problem:** Passing invalid HTTP status codes
**Solution:** Validation automatically resets to 500

### Issue: None vs Empty Dict for Details
**Problem:** Confusion about when to use None vs {}
**Solution:** Always use {} for consistency, None is converted to {}

---

## Next Steps

After completing these tasks, proceed to:
1. **Task 09-11:** Create error code constants and mappings in `error_codes.py`
2. **Task 12-14:** Create exception registry and write tests
3. **Group B:** Create custom exception classes that inherit from APIException

The base exception class is now complete and ready to be extended.

---

## Notes for AI Agents

- **Inheritance Pattern:** All API exceptions inherit from APIException
- **Default Values:** Use class-level defaults for consistent behavior
- **Status Code Validation:** Always validate status codes are in range
- **JSON Serializable:** Ensure all properties can be JSON serialized
- **String Methods:** Implement both __str__ and __repr__ for debugging
- **Type Hints:** Use Optional for all optional parameters
- **Immutability:** Once raised, exception properties should not change
