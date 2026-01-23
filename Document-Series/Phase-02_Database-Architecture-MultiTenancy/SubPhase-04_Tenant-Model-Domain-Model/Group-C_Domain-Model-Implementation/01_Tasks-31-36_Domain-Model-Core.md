# Tasks 31-36: Domain Model Core

> **Phase:** 02 - Database Architecture & Multi-Tenancy  
> **SubPhase:** 04 - Tenant Model & Domain Model  
> **Group:** C - Domain Model Implementation  
> **Document:** 01 of 03  
> **Tasks Covered:** 31, 32, 33, 34, 35, 36

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Group:** [../Group-B_Tenant-Business-Information/](../Group-B_Tenant-Business-Information/)
- **→ Next Document:** [02_Tasks-37-42_Domain-Type-SSL-Meta.md](02_Tasks-37-42_Domain-Type-SSL-Meta.md)

---

## Document Overview

This document defines the core domain model for tenant routing.

### Tasks in This Document

| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 31 | Create domain model file | Medium |
| 32 | Add DomainMixin base | Medium |
| 33 | Add domain name field | Medium |
| 34 | Add primary flag | Medium |
| 35 | Link domain to tenant | Medium |
| 36 | Validate domain model core | Medium |

---

## Task 31: Create domain model file

### Overview
Create the domain model module in the tenants app.

### Dependencies
- Group B completed

### Instructions

1. **Create `backend/apps/tenants/models/domain.py`**
   - Place domain model in tenants app

2. **Document purpose**
   - Note model handles domain routing

### Expected Outcome
- Domain model file created

### Verification Checklist
- [ ] Domain model file exists
- [ ] Purpose documented

---

## Task 32: Add DomainMixin base

### Overview
Use DomainMixin as the base for the domain model.

### Dependencies
- Task 31: Create domain model file

### Instructions

1. **Add DomainMixin**
   - Ensure domain model inherits from DomainMixin

2. **Document requirement**
   - Note django-tenants dependency

### Expected Outcome
- DomainMixin applied to domain model

### Verification Checklist
- [ ] DomainMixin applied
- [ ] Requirement documented

---

## Task 33: Add domain name field

### Overview
Add domain name field for tenant routing.

### Dependencies
- Task 32: Add DomainMixin base

### Instructions

1. **Add domain field**
   - Store full domain value

2. **Document validation**
   - Note format and uniqueness requirements

### Expected Outcome
- Domain field defined

### Verification Checklist
- [ ] Domain field defined
- [ ] Validation documented

---

## Task 34: Add primary flag

### Overview
Add a flag to mark the primary domain for a tenant.

### Dependencies
- Task 33: Add domain name field

### Instructions

1. **Add primary flag**
   - Ensure only one primary domain per tenant

2. **Document rule**
   - Note primary domain requirement

### Expected Outcome
- Primary flag defined

### Verification Checklist
- [ ] Primary flag defined
- [ ] Primary domain rule documented

---

## Task 35: Link domain to tenant

### Overview
Ensure domain model links to tenant model.

### Dependencies
- Task 34: Add primary flag

### Instructions

1. **Add tenant relationship**
   - Link domain to tenant model

2. **Document relationship**
   - Note tenant ownership of domains

### Expected Outcome
- Domain linked to tenant model

### Verification Checklist
- [ ] Domain linked to tenant model
- [ ] Relationship documented

---

## Task 36: Validate domain model core

### Overview
Validate core domain fields and relationships.

### Dependencies
- Task 35: Link domain to tenant

### Instructions

1. **Review domain model**
   - Ensure required fields and relations exist

2. **Record validation**
   - Capture verification outcome

### Expected Outcome
- Domain model core validated

### Verification Checklist
- [ ] Domain model validated
- [ ] Validation record documented

---

## Summary

### Tasks Completed in This Document

| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 31 | Create domain model file | Domain model file created |
| 32 | Add DomainMixin base | DomainMixin applied |
| 33 | Add domain name field | Domain field defined |
| 34 | Add primary flag | Primary flag defined |
| 35 | Link domain to tenant | Domain linked to tenant |
| 36 | Validate domain model core | Core validated |

### Next Steps
- Continue with [02_Tasks-37-42_Domain-Type-SSL-Meta.md](02_Tasks-37-42_Domain-Type-SSL-Meta.md)

---

## Notes for AI Agents

1. **Execution Order:** Complete tasks 31 through 36 in sequence
2. **Primary Domain:** Enforce one primary domain per tenant
3. **No Code Snippets:** Avoid fenced code blocks in documentation
