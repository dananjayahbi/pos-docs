# Tasks 34-38: Request/Response Logging

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 06 - Core Middleware Stack  
> **Group:** C - Request Logging Middleware  
> **Document:** 02 of 04  
> **Tasks Covered:** 34, 35, 36, 37, 38

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-29-33_Logging-Middleware-Setup.md](01_Tasks-29-33_Logging-Middleware-Setup.md)
- **→ Next Document:** [03_Tasks-39-42_Log-Configuration.md](03_Tasks-39-42_Log-Configuration.md)

---

## Document Overview

This document covers the implementation of detailed request and response logging, including request ID generation, tenant context, and user context enrichment.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 34 | Log Request Details | Medium |
| 35 | Log Response Details | Medium |
| 36 | Add Request ID Header | Medium |
| 37 | Add Tenant ID to Logs | Simple |
| 38 | Add User ID to Logs | Simple |

---

## Task 34: Log Request Details

### Overview
Implement the _log_request method to log comprehensive request details including method, path, client IP, and user agent.

### Dependencies
- Task 30: Create RequestLoggingMiddleware Class
- Task 31: Add Request Start Time

### Instructions

1. **Create _log_request method**
   - Accept request parameter
   - Extract request details
   - Log using logger.info with structured data

2. **Extract request metadata**
   - HTTP method (GET, POST, etc.)
   - Request path
   - Client IP address
   - User agent string

3. **Create utility functions**
   - Add get_client_ip(request) helper
   - Add get_user_agent(request) helper
   - Place in utilities module or inline

4. **Create structured log data**
   - Use dictionary for log context
   - Include event type: 'request_started'
   - Add request_id (will be set in Task 36)
   - Include all request metadata

5. **Call from __call__ method**
   - Call after start_time capture
   - Before get_response call

### Method Implementation

```python
def _log_request(self, request: HttpRequest) -> None:
    """
    Log request details.
    
    Args:
        request: The HTTP request
    """
    log_data = {
        'event': 'request_started',
        'request_id': getattr(request, 'request_id', None),
        'method': request.method,
        'path': request.path,
        'query_string': request.META.get('QUERY_STRING', ''),
        'client_ip': self._get_client_ip(request),
        'user_agent': self._get_user_agent(request),
    }
    
    logger.info(
        f"Request started: {request.method} {request.path}",
        extra=log_data
    )


def _get_client_ip(self, request: HttpRequest) -> str:
    """
    Extract client IP address from request.
    
    Checks X-Forwarded-For header first (for proxies),
    then falls back to REMOTE_ADDR.
    
    Args:
        request: The HTTP request
        
    Returns:
        Client IP address as string
    """
    # Check X-Forwarded-For header (set by proxies/load balancers)
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        # X-Forwarded-For can contain multiple IPs, take the first one
        return x_forwarded_for.split(',')[0].strip()
    
    # Fall back to REMOTE_ADDR
    return request.META.get('REMOTE_ADDR', 'unknown')


def _get_user_agent(self, request: HttpRequest) -> str:
    """
    Extract user agent string from request.
    
    Args:
        request: The HTTP request
        
    Returns:
        User agent string
    """
    return request.META.get('HTTP_USER_AGENT', 'unknown')
```

### Integration into __call__

```python
def __call__(self, request: HttpRequest) -> HttpResponse:
    """
    Process the request and response.
    
    Args:
        request: The HTTP request
        
    Returns:
        The HTTP response
    """
    # Skip excluded paths
    if not self._should_log(request):
        return self.get_response(request)
    
    # Generate/get request ID (Task 36)
    # request_id will be added in Task 36
    
    # Capture request start time
    start_time = time.perf_counter()
    
    # Log request details
    self._log_request(request)
    
    # Get response
    response = self.get_response(request)
    
    # Capture request end time
    end_time = time.perf_counter()
    
    # Calculate duration in milliseconds
    duration_ms = (end_time - start_time) * 1000
    request.duration_ms = duration_ms
    
    return response
```

