# Tasks 81-86: Commands & Verification

> **Phase:** 02 - Database Architecture & Multi-Tenancy  
> **SubPhase:** 02 - Django-Tenants Installation  
> **Group:** F - Initial Migration & Verification  
> **Document:** 03 of 03  
> **Tasks Covered:** 81, 82, 83, 84, 85, 86

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [02_Tasks-75-80_Test-Tenant-Isolation.md](02_Tasks-75-80_Test-Tenant-Isolation.md)
- **→ Next Group:** None (Last Group in SubPhase)

---

## Document Overview

This document adds tenant management commands, Makefile targets, and final verification.

### Tasks in This Document

| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 81 | Create tenant_create command | Medium |
| 82 | Create tenant_list command | Medium |
| 83 | Add Makefile tenant targets | Medium |
| 84 | Validate commands | Medium |
| 85 | Document commands | Medium |
| 86 | Create final commit | Simple |

---

## Task 81: Create tenant_create command

### Overview
Add a management command to create tenants.

### Dependencies
- Task 80: Record isolation results

### Instructions

1. **Create management command**
   - Add `tenant_create` under tenants commands

2. **Document inputs**
   - Specify required fields and validation rules

### Expected Outcome
- `tenant_create` command created

### Verification Checklist
- [ ] Command created
- [ ] Inputs documented

---

## Task 82: Create tenant_list command

### Overview
Add a management command to list tenants.

### Dependencies
- Task 81: Create tenant_create command

### Instructions

1. **Create management command**
   - Add `tenant_list` under tenants commands

2. **Document output**
   - Describe expected output fields

### Expected Outcome
- `tenant_list` command created

### Verification Checklist
- [ ] Command created
- [ ] Output documented

---

## Task 83: Add Makefile tenant targets

### Overview
Add Makefile targets for tenant management commands.

### Dependencies
- Task 82: Create tenant_list command

### Instructions

1. **Add Makefile targets**
   - Add targets for tenant create and list

2. **Document usage**
   - Provide command names in plain text steps

### Expected Outcome
- Makefile targets added and documented

### Verification Checklist
- [ ] Makefile targets added
- [ ] Usage documented

---

## Task 84: Validate commands

### Overview
Validate tenant management commands execute correctly.

### Dependencies
- Task 83: Add Makefile tenant targets

### Instructions

1. **Run command validations**
   - Validate tenant_create and tenant_list behavior

2. **Record results**
   - Capture validation outcomes

### Expected Outcome
- Tenant management commands validated

### Verification Checklist
- [ ] Commands validated
- [ ] Results documented

---

## Task 85: Document commands

### Overview
Document tenant management commands for developers.

### Dependencies
- Task 84: Validate commands

### Instructions

1. **Add command documentation**
   - Include commands in multi-tenancy docs

2. **Link documentation**
   - Add links from docs index

### Expected Outcome
- Tenant command documentation created and linked

### Verification Checklist
- [ ] Command documentation exists
- [ ] Links added

---

## Task 86: Create final commit

### Overview
Create the final commit for django-tenants installation.

### Dependencies
- Task 85: Document commands

### Instructions

1. **Confirm all artifacts**
   - Ensure commands, docs, and tests are complete

2. **Create final commit**
   - Use commit message: feat: install and configure django-tenants

3. **Update progress tracking**
   - Mark SubPhase-02 as complete in progress tracking files

### Expected Outcome
- Final commit created and progress updated

### Verification Checklist
- [ ] Artifacts complete and linked
- [ ] Final commit created with required message
- [ ] Progress tracking updated

---

## Summary

### Tasks Completed in This Document

| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 81 | Create tenant_create command | `tenant_create` command created |
| 82 | Create tenant_list command | `tenant_list` command created |
| 83 | Add Makefile tenant targets | Makefile targets added |
| 84 | Validate commands | Command validation recorded |
| 85 | Document commands | Command docs created |
| 86 | Create final commit | Final commit created |

### Next Steps
- SubPhase-02 complete after final verification and commit

---

## Notes for AI Agents

1. **Execution Order:** Complete tasks 81 through 86 in sequence
2. **Commands:** Provide command names as plain text steps
3. **No Code Snippets:** Avoid fenced code blocks in documentation
