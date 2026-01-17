# SubPhase 01: Django Apps Structure - Tasks Summary

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase Index:** 01 of 12  
> **SubPhase Goal:** Create a modular, scalable Django apps architecture  
> **Total Tasks:** 92 | **Status:** Planning  
> **Estimated Duration:** 7-8 hours

---

## Navigation

- **↑ Parent:** [00_SUBPHASES_SUMMARY.md](../00_SUBPHASES_SUMMARY.md)
- **← Previous Phase:** [Phase-02_Database-Architecture-MultiTenancy](../../Phase-02_Database-Architecture-MultiTenancy/)
- **→ Next SubPhase:** [SubPhase-02_API-Framework-Setup](../SubPhase-02_API-Framework-Setup/)

---

## SubPhase Overview

This sub-phase creates the complete Django applications structure for the LankaCommerce Cloud platform. Each app follows Django best practices with proper separation of concerns, making the codebase maintainable and scalable.

### Key Outcomes
- All Django apps created with proper structure
- Apps registered in Django settings
- App configurations defined
- URL routing structure established
- Admin registrations prepared
- Initial migrations created

### Target App Structure
```
backend/apps/
├── core/               # Base models, utilities
├── tenants/            # Multi-tenancy models
├── users/              # User management
├── products/           # Product catalog
├── inventory/          # Stock management
├── sales/              # Orders, invoices
├── customers/          # Customer management
├── vendors/            # Supplier management
├── hr/                 # HR & Payroll
├── accounting/         # Financial management
├── webstore/           # E-commerce frontend API
├── integrations/       # External service integrations
└── reports/            # Reporting & analytics
```

### Dependencies
- **Requires:** Phase-01 (Project Foundation)
- **Requires:** Phase-02 (Multi-Tenancy Architecture)

---

## Task Execution Order

```
TASK GROUP A: Apps Directory Setup (Tasks 01-08)
        │
        ▼
TASK GROUP B: Core App Creation (Tasks 09-22)
        │
        ▼
TASK GROUP C: Tenant & User Apps (Tasks 23-36)
        │
        ▼
TASK GROUP D: Product & Inventory Apps (Tasks 37-50)
        │
        ▼
TASK GROUP E: Sales & Customer Apps (Tasks 51-64)
        │
        ▼
TASK GROUP F: Supporting Module Apps (Tasks 65-78)
        │
        ▼
TASK GROUP G: Integration & Configuration (Tasks 79-92)
```

---

## Task Index

### Group A: Apps Directory Setup (Tasks 01-08)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 01 | **Create apps Directory** | Create backend/apps/ directory | Phase-02 | 🔴 Not Created |
| 02 | **Create apps __init__.py** | Initialize apps package | Task 01 | 🔴 Not Created |
| 03 | **Update Python Path** | Add apps to PYTHONPATH in settings | Task 02 | 🔴 Not Created |
| 04 | **Create Apps README** | Document apps structure | Task 02 | 🔴 Not Created |
| 05 | **Create App Template** | Template for new app creation | Task 04 | 🔴 Not Created |
| 06 | **Define App Naming Convention** | Establish naming standards | Task 04 | 🔴 Not Created |
| 07 | **Create Management Command Folder** | For custom commands | Task 06 | 🔴 Not Created |
| 08 | **Document App Creation Process** | Developer documentation | Task 07 | 🔴 Not Created |

---

### Group B: Core App Creation (Tasks 09-22)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 09 | **Create core App Directory** | mkdir apps/core | Task 08 | 🔴 Not Created |
| 10 | **Create core __init__.py** | Initialize core package | Task 09 | 🔴 Not Created |
| 11 | **Create core apps.py** | CoreConfig class | Task 10 | 🔴 Not Created |
| 12 | **Create core models.py** | Placeholder for base models | Task 11 | 🔴 Not Created |
| 13 | **Create core admin.py** | Admin configuration | Task 12 | 🔴 Not Created |
| 14 | **Create core urls.py** | URL patterns placeholder | Task 12 | 🔴 Not Created |
| 15 | **Create core views.py** | Views placeholder | Task 14 | 🔴 Not Created |
| 16 | **Create core serializers.py** | DRF serializers | Task 15 | 🔴 Not Created |
| 17 | **Create core utils/ Directory** | Utility functions folder | Task 16 | 🔴 Not Created |
| 18 | **Create core mixins/ Directory** | Mixin classes folder | Task 17 | 🔴 Not Created |
| 19 | **Create core exceptions.py** | Custom exception classes | Task 18 | 🔴 Not Created |
| 20 | **Create core constants.py** | App constants | Task 19 | 🔴 Not Created |
| 21 | **Create core tests/ Directory** | Test directory structure | Task 20 | 🔴 Not Created |
| 22 | **Register core in INSTALLED_APPS** | Add to settings | Task 21 | 🔴 Not Created |

---

