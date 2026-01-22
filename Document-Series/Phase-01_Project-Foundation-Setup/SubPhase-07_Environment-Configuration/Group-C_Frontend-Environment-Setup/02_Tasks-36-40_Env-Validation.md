# Tasks 36-40: Env Validation

> **Phase:** 01 - Project Foundation & Setup  
> **SubPhase:** 07 - Environment Configuration  
> **Group:** C - Frontend Environment Setup  
> **Document:** 02 of 03  
> **Tasks Covered:** 36, 37, 38, 39, 40

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-31-35_Env-Files-Setup.md](01_Tasks-31-35_Env-Files-Setup.md)
- **→ Next Document:** [03_Tasks-41-44_Env-Integration.md](03_Tasks-41-44_Env-Integration.md)

---

## Document Overview

This document adds frontend environment validation using Zod and integrates validation into the Next.js configuration.

### Tasks in This Document

| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 36 | Install Zod for validation | Simple |
| 37 | Create env schema module | Medium |
| 38 | Add startup validation | Medium |
| 39 | Update Next.js config | Medium |
| 40 | Document validation behavior | Simple |

---

## Task 36: Install Zod for validation

### Overview
Add Zod as the schema validation library for frontend environment checks.

### Dependencies
- Task 35: Document NEXT_PUBLIC rules

### Instructions

1. **Add Zod dependency**
   - Include in frontend package dependencies

2. **Verify availability**
   - Confirm it is available for the validation module

### Expected Outcome
- Zod is available in the frontend project

### Verification Checklist
- [ ] Zod is listed as a frontend dependency
- [ ] Validation module can import Zod

---

## Task 37: Create env schema module

### Overview
Create a module to define and validate frontend environment variables.

### Dependencies
- Task 36: Install Zod for validation

### Instructions

1. **Create `lib/env.ts`**
   - Define a schema for all client and server variables

2. **Add parsing and defaults**
   - Provide defaults where appropriate and safe

### Expected Outcome
- `frontend/lib/env.ts` defines a validation schema

### Verification Checklist
- [ ] Schema includes all required variables
- [ ] Defaults are explicitly documented

---

## Task 38: Add startup validation

### Overview
Ensure the frontend validates environment variables on startup.

### Dependencies
- Task 37: Create env schema module

### Instructions

1. **Run validation on app start**
   - Trigger validation during app initialization

2. **Define failure behavior**
   - Fail fast with clear error messaging on invalid config

### Expected Outcome
- Frontend fails early when configuration is invalid

### Verification Checklist
- [ ] Startup validation is enabled
- [ ] Failure behavior is documented

---

## Task 39: Update Next.js config

### Overview
Ensure Next.js configuration references validated environment variables.

### Dependencies
- Task 38: Add startup validation

### Instructions

1. **Integrate validated values**
   - Ensure Next.js configuration reads from the env module

2. **Limit exposure**
   - Confirm only `NEXT_PUBLIC_` variables are exposed to the client

### Expected Outcome
- Next.js configuration aligns with validation and exposure rules

### Verification Checklist
- [ ] Config uses validated variables
- [ ] Client exposure rules are enforced

---

## Task 40: Document validation behavior

### Overview
Document how environment validation behaves in development and production.

### Dependencies
- Task 39: Update Next.js config

### Instructions

1. **Add documentation**
   - Explain when validation runs and what errors look like

2. **Provide troubleshooting guidance**
   - Add steps to resolve missing or invalid variables

### Expected Outcome
- Validation behavior is documented for developers

### Verification Checklist
- [ ] Documentation explains validation timing
- [ ] Troubleshooting guidance is provided

---

## Summary

### Tasks Completed in This Document

| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 36 | Install Zod for validation | Zod dependency added |
| 37 | Create env schema module | `frontend/lib/env.ts` created |
| 38 | Add startup validation | Validation at startup |
| 39 | Update Next.js config | Config aligned with validation |
| 40 | Document validation behavior | Validation documented |

### Next Steps
- Continue with [03_Tasks-41-44_Env-Integration.md](03_Tasks-41-44_Env-Integration.md)

---

## Notes for AI Agents

1. **Execution Order:** Complete tasks 36 through 40 in sequence
2. **Client Exposure:** Keep client variables restricted to `NEXT_PUBLIC_`
3. **Validation:** Fail fast on invalid configuration
