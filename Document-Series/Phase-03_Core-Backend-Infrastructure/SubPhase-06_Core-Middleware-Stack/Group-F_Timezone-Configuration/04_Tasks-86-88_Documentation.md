# Tasks 86-88: Documentation

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 06 - Core Middleware Stack  
> **Group:** F - Timezone & Configuration  
> **Document:** 04 of 04  
> **Tasks Covered:** 86, 87, 88

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [03_Tasks-84-85_Test-Suite.md](03_Tasks-84-85_Test-Suite.md)
- **→ Next SubPhase:** [../../SubPhase-07_Exception-Handling/](../../SubPhase-07_Exception-Handling/)

---

## Document Overview

This document covers the final steps of SubPhase-06: creating comprehensive documentation for all middleware, creating a user-friendly README, and verifying that the server starts successfully with the complete middleware stack.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 86 | Document All Middleware | Medium |
| 87 | Create Middleware README | Medium |
| 88 | Verify Server Starts | Simple |

---

## Task 86: Document All Middleware

### Overview
Create comprehensive technical documentation for all middleware components in a centralized documentation file.

### Dependencies
- All middleware from Groups A-F implemented
- All tests from Task 84-85 complete

### Instructions

1. **Create middleware documentation file**
   - Location: `backend/apps/core/docs/middleware.md`
   - Ensure docs directory exists

2. **Document each middleware component**
   - Purpose and functionality
   - Configuration options
   - Usage examples
   - Dependencies

3. **Include middleware stack documentation**
   - Complete middleware list
   - Order and rationale
   - Configuration examples

4. **Add troubleshooting section**
   - Common issues
   - Debug tips
   - Performance considerations

### Documentation File Structure

```markdown
# Core Middleware Documentation

> **Version:** 1.0  
> **Last Updated:** [Date]  
> **SubPhase:** 06 - Core Middleware Stack

---

## Table of Contents

1. [Overview](#overview)
2. [Middleware Stack](#middleware-stack)
3. [Middleware Components](#middleware-components)
   - [TenantMiddleware](#tenantmiddleware)
   - [SecurityHeadersMiddleware](#securityheadersmiddleware)
   - [RateLimitMiddleware](#ratelimitmiddleware)
   - [RequestLoggingMiddleware](#requestloggingmiddleware)
   - [TimezoneMiddleware](#timezonemiddleware)
4. [Configuration](#configuration)
5. [Testing](#testing)
6. [Troubleshooting](#troubleshooting)
7. [Performance](#performance)

---

## Overview

The core middleware stack provides essential functionality for:
- Multi-tenant request handling
- Security header management
- Rate limiting and abuse prevention
- Request/response logging
- Timezone activation per request

All middleware components are designed to work together in a specific
order to ensure proper operation and security.

---

## Middleware Stack

### Complete Stack Order

```python
MIDDLEWARE = [
    # Security Layer
    'django.middleware.security.SecurityMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    
    # Multi-Tenancy
    'django_tenants.middleware.main.TenantMainMiddleware',
    
    # Custom Security & Rate Limiting
    'apps.core.middleware.security.SecurityHeadersMiddleware',
    'apps.core.middleware.ratelimit.RateLimitMiddleware',
    
    # Django Core
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    
    # Custom Middleware (Requires Auth)
    'apps.core.middleware.logging.RequestLoggingMiddleware',
    'apps.core.middleware.timezone.TimezoneMiddleware',
    
    # Django Auxiliary
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]
```

### Order Rationale

1. **Security First:** SecurityMiddleware and CorsMiddleware at the top
   - Handle SSL/HTTPS redirects before any processing
   - Set CORS headers early in response cycle

2. **Tenant Resolution Early:** TenantMainMiddleware after security
   - Tenant context needed by most other middleware
   - Database routing depends on tenant

3. **Rate Limiting Before Expensive Operations:**
   - Block abusive requests before database access
   - Reduce load on backend services

4. **Authentication Before User-Dependent Middleware:**
   - RequestLoggingMiddleware needs user context
   - TimezoneMiddleware needs user preferences

5. **Timezone Before Content Generation:**
   - All datetime operations use correct timezone
   - Templates and API responses properly formatted

---

## Middleware Components

### TenantMiddleware

**Purpose:** Resolves tenant from request domain and sets up multi-tenant context.

**Location:** `apps.core.middleware.tenant.py`

**Functionality:**
- Extracts tenant from request domain
- Sets `request.tenant` attribute
- Configures database routing for tenant
- Handles tenant resolution errors

**Dependencies:**
- django-tenants package
- Tenant model from Phase 02

**Configuration:**
```python
# settings/base.py
TENANT_MODEL = 'tenants.Tenant'
TENANT_DOMAIN_MODEL = 'tenants.Domain'
```

**Usage:**
```python
# In views
def my_view(request):
    tenant = request.tenant  # Available after middleware
    # Use tenant for tenant-specific logic
