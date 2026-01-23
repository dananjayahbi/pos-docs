# Tasks 71-74: Response & Testing

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 06 - Core Middleware Stack  
> **Group:** E - Rate Limiting Middleware  
> **Document:** 04 of 04  
> **Tasks Covered:** 71, 72, 73, 74

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [03_Tasks-66-70_Window-Headers.md](03_Tasks-66-70_Window-Headers.md)
- **→ Next Group:** [../Group-F_Timezone-Configuration/](../Group-F_Timezone-Configuration/)

---

## Document Overview

This document covers the final implementation tasks for the rate limiting middleware: ensuring proper 429 response handling, implementing IP whitelist functionality, registering the middleware in Django settings, and creating comprehensive tests.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 71 | Return 429 Response | Simple |
| 72 | Add Whitelist | Simple |
| 73 | Register in MIDDLEWARE | Simple |
| 74 | Test Rate Limiting | Medium |

---

## Task 71: Return 429 Response

### Overview
Ensure the 429 Too Many Requests response is properly returned when rate limits are exceeded. This task verifies the complete flow from limit detection to response generation.

### Dependencies
- Task 70: Add Retry-After Header

### Instructions

1. **Review complete __call__ flow**
   - Verify rate limit checking logic
   - Confirm 429 response generation
   - Ensure headers are included

2. **Verify response includes all headers**
   - X-RateLimit-Limit
   - X-RateLimit-Remaining (set to 0)
   - X-RateLimit-Reset
   - Retry-After

3. **Test 429 response format**
   - Status code is 429
   - Content-Type is application/json
   - JSON body has error details
   - All headers present

4. **Document response behavior**
   - When 429 is returned
   - What information is provided
   - How clients should handle it

### Complete __call__ Method

```python
def __call__(self, request):
    """
    Process the request and apply rate limiting.
    
    Flow:
    1. Extract client IP
    2. Check if IP is whitelisted
    3. Determine rate limit key and limit
    4. Check current usage against limit
    5. Return 429 if exceeded, or process normally
    6. Add rate limit headers to response
    
    Args:
        request: The HTTP request object
        
    Returns:
        HTTP response (429 if rate limited, otherwise normal response)
    """
    # Extract client IP address
    client_ip = get_client_ip(request)
    
    # Skip whitelisted IPs
    if self._is_whitelisted(client_ip):
        return self.get_response(request)
    
    # Determine rate limit strategy (endpoint > tenant > user > IP)
    key, limit = self._get_rate_limit_key(request, client_ip)
    
    # Get window (default or custom per endpoint)
    window = self._get_rate_limit_window(request)
    
    # Check rate limit using Redis sliding window
    current_count, remaining, reset_time = self._check_rate_limit(
        key, limit, window
    )
    
    # Rate limit exceeded - return 429
    if remaining < 0:
        retry_after = int(reset_time - time.time())
        response = self._get_429_response(retry_after)
        # Add rate limit headers to 429 response
        self._add_rate_limit_headers(response, limit, 0, reset_time)
        return response
    
    # Process request normally
    response = self.get_response(request)
    
    # Add rate limit headers to successful response
    self._add_rate_limit_headers(response, limit, remaining, reset_time)
    
    return response
```

### Complete 429 Response Method

```python
def _get_429_response(self, retry_after):
    """
    Create a 429 Too Many Requests response.
    
    Returns a JSON response with:
    - 429 status code
    - Clear error message
    - Error code for programmatic handling
    - Retry-After header
    - Actionable information for clients
    
    Args:
        retry_after: Seconds until retry allowed (integer)
        
    Returns:
        JsonResponse with 429 status and Retry-After header
    """
    response = JsonResponse(
        {
            'error': 'Rate limit exceeded',
            'code': 'RATE_LIMIT_EXCEEDED',
            'message': (
                f'Too many requests. Please retry after {retry_after} seconds.'
            ),
            'retry_after': retry_after,
            'documentation': '/docs/api/rate-limits/',
        },
        status=429
    )
    
    # Add Retry-After header (standard HTTP header)
    response['Retry-After'] = str(retry_after)
    
    return response
```

