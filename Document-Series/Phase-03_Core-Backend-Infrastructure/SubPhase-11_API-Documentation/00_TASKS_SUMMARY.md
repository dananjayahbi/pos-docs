# SubPhase 11: API Documentation - Tasks Summary

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase Index:** 11 of 12  
> **SubPhase Goal:** Set up comprehensive API documentation  
> **Total Tasks:** 82 | **Status:** Planning  
> **Estimated Duration:** 5-6 hours

---

## Navigation

- **↑ Parent:** [00_SUBPHASES_SUMMARY.md](../00_SUBPHASES_SUMMARY.md)
- **← Previous SubPhase:** [SubPhase-10_File-Storage-Configuration](../SubPhase-10_File-Storage-Configuration/)
- **→ Next SubPhase:** [SubPhase-12_Core-Utilities-Helpers](../SubPhase-12_Core-Utilities-Helpers/)

---

## SubPhase Overview

This sub-phase sets up the API documentation system using drf-spectacular for the LankaCommerce Cloud platform. Includes Swagger UI and ReDoc endpoints with full schema generation.

### Key Outcomes
- drf-spectacular configured
- OpenAPI 3.0 schema generation
- Swagger UI endpoint available
- ReDoc endpoint available
- All endpoints documented
- Authentication flows documented
- Multi-tenant context documented

### Documentation Endpoints
```
/api/schema/           → OpenAPI JSON schema
/api/docs/             → Swagger UI interface
/api/redoc/            → ReDoc interface
/api/schema/download/  → Schema download
```

### Dependencies
- **Requires:** SubPhase-02 (API Framework Setup)

---

## Task Execution Order

```
TASK GROUP A: drf-spectacular Setup (Tasks 01-14)
        │
        ▼
TASK GROUP B: Schema Configuration (Tasks 15-28)
        │
        ▼
TASK GROUP C: Swagger UI Setup (Tasks 29-42)
        │
        ▼
TASK GROUP D: ReDoc Setup (Tasks 43-54)
        │
        ▼
TASK GROUP E: Documentation Enhancements (Tasks 55-70)
        │
        ▼
TASK GROUP F: Testing & Validation (Tasks 71-82)
```

---

## Task Index

### Group A: drf-spectacular Setup (Tasks 01-14)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 01 | **Install drf-spectacular** | pip install drf-spectacular | SubPhase-02 | 🔴 Not Created |
| 02 | **Pin drf-spectacular Version** | Add to requirements.txt | Task 01 | 🔴 Not Created |
| 03 | **Add to INSTALLED_APPS** | drf_spectacular | Task 02 | 🔴 Not Created |
| 04 | **Create api_docs Module** | apps/core/api_docs/ | Task 03 | 🔴 Not Created |
| 05 | **Create api_docs __init__.py** | Export utilities | Task 04 | 🔴 Not Created |
| 06 | **Create Settings File** | settings/api_docs.py | Task 05 | 🔴 Not Created |
| 07 | **Configure DEFAULT_SCHEMA_CLASS** | DRF setting | Task 06 | 🔴 Not Created |
| 08 | **Import API Docs Settings** | In base.py | Task 07 | 🔴 Not Created |
| 09 | **Create Schema URLs File** | api_docs/urls.py | Task 08 | 🔴 Not Created |
| 10 | **Add Schema URL Pattern** | /api/schema/ | Task 09 | 🔴 Not Created |
| 11 | **Include in Main URLs** | urlpatterns | Task 10 | 🔴 Not Created |
| 12 | **Test Schema Generation** | Verify output | Task 11 | 🔴 Not Created |
| 13 | **Verify OpenAPI 3.0 Format** | Schema format | Task 12 | 🔴 Not Created |
| 14 | **Test Schema Download** | Download endpoint | Task 13 | 🔴 Not Created |

---

### Group B: Schema Configuration (Tasks 15-28)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 15 | **Configure SPECTACULAR_SETTINGS** | Main config | Task 14 | 🔴 Not Created |
| 16 | **Set TITLE** | LankaCommerce Cloud API | Task 15 | 🔴 Not Created |
| 17 | **Set DESCRIPTION** | API description | Task 16 | 🔴 Not Created |
| 18 | **Set VERSION** | API version | Task 17 | 🔴 Not Created |
| 19 | **Set SERVE_INCLUDE_SCHEMA** | Include in serve | Task 18 | 🔴 Not Created |
| 20 | **Configure CONTACT Info** | Support email | Task 19 | 🔴 Not Created |
| 21 | **Configure LICENSE** | License info | Task 20 | 🔴 Not Created |
| 22 | **Configure SERVERS** | API servers list | Task 21 | 🔴 Not Created |
| 23 | **Add Development Server** | localhost | Task 22 | 🔴 Not Created |
| 24 | **Add Production Server** | Production URL | Task 23 | 🔴 Not Created |
| 25 | **Configure TAGS** | API tag groups | Task 24 | 🔴 Not Created |
| 26 | **Define Authentication Tag** | Auth endpoints | Task 25 | 🔴 Not Created |
| 27 | **Define Core Tag** | Core endpoints | Task 26 | 🔴 Not Created |
| 28 | **Define Module Tags** | Per-module tags | Task 27 | 🔴 Not Created |

