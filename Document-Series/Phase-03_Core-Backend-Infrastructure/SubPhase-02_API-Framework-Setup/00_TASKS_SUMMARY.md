# SubPhase 02: API Framework Setup - Tasks Summary

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase Index:** 02 of 12  
> **SubPhase Goal:** Configure the REST API framework with best practices  
> **Total Tasks:** 88 | **Status:** Planning  
> **Estimated Duration:** 6-7 hours

---

## Navigation

- **↑ Parent:** [00_SUBPHASES_SUMMARY.md](../00_SUBPHASES_SUMMARY.md)
- **← Previous SubPhase:** [SubPhase-01_Django-Apps-Structure](../SubPhase-01_Django-Apps-Structure/)
- **→ Next SubPhase:** [SubPhase-03_Base-Models-Mixins](../SubPhase-03_Base-Models-Mixins/)

---

## SubPhase Overview

This sub-phase configures Django REST Framework (DRF) as the API framework for the LankaCommerce Cloud platform. DRF is chosen over Django Ninja for its mature ecosystem, extensive documentation, and better integration with existing Django packages.

### Key Outcomes
- Django REST Framework installed and configured
- API versioning strategy implemented
- Authentication classes configured
- Throttling and rate limiting set up
- CORS properly configured
- Content negotiation defined
- Pagination standardized

### Framework Decision
- **Chosen:** Django REST Framework (DRF)
- **Reason:** Mature ecosystem, extensive third-party packages, better django-tenants integration

### Dependencies
- **Requires:** SubPhase-01 (Django Apps Structure)

---

## Task Execution Order

```
TASK GROUP A: DRF Installation (Tasks 01-12)
        │
        ▼
TASK GROUP B: Core Configuration (Tasks 13-28)
        │
        ▼
TASK GROUP C: Versioning & Routing (Tasks 29-42)
        │
        ▼
TASK GROUP D: Authentication Setup (Tasks 43-56)
        │
        ▼
TASK GROUP E: Throttling & CORS (Tasks 57-72)
        │
        ▼
TASK GROUP F: Pagination & Response (Tasks 73-88)
```

---

## Task Index

### Group A: DRF Installation (Tasks 01-12)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 01 | **Install djangorestframework** | pip install djangorestframework | SubPhase-01 | 🔴 Not Created |
| 02 | **Pin DRF Version** | Add to requirements.txt | Task 01 | 🔴 Not Created |
| 03 | **Install django-filter** | Filtering support | Task 02 | 🔴 Not Created |
| 04 | **Install djangorestframework-simplejwt** | JWT authentication | Task 02 | 🔴 Not Created |
| 05 | **Install drf-spectacular** | OpenAPI documentation | Task 02 | 🔴 Not Created |
| 06 | **Install django-cors-headers** | CORS support | Task 02 | 🔴 Not Created |
| 07 | **Add rest_framework to INSTALLED_APPS** | Register DRF | Task 01 | 🔴 Not Created |
| 08 | **Add django_filters to INSTALLED_APPS** | Register django-filter | Task 03 | 🔴 Not Created |
| 09 | **Add corsheaders to INSTALLED_APPS** | Register CORS | Task 06 | 🔴 Not Created |
| 10 | **Add drf_spectacular to INSTALLED_APPS** | Register docs | Task 05 | 🔴 Not Created |
| 11 | **Update requirements.txt** | All DRF dependencies | Task 10 | 🔴 Not Created |
| 12 | **Verify Installation** | Run server to verify | Task 11 | 🔴 Not Created |

---

