# Tasks 75-81: Timezone Middleware

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 06 - Core Middleware Stack  
> **Group:** F - Timezone & Configuration  
> **Document:** 01 of 04  
> **Tasks Covered:** 75, 76, 77, 78, 79, 80, 81

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Group:** [Group-E_Rate-Limiting-Middleware](../Group-E_Rate-Limiting-Middleware/)
- **→ Next Document:** [02_Tasks-82-83_Middleware-Stack-Configuration.md](02_Tasks-82-83_Middleware-Stack-Configuration.md)

---

## Document Overview

This document covers the implementation of the TimezoneMiddleware, which automatically sets the timezone for each request based on user preferences, tenant settings, or defaults to Asia/Colombo (Sri Lanka).

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 75 | Create TimezoneMiddleware File | Simple |
| 76 | Create TimezoneMiddleware Class | Simple |
| 77 | Get Tenant Timezone | Medium |
| 78 | Get User Timezone | Medium |
| 79 | Activate Timezone | Simple |
| 80 | Add Default Timezone | Simple |
| 81 | Register in MIDDLEWARE | Simple |

---

## Task 75: Create TimezoneMiddleware File

### Overview
Create the timezone.py file in the middleware directory to house the TimezoneMiddleware implementation.

### Dependencies
- Group A-E: Core middleware structure exists

### Instructions

1. **Navigate to middleware directory**
   - Path: `backend/apps/core/middleware/`
   - Ensure directory exists from previous groups

2. **Create timezone.py file**
   - File name: `timezone.py`
   - Create with proper file structure

3. **Add file docstring**
   - Document the middleware purpose
   - Explain timezone resolution priority
   - List supported timezone sources

4. **Add imports**
   - Django timezone utilities
   - Python zoneinfo module
   - Logging support

### File Structure

```python
"""
Timezone Middleware

Automatically activates timezone for each request based on:
1. User profile timezone setting (highest priority)
2. Tenant timezone setting
3. Default timezone: Asia/Colombo (Sri Lanka)

This ensures all datetime operations are timezone-aware throughout
the request lifecycle.
"""

import logging
import zoneinfo
from django.utils import timezone

logger = logging.getLogger(__name__)


# TimezoneMiddleware class will be added in next task
```

### Import Details
| Import | Purpose |
|--------|---------|
| **logging** | Log timezone activation issues |
| **zoneinfo** | Python 3.9+ timezone support |
| **django.utils.timezone** | Django timezone utilities |

### Expected Outcome
- timezone.py file created in middleware directory
- File has proper docstring and imports
- Ready for middleware class implementation

### Verification Checklist
- [ ] File created at `backend/apps/core/middleware/timezone.py`
- [ ] File docstring explains timezone resolution
- [ ] All required imports added
- [ ] Logger configured for debugging
- [ ] File follows project structure conventions

---

## Task 76: Create TimezoneMiddleware Class

### Overview
Implement the TimezoneMiddleware class with standard Django middleware structure.

### Dependencies
- Task 75: Create TimezoneMiddleware File

### Instructions

1. **Define TimezoneMiddleware class**
   - Standard Django middleware interface
   - Store get_response callable
   - Implement __call__ method

2. **Add class docstring**
   - Explain timezone activation process
   - Document resolution priority
   - Note default timezone

3. **Implement __init__ method**
   - Accept and store get_response
   - Initialize any class-level attributes

4. **Implement __call__ method**
   - Get timezone for request
   - Activate timezone
   - Process request
   - Return response

5. **Add DEFAULT_TIMEZONE constant**
   - Set to 'Asia/Colombo' for Sri Lanka
   - Class-level constant

### Class Structure