---

### Group C: Swagger UI Setup (Tasks 29-42)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 29 | **Install drf-spectacular[sidecar]** | Swagger UI assets | Task 28 | 🔴 Not Created |
| 30 | **Add sidecar to INSTALLED_APPS** | drf_spectacular_sidecar | Task 29 | 🔴 Not Created |
| 31 | **Configure SWAGGER_UI Settings** | UI configuration | Task 30 | 🔴 Not Created |
| 32 | **Add Swagger UI URL** | /api/docs/ | Task 31 | 🔴 Not Created |
| 33 | **Configure UI Theme** | Dark/light mode | Task 32 | 🔴 Not Created |
| 34 | **Configure Try It Out** | Enable testing | Task 33 | 🔴 Not Created |
| 35 | **Configure Auth Button** | Authorize button | Task 34 | 🔴 Not Created |
| 36 | **Configure Persist Auth** | Remember token | Task 35 | 🔴 Not Created |
| 37 | **Configure Deep Linking** | URL fragments | Task 36 | 🔴 Not Created |
| 38 | **Configure Filter** | Tag filtering | Task 37 | 🔴 Not Created |
| 39 | **Configure Display Options** | Doc expansion | Task 38 | 🔴 Not Created |
| 40 | **Add Custom CSS** | Brand styling | Task 39 | 🔴 Not Created |
| 41 | **Test Swagger UI** | Verify interface | Task 40 | 🔴 Not Created |
| 42 | **Test API Calls** | Try endpoints | Task 41 | 🔴 Not Created |

---

### Group D: ReDoc Setup (Tasks 43-54)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 43 | **Configure REDOC Settings** | ReDoc config | Task 42 | 🔴 Not Created |
| 44 | **Add ReDoc URL** | /api/redoc/ | Task 43 | 🔴 Not Created |
| 45 | **Configure ReDoc Theme** | Theme settings | Task 44 | 🔴 Not Created |
| 46 | **Configure Primary Color** | Brand color | Task 45 | 🔴 Not Created |
| 47 | **Configure Typography** | Font settings | Task 46 | 🔴 Not Created |
| 48 | **Configure Menu Layout** | Sidebar layout | Task 47 | 🔴 Not Created |
| 49 | **Configure Search** | Enable search | Task 48 | 🔴 Not Created |
| 50 | **Configure Expand Responses** | Auto-expand | Task 49 | 🔴 Not Created |
| 51 | **Configure Hide Download** | Download button | Task 50 | 🔴 Not Created |
| 52 | **Add Logo** | Brand logo | Task 51 | 🔴 Not Created |
| 53 | **Test ReDoc Interface** | Verify display | Task 52 | 🔴 Not Created |
| 54 | **Compare with Swagger** | Ensure parity | Task 53 | 🔴 Not Created |

---

### Group E: Documentation Enhancements (Tasks 55-70)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 55 | **Create extensions.py File** | Schema extensions | Task 54 | 🔴 Not Created |
| 56 | **Create Custom Preprocessor** | Schema preprocessing | Task 55 | 🔴 Not Created |
| 57 | **Add Tenant Header Doc** | X-Tenant header | Task 56 | 🔴 Not Created |
| 58 | **Document JWT Authentication** | Bearer token | Task 57 | 🔴 Not Created |
| 59 | **Document Refresh Token** | Token refresh | Task 58 | 🔴 Not Created |
| 60 | **Document Error Responses** | Error formats | Task 59 | 🔴 Not Created |
| 61 | **Create Error Schemas** | Reusable errors | Task 60 | 🔴 Not Created |
| 62 | **Document Pagination** | Page format | Task 61 | 🔴 Not Created |
| 63 | **Document Filtering** | Filter params | Task 62 | 🔴 Not Created |
| 64 | **Document Ordering** | Sort params | Task 63 | 🔴 Not Created |
| 65 | **Create Example Requests** | Request examples | Task 64 | 🔴 Not Created |
| 66 | **Create Example Responses** | Response examples | Task 65 | 🔴 Not Created |
| 67 | **Add Rate Limit Docs** | Rate limit headers | Task 66 | 🔴 Not Created |
| 68 | **Add Versioning Docs** | API versioning | Task 67 | 🔴 Not Created |
| 69 | **Create Changelog Section** | Version history | Task 68 | 🔴 Not Created |
| 70 | **Export Extensions** | In __init__.py | Task 69 | 🔴 Not Created |

