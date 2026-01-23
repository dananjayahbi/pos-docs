# Tasks 15-19: Client Error Exceptions

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 07 - Exception Handling  
> **Group:** B - Custom Exception Classes  
> **Document:** 01 of 03  
> **Tasks Covered:** 15, 16, 17, 18, 19

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Group:** [../Group-A_Exception-Infrastructure/](../Group-A_Exception-Infrastructure/)
- **→ Next Document:** [02_Tasks-20-27_Auth-Permission-Exceptions.md](02_Tasks-20-27_Auth-Permission-Exceptions.md)

---

## Document Overview

This document covers the creation of client error exceptions (4xx HTTP status codes). These exceptions are raised when the client sends invalid requests or attempts unauthorized actions.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 15 | Create ValidationException | Medium |
| 16 | Create AuthenticationException | Medium |
| 17 | Create PermissionDeniedException | Medium |
| 18 | Create NotFoundException | Medium |
| 19 | Create ConflictException | Medium |

---

## Task 15: Create ValidationException

### Overview
Create the ValidationException for handling input validation errors. This is raised when request data fails validation checks.

### Dependencies
- Group A: APIException base class exists
- Group A: ErrorCode enum defined

### Instructions

1. **Create api_exceptions.py file**
   ```bash
   touch backend/apps/core/exceptions/api_exceptions.py
   ```

2. **Add file docstring and imports**
   ```python
   """
   Custom API Exception Classes
   
   This module defines all custom exception classes that inherit from
   APIException. Each exception is mapped to a specific HTTP status code
   and error scenario.
   """
   
   from apps.core.exceptions.base import APIException
   from apps.core.exceptions.error_codes import ErrorCode
   ```

3. **Create ValidationException class**
   ```python
   class ValidationException(APIException):
       """
       Exception raised when input validation fails.
       
       This exception should be used for:
       - Invalid form data
       - Missing required fields
       - Invalid field formats
       - Type mismatches
       - Constraint violations
       
       HTTP Status: 400 Bad Request
       
       Example:
           >>> raise ValidationException(
           ...     message='Invalid email format',
           ...     details={'email': ['Must be a valid email address']}
           ... )
       """
       
       default_error_code = ErrorCode.VALIDATION_ERROR
       default_message = 'Validation failed'
       default_status_code = 400
   ```

### Usage Scenarios
| Scenario | Example |
|----------|---------|
| **Required Field Missing** | Email field not provided |
| **Invalid Format** | Phone number has letters |
| **Out of Range** | Age is negative |
| **Type Mismatch** | String provided for integer field |
| **Constraint Violation** | Password too short |

### Usage Example
```python
# In a serializer or view
from apps.core.exceptions import ValidationException

def validate_user_data(data):
    errors = {}
    
    if not data.get('email'):
        errors['email'] = ['Email is required']
    
    if not data.get('password') or len(data['password']) < 8:
        errors['password'] = ['Password must be at least 8 characters']
    
    if errors:
        raise ValidationException(
            message='Validation failed',
            details=errors
        )
```

### Verification Checklist
- [ ] ValidationException class created
- [ ] Inherits from APIException
- [ ] default_error_code set to ErrorCode.VALIDATION_ERROR
- [ ] default_message set appropriately
- [ ] default_status_code set to 400
- [ ] Class docstring includes usage examples
- [ ] Error scenarios documented

---

## Task 16: Create AuthenticationException

### Overview
Create the AuthenticationException for handling authentication failures. This is raised when a user fails to authenticate or provides invalid credentials.

### Dependencies
- Task 15: api_exceptions.py file exists

### Instructions

1. **Add AuthenticationException class**
   ```python
   class AuthenticationException(APIException):
       """
       Exception raised when authentication fails.
       
       This exception should be used for:
       - Invalid username/password
       - Missing authentication credentials
       - Login failures
       - Unverified email/account
       - Account locked
       
       HTTP Status: 401 Unauthorized
       
       Example:
           >>> raise AuthenticationException(
           ...     message='Invalid credentials',
           ...     details={'attempt_count': 3}
           ... )
       """
       
       default_error_code = ErrorCode.AUTH_FAILED
       default_message = 'Authentication failed'
       default_status_code = 401
   ```

