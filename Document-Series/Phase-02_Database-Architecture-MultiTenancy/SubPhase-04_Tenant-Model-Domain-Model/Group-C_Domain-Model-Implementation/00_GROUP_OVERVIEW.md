# Group C: Domain Model Implementation

> **Phase:** 02 - Database Architecture & Multi-Tenancy  
> **SubPhase:** 04 - Tenant Model & Domain Model  
> **Group:** C of F  
> **Tasks Covered:** 31-46  
> **Group Goal:** Create the Domain model for subdomain/custom domain mapping

---

## Navigation

- **↑ Parent:** [../00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [../Group-B_Tenant-Business-Information/](../Group-B_Tenant-Business-Information/)
- **→ Next Group:** [../Group-D_Tenant-Settings-Model/](../Group-D_Tenant-Settings-Model/)

---

## Group Overview

This group creates the Domain model by extending django-tenants DomainMixin. The model supports multiple domains per tenant, custom domain verification, SSL tracking, and domain type differentiation.

### Key Outcomes
- Domain model extending DomainMixin created
- Tenant foreign key relationship
- Domain name field configured
- Is primary field (one primary per tenant)
- Is verified field for custom domains
- Verification token for DNS verification
- Verified at timestamp
- Domain type field (subdomain vs custom)
- SSL enabled tracking
- SSL expiry tracking
- Created at timestamp
- Meta class with unique constraints
- Custom DomainManager created
- Verified/custom domain querysets

### Technology Context
- **Base:** django-tenants DomainMixin
- **Types:** Subdomain (*.lankacommerce.cloud) or custom domain
- **Verification:** DNS TXT record verification
- **SSL:** Let's Encrypt integration tracking

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | 01_Tasks-31-36_Domain-Model-Core.md | 31-36 | Extend DomainMixin, tenant FK, domain name, primary, verified, token |
| 02 | 02_Tasks-37-42_Domain-Type-SSL-Meta.md | 37-42 | Verified at, domain type, SSL fields, created at, meta class |
| 03 | 03_Tasks-43-46_Manager-Querysets.md | 43-46 | __str__, DomainManager, verified/custom querysets |

---

## Task Summary

| Task # | Task Name | Dependencies | Complexity |
|--------|-----------|--------------|------------|
| 31 | Extend DomainMixin | Task 16 | Medium |
| 32 | Add Tenant FK | Task 31 | Simple |
| 33 | Add Domain Name Field | Task 31 | Simple |
| 34 | Add Is Primary Field | Task 31 | Simple |
| 35 | Add Is Verified Field | Task 31 | Simple |
| 36 | Add Verification Token | Task 35 | Simple |
| 37 | Add Verified At Field | Task 35 | Simple |
| 38 | Add Domain Type Field | Task 31 | Simple |
| 39 | Add SSL Enabled Field | Task 31 | Simple |
| 40 | Add SSL Expires At | Task 39 | Simple |
| 41 | Add Created At Field | Task 31 | Simple |
| 42 | Define Meta Class | Task 31 | Simple |
| 43 | Define __str__ Method | Task 42 | Simple |
| 44 | Create Domain Manager | Task 31 | Medium |
| 45 | Add Verified Queryset | Task 44 | Simple |
| 46 | Add Custom Domain Queryset | Task 44 | Simple |

---

## Execution Order

```
01_Tasks-31-36_Domain-Model-Core.md
        │
        ▼
02_Tasks-37-42_Domain-Type-SSL-Meta.md
        │
        ▼
03_Tasks-43-46_Manager-Querysets.md
```

---

## Expected Deliverables

After completing this group:

```
backend/
└── apps/
    └── tenants/
        └── models/
            ├── domain.py              # Domain model
            └── managers/
                └── domain_manager.py  # DomainManager
```

---

## Domain Types

| Type | Example | Verification |
|------|---------|--------------|
| SUBDOMAIN | shop1.lankacommerce.cloud | Auto-verified |
| CUSTOM | shop.example.com | DNS verification required |

---

## DNS Verification Process

```
1. Generate verification token
2. User adds TXT record: _lcc-verify.shop.example.com → token
3. System checks DNS for TXT record
4. Mark is_verified = True, set verified_at
5. Issue SSL certificate via Let's Encrypt
```

---

## Notes for AI Agents

1. **Dependencies:** Requires Group B complete (Tenant has all fields)
2. **DomainMixin:** Must extend, provides domain lookup
3. **One Primary:** Ensure only one primary domain per tenant
4. **Verification:** Required only for custom domains
5. **SSL:** Track certificate status and expiry
6. **Git Commit:** Commit after completing this group

