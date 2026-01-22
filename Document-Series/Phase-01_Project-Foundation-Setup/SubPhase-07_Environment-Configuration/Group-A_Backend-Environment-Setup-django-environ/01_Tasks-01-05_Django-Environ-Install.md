# Tasks 01-05: Django-Environ Install

> **Phase:** 01 - Project Foundation & Setup  
> **SubPhase:** 07 - Environment Configuration  
> **Group:** A - Backend Environment Setup (django-environ)  
> **Document:** 01 of 03  
> **Tasks Covered:** 01, 02, 03, 04, 05

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Group:** None (First Group in SubPhase)
- **→ Next Document:** [02_Tasks-06-10_Env-Files-Settings.md](02_Tasks-06-10_Env-Files-Settings.md)

---

## Document Overview

This document covers the initial backend environment setup using `django-environ`, including installation, configuration scaffolding, and loading defaults.

### Tasks in This Document

| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 01 | Install django-environ | Medium |
| 02 | Create backend env module | Medium |
| 03 | Initialize environment loader | Medium |
| 04 | Define env loading order | Simple |
| 05 | Wire env loader into settings | Medium |

---

## Task 01: Install django-environ

### Overview
Add the backend dependency used to parse environment variables in Django settings.

### Dependencies
- SubPhase-02 Backend Project Initialization complete

### Instructions

1. **Add dependency**
   - Include the package in backend dependencies
   - Align version with project dependency policy

2. **Verify import availability**
   - Ensure the package is available for the backend settings module

### Expected Outcome
- Backend dependency list includes `django-environ`

### Verification Checklist
- [ ] Dependency is added to the backend requirements
- [ ] Backend settings can import the package

---

## Task 02: Create backend env module

### Overview
Create a dedicated module for environment variable loading and defaults.

### Dependencies
- Task 01: Install django-environ

### Instructions

1. **Create `env.py` module**
   - Place in backend configuration package
   - Keep it focused on environment configuration

2. **Define base configuration**
   - Add environment reader initialization
   - Establish base directory reference

### Expected Outcome
- `backend/config/env.py` exists and centralizes env loading

### Verification Checklist
- [ ] `env.py` exists in backend config
- [ ] Base directory and reader are defined

---

## Task 03: Initialize environment loader

### Overview
Define how environment variables are parsed and cast for the backend.

### Dependencies
- Task 02: Create backend env module

### Instructions

1. **Define default casting helpers**
   - Provide standard casting for booleans, lists, and integers

2. **Set default values for required settings**
   - Establish safe defaults for non-secret values

### Expected Outcome
- Environment loader has standard casting helpers and defaults

### Verification Checklist
- [ ] Default casting helpers are documented
- [ ] Required defaults are defined

---

## Task 04: Define env loading order

### Overview
Specify a clear loading order for environment files to prevent conflicts.

### Dependencies
- Task 03: Initialize environment loader

### Instructions

1. **Define file precedence**
   - Determine which environment files override others

2. **Document the order**
   - Record the order for developers and CI usage

### Expected Outcome
- A documented and consistent environment file precedence

### Verification Checklist
- [ ] Loading order is defined
- [ ] Ordering is documented for developers

---

## Task 05: Wire env loader into settings

### Overview
Connect the environment loader to Django settings so all configuration flows through `env.py`.

### Dependencies
- Task 04: Define env loading order

### Instructions

1. **Integrate env module with settings**
   - Ensure settings import the environment loader

2. **Validate fallback behavior**
   - Confirm default values apply when variables are missing

### Expected Outcome
- Django settings consistently read environment variables via `env.py`

### Verification Checklist
- [ ] Settings import `env.py`
- [ ] Defaults are respected when variables are absent

---

## Summary

### Tasks Completed in This Document

| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 01 | Install django-environ | Backend dependency added |
| 02 | Create backend env module | `backend/config/env.py` created |
| 03 | Initialize environment loader | Parsing and casting defaults defined |
| 04 | Define env loading order | Precedence documented |
| 05 | Wire env loader into settings | Settings use env loader |

### Next Steps
- Continue with [02_Tasks-06-10_Env-Files-Settings.md](02_Tasks-06-10_Env-Files-Settings.md)

---

## Notes for AI Agents

1. **Execution Order:** Complete tasks 01 through 05 in sequence
2. **No Secrets:** Do not introduce real secrets or credentials
3. **Consistency:** Use a single env loader across all settings files
