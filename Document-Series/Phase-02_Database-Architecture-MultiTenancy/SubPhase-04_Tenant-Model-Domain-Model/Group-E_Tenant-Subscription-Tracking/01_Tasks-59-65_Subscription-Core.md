# Tasks 59-65: Subscription Core

> **Phase:** 02 - Database Architecture & Multi-Tenancy  
> **SubPhase:** 04 - Tenant Model & Domain Model  
> **Group:** E - Tenant Subscription Tracking  
> **Document:** 01 of 02  
> **Tasks Covered:** 59, 60, 61, 62, 63, 64, 65

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Group:** [../Group-D_Tenant-Settings-Model/00_GROUP_OVERVIEW.md](../Group-D_Tenant-Settings-Model/00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-66-72_Billing-Manager.md](02_Tasks-66-72_Billing-Manager.md)

---

## Document Overview

This document defines the TenantSubscription model and the core subscription fields.

### Tasks in This Document

| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 59 | Create TenantSubscription Model | Medium |
| 60 | Add Tenant FK | Simple |
| 61 | Add Plan FK | Simple |
| 62 | Add Status Field | Simple |
| 63 | Add Billing Cycle Field | Simple |
| 64 | Add Started At Field | Simple |
| 65 | Add Expires At Field | Simple |

---

## Task 59: Create TenantSubscription Model

### Overview
Create the model used for tracking tenant subscription state and billing.

### Dependencies
- Task 16: Manager/Queryset setup for Tenant model

### Instructions

1. **Define TenantSubscription model**
   - Capture subscription and billing lifecycle needs

2. **Document currency**
   - Confirm amounts are stored in LKR (₨)

### Expected Outcome
- TenantSubscription model documented

### Verification Checklist
- [ ] Model documented
- [ ] Currency noted as LKR

---

## Task 60: Add Tenant FK

### Overview
Link subscription records to tenants.

### Dependencies
- Task 59: Create TenantSubscription Model

### Instructions

1. **Add Tenant foreign key**
   - Ensure many subscriptions can map to a tenant if required

2. **Document relationship**
   - Note how tenant lookup is performed

### Expected Outcome
- Tenant FK documented

### Verification Checklist
- [ ] Tenant FK documented
- [ ] Relationship noted

---

## Task 61: Add Plan FK

### Overview
Link subscriptions to platform subscription plans.

### Dependencies
- Task 59: Create TenantSubscription Model

### Instructions

1. **Add Plan foreign key**
   - Reference SubscriptionPlan in platform app

2. **Document usage**
   - Note plan selection and upgrades

### Expected Outcome
- Plan FK documented

### Verification Checklist
- [ ] Plan FK documented
- [ ] Usage documented

---

## Task 62: Add Status Field

### Overview
Track subscription status across lifecycle states.

### Dependencies
- Task 59: Create TenantSubscription Model

### Instructions

1. **Add status field**
   - Include trial, active, expired, cancelled, suspended

2. **Document transitions**
   - Note key state change triggers

### Expected Outcome
- Status field documented

### Verification Checklist
- [ ] Status field documented
- [ ] Transitions noted

---

## Task 63: Add Billing Cycle Field

### Overview
Capture monthly or annual billing cycles.

### Dependencies
- Task 59: Create TenantSubscription Model

### Instructions

1. **Add billing cycle field**
   - Include monthly and annual options

2. **Document billing rules**
   - Note discount expectations for annual cycle

### Expected Outcome
- Billing cycle documented

### Verification Checklist
- [ ] Billing cycle documented
- [ ] Rules noted

---

## Task 64: Add Started At Field

### Overview
Store when a subscription started.

### Dependencies
- Task 59: Create TenantSubscription Model

### Instructions

1. **Add started at field**
   - Capture activation timestamp

2. **Document usage**
   - Note how start date is set

### Expected Outcome
- Started at field documented

### Verification Checklist
- [ ] Started at field documented
- [ ] Usage noted

---

## Task 65: Add Expires At Field

### Overview
Store when a subscription expires.

### Dependencies
- Task 59: Create TenantSubscription Model

### Instructions

1. **Add expires at field**
   - Capture end of paid period

2. **Document usage**
   - Note how expiration is computed

### Expected Outcome
- Expires at field documented

### Verification Checklist
- [ ] Expires at field documented
- [ ] Usage noted

---

## Summary

### Tasks Completed in This Document

| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 59 | Create TenantSubscription Model | Model documented |
| 60 | Add Tenant FK | Tenant FK documented |
| 61 | Add Plan FK | Plan FK documented |
| 62 | Add Status Field | Status field documented |
| 63 | Add Billing Cycle Field | Billing cycle documented |
| 64 | Add Started At Field | Started at field documented |
| 65 | Add Expires At Field | Expires at field documented |

### Next Steps
- Continue with [02_Tasks-66-72_Billing-Manager.md](02_Tasks-66-72_Billing-Manager.md)

---

## Notes for AI Agents

1. **Execution Order:** Complete tasks 59 through 65 in sequence
2. **Status:** Use the defined lifecycle statuses
3. **No Code Snippets:** Avoid fenced code blocks in documentation
