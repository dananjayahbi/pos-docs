# Tasks 66-70: Window & Headers

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 06 - Core Middleware Stack  
> **Group:** E - Rate Limiting Middleware  
> **Document:** 03 of 04  
> **Tasks Covered:** 66, 67, 68, 69, 70

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [02_Tasks-62-65_Rate-Limit-Strategies.md](02_Tasks-62-65_Rate-Limit-Strategies.md)
- **→ Next Document:** [04_Tasks-71-74_Response-Testing.md](04_Tasks-71-74_Response-Testing.md)

---

## Document Overview

This document covers the configuration of the sliding window algorithm parameters and the implementation of standard rate limit response headers. These headers inform clients about their rate limit status.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 66 | Configure Rate Limit Windows | Simple |
| 67 | Add X-RateLimit-Limit Header | Simple |
| 68 | Add X-RateLimit-Remaining Header | Simple |
| 69 | Add X-RateLimit-Reset Header | Simple |
| 70 | Add Retry-After Header | Simple |

---

## Task 66: Configure Rate Limit Windows

### Overview
Configure and document the sliding window parameters. The sliding window algorithm provides accurate rate limiting by counting requests within a rolling time window rather than fixed intervals.

### Dependencies
- Task 61: Configure Redis Backend (sliding window already implemented)

### Instructions

1. **Review sliding window implementation**
   - Window already implemented in _check_rate_limit (Task 61)
   - Uses Redis sorted sets with timestamp scores
   - Automatically removes expired entries

2. **Document window configuration**
   - Default window: 60 seconds (1 minute)
   - Configurable via settings
   - Consistent across all strategies

3. **Add window customization support**
   - Allow per-endpoint custom windows
   - Add ENDPOINT_WINDOWS configuration
   - Update _check_rate_limit calls to use custom windows

4. **Implement custom window support**
   - Extend endpoint configuration
   - Look up custom window for endpoint
   - Fall back to default WINDOW constant

### Window Configuration Implementation

```python
# In RateLimitMiddleware class

# Add custom window configuration
ENDPOINT_WINDOWS = getattr(settings, 'RATELIMIT_ENDPOINT_WINDOWS', {})

def _get_rate_limit_window(self, request):
    """
    Get the rate limit window for the request.
    
    Checks for endpoint-specific window, falls back to default.
    
    Args:
        request: The HTTP request object
        
    Returns:
        int: Time window in seconds
    """
    # Get normalized path
    path = request.path.rstrip('/')
    
    # Check for custom endpoint window
    if path in self.ENDPOINT_WINDOWS:
        return self.ENDPOINT_WINDOWS[path]
    
    # Return default window
    return self.WINDOW

# Update __call__ method to use custom window
def __call__(self, request):
    """
    Process the request and apply rate limiting.
    """
    client_ip = get_client_ip(request)
    
    if self._is_whitelisted(client_ip):
        return self.get_response(request)
    
    key, limit = self._get_rate_limit_key(request, client_ip)
    
    # Get window (default or custom per endpoint)
    window = self._get_rate_limit_window(request)
    
    # Check rate limit with custom window
    current_count, remaining, reset_time = self._check_rate_limit(
        key, limit, window
    )
    
    if remaining < 0:
        retry_after = int(reset_time - time.time())
        return self._get_429_response(retry_after)
    
    response = self.get_response(request)
    self._add_rate_limit_headers(response, limit, remaining, reset_time)
    
    return response
```

### Sliding Window Algorithm Review

The sliding window algorithm (implemented in Task 61) works as follows:

```
Current Time: 12:05:30
Window: 60 seconds
Window Start: 12:04:30

Redis Sorted Set:
┌─────────────────────────────────────────────┐
│ Score (Timestamp)    │ Member (Request ID)  │
├─────────────────────────────────────────────┤
│ 1703251470.123       │ "1703251470.123"     │ ← Within window
│ 1703251475.456       │ "1703251475.456"     │ ← Within window
│ 1703251480.789       │ "1703251480.789"     │ ← Within window
│ ...                  │ ...                  │
│ 1703251530.012       │ "1703251530.012"     │ ← Current request
└─────────────────────────────────────────────┘

Operations:
1. ZREMRANGEBYSCORE key 0 1703251470  → Remove entries older than window start
2. ZCARD key                          → Count entries (99)
3. ZADD key 1703251530.012           → Add current request
4. EXPIRE key 70                      → Set expiration (window + 10s buffer)

Result: 99 requests in window, 901 remaining (if limit is 1000)
```

