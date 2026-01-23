# Tasks 61-66: Error Logging Module

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 07 - Exception Handling  
> **Group:** E - Logging & Sentry  
> **Document:** 01 of 03  
> **Tasks Covered:** 61, 62, 63, 64, 65, 66

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Group:** [../Group-D_Error-Response-Formatting/](../Group-D_Error-Response-Formatting/)
- **→ Next Document:** [02_Tasks-67-70_Sentry-Installation.md](02_Tasks-67-70_Sentry-Installation.md)

---

## Document Overview

This document covers the creation of error logging utilities with context enrichment.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 61 | Create error_logging.py | Simple |
| 62 | Create log_exception Function | Medium |
| 63 | Add Request Context | Medium |
| 64 | Add User Context | Medium |
| 65 | Add Tenant Context | Medium |
| 66 | Add Stack Trace | Simple |

---

## Implementation

Create `backend/apps/core/exceptions/logging.py`:

```python
"""
Error Logging Utilities

This module provides utilities for logging exceptions with context enrichment.
"""

import logging
import traceback
from typing import Any, Dict, Optional

from django.http import HttpRequest

logger = logging.getLogger(__name__)


def log_exception(
    exception: Exception,
    request: Optional[HttpRequest] = None,
    level: str = 'ERROR',
    extra_context: Optional[Dict[str, Any]] = None
) -> None:
    """
    Log exception with enriched context.
    
    Args:
        exception: The exception to log
        request: Django request object (optional)
        level: Log level ('ERROR', 'WARNING', 'INFO')
        extra_context: Additional context to include
    """
    context = {
        'exception_type': type(exception).__name__,
        'exception_message': str(exception),
    }
    
    # Task 63: Add Request Context
    if request:
        context.update({
            'request_id': getattr(request, 'request_id', None),
            'path': request.path,
            'method': request.method,
            'query_params': dict(request.GET),
            'ip_address': get_client_ip(request),
        })
        
        # Task 64: Add User Context
        if hasattr(request, 'user') and request.user.is_authenticated:
            context.update({
                'user_id': request.user.id,
                'user_email': getattr(request.user, 'email', None),
                'username': request.user.username,
            })
        
        # Task 65: Add Tenant Context
        if hasattr(request, 'tenant'):
            context.update({
                'tenant_id': request.tenant.id,
                'tenant_domain': request.tenant.domain,
            })
    
    # Task 66: Add Stack Trace
    context['stack_trace'] = traceback.format_exc()
    
    # Add extra context
    if extra_context:
        context.update(extra_context)
    
    # Log at specified level
    log_func = getattr(logger, level.lower(), logger.error)
    log_func(
        f"Exception: {context['exception_type']}",
        extra=context,
        exc_info=True
    )


def get_client_ip(request: HttpRequest) -> str:
    """
    Get client IP address from request.
    
    Args:
        request: Django request object
        
    Returns:
        Client IP address
    """
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR', '')
    return ip


def log_business_rule_violation(
    rule_name: str,
    details: Dict[str, Any],
    request: Optional[HttpRequest] = None
) -> None:
    """
    Log business rule violation.
    
    Args:
        rule_name: Name of violated rule
        details: Violation details
        request: Django request object
    """
    context = {
        'rule_name': rule_name,
        'details': details,
    }
    
    if request:
        context.update({
            'request_id': getattr(request, 'request_id', None),
            'user_id': request.user.id if hasattr(request, 'user') and request.user.is_authenticated else None,
        })
    
    logger.warning(
        f"Business rule violation: {rule_name}",
        extra=context
    )
```

---

## Usage Examples

```python
from apps.core.exceptions.logging import log_exception, log_business_rule_violation

# Log exception with request context
try:
    # ... some operation ...
    pass
except Exception as e:
    log_exception(e, request=request)

# Log business rule violation
log_business_rule_violation(
    rule_name='insufficient_stock',
    details={'product_id': 123, 'requested': 10, 'available': 5},
    request=request
)
```

---

## Notes for AI Agents

- **Context Enrichment:** Include request, user, tenant
- **Stack Traces:** Always include for server errors
- **Log Levels:** ERROR for 5xx, WARNING for business rules
- **Client IP:** Extract from X-Forwarded-For or REMOTE_ADDR
- **Structured Logging:** Use extra dict for parsing
