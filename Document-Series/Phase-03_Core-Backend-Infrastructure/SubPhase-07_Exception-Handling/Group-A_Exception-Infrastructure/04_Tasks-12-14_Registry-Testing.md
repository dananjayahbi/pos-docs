# Tasks 12-14: Registry & Testing

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 07 - Exception Handling  
> **Group:** A - Exception Infrastructure  
> **Document:** 04 of 04  
> **Tasks Covered:** 12, 13, 14

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [03_Tasks-09-11_Error-Code-Constants.md](03_Tasks-09-11_Error-Code-Constants.md)
- **→ Next Group:** [../Group-B_Custom-Exception-Classes/](../Group-B_Custom-Exception-Classes/)

---

## Document Overview

This document covers the creation of an exception registry for tracking all exceptions, documentation of the base infrastructure, and comprehensive testing.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 12 | Create Exception Registry | Medium |
| 13 | Document Base Infrastructure | Medium |
| 14 | Test Base Exception | Medium |

---

## Task 12: Create Exception Registry

### Overview
Create a registry system that tracks all exception classes. This enables introspection, documentation generation, and validation that all exceptions are properly configured.

### Dependencies
- Task 08: APIException base class complete
- Task 11: Error codes and mappings defined

### Instructions

1. **Add registry to base.py**
   - Open `backend/apps/core/exceptions/base.py`
   - Add registry at module level

2. **Create the exception registry dictionary**
   ```python
   # Exception registry to track all exception classes
   EXCEPTION_REGISTRY: Dict[str, Type['APIException']] = {}
   ```

3. **Add metaclass for auto-registration**
   ```python
   class ExceptionMeta(type):
       """
       Metaclass that automatically registers exception classes.
       
       When an exception class is defined, it's automatically added to
       the EXCEPTION_REGISTRY for introspection and documentation.
       """
       
       def __new__(mcs, name, bases, namespace):
           cls = super().__new__(mcs, name, bases, namespace)
           
           # Register the exception class (skip base APIException itself)
           if name != 'APIException' and issubclass(cls, Exception):
               EXCEPTION_REGISTRY[name] = cls
           
           return cls
   ```

4. **Update APIException to use metaclass**
   ```python
   class APIException(Exception, metaclass=ExceptionMeta):
       """
       Base exception class for all API exceptions.
       
       This class uses a metaclass to automatically register all subclasses
       in the EXCEPTION_REGISTRY.
       """
       # ... existing code ...
   ```

5. **Add registry query functions**
   ```python
   def get_registered_exceptions() -> Dict[str, Type[APIException]]:
       """
       Get all registered exception classes.
       
       Returns:
           Dictionary mapping exception names to exception classes
       """
       return EXCEPTION_REGISTRY.copy()
   
   
   def get_exception_by_name(name: str) -> Optional[Type[APIException]]:
       """
       Get an exception class by name.
       
       Args:
           name: Name of the exception class
           
       Returns:
           Exception class or None if not found
       """
       return EXCEPTION_REGISTRY.get(name)
   
   
   def list_exception_codes() -> list[str]:
       """
       List all error codes from registered exceptions.
       
       Returns:
           List of error codes
       """
       codes = []
       for exc_class in EXCEPTION_REGISTRY.values():
           if hasattr(exc_class, 'default_error_code'):
               codes.append(exc_class.default_error_code)
       return sorted(set(codes))
   ```

6. **Add validation function**
   ```python
   def validate_exceptions() -> list[str]:
       """
       Validate all registered exceptions have required attributes.
       
       Returns:
           List of validation error messages (empty if all valid)
       """
       errors = []
       
       for name, exc_class in EXCEPTION_REGISTRY.items():
           # Check for required attributes
           if not hasattr(exc_class, 'default_error_code'):
               errors.append(f"{name}: Missing default_error_code")
           
           if not hasattr(exc_class, 'default_message'):
               errors.append(f"{name}: Missing default_message")
           
           if not hasattr(exc_class, 'default_status_code'):
               errors.append(f"{name}: Missing default_status_code")
           
           # Validate status code is valid
           status_code = getattr(exc_class, 'default_status_code', None)
           if status_code and (status_code < 100 or status_code > 599):
               errors.append(f"{name}: Invalid status_code {status_code}")
       
       return errors
   ```

