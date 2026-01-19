# Group B: Next.js Project Creation

> **Phase:** 01 - Project Foundation & Setup  
> **SubPhase:** 03 - Frontend Project Initialization  
> **Group:** B of G  
> **Tasks Covered:** 09-18  
> **Group Goal:** Initialize Next.js 14+ with App Router and core pages

---

## Navigation

- **↑ Parent:** [../00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [../Group-A_Node-Environment-Setup/](../Group-A_Node-Environment-Setup/)
- **→ Next Group:** [../Group-C_TypeScript-Configuration/](../Group-C_TypeScript-Configuration/)

---

## Group Overview

This group creates the Next.js 14+ project with App Router, installs React dependencies, and sets up the foundational pages and layouts. The configuration prepares the project for both ERP Dashboard and Webstore development.

### Key Outcomes
- Next.js 14+ and React 18+ installed
- next.config.js with proper settings
- App Router directory structure created
- Root layout, page, error, and not-found components
- Image domains and experimental features configured

### Technology Context
- **Framework:** Next.js 14+ with App Router
- **React Version:** React 18+
- **Rendering:** Server Components by default, Client Components where needed
- **Features:** Server Actions, Image Optimization, Middleware

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | 01_Tasks-09-13_NextJS-Install.md | 09-13 | Install Next.js, React, create config, configure features |
| 02 | 02_Tasks-14-18_App-Router-Setup.md | 14-18 | Create app directory, layout, page, error, not-found |

---

## Task Summary

| Task # | Task Name | Dependencies | Complexity |
|--------|-----------|--------------|------------|
| 09 | Install Next.js | Task 05 | Simple |
| 10 | Install React & React DOM | Task 09 | Simple |
| 11 | Create next.config.js | Task 09 | Medium |
| 12 | Configure Image Domains | Task 11 | Simple |
| 13 | Configure Experimental Features | Task 11 | Simple |
| 14 | Create app/ Directory | Task 09 | Simple |
| 15 | Create app/layout.tsx | Task 14 | Medium |
| 16 | Create app/page.tsx | Task 14 | Simple |
| 17 | Create app/error.tsx | Task 14 | Medium |
| 18 | Create app/not-found.tsx | Task 14 | Simple |

---

## Execution Order

```
01_Tasks-09-13_NextJS-Install.md
        │
        ▼
02_Tasks-14-18_App-Router-Setup.md
```

---

## Expected Deliverables

After completing this group:

```
frontend/
├── app/
│   ├── layout.tsx           # Root layout (RootLayout)
│   ├── page.tsx             # Home page
│   ├── error.tsx            # Error boundary
│   └── not-found.tsx        # 404 page
├── next.config.js           # Next.js configuration
└── package.json             # Updated with Next.js deps
```

---

## Next.js Configuration Overview

**next.config.js key settings:**
- `images.domains` - Allowed external image domains
- `experimental.serverActions` - Enable Server Actions
- `output` - Standalone for Docker deployment
- `reactStrictMode` - Enable React strict mode

---

## Notes for AI Agents

1. **Dependencies:** Requires Group A complete (package.json exists)
2. **App Router:** Use app/ directory, not pages/ (Next.js 14+)
3. **Server Components:** Default to Server Components unless 'use client' needed
4. **Layout Pattern:** Root layout wraps all pages
5. **Error Boundary:** error.tsx must be Client Component
6. **Git Commit:** Commit after completing this group
