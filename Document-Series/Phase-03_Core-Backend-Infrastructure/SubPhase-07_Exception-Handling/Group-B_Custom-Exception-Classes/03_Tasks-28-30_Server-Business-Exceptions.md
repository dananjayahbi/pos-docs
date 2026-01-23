# Tasks 28-30: Server & Business Exceptions

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 07 - Exception Handling  
> **Group:** B - Custom Exception Classes  
> **Document:** 03 of 03  
> **Tasks Covered:** 28, 29, 30

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [02_Tasks-20-27_Auth-Permission-Exceptions.md](02_Tasks-20-27_Auth-Permission-Exceptions.md)
- **→ Next Group:** [../Group-C_Global-Exception-Handler/](../Group-C_Global-Exception-Handler/)

---

## Document Overview

This document covers the creation of business rule exceptions, finalizing all exception exports, and comprehensive documentation for all custom exception classes.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 28 | Create BusinessRuleException | Medium |
| 29 | Export All Exceptions | Simple |
| 30 | Document Exception Classes | Medium |

---

## Task 28: Create BusinessRuleException

### Overview
Create the BusinessRuleException for business logic violations. This is raised when an operation violates domain-specific business rules.

### Dependencies
- Task 27: ResourceExistsException created

### Instructions

1. **Add BusinessRuleException to api_exceptions.py**
   ```python
   class BusinessRuleException(APIException):
       """
       Exception raised when business rule is violated.
       
       This exception should be used for:
       - Domain logic violations
       - Insufficient stock/inventory
       - Invalid order states
       - Price/discount violations
       - Payment amount mismatches
       - Business constraint failures
       
       HTTP Status: 400 Bad Request (or 422 Unprocessable Entity)
       
       Note: Use 400 for general business rules, 422 for semantic errors.
       
       Example:
           >>> raise BusinessRuleException(
           ...     message='Insufficient stock for order',
           ...     details={
           ...         'product_id': 123,
           ...         'requested': 10,
           ...         'available': 5
           ...     }
           ... )
       """
       
       default_error_code = ErrorCode.BUSINESS_RULE_VIOLATION
       default_message = 'Business rule violation'
       default_status_code = 400
   ```

### 400 vs 422 Status Codes
| Status | When to Use | Example |
|--------|-------------|---------|
| **400** | General business rules | Insufficient stock, invalid discount |
| **422** | Semantic validation | Valid JSON but violates business semantics |

### Common Business Rules
| Rule Type | Example Violation |
|-----------|------------------|
| **Inventory** | Insufficient stock for order |
| **Pricing** | Discount exceeds allowed percentage |
| **Orders** | Cannot cancel shipped order |
| **Payments** | Payment amount doesn't match order total |
| **Users** | Cannot delete user with active orders |
| **Products** | Cannot deactivate product in active orders |

### Usage Examples

**Inventory Check:**
```python
from apps.core.exceptions import BusinessRuleException

def create_order(product_id, quantity):
    product = Product.objects.get(id=product_id)
    
    if product.stock < quantity:
        raise BusinessRuleException(
            message=f'Insufficient stock for {product.name}',
            details={
                'product_id': product.id,
                'product_name': product.name,
                'requested_quantity': quantity,
                'available_stock': product.stock,
                'suggestion': f'Maximum {product.stock} units available'
            }
        )
    
    # Create order...
```

**Order State Validation:**
```python
def cancel_order(order):
    if order.status in ['shipped', 'delivered', 'completed']:
        raise BusinessRuleException(
            message=f'Cannot cancel {order.status} order',
            details={
                'order_id': order.id,
                'current_status': order.status,
                'allowed_statuses': ['pending', 'processing'],
                'suggestion': 'Contact support for assistance'
            }
        )
    
    order.status = 'cancelled'
    order.save()
```

**Discount Validation:**
```python
def apply_discount(order, discount_code):
    discount = DiscountCode.objects.get(code=discount_code)
    
    # Check minimum order amount
    if order.total < discount.minimum_order:
        raise BusinessRuleException(
            message='Order total does not meet discount requirement',
            details={
                'discount_code': discount_code,
                'minimum_required': float(discount.minimum_order),
                'order_total': float(order.total),
                'shortfall': float(discount.minimum_order - order.total)
            },
            status_code=422
        )
    
    # Check discount limit
    if discount.usage_count >= discount.usage_limit:
        raise BusinessRuleException(
            message='Discount code usage limit reached',
            details={
                'discount_code': discount_code,
                'usage_limit': discount.usage_limit
            }
        )
    
    # Apply discount...
```

