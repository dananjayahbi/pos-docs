# Tasks 03-06: Base Middleware Class

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 06 - Core Middleware Stack  
> **Group:** A - Middleware Infrastructure  
> **Document:** 02 of 04  
> **Tasks Covered:** 03, 04, 05, 06

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-01-02_Middleware-Directory-Setup.md](01_Tasks-01-02_Middleware-Directory-Setup.md)
- **→ Next Document:** [03_Tasks-07-10_Utility-Functions.md](03_Tasks-07-10_Utility-Functions.md)

---

## Document Overview

This document covers the creation of the BaseMiddleware class, which serves as the foundation for all custom middleware in the application. The base class implements the Django middleware pattern with standardized hooks for request processing, response modification, and exception handling.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 03 | Create Base Middleware Class | Medium |
| 04 | Add process_request Method | Medium |
| 05 | Add process_response Method | Medium |
| 06 | Add process_exception Method | Medium |

---

## Task 03: Create Base Middleware Class

### Overview
Create the BaseMiddleware abstract base class that follows the Django middleware pattern. This class will serve as the parent class for all custom middleware implementations.

### Dependencies
- Task 01: Create middleware Directory
- Task 02: Create middleware __init__.py

### Instructions

1. **Create the base.py file**
   - Create file named `base.py` in the `apps/core/middleware/` directory
   - Add module docstring explaining purpose

2. **Add imports**
   - Import ABC and abstractmethod from abc module
   - Import logging for middleware logging
   - Import Any, Callable, Optional from typing

3. **Create logger instance**
   - Create module-level logger: `logger = logging.getLogger(__name__)`

4. **Define BaseMiddleware class**
   - Create class inheriting from ABC
   - Add class docstring explaining the middleware pattern
   - Document the three processing hooks

5. **Implement __init__ method**
   - Accept `get_response` callable as parameter
   - Store `get_response` as instance variable
   - Add type hints: `get_response: Callable`
   - Add docstring explaining initialization

6. **Implement __call__ method**
   - Accept `request` parameter
   - Implement middleware execution flow:
     - Call process_request (pre-processing)
     - If response returned, return early (short-circuit)
     - Call get_response (view processing) in try block
     - Catch exceptions and call process_exception
     - If exception handler returns response, return it
     - Otherwise re-raise exception
     - Call process_response (post-processing)
     - Return final response
   - Add type hints for request and response
   - Add comprehensive docstring

7. **Add middleware documentation comment**
   - Explain middleware execution order
   - Document when each hook is called
   - Provide example of inheritance pattern

### Class Structure

| Component | Purpose |
|-----------|---------|
| **__init__** | Initialize middleware with get_response callable |
| **__call__** | Main middleware execution logic |
| **process_request** | Hook for request pre-processing |
| **process_response** | Hook for response post-processing |
| **process_exception** | Hook for exception handling |

### Middleware Execution Flow
```
Request arrives
    │
    ▼
process_request() → return response? → Yes → return response
    │                                          (short-circuit)
    No
    │
    ▼
get_response(request) → View processes request
    │                   (May raise exception)
    │
    ├─ Exception? → Yes → process_exception()
    │                          │
    │                          ├─ return response? → Yes → goto post-processing
    │                          │
    │                          └─ return None? → re-raise exception
    │
    └─ No exception
    │
    ▼
process_response() → Modify response
    │
    ▼
return response
```

### Type Hints Reference
```python
from typing import Any, Callable, Optional
from django.http import HttpRequest, HttpResponse

get_response: Callable[[HttpRequest], HttpResponse]
request: HttpRequest
response: HttpResponse
exception: Exception
```

