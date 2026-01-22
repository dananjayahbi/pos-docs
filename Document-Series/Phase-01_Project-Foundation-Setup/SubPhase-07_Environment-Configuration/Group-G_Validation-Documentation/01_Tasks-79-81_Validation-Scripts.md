# Tasks 79-81: Validation Scripts

> **Phase:** 01 - Project Foundation & Setup  
> **SubPhase:** 07 - Environment Configuration  
> **Group:** G - Validation & Documentation  
> **Document:** 01 of 02  
> **Tasks Covered:** 79, 80, 81

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Group:** [../Group-F_Secrets-Management-Strategy/](../Group-F_Secrets-Management-Strategy/)
- **→ Next Document:** [02_Tasks-82-84_Documentation-Verification.md](02_Tasks-82-84_Documentation-Verification.md)

---

## Document Overview

This document introduces backend and frontend environment validation scripts and Makefile commands to run them.

### Tasks in This Document

| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 79 | Create Env Validation Script | Medium |
| 80 | Create Frontend Env Check | Medium |
| 81 | Add Makefile Commands | Simple |

---

## Task 79: Create Env Validation Script

### Overview
Create a backend validation script to verify required environment variables and formats.

### Dependencies
- Task 30: Finalize backend env example

### Instructions

1. **Create backend validation script**
   - Place in `scripts/validate_env.py`
   - Validate required backend variables and formats

2. **Define exit behavior**
   - Use non-zero exit status on validation failure

3. **Document usage**
   - Add usage notes to environment documentation

### Expected Outcome
- Backend env validation script exists and is documented

### Verification Checklist
- [ ] `scripts/validate_env.py` exists
- [ ] Script returns non-zero on failure
- [ ] Usage documented

---

## Task 80: Create Frontend Env Check

### Overview
Create a frontend validation script to verify required variables with Zod.

### Dependencies
- Task 56: Document frontend env variables

### Instructions

1. **Create frontend validation script**
   - Place in `frontend/scripts/check-env.js`

2. **Validate client and server variables**
   - Ensure `NEXT_PUBLIC_` variables are validated separately

3. **Define exit behavior**
   - Use non-zero exit status on validation failure

### Expected Outcome
- Frontend env validation script exists and is documented

### Verification Checklist
- [ ] `frontend/scripts/check-env.js` exists
- [ ] Client and server variables are validated
- [ ] Script returns non-zero on failure

---

## Task 81: Add Makefile Commands

### Overview
Add Makefile commands to run backend and frontend environment validation.

### Dependencies
- Task 79: Create Env Validation Script

### Instructions

1. **Add Makefile targets**
   - Provide separate targets for backend and frontend
   - Provide a combined target for full validation

2. **Document commands**
   - Add Makefile usage notes to environment documentation

### Expected Outcome
- Makefile includes env validation targets

### Verification Checklist
- [ ] Makefile includes backend validation target
- [ ] Makefile includes frontend validation target
- [ ] Combined validation target exists

---

## Summary

### Tasks Completed in This Document

| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 79 | Create Env Validation Script | `scripts/validate_env.py` created |
| 80 | Create Frontend Env Check | `frontend/scripts/check-env.js` created |
| 81 | Add Makefile Commands | Makefile targets added |

### Next Steps
- Continue with [02_Tasks-82-84_Documentation-Verification.md](02_Tasks-82-84_Documentation-Verification.md)

---

## Notes for AI Agents

1. **Execution Order:** Complete tasks 79 through 81 in sequence
2. **Exit Codes:** Validation scripts must fail on invalid config
3. **Documentation:** Document how to run validation from Makefile
