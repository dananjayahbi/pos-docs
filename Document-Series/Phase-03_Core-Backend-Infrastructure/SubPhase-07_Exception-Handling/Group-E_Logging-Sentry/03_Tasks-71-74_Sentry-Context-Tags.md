# Tasks 71-74: Sentry Context & Tags

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 07 - Exception Handling  
> **Group:** E - Logging & Sentry  
> **Document:** 03 of 03  
> **Tasks Covered:** 71, 72, 73, 74

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [02_Tasks-67-70_Sentry-Installation.md](02_Tasks-67-70_Sentry-Installation.md)
- **→ Next Group:** [../Group-F_Testing-Documentation/](../Group-F_Testing-Documentation/)

---

## Document Overview

This document covers Sentry context enrichment, custom tags, testing, and documentation.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 71 | Add Sentry User Context | Medium |
| 72 | Add Sentry Tags | Medium |
| 73 | Test Sentry Integration | Medium |
| 74 | Document Sentry Setup | Medium |

---

## Tasks 71-72: Add Context and Tags

Create middleware `backend/apps/core/middleware/sentry.py`:

```python
"""Sentry context middleware."""

from sentry_sdk import set_tag, set_user, set_context


class SentryContextMiddleware:
    """Add context to Sentry events."""
    
    def __init__(self, get_response):
        self.get_response = get_response
    
    def __call__(self, request):
        # Task 71: Add User Context
        if hasattr(request, 'user') and request.user.is_authenticated:
            set_user({
                'id': request.user.id,
                'email': request.user.email,
                'username': request.user.username,
            })
        
        # Task 72: Add Tags
        if hasattr(request, 'tenant'):
            set_tag('tenant_id', request.tenant.id)
            set_tag('tenant_domain', request.tenant.domain)
        
        set_tag('request_id', getattr(request, 'request_id', None))
        
        # Add request context
        set_context('request', {
            'method': request.method,
            'path': request.path,
            'query_string': request.META.get('QUERY_STRING', ''),
        })
        
        response = self.get_response(request)
        return response
```

Register middleware in settings:

```python
MIDDLEWARE = [
    # ... other middleware ...
    'apps.core.middleware.sentry.SentryContextMiddleware',
]
```

---

## Task 73: Test Sentry Integration

Create test endpoint for Sentry:

```python
# In a test view
from sentry_sdk import capture_exception, capture_message

def test_sentry(request):
    """Test Sentry integration."""
    try:
        # Trigger test error
        1 / 0
    except Exception as e:
        capture_exception(e)
        return JsonResponse({'status': 'error captured'})
```

---

## Task 74: Document Sentry Setup

Create `docs/exceptions/sentry.md`:

```markdown
# Sentry Integration

## Setup

1. Install sentry-sdk:
   ```bash
   pip install sentry-sdk[django]
   ```

2. Configure environment:
   ```bash
   SENTRY_DSN=https://your-dsn@sentry.io/project-id
   DJANGO_ENV=production
   SENTRY_TRACES_SAMPLE_RATE=1.0
   ```

3. Sentry auto-initializes in production

## Context

All errors include:
- User ID and email
- Tenant ID and domain  
- Request ID
- Request method and path

## Tags

- `tenant_id`: Current tenant
- `tenant_domain`: Tenant domain
- `request_id`: Request tracking ID
- `environment`: dev/staging/production

## Testing

Test in Django shell:
```python
from sentry_sdk import capture_message
capture_message('Test message')
```

## Best Practices

- Don't send validation errors
- Filter sensitive data
- Use before_send for filtering
- Monitor error quota
```

---

## Group E Complete

✅ Error logging with context
✅ Sentry SDK installed
✅ Sentry configured
✅ Context and tags added
✅ Testing documented
✅ Full documentation

---

## Notes for AI Agents

- **User Context:** Set user info for each request
- **Tags:** Use for filtering in Sentry UI
- **Context:** Add request details
- **Testing:** Test before deploying
- **Filtering:** Don't send all errors to Sentry