### Request Log Fields
| Field | Source | Example |
|-------|--------|---------|
| **event** | Static | request_started |
| **request_id** | Task 36 | abc123def456 |
| **method** | request.method | GET, POST |
| **path** | request.path | /api/products/ |
| **query_string** | META['QUERY_STRING'] | page=1&limit=20 |
| **client_ip** | Helper function | 192.168.1.100 |
| **user_agent** | META['HTTP_USER_AGENT'] | Mozilla/5.0... |

### Client IP Detection
```
Request Headers
    │
    ├── Check HTTP_X_FORWARDED_FOR
    │   ├── Present: Split by comma, take first IP
    │   └── Not present: Continue
    │
    └── Check REMOTE_ADDR
        ├── Present: Use this IP
        └── Not present: Return 'unknown'
```

### X-Forwarded-For Examples
```python
# Single IP
X-Forwarded-For: 203.0.113.45
# Result: 203.0.113.45

# Multiple IPs (client -> proxy1 -> proxy2 -> server)
X-Forwarded-For: 203.0.113.45, 198.51.100.23, 192.0.2.1
# Result: 203.0.113.45 (original client)

# No header
REMOTE_ADDR: 192.168.1.100
# Result: 192.168.1.100
```

### Expected Outcome
- _log_request method logs all request details
- Client IP detected from X-Forwarded-For or REMOTE_ADDR
- User agent extracted from headers
- Structured log format ready for JSON output

### Verification Checklist
- [ ] _log_request method defined
- [ ] _get_client_ip handles X-Forwarded-For header
- [ ] _get_user_agent extracts user agent
- [ ] log_data dictionary has all required fields
- [ ] logger.info called with extra=log_data
- [ ] _log_request called in __call__ after start_time
- [ ] Log message is descriptive

---

## Task 35: Log Response Details

### Overview
Implement the _log_response method to log response details including status code, duration, and context information.

### Dependencies
- Task 33: Calculate Response Duration
- Task 34: Log Request Details

### Instructions

1. **Create _log_response method**
   - Accept request, response, and duration_ms parameters
   - Extract response details
   - Log using logger.info with structured data

2. **Extract response metadata**
   - HTTP status code
   - Request duration in milliseconds
   - Response size (optional)

3. **Create structured log data**
   - Use dictionary for log context
   - Include event type: 'request_completed'
   - Add all request details (for correlation)
   - Add response status and duration
   - Include tenant and user IDs (Tasks 37-38)

4. **Call from __call__ method**
   - Call after duration calculation
   - Before return statement

5. **Add log level based on status**
   - INFO for 2xx, 3xx status codes
   - WARNING for 4xx status codes
   - ERROR for 5xx status codes

### Method Implementation

```python
def _log_response(
    self, 
    request: HttpRequest, 
    response: HttpResponse, 
    duration_ms: float
) -> None:
    """
    Log response details with timing and context.
    
    Args:
        request: The HTTP request
        response: The HTTP response
        duration_ms: Request duration in milliseconds
    """
    log_data = {
        'event': 'request_completed',
        'request_id': getattr(request, 'request_id', None),
        'method': request.method,
        'path': request.path,
        'status': response.status_code,
        'duration_ms': round(duration_ms, 2),
        'client_ip': self._get_client_ip(request),
    }
    
    # Add tenant and user IDs (Tasks 37-38)
    # tenant_id will be added in Task 37
    # user_id will be added in Task 38
    
    # Choose log level based on status code
    if response.status_code >= 500:
        log_level = logging.ERROR
        message = f"Request failed: {request.method} {request.path} - {response.status_code}"
    elif response.status_code >= 400:
        log_level = logging.WARNING
        message = f"Request error: {request.method} {request.path} - {response.status_code}"
    else:
        log_level = logging.INFO
        message = f"Request completed: {request.method} {request.path} - {response.status_code}"
    
    logger.log(log_level, message, extra=log_data)
```

### Integration into __call__