```

**Error Handling:**
- Returns 404 if tenant not found
- Logs tenant resolution failures
- Falls back to public schema for specific paths

---

### SecurityHeadersMiddleware

**Purpose:** Adds custom security headers to all responses.

**Location:** `apps.core.middleware.security.py`

**Functionality:**
- Adds Content-Security-Policy headers
- Sets X-Content-Type-Options
- Configures X-XSS-Protection
- Adds Referrer-Policy

**Dependencies:**
- None

**Configuration:**
```python
# settings/base.py
SECURITY_HEADERS = {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
}

CSP_DEFAULT_SRC = ["'self'"]
CSP_SCRIPT_SRC = ["'self'", "'unsafe-inline'"]
CSP_STYLE_SRC = ["'self'", "'unsafe-inline'"]
```

**Headers Added:**
```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; ...
```

---

### RateLimitMiddleware

**Purpose:** Implements rate limiting to prevent API abuse.

**Location:** `apps.core.middleware.ratelimit.py`

**Functionality:**
- Limits requests per IP address
- Limits requests per authenticated user
- Configurable limits per endpoint
- Whitelist for trusted IPs

**Dependencies:**
- Redis cache backend
- django-redis package

**Configuration:**
```python
# settings/base.py
RATELIMIT_ENABLE = True
RATELIMIT_DEFAULT = '100/hour'
RATELIMIT_BY_USER = '200/hour'
RATELIMIT_BY_IP = '100/hour'

# Whitelist IPs
RATELIMIT_WHITELIST = [
    '127.0.0.1',
    '10.0.0.0/8',
]

# Per-endpoint limits
RATELIMIT_OVERRIDES = {
    '/api/auth/login/': '10/minute',
    '/api/public/': '50/minute',
}
```

**Response:**
```
HTTP 429 Too Many Requests
{
    "error": "Rate limit exceeded",
    "retry_after": 3600
}
```

**Headers:**
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 45
X-RateLimit-Reset: 1234567890
```

---

### RequestLoggingMiddleware

**Purpose:** Logs all HTTP requests and responses for monitoring and debugging.

**Location:** `apps.core.middleware.logging.py`

**Functionality:**
- Logs request method, path, user
- Logs response status, size, duration
- Captures tenant context
- Performance timing
- Error tracking

**Dependencies:**
- Python logging
- Configured logging handlers

**Configuration:**
```python
# settings/base.py
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
        },
        'file': {
            'class': 'logging.FileHandler',
            'filename': 'logs/requests.log',
        },
    },
    'loggers': {
        'apps.core.middleware.logging': {
            'handlers': ['console', 'file'],
            'level': 'INFO',
        },
    },
}

# Middleware configuration
REQUEST_LOGGING_ENABLE = True
REQUEST_LOGGING_EXCLUDE_PATHS = [
    '/health/',
    '/metrics/',
]
```

**Log Format:**
```
[2026-01-23 10:30:45] INFO: GET /api/products/ | User: john@example.com | Tenant: acme | Status: 200 | Duration: 45ms | Size: 1234 bytes
```

**Excluded Paths:**
- Health check endpoints
- Static files
- Metrics endpoints
- Any path matching exclude patterns

---

### TimezoneMiddleware

**Purpose:** Activates appropriate timezone for each request based on user/tenant preferences.

**Location:** `apps.core.middleware.timezone.py`

**Functionality:**
- Resolves timezone from user profile
- Falls back to tenant timezone
- Defaults to Asia/Colombo (Sri Lanka)
- Activates timezone for request lifecycle
- Deactivates after response

**Dependencies:**
- Python zoneinfo module (Python 3.9+)
- Django timezone utilities
- User model with timezone field
- Tenant model with timezone field

**Configuration:**
```python
# settings/base.py
USE_TZ = True
TIME_ZONE = 'UTC'  # Storage timezone

# Default timezone for requests
DEFAULT_TIMEZONE = 'Asia/Colombo'
```

