# Tasks 17-21: Domain & Schema Settings

> **Phase:** 02 - Database Architecture & Multi-Tenancy  
> **SubPhase:** 02 - Django-Tenants Installation  
> **Group:** B - Database Settings Configuration  
> **Document:** 02 of 03  
> **Tasks Covered:** 17, 18, 19, 20, 21

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-11-16_Database-Engine-Models.md](01_Tasks-11-16_Database-Engine-Models.md)
- **→ Next Document:** [03_Tasks-22-26_Auto-Create-Admin-Docs.md](03_Tasks-22-26_Auto-Create-Admin-Docs.md)

---

## Document Overview

This document configures domain and schema-related django-tenants settings.

### Tasks in This Document

| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 17 | Configure tenant domain settings | Medium |
| 18 | Configure public schema name | Simple |
| 19 | Configure tenant schema settings | Medium |
| 20 | Configure auto-create/drop | Medium |
| 21 | Validate schema settings | Medium |

---

## Task 17: Configure tenant domain settings

### Overview
Define domain-related settings for tenant routing.

### Dependencies
- Task 16: Validate database settings

### Instructions

1. **Set domain settings**
   - Define base tenant domain and fallback behavior

2. **Document domain rules**
   - Note how domains map to tenants

### Expected Outcome
- Tenant domain settings configured and documented

### Verification Checklist
- [ ] Domain settings configured
- [ ] Domain rules documented

---

## Task 18: Configure public schema name

### Overview
Set the public schema name used by django-tenants.

### Dependencies
- Task 17: Configure tenant domain settings

### Instructions

1. **Set public schema name**
   - Use the standard `public` schema

2. **Document usage**
   - Note what data lives in public schema

### Expected Outcome
- Public schema name configured

### Verification Checklist
- [ ] Public schema name set
- [ ] Public schema usage documented

---

## Task 19: Configure tenant schema settings

### Overview
Define tenant schema settings and naming patterns.

### Dependencies
- Task 18: Configure public schema name

### Instructions

1. **Set tenant schema settings**
   - Align with `tenant_<slug>` naming

2. **Document naming expectations**
   - Reference schema naming docs

### Expected Outcome
- Tenant schema settings configured and documented

### Verification Checklist
- [ ] Tenant schema settings set
- [ ] Naming expectations documented

---

## Task 20: Configure auto-create/drop

### Overview
Define auto-create and auto-drop schema behavior.

### Dependencies
- Task 19: Configure tenant schema settings

### Instructions

1. **Set auto-create and auto-drop**
   - Ensure AUTO_DROP_SCHEMA is false for safety

2. **Document behavior**
   - Note when schemas are created or dropped

### Expected Outcome
- Auto-create/drop settings configured

### Verification Checklist
- [ ] AUTO_DROP_SCHEMA set to false
- [ ] Behavior documented

---

## Task 21: Validate schema settings

### Overview
Verify schema-related settings are applied correctly.

### Dependencies
- Task 20: Configure auto-create/drop

### Instructions

1. **Load settings**
   - Confirm schema settings load without errors

2. **Record verification**
   - Note results in documentation

### Expected Outcome
- Schema settings validated

### Verification Checklist
- [ ] Settings load without errors
- [ ] Verification record documented

---

## Summary

### Tasks Completed in This Document

| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 17 | Configure tenant domain settings | Domain settings configured |
| 18 | Configure public schema name | Public schema configured |
| 19 | Configure tenant schema settings | Tenant schema settings set |
| 20 | Configure auto-create/drop | AUTO_DROP_SCHEMA disabled |
| 21 | Validate schema settings | Schema settings validated |

### Next Steps
- Continue with [03_Tasks-22-26_Auto-Create-Admin-Docs.md](03_Tasks-22-26_Auto-Create-Admin-Docs.md)

---

## Notes for AI Agents

1. **Execution Order:** Complete tasks 17 through 21 in sequence
2. **Safety:** Keep AUTO_DROP_SCHEMA set to false
3. **No Code Snippets:** Avoid fenced code blocks in documentation
