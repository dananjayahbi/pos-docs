# Tasks 29-33: Logging Middleware Setup

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 06 - Core Middleware Stack  
> **Group:** C - Request Logging Middleware  
> **Document:** 01 of 04  
> **Tasks Covered:** 29, 30, 31, 32, 33

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Group:** [Group-B_Tenant-Middleware](../Group-B_Tenant-Middleware/)
- **→ Next Document:** [02_Tasks-34-38_Request-Response-Logging.md](02_Tasks-34-38_Request-Response-Logging.md)

---

## Document Overview

This document covers the initial setup of the RequestLoggingMiddleware, including class creation, timing capture, and duration calculation. This middleware logs all HTTP requests and responses with timing information.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 29 | Create RequestLoggingMiddleware File | Simple |
| 30 | Create RequestLoggingMiddleware Class | Simple |
| 31 | Add Request Start Time | Simple |
| 32 | Add Request End Time | Simple |
| 33 | Calculate Response Duration | Simple |

---

## Task 29: Create RequestLoggingMiddleware File

### Overview
Create the logging.py file in the middleware directory to house the RequestLoggingMiddleware class.

### Dependencies
- SubPhase-06: Middleware directory exists
- SubPhase-03: Core middleware infrastructure set up

### Instructions

1. **Navigate to middleware directory**
   - Open `backend/apps/core/middleware/`
   - Verify directory exists (should be created in Group A)

2. **Create logging.py file**
   - Create new file: `logging.py`
   - Add file-level docstring
   - Document middleware purpose

3. **Add required imports**
   - Import logging module
   - Import time module for timing
   - Add import placeholder for utilities

4. **Initialize module logger**
   - Create logger for 'api.request' namespace
   - Will be configured in settings later

### File Structure

```python
"""
Request Logging Middleware

This middleware logs all HTTP requests and responses with timing information,
tenant context, and user context. It generates unique request IDs and adds
them to both logs and response headers.

Features:
- Request/response timing
- Unique request ID generation
- Tenant and user context enrichment
- Structured JSON logging
- Path-based exclusions (health checks, static files)
"""

import logging
import time
from typing import Callable

from django.http import HttpRequest, HttpResponse

# Logger for API requests
logger = logging.getLogger('api.request')


# Middleware class will be added in next task
```

### Module Structure
| Component | Purpose |
|-----------|---------|
| **Docstring** | Document middleware features |
| **Imports** | Standard library and Django imports |
| **Logger** | Module-level logger instance |
| **Middleware** | RequestLoggingMiddleware class |

### Expected Outcome
- logging.py file created in middleware directory
- Required imports added
- Logger initialized for 'api.request'
- Ready for middleware class definition

### Verification Checklist
- [ ] File created at `backend/apps/core/middleware/logging.py`
- [ ] Module docstring documents all features
- [ ] logging and time modules imported
- [ ] Django HttpRequest and HttpResponse imported
- [ ] Logger initialized with 'api.request' namespace

---

## Task 30: Create RequestLoggingMiddleware Class

### Overview
Define the RequestLoggingMiddleware class with __init__ and __call__ methods to process requests and responses.

### Dependencies
- Task 29: Create RequestLoggingMiddleware File

### Instructions

1. **Define the RequestLoggingMiddleware class**
   - Create class below logger initialization
   - Add comprehensive class docstring
   - Document timing and context features

2. **Add __init__ method**
   - Accept get_response callable
   - Store as instance variable
   - Standard middleware pattern

3. **Add __call__ method**
   - Accept request parameter
   - Call get_response to get response
   - Return response (timing logic added later)

4. **Add class-level constants**
   - Define EXCLUDED_PATHS list
   - List paths to skip logging

5. **Add helper method stubs**
   - _should_log(request) - Check if path should be logged
   - _get_request_id(request) - Get or generate request ID
   - Additional helpers will be added in next documents

### Class Definition Structure

