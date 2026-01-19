# Group C: Schema Configuration

> **Phase:** 02 - Database Architecture & Multi-Tenancy  
> **SubPhase:** 01 - PostgreSQL Configuration  
> **Group:** C of F  
> **Tasks Covered:** 27-38  
> **Group Goal:** Configure PostgreSQL schema management for multi-tenancy

---

## Navigation

- **↑ Parent:** [../00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [../Group-B_Database-Configuration/](../Group-B_Database-Configuration/)
- **→ Next Group:** [../Group-D_Connection-Pooling-PgBouncer/](../Group-D_Connection-Pooling-PgBouncer/)

---

## Group Overview

This group configures PostgreSQL schema management for multi-tenant isolation. The setup includes public schema configuration, search path, schema management functions, and proper privilege grants for tenant schemas.

### Key Outcomes
- Public schema verified and configured
- Search path configured for tenant isolation
- Schema permissions granted
- Schema template created
- Schema naming convention documented (tenant_<slug>)
- PL/pgSQL schema creation function
- PL/pgSQL schema drop function
- Schema existence check function
- Schema listing function
- User schema privileges configured
- Default privileges set
- Schema operations tested

### Technology Context
- **Multi-tenancy:** Schema-based isolation
- **Naming:** tenant_<slug> convention
- **Functions:** PL/pgSQL utilities
- **Privileges:** Row-level security ready

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | 01_Tasks-27-31_Public-Schema-Template.md | 27-31 | Create public schema, configure search path, grant permissions, create template, document naming |
| 02 | 02_Tasks-32-35_Schema-Functions.md | 32-35 | Create schema creation function, drop function, exists function, list function |
| 03 | 03_Tasks-36-38_Privileges-Testing.md | 36-38 | Grant user privileges, configure default privileges, test operations |

---

## Task Summary

| Task # | Task Name | Dependencies | Complexity |
|--------|-----------|--------------|------------|
| 27 | Create Public Schema | Task 26 | Simple |
| 28 | Configure Search Path | Task 27 | Medium |
| 29 | Grant Schema Permissions | Task 27 | Simple |
| 30 | Create Schema Template | Task 29 | Medium |
| 31 | Document Schema Naming | Task 30 | Simple |
| 32 | Create Schema Creation Function | Task 30 | Medium |
| 33 | Create Schema Drop Function | Task 32 | Medium |
| 34 | Create Schema Exists Function | Task 32 | Simple |
| 35 | Create Schema List Function | Task 32 | Simple |
| 36 | Grant User Schema Privileges | Task 29 | Medium |
| 37 | Configure Default Privileges | Task 36 | Medium |
| 38 | Test Schema Operations | Task 37 | Simple |

---

## Execution Order

```
01_Tasks-27-31_Public-Schema-Template.md
        │
        ▼
02_Tasks-32-35_Schema-Functions.md
        │
        ▼
03_Tasks-36-38_Privileges-Testing.md
```

---

## Expected Deliverables

After completing this group:

```
docker/
└── postgres/
    └── init/
        ├── 02-schema-functions.sql  # Schema management functions
        └── 03-privileges.sql        # Default privileges

docs/
└── database/
    └── schema-naming.md             # Naming convention documentation
```

---

## Schema Naming Convention

```
public             # Shared tables (tenants, domains, plans)
tenant_acme        # Tenant: ACME Corp
tenant_lanka_mart  # Tenant: Lanka Mart
tenant_colombo_pos # Tenant: Colombo POS
```

---

## Schema Management Functions

| Function | Purpose |
|----------|---------|
| create_tenant_schema(slug) | Create new tenant schema |
| drop_tenant_schema(slug) | Drop tenant schema safely |
| schema_exists(slug) | Check if schema exists |
| list_tenant_schemas() | List all tenant schemas |

---

## Notes for AI Agents

1. **Dependencies:** Requires Group B complete (PostgreSQL configured)
2. **Public Schema:** Shared tables only (tenants, domains)
3. **Tenant Schemas:** Isolated per tenant
4. **Search Path:** Set dynamically by middleware
5. **Functions:** Used by django-tenants provisioning
6. **Git Commit:** Commit after completing this group

