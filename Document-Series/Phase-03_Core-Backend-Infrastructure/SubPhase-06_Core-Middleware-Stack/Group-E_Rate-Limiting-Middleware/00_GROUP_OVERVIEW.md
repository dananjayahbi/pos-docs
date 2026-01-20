# Group E: Rate Limiting Middleware

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 06 - Core Middleware Stack  
> **Group:** E of F  
> **Tasks Covered:** 59-74  
> **Group Goal:** Implement rate limiting with Redis backend and multiple limiting strategies

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-D_Security-Headers-Middleware](../Group-D_Security-Headers-Middleware/)
- **→ Next Group:** [Group-F_Timezone-Configuration](../Group-F_Timezone-Configuration/)

---

## Group Overview

This group creates the RateLimitMiddleware that limits API request rates using Redis as the backend. It supports multiple rate limiting strategies: per IP, per user, per tenant, and per endpoint.

### Key Components
- **RateLimitMiddleware:** Main rate limiting middleware
- **Redis Backend:** Fast counter storage
- **Rate Limit Strategies:** IP, user, tenant, endpoint
- **Sliding Window:** Accurate rate limiting
- **Response Headers:** Rate limit information

### Rate Limit Headers
| Header | Description |
|--------|-------------|
| X-RateLimit-Limit | Maximum requests allowed |
| X-RateLimit-Remaining | Requests remaining in window |
| X-RateLimit-Reset | Time when limit resets (Unix timestamp) |
| Retry-After | Seconds until retry allowed (on 429) |

### Default Limits
| Strategy | Limit | Window |
|----------|-------|--------|
| Anonymous IP | 100 | 1 minute |
| Authenticated User | 1000 | 1 minute |
| Tenant | 10000 | 1 minute |
| Per Endpoint | Configurable | Configurable |

---

## Documents in This Group

| Document # | Document Name | Tasks Covered | Description |
|------------|---------------|---------------|-------------|
| DOC-01 | Rate Limit Setup | Tasks 59-61 | Middleware class and Redis |
| DOC-02 | Rate Limit Strategies | Tasks 62-65 | IP, user, tenant, endpoint |
| DOC-03 | Window & Headers | Tasks 66-70 | Sliding window and headers |
| DOC-04 | Response & Testing | Tasks 71-74 | 429 response and tests |

---

## Task Summary

| Task # | Task Name | Key Points |
|--------|-----------|------------|
| 59 | Create RateLimitMiddleware File | ratelimit.py |
| 60 | Create RateLimitMiddleware Class | Main class |
| 61 | Configure Redis Backend | Redis for counting |
| 62 | Add IP-Based Rate Limit | Per client IP |
| 63 | Add User-Based Rate Limit | Per authenticated user |
| 64 | Add Tenant-Based Rate Limit | Per tenant |
| 65 | Add Endpoint-Based Rate Limit | Per endpoint |
| 66 | Configure Rate Limit Windows | Sliding window |
| 67 | Add X-RateLimit-Limit Header | Max requests |
| 68 | Add X-RateLimit-Remaining Header | Remaining requests |
| 69 | Add X-RateLimit-Reset Header | Reset time |
| 70 | Add Retry-After Header | When exceeded |
| 71 | Return 429 Response | Too many requests |
| 72 | Add Whitelist | Bypass for IPs |
| 73 | Register in MIDDLEWARE | Add to settings |
| 74 | Test Rate Limiting | Rate limit tests |

---

## Execution Order

```
[Tasks 59-61: Setup & Redis]
        │
        ▼
[Tasks 62-65: Rate Limit Strategies]
        │
        ▼
[Tasks 66-70: Window & Headers]
        │
        ▼
[Tasks 71-74: Response & Tests]
```

---

## Expected Deliverables

### Code Files
```
backend/apps/core/
├── middleware/
│   └── ratelimit.py
│       └── class RateLimitMiddleware:
│           ├── __init__(get_response)
│           ├── __call__(request)
│           ├── _get_rate_limit_key(request)
│           ├── _check_rate_limit(key, limit, window)
│           ├── _add_rate_limit_headers(response, limit, remaining, reset)
│           ├── _get_429_response(retry_after)
│           └── _is_whitelisted(ip)
└── tests/
    └── test_ratelimit_middleware.py
```

