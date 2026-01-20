# Group A: MPTT Setup

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 01 - Category Model & Hierarchy  
> **Group:** A of F  
> **Tasks Covered:** 01-14  
> **Group Goal:** Install and configure django-mptt for hierarchical categories

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **→ Next Group:** [Group-B_Category-Model-Definition](../Group-B_Category-Model-Definition/)

---

## Group Overview

### Key Outcomes
- django-mptt library installed and pinned
- Categories app created and registered
- Understanding of MPTT fields (lft, rght, tree_id, level)
- App structure prepared for category model

### Technology Context
- django-mptt for Modified Preorder Tree Traversal
- Efficient tree queries without recursive database calls
- MPTT fields are auto-managed by the library
- Categories registered as TENANT_APPS for multi-tenancy

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | 01_Tasks-01-05_MPTT-Installation-App-Creation.md | 01-05 | Install django-mptt and create categories app |
| 02 | 02_Tasks-06-10_App-Configuration-Models-Module.md | 06-10 | Configure app and create models directory |
| 03 | 03_Tasks-11-14_MPTT-Fields-Tree-Structure.md | 11-14 | Understand MPTT fields and verify setup |

---

## Task Summary

| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 01 | Install django-mptt | Low |
| 02 | Pin django-mptt Version | Low |
| 03 | Add to INSTALLED_APPS | Low |
| 04 | Create categories App | Low |
| 05 | Add categories to TENANT_APPS | Medium |
| 06 | Create categories __init__.py | Low |
| 07 | Create categories apps.py | Low |
| 08 | Configure App Label | Low |
| 09 | Create models Module | Low |
| 10 | Create models __init__.py | Low |
| 11 | Understand MPTT Fields | Medium |
| 12 | Plan Tree Structure | Medium |
| 13 | Create Initial Migration | Low |
| 14 | Test MPTT Installation | Medium |

---

## Execution Order

```
Tasks 01-03: Install & Configure django-mptt
    │
    ▼
Tasks 04-05: Create categories App
    │
    ▼
Tasks 06-08: App Configuration
    │
    ▼
Tasks 09-10: Create models Module
    │
    ▼
Tasks 11-12: Understand MPTT & Plan Structure
    │
    ▼
Tasks 13-14: Migration & Testing
```

---

## Expected Deliverables

```
backend/apps/categories/
├── __init__.py
├── apps.py
└── models/
    └── __init__.py
```

---

## Notes for AI Agents

1. django-mptt must be installed before creating the Category model
2. Categories app must be in TENANT_APPS, not SHARED_APPS
3. MPTT fields (lft, rght, tree_id, level) are auto-managed
4. Do not manually modify MPTT fields
5. Use TreeManager methods for tree queries
