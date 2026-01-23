# Tasks 66-72: Billing & Manager

> **Phase:** 02 - Database Architecture & Multi-Tenancy  
> **SubPhase:** 04 - Tenant Model & Domain Model  
> **Group:** E - Tenant Subscription Tracking  
> **Document:** 02 of 02  
> **Tasks Covered:** 66, 67, 68, 69, 70, 71, 72

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-59-65_Subscription-Core.md](01_Tasks-59-65_Subscription-Core.md)
- **→ Next Group:** [../Group-F_Admin-Management/00_GROUP_OVERVIEW.md](../Group-F_Admin-Management/00_GROUP_OVERVIEW.md)

---

## Document Overview

This document adds billing fields and manager/queryset behavior for subscriptions.

### Tasks in This Document

| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 66 | Add Trial Ends At Field | Simple |
| 67 | Add Next Billing Date | Simple |
| 68 | Add Amount Field | Simple |
| 69 | Add Payment Method | Simple |
| 70 | Add Is Auto Renew Field | Simple |
| 71 | Create Subscription Manager | Medium |
| 72 | Add Active/Expired Querysets | Simple |

---

## Task 66: Add Trial Ends At Field

### Overview
Track the end of the trial period.

### Dependencies
- Task 59: Create TenantSubscription Model

### Instructions

1. **Add trial ends field**
   - Base defaults on PlatformSettings

2. **Document usage**
   - Note how trial end is calculated

### Expected Outcome
- Trial ends field documented

### Verification Checklist
- [ ] Trial ends documented
- [ ] Usage noted

---

## Task 67: Add Next Billing Date

### Overview
Track the next billing date for recurring subscriptions.

### Dependencies
- Task 59: Create TenantSubscription Model

### Instructions

1. **Add next billing date field**
   - Capture upcoming charge date

2. **Document usage**
   - Note how date is updated

### Expected Outcome
- Next billing date documented

### Verification Checklist
- [ ] Next billing date documented
- [ ] Usage noted

---

## Task 68: Add Amount Field

### Overview
Track the current billing amount.

### Dependencies
- Task 59: Create TenantSubscription Model

### Instructions

1. **Add amount field**
   - Store amounts in LKR (₨)

2. **Document usage**
   - Note how amounts are derived from plan

### Expected Outcome
- Amount field documented

### Verification Checklist
- [ ] Amount documented
- [ ] Currency noted as LKR

---

## Task 69: Add Payment Method

### Overview
Track the current payment method.

### Dependencies
- Task 59: Create TenantSubscription Model

### Instructions

1. **Add payment method field**
   - Define allowed payment method options

2. **Document usage**
   - Note where payment method is set

### Expected Outcome
- Payment method documented

### Verification Checklist
- [ ] Payment method documented
- [ ] Usage noted

---

## Task 70: Add Is Auto Renew Field

### Overview
Track whether a subscription auto-renews.

### Dependencies
- Task 59: Create TenantSubscription Model

### Instructions

1. **Add auto renew field**
   - Document default behavior

2. **Document usage**
   - Note how renewal is handled

### Expected Outcome
- Auto renew field documented

### Verification Checklist
- [ ] Auto renew documented
- [ ] Usage noted

---

## Task 71: Create Subscription Manager

### Overview
Provide a custom manager for subscription queries.

### Dependencies
- Task 59: Create TenantSubscription Model

### Instructions

1. **Define manager behavior**
   - Include helpers like active or trial

2. **Document usage**
   - Note key helper methods

### Expected Outcome
- Subscription manager documented

### Verification Checklist
- [ ] Manager documented
- [ ] Helpers noted

---

## Task 72: Add Active/Expired Querysets

### Overview
Provide querysets for active and expired subscriptions.

### Dependencies
- Task 71: Create Subscription Manager

### Instructions

1. **Define active/expired querysets**
   - Use status and date logic

2. **Document usage**
   - Note consumer services

### Expected Outcome
- Querysets documented

### Verification Checklist
- [ ] Querysets documented
- [ ] Usage noted

---

## Summary

### Tasks Completed in This Document

| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 66 | Add Trial Ends At Field | Trial ends documented |
| 67 | Add Next Billing Date | Next billing date documented |
| 68 | Add Amount Field | Amount documented |
| 69 | Add Payment Method | Payment method documented |
| 70 | Add Is Auto Renew Field | Auto renew documented |
| 71 | Create Subscription Manager | Manager documented |
| 72 | Add Active/Expired Querysets | Querysets documented |

### Next Steps
- Proceed to [Group-F_Admin-Management](../Group-F_Admin-Management/00_GROUP_OVERVIEW.md)

---

## Notes for AI Agents

1. **Execution Order:** Complete tasks 66 through 72 in sequence
2. **Currency:** Use LKR for amounts
3. **No Code Snippets:** Avoid fenced code blocks in documentation
