# Tasks 59-61: Rate Limit Setup

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 06 - Core Middleware Stack  
> **Group:** E - Rate Limiting Middleware  
> **Document:** 01 of 04  
> **Tasks Covered:** 59, 60, 61

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Group:** [../Group-D_Security-Headers-Middleware/](../Group-D_Security-Headers-Middleware/)
- **→ Next Document:** [02_Tasks-62-65_Rate-Limit-Strategies.md](02_Tasks-62-65_Rate-Limit-Strategies.md)

---

## Document Overview

This document covers the initial setup of the RateLimitMiddleware, including creating the middleware file, defining the main middleware class, and configuring Redis as the backend storage for rate limit counters.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 59 | Create RateLimitMiddleware File | Simple |
| 60 | Create RateLimitMiddleware Class | Simple |
| 61 | Configure Redis Backend | Medium |

---

## Task 59: Create RateLimitMiddleware File

### Overview
Create the ratelimit.py file in the middleware directory to house all rate limiting functionality.

### Dependencies
- SubPhase-06: Core Middleware Stack initialized
- Group-A: Middleware infrastructure exists

### Instructions

1. **Navigate to middleware directory**
   - Location: `backend/apps/core/middleware/`
   - Verify directory exists from Group-A setup

2. **Create ratelimit.py file**
   - Create new file: `ratelimit.py`
   - Add file docstring explaining purpose

3. **Add initial imports**
   - Import `time` for timestamp handling
   - Import Django settings
   - Import Django cache framework
   - Import JsonResponse for 429 responses
   - Prepare for utility imports (next tasks)

4. **Add file header comments**
   - Document rate limiting strategy
   - Note Redis requirement
   - List supported rate limit types

### File Structure

```python
# File: backend/apps/core/middleware/ratelimit.py
"""
Rate Limiting Middleware

This middleware implements rate limiting for API requests using Redis as the
backend storage. It supports multiple rate limiting strategies:

- IP-based: Limit requests per client IP address
- User-based: Limit requests per authenticated user
- Tenant-based: Aggregate limit per tenant
- Endpoint-based: Custom limits for specific endpoints

The middleware uses a sliding window algorithm for accurate rate limiting and
includes proper rate limit headers in all responses.

Requirements:
- Redis must be configured and running
- django-redis must be installed
- RATELIMIT_CONFIG settings must be defined

Headers Added:
- X-RateLimit-Limit: Maximum requests allowed in window
- X-RateLimit-Remaining: Requests remaining in current window
- X-RateLimit-Reset: Unix timestamp when limit resets
- Retry-After: Seconds to wait before retry (on 429 response)
"""

import time
from django.conf import settings
from django.core.cache import cache
from django.http import JsonResponse
```

### Import Organization
| Section | Imports | Purpose |
|---------|---------|---------|
| **Standard Library** | time | Timestamp calculations |
| **Django Core** | settings, cache | Configuration and Redis access |
| **Django HTTP** | JsonResponse | 429 response formatting |
| **Future Additions** | get_client_ip | Utility for IP extraction |

### File Purpose
| Aspect | Details |
|--------|---------|
| **Primary Function** | Limit API request rates |
| **Storage Backend** | Redis (via Django cache) |
| **Algorithm** | Sliding window counter |
| **Response Code** | 429 Too Many Requests |
| **Header Standard** | X-RateLimit-* headers |

### Expected Outcome
- ratelimit.py file created
- File docstring documents all features
- Initial imports added
- File ready for class definition

### Verification Checklist
- [ ] File `ratelimit.py` exists in middleware directory
- [ ] File docstring explains rate limiting strategies
- [ ] Standard library imports (time) included
- [ ] Django imports (settings, cache, JsonResponse) included
- [ ] File header lists supported rate limit types
- [ ] Documentation mentions Redis requirement

---

## Task 60: Create RateLimitMiddleware Class

### Overview
Define the RateLimitMiddleware class with the standard Django middleware structure and default rate limit configuration.

### Dependencies
- Task 59: Create RateLimitMiddleware File

### Instructions

1. **Define RateLimitMiddleware class**
   - Create class `RateLimitMiddleware`
   - Add comprehensive class docstring
   - Document rate limit strategy

2. **Add class-level configuration constants**
   - Define default limits for anonymous users
   - Define default limits for authenticated users
   - Define default limits per tenant
   - Define default time window (60 seconds)
   - Set up whitelist from settings

3. **Implement __init__ method**
   - Accept `get_response` callable parameter
   - Store as instance attribute
   - Standard Django middleware pattern