### Window Configuration Options

```python
# In settings/ratelimit.py

# Default window for all strategies
RATELIMIT_WINDOW = 60  # seconds (1 minute)

# Custom windows per endpoint
RATELIMIT_ENDPOINT_WINDOWS = {
    '/api/v1/auth/login': 60,           # 1 minute window
    '/api/v1/auth/register': 300,       # 5 minute window (stricter)
    '/api/v1/auth/password-reset': 600, # 10 minute window (very strict)
    '/api/v1/search': 30,               # 30 second window (more responsive)
}

# Example: Password reset limited to 3 attempts per 10 minutes
# RATELIMIT_ENDPOINT_LIMITS['/api/v1/auth/password-reset'] = 3
# RATELIMIT_ENDPOINT_WINDOWS['/api/v1/auth/password-reset'] = 600
```

### Sliding Window vs Fixed Window

| Aspect | Sliding Window | Fixed Window |
|--------|----------------|--------------|
| **Accuracy** | Exact count in rolling period | Can allow 2x limit at boundary |
| **Complexity** | Higher (sorted set) | Lower (simple counter) |
| **Memory** | More (stores timestamps) | Less (single counter) |
| **Implementation** | Redis ZSET | Redis INCR |
| **Edge Cases** | No boundary issues | Boundary burst allowed |
| **Our Choice** | ✓ Sliding Window | Fixed Window |

### Sliding Window Example

```
Limit: 10 requests per 60 seconds

Time:     12:00:00  12:00:15  12:00:30  12:00:45  12:01:00  12:01:15
Requests: ████      ██        ███       █         ████      ██

At 12:01:00, window is 12:00:00 to 12:01:00
→ Counts: 4 + 2 + 3 + 1 = 10 requests (limit reached)

At 12:01:15, window is 12:00:15 to 12:01:15
→ Counts: 2 + 3 + 1 + 4 + 2 = 12 requests
→ BUT old requests (12:00:00) are removed
→ Actual: 2 + 3 + 1 + 4 + 2 = 12 (over limit)

Sliding window accurately prevents bursts.
```

### Window Size Considerations

| Window Size | Use Case | Pros | Cons |
|-------------|----------|------|------|
| **30 seconds** | Real-time APIs | Fast response to abuse | Less flexible for bursts |
| **60 seconds** | Standard APIs | Good balance | Default choice |
| **300 seconds (5 min)** | Sensitive operations | Strict control | May frustrate users |
| **3600 seconds (1 hour)** | Rate limiting tiers | Long-term control | Slow response to abuse |

### Expected Outcome
- Window configuration documented
- Custom per-endpoint windows supported
- Sliding window algorithm validated
- Configuration examples provided

### Verification Checklist
- [ ] Default WINDOW constant defined (60 seconds)
- [ ] ENDPOINT_WINDOWS configuration support added
- [ ] `_get_rate_limit_window()` method implemented
- [ ] `__call__` method uses custom window
- [ ] Settings configuration documented
- [ ] Sliding window algorithm reviewed and understood
- [ ] Window size considerations documented

---

## Task 67: Add X-RateLimit-Limit Header

### Overview
Add the X-RateLimit-Limit header to all responses. This header informs clients of the maximum number of requests allowed in the current window.

### Dependencies
- Task 66: Configure Rate Limit Windows

### Instructions

1. **Implement _add_rate_limit_headers method**
   - Accept response, limit, remaining, reset_time parameters
   - Add X-RateLimit-Limit header with maximum allowed requests
   - Format as string

