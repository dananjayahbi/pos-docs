# Tasks 62-65: Rate Limit Strategies

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 06 - Core Middleware Stack  
> **Group:** E - Rate Limiting Middleware  
> **Document:** 02 of 04  
> **Tasks Covered:** 62, 63, 64, 65

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-59-61_Rate-Limit-Setup.md](01_Tasks-59-61_Rate-Limit-Setup.md)
- **→ Next Document:** [03_Tasks-66-70_Window-Headers.md](03_Tasks-66-70_Window-Headers.md)

---

## Document Overview

This document covers the implementation of different rate limiting strategies: IP-based for anonymous users, user-based for authenticated users, tenant-based for aggregate limits, and endpoint-based for specific routes requiring custom limits.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 62 | Add IP-Based Rate Limit | Simple |
| 63 | Add User-Based Rate Limit | Simple |
| 64 | Add Tenant-Based Rate Limit | Medium |
| 65 | Add Endpoint-Based Rate Limit | Medium |

---

## Task 62: Add IP-Based Rate Limit

### Overview
Implement IP-based rate limiting for anonymous users and as a fallback strategy. This limits requests per client IP address.

### Dependencies
- Task 61: Configure Redis Backend
- Group-A: get_client_ip utility function exists

### Instructions

1. **Import get_client_ip utility**
   - Add import for IP extraction utility
   - Location: `from .utils import get_client_ip`
   - This utility handles X-Forwarded-For and proxy headers

2. **Update __call__ method**
   - Extract client IP at the start
   - Store in variable for reuse
   - Pass to rate limit key determination

3. **Implement IP-based key generation**
   - Check if user is anonymous
   - Generate key format: `ratelimit:ip:{ip_address}`
   - Use ANON_LIMIT for anonymous requests
   - Return tuple of (key, limit)

4. **Handle proxy scenarios**
   - get_client_ip handles X-Forwarded-For
   - Supports proxy configurations
   - Returns real client IP

### IP Rate Limit Implementation

```python
# Add to imports at top of file
from .utils import get_client_ip

# Update __call__ method
def __call__(self, request):
    """
    Process the request and apply rate limiting.
    
    Args:
        request: The HTTP request object
        
    Returns:
        HTTP response (429 if rate limited, otherwise normal response)
    """
    # Extract client IP address
    client_ip = get_client_ip(request)
    
    # Skip whitelisted IPs (will implement in Task 72)
    if self._is_whitelisted(client_ip):
        return self.get_response(request)
    
    # Determine rate limit key and limit based on request
    key, limit = self._get_rate_limit_key(request, client_ip)
    
    # Check rate limit using Redis
    current_count, remaining, reset_time = self._check_rate_limit(
        key, limit, self.WINDOW
    )
    
    # Rate limit exceeded
    if remaining < 0:
        retry_after = int(reset_time - time.time())
        return self._get_429_response(retry_after)
    
    # Process request normally
    response = self.get_response(request)
    
    # Add rate limit headers to response
    self._add_rate_limit_headers(response, limit, remaining, reset_time)
    
    return response

# Implement _get_rate_limit_key method
def _get_rate_limit_key(self, request, client_ip):
    """
    Determine the rate limit key and limit for the request.
    
    Priority order:
    1. Endpoint-specific limit (Task 65)
    2. Tenant-based limit (Task 64)
    3. User-based limit (Task 63)
    4. IP-based limit (Task 62 - this task)
    
    Args:
        request: The HTTP request object
        client_ip: The client IP address
        
    Returns:
        tuple: (rate_limit_key, limit)
    """
    # For now, use IP-based limiting for anonymous users
    # Will be extended in Tasks 63-65
    
    # Default to IP-based rate limiting
    key = f"ratelimit:ip:{client_ip}"
    limit = self.ANON_LIMIT
    
    return key, limit
```

### IP-Based Rate Limit Logic
| Condition | Key Format | Limit | Reason |
|-----------|------------|-------|--------|
| **Anonymous User** | `ratelimit:ip:{ip}` | ANON_LIMIT (100) | No authentication |
| **Behind Proxy** | `ratelimit:ip:{real_ip}` | ANON_LIMIT (100) | Uses X-Forwarded-For |
| **Unknown IP** | `ratelimit:ip:unknown` | ANON_LIMIT (100) | Fallback key |

