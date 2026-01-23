# Tasks 43-44: Registration & Testing

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 06 - Core Middleware Stack  
> **Group:** C - Request Logging Middleware  
> **Document:** 04 of 04  
> **Tasks Covered:** 43, 44

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [03_Tasks-39-42_Log-Configuration.md](03_Tasks-39-42_Log-Configuration.md)
- **→ Next Group:** [Group-D_Security-Headers-Middleware](../Group-D_Security-Headers-Middleware/)

---

## Document Overview

This document covers the registration of RequestLoggingMiddleware in Django settings and comprehensive testing to verify logging functionality, timing accuracy, and path exclusions.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 43 | Register in MIDDLEWARE | Simple |
| 44 | Test Request Logging | Medium |

---

## Task 43: Register in MIDDLEWARE

### Overview
Add RequestLoggingMiddleware to Django's MIDDLEWARE setting in the correct position to ensure proper context availability (after authentication and tenant middleware).

### Dependencies
- Task 42: Exclude Static Files (middleware complete)
- Task 39: Configure Log Format (logging configured)
- SubPhase-06, Group-B: TenantMiddleware registered
- Core: AuthenticationMiddleware registered

### Instructions

1. **Locate MIDDLEWARE setting**
   - Open `backend/config/settings/base.py`
   - Find MIDDLEWARE list
   - Identify middleware order

2. **Determine correct position**
   - Must be AFTER SecurityMiddleware
   - Must be AFTER SessionMiddleware
   - Must be AFTER AuthenticationMiddleware
   - Must be AFTER TenantMiddleware (if exists)
   - Should be BEFORE application middleware

3. **Add RequestLoggingMiddleware**
   - Add full import path
   - Add explanatory comment
   - Document why position matters

4. **Verify middleware order**
   - Check that all dependencies come before
   - Ensure no conflicts with other middleware
   - Test startup for errors

### Middleware Registration

```python
# backend/config/settings/base.py

MIDDLEWARE = [
    # Security and CORS
    'django.middleware.security.SecurityMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    
    # Session and common
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    
    # Authentication - must come before RequestLoggingMiddleware
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    
    # Multi-tenancy - must come before RequestLoggingMiddleware
    # (if using django-tenants or custom tenant middleware)
    'apps.tenants.middleware.TenantMiddleware',
    
    # Request logging - logs all requests with timing and context
    # Place after authentication and tenant middleware to access user/tenant
    # Place before application middleware to capture full request duration
    'apps.core.middleware.logging.RequestLoggingMiddleware',
    
    # Django built-in middleware
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    
    # Application-specific middleware
    # (add custom middleware below)
]
```

### Middleware Order Explanation
```
Request Flow:
    │
    ├── SecurityMiddleware (sets security headers)
    ├── SessionMiddleware (loads session)
    ├── AuthenticationMiddleware (sets request.user)
    ├── TenantMiddleware (sets request.tenant)
    │
    ├── RequestLoggingMiddleware  <-- OUR MIDDLEWARE
    │   ├── Has access to request.user
    │   ├── Has access to request.tenant
    │   ├── Captures timing
    │   └── Logs with full context
    │
    ├── Application Middleware
    ├── View Function
    │
    ├── Response flows back through middleware
    │
    └── RequestLoggingMiddleware logs response
```

### Why Order Matters
| Middleware | Must Be Before? | Reason |
|-----------|----------------|--------|
| **SecurityMiddleware** | Yes | Need security context |
| **SessionMiddleware** | Yes | Need session data |
| **AuthenticationMiddleware** | Yes | Need request.user |
| **TenantMiddleware** | Yes | Need request.tenant |
| **MessageMiddleware** | No | Don't need messages |
| **Application Middleware** | No | Want to time these |

### Position Impact on Timing
```python
# If placed too early:
# - Won't have user/tenant context
# - Logs incomplete information

# If placed too late:
# - Won't capture full request duration
# - Timing will be inaccurate

# Correct position:
# - After context middleware (user, tenant)
# - Before application middleware
# - Captures full duration with context
```