```python
class TimezoneMiddleware:
    """
    Middleware to activate timezone for each request.
    
    Timezone resolution priority:
    1. User profile timezone (if authenticated)
    2. Tenant timezone setting
    3. Default: Asia/Colombo (Sri Lanka)
    
    The activated timezone affects all datetime operations
    in views, models, and templates for the current request.
    """
    
    DEFAULT_TIMEZONE = 'Asia/Colombo'
    
    def __init__(self, get_response):
        """
        Initialize middleware with get_response callable.
        
        Args:
            get_response: Next middleware or view in the chain
        """
        self.get_response = get_response
        logger.info("TimezoneMiddleware initialized")
    
    def __call__(self, request):
        """
        Process request and activate appropriate timezone.
        
        Args:
            request: HttpRequest object
            
        Returns:
            HttpResponse object
        """
        # Get timezone from user, tenant, or default
        tz_name = self._get_timezone(request)
        
        # Activate timezone for this request
        if tz_name:
            try:
                tz = zoneinfo.ZoneInfo(tz_name)
                timezone.activate(tz)
                logger.debug(f"Activated timezone: {tz_name}")
            except Exception as e:
                logger.warning(
                    f"Failed to activate timezone '{tz_name}': {e}. "
                    f"Using default timezone."
                )
                timezone.deactivate()
        else:
            timezone.deactivate()
        
        # Process request
        response = self.get_response(request)
        
        # Deactivate timezone after request
        timezone.deactivate()
        
        return response
    
    def _get_timezone(self, request):
        """
        Get timezone name for the current request.
        
        Will be implemented in next tasks.
        
        Args:
            request: HttpRequest object
            
        Returns:
            str: Timezone name or None
        """
        # Implementation will be added in Tasks 77-80
        return self.DEFAULT_TIMEZONE
```

### Middleware Flow
```
Request arrives
    ↓
Get timezone (user → tenant → default)
    ↓
Activate timezone with zoneinfo.ZoneInfo
    ↓
Process request through chain
    ↓
Deactivate timezone
    ↓
Return response
```

### Error Handling
| Error Type | Handling | Fallback |
|-----------|----------|----------|
| **Invalid timezone** | Log warning | Deactivate timezone |
| **Missing zoneinfo** | Log error | Use UTC |
| **Attribute error** | Log warning | Use default |

### Expected Outcome
- TimezoneMiddleware class fully implemented
- Standard middleware interface followed
- Error handling in place
- Ready for timezone resolution logic

### Verification Checklist
- [ ] Class inherits from object (implicit)
- [ ] `__init__` stores get_response
- [ ] `__call__` method processes request
- [ ] DEFAULT_TIMEZONE = 'Asia/Colombo'
- [ ] Error handling with try/except
- [ ] Logging at appropriate levels
- [ ] timezone.deactivate() called after request

---

## Task 77: Get Tenant Timezone

### Overview
Implement logic to retrieve timezone from the tenant settings.

### Dependencies
- Task 76: Create TimezoneMiddleware Class
- Phase 02: Tenant model with timezone field

### Instructions

1. **Check for tenant attribute**
   - Verify request.tenant exists
   - Handle case where tenant is None

2. **Get tenant timezone**
   - Access tenant.timezone attribute
   - Return timezone name string

3. **Add error handling**
   - Catch AttributeError if tenant lacks timezone
   - Log any issues
   - Return None if unavailable

4. **Add to _get_timezone method**
   - Check tenant after user check
   - Priority: User → Tenant → Default

### Implementation