### 429 Response Verification

```python
# Example test to verify 429 response

def test_rate_limit_429_response(client):
    """Test that 429 response has all required components."""
    
    # Make requests up to limit
    for i in range(100):
        response = client.get('/api/v1/test/')
        assert response.status_code == 200
    
    # 101st request should return 429
    response = client.get('/api/v1/test/')
    
    # Verify status code
    assert response.status_code == 429
    
    # Verify headers
    assert 'X-RateLimit-Limit' in response
    assert 'X-RateLimit-Remaining' in response
    assert 'X-RateLimit-Reset' in response
    assert 'Retry-After' in response
    
    assert response['X-RateLimit-Remaining'] == '0'
    
    # Verify JSON body
    data = response.json()
    assert data['error'] == 'Rate limit exceeded'
    assert data['code'] == 'RATE_LIMIT_EXCEEDED'
    assert 'retry_after' in data
    assert isinstance(data['retry_after'], int)
```

### Complete 429 Response Example

```http
HTTP/1.1 429 Too Many Requests
Content-Type: application/json
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1703251590
Retry-After: 45

{
  "error": "Rate limit exceeded",
  "code": "RATE_LIMIT_EXCEEDED",
  "message": "Too many requests. Please retry after 45 seconds.",
  "retry_after": 45,
  "documentation": "/docs/api/rate-limits/"
}
```

### Response Flow Diagram

```
Request Received
    │
    ├─→ Extract Client IP
    │
    ├─→ Check Whitelist → [Whitelisted] → Process Normally
    │                      [Not Whitelisted]
    │                           │
    ├─→ Get Rate Limit Key & Limit
    │
    ├─→ Check Redis Counter
    │
    ├─→ Remaining < 0? → [YES] → Create 429 Response
    │                             Add Headers
    │                             Return 429
    │                    [NO]
    │                     │
    └─→ Process Request Normally
        Add Headers
        Return Response
```

### Expected Outcome
- 429 responses properly formatted
- All required headers included
- JSON body has actionable information
- Flow verified and tested

### Verification Checklist
- [ ] `__call__` method returns 429 when limit exceeded
- [ ] 429 response includes X-RateLimit-* headers
- [ ] 429 response includes Retry-After header
- [ ] X-RateLimit-Remaining set to 0 in 429 response
- [ ] JSON body has error, code, message, retry_after
- [ ] Status code is exactly 429
- [ ] Response flow is complete and logical

---

## Task 72: Add Whitelist

### Overview
Implement IP whitelist functionality to bypass rate limiting for trusted IPs like internal services, monitoring tools, or administrative access.

### Dependencies
- Task 71: Return 429 Response

### Instructions

1. **Implement _is_whitelisted method**
   - Accept IP address parameter
   - Check against WHITELISTED_IPS list
   - Return boolean

2. **Configure whitelist in settings**
   - Add RATELIMIT_WHITELISTED_IPS setting
   - Include common local IPs
   - Support IPv4 and IPv6

3. **Add whitelist check to __call__**
   - Check whitelist early in flow
   - Skip all rate limiting if whitelisted
   - Return normal response immediately

4. **Document whitelist usage**
   - When to use whitelist
   - Security considerations
   - Common whitelist entries

### Whitelist Implementation

```python
def _is_whitelisted(self, ip):
    """
    Check if an IP address is whitelisted.
    
    Whitelisted IPs bypass all rate limiting. Use for:
    - Internal services
    - Health check endpoints
    - Administrative access
    - Monitoring tools
    
    Args:
        ip: The IP address to check
        
    Returns:
        bool: True if whitelisted, False otherwise
    """
    return ip in self.WHITELISTED_IPS
```

### Whitelist Configuration

