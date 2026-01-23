# Tasks 21-23: Error Handling

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 06 - Core Middleware Stack  
> **Group:** B - Tenant Middleware  
> **Document:** 03 of 04  
> **Tasks Covered:** 21, 22, 23

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [02_Tasks-17-20_Tenant-Resolution-Logic.md](02_Tasks-17-20_Tenant-Resolution-Logic.md)
- **→ Next Document:** [04_Tasks-24-28_Thread-Local-Utilities.md](04_Tasks-24-28_Thread-Local-Utilities.md)

---

## Document Overview

This document implements error handling for tenant resolution failures, including tenant not found (404) and inactive tenant (403) scenarios, with proper JSON responses for API compatibility.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 21 | Add Tenant Not Found Handler | Simple |
| 22 | Add Tenant Inactive Handler | Simple |
| 23 | Set request.tenant Attribute | Simple |

---

## Task 21: Add Tenant Not Found Handler

### Overview
Implement error handler for cases where tenant cannot be resolved from the hostname, returning a JSON 404 response with descriptive error information.

### Dependencies
- Task 17: Add Tenant Resolution Logic
- JsonResponse from Django

### Instructions

1. **Locate _handle_not_found method**
   - Open `backend/apps/core/middleware/tenant.py`
   - Find _handle_not_found stub

2. **Import JsonResponse**
   - Add import at top of file
   - `from django.http import JsonResponse`

3. **Implement JSON error response**
   - Return JsonResponse with error details
   - Status code 404 (Not Found)
   - Include error message and error code

4. **Add error response structure**
   - Include human-readable error message
   - Include machine-readable error code
   - Optionally include request hostname

5. **Add logging**
   - Log tenant not found errors
   - Include hostname in log message
   - Use warning level for visibility

6. **Consider i18n support**
   - Structure allows for future translation
   - Error codes remain constant for clients
   - Messages can be localized later

### Tenant Not Found Handler Implementation

```python
def _handle_not_found(self):
    """
    Handle tenant not found error.
    
    Returns JSON response with 404 status when tenant cannot be
    resolved from the hostname.
    
    Returns:
        JsonResponse with 404 status
        
    Response format:
        {
            "error": "Tenant not found",
            "code": "TENANT_NOT_FOUND",
            "detail": "No tenant exists for this domain"
        }
    """
    import logging
    logger = logging.getLogger(__name__)
    
    # Log the error
    logger.warning(f"Tenant not found - invalid hostname")
    
    # Return JSON error response
    return JsonResponse(
        {
            'error': 'Tenant not found',
            'code': 'TENANT_NOT_FOUND',
            'detail': 'No tenant exists for this domain. Please check the URL and try again.',
        },
        status=404
    )
```

### Error Response Structure

| Field | Type | Purpose | Example |
|-------|------|---------|---------|
| `error` | string | Human-readable message | "Tenant not found" |
| `code` | string | Machine-readable code | "TENANT_NOT_FOUND" |
| `detail` | string | Additional explanation | "No tenant exists for this domain" |

### HTTP Status Codes

| Status | Code | When to Use |
|--------|------|-------------|
| **404** | Not Found | Tenant doesn't exist for hostname |
| 403 | Forbidden | Tenant exists but is inactive |
| 500 | Server Error | Unexpected error in resolution |

### Error Response Examples

**Request to non-existent tenant:**
```http
GET / HTTP/1.1
Host: nonexistent.example.com

HTTP/1.1 404 Not Found
Content-Type: application/json

{
    "error": "Tenant not found",
    "code": "TENANT_NOT_FOUND",
    "detail": "No tenant exists for this domain. Please check the URL and try again."
}
```

**Request to invalid custom domain:**
```http
GET / HTTP/1.1
Host: invalid-domain.com

HTTP/1.1 404 Not Found
Content-Type: application/json

{
    "error": "Tenant not found",
    "code": "TENANT_NOT_FOUND",
    "detail": "No tenant exists for this domain. Please check the URL and try again."
}
```

### Logging Output

```
WARNING [tenant] Tenant not found - invalid hostname
```

### Enhanced Implementation with Hostname

For debugging purposes, optionally include hostname:

```python
def _handle_not_found(self, hostname=None):
    """Handle tenant not found error."""
    import logging
    logger = logging.getLogger(__name__)
    
    # Log with hostname if available
    if hostname:
        logger.warning(f"Tenant not found for hostname: {hostname}")
    else:
        logger.warning("Tenant not found - invalid hostname")
    
    # Return JSON error response
    response_data = {
        'error': 'Tenant not found',
        'code': 'TENANT_NOT_FOUND',
        'detail': 'No tenant exists for this domain. Please check the URL and try again.',
    }
    
    # Optionally include hostname in development
    from django.conf import settings
    if settings.DEBUG and hostname:
        response_data['hostname'] = hostname
    
    return JsonResponse(response_data, status=404)
```

