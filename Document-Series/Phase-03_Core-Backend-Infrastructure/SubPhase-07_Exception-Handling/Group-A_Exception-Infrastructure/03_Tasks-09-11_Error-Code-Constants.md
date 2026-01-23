# Tasks 09-11: Error Code Constants

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 07 - Exception Handling  
> **Group:** A - Exception Infrastructure  
> **Document:** 03 of 04  
> **Tasks Covered:** 09, 10, 11

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [02_Tasks-03-08_Base-Exception-Class.md](02_Tasks-03-08_Base-Exception-Class.md)
- **→ Next Document:** [04_Tasks-12-14_Registry-Testing.md](04_Tasks-12-14_Registry-Testing.md)

---

## Document Overview

This document covers the creation of standardized error codes and their mapping to HTTP status codes. Error codes provide a consistent way for API clients to programmatically handle different error scenarios.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 09 | Create error_codes.py | Simple |
| 10 | Define Error Code Enum | Medium |
| 11 | Map Codes to HTTP Status | Medium |

---

## Task 09: Create error_codes.py

### Overview
Create the error_codes.py file that will contain all error code constants and their mappings to HTTP status codes.

### Dependencies
- Task 02: exceptions __init__.py exists

### Instructions

1. **Create the error_codes.py file**
   - Create file named `error_codes.py` in the exceptions directory
   - File path: `backend/apps/core/exceptions/error_codes.py`

2. **Add file docstring**
   ```python
   """
   Error Code Constants
   
   This module defines standardized error codes used throughout the API.
   Each error code is mapped to an appropriate HTTP status code.
   
   Error codes follow the format: CATEGORY_SPECIFIC_ERROR
   Examples: VALIDATION_ERROR, AUTH_FAILED, RESOURCE_NOT_FOUND
   
   Categories:
   - VALIDATION_xxx: Input validation errors (400)
   - AUTH_xxx: Authentication errors (401)
   - PERMISSION_xxx: Authorization errors (403)
   - RESOURCE_xxx: Resource errors (404)
   - CONFLICT_xxx: State conflict errors (409)
   - RATE_LIMIT_xxx: Rate limiting errors (429)
   - SERVER_xxx: Server errors (500)
   - TENANT_xxx: Multi-tenancy errors (various)
   """
   ```

3. **Add necessary imports**
   ```python
   from enum import Enum
   from typing import Dict
   ```

### Expected Outcome
```
backend/apps/core/exceptions/
├── __init__.py
├── base.py
└── error_codes.py            # New file
```

### Verification Checklist
- [ ] `error_codes.py` file exists in exceptions directory
- [ ] File contains comprehensive docstring
- [ ] File contains necessary imports
- [ ] Error code categories documented
- [ ] File is a valid Python file

---

## Task 10: Define Error Code Enum

### Overview
Create an Enum class that defines all error codes used in the system. Using an Enum ensures type safety and prevents typos.

### Dependencies
- Task 09: error_codes.py file exists

### Instructions

1. **Create the ErrorCode enum class**
   ```python
   class ErrorCode(str, Enum):
       """
       Enumeration of all error codes used in the API.
       
       Each error code uniquely identifies a type of error and is mapped
       to an appropriate HTTP status code.
       """
       pass
   ```

2. **Add validation error codes (400)**
   ```python
   # Validation Errors (400 Bad Request)
   VALIDATION_ERROR = 'VALIDATION_ERROR'
   VALIDATION_FAILED = 'VALIDATION_FAILED'
   INVALID_INPUT = 'INVALID_INPUT'
   INVALID_FORMAT = 'INVALID_FORMAT'
   REQUIRED_FIELD_MISSING = 'REQUIRED_FIELD_MISSING'
   INVALID_FIELD_VALUE = 'INVALID_FIELD_VALUE'
   ```

