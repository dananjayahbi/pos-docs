# SubPhase 06: Tenant Middleware Configuration - Tasks Summary

> **Phase:** 02 - Database Architecture & Multi-Tenancy  
> **SubPhase Index:** 06 of 10  
> **SubPhase Goal:** Set up request middleware for automatic tenant resolution  
> **Total Tasks:** 82 | **Status:** Planning  
> **Estimated Duration:** 5-6 hours

---

## Navigation

- **↑ Parent:** [00_SUBPHASES_SUMMARY.md](../00_SUBPHASES_SUMMARY.md)
- **← Previous SubPhase:** [SubPhase-05_Tenant-Schema-Template](../SubPhase-05_Tenant-Schema-Template/)
- **→ Next SubPhase:** [SubPhase-07_Database-Router-Setup](../SubPhase-07_Database-Router-Setup/)

---

## SubPhase Overview

This sub-phase configures the Django middleware that intercepts every incoming request and determines which tenant it belongs to. The middleware sets the database schema context so all subsequent queries go to the correct tenant.

### Key Outcomes
- Tenant middleware configured and working
- Subdomain-based resolution working
- Custom domain resolution working
- Header-based resolution for API calls
- Fallback to public tenant configured
- Error handling for unknown tenants

### Resolution Methods
1. **Subdomain:** `shop-a.lankacommerce.lk` → Tenant A
2. **Custom Domain:** `www.shop-a.com` → Tenant A
3. **Header-based:** `X-Tenant-ID` for API calls

### Dependencies
- **Requires:** SubPhase-04 (Tenant Model & Domain Model)
- **Domain model must be complete with verified domains**

---

## Task Execution Order

```
TASK GROUP A: Middleware Foundation (Tasks 01-14)
        │
        ▼
TASK GROUP B: Subdomain Resolution (Tasks 15-28)
        │
        ▼
TASK GROUP C: Custom Domain Resolution (Tasks 29-42)
        │
        ▼
TASK GROUP D: Header-Based Resolution (Tasks 43-54)
        │
        ▼
TASK GROUP E: Error Handling & Fallback (Tasks 55-68)
        │
        ▼
TASK GROUP F: Testing & Verification (Tasks 69-82)
```

---

## Task Index

### Group A: Middleware Foundation (Tasks 01-14)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 01 | **Review django-tenants Middleware** | Understand TenantMainMiddleware | SubPhase-04 | 🔴 Not Created |
| 02 | **Create Middleware Module** | Create apps/tenants/middleware.py | Task 01 | 🔴 Not Created |
| 03 | **Create Custom Tenant Middleware** | Extend TenantMainMiddleware | Task 02 | 🔴 Not Created |
| 04 | **Implement __init__ Method** | Initialize middleware | Task 03 | 🔴 Not Created |
| 05 | **Implement __call__ Method** | Process incoming requests | Task 03 | 🔴 Not Created |
| 06 | **Add Request Tenant Attribute** | Set request.tenant | Task 05 | 🔴 Not Created |
| 07 | **Add Request Schema Attribute** | Set request.schema_name | Task 05 | 🔴 Not Created |
| 08 | **Register in MIDDLEWARE** | Add to settings MIDDLEWARE list | Task 07 | 🔴 Not Created |
| 09 | **Set Middleware Order** | Position before other middleware | Task 08 | 🔴 Not Created |
| 10 | **Create Middleware Utils** | Helper functions for resolution | Task 02 | 🔴 Not Created |
| 11 | **Create Tenant Context Manager** | Context manager for schema switching | Task 10 | 🔴 Not Created |
| 12 | **Create get_current_tenant** | Thread-local tenant accessor | Task 11 | 🔴 Not Created |
| 13 | **Create set_current_tenant** | Thread-local tenant setter | Task 12 | 🔴 Not Created |
| 14 | **Document Middleware Flow** | Flowchart of resolution process | Task 13 | 🔴 Not Created |

---

### Group B: Subdomain Resolution (Tasks 15-28)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 15 | **Create Subdomain Resolver** | Extract subdomain from host | Task 10 | 🔴 Not Created |
| 16 | **Configure Base Domain Setting** | TENANT_BASE_DOMAIN setting | Task 15 | 🔴 Not Created |
| 17 | **Parse Request Host** | Extract subdomain from request | Task 16 | 🔴 Not Created |
| 18 | **Lookup Tenant by Subdomain** | Query Domain model | Task 17 | 🔴 Not Created |
| 19 | **Handle WWW Prefix** | Normalize www subdomain | Task 17 | 🔴 Not Created |
| 20 | **Handle localhost for Dev** | Support localhost subdomains | Task 17 | 🔴 Not Created |
| 21 | **Configure Development Domains** | Local development subdomain handling | Task 20 | 🔴 Not Created |
| 22 | **Handle Port Numbers** | Strip port from host | Task 17 | 🔴 Not Created |
| 23 | **Cache Domain Lookups** | Cache subdomain to tenant mapping | Task 18 | 🔴 Not Created |
| 24 | **Set Cache Expiry** | Configure cache timeout | Task 23 | 🔴 Not Created |
| 25 | **Invalidate Cache on Domain Change** | Clear cache when domains updated | Task 24 | 🔴 Not Created |
| 26 | **Create Subdomain Regex Pattern** | Valid subdomain validation | Task 15 | 🔴 Not Created |
| 27 | **Handle Reserved Subdomains** | Block api, admin, www, etc. | Task 26 | 🔴 Not Created |
| 28 | **Document Subdomain Resolution** | Documentation for subdomain setup | Task 27 | 🔴 Not Created |