2. **Add header to response**
   - Use response dictionary-style header assignment
   - Format: `response['X-RateLimit-Limit'] = str(limit)`
   - Always include, even when not rate limited

3. **Ensure header in all responses**
   - Call _add_rate_limit_headers after successful request
   - Include in normal flow (not just 429 responses)
   - Client can track limit proactively

### X-RateLimit-Limit Header Implementation

```python
def _add_rate_limit_headers(self, response, limit, remaining, reset_time):
    """
    Add rate limit headers to the response.
    
    Headers follow the draft IETF standard for rate limit headers:
    - X-RateLimit-Limit: Maximum requests allowed in window
    - X-RateLimit-Remaining: Requests remaining in current window  
    - X-RateLimit-Reset: Unix timestamp when window resets
    
    Args:
        response: The HTTP response object
        limit: Maximum requests allowed in window
        remaining: Requests remaining in current window
        reset_time: Unix timestamp when limit resets
    """
    # Add X-RateLimit-Limit header
    response['X-RateLimit-Limit'] = str(limit)
    
    # Other headers will be added in Tasks 68-69
```

### X-RateLimit-Limit Header Format

```http
X-RateLimit-Limit: 1000
```

### Header Value by Strategy

| Strategy | Example Limit | Header Value |
|----------|---------------|--------------|
| **IP-based (anonymous)** | 100 | `X-RateLimit-Limit: 100` |
| **User-based (authenticated)** | 1000 | `X-RateLimit-Limit: 1000` |
| **Tenant-based** | 10000 | `X-RateLimit-Limit: 10000` |
| **Endpoint-based (login)** | 10 | `X-RateLimit-Limit: 10` |

### Example Response

```http
HTTP/1.1 200 OK
Content-Type: application/json
X-RateLimit-Limit: 1000
...

{
  "data": { ... }
}
```

### Client Usage

Clients can use this header to:

```javascript
// JavaScript client example
async function makeRequest(url) {
  const response = await fetch(url);
  
  // Check rate limit
  const limit = response.headers.get('X-RateLimit-Limit');
  console.log(`Rate limit: ${limit} requests per minute`);
  
  return response.json();
}
```

### Expected Outcome
- X-RateLimit-Limit header added to all responses
- Header value reflects the limit for the request's strategy
- Clients can see their rate limit

### Verification Checklist
- [ ] `_add_rate_limit_headers()` method signature defined
- [ ] X-RateLimit-Limit header added to response
- [ ] Limit value converted to string
- [ ] Header added for all successful requests
- [ ] Header value matches rate limit strategy

---

## Task 68: Add X-RateLimit-Remaining Header

### Overview
Add the X-RateLimit-Remaining header to inform clients how many requests they have remaining in the current window.

### Dependencies
- Task 67: Add X-RateLimit-Limit Header

### Instructions

1. **Extend _add_rate_limit_headers method**
   - Add X-RateLimit-Remaining header
   - Use remaining parameter from _check_rate_limit
   - Ensure value is never negative

2. **Handle negative remaining values**
   - Use max(0, remaining) to prevent negative display
   - Negative remaining means rate limit exceeded
   - Set to 0 for consistency

3. **Update header in all responses**
   - Decrement with each request
   - Helps clients track consumption
   - Prevents surprise 429 responses

### X-RateLimit-Remaining Header Implementation

```python
def _add_rate_limit_headers(self, response, limit, remaining, reset_time):
    """
    Add rate limit headers to the response.
    
    Args:
        response: The HTTP response object
        limit: Maximum requests allowed in window
        remaining: Requests remaining in current window
        reset_time: Unix timestamp when limit resets
    """
    # Add X-RateLimit-Limit header
    response['X-RateLimit-Limit'] = str(limit)
    
    # Add X-RateLimit-Remaining header (never negative)
    response['X-RateLimit-Remaining'] = str(max(0, remaining))
    
    # X-RateLimit-Reset will be added in Task 69
```

### X-RateLimit-Remaining Header Format

```http
X-RateLimit-Remaining: 742
```

### Remaining Value Progression

