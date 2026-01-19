# Group B: Database Settings Configuration

> **Phase:** 02 - Database Architecture & Multi-Tenancy  
> **SubPhase:** 02 - Django-Tenants Installation  
> **Group:** B of F  
> **Tasks Covered:** 11-26  
> **Group Goal:** Configure Django database settings for multi-tenancy

---

## Navigation

- **↑ Parent:** [../00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [../Group-A_Package-Installation/](../Group-A_Package-Installation/)
- **→ Next Group:** [../Group-C_App-Classification-SHARED-TENANT/](../Group-C_App-Classification-SHARED-TENANT/)

---

## Group Overview

This group configures Django database settings for django-tenants. The configuration includes database engine, URL parsing, router setup, model references, and tenant behavior settings.

### Key Outcomes
- DATABASES setting updated
- DATABASE ENGINE set to django_tenants.postgresql_backend
- Database URL configured via django-environ
- DATABASE_ROUTERS configured with TenantSyncRouter
- DEFAULT_FILE_STORAGE configured (tenant-aware)
- TENANT_MODEL specified
- TENANT_DOMAIN_MODEL specified
- PUBLIC_SCHEMA_NAME set to 'public'
- TENANT_LIMIT_SET_CALLS optimized
- SHOW_PUBLIC_IF_NO_TENANT configured
- AUTO_DROP_SCHEMA set (False for safety)
- AUTO_CREATE_SCHEMA enabled
- TENANT_COLOR_ADMIN_APPS configured
- Separate database config module created
- Configuration tested
- Database settings documented

### Technology Context
- **Engine:** django_tenants.postgresql_backend
- **Router:** TenantSyncRouter
- **Models:** Tenant, Domain
- **Schema:** public (shared)

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | 01_Tasks-11-16_Database-Engine-Models.md | 11-16 | Update DATABASES, set ENGINE, configure URL, routers, file storage, TENANT_MODEL |
| 02 | 02_Tasks-17-21_Domain-Schema-Settings.md | 17-21 | Set TENANT_DOMAIN_MODEL, PUBLIC_SCHEMA_NAME, limit calls, show public, auto drop |
| 03 | 03_Tasks-22-26_Auto-Create-Admin-Docs.md | 22-26 | Auto create schema, admin apps, config module, test, document |

---

## Task Summary

| Task # | Task Name | Dependencies | Complexity |
|--------|-----------|--------------|------------|
| 11 | Update DATABASES Setting | Task 05 | Medium |
| 12 | Set DATABASE ENGINE | Task 11 | Simple |
| 13 | Configure Database URL | Task 11 | Simple |
| 14 | Set DATABASE_ROUTERS | Task 11 | Simple |
| 15 | Configure DEFAULT_FILE_STORAGE | Task 11 | Medium |
| 16 | Set TENANT_MODEL | Task 11 | Simple |
| 17 | Set TENANT_DOMAIN_MODEL | Task 11 | Simple |
| 18 | Configure PUBLIC_SCHEMA_NAME | Task 11 | Simple |
| 19 | Configure TENANT_LIMIT_SET_CALLS | Task 11 | Simple |
| 20 | Configure SHOW_PUBLIC_IF_NO_TENANT | Task 11 | Simple |
| 21 | Configure AUTO_DROP_SCHEMA | Task 11 | Simple |
| 22 | Configure AUTO_CREATE_SCHEMA | Task 11 | Simple |
| 23 | Configure TENANT_COLOR_ADMIN_APPS | Task 11 | Simple |
| 24 | Create Database Config Module | Task 11 | Medium |
| 25 | Test Database Configuration | Task 24 | Medium |
| 26 | Document Database Settings | Task 25 | Simple |

---

## Execution Order

```
01_Tasks-11-16_Database-Engine-Models.md
        │
        ▼
02_Tasks-17-21_Domain-Schema-Settings.md
        │
        ▼
03_Tasks-22-26_Auto-Create-Admin-Docs.md
```

---

## Expected Deliverables

After completing this group:

```
backend/
└── config/
    └── settings/
        ├── base.py          # Updated with tenant settings
        └── database.py      # Separate database config module

docs/
└── database/
    └── tenant-settings.md   # Settings documentation
```

---

## Key Settings

| Setting | Value | Purpose |
|---------|-------|---------|
| ENGINE | django_tenants.postgresql_backend | Tenant-aware backend |
| TENANT_MODEL | tenants.Tenant | Tenant model path |
| TENANT_DOMAIN_MODEL | tenants.Domain | Domain model path |
| PUBLIC_SCHEMA_NAME | public | Shared schema name |
| AUTO_CREATE_SCHEMA | True | Create on tenant creation |
| AUTO_DROP_SCHEMA | False | Safety: manual delete |

---

## Notes for AI Agents

1. **Dependencies:** Requires Group A complete (package installed)
2. **Engine:** MUST use django_tenants.postgresql_backend
3. **Router:** TenantSyncRouter handles schema routing
4. **Safety:** Set AUTO_DROP_SCHEMA to False
5. **Testing:** Verify connection works with new engine
6. **Git Commit:** Commit after completing this group