**Payment Validation:**
```python
def process_payment(order, payment_amount):
    if payment_amount != order.total:
        raise BusinessRuleException(
            message='Payment amount does not match order total',
            details={
                'order_id': order.id,
                'order_total': float(order.total),
                'payment_amount': float(payment_amount),
                'difference': float(abs(order.total - payment_amount))
            }
        )
    
    # Process payment...
```

### Sri Lanka-Specific Business Rules

**Currency Validation:**
```python
def validate_currency(amount, currency):
    if currency != 'LKR':
        raise BusinessRuleException(
            message='Only LKR currency is supported',
            details={
                'provided_currency': currency,
                'supported_currency': 'LKR'
            }
        )
```

**Delivery Zone Validation:**
```python
def validate_delivery(postal_code):
    # Check if postal code is in serviceable area
    if not is_serviceable_postal_code(postal_code):
        raise BusinessRuleException(
            message='Delivery not available for this postal code',
            details={
                'postal_code': postal_code,
                'suggestion': 'Check available delivery zones'
            }
        )
```

### Verification Checklist
- [ ] BusinessRuleException class created
- [ ] default_error_code set to ErrorCode.BUSINESS_RULE_VIOLATION
- [ ] default_status_code set to 400
- [ ] 400 vs 422 distinction documented
- [ ] Common business rules documented
- [ ] Multiple usage examples included
- [ ] Sri Lanka-specific examples included

---

## Task 29: Export All Exceptions

### Overview
Update the exceptions module's `__init__.py` to export all custom exception classes, making them easily importable throughout the application.

### Dependencies
- Task 28: All exception classes created

### Instructions

1. **Update exceptions/__init__.py with all imports**
   ```python
   """
   Exception Handling Module
   
   This module provides custom exception classes and handlers for the
   LankaCommerce Cloud API. All exceptions inherit from APIException base class.
   
   Usage:
       from apps.core.exceptions import (
           ValidationException,
           AuthenticationException,
           NotFoundException
       )
       
       raise ValidationException(
           message="Invalid input data",
           details={"field": "email"}
       )
   """
   
   # Base exception and utilities
   from .base import (
       APIException,
       get_registered_exceptions,
       get_exception_by_name,
       list_exception_codes,
       validate_exceptions,
   )
   
   # Error codes
   from .error_codes import (
       ErrorCode,
       ERROR_STATUS_MAP,
       get_status_code_for_error,
   )
   
   # Custom exception classes
   from .api_exceptions import (
       # Client errors (4xx)
       ValidationException,
       AuthenticationException,
       PermissionDeniedException,
       NotFoundException,
       ConflictException,
       
       # Rate limiting
       RateLimitException,
       
       # Server errors (5xx)
       ServerException,
       ServiceUnavailableException,
       
       # Tenant-specific
       TenantNotFoundException,
       TenantInactiveException,
       
       # Token/Auth specific
       InvalidTokenException,
       TokenExpiredException,
       
       # Resource management
       ResourceExistsException,
       
       # Business logic
       BusinessRuleException,
   )
   
   __all__ = [
       # Base
       'APIException',
       'get_registered_exceptions',
       'get_exception_by_name',
       'list_exception_codes',
       'validate_exceptions',
       
       # Error codes
       'ErrorCode',
       'ERROR_STATUS_MAP',
       'get_status_code_for_error',
       
       # Client errors
       'ValidationException',
       'AuthenticationException',
       'PermissionDeniedException',
       'NotFoundException',
       'ConflictException',
       'RateLimitException',
       
       # Server errors
       'ServerException',
       'ServiceUnavailableException',
       
       # Tenant
       'TenantNotFoundException',
       'TenantInactiveException',
       
       # Token
       'InvalidTokenException',
       'TokenExpiredException',
       
       # Resource
       'ResourceExistsException',
       
       # Business
       'BusinessRuleException',
   ]
   
   __version__ = '1.0.0'
   ```

2. **Verify imports work correctly**
   ```python
   # Test in Django shell
   from apps.core.exceptions import (
       ValidationException,
       NotFoundException,
       BusinessRuleException,
   )
   
   # Should not raise ImportError
   ```

### Import Patterns

**Individual imports:**
```python
from apps.core.exceptions import ValidationException
from apps.core.exceptions import NotFoundException
```

**Group imports:**
```python
from apps.core.exceptions import (
    ValidationException,
    AuthenticationException,
    PermissionDeniedException,
)
```