### Expected Outcome
```python
# apps/core/middleware/base.py

from abc import ABC
from typing import Any, Callable, Optional
import logging
from django.http import HttpRequest, HttpResponse

logger = logging.getLogger(__name__)


class BaseMiddleware(ABC):
    """
    Abstract base class for all middleware.
    
    Provides standardized hooks for request processing, response 
    modification, and exception handling. All custom middleware 
    should inherit from this class.
    
    Middleware Execution Order:
        1. process_request() - Pre-process request before view
        2. get_response() - View processes request
        3. process_exception() - Handle exceptions (if raised)
        4. process_response() - Post-process response after view
    """
    
    def __init__(self, get_response: Callable[[HttpRequest], HttpResponse]):
        """
        Initialize middleware with the get_response callable.
        
        Args:
            get_response: Django callable that processes the request
        """
        self.get_response = get_response
    
    def __call__(self, request: HttpRequest) -> HttpResponse:
        """
        Main middleware execution method.
        
        This method orchestrates the middleware processing flow:
        1. Calls process_request for pre-processing
        2. Invokes the view via get_response
        3. Handles exceptions through process_exception
        4. Calls process_response for post-processing
        
        Args:
            request: The incoming HTTP request
            
        Returns:
            The HTTP response
        """
        # (Implementation details in Task 04-06)
        pass
```

### Verification Checklist
- [ ] `base.py` file created in `apps/core/middleware/`
- [ ] BaseMiddleware class defined inheriting from ABC
- [ ] Imports include ABC, logging, typing hints
- [ ] Logger instance created at module level
- [ ] __init__ method accepts and stores get_response
- [ ] __call__ method skeleton created with docstring
- [ ] Class docstring explains middleware pattern
- [ ] Type hints added for all method parameters

---

## Task 04: Add process_request Method

### Overview
Implement the process_request hook that allows middleware to process requests before they reach the view. This method can return a response to short-circuit the request/response cycle.

### Dependencies
- Task 03: Create Base Middleware Class

### Instructions

1. **Define process_request method**
   - Method signature: `def process_request(self, request: HttpRequest) -> Optional[HttpResponse]`
   - Mark as abstract method (can be overridden but not required)
   - Add comprehensive docstring

2. **Document method behavior**
   - Explain when the method is called
   - Document return value semantics:
     - Return None to continue processing
     - Return HttpResponse to short-circuit
   - Provide usage examples in docstring

3. **Implement default behavior**
   - Return None by default
   - Add comment explaining this allows request to continue

4. **Add logging statement**
   - Log at debug level when method is called
   - Include middleware class name and request path

5. **Document common use cases**
   - Authentication checks
   - Rate limiting
   - Request validation
   - Adding request attributes
   - Early response for cached data

### Method Behavior

| Return Value | Behavior |
|--------------|----------|
| **None** | Continue to next middleware or view |
| **HttpResponse** | Short-circuit and skip view processing |

### Common Use Cases
- **Authentication:** Check if user is authenticated
- **Authorization:** Verify user has required permissions
- **Rate Limiting:** Block requests exceeding rate limits
- **Request Validation:** Validate request format/content
- **Request Enrichment:** Add attributes to request object
- **Caching:** Return cached response without hitting view

### Implementation Pattern
```python
def process_request(self, request: HttpRequest) -> Optional[HttpResponse]:
    """
    Process request before it reaches the view.
    
    This hook is called before the view is invoked. It can be used for:
    - Authentication and authorization checks
    - Rate limiting
    - Request validation
    - Adding attributes to the request object
    
    Args:
        request: The incoming HTTP request
        
    Returns:
        None to continue processing, or HttpResponse to short-circuit
        
    Example:
        class CustomMiddleware(BaseMiddleware):
            def process_request(self, request):
                if not request.user.is_authenticated:
                    return HttpResponse("Unauthorized", status=401)
                return None  # Continue to view
    """
    logger.debug(
        f"{self.__class__.__name__}.process_request called for {request.path}"
    )
    return None  # Default: continue processing
```

### Short-Circuit Example
```python
# Example: Authentication middleware
def process_request(self, request: HttpRequest) -> Optional[HttpResponse]:
    if not request.user.is_authenticated:
        # Short-circuit: return response without calling view
        return JsonResponse(
            {'error': 'Authentication required'}, 
            status=401
        )
    # Continue: call view
    return None
```