```python
def _get_timezone(self, request):
    """
    Get timezone name for the current request.
    
    Priority:
    1. User profile timezone (highest)
    2. Tenant timezone setting
    3. Default: Asia/Colombo
    
    Args:
        request: HttpRequest object
        
    Returns:
        str: Timezone name or None
    """
    # Priority 1: User timezone (will be implemented in Task 78)
    # user_tz = self._get_user_timezone(request)
    # if user_tz:
    #     return user_tz
    
    # Priority 2: Tenant timezone
    tenant_tz = self._get_tenant_timezone(request)
    if tenant_tz:
        return tenant_tz
    
    # Priority 3: Default timezone (will be added in Task 80)
    return self.DEFAULT_TIMEZONE

def _get_tenant_timezone(self, request):
    """
    Get timezone from tenant settings.
    
    Args:
        request: HttpRequest object
        
    Returns:
        str: Timezone name or None
    """
    try:
        # Check if request has tenant attribute
        if not hasattr(request, 'tenant'):
            return None
        
        # Get tenant timezone
        tenant = request.tenant
        if tenant and hasattr(tenant, 'timezone'):
            tz = tenant.timezone
            if tz:
                logger.debug(f"Using tenant timezone: {tz}")
                return tz
    except AttributeError as e:
        logger.debug(f"Tenant timezone not available: {e}")
    except Exception as e:
        logger.warning(f"Error getting tenant timezone: {e}")
    
    return None
```

### Tenant Timezone Flow
```
Check request.tenant exists
    ↓
Get tenant.timezone attribute
    ↓
Validate timezone name
    ↓
Return timezone or None
```

### Error Scenarios
| Scenario | Handling | Result |
|----------|----------|--------|
| **No tenant** | Return None | Continue to user check |
| **No timezone attr** | Catch AttributeError | Return None |
| **None timezone** | Check for truthiness | Return None |
| **Invalid timezone** | Let zoneinfo handle | Log warning |

### Expected Outcome
- Tenant timezone retrieval implemented
- Proper error handling for missing attributes
- Logging for debugging
- Returns None if tenant timezone unavailable

### Verification Checklist
- [ ] `_get_tenant_timezone` method created
- [ ] Checks hasattr(request, 'tenant')
- [ ] Checks hasattr(tenant, 'timezone')
- [ ] Returns timezone string or None
- [ ] Error handling with try/except
- [ ] Debug logging for successful retrieval
- [ ] Warning logging for errors

---

## Task 78: Get User Timezone

### Overview
Implement logic to retrieve timezone from authenticated user's profile.

### Dependencies
- Task 77: Get Tenant Timezone

### Instructions

1. **Check user authentication**
   - Verify request.user exists
   - Check request.user.is_authenticated

2. **Get user timezone**
   - Access user.timezone attribute
   - Could be on User model or related Profile

3. **Add error handling**
   - Handle missing timezone attribute
   - Log retrieval issues
   - Return None if unavailable

4. **Update _get_timezone method**
   - Add user timezone as highest priority
   - Call before tenant check

### Implementation

```python
def _get_timezone(self, request):
    """
    Get timezone name for the current request.
    
    Priority:
    1. User profile timezone (highest)
    2. Tenant timezone setting
    3. Default: Asia/Colombo
    
    Args:
        request: HttpRequest object
        
    Returns:
        str: Timezone name
    """
    # Priority 1: User timezone
    user_tz = self._get_user_timezone(request)
    if user_tz:
        return user_tz
    
    # Priority 2: Tenant timezone
    tenant_tz = self._get_tenant_timezone(request)
    if tenant_tz:
        return tenant_tz
    
    # Priority 3: Default timezone
    return self.DEFAULT_TIMEZONE

def _get_user_timezone(self, request):
    """
    Get timezone from authenticated user's profile.
    
    Args:
        request: HttpRequest object
        
    Returns:
        str: Timezone name or None
    """
    try:
        # Check if user is authenticated
        if not hasattr(request, 'user'):
            return None
        
        user = request.user
        if not user or not user.is_authenticated:
            return None
        
        # Try to get timezone from user model
        if hasattr(user, 'timezone'):
            tz = user.timezone
            if tz:
                logger.debug(f"Using user timezone: {tz}")
                return tz
        
        # Try to get timezone from user profile
        if hasattr(user, 'profile') and hasattr(user.profile, 'timezone'):
            tz = user.profile.timezone
            if tz:
                logger.debug(f"Using user profile timezone: {tz}")
                return tz
    
    except AttributeError as e:
        logger.debug(f"User timezone not available: {e}")
    except Exception as e:
        logger.warning(f"Error getting user timezone: {e}")
    
    return None
```