**All exceptions:**
```python
from apps.core import exceptions

raise exceptions.ValidationException(...)
```

### Verification Checklist
- [ ] All exception classes imported in __init__.py
- [ ] All classes added to __all__ list
- [ ] Imports grouped logically (base, errors, client, server, etc.)
- [ ] Module docstring updated
- [ ] Import patterns documented
- [ ] Imports tested successfully

---

## Task 30: Document Exception Classes

### Overview
Create comprehensive documentation for all exception classes including usage guidelines, examples, and decision flowcharts.

### Dependencies
- Task 29: All exceptions exported

### Instructions

1. **Update docs/exceptions/exceptions.md with all exception classes**

2. **Add exception catalog section**
   ```markdown
   ## Exception Catalog
   
   ### Client Errors (4xx)
   
   #### ValidationException (400)
   **When to use:** Input validation failures, missing fields, invalid formats
   
   **Example:**
   ```python
   raise ValidationException(
       message='Invalid email format',
       details={'email': ['Must be valid email']}
   )
   ```
   
   #### AuthenticationException (401)
   **When to use:** Login failures, invalid credentials
   
   **Example:**
   ```python
   raise AuthenticationException(
       message='Invalid credentials'
   )
   ```
   
   #### PermissionDeniedException (403)
   **When to use:** User lacks required permission
   
   **Example:**
   ```python
   raise PermissionDeniedException(
       message='Admin access required',
       details={'required_role': 'admin'}
   )
   ```
   
   #### NotFoundException (404)
   **When to use:** Resource doesn't exist
   
   **Example:**
   ```python
   raise NotFoundException(
       message='Product not found',
       details={'product_id': 123}
   )
   ```
   
   #### ConflictException (409)
   **When to use:** State conflicts, duplicate resources
   
   **Example:**
   ```python
   raise ConflictException(
       message='Email already registered',
       details={'email': 'user@example.com'}
   )
   ```
   
   #### RateLimitException (429)
   **When to use:** Too many requests
   
   **Example:**
   ```python
   raise RateLimitException(
       message='Rate limit exceeded',
       details={'retry_after': 3600}
   )
   ```
   
   ### Server Errors (5xx)
   
   #### ServerException (500)
   **When to use:** Unexpected server errors
   
   **Example:**
   ```python
   raise ServerException(
       message='Payment processing failed'
   )
   ```
   
   #### ServiceUnavailableException (503)
   **When to use:** Maintenance, service down
   
   **Example:**
   ```python
   raise ServiceUnavailableException(
       message='Under maintenance',
       details={'retry_after': 1800}
   )
   ```
   
   ### Specialized Exceptions
   
   #### TenantNotFoundException (404)
   **When to use:** Domain doesn't map to tenant
   
   #### TenantInactiveException (403)
   **When to use:** Tenant subscription expired
   
   #### InvalidTokenException (401)
   **When to use:** JWT token is invalid
   
   #### TokenExpiredException (401)
   **When to use:** JWT token has expired
   
   #### ResourceExistsException (409)
   **When to use:** Creating duplicate resource
   
   #### BusinessRuleException (400/422)
   **When to use:** Business logic violations
   ```

3. **Add decision flowchart**
   ```markdown
   ## Exception Selection Flowchart
   
   ```
   Is it a validation error?
   ├─ Yes → ValidationException (400)
   └─ No
       ├─ Is user not authenticated?
       │   ├─ Yes → AuthenticationException (401)
       │   │   ├─ Token issue? → InvalidTokenException/TokenExpiredException
       │   │   └─ Credentials issue? → AuthenticationException
       │   └─ No
       │       ├─ User lacks permission?
       │       │   ├─ Yes → PermissionDeniedException (403)
       │       │   │   └─ Tenant inactive? → TenantInactiveException
       │       │   └─ No
       │       │       ├─ Resource not found?
       │       │       │   ├─ Yes → NotFoundException (404)
       │       │       │   │   └─ Tenant not found? → TenantNotFoundException
       │       │       │   └─ No
       │       │       │       ├─ Duplicate/conflict?
       │       │       │       │   ├─ Yes → ConflictException (409)
       │       │       │       │   │   └─ Resource exists? → ResourceExistsException
       │       │       │       │   └─ No
       │       │       │       │       ├─ Rate limit exceeded?
       │       │       │       │       │   ├─ Yes → RateLimitException (429)
       │       │       │       │       │   └─ No
       │       │       │       │       │       ├─ Business rule violation?
       │       │       │       │       │       │   ├─ Yes → BusinessRuleException (400/422)
       │       │       │       │       │       │   └─ No
       │       │       │       │       │       │       ├─ Service unavailable?
       │       │       │       │       │       │       │   ├─ Yes → ServiceUnavailableException (503)
       │       │       │       │       │       │       │   └─ No → ServerException (500)
   ```
   ```

