# Group A: Products App Setup

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 03 - Product Base Model  
> **Group:** A of F  
> **Tasks Covered:** 01-14  
> **Group Goal:** Create products app and define product type/status constants

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **→ Next Group:** [Group-B_Supporting-Models](../Group-B_Supporting-Models/)

---

## Group Overview

### Key Outcomes
- Products app created and registered as TENANT_APP
- Constants for product types (simple, variable, bundle, composite)
- Constants for product status (draft, active, archived, discontinued)
- App structure ready for models

### Technology Context
- Django app structure with models directory
- Choice constants for product types and statuses
- Tenant-specific app registration
- Constants used across models, serializers, and views

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | 01_Tasks-01-07_App-Creation-Configuration.md | 01-07 | Create products app and configure |
| 02 | 02_Tasks-08-14_Constants-Product-Types-Status.md | 08-14 | Define product type and status constants |

---

## Task Summary

| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 01 | Create products App | Low |
| 02 | Add products to TENANT_APPS | Medium |
| 03 | Create products __init__.py | Low |
| 04 | Create products apps.py | Low |
| 05 | Configure App Label | Low |
| 06 | Create models Module | Low |
| 07 | Create models __init__.py | Low |
| 08 | Create constants.py File | Low |
| 09 | Define PRODUCT_TYPES | Medium |
| 10 | Define PRODUCT_STATUS | Medium |
| 11 | Define DRAFT Status | Low |
| 12 | Define ACTIVE Status | Low |
| 13 | Define ARCHIVED Status | Low |
| 14 | Define DISCONTINUED Status | Low |

---

## Execution Order

```
Tasks 01-05: Create & Configure App
    │
    ▼
Tasks 06-07: Create models Module
    │
    ▼
Tasks 08-14: Define Constants
```

---

## Expected Deliverables

```
backend/apps/products/
├── __init__.py
├── apps.py
├── constants.py
└── models/
    └── __init__.py
```

---

## Notes for AI Agents

1. App must be in TENANT_APPS for multi-tenancy
2. PRODUCT_TYPES: simple, variable, bundle, composite
3. PRODUCT_STATUS: draft, active, archived, discontinued
4. Status determines visibility and availability
5. Type determines variant and pricing behavior
