# Group B: Schema Configuration

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 11 - API Documentation  
> **Group:** B of F  
> **Tasks Covered:** 15-28  
> **Group Goal:** Configure SPECTACULAR_SETTINGS with API metadata and tags

---

## Navigation

- **↑ Parent:** [../00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [../Group-A_drf-spectacular-Setup/](../Group-A_drf-spectacular-Setup/)
- **→ Next Group:** [../Group-C_Swagger-UI-Setup/](../Group-C_Swagger-UI-Setup/)

---

## Group Overview

This group configures the SPECTACULAR_SETTINGS dictionary with API metadata including title, description, version, contact info, license, servers, and tag organization for the LankaCommerce Cloud API.

### Key Outcomes
- SPECTACULAR_SETTINGS fully configured
- API title, description, version set
- Contact and license info added
- Development and production servers defined
- API tags organized by module
- Authentication, Core, and Module tags defined

### Technology Context
- **Settings Dict:** SPECTACULAR_SETTINGS
- **API Title:** LankaCommerce Cloud API
- **API Version:** v1.0.0
- **License:** Proprietary
- **Servers:** localhost (dev), api.lankacommerce.com (prod)

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | 01_Tasks-15-19_Basic-Settings.md | 15-19 | Configure SPECTACULAR_SETTINGS, set TITLE, DESCRIPTION, VERSION, SERVE_INCLUDE_SCHEMA |
| 02 | 02_Tasks-20-24_Contact-Servers.md | 20-24 | Configure CONTACT, LICENSE, SERVERS, add dev server, add prod server |
| 03 | 03_Tasks-25-28_Tags-Organization.md | 25-28 | Configure TAGS, define Authentication tag, Core tag, Module tags |

---

## Task Summary

| Task # | Task Name | Dependencies | Complexity |
|--------|-----------|--------------|------------|
| 15 | Configure SPECTACULAR_SETTINGS | Task 14 | Medium |
| 16 | Set TITLE | Task 15 | Simple |
| 17 | Set DESCRIPTION | Task 16 | Simple |
| 18 | Set VERSION | Task 17 | Simple |
| 19 | Set SERVE_INCLUDE_SCHEMA | Task 18 | Simple |
| 20 | Configure CONTACT Info | Task 19 | Simple |
| 21 | Configure LICENSE | Task 20 | Simple |
| 22 | Configure SERVERS | Task 21 | Medium |
| 23 | Add Development Server | Task 22 | Simple |
| 24 | Add Production Server | Task 23 | Simple |
| 25 | Configure TAGS | Task 24 | Medium |
| 26 | Define Authentication Tag | Task 25 | Simple |
| 27 | Define Core Tag | Task 26 | Simple |
| 28 | Define Module Tags | Task 27 | Medium |

---

## Execution Order

```
01_Tasks-15-19_Basic-Settings.md
        │
        ▼
02_Tasks-20-24_Contact-Servers.md
        │
        ▼
03_Tasks-25-28_Tags-Organization.md
```

---

## Expected Deliverables

After completing this group:

```
backend/config/settings/
└── api_docs.py               # Updated with full SPECTACULAR_SETTINGS
    ├── TITLE
    ├── DESCRIPTION
    ├── VERSION
    ├── CONTACT
    ├── LICENSE
    ├── SERVERS
    └── TAGS
```

---

## Notes for AI Agents

1. **Title:** "LankaCommerce Cloud API"
2. **Description:** Include multi-tenant and Sri Lanka focus
3. **Version:** Use semantic versioning (v1.0.0)
4. **Contact:** support@lankacommerce.com
5. **Tags:** Organize by module (Auth, Users, Products, Orders, etc.)
6. **Git Commit:** Commit after completing this group