4. **Add __call__ method stub**
   - Accept `request` parameter
   - Add placeholder for rate limiting logic
   - Return `self.get_response(request)` for now
   - Will be implemented in subsequent tasks

5. **Add method stubs**
   - Add empty methods for future implementation
   - Comment each method's purpose
   - Maintain logical organization

### Class Definition Structure

```python
class RateLimitMiddleware:
    """
    Rate limiting middleware using Redis backend.
    
    This middleware implements rate limiting using a sliding window algorithm
    with Redis sorted sets for distributed counting. It supports multiple
    strategies for determining rate limits:
    
    - Anonymous users (by IP): Lower default limit
    - Authenticated users (by user ID): Higher default limit
    - Per-tenant limits: Aggregate tenant-wide limits
    - Per-endpoint limits: Custom limits for specific routes
    
    Rate limit information is included in response headers:
    - X-RateLimit-Limit: Maximum requests in window
    - X-RateLimit-Remaining: Requests remaining
    - X-RateLimit-Reset: Unix timestamp of window reset
    
    When rate limit is exceeded:
    - Returns 429 Too Many Requests
    - Includes Retry-After header
    - Returns JSON error response
    
    Configuration (via settings.RATELIMIT_CONFIG):
    - ANONYMOUS_LIMIT: Requests per minute for anonymous users (default: 100)
    - USER_LIMIT: Requests per minute for authenticated users (default: 1000)
    - TENANT_LIMIT: Requests per minute per tenant (default: 10000)
    - WINDOW: Time window in seconds (default: 60)
    - WHITELISTED_IPS: List of IPs to bypass rate limiting
    - ENDPOINT_LIMITS: Dict mapping endpoints to custom limits
    """
    
    # Default rate limits (requests per window)
    ANON_LIMIT = getattr(settings, 'RATELIMIT_ANONYMOUS_LIMIT', 100)
    USER_LIMIT = getattr(settings, 'RATELIMIT_USER_LIMIT', 1000)
    TENANT_LIMIT = getattr(settings, 'RATELIMIT_TENANT_LIMIT', 10000)
    WINDOW = getattr(settings, 'RATELIMIT_WINDOW', 60)  # seconds
    
    # Whitelist configuration
    WHITELISTED_IPS = getattr(settings, 'RATELIMIT_WHITELISTED_IPS', [])
    
    # Endpoint-specific limits
    ENDPOINT_LIMITS = getattr(settings, 'RATELIMIT_ENDPOINT_LIMITS', {})
    
    def __init__(self, get_response):
        """
        Initialize the middleware.
        
        Args:
            get_response: The next middleware or view in the chain
        """
        self.get_response = get_response
    
    def __call__(self, request):
        """
        Process the request and apply rate limiting.
        
        Args:
            request: The HTTP request object
            
        Returns:
            HTTP response (429 if rate limited, otherwise normal response)
        """
        # Rate limiting logic will be implemented in subsequent tasks
        # For now, just pass through
        response = self.get_response(request)
        return response
    
    def _get_rate_limit_key(self, request, client_ip):
        """
        Determine the rate limit key and limit for the request.
        
        Args:
            request: The HTTP request object
            client_ip: The client IP address
            
        Returns:
            tuple: (rate_limit_key, limit)
        """
        # To be implemented in Task 62-65
        pass
    
    def _check_rate_limit(self, key, limit, window):
        """
        Check and update the rate limit counter using Redis.
        
        Args:
            key: The rate limit key
            limit: Maximum requests allowed
            window: Time window in seconds
            
        Returns:
            tuple: (current_count, remaining, reset_time)
        """
        # To be implemented in Task 66
        pass
    
    def _add_rate_limit_headers(self, response, limit, remaining, reset_time):
        """
        Add rate limit headers to the response.
        
        Args:
            response: The HTTP response object
            limit: Maximum requests allowed
            remaining: Requests remaining
            reset_time: Unix timestamp of window reset
        """
        # To be implemented in Task 67-69
        pass
    
    def _get_429_response(self, retry_after):
        """
        Create a 429 Too Many Requests response.
        
        Args:
            retry_after: Seconds until retry allowed
            
        Returns:
            JsonResponse with 429 status
        """
        # To be implemented in Task 71
        pass
    
    def _is_whitelisted(self, ip):
        """
        Check if an IP address is whitelisted.
        
        Args:
            ip: The IP address to check
            
        Returns:
            bool: True if whitelisted, False otherwise
        """
        # To be implemented in Task 72
        pass
```