### IP Extraction Priority
```
1. X-Forwarded-For header (first IP in list)
2. X-Real-IP header
3. REMOTE_ADDR from request.META
4. Fallback to 'unknown'
```

### Example Scenarios
```python
# Scenario 1: Direct connection
Request from 192.168.1.100
→ Key: "ratelimit:ip:192.168.1.100"
→ Limit: 100 requests/minute

# Scenario 2: Behind proxy
X-Forwarded-For: 203.0.113.50, 192.168.1.1
→ Key: "ratelimit:ip:203.0.113.50"
→ Limit: 100 requests/minute

# Scenario 3: Multiple requests same IP
All requests from 192.168.1.100 share counter
→ Request 1: 99 remaining
→ Request 2: 98 remaining
→ ...
→ Request 100: 0 remaining
→ Request 101: 429 Too Many Requests
```

### get_client_ip Utility

The utility function (created in Group-A) should look like:

```python
# File: backend/apps/core/middleware/utils.py

def get_client_ip(request):
    """
    Extract the client IP address from the request.
    
    Handles proxy headers and returns the real client IP.
    
    Args:
        request: The HTTP request object
        
    Returns:
        str: The client IP address
    """
    # Check X-Forwarded-For header (proxy)
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        # First IP in list is the client
        ip = x_forwarded_for.split(',')[0].strip()
        return ip
    
    # Check X-Real-IP header (nginx)
    x_real_ip = request.META.get('HTTP_X_REAL_IP')
    if x_real_ip:
        return x_real_ip
    
    # Fallback to REMOTE_ADDR
    remote_addr = request.META.get('REMOTE_ADDR')
    if remote_addr:
        return remote_addr
    
    # Last resort fallback
    return 'unknown'
```

### Expected Outcome
- IP-based rate limiting functional
- Anonymous users limited by IP
- Proxy scenarios handled correctly
- Rate limit key format consistent

### Verification Checklist
- [ ] `get_client_ip` imported from utils
- [ ] `__call__` method extracts client IP
- [ ] `_get_rate_limit_key` generates IP-based key
- [ ] Key format is `ratelimit:ip:{ip_address}`
- [ ] ANON_LIMIT used for anonymous users
- [ ] Proxy headers handled correctly
- [ ] Rate limiting works for anonymous requests

---

## Task 63: Add User-Based Rate Limit

### Overview
Implement user-based rate limiting for authenticated users. This provides higher limits for logged-in users and prevents authenticated users from being limited by shared IP addresses.

### Dependencies
- Task 62: Add IP-Based Rate Limit

### Instructions

1. **Extend _get_rate_limit_key method**
   - Check if user is authenticated
   - Generate user-based key if authenticated
   - Fall back to IP-based if not authenticated

2. **Implement user authentication check**
   - Use `request.user.is_authenticated`
   - Access user ID with `request.user.id` or `request.user.pk`
   - Ensure user object is available

3. **Generate user-based key**
   - Format: `ratelimit:user:{user_id}`
   - Use USER_LIMIT (higher than ANON_LIMIT)
   - Provides better UX for authenticated users

4. **Handle authentication edge cases**
   - Check for AnonymousUser
   - Verify user ID exists
   - Fall back to IP-based on errors

### User-Based Rate Limit Implementation

```python
def _get_rate_limit_key(self, request, client_ip):
    """
    Determine the rate limit key and limit for the request.
    
    Priority order:
    1. Endpoint-specific limit (Task 65)
    2. Tenant-based limit (Task 64)
    3. User-based limit (Task 63 - this task)
    4. IP-based limit (Task 62)
    
    Args:
        request: The HTTP request object
        client_ip: The client IP address
        
    Returns:
        tuple: (rate_limit_key, limit)
    """
    # Check if user is authenticated
    if request.user and request.user.is_authenticated:
        # User-based rate limiting (higher limit)
        user_id = request.user.pk
        key = f"ratelimit:user:{user_id}"
        limit = self.USER_LIMIT
        return key, limit
    
    # Fall back to IP-based rate limiting
    key = f"ratelimit:ip:{client_ip}"
    limit = self.ANON_LIMIT
    
    return key, limit
```

