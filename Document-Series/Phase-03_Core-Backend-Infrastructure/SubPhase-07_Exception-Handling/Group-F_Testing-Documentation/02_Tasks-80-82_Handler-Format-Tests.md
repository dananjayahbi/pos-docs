# Tasks 80-82: Handler & Format Tests

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 07 - Exception Handling  
> **Group:** F - Testing & Documentation  
> **Document:** 02 of 03  
> **Tasks Covered:** 80, 81, 82

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-75-79_Exception-Tests.md](01_Tasks-75-79_Exception-Tests.md)
- **→ Next Document:** [03_Tasks-83-86_Documentation-Verification.md](03_Tasks-83-86_Documentation-Verification.md)

---

## Document Overview

This document covers testing the global exception handler, response formatting, and error logging.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 80 | Test Global Handler | Medium |
| 81 | Test Response Format | Medium |
| 82 | Test Error Logging | Medium |

---

## Task 80: Test Global Handler

Create `backend/apps/core/tests/test_handlers.py`:

```python
"""Tests for global exception handler."""
import pytest
from rest_framework.test import APIRequestFactory
from rest_framework.response import Response
from apps.core.exceptions import ValidationException, NotFoundException, ServerException
from apps.core.exceptions.handlers import custom_exception_handler


class TestExceptionHandler:
    """Test the global exception handler."""
    
    def setup_method(self):
        """Set up test fixtures."""
        self.factory = APIRequestFactory()
    
    def test_validation_exception_handling(self):
        """Test ValidationException is properly handled."""
        request = self.factory.get('/api/test/')
        exc = ValidationException(
            message='Test validation error',
            details={'field': ['error']}
        )
        
        response = custom_exception_handler(exc, {'request': request})
        
        assert isinstance(response, Response)
        assert response.status_code == 400
        assert 'error' in response.data
        assert response.data['error']['code'] == 'VALIDATION_ERROR'
        assert 'request_id' in response.data['error']
        assert 'timestamp' in response.data['error']
    
    def test_not_found_exception_handling(self):
        """Test NotFoundException is properly handled."""
        request = self.factory.get('/api/test/')
        exc = NotFoundException(message='Resource not found')
        
        response = custom_exception_handler(exc, {'request': request})
        
        assert response.status_code == 404
        assert response.data['error']['code'] == 'RESOURCE_NOT_FOUND'
    
    def test_server_exception_handling(self):
        """Test ServerException is properly handled."""
        request = self.factory.get('/api/test/')
        exc = ServerException(message='Server error')
        
        response = custom_exception_handler(exc, {'request': request})
        
        assert response.status_code == 500
        assert response.data['error']['code'] == 'SERVER_ERROR'
    
    def test_response_structure(self):
        """Test response has correct structure."""
        request = self.factory.get('/api/test/')
        exc = ValidationException()
        
        response = custom_exception_handler(exc, {'request': request})
        
        assert 'error' in response.data
        error = response.data['error']
        
        # Check required fields
        assert 'code' in error
        assert 'message' in error
        assert 'details' in error
        assert 'request_id' in error
        assert 'timestamp' in error
        assert 'path' in error
```

---

## Task 81: Test Response Format

Add to `backend/apps/core/tests/test_response.py`:

```python
"""Tests for response formatting."""
import pytest
from apps.core.exceptions.response import ErrorResponse, format_validation_errors


class TestErrorResponseFormat:
    """Test ErrorResponse formatting."""
    
    def test_standard_format(self):
        """Test standard error response format."""
        response = ErrorResponse(
            error_code='TEST_ERROR',
            message='Test message',
            status_code=400,
            details={'key': 'value'}
        )
        
        data = response.to_dict()
        
        assert 'error' in data
        assert data['error']['code'] == 'TEST_ERROR'
        assert data['error']['message'] == 'Test message'
        assert data['error']['details'] == {'key': 'value'}
        assert 'request_id' in data['error']
        assert 'timestamp' in data['error']
    
    def test_validation_error_formatting(self):
        """Test validation error formatting."""
        errors = {
            'email': ['Invalid format'],
            'address': {
                'city': ['Required'],
                'postal_code': ['Invalid']
            }
        }
        
        formatted = format_validation_errors(errors)
        
        assert 'email' in formatted
        assert 'address.city' in formatted
        assert 'address.postal_code' in formatted
        assert formatted['email'] == ['Invalid format']
    
    def test_to_response_method(self):
        """Test to_response returns DRF Response."""
        error = ErrorResponse(
            error_code='TEST',
            message='Test',
            status_code=400
        )
        
        response = error.to_response()
        
        assert response.status_code == 400
        assert 'error' in response.data
```

---

## Task 82: Test Error Logging

Create `backend/apps/core/tests/test_logging.py`:

```python
"""Tests for error logging."""
import pytest
from unittest.mock import Mock, patch
from apps.core.exceptions.logging import log_exception, log_business_rule_violation


class TestErrorLogging:
    """Test error logging utilities."""
    
    @patch('apps.core.exceptions.logging.logger')
    def test_log_exception_basic(self, mock_logger):
        """Test basic exception logging."""
        exc = ValueError('Test error')
        
        log_exception(exc)
        
        mock_logger.error.assert_called_once()
    
    @patch('apps.core.exceptions.logging.logger')
    def test_log_exception_with_request(self, mock_logger):
        """Test exception logging with request context."""
        exc = ValueError('Test error')
        request = Mock()
        request.path = '/api/test/'
        request.method = 'GET'
        request.GET = {}
        request.user = Mock(is_authenticated=False)
        
        log_exception(exc, request=request)
        
        mock_logger.error.assert_called_once()
        call_args = mock_logger.error.call_args
        assert 'extra' in call_args.kwargs
        assert 'path' in call_args.kwargs['extra']
    
    @patch('apps.core.exceptions.logging.logger')
    def test_log_business_rule_violation(self, mock_logger):
        """Test business rule violation logging."""
        log_business_rule_violation(
            rule_name='insufficient_stock',
            details={'product_id': 123}
        )
        
        mock_logger.warning.assert_called_once()
```

---

## Running All Tests

```bash
# Run all exception-related tests
pytest backend/apps/core/tests/test_*.py -v

# With coverage report
pytest backend/apps/core/tests/ --cov=apps.core.exceptions --cov-report=html

# Generate coverage badge
pytest backend/apps/core/tests/ --cov=apps.core.exceptions --cov-report=term
```

---

## Coverage Requirements

- **Minimum Coverage:** 90%
- **Exception Classes:** 100%
- **Handlers:** 95%
- **Response Formatting:** 100%
- **Logging:** 90%

---

## Notes for AI Agents

- **Mock Logger:** Use @patch for logging tests
- **Request Factory:** Use APIRequestFactory for requests
- **Response Validation:** Check structure and fields
- **Coverage:** Aim for > 90%
- **Edge Cases:** Test None values, empty dicts, etc.