### Expected Outcome
```
backend/apps/core/middleware/tenant.py
└── class TenantMiddleware
    └── _handle_not_found() [implemented]
        ├── Log warning
        ├── Create error response
        └── Return JsonResponse (404)
```

### Verification Checklist
- [ ] _handle_not_found method is implemented
- [ ] Returns JsonResponse with status 404
- [ ] Error message is clear and user-friendly
- [ ] Error code is machine-readable (TENANT_NOT_FOUND)
- [ ] Logging is present
- [ ] Response structure is consistent
- [ ] Works with API clients
- [ ] Doesn't expose sensitive information

---

## Task 22: Add Tenant Inactive Handler

### Overview
Implement error handler for cases where tenant is found but marked as inactive, returning a JSON 403 response indicating the tenant is not accessible.

### Dependencies
- Task 17: Add Tenant Resolution Logic
- Tenant model with is_active field

### Instructions

1. **Locate _handle_inactive method**
   - Open `backend/apps/core/middleware/tenant.py`
   - Find _handle_inactive stub

2. **Implement JSON error response**
   - Return JsonResponse with error details
   - Status code 403 (Forbidden)
   - Include error message and error code

3. **Add error response structure**
   - Include human-readable error message
   - Include machine-readable error code
   - Explain inactive status

4. **Add logging**
   - Log inactive tenant access attempts
   - Include tenant identifier if available
   - Use warning level

5. **Consider security**
   - Don't expose internal tenant details
   - Keep error message generic
   - Avoid revealing tenant existence

### Tenant Inactive Handler Implementation

```python
def _handle_inactive(self):
    """
    Handle inactive tenant error.
    
    Returns JSON response with 403 status when tenant is found
    but marked as inactive.
    
    Returns:
        JsonResponse with 403 status
        
    Response format:
        {
            "error": "Tenant is inactive",
            "code": "TENANT_INACTIVE",
            "detail": "This tenant account is currently inactive"
        }
    """
    import logging
    logger = logging.getLogger(__name__)
    
    # Log the error
    logger.warning(f"Access attempt to inactive tenant")
    
    # Return JSON error response
    return JsonResponse(
        {
            'error': 'Tenant is inactive',
            'code': 'TENANT_INACTIVE',
            'detail': 'This tenant account is currently inactive. Please contact support for assistance.',
        },
        status=403
    )
```

### Error Response Structure

| Field | Type | Purpose | Example |
|-------|------|---------|---------|
| `error` | string | Human-readable message | "Tenant is inactive" |
| `code` | string | Machine-readable code | "TENANT_INACTIVE" |
| `detail` | string | Additional explanation | "This tenant account is currently inactive" |

### HTTP Status Code Rationale

**403 Forbidden** is used instead of 404 because:
- The tenant exists (resource is found)
- Access is denied due to status
- Client knows the tenant exists but cannot access it
- Different from "not found" scenario

### Error Response Example

**Request to inactive tenant:**
```http
GET / HTTP/1.1
Host: inactive-tenant.example.com

HTTP/1.1 403 Forbidden
Content-Type: application/json

{
    "error": "Tenant is inactive",
    "code": "TENANT_INACTIVE",
    "detail": "This tenant account is currently inactive. Please contact support for assistance."
}
```

### Logging Output

```
WARNING [tenant] Access attempt to inactive tenant
```

### Enhanced Implementation with Tenant Info

For admin monitoring, optionally include tenant identifier:

```python
def _handle_inactive(self, tenant=None):
    """Handle inactive tenant error."""
    import logging
    logger = logging.getLogger(__name__)
    
    # Log with tenant info if available
    if tenant:
        logger.warning(
            f"Access attempt to inactive tenant: {tenant.name} "
            f"(schema: {tenant.schema_name})"
        )
    else:
        logger.warning("Access attempt to inactive tenant")
    
    # Return JSON error response
    response_data = {
        'error': 'Tenant is inactive',
        'code': 'TENANT_INACTIVE',
        'detail': 'This tenant account is currently inactive. Please contact support for assistance.',
    }
    
    # Don't include tenant details in production for security
    # Only log them server-side
    
    return JsonResponse(response_data, status=403)
```

### Inactive Tenant Scenarios

| Scenario | Reason | Action |
|----------|--------|--------|
| **Subscription Expired** | Payment overdue | Return 403, prompt renewal |
| **Account Suspended** | Terms violation | Return 403, contact support |
| **Deactivated** | Manual deactivation | Return 403, contact admin |
| **Under Maintenance** | Technical work | Return 503 (not 403) |

