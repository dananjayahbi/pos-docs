# LankaCommerce Cloud (LCC) - Technical Architecture & Infrastructure

> **Scalable Multi-Tenant Architecture for Enterprise-Grade SaaS**

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Multi-Tenancy Model](#2-multi-tenancy-model)
3. [Application Architecture](#3-application-architecture)
4. [Data Synchronization](#4-data-synchronization)
5. [Security Model](#5-security-model)
6. [Infrastructure & DevOps](#6-infrastructure--devops)
7. [Technology Stack](#7-technology-stack)
8. [Critical Challenges & Solutions](#8-critical-challenges--solutions)

---

## 1. Architecture Overview

LankaCommerce Cloud is built on a **modern, scalable, and secure multi-tenant architecture** that enables a single codebase to serve unlimited businesses while maintaining strict data isolation and performance.

### 1.1 High-Level System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                              SYSTEM ARCHITECTURE                                    │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                     │
│    ┌─────────────────────────────────────────────────────────────────────────┐      │
│    │                        INTERNET / CDN LAYER                             │      │
│    │                                                                         │      │
│    │   shop-a.com    shop-b.com    shop-c.com    admin.lankacommerce.lk     │      │
│    │       │             │             │                   │                 │      │
│    └───────┼─────────────┼─────────────┼───────────────────┼─────────────────┘      │
│            │             │             │                   │                        │
│            └─────────────┴──────┬──────┴───────────────────┘                        │
│                                 ▼                                                   │
│    ┌─────────────────────────────────────────────────────────────────────────┐      │
│    │                     INFRASTRUCTURE LAYER                                │      │
│    │                                                                         │      │
│    │    ┌───────────────┐         ┌───────────────────────────────┐         │      │
│    │    │ Load Balancer │────────►│ Wildcard DNS *.platform.lk    │         │      │
│    │    │   (Nginx)     │         │ + Custom Domain CNAME Support │         │      │
│    │    └───────────────┘         └───────────────────────────────┘         │      │
│    │                                                                         │      │
│    └───────────────────────────────────┬─────────────────────────────────────┘      │
│                                        ▼                                            │
│    ┌─────────────────────────────────────────────────────────────────────────┐      │
│    │                 APPLICATION CORE (Django Monolith)                      │      │
│    │                                                                         │      │
│    │    ┌─────────────────────────────────────────────────────────────┐     │      │
│    │    │        Django Auth & Tenant Middleware                       │     │      │
│    │    │        • Request Tenant Resolution                           │     │      │
│    │    │        • Permission Validation                               │     │      │
│    │    │        • Session Management                                  │     │      │
│    │    └──────────────────────────┬──────────────────────────────────┘     │      │
│    │                               │                                         │      │
│    │    ┌──────────────────────────┴──────────────────────────────────┐     │      │
│    │    │              TENANT SCOPE (Schema Isolation)                │     │      │
│    │    │                                                              │     │      │
│    │    │   ┌────────────────────┐    ┌────────────────────┐          │     │      │
│    │    │   │   ERP Business     │    │   Webstore API     │          │     │      │
│    │    │   │   Logic (DRF/Ninja)│    │   (DRF/Ninja)      │          │     │      │
│    │    │   │                    │    │                    │          │     │      │
│    │    │   │   • Products       │    │   • Catalog        │          │     │      │
│    │    │   │   • Inventory      │    │   • Cart           │          │     │      │
│    │    │   │   • Invoices       │    │   • Checkout       │          │     │      │
│    │    │   │   • HR/Payroll     │    │   • Payments       │          │     │      │
│    │    │   │   • Accounting     │    │   • Customer       │          │     │      │
│    │    │   └────────────────────┘    └────────────────────┘          │     │      │
│    │    │                                                              │     │      │
│    │    └──────────────────────────────────────────────────────────────┘     │      │
│    │                                                                         │      │
│    └───────────────────────────────────┬─────────────────────────────────────┘      │
│                                        ▼                                            │
│    ┌─────────────────────────────────────────────────────────────────────────┐      │
│    │                          DATA LAYER                                     │      │
│    │                                                                         │      │
│    │   ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐     │      │
│    │   │   PostgreSQL     │  │   Redis Cache    │  │   Object Storage │     │      │
│    │   │   (Schemas)      │  │   (Tenant Scoped)│  │   (/tenant-id/)  │     │      │
│    │   │                  │  │                  │  │                  │     │      │
│    │   │   public schema  │  │   cache:tenant1: │  │   /tenant-001/   │     │      │
│    │   │   tenant_001     │  │   cache:tenant2: │  │   /tenant-002/   │     │      │
│    │   │   tenant_002     │  │   cache:tenant3: │  │   /tenant-003/   │     │      │
│    │   │   tenant_003     │  │                  │  │                  │     │      │
│    │   └──────────────────┘  └──────────────────┘  └──────────────────┘     │      │
│    │                                                                         │      │
│    └─────────────────────────────────────────────────────────────────────────┘      │
│                                                                                     │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

### 1.2 Request Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                              REQUEST FLOW                                           │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                     │
│    Customer visits: shop-a.lankacommerce.lk/products                                │
│                            │                                                        │
│                            ▼                                                        │
│    ┌─────────────────────────────────────────┐                                      │
│    │     1. DNS Resolution                   │                                      │
│    │     *.lankacommerce.lk → Load Balancer  │                                      │
│    └────────────────────┬────────────────────┘                                      │
│                         ▼                                                           │
│    ┌─────────────────────────────────────────┐                                      │
│    │     2. Load Balancer                    │                                      │
│    │     • SSL Termination                   │                                      │
│    │     • Request Routing                   │                                      │
│    └────────────────────┬────────────────────┘                                      │
│                         ▼                                                           │
│    ┌─────────────────────────────────────────┐                                      │
│    │     3. Tenant Middleware                │                                      │
│    │     • Extract subdomain: "shop-a"       │                                      │
│    │     • Lookup tenant in public schema    │                                      │
│    │     • Set schema to: tenant_shop_a      │                                      │
│    └────────────────────┬────────────────────┘                                      │
│                         ▼                                                           │
│    ┌─────────────────────────────────────────┐                                      │
│    │     4. Django View/API                  │                                      │
│    │     • All queries auto-scoped           │                                      │
│    │     • Returns tenant-specific data      │                                      │
│    └────────────────────┬────────────────────┘                                      │
│                         ▼                                                           │
│    ┌─────────────────────────────────────────┐                                      │
│    │     5. Response                         │                                      │
│    │     • JSON API Response                 │                                      │
│    │     • Rendered to Next.js Frontend      │                                      │
│    └─────────────────────────────────────────┘                                      │
│                                                                                     │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Multi-Tenancy Model

### 2.1 Multi-Tenancy Approaches Comparison

| Approach | Description | Pros | Cons | LCC Choice |
|----------|-------------|------|------|------------|
| **Separate Databases** | Each tenant has own database | Maximum isolation | High cost, complex management | ❌ |
| **Shared Database, Separate Schemas** | Same DB, different PostgreSQL schemas | Good isolation, cost-effective | Schema management overhead | ✅ |
| **Shared Schema** | All tenants share tables with tenant_id | Simplest, lowest cost | Weakest isolation, complex queries | ❌ |

### 2.2 Schema-Based Multi-Tenancy Architecture

LankaCommerce Cloud uses **PostgreSQL Schema Isolation** via `django-tenants` library:

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                         POSTGRESQL DATABASE                                         │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                     │
│   ┌───────────────────────────────────────────────────────────────────────────┐     │
│   │                         PUBLIC SCHEMA                                     │     │
│   │                    (Shared Platform Data)                                 │     │
│   │                                                                           │     │
│   │   ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐          │     │
│   │   │ tenants         │  │ domains         │  │ subscription    │          │     │
│   │   │                 │  │                 │  │ _plans          │          │     │
│   │   │ • id            │  │ • domain        │  │                 │          │     │
│   │   │ • name          │  │ • tenant_id     │  │ • name          │          │     │
│   │   │ • schema_name   │  │ • is_primary    │  │ • price         │          │     │
│   │   │ • plan_id       │  │                 │  │ • features      │          │     │
│   │   │ • created_at    │  │                 │  │                 │          │     │
│   │   └─────────────────┘  └─────────────────┘  └─────────────────┘          │     │
│   │                                                                           │     │
│   └───────────────────────────────────────────────────────────────────────────┘     │
│                                                                                     │
│   ┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────────┐         │
│   │  TENANT_SHOP_A      │  │  TENANT_SHOP_B      │  │  TENANT_SHOP_C      │         │
│   │  SCHEMA             │  │  SCHEMA             │  │  SCHEMA             │         │
│   │                     │  │                     │  │                     │         │
│   │  ┌───────────────┐  │  │  ┌───────────────┐  │  │  ┌───────────────┐  │         │
│   │  │ products      │  │  │  │ products      │  │  │  │ products      │  │         │
│   │  │ inventory     │  │  │  │ inventory     │  │  │  │ inventory     │  │         │
│   │  │ customers     │  │  │  │ customers     │  │  │  │ customers     │  │         │
│   │  │ orders        │  │  │  │ orders        │  │  │  │ orders        │  │         │
│   │  │ invoices      │  │  │  │ invoices      │  │  │  │ invoices      │  │         │
│   │  │ employees     │  │  │  │ employees     │  │  │  │ employees     │  │         │
│   │  │ settings      │  │  │  │ settings      │  │  │  │ settings      │  │         │
│   │  │ ...           │  │  │  │ ...           │  │  │  │ ...           │  │         │
│   │  └───────────────┘  │  │  └───────────────┘  │  │  └───────────────┘  │         │
│   │                     │  │                     │  │                     │         │
│   │  100% ISOLATED      │  │  100% ISOLATED      │  │  100% ISOLATED      │         │
│   └─────────────────────┘  └─────────────────────┘  └─────────────────────┘         │
│                                                                                     │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

### 2.3 Tenant Resolution Flow

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                         TENANT RESOLUTION FLOW                                      │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                     │
│   HTTP Request: https://myshop.lankacommerce.lk/api/products                        │
│                                                                                     │
│   ┌─────────────────────────────────────────────────────────────────────────┐       │
│   │  STEP 1: Extract Domain                                                 │       │
│   │  ───────────────────────                                                │       │
│   │  Host Header: "myshop.lankacommerce.lk"                                 │       │
│   └────────────────────────────────┬────────────────────────────────────────┘       │
│                                    ▼                                                │
│   ┌─────────────────────────────────────────────────────────────────────────┐       │
│   │  STEP 2: Lookup in Public Schema                                        │       │
│   │  ───────────────────────────────                                        │       │
│   │  SELECT * FROM public.domains                                           │       │
│   │  WHERE domain = 'myshop.lankacommerce.lk'                               │       │
│   │                                                                         │       │
│   │  Result: tenant_id = 42, schema_name = 'tenant_myshop'                  │       │
│   └────────────────────────────────┬────────────────────────────────────────┘       │
│                                    ▼                                                │
│   ┌─────────────────────────────────────────────────────────────────────────┐       │
│   │  STEP 3: Set PostgreSQL Search Path                                     │       │
│   │  ────────────────────────────────────                                   │       │
│   │  SET search_path TO tenant_myshop, public;                              │       │
│   │                                                                         │       │
│   │  All subsequent queries automatically scoped to tenant schema           │       │
│   └────────────────────────────────┬────────────────────────────────────────┘       │
│                                    ▼                                                │
│   ┌─────────────────────────────────────────────────────────────────────────┐       │
│   │  STEP 4: Process Request                                                │       │
│   │  ────────────────────────                                               │       │
│   │  Product.objects.all()                                                  │       │
│   │  → SELECT * FROM tenant_myshop.products                                 │       │
│   │                                                                         │       │
│   │  Only this tenant's data is returned!                                   │       │
│   └─────────────────────────────────────────────────────────────────────────┘       │
│                                                                                     │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

### 2.4 Domain Configuration Options

| Configuration | Domain Example | Use Case |
|---------------|---------------|----------|
| **Platform Subdomain** | myshop.lankacommerce.lk | Free tier, easy setup |
| **Custom Domain (CNAME)** | www.myshop.lk | Professional branding |
| **Custom Domain (A Record)** | myshop.lk | Apex domain support |

---

## 3. Application Architecture

### 3.1 Monorepo Structure

```
lankacommerce-cloud/
├── apps/
│   ├── backend/                    # Django Application
│   │   ├── config/                 # Django settings
│   │   ├── apps/
│   │   │   ├── tenants/           # Tenant management
│   │   │   ├── products/          # Product management
│   │   │   ├── inventory/         # Stock management
│   │   │   ├── sales/             # Orders, invoices
│   │   │   ├── customers/         # Customer CRM
│   │   │   ├── hr/                # HR & Payroll
│   │   │   ├── accounting/        # Financial management
│   │   │   ├── pos/               # Point of Sale
│   │   │   ├── webstore/          # Storefront API
│   │   │   └── integrations/      # Third-party integrations
│   │   ├── api/                   # DRF/Ninja API definitions
│   │   └── manage.py
│   │
│   ├── webstore/                   # Next.js Webstore Frontend
│   │   ├── pages/                 # SSR Pages (SEO critical)
│   │   ├── components/            # React components
│   │   ├── lib/                   # Utilities
│   │   └── styles/                # CSS/Tailwind
│   │
│   └── erp/                        # Next.js ERP Dashboard
│       ├── app/                   # App router (CSR focus)
│       ├── components/            # Shadcn/UI components
│       ├── lib/                   # API clients, utilities
│       └── styles/
│
├── packages/
│   ├── shared-types/              # TypeScript types
│   ├── ui-components/             # Shared UI library
│   └── api-client/                # Generated API client
│
├── infrastructure/
│   ├── docker/                    # Docker configurations
│   ├── kubernetes/                # K8s manifests
│   └── terraform/                 # Infrastructure as code
│
└── turbo.json                     # Turborepo configuration
```

### 3.2 Backend API Architecture

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                              API ARCHITECTURE                                       │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                     │
│   ┌───────────────────────────────────────────────────────────────────────────┐     │
│   │                           API GATEWAY                                     │     │
│   │                                                                           │     │
│   │    /api/v1/erp/*     →   ERP API Endpoints (Authenticated)               │     │
│   │    /api/v1/store/*   →   Webstore API Endpoints (Public + Auth)          │     │
│   │    /api/v1/admin/*   →   Super Admin API (Platform Owner)                │     │
│   │                                                                           │     │
│   └───────────────────────────────────────────────────────────────────────────┘     │
│                                        │                                            │
│            ┌───────────────────────────┼───────────────────────────┐                │
│            ▼                           ▼                           ▼                │
│   ┌─────────────────┐       ┌─────────────────────┐       ┌─────────────────┐       │
│   │   ERP API       │       │   STORE API         │       │   ADMIN API     │       │
│   │                 │       │                     │       │                 │       │
│   │ /products       │       │ /catalog            │       │ /tenants        │       │
│   │ /inventory      │       │ /cart               │       │ /subscriptions  │       │
│   │ /orders         │       │ /checkout           │       │ /billing        │       │
│   │ /customers      │       │ /payments           │       │ /analytics      │       │
│   │ /invoices       │       │ /account            │       │ /broadcasts     │       │
│   │ /hr             │       │ /wishlist           │       │ /maintenance    │       │
│   │ /accounting     │       │ /orders             │       │                 │       │
│   │ /reports        │       │                     │       │                 │       │
│   └─────────────────┘       └─────────────────────┘       └─────────────────┘       │
│                                                                                     │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

### 3.3 Frontend Architecture

| Application | Framework | Rendering | Focus |
|-------------|-----------|-----------|-------|
| **Webstore** | Next.js (React) | SSR (Server-Side Rendering) | SEO, Performance |
| **ERP Dashboard** | Next.js (React) | CSR (Client-Side Rendering) | Interactivity, Speed |
| **Super Admin** | Django Admin + Custom | Server-Rendered | Simplicity, Security |

### 3.4 Component Library

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                            UI COMPONENT STACK                                       │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                     │
│   ┌───────────────────────────────────────────────────────────────────────────┐     │
│   │                         SHADCN/UI                                         │     │
│   │                    (Base Component Library)                               │     │
│   │                                                                           │     │
│   │   • Button       • DataTable     • Dialog       • Dropdown               │     │
│   │   • Input        • Select        • Tabs         • Toast                  │     │
│   │   • Card         • Form          • Modal        • Sidebar                │     │
│   │                                                                           │     │
│   └───────────────────────────────────────────────────────────────────────────┘     │
│                                        │                                            │
│                                        ▼                                            │
│   ┌───────────────────────────────────────────────────────────────────────────┐     │
│   │                     LUCIDE-REACT ICONS                                    │     │
│   │                  (Consistent Icon Library)                                │     │
│   │                                                                           │     │
│   │   📦 Package     📊 Chart      🛒 Cart       💳 CreditCard               │     │
│   │   👥 Users       📋 FileText   🔔 Bell       ⚙️ Settings                  │     │
│   │                                                                           │     │
│   └───────────────────────────────────────────────────────────────────────────┘     │
│                                        │                                            │
│                                        ▼                                            │
│   ┌───────────────────────────────────────────────────────────────────────────┐     │
│   │                      TAILWIND CSS                                         │     │
│   │                  (Utility-First Styling)                                  │     │
│   │                                                                           │     │
│   │   • Dynamic Theme Variables (CSS Custom Properties)                       │     │
│   │   • Tenant-Specific Colors, Fonts, Border Radius                         │     │
│   │   • Dark/Light Mode Support                                              │     │
│   │                                                                           │     │
│   └───────────────────────────────────────────────────────────────────────────┘     │
│                                                                                     │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Data Synchronization

### 4.1 ERP ↔ Webstore Sync Architecture

Real-time synchronization between the ERP backend and customer-facing webstore is critical for inventory accuracy and pricing consistency.

```
┌──────────────────────────────────────────────────────────────────┐
│                        ERP ADMIN PANEL                           │
│                                                                  │
│   [Create Product] ──────┐                                       │
│                          │                                       │
│   [Update Stock]  ───────┼─── Events ───┐                        │
│                          │              │                        │
│   [Edit Prices]   ───────┘              ▼                        │
│                              ┌─────────────────────┐             │
│                              │  Event Listeners    │             │
│                              │  • ProductUpdated   │             │
│                              │  • StockChanged     │             │
│                              │  • PriceUpdated     │             │
│                              └─────────┬───────────┘             │
└────────────────────────────────────────┼─────────────────────────┘
                                         │
                                         ▼
┌──────────────────────────────────────────────────────────────────┐
│                         WEBSTORE                                 │
│                                                                  │
│   [Product Catalog] ← Auto-synced                                │
│   [Stock Display]   ← Real-time                                  │
│   [Prices]          ← Always current                             │
│                                                                  │
│   [Customer Order] ─────┐                                        │
│                         │                                        │
│   [Payment]       ──────┼─── Events ───┐                         │
│                         │              │                         │
│                         ▼              ▼                         │
│                    ┌─────────────────────┐                       │
│                    │  Order Created      │                       │
│                    │  → Create Invoice   │                       │
│                    │  → Update Inventory │                       │
│                    └─────────────────────┘                       │
└──────────────────────────────────────────────────────────────────┘
```

### 4.2 Event-Driven Architecture

| Event | Trigger | Actions |
|-------|---------|---------|
| `ProductCreated` | New product added in ERP | Sync to webstore catalog, index for search |
| `ProductUpdated` | Product details changed | Update webstore, invalidate cache |
| `StockChanged` | Inventory adjustment | Update availability display, low-stock alerts |
| `PriceUpdated` | Price modification | Update all displays, recalculate promotions |
| `OrderPlaced` | Customer checkout complete | Create invoice, deduct stock, notify fulfillment |
| `PaymentReceived` | Payment confirmed | Update order status, trigger shipping |
| `OrderShipped` | Courier pickup | Update tracking, notify customer via WhatsApp |

### 4.3 Background Task Processing

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                         CELERY TASK QUEUE ARCHITECTURE                              │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                     │
│   ┌─────────────────────────────────────────────────────────────────────────┐       │
│   │                        DJANGO APPLICATION                               │       │
│   │                                                                         │       │
│   │   User Action → Create Task → Push to Redis Queue                       │       │
│   │                                                                         │       │
│   └────────────────────────────────┬────────────────────────────────────────┘       │
│                                    │                                                │
│                                    ▼                                                │
│   ┌─────────────────────────────────────────────────────────────────────────┐       │
│   │                        REDIS (Message Broker)                           │       │
│   │                                                                         │       │
│   │   Queue: "celery"                                                       │       │
│   │   │                                                                     │       │
│   │   ├── Task: send_order_confirmation_email                               │       │
│   │   ├── Task: generate_invoice_pdf                                        │       │
│   │   ├── Task: sync_courier_tracking                                       │       │
│   │   ├── Task: process_payment_webhook                                     │       │
│   │   └── Task: generate_daily_report                                       │       │
│   │                                                                         │       │
│   └────────────────────────────────┬────────────────────────────────────────┘       │
│                                    │                                                │
│         ┌──────────────────────────┼──────────────────────────┐                     │
│         ▼                          ▼                          ▼                     │
│   ┌───────────────┐       ┌───────────────┐       ┌───────────────┐                 │
│   │ Celery Worker │       │ Celery Worker │       │ Celery Worker │                 │
│   │      #1       │       │      #2       │       │      #3       │                 │
│   │               │       │               │       │               │                 │
│   │ Processing... │       │ Processing... │       │ Idle          │                 │
│   └───────────────┘       └───────────────┘       └───────────────┘                 │
│                                                                                     │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 5. Security Model

### 5.1 Tenant Isolation Layers

LankaCommerce Cloud implements **defense-in-depth** security with multiple isolation layers:

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                         SECURITY ISOLATION LAYERS                                   │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                     │
│   LAYER 1: DATABASE LEVEL                                                           │
│   ────────────────────────                                                          │
│   • PostgreSQL schema isolation (tenant_id on all rows)                             │
│   • Automatic query scoping via django-tenants                                      │
│   • No cross-tenant data access possible at SQL level                               │
│                                                                                     │
│   ┌─────────────────────────────────────────────────────────────────────────┐       │
│   │  SELECT * FROM products WHERE ...                                       │       │
│   │  → Automatically becomes: SELECT * FROM tenant_xyz.products WHERE ...   │       │
│   └─────────────────────────────────────────────────────────────────────────┘       │
│                                                                                     │
│   LAYER 2: APPLICATION LEVEL                                                        │
│   ──────────────────────────                                                        │
│   • Middleware validates tenant access on EVERY request                             │
│   • JWT tokens include tenant_id claim                                              │
│   • Role-based access control (RBAC) per tenant                                     │
│                                                                                     │
│   LAYER 3: STORAGE LEVEL                                                            │
│   ───────────────────────                                                           │
│   • Files stored in tenant-specific directories: /storage/tenant-{id}/              │
│   • Signed URLs for file access (time-limited)                                      │
│   • No direct file path exposure                                                    │
│                                                                                     │
│   LAYER 4: CACHE LEVEL                                                              │
│   ─────────────────────                                                             │
│   • Cache keys prefixed with tenant ID: cache:tenant_{id}:products                  │
│   • Separate Redis databases per sensitivity level                                  │
│   • Automatic cache invalidation on tenant operations                               │
│                                                                                     │
│   LAYER 5: SESSION LEVEL                                                            │
│   ───────────────────────                                                           │
│   • Sessions scoped to tenant domain                                                │
│   • HttpOnly, Secure, SameSite cookies                                              │
│   • Session hijacking protection with IP binding                                    │
│                                                                                     │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

### 5.2 Authentication & Authorization Matrix

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Authentication** | JWT + Django Sessions | Verify user identity |
| **Authorization** | Django Permissions + Custom RBAC | Control access to resources |
| **API Security** | Token-based auth with refresh tokens | Secure API access |
| **Session Security** | Encrypted cookies, CSRF protection | Prevent session attacks |
| **Password Security** | PBKDF2 hashing with salt | Secure credential storage |

### 5.3 Security Headers Configuration

| Header | Value | Purpose |
|--------|-------|---------|
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains` | Force HTTPS |
| `X-Content-Type-Options` | `nosniff` | Prevent MIME sniffing |
| `X-Frame-Options` | `DENY` | Prevent clickjacking |
| `X-XSS-Protection` | `1; mode=block` | XSS protection |
| `Content-Security-Policy` | Strict CSP rules | Prevent code injection |

---

## 6. Infrastructure & DevOps

### 6.1 Deployment Architecture

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                        PRODUCTION INFRASTRUCTURE                                    │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                     │
│   ┌───────────────────────────────────────────────────────────────────────────┐     │
│   │                           CDN (CloudFlare)                                │     │
│   │                                                                           │     │
│   │   • Global edge caching for static assets                                 │     │
│   │   • DDoS protection                                                       │     │
│   │   • SSL/TLS termination                                                   │     │
│   │   • Wildcard certificate for *.lankacommerce.lk                          │     │
│   │                                                                           │     │
│   └───────────────────────────────────────────────────────────────────────────┘     │
│                                        │                                            │
│                                        ▼                                            │
│   ┌───────────────────────────────────────────────────────────────────────────┐     │
│   │                    LOAD BALANCER (AWS ALB / Nginx)                        │     │
│   │                                                                           │     │
│   │   • Health checks                                                         │     │
│   │   • Round-robin distribution                                              │     │
│   │   • SSL termination (internal)                                            │     │
│   │                                                                           │     │
│   └───────────────────────────────────────────────────────────────────────────┘     │
│                                        │                                            │
│            ┌───────────────────────────┼───────────────────────────┐                │
│            ▼                           ▼                           ▼                │
│   ┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐           │
│   │  Django App     │       │  Django App     │       │  Django App     │           │
│   │  Instance #1    │       │  Instance #2    │       │  Instance #3    │           │
│   │  (Gunicorn)     │       │  (Gunicorn)     │       │  (Gunicorn)     │           │
│   └─────────────────┘       └─────────────────┘       └─────────────────┘           │
│                                        │                                            │
│            ┌───────────────────────────┼───────────────────────────┐                │
│            ▼                           ▼                           ▼                │
│   ┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐           │
│   │  PostgreSQL     │       │  Redis          │       │  S3 / Spaces    │           │
│   │  (RDS)          │       │  (ElastiCache)  │       │  (Object Store) │           │
│   │                 │       │                 │       │                 │           │
│   │  Primary +      │       │  Cache +        │       │  Media Files    │           │
│   │  Read Replicas  │       │  Message Queue  │       │  + Backups      │           │
│   └─────────────────┘       └─────────────────┘       └─────────────────┘           │
│                                                                                     │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

### 6.2 Blue/Green Deployment Strategy

For zero-downtime deployments, LCC uses Blue/Green deployment:

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                        BLUE/GREEN DEPLOYMENT                                        │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                     │
│   BEFORE DEPLOYMENT                     DURING DEPLOYMENT                           │
│   ─────────────────                     ─────────────────                           │
│                                                                                     │
│   Load Balancer ──┐                     Load Balancer ─────┐                        │
│                   ▼                                        │                        │
│              ┌─────────┐                              ┌────┴────┐                   │
│              │  BLUE   │ ← Live                       │  BLUE   │ ← Draining        │
│              │ (v1.0)  │                              │ (v1.0)  │                   │
│              └─────────┘                              └─────────┘                   │
│                                                            │                        │
│              ┌─────────┐                              ┌────┴────┐                   │
│              │  GREEN  │   Idle                       │  GREEN  │ ← New Traffic     │
│              │ (v1.0)  │                              │ (v1.1)  │                   │
│              └─────────┘                              └─────────┘                   │
│                                                                                     │
│   AFTER DEPLOYMENT                      ROLLBACK (If Needed)                        │
│   ────────────────                      ────────────────                            │
│                                                                                     │
│   Load Balancer ──┐                     Load Balancer ──┐                           │
│                   │                                     ▼                           │
│              ┌────┴────┐                           ┌─────────┐                      │
│              │  BLUE   │   Standby                 │  BLUE   │ ← Instant Rollback   │
│              │ (v1.0)  │                           │ (v1.0)  │                      │
│              └─────────┘                           └─────────┘                      │
│                   │                                                                 │
│              ┌────▼────┐                           ┌─────────┐                      │
│              │  GREEN  │ ← Live                    │  GREEN  │   Failed Version     │
│              │ (v1.1)  │                           │ (v1.1)  │                      │
│              └─────────┘                           └─────────┘                      │
│                                                                                     │
│   CRITICAL: You cannot lose 10,000 stores during an update.                         │
│   Blue/Green ensures instant rollback capability.                                   │
│                                                                                     │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

### 6.3 Scalability Matrix

| Component | Horizontal Scaling | Vertical Scaling | Auto-Scaling |
|-----------|-------------------|------------------|--------------|
| Django App Servers | ✅ Add more instances | ✅ Upgrade CPU/RAM | ✅ CPU-based |
| PostgreSQL | ✅ Read replicas | ✅ Instance size | ❌ Manual |
| Redis | ✅ Cluster mode | ✅ Instance size | ✅ Memory-based |
| Celery Workers | ✅ Add workers | ✅ Upgrade nodes | ✅ Queue depth |
| Object Storage | ✅ Automatic | N/A | ✅ Automatic |

---

## 7. Technology Stack

### 7.1 Complete Technology Stack

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                         TECHNOLOGY STACK OVERVIEW                                   │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                     │
│   FRONTEND                                                                          │
│   ────────                                                                          │
│   ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐          │
│   │   Next.js   │    │   React     │    │  Tailwind   │    │  Shadcn/UI  │          │
│   │   (14+)     │    │   (18+)     │    │   CSS       │    │             │          │
│   └─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘          │
│                                                                                     │
│   BACKEND                                                                           │
│   ───────                                                                           │
│   ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐          │
│   │   Django    │    │   DRF /     │    │   Celery    │    │   django-   │          │
│   │   (5.0+)    │    │   Ninja     │    │             │    │   tenants   │          │
│   └─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘          │
│                                                                                     │
│   DATABASE & STORAGE                                                                │
│   ──────────────────                                                                │
│   ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐          │
│   │ PostgreSQL  │    │   Redis     │    │  AWS S3 /   │    │  Meilisearch│          │
│   │   (15+)     │    │             │    │  Spaces     │    │  (Search)   │          │
│   └─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘          │
│                                                                                     │
│   INFRASTRUCTURE                                                                    │
│   ──────────────                                                                    │
│   ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐          │
│   │   Docker    │    │  Kubernetes │    │  CloudFlare │    │  GitHub     │          │
│   │             │    │  (Optional) │    │  CDN        │    │  Actions    │          │
│   └─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘          │
│                                                                                     │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

### 7.2 Technology Selection Rationale

| Technology | Why Chosen | Alternatives Considered |
|------------|------------|------------------------|
| **Django** | Python ecosystem, django-tenants, batteries-included | FastAPI (less mature multi-tenancy) |
| **PostgreSQL** | Required for schema-based tenancy, JSONB support | MySQL (no schema isolation) |
| **Next.js** | SSR for SEO, React ecosystem, great DX | Nuxt.js (Vue - smaller talent pool) |
| **Redis** | Fast caching, Celery broker, session store | RabbitMQ (overkill for our needs) |
| **Celery** | Python standard for async tasks | Django-Q (less community support) |
| **Tailwind CSS** | Rapid UI development, easy theming | Bootstrap (harder to customize) |
| **Shadcn/UI** | Accessible components, copy-paste ownership | Material UI (heavier bundle) |

### 7.3 PostgreSQL JSONB Usage

JSONB columns are essential for flexible product attributes:

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                         JSONB FOR PRODUCT ATTRIBUTES                                │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                     │
│   PROBLEM: Different products have different attributes                             │
│                                                                                     │
│   T-Shirt:                         Laptop:                                          │
│   • Size: S, M, L, XL              • RAM: 8GB, 16GB, 32GB                           │
│   • Color: Red, Blue, Black        • Storage: 256GB, 512GB, 1TB                     │
│   • Material: Cotton, Polyester    • Processor: i5, i7, M1                          │
│                                                                                     │
│   SOLUTION: JSONB Column                                                            │
│   ──────────────────────────────────────────────────────────────────────────        │
│                                                                                     │
│   CREATE TABLE products (                                                           │
│       id SERIAL PRIMARY KEY,                                                        │
│       name VARCHAR(255),                                                            │
│       attributes JSONB DEFAULT '{}'                                                 │
│   );                                                                                │
│                                                                                     │
│   -- T-Shirt Record                                                                 │
│   INSERT INTO products (name, attributes) VALUES (                                  │
│       'Cotton T-Shirt',                                                             │
│       '{"size": ["S","M","L","XL"], "color": ["Red","Blue"], "material": "Cotton"}' │
│   );                                                                                │
│                                                                                     │
│   -- Laptop Record                                                                  │
│   INSERT INTO products (name, attributes) VALUES (                                  │
│       'ThinkPad X1 Carbon',                                                         │
│       '{"ram": ["8GB","16GB"], "storage": ["256GB","512GB"], "processor": "i7"}'    │
│   );                                                                                │
│                                                                                     │
│   -- Powerful queries on JSONB                                                      │
│   SELECT * FROM products WHERE attributes @> '{"color": ["Red"]}';                  │
│   SELECT * FROM products WHERE attributes->>'processor' = 'i7';                     │
│                                                                                     │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 8. Critical Challenges & Solutions

### 8.1 Challenge: Custom Domain Support

**Problem**: Tenants want their own domains (`mystore.com`) instead of subdomains (`mystore.lankacommerce.lk`).

**Solution**: CNAME-based domain mapping

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                        CUSTOM DOMAIN SETUP                                          │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                     │
│   STEP 1: Tenant Configuration (ERP Panel)                                          │
│   ─────────────────────────────────────────                                         │
│   Tenant enters: www.mystore.com                                                    │
│   System generates: Verification token (TXT record)                                 │
│                                                                                     │
│   STEP 2: DNS Configuration (Tenant's Registrar)                                    │
│   ──────────────────────────────────────────────                                    │
│   ┌─────────────────────────────────────────────────────────────────────┐           │
│   │   TYPE     NAME              VALUE                                  │           │
│   │   ────     ────              ─────                                  │           │
│   │   CNAME    www               shops.lankacommerce.lk                 │           │
│   │   A        @                 123.45.67.89 (Platform IP)             │           │
│   │   TXT      _lcc-verify       abc123verification                     │           │
│   └─────────────────────────────────────────────────────────────────────┘           │
│                                                                                     │
│   STEP 3: Verification Process (Background Job)                                     │
│   ──────────────────────────────────────────────                                    │
│   • System queries DNS for TXT record                                               │
│   • If valid, domain is activated                                                   │
│   • SSL certificate auto-provisioned via Let's Encrypt                              │
│                                                                                     │
│   STEP 4: Request Handling (Middleware)                                             │
│   ─────────────────────────────────────                                             │
│   ┌─────────────────────────────────────────────────────────────────────┐           │
│   │   def TenantMiddleware(request):                                    │           │
│   │       domain = request.get_host()                                   │           │
│   │       tenant = Domain.objects.get(domain=domain)                    │           │
│   │       connection.set_schema(tenant.schema_name)                     │           │
│   │       return next(request)                                          │           │
│   └─────────────────────────────────────────────────────────────────────┘           │
│                                                                                     │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

### 8.2 Challenge: Image Optimization

**Problem**: 1,000 tenants uploading 4MB raw images will bankrupt storage costs.

**Solution**: Automatic compression and WebP conversion on upload.

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                        IMAGE OPTIMIZATION PIPELINE                                  │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                     │
│   UPLOAD FLOW                                                                       │
│   ───────────                                                                       │
│                                                                                     │
│   Original Image (4MB JPEG)                                                         │
│          │                                                                          │
│          ▼                                                                          │
│   ┌──────────────────────────┐                                                      │
│   │  Validation              │                                                      │
│   │  • Max size: 10MB        │                                                      │
│   │  • Allowed: jpg,png,webp │                                                      │
│   └────────────┬─────────────┘                                                      │
│                ▼                                                                    │
│   ┌──────────────────────────┐                                                      │
│   │  Resize                  │                                                      │
│   │  • Max width: 2000px     │                                                      │
│   │  • Maintain aspect ratio │                                                      │
│   └────────────┬─────────────┘                                                      │
│                ▼                                                                    │
│   ┌──────────────────────────┐                                                      │
│   │  Convert to WebP         │                                                      │
│   │  • Quality: 85%          │                                                      │
│   │  • ~80% size reduction   │                                                      │
│   └────────────┬─────────────┘                                                      │
│                ▼                                                                    │
│   ┌──────────────────────────┐                                                      │
│   │  Generate Thumbnails     │                                                      │
│   │  • 100x100 (thumb)       │                                                      │
│   │  • 400x400 (medium)      │                                                      │
│   │  • 800x800 (large)       │                                                      │
│   └────────────┬─────────────┘                                                      │
│                ▼                                                                    │
│   ┌──────────────────────────┐                                                      │
│   │  Store in Object Storage │                                                      │
│   │  /tenant-id/products/    │                                                      │
│   │    ├── original.webp     │                                                      │
│   │    ├── thumb.webp        │                                                      │
│   │    ├── medium.webp       │                                                      │
│   │    └── large.webp        │                                                      │
│   └──────────────────────────┘                                                      │
│                                                                                     │
│   RESULT: 4MB → ~200KB (95% reduction)                                              │
│                                                                                     │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

### 8.3 Challenge: Database Scalability

**Problem**: Single PostgreSQL instance may become a bottleneck with 10,000+ tenants.

**Solution**: Progressive scaling strategy.

| Tenants | Strategy | Implementation |
|---------|----------|----------------|
| 1-1,000 | Single Instance | One PostgreSQL RDS with backups |
| 1,000-5,000 | Read Replicas | Primary + 2 read replicas for reporting |
| 5,000-10,000 | Connection Pooling | PgBouncer for connection management |
| 10,000+ | Database Sharding | Separate clusters by tenant tier |

---

## Summary

LankaCommerce Cloud's technical architecture is designed for **scalability, security, and maintainability**. Key architectural decisions include:

- **Schema-based multi-tenancy** for robust data isolation
- **Event-driven synchronization** between ERP and Webstore
- **Layered security model** with defense-in-depth approach
- **Blue/Green deployments** for zero-downtime updates
- **Progressive scalability** strategy for growth

The architecture supports the platform's goal of serving unlimited businesses from a single codebase while maintaining enterprise-grade security and performance.

---

*This document is Part 2 of 5 in the LankaCommerce Cloud comprehensive documentation series.*

| Document | Title |
|----------|-------|
| 📄 Document 1 | Executive Overview & Business Strategy |
| **📄 This Document** | Technical Architecture & Infrastructure |
| 📄 Document 3 | ERP Module Features & Specifications |
| 📄 Document 4 | Webstore & E-Commerce Platform |
| 📄 Document 5 | AI Integration & Future Roadmap |
