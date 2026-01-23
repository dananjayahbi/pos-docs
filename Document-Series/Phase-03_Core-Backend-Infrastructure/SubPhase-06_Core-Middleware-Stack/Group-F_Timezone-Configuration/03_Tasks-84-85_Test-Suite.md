# Tasks 84-85: Test Suite

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 06 - Core Middleware Stack  
> **Group:** F - Timezone & Configuration  
> **Document:** 03 of 04  
> **Tasks Covered:** 84, 85

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [02_Tasks-82-83_Middleware-Stack-Configuration.md](02_Tasks-82-83_Middleware-Stack-Configuration.md)
- **→ Next Document:** [04_Tasks-86-88_Documentation.md](04_Tasks-86-88_Documentation.md)

---

## Document Overview

This document covers the creation of a comprehensive test suite for all middleware components and the integration testing of the complete middleware stack.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 84 | Create Middleware Tests Suite | High |
| 85 | Test Middleware Integration | High |

---

## Task 84: Create Middleware Tests Suite

### Overview
Create comprehensive unit tests for all middleware components including tenant, logging, security, rate limiting, and timezone middleware.

### Dependencies
- All middleware from Groups A-F implemented
- Django test framework available

### Instructions

1. **Create test files for each middleware**
   - test_tenant_middleware.py
   - test_logging_middleware.py
   - test_security_middleware.py
   - test_ratelimit_middleware.py
   - test_timezone_middleware.py

2. **Implement comprehensive test cases**
   - Normal operation tests
   - Error handling tests
   - Edge case tests
   - Integration points tests

3. **Use Django test client and factory patterns**
   - RequestFactory for unit tests
   - Test client for integration tests
   - Mock objects for dependencies

4. **Ensure high code coverage**
   - Test all code paths
   - Test error conditions
   - Test edge cases

### Test File Structure

```
backend/apps/core/tests/
├── __init__.py
├── test_tenant_middleware.py
├── test_logging_middleware.py
├── test_security_middleware.py
├── test_ratelimit_middleware.py
├── test_timezone_middleware.py
└── test_middleware_integration.py  # Task 85
```

### Test Template Structure

```python
"""
Tests for [Middleware Name]

Test coverage:
- Normal operation
- Error handling
- Edge cases
- Integration with other middleware
"""

from django.test import TestCase, RequestFactory
from django.contrib.auth import get_user_model
from unittest.mock import Mock, patch

from apps.core.middleware.[module] import [MiddlewareClass]

User = get_user_model()


class [MiddlewareClass]TestCase(TestCase):
    """Test suite for [MiddlewareClass]."""
    
    def setUp(self):
        """Set up test fixtures."""
        self.factory = RequestFactory()
        self.get_response = Mock(return_value=Mock(status_code=200))
        self.middleware = [MiddlewareClass](self.get_response)
    
    def test_initialization(self):
        """Test middleware initializes correctly."""
        pass
    
    def test_normal_operation(self):
        """Test middleware processes request normally."""
        pass
    
    def test_error_handling(self):
        """Test middleware handles errors gracefully."""
        pass
    
    def tearDown(self):
        """Clean up after tests."""
        pass
```

### Test: test_timezone_middleware.py

