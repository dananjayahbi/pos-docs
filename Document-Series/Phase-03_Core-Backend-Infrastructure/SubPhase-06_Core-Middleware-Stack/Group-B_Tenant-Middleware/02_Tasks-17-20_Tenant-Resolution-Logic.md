# Tasks 17-20: Tenant Resolution Logic

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 06 - Core Middleware Stack  
> **Group:** B - Tenant Middleware  
> **Document:** 02 of 04  
> **Tasks Covered:** 17, 18, 19, 20

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-15-16_Django-Tenants-Configuration.md](01_Tasks-15-16_Django-Tenants-Configuration.md)
- **→ Next Document:** [03_Tasks-21-23_Error-Handling.md](03_Tasks-21-23_Error-Handling.md)

---

## Document Overview

This document implements the core tenant resolution logic with support for subdomain resolution, custom domain resolution, and public schema handling with proper priority ordering.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 17 | Add Tenant Resolution Logic | Medium |
| 18 | Add Subdomain Resolution | Medium |
| 19 | Add Custom Domain Resolution | Medium |
| 20 | Handle Public Schema | Simple |

---

## Task 17: Add Tenant Resolution Logic

### Overview
Implement the main tenant resolution flow in process_request method with proper priority ordering: custom domain (priority 1), subdomain (priority 2), public schema (priority 3).

### Dependencies
- Task 16: Create Custom TenantMiddleware
- Tenant model with is_active field
- Domain model created

### Instructions

1. **Open tenant middleware file**
   - Navigate to `backend/apps/core/middleware/tenant.py`
   - Locate process_request method

2. **Implement hostname extraction**
   - Use `self.hostname_from_request(request)` from parent
   - This handles X-Forwarded-Host and Host headers
   - Store in local variable

3. **Add tenant variable initialization**
   - Initialize tenant = None
   - Will be populated by resolution methods

4. **Implement resolution priority flow**
   - Try custom domain first (Priority 1)
   - If not found, try subdomain (Priority 2)
   - If still not found, check for public host (Priority 3)

5. **Add tenant validation**
   - Check if tenant was found
   - Check if tenant.is_active
   - Call error handlers if needed

6. **Set request.tenant attribute**
   - Attach tenant to request object
   - This makes tenant accessible in views
   - Required for downstream middleware

7. **Call parent process_request**
   - Call super().process_request(request)
   - This handles schema switching
   - Return the result

8. **Add comprehensive error handling**
   - Handle DisallowedHost exception
   - Handle database errors gracefully
   - Return appropriate error responses

### Resolution Priority Logic

```
┌─────────────────────────────────┐
│   Extract hostname from request │
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│ Priority 1: Custom Domain?      │
│ (mybusiness.com)                │
└────┬────────────────────┬───────┘
     │ Found              │ Not Found
     ▼                    ▼
   [Use]        ┌─────────────────────┐
                │ Priority 2: Subdomain? │
                │ (tenant.example.com)   │
                └────┬─────────────┬─────┘
                     │ Found       │ Not Found
                     ▼             ▼
                   [Use]   ┌──────────────────┐
                           │ Priority 3: Public? │
                           │ (www.example.com)   │
                           └────┬────────┬───────┘
                                │ Yes    │ No
                                ▼        ▼
                              [Use]  [404 Error]
```

### Process Request Implementation

```python
def process_request(self, request):
    """
    Process incoming request and resolve tenant.
    
    Resolution priority:
    1. Custom domain (mybusiness.com)
    2. Subdomain (tenant.example.com)
    3. Public schema (www.example.com)
    
    Args:
        request: HttpRequest object
        
    Returns:
        HttpResponse if error, None if successful
    """
    try:
        # Extract hostname from request
        hostname = self.hostname_from_request(request)
        
        # Initialize tenant
        tenant = None
        
        # Priority 1: Try custom domain first
        tenant = self._resolve_custom_domain(hostname)
        
        # Priority 2: Try subdomain if custom domain not found
        if not tenant:
            tenant = self._resolve_subdomain(hostname)
        
        # Priority 3: Check if public host
        if not tenant and self._is_public_host(hostname):
            tenant = self._get_public_tenant()
        
        # No tenant found - return 404
        if not tenant:
            return self._handle_not_found()
        
        # Tenant found but inactive - return 403
        if not tenant.is_active:
            return self._handle_inactive()
        
        # Attach tenant to request
        request.tenant = tenant
        
        # Call parent to handle schema switching
        return super().process_request(request)
        
    except DisallowedHost:
        # Handle disallowed host
        return self._handle_not_found()
    except Exception as e:
        # Log error and return server error
        import logging
        logger = logging.getLogger(__name__)
        logger.error(f"Error in tenant resolution: {str(e)}")
        
        # Return 500 error
        return JsonResponse(
            {'error': 'Internal server error', 'code': 'SERVER_ERROR'},
            status=500
        )
```

