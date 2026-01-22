# Tasks 11-14: Core Env Vars

> **Phase:** 01 - Project Foundation & Setup  
> **SubPhase:** 07 - Environment Configuration  
> **Group:** A - Backend Environment Setup (django-environ)  
> **Document:** 03 of 03  
> **Tasks Covered:** 11, 12, 13, 14

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [02_Tasks-06-10_Env-Files-Settings.md](02_Tasks-06-10_Env-Files-Settings.md)
- **→ Next Group:** [../Group-B_Backend-Environment-Variables-Definition/](../Group-B_Backend-Environment-Variables-Definition/)

---

## Document Overview

This document defines the core backend environment variables and casting helpers used across the Django settings.

### Tasks in This Document

| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 11 | Define DEBUG flag | Simple |
| 12 | Define SECRET_KEY | Medium |
| 13 | Define ALLOWED_HOSTS | Simple |
| 14 | Add casting helpers | Simple |

---

## Task 11: Define DEBUG flag

### Overview
Introduce a DEBUG environment variable for safe configuration of debug behavior.

### Dependencies
- Task 10: Update production settings

### Instructions

1. **Define the variable**
   - Add `DEBUG` to the backend env example

2. **Wire into settings**
   - Ensure settings read the value through `env.py`

### Expected Outcome
- DEBUG is configurable via environment variables

### Verification Checklist
- [ ] DEBUG is listed in `.env.example`
- [ ] Settings read DEBUG from environment

---

## Task 12: Define SECRET_KEY

### Overview
Introduce a SECRET_KEY environment variable for secure deployments.

### Dependencies
- Task 11: Define DEBUG flag

### Instructions

1. **Define the variable**
   - Add `SECRET_KEY` to the backend env example
   - Mark as required and secret

2. **Wire into settings**
   - Ensure settings read the value through `env.py`

### Expected Outcome
- SECRET_KEY is configurable via environment variables

### Verification Checklist
- [ ] SECRET_KEY is listed in `.env.example`
- [ ] Settings read SECRET_KEY from environment

---

## Task 13: Define ALLOWED_HOSTS

### Overview
Configure allowed hosts using an environment variable to support multiple environments.

### Dependencies
- Task 12: Define SECRET_KEY

### Instructions

1. **Define the variable**
   - Add `ALLOWED_HOSTS` to the backend env example
   - Specify list format guidance in documentation

2. **Wire into settings**
   - Ensure settings read the value through `env.py`

### Expected Outcome
- ALLOWED_HOSTS is configurable via environment variables

### Verification Checklist
- [ ] ALLOWED_HOSTS is listed in `.env.example`
- [ ] Settings read ALLOWED_HOSTS from environment

---

## Task 14: Add casting helpers

### Overview
Add standard casting helpers for booleans, lists, and numeric values.

### Dependencies
- Task 13: Define ALLOWED_HOSTS

### Instructions

1. **Define casting helpers**
   - Add helper methods to `env.py` for common data types

2. **Document usage**
   - Describe how helpers are used in settings files

### Expected Outcome
- Casting helpers are available for all backend settings

### Verification Checklist
- [ ] Helpers exist in `env.py`
- [ ] Helper usage is documented

---

## Summary

### Tasks Completed in This Document

| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 11 | Define DEBUG flag | DEBUG environment variable added |
| 12 | Define SECRET_KEY | SECRET_KEY environment variable added |
| 13 | Define ALLOWED_HOSTS | ALLOWED_HOSTS environment variable added |
| 14 | Add casting helpers | Casting helpers documented |

### Next Steps
- Proceed to [../Group-B_Backend-Environment-Variables-Definition/](../Group-B_Backend-Environment-Variables-Definition/)

---

## Notes for AI Agents

1. **Execution Order:** Follow tasks 11 through 14 in sequence
2. **Security:** Treat SECRET_KEY as sensitive in all environments
3. **Consistency:** Use casting helpers for all non-string values