```python
"""
Tests for TimezoneMiddleware

Test coverage:
- Default timezone activation
- User timezone resolution
- Tenant timezone resolution
- Priority order (user > tenant > default)
- Invalid timezone handling
- Timezone deactivation
"""

from django.test import TestCase, RequestFactory
from django.contrib.auth import get_user_model
from django.utils import timezone
from unittest.mock import Mock, patch
import zoneinfo

from apps.core.middleware.timezone import TimezoneMiddleware

User = get_user_model()


class TimezoneMiddlewareTestCase(TestCase):
    """Test suite for TimezoneMiddleware."""
    
    def setUp(self):
        """Set up test fixtures."""
        self.factory = RequestFactory()
        self.get_response = Mock(return_value=Mock(status_code=200))
        self.middleware = TimezoneMiddleware(self.get_response)
        
        # Create test user
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass'
        )
    
    def test_middleware_initialization(self):
        """Test middleware initializes with correct default timezone."""
        self.assertEqual(
            self.middleware.DEFAULT_TIMEZONE,
            'Asia/Colombo'
        )
        self.assertIsNotNone(self.middleware.get_response)
    
    def test_default_timezone_activation(self):
        """Test default timezone is activated when no user or tenant."""
        request = self.factory.get('/')
        request.user = None
        
        response = self.middleware(request)
        
        # Verify get_response was called
        self.get_response.assert_called_once_with(request)
        
        # Note: timezone.get_current_timezone() check should be done
        # within the request processing, not after
    
    def test_user_timezone_priority(self):
        """Test user timezone takes priority over tenant and default."""
        request = self.factory.get('/')
        request.user = self.user
        request.user.timezone = 'America/New_York'
        
        # Mock tenant with different timezone
        mock_tenant = Mock()
        mock_tenant.timezone = 'Europe/London'
        request.tenant = mock_tenant
        
        tz_name = self.middleware._get_timezone(request)
        
        # User timezone should win
        self.assertEqual(tz_name, 'America/New_York')
    
    def test_tenant_timezone_fallback(self):
        """Test tenant timezone used when user has none."""
        request = self.factory.get('/')
        request.user = self.user
        # User has no timezone attribute
        
        mock_tenant = Mock()
        mock_tenant.timezone = 'Europe/London'
        request.tenant = mock_tenant
        
        tz_name = self.middleware._get_timezone(request)
        
        # Tenant timezone should be used
        self.assertEqual(tz_name, 'Europe/London')
    
    def test_default_timezone_fallback(self):
        """Test default timezone used when user and tenant have none."""
        request = self.factory.get('/')
        request.user = None
        request.tenant = None
        
        tz_name = self.middleware._get_timezone(request)
        
        # Default timezone should be used
        self.assertEqual(tz_name, 'Asia/Colombo')
    
    def test_invalid_timezone_handling(self):
        """Test middleware handles invalid timezone names gracefully."""
        request = self.factory.get('/')
        request.user = self.user
        request.user.timezone = 'Invalid/Timezone'
        
        # Should not raise exception
        response = self.middleware(request)
        
        # Response should be returned normally
        self.assertEqual(response.status_code, 200)
    
    def test_get_user_timezone_authenticated(self):
        """Test getting timezone from authenticated user."""
        request = self.factory.get('/')
        request.user = self.user
        request.user.timezone = 'Asia/Tokyo'
        
        tz_name = self.middleware._get_user_timezone(request)
        
        self.assertEqual(tz_name, 'Asia/Tokyo')
    
    def test_get_user_timezone_unauthenticated(self):
        """Test returns None for unauthenticated user."""
        request = self.factory.get('/')
        request.user = Mock()
        request.user.is_authenticated = False
        
        tz_name = self.middleware._get_user_timezone(request)
        
        self.assertIsNone(tz_name)
    
    def test_get_tenant_timezone_with_tenant(self):
        """Test getting timezone from tenant."""
        request = self.factory.get('/')
        mock_tenant = Mock()
        mock_tenant.timezone = 'Europe/Paris'
        request.tenant = mock_tenant
        
        tz_name = self.middleware._get_tenant_timezone(request)
        
        self.assertEqual(tz_name, 'Europe/Paris')
    
    def test_get_tenant_timezone_without_tenant(self):
        """Test returns None when no tenant."""
        request = self.factory.get('/')
        # No tenant attribute
        
        tz_name = self.middleware._get_tenant_timezone(request)
        
        self.assertIsNone(tz_name)
    
    def test_timezone_deactivation_after_request(self):
        """Test timezone is deactivated after request processing."""
        request = self.factory.get('/')
        request.user = self.user
        request.user.timezone = 'America/Chicago'
        
        with patch('apps.core.middleware.timezone.timezone.deactivate') as mock_deactivate:
            response = self.middleware(request)
            
            # Verify deactivate was called
            mock_deactivate.assert_called()
    
    def tearDown(self):
        """Clean up after tests."""
        # Ensure timezone is deactivated
        timezone.deactivate()


class TimezoneMiddlewareEdgeCasesTestCase(TestCase):
    """Test edge cases for TimezoneMiddleware."""
    
    def setUp(self):
        """Set up test fixtures."""
        self.factory = RequestFactory()
        self.get_response = Mock(return_value=Mock(status_code=200))
        self.middleware = TimezoneMiddleware(self.get_response)
    
    def test_none_timezone_string(self):
        """Test handling of None as timezone string."""
        request = self.factory.get('/')
        request.user = Mock()
        request.user.is_authenticated = True
        request.user.timezone = None
        
        # Should fall back to tenant or default
        tz_name = self.middleware._get_timezone(request)
        
        # Should return default
        self.assertEqual(tz_name, 'Asia/Colombo')
    
    def test_empty_timezone_string(self):
        """Test handling of empty timezone string."""
        request = self.factory.get('/')
        request.user = Mock()
        request.user.is_authenticated = True
        request.user.timezone = ''
        
        tz_name = self.middleware._get_timezone(request)
        
        # Should return default
        self.assertEqual(tz_name, 'Asia/Colombo')
    
    def test_user_profile_timezone(self):
        """Test getting timezone from user profile."""
        request = self.factory.get('/')
        request.user = Mock()
        request.user.is_authenticated = True
        # No timezone on user
        
        # But has profile with timezone
        request.user.profile = Mock()
        request.user.profile.timezone = 'Asia/Dubai'
        
        tz_name = self.middleware._get_user_timezone(request)
        
        self.assertEqual(tz_name, 'Asia/Dubai')
    
    def test_exception_in_timezone_resolution(self):
        """Test middleware handles exceptions in timezone resolution."""
        request = self.factory.get('/')
        
        # Mock to raise exception
        with patch.object(
            self.middleware,
            '_get_timezone',
            side_effect=Exception('Test error')
        ):
            # Should not crash
            try:
                response = self.middleware(request)
                # If it handles gracefully, we get here
            except Exception:
                self.fail("Middleware should handle exceptions gracefully")
```

