# Group A: drf-spectacular Setup

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 11 - API Documentation  
> **Group:** A of F  
> **Tasks Covered:** 01-14  
> **Group Goal:** Install and configure drf-spectacular for OpenAPI schema generation

---

## Navigation

- **↑ Parent:** [../00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** None (First Group)
- **→ Next Group:** [../Group-B_Schema-Configuration/](../Group-B_Schema-Configuration/)

---

## Group Overview

This group sets up drf-spectacular as the API documentation generator for the LankaCommerce Cloud platform. It provides OpenAPI 3.0 schema generation with Swagger UI and ReDoc support.

### Key Outcomes
- drf-spectacular package installed
- Added to INSTALLED_APPS
- api_docs module created
- DEFAULT_SCHEMA_CLASS configured
- Schema URL patterns set up
- Basic schema generation verified
- Schema download endpoint working

### Technology Context
- **Package:** drf-spectacular
- **Schema Format:** OpenAPI 3.0
- **Schema URL:** /api/schema/
- **Module:** apps/core/api_docs/
- **Settings:** config/settings/api_docs.py

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | 01_Tasks-01-05_Package-Module-Setup.md | 01-05 | Install drf-spectacular, pin version, add to INSTALLED_APPS, create api_docs module, __init__.py |
| 02 | 02_Tasks-06-10_Settings-URLs.md | 06-10 | Create settings file, configure DEFAULT_SCHEMA_CLASS, import settings, create URLs file, add schema URL |
| 03 | 03_Tasks-11-14_Integration-Testing.md | 11-14 | Include in main URLs, test schema generation, verify OpenAPI 3.0, test schema download |

---

## Task Summary

| Task # | Task Name | Dependencies | Complexity |
|--------|-----------|--------------|------------|
| 01 | Install drf-spectacular | SubPhase-02 | Simple |
| 02 | Pin drf-spectacular Version | Task 01 | Simple |
| 03 | Add to INSTALLED_APPS | Task 02 | Simple |
| 04 | Create api_docs Module | Task 03 | Simple |
| 05 | Create api_docs __init__.py | Task 04 | Simple |
| 06 | Create Settings File | Task 05 | Medium |
| 07 | Configure DEFAULT_SCHEMA_CLASS | Task 06 | Simple |
| 08 | Import API Docs Settings | Task 07 | Simple |
| 09 | Create Schema URLs File | Task 08 | Simple |
| 10 | Add Schema URL Pattern | Task 09 | Simple |
| 11 | Include in Main URLs | Task 10 | Simple |
| 12 | Test Schema Generation | Task 11 | Simple |
| 13 | Verify OpenAPI 3.0 Format | Task 12 | Simple |
| 14 | Test Schema Download | Task 13 | Simple |

---

## Execution Order

```
01_Tasks-01-05_Package-Module-Setup.md
        │
        ▼
02_Tasks-06-10_Settings-URLs.md
        │
        ▼
03_Tasks-11-14_Integration-Testing.md
```

---

## Expected Deliverables

After completing this group:

```
backend/
├── requirements/
│   └── base.txt              # drf-spectacular added
├── config/
│   ├── settings/
│   │   └── api_docs.py       # API docs settings
│   └── urls.py               # Schema URLs included
├── apps/
│   └── core/
│       └── api_docs/
│           ├── __init__.py   # Module init
│           └── urls.py       # Schema URL patterns
```

---

## Notes for AI Agents

1. **Dependencies:** Requires SubPhase-02 complete (DRF installed)
2. **Version:** Use drf-spectacular>=0.27.0
3. **Schema Class:** AutoSchema from drf_spectacular.openapi
4. **URL Pattern:** Use SpectacularAPIView for schema
5. **Format:** OpenAPI 3.0.3 specification
6. **Git Commit:** Commit after completing this group