### Registry Benefits
| Benefit | Description |
|---------|-------------|
| **Auto-Discovery** | Automatically find all exception classes |
| **Documentation** | Generate error code documentation |
| **Validation** | Ensure all exceptions properly configured |
| **Introspection** | Query available exceptions at runtime |
| **Testing** | Verify all exceptions are registered |

### Expected Outcome
```python
# Query registered exceptions
exceptions = get_registered_exceptions()
print(f"Found {len(exceptions)} exceptions")

# Get specific exception
ValidationExc = get_exception_by_name('ValidationException')

# List all error codes
codes = list_exception_codes()

# Validate all exceptions
errors = validate_exceptions()
if errors:
    print("Validation errors:", errors)
```

### Verification Checklist
- [ ] EXCEPTION_REGISTRY dictionary created
- [ ] ExceptionMeta metaclass defined
- [ ] APIException uses ExceptionMeta
- [ ] get_registered_exceptions() function defined
- [ ] get_exception_by_name() function defined
- [ ] list_exception_codes() function defined
- [ ] validate_exceptions() function defined
- [ ] Registry functions tested

---

## Task 13: Document Base Infrastructure

### Overview
Create comprehensive documentation for the exception infrastructure including usage examples, best practices, and API reference.

### Dependencies
- Task 12: Exception registry complete

### Instructions

1. **Create documentation directory**
   ```bash
   mkdir -p backend/docs/exceptions/
   ```

2. **Create exceptions.md documentation file**
   - File path: `backend/docs/exceptions/exceptions.md`

3. **Add document header and overview**
   ```markdown
   # Exception Handling Infrastructure
   
   This document describes the exception handling infrastructure for the
   LankaCommerce Cloud API.
   
   ## Overview
   
   The exception system provides:
   - **Standardized Error Responses:** Consistent format for all errors
   - **Error Codes:** Unique identifiers for each error type
   - **HTTP Status Mapping:** Automatic status code assignment
   - **Context Enrichment:** Additional error details and debugging info
   - **Logging Integration:** Automatic error logging with context
   - **Sentry Integration:** Production error tracking
   ```

4. **Document the APIException base class**
   ```markdown
   ## APIException Base Class
   
   All custom exceptions inherit from `APIException`.
   
   ### Properties
   
   | Property | Type | Description |
   |----------|------|-------------|
   | error_code | str | Unique error identifier |
   | message | str | Human-readable error message |
   | details | dict | Additional error context |
   | status_code | int | HTTP status code |
   
   ### Usage
   
   ```python
   from apps.core.exceptions import APIException
   
   raise APIException(
       error_code='PAYMENT_FAILED',
       message='Payment processing failed',
       details={'gateway': 'PayHere', 'transaction_id': 'tx_123'},
       status_code=400
   )
   ```
   ```

5. **Document error codes**
   ```markdown
   ## Error Codes
   
   Error codes are defined in the `ErrorCode` enum and follow the format:
   `CATEGORY_SPECIFIC_ERROR`
   
   ### Categories
   
   - **VALIDATION_xxx:** Input validation errors (400)
   - **AUTH_xxx:** Authentication errors (401)
   - **PERMISSION_xxx:** Authorization errors (403)
   - **RESOURCE_xxx:** Resource errors (404)
   - **CONFLICT_xxx:** State conflict errors (409)
   - **RATE_LIMIT_xxx:** Rate limiting errors (429)
   - **SERVER_xxx:** Server errors (500)
   - **TENANT_xxx:** Multi-tenancy errors (various)
   
   ### Example
   
   ```python
   from apps.core.exceptions.error_codes import ErrorCode
   
   code = ErrorCode.VALIDATION_ERROR
   status = get_status_code_for_error(code)  # Returns 400
   ```
   ```

