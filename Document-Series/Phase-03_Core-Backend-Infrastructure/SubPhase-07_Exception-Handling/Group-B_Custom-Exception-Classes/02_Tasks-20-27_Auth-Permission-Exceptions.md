# Tasks 20-27: Auth & Permission Exceptions

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 07 - Exception Handling  
> **Group:** B - Custom Exception Classes  
> **Document:** 02 of 03  
> **Tasks Covered:** 20, 21, 22, 23, 24, 25, 26, 27

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-15-19_Client-Error-Exceptions.md](01_Tasks-15-19_Client-Error-Exceptions.md)
- **→ Next Document:** [03_Tasks-28-30_Server-Business-Exceptions.md](03_Tasks-28-30_Server-Business-Exceptions.md)

---

## Document Overview

This document covers additional authentication, authorization, and specialized exception classes including rate limiting, tenant-specific exceptions, and token-related errors.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 20 | Create RateLimitException | Medium |
| 21 | Create ServerException | Medium |
| 22 | Create ServiceUnavailableException | Medium |
| 23 | Create TenantNotFoundException | Medium |
| 24 | Create TenantInactiveException | Medium |
| 25 | Create InvalidTokenException | Medium |
| 26 | Create TokenExpiredException | Medium |
| 27 | Create ResourceExistsException | Medium |

---

## Task 20: Create RateLimitException

### Overview
Create the RateLimitException for handling rate limit violations. This is raised when a client exceeds the allowed request rate.

### Dependencies
- Task 19: ConflictException created

### Instructions

1. **Add RateLimitException to api_exceptions.py**
   ```python
   class RateLimitException(APIException):
       """
       Exception raised when rate limit is exceeded.
       
       This exception should be used for:
       - Too many requests from same IP
       - API throttling violations
       - Burst limit exceeded
       - Daily/hourly quota exceeded
       
       HTTP Status: 429 Too Many Requests
       
       Example:
           >>> raise RateLimitException(
           ...     message='Rate limit exceeded',
           ...     details={
           ...         'limit': 100,
           ...         'window': '1 hour',
           ...         'retry_after': 3600
           ...     }
           ... )
       """
       
       default_error_code = ErrorCode.RATE_LIMIT_EXCEEDED
       default_message = 'Rate limit exceeded'
       default_status_code = 429
   ```

### Rate Limiting Context
Include these fields in details dict:
- **limit:** Maximum requests allowed
- **window:** Time window (e.g., "1 hour", "1 minute")
- **retry_after:** Seconds until retry allowed
- **current_count:** Current request count (optional)

### Usage Example
```python
from apps.core.exceptions import RateLimitException
from django.core.cache import cache

def check_rate_limit(user, limit=100, window=3600):
    key = f'rate_limit:{user.id}'
    count = cache.get(key, 0)
    
    if count >= limit:
        raise RateLimitException(
            message=f'Rate limit exceeded. Try again in {window} seconds',
            details={
                'limit': limit,
                'window': f'{window} seconds',
                'retry_after': window,
                'current_count': count
            }
        )
    
    cache.set(key, count + 1, window)
```

### Verification Checklist
- [ ] RateLimitException class created
- [ ] default_error_code set to ErrorCode.RATE_LIMIT_EXCEEDED
- [ ] default_status_code set to 429
- [ ] Details structure documented
- [ ] Usage example included

---

## Task 21: Create ServerException

### Overview
Create the ServerException for handling internal server errors. This is raised when an unexpected error occurs on the server side.

### Dependencies
- Task 20: RateLimitException created

### Instructions

1. **Add ServerException to api_exceptions.py**
   ```python
   class ServerException(APIException):
       """
       Exception raised for internal server errors.
       
       This exception should be used for:
       - Unexpected errors
       - Unhandled exceptions
       - Critical system failures
       - Database errors
       - External service failures
       
       HTTP Status: 500 Internal Server Error
       
       Note: In production, avoid exposing internal details.
       Log full context but return generic message to client.
       
       Example:
           >>> raise ServerException(
           ...     message='An unexpected error occurred',
           ...     details={'component': 'payment_processor'}
           ... )
       """
       
       default_error_code = ErrorCode.SERVER_ERROR
       default_message = 'An unexpected error occurred'
       default_status_code = 500
   ```

### Security Considerations
For 500 errors:
- **Production:** Return generic message, log full details
- **Development:** Can include stack trace in details
- **Never expose:** Database queries, internal paths, credentials