```
Initial state:
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 1000

After 1st request:
X-RateLimit-Remaining: 999

After 100th request:
X-RateLimit-Remaining: 900

After 999th request:
X-RateLimit-Remaining: 1

After 1000th request:
X-RateLimit-Remaining: 0

After 1001st request:
HTTP 429 Too Many Requests
X-RateLimit-Remaining: 0
```

### Example Response Progression

```http
# Request 1
HTTP/1.1 200 OK
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 99

# Request 50
HTTP/1.1 200 OK
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 50

# Request 100
HTTP/1.1 200 OK
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 0

# Request 101
HTTP/1.1 429 Too Many Requests
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 0
Retry-After: 45
```

### Client Usage Pattern

```javascript
// Client-side rate limit tracking
class RateLimitedAPI {
  async request(url) {
    const response = await fetch(url);
    
    const limit = parseInt(response.headers.get('X-RateLimit-Limit'));
    const remaining = parseInt(response.headers.get('X-RateLimit-Remaining'));
    
    // Warn user when running low
    if (remaining < limit * 0.1) {
      console.warn(`Rate limit warning: ${remaining}/${limit} remaining`);
    }
    
    // Proactively wait if exhausted
    if (remaining === 0) {
      const reset = parseInt(response.headers.get('X-RateLimit-Reset'));
      const waitTime = reset - Math.floor(Date.now() / 1000);
      console.log(`Rate limit exhausted. Waiting ${waitTime} seconds...`);
      await this.sleep(waitTime * 1000);
    }
    
    return response.json();
  }
  
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
```

### Expected Outcome
- X-RateLimit-Remaining header shows remaining requests
- Value decrements with each request
- Never shows negative values
- Helps clients avoid hitting limits

### Verification Checklist
- [ ] X-RateLimit-Remaining header added to response
- [ ] Remaining value uses max(0, remaining) to avoid negatives
- [ ] Remaining decrements correctly with each request
- [ ] Header present in both successful and 429 responses
- [ ] Value accurately reflects available requests

---

## Task 69: Add X-RateLimit-Reset Header

### Overview
Add the X-RateLimit-Reset header to inform clients when their rate limit will reset. This uses Unix timestamp format.

### Dependencies
- Task 68: Add X-RateLimit-Remaining Header

### Instructions

1. **Extend _add_rate_limit_headers method**
   - Add X-RateLimit-Reset header
   - Use reset_time parameter (Unix timestamp)
   - Convert to integer seconds

2. **Format as Unix timestamp**
   - Use integer seconds since epoch
   - Client can calculate seconds until reset
   - Standard format for time-based headers

3. **Ensure consistency with window**
   - Reset time should be current_time + window
   - Calculated in _check_rate_limit method
   - Represents end of current window

### X-RateLimit-Reset Header Implementation

```python
def _add_rate_limit_headers(self, response, limit, remaining, reset_time):
    """
    Add rate limit headers to the response.
    
    Args:
        response: The HTTP response object
        limit: Maximum requests allowed in window
        remaining: Requests remaining in current window
        reset_time: Unix timestamp when limit resets
    """
    # Add X-RateLimit-Limit header
    response['X-RateLimit-Limit'] = str(limit)
    
    # Add X-RateLimit-Remaining header (never negative)
    response['X-RateLimit-Remaining'] = str(max(0, remaining))
    
    # Add X-RateLimit-Reset header (Unix timestamp)
    response['X-RateLimit-Reset'] = str(int(reset_time))
```

### X-RateLimit-Reset Header Format

```http
X-RateLimit-Reset: 1703251590
```

### Unix Timestamp Explanation

```python
# Current time
now = time.time()
# Example: 1703251530.123456

# Window duration
window = 60  # seconds

# Reset time
reset_time = now + window
# Example: 1703251590.123456

# Header value (integer)
reset_header = int(reset_time)
# Example: 1703251590
```

### Complete Headers Example

```http
HTTP/1.1 200 OK
Content-Type: application/json
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 742
X-RateLimit-Reset: 1703251590

{
  "data": { ... }
}
```

### Client-Side Reset Calculation