```python
# In settings/ratelimit.py or settings/base.py

RATELIMIT_WHITELISTED_IPS = [
    # Localhost (IPv4 and IPv6)
    '127.0.0.1',
    '::1',
    
    # Docker bridge network
    '172.17.0.1',
    
    # Internal network (example)
    '10.0.0.0/8',  # Note: Basic implementation checks exact match
    
    # Load balancer health checks
    '10.0.1.100',
    
    # Monitoring services
    '10.0.2.50',
    '10.0.2.51',
    
    # CI/CD servers
    '10.0.3.10',
]
```

### Whitelist Check in __call__

```python
def __call__(self, request):
    """
    Process the request and apply rate limiting.
    """
    # Extract client IP address
    client_ip = get_client_ip(request)
    
    # Skip whitelisted IPs (bypass all rate limiting)
    if self._is_whitelisted(client_ip):
        return self.get_response(request)
    
    # Continue with rate limiting for non-whitelisted IPs
    key, limit = self._get_rate_limit_key(request, client_ip)
    window = self._get_rate_limit_window(request)
    
    current_count, remaining, reset_time = self._check_rate_limit(
        key, limit, window
    )
    
    if remaining < 0:
        retry_after = int(reset_time - time.time())
        response = self._get_429_response(retry_after)
        self._add_rate_limit_headers(response, limit, 0, reset_time)
        return response
    
    response = self.get_response(request)
    self._add_rate_limit_headers(response, limit, remaining, reset_time)
    
    return response
```

### Advanced Whitelist: CIDR Support

For production systems, consider supporting CIDR notation:

```python
import ipaddress

def _is_whitelisted(self, ip):
    """
    Check if an IP address is whitelisted.
    
    Supports both individual IPs and CIDR notation.
    
    Args:
        ip: The IP address to check
        
    Returns:
        bool: True if whitelisted, False otherwise
    """
    try:
        ip_addr = ipaddress.ip_address(ip)
        
        for whitelist_entry in self.WHITELISTED_IPS:
            try:
                # Check if entry is CIDR notation
                if '/' in whitelist_entry:
                    network = ipaddress.ip_network(whitelist_entry, strict=False)
                    if ip_addr in network:
                        return True
                else:
                    # Exact IP match
                    if ip == whitelist_entry:
                        return True
            except ValueError:
                # Invalid whitelist entry, skip
                continue
        
        return False
    except ValueError:
        # Invalid IP address
        return False
```

### Whitelist Use Cases

| Use Case | IPs to Whitelist | Reason |
|----------|------------------|--------|
| **Localhost** | 127.0.0.1, ::1 | Development testing |
| **Health Checks** | Load balancer IPs | Prevent health check failures |
| **Internal Services** | Service mesh IPs | Inter-service communication |
| **Monitoring** | Monitoring tool IPs | Continuous monitoring |
| **Admin Access** | Admin VPN IPs | Emergency access |
| **CI/CD** | CI/CD server IPs | Automated testing |

### Whitelist Security Considerations

| Concern | Mitigation |
|---------|------------|
| **Too Broad** | Be specific, avoid wildcards |
| **Misconfiguration** | Validate IP format on startup |
| **Outdated Entries** | Regular audit and cleanup |
| **External IPs** | Never whitelist public IPs |
| **Documentation** | Document reason for each entry |

### Testing Whitelist

```python
def test_whitelisted_ip_bypasses_rate_limit(client):
    """Test that whitelisted IPs bypass rate limiting."""
    
    # Configure client to use whitelisted IP
    # (implementation depends on test client)
    
    # Make more requests than limit
    for i in range(200):
        response = client.get(
            '/api/v1/test/',
            HTTP_X_FORWARDED_FOR='127.0.0.1'
        )
        # Should never return 429
        assert response.status_code == 200
```

### Expected Outcome
- Whitelist functionality implemented
- Trusted IPs bypass rate limiting
- Configuration is secure and documented
- Common whitelist IPs included

