# Group A: Middleware Foundation

> **Phase:** 02 - Database Architecture & Multi-Tenancy  
> **SubPhase:** 06 - Tenant Middleware Configuration  
> **Group:** A of F  
> **Tasks Covered:** 01-14  
> **Group Goal:** Create the foundation tenant middleware and utilities

---

## Navigation

- **↑ Parent:** [../00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** None (First Group)
- **→ Next Group:** [../Group-B_Subdomain-Resolution/](../Group-B_Subdomain-Resolution/)

---

## Group Overview

This group creates the foundation for tenant middleware by extending django-tenants TenantMainMiddleware. It includes the core __call__ method, request attributes, middleware utilities, and context managers for schema switching.

### Key Outcomes
- Review django-tenants TenantMainMiddleware
- Create middleware module
- Create custom tenant middleware extending TenantMainMiddleware
- Implement __init__ method
- Implement __call__ method
- Add request.tenant attribute
- Add request.schema_name attribute
- Register in MIDDLEWARE settings
- Set correct middleware order
- Create middleware utility functions
- Create tenant context manager
- Create get_current_tenant accessor
- Create set_current_tenant setter
- Document middleware flow

### Technology Context
- **Base:** django-tenants TenantMainMiddleware
- **Thread-Local:** Store current tenant
- **Context Manager:** Schema switching
- **Utilities:** Helper functions

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | 01_Tasks-01-05_Middleware-Core.md | 01-05 | Review, create module, extend, __init__, __call__ |
| 02 | 02_Tasks-06-10_Attributes-Registration.md | 06-10 | Request attributes, register in MIDDLEWARE, order, utils |
| 03 | 03_Tasks-11-14_Context-Accessors-Docs.md | 11-14 | Context manager, get/set_current_tenant, documentation |

---

## Task Summary

| Task # | Task Name | Dependencies | Complexity |
|--------|-----------|--------------|------------|
| 01 | Review django-tenants Middleware | SubPhase-04 | Simple |
| 02 | Create Middleware Module | Task 01 | Simple |
| 03 | Create Custom Tenant Middleware | Task 02 | Medium |
| 04 | Implement __init__ Method | Task 03 | Simple |
| 05 | Implement __call__ Method | Task 03 | Medium |
| 06 | Add Request Tenant Attribute | Task 05 | Simple |
| 07 | Add Request Schema Attribute | Task 05 | Simple |
| 08 | Register in MIDDLEWARE | Task 07 | Simple |
| 09 | Set Middleware Order | Task 08 | Simple |
| 10 | Create Middleware Utils | Task 02 | Medium |
| 11 | Create Tenant Context Manager | Task 10 | Medium |
| 12 | Create get_current_tenant | Task 11 | Simple |
| 13 | Create set_current_tenant | Task 12 | Simple |
| 14 | Document Middleware Flow | Task 13 | Simple |

---

## Execution Order

```
01_Tasks-01-05_Middleware-Core.md
        │
        ▼
02_Tasks-06-10_Attributes-Registration.md
        │
        ▼
03_Tasks-11-14_Context-Accessors-Docs.md
```

---

## Expected Deliverables

After completing this group:

```
backend/
├── apps/
│   └── tenants/
│       ├── middleware/
│       │   ├── __init__.py
│       │   └── tenant_middleware.py
│       └── utils/
│           ├── __init__.py
│           └── tenant_context.py

config/
└── settings/
    └── base.py                  # MIDDLEWARE updated

docs/
└── middleware/
    └── overview.md
```

---

## Middleware Order

```python
MIDDLEWARE = [
    'django_tenants.middleware.main.TenantMainMiddleware',  # Or custom
    # OR
    'apps.tenants.middleware.CustomTenantMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    # ... rest of middleware
]
```

---

## Notes for AI Agents

1. **Dependencies:** Requires SubPhase-04 complete (Domain model)
2. **Order:** Tenant middleware MUST be first
3. **Thread-Local:** Use threading.local() for current tenant
4. **Context Manager:** For manual schema switching
5. **Attributes:** Set both request.tenant and request.schema_name
6. **Git Commit:** Commit after completing this group