3. **Add authentication error codes (401)**
   ```python
   # Authentication Errors (401 Unauthorized)
   AUTH_FAILED = 'AUTH_FAILED'
   AUTH_REQUIRED = 'AUTH_REQUIRED'
   AUTH_INVALID_CREDENTIALS = 'AUTH_INVALID_CREDENTIALS'
   AUTH_TOKEN_INVALID = 'AUTH_TOKEN_INVALID'
   AUTH_TOKEN_EXPIRED = 'AUTH_TOKEN_EXPIRED'
   AUTH_TOKEN_MISSING = 'AUTH_TOKEN_MISSING'
   ```

4. **Add permission error codes (403)**
   ```python
   # Permission Errors (403 Forbidden)
   PERMISSION_DENIED = 'PERMISSION_DENIED'
   PERMISSION_REQUIRED = 'PERMISSION_REQUIRED'
   PERMISSION_INSUFFICIENT = 'PERMISSION_INSUFFICIENT'
   ```

5. **Add resource error codes (404)**
   ```python
   # Resource Errors (404 Not Found)
   RESOURCE_NOT_FOUND = 'RESOURCE_NOT_FOUND'
   RESOURCE_DOES_NOT_EXIST = 'RESOURCE_DOES_NOT_EXIST'
   ENDPOINT_NOT_FOUND = 'ENDPOINT_NOT_FOUND'
   ```

6. **Add conflict error codes (409)**
   ```python
   # Conflict Errors (409 Conflict)
   CONFLICT = 'CONFLICT'
   CONFLICT_DUPLICATE = 'CONFLICT_DUPLICATE'
   RESOURCE_ALREADY_EXISTS = 'RESOURCE_ALREADY_EXISTS'
   CONFLICT_STATE = 'CONFLICT_STATE'
   ```

7. **Add rate limit error codes (429)**
   ```python
   # Rate Limit Errors (429 Too Many Requests)
   RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED'
   TOO_MANY_REQUESTS = 'TOO_MANY_REQUESTS'
   ```

8. **Add server error codes (500)**
   ```python
   # Server Errors (500 Internal Server Error)
   SERVER_ERROR = 'SERVER_ERROR'
   INTERNAL_ERROR = 'INTERNAL_ERROR'
   DATABASE_ERROR = 'DATABASE_ERROR'
   EXTERNAL_SERVICE_ERROR = 'EXTERNAL_SERVICE_ERROR'
   ```

9. **Add service unavailable error codes (503)**
   ```python
   # Service Unavailable (503)
   SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE'
   MAINTENANCE_MODE = 'MAINTENANCE_MODE'
   ```

10. **Add tenant-specific error codes**
    ```python
    # Tenant-Specific Errors
    TENANT_NOT_FOUND = 'TENANT_NOT_FOUND'
    TENANT_INACTIVE = 'TENANT_INACTIVE'
    TENANT_SUSPENDED = 'TENANT_SUSPENDED'
    TENANT_DOMAIN_INVALID = 'TENANT_DOMAIN_INVALID'
    ```

11. **Add business rule error codes**
    ```python
    # Business Logic Errors (400/422)
    BUSINESS_RULE_VIOLATION = 'BUSINESS_RULE_VIOLATION'
    INSUFFICIENT_STOCK = 'INSUFFICIENT_STOCK'
    INVALID_TRANSACTION = 'INVALID_TRANSACTION'
    PAYMENT_FAILED = 'PAYMENT_FAILED'
    ```

### Error Code Categories
| Category | HTTP Status | Purpose |
|----------|-------------|---------|
| **VALIDATION_xxx** | 400 | Input validation failures |
| **AUTH_xxx** | 401 | Authentication failures |
| **PERMISSION_xxx** | 403 | Authorization failures |
| **RESOURCE_xxx** | 404 | Resource not found |
| **CONFLICT_xxx** | 409 | State conflicts, duplicates |
| **RATE_LIMIT_xxx** | 429 | Too many requests |
| **SERVER_xxx** | 500 | Internal server errors |
| **SERVICE_xxx** | 503 | Service unavailable |
| **TENANT_xxx** | Various | Multi-tenancy issues |
| **BUSINESS_xxx** | 400/422 | Business rule violations |