### Verification Checklist
- [ ] `_is_whitelisted()` method implemented
- [ ] WHITELISTED_IPS loaded from settings
- [ ] Whitelist check early in __call__ method
- [ ] Whitelisted IPs skip rate limiting entirely
- [ ] Common local IPs included (127.0.0.1, ::1)
- [ ] Settings include example whitelist entries
- [ ] Security considerations documented

---

## Task 73: Register in MIDDLEWARE

### Overview
Register the RateLimitMiddleware in Django's MIDDLEWARE setting to activate it for all requests.

### Dependencies
- Task 72: Add Whitelist
- All rate limiting functionality complete

### Instructions

1. **Locate Django settings**
   - File: `backend/settings/base.py` or similar
   - Find MIDDLEWARE list

2. **Determine middleware position**
   - After SecurityMiddleware
   - After SessionMiddleware
   - After AuthenticationMiddleware
   - Before application middleware

3. **Add middleware to MIDDLEWARE list**
   - Full path: `'apps.core.middleware.ratelimit.RateLimitMiddleware'`
   - Adjust path based on project structure

4. **Verify middleware order**
   - Tenant middleware before rate limit (if using tenants)
   - Authentication middleware before rate limit
   - Rate limit before application logic

5. **Test middleware activation**
   - Restart Django server
   - Verify rate limiting works
   - Check middleware is loaded

### Middleware Registration

```python
# File: backend/settings/base.py

MIDDLEWARE = [
    # Django core middleware
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    
    # Multi-tenancy middleware (if applicable)
    'apps.tenants.middleware.TenantMiddleware',
    
    # Custom middleware
    'apps.core.middleware.request_id.RequestIDMiddleware',
    'apps.core.middleware.logging.RequestLoggingMiddleware',
    'apps.core.middleware.security.SecurityHeadersMiddleware',
    
    # Rate limiting middleware
    'apps.core.middleware.ratelimit.RateLimitMiddleware',
    
    # Application middleware
    # ... (other custom middleware)
]
```

### Middleware Order Explanation

| Middleware | Position | Reason |
|------------|----------|--------|
| **SecurityMiddleware** | First | Security headers, SSL redirect |
| **SessionMiddleware** | Early | Session required by auth |
| **AuthenticationMiddleware** | Before rate limit | User context needed |
| **TenantMiddleware** | Before rate limit | Tenant context needed |
| **RateLimitMiddleware** | Before app logic | Protect all endpoints |
| **Application Middleware** | After rate limit | Already protected |

### Middleware Order Diagram

```
Request
    ↓
SecurityMiddleware (SSL, HSTS)
    ↓
SessionMiddleware (Session loading)
    ↓
CommonMiddleware (URL processing)
    ↓
CsrfViewMiddleware (CSRF protection)
    ↓
AuthenticationMiddleware (Set request.user)
    ↓
TenantMiddleware (Set request.tenant)
    ↓
RequestIDMiddleware (Add request ID)
    ↓
SecurityHeadersMiddleware (Add security headers)
    ↓
RateLimitMiddleware ← [THIS TASK]
    ↓
Application Views
    ↓
Response
```

### Verification Steps

1. **Check middleware loads without errors**
```bash
python manage.py check --deploy
```

2. **Verify in Django shell**
```python
from django.conf import settings
print(settings.MIDDLEWARE)
# Should include 'apps.core.middleware.ratelimit.RateLimitMiddleware'
```

3. **Test rate limiting works**
```bash
# Make multiple requests to trigger rate limit
for i in {1..101}; do
    curl http://localhost:8000/api/v1/test/
done
# Last request should return 429
```

4. **Check logs**
```python
# Add logging to middleware for verification
import logging
logger = logging.getLogger(__name__)

def __call__(self, request):
    logger.info(f"Rate limit middleware processing: {request.path}")
    # ... rest of implementation
```

### Environment-Specific Configuration

