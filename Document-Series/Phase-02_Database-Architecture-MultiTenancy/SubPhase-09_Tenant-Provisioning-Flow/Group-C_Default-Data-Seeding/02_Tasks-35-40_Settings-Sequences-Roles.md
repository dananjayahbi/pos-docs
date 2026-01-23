# Tasks 35-40: Settings, Sequences & Roles

> **Phase:** 02 - Database Architecture & Multi-Tenancy  
> **SubPhase:** 09 - Tenant Provisioning Flow  
> **Group:** C - Default Data Seeding  
> **Document:** 02 of 03  
> **Tasks Covered:** 35, 36, 37, 38, 39, 40

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-29-34_Service-Categories-Tax.md](01_Tasks-29-34_Service-Categories-Tax.md)
- **→ Next Document:** [03_Tasks-41-44_Industry-Verify-Docs.md](03_Tasks-41-44_Industry-Verify-Docs.md)

---

## Document Overview

This document covers default tenant settings, invoice and order sequences, default roles, sample location, and loading industry templates.

### Tasks in This Document

| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 35 | Create Default Tenant Settings | Medium |
| 36 | Create Invoice Number Sequence | Simple |
| 37 | Create Order Number Sequence | Simple |
| 38 | Create Default Roles | Medium |
| 39 | Create Sample Location | Simple |
| 40 | Load Industry Templates | Medium |

---

## Task 35: Create Default Tenant Settings

### Overview
Define default settings for new tenants.

### Dependencies
- Task 30: Define Seeding Interface

### Instructions

1. **Define tenant settings**
   - Include currency, timezone, and language preferences

2. **Document defaults**
   - Use LKR and Asia/Colombo

### Expected Outcome
- Default settings documented

### Verification Checklist
- [ ] Settings documented
- [ ] Sri Lanka defaults noted

---

## Task 36: Create Invoice Number Sequence

### Overview
Set up invoice numbering sequence.

### Dependencies
- Task 30: Define Seeding Interface

### Instructions

1. **Define invoice sequence**
   - Start numbering at 1001

2. **Document formatting**
   - Note prefix and padding rules

### Expected Outcome
- Invoice sequence documented

### Verification Checklist
- [ ] Sequence documented
- [ ] Formatting noted

---

## Task 37: Create Order Number Sequence

### Overview
Set up order numbering sequence.

### Dependencies
- Task 30: Define Seeding Interface

### Instructions

1. **Define order sequence**
   - Start numbering at 1001

2. **Document formatting**
   - Note prefix and padding rules

### Expected Outcome
- Order sequence documented

### Verification Checklist
- [ ] Sequence documented
- [ ] Formatting noted

---

## Task 38: Create Default Roles

### Overview
Define default roles for tenant users.

### Dependencies
- Task 30: Define Seeding Interface

### Instructions

1. **Define core roles**
   - Admin, Manager, Cashier, Inventory

2. **Document permission scope**
   - Note high-level access boundaries

### Expected Outcome
- Default roles documented

### Verification Checklist
- [ ] Roles documented
- [ ] Permission scope noted

---

## Task 39: Create Sample Location

### Overview
Create a sample store location.

### Dependencies
- Task 38: Create Default Roles

### Instructions

1. **Define sample location**
   - Include address format for Sri Lanka

2. **Document usage**
   - Note that it can be replaced later

### Expected Outcome
- Sample location documented

### Verification Checklist
- [ ] Sample location documented
- [ ] Usage noted

---

## Task 40: Load Industry Templates

### Overview
Load industry-specific templates.

### Dependencies
- Task 39: Create Sample Location

### Instructions

1. **Load templates**
   - Prepare retail and restaurant templates

2. **Document template selection**
   - Note how a tenant chooses a template

### Expected Outcome
- Industry template loading documented

### Verification Checklist
- [ ] Template loading documented
- [ ] Selection noted

---

## Summary

### Tasks Completed in This Document

| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 35 | Create Default Tenant Settings | Settings documented |
| 36 | Create Invoice Number Sequence | Invoice sequence documented |
| 37 | Create Order Number Sequence | Order sequence documented |
| 38 | Create Default Roles | Roles documented |
| 39 | Create Sample Location | Sample location documented |
| 40 | Load Industry Templates | Templates loading documented |

### Next Steps
- Continue with [03_Tasks-41-44_Industry-Verify-Docs.md](03_Tasks-41-44_Industry-Verify-Docs.md)

---

## Notes for AI Agents

1. **Execution Order:** Complete tasks 35 through 40 in sequence
2. **Sri Lanka:** Use LKR and Asia/Colombo
3. **No Code Snippets:** Avoid fenced code blocks in documentation