### Common Middleware Configurations
```python
# With django-tenants
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django_tenants.middleware.main.TenantMainMiddleware',  # django-tenants
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'apps.core.middleware.logging.RequestLoggingMiddleware',  # Our middleware
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

# With DRF and JWT
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'apps.tenants.middleware.TenantMiddleware',
    'apps.core.middleware.logging.RequestLoggingMiddleware',  # Our middleware
    # Note: DRF authentication happens in views, not middleware
]
```

### Expected Outcome
- RequestLoggingMiddleware registered in MIDDLEWARE
- Positioned after authentication and tenant middleware
- Server starts without errors
- Ready for testing

### Verification Checklist
- [ ] Middleware added to MIDDLEWARE list
- [ ] Full import path used: apps.core.middleware.logging.RequestLoggingMiddleware
- [ ] Positioned after SecurityMiddleware
- [ ] Positioned after SessionMiddleware
- [ ] Positioned after AuthenticationMiddleware
- [ ] Positioned after TenantMiddleware (if exists)
- [ ] Comment explains positioning
- [ ] Server starts successfully (`python manage.py runserver`)

---

## Task 44: Test Request Logging

### Overview
Create comprehensive tests to verify request logging functionality, timing accuracy, context enrichment, and path exclusions.

### Dependencies
- Task 43: Register in MIDDLEWARE
- All previous Group C tasks

### Instructions

1. **Create test file**
   - Create `backend/apps/core/tests/test_logging_middleware.py`
   - Import required test utilities
   - Import middleware class

2. **Test basic logging**
   - Test request log creation
   - Test response log creation
   - Verify log fields

3. **Test timing accuracy**
   - Test start time capture
   - Test end time capture
   - Test duration calculation
   - Verify millisecond precision

4. **Test context enrichment**
   - Test request ID generation
   - Test request ID from header
   - Test tenant ID extraction
   - Test user ID extraction
   - Test client IP detection

5. **Test path exclusions**
   - Test health check exclusion
   - Test static file exclusion
   - Test custom exclusions
   - Verify no logs for excluded paths

6. **Test request body logging**
   - Test body parsing
   - Test sanitization
   - Test size limits
   - Test content type handling

7. **Test error handling**
   - Test with missing context
   - Test with invalid bodies
   - Test with exceptions

### Test Implementation