### Rate Limit Middleware
```python
import time
from django.conf import settings
from django.core.cache import cache
from django.http import JsonResponse
from .utils import get_client_ip

class RateLimitMiddleware:
    # Default limits
    ANON_LIMIT = 100  # requests per minute
    USER_LIMIT = 1000
    TENANT_LIMIT = 10000
    WINDOW = 60  # seconds
    
    # Whitelist
    WHITELISTED_IPS = getattr(settings, 'RATELIMIT_WHITELISTED_IPS', [])
    
    def __init__(self, get_response):
        self.get_response = get_response
    
    def __call__(self, request):
        client_ip = get_client_ip(request)
        
        # Skip whitelisted IPs
        if self._is_whitelisted(client_ip):
            return self.get_response(request)
        
        # Determine rate limit key and limit
        key, limit = self._get_rate_limit_key(request, client_ip)
        
        # Check rate limit
        current, remaining, reset_time = self._check_rate_limit(key, limit, self.WINDOW)
        
        # Rate limit exceeded
        if remaining < 0:
            retry_after = int(reset_time - time.time())
            return self._get_429_response(retry_after)
        
        # Process request
        response = self.get_response(request)
        
        # Add rate limit headers
        self._add_rate_limit_headers(response, limit, remaining, reset_time)
        
        return response
    
    def _get_rate_limit_key(self, request, client_ip):
        if request.user.is_authenticated:
            return f"ratelimit:user:{request.user.id}", self.USER_LIMIT
        return f"ratelimit:ip:{client_ip}", self.ANON_LIMIT
    
    def _check_rate_limit(self, key, limit, window):
        now = time.time()
        window_start = now - window
        
        # Use Redis sorted set for sliding window
        pipeline = cache.client.get_client().pipeline()
        
        # Remove old entries
        pipeline.zremrangebyscore(key, 0, window_start)
        
        # Count current requests
        pipeline.zcard(key)
        
        # Add current request
        pipeline.zadd(key, {str(now): now})
        
        # Set expiry
        pipeline.expire(key, window)
        
        results = pipeline.execute()
        current = results[1]
        remaining = limit - current - 1
        reset_time = now + window
        
        return current, remaining, reset_time
    
    def _add_rate_limit_headers(self, response, limit, remaining, reset_time):
        response['X-RateLimit-Limit'] = str(limit)
        response['X-RateLimit-Remaining'] = str(max(0, remaining))
        response['X-RateLimit-Reset'] = str(int(reset_time))
    
    def _get_429_response(self, retry_after):
        response = JsonResponse(
            {
                'error': 'Rate limit exceeded',
                'code': 'RATE_LIMIT_EXCEEDED',
                'retry_after': retry_after,
            },
            status=429
        )
        response['Retry-After'] = str(retry_after)
        return response
    
    def _is_whitelisted(self, ip):
        return ip in self.WHITELISTED_IPS
```

### Settings Configuration
```python
# settings/ratelimit.py
RATELIMIT_CONFIG = {
    'ANONYMOUS_LIMIT': 100,  # per minute
    'USER_LIMIT': 1000,      # per minute
    'TENANT_LIMIT': 10000,   # per minute
    'WINDOW': 60,            # seconds
    'WHITELISTED_IPS': ['127.0.0.1'],
    'ENDPOINT_LIMITS': {
        '/api/v1/auth/login/': 10,  # 10 per minute
        '/api/v1/auth/register/': 5,
    },
}
```

---

## Notes for AI Agents

1. **Redis Required:** Use Redis for distributed rate limiting
2. **Sliding Window:** More accurate than fixed window
3. **User Priority:** Authenticated users get higher limits
4. **Tenant Limits:** Aggregate limit per tenant
5. **Whitelist:** Allow internal IPs to bypass
6. **429 Response:** Standard rate limit response
7. **Headers:** Always include rate limit headers
8. **Endpoint Limits:** Stricter limits for auth endpoints