### Alternative Status Code (503)

For maintenance scenarios, consider using 503:

```python
def _handle_maintenance(self, tenant):
    """Handle tenant under maintenance."""
    return JsonResponse(
        {
            'error': 'Tenant under maintenance',
            'code': 'TENANT_MAINTENANCE',
            'detail': 'This tenant is temporarily unavailable due to scheduled maintenance.',
        },
        status=503
    )
```

### Expected Outcome
```
backend/apps/core/middleware/tenant.py
└── class TenantMiddleware
    └── _handle_inactive() [implemented]
        ├── Log warning
        ├── Create error response
        └── Return JsonResponse (403)
```

### Verification Checklist
- [ ] _handle_inactive method is implemented
- [ ] Returns JsonResponse with status 403
- [ ] Error message is clear and user-friendly
- [ ] Error code is machine-readable (TENANT_INACTIVE)
- [ ] Logging is present
- [ ] Doesn't expose sensitive tenant information
- [ ] Works with API clients
- [ ] Support contact information is mentioned

---

## Task 23: Set request.tenant Attribute

### Overview
Ensure that the resolved tenant object is properly attached to the request object, making it accessible throughout the request lifecycle in views, middleware, and templates.

### Dependencies
- Task 17: Add Tenant Resolution Logic
- Successful tenant resolution

### Instructions

1. **Verify request.tenant assignment**
   - Check process_request method in middleware
   - Confirm `request.tenant = tenant` line exists
   - Ensure it's set before calling super()

2. **Add tenant attribute documentation**
   - Document that request.tenant will be available
   - Note the tenant object structure
   - Explain when it's set

3. **Verify attribute accessibility**
   - request.tenant should be accessible in views
   - request.tenant should be accessible in other middleware
   - request.tenant should be accessible in context processors

4. **Add type hints (optional)**
   - Type hint request.tenant in views
   - Use TYPE_CHECKING for circular imports
   - Helps with IDE autocomplete

5. **Document tenant object attributes**
   - List available tenant attributes
   - Document commonly used fields
   - Note related objects

### Request Tenant Assignment

The assignment is already in process_request (Task 17):

```python
def process_request(self, request):
    """Process incoming request and resolve tenant."""
    try:
        hostname = self.hostname_from_request(request)
        tenant = None
        
        # Resolution logic...
        # (Tasks 18-20)
        
        if not tenant:
            return self._handle_not_found()
        
        if not tenant.is_active:
            return self._handle_inactive()
        
        # ✓ Attach tenant to request
        request.tenant = tenant
        
        # Call parent for schema switching
        return super().process_request(request)
        
    except Exception as e:
        # Error handling...
        pass
```

### Using request.tenant in Views

**Function-based view:**
```python
def dashboard_view(request):
    """Dashboard view with tenant context."""
    # Access tenant from request
    tenant = request.tenant
    
    # Use tenant information
    tenant_name = tenant.name
    tenant_schema = tenant.schema_name
    
    return render(request, 'dashboard.html', {
        'tenant': tenant,
        'tenant_name': tenant_name,
    })
```

**Class-based view:**
```python
from django.views.generic import TemplateView

class DashboardView(TemplateView):
    """Dashboard view with tenant context."""
    template_name = 'dashboard.html'
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        
        # Access tenant from request
        context['tenant'] = self.request.tenant
        context['tenant_name'] = self.request.tenant.name
        
        return context
```

**API view (DRF):**
```python
from rest_framework.views import APIView
from rest_framework.response import Response

class TenantInfoView(APIView):
    """API view returning tenant information."""
    
    def get(self, request):
        # Access tenant from request
        tenant = request.tenant
        
        return Response({
            'tenant_id': str(tenant.id),
            'tenant_name': tenant.name,
            'schema_name': tenant.schema_name,
            'is_active': tenant.is_active,
        })
```

### Tenant Object Attributes

| Attribute | Type | Description | Example |
|-----------|------|-------------|---------|
| `id` | UUID/Integer | Unique identifier | `uuid.UUID(...)` |
| `name` | string | Display name | "ABC Electronics" |
| `schema_name` | string | Database schema | "abc_electronics" |
| `subdomain` | string | Subdomain | "abc-electronics" |
| `is_active` | boolean | Active status | `True` |
| `created_at` | datetime | Creation date | `2026-01-15 10:30:00` |
| `plan` | string | Subscription plan | "professional" |

### Type Hints for IDE Support

```python
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from apps.tenants.models import Tenant

def my_view(request):
    """View with type-hinted tenant."""
    tenant: 'Tenant' = request.tenant
    
    # IDE now provides autocomplete for tenant attributes
    tenant_name = tenant.name
    is_active = tenant.is_active
```

