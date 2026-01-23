# Tasks 24-28: Thread Local & Utilities

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 06 - Core Middleware Stack  
> **Group:** B - Tenant Middleware  
> **Document:** 04 of 04  
> **Tasks Covered:** 24, 25, 26, 27, 28

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [03_Tasks-21-23_Error-Handling.md](03_Tasks-21-23_Error-Handling.md)
- **→ Next Group:** [../Group-C_Request-Logging-Middleware/](../Group-C_Request-Logging-Middleware/)

---

## Document Overview

This document implements thread-local storage for tenant access in non-request contexts (background tasks, signals, etc.), registers the middleware in Django settings, creates comprehensive tests, and documents the tenant middleware system.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 24 | Add Thread Local Storage | Medium |
| 25 | Create get_current_tenant Utility | Simple |
| 26 | Register in MIDDLEWARE | Simple |
| 27 | Test Tenant Resolution | Complex |
| 28 | Document Tenant Middleware | Simple |

---

## Task 24: Add Thread Local Storage

### Overview
Implement thread-local storage to store the current tenant, enabling tenant access in contexts where request object is not available, such as background tasks, Celery workers, and Django signals.

### Dependencies
- Task 23: Set request.tenant Attribute
- Python threading module

### Instructions

1. **Create thread-local storage instance**
   - Open `backend/apps/core/middleware/tenant.py`
   - Import threading module
   - Create module-level _thread_locals variable

2. **Add set_current_tenant function**
   - Define function to store tenant in thread-local
   - Accept tenant parameter
   - Set _thread_locals.tenant

3. **Integrate with process_request**
   - Call set_current_tenant after resolving tenant
   - Do this in addition to setting request.tenant
   - Ensures both request and thread-local have tenant

4. **Add thread-local cleanup**
   - Consider clearing thread-local after request
   - Implement in process_response or process_exception
   - Prevents stale tenant data

5. **Add docstrings**
   - Document thread-local purpose
   - Explain when to use vs request.tenant
   - Note thread-safety considerations

### Thread Local Storage Implementation

Add at module level (top of file):

```python
"""
Tenant resolution middleware extending django-tenants.

Resolution priority:
1. Custom domain (mybusiness.com)
2. Subdomain (tenant.example.com)
3. Public schema (www.example.com)
"""

import threading
from django_tenants.middleware.main import TenantMainMiddleware
from django.http import JsonResponse


# Thread-local storage for current tenant
_thread_locals = threading.local()


def set_current_tenant(tenant):
    """
    Set the current tenant in thread-local storage.
    
    This allows access to the tenant in contexts where the request
    object is not available, such as:
    - Celery background tasks
    - Django signals
    - Management commands
    - Utility functions
    
    Args:
        tenant: Tenant object to store
        
    Example:
        from apps.core.middleware.tenant import set_current_tenant
        
        # In a Celery task
        @app.task
        def process_order(order_id, tenant_schema):
            tenant = Tenant.objects.get(schema_name=tenant_schema)
            set_current_tenant(tenant)
            # Now tenant is available via get_current_tenant()
    """
    _thread_locals.tenant = tenant


def clear_current_tenant():
    """
    Clear the current tenant from thread-local storage.
    
    Should be called after request processing to prevent
    stale tenant data in thread pools.
    """
    if hasattr(_thread_locals, 'tenant'):
        delattr(_thread_locals, 'tenant')
```

### Update process_request Method

Modify TenantMiddleware.process_request to set thread-local:

```python
def process_request(self, request):
    """
    Process incoming request and resolve tenant.
    
    Args:
        request: HttpRequest object
        
    Returns:
        HttpResponse if error, None if successful
    """
    try:
        hostname = self.hostname_from_request(request)
        tenant = None
        
        # Priority 1: Try custom domain
        tenant = self._resolve_custom_domain(hostname)
        
        # Priority 2: Try subdomain
        if not tenant:
            tenant = self._resolve_subdomain(hostname)
        
        # Priority 3: Check public host
        if not tenant and self._is_public_host(hostname):
            tenant = self._get_public_tenant()
        
        # No tenant found
        if not tenant:
            return self._handle_not_found()
        
        # Tenant inactive
        if not tenant.is_active:
            return self._handle_inactive()
        
        # ✓ Set tenant on request
        request.tenant = tenant
        
        # ✓ Set tenant in thread-local
        set_current_tenant(tenant)
        
        # Call parent for schema switching
        return super().process_request(request)
        
    except Exception as e:
        import logging
        logger = logging.getLogger(__name__)
        logger.error(f"Error in tenant resolution: {str(e)}")
        return JsonResponse(
            {'error': 'Internal server error', 'code': 'SERVER_ERROR'},
            status=500
        )
```

### Add Response Cleanup (Optional)

Add process_response and process_exception for cleanup:

