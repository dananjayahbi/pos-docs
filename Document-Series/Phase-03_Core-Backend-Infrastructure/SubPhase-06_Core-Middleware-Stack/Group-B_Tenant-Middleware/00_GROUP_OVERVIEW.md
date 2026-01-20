# Group B: Tenant Middleware

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 06 - Core Middleware Stack  
> **Group:** B of F  
> **Tasks Covered:** 15-28  
> **Group Goal:** Configure and extend tenant resolution middleware for multi-tenancy

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-A_Middleware-Infrastructure](../Group-A_Middleware-Infrastructure/)
- **→ Next Group:** [Group-C_Request-Logging-Middleware](../Group-C_Request-Logging-Middleware/)

---

## Group Overview

This group configures django-tenants TenantMainMiddleware and extends it with custom logic for tenant resolution, including subdomain and custom domain support, error handling, and thread-local storage.

### Key Components
- **TenantMainMiddleware:** django-tenants default
- **Custom TenantMiddleware:** Extended functionality
- **Resolution Strategies:** Subdomain and custom domain
- **Thread Local Storage:** For non-request tenant access
- **Error Handlers:** Tenant not found, inactive tenant

### Resolution Priority
1. Custom domain (mybusiness.com)
2. Subdomain (tenant.example.com)
3. Public schema (www.example.com)

---

## Documents in This Group

| Document # | Document Name | Tasks Covered | Description |
|------------|---------------|---------------|-------------|
| DOC-01 | django-tenants Configuration | Tasks 15-16 | Configure default middleware |
| DOC-02 | Tenant Resolution Logic | Tasks 17-20 | Subdomain and custom domain |
| DOC-03 | Error Handling | Tasks 21-23 | Not found and inactive handlers |
| DOC-04 | Thread Local & Utilities | Tasks 24-28 | Thread local storage and tests |

---

## Task Summary

| Task # | Task Name | Key Points |
|--------|-----------|------------|
| 15 | Configure django-tenants Middleware | TenantMainMiddleware |
| 16 | Create Custom TenantMiddleware | Extend default |
| 17 | Add Tenant Resolution Logic | Resolve from host |
| 18 | Add Subdomain Resolution | tenant.example.com |
| 19 | Add Custom Domain Resolution | mybusiness.com |
| 20 | Handle Public Schema | www.example.com |
| 21 | Add Tenant Not Found Handler | 404 for invalid tenant |
| 22 | Add Tenant Inactive Handler | 403 for inactive tenant |
| 23 | Set request.tenant | Attach tenant to request |
| 24 | Add Thread Local Storage | For non-request access |
| 25 | Create get_current_tenant | Utility function |
| 26 | Register in MIDDLEWARE | Add to settings |
| 27 | Test Tenant Resolution | Middleware tests |
| 28 | Document Tenant Middleware | Documentation |

---

## Execution Order

```
[Tasks 15-16: Configure & Extend]
        │
        ▼
[Tasks 17-20: Resolution Logic]
        │
        ▼
[Tasks 21-23: Error Handling]
        │
        ▼
[Tasks 24-28: Utilities & Tests]
```

---

## Expected Deliverables

### Code Files
```
backend/apps/core/
├── middleware/
│   └── tenant.py
│       ├── class TenantMiddleware(TenantMainMiddleware)
│       │   ├── process_request(request)
│       │   ├── _resolve_subdomain(host)
│       │   ├── _resolve_custom_domain(host)
│       │   ├── _handle_not_found()
│       │   └── _handle_inactive()
│       ├── _thread_locals = threading.local()
│       ├── def set_current_tenant(tenant)
│       └── def get_current_tenant()
└── tests/
    └── test_tenant_middleware.py
```

### Custom Tenant Middleware
```python
from django_tenants.middleware.main import TenantMainMiddleware
from django.http import Http404, HttpResponseForbidden
import threading

_thread_locals = threading.local()

def set_current_tenant(tenant):
    _thread_locals.tenant = tenant

def get_current_tenant():
    return getattr(_thread_locals, 'tenant', None)

class TenantMiddleware(TenantMainMiddleware):
    def process_request(self, request):
        hostname = self.hostname_from_request(request)
        
        # Try custom domain first
        tenant = self._resolve_custom_domain(hostname)
        
        # Then try subdomain
        if not tenant:
            tenant = self._resolve_subdomain(hostname)
        
        # Handle public schema
        if not tenant and self._is_public_host(hostname):
            tenant = self._get_public_tenant()
        
        # No tenant found
        if not tenant:
            return self._handle_not_found()
        
        # Tenant inactive
        if not tenant.is_active:
            return self._handle_inactive()
        
        # Set tenant
        request.tenant = tenant
        set_current_tenant(tenant)
        
        return super().process_request(request)
    
    def _resolve_custom_domain(self, hostname):
        from apps.tenants.models import Domain
        try:
            domain = Domain.objects.get(domain=hostname)
            return domain.tenant
        except Domain.DoesNotExist:
            return None
    
    def _resolve_subdomain(self, hostname):
        from apps.tenants.models import Tenant
        subdomain = hostname.split('.')[0]
        try:
            return Tenant.objects.get(subdomain=subdomain)
        except Tenant.DoesNotExist:
            return None
```

### Error Responses
```python
def _handle_not_found(self):
    """Return 404 for invalid tenant."""
    from django.http import JsonResponse
    return JsonResponse(
        {'error': 'Tenant not found', 'code': 'TENANT_NOT_FOUND'},
        status=404
    )

def _handle_inactive(self):
    """Return 403 for inactive tenant."""
    from django.http import JsonResponse
    return JsonResponse(
        {'error': 'Tenant is inactive', 'code': 'TENANT_INACTIVE'},
        status=403
    )
```

---

## Notes for AI Agents

1. **Extend TenantMainMiddleware:** Don't replace, extend
2. **Resolution Order:** Custom domain → Subdomain → Public
3. **Thread Local:** For background tasks without request
4. **request.tenant:** Always attach to request
5. **Public Schema:** Handle www, app, api subdomains
6. **Active Check:** Verify tenant.is_active
7. **JSON Response:** Return JSON errors for API
8. **Early in Stack:** TenantMiddleware runs early
