# Tasks 31-35: Env Files Setup

> **Phase:** 01 - Project Foundation & Setup  
> **SubPhase:** 07 - Environment Configuration  
> **Group:** C - Frontend Environment Setup  
> **Document:** 01 of 03  
> **Tasks Covered:** 31, 32, 33, 34, 35

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Group:** [../Group-B_Backend-Environment-Variables-Definition/](../Group-B_Backend-Environment-Variables-Definition/)
- **→ Next Document:** [02_Tasks-36-40_Env-Validation.md](02_Tasks-36-40_Env-Validation.md)

---

## Document Overview

This document sets up frontend environment files and type definitions for Next.js.

### Tasks in This Document

| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 31 | Create frontend env example | Simple |
| 32 | Create frontend development env | Simple |
| 33 | Create frontend production env | Simple |
| 34 | Define env types | Medium |
| 35 | Document NEXT_PUBLIC rules | Simple |

---

## Task 31: Create frontend env example

### Overview
Provide a committed example environment file for the frontend.

### Dependencies
- SubPhase-03 Frontend Project Initialization complete

### Instructions

1. **Create `.env.local.example`**
   - Place in the frontend root
   - Add variable names and placeholders

2. **Document variable purpose**
   - Add short descriptions for each variable

### Expected Outcome
- `frontend/.env.local.example` exists and is committed

### Verification Checklist
- [ ] Example file exists in frontend root
- [ ] Variable descriptions are present

---

## Task 32: Create frontend development env

### Overview
Create a development environment file for frontend local runs.

### Dependencies
- Task 31: Create frontend env example

### Instructions

1. **Create `.env.development`**
   - Place in the frontend root
   - Keep in sync with `.env.local.example`

2. **Exclude from version control**
   - Ensure `.env.development` is ignored

### Expected Outcome
- `frontend/.env.development` exists locally and is ignored

### Verification Checklist
- [ ] Development env file exists
- [ ] Development env file is ignored

---

## Task 33: Create frontend production env

### Overview
Create a production environment file for frontend deployment.

### Dependencies
- Task 32: Create frontend development env

### Instructions

1. **Create `.env.production`**
   - Place in the frontend root
   - Populate with production placeholders

2. **Document production requirements**
   - Add guidance on required values

### Expected Outcome
- `frontend/.env.production` exists locally and is ignored

### Verification Checklist
- [ ] Production env file exists
- [ ] Production requirements are documented

---

## Task 34: Define env types

### Overview
Provide TypeScript definitions for environment variables.

### Dependencies
- Task 33: Create frontend production env

### Instructions

1. **Create env type definitions**
   - Add a `types/env.d.ts` file

2. **List required variables**
   - Include client and server variables

### Expected Outcome
- `frontend/types/env.d.ts` defines environment variable types

### Verification Checklist
- [ ] Env type definitions exist
- [ ] Required variables are listed

---

## Task 35: Document NEXT_PUBLIC rules

### Overview
Document the rule that client-side variables must be prefixed with `NEXT_PUBLIC_`.

### Dependencies
- Task 34: Define env types

### Instructions

1. **Add documentation section**
   - Include guidance in README or environment docs

2. **Clarify client vs server exposure**
   - Note that only public-prefixed variables are exposed

### Expected Outcome
- NEXT_PUBLIC exposure rules are documented

### Verification Checklist
- [ ] NEXT_PUBLIC rule is documented
- [ ] Client vs server exposure is clarified

---

## Summary

### Tasks Completed in This Document

| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 31 | Create frontend env example | `frontend/.env.local.example` created |
| 32 | Create frontend development env | `.env.development` created (ignored) |
| 33 | Create frontend production env | `.env.production` created (ignored) |
| 34 | Define env types | `frontend/types/env.d.ts` created |
| 35 | Document NEXT_PUBLIC rules | Exposure rules documented |

### Next Steps
- Continue with [02_Tasks-36-40_Env-Validation.md](02_Tasks-36-40_Env-Validation.md)

---

## Notes for AI Agents

1. **Execution Order:** Complete tasks 31 through 35 in sequence
2. **No Secrets:** Do not commit real values in env files
3. **Exposure Rule:** Only `NEXT_PUBLIC_` variables may be used in client code
