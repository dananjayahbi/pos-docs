# Tasks 27-31: Public Schema Template

> **Phase:** 02 - Database Architecture & Multi-Tenancy  
> **SubPhase:** 01 - PostgreSQL Configuration  
> **Group:** C - Schema Configuration  
> **Document:** 01 of 03  
> **Tasks Covered:** 27, 28, 29, 30, 31

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Group:** [../Group-B_Database-Configuration/](../Group-B_Database-Configuration/)
- **→ Next Document:** [02_Tasks-32-35_Schema-Functions.md](02_Tasks-32-35_Schema-Functions.md)

---

## Document Overview

This document defines the public schema template and naming conventions for tenant schemas.

### Tasks in This Document

| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 27 | Define schema naming convention | Medium |
| 28 | Document public schema baseline | Medium |
| 29 | Create schema naming documentation | Simple |
| 30 | Define search_path expectations | Medium |
| 31 | Validate schema template | Medium |

---

## Task 27: Define schema naming convention

### Overview
Define how tenant schemas are named for multi-tenancy.

### Dependencies
- Group B completed

### Instructions

1. **Define naming pattern**
   - Use `tenant_<slug>` format

2. **Document constraints**
   - Define allowed characters and length

### Expected Outcome
- Schema naming convention defined and documented

### Verification Checklist
- [ ] Naming pattern defined
- [ ] Constraints documented

---

## Task 28: Document public schema baseline

### Overview
Document what lives in the public schema and why.

### Dependencies
- Task 27: Define schema naming convention

### Instructions

1. **Define public schema contents**
   - List shared tables and metadata

2. **Document separation rules**
   - Clarify what stays in tenant schemas

### Expected Outcome
- Public schema baseline documented

### Verification Checklist
- [ ] Public schema contents documented
- [ ] Separation rules documented

---

## Task 29: Create schema naming documentation

### Overview
Create documentation for schema naming rules.

### Dependencies
- Task 28: Document public schema baseline

### Instructions

1. **Create `docs/database/schema-naming.md`**
   - Document schema naming patterns and examples

2. **Link from docs index**
   - Add navigation links

### Expected Outcome
- Schema naming documentation created

### Verification Checklist
- [ ] `docs/database/schema-naming.md` exists
- [ ] Navigation links included

---

## Task 30: Define search_path expectations

### Overview
Document how search_path is set for tenant routing.

### Dependencies
- Task 29: Create schema naming documentation

### Instructions

1. **Describe search_path behavior**
   - Explain public-first and tenant schema ordering

2. **Link to middleware behavior**
   - Reference tenant middleware responsibilities

### Expected Outcome
- search_path expectations documented

### Verification Checklist
- [ ] search_path behavior documented
- [ ] Middleware linkage documented

---

## Task 31: Validate schema template

### Overview
Validate that schema templates are applied for tenant creation.

### Dependencies
- Task 30: Define search_path expectations

### Instructions

1. **Verify template behavior**
   - Ensure new tenants receive correct schema layout

2. **Record validation**
   - Capture validation date and outcome

### Expected Outcome
- Schema template validation documented

### Verification Checklist
- [ ] Template behavior validated
- [ ] Validation record documented

---

## Summary

### Tasks Completed in This Document

| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 27 | Define schema naming convention | Naming convention defined |
| 28 | Document public schema baseline | Public schema baseline documented |
| 29 | Create schema naming documentation | `schema-naming.md` created |
| 30 | Define search_path expectations | search_path documented |
| 31 | Validate schema template | Validation recorded |

### Next Steps
- Continue with [02_Tasks-32-35_Schema-Functions.md](02_Tasks-32-35_Schema-Functions.md)

---

## Notes for AI Agents

1. **Execution Order:** Complete tasks 27 through 31 in sequence
2. **Multi-tenancy:** Use `tenant_<slug>` naming
3. **No Code Snippets:** Avoid fenced code blocks in documentation
