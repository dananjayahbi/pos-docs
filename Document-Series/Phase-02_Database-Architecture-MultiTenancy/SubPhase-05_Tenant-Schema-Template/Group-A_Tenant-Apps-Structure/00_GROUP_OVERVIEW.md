# Group A: Tenant Apps Structure

> **Phase:** 02 - Database Architecture & Multi-Tenancy  
> **SubPhase:** 05 - Tenant Schema Template  
> **Group:** A of G  
> **Tasks Covered:** 01-14  
> **Group Goal:** Create all tenant-specific Django apps and base mixins

---

## Navigation

- **↑ Parent:** [../00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** None (First Group)
- **→ Next Group:** [../Group-B_Product-Category-Models/](../Group-B_Product-Category-Models/)

---

## Group Overview

This group creates all the Django apps that will live in tenant schemas. Each app is isolated per tenant and contains business-specific data. This includes products, inventory, customers, suppliers, orders, invoices, employees, accounting, and POS.

### Key Outcomes
- products Django app created
- inventory Django app created
- customers Django app created
- suppliers Django app created
- orders Django app created
- invoices Django app created
- employees Django app created
- accounting Django app created
- pos Django app created
- AppConfig classes for each app
- All apps registered in TENANT_APPS
- Base model mixins created
- UUID mixin for tenant models
- Audit mixin for tracking

### Technology Context
- **Location:** apps/ directory
- **Registration:** TENANT_APPS setting
- **Schema:** Created in each tenant schema
- **Mixins:** Reusable base classes

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | 01_Tasks-01-05_Core-Business-Apps.md | 01-05 | Create products, inventory, customers, suppliers, orders apps |
| 02 | 02_Tasks-06-10_Support-Apps-Config.md | 06-10 | Create invoices, employees, accounting, pos apps, AppConfig classes |
| 03 | 03_Tasks-11-14_Registration-Mixins.md | 11-14 | Register in TENANT_APPS, create base mixins, UUID mixin, audit mixin |

---

## Task Summary

| Task # | Task Name | Dependencies | Complexity |
|--------|-----------|--------------|------------|
| 01 | Create products App | SubPhase-04 | Simple |
| 02 | Create inventory App | Task 01 | Simple |
| 03 | Create customers App | Task 01 | Simple |
| 04 | Create suppliers App | Task 01 | Simple |
| 05 | Create orders App | Task 01 | Simple |
| 06 | Create invoices App | Task 01 | Simple |
| 07 | Create employees App | Task 01 | Simple |
| 08 | Create accounting App | Task 01 | Simple |
| 09 | Create pos App | Task 01 | Simple |
| 10 | Create App Config Classes | Task 09 | Simple |
| 11 | Register in TENANT_APPS | Task 10 | Simple |
| 12 | Create Base Model Mixins | Task 01 | Medium |
| 13 | Create UUID Mixin | Task 12 | Simple |
| 14 | Create Audit Mixin | Task 12 | Simple |

---

## Execution Order

```
01_Tasks-01-05_Core-Business-Apps.md
        │
        ▼
02_Tasks-06-10_Support-Apps-Config.md
        │
        ▼
03_Tasks-11-14_Registration-Mixins.md
```

---

## Expected Deliverables

After completing this group:

```
backend/
├── apps/
│   ├── products/
│   │   ├── __init__.py
│   │   └── apps.py
│   ├── inventory/
│   │   ├── __init__.py
│   │   └── apps.py
│   ├── customers/
│   │   ├── __init__.py
│   │   └── apps.py
│   ├── suppliers/
│   │   ├── __init__.py
│   │   └── apps.py
│   ├── orders/
│   │   ├── __init__.py
│   │   └── apps.py
│   ├── invoices/
│   │   ├── __init__.py
│   │   └── apps.py
│   ├── employees/
│   │   ├── __init__.py
│   │   └── apps.py
│   ├── accounting/
│   │   ├── __init__.py
│   │   └── apps.py
│   ├── pos/
│   │   ├── __init__.py
│   │   └── apps.py
│   └── core/
│       └── mixins.py        # Base mixins

config/
└── settings/
    └── base.py              # TENANT_APPS updated
```

---

## TENANT_APPS Configuration

```python
TENANT_APPS = [
    'django.contrib.contenttypes',
    'django.contrib.auth',
    # Tenant-specific apps
    'apps.products',
    'apps.inventory',
    'apps.customers',
    'apps.suppliers',
    'apps.orders',
    'apps.invoices',
    'apps.employees',
    'apps.accounting',
    'apps.pos',
]
```

---

## Notes for AI Agents

1. **Dependencies:** Requires SubPhase-04 complete (Tenant/Domain exist)
2. **App Command:** Use `python manage.py startapp <name> apps/<name>`
3. **TENANT_APPS:** All apps MUST be in TENANT_APPS
4. **Mixins:** Create in core app for reuse
5. **UUID:** Use same pattern as platform app
6. **Git Commit:** Commit after completing this group