---

### Group F: Testing & Validation (Tasks 71-82)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 71 | **Create Schema Tests** | Schema validation | Task 70 | 🔴 Not Created |
| 72 | **Test Schema Generation** | Generate without errors | Task 71 | 🔴 Not Created |
| 73 | **Test Schema Validation** | OpenAPI spec valid | Task 72 | 🔴 Not Created |
| 74 | **Test All Endpoints Listed** | Coverage check | Task 73 | 🔴 Not Created |
| 75 | **Test Auth Endpoints** | Auth documented | Task 74 | 🔴 Not Created |
| 76 | **Test Example Requests** | Examples valid | Task 75 | 🔴 Not Created |
| 77 | **Test Example Responses** | Responses valid | Task 76 | 🔴 Not Created |
| 78 | **Add Schema CI Check** | CI validation | Task 77 | 🔴 Not Created |
| 79 | **Create API Docs README** | Usage docs | Task 78 | 🔴 Not Created |
| 80 | **Document Schema Decorators** | Usage guide | Task 79 | 🔴 Not Created |
| 81 | **Document Extension Guide** | Extension guide | Task 80 | 🔴 Not Created |
| 82 | **Verify Full Integration** | End-to-end test | Task 81 | 🔴 Not Created |

---

## Expected Final Structure

```
backend/apps/core/
├── api_docs/
│   ├── __init__.py
│   ├── urls.py
│   ├── extensions.py
│   ├── schemas.py
│   └── examples.py
├── settings/
│   └── api_docs.py
├── tests/
│   └── test_api_docs/
│       ├── __init__.py
│       ├── test_schema.py
│       └── test_endpoints.py
└── docs/
    └── api/
        ├── overview.md
        ├── authentication.md
        └── versioning.md
```

---

## API Documentation Structure

```
┌─────────────────────────────────────────────────────┐
│            API DOCUMENTATION STRUCTURE              │
├─────────────────────────────────────────────────────┤
│                                                     │
│  URL Endpoints:                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │ /api/schema/          → OpenAPI 3.0 JSON    │   │
│  │ /api/schema.yaml      → OpenAPI 3.0 YAML    │   │
│  │ /api/docs/            → Swagger UI          │   │
│  │ /api/redoc/           → ReDoc Interface     │   │
│  │ /api/schema/download/ → Download Schema     │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  Tag Organization:                                  │
│  ┌─────────────────────────────────────────────┐   │
│  │ 🔐 Authentication                           │   │
│  │    ├── Login                               │   │
│  │    ├── Register                            │   │
│  │    ├── Refresh Token                       │   │
│  │    └── Logout                              │   │
│  │ 👥 Users                                    │   │
│  │ 📦 Products                                 │   │
│  │ 🛒 Orders                                   │   │
│  │ 💳 Payments                                 │   │
│  │ 📊 Reports                                  │   │
│  │ ⚙️ Settings                                 │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## Schema Decorators Reference

```
┌─────────────────────────────────────────────────────┐
│            SCHEMA DECORATORS REFERENCE              │
├─────────────────────────────────────────────────────┤
│                                                     │
│  View Decorators:                                   │
│  ├── @extend_schema()       → Full schema control  │
│  ├── @extend_schema_view()  → ViewSet schemas      │
│  └── @extend_schema_serializer() → Serializer      │
│                                                     │
│  Common Parameters:                                 │
│  ├── summary       → Short description             │
│  ├── description   → Detailed description          │
│  ├── request       → Request body schema           │
│  ├── responses     → Response schemas              │
│  ├── parameters    → Query/path params             │
│  ├── tags          → API tags                      │
│  ├── examples      → Request/response examples     │
│  └── deprecated    → Mark as deprecated            │
│                                                     │
│  Response Codes:                                    │
│  ├── 200 → Success                                 │
│  ├── 201 → Created                                 │
│  ├── 400 → Bad Request                             │
│  ├── 401 → Unauthorized                            │
│  ├── 403 → Forbidden                               │
│  ├── 404 → Not Found                               │
│  └── 500 → Server Error                            │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## Progress Tracking

| Metric | Count |
|--------|-------|
| Total Tasks | 82 |
| Tasks Completed | 0 |
| Tasks In Progress | 0 |
| Tasks Not Started | 82 |

**Last Updated:** 2026-01-17  
**Current Status:** Ready for task document creation

---

## Notes for AI Agents

1. **Execution Order:** Complete Group A before B, etc.
2. **drf-spectacular:** Primary documentation tool
3. **OpenAPI 3.0:** Required schema format
4. **Both UIs:** Swagger and ReDoc required
5. **Examples:** Include request/response examples
6. **Tenant Header:** Document X-Tenant requirement
7. **JWT Auth:** Document token flow
8. **Error Schemas:** Reusable error definitions
9. **CI Check:** Schema validation in pipeline
