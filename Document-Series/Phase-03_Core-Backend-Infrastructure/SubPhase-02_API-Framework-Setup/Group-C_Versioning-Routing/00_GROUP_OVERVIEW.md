# Group C: Versioning & Routing

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 02 - API Framework Setup  
> **Group:** C of F  
> **Tasks Covered:** 29-42  
> **Group Goal:** Configure API versioning and URL routing

---

## Navigation

- **↑ Parent:** [../00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [../Group-B_Core-Configuration/](../Group-B_Core-Configuration/)
- **→ Next Group:** [../Group-D_Authentication-Setup/](../Group-D_Authentication-Setup/)

---

## Group Overview

This group configures API versioning using URL path versioning (/api/v1/) and sets up the DRF routers for all application endpoints.

### Key Outcomes
- Configure URLPathVersioning
- Set default version to v1
- Define allowed versions (v1, v2)
- Create /api/ namespace
- Create /api/v1/ namespace
- Configure DefaultRouter
- Create core API router
- Wire up all app routes
- Create API root view
- Configure trailing slashes
- Document URL patterns
- Test and verify routing

### Technology Context
- **URL Path Versioning:** /api/v1/, /api/v2/
- **DefaultRouter:** DRF's automatic routing
- **Namespaces:** URL namespacing for apps
- **Trailing Slashes:** Consistent URL endings

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | 01_Tasks-29-34_Versioning-Namespaces.md | 29-34 | Versioning config, allowed versions, /api/, /v1/ namespaces |
| 02 | 02_Tasks-35-39_Routers-Root-View.md | 35-39 | DefaultRouter, core router, app routes, API root, trailing slashes |
| 03 | 03_Tasks-40-42_Docs-Test-Verify.md | 40-42 | URL documentation, test API root, document versioning |

---

## Task Summary

| Task # | Task Name | Dependencies | Complexity |
|--------|-----------|--------------|------------|
| 29 | Configure DEFAULT_VERSIONING_CLASS | Task 28 | Simple |
| 30 | Set DEFAULT_VERSION | Task 29 | Simple |
| 31 | Set ALLOWED_VERSIONS | Task 30 | Simple |
| 32 | Set VERSION_PARAM | Task 31 | Simple |
| 33 | Create api/ URL Namespace | Task 32 | Medium |
| 34 | Create v1/ URL Namespace | Task 33 | Medium |
| 35 | Configure DefaultRouter | Task 34 | Medium |
| 36 | Create Core API Router | Task 35 | Medium |
| 37 | Include App Routers | Task 36 | Medium |
| 38 | Create API Root View | Task 37 | Simple |
| 39 | Configure Trailing Slashes | Task 38 | Simple |
| 40 | Create URL Patterns Documentation | Task 39 | Medium |
| 41 | Test API Root Access | Task 40 | Simple |
| 42 | Document Versioning Strategy | Task 41 | Simple |

---

## Execution Order

```
01_Tasks-29-34_Versioning-Namespaces.md
        │
        ▼
02_Tasks-35-39_Routers-Root-View.md
        │
        ▼
03_Tasks-40-42_Docs-Test-Verify.md
```

---

## Expected Deliverables

After completing this group:

```
backend/
├── apps/core/api/
│   ├── __init__.py
│   ├── routers.py
│   └── views.py
├── config/
│   ├── urls.py
│   └── api_urls.py
└── docs/api/
    └── versioning.md
```

---

## Versioning Configuration

```python
# config/settings/drf.py
REST_FRAMEWORK = {
    # ...existing settings...
    
    # Versioning
    'DEFAULT_VERSIONING_CLASS': 'rest_framework.versioning.URLPathVersioning',
    'DEFAULT_VERSION': 'v1',
    'ALLOWED_VERSIONS': ['v1', 'v2'],
    'VERSION_PARAM': 'version',
}
```

---

## URL Structure

```python
# config/urls.py
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('config.api_urls')),
]

# config/api_urls.py
from django.urls import path, include

urlpatterns = [
    path('v1/', include([
        path('', include('core.api.urls')),
        path('products/', include('products.urls')),
        path('inventory/', include('inventory.urls')),
        path('sales/', include('sales.urls')),
        # ...other apps
    ], namespace='api-v1')),
]
```

---

## URL Pattern

```
/api/v1/products/
/api/v1/products/{id}/
/api/v1/inventory/stocks/
/api/v1/sales/orders/
```

---

## Notes for AI Agents

1. **Dependencies:** Requires Group B complete
2. **URL Path Versioning:** Preferred over header versioning
3. **v1 Default:** Start with v1, plan for v2
4. **Trailing Slashes:** Consistent enforcement
5. **Namespaces:** Use proper URL namespacing
6. **Git Commit:** Commit after completing this group