### Group B: Core Configuration (Tasks 13-28)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 13 | **Create REST_FRAMEWORK Settings Dict** | Base DRF configuration | Task 12 | 🔴 Not Created |
| 14 | **Configure DEFAULT_RENDERER_CLASSES** | JSON renderer only | Task 13 | 🔴 Not Created |
| 15 | **Configure DEFAULT_PARSER_CLASSES** | JSON, FormParser, MultiPart | Task 14 | 🔴 Not Created |
| 16 | **Configure DEFAULT_AUTHENTICATION_CLASSES** | JWT as primary | Task 15 | 🔴 Not Created |
| 17 | **Configure DEFAULT_PERMISSION_CLASSES** | IsAuthenticated default | Task 16 | 🔴 Not Created |
| 18 | **Configure DEFAULT_FILTER_BACKENDS** | DjangoFilterBackend | Task 17 | 🔴 Not Created |
| 19 | **Configure SEARCH_PARAM** | Search query parameter | Task 18 | 🔴 Not Created |
| 20 | **Configure ORDERING_PARAM** | Ordering parameter | Task 19 | 🔴 Not Created |
| 21 | **Configure DEFAULT_SCHEMA_CLASS** | drf-spectacular schema | Task 20 | 🔴 Not Created |
| 22 | **Configure EXCEPTION_HANDLER** | Custom handler | Task 21 | 🔴 Not Created |
| 23 | **Configure DATE_FORMAT** | ISO 8601 format | Task 22 | 🔴 Not Created |
| 24 | **Configure DATETIME_FORMAT** | ISO 8601 with timezone | Task 23 | 🔴 Not Created |
| 25 | **Configure TIME_FORMAT** | Time format | Task 24 | 🔴 Not Created |
| 26 | **Configure COERCE_DECIMAL_TO_STRING** | Decimal handling | Task 25 | 🔴 Not Created |
| 27 | **Create DRF Settings Module** | Separate file for DRF config | Task 26 | 🔴 Not Created |
| 28 | **Document DRF Configuration** | Settings documentation | Task 27 | 🔴 Not Created |

---

### Group C: Versioning & Routing (Tasks 29-42)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 29 | **Configure DEFAULT_VERSIONING_CLASS** | URLPathVersioning | Task 28 | 🔴 Not Created |
| 30 | **Set DEFAULT_VERSION** | v1 as default | Task 29 | 🔴 Not Created |
| 31 | **Set ALLOWED_VERSIONS** | v1, v2 allowed | Task 30 | 🔴 Not Created |
| 32 | **Set VERSION_PARAM** | version parameter name | Task 31 | 🔴 Not Created |
| 33 | **Create api/ URL Namespace** | /api/ root URL | Task 32 | 🔴 Not Created |
| 34 | **Create v1/ URL Namespace** | /api/v1/ namespace | Task 33 | 🔴 Not Created |
| 35 | **Configure DefaultRouter** | DRF router setup | Task 34 | 🔴 Not Created |
| 36 | **Create Core API Router** | Router in core app | Task 35 | 🔴 Not Created |
| 37 | **Include App Routers** | Wire up all app routes | Task 36 | 🔴 Not Created |
| 38 | **Create API Root View** | API index endpoint | Task 37 | 🔴 Not Created |
| 39 | **Configure Trailing Slashes** | TRAILING_SLASH = True | Task 38 | 🔴 Not Created |
| 40 | **Create URL Patterns Documentation** | Route documentation | Task 39 | 🔴 Not Created |
| 41 | **Test API Root Access** | Verify /api/v1/ works | Task 40 | 🔴 Not Created |
| 42 | **Document Versioning Strategy** | Versioning documentation | Task 41 | 🔴 Not Created |

---