### Verification Checklist
- [ ] ErrorCode enum class defined
- [ ] Inherits from str and Enum
- [ ] All validation error codes defined
- [ ] All authentication error codes defined
- [ ] All permission error codes defined
- [ ] All resource error codes defined
- [ ] All conflict error codes defined
- [ ] All rate limit error codes defined
- [ ] All server error codes defined
- [ ] Tenant-specific codes defined
- [ ] Business rule codes defined

---

## Task 11: Map Codes to HTTP Status

### Overview
Create a mapping dictionary that associates each error code with its appropriate HTTP status code. This enables automatic status code assignment.

### Dependencies
- Task 10: ErrorCode enum defined

### Instructions

1. **Create the ERROR_STATUS_MAP dictionary**
   ```python
   # Map error codes to HTTP status codes
   ERROR_STATUS_MAP: Dict[ErrorCode, int] = {
       # Documentation comment
   }
   ```

2. **Add validation error mappings (400)**
   ```python
   # Validation Errors -> 400
   ErrorCode.VALIDATION_ERROR: 400,
   ErrorCode.VALIDATION_FAILED: 400,
   ErrorCode.INVALID_INPUT: 400,
   ErrorCode.INVALID_FORMAT: 400,
   ErrorCode.REQUIRED_FIELD_MISSING: 400,
   ErrorCode.INVALID_FIELD_VALUE: 400,
   ```

3. **Add authentication error mappings (401)**
   ```python
   # Authentication Errors -> 401
   ErrorCode.AUTH_FAILED: 401,
   ErrorCode.AUTH_REQUIRED: 401,
   ErrorCode.AUTH_INVALID_CREDENTIALS: 401,
   ErrorCode.AUTH_TOKEN_INVALID: 401,
   ErrorCode.AUTH_TOKEN_EXPIRED: 401,
   ErrorCode.AUTH_TOKEN_MISSING: 401,
   ```

4. **Add permission error mappings (403)**
   ```python
   # Permission Errors -> 403
   ErrorCode.PERMISSION_DENIED: 403,
   ErrorCode.PERMISSION_REQUIRED: 403,
   ErrorCode.PERMISSION_INSUFFICIENT: 403,
   ```

5. **Add resource error mappings (404)**
   ```python
   # Resource Errors -> 404
   ErrorCode.RESOURCE_NOT_FOUND: 404,
   ErrorCode.RESOURCE_DOES_NOT_EXIST: 404,
   ErrorCode.ENDPOINT_NOT_FOUND: 404,
   ```

6. **Add conflict error mappings (409)**
   ```python
   # Conflict Errors -> 409
   ErrorCode.CONFLICT: 409,
   ErrorCode.CONFLICT_DUPLICATE: 409,
   ErrorCode.RESOURCE_ALREADY_EXISTS: 409,
   ErrorCode.CONFLICT_STATE: 409,
   ```

7. **Add rate limit error mappings (429)**
   ```python
   # Rate Limit Errors -> 429
   ErrorCode.RATE_LIMIT_EXCEEDED: 429,
   ErrorCode.TOO_MANY_REQUESTS: 429,
   ```

8. **Add server error mappings (500)**
   ```python
   # Server Errors -> 500
   ErrorCode.SERVER_ERROR: 500,
   ErrorCode.INTERNAL_ERROR: 500,
   ErrorCode.DATABASE_ERROR: 500,
   ErrorCode.EXTERNAL_SERVICE_ERROR: 500,
   ```

9. **Add service unavailable mappings (503)**
   ```python
   # Service Unavailable -> 503
   ErrorCode.SERVICE_UNAVAILABLE: 503,
   ErrorCode.MAINTENANCE_MODE: 503,
   ```

10. **Add tenant error mappings**
    ```python
    # Tenant Errors
    ErrorCode.TENANT_NOT_FOUND: 404,
    ErrorCode.TENANT_INACTIVE: 403,
    ErrorCode.TENANT_SUSPENDED: 403,
    ErrorCode.TENANT_DOMAIN_INVALID: 400,
    ```