---

### Group C: Custom Domain Resolution (Tasks 29-42)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 29 | **Create Custom Domain Resolver** | Handle full custom domains | Task 28 | 🔴 Not Created |
| 30 | **Lookup by Full Domain** | Query Domain model by domain field | Task 29 | 🔴 Not Created |
| 31 | **Handle Domain Verification** | Only resolve verified domains | Task 30 | 🔴 Not Created |
| 32 | **Create DNS Verification Logic** | CNAME/TXT record verification | Task 31 | 🔴 Not Created |
| 33 | **Generate Verification Token** | Create unique verification token | Task 32 | 🔴 Not Created |
| 34 | **Create Verification Endpoint** | API to check DNS records | Task 33 | 🔴 Not Created |
| 35 | **Store Verification Status** | Update is_verified field | Task 34 | 🔴 Not Created |
| 36 | **Handle SSL Certificate Status** | Check ssl_enabled flag | Task 35 | 🔴 Not Created |
| 37 | **Cache Custom Domain Lookups** | Cache domain to tenant mapping | Task 30 | 🔴 Not Created |
| 38 | **Handle Domain Not Found** | Return 404 for unregistered domains | Task 30 | 🔴 Not Created |
| 39 | **Handle Unverified Domain** | Return message for unverified | Task 38 | 🔴 Not Created |
| 40 | **Support Multiple Domains** | Handle multiple domains per tenant | Task 30 | 🔴 Not Created |
| 41 | **Primary Domain Redirect** | Redirect non-primary to primary | Task 40 | 🔴 Not Created |
| 42 | **Document Custom Domain Setup** | Guide for custom domain configuration | Task 41 | 🔴 Not Created |

---

### Group D: Header-Based Resolution (Tasks 43-54)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 43 | **Create Header Resolver** | Extract tenant from header | Task 42 | 🔴 Not Created |
| 44 | **Define Tenant Header Name** | X-Tenant-ID or X-Tenant-Slug | Task 43 | 🔴 Not Created |
| 45 | **Configure Header Setting** | TENANT_HEADER_NAME setting | Task 44 | 🔴 Not Created |
| 46 | **Extract Header from Request** | Get header value from request | Task 45 | 🔴 Not Created |
| 47 | **Lookup Tenant by ID** | Query Tenant by ID/slug | Task 46 | 🔴 Not Created |
| 48 | **Validate Tenant Exists** | Verify tenant is valid | Task 47 | 🔴 Not Created |
| 49 | **Handle API Authentication** | Combine with API auth | Task 48 | 🔴 Not Created |
| 50 | **Restrict Header Resolution** | Only for specific paths | Task 49 | 🔴 Not Created |
| 51 | **Configure Allowed Paths** | List of paths for header resolution | Task 50 | 🔴 Not Created |
| 52 | **Cache Header Lookups** | Cache header to tenant mapping | Task 47 | 🔴 Not Created |
| 53 | **Log Header-Based Access** | Audit header-based access | Task 52 | 🔴 Not Created |
| 54 | **Document Header-Based Resolution** | API tenant resolution docs | Task 53 | 🔴 Not Created |

---

### Group E: Error Handling & Fallback (Tasks 55-68)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 55 | **Create Tenant Not Found Handler** | Handle missing tenant | Task 54 | 🔴 Not Created |
| 56 | **Create 404 Response** | Tenant not found response | Task 55 | 🔴 Not Created |
| 57 | **Create Custom 404 Template** | Tenant not found page | Task 56 | 🔴 Not Created |
| 58 | **Configure Public Tenant Fallback** | Fallback to public schema | Task 55 | 🔴 Not Created |
| 59 | **Define Public Schema Paths** | Paths that use public schema | Task 58 | 🔴 Not Created |
| 60 | **Handle Suspended Tenant** | Block access to suspended tenants | Task 55 | 🔴 Not Created |
| 61 | **Create Suspended Response** | Suspended tenant message | Task 60 | 🔴 Not Created |
| 62 | **Create Suspended Template** | Suspended tenant page | Task 61 | 🔴 Not Created |
| 63 | **Handle Expired Subscription** | Block expired tenant access | Task 55 | 🔴 Not Created |
| 64 | **Create Expired Response** | Subscription expired message | Task 63 | 🔴 Not Created |
| 65 | **Create Expired Template** | Subscription expired page | Task 64 | 🔴 Not Created |
| 66 | **Log Resolution Errors** | Log failed tenant resolutions | Task 55 | 🔴 Not Created |
| 67 | **Create Error Metrics** | Track resolution failures | Task 66 | 🔴 Not Created |
| 68 | **Document Error Handling** | Error handling documentation | Task 67 | 🔴 Not Created |

