# Group C: Tenant & User Apps

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 01 - Django Apps Structure  
> **Group:** C of G  
> **Tasks Covered:** 23-36  
> **Group Goal:** Create tenants and users app structures

---

## Navigation

- **↑ Parent:** [../00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [../Group-B_Core-App-Creation/](../Group-B_Core-App-Creation/)
- **→ Next Group:** [../Group-D_Product-Inventory-Apps/](../Group-D_Product-Inventory-Apps/)

---

## Group Overview

This group creates the tenants and users apps. The tenants app manages multi-tenancy models (already defined in Phase-02). The users app handles custom user models and authentication.

### Key Outcomes
- Create tenants app directory
- Create tenants __init__.py
- Create TenantsConfig apps.py
- Create tenants models.py (reference to Phase-02)
- Create tenants admin.py
- Create tenants urls.py
- Register tenants in TENANT_APPS
- Create users app directory
- Create users __init__.py
- Create UsersConfig apps.py
- Create users models.py (custom user placeholder)
- Create users admin.py
- Create users urls.py
- Register users in TENANT_APPS

### Technology Context
- **Tenants:** Multi-tenancy core models
- **Users:** Custom AbstractUser model
- **AUTH_USER_MODEL:** Point to users.User

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | 01_Tasks-23-29_Tenants-App.md | 23-29 | Tenants directory, __init__, apps.py, models, admin, urls, register |
| 02 | 02_Tasks-30-36_Users-App.md | 30-36 | Users directory, __init__, apps.py, models, admin, urls, register |

---

## Task Summary

| Task # | Task Name | Dependencies | Complexity |
|--------|-----------|--------------|------------|
| 23 | Create tenants App Directory | Task 22 | Simple |
| 24 | Create tenants __init__.py | Task 23 | Simple |
| 25 | Create tenants apps.py | Task 24 | Simple |
| 26 | Create tenants models.py | Task 25 | Simple |
| 27 | Create tenants admin.py | Task 26 | Medium |
| 28 | Create tenants urls.py | Task 27 | Simple |
| 29 | Register tenants in Settings | Task 28 | Simple |
| 30 | Create users App Directory | Task 29 | Simple |
| 31 | Create users __init__.py | Task 30 | Simple |
| 32 | Create users apps.py | Task 31 | Simple |
| 33 | Create users models.py | Task 32 | Simple |
| 34 | Create users admin.py | Task 33 | Simple |
| 35 | Create users urls.py | Task 34 | Simple |
| 36 | Register users in Settings | Task 35 | Simple |

---

## Execution Order

```
01_Tasks-23-29_Tenants-App.md
        │
        ▼
02_Tasks-30-36_Users-App.md
```

---

## Expected Deliverables

After completing this group:

```
backend/apps/
├── tenants/
│   ├── __init__.py
│   ├── apps.py
│   ├── models.py
│   ├── admin.py
│   ├── urls.py
│   └── tests/
│       └── __init__.py
└── users/
    ├── __init__.py
    ├── apps.py
    ├── models.py
    ├── admin.py
    ├── urls.py
    └── tests/
        └── __init__.py
```

---

## App Classification

```python
# Tenants app: SHARED_APPS (public schema)
SHARED_APPS = [
    'django_tenants',
    'tenants',  # Tenant/Domain models
]

# Users app: TENANT_APPS (tenant schema)
TENANT_APPS = [
    'django.contrib.auth',
    'users',  # Per-tenant users
]
```

---

## Custom User Model

```python
# apps/users/models.py (placeholder)
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    """Custom user model for tenant users."""
    pass  # Will be extended in SubPhase-04

# config/settings/base.py
AUTH_USER_MODEL = 'users.User'
```

---

## Notes for AI Agents

1. **Dependencies:** Requires Group B complete
2. **Tenants:** Links to Phase-02 models
3. **Users:** Custom AbstractUser placeholder
4. **AUTH_USER_MODEL:** Must be set BEFORE migrations
5. **SHARED vs TENANT:** Tenants is shared, Users is per-tenant
6. **Git Commit:** Commit after completing this group