### Class Configuration
| Setting | Default | Purpose |
|---------|---------|---------|
| **ANON_LIMIT** | 100 | Requests per minute for anonymous users |
| **USER_LIMIT** | 1000 | Requests per minute for authenticated users |
| **TENANT_LIMIT** | 10000 | Requests per minute per tenant |
| **WINDOW** | 60 | Time window in seconds |
| **WHITELISTED_IPS** | [] | IPs that bypass rate limiting |
| **ENDPOINT_LIMITS** | {} | Custom limits per endpoint |

### Middleware Lifecycle
| Method | Phase | Purpose |
|--------|-------|---------|
| **__init__** | Startup | Initialize middleware instance |
| **__call__** | Request | Process each incoming request |
| **get_response** | Processing | Call next middleware/view |

### Expected Outcome
- RateLimitMiddleware class defined
- Class docstring documents all features
- Configuration constants defined
- Standard middleware methods implemented
- Helper method stubs added

### Verification Checklist
- [ ] `class RateLimitMiddleware:` is defined
- [ ] Class docstring explains rate limiting strategies
- [ ] All configuration constants defined (ANON_LIMIT, USER_LIMIT, etc.)
- [ ] `__init__` method accepts and stores get_response
- [ ] `__call__` method accepts request parameter
- [ ] All helper method stubs added with docstrings
- [ ] Settings are read with getattr() for safe defaults

---

## Task 61: Configure Redis Backend

### Overview
Set up Redis integration for storing rate limit counters using Django's cache framework and implement the sliding window algorithm.

### Dependencies
- Task 60: Create RateLimitMiddleware Class
- Redis installed and running
- django-redis configured in settings

### Instructions

1. **Verify Redis configuration**
   - Ensure Redis is configured in settings.CACHES
   - Verify django-redis backend is installed
   - Check Redis connection is available

2. **Implement sliding window counter**
   - Use Redis sorted sets (ZSET) for accurate counting
   - Store timestamps as scores
   - Remove expired entries before counting
   - Add current request timestamp

3. **Implement _check_rate_limit method**
   - Calculate window start time
   - Use Redis pipeline for atomic operations
   - Remove old entries outside window
   - Count current requests
   - Add new request timestamp
   - Set expiration on key
   - Return count, remaining, and reset time

4. **Add Redis pipeline operations**
   - ZREMRANGEBYSCORE: Remove old entries
   - ZCARD: Count entries in window
   - ZADD: Add current request
   - EXPIRE: Set key expiration

5. **Handle Redis errors**
   - Add try-except for Redis connection errors
   - Fall back to allowing request on error
   - Log Redis errors for monitoring

### Sliding Window Implementation

```python
def _check_rate_limit(self, key, limit, window):
    """
    Check and update the rate limit counter using Redis sliding window.
    
    Uses Redis sorted sets to implement a sliding window rate limiter:
    1. Remove entries older than the window
    2. Count remaining entries
    3. Add current request timestamp
    4. Calculate remaining requests
    
    Args:
        key: The rate limit key (e.g., 'ratelimit:user:123')
        limit: Maximum requests allowed in window
        window: Time window in seconds
        
    Returns:
        tuple: (current_count, remaining, reset_time)
        
    Raises:
        Returns (0, limit, now+window) on Redis errors (fail open)
    """
    try:
        now = time.time()
        window_start = now - window
        
        # Get Redis client and create pipeline for atomic operations
        pipeline = cache.client.get_client().pipeline()
        
        # 1. Remove entries older than the current window
        pipeline.zremrangebyscore(key, 0, window_start)
        
        # 2. Count current requests in window
        pipeline.zcard(key)
        
        # 3. Add current request with timestamp as score
        pipeline.zadd(key, {str(now): now})
        
        # 4. Set expiration to window + buffer
        pipeline.expire(key, int(window) + 10)
        
        # Execute all commands atomically
        results = pipeline.execute()
        
        # Extract results
        current_count = results[1]  # ZCARD result
        remaining = max(0, limit - current_count - 1)
        reset_time = now + window
        
        return current_count, remaining, reset_time
        
    except Exception as e:
        # Log error but fail open (allow request)
        # In production, log to monitoring system
        import logging
        logger = logging.getLogger(__name__)
        logger.error(f"Redis error in rate limiting: {e}")
        
        # Return safe defaults that allow the request
        now = time.time()
        return 0, limit, now + window
```

### Redis Pipeline Operations
| Operation | Command | Purpose |
|-----------|---------|---------|
| **1. Remove Old** | ZREMRANGEBYSCORE | Remove entries outside window |
| **2. Count** | ZCARD | Count current requests in window |
| **3. Add New** | ZADD | Add current request timestamp |
| **4. Expire** | EXPIRE | Set key expiration |