```python
def __call__(self, request: HttpRequest) -> HttpResponse:
    """
    Process the request and response.
    
    Args:
        request: The HTTP request
        
    Returns:
        The HTTP response
    """
    # Skip excluded paths
    if not self._should_log(request):
        return self.get_response(request)
    
    # Generate/get request ID (Task 36)
    # request_id will be added in Task 36
    
    # Capture request start time
    start_time = time.perf_counter()
    
    # Log request details
    self._log_request(request)
    
    # Get response
    response = self.get_response(request)
    
    # Capture request end time
    end_time = time.perf_counter()
    
    # Calculate duration in milliseconds
    duration_ms = (end_time - start_time) * 1000
    request.duration_ms = duration_ms
    
    # Log response details with duration
    self._log_response(request, response, duration_ms)
    
    return response
```

### Response Log Fields
| Field | Source | Example |
|-------|--------|---------|
| **event** | Static | request_completed |
| **request_id** | request.request_id | abc123def456 |
| **method** | request.method | POST |
| **path** | request.path | /api/orders/ |
| **status** | response.status_code | 201 |
| **duration_ms** | Calculated | 45.67 |
| **client_ip** | Helper function | 192.168.1.100 |
| **tenant_id** | Task 37 | tenant_abc123 |
| **user_id** | Task 38 | user_xyz789 |

### Log Level Selection
| Status Range | Log Level | Meaning |
|-------------|-----------|---------|
| **200-299** | INFO | Success |
| **300-399** | INFO | Redirection |
| **400-499** | WARNING | Client error |
| **500-599** | ERROR | Server error |

### Log Level Examples
```python
# 200 OK - INFO
logger.info("Request completed: GET /api/products/ - 200")

# 201 Created - INFO
logger.info("Request completed: POST /api/orders/ - 201")

# 404 Not Found - WARNING
logger.warning("Request error: GET /api/products/999/ - 404")

# 500 Internal Server Error - ERROR
logger.error("Request failed: POST /api/orders/ - 500")
```

### Expected Outcome
- _log_response method logs all response details
- Log level varies based on status code
- Duration rounded to 2 decimal places
- Structured format includes all context

### Verification Checklist
- [ ] _log_response method defined with 3 parameters
- [ ] log_data includes all required fields
- [ ] duration_ms rounded to 2 decimal places
- [ ] Log level selected based on status code
- [ ] logger.log() used with dynamic level
- [ ] _log_response called in __call__ after duration calculation
- [ ] Log message includes method, path, and status

---

## Task 36: Add Request ID Header

### Overview
Generate or extract unique request IDs to correlate logs and trace requests through the system. Add request ID to response headers.

### Dependencies
- Task 34: Log Request Details
- Task 35: Log Response Details

### Instructions

1. **Implement _get_request_id method**
   - Check for incoming X-Request-ID header
   - If not present, generate new UUID
   - Return request ID string

2. **Create request ID generator**
   - Use uuid.uuid4() for generation
   - Convert to string without dashes (optional)
   - Ensure uniqueness

3. **Store request ID on request**
   - Set request.request_id attribute
   - Call early in __call__ method
   - Before _log_request call

4. **Add request ID to response headers**
   - Set X-Request-ID header on response
   - Use same ID from request
   - Add before return statement

5. **Update imports**
   - Import uuid module

### Method Implementation

```python
# Add to imports at top of file
import uuid


def _get_request_id(self, request: HttpRequest) -> str:
    """
    Get or generate a unique request ID.
    
    First checks for X-Request-ID header from client/proxy.
    If not present, generates a new UUID.
    
    Args:
        request: The HTTP request
        
    Returns:
        Request ID string (UUID format)
    """
    # Check if request ID was provided by client or proxy
    request_id = request.META.get('HTTP_X_REQUEST_ID')
    
    if request_id:
        # Use provided request ID
        return request_id.strip()
    
    # Generate new request ID using UUID4
    return str(uuid.uuid4())
```

### Integration into __call__