### Rate Limit Comparison
| User Type | Strategy | Key Format | Limit | Window |
|-----------|----------|------------|-------|--------|
| **Anonymous** | IP-based | `ratelimit:ip:{ip}` | 100 | 60s |
| **Authenticated** | User-based | `ratelimit:user:{id}` | 1000 | 60s |
| **Benefit** | 10x higher | Independent counter | Better UX | Same |

### Authentication Scenarios
```python
# Scenario 1: Anonymous user
request.user.is_authenticated = False
→ Key: "ratelimit:ip:192.168.1.100"
→ Limit: 100 requests/minute

# Scenario 2: Authenticated user
request.user.is_authenticated = True
request.user.pk = 42
→ Key: "ratelimit:user:42"
→ Limit: 1000 requests/minute

# Scenario 3: Multiple users same IP
User A (ID 42) from 192.168.1.100
→ Key: "ratelimit:user:42"

User B (ID 43) from 192.168.1.100 (same IP)
→ Key: "ratelimit:user:43"

→ Each user gets independent counter (not shared)
```

### Benefits of User-Based Limiting
| Benefit | Description |
|---------|-------------|
| **Higher Limits** | Authenticated users get 10x more requests |
| **Independent Counters** | Not affected by other users on same IP |
| **Better UX** | Prevents frustration from shared IP limits |
| **Accurate Tracking** | Track usage per user for analytics |
| **Fraud Prevention** | Detect abusive individual accounts |

### User Authentication Check
```python
# Proper authentication check
if request.user and request.user.is_authenticated:
    # User is authenticated
    user_id = request.user.pk
    # Use user-based rate limit
else:
    # User is anonymous
    # Use IP-based rate limit
```

### Edge Cases to Handle
| Scenario | Handling | Fallback |
|----------|----------|----------|
| **No request.user** | Check `hasattr(request, 'user')` | Use IP-based |
| **AnonymousUser** | Check `is_authenticated` | Use IP-based |
| **No user.pk** | Check existence | Use IP-based |
| **Auth middleware disabled** | Handle gracefully | Use IP-based |

### Expected Outcome
- Authenticated users get higher limits
- Independent counters per user
- Graceful fallback to IP-based
- Better user experience

### Verification Checklist
- [ ] `_get_rate_limit_key` checks `request.user.is_authenticated`
- [ ] User-based key format: `ratelimit:user:{user_id}`
- [ ] USER_LIMIT (1000) used for authenticated users
- [ ] ANON_LIMIT (100) used for anonymous users
- [ ] User ID accessed via `request.user.pk`
- [ ] Graceful fallback to IP-based on errors
- [ ] Multiple users on same IP get independent counters

---

## Task 64: Add Tenant-Based Rate Limit

### Overview
Implement tenant-based rate limiting to set aggregate limits per tenant. This prevents any single tenant from consuming excessive resources.

### Dependencies
- Task 63: Add User-Based Rate Limit
- Phase 02: Multi-tenancy middleware exists

### Instructions

1. **Check for tenant in request**
   - Access tenant from request (set by tenant middleware)
   - Check `hasattr(request, 'tenant')`
   - Verify tenant object exists and is not None

2. **Extend _get_rate_limit_key method**
   - Add tenant check before user check
   - Generate tenant-based key if tenant exists
   - Use TENANT_LIMIT (highest limit)

3. **Generate tenant-based key**
   - Format: `ratelimit:tenant:{tenant_id}`
   - Use tenant ID or slug
   - Apply TENANT_LIMIT (10,000 requests)

4. **Handle tenant-less requests**
   - Public/shared domains may not have tenant
   - Fall back to user-based or IP-based
   - Super Admin requests may be tenant-less

5. **Consider combined strategy**
   - Option: Check both tenant AND user limits
   - Implement whichever is more restrictive
   - Or use tenant limit as primary strategy

### Tenant-Based Rate Limit Implementation

```python
def _get_rate_limit_key(self, request, client_ip):
    """
    Determine the rate limit key and limit for the request.
    
    Priority order:
    1. Endpoint-specific limit (Task 65)
    2. Tenant-based limit (Task 64 - this task)
    3. User-based limit (Task 63)
    4. IP-based limit (Task 62)
    
    Args:
        request: The HTTP request object
        client_ip: The client IP address
        
    Returns:
        tuple: (rate_limit_key, limit)
    """
    # Check for tenant-based rate limiting
    # Tenant middleware sets request.tenant for tenant-scoped requests
    if hasattr(request, 'tenant') and request.tenant:
        tenant_id = request.tenant.id
        key = f"ratelimit:tenant:{tenant_id}"
        limit = self.TENANT_LIMIT
        return key, limit
    
    # Check if user is authenticated
    if request.user and request.user.is_authenticated:
        user_id = request.user.pk
        key = f"ratelimit:user:{user_id}"
        limit = self.USER_LIMIT
        return key, limit
    
    # Fall back to IP-based rate limiting
    key = f"ratelimit:ip:{client_ip}"
    limit = self.ANON_LIMIT
    
    return key, limit
```