```python
def process_response(self, request, response):
    """
    Clean up thread-local storage after request.
    
    Args:
        request: HttpRequest object
        response: HttpResponse object
        
    Returns:
        HttpResponse object
    """
    # Clear thread-local to prevent stale data
    clear_current_tenant()
    return response


def process_exception(self, request, exception):
    """
    Clean up thread-local storage after exception.
    
    Args:
        request: HttpRequest object
        exception: Exception that occurred
        
    Returns:
        None (let other middleware handle exception)
    """
    # Clear thread-local even on exception
    clear_current_tenant()
    return None
```

### Thread-Local Storage Benefits

| Benefit | Description |
|---------|-------------|
| **Background Tasks** | Access tenant in Celery tasks |
| **Django Signals** | Use tenant in signal handlers |
| **Utility Functions** | Get tenant without passing it |
| **Management Commands** | Set tenant for command execution |
| **Audit Logging** | Log tenant without request object |

### Thread-Local Usage Scenarios

**Scenario 1: Celery Task**
```python
from celery import shared_task
from apps.core.middleware.tenant import set_current_tenant, get_current_tenant
from apps.tenants.models import Tenant

@shared_task
def process_inventory(tenant_schema, product_ids):
    """Background task to process inventory."""
    # Set tenant for this task
    tenant = Tenant.objects.get(schema_name=tenant_schema)
    set_current_tenant(tenant)
    
    # Now tenant is available in utility functions
    result = calculate_stock_levels(product_ids)
    return result
```

**Scenario 2: Django Signal**
```python
from django.db.models.signals import post_save
from django.dispatch import receiver
from apps.core.middleware.tenant import get_current_tenant

@receiver(post_save, sender=Order)
def order_created(sender, instance, created, **kwargs):
    """Signal handler for order creation."""
    if created:
        # Access current tenant
        tenant = get_current_tenant()
        if tenant:
            # Send tenant-specific notification
            send_notification(tenant, instance)
```

**Scenario 3: Utility Function**
```python
from apps.core.middleware.tenant import get_current_tenant

def calculate_tax(amount):
    """Calculate tax based on tenant's tax rate."""
    tenant = get_current_tenant()
    
    if tenant:
        # Use tenant-specific tax rate
        tax_rate = tenant.settings.tax_rate
    else:
        # Default tax rate
        tax_rate = 0.15
    
    return amount * tax_rate
```

### Thread Safety Considerations

| Aspect | Implementation |
|--------|----------------|
| **Thread Isolation** | Each thread has its own tenant |
| **No Race Conditions** | threading.local() handles isolation |
| **Cleanup Required** | Clear after request to prevent leaks |
| **Worker Threads** | Safe in gunicorn/uwsgi workers |
| **Async Context** | May not work with async views (use request.tenant) |

### Expected Outcome
```
backend/apps/core/middleware/tenant.py
├── _thread_locals = threading.local() [module-level]
├── def set_current_tenant(tenant) [implemented]
├── def clear_current_tenant() [implemented]
└── class TenantMiddleware
    ├── process_request()
    │   └── set_current_tenant(tenant) ✓
    ├── process_response() [optional]
    │   └── clear_current_tenant()
    └── process_exception() [optional]
        └── clear_current_tenant()
```

### Verification Checklist
- [ ] threading module is imported
- [ ] _thread_locals is created at module level
- [ ] set_current_tenant function is implemented
- [ ] clear_current_tenant function is implemented
- [ ] set_current_tenant is called in process_request
- [ ] clear_current_tenant is called in process_response (optional)
- [ ] clear_current_tenant is called in process_exception (optional)
- [ ] Docstrings explain usage and purpose

---

## Task 25: Create get_current_tenant Utility

### Overview
Create a utility function to retrieve the current tenant from thread-local storage, providing easy access to tenant information in any context.

### Dependencies
- Task 24: Add Thread Local Storage

### Instructions

1. **Add get_current_tenant function**
   - Define function in tenant.py
   - Access _thread_locals.tenant
   - Return tenant or None

2. **Add error handling**
   - Use getattr for safe access
   - Return None if tenant not set
   - Don't raise exceptions

3. **Add comprehensive docstring**
   - Explain function purpose
   - Document return value
   - Provide usage examples
   - Note when to use vs request.tenant

4. **Export in __init__.py**
   - Add to apps/core/middleware/__init__.py
   - Make easily importable
   - Document exported functions

### get_current_tenant Implementation

```python
def get_current_tenant():
    """
    Get the current tenant from thread-local storage.
    
    Returns the tenant set by TenantMiddleware for the current thread.
    This is useful when the request object is not available, such as:
    - Celery background tasks
    - Django signals
    - Utility functions
    - Management commands
    
    Returns:
        Tenant object if set, None otherwise
        
    Examples:
        # In a view (prefer request.tenant)
        def my_view(request):
            tenant = get_current_tenant()
            # or better:
            tenant = request.tenant
        
        # In a utility function (use thread-local)
        def format_currency(amount):
            tenant = get_current_tenant()
            if tenant:
                currency = tenant.settings.currency
            else:
                currency = 'LKR'
            return f"{currency} {amount}"
        
        # In a Celery task
        @app.task
        def process_report(tenant_schema):
            tenant = Tenant.objects.get(schema_name=tenant_schema)
            set_current_tenant(tenant)
            
            # Now available via get_current_tenant()
            current = get_current_tenant()
            assert current == tenant
    
    Note:
        - In views, prefer using request.tenant over this function
        - Thread-local is automatically set by TenantMiddleware
        - In background tasks, manually call set_current_tenant() first
    """
    return getattr(_thread_locals, 'tenant', None)
```