```python
# backend/apps/core/tests/test_logging_middleware.py

"""
Tests for RequestLoggingMiddleware

Tests logging functionality, timing, context enrichment, and exclusions.
"""

import json
import logging
import time
import uuid
from unittest.mock import Mock, patch, MagicMock

from django.contrib.auth import get_user_model
from django.test import TestCase, RequestFactory, override_settings
from django.http import HttpResponse

from apps.core.middleware.logging import RequestLoggingMiddleware

User = get_user_model()


class RequestLoggingMiddlewareTestCase(TestCase):
    """Test cases for RequestLoggingMiddleware."""
    
    def setUp(self):
        """Set up test fixtures."""
        self.factory = RequestFactory()
        self.get_response = Mock(return_value=HttpResponse("OK", status=200))
        self.middleware = RequestLoggingMiddleware(self.get_response)
        
        # Create test user
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        
        # Mock logger
        self.logger_patcher = patch('apps.core.middleware.logging.logger')
        self.mock_logger = self.logger_patcher.start()
    
    def tearDown(self):
        """Clean up test fixtures."""
        self.logger_patcher.stop()
    
    def test_middleware_initialization(self):
        """Test middleware initializes correctly."""
        middleware = RequestLoggingMiddleware(self.get_response)
        self.assertEqual(middleware.get_response, self.get_response)
        self.assertIsInstance(middleware.EXCLUDED_PATHS, list)
    
    def test_request_id_generation(self):
        """Test request ID is generated if not provided."""
        request = self.factory.get('/api/products/')
        
        response = self.middleware(request)
        
        # Check request ID was set
        self.assertTrue(hasattr(request, 'request_id'))
        self.assertIsNotNone(request.request_id)
        
        # Check UUID format
        try:
            uuid.UUID(request.request_id)
        except ValueError:
            self.fail("request_id is not a valid UUID")
        
        # Check response header
        self.assertEqual(response['X-Request-ID'], request.request_id)
    
    def test_request_id_from_header(self):
        """Test request ID is used from X-Request-ID header if provided."""
        custom_id = 'custom-request-id-12345'
        request = self.factory.get(
            '/api/products/',
            HTTP_X_REQUEST_ID=custom_id
        )
        
        response = self.middleware(request)
        
        # Check custom ID was used
        self.assertEqual(request.request_id, custom_id)
        self.assertEqual(response['X-Request-ID'], custom_id)
    
    def test_timing_capture(self):
        """Test request timing is captured accurately."""
        # Create request
        request = self.factory.get('/api/products/')
        
        # Mock get_response to add delay
        def delayed_response(req):
            time.sleep(0.05)  # 50ms delay
            return HttpResponse("OK", status=200)
        
        middleware = RequestLoggingMiddleware(delayed_response)
        
        # Process request
        with patch('apps.core.middleware.logging.logger'):
            response = middleware(request)
        
        # Check duration was captured
        self.assertTrue(hasattr(request, 'duration_ms'))
        
        # Duration should be approximately 50ms (allow some variance)
        self.assertGreater(request.duration_ms, 45)  # At least 45ms
        self.assertLess(request.duration_ms, 100)    # Less than 100ms
    
    def test_request_logging(self):
        """Test request details are logged."""
        request = self.factory.get('/api/products/?page=1')
        request.user = self.user
        
        self.middleware(request)
        
        # Check logger.info was called for request
        self.assertTrue(self.mock_logger.info.called)
        
        # Get first call (request log)
        call_args = self.mock_logger.info.call_args_list[0]
        log_message = call_args[0][0]
        log_data = call_args[1]['extra']
        
        # Verify log message
        self.assertIn('Request started', log_message)
        self.assertIn('GET', log_message)
        
        # Verify log data fields
        self.assertEqual(log_data['event'], 'request_started')
        self.assertEqual(log_data['method'], 'GET')
        self.assertEqual(log_data['path'], '/api/products/')
        self.assertEqual(log_data['query_string'], 'page=1')
        self.assertIn('request_id', log_data)
        self.assertIn('client_ip', log_data)
    
    def test_response_logging(self):
        """Test response details are logged with timing."""
        request = self.factory.post('/api/orders/')
        request.user = self.user
        
        # Mock response with 201 status
        self.get_response.return_value = HttpResponse("Created", status=201)
        
        self.middleware(request)
        
        # Get last call (response log)
        call_args = self.mock_logger.log.call_args_list[-1]
        log_level = call_args[0][0]
        log_message = call_args[0][1]
        log_data = call_args[1]['extra']
        
        # Verify log level is INFO for 2xx
        self.assertEqual(log_level, logging.INFO)
        
        # Verify log message
        self.assertIn('Request completed', log_message)
        self.assertIn('POST', log_message)
        self.assertIn('201', log_message)
        
        # Verify log data fields
        self.assertEqual(log_data['event'], 'request_completed')
        self.assertEqual(log_data['method'], 'POST')
        self.assertEqual(log_data['status'], 201)
        self.assertIn('duration_ms', log_data)
        self.assertGreater(log_data['duration_ms'], 0)
    
    def test_user_context(self):
        """Test user ID is added to logs."""
        request = self.factory.get('/api/products/')
        request.user = self.user
        
        self.middleware(request)
        
        # Get response log
        call_args = self.mock_logger.log.call_args_list[-1]
        log_data = call_args[1]['extra']
        
        # Verify user_id is logged
        self.assertEqual(log_data['user_id'], str(self.user.id))
    
    def test_anonymous_user(self):
        """Test anonymous user is handled correctly."""
        from django.contrib.auth.models import AnonymousUser
        
        request = self.factory.get('/api/products/')
        request.user = AnonymousUser()
        
        self.middleware(request)
        
        # Get response log
        call_args = self.mock_logger.log.call_args_list[-1]
        log_data = call_args[1]['extra']
        
        # Verify user_id is None
        self.assertIsNone(log_data['user_id'])
    
    def test_tenant_context(self):
        """Test tenant ID is added to logs."""
        request = self.factory.get('/api/products/')
        request.user = self.user
        
        # Mock tenant object
        mock_tenant = Mock()
        mock_tenant.id = 'tenant-123'
        request.tenant = mock_tenant
        
        self.middleware(request)
        
        # Get response log
        call_args = self.mock_logger.log.call_args_list[-1]
        log_data = call_args[1]['extra']
        
        # Verify tenant_id is logged
        self.assertEqual(log_data['tenant_id'], 'tenant-123')
    
    def test_client_ip_from_x_forwarded_for(self):
        """Test client IP is extracted from X-Forwarded-For header."""
        request = self.factory.get(
            '/api/products/',
            HTTP_X_FORWARDED_FOR='203.0.113.45, 198.51.100.23'
        )
        request.user = self.user
        
        self.middleware(request)
        
        # Get response log
        call_args = self.mock_logger.log.call_args_list[-1]
        log_data = call_args[1]['extra']
        
        # Verify first IP from X-Forwarded-For is used
        self.assertEqual(log_data['client_ip'], '203.0.113.45')
    
    def test_client_ip_from_remote_addr(self):
        """Test client IP falls back to REMOTE_ADDR."""
        request = self.factory.get('/api/products/')
        request.user = self.user
        # RequestFactory sets REMOTE_ADDR by default
        
        self.middleware(request)
        
        # Get response log
        call_args = self.mock_logger.log.call_args_list[-1]
        log_data = call_args[1]['extra']
        
        # Verify IP is present (from REMOTE_ADDR)
        self.assertIsNotNone(log_data['client_ip'])
    
    def test_health_check_exclusion(self):
        """Test health check endpoints are not logged."""
        health_paths = [
            '/health/',
            '/health/liveness/',
            '/health/readiness/',
            '/ready/',
        ]
        
        for path in health_paths:
            request = self.factory.get(path)
            
            # Reset mock
            self.mock_logger.reset_mock()
            
            # Process request
            self.middleware(request)
            
            # Verify no logging occurred
            self.assertFalse(self.mock_logger.info.called)
            self.assertFalse(self.mock_logger.log.called)
    
    def test_static_file_exclusion(self):
        """Test static and media files are not logged."""
        static_paths = [
            '/static/css/main.css',
            '/static/js/app.js',
            '/media/uploads/image.jpg',
            '/favicon.ico',
        ]
        
        for path in static_paths:
            request = self.factory.get(path)
            
            # Reset mock
            self.mock_logger.reset_mock()
            
            # Process request
            self.middleware(request)
            
            # Verify no logging occurred
            self.assertFalse(self.mock_logger.info.called)
            self.assertFalse(self.mock_logger.log.called)
    
    @override_settings(LOG_EXCLUDED_PATHS=['/custom/exclude/'])
    def test_custom_exclusions(self):
        """Test custom exclusion paths from settings."""
        middleware = RequestLoggingMiddleware(self.get_response)
        request = self.factory.get('/custom/exclude/test')
        
        # Reset mock
        self.mock_logger.reset_mock()
        
        # Process request
        middleware(request)
        
        # Verify no logging occurred
        self.assertFalse(self.mock_logger.info.called)
        self.assertFalse(self.mock_logger.log.called)
    
    @override_settings(LOG_REQUEST_BODY=True)
    def test_request_body_logging(self):
        """Test request body is logged when enabled."""
        body_data = {'username': 'john', 'email': 'john@example.com'}
        request = self.factory.post(
            '/api/users/',
            data=json.dumps(body_data),
            content_type='application/json'
        )
        request.user = self.user
        
        # Create new middleware instance to pick up settings
        middleware = RequestLoggingMiddleware(self.get_response)
        middleware(request)
        
        # Get request log
        call_args = self.mock_logger.info.call_args_list[0]
        log_data = call_args[1]['extra']
        
        # Verify body is in logs
        self.assertIn('body', log_data)
        self.assertEqual(log_data['body']['username'], 'john')
        self.assertEqual(log_data['body']['email'], 'john@example.com')
    
    @override_settings(LOG_REQUEST_BODY=True)
    def test_body_sanitization(self):
        """Test sensitive fields are sanitized from request body."""
        body_data = {
            'username': 'john',
            'password': 'secret123',
            'api_key': 'sk_live_abc123'
        }
        request = self.factory.post(
            '/api/users/',
            data=json.dumps(body_data),
            content_type='application/json'
        )
        request.user = self.user
        
        # Create new middleware instance
        middleware = RequestLoggingMiddleware(self.get_response)
        middleware(request)
        
        # Get request log
        call_args = self.mock_logger.info.call_args_list[0]
        log_data = call_args[1]['extra']
        
        # Verify sensitive fields are redacted
        self.assertEqual(log_data['body']['username'], 'john')
        self.assertEqual(log_data['body']['password'], '***REDACTED***')
        self.assertEqual(log_data['body']['api_key'], '***REDACTED***')
    
    def test_error_status_logging(self):
        """Test 4xx responses are logged with WARNING level."""
        request = self.factory.get('/api/products/999/')
        request.user = self.user
        
        # Mock 404 response
        self.get_response.return_value = HttpResponse("Not Found", status=404)
        
        self.middleware(request)
        
        # Get response log
        call_args = self.mock_logger.log.call_args_list[-1]
        log_level = call_args[0][0]
        
        # Verify log level is WARNING for 4xx
        self.assertEqual(log_level, logging.WARNING)
    
    def test_server_error_logging(self):
        """Test 5xx responses are logged with ERROR level."""
        request = self.factory.post('/api/orders/')
        request.user = self.user
        
        # Mock 500 response
        self.get_response.return_value = HttpResponse(
            "Internal Server Error",
            status=500
        )
        
        self.middleware(request)
        
        # Get response log
        call_args = self.mock_logger.log.call_args_list[-1]
        log_level = call_args[0][0]
        
        # Verify log level is ERROR for 5xx
        self.assertEqual(log_level, logging.ERROR)
    
    def test_missing_context_handling(self):
        """Test middleware handles missing user/tenant gracefully."""
        request = self.factory.get('/api/products/')
        # Don't set user or tenant
        
        # Should not raise exception
        try:
            self.middleware(request)
        except AttributeError:
            self.fail("Middleware raised AttributeError for missing context")
    
    @override_settings(LOG_REQUEST_BODY=True, MAX_BODY_LENGTH=100)
    def test_large_body_truncation(self):
        """Test large request bodies are truncated."""
        # Create body larger than MAX_BODY_LENGTH
        body_data = {'data': 'x' * 200}
        request = self.factory.post(
            '/api/data/',
            data=json.dumps(body_data),
            content_type='application/json'
        )
        request.user = self.user
        
        middleware = RequestLoggingMiddleware(self.get_response)
        middleware(request)
        
        # Get request log
        call_args = self.mock_logger.info.call_args_list[0]
        log_data = call_args[1]['extra']
        
        # Verify body indicates it's too large
        self.assertIn('body', log_data)
        self.assertIn('too large', log_data['body'])


class RequestLoggingIntegrationTestCase(TestCase):
    """Integration tests using Django test client."""
    
    def setUp(self):
        """Set up test fixtures."""
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        
        # Mock logger
        self.logger_patcher = patch('apps.core.middleware.logging.logger')
        self.mock_logger = self.logger_patcher.start()
    
    def tearDown(self):
        """Clean up."""
        self.logger_patcher.stop()
    
    def test_full_request_cycle(self):
        """Test complete request/response cycle through middleware stack."""
        # Make authenticated request
        self.client.force_login(self.user)
        response = self.client.get('/api/products/')
        
        # Verify request was logged
        self.assertTrue(self.mock_logger.info.called)
        
        # Verify response has request ID header
        self.assertIn('X-Request-ID', response)
```

