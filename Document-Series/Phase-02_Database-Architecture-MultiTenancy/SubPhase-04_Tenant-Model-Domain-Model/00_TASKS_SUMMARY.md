# SubPhase 04: Tenant Model & Domain Model - Tasks Summary

> **Phase:** 02 - Database Architecture & Multi-Tenancy  
> **SubPhase Index:** 04 of 10  
> **SubPhase Goal:** Create the core models for tenant management  
> **Total Tasks:** 88 | **Status:** Planning  
> **Estimated Duration:** 5-6 hours

---

## Navigation

- **↑ Parent:** [00_SUBPHASES_SUMMARY.md](../00_SUBPHASES_SUMMARY.md)
- **← Previous SubPhase:** [SubPhase-03_Public-Schema-Design](../SubPhase-03_Public-Schema-Design/)
- **→ Next SubPhase:** [SubPhase-05_Tenant-Schema-Template](../SubPhase-05_Tenant-Schema-Template/)

---

## SubPhase Overview

This sub-phase creates the core Tenant and Domain models that power the multi-tenant architecture. These models handle business registration, subscription management, domain mapping, and tenant configuration.

### Key Outcomes
- Tenant model with all business fields
- Domain model with subdomain/custom domain support
- Multiple domains per tenant capability
- Custom domain CNAME verification
- Tenant subscription management
- Tenant settings and configuration
- Admin interfaces for tenant management

### Key Models
- **Tenant** - Business registration, plan, settings
- **Domain** - Domain/subdomain mapping to tenant
- **TenantSettings** - Per-tenant configuration
- **TenantSubscription** - Active subscription tracking

### Dependencies
- **Requires:** SubPhase-03 (Public Schema Design)
- **SubscriptionPlan model must exist in public schema**

---

## Task Execution Order

```
TASK GROUP A: Tenant Model Foundation (Tasks 01-16)
        │
        ▼
TASK GROUP B: Tenant Business Information (Tasks 17-30)
        │
        ▼
TASK GROUP C: Domain Model Implementation (Tasks 31-46)
        │
        ▼
TASK GROUP D: Tenant Settings Model (Tasks 47-58)
        │
        ▼
TASK GROUP E: Tenant Subscription Tracking (Tasks 59-72)
        │
        ▼
TASK GROUP F: Admin & Management (Tasks 73-88)
```

---

## Task Index

### Group A: Tenant Model Foundation (Tasks 01-16)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 01 | **Extend TenantMixin** | Create Tenant model extending TenantMixin | SubPhase-03 | 🔴 Not Created |
| 02 | **Add Schema Name Field** | PostgreSQL schema name | Task 01 | 🔴 Not Created |
| 03 | **Add Name Field** | Business/organization name | Task 01 | 🔴 Not Created |
| 04 | **Add Slug Field** | URL-safe unique identifier | Task 01 | 🔴 Not Created |
| 05 | **Add Created At Field** | Timestamp for tenant creation | Task 01 | 🔴 Not Created |
| 06 | **Add Updated At Field** | Timestamp for last update | Task 01 | 🔴 Not Created |
| 07 | **Add Is Active Field** | Tenant activation status | Task 01 | 🔴 Not Created |
| 08 | **Add Is Suspended Field** | Suspension status flag | Task 01 | 🔴 Not Created |
| 09 | **Add Suspended Reason Field** | Reason for suspension | Task 08 | 🔴 Not Created |
| 10 | **Add Auto Create Schema** | Set auto_create_schema = True | Task 01 | 🔴 Not Created |
| 11 | **Add Auto Drop Schema** | Set auto_drop_schema = False | Task 01 | 🔴 Not Created |
| 12 | **Define Meta Class** | Verbose names, ordering | Task 01 | 🔴 Not Created |
| 13 | **Define __str__ Method** | String representation | Task 12 | 🔴 Not Created |
| 14 | **Create Model Manager** | Custom TenantManager | Task 01 | 🔴 Not Created |
| 15 | **Add Active Queryset** | Filter active tenants | Task 14 | 🔴 Not Created |
| 16 | **Add Suspended Queryset** | Filter suspended tenants | Task 14 | 🔴 Not Created |

---