### Usage Scenarios
| Scenario | Example |
|----------|---------|
| **Invalid Credentials** | Wrong password |
| **Account Not Found** | Email not registered |
| **Account Locked** | Too many failed attempts |
| **Email Not Verified** | Account pending verification |
| **Missing Credentials** | No username provided |

### Usage Example
```python
# In authentication logic
from django.contrib.auth import authenticate
from apps.core.exceptions import AuthenticationException

def login_user(username, password):
    user = authenticate(username=username, password=password)
    
    if not user:
        raise AuthenticationException(
            message='Invalid username or password',
            details={
                'username': username,
                'suggestion': 'Check your credentials and try again'
            }
        )
    
    if not user.is_active:
        raise AuthenticationException(
            message='Account is inactive',
            details={'reason': 'Please verify your email address'}
        )
    
    return user
```

### Verification Checklist
- [ ] AuthenticationException class created
- [ ] Inherits from APIException
- [ ] default_error_code set to ErrorCode.AUTH_FAILED
- [ ] default_message set appropriately
- [ ] default_status_code set to 401
- [ ] Class docstring includes usage examples
- [ ] Authentication scenarios documented

---

## Task 17: Create PermissionDeniedException

### Overview
Create the PermissionDeniedException for handling authorization failures. This is raised when an authenticated user lacks permission to perform an action.

### Dependencies
- Task 16: AuthenticationException created

### Instructions

1. **Add PermissionDeniedException class**
   ```python
   class PermissionDeniedException(APIException):
       """
       Exception raised when user lacks required permission.
       
       This exception should be used for:
       - Insufficient permissions for action
       - Role-based access control violations
       - Resource ownership violations
       - Tenant access violations
       - Read-only mode restrictions
       
       HTTP Status: 403 Forbidden
       
       Note: Use AuthenticationException (401) when user is not authenticated.
       Use PermissionDeniedException (403) when user is authenticated but not authorized.
       
       Example:
           >>> raise PermissionDeniedException(
           ...     message='You do not have permission to delete products',
           ...     details={'required_permission': 'products.delete'}
           ... )
       """
       
       default_error_code = ErrorCode.PERMISSION_DENIED
       default_message = 'Permission denied'
       default_status_code = 403
   ```

### 401 vs 403 Distinction
| Status | Meaning | When to Use |
|--------|---------|-------------|
| **401 Unauthorized** | Not authenticated | No credentials or invalid credentials |
| **403 Forbidden** | Not authorized | Valid credentials but insufficient permissions |

### Usage Scenarios
| Scenario | Example |
|----------|---------|
| **Missing Role** | User not an admin |
| **Missing Permission** | Cannot delete products |
| **Wrong Tenant** | Accessing another tenant's data |
| **Resource Owner** | Not the owner of resource |
| **Read-Only Mode** | System in maintenance |

### Usage Example
```python
# In permission checks
from apps.core.exceptions import PermissionDeniedException

def check_product_delete_permission(user, product):
    # Check if user has delete permission
    if not user.has_perm('products.delete_product'):
        raise PermissionDeniedException(
            message='You do not have permission to delete products',
            details={
                'required_permission': 'products.delete_product',
                'user_role': user.role
            }
        )
    
    # Check if user is in same tenant as product
    if product.tenant_id != user.tenant_id:
        raise PermissionDeniedException(
            message='You cannot access products from another tenant',
            details={
                'product_tenant': product.tenant_id,
                'user_tenant': user.tenant_id
            }
        )
```

### Verification Checklist
- [ ] PermissionDeniedException class created
- [ ] Inherits from APIException
- [ ] default_error_code set to ErrorCode.PERMISSION_DENIED
- [ ] default_message set appropriately
- [ ] default_status_code set to 403
- [ ] 401 vs 403 distinction documented
- [ ] Permission scenarios documented