### Function Usage Guide

| Context | Use | Example |
|---------|-----|---------|
| **Views** | Prefer `request.tenant` | `tenant = request.tenant` |
| **Celery Tasks** | Use `get_current_tenant()` | `tenant = get_current_tenant()` |
| **Signals** | Use `get_current_tenant()` | `tenant = get_current_tenant()` |
| **Utility Functions** | Use `get_current_tenant()` | `tenant = get_current_tenant()` |
| **Management Commands** | Call `set_current_tenant()` first | See example below |

### Usage in Management Command

```python
from django.core.management.base import BaseCommand
from apps.core.middleware.tenant import set_current_tenant, get_current_tenant
from apps.tenants.models import Tenant

class Command(BaseCommand):
    """Management command that operates on a tenant."""
    
    def add_arguments(self, parser):
        parser.add_argument('tenant_schema', type=str)
    
    def handle(self, *args, **options):
        # Load tenant
        tenant = Tenant.objects.get(
            schema_name=options['tenant_schema']
        )
        
        # Set for thread-local access
        set_current_tenant(tenant)
        
        # Now available in any function
        self.stdout.write(f"Processing tenant: {tenant.name}")
        
        # Call business logic that uses get_current_tenant()
        result = self.process_data()
        
        self.stdout.write(self.style.SUCCESS(f"Done: {result}"))
    
    def process_data(self):
        """Business logic using get_current_tenant()."""
        tenant = get_current_tenant()
        # Process tenant-specific data
        return f"Processed {tenant.name}"
```

### Export in __init__.py

Create or update `apps/core/middleware/__init__.py`:

```python
"""
Core middleware utilities.

Exports:
    - set_current_tenant: Set tenant in thread-local storage
    - get_current_tenant: Get tenant from thread-local storage
    - TenantMiddleware: Custom tenant resolution middleware
"""

from .tenant import (
    set_current_tenant,
    get_current_tenant,
    TenantMiddleware,
)

__all__ = [
    'set_current_tenant',
    'get_current_tenant',
    'TenantMiddleware',
]
```

Now imports are cleaner:

```python
# Instead of:
from apps.core.middleware.tenant import get_current_tenant

# Use:
from apps.core.middleware import get_current_tenant
```

### Safety and Best Practices

| Practice | Reason |
|----------|--------|
| **Return None** | Don't raise exception if not set |
| **Use getattr** | Safe access with default |
| **Prefer request.tenant** | More explicit in views |
| **Document well** | Prevent misuse |
| **Set before use** | In background tasks |

### Expected Outcome
```
backend/apps/core/middleware/
├── __init__.py [created/updated]
│   └── Exports: get_current_tenant, set_current_tenant
└── tenant.py
    ├── _thread_locals
    ├── def set_current_tenant(tenant)
    ├── def get_current_tenant() [implemented]
    └── def clear_current_tenant()
```

### Verification Checklist
- [ ] get_current_tenant function is implemented
- [ ] Uses getattr for safe access
- [ ] Returns None if tenant not set
- [ ] Docstring is comprehensive with examples
- [ ] Function is exported in __init__.py
- [ ] Import path is simplified
- [ ] Usage examples are documented

---

## Task 26: Register in MIDDLEWARE

### Overview
Register the custom TenantMiddleware in Django settings, replacing the default django-tenants middleware with our extended version.

### Dependencies
- Task 16: Create Custom TenantMiddleware
- All middleware methods implemented

### Instructions

1. **Open settings file**
   - Navigate to `backend/config/settings/base.py`
   - Locate MIDDLEWARE configuration

2. **Replace TenantMainMiddleware**
   - Find django_tenants.middleware.main.TenantMainMiddleware
   - Replace with apps.core.middleware.TenantMiddleware
   - Keep same position in middleware stack

3. **Verify middleware order**
   - TenantMiddleware after SecurityMiddleware
   - TenantMiddleware before SessionMiddleware
   - Early position is critical

4. **Add middleware settings**
   - Verify TENANT_MODEL is set
   - Verify TENANT_DOMAIN_MODEL is set
   - Verify PUBLIC_SCHEMA_NAME is set

5. **Document middleware configuration**
   - Add comments explaining position
   - Note the middleware purpose
   - Reference documentation

### Middleware Registration

Update `backend/config/settings/base.py`:

