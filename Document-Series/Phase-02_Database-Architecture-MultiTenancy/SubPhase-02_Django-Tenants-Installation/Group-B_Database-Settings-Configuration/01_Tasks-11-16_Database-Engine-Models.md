# Tasks 11-16: Database Engine & Models

> **Phase:** 02 - Database Architecture & Multi-Tenancy  
> **SubPhase:** 02 - Django-Tenants Installation  
> **Group:** B - Database Settings Configuration  
> **Document:** 01 of 03  
> **Tasks Covered:** 11, 12, 13, 14, 15, 16

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Group:** [../Group-A_Package-Installation/](../Group-A_Package-Installation/)
- **→ Next Document:** [02_Tasks-17-21_Domain-Schema-Settings.md](02_Tasks-17-21_Domain-Schema-Settings.md)

---

## Document Overview

This document configures the database backend and tenant model settings.

### Tasks in This Document

| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 11 | Configure database backend | Medium |
| 12 | Create database settings module | Medium |
| 13 | Configure tenant model | Medium |
| 14 | Configure domain model | Medium |
| 15 | Configure routers | Medium |
| 16 | Validate database settings | Medium |

---

## Task 11: Configure database backend

### Overview
Configure Django to use the django-tenants PostgreSQL backend.

### Dependencies
- Group A completed

### Instructions

1. **Set database engine**
   - Use `django_tenants.postgresql_backend`

2. **Document the change**
   - Note the engine change in settings documentation

### Expected Outcome
- Database engine configured for django-tenants

### Verification Checklist
- [ ] Database engine updated
- [ ] Documentation updated

---

## Task 12: Create database settings module

### Overview
Create a dedicated settings module for database configuration.

### Dependencies
- Task 11: Configure database backend

### Instructions

1. **Create `backend/config/settings/database.py`**
   - Centralize database configuration

2. **Wire into base settings**
   - Ensure base settings import database module

### Expected Outcome
- Database settings module created

### Verification Checklist
- [ ] Database settings module exists
- [ ] Base settings import module

---

## Task 13: Configure tenant model

### Overview
Set the tenant model setting required by django-tenants.

### Dependencies
- Task 12: Create database settings module

### Instructions

1. **Set TENANT_MODEL**
   - Point to the tenants app model

2. **Document model location**
   - Note model path in documentation

### Expected Outcome
- TENANT_MODEL configured

### Verification Checklist
- [ ] TENANT_MODEL set
- [ ] Model path documented

---

## Task 14: Configure domain model

### Overview
Set the domain model setting required by django-tenants.

### Dependencies
- Task 13: Configure tenant model

### Instructions

1. **Set TENANT_DOMAIN_MODEL**
   - Point to the domain model in tenants app

2. **Document model location**
   - Note domain model path

### Expected Outcome
- TENANT_DOMAIN_MODEL configured

### Verification Checklist
- [ ] TENANT_DOMAIN_MODEL set
- [ ] Model path documented

---

## Task 15: Configure routers

### Overview
Configure routers for tenant schema synchronization.

### Dependencies
- Task 14: Configure domain model

### Instructions

1. **Set database routers**
   - Use `TenantSyncRouter` as required

2. **Document router purpose**
   - Note routing purpose for shared vs tenant apps

### Expected Outcome
- Database routers configured

### Verification Checklist
- [ ] Router configured
- [ ] Purpose documented

---

## Task 16: Validate database settings

### Overview
Verify database settings load without errors.

### Dependencies
- Task 15: Configure routers

### Instructions

1. **Run settings validation**
   - Confirm settings load successfully

2. **Record verification**
   - Note results in documentation

### Expected Outcome
- Database settings validated

### Verification Checklist
- [ ] Settings load without errors
- [ ] Verification record documented

---

## Summary

### Tasks Completed in This Document

| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 11 | Configure database backend | Engine set to django-tenants backend |
| 12 | Create database settings module | `database.py` created |
| 13 | Configure tenant model | TENANT_MODEL set |
| 14 | Configure domain model | TENANT_DOMAIN_MODEL set |
| 15 | Configure routers | TenantSyncRouter configured |
| 16 | Validate database settings | Settings validated |

### Next Steps
- Continue with [02_Tasks-17-21_Domain-Schema-Settings.md](02_Tasks-17-21_Domain-Schema-Settings.md)

---

## Notes for AI Agents

1. **Execution Order:** Complete tasks 11 through 16 in sequence
2. **Backend:** Must use django-tenants PostgreSQL backend
3. **No Code Snippets:** Avoid fenced code blocks in documentation