```python
def __call__(self, request: HttpRequest) -> HttpResponse:
    """
    Process the request and response.
    
    Args:
        request: The HTTP request
        
    Returns:
        The HTTP response
    """
    # Skip excluded paths
    if not self._should_log(request):
        return self.get_response(request)
    
    # Generate or get request ID and store on request
    request_id = self._get_request_id(request)
    request.request_id = request_id
    
    # Capture request start time
    start_time = time.perf_counter()
    
    # Log request details
    self._log_request(request)
    
    # Get response
    response = self.get_response(request)
    
    # Capture request end time
    end_time = time.perf_counter()
    
    # Calculate duration in milliseconds
    duration_ms = (end_time - start_time) * 1000
    request.duration_ms = duration_ms
    
    # Log response details with duration
    self._log_response(request, response, duration_ms)
    
    # Add request ID to response headers for client tracking
    response['X-Request-ID'] = request_id
    
    return response
```

### Request ID Flow
```
Incoming Request
    │
    ├── Check for X-Request-ID header
    │   ├── Present: Use provided ID
    │   └── Not present: Generate UUID
    │
    ├── Store on request.request_id
    │
    ├── Use in all logs
    │
    └── Add to response header
        └── Client receives same ID
```

### Request ID Format
| Type | Format | Example |
|------|--------|---------|
| **UUID (default)** | xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx | 550e8400-e29b-41d4-a716-446655440000 |
| **UUID (compact)** | xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx | 550e8400e29b41d4a716446655440000 |
| **Custom** | Any string | req_abc123_xyz |

### Request ID Benefits
```python
# 1. Log Correlation
# All logs for a single request share the same request_id
[INFO] request_id=550e8400 Request started: GET /api/products/
[INFO] request_id=550e8400 Database query: SELECT * FROM products
[INFO] request_id=550e8400 Request completed: GET /api/products/ - 200

# 2. Distributed Tracing
# Same request_id can be passed to microservices
headers = {'X-Request-ID': request.request_id}
response = requests.get('https://inventory-service/check', headers=headers)

# 3. Client Tracking
# Client receives request_id in response and can use for support
# "I got error on request 550e8400-e29b-41d4-a716-446655440000"
```

### Expected Outcome
- Request IDs generated or extracted
- Stored on request object for logging
- Added to response headers
- All logs include request_id

### Verification Checklist
- [ ] uuid module imported
- [ ] _get_request_id checks HTTP_X_REQUEST_ID header
- [ ] _get_request_id generates UUID if no header present
- [ ] request_id stored on request object
- [ ] _get_request_id called early in __call__
- [ ] X-Request-ID header added to response
- [ ] request_id used in _log_request and _log_response

---

## Task 37: Add Tenant ID to Logs

### Overview
Enrich logs with tenant context by extracting tenant ID from the request and including it in response logs.

### Dependencies
- Task 35: Log Response Details
- SubPhase-06, Group-B: TenantMiddleware sets request.tenant

### Instructions

1. **Extract tenant ID from request**
   - Check if request.tenant exists
   - Access request.tenant.id if available
   - Handle case where tenant is None

2. **Add to _log_response log_data**
   - Add 'tenant_id' field
   - Use tenant ID or None
   - Include in structured logs

3. **Handle Super Admin case**
   - Super Admin may not have tenant context
   - Log None or 'system' for platform-wide access
   - Don't fail if tenant is missing

### Implementation

Update the _log_response method to include tenant_id:

```python
def _log_response(
    self, 
    request: HttpRequest, 
    response: HttpResponse, 
    duration_ms: float
) -> None:
    """
    Log response details with timing and context.
    
    Args:
        request: The HTTP request
        response: The HTTP response
        duration_ms: Request duration in milliseconds
    """
    log_data = {
        'event': 'request_completed',
        'request_id': getattr(request, 'request_id', None),
        'method': request.method,
        'path': request.path,
        'status': response.status_code,
        'duration_ms': round(duration_ms, 2),
        'client_ip': self._get_client_ip(request),
        # Add tenant ID from request.tenant
        'tenant_id': self._get_tenant_id(request),
    }
    
    # user_id will be added in Task 38
    
    # Choose log level based on status code
    if response.status_code >= 500:
        log_level = logging.ERROR
        message = f"Request failed: {request.method} {request.path} - {response.status_code}"
    elif response.status_code >= 400:
        log_level = logging.WARNING
        message = f"Request error: {request.method} {request.path} - {response.status_code}"
    else:
        log_level = logging.INFO
        message = f"Request completed: {request.method} {request.path} - {response.status_code}"
    
    logger.log(log_level, message, extra=log_data)


def _get_tenant_id(self, request: HttpRequest) -> str | None:
    """
    Extract tenant ID from request.
    
    Args:
        request: The HTTP request
        
    Returns:
        Tenant ID string or None
    """
    # Check if tenant exists on request (set by TenantMiddleware)
    if hasattr(request, 'tenant') and request.tenant:
        # Return tenant ID (could be UUID, int, or string depending on model)
        return str(request.tenant.id)
    
    # No tenant context (Super Admin or public endpoints)
    return None
```