6. **Document creating custom exceptions**
   ```markdown
   ## Creating Custom Exceptions
   
   To create a custom exception:
   
   1. Inherit from `APIException`
   2. Define default values
   3. Exception is automatically registered
   
   ### Example
   
   ```python
   from apps.core.exceptions import APIException
   from apps.core.exceptions.error_codes import ErrorCode
   
   class PaymentException(APIException):
       default_error_code = ErrorCode.PAYMENT_FAILED
       default_message = 'Payment processing failed'
       default_status_code = 400
   ```
   ```

7. **Document best practices**
   ```markdown
   ## Best Practices
   
   ### When to Create Custom Exceptions
   
   Create custom exceptions for:
   - Domain-specific errors (e.g., PaymentException)
   - Errors that require special handling
   - Errors with specific error codes
   
   ### Error Messages
   
   - Keep messages user-friendly
   - Avoid exposing internal details
   - Be specific about what went wrong
   - Suggest corrective action when possible
   
   ### Error Details
   
   Use the details dict for:
   - Field-level validation errors
   - Resource identifiers
   - Debugging context
   - Related error information
   
   Avoid including:
   - Sensitive data (passwords, tokens)
   - Internal system paths
   - Database queries
   - Stack traces (in production)
   ```

8. **Document error response format**
   ```markdown
   ## Error Response Format
   
   All errors return responses in this format:
   
   ```json
   {
     "error": {
       "code": "VALIDATION_ERROR",
       "message": "Invalid input data",
       "details": {
         "email": ["Invalid email format"],
         "age": ["Must be positive"]
       },
       "request_id": "550e8400-e29b-41d4-a716-446655440000",
       "timestamp": "2024-01-17T10:30:00Z",
       "path": "/api/v1/users/"
     }
   }
   ```
   ```

9. **Add troubleshooting section**
   ```markdown
   ## Troubleshooting
   
   ### Exception Not Caught
   
   **Problem:** Custom exception not being caught by handler
   **Solution:** Ensure exception inherits from APIException
   
   ### Wrong Status Code
   
   **Problem:** Exception returns wrong HTTP status
   **Solution:** Check ERROR_STATUS_MAP mapping for error code
   
   ### Details Not Showing
   
   **Problem:** Details dict not appearing in response
   **Solution:** Ensure values are JSON-serializable
   ```

### Documentation Structure
| Section | Content |
|---------|---------|
| **Overview** | What the system provides |
| **APIException** | Base class documentation |
| **Error Codes** | Error code categories and usage |
| **Custom Exceptions** | How to create new exceptions |
| **Best Practices** | Guidelines for using exceptions |
| **Response Format** | Error response structure |
| **Troubleshooting** | Common issues and solutions |

### Verification Checklist
- [ ] Documentation directory created
- [ ] exceptions.md file created
- [ ] Overview section complete
- [ ] APIException documented
- [ ] Error codes documented
- [ ] Custom exception guide included
- [ ] Best practices documented
- [ ] Response format documented
- [ ] Troubleshooting section included

---

## Task 14: Test Base Exception

### Overview
Create comprehensive unit tests for the base exception infrastructure, including the APIException class, error codes, and registry functions.

### Dependencies
- Task 13: Documentation complete

### Instructions

1. **Create tests directory**
   ```bash
   mkdir -p backend/apps/core/tests/
   touch backend/apps/core/tests/__init__.py
   ```

2. **Create test_exceptions.py file**
   - File path: `backend/apps/core/tests/test_exceptions.py`

3. **Add test imports**
   ```python
   """
   Tests for exception infrastructure.
   """
   import pytest
   from apps.core.exceptions.base import (
       APIException,
       get_registered_exceptions,
       get_exception_by_name,
       list_exception_codes,
       validate_exceptions,
   )
   from apps.core.exceptions.error_codes import ErrorCode, get_status_code_for_error
   ```

