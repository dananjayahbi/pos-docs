# Phase 02: Database Architecture & Multi-Tenancy - Sub-Phases Summary

> **Phase Index:** 02 of 10  
> **Phase Goal:** Design and implement PostgreSQL schema isolation with django-tenants  
> **Total Sub-Phases:** 10 | **Status:** Planning

---

## Navigation

- **↑ Parent:** [00_PHASES_SUMMARY.md](../00_PHASES_SUMMARY.md)
- **← Previous Phase:** [Phase-01](../Phase-01_Project-Foundation-Setup/)
- **→ Next Phase:** [Phase-03](../Phase-03_Core-Backend-Infrastructure/)

---

## Phase Overview

This phase implements the core multi-tenancy architecture that enables a single codebase to serve unlimited businesses with complete data isolation. This is the most critical architectural decision of the entire platform.

### Key Outcomes
- PostgreSQL configured with schema-based isolation
- django-tenants fully integrated
- Public schema for shared data (platform-level)
- Tenant schema template for isolated business data
- Tenant resolution middleware working
- Database migration strategy defined

---

## Sub-Phase Index

| # | Sub-Phase Name | Description | Tasks | Status |
|---|----------------|-------------|-------|--------|
| 01 | **PostgreSQL Configuration** | Configure PostgreSQL for multi-schema support, connection pooling, and performance | TBD | 🔴 Not Created |
| 02 | **Django-Tenants Installation** | Install and configure django-tenants package with proper settings | TBD | 🔴 Not Created |
| 03 | **Public Schema Design** | Design shared tables (Tenant registry, plans, platform settings) | TBD | 🔴 Not Created |
| 04 | **Tenant Model & Domain Model** | Create Tenant and Domain models for tenant registration and domain mapping | TBD | 🔴 Not Created |
| 05 | **Tenant Schema Template** | Design the base schema structure that each tenant will have | TBD | 🔴 Not Created |
| 06 | **Tenant Middleware Configuration** | Set up tenant resolution middleware (subdomain, custom domain) | TBD | 🔴 Not Created |
| 07 | **Database Router Setup** | Configure database routers for proper query routing | TBD | 🔴 Not Created |
| 08 | **Migration Strategy** | Define migration approach for shared vs tenant-specific apps | TBD | 🔴 Not Created |
| 09 | **Tenant Provisioning Flow** | Create automated tenant creation with schema setup | TBD | 🔴 Not Created |
| 10 | **Testing Multi-Tenancy** | Create test utilities for multi-tenant testing | TBD | 🔴 Not Created |

---

## Sub-Phase Details

### SubPhase-01: PostgreSQL Configuration
**Goal:** Configure PostgreSQL database optimized for multi-tenant schema isolation.

**Key Tasks:**
- PostgreSQL 15+ installation/configuration
- Configure connection pooling (PgBouncer)
- Set up schema search path defaults
- Configure max connections
- Set up database backups strategy

**Dependencies:** Phase-01 (Docker setup)

---

### SubPhase-02: Django-Tenants Installation
**Goal:** Install and configure django-tenants as the multi-tenancy solution.

**Key Tasks:**
- Install django-tenants package
- Configure DATABASES settings
- Set DATABASE_ROUTERS
- Configure TENANT_MODEL and TENANT_DOMAIN_MODEL
- Set up SHARED_APPS vs TENANT_APPS

**Dependencies:** SubPhase-01

---

### SubPhase-03: Public Schema Design
**Goal:** Design the shared public schema for platform-wide data.

**Public Schema Tables:**
```
public/
├── tenants              # Tenant registry
├── domains              # Domain mappings
├── subscription_plans   # Available plans
├── platform_settings    # Global settings
├── platform_users       # Super admin users
└── feature_flags        # Platform feature toggles
```

**Dependencies:** SubPhase-02

---

### SubPhase-04: Tenant Model & Domain Model
**Goal:** Create the core models for tenant management.

**Key Models:**
- `Tenant` - Business registration, plan, settings
- `Domain` - Domain/subdomain mapping to tenant
- Support for multiple domains per tenant
- Custom domain CNAME support