### User Timezone Flow
```
Check user authenticated
    ↓
Try user.timezone
    ↓
Try user.profile.timezone
    ↓
Return timezone or None
```

### User Model Variations
| Location | Check | Priority |
|----------|-------|----------|
| **user.timezone** | Direct attribute | Try first |
| **user.profile.timezone** | Related model | Try second |
| **Custom location** | Adjust as needed | Adapt code |

### Authentication Check
```python
# Proper authentication check
if user and user.is_authenticated:
    # User is authenticated
    
# Avoid:
if user:
    # May be AnonymousUser
```

### Expected Outcome
- User timezone retrieval implemented
- Checks both user model and profile
- Highest priority in timezone resolution
- Proper authentication checks

### Verification Checklist
- [ ] `_get_user_timezone` method created
- [ ] Checks user.is_authenticated
- [ ] Tries user.timezone first
- [ ] Tries user.profile.timezone second
- [ ] Returns timezone string or None
- [ ] Error handling with try/except
- [ ] Debug logging for successful retrieval

---

## Task 79: Activate Timezone

### Overview
Ensure timezone is properly activated using Django's timezone.activate() with zoneinfo.

### Dependencies
- Task 78: Get User Timezone

### Instructions

1. **Review activation code**
   - Already implemented in __call__ method
   - Uses timezone.activate() with zoneinfo.ZoneInfo

2. **Verify error handling**
   - Catches invalid timezone names
   - Falls back to deactivate on error
   - Logs warnings for issues

3. **Add validation**
   - Ensure timezone name is string
   - Check for empty strings
   - Handle None values

4. **Test activation**
   - Verify timezone is active in views
   - Check datetime operations use correct timezone

### Activation Implementation

```python
def __call__(self, request):
    """
    Process request and activate appropriate timezone.
    
    Args:
        request: HttpRequest object
        
    Returns:
        HttpResponse object
    """
    # Get timezone from user, tenant, or default
    tz_name = self._get_timezone(request)
    
    # Activate timezone for this request
    if tz_name:
        try:
            # Validate timezone name
            if not isinstance(tz_name, str) or not tz_name.strip():
                logger.warning(f"Invalid timezone name: {tz_name}")
                timezone.deactivate()
            else:
                # Create ZoneInfo object and activate
                tz = zoneinfo.ZoneInfo(tz_name)
                timezone.activate(tz)
                logger.debug(f"Activated timezone: {tz_name}")
        except zoneinfo.ZoneInfoNotFoundError as e:
            logger.warning(
                f"Timezone '{tz_name}' not found: {e}. "
                f"Using default timezone."
            )
            timezone.deactivate()
        except Exception as e:
            logger.error(
                f"Failed to activate timezone '{tz_name}': {e}. "
                f"Using default timezone."
            )
            timezone.deactivate()
    else:
        timezone.deactivate()
    
    # Process request
    response = self.get_response(request)
    
    # Always deactivate timezone after request
    timezone.deactivate()
    
    return response
```

### Activation Flow
```
Get timezone name
    ↓
Validate name (string, not empty)
    ↓
Create zoneinfo.ZoneInfo(tz_name)
    ↓
Call timezone.activate(tz)
    ↓
Process request
    ↓
Call timezone.deactivate()
```

### Error Types
| Error | Cause | Handling |
|-------|-------|----------|
| **ZoneInfoNotFoundError** | Invalid timezone name | Log warning, deactivate |
| **TypeError** | Non-string timezone | Log warning, deactivate |
| **General Exception** | Unexpected error | Log error, deactivate |

### Timezone Deactivation
```python
# Always deactivate after request
try:
    response = self.get_response(request)
finally:
    timezone.deactivate()
```