**Timezone Priority:**
1. User profile timezone (if authenticated)
2. Tenant timezone setting
3. Default: Asia/Colombo

**User Model:**
```python
class User(AbstractUser):
    timezone = models.CharField(
        max_length=50,
        default='Asia/Colombo',
        choices=[(tz, tz) for tz in pytz.all_timezones]
    )
```

**Tenant Model:**
```python
class Tenant(TenantMixin):
    timezone = models.CharField(
        max_length=50,
        default='Asia/Colombo'
    )
```

**Usage in Views:**
```python
from django.utils import timezone

def my_view(request):
    # Current timezone is already activated
    now = timezone.now()  # Returns timezone-aware datetime
    
    # For specific timezone operations
    user_tz = timezone.get_current_timezone()
    localized_time = now.astimezone(user_tz)
```

**Supported Timezones:**
- All IANA timezone database entries
- Examples: 'America/New_York', 'Europe/London', 'Asia/Tokyo'
- See: https://en.wikipedia.org/wiki/List_of_tz_database_time_zones

**Error Handling:**
- Invalid timezone names logged and ignored
- Falls back to default timezone
- Never crashes the request

---

## Configuration

### Production Settings

```python
# settings/production.py

# Enable all middleware
MIDDLEWARE = [
    # ... complete stack as shown above
]

# Security
SECURE_SSL_REDIRECT = True
SECURE_HSTS_SECONDS = 31536000
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True

# Rate limiting
RATELIMIT_ENABLE = True
RATELIMIT_DEFAULT = '1000/hour'

# Logging
REQUEST_LOGGING_ENABLE = True
LOGGING['loggers']['apps.core.middleware.logging']['level'] = 'INFO'

# Timezone
DEFAULT_TIMEZONE = 'Asia/Colombo'
```

### Development Settings

```python
# settings/development.py

# Add debug toolbar before other middleware
MIDDLEWARE = [
    'debug_toolbar.middleware.DebugToolbarMiddleware',
] + MIDDLEWARE

# Less strict rate limiting
RATELIMIT_DEFAULT = '10000/hour'

# More verbose logging
LOGGING['loggers']['apps.core.middleware.logging']['level'] = 'DEBUG'
```

---

## Testing

### Running Middleware Tests

```bash
# Run all middleware tests
python manage.py test apps.core.tests

# Run specific middleware test
python manage.py test apps.core.tests.test_timezone_middleware

# Run integration tests
python manage.py test apps.core.tests.test_middleware_integration

# Run with coverage
coverage run --source='apps.core.middleware' manage.py test
coverage report
coverage html
```

### Test Coverage Goals

- Overall coverage: >80%
- Each middleware: >90%
- Integration tests: All scenarios covered

---

## Troubleshooting

### Common Issues

#### Timezone Not Activating

**Symptoms:**
- Datetimes showing in UTC
- User timezone preference ignored

**Solutions:**
1. Check TimezoneMiddleware is in MIDDLEWARE
2. Verify middleware order (after AuthenticationMiddleware)
3. Check user has timezone field populated
4. Check logs for timezone activation errors

```bash
# Check logs
tail -f logs/django.log | grep "timezone"
```

#### Rate Limit Too Restrictive

**Symptoms:**
- Legitimate requests blocked
- 429 errors in production

**Solutions:**
1. Adjust RATELIMIT_DEFAULT in settings
2. Add IP to RATELIMIT_WHITELIST
3. Configure per-endpoint overrides
4. Check Redis cache is working

```python
# Test rate limit status
from django.core.cache import cache
cache.get('ratelimit:127.0.0.1')
```

#### Tenant Not Resolving

**Symptoms:**
- 404 errors for valid tenants
- Database routing failures

**Solutions:**
1. Check Domain model entries
2. Verify TenantMainMiddleware is early in stack
3. Check tenant database connection settings
4. Review tenant resolution logs

#### Security Headers Not Appearing

**Symptoms:**
- Missing security headers in response
- Security scan failures

**Solutions:**
1. Verify SecurityHeadersMiddleware is in MIDDLEWARE
2. Check middleware is not returning early
3. Review SECURITY_HEADERS configuration
4. Test with curl or browser dev tools

```bash
# Check response headers
curl -I https://example.com
```

### Debug Mode

Enable detailed middleware logging:

```python
# settings/development.py
LOGGING['loggers']['apps.core.middleware'] = {
    'handlers': ['console'],
    'level': 'DEBUG',
}
```

### Performance Issues

If middleware is causing slowdowns:

1. **Profile middleware timing:**
```python
# Add timing to middleware
import time

class YourMiddleware:
    def __call__(self, request):
        start = time.time()
        response = self.get_response(request)
        duration = time.time() - start
        logger.debug(f"Middleware duration: {duration}ms")
        return response
```

2. **Check cache backend:**
```bash
# Test Redis connection
redis-cli ping
```

3. **Review logging level:**
- Set to WARNING in production
- Use DEBUG only for troubleshooting

---

## Performance

### Middleware Performance Impact

| Middleware | Impact | Notes |
|-----------|--------|-------|
| SecurityMiddleware | Minimal | Headers only |
| CorsMiddleware | Minimal | Headers only |
| TenantMainMiddleware | Low | Single DB query |
| SecurityHeadersMiddleware | Minimal | Headers only |
| RateLimitMiddleware | Low | Cache lookup |
| SessionMiddleware | Low | Cache/DB lookup |
| AuthenticationMiddleware | Low | Session-based |
| RequestLoggingMiddleware | Low-Medium | Logging I/O |
| TimezoneMiddleware | Minimal | In-memory operation |

### Optimization Tips

1. **Use Redis for caching:**
```python
CACHES = {
    'default': {
        'BACKEND': 'django_redis.cache.RedisCache',
        'LOCATION': 'redis://127.0.0.1:6379/1',
    }
}
```

2. **Minimize logging in production:**
```python
REQUEST_LOGGING_EXCLUDE_PATHS = [
    '/health/',
    '/metrics/',
    '/static/',
    '/media/',
]
```

3. **Use persistent connections:**
```python
DATABASES = {
    'default': {
        'CONN_MAX_AGE': 600,  # 10 minutes
    }
}
```

---

## Additional Resources

- Django Middleware Documentation: https://docs.djangoproject.com/en/stable/topics/http/middleware/
- django-tenants: https://django-tenants.readthedocs.io/
- OWASP Security Headers: https://owasp.org/www-project-secure-headers/
- Python zoneinfo: https://docs.python.org/3/library/zoneinfo.html

---

## Changelog

### Version 1.0 (2026-01-23)
- Initial middleware stack implementation
- All core middleware components complete
- Documentation created
- Test suite complete

---

*End of Middleware Documentation*
```

### Expected Outcome
- Comprehensive middleware.md documentation file created
- All middleware components documented
- Configuration examples provided
- Troubleshooting section complete

### Verification Checklist
- [ ] middleware.md file created in `apps/core/docs/`
- [ ] All middleware components documented
- [ ] Middleware stack order documented
- [ ] Configuration examples included
- [ ] Usage examples provided
- [ ] Troubleshooting section complete
- [ ] Performance considerations documented
- [ ] Testing instructions included

---

## Task 87: Create Middleware README

### Overview
Create a user-friendly README.md file in the middleware directory to help developers quickly understand and use the middleware components.

### Dependencies
- Task 86: Complete middleware documentation

### Instructions

1. **Create README.md file**
   - Location: `backend/apps/core/middleware/README.md`
   - User-friendly format

2. **Include quick start guide**
   - How to use middleware
   - Common examples
   - Quick reference

3. **Link to full documentation**
   - Reference middleware.md
   - External resources

4. **Add visual elements**
   - Diagrams or flowcharts (if possible)
   - Code examples
   - Configuration snippets

### README Content

```markdown
# Core Middleware

Custom middleware components for the ERP/POS system providing multi-tenant support, security, rate limiting, logging, and timezone management.

## Quick Start

All middleware is automatically loaded via Django settings. No manual configuration required for basic usage.

```python
# settings/base.py - Already configured
MIDDLEWARE = [
    # ... Django middleware ...
    'apps.core.middleware.security.SecurityHeadersMiddleware',
    'apps.core.middleware.ratelimit.RateLimitMiddleware',
    'apps.core.middleware.logging.RequestLoggingMiddleware',
    'apps.core.middleware.timezone.TimezoneMiddleware',
]
```

## Components

### 🏢 TenantMiddleware
Resolves tenant from request domain for multi-tenant architecture.

**Provides:** `request.tenant`

```python
def my_view(request):
    tenant = request.tenant
    # Tenant is automatically resolved from domain
```