### Sliding Window Diagram
```
Time Window (60 seconds)
├─────────────────────────────────────────────┤
                                              NOW
Request timestamps stored as sorted set scores:
│  │    │  │ │     │   │ │││  │    │  │ │    │
▼  ▼    ▼  ▼ ▼     ▼   ▼ ▼▼▼  ▼    ▼  ▼ ▼    ▼
59 58   55 54 53   50  48 47    43  40 38 37  35

Older than 60s ago are removed (ZREMRANGEBYSCORE)
Remaining entries are counted (ZCARD)
New request added with current timestamp (ZADD)
```

### Redis Key Format
| Rate Limit Type | Key Format | Example |
|----------------|------------|---------|
| **IP-based** | `ratelimit:ip:{ip}` | `ratelimit:ip:192.168.1.100` |
| **User-based** | `ratelimit:user:{id}` | `ratelimit:user:42` |
| **Tenant-based** | `ratelimit:tenant:{id}` | `ratelimit:tenant:123` |
| **Endpoint-based** | `ratelimit:endpoint:{path}:{ip}` | `ratelimit:endpoint:/api/login/:192.168.1.100` |

### Error Handling Strategy
| Scenario | Behavior | Reason |
|----------|----------|--------|
| **Redis Down** | Allow request | Fail open for availability |
| **Redis Error** | Allow request | Don't block on infrastructure issues |
| **Key Error** | Allow request | Graceful degradation |
| **Pipeline Error** | Allow request | System stability priority |

### Settings Configuration

Add to `settings/base.py` or create `settings/ratelimit.py`:

```python
# Redis configuration for rate limiting
CACHES = {
    'default': {
        'BACKEND': 'django_redis.cache.RedisCache',
        'LOCATION': 'redis://127.0.0.1:6379/1',
        'OPTIONS': {
            'CLIENT_CLASS': 'django_redis.client.DefaultClient',
            'CONNECTION_POOL_KWARGS': {
                'max_connections': 50,
                'retry_on_timeout': True,
            },
            'SOCKET_CONNECT_TIMEOUT': 5,
            'SOCKET_TIMEOUT': 5,
        }
    }
}

# Rate limiting configuration
RATELIMIT_ANONYMOUS_LIMIT = 100    # requests per minute
RATELIMIT_USER_LIMIT = 1000        # requests per minute
RATELIMIT_TENANT_LIMIT = 10000     # requests per minute
RATELIMIT_WINDOW = 60               # seconds
RATELIMIT_WHITELISTED_IPS = [
    '127.0.0.1',
    '::1',
]
RATELIMIT_ENDPOINT_LIMITS = {
    '/api/v1/auth/login/': 10,      # Stricter limit for auth endpoints
    '/api/v1/auth/register/': 5,
    '/api/v1/auth/password-reset/': 3,
}
```

### Expected Outcome
- Redis backend configured and tested
- Sliding window algorithm implemented
- Rate limit checking functional
- Error handling in place
- Configuration settings documented

### Verification Checklist
- [ ] `_check_rate_limit` method fully implemented
- [ ] Redis pipeline operations are atomic
- [ ] Sliding window logic is correct
- [ ] Old entries are removed before counting
- [ ] Current request is added to sorted set
- [ ] Key expiration is set properly
- [ ] Error handling returns safe defaults
- [ ] Settings configuration is documented
- [ ] Redis connection is tested

---

## Group E Next Steps

After completing Tasks 59-61, proceed to:
- **Next Document:** [02_Tasks-62-65_Rate-Limit-Strategies.md](02_Tasks-62-65_Rate-Limit-Strategies.md)
- Implement IP-based rate limiting
- Implement user-based rate limiting
- Implement tenant-based rate limiting
- Implement endpoint-based rate limiting

---

## Notes for AI Agents

1. **Redis Required:** Rate limiting requires Redis - verify it's running
2. **Atomic Operations:** Use pipeline for atomic Redis operations
3. **Sorted Sets:** ZSET is perfect for sliding windows
4. **Fail Open:** On errors, allow requests (don't block traffic)
5. **Key Expiration:** Set expiration to prevent memory leaks
6. **Timestamp Precision:** Use time.time() for Unix timestamps
7. **Pipeline Results:** Results array matches command order
8. **Connection Pooling:** Configure max_connections appropriately
9. **Error Logging:** Log Redis errors for monitoring
10. **Settings Safety:** Use getattr() with defaults for settings