### Expected Outcome
- Timezone activation with proper error handling
- Invalid timezones handled gracefully
- Timezone always deactivated after request
- Comprehensive logging

### Verification Checklist
- [ ] timezone.activate() called with ZoneInfo object
- [ ] Catches ZoneInfoNotFoundError specifically
- [ ] Validates timezone name before activation
- [ ] timezone.deactivate() always called
- [ ] Logging at appropriate levels
- [ ] Error messages are descriptive

---

## Task 80: Add Default Timezone

### Overview
Ensure the default timezone (Asia/Colombo) is properly used when no user or tenant timezone is available.

### Dependencies
- Task 79: Activate Timezone

### Instructions

1. **Review DEFAULT_TIMEZONE constant**
   - Already set to 'Asia/Colombo'
   - Class-level constant

2. **Verify fallback logic**
   - Used in _get_timezone method
   - Returns DEFAULT_TIMEZONE at end

3. **Document timezone choice**
   - Sri Lanka's timezone
   - Matches business location
   - UTC+5:30 offset

4. **Consider configuration**
   - Could be moved to settings.py
   - Allow deployment-specific defaults

### Default Timezone Implementation

```python
class TimezoneMiddleware:
    """
    Middleware to activate timezone for each request.
    
    Default timezone is Asia/Colombo (Sri Lanka, UTC+5:30)
    which matches the primary business location.
    """
    
    # Default timezone for Sri Lanka
    DEFAULT_TIMEZONE = 'Asia/Colombo'
    
    def __init__(self, get_response):
        self.get_response = get_response
        logger.info(
            f"TimezoneMiddleware initialized with default "
            f"timezone: {self.DEFAULT_TIMEZONE}"
        )
    
    def _get_timezone(self, request):
        """
        Get timezone name for the current request.
        
        Returns default timezone if user and tenant
        timezones are not available.
        """
        # Priority 1: User timezone
        user_tz = self._get_user_timezone(request)
        if user_tz:
            return user_tz
        
        # Priority 2: Tenant timezone
        tenant_tz = self._get_tenant_timezone(request)
        if tenant_tz:
            return tenant_tz
        
        # Priority 3: Default timezone (Sri Lanka)
        logger.debug(f"Using default timezone: {self.DEFAULT_TIMEZONE}")
        return self.DEFAULT_TIMEZONE
```

### Timezone Information
| Timezone | Location | UTC Offset | DST |
|----------|----------|------------|-----|
| **Asia/Colombo** | Sri Lanka | +5:30 | No |

### Alternative: Settings-Based Default

```python
# In settings/base.py
DEFAULT_TIMEZONE = 'Asia/Colombo'

# In middleware
from django.conf import settings

class TimezoneMiddleware:
    DEFAULT_TIMEZONE = getattr(
        settings, 
        'DEFAULT_TIMEZONE', 
        'Asia/Colombo'
    )
```

### Expected Outcome
- Default timezone properly configured
- Falls back to Asia/Colombo consistently
- Documented and logged
- Can be configured via settings if needed

### Verification Checklist
- [ ] DEFAULT_TIMEZONE = 'Asia/Colombo'
- [ ] Used as final fallback in _get_timezone
- [ ] Logged when default is used
- [ ] Class docstring mentions default
- [ ] Initialization log shows default timezone

---

## Task 81: Register in MIDDLEWARE

### Overview
Add TimezoneMiddleware to the MIDDLEWARE setting in Django settings.

### Dependencies
- Task 80: Add Default Timezone
- All middleware classes complete

### Instructions

1. **Locate MIDDLEWARE setting**
   - File: `backend/settings/base.py`
   - Find MIDDLEWARE list

2. **Add TimezoneMiddleware**
   - Path: `'apps.core.middleware.timezone.TimezoneMiddleware'`
   - Position: After AuthenticationMiddleware, before MessageMiddleware

3. **Verify middleware order**
   - Tenant resolution first
   - Authentication before timezone
   - Timezone before messages