11. **Add business rule error mappings**
    ```python
    # Business Logic Errors
    ErrorCode.BUSINESS_RULE_VIOLATION: 400,
    ErrorCode.INSUFFICIENT_STOCK: 400,
    ErrorCode.INVALID_TRANSACTION: 400,
    ErrorCode.PAYMENT_FAILED: 400,
    ```

12. **Create helper function to get status code**
    ```python
    def get_status_code_for_error(error_code: ErrorCode) -> int:
        """
        Get the HTTP status code for a given error code.
        
        Args:
            error_code: The error code to look up
            
        Returns:
            HTTP status code (defaults to 500 if not found)
        """
        return ERROR_STATUS_MAP.get(error_code, 500)
    ```

### HTTP Status Code Reference
| Status | Category | When to Use |
|--------|----------|-------------|
| **400** | Bad Request | Invalid input, validation failure |
| **401** | Unauthorized | Authentication required or failed |
| **403** | Forbidden | Authenticated but not authorized |
| **404** | Not Found | Resource doesn't exist |
| **409** | Conflict | State conflict, duplicate resource |
| **422** | Unprocessable Entity | Valid syntax but business rule violation |
| **429** | Too Many Requests | Rate limit exceeded |
| **500** | Internal Server Error | Unexpected server error |
| **503** | Service Unavailable | Service down or maintenance |

### Verification Checklist
- [ ] ERROR_STATUS_MAP dictionary created
- [ ] All ErrorCode enum values mapped
- [ ] Each mapping has correct HTTP status
- [ ] get_status_code_for_error function defined
- [ ] Function defaults to 500 for unknown codes
- [ ] Type hints correct (Dict[ErrorCode, int])

---

## Complete Implementation