### Expected Outcome
```
apps/core/middleware/base.py updated with:
- process_request method definition
- Type hints: HttpRequest → Optional[HttpResponse]
- Default implementation returning None
- Comprehensive docstring with examples
- Debug logging statement
```

### Verification Checklist
- [ ] process_request method added to BaseMiddleware
- [ ] Method signature includes type hints
- [ ] Returns Optional[HttpResponse] (None by default)
- [ ] Docstring explains when method is called
- [ ] Docstring documents return value behavior
- [ ] Docstring includes usage example
- [ ] Debug logging statement included
- [ ] Common use cases documented in comments

---

## Task 05: Add process_response Method

### Overview
Implement the process_response hook that allows middleware to modify responses after the view has processed the request. This method always returns a response object.

### Dependencies
- Task 03: Create Base Middleware Class

### Instructions

1. **Define process_response method**
   - Method signature: `def process_response(self, request: HttpRequest, response: HttpResponse) -> HttpResponse`
   - Not marked as abstract (should be overridden)
   - Add comprehensive docstring

2. **Document method behavior**
   - Explain when the method is called
   - Document that it must always return a response
   - Provide usage examples in docstring

3. **Implement default behavior**
   - Return the response unchanged by default
   - Add comment explaining this passes response through

4. **Add logging statement**
   - Log at debug level when method is called
   - Include middleware class name, request path, and status code

5. **Document common use cases**
   - Adding response headers
   - Response compression
   - Response formatting
   - CORS headers
   - Security headers
   - Response timing headers

### Method Behavior

| Aspect | Details |
|--------|---------|
| **When Called** | After view processes request |
| **Must Return** | HttpResponse object (required) |
| **Can Modify** | Response headers, content, status |

### Common Use Cases
- **Headers:** Add CORS, security, or cache headers
- **Compression:** Compress response content
- **Formatting:** Convert response format
- **Logging:** Log response details
- **Timing:** Add timing headers
- **Cookies:** Set or modify cookies

### Implementation Pattern
```python
def process_response(
    self, 
    request: HttpRequest, 
    response: HttpResponse
) -> HttpResponse:
    """
    Process response after the view has been called.
    
    This hook is called after the view returns a response. It can be used for:
    - Adding response headers (CORS, security, caching)
    - Response compression or transformation
    - Logging response details
    - Setting cookies
    
    Args:
        request: The HTTP request that was processed
        response: The HTTP response from the view
        
    Returns:
        Modified or original HttpResponse (must return response)
        
    Example:
        class CustomMiddleware(BaseMiddleware):
            def process_response(self, request, response):
                # Add custom header
                response['X-Custom-Header'] = 'value'
                return response  # Must return response
    """
    logger.debug(
        f"{self.__class__.__name__}.process_response called for "
        f"{request.path} (status: {response.status_code})"
    )
    return response  # Default: return response unchanged
```

### Response Modification Examples

#### Adding Headers
```python
def process_response(self, request, response):
    # Add CORS headers
    response['Access-Control-Allow-Origin'] = '*'
    response['X-Frame-Options'] = 'DENY'
    response['X-Content-Type-Options'] = 'nosniff'
    return response
```

#### Adding Timing Header
```python
def process_response(self, request, response):
    # Add processing time header
    if hasattr(request, 'start_time'):
        processing_time = time.time() - request.start_time
        response['X-Processing-Time'] = f"{processing_time:.3f}s"
    return response
```

#### Conditional Modification
```python
def process_response(self, request, response):
    # Only modify JSON responses
    if 'application/json' in response.get('Content-Type', ''):
        # Add custom JSON header
        response['X-Response-Format'] = 'json'
    return response
```

### Expected Outcome
```
apps/core/middleware/base.py updated with:
- process_response method definition
- Type hints: (HttpRequest, HttpResponse) → HttpResponse
- Default implementation returning response unchanged
- Comprehensive docstring with examples
- Debug logging statement with status code
```

### Verification Checklist
- [ ] process_response method added to BaseMiddleware
- [ ] Method signature includes type hints
- [ ] Always returns HttpResponse (required)
- [ ] Docstring explains when method is called
- [ ] Docstring emphasizes must return response
- [ ] Docstring includes usage example
- [ ] Debug logging includes status code
- [ ] Common use cases documented in comments

