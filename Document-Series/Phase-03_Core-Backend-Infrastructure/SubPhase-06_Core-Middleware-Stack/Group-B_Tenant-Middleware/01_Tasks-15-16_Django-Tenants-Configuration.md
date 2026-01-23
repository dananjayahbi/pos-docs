# Tasks 15-16: Django Tenants Configuration

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 06 - Core Middleware Stack  
> **Group:** B - Tenant Middleware  
> **Document:** 01 of 04  
> **Tasks Covered:** 15, 16

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Group:** [../Group-A_Middleware-Infrastructure/](../Group-A_Middleware-Infrastructure/)
- **→ Next Document:** [02_Tasks-17-20_Tenant-Resolution-Logic.md](02_Tasks-17-20_Tenant-Resolution-Logic.md)

---

## Document Overview

This document covers the configuration of django-tenants middleware and creation of custom tenant middleware that extends TenantMainMiddleware for advanced multi-tenancy support.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 15 | Configure django-tenants Middleware | Simple |
| 16 | Create Custom TenantMiddleware | Medium |

---

## Task 15: Configure django-tenants Middleware

### Overview
Configure the default django-tenants TenantMainMiddleware as the base for our custom tenant resolution system.

### Dependencies
- django-tenants package installed
- Database multi-tenancy configured (Phase 02)
- Tenant model created

### Instructions

1. **Review django-tenants middleware**
   - Understand TenantMainMiddleware functionality
   - Review hostname resolution mechanism
   - Check schema switching behavior

2. **Verify tenant settings in Django**
   - Ensure `TENANT_MODEL` is configured in settings
   - Verify `TENANT_DOMAIN_MODEL` is set
   - Check `PUBLIC_SCHEMA_URLCONF` exists

3. **Add TenantMainMiddleware to MIDDLEWARE**
   - Open `backend/config/settings/base.py`
   - Add django-tenants middleware early in stack
   - Position after SecurityMiddleware
   - Position before SessionMiddleware

4. **Configure tenant model paths**
   - Set `TENANT_MODEL = 'tenants.Tenant'`
   - Set `TENANT_DOMAIN_MODEL = 'tenants.Domain'`
   - Verify model imports work correctly

5. **Set public schema configuration**
   - Define `PUBLIC_SCHEMA_NAME = 'public'`
   - Define `PUBLIC_SCHEMA_URLCONF = 'config.urls_public'`
   - Create separate URL config for public schema

6. **Test basic tenant resolution**
   - Start development server
   - Access with localhost (should use public schema)
   - Verify no immediate errors

### Middleware Configuration

**settings/base.py:**
```python
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django_tenants.middleware.main.TenantMainMiddleware',  # Early position
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]
```

### Tenant Model Settings

| Setting | Value | Purpose |
|---------|-------|---------|
| `TENANT_MODEL` | `'tenants.Tenant'` | Points to tenant model |
| `TENANT_DOMAIN_MODEL` | `'tenants.Domain'` | Points to domain model |
| `PUBLIC_SCHEMA_NAME` | `'public'` | Name of public schema |
| `PUBLIC_SCHEMA_URLCONF` | `'config.urls_public'` | URL config for public |

### Expected Outcome
```
backend/config/settings/
├── base.py
│   ├── MIDDLEWARE (TenantMainMiddleware added)
│   ├── TENANT_MODEL = 'tenants.Tenant'
│   ├── TENANT_DOMAIN_MODEL = 'tenants.Domain'
│   ├── PUBLIC_SCHEMA_NAME = 'public'
│   └── PUBLIC_SCHEMA_URLCONF = 'config.urls_public'
```

### Verification Checklist
- [ ] django-tenants is installed
- [ ] TenantMainMiddleware is in MIDDLEWARE
- [ ] Middleware is positioned early in stack
- [ ] TENANT_MODEL is configured correctly
- [ ] TENANT_DOMAIN_MODEL is configured correctly
- [ ] PUBLIC_SCHEMA_NAME is defined
- [ ] PUBLIC_SCHEMA_URLCONF is set
- [ ] Development server starts without errors

---

## Task 16: Create Custom TenantMiddleware

### Overview
Create a custom TenantMiddleware class that extends django-tenants TenantMainMiddleware to add support for subdomain resolution, custom domain resolution, and enhanced error handling.

### Dependencies
- Task 15: Configure django-tenants Middleware
- Tenant model with subdomain field
- Domain model created

### Instructions

1. **Create tenant middleware file**
   - Create `backend/apps/core/middleware/tenant.py`
   - Import TenantMainMiddleware from django_tenants
   - Import necessary Django modules

2. **Define TenantMiddleware class**
   - Extend TenantMainMiddleware
   - Override process_request method
   - Keep parent class functionality

3. **Add hostname extraction method**
   - Use parent's `hostname_from_request(request)` method
   - Handle X-Forwarded-Host header
   - Handle Host header

4. **Create skeleton resolution methods**
   - `_resolve_custom_domain(hostname)` - for custom domains
   - `_resolve_subdomain(hostname)` - for subdomain.example.com
   - `_is_public_host(hostname)` - check if public
   - `_get_public_tenant()` - get public schema tenant

5. **Add error handling method stubs**
   - `_handle_not_found()` - return 404 response
   - `_handle_inactive()` - return 403 response

6. **Implement basic process_request flow**
   - Extract hostname
   - Call resolution methods (to be implemented next)
   - Set request.tenant
   - Return super().process_request(request)