### Test: test_security_middleware.py

```python
"""
Tests for SecurityHeadersMiddleware

Test coverage:
- Security headers are added
- Headers are correct values
- CSP policy configuration
- HSTS configuration
"""

from django.test import TestCase, RequestFactory
from unittest.mock import Mock

from apps.core.middleware.security import SecurityHeadersMiddleware


class SecurityHeadersMiddlewareTestCase(TestCase):
    """Test suite for SecurityHeadersMiddleware."""
    
    def setUp(self):
        """Set up test fixtures."""
        self.factory = RequestFactory()
        self.get_response = Mock(return_value=Mock(status_code=200))
        self.middleware = SecurityHeadersMiddleware(self.get_response)
    
    def test_security_headers_added(self):
        """Test all required security headers are added."""
        request = self.factory.get('/')
        response = self.middleware(request)
        
        # Check that headers are added
        # This depends on your implementation
        self.assertTrue(hasattr(response, 'headers') or hasattr(response, 'items'))
    
    def test_csp_header_value(self):
        """Test Content-Security-Policy header value."""
        # Implement based on your CSP configuration
        pass
    
    def test_xss_protection_header(self):
        """Test X-XSS-Protection header."""
        # Implement based on your configuration
        pass
```

### Test: test_ratelimit_middleware.py

```python
"""
Tests for RateLimitMiddleware

Test coverage:
- Rate limiting enforcement
- Limit by IP address
- Limit by user
- Whitelist functionality
- Rate limit exceeded response
"""

from django.test import TestCase, RequestFactory
from django.core.cache import cache
from unittest.mock import Mock

from apps.core.middleware.ratelimit import RateLimitMiddleware


class RateLimitMiddlewareTestCase(TestCase):
    """Test suite for RateLimitMiddleware."""
    
    def setUp(self):
        """Set up test fixtures."""
        self.factory = RequestFactory()
        self.get_response = Mock(return_value=Mock(status_code=200))
        self.middleware = RateLimitMiddleware(self.get_response)
        # Clear cache before each test
        cache.clear()
    
    def test_rate_limit_not_exceeded(self):
        """Test request proceeds when rate limit not exceeded."""
        request = self.factory.get('/')
        request.META['REMOTE_ADDR'] = '127.0.0.1'
        
        response = self.middleware(request)
        
        # Should proceed normally
        self.assertEqual(response.status_code, 200)
    
    def test_rate_limit_exceeded(self):
        """Test request blocked when rate limit exceeded."""
        request = self.factory.get('/')
        request.META['REMOTE_ADDR'] = '192.168.1.1'
        
        # Make requests up to the limit
        for _ in range(100):  # Adjust based on your limit
            response = self.middleware(request)
        
        # Next request should be blocked (if limit is less than 100)
        # Adjust test based on your rate limit configuration
    
    def tearDown(self):
        """Clean up after tests."""
        cache.clear()
```

### Test: test_logging_middleware.py