```python
MIDDLEWARE = [
    # Security
    'django.middleware.security.SecurityMiddleware',
    
    # Tenant resolution (MUST be early)
    # Extends django-tenants with custom domain and subdomain support
    'apps.core.middleware.TenantMiddleware',
    
    # Session and authentication
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    
    # Custom middleware (add later)
    # 'apps.core.middleware.RequestLoggingMiddleware',
    # 'apps.core.middleware.TimezoneMiddleware',
]
```

### Middleware Configuration Settings

Ensure these settings exist in `base.py`:

```python
# ============================================================================
# MULTI-TENANCY CONFIGURATION
# ============================================================================

# Tenant model configuration
TENANT_MODEL = 'tenants.Tenant'
TENANT_DOMAIN_MODEL = 'tenants.Domain'

# Public schema configuration
PUBLIC_SCHEMA_NAME = 'public'
PUBLIC_SCHEMA_URLCONF = 'config.urls_public'

# Base domain for subdomain resolution
BASE_DOMAIN = 'lankacommerce.lk'  # Update for your domain

# Tenant resolution settings
TENANT_RESOLUTION_PRIORITY = [
    'custom_domain',  # Priority 1: mybusiness.com
    'subdomain',      # Priority 2: tenant.example.com
    'public',         # Priority 3: www.example.com
]

# Public subdomains (use public schema)
PUBLIC_SUBDOMAINS = ['www', 'app', 'api', 'admin']
```

### Middleware Order Importance

| Position | Middleware | Why |
|----------|-----------|-----|
| 1 | SecurityMiddleware | Security headers first |
| 2 | **TenantMiddleware** | Set tenant for all requests |
| 3 | SessionMiddleware | Sessions need tenant context |
| 4+ | Other middleware | Can access request.tenant |

### Critical Ordering Rules

**TenantMiddleware MUST be:**
- ✓ After SecurityMiddleware (security first)
- ✓ Before SessionMiddleware (sessions need tenant)
- ✓ Before AuthenticationMiddleware (auth needs tenant)
- ✓ Early in stack (other middleware depends on it)

**TenantMiddleware should NOT be:**
- ✗ First (security should be first)
- ✗ After SessionMiddleware (sessions need tenant)
- ✗ After AuthenticationMiddleware (auth needs tenant)
- ✗ Late in stack (other middleware needs tenant)

### Verify Configuration

Create a simple verification view (temporary):

```python
# apps/core/views.py
from django.http import JsonResponse

def tenant_info_view(request):
    """Debug view to verify tenant resolution."""
    tenant = request.tenant
    
    return JsonResponse({
        'tenant_id': str(tenant.id),
        'tenant_name': tenant.name,
        'schema_name': tenant.schema_name,
        'subdomain': tenant.subdomain,
        'is_active': tenant.is_active,
    })
```

Add to URLs (temporary):

```python
# config/urls.py
urlpatterns = [
    path('_debug/tenant/', tenant_info_view),
]
```

Test with different hosts:
- http://tenant.example.com:8000/_debug/tenant/
- http://mybusiness.com:8000/_debug/tenant/

### Expected Outcome
```
backend/config/settings/base.py
├── MIDDLEWARE
│   └── 'apps.core.middleware.TenantMiddleware' [added at position 2]
├── TENANT_MODEL = 'tenants.Tenant'
├── TENANT_DOMAIN_MODEL = 'tenants.Domain'
├── PUBLIC_SCHEMA_NAME = 'public'
├── PUBLIC_SCHEMA_URLCONF = 'config.urls_public'
└── BASE_DOMAIN = 'lankacommerce.lk'
```

### Verification Checklist
- [ ] TenantMiddleware is in MIDDLEWARE list
- [ ] Position is after SecurityMiddleware
- [ ] Position is before SessionMiddleware
- [ ] Import path is correct (apps.core.middleware.TenantMiddleware)
- [ ] TENANT_MODEL is configured
- [ ] TENANT_DOMAIN_MODEL is configured
- [ ] PUBLIC_SCHEMA_NAME is set
- [ ] BASE_DOMAIN is set
- [ ] Development server starts without errors
- [ ] Test request resolves tenant correctly

---

## Task 27: Test Tenant Resolution

### Overview
Create comprehensive tests for tenant resolution middleware, covering all resolution strategies, error cases, and edge cases.

### Dependencies
- All middleware methods implemented
- Task 26: Register in MIDDLEWARE
- pytest or Django TestCase

### Instructions

1. **Create test file**
   - Create `backend/apps/core/tests/test_tenant_middleware.py`
   - Import TestCase and necessary modules
   - Import TenantMiddleware

2. **Set up test data**
   - Create test fixtures for tenants
   - Create test domains
   - Create public tenant

3. **Test custom domain resolution**
   - Test successful custom domain resolution
   - Test custom domain not found
   - Test case-insensitive matching

4. **Test subdomain resolution**
   - Test successful subdomain resolution
   - Test subdomain not found
   - Test public subdomains skipped