**Dependencies:** SubPhase-03

---

### SubPhase-05: Tenant Schema Template
**Goal:** Define the complete schema template that each tenant receives.

**Tenant Schema Structure:**
```
tenant_xxx/
├── products            # Product catalog
├── inventory           # Stock management
├── customers           # Customer database
├── orders              # Order management
├── invoices            # Billing documents
├── employees           # Staff management
├── accounting          # Financial records
├── settings            # Tenant-specific settings
└── ...
```

**Dependencies:** SubPhase-04

---

### SubPhase-06: Tenant Middleware Configuration
**Goal:** Set up request middleware for automatic tenant resolution.

**Resolution Methods:**
1. Subdomain: `shop-a.lankacommerce.lk` → Tenant A
2. Custom Domain: `www.shop-a.com` → Tenant A
3. Header-based: `X-Tenant-ID` for API calls

**Dependencies:** SubPhase-04

---

### SubPhase-07: Database Router Setup
**Goal:** Configure routers to direct queries to correct schema.

**Key Tasks:**
- Create TenantSyncRouter
- Handle cross-schema queries prevention
- Configure read replica routing (future)
- Set up connection reuse

**Dependencies:** SubPhase-06

---

### SubPhase-08: Migration Strategy
**Goal:** Define how database migrations work in multi-tenant setup.

**Migration Types:**
- Public schema migrations (shared apps)
- Tenant schema migrations (business apps)
- Zero-downtime migration approach
- Migration rollback strategy

**Dependencies:** SubPhase-05, SubPhase-07

---

### SubPhase-09: Tenant Provisioning Flow
**Goal:** Automate the complete tenant onboarding process.

**Provisioning Steps:**
1. Create tenant record in public schema
2. Create tenant schema
3. Run tenant migrations
4. Seed default data (categories, settings)
5. Set up domain mapping
6. Send welcome email

**Dependencies:** SubPhase-08

---

### SubPhase-10: Testing Multi-Tenancy
**Goal:** Create testing utilities for multi-tenant scenarios.

**Test Utilities:**
- TenantTestCase base class
- Fixtures for multi-tenant testing
- Schema isolation verification tests
- Cross-tenant data leak tests
- Performance benchmarks

**Dependencies:** SubPhase-09

---

## Progress Tracking

| Metric | Count |
|--------|-------|
| Total Sub-Phases | 10 |
| Sub-Phases Created | 0 |
| Task Documents Created | 0 |

**Last Updated:** 2026-01-17  
**Current Status:** Awaiting approval to create Sub-Phase folders

---

## Execution Order

```
SubPhase-01 (PostgreSQL)
       │
       └──→ SubPhase-02 (Django-Tenants)
                   │
                   └──→ SubPhase-03 (Public Schema)
                               │
                               └──→ SubPhase-04 (Tenant/Domain Models)
                                           │
                                           ├──→ SubPhase-05 (Tenant Schema)
                                           │           │
                                           │           └──→ SubPhase-08 (Migrations)
                                           │                       │
                                           │                       └──→ SubPhase-09 (Provisioning)
                                           │                                   │
                                           │                                   └──→ SubPhase-10 (Testing)
                                           │
                                           └──→ SubPhase-06 (Middleware)
                                                       │
                                                       └──→ SubPhase-07 (Routers)
```

---

## Critical Considerations

### Data Isolation Requirements
- **CRITICAL:** Tenant data must NEVER leak across schemas
- All queries must be schema-scoped
- Admin queries must explicitly specify schema
- Logging must include tenant context

### Performance Considerations
- Connection pooling is essential at scale
- Schema count limits (PostgreSQL handles 10,000+ schemas)
- Consider read replicas for heavy read tenants

---

## Next Steps

1. ✅ Sub-Phases Summary Document Created (This file)
2. ⏳ Awaiting user review via flow.py
3. ⏳ Create 10 Sub-Phase folders
4. ⏳ Create Task summary for each Sub-Phase
5. ⏳ Create individual Task documents

---

*AI Agents: This phase is foundational. Ensure complete understanding of multi-tenancy before proceeding.*