---

## Task 18: Create NotFoundException

### Overview
Create the NotFoundException for handling resource not found errors. This is raised when a requested resource doesn't exist.

### Dependencies
- Task 17: PermissionDeniedException created

### Instructions

1. **Add NotFoundException class**
   ```python
   class NotFoundException(APIException):
       """
       Exception raised when a requested resource is not found.
       
       This exception should be used for:
       - Resource doesn't exist
       - Invalid resource ID
       - Deleted resources
       - Non-existent endpoints
       - Missing related resources
       
       HTTP Status: 404 Not Found
       
       Example:
           >>> raise NotFoundException(
           ...     message='Product not found',
           ...     details={'product_id': 123, 'resource_type': 'Product'}
           ... )
       """
       
       default_error_code = ErrorCode.RESOURCE_NOT_FOUND
       default_message = 'Resource not found'
       default_status_code = 404
   ```

### Usage Scenarios
| Scenario | Example |
|----------|---------|
| **Invalid ID** | Product with ID 999 doesn't exist |
| **Deleted Resource** | Product was deleted |
| **Wrong Endpoint** | URL path doesn't match any route |
| **Missing Related** | Order references non-existent customer |
| **Wrong Tenant** | Resource exists but in different tenant |

### Security Consideration
When a resource exists but the user doesn't have access, consider whether to return 404 or 403:
- **Return 404:** Hides existence of resource (more secure)
- **Return 403:** Reveals resource exists but access denied (more transparent)

For most cases, returning 404 is safer to prevent information leakage.

### Usage Example
```python
# In views or services
from django.core.exceptions import ObjectDoesNotExist
from apps.core.exceptions import NotFoundException

def get_product(product_id, tenant):
    try:
        product = Product.objects.get(id=product_id, tenant=tenant)
        return product
    except ObjectDoesNotExist:
        raise NotFoundException(
            message=f'Product with ID {product_id} not found',
            details={
                'product_id': product_id,
                'resource_type': 'Product',
                'suggestion': 'Check the product ID and try again'
            }
        )
```

### Verification Checklist
- [ ] NotFoundException class created
- [ ] Inherits from APIException
- [ ] default_error_code set to ErrorCode.RESOURCE_NOT_FOUND
- [ ] default_message set appropriately
- [ ] default_status_code set to 404
- [ ] Security considerations documented
- [ ] Usage examples included

---

## Task 19: Create ConflictException

### Overview
Create the ConflictException for handling state conflicts. This is raised when a request conflicts with the current state of the resource.

### Dependencies
- Task 18: NotFoundException created

### Instructions

1. **Add ConflictException class**
   ```python
   class ConflictException(APIException):
       """
       Exception raised when request conflicts with current state.
       
       This exception should be used for:
       - Duplicate resources (unique constraint violation)
       - Concurrent modification conflicts
       - State transition violations
       - Version mismatches
       - Resource already in use
       
       HTTP Status: 409 Conflict
       
       Example:
           >>> raise ConflictException(
           ...     message='Email already registered',
           ...     details={'email': 'user@example.com', 'field': 'email'}
           ... )
       """
       
       default_error_code = ErrorCode.CONFLICT
       default_message = 'Request conflicts with current state'
       default_status_code = 409
   ```

### Usage Scenarios
| Scenario | Example |
|----------|---------|
| **Duplicate Entry** | Email already registered |
| **Concurrent Edit** | Resource modified by another user |
| **Invalid State** | Cannot cancel completed order |
| **Version Mismatch** | Optimistic locking conflict |
| **Resource In Use** | Cannot delete category with products |

### 409 vs 400 vs 422
| Status | When to Use |
|--------|-------------|
| **400 Bad Request** | Invalid input format or structure |
| **409 Conflict** | Input is valid but conflicts with current state |
| **422 Unprocessable Entity** | Valid syntax but business rule violation |

