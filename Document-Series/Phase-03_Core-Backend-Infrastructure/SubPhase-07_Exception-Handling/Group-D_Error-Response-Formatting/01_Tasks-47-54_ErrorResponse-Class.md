# Tasks 47-54: ErrorResponse Class

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 07 - Exception Handling  
> **Group:** D - Error Response Formatting  
> **Document:** 01 of 03  
> **Tasks Covered:** 47, 48, 49, 50, 51, 52, 53, 54

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Group:** [../Group-C_Global-Exception-Handler/](../Group-C_Global-Exception-Handler/)
- **→ Next Document:** [02_Tasks-55-56_Validation-Formatting.md](02_Tasks-55-56_Validation-Formatting.md)

---

## Document Overview

This document covers the creation of the ErrorResponse class for standardizing error response format.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 47 | Create response.py File | Simple |
| 48 | Create ErrorResponse Class | Medium |
| 49 | Add error_code Field | Simple |
| 50 | Add message Field | Simple |
| 51 | Add details Field | Simple |
| 52 | Add request_id Field | Simple |
| 53 | Add timestamp Field | Simple |
| 54 | Add path Field | Simple |

---

## Implementation

Create `backend/apps/core/exceptions/response.py`:

```python
"""
Error Response Formatting

This module provides the ErrorResponse class for standardizing error responses.
"""

from datetime import datetime
from typing import Any, Dict, Optional
from uuid import uuid4

from rest_framework.response import Response


class ErrorResponse:
    """
    Builder class for standardized error responses.
    
    All error responses follow the format:
    {
        "error": {
            "code": "ERROR_CODE",
            "message": "Human readable message",
            "details": {...},
            "request_id": "uuid",
            "timestamp": "ISO8601",
            "path": "/api/endpoint/"
        }
    }
    """
    
    def __init__(
        self,
        error_code: str,
        message: str,
        status_code: int,
        details: Optional[Dict[str, Any]] = None,
        request_id: Optional[str] = None,
        path: Optional[str] = None,
    ):
        """
        Initialize error response.
        
        Args:
            error_code: Unique error identifier
            message: Human-readable error message
            status_code: HTTP status code
            details: Additional error details
            request_id: Request tracking ID
            path: Request path
        """
        self.error_code = error_code
        self.message = message
        self.status_code = status_code
        self.details = details or {}
        self.request_id = request_id or str(uuid4())
        self.timestamp = datetime.utcnow().isoformat() + 'Z'
        self.path = path or ''
    
    def to_dict(self) -> Dict[str, Any]:
        """
        Convert to dictionary format.
        
        Returns:
            Error response as dict
        """
        return {
            'error': {
                'code': self.error_code,
                'message': self.message,
                'details': self.details,
                'request_id': self.request_id,
                'timestamp': self.timestamp,
                'path': self.path
            }
        }
    
    def to_response(self) -> Response:
        """
        Convert to DRF Response object.
        
        Returns:
            DRF Response with error data
        """
        return Response(self.to_dict(), status=self.status_code)
```

---

## Usage Example

```python
from apps.core.exceptions.response import ErrorResponse

# Create error response
error = ErrorResponse(
    error_code='VALIDATION_ERROR',
    message='Invalid input',
    status_code=400,
    details={'email': ['Invalid format']},
    request_id='abc-123',
    path='/api/users/'
)

# Get as dict
data = error.to_dict()

# Get as Response
response = error.to_response()
```

---

## Notes for AI Agents

- **Standard Format:** All errors use same structure
- **Auto Timestamp:** Generated automatically
- **Auto Request ID:** Generated if not provided
- **Immutable:** Once created, don't modify
- **Two Outputs:** to_dict() and to_response()