4. **Test APIException default values**
   ```python
   class TestAPIException:
       """Tests for the APIException base class."""
       
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
               error_code='TEST_ERROR',
               message='Test message',
               details={'key': 'value'},
               status_code=400
           )
           
           assert exc.error_code == 'TEST_ERROR'
           assert exc.message == 'Test message'
           assert exc.details == {'key': 'value'}
           assert exc.status_code == 400
       
       def test_partial_custom_values(self):
           """Test exception with some custom values."""
           exc = APIException(message='Custom message')
           
           assert exc.error_code == 'API_ERROR'  # Default
           assert exc.message == 'Custom message'  # Custom
           assert exc.details == {}  # Default
           assert exc.status_code == 500  # Default
   ```

5. **Test status code validation**
   ```python
       def test_invalid_status_code_defaults_to_500(self):
           """Test that invalid status codes default to 500."""
           exc = APIException(status_code=999)
           assert exc.status_code == 500
           
           exc = APIException(status_code=50)
           assert exc.status_code == 500
           
           exc = APIException(status_code=-1)
           assert exc.status_code == 500
       
       def test_valid_status_codes(self):
           """Test that valid status codes are accepted."""
           for code in [100, 200, 400, 401, 403, 404, 500, 503]:
               exc = APIException(status_code=code)
               assert exc.status_code == code
   ```

6. **Test string representations**
   ```python
       def test_str_representation(self):
           """Test string representation."""
           exc = APIException(
               error_code='TEST_ERROR',
               message='Test message'
           )
           
           assert str(exc) == '[TEST_ERROR] Test message'
       
       def test_repr_representation(self):
           """Test developer representation."""
           exc = APIException(
               error_code='TEST_ERROR',
               message='Test message',
               status_code=400
           )
           
           repr_str = repr(exc)
           assert 'APIException' in repr_str
           assert 'TEST_ERROR' in repr_str
           assert 'Test message' in repr_str
           assert '400' in repr_str
   ```

7. **Test details dict handling**
   ```python
       def test_details_dict(self):
           """Test details dictionary."""
           exc = APIException(details={'field': 'value'})
           assert exc.details == {'field': 'value'}
       
       def test_details_none_becomes_empty_dict(self):
           """Test that None details becomes empty dict."""
           exc = APIException(details=None)
           assert exc.details == {}
       
       def test_details_non_dict_wrapped(self):
           """Test that non-dict details are wrapped."""
           exc = APIException(details='error message')
           assert exc.details == {'value': 'error message'}
   ```

8. **Test error codes**
   ```python
   class TestErrorCodes:
       """Tests for error codes and mappings."""
       
       def test_error_code_enum_values(self):
           """Test error code enum values."""
           assert ErrorCode.VALIDATION_ERROR == 'VALIDATION_ERROR'
           assert ErrorCode.AUTH_FAILED == 'AUTH_FAILED'
           assert ErrorCode.RESOURCE_NOT_FOUND == 'RESOURCE_NOT_FOUND'
       
       def test_validation_errors_map_to_400(self):
           """Test validation errors map to 400."""
           assert get_status_code_for_error(ErrorCode.VALIDATION_ERROR) == 400
           assert get_status_code_for_error(ErrorCode.INVALID_INPUT) == 400
       
       def test_auth_errors_map_to_401(self):
           """Test auth errors map to 401."""
           assert get_status_code_for_error(ErrorCode.AUTH_FAILED) == 401
           assert get_status_code_for_error(ErrorCode.AUTH_TOKEN_EXPIRED) == 401
       
       def test_permission_errors_map_to_403(self):
           """Test permission errors map to 403."""
           assert get_status_code_for_error(ErrorCode.PERMISSION_DENIED) == 403
       
       def test_resource_errors_map_to_404(self):
           """Test resource errors map to 404."""
           assert get_status_code_for_error(ErrorCode.RESOURCE_NOT_FOUND) == 404
       
       def test_server_errors_map_to_500(self):
           """Test server errors map to 500."""
           assert get_status_code_for_error(ErrorCode.SERVER_ERROR) == 500
       
       def test_unknown_code_defaults_to_500(self):
           """Test unknown codes default to 500."""
           assert get_status_code_for_error('UNKNOWN_CODE') == 500
   ```