```python
"""
Tests for RequestLoggingMiddleware

Test coverage:
- Request logging
- Response logging
- User context in logs
- Error logging
- Performance timing
"""

from django.test import TestCase, RequestFactory
from django.contrib.auth import get_user_model
from unittest.mock import Mock, patch
import logging

from apps.core.middleware.logging import RequestLoggingMiddleware

User = get_user_model()


class RequestLoggingMiddlewareTestCase(TestCase):
    """Test suite for RequestLoggingMiddleware."""
    
    def setUp(self):
        """Set up test fixtures."""
        self.factory = RequestFactory()
        self.get_response = Mock(return_value=Mock(status_code=200))
        self.middleware = RequestLoggingMiddleware(self.get_response)
        
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com'
        )
    
    @patch('apps.core.middleware.logging.logger')
    def test_request_logging(self, mock_logger):
        """Test request is logged."""
        request = self.factory.get('/')
        request.user = self.user
        
        response = self.middleware(request)
        
        # Verify logging was called
        self.assertTrue(mock_logger.info.called or mock_logger.debug.called)
    
    @patch('apps.core.middleware.logging.logger')
    def test_unauthenticated_request_logging(self, mock_logger):
        """Test anonymous request is logged."""
        request = self.factory.get('/')
        request.user = Mock()
        request.user.is_authenticated = False
        
        response = self.middleware(request)
        
        # Should still log
        self.assertTrue(mock_logger.info.called or mock_logger.debug.called)
```

### Expected Outcome
- Comprehensive test files for all middleware
- High code coverage (>80%)
- All test cases passing
- Edge cases covered

### Verification Checklist
- [ ] test_timezone_middleware.py created and passing
- [ ] test_security_middleware.py created and passing
- [ ] test_ratelimit_middleware.py created and passing
- [ ] test_logging_middleware.py created and passing
- [ ] test_tenant_middleware.py created and passing
- [ ] All normal operation tests passing
- [ ] All error handling tests passing
- [ ] All edge case tests passing
- [ ] Code coverage > 80%

---

## Task 85: Test Middleware Integration

### Overview
Create integration tests that verify the complete middleware stack works correctly as a whole.

### Dependencies
- Task 84: Individual middleware tests complete
- All middleware implemented and configured

### Instructions

1. **Create test_middleware_integration.py**
   - Test complete request/response cycle
   - Test middleware interactions
   - Test middleware order

2. **Test realistic scenarios**
   - Multi-tenant requests
   - Authenticated user requests
   - Rate-limited requests
   - Security headers on responses

3. **Test middleware stack order**
   - Verify tenant resolution before auth
   - Verify auth before timezone
   - Verify all middleware executes

4. **Test error scenarios**
   - Middleware exceptions
   - Missing context
   - Invalid configurations

### Integration Test File