### Context Processor for Templates

Create a context processor to make tenant available in all templates:

```python
# apps/core/context_processors.py

def tenant_context(request):
    """
    Add tenant to template context.
    
    Usage in template:
        {{ tenant.name }}
        {{ tenant.schema_name }}
    """
    return {
        'tenant': getattr(request, 'tenant', None),
    }
```

Register in settings:

```python
# settings/base.py

TEMPLATES = [
    {
        'OPTIONS': {
            'context_processors': [
                # ...
                'apps.core.context_processors.tenant_context',
            ],
        },
    },
]
```

### Accessing in Other Middleware

Middleware that runs **after** TenantMiddleware can access request.tenant:

```python
class CustomMiddleware:
    """Custom middleware that uses tenant."""
    
    def __init__(self, get_response):
        self.get_response = get_response
    
    def __call__(self, request):
        # Access tenant (set by TenantMiddleware)
        tenant = getattr(request, 'tenant', None)
        
        if tenant:
            # Do something with tenant
            request.tenant_name = tenant.name
        
        response = self.get_response(request)
        return response
```

**Important:** CustomMiddleware must be **after** TenantMiddleware in MIDDLEWARE list.

### Request Attribute Availability

| Where | Accessible | Example |
|-------|-----------|---------|
| **Views** | ✓ Yes | `request.tenant.name` |
| **Templates** | ✓ Yes (with context processor) | `{{ tenant.name }}` |
| **Middleware (after)** | ✓ Yes | `request.tenant` |
| **Middleware (before)** | ✗ No | Not yet set |
| **Management Commands** | ✗ No | Use thread-local instead |

### Expected Outcome
```
Request Processing Flow:
    ↓
TenantMiddleware.process_request()
    ├── Resolve tenant
    ├── Validate tenant
    └── request.tenant = tenant ✓
    ↓
Subsequent Middleware
    └── Can access request.tenant ✓
    ↓
View Function/Class
    └── Can access request.tenant ✓
    ↓
Template Rendering
    └── Can access tenant (via context processor) ✓
```

### Verification Checklist
- [ ] request.tenant is set in process_request
- [ ] Assignment happens after validation
- [ ] Assignment happens before super() call
- [ ] request.tenant is accessible in views
- [ ] Documentation explains tenant attributes
- [ ] Context processor created (optional)
- [ ] Type hints added for IDE support (optional)

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 21 | Add Tenant Not Found Handler | _handle_not_found() returns JSON 404 |
| 22 | Add Tenant Inactive Handler | _handle_inactive() returns JSON 403 |
| 23 | Set request.tenant Attribute | request.tenant assigned and documented |

### Error Handlers Implemented
```
backend/apps/core/middleware/tenant.py
└── class TenantMiddleware
    ├── _handle_not_found() [implemented]
    │   ├── Status: 404
    │   ├── Code: TENANT_NOT_FOUND
    │   └── Logging: WARNING
    ├── _handle_inactive() [implemented]
    │   ├── Status: 403
    │   ├── Code: TENANT_INACTIVE
    │   └── Logging: WARNING
    └── process_request()
        └── request.tenant = tenant ✓
```

### Error Response Summary

| Error | Status | Code | When |
|-------|--------|------|------|
| **Tenant Not Found** | 404 | TENANT_NOT_FOUND | No tenant for hostname |
| **Tenant Inactive** | 403 | TENANT_INACTIVE | Tenant found but inactive |
| **Server Error** | 500 | SERVER_ERROR | Unexpected exception |

### JSON Error Response Format

All errors follow consistent structure:
```json
{
    "error": "Human-readable message",
    "code": "MACHINE_READABLE_CODE",
    "detail": "Additional explanation for users"
}
```

### Next Steps
Proceed to [04_Tasks-24-28_Thread-Local-Utilities.md](04_Tasks-24-28_Thread-Local-Utilities.md) to implement thread-local storage for accessing tenant in non-request contexts like background tasks.

---

## Notes for AI Agents

1. **Error Codes:** Use UPPER_SNAKE_CASE for machine-readable error codes
2. **Status Codes:** 404 for not found, 403 for forbidden (inactive)
3. **JSON Format:** Always use JsonResponse for API compatibility
4. **Logging Level:** Use WARNING for error handlers (not ERROR)
5. **Security:** Don't expose sensitive tenant details in error responses
6. **User Messaging:** Provide helpful error messages with next steps
7. **request.tenant:** Set before calling super().process_request()
8. **Context Processor:** Optional but recommended for template access
9. **Type Hints:** Optional but helpful for IDE autocomplete
10. **Middleware Order:** TenantMiddleware must run before middleware that needs tenant