```python
# File: backend/settings/development.py
from .base import *

# Disable rate limiting in development (optional)
RATELIMIT_ANONYMOUS_LIMIT = 10000
RATELIMIT_USER_LIMIT = 10000

# Or remove middleware entirely for development
# MIDDLEWARE = [m for m in MIDDLEWARE if 'RateLimitMiddleware' not in m]
```

```python
# File: backend/settings/production.py
from .base import *

# Strict rate limiting in production
RATELIMIT_ANONYMOUS_LIMIT = 100
RATELIMIT_USER_LIMIT = 1000
RATELIMIT_TENANT_LIMIT = 10000

# Production whitelist
RATELIMIT_WHITELISTED_IPS = [
    '10.0.1.100',  # Load balancer
    '10.0.2.50',   # Monitoring
]
```

### Expected Outcome
- Middleware registered in settings
- Correct position in middleware stack
- Rate limiting active for all requests
- No startup errors

### Verification Checklist
- [ ] Middleware added to MIDDLEWARE list in settings
- [ ] Full path is correct: `apps.core.middleware.ratelimit.RateLimitMiddleware`
- [ ] Position is after auth/tenant middleware
- [ ] Position is before application middleware
- [ ] `python manage.py check` passes
- [ ] Server starts without errors
- [ ] Rate limiting works on test requests
- [ ] Middleware order documented

---

## Task 74: Test Rate Limiting

### Overview
Create comprehensive tests for the rate limiting middleware to ensure all functionality works correctly under various scenarios.

### Dependencies
- Task 73: Register in MIDDLEWARE
- All rate limiting functionality complete

### Instructions

1. **Create test file**
   - Location: `backend/apps/core/tests/test_ratelimit_middleware.py`
   - Import necessary testing utilities
   - Set up test fixtures

2. **Write test cases**
   - Basic rate limiting
   - Different strategies (IP, user, tenant, endpoint)
   - Headers in responses
   - 429 response format
   - Whitelist functionality
   - Window expiration
   - Redis errors (fail open)

3. **Test edge cases**
   - Exact limit boundary
   - Multiple concurrent requests
   - Window reset behavior
   - Missing/invalid IP
   - Anonymous vs authenticated

4. **Add integration tests**
   - Full middleware stack
   - Real Redis instance
   - Multiple clients

### Complete Test Suite

