# Group C: Custom Domain Resolution

> **Phase:** 02 - Database Architecture & Multi-Tenancy  
> **SubPhase:** 06 - Tenant Middleware Configuration  
> **Group:** C of F  
> **Tasks Covered:** 29-42  
> **Group Goal:** Implement custom domain tenant resolution with DNS verification

---

## Navigation

- **↑ Parent:** [../00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [../Group-B_Subdomain-Resolution/](../Group-B_Subdomain-Resolution/)
- **→ Next Group:** [../Group-D_Header-Based-Resolution/](../Group-D_Header-Based-Resolution/)

---

## Group Overview

This group implements custom domain resolution for tenants who bring their own domains (e.g., www.shop-a.com). It includes DNS verification, SSL status tracking, and domain caching.

### Key Outcomes
- Custom domain resolver created
- Full domain lookup implemented
- Domain verification enforcement
- DNS verification logic (CNAME/TXT)
- Verification token generation
- Verification API endpoint
- Verification status storage
- SSL certificate status handling
- Custom domain caching
- Domain not found handling
- Unverified domain handling
- Multiple domains per tenant support
- Primary domain redirect
- Custom domain setup documentation

### Technology Context
- **Verification:** DNS TXT record
- **SSL:** Let's Encrypt integration tracking
- **Multiple Domains:** Per tenant support
- **Primary:** Redirect to primary domain

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | 01_Tasks-29-35_Domain-Lookup-Verification.md | 29-35 | Resolver, lookup, verification, DNS logic, token, API, status |
| 02 | 02_Tasks-36-42_SSL-Caching-Multiple.md | 36-42 | SSL status, caching, not found, unverified, multiple domains, redirect, docs |

---

## Task Summary

| Task # | Task Name | Dependencies | Complexity |
|--------|-----------|--------------|------------|
| 29 | Create Custom Domain Resolver | Task 28 | Medium |
| 30 | Lookup by Full Domain | Task 29 | Simple |
| 31 | Handle Domain Verification | Task 30 | Medium |
| 32 | Create DNS Verification Logic | Task 31 | Complex |
| 33 | Generate Verification Token | Task 32 | Simple |
| 34 | Create Verification Endpoint | Task 33 | Medium |
| 35 | Store Verification Status | Task 34 | Simple |
| 36 | Handle SSL Certificate Status | Task 35 | Simple |
| 37 | Cache Custom Domain Lookups | Task 30 | Medium |
| 38 | Handle Domain Not Found | Task 30 | Simple |
| 39 | Handle Unverified Domain | Task 38 | Simple |
| 40 | Support Multiple Domains | Task 30 | Medium |
| 41 | Primary Domain Redirect | Task 40 | Medium |
| 42 | Document Custom Domain Setup | Task 41 | Simple |

---

## Execution Order

```
01_Tasks-29-35_Domain-Lookup-Verification.md
        │
        ▼
02_Tasks-36-42_SSL-Caching-Multiple.md
```

---

## Expected Deliverables

After completing this group:

```
backend/
└── apps/
    └── tenants/
        ├── middleware/
        │   └── domain_resolver.py
        ├── utils/
        │   └── dns_verification.py
        └── api/
            └── views/
                └── domain_verification.py

docs/
└── middleware/
    └── custom-domain-setup.md
```

---

## DNS Verification Flow

```
1. Tenant adds custom domain in settings
2. System generates verification token
3. Tenant adds DNS TXT record:
   _lcc-verify.shop.example.com TXT "verification-token-xyz"
4. Tenant triggers verification
5. System checks DNS for TXT record
6. If found and matches:
   - Set is_verified = True
   - Set verified_at = now()
   - Trigger SSL certificate request
```

---

## Domain States

| State | Description |
|-------|-------------|
| PENDING | Added but not verified |
| VERIFIED | DNS verified |
| SSL_PENDING | Awaiting SSL certificate |
| ACTIVE | Fully active with SSL |
| FAILED | Verification failed |

---

## Notes for AI Agents

1. **Dependencies:** Requires Group B complete (subdomain works)
2. **DNS Check:** Use dnspython library
3. **Token:** UUID4 for verification token
4. **SSL:** Track Let's Encrypt cert status
5. **Primary:** One primary domain per tenant
6. **Git Commit:** Commit after completing this group

