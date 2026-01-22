# Tasks 61-65: Business Module Placeholders Part 2 & INSTALLED_APPS

> **Phase:** 01 - Project Foundation & Setup  
> **SubPhase:** 02 - Backend Project Initialization  
> **Group:** E - Django Apps Directory Setup  
> **Document:** 03 of 03  
> **Tasks Covered:** 61, 62, 63, 64, 65

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [02_Tasks-55-60_Business-Placeholders-1.md](02_Tasks-55-60_Business-Placeholders-1.md)
- **→ Next Document:** [../Group-F_ASGI-Server-Configuration/00_GROUP_OVERVIEW.md](../Group-F_ASGI-Server-Configuration/00_GROUP_OVERVIEW.md)

---

## Document Overview

This document covers creating remaining placeholder apps (accounting, webstore, integrations, reports) and updating INSTALLED_APPS with all applications.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 61 | Create apps/accounting/ Placeholder | Simple |
| 62 | Create apps/webstore/ Placeholder | Simple |
| 63 | Create apps/integrations/ Placeholder | Simple |
| 64 | Create apps/reports/ Placeholder | Simple |
| 65 | Update INSTALLED_APPS | Medium |

---

## Task 61: Create apps/accounting/ Placeholder

### Overview
Create placeholder for the accounting app (chart of accounts, journals, financial reports).

### Dependencies
- Task 51: Create apps/ Package

### Instructions

1. **Create accounting directory**
   - Create apps/accounting/ directory

2. **Create __init__.py**
   - Add docstring describing app purpose

3. **Create apps.py**
   - Minimal AppConfig class

### __init__.py Content

```python
"""
Accounting Application.

Handles financial management including:
- Chart of accounts
- General ledger journals
- Accounts payable/receivable
- Financial reporting

Developed in: Phase 6 - ERP Advanced Modules
"""
```

### apps.py Content

| Setting | Value |
|---------|-------|
| `name` | 'apps.accounting' |
| `label` | 'accounting' |
| `verbose_name` | 'Accounting & Finance' |

### Future Development Preview

| Module | Purpose |
|--------|---------|
| Account | Chart of accounts |
| JournalEntry | Double-entry journals |
| Invoice | AP/AR tracking |
| FinancialReport | P&L, balance sheet |

### Sri Lanka Specific

| Feature | Description |
|---------|-------------|
| Currency | LKR as base currency |
| VAT | Sri Lankan tax codes |
| Fiscal Year | Configurable per tenant |

### Expected Outcome
- Accounting app placeholder created
- Ready for Phase 6 development

### Verification Checklist
- [ ] apps/accounting/ directory created
- [ ] __init__.py with docstring
- [ ] apps.py with AppConfig

---

## Task 62: Create apps/webstore/ Placeholder

### Overview
Create placeholder for the webstore app (e-commerce storefront API).

### Dependencies
- Task 51: Create apps/ Package

### Instructions

1. **Create webstore directory**
   - Create apps/webstore/ directory

2. **Create __init__.py**
   - Add docstring describing app purpose

3. **Create apps.py**
   - Minimal AppConfig class

### __init__.py Content

```python
"""
Webstore Application.

Handles e-commerce storefront including:
- Public product catalog API
- Shopping cart management
- Checkout and payments
- Customer self-service

Developed in: Phase 8 - Webstore E-commerce Platform
"""
```

### apps.py Content

| Setting | Value |
|---------|-------|
| `name` | 'apps.webstore' |
| `label` | 'webstore' |
| `verbose_name` | 'E-commerce Webstore' |

### Future Development Preview

| Module | Purpose |
|--------|---------|
| Cart | Shopping cart |
| Checkout | Order placement |
| WebstoreConfig | Per-tenant store settings |
| PaymentGateway | Payment integrations |

### Next.js Integration

| Feature | API Endpoint |
|---------|--------------|
| Product listing | /api/v1/store/products/ |
| Cart | /api/v1/store/cart/ |
| Checkout | /api/v1/store/checkout/ |