```python
"""
Integration tests for complete middleware stack

Test coverage:
- Full request/response cycle through all middleware
- Middleware order and dependencies
- Multi-tenant scenarios
- Authenticated user scenarios
- Security and rate limiting
- Timezone activation
- Error handling across middleware
"""

from django.test import TestCase, Client, override_settings
from django.contrib.auth import get_user_model
from django.core.cache import cache
from django.utils import timezone
from unittest.mock import Mock, patch
import zoneinfo

User = get_user_model()


class MiddlewareStackIntegrationTestCase(TestCase):
    """Integration tests for complete middleware stack."""
    
    def setUp(self):
        """Set up test fixtures."""
        self.client = Client()
        cache.clear()
        
        # Create test user with timezone
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        self.user.timezone = 'America/New_York'
        self.user.save()
    
    def test_full_middleware_stack_execution(self):
        """Test complete middleware stack executes in order."""
        response = self.client.get('/')
        
        # Verify response was processed
        self.assertIn(response.status_code, [200, 302, 404])
        
        # Security headers should be present
        # (Adjust based on your security middleware implementation)
        self.assertTrue(
            'X-Content-Type-Options' in response or
            'X-Frame-Options' in response or
            len(response.items()) > 0  # Has headers
        )
    
    def test_tenant_resolution_before_auth(self):
        """Test tenant is resolved before authentication."""
        # This test assumes you have a test view that checks request.tenant
        # You may need to create a test view or endpoint
        
        response = self.client.get(
            '/',
            HTTP_HOST='tenant1.example.com'
        )
        
        # Tenant should be set by middleware
        # Verify through your application's behavior
        self.assertIsNotNone(response)
    
    def test_authenticated_user_timezone_activation(self):
        """Test timezone is activated for authenticated user."""
        # Login user
        self.client.login(username='testuser', password='testpass123')
        
        # Make request
        response = self.client.get('/')
        
        # Timezone should have been activated during request
        # Note: timezone.get_current_timezone() won't show it here
        # because we're outside the request context
        
        # Verify response was generated
        self.assertIsNotNone(response)
    
    def test_security_headers_on_response(self):
        """Test security headers are added to response."""
        response = self.client.get('/')
        
        # Check for security headers
        # Adjust based on your SecurityHeadersMiddleware implementation
        headers_dict = dict(response.items())
        
        # Should have some security headers
        self.assertGreater(len(headers_dict), 0)
    
    def test_rate_limiting_integration(self):
        """Test rate limiting works in full stack."""
        # Make multiple requests from same IP
        for i in range(50):  # Adjust based on your rate limit
            response = self.client.get('/')
            
            # First requests should succeed
            if i < 45:  # Well below limit
                self.assertIn(response.status_code, [200, 302, 404])
        
        # If rate limit is low enough, we might hit it
        # Adjust test based on your configuration
    
    def test_logging_middleware_integration(self):
        """Test request logging works with full stack."""
        with patch('apps.core.middleware.logging.logger') as mock_logger:
            # Make authenticated request
            self.client.login(username='testuser', password='testpass123')
            response = self.client.get('/')
            
            # Logging should have occurred
            self.assertTrue(
                mock_logger.info.called or
                mock_logger.debug.called
            )
    
    def test_middleware_exception_handling(self):
        """Test middleware stack handles exceptions gracefully."""
        # This test is tricky - you'd need to inject a failure
        # One approach is to mock a middleware method to raise an exception
        
        with patch(
            'apps.core.middleware.timezone.TimezoneMiddleware._get_timezone',
            side_effect=Exception('Test exception')
        ):
            # Request should still complete (or return 500)
            response = self.client.get('/')
            
            # Should not crash the server
            self.assertIsNotNone(response)
    
    def tearDown(self):
        """Clean up after tests."""
        cache.clear()
        timezone.deactivate()


class MiddlewareOrderTestCase(TestCase):
    """Test middleware execution order."""
    
    @override_settings(DEBUG=True)
    def test_middleware_order_documented(self):
        """Test that middleware order matches documentation."""
        from django.conf import settings
        
        middleware_list = settings.MIDDLEWARE
        
        # Verify key middleware are in expected order
        security_idx = next(
            i for i, m in enumerate(middleware_list)
            if 'SecurityMiddleware' in m
        )
        
        session_idx = next(
            i for i, m in enumerate(middleware_list)
            if 'SessionMiddleware' in m
        )
        
        auth_idx = next(
            i for i, m in enumerate(middleware_list)
            if 'AuthenticationMiddleware' in m
        )
        
        # Security should be first
        self.assertEqual(security_idx, 0)
        
        # Session should be before auth
        self.assertLess(session_idx, auth_idx)
        
        # Check for timezone middleware
        try:
            timezone_idx = next(
                i for i, m in enumerate(middleware_list)
                if 'TimezoneMiddleware' in m
            )
            # Timezone should be after auth
            self.assertGreater(timezone_idx, auth_idx)
        except StopIteration:
            self.fail("TimezoneMiddleware not found in MIDDLEWARE")


class MultiTenantIntegrationTestCase(TestCase):
    """Test multi-tenant scenarios with full middleware stack."""
    
    def setUp(self):
        """Set up test fixtures."""
        self.client = Client()
    
    def test_different_tenants_isolated(self):
        """Test requests to different tenants are properly isolated."""
        # Request to tenant1
        response1 = self.client.get(
            '/',
            HTTP_HOST='tenant1.example.com'
        )
        
        # Request to tenant2
        response2 = self.client.get(
            '/',
            HTTP_HOST='tenant2.example.com'
        )
        
        # Both should process successfully
        self.assertIsNotNone(response1)
        self.assertIsNotNone(response2)
    
    def test_tenant_timezone_isolation(self):
        """Test different tenants can have different timezones."""
        # This test requires tenants to be set up with different timezones
        # Adjust based on your tenant setup
        pass


class PerformanceIntegrationTestCase(TestCase):
    """Test performance of middleware stack."""
    
    def test_middleware_stack_performance(self):
        """Test middleware stack doesn't add excessive overhead."""
        import time
        
        client = Client()
        
        # Warm up
        client.get('/')
        
        # Time multiple requests
        start = time.time()
        for _ in range(10):
            client.get('/')
        end = time.time()
        
        # Average should be reasonable (adjust threshold)
        avg_time = (end - start) / 10
        self.assertLess(avg_time, 0.5)  # 500ms per request max
```