5. **Test public schema handling**
   - Test public host detection
   - Test public tenant retrieval

6. **Test error handling**
   - Test tenant not found (404)
   - Test inactive tenant (403)

7. **Test thread-local storage**
   - Test set_current_tenant
   - Test get_current_tenant

8. **Test edge cases**
   - Test localhost
   - Test IP addresses
   - Test invalid hostnames

### Test File Implementation

```python
"""
Tests for tenant resolution middleware.

Tests cover:
- Custom domain resolution
- Subdomain resolution
- Public schema handling
- Error responses
- Thread-local storage
- Edge cases
"""

import json
from django.test import TestCase, RequestFactory
from django.http import JsonResponse
from apps.tenants.models import Tenant, Domain
from apps.core.middleware import (
    TenantMiddleware,
    set_current_tenant,
    get_current_tenant,
)


class TenantMiddlewareTest(TestCase):
    """Test suite for TenantMiddleware."""
    
    def setUp(self):
        """Set up test fixtures."""
        self.factory = RequestFactory()
        self.middleware = TenantMiddleware(get_response=lambda r: None)
        
        # Create public tenant
        self.public_tenant = Tenant.objects.create(
            name='Public',
            schema_name='public',
            subdomain='public',
            is_active=True,
        )
        
        # Create active test tenant
        self.tenant = Tenant.objects.create(
            name='Test Tenant',
            schema_name='test_tenant',
            subdomain='test-tenant',
            is_active=True,
        )
        
        # Create custom domain for tenant
        self.domain = Domain.objects.create(
            domain='testbusiness.com',
            tenant=self.tenant,
            is_active=True,
        )
        
        # Create inactive tenant
        self.inactive_tenant = Tenant.objects.create(
            name='Inactive Tenant',
            schema_name='inactive',
            subdomain='inactive',
            is_active=False,
        )
    
    def test_custom_domain_resolution(self):
        """Test tenant resolution via custom domain."""
        # Test successful resolution
        tenant = self.middleware._resolve_custom_domain('testbusiness.com')
        self.assertEqual(tenant, self.tenant)
        
        # Test case-insensitive matching
        tenant = self.middleware._resolve_custom_domain('TESTBUSINESS.COM')
        self.assertEqual(tenant, self.tenant)
        
        # Test not found
        tenant = self.middleware._resolve_custom_domain('nonexistent.com')
        self.assertIsNone(tenant)
    
    def test_subdomain_resolution(self):
        """Test tenant resolution via subdomain."""
        # Test successful resolution
        tenant = self.middleware._resolve_subdomain('test-tenant.example.com')
        self.assertEqual(tenant, self.tenant)
        
        # Test not found
        tenant = self.middleware._resolve_subdomain('nonexistent.example.com')
        self.assertIsNone(tenant)
        
        # Test public subdomain skipped
        tenant = self.middleware._resolve_subdomain('www.example.com')
        self.assertIsNone(tenant)
        
        # Test localhost
        tenant = self.middleware._resolve_subdomain('localhost')
        self.assertIsNone(tenant)
        
        # Test IP address
        tenant = self.middleware._resolve_subdomain('192.168.1.1')
        self.assertIsNone(tenant)
    
    def test_public_host_detection(self):
        """Test public host detection."""
        # Test public subdomains
        self.assertTrue(self.middleware._is_public_host('www.example.com'))
        self.assertTrue(self.middleware._is_public_host('app.example.com'))
        self.assertTrue(self.middleware._is_public_host('api.example.com'))
        
        # Test tenant subdomain
        self.assertFalse(self.middleware._is_public_host('tenant.example.com'))
    
    def test_public_tenant_retrieval(self):
        """Test public tenant retrieval."""
        tenant = self.middleware._get_public_tenant()
        self.assertEqual(tenant, self.public_tenant)
    
    def test_tenant_not_found_error(self):
        """Test tenant not found error response."""
        response = self.middleware._handle_not_found()
        
        # Check response type
        self.assertIsInstance(response, JsonResponse)
        
        # Check status code
        self.assertEqual(response.status_code, 404)
        
        # Check response content
        content = json.loads(response.content)
        self.assertEqual(content['code'], 'TENANT_NOT_FOUND')
        self.assertIn('error', content)
    
    def test_inactive_tenant_error(self):
        """Test inactive tenant error response."""
        response = self.middleware._handle_inactive()
        
        # Check response type
        self.assertIsInstance(response, JsonResponse)
        
        # Check status code
        self.assertEqual(response.status_code, 403)
        
        # Check response content
        content = json.loads(response.content)
        self.assertEqual(content['code'], 'TENANT_INACTIVE')
        self.assertIn('error', content)
    
    def test_thread_local_storage(self):
        """Test thread-local tenant storage."""
        # Initially no tenant
        self.assertIsNone(get_current_tenant())
        
        # Set tenant
        set_current_tenant(self.tenant)
        
        # Retrieve tenant
        current = get_current_tenant()
        self.assertEqual(current, self.tenant)
        
        # Clear tenant
        from apps.core.middleware.tenant import clear_current_tenant
        clear_current_tenant()
        
        # Should be None again
        self.assertIsNone(get_current_tenant())
    
    def test_resolution_priority(self):
        """Test resolution priority (custom > subdomain > public)."""
        # Create domain that matches subdomain pattern
        priority_tenant = Tenant.objects.create(
            name='Priority Tenant',
            schema_name='priority',
            subdomain='priority',
            is_active=True,
        )
        
        # Add custom domain
        Domain.objects.create(
            domain='priority.example.com',
            tenant=priority_tenant,
            is_active=True,
        )
        
        # Custom domain should win over subdomain
        tenant = self.middleware._resolve_custom_domain('priority.example.com')
        self.assertEqual(tenant, priority_tenant)
    
    def test_process_request_inactive_tenant(self):
        """Test process_request with inactive tenant."""
        # Create domain for inactive tenant
        Domain.objects.create(
            domain='inactive.com',
            tenant=self.inactive_tenant,
            is_active=True,
        )
        
        # Create request
        request = self.factory.get('/', HTTP_HOST='inactive.com')
        
        # Process request
        response = self.middleware.process_request(request)
        
        # Should return 403
        self.assertIsInstance(response, JsonResponse)
        self.assertEqual(response.status_code, 403)


class TenantUtilityTest(TestCase):
    """Test suite for tenant utility functions."""
    
    def test_get_current_tenant_in_view(self):
        """Test get_current_tenant in view context."""
        tenant = Tenant.objects.create(
            name='View Tenant',
            schema_name='view_tenant',
            subdomain='view',
            is_active=True,
        )
        
        # Simulate middleware setting tenant
        set_current_tenant(tenant)
        
        # Get in "view"
        current = get_current_tenant()
        self.assertEqual(current, tenant)
```