### Running Tests

```bash
# Run all middleware tests
python manage.py test apps.core.tests.test_logging_middleware

# Run specific test class
python manage.py test apps.core.tests.test_logging_middleware.RequestLoggingMiddlewareTestCase

# Run specific test method
python manage.py test apps.core.tests.test_logging_middleware.RequestLoggingMiddlewareTestCase.test_timing_capture

# Run with verbose output
python manage.py test apps.core.tests.test_logging_middleware --verbosity=2

# Run with coverage
coverage run --source='apps.core.middleware' manage.py test apps.core.tests.test_logging_middleware
coverage report
```

### Test Coverage Goals
| Component | Coverage Target | Priority |
|-----------|----------------|----------|
| **Middleware class** | 100% | High |
| **Timing logic** | 100% | High |
| **Context extraction** | 100% | High |
| **Path exclusion** | 100% | Medium |
| **Body logging** | 90% | Medium |
| **Error handling** | 90% | Medium |

### Expected Outcome
- All tests pass successfully
- Logging functionality verified
- Timing accuracy confirmed
- Context enrichment working
- Path exclusions effective
- Body sanitization secure

### Verification Checklist
- [ ] Test file created at apps/core/tests/test_logging_middleware.py
- [ ] All test methods implemented
- [ ] Tests use RequestFactory for unit tests
- [ ] Tests use TestClient for integration tests
- [ ] Mock logger used to avoid actual logging
- [ ] All test cases pass
- [ ] Code coverage > 90%
- [ ] Edge cases covered (missing context, errors, etc.)