9. **Test exception registry**
   ```python
   class TestExceptionRegistry:
       """Tests for the exception registry."""
       
       def test_get_registered_exceptions(self):
           """Test getting all registered exceptions."""
           exceptions = get_registered_exceptions()
           
           assert isinstance(exceptions, dict)
           # APIException itself should not be registered
           assert 'APIException' not in exceptions
       
       def test_get_exception_by_name(self):
           """Test getting exception by name."""
           # Create a test exception
           class TestException(APIException):
               default_error_code = 'TEST'
               default_message = 'Test'
               default_status_code = 400
           
           # Should be able to retrieve it
           exc_class = get_exception_by_name('TestException')
           assert exc_class is TestException
       
       def test_get_nonexistent_exception(self):
           """Test getting nonexistent exception returns None."""
           exc_class = get_exception_by_name('NonexistentException')
           assert exc_class is None
       
       def test_list_exception_codes(self):
           """Test listing all exception codes."""
           codes = list_exception_codes()
           
           assert isinstance(codes, list)
           assert 'API_ERROR' in codes  # From APIException
       
       def test_validate_exceptions(self):
           """Test exception validation."""
           # Create valid exception
           class ValidException(APIException):
               default_error_code = 'VALID'
               default_message = 'Valid'
               default_status_code = 400
           
           # Validation should pass (or at least not fail for ValidException)
           errors = validate_exceptions()
           
           # Should be a list
           assert isinstance(errors, list)
   ```

10. **Test inheritance**
    ```python
    class TestInheritance:
        """Tests for exception inheritance."""
        
        def test_custom_exception_inherits_properties(self):
            """Test custom exception inherits from APIException."""
            class CustomException(APIException):
                default_error_code = 'CUSTOM_ERROR'
                default_message = 'Custom error'
                default_status_code = 422
            
            exc = CustomException()
            
            assert exc.error_code == 'CUSTOM_ERROR'
            assert exc.message == 'Custom error'
            assert exc.status_code == 422
        
        def test_custom_exception_can_override_values(self):
            """Test custom exception can override at instantiation."""
            class CustomException(APIException):
                default_error_code = 'CUSTOM_ERROR'
                default_message = 'Custom error'
                default_status_code = 422
            
            exc = CustomException(
                message='Override message',
                details={'info': 'test'}
            )
            
            assert exc.error_code == 'CUSTOM_ERROR'
            assert exc.message == 'Override message'
            assert exc.details == {'info': 'test'}
            assert exc.status_code == 422
    ```

11. **Run the tests**
    ```bash
    # Run all exception tests
    pytest backend/apps/core/tests/test_exceptions.py -v
    
    # Run with coverage
    pytest backend/apps/core/tests/test_exceptions.py --cov=apps.core.exceptions
    ```

### Test Coverage Requirements
| Component | Coverage Target |
|-----------|----------------|
| **APIException** | 100% - all branches |
| **Error Codes** | 100% - all mappings |
| **Registry** | 100% - all functions |
| **Validation** | 100% - edge cases |

### Verification Checklist
- [ ] test_exceptions.py file created
- [ ] TestAPIException class complete
- [ ] Default values tested
- [ ] Custom values tested
- [ ] Status code validation tested
- [ ] String representations tested
- [ ] Details dict handling tested
- [ ] TestErrorCodes class complete
- [ ] All error code mappings tested
- [ ] TestExceptionRegistry class complete
- [ ] Registry functions tested
- [ ] TestInheritance class complete
- [ ] All tests passing
- [ ] Test coverage > 90%

---

## Complete Test File