---

## Task 06: Add process_exception Method

### Overview
Implement the process_exception hook that allows middleware to handle exceptions raised during request processing. This method can return a response or None to re-raise the exception.

### Dependencies
- Task 03: Create Base Middleware Class

### Instructions

1. **Define process_exception method**
   - Method signature: `def process_exception(self, request: HttpRequest, exception: Exception) -> Optional[HttpResponse]`
   - Not marked as abstract (optional override)
   - Add comprehensive docstring

2. **Document method behavior**
   - Explain when the method is called
   - Document return value semantics:
     - Return None to re-raise exception
     - Return HttpResponse to handle exception
   - Provide usage examples in docstring

3. **Implement default behavior**
   - Return None by default (re-raise exception)
   - Add comment explaining this allows exception to propagate

4. **Add logging statement**
   - Log at error level when method is called
   - Include middleware class name, exception type, and message
   - Include request path

5. **Document common use cases**
   - Custom error pages
   - Error logging and monitoring
   - Exception transformation
   - Fallback responses
   - Error reporting to external services

### Method Behavior

| Return Value | Behavior |
|--------------|----------|
| **None** | Re-raise exception (let Django handle it) |
| **HttpResponse** | Handle exception with custom response |

### Common Use Cases
- **Error Pages:** Return custom error page HTML
- **API Errors:** Return structured JSON error response
- **Logging:** Log exception details before re-raising
- **Monitoring:** Report errors to monitoring service
- **Fallback:** Return cached/default data on errors
- **User-Friendly:** Convert technical errors to user messages

### Implementation Pattern
```python
def process_exception(
    self, 
    request: HttpRequest, 
    exception: Exception
) -> Optional[HttpResponse]:
    """
    Handle exceptions raised during request processing.
    
    This hook is called when an exception is raised during view processing.
    It can be used for:
    - Custom error page responses
    - Exception logging and monitoring
    - Converting exceptions to user-friendly messages
    - Fallback responses
    
    Args:
        request: The HTTP request being processed
        exception: The exception that was raised
        
    Returns:
        None to re-raise exception, or HttpResponse to handle it
        
    Example:
        class CustomMiddleware(BaseMiddleware):
            def process_exception(self, request, exception):
                if isinstance(exception, CustomError):
                    # Handle custom errors
                    return JsonResponse(
                        {'error': str(exception)}, 
                        status=400
                    )
                # Let Django handle other exceptions
                return None
    """
    logger.error(
        f"{self.__class__.__name__}.process_exception: "
        f"{exception.__class__.__name__}: {str(exception)} "
        f"for {request.path}"
    )
    return None  # Default: re-raise exception
```

### Exception Handling Examples

#### Custom Error Response
```python
def process_exception(self, request, exception):
    if isinstance(exception, ValidationError):
        # Return custom JSON error
        return JsonResponse({
            'error': 'Validation failed',
            'details': exception.message_dict
        }, status=400)
    return None  # Let Django handle other errors
```

#### Logging and Re-raising
```python
def process_exception(self, request, exception):
    # Log all exceptions but let Django handle them
    logger.error(
        f"Exception in {request.path}",
        exc_info=True,
        extra={'user': request.user.id if request.user.is_authenticated else None}
    )
    return None  # Re-raise for Django's error handling
```

#### Fallback Response
```python
def process_exception(self, request, exception):
    if isinstance(exception, DatabaseError):
        # Return cached data or error message
        return JsonResponse({
            'error': 'Service temporarily unavailable',
            'message': 'Please try again later'
        }, status=503)
    return None
```

### Exception Flow
```
View raises exception
    │
    ▼
process_exception() called
    │
    ├─ return HttpResponse → return response (handled)
    │
    └─ return None → re-raise exception
                     │
                     ▼
                Django error handler
                (404, 500 pages)
```

