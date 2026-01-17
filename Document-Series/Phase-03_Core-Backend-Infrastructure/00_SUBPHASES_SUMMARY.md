# Phase 03: Core Backend Infrastructure - Sub-Phases Summary

> **Phase Index:** 03 of 10  
> **Phase Goal:** Build the foundational Django backend with API architecture and authentication  
> **Total Sub-Phases:** 12 | **Status:** Planning

---

## Navigation

- **↑ Parent:** [00_PHASES_SUMMARY.md](../00_PHASES_SUMMARY.md)
- **← Previous Phase:** [Phase-02](../Phase-02_Database-Architecture-MultiTenancy/)
- **→ Next Phase:** [Phase-04](../Phase-04_ERP-Core-Modules-Part1/)

---

## Phase Overview

This phase builds the core Django backend infrastructure including API framework, authentication, permissions, and essential middleware. All business modules in subsequent phases will depend on this foundation.

### Key Outcomes
- Django project fully structured with apps
- API framework (DRF or Django Ninja) configured
- JWT authentication working
- Role-based permissions system
- All core middleware implemented
- Base models and utilities ready

---

## Sub-Phase Index

| # | Sub-Phase Name | Description | Tasks | Status |
|---|----------------|-------------|-------|--------|
| 01 | **Django Apps Structure** | Create the modular app structure for all ERP and platform modules | TBD | 🔴 Not Created |
| 02 | **API Framework Setup** | Configure Django REST Framework or Django Ninja with serializers | TBD | 🔴 Not Created |
| 03 | **Base Models & Mixins** | Create abstract base models, timestamps, soft delete, audit trails | TBD | 🔴 Not Created |
| 04 | **User Model & Authentication** | Custom user model with multi-tenant support, JWT auth | TBD | 🔴 Not Created |
| 05 | **Role & Permission System** | Implement platform hierarchy roles (Super Admin, Tenant Admin, Staff) | TBD | 🔴 Not Created |
| 06 | **Core Middleware Stack** | Implement logging, security, rate limiting, tenant context middleware | TBD | 🔴 Not Created |
| 07 | **Exception Handling** | Global exception handlers, error response format, logging | TBD | 🔴 Not Created |
| 08 | **Celery Task Queue** | Set up Celery with Redis for async task processing | TBD | 🔴 Not Created |
| 09 | **Caching Layer** | Configure Redis caching with tenant-scoped cache keys | TBD | 🔴 Not Created |
| 10 | **File Storage Configuration** | Set up media storage (local dev, S3 production) with tenant isolation | TBD | 🔴 Not Created |
| 11 | **API Documentation** | Set up OpenAPI/Swagger documentation with drf-spectacular | TBD | 🔴 Not Created |
| 12 | **Core Utilities & Helpers** | Create common utilities (pagination, filters, validators) | TBD | 🔴 Not Created |

---

## Sub-Phase Details

### SubPhase-01: Django Apps Structure
**Goal:** Create a modular, scalable Django apps architecture.

**App Structure:**
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

**Dependencies:** Phase-01, Phase-02

---

### SubPhase-02: API Framework Setup
**Goal:** Configure the REST API framework with best practices.

**Key Tasks:**
- Choose between DRF vs Django Ninja (recommend DRF for ecosystem)
- Configure default renderers (JSON)
- Set up versioning strategy (URL path: /api/v1/)
- Configure throttling defaults
- Set up CORS properly

**Dependencies:** SubPhase-01

---

### SubPhase-03: Base Models & Mixins
**Goal:** Create reusable abstract models for consistency.

**Base Models:**
- `TimeStampedModel` - created_at, updated_at
- `SoftDeleteModel` - is_deleted, deleted_at
- `AuditModel` - created_by, updated_by
- `TenantScopedModel` - automatic tenant filtering
- `UUIDModel` - UUID primary key option

**Dependencies:** SubPhase-01

---

### SubPhase-04: User Model & Authentication
**Goal:** Implement custom user model with JWT authentication.

**Key Features:**
- Custom User model (email as username)
- Multi-tenant user support (user belongs to tenant)
- JWT token authentication (access + refresh)
- Token blacklisting for logout
- Password reset flow
- Email verification

**Dependencies:** SubPhase-03

---

### SubPhase-05: Role & Permission System
**Goal:** Implement the platform hierarchy permission system.

**Role Hierarchy:**
```
Super Admin (Platform Owner)
    └── Tenant Admin (Business Owner)
            └── Manager (Department Head)
                    └── Staff (Employee)
                            └── Customer (Webstore User)
```

