# Group B: Core Configuration

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 02 - API Framework Setup  
> **Group:** B of F  
> **Tasks Covered:** 13-28  
> **Group Goal:** Configure DRF settings for the platform

---

## Navigation

- **↑ Parent:** [../00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [../Group-A_DRF-Installation/](../Group-A_DRF-Installation/)
- **→ Next Group:** [../Group-C_Versioning-Routing/](../Group-C_Versioning-Routing/)

---

## Group Overview

This group configures the core Django REST Framework settings including renderers, parsers, authentication classes, filters, schema class, exception handler, and date/time formats.

### Key Outcomes
- Create REST_FRAMEWORK settings dictionary
- Configure renderers (JSON only)
- Configure parsers (JSON, FormParser, MultiPart)
- Set authentication classes (JWT primary)
- Set permission classes (IsAuthenticated default)
- Configure filter backends
- Set search and ordering parameters
- Configure schema class for documentation
- Set date/time formats (ISO 8601)
- Configure decimal handling
- Create separate DRF settings module

### Technology Context
- **REST_FRAMEWORK:** Central DRF configuration
- **Renderers:** JSON renderer for production
- **Authentication:** JWT as primary method
- **Filters:** DjangoFilterBackend, SearchFilter, OrderingFilter

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | 01_Tasks-13-18_Settings-Dict-Filters.md | 13-18 | REST_FRAMEWORK dict, renderers, parsers, auth, permissions, filters |
| 02 | 02_Tasks-19-23_Search-Schema-Handler-Dates.md | 19-23 | Search, ordering, schema, exception handler, date format |
| 03 | 03_Tasks-24-28_Time-Decimal-Module-Docs.md | 24-28 | DateTime, time format, decimal handling, DRF module, documentation |

---

## Task Summary

| Task # | Task Name | Dependencies | Complexity |
|--------|-----------|--------------|------------|
| 13 | Create REST_FRAMEWORK Settings Dict | Task 12 | Medium |
| 14 | Configure DEFAULT_RENDERER_CLASSES | Task 13 | Simple |
| 15 | Configure DEFAULT_PARSER_CLASSES | Task 14 | Simple |
| 16 | Configure DEFAULT_AUTHENTICATION_CLASSES | Task 15 | Simple |
| 17 | Configure DEFAULT_PERMISSION_CLASSES | Task 16 | Simple |
| 18 | Configure DEFAULT_FILTER_BACKENDS | Task 17 | Simple |
| 19 | Configure SEARCH_PARAM | Task 18 | Simple |
| 20 | Configure ORDERING_PARAM | Task 19 | Simple |
| 21 | Configure DEFAULT_SCHEMA_CLASS | Task 20 | Simple |
| 22 | Configure EXCEPTION_HANDLER | Task 21 | Medium |
| 23 | Configure DATE_FORMAT | Task 22 | Simple |
| 24 | Configure DATETIME_FORMAT | Task 23 | Simple |
| 25 | Configure TIME_FORMAT | Task 24 | Simple |
| 26 | Configure COERCE_DECIMAL_TO_STRING | Task 25 | Simple |
| 27 | Create DRF Settings Module | Task 26 | Medium |
| 28 | Document DRF Configuration | Task 27 | Simple |

---

## Execution Order

```
01_Tasks-13-18_Settings-Dict-Filters.md
        │
        ▼
02_Tasks-19-23_Search-Schema-Handler-Dates.md
        │
        ▼
03_Tasks-24-28_Time-Decimal-Module-Docs.md
```

---

## Expected Deliverables

After completing this group:

```
backend/config/settings/
├── base.py           # Import DRF settings
├── drf.py            # DRF-specific settings
└── ...
```

---

## REST_FRAMEWORK Configuration

```python
# config/settings/drf.py
REST_FRAMEWORK = {
    # Renderers
    'DEFAULT_RENDERER_CLASSES': [
        'rest_framework.renderers.JSONRenderer',
    ],
    
    # Parsers
    'DEFAULT_PARSER_CLASSES': [
        'rest_framework.parsers.JSONParser',
        'rest_framework.parsers.FormParser',
        'rest_framework.parsers.MultiPartParser',
    ],
    
    # Authentication
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
    
    # Permissions
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
    
    # Filters
    'DEFAULT_FILTER_BACKENDS': [
        'django_filters.rest_framework.DjangoFilterBackend',
        'rest_framework.filters.SearchFilter',
        'rest_framework.filters.OrderingFilter',
    ],
    
    # Search & Ordering
    'SEARCH_PARAM': 'search',
    'ORDERING_PARAM': 'ordering',
    
    # Schema
    'DEFAULT_SCHEMA_CLASS': 'drf_spectacular.openapi.AutoSchema',
    
    # Exception Handling
    'EXCEPTION_HANDLER': 'core.exceptions.custom_exception_handler',
    
    # Date/Time Formats (ISO 8601)
    'DATE_FORMAT': '%Y-%m-%d',
    'DATETIME_FORMAT': '%Y-%m-%dT%H:%M:%S%z',
    'TIME_FORMAT': '%H:%M:%S',
    
    # Decimal Handling
    'COERCE_DECIMAL_TO_STRING': False,
}
```

---

## Notes for AI Agents

1. **Dependencies:** Requires Group A complete
2. **JSON Only:** Use JSONRenderer only in production
3. **ISO 8601:** Standard date/time format
4. **Exception Handler:** Custom handler in core app
5. **Separate File:** Keep DRF config in drf.py
6. **Git Commit:** Commit after completing this group