### Full test_exceptions.py File
```python
"""
Tests for exception infrastructure.
"""
import pytest
from apps.core.exceptions.base import (
    APIException,
    get_registered_exceptions,
    get_exception_by_name,
    list_exception_codes,
    validate_exceptions,
)
from apps.core.exceptions.error_codes import ErrorCode, get_status_code_for_error


class TestAPIException:
    """Tests for the APIException base class."""
    
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
            error_code='TEST_ERROR',
            message='Test message',
            details={'key': 'value'},
            status_code=400
        )
        
        assert exc.error_code == 'TEST_ERROR'
        assert exc.message == 'Test message'
        assert exc.details == {'key': 'value'}
        assert exc.status_code == 400
    
    def test_partial_custom_values(self):
        """Test exception with some custom values."""
        exc = APIException(message='Custom message')
        
        assert exc.error_code == 'API_ERROR'
        assert exc.message == 'Custom message'
        assert exc.details == {}
        assert exc.status_code == 500
    
    def test_invalid_status_code_defaults_to_500(self):
        """Test that invalid status codes default to 500."""
        exc = APIException(status_code=999)
        assert exc.status_code == 500
        
        exc = APIException(status_code=50)
        assert exc.status_code == 500
        
        exc = APIException(status_code=-1)
        assert exc.status_code == 500
    
    def test_valid_status_codes(self):
        """Test that valid status codes are accepted."""
        for code in [100, 200, 400, 401, 403, 404, 500, 503]:
            exc = APIException(status_code=code)
            assert exc.status_code == code
    
    def test_str_representation(self):
        """Test string representation."""
        exc = APIException(
            error_code='TEST_ERROR',
            message='Test message'
        )
        
        assert str(exc) == '[TEST_ERROR] Test message'
    
    def test_repr_representation(self):
        """Test developer representation."""
        exc = APIException(
            error_code='TEST_ERROR',
            message='Test message',
            status_code=400
        )
        
        repr_str = repr(exc)
        assert 'APIException' in repr_str
        assert 'TEST_ERROR' in repr_str
        assert 'Test message' in repr_str
        assert '400' in repr_str
    
    def test_details_dict(self):
        """Test details dictionary."""
        exc = APIException(details={'field': 'value'})
        assert exc.details == {'field': 'value'}
    
    def test_details_none_becomes_empty_dict(self):
        """Test that None details becomes empty dict."""
        exc = APIException(details=None)
        assert exc.details == {}
    
    def test_details_non_dict_wrapped(self):
        """Test that non-dict details are wrapped."""
        exc = APIException(details='error message')
        assert exc.details == {'value': 'error message'}


class TestErrorCodes:
    """Tests for error codes and mappings."""
    
    def test_error_code_enum_values(self):
        """Test error code enum values."""
        assert ErrorCode.VALIDATION_ERROR == 'VALIDATION_ERROR'
        assert ErrorCode.AUTH_FAILED == 'AUTH_FAILED'
        assert ErrorCode.RESOURCE_NOT_FOUND == 'RESOURCE_NOT_FOUND'
    
    def test_validation_errors_map_to_400(self):
        """Test validation errors map to 400."""
        assert get_status_code_for_error(ErrorCode.VALIDATION_ERROR) == 400
        assert get_status_code_for_error(ErrorCode.INVALID_INPUT) == 400
    
    def test_auth_errors_map_to_401(self):
        """Test auth errors map to 401."""
        assert get_status_code_for_error(ErrorCode.AUTH_FAILED) == 401
        assert get_status_code_for_error(ErrorCode.AUTH_TOKEN_EXPIRED) == 401
    
    def test_permission_errors_map_to_403(self):
        """Test permission errors map to 403."""
        assert get_status_code_for_error(ErrorCode.PERMISSION_DENIED) == 403
    
    def test_resource_errors_map_to_404(self):
        """Test resource errors map to 404."""
        assert get_status_code_for_error(ErrorCode.RESOURCE_NOT_FOUND) == 404
    
    def test_server_errors_map_to_500(self):
        """Test server errors map to 500."""
        assert get_status_code_for_error(ErrorCode.SERVER_ERROR) == 500
    
    def test_unknown_code_defaults_to_500(self):
        """Test unknown codes default to 500."""
        assert get_status_code_for_error('UNKNOWN_CODE') == 500


class TestExceptionRegistry:
    """Tests for the exception registry."""
    
    def test_get_registered_exceptions(self):
        """Test getting all registered exceptions."""
        exceptions = get_registered_exceptions()
        
        assert isinstance(exceptions, dict)
        assert 'APIException' not in exceptions
    
    def test_get_exception_by_name(self):
        """Test getting exception by name."""
        class TestException(APIException):
            default_error_code = 'TEST'
            default_message = 'Test'
            default_status_code = 400
        
        exc_class = get_exception_by_name('TestException')
        assert exc_class is TestException
    
    def test_get_nonexistent_exception(self):
        """Test getting nonexistent exception returns None."""
        exc_class = get_exception_by_name('NonexistentException')
        assert exc_class is None
    
    def test_list_exception_codes(self):
        """Test listing all exception codes."""
        codes = list_exception_codes()
        
        assert isinstance(codes, list)
        assert 'API_ERROR' in codes
    
    def test_validate_exceptions(self):
        """Test exception validation."""
        class ValidException(APIException):
            default_error_code = 'VALID'
            default_message = 'Valid'
            default_status_code = 400
        
        errors = validate_exceptions()
        assert isinstance(errors, list)


class TestInheritance:
    """Tests for exception inheritance."""
    
    def test_custom_exception_inherits_properties(self):
        """Test custom exception inherits from APIException."""
        class CustomException(APIException):
            default_error_code = 'CUSTOM_ERROR'
            default_message = 'Custom error'
            default_status_code = 422
        
        exc = CustomException()
        
        assert exc.error_code == 'CUSTOM_ERROR'
        assert exc.message == 'Custom error'
        assert exc.status_code == 422
    
    def test_custom_exception_can_override_values(self):
        """Test custom exception can override at instantiation."""
        class CustomException(APIException):
            default_error_code = 'CUSTOM_ERROR'
            default_message = 'Custom error'
            default_status_code = 422
        
        exc = CustomException(
            message='Override message',
            details={'info': 'test'}
        )
        
        assert exc.error_code == 'CUSTOM_ERROR'
        assert exc.message == 'Override message'
        assert exc.details == {'info': 'test'}
        assert exc.status_code == 422
```