**Key Features:**
- Role-based access control (RBAC)
- Permission groups per module
- Tenant-scoped permissions
- API endpoint protection

**Dependencies:** SubPhase-04

---

### SubPhase-06: Core Middleware Stack
**Goal:** Implement essential middleware for the application.

**Middleware Stack:**
1. `TenantMiddleware` - Resolve and set current tenant
2. `RequestLoggingMiddleware` - Log all API requests
3. `SecurityHeadersMiddleware` - Add security headers
4. `RateLimitMiddleware` - Prevent abuse
5. `TimezoneMiddleware` - Handle tenant timezone

**Dependencies:** SubPhase-04

---

### SubPhase-07: Exception Handling
**Goal:** Create consistent error handling across the API.

**Key Tasks:**
- Custom exception classes
- Global exception handler
- Standardized error response format
- Error logging with context
- Sentry integration setup

**Error Response Format:**
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": {...},
    "request_id": "xxx-xxx"
  }
}
```

**Dependencies:** SubPhase-02

---

### SubPhase-08: Celery Task Queue
**Goal:** Set up asynchronous task processing.

**Use Cases:**
- Email sending
- Report generation
- Inventory updates
- Payment processing
- Scheduled tasks (stock alerts)

**Key Tasks:**
- Celery configuration
- Redis as broker
- Celery Beat for scheduling
- Task monitoring (Flower)
- Retry policies

**Dependencies:** SubPhase-01, Docker setup

---

### SubPhase-09: Caching Layer
**Goal:** Implement Redis caching with tenant isolation.

**Caching Strategy:**
- Tenant-scoped cache keys: `tenant:{id}:products:list`
- Cache invalidation patterns
- Session caching
- Query result caching
- Rate limit counters

**Dependencies:** SubPhase-06, Docker setup

---

### SubPhase-10: File Storage Configuration
**Goal:** Set up media file storage with tenant isolation.

**Storage Structure:**
```
/media/
├── tenant-001/
│   ├── products/
│   ├── invoices/
│   └── documents/
├── tenant-002/
│   └── ...
└── public/          # Shared assets
```

**Key Tasks:**
- Local storage for development
- S3 configuration for production
- Image optimization pipeline
- Signed URLs for private files

**Dependencies:** SubPhase-06

---

### SubPhase-11: API Documentation
**Goal:** Set up comprehensive API documentation.

**Key Tasks:**
- Install drf-spectacular
- Configure schema generation
- Set up Swagger UI endpoint
- Set up ReDoc endpoint
- Document all endpoints

**Dependencies:** SubPhase-02

---

### SubPhase-12: Core Utilities & Helpers
**Goal:** Create common utilities used across the application.

**Utilities:**
- Custom pagination classes
- Filter backends
- Common validators
- Date/time helpers
- Currency formatting (LKR)
- Phone number validation (Sri Lanka)

**Dependencies:** SubPhase-02, SubPhase-03

---

## Progress Tracking

| Metric | Count |
|--------|-------|
| Total Sub-Phases | 12 |
| Sub-Phases Created | 0 |
| Task Documents Created | 0 |

**Last Updated:** 2026-01-17  
**Current Status:** Awaiting approval to create Sub-Phase folders

---

## Execution Order

```
SubPhase-01 (Apps Structure)
       │
       ├──→ SubPhase-02 (API Framework) ──→ SubPhase-07 (Exceptions)
       │           │                              │
       │           └──→ SubPhase-11 (API Docs) ──┘
       │           │
       │           └──→ SubPhase-12 (Utilities)
       │
       ├──→ SubPhase-03 (Base Models)
       │           │
       │           └──→ SubPhase-04 (User/Auth)
       │                       │
       │                       ├──→ SubPhase-05 (Roles)
       │                       │
       │                       └──→ SubPhase-06 (Middleware)
       │                                   │
       │                                   ├──→ SubPhase-09 (Caching)
       │                                   │
       │                                   └──→ SubPhase-10 (Storage)
       │
       └──→ SubPhase-08 (Celery)
```

---

## Next Steps

1. ✅ Sub-Phases Summary Document Created (This file)
2. ⏳ Awaiting user review via flow.py
3. ⏳ Create 12 Sub-Phase folders
4. ⏳ Create Task summary for each Sub-Phase
5. ⏳ Create individual Task documents

---

*AI Agents: This phase provides the backbone for all business modules. Ensure thorough testing of auth and permissions.*