7. **Add docstrings**
   - Document class purpose
   - Document each method
   - Note resolution priority

8. **Import necessary models**
   - Lazy import Tenant model
   - Lazy import Domain model
   - Use imports inside methods to avoid circular dependencies

### Custom TenantMiddleware Structure

```python
"""
Tenant resolution middleware extending django-tenants.

Resolution priority:
1. Custom domain (mybusiness.com)
2. Subdomain (tenant.example.com)
3. Public schema (www.example.com, app.example.com)
"""

from django_tenants.middleware.main import TenantMainMiddleware
from django.http import JsonResponse
from django.core.exceptions import DisallowedHost


class TenantMiddleware(TenantMainMiddleware):
    """
    Extended tenant middleware with custom domain and subdomain support.
    
    Extends django-tenants TenantMainMiddleware to add:
    - Custom domain resolution (priority 1)
    - Subdomain resolution (priority 2)
    - Public schema handling (priority 3)
    - Enhanced error responses
    """
    
    def process_request(self, request):
        """
        Process incoming request and resolve tenant.
        
        Args:
            request: HttpRequest object
            
        Returns:
            HttpResponse if error, None if successful
        """
        # Extract hostname
        hostname = self.hostname_from_request(request)
        
        # Resolution logic will be added in next tasks
        # For now, call parent implementation
        return super().process_request(request)
    
    def _resolve_custom_domain(self, hostname):
        """
        Resolve tenant from custom domain.
        
        Args:
            hostname: Full hostname (e.g., 'mybusiness.com')
            
        Returns:
            Tenant object if found, None otherwise
        """
        # Implementation in Task 19
        return None
    
    def _resolve_subdomain(self, hostname):
        """
        Resolve tenant from subdomain.
        
        Args:
            hostname: Full hostname (e.g., 'tenant.example.com')
            
        Returns:
            Tenant object if found, None otherwise
        """
        # Implementation in Task 18
        return None
    
    def _is_public_host(self, hostname):
        """
        Check if hostname is public schema.
        
        Args:
            hostname: Full hostname
            
        Returns:
            Boolean indicating if public host
        """
        # Implementation in Task 20
        return False
    
    def _get_public_tenant(self):
        """
        Get public schema tenant.
        
        Returns:
            Public tenant object
        """
        # Implementation in Task 20
        return None
    
    def _handle_not_found(self):
        """
        Handle tenant not found error.
        
        Returns:
            JsonResponse with 404 status
        """
        # Implementation in Task 21
        pass
    
    def _handle_inactive(self):
        """
        Handle inactive tenant error.
        
        Returns:
            JsonResponse with 403 status
        """
        # Implementation in Task 22
        pass
```

### Class Design Principles

| Principle | Implementation |
|-----------|----------------|
| **Extend, Don't Replace** | Inherit from TenantMainMiddleware |
| **Lazy Imports** | Import models inside methods |
| **Clear Resolution Order** | Document priority in docstrings |
| **Graceful Errors** | JSON responses for API compatibility |
| **Request Attachment** | Always set request.tenant |

### Expected Outcome
```
backend/apps/core/middleware/
├── __init__.py
└── tenant.py
    └── class TenantMiddleware(TenantMainMiddleware)
        ├── process_request()
        ├── _resolve_custom_domain()
        ├── _resolve_subdomain()
        ├── _is_public_host()
        ├── _get_public_tenant()
        ├── _handle_not_found()
        └── _handle_inactive()
```

### Verification Checklist
- [ ] `backend/apps/core/middleware/tenant.py` file created
- [ ] TenantMiddleware class extends TenantMainMiddleware
- [ ] process_request method is overridden
- [ ] Resolution method stubs are present
- [ ] Error handling method stubs are present
- [ ] Docstrings document resolution priority
- [ ] No circular import issues
- [ ] File imports successfully

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 15 | Configure django-tenants Middleware | TenantMainMiddleware in settings |
| 16 | Create Custom TenantMiddleware | TenantMiddleware class skeleton |

### Files Created/Modified
```
backend/
├── config/settings/
│   └── base.py (modified)
│       ├── MIDDLEWARE += TenantMainMiddleware
│       ├── TENANT_MODEL
│       ├── TENANT_DOMAIN_MODEL
│       └── PUBLIC_SCHEMA_NAME
└── apps/core/middleware/
    └── tenant.py (created)
        └── class TenantMiddleware
```

### Configuration Added
- django-tenants middleware configured
- Tenant model settings defined
- Public schema configuration set
- Custom middleware class structure created

### Next Steps
Proceed to [02_Tasks-17-20_Tenant-Resolution-Logic.md](02_Tasks-17-20_Tenant-Resolution-Logic.md) to implement tenant resolution methods for subdomain and custom domain support.

---

## Notes for AI Agents

1. **Extend, Don't Replace:** TenantMiddleware extends TenantMainMiddleware, preserving all parent functionality
2. **Early Position:** TenantMainMiddleware must be early in MIDDLEWARE stack, after SecurityMiddleware
3. **Lazy Imports:** Import Tenant and Domain models inside methods to avoid circular dependencies
4. **Resolution Stubs:** Methods are stubs in this task, implementations come in Tasks 17-20
5. **Parent Call:** Always call super().process_request(request) to maintain django-tenants behavior
6. **Settings Path:** Use 'tenants.Tenant' not 'apps.tenants.models.Tenant'
7. **Public Schema:** PUBLIC_SCHEMA_URLCONF should point to a separate URL configuration