### Tenant Context Sources
| Source | Set By | Available When |
|--------|--------|----------------|
| **request.tenant** | TenantMiddleware | Multi-tenant requests |
| **None** | N/A | Super Admin, public endpoints |

### Tenant ID Examples
```python
# Tenant context present
request.tenant.id = UUID('550e8400-e29b-41d4-a716-446655440000')
log_data['tenant_id'] = '550e8400-e29b-41d4-a716-446655440000'

# No tenant context (Super Admin)
request.tenant = None
log_data['tenant_id'] = None

# Public endpoint (no authentication)
# request.tenant not set
log_data['tenant_id'] = None
```

### Log Output with Tenant
```json
{
    "timestamp": "2026-01-23T10:30:45.123Z",
    "level": "INFO",
    "event": "request_completed",
    "request_id": "550e8400-e29b-41d4-a716-446655440000",
    "method": "GET",
    "path": "/api/products/",
    "status": 200,
    "duration_ms": 45.67,
    "tenant_id": "tenant_abc123",
    "client_ip": "192.168.1.100"
}
```

### Expected Outcome
- Tenant ID extracted from request
- Added to response logs
- Handles missing tenant gracefully
- Tenant context visible in all logs

### Verification Checklist
- [ ] _get_tenant_id method defined
- [ ] hasattr checks if tenant exists on request
- [ ] tenant.id converted to string
- [ ] Returns None if tenant not present
- [ ] tenant_id added to log_data in _log_response
- [ ] _get_tenant_id called in _log_response

---

## Task 38: Add User ID to Logs

### Overview
Enrich logs with user context by extracting user ID from the request and including it in response logs.

### Dependencies
- Task 37: Add Tenant ID to Logs
- Core: AuthenticationMiddleware sets request.user

### Instructions

1. **Extract user ID from request**
   - Check if request.user is authenticated
   - Access request.user.id if available
   - Handle anonymous users

2. **Add to _log_response log_data**
   - Add 'user_id' field
   - Use user ID or None
   - Include in structured logs

3. **Handle anonymous users**
   - Check request.user.is_authenticated
   - Log None for anonymous users
   - Don't fail if user is not authenticated

4. **Add user info to request logs (optional)**
   - Consider adding user to _log_request as well
   - Helpful for debugging authentication issues
   - Include authenticated status

### Implementation

Update the _log_response method to include user_id:

```python
def _log_response(
    self, 
    request: HttpRequest, 
    response: HttpResponse, 
    duration_ms: float
) -> None:
    """
    Log response details with timing and context.
    
    Args:
        request: The HTTP request
        response: The HTTP response
        duration_ms: Request duration in milliseconds
    """
    log_data = {
        'event': 'request_completed',
        'request_id': getattr(request, 'request_id', None),
        'method': request.method,
        'path': request.path,
        'status': response.status_code,
        'duration_ms': round(duration_ms, 2),
        'client_ip': self._get_client_ip(request),
        'tenant_id': self._get_tenant_id(request),
        # Add user ID from request.user
        'user_id': self._get_user_id(request),
    }
    
    # Choose log level based on status code
    if response.status_code >= 500:
        log_level = logging.ERROR
        message = f"Request failed: {request.method} {request.path} - {response.status_code}"
    elif response.status_code >= 400:
        log_level = logging.WARNING
        message = f"Request error: {request.method} {request.path} - {response.status_code}"
    else:
        log_level = logging.INFO
        message = f"Request completed: {request.method} {request.path} - {response.status_code}"
    
    logger.log(log_level, message, extra=log_data)


def _get_user_id(self, request: HttpRequest) -> str | None:
    """
    Extract user ID from request.
    
    Args:
        request: The HTTP request
        
    Returns:
        User ID string or None for anonymous users
    """
    # Check if user is authenticated
    if hasattr(request, 'user') and request.user.is_authenticated:
        # Return user ID (convert to string for consistency)
        return str(request.user.id)
    
    # Anonymous user or no authentication
    return None
```