### Usage Example
```python
# In create/update logic
from django.db import IntegrityError
from apps.core.exceptions import ConflictException

def create_user(email, password):
    try:
        user = User.objects.create_user(
            email=email,
            password=password
        )
        return user
    except IntegrityError:
        raise ConflictException(
            message='Email address already registered',
            details={
                'email': email,
                'field': 'email',
                'suggestion': 'Use a different email or try logging in'
            }
        )

def cancel_order(order):
    if order.status == 'completed':
        raise ConflictException(
            message='Cannot cancel completed order',
            details={
                'order_id': order.id,
                'current_status': order.status,
                'allowed_statuses': ['pending', 'processing']
            }
        )
    
    order.status = 'cancelled'
    order.save()
```

### Verification Checklist
- [ ] ConflictException class created
- [ ] Inherits from APIException
- [ ] default_error_code set to ErrorCode.CONFLICT
- [ ] default_message set appropriately
- [ ] default_status_code set to 409
- [ ] Status code distinctions documented
- [ ] Conflict scenarios documented

---

## Complete Implementation

### Full api_exceptions.py File (So Far)
```python
"""
Custom API Exception Classes

This module defines all custom exception classes that inherit from
APIException. Each exception is mapped to a specific HTTP status code
and error scenario.
"""

from apps.core.exceptions.base import APIException
from apps.core.exceptions.error_codes import ErrorCode


class ValidationException(APIException):
    """
    Exception raised when input validation fails.
    
    This exception should be used for:
    - Invalid form data
    - Missing required fields
    - Invalid field formats
    - Type mismatches
    - Constraint violations
    
    HTTP Status: 400 Bad Request
    
    Example:
        >>> raise ValidationException(
        ...     message='Invalid email format',
        ...     details={'email': ['Must be a valid email address']}
        ... )
    """
    
    default_error_code = ErrorCode.VALIDATION_ERROR
    default_message = 'Validation failed'
    default_status_code = 400


class AuthenticationException(APIException):
    """
    Exception raised when authentication fails.
    
    This exception should be used for:
    - Invalid username/password
    - Missing authentication credentials
    - Login failures
    - Unverified email/account
    - Account locked
    
    HTTP Status: 401 Unauthorized
    
    Example:
        >>> raise AuthenticationException(
        ...     message='Invalid credentials',
        ...     details={'attempt_count': 3}
        ... )
    """
    
    default_error_code = ErrorCode.AUTH_FAILED
    default_message = 'Authentication failed'
    default_status_code = 401


class PermissionDeniedException(APIException):
    """
    Exception raised when user lacks required permission.
    
    This exception should be used for:
    - Insufficient permissions for action
    - Role-based access control violations
    - Resource ownership violations
    - Tenant access violations
    - Read-only mode restrictions
    
    HTTP Status: 403 Forbidden
    
    Note: Use AuthenticationException (401) when user is not authenticated.
    Use PermissionDeniedException (403) when user is authenticated but not authorized.
    
    Example:
        >>> raise PermissionDeniedException(
        ...     message='You do not have permission to delete products',
        ...     details={'required_permission': 'products.delete'}
        ... )
    """
    
    default_error_code = ErrorCode.PERMISSION_DENIED
    default_message = 'Permission denied'
    default_status_code = 403


class NotFoundException(APIException):
    """
    Exception raised when a requested resource is not found.
    
    This exception should be used for:
    - Resource doesn't exist
    - Invalid resource ID
    - Deleted resources
    - Non-existent endpoints
    - Missing related resources
    
    HTTP Status: 404 Not Found
    
    Example:
        >>> raise NotFoundException(
        ...     message='Product not found',
        ...     details={'product_id': 123, 'resource_type': 'Product'}
        ... )
    """
    
    default_error_code = ErrorCode.RESOURCE_NOT_FOUND
    default_message = 'Resource not found'
    default_status_code = 404


class ConflictException(APIException):
    """
    Exception raised when request conflicts with current state.
    
    This exception should be used for:
    - Duplicate resources (unique constraint violation)
    - Concurrent modification conflicts
    - State transition violations
    - Version mismatches
    - Resource already in use
    
    HTTP Status: 409 Conflict
    
    Example:
        >>> raise ConflictException(
        ...     message='Email already registered',
        ...     details={'email': 'user@example.com', 'field': 'email'}
        ... )
    """
    
    default_error_code = ErrorCode.CONFLICT
    default_message = 'Request conflicts with current state'
    default_status_code = 409
```