```python
# File: backend/apps/core/tests/test_ratelimit_middleware.py
"""
Tests for RateLimitMiddleware.

Covers:
- Basic rate limiting functionality
- Different rate limit strategies (IP, user, tenant, endpoint)
- Response headers
- 429 error responses
- Whitelist functionality
- Window expiration
- Edge cases
"""

import time
from unittest.mock import patch, MagicMock
from django.test import TestCase, RequestFactory, override_settings
from django.contrib.auth import get_user_model
from django.core.cache import cache
from apps.core.middleware.ratelimit import RateLimitMiddleware

User = get_user_model()


class RateLimitMiddlewareTestCase(TestCase):
    """Test cases for RateLimitMiddleware."""
    
    def setUp(self):
        """Set up test fixtures."""
        self.factory = RequestFactory()
        self.get_response = MagicMock(return_value=MagicMock(status_code=200))
        self.middleware = RateLimitMiddleware(self.get_response)
        
        # Clear Redis cache before each test
        cache.clear()
        
        # Create test user
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
    
    def tearDown(self):
        """Clean up after tests."""
        cache.clear()
    
    # Test 1: Basic IP-based rate limiting
    def test_ip_rate_limit_enforced(self):
        """Test that IP-based rate limit is enforced for anonymous users."""
        request = self.factory.get('/api/v1/test/')
        request.user = MagicMock(is_authenticated=False)
        
        # Make requests up to limit (default: 100)
        for i in range(100):
            response = self.middleware(request)
            self.assertEqual(response.status_code, 200)
        
        # 101st request should return 429
        response = self.middleware(request)
        self.assertEqual(response.status_code, 429)
    
    # Test 2: Rate limit headers present
    def test_rate_limit_headers_present(self):
        """Test that rate limit headers are added to responses."""
        request = self.factory.get('/api/v1/test/')
        request.user = MagicMock(is_authenticated=False)
        
        response = self.middleware(request)
        
        # Check headers exist
        self.assertIn('X-RateLimit-Limit', response)
        self.assertIn('X-RateLimit-Remaining', response)
        self.assertIn('X-RateLimit-Reset', response)
        
        # Check header values
        self.assertEqual(response['X-RateLimit-Limit'], '100')
        self.assertTrue(int(response['X-RateLimit-Remaining']) >= 0)
        self.assertTrue(int(response['X-RateLimit-Reset']) > time.time())
    
    # Test 3: 429 response format
    def test_429_response_format(self):
        """Test that 429 response has correct format."""
        request = self.factory.get('/api/v1/test/')
        request.user = MagicMock(is_authenticated=False)
        
        # Exhaust rate limit
        for i in range(100):
            self.middleware(request)
        
        # Get 429 response
        response = self.middleware(request)
        
        # Check status code
        self.assertEqual(response.status_code, 429)
        
        # Check headers
        self.assertEqual(response['X-RateLimit-Remaining'], '0')
        self.assertIn('Retry-After', response)
        
        # Check JSON body
        data = response.json()
        self.assertEqual(data['error'], 'Rate limit exceeded')
        self.assertEqual(data['code'], 'RATE_LIMIT_EXCEEDED')
        self.assertIn('retry_after', data)
    
    # Test 4: User-based rate limiting
    @override_settings(RATELIMIT_USER_LIMIT=10)
    def test_user_based_rate_limit(self):
        """Test that authenticated users get user-based rate limit."""
        request = self.factory.get('/api/v1/test/')
        request.user = self.user
        
        # Make requests up to user limit (10 in this test)
        for i in range(10):
            response = self.middleware(request)
            self.assertEqual(response.status_code, 200)
            self.assertEqual(response['X-RateLimit-Limit'], '10')
        
        # 11th request should return 429
        response = self.middleware(request)
        self.assertEqual(response.status_code, 429)
    
    # Test 5: Whitelist functionality
    @override_settings(RATELIMIT_WHITELISTED_IPS=['127.0.0.1'])
    def test_whitelisted_ip_bypasses_limit(self):
        """Test that whitelisted IPs bypass rate limiting."""
        request = self.factory.get('/api/v1/test/')
        request.user = MagicMock(is_authenticated=False)
        request.META['REMOTE_ADDR'] = '127.0.0.1'
        
        # Make many requests (more than limit)
        for i in range(200):
            response = self.middleware(request)
            # Should never return 429
            self.assertEqual(response.status_code, 200)
    
    # Test 6: Endpoint-specific limits
    @override_settings(RATELIMIT_ENDPOINT_LIMITS={'/api/v1/auth/login': 5})
    def test_endpoint_specific_limit(self):
        """Test that endpoint-specific limits are enforced."""
        request = self.factory.post('/api/v1/auth/login')
        request.user = MagicMock(is_authenticated=False)
        
        # Make requests up to endpoint limit (5)
        for i in range(5):
            response = self.middleware(request)
            self.assertEqual(response.status_code, 200)
            self.assertEqual(response['X-RateLimit-Limit'], '5')
        
        # 6th request should return 429
        response = self.middleware(request)
        self.assertEqual(response.status_code, 429)
    
    # Test 7: Different users independent counters
    @override_settings(RATELIMIT_USER_LIMIT=10)
    def test_different_users_independent_counters(self):
        """Test that different users have independent counters."""
        user1 = self.user
        user2 = User.objects.create_user(
            username='testuser2',
            email='test2@example.com',
            password='testpass123'
        )
        
        # User 1 makes requests
        request1 = self.factory.get('/api/v1/test/')
        request1.user = user1
        for i in range(10):
            response = self.middleware(request1)
            self.assertEqual(response.status_code, 200)
        
        # User 1 is rate limited
        response = self.middleware(request1)
        self.assertEqual(response.status_code, 429)
        
        # User 2 can still make requests (independent counter)
        request2 = self.factory.get('/api/v1/test/')
        request2.user = user2
        response = self.middleware(request2)
        self.assertEqual(response.status_code, 200)
    
    # Test 8: Window expiration
    @override_settings(RATELIMIT_WINDOW=1)  # 1 second window
    def test_window_expiration(self):
        """Test that rate limit resets after window expires."""
        request = self.factory.get('/api/v1/test/')
        request.user = MagicMock(is_authenticated=False)
        
        # Make some requests
        for i in range(5):
            response = self.middleware(request)
            self.assertEqual(response.status_code, 200)
        
        # Wait for window to expire
        time.sleep(1.5)
        
        # Should be able to make requests again
        for i in range(5):
            response = self.middleware(request)
            self.assertEqual(response.status_code, 200)
    
    # Test 9: Remaining count decreases
    def test_remaining_count_decreases(self):
        """Test that remaining count decreases with each request."""
        request = self.factory.get('/api/v1/test/')
        request.user = MagicMock(is_authenticated=False)
        
        # First request
        response = self.middleware(request)
        remaining1 = int(response['X-RateLimit-Remaining'])
        
        # Second request
        response = self.middleware(request)
        remaining2 = int(response['X-RateLimit-Remaining'])
        
        # Remaining should decrease by 1
        self.assertEqual(remaining1 - 1, remaining2)
    
    # Test 10: Redis error handling (fail open)
    @patch('django.core.cache.cache.client.get_client')
    def test_redis_error_fail_open(self, mock_redis):
        """Test that Redis errors result in allowing request (fail open)."""
        # Mock Redis to raise exception
        mock_redis.side_effect = Exception("Redis connection error")
        
        request = self.factory.get('/api/v1/test/')
        request.user = MagicMock(is_authenticated=False)
        
        # Should allow request even with Redis error
        response = self.middleware(request)
        self.assertEqual(response.status_code, 200)


class RateLimitIntegrationTestCase(TestCase):
    """Integration tests for rate limiting with real Redis."""
    
    def setUp(self):
        """Set up test fixtures."""
        cache.clear()
    
    def tearDown(self):
        """Clean up after tests."""
        cache.clear()
    
    def test_full_middleware_stack(self):
        """Test rate limiting with full middleware stack."""
        # This would use Django's test client
        # which processes through full middleware stack
        from django.test import Client
        
        client = Client()
        
        # Make requests up to limit
        for i in range(100):
            response = client.get('/api/v1/test/')
            self.assertIn(response.status_code, [200, 404])  # 404 if endpoint doesn't exist
            
            if response.status_code == 200:
                # Check headers
                self.assertIn('X-RateLimit-Limit', response)
                self.assertIn('X-RateLimit-Remaining', response)
                self.assertIn('X-RateLimit-Reset', response)
```