### Running Tests

```bash
# Run all tenant tests
python manage.py test apps.core.tests.test_tenant_middleware

# Run with pytest
pytest apps/core/tests/test_tenant_middleware.py -v

# Run specific test
python manage.py test apps.core.tests.test_tenant_middleware.TenantMiddlewareTest.test_custom_domain_resolution
```

### Test Coverage Goals

| Area | Tests | Coverage |
|------|-------|----------|
| **Custom Domain** | 3 tests | Success, not found, case-insensitive |
| **Subdomain** | 5 tests | Success, not found, public, localhost, IP |
| **Public Schema** | 2 tests | Detection, retrieval |
| **Errors** | 2 tests | Not found, inactive |
| **Thread-Local** | 1 test | Set, get, clear |
| **Priority** | 1 test | Resolution order |
| **Integration** | 1 test | Full process_request |

### Expected Outcome
```
backend/apps/core/tests/
├── __init__.py
└── test_tenant_middleware.py [created]
    ├── class TenantMiddlewareTest
    │   ├── test_custom_domain_resolution()
    │   ├── test_subdomain_resolution()
    │   ├── test_public_host_detection()
    │   ├── test_public_tenant_retrieval()
    │   ├── test_tenant_not_found_error()
    │   ├── test_inactive_tenant_error()
    │   ├── test_thread_local_storage()
    │   ├── test_resolution_priority()
    │   └── test_process_request_inactive_tenant()
    └── class TenantUtilityTest
        └── test_get_current_tenant_in_view()
```

### Verification Checklist
- [ ] Test file created
- [ ] Test fixtures set up (tenants, domains)
- [ ] Custom domain tests pass
- [ ] Subdomain tests pass
- [ ] Public schema tests pass
- [ ] Error handling tests pass
- [ ] Thread-local tests pass
- [ ] Resolution priority tests pass
- [ ] All tests pass
- [ ] Test coverage > 90%

---

## Task 28: Document Tenant Middleware

### Overview
Create comprehensive documentation for the tenant middleware system, explaining architecture, usage, configuration, and troubleshooting.

### Dependencies
- All middleware tasks completed
- All tests passing

### Instructions

1. **Create documentation file**
   - Create `backend/docs/middleware/tenant_middleware.md`
   - Use clear structure and formatting
   - Include diagrams where helpful

2. **Document architecture**
   - Explain multi-tenancy approach
   - Document resolution priority
   - Show middleware flow

3. **Document configuration**
   - List all settings
   - Explain each setting's purpose
   - Provide examples

4. **Document usage**
   - Show how to access tenant in views
   - Show thread-local usage
   - Provide code examples

5. **Document API**
   - List all public functions
   - Document parameters and return values
   - Provide usage examples

6. **Document troubleshooting**
   - Common issues and solutions
   - Error messages and meanings
   - Debugging tips

7. **Add examples**
   - Real-world usage scenarios
   - Sri Lanka-specific examples
   - Best practices

### Documentation Content

