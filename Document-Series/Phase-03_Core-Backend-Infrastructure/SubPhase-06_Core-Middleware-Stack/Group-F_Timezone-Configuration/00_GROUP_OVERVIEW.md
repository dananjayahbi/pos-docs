# Group F: Timezone & Configuration

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 06 - Core Middleware Stack  
> **Group:** F of F  
> **Tasks Covered:** 75-88  
> **Group Goal:** Implement timezone middleware and finalize middleware stack configuration

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-E_Rate-Limiting-Middleware](../Group-E_Rate-Limiting-Middleware/)
- **→ Next SubPhase:** [SubPhase-07_Exception-Handling](../../SubPhase-07_Exception-Handling/)

---

## Group Overview

This group creates the TimezoneMiddleware for timezone-aware datetime handling and finalizes the complete middleware stack configuration with proper ordering, testing, and documentation.

### Key Components
- **TimezoneMiddleware:** Set timezone per request
- **Timezone Resolution:** Tenant → User → Default
- **Middleware Stack:** Complete ordered configuration
- **Test Suite:** Comprehensive middleware tests
- **Documentation:** Complete middleware docs

### Timezone Priority
1. User profile timezone setting
2. Tenant timezone setting
3. Default: Asia/Colombo (Sri Lanka)

### Final Middleware Stack
```python
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django_tenants.middleware.main.TenantMainMiddleware',
    'apps.core.middleware.security.SecurityHeadersMiddleware',
    'apps.core.middleware.ratelimit.RateLimitMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'apps.core.middleware.logging.RequestLoggingMiddleware',
    'apps.core.middleware.timezone.TimezoneMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
]
```

---

## Documents in This Group

| Document # | Document Name | Tasks Covered | Description |
|------------|---------------|---------------|-------------|
| DOC-01 | Timezone Middleware | Tasks 75-81 | Timezone middleware implementation |
| DOC-02 | Middleware Stack Configuration | Tasks 82-83 | Final MIDDLEWARE setting |
| DOC-03 | Test Suite | Tasks 84-85 | Comprehensive middleware tests |
| DOC-04 | Documentation | Tasks 86-88 | Docs and verification |

---

## Task Summary

| Task # | Task Name | Key Points |
|--------|-----------|------------|
| 75 | Create TimezoneMiddleware File | timezone.py |
| 76 | Create TimezoneMiddleware Class | Main class |
| 77 | Get Tenant Timezone | From tenant settings |
| 78 | Get User Timezone | From user profile |
| 79 | Activate Timezone | timezone.activate() |
| 80 | Add Default Timezone | Asia/Colombo fallback |
| 81 | Register in MIDDLEWARE | Add to settings |
| 82 | Update MIDDLEWARE Setting | Complete stack |
| 83 | Verify Middleware Order | Correct ordering |
| 84 | Create Middleware Tests Suite | All middleware tests |
| 85 | Test Middleware Integration | End-to-end tests |
| 86 | Document All Middleware | Complete documentation |
| 87 | Create Middleware README | Usage guide |
| 88 | Verify Server Starts | Final verification |

---

## Execution Order

```
[Tasks 75-81: Timezone Middleware]
        │
        ▼
[Tasks 82-83: Stack Configuration]
        │
        ▼
[Tasks 84-85: Test Suite]
        │
        ▼
[Tasks 86-88: Docs & Verification]
```

---

## Expected Deliverables

### Code Files
```
backend/apps/core/
├── middleware/
│   ├── __init__.py
│   │   └── # Export all middleware
│   ├── base.py
│   ├── tenant.py
│   ├── logging.py
│   ├── security.py
│   ├── ratelimit.py
│   ├── timezone.py
│   │   └── class TimezoneMiddleware
│   └── utils.py
├── tests/
│   ├── test_tenant_middleware.py
│   ├── test_logging_middleware.py
│   ├── test_security_middleware.py
│   ├── test_ratelimit_middleware.py
│   ├── test_timezone_middleware.py
│   └── test_middleware_integration.py
└── docs/
    └── middleware.md
```

### Timezone Middleware
```python
from django.utils import timezone
import zoneinfo

class TimezoneMiddleware:
    DEFAULT_TIMEZONE = 'Asia/Colombo'
    
    def __init__(self, get_response):
        self.get_response = get_response
    
    def __call__(self, request):
        # Get timezone from user, tenant, or default
        tz = self._get_timezone(request)
        
        # Activate timezone for this request
        if tz:
            timezone.activate(zoneinfo.ZoneInfo(tz))
        else:
            timezone.deactivate()
        
        response = self.get_response(request)
        
        return response
    
    def _get_timezone(self, request):
        # Priority 1: User profile timezone
        if request.user.is_authenticated:
            user_tz = getattr(request.user, 'timezone', None)
            if user_tz:
                return user_tz
        
        # Priority 2: Tenant timezone
        if hasattr(request, 'tenant'):
            tenant_tz = getattr(request.tenant, 'timezone', None)
            if tenant_tz:
                return tenant_tz
        
        # Priority 3: Default timezone (Sri Lanka)
        return self.DEFAULT_TIMEZONE
```

### Complete MIDDLEWARE Setting
```python
# settings/base.py
MIDDLEWARE = [
    # Security first
    'django.middleware.security.SecurityMiddleware',
    
    # CORS before other processing
    'corsheaders.middleware.CorsMiddleware',
    
    # Tenant resolution early
    'django_tenants.middleware.main.TenantMainMiddleware',
    
    # Custom security headers
    'apps.core.middleware.security.SecurityHeadersMiddleware',
    
    # Rate limiting before expensive operations
    'apps.core.middleware.ratelimit.RateLimitMiddleware',
    
    # Session handling
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    
    # Authentication
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    
    # Request logging (after auth for user context)
    'apps.core.middleware.logging.RequestLoggingMiddleware',
    
    # Timezone (after auth for user timezone)
    'apps.core.middleware.timezone.TimezoneMiddleware',
    
    # Messages
    'django.contrib.messages.middleware.MessageMiddleware',
    
    # Clickjacking protection
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]
```

### Middleware README
```markdown
# Middleware Documentation

## Stack Order
1. SecurityMiddleware - SSL, HSTS
2. CorsMiddleware - CORS headers
3. TenantMainMiddleware - Tenant resolution
4. SecurityHeadersMiddleware - Security headers
5. RateLimitMiddleware - Rate limiting
6. SessionMiddleware - Session handling
7. AuthenticationMiddleware - User auth
8. RequestLoggingMiddleware - Request logging
9. TimezoneMiddleware - Timezone activation

## Custom Middleware
- TenantMiddleware: Resolves tenant from domain
- SecurityHeadersMiddleware: Adds security headers
- RateLimitMiddleware: Rate limits requests
- RequestLoggingMiddleware: Logs requests
- TimezoneMiddleware: Sets request timezone
```

---

## Notes for AI Agents

1. **Stack Order:** Follow defined middleware order
2. **Tenant Early:** TenantMiddleware before most middleware
3. **Auth Before Logging:** Need user for logging context
4. **Timezone After Auth:** Need user for timezone preference
5. **Default Timezone:** Asia/Colombo for Sri Lanka
6. **zoneinfo Module:** Python 3.9+ built-in
7. **Integration Tests:** Test complete middleware stack
8. **Verify Startup:** Ensure server starts without errors