### Full error_codes.py File
```python
"""
Error Code Constants

This module defines standardized error codes used throughout the API.
Each error code is mapped to an appropriate HTTP status code.

Error codes follow the format: CATEGORY_SPECIFIC_ERROR
Examples: VALIDATION_ERROR, AUTH_FAILED, RESOURCE_NOT_FOUND

Categories:
- VALIDATION_xxx: Input validation errors (400)
- AUTH_xxx: Authentication errors (401)
- PERMISSION_xxx: Authorization errors (403)
- RESOURCE_xxx: Resource errors (404)
- CONFLICT_xxx: State conflict errors (409)
- RATE_LIMIT_xxx: Rate limiting errors (429)
- SERVER_xxx: Server errors (500)
- TENANT_xxx: Multi-tenancy errors (various)
"""

from enum import Enum
from typing import Dict


class ErrorCode(str, Enum):
    """
    Enumeration of all error codes used in the API.
    
    Each error code uniquely identifies a type of error and is mapped
    to an appropriate HTTP status code.
    """
    
    # Validation Errors (400 Bad Request)
    VALIDATION_ERROR = 'VALIDATION_ERROR'
    VALIDATION_FAILED = 'VALIDATION_FAILED'
    INVALID_INPUT = 'INVALID_INPUT'
    INVALID_FORMAT = 'INVALID_FORMAT'
    REQUIRED_FIELD_MISSING = 'REQUIRED_FIELD_MISSING'
    INVALID_FIELD_VALUE = 'INVALID_FIELD_VALUE'
    
    # Authentication Errors (401 Unauthorized)
    AUTH_FAILED = 'AUTH_FAILED'
    AUTH_REQUIRED = 'AUTH_REQUIRED'
    AUTH_INVALID_CREDENTIALS = 'AUTH_INVALID_CREDENTIALS'
    AUTH_TOKEN_INVALID = 'AUTH_TOKEN_INVALID'
    AUTH_TOKEN_EXPIRED = 'AUTH_TOKEN_EXPIRED'
    AUTH_TOKEN_MISSING = 'AUTH_TOKEN_MISSING'
    
    # Permission Errors (403 Forbidden)
    PERMISSION_DENIED = 'PERMISSION_DENIED'
    PERMISSION_REQUIRED = 'PERMISSION_REQUIRED'
    PERMISSION_INSUFFICIENT = 'PERMISSION_INSUFFICIENT'
    
    # Resource Errors (404 Not Found)
    RESOURCE_NOT_FOUND = 'RESOURCE_NOT_FOUND'
    RESOURCE_DOES_NOT_EXIST = 'RESOURCE_DOES_NOT_EXIST'
    ENDPOINT_NOT_FOUND = 'ENDPOINT_NOT_FOUND'
    
    # Conflict Errors (409 Conflict)
    CONFLICT = 'CONFLICT'
    CONFLICT_DUPLICATE = 'CONFLICT_DUPLICATE'
    RESOURCE_ALREADY_EXISTS = 'RESOURCE_ALREADY_EXISTS'
    CONFLICT_STATE = 'CONFLICT_STATE'
    
    # Rate Limit Errors (429 Too Many Requests)
    RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED'
    TOO_MANY_REQUESTS = 'TOO_MANY_REQUESTS'
    
    # Server Errors (500 Internal Server Error)
    SERVER_ERROR = 'SERVER_ERROR'
    INTERNAL_ERROR = 'INTERNAL_ERROR'
    DATABASE_ERROR = 'DATABASE_ERROR'
    EXTERNAL_SERVICE_ERROR = 'EXTERNAL_SERVICE_ERROR'
    
    # Service Unavailable (503)
    SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE'
    MAINTENANCE_MODE = 'MAINTENANCE_MODE'
    
    # Tenant-Specific Errors
    TENANT_NOT_FOUND = 'TENANT_NOT_FOUND'
    TENANT_INACTIVE = 'TENANT_INACTIVE'
    TENANT_SUSPENDED = 'TENANT_SUSPENDED'
    TENANT_DOMAIN_INVALID = 'TENANT_DOMAIN_INVALID'
    
    # Business Logic Errors (400/422)
    BUSINESS_RULE_VIOLATION = 'BUSINESS_RULE_VIOLATION'
    INSUFFICIENT_STOCK = 'INSUFFICIENT_STOCK'
    INVALID_TRANSACTION = 'INVALID_TRANSACTION'
    PAYMENT_FAILED = 'PAYMENT_FAILED'


# Map error codes to HTTP status codes
ERROR_STATUS_MAP: Dict[ErrorCode, int] = {
    # Validation Errors -> 400
    ErrorCode.VALIDATION_ERROR: 400,
    ErrorCode.VALIDATION_FAILED: 400,
    ErrorCode.INVALID_INPUT: 400,
    ErrorCode.INVALID_FORMAT: 400,
    ErrorCode.REQUIRED_FIELD_MISSING: 400,
    ErrorCode.INVALID_FIELD_VALUE: 400,
    
    # Authentication Errors -> 401
    ErrorCode.AUTH_FAILED: 401,
    ErrorCode.AUTH_REQUIRED: 401,
    ErrorCode.AUTH_INVALID_CREDENTIALS: 401,
    ErrorCode.AUTH_TOKEN_INVALID: 401,
    ErrorCode.AUTH_TOKEN_EXPIRED: 401,
    ErrorCode.AUTH_TOKEN_MISSING: 401,
    
    # Permission Errors -> 403
    ErrorCode.PERMISSION_DENIED: 403,
    ErrorCode.PERMISSION_REQUIRED: 403,
    ErrorCode.PERMISSION_INSUFFICIENT: 403,
    
    # Resource Errors -> 404
    ErrorCode.RESOURCE_NOT_FOUND: 404,
    ErrorCode.RESOURCE_DOES_NOT_EXIST: 404,
    ErrorCode.ENDPOINT_NOT_FOUND: 404,
    
    # Conflict Errors -> 409
    ErrorCode.CONFLICT: 409,
    ErrorCode.CONFLICT_DUPLICATE: 409,
    ErrorCode.RESOURCE_ALREADY_EXISTS: 409,
    ErrorCode.CONFLICT_STATE: 409,
    
    # Rate Limit Errors -> 429
    ErrorCode.RATE_LIMIT_EXCEEDED: 429,
    ErrorCode.TOO_MANY_REQUESTS: 429,
    
    # Server Errors -> 500
    ErrorCode.SERVER_ERROR: 500,
    ErrorCode.INTERNAL_ERROR: 500,
    ErrorCode.DATABASE_ERROR: 500,
    ErrorCode.EXTERNAL_SERVICE_ERROR: 500,
    
    # Service Unavailable -> 503
    ErrorCode.SERVICE_UNAVAILABLE: 503,
    ErrorCode.MAINTENANCE_MODE: 503,
    
    # Tenant Errors
    ErrorCode.TENANT_NOT_FOUND: 404,
    ErrorCode.TENANT_INACTIVE: 403,
    ErrorCode.TENANT_SUSPENDED: 403,
    ErrorCode.TENANT_DOMAIN_INVALID: 400,
    
    # Business Logic Errors
    ErrorCode.BUSINESS_RULE_VIOLATION: 400,
    ErrorCode.INSUFFICIENT_STOCK: 400,
    ErrorCode.INVALID_TRANSACTION: 400,
    ErrorCode.PAYMENT_FAILED: 400,
}


def get_status_code_for_error(error_code: ErrorCode) -> int:
    """
    Get the HTTP status code for a given error code.
    
    Args:
        error_code: The error code to look up
        
    Returns:
        HTTP status code (defaults to 500 if not found)
    
    Example:
        >>> get_status_code_for_error(ErrorCode.VALIDATION_ERROR)
        400
        >>> get_status_code_for_error(ErrorCode.AUTH_TOKEN_EXPIRED)
        401
    """
    return ERROR_STATUS_MAP.get(error_code, 500)
```