### Usage Example
```python
from apps.core.exceptions import ServerException
import logging

logger = logging.getLogger(__name__)

def process_payment(order):
    try:
        # Payment processing logic
        payment_gateway.charge(order.amount)
    except Exception as e:
        # Log full error internally
        logger.error(f'Payment processing failed: {e}', exc_info=True)
        
        # Raise generic error to client
        raise ServerException(
            message='Payment processing failed. Please try again.',
            details={'order_id': order.id}
        )
```

### Verification Checklist
- [ ] ServerException class created
- [ ] default_error_code set to ErrorCode.SERVER_ERROR
- [ ] default_status_code set to 500
- [ ] Security notes documented
- [ ] Error handling example included

---

## Task 22: Create ServiceUnavailableException

### Overview
Create the ServiceUnavailableException for when the service is temporarily unavailable. This is raised during maintenance or when dependencies are down.

### Dependencies
- Task 21: ServerException created

### Instructions

1. **Add ServiceUnavailableException to api_exceptions.py**
   ```python
   class ServiceUnavailableException(APIException):
       """
       Exception raised when service is temporarily unavailable.
       
       This exception should be used for:
       - Scheduled maintenance
       - System overload
       - Database unavailable
       - External service down
       - Circuit breaker open
       
       HTTP Status: 503 Service Unavailable
       
       Example:
           >>> raise ServiceUnavailableException(
           ...     message='Service temporarily unavailable',
           ...     details={
           ...         'reason': 'scheduled_maintenance',
           ...         'retry_after': 3600
           ...     }
           ... )
       """
       
       default_error_code = ErrorCode.SERVICE_UNAVAILABLE
       default_message = 'Service temporarily unavailable'
       default_status_code = 503
   ```

### Retry-After Header
When raising this exception, include retry_after in details:
```python
details={'retry_after': 3600}  # Seconds until service available
```

The global exception handler can set the Retry-After HTTP header.

### Usage Example
```python
from apps.core.exceptions import ServiceUnavailableException
from django.conf import settings

def check_maintenance_mode():
    if settings.MAINTENANCE_MODE:
        raise ServiceUnavailableException(
            message='System is under maintenance',
            details={
                'reason': 'scheduled_maintenance',
                'retry_after': 1800,  # 30 minutes
                'estimated_completion': '2024-01-17T12:00:00Z'
            }
        )
```

### Verification Checklist
- [ ] ServiceUnavailableException class created
- [ ] default_error_code set to ErrorCode.SERVICE_UNAVAILABLE
- [ ] default_status_code set to 503
- [ ] Retry-After pattern documented
- [ ] Maintenance mode example included

---

## Task 23: Create TenantNotFoundException

### Overview
Create the TenantNotFoundException for when a tenant cannot be found. This is raised when a domain/subdomain doesn't map to any tenant.

### Dependencies
- Task 22: ServiceUnavailableException created

### Instructions

1. **Add TenantNotFoundException to api_exceptions.py**
   ```python
   class TenantNotFoundException(NotFoundException):
       """
       Exception raised when tenant is not found.
       
       This exception should be used for:
       - Invalid subdomain
       - Unknown custom domain
       - Deleted tenant
       - Tenant migration in progress
       
       HTTP Status: 404 Not Found
       
       Example:
           >>> raise TenantNotFoundException(
           ...     message='Tenant not found',
           ...     details={
           ...         'domain': 'example.lankacommerce.lk',
           ...         'suggestion': 'Check your URL and try again'
           ...     }
           ... )
       """
       
       default_error_code = ErrorCode.TENANT_NOT_FOUND
       default_message = 'Tenant not found'
       default_status_code = 404
   ```

### Multi-Tenancy Context
This exception is specific to our multi-tenant architecture where each tenant has:
- **Subdomain:** `tenant.lankacommerce.lk`
- **Custom Domain:** `shop.example.com`
- **Schema:** Separate database schema per tenant

### Usage Example
```python
from apps.core.exceptions import TenantNotFoundException
from apps.tenants.models import Tenant

def get_tenant_from_request(request):
    # Extract subdomain or custom domain
    host = request.get_host()
    
    try:
        tenant = Tenant.objects.get(domain=host)
        return tenant
    except Tenant.DoesNotExist:
        raise TenantNotFoundException(
            message=f'No tenant found for domain: {host}',
            details={
                'domain': host,
                'suggestion': 'Check your URL or contact support'
            }
        )
```

### Verification Checklist
- [ ] TenantNotFoundException class created
- [ ] Inherits from NotFoundException
- [ ] default_error_code set to ErrorCode.TENANT_NOT_FOUND
- [ ] Multi-tenancy context documented
- [ ] Domain lookup example included

---

## Task 24: Create TenantInactiveException

### Overview
Create the TenantInactiveException for when a tenant exists but is inactive. This is raised when a tenant's subscription has expired or account is suspended.