### Integration Test Scenarios

| Scenario | Test Focus | Expected Outcome |
|----------|-----------|------------------|
| **Full Stack** | All middleware execute | Request completes |
| **Order** | Dependencies satisfied | Correct execution order |
| **Multi-Tenant** | Tenant isolation | Separate contexts |
| **Authentication** | User context | User-dependent middleware work |
| **Security** | Headers added | Security headers present |
| **Rate Limiting** | Limits enforced | Excessive requests blocked |
| **Timezone** | TZ activated | Correct timezone used |
| **Logging** | Requests logged | Logs contain context |
| **Errors** | Graceful handling | No crashes |

### Running Integration Tests

```bash
# Run all middleware tests
python manage.py test apps.core.tests

# Run only integration tests
python manage.py test apps.core.tests.test_middleware_integration

# Run with coverage
coverage run --source='apps.core.middleware' manage.py test apps.core.tests
coverage report
coverage html

# Run specific test
python manage.py test apps.core.tests.test_middleware_integration.MiddlewareStackIntegrationTestCase.test_full_middleware_stack_execution
```

### Expected Outcome
- Integration test file created
- Full middleware stack tested
- All integration tests passing
- Middleware interactions verified
- Order dependencies confirmed

### Verification Checklist
- [ ] test_middleware_integration.py created
- [ ] Full stack execution tests passing
- [ ] Middleware order tests passing
- [ ] Multi-tenant integration tests passing
- [ ] Authentication integration tests passing
- [ ] Security headers integration tests passing
- [ ] Rate limiting integration tests passing
- [ ] Timezone integration tests passing
- [ ] Logging integration tests passing
- [ ] Error handling integration tests passing
- [ ] Performance tests passing
- [ ] All integration tests passing

---

## Testing Best Practices

### Test Organization

```python
# Group related tests in classes
class MiddlewareNameTestCase(TestCase):
    """Basic functionality tests."""
    pass

class MiddlewareNameEdgeCasesTestCase(TestCase):
    """Edge case tests."""
    pass

class MiddlewareNameErrorHandlingTestCase(TestCase):
    """Error handling tests."""
    pass
```

### Test Naming

```python
# Use descriptive test names
def test_user_timezone_takes_priority_over_tenant():
    """Test user timezone is preferred over tenant timezone."""
    pass

# Not just:
def test_timezone():
    pass
```

### Test Documentation

```python
# Document what you're testing
def test_rate_limit_exceeded(self):
    """
    Test that requests are blocked when rate limit is exceeded.
    
    Makes 100 requests in quick succession and verifies that
    requests after the limit return 429 status code.
    """
    pass
```

### Mocking Strategy

```python
# Mock external dependencies
@patch('apps.core.middleware.logging.logger')
def test_with_mocked_logger(self, mock_logger):
    """Test logging calls without actual logging."""
    pass

# Mock expensive operations
@patch('django.core.cache.cache.get')
def test_with_mocked_cache(self, mock_cache):
    """Test cache logic without actual cache."""
    pass
```

---

## Group F Next Steps

After completing Tasks 84-85, proceed to:
- **Next Document:** [04_Tasks-86-88_Documentation.md](04_Tasks-86-88_Documentation.md)
- Document all middleware
- Create middleware README
- Verify server starts successfully

---

## Notes for AI Agents

1. **Test Coverage:** Aim for >80% code coverage
2. **Integration Tests:** Test full stack, not just individual components
3. **Mocking:** Mock external dependencies, test your code
4. **Test Data:** Create fixtures in setUp, clean up in tearDown
5. **Assertions:** Use specific assertions (assertEqual, not assertTrue)
6. **Test Names:** Descriptive names explain what's being tested
7. **Documentation:** Document complex test logic
8. **Performance:** Keep tests fast, mock slow operations
9. **Independence:** Tests should not depend on each other
10. **Edge Cases:** Test boundaries, nulls, empty strings, etc.