### Running the Tests
```bash
# Run all tests
pytest backend/apps/core/tests/test_exceptions.py -v

# Run with coverage
pytest backend/apps/core/tests/test_exceptions.py --cov=apps.core.exceptions --cov-report=html

# Run specific test class
pytest backend/apps/core/tests/test_exceptions.py::TestAPIException -v

# Run specific test
pytest backend/apps/core/tests/test_exceptions.py::TestAPIException::test_default_values -v
```

---

## Group A Summary

### Completed Tasks
✅ Task 01: Create exceptions Module  
✅ Task 02: Create exceptions __init__.py  
✅ Task 03: Create base.py File  
✅ Task 04: Create APIException Base  
✅ Task 05: Add error_code Property  
✅ Task 06: Add message Property  
✅ Task 07: Add details Property  
✅ Task 08: Add status_code Property  
✅ Task 09: Create error_codes.py  
✅ Task 10: Define Error Code Enum  
✅ Task 11: Map Codes to HTTP Status  
✅ Task 12: Create Exception Registry  
✅ Task 13: Document Base Infrastructure  
✅ Task 14: Test Base Exception  

### Files Created
```
backend/
├── apps/core/
│   ├── exceptions/
│   │   ├── __init__.py
│   │   ├── base.py
│   │   └── error_codes.py
│   └── tests/
│       ├── __init__.py
│       └── test_exceptions.py
└── docs/exceptions/
    └── exceptions.md
```

### Next Steps
Proceed to **Group B: Custom Exception Classes** to create all the specific exception classes that inherit from APIException.

---

## Notes for AI Agents

- **Registry Pattern:** Automatic registration via metaclass
- **Validation:** Ensure all exceptions have required attributes
- **Testing:** Comprehensive test coverage for base infrastructure
- **Documentation:** Keep docs in sync with implementation
- **Type Hints:** Use proper type annotations throughout
- **Error Handling:** Test edge cases and invalid inputs
- **Coverage:** Aim for > 90% test coverage
