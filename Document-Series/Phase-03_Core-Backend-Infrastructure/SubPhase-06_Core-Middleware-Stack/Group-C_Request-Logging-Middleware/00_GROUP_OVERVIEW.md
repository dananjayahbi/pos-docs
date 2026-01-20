# Group C: Request Logging Middleware

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 06 - Core Middleware Stack  
> **Group:** C of F  
> **Tasks Covered:** 29-44  
> **Group Goal:** Implement request/response logging with timing, context, and structured format

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-B_Tenant-Middleware](../Group-B_Tenant-Middleware/)
- **→ Next Group:** [Group-D_Security-Headers-Middleware](../Group-D_Security-Headers-Middleware/)

---

## Group Overview

This group creates the RequestLoggingMiddleware that logs request and response details with timing information, tenant/user context, and structured logging format. It includes request ID generation and path exclusions.

### Key Components
- **RequestLoggingMiddleware:** Main logging middleware
- **Timing Capture:** Request duration calculation
- **Context Enrichment:** Tenant, user, request ID
- **Structured Logging:** JSON-formatted logs
- **Path Exclusions:** Skip health checks, static files

### Log Fields
| Field | Description |
|-------|-------------|
| request_id | Unique request identifier |
| method | HTTP method |
| path | Request path |
| status | Response status code |
| duration_ms | Request duration in milliseconds |
| tenant_id | Current tenant ID |
| user_id | Authenticated user ID |
| client_ip | Client IP address |

---

## Documents in This Group

| Document # | Document Name | Tasks Covered | Description |
|------------|---------------|---------------|-------------|
| DOC-01 | Logging Middleware Setup | Tasks 29-33 | Class and timing capture |
| DOC-02 | Request/Response Logging | Tasks 34-38 | Log details with context |
| DOC-03 | Log Configuration | Tasks 39-42 | Format, body, exclusions |
| DOC-04 | Registration & Testing | Tasks 43-44 | Add to settings and test |

---

## Task Summary

| Task # | Task Name | Key Points |
|--------|-----------|------------|
| 29 | Create RequestLoggingMiddleware File | logging.py |
| 30 | Create RequestLoggingMiddleware Class | Main class |
| 31 | Add Request Start Time | Capture start time |
| 32 | Add Request End Time | Capture end time |
| 33 | Calculate Response Duration | Request duration |
| 34 | Log Request Details | Method, path, user |
| 35 | Log Response Details | Status, duration |
| 36 | Add Request ID Header | X-Request-ID |
| 37 | Add Tenant ID to Logs | Tenant context |
| 38 | Add User ID to Logs | User context |
| 39 | Configure Log Format | Structured logging |
| 40 | Add Request Body Logging | Optional, sanitized |
| 41 | Exclude Health Check | Skip /health/ |
| 42 | Exclude Static Files | Skip /static/ |
| 43 | Register in MIDDLEWARE | Add to settings |
| 44 | Test Request Logging | Logging tests |

---

## Execution Order

```
[Tasks 29-33: Setup & Timing]
        │
        ▼
[Tasks 34-38: Logging Details]
        │
        ▼
[Tasks 39-42: Configuration]
        │
        ▼
[Tasks 43-44: Registration & Tests]
```

---

## Expected Deliverables

### Code Files
```
backend/apps/core/
├── middleware/
│   └── logging.py
│       └── class RequestLoggingMiddleware:
│           ├── __init__(get_response)
│           ├── __call__(request)
│           ├── _should_log(request)
│           ├── _get_request_id(request)
│           ├── _log_request(request)
│           ├── _log_response(request, response, duration)
│           └── _sanitize_body(body)
└── tests/
    └── test_logging_middleware.py
```

### Request Logging Middleware
```python
import logging
import time
from .utils import get_client_ip, get_user_agent, generate_request_id

logger = logging.getLogger('api.request')

class RequestLoggingMiddleware:
    EXCLUDED_PATHS = ['/health/', '/ready/', '/static/', '/media/']
    
    def __init__(self, get_response):
        self.get_response = get_response
    
    def __call__(self, request):
        # Skip excluded paths
        if not self._should_log(request):
            return self.get_response(request)
        
        # Generate/get request ID
        request_id = self._get_request_id(request)
        request.request_id = request_id
        
        # Capture start time
        start_time = time.perf_counter()
        
        # Log request
        self._log_request(request)
        
        # Get response
        response = self.get_response(request)
        
        # Calculate duration
        duration_ms = (time.perf_counter() - start_time) * 1000
        
        # Log response
        self._log_response(request, response, duration_ms)
        
        # Add request ID to response
        response['X-Request-ID'] = request_id
        
        return response
    
    def _should_log(self, request):
        return not any(request.path.startswith(p) for p in self.EXCLUDED_PATHS)
    
    def _get_request_id(self, request):
        return request.META.get('HTTP_X_REQUEST_ID') or generate_request_id()
    
    def _log_request(self, request):
        log_data = {
            'event': 'request_started',
            'request_id': request.request_id,
            'method': request.method,
            'path': request.path,
            'client_ip': get_client_ip(request),
            'user_agent': get_user_agent(request),
        }
        logger.info(f"Request started", extra=log_data)
    
    def _log_response(self, request, response, duration_ms):
        log_data = {
            'event': 'request_completed',
            'request_id': request.request_id,
            'method': request.method,
            'path': request.path,
            'status': response.status_code,
            'duration_ms': round(duration_ms, 2),
            'tenant_id': getattr(request, 'tenant', {}).id if hasattr(request, 'tenant') else None,
            'user_id': request.user.id if request.user.is_authenticated else None,
        }
        logger.info(f"Request completed", extra=log_data)
```

### Log Format Configuration
```python
# settings/logging.py
LOGGING = {
    'formatters': {
        'json': {
            '()': 'pythonjsonlogger.jsonlogger.JsonFormatter',
            'format': '%(timestamp)s %(level)s %(name)s %(message)s',
        },
    },
    'handlers': {
        'api': {
            'class': 'logging.StreamHandler',
            'formatter': 'json',
        },
    },
    'loggers': {
        'api.request': {
            'handlers': ['api'],
            'level': 'INFO',
        },
    },
}
```

---

## Notes for AI Agents

1. **Structured Logging:** Use JSON format for parsing
2. **Request ID:** Generate or accept from header
3. **Performance:** Use time.perf_counter() for accuracy
4. **Path Exclusions:** Skip health checks, static files
5. **Body Sanitization:** Never log passwords/tokens
6. **Tenant Context:** Log tenant_id after TenantMiddleware
7. **User Context:** Log user_id after AuthenticationMiddleware
8. **After Auth:** Place after AuthenticationMiddleware in stack
