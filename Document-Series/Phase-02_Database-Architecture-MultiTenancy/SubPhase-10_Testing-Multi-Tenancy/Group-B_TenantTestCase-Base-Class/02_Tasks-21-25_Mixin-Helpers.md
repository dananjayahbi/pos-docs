# Tasks 21-25: Mixin & Helpers

> **Phase:** 02 - Database Architecture & Multi-Tenancy  
> **SubPhase:** 10 - Testing Multi-Tenancy  
> **Group:** B - TenantTestCase Base Class  
> **Document:** 02 of 03  
> **Tasks Covered:** 21, 22, 23, 24, 25

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-15-20_Base-Class-Setup.md](01_Tasks-15-20_Base-Class-Setup.md)
- **→ Next Document:** [03_Tasks-26-28_Isolation-Rollback-Docs.md](03_Tasks-26-28_Isolation-Rollback-Docs.md)

---

## Document Overview

This document defines tenant context manager, multi-tenant mixin, two-tenant setup, tenant switching helper, and schema assertion helper.

### Tasks in This Document

| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 21 | Create Tenant Context Manager | Medium |
| 22 | Create Multi-Tenant Test Mixin | Medium |
| 23 | Create Two-Tenant Setup | Medium |
| 24 | Create Tenant Switching Helper | Simple |
| 25 | Create Schema Assertion Helper | Simple |

---

## Task 21: Create Tenant Context Manager

### Overview
Create a tenant context manager for switching contexts.

### Dependencies
- Task 20: Set Tenant Context

### Instructions

1. **Define context manager**
   - Allow with tenant context usage

2. **Document behavior**
   - Note context restoration

### Expected Outcome
- Tenant context manager documented

### Verification Checklist
- [ ] Manager documented
- [ ] Behavior noted

---

## Task 22: Create Multi-Tenant Test Mixin

### Overview
Create a mixin for multi-tenant test utilities.

### Dependencies
- Task 21: Create Tenant Context Manager

### Instructions

1. **Define mixin utilities**
   - Provide tenant setup and helpers

2. **Document usage**
   - Note mixin compatibility with base class

### Expected Outcome
- Multi-tenant mixin documented

### Verification Checklist
- [ ] Mixin documented
- [ ] Usage noted

---

## Task 23: Create Two-Tenant Setup

### Overview
Create helper to set up two tenants for tests.

### Dependencies
- Task 22: Create Multi-Tenant Test Mixin

### Instructions

1. **Define two-tenant setup**
   - Provide tenant_a and tenant_b

2. **Document isolation assumptions**
   - Note separate schemas

### Expected Outcome
- Two-tenant setup documented

### Verification Checklist
- [ ] Setup documented
- [ ] Isolation noted

---

## Task 24: Create Tenant Switching Helper

### Overview
Create a helper to switch tenants.

### Dependencies
- Task 23: Create Two-Tenant Setup

### Instructions

1. **Define switching helper**
   - Switch search path and context

2. **Document safety**
   - Ensure switching cleanup

### Expected Outcome
- Switching helper documented

### Verification Checklist
- [ ] Helper documented
- [ ] Safety noted

---

## Task 25: Create Schema Assertion Helper

### Overview
Create an assertion helper for schema context.

### Dependencies
- Task 24: Create Tenant Switching Helper

### Instructions

1. **Define schema assertion**
   - Validate current schema matches tenant

2. **Document usage**
   - Note integration in tests

### Expected Outcome
- Schema assertion helper documented

### Verification Checklist
- [ ] Assertion documented
- [ ] Usage noted

---

## Summary

### Tasks Completed in This Document

| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 21 | Create Tenant Context Manager | Manager documented |
| 22 | Create Multi-Tenant Test Mixin | Mixin documented |
| 23 | Create Two-Tenant Setup | Two-tenant setup documented |
| 24 | Create Tenant Switching Helper | Switching helper documented |
| 25 | Create Schema Assertion Helper | Assertion helper documented |

### Next Steps
- Continue with [03_Tasks-26-28_Isolation-Rollback-Docs.md](03_Tasks-26-28_Isolation-Rollback-Docs.md)

---

## Notes for AI Agents

1. **Execution Order:** Complete tasks 21 through 25 in sequence
2. **Context:** Use tenant_context helper
3. **No Code Snippets:** Avoid fenced code blocks in documentation
