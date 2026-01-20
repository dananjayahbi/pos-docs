# Group D: Domain Setup

> **Phase:** 02 - Database Architecture & Multi-Tenancy  
> **SubPhase:** 09 - Tenant Provisioning Flow  
> **Group:** D of F  
> **Tasks Covered:** 45-58  
> **Group Goal:** Set up subdomains and custom domains for new tenants

---

## Navigation

- **↑ Parent:** [../00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [../Group-C_Default-Data-Seeding/](../Group-C_Default-Data-Seeding/)
- **→ Next Group:** [../Group-E_User-Notification/](../Group-E_User-Notification/)

---

## Group Overview

This group handles domain setup for new tenants including automatic subdomain generation, validation, custom domain flow with DNS verification, and domain resolution testing.

### Key Outcomes
- Create DomainSetupService class
- Generate subdomain from tenant name
- Validate subdomain availability
- Check reserved subdomains (api, www, admin)
- Create primary subdomain
- Mark domain as primary
- Configure domain in cache
- Test domain resolution
- Custom domain setup flow
- Generate DNS verification token
- Provide CNAME instructions
- Monitor DNS propagation
- Verify custom domain
- Document domain setup

### Technology Context
- **Subdomains:** shop-name.lankacommerce.cloud
- **Custom:** custom.example.com
- **DNS:** CNAME verification
- **Cache:** Redis for resolution

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | 01_Tasks-45-50_Subdomain-Primary.md | 45-50 | Domain service, generate, validate, reserved, create, mark primary |
| 02 | 02_Tasks-51-55_Cache-Test-Custom.md | 51-55 | Cache config, test resolution, custom flow, verification token, CNAME |
| 03 | 03_Tasks-56-58_DNS-Verify-Docs.md | 56-58 | DNS propagation, verify custom, documentation |

---

## Task Summary

| Task # | Task Name | Dependencies | Complexity |
|--------|-----------|--------------|------------|
| 45 | Create Domain Service | Task 44 | Medium |
| 46 | Generate Subdomain | Task 45 | Medium |
| 47 | Validate Subdomain | Task 46 | Simple |
| 48 | Check Reserved Subdomains | Task 47 | Simple |
| 49 | Create Primary Domain | Task 48 | Medium |
| 50 | Mark Domain as Primary | Task 49 | Simple |
| 51 | Configure Domain in Cache | Task 50 | Medium |
| 52 | Test Domain Resolution | Task 51 | Medium |
| 53 | Custom Domain Flow | Task 52 | Medium |
| 54 | Generate Verification Token | Task 53 | Simple |
| 55 | Provide CNAME Instructions | Task 54 | Simple |
| 56 | Monitor DNS Propagation | Task 55 | Medium |
| 57 | Verify Custom Domain | Task 56 | Medium |
| 58 | Document Domain Setup | Task 57 | Simple |

---

## Execution Order

```
01_Tasks-45-50_Subdomain-Primary.md
        │
        ▼
02_Tasks-51-55_Cache-Test-Custom.md
        │
        ▼
03_Tasks-56-58_DNS-Verify-Docs.md
```

---

## Expected Deliverables

After completing this group:

```
backend/
└── apps/
    └── tenants/
        └── services/
            └── domain_setup.py

docs/
└── provisioning/
    └── domain-setup.md
```

---

## Reserved Subdomains

```python
RESERVED_SUBDOMAINS = [
    'api', 'www', 'admin', 'app', 'mail', 'smtp',
    'ftp', 'cdn', 'static', 'assets', 'media',
    'blog', 'help', 'support', 'docs', 'status',
    'auth', 'login', 'signup', 'register', 'billing',
    'dashboard', 'console', 'portal', 'panel',
]
```

---

## Subdomain Generation

```python
def generate_subdomain(business_name: str) -> str:
    """
    Generate a subdomain from business name.
    
    Example: "Acme Retail Shop" → "acme-retail-shop"
    If taken: "acme-retail-shop-1"
    """
    # Sanitize: lowercase, replace spaces with hyphens
    subdomain = re.sub(r'[^a-z0-9-]', '', business_name.lower().replace(' ', '-'))
    subdomain = subdomain[:50]  # Max length
    
    # Check availability, add suffix if needed
    return ensure_unique(subdomain)
```

---

## Custom Domain CNAME Instructions

```markdown
## Custom Domain Setup

To use your own domain (e.g., shop.yourdomain.com):

1. Log in to your DNS provider
2. Add a CNAME record:
   - Name: shop (or your subdomain)
   - Value: verify.lankacommerce.cloud
3. Add a TXT record for verification:
   - Name: _lcc-verify.shop
   - Value: lcc_verify_abc123xyz789
4. Wait for DNS propagation (up to 48 hours)
5. Click "Verify Domain" in your dashboard
```

---

## Notes for AI Agents

1. **Dependencies:** Requires Group C complete (data seeded)
2. **Reserved:** Block system subdomains
3. **Unique:** Ensure subdomain uniqueness
4. **Cache:** Add to Redis on creation
5. **Custom DNS:** Verify via TXT record
6. **Git Commit:** Commit after completing this group