### Expected Outcome
- Webstore app placeholder created
- Ready for Phase 8 development

### Verification Checklist
- [ ] apps/webstore/ directory created
- [ ] __init__.py with docstring
- [ ] apps.py with AppConfig

---

## Task 63: Create apps/integrations/ Placeholder

### Overview
Create placeholder for the integrations app (third-party service integrations).

### Dependencies
- Task 51: Create apps/ Package

### Instructions

1. **Create integrations directory**
   - Create apps/integrations/ directory

2. **Create __init__.py**
   - Add docstring describing app purpose

3. **Create apps.py**
   - Minimal AppConfig class

### __init__.py Content

```python
"""
Integrations Application.

Handles third-party integrations including:
- Payment gateways (PayHere, Dialog, etc.)
- SMS providers (Dialog, Mobitel)
- Email services
- Shipping providers

Developed in: Phase 9 - Integrations & Sri Lanka Localizations
"""
```

### apps.py Content

| Setting | Value |
|---------|-------|
| `name` | 'apps.integrations' |
| `label` | 'integrations' |
| `verbose_name` | 'Third-Party Integrations' |

### Future Development Preview

| Module | Purpose |
|--------|---------|
| PaymentProvider | Payment gateway abstraction |
| SMSProvider | SMS notifications |
| EmailProvider | Transactional emails |
| WebhookHandler | Incoming webhooks |

### Sri Lanka Integrations

| Service | Type |
|---------|------|
| PayHere | Payment gateway |
| Dialog | SMS, mobile payments |
| Mobitel | SMS |
| Lanka Clear | Bank integrations |

### Expected Outcome
- Integrations app placeholder created
- Ready for Phase 9 development

### Verification Checklist
- [ ] apps/integrations/ directory created
- [ ] __init__.py with docstring
- [ ] apps.py with AppConfig

---

## Task 64: Create apps/reports/ Placeholder

### Overview
Create placeholder for the reports app (reporting and analytics).

### Dependencies
- Task 51: Create apps/ Package

### Instructions

1. **Create reports directory**
   - Create apps/reports/ directory

2. **Create __init__.py**
   - Add docstring describing app purpose

3. **Create apps.py**
   - Minimal AppConfig class

### __init__.py Content

```python
"""
Reports Application.

Handles reporting and analytics including:
- Sales reports and dashboards
- Inventory reports
- Financial statements
- Custom report builder

Developed in: Phase 6 - ERP Advanced Modules
"""
```

### apps.py Content

| Setting | Value |
|---------|-------|
| `name` | 'apps.reports' |
| `label` | 'reports' |
| `verbose_name` | 'Reports & Analytics' |

### Future Development Preview

| Module | Purpose |
|--------|---------|
| Report | Report definitions |
| ReportSchedule | Scheduled reports |
| Dashboard | Dashboard widgets |
| Export | PDF, Excel, CSV |

### Report Types

| Category | Examples |
|----------|----------|
| Sales | Daily sales, top products |
| Inventory | Stock levels, movements |
| Financial | P&L, cash flow |
| HR | Attendance, payroll |

### Expected Outcome
- Reports app placeholder created
- Ready for Phase 6 development

### Verification Checklist
- [ ] apps/reports/ directory created
- [ ] __init__.py with docstring
- [ ] apps.py with AppConfig

---

## Task 65: Update INSTALLED_APPS

### Overview
Register all Django applications in the INSTALLED_APPS setting with proper categorization.

### Dependencies
- Tasks 52-64: All app placeholders created

### Instructions

1. **Open config/settings/base.py**
   - Navigate to INSTALLED_APPS section

2. **Define LOCAL_APPS list**
   - Add all apps under apps/ directory
   - Group by category

3. **Combine INSTALLED_APPS**
   - DJANGO_APPS + THIRD_PARTY_APPS + LOCAL_APPS

4. **Verify order**
   - Django apps first
   - Third-party apps second
   - Local apps last

5. **Set AUTH_USER_MODEL**
   - Point to custom user model