---

## Group C Completion

### Deliverables Checklist

**Code Files:**
- [ ] `backend/apps/core/middleware/logging.py` - RequestLoggingMiddleware
- [ ] `backend/config/settings/logging.py` - Logging configuration
- [ ] `backend/apps/core/tests/test_logging_middleware.py` - Comprehensive tests

**Configuration:**
- [ ] RequestLoggingMiddleware registered in MIDDLEWARE
- [ ] Structured JSON logging configured
- [ ] Log rotation configured
- [ ] Sensitive fields defined

**Testing:**
- [ ] Unit tests for all methods
- [ ] Integration tests for full request cycle
- [ ] Timing accuracy verified
- [ ] Path exclusions verified
- [ ] Body sanitization verified

**Documentation:**
- [ ] All tasks documented
- [ ] Code commented
- [ ] Test cases documented

### Next Steps

Proceed to:
- **→ Next Group:** [Group-D_Security-Headers-Middleware](../Group-D_Security-Headers-Middleware/)
- Implement security headers middleware
- Add CORS configuration
- Configure CSP headers
- Set up security best practices

---

## Notes for AI Agents

1. **Middleware Order:** Critical for correct context - always after auth and tenant
2. **Test Coverage:** Aim for >90% coverage, especially for timing and context
3. **Mock Logging:** Always mock logger in tests to avoid cluttering test output
4. **RequestFactory:** Use for unit tests (faster, isolated)
5. **TestClient:** Use for integration tests (full middleware stack)
6. **Edge Cases:** Test missing context, invalid data, errors
7. **Timing Tests:** Allow variance in timing assertions (50ms ± 10ms)
8. **Production Testing:** Test with actual log aggregation tools (ELK, Splunk, etc.)
