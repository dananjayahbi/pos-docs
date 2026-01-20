# Group D: Header-Based Resolution

> **Phase:** 02 - Database Architecture & Multi-Tenancy  
> **SubPhase:** 06 - Tenant Middleware Configuration  
> **Group:** D of F  
> **Tasks Covered:** 43-54  
> **Group Goal:** Implement header-based tenant resolution for API calls

---

## Navigation

- **↑ Parent:** [../00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [../Group-C_Custom-Domain-Resolution/](../Group-C_Custom-Domain-Resolution/)
- **→ Next Group:** [../Group-E_Error-Handling-Fallback/](../Group-E_Error-Handling-Fallback/)

---

## Group Overview

This group implements header-based tenant resolution for API requests. Mobile apps and third-party integrations can specify the tenant using an X-Tenant-ID header instead of relying on domain resolution.

### Key Outcomes
- Header resolver created
- X-Tenant-ID header defined
- TENANT_HEADER_NAME setting configured
- Header extraction from request
- Tenant lookup by ID/slug
- Tenant existence validation
- API authentication integration
- Path restriction for header resolution
- Allowed paths configuration
- Header lookup caching
- Header-based access logging
- Header resolution documentation

### Technology Context
- **Header:** X-Tenant-ID or X-Tenant-Slug
- **Use Case:** Mobile apps, API integrations
- **Restriction:** Only for /api/ paths
- **Security:** Combine with API auth

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | 01_Tasks-43-48_Header-Extraction-Lookup.md | 43-48 | Resolver, header name, setting, extraction, lookup, validation |
| 02 | 02_Tasks-49-54_Auth-Paths-Caching-Docs.md | 49-54 | API auth, path restriction, allowed paths, caching, logging, docs |

---

## Task Summary

| Task # | Task Name | Dependencies | Complexity |
|--------|-----------|--------------|------------|
| 43 | Create Header Resolver | Task 42 | Medium |
| 44 | Define Tenant Header Name | Task 43 | Simple |
| 45 | Configure Header Setting | Task 44 | Simple |
| 46 | Extract Header from Request | Task 45 | Simple |
| 47 | Lookup Tenant by ID | Task 46 | Simple |
| 48 | Validate Tenant Exists | Task 47 | Simple |
| 49 | Handle API Authentication | Task 48 | Medium |
| 50 | Restrict Header Resolution | Task 49 | Medium |
| 51 | Configure Allowed Paths | Task 50 | Simple |
| 52 | Cache Header Lookups | Task 47 | Medium |
| 53 | Log Header-Based Access | Task 52 | Simple |
| 54 | Document Header-Based Resolution | Task 53 | Simple |

---

## Execution Order

```
01_Tasks-43-48_Header-Extraction-Lookup.md
        │
        ▼
02_Tasks-49-54_Auth-Paths-Caching-Docs.md
```

---

## Expected Deliverables

After completing this group:

```
backend/
└── apps/
    └── tenants/
        └── middleware/
            └── header_resolver.py

config/
└── settings/
    └── base.py           # TENANT_HEADER_NAME added

docs/
└── middleware/
    └── api-header-resolution.md
```

---

## Header Configuration

```python
# Header name for tenant resolution
TENANT_HEADER_NAME = 'X-Tenant-ID'

# Alternative header (slug-based)
TENANT_SLUG_HEADER = 'X-Tenant-Slug'

# Paths where header resolution is allowed
TENANT_HEADER_PATHS = [
    '/api/',
    '/mobile/',
    '/webhook/',
]
```

---

## API Request Example

```http
GET /api/v1/products/ HTTP/1.1
Host: api.lankacommerce.lk
Authorization: Bearer eyJ...
X-Tenant-ID: shop-a-slug
```

---

## Notes for AI Agents

1. **Dependencies:** Requires Group C complete (custom domain works)
2. **Security:** Header alone is NOT authentication
3. **Path Restriction:** Only allow for specific paths
4. **Combine Auth:** Verify user belongs to tenant
5. **Logging:** Audit all header-based access
6. **Git Commit:** Commit after completing this group