### Resolution Flow Table

| Step | Action | Success | Failure |
|------|--------|---------|---------|
| 1 | Extract hostname | → Step 2 | → Error handler |
| 2 | Try custom domain | → Found tenant | → Step 3 |
| 3 | Try subdomain | → Found tenant | → Step 4 |
| 4 | Check public host | → Use public | → 404 error |
| 5 | Validate is_active | → Set request.tenant | → 403 error |
| 6 | Schema switching | → Success | → 500 error |

### Expected Outcome
```
backend/apps/core/middleware/tenant.py
└── class TenantMiddleware
    └── process_request() [implemented]
        ├── Extract hostname
        ├── Try custom domain (priority 1)
        ├── Try subdomain (priority 2)
        ├── Try public schema (priority 3)
        ├── Validate tenant
        ├── Set request.tenant
        └── Call super().process_request()
```

### Verification Checklist
- [ ] process_request method is fully implemented
- [ ] Hostname extraction uses parent method
- [ ] Resolution priority is correct (custom → subdomain → public)
- [ ] Tenant not found returns error response
- [ ] Inactive tenant returns error response
- [ ] request.tenant is set on success
- [ ] super().process_request() is called
- [ ] Exception handling is in place

---

## Task 18: Add Subdomain Resolution

### Overview
Implement subdomain-based tenant resolution to support URLs like tenant.example.com, where the first part of the hostname identifies the tenant.

### Dependencies
- Task 17: Add Tenant Resolution Logic
- Tenant model with subdomain field

### Instructions

1. **Locate _resolve_subdomain method**
   - Open `backend/apps/core/middleware/tenant.py`
   - Find _resolve_subdomain stub

2. **Implement hostname parsing**
   - Split hostname by dots
   - Extract first part as subdomain
   - Handle edge cases (localhost, IP addresses)

3. **Query tenant by subdomain**
   - Import Tenant model lazily
   - Use Tenant.objects.get(subdomain=subdomain)
   - Catch DoesNotExist exception

4. **Add subdomain validation**
   - Ignore if hostname has no dots (localhost)
   - Ignore if hostname is IP address
   - Return None for invalid formats

5. **Handle query exceptions**
   - Catch Tenant.DoesNotExist
   - Catch Tenant.MultipleObjectsReturned
   - Return None on any exception

6. **Add logging**
   - Log successful subdomain resolution
   - Log failed subdomain lookup
   - Use debug level for verbose logging

### Subdomain Resolution Implementation

```python
def _resolve_subdomain(self, hostname):
    """
    Resolve tenant from subdomain.
    
    Extracts subdomain from hostname (e.g., 'tenant' from 'tenant.example.com')
    and queries for matching tenant.
    
    Args:
        hostname: Full hostname (e.g., 'tenant.example.com')
        
    Returns:
        Tenant object if found, None otherwise
        
    Examples:
        'tenant.example.com' → Tenant(subdomain='tenant')
        'shop.lankacommerce.lk' → Tenant(subdomain='shop')
        'localhost' → None (no subdomain)
    """
    # Import here to avoid circular dependencies
    from apps.tenants.models import Tenant
    
    # Skip if hostname has no dots (e.g., 'localhost')
    if '.' not in hostname:
        return None
    
    # Skip if hostname is IP address
    import re
    ip_pattern = r'^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$'
    if re.match(ip_pattern, hostname):
        return None
    
    # Extract subdomain (first part before first dot)
    subdomain = hostname.split('.')[0]
    
    # Skip common public subdomains
    public_subdomains = ['www', 'app', 'api', 'admin']
    if subdomain in public_subdomains:
        return None
    
    try:
        # Query tenant by subdomain
        tenant = Tenant.objects.get(subdomain=subdomain)
        
        # Log successful resolution
        import logging
        logger = logging.getLogger(__name__)
        logger.debug(f"Resolved tenant '{tenant.name}' from subdomain '{subdomain}'")
        
        return tenant
        
    except Tenant.DoesNotExist:
        # Subdomain not found
        import logging
        logger = logging.getLogger(__name__)
        logger.debug(f"No tenant found for subdomain '{subdomain}'")
        return None
        
    except Tenant.MultipleObjectsReturned:
        # Multiple tenants with same subdomain (should not happen)
        import logging
        logger = logging.getLogger(__name__)
        logger.error(f"Multiple tenants found for subdomain '{subdomain}'")
        return None
```