---

### Group F: Testing & Verification (Tasks 69-82)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 69 | **Create Middleware Tests** | Unit tests for middleware | Task 68 | 🔴 Not Created |
| 70 | **Test Subdomain Resolution** | Test subdomain lookup | Task 69 | 🔴 Not Created |
| 71 | **Test Custom Domain Resolution** | Test custom domain lookup | Task 69 | 🔴 Not Created |
| 72 | **Test Header Resolution** | Test header-based lookup | Task 69 | 🔴 Not Created |
| 73 | **Test Public Fallback** | Test fallback behavior | Task 69 | 🔴 Not Created |
| 74 | **Test Suspended Tenant** | Test suspended handling | Task 69 | 🔴 Not Created |
| 75 | **Test Cache Behavior** | Test caching works | Task 69 | 🔴 Not Created |
| 76 | **Create Integration Tests** | End-to-end middleware tests | Task 75 | 🔴 Not Created |
| 77 | **Test Multi-Tenant Isolation** | Verify data isolation | Task 76 | 🔴 Not Created |
| 78 | **Create Test Fixtures** | Test tenants and domains | Task 77 | 🔴 Not Created |
| 79 | **Run Full Verification** | Complete test suite | Task 78 | 🔴 Not Created |
| 80 | **Performance Testing** | Test middleware performance | Task 79 | 🔴 Not Created |
| 81 | **Document Test Results** | Test documentation | Task 80 | 🔴 Not Created |
| 82 | **Create Initial Commit** | Commit middleware code | Task 81 | 🔴 Not Created |

---

## Expected Final Structure

```
backend/
├── apps/
│   └── tenants/
│       ├── middleware/
│       │   ├── __init__.py
│       │   ├── tenant_middleware.py
│       │   ├── subdomain_resolver.py
│       │   ├── domain_resolver.py
│       │   └── header_resolver.py
│       ├── utils/
│       │   ├── __init__.py
│       │   ├── tenant_context.py
│       │   └── dns_verification.py
│       └── templates/
│           └── tenants/
│               ├── 404_tenant_not_found.html
│               ├── suspended.html
│               └── expired.html
├── config/
│   └── settings/
│       └── base.py (MIDDLEWARE updated)
└── docs/
    └── middleware/
        ├── overview.md
        ├── subdomain-resolution.md
        ├── custom-domain-setup.md
        └── api-header-resolution.md
```

---

## Resolution Flow

```
Incoming Request
       │
       ▼
┌─────────────────────┐
│ Check X-Tenant-ID   │ ──(found)──► Resolve by Header
│ Header              │
└─────────────────────┘
       │ (not found)
       ▼
┌─────────────────────┐
│ Is Custom Domain?   │ ──(yes)──► Resolve by Custom Domain
│ (not *.base.domain) │
└─────────────────────┘
       │ (no)
       ▼
┌─────────────────────┐
│ Extract Subdomain   │ ──────────► Resolve by Subdomain
└─────────────────────┘
       │
       ▼
┌─────────────────────┐
│ Tenant Found?       │ ──(no)──► Return 404 / Fallback
└─────────────────────┘
       │ (yes)
       ▼
┌─────────────────────┐
│ Tenant Active?      │ ──(no)──► Return Suspended/Expired
└─────────────────────┘
       │ (yes)
       ▼
    Set Schema Context
       │
       ▼
    Continue Request
```

---

## Progress Tracking

| Metric | Count |
|--------|-------|
| Total Tasks | 82 |
| Tasks Completed | 0 |
| Tasks In Progress | 0 |
| Tasks Not Started | 82 |

**Last Updated:** 2026-01-17  
**Current Status:** Ready for task document creation

---

## Notes for AI Agents

1. **Execution Order:** Complete Group A before B, etc.
2. **Middleware Order Matters:** Must be first in MIDDLEWARE list
3. **Thread Safety:** Use thread-local for current tenant
4. **Caching Critical:** Cache domain lookups for performance
5. **Reserved Subdomains:** Block api, www, admin, mail, etc.
6. **DNS Verification:** CNAME pointing to platform domain
7. **Error Pages:** Custom templates for tenant errors
8. **Logging:** Log all resolution failures for debugging
9. **Development Mode:** Support localhost subdomains
