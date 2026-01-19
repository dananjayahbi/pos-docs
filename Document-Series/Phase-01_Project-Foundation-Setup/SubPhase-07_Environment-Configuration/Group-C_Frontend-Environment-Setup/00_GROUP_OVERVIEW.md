# Group C: Frontend Environment Setup

> **Phase:** 01 - Project Foundation & Setup  
> **SubPhase:** 07 - Environment Configuration  
> **Group:** C of G  
> **Tasks Covered:** 31-44  
> **Group Goal:** Set up environment variable management for Next.js frontend

---

## Navigation

- **↑ Parent:** [../00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [../Group-B_Backend-Environment-Variables-Definition/](../Group-B_Backend-Environment-Variables-Definition/)
- **→ Next Group:** [../Group-D_Frontend-Environment-Variables-Definition/](../Group-D_Frontend-Environment-Variables-Definition/)

---

## Group Overview

This group sets up environment variable management for the Next.js frontend. The configuration includes environment files, TypeScript declarations for type safety, Zod validation for runtime checking, and helper functions for accessing environment variables.

### Key Outcomes
- Environment example files created (.env.local.example)
- Development and production env templates
- TypeScript declarations for env variables
- NEXT_PUBLIC prefix documentation
- Zod schema for runtime validation
- Environment validation on startup
- Helper functions for env access

### Technology Context
- **Framework:** Next.js 14+
- **Validation:** Zod for schema validation
- **Types:** TypeScript declarations
- **Prefix:** NEXT_PUBLIC_ for client-side variables
- **Files:** .env.local, .env.development, .env.production

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | 01_Tasks-31-35_Env-Files-Setup.md | 31-35 | Create example, development, production env files, TypeScript declarations, NEXT_PUBLIC docs |
| 02 | 02_Tasks-36-40_Env-Validation.md | 36-40 | Create lib/env.ts, install Zod, create schema, validate on startup, next.config.js env |
| 03 | 03_Tasks-41-44_Env-Integration.md | 41-44 | Add env to .gitignore, document client vs server, create helpers, test loading |

---

## Task Summary

| Task # | Task Name | Dependencies | Complexity |
|--------|-----------|--------------|------------|
| 31 | Create .env.local.example | SubPhase-03 | Medium |
| 32 | Create .env.development | Task 31 | Simple |
| 33 | Create .env.production | Task 31 | Simple |
| 34 | Create types/env.d.ts | Task 31 | Medium |
| 35 | Define NEXT_PUBLIC Prefix | Task 31 | Simple |
| 36 | Create lib/env.ts | Task 34 | Medium |
| 37 | Install zod | Task 31 | Simple |
| 38 | Create Env Schema | Task 37 | Medium |
| 39 | Validate Env on Startup | Task 38 | Medium |
| 40 | Configure next.config.js Env | Task 31 | Simple |
| 41 | Add Env to .gitignore | Task 31 | Simple |
| 42 | Document Client vs Server Env | Task 35 | Simple |
| 43 | Create Env Helper Functions | Task 36 | Medium |
| 44 | Test Env Loading | Task 39 | Simple |

---

## Execution Order

```
01_Tasks-31-35_Env-Files-Setup.md
        │
        ▼
02_Tasks-36-40_Env-Validation.md
        │
        ▼
03_Tasks-41-44_Env-Integration.md
```

---

## Expected Deliverables

After completing this group:

```
frontend/
├── .env.local.example       # Example environment file
├── .env.development         # Development settings
├── .env.production          # Production template
├── lib/
│   └── env.ts               # Environment validation utility
├── types/
│   └── env.d.ts             # TypeScript declarations
└── next.config.js           # Updated with env config
```

---

## Client vs Server Environment Variables

**Client-side (NEXT_PUBLIC_):**
- Exposed to browser
- Use for public API URLs, analytics IDs
- Example: NEXT_PUBLIC_API_URL

**Server-side:**
- Only available on server
- Use for secrets, API keys
- Example: NEXTAUTH_SECRET

---

## Notes for AI Agents

1. **Dependencies:** Requires SubPhase-03 complete (Next.js project exists)
2. **NEXT_PUBLIC Prefix:** Required for client-side access
3. **Zod Validation:** Catches missing/invalid vars at startup
4. **Don't Commit .env.local:** Add to .gitignore
5. **TypeScript Types:** Enables autocomplete and type checking
6. **Git Commit:** Commit after completing this group

