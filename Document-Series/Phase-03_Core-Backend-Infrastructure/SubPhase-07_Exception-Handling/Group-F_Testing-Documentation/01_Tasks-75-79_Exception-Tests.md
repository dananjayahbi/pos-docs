# Tasks 75-79: Exception Tests

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 07 - Exception Handling  
> **Group:** F - Testing & Documentation  
> **Document:** 01 of 03  
> **Tasks Covered:** 75, 76, 77, 78, 79

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Group:** [../Group-E_Logging-Sentry/](../Group-E_Logging-Sentry/)
- **→ Next Document:** [02_Tasks-80-82_Handler-Format-Tests.md](02_Tasks-80-82_Handler-Format-Tests.md)

---

## Document Overview

This document covers comprehensive testing for all exception classes.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 75 | Create Exception Tests Module | Simple |
| 76 | Test ValidationException | Medium |
| 77 | Test AuthenticationException | Medium |
| 78 | Test PermissionDeniedException | Medium |
| 79 | Test NotFoundException | Medium |

---

## Implementation

Create `backend/apps/core/tests/test_exceptions.py`:

```python
"""
Comprehensive tests for exception classes.
"""
import pytest
from apps.core.exceptions import (
    ValidationException,
    AuthenticationException,
    PermissionDeniedException,
    NotFoundException,
    ConflictException,
    RateLimitException,
    ServerException,
    TenantNotFoundException,
    InvalidTokenException,
    BusinessRuleException,
)
from apps.core.exceptions.error_codes import ErrorCode


class TestValidationException:
    """Test ValidationException class."""
    
    def test_default_values(self):
        """Test exception with default values."""
        exc = ValidationException()
        
        assert exc.error_code == ErrorCode.VALIDATION_ERROR
        assert exc.status_code == 400
        assert 'validation' in exc.message.lower()
        assert exc.details == {}
    
    def test_custom_message(self):
        """Test exception with custom message."""
        exc = ValidationException(message='Custom validation error')
        
        assert exc.message == 'Custom validation error'
        assert exc.status_code == 400
    
    def test_with_field_details(self):
        """Test exception with field-level errors."""
        exc = ValidationException(
            message='Validation failed',
            details={
                'email': ['Invalid format', 'Already exists'],
                'password': ['Too short']
            }
        )
        
        assert 'email' in exc.details
        assert len(exc.details['email']) == 2
        assert 'password' in exc.details


class TestAuthenticationException:
    """Test AuthenticationException class."""
    
    def test_default_values(self):
        """Test exception with default values."""
        exc = AuthenticationException()
        
        assert exc.error_code == ErrorCode.AUTH_FAILED
        assert exc.status_code == 401
    
    def test_custom_message(self):
        """Test with custom message."""
        exc = AuthenticationException(message='Invalid credentials')
        
        assert exc.message == 'Invalid credentials'


class TestPermissionDeniedException:
    """Test PermissionDeniedException class."""
    
    def test_default_values(self):
        """Test exception with default values."""
        exc = PermissionDeniedException()
        
        assert exc.error_code == ErrorCode.PERMISSION_DENIED
        assert exc.status_code == 403
    
    def test_with_required_permission(self):
        """Test with required permission details."""
        exc = PermissionDeniedException(
            message='Admin access required',
            details={'required_role': 'admin'}
        )
        
        assert 'required_role' in exc.details


class TestNotFoundException:
    """Test NotFoundException class."""
    
    def test_default_values(self):
        """Test exception with default values."""
        exc = NotFoundException()
        
        assert exc.error_code == ErrorCode.RESOURCE_NOT_FOUND
        assert exc.status_code == 404
    
    def test_with_resource_details(self):
        """Test with resource details."""
        exc = NotFoundException(
            message='Product not found',
            details={'product_id': 123, 'resource_type': 'Product'}
        )
        
        assert exc.details['product_id'] == 123
        assert exc.details['resource_type'] == 'Product'


class TestAllExceptionClasses:
    """Test all exception classes have required attributes."""
    
    @pytest.mark.parametrize('exception_class,expected_status', [
        (ValidationException, 400),
        (AuthenticationException, 401),
        (PermissionDeniedException, 403),
        (NotFoundException, 404),
        (ConflictException, 409),
        (RateLimitException, 429),
        (ServerException, 500),
    ])
    def test_exception_status_codes(self, exception_class, expected_status):
        """Test all exceptions have correct status codes."""
        exc = exception_class()
        assert exc.status_code == expected_status
    
    def test_all_have_error_codes(self):
        """Test all exceptions have error codes."""
        exceptions = [
            ValidationException(),
            AuthenticationException(),
            PermissionDeniedException(),
            NotFoundException(),
        ]
        
        for exc in exceptions:
            assert exc.error_code
            assert isinstance(exc.error_code, str)
```

---

## Running Tests

```bash
# Run all exception tests
pytest backend/apps/core/tests/test_exceptions.py -v

# Run specific test class
pytest backend/apps/core/tests/test_exceptions.py::TestValidationException -v

# Run with coverage
pytest backend/apps/core/tests/test_exceptions.py --cov=apps.core.exceptions
```

---

## Notes for AI Agents

- **Comprehensive:** Test all exception classes
- **Default Values:** Always test defaults
- **Custom Values:** Test with custom messages/details
- **Parametrize:** Use pytest.mark.parametrize for multiple cases
- **Status Codes:** Verify correct HTTP status
- **Error Codes:** Verify correct error codes
