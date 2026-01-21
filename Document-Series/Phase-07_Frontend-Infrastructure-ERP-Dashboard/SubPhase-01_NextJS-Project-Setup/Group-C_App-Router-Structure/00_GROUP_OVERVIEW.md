# Group C: App Router Structure

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 01 - Next.js Project Setup  
> **Group:** C of F  
> **Tasks Covered:** 31-46  
> **Group Goal:** Create Next.js 14+ App Router directory structure with route groups and shared directories

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-B_TypeScript-Configuration](../Group-B_TypeScript-Configuration/)
- **→ Next Group:** [Group-D_ESLint-Prettier-Setup](../Group-D_ESLint-Prettier-Setup/)

---

## Group Overview

This group establishes the Next.js 14+ App Router directory structure. Creates the app/ directory with root layout, page, loading, error, and not-found components. Sets up route groups (auth) for authentication pages and (dashboard) for protected dashboard routes with their respective layouts. Creates the api/ directory with a health check endpoint. Establishes shared directories for components, lib utilities, hooks, and types with placeholder files.

### Key Outcomes

- app/ directory structure created
- Root layout.tsx with html, body, metadata
- Root page.tsx (landing/home)
- Root loading.tsx for loading states
- Root error.tsx for error boundaries
- not-found.tsx for 404 pages
- (auth) route group directory
- (auth)/layout.tsx for auth pages
- (dashboard) route group directory
- (dashboard)/layout.tsx with sidebar/header
- api/ route directory
- api/health/route.ts endpoint
- components/ with ui/ and modules/
- lib/ directory with utils.ts
- hooks/ directory with index.ts
- types/ directory with index.ts

### Technology Context

- **Routing:** Next.js 14+ App Router
- **Server Components:** Default for all pages
- **Client Components:** Opt-in with "use client"
- **Route Groups:** Parentheses for organization without URL segments

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-31-38_App-Root-Auth.md` | Create app directory, root components, and auth group | 31-38 |
| 02 | `02_Tasks-39-46_Dashboard-API-Shared.md` | Create dashboard group, API routes, and shared directories | 39-46 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 31 | Create app/ Directory Structure | Medium | Task 16 |
| 32 | Create Root Layout Component | Medium | Task 31 |
| 33 | Configure Root Metadata | Low | Task 32 |
| 34 | Create Root Loading Component | Low | Task 31 |
| 35 | Create Root Error Component | Low | Task 31 |
| 36 | Create Not Found Page | Low | Task 31 |
| 37 | Create (auth) Route Group | Low | Task 31 |
| 38 | Create (auth) Layout | Medium | Task 37 |
| 39 | Create (dashboard) Route Group | Low | Task 31 |
| 40 | Create (dashboard) Layout | Medium | Task 39 |
| 41 | Create api/ Route Directory | Low | Task 31 |
| 42 | Create Health Check API Route | Low | Task 41 |
| 43 | Create components/ Directory | Low | Task 16 |
| 44 | Create lib/ Directory | Low | Task 16 |
| 45 | Create hooks/ Directory | Low | Task 16 |
| 46 | Create types/ Directory | Low | Task 16 |

---

## Execution Order

```
Task 31: Create app/ Directory
    │
    ├───────────────────────────────────────────────────┐
    │                                                   │
    ▼                                                   ▼
Task 32: Root Layout                         Tasks 34-36: Loading/Error/404
    │                                        (parallel)
    ▼                                                   │
Task 33: Root Metadata                                  │
    │                                                   │
    ├───────────────────────────────────────────────────┘
    │
    ├──────────────────────┬──────────────────────┐
    ▼                      ▼                      ▼
Task 37              Task 39                 Task 41
(auth group)         (dashboard group)       (api dir)
    │                      │                      │
    ▼                      ▼                      ▼
Task 38              Task 40                 Task 42
(auth layout)        (dashboard layout)      (health route)
    │                      │                      │
    └──────────────────────┴──────────────────────┘
                           │
        ┌──────────────────┴──────────────────────┐
        ▼                  ▼                      ▼
   Task 43            Task 44                Task 45-46
   (components)       (lib)                  (hooks, types)
```

---

## Expected Deliverables

```
frontend/
├── app/
│   ├── (auth)/
│   │   └── layout.tsx
│   ├── (dashboard)/
│   │   └── layout.tsx
│   ├── api/
│   │   └── health/
│   │       └── route.ts
│   ├── error.tsx
│   ├── layout.tsx
│   ├── loading.tsx
│   ├── not-found.tsx
│   └── page.tsx
├── components/
│   ├── modules/
│   │   └── .gitkeep
│   └── ui/
│       └── .gitkeep
├── hooks/
│   └── index.ts
├── lib/
│   └── utils.ts
└── types/
    └── index.ts
```

---

## Notes for AI Agents

### Root Layout Structure (Task 32)
- Must include html and body tags
- Set lang attribute (en-LK)
- Import global styles
- Include font configuration (Inter)
- Add children prop typing

### Root Metadata (Task 33)
| Field | Value |
|-------|-------|
| title | LankaCommerce Cloud |
| description | Multi-tenant ERP for Sri Lankan SMEs |
| icons | Favicon configuration |
| viewport | width=device-width, initial-scale=1 |

### Route Groups Purpose
| Group | Purpose | URL Path |
|-------|---------|----------|
| (auth) | Authentication pages | /login, /register, /forgot-password |
| (dashboard) | Protected ERP pages | /dashboard, /inventory, /sales |

### (auth) Layout Features
- Centered content
- Logo display
- Minimal navigation
- No sidebar

### (dashboard) Layout Features
- Sidebar navigation
- Top header with user menu
- Main content area
- Breadcrumb support

### Health Check Route (Task 42)
- GET /api/health
- Returns { status: "ok", timestamp }
- Used for monitoring and load balancers

### components/ Structure
| Subdirectory | Purpose |
|--------------|---------|
| ui/ | Shadcn/UI components |
| modules/ | Feature-specific components |

### lib/utils.ts Content
- cn() function for className merging
- clsx and tailwind-merge usage

### types/index.ts Purpose
- Global type definitions
- API response types
- Common interfaces