### Subdomain Parsing Examples

| Hostname | Extracted Subdomain | Action |
|----------|---------------------|--------|
| `tenant.example.com` | `tenant` | Query Tenant.objects.get(subdomain='tenant') |
| `shop.lankacommerce.lk` | `shop` | Query Tenant.objects.get(subdomain='shop') |
| `www.example.com` | `www` | Return None (public subdomain) |
| `api.example.com` | `api` | Return None (public subdomain) |
| `localhost` | N/A | Return None (no subdomain) |
| `192.168.1.1` | N/A | Return None (IP address) |

### Public Subdomains to Skip

| Subdomain | Purpose |
|-----------|---------|
| `www` | Public website |
| `app` | Public application |
| `api` | Public API |
| `admin` | Public admin (tenant selection) |

### Expected Outcome
```
backend/apps/core/middleware/tenant.py
└── class TenantMiddleware
    └── _resolve_subdomain() [implemented]
        ├── Parse hostname
        ├── Extract subdomain
        ├── Skip public subdomains
        ├── Query Tenant model
        ├── Handle exceptions
        └── Return tenant or None
```

### Verification Checklist
- [ ] _resolve_subdomain method is implemented
- [ ] Hostname parsing handles dots correctly
- [ ] IP addresses are skipped
- [ ] localhost is skipped
- [ ] Public subdomains are skipped
- [ ] Tenant.DoesNotExist is caught
- [ ] Logging is present
- [ ] Returns None on failure

---

## Task 19: Add Custom Domain Resolution

### Overview
Implement custom domain-based tenant resolution to support fully custom domains like mybusiness.com pointing to a specific tenant.

### Dependencies
- Task 17: Add Tenant Resolution Logic
- Domain model with domain field
- Many-to-many or foreign key relationship between Domain and Tenant

### Instructions

1. **Locate _resolve_custom_domain method**
   - Open `backend/apps/core/middleware/tenant.py`
   - Find _resolve_custom_domain stub

2. **Implement domain query**
   - Import Domain model lazily
   - Query Domain.objects.get(domain=hostname)
   - Return associated tenant

3. **Handle exact domain matching**
   - Match full hostname exactly
   - No subdomain extraction needed
   - Case-insensitive matching

4. **Add domain validation**
   - Verify domain is active (if domain has is_active field)
   - Verify tenant is linked to domain
   - Return None if validation fails

5. **Handle query exceptions**
   - Catch Domain.DoesNotExist
   - Catch Domain.MultipleObjectsReturned
   - Return None on any exception

6. **Add logging**
   - Log successful custom domain resolution
   - Log failed domain lookup
   - Log domain validation failures

### Custom Domain Resolution Implementation

```python
def _resolve_custom_domain(self, hostname):
    """
    Resolve tenant from custom domain.
    
    Queries Domain model for exact hostname match and returns
    the associated tenant.
    
    Args:
        hostname: Full hostname (e.g., 'mybusiness.com')
        
    Returns:
        Tenant object if found, None otherwise
        
    Examples:
        'mybusiness.com' → Tenant(name='My Business')
        'shop.lk' → Tenant(name='Shop LK')
        'unknown.com' → None
    """
    # Import here to avoid circular dependencies
    from apps.tenants.models import Domain
    
    try:
        # Query domain by exact hostname match
        domain = Domain.objects.select_related('tenant').get(
            domain__iexact=hostname
        )
        
        # Check if domain is active (if field exists)
        if hasattr(domain, 'is_active') and not domain.is_active:
            import logging
            logger = logging.getLogger(__name__)
            logger.warning(f"Custom domain '{hostname}' found but inactive")
            return None
        
        # Get associated tenant
        tenant = domain.tenant
        
        # Log successful resolution
        import logging
        logger = logging.getLogger(__name__)
        logger.debug(f"Resolved tenant '{tenant.name}' from custom domain '{hostname}'")
        
        return tenant
        
    except Domain.DoesNotExist:
        # Custom domain not found
        import logging
        logger = logging.getLogger(__name__)
        logger.debug(f"No custom domain found for '{hostname}'")
        return None
        
    except Domain.MultipleObjectsReturned:
        # Multiple domains with same hostname (should not happen due to unique constraint)
        import logging
        logger = logging.getLogger(__name__)
        logger.error(f"Multiple domains found for '{hostname}'")
        return None
```