### LOCAL_APPS Structure

```python
LOCAL_APPS = [
    # Core Framework
    'apps.core',
    'apps.tenants',
    'apps.users',
    
    # Business Modules - Phase 4
    'apps.products',
    'apps.inventory',
    'apps.vendors',
    
    # Business Modules - Phase 5
    'apps.sales',
    'apps.customers',
    
    # Advanced Modules - Phase 6
    'apps.hr',
    'apps.accounting',
    'apps.reports',
    
    # Platform Apps
    'apps.webstore',
    'apps.integrations',
]
```

### Complete INSTALLED_APPS

```python
INSTALLED_APPS = DJANGO_APPS + THIRD_PARTY_APPS + LOCAL_APPS
```

### AUTH_USER_MODEL Setting

Add to base.py:

| Setting | Value |
|---------|-------|
| `AUTH_USER_MODEL` | 'users.User' |

**Important:** Must be set before first migration.

### Multi-Tenancy Configuration

Add to base.py for django-tenants:

| Setting | Value |
|---------|-------|
| `TENANT_MODEL` | 'tenants.Tenant' |
| `TENANT_DOMAIN_MODEL` | 'tenants.Domain' |

### Shared vs Tenant Apps

For django-tenants (configure later):

| Setting | Apps |
|---------|------|
| `SHARED_APPS` | Core, tenants, users (public schema) |
| `TENANT_APPS` | Business modules (tenant schemas) |

### Expected Outcome
- All apps registered
- AUTH_USER_MODEL configured
- Ready for migrations

### Verification Checklist
- [ ] LOCAL_APPS defined
- [ ] INSTALLED_APPS combined correctly
- [ ] AUTH_USER_MODEL set
- [ ] TENANT_MODEL noted for later
- [ ] Order: Django → Third-party → Local

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 61 | Create apps/accounting/ Placeholder | Financial management |
| 62 | Create apps/webstore/ Placeholder | E-commerce API |
| 63 | Create apps/integrations/ Placeholder | Third-party services |
| 64 | Create apps/reports/ Placeholder | Analytics & reporting |
| 65 | Update INSTALLED_APPS | All apps registered |

### Final Apps Directory Structure

```
backend/apps/
├── __init__.py
├── core/              (full structure - Phase 1)
├── tenants/           (full structure - Phase 1)
├── users/             (full structure - Phase 1)
├── products/          (placeholder - Phase 4)
├── inventory/         (placeholder - Phase 4)
├── vendors/           (placeholder - Phase 4)
├── sales/             (placeholder - Phase 5)
├── customers/         (placeholder - Phase 5)
├── hr/                (placeholder - Phase 6)
├── accounting/        (placeholder - Phase 6)
├── reports/           (placeholder - Phase 6)
├── webstore/          (placeholder - Phase 8)
└── integrations/      (placeholder - Phase 9)
```

### App Count Summary

| Category | Count | Apps |
|----------|-------|------|
| Core | 3 | core, tenants, users |
| Phase 4 | 3 | products, inventory, vendors |
| Phase 5 | 2 | sales, customers |
| Phase 6 | 3 | hr, accounting, reports |
| Phase 8 | 1 | webstore |
| Phase 9 | 1 | integrations |
| **Total** | **13** | |

### Git Commit Message
```
feat(apps): create Django app structure

- Create apps package with core, tenants, users apps
- Add placeholders for all business modules
- Register all apps in INSTALLED_APPS
- Set AUTH_USER_MODEL configuration

SubPhase-02 Group E complete
```

### Next Steps
Proceed to [Group F](../Group-F_ASGI-Server-Configuration/00_GROUP_OVERVIEW.md) for ASGI server configuration.

---

## Notes for AI Agents

1. **App Registration:** All apps must be in LOCAL_APPS
2. **AUTH_USER_MODEL:** Critical - must be set before migrations
3. **Placeholder Structure:** Only __init__.py and apps.py needed
4. **Order:** Django → Third-party → Local apps
5. **Git:** Commit after completing Group E
