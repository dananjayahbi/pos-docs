# Group C: Swagger UI Setup

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 11 - API Documentation  
> **Group:** C of F  
> **Tasks Covered:** 29-42  
> **Group Goal:** Configure Swagger UI with custom theme and interactive features

---

## Navigation

- **↑ Parent:** [../00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [../Group-B_Schema-Configuration/](../Group-B_Schema-Configuration/)
- **→ Next Group:** [../Group-D_ReDoc-Setup/](../Group-D_ReDoc-Setup/)

---

## Group Overview

This group sets up Swagger UI as the interactive API documentation interface. It includes installing the sidecar package, configuring the UI theme, enabling "Try It Out" functionality, and adding authentication support.

### Key Outcomes
- drf-spectacular[sidecar] installed
- Swagger UI URL configured (/api/docs/)
- UI theme configured (dark/light)
- "Try It Out" enabled for testing
- Authorization button configured
- Persist authorization enabled
- Deep linking and filtering ready
- Custom CSS for branding

### Technology Context
- **Package:** drf-spectacular-sidecar
- **Swagger URL:** /api/docs/
- **View:** SpectacularSwaggerView
- **Theme:** Configurable dark/light
- **Auth:** JWT Bearer token support

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | 01_Tasks-29-34_Swagger-Setup.md | 29-34 | Install sidecar, add to INSTALLED_APPS, configure SWAGGER_UI settings, add URL, configure theme, enable Try It Out |
| 02 | 02_Tasks-35-40_UI-Configuration.md | 35-40 | Configure auth button, persist auth, deep linking, filter, display options, custom CSS |
| 03 | 03_Tasks-41-42_Testing.md | 41-42 | Test Swagger UI, test API calls |

---

## Task Summary

| Task # | Task Name | Dependencies | Complexity |
|--------|-----------|--------------|------------|
| 29 | Install drf-spectacular[sidecar] | Task 28 | Simple |
| 30 | Add sidecar to INSTALLED_APPS | Task 29 | Simple |
| 31 | Configure SWAGGER_UI Settings | Task 30 | Medium |
| 32 | Add Swagger UI URL | Task 31 | Simple |
| 33 | Configure UI Theme | Task 32 | Simple |
| 34 | Configure Try It Out | Task 33 | Simple |
| 35 | Configure Auth Button | Task 34 | Medium |
| 36 | Configure Persist Auth | Task 35 | Simple |
| 37 | Configure Deep Linking | Task 36 | Simple |
| 38 | Configure Filter | Task 37 | Simple |
| 39 | Configure Display Options | Task 38 | Simple |
| 40 | Add Custom CSS | Task 39 | Medium |
| 41 | Test Swagger UI | Task 40 | Simple |
| 42 | Test API Calls | Task 41 | Medium |

---

## Execution Order

```
01_Tasks-29-34_Swagger-Setup.md
        │
        ▼
02_Tasks-35-40_UI-Configuration.md
        │
        ▼
03_Tasks-41-42_Testing.md
```

---

## Expected Deliverables

After completing this group:

```
backend/
├── requirements/
│   └── base.txt              # drf-spectacular-sidecar added
├── config/
│   └── settings/
│       └── api_docs.py       # SWAGGER_UI_SETTINGS added
├── apps/
│   └── core/
│       └── api_docs/
│           └── urls.py       # Swagger UI URL added
└── static/
    └── api_docs/
        └── custom.css        # Custom branding CSS
```

---

## Notes for AI Agents

1. **Sidecar:** Use drf-spectacular-sidecar for self-hosted assets
2. **URL:** /api/docs/ for Swagger UI
3. **Try It Out:** Enable by default for testing
4. **Auth:** Configure Bearer token authorization
5. **Persist:** Remember auth token across sessions
6. **Theme:** Support both dark and light modes
7. **Git Commit:** Commit after completing this group