### Group B: Tenant Business Information (Tasks 17-30)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 17 | **Add Business Type Field** | Business category (retail, wholesale, etc.) | Task 01 | 🔴 Not Created |
| 18 | **Add Business Registration** | BR number field (Sri Lanka) | Task 01 | 🔴 Not Created |
| 19 | **Add Tax ID Field** | VAT/Tax registration number | Task 01 | 🔴 Not Created |
| 20 | **Add Contact Email** | Primary business email | Task 01 | 🔴 Not Created |
| 21 | **Add Contact Phone** | Primary business phone | Task 01 | 🔴 Not Created |
| 22 | **Add Address Line 1** | Street address | Task 01 | 🔴 Not Created |
| 23 | **Add Address Line 2** | Additional address info | Task 01 | 🔴 Not Created |
| 24 | **Add City Field** | City name | Task 01 | 🔴 Not Created |
| 25 | **Add Province Field** | Sri Lankan province choices | Task 01 | 🔴 Not Created |
| 26 | **Add Postal Code** | Postal/ZIP code | Task 01 | 🔴 Not Created |
| 27 | **Add Logo Field** | Business logo upload | Task 01 | 🔴 Not Created |
| 28 | **Add Timezone Field** | Tenant timezone setting | Task 01 | 🔴 Not Created |
| 29 | **Add Currency Field** | Default currency (LKR) | Task 01 | 🔴 Not Created |
| 30 | **Add Locale Field** | Language/locale preference | Task 01 | 🔴 Not Created |

---

### Group C: Domain Model Implementation (Tasks 31-46)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 31 | **Extend DomainMixin** | Create Domain model extending DomainMixin | Task 16 | 🔴 Not Created |
| 32 | **Add Tenant FK** | Foreign key to Tenant model | Task 31 | 🔴 Not Created |
| 33 | **Add Domain Name Field** | Full domain string | Task 31 | 🔴 Not Created |
| 34 | **Add Is Primary Field** | Mark as primary domain | Task 31 | 🔴 Not Created |
| 35 | **Add Is Verified Field** | Domain ownership verified | Task 31 | 🔴 Not Created |
| 36 | **Add Verification Token** | Token for DNS verification | Task 35 | 🔴 Not Created |
| 37 | **Add Verified At Field** | Verification timestamp | Task 35 | 🔴 Not Created |
| 38 | **Add Domain Type Field** | Subdomain vs custom domain | Task 31 | 🔴 Not Created |
| 39 | **Add SSL Enabled Field** | SSL certificate status | Task 31 | 🔴 Not Created |
| 40 | **Add SSL Expires At** | Certificate expiry date | Task 39 | 🔴 Not Created |
| 41 | **Add Created At Field** | Domain creation timestamp | Task 31 | 🔴 Not Created |
| 42 | **Define Meta Class** | Unique constraints, ordering | Task 31 | 🔴 Not Created |
| 43 | **Define __str__ Method** | String representation | Task 42 | 🔴 Not Created |
| 44 | **Create Domain Manager** | Custom DomainManager | Task 31 | 🔴 Not Created |
| 45 | **Add Verified Queryset** | Filter verified domains | Task 44 | 🔴 Not Created |
| 46 | **Add Custom Domain Queryset** | Filter custom domains | Task 44 | 🔴 Not Created |

---

### Group D: Tenant Settings Model (Tasks 47-58)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 47 | **Create TenantSettings Model** | Per-tenant configuration model | Task 16 | 🔴 Not Created |
| 48 | **Add Tenant OneToOne** | One-to-one link to Tenant | Task 47 | 🔴 Not Created |
| 49 | **Add Theme Color Field** | Brand primary color | Task 47 | 🔴 Not Created |
| 50 | **Add Invoice Prefix Field** | Invoice number prefix | Task 47 | 🔴 Not Created |
| 51 | **Add Order Prefix Field** | Order number prefix | Task 47 | 🔴 Not Created |
| 52 | **Add Tax Rate Field** | Default tax percentage | Task 47 | 🔴 Not Created |
| 53 | **Add Invoice Footer Field** | Custom invoice footer text | Task 47 | 🔴 Not Created |
| 54 | **Add Receipt Footer Field** | Custom receipt footer text | Task 47 | 🔴 Not Created |
| 55 | **Add Notification Settings** | JSONField for notifications | Task 47 | 🔴 Not Created |
| 56 | **Add Feature Settings** | JSONField for feature toggles | Task 47 | 🔴 Not Created |
| 57 | **Add Integration Settings** | JSONField for third-party integrations | Task 47 | 🔴 Not Created |
| 58 | **Create Settings Signal** | Auto-create on tenant creation | Task 47 | 🔴 Not Created |

---

