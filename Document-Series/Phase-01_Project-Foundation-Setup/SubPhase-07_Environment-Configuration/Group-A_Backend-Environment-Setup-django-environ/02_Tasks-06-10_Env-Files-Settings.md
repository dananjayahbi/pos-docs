# Tasks 06-10: Env Files & Settings

> **Phase:** 01 - Project Foundation & Setup  
> **SubPhase:** 07 - Environment Configuration  
> **Group:** A - Backend Environment Setup (django-environ)  
> **Document:** 02 of 03  
> **Tasks Covered:** 06, 07, 08, 09, 10

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-01-05_Django-Environ-Install.md](01_Tasks-01-05_Django-Environ-Install.md)
- **→ Next Document:** [03_Tasks-11-14_Core-Env-Vars.md](03_Tasks-11-14_Core-Env-Vars.md)

---

## Document Overview

This document covers creation of backend environment files and updates to Django settings modules for local and production use.

### Tasks in This Document

| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 06 | Create backend env example file | Simple |
| 07 | Create local backend env file | Simple |
| 08 | Update base settings | Medium |
| 09 | Update local settings | Medium |
| 10 | Update production settings | Medium |

---

## Task 06: Create backend env example file

### Overview
Provide a committed example environment file for backend configuration.

### Dependencies
- Task 05: Wire env loader into settings

### Instructions

1. **Create `.env.example`**
   - Place file in the backend root
   - Include non-secret defaults and variable names

2. **Document required variables**
   - Mark required values and expected formats

### Expected Outcome
- `backend/.env.example` exists and is committed

### Verification Checklist
- [ ] Example file is present in backend root
- [ ] Required variables are listed clearly

---

## Task 07: Create local backend env file

### Overview
Create a local development environment file for backend configuration.

### Dependencies
- Task 06: Create backend env example file

### Instructions

1. **Create `.env.local`**
   - Place file in the backend root
   - Align keys with `.env.example`

2. **Exclude from version control**
   - Ensure local file is not committed

### Expected Outcome
- `backend/.env.local` exists locally and is ignored by version control

### Verification Checklist
- [ ] Local env file exists
- [ ] Local env file is excluded from commits

---

## Task 08: Update base settings

### Overview
Use environment variables in the base Django settings file.

### Dependencies
- Task 07: Create local backend env file

### Instructions

1. **Replace hard-coded values**
   - Source settings from environment variables where appropriate

2. **Add safe defaults**
   - Ensure defaults for local development are reasonable

### Expected Outcome
- `backend/config/settings/base.py` reads values from the env loader

### Verification Checklist
- [ ] Base settings use env variables
- [ ] Default values are documented

---

## Task 09: Update local settings

### Overview
Ensure the local settings file derives configuration from environment variables.

### Dependencies
- Task 08: Update base settings

### Instructions

1. **Align local overrides**
   - Keep local-only settings in the local module

2. **Document local development expectations**
   - Clarify required local services and URLs

### Expected Outcome
- `backend/config/settings/local.py` uses env-driven configuration

### Verification Checklist
- [ ] Local settings use env variables
- [ ] Local development expectations are documented

---

## Task 10: Update production settings

### Overview
Ensure production settings consume environment variables with secure defaults.

### Dependencies
- Task 09: Update local settings

### Instructions

1. **Use environment variables for production values**
   - Avoid inline secrets or credentials

2. **Document required production variables**
   - Provide the required variables list in `.env.example`

### Expected Outcome
- `backend/config/settings/production.py` uses env-driven configuration

### Verification Checklist
- [ ] Production settings are env-driven
- [ ] Required production variables are documented

---

## Summary

### Tasks Completed in This Document

| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 06 | Create backend env example file | `backend/.env.example` created |
| 07 | Create local backend env file | `backend/.env.local` created (ignored) |
| 08 | Update base settings | Base settings env-driven |
| 09 | Update local settings | Local settings env-driven |
| 10 | Update production settings | Production settings env-driven |

### Next Steps
- Continue with [03_Tasks-11-14_Core-Env-Vars.md](03_Tasks-11-14_Core-Env-Vars.md)

---

## Notes for AI Agents

1. **Execution Order:** Complete tasks 06 through 10 in sequence
2. **No Secrets:** Do not commit `.env.local`
3. **Documentation:** `.env.example` must reflect all required values
