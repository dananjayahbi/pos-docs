# LankaCommerce Cloud (LCC) — Project Overview

## What Is LCC?
Multi-tenant SaaS ERP + E-Commerce platform targeting Sri Lankan SMEs.
One platform = ERP dashboard + webstore + POS terminal + payment gateways + courier integrations + AI features.

## Tech Stack
- **Backend:** Django 5.x, Python 3.12+, django-tenants, DRF, Celery, Redis
- **Database:** PostgreSQL 15+ with schema-based multi-tenancy
- **Frontend:** Next.js 14+ (App Router), TypeScript, Tailwind CSS, Shadcn/UI
- **State:** Zustand (UI) + TanStack Query (server/API data)
- **Testing:** Pytest, Jest/Vitest

## Multitenant Architecture
- Public schema: Platform-level data (Tenants, Plans, PlatformUsers)
- Each tenant = isolated PostgreSQL schema (tenant_data)
- Subdomains: `[tenant].lankacommerce.lk` for webstore, `/admin` for ERP

## Application URL Structure
| App | URL | Render |
|-----|-----|--------|
| ERP Dashboard | `[tenant].lankacommerce.lk/admin` or `erp.lankacommerce.lk` | CSR |
| Webstore (Customer) | `[tenant].lankacommerce.lk` or custom domain | SSR |
| Super Admin Panel | `admin.lankacommerce.lk` | Django Admin + Custom |

## Subscription Plans
| Plan | Price | Limits |
|------|-------|--------|
| Starter | Low | 1 user, 100 products, basic POS |
| Growth | Mid | 5 users, unlimited products, HR, Accounting |
| Enterprise | High | Unlimited users, multi-warehouse, AI, API access |

## Frontend Route Groups (Next.js App Router)
```
app/
├── (auth)/          → Login, Register, Forgot/Reset Password, Email Verification
├── (dashboard)/     → ERP Admin interface (sidebar + header layout)
├── (pos)/           → POS terminal (full-screen, no sidebar)
└── (storefront)/    → Customer-facing webstore (store header + footer)
```

## Project Phases (10 Phases)
| Phase | Focus |
|-------|-------|
| 01 | Project Foundation Setup (monorepo, Docker, linting) |
| 02 | Database Architecture & Multi-Tenancy |
| 03 | Core Backend Infrastructure (Django apps, JWT auth, RBAC, Celery) |
| 04 | ERP Core Modules Part 1 (Products, Inventory) |
| 05 | ERP Core Modules Part 2 (POS, Sales, Invoicing, Customers, Vendors) |
| 06 | ERP Advanced Modules (HR/Payroll, Accounting, Reports) |
| 07 | Frontend Infrastructure & ERP Dashboard |
| 08 | Webstore E-Commerce Platform |
| 09 | Integrations & Sri Lanka Localizations (payments, couriers, SMS, WhatsApp) |
| 10 | AI Features & Advanced Capabilities |

## Sri Lanka Specifics (Critical for UI)
- Currency: LKR (₨) — comma-formatted (₨ 3,500.00)
- Phone: +94 XX XXX XXXX
- Address: Province → District → City (no ZIP codes; 9 provinces)
- Timezone: Asia/Colombo (UTC+5:30)
- Tax: SVAT / VAT compliance, BRN on invoices
- Payroll: EPF 8% (employee) + 12% (employer), ETF 3% (employer), PAYE tax
- Payment: COD, Bank Transfer Slip Upload are primary local methods
- Couriers: Koombiyo, Domex, PromptX, Royal Express, TranceExpress
- Festivals: Avurudu (April), Vesak (May), Christmas (December), Black Friday