### Rate Limit Strategy Hierarchy
| Priority | Strategy | Key Format | Limit | Use Case |
|----------|----------|------------|-------|----------|
| **1** | Tenant | `ratelimit:tenant:{id}` | 10,000 | Aggregate tenant limit |
| **2** | User | `ratelimit:user:{id}` | 1,000 | Per authenticated user |
| **3** | IP | `ratelimit:ip:{ip}` | 100 | Per anonymous client |

### Tenant Rate Limiting Scenarios
```python
# Scenario 1: Tenant with multiple users
Tenant ID: 5
User A (ID 42) makes 500 requests
User B (ID 43) makes 500 requests
User C (ID 44) makes 500 requests
→ Total: 1,500 requests against tenant limit (10,000)
→ Each user contributes to same tenant counter

# Scenario 2: Cross-tenant isolation
Tenant A (ID 5): 8,000 requests
Tenant B (ID 7): 8,000 requests
→ Each tenant has independent counter
→ Prevents one tenant affecting another

# Scenario 3: No tenant (public API)
Request to public endpoint (no tenant)
User authenticated (ID 42)
→ Falls back to user-based: "ratelimit:user:42"
→ Limit: 1,000 requests/minute
```

### Tenant Middleware Integration
```python
# Tenant middleware (from Phase 02) sets request.tenant
# Example from Django-tenants or custom implementation

class TenantMiddleware:
    def __call__(self, request):
        # Identify tenant from domain/subdomain
        hostname = request.get_host().split(':')[0]
        
        try:
            tenant = Tenant.objects.get(domain=hostname)
            request.tenant = tenant
        except Tenant.DoesNotExist:
            request.tenant = None
        
        return self.get_response(request)

# Rate limit middleware uses request.tenant
# Set by tenant middleware (must be earlier in MIDDLEWARE list)
```

### Tenant Limit Benefits
| Benefit | Description |
|---------|-------------|
| **Resource Protection** | Prevents single tenant from exhausting resources |
| **Fair Usage** | Ensures fair distribution across tenants |
| **Billing Enforcement** | Can tie limits to subscription tiers |
| **Abuse Prevention** | Isolates abusive tenants |
| **Scalability** | Predictable resource consumption per tenant |

### Multi-Strategy Consideration

Option: Apply BOTH tenant and user limits (most restrictive):

```python
def _get_rate_limit_key(self, request, client_ip):
    """
    Check both tenant and user limits, apply most restrictive.
    """
    checks = []
    
    # Check tenant limit
    if hasattr(request, 'tenant') and request.tenant:
        tenant_key = f"ratelimit:tenant:{request.tenant.id}"
        checks.append((tenant_key, self.TENANT_LIMIT))
    
    # Check user limit
    if request.user and request.user.is_authenticated:
        user_key = f"ratelimit:user:{request.user.pk}"
        checks.append((user_key, self.USER_LIMIT))
    
    # If no checks, use IP
    if not checks:
        return f"ratelimit:ip:{client_ip}", self.ANON_LIMIT
    
    # For simplicity, use tenant limit if available (higher priority)
    return checks[0]
```

### Expected Outcome
- Tenant-based aggregate limiting functional
- Highest priority in rate limit strategy
- Proper fallback to user/IP strategies
- Cross-tenant isolation maintained

### Verification Checklist
- [ ] Check for `request.tenant` using `hasattr()`
- [ ] Tenant-based key format: `ratelimit:tenant:{tenant_id}`
- [ ] TENANT_LIMIT (10,000) used for tenant requests
- [ ] Graceful fallback if no tenant present
- [ ] Tenant middleware integration verified
- [ ] Cross-tenant isolation tested
- [ ] Aggregate tenant counting works correctly

---

## Task 65: Add Endpoint-Based Rate Limit