### Group E: Tenant Subscription Tracking (Tasks 59-72)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 59 | **Create TenantSubscription Model** | Subscription tracking model | Task 16 | 🔴 Not Created |
| 60 | **Add Tenant FK** | Foreign key to Tenant | Task 59 | 🔴 Not Created |
| 61 | **Add Plan FK** | Foreign key to SubscriptionPlan | Task 59 | 🔴 Not Created |
| 62 | **Add Status Field** | Active, trial, expired, cancelled | Task 59 | 🔴 Not Created |
| 63 | **Add Billing Cycle Field** | Monthly or annual | Task 59 | 🔴 Not Created |
| 64 | **Add Started At Field** | Subscription start date | Task 59 | 🔴 Not Created |
| 65 | **Add Expires At Field** | Subscription expiry date | Task 59 | 🔴 Not Created |
| 66 | **Add Trial Ends At Field** | Trial period end date | Task 59 | 🔴 Not Created |
| 67 | **Add Next Billing Date** | Next payment due date | Task 59 | 🔴 Not Created |
| 68 | **Add Amount Field** | Current billing amount | Task 59 | 🔴 Not Created |
| 69 | **Add Payment Method** | Stored payment method ID | Task 59 | 🔴 Not Created |
| 70 | **Add Is Auto Renew Field** | Auto-renewal enabled | Task 59 | 🔴 Not Created |
| 71 | **Create Subscription Manager** | Custom manager with helpers | Task 59 | 🔴 Not Created |
| 72 | **Add Active/Expired Querysets** | Filter by subscription status | Task 71 | 🔴 Not Created |

---

### Group F: Admin & Management (Tasks 73-88)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 73 | **Create TenantAdmin** | Admin for Tenant model | Task 30 | 🔴 Not Created |
| 74 | **Add List Display** | Columns in admin list | Task 73 | 🔴 Not Created |
| 75 | **Add List Filters** | Filter by status, plan, etc. | Task 73 | 🔴 Not Created |
| 76 | **Add Search Fields** | Search by name, slug, email | Task 73 | 🔴 Not Created |
| 77 | **Add Fieldsets** | Organize form sections | Task 73 | 🔴 Not Created |
| 78 | **Add Inline Domains** | Manage domains inline | Task 73, 46 | 🔴 Not Created |
| 79 | **Add Inline Settings** | Manage settings inline | Task 73, 58 | 🔴 Not Created |
| 80 | **Create DomainAdmin** | Admin for Domain model | Task 46 | 🔴 Not Created |
| 81 | **Add Domain Verification Action** | Bulk verify domains | Task 80 | 🔴 Not Created |
| 82 | **Create Tenant Actions** | Suspend, activate, delete | Task 73 | 🔴 Not Created |
| 83 | **Create Export Action** | Export tenants to CSV | Task 73 | 🔴 Not Created |
| 84 | **Create Migrations** | Generate model migrations | Task 72 | 🔴 Not Created |
| 85 | **Review Migration SQL** | Verify generated SQL | Task 84 | 🔴 Not Created |
| 86 | **Run Shared Migrations** | Apply to public schema | Task 85 | 🔴 Not Created |
| 87 | **Create Test Tenants** | Create sample test tenants | Task 86 | 🔴 Not Created |
| 88 | **Create Initial Commit** | Commit tenant/domain models | Task 87 | 🔴 Not Created |

---

## Expected Final Structure

```
backend/
├── apps/
│   └── tenants/
│       ├── __init__.py
│       ├── apps.py
│       ├── admin.py
│       ├── models/
│       │   ├── __init__.py
│       │   ├── tenant.py
│       │   ├── domain.py
│       │   ├── settings.py
│       │   └── subscription.py
│       ├── managers/
│       │   ├── __init__.py
│       │   ├── tenant_manager.py
│       │   └── domain_manager.py
│       ├── signals.py
│       └── migrations/
│           ├── __init__.py
│           └── 0001_initial.py
└── docs/
    └── tenants/
        ├── tenant-model.md
        ├── domain-model.md
        └── subscription-tracking.md
```

---

## Model Relationships

```
SubscriptionPlan (platform app)
        │
        ▼ FK
TenantSubscription ◄──── Tenant ────► TenantSettings
                           │            (OneToOne)
                           │
                           ▼ FK
                        Domain (multiple)
```

---

## Progress Tracking

| Metric | Count |
|--------|-------|
| Total Tasks | 88 |
| Tasks Completed | 0 |
| Tasks In Progress | 0 |
| Tasks Not Started | 88 |

**Last Updated:** 2026-01-17  
**Current Status:** Ready for task document creation

---

## Notes for AI Agents

1. **Execution Order:** Complete Group A before B, etc.
2. **TenantMixin Required:** Tenant must extend TenantMixin
3. **DomainMixin Required:** Domain must extend DomainMixin
4. **Schema Naming:** Use tenant_<slug> pattern for schema names
5. **Multiple Domains:** Each tenant can have multiple domains
6. **Primary Domain:** One domain must be marked as primary
7. **Custom Domain CNAME:** Verify custom domains via DNS
8. **Sri Lankan Context:** Include province choices, LKR currency
9. **Signals:** Auto-create TenantSettings when Tenant created