### Expected Outcome
```
apps/core/middleware/base.py updated with:
- process_exception method definition
- Type hints: (HttpRequest, Exception) → Optional[HttpResponse]
- Default implementation returning None (re-raise)
- Comprehensive docstring with examples
- Error-level logging statement
```

### Verification Checklist
- [ ] process_exception method added to BaseMiddleware
- [ ] Method signature includes type hints
- [ ] Returns Optional[HttpResponse] (None by default)
- [ ] Docstring explains when method is called
- [ ] Docstring documents return value behavior
- [ ] Docstring includes usage example
- [ ] Error logging statement included
- [ ] Exception details logged (type and message)
- [ ] Common use cases documented in comments

---

## Complete Base Middleware Implementation

### Full Code Example
```python
"""
Base middleware class for all custom middleware.

This module provides the BaseMiddleware abstract base class that implements
the Django middleware pattern with standardized hooks for request processing,
response modification, and exception handling.
"""

from abc import ABC
from typing import Any, Callable, Optional
import logging
from django.http import HttpRequest, HttpResponse

logger = logging.getLogger(__name__)


class BaseMiddleware(ABC):
    """
    Abstract base class for all middleware.
    
    Provides standardized hooks for request processing, response 
    modification, and exception handling. All custom middleware 
    should inherit from this class.
    
    Middleware Execution Order:
        1. process_request() - Pre-process request before view
        2. get_response() - View processes request
        3. process_exception() - Handle exceptions (if raised)
        4. process_response() - Post-process response after view
    
    Usage:
        class CustomMiddleware(BaseMiddleware):
            def process_request(self, request):
                # Pre-process request
                request.custom_attr = "value"
                return None
            
            def process_response(self, request, response):
                # Post-process response
                response['X-Custom-Header'] = 'value'
                return response
    """
    
    def __init__(self, get_response: Callable[[HttpRequest], HttpResponse]):
        """
        Initialize middleware with the get_response callable.
        
        Args:
            get_response: Django callable that processes the request
        """
        self.get_response = get_response
    
    def __call__(self, request: HttpRequest) -> HttpResponse:
        """
        Main middleware execution method.
        
        This method orchestrates the middleware processing flow:
        1. Calls process_request for pre-processing
        2. Invokes the view via get_response
        3. Handles exceptions through process_exception
        4. Calls process_response for post-processing
        
        Args:
            request: The incoming HTTP request
            
        Returns:
            The HTTP response
        """
        # Pre-processing: call process_request hook
        response = self.process_request(request)
        if response:
            # Short-circuit: return early without calling view
            return response
        
        try:
            # Call the view
            response = self.get_response(request)
        except Exception as e:
            # Exception handling: call process_exception hook
            response = self.process_exception(request, e)
            if response:
                # Exception handled, skip to post-processing
                pass
            else:
                # Re-raise exception for Django to handle
                raise
        
        # Post-processing: call process_response hook
        response = self.process_response(request, response)
        return response
    
    def process_request(self, request: HttpRequest) -> Optional[HttpResponse]:
        """
        Process request before it reaches the view.
        
        This hook is called before the view is invoked. It can be used for:
        - Authentication and authorization checks
        - Rate limiting
        - Request validation
        - Adding attributes to the request object
        
        Args:
            request: The incoming HTTP request
            
        Returns:
            None to continue processing, or HttpResponse to short-circuit
            
        Example:
            class CustomMiddleware(BaseMiddleware):
                def process_request(self, request):
                    if not request.user.is_authenticated:
                        return HttpResponse("Unauthorized", status=401)
                    return None  # Continue to view
        """
        logger.debug(
            f"{self.__class__.__name__}.process_request called for {request.path}"
        )
        return None  # Default: continue processing
    
    def process_response(
        self, 
        request: HttpRequest, 
        response: HttpResponse
    ) -> HttpResponse:
        """
        Process response after the view has been called.
        
        This hook is called after the view returns a response. It can be used for:
        - Adding response headers (CORS, security, caching)
        - Response compression or transformation
        - Logging response details
        - Setting cookies
        
        Args:
            request: The HTTP request that was processed
            response: The HTTP response from the view
            
        Returns:
            Modified or original HttpResponse (must return response)
            
        Example:
            class CustomMiddleware(BaseMiddleware):
                def process_response(self, request, response):
                    # Add custom header
                    response['X-Custom-Header'] = 'value'
                    return response  # Must return response
        """
        logger.debug(
            f"{self.__class__.__name__}.process_response called for "
            f"{request.path} (status: {response.status_code})"
        )
        return response  # Default: return response unchanged
    
    def process_exception(
        self, 
        request: HttpRequest, 
        exception: Exception
    ) -> Optional[HttpResponse]:
        """
        Handle exceptions raised during request processing.
        
        This hook is called when an exception is raised during view processing.
        It can be used for:
        - Custom error page responses
        - Exception logging and monitoring
        - Converting exceptions to user-friendly messages
        - Fallback responses
        
        Args:
            request: The HTTP request being processed
            exception: The exception that was raised
            
        Returns:
            None to re-raise exception, or HttpResponse to handle it
            
        Example:
            class CustomMiddleware(BaseMiddleware):
                def process_exception(self, request, exception):
                    if isinstance(exception, CustomError):
                        # Handle custom errors
                        return JsonResponse(
                            {'error': str(exception)}, 
                            status=400
                        )
                    # Let Django handle other exceptions
                    return None
        """
        logger.error(
            f"{self.__class__.__name__}.process_exception: "
            f"{exception.__class__.__name__}: {str(exception)} "
            f"for {request.path}"
        )
        return None  # Default: re-raise exception
```