### Usage Examples

**Using Error Codes:**
```python
from apps.core.exceptions.error_codes import ErrorCode, get_status_code_for_error

# Get error code value
code = ErrorCode.VALIDATION_ERROR
print(code)  # Output: VALIDATION_ERROR

# Get HTTP status for error code
status = get_status_code_for_error(ErrorCode.AUTH_FAILED)
print(status)  # Output: 401

# Use in exception
from apps.core.exceptions.base import APIException

raise APIException(
    error_code=ErrorCode.RESOURCE_NOT_FOUND,
    message='Product not found',
    status_code=get_status_code_for_error(ErrorCode.RESOURCE_NOT_FOUND)
)
```

**Checking Error Codes:**
```python
# Check if error code exists
if ErrorCode.TENANT_NOT_FOUND in ErrorCode:
    print("Tenant error code exists")

# Iterate all error codes
for code in ErrorCode:
    status = get_status_code_for_error(code)
    print(f"{code}: {status}")
```

### Expected Outcome
```
backend/apps/core/exceptions/
├── __init__.py
├── base.py
└── error_codes.py            # Contains ErrorCode enum and mappings
```

### Integration with __init__.py
Update `__init__.py` to export error codes:
```python
from .base import APIException
from .error_codes import ErrorCode, ERROR_STATUS_MAP, get_status_code_for_error

__all__ = [
    'APIException',
    'ErrorCode',
    'ERROR_STATUS_MAP',
    'get_status_code_for_error',
]
```

---

## Testing Error Codes

### Manual Testing
```python
# Test error code enum
assert ErrorCode.VALIDATION_ERROR == 'VALIDATION_ERROR'
assert ErrorCode.AUTH_FAILED == 'AUTH_FAILED'

# Test status code mapping
assert get_status_code_for_error(ErrorCode.VALIDATION_ERROR) == 400
assert get_status_code_for_error(ErrorCode.AUTH_FAILED) == 401
assert get_status_code_for_error(ErrorCode.RESOURCE_NOT_FOUND) == 404
assert get_status_code_for_error(ErrorCode.SERVER_ERROR) == 500

# Test unknown error code defaults to 500
fake_code = 'FAKE_CODE'
assert get_status_code_for_error(fake_code) == 500
```