### 🔒 SecurityHeadersMiddleware
Adds security headers to all responses (CSP, XSS protection, etc.).

**No configuration needed** - Secure defaults applied automatically.

### ⏱️ RateLimitMiddleware
Rate limiting to prevent API abuse.

**Configure limits:**
```python
RATELIMIT_DEFAULT = '100/hour'
RATELIMIT_BY_USER = '200/hour'
```

### 📝 RequestLoggingMiddleware
Logs all HTTP requests with user and tenant context.

**View logs:**
```bash
tail -f logs/requests.log
```

### 🌍 TimezoneMiddleware
Activates timezone per request based on user/tenant settings.

**Priority:** User → Tenant → Default (Asia/Colombo)

```python
# In views, timezone is already active
from django.utils import timezone
now = timezone.now()  # Returns timezone-aware datetime
```

## Middleware Stack Order

```
SecurityMiddleware          ← SSL/HSTS
CorsMiddleware              ← CORS headers
TenantMainMiddleware        ← Tenant resolution
SecurityHeadersMiddleware   ← Custom security headers
RateLimitMiddleware         ← Rate limiting
SessionMiddleware           ← Session handling
AuthenticationMiddleware    ← User authentication
RequestLoggingMiddleware    ← Request logging
TimezoneMiddleware          ← Timezone activation
MessageMiddleware           ← Flash messages
```

