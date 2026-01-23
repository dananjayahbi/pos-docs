# Tasks 15-20: Name, Create & Migrate

> **Phase:** 02 - Database Architecture & Multi-Tenancy  
> **SubPhase:** 09 - Tenant Provisioning Flow  
> **Group:** B - Schema Creation & Migrations  
> **Document:** 01 of 03  
> **Tasks Covered:** 15, 16, 17, 18, 19, 20

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Group:** [../Group-A_Provisioning-Service/00_GROUP_OVERVIEW.md](../Group-A_Provisioning-Service/00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-21-25_Verify-Failure-Cleanup.md](02_Tasks-21-25_Verify-Failure-Cleanup.md)

---

## Document Overview

This document defines schema name generation, validation, creation, permissions, and tenant migration execution.

### Tasks in This Document

| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 15 | Create Schema Name Generator | Medium |
| 16 | Validate Schema Name | Simple |
| 17 | Check Schema Exists | Simple |
| 18 | Create PostgreSQL Schema | Medium |
| 19 | Set Schema Permissions | Simple |
| 20 | Run Tenant Migrations | Medium |

---

## Task 15: Create Schema Name Generator

### Overview
Generate valid PostgreSQL schema names.

### Dependencies
- Task 14: Document Provisioning Service

### Instructions

1. **Define schema name format**
   - Use tenant_{name}_{uuid} format

2. **Document sanitization**
   - Ensure lowercase, numbers, underscore only

### Expected Outcome
- Schema name generator documented

### Verification Checklist
- [ ] Generator documented
- [ ] Sanitization noted

---

## Task 16: Validate Schema Name

### Overview
Validate schema names before creation.

### Dependencies
- Task 15: Create Schema Name Generator

### Instructions

1. **Validate schema name**
   - Reject invalid characters

2. **Document behavior**
   - Note error handling

### Expected Outcome
- Schema name validation documented

### Verification Checklist
- [ ] Validation documented
- [ ] Error handling noted

---

## Task 17: Check Schema Exists

### Overview
Check for existing schema before creation.

### Dependencies
- Task 16: Validate Schema Name

### Instructions

1. **Check schema existence**
   - Avoid collisions

2. **Document behavior**
   - Note existing schema handling

### Expected Outcome
- Schema existence check documented

### Verification Checklist
- [ ] Existence check documented
- [ ] Handling noted

---

## Task 18: Create PostgreSQL Schema

### Overview
Create the tenant schema in PostgreSQL.

### Dependencies
- Task 17: Check Schema Exists

### Instructions

1. **Create schema**
   - Use safe creation flow

2. **Document behavior**
   - Note error handling

### Expected Outcome
- Schema creation documented

### Verification Checklist
- [ ] Creation documented
- [ ] Error handling noted

---

## Task 19: Set Schema Permissions

### Overview
Set permissions for the new schema.

### Dependencies
- Task 18: Create PostgreSQL Schema

### Instructions

1. **Set permissions**
   - Apply role grants

2. **Document scope**
   - Note tables and sequences

### Expected Outcome
- Schema permissions documented

### Verification Checklist
- [ ] Permissions documented
- [ ] Scope noted

---

## Task 20: Run Tenant Migrations

### Overview
Run tenant migrations for the new schema.

### Dependencies
- Task 19: Set Schema Permissions

### Instructions

1. **Run tenant migrations**
   - Apply tenant schema migrations

2. **Document behavior**
   - Note order and expected duration

### Expected Outcome
- Tenant migrations documented

### Verification Checklist
- [ ] Migrations documented
- [ ] Behavior noted

---

## Summary

### Tasks Completed in This Document

| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 15 | Create Schema Name Generator | Generator documented |
| 16 | Validate Schema Name | Validation documented |
| 17 | Check Schema Exists | Existence check documented |
| 18 | Create PostgreSQL Schema | Schema creation documented |
| 19 | Set Schema Permissions | Permissions documented |
| 20 | Run Tenant Migrations | Migrations documented |

### Next Steps
- Continue with [02_Tasks-21-25_Verify-Failure-Cleanup.md](02_Tasks-21-25_Verify-Failure-Cleanup.md)

---

## Notes for AI Agents

1. **Execution Order:** Complete tasks 15 through 20 in sequence
2. **Naming:** Use tenant_{name}_{uuid} format
3. **No Code Snippets:** Avoid fenced code blocks in documentation