### Group C: Tenant & User Apps (Tasks 23-36)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 23 | **Create tenants App Directory** | mkdir apps/tenants | Task 22 | 🔴 Not Created |
| 24 | **Create tenants __init__.py** | Initialize tenants package | Task 23 | 🔴 Not Created |
| 25 | **Create tenants apps.py** | TenantsConfig class | Task 24 | 🔴 Not Created |
| 26 | **Create tenants models.py** | Reference to existing models | Task 25 | 🔴 Not Created |
| 27 | **Create tenants admin.py** | Tenant admin registration | Task 26 | 🔴 Not Created |
| 28 | **Create tenants urls.py** | Tenant URL patterns | Task 27 | 🔴 Not Created |
| 29 | **Register tenants in Settings** | Add to TENANT_APPS | Task 28 | 🔴 Not Created |
| 30 | **Create users App Directory** | mkdir apps/users | Task 29 | 🔴 Not Created |
| 31 | **Create users __init__.py** | Initialize users package | Task 30 | 🔴 Not Created |
| 32 | **Create users apps.py** | UsersConfig class | Task 31 | 🔴 Not Created |
| 33 | **Create users models.py** | Custom user model placeholder | Task 32 | 🔴 Not Created |
| 34 | **Create users admin.py** | User admin registration | Task 33 | 🔴 Not Created |
| 35 | **Create users urls.py** | User URL patterns | Task 34 | 🔴 Not Created |
| 36 | **Register users in Settings** | Add to TENANT_APPS | Task 35 | 🔴 Not Created |

---

### Group D: Product & Inventory Apps (Tasks 37-50)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 37 | **Create products App Directory** | mkdir apps/products | Task 36 | 🔴 Not Created |
| 38 | **Create products __init__.py** | Initialize products package | Task 37 | 🔴 Not Created |
| 39 | **Create products apps.py** | ProductsConfig class | Task 38 | 🔴 Not Created |
| 40 | **Create products models.py** | Product model placeholder | Task 39 | 🔴 Not Created |
| 41 | **Create products admin.py** | Product admin registration | Task 40 | 🔴 Not Created |
| 42 | **Create products urls.py** | Product URL patterns | Task 41 | 🔴 Not Created |
| 43 | **Register products in Settings** | Add to TENANT_APPS | Task 42 | 🔴 Not Created |
| 44 | **Create inventory App Directory** | mkdir apps/inventory | Task 43 | 🔴 Not Created |
| 45 | **Create inventory __init__.py** | Initialize inventory package | Task 44 | 🔴 Not Created |
| 46 | **Create inventory apps.py** | InventoryConfig class | Task 45 | 🔴 Not Created |
| 47 | **Create inventory models.py** | Inventory model placeholder | Task 46 | 🔴 Not Created |
| 48 | **Create inventory admin.py** | Inventory admin registration | Task 47 | 🔴 Not Created |
| 49 | **Create inventory urls.py** | Inventory URL patterns | Task 48 | 🔴 Not Created |
| 50 | **Register inventory in Settings** | Add to TENANT_APPS | Task 49 | 🔴 Not Created |

---

### Group E: Sales & Customer Apps (Tasks 51-64)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 51 | **Create sales App Directory** | mkdir apps/sales | Task 50 | 🔴 Not Created |
| 52 | **Create sales __init__.py** | Initialize sales package | Task 51 | 🔴 Not Created |
| 53 | **Create sales apps.py** | SalesConfig class | Task 52 | 🔴 Not Created |
| 54 | **Create sales models.py** | Sales model placeholder | Task 53 | 🔴 Not Created |
| 55 | **Create sales admin.py** | Sales admin registration | Task 54 | 🔴 Not Created |
| 56 | **Create sales urls.py** | Sales URL patterns | Task 55 | 🔴 Not Created |
| 57 | **Register sales in Settings** | Add to TENANT_APPS | Task 56 | 🔴 Not Created |
| 58 | **Create customers App Directory** | mkdir apps/customers | Task 57 | 🔴 Not Created |
| 59 | **Create customers __init__.py** | Initialize customers package | Task 58 | 🔴 Not Created |
| 60 | **Create customers apps.py** | CustomersConfig class | Task 59 | 🔴 Not Created |
| 61 | **Create customers models.py** | Customer model placeholder | Task 60 | 🔴 Not Created |
| 62 | **Create customers admin.py** | Customer admin registration | Task 61 | 🔴 Not Created |
| 63 | **Create customers urls.py** | Customer URL patterns | Task 62 | 🔴 Not Created |
| 64 | **Register customers in Settings** | Add to TENANT_APPS | Task 63 | 🔴 Not Created |

---

### Group F: Supporting Module Apps (Tasks 65-78)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 65 | **Create vendors App** | Supplier management app | Task 64 | 🔴 Not Created |
| 66 | **Create vendors Structure** | Standard app files | Task 65 | 🔴 Not Created |
| 67 | **Register vendors in Settings** | Add to TENANT_APPS | Task 66 | 🔴 Not Created |
| 68 | **Create hr App** | HR & Payroll app | Task 67 | 🔴 Not Created |
| 69 | **Create hr Structure** | Standard app files | Task 68 | 🔴 Not Created |
| 70 | **Register hr in Settings** | Add to TENANT_APPS | Task 69 | 🔴 Not Created |
| 71 | **Create accounting App** | Financial management app | Task 70 | 🔴 Not Created |
| 72 | **Create accounting Structure** | Standard app files | Task 71 | 🔴 Not Created |
| 73 | **Register accounting in Settings** | Add to TENANT_APPS | Task 72 | 🔴 Not Created |
| 74 | **Create webstore App** | E-commerce frontend API | Task 73 | 🔴 Not Created |
| 75 | **Create webstore Structure** | Standard app files | Task 74 | 🔴 Not Created |
| 76 | **Register webstore in Settings** | Add to TENANT_APPS | Task 75 | 🔴 Not Created |
| 77 | **Create reports App** | Reporting & analytics | Task 76 | 🔴 Not Created |
| 78 | **Register reports in Settings** | Add to TENANT_APPS | Task 77 | 🔴 Not Created |