```markdown
# Tenant Middleware Documentation

> **Module:** `apps.core.middleware.tenant`  
> **Version:** 1.0  
> **Last Updated:** January 2026

---

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Configuration](#configuration)
4. [Usage](#usage)
5. [API Reference](#api-reference)
6. [Testing](#testing)
7. [Troubleshooting](#troubleshooting)
8. [Examples](#examples)

---

## Overview

The Tenant Middleware system extends django-tenants to provide advanced multi-tenancy support with custom domain and subdomain resolution.

### Features

- ✓ Custom domain resolution (e.g., `mybusiness.com`)
- ✓ Subdomain resolution (e.g., `tenant.example.com`)
- ✓ Public schema handling (e.g., `www.example.com`)
- ✓ Thread-local storage for non-request contexts
- ✓ JSON error responses for API compatibility
- ✓ Automatic schema switching
- ✓ Tenant activation checks

### Resolution Priority

1. **Custom Domain** (Priority 1): `mybusiness.com` → Tenant
2. **Subdomain** (Priority 2): `tenant.example.com` → Tenant
3. **Public Schema** (Priority 3): `www.example.com` → Public

---

## Architecture

### Request Flow

```
HTTP Request
    ↓
SecurityMiddleware
    ↓
TenantMiddleware
    ├─→ Extract hostname
    ├─→ Try custom domain
    ├─→ Try subdomain
    ├─→ Try public schema
    ├─→ Validate tenant
    ├─→ Set request.tenant
    ├─→ Set thread-local
    └─→ Switch database schema
    ↓
SessionMiddleware
    ↓
View (can access request.tenant)
```

### Class Hierarchy

```
TenantMainMiddleware (django-tenants)
    ↑
    └── TenantMiddleware (custom)
        ├── _resolve_custom_domain()
        ├── _resolve_subdomain()
        ├── _is_public_host()
        ├── _get_public_tenant()
        ├── _handle_not_found()
        └── _handle_inactive()
```

---

## Configuration

### Required Settings

```python
# settings/base.py

# Middleware
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'apps.core.middleware.TenantMiddleware',  # Position is critical
    'django.contrib.sessions.middleware.SessionMiddleware',
    # ...
]

# Tenant models
TENANT_MODEL = 'tenants.Tenant'
TENANT_DOMAIN_MODEL = 'tenants.Domain'

# Public schema
PUBLIC_SCHEMA_NAME = 'public'
PUBLIC_SCHEMA_URLCONF = 'config.urls_public'

# Domain configuration
BASE_DOMAIN = 'lankacommerce.lk'
```

### Optional Settings

```python
# Public subdomains (use public schema)
PUBLIC_SUBDOMAINS = ['www', 'app', 'api', 'admin']

# Enable debug logging
LOGGING = {
    'loggers': {
        'apps.core.middleware.tenant': {
            'level': 'DEBUG',
        },
    },
}
```

---

## Usage

### In Views

```python
def dashboard_view(request):
    """Access tenant from request."""
    # Get current tenant
    tenant = request.tenant
    
    # Use tenant information
    company_name = tenant.name
    currency = tenant.settings.currency
    
    return render(request, 'dashboard.html', {
        'tenant': tenant,
        'company_name': company_name,
    })
```

### In Celery Tasks

```python
from celery import shared_task
from apps.core.middleware import set_current_tenant, get_current_tenant

@shared_task
def process_orders(tenant_schema):
    """Background task with tenant context."""
    # Set tenant for this task
    tenant = Tenant.objects.get(schema_name=tenant_schema)
    set_current_tenant(tenant)
    
    # Now available in utility functions
    orders = get_pending_orders()  # Uses get_current_tenant()
    
    for order in orders:
        process_order(order)
```

### In Django Signals

```python
from django.db.models.signals import post_save
from apps.core.middleware import get_current_tenant

@receiver(post_save, sender=Order)
def order_created(sender, instance, created, **kwargs):
    """Signal with tenant context."""
    if created:
        tenant = get_current_tenant()
        send_notification(tenant, instance)
```

---

## API Reference

### Functions

#### `set_current_tenant(tenant)`

Set the current tenant in thread-local storage.

**Parameters:**
- `tenant` (Tenant): Tenant object to store

**Returns:** None

**Example:**
```python
set_current_tenant(my_tenant)
```

#### `get_current_tenant()`

Get the current tenant from thread-local storage.

**Parameters:** None

**Returns:** Tenant object or None

**Example:**
```python
tenant = get_current_tenant()
if tenant:
    print(f"Current tenant: {tenant.name}")
```

#### `clear_current_tenant()`

Clear the current tenant from thread-local storage.

**Parameters:** None

**Returns:** None

**Example:**
```python
clear_current_tenant()
```

---

## Testing

### Run Tests

```bash
# All tenant tests
python manage.py test apps.core.tests.test_tenant_middleware

