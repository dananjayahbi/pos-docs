# Group F: Pagination & Response

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 02 - API Framework Setup  
> **Group:** F of F  
> **Tasks Covered:** 73-88  
> **Group Goal:** Configure pagination and standardize API response format

---

## Navigation

- **↑ Parent:** [../00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [../Group-E_Throttling-CORS/](../Group-E_Throttling-CORS/)
- **→ Next SubPhase:** [../../SubPhase-03_Base-Models-Mixins/](../../SubPhase-03_Base-Models-Mixins/)

---

## Group Overview

This group configures API pagination with a custom pagination class, creates standard response formats for success and error responses, configures OpenAPI documentation with drf-spectacular, and verifies the complete API setup.

### Key Outcomes
- Configure default pagination class
- Create CustomPagination class
- Set page size (20) and max page size (100)
- Configure page_size query parameter
- Add pagination metadata (count, next, prev)
- Create standard response format
- Create success response wrapper
- Create error response wrapper
- Create response mixins
- Configure OpenAPI schema settings
- Set API title and description
- Create schema URL endpoint
- Create Swagger UI endpoint
- Verify complete API setup

### Technology Context
- **Pagination:** LimitOffsetPagination
- **Response Format:** Standardized JSON
- **OpenAPI:** drf-spectacular for docs
- **Swagger UI:** Interactive API docs

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | 01_Tasks-73-78_Pagination-Setup.md | 73-78 | Pagination class, page size, max size, metadata |
| 02 | 02_Tasks-79-82_Response-Format.md | 79-82 | Standard response, success wrapper, error wrapper, mixins |
| 03 | 03_Tasks-83-88_OpenAPI-Verify.md | 83-88 | OpenAPI config, schema URL, Swagger UI, verification |

---

## Task Summary

| Task # | Task Name | Dependencies | Complexity |
|--------|-----------|--------------|------------|
| 73 | Configure DEFAULT_PAGINATION_CLASS | Task 72 | Simple |
| 74 | Create CustomPagination Class | Task 73 | Medium |
| 75 | Set PAGE_SIZE | Task 74 | Simple |
| 76 | Set MAX_PAGE_SIZE | Task 75 | Simple |
| 77 | Configure PAGE_SIZE_QUERY_PARAM | Task 76 | Simple |
| 78 | Add Pagination Metadata | Task 77 | Medium |
| 79 | Create Standard Response Format | Task 78 | Medium |
| 80 | Create Success Response Wrapper | Task 79 | Medium |
| 81 | Create Error Response Wrapper | Task 80 | Medium |
| 82 | Create Response Mixins | Task 81 | Medium |
| 83 | Configure OpenAPI Schema | Task 82 | Medium |
| 84 | Set API Title | Task 83 | Simple |
| 85 | Set API Description | Task 84 | Simple |
| 86 | Create Schema URL | Task 85 | Simple |
| 87 | Create Swagger UI URL | Task 86 | Simple |
| 88 | Verify Full API Setup | Task 87 | Medium |

---

## Execution Order

```
01_Tasks-73-78_Pagination-Setup.md
        │
        ▼
02_Tasks-79-82_Response-Format.md
        │
        ▼
03_Tasks-83-88_OpenAPI-Verify.md
```

---

## Expected Deliverables

After completing this group:

```
backend/
├── apps/core/
│   ├── pagination.py       # Custom pagination
│   ├── response.py         # Response wrappers
│   └── mixins/
│       └── response.py     # Response mixins
├── config/
│   ├── settings/
│   │   └── spectacular.py  # OpenAPI settings
│   └── api_urls.py         # Schema & docs URLs
└── docs/api/
    └── pagination.md
```

---

## Custom Pagination Class

```python
# apps/core/pagination.py
from rest_framework.pagination import LimitOffsetPagination

class CustomPagination(LimitOffsetPagination):
    default_limit = 20
    max_limit = 100
    limit_query_param = 'limit'
    offset_query_param = 'offset'
    
    def get_paginated_response(self, data):
        return Response({
            'success': True,
            'data': data,
            'meta': {
                'count': self.count,
                'limit': self.limit,
                'offset': self.offset,
                'next': self.get_next_link(),
                'previous': self.get_previous_link(),
            }
        })
```

---

## Standard Response Format

```python
# apps/core/response.py

# SUCCESS RESPONSE
{
    "success": True,
    "data": {...},
    "meta": {
        "request_id": "xxx-xxx-xxx",
        "timestamp": "2026-01-17T12:00:00Z",
        "version": "v1"
    }
}

# ERROR RESPONSE
{
    "success": False,
    "error": {
        "code": "VALIDATION_ERROR",
        "message": "Invalid input data",
        "details": {
            "field_name": ["Error message"]
        }
    },
    "meta": {
        "request_id": "xxx-xxx-xxx",
        "timestamp": "2026-01-17T12:00:00Z"
    }
}
```

---

## OpenAPI Configuration

```python
# config/settings/spectacular.py
SPECTACULAR_SETTINGS = {
    'TITLE': 'LankaCommerce Cloud API',
    'DESCRIPTION': 'Multi-tenant ERP & E-commerce API for Sri Lankan businesses',
    'VERSION': '1.0.0',
    'SERVE_INCLUDE_SCHEMA': False,
    'COMPONENT_SPLIT_REQUEST': True,
    'SCHEMA_PATH_PREFIX': r'/api/v[0-9]',
}

# config/api_urls.py
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularSwaggerView,
)

urlpatterns = [
    # OpenAPI Schema & Documentation
    path('schema/', SpectacularAPIView.as_view(), name='schema'),
    path('docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
]
```

---

## Notes for AI Agents

1. **Dependencies:** Requires Group E complete
2. **Pagination:** 20 default, 100 max
3. **Response Format:** Consistent across all endpoints
4. **OpenAPI:** Use drf-spectacular
5. **Swagger UI:** At /api/docs/
6. **Final Group:** Verify everything works
7. **Git Commit:** Commit after completing SubPhase-02