### Dependencies
- Task 23: TenantNotFoundException created

### Instructions

1. **Add TenantInactiveException to api_exceptions.py**
   ```python
   class TenantInactiveException(PermissionDeniedException):
       """
       Exception raised when tenant is inactive or suspended.
       
       This exception should be used for:
       - Expired subscription
       - Suspended account
       - Payment failure
       - Terms of service violation
       - Manual deactivation
       
       HTTP Status: 403 Forbidden
       
       Example:
           >>> raise TenantInactiveException(
           ...     message='Account suspended',
           ...     details={
           ...         'reason': 'subscription_expired',
           ...         'suspended_at': '2024-01-15T00:00:00Z',
           ...         'action_required': 'Renew subscription'
           ...     }
           ... )
       """
       
       default_error_code = ErrorCode.TENANT_INACTIVE
       default_message = 'Tenant account is inactive'
       default_status_code = 403
   ```

### Tenant States
| State | Description | Exception |
|-------|-------------|-----------|
| **Not Found** | Domain doesn't exist | TenantNotFoundException (404) |
| **Inactive** | Exists but not active | TenantInactiveException (403) |
| **Suspended** | Temporarily disabled | TenantInactiveException (403) |
| **Active** | Normal operation | No exception |

### Usage Example
```python
from apps.core.exceptions import TenantInactiveException
from apps.tenants.models import Tenant

def check_tenant_active(tenant):
    if not tenant.is_active:
        reason = 'subscription_expired' if tenant.subscription_expired else 'suspended'
        
        raise TenantInactiveException(
            message='Your account is currently inactive',
            details={
                'reason': reason,
                'tenant_id': tenant.id,
                'suspended_at': tenant.suspended_at.isoformat() if tenant.suspended_at else None,
                'action_required': 'Contact support to reactivate your account'
            }
        )
```

### Verification Checklist
- [ ] TenantInactiveException class created
- [ ] Inherits from PermissionDeniedException
- [ ] default_error_code set to ErrorCode.TENANT_INACTIVE
- [ ] Tenant states documented
- [ ] Subscription check example included

---

## Task 25: Create InvalidTokenException

### Overview
Create the InvalidTokenException for JWT token validation failures. This is raised when a token is malformed or invalid.

### Dependencies
- Task 24: TenantInactiveException created

### Instructions

1. **Add InvalidTokenException to api_exceptions.py**
   ```python
   class InvalidTokenException(AuthenticationException):
       """
       Exception raised when JWT token is invalid.
       
       This exception should be used for:
       - Malformed token
       - Invalid signature
       - Token tampering detected
       - Wrong token type (access vs refresh)
       - Blacklisted token
       
       HTTP Status: 401 Unauthorized
       
       Example:
           >>> raise InvalidTokenException(
           ...     message='Invalid authentication token',
           ...     details={'reason': 'invalid_signature'}
           ... )
       """
       
       default_error_code = ErrorCode.AUTH_TOKEN_INVALID
       default_message = 'Invalid authentication token'
       default_status_code = 401
   ```

### Token Validation Scenarios
| Scenario | Details |
|----------|---------|
| **Malformed** | Not a valid JWT format |
| **Invalid Signature** | Signature verification failed |
| **Wrong Type** | Refresh token used as access token |
| **Blacklisted** | Token revoked/blacklisted |
| **Missing Claims** | Required claims not present |

### Usage Example
```python
from apps.core.exceptions import InvalidTokenException
import jwt

def decode_access_token(token):
    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=['HS256']
        )
        
        # Check token type
        if payload.get('type') != 'access':
            raise InvalidTokenException(
                message='Invalid token type',
                details={'expected': 'access', 'received': payload.get('type')}
            )
        
        return payload
        
    except jwt.InvalidSignatureError:
        raise InvalidTokenException(
            message='Invalid token signature',
            details={'reason': 'invalid_signature'}
        )
    
    except jwt.DecodeError:
        raise InvalidTokenException(
            message='Malformed token',
            details={'reason': 'decode_error'}
        )
```

### Verification Checklist
- [ ] InvalidTokenException class created
- [ ] Inherits from AuthenticationException
- [ ] default_error_code set to ErrorCode.AUTH_TOKEN_INVALID
- [ ] Token validation scenarios documented
- [ ] JWT decode example included

---

## Task 26: Create TokenExpiredException

### Overview
Create the TokenExpiredException for expired JWT tokens. This is raised when a token has passed its expiration time.

### Dependencies
- Task 25: InvalidTokenException created

### Instructions