4. **Add best practices section**
   ```markdown
   ## Best Practices
   
   ### 1. Choose the Right Exception
   - Use specific exceptions over generic APIException
   - Match HTTP status semantics
   - Consider client's perspective
   
   ### 2. Provide Helpful Details
   - Include field names for validation errors
   - Add resource IDs for not found errors
   - Suggest corrective actions
   - Don't expose sensitive data
   
   ### 3. Write Clear Messages
   - User-friendly language
   - Specific about what went wrong
   - Actionable when possible
   - Avoid technical jargon
   
   ### 4. Security Considerations
   - Don't leak internal paths
   - Generic messages for 500 errors in production
   - Avoid exposing user existence (404 vs 403)
   - Log sensitive details, don't return them
   
   ### 5. Consistency
   - Use same exception for same scenarios
   - Follow error code conventions
   - Maintain consistent message formats
   ```

5. **Add quick reference table**
   ```markdown
   ## Quick Reference
   
   | HTTP | Exception | Use Case |
   |------|-----------|----------|
   | 400 | ValidationException | Invalid input |
   | 400 | BusinessRuleException | Business rule violated |
   | 401 | AuthenticationException | Login failed |
   | 401 | InvalidTokenException | Token invalid |
   | 401 | TokenExpiredException | Token expired |
   | 403 | PermissionDeniedException | No permission |
   | 403 | TenantInactiveException | Tenant inactive |
   | 404 | NotFoundException | Resource not found |
   | 404 | TenantNotFoundException | Tenant not found |
   | 409 | ConflictException | State conflict |
   | 409 | ResourceExistsException | Duplicate resource |
   | 429 | RateLimitException | Rate limit hit |
   | 500 | ServerException | Server error |
   | 503 | ServiceUnavailableException | Service down |
   ```

### Verification Checklist
- [ ] Exception catalog complete
- [ ] All exceptions documented
- [ ] Usage examples for each exception
- [ ] Decision flowchart added
- [ ] Best practices documented
- [ ] Quick reference table added
- [ ] Security considerations noted
- [ ] Sri Lanka-specific examples included

---

## Group B Summary

### Completed Tasks
✅ Task 15: ValidationException  
✅ Task 16: AuthenticationException  
✅ Task 17: PermissionDeniedException  
✅ Task 18: NotFoundException  
✅ Task 19: ConflictException  
✅ Task 20: RateLimitException  
✅ Task 21: ServerException  
✅ Task 22: ServiceUnavailableException  
✅ Task 23: TenantNotFoundException  
✅ Task 24: TenantInactiveException  
✅ Task 25: InvalidTokenException  
✅ Task 26: TokenExpiredException  
✅ Task 27: ResourceExistsException  
✅ Task 28: BusinessRuleException  
✅ Task 29: Export All Exceptions  
✅ Task 30: Document Exception Classes  

### Files Created/Updated
```
backend/
├── apps/core/
│   └── exceptions/
│       ├── __init__.py (updated with all exports)
│       └── api_exceptions.py (14 exception classes)
└── docs/exceptions/
    └── exceptions.md (updated with catalog)
```

### Exception Classes Created (14 total)
1. ValidationException (400)
2. AuthenticationException (401)
3. PermissionDeniedException (403)
4. NotFoundException (404)
5. ConflictException (409)
6. RateLimitException (429)
7. ServerException (500)
8. ServiceUnavailableException (503)
9. TenantNotFoundException (404)
10. TenantInactiveException (403)
11. InvalidTokenException (401)
12. TokenExpiredException (401)
13. ResourceExistsException (409)
14. BusinessRuleException (400/422)

### Next Steps
Proceed to **Group C: Global Exception Handler** to create the global exception handler that catches and formats all exceptions.

---

## Notes for AI Agents

- **Complete Coverage:** All HTTP status codes covered
- **Business Rules:** Domain-specific validations
- **Exports:** All exceptions available via single import
- **Documentation:** Comprehensive guide for developers
- **Decision Support:** Flowchart helps choose right exception
- **Best Practices:** Security and consistency guidelines
- **Sri Lanka Context:** Local business rules considered
- **Ready for Handler:** All exceptions ready to be caught and formatted
