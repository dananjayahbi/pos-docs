# Tasks 07-12: Status, Schema & Meta

> **Phase:** 02 - Database Architecture & Multi-Tenancy  
> **SubPhase:** 04 - Tenant Model & Domain Model  
> **Group:** A - Tenant Model Foundation  
> **Document:** 02 of 03  
> **Tasks Covered:** 07, 08, 09, 10, 11, 12

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-01-06_Tenant-Model-Core.md](01_Tasks-01-06_Tenant-Model-Core.md)
- **→ Next Document:** [03_Tasks-13-16_Manager-Querysets.md](03_Tasks-13-16_Manager-Querysets.md)

---

## Document Overview

This document adds status fields, schema metadata, and model Meta configuration.

### Tasks in This Document

| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 07 | Add status fields | Medium |
| 08 | Add paid_until field | Medium |
| 09 | Add onboarding fields | Medium |
| 10 | Add schema metadata | Medium |
| 11 | Configure model Meta | Medium |
| 12 | Validate status and meta | Medium |

---

## Task 07: Add status fields

### Overview
Add status fields for tenant lifecycle tracking.

### Dependencies
- Task 06: Validate tenant model core

### Instructions

1. **Add status fields**
   - Include active, suspended, and archived flags

2. **Document usage**
   - Note how status affects access

### Expected Outcome
- Status fields defined

### Verification Checklist
- [ ] Status fields defined
- [ ] Usage documented

---

## Task 08: Add paid_until field

### Overview
Track subscription payment status at tenant level.

### Dependencies
- Task 07: Add status fields

### Instructions

1. **Add paid_until field**
   - Store subscription validity date

2. **Document behavior**
   - Note how access changes when expired

### Expected Outcome
- paid_until field defined

### Verification Checklist
- [ ] paid_until field defined
- [ ] Behavior documented

---

## Task 09: Add onboarding fields

### Overview
Add fields for onboarding progress tracking.

### Dependencies
- Task 08: Add paid_until field

### Instructions

1. **Add onboarding fields**
   - Include onboarding step and completion flag

2. **Document usage**
   - Note how onboarding is tracked

### Expected Outcome
- Onboarding fields defined

### Verification Checklist
- [ ] Onboarding fields defined
- [ ] Usage documented

---

## Task 10: Add schema metadata

### Overview
Add metadata fields related to schema configuration.

### Dependencies
- Task 09: Add onboarding fields

### Instructions

1. **Add schema metadata fields**
   - Include schema creation timestamp and version

2. **Document usage**
   - Note how metadata is used for migrations

### Expected Outcome
- Schema metadata fields defined

### Verification Checklist
- [ ] Schema metadata fields defined
- [ ] Usage documented

---

## Task 11: Configure model Meta

### Overview
Add Meta configuration for tenant model ordering and indexing.

### Dependencies
- Task 10: Add schema metadata

### Instructions

1. **Define Meta options**
   - Configure ordering and indexes

2. **Document rationale**
   - Explain indexing choices

### Expected Outcome
- Model Meta configuration documented

### Verification Checklist
- [ ] Meta options defined
- [ ] Rationale documented

---

## Task 12: Validate status and meta

### Overview
Validate status and metadata fields for completeness.

### Dependencies
- Task 11: Configure model Meta

### Instructions

1. **Review fields**
   - Ensure all status and meta fields exist

2. **Record validation**
   - Capture verification outcome

### Expected Outcome
- Status and meta fields validated

### Verification Checklist
- [ ] Status and meta fields validated
- [ ] Validation record documented

---

## Summary

### Tasks Completed in This Document

| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 07 | Add status fields | Status fields defined |
| 08 | Add paid_until field | Payment status tracked |
| 09 | Add onboarding fields | Onboarding tracking added |
| 10 | Add schema metadata | Schema metadata defined |
| 11 | Configure model Meta | Meta options documented |
| 12 | Validate status and meta | Validation recorded |

### Next Steps
- Continue with [03_Tasks-13-16_Manager-Querysets.md](03_Tasks-13-16_Manager-Querysets.md)

---

## Notes for AI Agents

1. **Execution Order:** Complete tasks 07 through 12 in sequence
2. **Lifecycle:** Ensure status fields align with access control
3. **No Code Snippets:** Avoid fenced code blocks in documentation