### Overview
Implement endpoint-specific rate limiting to apply custom limits to specific routes. This allows stricter limits on sensitive endpoints like authentication.

### Dependencies
- Task 64: Add Tenant-Based Rate Limit

### Instructions

1. **Define endpoint limits configuration**
   - Add ENDPOINT_LIMITS dict to settings
   - Map endpoint paths to custom limits
   - Document common patterns

2. **Extract endpoint path from request**
   - Use `request.path` or `request.path_info`
   - Normalize path (strip query strings)
   - Handle trailing slashes

3. **Check for endpoint-specific limit**
   - Look up path in ENDPOINT_LIMITS dict
   - Use custom limit if found
   - Combine with user/IP for key

4. **Extend _get_rate_limit_key method**
   - Check endpoint limits first (highest priority)
   - Generate composite key with endpoint + user/IP
   - Apply custom limit from configuration

5. **Support wildcard patterns**
   - Optional: Support glob patterns (e.g., `/api/v1/auth/*`)
   - Or use exact match for simplicity
   - Document pattern matching approach

### Endpoint-Based Rate Limit Implementation

```python
def _get_rate_limit_key(self, request, client_ip):
    """
    Determine the rate limit key and limit for the request.
    
    Priority order:
    1. Endpoint-specific limit (Task 65 - this task)
    2. Tenant-based limit (Task 64)
    3. User-based limit (Task 63)
    4. IP-based limit (Task 62)
    
    Args:
        request: The HTTP request object
        client_ip: The client IP address
        
    Returns:
        tuple: (rate_limit_key, limit)
    """
    # Get request path (normalize)
    path = request.path.rstrip('/')
    
    # Check for endpoint-specific rate limits
    if path in self.ENDPOINT_LIMITS:
        endpoint_limit = self.ENDPOINT_LIMITS[path]
        
        # Create composite key with endpoint + user/IP
        if request.user and request.user.is_authenticated:
            key = f"ratelimit:endpoint:{path}:user:{request.user.pk}"
        else:
            key = f"ratelimit:endpoint:{path}:ip:{client_ip}"
        
        return key, endpoint_limit
    
    # Check for tenant-based rate limiting
    if hasattr(request, 'tenant') and request.tenant:
        tenant_id = request.tenant.id
        key = f"ratelimit:tenant:{tenant_id}"
        limit = self.TENANT_LIMIT
        return key, limit
    
    # Check if user is authenticated
    if request.user and request.user.is_authenticated:
        user_id = request.user.pk
        key = f"ratelimit:user:{user_id}"
        limit = self.USER_LIMIT
        return key, limit
    
    # Fall back to IP-based rate limiting
    key = f"ratelimit:ip:{client_ip}"
    limit = self.ANON_LIMIT
    
    return key, limit
```

### Endpoint Limits Configuration

```python
# In settings/ratelimit.py or settings/base.py

RATELIMIT_ENDPOINT_LIMITS = {
    # Authentication endpoints (stricter limits)
    '/api/v1/auth/login': 10,              # 10 attempts per minute
    '/api/v1/auth/register': 5,            # 5 registrations per minute
    '/api/v1/auth/password-reset': 3,      # 3 resets per minute
    '/api/v1/auth/token/refresh': 20,      # 20 refreshes per minute
    
    # Sensitive operations
    '/api/v1/users/change-password': 5,
    '/api/v1/users/change-email': 5,
    
    # Public API endpoints (if you have different rate for public)
    '/api/v1/public/products': 200,        # Higher limit for browsing
    
    # Webhook endpoints
    '/api/v1/webhooks/payment': 100,
    
    # Search endpoints (resource intensive)
    '/api/v1/search': 50,
}
```

### Endpoint Rate Limiting Scenarios
```python
# Scenario 1: Login endpoint with custom limit
POST /api/v1/auth/login from IP 192.168.1.100
→ Key: "ratelimit:endpoint:/api/v1/auth/login:ip:192.168.1.100"
→ Limit: 10 requests/minute (custom limit)

# Scenario 2: Same IP, different endpoints
POST /api/v1/auth/login (10/min limit)
GET /api/v1/products (tenant/user/IP limit)
→ Independent counters
→ Login attempts don't affect product browsing

# Scenario 3: Multiple users, same endpoint
User A: POST /api/v1/auth/login
→ Key: "ratelimit:endpoint:/api/v1/auth/login:user:42"

User B: POST /api/v1/auth/login
→ Key: "ratelimit:endpoint:/api/v1/auth/login:user:43"

→ Each user gets independent endpoint counter
```

