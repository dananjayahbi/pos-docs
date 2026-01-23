# Tasks 85-89: Settings, Migrations & Verify

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 01 - Django Apps Structure  
> **Group:** G - Integration & Configuration  
> **Document:** 02 of 03  
> **Tasks Covered:** 85, 86, 87, 88, 89

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-79-84_Integrations-URLs.md](01_Tasks-79-84_Integrations-URLs.md)
- **→ Next Document:** [03_Tasks-90-92_Docs-Commit-Final.md](03_Tasks-90-92_Docs-Commit-Final.md)

---

## Document Overview

This document covers app ordering, shared and tenant app configuration, initial migrations, and verification of app structure.

### Tasks in This Document

| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 85 | Update INSTALLED_APPS Order | Medium |
| 86 | Configure SHARED_APPS | Medium |
| 87 | Configure TENANT_APPS | Medium |
| 88 | Create Initial Migrations | Medium |
| 89 | Verify App Structure | Simple |

---

## Task 85: Update INSTALLED_APPS Order

### Overview
Update INSTALLED_APPS ordering.

### Dependencies
- Task 84: Create API Router

### Instructions

1. **Define ordering**
   - Ensure shared apps before tenant apps

2. **Document rationale**
   - Prevent schema misconfiguration

### Expected Outcome
- INSTALLED_APPS order documented

### Verification Checklist
- [ ] Order documented
- [ ] Rationale noted

---

## Task 86: Configure SHARED_APPS

### Overview
Configure SHARED_APPS for public schema.

### Dependencies
- Task 85: Update INSTALLED_APPS Order

### Instructions

1. **Define SHARED_APPS list**
   - Include tenants and core shared dependencies

2. **Document usage**
   - Note schema separation rules

### Expected Outcome
- SHARED_APPS configuration documented

### Verification Checklist
- [ ] SHARED_APPS documented
- [ ] Usage noted

---

## Task 87: Configure TENANT_APPS

### Overview
Configure TENANT_APPS for tenant schema.

### Dependencies
- Task 86: Configure SHARED_APPS

### Instructions

1. **Define TENANT_APPS list**
   - Include per-tenant apps in correct order

2. **Document usage**
   - Note per-tenant model placement

### Expected Outcome
- TENANT_APPS configuration documented

### Verification Checklist
- [ ] TENANT_APPS documented
- [ ] Usage noted

---

## Task 88: Create Initial Migrations

### Overview
Create initial migrations for all apps.

### Dependencies
- Task 87: Configure TENANT_APPS

### Instructions

1. **Define migration scope**
   - Generate migrations for new apps

2. **Document expectations**
   - No schema errors

### Expected Outcome
- Initial migrations documented

### Verification Checklist
- [ ] Scope documented
- [ ] Expectations noted

---

## Task 89: Verify App Structure

### Overview
Verify the full app structure is consistent.

### Dependencies
- Task 88: Create Initial Migrations

### Instructions

1. **Define verification checks**
   - Ensure all apps present and registered

2. **Document validation**
   - Note any structural checks

### Expected Outcome
- App structure verification documented

### Verification Checklist
- [ ] Checks documented
- [ ] Validation noted

---

## Summary

### Tasks Completed in This Document

| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 85 | Update INSTALLED_APPS Order | Ordering documented |
| 86 | Configure SHARED_APPS | SHARED_APPS documented |
| 87 | Configure TENANT_APPS | TENANT_APPS documented |
| 88 | Create Initial Migrations | Migrations documented |
| 89 | Verify App Structure | Verification documented |

### Next Steps
- Continue with [03_Tasks-90-92_Docs-Commit-Final.md](03_Tasks-90-92_Docs-Commit-Final.md)

---

## Notes for AI Agents

1. **Execution Order:** Complete tasks 85 through 89 in sequence
2. **Settings:** Keep shared vs tenant separation correct
3. **No Code Snippets:** Avoid fenced code blocks in documentation