### Test Execution

```bash
# Run all rate limit tests
python manage.py test apps.core.tests.test_ratelimit_middleware

# Run specific test
python manage.py test apps.core.tests.test_ratelimit_middleware.RateLimitMiddlewareTestCase.test_ip_rate_limit_enforced

# Run with coverage
coverage run --source='apps.core.middleware.ratelimit' manage.py test apps.core.tests.test_ratelimit_middleware
coverage report
```

### Test Coverage Goals

| Area | Target Coverage | Key Tests |
|------|-----------------|-----------|
| **Basic Functionality** | 100% | IP, User, Tenant, Endpoint limiting |
| **Headers** | 100% | All rate limit headers present |
| **429 Response** | 100% | Status, headers, JSON body |
| **Whitelist** | 100% | Bypass functionality |
| **Edge Cases** | 90% | Boundaries, errors, concurrency |
| **Overall** | 95%+ | Comprehensive coverage |

### Additional Test Scenarios

```python
# Test: Tenant-based rate limiting
def test_tenant_rate_limit(self):
    """Test tenant-based rate limiting."""
    request = self.factory.get('/api/v1/test/')
    request.user = self.user
    request.tenant = MagicMock(id=1)
    
    # Tenant limit should be used
    response = self.middleware(request)
    self.assertEqual(response['X-RateLimit-Limit'], '10000')

# Test: Custom window per endpoint
def test_custom_endpoint_window(self):
    """Test custom window for specific endpoints."""
    # Implementation depends on custom window support

# Test: Concurrent requests
def test_concurrent_requests(self):
    """Test rate limiting under concurrent load."""
    import threading
    
    def make_request():
        request = self.factory.get('/api/v1/test/')
        request.user = MagicMock(is_authenticated=False)
        return self.middleware(request)
    
    # Make concurrent requests
    threads = []
    for i in range(10):
        thread = threading.Thread(target=make_request)
        threads.append(thread)
        thread.start()
    
    for thread in threads:
        thread.join()
    
    # Verify rate limiting still works
```