### Custom Domain Examples

| Custom Domain | Tenant | Notes |
|---------------|--------|-------|
| `mybusiness.com` | My Business | Full custom domain |
| `shop.lk` | Shop LK | Country TLD |
| `boutique-fashion.com` | Boutique Fashion | Hyphenated domain |
| `electronics-store.lk` | Electronics Store LK | Sri Lankan business |

### Domain Model Relationship

```python
# Example Domain model structure
class Domain(models.Model):
    domain = models.CharField(max_length=255, unique=True)
    tenant = models.ForeignKey('Tenant', on_delete=models.CASCADE)
    is_active = models.BooleanField(default=True)
    is_primary = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
```

### Expected Outcome
```
backend/apps/core/middleware/tenant.py
└── class TenantMiddleware
    └── _resolve_custom_domain() [implemented]
        ├── Query Domain model
        ├── Check domain is_active status
        ├── Get associated tenant
        ├── Handle exceptions
        └── Return tenant or None
```

### Verification Checklist
- [ ] _resolve_custom_domain method is implemented
- [ ] Exact hostname matching is used
- [ ] Case-insensitive matching (iexact)
- [ ] select_related is used for efficiency
- [ ] Domain is_active is checked (if field exists)
- [ ] Domain.DoesNotExist is caught
- [ ] Logging is present
- [ ] Returns None on failure

---

## Task 20: Handle Public Schema

### Overview
Implement public schema detection and tenant retrieval for requests to public URLs like www.example.com, app.example.com, or api.example.com.

### Dependencies
- Task 17: Add Tenant Resolution Logic
- Tenant model with schema_name='public'
- PUBLIC_SCHEMA_NAME setting configured

### Instructions

1. **Locate _is_public_host method**
   - Open `backend/apps/core/middleware/tenant.py`
   - Find _is_public_host stub

2. **Define public hostnames list**
   - Common public subdomains: www, app, api, admin
   - Base domain without subdomain
   - Import from settings if configured

3. **Implement hostname checking**
   - Extract subdomain from hostname
   - Check if subdomain is in public list
   - Check if hostname matches base domain

4. **Locate _get_public_tenant method**
   - Find _get_public_tenant stub

5. **Implement public tenant retrieval**
   - Import Tenant model
   - Query for tenant with schema_name='public'
   - Use PUBLIC_SCHEMA_NAME from settings
   - Cache result for performance

6. **Add error handling**
   - Handle case where public tenant doesn't exist
   - Log error if public tenant not found
   - Raise exception or return None appropriately

### Public Host Detection Implementation

```python
def _is_public_host(self, hostname):
    """
    Check if hostname is public schema.
    
    Public hosts include:
    - www.example.com
    - app.example.com
    - api.example.com
    - example.com (base domain)
    
    Args:
        hostname: Full hostname
        
    Returns:
        Boolean indicating if public host
    """
    from django.conf import settings
    
    # Public subdomains
    public_subdomains = ['www', 'app', 'api', 'admin']
    
    # Get base domain from settings (e.g., 'example.com')
    base_domain = getattr(settings, 'BASE_DOMAIN', None)
    
    # Check if hostname is base domain
    if base_domain and hostname == base_domain:
        return True
    
    # Check if hostname has public subdomain
    if '.' in hostname:
        subdomain = hostname.split('.')[0]
        if subdomain in public_subdomains:
            return True
    
    return False


def _get_public_tenant(self):
    """
    Get public schema tenant.
    
    Returns:
        Public tenant object
        
    Raises:
        Tenant.DoesNotExist: If public tenant not found
    """
    from django.conf import settings
    from apps.tenants.models import Tenant
    
    # Get public schema name from settings
    public_schema_name = getattr(settings, 'PUBLIC_SCHEMA_NAME', 'public')
    
    try:
        # Query for public tenant (cache this in production)
        tenant = Tenant.objects.get(schema_name=public_schema_name)
        
        # Log successful retrieval
        import logging
        logger = logging.getLogger(__name__)
        logger.debug(f"Using public schema tenant")
        
        return tenant
        
    except Tenant.DoesNotExist:
        # Public tenant not found - this is a critical error
        import logging
        logger = logging.getLogger(__name__)
        logger.error(f"Public tenant with schema_name='{public_schema_name}' not found")
        
        # Re-raise as this should never happen
        raise
```

### Public Host Examples

