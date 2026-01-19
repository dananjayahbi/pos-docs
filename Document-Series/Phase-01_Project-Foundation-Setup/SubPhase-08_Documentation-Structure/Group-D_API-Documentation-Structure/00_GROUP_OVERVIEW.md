# Group D: API Documentation Structure

> **Phase:** 01 - Project Foundation & Setup  
> **SubPhase:** 08 - Documentation Structure  
> **Group:** D of F  
> **Tasks Covered:** 41-52  
> **Group Goal:** Set up OpenAPI/Swagger documentation for the API

---

## Navigation

- **↑ Parent:** [../00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [../Group-C_Frontend-Documentation/](../Group-C_Frontend-Documentation/)
- **→ Next Group:** [../Group-E_Developer-Guides/](../Group-E_Developer-Guides/)

---

## Group Overview

This group sets up API documentation using drf-spectacular for OpenAPI schema generation. The configuration includes Swagger UI, ReDoc, and static Markdown documentation for API concepts.

### Key Outcomes
- drf-spectacular installed and configured
- OpenAPI schema endpoint (/api/schema/)
- Swagger UI (/api/docs/)
- ReDoc documentation (/api/redoc/)
- docs/api/ directory created
- API overview documentation
- Authentication documentation
- Error handling documentation
- Pagination documentation
- Rate limiting documentation
- Versioning documentation

### Technology Context
- **Schema:** OpenAPI 3.0
- **Generator:** drf-spectacular
- **UI:** Swagger UI, ReDoc
- **Framework:** Django REST Framework

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | 01_Tasks-41-45_DRF-Spectacular-Setup.md | 41-45 | Install drf-spectacular, configure settings, add URL routes, Swagger UI, ReDoc |
| 02 | 02_Tasks-46-52_API-Markdown-Docs.md | 46-52 | Create docs/api/, overview, authentication, errors, pagination, rate-limiting, versioning |

---

## Task Summary

| Task # | Task Name | Dependencies | Complexity |
|--------|-----------|--------------|------------|
| 41 | Install drf-spectacular | SubPhase-02 | Simple |
| 42 | Configure drf-spectacular | Task 41 | Medium |
| 43 | Add OpenAPI URL Routes | Task 42 | Simple |
| 44 | Configure Swagger UI | Task 43 | Simple |
| 45 | Configure ReDoc | Task 43 | Simple |
| 46 | Create docs/api/ | Task 01 | Simple |
| 47 | Create API Overview | Task 46 | Medium |
| 48 | Create Authentication Docs | Task 46 | Medium |
| 49 | Create Error Handling Docs | Task 46 | Medium |
| 50 | Create Pagination Docs | Task 46 | Medium |
| 51 | Create Rate Limiting Docs | Task 46 | Medium |
| 52 | Create Versioning Docs | Task 46 | Medium |

---

## Execution Order

```
01_Tasks-41-45_DRF-Spectacular-Setup.md
        │
        ▼
02_Tasks-46-52_API-Markdown-Docs.md
```

---

## Expected Deliverables

After completing this group:

```
backend/
└── config/
    └── urls.py              # Updated with API doc routes

docs/
└── api/
    ├── overview.md          # API overview
    ├── authentication.md    # Auth documentation
    ├── errors.md            # Error responses
    ├── pagination.md        # Pagination guide
    ├── rate-limiting.md     # Rate limit docs
    └── versioning.md        # API versioning
```

---

## API Documentation Endpoints

| Endpoint | Description |
|----------|-------------|
| `/api/schema/` | OpenAPI 3.0 JSON/YAML schema |
| `/api/docs/` | Swagger UI interactive docs |
| `/api/redoc/` | ReDoc documentation |

---

## drf-spectacular Configuration

```python
# settings/base.py
SPECTACULAR_SETTINGS = {
    'TITLE': 'LankaCommerce Cloud API',
    'DESCRIPTION': 'Multi-tenant ERP & E-commerce API',
    'VERSION': '1.0.0',
    'SERVE_INCLUDE_SCHEMA': False,
}
```

---

## Notes for AI Agents

1. **Dependencies:** Requires SubPhase-02 complete (DRF configured)
2. **drf-spectacular:** Replaces deprecated drf-yasg
3. **Schema:** Auto-generated from views and serializers
4. **Swagger UI:** Interactive API testing
5. **ReDoc:** Clean documentation format
6. **Git Commit:** Commit after completing this group

