# Group G: Integration & Configuration

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 01 - Django Apps Structure  
> **Group:** G of G  
> **Tasks Covered:** 79-92  
> **Group Goal:** Create integrations app and finalize URL/settings configuration

---

## Navigation

- **↑ Parent:** [../00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [../Group-F_Supporting-Module-Apps/](../Group-F_Supporting-Module-Apps/)
- **→ Next SubPhase:** [../../SubPhase-02_API-Framework-Setup/](../../SubPhase-02_API-Framework-Setup/)

---

## Group Overview

This group creates the integrations app for external services and configures the main URL routing, SHARED_APPS, TENANT_APPS settings, creates initial migrations, and verifies the complete setup.

### Key Outcomes
- Create integrations app with structure
- Register integrations in TENANT_APPS
- Create main urls.py router
- Include all app URLs
- Create /api/v1/ namespace
- Update INSTALLED_APPS order
- Configure SHARED_APPS
- Configure TENANT_APPS
- Create initial migrations
- Verify app structure
- Create apps documentation
- Create initial commit
- Verify server starts

### Technology Context
- **Integrations:** External APIs (payment, SMS, etc.)
- **URL Router:** Django URL configuration
- **API Namespace:** /api/v1/ versioning
- **Settings:** SHARED_APPS vs TENANT_APPS

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | 01_Tasks-79-84_Integrations-URLs.md | 79-84 | Integrations app, main urls.py, include all, API router |
| 02 | 02_Tasks-85-89_Settings-Migrations-Verify.md | 85-89 | INSTALLED_APPS order, SHARED/TENANT_APPS, migrations, verify |
| 03 | 03_Tasks-90-92_Docs-Commit-Final.md | 90-92 | Documentation, commit, server verification |

---

## Task Summary

| Task # | Task Name | Dependencies | Complexity |
|--------|-----------|--------------|------------|
| 79 | Create integrations App | Task 78 | Simple |
| 80 | Create integrations Structure | Task 79 | Simple |
| 81 | Register integrations in Settings | Task 80 | Simple |
| 82 | Create Main urls.py Router | Task 81 | Medium |
| 83 | Include All App URLs | Task 82 | Medium |
| 84 | Create API Router | Task 83 | Simple |
| 85 | Update INSTALLED_APPS Order | Task 84 | Medium |
| 86 | Configure SHARED_APPS | Task 85 | Medium |
| 87 | Configure TENANT_APPS | Task 86 | Medium |
| 88 | Create Initial Migrations | Task 87 | Medium |
| 89 | Verify App Structure | Task 88 | Simple |
| 90 | Create Apps Documentation | Task 89 | Medium |
| 91 | Create Initial Commit | Task 90 | Simple |
| 92 | Verify Server Starts | Task 91 | Simple |

---

## Execution Order

```
01_Tasks-79-84_Integrations-URLs.md
        │
        ▼
02_Tasks-85-89_Settings-Migrations-Verify.md
        │
        ▼
03_Tasks-90-92_Docs-Commit-Final.md
```

---

## Expected Deliverables

After completing this group:

```
backend/
├── apps/
│   ├── __init__.py
│   ├── README.md
│   ├── integrations/
│   │   ├── __init__.py
│   │   ├── apps.py
│   │   ├── models.py
│   │   ├── admin.py
│   │   ├── urls.py
│   │   └── tests/
│   └── [all other apps]/
├── config/
│   ├── urls.py           # Main URL router
│   └── settings/
│       └── base.py       # Updated SHARED/TENANT_APPS
└── docs/
    └── apps/
        └── overview.md
```

---

## URL Configuration

```python
# config/urls.py
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # API v1 namespace
    path('api/v1/', include([
        path('tenants/', include('tenants.urls')),
        path('users/', include('users.urls')),
        path('products/', include('products.urls')),
        path('inventory/', include('inventory.urls')),
        path('sales/', include('sales.urls')),
        path('customers/', include('customers.urls')),
        path('vendors/', include('vendors.urls')),
        path('hr/', include('hr.urls')),
        path('accounting/', include('accounting.urls')),
        path('webstore/', include('webstore.urls')),
        path('reports/', include('reports.urls')),
        path('integrations/', include('integrations.urls')),
    ])),
]
```

---

## Apps Classification

```python
SHARED_APPS = [
    'django_tenants',
    'django.contrib.contenttypes',
    'tenants',
]

TENANT_APPS = [
    'django.contrib.auth',
    'django.contrib.sessions',
    'django.contrib.admin',
    'core',
    'users',
    'products',
    'inventory',
    'sales',
    'customers',
    'vendors',
    'hr',
    'accounting',
    'webstore',
    'integrations',
    'reports',
]

INSTALLED_APPS = list(SHARED_APPS) + [
    app for app in TENANT_APPS if app not in SHARED_APPS
]
```

---

## Notes for AI Agents

1. **Dependencies:** Requires Group F complete
2. **URL Order:** API versioning with /api/v1/
3. **SHARED vs TENANT:** Critical for multi-tenancy
4. **Migrations:** Run makemigrations for all apps
5. **Verify:** Server must start without errors
6. **Git Commit:** Final commit for SubPhase-01