| Hostname | Is Public? | Reason |
|----------|-----------|--------|
| `www.example.com` | Yes | www subdomain |
| `app.example.com` | Yes | app subdomain |
| `api.example.com` | Yes | api subdomain |
| `admin.example.com` | Yes | admin subdomain |
| `example.com` | Yes | Base domain |
| `tenant.example.com` | No | Tenant subdomain |
| `shop.example.com` | No | Tenant subdomain |

### Settings Configuration

```python
# settings/base.py
PUBLIC_SCHEMA_NAME = 'public'
BASE_DOMAIN = 'example.com'  # or 'lankacommerce.lk'

# Public tenant should exist in database
# Tenant(schema_name='public', name='Public', subdomain='public')
```

### Performance Optimization

For production, consider caching the public tenant:

```python
from django.core.cache import cache

def _get_public_tenant(self):
    """Get public tenant with caching."""
    # Try cache first
    tenant = cache.get('public_tenant')
    if tenant:
        return tenant
    
    # Query database
    from django.conf import settings
    from apps.tenants.models import Tenant
    public_schema_name = getattr(settings, 'PUBLIC_SCHEMA_NAME', 'public')
    tenant = Tenant.objects.get(schema_name=public_schema_name)
    
    # Cache for 1 hour
    cache.set('public_tenant', tenant, 3600)
    
    return tenant
```

### Expected Outcome
```
backend/apps/core/middleware/tenant.py
└── class TenantMiddleware
    ├── _is_public_host() [implemented]
    │   ├── Check public subdomains
    │   └── Check base domain
    └── _get_public_tenant() [implemented]
        ├── Query public tenant
        ├── Handle not found
        └── Optional caching
```

### Verification Checklist
- [ ] _is_public_host method is implemented
- [ ] Public subdomains list is defined
- [ ] Base domain checking is included
- [ ] _get_public_tenant method is implemented
- [ ] PUBLIC_SCHEMA_NAME is used from settings
- [ ] Tenant.DoesNotExist is handled
- [ ] Logging is present
- [ ] Optional caching is considered

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 17 | Add Tenant Resolution Logic | Main resolution flow in process_request |
| 18 | Add Subdomain Resolution | _resolve_subdomain implementation |
| 19 | Add Custom Domain Resolution | _resolve_custom_domain implementation |
| 20 | Handle Public Schema | _is_public_host and _get_public_tenant |

### Resolution Methods Implemented
```
backend/apps/core/middleware/tenant.py
└── class TenantMiddleware
    ├── process_request() [complete]
    │   └── Implements 3-priority resolution
    ├── _resolve_custom_domain() [complete]
    │   └── Priority 1: Custom domains
    ├── _resolve_subdomain() [complete]
    │   └── Priority 2: Subdomains
    ├── _is_public_host() [complete]
    │   └── Priority 3: Public detection
    └── _get_public_tenant() [complete]
        └── Priority 3: Public tenant retrieval
```

### Resolution Priority Summary

```
Request: mybusiness.com
    ↓
1️⃣ Custom Domain? → ✓ Found → Use tenant
    
Request: tenant.example.com
    ↓
1️⃣ Custom Domain? → ✗ Not found
    ↓
2️⃣ Subdomain? → ✓ Found → Use tenant
    
Request: www.example.com
    ↓
1️⃣ Custom Domain? → ✗ Not found
    ↓
2️⃣ Subdomain? → ✗ Not found (public subdomain)
    ↓
3️⃣ Public Host? → ✓ Yes → Use public tenant
    
Request: unknown.example.com
    ↓
1️⃣ Custom Domain? → ✗ Not found
    ↓
2️⃣ Subdomain? → ✗ Not found
    ↓
3️⃣ Public Host? → ✗ No
    ↓
❌ Return 404 Error
```

### Next Steps
Proceed to [03_Tasks-21-23_Error-Handling.md](03_Tasks-21-23_Error-Handling.md) to implement error handlers for tenant not found and inactive tenant scenarios.

---

## Notes for AI Agents

1. **Resolution Priority:** Custom domain always checked first, then subdomain, then public
2. **Lazy Imports:** All model imports are inside methods to avoid circular dependencies
3. **Case Sensitivity:** Use `domain__iexact` for case-insensitive matching
4. **Performance:** Use `select_related('tenant')` when querying Domain model
5. **Public Subdomains:** www, app, api, admin are reserved for public schema
6. **IP Addresses:** Skip subdomain resolution for IP addresses
7. **Localhost:** Skip subdomain resolution for localhost
8. **Caching:** Consider caching public tenant in production for performance
9. **Logging:** Use debug level for successful resolutions, warning/error for issues
10. **Exception Handling:** Always catch DoesNotExist and return None, don't let exceptions bubble up