### Group D: Authentication Setup (Tasks 43-56)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 43 | **Configure SIMPLE_JWT Settings** | JWT configuration | Task 42 | 🔴 Not Created |
| 44 | **Set ACCESS_TOKEN_LIFETIME** | 15 minutes default | Task 43 | 🔴 Not Created |
| 45 | **Set REFRESH_TOKEN_LIFETIME** | 7 days default | Task 44 | 🔴 Not Created |
| 46 | **Set ROTATE_REFRESH_TOKENS** | Enable rotation | Task 45 | 🔴 Not Created |
| 47 | **Set BLACKLIST_AFTER_ROTATION** | Enable blacklisting | Task 46 | 🔴 Not Created |
| 48 | **Configure SIGNING_KEY** | Use Django secret key | Task 47 | 🔴 Not Created |
| 49 | **Set ALGORITHM** | HS256 algorithm | Task 48 | 🔴 Not Created |
| 50 | **Configure AUTH_HEADER_TYPES** | Bearer token | Task 49 | 🔴 Not Created |
| 51 | **Add Token Blacklist App** | rest_framework_simplejwt.token_blacklist | Task 50 | 🔴 Not Created |
| 52 | **Create Token URLs** | Token obtain/refresh endpoints | Task 51 | 🔴 Not Created |
| 53 | **Create Token Verify URL** | Token verification endpoint | Task 52 | 🔴 Not Created |
| 54 | **Create Logout URL** | Token blacklist endpoint | Task 53 | 🔴 Not Created |
| 55 | **Test Token Generation** | Verify JWT works | Task 54 | 🔴 Not Created |
| 56 | **Document Authentication** | Auth documentation | Task 55 | 🔴 Not Created |

---

### Group E: Throttling & CORS (Tasks 57-72)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 57 | **Configure DEFAULT_THROTTLE_CLASSES** | Throttle classes | Task 56 | 🔴 Not Created |
| 58 | **Create AnonRateThrottle Settings** | Anonymous user limits | Task 57 | 🔴 Not Created |
| 59 | **Create UserRateThrottle Settings** | Authenticated user limits | Task 58 | 🔴 Not Created |
| 60 | **Set DEFAULT_THROTTLE_RATES** | Rate definitions | Task 59 | 🔴 Not Created |
| 61 | **Set Anon Rate** | 100/hour for anon | Task 60 | 🔴 Not Created |
| 62 | **Set User Rate** | 1000/hour for users | Task 61 | 🔴 Not Created |
| 63 | **Create Burst Rate** | Short burst protection | Task 62 | 🔴 Not Created |
| 64 | **Configure CORS_ALLOWED_ORIGINS** | Allowed origins list | Task 63 | 🔴 Not Created |
| 65 | **Configure CORS_ALLOW_CREDENTIALS** | Credentials setting | Task 64 | 🔴 Not Created |
| 66 | **Configure CORS_ALLOW_METHODS** | Allowed HTTP methods | Task 65 | 🔴 Not Created |
| 67 | **Configure CORS_ALLOW_HEADERS** | Allowed headers | Task 66 | 🔴 Not Created |
| 68 | **Add CorsMiddleware** | Add to middleware stack | Task 67 | 🔴 Not Created |
| 69 | **Configure Dev CORS Settings** | Permissive for dev | Task 68 | 🔴 Not Created |
| 70 | **Configure Prod CORS Settings** | Strict for production | Task 69 | 🔴 Not Created |
| 71 | **Test CORS Headers** | Verify CORS works | Task 70 | 🔴 Not Created |
| 72 | **Document Throttling & CORS** | Security documentation | Task 71 | 🔴 Not Created |

---