```python
class RequestLoggingMiddleware:
    """
    Middleware for logging HTTP requests and responses.
    
    This middleware:
    - Captures request/response timing
    - Generates unique request IDs
    - Enriches logs with tenant and user context
    - Logs in structured JSON format
    - Excludes health checks and static files
    
    Placement:
    - After AuthenticationMiddleware (needs user)
    - After TenantMiddleware (needs tenant)
    - Before application-specific middleware
    
    Configuration:
    - Excluded paths: /health/, /ready/, /static/, /media/
    - Log level: INFO
    - Format: JSON
    """
    
    # Paths that should not be logged
    EXCLUDED_PATHS = [
        '/health/',
        '/ready/',
        '/static/',
        '/media/',
    ]
    
    def __init__(self, get_response: Callable):
        """
        Initialize the middleware.
        
        Args:
            get_response: Callable that takes a request and returns a response
        """
        self.get_response = get_response
    
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
        
        # Timing and logging will be added in next tasks
        
        # Get response
        response = self.get_response(request)
        
        return response
    
    def _should_log(self, request: HttpRequest) -> bool:
        """
        Check if the request path should be logged.
        
        Args:
            request: The HTTP request
            
        Returns:
            True if should log, False if should skip
        """
        return not any(
            request.path.startswith(path) 
            for path in self.EXCLUDED_PATHS
        )
    
    def _get_request_id(self, request: HttpRequest) -> str:
        """
        Get or generate a request ID.
        
        Args:
            request: The HTTP request
            
        Returns:
            Request ID string
        """
        # Will be implemented in Task 36
        pass
```

### Middleware Flow
```
Request arrives
    │
    ├── Check if should log
    │   ├── YES: Continue
    │   └── NO: Skip to get_response
    │
    ├── [Timing logic - Task 31]
    │
    ├── Get response
    │
    ├── [Calculate duration - Task 33]
    │
    └── Return response
```

