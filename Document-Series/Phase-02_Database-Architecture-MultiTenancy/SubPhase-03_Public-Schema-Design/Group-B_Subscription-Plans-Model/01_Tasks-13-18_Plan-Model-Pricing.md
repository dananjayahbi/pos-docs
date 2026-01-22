# Tasks 13-18: Plan Model & Pricing

> **Phase:** 02 - Database Architecture & Multi-Tenancy  
> **SubPhase:** 03 - Public Schema Design  
> **Group:** B - Subscription Plans Model  
> **Document:** 01 of 03  
> **Tasks Covered:** 13, 14, 15, 16, 17, 18

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Group:** [../Group-A_Public-Schema-Planning/](../Group-A_Public-Schema-Planning/)
- **→ Next Document:** [02_Tasks-19-24_Plan-Limits-Status.md](02_Tasks-19-24_Plan-Limits-Status.md)

---

## Document Overview

This document defines the subscription plan model and pricing fields.

### Tasks in This Document

| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 13 | Create subscription model file | Medium |
| 14 | Add plan identity fields | Medium |
| 15 | Add pricing fields in LKR | Medium |
| 16 | Add billing cycle fields | Medium |
| 17 | Add plan slug and ordering | Medium |
| 18 | Validate pricing model | Medium |

---

## Task 13: Create subscription model file

### Overview
Create the subscription model module for public schema.

### Dependencies
- Group A completed

### Instructions

1. **Create `models/subscription.py`**
   - Place subscription model in platform app

2. **Document purpose**
   - Note this model defines SaaS plans

### Expected Outcome
- Subscription model file created

### Verification Checklist
- [ ] subscription model file exists
- [ ] Purpose documented

---

## Task 14: Add plan identity fields

### Overview
Add plan name, description, and visibility fields.

### Dependencies
- Task 13: Create subscription model file

### Instructions

1. **Add identity fields**
   - Include name, description, and is_active

2. **Document usage**
   - Note how plans are displayed to tenants

### Expected Outcome
- Plan identity fields defined

### Verification Checklist
- [ ] Identity fields defined
- [ ] Usage documented

---

## Task 15: Add pricing fields in LKR

### Overview
Add pricing fields using Decimal for LKR (₨).

### Dependencies
- Task 14: Add plan identity fields

### Instructions

1. **Add pricing fields**
   - Use Decimal fields for LKR pricing

2. **Document currency**
   - Note LKR as the billing currency

### Expected Outcome
- Pricing fields defined using Decimal

### Verification Checklist
- [ ] Pricing fields defined
- [ ] Currency documented as LKR

---

## Task 16: Add billing cycle fields

### Overview
Add billing cycle and interval fields.

### Dependencies
- Task 15: Add pricing fields in LKR

### Instructions

1. **Add cycle fields**
   - Include monthly/annual cycle fields

2. **Document usage**
   - Explain how billing cycles are used

### Expected Outcome
- Billing cycle fields defined

### Verification Checklist
- [ ] Billing cycle fields defined
- [ ] Usage documented

---

## Task 17: Add plan slug and ordering

### Overview
Add slug and display ordering for plans.

### Dependencies
- Task 16: Add billing cycle fields

### Instructions

1. **Add slug field**
   - Use auto-generated slug

2. **Add ordering field**
   - Define display order for plans

### Expected Outcome
- Slug and ordering fields defined

### Verification Checklist
- [ ] Slug field defined
- [ ] Ordering field defined

---

## Task 18: Validate pricing model

### Overview
Validate pricing model fields and constraints.

### Dependencies
- Task 17: Add plan slug and ordering

### Instructions

1. **Review pricing fields**
   - Ensure values are non-negative

2. **Record validation**
   - Capture verification outcome

### Expected Outcome
- Pricing model validated

### Verification Checklist
- [ ] Pricing model validated
- [ ] Validation record documented

---

## Summary

### Tasks Completed in This Document

| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 13 | Create subscription model file | Subscription model file created |
| 14 | Add plan identity fields | Identity fields defined |
| 15 | Add pricing fields in LKR | Pricing fields defined |
| 16 | Add billing cycle fields | Billing cycle fields defined |
| 17 | Add plan slug and ordering | Slug/ordering fields defined |
| 18 | Validate pricing model | Pricing model validated |

### Next Steps
- Continue with [02_Tasks-19-24_Plan-Limits-Status.md](02_Tasks-19-24_Plan-Limits-Status.md)

---

## Notes for AI Agents

1. **Execution Order:** Complete tasks 13 through 18 in sequence
2. **Currency:** Use LKR (₨) for pricing
3. **No Code Snippets:** Avoid fenced code blocks in documentation