# Specific test
python manage.py test apps.core.tests.test_tenant_middleware.TenantMiddlewareTest.test_custom_domain_resolution
```

### Test Coverage

```bash
coverage run --source='apps.core.middleware' manage.py test
coverage report
```

---

## Troubleshooting

### Issue: "Tenant not found" error

**Cause:** No tenant exists for the hostname

**Solutions:**
1. Create tenant with matching subdomain
2. Add custom domain for tenant
3. Check hostname spelling

### Issue: "Tenant is inactive" error

**Cause:** Tenant exists but `is_active=False`

**Solutions:**
1. Activate tenant: `tenant.is_active = True; tenant.save()`
2. Check subscription status
3. Contact support if suspended

### Issue: Wrong tenant in background task

**Cause:** Thread-local not set

**Solution:**
```python
@shared_task
def my_task(tenant_schema):
    tenant = Tenant.objects.get(schema_name=tenant_schema)
    set_current_tenant(tenant)  # ← Add this
    # ...
```

---

## Examples

### Sri Lankan Business Setup

```python
# Create tenant for Colombo shop
tenant = Tenant.objects.create(
    name='Colombo Electronics',
    schema_name='colombo_electronics',
    subdomain='colombo-electronics',
    is_active=True,
)

# Add custom domain
Domain.objects.create(
    domain='colomboelectronics.lk',
    tenant=tenant,
    is_primary=True,
)

# Access via:
# - http://colombo-electronics.example.com
# - http://colomboelectronics.lk
```

---

## Best Practices

1. **Use request.tenant in views** - More explicit
2. **Use thread-local in background tasks** - No request available
3. **Always check is_active** - Handled by middleware
4. **Clear thread-local after use** - Handled by middleware
5. **Use subdomain for testing** - Easier than custom domains
6. **Reserve public subdomains** - www, app, api, admin
```

### Expected Outcome
```
backend/docs/middleware/
└── tenant_middleware.md [created]
    ├── Overview
    ├── Architecture
    ├── Configuration
    ├── Usage
    ├── API Reference
    ├── Testing
    ├── Troubleshooting
    └── Examples
```

### Verification Checklist
- [ ] Documentation file created
- [ ] Architecture is explained
- [ ] Configuration is documented
- [ ] Usage examples are provided
- [ ] API reference is complete
- [ ] Testing section is included
- [ ] Troubleshooting guide is present
- [ ] Sri Lanka-specific examples included

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 24 | Add Thread Local Storage | Thread-local tenant storage |
| 25 | Create get_current_tenant Utility | get_current_tenant() function |
| 26 | Register in MIDDLEWARE | TenantMiddleware in settings |
| 27 | Test Tenant Resolution | Comprehensive test suite |
| 28 | Document Tenant Middleware | Complete documentation |

### Group B Complete Deliverables
```
backend/
├── apps/core/middleware/
│   ├── __init__.py [exports]
│   └── tenant.py [complete]
│       ├── _thread_locals
│       ├── set_current_tenant()
│       ├── get_current_tenant()
│       ├── clear_current_tenant()
│       └── class TenantMiddleware [complete]
├── apps/core/tests/
│   └── test_tenant_middleware.py [complete]
├── config/settings/base.py
│   └── MIDDLEWARE [updated]
└── docs/middleware/
    └── tenant_middleware.md [created]
```

### Complete Tenant Middleware Features

✓ **Resolution Strategies:**
- Custom domain (priority 1)
- Subdomain (priority 2)
- Public schema (priority 3)

✓ **Error Handling:**
- Tenant not found (404 JSON)
- Inactive tenant (403 JSON)
- Server errors (500 JSON)

✓ **Tenant Access:**
- request.tenant in views
- get_current_tenant() in tasks
- Thread-local storage

✓ **Testing:**
- 10+ test cases
- > 90% coverage
- All edge cases covered

✓ **Documentation:**
- Complete API reference
- Usage examples
- Troubleshooting guide

### Group B Summary

All 14 tasks (15-28) in Group B are complete:
- ✓ django-tenants configured and extended
- ✓ Custom domain and subdomain resolution implemented
- ✓ Error handlers with JSON responses
- ✓ Thread-local storage for non-request access
- ✓ Comprehensive tests with high coverage
- ✓ Complete documentation

### Next Steps

Proceed to [../Group-C_Request-Logging-Middleware/](../Group-C_Request-Logging-Middleware/) to implement request logging middleware for audit trails and monitoring.

---

## Notes for AI Agents

1. **Thread-Local:** Use threading.local() at module level
2. **set_current_tenant:** Call in process_request after setting request.tenant
3. **get_current_tenant:** Safe with getattr, returns None if not set
4. **Cleanup:** Optional but recommended in process_response/process_exception
5. **Middleware Order:** Position 2 in MIDDLEWARE (after Security, before Session)
6. **Testing:** Use RequestFactory for middleware tests
7. **Documentation:** Keep examples practical and Sri Lanka-relevant
8. **Export:** Use __init__.py for clean imports
9. **Best Practice:** Prefer request.tenant in views, thread-local in background tasks
10. **Coverage:** Aim for > 90% test coverage on middleware
