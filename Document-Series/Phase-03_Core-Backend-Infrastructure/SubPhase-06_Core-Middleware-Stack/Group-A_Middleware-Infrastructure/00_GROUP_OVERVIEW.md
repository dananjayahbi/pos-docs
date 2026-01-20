# Group A: Middleware Infrastructure

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 06 - Core Middleware Stack  
> **Group:** A of F  
> **Tasks Covered:** 01-14  
> **Group Goal:** Create base middleware infrastructure with utilities and configuration

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** None (First Group)
- **→ Next Group:** [Group-B_Tenant-Middleware](../Group-B_Tenant-Middleware/)

---

## Group Overview

This group establishes the middleware infrastructure including the base middleware class, utility functions, and configuration settings. All custom middleware classes will inherit from the base class.

### Key Components
- **middleware/ Directory:** Package for all middleware
- **BaseMiddleware Class:** Abstract base with hooks
- **Utility Functions:** get_client_ip, get_user_agent, generate_request_id
- **Middleware Settings:** Configuration values

### Middleware Hooks
| Method | Purpose |
|--------|---------|
| process_request | Called before view, can return response |
| process_response | Called after view, modifies response |
| process_exception | Called on exception, can return response |

---

## Documents in This Group

| Document # | Document Name | Tasks Covered | Description |
|------------|---------------|---------------|-------------|
| DOC-01 | Middleware Directory Setup | Tasks 01-02 | Create package structure |
| DOC-02 | Base Middleware Class | Tasks 03-06 | Abstract base with hooks |
| DOC-03 | Utility Functions | Tasks 07-10 | Helper utilities |
| DOC-04 | Settings & Configuration | Tasks 11-14 | Settings and docs |

---

## Task Summary

| Task # | Task Name | Key Points |
|--------|-----------|------------|
| 01 | Create middleware Directory | apps/core/middleware/ |
| 02 | Create middleware __init__.py | Export all middleware |
| 03 | Create Base Middleware Class | Abstract base class |
| 04 | Add process_request Method | Request hook |
| 05 | Add process_response Method | Response hook |
| 06 | Add process_exception Method | Exception hook |
| 07 | Create Middleware Utilities | Helper functions |
| 08 | Add get_client_ip Utility | Extract client IP |
| 09 | Add get_user_agent Utility | Extract user agent |
| 10 | Add generate_request_id | UUID request ID |
| 11 | Create Middleware Settings | settings/middleware.py |
| 12 | Define Middleware Constants | Configurable values |
| 13 | Document Middleware Order | Order documentation |
| 14 | Test Base Infrastructure | Verify setup |

---

## Execution Order

```
[Tasks 01-02: Directory Setup]
        │
        ▼
[Tasks 03-06: Base Middleware Class]
        │
        ▼
[Tasks 07-10: Utility Functions]
        │
        ▼
[Tasks 11-14: Settings & Tests]
```

---

## Expected Deliverables

### Code Files
```
backend/apps/core/
├── middleware/
│   ├── __init__.py
│   │   └── # Export all middleware classes
│   ├── base.py
│   │   └── class BaseMiddleware:
│   │       ├── __init__(get_response)
│   │       ├── __call__(request)
│   │       ├── process_request(request)
│   │       ├── process_response(request, response)
│   │       └── process_exception(request, exception)
│   └── utils.py
│       ├── get_client_ip(request)
│       ├── get_user_agent(request)
│       └── generate_request_id()
└── settings/
    └── middleware.py
        └── MIDDLEWARE_CONFIG = {...}
```

### Base Middleware Class
```python
from abc import ABC, abstractmethod

class BaseMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
    
    def __call__(self, request):
        # Pre-processing
        response = self.process_request(request)
        if response:
            return response
        
        try:
            response = self.get_response(request)
        except Exception as e:
            response = self.process_exception(request, e)
            if response:
                return response
            raise
        
        # Post-processing
        response = self.process_response(request, response)
        return response
    
    def process_request(self, request):
        """Override to process request before view."""
        return None
    
    def process_response(self, request, response):
        """Override to process response after view."""
        return response
    
    def process_exception(self, request, exception):
        """Override to handle exceptions."""
        return None
```

### Utility Functions
```python
import uuid

def get_client_ip(request):
    """Extract client IP from request headers."""
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        return x_forwarded_for.split(',')[0].strip()
    return request.META.get('REMOTE_ADDR')

def get_user_agent(request):
    """Extract user agent from request."""
    return request.META.get('HTTP_USER_AGENT', '')

def generate_request_id():
    """Generate unique request ID."""
    return str(uuid.uuid4())
```

---

## Notes for AI Agents

1. **Django Style:** Use Django's middleware pattern
2. **Get Response:** Store get_response in __init__
3. **Return None:** process_request returns None to continue
4. **Return Response:** Return response to short-circuit
5. **Exception Handling:** process_exception can return response
6. **Client IP:** Check X-Forwarded-For for proxies
7. **UUID:** Use uuid4 for request IDs
