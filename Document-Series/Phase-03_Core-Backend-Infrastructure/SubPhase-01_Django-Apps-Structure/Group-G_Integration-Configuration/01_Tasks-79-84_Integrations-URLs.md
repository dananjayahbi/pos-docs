# Tasks 79-84: Integrations & URLs

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 01 - Django Apps Structure  
> **Group:** G - Integration & Configuration  
> **Document:** 01 of 03  
> **Tasks Covered:** 79, 80, 81, 82, 83, 84

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Group:** [../Group-F_Supporting-Module-Apps/00_GROUP_OVERVIEW.md](../Group-F_Supporting-Module-Apps/00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-85-89_Settings-Migrations-Verify.md](02_Tasks-85-89_Settings-Migrations-Verify.md)

---

## Document Overview

This document covers integrations app creation, main URL routing setup, inclusion of all app URLs, and API v1 routing.

### Tasks in This Document

| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 79 | Create integrations App | Simple |
| 80 | Create integrations Structure | Simple |
| 81 | Register integrations in Settings | Simple |
| 82 | Create Main urls.py Router | Medium |
| 83 | Include All App URLs | Medium |
| 84 | Create API Router | Simple |

---

## Task 79: Create integrations App

### Overview
Create the integrations app.

### Dependencies
- Task 78: Register reports in Settings

### Instructions

1. **Create integrations app**
   - Establish backend/apps/integrations

2. **Document purpose**
   - External services integration

### Expected Outcome
- Integrations app documented

### Verification Checklist
- [ ] App documented
- [ ] Purpose noted

---

## Task 80: Create integrations Structure

### Overview
Create the integrations app structure.

### Dependencies
- Task 79: Create integrations App

### Instructions

1. **Define structure**
   - Include apps.py, models.py, admin.py, urls.py

2. **Document placeholders**
   - Note future model implementation

### Expected Outcome
- Integrations structure documented

### Verification Checklist
- [ ] Structure documented
- [ ] Placeholders noted

---

## Task 81: Register integrations in Settings

### Overview
Register integrations app in settings.

### Dependencies
- Task 80: Create integrations Structure

### Instructions

1. **Register integrations in TENANT_APPS**
   - Per-tenant integrations data

2. **Document placement**
   - Note app ordering

### Expected Outcome
- Integrations registration documented

### Verification Checklist
- [ ] Registration documented
- [ ] Placement noted

---

## Task 82: Create Main urls.py Router

### Overview
Create the main URL router.

### Dependencies
- Task 81: Register integrations in Settings

### Instructions

1. **Define main router**
   - Include admin and API namespace

2. **Document placement**
   - Note config/urls.py location

### Expected Outcome
- Main URL router documented

### Verification Checklist
- [ ] Router documented
- [ ] Placement noted

---

## Task 83: Include All App URLs

### Overview
Include URLs for all apps.

### Dependencies
- Task 82: Create Main urls.py Router

### Instructions

1. **Define URL includes**
   - Include tenants, users, core, and modules

2. **Document ordering**
   - Ensure consistent API grouping

### Expected Outcome
- URL includes documented

### Verification Checklist
- [ ] Includes documented
- [ ] Ordering noted

---

## Task 84: Create API Router

### Overview
Create API v1 router.

### Dependencies
- Task 83: Include All App URLs

### Instructions

1. **Define API namespace**
   - Use /api/v1/

2. **Document usage**
   - Note versioning policy

### Expected Outcome
- API router documented

### Verification Checklist
- [ ] Router documented
- [ ] Versioning noted

---

## Summary

### Tasks Completed in This Document

| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 79 | Create integrations App | App documented |
| 80 | Create integrations Structure | Structure documented |
| 81 | Register integrations in Settings | Registration documented |
| 82 | Create Main urls.py Router | Router documented |
| 83 | Include All App URLs | Includes documented |
| 84 | Create API Router | API router documented |

### Next Steps
- Continue with [02_Tasks-85-89_Settings-Migrations-Verify.md](02_Tasks-85-89_Settings-Migrations-Verify.md)

---

## Notes for AI Agents

1. **Execution Order:** Complete tasks 79 through 84 in sequence
2. **Routing:** Maintain /api/v1/ namespace
3. **No Code Snippets:** Avoid fenced code blocks in documentation