4. **Update middleware __init__.py**
   - Export TimezoneMiddleware
   - Add to __all__ list

### MIDDLEWARE Configuration

```python
# settings/base.py

MIDDLEWARE = [
    # Security first
    'django.middleware.security.SecurityMiddleware',
    
    # CORS before other processing
    'corsheaders.middleware.CorsMiddleware',
    
    # Tenant resolution early (from django-tenants)
    'django_tenants.middleware.main.TenantMainMiddleware',
    
    # Custom security headers
    'apps.core.middleware.security.SecurityHeadersMiddleware',
    
    # Rate limiting before expensive operations
    'apps.core.middleware.ratelimit.RateLimitMiddleware',
    
    # Session handling
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    
    # Authentication (needed for user timezone)
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    
    # Request logging (after auth for user context)
    'apps.core.middleware.logging.RequestLoggingMiddleware',
    
    # Timezone activation (after auth for user timezone)
    'apps.core.middleware.timezone.TimezoneMiddleware',
    
    # Messages framework
    'django.contrib.messages.middleware.MessageMiddleware',
    
    # Clickjacking protection
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]
```

### Middleware Order Rationale

| Position | Middleware | Reason |
|----------|-----------|--------|
| **1** | SecurityMiddleware | SSL redirect, security headers |
| **2** | CorsMiddleware | CORS headers before processing |
| **3** | TenantMainMiddleware | Resolve tenant early |
| **4** | SecurityHeadersMiddleware | Custom security headers |
| **5** | RateLimitMiddleware | Block before expensive ops |
| **6** | SessionMiddleware | Session required for auth |
| **7** | AuthenticationMiddleware | User required for timezone |
| **8** | RequestLoggingMiddleware | Log with user context |
| **9** | TimezoneMiddleware | Set timezone for request |
| **10** | MessageMiddleware | Display messages |

### Update Middleware __init__.py

```python
# apps/core/middleware/__init__.py

from .base import BaseMiddleware
from .tenant import TenantMiddleware
from .logging import RequestLoggingMiddleware
from .security import SecurityHeadersMiddleware
from .ratelimit import RateLimitMiddleware
from .timezone import TimezoneMiddleware

__all__ = [
    'BaseMiddleware',
    'TenantMiddleware',
    'RequestLoggingMiddleware',
    'SecurityHeadersMiddleware',
    'RateLimitMiddleware',
    'TimezoneMiddleware',
]
```

### Expected Outcome
- TimezoneMiddleware registered in MIDDLEWARE
- Correct position in middleware stack
- Exported from middleware __init__.py
- Ready for testing

### Verification Checklist
- [ ] TimezoneMiddleware added to MIDDLEWARE
- [ ] Position after AuthenticationMiddleware
- [ ] Position before MessageMiddleware
- [ ] Middleware order follows rationale
- [ ] Exported from middleware/__init__.py
- [ ] Added to __all__ list

---

## Group F Next Steps

After completing Tasks 75-81, proceed to:
- **Next Document:** [02_Tasks-82-83_Middleware-Stack-Configuration.md](02_Tasks-82-83_Middleware-Stack-Configuration.md)
- Finalize complete MIDDLEWARE setting
- Verify middleware order
- Document middleware stack

---

## Notes for AI Agents

1. **zoneinfo Module:** Python 3.9+ built-in, no pip install needed
2. **Timezone Names:** Use IANA timezone database names (e.g., 'Asia/Colombo')
3. **Priority Order:** User > Tenant > Default (highest to lowest)
4. **Deactivation:** Always deactivate timezone after request
5. **Error Handling:** Catch ZoneInfoNotFoundError for invalid timezones
6. **Logging:** Debug for normal flow, warning for issues
7. **Authentication:** Check user.is_authenticated before accessing timezone
8. **Middleware Position:** Must be after AuthenticationMiddleware