1. **Add TokenExpiredException to api_exceptions.py**
   ```python
   class TokenExpiredException(AuthenticationException):
       """
       Exception raised when JWT token has expired.
       
       This exception should be used for:
       - Access token expired
       - Refresh token expired
       - Session timeout
       
       HTTP Status: 401 Unauthorized
       
       Note: Client should refresh token using refresh token endpoint.
       
       Example:
           >>> raise TokenExpiredException(
           ...     message='Authentication token expired',
           ...     details={
           ...         'expired_at': '2024-01-17T10:00:00Z',
           ...         'suggestion': 'Refresh your token'
           ...     }
           ... )
       """
       
       default_error_code = ErrorCode.AUTH_TOKEN_EXPIRED
       default_message = 'Authentication token expired'
       default_status_code = 401
   ```

### Token Expiration Flow
1. Client sends request with expired access token
2. API raises TokenExpiredException
3. Client refreshes token using refresh token
4. Client retries request with new access token

### Usage Example
```python
from apps.core.exceptions import TokenExpiredException
import jwt
from datetime import datetime

def decode_access_token(token):
    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=['HS256']
        )
        return payload
        
    except jwt.ExpiredSignatureError:
        # Get expiration time from token (without verification)
        unverified = jwt.decode(token, options={"verify_signature": False})
        expired_at = datetime.fromtimestamp(unverified['exp'])
        
        raise TokenExpiredException(
            message='Authentication token has expired',
            details={
                'expired_at': expired_at.isoformat(),
                'suggestion': 'Use refresh token to get new access token'
            }
        )
```

### Verification Checklist
- [ ] TokenExpiredException class created
- [ ] Inherits from AuthenticationException
- [ ] default_error_code set to ErrorCode.AUTH_TOKEN_EXPIRED
- [ ] Token refresh flow documented
- [ ] Expiration handling example included

---

## Task 27: Create ResourceExistsException

### Overview
Create the ResourceExistsException for duplicate resource creation attempts. This is a specific type of ConflictException for resource duplication.

### Dependencies
- Task 26: TokenExpiredException created

### Instructions

1. **Add ResourceExistsException to api_exceptions.py**
   ```python
   class ResourceExistsException(ConflictException):
       """
       Exception raised when attempting to create duplicate resource.
       
       This exception should be used for:
       - Unique constraint violations
       - Duplicate resource creation
       - Resource already exists checks
       
       HTTP Status: 409 Conflict
       
       Example:
           >>> raise ResourceExistsException(
           ...     message='Product SKU already exists',
           ...     details={
           ...         'field': 'sku',
           ...         'value': 'PROD-001',
           ...         'existing_id': 123
           ...     }
           ... )
       """
       
       default_error_code = ErrorCode.RESOURCE_ALREADY_EXISTS
       default_message = 'Resource already exists'
       default_status_code = 409
   ```

### ConflictException vs ResourceExistsException
| Exception | When to Use |
|-----------|-------------|
| **ConflictException** | Generic conflicts, state transitions |
| **ResourceExistsException** | Specific to duplicate resources |

### Usage Example
```python
from apps.core.exceptions import ResourceExistsException
from django.db import IntegrityError

def create_product(data):
    try:
        product = Product.objects.create(**data)
        return product
        
    except IntegrityError as e:
        # Check if it's a unique constraint violation
        if 'sku' in str(e):
            # Try to find existing product
            existing = Product.objects.filter(sku=data['sku']).first()
            
            raise ResourceExistsException(
                message=f"Product with SKU '{data['sku']}' already exists",
                details={
                    'field': 'sku',
                    'value': data['sku'],
                    'existing_id': existing.id if existing else None,
                    'suggestion': 'Use a different SKU or update existing product'
                }
            )
        
        # Re-raise for other integrity errors
        raise
```

### Verification Checklist
- [ ] ResourceExistsException class created
- [ ] Inherits from ConflictException
- [ ] default_error_code set to ErrorCode.RESOURCE_ALREADY_EXISTS
- [ ] Distinction from ConflictException documented
- [ ] Duplicate detection example included

---

## Complete Implementation Update

### Updated api_exceptions.py File
Add all new exceptions to the file:

