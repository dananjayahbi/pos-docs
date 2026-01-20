# Group B: Subdomain Resolution

> **Phase:** 02 - Database Architecture & Multi-Tenancy  
> **SubPhase:** 06 - Tenant Middleware Configuration  
> **Group:** B of F  
> **Tasks Covered:** 15-28  
> **Group Goal:** Implement subdomain-based tenant resolution

---

## Navigation

- **↑ Parent:** [../00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [../Group-A_Middleware-Foundation/](../Group-A_Middleware-Foundation/)
- **→ Next Group:** [../Group-C_Custom-Domain-Resolution/](../Group-C_Custom-Domain-Resolution/)

---

## Group Overview

This group implements subdomain-based tenant resolution. When a request comes to `shop-a.lankacommerce.lk`, the middleware extracts `shop-a` and looks up the corresponding tenant.

### Key Outcomes
- Subdomain resolver created
- TENANT_BASE_DOMAIN setting configured
- Request host parsing implemented
- Tenant lookup by subdomain working
- WWW prefix handling
- Localhost development support
- Development domain configuration
- Port number stripping
- Domain lookup caching
- Cache expiry configuration
- Cache invalidation on domain change
- Subdomain regex validation
- Reserved subdomain blocking
- Subdomain resolution documentation

### Technology Context
- **Pattern:** shop-name.lankacommerce.lk
- **Base Domain:** TENANT_BASE_DOMAIN setting
- **Caching:** Redis for domain lookups
- **Reserved:** api, admin, www, app, etc.

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | 01_Tasks-15-20_Subdomain-Parsing.md | 15-20 | Resolver, base domain, host parsing, lookup, www, localhost |
| 02 | 02_Tasks-21-25_Caching-Dev-Support.md | 21-25 | Dev domains, port handling, caching, expiry, invalidation |
| 03 | 03_Tasks-26-28_Validation-Reserved.md | 26-28 | Subdomain regex, reserved blocking, documentation |

---

## Task Summary

| Task # | Task Name | Dependencies | Complexity |
|--------|-----------|--------------|------------|
| 15 | Create Subdomain Resolver | Task 10 | Medium |
| 16 | Configure Base Domain Setting | Task 15 | Simple |
| 17 | Parse Request Host | Task 16 | Simple |
| 18 | Lookup Tenant by Subdomain | Task 17 | Medium |
| 19 | Handle WWW Prefix | Task 17 | Simple |
| 20 | Handle localhost for Dev | Task 17 | Simple |
| 21 | Configure Development Domains | Task 20 | Simple |
| 22 | Handle Port Numbers | Task 17 | Simple |
| 23 | Cache Domain Lookups | Task 18 | Medium |
| 24 | Set Cache Expiry | Task 23 | Simple |
| 25 | Invalidate Cache on Domain Change | Task 24 | Medium |
| 26 | Create Subdomain Regex Pattern | Task 15 | Simple |
| 27 | Handle Reserved Subdomains | Task 26 | Medium |
| 28 | Document Subdomain Resolution | Task 27 | Simple |

---

## Execution Order

```
01_Tasks-15-20_Subdomain-Parsing.md
        │
        ▼
02_Tasks-21-25_Caching-Dev-Support.md
        │
        ▼
03_Tasks-26-28_Validation-Reserved.md
```

---

## Expected Deliverables

After completing this group:

```
backend/
└── apps/
    └── tenants/
        └── middleware/
            └── subdomain_resolver.py

config/
└── settings/
    └── base.py           # TENANT_BASE_DOMAIN added

docs/
└── middleware/
    └── subdomain-resolution.md
```

---

## Reserved Subdomains

| Subdomain | Purpose |
|-----------|---------|
| www | Main website |
| api | API gateway |
| admin | Platform admin |
| app | Web application |
| dashboard | Admin dashboard |
| support | Support portal |
| docs | Documentation |
| mail | Email services |

---

## Configuration Settings

```python
# Base domain for subdomain resolution
TENANT_BASE_DOMAIN = 'lankacommerce.lk'

# Development domains
TENANT_DEV_DOMAINS = ['localhost', '127.0.0.1']

# Reserved subdomains
TENANT_RESERVED_SUBDOMAINS = ['www', 'api', 'admin', 'app', 'dashboard']

# Cache timeout (seconds)
TENANT_DOMAIN_CACHE_TIMEOUT = 3600
```

---

## Notes for AI Agents

1. **Dependencies:** Requires Group A complete (middleware foundation)
2. **Subdomain:** Extract from host before base domain
3. **Localhost:** Support subdomain.localhost:port
4. **Caching:** Use Redis, invalidate on Domain save
5. **Reserved:** Return 404 or redirect for reserved
6. **Git Commit:** Commit after completing this group

