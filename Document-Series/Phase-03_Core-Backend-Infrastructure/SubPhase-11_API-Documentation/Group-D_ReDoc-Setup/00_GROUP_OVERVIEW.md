# Group D: ReDoc Setup

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 11 - API Documentation  
> **Group:** D of F  
> **Tasks Covered:** 43-54  
> **Group Goal:** Configure ReDoc as alternative documentation interface

---

## Navigation

- **↑ Parent:** [../00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [../Group-C_Swagger-UI-Setup/](../Group-C_Swagger-UI-Setup/)
- **→ Next Group:** [../Group-E_Documentation-Enhancements/](../Group-E_Documentation-Enhancements/)

---

## Group Overview

This group sets up ReDoc as an alternative, read-focused API documentation interface. ReDoc provides a clean, three-panel layout ideal for comprehensive API reference documentation.

### Key Outcomes
- ReDoc URL configured (/api/redoc/)
- Theme customized with brand colors
- Typography configured
- Menu layout optimized
- Search enabled
- Response expansion configured
- Brand logo added
- Parity with Swagger verified

### Technology Context
- **View:** SpectacularRedocView
- **ReDoc URL:** /api/redoc/
- **Layout:** Three-panel (menu, content, examples)
- **Theme:** Customizable colors and fonts
- **Brand:** LankaCommerce Cloud logo

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | 01_Tasks-43-48_ReDoc-Setup.md | 43-48 | Configure REDOC settings, add URL, configure theme, primary color, typography, menu layout |
| 02 | 02_Tasks-49-54_Features-Testing.md | 49-54 | Configure search, expand responses, hide download, add logo, test interface, compare with Swagger |

---

## Task Summary

| Task # | Task Name | Dependencies | Complexity |
|--------|-----------|--------------|------------|
| 43 | Configure REDOC Settings | Task 42 | Medium |
| 44 | Add ReDoc URL | Task 43 | Simple |
| 45 | Configure ReDoc Theme | Task 44 | Medium |
| 46 | Configure Primary Color | Task 45 | Simple |
| 47 | Configure Typography | Task 46 | Simple |
| 48 | Configure Menu Layout | Task 47 | Simple |
| 49 | Configure Search | Task 48 | Simple |
| 50 | Configure Expand Responses | Task 49 | Simple |
| 51 | Configure Hide Download | Task 50 | Simple |
| 52 | Add Logo | Task 51 | Medium |
| 53 | Test ReDoc Interface | Task 52 | Simple |
| 54 | Compare with Swagger | Task 53 | Simple |

---

## Execution Order

```
01_Tasks-43-48_ReDoc-Setup.md
        │
        ▼
02_Tasks-49-54_Features-Testing.md
```

---

## Expected Deliverables

After completing this group:

```
backend/
├── config/
│   └── settings/
│       └── api_docs.py       # REDOC_UI_SETTINGS added
├── apps/
│   └── core/
│       └── api_docs/
│           └── urls.py       # ReDoc URL added
└── static/
    └── api_docs/
        └── logo.png          # Brand logo for ReDoc
```

---

## Notes for AI Agents

1. **URL:** /api/redoc/ for ReDoc interface
2. **Theme:** Use LankaCommerce brand colors
3. **Font:** Use system fonts for fast loading
4. **Search:** Enable for easy navigation
5. **Logo:** Add LankaCommerce Cloud logo
6. **Parity:** Ensure same endpoints as Swagger
7. **Git Commit:** Commit after completing this group