### Optional: Add user to request logs

```python
def _log_request(self, request: HttpRequest) -> None:
    """
    Log request details.
    
    Args:
        request: The HTTP request
    """
    log_data = {
        'event': 'request_started',
        'request_id': getattr(request, 'request_id', None),
        'method': request.method,
        'path': request.path,
        'query_string': request.META.get('QUERY_STRING', ''),
        'client_ip': self._get_client_ip(request),
        'user_agent': self._get_user_agent(request),
        # Optional: Add user context to request logs
        'user_id': self._get_user_id(request),
        'authenticated': hasattr(request, 'user') and request.user.is_authenticated,
    }
    
    logger.info(
        f"Request started: {request.method} {request.path}",
        extra=log_data
    )
```

### User Context Sources
| Source | Set By | Available When |
|--------|--------|----------------|
| **request.user** | AuthenticationMiddleware | All requests |
| **is_authenticated** | Django auth | True for logged-in users |

### User ID Examples
```python
# Authenticated user
request.user.is_authenticated = True
request.user.id = 12345
log_data['user_id'] = '12345'

# Anonymous user
request.user.is_authenticated = False
log_data['user_id'] = None

# No authentication middleware (shouldn't happen)
# request.user not set
log_data['user_id'] = None
```

### Complete Log Output
```json
{
    "timestamp": "2026-01-23T10:30:45.123Z",
    "level": "INFO",
    "event": "request_completed",
    "request_id": "550e8400-e29b-41d4-a716-446655440000",
    "method": "POST",
    "path": "/api/orders/",
    "status": 201,
    "duration_ms": 78.45,
    "tenant_id": "tenant_abc123",
    "user_id": "12345",
    "client_ip": "192.168.1.100"
}
```

### Log Analysis Use Cases
```python
# Find all requests by a user
logs.filter(user_id='12345')

# Find all requests for a tenant
logs.filter(tenant_id='tenant_abc123')

# Find slow requests by a user
logs.filter(user_id='12345', duration_ms__gt=1000)

# Find errors for a tenant
logs.filter(tenant_id='tenant_abc123', level='ERROR')
```

### Expected Outcome
- User ID extracted from request
- Added to response logs (and optionally request logs)
- Handles anonymous users gracefully
- User context visible in all logs
- Complete context for debugging and analytics

### Verification Checklist
- [ ] _get_user_id method defined
- [ ] Checks request.user.is_authenticated
- [ ] user.id converted to string
- [ ] Returns None for anonymous users
- [ ] user_id added to log_data in _log_response
- [ ] _get_user_id called in _log_response
- [ ] (Optional) user_id added to _log_request

---

## Group C Next Steps

After completing Tasks 34-38, proceed to:
- **Next Document:** [03_Tasks-39-42_Log-Configuration.md](03_Tasks-39-42_Log-Configuration.md)
- Configure structured JSON log format
- Add optional request body logging
- Configure path exclusions
- Set up log formatters and handlers

---

## Notes for AI Agents

1. **Request ID:** Always generate UUID4, don't use sequential IDs
2. **X-Forwarded-For:** Always check this header first for real client IP
3. **Context Extraction:** Use hasattr and is_authenticated to avoid AttributeError
4. **Log Levels:** Match status code ranges (2xx=INFO, 4xx=WARNING, 5xx=ERROR)
5. **String Conversion:** Convert IDs to strings for consistent JSON serialization
6. **Optional Context:** Tenant and user may be None - handle gracefully
7. **Middleware Order:** Must run after AuthenticationMiddleware and TenantMiddleware
8. **Response Headers:** X-Request-ID helps clients correlate requests with logs