### Composite Key Strategy
| Request Type | Endpoint | User | Key Format |
|--------------|----------|------|------------|
| **Authenticated** | `/api/v1/auth/login` | User 42 | `ratelimit:endpoint:/api/v1/auth/login:user:42` |
| **Anonymous** | `/api/v1/auth/login` | IP 192.168.1.100 | `ratelimit:endpoint:/api/v1/auth/login:ip:192.168.1.100` |
| **No endpoint limit** | `/api/v1/products` | User 42 | Falls back to `ratelimit:user:42` |

### Common Endpoint Patterns
| Endpoint Type | Example | Suggested Limit | Reason |
|---------------|---------|-----------------|--------|
| **Login** | `/auth/login` | 10/min | Prevent brute force |
| **Registration** | `/auth/register` | 5/min | Prevent spam accounts |
| **Password Reset** | `/auth/password-reset` | 3/min | Prevent abuse |
| **Token Refresh** | `/auth/token/refresh` | 20/min | Allow normal usage |
| **Search** | `/search` | 50/min | Resource intensive |
| **File Upload** | `/upload` | 10/min | Bandwidth protection |
| **Public Browse** | `/products` | 200/min | Allow browsing |

### Path Normalization
```python
# Normalize paths for consistent matching
path = request.path.rstrip('/')

# Examples:
'/api/v1/auth/login/'  → '/api/v1/auth/login'
'/api/v1/auth/login'   → '/api/v1/auth/login'
'/api/v1/auth/login?next=/dashboard' → '/api/v1/auth/login'
```

### Optional: Wildcard Pattern Matching

For advanced use cases, support wildcard patterns:

```python
import fnmatch

def _match_endpoint_pattern(self, path):
    """
    Match path against endpoint patterns (supports wildcards).
    
    Args:
        path: Request path to match
        
    Returns:
        int or None: Limit if pattern matches, None otherwise
    """
    for pattern, limit in self.ENDPOINT_LIMITS.items():
        if fnmatch.fnmatch(path, pattern):
            return limit
    return None

# Usage in configuration
RATELIMIT_ENDPOINT_LIMITS = {
    '/api/v1/auth/*': 10,              # All auth endpoints
    '/api/v1/admin/*': 50,             # All admin endpoints
    '/api/v1/public/*': 200,           # All public endpoints
}
```

### Expected Outcome
- Endpoint-specific rate limits functional
- Stricter limits on sensitive endpoints
- Composite keys for endpoint + user/IP
- Configuration-driven limits

### Verification Checklist
- [ ] ENDPOINT_LIMITS configuration loaded from settings
- [ ] Request path extracted and normalized
- [ ] Endpoint lookup checks exact match
- [ ] Composite key includes endpoint + user/IP
- [ ] Custom limit applied for matched endpoints
- [ ] Fallback to tenant/user/IP for unmatched endpoints
- [ ] Common patterns documented (login, register, etc.)
- [ ] Path normalization handles trailing slashes

---

## Group E Next Steps

After completing Tasks 62-65, proceed to:
- **Next Document:** [03_Tasks-66-70_Window-Headers.md](03_Tasks-66-70_Window-Headers.md)
- Configure sliding window parameters
- Add X-RateLimit-Limit header
- Add X-RateLimit-Remaining header
- Add X-RateLimit-Reset header
- Add Retry-After header

---

## Notes for AI Agents

1. **Strategy Priority:** Endpoint > Tenant > User > IP (most to least specific)
2. **Independent Counters:** Each strategy uses separate Redis keys
3. **Composite Keys:** Endpoint limits combine endpoint + user/IP for isolation
4. **Proxy Handling:** Always use get_client_ip() for accurate IP extraction
5. **Tenant Middleware:** Ensure tenant middleware runs before rate limit middleware
6. **Authentication:** Check user.is_authenticated before accessing user.pk
7. **Path Normalization:** Strip trailing slashes and query strings
8. **Configuration:** Load all limits from settings with safe defaults
9. **Graceful Fallback:** Always have a fallback strategy (eventually IP-based)
10. **Testing:** Test each strategy independently and in combination