**Order matters!** See [full documentation](../docs/middleware.md#middleware-stack) for rationale.

## Usage Examples

### Accessing Tenant

```python
def tenant_specific_view(request):
    tenant = request.tenant
    products = Product.objects.filter(tenant=tenant)
    return JsonResponse({'products': list(products.values())})
```

### Using Timezone

```python
from django.utils import timezone

def datetime_view(request):
    # Timezone already activated by middleware
    now = timezone.now()
    
    # Format for user's timezone
    user_time = now.strftime('%Y-%m-%d %H:%M:%S %Z')
    
    return JsonResponse({'time': user_time})
```

### Rate Limiting

```python
# Automatic rate limiting on all endpoints
# Returns 429 Too Many Requests when limit exceeded

# Check rate limit headers in response:
# X-RateLimit-Limit: 100
# X-RateLimit-Remaining: 95
# X-RateLimit-Reset: 1234567890
```

## Configuration

### Development

```python
# settings/development.py

# More verbose logging
LOGGING['loggers']['apps.core.middleware']['level'] = 'DEBUG'

# Higher rate limits
RATELIMIT_DEFAULT = '10000/hour'
```

### Production

```python
# settings/production.py

# Strict rate limits
RATELIMIT_DEFAULT = '1000/hour'
RATELIMIT_BY_USER = '2000/hour'

# Enable all security features
SECURE_SSL_REDIRECT = True
SECURE_HSTS_SECONDS = 31536000
```

## Testing

```bash
# Run all middleware tests
python manage.py test apps.core.tests

# Run specific middleware tests
python manage.py test apps.core.tests.test_timezone_middleware

# With coverage
coverage run --source='apps.core.middleware' manage.py test
coverage report
```

## Troubleshooting

### Issue: Timezone not activating
**Solution:** Check middleware order - TimezoneMiddleware must be after AuthenticationMiddleware

### Issue: Rate limit too restrictive
**Solution:** Adjust `RATELIMIT_DEFAULT` in settings or add IP to whitelist

### Issue: Tenant not found
**Solution:** Check Domain model entries for the requested domain

See [full documentation](../docs/middleware.md#troubleshooting) for more.

## Documentation

- **Full Documentation:** [middleware.md](../docs/middleware.md)
- **Django Middleware:** https://docs.djangoproject.com/en/stable/topics/http/middleware/
- **django-tenants:** https://django-tenants.readthedocs.io/

## File Structure

```
apps/core/middleware/
├── __init__.py          # Exports all middleware
├── base.py              # Base middleware class
├── tenant.py            # Tenant resolution
├── security.py          # Security headers
├── ratelimit.py         # Rate limiting
├── logging.py           # Request logging
├── timezone.py          # Timezone activation
├── utils.py             # Utility functions
└── README.md            # This file
```

## Support

For issues or questions:
1. Check [full documentation](../docs/middleware.md)
2. Review test files for usage examples
3. Check logs for error messages

---

**Version:** 1.0  
**Last Updated:** 2026-01-23  
**SubPhase:** 06 - Core Middleware Stack
```

### Expected Outcome
- User-friendly README.md created
- Quick start guide available
- Common use cases documented
- Links to full documentation

### Verification Checklist
- [ ] README.md created in middleware directory
- [ ] Quick start section included
- [ ] All middleware components listed
- [ ] Usage examples provided
- [ ] Configuration examples included
- [ ] Troubleshooting tips added
- [ ] Links to full documentation
- [ ] File structure documented

---

## Task 88: Verify Server Starts

### Overview
Verify that the Django development server starts successfully with the complete middleware stack and all configurations.

### Dependencies
- Task 86: Documentation complete
- Task 87: README complete
- All middleware implemented and tested

### Instructions

1. **Start the development server**
   - Run Django development server
   - Check for startup errors
   - Verify all middleware loads

2. **Test basic endpoints**
   - Access home page
   - Test API endpoints
   - Verify responses

3. **Check middleware execution**
   - Verify security headers present
   - Check logging output
   - Confirm timezone activation

4. **Review startup logs**
   - No error messages
   - All middleware initialized
   - Configuration loaded

### Verification Steps

#### 1. Start Development Server

```bash
# Navigate to backend directory
cd backend

# Activate virtual environment
source venv/bin/activate  # Linux/Mac
# or
venv\Scripts\activate  # Windows

# Start server
python manage.py runserver

# Expected output:
# Watching for file changes with StatReloader
# Performing system checks...
#
# System check identified no issues (0 silenced).
# January 23, 2026 - 10:30:00
# Django version 4.2.x, using settings 'settings.development'
# Starting development server at http://127.0.0.1:8000/
# Quit the server with CONTROL-C.
```

#### 2. Check for Middleware Initialization

Look for middleware initialization logs:

```
[INFO] TenantMiddleware initialized
[INFO] SecurityHeadersMiddleware initialized
[INFO] RateLimitMiddleware initialized with default limit: 100/hour
[INFO] RequestLoggingMiddleware initialized
[INFO] TimezoneMiddleware initialized with default timezone: Asia/Colombo
```

#### 3. Test Basic Requests

```bash
# Test home page
curl http://127.0.0.1:8000/

# Test with headers
curl -I http://127.0.0.1:8000/

# Expected headers:
# HTTP/1.1 200 OK
# X-Content-Type-Options: nosniff
# X-Frame-Options: DENY
# X-RateLimit-Limit: 100
# X-RateLimit-Remaining: 99
# ... other headers ...
```

#### 4. Test API Endpoint

```bash
# Test API endpoint
curl http://127.0.0.1:8000/api/health/

# Expected response:
# {"status": "ok", "timestamp": "2026-01-23T10:30:00+05:30"}
# Note the timezone offset: +05:30 (Asia/Colombo)
```

#### 5. Test Multi-Tenant Request

```bash
# Test with tenant domain (if DNS configured)
curl -H "Host: tenant1.example.com" http://127.0.0.1:8000/

# Or test tenant resolution in Django shell
python manage.py shell
>>> from django.test import RequestFactory
>>> from apps.core.middleware.tenant import TenantMiddleware
>>> factory = RequestFactory()
>>> request = factory.get('/', HTTP_HOST='tenant1.example.com')
>>> # Test tenant resolution
```

#### 6. Check Logs

```bash
# View request logs
tail -f logs/requests.log

# Expected log entries:
# [2026-01-23 10:30:45] INFO: GET / | User: Anonymous | Status: 200 | Duration: 45ms
```

#### 7. Test Timezone Activation

```python
# In Django shell
python manage.py shell

from django.test import RequestFactory
from django.contrib.auth import get_user_model
from apps.core.middleware.timezone import TimezoneMiddleware
from django.utils import timezone

User = get_user_model()

# Create test request
factory = RequestFactory()
request = factory.get('/')

# Create test user with timezone
user = User.objects.create_user(
    username='testuser',
    email='test@example.com'
)
user.timezone = 'America/New_York'
user.save()

request.user = user

# Create middleware and process
get_response = lambda r: type('Response', (), {'status_code': 200})()
middleware = TimezoneMiddleware(get_response)

# Process request
response = middleware(request)

# Check if timezone was activated (during request processing)
print("Middleware executed successfully")
```

### Verification Checklist

#### Startup Checks
- [ ] Server starts without errors
- [ ] No middleware import errors
- [ ] All middleware initialized
- [ ] No configuration errors
- [ ] Database connections successful
- [ ] Cache backend connected

#### Middleware Checks
- [ ] SecurityHeadersMiddleware adds headers
- [ ] RateLimitMiddleware tracks requests
- [ ] RequestLoggingMiddleware logs requests
- [ ] TimezoneMiddleware activates timezone
- [ ] TenantMiddleware resolves tenant (if configured)

#### Response Checks
- [ ] Responses return successfully
- [ ] Security headers present
- [ ] Rate limit headers present
- [ ] Timezone in responses correct
- [ ] Logging captures requests

#### Error Handling Checks
- [ ] Invalid URLs return 404
- [ ] Rate limit returns 429 (when exceeded)
- [ ] Invalid tenant returns 404
- [ ] Errors logged appropriately

### Common Startup Issues

#### Issue: ImportError for middleware

**Error:**
```
ImportError: cannot import name 'TimezoneMiddleware' from 'apps.core.middleware.timezone'
```

**Solution:**
1. Check file exists at correct path
2. Verify class name is correct
3. Check __init__.py exports middleware
4. Restart server

#### Issue: Middleware not in MIDDLEWARE list

**Error:**
```
AttributeError: 'WSGIRequest' object has no attribute 'tenant'
```

**Solution:**
1. Verify middleware is in MIDDLEWARE setting
2. Check middleware order
3. Restart server

#### Issue: Database connection error

**Error:**
```
django.db.utils.OperationalError: could not connect to server
```

**Solution:**
1. Check database is running
2. Verify database settings
3. Run migrations if needed

#### Issue: Cache backend not available

**Error:**
```
ConnectionError: Error connecting to Redis
```

**Solution:**
1. Start Redis server
2. Check CACHES configuration
3. Verify Redis is accessible

### Success Criteria

Server startup is successful when:

1. ✅ Server starts on http://127.0.0.1:8000/
2. ✅ No error messages in console
3. ✅ All middleware initialized
4. ✅ Test requests return 200 OK
5. ✅ Security headers present in responses
6. ✅ Rate limit headers present
7. ✅ Requests logged to file
8. ✅ Timezone activated correctly
9. ✅ No warnings in startup logs
10. ✅ All tests passing

### Post-Verification Steps

1. **Commit changes**
   ```bash
   git add .
   git commit -m "Complete SubPhase-06: Core Middleware Stack"
   ```

2. **Update documentation**
   - Mark SubPhase-06 as complete
   - Update project status

3. **Prepare for next subphase**
   - Review SubPhase-07: Exception Handling
   - Plan next implementation steps

### Expected Outcome
- Development server starts successfully
- All middleware functioning correctly
- No startup errors or warnings
- System ready for SubPhase-07

### Verification Checklist
- [ ] Server starts without errors
- [ ] All middleware initialized
- [ ] Test requests successful
- [ ] Security headers present
- [ ] Rate limit headers present
- [ ] Logging working
- [ ] Timezone activation confirmed
- [ ] No error logs
- [ ] All tests passing
- [ ] Ready for next subphase

---

## SubPhase-06 Completion

### Achievements

✅ **Group A:** Middleware infrastructure
✅ **Group B:** Tenant middleware
✅ **Group C:** Logging middleware
✅ **Group D:** Security headers middleware
✅ **Group E:** Rate limiting middleware
✅ **Group F:** Timezone middleware & stack finalization

### Deliverables

- ✅ Complete middleware stack implemented
- ✅ All middleware tested and verified
- ✅ Comprehensive documentation created
- ✅ User-friendly README provided
- ✅ Server startup verified

### Next Steps

Proceed to **SubPhase-07: Exception Handling**

**Navigation:** [../../SubPhase-07_Exception-Handling/](../../SubPhase-07_Exception-Handling/)

---

## Notes for AI Agents

1. **Documentation Quality:** Ensure documentation is comprehensive and accurate
2. **Code Examples:** Provide working, tested examples
3. **Troubleshooting:** Include common issues and solutions
4. **Configuration:** Document all configuration options
5. **Testing:** Verify everything works before marking complete
6. **Links:** Ensure all documentation links are valid
7. **Format:** Use consistent Markdown formatting
8. **Version:** Keep documentation version in sync with code
9. **Updates:** Update documentation when code changes
10. **Completion:** This is the FINAL document in SubPhase-06