---

### Group G: Integration & Configuration (Tasks 79-92)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 79 | **Create integrations App** | External service integrations | Task 78 | 🔴 Not Created |
| 80 | **Create integrations Structure** | Standard app files | Task 79 | 🔴 Not Created |
| 81 | **Register integrations in Settings** | Add to TENANT_APPS | Task 80 | 🔴 Not Created |
| 82 | **Create Main urls.py Router** | Root URL configuration | Task 81 | 🔴 Not Created |
| 83 | **Include All App URLs** | Wire up all app routes | Task 82 | 🔴 Not Created |
| 84 | **Create API Router** | /api/v1/ namespace | Task 83 | 🔴 Not Created |
| 85 | **Update INSTALLED_APPS Order** | Proper app loading order | Task 84 | 🔴 Not Created |
| 86 | **Configure SHARED_APPS** | Public schema apps | Task 85 | 🔴 Not Created |
| 87 | **Configure TENANT_APPS** | Tenant schema apps | Task 86 | 🔴 Not Created |
| 88 | **Create Initial Migrations** | Generate migrations for all apps | Task 87 | 🔴 Not Created |
| 89 | **Verify App Structure** | Test all apps load correctly | Task 88 | 🔴 Not Created |
| 90 | **Create Apps Documentation** | Document all apps and purpose | Task 89 | 🔴 Not Created |
| 91 | **Create Initial Commit** | Commit all app structure | Task 90 | 🔴 Not Created |
| 92 | **Verify Server Starts** | Run server to verify setup | Task 91 | 🔴 Not Created |

---

## Expected Final Structure

```
backend/
├── apps/
│   ├── __init__.py
│   ├── README.md
│   ├── core/
│   │   ├── __init__.py
│   │   ├── apps.py
│   │   ├── models.py
│   │   ├── admin.py
│   │   ├── urls.py
│   │   ├── views.py
│   │   ├── serializers.py
│   │   ├── constants.py
│   │   ├── exceptions.py
│   │   ├── utils/
│   │   ├── mixins/
│   │   └── tests/
│   ├── tenants/
│   │   ├── __init__.py
│   │   ├── apps.py
│   │   ├── models.py
│   │   ├── admin.py
│   │   ├── urls.py
│   │   └── tests/
│   ├── users/
│   │   ├── __init__.py
│   │   ├── apps.py
│   │   ├── models.py
│   │   ├── admin.py
│   │   ├── urls.py
│   │   └── tests/
│   ├── products/
│   ├── inventory/
│   ├── sales/
│   ├── customers/
│   ├── vendors/
│   ├── hr/
│   ├── accounting/
│   ├── webstore/
│   ├── integrations/
│   └── reports/
└── config/
    ├── settings/
    │   ├── base.py (SHARED_APPS, TENANT_APPS)
    │   └── ...
    └── urls.py (Root URL router)
```

---

## App Classification

```
┌─────────────────────────────────────────────────────┐
│                   APP CATEGORIES                    │
├─────────────────────────────────────────────────────┤
│                                                     │
│  SHARED_APPS (Public Schema):                       │
│  ┌─────────────────────────────────────────────┐   │
│  │ django_tenants                              │   │
│  │ tenants (Tenant/Domain models)              │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  TENANT_APPS (Per-Tenant Schema):                  │
│  ┌─────────────────────────────────────────────┐   │
│  │ core          │ users        │ products    │   │
│  │ inventory     │ sales        │ customers   │   │
│  │ vendors       │ hr           │ accounting  │   │
│  │ webstore      │ integrations │ reports     │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## Progress Tracking

| Metric | Count |
|--------|-------|
| Total Tasks | 92 |
| Tasks Completed | 0 |
| Tasks In Progress | 0 |
| Tasks Not Started | 92 |

**Last Updated:** 2026-01-17  
**Current Status:** Ready for task document creation

---

## Notes for AI Agents

1. **Execution Order:** Complete Group A before B, etc.
2. **App Structure:** Each app follows same directory structure
3. **Naming Convention:** Lowercase, singular names (user not users exception)
4. **Registration Order:** Matters for Django migrations
5. **SHARED_APPS vs TENANT_APPS:** Critical for multi-tenancy
6. **No Code Yet:** Only structure, placeholders for models
7. **Testing:** Verify server starts after each major group
8. **Documentation:** Update README for each app
9. **Django startapp:** Can use template but customize
