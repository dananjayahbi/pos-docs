# Group C: App Classification (SHARED vs TENANT)

> **Phase:** 02 - Database Architecture & Multi-Tenancy  
> **SubPhase:** 02 - Django-Tenants Installation  
> **Group:** C of F  
> **Tasks Covered:** 27-42  
> **Group Goal:** Define SHARED_APPS and TENANT_APPS for proper schema isolation

---

## Navigation

- **↑ Parent:** [../00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [../Group-B_Database-Settings-Configuration/](../Group-B_Database-Settings-Configuration/)
- **→ Next Group:** [../Group-D_Model-Configuration/](../Group-D_Model-Configuration/)

---

## Group Overview

This group defines the classification of Django apps into SHARED_APPS (public schema) and TENANT_APPS (per-tenant schemas). This classification determines where each app's database tables are created.

### Key Outcomes
- SHARED_APPS list defined
- django_tenants added to SHARED
- contenttypes added to SHARED
- auth added to SHARED (or TENANT based on design)
- sessions added to SHARED
- tenants app added to SHARED
- TENANT_APPS list defined
- contenttypes added to TENANT
- auth added to TENANT (users per tenant)
- INSTALLED_APPS combines both lists
- django_tenants ordered first
- apps/__init__.py created
- Core tenant apps listed
- App classification documented
- App registry created
- Configuration verified

### Technology Context
- **SHARED_APPS:** Tables in public schema only
- **TENANT_APPS:** Tables replicated per tenant schema
- **Order:** django_tenants MUST be first
- **Contenttypes:** Needs to be in both

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | 01_Tasks-27-32_Shared-Apps-Definition.md | 27-32 | Define SHARED_APPS, add django_tenants, contenttypes, auth, sessions, tenants |
| 02 | 02_Tasks-33-37_Tenant-Apps-Installed.md | 33-37 | Define TENANT_APPS, add contenttypes, auth, define INSTALLED_APPS, order django_tenants |
| 03 | 03_Tasks-38-42_Registry-Verification.md | 38-42 | Create apps/__init__.py, list core apps, document classification, registry, verify |

---

## Task Summary

| Task # | Task Name | Dependencies | Complexity |
|--------|-----------|--------------|------------|
| 27 | Define SHARED_APPS List | Task 11 | Medium |
| 28 | Add django_tenants to SHARED | Task 27 | Simple |
| 29 | Add contenttypes to SHARED | Task 27 | Simple |
| 30 | Add auth to SHARED | Task 27 | Simple |
| 31 | Add sessions to SHARED | Task 27 | Simple |
| 32 | Add tenants App to SHARED | Task 27 | Simple |
| 33 | Define TENANT_APPS List | Task 27 | Medium |
| 34 | Add contenttypes to TENANT | Task 33 | Simple |
| 35 | Add auth to TENANT | Task 33 | Simple |
| 36 | Define INSTALLED_APPS | Task 27, 33 | Medium |
| 37 | Order django_tenants First | Task 36 | Simple |
| 38 | Create apps/__init__.py | Task 27 | Simple |
| 39 | Create Core Tenant Apps | Task 33 | Simple |
| 40 | Document App Classification | Task 36 | Medium |
| 41 | Create App Registry | Task 39 | Medium |
| 42 | Verify App Configuration | Task 41 | Simple |

---

## Execution Order

```
01_Tasks-27-32_Shared-Apps-Definition.md
        │
        ▼
02_Tasks-33-37_Tenant-Apps-Installed.md
        │
        ▼
03_Tasks-38-42_Registry-Verification.md
```

---

## Expected Deliverables

After completing this group:

```
backend/
├── apps/
│   └── __init__.py          # Apps package init
└── config/
    └── settings/
        └── base.py          # SHARED_APPS, TENANT_APPS, INSTALLED_APPS

docs/
└── multi-tenancy/
    └── app-classification.md  # Shared vs Tenant documentation
```

---

## App Classification

| App | SHARED | TENANT | Reason |
|-----|--------|--------|--------|
| django_tenants | ✅ | ❌ | Core tenant management |
| contenttypes | ✅ | ✅ | Required in both |
| auth | ✅ | ✅ | Users can be shared or per-tenant |
| sessions | ✅ | ❌ | Sessions are global |
| tenants | ✅ | ❌ | Tenant/Domain models |
| admin | ✅ | ❌ | Admin is shared |
| inventory | ❌ | ✅ | Per-tenant data |
| sales | ❌ | ✅ | Per-tenant data |

---

## INSTALLED_APPS Pattern

```python
INSTALLED_APPS = list(SHARED_APPS) + [
    app for app in TENANT_APPS if app not in SHARED_APPS
]
```

---

## Notes for AI Agents

1. **Dependencies:** Requires Group B complete (database configured)
2. **Order:** django_tenants MUST be first in INSTALLED_APPS
3. **Contenttypes:** Must be in BOTH SHARED and TENANT
4. **Auth Decision:** Users per tenant or shared? (LCC: per tenant)
5. **Future Apps:** Add ERP modules to TENANT_APPS
6. **Git Commit:** Commit after completing this group