```javascript
// Calculate seconds until reset
const resetTimestamp = parseInt(response.headers.get('X-RateLimit-Reset'));
const now = Math.floor(Date.now() / 1000);
const secondsUntilReset = resetTimestamp - now;

console.log(`Rate limit resets in ${secondsUntilReset} seconds`);

// Convert to human-readable format
const resetDate = new Date(resetTimestamp * 1000);
console.log(`Rate limit resets at: ${resetDate.toLocaleString()}`);
```

### Example Timeline

```
Current Time: 12:05:30 (timestamp: 1703251530)
Window: 60 seconds
Reset Time: 12:06:30 (timestamp: 1703251590)

Request at 12:05:30:
  X-RateLimit-Reset: 1703251590
  Time until reset: 60 seconds

Request at 12:05:45:
  X-RateLimit-Reset: 1703251590 (same window)
  Time until reset: 45 seconds

Request at 12:06:31 (new window):
  X-RateLimit-Reset: 1703251651
  Time until reset: 60 seconds
```

### Sliding Window Reset Behavior

```
With sliding window, reset is relative to current request:

Request 1 at 12:05:30
→ Reset: 12:06:30 (60s later)

Request 2 at 12:05:45
→ Reset: 12:06:30 (same, window started at 12:05:30)

Request 3 at 12:06:35 (after reset)
→ Reset: 12:07:35 (new 60s window)
```

### Expected Outcome
- X-RateLimit-Reset header shows reset timestamp
- Value is Unix timestamp (integer seconds)
- Clients can calculate time until reset
- Consistent with sliding window algorithm

### Verification Checklist
- [ ] X-RateLimit-Reset header added to response
- [ ] Reset time is Unix timestamp (integer)
- [ ] Value represents current_time + window
- [ ] Consistent with _check_rate_limit calculation
- [ ] Clients can calculate seconds until reset

---

## Task 70: Add Retry-After Header

### Overview
Add the Retry-After header specifically to 429 responses. This header tells clients how many seconds to wait before retrying.

### Dependencies
- Task 69: Add X-RateLimit-Reset Header

### Instructions

1. **Update _get_429_response method stub**
   - Implement the method (currently a stub)
   - Create JsonResponse with 429 status
   - Add error message in JSON body
   - Add Retry-After header

2. **Calculate retry_after value**
   - Based on reset_time - current_time
   - Passed as parameter to _get_429_response
   - Represents seconds until window resets

3. **Add Retry-After header**
   - Standard HTTP header for 429 responses
   - Value in seconds (integer)
   - Clients should respect this header

4. **Format JSON error response**
   - Clear error message
   - Error code for client handling
   - Include retry_after in body as well

### Retry-After Header Implementation

```python
def _get_429_response(self, retry_after):
    """
    Create a 429 Too Many Requests response.
    
    Returns a JSON response with 429 status code, error message,
    and Retry-After header indicating when to retry.
    
    Args:
        retry_after: Seconds until retry allowed (integer)
        
    Returns:
        JsonResponse with 429 status and Retry-After header
    """
    response = JsonResponse(
        {
            'error': 'Rate limit exceeded',
            'code': 'RATE_LIMIT_EXCEEDED',
            'message': f'Too many requests. Please retry after {retry_after} seconds.',
            'retry_after': retry_after,
        },
        status=429
    )
    
    # Add Retry-After header (standard HTTP header)
    response['Retry-After'] = str(retry_after)
    
    # Also add rate limit headers
    # Note: limit and remaining are not available here
    # These would be added if we refactored to pass them
    
    return response
```

### Enhanced Version with Rate Limit Headers

```python
# Option: Refactor to include rate limit headers in 429 response

def __call__(self, request):
    """
    Process the request and apply rate limiting.
    """
    client_ip = get_client_ip(request)
    
    if self._is_whitelisted(client_ip):
        return self.get_response(request)
    
    key, limit = self._get_rate_limit_key(request, client_ip)
    window = self._get_rate_limit_window(request)
    
    current_count, remaining, reset_time = self._check_rate_limit(
        key, limit, window
    )
    
    # Rate limit exceeded
    if remaining < 0:
        retry_after = int(reset_time - time.time())
        # Create 429 response
        response = self._get_429_response(retry_after)
        # Add rate limit headers to 429 response as well
        self._add_rate_limit_headers(response, limit, remaining, reset_time)
        return response
    
    response = self.get_response(request)
    self._add_rate_limit_headers(response, limit, remaining, reset_time)
    
    return response
```