### Expected Outcome
```
backend/apps/core/exceptions/
├── __init__.py
├── base.py
├── error_codes.py
└── api_exceptions.py         # Client error exceptions
```

### Integration with __init__.py
Update `__init__.py` to export new exceptions:
```python
from .base import APIException
from .error_codes import ErrorCode, get_status_code_for_error
from .api_exceptions import (
    ValidationException,
    AuthenticationException,
    PermissionDeniedException,
    NotFoundException,
    ConflictException,
)

__all__ = [
    'APIException',
    'ErrorCode',
    'get_status_code_for_error',
    'ValidationException',
    'AuthenticationException',
    'PermissionDeniedException',
    'NotFoundException',
    'ConflictException',
]
```

---

## Testing Client Error Exceptions

### Unit Tests
```python
# Add to backend/apps/core/tests/test_exceptions.py

class TestClientErrorExceptions:
    """Tests for client error exceptions (4xx)."""
    
    def test_validation_exception(self):
        """Test ValidationException defaults."""
        exc = ValidationException()
        
        assert exc.error_code == ErrorCode.VALIDATION_ERROR
        assert exc.status_code == 400
        assert 'validation' in exc.message.lower()
    
    def test_validation_exception_with_field_errors(self):
        """Test ValidationException with field details."""
        exc = ValidationException(
            message='Invalid input',
            details={
                'email': ['Invalid format'],
                'age': ['Must be positive']
            }
        )
        
        assert exc.details['email'] == ['Invalid format']
        assert exc.details['age'] == ['Must be positive']
    
    def test_authentication_exception(self):
        """Test AuthenticationException defaults."""
        exc = AuthenticationException()
        
        assert exc.error_code == ErrorCode.AUTH_FAILED
        assert exc.status_code == 401
    
    def test_permission_denied_exception(self):
        """Test PermissionDeniedException defaults."""
        exc = PermissionDeniedException()
        
        assert exc.error_code == ErrorCode.PERMISSION_DENIED
        assert exc.status_code == 403
    
    def test_not_found_exception(self):
        """Test NotFoundException defaults."""
        exc = NotFoundException()
        
        assert exc.error_code == ErrorCode.RESOURCE_NOT_FOUND
        assert exc.status_code == 404
    
    def test_conflict_exception(self):
        """Test ConflictException defaults."""
        exc = ConflictException()
        
        assert exc.error_code == ErrorCode.CONFLICT
        assert exc.status_code == 409
```

---

## Common Issues and Solutions

### Issue: ValidationException vs Django Form Errors
**Problem:** Confusion about when to use ValidationException vs Django forms
**Solution:** Use ValidationException in API views/serializers, Django forms in templates

### Issue: 401 vs 403 Confusion
**Problem:** Not sure whether to return 401 or 403
**Solution:** 401 = not logged in, 403 = logged in but no permission

### Issue: 404 vs 403 for Hidden Resources
**Problem:** Should hidden resources return 404 or 403?
**Solution:** Return 404 to prevent information leakage (resource existence)

---

## Next Steps

After completing these tasks, proceed to:
1. **Task 20-27:** Create additional auth and permission exceptions
2. **Task 28-30:** Create server and business exceptions
3. **Group C:** Create global exception handler

The client error exceptions are now complete and ready to be used.

---

## Notes for AI Agents

- **Status Codes:** 4xx errors indicate client-side issues
- **User Messages:** Should be clear and actionable
- **Security:** Avoid exposing sensitive information in error messages
- **Validation Details:** Include field-level errors in details dict
- **Consistency:** Use consistent error code naming across exceptions
- **Documentation:** Keep docstrings updated with usage examples
- **Testing:** Test both default values and custom overrides