### Unit Test Template
```python
# backend/apps/core/tests/test_error_codes.py
import pytest
from apps.core.exceptions.error_codes import (
    ErrorCode,
    ERROR_STATUS_MAP,
    get_status_code_for_error
)


class TestErrorCodes:
    def test_validation_error_codes_map_to_400(self):
        """Test validation errors map to 400."""
        assert get_status_code_for_error(ErrorCode.VALIDATION_ERROR) == 400
        assert get_status_code_for_error(ErrorCode.INVALID_INPUT) == 400
    
    def test_auth_error_codes_map_to_401(self):
        """Test authentication errors map to 401."""
        assert get_status_code_for_error(ErrorCode.AUTH_FAILED) == 401
        assert get_status_code_for_error(ErrorCode.AUTH_TOKEN_EXPIRED) == 401
    
    def test_permission_error_codes_map_to_403(self):
        """Test permission errors map to 403."""
        assert get_status_code_for_error(ErrorCode.PERMISSION_DENIED) == 403
    
    def test_resource_error_codes_map_to_404(self):
        """Test resource errors map to 404."""
        assert get_status_code_for_error(ErrorCode.RESOURCE_NOT_FOUND) == 404
        assert get_status_code_for_error(ErrorCode.TENANT_NOT_FOUND) == 404
    
    def test_conflict_error_codes_map_to_409(self):
        """Test conflict errors map to 409."""
        assert get_status_code_for_error(ErrorCode.CONFLICT) == 409
        assert get_status_code_for_error(ErrorCode.RESOURCE_ALREADY_EXISTS) == 409
    
    def test_rate_limit_error_codes_map_to_429(self):
        """Test rate limit errors map to 429."""
        assert get_status_code_for_error(ErrorCode.RATE_LIMIT_EXCEEDED) == 429
    
    def test_server_error_codes_map_to_500(self):
        """Test server errors map to 500."""
        assert get_status_code_for_error(ErrorCode.SERVER_ERROR) == 500
        assert get_status_code_for_error(ErrorCode.DATABASE_ERROR) == 500
    
    def test_unknown_error_code_defaults_to_500(self):
        """Test unknown error codes default to 500."""
        assert get_status_code_for_error('UNKNOWN_CODE') == 500
    
    def test_all_enum_values_are_mapped(self):
        """Test that all ErrorCode enum values have a mapping."""
        for code in ErrorCode:
            assert code in ERROR_STATUS_MAP
```

---

## Common Issues and Solutions

### Issue: Adding New Error Code Without Mapping
**Problem:** New error code added to enum but not to ERROR_STATUS_MAP
**Solution:** Always add mapping when adding new error code, write test to ensure all codes mapped

### Issue: Inconsistent Status Codes
**Problem:** Similar errors have different status codes
**Solution:** Follow HTTP status code semantics consistently

### Issue: Using String Instead of Enum
**Problem:** Using string literal instead of ErrorCode enum value
**Solution:** Always use ErrorCode.XXX, not 'XXX' string

---

## Next Steps

After completing these tasks, proceed to:
1. **Task 12-14:** Create exception registry and write comprehensive tests
2. **Group B:** Create custom exception classes that use these error codes
3. **Group C:** Create global exception handler that uses status code mappings

The error code infrastructure is now complete and ready to be used.

---

## Notes for AI Agents

- **Enum Benefits:** Type safety, autocomplete, prevents typos
- **Status Code Mapping:** Centralized, consistent, automatic
- **Naming Convention:** UPPER_SNAKE_CASE, descriptive, categorized
- **Extensibility:** Easy to add new codes and mappings
- **Default Behavior:** Unknown codes default to 500 (fail-safe)
- **Documentation:** Keep error code categories documented
- **Immutability:** Error codes should not change once in use