### 429 Response Format

```http
HTTP/1.1 429 Too Many Requests
Content-Type: application/json
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1703251590
Retry-After: 45

{
  "error": "Rate limit exceeded",
  "code": "RATE_LIMIT_EXCEEDED",
  "message": "Too many requests. Please retry after 45 seconds.",
  "retry_after": 45
}
```

### Retry-After Header Standard

| Header | Value | Description |
|--------|-------|-------------|
| **Retry-After** | `45` | Seconds until retry allowed (integer) |
| **Alternative** | `Wed, 21 Dec 2023 12:06:30 GMT` | HTTP-date format (not used) |

### Client Retry Logic

```javascript
// Automatic retry with exponential backoff
async function apiRequest(url, retries = 3) {
  try {
    const response = await fetch(url);
    
    if (response.status === 429) {
      const retryAfter = parseInt(response.headers.get('Retry-After'));
      
      if (retries > 0) {
        console.log(`Rate limited. Retrying after ${retryAfter} seconds...`);
        await sleep(retryAfter * 1000);
        return apiRequest(url, retries - 1);
      } else {
        throw new Error('Rate limit exceeded, max retries reached');
      }
    }
    
    return response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
```

### Python Client Example

```python
import requests
import time

def api_request(url, max_retries=3):
    """Make API request with automatic retry on 429."""
    for attempt in range(max_retries):
        response = requests.get(url)
        
        if response.status_code == 429:
            retry_after = int(response.headers.get('Retry-After', 60))
            print(f"Rate limited. Waiting {retry_after} seconds...")
            time.sleep(retry_after)
            continue
        
        response.raise_for_status()
        return response.json()
    
    raise Exception("Max retries exceeded")
```

### Error Response Structure

```json
{
  "error": "Rate limit exceeded",
  "code": "RATE_LIMIT_EXCEEDED",
  "message": "Too many requests. Please retry after 45 seconds.",
  "retry_after": 45,
  "details": {
    "limit": 1000,
    "window": "60 seconds",
    "reset_at": "2023-12-22T12:06:30Z"
  }
}
```

### Expected Outcome
- 429 responses include Retry-After header
- JSON body has clear error message
- Clients know exactly when to retry
- Rate limit headers included in 429 response

### Verification Checklist
- [ ] `_get_429_response()` method fully implemented
- [ ] JsonResponse created with status=429
- [ ] Retry-After header added with seconds value
- [ ] JSON body includes error, code, message
- [ ] retry_after value in both header and body
- [ ] Rate limit headers added to 429 response
- [ ] Error message is user-friendly

---

## Group E Next Steps

After completing Tasks 66-70, proceed to:
- **Next Document:** [04_Tasks-71-74_Response-Testing.md](04_Tasks-71-74_Response-Testing.md)
- Finalize 429 response handling
- Implement IP whitelist
- Register middleware in settings
- Create comprehensive tests

---

## Notes for AI Agents

1. **Header Standards:** Follow draft IETF standard for rate limit headers
2. **X-Prefix:** X- prefix for custom headers (legacy but widely used)
3. **Retry-After:** Standard HTTP header (no X- prefix)
4. **Unix Timestamp:** Use integer seconds for X-RateLimit-Reset
5. **Never Negative:** Always use max(0, remaining) for Remaining header
6. **429 Response:** Always include Retry-After header in 429 responses
7. **Header Consistency:** Include rate limit headers in all responses (200 and 429)
8. **Client-Friendly:** Provide clear error messages and actionable information
9. **Sliding Window:** Reset time is relative to request time, not fixed intervals
10. **JSON Format:** Use consistent error response structure across all errors
