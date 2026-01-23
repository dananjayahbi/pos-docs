# Tasks 29-35: Rules & Relations

> **Phase:** 02 - Database Architecture & Multi-Tenancy  
> **SubPhase:** 07 - Database Router Setup  
> **Group:** C - Cross-Schema Prevention  
> **Document:** 01 of 02  
> **Tasks Covered:** 29, 30, 31, 32, 33, 34, 35

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Group:** [../Group-B_Schema-Routing-Logic/00_GROUP_OVERVIEW.md](../Group-B_Schema-Routing-Logic/00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-36-42_Errors-Logging-Validation.md](02_Tasks-36-42_Errors-Logging-Validation.md)

---

## Document Overview

This document defines cross-schema rules and relation enforcement.

### Tasks in This Document

| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 29 | Define Cross-Schema Rules | Simple |
| 30 | Block Cross-Tenant FK | Medium |
| 31 | Block Cross-Tenant Queries | Medium |
| 32 | Allow Shared-Tenant FK | Simple |
| 33 | Block Tenant-Shared FK | Simple |
| 34 | Implement allow_relation | Medium |
| 35 | Get Model Schema | Medium |

---

## Task 29: Define Cross-Schema Rules

### Overview
Define allowed and blocked cross-schema operations.

### Dependencies
- Task 28: Document Routing Logic

### Instructions

1. **Define rules**
   - Allow tenant-to-shared, block shared-to-tenant

2. **Document rationale**
   - Emphasize data isolation

### Expected Outcome
- Cross-schema rules documented

### Verification Checklist
- [ ] Rules documented
- [ ] Rationale noted

---

## Task 30: Block Cross-Tenant FK

### Overview
Block foreign keys across tenant schemas.

### Dependencies
- Task 29: Define Cross-Schema Rules

### Instructions

1. **Block cross-tenant FK**
   - Prevent tenant A to tenant B relations

2. **Document behavior**
   - Note error handling

### Expected Outcome
- Cross-tenant FK blocking documented

### Verification Checklist
- [ ] FK blocking documented
- [ ] Error behavior noted

---

## Task 31: Block Cross-Tenant Queries

### Overview
Block queries that span tenant schemas.

### Dependencies
- Task 29: Define Cross-Schema Rules

### Instructions

1. **Block cross-tenant queries**
   - Prevent schema-hopping queries

2. **Document behavior**
   - Note logging requirements

### Expected Outcome
- Cross-tenant query blocking documented

### Verification Checklist
- [ ] Query blocking documented
- [ ] Logging noted

---

## Task 32: Allow Shared-Tenant FK

### Overview
Allow tenant models to reference shared data.

### Dependencies
- Task 29: Define Cross-Schema Rules

### Instructions

1. **Allow tenant to shared FK**
   - Permit references to shared models

2. **Document usage**
   - Note examples of shared references

### Expected Outcome
- Shared FK allowance documented

### Verification Checklist
- [ ] Allowance documented
- [ ] Usage noted

---

## Task 33: Block Tenant-Shared FK

### Overview
Block shared models from referencing tenant models.

### Dependencies
- Task 29: Define Cross-Schema Rules

### Instructions

1. **Block shared to tenant FK**
   - Prevent shared schema writing to tenant

2. **Document behavior**
   - Note enforcement rules

### Expected Outcome
- Shared-to-tenant blocking documented

### Verification Checklist
- [ ] Blocking documented
- [ ] Enforcement noted

---

## Task 34: Implement allow_relation

### Overview
Implement allow_relation to enforce cross-schema rules.

### Dependencies
- Task 30: Block Cross-Tenant FK

### Instructions

1. **Define allow_relation logic**
   - Apply schema compatibility rules

2. **Document behavior**
   - Note allowed relation types

### Expected Outcome
- allow_relation documented

### Verification Checklist
- [ ] allow_relation documented
- [ ] Behavior noted

---

## Task 35: Get Model Schema

### Overview
Determine the schema for a given model.

### Dependencies
- Task 34: Implement allow_relation

### Instructions

1. **Determine model schema**
   - Use model metadata or context

2. **Document usage**
   - Note how it feeds allow_relation

### Expected Outcome
- Model schema retrieval documented

### Verification Checklist
- [ ] Model schema retrieval documented
- [ ] Usage noted

---

## Summary

### Tasks Completed in This Document

| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 29 | Define Cross-Schema Rules | Rules documented |
| 30 | Block Cross-Tenant FK | FK blocking documented |
| 31 | Block Cross-Tenant Queries | Query blocking documented |
| 32 | Allow Shared-Tenant FK | Shared FK allowance documented |
| 33 | Block Tenant-Shared FK | Blocking documented |
| 34 | Implement allow_relation | allow_relation documented |
| 35 | Get Model Schema | Schema retrieval documented |

### Next Steps
- Continue with [02_Tasks-36-42_Errors-Logging-Validation.md](02_Tasks-36-42_Errors-Logging-Validation.md)

---

## Notes for AI Agents

1. **Execution Order:** Complete tasks 29 through 35 in sequence
2. **Isolation:** Prevent cross-tenant data access
3. **No Code Snippets:** Avoid fenced code blocks in documentation