### Group F: Pagination & Response (Tasks 73-88)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 73 | **Configure DEFAULT_PAGINATION_CLASS** | Custom pagination | Task 72 | 🔴 Not Created |
| 74 | **Create CustomPagination Class** | LimitOffsetPagination subclass | Task 73 | 🔴 Not Created |
| 75 | **Set PAGE_SIZE** | Default 20 items | Task 74 | 🔴 Not Created |
| 76 | **Set MAX_PAGE_SIZE** | Maximum 100 items | Task 75 | 🔴 Not Created |
| 77 | **Configure PAGE_SIZE_QUERY_PARAM** | page_size parameter | Task 76 | 🔴 Not Created |
| 78 | **Add Pagination Metadata** | Total count, next, previous | Task 77 | 🔴 Not Created |
| 79 | **Create Standard Response Format** | Consistent API response | Task 78 | 🔴 Not Created |
| 80 | **Create Success Response Wrapper** | Standard success format | Task 79 | 🔴 Not Created |
| 81 | **Create Error Response Wrapper** | Standard error format | Task 80 | 🔴 Not Created |
| 82 | **Create Response Mixins** | Reusable response helpers | Task 81 | 🔴 Not Created |
| 83 | **Configure OpenAPI Schema** | drf-spectacular settings | Task 82 | 🔴 Not Created |
| 84 | **Set API Title** | LankaCommerce Cloud API | Task 83 | 🔴 Not Created |
| 85 | **Set API Description** | API description text | Task 84 | 🔴 Not Created |
| 86 | **Create Schema URL** | /api/schema/ endpoint | Task 85 | 🔴 Not Created |
| 87 | **Create Swagger UI URL** | /api/docs/ endpoint | Task 86 | 🔴 Not Created |
| 88 | **Verify Full API Setup** | End-to-end verification | Task 87 | 🔴 Not Created |

---

## Expected Final Structure

```
backend/
├── apps/
│   └── core/
│       ├── pagination.py
│       ├── response.py
│       ├── renderers.py
│       └── api/
│           ├── __init__.py
│           ├── routers.py
│           └── views.py
├── config/
│   ├── settings/
│   │   ├── base.py
│   │   ├── drf.py (DRF settings)
│   │   ├── jwt.py (JWT settings)
│   │   └── cors.py (CORS settings)
│   └── urls.py
│       ├── /api/
│       │   └── /v1/
│       │       ├── /auth/token/
│       │       ├── /auth/token/refresh/
│       │       ├── /auth/token/verify/
│       │       └── /...app routes.../
│       ├── /api/schema/
│       └── /api/docs/
└── docs/
    └── api/
        ├── authentication.md
        ├── versioning.md
        ├── throttling.md
        └── pagination.md
```

---

## API Response Format

```
┌─────────────────────────────────────────────────────┐
│              STANDARD RESPONSE FORMAT               │
├─────────────────────────────────────────────────────┤
│                                                     │
│  SUCCESS RESPONSE:                                  │
│  ┌─────────────────────────────────────────────┐   │
│  │ {                                           │   │
│  │   "success": true,                          │   │
│  │   "data": {...},                            │   │
│  │   "meta": {                                 │   │
│  │     "request_id": "xxx-xxx",                │   │
│  │     "timestamp": "2026-01-17T..."           │   │
│  │   }                                         │   │
│  │ }                                           │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  ERROR RESPONSE:                                    │
│  ┌─────────────────────────────────────────────┐   │
│  │ {                                           │   │
│  │   "success": false,                         │   │
│  │   "error": {                                │   │
│  │     "code": "VALIDATION_ERROR",             │   │
│  │     "message": "...",                       │   │
│  │     "details": {...}                        │   │
│  │   },                                        │   │
│  │   "meta": {...}                             │   │
│  │ }                                           │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## Progress Tracking

| Metric | Count |
|--------|-------|
| Total Tasks | 88 |
| Tasks Completed | 0 |
| Tasks In Progress | 0 |
| Tasks Not Started | 88 |

**Last Updated:** 2026-01-17  
**Current Status:** Ready for task document creation

---

## Notes for AI Agents

1. **Execution Order:** Complete Group A before B, etc.
2. **DRF Preferred:** Use Django REST Framework, not Django Ninja
3. **JWT Authentication:** Use djangorestframework-simplejwt
4. **Versioning:** URL path versioning (/api/v1/)
5. **Settings Separation:** Keep DRF, JWT, CORS in separate files
6. **CORS Dev vs Prod:** Different configs for environments
7. **Throttling Essential:** Protect against abuse
8. **Standard Responses:** Consistent format across all endpoints
9. **Documentation:** Use drf-spectacular for OpenAPI docs