### Path Exclusion Logic
| Path Pattern | Reason | Example |
|-------------|--------|---------|
| **/health/** | Health checks | /health/liveness/ |
| **/ready/** | Readiness checks | /ready/ |
| **/static/** | Static files | /static/css/main.css |
| **/media/** | Media files | /media/uploads/img.jpg |

### Expected Outcome
- RequestLoggingMiddleware class defined
- __init__ and __call__ methods implemented
- Path exclusion logic working
- Ready for timing implementation

### Verification Checklist
- [ ] Class RequestLoggingMiddleware defined
- [ ] Class docstring documents all features
- [ ] EXCLUDED_PATHS list defined with 4 paths
- [ ] __init__ accepts and stores get_response
- [ ] __call__ checks _should_log before processing
- [ ] _should_log method uses any() with startswith()
- [ ] _get_request_id stub created (returns pass)

---

## Task 31: Add Request Start Time

### Overview
Capture the request start time using high-precision timing to accurately measure request duration.

### Dependencies
- Task 30: Create RequestLoggingMiddleware Class

### Instructions

1. **Import time.perf_counter**
   - Already imported in Task 29
   - Use perf_counter() for high precision
   - Better than time.time() for duration measurement

2. **Capture start time in __call__**
   - Call immediately after _should_log check
   - Store in local variable start_time
   - Use time.perf_counter() for precision

3. **Add timing comment**
   - Document why perf_counter is used
   - Note that it's monotonic (won't go backwards)

### Implementation

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
    
    # Capture request start time using high-precision monotonic clock
    # perf_counter() is better than time() for measuring durations
    start_time = time.perf_counter()
    
    # Get response
    response = self.get_response(request)
    
    return response
```

### Timing Method Comparison
| Method | Precision | Monotonic | Use Case |
|--------|-----------|-----------|----------|
| **time.time()** | Seconds | No | Wall clock time |
| **time.perf_counter()** | Nanoseconds | Yes | Duration measurement |
| **time.monotonic()** | Seconds | Yes | Timeouts |

### Why perf_counter()?
```python
# perf_counter() advantages:
# 1. High precision (nanoseconds)
# 2. Monotonic (never goes backwards)
# 3. Not affected by system clock changes
# 4. Best for measuring elapsed time

# Example:
start = time.perf_counter()
# ... do work ...
duration = time.perf_counter() - start
```

### Expected Outcome
- Start time captured at beginning of request
- Uses perf_counter() for accuracy
- Ready for end time and duration calculation

### Verification Checklist
- [ ] start_time variable captures time.perf_counter()
- [ ] Captured immediately after _should_log check
- [ ] Happens before self.get_response(request)
- [ ] Comment explains why perf_counter is used
- [ ] Variable name is clear and descriptive

---

## Task 32: Add Request End Time

### Overview
Capture the request end time after the response is generated to calculate the total request duration.

### Dependencies
- Task 31: Add Request Start Time

### Instructions

1. **Capture end time after response**
   - Store immediately after get_response returns
   - Use time.perf_counter() again
   - Store in local variable end_time

2. **Position correctly**
   - Must be after self.get_response(request)
   - Before any response modification
   - Before return statement

3. **Add explanatory comment**
   - Document that this is end time
   - Note it includes full request processing

### Implementation

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
    
    # Capture request start time using high-precision monotonic clock
    start_time = time.perf_counter()
    
    # Get response - this includes all view processing and downstream middleware
    response = self.get_response(request)
    
    # Capture request end time
    end_time = time.perf_counter()
    
    return response
```

### Timing Capture Points
```
Request Start (start_time)
    │
    ├── Downstream middleware
    ├── View function processing
    ├── Database queries
    ├── Template rendering
    ├── Upstream middleware
    │
Request End (end_time)
```

### What's Measured
| Component | Included? | Timing |
|-----------|-----------|--------|
| **View execution** | Yes | Full processing |
| **Database queries** | Yes | All DB time |
| **Template rendering** | Yes | Render time |
| **Downstream middleware** | Yes | Before view |
| **Upstream middleware** | Yes | After view |
| **Network transmission** | No | After middleware |

### Expected Outcome
- End time captured after response generation
- Positioned correctly in flow
- Ready for duration calculation

### Verification Checklist
- [ ] end_time captures time.perf_counter()
- [ ] Captured immediately after get_response
- [ ] Happens before any response modification
- [ ] Variable name matches start_time pattern
- [ ] Comment explains end time capture

---

## Task 33: Calculate Response Duration

### Overview
Calculate the request duration in milliseconds by subtracting start time from end time and converting to milliseconds.

### Dependencies
- Task 31: Add Request Start Time
- Task 32: Add Request End Time

### Instructions

1. **Calculate duration**
   - Subtract start_time from end_time
   - Result is in seconds (float)
   - Convert to milliseconds (* 1000)

2. **Store in variable**
   - Name: duration_ms
   - Type: float
   - Unit: milliseconds

3. **Add to request object**
   - Store on request for logging
   - request.duration_ms = duration_ms
   - Makes it available to views/middleware

4. **Add explanatory comment**
   - Document calculation
   - Note millisecond conversion
   - Explain precision

### Implementation

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
    
    # Capture request start time using high-precision monotonic clock
    start_time = time.perf_counter()
    
    # Get response - this includes all view processing and downstream middleware
    response = self.get_response(request)
    
    # Capture request end time
    end_time = time.perf_counter()
    
    # Calculate duration in milliseconds
    # perf_counter() returns seconds, so multiply by 1000 for milliseconds
    duration_ms = (end_time - start_time) * 1000
    
    # Store duration on request for logging and debugging
    request.duration_ms = duration_ms
    
    return response
```

### Duration Calculation
```python
# Example timing:
start_time = 12345.678901234  # seconds (high precision)
end_time   = 12345.723456789  # seconds

# Calculate:
duration_seconds = end_time - start_time
# = 0.044555555 seconds

duration_ms = duration_seconds * 1000
# = 44.555555 milliseconds

# Round for logging:
rounded_ms = round(duration_ms, 2)
# = 44.56 ms
```

### Duration Ranges
| Range | Typical Cause | Action |
|-------|---------------|--------|
| **< 10ms** | Simple queries | Normal |
| **10-100ms** | Multiple queries | Monitor |
| **100-500ms** | Complex processing | Optimize |
| **500ms-1s** | Heavy computation | Review |
| **> 1s** | Problem | Alert |

### Precision Considerations
```python
# perf_counter() precision varies by platform:
# - Windows: ~100ns
# - Linux: ~1ns
# - macOS: ~1ns

# For logging, round to 2 decimal places:
logged_duration = round(duration_ms, 2)

# This gives us:
# - 44.56 ms (readable)
# - Not 44.555555555 ms (too precise)
```

### Expected Outcome
- Duration calculated in milliseconds
- Stored on request object
- Ready for logging in next document
- Precision appropriate for logging

### Verification Checklist
- [ ] duration_ms = (end_time - start_time) * 1000
- [ ] Calculation happens after end_time capture
- [ ] Result stored on request object (request.duration_ms)
- [ ] Comment explains millisecond conversion
- [ ] Variable name clearly indicates milliseconds unit

---

## Group C Next Steps

After completing Tasks 29-33, proceed to:
- **Next Document:** [02_Tasks-34-38_Request-Response-Logging.md](02_Tasks-34-38_Request-Response-Logging.md)
- Implement request logging with details
- Add response logging with duration
- Add request ID generation and headers
- Enrich logs with tenant and user context

---

## Notes for AI Agents

1. **Timing Precision:** Always use time.perf_counter() for duration measurement, not time.time()
2. **Path Exclusion:** Check exclusion before any timing to avoid overhead
3. **Middleware Order:** Must run after AuthenticationMiddleware and TenantMiddleware
4. **Request Storage:** Store duration on request object for debugging and other middleware
5. **Unit Consistency:** Always use milliseconds for duration, not seconds
6. **Performance:** Minimal overhead - only timing capture for excluded paths
7. **Type Hints:** Use typing module for better IDE support and documentation
8. **Monotonic Clock:** perf_counter() is monotonic - won't go backwards on clock changes