```python
# ... (previous exceptions: Validation, Authentication, Permission, NotFound, Conflict)

class RateLimitException(APIException):
    """Rate limit exceeded exception."""
    default_error_code = ErrorCode.RATE_LIMIT_EXCEEDED
    default_message = 'Rate limit exceeded'
    default_status_code = 429


class ServerException(APIException):
    """Internal server error exception."""
    default_error_code = ErrorCode.SERVER_ERROR
    default_message = 'An unexpected error occurred'
    default_status_code = 500


class ServiceUnavailableException(APIException):
    """Service unavailable exception."""
    default_error_code = ErrorCode.SERVICE_UNAVAILABLE
    default_message = 'Service temporarily unavailable'
    default_status_code = 503


class TenantNotFoundException(NotFoundException):
    """Tenant not found exception."""
    default_error_code = ErrorCode.TENANT_NOT_FOUND
    default_message = 'Tenant not found'
    default_status_code = 404


class TenantInactiveException(PermissionDeniedException):
    """Tenant inactive exception."""
    default_error_code = ErrorCode.TENANT_INACTIVE
    default_message = 'Tenant account is inactive'
    default_status_code = 403


class InvalidTokenException(AuthenticationException):
    """Invalid JWT token exception."""
    default_error_code = ErrorCode.AUTH_TOKEN_INVALID
    default_message = 'Invalid authentication token'
    default_status_code = 401


class TokenExpiredException(AuthenticationException):
    """Expired JWT token exception."""
    default_error_code = ErrorCode.AUTH_TOKEN_EXPIRED
    default_message = 'Authentication token expired'
    default_status_code = 401


class ResourceExistsException(ConflictException):
    """Resource already exists exception."""
    default_error_code = ErrorCode.RESOURCE_ALREADY_EXISTS
    default_message = 'Resource already exists'
    default_status_code = 409
```

### Update __init__.py Exports
```python
from .api_exceptions import (
    ValidationException,
    AuthenticationException,
    PermissionDeniedException,
    NotFoundException,
    ConflictException,
    RateLimitException,
    ServerException,
    ServiceUnavailableException,
    TenantNotFoundException,
    TenantInactiveException,
    InvalidTokenException,
    TokenExpiredException,
    ResourceExistsException,
)

__all__ = [
    # ... existing exports ...
    'RateLimitException',
    'ServerException',
    'ServiceUnavailableException',
    'TenantNotFoundException',
    'TenantInactiveException',
    'InvalidTokenException',
    'TokenExpiredException',
    'ResourceExistsException',
]
```

---

## Testing Additional Exceptions

### Unit Tests
```python
class TestAdditionalExceptions:
    """Tests for additional exception classes."""
    
    def test_rate_limit_exception(self):
        """Test RateLimitException defaults."""
        exc = RateLimitException()
        assert exc.status_code == 429
        assert exc.error_code == ErrorCode.RATE_LIMIT_EXCEEDED
    
    def test_server_exception(self):
        """Test ServerException defaults."""
        exc = ServerException()
        assert exc.status_code == 500
        assert exc.error_code == ErrorCode.SERVER_ERROR
    
    def test_service_unavailable_exception(self):
        """Test ServiceUnavailableException defaults."""
        exc = ServiceUnavailableException()
        assert exc.status_code == 503
        assert exc.error_code == ErrorCode.SERVICE_UNAVAILABLE
    
    def test_tenant_not_found_exception(self):
        """Test TenantNotFoundException inheritance."""
        exc = TenantNotFoundException()
        assert exc.status_code == 404
        assert isinstance(exc, NotFoundException)
    
    def test_tenant_inactive_exception(self):
        """Test TenantInactiveException inheritance."""
        exc = TenantInactiveException()
        assert exc.status_code == 403
        assert isinstance(exc, PermissionDeniedException)
    
    def test_invalid_token_exception(self):
        """Test InvalidTokenException inheritance."""
        exc = InvalidTokenException()
        assert exc.status_code == 401
        assert isinstance(exc, AuthenticationException)
    
    def test_token_expired_exception(self):
        """Test TokenExpiredException inheritance."""
        exc = TokenExpiredException()
        assert exc.status_code == 401
        assert isinstance(exc, AuthenticationException)
    
    def test_resource_exists_exception(self):
        """Test ResourceExistsException inheritance."""
        exc = ResourceExistsException()
        assert exc.status_code == 409
        assert isinstance(exc, ConflictException)
```

---

## Next Steps

After completing these tasks, proceed to:
1. **Task 28-30:** Create BusinessRuleException and finalize Group B
2. **Group C:** Create global exception handler
3. **Group D:** Create error response formatting

The authentication and permission exceptions are now complete.

---

## Notes for AI Agents

- **Inheritance:** Use inheritance to group related exceptions
- **Token Exceptions:** Inherit from AuthenticationException
- **Tenant Exceptions:** Multi-tenancy specific errors
- **Rate Limiting:** Include retry_after in details
- **Server Errors:** Generic messages in production, detailed logs
- **Testing:** Verify inheritance chain and status codes
- **Documentation:** Keep token flow and tenant states clear