### File Structure After Tasks 03-06
```
backend/apps/core/middleware/
├── __init__.py              # Empty (from Task 02)
└── base.py                  # BaseMiddleware class (Tasks 03-06)
    ├── imports              # ABC, logging, typing, django.http
    ├── logger               # Module-level logger
    └── BaseMiddleware       # Abstract base class
        ├── __init__         # Store get_response callable
        ├── __call__         # Main middleware execution
        ├── process_request  # Request pre-processing hook
        ├── process_response # Response post-processing hook
        └── process_exception # Exception handling hook
```

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 03 | Create Base Middleware Class | BaseMiddleware class with __init__ and __call__ |
| 04 | Add process_request Method | Request pre-processing hook |
| 05 | Add process_response Method | Response post-processing hook |
| 06 | Add process_exception Method | Exception handling hook |

### BaseMiddleware Features
- **Standardized Pattern:** All middleware follows same structure
- **Three Hooks:** process_request, process_response, process_exception
- **Short-Circuit Support:** process_request can return early response
- **Exception Handling:** process_exception can handle or re-raise
- **Logging:** Debug/error logging for all hooks
- **Type Hints:** Full type annotations for IDE support
- **Documented:** Comprehensive docstrings with examples

### Middleware Execution Flow
```
Request
    ↓
process_request() → return response? → YES → Return (short-circuit)
    ↓ NO
get_response(request) → View
    ↓
Exception? → YES → process_exception() → return response? → YES → ↓
    ↓ NO                     ↓ NO (re-raise)
process_response()
    ↓
Response
```

### Next Steps
1. **Export BaseMiddleware** in `__init__.py` for easy imports
2. Proceed to [03_Tasks-07-10_Utility-Functions.md](03_Tasks-07-10_Utility-Functions.md) to create utility functions
3. All custom middleware will inherit from BaseMiddleware

---

## Notes for AI Agents

1. **Execution Order:** Tasks 03-06 should be executed sequentially
2. **ABC vs Abstract:** BaseMiddleware uses ABC but methods are not @abstractmethod (optional override)
3. **Type Hints:** Use Optional[HttpResponse] for methods that can return None
4. **Logging Levels:** Debug for request/response, error for exceptions
5. **Must Return Response:** process_response must always return HttpResponse
6. **Short-Circuit:** Only process_request can short-circuit (return response early)
7. **Re-raise:** process_exception returns None to re-raise exception
8. **Inheritance:** All custom middleware will inherit from this base class