### Expected Outcome
- Comprehensive test suite created
- All rate limiting scenarios tested
- Edge cases covered
- Integration tests included
- 95%+ test coverage achieved

### Verification Checklist
- [ ] Test file created: `test_ratelimit_middleware.py`
- [ ] Basic rate limiting tests pass
- [ ] Header tests pass (Limit, Remaining, Reset, Retry-After)
- [ ] 429 response format tests pass
- [ ] Strategy tests pass (IP, user, tenant, endpoint)
- [ ] Whitelist tests pass
- [ ] Edge case tests pass
- [ ] Integration tests pass
- [ ] Test coverage ≥ 95%
- [ ] All tests pass in CI/CD pipeline

---

## Group E Complete

### Summary

Group E: Rate Limiting Middleware is now complete with:

✅ **Document 01:** Rate limit setup and Redis backend  
✅ **Document 02:** Rate limit strategies (IP, user, tenant, endpoint)  
✅ **Document 03:** Sliding window and response headers  
✅ **Document 04:** 429 responses, whitelist, registration, and tests  

### Deliverables Checklist

- [x] RateLimitMiddleware class created
- [x] Redis backend configured with sliding window
- [x] IP-based rate limiting implemented
- [x] User-based rate limiting implemented
- [x] Tenant-based rate limiting implemented
- [x] Endpoint-based rate limiting implemented
- [x] Sliding window algorithm configured
- [x] X-RateLimit-Limit header added
- [x] X-RateLimit-Remaining header added
- [x] X-RateLimit-Reset header added
- [x] Retry-After header added
- [x] 429 response properly formatted
- [x] IP whitelist functionality implemented
- [x] Middleware registered in settings
- [x] Comprehensive tests created
- [x] All tests passing

### Files Created

```
backend/apps/core/
├── middleware/
│   └── ratelimit.py              # Rate limiting middleware
└── tests/
    └── test_ratelimit_middleware.py  # Comprehensive tests
```

### Next Steps

Proceed to:
- **→ Next Group:** [../Group-F_Timezone-Configuration/](../Group-F_Timezone-Configuration/)
- Configure timezone handling middleware
- Add timezone detection
- Handle timezone conversion

---

## Notes for AI Agents

1. **429 Response:** Always return 429 when rate limit exceeded
2. **Whitelist Early:** Check whitelist before any rate limiting logic
3. **Fail Open:** On Redis errors, allow request (don't block traffic)
4. **Headers Always:** Include rate limit headers in all responses
5. **Testing:** Mock Redis for unit tests, use real Redis for integration tests
6. **Coverage:** Aim for 95%+ test coverage
7. **Middleware Order:** Critical for proper functionality (auth before rate limit)
8. **Settings:** Use environment-specific settings (dev vs production)
9. **Documentation:** Clear docstrings and inline comments
10. **Performance:** Minimize Redis calls, use pipelines for atomicity
